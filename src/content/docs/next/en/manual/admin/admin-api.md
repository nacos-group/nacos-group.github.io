---
title: Admin API
keywords: [ Nacos,Admin PI ]
description: The following are some operations APIs for Nacos Server, intended for use with the console or for programs and personnel developing custom Nacos operations tools.
sidebar:
  order: 10
---

# 运维API

> Nacos 3.X 版本将不再兼容1.X版本 和 2.X版本的 AdminAPI，请使用Nacos 3.X版本的AdminAPI进行替换。
>
> 若必须要使用1.X和2.X的Admin API，需要在配置文件中设置`nacos.core.auth.admin.enabled=true`开启，但此兼容也将在未来版本中移除，建议使用Nacos
> 3.X版本的AdminAPI进行替换。

Nacos默认搭载了一整套专为管理控制台和运维人员设计的运维API，赋予运维专家更多的配置权限、更广阔的数据检索能力等。这些API为Nacos的运维团队提供了方便，使他们能够高效地处理故障、排查问题，以确保系统的稳定运行。

## 0. 运维API 相关说明

### 0.1 统一路径格式

Nacos的运维API，使用统一的Path格式进行的规范。格式为`[/$nacos.server.contextPath]/v3/admin/[module]/[subPath]...`,
其中

- `$nacos.server.contextPath`：运维API的根路径，默认为`/nacos`，可以通过`nacos.server.contextPath`配置项进行修改。
- `module`：运维API模块名称，例如`server`、`cs`、`ns`、`core`等。
- `subPath`：运维API的子路径，例如`state`、`namespace`、`config`等， 可能有多层子路径。

下列列出的运维API，采用默认`$nacos.server.contextPath`的情况进行展示，若已修改部署环境中的`$nacos.server.contextPath`
配置项，请自行修改调用API时的请求URL。

同时下列列出的运维API样例中，均采用默认Nacos Web Server的端口进行展示，若已修改部署环境中的`$nacos.server.main.port`
配置项，请自行修改调用API时的请求URL。

### 0.2. 鉴权认证

Nacos 3.X 版本的Admin API默认需要鉴权，请在请求时使用管理员用户`nacos`（使用默认鉴权插件时）。

若想要关闭鉴权，请设置`nacos.core.auth.admin.enabled=false`，然后重启Nacos Server。

### 0.3. Swagger 类型文档

Nacos 3.X 的运维 API 也提供了Swagger风格的文档，您可以通过访问[Nacos Swagger运维 API](/swagger/admin/)查看。

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

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                     | 参数类型         | 描述                                                                                      |
|-----------------------------------------|--------------|-----------------------------------------------------------------------------------------|
| ${connectionId}                         | `object` | 每条 gRPC connection ID. |
| ${connectionId}.abilityTable            | `object` | Capability list supported by the gRPC connection, namely the client. |
| ${connectionId}.metaInfo.clientIp       | `string` | Source IP of the gRPC connection. |
| ${connectionId}.metaInfo.localPort      | `integer` | gRPC port of this Nacos Server. |
| ${connectionId}.metaInfo.version        | `string` | Version of the gRPC connection, namely the client. |
| ${connectionId}.metaInfo.createTime     | `string` | Creation time of the gRPC connection. |
| ${connectionId}.metaInfo.lastActiveTime | `integer`  | Last heartbeat time of the gRPC connection. |
| ${connectionId}.metaInfo.labels.source  | `string` | Module of the gRPC connection. Optional values are `naming`, `config`, and `cluster`, representing registry, configuration, and inter-cluster connections respectively. |
| ${connectionId}.metaInfo.clusterSource  | `boolean` | Whether the gRPC connection is an inter-cluster connection. When `true`, `${connectionId}.metaInfo.labels.source` is `cluster`. |
| ${connectionId}.metaInfo.sdkSource      | `boolean` | Whether the gRPC connection comes from a client. When `true`, `${connectionId}.metaInfo.labels.source` is `naming` or `config`. |

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
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/core/loader/reloadCurrent' -d "count=100"
```

* 返回示例

```text
success
```

### 1.3. 均衡指定的单个连接

#### 接口描述

通过该接口，可以将指定的客户端连接(gRPC连接)迁移到其他Nacos Server节点中。

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
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/core/loader/reloadClient' -d "connectionId=1709273546779_127.0.0.1_35042"
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

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                           | 参数类型        | 描述                        |
|-------------------------------|-------------|---------------------------|
| `total`                       | `integer` | 该集群中所有节点的连接数总和            |
| `min`                         | `integer` | 该集群中所有节点的最小连接数            |
| `avg`                         | `integer` | 该集群中所有节点的平均连接数            |
| `max`                         | `integer` | 该集群中所有节点的最大连接数            |
| `memberCount`                 | `integer` | 该集群中所有节点的个数               |
| `metricsCount`                | `integer` | 该集群中已统计到概览信息的节点个数         |
| `detail`                      | `array` | Overview information of all nodes in the cluster. See the following fields. |
| `detail[].address`            | `string` | 节点地址                      |
| `detail[].metric.load`        | `number` | 节点的负载率，主要对应节点的Load指标，参考值  |
| `detail[].metric.sdkConCount` | `integer` | 连接到该节点的SDK连接数，主要对应客户端连接数  |
| `detail[].metric.conCount`    | `integer` | 连接到该节点的总连接数，包含了SDK和集群间的连接 |
| `detail[].metric.cpu`         | `number` | 节点的CPU使用率，参考值             |

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

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                           | 参数类型         | 描述                                             |
|-------------------------------|--------------|------------------------------------------------|
| `ip`                          | `string` | 节点IP                                           |
| `port`                        | `integer` | 节点端口                                           |
| `state`                       | `string` | Node state: UP/DOWN/SUSPICIOUS |
| `extendInfo`                  | `object` | Extended node information. See the following fields. |
| `extendInfo.lastRefreshTime`  | `integer` | 节点上一次更新时间戳，单位毫秒                                |
| `extendInfo.raftMetaData`     | `object` | Raft metadata of the node, including fields such as `leader` and `term` for each Raft Group. |
| `extendInfo.raftPort`         | `integer` | 节点的Raft端口                                      |
| `extendInfo.supportGrayModel` | `boolean` | 是否支持灰度模型                                       |
| `extendInfo.version`          | `string` | 节点的版本                                          |
| `address`                     | `string` | 节点地址，格式为`ip:port`                              |
| `failAccessCnt`               | `integer` | 探测失败的次数，及report失败的次数，超过一定次数`state`会被改为`DOWN`   |
| `abilities`                   | `object` | Capabilities supported by the node. |
| `grpcReportEnabled`           | `boolean` | 标记节点是否支持grpc上报心跳能力，用于适配老版本升级，后续将移除             |
| ~~extendInfo.readyToUpgrade~~ | `boolean` | 是否ready升级到Nacos2.0，于2.2版本后废弃，即将移除              |

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

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `address` | `string` | 否 | 节点地址，支持按地址过滤。 |
| `state` | `string` | 否 | Node state: UP/DOWN/SUSPICIOUS |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，`data`字段为[获取本节点信息](#返回数据-4)的返回数据的列表。

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

### 1.7. 动态修改Server集群地址发现方式

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
| `type` | `string` | 是 | address-server/file/standalone |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)。

| 参数名    | 参数类型      | 描述                          |
|--------|-----------|-----------------------------|
| `data` | `boolean` | `true`表示更新成功，`false`表示更新失败。 |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/core/cluster/lookup' -d "type=file"
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

命令说明（Swagger 暂不支持该子参数结构，文档保留）：

- `doSnapshot`: `${nacos-server-address}:${raft-port}`
- `transferLeader`: `${nacos-server-address}:${raft-port}`
- `restRaftCluster`: `${nacos-server-address}:${raft-port}[,${nacos-server-address}:${raft-port}]`
- `removePeer`: `${nacos-server-address}:${raft-port}`
- `removePeers`: `${nacos-server-address}:${raft-port}[,${nacos-server-address}:${raft-port}]`
- `changePeers`: `${nacos-server-address}:${raft-port}[,${nacos-server-address}:${raft-port}]`

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)。

| 参数名    | 参数类型     | 描述         |
|--------|----------|------------|
| `data` | `string` | 固定为`null`。 |

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

### 1.9. 动态修改Nacos Core相关日志级别

#### 接口描述

通过该接口，可以在不重启Nacos Server的情况下，动态修改Nacos Core相关日志级别的配置。

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

### 1.10. 自动均衡指定数量的连接

#### 接口描述

通过该接口，可以根据负载因子(loaderFactor)自动均衡整个集群的客户端连接。

自动均衡逻辑：

1. 根据整个集群的客户端连接数和Nacos Server节点数量计算平均连接数`avg`、节点连接数下限阈值`lowLimitCount`(=avg * (
   1-loaderFactor))、节点连接数上限阈值`overLimitCount`(=avg * (1+loaderFactor))
2. 将高负载节点的部分客户端连接重定向到低负载节点。

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
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/core/loader/smartReloadCluster' -d "loaderFactor=0.1"
```

* 返回示例

```text
success
```

### 1.11. 获取ID生成器信息

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
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/ops/ids'
```

* 返回示例

```text
success
```

### 1.12. 更新集群节点信息

#### 接口描述

通过该接口，可以更新当前节点中的Nacos节点列表的详细信息。**注意：** 该接口会覆盖当前节点中列表中的详细信息，仅更新传入的节点中存在于集群中的节点，并`不能`通过此接口添加和减少集群中的节点。同时，Nacos自身的健康探测`report`任务也会对当前节点中列表中的节点进行健康探测及更新详细信息，若调用此接口后，探测任务发现节点信息有变更，则任务也会覆盖当前节点中列表中的节点信息。

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/cluster/node/list`

#### 请求参数

请求体为 JSON 数组，数组元素为节点信息（Member），包含 ip、port、state、extendInfo 等字段。

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data | `boolean` | 是否更新成功 |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/core/cluster/node/list' \
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
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/namespace?namespaceId=public'
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
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/core/namespace' \
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

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/namespace`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，不传则由服务端生成 |
| `namespaceName` | `string` | **是** | 命名空间展示名 |
| `namespaceDesc` | `string` | 否 | 命名空间描述 |

#### 返回数据

成功则返回统一返回体，`data` 为 `true` 表示成功；失败则返回[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)。

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/core/namespace' \
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
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/core/namespace?namespaceId=test'
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
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/namespace/check?namespaceId=public'
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
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/namespace/list'
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
  "auth_enabled": "false",
  "version": "3.0.0-SNAPSHOT",
  "startup_mode": "standalone",
  "server_port": "8848"
}
```

### 1.20. 获取Nacos集群的存活状态

#### 接口描述

通过该接口，可以获取Nacos集群的存活状态，Nacos集群是否可正常接受和响应请求。

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

通过该接口，可以更新插件的配置。需要提供插件类型、名称及配置内容。支持 localOnly 仅作用于当前节点。

#### 请求方式

`PUT`

请求体类型：`application/json`。

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/plugin/config`

#### 请求参数

请求体为 JSON，包含以下字段：

| 参数名         | 类型       | 必填 | 参数描述           |
|-------------|----------|----|----------------|
| `pluginType` | `string` | **是** | 插件类型，如 auth。 |
| `pluginName` | `string` | **是** | 插件名称。 |
| `config` | `string` | **是** | 插件配置项。 |
| `localOnly` | `boolean` | 否 | 是否仅写本地，不持久化。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，`data` 为字符串表示操作结果。

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/core/plugin/config' \
  -H 'Content-Type: application/json' -d '{}'
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
| configurable | `boolean` | 是否可配置 |
| config | `object` | 配置内容 |
| configDefinitions | `array` | 配置定义列表 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/plugin/detail?pluginType=auth&pluginName=nacos-default-auth-plugin'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "pluginId": "auth:nacos-default-auth-plugin",
    "pluginType": "auth",
    "pluginName": "nacos-default-auth-plugin",
    "enabled": true,
    "critical": true,
    "configurable": true,
    "config": {},
    "configDefinitions": []
  }
}
```

### 1.24. 获取插件列表

#### 接口描述

通过该接口，可以获取所有插件列表，可按插件类型筛选。

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
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/plugin/list?pluginType=auth'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "pluginId": "auth:nacos-default-auth-plugin",
      "pluginType": "auth",
      "pluginName": "nacos-default-auth-plugin",
      "enabled": true,
      "critical": true,
      "configurable": true,
      "exclusive": true
    }
  ]
}
```

### 1.25. 启用或禁用插件

#### 接口描述

通过该接口，可以更新插件的启用状态（启用或禁用）。支持 localOnly 仅作用于当前节点。

#### 请求方式

`PUT`

请求体类型：`application/json`。

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/core/plugin/status`

#### 请求参数

请求体为 JSON，包含以下字段：

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
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/core/plugin/status' \
  -H 'Content-Type: application/json' -d '{}'
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
| `${type}HealthParams`    | `object`    | Health check parameters, including the maximum and minimum check intervals and random interval factor. These values are used to spread the next round of health check traffic. |

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
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ns/ops/switches' -d "entry=pushEnabled&value=false"
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

请求体类型：`application/json`。

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ns/ops/log`

#### 请求参数

| 参数名   | 类型       | 必填 | 参数描述        |
|-------|----------|---|-------------|

请求体字段：

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
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ns/ops/log' -H 'Content-Type: application/json' -d '{"logName":"com.example.Logger","logLevel":"DEBUG"}'
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

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/ns/client/list`

#### 请求参数

无

#### 返回数据

| 参数名    | 参数类型           | 描述      |
|--------|----------------|---------|
| `data` | `array` | Client ID list. |

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
| `port` | `integer` | 否 | None |

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
| `port` | `integer` | 否 | None |

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
| `ip`   | `string` | **是** | 客户端IP |
| `port` | `integer` | **是** | Client port. |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                 | 参数类型     | 描述       |
|---------------------|----------|----------|
| `responsibleServer` | `string` | 负责的服务器信息 |

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

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/ns/cluster`

#### 请求参数

| 参数名                     | 参数类型                  | 是否必填  | 描述                |
|-------------------------|-----------------------|-------|-------------------|
| `namespaceId` | `string` | 否 | 命名空间ID |
| `serviceName` | `string` | **是** | 服务名称 |
| `clusterName` | `string` | **是** | 集群名称 |
| `checkPort` | `integer` | 否 | 健康检查端口 |
| `useInstancePort4Check` | `boolean` | 否 | 是否使用实例端口进行健康检查 |
| `healthChecker` | `string` | 否 | 健康检查器配置（JSON 字符串） |
| `metadata` | `string` | 否 | 集群的扩展元数据，默认为`""` |
| `groupName` | `string` | 否 | - |

#### 返回数据

| 参数名    | 参数类型     | 描述     |
|--------|----------|--------|
| `data` | `string` | 操作结果信息 |

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

需对应命名空间的`写`权限

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

#### 返回数据

| 参数名    | 参数类型     | 描述     |
|--------|----------|--------|
| `data` | `string` | 操作结果信息 |

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

| **参数名**   | **参数类型**       | **描述**  |
|-----------|----------------|---------|
| `updated` | `array` | Updated instance list. |

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
| `data`         | `InstanceMetadataBatchOperationVo` | 操作结果信息  |
| `data.updated` | `array`                     | Updated instance list. |

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
| `ephemeral` | `boolean` | 否 | - |
| `groupName` | `string` | 否 | - |
| `healthy` | `boolean` | 否 | - |

#### 返回数据

| 参数名    | 参数类型     | 描述     |
|--------|----------|--------|
| `data` | `string` | 操作结果信息 |

#### 示例

* 请求示例

```shell
curl -X PUT "http://127.0.0.1:8848/nacos/v3/admin/ns/instance/partial" -d 'namespaceId=public&serviceName=example-service&ip=127.0.0.1&clusterName=DEFAULT&port=8080&weight=1.0&enabled=true&metadata={"key":"value"}'
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

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/ns/instance/list`

#### 请求参数

| **参数名**       | **参数类型**  | **是否必填** | **描述**                  |
|---------------|-----------|----------|-------------------------|
| `namespaceId` | `string` | 否 | 命名空间ID，默认`public` |
| `groupName` | `string` | 否 | 分组名称，默认为`DEFAULT_GROUP` |
| `serviceName` | `string` | **是** | 服务名称 |
| `clusterName` | `string` | 否 | Cluster name. If not provided, instances of all clusters will be returned. |
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
| `metadata`    | `map<string, string>`     | Instance metadata. |
| `instanceId`  | `string` | 实例Id                              |

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

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/ns/instance`

#### 请求参数

| **参数名**       | **参数类型** | **是否必填** | **描述说明**               |
|---------------|----------|----------|------------------------|
| `namespaceId` | `string` | 否        | 命名空间Id，默认为`public`     |
| `groupName`   | `string` | 否    | Group name. Defaults to `DEFAULT_GROUP`. |
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
| `metadata`    | `map<string, string>`     | Instance metadata. |
| `instanceId`  | `string` | 实例Id                              |

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
| `selector`                                          | `object` | Service selector. |
| `metadata`                                          | `object` | Service metadata. |
| `clusterMap`                                        | `object` | Service cluster map. The key is the cluster name and the value is the cluster details. |
| `clusterMap`.$ClusterName.`clusterName`             | `string` | 集群名。                                 |
| `clusterMap`.$ClusterName.`healthChecker`           | `object` | Health checker. |
| `clusterMap`.$ClusterName.`healthyCheckPort`        | `integer` | 健康检查端口。                              |
| `clusterMap`.$ClusterName.`useInstancePortForCheck` | `boolean` | 是否使用所注册的实例的`IP:Port`进行健康检查。          |
| `clusterMap`.$ClusterName.`metadata`                | `map<string, string>` | Cluster metadata. |

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

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/ns/service/list`

#### 请求参数

| 参数名           | 参数类型           | 是否必填  | 描述说明                   |
|---------------|----------------|-------|------------------------|
| `namespaceId` | `string` | 否 | 命名空间`Id`，默认为`public` |
| `pageNo` | `integer` | **是** | 当前页，默认为`1` |
| `pageSize` | `integer` | **是** | 页条目数，默认为`20`，最大为`500` |
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
| `pageItems`                           | `array`   | Service list.        |
| `pageItems`[i].`name`                 | `string` | 服务名。         |
| `pageItems`[i].`groupName`            | `string` | 服务的分组名。      |
| `pageItems`[i].`clusterCount`         | `string` | 服务下的集群数量。    |
| `pageItems`[i].`ipCount`              | `string` | 服务下的实例数量。    |
| `pageItems`[i].`healthyInstanceCount` | `string` | 服务下的健康实例数量。  |
| `pageItems`[i].`triggerFlag`          | `string` | 是否触发了服务的保护。  |

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
| `ephemeral` | `boolean` | 否 | - |

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

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/ns/service/subscribers`

#### 请求参数

| **参数名**       | **参数类型**  | **是否必填** | **描述**                  |
|---------------|-----------|----------|-------------------------|
| `namespaceId` | `string` | 否 | 命名空间ID，默认为`public` |
| `serviceName` | `string` | **是** | 服务名称 |
| `groupName` | `string` | 否 | 分组名称，默认是`DEFAULT_GROUP` |
| `pageNo` | `integer` | **是** | 页码 |
| `pageSize` | `integer` | **是** | 每页大小 |
| `aggregation` | `boolean` | 否 | 是否聚合,默认为`true` |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                          | 参数类型      | 描述                   |
|------------------------------|-----------|----------------------|
| `totalCount`                 | `integer` | 符合条件的服务的总数。          |
| `pageNumber`                 | `integer` | 当前页码，起始为`1`。         |
| `pagesAvailable`             | `integer` | 可用页码。                |
| `pageItems`                  | `array`    | Service list.                |
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

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/ns/service/selector/types`

#### 请求参数

无

#### 返回数据

| 参数名    | 参数类型           | 描述      |
|--------|----------------|---------|
| `data` | `array` | Selector type list. |

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
| `id`               | `string` | 配置在存储系统中的ID，一般为Long类型的字符串。 |
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

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/cs/config`

#### 请求参数

| 参数名           | 类型       | 必填    | 默认值      | 参数描述  |
|---------------|----------|-------|----------|-------|
| `namespaceId` | `string` | 否     | `public` | 命名空间  |
| `groupName`   | `string` | **是** | 无        | 配置分组名 |
| `dataId`      | `string` | **是** | 无        | 配置名   |

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

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/cs/config/batch`

#### 请求参数

| 参数名   | 参数类型         | 是否必填  | 描述     |
|-------|--------------|-------|--------|
| `ids` | `array` | **是** | Config ID list. Separate multiple IDs with commas. |

#### 返回数据

| 参数名    | 参数类型      | 描述   |
|--------|-----------|------|
| `data` | `boolean` | 操作结果 |

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

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/cs/config/listener`

#### 请求参数

| 参数名           | 参数类型      | 是否必填  | 默认值      | 描述        |
|---------------|-----------|-------|----------|-----------|
| `namespaceId` | `string` | 否     | `public` | 命名空间      |
| `dataId`      | `string` | **是** | 无        | 配置ID      |
| `groupName`   | `string` | **是** | 无        | 分组名称      |
| `aggregation` | `boolean` | 否 | `true`   | Whether to aggregate data from other nodes. |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名               | 参数类型                  | 描述                                    |
|-------------------|-----------------------|---------------------------------------|
| `queryType`       | `string` | 订阅者查询类型，该接口为`config`。                 |
| `listenersStatus` | `map<string, string>` | 订阅者列表，key为订阅者IP，value为订阅者订阅当前配置的MD5值。 |

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

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/cs/config/list`

#### 请求参数

| 参数名            | 参数类型      | 是否必填  | 默认值      | 描述                                                     |
|----------------|-----------|-------|----------|--------------------------------------------------------|
| `pageNo` | `integer` | **是** | 1 |
| `pageSize` | `integer` | **是** | 100 |
| `namespaceId` | `string` | 否 | `public` |
| `dataId` | `string` | **是** | `""` |
| `groupName` | `string` | **是** | `""` |
| `appName` | `string` | 否 |  |
| `configTags` | `string` | 否 |  |
| `type` | `string` | 否 |  |
| `configDetail` | `string` | **是** |  |
| `search` | `string` | 否 | Search mode: `blur` or `accurate`. Defaults to `blur`. |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                          | 参数类型     | 描述                         |
|------------------------------|----------|----------------------------|
| `totalCount`                 | `integer` | 符合规则的配置总数。                 |
| `pagesAvailable`             | `integer` | 可用页码总数。                    |
| `pageNumber`                 | `integer` | 当前页码。                      |
| `pageItems`                  | `array`   | Configurations matching the query criteria. |
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
| `id`               | `string` | beta配置的存储ID。                        |
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

Request body type: `multipart/form-data`. Parameters are sent in the request body.

#### 鉴权状态

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/cs/config/import`

#### 请求参数

| 参数名           | 参数类型               | 是否必填 | 默认值      | 描述     |
|---------------|--------------------|------|----------|--------|
| `namespaceId` | `string` | 否 | `public` |
| `src_user` | `string` | 否 | 无 |
| `policy` | `string` | 否 | `ABORT` |
| `file` | `MultipartFile` | 否 | ZIP file containing skill package |

#### 返回数据

| 参数名              | 参数类型                  | 描述     |
|------------------|-----------------------|--------|
| `data`           | `map<string, object>` | Import result. |
| `data.succCount` | `integer` | 成功导入数量 |
| `data.skipCount` | `integer` | 跳过导入数量 |

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

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/cs/config/export`

#### 请求参数

| 参数名           | 参数类型         | 是否必填 | 默认值      | 描述     |
|---------------|--------------|------|----------|--------|
| `namespaceId` | `string` | 否 | `public` |
| `groupName` | `string` | 否 | `""` |
| `dataId` | `string` | 否 | `""` |
| `ids` | `array` | 否 | None |
| `appName` | `string` | 否 | - |

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

需对应命名空间的`写`权限

#### 请求URL

`/nacos/v3/admin/cs/config/clone`

#### 请求参数

| 参数名       | 参数类型               | 是否必填 | 默认值     | 描述       |
|-----------|--------------------|------|---------|----------|
| `namespaceId` | `string` | **是** | `public` |
| `policy` | `string` | 否 | `ABORT` |
| `src_user` | `string` | 否 | - |

#### 请求参数

请求体类型为 `application/json`，为配置列表数组，每项为 `SameNamespaceCloneConfigBean`（`cfgId`、`dataId`、`group`）。

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名         | 参数类型      | 描述     |
|-------------|-----------|--------|
| `succCount` | `integer` | 成功导入数量 |
| `skipCount` | `integer` | 跳过导入数量 |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/clone' -d "namespaceId=test&policy=ABORT" \
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

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/cs/history/list`

#### 请求参数

| 参数名           | 类型       | 必填    | 默认值             | 参数描述  |
|---------------|----------|-------|-----------------|-------|
| `namespaceId` | `string` | 否     | `public`        | 命名空间  |
| `groupName`   | `string` | **是** | 无               | 配置分组名 |
| `dataId`      | `string` | **是** | 无               | 配置名   |
| `pageNo`      | `integer` | **是** | `1`             | 当前页   |
| `pageSize`    | `integer` | **是** | `100`（最大为`500`） | 页条目数  |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                          | 参数类型     | 描述                                |
|------------------------------|----------|-----------------------------------|
| `totalCount`                 | `integer` | 历史记录的总数。                          |
| `pageNumber`                 | `integer` | 当前页码，起始为`1`。                      |
| `pagesAvailable`             | `integer` | 可用页码。                             |
| `pageItems`                  | `array`   | History record list. |
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
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/history/list?dataId=nacos.example&groupName=DEFAULT_GROUP&namespaceId=public&pageNo=1&pageSize=100'
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
| `id`          | `string` | 历史记录的ID。                                                                    |
| `dataId`      | `string` | 配置的dataId。                                                                  |
| `groupName`   | `string` | 配置的groupName。                                                               |
| `namespaceId` | `string` | 配置所属的命名空间。                                                                  |
| `content`     | `string`     |
| `appName`     | `string` | 配置所属的appName。                                                               |
| `opType`      | `string` | 操作类型，`I`为插入、`U`为更新、`D`为删除。                                                  |
| `publishType` | `string` | 发布类型，`formal`为普通发布，`gray`为beta发布。                                           |
| `srcIp`       | `string` | 发布的来源IP。                                                                    |
| `srcUser`     | `string` | 发布的用户，仅在开启鉴权并登录用户后才发布配置才存在。                                                 |
| `createTime`  | `integer` | 配置创建时间。                                                                     |
| `modifyTime`  | `integer` | 配置修改时间。                                                                     |
| `grayName`    | `string` | 灰度发布规则名称, 固定为`beta`。                                                        |
| `extInfo`     | `string` | Extended information. It currently includes `src_user`, `type`, and `c_desc`; when `publishType` is `gray`, it also includes `grayRule`. |

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
| `id`          | `string` | 历史记录的ID。                                                                    |
| `dataId`      | `string` | 配置的dataId。                                                                  |
| `groupName`   | `string` | 配置的groupName。                                                               |
| `namespaceId` | `string` | 配置所属的命名空间。                                                                  |
| `content`     | `string`     |
| `appName`     | `string` | 配置所属的appName。                                                               |
| `opType`      | `string` | 操作类型，`I`为插入、`U`为更新、`D`为删除。                                                  |
| `publishType` | `string` | 发布类型，`formal`为普通发布，`gray`为beta发布。                                           |
| `srcIp`       | `string` | 发布的来源IP。                                                                    |
| `srcUser`     | `string` | 发布的用户，仅在开启鉴权并登录用户后才发布配置才存在。                                                 |
| `createTime`  | `integer` | 配置创建时间。                                                                     |
| `modifyTime`  | `integer` | 配置修改时间。                                                                     |
| `grayName`    | `string` | 灰度发布规则名称, 固定为`beta`。                                                        |
| `extInfo`     | `string` | Extended information. It currently includes `src_user`, `type`, and `c_desc`; when `publishType` is `gray`, it also includes `grayRule`. |

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
| `groupName` | `string` | **是** | 分组名称，与命名空间ID 两者必须有其一 |
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
| `data` | `string` | 操作结果 |

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
| `logName`  | `string` | **是** | 无   | 模块名称                  |
| `logLevel` | `string` | **是** | 无   | 日志级别（如`INFO`、`DEBUG`） |

#### 返回数据

| 参数名    | 参数类型     | 描述   |
|--------|----------|------|
| `data` | `string` | 操作结果 |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/cs/ops/log' -d "logName=config-server&logLevel=DEBUG"
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
| `sql` | `string` | **是** | 无   | SQL 查询语句 |

#### 返回数据

| 参数名    | 参数类型                        | 描述   |
|--------|-----------------------------|------|
| `data` | `array` | Query result. |

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

请求体类型：`multipart/form-data`，参数放在请求体中。

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/ops/derby/import`

#### 请求参数

| 参数名    | 参数类型            | 是否必填 | 默认值 | 描述           |
|--------|-----------------|------|-----|--------------|
| `file` | `MultipartFile` | 否    | 无   | 导入文件（SQL 文件）。 |

#### 返回数据

| 参数名    | 参数类型     | 描述     |
|--------|----------|--------|
| `data` | `string` | 导入结果信息 |

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
| `ip`          | `string` | **是**    | 无        | 客户端 IP 地址 |
| `dataId`      | `string` | 否        | 无        | 配置ID      |
| `groupName`   | `string` | 否        | 无        | 分组名称      |
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
| `ip`          | `string` | **是**    | 无        | 客户端 IP 地址 |
| `dataId`      | `string` | 否        | 无        | 配置ID      |
| `groupName`   | `string` | 否        | 无        | 分组名称      |
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

### 3.25. 更新配置元数据

#### 接口描述

通过该接口，可以更新配置的元数据信息：仅能更新`描述`和`标签`。

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

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型      | 描述   |
|--------|-----------|------|
| `data` | `boolean` | 操作结果 |

#### 示例

* 请求示例

```shell
curl -X PUT '127.0.0.1:8848/v3/admin/cs/config/metadata' \
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

### 3.26. Get Gray Configuration

#### 接口描述

This interface retrieves the details of a specified gray configuration.

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/config/gray`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace ID. Defaults to `public` when omitted. |
| `groupName` | `string` | **是** | Configuration group name. |
| `dataId` | `string` | **是** | Configuration ID. |
| `grayName` | `string` | **是** | Gray configuration name. |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.dataId | `string` | Configuration ID. |
| data.groupName | `string` | Configuration group name. |
| data.namespaceId | `string` | Namespace ID. |
| data.content | `string` | Gray configuration content. |
| data.grayName | `string` | Gray configuration name. |
| data.grayRule | `string` | Gray matching rule. |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/gray?namespaceId=public&groupName=DEFAULT_GROUP&dataId=example&grayName=gray'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 3.27. Publish Gray Configuration

#### 接口描述

This interface publishes a gray configuration using tagv2 gray matching rules.

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/config/gray`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace ID. Defaults to `public` when omitted. |
| `groupName` | `string` | **是** | Configuration group name. |
| `dataId` | `string` | **是** | Configuration ID. |
| `content` | `string` | **是** | Gray configuration content. |
| `grayName` | `string` | **是** | Gray configuration name. |
| `grayType` | `string` | 否 | Gray rule type. |
| `grayMatchRuleExp` | `string` | **是** | Gray matching rule expression. |
| `grayVersion` | `string` | **是** | Gray version. |
| `grayPriority` | `integer` | 否 | Gray rule priority. |
| `type` | `string` | 否 | Configuration type. |
| `srcUser` | `string` | 否 | Operator username. |
| `encryptedDataKey` | `string` | 否 | Data key for encrypted configuration content. |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data | `boolean` | Whether the gray configuration was published successfully. |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/gray' \
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

### 3.28. Delete Gray Configuration

#### 接口描述

This interface deletes a specified gray configuration.

#### 请求方式

`DELETE`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/cs/config/gray`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace ID. Defaults to `public` when omitted. |
| `groupName` | `string` | **是** | Configuration group name. |
| `dataId` | `string` | **是** | Configuration ID. |
| `grayName` | `string` | **是** | Gray configuration name. |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data | `boolean` | Whether the gray configuration was deleted successfully. |

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/gray?namespaceId=public&groupName=DEFAULT_GROUP&dataId=example&grayName=gray'
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

### 4.1. 查询MCP服务的服务列表

#### 接口描述

通过该接口，可以查询托管在Nacos上的MCP服务的服务列表。

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/ai/mcp/list`

#### 请求参数

| 参数名           | 参数类型     | 是否必填  | 描述                                                     |
|---------------|----------|-------|--------------------------------------------------------|
| `pageNo` | `integer` | **是** | 当前页，默认为`1` |
| `pageSize` | `integer` | **是** | 页条目数，默认为`20`，最大为`500` |
| `namespaceId` | `string` | 否 | MCP服务的命名空间ID，默认为`public` |
| `mcpName` | `string` | 否 | MCP服务的名字模版，为空时查询所有MCP服务，当`search`为`blur`时，可使用`*`进行模糊搜索 |
| `search` | `string` | 否 | Search mode: `blur` or `accurate`. Defaults to `blur`. |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                           | 参数类型                  | 描述                                                                                              |
|-----------------------------------------------|-----------------------|-------------------------------------------------------------------------------------------------|
| `totalCount`                                  | `integer` | 符合条件的服务的总数。                                                                                     |
| `pageNumber`                                  | `integer` | 当前页码，起始为`1`。                                                                                    |
| `pagesAvailable`                              | `integer` | 可用页码。                                                                                           |
| `pageItems`                                   | `array`               | Service list.                                                                                       |
| `pageItems`[i].`id`                           | `string` | MCP service ID, usually a UUID.                                                                      |
| `pageItems`[i].`name`                         | `string` | MCP service name.                                                                                    |
| `pageItems`[i].`protocol`                     | `string` | MCP protocol, such as `stdio`, `sse`, `streamable`, `http`, or `dubbo`.                               |
| `pageItems`[i].`frontProtocol`                | `string` | Frontend protocol exposed by the MCP service, usually for protocol converters such as gateways. If no converter is used, it is the same as `protocol`. |
| `pageItems`[i].`description`                  | `string` | MCP service description.                                                                             |
| `pageItems`[i].`repository`                   | `string` | MCP service repository.                                                                               |
| `pageItems`[i].`versionDetail`                | `object`              | Latest version information of the MCP service.                                                        |
| `pageItems`[i].`localServerConfig`            | `map<string, object>` | Startup information for a local MCP service when the MCP service type is **stdio**.                    |
| `pageItems`[i].`remoteServerConfig`           | `object`              | Remote service information when the MCP service type is **not stdio**.                                |
| `pageItems`[i].`latestPublishedVersion`       | `string` | Latest published version of the MCP service.                                                          |
| `pageItems`[i].`versionDetails`               | `array`               | MCP service version details.                                                                          |
| `pageItems`[i].`capabilities`                 | `array`               | Capability types supported by the MCP service, such as `TOOL`, `PROMPT`, and `RESOURCE`.              |

其中`VersionDetail`结构如下：

| 参数名            | 参数类型      | 描述               |
|----------------|-----------|------------------|
| `version`      | `string` | MCP service version.       |
| `release_date` | `string` | MCP service release time.  |
| `is_latest`    | `boolean` | Whether this is the latest version of the MCP service. |

#### 示例

* 请求示例

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/admin/ai/mcp/list?pageNo=1&pageSize=100&namespaceId=public&search=blur'
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
| `mcpId`       | `string` | 否     | MCP服务的ID，一般为UUID，与`mcpName`二选一输入，建议传入此值。 |
| `mcpName`     | `string` | 否     | MCP服务的名字模版，与`mcpId`二选一输入，建议传入`mcpId`。    |
| `version`     | `string` | 否     | MCP服务的版本，未传入是返回最新版本                      |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                  | 参数类型                  | 描述                                                                                              |
|----------------------|-----------------------|-------------------------------------------------------------------------------------------------|
| `id`                 | `string` | MCP服务的ID，一般为UUID。                                                                               |
| `name`               | `string` | MCP服务名。                                                                                         |
| `namespaceId`        | `string` | MCP服务所属的命名空间ID。                                                                                 |
| `protocol`           | `string` | MCP的协议，如`stdio`,`sse`,`streamable`,`http`,`dubbo`等。                                             |
| `frontProtocol`      | `string` | MCP的前端暴露协议，一般是提供给协议转换器（如网关）使用，若无转换器，则与`protocol`相同，如`stdio`,`sse`,`streamable`,`http`,`dubbo`等。 |
| `description`        | `string` | MCP服务的描述。                                                                                       |
| `repository`         | `string` | MCP服务的存储仓库。                                                                                     |                                                                                          |
| `versionDetail`      | `object`              | Queried version information of the MCP service.                                                        |
| `localServerConfig`  | `map<string, object>` | Startup information for a local MCP service when the MCP service type is **stdio**.                    |
| `remoteServerConfig` | `object`              | Remote service information when the MCP service type is **not stdio**.                                |
| `enabled`            | `boolean` | MCP服务是否启用。                                                                                      |
| `capabilities`       | `array`               | Capability types supported by the MCP service, such as `TOOL`, `PROMPT`, and `RESOURCE`.              |
| `backendEndpoints`   | `array`               | Backend endpoint details when the MCP service type is **not stdio**.                                  |
| `toolSpec`           | `map<string, object>` | Tool details when the MCP service supports the `TOOL` capability.                                    |
| `allVersions`        | `array`               | All version details of the MCP service.                                                              |

其中`VersionDetail`结构如下：

| 参数名            | 参数类型      | 描述               |
|----------------|-----------|------------------|
| `version`      | `string` | MCP service version.       |
| `release_date` | `string` | MCP service release time.  |
| `is_latest`    | `boolean` | Whether this is the latest version of the MCP service. |

#### 示例

* 请求示例

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/admin/ai/mcp?namespaceId=public&mcpName=test&mcpId=d7a64724-a556-4fe4-82fa-e806d43e00dc'
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
| `serverSpecification` | `string` | **是** | MCP服务的描述详情 |
| `toolSpecification` | `string` | 否 | MCP服务的工具描述详情 |
| `endpointSpecification` | `string` | 否 | MCP服务的远端服务地址详情，仅在非`stdio`协议时生效 |
| `overrideExisting` | `boolean` | 否 | MCP服务更新时是否覆盖原 endpointSpecification，仅在非`stdio`协议时生效 |
| `latest` | `boolean` | 否 | - |

其中`serverSpecification`、`toolSpecification`、`endpointSpecification`参数的详细内容如下：

> serverSpecification

| 参数名                  | 参数类型                  | 描述                                                                                              |
|----------------------|-----------------------|-------------------------------------------------------------------------------------------------|
| `id`                 | `string` | MCP服务的ID，一般为UUID，必须传入，用于定位待更新的MCP服务。                                                            |
| `name`               | `string` | MCP服务名。                                                                                         |
| `protocol`           | `string` | MCP的协议，如`stdio`,`sse`,`streamable`,`http`,`dubbo`等。                                             |
| `frontProtocol`      | `string` | MCP的前端暴露协议，一般是提供给协议转换器（如网关）使用，若无转换器，则与`protocol`相同，如`stdio`,`sse`,`streamable`,`http`,`dubbo`等。 |
| `description`        | `string` | MCP服务的描述。                                                                                       |
| `repository`         | `string` | MCP服务的存储仓库。                                                                                     |    |
| `versionDetail`      | `object`              | MCP service version information.                                                                      |
| `version`            | `string` | MCP服务的简易版本版本信息，主要用于兼容，若已设置`versionDetail`,则该字段无效。                                               |    |
| `localServerConfig`  | `map<string, object>` | Startup information for a local MCP service when the MCP service type is **stdio**.                    |
| `remoteServerConfig` | `object`              | Remote service information when the MCP service type is **not stdio**.                                |
| `enabled`            | `boolean` | MCP服务是否启用。                                                                                      |
| `capabilities`       | `array`               | Capability types supported by the MCP service, such as `TOOL`, `PROMPT`, and `RESOURCE`.              |

其中`VersionDetail`结构如下：

| 参数名            | 参数类型      | 描述               |
|----------------|-----------|------------------|
| `version`      | `string` | MCP服务的版本号。       |
| `release_date` | `string` | MCP服务的版本发布时间。    |
| `is_latest`    | `boolean` | MCP服务的版本是否为最新版本。 |

> toolSpecification

| 参数名               | 参数类型                       | 描述                                                                                      |
|-------------------|----------------------------|-----------------------------------------------------------------------------------------|
| `tools`           | `array`                   | Tool list provided by the MCP Server. See the standard MCP protocol definition of MCP Tool. |
| `toolsMeta`       | `map<string, object>`     | Extra metadata for tools provided by the MCP Server. This can extend information not defined in the standard MCP protocol. The key is the `name` of `McpTool`, and the value is the extended metadata. |
| `securitySchemes` | `array`                   | MCP tool security schemes. See the standard MCP protocol. |

其中`McpTool`结构如下：

| 参数名           | 参数类型                  | 描述                                            |
|---------------|-----------------------|-----------------------------------------------|
| `name`        | `string` | MCP 工具的名称                                     |
| `description` | `string` | MCP 工具的描述                                     |
| `inputSchema` | `map<string, object>` | MCP tool input schema. See the standard MCP protocol; it mainly includes type, required flag, and description. |

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
curl -X PUT '127.0.0.1:8848/nacos/v3/admin/ai/mcp' \
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
| `serverSpecification` | `string` | **是** | MCP服务的描述详情 |
| `toolSpecification` | `string` | 否 | MCP服务的工具描述详情 |
| `endpointSpecification` | `string` | 否 | MCP服务的远端服务地址详情，仅在非`stdio`协议时生效 |

其中`serverSpecification`、`toolSpecification`、`endpointSpecification`参数的详细内容如下：

> serverSpecification

| 参数名                  | 参数类型                  | 描述                                                                                              |
|----------------------|-----------------------|-------------------------------------------------------------------------------------------------|
| `id`                 | `string` | MCP服务的ID，一般为UUID，无需传入，系统自动生成。                                                                   |
| `name`               | `string` | MCP服务名。                                                                                         |
| `protocol`           | `string` | MCP的协议，如`stdio`,`sse`,`streamable`,`http`,`dubbo`等。                                             |
| `frontProtocol`      | `string` | MCP的前端暴露协议，一般是提供给协议转换器（如网关）使用，若无转换器，则与`protocol`相同，如`stdio`,`sse`,`streamable`,`http`,`dubbo`等。 |
| `description`        | `string` | MCP服务的描述。                                                                                       |
| `repository`         | `string` | MCP服务的存储仓库。                                                                                     |    |
| `versionDetail`      | `object`              | MCP service version information.                                                                      |
| `version`            | `string` | MCP服务的简易版本版本信息，主要用于兼容，若已设置`versionDetail`,则该字段无效。                                               |    |
| `localServerConfig`  | `map<string, object>` | Startup information for a local MCP service when the MCP service type is **stdio**.                    |
| `remoteServerConfig` | `object`              | Remote service information when the MCP service type is **not stdio**.                                |
| `enabled`            | `boolean` | MCP服务是否启用。                                                                                      |
| `capabilities`       | `array`               | Capability types supported by the MCP service, such as `TOOL`, `PROMPT`, and `RESOURCE`.              |

其中`VersionDetail`结构如下：

| 参数名            | 参数类型      | 描述               |
|----------------|-----------|------------------|
| `version`      | `string` | MCP服务的版本号。       |
| `release_date` | `string` | MCP服务的版本发布时间。    |
| `is_latest`    | `boolean` | MCP服务的版本是否为最新版本。 |

> toolSpecification

| 参数名               | 参数类型                       | 描述                                                                                      |
|-------------------|----------------------------|-----------------------------------------------------------------------------------------|
| `tools`           | `array`                   | Tool list provided by the MCP Server. See the standard MCP protocol definition of MCP Tool. |
| `toolsMeta`       | `map<string, object>`     | Extra metadata for tools provided by the MCP Server. This can extend information not defined in the standard MCP protocol. The key is the `name` of `McpTool`, and the value is the extended metadata. |
| `securitySchemes` | `array`                   | MCP tool security schemes. See the standard MCP protocol. |

其中`McpTool`结构如下：

| 参数名           | 参数类型                  | 描述                                            |
|---------------|-----------------------|-----------------------------------------------|
| `name`        | `string` | MCP 工具的名称                                     |
| `description` | `string` | MCP 工具的描述                                     |
| `inputSchema` | `map<string, object>` | MCP tool input schema. See the standard MCP protocol; it mainly includes type, required flag, and description. |

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
curl -X POST '127.0.0.1:8848/nacos/v3/admin/ai/mcp' \
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
| `mcpId`       | `string` | 否     | MCP服务的ID，一般为UUID，与`mcpName`二选一输入，建议传入此值。 |
| `mcpName`     | `string` | 否     | MCP服务的名字模版，与`mcpId`二选一输入，建议传入`mcpId`。    |
| `version`     | `string` | 否     | MCP服务的版本，未传入是为最新版本                       |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述         |
|--------|----------|------------|
| `data` | `string` | MCP服务删除结果。 |

#### 示例

* 请求示例

```shell
curl -X DELETE '127.0.0.1:8848/nacos/v3/admin/ai/mcp?namespaceId=public&mcpName=test&mcpId=d7a64724-a556-4fe4-82fa-e806d43e00dc'
```
* 返回示例

```json
{
   "code" : 0,
   "message" : "success",
   "data" : "ok"
}
```

## 5. A2A注册中心

### 5.1. 查询指定AgentCard的版本列表

#### 接口描述

通过该接口，可以查询指定托管在Nacos上的AgentCard的版本列表。

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

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                   | 参数类型      | 描述              |
|-----------------------|-----------|-----------------|
| `data`[i].`version`   | `string` | AgentCard的版本号。  |
| `data`[i].`createdAt` | `string` | 该版本的创建时间。       |
| `data`[i].`updatedAt` | `string` | 该版本的最后更新时间。     |
| `data`[i].`latest`    | `boolean` | 该版本是否标记为最新发布版本。 |

#### 示例

* 请求示例

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/admin/ai/a2a/version/list?namespaceId=public&agentName=GeoSpatial+Route+Planner+Agent'
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

#### 请求方式

`GET`

#### 鉴权状态

需对应命名空间的`读`权限

#### 请求URL

`/nacos/v3/admin/ai/a2a/list`

#### 请求参数

| 参数名           | 参数类型     | 是否必填  | 描述                                              |
|---------------|----------|-------|-------------------------------------------------|
| `pageNo` | `integer` | **是** | 当前页，默认为`1` |
| `pageSize` | `integer` | **是** | 页条目数，默认为`100` |
| `namespaceId` | `string` | 否 | AgentCard的命名空间ID，默认为`public` |
| `agentName` | `string` | 否 | AgentCard的名称，为空是查询所有AgentCard |
| `search` | `string` | 否 | blur or accurate |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                     | 参数类型                       | 描述                                                                                                     |
|-----------------------------------------|----------------------------|--------------------------------------------------------------------------------------------------------|
| `totalCount`                            | `integer` | 符合条件的服务的总数。                                                                                            |
| `pageNumber`                            | `integer` | 当前页码，起始为`1`。                                                                                           |
| `pagesAvailable`                        | `integer` | 可用页码。                                                                                                  |
| `pageItems`                             | `array`                    | Service list.                                                                                              |
| `pageItems`[i].`protocolVersion`        | `string` | A2A protocol version of the AgentCard.                                                                      |
| `pageItems`[i].`name`                   | `string` | AgentCard name.                                                                                           |
| `pageItems`[i].`description`            | `string` | AgentCard description.                                                                                    |
| `pageItems`[i].`version`                | `string` | AgentCard version.                                                                                        |
| `pageItems`[i].`iconUrl`                | `string` | AgentCard icon URL.                                                                                       |
| `pageItems`[i].`capabilities`           | `object`                   | AgentCard capabilities, matching [A2A standard capabilities](https://a2a-protocol.org/latest/specification/#552-agentcapabilities-object). |
| `pageItems`[i].`skills`                 | `array`                    | AgentCard skill list, matching [A2A standard skill](https://a2a-protocol.org/latest/specification/#554-agentskill-object). |
| `pageItems`[i].`latestPublishedVersion` | `string` | Latest published version of the AgentCard.                                                                 |
| `pageItems`[i].`versionDetails`         | `array`                    | All version details of the AgentCard.                                                                      |
| `pageItems`[i].`registrationType`       | `string` | Default registration type of the AgentCard. Optional values are `URL` and `SERVICE`.                       |

其中`AgentVersionDetail`包含内容如下：

| 参数名         | 参数类型      | 描述              |
|-------------|-----------|-----------------|
| `version`   | `string` | AgentCard version. |
| `createdAt` | `string` | Creation time of this version. |
| `updatedAt` | `string` | Last update time of this version. |
| `latest`    | `boolean` | Whether this version is marked as the latest published version. |

#### 示例

* 请求示例

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/admin/ai/a2a/list?pageNo=1&pageSize=100&namespaceId=public&search=blur'
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

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                 | 参数类型                              | 描述                                                                                                       |
|-------------------------------------|-----------------------------------|----------------------------------------------------------------------------------------------------------|
| `protocolVersion`                   | `string` | AgentCard的A2A协议版本。                                                                                       |
| `name`                              | `string` | AgentCard的名称。                                                                                            |
| `description`                       | `string` | AgentCard的描述。                                                                                            |
| `version`                           | `string` | AgentCard的版本号。                                                                                           |
| `iconUrl`                           | `string` | AgentCard的iconURL。                                                                                       |
| `capabilities`                      | `object`                         | AgentCard capabilities, matching [A2A standard capabilities](https://a2a-protocol.org/latest/specification/#552-agentcapabilities-object). |
| `skills`                            | `array`                          | AgentCard skill list, matching [A2A standard skill](https://a2a-protocol.org/latest/specification/#554-agentskill-object). |
| `url`                               | `string` | AgentCard的默认访问的URL。                                                                                      |
| `preferredTransport`                | `string` | AgentCard的默认访问URL的传输协议，应该为`JSONRPC`,`GRPC`,`HTTP+JSON`。                                                  |
| `additionalInterfaces`              | `array`                          | All accessible interfaces of the AgentCard, matching the [A2A standard](https://a2a-protocol.org/latest/specification/#555-agentinterface-object). |
| `provider`                          | `object`                         | AgentCard provider information, matching the [A2A standard](https://a2a-protocol.org/latest/specification/#551-agentprovider-object). |
| `documentationUrl`                  | `string` | AgentCard的文档 URL。                                                                                        |
| `securitySchemes`                   | `map<string, object>`             | AgentCard security scheme definitions, matching the [A2A standard](https://a2a-protocol.org/latest/specification/#553-securityscheme-object). |
| `security`                          | `array`                          | All security requirement objects of the AgentCard. |
| `defaultInputModes`                 | `array`                          | All default input modes of the AgentCard. |
| `defaultOutputModes`                | `array`                          | All default output modes of the AgentCard. |
| `supportsAuthenticatedExtendedCard` | `string` | AgentCard是否支持认证的扩展卡。                                                                                     |
| `registrationType`                  | `string` | AgentCard的默认注册类型，可选`URL`和`SERVICE`。                                                                      |
| `latestVersion`                     | `string` | AgentCard当前版本时否为最新版本。                                                                                    |

#### 示例

* 请求示例

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/admin/ai/a2a?namespaceId=public&agentName=GeoSpatial+Route+Planner+Agent&version=1.0.0&registrationType=SERVICE'
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

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述               |
|--------|----------|------------------|
| `data` | `string` | AgentCard服务更新结果。 |

#### 示例

* 请求示例

```shell
curl -X PUT '127.0.0.1:8848/nacos/v3/admin/ai/a2a' \
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

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述             |
|--------|----------|----------------|
| `data` | `string` | AgentCard发布结果。 |

#### 示例

* 请求示例

```shell
curl -X POST '127.0.0.1:8848/nacos/v3/admin/ai/a2a' \
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

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述             |
|--------|----------|----------------|
| `data` | `string` | AgentCard删除结果。 |

#### 示例

* 请求示例

```shell
curl -X DELETE '127.0.0.1:8848/nacos/v3/admin/ai/a2a?namespaceId=public&agentName=GeoSpatial+Route+Planner+Agent&version=1.0.0'
```
* 返回示例

```json
{
  "code" : 0,
  "message" : "success",
  "data" : "ok"
}
```

## 6. AI Prompt Management

### 6.1. Publish Prompt

#### 接口描述

This API publishes a new Prompt version.

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. Defaults to `public`. |
| `promptKey` | `string` | **是** | Prompt key. |
| `version` | `string` | **是** | Version. |
| `template` | `string` | 否 | Template content. |
| `commitMsg` | `string` | 否 | Commit message. |
| `description` | `string` | 否 | Description. |
| `bizTags` | `string` | 否 | Business tags. |
| `variables` | `string` | 否 | Prompt template variable definitions as a JSON string. |

#### 返回数据

On success, the API returns the common response body with `data` set to `true`; on failure, it returns the [Nacos OpenAPI common response format](../user/overview/api-overview.md#32-http-api-统一返回体格式).

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt' \
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

### 6.2. Delete Prompt

#### 接口描述

This API deletes the specified Prompt.

#### 请求方式

`DELETE`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `promptKey` | `string` | **是** | Prompt key. |

#### 返回数据

On success, the API returns the common response body with `data` set to `true`; on failure, it returns the [Nacos OpenAPI common response format](../user/overview/api-overview.md#32-http-api-统一返回体格式).

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt?namespaceId=public&promptKey=my-prompt'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 6.3. Get Prompt Detail

#### 接口描述

This API queries Prompt details by version or label.

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/detail`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `promptKey` | `string` | **是** | Prompt key. |
| `version` | `string` | 否 | Version. |
| `label` | `string` | 否 | Label. |
| `md5` | `string` | 否 | Content MD5. |

#### 返回数据

The response body follows the [Nacos OpenAPI common response format](../user/overview/api-overview.md#32-http-api-统一返回体格式). `data` contains fields such as `promptKey`, `version`, `template`, `commitMsg`, and `md5`.

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt/detail?namespaceId=public&promptKey=my-prompt&version=1.0.0'
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

### 6.4. Bind Label

#### 接口描述

This API binds a label to the specified Prompt version.

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/label`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `promptKey` | `string` | **是** | Prompt key. |
| `label` | `string` | **是** | Label name. |
| `version` | `string` | **是** | Version. |

#### 返回数据

On success, the API returns the common response body with `data` set to `true`; on failure, it returns the [Nacos OpenAPI common response format](../user/overview/api-overview.md#32-http-api-统一返回体格式).

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt/label' \
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

### 6.5. Unbind Label

#### 接口描述

This API unbinds a label from a Prompt.

#### 请求方式

`DELETE`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/label`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `promptKey` | `string` | **是** | Prompt key. |
| `label` | `string` | **是** | Label name. |

#### 返回数据

On success, the API returns the common response body with `data` set to `true`; on failure, it returns the [Nacos OpenAPI common response format](../user/overview/api-overview.md#32-http-api-统一返回体格式).

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt/label?namespaceId=public&promptKey=my-prompt&label=stable'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 6.6. List Prompts

#### 接口描述

This API queries Prompts by page.

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/list`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pageNo` | `integer` | **是** | Page number. |
| `pageSize` | `integer` | **是** | Number of records per page. |
| `namespaceId` | `string` | 否 | Namespace. |
| `promptKey` | `string` | 否 | Prompt key filter. |
| `search` | `string` | 否 | Search mode: `blur` or `accurate`. |
| `bizTags` | `string` | 否 | Business tags. |

#### 返回数据

The response body follows the [Nacos OpenAPI common response format](../user/overview/api-overview.md#32-http-api-统一返回体格式). `data` is a paginated object that contains fields such as `totalCount`, `pageNumber`, `pagesAvailable`, and `pageItems`.

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt/list?pageNo=1&pageSize=10&namespaceId=public&search=blur'
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

### 6.7. Get Prompt Metadata

#### 接口描述

This API queries metadata of the specified Prompt.

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/metadata`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `promptKey` | `string` | **是** | Prompt key. |

#### 返回数据

The response body follows the [Nacos OpenAPI common response format](../user/overview/api-overview.md#32-http-api-统一返回体格式). `data` contains fields such as `promptKey`, `description`, `bizTags`, `latestVersion`, `versions`, and `labels`.

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt/metadata?namespaceId=public&promptKey=my-prompt'
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

### 6.8. Update Prompt Metadata

#### 接口描述

This API updates Prompt metadata, such as description and business tags.

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/metadata`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `promptKey` | `string` | **是** | Prompt key. |
| `description` | `string` | 否 | Description. |
| `bizTags` | `string` | 否 | Business tags. |

#### 返回数据

On success, the API returns the common response body with `data` set to `true`; on failure, it returns the [Nacos OpenAPI common response format](../user/overview/api-overview.md#32-http-api-统一返回体格式).

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt/metadata' \
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

### 6.9. List Prompt Versions

#### 接口描述

This API queries versions of the specified Prompt by page.

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/versions`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `promptKey` | `string` | **是** | Prompt key. |
| `pageNo` | `integer` | **是** | Page number. |
| `pageSize` | `integer` | **是** | Number of records per page. |

#### 返回数据

The response body follows the [Nacos OpenAPI common response format](../user/overview/api-overview.md#32-http-api-统一返回体格式). `data` is a paginated object that contains `totalCount`, `pageNumber`, `pagesAvailable`, and `pageItems`; each item contains fields such as `version`, `commitMsg`, and `gmtModified`.

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt/versions?namespaceId=public&promptKey=my-prompt&pageNo=1&pageSize=10'
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

### 6.10. Update Prompt Business Tags

#### 接口描述

This API updates Prompt business tags.

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/biz-tags`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `promptKey` | `string` | **是** | Prompt key. |
| `bizTags` | `string` | 否 | Business tags. |

### 6.11. Update Prompt Description

#### 接口描述

This API updates the Prompt description.

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/description`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `promptKey` | `string` | **是** | Prompt key. |
| `description` | `string` | **是** | Description. |

### 6.12. Create Prompt Draft

#### 接口描述

This API creates a Prompt draft version, or recreates a draft from an existing version.

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `promptKey` | `string` | **是** | Prompt key. |
| `basedOnVersion` | `string` | 否 | Version to base the draft on. |
| `targetVersion` | `string` | 否 | Target version. |
| `template` | `string` | 否 | Template content. |
| `variables` | `string` | 否 | Prompt template variable definitions as a JSON string. |
| `commitMsg` | `string` | 否 | Commit message. |
| `description` | `string` | 否 | Description. |
| `bizTags` | `string` | 否 | Business tags. |

### 6.13. Update Prompt Draft

#### 接口描述

This API updates the current Prompt draft content.

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `promptKey` | `string` | **是** | Prompt key. |
| `template` | `string` | **是** | Template content. |
| `variables` | `string` | 否 | Prompt template variable definitions as a JSON string. |
| `commitMsg` | `string` | 否 | Commit message. |

### 6.14. Delete Prompt Draft

#### 接口描述

This API deletes the current Prompt draft version.

#### 请求方式

`DELETE`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `promptKey` | `string` | **是** | Prompt key. |

### 6.15. Force Publish Prompt Version

#### 接口描述

This API force-publishes a Prompt version while bypassing pipeline validation.

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/force-publish`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `promptKey` | `string` | **是** | Prompt key. |
| `version` | `string` | **是** | Version number. |
| `updateLatestLabel` | `boolean` | 否 | Whether to update the `latest` label after publishing. |

### 6.16. Get Prompt Governance Details

#### 接口描述

This API retrieves Prompt metadata, version governance information, and version summaries.

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/governance`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `promptKey` | `string` | **是** | Prompt key. |

### 6.17. Update Prompt Labels

#### 接口描述

This API updates the runtime routing labels of a Prompt.

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/labels`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `promptKey` | `string` | **是** | Prompt key. |
| `labels` | `string` | **是** | Label JSON string. |

### 6.18. Offline Prompt Version

#### 接口描述

This API takes a specified Prompt version offline.

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/offline`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `promptKey` | `string` | **是** | Prompt key. |
| `version` | `string` | **是** | Version number. |

### 6.19. Online Prompt Version

#### 接口描述

This API brings a specified Prompt version online.

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/online`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `promptKey` | `string` | **是** | Prompt key. |
| `version` | `string` | **是** | Version number. |

### 6.20. Publish Prompt Version

#### 接口描述

This API publishes an approved Prompt version.

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/publish`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `promptKey` | `string` | **是** | Prompt key. |
| `version` | `string` | **是** | Version number. |
| `updateLatestLabel` | `boolean` | 否 | Whether to update the `latest` label after publishing. |

### 6.21. Redraft Prompt Version

#### 接口描述

This API converts a reviewed Prompt version back to a draft.

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/redraft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `promptKey` | `string` | **是** | Prompt key. |
| `version` | `string` | **是** | Version number. |

### 6.22. Submit Prompt Version for Review

#### 接口描述

This API submits a Prompt version to the pipeline for review.

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/submit`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `promptKey` | `string` | **是** | Prompt key. |
| `version` | `string` | 否 | Version number. |

### 6.23. Get Prompt Version Details

#### 接口描述

This API retrieves details of a specified Prompt version.

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/version`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `promptKey` | `string` | **是** | Prompt key. |
| `version` | `string` | 否 | Version number. |

### 6.24. Download Prompt Version

#### 接口描述

This API downloads a specified Prompt version as a Markdown file.

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/prompt/version/download`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `promptKey` | `string` | **是** | Prompt key. |
| `version` | `string` | 否 | Version number. |

## 7. AI Skills Management

### 7.1. Get Skill Details

#### 接口描述

This API obtains the details of a specified skill by namespace and skill name.

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `skillName` | `string` | **是** | Skill name. |

#### 返回数据

The response follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-统一返回体格式). `data` contains fields such as name, description, instruction, resource, version, inputModes, and outputModes.

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills?namespaceId=public&skillName=my-skill'
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

### 7.2. Create Skill Draft Version

#### 接口描述

This API creates a draft version of a skill based on an existing version or a new SkillCard.

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `skillName` | `string` | 否 | Skill name. |
| `basedOnVersion` | `string` | 否 | Create the draft based on this version. |
| `targetVersion` | `string` | 否 | Target version. |
| `skillCard` | `string` | 否 | Skill card JSON; required if basedOnVersion is not set |

#### 返回数据

On success, returns the unified response body with `data` as a string indicating the draft creation result. On failure, returns the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-统一返回体格式).

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/draft' \
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

### 7.3. Update Skill Draft Content

#### 接口描述

This API updates the SkillCard content of the current skill draft version.

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `skillCard` | `string` | **是** | Skill card JSON string containing complete Skill information |
| `skillName` | `string` | **是** | Skill name. |

#### 返回数据

On success, returns the unified response body with `data` as a string indicating the draft update result. On failure, returns the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-统一返回体格式).

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/draft' \
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

### 7.4. Delete Skill

#### 接口描述

This API deletes a skill from Nacos by namespace and skill name.

#### 请求方式

`DELETE`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `skillName` | `string` | **是** | Skill name. |

#### 返回数据

On success, returns the unified response body with `data` as a string indicating the operation result, such as "ok". On failure, returns the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-统一返回体格式).

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills?namespaceId=public&skillName=my-skill'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 7.5. List Skills

#### 接口描述

This API filters and paginates the skill list by query conditions.

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/list`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pageNo` | `integer` | **是** | Page number. |
| `pageSize` | `integer` | **是** | Page size. |
| `filterableForm` | `string` | **是** | Filter condition form. |
| `namespaceId` | `string` | 否 | Namespace. |
| `skillName` | `string` | 否 | Skill name filter. |
| `search` | `string` | 否 | Search mode: accurate or blur |

#### 返回数据

The response follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-统一返回体格式). `data` is a pagination structure containing totalCount, pageNumber, pagesAvailable, and pageItems. Each item includes fields such as name, description, and updateTime.

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/list?pageNo=1&pageSize=100&namespaceId=public&search=blur'
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

### 7.6. Upload Skill from ZIP File

#### 接口描述

This API uploads a ZIP package in multipart/form-data format and registers the skill. The file must be a valid skill package.

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
| `namespaceId` | `string` | 否 | Namespace ID. Defaults to `public`. |
| `overwrite` | `boolean` | 否 | Whether to overwrite an existing skill with the same name. |
| `targetVersion` | `string` | 否 | Target version after upload. |
| `commitMsg` | `string` | 否 | Commit message. |
| `file` | `file` | 否 | ZIP file containing skill package. |

#### 返回数据

On success, returns the unified response body with `data` as the uploaded skill name. On failure, returns the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-统一返回体格式).

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/upload' \
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

### 7.7. Delete Skill Draft Version

#### 接口描述

This API deletes the current draft version of a specified skill.

#### 请求方式

`DELETE`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `skillName` | `string` | **是** | Skill name. |

### 7.8. Update Skill Business Tags

#### 接口描述

This API updates the business tag list of a skill without changing the version status.

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/biz-tags`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `skillName` | `string` | **是** | Skill name. |
| `bizTags` | `string` | **是** | Business tags. |

### 7.9. Update Skill Version Labels

#### 接口描述

This API updates the version routing labels of a skill, such as latest.

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/labels`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `skillName` | `string` | **是** | Skill name. |
| `labels` | `string` | **是** | Label JSON string. |

### 7.10. Skill Version Online, Offline, and Publish Operations

#### 接口描述

The following APIs are used to control the skill version publishing workflow.

#### 请求参数

| Method | Request URL | Key parameters |
|--------|----------|----------|
| `POST` | `/nacos/v3/admin/ai/skills/offline` | `namespaceId`、`skillName`、`scope`、`version` |
| `POST` | `/nacos/v3/admin/ai/skills/online` | `namespaceId`、`skillName`、`scope`、`version` |
| `POST` | `/nacos/v3/admin/ai/skills/publish` | `namespaceId`、`skillName`、`version`、`updateLatestLabel` |
| `PUT` | `/nacos/v3/admin/ai/skills/scope` | `namespaceId`、`skillName`、`scope` |
| `POST` | `/nacos/v3/admin/ai/skills/submit` | `namespaceId`、`skillName`、`version` |

### 7.11. Get Skill Version Details

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/ai/skills/version`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `skillName` | `string` | **是** | Skill name. |
| `version` | `string` | 否 | Version number. |

### 7.12. Download Skill Version ZIP Package

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/ai/skills/version/download`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `skillName` | `string` | **是** | Skill name. |
| `version` | `string` | 否 | Version number. |

### 7.13. Offline Skill
#### 接口描述
This interface allows executing an offline operation on a specific version or the entire skill, making it not callable.

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/offline`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace ID, default is `public`. |
| `skillName` | `string` | **是** | Skill name. |
| `scope` | `string` | 否 | Use 'skill' for skill-level offline; otherwise version-level |
| `version` | `string` | 否 | Version identifier. |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/offline' -d "namespaceId=namespaceId&skillName=skillName&scope=scope&version=version"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.14. Online Skill
#### 接口描述
This interface allows executing an online operation on a specific version or the entire skill, making it callable.

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/online`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace ID, default is `public`. |
| `skillName` | `string` | **是** | Skill name. |
| `scope` | `string` | 否 | Use 'skill' for skill-level online; otherwise version-level |
| `version` | `string` | 否 | Version identifier. |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/online' -d "namespaceId=namespaceId&skillName=skillName&scope=scope&version=version"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 7.15. Publish Skill Version
#### 接口描述
This interface allows publishing an approved skill version.

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/publish`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace ID, default is `public`. |
| `skillName` | `string` | **是** | Skill name. |
| `version` | `string` | **是** | Version identifier. |
| `updateLatestLabel` | `boolean` | 否 | Whether to update the `latest` label after publishing. |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/publish' -d "namespaceId=namespaceId&skillName=skillName&version=version&updateLatestLabel=updateLatestLabel"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 7.16. Update Skill Visibility Scope
#### 接口描述
This interface allows setting the visibility scope of a skill to PUBLIC or PRIVATE.

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/scope`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace ID, default is `public`. |
| `skillName` | `string` | **是** | Skill name. |
| `scope` | `string` | **是** | PUBLIC or PRIVATE |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/scope' -d "namespaceId=namespaceId&skillName=skillName&scope=scope"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 7.17. Submit Skill Version for Review
#### 接口描述
This interface allows submitting a skill draft version to the pipeline for review.

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/submit`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace ID, default is `public`. |
| `skillName` | `string` | **是** | Skill name. |
| `version` | `string` | 否 | Version identifier. |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/submit' -d "namespaceId=namespaceId&skillName=skillName&version=version"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 7.18. Force Publish Skill Version

#### 接口描述

This API force-publishes a Skill version while bypassing pipeline validation.

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/force-publish`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `skillName` | `string` | **是** | Skill name. |
| `version` | `string` | **是** | Version number. |
| `updateLatestLabel` | `boolean` | 否 | Whether to update the `latest` label after publishing. |

### 7.19. Redraft Skill Version

#### 接口描述

This API converts a reviewed Skill version back to a draft.

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/redraft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `skillName` | `string` | **是** | Skill name. |
| `version` | `string` | **是** | Version number. |

### 7.20. Batch Upload Skills

#### 接口描述

This API batch uploads Skills from a ZIP file that contains multiple Skill subdirectories.

#### 请求方式

`POST`

Request body type: `multipart/form-data`. Parameters are sent in the request body.

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/skills/upload/batch`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `overwrite` | `boolean` | 否 | Whether to overwrite existing skills with the same names. |
| `file` | `file` | 否 | ZIP package containing multiple Skill subdirectories. |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/upload/batch' \
  -F "file=@skills.zip" -F "namespaceId=public" -F "overwrite=false"
```

## 8. AgentSpec Management

### 8.1. Get AgentSpec
#### 接口描述
This interface allows getting the latest published version of an AgentSpec by namespace and name.

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **是** | AgentSpec name. |
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
| data.data.labels | `object` | - |
| data.data.editingVersion | `string` | - |
| data.data.reviewingVersion | `string` | - |
| data.data.onlineCnt | `integer` | - |
| data.data.downloadCount | `integer` | - |
| data.data.versions | `array` | - |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs?namespaceId=public&agentSpecName=my-agentspec'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.2. Delete AgentSpec
#### 接口描述
This interface allows deleting an AgentSpec and all its versions by namespace and name.

#### 请求方式

`DELETE`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **是** | AgentSpec name. |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs?namespaceId=public&agentSpecName=my-agentspec'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.3. Update AgentSpec Business Tags
#### 接口描述
This interface allows updating the business tag list of an AgentSpec without changing version status.

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/biz-tags`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **是** | AgentSpec name. |
| `bizTags` | `string` | **是** | Business tags; pass multiple tags using the agreed format. |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/biz-tags' -d "namespaceId=public&agentSpecName=my-agentspec&bizTags=demo"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.4. Create AgentSpec Draft Version
#### 接口描述
This interface allows creating an AgentSpec draft version based on an existing version.

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **是** | AgentSpec name. |
| `basedOnVersion` | `string` | 否 | Base version used to create the draft. |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/draft' -d "namespaceId=public&agentSpecName=my-agentspec&basedOnVersion=1.0.0"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.5. Update AgentSpec Draft Content
#### 接口描述
This interface allows updating the card content of the current AgentSpec draft version.

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | 否 | AgentSpec name. |
| `agentSpecCard` | `string` | **是** | AgentSpec card JSON string containing complete AgentSpec information |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/draft' -d "namespaceId=public&agentSpecName=my-agentspec&agentSpecCard={}"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.6. Delete AgentSpec Draft Version
#### 接口描述
This interface allows deleting the current draft version of a specified AgentSpec.

#### 请求方式

`DELETE`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **是** | AgentSpec name. |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/draft?namespaceId=public&agentSpecName=my-agentspec'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.7. Update AgentSpec Version Labels
#### 接口描述
This interface allows updating AgentSpec version routing labels (e.g. latest label) without changing version status.

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/labels`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **是** | AgentSpec name. |
| `labels` | `string` | **是** | Version labels, usually as a JSON string. |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/labels' -d "namespaceId=public&agentSpecName=my-agentspec&labels={\"latest\":\"1.0.0\"}"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.8. List AgentSpecs
#### 接口描述
This interface allows paginated listing of AgentSpecs by namespace and name.

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/list`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pageNo` | `integer` | **是** | Page number, starting from 1. |
| `pageSize` | `integer` | **是** | Number of items per page. |
| `filterableForm` | `string` | **是** | Filter condition form. |
| `namespaceId` | `string` | 否 | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | 否 | AgentSpec name. |
| `search` | `string` | 否 | Search mode: `accurate` or `blur`. |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/list?pageNo=1&pageSize=20&namespaceId=public&agentSpecName=my-agentspec&search=accurate'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.9. Offline AgentSpec
#### 接口描述
This interface allows executing an offline operation on a specific version or the entire AgentSpec, making it not callable.

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/offline`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **是** | AgentSpec name. |
| `scope` | `string` | 否 | Use 'agentspec' for agentspec-level offline; otherwise version-level |
| `version` | `string` | 否 | Version identifier. |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/offline' -d "namespaceId=public&agentSpecName=my-agentspec&scope=agentspec&version=1.0.0"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.10. Online AgentSpec
#### 接口描述
This interface allows executing an online operation on a specific version or the entire AgentSpec, making it callable.

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/online`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **是** | AgentSpec name. |
| `scope` | `string` | 否 | Use 'agentspec' for agentspec-level online; otherwise version-level |
| `version` | `string` | 否 | Version identifier. |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/online' -d "namespaceId=public&agentSpecName=my-agentspec&scope=agentspec&version=1.0.0"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.11. Publish AgentSpec Version
#### 接口描述
This interface allows publishing an approved AgentSpec version.

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/publish`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **是** | AgentSpec name. |
| `version` | `string` | **是** | Version identifier. |
| `updateLatestLabel` | `boolean` | 否 | Whether to update the `latest` label after publishing. |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/publish' -d "namespaceId=public&agentSpecName=my-agentspec&version=1.0.0&updateLatestLabel=true"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.12. Update AgentSpec Visibility Scope
#### 接口描述
This interface allows setting the visibility scope of an AgentSpec to PUBLIC or PRIVATE.

#### 请求方式

`PUT`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/scope`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **是** | AgentSpec name. |
| `scope` | `string` | **是** | PUBLIC or PRIVATE |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/scope' -d "namespaceId=public&agentSpecName=my-agentspec&scope=PUBLIC"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.13. Submit AgentSpec Version for Review
#### 接口描述
This interface allows submitting an AgentSpec draft version to the pipeline for review.

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/submit`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **是** | AgentSpec name. |
| `version` | `string` | 否 | Version identifier. |
#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/submit' -d "namespaceId=public&agentSpecName=my-agentspec&version=1.0.0"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.14. Upload AgentSpec
#### 接口描述
This interface allows uploading a ZIP-packaged AgentSpec; the package is parsed and the AgentSpec is created or updated.

#### 请求方式

`POST`

Request body type: `multipart/form-data`. Parameters are sent in the request body.

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/upload`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace ID, default is `public`. |
| `overwrite` | `boolean` | 否 | Whether to overwrite an existing resource with the same name. |
| `file` | `file` | 否 | ZIP file containing AgentSpec package. |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/upload' -F "file=@agentspec.zip" -F "namespaceId=public" -F "overwrite=false"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.15. Get AgentSpec Version
#### 接口描述
This interface allows getting a specific version of an AgentSpec by namespace, name, and version.

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/version`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **是** | AgentSpec name. |
| `version` | `string` | 否 | Version identifier. |
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
| data.data.resource | `object` | - |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/version?namespaceId=public&agentSpecName=my-agentspec&version=1.0.0'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.16. Force Publish AgentSpec Version

#### 接口描述

This API force-publishes an AgentSpec version while bypassing pipeline validation.

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/force-publish`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **是** | AgentSpec name. |
| `version` | `string` | **是** | Version number. |
| `updateLatestLabel` | `boolean` | 否 | Whether to update the `latest` label after publishing. |

### 8.17. Redraft AgentSpec Version

#### 接口描述

This API converts a reviewed AgentSpec version back to a draft.

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/redraft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **是** | AgentSpec name. |
| `version` | `string` | **是** | Version number. |

### 8.18. Get AgentSpec Version Metadata

#### 接口描述

This API retrieves metadata for a specified AgentSpec version without reading resource file content.

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/agentspecs/version/meta`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **是** | AgentSpec name. |
| `version` | `string` | 否 | Version number. |

## 9. Pipeline Execution Records

### 9.1. List Pipeline Execution Records

#### 接口描述

This API lists Pipeline execution records by resource type, resource name, namespace, and version with pagination.

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/pipelines`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `resourceType` | `string` | **是** | Resource type. |
| `resourceName` | `string` | 否 | Resource name. |
| `namespaceId` | `string` | 否 | Namespace. |
| `version` | `string` | 否 | Resource version. |
| `pageNo` | `integer` | **是** | Page number. |
| `pageSize` | `integer` | **是** | Page size. |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | Response code. |
| data.message | `string` | Response message. |
| data.data | `string` | Paginated Pipeline execution records. |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/pipelines?resourceType=agentspec&resourceName=my-agentspec&namespaceId=public&version=1.0.0&pageNo=1&pageSize=20'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 9.2. Get Pipeline Execution Record Details

#### 接口描述

This API retrieves Pipeline execution record details by Pipeline ID.

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/pipelines/{pipelineId}`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pipelineId` | `string` | **是** | Pipeline ID. |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | Response code. |
| data.message | `string` | Response message. |
| data.data.executionId | `string` | Pipeline execution ID. |
| data.data.resourceType | `string` | Resource type. |
| data.data.resourceName | `string` | Resource name. |
| data.data.namespaceId | `string` | Namespace. |
| data.data.version | `string` | Resource version. |
| data.data.status | `string` | Execution status. |
| data.data.pipeline | `array` | Pipeline stage information. |
| data.data.createTime | `integer` | Creation time. |
| data.data.updateTime | `integer` | Update time. |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/pipelines/pipeline-001'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 9.3. List Pipeline Execution Records

#### 接口描述

This API lists Pipeline execution records by resource type, resource name, namespace, and version with pagination.

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/pipelines/list`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `resourceType` | `string` | **是** | Resource type. |
| `resourceName` | `string` | 否 | Resource name. |
| `namespaceId` | `string` | 否 | Namespace. |
| `version` | `string` | 否 | Resource version. |
| `pageNo` | `integer` | **是** | Page number. |
| `pageSize` | `integer` | **是** | Page size. |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | Response code. |
| data.message | `string` | Response message. |
| data.data | `string` | Paginated Pipeline execution records. |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/pipelines/list?resourceType=agentspec&resourceName=my-agentspec&namespaceId=public&version=1.0.0&pageNo=1&pageSize=20'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 9.4. Get Pipeline Execution Record Details

#### 接口描述

This API retrieves Pipeline execution record details by Pipeline ID.

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/pipelines/detail`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pipelineId` | `string` | **是** | Pipeline ID. |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | Response code. |
| data.message | `string` | Response message. |
| data.data.executionId | `string` | Pipeline execution ID. |
| data.data.resourceType | `string` | Resource type. |
| data.data.resourceName | `string` | Resource name. |
| data.data.namespaceId | `string` | Namespace. |
| data.data.version | `string` | Resource version. |
| data.data.status | `string` | Execution status. |
| data.data.pipeline | `array` | Pipeline stage information. |
| data.data.createTime | `integer` | Creation time. |
| data.data.updateTime | `integer` | Update time. |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/pipelines/detail?pipelineId=pipeline-001'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

## 10. AI Resource Import

### 10.1. List AI Resource Import Sources

#### 接口描述

This API lists the currently configured AI resource import sources.

#### 请求方式

`GET`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/import/sources`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `resourceType` | `string` | 否 | Resource type. |

### 10.2. Search External AI Resources

#### 接口描述

This API searches importable external AI resources from a specified import source.

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/import/search`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `resourceType` | `string` | **是** | Resource type. |
| `sourceId` | `string` | **是** | Import source ID. |
| `query` | `string` | 否 | Search keyword. |
| `cursor` | `string` | 否 | Pagination cursor. |
| `limit` | `integer` | 否 | Result limit. |
| `options` | `string` | 否 | Extension options as a JSON string. |

### 10.3. Validate AI Resource Import Items

#### 接口描述

This API validates whether selected external AI resources can be imported.

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/import/validate`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `resourceType` | `string` | **是** | Resource type. |
| `sourceId` | `string` | **是** | Import source ID. |
| `selectedItems` | `string` | **是** | Resource items to validate as a JSON string. |
| `overwriteExisting` | `boolean` | 否 | Whether to overwrite existing resources. |
| `options` | `string` | 否 | Extension options as a JSON string. |

### 10.4. Execute AI Resource Import

#### 接口描述

This API imports the selected external AI resources.

#### 请求方式

`POST`

#### 鉴权状态

需管理员权限

#### 请求URL

`/nacos/v3/admin/ai/import/execute`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Namespace. |
| `resourceType` | `string` | **是** | Resource type. |
| `sourceId` | `string` | **是** | Import source ID. |
| `selectedItems` | `string` | **是** | Resource items to import as a JSON string. |
| `overwriteExisting` | `boolean` | 否 | Whether to overwrite existing resources. |
| `skipInvalid` | `boolean` | 否 | Whether to skip invalid resource items. |
| `validationToken` | `string` | 否 | Validation token. |
| `options` | `string` | 否 | Extension options as a JSON string. |
