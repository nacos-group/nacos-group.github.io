---
title: 运维API
keywords: [Nacos,运维API]
description: Nacos Server的一些运维API，一般给予控制台使用或需要进行自定义Nacos运维工具开发的相关程序和人员使用。
sidebar:
    order: 5
---

# 运维API

> Nacos 3.X 版本将不再兼容1.X版本 和 2.X版本的 AdminAPI，请使用Nacos 3.X版本的AdminAPI进行替换。
> 
> 若必须要使用1.X和2.X的Admin API，需要在配置文件中设置`nacos.core.auth.admin.enabled=true`开启，但此兼容也将在未来版本中移除，建议使用Nacos 3.X版本的AdminAPI进行替换。
> 
> Nacos 3.X 版本的Admin API默认需要鉴权，请在请求时使用管理员用户`nacos`（使用默认鉴权插件时）。

Nacos默认搭载了一整套专为管理控制台和运维人员设计的运维API，赋予运维专家更多的配置权限、更广阔的数据检索能力等。这些API为Nacos的运维团队提供了方便，使他们能够高效地处理故障、排查问题，以确保系统的稳定运行。

## 统一返回体格式

自3.0版本开始，OpenAPI/AdminAPI/ConsoleAPI均使用相同的返回体格式。

完整的返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，本文档中所有的API返回数据只阐述`data`字段中的返回参数。

## 1. Nacos Core 运维 API

### 1.1. 获取当前节点连接

#### 接口描述

通过该接口，可以获取连接到当前Nacos Server节点中的gRPC连接详情。

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/core/loader/current`

#### 请求参数

无

#### 返回数据


| 参数名                                  | 参数类型     | 描述                                                                                                        |
| ----------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------- |
| ${connectionId}                         | `jsonString` | 每条gRPC连接的连接id                                                                                        |
| ${connectionId}.abilityTable            | `jsonString` | 该gRPC连接（即客户端）支持的能力列表                                                                        |
| ${connectionId}.metaInfo.clientIp       | `String`     | 该gRPC连接的来源IP                                                                                          |
| ${connectionId}.metaInfo.localPort      | `int`        | 该Nacos Server的gRPC端口                                                                                    |
| ${connectionId}.metaInfo.version        | `String`     | 该gRPC连接（即客户端）的版本                                                                                |
| ${connectionId}.metaInfo.createTime     | `String`     | 该gRPC连接的连接时间                                                                                        |
| ${connectionId}.metaInfo.lastActiveTime | `timestamp`  | 该gRPC连接的最后一次的心跳时间                                                                              |
| ${connectionId}.metaInfo.labels.source  | `String`     | 该gRPC连接的模块，可选值为`naming`,`config`和`cluster`分别代表注册中心、配置中心以及集群间的连接            |
| ${connectionId}.metaInfo.clusterSource  | `boolean`    | 该gRPC连接的是否为集群间连接，为`true`时，`${connectionId}.metaInfo.labels.source`为 `cluster`              |
| ${connectionId}.metaInfo.sdkSource      | `boolean`    | 该gRPC连接的是否为客户端来源连接，为`true`时，`${connectionId}.metaInfo.labels.source`为 `naming`或`config` |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/loader/current'
```

* 返回示例

```json
{
  "1709273546779_127.0.0.1_35042": {
    "traced": false,
    "abilityTable": {},
    "metaInfo": {
      "connectType": "GRPC",
      "clientIp": "127.0.0.1",
      "localPort": 9849,
      "version": "Nacos-Java-Client:v2.4.2",
      "connectionId": "1709273546779_127.0.0.1_35042",
      "createTime": "2024-03-01T14:12:26.800+08:00",
      "lastActiveTime": 1710754816373,
      "appName": "-",
      "tenant": null,
      "labels": {
        "source": "naming",
        "tls.enable": "false"
      },
      "tag": null,
      "clusterSource": false,
      "sdkSource": true
    },
    "connected": true,
    "labels": {
      "source": "naming",
      "tls.enable": "false"
    }
  }
}
```

### 1.2. 均衡指定数量的连接

#### 接口描述

通过该接口，可以指定一定数量的连接到当前Nacos Server节点中的gRPC连接，将这部分连接断开后迁移到其他Nacos Server节点中。

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/core/loader/reloadCurrent`

#### 请求参数


| 参数名            | 类型      | 必填   | 参数描述                                         |
| ------------------- | ----------- | -------- | -------------------------------------------------- |
| `count`           | `Integer` | **是** | 需要均衡的连接个数                               |
| `redirectAddress` | `String`  | 否     | 预期均衡的Nacos Server目标，仅提供给客户端参考。 |

#### 返回数据

成功则返回`success`，失败则返回[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)

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

#### 请求URL

`/nacos/v3/admin/core/loader/reloadClient`

#### 请求参数


| 参数名            | 类型     | 必填   | 参数描述                     |
| ------------------- | ---------- | -------- | ------------------------------ |
| `connectionId`    | `String` | **是** | 需要均衡的连接Id             |
| `redirectAddress` | `String` | 否     | 预期均衡的Nacos Server目标。 |

#### 返回数据

成功则返回`success`，失败则返回[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)

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

#### 请求URL

`/nacos/v3/admin/core/loader/cluster`

#### 请求参数

无

#### 返回数据


| 参数名                        | 参数类型    | 描述                                            |
| ------------------------------- | ------------- | ------------------------------------------------- |
| `total`                       | `Integer`   | 该集群中所有节点的连接数总和                    |
| `min`                         | `Integer`   | 该集群中所有节点的最小连接数                    |
| `avg`                         | `Integer`   | 该集群中所有节点的平均连接数                    |
| `max`                         | `Integer`   | 该集群中所有节点的最大连接数                    |
| `memberCount`                 | `Integer`   | 该集群中所有节点的个数                          |
| `metricsCount`                | `Integer`   | 该集群中已统计到概览信息的节点个数              |
| `detail`                      | `jsonArray` | 该集群中所有节点的概览信息，格式见下表          |
| `detail[].address`            | `String`    | 节点地址                                        |
| `detail[].metric.load`        | `Double`    | 节点的负载率，主要对应节点的Load指标，参考值    |
| `detail[].metric.sdkConCount` | `Integer`   | 连接到该节点的SDK连接数，主要对应客户端连接数   |
| `detail[].metric.conCount`    | `Integer`   | 连接到该节点的总连接数，包含了SDK和集群间的连接 |
| `detail[].metric.cpu`         | `Double`    | 节点的CPU使用率，参考值                         |

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
    "total": 0,
    "min": 0,
    "avg": 0,
    "max": 0,
    "memberCount": 3,
    "metricsCount": 3,
    "threshold": 0.0,
    "detail": [
      {
        "address": "nacos-node1:8848",
        "metric": {
          "load": "0.0",
          "sdkConCount": "0",
          "cpu": "0.0",
          "conCount": "2"
        }
      },
      {
        "address": "nacos-node2:8848",
        "metric": {
          "load": "0.03",
          "sdkConCount": "0",
          "cpu": "-1.0",
          "conCount": "2"
        }
      },
      {
        "address": "nacos-node3:8848",
        "metric": {
          "load": "0.0",
          "sdkConCount": "0",
          "cpu": "-1.0",
          "conCount": "2"
        }
      }
    ],
    "completed": true
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

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。


| 参数名                        | 参数类型     | 描述                                                           |
| ------------------------------- | -------------- | ---------------------------------------------------------------- |
| `ip`                          | `String`     | 节点IP                                                         |
| `port`                        | `Integer`    | 节点端口                                                       |
| `state`                       | `String`     | 节点状态，可选值为`UP`、`DOWN`、`SUSPICIOUS`                   |
| `extendInfo`                  | `jsonObject` | 节点扩展信息，具体字段见下表                                   |
| `extendInfo.lastRefreshTime`  | `Long`       | 节点上一次更新时间戳，单位毫秒                                 |
| `extendInfo.raftMetaData`     | `jsonObject` | 节点的Raft元数据， 包含每个Raft Group的`leader`， `term`等字段 |
| `extendInfo.raftPort`         | `Integer`    | 节点的Raft端口                                                 |
| ~~extendInfo.readyToUpgrade~~ | `Boolean`    | 是否ready升级到Nacos2.0，于2.2版本后废弃，即将移除             |
| `extendInfo.supportGrayModel` | `Boolean`    | 是否支持灰度模型                                               |
| `extendInfo.version`          | `String`     | 节点的版本                                                     |
| `address`                     | `String`     | 节点地址，格式为`ip:port`                                      |
| `failAccessCnt`               | `Integer`    | 待补充                                                         |
| `abilities`                   | `jsonObject` | 该节点所支持的能力                                             |
| `grpcReportEnabled`           | `Boolean`    | 待补充                                                         |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/cluster/node/self'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "ip": "nacos-node-0",
    "port": 8848,
    "state": "UP",
    "extendInfo": {
      "lastRefreshTime": 1709273550501,
      "raftMetaData": {
        "metaDataMap": {
          "naming_instance_metadata": {
            "leader": "nacos-node-2:7848",
            "raftGroupMember": ["nacos-node-2:7848", "nacos-node-1:7848", "nacos-node-0:7848"],
            "term": 3
          },
          "naming_persistent_service": {
            "leader": "nacos-node-1:7848",
            "raftGroupMember": ["nacos-node-2:7848", "nacos-node-1:7848", "nacos-node-0:7848"],
            "term": 3
          },
          "naming_persistent_service_v2": {
            "leader": "nacos-node-2:7848",
            "raftGroupMember": ["nacos-node-2:7848", "nacos-node-1:7848", "nacos-node-0:7848"],
            "term": 2
          },
          "naming_service_metadata": {
            "leader": "nacos-node-2:7848",
            "raftGroupMember": ["nacos-node-2:7848", "nacos-node-1:7848", "nacos-node-0:7848"],
            "term": 3
          }
        }
      },
      "raftPort": "7848",
      "readyToUpgrade": true,
      "version": "2.4.2"
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
}
```

### 1.6. 获取集群所有节点信息

#### 接口描述

通过该接口，可以获取Nacos Server集群中所有节点的详细信息。

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/core/cluster/node/list`

#### 请求参数


| 参数名    | 类型     | 必填 | 参数描述                                                                     |
| ----------- | ---------- | ------ | ------------------------------------------------------------------------------ |
| `address` | `String` | 否   | 过滤的节点地址，支持前缀匹配，不输入时返回所有节点信息                       |
| `state`   | `String` | 否   | 返回的节点状态，可选值为`UP`、`DOWN`、`SUSPICIOUS`，不输入时返回所有节点信息 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，`data`字段为[获取本节点信息](#返回数据-4)的返回数据的列表。

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
  "data": [{
    "ip": "nacos-node-0",
    "port": 8848,
    "state": "UP",
    "extendInfo": {
      "lastRefreshTime": 1709273550501,
      "raftMetaData": {
        "metaDataMap": {
          "naming_instance_metadata": {
            "leader": "nacos-node-2:7848",
            "raftGroupMember": ["nacos-node-2:7848", "nacos-node-1:7848", "nacos-node-0:7848"],
            "term": 3
          },
          "naming_persistent_service": {
            "leader": "nacos-node-1:7848",
            "raftGroupMember": ["nacos-node-2:7848", "nacos-node-1:7848", "nacos-node-0:7848"],
            "term": 3
          },
          "naming_persistent_service_v2": {
            "leader": "nacos-node-2:7848",
            "raftGroupMember": ["nacos-node-2:7848", "nacos-node-1:7848", "nacos-node-0:7848"],
            "term": 2
          },
          "naming_service_metadata": {
            "leader": "nacos-node-2:7848",
            "raftGroupMember": ["nacos-node-2:7848", "nacos-node-1:7848", "nacos-node-0:7848"],
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
  }, {
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
  }, {
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
  }]
}
```

### 1.7. 快速查询本节点健康状态

#### 接口描述

通过该接口，可以快速查询本节点健康状态。

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/core/cluster/node/self/health`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)。


| 参数名 | 参数类型 | 描述                                                                   |
| -------- | ---------- | ------------------------------------------------------------------------ |
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

通过该接口，可以在不重启Nacos Server的情况下，动态切换Nacos Server集群地址发现的方式，目前支持两种方式：`file`和`address-server`。

#### 请求方式

`PUT`

#### 请求URL

`/nacos/v3/admin/core/cluster/lookup`

#### 请求参数


| 参数名 | 类型     | 必填 | 参数描述                                             |
| -------- | ---------- | ------ | ------------------------------------------------------ |
| `type` | `String` | 是   | 切换到地址发现方式，可选值为`file`和`address-server` |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)。


| 参数名 | 参数类型  | 描述                                      |
| -------- | ----------- | ------------------------------------------- |
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

#### 请求URL

`/nacos/v3/admin/core/ops/raft`

#### 请求参数

该API需要以Json的方式，将请求参数放在请求体中，请求体格式如下：


| 参数名    | 类型     | 必填   | 参数描述                                            |
| ----------- | ---------- | -------- | ----------------------------------------------------- |
| `command` | `String` | **是** | Raft运维操作指令，具体的命令请参考下表。            |
| `value`   | `String` | **是** | 命令的参数，具体的命令内容请参考下表。              |
| `groupId` | `String` | 否     | Raft集群的groupId，如果不输入则对所有Raft Group生效 |


| command           | value                                                                         | 说明                                                               |
| ------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `doSnapshot`      | `${nacos-server-address}:${raft-port}`                                        | 执行快照，参数为要执行快照的节点地址。                             |
| `transferLeader`  | `${nacos-server-address}:${raft-port}`                                        | 主动选主，参数为要期望的Leader的节点地址。                         |
| `restRaftCluster` | `${nacos-server-address}:${raft-port}[,${nacos-server-address}:${raft-port}]` | 重置集群状态，参数为要重置节点地址列表，','分割。                  |
| `removePeer`      | `${nacos-server-address}:${raft-port}`                                        | 移除Raft Member节点，参数为要移除的节点地址。                      |
| `removePeers`     | `${nacos-server-address}:${raft-port}[,${nacos-server-address}:${raft-port}]` | 批量移除Raft Member节点，参数为要批量移除的节点地址列表，','分割。 |
| `changePeers`     | `${nacos-server-address}:${raft-port}[,${nacos-server-address}:${raft-port}]` | 修改Raft Member节点，参数为要修改后的节点地址列表，','分割。       |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)。


| 参数名 | 参数类型 | 描述           |
| -------- | ---------- | ---------------- |
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

#### 请求URL

`/nacos/v3/admin/core/ops/log`

#### 请求参数

该API需要以Json的方式，将请求参数放在请求体中，请求体格式如下：


| 参数名     | 类型     | 必填   | 参数描述                                                                      |
| ------------ | ---------- | -------- | ------------------------------------------------------------------------------- |
| `logName`  | `String` | **是** | 具体的日志文件的名称，具体支持的日志名称见下表。                              |
| `logLevel` | `String` | **是** | 日志的级别，可选值为`ALL`、`TRACE`、`DEBUG`、`INFO`、`WARN`、`ERROR`、`OFF`。 |


| logName        | 对应的具体日志文件    |
| ---------------- | ----------------------- |
| `core-auth`    | `core-auth.log`       |
| `core-raft`    | `protocol-raft.log`   |
| `core-distro`  | `protocol-distro.log` |
| `core-cluster` | `nacos-cluster.log`   |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)。


| 参数名 | 参数类型 | 描述           |
| -------- | ---------- | ---------------- |
| `data` | `String` | 固定为`null`。 |

#### 示例

* 请求示例

```shell
curl -X PUT -H 'Content-Type:application/json' 'http://127.0.0.1:8848/nacos/v2/core/ops/log' -d '{"logName":"core-distro","logLevel":"DEBUG"}'
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

1. 根据整个集群的客户端连接数和Nacos Server节点数量计算平均连接数`avg`、节点连接数下限阈值`lowLimitCount`(=avg * (1-loaderFactor))、节点连接数上限阈值`overLimitCount`(=avg * (1+loaderFactor))
2. 将高负载节点的部分客户端连接重定向到低负载节点。

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/core/loader/smartReloadCluster`

#### 请求参数


| 参数名         | 类型     | 必填 | 参数描述                 |
| ---------------- | ---------- | ------ | -------------------------- |
| `loaderFactor` | `String` | 否   | 负载因子，必须是一个数字 |

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

#### 请求URL

`/nacos/v3/admin/core/ops/ids`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)。


| 参数名           | 参数类型 | 描述       |
| ------------------ | ---------- | ------------ |
| `resource`       | `String` | 生产器名称 |
| `info`           | `Object` | 生产器详情 |
| `info.currentId` | `int64`  | 当前ID     |
| `info.workerId`  | `int64`  | workerID   |

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
curl -X GET 'http://127.0.0.1:8848/nacos/v2/core/loader/reloadCurrent?count=100'
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

#### 请求URL

`/nacos/v3/admin/ns/ops/switches`

#### 请求参数

无

#### 返回数据


| 参数名                   | 参数类型  | 描述                                                                                                                                                                                     |
| -------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `clientBeatInterval`     | `int`     | Nacos1.X客户端的默认心跳间隔                                                                                                                                                             |
| `defaultCacheMillis`     | `int`     | 客户端订阅的服务列表的默认缓存时间                                                                                                                                                       |
| `defaultPushCacheMillis` | `int`     | 推送的服务列表的默认缓存时间，优先级高于`defaultCacheMillis`                                                                                                                             |
| `distroEnabled`          | `boolean` | 是否开启`Distro`协议同步，仅当集群压力过大，影响到集群稳定性时，临时修改为`false`缓解，改为`false`后可能导致部分数据不一致，需要尽快恢复                                                 |
| `healthCheckEnabled`     | `boolean` | 是否开启健康检查，仅当集群压力过大，影响到集群稳定性时，临时修改为`false`缓解，改为`false`后不会因为心跳过期，tcp/http探测超时而修改实例的健康状态，以及不会因过期删除实例，需要尽快恢复 |
| `lightBeatEnabled`       | `boolean` | 是否开启轻量心跳，针对Nacos`1.2.X~1.4.X版本`客户端生效，修改为`false`后，`Nacos1.2.X~1.4.X`版本客户端将使用全量心跳进行续约                                                              |
| `pushEnabled`            | `boolean` | 是否开启推送功能，仅当集群压力过大，影响到集群稳定性时，临时修改为`false`，改为`false`后，Nacos客户端将不再收到服务端的主动推送                                                          |
| `push${Language}Version` | `String`  | 可支持推送的最小客户端版本，当不希望针对小于某些版本进行数据推送时，可以修改该值，比如修改pushJavaVersion为`2.0.0`，则小于2.0.0的Java客户端将不会收到推送数据                            |
| `${type}HealthParams`    | `json`    | 健康检查参数，设置健康检查的最大/最小间隔，随机间隔系数等，健康检查时将根据这几个值进行下一次健康检查流量的打散。                                                                        |

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
    "message": "success"
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
    },
}
```

### 2.2. 修改Naming模块的相关开关

#### 接口描述

通过该接口，可以修改Nacos Naming模块的相关开关。

#### 请求方式

`PUT`

#### 请求URL

`/nacos/v3/admin/ns/ops/switches`

#### 请求参数


| 参数名  | 类型      | 必填   | 参数描述                                                                                    |
| --------- | ----------- | -------- | --------------------------------------------------------------------------------------------- |
| `entry` | `String`  | **是** | 修改的开关或配置名称                                                                        |
| `value` | `Object`  | **是** | 开关或配置的新值，不同的开关或配置的类型不同，具体请参考[开关和配置参数](#返回数据-10)      |
| `debug` | `boolean` | 否     | 是否开启调试模式，开启后，修改的配置不会同步到集群其他节点中，仅在本节点生效，默认为`false` |

#### 返回数据


| 参数名 | 参数类型 | 描述       |
| -------- | ---------- | ------------ |
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

#### 请求URL

`/nacos/v3/admin/ns/ops/metrics`

#### 请求参数


| 参数名       | 参数类型  | 是否必填 | 默认值 | 参数描述   |
| -------------- | ----------- | ---------- | -------- | ------------ |
| `onlyStatus` | `boolean` | 否       | `true` | 只显示状态 |

> 当`onlyStatus`设置为`true`时，只返回表示系统状态的字符串

#### 返回数据


| 参数名                             | 参数类型 | 描述说明           |
| ------------------------------------ | ---------- | -------------------- |
| `data`                             | `Object` | 系统当前数据指标   |
| `data.status`                      | `String` | 系统状态           |
| `data.serviceCount`                | `int`    | 服务数量           |
| `data.instanceCount`               | `int`    | 实例数量           |
| `data.subscribeCount`              | `int`    | 订阅数量           |
| `data.raftNotifyTaskCount`         | `int`    | `Raft`通知任务数量 |
| `data.responsibleServiceCount`     | `int`    | 响应服务数         |
| `data.responsibleInstanceCount`    | `int`    | 响应实例数         |
| `data.clientCount`                 | `int`    | 客户端数量         |
| `data.connectionBasedClientCount`  | `int`    | 连接数量           |
| `data.ephemeralIpPortClientCount`  | `int`    | 临时客户端数量     |
| `data.persistentIpPortClientCount` | `int`    | 持久客户端数量     |
| `data.responsibleClientCount`      | `int`    | 响应客户端数       |
| `data.cpu`                         | `float`  | `cpu`使用率        |
| `data.load`                        | `float`  | 负载               |
| `data.mem`                         | `float`  | 内存使用率         |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/ops/metrics'
```

* 返回示例

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "status": "UP",
        "serviceCount": 2,
        "instanceCount": 2,
        "subscribeCount": 2,
        "raftNotifyTaskCount": 0,
        "responsibleServiceCount": 0,
        "responsibleInstanceCount": 0,
        "clientCount": 2,
        "connectionBasedClientCount": 2,
        "ephemeralIpPortClientCount": 0,
        "persistentIpPortClientCount": 0,
        "responsibleClientCount": 2,
        "cpu": 0,
        "load": -1,
        "mem": 1
    }
}
```

### 2.4. 修改日志级别

#### 接口描述

通过该接口，可以动态修改指定日志的级别。

#### 请求方式

`PUT`

#### 请求URL

`/nacos/v3/admin/ns/ops/log`

#### 请求参数


| 参数名     | 类型     | 必填   | 参数描述           |
| ------------ | ---------- | -------- | -------------------- |
| `logName`  | `String` | **是** | 需要修改的日志名称 |
| `logLevel` | `String` | **是** | 日志级别的新值     |

#### 返回数据


| 参数名 | 参数类型 | 描述       |
| -------- | ---------- | ------------ |
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

#### 请求URL

`/nacos/v3/admin/ns/client/list`

#### 请求参数

无

#### 返回数据


| 参数名 | 参数类型       | 描述         |
| -------- | ---------------- | -------------- |
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
  "data": ["client1", "client2", "client3"]
}
```

### 2.6 查询客户端详细信息

#### 接口描述

根据客户端ID查询客户端的详细信息。

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/ns/client`

#### 请求参数


| 参数名     | 参数类型 | 是否必填 | 描述     |
| ------------ | ---------- | ---------- | ---------- |
| `clientId` | `String` | **是**   | 客户端ID |

#### 返回数据


| 参数名                 | 参数类型     | 描述                            |
| ------------------------ | -------------- | --------------------------------- |
| `data`                 | `ObjectNode` | 客户端详细信息                  |
| `data.clientId`        | `String`     | 客户端的唯一 ID。               |
| `data.ephemeral`       | `boolean`    | 客户端是否为临时客户端          |
| `data.lastUpdatedTime` | `long`       | 客户端的最后更新时间（时间戳）  |
| `data.clientType`      | `String`     | 客户端类型                      |
| `data.connectType`     | `String`     | 连接类型（仅适用于 2.x 客户端） |
| `data.appName`         | `String`     | 客户端所属的应用名称            |
| `data.version`         | `String`     | 客户端的版本号                  |
| `data.clientIp`        | `String`     | 客户端的 IP 地址                |
| `data.clientPort`      | `String`     | 客户端的端口号                  |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/client?clientId=client1'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "clientId": "client-123",
    "ephemeral": true,
    "lastUpdatedTime": 1737034785683,
    "clientType": "connection",
    "connectType": "HTTP",
    "appName": "example-app",
    "version": "2.0.0",
    "clientIp": "127.0.0.1",
    "clientPort": "8080"
  }
}
```

### 2.7 查询客户端注册的服务列表

#### 接口描述

查询指定客户端注册的服务列表。

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/ns/client/publish/list`

#### 请求参数


| 参数名     | 参数类型 | 是否必填 | 描述     |
| ------------ | ---------- | ---------- | ---------- |
| `clientId` | `String` | **是**   | 客户端ID |

#### 返回数据


| 参数名                            | 参数类型   | 描述说明             |
| ----------------------------------- | ------------ | ---------------------- |
| `data`                            | `Object[]` | 客户端注册的服务列表 |
| `data.namespace`                  | `String`   | 命名空间             |
| `data.group`                      | `String`   | 分组名               |
| `data.serviceName`                | `String`   | 服务名               |
| `data.registeredInstance`         | `Object`   | 该服务下注册的实例   |
| `data.registeredInstance.ip`      | `String`   | `IP`地址             |
| `data.registeredInstance.port`    | `int`      | 端口号               |
| `data.registeredInstance.cluster` | `String`   | 集群名               |

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
          "namespace": "public",
          "group": "DEFAULT_GROUP",
          "serviceName": "nacos.test.1",
          "registeredInstance": {
                "ip": "10.128.164.35",
                "port": 9950,
                "cluster": "DEFAULT"
          }
      }
  ]
}
```

### 2.8 查询客户端订阅的服务列表

#### 接口描述

查询指定客户端订阅的服务列表。

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/ns/client/subscribe/list`

#### 请求参数


| 参数名     | 参数类型 | 是否必填 | 描述     |
| ------------ | ---------- | ---------- | ---------- |
| `clientId` | `String` | 是       | 客户端ID |

#### 返回数据


| 参数名                      | 参数类型   | 描述说明             |
| ----------------------------- | ------------ | ---------------------- |
| `data`                      | `Object[]` | 客户端订阅的服务列表 |
| `data.namespace`            | `String`   | 命名空间             |
| `data.group`                | `String`   | 分组名               |
| `data.serviceName`          | `String`   | 服务名               |
| `data.subscriberInfo`       | `Object`   | 订阅信息             |
| `data.subscriberInfo.app`   | `String`   | 应用                 |
| `data.subscriberInfo.agent` | `String`   | 客户端信息           |
| `data.subscriberInfo.addr`  | `String`   | 地址                 |

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
      "namespace": "public",
      "group": "DEFAULT_GROUP",
      "serviceName": "service1",
      "subscriberInfo": {
        "app": "app1",
        "agent": "agent1",
        "addr": "127.0.0.1:8080"
      }
    },
    {
      "namespace": "public",
      "group": "DEFAULT_GROUP",
      "serviceName": "service2",
      "subscriberInfo": {
        "app": "app2",
        "agent": "agent2",
        "addr": "192.168.1.1:8081"
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

#### 请求URL

`/nacos/v3/admin/ns/client/service/publisher/list`

#### 请求参数


| 参数名        | 参数类型  | 是否必填 | 默认值            | 描述说明                                 |
| --------------- | ----------- | ---------- | ------------------- | ------------------------------------------ |
| `namespaceId` | `String`  | 否       | `"public"`        | 命名空间                                 |
| `groupName`   | `String`  | 否       | `"DEFAULT_GROUP"` | 分组名                                   |
| `serviceName` | `String`  | **是**   | 无                | 服务名                                   |
| `ephemeral`   | `boolean` | 否       | `true`            | 是否为临时实例。                         |
| `ip`          | `String`  | 否       | 无                | `IP`地址，默认为空，表示不限制`IP`地址。 |
| `port`        | `int`     | 否       | 无                | 端口号，默认为空，表示不限制端口号。     |

#### 返回数据


| 参数名          | 参数类型 | 描述说明   |
| ----------------- | ---------- | ------------ |
| `data`          | `List`   | 客户端列表 |
| `data.clientId` | `String` | 客户端`id` |
| `data.ip`       | `String` | 客户端`IP` |
| `data.port`     | `int`    | 客户端端口 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/client/service/publisher/list?serviceName=service1'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "clientId": "1664527081276_127.0.0.1_4400",
      "ip": "127.0.0.1",
      "port": 8080
    },
    {
      "clientId": "10.128.164.35:9954#true",
      "ip": "127.0.0.2",
      "port": 8081
    }
  ]
}
```

### 2.10 查询订阅指定服务的客户端列表

#### 接口描述

查询订阅指定服务的客户端列表。

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/ns/client/service/subscriber/list`

#### 请求参数


| 参数名        | 参数类型  | 是否必填 | 默认值            | 描述说明                                 |
| --------------- | ----------- | ---------- | ------------------- | ------------------------------------------ |
| `namespaceId` | `String`  | 否       | `"public"`        | 命名空间                                 |
| `groupName`   | `String`  | 否       | `"DEFAULT_GROUP"` | 分组名                                   |
| `serviceName` | `String`  | **是**   | 无                | 服务名                                   |
| `ephemeral`   | `boolean` | 否       | `true`            | 是否为临时实例。                         |
| `ip`          | `String`  | 否       | 无                | `IP`地址，默认为空，表示不限制`IP`地址。 |
| `port`        | `int`     | 否       | 无                | 端口号，默认为空，表示不限制端口号。     |

#### 返回数据


| 参数名          | 参数类型 | 描述说明   |
| ----------------- | ---------- | ------------ |
| `data`          | `List`   | 客户端列表 |
| `data.clientId` | `String` | 客户端`id` |
| `data.ip`       | `String` | 客户端`IP` |
| `data.port`     | `int`    | 客户端端口 |

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
                  "clientId": "1664527125645_127.0.0.1_4443",
                  "ip": "10.128.164.35",
                  "port": 0
          },
          {
                  "clientId": "172.24.144.1:54126#true",
                  "ip": "172.24.144.1",
                  "port": 54126
          }
  ]
}
```

### 2.11 查询客户端的负责服务器

#### 接口描述

根据客户端的IP和端口查询其负责的服务器。

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/ns/client/distro`

#### 请求参数


| 参数名 | 参数类型 | 是否必填 | 描述       |
| -------- | ---------- | ---------- | ------------ |
| `ip`   | `String` | **是**   | 客户端IP   |
| `port` | `String` | **是**   | 客户端端口 |

#### 返回数据


| 参数名 | 参数类型     | 描述             |
| -------- | -------------- | ------------------ |
| `data` | `ObjectNode` | 负责的服务器信息 |

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
    "responsibleServer": "127.0.0.1:8080"
  }
}
```

### 2.12 更新集群信息

#### 接口描述

更新指定集群的元数据信息。

#### 请求方式

`PUT`

#### 请求URL

`/nacos/v3/admin/ns/cluster`

#### 请求参数


| 参数名                  | 参数类型              | 是否必填 | 描述                          |
| ------------------------- | ----------------------- | ---------- | ------------------------------- |
| `namespaceId`           | `String`              | 否       | 命名空间ID                    |
| `serviceName`           | `String`              | **是**   | 服务名称                      |
| `clusterName`           | `String`              | **是**   | 集群名称                      |
| `checkPort`             | `Integer`             | **是**   | 健康检查端口                  |
| `useInstancePort4Check` | `Boolean`             | **是**   | 是否使用实例端口进行健康检查  |
| `healthChecker`         | `String`              | **是**   | 健康检查器配置（JSON 字符串） |
| `metadata`              | `Map<String, String>` | 否       | 集群的扩展元数据，默认为`""`  |

#### 返回数据


| 参数名 | 参数类型 | 描述         |
| -------- | ---------- | -------------- |
| `data` | `String` | 操作结果信息 |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ns/cluster' \
-H 'Content-Type: application/json' \
-d '{
  "namespaceId": "public",
  "serviceName": "service1",
  "clusterName": "cluster1",
  "checkPort": 8080,
  "useInstancePort4Check": true,
  "healthChecker": "{\"type\":\"TCP\"}",
  "metadata": {
    "key1": "value1"
  }
}'
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

#### 请求方式

`PUT`

#### 请求URL

`/nacos/v3/admin/ns/health/instance`

#### 请求参数


| 参数名        | 参数类型  | 是否必填 | 描述                            |
| --------------- | ----------- | ---------- | --------------------------------- |
| `namespaceId` | `String`  | 否       | 命名空间ID，默认为`public`      |
| `serviceName` | `String`  | **是**   | 服务名称                        |
| `groupName`   | `String`  | 否       | 分组名称，默认为`DEFAULT_GROUP` |
| `clusterName` | `String`  | 否       | 集群名称，默认`DEFAULT`         |
| `ip`          | `String`  | **是**   | 实例IP                          |
| `port`        | `Integer` | **是**   | 实例端口                        |
| `healthy`     | `Boolean` | **是**   | 健康状态（`true` 为健康）       |

#### 返回数据


| 参数名 | 参数类型 | 描述         |
| -------- | ---------- | -------------- |
| `data` | `String` | 操作结果信息 |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ns/health/instance' \
-H 'Content-Type: application/json' \
-d '{
  "namespaceId": "public",
  "serviceName": "service1",
  "groupName": "DEFAULT_GROUP",
  "clusterName": "cluster1",
  "ip": "127.0.0.1",
  "port": 8080,
  "healthy": true
}'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.16 获取所有健康检查器

#### 接口描述

获取系统中支持的所有健康检查器类型及其配置。

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/ns/health/checkers`

#### 请求参数

无

#### 返回数据


| 参数名 | 参数类型                             | 描述                   |
| -------- | -------------------------------------- | ------------------------ |
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
    "TCP": {},
    "HTTP": {
      "path": "",
      "headers": "",
      "expectedResponseCode": 200
    },
    "MYSQL": {
      "user": null,
      "pwd": null,
      "cmd": null
    },
    "NONE": {}
  }
}
```

### 2.17 注册实例

#### 接口描述

注册一个新的实例到指定服务。

#### 请求方式

`POST`

#### 请求URL

`/nacos/v3/admin/ns/instance`

#### 请求参数


| 参数名        | 参数类型              | 是否必填 | 描述                            |
| --------------- | ----------------------- | ---------- | --------------------------------- |
| `namespaceId` | `String`              | 否       | 命名空间ID，默认为`public`      |
| `serviceName` | `String`              | **是**   | 服务名称                        |
| `groupName`   | `String`              | 否       | 分组名称，默认为`DEFAULT_GROUP` |
| `clusterName` | `String`              | 否       | 集群名称，默认为`DEFAULT`       |
| `ip`          | `String`              | **是**   | 实例IP                          |
| `port`        | `Integer`             | **是**   | 实例端口                        |
| `weight`      | `Double`              | 否       | 实例权重，默认为`1.0`           |
| `healthy`     | `Boolean`             | 否       | 健康状态，默认为`true`          |
| `enabled`     | `Boolean`             | 否       | 是否启用，默认为`true`          |
| `metadata`    | `Map<String, String>` | 否       | 实例元数据                      |
| `ephemeral`   | `Boolean`             | 否       | 是否临时实例                    |

#### 返回数据


| 参数名 | 参数类型 | 描述         |
| -------- | ---------- | -------------- |
| `data` | `String` | 操作结果信息 |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance' \
-H 'Content-Type: application/json' \
-d '{
  "namespaceId": "public",
  "serviceName": "service1",
  "groupName": "DEFAULT_GROUP",
  "clusterName": "cluster1",
  "ip": "127.0.0.1",
  "port": 8080,
  "weight": 1.0,
  "healthy": true,
  "enabled": true,
  "metadata": {
    "key1": "value1"
  },
  "ephemeral": true
}'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.18 注销实例

#### 接口描述

从指定服务中注销一个实例。

#### 请求方式

`DELETE`

#### 请求URL

`/nacos/v3/admin/ns/instance`

#### 请求参数


| 参数名        | 参数类型              | 是否必填 | 描述                            |
| --------------- | ----------------------- | ---------- | --------------------------------- |
| `namespaceId` | `String`              | 否       | 命名空间ID，默认为`public`      |
| `serviceName` | `String`              | **是**   | 服务名称                        |
| `groupName`   | `String`              | 否       | 分组名称，默认为`DEFAULT_GROUP` |
| `clusterName` | `String`              | 否       | 集群名称，默认为`DEFAULT`       |
| `ip`          | `String`              | **是**   | 实例IP                          |
| `port`        | `Integer`             | **是**   | 实例端口                        |
| `weight`      | `Double`              | 否       | 实例权重，默认为`1.0`           |
| `healthy`     | `Boolean`             | 否       | 健康状态，默认为`true`          |
| `enabled`     | `Boolean`             | 否       | 是否启用，默认为`true`          |
| `metadata`    | `Map<String, String>` | 否       | 实例元数据                      |
| `ephemeral`   | `Boolean`             | 否       | 是否临时实例                    |

#### 返回数据


| 参数名 | 参数类型 | 描述         |
| -------- | ---------- | -------------- |
| `data` | `String` | 操作结果信息 |

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance' \
-H 'Content-Type: application/json' \
-d '{
  "namespaceId": "public",
  "serviceName": "service1",
  "groupName": "DEFAULT_GROUP",
  "clusterName": "cluster1",
  "ip": "127.0.0.1",
  "port": 8080,
  "weight": 1.0,
  "healthy": true,
  "enabled": true,
  "metadata": {
    "key1": "value1"
  },
  "ephemeral": true
}'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.19 更新实例

#### 接口描述

更新指定实例的信息。

#### 请求方式

`PUT`

#### 请求URL

`/nacos/v3/admin/ns/instance`

#### 请求参数


| 参数名        | 参数类型              | 是否必填 | 描述                            |
| --------------- | ----------------------- | ---------- | --------------------------------- |
| `namespaceId` | `String`              | 否       | 命名空间ID，默认为`public`      |
| `serviceName` | `String`              | **是**   | 服务名称                        |
| `groupName`   | `String`              | 否       | 分组名称，默认为`DEFAULT_GROUP` |
| `clusterName` | `String`              | 否       | 集群名称，默认为`DEFAULT`       |
| `ip`          | `String`              | **是**   | 实例IP                          |
| `port`        | `Integer`             | **是**   | 实例端口                        |
| `weight`      | `Double`              | 否       | 实例权重，默认为`1.0`           |
| `healthy`     | `Boolean`             | 否       | 健康状态，默认为`true`          |
| `enabled`     | `Boolean`             | 否       | 是否启用，默认为`true`          |
| `metadata`    | `Map<String, String>` | 否       | 实例元数据                      |
| `ephemeral`   | `Boolean`             | 否       | 是否临时实例                    |

#### 返回数据


| 参数名 | 参数类型 | 描述         |
| -------- | ---------- | -------------- |
| `data` | `String` | 操作结果信息 |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance' \
-H 'Content-Type: application/json' \
-d '{
  "namespaceId": "public",
  "serviceName": "service1",
  "groupName": "DEFAULT_GROUP",
  "clusterName": "cluster1",
  "ip": "127.0.0.1",
  "port": 8080,
  "weight": 1.0,
  "healthy": true,
  "enabled": true,
  "metadata": {
    "key1": "value1"  
  },
  "ephemeral": true
}'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.20 批量更新实例元数据

#### 接口描述

批量更新指定实例的元数据。

#### 请求方式

`PUT`

#### 请求URL

`/nacos/v3/admin/ns/instance/metadata/batch`

#### 请求参数


| 参数名            | 参数类型              | 是否必填 | 描述                                |
| ------------------- | ----------------------- | ---------- | ------------------------------------- |
| `namespaceId`     | `String`              | 否       | 命名空间ID，默认为`public`          |
| `serviceName`     | `String`              | **是**   | 服务名称                            |
| `groupName`       | `String`              | 否       | 分组名称，默认为`DEFAULT_GROUP`     |
| `instances`       | `String`              | 否       | 实例列表（JSON 字符串），默认为`""` |
| `metadata`        | `Map<String, String>` | **是**   | 元数据                              |
| `consistencyType` | `String`              | 否       | 一致性类型，默认为`""`              |

#### 返回数据


| **参数名**     | **参数类型**                       | **描述**       |
| ---------------- | ------------------------------------ | ---------------- |
| `data`         | `InstanceMetadataBatchOperationVo` | 操作结果信息   |
| `data.updated` | `List<String>`                     | 更新的实例列表 |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance/metadata/batch' \
-H 'Content-Type: application/json' \
-d '{
  "namespaceId": "public",
  "serviceName": "service1",
  "groupName": "DEFAULT_GROUP",
  "instances": "[{\"ip\":\"127.0.0.1\",\"port\":8080}]",
  "metadata": {
    "key1": "value1"
  },
  "consistencyType": "AP"
}'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "updated": ["127.0.0.1:8080"]
  }
}
```

### 2.21 批量删除实例元数据

#### 接口描述

批量删除指定实例的元数据。

#### 请求方式

`DELETE`

#### 请求URL

`/nacos/v3/admin/ns/instance/metadata/batch`

#### 请求参数


| 参数名            | 参数类型              | 是否必填 | 描述                                |
| ------------------- | ----------------------- | ---------- | ------------------------------------- |
| `namespaceId`     | `String`              | 否       | 命名空间ID，默认为`public`          |
| `serviceName`     | `String`              | **是**   | 服务名称                            |
| `groupName`       | `String`              | 否       | 分组名称，默认为`DEFAULT_GROUP`     |
| `instances`       | `String`              | 否       | 实例列表（JSON 字符串），默认为`""` |
| `metadata`        | `Map<String, String>` | **是**   | 元数据                              |
| `consistencyType` | `String`              | 否       | 一致性类型，默认为`""`              |

#### 返回数据


| **参数名**     | **参数类型**                       | **描述**       |
| ---------------- | ------------------------------------ | ---------------- |
| `data`         | `InstanceMetadataBatchOperationVo` | 操作结果信息   |
| `data.updated` | `List<String>`                     | 更新的实例列表 |

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance/metadata/batch' \
-H 'Content-Type: application/json' \
-d '{
  "namespaceId": "public",
  "serviceName": "service1",
  "groupName": "DEFAULT_GROUP",
  "instances": "[{"ip":"127.0.0.1","port":8080}]",
  "metadata": {
    "key1": "value1"
  },
  "consistencyType": "AP"
}'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "updated": ["127.0.0.1:8080"]
  }
}
```

### 2.22 部分更新实例

#### 接口描述

部分更新指定实例的信息。

#### 请求方式

`PUT`

#### 请求URL

`/nacos/v3/admin/ns/instance/partial`

#### 请求参数


| **参数名**    | **参数类型** | **是否必填** | **描述**                   |
| --------------- | -------------- | -------------- | ---------------------------- |
| `namespaceId` | `String`     | 否           | 命名空间ID，默认为`public` |
| `serviceName` | `String`     | **是**       | 服务名称                   |
| `ip`          | `String`     | **是**       | 实例IP                     |
| `port`        | `Integer`    | **是**       | 实例端口                   |
| `clusterName` | `String`     | 否           | 集群名称，默认为`DEFAULT`  |
| `weight`      | `Double`     | 否           | 实例权重，默认为1.0        |
| `enabled`     | `Boolean`    | 否           | 是否启用，默认启用         |
| `metadata`    | `String`     | 否           | 实例元数据（JSON 字符串）  |

#### 返回数据


| 参数名 | 参数类型 | 描述         |
| -------- | ---------- | -------------- |
| `data` | `String` | 操作结果信息 |

#### 示例

* 请求示例

```shell
curl -X PUT "http://localhost:8080/nacos/v3/admin/ns/instance/partial?namespaceId=public&serviceName=example-service&ip=127.0.0.1&clusterName=DEFAULT&port=8080&weight=1.0&enabled=true&metadata={\"key\":\"value\"}"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.23 查询服务实例列表

#### 接口描述

查询指定服务的所有实例列表。

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/ns/instance/list`

#### 请求参数


| **参数名**    | **参数类型** | **是否必填** | **描述**                          |
| --------------- | -------------- | -------------- | ----------------------------------- |
| `namespaceId` | `String`     | 否           | 命名空间ID，默认`public`          |
| `groupName`   | `String`     | 否           | 分组名称，默认为`DEFAULT_GROUP`   |
| `serviceName` | `String`     | **是**       | 服务名称                          |
| `clusterName` | `String`     | 否           | 集群名称，默认为`""`              |
| `ip`          | `String`     | **是**       | 实例IP                            |
| `port`        | `Integer`    | **是**       | 实例端口                          |
| `healthyOnly` | `Boolean`    | 否           | 是否只返回健康实例，默认为`false` |

#### 返回数据


| 参数名                                 | 参数类型   | 描述说明           |
| ---------------------------------------- | ------------ | -------------------- |
| `data`                                 |            | 指定服务的实例列表 |
| `data.name`                            | `String`   | 分组名@@服务名     |
| `data.groupName`                       | `String`   | 分组名             |
| `data.clusters`                        | `String`   | 集群名             |
| `data.cacheMillis`                     | `int`      | 缓存时间           |
| `data.hosts`                           | `Object[]` | 实例列表           |
| `data.hosts.ip`                        | `String`   | 实例`IP`           |
| `data.hosts.port`                      | `int`      | 实例端口号         |
| `data.hosts.weight`                    | `double`   | 实例权重           |
| `data.hosts.healthy`                   | `boolean`  | 实例是否健康       |
| `data.hosts.enabled`                   | `boolean`  | 实例是否可用       |
| `data.hosts.ephemeral`                 | `boolean`  | 是否为临时实例     |
| `data.hosts.clusterName`               | `String`   | 实例所在的集群名称 |
| `data.hosts.serviceName`               | `String`   | 服务名             |
| `data.hosts.metadata`                  | `map`      | 实例元数据         |
| `data.hosts.instanceHeartBeatTimeOut`  | `int`      | 实例心跳超时时间   |
| `data.hosts.ipDeleteTimeout`           | `int`      | 实例删除超时时间   |
| `data.hosts.instanceHeartBeatInterval` | `int`      | 实例心跳间隔       |
| `data.lastRefTime`                     | `int`      | 上次刷新时间       |
| `data.checksum`                        | `int`      | 校验码             |
| `data.allIPs`                          | `boolean`  | 是否所有IP         |
| `data.reachProtectionThreshold`        | `boolean`  | 是否到达保护阈值   |
| `data.valid`                           | `boolean`  | 是否有效           |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance/list?namespaceId=public&serviceName=service1&healthyOnly=true'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "name": "DEFAULT_GROUP@@test_service",
    "groupName": "DEFAULT_GROUP",
    "clusters": "",
    "cacheMillis": 10000,
    "hosts": [
            {
      "ip": "127.0.0.1",
      "port": 8080,
      "weight": 1.0,
      "healthy": true,
      "enabled": true,
      "ephemeral": true,
      "clusterName": "DEFAULT",
      "serviceName": "DEFAULT_GROUP@@test_service",
      "metadata": {
              "value": "1"
      },
      "instanceHeartBeatTimeOut": 15000,
      "ipDeleteTimeout": 30000,
      "instanceHeartBeatInterval": 5000
            }
    ],
    "lastRefTime": 1662554390814,
    "checksum": "",
    "allIPs": false,
    "reachProtectionThreshold": false,
    "valid": true
  }
}
```

### 2.24 查询实例详情

#### 接口描述

查询指定实例的详细信息。

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/ns/instance`

#### 请求参数


| **参数名**    | **参数类型** | **是否必填** | **描述说明**                  |
| --------------- | -------------- | -------------- | ------------------------------- |
| `namespaceId` | `String`     | 否           | 命名空间Id，默认为`public`    |
| `groupName`   | `String`     | **否**       | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName` | `String`     | **是**       | 服务名                        |
| `clusterName` | `String`     | 否           | 集群名称，默认为`DEFAULT`     |
| `ip`          | `String`     | **是**       | `IP`地址                      |
| `port`        | `int`        | **是**       | 端口号                        |

### 2.25 创建服务

#### 接口描述

创建一个新的持久化服务。

#### 请求方式

`POST`

#### 请求URL

`/nacos/v3/admin/ns/service`

#### 请求参数


| 参数名             | 参数类型         | 是否必填 | 描述说明                      |
| -------------------- | ------------------ | ---------- | ------------------------------- |
| `namespaceId`      | `String`         | 否       | 命名空间`Id`，默认为`public`  |
| `groupName`        | `String`         | 否       | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName`      | `String`         | **是**   | 服务名                        |
| `metadata`         | `JSON格式String` | 否       | 服务元数据，默认为空          |
| `ephemeral`        | `boolean`        | 否       | 是否为临时实例，默认为`false` |
| `protectThreshold` | `float`          | 否       | 保护阈值，默认为`0`           |
| `selector`         | `JSON格式String` | 否       | 访问策略，默认为空            |

#### 返回数据


| 参数名 | 参数类型  | 描述         |
| -------- | ----------- | -------------- |
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

### 2.26 删除服务

#### 接口描述

删除指定服务

#### 请求方式

`DELETE`

#### 请求URL

`/nacos/v3/admin/ns/service`

#### 请求参数


| 参数名        | 参数类型 | 是否必填 | 描述说明                      |
| --------------- | ---------- | ---------- | ------------------------------- |
| `namespaceId` | `String` | 否       | 命名空间`Id`，默认为`public`  |
| `groupName`   | `String` | 否       | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName` | `String` | **是**   | 服务名                        |

#### 返回数据


| 参数名 | 参数类型  | 描述         |
| -------- | ----------- | -------------- |
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

### 2.27 查询服务详情

#### 接口描述

查询指定服务的详细信息

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/ns/service`

#### 请求参数


| 参数名        | 参数类型 | 是否必填 | 描述说明                      |
| --------------- | ---------- | ---------- | ------------------------------- |
| `namespaceId` | `String` | 否       | 命名空间`Id`，默认为`public`  |
| `groupName`   | `String` | 否       | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName` | `String` | **是**   | 服务名                        |

#### 返回数据


| 参数名                  | 参数类型  | 描述说明       |
| ------------------------- | ----------- | ---------------- |
| `data`                  |           | 服务信息       |
| `data.namespace`        | `String`  | 命名空间       |
| `data.groupName`        | `String`  | 分组名         |
| `data.serviceName`      | `String`  | 服务名         |
| `data.clusterMap`       | `map`     | 集群信息       |
| `data.metadata`         | `map`     | 服务元数据     |
| `data.protectThreshold` | `float`   | 保护阈值       |
| `data.selector`         | `Object`  | 访问策略       |
| `data.ephemeral`        | `Boolean` | 是否为临时实例 |

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
      "namespace": "public",
      "serviceName": "nacos.test.1",
      "groupName": "DEFAULT_GROUP",
      "clusterMap": {},
      "metadata": {},
      "protectThreshold": 0,
      "selector": {
              "type": "none",
              "contextType": "NONE"
      },
      "ephemeral": false
  }
}
```

### 2.28 查询服务列表

#### 接口描述

查询所有服务的列表，支持分页和条件过滤。

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/ns/service/list`

#### 请求参数


| 参数名        | 参数类型         | 是否必填 | 描述说明                          |
| --------------- | ------------------ | ---------- | ----------------------------------- |
| `namespaceId` | `String`         | 否       | 命名空间`Id`，默认为`public`      |
| `groupName`   | `String`         | 否       | 分组名，默认为`DEFAULT_GROUP`     |
| `selector`    | `JSON格式String` | **是**   | 访问策略                          |
| `pageNo`      | `int`            | 否       | 当前页，默认为`1`                 |
| `pageSize`    | `int`            | 否       | 页条目数，默认为`20`，最大为`500` |

#### 返回数据


| 参数名          | 参数类型   | 描述说明         |
| ----------------- | ------------ | ------------------ |
| `data`          |            | 服务列表信息     |
| `data.count`    | `String`   | 服务数目         |
| `data.services` | `String[]` | 分页后的服务列表 |

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
          "count": 2,
          "services": [
                  "nacos.test.1",
                  "nacos.test.2"
          ]
  }
}
```

### 2.29 更新服务

#### 接口描述

更新指定服务的配置信息。

#### 请求方式

`PUT`

#### 请求URL

`/nacos/v3/admin/ns/service`

#### 请求参数


| 参数名             | 参数类型         | 是否必填 | 描述说明                      |
| -------------------- | ------------------ | ---------- | ------------------------------- |
| `namespaceId`      | `String`         | 否       | 命名空间`Id`，默认为`public`  |
| `groupName`        | `String`         | 否       | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName`      | `String`         | **是**   | 服务名                        |
| `metadata`         | `JSON格式String` | 否       | 服务元数据，默认为空          |
| `protectThreshold` | `float`          | 否       | 保护阈值，默认为`0`           |
| `selector`         | `JSON格式String` | 否       | 访问策略，默认为空            |

#### 返回数据


| 参数名 | 参数类型  | 描述         |
| -------- | ----------- | -------------- |
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

### 2.30 搜索服务

#### 接口描述

根据条件搜索服务。

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/ns/service/names`

#### 请求参数


| **参数名**    | **参数类型** | **是否必填** | **描述**   |
| --------------- | -------------- | -------------- | ------------ |
| `namespaceId` | `String`     | 否           | 命名空间ID |
| `expr`        | `String`     | 否           | 搜索表达式 |

#### 返回数据


| 参数名                   | 参数类型  | 描述说明 |
| -------------------------- | ----------- | ---------- |
| `data`                   |           | 服务信息 |
| `data.META-INF/services` | `String`  | 服务列表 |
| `data.count`             | `Integer` | 服务总数 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/service/names?namespaceId=public&expr=service'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "META-INF/services": {
      "public": ["service1"]
    },
    "count": 1
  }
}
```

### 2.31 查询订阅者列表

#### 接口描述

查询指定服务的订阅者列表。

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/ns/service/subscribers`

#### 请求参数


| **参数名**    | **参数类型** | **是否必填** | **描述**                        |
| --------------- | -------------- | -------------- | --------------------------------- |
| `namespaceId` | `String`     | 否           | 命名空间ID，默认为`public`      |
| `serviceName` | `String`     | **是**       | 服务名称                        |
| `groupName`   | `String`     | 否           | 分组名称，默认是`DEFAULT_GROUP` |
| `pageNo`      | `Integer`    | 否           | 页码                            |
| `pageSize`    | `Integer`    | 否           | 每页大小                        |
| `aggregation` | `Boolean`    | 否           | 是否聚合,默认为`true`           |

#### 返回数据


| 参数名                         | 参数类型   | 描述                             |
| -------------------------------- | ------------ | ---------------------------------- |
| `data`                         | ObjectNode | 订阅者列表和总数信息             |
| `data.subscribers`             | Array      | 订阅者列表，每个订阅者是一个对象 |
| `data.subscribers.addrStr`     | String     | 订阅者的地址（`ip:port`）        |
| `data.subscribers.agent`       | String     | 订阅者的代理信息                 |
| `data.subscribers.app`         | String     | 订阅者所属的应用名称             |
| `data.subscribers.ip`          | String     | 订阅者的 IP 地址                 |
| `data.subscribers.port`        | Integer    | 订阅者的端口号                   |
| `data.subscribers.namespaceId` | String     | 订阅者所属的命名空间 ID          |
| `data.subscribers.serviceName` | String     | 订阅者订阅的服务名称             |
| `data.subscribers.cluster`     | String     | 订阅者所属的集群名称             |
| `data.count`                   | Integer    | 订阅者总数                       |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/service/subscribers?namespaceId=public&serviceName=service1&groupName=DEFAULT_GROUP&pageNo=1&pageSize=10'
```

* 返回示例

```json
  "code": 0,
  "message": "success",
  "data": {
    "subscribers": [
    {
      "addrStr": "127.0.0.1:8080",
      "agent": "agent-1",
      "app": "app-1",
      "ip": "127.0.0.1",
      "port": 8080,
      "namespaceId": "namespace-1",
      "serviceName": "service-1",
      "cluster": "cluster-1"
    }
],
    "count": 0
  }
}
```

### 2.32 查询选择器类型

#### 接口描述

查询系统中支持的所有选择器类型。

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/ns/service/selector/types`

#### 请求参数

无

#### 返回数据


| 参数名 | 参数类型       | 描述           |
| -------- | ---------------- | ---------------- |
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
  "data": ["none", "label"]
}
```

## 3. Nacos Config 运维 API

### 3.1. 获取配置

#### 接口描述

获取指定配置

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/cs/config`

#### 请求参数


| **参数名**    | **类型** | **必填** | **默认值** | **参数描述** |
| --------------- | ---------- | ---------- | ------------ | -------------- |
| `namespaceId` | `String` | 否       | `public`   | 命名空间     |
| `groupName`   | `String` | **是**   | 无         | 配置分组名   |
| `dataId`      | `String` | **是**   | 无         | 配置名       |

#### 返回数据


| **参数名**              | **参数类型** | **描述**                   |
| ------------------------- | -------------- | ---------------------------- |
| `data`                  |              | 配置信息                   |
| `data.id`               | `String`     | 配置数据库ID               |
| `data.dataId`           | `String`     | 配置名                     |
| `data.group`            | `String`     | 配置分组                   |
| `data.content`          | `String`     | 配置内容                   |
| `data.md5`              | `String`     | 配置内容的 MD5 校验值      |
| `data.encryptedDataKey` | `String`     | 加密数据的密钥             |
| `data.tenant`           | `String`     | 配置所属的命名空间（租户） |
| `data.appName`          | `String`     | 配置所属的应用名称         |
| `data.type`             | `String`     | 配置类型（如`text`）       |
| `data.createTime`       | `Long`       | 配置创建时间               |
| `data.modifyTime`       | `Long`       | 配置修改时间               |
| `data.createUser`       | `String`     | 配置创建用户               |
| `data.createIp`         | `String`     | 配置的创建 IP 地址         |
| `data.desc`             | `String`     | 配置的描述信息             |
| `data.use`              | `String`     | -                          |
| `data.effect`           | `String`     | -                          |
| `data.schema`           | `String`     | -                          |
| `data.configTags`       | `String`     | 配置标签                   |

#### 示例

* 请求示例

  ```shell
  curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/config?dataId=nacos.example&group=DEFAULT_GROUP&namespaceId=public'
  ```
* 返回示例

  ```json
  {
    "code": 0,
    "message": "success",
    "data": {
      "id": "853983554312032256",
      "dataId": "test",
      "group": "DEFAULT_GROUP",
      "content": "test=12321",
      "md5": "bb977e1e30abe9c0399aa67dc0263725",
      "encryptedDataKey": "",
      "tenant": "public",
      "appName": "",
      "type": "text",
      "createTime": 1737034785683,
      "modifyTime": 1737034785683,
      "createUser": null,
      "createIp": "10.29.120.181",
      "desc": null,
      "use": null,
      "effect": null,
      "schema": null,
      "configTags": null
    }
  }
  ```

### 3.2. 发布配置

#### 接口描述

发布指定配置

> 当配置已存在时，则对配置进行更新

#### 请求方式

`POST`

#### 请求URL

`/nacos/v3/admin/cs/config`

#### 请求Body


| 参数名        | 类型     | 必填   | 默认值   | 参数描述                       |
| --------------- | ---------- | -------- | ---------- | -------------------------------- |
| `namespaceId` | `String` | 否     | `public` | 命名空间                       |
| `groupName`   | `String` | **是** | 无       | 配置组名                       |
| `dataId`      | `String` | **是** | 无       | 配置名                         |
| `content`     | `String` | **是** | 无       | 配置内容                       |
| `tag`         | `String` | 否     | 无       | 标签                           |
| `appName`     | `String` | 否     | 无       | 应用名                         |
| `srcUser`     | `String` | 否     | 无       | 源用户                         |
| `configTags`  | `String` | 否     | 无       | 配置标签列表，可多个，逗号分隔 |
| `desc`        | `String` | 否     | 无       | 配置描述                       |
| `use`         | `String` | 否     | 无       | -                              |
| `effect`      | `String` | 否     | 无       | -                              |
| `type`        | `String` | 否     | 无       | 配置类型                       |
| `schema`      | `String` | 否     | 无       | -                              |

#### 返回数据


| 参数名 | 参数类型  | 描述         |
| -------- | ----------- | -------------- |
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

#### 请求URL

`/nacos/v3/admin/cs/config`

#### 请求参数


| 参数名        | 类型     | 必填   | 默认值   | 参数描述   |
| --------------- | ---------- | -------- | ---------- | ------------ |
| `namespaceId` | `String` | 否     | `public` | 命名空间   |
| `groupName`   | `String` | **是** | 无       | 配置分组名 |
| `dataId`      | `String` | **是** | 无       | 配置名     |
| `tag`         | `String` | 否     | 无       | 配置标签   |

#### 返回数据


| 参数名 | 参数类型  | 描述         |
| -------- | ----------- | -------------- |
| `data` | `boolean` | 是否执行成功 |

#### 示例

* 请求示例

  ```shell
  curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/cs/config?dataId=nacos.example&group=DEFAULT_GROUP&namespaceId=public'
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

#### 请求URL

`/nacos/v3/admin/cs/config/batch`

#### 请求参数


| 参数名 | 参数类型     | 是否必填 | 描述       |
| -------- | -------------- | ---------- | ------------ |
| `ids`  | `List<Long>` | **是**   | 配置ID列表 |

#### 返回数据


| 参数名 | 参数类型  | 描述     |
| -------- | ----------- | ---------- |
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

### 3.5 查询配置的额外信息

#### 接口描述

查询指定配置的额外信息

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/cs/config/extInfo`

#### 请求参数


| **参数名**    | **参数类型** | **是否必填** | **默认值** | **描述** |
| --------------- | -------------- | -------------- | ------------ | ---------- |
| `namespaceId` | `String`     | 否           | `public`   | 命名空间 |
| `dataId`      | `String`     | **是**       | 无         | 配置ID   |
| `groupName`   | `String`     | **是**       | 无         | 分组名称 |

#### 返回数据


| 参数名            | 参数类型 | 描述               |
| ------------------- | ---------- | -------------------- |
| `data`            |          | 包含配置的详细信息 |
| `data.createTime` | `Long`   | 配置的创建时间     |
| `data.modifyTime` | `Long`   | 配置的修改时间     |
| `data.createUser` | `String` | 配置的创建用户     |
| `data.createIp`   | `String` | 配置的创建 IP 地址 |
| `data.desc`       | `String` | 配置的描述信息     |
| `data.use`        | `String` | -                  |
| `data.effect`     | `String` | -                  |
| `data.type`       | `String` | 配置的类型         |
| `data.schema`     | `String` | -                  |
| `data.configTags` | `String` | 配置的标签         |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/extInfo?namespaceId=public&dataId=example&groupName=DEFAULT_GROUP'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "createTime": 1737034785683,
    "modifyTime": 1737034785683,
    "createUser": "admin",
    "createIp": "10.29.120.181",
    "desc": "Test configuration",
    "use": "Testing",
    "effect": "Immediate",
    "type": "text",
    "schema": "custom",
    "configTags": "test,example"
  }
}
```

### 3.6 查询配置的监听者

#### 接口描述

查询指定配置的监听者信息

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/cs/config/listener`

#### 请求参数


| 参数名        | 参数类型  | 是否必填 | 默认值   | 描述                 |
| --------------- | ----------- | ---------- | ---------- | ---------------------- |
| `namespaceId` | `String`  | 否       | `public` | 命名空间             |
| `dataId`      | `String`  | **是**   | 无       | 配置ID               |
| `groupName`   | `String`  | **是**   | 无       | 分组名称             |
| `sampleTime`  | `Integer` | **否**   | `1`      | 采样时间（单位：秒） |

#### 返回数据


| 参数名                                | 参数类型                        | 描述               |
| --------------------------------------- | --------------------------------- | -------------------- |
| `data`                                | `Object`                        | 包含配置的详细信息 |
| `data.collectStatus`                  | `Integer`                       | 收集状态           |
| `data.lisentersGroupkeyStatus`        | `List<GroupkeyListenserStatus>` | 监听者信息列表     |
| `data.lisentersGroupkeyStatus[].ip`   | `String`                        | 监听者IP地址       |
| `data.lisentersGroupkeyStatus[].port` | `Integer`                       | 监听者端口号       |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/listener?namespaceId=public&dataId=example&groupName=DEFAULT_GROUP&sampleTime=5'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "collectStatus": 200,
    "lisentersGroupkeyStatus": [
      {
        "ip": "127.0.0.1",
        "port": 8080
      }
    ]
  }
}
```

### 3.7 根据配置详情搜索配置

#### 接口描述

根据配置详情（如内容、标签等）搜索配置。

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/cs/config/searchDetail`

#### 请求参数


| 参数名         | 参数类型  | 是否必填 | 默认值   | 描述                          |
| ---------------- | ----------- | ---------- | ---------- | ------------------------------- |
| `namespaceId`  | `String`  | 否       | `public` | 命名空间                      |
| `dataId`       | `String`  | 否       | `""`     | 配置ID                        |
| `groupName`    | `String`  | 否       | `""`     | 分组名称                      |
| `configDetail` | `String`  | 否       | 无       | 配置详情                      |
| `search`       | `String`  | 否       | `blur`   | 搜索模式（`blur` 或 `exact`） |
| `pageNo`       | `Integer` | **是**   | 1        | 页码                          |
| `pageSize`     | `Integer` | **是**   | 100      | 每页大小                      |

#### 返回数据


| 参数名 | 参数类型           | 描述     |
| -------- | -------------------- | ---------- |
| `data` | `Page<ConfigInfo>` | 配置列表 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/searchDetail?pageNo=1&pageSize=10'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "totalCount": 2,
    "pageNumber": 1,
    "pagesAvailable": 1,
    "pageItems": [
      {
        "id": "853983554312032256",
        "dataId": "test",
        "group": "DEFAULT_GROUP",
        "content": "test=12321",
        "md5": null,
        "encryptedDataKey": "",
        "tenant": "public",
        "appName": "",
        "type": "text"
      }
    ]
  }
}
```

### 3.8 停止Beta配置

#### 接口描述

停止指定配置的Beta配置

#### 请求方式

`DELETE`

#### 请求URL

`/nacos/v3/admin/cs/config/beta`

#### 请求参数


| 参数名        | 参数类型 | 是否必填 | 默认值   | 描述     |
| --------------- | ---------- | ---------- | ---------- | ---------- |
| `namespaceId` | `String` | 否       | `public` | 命名空间 |
| `dataId`      | `String` | **是**   | 无       | 配置ID   |
| `groupName`   | `String` | **是**   | 无       | 分组名称 |

#### 返回数据


| 参数名 | 参数类型  | 描述     |
| -------- | ----------- | ---------- |
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

### 3.9 查询Beta配置

#### 接口描述

查询指定配置的Beta配置

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/cs/config/beta`

#### 请求参数


| 参数名        | 参数类型 | 是否必填 | 默认值   | 描述     |
| --------------- | ---------- | ---------- | ---------- | ---------- |
| `namespaceId` | `String` | 否       | `public` | 命名空间 |
| `dataId`      | `String` | **是**   | 无       | 配置ID   |
| `groupName`   | `String` | **是**   | 无       | 分组名称 |

#### 返回数据


| 参数名                  | 参数类型          | 描述             |
| ------------------------- | ------------------- | ------------------ |
| `data`                  | `ConfigInfo4Beta` | Beta配置信息     |
| `data.id`               | `String`          | 配置的唯一ID     |
| `data.dataId`           | `String`          | 配置的ID         |
| `data.group`            | `String`          | 配置的分组名称   |
| `data.content`          | `String`          | 配置的内容       |
| `data.md5`              | `String`          | 配置内容的MD5值  |
| `data.encryptedDataKey` | `String`          | 加密数据的密钥   |
| `data.type`             | `String`          | 配置的类型       |
| `data.appName`          | `String`          | 应用名称         |
| `data.tenant`           | `String`          | 租户信息         |
| `data.betaIps`          | `List<String>`    | Beta测试的IP列表 |

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
    "id": "1",
    "dataId": "example",
    "group": "DEFAULT_GROUP",
    "content": "example content",
    "md5": "null",
    "encryptedDataKey": "",
    "type": "text",
    "appName": "exampleApp",
    "tenant": "public",
    "betaIps": ["127.0.0.1"]
  }
}
```

### 3.10 导入并发布配置

#### 接口描述

导入配置并发布到指定命名空间

#### 请求方式

`POST`

#### 请求URL

`/nacos/v3/admin/cs/config/import`

#### 请求参数


| 参数名        | 参数类型           | 是否必填 | 默认值   | 描述         |
| --------------- | -------------------- | ---------- | ---------- | -------------- |
| `namespaceId` | `String`           | 否       | `public` | 命名空间     |
| `src_user`    | `String`           | 否       | 无       | 操作用户     |
| `policy`      | `SameConfigPolicy` | 否       | `ABORT`  | 冲突处理策略 |
| `file`        | `MultipartFile`    | **是**   | 无       | 配置文件     |

#### 返回数据


| 参数名           | 参数类型              | 描述         |
| ------------------ | ----------------------- | -------------- |
| `data`           | `Map<String, Object>` | 导入结果     |
| `data.succCount` | `Integer`             | 成功导入数量 |
| `data.skipCount` | `Integer`             | 跳过导入数量 |

#### 示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/import' \
-H 'Content-Type: multipart/form-data' \
-F 'namespaceId=public' \
-F 'file=@config.zip'
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

### 3.11 导出配置

#### 接口描述

导出指定配置为ZIP文件。

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/cs/config/export`

#### 请求参数


| 参数名        | 参数类型     | 是否必填 | 默认值   | 描述       |
| --------------- | -------------- | ---------- | ---------- | ------------ |
| `namespaceId` | `String`     | 否       | `public` | 命名空间   |
| `groupName`   | `String`     | 否       | `""`     | 配置分组   |
| `dataId`      | `String`     | 否       | `""`     | 配置ID     |
| `ids`         | `List<Long>` | 否       | 无       | 配置ID列表 |

#### 返回数据

返回体为ZIP文件，包含配置内容和元数据

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/export?namespaceId=public&ids=1,2,3' \
--output config.zip
```

### 3.12 克隆配置

#### 接口描述

克隆配置到指定命名空间

#### 请求方式

`POST`

#### 请求URL

`/nacos/v3/admin/cs/config/clone`

#### 请求参数


| 参数名            | 参数类型                             | 是否必填 | 默认值   | 描述             |
| ------------------- | -------------------------------------- | ---------- | ---------- | ------------------ |
| `namespaceId`     | `String`                             | **是**   | `public` | 命名空间ID       |
| `src_user`        | `String`                             | 否       | 无       | 操作用户         |
| `configBeansList` | `List<SameNamespaceCloneConfigBean>` | **是**   | 无       | 配置克隆参数列表 |
| `policy`          | `SameConfigPolicy`                   | 否       | `ABORT`  | 冲突处理策略     |

#### 返回数据


| 参数名           | 参数类型              | 描述         |
| ------------------ | ----------------------- | -------------- |
| `data`           | `Map<String, Object>` | 导入结果     |
| `data.succCount` | `Integer`             | 成功导入数量 |
| `data.skipCount` | `Integer`             | 跳过导入数量 |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/clone' \
-H 'Content-Type: application/json' \
-d '{
  "namespaceId": "public",
  "configBeansList": [
    {
      "cfgId": 1,
      "group": "DEFAULT_GROUP",
      "dataId": "example"
    }
  ]
}'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "succCount": 1,
    "skipCount": 0
  }
}
```

### 3.13. 查询配置历史列表

#### 接口描述

获取指定配置的历史版本列表

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/cs/history/list`

#### 请求参数


| 参数名        | 类型     | 必填   | 默认值               | 参数描述   |
| --------------- | ---------- | -------- | ---------------------- | ------------ |
| `namespaceId` | `String` | 否     | `public`             | 命名空间   |
| `group`       | `String` | **是** | 无                   | 配置分组名 |
| `dataId`      | `String` | **是** | 无                   | 配置名     |
| `pageNo`      | `int`    | 否     | `1`                  | 当前页     |
| `pageSize`    | `int`    | 否     | `100`（最大为`500`） | 页条目数   |

#### 返回数据


| 参数名                | 参数类型   | 描述说明       |
| ----------------------- | ------------ | ---------------- |
| `data`                |            | 分页查询结果   |
| `data.totalCount`     | `int`      | 总数           |
| `data.pageNumber`     | `int`      | 当前页         |
| `data.pagesAvailable` | `int`      | 总页数         |
| `data.pageItems`      | `Object[]` | 历史配置项列表 |

#### 示例

* 请求示例

  ```shell
  curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/history/list?dataId=nacos.example&group=com.alibaba.nacos&namespaceId='
  ```
* 返回示例

  ```json
  {
    "code": 0,
    "message": "success",
    "data": {
            "totalCount": 10,
            "pageNumber": 1,
            "pagesAvailable": 1,
            "pageItems": [
                    {
            "id": "203",
            "lastId": -1,
            "dataId": "nacos.example",
            "group": "com.alibaba.nacos",
            "tenant": "",
            "appName": "",
            "md5": "9f67e6977b100e00cab385a75597db58",
            "content": "contentTest",
            "srcIp": "0:0:0:0:0:0:0:1",
            "srcUser": null,
            "opType": "I",
            "createdTime": "2010-05-04T16:00:00.000+0000",
            "lastModifiedTime": "2020-12-05T01:48:03.380+0000"
                    }
            ]
    }

   }
  ```

### 3.14. 查询配置上一版本信息

#### 接口描述

获取指定配置的上一版本

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/cs/history/previous`

#### 请求参数


| 参数名      | 类型     | 必填   | 默认值   | 参数描述   |
| ------------- | ---------- | -------- | ---------- | ------------ |
| namespaceId | `String` | 否     | `public` | 命名空间   |
| group       | `String` | **是** | 无       | 配置分组名 |
| dataId      | `String` | **是** | 无       | 配置名     |
| id          | `long`   | **是** | 无       | 配置Id     |

#### 返回数据


| 参数名                  | 参数类型 | 描述说明             |
| ------------------------- | ---------- | ---------------------- |
| `data`                  |          | 历史配置项           |
| `data.id`               | `String` | 配置的唯一ID         |
| `data.lastId`           | `Long`   | 上一个配置的ID       |
| `data.dataId`           | `String` | 配置的ID             |
| `data.group`            | `String` | 配置的分组名称       |
| `data.tenant`           | `String` | 租户信息             |
| `data.appName`          | `String` | 应用名称             |
| `data.md5`              | `String` | 配置内容的MD5值      |
| `data.content`          | `String` | 配置的内容           |
| `data.srcIp`            | `String` | 操作来源IP           |
| `data.srcUser`          | `String` | 操作用户             |
| `data.opType`           | `String` | 操作类型             |
| `data.publishType`      | `String` | 发布类型             |
| `data.grayName`         | `String` | 灰度发布名称         |
| `data.extInfo`          | `String` | 扩展信息（JSON格式） |
| `data.createdTime`      | `String` | 配置创建时间         |
| `data.lastModifiedTime` | `String` | 配置最后修改时间     |
| `data.encryptedDataKey` | `String` | 加密数据的密钥       |

#### 示例

* 请求示例

  ```shell
  curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/history/previous?id=309135486247505920&dataId=nacos.example&group=com.alibaba.nacos&namespaceId='
  ```
* 返回示例

  ```json
  {
      "code": 0,
      "message": "success",
      "data": {
          "id": "102",
          "lastId": -1,
          "dataId": "test",
          "group": "DEFAULT_GROUP",
          "tenant": "public",
          "appName": "",
          "md5": "bb977e1e30abe9c0399aa67dc0263725",
          "content": "test=12321",
          "srcIp": "10.29.120.181",
          "srcUser": null,
          "opType": "U         ",
          "publishType": "formal",
          "grayName": "",
          "extInfo": "{\"type\":\"text\"}",
          "createdTime": "2010-05-04T16:00:00.000+00:00",
          "lastModifiedTime": "2025-01-18T08:23:05.393+00:00",
          "encryptedDataKey": ""
      }
  }
  ```

### 3.15. 查询指定命名空间下的配置列表

#### 接口描述

获取指定命名空间下的配置信息列表

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/cs/history/configs`

#### 请求参数


| 参数名      | 类型     | 必填   | 默认值 | 参数描述 |
| ------------- | ---------- | -------- | -------- | ---------- |
| namespaceId | `String` | **是** | 无     | 命名空间 |

#### 返回数据


| 参数名                  | 参数类型 | 描述说明             |
| ------------------------- | ---------- | ---------------------- |
| `data`                  |          | 配置信息列表         |
| `data.id`               | `String` | 配置`Id`             |
| `data.dataId`           | `String` | 配置名               |
| `data.group`            | `String` | 配置分组             |
| `data.content`          | `String` | 配置内容             |
| `data.md5`              | `String` | 配置内容的md5值      |
| `data.encryptedDataKey` | `String` | 加密密钥             |
| `data.tenant`           | `String` | 租户信息（命名空间） |
| `data.appName`          | `String` | 应用名               |
| `data.type`             | `String` | 配置文件类型         |
| `data.lastModified`     | `long`   | 上次修改时间         |

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
            "id": "0",
            "dataId": "nacos.example",
            "group": "com.alibaba.nacos",
            "content": null,
            "md5": null,
            "encryptedDataKey": null,
            "tenant": "",
            "appName": "",
            "type": "yaml",
            "lastModified": 0
        }
    ]
}
```

### 3.16 查询容量信息

#### 接口描述

查询指定分组或命名空间的容量信息

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/cs/capacity`

#### 请求参数


| 参数名        | 参数类型 | 是否必填 | 默认值 | 描述       |
| --------------- | ---------- | ---------- | -------- | ------------ |
| `groupName`   | `String` | 否       | 无     | 分组名称   |
| `namespaceId` | `String` | 否       | 无     | 命名空间ID |

**注意** ：`groupName` 和 `namespaceId` 至少需要提供一个。

#### 返回数据


| 参数名              | 参数类型   | 描述             |
| --------------------- | ------------ | ------------------ |
| `data`              | `Capacity` | 容量信息         |
| `data.id`           | `Long`     | 容量信息的唯一ID |
| `data.groupName`    | `String`   | 分组名称         |
| `data.namespaceId`  | `String`   | 命名空间ID       |
| `data.quota`        | `Integer`  | 配额             |
| `data.usage`        | `Integer`  | 当前使用量       |
| `data.maxSize`      | `Integer`  | 最大单配置大小   |
| `data.maxAggrCount` | `Integer`  | 最大聚合配置数量 |
| `data.maxAggrSize`  | `Integer`  | 最大聚合配置大小 |
| `data.gmtCreate`    | `String`   | 创建时间         |
| `data.gmtModified`  | `String`   | 最后修改时间     |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/capacity?groupName=DEFAULT_GROUP&namespaceId=public'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "groupName": "DEFAULT_GROUP",
    "namespaceId": "public",
    "quota": 100,
    "usage": 50, 
    "maxSize": 1024, 
    "maxAggrCount": 10, 
    "maxAggrSize": 512, 
    "gmtCreate": "2023-10-01T12:00:00Z", 
    "gmtModified": "2023-10-01T12:00:00Z" 
  }
}
```

### 3.17 更新容量信息

#### 接口描述

更新指定分组或命名空间的容量信息。如果容量信息未初始化，则会自动初始化

#### 请求方式

`POST`

#### 请求URL

`/nacos/v3/admin/cs/capacity`

#### 请求参数


| 参数名         | 参数类型  | 是否必填 | 描述         |
| ---------------- | ----------- | ---------- | -------------- |
| `groupName`    | `String`  | **是**   | 分组名称     |
| `namespaceId`  | `String`  | **是**   | 命名空间ID   |
| `quota`        | `Integer` | **是**   | 配额         |
| `maxSize`      | `Integer` | **是**   | 最大大小     |
| `maxAggrCount` | `Integer` | **是**   | 最大聚合数量 |
| `maxAggrSize`  | `Integer` | **是**   | 最大聚合大小 |

#### 返回数据


| 参数名 | 参数类型  | 描述     |
| -------- | ----------- | ---------- |
| `data` | `Boolean` | 操作结果 |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/cs/capacity' \
-H 'Content-Type: application/json' \
-d '{
  "groupName": "DEFAULT_GROUP",
  "namespaceId": "public",
  "quota": 200,
  "maxSize": 2048,
  "maxAggrCount": 20,
  "maxAggrSize": 1024
}'
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

#### 请求URL

`/nacos/v3/admin/cs/ops/localCache`

#### 请求参数

无

#### 返回数据


| 参数名 | 参数类型 | 描述     |
| -------- | ---------- | ---------- |
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

#### 请求URL

`/nacos/v3/admin/cs/ops/log`

#### 请求参数


| 参数名     | 参数类型 | 是否必填 | 默认值 | 描述                          |
| ------------ | ---------- | ---------- | -------- | ------------------------------- |
| `logName`  | `String` | **是**   | 无     | 模块名称                      |
| `logLevel` | `String` | **是**   | 无     | 日志级别（如`INFO`、`DEBUG`） |

#### 返回数据


| 参数名 | 参数类型 | 描述     |
| -------- | ---------- | ---------- |
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

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/cs/ops/derby`

#### 请求参数


| 参数名 | 参数类型 | 是否必填 | 默认值 | 描述         |
| -------- | ---------- | ---------- | -------- | -------------- |
| `sql`  | `String` | **是**   | 无     | SQL 查询语句 |

#### 返回数据


| 参数名 | 参数类型                    | 描述     |
| -------- | ----------------------------- | ---------- |
| `data` | `List<Map<String, Object>>` | 查询结果 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/ops/derby?sql=SELECT * FROM config_info'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": 1,
      "data_id": "example",
      "group_id": "DEFAULT_GROUP",
      "content": "example content"
    }
  ]
}
```

### 3.21 导入Derby数据库数据

#### 接口描述

从外部数据源导入数据到Derby数据库

#### 请求方式

`POST`

#### 请求URL

`/nacos/v3/admin/cs/ops/derby/import`

#### 请求参数


| 参数名 | 参数类型        | 是否必填 | 默认值 | 描述                 |
| -------- | ----------------- | ---------- | -------- | ---------------------- |
| `file` | `MultipartFile` | **是**   | 无     | 导入文件（SQL 文件） |

#### 返回数据


| 参数名 | 参数类型 | 描述         |
| -------- | ---------- | -------------- |
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

#### 请求URL

`/nacos/v3/admin/cs/listener`

#### 请求参数


| 参数名        | 参数类型  | 是否必填 | 默认值   | 描述                 |
| --------------- | ----------- | ---------- | ---------- | ---------------------- |
| `ip`          | `String`  | **是**   | 无       | 客户端 IP 地址       |
| `all`         | `Boolean` | 否       | `false`  | 是否返回所有配置信息 |
| `namespaceId` | `String`  | 否       | `public` | 命名空间ID           |
| `sampleTime`  | `Integer` | 否       | `1`      | 采样时间（单位：秒） |

#### 返回数据


| 参数名 | 参数类型                  | 描述     |
| -------- | --------------------------- | ---------- |
| `data` | `GroupkeyListenserStatus` | 订阅信息 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/listener?ip=127.0.0.1&namespaceId=public&sampleTime=5'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "collectStatus": 200,
    "lisentersGroupkeyStatus": {
      "public@@DEFAULT_GROUP@@example": "md5_value"
    }
  }
}
```

### 3.23 获取集群客户端指标

#### 接口描述

获取集群中指定 IP 客户端的配置指标信息

#### 请求方式

`GET`

#### 请求URL

`/nacos/v3/admin/cs/metrics/cluster`

#### 请求参数


| **参数名**    | **参数类型** | **是否必填** | **默认值** | **描述**       |
| --------------- | -------------- | -------------- | ------------ | ---------------- |
| `ip`          | `String`     | **是**       | 无         | 客户端 IP 地址 |
| `dataId`      | `String`     | 否           | 无         | 配置ID         |
| `groupName`   | `String`     | 否           | 无         | 分组名称       |
| `namespaceId` | `String`     | 否           | `public`   | 命名空间ID     |

#### 返回数据


| 参数名                                         | 参数类型  | 描述说明       |
| ------------------------------------------------ | ----------- | ---------------- |
| `data`                                         |           | 服务信息       |
| `data.{namespaceId}.isFixedServer`             | `Boolean` | 是否固定服务器 |
| `data.{namespaceId}.snapshotDir`               | `String`  | 快照目录路径   |
| `data.{namespaceId}.clientVersion`             | `String`  | 客户端版本     |
| `data.{namespaceId}.serverUrls`                | `String`  | 服务器URL列表  |
| `data.{namespaceId}.listenConfigSize`          | `Integer` | 监听配置大小   |
| `data.{namespaceId}.metricValues.cacheData`    | `String`  | 缓存数据md5值  |
| `data.{namespaceId}.metricValues.snapshotData` | `String`  | 快照数据md5值  |

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
      "snapshotDir": "/Users/matthew/nacos/config",
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

#### 请求URL

`/nacos/v3/admin/cs/metrics/ip`

#### 请求参数


| **参数名**    | **参数类型** | **是否必填** | **默认值** | **描述**       |
| --------------- | -------------- | -------------- | ------------ | ---------------- |
| `ip`          | `String`     | **是**       | 无         | 客户端 IP 地址 |
| `dataId`      | `String`     | 否           | 无         | 配置ID         |
| `groupName`   | `String`     | 否           | 无         | 分组名称       |
| `namespaceId` | `String`     | 否           | `public`   | 命名空间       |

#### 返回数据


| **参数名** | **参数类型**          | **描述**       |
| ------------ | ----------------------- | ---------------- |
| `data`     | `Map<String, Object>` | 本地客户端指标 |

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
    "cacheData": "example content",
    "snapshotData": "example snapshot"
  }
}
```
