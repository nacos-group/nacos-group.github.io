---
title: Nacos Open API Overview
keywords: [OPEN API]
description: Nacos Open API Overview
sidebar:
    order: 2
---

# Nacos Open API 概览

## 1. Nacos Open API 分类

Nacos 3.0 为了匹配不同使用场景，同时也为了能够让不同类型的API实施不同的安全认证机制，将Open API进行了多维度的分类：

- **Client Open API** : 用于客户端和应用程序的OpenAPI，客户端和应用程序通过OpenAPI与Nacos进行数据交互，主要为微服务类型、普通应用程序及AI Agent应用提供精确的数据数据访问能力，这类应用的主要特点是对于需要访问的资源有着较高的确定性，同时对此类API的性能及响应速度要求较高。
- **Admin Open API** : 用于运维人员和管理平面的OpenAPI，管理平面通过OpenAPI与Nacos进行数据交互，主要为运维人员、监控人员、审计人员及各种运维工具提供大范围的数据检索访问能力，这类应用或调用者的主要特点是可能需要对不确定性或大访问的数据进行检索，但调用次数及频率相对较低，并且对响应时间的要求也相对较低。
- **Console Open API** : 用于控制台的OpenAPI，控制台通过OpenAPI与Nacos进行数据交互，主要为控制台提供数据检索及数据修改的能力，此类应用或调用者的主要特点是需要与`Admin Open API`相似，但更关注`数据`类型的API，对控制`Nacos`本身的的要求相对较低。

## 2. Nacos Open API 访问协议

Nacos 3.0 主要支持两种访问协议， 分别为 [gRPC](https://www.grpc.io) 和 [HTTP 1.1](https://datatracker.ietf.org/doc/html/rfc7230)（下文简称HTTP）。根据不同的Nacos Open API分类的特点，分别使用不同的协议进行。

- **Client Open API** : 主要使用 [gRPC](https://www.grpc.io)协议进行访问，相比与[HTTP 1.1](https://datatracker.ietf.org/doc/html/rfc7230)， gRPC基于性能更高的 HTTP 2协议进行构建， 同时使用了多语言通用的protobuf序列化能力，能够快速构建多种编程语言的通信协议客户端，更能满足**Client Open API**对于高吞吐及响应速度的要求。考虑到部分编程语言可能未提供稳定的gRPC能力，**Client Open API**也提供HTTP 1.1协议的部分接口，允许开发者选择适合自己的编程语言进行开发。
- **Admin Open API** 和 **Console Open API** : 使用[HTTP 1.1](https://datatracker.ietf.org/doc/html/rfc7230)协议进行访问，允许开发者使用任何编程语言进行开发，同时对浏览器UI等有更好的兼容性。

## 3. Nacos Open API 定义规范

### 3.1. gRPC API 统一返回体格式

3.0版本的gRPC Open API，所有接口请求的响应均通过[proto文件](https://github.com/alibaba/nacos/blob/develop/api/src/main/proto/nacos_grpc_service.proto)中的`Payload`承载，必然包含字段如下

|      名称      |   类型   | 描述                                                           |
|:------------:|:------:|:-------------------------------------------------------------
| `resultCode` |  int   | API调用的结果码，`200`代表执行成功，`500`代表执行失败。                           |
| `errorCode`  |  int   | API调用的错误码，若状态码为`500`时存在此值，具体错误码请参考[API 错误码汇总](#33-api-错误码汇总) |
|  `message`   | string | API调用的信息，若状态码为`500`时存在此值，描述错误的具体信息                           |
| `requestId`  | string | API调用的请求I。                                                   |

### 3.2. HTTP API 统一返回体格式

3.0版本HTTP Open API，所有接口请求的响应均为`json`类型的返回体，返回体具有相同的格式

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

### 3.3. API 错误码汇总

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
