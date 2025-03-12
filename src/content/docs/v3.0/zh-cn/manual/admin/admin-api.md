---
title: 运维API
keywords: [ Nacos,运维API ]
description: Nacos Server的一些运维API，一般给予控制台使用或需要进行自定义Nacos运维工具开发的相关程序和人员使用。
sidebar:
  order: 5
---

# 运维API

> Nacos 3.X 版本将不再兼容1.X版本 和 2.X版本的 AdminAPI，请使用Nacos 3.X版本的AdminAPI进行替换。
>
> 若必须要使用1.X和2.X的Admin API，需要在配置文件中设置`nacos.core.auth.admin.enabled=true`开启，但此兼容也将在未来版本中移除，建议使用Nacos
> 3.X版本的AdminAPI进行替换。

Nacos默认搭载了一整套专为管理控制台和运维人员设计的运维API，赋予运维专家更多的配置权限、更广阔的数据检索能力等。这些API为Nacos的运维团队提供了方便，使他们能够高效地处理故障、排查问题，以确保系统的稳定运行。

## 0. 运维API 相关说明

### 0.1 统一返回体格式

自3.0版本开始，OpenAPI/AdminAPI/ConsoleAPI均使用相同的返回体格式。

完整的返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)
，本文档中所有的API返回数据只阐述`data`字段中的返回参数。

### 0.2 统一路径格式

Nacos的运维API，使用统一的Path格式进行的规范。格式为`[/$nacos.server.contextPath]/v3/admin/[module]/[subPath]...`,
其中

- `$nacos.server.contextPath`：运维API的根路径，默认为`/nacos`，可以通过`nacos.server.contextPath`配置项进行修改。
- `module`：运维API模块名称，例如`server`、`cs`、`ns`、`core`等。
- `subPath`：运维API的子路径，例如`state`、`namespace`、`config`等， 可能有多层子路径。

下列列出的运维API，采用默认`$nacos.server.contextPath`的情况进行展示，若已修改部署环境中的`$nacos.server.contextPath`
配置项，请自行修改调用API时的请求URL。

同时下列列出的运维API样例中，均采用默认Nacos Web Server的端口进行展示，若已修改部署环境中的`$nacos.server.main.port`
配置项，请自行修改调用API时的请求URL。

### 0.3 鉴权认证

Nacos 3.X 版本的Admin API默认需要鉴权，请在请求时使用管理员用户`nacos`（使用默认鉴权插件时）。

若想要关闭鉴权，请设置`nacos.core.auth.admin.enabled=false`，然后重启Nacos Server。

## 1. Nacos Core 运维 API

### 1.1. 获取当前节点连接

#### 接口描述

通过该接口，可以获取连接到当前Nacos Server节点中的gRPC连接详情。

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/loader/current`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                     | 参数类型         | 描述                                                                                      |
|-----------------------------------------|--------------|-----------------------------------------------------------------------------------------|
| ${connectionId}                         | `jsonString` | 每条gRPC连接的连接id                                                                           |
| ${connectionId}.abilityTable            | `jsonString` | 该gRPC连接（即客户端）支持的能力列表                                                                    |
| ${connectionId}.metaInfo.clientIp       | `String`     | 该gRPC连接的来源IP                                                                            |
| ${connectionId}.metaInfo.localPort      | `int`        | 该Nacos Server的gRPC端口                                                                    |
| ${connectionId}.metaInfo.version        | `String`     | 该gRPC连接（即客户端）的版本                                                                        |
| ${connectionId}.metaInfo.createTime     | `String`     | 该gRPC连接的连接时间                                                                            |
| ${connectionId}.metaInfo.lastActiveTime | `timestamp`  | 该gRPC连接的最后一次的心跳时间                                                                       |
| ${connectionId}.metaInfo.labels.source  | `String`     | 该gRPC连接的模块，可选值为`naming`,`config`和`cluster`分别代表注册中心、配置中心以及集群间的连接                         |
| ${connectionId}.metaInfo.clusterSource  | `boolean`    | 该gRPC连接的是否为集群间连接，为`true`时，`${connectionId}.metaInfo.labels.source`为 `cluster`           |
| ${connectionId}.metaInfo.sdkSource      | `boolean`    | 该gRPC连接的是否为客户端来源连接，为`true`时，`${connectionId}.metaInfo.labels.source`为 `naming`或`config` |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/loader/current'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/loader/reloadCurrent`

#### 请求参数

| 参数名               | 类型        | 必填    | 参数描述                           |
|-------------------|-----------|-------|--------------------------------|
| `count`           | `Integer` | **是** | 需要均衡的连接个数                      |
| `redirectAddress` | `String`  | 否     | 预期均衡的Nacos Server目标，仅提供给客户端参考。 |

#### 返回数据

成功则返回`success`，失败则返回[Nacos open API 统一返回体格式](#01-统一返回体格式)

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/loader/reloadCurrent?count=100'
```

* 返回示例

```text
success
```

### 1.3. 均衡指定的单个连接

#### 接口描述

通过该接口，可以将指定的客户端连接(gRPC连接)迁移到其他Nacos Server节点中。

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/loader/reloadClient`

#### 请求参数

| 参数名               | 类型       | 必填    | 参数描述                 |
|-------------------|----------|-------|----------------------|
| `connectionId`    | `String` | **是** | 需要均衡的连接Id            |
| `redirectAddress` | `String` | 否     | 预期均衡的Nacos Server目标。 |

#### 返回数据

成功则返回`success`，失败则返回[Nacos open API 统一返回体格式](#01-统一返回体格式)

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/loader/reloadClient?connectionId=1709273546779_127.0.0.1_35042'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/loader/cluster`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                           | 参数类型        | 描述                        |
|-------------------------------|-------------|---------------------------|
| `total`                       | `Integer`   | 该集群中所有节点的连接数总和            |
| `min`                         | `Integer`   | 该集群中所有节点的最小连接数            |
| `avg`                         | `Integer`   | 该集群中所有节点的平均连接数            |
| `max`                         | `Integer`   | 该集群中所有节点的最大连接数            |
| `memberCount`                 | `Integer`   | 该集群中所有节点的个数               |
| `metricsCount`                | `Integer`   | 该集群中已统计到概览信息的节点个数         |
| `detail`                      | `jsonArray` | 该集群中所有节点的概览信息，格式见下表       |
| `detail[].address`            | `String`    | 节点地址                      |
| `detail[].metric.load`        | `Double`    | 节点的负载率，主要对应节点的Load指标，参考值  |
| `detail[].metric.sdkConCount` | `Integer`   | 连接到该节点的SDK连接数，主要对应客户端连接数  |
| `detail[].metric.conCount`    | `Integer`   | 连接到该节点的总连接数，包含了SDK和集群间的连接 |
| `detail[].metric.cpu`         | `Double`    | 节点的CPU使用率，参考值             |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/loader/cluster'
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

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/core/cluster/node/self`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                           | 参数类型         | 描述                                             |
|-------------------------------|--------------|------------------------------------------------|
| `ip`                          | `String`     | 节点IP                                           |
| `port`                        | `Integer`    | 节点端口                                           |
| `state`                       | `String`     | 节点状态，可选值为`UP`、`DOWN`、`SUSPICIOUS`              |
| `extendInfo`                  | `jsonObject` | 节点扩展信息，具体字段见下表                                 |
| `extendInfo.lastRefreshTime`  | `Long`       | 节点上一次更新时间戳，单位毫秒                                |
| `extendInfo.raftMetaData`     | `jsonObject` | 节点的Raft元数据， 包含每个Raft Group的`leader`， `term`等字段 |
| `extendInfo.raftPort`         | `Integer`    | 节点的Raft端口                                      |
| `extendInfo.supportGrayModel` | `Boolean`    | 是否支持灰度模型                                       |
| `extendInfo.version`          | `String`     | 节点的版本                                          |
| `address`                     | `String`     | 节点地址，格式为`ip:port`                              |
| `failAccessCnt`               | `Integer`    | 探测失败的次数，及report失败的次数，超过一定次数`state`会被改为`DOWN`   |
| `abilities`                   | `jsonObject` | 该节点所支持的能力                                      |
| `grpcReportEnabled`           | `Boolean`    | 标记节点是否支持grpc上报心跳能力，用于适配老版本升级，后续将移除             |
| ~~extendInfo.readyToUpgrade~~ | `Boolean`    | 是否ready升级到Nacos2.0，于2.2版本后废弃，即将移除              |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/cluster/node/self'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/cluster/node/list`

#### 请求参数

| 参数名       | 类型       | 必填 | 参数描述                                              |
|-----------|----------|----|---------------------------------------------------|
| `address` | `String` | 否  | 过滤的节点地址，支持前缀匹配，不输入时返回所有节点信息                       |
| `state`   | `String` | 否  | 返回的节点状态，可选值为`UP`、`DOWN`、`SUSPICIOUS`，不输入时返回所有节点信息 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，`data`字段为[获取本节点信息](#返回数据-4)的返回数据的列表。

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/cluster/node/list'
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
    },
    {
      "ip": "nacos-node-2",
      "port": 8848,
      "state": "UP",
      "extendInfo": {
        "lastRefreshTime": 1710813796567,
        "raftMetaData": {
          ....
        },
        ....
      },
      ....
    },
    {
      "ip": "nacos-node-1",
      "port": 8848,
      "state": "UP",
      "extendInfo": {
        "lastRefreshTime": 1710813796567,
        "raftMetaData": {
          ....
        },
        ....
      },
      ....
    }
  ]
}
```

### 1.7. 快速查询本节点健康状态

#### 接口描述

通过该接口，可以快速查询本节点健康状态。

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/cluster/node/self/health`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)。

| 参数名    | 参数类型     | 描述                                             |
|--------|----------|------------------------------------------------|
| `data` | `String` | `UP`表示节点健康，`DOWN`表示节点不健康，`SUSPICIOUS`表示节点疑似不健康 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/cluster/node/self/health'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "UP"
}
```

### 1.8. 动态修改Server集群地址发现方式

#### 接口描述

通过该接口，可以在不重启Nacos Server的情况下，动态切换Nacos Server集群地址发现的方式，目前支持两种方式：`file`
和`address-server`。

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/cluster/lookup`

#### 请求参数

| 参数名    | 类型       | 必填 | 参数描述                                  |
|--------|----------|----|---------------------------------------|
| `type` | `String` | 是  | 切换到地址发现方式，可选值为`file`和`address-server` |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)。

| 参数名    | 参数类型      | 描述                          |
|--------|-----------|-----------------------------|
| `data` | `Boolean` | `true`表示更新成功，`false`表示更新失败。 |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/core/cluster/lookup?type=file'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 1.9. Raft 相关操作

#### 接口描述

通过该接口，可以对Nacos Server集群中的Raft协议进行部分运维操作，如执行快照，主动选主等。

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/ops/raft`

#### 请求参数

该API需要以Json的方式，将请求参数放在请求体中，请求体格式如下：

| 参数名       | 类型       | 必填    | 参数描述                                 |
|-----------|----------|-------|--------------------------------------|
| `command` | `String` | **是** | Raft运维操作指令，具体的命令请参考下表。               |
| `value`   | `String` | **是** | 命令的参数，具体的命令内容请参考下表。                  |
| `groupId` | `String` | 否     | Raft集群的groupId，如果不输入则对所有Raft Group生效 |

| command           | value                                                                         | 说明                                       |
|-------------------|-------------------------------------------------------------------------------|------------------------------------------|
| `doSnapshot`      | `${nacos-server-address}:${raft-port}`                                        | 执行快照，参数为要执行快照的节点地址。                      |
| `transferLeader`  | `${nacos-server-address}:${raft-port}`                                        | 主动选主，参数为要期望的Leader的节点地址。                 |
| `restRaftCluster` | `${nacos-server-address}:${raft-port}[,${nacos-server-address}:${raft-port}]` | 重置集群状态，参数为要重置节点地址列表，','分割。               |
| `removePeer`      | `${nacos-server-address}:${raft-port}`                                        | 移除Raft Member节点，参数为要移除的节点地址。             |
| `removePeers`     | `${nacos-server-address}:${raft-port}[,${nacos-server-address}:${raft-port}]` | 批量移除Raft Member节点，参数为要批量移除的节点地址列表，','分割。 |
| `changePeers`     | `${nacos-server-address}:${raft-port}[,${nacos-server-address}:${raft-port}]` | 修改Raft Member节点，参数为要修改后的节点地址列表，','分割。    |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)。

| 参数名    | 参数类型     | 描述         |
|--------|----------|------------|
| `data` | `String` | 固定为`null`。 |

#### 示例

* 请求示例

```shell
curl -X POST -H 'Content-Type:application/json' 'http://127.0.0.1:8848/nacos/v3/admin/core/ops/raft' -d '{"command":"doSnapshot","value":"nacos-node-0:7848"}'
```

* 返回示例

```json
{
  "code": 0,
  "message": null,
  "data": null
}
```

### 1.10. 动态修改Nacos Core相关日志级别

#### 接口描述

通过该接口，可以在不重启Nacos Server的情况下，动态修改Nacos Core相关日志级别的配置。

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/ops/log`

#### 请求参数

该API需要以Json的方式，将请求参数放在请求体中，请求体格式如下：

| 参数名        | 类型       | 必填    | 参数描述                                                         |
|------------|----------|-------|--------------------------------------------------------------|
| `logName`  | `String` | **是** | 具体的日志文件的名称，具体支持的日志名称见下表。                                     |
| `logLevel` | `String` | **是** | 日志的级别，可选值为`ALL`、`TRACE`、`DEBUG`、`INFO`、`WARN`、`ERROR`、`OFF`。 |

| logName        | 对应的具体日志文件             |
|----------------|-----------------------|
| `core-auth`    | `core-auth.log`       |
| `core-raft`    | `protocol-raft.log`   |
| `core-distro`  | `protocol-distro.log` |
| `core-cluster` | `nacos-cluster.log`   |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)。

| 参数名    | 参数类型     | 描述         |
|--------|----------|------------|
| `data` | `String` | 固定为`null`。 |

#### 示例

* 请求示例

```shell
curl -X PUT -H 'Content-Type:application/json' 'http://127.0.0.1:8848/nacos/v3/admin/core/ops/log' -d '{"logName":"core-distro","logLevel":"DEBUG"}'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 1.11 自动均衡指定数量的连接

#### 接口描述

通过该接口，可以根据负载因子(loaderFactor)自动均衡整个集群的客户端连接。

自动均衡逻辑：

1. 根据整个集群的客户端连接数和Nacos Server节点数量计算平均连接数`avg`、节点连接数下限阈值`lowLimitCount`(=avg * (
   1-loaderFactor))、节点连接数上限阈值`overLimitCount`(=avg * (1+loaderFactor))
2. 将高负载节点的部分客户端连接重定向到低负载节点。

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/loader/smartReloadCluster`

#### 请求参数

| 参数名            | 类型       | 必填 | 参数描述         |
|----------------|----------|----|--------------|
| `loaderFactor` | `String` | 否  | 负载因子，必须是一个数字 |

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
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/loader/smartReloadCluster?loaderFactor=1.2'
```

* 返回示例

```text
success
```

### 1.12 获取ID生成器信息

#### 接口描述

通过该接口，获取ID生成器的当前ID,workerId. 只有使用内置数据库时该接口才会返回有效数据.

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/ops/ids`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)。

| 参数名              | 参数类型     | 描述       |
|------------------|----------|----------|
| `resource`       | `String` | 生产器名称    |
| `info`           | `Object` | 生产器详情    |
| `info.currentId` | `int64`  | 当前ID     |
| `info.workerId`  | `int64`  | workerID |

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
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/ops/ids'
```

* 返回示例

```text
success
```

## 2. Nacos Naming 运维 API

### 2.1. 查看Naming模块的相关开关

#### 接口描述

通过该接口，可以查看Nacos Naming模块的相关开关。

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/ops/switches`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                      | 参数类型      | 描述                                                                                                      |
|--------------------------|-----------|---------------------------------------------------------------------------------------------------------|
| `clientBeatInterval`     | `int`     | Nacos1.X客户端的默认心跳间隔                                                                                      |
| `defaultCacheMillis`     | `int`     | 客户端订阅的服务列表的默认缓存时间                                                                                       |
| `defaultPushCacheMillis` | `int`     | 推送的服务列表的默认缓存时间，优先级高于`defaultCacheMillis`                                                                |
| `distroEnabled`          | `boolean` | 是否开启`Distro`协议同步，仅当集群压力过大，影响到集群稳定性时，临时修改为`false`缓解，改为`false`后可能导致部分数据不一致，需要尽快恢复                         |
| `healthCheckEnabled`     | `boolean` | 是否开启健康检查，仅当集群压力过大，影响到集群稳定性时，临时修改为`false`缓解，改为`false`后不会因为心跳过期，tcp/http探测超时而修改实例的健康状态，以及不会因过期删除实例，需要尽快恢复 |
| `lightBeatEnabled`       | `boolean` | 是否开启轻量心跳，针对Nacos`1.2.X~1.4.X版本`客户端生效，修改为`false`后，`Nacos1.2.X~1.4.X`版本客户端将使用全量心跳进行续约                     |
| `pushEnabled`            | `boolean` | 是否开启推送功能，仅当集群压力过大，影响到集群稳定性时，临时修改为`false`，改为`false`后，Nacos客户端将不再收到服务端的主动推送                               |
| `push${Language}Version` | `String`  | 可支持推送的最小客户端版本，当不希望针对小于某些版本进行数据推送时，可以修改该值，比如修改pushJavaVersion为`2.0.0`，则小于2.0.0的Java客户端将不会收到推送数据          |
| `${type}HealthParams`    | `json`    | 健康检查参数，设置健康检查的最大/最小间隔，随机间隔系数等，健康检查时将根据这几个值进行下一次健康检查流量的打散。                                               |

> 注意： 其余未列出的参数，均为Nacos旧版本的开关或配置内容，已废弃或即将废弃，请谨慎使用。

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/ops/switches' 
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

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/ops/switches`

#### 请求参数

| 参数名     | 类型        | 必填    | 参数描述                                              |
|---------|-----------|-------|---------------------------------------------------|
| `entry` | `String`  | **是** | 修改的开关或配置名称                                        |
| `value` | `Object`  | **是** | 开关或配置的新值，不同的开关或配置的类型不同，具体请参考[开关和配置参数](#返回数据-10)   |
| `debug` | `boolean` | 否     | 是否开启调试模式，开启后，修改的配置不会同步到集群其他节点中，仅在本节点生效，默认为`false` |

#### 返回数据

| 参数名    | 参数类型     | 描述      |
|--------|----------|---------|
| `data` | `String` | 成功为`ok` |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ns/ops/switches?entry=pushEnabled&value=false'
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

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                           | 参数类型     | 描述说明    |
|-------------------------------|----------|---------|
| `status`                      | `String` | 系统状态    |
| `serviceCount`                | `int`    | 服务数量    |
| `instanceCount`               | `int`    | 实例数量    |
| `subscribeCount`              | `int`    | 订阅数量    |
| `clientCount`                 | `int`    | 客户端数量   |
| `connectionBasedClientCount`  | `int`    | 连接数量    |
| `ephemeralIpPortClientCount`  | `int`    | 临时客户端数量 |
| `persistentIpPortClientCount` | `int`    | 持久客户端数量 |
| `responsibleClientCount`      | `int`    | 响应客户端数  |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/ops/metrics?onlyStatus=false'
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

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/ops/log`

#### 请求参数

| 参数名        | 类型       | 必填    | 参数描述      |
|------------|----------|-------|-----------|
| `logName`  | `String` | **是** | 需要修改的日志名称 |
| `logLevel` | `String` | **是** | 日志级别的新值   |

#### 返回数据

| 参数名    | 参数类型     | 描述      |
|--------|----------|---------|
| `data` | `String` | 成功为`ok` |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ns/ops/log?logName=com.example.Logger&logLevel=DEBUG'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/client/list`

#### 请求参数

无

#### 返回数据

| 参数名    | 参数类型           | 描述      |
|--------|----------------|---------|
| `data` | `List<String>` | 客户端ID列表 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/client/list'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/client`

#### 请求参数

| 参数名        | 参数类型     | 是否必填  | 描述    |
|------------|----------|-------|-------|
| `clientId` | `String` | **是** | 客户端ID |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名               | 参数类型      | 描述                 |
|-------------------|-----------|--------------------|
| `clientId`        | `String`  | 客户端的唯一 ID。         |
| `ephemeral`       | `boolean` | 客户端是否为临时客户端        |
| `lastUpdatedTime` | `long`    | 客户端的最后更新时间（时间戳）    |
| `clientType`      | `String`  | 客户端类型              |
| `connectType`     | `String`  | 连接类型（仅适用于 2.x 客户端） |
| `appName`         | `String`  | 客户端所属的应用名称         |
| `version`         | `String`  | 客户端的版本号            |
| `clientIp`        | `String`  | 客户端的 IP 地址         |
| `clientPort`      | `String`  | 客户端的端口号            |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/client?clientId=1741748952410_127.0.0.1_53863'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/client/publish/list`

#### 请求参数

| 参数名        | 参数类型     | 是否必填  | 描述    |
|------------|----------|-------|-------|
| `clientId` | `String` | **是** | 客户端ID |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                         | 参数类型     | 描述说明      |
|-----------------------------|----------|-----------|
| `namespaceId`               | `String` | 命名空间      |
| `groupName`                 | `String` | 分组名       |
| `serviceName`               | `String` | 服务名       |
| `publisherInfo`             | `Object` | 该服务下注册的实例 |
| `publisherInfo.ip`          | `String` | `IP`地址    |
| `publisherInfo.port`        | `int`    | 端口号       |
| `publisherInfo.clusterName` | `String` | 集群名       |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/client/publish/list?clientId=1664527081276_127.0.0.1_4400'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/client/subscribe/list`

#### 请求参数

| 参数名        | 参数类型     | 是否必填 | 描述    |
|------------|----------|------|-------|
| `clientId` | `String` | 是    | 客户端ID |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                      | 参数类型     | 描述说明  |
|--------------------------|----------|-------|
| `namespaceId`            | `String` | 命名空间  |
| `groupName`              | `String` | 分组名   |
| `serviceName`            | `String` | 服务名   |
| `subscriberInfo`         | `Object` | 订阅信息  |
| `subscriberInfo.appName` | `String` | 应用    |
| `subscriberInfo.agent`   | `String` | 客户端信息 |
| `subscriberInfo.address` | `String` | 地址    |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/client/subscribe/list?clientId=1664527081276_127.0.0.1_4400'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/client/service/publisher/list`

#### 请求参数

| 参数名           | 参数类型      | 是否必填  | 默认值               | 描述说明                     |
|---------------|-----------|-------|-------------------|--------------------------|
| `namespaceId` | `String`  | 否     | `"public"`        | 命名空间                     |
| `groupName`   | `String`  | 否     | `"DEFAULT_GROUP"` | 分组名                      |
| `serviceName` | `String`  | **是** | 无                 | 服务名                      |
| `ephemeral`   | `boolean` | 否     | `true`            | 是否为临时实例。                 |
| `ip`          | `String`  | 否     | 无                 | `IP`地址，默认为空，表示不限制`IP`地址。 |
| `port`        | `int`     | 否     | 无                 | 端口号，默认为空，表示不限制端口号。       |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名           | 参数类型     | 描述说明    |
|---------------|----------|---------|
| `clientId`    | `String` | 客户端`id` |
| `ip`          | `String` | 实例的`IP` |
| `port`        | `int`    | 实例的端口   |
| `clusterName` | `String` | 实例的集群名  |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/client/service/publisher/list?serviceName=test'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/client/service/subscriber/list`

#### 请求参数

| 参数名           | 参数类型      | 是否必填  | 默认值               | 描述说明                     |
|---------------|-----------|-------|-------------------|--------------------------|
| `namespaceId` | `String`  | 否     | `"public"`        | 命名空间                     |
| `groupName`   | `String`  | 否     | `"DEFAULT_GROUP"` | 分组名                      |
| `serviceName` | `String`  | **是** | 无                 | 服务名                      |
| `ephemeral`   | `boolean` | 否     | `true`            | 是否为临时实例。                 |
| `ip`          | `String`  | 否     | 无                 | `IP`地址，默认为空，表示不限制`IP`地址。 |
| `port`        | `int`     | 否     | 无                 | 端口号，默认为空，表示不限制端口号。       |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名        | 参数类型     | 描述说明                             |
|------------|----------|----------------------------------|
| `clientId` | `String` | 客户端`id`                          |
| `address`  | `String` | 订阅者客户端的`IP`                      |
| `agent`    | `String` | 订阅者客户端的版本                        |
| `appName`  | `String` | 订阅者客户端的应用名，`unknown`表示未配置或客户端不支持 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/client/service/subscriber/list?serviceName=service1'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/client/distro`

#### 请求参数

| 参数名    | 参数类型     | 是否必填  | 描述    |
|--------|----------|-------|-------|
| `ip`   | `String` | **是** | 客户端IP |
| `port` | `String` | **是** | 客户端端口 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                 | 参数类型     | 描述       |
|---------------------|----------|----------|
| `responsibleServer` | `String` | 负责的服务器信息 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/client/distro?ip=127.0.0.1&port=8080'
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

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/cluster`

#### 请求参数

| 参数名                     | 参数类型                  | 是否必填  | 描述                |
|-------------------------|-----------------------|-------|-------------------|
| `namespaceId`           | `String`              | 否     | 命名空间ID            |
| `serviceName`           | `String`              | **是** | 服务名称              |
| `clusterName`           | `String`              | **是** | 集群名称              |
| `checkPort`             | `Integer`             | **是** | 健康检查端口            |
| `useInstancePort4Check` | `Boolean`             | **是** | 是否使用实例端口进行健康检查    |
| `healthChecker`         | `String`              | **是** | 健康检查器配置（JSON 字符串） |
| `metadata`              | `Map<String, String>` | 否     | 集群的扩展元数据，默认为`""`  |

#### 返回数据

| 参数名    | 参数类型     | 描述     |
|--------|----------|--------|
| `data` | `String` | 操作结果信息 |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ns/cluster' -d 'serviceName=test&clusterName=DEFAULT&checkPort=80&useInstancePort4Check=true&healthChecker={"type":"none"}'
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

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/health/instance`

#### 请求参数

| 参数名           | 参数类型      | 是否必填  | 描述                      |
|---------------|-----------|-------|-------------------------|
| `namespaceId` | `String`  | 否     | 命名空间ID，默认为`public`      |
| `serviceName` | `String`  | **是** | 服务名称                    |
| `groupName`   | `String`  | 否     | 分组名称，默认为`DEFAULT_GROUP` |
| `clusterName` | `String`  | 否     | 集群名称，默认`DEFAULT`        |
| `ip`          | `String`  | **是** | 实例IP                    |
| `port`        | `Integer` | **是** | 实例端口                    |
| `healthy`     | `Boolean` | **是** | 健康状态（`true` 为健康）        |

#### 返回数据

| 参数名    | 参数类型     | 描述     |
|--------|----------|--------|
| `data` | `String` | 操作结果信息 |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ns/health/instance' -d 'namespaceId=public&serviceName=service1&groupName=DEFAULT_GROUP&clusterName=cluster1&ip=127.0.0.1&port=8080&healthy=true'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/health/checkers`

#### 请求参数

无

#### 返回数据

| 参数名    | 参数类型                                 | 描述          |
|--------|--------------------------------------|-------------|
| `data` | `Map<String, AbstractHealthChecker>` | 健康检查器类型及其配置 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/health/checkers'
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

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/instance`

#### 请求参数

| 参数名           | 参数类型                  | 是否必填  | 描述                      |
|---------------|-----------------------|-------|-------------------------|
| `namespaceId` | `String`              | 否     | 命名空间ID，默认为`public`      |
| `serviceName` | `String`              | **是** | 服务名称                    |
| `groupName`   | `String`              | 否     | 分组名称，默认为`DEFAULT_GROUP` |
| `clusterName` | `String`              | 否     | 集群名称，默认为`DEFAULT`       |
| `ip`          | `String`              | **是** | 实例IP                    |
| `port`        | `Integer`             | **是** | 实例端口                    |
| `weight`      | `Double`              | 否     | 实例权重，默认为`1.0`           |
| `healthy`     | `Boolean`             | 否     | 健康状态，默认为`true`          |
| `enabled`     | `Boolean`             | 否     | 是否启用，默认为`true`          |
| `metadata`    | `Map<String, String>` | 否     | 实例元数据                   |
| `ephemeral`   | `Boolean`             | 否     | 是否临时实例                  |

#### 返回数据

| 参数名    | 参数类型     | 描述     |
|--------|----------|--------|
| `data` | `String` | 操作结果信息 |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance' \
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

#### 请求方式

`DELETE`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/instance`

#### 请求参数

| 参数名           | 参数类型      | 是否必填  | 描述                      |
|---------------|-----------|-------|-------------------------|
| `namespaceId` | `String`  | 否     | 命名空间ID，默认为`public`      |
| `serviceName` | `String`  | **是** | 服务名称                    |
| `groupName`   | `String`  | 否     | 分组名称，默认为`DEFAULT_GROUP` |
| `clusterName` | `String`  | 否     | 集群名称，默认为`DEFAULT`       |
| `ip`          | `String`  | **是** | 实例IP                    |
| `port`        | `Integer` | **是** | 实例端口                    |
| `ephemeral`   | `Boolean` | 否     | 是否临时实例                  |

#### 返回数据

| 参数名    | 参数类型     | 描述     |
|--------|----------|--------|
| `data` | `String` | 操作结果信息 |

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance?namespaceId=public&serviceName=service1&groupName=DEFAULT_GROUP&clusterName=cluster1&ip=127.0.0.1&port=8080&ephemeral=true'
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

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/instance`

#### 请求参数

| 参数名           | 参数类型                  | 是否必填  | 描述                      |
|---------------|-----------------------|-------|-------------------------|
| `namespaceId` | `String`              | 否     | 命名空间ID，默认为`public`      |
| `serviceName` | `String`              | **是** | 服务名称                    |
| `groupName`   | `String`              | 否     | 分组名称，默认为`DEFAULT_GROUP` |
| `clusterName` | `String`              | 否     | 集群名称，默认为`DEFAULT`       |
| `ip`          | `String`              | **是** | 实例IP                    |
| `port`        | `Integer`             | **是** | 实例端口                    |
| `weight`      | `Double`              | 否     | 实例权重，默认为`1.0`           |
| `healthy`     | `Boolean`             | 否     | 健康状态，默认为`true`          |
| `enabled`     | `Boolean`             | 否     | 是否启用，默认为`true`          |
| `metadata`    | `Map<String, String>` | 否     | 实例元数据                   |
| `ephemeral`   | `Boolean`             | 否     | 是否临时实例                  |

#### 返回数据

| 参数名    | 参数类型     | 描述     |
|--------|----------|--------|
| `data` | `String` | 操作结果信息 |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance' \
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

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/instance/metadata/batch`

#### 请求参数

| 参数名               | 参数类型                  | 是否必填  | 描述                                                                                           |
|-------------------|-----------------------|-------|----------------------------------------------------------------------------------------------|
| `namespaceId`     | `String`              | 否     | 命名空间ID，默认为`public`                                                                           |
| `serviceName`     | `String`              | **是** | 服务名称                                                                                         |
| `groupName`       | `String`              | 否     | 分组名称，默认为`DEFAULT_GROUP`                                                                      |
| `instances`       | `String`              | 否     | 实例列表（JSON数组 字符串）默认为`""`表示所有实例更新；若指定时，每个元素代表一个需要更新的实例，必须需要包含`ip`和`port`字段，`clusterName`字段为可选, |
| `metadata`        | `Map<String, String>` | **是** | 元数据                                                                                          |
| `consistencyType` | `String`              | 否     | 一致性类型`ephemeral`和`persist`，对应服务的`ephemeral`，默认为`ephemeral`                                   |

#### 返回数据

| **参数名**   | **参数类型**       | **描述**  |
|-----------|----------------|---------|
| `updated` | `List<String>` | 更新的实例列表 |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance/metadata/batch' \
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

#### 请求方式

`DELETE`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/instance/metadata/batch`

#### 请求参数

| 参数名               | 参数类型                  | 是否必填  | 描述                      |
|-------------------|-----------------------|-------|-------------------------|
| `namespaceId`     | `String`              | 否     | 命名空间ID，默认为`public`      |
| `serviceName`     | `String`              | **是** | 服务名称                    |
| `groupName`       | `String`              | 否     | 分组名称，默认为`DEFAULT_GROUP` |
| `instances`       | `String`              | 否     | 实例列表（JSON 字符串），默认为`""`  |
| `metadata`        | `Map<String, String>` | **是** | 元数据                     |
| `consistencyType` | `String`              | 否     | 一致性类型，默认为`""`           |

#### 返回数据

| **参数名**        | **参数类型**                           | **描述**  |
|----------------|------------------------------------|---------|
| `data`         | `InstanceMetadataBatchOperationVo` | 操作结果信息  |
| `data.updated` | `List<String>`                     | 更新的实例列表 |

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance/metadata/batch?namespaceId=public&serviceName=service1&groupName=DEFAULT_GROUP&instances=%5B%7B%22ip%22%3A%22127.0.0.1%22%2C%22port%22%3A8080%7D%5D&metadata=%7B%22key1%22%3A%22value1%22%7D&consistencyType=ephemeral'
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

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/instance/partial`

#### 请求参数

| **参数名**       | **参数类型**  | **是否必填** | **描述**             |
|---------------|-----------|----------|--------------------|
| `namespaceId` | `String`  | 否        | 命名空间ID，默认为`public` |
| `serviceName` | `String`  | **是**    | 服务名称               |
| `ip`          | `String`  | **是**    | 实例IP               |
| `port`        | `Integer` | **是**    | 实例端口               |
| `clusterName` | `String`  | 否        | 集群名称，默认为`DEFAULT`  |
| `weight`      | `Double`  | 否        | 实例权重，默认为1.0        |
| `enabled`     | `Boolean` | 否        | 是否启用，默认启用          |
| `metadata`    | `String`  | 否        | 实例元数据（JSON 字符串）    |

#### 返回数据

| 参数名    | 参数类型     | 描述     |
|--------|----------|--------|
| `data` | `String` | 操作结果信息 |

#### 示例

* 请求示例

```shell
curl -X PUT "http://localhost:8848/nacos/v3/admin/ns/instance/partial" -d 'namespaceId=public&serviceName=example-service&ip=127.0.0.1&clusterName=DEFAULT&port=8080&weight=1.0&enabled=true&metadata={"key":"value"}'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/instance/list`

#### 请求参数

| **参数名**       | **参数类型**  | **是否必填** | **描述**                  |
|---------------|-----------|----------|-------------------------|
| `namespaceId` | `String`  | 否        | 命名空间ID，默认`public`       |
| `groupName`   | `String`  | 否        | 分组名称，默认为`DEFAULT_GROUP` |
| `serviceName` | `String`  | **是**    | 服务名称                    |
| `clusterName` | `String`  | 否        | 集群名称，默认为`""`            |
| `ip`          | `String`  | **是**    | 实例IP                    |
| `port`        | `Integer` | **是**    | 实例端口                    |
| `healthyOnly` | `Boolean` | 否        | 是否只返回健康实例，默认为`false`    |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名           | 参数类型      | 描述说明                              |
|---------------|-----------|-----------------------------------|
| `serviceName` | `String`  | 服务名,格式为`groupName`@@`serviceName` |
| `clusterName` | `String`  | 实例所在的集群名称                         |
| `ip`          | `String`  | 实例`IP`                            |
| `port`        | `int`     | 实例端口号                             |
| `weight`      | `double`  | 实例权重                              |
| `healthy`     | `boolean` | 实例是否健康                            |
| `enabled`     | `boolean` | 实例是否可用                            |
| `ephemeral`   | `boolean` | 是否为临时实例                           |
| `metadata`    | `map`     | 实例元数据                             |
| `instanceId`  | `String`  | 实例Id                              |

> 关于心跳的参数`instanceHeartBeatInterval`, `instanceHeartBeatTimeOut`和`ipDeleteTimeout`
> 用于兼容1.X客户端的心跳模式数据，后续版本可能会移除对1.X客户端的支持，届时这3个参数将被废弃。

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance/list?namespaceId=public&serviceName=service1&healthyOnly=true'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/instance`

#### 请求参数

| **参数名**       | **参数类型** | **是否必填** | **描述说明**               |
|---------------|----------|----------|------------------------|
| `namespaceId` | `String` | 否        | 命名空间Id，默认为`public`     |
| `groupName`   | `String` | **否**    | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName` | `String` | **是**    | 服务名                    |
| `clusterName` | `String` | 否        | 集群名称，默认为`DEFAULT`      |
| `ip`          | `String` | **是**    | `IP`地址                 |
| `port`        | `int`    | **是**    | 端口号                    |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名           | 参数类型      | 描述说明                              |
|---------------|-----------|-----------------------------------|
| `serviceName` | `String`  | 服务名,格式为`groupName`@@`serviceName` |
| `clusterName` | `String`  | 实例所在的集群名称                         |
| `ip`          | `String`  | 实例`IP`                            |
| `port`        | `int`     | 实例端口号                             |
| `weight`      | `double`  | 实例权重                              |
| `healthy`     | `boolean` | 实例是否健康                            |
| `enabled`     | `boolean` | 实例是否可用                            |
| `ephemeral`   | `boolean` | 是否为临时实例                           |
| `metadata`    | `map`     | 实例元数据                             |
| `instanceId`  | `String`  | 实例Id                              |

> 关于心跳的参数`instanceHeartBeatInterval`, `instanceHeartBeatTimeOut`和`ipDeleteTimeout`
> 用于兼容1.X客户端的心跳模式数据，后续版本可能会移除对1.X客户端的支持，届时这3个参数将被废弃。

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance?namespaceId=public&serviceName=service1&ip=1.1.1.1&port=3306'
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

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/service`

#### 请求参数

| 参数名                | 参数类型           | 是否必填  | 描述说明                   |
|--------------------|----------------|-------|------------------------|
| `namespaceId`      | `String`       | 否     | 命名空间`Id`，默认为`public`   |
| `groupName`        | `String`       | 否     | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName`      | `String`       | **是** | 服务名                    |
| `metadata`         | `JSON格式String` | 否     | 服务元数据，默认为空             |
| `ephemeral`        | `boolean`      | 否     | 是否为临时实例，默认为`false`     |
| `protectThreshold` | `float`        | 否     | 保护阈值，默认为`0`            |
| `selector`         | `JSON格式String` | 否     | 访问策略，默认为空              |

#### 返回数据

| 参数名    | 参数类型      | 描述     |
|--------|-----------|--------|
| `data` | `boolean` | 是否执行成功 |

#### 示例

* 请求示例

```shell
curl -d 'serviceName=nacos.test.1' \
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

#### 请求方式

`DELETE`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/service`

#### 请求参数

| 参数名           | 参数类型     | 是否必填  | 描述说明                   |
|---------------|----------|-------|------------------------|
| `namespaceId` | `String` | 否     | 命名空间`Id`，默认为`public`   |
| `groupName`   | `String` | 否     | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName` | `String` | **是** | 服务名                    |

#### 返回数据

| 参数名    | 参数类型      | 描述     |
|--------|-----------|--------|
| `data` | `boolean` | 是否执行成功 |

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ns/service?serviceName=nacos.test.1'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/service`

#### 请求参数

| 参数名           | 参数类型     | 是否必填  | 描述说明                   |
|---------------|----------|-------|------------------------|
| `namespaceId` | `String` | 否     | 命名空间`Id`，默认为`public`   |
| `groupName`   | `String` | 否     | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName` | `String` | **是** | 服务名                    |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                                 | 参数类型         | 描述                                   |
|-----------------------------------------------------|--------------|--------------------------------------|
| `namespaceId`                                       | `String`     | 服务所属的namespaceId。                    |
| `groupName`                                         | `String`     | 服务所属的groupName。                      |
| `serviceName`                                       | `String`     | 服务名。                                 |
| `ephemeral`                                         | `boolean`    | 服务的持久化属性，`true`为临时服务，`false`为持久化服务。  |
| `protectThreshold`                                  | `Double`     | 服务防护阈值。                              |
| `selector`                                          | `jsonObject` | 服务选择器。                               |
| `metadata`                                          | `jsonObject` | 服务元数据。                               |
| `clusterMap`                                        | `jsonObject` | 服务集群列表, key为cluster的名称，value为集群详细信息。 |
| `clusterMap`.$ClusterName.`clusterName`             | `String`     | 集群名。                                 |
| `clusterMap`.$ClusterName.`healthChecker`           | `jsonObject` | 健康检查器。                               |
| `clusterMap`.$ClusterName.`healthyCheckPort`        | `int`        | 健康检查端口。                              |
| `clusterMap`.$ClusterName.`useInstancePortForCheck` | `Boolean`    | 是否使用所注册的实例的`IP:Port`进行健康检查。          |
| `clusterMap`.$ClusterName.`metadata`                | `jsonObject` | 集群元数据。                               |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/service?serviceName=nacos.test.1'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/service/list`

#### 请求参数

| 参数名           | 参数类型           | 是否必填  | 描述说明                   |
|---------------|----------------|-------|------------------------|
| `namespaceId` | `String`       | 否     | 命名空间`Id`，默认为`public`   |
| `groupName`   | `String`       | 否     | 分组名，默认为`DEFAULT_GROUP` |
| `selector`    | `JSON格式String` | **是** | 访问策略                   |
| `pageNo`      | `int`          | 否     | 当前页，默认为`1`             |
| `pageSize`    | `int`          | 否     | 页条目数，默认为`20`，最大为`500`  |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                   | 参数类型     | 描述说明         |
|---------------------------------------|----------|--------------|
| `totalCount`                          | `int`    | 符合条件的服务的总数。  |
| `pageNumber`                          | `int`    | 当前页码，起始为`1`。 |
| `pagesAvailable`                      | `int`    | 可用页码。        |
| `pageItems`                           | `List`   | 服务列表。        |
| `pageItems`[i].`name`                 | `String` | 服务名。         |
| `pageItems`[i].`groupName`            | `String` | 服务的分组名。      |
| `pageItems`[i].`clusterCount`         | `String` | 服务下的集群数量。    |
| `pageItems`[i].`ipCount`              | `String` | 服务下的实例数量。    |
| `pageItems`[i].`healthyInstanceCount` | `String` | 服务下的健康实例数量。  |
| `pageItems`[i].`triggerFlag`          | `String` | 是否触发了服务的保护。  |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/service/list'
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

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/service`

#### 请求参数

| 参数名                | 参数类型           | 是否必填  | 描述说明                   |
|--------------------|----------------|-------|------------------------|
| `namespaceId`      | `String`       | 否     | 命名空间`Id`，默认为`public`   |
| `groupName`        | `String`       | 否     | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName`      | `String`       | **是** | 服务名                    |
| `metadata`         | `JSON格式String` | 否     | 服务元数据，默认为空             |
| `protectThreshold` | `float`        | 否     | 保护阈值，默认为`0`            |
| `selector`         | `JSON格式String` | 否     | 访问策略，默认为空              |

#### 返回数据

| 参数名    | 参数类型      | 描述     |
|--------|-----------|--------|
| `data` | `boolean` | 是否执行成功 |

#### 示例

* 请求示例

```shell
curl -d 'serviceName=nacos.test.1' \
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/service/subscribers`

#### 请求参数

| **参数名**       | **参数类型**  | **是否必填** | **描述**                  |
|---------------|-----------|----------|-------------------------|
| `namespaceId` | `String`  | 否        | 命名空间ID，默认为`public`      |
| `serviceName` | `String`  | **是**    | 服务名称                    |
| `groupName`   | `String`  | 否        | 分组名称，默认是`DEFAULT_GROUP` |
| `pageNo`      | `Integer` | 否        | 页码                      |
| `pageSize`    | `Integer` | 否        | 每页大小                    |
| `aggregation` | `Boolean` | 否        | 是否聚合,默认为`true`          |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                          | 参数类型      | 描述                   |
|------------------------------|-----------|----------------------|
| `totalCount`                 | `int`     | 符合条件的服务的总数。          |
| `pageNumber`                 | `int`     | 当前页码，起始为`1`。         |
| `pagesAvailable`             | `int`     | 可用页码。                |
| `pageItems`                  | `List`    | 服务列表。                |
| `pageItems`[i].`ip`          | `String`  | 订阅者IP。               |
| `pageItems`[i].`port`        | `Integer` | 订阅者端口。               |
| `pageItems`[i].`address`     | `String`  | 订阅者地址, 一般为`ip:port`。 | 
| `pageItems`[i].`agent`       | `String`  | 订阅者客户端版本。            |
| `pageItems`[i].`appName`     | `String`  | 订阅者所属应用。             |
| `pageItems`[i].`namespaceId` | `String`  | 订阅者所属命名空间。           |
| `pageItems`[i].`groupName`   | `String`  | 订阅的分组名。              |
| `pageItems`[i].`serviceName` | `String`  | 订阅的服务名。              |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/service/subscribers?namespaceId=public&serviceName=service1&groupName=DEFAULT_GROUP&pageNo=1&pageSize=10'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/service/selector/types`

#### 请求参数

无

#### 返回数据

| 参数名    | 参数类型           | 描述      |
|--------|----------------|---------|
| `data` | `List<String>` | 选择器类型列表 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/service/selector/types'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/config`

#### 请求参数

| **参数名**       | **类型**   | **必填** | **默认值**  | **参数描述** |
|---------------|----------|--------|----------|----------|
| `namespaceId` | `String` | 否      | `public` | 命名空间     |
| `groupName`   | `String` | **是**  | 无        | 配置分组名    |
| `dataId`      | `String` | **是**  | 无        | 配置名      |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                | 参数类型     | 描述                         |
|--------------------|----------|----------------------------|
| `id`               | `String` | 配置在存储系统中的ID，一般为Long类型的字符串。 |
| `dataId`           | `String` | 配置ID。                      |
| `groupName`        | `String` | 配置分组。                      |
| `namespaceId`      | `String` | 命名空间ID。                    |
| `content`          | `String` | 配置内容。                      |
| `desc`             | `String` | 配置描述。                      |
| `md5`              | `String` | 配置内容的MD5值。                 |
| `configTags`       | `String` | 配置的标签。                     |
| `encryptedDataKey` | `String` | 加密配置内容的密钥，使用配置加密插件时存在。     |
| `appName`          | `String` | 配置所属的应用名称。                 |
| `type`             | `String` | 配置类型。                      |
| `createTime`       | `Long`   | 配置创建时间。                    |
| `modifyTime`       | `Long`   | 配置修改时间。                    |
| `createUser`       | `String` | 配置创建人。                     |
| `createIp`         | `String` | 配置创建IP。                    |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/config?dataId=nacos.example&groupName=DEFAULT_GROUP&namespaceId=public'
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

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/config`

#### 请求参数

| 参数名           | 类型       | 必填    | 默认值      | 参数描述            |
|---------------|----------|-------|----------|-----------------|
| `namespaceId` | `String` | 否     | `public` | 命名空间            |
| `groupName`   | `String` | **是** | 无        | 配置组名            |
| `dataId`      | `String` | **是** | 无        | 配置名             |
| `content`     | `String` | **是** | 无        | 配置内容            |
| `appName`     | `String` | 否     | 无        | 应用名             |
| `srcUser`     | `String` | 否     | 无        | 源用户             |
| `configTags`  | `String` | 否     | 无        | 配置标签列表，可多个，逗号分隔 |
| `desc`        | `String` | 否     | 无        | 配置描述            |
| `type`        | `String` | 否     | 无        | 配置类型            |

#### 返回数据

| 参数名    | 参数类型      | 描述     |
|--------|-----------|--------|
| `data` | `boolean` | 是否执行成功 |

#### 示例

* 请求示例

```shell
curl -d 'dataId=nacos.example' \
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

#### 请求方式

`DELETE`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/config`

#### 请求参数

| 参数名           | 类型       | 必填    | 默认值      | 参数描述  |
|---------------|----------|-------|----------|-------|
| `namespaceId` | `String` | 否     | `public` | 命名空间  |
| `groupName`   | `String` | **是** | 无        | 配置分组名 |
| `dataId`      | `String` | **是** | 无        | 配置名   |

#### 返回数据

| 参数名    | 参数类型      | 描述     |
|--------|-----------|--------|
| `data` | `boolean` | 是否执行成功 |

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/cs/config?dataId=nacos.example&groupName=DEFAULT_GROUP&namespaceId=public'
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

#### 请求方式

`DELETE`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/config/batch`

#### 请求参数

| 参数名   | 参数类型         | 是否必填  | 描述     |
|-------|--------------|-------|--------|
| `ids` | `List<Long>` | **是** | 配置ID列表 |

#### 返回数据

| 参数名    | 参数类型      | 描述   |
|--------|-----------|------|
| `data` | `Boolean` | 操作结果 |

#### 示例

* 请求示例

```
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/batch?ids=1,2,3'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/config/listener`

#### 请求参数

| 参数名           | 参数类型      | 是否必填  | 默认值      | 描述        |
|---------------|-----------|-------|----------|-----------|
| `namespaceId` | `String`  | 否     | `public` | 命名空间      |
| `dataId`      | `String`  | **是** | 无        | 配置ID      |
| `groupName`   | `String`  | **是** | 无        | 分组名称      |
| `aggregation` | `Boolean` | **否** | `true`   | 是否从其他节点聚合 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名               | 参数类型                  | 描述                                    |
|-------------------|-----------------------|---------------------------------------|
| `queryType`       | `String`              | 订阅者查询类型，该接口为`config`。                 |
| `listenersStatus` | `Map<String, String>` | 订阅者列表，key为订阅者IP，value为订阅者订阅当前配置的MD5值。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/listener?namespaceId=public&dataId=example&groupName=DEFAULT_GROUP'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/config/list`

#### 请求参数

| 参数名            | 参数类型      | 是否必填  | 默认值      | 描述                                                     |
|----------------|-----------|-------|----------|--------------------------------------------------------|
| `pageNo`       | `Integer` | **是** | 1        | 页码                                                     |
| `pageSize`     | `Integer` | **是** | 100      | 每页大小                                                   |
| `namespaceId`  | `String`  | 否     | `public` | 配置所属命名空间                                               |
| `dataId`       | `String`  | 否     | `""`     | 配置的data ID, 当使用`blur`模式时，可使用`*`进行模糊匹配，如`example*`      |
| `groupName`    | `String`  | 否     | `""`     | 配置的分组名称, 当使用`blur`模式时，可使用`*`进行模糊匹配，如`example*`         |
| `appName`      | `String`  | 否     |          | 配置所属应用名称，默认为空，传入时过滤归属于此应用的配置，值为空时查询所有应用的配置。            |
| `configTags`   | `String`  | 否     |          | 配置标签，多个标签之间用英文逗号分隔，默认为空，传入时过滤拥有此tag的配置，值为空时查询所有tag的配置。 |
| `type`         | `String`  | 否     |          | 配置的类型，默认值为空，传入时过滤此类型的配置，值为空时查询所有类型的配置。                 |
| `configDetail` | `String`  | 否     |          | 搜索的配置详情                                                |
| `search`       | `String`  | 否     | `blur`   | 搜索模式（`blur` 或 `exact`）                                 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                          | 参数类型     | 描述                         |
|------------------------------|----------|----------------------------|
| `totalCount`                 | `int`    | 符合规则的配置总数。                 |
| `pagesAvailable`             | `int`    | 可用页码总数。                    |
| `pageNumber`                 | `int`    | 当前页码。                      |
| `pageItems`                  | `List`   | 符合规则的配置列表。                 |
| `pageItems`[i].`id`          | `String` | 配置在存储系统中的ID，一般为Long类型的字符串。 |
| `pageItems`[i].`dataId`      | `String` | 配置ID。                      |
| `pageItems`[i].`groupName`   | `String` | 配置分组。                      |
| `pageItems`[i].`namespaceId` | `String` | 命名空间ID。                    |
| `pageItems`[i].`md5`         | `String` | 配置内容的MD5值。                 |
| `pageItems`[i].`appName`     | `String` | 配置所属的应用名称。                 |
| `pageItems`[i].`type`        | `String` | 配置类型。                      |
| `pageItems`[i].`createTime`  | `Long`   | 配置创建时间。                    |
| `pageItems`[i].`modifyTime`  | `Long`   | 配置修改时间。                    |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/list?pageNo=1&pageSize=10'
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

#### 请求方式

`DELETE`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/config/beta`

#### 请求参数

| 参数名           | 参数类型     | 是否必填  | 默认值      | 描述   |
|---------------|----------|-------|----------|------|
| `namespaceId` | `String` | 否     | `public` | 命名空间 |
| `dataId`      | `String` | **是** | 无        | 配置ID |
| `groupName`   | `String` | **是** | 无        | 分组名称 |

#### 返回数据

| 参数名    | 参数类型      | 描述   |
|--------|-----------|------|
| `data` | `Boolean` | 操作结果 |

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/beta?namespaceId=public&dataId=example&groupName=DEFAULT_GROUP'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/config/beta`

#### 请求参数

| 参数名           | 参数类型     | 是否必填  | 默认值      | 描述   |
|---------------|----------|-------|----------|------|
| `namespaceId` | `String` | 否     | `public` | 命名空间 |
| `dataId`      | `String` | **是** | 无        | 配置ID |
| `groupName`   | `String` | **是** | 无        | 分组名称 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                | 参数类型     | 描述                                  |
|--------------------|----------|-------------------------------------|
| `id`               | `String` | beta配置的存储ID。                        |
| `dataId`           | `String` | 配置的dataId。                          |
| `groupName`        | `String` | 配置的groupName。                       |
| `namespaceId`      | `String` | 配置所属的命名空间。                          |
| `desc`             | `String` | 配置描述。                               |
| `md5`              | `String` | 配置内容的MD5值。                          |
| `configTags`       | `String` | 配置的标签。                              |
| `encryptedDataKey` | `String` | 加密配置内容的密钥，使用配置加密插件时存在。              |
| `appName`          | `String` | 配置所属的应用名称。                          |
| `type`             | `String` | 配置类型。                               |
| `createTime`       | `Long`   | 配置创建时间。                             |
| `modifyTime`       | `Long`   | 配置修改时间。                             |
| `createUser`       | `String` | 配置创建人。                              |
| `createIp`         | `String` | 配置创建IP。                             |
| `grayName`         | `String` | 灰度发布规则名称, 固定为`beta`。                |
| `grayRule`         | `String` | 灰度发布规则，格式为JSON，其中的`expr`为beta的ip列表。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/beta?namespaceId=public&dataId=example&groupName=DEFAULT_GROUP'
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

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/config/import`

#### 请求参数

| 参数名           | 参数类型               | 是否必填  | 默认值      | 描述     |
|---------------|--------------------|-------|----------|--------|
| `namespaceId` | `String`           | 否     | `public` | 命名空间   |
| `src_user`    | `String`           | 否     | 无        | 操作用户   |
| `policy`      | `SameConfigPolicy` | 否     | `ABORT`  | 冲突处理策略 |
| `file`        | `MultipartFile`    | **是** | 无        | 配置文件   |

#### 返回数据

| 参数名              | 参数类型                  | 描述     |
|------------------|-----------------------|--------|
| `data`           | `Map<String, Object>` | 导入结果   |
| `data.succCount` | `Integer`             | 成功导入数量 |
| `data.skipCount` | `Integer`             | 跳过导入数量 |

#### 示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/import' \
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/config/export`

#### 请求参数

| 参数名           | 参数类型         | 是否必填 | 默认值      | 描述     |
|---------------|--------------|------|----------|--------|
| `namespaceId` | `String`     | 否    | `public` | 命名空间   |
| `groupName`   | `String`     | 否    | `""`     | 配置分组   |
| `dataId`      | `String`     | 否    | `""`     | 配置ID   |
| `ids`         | `List<Long>` | 否    | 无        | 配置ID列表 |

> 使用时建议分开使用 `ids` 和 `dataId` + `groupName` 的组合，只选择一种方式，另一类传入空字符串，否则可能导致导出文件为空内容。

#### 返回数据

返回体为ZIP文件，包含配置内容和元数据

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/export?namespaceId=public&ids=' --output config.zip
```

### 3.11 克隆配置

#### 接口描述

克隆配置到指定命名空间

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/config/clone`

#### 请求参数

| 参数名               | 参数类型                                 | 是否必填  | 默认值      | 描述       |
|-------------------|--------------------------------------|-------|----------|----------|
| `namespaceId`     | `String`                             | **是** | `public` | 命名空间ID   |
| `src_user`        | `String`                             | 否     | 无        | 操作用户     |
| `configBeansList` | `List<SameNamespaceCloneConfigBean>` | **是** | 无        | 配置克隆参数列表 |
| `policy`          | `SameConfigPolicy`                   | 否     | `ABORT`  | 冲突处理策略   |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名         | 参数类型      | 描述     |
|-------------|-----------|--------|
| `succCount` | `Integer` | 成功导入数量 |
| `skipCount` | `Integer` | 跳过导入数量 |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/clone?namespaceId=test&policy=ABORT' \
-H 'Content-Type: application/json' \
-d "[{\"cfgId\":\"838029534438625280\",\"dataId\":\"111\",\"group\":\"DEFAULT_GROUP\"},{\"cfgId\":\"838033747294031872\",\"dataId\":\"qtc-user.yaml\",\"group\":\"DEFAULT_GROUP\"}]"
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/history/list`

#### 请求参数

| 参数名           | 类型       | 必填    | 默认值             | 参数描述  |
|---------------|----------|-------|-----------------|-------|
| `namespaceId` | `String` | 否     | `public`        | 命名空间  |
| `groupName`   | `String` | **是** | 无               | 配置分组名 |
| `dataId`      | `String` | **是** | 无               | 配置名   |
| `pageNo`      | `int`    | 否     | `1`             | 当前页   |
| `pageSize`    | `int`    | 否     | `100`（最大为`500`） | 页条目数  |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                          | 参数类型     | 描述                                |
|------------------------------|----------|-----------------------------------|
| `totalCount`                 | `int`    | 历史记录的总数。                          |
| `pageNumber`                 | `int`    | 当前页码，起始为`1`。                      |
| `pagesAvailable`             | `int`    | 可用页码。                             |
| `pageItems`                  | `List`   | 历史记录列表。                           |
| `pageItems`[i].`id`          | `String` | 历史记录的ID。                          |
| `pageItems`[i].`dataId`      | `String` | 配置的dataId。                        |
| `pageItems`[i].`groupName`   | `String` | 配置的groupName。                     |
| `pageItems`[i].`namespaceId` | `String` | 配置所属的命名空间。                        |
| `pageItems`[i].`appName`     | `String` | 配置所属的appName。                     |
| `pageItems`[i].`opType`      | `String` | 操作类型，`I`为插入、`U`为更新、`D`为删除。        |
| `pageItems`[i].`publishType` | `String` | 发布类型，`formal`为普通发布，`gray`为beta发布。 |
| `pageItems`[i].`srcIp`       | `String` | 发布的来源IP。                          |
| `pageItems`[i].`srcUser`     | `String` | 发布的用户，仅在开启鉴权并登录用户后才发布配置才存在。       |
| `pageItems`[i].`createTime`  | `Long`   | 配置创建时间。                           |
| `pageItems`[i].`modifyTime`  | `Long`   | 配置修改时间。                           |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/history/list?dataId=nacos.example&groupName=DEFAULT_GROUP&namespaceId=public'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/history`

#### 请求参数

| 参数名         | 类型       | 必填    | 默认值      | 参数描述   |
|-------------|----------|-------|----------|--------|
| namespaceId | `String` | 否     | `public` | 命名空间   |
| groupName   | `String` | **是** | 无        | 配置分组名  |
| dataId      | `String` | **是** | 无        | 配置名    |
| nid         | `long`   | **是** | 无        | 配置历史Id |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名           | 参数类型         | 描述                                                                          |
|---------------|--------------|-----------------------------------------------------------------------------|
| `id`          | `String`     | 历史记录的ID。                                                                    |
| `dataId`      | `String`     | 配置的dataId。                                                                  |
| `groupName`   | `String`     | 配置的groupName。                                                               |
| `namespaceId` | `String`     | 配置所属的命名空间。                                                                  |
| `content`     | `String`     |
| `appName`     | `String`     | 配置所属的appName。                                                               |
| `opType`      | `String`     | 操作类型，`I`为插入、`U`为更新、`D`为删除。                                                  |
| `publishType` | `String`     | 发布类型，`formal`为普通发布，`gray`为beta发布。                                           |
| `srcIp`       | `String`     | 发布的来源IP。                                                                    |
| `srcUser`     | `String`     | 发布的用户，仅在开启鉴权并登录用户后才发布配置才存在。                                                 |
| `createTime`  | `Long`       | 配置创建时间。                                                                     |
| `modifyTime`  | `Long`       | 配置修改时间。                                                                     |
| `grayName`    | `String`     | 灰度发布规则名称, 固定为`beta`。                                                        |
| `extInfo`     | `JsonString` | 扩展信息，目前包括`src_user`、`type`、`c_desc`，若`publishType`为`gray`, 其中还包括`grayRule`。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/history/??dataId=111&groupName=DEFAULT_GROUP&nid=7'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/history/previous`

#### 请求参数

| 参数名         | 类型       | 必填    | 默认值      | 参数描述  |
|-------------|----------|-------|----------|-------|
| namespaceId | `String` | 否     | `public` | 命名空间  |
| groupName   | `String` | **是** | 无        | 配置分组名 |
| dataId      | `String` | **是** | 无        | 配置名   |
| id          | `long`   | **是** | 无        | 配置Id  |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名           | 参数类型         | 描述                                                                          |
|---------------|--------------|-----------------------------------------------------------------------------|
| `id`          | `String`     | 历史记录的ID。                                                                    |
| `dataId`      | `String`     | 配置的dataId。                                                                  |
| `groupName`   | `String`     | 配置的groupName。                                                               |
| `namespaceId` | `String`     | 配置所属的命名空间。                                                                  |
| `content`     | `String`     |
| `appName`     | `String`     | 配置所属的appName。                                                               |
| `opType`      | `String`     | 操作类型，`I`为插入、`U`为更新、`D`为删除。                                                  |
| `publishType` | `String`     | 发布类型，`formal`为普通发布，`gray`为beta发布。                                           |
| `srcIp`       | `String`     | 发布的来源IP。                                                                    |
| `srcUser`     | `String`     | 发布的用户，仅在开启鉴权并登录用户后才发布配置才存在。                                                 |
| `createTime`  | `Long`       | 配置创建时间。                                                                     |
| `modifyTime`  | `Long`       | 配置修改时间。                                                                     |
| `grayName`    | `String`     | 灰度发布规则名称, 固定为`beta`。                                                        |
| `extInfo`     | `JsonString` | 扩展信息，目前包括`src_user`、`type`、`c_desc`，若`publishType`为`gray`, 其中还包括`grayRule`。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/history/previous?id=101&dataId=nacos.example&groupName=DEFAULT_GROUP&namespaceId=public'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/history/configs`

#### 请求参数

| 参数名         | 类型       | 必填    | 默认值 | 参数描述 |
|-------------|----------|-------|-----|------|
| namespaceId | `String` | **是** | 无   | 命名空间 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名         | 参数类型     | 描述            |
|-------------|----------|---------------|
| `dataId`    | `String` | 配置的dataId。    |
| `groupName` | `String` | 配置的groupName。 |

> 其他字段均无用。

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/history/configs?namespaceId=public'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/capacity`

#### 请求参数

| 参数名           | 参数类型     | 是否必填 | 默认值 | 描述     |
|---------------|----------|------|-----|--------|
| `groupName`   | `String` | 否    | 无   | 分组名称   |
| `namespaceId` | `String` | 否    | 无   | 命名空间ID |

**注意** ：`groupName` 和 `namespaceId` 至少需要提供一个。

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                | 参数类型      | 描述         |
|--------------------|-----------|------------|
| `id`               | `Long`    | 容量信息的唯一ID  |
| `groupName`        | `String`  | 分组名称       |
| `namespaceId`      | `String`  | 命名空间ID     |
| `quota`            | `Integer` | 配额         |
| `usage`            | `Integer` | 当前使用量      |
| `maxSize`          | `Integer` | 最大单配置大小    |
| ~~`gmtCreate`~~    | `String`  | 创建时间，将废弃   |
| ~~`gmtModified`~~  | `String`  | 最后修改时间，将废弃 |
| ~~`maxAggrCount`~~ | `Integer` | 未使用，将废弃    |
| ~~`maxAggrSize`~~  | `Integer` | 未使用，将废弃    |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/capacity?namespaceId=public'
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

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/capacity`

#### 请求参数

| 参数名           | 参数类型      | 是否必填  | 描述                   |
|---------------|-----------|-------|----------------------|
| `groupName`   | `String`  | 否     | 分组名称，与命名空间ID 两者必须有其一 |
| `namespaceId` | `String`  | 否     | 命名空间ID，与分组名称 两者必须有其一 |
| `quota`       | `Integer` | **是** | 配额                   |
| `maxSize`     | `Integer` | **是** | 最大大小                 |

#### 返回数据

| 参数名    | 参数类型      | 描述   |
|--------|-----------|------|
| `data` | `Boolean` | 操作结果 |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/cs/capacity' -d 'namespaceId=public&quota=200&maxSize=2048'
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
| `data` | `String` | 操作结果 |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/cs/ops/localCache'
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

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/ops/log`

#### 请求参数

| 参数名        | 参数类型     | 是否必填  | 默认值 | 描述                    |
|------------|----------|-------|-----|-----------------------|
| `logName`  | `String` | **是** | 无   | 模块名称                  |
| `logLevel` | `String` | **是** | 无   | 日志级别（如`INFO`、`DEBUG`） |

#### 返回数据

| 参数名    | 参数类型     | 描述   |
|--------|----------|------|
| `data` | `String` | 操作结果 |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/cs/ops/log?logName=config-server&logLevel=DEBUG'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/ops/derby`

#### 请求参数

| 参数名   | 参数类型     | 是否必填  | 默认值 | 描述       |
|-------|----------|-------|-----|----------|
| `sql` | `String` | **是** | 无   | SQL 查询语句 |

#### 返回数据

| 参数名    | 参数类型                        | 描述   |
|--------|-----------------------------|------|
| `data` | `List<Map<String, Object>>` | 查询结果 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/ops/derby?sql=SELECT%20*%20FROM%20config_info'
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

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/ops/derby/import`

#### 请求参数

| 参数名    | 参数类型            | 是否必填  | 默认值 | 描述           |
|--------|-----------------|-------|-----|--------------|
| `file` | `MultipartFile` | **是** | 无   | 导入文件（SQL 文件） |

#### 返回数据

| 参数名    | 参数类型     | 描述     |
|--------|----------|--------|
| `data` | `String` | 导入结果信息 |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/cs/ops/derby/import' \
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/listener`

#### 请求参数

| 参数名           | 参数类型      | 是否必填  | 默认值      | 描述         |
|---------------|-----------|-------|----------|------------|
| `ip`          | `String`  | **是** | 无        | 客户端 IP 地址  |
| `all`         | `Boolean` | 否     | `false`  | 是否返回所有配置信息 |
| `namespaceId` | `String`  | 否     | `public` | 命名空间ID     |
| `aggregation` | `Boolean` | 否     | `true`   | 是否从其他节点聚合  |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名               | 参数类型                  | 描述                                                                            |
|-------------------|-----------------------|-------------------------------------------------------------------------------|
| `queryType`       | `String`              | 订阅者查询类型，该接口为`ip`。                                                             |
| `listenersStatus` | `Map<String, String>` | 订阅者列表，key为订阅的配置信息，格式为`dataId`+`groupName`+`namespaceId`，value为订阅者订阅当前配置的MD5值。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/listener?ip=127.0.0.1&namespaceId=public'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/metrics/cluster`

#### 请求参数

| **参数名**       | **参数类型** | **是否必填** | **默认值**  | **描述**    |
|---------------|----------|----------|----------|-----------|
| `ip`          | `String` | **是**    | 无        | 客户端 IP 地址 |
| `dataId`      | `String` | 否        | 无        | 配置ID      |
| `groupName`   | `String` | 否        | 无        | 分组名称      |
| `namespaceId` | `String` | 否        | `public` | 命名空间ID    |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                            | 参数类型      | 描述说明     |
|------------------------------------------------|-----------|----------|
| `data`                                         |           | 服务信息     |
| `data.{namespaceId}.isFixedServer`             | `Boolean` | 是否固定服务器  |
| `data.{namespaceId}.snapshotDir`               | `String`  | 快照目录路径   |
| `data.{namespaceId}.clientVersion`             | `String`  | 客户端版本    |
| `data.{namespaceId}.serverUrls`                | `String`  | 服务器URL列表 |
| `data.{namespaceId}.listenConfigSize`          | `Integer` | 监听配置大小   |
| `data.{namespaceId}.metricValues.cacheData`    | `String`  | 缓存数据md5值 |
| `data.{namespaceId}.metricValues.snapshotData` | `String`  | 快照数据md5值 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/metrics/cluster?ip=127.0.0.1&dataId=example&groupName=DEFAULT_GROUP&namespaceId=public'
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

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/metrics/ip`

#### 请求参数

| **参数名**       | **参数类型** | **是否必填** | **默认值**  | **描述**    |
|---------------|----------|----------|----------|-----------|
| `ip`          | `String` | **是**    | 无        | 客户端 IP 地址 |
| `dataId`      | `String` | 否        | 无        | 配置ID      |
| `groupName`   | `String` | 否        | 无        | 分组名称      |
| `namespaceId` | `String` | 否        | `public` | 命名空间      |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                            | 参数类型      | 描述说明     |
|------------------------------------------------|-----------|----------|
| `data`                                         |           | 服务信息     |
| `data.{namespaceId}.isFixedServer`             | `Boolean` | 是否固定服务器  |
| `data.{namespaceId}.snapshotDir`               | `String`  | 快照目录路径   |
| `data.{namespaceId}.clientVersion`             | `String`  | 客户端版本    |
| `data.{namespaceId}.serverUrls`                | `String`  | 服务器URL列表 |
| `data.{namespaceId}.listenConfigSize`          | `Integer` | 监听配置大小   |
| `data.{namespaceId}.metricValues.cacheData`    | `String`  | 缓存数据md5值 |
| `data.{namespaceId}.metricValues.snapshotData` | `String`  | 快照数据md5值 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/metrics/ip?ip=127.0.0.1&dataId=example&groupName=DEFAULT_GROUP&namespaceId=public'
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
