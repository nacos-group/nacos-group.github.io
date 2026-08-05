---
title: Client API
keywords: [ Open API, Manual ]
description: Open API Manual
sidebar:
  order: 7
---

# Client API

:::note
Nacos 3.X is no longer compatible with the OpenAPI of Nacos 1.X or the HTTP OpenAPI of Nacos 2.X. Please migrate to the OpenAPI of Nacos 3.X.

The HTTP OpenAPI in Nacos 3.X is **mainly intended for clients written in programming languages that do not support gRPC**. It provides configuration retrieval, service registration, and service discovery capabilities for `regular applications`, `microservice applications`, and other `non-control-plane` or `non-gateway` applications.

These APIs only provide data operations at the single-service or single-configuration level, such as reading or updating an individual service or configuration item. They do not support range-based aggregate operations, such as querying all services or all configurations.

For `control-plane` or `gateway` applications that require range-based data operations, use the [Admin API](../admin/admin-api.md).
:::

> For how to obtain and configure access credentials when using the default auth plugin, see [Configure Access Credentials](./auth.mdx).

## 0. Client API Notes

### 0.1. Scope

Client APIs are intended for application runtime access and custom clients. Callers usually already know the `namespaceId`, `groupName`, `dataId`, `serviceName`, or instance information they need to access.

| Good Fit | Not a Good Fit |
| --- | --- |
| Querying a single known configuration. | Publishing, deleting, importing, or exporting configurations. |
| Registering, deregistering, querying, and discovering known services or instances. | Querying full configuration lists, full service lists, subscriber lists, or other range-based data. |
| Using HTTP for a small amount of runtime access when no suitable SDK is available. | Building release platforms, operations platforms, gateway control planes, or audit tools. |

Business applications should prefer [SDKs](./overview/other-language.md). For range-based management capabilities, use [Admin API](../admin/admin-api.md) or [Maintainer SDK](../admin/maintainer-sdk.md).

### 0.2. Unified Path Format

Nacos client APIs use a unified path format: `[/$nacos.server.contextPath]/v3/client/[module]/[subPath]...`.

- `$nacos.server.contextPath`: Root path of the client APIs. The default value is `/nacos`, and it can be changed with the `nacos.server.contextPath` configuration item.
- `module`: Client API module name, such as `server`, `cs`, `ns`, or `core`.
- `subPath`: Client API subpath, such as `state`, `namespace`, or `config`. It may contain multiple path levels.

The client APIs listed below use the default `$nacos.server.contextPath`. If the deployment changes `$nacos.server.contextPath`, update the request URL accordingly when calling the API.

The examples below also use the default Nacos Web Server port. If the deployment changes `$nacos.server.main.port`, update the request URL accordingly when calling the API.

### 0.3. Swagger Documentation

Nacos 3.X client OpenAPI also provides Swagger-style documentation. You can view it at [Nacos Swagger HTTP Client API](/swagger/client/).

## 1. Configuration Management

:::note
The HTTP OpenAPI in Nacos 3.X does not provide APIs for publishing or deleting configurations. `Regular applications`, `microservice applications`, and other `non-control-plane` or `non-gateway` applications should consume configurations rather than publish them. To publish or delete configurations, use the [Admin API](../admin/admin-api.md).

In addition, Nacos 3.X will remove long-polling based configuration listening and keep configuration listening over long-lived connections only. Therefore, the HTTP OpenAPI in Nacos 3.X does not provide configuration listening APIs. You can poll `Get Configuration` and compare the `md5` value to determine whether the configuration needs to be updated.
:::

### 1.1. Get Configuration

#### Description

Get the specified configuration.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Request URL

`/nacos/v3/client/cs/config`

#### Request Headers

| Name              | Type     | Required | Description                                                        |
|------------------|----------|------|-------------------------------------------------------------|
| `User-Agent`     | `string` | No    | User agent. It is empty by default and is usually `Nacos-${program-language}-Client:v${version}`. |
| `Client-Version` | `string` | No    | Client version. It is empty by default and is usually `Nacos-${program-language}-Client:v${version}`. |

#### Request Parameters

| Name           | Type       | Required    | Description                     |
|---------------|----------|-------|--------------------------|
| `namespaceId` | `string` | No     | Namespace. Defaults to `public`, which is equivalent to `''`. |
| `groupName`   | `string` | **Yes** | Configuration group name. |
| `dataId`      | `string` | **Yes** | Configuration name. |

#### Response Data

The response body follows the [Nacos OpenAPI common response format](overview/api-overview.md#32-http-api-response-format). The following table describes only the fields in `data`.

| Name                | Type      | Description                       |
|--------------------|-----------|--------------------------|
| `content`          | `string` | Configuration content. |
| `encryptedDataKey` | `string` | Encryption/decryption key of the configuration. This value exists only when a configuration encryption plugin is used. |
| `contentType`      | `string` | Configuration type, such as `TEXT` or `JSON`. |
| `md5`              | `string` | MD5 value of the configuration. |
| `lastModified`     | `integer` | Last modification time of the configuration. |
| `beta`             | `boolean` | Whether the configuration has a beta configuration. |

Other fields are reserved and currently unused. You can ignore them.

#### Examples

* Request example

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/client/cs/config?dataId=test&groupName=test' 
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "resultCode": 200,
    "errorCode": 0,
    "message": null,
    "requestId": null,
    "content": "test",
    "encryptedDataKey": null,
    "contentType": "text",
    "md5": "098f6bcd4621d373cade4e832627b4f6",
    "lastModified": 1743151634823,
    "tag": null,
    "beta": false,
    "success": true
  }
}
```

## 2. Service Discovery

:::note
The HTTP OpenAPI in Nacos 3.X does not provide APIs such as querying the full service list. `Regular applications`, `microservice applications`, and other `non-control-plane` or `non-gateway` applications should only need to register themselves as instances of a service, deregister themselves from a service, or get the instance list of a known downstream service for business calls. They should not retrieve all services in the registry.

To get the full service list, use the [Admin API](../admin/admin-api.md).
:::

### 2.1. Register/Renew Instance

#### Description

Register or renew an instance.

:::note
When an instance registered through the HTTP OpenAPI is an **ephemeral instance**, it must be renewed periodically. In the HTTP OpenAPI of Nacos 3.X, the renewal API and registration API are merged and distinguished by the `heartBeat` parameter.

For renewal requests, Nacos does not parse metadata and related fields in the request. In other words, renewal requests ignore the `healthy`, `weight`, `enabled`, and `metadata` fields.
If a renewal request returns error code `21003`, the instance has expired and been removed. The client should re-register the instance with complete information and set `heartBeat=false`, then continue renewal requests after registration succeeds.

Calling the registration request repeatedly can also renew the instance, but it renews by updating the instance and consumes more resources. Therefore, after registration succeeds, use renewal instead of repeated registration updates.
:::

#### Since

`3.0.0`

#### Request Method

`POST`

#### Request URL

`/nacos/v3/client/ns/instance`

#### Request Headers

| Name              | Type     | Required | Description                                                        |
|------------------|----------|------|-------------------------------------------------------------|
| `User-Agent`     | `string` | No    | User agent. It is empty by default and is usually `Nacos-${program-language}-Client:v${version}`. |
| `Client-Version` | `string` | No    | Client version. It is empty by default and is usually `Nacos-${program-language}-Client:v${version}`. |

#### Request Parameters

| Name           | Type           | Required  | Description                   |
|---------------|----------------|-------|------------------------|
| `namespaceId` | `string` | No     | Namespace ID. Defaults to `public`. |
| `groupName`   | `string` | No     | Group name. Defaults to `DEFAULT_GROUP`. |
| `serviceName` | `string` | **Yes** | Service name. |
| `ip`          | `string` | **Yes** | IP address. |
| `port`        | `integer` | **Yes** | Port. |
| `clusterName` | `string` | No     | Cluster name. Defaults to `DEFAULT`. |
| `healthy`     | `boolean` | No     | Whether the instance is healthy. Defaults to `true`. |
| `weight`      | `number` | No     | Instance weight. Defaults to `1.0`. |
| `enabled`     | `boolean` | No     | Whether the instance is enabled. Defaults to `true`. |
| `metadata`    | `string` | No     | Instance metadata as a JSON object string. |
| `heartBeat`   | `boolean` | No     | Whether this is a renewal request. Defaults to `false`. |
| `ephemeral`   | `boolean` | No     | Whether the instance is ephemeral. |

#### Response Data

The response body follows the [Nacos OpenAPI common response format](overview/api-overview.md#32-http-api-response-format). The following table describes only the fields in `data`.

| Name    | Type     | Description                             |
|--------|----------|--------------------------------|
| `data` | `string` | Whether registration or renewal succeeded. Returns `ok` on success, or the failure reason on failure. |

#### Examples

* Request example

```shell
# Register instance
curl -X POST "127.0.0.1:8848/nacos/v3/client/ns/instance" -d "serviceName=test1&ip=127.0.0.1&port=3306&ephemeral=true"

# Renew instance
curl -X POST "127.0.0.1:8848/nacos/v3/client/ns/instance" -d "serviceName=test1&ip=127.0.0.1&port=3306&heartBeat=true&ephemeral=true"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.2. Deregister Instance

#### Description

Deregister the specified instance.

#### Since

`3.0.0`

#### Request Method

`DELETE`

#### Request URL

`/nacos/v3/client/ns/instance`

#### Request Headers

| Name              | Type     | Required | Description                                                        |
|------------------|----------|------|-------------------------------------------------------------|
| `User-Agent`     | `string` | No    | User agent. It is empty by default and is usually `Nacos-${program-language}-Client:v${version}`. |
| `Client-Version` | `string` | No    | Client version. It is empty by default and is usually `Nacos-${program-language}-Client:v${version}`. |

#### Request Parameters

| Name           | Type      | Required    | Description                   |
|---------------|-----------|-------|------------------------|
| `namespaceId` | `string` | No     | Namespace ID. Defaults to `public`. |
| `groupName`   | `string` | No     | Group name. Defaults to `DEFAULT_GROUP`. |
| `serviceName` | `string` | **Yes** | Service name. |
| `ip`          | `string` | **Yes** | IP address. |
| `port`        | `integer` | **Yes** | Port. |
| `clusterName` | `string` | No     | Cluster name. Defaults to `DEFAULT`. |
| `ephemeral`   | `boolean` | No     | Whether the instance is ephemeral. |

#### Response Data

The response body follows the [Nacos OpenAPI common response format](overview/api-overview.md#32-http-api-response-format). The following table describes only the fields in `data`.

| Name    | Type     | Description                          |
|--------|----------|-----------------------------|
| `data` | `string` | Whether deregistration succeeded. Returns `ok` on success, or the failure reason on failure. |

#### Examples

* Request example

```shell
curl -X DELETE "127.0.0.1:8848/nacos/v3/client/ns/instance?serviceName=test1&ip=127.0.0.1&port=3306&ephemeral=true"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.3. List Instances of a Service

#### Description

Query the detailed instance list under the specified service.

:::note
Because Nacos 3.X will remove UDP-based push support, clients that do not support gRPC long-lived push connections need to periodically pull the instance list so that they can detect instance changes in time and implement service subscription.
:::

#### Since

`3.0.0`

#### Request Method

`GET`

#### Request URL

`/nacos/v3/client/ns/instance/list`

#### Request Headers

| Name              | Type     | Required | Description                                                        |
|------------------|----------|------|-------------------------------------------------------------|
| `User-Agent`     | `string` | No    | User agent. It is empty by default and is usually `Nacos-${program-language}-Client:v${version}`. |
| `Client-Version` | `string` | No    | Client version. It is empty by default and is usually `Nacos-${program-language}-Client:v${version}`. |

#### Request Parameters

| Name           | Type      | Required  | Description                    |
|---------------|-----------|-------|-------------------------|
| `namespaceId` | `string` | No     | Namespace ID. Defaults to `public`. |
| `groupName`   | `string` | No     | Group name. Defaults to `DEFAULT_GROUP`. |
| `serviceName` | `string` | **Yes** | Service name. |
| `clusterName` | `string` | No     | Cluster name. If not provided, instances of all clusters will be returned.       |

#### Response Data

The response body follows the [Nacos OpenAPI common response format](overview/api-overview.md#32-http-api-response-format). The following table describes only the fields in `data`.

| Name                                  | Type       | Description      |
|--------------------------------------|------------|-----------|
| `data`                               | `array` | Instance list. |
| `data.[i].ip`                        | `string` | Instance IP. |
| `data.[i].port`                      | `integer` | Instance port. |
| `data.[i].weight`                    | `number` | Instance weight. |
| `data.[i].healthy`                   | `boolean` | Whether the instance is healthy. |
| `data.[i].enabled`                   | `boolean` | Whether the instance is enabled. |
| `data.[i].ephemeral`                 | `boolean` | Whether the instance is ephemeral. |
| `data.[i].clusterName`               | `string` | Cluster name of the instance. |
| `data.[i].serviceName`               | `string` | Service name. |
| `data.[i].metadata`                  | `map<string, string>` | Instance metadata. |
| `data.[i].instanceHeartBeatTimeOut`  | `integer` | Instance heartbeat timeout. |
| `data.[i].ipDeleteTimeout`           | `integer` | Instance deletion timeout. |
| `data.[i].instanceHeartBeatInterval` | `integer` | Instance heartbeat interval. |

#### Examples

* Request example

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/client/ns/instance/list?serviceName=test1'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "ip": "127.0.0.1",
      "port": 3306,
      "weight": 1.0,
      "healthy": true,
      "enabled": true,
      "ephemeral": true,
      "clusterName": "DEFAULT",
      "serviceName": "DEFAULT_GROUP@@test1",
      "metadata": {},
      "ipDeleteTimeout": 30000,
      "instanceIdGenerator": "simple",
      "instanceHeartBeatInterval": 5000,
      "instanceHeartBeatTimeOut": 15000
    }
  ]
}
```

## 3. AI

### 3.1. Query Prompt

#### Description

Query Prompt by version, label, or latest (priority: version > label > latest); supports md5 for 304 conditional response.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Request URL

`/nacos/v3/client/ai/prompt`

#### Request Parameters

| Name           | Type       | Required    | Description                     |
|---------------|----------|-------|--------------------------|
| `namespaceId` | `string` | No     | Namespace ID. Defaults to `public`. |
| `promptKey`   | `string` | **Yes** | Prompt key                  |
| `version`     | `string` | No     | Version (one of version, label, latest)     |
| `label`       | `string` | No     | Label (one of version, label, latest)    |
| `md5`         | `string` | No     | If matches server, response is 304            |

#### Response Data

The response body follows the [Nacos OpenAPI common response format](overview/api-overview.md#32-http-api-response-format). The following table describes only the fields in `data`.

| Name                | Type      | Description           |
|--------------------|-----------|--------------|
| `promptKey`        | `string` | Prompt key    |
| `version`          | `string` | Version       |
| `template`         | `string` | Prompt template content   |
| `md5`              | `string` | Content md5 for 304       |
| `variables`        | `array` | Prompt variable list      |

#### Examples

* Request example

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/client/ai/prompt?promptKey=myPrompt'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "promptKey": "myPrompt",
    "version": "1.0",
    "template": "You are a helpful assistant.",
    "md5": "..."
  }
}
```

### 3.2. Get AgentSpec

#### Description

This interface allows getting an AgentSpec detail by namespace, name, version, or label.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Request URL

`/nacos/v3/client/ai/agentspecs`

#### Request Parameters

| Name           | Type       | Required    | Description                              |
|---------------|----------|-------|-----------------------------------|
| `namespaceId` | `string` | No     | Namespace ID, default is `public` |
| `name`        | `string` | **Yes** | AgentSpec name                    |
| `version`     | `string` | No     | AgentSpec version                 |
| `label`       | `string` | No     | AgentSpec label                   |
| `md5`         | `string` | No     | AgentSpec content MD5 for exact version matching |

#### Response Data

Return body follows [Nacos open API common response format](overview/api-overview.md#32-http-api-response-format); this table describes fields in `data`.

| Name          | Type      | Description                      |
|--------------|-----------|---------------------------|
| `namespaceId` | `string` | Namespace of the AgentSpec |
| `name`        | `string` | AgentSpec name             |
| `description` | `string` | AgentSpec description      |
| `bizTags`     | `string` | AgentSpec business tags    |
| `content`     | `string` | AgentSpec content          |
| `resource`    | `object` | AgentSpec resource info    |

#### Examples

* Request example

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/client/ai/agentspecs?name=my-agent'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 3.3. Search AgentSpecs

#### Description

This interface allows paginated searching of AgentSpecs by namespace and keyword.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Request URL

`/nacos/v3/client/ai/agentspecs/search`

#### Request Parameters

| Name           | Type       | Required    | Description                              |
|---------------|----------|-------|-----------------------------------|
| `namespaceId` | `string` | No     | Namespace ID, default is `public` |
| `keyword`     | `string` | No     | Search keyword                    |
| `pageNo`      | `integer` | **Yes** | Page number, typically starts from `1` |
| `pageSize`    | `integer` | **Yes** | Number of records per page        |

#### Response Data

Return body follows [Nacos open API common response format](overview/api-overview.md#32-http-api-response-format); this table describes fields in `data`.

| Name    | Type     | Description                                              |
|--------|----------|---------------------------------------------------|
| `data` | `string` | AgentSpec search result (paginated object, actual fields depend on runtime response) |

#### Examples

* Request example

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/client/ai/agentspecs/search?keyword=agent&pageNo=1&pageSize=10'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 3.4. Download Skill

#### Description

This interface allows downloading a Skill ZIP file by namespace, name, version, or label.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Request URL

`/nacos/v3/client/ai/skills`

#### Request Parameters

| Name           | Type       | Required    | Description                              |
|---------------|----------|-------|-----------------------------------|
| `namespaceId` | `string` | No     | Namespace ID, default is `public` |
| `name`        | `string` | **Yes** | Skill name                        |
| `version`     | `string` | No     | Skill version                     |
| `label`       | `string` | No     | Skill label                       |
| `md5`         | `string` | No     | Skill content MD5 for exact version matching |

#### Examples

* Request example

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/client/ai/skills?name=my-skill'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

> **Agent Management API note:** The Agent APIs in sections 3.5–3.10 are the recommended integration path going forward and are planned to gradually replace the existing A2A management APIs. New users and SDKs should prioritize compatibility with these Agent Management APIs instead of adding new dependencies on the legacy A2A APIs. Existing A2A integrations can migrate in line with future release and migration guidance. This describes the evolution of the management APIs and does not mean that the A2A protocol itself is deprecated.

### 3.5. Discover Agent

#### Description

Discovers one exact visible Agent version and its currently matching endpoint sets. Supplying `X-Nacos-Client-Id` renews only an already-existing HTTP Client and cannot replace Publisher heartbeat.

#### Since

`3.3.0`

#### Request Method

`GET`

#### Request URL

`/nacos/v3/client/ai/agents`

#### Request Headers

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `X-Nacos-Client-Id` | `string` | No | Optional stable identifier of an existing logical HTTP client. When present, it must contain 1 to 256 characters matching `[A-Za-z0-9._:-]+` and use the same value as the client's endpoint publisher requests. Search and Discover renew only the existing Client lifecycle; they never create an empty Client or renew Publisher liveness, so they cannot replace Publisher heartbeat. |

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `namespaceId` | `string` | No | Namespace of the Agent. Defaults to `public`. |
| `agentName` | `string` | **Yes** | Name of the Agent to discover. |
| `version` | `string` | No | Exact Agent version to discover; mutually exclusive with `label`. |
| `label` | `string` | No | Label used to select an Agent version; mutually exclusive with `version`. |
| `protocol` | `array<string>` | No | Repeatable protocol filter used to match call interfaces. |
| `protocolVersion` | `string` | No | Protocol version used to match call interfaces. |
| `transport` | `array<string>` | No | Repeatable transport filter used to match endpoints. |
| `endpointSource` | `array<string>` | No | Repeatable endpoint-source filter whose values are `RUNTIME` or `DECLARED`. |
| `metadataSelector` | `string` | No | URL-encoded JSON object used to select endpoint metadata. |

When both `version` and `label` are omitted, the response contains the `latest` definition metadata and Runtime Endpoints compatible with any currently online version. Explicit `label=latest` keeps only Runtime Endpoints matching the `latest` version.

#### Response Data

The response body follows the [Nacos OpenAPI common response format](overview/api-overview.md#32-http-api-response-format). The following table describes `data` and its fields.

| Name | Type | Description |
|------|------|-------------|
| `data` | `AgentDiscoveryResult` | Agent discovery result. |
| `data.namespaceId` | `string` | Namespace of the Agent. |
| `data.agentName` | `string` | Agent name. |
| `data.version` | `string` | Agent version selected by this discovery request. |
| `data.contentDigest` | `string` | Digest of the Agent definition content. |
| `data.callInterfaces` | `array<AgentDiscoveryCallInterface>` | Agent call interfaces and their matching endpoint sets. |
| `data.callInterfaces[i].protocol` | `string` | Call interface protocol. |
| `data.callInterfaces[i].protocolVersion` | `string` | Call interface protocol version. |
| `data.callInterfaces[i].descriptorMediaType` | `string` | Media type of the protocol-native descriptor. |
| `data.callInterfaces[i].nativeDescriptor` | `object` | Protocol-native descriptor content. |
| `data.callInterfaces[i].endpointSets` | `array<EndpointSet>` | Endpoint sets grouped by source. |
| `data.callInterfaces[i].endpointSets[i].source` | `string` | Endpoint source: `RUNTIME` or `DECLARED`. |
| `data.callInterfaces[i].endpointSets[i].sourceRevision` | `string` | Revision identifier of the endpoint source. |
| `data.callInterfaces[i].endpointSets[i].endpoints` | `array<AgentDiscoveryEndpoint>` | Endpoints matched from this source. |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].uri` | `string` | Endpoint URI. |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].transport` | `string` | Endpoint transport. |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].priority` | `integer` | Endpoint priority. |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].weight` | `number` | Endpoint weight. |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].metadata` | `map<string, string>` | Endpoint metadata. |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].healthy` | `boolean` | Whether the endpoint is healthy. |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].bindings` | `array<RuntimeVersionBinding>` | Runtime version bindings of the endpoint. |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].bindings[i].runtimeVersion` | `string` | Publisher runtime version. |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].bindings[i].versionRange` | `string` | Agent version range supported by the runtime. |

#### Examples

* Request example

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/client/ai/agents?namespaceId=public&agentName=my-agent&version=1.0.0&protocol=a2a' \
  -H 'X-Nacos-Client-Id: 550e8400-e29b-41d4-a716-446655440000'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "namespaceId": "public",
    "agentName": "my-agent",
    "version": "1.0.0",
    "contentDigest": "sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    "callInterfaces": [
      {
        "protocol": "a2a",
        "protocolVersion": "1.0",
        "descriptorMediaType": "application/json",
        "nativeDescriptor": {
          "name": "my-agent",
          "version": "1.0.0",
          "description": "Example Agent",
          "protocolVersion": "1.0",
          "supportedInterfaces": [
            {
              "url": "https://example.com/my-agent/jsonrpc",
              "protocolBinding": "JSONRPC",
              "protocolVersion": "1.0",
              "transport": "JSONRPC"
            }
          ],
          "capabilities": {
            "streaming": true,
            "extendedAgentCard": true
          }
        },
        "endpointSets": [
          {
            "source": "RUNTIME",
            "sourceRevision": "1",
            "endpoints": [
              {
                "uri": "http://127.0.0.1:8081/a2a",
                "transport": "HTTP+JSON",
                "priority": 0,
                "weight": 1.0,
                "metadata": {},
                "healthy": true,
                "bindings": [
                  {
                    "runtimeVersion": "1.0.0",
                    "versionRange": "[1.0.0]"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### 3.6. Publish Agent Definition

#### Description

Publishes one exact Agent version from application code, optionally submitting it for review.

#### Since

`3.3.0`

#### Request Method

`POST`

Request parameters are encoded as an `application/x-www-form-urlencoded` form.

#### Request URL

`/nacos/v3/client/ai/agents`

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `namespaceId` | `string` | No | Namespace of the Agent. Defaults to `public`. |
| `agentName` | `string` | **Yes** | Name of the Agent to publish. |
| `version` | `string` | **Yes** | Agent version to publish. |
| `displayName` | `string` | No | Agent display name. |
| `description` | `string` | No | Agent description. |
| `iconUrl` | `string` | No | Agent icon URL. |
| `provider` | `string` | No | Agent provider as a JSON object string. |
| `tags` | `string` | No | Agent tags as a JSON array string. |
| `extensions` | `string` | No | Agent extensions as a JSON object string. |
| `callInterfaces` | `string` | No | Direct call-interface content as a JSON array string; use either this field or `basedOnVersion`. This field is required when creating an Agent. |
| `author` | `string` | No | Author of the Agent version. |
| `changeDescription` | `string` | No | Description of the changes in this version. |
| `basedOnVersion` | `string` | No | Exact Agent version whose content is copied; use either this field or `callInterfaces`. It cannot be used when creating an Agent. |
| `autoSubmit` | `boolean` | No | Whether to run the ordinary submit flow after creating the draft. Defaults to `false`; this is not force-publish. |

#### Response Data

The response body follows the [Nacos OpenAPI common response format](overview/api-overview.md#32-http-api-response-format). The following table describes `data` and its fields.

| Name | Type | Description |
|------|------|-------------|
| `data` | `AgentVersionDetail` | Details of the published Agent version. |
| `data.namespaceId` | `string` | Namespace of the Agent. |
| `data.agentName` | `string` | Agent name. |
| `data.version` | `string` | Agent version. |
| `data.status` | `string` | Agent version status. |
| `data.callInterfaces` | `array<AgentCallInterface>` | Agent call interface definitions. |
| `data.callInterfaces[i].protocol` | `string` | Call interface protocol. |
| `data.callInterfaces[i].protocolVersion` | `string` | Call interface protocol version. |
| `data.callInterfaces[i].descriptorMediaType` | `string` | Media type of the protocol-native descriptor. |
| `data.callInterfaces[i].nativeDescriptor` | `object` | Protocol-native descriptor content. |
| `data.callInterfaces[i].endpointSourceOrder` | `array<string>` | Order in which endpoint sources are queried. |
| `data.callInterfaces[i].declaredEndpoints` | `array<Endpoint>` | Endpoints declared in the Agent definition. |
| `data.callInterfaces[i].declaredEndpoints[i].uri` | `string` | Endpoint URI. |
| `data.callInterfaces[i].declaredEndpoints[i].transport` | `string` | Endpoint transport. |
| `data.callInterfaces[i].declaredEndpoints[i].priority` | `integer` | Endpoint priority. |
| `data.callInterfaces[i].declaredEndpoints[i].weight` | `number` | Endpoint weight. |
| `data.callInterfaces[i].declaredEndpoints[i].metadata` | `map<string, string>` | Endpoint metadata. |
| `data.callInterfaces[i].declaredEndpoints[i].healthy` | `boolean` | Whether the endpoint is healthy. |
| `data.author` | `string` | Author of the Agent version. |
| `data.changeDescription` | `string` | Description of the Agent version changes. |
| `data.contentDigest` | `string` | Digest of the Agent definition content. |
| `data.createTime` | `integer` | Creation time. |
| `data.updateTime` | `integer` | Last update time. |

#### Examples

* Request example

```shell
curl -X POST '127.0.0.1:8848/nacos/v3/client/ai/agents' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'namespaceId=public' \
  -d 'agentName=my-agent' \
  -d 'version=1.0.0' \
  --data-urlencode 'callInterfaces=[{"protocol":"a2a","protocolVersion":"1.0","descriptorMediaType":"application/json","nativeDescriptor":{"name":"my-agent","version":"1.0.0","description":"Example Agent","protocolVersion":"1.0","supportedInterfaces":[{"url":"https://example.com/my-agent/jsonrpc","protocolBinding":"JSONRPC","protocolVersion":"1.0","transport":"JSONRPC"}],"capabilities":{"streaming":true,"extendedAgentCard":true}},"endpointSourceOrder":["DECLARED","RUNTIME"],"declaredEndpoints":[{"uri":"https://example.com/my-agent/jsonrpc","transport":"JSONRPC"}]}]' \
  -d 'author=demo' \
  -d 'changeDescription=initial version' \
  -d 'autoSubmit=true'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "namespaceId": "public",
    "agentName": "my-agent",
    "version": "1.0.0",
    "status": "draft",
    "callInterfaces": [
      {
        "protocol": "a2a",
        "protocolVersion": "1.0",
        "descriptorMediaType": "application/json",
        "nativeDescriptor": {
          "name": "my-agent",
          "version": "1.0.0",
          "description": "Example Agent",
          "protocolVersion": "1.0",
          "supportedInterfaces": [
            {
              "url": "https://example.com/my-agent/jsonrpc",
              "protocolBinding": "JSONRPC",
              "protocolVersion": "1.0",
              "transport": "JSONRPC"
            }
          ],
          "capabilities": {
            "streaming": true,
            "extendedAgentCard": true
          }
        },
        "endpointSourceOrder": ["DECLARED", "RUNTIME"],
        "declaredEndpoints": [
          {
            "uri": "https://example.com/my-agent/jsonrpc",
            "transport": "JSONRPC"
          }
        ]
      }
    ],
    "author": "demo",
    "changeDescription": "initial version",
    "contentDigest": "sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    "createTime": 1785897600000,
    "updateTime": 1785897600000
  }
}
```

### 3.7. Register Agent Endpoints

#### Description

Replaces one HTTP publisher's complete runtime endpoint batch for an Agent protocol. Reuse one stable `X-Nacos-Client-Id` for every batch owned by the same logical client in its bound namespace. The returned `ClientLivenessInfo` is the effective server policy: schedule one heartbeat task for this client id at `heartbeatIntervalMillis`, not one task per endpoint or batch.

#### Since

`3.3.0`

#### Request Method

`POST`

Request parameters are encoded as an `application/x-www-form-urlencoded` form; `endpoints` is a JSON array string.

#### Request URL

`/nacos/v3/client/ai/agents/endpoints`

#### Request Headers

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `X-Nacos-Client-Id` | `string` | **Yes** | Required stable opaque identifier of the logical HTTP client. Generate one unique value per client or SDK instance, preferably with at least 96 bits of random entropy; a UUID is valid, and the value must contain 1 to 256 characters matching `[A-Za-z0-9._:-]+`. Reuse it for endpoint registration, deregistration, heartbeat, retries, server switches, and redo, and generate a new value after that client instance or process restarts. Do not share one id between unrelated clients or processes. The first endpoint write binds the id to the authenticated identity and namespace. The id owns all endpoint publications of that client and is a routing identifier, not a credential. |
| `Request-Module` | `string` | **Yes** | Required for endpoint publisher lifecycle operations. Set `Request-Module` to `AI`. |

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `namespaceId` | `string` | No | Namespace of the Agent. Defaults to `public`. |
| `agentName` | `string` | **Yes** | Name of the Agent whose endpoints are being registered. |
| `runtimeVersion` | `string` | **Yes** | Runtime version of the Publisher. |
| `versionRange` | `string` | No | Agent version range supported by these endpoints. |
| `protocol` | `string` | **Yes** | Agent protocol associated with this endpoint publication. |
| `endpoints` | `string` | **Yes** | Complete Endpoint batch of the current Publisher as a JSON array string. |

#### Response Data

The response body follows the [Nacos OpenAPI common response format](overview/api-overview.md#32-http-api-response-format). The following table describes `data` and its fields.

| Name | Type | Description |
|------|------|-------------|
| `data` | `ClientLivenessInfo` | Effective HTTP Client liveness policy returned by the server. |
| `data.heartbeatIntervalMillis` | `integer` | Recommended client heartbeat interval in milliseconds. |
| `data.unhealthyTimeoutMillis` | `integer` | Timeout in milliseconds before the client becomes unhealthy. |
| `data.expireTimeoutMillis` | `integer` | Timeout in milliseconds before the client and its publications expire. |

#### Examples

* Request example

```shell
curl -X POST '127.0.0.1:8848/nacos/v3/client/ai/agents/endpoints' \
  -H 'X-Nacos-Client-Id: 550e8400-e29b-41d4-a716-446655440000' \
  -H 'Request-Module: AI' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'namespaceId=public' \
  -d 'agentName=my-agent' \
  -d 'runtimeVersion=1.0.0' \
  --data-urlencode 'versionRange=[1.0.0]' \
  -d 'protocol=a2a' \
  --data-urlencode 'endpoints=[{"uri":"http://127.0.0.1:8081/a2a","transport":"HTTP+JSON","priority":0,"weight":1.0,"metadata":{}}]'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "heartbeatIntervalMillis": 5000,
    "unhealthyTimeoutMillis": 15000,
    "expireTimeoutMillis": 30000
  }
}
```

### 3.8. Deregister Agent Endpoints

#### Description

Removes one HTTP publisher's complete runtime endpoint publication for an Agent protocol owned by the supplied `X-Nacos-Client-Id`. Keep one client-level heartbeat while any publication owned by this client remains, and stop it after the last publication is removed.

This endpoint binds the ordinary `namespaceId`, `agentName`, and `protocol` request parameters through a dedicated form. It does not accept Endpoint natural keys or a JSON request body.

#### Since

`3.3.0`

#### Request Method

`DELETE`

#### Request URL

`/nacos/v3/client/ai/agents/endpoints`

#### Request Headers

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `X-Nacos-Client-Id` | `string` | **Yes** | Required stable opaque identifier of the logical HTTP client. Generate one unique value per client or SDK instance, preferably with at least 96 bits of random entropy; a UUID is valid, and the value must contain 1 to 256 characters matching `[A-Za-z0-9._:-]+`. Reuse it for endpoint registration, deregistration, heartbeat, retries, server switches, and redo, and generate a new value after that client instance or process restarts. Do not share one id between unrelated clients or processes. The first endpoint write binds the id to the authenticated identity and namespace. The id owns all endpoint publications of that client and is a routing identifier, not a credential. |
| `Request-Module` | `string` | **Yes** | Required for endpoint publisher lifecycle operations. Set `Request-Module` to `AI`. |

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `namespaceId` | `string` | No | Namespace of the Agent. Defaults to `public`. |
| `agentName` | `string` | **Yes** | Name of the Agent whose endpoints are being deregistered. |
| `protocol` | `string` | **Yes** | Agent protocol whose endpoints are being deregistered. |

#### Response Data

The response body follows the [Nacos OpenAPI common response format](overview/api-overview.md#32-http-api-response-format). The following table describes `data`.

| Name | Type | Description |
|------|------|-------------|
| `data` | `Void` | No business data is returned on success; the value is `null`. |

#### Examples

* Request example

```shell
curl -X DELETE '127.0.0.1:8848/nacos/v3/client/ai/agents/endpoints?namespaceId=public&agentName=my-agent&protocol=a2a' \
  -H 'X-Nacos-Client-Id: 550e8400-e29b-41d4-a716-446655440000' \
  -H 'Request-Module: AI'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 3.9. Heartbeat Agent Endpoints

#### Description

Refreshes the HTTP Client and every Agent endpoint publication owned by its `X-Nacos-Client-Id`. Send one heartbeat task per client id regardless of endpoint, Agent, protocol, or batch count; never schedule heartbeats per endpoint. Use `heartbeatIntervalMillis` returned by registration or the latest heartbeat as the delay before the next heartbeat, and reschedule when a later response changes it instead of hard-coding the current defaults. `unhealthyTimeoutMillis` and `expireTimeoutMillis` are effective server thresholds and cannot be overridden by the request. Search and Discover do not renew Publisher liveness. On `HTTP_CLIENT_NOT_FOUND (50404)`, re-register every complete desired batch before continuing heartbeats.

#### Since

`3.3.0`

#### Request Method

`PUT`

#### Request URL

`/nacos/v3/client/ai/agents/endpoints/heartbeat`

#### Request Headers

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `X-Nacos-Client-Id` | `string` | **Yes** | Required stable opaque identifier of the logical HTTP client. Generate one unique value per client or SDK instance, preferably with at least 96 bits of random entropy; a UUID is valid, and the value must contain 1 to 256 characters matching `[A-Za-z0-9._:-]+`. Reuse it for endpoint registration, deregistration, heartbeat, retries, server switches, and redo, and generate a new value after that client instance or process restarts. Do not share one id between unrelated clients or processes. The first endpoint write binds the id to the authenticated identity and namespace. The id owns all endpoint publications of that client and is a routing identifier, not a credential. |
| `Request-Module` | `string` | **Yes** | Required for endpoint publisher lifecycle operations. Set `Request-Module` to `AI`. |

#### Response Data

The response body follows the [Nacos OpenAPI common response format](overview/api-overview.md#32-http-api-response-format). The following table describes `data` and its fields.

| Name | Type | Description |
|------|------|-------------|
| `data` | `ClientLivenessInfo` | Effective HTTP Client liveness policy returned by the server. |
| `data.heartbeatIntervalMillis` | `integer` | Recommended client heartbeat interval in milliseconds. |
| `data.unhealthyTimeoutMillis` | `integer` | Timeout in milliseconds before the client becomes unhealthy. |
| `data.expireTimeoutMillis` | `integer` | Timeout in milliseconds before the client and its publications expire. |

#### Examples

* Request example

```shell
curl -X PUT '127.0.0.1:8848/nacos/v3/client/ai/agents/endpoints/heartbeat' \
  -H 'X-Nacos-Client-Id: 550e8400-e29b-41d4-a716-446655440000' \
  -H 'Request-Module: AI'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "heartbeatIntervalMillis": 5000,
    "unhealthyTimeoutMillis": 15000,
    "expireTimeoutMillis": 30000
  }
}
```

### 3.10. Search Agent Catalog

#### Description

Searches visible Agent catalog entries by name, tags, protocols, and pagination. Supplying `X-Nacos-Client-Id` renews only an already-existing HTTP Client and never its endpoint Publisher liveness.

#### Since

`3.3.0`

#### Request Method

`GET`

#### Request URL

`/nacos/v3/client/ai/agents/search`

#### Request Headers

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `X-Nacos-Client-Id` | `string` | No | Optional stable identifier of an existing logical HTTP client. When present, it must contain 1 to 256 characters matching `[A-Za-z0-9._:-]+` and use the same value as the client's endpoint publisher requests. Search and Discover renew only the existing Client lifecycle; they never create an empty Client or renew Publisher liveness, so they cannot replace Publisher heartbeat. |

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `namespaceId` | `string` | No | Namespace of the Agent. Defaults to `public`. |
| `agentNameContains` | `string` | No | Literal, case-sensitive text that the Agent name must contain. |
| `tagsAll` | `array<string>` | No | Repeatable parameter; a catalog entry must contain every supplied tag. |
| `protocolsAny` | `array<string>` | No | Repeatable parameter; a catalog entry may match any supplied protocol. |
| `pageNo` | `integer` | No | Requested page number. |
| `pageSize` | `integer` | No | Number of catalog entries returned per page. |

#### Response Data

The response body follows the [Nacos OpenAPI common response format](overview/api-overview.md#32-http-api-response-format). The following table describes `data` and its fields.

| Name | Type | Description |
|------|------|-------------|
| `data` | `Page<AgentCatalogEntry>` | Paginated Agent catalog result. |
| `data.totalCount` | `integer` | Total number of matching catalog entries. |
| `data.pageNumber` | `integer` | Current page number. |
| `data.pagesAvailable` | `integer` | Total number of available pages. |
| `data.pageItems` | `array<AgentCatalogEntry>` | Agent catalog entries on the current page. |
| `data.pageItems[i].agentName` | `string` | Agent name. |
| `data.pageItems[i].displayName` | `string` | Agent display name. |
| `data.pageItems[i].description` | `string` | Agent description. |
| `data.pageItems[i].iconUrl` | `string` | Agent icon URL. |
| `data.pageItems[i].provider` | `AgentProvider` | Agent provider. |
| `data.pageItems[i].provider.name` | `string` | Provider name. |
| `data.pageItems[i].provider.url` | `string` | Provider URL. |
| `data.pageItems[i].tags` | `array<string>` | Agent tags. |
| `data.pageItems[i].latestVersion` | `string` | Latest Agent version. |
| `data.pageItems[i].versions` | `array<AgentCatalogVersion>` | Available Agent versions with their labels and protocols. |
| `data.pageItems[i].versions[i].version` | `string` | Agent version. |
| `data.pageItems[i].versions[i].labels` | `array<string>` | Version labels. |
| `data.pageItems[i].versions[i].protocols` | `array<string>` | Protocols supported by the version. |

#### Examples

* Request example

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/client/ai/agents/search?namespaceId=public&agentNameContains=agent&tagsAll=assistant&protocolsAny=a2a&pageNo=1&pageSize=10' \
  -H 'X-Nacos-Client-Id: 550e8400-e29b-41d4-a716-446655440000'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "totalCount": 1,
    "pageNumber": 1,
    "pagesAvailable": 1,
    "pageItems": [
      {
        "agentName": "my-agent",
        "displayName": "My Agent",
        "description": "Example Agent",
        "iconUrl": "https://example.com/icon.png",
        "provider": {
          "name": "example-provider",
          "url": "https://example.com"
        },
        "tags": ["assistant"],
        "latestVersion": "1.0.0",
        "versions": [
          {
            "version": "1.0.0",
            "labels": ["latest"],
            "protocols": ["a2a"]
          }
        ]
      }
    ]
  }
}
```
