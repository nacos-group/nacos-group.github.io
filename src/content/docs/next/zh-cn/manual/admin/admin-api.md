---
title: 运维API
keywords: [ Nacos,运维API ]
description: Nacos Server的一些运维API，一般给予控制台使用或需要进行自定义Nacos运维工具开发的相关程序和人员使用。
sidebar:
  order: 10
---

# 运维API

> Nacos 3.x 的标准运维 API 使用 `/v3/admin/*` 路径。当前版本已移除 v1/v2 Admin API，请使用 Nacos 3.x 运维 API 替换。
>
> 若迁移期间仍需临时使用 v1/v2 Admin API，请先阅读[兼容与废弃](./compatibility-and-deprecation.md)，并按升级手册中的 legacy adapter 方案评估兼容风险。

Nacos默认搭载了一整套专为管理控制台和运维人员设计的运维API，赋予运维专家更多的配置权限、更广阔的数据检索能力等。这些API为Nacos的运维团队提供了方便，使他们能够高效地处理故障、排查问题，以确保系统的稳定运行。

## 0. 运维API 相关说明

### 0.1. 适用边界

运维 API 面向管理员、运维平台、发布平台、审计工具和自动化脚本。它提供范围型查询、批量管理、服务端状态查看和资源治理能力。

| 适合使用 | 不适合使用 |
| --- | --- |
| 发布、删除、导入、导出和查询配置。 | 业务应用运行时高频读取配置。 |
| 管理命名空间、服务、实例、集群、健康状态和元数据。 | 业务应用注册自身实例或订阅下游服务。 |
| 管理插件、节点状态、AI 资源和运维诊断信息。 | 自定义控制台 UI 的页面级交互。 |

业务应用请优先使用 [Java SDK](../user/java-sdk/usage.md)、其他语言 SDK 或[客户端 API](../user/open-api.md)。自定义控制台 UI 请优先使用[控制台 API](./console-api.md)。

### 0.2. 统一路径格式

Nacos的运维API，使用统一的Path格式进行的规范。格式为`[/$nacos.server.contextPath]/v3/admin/[module]/[subPath]...`,
其中

- `$nacos.server.contextPath`：运维API的根路径，默认为`/nacos`，可以通过`nacos.server.contextPath`配置项进行修改。
- `module`：运维API模块名称，例如`server`、`cs`、`ns`、`core`等。
- `subPath`：运维API的子路径，例如`state`、`namespace`、`config`等， 可能有多层子路径。

下列列出的运维API，采用默认`$nacos.server.contextPath`的情况进行展示，若已修改部署环境中的`$nacos.server.contextPath`
配置项，请自行修改调用API时的请求URL。

同时下列列出的运维API样例中，均采用默认Nacos Web Server的端口进行展示，若已修改部署环境中的`$nacos.server.main.port`
配置项，请自行修改调用API时的请求URL。

### 0.3. 鉴权认证

Admin API 默认开启鉴权。除文中标记为公开的接口外，调用方需具备对应操作的权限；管理员接口需要管理员身份。

使用默认鉴权插件时，先按[配置访问凭据](../user/auth.mdx)登录，将响应中的 `accessToken` 保存到 `NACOS_ACCESS_TOKEN` 环境变量，再在同一终端运行下文示例。示例使用 Bash（Windows 可使用 Git Bash 或 WSL），通过 `accessToken` 请求头携带 token；请求头要求适用于所有受保护接口，不再逐一列入参数表。

鉴权失败时检查账号密码、token 是否过期以及资源权限；token 过期后重新登录并更新变量。登录控制台不会自动为终端中的 curl 配置身份。

### 0.4. Swagger 类型文档

Nacos 3.X 的运维 API 也提供了Swagger风格的文档，您可以通过访问[Nacos Swagger运维 API](/swagger/admin/)查看。

## 1. Nacos Core 运维 API

### 1.1. 获取当前节点连接

#### 接口描述

通过该接口，可以获取连接到当前Nacos Server节点中的gRPC连接详情。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/loader/current`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                     | 参数类型         | 描述                                                                                      |
|-----------------------------------------|--------------|-----------------------------------------------------------------------------------------|
| ${connectionId}                         | `object` | 每条gRPC连接的连接id                                                                           |
| ${connectionId}.abilityTable            | `object` | 该gRPC连接（即客户端）支持的能力列表                                                                    |
| ${connectionId}.metaInfo.clientIp       | `string` | 该gRPC连接的来源IP                                                                            |
| ${connectionId}.metaInfo.localPort      | `integer` | 该Nacos Server的gRPC端口                                                                    |
| ${connectionId}.metaInfo.version        | `string` | 该gRPC连接（即客户端）的版本                                                                        |
| ${connectionId}.metaInfo.createTime     | `string` | 该gRPC连接的连接时间                                                                            |
| ${connectionId}.metaInfo.lastActiveTime | `integer`  | 该gRPC连接的最后一次的心跳时间                                                                       |
| ${connectionId}.metaInfo.labels.source  | `string` | 该gRPC连接的模块，可选值为`naming`,`config`和`cluster`分别代表注册中心、配置中心以及集群间的连接                         |
| ${connectionId}.metaInfo.clusterSource  | `boolean` | 该gRPC连接的是否为集群间连接，为`true`时，`${connectionId}.metaInfo.labels.source`为 `cluster`           |
| ${connectionId}.metaInfo.sdkSource      | `boolean` | 该gRPC连接的是否为客户端来源连接，为`true`时，`${connectionId}.metaInfo.labels.source`为 `naming`或`config` |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/loader/current'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "1741687438640_127.0.0.1_58856": {
      "abilityTable": {
        "fuzzyWatch": true,
        "lock": true
      },
      "appLabels": {
        "AppName": "unknown",
        "ClientVersion": "Nacos-Java-Client:v3.0.0-BETA"
      },
      "connected": true,
      "labels": {
        "AppName": "unknown",
        "module": "naming",
        "source": "sdk",
        "tls.enable": "false"
      },
      "metaInfo": {
        "appLabels": {
          "AppName": "unknown",
          "ClientVersion": "Nacos-Java-Client:v3.0.0-BETA"
        },
        "appName": "unknown",
        "clientIp": "30.221.148.39",
        "clusterSource": false,
        "connectType": "GRPC",
        "connectionId": "1741687438640_127.0.0.1_58856",
        "createTime": "2025-03-11T10:03:58.731+00:00",
        "labels": {
          "AppName": "unknown",
          "module": "naming",
          "source": "sdk",
          "tls.enable": "false"
        },
        "lastActiveTime": 1741745293704,
        "localPort": 9848,
        "namespaceId": null,
        "remoteIp": "127.0.0.1",
        "remotePort": 58856,
        "sdkSource": true,
        "tag": null,
        "tlsProtected": false,
        "version": "Nacos-Java-Client:v3.0.0-BETA"
      },
      "traced": false
    }
  }
}
```

### 1.2. 均衡指定数量的连接

#### 接口描述

通过该接口，可以指定一定数量的连接到当前Nacos Server节点中的gRPC连接，将这部分连接断开后迁移到其他Nacos Server节点中。

#### 起始版本

`3.0.0`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/loader/reloadCurrent`

#### 请求参数

| 参数名               | 类型        | 必填    | 参数描述                           |
|-------------------|-----------|-------|--------------------------------|
| `count`           | `integer` | **是** | 需要均衡的连接个数                      |
| `redirectAddress` | `string` | 否     | 预期均衡的Nacos Server目标，仅提供给客户端参考。 |

#### 返回数据

成功则返回`success`，失败则返回[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/core/loader/reloadCurrent' -d "count=100"
```

* 返回示例

```text
success
```

### 1.3. 均衡指定的单个连接

#### 接口描述

通过该接口，可以将指定的客户端连接(gRPC连接)迁移到其他Nacos Server节点中。

#### 起始版本

`3.0.0`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/loader/reloadClient`

#### 请求参数

| 参数名               | 类型       | 必填    | 参数描述                 |
|-------------------|----------|-------|----------------------|
| `connectionId`    | `string` | **是** | 需要均衡的连接Id            |
| `redirectAddress` | `string` | 否     | 预期均衡的Nacos Server目标。 |

#### 返回数据

成功则返回`success`，失败则返回[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/core/loader/reloadClient' -d "connectionId=1709273546779_127.0.0.1_35042"
```

* 返回示例

成功则返回:

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

失败则返回：

```json
{
  "code": 30000,
  "message": "server error",
  "data": null
}
```

### 1.4. 获取集群连接概览信息

#### 接口描述

通过该接口，查看Nacos Server集群中各节点的连接数概览。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/loader/cluster`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                           | 参数类型        | 描述                        |
|-------------------------------|-------------|---------------------------|
| `total`                       | `integer` | 该集群中所有节点的连接数总和            |
| `min`                         | `integer` | 该集群中所有节点的最小连接数            |
| `avg`                         | `integer` | 该集群中所有节点的平均连接数            |
| `max`                         | `integer` | 该集群中所有节点的最大连接数            |
| `memberCount`                 | `integer` | 该集群中所有节点的个数               |
| `metricsCount`                | `integer` | 该集群中已统计到概览信息的节点个数         |
| `detail`                      | `array` | 该集群中所有节点的概览信息，格式见下表       |
| `detail[].address`            | `string` | 节点地址                      |
| `detail[].metric.load`        | `number` | 节点的负载率，主要对应节点的Load指标，参考值  |
| `detail[].metric.sdkConCount` | `integer` | 连接到该节点的SDK连接数，主要对应客户端连接数  |
| `detail[].metric.conCount`    | `integer` | 连接到该节点的总连接数，包含了SDK和集群间的连接 |
| `detail[].metric.cpu`         | `number` | 节点的CPU使用率，参考值             |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/loader/cluster'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "avg": 1,
    "completed": true,
    "detail": [
      {
        "address": "127.0.0.1:8848",
        "conCount": 1,
        "cpu": "0.0",
        "load": "2.3842773",
        "sdkConCount": 1
      }
    ],
    "max": 1,
    "memberCount": 1,
    "metricsCount": 1,
    "min": 1,
    "threshold": "1.1",
    "total": 1
  }
}
```

### 1.5. 获取本节点信息

#### 接口描述

通过该接口，可以获取Nacos Server集群当前节点的详细信息。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/core/cluster/node/self`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                           | 参数类型         | 描述                                             |
|-------------------------------|--------------|------------------------------------------------|
| `ip`                          | `string` | 节点IP                                           |
| `port`                        | `integer` | 节点端口                                           |
| `state`                       | `string` | 节点状态，可选 `UP`/`DOWN`/`SUSPICIOUS`。 |
| `extendInfo`                  | `object` | 节点扩展信息，具体字段见下表                                 |
| `extendInfo.lastRefreshTime`  | `integer` | 节点上一次更新时间戳，单位毫秒                                |
| `extendInfo.raftMetaData`     | `object` | 节点的Raft元数据， 包含每个Raft Group的`leader`， `term`等字段 |
| `extendInfo.raftPort`         | `integer` | 节点的Raft端口                                      |
| `extendInfo.supportGrayModel` | `boolean` | 是否支持灰度模型                                       |
| `extendInfo.version`          | `string` | 节点的版本                                          |
| `address`                     | `string` | 节点地址，格式为`ip:port`                              |
| `failAccessCnt`               | `integer` | 探测失败的次数，及report失败的次数，超过一定次数`state`会被改为`DOWN`   |
| `abilities`                   | `object` | 该节点所支持的能力                                      |
| `grpcReportEnabled`           | `boolean` | 标记节点是否支持grpc上报心跳能力，用于适配老版本升级，后续将移除             |
| ~~extendInfo.readyToUpgrade~~ | `boolean` | 是否ready升级到Nacos2.0，于2.2版本后废弃，即将移除              |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/cluster/node/self'
```

* 返回示例

```json
{
  "code": 0,
  "data": {
    "abilities": {
      "configAbility": {
        "supportRemoteMetrics": false
      },
      "namingAbility": {
        "supportJraft": true
      },
      "remoteAbility": {
        "grpcReportEnabled": true,
        "supportRemoteConnection": true
      }
    },
    "address": "127.0.0.1:8848",
    "extendInfo": {
      "lastRefreshTime": 1741678398775,
      "raftMetaData": {
        "metaDataMap": {
          "lock_acquire_service_v2": {
            "leader": "127.0.0.1:7848",
            "raftGroupMember": [
              "127.0.0.1:7848"
            ],
            "term": 109
          },
          "naming_instance_metadata": {
            "leader": "127.0.0.1:7848",
            "raftGroupMember": [
              "127.0.0.1:7848"
            ],
            "term": 391
          },
          "naming_persistent_service": {
            "leader": "127.0.0.1:7848",
            "raftGroupMember": [
              "127.0.0.1:7848"
            ],
            "term": 387
          },
          "naming_persistent_service_v2": {
            "leader": "127.0.0.1:7848",
            "raftGroupMember": [
              "127.0.0.1:7848"
            ],
            "term": 391
          },
          "naming_service_metadata": {
            "leader": "127.0.0.1:7848",
            "raftGroupMember": [
              "127.0.0.1:7848"
            ],
            "term": 391
          }
        }
      },
      "raftPort": "7848",
      "readyToUpgrade": true,
      "supportGrayModel": true,
      "version": "3.0.0-BETA"
    },
    "failAccessCnt": 0,
    "grpcReportEnabled": true,
    "ip": "127.0.0.1",
    "port": 8848,
    "state": "UP"
  },
  "message": "success"
}
```

### 1.6. 获取集群所有节点信息

#### 接口描述

通过该接口，可以获取Nacos Server集群中所有节点的详细信息。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/cluster/node/list`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `address` | `string` | 否 | 节点地址，支持按地址过滤。 |
| `state` | `string` | 否 | 节点状态，可选 `UP`/`DOWN`/`SUSPICIOUS`。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，`data`字段为[获取本节点信息](#返回数据-4)的返回数据的列表。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/cluster/node/list'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "ip": "nacos-node-0",
      "port": 8848,
      "state": "UP",
      "extendInfo": {
        "lastRefreshTime": 1709273550501,
        "raftMetaData": {
          "metaDataMap": {
            "naming_instance_metadata": {
              "leader": "nacos-node-2:7848",
              "raftGroupMember": [
                "nacos-node-2:7848",
                "nacos-node-1:7848",
                "nacos-node-0:7848"
              ],
              "term": 3
            },
            "naming_persistent_service": {
              "leader": "nacos-node-1:7848",
              "raftGroupMember": [
                "nacos-node-2:7848",
                "nacos-node-1:7848",
                "nacos-node-0:7848"
              ],
              "term": 3
            },
            "naming_persistent_service_v2": {
              "leader": "nacos-node-2:7848",
              "raftGroupMember": [
                "nacos-node-2:7848",
                "nacos-node-1:7848",
                "nacos-node-0:7848"
              ],
              "term": 2
            },
            "naming_service_metadata": {
              "leader": "nacos-node-2:7848",
              "raftGroupMember": [
                "nacos-node-2:7848",
                "nacos-node-1:7848",
                "nacos-node-0:7848"
              ],
              "term": 3
            }
          }
        },
        "raftPort": "7848",
        "readyToUpgrade": true,
        "supportGrayModel": true,
        "version": "3.0.0-ALPHA"
      },
      "address": "nacos-node-0:8848",
      "failAccessCnt": 0,
      "abilities": {
        "remoteAbility": {
          "supportRemoteConnection": true,
          "grpcReportEnabled": true
        },
        "configAbility": {
          "supportRemoteMetrics": false
        },
        "namingAbility": {
          "supportJraft": true
        }
      },
      "grpcReportEnabled": true
    }
  ]
}
```

### 1.7. 动态修改Server集群地址发现方式

#### 接口描述

通过该接口，可以在不重启Nacos Server的情况下，动态切换Nacos Server集群地址发现的方式，目前支持两种方式：`file`
和`address-server`。

#### 起始版本

`3.0.0`

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/cluster/lookup`

#### 请求参数

| 参数名    | 类型       | 必填 | 参数描述                                  |
|--------|----------|----|---------------------------------------|
| `type` | `string` | 是 | 切换到地址发现方式，可选值为`address-server`/`file`/`standalone`。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)。

| 参数名    | 参数类型      | 描述                          |
|--------|-----------|-----------------------------|
| `data` | `boolean` | `true`表示更新成功，`false`表示更新失败。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/core/cluster/lookup' -d "type=file"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 1.8. Raft 相关操作

#### 接口描述

通过该接口，可以对Nacos Server集群中的Raft协议进行部分运维操作，如执行快照，主动选主等。

#### 起始版本

`3.0.0`

#### 请求方式

`POST`

请求体类型：`application/json`，参数放在请求体中。

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/ops/raft`

#### 请求参数

| 参数名       | 类型       | 必填    | 参数描述                                 |
|-----------|----------|-------|--------------------------------------|
| `command` | `string` | **是** | Raft运维操作指令，具体的命令请参考下表。 |
| `value` | `string` | **是** | 命令的参数，具体的命令内容请参考下表。 |
| `groupId` | `string` | 否 | Raft集群的groupId，如果不输入则对所有Raft Group生效 |

| command / 指令    | value / 参数                                                                   | 说明                                       |
|-------------------|-------------------------------------------------------------------------------|------------------------------------------|
| `doSnapshot`      | `${nacos-server-address}:${raft-port}`                                        | 执行快照，参数为要执行快照的节点地址。                      |
| `transferLeader`  | `${nacos-server-address}:${raft-port}`                                        | 主动选主，参数为要期望的Leader的节点地址。                 |
| `restRaftCluster` | `${nacos-server-address}:${raft-port}[,${nacos-server-address}:${raft-port}]` | 重置集群状态，参数为要重置节点地址列表，','分割。               |
| `removePeer`      | `${nacos-server-address}:${raft-port}`                                        | 移除Raft Member节点，参数为要移除的节点地址。             |
| `removePeers`     | `${nacos-server-address}:${raft-port}[,${nacos-server-address}:${raft-port}]` | 批量移除Raft Member节点，参数为要批量移除的节点地址列表，','分割。 |
| `changePeers`     | `${nacos-server-address}:${raft-port}[,${nacos-server-address}:${raft-port}]` | 修改Raft Member节点，参数为要修改后的节点地址列表，','分割。    |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)。

| 参数名    | 参数类型     | 描述         |
|--------|----------|------------|
| `data` | `string` | 固定为`null`。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST -H 'Content-Type:application/json' 'http://127.0.0.1:8848/nacos/v3/admin/core/ops/raft' -d '{"command":"doSnapshot","value":"nacos-node-0:7848"}'
```

* 返回示例

```json
{
  "code": 0,
  "message": null,
  "data": null
}
```

### 1.9. 动态修改Nacos Core相关日志级别

#### 接口描述

通过该接口，可以在不重启Nacos Server的情况下，动态修改Nacos Core相关日志级别的配置。

#### 起始版本

`3.0.0`

#### 请求方式

`PUT`

请求体类型：`application/json`，参数放在请求体中。

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/ops/log`

#### 请求参数

| 参数名        | 类型       | 必填    | 参数描述                                                         |
|------------|----------|-------|--------------------------------------------------------------|
| `logName` | `string` | **是** | 具体的日志文件的名称，具体支持的日志名称见下表。 |
| `logLevel` | `string` | **是** | 日志的级别，可选值为`ALL`、`TRACE`、`DEBUG`、`INFO`、`WARN`、`ERROR`、`OFF`。 |

| logName        | 对应的具体日志文件             |
|----------------|-----------------------|
| `core-auth`    | `core-auth.log`       |
| `core-raft`    | `protocol-raft.log`   |
| `core-distro`  | `protocol-distro.log` |
| `core-cluster` | `nacos-cluster.log`   |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)。

| 参数名    | 参数类型     | 描述         |
|--------|----------|------------|
| `data` | `string` | 固定为`null`。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT -H 'Content-Type:application/json' 'http://127.0.0.1:8848/nacos/v3/admin/core/ops/log' -d '{"logName":"core-distro","logLevel":"DEBUG"}'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 1.10. 自动均衡指定数量的连接

#### 接口描述

通过该接口，可以根据负载因子(loaderFactor)自动均衡整个集群的客户端连接。

自动均衡逻辑：

1. 根据整个集群的客户端连接数和Nacos Server节点数量计算平均连接数`avg`、节点连接数下限阈值`lowLimitCount`(=avg * (
   1-loaderFactor))、节点连接数上限阈值`overLimitCount`(=avg * (1+loaderFactor))
2. 将高负载节点的部分客户端连接重定向到低负载节点。

#### 起始版本

`3.0.0`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/loader/smartReloadCluster`

#### 请求参数

| 参数名                | 类型       | 必填    | 参数描述           |
|--------------------|----------|-------|----------------|
| `loaderFactor` | `number` | 否 | - |

#### 返回数据

成功则返回:

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

失败则返回：

```json
{
  "code": 30000,
  "message": "server error",
  "data": null
}
```

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/core/loader/smartReloadCluster' -d "loaderFactor=0.1"
```

* 返回示例

```text
success
```

### 1.11. 获取ID生成器信息

#### 接口描述

通过该接口，获取ID生成器的当前ID,workerId. 只有使用内置数据库时该接口才会返回有效数据.

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/ops/ids`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)。

| 参数名              | 参数类型     | 描述       |
|------------------|----------|----------|
| `resource`       | `string` | 生产器名称    |
| `info`           | `object` | 生产器详情    |
| `info.currentId` | `integer` | 当前ID     |
| `info.workerId`  | `integer` | workerID |

成功则返回:

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "resource": "resourceName",
      "info": {
        "currentId": 1,
        "workerId": 2
      }
    }
  ]
}
```

失败则返回：

```json
{
  "code": 30000,
  "message": "server error",
  "data": null
}
```

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/ops/ids'
```

* 返回示例

```text
success
```

### 1.12. 更新集群节点信息

#### 接口描述

通过该接口，可以更新当前节点中的Nacos节点列表的详细信息。**注意：** 该接口会覆盖当前节点中列表中的详细信息，仅更新传入的节点中存在于集群中的节点，并`不能`通过此接口添加和减少集群中的节点。同时，Nacos自身的健康探测`report`任务也会对当前节点中列表中的节点进行健康探测及更新详细信息，若调用此接口后，探测任务发现节点信息有变更，则任务也会覆盖当前节点中列表中的节点信息。

#### 起始版本

`3.0.0`

#### 请求方式

`PUT`

请求体类型：`application/json`。

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/cluster/node/list`

#### 请求参数

请求体为必填的 `array<Member>`；每个数组元素都是一个 `Member` 节点对象。

| 参数名 | 参数类型 | 是否必填 | 描述 |
|--------|----------|----------|------|
| `body[].ip` | `string` | 否 | 节点 IP。 |
| `body[].port` | `integer` | 否 | 节点端口。 |
| `body[].state` | `string` | 否 | 节点状态：`STARTING`、`UP`、`SUSPICIOUS`、`DOWN` 或 `ISOLATION`。 |
| `body[].extendInfo` | `map<string, object>` | 否 | 节点扩展信息。 |
| `body[].address` | `string` | 否 | 节点地址。 |
| `body[].abilities` | `ServerAbilities` | 否 | 节点能力信息。 |
| `body[].grpcReportEnabled` | `boolean` | 否 | 是否启用 gRPC 状态上报。 |
| `body[].failAccessCnt` | `integer` | 否 | 连续访问失败次数。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data | `boolean` | 是否更新成功 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/core/cluster/node/list' \
  -H 'Content-Type: application/json' \
  -d '[{"ip":"127.0.0.1","port":8848,"state":"UP","address":"127.0.0.1:8848"}]'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 1.13. 获取命名空间详情

#### 接口描述

通过该接口，可以获取指定命名空间的详情。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/namespace`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | **是** | 命名空间 ID |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| namespace | `string` | 命名空间 ID |
| namespaceShowName | `string` | 命名空间展示名 |
| namespaceDesc | `string` | 命名空间描述 |
| quota | `integer` | 配置数量配额 |
| configCount | `integer` | 当前配置数量 |
| type | `integer` | 类型 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/namespace?namespaceId=public'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "namespace": "public",
    "namespaceShowName": "public",
    "namespaceDesc": "Default Namespace",
    "quota": 200,
    "configCount": 0,
    "type": 0
  }
}
```

### 1.14. 更新命名空间

#### 接口描述

通过该接口，可以更新命名空间的信息，无法更新命名空间ID，仅能更新命名空间的名称和描述。

#### 起始版本

`3.0.0`

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/namespace`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | **是** | 命名空间 ID |
| `namespaceName` | `string` | **是** | 命名空间展示名 |
| `namespaceDesc` | `string` | 否 | 命名空间描述 |

#### 返回数据

成功则返回统一返回体，`data` 为 `true` 表示成功；失败则返回[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/core/namespace' \
  -d 'namespaceId=test' -d 'namespaceName=test' -d 'namespaceDesc=test'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 1.15. 创建新命名空间

#### 接口描述

通过该接口，可以创建新的命名空间。

#### 起始版本

`3.0.0`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/namespace`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | **是** | 命名空间 ID |
| `namespaceName` | `string` | **是** | 命名空间展示名 |
| `namespaceDesc` | `string` | 否 | 命名空间描述 |

#### 返回数据

成功则返回统一返回体，`data` 为 `true` 表示成功；失败则返回[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/core/namespace' \
  -d 'namespaceName=test' -d 'namespaceDesc=test'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 1.16. 删除命名空间

#### 接口描述

通过该接口，可以删除命名空间。默认命名空间`public`无法被删除。

#### 起始版本

`3.0.0`

#### 请求方式

`DELETE`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/namespace`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | **是** | 命名空间 ID |

#### 返回数据

成功则返回统一返回体，`data` 为 `true` 表示成功；失败则返回[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/core/namespace?namespaceId=test'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 1.17. 检查命名空间是否存在

#### 接口描述

通过该接口，可以检查命名空间ID是否存在。应该在创建命名空间前调用，确认自定义的命名空间ID是否已经存在，以防冲突。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/namespace/check`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | **是** | - |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，`data` 为 `true` 表示已存在，`false` 表示不存在。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/namespace/check?namespaceId=public'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": false
}
```

### 1.18. 获取Nacos命名空间列表

#### 接口描述

通过该接口，可以获取当前Nacos集群的命名空间列表。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/namespace/list`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。`data` 为命名空间对象数组，每项包含 namespace、namespaceShowName、namespaceDesc、quota、configCount、type 等字段。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/namespace/list'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "namespace": "public",
      "namespaceShowName": "public",
      "namespaceDesc": "Default Namespace",
      "quota": 200,
      "configCount": 0,
      "type": 0
    }
  ]
}
```

### 1.19. 获取Nacos集群状态信息

#### 接口描述

通过该接口，可以获取到Nacos 集群的基础状态和开关信息，例如：版本号，运行模式，鉴权是否开启等；该接口不会返回Nacos 集群的节点信息。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

公开接口，无需身份信息。

#### 请求URL

`/nacos/v3/admin/core/state`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，`data` 为键值对，包含版本号（version）、运行模式（startup_mode）、鉴权开关（auth_enabled）等集群状态与配置项。

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/state'
```

* 返回示例

```json
{
  "defaultMaxSize": "102400",
  "auth_system_type": "nacos",
  "auth_enabled": "true",
  "version": "3.0.0-SNAPSHOT",
  "startup_mode": "standalone",
  "server_port": "8848"
}
```

### 1.20. 获取Nacos集群的存活状态

#### 接口描述

通过该接口，可以获取Nacos集群的存活状态，Nacos集群是否可正常接受和响应请求。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

公开接口，无需身份信息。

#### 请求URL

`/nacos/v3/admin/core/state/liveness`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data | `string` | 存活状态，如 "ok" |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/state/liveness'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 1.21. 获取Nacos集群的可读状态

#### 接口描述

通过该接口，可以获取Nacos集群的是否处于可读取状态，即Nacos集群是否可以读取到数据。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

公开接口，无需身份信息。

#### 请求URL

`/nacos/v3/admin/core/state/readiness`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data | `string` | 可读状态，如 "ok" |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/state/readiness'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 1.22. 更新插件配置

#### 接口描述

更新插件的完整目标来源配置。`localOnly=false` 写入持久化运行时来源，`localOnly=true` 只写当前节点本地来源；后者优先级更高。提交 map 会替换该来源的旧 map，空 map 表示清空。只能更新 definitions 中 `effectMode=RUNTIME` 的项，新增、修改或删除 `RESTART` 项都会被拒绝。

#### 起始版本

`3.2.0`

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/plugin/config`

#### 请求参数

| 参数名         | 类型       | 必填 | 参数描述           |
|-------------|----------|----|----------------|
| `pluginType` | `string` | **是** | 插件类型，如 auth。 |
| `pluginName` | `string` | **是** | 插件名称。 |
| `config` | `string` | **是** | JSON 对象字符串；解析后作为以 definition item key 为键的完整配置 map。 |
| `localOnly` | `boolean` | 否 | `true` 写 `LOCAL_ONLY`；否则写集群持久化的 `RUNTIME_PERSISTED`。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，`data` 为字符串表示操作结果。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/core/plugin/config' \
  -d 'pluginType=auth' \
  -d 'pluginName=ldap' \
  --data-urlencode 'config={"connect-timeout":"6000"}' \
  -d 'localOnly=false'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "Plugin configuration updated successfully"
}
```

### 1.23. 获取插件详情

#### 接口描述

通过该接口，可以按类型和名称获取指定插件的详情信息。

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/plugin/detail`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pluginType` | `string` | **是** | 插件类型，如 auth |
| `pluginName` | `string` | **是** | 插件名称 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| pluginId | `string` | 插件 ID |
| pluginType | `string` | 插件类型 |
| pluginName | `string` | 插件名称 |
| enabled | `boolean` | 是否启用 |
| critical | `boolean` | 是否关键插件 |
| typeCritical | `boolean` | 插件类型是否声明为 critical |
| executionMode | `string` | `EXCLUSIVE`、`CHAIN`、`ROUTED` 或 `BROADCAST` |
| exclusive | `boolean` | 是否为排他选择类型 |
| configurable | `boolean` | 是否可配置 |
| config | `object` | 当前有效 item map，敏感值已脱敏 |
| configDefinitions | `array` | definitions，包含 key、aliases、type、defaultValue、required、sensitive 和 effectMode |
| configValueMetas | `object` | 各 item 的有效值来源和 `overridden` 元数据 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/plugin/detail?pluginType=auth&pluginName=nacos'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "pluginId": "auth:nacos",
    "pluginType": "auth",
    "pluginName": "nacos",
    "enabled": true,
    "critical": true,
    "typeCritical": true,
    "executionMode": "EXCLUSIVE",
    "exclusive": true,
    "configurable": false,
    "config": {},
    "configDefinitions": [],
    "configValueMetas": {}
  }
}
```

### 1.24. 获取插件列表

#### 接口描述

通过该接口，可以获取所有插件列表，可按插件类型筛选。

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/plugin/list`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pluginType` | `string` | 否 | 插件类型，不传则返回全部 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，`data` 为插件对象数组。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/plugin/list?pluginType=auth'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "pluginId": "auth:nacos",
      "pluginType": "auth",
      "pluginName": "nacos",
      "enabled": true,
      "critical": true,
      "configurable": false,
      "typeCritical": true,
      "executionMode": "EXCLUSIVE",
      "exclusive": true
    }
  ]
}
```

### 1.25. 启用或禁用插件

#### 接口描述

更新实现状态。`localOnly=false` 写入 `${nacos.home}/data/plugin/plugin-states.json` 并用于集群操作；`localOnly=true` 只影响当前节点且优先。EXCLUSIVE 选择、PRE_CONTEXT 状态以及 active critical provider 不能通过运行时请求非法修改。

#### 起始版本

`3.2.0`

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/plugin/status`

#### 请求参数

| 参数名         | 类型        | 必填 | 参数描述       |
|-------------|-----------|----|------------|
| `pluginType` | `string` | **是** | 插件类型。 |
| `pluginName` | `string` | **是** | 插件名称。 |
| `enabled` | `boolean` | **是** | 是否启用。 |
| `localOnly` | `boolean` | 否 | 是否仅写本地。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，`data` 为字符串表示操作结果。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/core/plugin/status' \
  -d 'pluginType=trace&pluginName=ai-resource-trace-log&enabled=false&localOnly=false'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "Plugin status updated successfully"
}
```

## 2. Nacos Naming 运维 API

### 2.1. 查看Naming模块的相关开关

#### 接口描述

通过该接口，可以查看Nacos Naming模块的相关开关。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/ops/switches`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                      | 参数类型      | 描述                                                                                                      |
|--------------------------|-----------|---------------------------------------------------------------------------------------------------------|
| `clientBeatInterval`     | `integer` | Nacos1.X客户端的默认心跳间隔                                                                                      |
| `defaultCacheMillis`     | `integer` | 客户端订阅的服务列表的默认缓存时间                                                                                       |
| `pushCacheMillis`        | `integer` | 推送的服务列表的默认缓存时间，优先级高于`defaultCacheMillis`                                                                |
| `distroEnabled`          | `boolean` | 是否开启`Distro`协议同步，仅当集群压力过大，影响到集群稳定性时，临时修改为`false`缓解，改为`false`后可能导致部分数据不一致，需要尽快恢复                         |
| `healthCheckEnabled`     | `boolean` | 是否开启健康检查，仅当集群压力过大，影响到集群稳定性时，临时修改为`false`缓解，改为`false`后不会因为心跳过期，tcp/http探测超时而修改实例的健康状态，以及不会因过期删除实例，需要尽快恢复 |
| `lightBeatEnabled`       | `boolean` | 是否开启轻量心跳，针对Nacos`1.2.X~1.4.X版本`客户端生效，修改为`false`后，`Nacos1.2.X~1.4.X`版本客户端将使用全量心跳进行续约                     |
| `pushEnabled`            | `boolean` | 是否开启推送功能，仅当集群压力过大，影响到集群稳定性时，临时修改为`false`，改为`false`后，Nacos客户端将不再收到服务端的主动推送                               |
| `push${Language}Version` | `string` | 可支持推送的最小客户端版本，当不希望针对小于某些版本进行数据推送时，可以修改该值，比如修改pushJavaVersion为`2.0.0`，则小于2.0.0的Java客户端将不会收到推送数据          |
| `${type}HealthParams`    | `object`    | 健康检查参数，设置健康检查的最大/最小间隔，随机间隔系数等，健康检查时将根据这几个值进行下一次健康检查流量的打散。                                               |

> 注意： 其余未列出的参数，均为Nacos旧版本的开关或配置内容，已废弃或即将废弃，请谨慎使用。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/ops/switches'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "adWeightMap": {},
    "autoChangeHealthCheckEnabled": true,
    "checkTimes": 3,
    "checksum": null,
    "clientBeatInterval": 5000,
    "defaultCacheMillis": 3000,
    "defaultInstanceEphemeral": true,
    "defaultPushCacheMillis": 10000,
    "disableAddIP": false,
    "distroEnabled": true,
    "distroServerExpiredMillis": 10000,
    "distroThreshold": 0.7,
    "enableAuthentication": false,
    "enableStandalone": true,
    "healthCheckEnabled": true,
    "healthCheckWhiteList": [],
    "httpHealthParams": {
      "factor": 0.85,
      "max": 5000,
      "min": 500
    },
    "incrementalList": [],
    "lightBeatEnabled": true,
    "limitedUrlMap": {},
    "masters": null,
    "mysqlHealthParams": {
      "factor": 0.65,
      "max": 3000,
      "min": 2000
    },
    "name": "00-00---000-NACOS_SWITCH_DOMAIN-000---00-00",
    "overriddenServerStatus": null,
    "pushCSharpVersion": "0.9.0",
    "pushCVersion": "1.0.12",
    "pushEnabled": true,
    "pushGoVersion": "0.1.0",
    "pushJavaVersion": "0.1.0",
    "pushPythonVersion": "0.4.3",
    "sendBeatOnly": false,
    "serverStatusSynchronizationPeriodMillis": 2000,
    "serviceStatusSynchronizationPeriodMillis": 5000,
    "tcpHealthParams": {
      "factor": 0.75,
      "max": 5000,
      "min": 1000
    }
  }
}
```

### 2.2. 修改Naming模块的相关开关

#### 接口描述

通过该接口，可以修改Nacos Naming模块的相关开关。

#### 起始版本

`3.0.0`

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/ops/switches`

#### 请求参数

| 参数名     | 类型        | 必填    | 参数描述                                              |
|---------|-----------|-------|---------------------------------------------------|
| `entry` | `string` | **是** | 修改的开关或配置名称 |
| `value` | `string` | **是** | 开关或配置的新值，不同的开关或配置的类型不同，具体请参考[开关和配置参数](#返回数据-10) |
| `debug` | `boolean` | 否 | 是否开启调试模式，开启后，修改的配置不会同步到集群其他节点中，仅在本节点生效，默认为`false` |

#### 返回数据

| 参数名    | 参数类型     | 描述      |
|--------|----------|---------|
| `data` | `string` | 成功为`ok` |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ns/ops/switches' -d "entry=pushEnabled&value=false"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.3. 查询系统当前数据指标

#### 接口描述

通过该接口，可以查询系统当前数据指标。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/ops/metrics`

#### 请求参数

| 参数名          | 参数类型      | 是否必填 | 默认值    | 参数描述  |
|--------------|-----------|------|--------|-------|
| `onlyStatus` | `boolean` | 否    | `true` | 只显示状态 |

> 当`onlyStatus`设置为`true`时，只返回表示系统状态的字符串

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                           | 参数类型     | 描述说明    |
|-------------------------------|----------|---------|
| `status`                      | `string` | 系统状态    |
| `serviceCount`                | `integer` | 服务数量    |
| `instanceCount`               | `integer` | 实例数量    |
| `subscribeCount`              | `integer` | 订阅数量    |
| `clientCount`                 | `integer` | 客户端数量   |
| `connectionBasedClientCount`  | `integer` | 连接数量    |
| `ephemeralIpPortClientCount`  | `integer` | 临时客户端数量 |
| `persistentIpPortClientCount` | `integer` | 持久客户端数量 |
| `responsibleClientCount`      | `integer` | 响应客户端数  |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/ops/metrics?onlyStatus=false'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "clientCount": 3,
    "connectionBasedClientCount": 1,
    "ephemeralIpPortClientCount": 0,
    "instanceCount": 2,
    "persistentIpPortClientCount": 2,
    "responsibleClientCount": 3,
    "serviceCount": 2,
    "status": "UP",
    "subscribeCount": 1
  }
}
```

### 2.4. 修改日志级别

#### 接口描述

通过该接口，可以动态修改指定日志的级别。

#### 起始版本

`3.0.0`

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/ops/log`

#### 请求参数

| 参数名       | 类型       | 必填    | 参数描述      |
|-----------|----------|-------|-----------|
| `logName`  | `string` | **是** | 需要修改的日志名称。 |
| `logLevel` | `string` | **是** | 日志级别的新值。   |

#### 返回数据

| 参数名    | 参数类型     | 描述      |
|--------|----------|---------|
| `data` | `string` | 成功为`ok` |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ns/ops/log' -d 'logName=com.example.Logger&logLevel=DEBUG'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.5 查询所有客户端列表

#### 接口描述

查询所有客户端的列表。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/ns/client/list`

#### 请求参数

无

#### 返回数据

| 参数名    | 参数类型           | 描述      |
|--------|----------------|---------|
| `data` | `array` | 客户端ID列表 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/client/list'
```

```json
{
  "code": 0,
  "message": "success",
  "data": [
    "127.0.0.1:8080#false",
    "1741748952410_127.0.0.1_53863",
    "1.1.1.1:3306#false"
  ]
}
```

### 2.6 查询客户端详细信息

#### 接口描述

根据客户端ID查询客户端的详细信息。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/ns/client`

#### 请求参数

| 参数名        | 参数类型     | 是否必填  | 描述    |
|------------|----------|-------|-------|
| `clientId` | `string` | **是** | 客户端ID |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名               | 参数类型      | 描述                 |
|-------------------|-----------|--------------------|
| `clientId`        | `string` | 客户端的唯一 ID。         |
| `ephemeral`       | `boolean` | 客户端是否为临时客户端        |
| `lastUpdatedTime` | `integer` | 客户端的最后更新时间（时间戳）    |
| `clientType`      | `string` | 客户端类型              |
| `connectType`     | `string` | 连接类型（仅适用于 2.x 客户端） |
| `appName`         | `string` | 客户端所属的应用名称         |
| `version`         | `string` | 客户端的版本号            |
| `clientIp`        | `string` | 客户端的 IP 地址         |
| `clientPort`      | `string` | 客户端的端口号            |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/client?clientId=1741748952410_127.0.0.1_53863'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "appName": "unknown",
    "clientId": "1741748952410_127.0.0.1_53863",
    "clientIp": "127.0.0.1",
    "clientPort": 53863,
    "clientType": "connection",
    "connectType": "GRPC",
    "ephemeral": true,
    "lastUpdatedTime": 1741748954789,
    "version": "Nacos-Java-Client:v3.0.0-BETA"
  }
}
```

若为持久化实例，则返回

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "appName": null,
    "clientId": "1.1.1.1:3306#false",
    "clientIp": null,
    "clientPort": 0,
    "clientType": "ipPort",
    "connectType": null,
    "ephemeral": false,
    "lastUpdatedTime": 1741748950046,
    "version": null
  }
}
```

### 2.7 查询客户端注册的服务列表

#### 接口描述

查询指定客户端注册的服务列表。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/ns/client/publish/list`

#### 请求参数

| 参数名        | 参数类型     | 是否必填  | 描述    |
|------------|----------|-------|-------|
| `clientId` | `string` | **是** | 客户端ID |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                         | 参数类型     | 描述说明      |
|-----------------------------|----------|-----------|
| `namespaceId`               | `string` | 命名空间      |
| `groupName`                 | `string` | 分组名       |
| `serviceName`               | `string` | 服务名       |
| `publisherInfo`             | `object` | 该服务下注册的实例 |
| `publisherInfo.ip`          | `string` | `IP`地址    |
| `publisherInfo.port`        | `integer` | 端口号       |
| `publisherInfo.clusterName` | `string` | 集群名       |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/client/publish/list?clientId=1664527081276_127.0.0.1_4400'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "groupName": "DEFAULT_GROUP",
      "namespaceId": "public",
      "publisherInfo": {
        "clientId": null,
        "clusterName": "DEFAULT",
        "ip": "1.1.1.1",
        "port": 3306
      },
      "serviceName": "test",
      "subscriberInfo": null
    }
  ]
}
```

### 2.8 查询客户端订阅的服务列表

#### 接口描述

查询指定客户端订阅的服务列表。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/ns/client/subscribe/list`

#### 请求参数

| 参数名        | 参数类型     | 是否必填 | 描述    |
|------------|----------|------|-------|
| `clientId` | `string` | **是** | 客户端ID |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                      | 参数类型     | 描述说明  |
|--------------------------|----------|-------|
| `namespaceId`            | `string` | 命名空间  |
| `groupName`              | `string` | 分组名   |
| `serviceName`            | `string` | 服务名   |
| `subscriberInfo`         | `object` | 订阅信息  |
| `subscriberInfo.appName` | `string` | 应用    |
| `subscriberInfo.agent`   | `string` | 客户端信息 |
| `subscriberInfo.address` | `string` | 地址    |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/client/subscribe/list?clientId=1664527081276_127.0.0.1_4400'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "groupName": "DEFAULT_GROUP",
      "namespaceId": "public",
      "publisherInfo": null,
      "serviceName": "com.test.SyncCallbackService",
      "subscriberInfo": {
        "address": "127.0.0.1",
        "agent": "Nacos-Java-Client:v3.0.0-BETA",
        "appName": "unknown",
        "clientId": null
      }
    }
  ]
}
```

### 2.9 查询注册指定服务的客户端列表

#### 接口描述

查询注册指定服务的客户端列表。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/ns/client/service/publisher/list`

#### 请求参数

| 参数名           | 参数类型      | 是否必填  | 默认值               | 描述说明                     |
|---------------|-----------|-------|-------------------|--------------------------|
| `namespaceId` | `string` | 否 | `"public"` |
| `groupName` | `string` | 否 | `"DEFAULT_GROUP"` |
| `serviceName` | `string` | **是** | 无 |
| `ip` | `string` | 否 | 无 |
| `port` | `integer` | 否 | 无 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名           | 参数类型     | 描述说明    |
|---------------|----------|---------|
| `clientId`    | `string` | 客户端`id` |
| `ip`          | `string` | 实例的`IP` |
| `port`        | `integer` | 实例的端口   |
| `clusterName` | `string` | 实例的集群名  |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/client/service/publisher/list?serviceName=test'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "clientId": "1.1.1.1:3306#false",
      "clusterName": "DEFAULT",
      "ip": "1.1.1.1",
      "port": 3306
    }
  ]
}
```

### 2.10 查询订阅指定服务的客户端列表

#### 接口描述

查询订阅指定服务的客户端列表。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/ns/client/service/subscriber/list`

#### 请求参数

| 参数名           | 参数类型      | 是否必填  | 默认值               | 描述说明                     |
|---------------|-----------|-------|-------------------|--------------------------|
| `namespaceId` | `string` | 否 | `"public"` |
| `groupName` | `string` | 否 | `"DEFAULT_GROUP"` |
| `serviceName` | `string` | **是** | 无 |
| `ip` | `string` | 否 | 无 |
| `port` | `integer` | 否 | 无 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名        | 参数类型     | 描述说明                             |
|------------|----------|----------------------------------|
| `clientId` | `string` | 客户端`id`                          |
| `address`  | `string` | 订阅者客户端的`IP`                      |
| `agent`    | `string` | 订阅者客户端的版本                        |
| `appName`  | `string` | 订阅者客户端的应用名，`unknown`表示未配置或客户端不支持 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/client/service/subscriber/list?serviceName=service1'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "address": "127.0.0.1",
      "agent": "Nacos-Java-Client:v3.0.0-BETA",
      "appName": "unknown",
      "clientId": "1741748952410_127.0.0.1_53863"
    }
  ]
}
```

### 2.11 查询客户端的负责服务器

#### 接口描述

根据客户端的IP和端口查询其负责的服务器，仅针对持久化服务实例或通过运维API注册的临时实例。使用2.X以上客户端注册的临时实例无法通过此接口定位负责服务器节点。

> 对于使用1.X客户端注册的实例也适用此接口， 但1.X客户端将在未来版本不再支持。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/client/distro`

#### 请求参数

| 参数名    | 参数类型     | 是否必填  | 描述    |
|--------|----------|-------|-------|
| `ip`   | `string` | **是** | 客户端IP |
| `port` | `integer` | **是** | 客户端端口 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                 | 参数类型     | 描述       |
|---------------------|----------|----------|
| `responsibleServer` | `string` | 负责的服务器信息 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/client/distro?ip=127.0.0.1&port=8080'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "responsibleServer": "127.0.0.1:8848"
  }
}
```

### 2.12 更新集群信息

#### 接口描述

更新指定集群的元数据信息。

#### 起始版本

`3.0.0`

#### 请求方式

`PUT`

#### 鉴权状态

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/ns/cluster`

#### 请求参数

| 参数名                     | 参数类型                  | 是否必填  | 描述                |
|-------------------------|-----------------------|-------|-------------------|
| `namespaceId` | `string` | 否 | 命名空间ID |
| `serviceName` | `string` | **是** | 服务名称 |
| `clusterName` | `string` | **是** | 集群名称 |
| `checkPort` | `integer` | **是** | 健康检查端口 |
| `useInstancePort4Check` | `boolean` | **是** | 是否使用实例端口进行健康检查 |
| `healthChecker` | `string` | **是** | 健康检查器配置（JSON 字符串） |
| `metadata` | `string` | 否 | 集群的扩展元数据，默认为`""` |
| `groupName` | `string` | 否 | - |

#### 返回数据

| 参数名    | 参数类型     | 描述     |
|--------|----------|--------|
| `data` | `string` | 操作结果信息 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ns/cluster' -d 'serviceName=test&clusterName=DEFAULT&checkPort=80&useInstancePort4Check=true&healthChecker={"type":"none"}'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.13 更新实例健康状态

#### 接口描述

更新指定实例的健康状态。

> 仅对持久化服务的实例有效， 且该服务的健康检查方式为`NONE`。
> 临时实例的健康状态由连接（客户端）维护，其他健康检查类型的持久化服务，健康检查任务会自动维护健康状态，即使更新成功了，也很快会被健康检查任务重制。

#### 起始版本

`3.0.0`

#### 请求方式

`PUT`

#### 鉴权状态

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/ns/health/instance`

#### 请求参数

| 参数名           | 参数类型      | 是否必填  | 描述                      |
|---------------|-----------|-------|-------------------------|
| `namespaceId` | `string` | 否 | 命名空间ID，默认为`public` |
| `serviceName` | `string` | **是** | 服务名称 |
| `groupName` | `string` | 否 | 分组名称，默认为`DEFAULT_GROUP` |
| `clusterName` | `string` | 否 | 集群名称，默认`DEFAULT` |
| `ip` | `string` | **是** | 实例IP |
| `port` | `integer` | **是** | 实例端口 |
| `healthy` | `boolean` | **是** | 健康状态（`true` 为健康） |

#### 返回数据

| 参数名    | 参数类型     | 描述     |
|--------|----------|--------|
| `data` | `string` | 操作结果信息 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ns/health/instance' -d 'namespaceId=public&serviceName=service1&groupName=DEFAULT_GROUP&clusterName=cluster1&ip=127.0.0.1&port=8080&healthy=true'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.14 获取所有健康检查器

#### 接口描述

获取系统中支持的所有健康检查器类型及其配置。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/ns/health/checkers`

#### 请求参数

无

#### 返回数据

| 参数名    | 参数类型                                 | 描述          |
|--------|--------------------------------------|-------------|
| `data` | `map<string, AbstractHealthChecker>` | 健康检查器类型及其配置 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/health/checkers'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "HTTP": {
      "expectedResponseCode": 200,
      "headers": "",
      "path": ""
    },
    "MYSQL": {
      "cmd": null,
      "pwd": null,
      "user": null
    },
    "NONE": {},
    "TCP": {}
  }
}
```

### 2.15 注册实例

#### 接口描述

注册一个新的实例到指定服务。

#### 起始版本

`3.0.0`

#### 请求方式

`POST`

#### 鉴权状态

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/ns/instance`

#### 请求参数

| 参数名           | 参数类型                  | 是否必填  | 描述                      |
|---------------|-----------------------|-------|-------------------------|
| `namespaceId` | `string` | 否 | 命名空间ID，默认为`public` |
| `serviceName` | `string` | **是** | 服务名称 |
| `groupName` | `string` | 否 | 分组名称，默认为`DEFAULT_GROUP` |
| `clusterName` | `string` | 否 | 集群名称，默认为`DEFAULT` |
| `ip` | `string` | **是** | 实例IP |
| `port` | `integer` | **是** | 实例端口 |
| `ephemeral` | `boolean` | 否 | 是否为临时实例，默认 `true`。 |
| `weight` | `number` | 否 | 实例权重，默认为`1.0` |
| `healthy` | `boolean` | 否 | 健康状态，默认为`true` |
| `enabled` | `boolean` | 否 | 是否启用，默认为`true` |
| `metadata` | `string` | 否 | 实例元数据 |
| `ephemeral` | `boolean` | 否 | 是否临时实例 |

#### 返回数据

| 参数名    | 参数类型     | 描述     |
|--------|----------|--------|
| `data` | `string` | 操作结果信息 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance' \
-d 'namespaceId=public&serviceName=service1&groupName=DEFAULT_GROUP&clusterName=cluster1&ip=127.0.0.1&port=8080&weight=1.0&healthy=true&enabled=true&metadata={"key1=value1"}&ephemeral=true'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.16 注销实例

#### 接口描述

从指定服务中注销一个实例。

#### 起始版本

`3.0.0`

#### 请求方式

`DELETE`

#### 鉴权状态

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/ns/instance`

#### 请求参数

| 参数名           | 参数类型      | 是否必填  | 描述                      |
|---------------|-----------|-------|-------------------------|
| `namespaceId` | `string` | 否 | 命名空间ID，默认为`public` |
| `serviceName` | `string` | **是** | 服务名称 |
| `groupName` | `string` | 否 | 分组名称，默认为`DEFAULT_GROUP` |
| `clusterName` | `string` | 否 | 集群名称，默认为`DEFAULT` |
| `ip` | `string` | **是** | 实例IP |
| `port` | `integer` | **是** | 实例端口 |
| `ephemeral` | `boolean` | 否 | 是否为临时实例，默认 `true`。 |

#### 返回数据

| 参数名    | 参数类型     | 描述     |
|--------|----------|--------|
| `data` | `string` | 操作结果信息 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance?namespaceId=public&serviceName=service1&groupName=DEFAULT_GROUP&clusterName=cluster1&ip=127.0.0.1&port=8080&ephemeral=true'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.17 更新实例

#### 接口描述

更新指定实例的信息。

>
通过该接口更新的元数据拥有更高的优先级（相比注册实例时的元数据），且具有记忆能力；会在对应实例删除后，依旧存在一段时间，如果在此期间实例重新注册，该元数据依旧生效；您可以通过nacos.naming.clean.expired-metadata.expired-time及nacos.naming.clean.expired-metadata.interval对记忆时间进行修改。
> 例如， 注册实例时的元数据为`k1=v1`， 此时使用更新实例接口更新元数据为`k1=v2`，此时读取到的元数据为`v1=v2`
> ；此时注销后快速重新注册实例，元数据为`k1=v2`，而不是`k1=v1`。若注销后，等待`expired-metadata.expired-time`
> 时间后再次注册该实例，元数据为`k1=v1`。

> 同时该接口将会完全覆盖之前更新过的元数据信息，例如，先使用`k1=v1`更新元数据，再使用`k2=v2`
> 更新元数据，此时读取到的元数据为`k2=v2`，而不是`k1=v1,k2=v2`。

#### 起始版本

`3.0.0`

#### 请求方式

`PUT`

#### 鉴权状态

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/ns/instance`

#### 请求参数

| 参数名           | 参数类型                  | 是否必填  | 描述                      |
|---------------|-----------------------|-------|-------------------------|
| `namespaceId` | `string` | 否 | 命名空间ID，默认为`public` |
| `serviceName` | `string` | **是** | 服务名称 |
| `groupName` | `string` | 否 | 分组名称，默认为`DEFAULT_GROUP` |
| `clusterName` | `string` | 否 | 集群名称，默认为`DEFAULT` |
| `ip` | `string` | **是** | 实例IP |
| `port` | `integer` | **是** | 实例端口 |
| `weight` | `number` | 否 | 实例权重，默认为`1.0` |
| `healthy` | `boolean` | 否 | 健康状态，默认为`true` |
| `enabled` | `boolean` | 否 | 是否启用，默认为`true` |
| `metadata` | `string` | 否 | 实例元数据 |
| `ephemeral` | `boolean` | 否 | 是否临时实例 |

#### 返回数据

| 参数名    | 参数类型     | 描述     |
|--------|----------|--------|
| `data` | `string` | 操作结果信息 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance' \
-d 'serviceName=test&clusterName=DEFAULT&groupName=DEFAULT_GROUP&ip=1.1.1.1&port=3306&ephemeral=true&weight=100&enabled=false&metadata=%7B%22%E5%95%A6%E5%95%A6%E5%95%A6%26%E5%95%B5%E5%95%B5%E5%95%B5%22%3A%22xxx%22%7D'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.18 批量更新实例元数据

#### 接口描述

批量更新指定实例的元数据。

#### 起始版本

`3.0.0`

#### 请求方式

`PUT`

#### 鉴权状态

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/ns/instance/metadata/batch`

#### 请求参数

| 参数名               | 参数类型                  | 是否必填  | 描述                                                                                           |
|-------------------|-----------------------|-------|----------------------------------------------------------------------------------------------|
| `namespaceId` | `string` | 否 | 命名空间ID，默认为`public` |
| `serviceName` | `string` | **是** | 服务名称 |
| `groupName` | `string` | 否 | 分组名称，默认为`DEFAULT_GROUP` |
| `instances` | `string` | 否 | 实例列表（JSON数组 字符串）默认为`""`表示所有实例更新；若指定时，每个元素代表一个需要更新的实例，必须需要包含`ip`和`port`字段，`clusterName`字段为可选, |
| `metadata` | `string` | **是** | 元数据 |
| `consistencyType` | `string` | 否 | 一致性类型`ephemeral`和`persist`，对应服务的`ephemeral`，默认为`ephemeral` |

#### 返回数据

| **参数名** | **参数类型** | **描述** |
|-----------|--------------|----------|
| `data` | `InstanceMetadataBatchResult` | 批量操作结果。 |
| `data.updated` | `array<string>` | 更新的实例列表。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance/metadata/batch' \
-d 'namespaceId=public&serviceName=service1&groupName=DEFAULT_GROUP&instances=[{"ip":"127.0.0.1","port":8080}]&metadata={"key1":"value1"}&consistencyType=ephemeral'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "updated": [
      "127.0.0.1:8080:unknown:DEFAULT:ephemeral"
    ]
  }
}
```

### 2.19 批量删除实例元数据

#### 接口描述

批量删除指定实例的元数据。

#### 起始版本

`3.0.0`

#### 请求方式

`DELETE`

#### 鉴权状态

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/ns/instance/metadata/batch`

#### 请求参数

| 参数名               | 参数类型                  | 是否必填  | 描述                      |
|-------------------|-----------------------|-------|-------------------------|
| `namespaceId` | `string` | 否 | 命名空间ID，默认为`public` |
| `serviceName` | `string` | **是** | 服务名称 |
| `groupName` | `string` | 否 | 分组名称，默认为`DEFAULT_GROUP` |
| `instances` | `string` | 否 | 实例列表（JSON 字符串），默认为`""` |
| `metadata` | `string` | **是** | 元数据 |
| `consistencyType` | `string` | 否 | 一致性类型，默认为`""` |

#### 返回数据

| **参数名**        | **参数类型**                           | **描述**  |
|----------------|------------------------------------|---------|
| `data`         | `InstanceMetadataBatchResult` | 操作结果信息  |
| `data.updated` | `array<string>`                | 更新的实例列表 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance/metadata/batch?namespaceId=public&serviceName=service1&groupName=DEFAULT_GROUP&instances=%5B%7B%22ip%22%3A%22127.0.0.1%22%2C%22port%22%3A8080%7D%5D&metadata=%7B%22key1%22%3A%22value1%22%7D&consistencyType=ephemeral'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "updated": [
      "127.0.0.1:8080:unknown:DEFAULT:ephemeral"
    ]
  }
}
```

### 2.20 部分更新实例

#### 接口描述

部分更新指定实例的信息。

> 不同于[更新实例](#217-更新实例)，该接口支持部分更新实例信息，例如：先使用`k1=v1`更新元数据，再使用`k2=v2`
> 更新元数据，此时读取到的元数据为`k1=v1,k2=v2`。

#### 起始版本

`3.0.0`

#### 请求方式

`PUT`

#### 鉴权状态

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/ns/instance/partial`

#### 请求参数

| **参数名**       | **参数类型**  | **是否必填** | **描述**             |
|---------------|-----------|----------|--------------------|
| `namespaceId` | `string` | 否 | 命名空间ID，默认为`public` |
| `serviceName` | `string` | **是** | 服务名称 |
| `ip` | `string` | **是** | 实例IP |
| `port` | `integer` | **是** | 实例端口 |
| `clusterName` | `string` | 否 | 集群名称，默认为`DEFAULT` |
| `weight` | `number` | 否 | 实例权重，默认为1.0 |
| `enabled` | `boolean` | 否 | 是否启用，默认启用 |
| `metadata` | `string` | 否 | 实例元数据（JSON 字符串） |
| `groupName` | `string` | 否 | - |

#### 返回数据

| 参数名    | 参数类型     | 描述     |
|--------|----------|--------|
| `data` | `string` | 操作结果信息 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT "http://127.0.0.1:8848/nacos/v3/admin/ns/instance/partial" -d 'namespaceId=public&serviceName=example-service&ip=127.0.0.1&clusterName=DEFAULT&port=8080&weight=1.0&enabled=true&metadata={"key":"value"}'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.21 查询服务实例列表

#### 接口描述

查询指定服务的所有实例列表。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/ns/instance/list`

#### 请求参数

| **参数名**       | **参数类型**  | **是否必填** | **描述**                  |
|---------------|-----------|----------|-------------------------|
| `namespaceId` | `string` | 否 | 命名空间ID，默认`public` |
| `groupName` | `string` | 否 | 分组名称，默认为`DEFAULT_GROUP` |
| `serviceName` | `string` | **是** | 服务名称 |
| `clusterName` | `string` | 否 | 集群名称，不传则查询所有集群的实例 |
| `healthyOnly` | `boolean` | 否 | 是否只返回健康实例，默认为`false` |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名           | 参数类型      | 描述说明                              |
|---------------|-----------|-----------------------------------|
| `serviceName` | `string` | 服务名,格式为`groupName`@@`serviceName` |
| `clusterName` | `string` | 实例所在的集群名称                         |
| `ip`          | `string` | 实例`IP`                            |
| `port`        | `integer` | 实例端口号                             |
| `weight`      | `number` | 实例权重                              |
| `healthy`     | `boolean` | 实例是否健康                            |
| `enabled`     | `boolean` | 实例是否可用                            |
| `ephemeral`   | `boolean` | 是否为临时实例                           |
| `metadata`    | `map<string, string>`     | 实例元数据                             |
| `instanceId`  | `string` | 实例Id                              |

> 关于心跳的参数`instanceHeartBeatInterval`, `instanceHeartBeatTimeOut`和`ipDeleteTimeout`
> 用于兼容1.X客户端的心跳模式数据，后续版本可能会移除对1.X客户端的支持，届时这3个参数将被废弃。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance/list?namespaceId=public&serviceName=service1&healthyOnly=true'
```

* 返回示例

```json
{
  "code": 0,
  "data": [
    {
      "clusterName": "DEFAULT",
      "enabled": true,
      "ephemeral": false,
      "healthy": false,
      "instanceHeartBeatInterval": 5000,
      "instanceHeartBeatTimeOut": 15000,
      "instanceId": "1.1.1.1#3306#DEFAULT#DEFAULT_GROUP@@service1",
      "ip": "1.1.1.1",
      "ipDeleteTimeout": 30000,
      "metadata": {
        "key": "value"
      },
      "port": 3306,
      "serviceName": "DEFAULT_GROUP@@service1",
      "weight": 1.0
    }
  ],
  "message": "success"
}
```

### 2.22 查询实例详情

#### 接口描述

查询指定实例的详细信息。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/ns/instance`

#### 请求参数

| **参数名**       | **参数类型** | **是否必填** | **描述说明**               |
|---------------|----------|----------|------------------------|
| `namespaceId` | `string` | 否        | 命名空间Id，默认为`public`     |
| `groupName`   | `string` | 否    | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName` | `string` | **是**    | 服务名                    |
| `clusterName` | `string` | 否        | 集群名称，默认为`DEFAULT`      |
| `ip`          | `string` | **是**    | `IP`地址                 |
| `port`        | `integer` | **是**    | 端口号                    |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名           | 参数类型      | 描述说明                              |
|---------------|-----------|-----------------------------------|
| `serviceName` | `string` | 服务名,格式为`groupName`@@`serviceName` |
| `clusterName` | `string` | 实例所在的集群名称                         |
| `ip`          | `string` | 实例`IP`                            |
| `port`        | `integer` | 实例端口号                             |
| `weight`      | `number` | 实例权重                              |
| `healthy`     | `boolean` | 实例是否健康                            |
| `enabled`     | `boolean` | 实例是否可用                            |
| `ephemeral`   | `boolean` | 是否为临时实例                           |
| `metadata`    | `map<string, string>`     | 实例元数据                             |
| `instanceId`  | `string` | 实例Id                              |

> 关于心跳的参数`instanceHeartBeatInterval`, `instanceHeartBeatTimeOut`和`ipDeleteTimeout`
> 用于兼容1.X客户端的心跳模式数据，后续版本可能会移除对1.X客户端的支持，届时这3个参数将被废弃。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance?namespaceId=public&serviceName=service1&ip=1.1.1.1&port=3306'
```

* 返回示例

```json
{
  "code": 0,
  "data": [
    {
      "clusterName": "DEFAULT",
      "enabled": true,
      "ephemeral": false,
      "healthy": false,
      "instanceHeartBeatInterval": 5000,
      "instanceHeartBeatTimeOut": 15000,
      "instanceId": "1.1.1.1#3306#DEFAULT#DEFAULT_GROUP@@service1",
      "ip": "1.1.1.1",
      "ipDeleteTimeout": 30000,
      "metadata": {
        "key": "value"
      },
      "port": 3306,
      "serviceName": "DEFAULT_GROUP@@service1",
      "weight": 1.0
    }
  ],
  "message": "success"
}
```

### 2.23 创建服务

#### 接口描述

创建一个新的持久化服务。

#### 起始版本

`3.0.0`

#### 请求方式

`POST`

#### 鉴权状态

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/ns/service`

#### 请求参数

| 参数名                | 参数类型           | 是否必填  | 描述说明                   |
|--------------------|----------------|-------|------------------------|
| `namespaceId` | `string` | 否 | 命名空间`Id`，默认为`public` |
| `groupName` | `string` | 否 | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName` | `string` | **是** | 服务名 |
| `metadata` | `string` | 否 | 服务元数据，默认为空 |
| `ephemeral` | `boolean` | 否 | 是否为临时实例，默认为`false` |
| `protectThreshold` | `number` | 否 | 保护阈值，默认为`0` |
| `selector` | `string` | 否 | 访问策略，默认为空 |

#### 返回数据

| 参数名    | 参数类型      | 描述     |
|--------|-----------|--------|
| `data` | `boolean` | 是否执行成功 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -d 'serviceName=nacos.test.1' \
  -d 'ephemeral=true' \
  -d 'metadata={"k1":"v1"}' \
  -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ns/service'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 2.24 删除服务

#### 接口描述

删除指定服务

#### 起始版本

`3.0.0`

#### 请求方式

`DELETE`

#### 鉴权状态

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/ns/service`

#### 请求参数

| 参数名           | 参数类型     | 是否必填  | 描述说明                   |
|---------------|----------|-------|------------------------|
| `namespaceId` | `string` | 否     | 命名空间`Id`，默认为`public`   |
| `groupName`   | `string` | 否     | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName` | `string` | **是** | 服务名                    |

#### 返回数据

| 参数名    | 参数类型      | 描述     |
|--------|-----------|--------|
| `data` | `boolean` | 是否执行成功 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ns/service?serviceName=nacos.test.1'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 2.25 查询服务详情

#### 接口描述

查询指定服务的详细信息

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/ns/service`

#### 请求参数

| 参数名           | 参数类型     | 是否必填  | 描述说明                   |
|---------------|----------|-------|------------------------|
| `namespaceId` | `string` | 否     | 命名空间`Id`，默认为`public`   |
| `groupName`   | `string` | 否     | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName` | `string` | **是** | 服务名                    |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                                 | 参数类型         | 描述                                   |
|-----------------------------------------------------|--------------|--------------------------------------|
| `namespaceId`                                       | `string` | 服务所属的namespaceId。                    |
| `groupName`                                         | `string` | 服务所属的groupName。                      |
| `serviceName`                                       | `string` | 服务名。                                 |
| `ephemeral`                                         | `boolean` | 服务的持久化属性，`true`为临时服务，`false`为持久化服务。  |
| `protectThreshold`                                  | `number` | 服务防护阈值。                              |
| `selector`                                          | `object` | 服务选择器。                               |
| `metadata`                                          | `object` | 服务元数据。                               |
| `clusterMap`                                        | `object` | 服务集群列表, key为cluster的名称，value为集群详细信息。 |
| `clusterMap`.$ClusterName.`clusterName`             | `string` | 集群名。                                 |
| `clusterMap`.$ClusterName.`healthChecker`           | `object` | 健康检查器。                               |
| `clusterMap`.$ClusterName.`healthyCheckPort`        | `integer` | 健康检查端口。                              |
| `clusterMap`.$ClusterName.`useInstancePortForCheck` | `boolean` | 是否使用所注册的实例的`IP:Port`进行健康检查。          |
| `clusterMap`.$ClusterName.`metadata`                | `map<string, string>` | 集群元数据。                               |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/service?serviceName=nacos.test.1'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "clusterMap": {
      "DEFAULT": {
        "clusterName": "DEFAULT",
        "healthChecker": {
          "type": "NONE"
        },
        "healthyCheckPort": 80,
        "hosts": null,
        "metadata": {},
        "useInstancePortForCheck": true
      }
    },
    "ephemeral": false,
    "groupName": "DEFAULT_GROUP",
    "metadata": {},
    "namespaceId": "public",
    "protectThreshold": 0.0,
    "selector": {
      "contextType": "NONE",
      "type": "none"
    },
    "serviceName": "test"
  }
}
```

### 2.26 查询服务列表

#### 接口描述

查询所有服务的列表，支持分页和条件过滤。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/ns/service/list`

#### 请求参数

| 参数名           | 参数类型           | 是否必填  | 描述说明                   |
|---------------|----------------|-------|------------------------|
| `namespaceId` | `string` | 否 | 命名空间`Id`，默认为`public` |
| `pageNo` | `integer` | 否 | 页码，默认为 `1`，必须为正整数。 |
| `pageSize` | `integer` | 否 | 每页条数，默认为 `100`，必须为正整数。 |
| `groupNameParam` | `string` | 否 | - |
| `ignoreEmptyService` | `boolean` | 否 | - |
| `serviceNameParam` | `string` | 否 | - |
| `withInstances` | `boolean` | 否 | - |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                   | 参数类型     | 描述说明         |
|---------------------------------------|----------|--------------|
| `totalCount`                          | `integer` | 符合条件的服务的总数。  |
| `pageNumber`                          | `integer` | 当前页码，起始为`1`。 |
| `pagesAvailable`                      | `integer` | 可用页码。        |
| `pageItems`                           | `array`   | 服务列表。        |
| `pageItems`[i].`name`                 | `string` | 服务名。         |
| `pageItems`[i].`groupName`            | `string` | 服务的分组名。      |
| `pageItems`[i].`clusterCount`         | `string` | 服务下的集群数量。    |
| `pageItems`[i].`ipCount`              | `string` | 服务下的实例数量。    |
| `pageItems`[i].`healthyInstanceCount` | `string` | 服务下的健康实例数量。  |
| `pageItems`[i].`triggerFlag`          | `string` | 是否触发了服务的保护。  |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/service/list'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "pageItems": [
      {
        "clusterCount": 1,
        "groupName": "DEFAULT_GROUP",
        "healthyInstanceCount": 1,
        "ipCount": 1,
        "name": "com.test.SyncCallbackService",
        "triggerFlag": "false"
      },
      {
        "clusterCount": 1,
        "groupName": "DEFAULT_GROUP",
        "healthyInstanceCount": 0,
        "ipCount": 1,
        "name": "test",
        "triggerFlag": "true"
      }
    ],
    "pageNumber": 1,
    "pagesAvailable": 1,
    "totalCount": 2
  }
}
```

### 2.27 更新服务

#### 接口描述

更新指定服务的配置信息。

> 该接口将会完全覆盖之前更新过的元数据信息，例如，先使用`k1=v1`更新元数据，再使用`k2=v2`
> 更新元数据，此时读取到的元数据为`k2=v2`，而不是`k1=v1,k2=v2`。

#### 起始版本

`3.0.0`

#### 请求方式

`PUT`

#### 鉴权状态

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/ns/service`

#### 请求参数

| 参数名                | 参数类型           | 是否必填  | 描述说明                   |
|--------------------|----------------|-------|------------------------|
| `namespaceId` | `string` | 否 | 命名空间`Id`，默认为`public` |
| `groupName` | `string` | 否 | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName` | `string` | **是** | 服务名 |
| `metadata` | `string` | 否 | 服务元数据，默认为空 |
| `protectThreshold` | `number` | 否 | 保护阈值，默认为`0` |
| `selector` | `string` | 否 | 访问策略，默认为空 |

#### 返回数据

| 参数名    | 参数类型      | 描述     |
|--------|-----------|--------|
| `data` | `boolean` | 是否执行成功 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -d 'serviceName=nacos.test.1' \
  -d 'metadata={"k1":"v2"}' \
  -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ns/service'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 2.28 查询订阅者列表

#### 接口描述

查询指定服务的订阅者列表。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/ns/service/subscribers`

#### 请求参数

| **参数名**       | **参数类型**  | **是否必填** | **描述**                  |
|---------------|-----------|----------|-------------------------|
| `namespaceId` | `string` | 否 | 命名空间ID，默认为`public` |
| `serviceName` | `string` | **是** | 服务名称 |
| `groupName` | `string` | 否 | 分组名称，默认是`DEFAULT_GROUP` |
| `pageNo` | `integer` | 否 | 页码，默认为 `1`，必须为正整数。 |
| `pageSize` | `integer` | 否 | 每页条数，默认为 `100`，必须为正整数。 |
| `aggregation` | `boolean` | 否 | 是否聚合,默认为`true` |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                          | 参数类型      | 描述                   |
|------------------------------|-----------|----------------------|
| `totalCount`                 | `integer` | 符合条件的服务的总数。          |
| `pageNumber`                 | `integer` | 当前页码，起始为`1`。         |
| `pagesAvailable`             | `integer` | 可用页码。                |
| `pageItems`                  | `array`    | 服务列表。                |
| `pageItems`[i].`ip`          | `string` | 订阅者IP。               |
| `pageItems`[i].`port`        | `integer` | 订阅者端口。               |
| `pageItems`[i].`address`     | `string` | 订阅者地址, 一般为`ip:port`。 | 
| `pageItems`[i].`agent`       | `string` | 订阅者客户端版本。            |
| `pageItems`[i].`appName`     | `string` | 订阅者所属应用。             |
| `pageItems`[i].`namespaceId` | `string` | 订阅者所属命名空间。           |
| `pageItems`[i].`groupName`   | `string` | 订阅的分组名。              |
| `pageItems`[i].`serviceName` | `string` | 订阅的服务名。              |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/service/subscribers?namespaceId=public&serviceName=service1&groupName=DEFAULT_GROUP&pageNo=1&pageSize=10'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "pageItems": [
      {
        "address": "127.0.0.1:0",
        "agent": "Nacos-Java-Client:v3.0.0-BETA",
        "appName": "unknown",
        "groupName": "DEFAULT_GROUP",
        "ip": "127.0.0.1",
        "namespaceId": "public",
        "port": 0,
        "serviceName": "service1"
      }
    ],
    "pageNumber": 1,
    "pagesAvailable": 1,
    "totalCount": 1
  }
}
```

### 2.29 查询选择器类型

#### 接口描述

查询系统中支持的所有选择器类型。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/ns/service/selector/types`

#### 请求参数

无

#### 返回数据

| 参数名    | 参数类型           | 描述      |
|--------|----------------|---------|
| `data` | `array` | 选择器类型列表 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/service/selector/types'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": [
    "none",
    "label"
  ]
}
```

## 3. Nacos Config 运维 API

### 3.1. 获取配置

#### 接口描述

获取指定配置

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/cs/config`

#### 请求参数

| **参数名**       | **类型**   | **必填** | **默认值**  | **参数描述** |
|---------------|----------|--------|----------|----------|
| `namespaceId` | `string` | 否      | `public` | 命名空间     |
| `groupName`   | `string` | **是**  | 无        | 配置分组名    |
| `dataId`      | `string` | **是**  | 无        | 配置名      |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                | 参数类型     | 描述                         |
|--------------------|----------|----------------------------|
| `data` | `ConfigDetailInfo` | 配置详情，下列字段属于 `data`。 |
| `data.schema` | `string` | 该版本的配置模式。 |
| `id` | `string` | 记录 ID，以字符串返回以避免大整数精度丢失。 |
| `dataId`           | `string` | 配置ID。                      |
| `groupName`        | `string` | 配置分组。                      |
| `namespaceId`      | `string` | 命名空间ID。                    |
| `content`          | `string` | 配置内容。                      |
| `desc`             | `string` | 配置描述。                      |
| `md5`              | `string` | 配置内容的MD5值。                 |
| `configTags`       | `string` | 配置的标签。                     |
| `encryptedDataKey` | `string` | 加密配置内容的密钥，使用配置加密插件时存在。     |
| `appName`          | `string` | 配置所属的应用名称。                 |
| `type`             | `string` | 配置类型。                      |
| `createTime`       | `integer` | 配置创建时间。                    |
| `modifyTime`       | `integer` | 配置修改时间。                    |
| `createUser`       | `string` | 配置创建人。                     |
| `createIp`         | `string` | 配置创建IP。                    |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/config?dataId=nacos.example&groupName=DEFAULT_GROUP&namespaceId=public'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "appName": "",
    "configTags": null,
    "content": "contentTest",
    "createIp": "127.0.0.1",
    "createTime": 1741761841327,
    "createUser": "nacos",
    "dataId": "nacos.example",
    "desc": null,
    "encryptedDataKey": "",
    "groupName": "DEFAULT_GROUP",
    "id": "873810262413545472",
    "md5": "9f67e6977b100e00cab385a75597db58",
    "modifyTime": 1741761841327,
    "namespaceId": "public",
    "type": "text"
  }
}
```

### 3.2. 发布配置

#### 接口描述

发布指定配置

> 当配置已存在时，则对配置进行更新

#### 起始版本

`3.0.0`

#### 请求方式

`POST`

#### 鉴权状态

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/cs/config`

#### 请求参数

| 参数名           | 类型       | 必填    | 默认值      | 参数描述            |
|---------------|----------|-------|----------|-----------------|
| `namespaceId` | `string` | 否 | `public` |
| `groupName` | `string` | **是** | 无 |
| `dataId` | `string` | **是** | 无 |
| `content` | `string` | **是** | 无 |
| `appName` | `string` | 否 | 无 |
| `configTags` | `string` | 否 | 无 |
| `desc` | `string` | 否 | 无 |
| `use` | `string` | 否 | 无 | 配置用途。 |
| `effect` | `string` | 否 | 无 | 配置生效范围。 |
| `schema` | `string` | 否 | 无 | 配置模式。 |
| `type` | `string` | 否 | 无 |
| `encryptedDataKey` | `string` | 否 | - |
| `srcUser` | `string` | 否 | - |
| `tag` | `string` | 否 | - |

#### 返回数据

| 参数名    | 参数类型      | 描述     |
|--------|-----------|--------|
| `data` | `boolean` | 是否执行成功 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -d 'dataId=nacos.example' \
 -d 'groupName=DEFAULT_GROUP' \
 -d 'namespaceId=public' \
 -d 'content=contentTest' \
 -X POST 'http://127.0.0.1:8848/nacos/v3/admin/cs/config'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 3.3. 删除配置

#### 接口描述

删除指定配置

#### 起始版本

`3.0.0`

#### 请求方式

`DELETE`

#### 鉴权状态

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/cs/config`

#### 请求参数

| 参数名           | 类型       | 必填    | 默认值      | 参数描述  |
|---------------|----------|-------|----------|-------|
| `namespaceId` | `string` | 否     | `public` | 命名空间  |
| `groupName`   | `string` | **是** | 无        | 配置分组名 |
| `dataId`      | `string` | **是** | 无        | 配置名   |
| `tag`         | `string` | 否     | 无        | 配置标签 |

#### 返回数据

| 参数名    | 参数类型      | 描述     |
|--------|-----------|--------|
| `data` | `boolean` | 是否执行成功 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/cs/config?dataId=nacos.example&groupName=DEFAULT_GROUP&namespaceId=public'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 3.4 批量删除配置

#### 接口描述

根据配置ID批量删除配置

#### 起始版本

`3.0.0`

#### 请求方式

`DELETE`

#### 鉴权状态

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/cs/config/batch`

#### 请求参数

| 参数名   | 参数类型         | 是否必填  | 描述     |
|-------|--------------|-------|--------|
| `ids` | `array<integer>` | **是** | 配置 ID 列表，多个 ID 以逗号分隔。 |
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |

#### 返回数据

| 参数名    | 参数类型      | 描述   |
|--------|-----------|------|
| `data` | `boolean` | 操作结果 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/batch?ids=1,2,3'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 3.5 查询配置的监听者

#### 接口描述

查询指定配置的监听者信息

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/cs/config/listener`

#### 请求参数

| 参数名           | 参数类型      | 是否必填  | 默认值      | 描述        |
|---------------|-----------|-------|----------|-----------|
| `namespaceId` | `string` | 否     | `public` | 命名空间      |
| `dataId`      | `string` | **是** | 无        | 配置ID      |
| `groupName`   | `string` | **是** | 无        | 分组名称      |
| `aggregation` | `boolean` | 否 | `true`   | 是否从其他节点聚合 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名               | 参数类型                  | 描述                                    |
|-------------------|-----------------------|---------------------------------------|
| `queryType`       | `string` | 订阅者查询类型，该接口为`config`。                 |
| `listenersStatus` | `map<string, string>` | 订阅者列表，key为订阅者IP，value为订阅者订阅当前配置的MD5值。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/listener?namespaceId=public&dataId=example&groupName=DEFAULT_GROUP'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "listenersStatus": {
      "127.0.0.1": "32cacc65accfdab47954de3fc781e938"
    },
    "queryType": "config"
  }
}
```

### 3.6 通过配置内容查询配置列表

#### 接口描述

根据配置详情（如内容、标签等）搜索配置。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/cs/config/list`

#### 请求参数

| 参数名            | 参数类型      | 是否必填  | 默认值      | 描述                                                     |
|----------------|-----------|-------|----------|--------------------------------------------------------|
| `pageNo` | `integer` | 否 | 1 | 页码，必须为正整数。 |
| `pageSize` | `integer` | 否 | 100 | 每页条数，必须为正整数。 |
| `namespaceId` | `string` | 否 | `public` |
| `dataId` | `string` | 否 | `""` |
| `groupName` | `string` | 否 | `""` |
| `appName` | `string` | 否 |  |
| `configTags` | `string` | 否 |  |
| `type` | `string` | 否 |  |
| `configDetail` | `string` | **是** |  |
| `search` | `string` | 否 | 搜索模式：`blur` 或 `accurate`。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                          | 参数类型     | 描述                         |
|------------------------------|----------|----------------------------|
| `totalCount`                 | `integer` | 符合规则的配置总数。                 |
| `pagesAvailable`             | `integer` | 可用页码总数。                    |
| `pageNumber`                 | `integer` | 当前页码。                      |
| `pageItems`                  | `array`   | 符合规则的配置列表。                 |
| `pageItems`[i].`id`          | `string` | 配置在存储系统中的ID，一般为Long类型的字符串。 |
| `pageItems`[i].`dataId`      | `string` | 配置ID。                      |
| `pageItems`[i].`groupName`   | `string` | 配置分组。                      |
| `pageItems`[i].`namespaceId` | `string` | 命名空间ID。                    |
| `pageItems`[i].`md5`         | `string` | 配置内容的MD5值。                 |
| `pageItems`[i].`appName`     | `string` | 配置所属的应用名称。                 |
| `pageItems`[i].`type`        | `string` | 配置类型。                      |
| `pageItems`[i].`createTime`  | `integer` | 配置创建时间。                    |
| `pageItems`[i].`modifyTime`  | `integer` | 配置修改时间。                    |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/list?pageNo=1&pageSize=10'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "pageItems": [
      {
        "appName": "",
        "createTime": 0,
        "dataId": "111",
        "groupName": "DEFAULT_GROUP",
        "id": "873475812546842624",
        "md5": null,
        "modifyTime": 0,
        "namespaceId": "public",
        "type": "text"
      },
      {
        "appName": "",
        "createTime": 0,
        "dataId": "qtc-user.yaml",
        "groupName": "DEFAULT_GROUP",
        "id": "873476606771859456",
        "md5": null,
        "modifyTime": 0,
        "namespaceId": "public",
        "type": "text"
      }
    ],
    "pageNumber": 1,
    "pagesAvailable": 1,
    "totalCount": 2
  }
}
```

### 3.7 停止Beta配置

#### 接口描述

停止指定配置的Beta配置

> 只有在[发布配置](#32-发布配置)时设置了`Header`的`betaIps`后，将配置变更为BETA发布中的状态，调用此接口才能停止BETA发布状态。

#### 起始版本

`3.0.0`

#### 请求方式

`DELETE`

#### 鉴权状态

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/cs/config/beta`

#### 请求参数

| 参数名           | 参数类型     | 是否必填  | 默认值      | 描述   |
|---------------|----------|-------|----------|------|
| `namespaceId` | `string` | 否     | `public` | 命名空间 |
| `dataId`      | `string` | **是** | 无        | 配置ID |
| `groupName`   | `string` | **是** | 无        | 分组名称 |

#### 返回数据

| 参数名    | 参数类型      | 描述   |
|--------|-----------|------|
| `data` | `boolean` | 操作结果 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/beta?namespaceId=public&dataId=example&groupName=DEFAULT_GROUP'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 3.8 查询Beta配置

#### 接口描述

查询指定配置的Beta配置

> 只有在[发布配置](#32-发布配置)时设置了`Header`的`betaIps`后，将配置变更为BETA发布中的状态，调用此接口才能停止BETA发布状态。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/cs/config/beta`

#### 请求参数

| 参数名           | 参数类型     | 是否必填  | 默认值      | 描述   |
|---------------|----------|-------|----------|------|
| `namespaceId` | `string` | 否     | `public` | 命名空间 |
| `dataId`      | `string` | **是** | 无        | 配置ID |
| `groupName`   | `string` | **是** | 无        | 分组名称 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                | 参数类型     | 描述                                  |
|--------------------|----------|-------------------------------------|
| `data` | `ConfigGrayInfo` | Beta 配置详情，下列字段属于 `data`。 |
| `data.schema` | `string` | 该版本的配置模式。 |
| `id` | `string` | 记录 ID，以字符串返回以避免大整数精度丢失。 |
| `dataId`           | `string` | 配置的dataId。                          |
| `groupName`        | `string` | 配置的groupName。                       |
| `namespaceId`      | `string` | 配置所属的命名空间。                          |
| `desc`             | `string` | 配置描述。                               |
| `md5`              | `string` | 配置内容的MD5值。                          |
| `configTags`       | `string` | 配置的标签。                              |
| `encryptedDataKey` | `string` | 加密配置内容的密钥，使用配置加密插件时存在。              |
| `appName`          | `string` | 配置所属的应用名称。                          |
| `type`             | `string` | 配置类型。                               |
| `createTime`       | `integer` | 配置创建时间。                             |
| `modifyTime`       | `integer` | 配置修改时间。                             |
| `createUser`       | `string` | 配置创建人。                              |
| `createIp`         | `string` | 配置创建IP。                             |
| `grayName`         | `string` | 灰度发布规则名称, 固定为`beta`。                |
| `grayRule`         | `string` | 灰度发布规则，格式为JSON，其中的`expr`为beta的ip列表。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/beta?namespaceId=public&dataId=example&groupName=DEFAULT_GROUP'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "appName": "",
    "configTags": null,
    "content": "bbb11xxccc",
    "createIp": null,
    "createTime": 0,
    "createUser": "nacos",
    "dataId": "example",
    "desc": null,
    "encryptedDataKey": null,
    "grayName": "beta",
    "grayRule": "{\"type\":\"beta\",\"version\":\"1.0.0\",\"expr\":\"1.1.1.1\",\"priority\":2147483647}",
    "groupName": "DEFAULT_GROUP",
    "id": "873481464488923136",
    "md5": "2f080e5e21ba12bb8ca6894ac0fc5862",
    "modifyTime": 1741683449619,
    "namespaceId": "public",
    "type": null
  }
}
```

### 3.9 导入并发布配置

#### 接口描述

导入配置并发布到指定命名空间

#### 起始版本

`3.0.0`

#### 请求方式

`POST`

请求体类型：`multipart/form-data`，参数放在请求体中。

#### 鉴权状态

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/cs/config/import`

#### 请求参数

| 参数名           | 参数类型               | 是否必填 | 默认值              | 描述     |
|---------------|--------------------|------|------------------|--------|
| `namespaceId` | `string` | 否 | `public` | 目标命名空间；Query 与 multipart 表单均支持。 |
| `src_user` | `string` | 否 | 无 | 导入操作用户；Query 与 multipart 表单均支持。 |
| `policy` | `string` | 否 | `ABORT` | 冲突策略；Query 与 multipart 表单均支持。 |
| `file` | `file` | **是** | 无 | multipart 表单中的配置 ZIP 文件。 |

#### 返回数据

| 参数名              | 参数类型                  | 描述     |
|------------------|-----------------------|--------|
| `data`           | `map<string, object>` | 导入结果   |
| `data.succCount` | `integer` | 成功导入数量 |
| `data.skipCount` | `integer` | 跳过导入数量 |

#### 示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/import' \
-H 'Content-Type: multipart/form-data' \
-F 'namespaceId=test' \
-F 'file=@/path/to/config.zip'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "succCount": 10,
    "skipCount": 2
  }
}
```

### 3.10 导出配置

#### 接口描述

导出指定配置为ZIP文件。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/cs/config/export`

#### 请求参数

| 参数名           | 参数类型         | 是否必填 | 默认值      | 描述     |
|---------------|--------------|------|----------|--------|
| `namespaceId` | `string` | 否 | `public` |
| `groupName` | `string` | 否 | `""` |
| `dataId` | `string` | 否 | `""` |
| `ids` | `array<integer>` | 否 | 配置 ID 列表，多个 ID 以逗号分隔。 |
| `appName` | `string` | 否 | - |

> 使用时建议分开使用 `ids` 和 `dataId` + `groupName` 的组合，只选择一种方式，另一类传入空字符串，否则可能导致导出文件为空内容。

#### 返回数据

返回体为ZIP文件，包含配置内容和元数据

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/export?namespaceId=public&ids=' --output config.zip
```

### 3.11 克隆配置

#### 接口描述

克隆配置到指定命名空间

#### 起始版本

`3.0.0`

#### 请求方式

`POST`

请求体类型：`application/json`，请求体为配置列表数组。

#### 鉴权状态

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/cs/config/clone`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `src_user` | `string` | 否 | Query 参数；克隆操作来源用户，未提供时从当前请求身份获取。 |
| `namespaceId` | `string` | **是** | Query 参数；目标命名空间 ID。 |
| `sourceNamespaceId` | `string` | 否 | Query 参数；源命名空间 ID，默认 `public`。 |
| `policy` | `string` | 否 | Query 参数；冲突处理策略，可选 `ABORT`、`SKIP`、`OVERWRITE`，默认 `ABORT`。 |
| `body[].configId` | `integer` | 否 | Body 数组元素字段；待克隆配置的存储 ID。 |
| `body[].targetGroupName` | `string` | 否 | Body 数组元素字段；克隆后的新分组名，未提供时沿用原分组名。 |
| `body[].targetDataId` | `string` | 否 | Body 数组元素字段；克隆后的新 Data ID，未提供时沿用原 Data ID。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名         | 参数类型      | 描述     |
|-------------|-----------|--------|
| `succCount` | `integer` | 成功导入数量 |
| `skipCount` | `integer` | 跳过导入数量 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/clone?namespaceId=test&policy=ABORT' \
  -H 'Content-Type: application/json' \
  -d '[{"configId":838029534438625280,"targetDataId":"111","targetGroupName":"DEFAULT_GROUP"},{"configId":838033747294031872,"targetDataId":"qtc-user.yaml","targetGroupName":"DEFAULT_GROUP"}]'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "succCount": 2,
    "skipCount": 0
  }
}
```

### 3.12. 查询配置历史列表

#### 接口描述

获取指定配置的历史版本列表

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/cs/history/list`

#### 请求参数

| 参数名           | 类型       | 必填    | 默认值             | 参数描述  |
|---------------|----------|-------|-----------------|-------|
| `namespaceId` | `string` | 否     | `public`        | 命名空间  |
| `groupName`   | `string` | **是** | 无               | 配置分组名 |
| `dataId`      | `string` | **是** | 无               | 配置名   |
| `pageNo`      | `integer` | 否 | `1` | 页码，必须为正整数。 |
| `pageSize`    | `integer` | 否 | `100` | 每页条数，必须为正整数。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                          | 参数类型     | 描述                                |
|------------------------------|----------|-----------------------------------|
| `totalCount`                 | `integer` | 历史记录的总数。                          |
| `pageNumber`                 | `integer` | 当前页码，起始为`1`。                      |
| `pagesAvailable`             | `integer` | 可用页码。                             |
| `pageItems`                  | `array`   | 历史记录列表。                           |
| `pageItems`[i].`id`          | `string` | 历史记录的ID。                          |
| `pageItems`[i].`dataId`      | `string` | 配置的dataId。                        |
| `pageItems`[i].`groupName`   | `string` | 配置的groupName。                     |
| `pageItems`[i].`namespaceId` | `string` | 配置所属的命名空间。                        |
| `pageItems`[i].`appName`     | `string` | 配置所属的appName。                     |
| `pageItems`[i].`opType`      | `string` | 操作类型，`I`为插入、`U`为更新、`D`为删除。        |
| `pageItems`[i].`publishType` | `string` | 发布类型，`formal`为普通发布，`gray`为beta发布。 |
| `pageItems`[i].`srcIp`       | `string` | 发布的来源IP。                          |
| `pageItems`[i].`srcUser`     | `string` | 发布的用户，仅在开启鉴权并登录用户后才发布配置才存在。       |
| `pageItems`[i].`createTime`  | `integer` | 配置创建时间。                           |
| `pageItems`[i].`modifyTime`  | `integer` | 配置修改时间。                           |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/history/list?dataId=nacos.example&groupName=DEFAULT_GROUP&namespaceId=public&pageNo=1&pageSize=100'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "pageItems": [
      {
        "appName": "",
        "createTime": 1272988800000,
        "dataId": "nacos.example",
        "groupName": "DEFAULT_GROUP",
        "id": "102",
        "md5": null,
        "modifyTime": 1741762032116,
        "namespaceId": "public",
        "opType": "D         ",
        "publishType": "formal",
        "srcIp": "127.0.0.1",
        "srcUser": "nacos",
        "type": null
      },
      {
        "appName": "",
        "createTime": 1272988800000,
        "dataId": "nacos.example",
        "groupName": "DEFAULT_GROUP",
        "id": "101",
        "md5": null,
        "modifyTime": 1741761841295,
        "namespaceId": "public",
        "opType": "I         ",
        "publishType": "formal",
        "srcIp": "127.0.0.1",
        "srcUser": "nacos",
        "type": null
      }
    ],
    "pageNumber": 1,
    "pagesAvailable": 1,
    "totalCount": 2
  }
}
```

### 3.13. 查询配置某一历史版本详情

#### 接口描述

通过该接口，可以查询配置的某次历史变更记录。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/cs/history`

#### 请求参数

| 参数名         | 类型       | 必填    | 默认值      | 参数描述   |
|-------------|----------|-------|----------|--------|
| namespaceId | `string` | 否     | `public` | 命名空间   |
| groupName   | `string` | **是** | 无        | 配置分组名  |
| dataId      | `string` | **是** | 无        | 配置名    |
| nid         | `integer` | **是** | 无        | 配置历史Id |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名           | 参数类型         | 描述                                                                          |
|---------------|--------------|-----------------------------------------------------------------------------|
| `data` | `ConfigHistoryDetailInfo` | 历史配置详情，下列字段属于 `data`。 |
| `data.schema` | `string` | 该版本的配置模式。 |
| `id` | `string` | 记录 ID，以字符串返回以避免大整数精度丢失。 |
| `dataId`      | `string` | 配置的dataId。                                                                  |
| `groupName`   | `string` | 配置的groupName。                                                               |
| `namespaceId` | `string` | 配置所属的命名空间。                                                                  |
| `content`     | `string` | 配置内容。 |
| `appName`     | `string` | 配置所属的appName。                                                               |
| `opType`      | `string` | 操作类型，`I`为插入、`U`为更新、`D`为删除。                                                  |
| `publishType` | `string` | 发布类型，`formal`为普通发布，`gray`为beta发布。                                           |
| `srcIp`       | `string` | 发布的来源IP。                                                                    |
| `srcUser`     | `string` | 发布的用户，仅在开启鉴权并登录用户后才发布配置才存在。                                                 |
| `createTime`  | `integer` | 配置创建时间。                                                                     |
| `modifyTime`  | `integer` | 配置修改时间。                                                                     |
| `grayName`    | `string` | 灰度发布规则名称, 固定为`beta`。                                                        |
| `extInfo`     | `string` | 扩展信息，目前包括`src_user`、`type`、`c_desc`，若`publishType`为`gray`, 其中还包括`grayRule`。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/history?dataId=111&groupName=DEFAULT_GROUP&nid=7'
```

* 返回示例

```json
{
  "code": 0,
  "data": {
    "appName": "",
    "content": "bbb11xx",
    "createTime": 1272988800000,
    "dataId": "111",
    "encryptedDataKey": "",
    "extInfo": "{\"src_user\":\"nacos\",\"type\":\"text\",\"c_desc\":\"111\"}",
    "grayName": "",
    "groupName": "DEFAULT_GROUP",
    "id": "7",
    "md5": "7d37afdb0b04d958d529bcb6de44fa71",
    "modifyTime": 1741682102157,
    "namespaceId": "public",
    "opType": "I         ",
    "publishType": "formal",
    "srcIp": "0:0:0:0:0:0:0:1",
    "srcUser": "nacos",
    "type": null
  },
  "message": "success"
}
```

### 3.14. 查询配置上一版本信息

#### 接口描述

获取指定配置的上一版本

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/cs/history/previous`

#### 请求参数

| 参数名         | 类型       | 必填    | 默认值      | 参数描述  |
|-------------|----------|-------|----------|-------|
| namespaceId | `string` | 否     | `public` | 命名空间  |
| groupName   | `string` | **是** | 无        | 配置分组名 |
| dataId      | `string` | **是** | 无        | 配置名   |
| id          | `integer` | **是** | 无        | 配置Id  |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名           | 参数类型         | 描述                                                                          |
|---------------|--------------|-----------------------------------------------------------------------------|
| `data` | `ConfigHistoryDetailInfo` | 上一版本配置详情，下列字段属于 `data`。 |
| `data.schema` | `string` | 该版本的配置模式。 |
| `id` | `string` | 记录 ID，以字符串返回以避免大整数精度丢失。 |
| `dataId`      | `string` | 配置的dataId。                                                                  |
| `groupName`   | `string` | 配置的groupName。                                                               |
| `namespaceId` | `string` | 配置所属的命名空间。                                                                  |
| `content`     | `string` | 配置内容。 |
| `appName`     | `string` | 配置所属的appName。                                                               |
| `opType`      | `string` | 操作类型，`I`为插入、`U`为更新、`D`为删除。                                                  |
| `publishType` | `string` | 发布类型，`formal`为普通发布，`gray`为beta发布。                                           |
| `srcIp`       | `string` | 发布的来源IP。                                                                    |
| `srcUser`     | `string` | 发布的用户，仅在开启鉴权并登录用户后才发布配置才存在。                                                 |
| `createTime`  | `integer` | 配置创建时间。                                                                     |
| `modifyTime`  | `integer` | 配置修改时间。                                                                     |
| `grayName`    | `string` | 灰度发布规则名称, 固定为`beta`。                                                        |
| `extInfo`     | `string` | 扩展信息，目前包括`src_user`、`type`、`c_desc`，若`publishType`为`gray`, 其中还包括`grayRule`。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/history/previous?id=101&dataId=nacos.example&groupName=DEFAULT_GROUP&namespaceId=public'
```

* 返回示例

```json
{
  "code": 0,
  "data": {
    "appName": "",
    "content": "bbb11xx",
    "createTime": 1272988800000,
    "dataId": "nacos.example",
    "encryptedDataKey": "",
    "extInfo": "{\"src_user\":\"nacos\",\"type\":\"text\",\"c_desc\":\"111\"}",
    "grayName": "",
    "groupName": "DEFAULT_GROUP",
    "id": "7",
    "md5": "7d37afdb0b04d958d529bcb6de44fa71",
    "modifyTime": 1741682102157,
    "namespaceId": "public",
    "opType": "I         ",
    "publishType": "formal",
    "srcIp": "0:0:0:0:0:0:0:1",
    "srcUser": "nacos",
    "type": null
  },
  "message": "success"
}
```

### 3.15. 查询指定命名空间下的配置列表

#### 接口描述

获取指定命名空间下的配置信息列表

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/cs/history/configs`

#### 请求参数

| 参数名         | 类型       | 必填    | 默认值 | 参数描述 |
|-------------|----------|-------|-----|------|
| namespaceId | `string` | **是** | 无   | 命名空间 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名         | 参数类型     | 描述            |
|-------------|----------|---------------|
| `dataId`    | `string` | 配置的dataId。    |
| `groupName` | `string` | 配置的groupName。 |

> 其他字段均无用。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/history/configs?namespaceId=public'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "appName": "",
      "createTime": 0,
      "dataId": "111",
      "groupName": "DEFAULT_GROUP",
      "id": "0",
      "md5": null,
      "modifyTime": 1741682102161,
      "namespaceId": "public",
      "type": "text"
    },
    {
      "appName": "",
      "createTime": 0,
      "dataId": "qtc-user.yaml",
      "groupName": "DEFAULT_GROUP",
      "id": "0",
      "md5": null,
      "modifyTime": 1741682291519,
      "namespaceId": "public",
      "type": "text"
    }
  ]
}
```

### 3.16 查询容量信息

#### 接口描述

查询指定分组或命名空间的容量信息

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/capacity`

#### 请求参数

| 参数名           | 参数类型     | 是否必填 | 默认值 | 描述     |
|---------------|----------|------|-----|--------|
| `groupName`   | `string` | 否    | 无   | 分组名称   |
| `namespaceId` | `string` | 否    | 无   | 命名空间ID |

**注意** ：`groupName` 和 `namespaceId` 至少需要提供一个。

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                | 参数类型      | 描述         |
|--------------------|-----------|------------|
| `id`               | `integer` | 容量信息的唯一ID  |
| `groupName`        | `string` | 分组名称       |
| `namespaceId`      | `string` | 命名空间ID     |
| `quota`            | `integer` | 配额         |
| `usage`            | `integer` | 当前使用量      |
| `maxSize`          | `integer` | 最大单配置大小    |
| ~~`gmtCreate`~~    | `string` | 创建时间，将废弃   |
| ~~`gmtModified`~~  | `string` | 最后修改时间，将废弃 |
| ~~`maxAggrCount`~~ | `integer` | 未使用，将废弃    |
| ~~`maxAggrSize`~~  | `integer` | 未使用，将废弃    |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/capacity?namespaceId=public'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "gmtCreate": null,
    "gmtModified": null,
    "id": "1",
    "maxAggrCount": 10000,
    "maxAggrSize": 1024,
    "maxSize": 102400,
    "namespaceId": "public",
    "quota": 200,
    "usage": 2
  }
}
```

### 3.17 更新容量信息

#### 接口描述

更新指定分组或命名空间的容量信息。如果容量信息未初始化，则会自动初始化

#### 起始版本

`3.0.0`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/capacity`

#### 请求参数

| 参数名           | 参数类型      | 是否必填  | 描述                   |
|---------------|-----------|-------|----------------------|
| `groupName` | `string` | 否 | 分组名称，与命名空间ID 两者必须有其一 |
| `namespaceId` | `string` | 否 | 命名空间ID，与分组名称 两者必须有其一 |
| `quota` | `integer` | 否 | 配额 |
| `maxSize` | `integer` | 否 | 最大大小 |
| `maxAggrCount` | `integer` | 否 | - |
| `maxAggrSize` | `integer` | 否 | - |

#### 返回数据

| 参数名    | 参数类型      | 描述   |
|--------|-----------|------|
| `data` | `boolean` | 操作结果 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/cs/capacity' -d 'namespaceId=public&quota=200&maxSize=2048'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 3.18 手动触发本地缓存更新

#### 接口描述

手动触发从存储中加载所有配置数据到本地缓存。

#### 起始版本

`3.0.0`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/ops/localCache`

#### 请求参数

无

#### 返回数据

| 参数名    | 参数类型     | 描述   |
|--------|----------|------|
| `data` | `string` | 操作结果 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/cs/ops/localCache'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "Local cache updated from store successfully!"
}
```

### 3.19 设置日志级别

#### 接口描述

动态设置指定模块的日志级别

#### 起始版本

`3.0.0`

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/ops/log`

#### 请求参数

| 参数名        | 参数类型     | 是否必填  | 默认值 | 描述                    |
|------------|----------|-------|-----|-----------------------|
| `logName`  | `string` | **是** | 无   | 模块名称                  |
| `logLevel` | `string` | **是** | 无   | 日志级别（如`INFO`、`DEBUG`） |

#### 返回数据

| 参数名    | 参数类型     | 描述   |
|--------|----------|------|
| `data` | `string` | 操作结果 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/cs/ops/log' -d "logName=config-server&logLevel=DEBUG"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "Log level updated successfully! Module: com.alibaba.nacos, Log Level: DEBUG"
}
```

### 3.20 执行Derby数据库操作

#### 接口描述

执行Derby数据库的查询操作（仅支持 `SELECT` 语句）

> **注意** 此接口需要开启`nacos.config.derby.ops.enabled`配置，且数据库为`Derby` 时才可使用，仅提供给运维人员进行Derby数据库排查数据问题时使用。

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/ops/derby`

#### 请求参数

| 参数名   | 参数类型     | 是否必填  | 默认值 | 描述       |
|-------|----------|-------|-----|----------|
| `sql` | `string` | **是** | 无   | SQL 查询语句 |

#### 返回数据

| 参数名    | 参数类型                        | 描述   |
|--------|-----------------------------|------|
| `data` | `array` | 查询结果 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/ops/derby?sql=SELECT%20*%20FROM%20config_info'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "APP_NAME": "",
      "CONTENT": "bbb11xx",
      "C_DESC": "111",
      "C_SCHEMA": null,
      "C_USE": null,
      "DATA_ID": "111",
      "EFFECT": null,
      "ENCRYPTED_DATA_KEY": "",
      "GMT_CREATE": "2025-03-11T08:35:02.161+00:00",
      "GMT_MODIFIED": "2025-03-11T08:35:02.161+00:00",
      "GROUP_ID": "DEFAULT_GROUP",
      "ID": 873475812546842624,
      "MD5": "7d37afdb0b04d958d529bcb6de44fa71",
      "SRC_IP": "0:0:0:0:0:0:0:1",
      "SRC_USER": "nacos",
      "TENANT_ID": "public",
      "TYPE": "text"
    }
  ]
}
```

若未开启功能，则返回

```json
{
  "code": 30000,
  "data": null,
  "message": "Derby ops is disabled, please set `nacos.config.derby.ops.enabled=true` to enabled this feature."
}
```

### 3.21 导入Derby数据库数据

#### 接口描述

从外部数据源导入数据到Derby数据库

> **注意** 此接口需要开启`nacos.config.derby.ops.enabled`配置，且数据库为`Derby` 时才可使用，仅提供给运维人员进行Derby数据库排查数据问题时使用。

#### 起始版本

`3.0.0`

#### 请求方式

`POST`

请求体类型：`multipart/form-data`，参数放在请求体中。

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/ops/derby/import`

#### 请求参数

| 参数名    | 参数类型            | 是否必填 | 默认值 | 描述           |
|--------|-----------------|------|-----|--------------|
| `file` | `file` | **是** | 无   | 导入文件（SQL 文件）。 |

#### 返回数据

| 参数名    | 参数类型     | 描述     |
|--------|----------|--------|
| `data` | `string` | 导入结果信息 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/cs/ops/derby/import' \
-H 'Content-Type: multipart/form-data' \
-F 'file=@data.sql'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "Data imported successfully!"
}
```

### 3.22 获取客户端订阅信息

#### 接口描述

获取指定 IP 客户端的订阅配置信息

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/cs/listener`

#### 请求参数

| 参数名           | 参数类型      | 是否必填  | 默认值      | 描述         |
|---------------|-----------|-------|----------|------------|
| `ip`          | `string` | **是** | 无        | 客户端 IP 地址  |
| `all`         | `boolean` | 否     | `false`  | 是否返回所有配置信息 |
| `namespaceId` | `string` | 否     | `public` | 命名空间ID     |
| `aggregation` | `boolean` | 否     | `true`   | 是否从其他节点聚合  |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名               | 参数类型                  | 描述                                                                            |
|-------------------|-----------------------|-------------------------------------------------------------------------------|
| `queryType`       | `string` | 订阅者查询类型，该接口为`ip`。                                                             |
| `listenersStatus` | `map<string, string>` | 订阅者列表，key为订阅的配置信息，格式为`dataId`+`groupName`+`namespaceId`，value为订阅者订阅当前配置的MD5值。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/listener?ip=127.0.0.1&namespaceId=public'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "listenersStatus": {
      "qtc-user.yaml+DEFAULT_GROUP+public": "32cacc65accfdab47954de3fc781e938"
    },
    "queryType": "ip"
  }
}
```

### 3.23 获取集群客户端指标

#### 接口描述

获取集群中指定 IP 客户端的配置指标信息

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/metrics/cluster`

#### 请求参数

| **参数名**       | **参数类型** | **是否必填** | **默认值**  | **描述**    |
|---------------|----------|----------|----------|-----------|
| `ip`          | `string` | **是**    | 无        | 客户端 IP 地址 |
| `dataId`      | `string` | **是**    | 无        | 配置ID      |
| `groupName`   | `string` | **是**    | 无        | 分组名称      |
| `namespaceId` | `string` | 否        | `public` | 命名空间ID    |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                            | 参数类型      | 描述说明     |
|------------------------------------------------|-----------|----------|
| `data`                                         |           | 服务信息     |
| `data.{namespaceId}.isFixedServer`             | `boolean` | 是否固定服务器  |
| `data.{namespaceId}.snapshotDir`               | `string` | 快照目录路径   |
| `data.{namespaceId}.clientVersion`             | `string` | 客户端版本    |
| `data.{namespaceId}.serverUrls`                | `string` | 服务器URL列表 |
| `data.{namespaceId}.listenConfigSize`          | `integer` | 监听配置大小   |
| `data.{namespaceId}.metricValues.cacheData`    | `string` | 缓存数据md5值 |
| `data.{namespaceId}.metricValues.snapshotData` | `string` | 快照数据md5值 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/metrics/cluster?ip=127.0.0.1&dataId=example&groupName=DEFAULT_GROUP&namespaceId=public'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "a981e0a8-f394-425c-ac2a-ab753586428b": {
      "isFixedServer": true,
      "snapshotDir": "/path/to/nacos/config",
      "clientVersion": "Nacos-Java-Client:v2.1.0",
      "serverUrls": "http://127.0.0.1:8848",
      "listenConfigSize": 1,
      "metricValues": {
        "cacheData": "asdasd:a8f5f167f44f4964e6c998dee827110c",
        "snapshotData": "asdasd:a8f5f167f44f4964e6c998dee827110c"
      }
    }
  }
}
```

### 3.24 获取本地客户端指标

#### 接口描述

获取本地机器上指定 IP 客户端指标信息

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/metrics/ip`

#### 请求参数

| **参数名**       | **参数类型** | **是否必填** | **默认值**  | **描述**    |
|---------------|----------|----------|----------|-----------|
| `ip`          | `string` | **是**    | 无        | 客户端 IP 地址 |
| `dataId`      | `string` | **是**    | 无        | 配置ID      |
| `groupName`   | `string` | **是**    | 无        | 分组名称      |
| `namespaceId` | `string` | 否        | `public` | 命名空间      |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                            | 参数类型      | 描述说明     |
|------------------------------------------------|-----------|----------|
| `data`                                         |           | 服务信息     |
| `data.{namespaceId}.isFixedServer`             | `boolean` | 是否固定服务器  |
| `data.{namespaceId}.snapshotDir`               | `string` | 快照目录路径   |
| `data.{namespaceId}.clientVersion`             | `string` | 客户端版本    |
| `data.{namespaceId}.serverUrls`                | `string` | 服务器URL列表 |
| `data.{namespaceId}.listenConfigSize`          | `integer` | 监听配置大小   |
| `data.{namespaceId}.metricValues.cacheData`    | `string` | 缓存数据md5值 |
| `data.{namespaceId}.metricValues.snapshotData` | `string` | 快照数据md5值 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/metrics/ip?ip=127.0.0.1&dataId=example&groupName=DEFAULT_GROUP&namespaceId=public'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "a981e0a8-f394-425c-ac2a-ab753586428b": {
      "isFixedServer": true,
      "snapshotDir": "/path/to/nacos/config",
      "clientVersion": "Nacos-Java-Client:v2.1.0",
      "serverUrls": "http://127.0.0.1:8848",
      "listenConfigSize": 1,
      "metricValues": {
        "cacheData": "asdasd:a8f5f167f44f4964e6c998dee827110c",
        "snapshotData": "asdasd:a8f5f167f44f4964e6c998dee827110c"
      }
    }
  }
}
```

### 3.25. 更新配置元数据

#### 接口描述

通过该接口，可以更新配置的元数据信息：仅能更新`描述`和`标签`。

#### 起始版本

`3.1.0`

#### 请求方式

`PUT`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/nacos/v3/admin/cs/config/metadata`

#### 请求参数

| **参数名**       | **参数类型** | **是否必填** | **默认值**  | **描述** |
|---------------|----------|----------|----------|--------|
| `dataId`      | `string` | **是**    | 无        | 配置ID   |
| `groupName`   | `string` | **是**    | 无        | 分组名称   |
| `namespaceId` | `string` | 否        | `public` | 命名空间   |
| `desc`        | `string` | 否        | null     | 配置的新描述 |
| `configTags`  | `string` | 否        | null     | 配置的新标签 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型      | 描述   |
|--------|-----------|------|
| `data` | `boolean` | 操作结果 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/metadata' \
-d 'namespaceId=public' \
-d 'groupName=DEFAULT_GROUP' \
-d 'dataId=test' \
-d 'desc=testDesc' \
-d 'configTags=customTag'
```
* 返回示例

```json
{
  "code" : 0,
  "message" : "success",
  "data" : true
}
```

### 3.26. 查询灰度配置

#### 接口描述

通过该接口，可以查询指定灰度配置的详情。

#### 起始版本

`3.2.2`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/config/gray`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，不传默认为 `public`。 |
| `groupName` | `string` | **是** | 配置分组名称。 |
| `dataId` | `string` | **是** | 配置 ID。 |
| `grayName` | `string` | **是** | 灰度配置名称。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `ConfigGrayInfo` | 灰度配置详情。 |
| `data.schema` | `string` | 配置模式。 |
| data.dataId | `string` | 配置 ID。 |
| data.groupName | `string` | 配置分组名称。 |
| data.namespaceId | `string` | 命名空间 ID。 |
| data.content | `string` | 灰度配置内容。 |
| data.grayName | `string` | 灰度配置名称。 |
| data.grayRule | `string` | 灰度匹配规则。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/gray?namespaceId=public&groupName=DEFAULT_GROUP&dataId=example&grayName=gray'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 3.27. 发布灰度配置

#### 接口描述

通过该接口，可以使用 tagv2 灰度匹配规则发布灰度配置。

#### 起始版本

`3.2.2`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/config/gray`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，不传默认为 `public`。 |
| `groupName` | `string` | **是** | 配置分组名称。 |
| `dataId` | `string` | **是** | 配置 ID。 |
| `content` | `string` | **是** | 灰度配置内容。 |
| `grayName` | `string` | **是** | 灰度配置名称。 |
| `grayType` | `string` | 否 | 灰度规则类型。 |
| `grayMatchRuleExp` | `string` | **是** | 灰度匹配规则表达式。 |
| `grayVersion` | `string` | **是** | 灰度版本。 |
| `grayPriority` | `integer` | 否 | 灰度规则优先级。 |
| `appName` | `string` | 否 | 应用名称。 |
| `configTags` | `string` | 否 | 配置标签。 |
| `desc` | `string` | 否 | 配置描述。 |
| `use` | `string` | 否 | 配置用途。 |
| `effect` | `string` | 否 | 配置生效范围。 |
| `schema` | `string` | 否 | 配置模式。 |
| `type` | `string` | 否 | 配置类型。 |
| `srcUser` | `string` | 否 | 操作用户。 |
| `encryptedDataKey` | `string` | 否 | 加密配置的数据密钥。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data | `boolean` | 是否发布成功。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/gray' \
  -d 'namespaceId=public' \
  -d 'groupName=DEFAULT_GROUP' \
  -d 'dataId=example' \
  -d 'content=gray-content' \
  -d 'grayName=gray' \
  -d 'grayType=tagv2' \
  -d 'grayMatchRuleExp=tag=gray' \
  -d 'grayVersion=1' \
  -d 'grayPriority=1'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 3.28. 删除灰度配置

#### 接口描述

通过该接口，可以删除指定灰度配置。

#### 起始版本

`3.2.2`

#### 请求方式

`DELETE`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/config/gray`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，不传默认为 `public`。 |
| `groupName` | `string` | **是** | 配置分组名称。 |
| `dataId` | `string` | **是** | 配置 ID。 |
| `grayName` | `string` | **是** | 灰度配置名称。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data | `boolean` | 是否删除成功。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/gray?namespaceId=public&groupName=DEFAULT_GROUP&dataId=example&grayName=gray'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

## 4. MCP 管理

3.3 新增 MCP 统一生命周期接口（4.6～4.19），使用 `namespaceId + mcpName` 标识资源，版本操作另传精确的 `version`。新接入的管理流程建议使用草稿、提交和发布接口；4.1～4.5 保留原有兼容操作，创建及更新仍按其直接发布语义处理。状态转换与审核流程见 [AI 资源生命周期](../user/ai/ai-resource-lifecycle.md)。

新资源在内置可见性策略下默认为 `PUBLIC`，需要私有可见范围时通过 scope 接口设置；后续发布和更新会保留已有范围。以下是生命周期接口使用的响应模型，旧兼容接口仍返回各自的原有类型。

| 类型 | 字段说明 |
|------|----------|
| `McpServerVersionSummary` | `version`、`status`、`publishPipelineInfo`、`author`、`description`、`latest`、`createTime`、`updateTime` |
| `McpServerVersionDetail` | 包含摘要字段，以及下表列出的内容和资源信息 |

`McpServerVersionSummary.status` 为 `draft`、`reviewing`、`reviewed`、`online` 或 `offline`；`latest` 表示该版本是否为默认版本。`publishPipelineInfo` 为可选的审核结果 JSON 字符串，用于区分审核通过和拒绝；`createTime`、`updateTime` 为毫秒时间戳。

| 详情字段 | 类型 | 说明 |
|----------|------|------|
| `namespaceId` | `string` | 命名空间 ID。 |
| `mcpName` | `string` | MCP 服务名称。 |
| `serverSpecification` | `McpServerBasicInfo` | Server 定义，内容字段见 4.3 的 `serverSpecification` 说明。 |
| `toolSpecification` | `McpToolSpecification` | 工具定义及元数据。 |
| `resourceSpecification` | `McpResourceSpecification` | 资源及资源模板定义。 |
| `resourceStatus` | `string` | 资源启用状态：`enable` 或 `disable`。 |
| `owner` | `string` | 资源所有者。 |
| `scope` | `string` | 可见范围：`PUBLIC` 或 `PRIVATE`。 |
| `labels` | `map<string, string>` | 版本标签映射，包含服务端维护的 `latest`。 |
| `editingVersion` | `string` | 当前可编辑的工作版本。 |
| `reviewingVersion` | `string` | 当前审核中的版本。 |
| `onlineCount` | `integer` | 在线版本数量。 |
| `writable` | `boolean` | 当前调用方是否具备该资源的写权限。 |

### 4.1. 查询MCP服务的服务列表

#### 接口描述

通过该接口，可以查询托管在Nacos上的MCP服务的服务列表。

#### 起始版本

`3.0.1`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/ai/mcp/list`

#### 请求参数

| 参数名           | 参数类型     | 是否必填  | 描述                                                     |
|---------------|----------|-------|--------------------------------------------------------|
| `pageNo` | `integer` | 否 | 页码，默认为 `1`，必须为正整数。 |
| `pageSize` | `integer` | 否 | 每页条数，默认为 `100`，必须为正整数。 |
| `namespaceId` | `string` | 否 | MCP服务的命名空间ID，默认为`public` |
| `mcpName` | `string` | 否 | MCP服务的名字模版，为空时查询所有MCP服务，当`search`为`blur`时，可使用`*`进行模糊搜索 |
| `search` | `string` | 否 | 搜索模式：`blur` 或 `accurate`，默认为`blur`。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                           | 参数类型                  | 描述                                                                                              |
|-----------------------------------------------|-----------------------|-------------------------------------------------------------------------------------------------|
| `totalCount`                                  | `integer` | 符合条件的服务的总数。                                                                                     |
| `pageNumber`                                  | `integer` | 当前页码，起始为`1`。                                                                                    |
| `pagesAvailable`                              | `integer` | 可用页码。                                                                                           |
| `pageItems`                                   | `array<McpServerBasicInfo>` | 服务列表。                                                                                           |
| `pageItems`[i].`id`                           | `string` | MCP服务的ID，一般为UUID。                                                                               |
| `pageItems`[i].`name`                         | `string` | MCP服务名。                                                                                         |
| `pageItems`[i].`protocol`                     | `string` | MCP的协议，如`stdio`,`sse`,`streamable`,`http`,`dubbo`等。                                             |
| `pageItems`[i].`frontProtocol`                | `string` | MCP的前端暴露协议，一般是提供给协议转换器（如网关）使用，若无转换器，则与`protocol`相同，如`stdio`,`sse`,`streamable`,`http`,`dubbo`等。 |
| `pageItems`[i].`description`                  | `string` | MCP服务的描述。                                                                                       |
| `pageItems`[i].`repository` | `Repository` | 代码仓库信息，包含 `url`、`source`、`id`、`subfolder`。 |
| `pageItems`[i].`versionDetail`                | `ServerVersionDetail` | MCP服务当前最新的版本信息。                                                                                 |
| `pageItems`[i].`localServerConfig`            | `map<string, object>` | MCP服务若类型为**stdio**，存在此信息，记录本地MCP服务的启动信息。                                                        |
| `pageItems`[i].`remoteServerConfig`           | `McpServerRemoteServiceConfig` | MCP服务若类型为**非stdio**，存在此信息，记录远端服务的信息 。                                                           |
| `pageItems`[i].`latestPublishedVersion`       | `string` | MCP服务最新版本的版本号。                                                                                  |
| `pageItems`[i].`versionDetails`               | `array<ServerVersionDetail>` | MCP服务版本详情的列表。                                                                                   |
| `pageItems`[i].`capabilities`                 | `array<string>`       | MCP服务支持的能力类型，如`TOOL`,`PROMPT`,`RESOURCE`。                                                       |

其中`ServerVersionDetail`结构如下：

| 参数名            | 参数类型      | 描述               |
|----------------|-----------|------------------|
| `version`      | `string` | MCP服务的版本号。       |
| `release_date` | `string` | MCP服务的版本发布时间。    |
| `is_latest`    | `boolean` | MCP服务的版本是否为最新版本。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/mcp/list?pageNo=1&pageSize=100&namespaceId=public&search=blur'
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
            "id": "d7a64724-a556-4fe4-82fa-e806d43e00dc",
            "name": "test",
            "protocol": "stdio",
            "frontProtocol": "stdio",
            "description": "ceshi",
            "repository": null,
            "versionDetail": {
               "version": "1.0.0",
               "release_date": "2025-05-22T06:40:37Z",
               "is_latest": null
            },
            "remoteServerConfig": null,
            "localServerConfig": null,
            "enabled": true,
            "capabilities": null,
            "latestPublishedVersion": "1.0.0",
            "versionDetails": [
               {
                  "version": "1.0.0",
                  "release_date": "2025-05-22T06:40:37Z",
                  "is_latest": null
               }
            ]
         }
      ]
   }
}
```

### 4.2. 查询MCP服务的详情

#### 接口描述

通过该接口，可以查询托管在Nacos上指定MCP服务的服务的详细信息。

#### 起始版本

`3.0.1`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/ai/mcp`

#### 请求参数

| 参数名           | 参数类型     | 是否必填  | 描述                                       |
|---------------|----------|-------|------------------------------------------|
| `namespaceId` | `string` | 否     | MCP服务的命名空间ID，默认为`public`                 |
| `mcpId` | `string` | 否 | 已废弃的兼容 ID；未传 `mcpName` 时必填，同时提供名称和 ID 时必须指向同一资源。 |
| `mcpName` | `string` | 否 | MCP 服务的精确名称；未传 `mcpId` 时必填。新接入优先使用名称。 |
| `version`     | `string` | 否     | MCP服务的版本，未传入是返回最新版本                      |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                  | 参数类型                  | 描述                                                                                              |
|----------------------|-----------------------|-------------------------------------------------------------------------------------------------|
| `data` | `McpServerDetailInfo` | MCP 兼容详情，下列字段属于 `data`。 |
| `id` | `string` | MCP 服务的兼容 ID，一般为 UUID。 |
| `name`               | `string` | MCP服务名。                                                                                         |
| `namespaceId`        | `string` | MCP服务所属的命名空间ID。                                                                                 |
| `protocol`           | `string` | MCP的协议，如`stdio`,`sse`,`streamable`,`http`,`dubbo`等。                                             |
| `frontProtocol`      | `string` | MCP的前端暴露协议，一般是提供给协议转换器（如网关）使用，若无转换器，则与`protocol`相同，如`stdio`,`sse`,`streamable`,`http`,`dubbo`等。 |
| `description`        | `string` | MCP服务的描述。                                                                                       |
| `repository` | `Repository` | 代码仓库信息，包含 `url`、`source`、`id`、`subfolder`。 |
| `versionDetail`      | `ServerVersionDetail` | MCP服务所查询的版本信息。                                                                                  |
| `localServerConfig`  | `map<string, object>` | MCP服务若类型为**stdio**，存在此信息，记录本地MCP服务的启动信息。                                                        |
| `remoteServerConfig` | `McpServerRemoteServiceConfig` | MCP服务若类型为**非stdio**，存在此信息，记录远端服务的信息 。                                                           |
| `enabled`            | `boolean` | MCP服务是否启用。                                                                                      |
| `capabilities`       | `array<string>`       | MCP服务支持的能力类型，如`TOOL`,`PROMPT`,`RESOURCE`。                                                       |
| `backendEndpoints`   | `array<McpEndpointInfo>` | MCP服务若类型为**非stdio**，存在此信息，记录访问远端服务的具体地址信息。                                                      |
| `toolSpec`           | `McpToolSpecification` | MCP服务支持的能力类型包含`TOOL`时，存在此信息，记录工具的详细配置信息。                                                        |
| `allVersions`        | `array<ServerVersionDetail>` | MCP服务的所有版本详情的列表。                                                                                |

其中`ServerVersionDetail`结构如下：

| 参数名            | 参数类型      | 描述               |
|----------------|-----------|------------------|
| `version`      | `string` | MCP服务的版本号。       |
| `release_date` | `string` | MCP服务的版本发布时间。    |
| `is_latest`    | `boolean` | MCP服务的版本是否为最新版本。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/mcp?namespaceId=public&mcpName=test&mcpId=d7a64724-a556-4fe4-82fa-e806d43e00dc'
```
* 返回示例

```json
{
   "code": 0,
   "message": "success",
   "data": {
      "id": "d7a64724-a556-4fe4-82fa-e806d43e00dc",
      "name": "test",
      "protocol": "stdio",
      "frontProtocol": "stdio",
      "description": "ceshi",
      "repository": null,
      "versionDetail": {
         "version": "1.0.0",
         "release_date": "2025-05-22T06:40:37Z",
         "is_latest": true
      },
      "remoteServerConfig": null,
      "localServerConfig": {
         "test": {}
      },
      "enabled": true,
      "capabilities": [],
      "backendEndpoints": null,
      "toolSpec": null,
      "allVersions": [
         {
            "version": "1.0.0",
            "release_date": "2025-05-22T06:40:37Z",
            "is_latest": true
         }
      ],
      "namespaceId": "public"
   }
}
```

### 4.3. 更新MCP服务

#### 接口描述

通过该接口，可以更新托管在Nacos上的MCP服务。

#### 起始版本

`3.0.1`

#### 请求方式

`PUT`

#### 鉴权状态

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/ai/mcp`

#### 请求参数

| 参数名                     | 参数类型         | 是否必填  | 描述                             |
|-------------------------|--------------|-------|--------------------------------|
| `namespaceId` | `string` | 否 | MCP服务的命名空间ID，默认为`public` |
| `mcpName` | `string` | 否 | MCP 服务名称；`serverSpecification.name` 为空时使用此值。 |
| `mcpId` | `string` | 否 | 已废弃的兼容 ID；`serverSpecification.id` 为空时使用此值。新接入优先使用名称。 |
| `serverSpecification` | `string` | **是** | `McpServerBasicInfo` JSON 对象字符串，详细字段见下表。 |
| `toolSpecification` | `string` | 否 | MCP服务的工具描述详情 |
| `resourceSpecification` | `string` | 否 | MCP 资源能力描述详情（JSON 字符串）。 |
| `endpointSpecification` | `string` | 否 | `McpEndpointSpec` JSON 对象字符串；非 `stdio` 服务条件必填。 |
| `overrideExisting` | `boolean` | 否 | MCP服务更新时是否覆盖原 endpointSpecification，仅在非`stdio`协议时生效 |
| `latest` | `boolean` | 否 | 是否将本次更新的版本设为默认版本，默认为 `true`。 |

其中`serverSpecification`、`toolSpecification`、`endpointSpecification`参数的详细内容如下：

> serverSpecification

| 参数名                  | 参数类型                  | 描述                                                                                              |
|----------------------|-----------------------|-------------------------------------------------------------------------------------------------|
| `id` | `string` | 已废弃的兼容 ID，一般为 UUID；可使用名称定位资源，同时提供名称和 ID 时二者必须指向同一资源。 |
| `name`               | `string` | MCP服务名。                                                                                         |
| `protocol`           | `string` | MCP的协议，如`stdio`,`sse`,`streamable`,`http`,`dubbo`等。                                             |
| `frontProtocol`      | `string` | MCP的前端暴露协议，一般是提供给协议转换器（如网关）使用，若无转换器，则与`protocol`相同，如`stdio`,`sse`,`streamable`,`http`,`dubbo`等。 |
| `description`        | `string` | MCP服务的描述。                                                                                       |
| `repository` | `Repository` | 代码仓库信息，包含 `url`、`source`、`id`、`subfolder`。 |
| `versionDetail`      | `ServerVersionDetail` | MCP服务的版本信息。                                                                                     |
| `version`            | `string` | MCP服务的简易版本版本信息，主要用于兼容，若已设置`versionDetail`,则该字段无效。                                               |    |
| `localServerConfig`  | `map<string, object>` | MCP服务若类型为**stdio**，存在此信息，记录本地MCP服务的启动信息。                                                        |
| `remoteServerConfig` | `McpServerRemoteServiceConfig` | MCP服务若类型为**非stdio**，存在此信息，记录远端服务的信息 。                                                           |
| `enabled`            | `boolean` | MCP服务是否启用。                                                                                      |
| `capabilities`       | `array<string>`       | MCP服务支持的能力类型，如`TOOL`,`PROMPT`,`RESOURCE`。                                                       |

其中`ServerVersionDetail`结构如下：

| 参数名            | 参数类型      | 描述               |
|----------------|-----------|------------------|
| `version`      | `string` | MCP服务的版本号。       |
| `release_date` | `string` | MCP服务的版本发布时间。    |
| `is_latest`    | `boolean` | MCP服务的版本是否为最新版本。 |

> toolSpecification

| 参数名               | 参数类型                       | 描述                                                                                      |
|-------------------|----------------------------|-----------------------------------------------------------------------------------------|
| `tools`           | `array<McpTool>`          | 该MCP Server所提供的工具列表，参考标准MCP协议中对于MCP Tool的定义                                             |
| `toolsMeta`       | `map<string, McpToolMeta>` | 该MCP Server所提供的工具的额外元数据信息，可用于扩展标准MCP协议中未定义但又使用中需要的信息。key为`McpTool`的`name`, value为拓展元数据。 |
| `securitySchemes` | `array<SecurityScheme>`   | MCP工具的安全方案，参考标准MCP协议。                                                                   |

其中`McpTool`结构如下：

| 参数名           | 参数类型                  | 描述                                            |
|---------------|-----------------------|-----------------------------------------------|
| `name`        | `string` | MCP 工具的名称                                     |
| `description` | `string` | MCP 工具的描述                                     |
| `inputSchema` | `map<string, object>` | MCP工具的入参描述，参考标准MCP协议，主要包含，`类型`,`是否必须`,`描述` 等。 |

其中`McpToolMeta` 结构如下：

| 参数名             | 参数类型                  | 描述                             |
|-----------------|-----------------------|--------------------------------|
| `invokeContext` | `map<string, string>` | MCP 工具调用时的上下文信息，如后端服务的`Path`等。 |
| `enabled`       | `boolean` | MCP工具是否启用。                     |
| `templates`     | `map<string, string>` | MCP工具的模板信息。用于进行协议转换时进行参数的映射。   |

其中`SecurityScheme` 结构如下：

| 参数名                 | 参数类型     | 描述                                                                                |
|---------------------|----------|-----------------------------------------------------------------------------------|
| `id`                | `string` | 安全方案的ID，将被MCP工具使用和引用。。                                                            |
| `type`              | `string` | 安全方案的类型。可能的值包括：`http`、`apiKey`、`localEnv`或其他自定义扩展。                                |
| `scheme`            | `string` | 安全方案的子方案类型。当 `type` 为 `http` 时使用。可能的值包括：`basic` 或 `bearer`。                       |
| `in`                | `string` | 安全方案的位置。可能的值有：`query`、`header`。                                                   |
| `name`              | `string` | 安全方案的名称。当 `type` 为 `apiKey` 或 `localEnv` 时使用。例如，`apiKey` 的密钥名称或 `localEnv` 的环境名称。 |
| `defaultCredential` | `string` | 当配置参数中未输入身份时的默认凭证。可选。                                                             |

> endpointSpecification

| 参数名    | 参数类型                  | 描述                                                                                                                               |
|--------|-----------------------|----------------------------------------------------------------------------------------------------------------------------------|
| `type` | `string` | MCP endpoint的后端服务类型，可选值`REF`和`DIRECT`.                                                                                           |
| `data` | `map<string, string>` | MCP endpoint的后端服务的实际数据， 根据`type`的不同，传入的参数不同，如`REF`传入的为`namespaceId`, `groupName` 和 `serviceName`；`DIRECT`传入的为`address` 和 `port`。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述         |
|--------|----------|------------|
| `data` | `string` | MCP服务更新结果。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/mcp' \
-d 'namespaceId=public' \
-d 'mcpName=test' \
-d 'serverSpecification={"protocol":"stdio","frontProtocol":"stdio","name":"test","id":"d7a64724-a556-4fe4-82fa-e806d43e00dc","description":"ceshi","versionDetail":{"version":"1.0.0"},"enabled":true,"localServerConfig":{"test":{}}}'
```
* 返回示例

```json
{
  "code" : 0,
  "message" : "success",
  "data" : "ok"
}
```

### 4.4. 创建MCP服务

#### 接口描述

通过该接口，可以创建托管在Nacos上的MCP服务，可以是存量API转换的MCP服务，也可以是MCP市场中的MCP服务。

#### 起始版本

`3.0.1`

#### 请求方式

`POST`

#### 鉴权状态

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/ai/mcp`

#### 请求参数

| 参数名                     | 参数类型         | 是否必填  | 描述                             |
|-------------------------|--------------|-------|--------------------------------|
| `namespaceId` | `string` | 否 | MCP服务的命名空间ID，默认为`public` |
| `mcpName` | `string` | 否 | MCP 服务名称；`serverSpecification.name` 为空时使用此值。两处至少提供一处名称。 |
| `mcpId` | `string` | 否 | 已废弃的兼容 ID；`serverSpecification.id` 为空时使用此值，通常不传，由服务端生成。 |
| `serverSpecification` | `string` | **是** | `McpServerBasicInfo` JSON 对象字符串，详细字段见下表。 |
| `toolSpecification` | `string` | 否 | MCP服务的工具描述详情 |
| `resourceSpecification` | `string` | 否 | MCP 资源能力描述详情（JSON 字符串）。 |
| `endpointSpecification` | `string` | 否 | `McpEndpointSpec` JSON 对象字符串；非 `stdio` 服务条件必填。 |

其中`serverSpecification`、`toolSpecification`、`endpointSpecification`参数的详细内容如下：

> serverSpecification

| 参数名                  | 参数类型                  | 描述                                                                                              |
|----------------------|-----------------------|-------------------------------------------------------------------------------------------------|
| `id`                 | `string` | MCP服务的ID，一般为UUID，无需传入，系统自动生成。                                                                   |
| `name`               | `string` | MCP服务名。                                                                                         |
| `protocol`           | `string` | MCP的协议，如`stdio`,`sse`,`streamable`,`http`,`dubbo`等。                                             |
| `frontProtocol`      | `string` | MCP的前端暴露协议，一般是提供给协议转换器（如网关）使用，若无转换器，则与`protocol`相同，如`stdio`,`sse`,`streamable`,`http`,`dubbo`等。 |
| `description`        | `string` | MCP服务的描述。                                                                                       |
| `repository` | `Repository` | 代码仓库信息，包含 `url`、`source`、`id`、`subfolder`。 |
| `versionDetail`      | `ServerVersionDetail` | MCP服务的版本信息。                                                                                     |
| `version`            | `string` | MCP服务的简易版本版本信息，主要用于兼容，若已设置`versionDetail`,则该字段无效。                                               |    |
| `localServerConfig`  | `map<string, object>` | MCP服务若类型为**stdio**，存在此信息，记录本地MCP服务的启动信息。                                                        |
| `remoteServerConfig` | `McpServerRemoteServiceConfig` | MCP服务若类型为**非stdio**，存在此信息，记录远端服务的信息 。                                                           |
| `enabled`            | `boolean` | MCP服务是否启用。                                                                                      |
| `capabilities`       | `array<string>`       | MCP服务支持的能力类型，如`TOOL`,`PROMPT`,`RESOURCE`。                                                       |

其中`ServerVersionDetail`结构如下：

| 参数名            | 参数类型      | 描述               |
|----------------|-----------|------------------|
| `version`      | `string` | MCP服务的版本号。       |
| `release_date` | `string` | MCP服务的版本发布时间。    |
| `is_latest`    | `boolean` | MCP服务的版本是否为最新版本。 |

> toolSpecification

| 参数名               | 参数类型                       | 描述                                                                                      |
|-------------------|----------------------------|-----------------------------------------------------------------------------------------|
| `tools`           | `array<McpTool>`          | 该MCP Server所提供的工具列表，参考标准MCP协议中对于MCP Tool的定义                                             |
| `toolsMeta`       | `map<string, McpToolMeta>` | 该MCP Server所提供的工具的额外元数据信息，可用于扩展标准MCP协议中未定义但又使用中需要的信息。key为`McpTool`的`name`, value为拓展元数据。 |
| `securitySchemes` | `array<SecurityScheme>`   | MCP工具的安全方案，参考标准MCP协议。                                                                   |

其中`McpTool`结构如下：

| 参数名           | 参数类型                  | 描述                                            |
|---------------|-----------------------|-----------------------------------------------|
| `name`        | `string` | MCP 工具的名称                                     |
| `description` | `string` | MCP 工具的描述                                     |
| `inputSchema` | `map<string, object>` | MCP工具的入参描述，参考标准MCP协议，主要包含，`类型`,`是否必须`,`描述` 等。 |

其中`McpToolMeta` 结构如下：

| 参数名             | 参数类型                  | 描述                             |
|-----------------|-----------------------|--------------------------------|
| `invokeContext` | `map<string, string>` | MCP 工具调用时的上下文信息，如后端服务的`Path`等。 |
| `enabled`       | `boolean` | MCP工具是否启用。                     |
| `templates`     | `map<string, string>` | MCP工具的模板信息。用于进行协议转换时进行参数的映射。   |

其中`SecurityScheme` 结构如下：

| 参数名                 | 参数类型     | 描述                                                                                |
|---------------------|----------|-----------------------------------------------------------------------------------|
| `id`                | `string` | 安全方案的ID，将被MCP工具使用和引用。。                                                            |
| `type`              | `string` | 安全方案的类型。可能的值包括：`http`、`apiKey`、`localEnv`或其他自定义扩展。                                |
| `scheme`            | `string` | 安全方案的子方案类型。当 `type` 为 `http` 时使用。可能的值包括：`basic` 或 `bearer`。                       |
| `in`                | `string` | 安全方案的位置。可能的值有：`query`、`header`。                                                   |
| `name`              | `string` | 安全方案的名称。当 `type` 为 `apiKey` 或 `localEnv` 时使用。例如，`apiKey` 的密钥名称或 `localEnv` 的环境名称。 |
| `defaultCredential` | `string` | 当配置参数中未输入身份时的默认凭证。可选。                                                             |

> endpointSpecification

| 参数名    | 参数类型                  | 描述                                                                                                                               |
|--------|-----------------------|----------------------------------------------------------------------------------------------------------------------------------|
| `type` | `string` | MCP endpoint的后端服务类型，可选值`REF`和`DIRECT`.                                                                                           |
| `data` | `map<string, string>` | MCP endpoint的后端服务的实际数据， 根据`type`的不同，传入的参数不同，如`REF`传入的为`namespaceId`, `groupName` 和 `serviceName`；`DIRECT`传入的为`address` 和 `port`。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述         |
|--------|----------|------------|
| `data` | `string` | 新建MCP服务的id。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/mcp' \
-d 'namespaceId=public' \
-d 'mcpName=test' \
-d 'serverSpecification={"protocol":"stdio","frontProtocol":"stdio","name":"test","id":"","description":"ceshi","versionDetail":{"version":"1.0.0"},"enabled":true,"localServerConfig":{"test":{}}}'
```
* 返回示例

```json
{
  "code" : 0,
  "message" : "success",
  "data" : "58e5b430-b16d-4f28-9334-edb64303dc23"
}
```

### 4.5. 删除MCP服务

#### 接口描述

通过该接口，可以删除托管在Nacos上的MCP服务。

#### 起始版本

`3.0.1`

#### 请求方式

`DELETE`

#### 鉴权状态

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/ai/mcp`

#### 请求参数

| 参数名           | 参数类型     | 是否必填  | 描述                                       |
|---------------|----------|-------|------------------------------------------|
| `namespaceId` | `string` | 否     | MCP服务的命名空间ID，默认为`public`                 |
| `mcpId` | `string` | 否 | 已废弃的兼容 ID；未传 `mcpName` 时必填，同时提供名称和 ID 时必须指向同一资源。 |
| `mcpName` | `string` | 否 | MCP 服务的精确名称；未传 `mcpId` 时必填。新接入优先使用名称。 |
| `version`     | `string` | 否     | MCP服务的版本，未传入是为最新版本                       |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述         |
|--------|----------|------------|
| `data` | `string` | MCP服务删除结果。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ai/mcp?namespaceId=public&mcpName=test&mcpId=d7a64724-a556-4fe4-82fa-e806d43e00dc'
```
* 返回示例

```json
{
   "code" : 0,
   "message" : "success",
   "data" : "ok"
}
```

### 4.6. 查询 MCP 生命周期版本列表

#### 接口描述

按名称查询各状态的版本摘要；草稿和审核中的版本也可查询。

#### 起始版本

`3.3.0`

#### 请求方式

`GET`

#### 鉴权状态

需通过 Admin API 鉴权，并具备目标资源的读权限。

#### 请求URL

`/nacos/v3/admin/ai/mcp/versions`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|------|------|----------|-------------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认为 `public`。 |
| `mcpName` | `string` | **是** | MCP 服务名称。 |
| `status` | `string` | 否 | 版本状态：`draft`、`reviewing`、`reviewed`、`online` 或 `offline`；不传则查询全部状态。 |
| `pageNo` | `integer` | 否 | 页码，默认为 `1`，必须为正整数。 |
| `pageSize` | `integer` | 否 | 每页条数，默认为 `100`，必须为正整数。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|------|------|-------------|
| `data` | `Page<McpServerVersionSummary>` | 版本摘要分页。 |
| `data.totalCount` | `integer` | 匹配版本总数。 |
| `data.pageNumber` | `integer` | 当前页码。 |
| `data.pagesAvailable` | `integer` | 可用页数。 |
| `data.pageItems` | `array<McpServerVersionSummary>` | 当前页的版本摘要。 |

#### 示例

```bash
curl -sS -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/mcp/versions?namespaceId=public&mcpName=my-mcp&pageNo=1&pageSize=100'
```

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "totalCount": 0,
    "pageNumber": 1,
    "pagesAvailable": 0,
    "pageItems": []
  }
}
```

### 4.7. 查询 MCP 生命周期版本详情

#### 接口描述

读取指定版本的内容、生命周期状态和资源信息。通过 `writable` 判断当前调用方能否写入；它不表示任意版本内容都可以修改。

#### 起始版本

`3.3.0`

#### 请求方式

`GET`

#### 鉴权状态

需通过 Admin API 鉴权，并具备目标资源的读权限。

#### 请求URL

`/nacos/v3/admin/ai/mcp/version`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|------|------|----------|-------------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认为 `public`。 |
| `mcpName` | `string` | **是** | MCP 服务名称。 |
| `version` | `string` | **是** | 精确版本号，不接受标签。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|------|------|-------------|
| `data` | `McpServerVersionDetail` | 版本信息，字段见本章开头的模型说明。 |

#### 示例

```bash
curl -sS -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/mcp/version?namespaceId=public&mcpName=my-mcp&version=1.0.0'
```

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "namespaceId": "public",
    "mcpName": "my-mcp",
    "version": "1.0.0",
    "status": "draft",
    "writable": true
  }
}
```

### 4.8. 创建 MCP 草稿

#### 接口描述

创建新资源及其草稿，或为已有资源创建后续草稿。创建草稿不会让该版本进入客户端发现结果。以下示例使用 `stdio`，因此无需提供远端地址。

#### 起始版本

`3.3.0`

#### 请求方式

`POST`

请求体类型：`application/x-www-form-urlencoded`。

#### 鉴权状态

需通过 Admin API 鉴权，并具备目标资源的写权限。

#### 请求URL

`/nacos/v3/admin/ai/mcp/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|------|------|----------|-------------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认为 `public`。 |
| `mcpName` | `string` | **是** | MCP 服务名称。 |
| `version` | `string` | **是** | 精确版本号，不接受标签。 |
| `serverSpecification` | `string` | **是** | `McpServerBasicInfo` JSON 对象字符串。若包含名称或版本，必须与表单一致；不接受 `id`。 |
| `toolSpecification` | `string` | 否 | `McpToolSpecification` JSON 对象字符串，描述工具及其元数据。 |
| `resourceSpecification` | `string` | 否 | `McpResourceSpecification` JSON 对象字符串，描述资源及资源模板。 |
| `endpointSpecification` | `string` | 否 | `McpEndpointSpec` JSON 对象字符串；非 `stdio` 服务条件必填。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|------|------|-------------|
| `data` | `McpServerVersionDetail` | 版本信息，字段见本章开头的模型说明。 |

#### 示例

```bash
curl -sS -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/mcp/draft' \
  -d 'namespaceId=public' -d 'mcpName=my-mcp' -d 'version=1.0.0' \
  --data-urlencode 'serverSpecification={"protocol":"stdio","frontProtocol":"stdio","description":"Example MCP server","localServerConfig":{"my-mcp":{"command":"npx","args":["-y","@modelcontextprotocol/server-everything"]}}}'
```

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "namespaceId": "public",
    "mcpName": "my-mcp",
    "version": "1.0.0",
    "status": "draft"
  }
}
```

### 4.9. 更新 MCP 草稿

#### 接口描述

替换当前精确草稿的内容，仅允许修改 `draft` 版本。请提交需要保留的完整 Server、Tools、Resources 及端点配置。

#### 起始版本

`3.3.0`

#### 请求方式

`PUT`

请求体类型：`application/x-www-form-urlencoded`。

#### 鉴权状态

需通过 Admin API 鉴权，并具备目标资源的写权限。

#### 请求URL

`/nacos/v3/admin/ai/mcp/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|------|------|----------|-------------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认为 `public`。 |
| `mcpName` | `string` | **是** | MCP 服务名称。 |
| `version` | `string` | **是** | 精确版本号，不接受标签。 |
| `serverSpecification` | `string` | **是** | `McpServerBasicInfo` JSON 对象字符串。若包含名称或版本，必须与表单一致；不接受 `id`。 |
| `toolSpecification` | `string` | 否 | `McpToolSpecification` JSON 对象字符串，描述工具及其元数据。 |
| `resourceSpecification` | `string` | 否 | `McpResourceSpecification` JSON 对象字符串，描述资源及资源模板。 |
| `endpointSpecification` | `string` | 否 | `McpEndpointSpec` JSON 对象字符串；非 `stdio` 服务条件必填。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|------|------|-------------|
| `data` | `McpServerVersionDetail` | 版本信息，字段见本章开头的模型说明。 |

#### 示例

```bash
curl -sS -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/mcp/draft' \
  -d 'namespaceId=public' -d 'mcpName=my-mcp' -d 'version=1.0.0' \
  --data-urlencode 'serverSpecification={"protocol":"stdio","frontProtocol":"stdio","description":"Example MCP server","localServerConfig":{"my-mcp":{"command":"npx","args":["-y","@modelcontextprotocol/server-everything"]}}}'
```

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "namespaceId": "public",
    "mcpName": "my-mcp",
    "version": "1.0.0",
    "status": "draft"
  }
}
```

### 4.10. 删除 MCP 草稿

#### 接口描述

删除指定的当前草稿；不能用此接口删除已发布版本。

#### 起始版本

`3.3.0`

#### 请求方式

`DELETE`

请求体类型：`application/x-www-form-urlencoded`。

#### 鉴权状态

需通过 Admin API 鉴权，并具备目标资源的写权限。

#### 请求URL

`/nacos/v3/admin/ai/mcp/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|------|------|----------|-------------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认为 `public`。 |
| `mcpName` | `string` | **是** | MCP 服务名称。 |
| `version` | `string` | **是** | 精确版本号，不接受标签。 |

#### 返回数据

成功时统一返回体中 `code=0`、`data=null`。

#### 示例

```bash
curl -sS -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ai/mcp/draft' \
  -d 'namespaceId=public' -d 'mcpName=my-mcp' -d 'version=1.0.0'
```

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 4.11. 提交 MCP 版本

#### 接口描述

提交草稿进入发布流程。配置了适用的审核流水线时进入 `reviewing`；没有适用流水线时直接发布为 `online`。以下响应演示进入审核的情况。

#### 起始版本

`3.3.0`

#### 请求方式

`POST`

请求体类型：`application/x-www-form-urlencoded`。

#### 鉴权状态

需通过 Admin API 鉴权，并具备目标资源的写权限。

#### 请求URL

`/nacos/v3/admin/ai/mcp/submit`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|------|------|----------|-------------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认为 `public`。 |
| `mcpName` | `string` | **是** | MCP 服务名称。 |
| `version` | `string` | **是** | 精确版本号，不接受标签。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|------|------|-------------|
| `data` | `McpServerVersionSummary` | 版本信息，字段见本章开头的模型说明。 |

#### 示例

```bash
curl -sS -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/mcp/submit' \
  -d 'namespaceId=public' -d 'mcpName=my-mcp' -d 'version=1.0.0'
```

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "version": "1.0.0",
    "status": "reviewing"
  }
}
```

### 4.12. 发布 MCP 版本

#### 接口描述

将审核通过的 `reviewed` 版本发布为 `online`，并将 `latest` 指向该版本。审核拒绝的版本同样可能处于 `reviewed`，不能仅凭状态判断是否可发布。

#### 起始版本

`3.3.0`

#### 请求方式

`POST`

请求体类型：`application/x-www-form-urlencoded`。

#### 鉴权状态

需通过 Admin API 鉴权，并具备目标资源的写权限。

#### 请求URL

`/nacos/v3/admin/ai/mcp/publish`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|------|------|----------|-------------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认为 `public`。 |
| `mcpName` | `string` | **是** | MCP 服务名称。 |
| `version` | `string` | **是** | 精确版本号，不接受标签。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|------|------|-------------|
| `data` | `McpServerVersionSummary` | 版本信息，字段见本章开头的模型说明。 |

#### 示例

```bash
curl -sS -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/mcp/publish' \
  -d 'namespaceId=public' -d 'mcpName=my-mcp' -d 'version=1.0.0'
```

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "version": "1.0.0",
    "status": "online",
    "latest": true
  }
}
```

### 4.13. 强制发布 MCP 版本

#### 接口描述

绕过审核流水线，将 `draft`、`reviewing` 或 `reviewed` 版本发布为 `online`，并更新 `latest`。这是需要额外授权和审计的管理操作，普通发布流程使用提交和发布接口。

#### 起始版本

`3.3.0`

#### 请求方式

`POST`

请求体类型：`application/x-www-form-urlencoded`。

#### 鉴权状态

需通过 Admin API 鉴权，并具备目标资源的写权限。

#### 请求URL

`/nacos/v3/admin/ai/mcp/force-publish`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|------|------|----------|-------------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认为 `public`。 |
| `mcpName` | `string` | **是** | MCP 服务名称。 |
| `version` | `string` | **是** | 精确版本号，不接受标签。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|------|------|-------------|
| `data` | `McpServerVersionSummary` | 版本信息，字段见本章开头的模型说明。 |

#### 示例

```bash
curl -sS -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/mcp/force-publish' \
  -d 'namespaceId=public' -d 'mcpName=my-mcp' -d 'version=1.0.0'
```

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "version": "1.0.0",
    "status": "online",
    "latest": true
  }
}
```

### 4.14. 重新编辑 MCP 版本

#### 接口描述

将当前 `reviewed` 工作版本转回 `draft`，继续编辑后重新提交。

#### 起始版本

`3.3.0`

#### 请求方式

`POST`

请求体类型：`application/x-www-form-urlencoded`。

#### 鉴权状态

需通过 Admin API 鉴权，并具备目标资源的写权限。

#### 请求URL

`/nacos/v3/admin/ai/mcp/redraft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|------|------|----------|-------------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认为 `public`。 |
| `mcpName` | `string` | **是** | MCP 服务名称。 |
| `version` | `string` | **是** | 精确版本号，不接受标签。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|------|------|-------------|
| `data` | `McpServerVersionSummary` | 版本信息，字段见本章开头的模型说明。 |

#### 示例

```bash
curl -sS -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/mcp/redraft' \
  -d 'namespaceId=public' -d 'mcpName=my-mcp' -d 'version=1.0.0'
```

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "version": "1.0.0",
    "status": "draft"
  }
}
```

### 4.15. 上线 MCP 版本

#### 接口描述

将 `offline` 版本恢复为 `online`，并将 `latest` 指向该版本。

#### 起始版本

`3.3.0`

#### 请求方式

`POST`

请求体类型：`application/x-www-form-urlencoded`。

#### 鉴权状态

需通过 Admin API 鉴权，并具备目标资源的写权限。

#### 请求URL

`/nacos/v3/admin/ai/mcp/online`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|------|------|----------|-------------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认为 `public`。 |
| `mcpName` | `string` | **是** | MCP 服务名称。 |
| `version` | `string` | **是** | 精确版本号，不接受标签。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|------|------|-------------|
| `data` | `McpServerVersionSummary` | 版本信息，字段见本章开头的模型说明。 |

#### 示例

```bash
curl -sS -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/mcp/online' \
  -d 'namespaceId=public' -d 'mcpName=my-mcp' -d 'version=1.0.0'
```

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "version": "1.0.0",
    "status": "online",
    "latest": true
  }
}
```

### 4.16. 下线 MCP 版本

#### 接口描述

将 `online` 版本改为 `offline`，停止该版本的客户端发现；如果它是 `latest`，服务端会从剩余在线版本中重新选择，没有在线版本时移除 `latest`。此操作不会停止用户自行部署的 MCP 进程。

#### 起始版本

`3.3.0`

#### 请求方式

`POST`

请求体类型：`application/x-www-form-urlencoded`。

#### 鉴权状态

需通过 Admin API 鉴权，并具备目标资源的写权限。

#### 请求URL

`/nacos/v3/admin/ai/mcp/offline`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|------|------|----------|-------------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认为 `public`。 |
| `mcpName` | `string` | **是** | MCP 服务名称。 |
| `version` | `string` | **是** | 精确版本号，不接受标签。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|------|------|-------------|
| `data` | `McpServerVersionSummary` | 版本信息，字段见本章开头的模型说明。 |

#### 示例

```bash
curl -sS -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/mcp/offline' \
  -d 'namespaceId=public' -d 'mcpName=my-mcp' -d 'version=1.0.0'
```

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "version": "1.0.0",
    "status": "offline",
    "latest": false
  }
}
```

### 4.17. 更新 MCP 版本标签

#### 接口描述

完整替换自定义版本标签。标签只能指向在线版本；`latest` 由服务端维护，不能通过此接口修改。

#### 起始版本

`3.3.0`

#### 请求方式

`PUT`

请求体类型：`application/x-www-form-urlencoded`。

#### 鉴权状态

需通过 Admin API 鉴权，并具备目标资源的写权限。

#### 请求URL

`/nacos/v3/admin/ai/mcp/labels`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|------|------|----------|-------------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认为 `public`。 |
| `mcpName` | `string` | **是** | MCP 服务名称。 |
| `labels` | `string` | 否 | `map<string, string>` JSON 对象字符串，键为自定义标签，值为在线版本；省略或传 `{}` 清空自定义标签，保留 `latest`。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|------|------|-------------|
| `data` | `map<string, string>` | 更新后的版本标签映射。 |

#### 示例

```bash
curl -sS -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/mcp/labels' \
  -d 'namespaceId=public' -d 'mcpName=my-mcp' \
  --data-urlencode 'labels={"stable":"1.0.0"}'
```

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "latest": "1.0.0",
    "stable": "1.0.0"
  }
}
```

### 4.18. 更新 MCP 启用状态

#### 接口描述

启用或禁用整个 MCP 资源，不改变版本状态。禁用后客户端不再发现该资源，重新启用后恢复已有在线版本。

#### 起始版本

`3.3.0`

#### 请求方式

`PUT`

请求体类型：`application/x-www-form-urlencoded`。

#### 鉴权状态

需通过 Admin API 鉴权，并具备目标资源的写权限。

#### 请求URL

`/nacos/v3/admin/ai/mcp/status`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|------|------|----------|-------------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认为 `public`。 |
| `mcpName` | `string` | **是** | MCP 服务名称。 |
| `enabled` | `boolean` | **是** | `true` 启用资源，`false` 禁用资源。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|------|------|-------------|
| `data` | `string` | 成功时为 `ok`。 |

#### 示例

```bash
curl -sS -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/mcp/status' \
  -d 'namespaceId=public' -d 'mcpName=my-mcp' -d 'enabled=true'
```

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 4.19. 更新 MCP 可见范围

#### 接口描述

将资源可见范围设置为 `PUBLIC` 或 `PRIVATE`，不改变版本状态。`PUBLIC` 不表示关闭接口鉴权。

#### 起始版本

`3.3.0`

#### 请求方式

`PUT`

请求体类型：`application/x-www-form-urlencoded`。

#### 鉴权状态

需通过 Admin API 鉴权，并具备目标资源的写权限。

#### 请求URL

`/nacos/v3/admin/ai/mcp/scope`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|------|------|----------|-------------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认为 `public`。 |
| `mcpName` | `string` | **是** | MCP 服务名称。 |
| `scope` | `string` | **是** | 可见范围：`PUBLIC` 或 `PRIVATE`。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|------|------|-------------|
| `data` | `string` | 成功时为 `ok`。 |

#### 示例

```bash
curl -sS -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/mcp/scope' \
  -d 'namespaceId=public' -d 'mcpName=my-mcp' -d 'scope=PRIVATE'
```

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

## 5. A2A注册中心

### 5.1. 查询指定AgentCard的版本列表

#### 接口描述

通过该接口，可以查询指定托管在Nacos上的AgentCard的版本列表。

#### 起始版本

`3.1.0`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/ai/a2a/version/list`

#### 请求参数

| 参数名           | 参数类型     | 是否必填  | 描述                          |
|---------------|----------|-------|-----------------------------|
| `namespaceId` | `string` | 否     | AgentCard所属的命名空间，默认`public` |
| `agentName`   | `string` | **是** | AgentCard的名称                |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                   | 参数类型      | 描述              |
|-----------------------|-----------|-----------------|
| `data`[i].`version`   | `string` | AgentCard的版本号。  |
| `data`[i].`createdAt` | `string` | 该版本的创建时间。       |
| `data`[i].`updatedAt` | `string` | 该版本的最后更新时间。     |
| `data`[i].`latest`    | `boolean` | 该版本是否标记为最新发布版本。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/a2a/version/list?namespaceId=public&agentName=GeoSpatial+Route+Planner+Agent'
```
* 返回示例

```json
{
  "code" : 0,
  "message" : "success",
  "data" : [ {
    "version" : "1.2.0",
    "createdAt" : "2025-09-12T03:33:51Z",
    "updatedAt" : "2025-09-12T07:21:49Z",
    "latest" : true
  } ]
}
```

### 5.2. 查询AgentCard的列表

#### 接口描述

通过该接口，可以查询托管在Nacos上的AgentCard的列表。

#### 起始版本

`3.1.0`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/ai/a2a/list`

#### 请求参数

| 参数名           | 参数类型     | 是否必填  | 描述                                              |
|---------------|----------|-------|-------------------------------------------------|
| `pageNo` | `integer` | 否 | 页码，默认为 `1`，必须为正整数。 |
| `pageSize` | `integer` | 否 | 每页条数，默认为 `100`，必须为正整数。 |
| `namespaceId` | `string` | 否 | AgentCard的命名空间ID，默认为`public` |
| `agentName` | `string` | 否 | AgentCard的名称，为空是查询所有AgentCard |
| `search` | `string` | **是** | 搜索模式：`blur` 或 `accurate`，默认为`blur`。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                     | 参数类型                       | 描述                                                                                                     |
|-----------------------------------------|----------------------------|--------------------------------------------------------------------------------------------------------|
| `totalCount`                            | `integer` | 符合条件的服务的总数。                                                                                            |
| `pageNumber`                            | `integer` | 当前页码，起始为`1`。                                                                                           |
| `pagesAvailable`                        | `integer` | 可用页码。                                                                                                  |
| `pageItems`                             | `array<AgentCardVersionInfo>` | 服务列表。                                                                                                  |
| `pageItems`[i].`protocolVersion`        | `string` | AgentCard的A2A协议版本。                                                                                     |
| `pageItems`[i].`name`                   | `string` | AgentCard的名称。                                                                                          |
| `pageItems`[i].`description`            | `string` | AgentCard的描述。                                                                                          |
| `pageItems`[i].`version`                | `string` | AgentCard的版本号。                                                                                         |
| `pageItems`[i].`iconUrl`                | `string` | AgentCard的iconURL。                                                                                     |
| `pageItems`[i].`capabilities`           | `AgentCapabilities`        | AgentCard的能力，匹配[A2A标准能力](https://a2a-protocol.org/latest/specification/#552-agentcapabilities-object)。 |
| `pageItems`[i].`skills`                 | `array<AgentSkill>`         | AgentCard的技能列表,匹配[A2A标准技能](https://a2a-protocol.org/latest/specification/#554-agentskill-object)。      |
| `pageItems`[i].`latestPublishedVersion` | `string` | AgentCard的最新发布版本。                                                                                      |
| `pageItems`[i].`versionDetails`         | `array<AgentVersionDetail>` | AgentCard的所有版本详情。                                                                                      |
| `pageItems`[i].`registrationType`       | `string` | AgentCard的默认注册类型，可选`URL`和`SERVICE`。                                                                    |

其中`AgentVersionDetail`包含内容如下：

| 参数名         | 参数类型      | 描述              |
|-------------|-----------|-----------------|
| `version`   | `string` | AgentCard的版本号。  |
| `createdAt` | `string` | 该版本的创建时间。       |
| `updatedAt` | `string` | 该版本的最后更新时间。     |
| `latest`    | `boolean` | 该版本是否标记为最新发布版本。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/a2a/list?pageNo=1&pageSize=100&namespaceId=public&search=blur'
```
* 返回示例

```json
{
  "code" : 0,
  "message" : "success",
  "data" : {
    "totalCount" : 1,
    "pageNumber" : 1,
    "pagesAvailable" : 1,
    "pageItems" : [ {
      "protocolVersion" : "0.2.9",
      "name" : "GeoSpatial Route Planner Agent",
      "description" : "Provides advanced route planning, traffic analysis, and custom map generation services. This agent can calculate optimal routes, estimate travel times considering real-time traffic, and create personalized maps with points of interest.",
      "version" : "1.2.0",
      "iconUrl" : "https://georoute-agent.example.com/icon.png",
      "capabilities" : {
        "streaming" : true,
        "pushNotifications" : true,
        "stateTransitionHistory" : false,
        "extensions" : null
      },
      "skills" : [ {
        "id" : "route-optimizer-traffic",
        "name" : "Traffic-Aware Route Optimizer",
        "description" : "Calculates the optimal driving route between two or more locations, taking into account real-time traffic conditions, road closures, and user preferences (e.g., avoid tolls, prefer highways).",
        "tags" : [ "maps", "routing", "navigation", "directions", "traffic" ],
        "examples" : [ "Plan a route from '1600 Amphitheatre Parkway, Mountain View, CA' to 'San Francisco International Airport' avoiding tolls.", "{\"origin\": {\"lat\": 37.422, \"lng\": -122.084}, \"destination\": {\"lat\": 37.7749, \"lng\": -122.4194}, \"preferences\": [\"avoid_ferries\"]}" ],
        "inputModes" : [ "application/json", "text/plain" ],
        "outputModes" : [ "application/json", "application/vnd.geo+json", "text/html" ]
      }, {
        "id" : "custom-map-generator",
        "name" : "Personalized Map Generator",
        "description" : "Creates custom map images or interactive map views based on user-defined points of interest, routes, and style preferences. Can overlay data layers.",
        "tags" : [ "maps", "customization", "visualization", "cartography" ],
        "examples" : [ "Generate a map of my upcoming road trip with all planned stops highlighted.", "Show me a map visualizing all coffee shops within a 1-mile radius of my current location." ],
        "inputModes" : [ "application/json" ],
        "outputModes" : [ "image/png", "image/jpeg", "application/json", "text/html" ]
      } ],
      "latestPublishedVersion" : "1.2.0",
      "versionDetails" : [ {
        "version" : "1.2.0",
        "createdAt" : "2025-09-12T03:33:51Z",
        "updatedAt" : "2025-09-12T07:21:49Z",
        "latest" : true
      } ],
      "registrationType" : "URL"
    } ]
  }
}
```

### 5.3. 查询AgentCard的详情

#### 接口描述

通过该接口，可以查询托管在Nacos上指定AgentCard的详细信息。

#### 起始版本

`3.1.0`

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/ai/a2a`

#### 请求参数

| 参数名                | 参数类型     | 是否必填  | 描述                                                                                 |
|--------------------|----------|-------|------------------------------------------------------------------------------------|
| `namespaceId`      | `string` | 否     | AgentCard所属的命名空间，默认`public`                                                        |
| `agentName`        | `string` | **是** | AgentCard的名称                                                                       |
| `version`          | `string` | 否     | AgentCard的版本号，为空时返回最新版本详情                                                          |
| `registrationType` | `string` | 否     | AgentCard的默认注册类型，可选`URL`和`SERVICE`。未填写时根据此AgentCard的默认`registrationType`进行`url`的生成 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                 | 参数类型                              | 描述                                                                                                       |
|-------------------------------------|-----------------------------------|----------------------------------------------------------------------------------------------------------|
| `protocolVersion`                   | `string` | AgentCard的A2A协议版本。                                                                                       |
| `name`                              | `string` | AgentCard的名称。                                                                                            |
| `description`                       | `string` | AgentCard的描述。                                                                                            |
| `version`                           | `string` | AgentCard的版本号。                                                                                           |
| `iconUrl`                           | `string` | AgentCard的iconURL。                                                                                       |
| `capabilities`                      | `AgentCapabilities`              | AgentCard的能力，匹配[A2A标准能力](https://a2a-protocol.org/latest/specification/#552-agentcapabilities-object)。   |
| `skills`                            | `array<AgentSkill>`               | AgentCard的技能列表,匹配[A2A标准技能](https://a2a-protocol.org/latest/specification/#554-agentskill-object)。        |
| `url`                               | `string` | AgentCard的默认访问的URL。                                                                                      |
| `preferredTransport`                | `string` | AgentCard的默认访问URL的传输协议，应该为`JSONRPC`,`GRPC`,`HTTP+JSON`。                                                  |
| `additionalInterfaces`              | `array<AgentInterface>`           | AgentCard的所有可访问接口列表,匹配[A2A标准](https://a2a-protocol.org/latest/specification/#555-agentinterface-object)。 |
| `provider`                          | `AgentProvider`                  | AgentCard的提供商信息，匹配[A2A标准](https://a2a-protocol.org/latest/specification/#551-agentprovider-object)。      |
| `documentationUrl`                  | `string` | AgentCard的文档 URL。                                                                                        |
| `securitySchemes`                   | `map<string, SecurityScheme>`     | AgentCard的安全配置定义。匹配[A2A标准](https://a2a-protocol.org/latest/specification/#553-securityscheme-object)     |
| `security`                          | `array<map<string, array<string>>>` | AgentCard的所有安全要求对象列表。                                                                                    |
| `defaultInputModes`                 | `array<string>`                   | AgentCard的所有默认输入模式。                                                                                      |
| `defaultOutputModes`                | `array<string>`                  | AgentCard的所有默认输出模式。                                                                                      |
| `supportsAuthenticatedExtendedCard` | `boolean` | AgentCard是否支持认证的扩展卡。                                                                                     |
| `registrationType`                  | `string` | AgentCard的默认注册类型，可选`URL`和`SERVICE`。                                                                      |
| `latestVersion`                     | `boolean` | AgentCard当前版本是否为最新版本。                                                                                    |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/a2a?namespaceId=public&agentName=GeoSpatial+Route+Planner+Agent&version=1.0.0&registrationType=SERVICE'
```
* 返回示例

```json
{
  "code" : 0,
  "message" : "success",
  "data" : {
    "protocolVersion" : "0.2.9",
    "name" : "GeoSpatial Route Planner Agent",
    "description" : "Provides advanced route planning, traffic analysis, and custom map generation services. This agent can calculate optimal routes, estimate travel times considering real-time traffic, and create personalized maps with points of interest.",
    "version" : "1.2.0",
    "iconUrl" : "https://georoute-agent.example.com/icon.png",
    "capabilities" : {
      "streaming" : true,
      "pushNotifications" : true,
      "stateTransitionHistory" : false,
      "extensions" : null
    },
    "skills" : [ {
      "id" : "route-optimizer-traffic",
      "name" : "Traffic-Aware Route Optimizer",
      "description" : "Calculates the optimal driving route between two or more locations, taking into account real-time traffic conditions, road closures, and user preferences (e.g., avoid tolls, prefer highways).",
      "tags" : [ "maps", "routing", "navigation", "directions", "traffic" ],
      "examples" : [ "Plan a route from '1600 Amphitheatre Parkway, Mountain View, CA' to 'San Francisco International Airport' avoiding tolls.", "{\"origin\": {\"lat\": 37.422, \"lng\": -122.084}, \"destination\": {\"lat\": 37.7749, \"lng\": -122.4194}, \"preferences\": [\"avoid_ferries\"]}" ],
      "inputModes" : [ "application/json", "text/plain" ],
      "outputModes" : [ "application/json", "application/vnd.geo+json", "text/html" ]
    }, {
      "id" : "custom-map-generator",
      "name" : "Personalized Map Generator",
      "description" : "Creates custom map images or interactive map views based on user-defined points of interest, routes, and style preferences. Can overlay data layers.",
      "tags" : [ "maps", "customization", "visualization", "cartography" ],
      "examples" : [ "Generate a map of my upcoming road trip with all planned stops highlighted.", "Show me a map visualizing all coffee shops within a 1-mile radius of my current location." ],
      "inputModes" : [ "application/json" ],
      "outputModes" : [ "image/png", "image/jpeg", "application/json", "text/html" ]
    } ],
    "url" : "https://georoute-agent.example.com/a2a/v1",
    "preferredTransport" : "JSONRPC",
    "additionalInterfaces" : [ {
      "url" : "https://georoute-agent.example.com/a2a/v1",
      "transport" : "JSONRPC"
    }, {
      "url" : "https://georoute-agent.example.com/a2a/grpc",
      "transport" : "GRPC"
    }, {
      "url" : "https://georoute-agent.example.com/a2a/json",
      "transport" : "HTTP+JSON"
    } ],
    "provider" : {
      "organization" : "Example Geo Services Inc.",
      "url" : "https://www.examplegeoservices.com"
    },
    "documentationUrl" : "https://docs.examplegeoservices.com/georoute-agent/api",
    "securitySchemes" : {
      "google" : {
        "type" : "openIdConnect",
        "openIdConnectUrl" : "https://accounts.google.com/.well-known/openid-configuration"
      }
    },
    "security" : [ {
      "google" : [ "openid", "profile", "email" ]
    } ],
    "defaultInputModes" : [ "application/json", "text/plain" ],
    "defaultOutputModes" : [ "application/json", "image/png" ],
    "supportsAuthenticatedExtendedCard" : true,
    "registrationType" : "URL",
    "latestVersion" : true
  }
}
```

### 5.4. 更新AgentCard

#### 接口描述

通过该接口，可以更新托管在Nacos上的AgentCard。

#### 起始版本

`3.1.0`

#### 请求方式

`PUT`

#### 鉴权状态

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/ai/a2a`

#### 请求参数

| 参数名                | 参数类型        | 是否必填  | 描述                                                                                                              |
|--------------------|-------------|-------|-----------------------------------------------------------------------------------------------------------------|
| `namespaceId` | `string` | 否 | AgentCard所属的命名空间，默认`public` |
| `agentCard` | `string` | **是** | AgentCard的完整对象，详情请参考[标准AgentCard](https://a2a-protocol.org/latest/specification/#55-agentcard-object-structure) |
| `registrationType` | `string` | 否 | AgentCard的默认注册类型，可选`URL`和`SERVICE`。未填写时根据此AgentCard的默认`registrationType`进行`url`的生成 |
| `setAsLatest` | `boolean` | 否 | 是否设置此版本为最新发布版本，默认为false |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述               |
|--------|----------|------------------|
| `data` | `string` | AgentCard服务更新结果。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/a2a' \
-d 'namespaceId=public' \
-d 'agentCard={"protocolVersion":"0.2.9","name":"GeoSpatial Route Planner Agent","description":"Provides advanced route planning, traffic analysis, and custom map generation services. This agent can calculate optimal routes, estimate travel times considering real-time traffic, and create personalized maps with points of interest.","url":"https://georoute-agent.example.com/a2a/v1","preferredTransport":"JSONRPC","additionalInterfaces":[{"url":"https://georoute-agent.example.com/a2a/v1","transport":"JSONRPC"},{"url":"https://georoute-agent.example.com/a2a/grpc","transport":"GRPC"},{"url":"https://georoute-agent.example.com/a2a/json","transport":"HTTP+JSON"}],"provider":{"organization":"Example Geo Services Inc.","url":"https://www.examplegeoservices.com"},"iconUrl":"https://georoute-agent.example.com/icon.png","version":"1.2.0","documentationUrl":"https://docs.examplegeoservices.com/georoute-agent/api","capabilities":{"streaming":true,"pushNotifications":true,"stateTransitionHistory":false},"securitySchemes":{"google":{"type":"openIdConnect","openIdConnectUrl":"https://accounts.google.com/.well-known/openid-configuration"}},"security":[{"google":["openid","profile","email"]}],"defaultInputModes":["application/json","text/plain"],"defaultOutputModes":["application/json","image/png"],"skills":[{"id":"route-optimizer-traffic","name":"Traffic-Aware Route Optimizer","description":"Calculates the optimal driving route between two or more locations, taking into account real-time traffic conditions, road closures, and user preferences (e.g., avoid tolls, prefer highways).","tags":["maps","routing","navigation","directions","traffic"],"examples":["Plan a route from '\''1600 Amphitheatre Parkway, Mountain View, CA'\'' to '\''San Francisco International Airport'\'' avoiding tolls.","{\"origin\": {\"lat\": 37.422, \"lng\": -122.084}, \"destination\": {\"lat\": 37.7749, \"lng\": -122.4194}, \"preferences\": [\"avoid_ferries\"]}"],"inputModes":["application/json","text/plain"],"outputModes":["application/json","application/vnd.geo+json","text/html"]},{"id":"custom-map-generator","name":"Personalized Map Generator","description":"Creates custom map images or interactive map views based on user-defined points of interest, routes, and style preferences. Can overlay data layers.","tags":["maps","customization","visualization","cartography"],"examples":["Generate a map of my upcoming road trip with all planned stops highlighted.","Show me a map visualizing all coffee shops within a 1-mile radius of my current location."],"inputModes":["application/json"],"outputModes":["image/png","image/jpeg","application/json","text/html"]}],"supportsAuthenticatedExtendedCard":true,"signatures":[{"protected":"eyJhbGciOiJFUzI1NiIsInR5cCI6IkpPU0UiLCJraWQiOiJrZXktMSIsImprdSI6Imh0dHBzOi8vZXhhbXBsZS5jb20vYWdlbnQvandrcy5qc29uIn0","signature":"QFdkNLNszlGj3z3u0YQGt_T9LixY3qtdQpZmsTdDHDe3fXV9y9-B3m2-XgCpzuhiLt8E0tV6HXoZKHv4GtHgKQ"}]}' \
-d 'registrationType=SERVICE' \
-d 'setAsLatest=true'
```
* 返回示例

```json
{
  "code" : 0,
  "message" : "success",
  "data" : "ok"
}
```

### 5.5. 创建AgentCard

#### 接口描述

通过该接口，可以创建托管在Nacos上的AgentCard。

#### 起始版本

`3.1.0`

#### 请求方式

`POST`

#### 鉴权状态

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/ai/a2a`

#### 请求参数

| 参数名                | 参数类型        | 是否必填  | 描述                                                                                                              |
|--------------------|-------------|-------|-----------------------------------------------------------------------------------------------------------------|
| `namespaceId` | `string` | 否 | AgentCard所属的命名空间，默认`public` |
| `agentCard` | `string` | **是** | AgentCard的完整对象，详情请参考[标准AgentCard](https://a2a-protocol.org/latest/specification/#55-agentcard-object-structure) |
| `registrationType` | `string` | 否 | AgentCard的默认注册类型，可选`URL`和`SERVICE`。未填写时根据此AgentCard的默认`registrationType`进行`url`的生成, 默认值为`URL` |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述             |
|--------|----------|----------------|
| `data` | `string` | AgentCard发布结果。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/a2a' \
-d 'namespaceId=public' \
-d 'agentCard={"protocolVersion":"0.2.9","name":"GeoSpatial Route Planner Agent","description":"Provides advanced route planning, traffic analysis, and custom map generation services. This agent can calculate optimal routes, estimate travel times considering real-time traffic, and create personalized maps with points of interest.","url":"https://georoute-agent.example.com/a2a/v1","preferredTransport":"JSONRPC","additionalInterfaces":[{"url":"https://georoute-agent.example.com/a2a/v1","transport":"JSONRPC"},{"url":"https://georoute-agent.example.com/a2a/grpc","transport":"GRPC"},{"url":"https://georoute-agent.example.com/a2a/json","transport":"HTTP+JSON"}],"provider":{"organization":"Example Geo Services Inc.","url":"https://www.examplegeoservices.com"},"iconUrl":"https://georoute-agent.example.com/icon.png","version":"1.2.0","documentationUrl":"https://docs.examplegeoservices.com/georoute-agent/api","capabilities":{"streaming":true,"pushNotifications":true,"stateTransitionHistory":false},"securitySchemes":{"google":{"type":"openIdConnect","openIdConnectUrl":"https://accounts.google.com/.well-known/openid-configuration"}},"security":[{"google":["openid","profile","email"]}],"defaultInputModes":["application/json","text/plain"],"defaultOutputModes":["application/json","image/png"],"skills":[{"id":"route-optimizer-traffic","name":"Traffic-Aware Route Optimizer","description":"Calculates the optimal driving route between two or more locations, taking into account real-time traffic conditions, road closures, and user preferences (e.g., avoid tolls, prefer highways).","tags":["maps","routing","navigation","directions","traffic"],"examples":["Plan a route from '\''1600 Amphitheatre Parkway, Mountain View, CA'\'' to '\''San Francisco International Airport'\'' avoiding tolls.","{\"origin\": {\"lat\": 37.422, \"lng\": -122.084}, \"destination\": {\"lat\": 37.7749, \"lng\": -122.4194}, \"preferences\": [\"avoid_ferries\"]}"],"inputModes":["application/json","text/plain"],"outputModes":["application/json","application/vnd.geo+json","text/html"]},{"id":"custom-map-generator","name":"Personalized Map Generator","description":"Creates custom map images or interactive map views based on user-defined points of interest, routes, and style preferences. Can overlay data layers.","tags":["maps","customization","visualization","cartography"],"examples":["Generate a map of my upcoming road trip with all planned stops highlighted.","Show me a map visualizing all coffee shops within a 1-mile radius of my current location."],"inputModes":["application/json"],"outputModes":["image/png","image/jpeg","application/json","text/html"]}],"supportsAuthenticatedExtendedCard":true,"signatures":[{"protected":"eyJhbGciOiJFUzI1NiIsInR5cCI6IkpPU0UiLCJraWQiOiJrZXktMSIsImprdSI6Imh0dHBzOi8vZXhhbXBsZS5jb20vYWdlbnQvandrcy5qc29uIn0","signature":"QFdkNLNszlGj3z3u0YQGt_T9LixY3qtdQpZmsTdDHDe3fXV9y9-B3m2-XgCpzuhiLt8E0tV6HXoZKHv4GtHgKQ"}]}' \
-d 'registrationType=SERVICE'
```
* 返回示例

```json
{
  "code" : 0,
  "message" : "success",
  "data" : "ok"
}
```

### 5.6. 删除AgentCard

#### 接口描述

通过该接口，可以删除托管在Nacos上的AgentCard。

#### 起始版本

`3.1.0`

#### 请求方式

`DELETE`

#### 鉴权状态

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/ai/a2a`

#### 请求参数

| 参数名           | 参数类型     | 是否必填  | 描述                          |
|---------------|----------|-------|-----------------------------|
| `namespaceId` | `string` | 否     | AgentCard所属的命名空间，默认`public` |
| `agentName`   | `string` | **是** | AgentCard的名称                |
| `version`     | `string` | 否     | AgentCard的版本号，为空时返回最新版本详情   |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述             |
|--------|----------|----------------|
| `data` | `string` | AgentCard删除结果。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ai/a2a?namespaceId=public&agentName=GeoSpatial+Route+Planner+Agent&version=1.0.0'
```
* 返回示例

```json
{
  "code" : 0,
  "message" : "success",
  "data" : "ok"
}
```

## 6. AI Prompt 管理

### 6.1. 发布 Prompt

#### 接口描述

通过该接口，可以发布新版本的 Prompt。

#### 起始版本

`3.2.0`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间，默认 public |
| `promptKey` | `string` | **是** | Prompt 键 |
| `version` | `string` | **是** | 版本号 |
| `template` | `string` | 否 | 模板内容 |
| `commitMsg` | `string` | 否 | 提交说明 |
| `description` | `string` | 否 | 描述 |
| `bizTags` | `string` | 否 | 业务标签 |
| `variables` | `string` | 否 | Prompt 模板变量定义（JSON 字符串） |

#### 返回数据

成功则返回统一返回体，`data` 为 `true` 表示成功；失败则返回[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt' \
  -d 'namespaceId=public' -d 'promptKey=my-prompt' -d 'version=1.0.0' -d 'template=hello'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 6.2. 删除 Prompt

#### 接口描述

通过该接口，可以删除指定 Prompt。

#### 起始版本

`3.2.0`

#### 请求方式

`DELETE`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `promptKey` | `string` | **是** | Prompt 键 |

#### 返回数据

成功则返回统一返回体，`data` 为 `true` 表示成功；失败则返回[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt?namespaceId=public&promptKey=my-prompt'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 6.3. 查询 Prompt 详情

#### 接口描述

通过该接口，可按版本或标签查询 Prompt 详情。

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/detail`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `promptKey` | `string` | **是** | Prompt 键 |
| `version` | `string` | 否 | 版本号 |
| `label` | `string` | 否 | 标签 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，`data` 含 promptKey、version、template、commitMsg、md5 等字段。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt/detail?namespaceId=public&promptKey=my-prompt&version=1.0.0'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "version": "1.0.0",
    "template": "",
    "commitMsg": ""
  }
}
```

### 6.4. 绑定标签

#### 接口描述

通过该接口，可将标签绑定到指定 Prompt 版本。

#### 起始版本

`3.2.0`

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/label`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `promptKey` | `string` | **是** | Prompt 键 |
| `label` | `string` | **是** | 标签名 |
| `version` | `string` | **是** | 版本号 |

#### 返回数据

成功则返回统一返回体，`data` 为 `true` 表示成功；失败则返回[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt/label' \
  -d 'namespaceId=public' -d 'promptKey=my-prompt' -d 'label=stable' -d 'version=1.0.0'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 6.5. 解绑标签

#### 接口描述

通过该接口，可解绑 Prompt 的标签。

#### 起始版本

`3.2.0`

#### 请求方式

`DELETE`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/label`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `promptKey` | `string` | **是** | Prompt 键 |
| `label` | `string` | **是** | 标签名 |

#### 返回数据

成功则返回统一返回体，`data` 为 `true` 表示成功；失败则返回[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt/label?namespaceId=public&promptKey=my-prompt&label=stable'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 6.6. 查询 Prompt 列表

#### 接口描述

通过该接口，可以分页查询 Prompt 列表。

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/list`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pageNo` | `integer` | **是** | 页码 |
| `pageSize` | `integer` | **是** | 每页条数 |
| `namespaceId` | `string` | 否 | 命名空间 |
| `promptKey` | `string` | 否 | Prompt 键过滤 |
| `search` | `string` | 否 | 搜索模式：`blur` 或 `accurate`。 |
| `bizTags` | `string` | 否 | 业务标签 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，`data` 为分页结构，包含 totalCount、pageNumber、pagesAvailable、pageItems 等字段。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt/list?pageNo=1&pageSize=10&namespaceId=public&search=blur'
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
        "promptKey": "my-prompt",
        "description": ""
      }
    ]
  }
}
```

### 6.7. 查询 Prompt 元数据

#### 接口描述

通过该接口，可以查询指定 Prompt 的元数据信息。

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/metadata`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `promptKey` | `string` | **是** | Prompt 键 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，`data` 包含 promptKey、description、bizTags、latestVersion、versions、labels 等字段。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt/metadata?namespaceId=public&promptKey=my-prompt'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "promptKey": "my-prompt",
    "description": "",
    "bizTags": ""
  }
}
```

### 6.8. 更新 Prompt 元数据

#### 接口描述

通过该接口，可更新 Prompt 的元数据（如描述、业务标签）。

#### 起始版本

`3.2.0`

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/metadata`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `promptKey` | `string` | **是** | Prompt 键 |
| `description` | `string` | 否 | 描述 |
| `bizTags` | `string` | 否 | 业务标签 |

#### 返回数据

成功则返回统一返回体，`data` 为 `true` 表示成功；失败则返回[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt/metadata' \
  -d 'namespaceId=public' -d 'promptKey=my-prompt' -d 'description=desc'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 6.9. 查询 Prompt 版本列表

#### 接口描述

通过该接口，可以分页查询指定 Prompt 的版本列表。

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/versions`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `promptKey` | `string` | **是** | Prompt 键 |
| `pageNo` | `integer` | **是** | 页码 |
| `pageSize` | `integer` | **是** | 每页条数 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，`data` 为分页结构，包含 totalCount、pageNumber、pagesAvailable、pageItems（每项含 version、commitMsg、gmtModified 等）。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt/versions?namespaceId=public&promptKey=my-prompt&pageNo=1&pageSize=10'
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
        "version": "1.0.0",
        "commitMsg": ""
      }
    ]
  }
}
```

### 6.10. 更新 Prompt 业务标签

#### 接口描述

通过该接口，可更新 Prompt 业务标签。

#### 起始版本

`3.2.1`

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/biz-tags`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `promptKey` | `string` | **是** | Prompt 键 |
| `bizTags` | `string` | 否 | 业务标签 |

### 6.11. 更新 Prompt 描述

#### 接口描述

通过该接口，可更新 Prompt 描述。

#### 起始版本

`3.2.1`

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/description`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `promptKey` | `string` | **是** | Prompt 键 |
| `description` | `string` | **是** | 描述 |

### 6.12. 创建 Prompt 草稿

#### 接口描述

通过该接口，可创建 Prompt 草稿版本，或基于已有版本重新创建草稿。

#### 起始版本

`3.2.1`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `promptKey` | `string` | **是** | Prompt 键 |
| `basedOnVersion` | `string` | 否 | 基于该版本创建草稿 |
| `targetVersion` | `string` | 否 | 目标版本 |
| `template` | `string` | 否 | 模板内容 |
| `variables` | `string` | 否 | Prompt 模板变量定义（JSON 字符串） |
| `commitMsg` | `string` | 否 | 提交说明 |
| `description` | `string` | 否 | 描述 |
| `bizTags` | `string` | 否 | 业务标签 |

### 6.13. 更新 Prompt 草稿

#### 接口描述

通过该接口，可更新当前 Prompt 草稿内容。

#### 起始版本

`3.2.1`

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `promptKey` | `string` | **是** | Prompt 键 |
| `template` | `string` | **是** | 模板内容 |
| `variables` | `string` | 否 | Prompt 模板变量定义（JSON 字符串） |
| `commitMsg` | `string` | 否 | 提交说明 |

### 6.14. 删除 Prompt 草稿

#### 接口描述

通过该接口，可删除当前 Prompt 草稿版本。

#### 起始版本

`3.2.1`

#### 请求方式

`DELETE`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `promptKey` | `string` | **是** | Prompt 键 |

### 6.15. 强制发布 Prompt 版本

#### 接口描述

通过该接口，可绕过流水线校验强制发布 Prompt 版本。

#### 起始版本

`3.2.1`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/force-publish`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `promptKey` | `string` | **是** | Prompt 键 |
| `version` | `string` | **是** | 版本号 |

### 6.16. 查询 Prompt 治理详情

#### 接口描述

通过该接口，可查询 Prompt 元数据、版本治理信息和版本摘要。

#### 起始版本

`3.2.1`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/governance`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `promptKey` | `string` | **是** | Prompt 键 |

### 6.17. 更新 Prompt 标签

#### 接口描述

通过该接口，可更新 Prompt 的运行时路由标签。

#### 起始版本

`3.2.1`

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/labels`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `promptKey` | `string` | **是** | Prompt 键 |
| `labels` | `string` | **是** | 标签 JSON 字符串 |

### 6.18. 下线 Prompt 版本

#### 接口描述

通过该接口，可下线指定 Prompt 版本。

#### 起始版本

`3.2.1`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/offline`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `promptKey` | `string` | **是** | Prompt 键 |
| `version` | `string` | **是** | 版本号 |

### 6.19. 上线 Prompt 版本

#### 接口描述

通过该接口，可上线指定 Prompt 版本。

#### 起始版本

`3.2.1`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/online`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `promptKey` | `string` | **是** | Prompt 键 |
| `version` | `string` | **是** | 版本号 |

### 6.20. 发布 Prompt 版本

#### 接口描述

通过该接口，可发布已通过评审的 Prompt 版本。

#### 起始版本

`3.2.1`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/publish`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `promptKey` | `string` | **是** | Prompt 键 |
| `version` | `string` | **是** | 版本号 |

### 6.21. 重新编辑 Prompt 版本

#### 接口描述

通过该接口，可将已评审的 Prompt 版本重新转为草稿。

#### 起始版本

`3.2.2`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/redraft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `promptKey` | `string` | **是** | Prompt 键 |
| `version` | `string` | **是** | 版本号 |

### 6.22. 提交 Prompt 版本审核

#### 接口描述

通过该接口，可提交 Prompt 版本进入流水线评审。

#### 起始版本

`3.2.1`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/submit`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `promptKey` | `string` | **是** | Prompt 键 |
| `version` | `string` | 否 | 版本号 |

### 6.23. 查询 Prompt 版本详情

#### 接口描述

通过该接口，可查询指定 Prompt 版本详情。

#### 起始版本

`3.2.1`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/version`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `promptKey` | `string` | **是** | Prompt 键 |
| `version` | `string` | 否 | 版本号 |

### 6.24. 下载 Prompt 版本

#### 接口描述

通过该接口，可将指定 Prompt 版本下载为 Markdown 文件。

#### 起始版本

`3.2.2`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/version/download`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `promptKey` | `string` | **是** | Prompt 键 |
| `version` | `string` | 否 | 版本号 |

## 7. AI Skills 管理

### 7.1. 获取技能详情

#### 接口描述

通过该接口，按命名空间和技能名称获取指定技能的详情信息。

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `skillName` | `string` | **是** | 技能名称 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，`data` 包含 name、description、instruction、resource、version、inputModes、outputModes 等字段。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills?namespaceId=public&skillName=my-skill'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "name": "my-skill",
    "description": "",
    "version": "1.0.0",
    "inputModes": [],
    "outputModes": []
  }
}
```

### 7.2. 创建技能草稿版本

#### 接口描述

通过该接口，可基于已有版本或全新 SkillCard 创建技能草稿版本。

#### 起始版本

`3.2.0`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `skillName` | `string` | 否 | 技能名称 |
| `basedOnVersion` | `string` | 否 | 基于该版本创建草稿 |
| `targetVersion` | `string` | 否 | 目标版本 |
| `skillCard` | `string` | 否 | SkillCard 的 JSON 字符串；未设置 `basedOnVersion` 时必填。 |
| `commitMsg` | `string` | 否 | 草稿版本提交说明。 |

#### 返回数据

成功则返回统一返回体，`data` 为字符串（草稿创建结果）；失败则返回[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/draft' \
  -d 'namespaceId=public' -d 'skillName=my-skill' -d 'basedOnVersion=1.0.0'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 7.3. 更新技能草稿内容

#### 接口描述

通过该接口，可更新当前技能草稿版本的 SkillCard 内容。

#### 起始版本

`3.2.0`

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `skillCard` | `string` | **是** | SkillCard 的 JSON 字符串，包含完整技能信息。 |
| `commitMsg` | `string` | 否 | 草稿内容更新说明。 |

#### 返回数据

成功则返回统一返回体，`data` 为字符串（草稿更新结果）；失败则返回[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/draft' \
  -d 'namespaceId=public' -d 'skillName=my-skill' -d 'skillCard={}'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 7.4. 删除技能

#### 接口描述

通过该接口，按命名空间和技能名称从 Nacos 删除技能。

#### 起始版本

`3.2.0`

#### 请求方式

`DELETE`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `skillName` | `string` | **是** | 技能名称 |

#### 返回数据

成功则返回统一返回体，`data` 为字符串表示操作结果（如 "ok"）；失败则返回[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills?namespaceId=public&skillName=my-skill'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 7.5. 查询技能列表

#### 接口描述

通过该接口，可按条件筛选和分页查询技能列表。

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/list`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pageNo` | `integer` | 否 | 页码，默认为 `1`，必须为正整数。 |
| `pageSize` | `integer` | 否 | 每页条数，默认为 `100`，必须为正整数。 |
| `namespaceId` | `string` | 否 | 命名空间 |
| `skillName` | `string` | 否 | 技能名称过滤 |
| `search` | `string` | 否 | 搜索模式：`accurate` 或 `blur`。 |
| `orderBy` | `string` | 否 | 排序字段，例如 `download_count`。 |
| `owner` | `string` | 否 | 所有者过滤条件。 |
| `scope` | `string` | 否 | 可见范围过滤条件。 |
| `bizTag` | `string` | 否 | 业务标签过滤条件。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，`data` 为分页结构，包含 totalCount、pageNumber、pagesAvailable、pageItems（每项含 name、description、updateTime 等）。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/list?pageNo=1&pageSize=100&namespaceId=public&search=blur'
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
        "name": "my-skill",
        "description": "",
        "version": "1.0.0"
      }
    ]
  }
}
```

### 7.6. 从 ZIP 文件上传技能

#### 接口描述

通过该接口，以 multipart/form-data 方式上传 ZIP 包并注册技能。文件须为合法的技能包。

#### 起始版本

`3.2.0`

#### 请求方式

`POST`

请求体类型：`multipart/form-data`，参数放在请求体中。

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/upload`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间。 |
| `overwrite` | `boolean` | 否 | 是否覆盖同名技能；默认不覆盖。 |
| `targetVersion` | `string` | 否 | 上传后的目标版本。 |
| `commitMsg` | `string` | 否 | 提交说明。 |
| `uploadAction` | `string` | 否 | 预检查后选择的上传动作。 |
| `autoPublishIfNew` | `boolean` | 否 | 是否自动发布新建技能的首个版本，默认为 `false`；不用于自动发布已有技能的新版本。 |
| `file` | `file` | **是** | 包含技能内容的 ZIP 包文件。 |

#### 返回数据

成功则返回统一返回体，`data` 为上传后的技能名称；失败则返回[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)。

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/upload' \
  -F "file=@skill.zip" -F "namespaceId=public" -F "overwrite=false" -F "targetVersion=1.0.0" -F "commitMsg=initial"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "uploaded-skill-name"
}
```

### 7.7. 删除技能草稿版本

#### 接口描述

通过该接口，可删除指定技能的当前草稿版本。

#### 起始版本

`3.2.0`

#### 请求方式

`DELETE`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `skillName` | `string` | **是** | 技能名称 |

### 7.8. 更新技能业务标签

#### 接口描述

通过该接口，可更新技能的业务标签列表，无需变更版本状态。

#### 起始版本

`3.2.0`

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/biz-tags`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `skillName` | `string` | **是** | 技能名称 |
| `bizTags` | `string` | **是** | 业务标签 |

### 7.9. 更新技能版本标签

#### 接口描述

通过该接口，可更新技能的版本路由标签（如 latest）。

#### 起始版本

`3.2.0`

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/labels`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `skillName` | `string` | **是** | 技能名称 |
| `labels` | `string` | **是** | 标签 JSON 字符串 |

### 7.10. 上下线与发布技能版本

#### 接口描述

以下接口用于技能版本发布流程控制。

#### 请求参数

| 请求方式 | 请求URL | 关键参数 |
|--------|----------|----------|
| `POST` | `/nacos/v3/admin/ai/skills/offline` | `namespaceId`、`skillName`、`scope`、`version` |
| `POST` | `/nacos/v3/admin/ai/skills/online` | `namespaceId`、`skillName`、`scope`、`version` |
| `POST` | `/nacos/v3/admin/ai/skills/publish` | `namespaceId`、`skillName`、`version` |
| `PUT` | `/nacos/v3/admin/ai/skills/scope` | `namespaceId`、`skillName`、`scope` |
| `POST` | `/nacos/v3/admin/ai/skills/submit` | `namespaceId`、`skillName`、`version` |

### 7.11. 查询技能版本详情

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/ai/skills/version`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `skillName` | `string` | **是** | 技能名称 |
| `version` | `string` | 否 | 版本号 |

### 7.12. 下载技能版本 ZIP 包

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/ai/skills/version/download`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `skillName` | `string` | **是** | 技能名称 |
| `version` | `string` | 否 | 版本号 |

### 7.13. 下线技能
#### 接口描述
通过该接口，可对指定版本或整个技能执行下线操作，使其不可被调用。

#### 起始版本

`3.2.0`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/offline`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `skillName` | `string` | **是** | 技能名称。 |
| `scope` | `string` | 否 | 当取 `skill` 时按技能级别操作，否则按版本级别操作。 |
| `version` | `string` | 否 | 版本号。 |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/offline' -d "namespaceId=namespaceId&skillName=skillName&scope=scope&version=version"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.14. 上线技能
#### 接口描述
通过该接口，可对指定版本或整个技能执行上线操作，使其可被调用。

#### 起始版本

`3.2.0`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/online`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `skillName` | `string` | **是** | 技能名称。 |
| `scope` | `string` | 否 | 当取 `skill` 时按技能级别操作，否则按版本级别操作。 |
| `version` | `string` | 否 | 版本号。 |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/online' -d "namespaceId=namespaceId&skillName=skillName&scope=scope&version=version"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 7.15. 发布技能版本
#### 接口描述
通过该接口，可将审核通过的技能版本正式发布。

#### 起始版本

`3.2.0`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/publish`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `skillName` | `string` | **是** | 技能名称。 |
| `version` | `string` | **是** | 版本号。 |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/publish' -d "namespaceId=public&skillName=my-skill&version=1.0.0"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 7.16. 更新技能可见范围
#### 接口描述
通过该接口，可将技能的可见范围设置为 PUBLIC（公开）或 PRIVATE（私有）。

#### 起始版本

`3.2.0`

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/scope`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `skillName` | `string` | **是** | 技能名称。 |
| `scope` | `string` | **是** | `PUBLIC` 或 `PRIVATE`。 |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/scope' -d "namespaceId=namespaceId&skillName=skillName&scope=scope"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 7.17. 提交技能版本审核
#### 接口描述
通过该接口，可将技能草稿版本提交至流水线进行审核。

#### 起始版本

`3.2.0`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/submit`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `skillName` | `string` | **是** | 技能名称。 |
| `version` | `string` | 否 | 版本号。 |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/submit' -d "namespaceId=namespaceId&skillName=skillName&version=version"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 7.18. 强制发布 Skill 版本

#### 接口描述

通过该接口，可绕过流水线校验强制发布 Skill 版本。

#### 起始版本

`3.2.1`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/force-publish`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `skillName` | `string` | **是** | 技能名称 |
| `version` | `string` | **是** | 版本号 |

### 7.19. 重新编辑 Skill 版本

#### 接口描述

通过该接口，可将已评审的 Skill 版本重新转为草稿。

#### 起始版本

`3.2.2`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/redraft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `skillName` | `string` | **是** | 技能名称 |
| `version` | `string` | **是** | 版本号 |

### 7.20. 批量上传 Skill

#### 接口描述

通过该接口，可从包含多个 Skill 子目录的 ZIP 文件批量上传 Skill。

#### 起始版本

`3.2.2`

#### 请求方式

`POST`

请求体类型：`multipart/form-data`，参数放在请求体中。

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/upload/batch`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `overwrite` | `boolean` | 否 | 是否覆盖同名技能 |
| `file` | `file` | **是** | 包含多个 Skill 子目录的 ZIP 包文件 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|------|------|-------------|
| `data` | `BatchUploadResult` | 批量上传结果。 |
| `data.succeeded` | `array<string>` | 上传成功的技能名称。 |
| `data.failed` | `array<FailedItem>` | 失败的技能及错误信息。 |
| `data.results` | `array<BatchUploadItemResult>` | 各技能的上传结果。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/upload/batch' \
  -F "file=@skills.zip" -F "namespaceId=public" -F "overwrite=false"
```

### 7.21. 预检查 Skill 上传

#### 接口描述

解析 ZIP 文件中的一个或多个 Skill 包，仅返回上传动作和版本冲突信息，不持久化任何变更。

#### 起始版本

`3.3.0`

#### 请求方式

`POST`

请求体类型：`multipart/form-data`。

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/upload/precheck`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 目标命名空间；Query 与 multipart 表单均支持。 |
| `file` | `file` | **是** | multipart 表单中的 Skill ZIP 文件，可包含一个或多个 Skill 包。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `array<SkillUploadPrecheckResult>` | 各 Skill 包的预检查结果。 |

`SkillUploadPrecheckResult` 包含 `namespaceId`、`entryPath`、`skillName`、`reason`、`owner`、`maxPublishedVersion`、`parsedVersion`、`targetVersion`、`exists`、`editingVersion`、`reviewingVersion` 和 `precheckCode`。

#### 示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/upload/precheck?namespaceId=public' \
  -F 'file=@skills.zip'
```

## 8. AgentSpec 管理

### 8.1. 查询 AgentSpec
#### 接口描述
通过该接口，可按命名空间和名称查询 AgentSpec 的最新已发布版本。

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentSpecName` | `string` | **是** | AgentSpec 名称。 |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data.namespaceId | `string` | - |
| data.data.name | `string` | - |
| data.data.description | `string` | - |
| data.data.updateTime | `integer` | - |
| data.data.enable | `boolean` | - |
| data.data.bizTags | `string` | - |
| data.data.from | `string` | - |
| data.data.scope | `string` | - |
| data.data.labels | `map<string, string>` | 版本标签映射。 |
| data.data.editingVersion | `string` | - |
| data.data.reviewingVersion | `string` | - |
| data.data.onlineCnt | `integer` | - |
| data.data.downloadCount | `integer` | - |
| data.data.versions | `array<AgentSpecVersionSummary>` | 版本摘要列表。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs?namespaceId=public&agentSpecName=my-agentspec'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.2. 删除 AgentSpec
#### 接口描述
通过该接口，可删除指定命名空间和名称下的 AgentSpec 及其所有版本。

#### 起始版本

`3.2.0`

#### 请求方式

`DELETE`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentSpecName` | `string` | **是** | AgentSpec 名称。 |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs?namespaceId=public&agentSpecName=my-agentspec'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.3. 更新 AgentSpec 业务标签
#### 接口描述
通过该接口，可更新 AgentSpec 的业务标签列表，无需变更版本状态。

#### 起始版本

`3.2.0`

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/biz-tags`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentSpecName` | `string` | **是** | AgentSpec 名称。 |
| `bizTags` | `string` | **是** | 业务标签，多个标签按系统约定格式传入。 |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/biz-tags' -d "namespaceId=public&agentSpecName=my-agentspec&bizTags=demo"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.4. 创建 AgentSpec 草稿版本
#### 接口描述
通过该接口，可基于某一已有版本创建 AgentSpec 草稿版本。

#### 起始版本

`3.2.0`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentSpecName` | `string` | **是** | AgentSpec 名称。 |
| `basedOnVersion` | `string` | 否 | 基于该版本创建草稿。 |
| `targetVersion` | `string` | 否 | 新草稿的目标版本。 |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/draft' -d "namespaceId=public&agentSpecName=my-agentspec&basedOnVersion=1.0.0"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.5. 更新 AgentSpec 草稿内容
#### 接口描述
通过该接口，可更新当前 AgentSpec 草稿版本的卡片内容。

#### 起始版本

`3.2.0`

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentSpecCard` | `string` | **是** | AgentSpec 卡片 JSON 字符串，包含完整 AgentSpec 信息。 |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/draft' -d "namespaceId=public&agentSpecName=my-agentspec&agentSpecCard={}"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.6. 删除 AgentSpec 草稿版本
#### 接口描述
通过该接口，可删除指定 AgentSpec 的当前草稿版本。

#### 起始版本

`3.2.0`

#### 请求方式

`DELETE`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentSpecName` | `string` | **是** | AgentSpec 名称。 |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/draft?namespaceId=public&agentSpecName=my-agentspec'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.7. 更新 AgentSpec 版本标签
#### 接口描述
通过该接口，可更新 AgentSpec 的版本路由标签（如 latest 标签），无需变更版本状态。

#### 起始版本

`3.2.0`

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/labels`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentSpecName` | `string` | **是** | AgentSpec 名称。 |
| `labels` | `string` | **是** | 版本标签内容，通常为 JSON 字符串。 |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/labels' -d "namespaceId=public&agentSpecName=my-agentspec&labels={\"latest\":\"1.0.0\"}"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.8. 查询 AgentSpec 列表
#### 接口描述
通过该接口，可按命名空间和名称分页查询 AgentSpec 列表。

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/list`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pageNo` | `integer` | 否 | 页码，默认为 `1`，必须为正整数。 |
| `pageSize` | `integer` | 否 | 每页条数，默认为 `100`，必须为正整数。 |
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentSpecName` | `string` | 否 | AgentSpec 名称。 |
| `search` | `string` | 否 | 搜索模式：`accurate` 或 `blur`。 |
| `orderBy` | `string` | 否 | 排序字段，例如 `download_count`。 |
| `owner` | `string` | 否 | 所有者过滤条件。 |
| `scope` | `string` | 否 | 可见范围过滤条件。 |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `Page<AgentSpecSummary>` | AgentSpec 摘要分页。 |
| `data.totalCount` | `integer` | 匹配的资源总数。 |
| `data.pageNumber` | `integer` | 当前页码。 |
| `data.pagesAvailable` | `integer` | 可用页数。 |
| `data.pageItems` | `array<AgentSpecSummary>` | 当前页的 AgentSpec 摘要。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/list?pageNo=1&pageSize=20&namespaceId=public&agentSpecName=my-agentspec&search=accurate'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.9. 下线 AgentSpec
#### 接口描述
通过该接口，可对指定版本或整个 AgentSpec 执行下线操作，使其不可被调用。

#### 起始版本

`3.2.0`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/offline`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentSpecName` | `string` | **是** | AgentSpec 名称。 |
| `scope` | `string` | 否 | 当取 `agentspec` 时按资源级别下线，否则按版本级别下线。 |
| `version` | `string` | 否 | 版本号。 |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/offline' -d "namespaceId=public&agentSpecName=my-agentspec&scope=agentspec&version=1.0.0"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.10. 上线 AgentSpec
#### 接口描述
通过该接口，可对指定版本或整个 AgentSpec 执行上线操作，使其可被调用。

#### 起始版本

`3.2.0`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/online`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentSpecName` | `string` | **是** | AgentSpec 名称。 |
| `scope` | `string` | 否 | 当取 `agentspec` 时按资源级别上线，否则按版本级别上线。 |
| `version` | `string` | 否 | 版本号。 |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/online' -d "namespaceId=public&agentSpecName=my-agentspec&scope=agentspec&version=1.0.0"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.11. 发布 AgentSpec 版本
#### 接口描述
通过该接口，可将审核通过的 AgentSpec 版本正式发布。

#### 起始版本

`3.2.0`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/publish`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentSpecName` | `string` | **是** | AgentSpec 名称。 |
| `version` | `string` | **是** | 版本号。 |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/publish' -d "namespaceId=public&agentSpecName=my-agentspec&version=1.0.0"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.12. 更新 AgentSpec 可见范围
#### 接口描述
通过该接口，可将 AgentSpec 的可见范围设置为 PUBLIC（公开）或 PRIVATE（私有）。

#### 起始版本

`3.2.0`

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/scope`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentSpecName` | `string` | **是** | AgentSpec 名称。 |
| `scope` | `string` | **是** | `PUBLIC` 或 `PRIVATE`。 |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/scope' -d "namespaceId=public&agentSpecName=my-agentspec&scope=PUBLIC"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.13. 提交 AgentSpec 版本审核
#### 接口描述
通过该接口，可将 AgentSpec 草稿版本提交至流水线进行审核。

#### 起始版本

`3.2.0`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/submit`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentSpecName` | `string` | **是** | AgentSpec 名称。 |
| `version` | `string` | 否 | 版本号。 |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/submit' -d "namespaceId=public&agentSpecName=my-agentspec&version=1.0.0"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.14. 上传 AgentSpec
#### 接口描述
通过该接口，可上传 ZIP 格式的 AgentSpec 包，自动解析并创建或更新 AgentSpec。

#### 起始版本

`3.2.0`

#### 请求方式

`POST`

请求体类型：`multipart/form-data`，参数放在请求体中。

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/upload`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `overwrite` | `boolean` | 否 | 是否覆盖同名资源。 |
| `file` | `file` | **是** | 包含 AgentSpec 内容的 ZIP 包文件。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/upload' -F "file=@agentspec.zip" -F "namespaceId=public" -F "overwrite=false"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.15. 查询 AgentSpec 版本
#### 接口描述
通过该接口，可按命名空间、名称和版本号查询指定版本的 AgentSpec 详情。

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/version`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentSpecName` | `string` | **是** | AgentSpec 名称。 |
| `version` | `string` | 否 | 版本号。 |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data.namespaceId | `string` | - |
| data.data.name | `string` | - |
| data.data.description | `string` | - |
| data.data.bizTags | `string` | - |
| data.data.content | `string` | - |
| data.data.resource | `map<string, AgentSpecResource>` | AgentSpec 资源映射。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/version?namespaceId=public&agentSpecName=my-agentspec&version=1.0.0'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.16. 强制发布 AgentSpec 版本

#### 接口描述

通过该接口，可绕过流水线校验强制发布 AgentSpec 版本。

#### 起始版本

`3.2.1`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/force-publish`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentSpecName` | `string` | **是** | AgentSpec 名称。 |
| `version` | `string` | **是** | 版本号。 |

### 8.17. 重新编辑 AgentSpec 版本

#### 接口描述

通过该接口，可将已评审的 AgentSpec 版本重新转为草稿。

#### 起始版本

`3.2.2`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/redraft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentSpecName` | `string` | **是** | AgentSpec 名称。 |
| `version` | `string` | **是** | 版本号。 |

### 8.18. 查询 AgentSpec 版本元数据

#### 接口描述

通过该接口，可查询指定 AgentSpec 版本的元数据，不读取资源文件内容。

#### 起始版本

`3.2.1`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/version/meta`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentSpecName` | `string` | **是** | AgentSpec 名称。 |
| `version` | `string` | 否 | 版本号。 |

## 9. Pipeline 执行记录

### 9.1. 查询 Pipeline 执行记录列表

#### 接口描述

通过该接口，可按资源类型、资源名称、命名空间和版本分页查询 Pipeline 执行记录。

#### 起始版本

`3.2.1`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/pipelines`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `resourceType` | `string` | **是** | 资源类型 |
| `resourceName` | `string` | 否 | 资源名称 |
| `namespaceId` | `string` | 否 | 命名空间 |
| `version` | `string` | 否 | 资源版本 |
| `pageNo` | `integer` | 否 | 页码，默认为 `1`，必须为正整数。 |
| `pageSize` | `integer` | 否 | 每页条数，默认为 `100`，必须为正整数。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `Page<PipelineExecution>` | Pipeline 执行记录分页。 |
| `data.totalCount` | `integer` | 匹配的执行记录总数。 |
| `data.pageNumber` | `integer` | 当前页码。 |
| `data.pagesAvailable` | `integer` | 可用页数。 |
| `data.pageItems` | `array<PipelineExecution>` | 当前页的执行记录。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/pipelines?resourceType=agentspec&resourceName=my-agentspec&namespaceId=public&version=1.0.0&pageNo=1&pageSize=20'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 9.2. 查询 Pipeline 执行记录详情

#### 接口描述

通过该接口，可按 Pipeline ID 查询 Pipeline 执行记录详情。

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/pipelines/{pipelineId}`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pipelineId` | `string` | **是** | Pipeline 标识。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `PipelineExecution` | Pipeline 执行详情。 |
| data.executionId | `string` | Pipeline 执行标识。 |
| data.resourceType | `string` | 资源类型。 |
| data.resourceName | `string` | 资源名称。 |
| data.namespaceId | `string` | 命名空间。 |
| data.version | `string` | 资源版本。 |
| data.status | `string` | 执行状态。 |
| data.pipeline | `array<PipelineNodeResult>` | Pipeline 阶段信息。 |
| data.createTime | `integer` | 创建时间。 |
| data.updateTime | `integer` | 更新时间。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/pipelines/pipeline-001'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 9.3. 查询 Pipeline 执行记录列表

#### 接口描述

通过该接口，可按资源类型、资源名称、命名空间和版本分页查询 Pipeline 执行记录。

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/pipelines/list`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `resourceType` | `string` | **是** | 资源类型 |
| `resourceName` | `string` | 否 | 资源名称 |
| `namespaceId` | `string` | 否 | 命名空间 |
| `version` | `string` | 否 | 资源版本 |
| `pageNo` | `integer` | 否 | 页码，默认为 `1`，必须为正整数。 |
| `pageSize` | `integer` | 否 | 每页条数，默认为 `100`，必须为正整数。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `Page<PipelineExecution>` | Pipeline 执行记录分页。 |
| `data.totalCount` | `integer` | 匹配的执行记录总数。 |
| `data.pageNumber` | `integer` | 当前页码。 |
| `data.pagesAvailable` | `integer` | 可用页数。 |
| `data.pageItems` | `array<PipelineExecution>` | 当前页的执行记录。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/pipelines/list?resourceType=agentspec&resourceName=my-agentspec&namespaceId=public&version=1.0.0&pageNo=1&pageSize=20'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 9.4. 查询 Pipeline 执行记录详情

#### 接口描述

通过该接口，可按 Pipeline ID 查询 Pipeline 执行记录详情。

#### 起始版本

`3.2.1`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/pipelines/detail`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pipelineId` | `string` | **是** | Pipeline 标识。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `PipelineExecution` | Pipeline 执行详情。 |
| data.executionId | `string` | Pipeline 执行标识。 |
| data.resourceType | `string` | 资源类型。 |
| data.resourceName | `string` | 资源名称。 |
| data.namespaceId | `string` | 命名空间。 |
| data.version | `string` | 资源版本。 |
| data.status | `string` | 执行状态。 |
| data.pipeline | `array<PipelineNodeResult>` | Pipeline 阶段信息。 |
| data.createTime | `integer` | 创建时间。 |
| data.updateTime | `integer` | 更新时间。 |

#### 示例

* 请求示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/pipelines/detail?pipelineId=pipeline-001'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

## 10. AI 资源导入

这些 API 只使用统一插件管理中已启用的固定来源。请求和响应的 `sourceId` 等于 managed `pluginName`：`mcp-official`、`mcp-registry-protocol`、`skills-sh` 或 `skills-well-known`。来源描述中的历史字段 `pluginName` 仍表示 importerType（例如 `mcp-registry`），不能把它当作 `sourceId`。同一个实现不能再通过纯配置复制成多个 endpoint。

### 10.1. 查询 AI 资源导入源

#### 接口描述

查询当前已加载且启用的固定 AI 资源导入来源。来源详情与标准 definitions 由 `ai-resource-import:{sourceId}` 管理。

#### 起始版本

`3.2.2`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/import/sources`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `resourceType` | `string` | 否 | 资源类型 |

### 10.2. 搜索外部 AI 资源

#### 接口描述

通过该接口，可从指定导入源搜索可导入的外部 AI 资源。

#### 起始版本

`3.2.2`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/import/search`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `resourceType` | `string` | **是** | 资源类型 |
| `sourceId` | `string` | **是** | 导入源标识 |
| `query` | `string` | 否 | 搜索关键词 |
| `cursor` | `string` | 否 | 分页游标 |
| `limit` | `integer` | 否 | 返回数量限制 |
| `options` | `string` | 否 | 扩展选项 JSON 字符串 |

### 10.3. 校验 AI 资源导入项

#### 接口描述

通过该接口，可校验选中的外部 AI 资源是否可导入。

#### 起始版本

`3.2.2`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/import/validate`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `resourceType` | `string` | **是** | 资源类型 |
| `sourceId` | `string` | **是** | 导入源标识 |
| `selectedItems` | `string` | **是** | 待校验的资源项 JSON 字符串 |
| `overwriteExisting` | `boolean` | 否 | 是否覆盖已有资源 |
| `options` | `string` | 否 | 扩展选项 JSON 字符串 |

### 10.4. 执行 AI 资源导入

#### 接口描述

通过该接口，可导入选中的外部 AI 资源。

#### 起始版本

`3.2.2`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/import/execute`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 |
| `resourceType` | `string` | **是** | 资源类型 |
| `sourceId` | `string` | **是** | 导入源标识 |
| `selectedItems` | `string` | **是** | 待导入的资源项 JSON 字符串 |
| `overwriteExisting` | `boolean` | 否 | 是否覆盖已有资源 |
| `skipInvalid` | `boolean` | 否 | 是否跳过无效资源项 |
| `validationToken` | `string` | 否 | 校验令牌 |
| `options` | `string` | 否 | 扩展选项 JSON 字符串 |

## 11. Agent 管理

本章接口管理 Nacos AI Registry 中协议无关的 Agent 定义、版本生命周期和运行时端点。复合值保留 Agent 管理模型中的命名类型；其中 `AgentVersionDetail` 指本章的协议无关 Agent 版本模型，不是旧 A2A API 中的同名模型。

这套 Agent 管理 API 是后续推荐的统一集成方向，未来将逐步替代现有 A2A 管理 API。新接入的用户和 SDK 应优先对接并兼容 Agent 管理 API，避免为新集成继续依赖旧 A2A API；已有 A2A 集成可依据后续版本发布和迁移说明逐步切换。这里描述的是管理 API 的演进，不表示 A2A 协议本身已废弃。

| 类型 | 关键结构 |
|------|----------|
| `AgentOverview` | `agent: AgentSummary`、`versionPage: Page<AgentVersionSummary>` |
| `AgentSummary` | Agent 名称、展示信息、`namespaceId`、`status`、`owner`、`scope`、`provider: AgentProvider`、`tags: array<string>`、`extensions: map<string, object>`、`versionInfo: AgentVersionInfo`、`metaVersion`、`createTime`、`updateTime` |
| `AgentProvider` | `name`、`url` |
| `AgentVersionInfo` | `editingVersion`、`reviewingVersion`、`onlineVersions: array<AgentVersionSummary>`、`labels: map<string, string>`；默认版本读取 `labels.latest` |
| `AgentCallInterface` | `protocol`、`protocolVersion`、`descriptorMediaType`、`nativeDescriptor: object`、`endpointSourceOrder: array<string>`、`endpointSets: array<EndpointSet>` |
| `EndpointSet` | `source`（`DECLARED` 或 `RUNTIME`）、`sourceRevision`、`lastUpdatedTime`、`endpoints: array<Endpoint>` |
| `Endpoint` | `uri`、`transport`、`priority`、`weight`、`metadata: map<string, string>`、`enabled`、`healthy`、`bindings: array<RuntimeVersionBinding>` |
| `AgentVersionDetail` | 包含 `AgentVersionSummary` 的字段，以及 `namespaceId`、`agentName`、`callInterfaces: array<AgentCallInterface>` |
| `AgentVersionSummary` | `version`、`status`、`publishPipelineInfo`、`author`、`changeDescription`、`contentDigest`、`labels: array<string>`、`protocols: array<string>`、`createTime`、`updateTime` |
| `RuntimeEndpointSnapshot` | `namespaceId`、`agentName`、`version`、`callInterface: AgentCallInterface`；运行端点位于 `callInterface.endpointSets[].endpoints[]` |
| `RuntimeVersionBinding` | `runtimeVersion`、`versionRange` |

版本状态转换见 [AI 资源生命周期](../user/ai/ai-resource-lifecycle.md)。新资源在内置可见性策略下默认为 `PUBLIC`，可通过本章的可见范围接口调整；更新元数据或版本不会重置已有可见范围。

### 11.1. 获取 Agent 概览

#### 接口描述

获取 Agent 定义及其首个有界版本摘要分页。

#### 起始版本

`3.3.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agents`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentName` | `string` | **是** | Agent 名称。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `AgentOverview` | Agent 定义及版本摘要分页。 |

#### 示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/agents?namespaceId=public&agentName=my-agent'
```

### 11.2. 更新 Agent 元数据

#### 接口描述

替换 Agent 可写的展示信息、目录信息和资源状态元数据。该操作只更新 Agent 元数据，不修改版本内容、owner 或 scope。

#### 起始版本

`3.3.0`

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agents`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `displayName` | `string` | 否 | Agent 展示名称。 |
| `description` | `string` | 否 | Agent 描述。 |
| `iconUrl` | `string` | 否 | Agent 图标 URL。 |
| `provider` | `string` | 否 | `AgentProvider` JSON 对象字符串，字段为 `name` 和 `url`。 |
| `tags` | `string` | 否 | `array<string>` 格式的 Agent 标签 JSON 字符串。 |
| `extensions` | `string` | 否 | Agent 扩展属性 JSON 对象字符串。 |
| `status` | `string` | **是** | Agent 资源状态：`enable` 或 `disable`。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `AgentSummary` | 更新后的 Agent 元数据及版本摘要。 |

#### 示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/agents' \
  -d 'namespaceId=public' -d 'agentName=my-agent' -d 'displayName=My Agent' \
  --data-urlencode 'provider={"name":"Nacos","url":"https://nacos.io"}' \
  --data-urlencode 'tags=["production"]' -d 'status=enable'
```

### 11.3. 删除 Agent

#### 接口描述

删除 Agent 定义及其全部版本内容。由独立发布者持有的运行时端点不会随定义一起删除。

#### 起始版本

`3.3.0`

#### 请求方式

`DELETE`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agents`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentName` | `string` | **是** | Agent 名称。 |

#### 返回数据

统一返回体中的 `data` 为 `null`。

#### 示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ai/agents?namespaceId=public&agentName=my-agent'
```

### 11.4. 更新 Agent 标签

#### 接口描述

替换 Agent 自定义版本标签，并保留由服务管理的 `latest` 标签。每个标签值都必须是一个精确版本。

#### 起始版本

`3.3.0`

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agents/labels`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `labels` | `string` | **是** | `map<string, string>` 格式的标签到精确版本映射；不能写入保留标签 `latest`。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `AgentSummary` | 更新标签后的 Agent 元数据及版本摘要。 |

#### 示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/agents/labels' \
  -d 'namespaceId=public' -d 'agentName=my-agent' --data-urlencode 'labels={"stable":"1.0.0"}'
```

### 11.5. 更新 Agent 草稿

#### 接口描述

替换指定 Agent 当前精确草稿版本的调用接口内容和变更说明。该操作不会创建缺失的 Agent 或版本，也不会修改 Agent 元数据。

#### 起始版本

`3.3.0`

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agents/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `version` | `string` | **是** | 草稿版本。 |
| `callInterfaces` | `string` | **是** | `array<AgentCallInterface>` 的 JSON 字符串。 |
| `changeDescription` | `string` | 否 | 本次修改说明。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `AgentVersionDetail` | 更新后的 Agent 草稿版本详情。 |

#### 示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/agents/draft' \
  -d 'namespaceId=public' -d 'agentName=my-agent' -d 'version=1.0.0' \
  --data-urlencode 'callInterfaces=[{"protocol":"a2a","protocolVersion":"1.0","descriptorMediaType":"application/json","nativeDescriptor":{"name":"my-agent","version":"1.0.0"},"endpointSourceOrder":["RUNTIME"]}]' \
  -d 'changeDescription=Update endpoint'
```

### 11.6. 创建 Agent 草稿

#### 接口描述

创建新的 Agent 草稿；这是首次创建 Agent 定义的唯一入口。请求必须在直接 `callInterfaces` 内容和 `basedOnVersion` 之间二选一；Agent 尚不存在时必须提供 `callInterfaces`，并可在同一请求中初始化展示元数据。

#### 起始版本

`3.3.0`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agents/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `version` | `string` | **是** | 新草稿版本。 |
| `displayName` | `string` | 否 | Agent 展示名称。 |
| `description` | `string` | 否 | Agent 描述。 |
| `iconUrl` | `string` | 否 | Agent 图标 URL。 |
| `provider` | `string` | 否 | 首次创建时使用的 `AgentProvider` JSON 对象字符串，字段为 `name` 和 `url`。 |
| `tags` | `string` | 否 | 首次创建时使用的 `array<string>` 标签 JSON 字符串。 |
| `extensions` | `string` | 否 | Agent 扩展属性 JSON 对象字符串。 |
| `callInterfaces` | `string` | 否 | `array<AgentCallInterface>` 的 JSON 字符串；与 `basedOnVersion` 二选一，首次创建 Agent 时必须提供。 |
| `author` | `string` | 否 | 版本作者。 |
| `changeDescription` | `string` | 否 | 版本变更说明。 |
| `basedOnVersion` | `string` | 否 | 作为草稿基础的精确已有版本；与 `callInterfaces` 二选一，仅适用于已有 Agent。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `AgentVersionDetail` | 新建的 Agent 草稿版本详情。 |

#### 示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agents/draft' \
  -d 'namespaceId=public' -d 'agentName=my-agent' -d 'version=1.0.0' \
  -d 'displayName=My Agent' -d 'author=nacos' -d 'changeDescription=Initial version' \
  --data-urlencode 'provider={"name":"Nacos","url":"https://nacos.io"}' \
  --data-urlencode 'tags=["production"]' \
  --data-urlencode 'callInterfaces=[{"protocol":"a2a","protocolVersion":"1.0","descriptorMediaType":"application/json","nativeDescriptor":{"name":"my-agent","version":"1.0.0"},"endpointSourceOrder":["RUNTIME"]}]'
```

### 11.7. 删除 Agent 草稿

#### 接口描述

删除指定 Agent 的当前草稿版本。

#### 起始版本

`3.3.0`

#### 请求方式

`DELETE`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agents/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `version` | `string` | **是** | 草稿版本。 |

#### 返回数据

统一返回体中的 `data` 为 `null`。

#### 示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ai/agents/draft?namespaceId=public&agentName=my-agent&version=1.0.0'
```

### 11.8. 提交 Agent 草稿

#### 接口描述

提交指定 Agent 草稿版本进入评审。

#### 起始版本

`3.3.0`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agents/submit`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `version` | `string` | **是** | 待提交版本。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `AgentVersionSummary` | 提交后的版本摘要。 |

#### 示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agents/submit' -d 'namespaceId=public&agentName=my-agent&version=1.0.0'
```

### 11.9. 重新草稿化 Agent 版本

#### 接口描述

将指定的已评审 Agent 版本退回草稿状态。

#### 起始版本

`3.3.0`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agents/redraft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `version` | `string` | **是** | 待退回版本。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `AgentVersionSummary` | 重新草稿化后的版本摘要。 |

#### 示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agents/redraft' -d 'namespaceId=public&agentName=my-agent&version=1.0.0'
```

### 11.10. 发布 Agent 版本

#### 接口描述

发布指定的已评审 Agent 版本。

#### 起始版本

`3.3.0`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agents/publish`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `version` | `string` | **是** | 待发布版本。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `AgentVersionSummary` | 发布后的版本摘要。 |

#### 示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agents/publish' -d 'namespaceId=public&agentName=my-agent&version=1.0.0'
```

### 11.11. 上线 Agent 版本

#### 接口描述

将指定的离线 Agent 版本上线。

#### 起始版本

`3.3.0`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agents/online`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `version` | `string` | **是** | 待上线版本。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `AgentVersionSummary` | 上线后的版本摘要。 |

#### 示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agents/online' -d 'namespaceId=public&agentName=my-agent&version=1.0.0'
```

### 11.12. 下线 Agent 版本

#### 接口描述

将指定的在线 Agent 版本下线。

#### 起始版本

`3.3.0`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agents/offline`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `version` | `string` | **是** | 待下线版本。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `AgentVersionSummary` | 下线后的版本摘要。 |

#### 示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agents/offline' -d 'namespaceId=public&agentName=my-agent&version=1.0.0'
```

### 11.13. 强制发布 Agent 版本

#### 接口描述

绕过常规评审完成条件，强制发布指定的工作中 Agent 版本。

#### 起始版本

`3.3.0`

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agents/force-publish`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `version` | `string` | **是** | 待强制发布版本。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `AgentVersionSummary` | 强制发布后的版本摘要。 |

#### 示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agents/force-publish' -d 'namespaceId=public&agentName=my-agent&version=1.0.0'
```

### 11.14. 查询 Agent 版本列表

#### 接口描述

按可选状态和分页参数查询指定 Agent 的版本摘要。

#### 起始版本

`3.3.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agents/versions`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `status` | `string` | 否 | 版本状态过滤条件：`draft`、`reviewing`、`reviewed`、`online` 或 `offline`。 |
| `pageNo` | `integer` | 否 | 页码，默认为 `1`，必须为正整数。 |
| `pageSize` | `integer` | 否 | 每页条数，默认为 `100`，必须为正整数。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `Page<AgentVersionSummary>` | Agent 版本摘要分页。 |

#### 示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/agents/versions?namespaceId=public&agentName=my-agent&status=online&pageNo=1&pageSize=20'
```

### 11.15. 获取 Agent 版本

#### 接口描述

获取指定 Agent 精确版本的完整定义。

#### 起始版本

`3.3.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agents/version`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `version` | `string` | **是** | Agent 版本。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `AgentVersionDetail` | Agent 版本详情。 |

#### 示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/agents/version?namespaceId=public&agentName=my-agent&version=1.0.0'
```

### 11.16. 获取 Agent 运行时端点

#### 接口描述

获取指定 Agent 协议的完整运行时端点快照。省略 `version` 时，每个端点返回全部版本绑定；指定精确版本时只保留匹配的绑定。该快照不分页，没有实例时返回空 `items`。

#### 起始版本

`3.3.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agents/runtime-endpoints`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `protocol` | `string` | **是** | 协议标识，例如 `a2a`。 |
| `version` | `string` | 否 | 用于过滤运行时绑定的精确 Agent 版本；省略时返回全部版本绑定。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `RuntimeEndpointSnapshot` | 当前运行时端点快照。 |

#### 示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/agents/runtime-endpoints?namespaceId=public&agentName=my-agent&protocol=a2a&version=1.0.0'
```

### 11.17. 查询 Agent 列表

#### 接口描述

按资源条件、排序方式和分页参数查询 Agent 摘要。

#### 起始版本

`3.3.0`

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agents/list`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认 `public`。 |
| `agentName` | `string` | 否 | Agent 名称模糊过滤条件。 |
| `orderBy` | `string` | 否 | 排序字段；当前仅支持 `download_count`。 |
| `bizTag` | `string` | 否 | 单个业务标签模糊过滤条件。 |
| `scope` | `string` | 否 | 可见范围过滤条件。 |
| `owner` | `string` | 否 | 所有者过滤条件。 |
| `pageNo` | `integer` | 否 | 页码，默认为 `1`，必须为正整数。 |
| `pageSize` | `integer` | 否 | 每页条数，默认为 `100`，必须为正整数。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `Page<AgentSummary>` | Agent 摘要分页。 |

#### 示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/agents/list?namespaceId=public&agentName=my-agent&orderBy=download_count&scope=PUBLIC&owner=nacos&pageNo=1&pageSize=20'
```

### 11.18. 更新 Agent 可见范围

#### 接口描述

将 Agent 可见范围设置为 `PUBLIC` 或 `PRIVATE`，不改变版本、标签、所有者或运行端点。`PUBLIC` 不表示关闭接口鉴权。

#### 起始版本

`3.3.0`

#### 请求方式

`PUT`

请求体类型：`application/x-www-form-urlencoded`。

#### 鉴权状态

需通过 Admin API 鉴权，并具备目标资源的写权限。

#### 请求URL

`/nacos/v3/admin/ai/agents/scope`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|------|------|----------|-------------|
| `namespaceId` | `string` | 否 | 命名空间 ID，默认为 `public`。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `scope` | `string` | **是** | 可见范围：`PUBLIC` 或 `PRIVATE`。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|------|------|-------------|
| `data` | `string` | 成功时为 `ok`。 |

#### 示例

```bash
curl -sS -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/agents/scope' \
  -d 'namespaceId=public' -d 'agentName=my-agent' -d 'scope=PRIVATE'
```

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```
