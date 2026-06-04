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

#### 接口描述

Get the specified configuration.

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/client/cs/config`

#### 请求头

| 参数名              | 参数类型     | 是否必填 | 描述说明                                                        |
|------------------|----------|------|-------------------------------------------------------------|
| `User-Agent`     | `string` | 否    | User agent. It is empty by default and is usually `Nacos-${program-language}-Client:v${version}`. |
| `Client-Version` | `string` | 否    | Client version. It is empty by default and is usually `Nacos-${program-language}-Client:v${version}`. |

#### 请求参数

| 参数名           | 类型       | 必填    | 参数描述                     |
|---------------|----------|-------|--------------------------|
| `namespaceId` | `string` | 否     | Namespace. Defaults to `public`, which is equivalent to `''`. |
| `groupName`   | `string` | **是** | Configuration group name. |
| `dataId`      | `string` | **是** | Configuration name. |

#### 返回数据

The response body follows the [Nacos OpenAPI common response format](overview/api-overview.md#32-http-api-统一返回体格式). The following table describes only the fields in `data`.

| 参数名                | 参数类型      | 描述                       |
|--------------------|-----------|--------------------------|
| `content`          | `string` | Configuration content. |
| `encryptedDataKey` | `string` | Encryption/decryption key of the configuration. This value exists only when a configuration encryption plugin is used. |
| `contentType`      | `string` | Configuration type, such as `TEXT` or `JSON`. |
| `md5`              | `string` | MD5 value of the configuration. |
| `lastModified`     | `integer` | Last modification time of the configuration. |
| `beta`             | `boolean` | Whether the configuration has a beta configuration. |

Other fields are reserved and currently unused. You can ignore them.

#### 示例

* 请求示例

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/client/cs/config?dataId=test&groupName=test' 
```

* 返回示例

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

#### 接口描述

Register or renew an instance.

:::note
When an instance registered through the HTTP OpenAPI is an **ephemeral instance**, it must be renewed periodically. In the HTTP OpenAPI of Nacos 3.X, the renewal API and registration API are merged and distinguished by the `heartBeat` parameter.

For renewal requests, Nacos does not parse metadata and related fields in the request. In other words, renewal requests ignore the `healthy`, `weight`, `enabled`, and `metadata` fields.
If a renewal request returns error code `21003`, the instance has expired and been removed. The client should re-register the instance with complete information and set `heartBeat=false`, then continue renewal requests after registration succeeds.

Calling the registration request repeatedly can also renew the instance, but it renews by updating the instance and consumes more resources. Therefore, after registration succeeds, use renewal instead of repeated registration updates.
:::

#### 起始版本

`3.0.0`

#### 请求方式

`POST`

#### 请求URL

`/nacos/v3/client/ns/instance`

#### 请求头

| 参数名              | 参数类型     | 是否必填 | 描述说明                                                        |
|------------------|----------|------|-------------------------------------------------------------|
| `User-Agent`     | `string` | 否    | User agent. It is empty by default and is usually `Nacos-${program-language}-Client:v${version}`. |
| `Client-Version` | `string` | 否    | Client version. It is empty by default and is usually `Nacos-${program-language}-Client:v${version}`. |

#### 请求参数

| 参数名           | 参数类型           | 是否必填  | 描述说明                   |
|---------------|----------------|-------|------------------------|
| `namespaceId` | `string` | 否     | Namespace ID. Defaults to `public`. |
| `groupName`   | `string` | 否     | Group name. Defaults to `DEFAULT_GROUP`. |
| `serviceName` | `string` | **是** | Service name. |
| `ip`          | `string` | **是** | IP address. |
| `port`        | `integer` | **是** | Port. |
| `clusterName` | `string` | 否     | Cluster name. Defaults to `DEFAULT`. |
| `healthy`     | `boolean` | 否     | Whether the instance is healthy. Defaults to `true`. |
| `weight`      | `number` | 否     | Instance weight. Defaults to `1.0`. |
| `enabled`     | `boolean` | 否     | Whether the instance is enabled. Defaults to `true`. |
| `metadata`    | `string` | 否     | Instance metadata as a JSON object string. |
| `heartBeat`   | `boolean` | 否     | Whether this is a renewal request. Defaults to `false`. |

#### 返回数据

The response body follows the [Nacos OpenAPI common response format](overview/api-overview.md#32-http-api-统一返回体格式). The following table describes only the fields in `data`.

| 参数名    | 参数类型     | 描述                             |
|--------|----------|--------------------------------|
| `data` | `string` | Whether registration or renewal succeeded. Returns `ok` on success, or the failure reason on failure. |

#### 示例

* 请求示例

```shell
# Register instance
curl -X POST "127.0.0.1:8848/nacos/v3/client/ns/instance" -d "serviceName=test1&ip=127.0.0.1&port=3306"

# Renew instance
curl -X POST "127.0.0.1:8848/nacos/v3/client/ns/instance" -d "serviceName=test1&ip=127.0.0.1&port=3306&heartBeat=true"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.2. Deregister Instance

#### 接口描述

Deregister the specified instance.

#### 起始版本

`3.0.0`

#### 请求方式

`DELETE`

#### 请求URL

`/nacos/v3/client/ns/instance`

#### 请求头

| 参数名              | 参数类型     | 是否必填 | 描述说明                                                        |
|------------------|----------|------|-------------------------------------------------------------|
| `User-Agent`     | `string` | 否    | User agent. It is empty by default and is usually `Nacos-${program-language}-Client:v${version}`. |
| `Client-Version` | `string` | 否    | Client version. It is empty by default and is usually `Nacos-${program-language}-Client:v${version}`. |

#### 请求参数

| 参数名           | 参数类型      | 必填    | 参数描述                   |
|---------------|-----------|-------|------------------------|
| `namespaceId` | `string` | 否     | Namespace ID. Defaults to `public`. |
| `groupName`   | `string` | 否     | Group name. Defaults to `DEFAULT_GROUP`. |
| `serviceName` | `string` | **是** | Service name. |
| `ip`          | `string` | **是** | IP address. |
| `port`        | `integer` | **是** | Port. |
| `clusterName` | `string` | 否     | Cluster name. Defaults to `DEFAULT`. |

#### 返回数据

The response body follows the [Nacos OpenAPI common response format](overview/api-overview.md#32-http-api-统一返回体格式). The following table describes only the fields in `data`.

| 参数名    | 参数类型     | 描述                          |
|--------|----------|-----------------------------|
| `data` | `string` | Whether deregistration succeeded. Returns `ok` on success, or the failure reason on failure. |

#### 示例

* 请求示例

```shell
curl -X DELETE "127.0.0.1:8848/nacos/v3/client/ns/instance?serviceName=test1&ip=127.0.0.1&port=3306"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.3. List Instances of a Service

#### 接口描述

Query the detailed instance list under the specified service.

:::note
Because Nacos 3.X will remove UDP-based push support, clients that do not support gRPC long-lived push connections need to periodically pull the instance list so that they can detect instance changes in time and implement service subscription.
:::

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/client/ns/instance/list`

#### 请求头

| 参数名              | 参数类型     | 是否必填 | 描述说明                                                        |
|------------------|----------|------|-------------------------------------------------------------|
| `User-Agent`     | `string` | 否    | User agent. It is empty by default and is usually `Nacos-${program-language}-Client:v${version}`. |
| `Client-Version` | `string` | 否    | Client version. It is empty by default and is usually `Nacos-${program-language}-Client:v${version}`. |

#### 请求参数

| 参数名           | 参数类型      | 是否必填  | 描述说明                    |
|---------------|-----------|-------|-------------------------|
| `namespaceId` | `string` | 否     | Namespace ID. Defaults to `public`. |
| `groupName`   | `string` | 否     | Group name. Defaults to `DEFAULT_GROUP`. |
| `serviceName` | `string` | **是** | Service name. |
| `clusterName` | `string` | 否     | Cluster name. If not provided, instances of all clusters will be returned.       |

#### 返回数据

The response body follows the [Nacos OpenAPI common response format](overview/api-overview.md#32-http-api-统一返回体格式). The following table describes only the fields in `data`.

| 参数名                                  | 参数类型       | 描述说明      |
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

#### 示例

* 请求示例

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/client/ns/instance/list?serviceName=test1'
```

* 返回示例

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

#### 接口描述

Query Prompt by version, label, or latest (priority: version > label > latest); supports md5 for 304 conditional response.

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/client/ai/prompt`

#### 请求参数

| 参数名           | 类型       | 必填    | 参数描述                     |
|---------------|----------|-------|--------------------------|
| `namespaceId` | `string` | 否     | Namespace ID. Defaults to `public`. |
| `promptKey`   | `string` | **是** | Prompt key                  |
| `version`     | `string` | 否     | Version (one of version, label, latest)     |
| `label`       | `string` | 否     | Label (one of version, label, latest)    |
| `md5`         | `string` | 否     | If matches server, response is 304            |

#### 返回数据

The response body follows the [Nacos OpenAPI common response format](overview/api-overview.md#32-http-api-统一返回体格式). The following table describes only the fields in `data`.

| 参数名                | 参数类型      | 描述           |
|--------------------|-----------|--------------|
| `promptKey`        | `string` | Prompt key    |
| `version`          | `string` | Version       |
| `template`         | `string` | Prompt template content   |
| `md5`              | `string` | Content md5 for 304       |
| `variables`        | `array` | Prompt variable list      |

#### 示例

* 请求示例

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/client/ai/prompt?promptKey=myPrompt'
```

* 返回示例

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

#### 接口描述

This interface allows getting an AgentSpec detail by namespace, name, version, or label.

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/client/ai/agentspecs`

#### 请求参数

| 参数名           | 类型       | 必填    | 参数描述                              |
|---------------|----------|-------|-----------------------------------|
| `namespaceId` | `string` | 否     | Namespace ID, default is `public` |
| `name`        | `string` | **是** | AgentSpec name                    |
| `version`     | `string` | 否     | AgentSpec version                 |
| `label`       | `string` | 否     | AgentSpec label                   |
| `md5`         | `string` | 否     | AgentSpec content MD5 for exact version matching |

#### 返回数据

Return body follows [Nacos open API common response format](overview/api-overview.md#32-http-api-统一返回体格式); this table describes fields in `data`.

| 参数名          | 参数类型      | 描述说明                      |
|--------------|-----------|---------------------------|
| `namespaceId` | `string` | Namespace of the AgentSpec |
| `name`        | `string` | AgentSpec name             |
| `description` | `string` | AgentSpec description      |
| `bizTags`     | `string` | AgentSpec business tags    |
| `content`     | `string` | AgentSpec content          |
| `resource`    | `object` | AgentSpec resource info    |

#### 示例

* 请求示例

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/client/ai/agentspecs?name=my-agent'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 3.3. Search AgentSpecs

#### 接口描述

This interface allows paginated searching of AgentSpecs by namespace and keyword.

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/client/ai/agentspecs/search`

#### 请求参数

| 参数名           | 类型       | 必填    | 参数描述                              |
|---------------|----------|-------|-----------------------------------|
| `namespaceId` | `string` | 否     | Namespace ID, default is `public` |
| `keyword`     | `string` | 否     | Search keyword                    |
| `pageNo`      | `integer` | **是** | Page number, typically starts from `1` |
| `pageSize`    | `integer` | **是** | Number of records per page        |

#### 返回数据

Return body follows [Nacos open API common response format](overview/api-overview.md#32-http-api-统一返回体格式); this table describes fields in `data`.

| 参数名    | 参数类型     | 描述说明                                              |
|--------|----------|---------------------------------------------------|
| `data` | `string` | AgentSpec search result (paginated object, actual fields depend on runtime response) |

#### 示例

* 请求示例

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/client/ai/agentspecs/search?keyword=agent&pageNo=1&pageSize=10'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 3.4. Download Skill

#### 接口描述

This interface allows downloading a Skill ZIP file by namespace, name, version, or label.

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/client/ai/skills`

#### 请求参数

| 参数名           | 类型       | 必填    | 参数描述                              |
|---------------|----------|-------|-----------------------------------|
| `namespaceId` | `string` | 否     | Namespace ID, default is `public` |
| `name`        | `string` | **是** | Skill name                        |
| `version`     | `string` | 否     | Skill version                     |
| `label`       | `string` | 否     | Skill label                       |
| `md5`         | `string` | 否     | Skill content MD5 for exact version matching |

#### 示例

* 请求示例

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/client/ai/skills?name=my-skill'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```
