---
title: 运维API
keywords: [Nacos,运维API]
description: Nacos Server的一些运维API，一般给予控制台使用或需要进行自定义Nacos运维工具开发的相关程序和人员使用。
sidebar:
    order: 6
---

# 运维API

Nacos默认搭载了一整套专为管理控制台和运维人员设计的运维API，赋予运维专家更多的配置权限、更广阔的数据检索能力等。这些API为Nacos的运维团队提供了方便，使他们能够高效地处理故障、排查问题，以确保系统的稳定运行。

## 1. Nacos Core 运维 API

### 1.1. 获取当前节点连接

#### 接口描述

通过该接口，可以获取连接到当前Nacos Server节点中的gRPC连接详情。

#### 请求方式

`GET`

#### 请求URL

`/nacos/v2/core/loader/current`

#### 请求参数

无

#### 返回数据

| 参数名 | 参数类型 | 描述     |
|--------|----------|----------|
| ${connectionId} | `jsonString` | 每条gRPC连接的连接id |
| ${connectionId}.abilityTable | `jsonString` | 该gRPC连接（即客户端）支持的能力列表 |
| ${connectionId}.metaInfo.clientIp | `String` | 该gRPC连接的来源IP |
| ${connectionId}.metaInfo.localPort | `int` | 该Nacos Server的gRPC端口 |
| ${connectionId}.metaInfo.version | `String` | 该gRPC连接（即客户端）的版本 |
| ${connectionId}.metaInfo.createTime | `String` | 该gRPC连接的连接时间 |
| ${connectionId}.metaInfo.lastActiveTime | `timestamp` | 该gRPC连接的最后一次的心跳时间 |
| ${connectionId}.metaInfo.labels.source | `String` | 该gRPC连接的模块，可选值为`naming`,`config`和`cluster`分别代表注册中心、配置中心以及集群间的连接 |
| ${connectionId}.metaInfo.clusterSource | `boolean` | 该gRPC连接的是否为集群间连接，为`true`时，`${connectionId}.metaInfo.labels.source`为 `cluster` |
| ${connectionId}.metaInfo.sdkSource | `boolean` | 该gRPC连接的是否为客户端来源连接，为`true`时，`${connectionId}.metaInfo.labels.source`为 `naming`或`config`|


#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v2/core/loader/current'
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
      "version": "Nacos-Java-Client:v2.4.0",
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

`/nacos/v2/core/loader/reloadCurrent`

#### 请求参数

| 参数名        | 类型     | 必填   | 参数描述                     |
|---------------|----------|--------|--------------------------|
| `count` | `Integer` |  **是**     | 需要均衡的连接个数 |
| `redirectAddress`  | `String` | 否 | 预期均衡的Nacos Server目标，仅提供给客户端参考。 |

#### 返回数据

成功则返回`success`，失败则返回[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v2/core/loader/reloadCurrent?count=100'
```

* 返回示例

```text
success
```

### 1.3. 均衡指定的单个连接

#### 接口描述

通过该接口，可以指定某一条的连接到当前Nacos Server节点中的gRPC连接，将该连接断开后迁移到其他Nacos Server节点中。

#### 请求方式

`GET`

#### 请求URL

`/nacos/v2/core/loader/reloadClient`

#### 请求参数

| 参数名        | 类型     | 必填   | 参数描述                     |
|---------------|----------|--------|--------------------------|
| `connectionId` | `String` |  **是**     | 需要均衡的连接Id |
| `redirectAddress`  | `String` | 否 | 预期均衡的Nacos Server目标，仅提供给客户端参考。 |

#### 返回数据

成功则返回`success`，失败则返回[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v2/core/loader/reloadClient?connectionId=1709273546779_127.0.0.1_35042'
```

* 返回示例

```text
success
```

### 1.4. 获取集群连接概览信息

#### 接口描述

通过该接口，查看Nacos Server集群中各节点的连接数概览。

#### 请求方式

`GET`

#### 请求URL

`/nacos/v2/core/loader/cluster`

#### 请求参数

无

#### 返回数据

| 参数名        | 参数类型 | 描述     |
|--------|----------|----------|
| `total` | `Integer` | 该集群中所有节点的连接数总和 |
| `min` | `Integer` | 该集群中所有节点的最小连接数 |
| `avg` | `Integer` | 该集群中所有节点的平均连接数 |
| `max` | `Integer` | 该集群中所有节点的最大连接数 |
| `memberCount` | `Integer` | 该集群中所有节点的个数 |
| `metricsCount` | `Integer` | 该集群中已统计到概览信息的节点个数 |
| `detail` | `jsonArray` | 该集群中所有节点的概览信息，格式见下表 |
| `detail[].address` | `String` | 节点地址 |
| `detail[].metric.load` | `Double` | 节点的负载率，主要对应节点的Load指标，参考值 |
| `detail[].metric.sdkConCount` | `Integer` | 连接到该节点的SDK连接数，主要对应客户端连接数 |
| `detail[].metric.conCount` | `Integer` | 连接到该节点的总连接数，包含了SDK和集群间的连接 |
| `detail[].metric.cpu` | `Double` | 节点的CPU使用率，参考值 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v2/core/loader/cluster'
```

* 返回示例

```json
{
  "total": 0,
  "min": 0,
  "avg": 0,
  "max": 0,
  "memberCount": 3,
  "metricsCount": 3,
  "threshold": 0.0,
  "detail": [{
    "address": "nacos-node1:8848",
    "metric": {
      "load": "0.0",
      "sdkConCount": "0",
      "cpu": "0.0",
      "conCount": "2"
    }
  }, {
    "address": "nacos-node2:8848",
    "metric": {
      "load": "0.03",
      "sdkConCount": "0",
      "cpu": "-1.0",
      "conCount": "2"
    }
  }, {
    "address": "nacos-node3:8848",
    "metric": {
      "load": "0.0",
      "sdkConCount": "0",
      "cpu": "-1.0",
      "conCount": "2"
    }
  }],
  "completed": true
}
```

### 1.5. 获取本节点信息

#### 接口描述

通过该接口，可以获取Nacos Server集群当前节点的详细信息。

#### 请求方式

`GET`

#### 请求URL

`/nacos/v2/core/cluster/node/self`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名        | 参数类型 | 描述     |
|--------|----------|----------|
|`ip`|`String` | 节点IP |
|`port`|`Integer` | 节点端口 |
|`state`|`String` | 节点状态，可选值为`UP`、`DOWN`、`SUSPICIOUS` |
|`extendInfo`|`jsonObject` | 节点扩展信息，具体字段见下表 |
|`extendInfo.lastRefreshTime`|`Long` | 节点上一次更新时间戳，单位毫秒 |
|`extendInfo.raftMetaData`|`jsonObject` | 节点的Raft元数据， 包含每个Raft Group的 `leader`， `term`等字段 |
|`extendInfo.raftPort`|`Integer` | 节点的Raft端口 |
|`extendInfo.version`|`String` | 节点的版本 |
|`address`|`String` | 节点地址，格式为`ip:port` |
|`abilities`|`jsonObject` | 该节点所支持的能力 |
|~~extendInfo.readyToUpgrade~~|`Boolean` | 是否ready升级到Nacos2.0，于2.2版本后废弃，即将移除 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v2/core/cluster/node/self'
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
      "version": "2.4.0"
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

`/nacos/v2/core/cluster/node/list`

#### 请求参数

| 参数名        | 类型     | 必填   | 参数描述                     |
|---------------|----------|--------|--------------------------|
|`address`|`String`|否|过滤的节点地址，支持前缀匹配，不输入时返回所有节点信息|
|`nodeState`|`String`|否|返回的节点状态，可选值为`UP`、`DOWN`、`SUSPICIOUS`，不输入时返回所有节点信息|

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，`data`字段为[获取本节点信息](#返回数据-4)的返回数据的列表。

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v2/core/cluster/node/list'
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
      "version": "2.4.0"
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

`/nacos/v2/core/cluster/node/self/health`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)。

| 参数名        | 参数类型 | 描述     |
|--------|----------|----------|
|`data`|`String`|`UP`表示节点健康，`DOWN`表示节点不健康，`SUSPICIOUS`表示节点疑似不健康|

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v2/core/cluster/node/list'
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

`/nacos/v2/core/cluster/lookup`

#### 请求参数

| 参数名        | 类型     | 必填   | 参数描述                     |
|---------------|----------|--------|--------------------------|
|`type`|`String`|是|切换到的地址发现方式，可选值为`file`和`address-server`|

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)。

| 参数名        | 参数类型 | 描述     |
|--------|----------|----------|
|`data`|`Boolean`|`true`表示更新成功，`false`表示更新失败。|

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v2/core/cluster/lookup?type=file'
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

`/nacos/v2/core/ops/raft`

#### 请求参数

该API需要以Json的方式，将请求参数放在请求体中，请求体格式如下：

| 参数名        | 类型     | 必填   | 参数描述                     |
|---------------|----------|--------|--------------------------|
|`command` |`String`|**是**|Raft运维操作指令，具体的命令请参考下表。|
|`value`|`String`|**是**|命令的参数，具体的命令内容请参考下表。|
|`groupId` |`String`|否|Raft集群的groupId，如果不输入则对所有Raft Group生效|

|command|value|说明|
|---------------|----------|--------|
|`doSnapshot`|`${nacos-server-address}:${raft-port}`|执行快照，参数为要执行快照的节点地址。|
|`transferLeader`|`${nacos-server-address}:${raft-port}`|主动选主，参数为要期望的Leader的节点地址。|
|`restRaftCluster`|`${nacos-server-address}:${raft-port}[,${nacos-server-address}:${raft-port}]`|重置集群状态，参数为要重置节点地址列表，','分割。|
|`removePeer`|`${nacos-server-address}:${raft-port}`|移除Raft Member节点，参数为要移除的节点地址。|
|`removePeers`|`${nacos-server-address}:${raft-port}[,${nacos-server-address}:${raft-port}]`|批量移除Raft Member节点，参数为要批量移除的节点地址列表，','分割。|
|`changePeers`|`${nacos-server-address}:${raft-port}[,${nacos-server-address}:${raft-port}]`|修改Raft Member节点，参数为要修改后的节点地址列表，','分割。|

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)。

| 参数名        | 参数类型 | 描述     |
|--------|----------|----------|
|`data`|`String`|固定为`null`。|

#### 示例

* 请求示例

```shell
curl -X POST -H 'Content-Type:application/json' 'http://127.0.0.1:8848/nacos/v2/core/ops/raft' -d '{"command":"doSnapshot","value":"nacos-node-0:7848"}'
```

* 返回示例

```json
{
  "code": 200,
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

`/nacos/v2/core/ops/log`

#### 请求参数

该API需要以Json的方式，将请求参数放在请求体中，请求体格式如下：

| 参数名        | 类型     | 必填   | 参数描述                     |
|---------------|----------|--------|--------------------------|
|`logName` |`String`|**是**|具体的日志文件的名称，具体支持的日志名称见下表。|
|`logLevel`|`String`|**是**|日志的级别，可选值为`ALL`、`TRACE`、`DEBUG`、`INFO`、`WARN`、`ERROR`、`OFF`。|

|logName|对应的具体日志文件|
|---------------|----------|
|`core-auth`|`core-auth.log`|
|`core-raft`|`protocol-raft.log`|
|`core-distro`|`protocol-distro.log`|
|`core-cluster`|`nacos-cluster.log`|

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)。

| 参数名        | 参数类型 | 描述     |
|--------|----------|----------|
|`data`|`String`|固定为`null`。|

#### 示例

* 请求示例

```shell
curl -X PUT -H 'Content-Type:application/json' 'http://127.0.0.1:8848/nacos/v2/core/ops/log' -d '{"logName":"core-distro","logLevel":"DEBUG"}'
```

* 返回示例

```json
{
  "code": 200,
  "message": null,
  "data": null
}
```

## 2. Nacos Naming 运维 API

### 2.1. 查看Naming模块的相关开关

#### 接口描述

通过该接口，可以查看Nacos Naming模块的相关开关。

#### 请求方式

`GET`

#### 请求URL

`/nacos/v2/ns/operator/switches` 或 `/nacos/v2/ns/ops/switches`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，返回数据`data`字段为json格式，展示各个开关的和配置的具体内容：

| 参数名        | 参数类型 | 描述     |
|--------|----------|----------|
|`clientBeatInterval`|`int`|Nacos1.X客户端的默认心跳间隔|
|`defaultCacheMillis`|`int`|客户端订阅的服务列表的默认缓存时间|
|`defaultPushCacheMillis`|`int`|推送的服务列表的默认缓存时间，优先级高于`defaultCacheMillis`|
|`distroEnabled` |`boolean`|是否开启`Distro`协议同步，仅当集群压力过大，影响到集群稳定性时，临时修改为`false`缓解，改为`false`后可能导致部分数据不一致，需要尽快恢复|
|`healthCheckEnabled`|`boolean`|是否开启健康检查，仅当集群压力过大，影响到集群稳定性时，临时修改为`false`缓解，改为`false`后不会因为心跳过期，tcp/http探测超时而修改实例的健康状态，以及不会因过期删除实例，需要尽快恢复|
|`lightBeatEnabled` |`boolean`|是否开启轻量心跳，针对Nacos`1.2.X~1.4.X版本`客户端生效，修改为`false`后，`Nacos1.2.X~1.4.X`版本客户端将使用全量心跳进行续约|
|`pushEnabled`|`boolean`|是否开启推送功能，仅当集群压力过大，影响到集群稳定性时，临时修改为`false`，改为`false`后，Nacos客户端将不再收到服务端的主动推送|
|`push${Language}Version`|`String`|可支持推送的最小客户端版本，当不希望针对小于某些版本进行数据推送时，可以修改该值，比如修改pushJavaVersion为`2.0.0`，则小于2.0.0的Java客户端将不会收到推送数据|
|`${type}HealthParams`|`json`|健康检查参数，设置健康检查的最大/最小间隔，随机间隔系数等，健康检查时将根据这几个值进行下一次健康检查流量的打散。|

> 注意： 其余未列出的参数，均为Nacos旧版本的开关或配置内容，已废弃或即将废弃，请谨慎使用。

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v2/ns/ops/switches' 
```

* 返回示例


```json
{
    "code": 0,
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
    "message": "success"
}
```

### 2.2. 修改Naming模块的相关开关

#### 接口描述

通过该接口，可以修改Nacos Naming模块的相关开关。

#### 请求方式

`PUT`

#### 请求URL

`/nacos/v2/ns/operator/switches` 或 `/nacos/v2/ns/ops/switches`

#### 请求参数

| 参数名        | 类型     | 必填   | 参数描述                     |
|--------|----------|----|----------|
|`entry`|`String`|**是**|修改的开关或配置名称|
|`value`|`Object`|**是**|开关或配置的新值，不同的开关或配置的类型不同，具体请参考[开关和配置参数](#返回数据-10)|
|`debug`|`boolean`|否|是否开启调试模式，开启后，修改的配置不会同步到集群其他节点中，仅在本节点生效，默认为`false`|

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式):

| 参数名        | 参数类型 | 描述     |
|--------|----------|----------|
|`data`|`String`|成功为`ok`,否则为`null`|

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v2/ns/ops/switches?entry=pushEnabled&value=false'
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

通过该接口，可以查询系统当前数据指标

#### 请求方式

`GET`

#### 请求URL

`/nacos/v2/ns/operator/metrics` 或 `/nacos/v2/ns/ops/metrics`

#### 请求参数

| 参数名       | 参数类型  | 是否必填 | 描述说明                 |
|--------------|-----------|----------|--------------------------|
| `onlyStatus` | `boolean` | 否       | 只显示状态，默认为`true` |

> 当`onlyStatus`设置为`true`时，只返回表示系统状态的字符串

#### 返回数据

| 参数名                             | 参数类型 | 描述说明           |
|------------------------------------|----------|--------------------|
| `data`                             | `Object` | 系统当前数据指标   |
| `data.status`                      | `String` | 系统状态           |
| `data.serviceCount`                | `int`    | 服务数量           |
| `data.instanceCount`               | `int`    | 实例数量           |
| `data.subscribeCount`              | `int`    | 订阅数量           |
| `data.raftNotifyTaskCount`         | `int`    | `Raft`通知任务数量 |
| `data.responsibleServiceCount`     | `int`    |                    |
| `data.responsibleInstanceCount`    | `int`    |                    |
| `data.clientCount`                 | `int`    | 客户端数量         |
| `data.connectionBasedClientCount`  | `int`    | 连接数量           |
| `data.ephemeralIpPortClientCount`  | `int`    | 临时客户端数量     |
| `data.persistentIpPortClientCount` | `int`    | 持久客户端数量     |
| `data.responsibleClientCount`      | `int`    |                    |
| `data.cpu`                         | `float`  | `cpu`使用率        |
| `data.load`                        | `float`  | 负载               |
| `data.mem`                         | `float`  | 内存使用率         |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v2/ns/operator/metrics'
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

## 3. Nacos Config 运维 API

### 3.1. 查询指定命名空间下的配置列表

#### 接口描述

获取指定命名空间下的配置信息列表

#### 请求方式

`GET`

#### 请求URL

`/nacos/v2/cs/history/configs`

#### 请求参数

| 参数名        | 类型     | 必填   | 参数描述 |
|---------------|----------|--------|----------|
| `namespaceId` | `String` | **是** | 命名空间 |

#### 返回数据

| 参数名                  | 参数类型   | 描述说明             |
|-------------------------|------------|----------------------|
| `data`                  | `Object[]` | 配置信息列表         |
| `data.id`               | `String`   | 配置`id`             |
| `data.dataId`           | `String`   | 配置名               |
| `data.group`            | `String`   | 配置分组             |
| `data.content`          | `String`   | 配置内容             |
| `data.md5`              | `String`   | 配置内容的md5值      |
| `data.encryptedDataKey` | `String`   |                      |
| `data.tenant`           | `String`   | 租户信息（命名空间） |
| `data.appName`          | `String`   | 应用名               |
| `data.type`             | `String`   | 配置文件类型         |
| `data.lastModified`     | `long`     | 上次修改时间         |

> 返回数据中的配置信息只有`dataId`, `group`, `tenant`, `appName`, `type`字段有效，其他字段为默认值

#### 示例

* 请求示例

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/cs/history/configs?namespaceId='
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