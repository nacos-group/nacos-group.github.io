---
title: Open API 手册
keywords: [ Open API,手册 ]
description: Open API 手册
sidebar:
  order: 7
---

# Open API 手册

:::note
Nacos 3.X 版本将不再兼容1.X版本的OpenAPI，同时不再兼容2.X版本的HTTP OpenAPI，请使用Nacos 3.X版本的OpenAPI进行替换。

Nacos 3.X 的 HTTP OpenAPI **主要面向不支持 gRPC 的编程语言开发客户端使用**，其设计目的是为`普通应用`、`微服务应用`
，以及其他 `非管控类` 和 `非网关类` 应用提供配置获取、服务注册与发现的功能支持。

该接口仅提供单服务或单配置级别的数据操作能力（例如对单个服务或配置项的增删改查），不支持范围型聚合操作（如查询全部服务列表、配置列表等批量数据接口）。

如有`管控类`和`网关类`的应用需求，需要使用范围型数据操作接口，请使用[Admin API](../admin/admin-api.md)。
:::

## 0. Swagger 类型文档

Nacos 3.X 的客户端 Open API 也提供了Swagger风格的文档，您可以通过访问[Nacos Swagger HTTP 客户端 API](/swagger/client/)查看。

## 1. 文档规定

### 1.1. API 统一返回体格式

2.0版本Open API，所有接口请求的响应均为`json`类型的返回体，返回体具有相同的格式

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

返回体中各字段的含义如下表所示

|    名称     |    类型    | 描述                             |
|:---------:|:--------:|--------------------------------|
|  `code `  |  `int`   | 错误码，`0`代表执行成功，非`0`代表执行失败的某一种情况 |
| `message` | `String` | 错误码提示信息，执行成功为"`success`"       |
|  `data`   |   任意类型   | 返回数据，执行失败时为详细出错信息              |

> 由于执行成功的情况下code字段与message字段相同，后续在介绍接口的返回结果时，只介绍返回数据的data字段

### 1.2. API 错误码汇总

API接口返回体中的错误码及对应提示信息汇总见下表

| 错误码     | 提示信息                         | 含义                 |
|---------|------------------------------|--------------------|
| `0`     | `success`                    | 成功执行               |
| `10000` | `parameter missing`          | 参数缺失               |
| `10001` | `access denied`              | 访问拒绝               |
| `10002` | `data access error`          | 数据访问错误             |
| `20001` | `'tenant' parameter error`   | `tenant`参数错误       |
| `20002` | `parameter validate error`   | 参数验证错误             |
| `20003` | `MediaType Error`            | 请求的`MediaType`错误   |
| `20004` | `resource not found`         | 资源未找到              |
| `20005` | `resource conflict`          | 资源访问冲突             |
| `20006` | `config listener is null`    | 监听配置为空             |
| `20007` | `config listener error`      | 监听配置错误             |
| `20008` | `invalid dataId`             | 无效的`dataId`（鉴权失败）  |
| `20009` | `parameter mismatch`         | 请求参数不匹配            |
| `21000` | `service name error`         | `serviceName`服务名错误 |
| `21001` | `weight error`               | `weight`权重参数错误     |
| `21002` | `instance metadata error`    | 实例`metadata`元数据错误  |
| `21003` | `instance not found`         | `instance`实例不存在    |
| `21004` | `instance error`             | `instance`实例信息错误   |
| `21005` | `service metadata error`     | 服务`metadata`元数据错误  |
| `21006` | `selector error`             | 访问策略`selector`错误   |
| `21007` | `service already exist`      | 服务已存在              |
| `21008` | `service not exist`          | 服务不存在              |
| `21009` | `service delete failure`     | 存在服务实例，服务删除失败      |
| `21010` | `healthy param miss`         | `healthy`参数缺失      |
| `21011` | `health check still running` | 健康检查仍在运行           |
| `22000` | `illegal namespace`          | 命名空间`namespace`不合法 |
| `22001` | `namespace not exist`        | 命名空间不存在            |
| `22002` | `namespace already exist`    | 命名空间已存在            |
| `23000` | `illegal state`              | 状态`state`不合法       |
| `23001` | `node info error`            | 节点信息错误             |
| `23002` | `node down failure`          | 节点离线操作出错           |
| ...     | ...                          | ...                |
| `30000` | `server error`               | 其他内部错误             |

## 2. 配置管理

:::note
Nacos 3.X 的HTTP OpenAPI 不提供配置的发布和删除接口，`普通应用`、`微服务应用`，以及其他 `非管控类` 和 `非网关类` 应用*应该*
为配置的使用方而非发布方；若需要进行配置发布和删除操作，请使用[运维 API](../admin/admin-api.md)。

另外，由于Nacos 3.X 即将移除配置长轮询监听相关的功能，仅保留通过长连接进行配置监听，因此Nacos 3.X 的HTTP OpenAPI
不提供配置的监听接口。您可以通过轮询`获取配置`，比对前后的`md5`来判断是否需要更新配置。
:::

### 2.1. 获取配置

#### 接口描述

获取指定配置

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/client/cs/config`

#### 请求头

| 参数名              | 参数类型     | 是否必填 | 描述说明                                                        |
|------------------|----------|------|-------------------------------------------------------------|
| `User-Agent`     | `String` | 否    | 用户代理，默认为空，通常为`Nacos-${program-language}-Client:v${version}  |
| `Client-Version` | `String` | 否    | 客户端版本，默认为空，通常为`Nacos-${program-language}-Client:v${version} |

#### 请求参数

| 参数名           | 类型       | 必填    | 参数描述                     |
|---------------|----------|-------|--------------------------|
| `namespaceId` | `String` | 否     | 命名空间，默认为`public`与 `''`相同 |
| `groupName`   | `String` | **是** | 配置分组名                    |
| `dataId`      | `String` | **是** | 配置名                      |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                | 参数类型      | 描述                       |
|--------------------|-----------|--------------------------|
| `content`          | `String`  | 配置内容                     |
| `encryptedDataKey` | `String`  | 配置的加解密密钥，仅在使用配置加解密插件时有此值 |
| `contentType`      | `String`  | 配置的类型，如`TEXT`,`JSON`等    |
| `md5`              | `String`  | 配置的md5值                  |
| `lastModified`     | `String`  | 配置的最后修改时间                |
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

## 3. 服务发现

:::note
Nacos 3.X 的HTTP OpenAPI 不提供查询所有服务列表等接口，`普通应用`、`微服务应用`，以及其他 `非管控类` 和 `非网关类` 应用
*应该*仅需要注册为某一服务的实例，或从某一服务中注销自身，亦或获取已知的下游服务的实例列表进行实际的业务调用，不应该获取所有注册中心中的服务列表。

若需要获取所有服务列表，请使用[运维 API](../admin/admin-api.md)。
:::

### 3.1. 注册实例/续约实例

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

#### 请求方式

`POST`

`Content-Type:application/x-www-form-urlencoded`

#### 请求URL

`/nacos/v3/client/ns/instance`

#### 请求头

| 参数名              | 参数类型     | 是否必填 | 描述说明                                                        |
|------------------|----------|------|-------------------------------------------------------------|
| `User-Agent`     | `String` | 否    | 用户代理，默认为空，通常为`Nacos-${program-language}-Client:v${version}  |
| `Client-Version` | `String` | 否    | 客户端版本，默认为空，通常为`Nacos-${program-language}-Client:v${version} |

#### 请求Body

| 参数名           | 参数类型           | 是否必填  | 描述说明                   |
|---------------|----------------|-------|------------------------|
| `namespaceId` | `String`       | 否     | 命名空间`Id`，默认为`public`   |
| `groupName`   | `String`       | 否     | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName` | `String`       | **是** | 服务名                    |
| `ip`          | `String`       | **是** | `IP`地址                 |
| `port`        | `int`          | **是** | 端口号                    |
| `clusterName` | `String`       | 否     | 集群名称，默认为`DEFAULT`      |
| `healthy`     | `boolean`      | 否     | 是否只查找健康实例，默认为`true`    |
| `weight`      | `double`       | 否     | 实例权重，默认为`1.0`          |
| `enabled`     | `boolean`      | 否     | 是否可用，默认为`true`         |
| `metadata`    | `JSON格式String` | 否     | 实例元数据                  |
| `ephemeral`   | `boolean`      | 否     | 是否为临时实例                |
| `heartBeat`   | `boolean`      | 否     | 是否为续约请求，默认为`false`     |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述                             |
|--------|----------|--------------------------------|
| `data` | `String` | 是否注册、续约成功，成功时返回`ok`，失败时返回失败原因。 |

#### 示例

* 请求示例

```shell
# 注册实例
curl -X POST "127.0.0.1:8848/nacos/v3/client/ns/instance" -d "serviceName=test1&ip=127.0.0.1&port=3306"

# 续约实例
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

### 3.2. 注销实例

#### 接口描述

注销指定实例

#### 请求方式

`DELETE`

`Content-Type:application/x-www-form-urlencoded`

#### 请求URL

`/nacos/v3/client/ns/instance`

#### 请求头

| 参数名              | 参数类型     | 是否必填 | 描述说明                                                        |
|------------------|----------|------|-------------------------------------------------------------|
| `User-Agent`     | `String` | 否    | 用户代理，默认为空，通常为`Nacos-${program-language}-Client:v${version}  |
| `Client-Version` | `String` | 否    | 客户端版本，默认为空，通常为`Nacos-${program-language}-Client:v${version} |

#### 请求Body

| 参数名           | 参数类型      | 是否必填  | 描述说明                   |
|---------------|-----------|-------|------------------------|
| `namespaceId` | `String`  | 否     | 命名空间`Id`，默认为`public`   |
| `groupName`   | `String`  | 否     | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName` | `String`  | **是** | 服务名                    |
| `ip`          | `String`  | **是** | `IP`地址                 |
| `port`        | `int`     | **是** | 端口号                    |
| `clusterName` | `String`  | 否     | 集群名称，默认为`DEFAULT`      |
| `ephemeral`   | `boolean` | 否     | 是否为临时实例                |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述                          |
|--------|----------|-----------------------------|
| `data` | `String` | 是否注销成功，成功时返回`ok`，失败时返回失败原因。 |

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

### 3.3. 查询指定服务的实例列表

#### 接口描述

查询指定服务下的实例详情信息列表

:::note
由于Nacos3.X即将移除UDP类型的推送支持，因此对于不支持Grpc长连接推送的客户端，需要定期进行一次实例列表的拉取，以保证客户端能及时感知到实例列表的变化，以实现订阅服务的功能。
:::

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/client/ns/instance/list`

#### 请求头

| 参数名              | 参数类型     | 是否必填 | 描述说明                                                        |
|------------------|----------|------|-------------------------------------------------------------|
| `User-Agent`     | `String` | 否    | 用户代理，默认为空，通常为`Nacos-${program-language}-Client:v${version}  |
| `Client-Version` | `String` | 否    | 客户端版本，默认为空，通常为`Nacos-${program-language}-Client:v${version} |

#### 请求参数

| 参数名           | 参数类型      | 是否必填  | 描述说明                    |
|---------------|-----------|-------|-------------------------|
| `namespaceId` | `String`  | 否     | 命名空间`Id`，默认为`public`    |
| `groupName`   | `String`  | 否     | 分组名，默认为`DEFAULT_GROUP`  |
| `serviceName` | `String`  | **是** | 服务名                     |
| `clusterName` | `String`  | 否     | 集群名称，默认为`DEFAULT`       |
| `healthyOnly` | `boolean` | 否     | 是否只获取健康实例，默认为`false`    |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                  | 参数类型       | 描述说明      |
|--------------------------------------|------------|-----------|
| `data`                               | `Object[]` | 实例列表      |
| `data.[i].ip`                        | `String`   | 实例`IP`    |
| `data.[i].port`                      | `int`      | 实例端口号     |
| `data.[i].weight`                    | `double`   | 实例权重      |
| `data.[i].healthy`                   | `boolean`  | 实例是否健康    |
| `data.[i].enabled`                   | `boolean`  | 实例是否可用    |
| `data.[i].ephemeral`                 | `boolean`  | 是否为临时实例   |
| `data.[i].clusterName`               | `String`   | 实例所在的集群名称 |
| `data.[i].serviceName`               | `String`   | 服务名       |
| `data.[i].metadata`                  | `map`      | 实例元数据     |
| `data.[i].instanceHeartBeatTimeOut`  | `int`      | 实例心跳超时时间  |
| `data.[i].ipDeleteTimeout`           | `int`      | 实例删除超时时间  |
| `data.[i].instanceHeartBeatInterval` | `int`      | 实例心跳间隔    |

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
