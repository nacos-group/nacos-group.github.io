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

Configuration and naming APIs provide runtime access to individual configurations and services, without full configuration or service listings. AI APIs also support runtime resource search, content retrieval, Agent/MCP publishing, and endpoint management.

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
| Searching visible AI resources, retrieving content, discovering Agent/MCP endpoints, and watching Agent changes. | Managing AI resource reviews, permissions, and the complete version lifecycle. |
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

### 0.4. Authentication And Example Setup

Nacos 3.3 enables Client authentication by default. Configuration reads, service registration/discovery, and other protected requests fail without valid credentials and resource permissions.

With the default auth plugin, follow [Access Credentials](./auth.mdx) to log in and save the returned `accessToken` in the `NACOS_ACCESS_TOKEN` environment variable. Run the examples below in the same terminal. They use Bash (Git Bash or WSL on Windows) and send the token in the `accessToken` header. This header requirement applies to every protected API and is not repeated in each parameter table.

If authentication fails, check account credentials, token expiration, and resource permissions. Log in again and update the variable after expiration. Logging in to the console does not configure credentials for curl in a separate terminal.

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
| `data` | `ConfigQueryResponse` | Configuration query result. |
| `data.content`          | `string` | Configuration content. |
| `data.encryptedDataKey` | `string` | Encryption/decryption key of the configuration. This value exists only when a configuration encryption plugin is used. |
| `data.contentType`      | `string` | Configuration type, such as `TEXT` or `JSON`. |
| `data.md5`              | `string` | MD5 value of the configuration. |
| `data.lastModified`     | `integer` | Last modification time of the configuration. |
| `data.beta`             | `boolean` | Whether the configuration has a beta configuration. |

Other fields are reserved and currently unused. You can ignore them.

#### Examples

* Request example

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET '127.0.0.1:8848/nacos/v3/client/cs/config?dataId=test&groupName=test'
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
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST "127.0.0.1:8848/nacos/v3/client/ns/instance" -d "serviceName=test1&ip=127.0.0.1&port=3306&ephemeral=true"

# Renew instance
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST "127.0.0.1:8848/nacos/v3/client/ns/instance" -d "serviceName=test1&ip=127.0.0.1&port=3306&heartBeat=true&ephemeral=true"
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
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X DELETE "127.0.0.1:8848/nacos/v3/client/ns/instance?serviceName=test1&ip=127.0.0.1&port=3306&ephemeral=true"
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
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET '127.0.0.1:8848/nacos/v3/client/ns/instance/list?serviceName=test1'
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

This chapter covers AI APIs for application runtime access. See the [Unified Lifecycle](./ai/ai-resource-lifecycle.md) for version publishing and visibility, and the [RAD Integration Guide](./ai/rad-discovery.md) for Agent integration. Search returns currently visible, enabled resources; newly published resources may be temporarily absent while the index catches up.

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
| `version`     | `string` | No     | Exact version, taking precedence over `label`; defaults to `latest` when both are omitted. |
| `label`       | `string` | No     | Version label, used when `version` is omitted. |
| `md5`         | `string` | No     | If matches server, response is 304            |

#### Response Data

The response body follows the [Nacos OpenAPI common response format](overview/api-overview.md#32-http-api-response-format). The following table describes only the fields in `data`.

| Name                | Type      | Description           |
|--------------------|-----------|--------------|
| `data` | `Prompt` | Prompt content and version. |
| `data.promptKey`        | `string` | Prompt key    |
| `data.version`          | `string` | Version       |
| `data.template`         | `string` | Prompt template content   |
| `data.md5`              | `string` | Content md5 for 304       |
| `data.variables`        | `array<PromptVariable>` | Variables with `name`, `defaultValue`, and `description`. |

#### Examples

* Request example

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET '127.0.0.1:8848/nacos/v3/client/ai/prompt?promptKey=myPrompt'
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
| `data` | `AgentSpec` | AgentSpec details. |
| `data.namespaceId` | `string` | Namespace of the AgentSpec |
| `data.name`        | `string` | AgentSpec name             |
| `data.description` | `string` | AgentSpec description      |
| `data.bizTags`     | `string` | AgentSpec business tags    |
| `data.content`     | `string` | AgentSpec content          |
| `data.resource`    | `map<string, AgentSpecResource>` | Associated resources with name, type, content, and metadata. |

#### Examples

* Request example

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET '127.0.0.1:8848/nacos/v3/client/ai/agentspecs?name=my-agent'
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
| `query` | `string` | No | Inherited compatibility field, validated only for length (up to 1024 characters); use `keyword` to filter names. |
| `tagsAll` | `array<string>` | No | Repeatable tags that must all match; up to 32 non-empty values. |
| `pageNo`      | `integer` | No | Positive page number; defaults to `1`. |
| `pageSize`    | `integer` | No | Positive page size; defaults to `100`. |

#### Response Data

Return body follows [Nacos open API common response format](overview/api-overview.md#32-http-api-response-format); this table describes fields in `data`.

| Name    | Type     | Description                                              |
|--------|----------|---------------------------------------------------|
| `data` | `Page<AgentSpecBasicInfo>` | AgentSpec search results. |
| `data.totalCount` | `integer` | Total matching resources. |
| `data.pageNumber` | `integer` | Current page number. |
| `data.pagesAvailable` | `integer` | Total pages. |
| `data.pageItems` | `array<AgentSpecBasicInfo>` | Resource summaries with `namespaceId`, `name`, `description`, `bizTags`, and `updateTime`. |

#### Examples

* Request example

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET '127.0.0.1:8848/nacos/v3/client/ai/agentspecs/search?keyword=agent&pageNo=1&pageSize=10'
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
curl -f -H "accessToken: ${NACOS_ACCESS_TOKEN}" '127.0.0.1:8848/nacos/v3/client/ai/skills?name=my-skill' -o my-skill.zip
```

* Response description

A successful response is a Skill ZIP file, saved as `my-skill.zip` by this command. It is not wrapped in a JSON `Result`.

> **Agent Management API note:** The Agent APIs in sections 3.5–3.11 are the recommended integration path going forward and are planned to gradually replace the existing A2A management APIs. New users and SDKs should prioritize compatibility with these Agent Management APIs instead of adding new dependencies on the legacy A2A APIs. Existing A2A integrations can migrate in line with future release and migration guidance. This describes the evolution of the management APIs and does not mean that the A2A protocol itself is deprecated.

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
| `data.description` | `string` | Current public description of the Agent. |
| `data.tags` | `array<string>` | Current public tags of the Agent. |
| `data.callInterfaces` | `array<AgentCallInterface>` | Agent call interfaces and their matching endpoint sets. |
| `data.callInterfaces[i].protocol` | `string` | Call interface protocol. |
| `data.callInterfaces[i].protocolVersion` | `string` | Call interface protocol version. |
| `data.callInterfaces[i].descriptorMediaType` | `string` | Media type of the protocol-native descriptor. |
| `data.callInterfaces[i].nativeDescriptor` | `object` | Protocol-native descriptor content. |
| `data.callInterfaces[i].endpointSets` | `array<EndpointSet>` | Endpoint sets grouped by source. |
| `data.callInterfaces[i].endpointSets[i].source` | `string` | Endpoint source: `RUNTIME` or `DECLARED`. |
| `data.callInterfaces[i].endpointSets[i].sourceRevision` | `string` | Revision identifier of the endpoint source. |
| `data.callInterfaces[i].endpointSets[i].endpoints` | `array<Endpoint>` | Endpoints matched from this source. |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].uri` | `string` | Endpoint URI. |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].transport` | `string` | Endpoint transport. |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].priority` | `integer` | Endpoint priority. |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].weight` | `number` | Endpoint weight. |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].metadata` | `map<string, string>` | Endpoint metadata. |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].healthy` | `boolean` | Whether the endpoint is healthy. |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].enabled` | `boolean` | Whether the endpoint is enabled. |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].bindings` | `array<RuntimeVersionBinding>` | Runtime version bindings of the endpoint. |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].bindings[i].runtimeVersion` | `string` | Publisher runtime version. |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].bindings[i].versionRange` | `string` | Agent version range supported by the runtime. |

#### Examples

* Request example

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET '127.0.0.1:8848/nacos/v3/client/ai/agents?namespaceId=public&agentName=my-agent&version=1.0.0&protocol=a2a' \
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
| `provider` | `string` | No | `AgentProvider` JSON object string with `name` and `url`. |
| `tags` | `string` | No | Agent tags as a JSON array string. |
| `extensions` | `string` | No | Agent extensions as a JSON object string. |
| `callInterfaces` | `string` | No | JSON string containing `array<AgentCallInterface>`; use either this field or `basedOnVersion`. Required when creating an Agent. |
| `author` | `string` | No | Author of the Agent version. |
| `changeDescription` | `string` | No | Description of the changes in this version. |
| `basedOnVersion` | `string` | No | Exact Agent version whose content is copied; use either this field or `callInterfaces`. It cannot be used when creating an Agent. |
| `autoSubmit` | `boolean` | No | Whether to run the ordinary submit flow; defaults to `false`. Creating the first version forces submission. |

This API creates or fully replaces an editable Agent draft. Creating the first version submits it automatically; subsequent versions and existing drafts use `autoSubmit`. Submission may require review, so a successful response does not imply that the version is online. Existing non-draft versions are neither overwritten nor brought online again. See [Agent Management](./ai/agent-registry.md).

#### Response Data

The response body follows the [Nacos OpenAPI common response format](overview/api-overview.md#32-http-api-response-format). The following table describes `data` and its fields.

| Name | Type | Description |
|------|------|-------------|
| `data` | `AgentVersionDetail` | Agent version details after the operation. |
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
| `data.callInterfaces[i].endpointSets` | `array<EndpointSet>` | Declared endpoint sets in the definition. |
| `data.callInterfaces[i].endpointSets[i].source` | `string` | `DECLARED` in a definition. |
| `data.callInterfaces[i].endpointSets[i].endpoints` | `array<Endpoint>` | Declared endpoints. |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].uri` | `string` | Endpoint URI. |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].transport` | `string` | Endpoint transport. |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].priority` | `integer` | Endpoint priority. |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].weight` | `number` | Endpoint weight. |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].metadata` | `map<string, string>` | Endpoint metadata. |
| `data.author` | `string` | Author of the Agent version. |
| `data.changeDescription` | `string` | Description of the Agent version changes. |
| `data.contentDigest` | `string` | Digest of the Agent definition content. |
| `data.createTime` | `integer` | Creation time. |
| `data.updateTime` | `integer` | Last update time. |

#### Examples

* Request example

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST '127.0.0.1:8848/nacos/v3/client/ai/agents' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'namespaceId=public' \
  -d 'agentName=my-agent' \
  -d 'version=1.0.0' \
  --data-urlencode 'callInterfaces=[{"protocol":"a2a","protocolVersion":"1.0","descriptorMediaType":"application/json","nativeDescriptor":{"name":"my-agent","version":"1.0.0","description":"Example Agent","protocolVersion":"1.0","supportedInterfaces":[{"url":"https://example.com/my-agent/jsonrpc","protocolBinding":"JSONRPC","protocolVersion":"1.0","transport":"JSONRPC"}],"capabilities":{"streaming":true,"extendedAgentCard":true}},"endpointSourceOrder":["DECLARED","RUNTIME"],"endpointSets":[{"source":"DECLARED","endpoints":[{"uri":"https://example.com/my-agent/jsonrpc","transport":"JSONRPC"}]}]}]' \
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
    "status": "online",
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
        "endpointSets": [
          {
            "source": "DECLARED",
            "endpoints": [
              {
                "uri": "https://example.com/my-agent/jsonrpc",
                "transport": "JSONRPC"
              }
            ]
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
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST '127.0.0.1:8848/nacos/v3/client/ai/agents/endpoints' \
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
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X DELETE '127.0.0.1:8848/nacos/v3/client/ai/agents/endpoints?namespaceId=public&agentName=my-agent&protocol=a2a' \
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
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT '127.0.0.1:8848/nacos/v3/client/ai/agents/endpoints/heartbeat' \
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
| `pageNo` | `integer` | No | Page number starting at `1`; defaults to `1`. |
| `pageSize` | `integer` | No | Page size from `1` to `100`; defaults to `20`. |

#### Response Data

The response body follows the [Nacos OpenAPI common response format](overview/api-overview.md#32-http-api-response-format). The following table describes `data` and its fields.

| Name | Type | Description |
|------|------|-------------|
| `data` | `Page<AgentSummary>` | Paginated Agent catalog result. |
| `data.totalCount` | `integer` | Total number of matching catalog entries. |
| `data.pageNumber` | `integer` | Current page number. |
| `data.pagesAvailable` | `integer` | Total number of available pages. |
| `data.pageItems` | `array<AgentSummary>` | Public metadata and online version information for the current page. |
| `data.pageItems[i].agentName` | `string` | Agent name. |
| `data.pageItems[i].displayName` | `string` | Agent display name. |
| `data.pageItems[i].description` | `string` | Agent description. |
| `data.pageItems[i].iconUrl` | `string` | Agent icon URL. |
| `data.pageItems[i].provider` | `AgentProvider` | Agent provider. |
| `data.pageItems[i].provider.name` | `string` | Provider name. |
| `data.pageItems[i].provider.url` | `string` | Provider URL. |
| `data.pageItems[i].tags` | `array<string>` | Agent tags. |
| `data.pageItems[i].versionInfo` | `AgentVersionInfo` | Online versions and label mappings. |
| `data.pageItems[i].versionInfo.labels` | `map<string, string>` | Labels mapped to online versions, including `latest`. |
| `data.pageItems[i].versionInfo.onlineVersions` | `array<AgentVersionSummary>` | Online version summaries. |
| `data.pageItems[i].versionInfo.onlineVersions[i].version` | `string` | Agent version. |
| `data.pageItems[i].versionInfo.onlineVersions[i].labels` | `array<string>` | Custom version labels, excluding `latest`. |
| `data.pageItems[i].versionInfo.onlineVersions[i].protocols` | `array<string>` | Protocols supported by the version. |

#### Examples

* Request example

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET '127.0.0.1:8848/nacos/v3/client/ai/agents/search?namespaceId=public&agentNameContains=agent&tagsAll=assistant&protocolsAny=a2a&pageNo=1&pageSize=10' \
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
        "versionInfo": {
          "labels": {"latest": "1.0.0"},
          "onlineVersions": [
            {
              "version": "1.0.0",
              "labels": [],
              "protocols": ["a2a"]
            }
          ]
        }
      }
    ]
  }
}
```

### 3.11. Watch Agent Discovery Changes

#### Description

Perform one batch long poll for the complete current watch set. The response only identifies changed watches; call Discover again to retrieve their complete results, then start the next poll. Prefer the [RAD SDK](./ai/rad-discovery.md) for continuous subscriptions.

#### Since

`3.3.0`

#### Request Method

`POST`, with an `application/x-www-form-urlencoded` body.

#### Request URL

`/nacos/v3/client/ai/agents/watch`

#### Request Headers

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `X-Nacos-Client-Id` | `string` | **Yes** | Stable client identifier, 1–256 characters matching `[A-Za-z0-9._:-]+`. |
| `Request-Module` | `string` | **Yes** | Must be `AI`. |

#### Request Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `generation` | `integer` | **Yes** | Non-negative, monotonically increasing watch-set generation maintained by the client to identify stale responses. |
| `timeoutMillis` | `integer` | **Yes** | Long-poll timeout, 1000–60000 milliseconds. |
| `watches` | `string` | **Yes** | JSON string containing `array<AgentWatchBatchItem>`, with 1–1000 items in the same effective namespace. |

Each watch item contains these fields:

| Field | Type | Description |
| --- | --- | --- |
| `clientWatchId` | `string` | Unique within the batch, 1–128 characters matching `[A-Za-z0-9._:-]+`. |
| `discoveryRequest` | `AgentDiscoveryRequest` | Complete discovery request with `namespaceId`, `reference` (`agentName` and optional version/label), and optional `filter`; filters use model fields such as `protocols`, `transports`, and `endpointSources`. |
| `materializedFingerprint` | `string` | Required canonical fingerprint of the last stored complete discovery snapshot: `sha256-canonical-json-v1:` followed by 64 lowercase hexadecimal characters. |

Java clients can calculate the fingerprint with `AgentDiscoveryCanonicalizer.fingerprint(snapshot)`. It is neither the definition's `contentDigest` nor a SHA-256 hash of the raw HTTP JSON. Replace the previous poll when the watch set changes, and ignore responses for stale generations or cancelled items.

#### Response Data

| Name | Type | Description |
| --- | --- | --- |
| `data` | `AgentWatchBatchResponse` | Result of this long poll. |
| `data.generation` | `integer` | Same generation as the request. |
| `data.changed` | `boolean` | Whether changes occurred; `false` on a normal timeout. |
| `data.changedClientWatchIds` | `array<string>` | Watch IDs requiring another Discover, without discovery content or new fingerprints. |

#### Examples

Save the current snapshot fingerprint for this discovery request in `NACOS_AGENT_FINGERPRINT` before running:

```bash
curl -sS -X POST 'http://127.0.0.1:8848/nacos/v3/client/ai/agents/watch' \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  -H 'X-Nacos-Client-Id: agent-consumer-1' \
  -H 'Request-Module: AI' \
  -d 'generation=1' -d 'timeoutMillis=30000' \
  --data-urlencode "watches=[{\"clientWatchId\":\"watch-1\",\"discoveryRequest\":{\"namespaceId\":\"public\",\"reference\":{\"agentName\":\"my-agent\",\"version\":\"1.0.0\"}},\"materializedFingerprint\":\"${NACOS_AGENT_FINGERPRINT}\"}]"
```

Normal timeout example:

```json
{"code":0,"message":"success","data":{"generation":1,"changed":false,"changedClientWatchIds":[]}}
```

### 3.12. Query an MCP Server Version

#### Description

Retrieve an online MCP server version and its endpoints. Omitting the version selects `latest`. The optional client identifier renews only an existing HTTP Client and cannot replace endpoint heartbeats.

#### Since

`3.3.0`

#### Request Method

`GET`

#### Request URL

`/nacos/v3/client/ai/mcp`

#### Request Headers

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `X-Nacos-Client-Id` | `string` | No | Stable identifier of an existing HTTP Client, 1–256 characters matching `[A-Za-z0-9._:-]+`. |

#### Request Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `namespaceId` | `string` | No | Namespace; defaults to `public`. |
| `mcpName` | `string` | **Yes** | MCP server name. |
| `version` | `string` | No | Exact version; selects `latest` when omitted. |

#### Response Data

| Name | Type | Description |
| --- | --- | --- |
| `data` | `McpServerDetailInfo` | MCP server version details. |
| `data.namespaceId` | `string` | Namespace. |
| `data.id` | `string` | Server ID. |
| `data.name` | `string` | Server name. |
| `data.description` | `string` | Server description. |
| `data.protocol` | `string` | Backend protocol. |
| `data.frontProtocol` | `string` | Exposed protocol. |
| `data.versionDetail` | `ServerVersionDetail` | Version information with `version`, `release_date`, and `is_latest`. |
| `data.version` | `string` | Version number. |
| `data.remoteServerConfig` | `McpServerRemoteServiceConfig` | Remote service reference, export path, and frontend endpoint configuration. |
| `data.localServerConfig` | `map<string, object>` | Local process configuration. |
| `data.enabled` | `boolean` | Whether the server is enabled. |
| `data.status` | `string` | Version status. |
| `data.capabilities` | `array<string>` | Server capabilities. |
| `data.backendEndpoints` | `array<McpEndpointInfo>` | Backend endpoints with `protocol`, `address`, `port`, `path`, and `headers`. |
| `data.frontendEndpoints` | `array<McpEndpointInfo>` | Exposed endpoints with the same fields as backend endpoints. |
| `data.toolSpec` | `McpToolSpecification` | Tool definitions. |
| `data.resourceSpec` | `McpResourceSpecification` | Resource definitions. |
| `data.allVersions` | `array<ServerVersionDetail>` | Version list. |
| `data.repository` | `Repository` | Source repository information. |
| `data.packages` | `array<Package>` | Distribution packages. |
| `data.icons` | `array<Icon>` | Icons. |
| `data.websiteUrl` | `string` | Project website. |

#### Examples

```bash
curl -sS -G 'http://127.0.0.1:8848/nacos/v3/client/ai/mcp' \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  --data-urlencode 'namespaceId=public' \
  --data-urlencode 'mcpName=my-mcp' \
  --data-urlencode 'version=1.0.0'
```

### 3.13. Publish an MCP Version

#### Description

Publish an MCP version from an application. By default, the version goes directly online. With `createDraft=true`, only a draft is created; the resource must already use lifecycle management. Then follow the [lifecycle workflow](./ai/mcp-registry.md) to submit and publish it.

#### Since

`3.3.0`

#### Request Method

`POST`, with an `application/x-www-form-urlencoded` body.

#### Request URL

`/nacos/v3/client/ai/mcp`

#### Request Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `namespaceId` | `string` | No | Namespace; defaults to `public`. |
| `mcpName` | `string` | No | Must equal `serverSpecification.name` when supplied. |
| `serverSpecification` | `string` | **Yes** | `McpServerBasicInfo` JSON object string with server name, protocol, version, and configuration. |
| `toolSpecification` | `string` | No | `McpToolSpecification` JSON object string. |
| `resourceSpecification` | `string` | No | `McpResourceSpecification` JSON object string. |
| `endpointSpecification` | `string` | No | `McpEndpointSpec` JSON object string: `data` contains `address/port` for `type=DIRECT`, or `namespaceId/groupName/serviceName` for `type=REF`. Supply it according to the remote server's endpoint binding. |
| `createDraft` | `string` | No | `true` or `false`; defaults to `false`. |

#### Response Data

| Name | Type | Description |
| --- | --- | --- |
| `data` | `string` | MCP server ID. |

#### Examples

This publishes a stdio server definition; it does not start the process on Nacos Server.

```bash
curl -sS -X POST 'http://127.0.0.1:8848/nacos/v3/client/ai/mcp' \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  -d 'namespaceId=public' \
  --data-urlencode 'serverSpecification={"name":"my-mcp","protocol":"stdio","frontProtocol":"stdio","versionDetail":{"version":"1.0.0"},"localServerConfig":{"command":"python","args":["server.py"]}}' \
  -d 'createDraft=false'
```

### 3.14. Register an MCP Endpoint

#### Description

Register a runtime endpoint for a published remote MCP server configured with a service reference (`REF`). Prepare the remote definition and version using [MCP Management](./ai/mcp-registry.md); this example uses version `1.0.0` of `my-remote-mcp`. After registration, send heartbeats at the returned interval.

Within one identity and namespace, a logical client's Agent/MCP publications share a stable Client ID and one heartbeat task.

#### Since

`3.3.0`

#### Request Method

`POST`, with an `application/x-www-form-urlencoded` body.

#### Request URL

`/nacos/v3/client/ai/mcp/endpoints`

#### Request Headers

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `X-Nacos-Client-Id` | `string` | **Yes** | Stable client identifier, 1–256 characters matching `[A-Za-z0-9._:-]+`. |
| `Request-Module` | `string` | **Yes** | Must be `AI`. |

#### Request Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `namespaceId` | `string` | No | Namespace; defaults to `public`. |
| `mcpName` | `string` | **Yes** | MCP server name. |
| `address` | `string` | **Yes** | Valid IPv4 or IPv6 address. |
| `port` | `integer` | **Yes** | Runtime endpoint port, from `1` to `65535`. |
| `version` | `string` | No | Server version for the endpoint; specify it explicitly and use the same value when deregistering. |

#### Response Data

| Name | Type | Description |
| --- | --- | --- |
| `data` | `ClientLivenessInfo` | Client liveness settings. |
| `data.heartbeatIntervalMillis` | `integer` | Heartbeat interval in milliseconds. |
| `data.unhealthyTimeoutMillis` | `integer` | Timeout before being marked unhealthy, in milliseconds. |
| `data.expireTimeoutMillis` | `integer` | Expiration timeout in milliseconds. |

#### Examples

```bash
curl -sS -X POST 'http://127.0.0.1:8848/nacos/v3/client/ai/mcp/endpoints' \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  -H 'X-Nacos-Client-Id: mcp-publisher-1' \
  -H 'Request-Module: AI' \
  -d 'namespaceId=public' -d 'mcpName=my-remote-mcp' \
  -d 'address=127.0.0.1' -d 'port=9999' -d 'version=1.0.0'
```

Example response (use the interval from the actual response for subsequent heartbeats):

```json
{"code":0,"message":"success","data":{"heartbeatIntervalMillis":5000,"unhealthyTimeoutMillis":15000,"expireTimeoutMillis":30000}}
```

### 3.15. Deregister an MCP Endpoint

#### Description

Deregister an MCP runtime endpoint owned by this HTTP Client. Use the same Client ID, server, version, address, and port as registration. This does not delete the server definition.

#### Since

`3.3.0`

#### Request Method

`DELETE`, with an `application/x-www-form-urlencoded` body.

#### Request URL

`/nacos/v3/client/ai/mcp/endpoints`

#### Request Headers

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `X-Nacos-Client-Id` | `string` | **Yes** | Same stable client identifier as registration. |
| `Request-Module` | `string` | **Yes** | Must be `AI`. |

#### Request Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `namespaceId` | `string` | No | Namespace; defaults to `public`. |
| `mcpName` | `string` | **Yes** | MCP server name. |
| `address` | `string` | **Yes** | Registered endpoint address. |
| `port` | `integer` | **Yes** | Registered endpoint port. |
| `version` | `string` | No | Same version as registration. |

#### Response Data

Returns the common `Result` with `data=null` on success.

#### Examples

```bash
curl -sS -X DELETE 'http://127.0.0.1:8848/nacos/v3/client/ai/mcp/endpoints' \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  -H 'X-Nacos-Client-Id: mcp-publisher-1' \
  -H 'Request-Module: AI' \
  -d 'namespaceId=public' -d 'mcpName=my-remote-mcp' \
  -d 'address=127.0.0.1' -d 'port=9999' -d 'version=1.0.0'
```

```json
{"code":0,"message":"success","data":null}
```

### 3.16. MCP Endpoint Heartbeat

#### Description

Renew the shared HTTP Client and all Agent/MCP publications it owns. Schedule one heartbeat task using the latest `heartbeatIntervalMillis`. Re-register the desired endpoints on `HTTP_CLIENT_NOT_FOUND`. Queries and Watch cannot replace publisher heartbeats.

#### Since

`3.3.0`

#### Request Method

`PUT`

#### Request URL

`/nacos/v3/client/ai/mcp/endpoints/heartbeat`

#### Request Headers

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `X-Nacos-Client-Id` | `string` | **Yes** | Same stable client identifier as registration. |
| `Request-Module` | `string` | **Yes** | Must be `AI`. |

#### Request Parameters

None.

#### Response Data

| Name | Type | Description |
| --- | --- | --- |
| `data` | `ClientLivenessInfo` | Client liveness settings. |
| `data.heartbeatIntervalMillis` | `integer` | Next heartbeat interval in milliseconds. |
| `data.unhealthyTimeoutMillis` | `integer` | Timeout before being marked unhealthy, in milliseconds. |
| `data.expireTimeoutMillis` | `integer` | Expiration timeout in milliseconds. |

#### Examples

```bash
curl -sS -X PUT 'http://127.0.0.1:8848/nacos/v3/client/ai/mcp/endpoints/heartbeat' \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  -H 'X-Nacos-Client-Id: mcp-publisher-1' \
  -H 'Request-Module: AI'
```

### 3.17. Search MCP Resources

#### Description

Search currently visible, enabled MCP resources by text, tags, protocols, and capabilities. An empty query lists resources. All `tagsAll` values must match; `protocolsAny` and `capabilitiesAny` each require any matching value. Different conditions are combined with AND.

#### Since

`3.3.0`

#### Request Method

`GET`

#### Request URL

`/nacos/v3/client/ai/mcp/search`

#### Request Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `namespaceId` | `string` | No | Namespace; defaults to `public`. |
| `query` | `string` | No | Search text, up to 1024 characters. |
| `tagsAll` | `array<string>` | No | Repeatable tags that must all match; up to 32 non-empty values. |
| `protocolsAny` | `array<string>` | No | Repeatable protocols, any of which may match; up to 32 non-empty values. |
| `capabilitiesAny` | `array<string>` | No | Repeatable capabilities, any of which may match, such as `TOOL`, `PROMPT`, or `RESOURCE`; up to 32 non-empty values. |
| `pageNo` | `integer` | No | Positive integer; defaults to `1`. |
| `pageSize` | `integer` | No | Positive integer; defaults to `100`. |

#### Response Data

| Name | Type | Description |
| --- | --- | --- |
| `data` | `Page<McpServerBasicInfo>` | Paginated MCP resource results. |
| `data.totalCount` | `integer` | Total matching resources. |
| `data.pageNumber` | `integer` | Current page number. |
| `data.pagesAvailable` | `integer` | Total pages. |
| `data.pageItems` | `array<McpServerBasicInfo>` | Server summaries on this page; use the MCP query API for endpoints and complete definitions. |

#### Examples

```bash
curl -sS -G 'http://127.0.0.1:8848/nacos/v3/client/ai/mcp/search' \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  --data-urlencode 'namespaceId=public' --data-urlencode 'query=weather' \
  --data-urlencode 'capabilitiesAny=TOOL' \
  --data-urlencode 'pageNo=1' --data-urlencode 'pageSize=20'
```

### 3.18. Search Skill Resources

#### Description

Search currently visible, enabled Skills by text and tags. An empty query lists resources. Use the Skill download API to retrieve content.

#### Since

`3.3.0`

#### Request Method

`GET`

#### Request URL

`/nacos/v3/client/ai/skills/search`

#### Request Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `namespaceId` | `string` | No | Namespace; defaults to `public`. |
| `query` | `string` | No | Search text, up to 1024 characters. |
| `tagsAll` | `array<string>` | No | Repeatable tags that must all match; up to 32 non-empty values. |
| `pageNo` | `integer` | No | Positive integer; defaults to `1`. |
| `pageSize` | `integer` | No | Positive integer; defaults to `100`. |

#### Response Data

| Name | Type | Description |
| --- | --- | --- |
| `data` | `Page<SkillBasicInfo>` | Paginated Skill results. |
| `data.totalCount` | `integer` | Total matching resources. |
| `data.pageNumber` | `integer` | Current page number. |
| `data.pagesAvailable` | `integer` | Total pages. |
| `data.pageItems` | `array<SkillBasicInfo>` | Summaries with `namespaceId`, `name`, `description`, and `updateTime`. |

#### Examples

```bash
curl -sS -G 'http://127.0.0.1:8848/nacos/v3/client/ai/skills/search' \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  --data-urlencode 'namespaceId=public' --data-urlencode 'query=travel' \
  --data-urlencode 'pageNo=1' --data-urlencode 'pageSize=20'
```

### 3.19. Search Prompt Resources

#### Description

Search currently visible, enabled Prompts by text and tags. An empty query lists resources. Use the Prompt query API to retrieve template content.

#### Since

`3.3.0`

#### Request Method

`GET`

#### Request URL

`/nacos/v3/client/ai/prompt/search`

#### Request Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `namespaceId` | `string` | No | Namespace; defaults to `public`. |
| `query` | `string` | No | Search text, up to 1024 characters. |
| `tagsAll` | `array<string>` | No | Repeatable tags that must all match; up to 32 non-empty values. |
| `pageNo` | `integer` | No | Positive integer; defaults to `1`. |
| `pageSize` | `integer` | No | Positive integer; defaults to `100`. |

#### Response Data

| Name | Type | Description |
| --- | --- | --- |
| `data` | `Page<PromptMetaSummary>` | Paginated Prompt results. |
| `data.totalCount` | `integer` | Total matching resources. |
| `data.pageNumber` | `integer` | Current page number. |
| `data.pagesAvailable` | `integer` | Total pages. |
| `data.pageItems` | `array<PromptMetaSummary>` | Metadata summaries including `promptKey`, description, business tags, and version information. |

#### Examples

```bash
curl -sS -G 'http://127.0.0.1:8848/nacos/v3/client/ai/prompt/search' \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  --data-urlencode 'namespaceId=public' --data-urlencode 'query=assistant' \
  --data-urlencode 'pageNo=1' --data-urlencode 'pageSize=20'
```

### 3.20. Search Across AI Resource Types

#### Description

Search currently visible, enabled AI resources using cursor pagination. A blank `query` lists resources; a non-blank query searches by relevance. Newly published content may be temporarily absent while the index catches up. Results are summaries; use the corresponding resource APIs to invoke or download content.

#### Since

`3.3.0`

#### Request Method

`GET`

#### Request URL

`/nacos/v3/client/ai/resources/search`

#### Request Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `namespaceId` | `string` | No | Namespace; defaults to `public`. |
| `query` | `string` | No | Search text, up to 1024 characters. |
| `resourceTypes` | `array<string>` | No | Repeatable `agent`, `agentspec`, `skill`, `prompt`, or `mcp`; searches all supported types when omitted. |
| `tagsAll` | `array<string>` | No | Repeatable tags that must all match. |
| `capabilitiesAny` | `array<string>` | No | Repeatable capabilities, any of which may match. |
| `cursor` | `string` | No | Previous page's `nextCursor`, passed unchanged; omit on the first request. Up to 2048 characters. |
| `limit` | `integer` | No | Page size from `1` to `100`; defaults to `20`. |

Each array filter allows up to 32 non-empty values. Different conditions are combined with AND. Keep search conditions unchanged when paging; an absent `nextCursor` means the last page.

#### Response Data

| Name | Type | Description |
| --- | --- | --- |
| `data` | `AiResourceSearchResponse` | Cursor page without page numbers or totals. |
| `data.items` | `array<AiResourceSearchItem>` | Resource summaries on this page. |
| `data.nextCursor` | `string` | Next-page cursor; omitted on the last page. |
| `data.items[i].namespaceId` | `string` | Namespace. |
| `data.items[i].resourceType` | `string` | Resource type. |
| `data.items[i].resourceName` | `string` | Resource name. |
| `data.items[i].resourceVersion` | `string` | Current version. |
| `data.items[i].displayName` | `string` | Display name. |
| `data.items[i].description` | `string` | Description. |
| `data.items[i].tags` | `array<string>` | Tags. |
| `data.items[i].capabilities` | `array<string>` | Capabilities. |
| `data.items[i].representativeQueries` | `array<string>` | Representative query text. |
| `data.items[i].metadata` | `map<string, object>` | Extended resource metadata. |
| `data.items[i].createTime` | `integer` | Creation time. |
| `data.items[i].updateTime` | `integer` | Update time. |
| `data.items[i].score` | `integer` | Relevance score. |

#### Examples

```bash
curl -sS -G 'http://127.0.0.1:8848/nacos/v3/client/ai/resources/search' \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  --data-urlencode 'namespaceId=public' --data-urlencode 'query=travel' \
  --data-urlencode 'resourceTypes=agent' --data-urlencode 'resourceTypes=skill' \
  --data-urlencode 'limit=20'
```

Example with no matching resources:

```json
{"code":0,"message":"success","data":{"items":[]}}
```

### 3.21. Query AI HTTP Capabilities

#### Description

Query this node's Client HTTP capabilities to select a client binding. This follows Client authentication settings and checks identity without requiring permissions for specific AI resources. The result grants no resource access and does not imply support across all nodes or completed migration.

#### Since

`3.3.0`

#### Request Method

`GET`

#### Request URL

`/nacos/v3/client/ai/capabilities`

#### Request Parameters

None.

#### Response Data

| Name | Type | Description |
| --- | --- | --- |
| `data` | `map<string, object>` | This node's capability declaration. |
| `data.schemaVersion` | `integer` | Declaration format version, currently `1`. |
| `data.capabilities` | `map<string, boolean>` | Capability flags: `radV1`, `mcp`, `skill`, `prompt`, and `agentSpec`. |

#### Examples

```bash
curl -sS 'http://127.0.0.1:8848/nacos/v3/client/ai/capabilities' \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}"
```

```json
{"code":0,"message":"success","data":{"schemaVersion":1,"capabilities":{"radV1":true,"mcp":true,"skill":true,"prompt":true,"agentSpec":true}}}
```
