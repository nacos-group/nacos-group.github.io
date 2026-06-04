---
title: Nacos Open API 概览
keywords: [OPEN API]
description: Nacos 公开API的概览
sidebar:
    order: 2
---

# Nacos Open API 概览

Nacos Open API 按调用者和使用场景分为 Client Open API、Admin Open API 和 Console Open API。本页用于帮助你先选对 API 类型，并了解统一返回体、错误码等公共约定。

如果已经确定要调用哪一类 API，请直接阅读对应 API 页中的“0. 相关说明”。那里会说明该类 API 的路径前缀、端口、鉴权和 Swagger 入口。

## 1. 先选择 API 类型

| API 类型 | 面向对象 | 适合做什么 | 文档入口 |
| --- | --- | --- | --- |
| Client Open API | 普通应用、微服务应用、AI Agent 应用、自定义客户端 | 查询已知配置，注册、注销、查询和发现已知服务。它面向确定资源，范围要小，调用频率可能较高。 | [客户端 API](../open-api.md) |
| Admin Open API | 运维平台、发布平台、审计工具、自动化脚本、管理员 | 发布和管理配置，管理服务、命名空间、插件、节点状态和 AI 资源。它面向管理面，允许范围查询和批量管理。 | [运维 API](../../admin/admin-api.md) |
| Console Open API | Nacos 控制台、自定义控制台 UI | 支撑控制台页面的数据读取和交互。它和 Admin API 有重叠，但更贴近控制台展示和操作流程。 | [控制台 API](../../admin/console-api.md) |

业务应用优先使用 Client SDK。只有在语言运行时暂时没有合适 SDK，或者只需要少量 HTTP 调用时，才建议直接使用 Client Open API。

不要把 Console Open API 当成通用运维接口。自定义控制台可以使用 Console Open API；运维自动化、发布平台和审计工具应优先使用 Admin Open API 或 Maintainer SDK。

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
| `requestId`  | string | API调用的请求ID。                                                   |

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

|    名称     |    类型    | 描述                                                                |
|:---------:|:--------:|-------------------------------------------------------------------|
|  `code `  |  `int`   | 错误码，`0`代表执行成功，非`0`代表执行失败的某一种情况，具体错误码请参考[API 错误码汇总](#33-api-错误码汇总) |
| `message` | `String` | 错误码提示信息，执行成功为"`success`"                                          |
|  `data`   |   任意类型   | 返回数据，执行失败时为详细出错信息                                                 |

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
