---
title: 客户端API
keywords: [ Open API,手册 ]
description: Open API 手册
sidebar:
  order: 7
---

# 客户端API

:::note
Nacos 3.X 版本将不再兼容1.X版本的OpenAPI，同时不再兼容2.X版本的HTTP OpenAPI，请使用Nacos 3.X版本的OpenAPI进行替换。

Nacos 3.X 的 HTTP OpenAPI **主要面向不支持 gRPC 的编程语言开发客户端使用**，其设计目的是为`普通应用`、`微服务应用`
，以及其他 `非管控类` 和 `非网关类` 应用提供配置获取、服务注册与发现的功能支持。

该接口仅提供单服务或单配置级别的数据操作能力（例如对单个服务或配置项的增删改查），不支持范围型聚合操作（如查询全部服务列表、配置列表等批量数据接口）。

如有`管控类`和`网关类`的应用需求，需要使用范围型数据操作接口，请使用[Admin API](../admin/admin-api.md)。
:::

> 使用默认鉴权插件时如何获取和配置访问凭据，请参见[配置访问凭据](./auth.mdx)。

## 0. 客户端API 相关说明

### 0.1. 适用边界

客户端 API 面向应用运行时和自定义客户端。调用者通常已经知道要访问的 `namespaceId`、`groupName`、`dataId`、`serviceName` 或实例信息。

| 适合使用 | 不适合使用 |
| --- | --- |
| 查询单个已知配置。 | 发布、删除、导入、导出配置。 |
| 注册、注销、查询和发现已知服务或实例。 | 查询全量配置列表、全量服务列表、订阅者列表等范围型数据。 |
| 在缺少合适 SDK 的语言中，通过 HTTP 完成少量运行时访问。 | 构建发布平台、运维平台、网关管控面或审计工具。 |

业务应用优先使用 [SDK](./overview/other-language.md)。需要范围型管理能力时，请使用[运维 API](../admin/admin-api.md)或[运维 SDK](../admin/maintainer-sdk.md)。

### 0.2. 统一路径格式

Nacos的客户端API，使用统一的Path格式进行的规范。格式为`[/$nacos.server.contextPath]/v3/client/[module]/[subPath]...`,
其中

- `$nacos.server.contextPath`：客户端API的根路径，默认为`/nacos`，可以通过`nacos.server.contextPath`配置项进行修改。
- `module`：客户端API模块名称，例如`server`、`cs`、`ns`、`core`等。
- `subPath`：客户端API的子路径，例如`state`、`namespace`、`config`等， 可能有多层子路径。

下列列出的客户端API，采用默认`$nacos.server.contextPath`的情况进行展示，若已修改部署环境中的`$nacos.server.contextPath`
配置项，请自行修改调用API时的请求URL。

同时下列列出的客户端API样例中，均采用默认Nacos Web Server的端口进行展示，若已修改部署环境中的`$nacos.server.main.port`
配置项，请自行修改调用API时的请求URL。

### 0.3. Swagger 类型文档

Nacos 3.X 的客户端 Open API 也提供了Swagger风格的文档，您可以通过访问[Nacos Swagger HTTP 客户端 API](/swagger/client/)查看。

## 1. 配置管理

:::note
Nacos 3.X 的HTTP OpenAPI 不提供配置的发布和删除接口，`普通应用`、`微服务应用`，以及其他 `非管控类` 和 `非网关类` 应用*应该*
为配置的使用方而非发布方；若需要进行配置发布和删除操作，请使用[运维 API](../admin/admin-api.md)。

另外，由于Nacos 3.X 即将移除配置长轮询监听相关的功能，仅保留通过长连接进行配置监听，因此Nacos 3.X 的HTTP OpenAPI
不提供配置的监听接口。您可以通过轮询`获取配置`，比对前后的`md5`来判断是否需要更新配置。
:::

### 1.1. 获取配置

#### 接口描述

获取指定配置

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/client/cs/config`

#### 请求头

| 参数名              | 参数类型     | 是否必填 | 描述说明                                                        |
|------------------|----------|------|-------------------------------------------------------------|
| `User-Agent`     | `string` | 否    | 用户代理，默认为空，通常为`Nacos-${program-language}-Client:v${version}  |
| `Client-Version` | `string` | 否    | 客户端版本，默认为空，通常为`Nacos-${program-language}-Client:v${version} |

#### 请求参数

| 参数名           | 类型       | 必填    | 参数描述                     |
|---------------|----------|-------|--------------------------|
| `namespaceId` | `string` | 否     | 命名空间，默认为`public`与 `''`相同 |
| `groupName`   | `string` | **是** | 配置分组名                    |
| `dataId`      | `string` | **是** | 配置名                      |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                | 参数类型      | 描述                       |
|--------------------|-----------|--------------------------|
| `content`          | `string` | 配置内容                     |
| `encryptedDataKey` | `string` | 配置的加解密密钥，仅在使用配置加解密插件时有此值 |
| `contentType`      | `string` | 配置的类型，如`TEXT`,`JSON`等    |
| `md5`              | `string` | 配置的md5值                  |
| `lastModified`     | `integer` | 配置的最后修改时间                |
| `beta`             | `boolean` | 配置是否有灰度配置                |

其他字段为预留字段，暂时无用，忽略即可。

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

## 2. 服务发现

:::note
Nacos 3.X 的HTTP OpenAPI 不提供查询所有服务列表等接口，`普通应用`、`微服务应用`，以及其他 `非管控类` 和 `非网关类` 应用
*应该*仅需要注册为某一服务的实例，或从某一服务中注销自身，亦或获取已知的下游服务的实例列表进行实际的业务调用，不应该获取所有注册中心中的服务列表。

若需要获取所有服务列表，请使用[运维 API](../admin/admin-api.md)。
:::

### 2.1. 注册实例/续约实例

#### 接口描述

注册或续约一个实例

:::note
当通过HTTP OpenAPI注册的实例为**临时实例**时，需要定期对实例进行续约，在Nacos3.X的HTTP
OpenAPI中，续约此实例的API和注册实例的API进行了合并，通过参数`heartBeat`进行区分。

当为续约请求时， Nacos不会对请求中的元数据等内容进行解析，即续约请求将会忽略传入的`healthy`,`weight`,`enabled`,`metadata`
字段。
当续约请求返回的错误码为`21003`
时，说明该实例已过期被移除，需要重新进行注册，此时客户端应带上完整的信息，同时设置`heartBeat=false`进行重新注册，重新注册成功后再进行续约请求。

若连续调用注册请求，也可以起到`续约实例`的作用，但是是通过`更新实例`的方式进行续约，会耗费更多的性能，因此请在注册成功后进行续约操作而非继续进行注册更新。
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
| `User-Agent`     | `string` | 否    | 用户代理，默认为空，通常为`Nacos-${program-language}-Client:v${version}  |
| `Client-Version` | `string` | 否    | 客户端版本，默认为空，通常为`Nacos-${program-language}-Client:v${version} |

#### 请求参数

| 参数名           | 参数类型           | 必填    | 参数描述                   |
|---------------|----------------|-------|------------------------|
| `namespaceId` | `string` | 否     | 命名空间`Id`，默认为`public`   |
| `groupName`   | `string` | 否     | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName` | `string` | **是** | 服务名                    |
| `ip`          | `string` | **是** | `IP`地址                 |
| `port`        | `integer` | **是** | 端口号                    |
| `clusterName` | `string` | 否     | 集群名称，默认为`DEFAULT`      |
| `healthy`     | `boolean` | 否     | 是否只查找健康实例，默认为`true`    |
| `weight`      | `number` | 否     | 实例权重，默认为`1.0`          |
| `enabled`     | `boolean` | 否     | 是否可用，默认为`true`         |
| `metadata`    | `string` | 否     | 实例元数据，JSON 对象字符串        |
| `heartBeat`   | `boolean` | 否     | 是否为续约请求，默认为`false`     |
| `ephemeral`   | `boolean` | 否     | 是否为临时实例                    |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述                             |
|--------|----------|--------------------------------|
| `data` | `string` | 是否注册、续约成功，成功时返回`ok`，失败时返回失败原因。 |

#### 示例

* 请求示例

```shell
# 注册实例
curl -X POST "127.0.0.1:8848/nacos/v3/client/ns/instance" -d "serviceName=test1&ip=127.0.0.1&port=3306&ephemeral=true"

# 续约实例
curl -X POST "127.0.0.1:8848/nacos/v3/client/ns/instance" -d "serviceName=test1&ip=127.0.0.1&port=3306&heartBeat=true&ephemeral=true"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.2. 注销实例

#### 接口描述

注销指定实例

#### 起始版本

`3.0.0`

#### 请求方式

`DELETE`

#### 请求URL

`/nacos/v3/client/ns/instance`

#### 请求头

| 参数名              | 参数类型     | 是否必填 | 描述说明                                                        |
|------------------|----------|------|-------------------------------------------------------------|
| `User-Agent`     | `string` | 否    | 用户代理，默认为空，通常为`Nacos-${program-language}-Client:v${version}  |
| `Client-Version` | `string` | 否    | 客户端版本，默认为空，通常为`Nacos-${program-language}-Client:v${version} |

#### 请求参数

| 参数名           | 参数类型      | 必填    | 参数描述                   |
|---------------|-----------|-------|------------------------|
| `namespaceId` | `string` | 否     | 命名空间`Id`，默认为`public`   |
| `groupName`   | `string` | 否     | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName` | `string` | **是** | 服务名                    |
| `ip`          | `string` | **是** | `IP`地址                 |
| `port`        | `integer` | **是** | 端口号                    |
| `clusterName` | `string` | 否     | 集群名称，默认为`DEFAULT`      |
| `ephemeral`   | `boolean` | 否     | 是否为临时实例                |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述                          |
|--------|----------|-----------------------------|
| `data` | `string` | 是否注销成功，成功时返回`ok`，失败时返回失败原因。 |

#### 示例

* 请求示例

```shell
curl -X DELETE "127.0.0.1:8848/nacos/v3/client/ns/instance?serviceName=test1&ip=127.0.0.1&port=3306&ephemeral=true"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.3. 查询指定服务的实例列表

#### 接口描述

查询指定服务下的实例详情信息列表

:::note
由于Nacos3.X即将移除UDP类型的推送支持，因此对于不支持Grpc长连接推送的客户端，需要定期进行一次实例列表的拉取，以保证客户端能及时感知到实例列表的变化，以实现订阅服务的功能。
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
| `User-Agent`     | `string` | 否    | 用户代理，默认为空，通常为`Nacos-${program-language}-Client:v${version}  |
| `Client-Version` | `string` | 否    | 客户端版本，默认为空，通常为`Nacos-${program-language}-Client:v${version} |

#### 请求参数

| 参数名           | 参数类型      | 是否必填  | 描述说明                    |
|---------------|-----------|-------|-------------------------|
| `namespaceId` | `string` | 否     | 命名空间`Id`，默认为`public`    |
| `groupName`   | `string` | 否     | 分组名，默认为`DEFAULT_GROUP`  |
| `serviceName` | `string` | **是** | 服务名                     |
| `clusterName` | `string` | 否     | 集群名称，不传则查询所有集群的实例       |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                  | 参数类型       | 描述说明      |
|--------------------------------------|------------|-----------|
| `data`                               | `array` | 实例列表      |
| `data.[i].ip`                        | `string` | 实例`IP`    |
| `data.[i].port`                      | `integer` | 实例端口号     |
| `data.[i].weight`                    | `number` | 实例权重      |
| `data.[i].healthy`                   | `boolean` | 实例是否健康    |
| `data.[i].enabled`                   | `boolean` | 实例是否可用    |
| `data.[i].ephemeral`                 | `boolean` | 是否为临时实例   |
| `data.[i].clusterName`               | `string` | 实例所在的集群名称 |
| `data.[i].serviceName`               | `string` | 服务名       |
| `data.[i].metadata`                  | `map<string, string>` | 实例元数据     |
| `data.[i].instanceHeartBeatTimeOut`  | `integer` | 实例心跳超时时间  |
| `data.[i].ipDeleteTimeout`           | `integer` | 实例删除超时时间  |
| `data.[i].instanceHeartBeatInterval` | `integer` | 实例心跳间隔    |

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

## 3. AI 相关

### 3.1. 查询 Prompt

#### 接口描述

通过该接口，可按 version、label 或 latest 查询 Prompt，优先级 version > label > latest；支持 md5 条件返回 304。

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/client/ai/prompt`

#### 请求参数

| 参数名           | 类型       | 必填    | 参数描述                     |
|---------------|----------|-------|--------------------------|
| `namespaceId` | `string` | 否     | 命名空间，默认为`public`           |
| `promptKey`   | `string` | **是** | Prompt 键名                  |
| `version`     | `string` | 否     | 版本号，与 label、latest 三选一     |
| `label`       | `string` | 否     | 标签，与 version、latest 三选一    |
| `md5`         | `string` | 否     | 若与服务端一致则返回 304            |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                | 参数类型      | 描述           |
|--------------------|-----------|--------------|
| `promptKey`        | `string` | Prompt 键名    |
| `version`          | `string` | 版本号          |
| `template`         | `string` | Prompt 模板内容   |
| `md5`              | `string` | 内容 md5，用于 304 判断 |
| `variables`        | `array` | Prompt 变量列表   |

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

### 3.2. 获取 AgentSpec

#### 接口描述

通过该接口，可按命名空间、名称、版本号或 label 获取指定 AgentSpec 详情。

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/client/ai/agentspecs`

#### 请求参数

| 参数名           | 类型       | 必填    | 参数描述                    |
|---------------|----------|-------|-------------------------|
| `namespaceId` | `string` | 否     | 命名空间，默认为`public`          |
| `name`        | `string` | **是** | AgentSpec 名称            |
| `version`     | `string` | 否     | AgentSpec 版本号           |
| `label`       | `string` | 否     | AgentSpec 标签            |
| `md5`         | `string` | 否     | AgentSpec 内容 MD5，用于精确匹配指定版本 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名          | 参数类型      | 描述说明               |
|--------------|-----------|--------------------|
| `namespaceId` | `string` | AgentSpec 所属命名空间   |
| `name`        | `string` | AgentSpec 名称       |
| `description` | `string` | AgentSpec 描述       |
| `bizTags`     | `string` | AgentSpec 业务标签      |
| `content`     | `string` | AgentSpec 内容        |
| `resource`    | `object` | AgentSpec 资源信息      |

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

### 3.3. 搜索 AgentSpec

#### 接口描述

通过该接口，可按命名空间和关键词分页搜索 AgentSpec。

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/client/ai/agentspecs/search`

#### 请求参数

| 参数名           | 类型       | 必填    | 参数描述                      |
|---------------|----------|-------|---------------------------|
| `namespaceId` | `string` | 否     | 命名空间，默认为`public`            |
| `keyword`     | `string` | 否     | 搜索关键字                      |
| `pageNo`      | `integer` | **是** | 页码，通常从 `1` 开始               |
| `pageSize`    | `integer` | **是** | 每页返回条数                     |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述说明                     |
|--------|----------|--------------------------|
| `data` | `string` | AgentSpec 搜索结果（分页结构，具体字段以实际返回为准） |

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

### 3.4. 下载 Skill

#### 接口描述

通过该接口，可按命名空间、名称、版本号或 label 下载 Skill ZIP 文件。

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/client/ai/skills`

#### 请求参数

| 参数名           | 类型       | 必填    | 参数描述                    |
|---------------|----------|-------|-------------------------|
| `namespaceId` | `string` | 否     | 命名空间，默认为`public`          |
| `name`        | `string` | **是** | Skill 名称                |
| `version`     | `string` | 否     | Skill 版本号               |
| `label`       | `string` | 否     | Skill 标签                |
| `md5`         | `string` | 否     | Skill 内容 MD5，用于精确匹配指定版本 |

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

> **Agent 管理 API 说明：** 以下 Agent API（3.5～3.10）是后续推荐的统一集成方向，未来将逐步替代现有 A2A 管理 API。新接入的用户和 SDK 应优先对接并兼容这些 Agent 管理 API，避免为新集成继续依赖旧 A2A API；已有 A2A 集成可依据后续版本发布和迁移说明逐步切换。这里描述的是管理 API 的演进，不表示 A2A 协议本身已废弃。

### 3.5. 发现 Agent

#### 接口描述

发现指定的可见 Agent 版本及当前匹配的端点集合。携带 `X-Nacos-Client-Id` 时只续约已存在的 HTTP Client，不能替代 Publisher 心跳。

#### 起始版本

`3.3.0`

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/client/ai/agents`

#### 请求头

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `X-Nacos-Client-Id` | `string` | 否 | 已有逻辑 HTTP Client 的可选稳定标识；携带时长度必须为 1～256、匹配 [A-Za-z0-9._:-]+，并与该客户端发布 Endpoint 时使用的值保持一致。Search 和 Discover 只续约已存在的 Client 生命周期，不会创建空 Client，也不会续约 Publisher 活性，因此不能替代 Publisher heartbeat。 |

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Agent 所属命名空间，默认为 `public`。 |
| `agentName` | `string` | **是** | 要发现的 Agent 名称。 |
| `version` | `string` | 否 | 要发现的精确 Agent 版本，与 `label` 互斥。 |
| `label` | `string` | 否 | 用于选择 Agent 版本的标签，与 `version` 互斥。 |
| `protocol` | `array<string>` | 否 | 可重复提交的协议过滤参数，用于匹配调用接口。 |
| `protocolVersion` | `string` | 否 | 用于匹配调用接口的协议版本。 |
| `transport` | `array<string>` | 否 | 可重复提交的传输方式过滤参数，用于匹配端点。 |
| `endpointSource` | `array<string>` | 否 | 可重复提交的端点来源过滤参数，值为 `RUNTIME` 或 `DECLARED`。 |
| `metadataSelector` | `string` | 否 | URL 编码的端点元数据选择器 JSON 对象。 |

`version` 和 `label` 均省略时，返回 `latest` 定义元数据，并保留兼容任一当前在线版本的 Runtime Endpoint；显式指定 `label=latest` 时，只保留与 `latest` 版本匹配的 Runtime Endpoint。

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](overview/api-overview.md#32-http-api-统一返回体格式)，下表阐述 `data` 及其字段。

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `AgentDiscoveryResult` | Agent 发现结果。 |
| `data.namespaceId` | `string` | Agent 所属命名空间。 |
| `data.agentName` | `string` | Agent 名称。 |
| `data.version` | `string` | 本次发现得到的 Agent 版本。 |
| `data.contentDigest` | `string` | Agent 定义内容摘要。 |
| `data.callInterfaces` | `array<AgentDiscoveryCallInterface>` | Agent 调用接口及其匹配的端点集合。 |
| `data.callInterfaces[i].protocol` | `string` | 调用接口协议。 |
| `data.callInterfaces[i].protocolVersion` | `string` | 调用接口协议版本。 |
| `data.callInterfaces[i].descriptorMediaType` | `string` | 协议原生描述的媒体类型。 |
| `data.callInterfaces[i].nativeDescriptor` | `object` | 协议原生描述内容。 |
| `data.callInterfaces[i].endpointSets` | `array<EndpointSet>` | 按来源组织的端点集合。 |
| `data.callInterfaces[i].endpointSets[i].source` | `string` | 端点来源，取值为 `RUNTIME` 或 `DECLARED`。 |
| `data.callInterfaces[i].endpointSets[i].sourceRevision` | `string` | 端点来源的修订标识。 |
| `data.callInterfaces[i].endpointSets[i].endpoints` | `array<AgentDiscoveryEndpoint>` | 当前来源下匹配的端点。 |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].uri` | `string` | 端点 URI。 |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].transport` | `string` | 端点传输方式。 |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].priority` | `integer` | 端点优先级。 |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].weight` | `number` | 端点权重。 |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].metadata` | `map<string, string>` | 端点元数据。 |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].healthy` | `boolean` | 端点是否健康。 |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].bindings` | `array<RuntimeVersionBinding>` | 端点的运行时版本绑定信息。 |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].bindings[i].runtimeVersion` | `string` | Publisher 运行时版本。 |
| `data.callInterfaces[i].endpointSets[i].endpoints[i].bindings[i].versionRange` | `string` | 该运行时支持的 Agent 版本范围。 |

#### 示例

* 请求示例

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/client/ai/agents?namespaceId=public&agentName=my-agent&version=1.0.0&protocol=a2a' \
  -H 'X-Nacos-Client-Id: 550e8400-e29b-41d4-a716-446655440000'
```

* 返回示例

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

### 3.6. 发布 Agent 定义

#### 接口描述

从应用代码发布指定 Agent 版本，并可选择自动提交评审。

#### 起始版本

`3.3.0`

#### 请求方式

`POST`

请求参数编码为 `application/x-www-form-urlencoded` Form。

#### 请求URL

`/nacos/v3/client/ai/agents`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Agent 所属命名空间，默认为 `public`。 |
| `agentName` | `string` | **是** | 要发布的 Agent 名称。 |
| `version` | `string` | **是** | 要发布的 Agent 版本。 |
| `displayName` | `string` | 否 | Agent 展示名称。 |
| `description` | `string` | 否 | Agent 描述。 |
| `iconUrl` | `string` | 否 | Agent 图标 URL。 |
| `provider` | `string` | 否 | Agent 提供方的 JSON 对象字符串。 |
| `tags` | `string` | 否 | Agent 标签的 JSON 数组字符串。 |
| `extensions` | `string` | 否 | Agent 扩展属性的 JSON 对象字符串。 |
| `callInterfaces` | `string` | 否 | 直接发布的调用接口 JSON 数组字符串，与 `basedOnVersion` 二选一；首次创建 Agent 时必须使用该字段。 |
| `author` | `string` | 否 | Agent 版本作者。 |
| `changeDescription` | `string` | 否 | 本次版本变更说明。 |
| `basedOnVersion` | `string` | 否 | 复制内容所基于的精确 Agent 版本，与 `callInterfaces` 二选一；首次创建 Agent 时不可使用。 |
| `autoSubmit` | `boolean` | 否 | 是否在创建 draft 后执行普通 submit 流程，默认为 `false`；该操作不是强制发布。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](overview/api-overview.md#32-http-api-统一返回体格式)，下表阐述 `data` 及其字段。

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `AgentVersionDetail` | 已发布的 Agent 版本详情。 |
| `data.namespaceId` | `string` | Agent 所属命名空间。 |
| `data.agentName` | `string` | Agent 名称。 |
| `data.version` | `string` | Agent 版本。 |
| `data.status` | `string` | Agent 版本状态。 |
| `data.callInterfaces` | `array<AgentCallInterface>` | Agent 调用接口定义。 |
| `data.callInterfaces[i].protocol` | `string` | 调用接口协议。 |
| `data.callInterfaces[i].protocolVersion` | `string` | 调用接口协议版本。 |
| `data.callInterfaces[i].descriptorMediaType` | `string` | 协议原生描述的媒体类型。 |
| `data.callInterfaces[i].nativeDescriptor` | `object` | 协议原生描述内容。 |
| `data.callInterfaces[i].endpointSourceOrder` | `array<string>` | 端点来源的查询顺序。 |
| `data.callInterfaces[i].declaredEndpoints` | `array<Endpoint>` | Agent 定义中声明的端点。 |
| `data.callInterfaces[i].declaredEndpoints[i].uri` | `string` | 端点 URI。 |
| `data.callInterfaces[i].declaredEndpoints[i].transport` | `string` | 端点传输方式。 |
| `data.callInterfaces[i].declaredEndpoints[i].priority` | `integer` | 端点优先级。 |
| `data.callInterfaces[i].declaredEndpoints[i].weight` | `number` | 端点权重。 |
| `data.callInterfaces[i].declaredEndpoints[i].metadata` | `map<string, string>` | 端点元数据。 |
| `data.callInterfaces[i].declaredEndpoints[i].healthy` | `boolean` | 端点是否健康。 |
| `data.author` | `string` | Agent 版本作者。 |
| `data.changeDescription` | `string` | Agent 版本变更说明。 |
| `data.contentDigest` | `string` | Agent 定义内容摘要。 |
| `data.createTime` | `integer` | 创建时间。 |
| `data.updateTime` | `integer` | 更新时间。 |

#### 示例

* 请求示例

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

* 返回示例

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

### 3.7. 注册 Agent 端点

#### 接口描述

替换某个 HTTP Publisher 针对 Agent 协议发布的完整运行时 Endpoint Batch。同一逻辑客户端在其绑定 namespace 下拥有的全部 Batch 必须复用一个稳定的 `X-Nacos-Client-Id`。返回的 `ClientLivenessInfo` 是服务端实际活性策略：应按 `heartbeatIntervalMillis` 为该 client id 调度一个心跳任务，而不是为每个 Endpoint 或 Batch 分别调度。

#### 起始版本

`3.3.0`

#### 请求方式

`POST`

请求参数编码为 `application/x-www-form-urlencoded` Form；其中 `endpoints` 是 JSON 数组字符串。

#### 请求URL

`/nacos/v3/client/ai/agents/endpoints`

#### 请求头

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `X-Nacos-Client-Id` | `string` | **是** | 逻辑 HTTP Client 必填的稳定 opaque 标识。每个客户端或 SDK 实例生成一个唯一值，建议至少包含 96 bit 随机熵；UUID 是合法值，且长度必须为 1～256、匹配 `[A-Za-z0-9._:-]+`。Endpoint 注册、注销、心跳、重试、Server 切换和 redo 必须复用该值，客户端实例或进程重启后生成新值；互不相关的客户端或进程不得共享同一 id。首次 Endpoint 写入会将该 id 绑定到鉴权主体和 namespace。该 id 归属客户端的全部 Endpoint Publication，是路由标识而非 credential。 |
| `Request-Module` | `string` | **是** | Endpoint Publisher 生命周期操作的必填 Header，请将 `Request-Module` 设置为 `AI`。 |

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Agent 所属命名空间，默认为 `public`。 |
| `agentName` | `string` | **是** | 要注册端点的 Agent 名称。 |
| `runtimeVersion` | `string` | **是** | Publisher 的运行时版本。 |
| `versionRange` | `string` | 否 | 这些端点支持的 Agent 版本范围。 |
| `protocol` | `string` | **是** | 该端点发布对应的 Agent 协议。 |
| `endpoints` | `string` | **是** | 当前 Publisher 完整 Endpoint Batch 的 JSON 数组字符串。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](overview/api-overview.md#32-http-api-统一返回体格式)，下表阐述 `data` 及其字段。

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `ClientLivenessInfo` | 服务端实际生效的 HTTP Client 活性策略。 |
| `data.heartbeatIntervalMillis` | `integer` | 建议的客户端心跳间隔，单位为毫秒。 |
| `data.unhealthyTimeoutMillis` | `integer` | 客户端转为不健康状态的超时时间，单位为毫秒。 |
| `data.expireTimeoutMillis` | `integer` | 客户端及其发布信息过期的超时时间，单位为毫秒。 |

#### 示例

* 请求示例

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

* 返回示例

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

### 3.8. 注销 Agent 端点

#### 接口描述

移除指定 `X-Nacos-Client-Id` 所拥有的、针对某个 Agent 协议的整份 HTTP Publisher Runtime Endpoint Publication。该 Client 仍有任意 Publication 时保留一个 Client 级心跳，最后一份 Publication 移除后停止心跳。

该接口使用专用 Form 绑定 `namespaceId`、`agentName` 和 `protocol` 普通请求参数，不接收 Endpoint 自然键或 JSON 请求体。

#### 起始版本

`3.3.0`

#### 请求方式

`DELETE`

#### 请求URL

`/nacos/v3/client/ai/agents/endpoints`

#### 请求头

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `X-Nacos-Client-Id` | `string` | **是** | 逻辑 HTTP Client 必填的稳定 opaque 标识。每个客户端或 SDK 实例生成一个唯一值，建议至少包含 96 bit 随机熵；UUID 是合法值，且长度必须为 1～256、匹配 `[A-Za-z0-9._:-]+`。Endpoint 注册、注销、心跳、重试、Server 切换和 redo 必须复用该值，客户端实例或进程重启后生成新值；互不相关的客户端或进程不得共享同一 id。首次 Endpoint 写入会将该 id 绑定到鉴权主体和 namespace。该 id 归属客户端的全部 Endpoint Publication，是路由标识而非 credential。 |
| `Request-Module` | `string` | **是** | Endpoint Publisher 生命周期操作的必填 Header，请将 `Request-Module` 设置为 `AI`。 |

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Agent 所属命名空间，默认为 `public`。 |
| `agentName` | `string` | **是** | 要注销端点的 Agent 名称。 |
| `protocol` | `string` | **是** | 要注销端点的 Agent 协议。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](overview/api-overview.md#32-http-api-统一返回体格式)，下表阐述 `data` 字段。

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `Void` | 成功时不返回业务数据，值为 `null`。 |

#### 示例

* 请求示例

```shell
curl -X DELETE '127.0.0.1:8848/nacos/v3/client/ai/agents/endpoints?namespaceId=public&agentName=my-agent&protocol=a2a' \
  -H 'X-Nacos-Client-Id: 550e8400-e29b-41d4-a716-446655440000' \
  -H 'Request-Module: AI'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 3.9. Agent 端点心跳

#### 接口描述

刷新该 `X-Nacos-Client-Id` 对应的 HTTP Client 及其拥有的全部 Agent Endpoint Publication。无论 Endpoint、Agent、协议或 Batch 数量多少，每个 client id 只维护一个心跳任务，禁止按 Endpoint 分别调度。使用注册响应或最新心跳响应中的 `heartbeatIntervalMillis` 作为下一次心跳的等待间隔；后续响应发生变化时重新调度，不要硬编码当前默认值。`unhealthyTimeoutMillis` 和 `expireTimeoutMillis` 是服务端实际阈值，调用方不能通过请求覆盖。Search 和 Discover 不会续约 Publisher 活性。收到 `HTTP_CLIENT_NOT_FOUND (50404)` 后，应先重新注册每个完整期望 Batch，再继续心跳。

#### 起始版本

`3.3.0`

#### 请求方式

`PUT`

#### 请求URL

`/nacos/v3/client/ai/agents/endpoints/heartbeat`

#### 请求头

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `X-Nacos-Client-Id` | `string` | **是** | 逻辑 HTTP Client 必填的稳定 opaque 标识。每个客户端或 SDK 实例生成一个唯一值，建议至少包含 96 bit 随机熵；UUID 是合法值，且长度必须为 1～256、匹配 `[A-Za-z0-9._:-]+`。Endpoint 注册、注销、心跳、重试、Server 切换和 redo 必须复用该值，客户端实例或进程重启后生成新值；互不相关的客户端或进程不得共享同一 id。首次 Endpoint 写入会将该 id 绑定到鉴权主体和 namespace。该 id 归属客户端的全部 Endpoint Publication，是路由标识而非 credential。 |
| `Request-Module` | `string` | **是** | Endpoint Publisher 生命周期操作的必填 Header，请将 `Request-Module` 设置为 `AI`。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](overview/api-overview.md#32-http-api-统一返回体格式)，下表阐述 `data` 及其字段。

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `ClientLivenessInfo` | 服务端实际生效的 HTTP Client 活性策略。 |
| `data.heartbeatIntervalMillis` | `integer` | 建议的客户端心跳间隔，单位为毫秒。 |
| `data.unhealthyTimeoutMillis` | `integer` | 客户端转为不健康状态的超时时间，单位为毫秒。 |
| `data.expireTimeoutMillis` | `integer` | 客户端及其发布信息过期的超时时间，单位为毫秒。 |

#### 示例

* 请求示例

```shell
curl -X PUT '127.0.0.1:8848/nacos/v3/client/ai/agents/endpoints/heartbeat' \
  -H 'X-Nacos-Client-Id: 550e8400-e29b-41d4-a716-446655440000' \
  -H 'Request-Module: AI'
```

* 返回示例

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

### 3.10. 搜索 Agent 目录

#### 接口描述

按名称、标签、协议和分页参数搜索可见的 Agent 目录条目。携带 `X-Nacos-Client-Id` 时只续约已存在的 HTTP Client，不会续约其 Endpoint Publisher 活性。

#### 起始版本

`3.3.0`

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/client/ai/agents/search`

#### 请求头

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `X-Nacos-Client-Id` | `string` | 否 | 已有逻辑 HTTP Client 的可选稳定标识；携带时长度必须为 1～256、匹配 [A-Za-z0-9._:-]+，并与该客户端发布 Endpoint 时使用的值保持一致。Search 和 Discover 只续约已存在的 Client 生命周期，不会创建空 Client，也不会续约 Publisher 活性，因此不能替代 Publisher heartbeat。 |

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Agent 所属命名空间，默认为 `public`。 |
| `agentNameContains` | `string` | 否 | Agent 名称需包含的大小写敏感文本。 |
| `tagsAll` | `array<string>` | 否 | 可重复提交；目录条目必须同时包含全部指定标签。 |
| `protocolsAny` | `array<string>` | 否 | 可重复提交；目录条目匹配任一指定协议即可。 |
| `pageNo` | `integer` | 否 | 请求的页码。 |
| `pageSize` | `integer` | 否 | 每页返回的目录条目数。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](overview/api-overview.md#32-http-api-统一返回体格式)，下表阐述 `data` 及其字段。

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `Page<AgentCatalogEntry>` | Agent 目录分页结果。 |
| `data.totalCount` | `integer` | 符合条件的目录条目总数。 |
| `data.pageNumber` | `integer` | 当前页码。 |
| `data.pagesAvailable` | `integer` | 可用总页数。 |
| `data.pageItems` | `array<AgentCatalogEntry>` | 当前页的 Agent 目录条目。 |
| `data.pageItems[i].agentName` | `string` | Agent 名称。 |
| `data.pageItems[i].displayName` | `string` | Agent 展示名称。 |
| `data.pageItems[i].description` | `string` | Agent 描述。 |
| `data.pageItems[i].iconUrl` | `string` | Agent 图标 URL。 |
| `data.pageItems[i].provider` | `AgentProvider` | Agent 提供方。 |
| `data.pageItems[i].provider.name` | `string` | 提供方名称。 |
| `data.pageItems[i].provider.url` | `string` | 提供方 URL。 |
| `data.pageItems[i].tags` | `array<string>` | Agent 标签。 |
| `data.pageItems[i].latestVersion` | `string` | Agent 最新版本。 |
| `data.pageItems[i].versions` | `array<AgentCatalogVersion>` | Agent 可用版本及其标签、协议。 |
| `data.pageItems[i].versions[i].version` | `string` | Agent 版本。 |
| `data.pageItems[i].versions[i].labels` | `array<string>` | 版本标签。 |
| `data.pageItems[i].versions[i].protocols` | `array<string>` | 版本支持的协议。 |

#### 示例

* 请求示例

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/client/ai/agents/search?namespaceId=public&agentNameContains=agent&tagsAll=assistant&protocolsAny=a2a&pageNo=1&pageSize=10' \
  -H 'X-Nacos-Client-Id: 550e8400-e29b-41d4-a716-446655440000'
```

* 返回示例

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
