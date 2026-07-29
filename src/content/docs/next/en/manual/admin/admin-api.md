---
title: Admin API
keywords: [ Nacos,Admin PI ]
description: The following are some operations APIs for Nacos Server, intended for use with the console or for programs and personnel developing custom Nacos operations tools.
sidebar:
  order: 10
---

# Admin API

> Standard Nacos 3.x Admin APIs use the `/v3/admin/*` path. The current version has removed v1/v2 Admin APIs. Use Nacos 3.x Admin APIs instead.
>
> If you still need v1/v2 Admin APIs temporarily during migration, read [Compatibility and Deprecation](./compatibility-and-deprecation.md) first, and evaluate the legacy adapter approach described in the upgrading manual.

Nacos provides Admin APIs for administrators, operations platforms, release platforms, audit tools, and automation scripts. These APIs expose broader management capabilities than runtime client APIs, including range queries, resource management, server state inspection, and operational diagnostics.

## 0. Admin API Notes

### 0.1. Scope

Admin APIs are intended for management-plane callers. They are suitable for operations platforms, release platforms, audit tools, automation scripts, and administrators.

| Good Fit | Not a Good Fit |
| --- | --- |
| Publishing, deleting, importing, exporting, and querying configurations. | High-frequency runtime configuration reads from business applications. |
| Managing namespaces, services, instances, clusters, health state, and metadata. | Business applications registering their own instances or subscribing to downstream services. |
| Managing plugins, server state, AI resources, and operational diagnostics. | Page-level interactions for custom console UI. |

Business applications should prefer [Java SDK](../user/java-sdk/usage.md), other language SDKs, or [Client API](../user/open-api.md). Custom console UI should prefer [Console API](./console-api.md).

### 0.2. Unified Path Format

Nacos Admin APIs use a unified path format: `[/$nacos.server.contextPath]/v3/admin/[module]/[subPath]...`.

- `$nacos.server.contextPath`: Root path of Admin APIs. The default value is `/nacos`, and it can be changed with the `nacos.server.contextPath` configuration item.
- `module`: Admin API module name, such as `server`, `cs`, `ns`, or `core`.
- `subPath`: Admin API subpath, such as `state`, `namespace`, or `config`. It may contain multiple path levels.

The Admin APIs listed below use the default `$nacos.server.contextPath`. If the deployment changes `$nacos.server.contextPath`, update the request URL accordingly when calling the API.

The examples below also use the default Nacos Web Server port. If the deployment changes `$nacos.server.main.port`, update the request URL accordingly when calling the API.

### 0.3. Authentication

Nacos 3.X Admin APIs require authentication by default. When using the default auth plugin, use an administrator identity such as `nacos`.

To disable Admin API authentication, set `nacos.core.auth.admin.enabled=false` and restart Nacos Server.

### 0.4. Swagger Documentation

Nacos 3.X Admin APIs also provide Swagger-style documentation. You can view it at [Nacos Swagger Admin API](/swagger/admin/).

## 1. Nacos Core Admin APIs

### 1.1. Get Current Node Connections

#### Description

Use this API to get details about gRPC connections to the current Nacos Server node.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/core/loader/current`

#### Request Parameters

None

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                                     | Type         | Description                                                                                      |
|-----------------------------------------|--------------|-----------------------------------------------------------------------------------------|
| ${connectionId}                         | `object` | Each gRPC connection ID. |
| ${connectionId}.abilityTable            | `object` | Capability list supported by the gRPC connection, namely the client. |
| ${connectionId}.metaInfo.clientIp       | `string` | Source IP of the gRPC connection. |
| ${connectionId}.metaInfo.localPort      | `integer` | gRPC port of this Nacos Server. |
| ${connectionId}.metaInfo.version        | `string` | Version of the gRPC connection, namely the client. |
| ${connectionId}.metaInfo.createTime     | `string` | Creation time of the gRPC connection. |
| ${connectionId}.metaInfo.lastActiveTime | `integer`  | Last heartbeat time of the gRPC connection. |
| ${connectionId}.metaInfo.labels.source  | `string` | Module of the gRPC connection. Optional values are `naming`, `config`, and `cluster`, representing registry, configuration, and inter-cluster connections respectively. |
| ${connectionId}.metaInfo.clusterSource  | `boolean` | Whether the gRPC connection is an inter-cluster connection. When `true`, `${connectionId}.metaInfo.labels.source` is `cluster`. |
| ${connectionId}.metaInfo.sdkSource      | `boolean` | Whether the gRPC connection comes from a client. When `true`, `${connectionId}.metaInfo.labels.source` is `naming` or `config`. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/loader/current'
```

* Response example

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

### 1.2. Rebalance a Specified Number of Connections

#### Description

Use this API to select a specified number of gRPC connections on the current Nacos Server node, disconnect them, and migrate them to other Nacos Server nodes.

#### Since

`3.0.0`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/core/loader/reloadCurrent`

#### Request Parameters

| Name               | Type        | Required    | Description                           |
|-------------------|-----------|-------|--------------------------------|
| `count`           | `integer` | **Yes** | Number of connections to rebalance. |
| `redirectAddress` | `string` | No     | Expected target Nacos Server for rebalancing. This is provided only as a client reference. |

#### Response Data

Returns `success` if the operation succeeds. If it fails, the response follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format).

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/core/loader/reloadCurrent' -d "count=100"
```

* Response example

```text
success
```

### 1.3. Rebalance a Specified Connection

#### Description

Use this API to migrate a specified client connection (gRPC connection) to another Nacos Server node.

#### Since

`3.0.0`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/core/loader/reloadClient`

#### Request Parameters

| Name               | Type       | Required    | Description                 |
|-------------------|----------|-------|----------------------|
| `connectionId`    | `string` | **Yes** | ID of the connection to rebalance. |
| `redirectAddress` | `string` | No     | Expected target Nacos Server for rebalancing. |

#### Response Data

Returns `success` if the operation succeeds. If it fails, the response follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format).

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/core/loader/reloadClient' -d "connectionId=1709273546779_127.0.0.1_35042"
```

* Response example

On success, returns:

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

On failure, returns:

```json
{
  "code": 30000,
  "message": "server error",
  "data": null
}
```

### 1.4. Get Cluster Connection Overview

#### Description

Use this API to view the connection count overview of each node in the Nacos Server cluster.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/core/loader/cluster`

#### Request Parameters

None

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                           | Type        | Description                        |
|-------------------------------|-------------|---------------------------|
| `total`                       | `integer` | Total number of connections on all nodes in the cluster. |
| `min`                         | `integer` | Minimum connection count among all nodes in the cluster. |
| `avg`                         | `integer` | Average connection count across all nodes in the cluster. |
| `max`                         | `integer` | Maximum connection count among all nodes in the cluster. |
| `memberCount`                 | `integer` | Number of nodes in the cluster. |
| `metricsCount`                | `integer` | Number of nodes whose overview metrics have been collected. |
| `detail`                      | `array` | Overview information of all nodes in the cluster. See the following fields. |
| `detail[].address`            | `string` | Node address. |
| `detail[].metric.load`        | `number` | Node load rate, mainly corresponding to the node load metric. This is a reference value. |
| `detail[].metric.sdkConCount` | `integer` | Number of SDK connections to this node, mainly corresponding to client connections. |
| `detail[].metric.conCount`    | `integer` | Total number of connections to this node, including SDK and inter-cluster connections. |
| `detail[].metric.cpu`         | `number` | Node CPU usage. This is a reference value. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/loader/cluster'
```

* Response example

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

### 1.5. Get Current Node Information

#### Description

Use this API to get detailed information about the current node in the Nacos Server cluster.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Request URL

`/nacos/v3/admin/core/cluster/node/self`

#### Request Parameters

None

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                           | Type         | Description                                             |
|-------------------------------|--------------|------------------------------------------------|
| `ip`                          | `string` | Node IP address. |
| `port`                        | `integer` | Node port. |
| `state`                       | `string` | Node state: UP/DOWN/SUSPICIOUS |
| `extendInfo`                  | `object` | Extended node information. See the following fields. |
| `extendInfo.lastRefreshTime`  | `integer` | Last update timestamp of the node, in milliseconds. |
| `extendInfo.raftMetaData`     | `object` | Raft metadata of the node, including fields such as `leader` and `term` for each Raft Group. |
| `extendInfo.raftPort`         | `integer` | Raft port of the node. |
| `extendInfo.supportGrayModel` | `boolean` | Whether the gray model is supported. |
| `extendInfo.version`          | `string` | Node version. |
| `address`                     | `string` | Node address in the `ip:port` format. |
| `failAccessCnt`               | `integer` | Number of probe failures and report failures. When the count exceeds a threshold, `state` changes to `DOWN`. |
| `abilities`                   | `object` | Capabilities supported by the node. |
| `grpcReportEnabled`           | `boolean` | Indicates whether the node supports reporting heartbeats through gRPC. This is used for compatibility during upgrades from earlier versions and will be removed later. |
| ~~extendInfo.readyToUpgrade~~ | `boolean` | Whether the node is ready to upgrade to Nacos 2.0. Deprecated since 2.2 and will be removed. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/cluster/node/self'
```

* Response example

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

### 1.6. Get All Cluster Node Information

#### Description

Use this API to get detailed information about all nodes in the Nacos Server cluster.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/core/cluster/node/list`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `address` | `string` | No | Node address. Filtering by address is supported. |
| `state` | `string` | No | Node state: UP/DOWN/SUSPICIOUS |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The `data` field is a list of the response data returned by [Get Current Node Information](#response-data-4).

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/cluster/node/list'
```

* Response example

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

### 1.7. Dynamically Change the Server Cluster Address Discovery Mode

#### Description

Use this API to dynamically switch the Nacos Server cluster address discovery mode without restarting Nacos Server. Currently supported modes include `file` and `address-server`.

#### Since

`3.0.0`

#### Request Method

`PUT`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/core/cluster/lookup`

#### Request Parameters

| Name    | Type       | Required | Description                                  |
|--------|----------|----|---------------------------------------|
| `type` | `string` | Yes | address-server/file/standalone |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format).

| Name    | Type      | Description                          |
|--------|-----------|-----------------------------|
| `data` | `boolean` | `true` indicates that the update succeeds, and `false` indicates that the update fails. |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/core/cluster/lookup' -d "type=file"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 1.8. Raft Operations

#### Description

Use this API to perform maintenance operations on the Raft protocol in the Nacos Server cluster, such as taking snapshots and transferring leadership.

#### Since

`3.0.0`

#### Request Method

`POST`

The request body type is `application/json`, and parameters are placed in the request body.

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/core/ops/raft`

#### Request Parameters

| Name       | Type       | Required    | Description                                 |
|-----------|----------|-------|--------------------------------------|
| `command` | `string` | **Yes** | Raft maintenance command. See the table below for supported commands. |
| `value` | `string` | **Yes** | Command parameter. See the table below for the command content. |
| `groupId` | `string` | No | Raft cluster `groupId`. If not specified, the command applies to all Raft Groups. |

Command descriptions (Swagger does not yet support this sub-parameter structure, so it is retained in the document):

- `doSnapshot`: `${nacos-server-address}:${raft-port}`
- `transferLeader`: `${nacos-server-address}:${raft-port}`
- `restRaftCluster`: `${nacos-server-address}:${raft-port}[,${nacos-server-address}:${raft-port}]`
- `removePeer`: `${nacos-server-address}:${raft-port}`
- `removePeers`: `${nacos-server-address}:${raft-port}[,${nacos-server-address}:${raft-port}]`
- `changePeers`: `${nacos-server-address}:${raft-port}[,${nacos-server-address}:${raft-port}]`

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format).

| Name    | Type     | Description         |
|--------|----------|------------|
| `data` | `string` | Fixed value: `null`. |

#### Examples

* Request example

```shell
curl -X POST -H 'Content-Type:application/json' 'http://127.0.0.1:8848/nacos/v3/admin/core/ops/raft' -d '{"command":"doSnapshot","value":"nacos-node-0:7848"}'
```

* Response example

```json
{
  "code": 0,
  "message": null,
  "data": null
}
```

### 1.9. Dynamically Change Nacos Core Log Levels

#### Description

Use this API to dynamically change Nacos Core log level configuration without restarting Nacos Server.

#### Since

`3.0.0`

#### Request Method

`PUT`

The request body type is `application/json`, and parameters are placed in the request body.

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/core/ops/log`

#### Request Parameters

| Name        | Type       | Required    | Description                                                         |
|------------|----------|-------|--------------------------------------------------------------|
| `logName` | `string` | **Yes** | Name of the specific log file. See the table below for supported log names. |
| `logLevel` | `string` | **Yes** | Log level. Optional values: `ALL`, `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`, and `OFF`. |

| logName        | Corresponding log file |
|----------------|-----------------------|
| `core-auth`    | `core-auth.log`       |
| `core-raft`    | `protocol-raft.log`   |
| `core-distro`  | `protocol-distro.log` |
| `core-cluster` | `nacos-cluster.log`   |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format).

| Name    | Type     | Description         |
|--------|----------|------------|
| `data` | `string` | Fixed value: `null`. |

#### Examples

* Request example

```shell
curl -X PUT -H 'Content-Type:application/json' 'http://127.0.0.1:8848/nacos/v3/admin/core/ops/log' -d '{"logName":"core-distro","logLevel":"DEBUG"}'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 1.10. Automatically Rebalance a Specified Number of Connections

#### Description

Use this API to automatically rebalance client connections across the cluster based on the load factor (`loaderFactor`).

Automatic rebalancing logic:

1. Calculate the average connection count `avg`, the lower node connection threshold `lowLimitCount` (= avg * (1 - loaderFactor)), and the upper node connection threshold `overLimitCount` (= avg * (1 + loaderFactor)) based on the total number of client connections and the number of Nacos Server nodes in the cluster.
2. Redirect some client connections from high-load nodes to low-load nodes.

#### Since

`3.0.0`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/core/loader/smartReloadCluster`

#### Request Parameters

| Name                | Type       | Required    | Description           |
|--------------------|----------|-------|----------------|
| `loaderFactor` | `number` | No | - |

#### Response Data

On success, returns:

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

On failure, returns:

```json
{
  "code": 30000,
  "message": "server error",
  "data": null
}
```

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/core/loader/smartReloadCluster' -d "loaderFactor=0.1"
```

* Response example

```text
success
```

### 1.11. Get ID Generator Information

#### Description

Use this API to get the current ID and worker ID of the ID generator. This API returns valid data only when the embedded database is used.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/core/ops/ids`

#### Request Parameters

None

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format).

| Name              | Type     | Description       |
|------------------|----------|----------|
| `resource`       | `string` | Generator name. |
| `info`           | `object` | Generator details. |
| `info.currentId` | `integer` | Current ID. |
| `info.workerId`  | `integer` | workerID |

On success, returns:

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

On failure, returns:

```json
{
  "code": 30000,
  "message": "server error",
  "data": null
}
```

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/ops/ids'
```

* Response example

```text
success
```

### 1.12. Update Cluster Node Information

#### Description

Use this API to update detailed information in the Nacos node list of the current node. **Note:** This API overwrites the detailed information in the list on the current node. It only updates nodes that are both passed in and already exist in the cluster, and it `cannot` add or remove nodes from the cluster. In addition, the Nacos health probe `report` task also checks node health and updates node details in the list on the current node. If the probe task detects node information changes after this API is called, the task also overwrites the node information in the list on the current node.

#### Since

`3.0.0`

#### Request Method

`PUT`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/core/cluster/node/list`

#### Request Parameters

The request body is a JSON array. Each array element is node information (Member), including fields such as `ip`, `port`, `state`, and `extendInfo`.

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name | Type | Description |
|--------|----------|------|
| data | `boolean` | Whether the update succeeds. |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/core/cluster/node/list' \
  -H 'Content-Type: application/json' \
  -d '[{"ip":"127.0.0.1","port":8848,"state":"UP","address":"127.0.0.1:8848"}]'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 1.13. Get Namespace Details

#### Description

Use this API to get details of a specified namespace.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/core/namespace`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | **Yes** | Namespace ID. |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name | Type | Description |
|--------|----------|------|
| namespace | `string` | Namespace ID. |
| namespaceShowName | `string` | Namespace display name. |
| namespaceDesc | `string` | Namespace description. |
| quota | `integer` | Config quantity quota. |
| configCount | `integer` | Current config count. |
| type | `integer` | Type |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/namespace?namespaceId=public'
```

* Response example

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

### 1.14. Update Namespace

#### Description

Use this API to update namespace information. The namespace ID cannot be updated; only the namespace name and description can be updated.

#### Since

`3.0.0`

#### Request Method

`PUT`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/core/namespace`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | **Yes** | Namespace ID. |
| `namespaceName` | `string` | **Yes** | Namespace display name. |
| `namespaceDesc` | `string` | No | Namespace description. |

#### Response Data

On success, a unified response body is returned and `data` is `true`. On failure, the response follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format).

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/core/namespace' \
  -d 'namespaceId=test' -d 'namespaceName=test' -d 'namespaceDesc=test'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 1.15. Create Namespace

#### Description

Use this API to create a namespace.

#### Since

`3.0.0`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/core/namespace`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID. If not specified, the server generates one. |
| `namespaceName` | `string` | **Yes** | Namespace display name. |
| `namespaceDesc` | `string` | No | Namespace description. |

#### Response Data

On success, a unified response body is returned and `data` is `true`. On failure, the response follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format).

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/core/namespace' \
  -d 'namespaceName=test' -d 'namespaceDesc=test'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 1.16. Delete Namespace

#### Description

Use this API to delete a namespace. The default namespace `public` cannot be deleted.

#### Since

`3.0.0`

#### Request Method

`DELETE`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/core/namespace`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | **Yes** | Namespace ID. |

#### Response Data

On success, a unified response body is returned and `data` is `true`. On failure, the response follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format).

#### Examples

* Request example

```shell
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/core/namespace?namespaceId=test'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 1.17. Check Whether a Namespace Exists

#### Description

Use this API to check whether a namespace ID exists. Call this API before creating a namespace to confirm whether a custom namespace ID already exists and avoid conflicts.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/core/namespace/check`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | **Yes** | - |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). `data` is `true` if the namespace exists and `false` if it does not.

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/namespace/check?namespaceId=public'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": false
}
```

### 1.18. Get Nacos Namespace List

#### Description

Use this API to get the namespace list of the current Nacos cluster.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/core/namespace/list`

#### Request Parameters

None

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field. `data` is an array of namespace objects. Each item contains fields such as `namespace`, `namespaceShowName`, `namespaceDesc`, `quota`, `configCount`, and `type`.

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/namespace/list'
```

* Response example

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

### 1.19. Get Nacos Cluster Status Information

#### Description

Use this API to get basic status and switch information of the Nacos cluster, such as the version, running mode, and whether authentication is enabled. This API does not return node information of the Nacos cluster.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Public API. No identity information is required.

#### Request URL

`/nacos/v3/admin/core/state`

#### Request Parameters

None

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). `data` is a key-value map containing cluster status and configuration items such as version (`version`), running mode (`startup_mode`), and authentication switch (`auth_enabled`).

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/state'
```

* Response example

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

### 1.20. Get Nacos Cluster Liveness Status

#### Description

Use this API to get the liveness status of the Nacos cluster, indicating whether the Nacos cluster can normally accept and respond to requests.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Public API. No identity information is required.

#### Request URL

`/nacos/v3/admin/core/state/liveness`

#### Request Parameters

None

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name | Type | Description |
|--------|----------|------|
| data | `string` | Liveness status, such as "ok". |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/state/liveness'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 1.21. Get Nacos Cluster Readiness Status

#### Description

Use this API to get whether the Nacos cluster is in a readable state, indicating whether the Nacos cluster can read data.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Public API. No identity information is required.

#### Request URL

`/nacos/v3/admin/core/state/readiness`

#### Request Parameters

None

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name | Type | Description |
|--------|----------|------|
| data | `string` | Readiness status, such as "ok". |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/state/readiness'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 1.22. Update Plugin Configuration

#### Description

Replace the complete configuration map for the target source. `localOnly=false` writes the persisted runtime source; `localOnly=true` writes the higher-priority local source for this node only. An empty map clears the target source. Only definition items with `effectMode=RUNTIME` can be changed; adding, changing, or removing a `RESTART` item is rejected.

#### Since

`3.2.0`

#### Request Method

`PUT`

The request body type is `application/json`.

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/core/plugin/config`

#### Request Parameters

The request body is JSON and contains the following fields:

| Name         | Type       | Required | Description           |
|-------------|----------|----|----------------|
| `pluginType` | `string` | **Yes** | Plugin type, such as auth. |
| `pluginName` | `string` | **Yes** | Plugin name. |
| `config` | `object` | **Yes** | Complete configuration map keyed by definition item key. |
| `localOnly` | `boolean` | No | `true` writes `LOCAL_ONLY`; otherwise writes cluster-persisted `RUNTIME_PERSISTED`. |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). `data` is a string indicating the operation result.

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/core/plugin/config' \
  -H 'Content-Type: application/json' \
  -d '{"pluginType":"auth","pluginName":"ldap","config":{"connect-timeout":"6000"},"localOnly":false}'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "Plugin configuration updated successfully"
}
```

### 1.23. Get Plugin Details

#### Description

Use this API to get details of a specified plugin by type and name.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/core/plugin/detail`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `pluginType` | `string` | **Yes** | Plugin type, such as auth. |
| `pluginName` | `string` | **Yes** | Plugin name. |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name | Type | Description |
|--------|----------|------|
| pluginId | `string` | Plugin ID. |
| pluginType | `string` | Plugin type. |
| pluginName | `string` | Plugin name. |
| enabled | `boolean` | Whether the plugin is enabled. |
| critical | `boolean` | Whether the plugin is critical. |
| typeCritical | `boolean` | Whether the plugin type is declared critical. |
| executionMode | `string` | `EXCLUSIVE`, `CHAIN`, `ROUTED`, or `BROADCAST`. |
| exclusive | `boolean` | Whether the type uses exclusive selection. |
| configurable | `boolean` | Whether the plugin is configurable. |
| config | `object` | Effective item map with sensitive values masked. |
| configDefinitions | `array` | Definitions including key, aliases, type, defaultValue, required, sensitive, and effectMode. |
| configValueMetas | `object` | Effective source and `overridden` metadata for each item. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/plugin/detail?pluginType=auth&pluginName=nacos'
```

* Response example

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

### 1.24. Get Plugin List

#### Description

Use this API to get all plugins. Filtering by plugin type is supported.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/core/plugin/list`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `pluginType` | `string` | No | Plugin type. If not specified, all plugins are returned. |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). `data` is an array of plugin objects.

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/core/plugin/list?pluginType=auth'
```

* Response example

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

### 1.25. Enable or Disable a Plugin

#### Description

Update implementation state. `localOnly=false` persists to `${nacos.home}/data/plugin/plugin-states.json` for cluster operations; `localOnly=true` affects only this node and has higher priority. Exclusive selection, PRE_CONTEXT state, and active critical providers cannot be changed illegally at runtime.

#### Since

`3.2.0`

#### Request Method

`PUT`

The request body type is `application/json`.

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/core/plugin/status`

#### Request Parameters

The request body is JSON and contains the following fields:

| Name         | Type        | Required | Description       |
|-------------|-----------|----|------------|
| `pluginType` | `string` | **Yes** | Plugin type. |
| `pluginName` | `string` | **Yes** | Plugin name. |
| `enabled` | `boolean` | **Yes** | Whether to enable the plugin. |
| `localOnly` | `boolean` | No | Whether to write only locally. |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). `data` is a string indicating the operation result.

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/core/plugin/status' \
  -H 'Content-Type: application/json' \
  -d '{"pluginType":"trace","pluginName":"ai-resource-trace-log","enabled":false,"localOnly":false}'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "Plugin status updated successfully"
}
```

## 2. Nacos Naming Admin APIs

### 2.1. View Naming Module Switches

#### Description

Use this API to view switches related to the Nacos Naming module.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ns/ops/switches`

#### Request Parameters

None

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                      | Type      | Description                                                                                                      |
|--------------------------|-----------|---------------------------------------------------------------------------------------------------------|
| `clientBeatInterval`     | `integer` | Default heartbeat interval of Nacos 1.x clients                                                                                      |
| `defaultCacheMillis`     | `integer` | Default cache time of service lists subscribed by clients                                                                                       |
| `pushCacheMillis`        | `integer` | Default cache time of pushed service lists. This has higher priority than `defaultCacheMillis`.                                                                |
| `distroEnabled`          | `boolean` | Whether `Distro` protocol synchronization is enabled. Temporarily set this to `false` only when excessive cluster pressure affects cluster stability. Setting it to `false` may cause some data inconsistency, so restore it as soon as possible.                         |
| `healthCheckEnabled`     | `boolean` | Whether health checks are enabled. Temporarily set this to `false` only when excessive cluster pressure affects cluster stability. After it is set to `false`, instance health status is not changed because of heartbeat expiration or TCP/HTTP probe timeout, and instances are not deleted because of expiration. Restore it as soon as possible. |
| `lightBeatEnabled`       | `boolean` | Whether lightweight heartbeat is enabled. This applies to Nacos `1.2.X~1.4.X` clients. After it is set to `false`, Nacos `1.2.X~1.4.X` clients use full heartbeat for renewal.                     |
| `pushEnabled`            | `boolean` | Whether push is enabled. Temporarily set this to `false` only when excessive cluster pressure affects cluster stability. After it is set to `false`, Nacos clients no longer receive active server pushes.                               |
| `push${Language}Version` | `string` | Minimum client version that supports push. Change this value if you do not want to push data to clients earlier than a specific version. For example, if `pushJavaVersion` is set to `2.0.0`, Java clients earlier than 2.0.0 do not receive pushed data.          |
| `${type}HealthParams`    | `object`    | Health check parameters, including the maximum and minimum check intervals and random interval factor. These values are used to spread the next round of health check traffic. |

> Note: Other parameters that are not listed are switches or configuration items from earlier Nacos versions. They are deprecated or will be deprecated soon. Use them with caution.

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/ops/switches'
```

* Response example

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

### 2.2. Modify Naming Module Switches

#### Description

Use this API to modify switches related to the Nacos Naming module.

#### Since

`3.0.0`

#### Request Method

`PUT`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ns/ops/switches`

#### Request Parameters

| Name     | Type        | Required    | Description                                              |
|---------|-----------|-------|---------------------------------------------------|
| `entry` | `string` | **Yes** | Name of the switch or configuration to modify |
| `value` | `string` | **Yes** | New value of the switch or configuration. Different switches or configurations have different types. See [Switch and Configuration Parameters](#response-data-10). |
| `debug` | `boolean` | No | Whether debug mode is enabled. When enabled, the modified configuration is not synchronized to other cluster nodes and takes effect only on the current node. Defaults to `false`. |

#### Response Data

| Name    | Type     | Description      |
|--------|----------|---------|
| `data` | `string` | Returns `ok` on success. |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ns/ops/switches' -d "entry=pushEnabled&value=false"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.3. Query Current System Metrics

#### Description

Use this API to query current system metrics.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ns/ops/metrics`

#### Request Parameters

| Name          | Type      | Required | Default    | Description  |
|--------------|-----------|------|--------|-------|
| `onlyStatus` | `boolean` | No    | `true` | Show only status. |

> When `onlyStatus` is set to `true`, only the string that indicates the system status is returned.

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                           | Type     | Description    |
|-------------------------------|----------|---------|
| `status`                      | `string` | System status    |
| `serviceCount`                | `integer` | Number of services    |
| `instanceCount`               | `integer` | Number of instances    |
| `subscribeCount`              | `integer` | Number of subscriptions    |
| `clientCount`                 | `integer` | Number of clients   |
| `connectionBasedClientCount`  | `integer` | Number of connections    |
| `ephemeralIpPortClientCount`  | `integer` | Number of ephemeral clients |
| `persistentIpPortClientCount` | `integer` | Number of persistent clients |
| `responsibleClientCount`      | `integer` | Number of responsible clients  |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/ops/metrics?onlyStatus=false'
```

* Response example

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

### 2.4. Modify Log Level

#### Description

Use this API to dynamically modify the level of a specified log.

#### Since

`3.0.0`

#### Request Method

`PUT`

The request body type is `application/json`.

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ns/ops/log`

#### Request Parameters

| Name   | Type       | Required | Description        |
|-------|----------|---|-------------|

Request body fields:

| Name       | Type       | Required    | Description      |
|-----------|----------|-------|-----------|
| `logName`  | `string` | **Yes** | Name of the log to modify. |
| `logLevel` | `string` | **Yes** | New log level.   |

#### Response Data

| Name    | Type     | Description      |
|--------|----------|---------|
| `data` | `string` | Returns `ok` on success. |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ns/ops/log' -H 'Content-Type: application/json' -d '{"logName":"com.example.Logger","logLevel":"DEBUG"}'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.5. Query All Clients

#### Description

Query the list of all clients.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ns/client/list`

#### Request Parameters

None

#### Response Data

| Name    | Type           | Description      |
|--------|----------------|---------|
| `data` | `array` | Client ID list. |

#### Examples

* Request example

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

### 2.6. Query Client Details

#### Description

Query client details by client ID.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ns/client`

#### Request Parameters

| Name        | Type     | Required  | Description    |
|------------|----------|-------|-------|
| `clientId` | `string` | **Yes** | Client ID |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name               | Type      | Description                 |
|-------------------|-----------|--------------------|
| `clientId`        | `string` | Unique client ID.         |
| `ephemeral`       | `boolean` | Whether the client is ephemeral        |
| `lastUpdatedTime` | `integer` | Last client update time as a timestamp    |
| `clientType`      | `string` | Client type              |
| `connectType`     | `string` | Connection type. This applies only to 2.x clients. |
| `appName`         | `string` | Application name to which the client belongs         |
| `version`         | `string` | Client version            |
| `clientIp`        | `string` | Client IP address         |
| `clientPort`      | `string` | Client port            |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/client?clientId=1741748952410_127.0.0.1_53863'
```

* Response example

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

For a persistent instance, the response is as follows:

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

### 2.7. Query Services Registered by a Client

#### Description

Query the list of services registered by a specified client.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ns/client/publish/list`

#### Request Parameters

| Name        | Type     | Required  | Description    |
|------------|----------|-------|-------|
| `clientId` | `string` | **Yes** | Client ID |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                         | Type     | Description      |
|-----------------------------|----------|-----------|
| `namespaceId`               | `string` | Namespace      |
| `groupName`                 | `string` | Group name       |
| `serviceName`               | `string` | Service name       |
| `publisherInfo`             | `object` | Instances registered under this service |
| `publisherInfo.ip`          | `string` | `IP`Address    |
| `publisherInfo.port`        | `integer` | Port number       |
| `publisherInfo.clusterName` | `string` | Cluster name       |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/client/publish/list?clientId=1664527081276_127.0.0.1_4400'
```

* Response example

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

### 2.8. Query Services Subscribed by a Client

#### Description

Query the list of services subscribed by a specified client.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ns/client/subscribe/list`

#### Request Parameters

| Name        | Type     | Required | Description    |
|------------|----------|------|-------|
| `clientId` | `string` | **Yes** | Client ID |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                      | Type     | Description  |
|--------------------------|----------|-------|
| `namespaceId`            | `string` | Namespace  |
| `groupName`              | `string` | Group name   |
| `serviceName`            | `string` | Service name   |
| `subscriberInfo`         | `object` | Subscription information  |
| `subscriberInfo.appName` | `string` | Application    |
| `subscriberInfo.agent`   | `string` | Client information |
| `subscriberInfo.address` | `string` | Address    |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/client/subscribe/list?clientId=1664527081276_127.0.0.1_4400'
```

* Response example

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

### 2.9. Query Clients That Register a Specified Service

#### Description

Query the list of clients that register a specified service.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ns/client/service/publisher/list`

#### Request Parameters

| Name           | Type      | Required  | Default               | Description                     |
|---------------|-----------|-------|-------------------|--------------------------|
| `namespaceId` | `string` | No | `"public"` | Namespace ID. |
| `groupName` | `string` | No | `"DEFAULT_GROUP"` | Group name. |
| `serviceName` | `string` | **Yes** | None | Service name. |
| `ip` | `string` | No | None | Instance IP. |
| `port` | `integer` | No | None | Instance port. |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name           | Type     | Description    |
|---------------|----------|---------|
| `clientId`    | `string` | Client ID |
| `ip`          | `string` | Instance IP |
| `port`        | `integer` | Instance port   |
| `clusterName` | `string` | Instance cluster name  |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/client/service/publisher/list?serviceName=test'
```

* Response example

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

### 2.10. Query Clients That Subscribe to a Specified Service

#### Description

Query the list of clients that subscribe to a specified service.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ns/client/service/subscriber/list`

#### Request Parameters

| Name           | Type      | Required  | Default               | Description                     |
|---------------|-----------|-------|-------------------|--------------------------|
| `namespaceId` | `string` | No | `"public"` | Namespace ID. |
| `groupName` | `string` | No | `"DEFAULT_GROUP"` | Group name. |
| `serviceName` | `string` | **Yes** | None | Service name. |
| `ip` | `string` | No | None | Subscriber IP. |
| `port` | `integer` | No | None | Subscriber port. |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name        | Type     | Description                             |
|------------|----------|----------------------------------|
| `clientId` | `string` | Client ID                          |
| `address`  | `string` | Subscriber client IP                      |
| `agent`    | `string` | Subscriber client version                        |
| `appName`  | `string` | Application name of the subscriber client. `unknown` means it is not configured or not supported by the client. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/client/service/subscriber/list?serviceName=service1'
```

* Response example

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

### 2.11. Query the Responsible Server for a Client

#### Description

Query the responsible server by client IP and port. This applies only to persistent service instances or ephemeral instances registered through Admin APIs. Ephemeral instances registered by clients later than 2.x cannot use this API to locate the responsible server node.

> This API also applies to instances registered by 1.x clients, but 1.x clients will no longer be supported in future versions.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ns/client/distro`

#### Request Parameters

| Name    | Type     | Required  | Description    |
|--------|----------|-------|-------|
| `ip`   | `string` | **Yes** | Client IP |
| `port` | `integer` | **Yes** | Client port. |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                 | Type     | Description       |
|---------------------|----------|----------|
| `responsibleServer` | `string` | Responsible server information |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/client/distro?ip=127.0.0.1&port=8080'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "responsibleServer": "127.0.0.1:8848"
  }
}
```

### 2.12. Update Cluster Information

#### Description

Update metadata information of a specified cluster.

#### Since

`3.0.0`

#### Request Method

`PUT`

#### Authorization

Requires `write` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ns/cluster`

#### Request Parameters

| Name                     | Type                  | Required  | Description                |
|-------------------------|-----------------------|-------|-------------------|
| `namespaceId` | `string` | No | Namespace ID |
| `serviceName` | `string` | **Yes** | Service name |
| `clusterName` | `string` | **Yes** | Cluster name |
| `checkPort` | `integer` | No | Health check port |
| `useInstancePort4Check` | `boolean` | No | Whether to use the instance port for health checks |
| `healthChecker` | `string` | No | Health checker configuration as a JSON string |
| `metadata` | `string` | No | Extended cluster metadata. Defaults to `""`. |
| `groupName` | `string` | No | - |

#### Response Data

| Name    | Type     | Description     |
|--------|----------|--------|
| `data` | `string` | Operation result information |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ns/cluster' -d 'serviceName=test&clusterName=DEFAULT&checkPort=80&useInstancePort4Check=true&healthChecker={"type":"none"}'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.13. Update Instance Health Status

#### Description

Update the health status of a specified instance.

> This is valid only for instances of persistent services whose health check mode is `NONE`.
> The health status of an ephemeral instance is maintained by its connection (client). For persistent services that use other health check types, the health check task automatically maintains health status. Even if the update succeeds, it is soon reset by the health check task.

#### Since

`3.0.0`

#### Request Method

`PUT`

#### Authorization

Requires `write` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ns/health/instance`

#### Request Parameters

| Name           | Type      | Required  | Description                      |
|---------------|-----------|-------|-------------------------|
| `namespaceId` | `string` | No | Namespace ID. Defaults to `public`. |
| `serviceName` | `string` | **Yes** | Service name |
| `groupName` | `string` | No | Group name. Defaults to `DEFAULT_GROUP`. |
| `clusterName` | `string` | No | Cluster name. Defaults to `DEFAULT`. |
| `ip` | `string` | **Yes** | Instance IP |
| `port` | `integer` | **Yes** | Instance port |
| `healthy` | `boolean` | **Yes** | Health status. `true` means healthy. |

#### Response Data

| Name    | Type     | Description     |
|--------|----------|--------|
| `data` | `string` | Operation result information |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ns/health/instance' -d 'namespaceId=public&serviceName=service1&groupName=DEFAULT_GROUP&clusterName=cluster1&ip=127.0.0.1&port=8080&healthy=true'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.14. Get All Health Checkers

#### Description

Get all health checker types supported by the system and their configurations.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Requires `write` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ns/health/checkers`

#### Request Parameters

None

#### Response Data

| Name    | Type                                 | Description          |
|--------|--------------------------------------|-------------|
| `data` | `Map<String, AbstractHealthChecker>` | Health checker type and configuration |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/health/checkers'
```

* Response example

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

### 2.15. Register Instance

#### Description

Register a new instance to a specified service.

#### Since

`3.0.0`

#### Request Method

`POST`

#### Authorization

Requires `write` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ns/instance`

#### Request Parameters

| Name           | Type                  | Required  | Description                      |
|---------------|-----------------------|-------|-------------------------|
| `namespaceId` | `string` | No | Namespace ID. Defaults to `public`. |
| `serviceName` | `string` | **Yes** | Service name |
| `groupName` | `string` | No | Group name. Defaults to `DEFAULT_GROUP`. |
| `clusterName` | `string` | No | Cluster name. Defaults to `DEFAULT`. |
| `ip` | `string` | **Yes** | Instance IP |
| `port` | `integer` | **Yes** | Instance port |
| `weight` | `number` | No | Instance weight. Defaults to `1.0`. |
| `healthy` | `boolean` | No | Health status. Defaults to `true`. |
| `enabled` | `boolean` | No | Whether the instance is enabled. Defaults to `true`. |
| `metadata` | `string` | No | Instance metadata |
| `ephemeral` | `boolean` | No | Whether this is an ephemeral instance |

#### Response Data

| Name    | Type     | Description     |
|--------|----------|--------|
| `data` | `string` | Operation result information |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance' \
-d 'namespaceId=public&serviceName=service1&groupName=DEFAULT_GROUP&clusterName=cluster1&ip=127.0.0.1&port=8080&weight=1.0&healthy=true&enabled=true&metadata={"key1=value1"}&ephemeral=true'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.16. Deregister Instance

#### Description

Deregister an instance from a specified service.

#### Since

`3.0.0`

#### Request Method

`DELETE`

#### Authorization

Requires `write` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ns/instance`

#### Request Parameters

| Name           | Type      | Required  | Description                      |
|---------------|-----------|-------|-------------------------|
| `namespaceId` | `string` | No | Namespace ID. Defaults to `public`. |
| `serviceName` | `string` | **Yes** | Service name |
| `groupName` | `string` | No | Group name. Defaults to `DEFAULT_GROUP`. |
| `clusterName` | `string` | No | Cluster name. Defaults to `DEFAULT`. |
| `ip` | `string` | **Yes** | Instance IP |
| `port` | `integer` | **Yes** | Instance port |

#### Response Data

| Name    | Type     | Description     |
|--------|----------|--------|
| `data` | `string` | Operation result information |

#### Examples

* Request example

```shell
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance?namespaceId=public&serviceName=service1&groupName=DEFAULT_GROUP&clusterName=cluster1&ip=127.0.0.1&port=8080&ephemeral=true'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.17. Update Instance

#### Description

Update information of a specified instance.

>
Metadata updated through this API has higher priority than metadata submitted during instance registration and is remembered for a period of time after the corresponding instance is deleted. If the instance is registered again during this period, the updated metadata remains effective. You can adjust the retention time through `nacos.naming.clean.expired-metadata.expired-time` and `nacos.naming.clean.expired-metadata.interval`.
> For example, the metadata submitted during instance registration is `k1=v1`. If this API updates the metadata to `k1=v2`, the metadata read at this time is `k1=v2`.
> If the instance is deregistered and quickly registered again, the metadata is still `k1=v2` instead of `k1=v1`. If the instance is registered again after `expired-metadata.expired-time`, the metadata is `k1=v1`.

> This API completely overwrites previously updated metadata. For example, if metadata is updated with `k1=v1` and then updated with `k2=v2`, the metadata read at this time is `k2=v2` instead of `k1=v1,k2=v2`.

#### Since

`3.0.0`

#### Request Method

`PUT`

#### Authorization

Requires `write` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ns/instance`

#### Request Parameters

| Name           | Type                  | Required  | Description                      |
|---------------|-----------------------|-------|-------------------------|
| `namespaceId` | `string` | No | Namespace ID. Defaults to `public`. |
| `serviceName` | `string` | **Yes** | Service name |
| `groupName` | `string` | No | Group name. Defaults to `DEFAULT_GROUP`. |
| `clusterName` | `string` | No | Cluster name. Defaults to `DEFAULT`. |
| `ip` | `string` | **Yes** | Instance IP |
| `port` | `integer` | **Yes** | Instance port |
| `weight` | `number` | No | Instance weight. Defaults to `1.0`. |
| `healthy` | `boolean` | No | Health status. Defaults to `true`. |
| `enabled` | `boolean` | No | Whether the instance is enabled. Defaults to `true`. |
| `metadata` | `string` | No | Instance metadata |
| `ephemeral` | `boolean` | No | Whether this is an ephemeral instance |

#### Response Data

| Name    | Type     | Description     |
|--------|----------|--------|
| `data` | `string` | Operation result information |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance' \
-d 'serviceName=test&clusterName=DEFAULT&groupName=DEFAULT_GROUP&ip=1.1.1.1&port=3306&ephemeral=true&weight=100&enabled=false&metadata=%7B%22%E5%95%A6%E5%95%A6%E5%95%A6%26%E5%95%B5%E5%95%B5%E5%95%B5%22%3A%22xxx%22%7D'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.18. Batch Update Instance Metadata

#### Description

Batch update metadata of specified instances.

#### Since

`3.0.0`

#### Request Method

`PUT`

#### Authorization

Requires `write` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ns/instance/metadata/batch`

#### Request Parameters

| Name               | Type                  | Required  | Description                                                                                           |
|-------------------|-----------------------|-------|----------------------------------------------------------------------------------------------|
| `namespaceId` | `string` | No | Namespace ID. Defaults to `public`. |
| `serviceName` | `string` | **Yes** | Service name |
| `groupName` | `string` | No | Group name. Defaults to `DEFAULT_GROUP`. |
| `instances` | `string` | No | Instance list as a JSON array string. The default value `""` means all instances are updated. If specified, each element represents an instance to update and must contain `ip` and `port`; `clusterName` is optional. |
| `metadata` | `string` | **Yes** | Metadata |
| `consistencyType` | `string` | No | Consistency type, `ephemeral` or `persist`, corresponding to the service `ephemeral` attribute. Defaults to `ephemeral`. |

#### Response Data

| **Name**   | **Type**       | **Description**  |
|-----------|----------------|---------|
| `updated` | `array` | Updated instance list. |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance/metadata/batch' \
-d 'namespaceId=public&serviceName=service1&groupName=DEFAULT_GROUP&instances=[{"ip":"127.0.0.1","port":8080}]&metadata={"key1":"value1"}&consistencyType=ephemeral'
```

* Response example

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

### 2.19. Batch Delete Instance Metadata

#### Description

Batch delete metadata of specified instances.

#### Since

`3.0.0`

#### Request Method

`DELETE`

#### Authorization

Requires `write` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ns/instance/metadata/batch`

#### Request Parameters

| Name               | Type                  | Required  | Description                      |
|-------------------|-----------------------|-------|-------------------------|
| `namespaceId` | `string` | No | Namespace ID. Defaults to `public`. |
| `serviceName` | `string` | **Yes** | Service name |
| `groupName` | `string` | No | Group name. Defaults to `DEFAULT_GROUP`. |
| `instances` | `string` | No | Instance list as a JSON string. Defaults to `""`. |
| `metadata` | `string` | **Yes** | Metadata |
| `consistencyType` | `string` | No | Consistency type. Defaults to `""`. |

#### Response Data

| **Name**        | **Type**                           | **Description**  |
|----------------|------------------------------------|---------|
| `data`         | `InstanceMetadataBatchOperationVo` | Operation result information  |
| `data.updated` | `array`                     | Updated instance list. |

#### Examples

* Request example

```shell
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance/metadata/batch?namespaceId=public&serviceName=service1&groupName=DEFAULT_GROUP&instances=%5B%7B%22ip%22%3A%22127.0.0.1%22%2C%22port%22%3A8080%7D%5D&metadata=%7B%22key1%22%3A%22value1%22%7D&consistencyType=ephemeral'
```

* Response example

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

### 2.20. Partially Update Instance

#### Description

Partially update information of a specified instance.

> Unlike [Update Instance](#217-update-instance), this API supports partial updates to instance information. For example, if metadata is updated with `k1=v1` and then updated with `k2=v2`, the metadata read at this time is `k1=v1,k2=v2`.

#### Since

`3.0.0`

#### Request Method

`PUT`

#### Authorization

Requires `write` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ns/instance/partial`

#### Request Parameters

| **Name**       | **Type**  | **Required** | **Description**             |
|---------------|-----------|----------|--------------------|
| `namespaceId` | `string` | No | Namespace ID. Defaults to `public`. |
| `serviceName` | `string` | **Yes** | Service name |
| `ip` | `string` | **Yes** | Instance IP |
| `port` | `integer` | **Yes** | Instance port |
| `clusterName` | `string` | No | Cluster name. Defaults to `DEFAULT`. |
| `weight` | `number` | No | Instance weight. Defaults to 1.0. |
| `enabled` | `boolean` | No | Whether the instance is enabled. Enabled by default. |
| `metadata` | `string` | No | Instance metadata as a JSON string |
| `ephemeral` | `boolean` | No | - |
| `groupName` | `string` | No | - |
| `healthy` | `boolean` | No | - |

#### Response Data

| Name    | Type     | Description     |
|--------|----------|--------|
| `data` | `string` | Operation result information |

#### Examples

* Request example

```shell
curl -X PUT "http://127.0.0.1:8848/nacos/v3/admin/ns/instance/partial" -d 'namespaceId=public&serviceName=example-service&ip=127.0.0.1&clusterName=DEFAULT&port=8080&weight=1.0&enabled=true&metadata={"key":"value"}'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 2.21. Query Service Instance List

#### Description

Query all instances of a specified service.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ns/instance/list`

#### Request Parameters

| **Name**       | **Type**  | **Required** | **Description**                  |
|---------------|-----------|----------|-------------------------|
| `namespaceId` | `string` | No | Namespace ID. Defaults to `public` |
| `groupName` | `string` | No | Group name. Defaults to `DEFAULT_GROUP`. |
| `serviceName` | `string` | **Yes** | Service name |
| `clusterName` | `string` | No | Cluster name. If not provided, instances of all clusters will be returned. |
| `healthyOnly` | `boolean` | No | Whether to return only healthy instances. Defaults to `false`. |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name           | Type      | Description                              |
|---------------|-----------|-----------------------------------|
| `serviceName` | `string` | Service name in the `groupName`@@`serviceName` format |
| `clusterName` | `string` | Cluster name of the instance                         |
| `ip`          | `string` | Instance IP                            |
| `port`        | `integer` | Instance port                             |
| `weight`      | `number` | Instance weight                              |
| `healthy`     | `boolean` | Whether the instance is healthy                            |
| `enabled`     | `boolean` | Whether the instance is enabled                            |
| `ephemeral`   | `boolean` | Whether this is an ephemeral instance                           |
| `metadata`    | `map<string, string>`     | Instance metadata. |
| `instanceId`  | `string` | Instance ID                              |

> The heartbeat parameters `instanceHeartBeatInterval`, `instanceHeartBeatTimeOut`, and `ipDeleteTimeout` are used to maintain compatibility with the heartbeat mode of 1.x clients. Support for 1.x clients may be removed in later versions, and these three parameters will then be deprecated.

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance/list?namespaceId=public&serviceName=service1&healthyOnly=true'
```

* Response example

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

### 2.22. Query Instance Details

#### Description

Query details of a specified instance.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ns/instance`

#### Request Parameters

| **Name**       | **Type** | **Required** | **Description**               |
|---------------|----------|----------|------------------------|
| `namespaceId` | `string` | No        | Namespace ID. Defaults to `public`     |
| `groupName`   | `string` | No    | Group name. Defaults to `DEFAULT_GROUP`. |
| `serviceName` | `string` | **Yes**    | Service name                    |
| `clusterName` | `string` | No        | Cluster name. Defaults to `DEFAULT`.      |
| `ip`          | `string` | **Yes**    | `IP`Address                 |
| `port`        | `integer` | **Yes**    | Port number                    |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name           | Type      | Description                              |
|---------------|-----------|-----------------------------------|
| `serviceName` | `string` | Service name in the `groupName`@@`serviceName` format |
| `clusterName` | `string` | Cluster name of the instance                         |
| `ip`          | `string` | Instance IP                            |
| `port`        | `integer` | Instance port                             |
| `weight`      | `number` | Instance weight                              |
| `healthy`     | `boolean` | Whether the instance is healthy                            |
| `enabled`     | `boolean` | Whether the instance is enabled                            |
| `ephemeral`   | `boolean` | Whether this is an ephemeral instance                           |
| `metadata`    | `map<string, string>`     | Instance metadata. |
| `instanceId`  | `string` | Instance ID                              |

> The heartbeat parameters `instanceHeartBeatInterval`, `instanceHeartBeatTimeOut`, and `ipDeleteTimeout` are used to maintain compatibility with the heartbeat mode of 1.x clients. Support for 1.x clients may be removed in later versions, and these three parameters will then be deprecated.

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/instance?namespaceId=public&serviceName=service1&ip=1.1.1.1&port=3306'
```

* Response example

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

### 2.23. Create Service

#### Description

Create a new persistent service.

#### Since

`3.0.0`

#### Request Method

`POST`

#### Authorization

Requires `write` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ns/service`

#### Request Parameters

| Name                | Type           | Required  | Description                   |
|--------------------|----------------|-------|------------------------|
| `namespaceId` | `string` | No | Namespace ID. Defaults to `public`. |
| `groupName` | `string` | No | Group name. Defaults to `DEFAULT_GROUP`. |
| `serviceName` | `string` | **Yes** | Service name |
| `metadata` | `string` | No | Service metadata. Defaults to empty. |
| `ephemeral` | `boolean` | No | Whether this is an ephemeral instance. Defaults to `false`. |
| `protectThreshold` | `number` | No | Protection threshold. Defaults to `0`. |
| `selector` | `string` | No | Access policy. Defaults to empty. |

#### Response Data

| Name    | Type      | Description     |
|--------|-----------|--------|
| `data` | `boolean` | Whether execution succeeds |

#### Examples

* Request example

```shell
curl -d 'serviceName=nacos.test.1' \
  -d 'ephemeral=true' \
  -d 'metadata={"k1":"v1"}' \
  -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ns/service'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 2.24. Delete Service

#### Description

Delete a specified service.

#### Since

`3.0.0`

#### Request Method

`DELETE`

#### Authorization

Requires `write` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ns/service`

#### Request Parameters

| Name           | Type     | Required  | Description                   |
|---------------|----------|-------|------------------------|
| `namespaceId` | `string` | No     | Namespace ID. Defaults to `public`.   |
| `groupName`   | `string` | No     | Group name. Defaults to `DEFAULT_GROUP`. |
| `serviceName` | `string` | **Yes** | Service name                    |

#### Response Data

| Name    | Type      | Description     |
|--------|-----------|--------|
| `data` | `boolean` | Whether execution succeeds |

#### Examples

* Request example

```shell
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ns/service?serviceName=nacos.test.1'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 2.25. Query Service Details

#### Description

Query details of a specified service.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ns/service`

#### Request Parameters

| Name           | Type     | Required  | Description                   |
|---------------|----------|-------|------------------------|
| `namespaceId` | `string` | No     | Namespace ID. Defaults to `public`.   |
| `groupName`   | `string` | No     | Group name. Defaults to `DEFAULT_GROUP`. |
| `serviceName` | `string` | **Yes** | Service name                    |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                                                 | Type         | Description                                   |
|-----------------------------------------------------|--------------|--------------------------------------|
| `namespaceId`                                       | `string` | Namespace ID to which the service belongs.                    |
| `groupName`                                         | `string` | Group name to which the service belongs.                      |
| `serviceName`                                       | `string` | Service name.                                 |
| `ephemeral`                                         | `boolean` | Persistence attribute of the service. `true` means ephemeral service, and `false` means persistent service.  |
| `protectThreshold`                                  | `number` | Service protection threshold.                              |
| `selector`                                          | `object` | Service selector. |
| `metadata`                                          | `object` | Service metadata. |
| `clusterMap`                                        | `object` | Service cluster map. The key is the cluster name and the value is the cluster details. |
| `clusterMap`.$ClusterName.`clusterName`             | `string` | Cluster name.                                 |
| `clusterMap`.$ClusterName.`healthChecker`           | `object` | Health checker. |
| `clusterMap`.$ClusterName.`healthyCheckPort`        | `integer` | Health check port.                              |
| `clusterMap`.$ClusterName.`useInstancePortForCheck` | `boolean` | Whether to use the registered instance `IP:Port` for health checks.          |
| `clusterMap`.$ClusterName.`metadata`                | `map<string, string>` | Cluster metadata. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/service?serviceName=nacos.test.1'
```

* Response example

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

### 2.26. Query Service List

#### Description

Query all services. Pagination and conditional filtering are supported.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ns/service/list`

#### Request Parameters

| Name           | Type           | Required  | Description                   |
|---------------|----------------|-------|------------------------|
| `namespaceId` | `string` | No | Namespace ID. Defaults to `public`. |
| `pageNo` | `integer` | **Yes** | Current page. Defaults to `1`. |
| `pageSize` | `integer` | **Yes** | Page size. Defaults to `20`; maximum value is `500`. |
| `groupNameParam` | `string` | No | - |
| `ignoreEmptyService` | `boolean` | No | - |
| `serviceNameParam` | `string` | No | - |
| `withInstances` | `boolean` | No | - |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                                   | Type     | Description         |
|---------------------------------------|----------|--------------|
| `totalCount`                          | `integer` | Total number of services that match the criteria.  |
| `pageNumber`                          | `integer` | Current page number, starting from `1`. |
| `pagesAvailable`                      | `integer` | Available pages.        |
| `pageItems`                           | `array`   | Service list.        |
| `pageItems`[i].`name`                 | `string` | Service name.         |
| `pageItems`[i].`groupName`            | `string` | Group name of the service.      |
| `pageItems`[i].`clusterCount`         | `string` | Number of clusters under the service.    |
| `pageItems`[i].`ipCount`              | `string` | Number of instances under the service.    |
| `pageItems`[i].`healthyInstanceCount` | `string` | Number of healthy instances under the service.  |
| `pageItems`[i].`triggerFlag`          | `string` | Whether service protection is triggered.  |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/service/list'
```

* Response example

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

### 2.27. Update Service

#### Description

Update configuration information of a specified service.

> This API completely overwrites previously updated metadata. For example, if metadata is updated with `k1=v1` and then updated with `k2=v2`, the metadata read at this time is `k2=v2` instead of `k1=v1,k2=v2`.

#### Since

`3.0.0`

#### Request Method

`PUT`

#### Authorization

Requires `write` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ns/service`

#### Request Parameters

| Name                | Type           | Required  | Description                   |
|--------------------|----------------|-------|------------------------|
| `namespaceId` | `string` | No | Namespace ID. Defaults to `public`. |
| `groupName` | `string` | No | Group name. Defaults to `DEFAULT_GROUP`. |
| `serviceName` | `string` | **Yes** | Service name |
| `metadata` | `string` | No | Service metadata. Defaults to empty. |
| `protectThreshold` | `number` | No | Protection threshold. Defaults to `0`. |
| `selector` | `string` | No | Access policy. Defaults to empty. |
| `ephemeral` | `boolean` | No | - |

#### Response Data

| Name    | Type      | Description     |
|--------|-----------|--------|
| `data` | `boolean` | Whether execution succeeds |

#### Examples

* Request example

```shell
curl -d 'serviceName=nacos.test.1' \
  -d 'metadata={"k1":"v2"}' \
  -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ns/service'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 2.28. Query Subscriber List

#### Description

Query subscribers of a specified service.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ns/service/subscribers`

#### Request Parameters

| **Name**       | **Type**  | **Required** | **Description**                  |
|---------------|-----------|----------|-------------------------|
| `namespaceId` | `string` | No | Namespace ID. Defaults to `public`. |
| `serviceName` | `string` | **Yes** | Service name |
| `groupName` | `string` | No | Group name. Defaults to `DEFAULT_GROUP`. |
| `pageNo` | `integer` | **Yes** | Page number |
| `pageSize` | `integer` | **Yes** | Page size |
| `aggregation` | `boolean` | No | Whether to aggregate. Defaults to `true`. |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                          | Type      | Description                   |
|------------------------------|-----------|----------------------|
| `totalCount`                 | `integer` | Total number of services that match the criteria.          |
| `pageNumber`                 | `integer` | Current page number, starting from `1`.         |
| `pagesAvailable`             | `integer` | Available pages.                |
| `pageItems`                  | `array`    | Service list.                |
| `pageItems`[i].`ip`          | `string` | Subscriber IP.               |
| `pageItems`[i].`port`        | `integer` | Subscriber port.               |
| `pageItems`[i].`address`     | `string` | Subscriber address, usually in `ip:port` format. |
| `pageItems`[i].`agent`       | `string` | Subscriber client version.            |
| `pageItems`[i].`appName`     | `string` | Application to which the subscriber belongs.             |
| `pageItems`[i].`namespaceId` | `string` | Namespace to which the subscriber belongs.           |
| `pageItems`[i].`groupName`   | `string` | Subscribed group name.              |
| `pageItems`[i].`serviceName` | `string` | Subscribed service name.              |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/service/subscribers?namespaceId=public&serviceName=service1&groupName=DEFAULT_GROUP&pageNo=1&pageSize=10'
```

* Response example

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

### 2.29. Query Selector Types

#### Description

Query all selector types supported by the system.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ns/service/selector/types`

#### Request Parameters

None

#### Response Data

| Name    | Type           | Description      |
|--------|----------------|---------|
| `data` | `array` | Selector type list. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ns/service/selector/types'
```

* Response example

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

## 3. Nacos Config Admin APIs

### 3.1. Get Config

#### Description

Get a specified config.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/cs/config`

#### Request Parameters

| **Name**       | **Type**   | **Required** | **Default**  | **Description** |
|---------------|----------|--------|----------|----------|
| `namespaceId` | `string` | No      | `public` | Namespace     |
| `groupName`   | `string` | **Yes**  | None        | Config group name    |
| `dataId`      | `string` | **Yes**  | None        | Config name      |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                | Type     | Description                         |
|--------------------|----------|----------------------------|
| `id`               | `string` | ID of the config in the storage system. It is usually a string of the Long type. |
| `dataId`           | `string` | Config ID.                      |
| `groupName`        | `string` | Config group.                      |
| `namespaceId`      | `string` | Namespace ID.                    |
| `content`          | `string` | Config content.                      |
| `desc`             | `string` | Config description.                      |
| `md5`              | `string` | MD5 value of the config content.                 |
| `configTags`       | `string` | Config tags.                     |
| `encryptedDataKey` | `string` | Key used to encrypt config content. This field exists when a config encryption plugin is used.     |
| `appName`          | `string` | Application name to which the config belongs.                 |
| `type`             | `string` | Config type.                      |
| `createTime`       | `integer` | Config creation time.                    |
| `modifyTime`       | `integer` | Config modification time.                    |
| `createUser`       | `string` | Config creator.                     |
| `createIp`         | `string` | Config creation IP.                    |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/config?dataId=nacos.example&groupName=DEFAULT_GROUP&namespaceId=public'
```

* Response example

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

### 3.2. Publish Config

#### Description

Publish a specified config.

> If the config already exists, it is updated.

#### Since

`3.0.0`

#### Request Method

`POST`

#### Authorization

Requires `write` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/cs/config`

#### Request Parameters

| Name           | Type       | Required    | Default      | Description            |
|---------------|----------|-------|----------|-----------------|
| `namespaceId` | `string` | No | `public` | Namespace ID. |
| `groupName` | `string` | **Yes** | None | Config group name. |
| `dataId` | `string` | **Yes** | None | Config ID. |
| `content` | `string` | **Yes** | None | Config content. |
| `appName` | `string` | No | None | Application name. |
| `configTags` | `string` | No | None | Config tags. |
| `desc` | `string` | No | None | Config description. |
| `type` | `string` | No | None | Config type. |
| `encryptedDataKey` | `string` | No | - | Data key for encrypted config content. |
| `srcUser` | `string` | No | - | Publishing user. |
| `tag` | `string` | No | - | Config tag. |

#### Response Data

| Name    | Type      | Description     |
|--------|-----------|--------|
| `data` | `boolean` | Whether execution succeeds |

#### Examples

* Request example

```shell
curl -d 'dataId=nacos.example' \
 -d 'groupName=DEFAULT_GROUP' \
 -d 'namespaceId=public' \
 -d 'content=contentTest' \
 -X POST 'http://127.0.0.1:8848/nacos/v3/admin/cs/config'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 3.3. Delete Config

#### Description

Delete a specified config.

#### Since

`3.0.0`

#### Request Method

`DELETE`

#### Authorization

Requires `write` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/cs/config`

#### Request Parameters

| Name           | Type       | Required    | Default      | Description  |
|---------------|----------|-------|----------|-------|
| `namespaceId` | `string` | No     | `public` | Namespace  |
| `groupName`   | `string` | **Yes** | None        | Config group name |
| `dataId`      | `string` | **Yes** | None        | Config name   |

#### Response Data

| Name    | Type      | Description     |
|--------|-----------|--------|
| `data` | `boolean` | Whether execution succeeds |

#### Examples

* Request example

```shell
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/cs/config?dataId=nacos.example&groupName=DEFAULT_GROUP&namespaceId=public'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 3.4. Batch Delete Configs

#### Description

Batch delete configs by config ID.

#### Since

`3.0.0`

#### Request Method

`DELETE`

#### Authorization

Requires `write` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/cs/config/batch`

#### Request Parameters

| Name   | Type         | Required  | Description     |
|-------|--------------|-------|--------|
| `ids` | `array` | **Yes** | Config ID list. Separate multiple IDs with commas. |

#### Response Data

| Name    | Type      | Description   |
|--------|-----------|------|
| `data` | `boolean` | Operation result |

#### Examples

* Request example

```
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/batch?ids=1,2,3'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 3.5. Query Config Listeners

#### Description

Query listener information of a specified config.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/cs/config/listener`

#### Request Parameters

| Name           | Type      | Required  | Default      | Description        |
|---------------|-----------|-------|----------|-----------|
| `namespaceId` | `string` | No     | `public` | Namespace      |
| `dataId`      | `string` | **Yes** | None        | Config ID      |
| `groupName`   | `string` | **Yes** | None        | Group name      |
| `aggregation` | `boolean` | No | `true`   | Whether to aggregate data from other nodes. |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name               | Type                  | Description                                    |
|-------------------|-----------------------|---------------------------------------|
| `queryType`       | `string` | Subscriber query type. This API uses `config`.                 |
| `listenersStatus` | `map<string, string>` | Subscriber list. The key is the subscriber IP, and the value is the MD5 value of the current config subscribed by the subscriber. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/listener?namespaceId=public&dataId=example&groupName=DEFAULT_GROUP'
```

* Response example

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

### 3.6. Query Config List by Config Content

#### Description

Search configs by config details, such as content and tags.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/cs/config/list`

#### Request Parameters

| Name            | Type      | Required  | Default      | Description                                                     |
|----------------|-----------|-------|----------|--------------------------------------------------------|
| `pageNo` | `integer` | **Yes** | 1 | Page number. |
| `pageSize` | `integer` | **Yes** | 100 | Page size. |
| `namespaceId` | `string` | No | `public` | Namespace ID. |
| `dataId` | `string` | **Yes** | `""` | Config ID to match. |
| `groupName` | `string` | **Yes** | `""` | Config group name to match. |
| `appName` | `string` | No | `""` | Application name to match. |
| `configTags` | `string` | No | `""` | Config tags to match. |
| `type` | `string` | No | `""` | Config type to match. |
| `configDetail` | `string` | **Yes** | `""` | Config content or details to match. |
| `search` | `string` | No | `blur` | Search mode: `blur` or `accurate`. |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                          | Type     | Description                         |
|------------------------------|----------|----------------------------|
| `totalCount`                 | `integer` | Total number of configs that match the criteria.                 |
| `pagesAvailable`             | `integer` | Total number of available pages.                    |
| `pageNumber`                 | `integer` | Current page number.                      |
| `pageItems`                  | `array`   | Configurations matching the query criteria. |
| `pageItems`[i].`id`          | `string` | ID of the config in the storage system. It is usually a string of the Long type. |
| `pageItems`[i].`dataId`      | `string` | Config ID.                      |
| `pageItems`[i].`groupName`   | `string` | Config group.                      |
| `pageItems`[i].`namespaceId` | `string` | Namespace ID.                    |
| `pageItems`[i].`md5`         | `string` | MD5 value of the config content.                 |
| `pageItems`[i].`appName`     | `string` | Application name to which the config belongs.                 |
| `pageItems`[i].`type`        | `string` | Config type.                      |
| `pageItems`[i].`createTime`  | `integer` | Config creation time.                    |
| `pageItems`[i].`modifyTime`  | `integer` | Config modification time.                    |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/list?pageNo=1&pageSize=10'
```

* Response example

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

### 3.7. Stop Beta Config

#### Description

Stop the beta config of a specified config.

> This API can stop beta publishing only after `betaIps` is set in the `Header` when [Publish Config](#32-publish-config) is called and the config is changed to the BETA publishing state.

#### Since

`3.0.0`

#### Request Method

`DELETE`

#### Authorization

Requires `write` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/cs/config/beta`

#### Request Parameters

| Name           | Type     | Required  | Default      | Description   |
|---------------|----------|-------|----------|------|
| `namespaceId` | `string` | No     | `public` | Namespace |
| `dataId`      | `string` | **Yes** | None        | Config ID |
| `groupName`   | `string` | **Yes** | None        | Group name |

#### Response Data

| Name    | Type      | Description   |
|--------|-----------|------|
| `data` | `boolean` | Operation result |

#### Examples

* Request example

```shell
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/beta?namespaceId=public&dataId=example&groupName=DEFAULT_GROUP'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 3.8. Query Beta Config

#### Description

Query the beta config of a specified config.

> This API can stop beta publishing only after `betaIps` is set in the `Header` when [Publish Config](#32-publish-config) is called and the config is changed to the BETA publishing state.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/cs/config/beta`

#### Request Parameters

| Name           | Type     | Required  | Default      | Description   |
|---------------|----------|-------|----------|------|
| `namespaceId` | `string` | No     | `public` | Namespace |
| `dataId`      | `string` | **Yes** | None        | Config ID |
| `groupName`   | `string` | **Yes** | None        | Group name |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                | Type     | Description                                  |
|--------------------|----------|-------------------------------------|
| `id`               | `string` | Storage ID of the beta config.                        |
| `dataId`           | `string` | Config `dataId`.                          |
| `groupName`        | `string` | Config `groupName`.                       |
| `namespaceId`      | `string` | Namespace to which the config belongs.                          |
| `desc`             | `string` | Config description.                               |
| `md5`              | `string` | MD5 value of the config content.                          |
| `configTags`       | `string` | Config tags.                              |
| `encryptedDataKey` | `string` | Key used to encrypt config content. This field exists when a config encryption plugin is used.              |
| `appName`          | `string` | Application name to which the config belongs.                          |
| `type`             | `string` | Config type.                               |
| `createTime`       | `integer` | Config creation time.                             |
| `modifyTime`       | `integer` | Config modification time.                             |
| `createUser`       | `string` | Config creator.                              |
| `createIp`         | `string` | Config creation IP.                             |
| `grayName`         | `string` | Gray release rule name. Fixed value: `beta`.                |
| `grayRule`         | `string` | Gray release rule in JSON format. The `expr` field is the beta IP list. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/beta?namespaceId=public&dataId=example&groupName=DEFAULT_GROUP'
```

* Response example

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

### 3.9. Import and Publish Configs

#### Description

Import configs and publish them to a specified namespace.

#### Since

`3.0.0`

#### Request Method

`POST`

Request body type: `multipart/form-data`. Parameters are sent in the request body.

#### Authorization

Requires `write` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/cs/config/import`

#### Request Parameters

| Name           | Type               | Required | Default      | Description     |
|---------------|--------------------|------|----------|--------|
| `namespaceId` | `string` | No | `public` | Target namespace ID. |
| `src_user` | `string` | No | None | Importing user. |
| `policy` | `string` | No | `ABORT` | Import policy. |
| `file` | `MultipartFile` | No | None | ZIP file containing configs. |

#### Response Data

| Name              | Type                  | Description     |
|------------------|-----------------------|--------|
| `data`           | `map<string, object>` | Import result. |
| `data.succCount` | `integer` | Number of successfully imported items |
| `data.skipCount` | `integer` | Number of skipped items |

#### Examples

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/import' \
-H 'Content-Type: multipart/form-data' \
-F 'namespaceId=test' \
-F 'file=@/path/to/config.zip'
```

* Response example

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

### 3.10. Export Configs

#### Description

Export specified configs as a ZIP file.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/cs/config/export`

#### Request Parameters

| Name           | Type         | Required | Default      | Description     |
|---------------|--------------|------|----------|--------|
| `namespaceId` | `string` | No | `public` | Namespace ID. |
| `groupName` | `string` | No | `""` | Config group name. |
| `dataId` | `string` | No | `""` | Config ID. |
| `ids` | `array` | No | None | Config ID list. |
| `appName` | `string` | No | - | Application name. |

> When using this API, use `ids` or the `dataId` + `groupName` combination separately. Choose only one method and pass empty strings for the other type. Otherwise, the exported file may be empty.

#### Response Data

The response body is a ZIP file that contains config content and metadata.

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/export?namespaceId=public&ids=' --output config.zip
```

### 3.11. Clone Configs

#### Description

Clone configs to a specified namespace.

#### Since

`3.0.0`

#### Request Method

`POST`

#### Authorization

Requires `write` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/cs/config/clone`

#### Request Parameters

| Name       | Type               | Required | Default     | Description       |
|-----------|--------------------|------|---------|----------|
| `namespaceId` | `string` | **Yes** | `public` | Target namespace ID. |
| `policy` | `string` | No | `ABORT` | Clone policy. |
| `src_user` | `string` | No | - | Cloning user. |

#### Request Parameters

The request body type is `application/json`. The request body is an array of configs. Each item is `SameNamespaceCloneConfigBean` and contains `cfgId`, `dataId`, and `group`.

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name         | Type      | Description     |
|-------------|-----------|--------|
| `succCount` | `integer` | Number of successfully imported items |
| `skipCount` | `integer` | Number of skipped items |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/clone' -d "namespaceId=test&policy=ABORT" \
-H 'Content-Type: application/json' \
-d "[{\"cfgId\":\"838029534438625280\",\"dataId\":\"111\",\"group\":\"DEFAULT_GROUP\"},{\"cfgId\":\"838033747294031872\",\"dataId\":\"qtc-user.yaml\",\"group\":\"DEFAULT_GROUP\"}]"
```

* Response example

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

### 3.12. Query Config History List

#### Description

Get the history version list of a specified config.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/cs/history/list`

#### Request Parameters

| Name           | Type       | Required    | Default             | Description  |
|---------------|----------|-------|-----------------|-------|
| `namespaceId` | `string` | No     | `public`        | Namespace  |
| `groupName`   | `string` | **Yes** | None               | Config group name |
| `dataId`      | `string` | **Yes** | None               | Config name   |
| `pageNo`      | `integer` | **Yes** | `1`             | Current page   |
| `pageSize`    | `integer` | **Yes** | `100` (maximum `500`) | Page size  |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                          | Type     | Description                                |
|------------------------------|----------|-----------------------------------|
| `totalCount`                 | `integer` | Total number of history records.                          |
| `pageNumber`                 | `integer` | Current page number, starting from `1`.                      |
| `pagesAvailable`             | `integer` | Available pages.                             |
| `pageItems`                  | `array`   | History record list. |
| `pageItems`[i].`id`          | `string` | History record ID.                          |
| `pageItems`[i].`dataId`      | `string` | Config `dataId`.                        |
| `pageItems`[i].`groupName`   | `string` | Config `groupName`.                     |
| `pageItems`[i].`namespaceId` | `string` | Namespace to which the config belongs.                        |
| `pageItems`[i].`appName`     | `string` | Application name to which the config belongs.                     |
| `pageItems`[i].`opType`      | `string` | Operation type. `I` means insert, `U` means update, and `D` means delete.        |
| `pageItems`[i].`publishType` | `string` | Publish type. `formal` means normal publishing, and `gray` means beta publishing. |
| `pageItems`[i].`srcIp`       | `string` | Source IP of the publishing operation.                          |
| `pageItems`[i].`srcUser`     | `string` | Publishing user. This exists only when authentication is enabled and the user publishes the config after logging in.       |
| `pageItems`[i].`createTime`  | `integer` | Config creation time.                           |
| `pageItems`[i].`modifyTime`  | `integer` | Config modification time.                           |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/history/list?dataId=nacos.example&groupName=DEFAULT_GROUP&namespaceId=public&pageNo=1&pageSize=100'
```

* Response example

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

### 3.13. Query Config History Version Details

#### Description

Use this API to query a historical change record of a config.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/cs/history`

#### Request Parameters

| Name         | Type       | Required    | Default      | Description   |
|-------------|----------|-------|----------|--------|
| namespaceId | `string` | No     | `public` | Namespace   |
| groupName   | `string` | **Yes** | None        | Config group name  |
| dataId      | `string` | **Yes** | None        | Config name    |
| nid         | `integer` | **Yes** | None        | Config history ID |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name           | Type         | Description                                                                          |
|---------------|--------------|-----------------------------------------------------------------------------|
| `id`          | `string` | History record ID.                                                                    |
| `dataId`      | `string` | Config `dataId`.                                                                  |
| `groupName`   | `string` | Config `groupName`.                                                               |
| `namespaceId` | `string` | Namespace to which the config belongs.                                                                  |
| `content`     | `string` | Config content. |
| `appName`     | `string` | Application name to which the config belongs.                                                               |
| `opType`      | `string` | Operation type. `I` means insert, `U` means update, and `D` means delete.                                                  |
| `publishType` | `string` | Publish type. `formal` means normal publishing, and `gray` means beta publishing.                                           |
| `srcIp`       | `string` | Source IP of the publishing operation.                                                                    |
| `srcUser`     | `string` | Publishing user. This exists only when authentication is enabled and the user publishes the config after logging in.                                                 |
| `createTime`  | `integer` | Config creation time.                                                                     |
| `modifyTime`  | `integer` | Config modification time.                                                                     |
| `grayName`    | `string` | Gray release rule name. Fixed value: `beta`.                                                        |
| `extInfo`     | `string` | Extended information. It currently includes `src_user`, `type`, and `c_desc`; when `publishType` is `gray`, it also includes `grayRule`. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/history/??dataId=111&groupName=DEFAULT_GROUP&nid=7'
```

* Response example

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

### 3.14. Query Previous Config Version

#### Description

Get the previous version of a specified config.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/cs/history/previous`

#### Request Parameters

| Name         | Type       | Required    | Default      | Description  |
|-------------|----------|-------|----------|-------|
| namespaceId | `string` | No     | `public` | Namespace  |
| groupName   | `string` | **Yes** | None        | Config group name |
| dataId      | `string` | **Yes** | None        | Config name   |
| id          | `integer` | **Yes** | None        | Config ID  |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name           | Type         | Description                                                                          |
|---------------|--------------|-----------------------------------------------------------------------------|
| `id`          | `string` | History record ID.                                                                    |
| `dataId`      | `string` | Config `dataId`.                                                                  |
| `groupName`   | `string` | Config `groupName`.                                                               |
| `namespaceId` | `string` | Namespace to which the config belongs.                                                                  |
| `content`     | `string` | Config content. |
| `appName`     | `string` | Application name to which the config belongs.                                                               |
| `opType`      | `string` | Operation type. `I` means insert, `U` means update, and `D` means delete.                                                  |
| `publishType` | `string` | Publish type. `formal` means normal publishing, and `gray` means beta publishing.                                           |
| `srcIp`       | `string` | Source IP of the publishing operation.                                                                    |
| `srcUser`     | `string` | Publishing user. This exists only when authentication is enabled and the user publishes the config after logging in.                                                 |
| `createTime`  | `integer` | Config creation time.                                                                     |
| `modifyTime`  | `integer` | Config modification time.                                                                     |
| `grayName`    | `string` | Gray release rule name. Fixed value: `beta`.                                                        |
| `extInfo`     | `string` | Extended information. It currently includes `src_user`, `type`, and `c_desc`; when `publishType` is `gray`, it also includes `grayRule`. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/history/previous?id=101&dataId=nacos.example&groupName=DEFAULT_GROUP&namespaceId=public'
```

* Response example

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

### 3.15. Query Config List in a Specified Namespace

#### Description

Get the config information list in a specified namespace.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/cs/history/configs`

#### Request Parameters

| Name         | Type       | Required    | Default | Description |
|-------------|----------|-------|-----|------|
| namespaceId | `string` | **Yes** | None   | Namespace |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name         | Type     | Description            |
|-------------|----------|---------------|
| `dataId`    | `string` | Config `dataId`.    |
| `groupName` | `string` | Config `groupName`. |

> Other fields are not used.

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/history/configs?namespaceId=public'
```

* Response example

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

### 3.16. Query Capacity Information

#### Description

Query capacity information of a specified group or namespace.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/cs/capacity`

#### Request Parameters

| Name           | Type     | Required | Default | Description     |
|---------------|----------|------|-----|--------|
| `groupName`   | `string` | No    | None   | Group name   |
| `namespaceId` | `string` | No    | None   | Namespace ID |

**Note:** At least one of `groupName` and `namespaceId` must be provided.

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                | Type      | Description         |
|--------------------|-----------|------------|
| `id`               | `integer` | Unique ID of the capacity information  |
| `groupName`        | `string` | Group name       |
| `namespaceId`      | `string` | Namespace ID     |
| `quota`            | `integer` | Quota         |
| `usage`            | `integer` | Current usage      |
| `maxSize`          | `integer` | Maximum size of a single config    |
| ~~`gmtCreate`~~    | `string` | Creation time. Deprecated   |
| ~~`gmtModified`~~  | `string` | Last modification time. Deprecated |
| ~~`maxAggrCount`~~ | `integer` | Unused. Deprecated    |
| ~~`maxAggrSize`~~  | `integer` | Unused. Deprecated    |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/capacity?namespaceId=public'
```

* Response example

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

### 3.17. Update Capacity Information

#### Description

Update capacity information of a specified group or namespace. If the capacity information is not initialized, it is automatically initialized.

#### Since

`3.0.0`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/cs/capacity`

#### Request Parameters

| Name           | Type      | Required  | Description                   |
|---------------|-----------|-------|----------------------|
| `groupName` | `string` | **Yes** | Group name. Either `groupName` or `namespaceId` must be provided. |
| `namespaceId` | `string` | No | Namespace ID. Either `namespaceId` or `groupName` must be provided. |
| `quota` | `integer` | No | Quota |
| `maxSize` | `integer` | No | Maximum size |
| `maxAggrCount` | `integer` | No | - |
| `maxAggrSize` | `integer` | No | - |

#### Response Data

| Name    | Type      | Description   |
|--------|-----------|------|
| `data` | `boolean` | Operation result |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/cs/capacity' -d 'namespaceId=public&quota=200&maxSize=2048'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 3.18. Manually Trigger Local Cache Update

#### Description

Manually trigger loading all config data from storage into the local cache.

#### Since

`3.0.0`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/cs/ops/localCache`

#### Request Parameters

None

#### Response Data

| Name    | Type     | Description   |
|--------|----------|------|
| `data` | `string` | Operation result |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/cs/ops/localCache'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "Local cache updated from store successfully!"
}
```

### 3.19. Set Log Level

#### Description

Dynamically set the log level of a specified module.

#### Since

`3.0.0`

#### Request Method

`PUT`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/cs/ops/log`

#### Request Parameters

| Name        | Type     | Required  | Default | Description                    |
|------------|----------|-------|-----|-----------------------|
| `logName`  | `string` | **Yes** | None   | Module name                  |
| `logLevel` | `string` | **Yes** | None   | Log level, such as `INFO` or `DEBUG` |

#### Response Data

| Name    | Type     | Description   |
|--------|----------|------|
| `data` | `string` | Operation result |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/cs/ops/log' -d "logName=config-server&logLevel=DEBUG"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "Log level updated successfully! Module: com.alibaba.nacos, Log Level: DEBUG"
}
```

### 3.20. Execute Derby Database Operations

#### Description

Execute query operations on the Derby database. Only `SELECT` statements are supported.

> **Note:** This API requires the `nacos.config.derby.ops.enabled` configuration to be enabled and can be used only when the database is `Derby`. It is provided only for maintainers to troubleshoot Derby database data issues.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/cs/ops/derby`

#### Request Parameters

| Name   | Type     | Required  | Default | Description       |
|-------|----------|-------|-----|----------|
| `sql` | `string` | **Yes** | None   | SQL query statement |

#### Response Data

| Name    | Type                        | Description   |
|--------|-----------------------------|------|
| `data` | `array` | Query result. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/ops/derby?sql=SELECT%20*%20FROM%20config_info'
```

* Response example

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

If the feature is not enabled, the response is as follows:

```json
{
  "code": 30000,
  "data": null,
  "message": "Derby ops is disabled, please set `nacos.config.derby.ops.enabled=true` to enabled this feature."
}
```

### 3.21. Import Derby Database Data

#### Description

Import data from an external data source into the Derby database.

> **Note:** This API requires the `nacos.config.derby.ops.enabled` configuration to be enabled and can be used only when the database is `Derby`. It is provided only for maintainers to troubleshoot Derby database data issues.

#### Since

`3.0.0`

#### Request Method

`POST`

The request body type is `multipart/form-data`, and parameters are placed in the request body.

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/cs/ops/derby/import`

#### Request Parameters

| Name    | Type            | Required | Default | Description           |
|--------|-----------------|------|-----|--------------|
| `file` | `MultipartFile` | No    | None   | Import file (SQL file). |

#### Response Data

| Name    | Type     | Description     |
|--------|----------|--------|
| `data` | `string` | Import result information |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/cs/ops/derby/import' \
-H 'Content-Type: multipart/form-data' \
-F 'file=@data.sql'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "Data imported successfully!"
}
```

### 3.22. Get Client Subscription Information

#### Description

Get subscription config information of a specified IP client.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/cs/listener`

#### Request Parameters

| Name           | Type      | Required  | Default      | Description         |
|---------------|-----------|-------|----------|------------|
| `ip`          | `string` | **Yes** | None        | Client IP address  |
| `all`         | `boolean` | No     | `false`  | Whether to return all config information |
| `namespaceId` | `string` | No     | `public` | Namespace ID     |
| `aggregation` | `boolean` | No     | `true`   | Whether to aggregate from other nodes  |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name               | Type                  | Description                                                                            |
|-------------------|-----------------------|-------------------------------------------------------------------------------|
| `queryType`       | `string` | Subscriber query type. This API uses `ip`.                                                             |
| `listenersStatus` | `map<string, string>` | Subscriber list. The key is subscribed config information in the format `dataId` + `groupName` + `namespaceId`, and the value is the MD5 value of the current config subscribed by the subscriber. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/listener?ip=127.0.0.1&namespaceId=public'
```

* Response example

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

### 3.23. Get Cluster Client Metrics

#### Description

Get config metric information of a specified IP client in the cluster.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/cs/metrics/cluster`

#### Request Parameters

| **Name**       | **Type** | **Required** | **Default**  | **Description**    |
|---------------|----------|----------|----------|-----------|
| `ip`          | `string` | **Yes**    | None        | Client IP address |
| `dataId`      | `string` | No        | None        | Config ID      |
| `groupName`   | `string` | No        | None        | Group name      |
| `namespaceId` | `string` | No        | `public` | Namespace ID    |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                                            | Type      | Description     |
|------------------------------------------------|-----------|----------|
| `data`                                         |           | Service information     |
| `data.{namespaceId}.isFixedServer`             | `boolean` | Whether this is a fixed server  |
| `data.{namespaceId}.snapshotDir`               | `string` | Snapshot directory path   |
| `data.{namespaceId}.clientVersion`             | `string` | Client version    |
| `data.{namespaceId}.serverUrls`                | `string` | Server URL list |
| `data.{namespaceId}.listenConfigSize`          | `integer` | Listen config size   |
| `data.{namespaceId}.metricValues.cacheData`    | `string` | MD5 value of cached data |
| `data.{namespaceId}.metricValues.snapshotData` | `string` | MD5 value of snapshot data |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/metrics/cluster?ip=127.0.0.1&dataId=example&groupName=DEFAULT_GROUP&namespaceId=public'
```

* Response example

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

### 3.24. Get Local Client Metrics

#### Description

Get metric information of a specified IP client on the local machine.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/cs/metrics/ip`

#### Request Parameters

| **Name**       | **Type** | **Required** | **Default**  | **Description**    |
|---------------|----------|----------|----------|-----------|
| `ip`          | `string` | **Yes**    | None        | Client IP address |
| `dataId`      | `string` | No        | None        | Config ID      |
| `groupName`   | `string` | No        | None        | Group name      |
| `namespaceId` | `string` | No        | `public` | Namespace      |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                                            | Type      | Description     |
|------------------------------------------------|-----------|----------|
| `data`                                         |           | Service information     |
| `data.{namespaceId}.isFixedServer`             | `boolean` | Whether this is a fixed server  |
| `data.{namespaceId}.snapshotDir`               | `string` | Snapshot directory path   |
| `data.{namespaceId}.clientVersion`             | `string` | Client version    |
| `data.{namespaceId}.serverUrls`                | `string` | Server URL list |
| `data.{namespaceId}.listenConfigSize`          | `integer` | Listen config size   |
| `data.{namespaceId}.metricValues.cacheData`    | `string` | MD5 value of cached data |
| `data.{namespaceId}.metricValues.snapshotData` | `string` | MD5 value of snapshot data |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/metrics/ip?ip=127.0.0.1&dataId=example&groupName=DEFAULT_GROUP&namespaceId=public'
```

* Response example

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

### 3.25. Update Config Metadata

#### Description

Use this API to update config metadata. Only `Description` and tags can be updated.

#### Since

`3.1.0`

#### Request Method

`PUT`

#### Authorization

A user identity with `namespace write` permission is required.

#### Request URL

`/nacos/v3/admin/cs/config/metadata`

#### Request Parameters

| **Name**       | **Type** | **Required** | **Default**  | **Description** |
|---------------|----------|----------|----------|--------|
| `dataId`      | `string` | **Yes**    | None        | Config ID   |
| `groupName`   | `string` | **Yes**    | None        | Group name   |
| `namespaceId` | `string` | No        | `public` | Namespace   |
| `desc`        | `string` | No        | null     | New config description |
| `configTags`  | `string` | No        | null     | New config tags |

#### Response Data

The response body follows the [Nacos open API unified response format](#01-unified-response-body-format). The table below describes only the response parameters in the `data` field.

| Name    | Type      | Description   |
|--------|-----------|------|
| `data` | `boolean` | Operation result |

#### Examples

* Request example

```shell
curl -X PUT '127.0.0.1:8848/v3/admin/cs/config/metadata' \
-d 'namespaceId=public' \
-d 'groupName=DEFAULT_GROUP' \
-d 'dataId=test' \
-d 'desc=testDesc' \
-d 'configTags=customTag'
```
* Response example

```json
{
  "code" : 0,
  "message" : "success",
  "data" : true
}
```

### 3.26. Get Gray Configuration

#### Description

This interface retrieves the details of a specified gray configuration.

#### Since

`3.2.2`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/cs/config/gray`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID. Defaults to `public` when omitted. |
| `groupName` | `string` | **Yes** | Configuration group name. |
| `dataId` | `string` | **Yes** | Configuration ID. |
| `grayName` | `string` | **Yes** | Gray configuration name. |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.dataId | `string` | Configuration ID. |
| data.groupName | `string` | Configuration group name. |
| data.namespaceId | `string` | Namespace ID. |
| data.content | `string` | Gray configuration content. |
| data.grayName | `string` | Gray configuration name. |
| data.grayRule | `string` | Gray matching rule. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/gray?namespaceId=public&groupName=DEFAULT_GROUP&dataId=example&grayName=gray'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 3.27. Publish Gray Configuration

#### Description

This interface publishes a gray configuration using tagv2 gray matching rules.

#### Since

`3.2.2`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/cs/config/gray`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID. Defaults to `public` when omitted. |
| `groupName` | `string` | **Yes** | Configuration group name. |
| `dataId` | `string` | **Yes** | Configuration ID. |
| `content` | `string` | **Yes** | Gray configuration content. |
| `grayName` | `string` | **Yes** | Gray configuration name. |
| `grayType` | `string` | No | Gray rule type. |
| `grayMatchRuleExp` | `string` | **Yes** | Gray matching rule expression. |
| `grayVersion` | `string` | **Yes** | Gray version. |
| `grayPriority` | `integer` | No | Gray rule priority. |
| `type` | `string` | No | Configuration type. |
| `srcUser` | `string` | No | Operator username. |
| `encryptedDataKey` | `string` | No | Data key for encrypted configuration content. |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data | `boolean` | Whether the gray configuration was published successfully. |

#### Examples

* Request example

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

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 3.28. Delete Gray Configuration

#### Description

This interface deletes a specified gray configuration.

#### Since

`3.2.2`

#### Request Method

`DELETE`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/cs/config/gray`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID. Defaults to `public` when omitted. |
| `groupName` | `string` | **Yes** | Configuration group name. |
| `dataId` | `string` | **Yes** | Configuration ID. |
| `grayName` | `string` | **Yes** | Gray configuration name. |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data | `boolean` | Whether the gray configuration was deleted successfully. |

#### Examples

* Request example

```shell
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/cs/config/gray?namespaceId=public&groupName=DEFAULT_GROUP&dataId=example&grayName=gray'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

## 4. MCP Management

### 4.1. Query MCP Service List

#### Description

Use this API to query the list of MCP services hosted on Nacos.

#### Since

`3.0.1`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ai/mcp/list`

#### Request Parameters

| Name           | Type     | Required  | Description                                                     |
|---------------|----------|-------|--------------------------------------------------------|
| `pageNo` | `integer` | **Yes** | Current page. Defaults to `1`. |
| `pageSize` | `integer` | **Yes** | Page size. Defaults to `20`; maximum value is `500`. |
| `namespaceId` | `string` | No | Namespace ID of the MCP service. Defaults to `public`. |
| `mcpName` | `string` | No | Name pattern of the MCP service. If empty, all MCP services are queried. When `search` is `blur`, `*` can be used for fuzzy search. |
| `search` | `string` | No | Search mode: `blur` or `accurate`. Defaults to `blur`. |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                                           | Type                  | Description                                                                                              |
|-----------------------------------------------|-----------------------|-------------------------------------------------------------------------------------------------|
| `totalCount`                                  | `integer` | Total number of services that match the criteria.                                                                                     |
| `pageNumber`                                  | `integer` | Current page number, starting from `1`.                                                                                    |
| `pagesAvailable`                              | `integer` | Available pages.                                                                                           |
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

The `VersionDetail` structure is as follows:

| Name            | Type      | Description               |
|----------------|-----------|------------------|
| `version`      | `string` | MCP service version.       |
| `release_date` | `string` | MCP service release time.  |
| `is_latest`    | `boolean` | Whether this is the latest version of the MCP service. |

#### Examples

* Request example

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/admin/ai/mcp/list?pageNo=1&pageSize=100&namespaceId=public&search=blur'
```
* Response example

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

### 4.2. Query MCP Service Details

#### Description

Use this API to query details of a specified MCP service hosted on Nacos.

#### Since

`3.0.1`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ai/mcp`

#### Request Parameters

| Name           | Type     | Required  | Description                                       |
|---------------|----------|-------|------------------------------------------|
| `namespaceId` | `string` | No     | Namespace ID of the MCP service. Defaults to `public`.                 |
| `mcpId`       | `string` | No     | MCP service ID. It is usually a UUID. Either `mcpId` or `mcpName` must be provided, and passing this value is recommended. |
| `mcpName`     | `string` | No     | Name pattern of the MCP service. Either `mcpName` or `mcpId` must be provided. Passing `mcpId` is recommended.    |
| `version`     | `string` | No     | MCP service version. If not specified, the latest version is returned.                      |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                  | Type                  | Description                                                                                              |
|----------------------|-----------------------|-------------------------------------------------------------------------------------------------|
| `id`                 | `string` | MCP service ID. It is usually a UUID.                                                                               |
| `name`               | `string` | MCP service name.                                                                                         |
| `namespaceId`        | `string` | Namespace ID to which the MCP service belongs.                                                                                 |
| `protocol`           | `string` | MCP protocol, such as `stdio`, `sse`, `streamable`, `http`, or `dubbo`.                                             |
| `frontProtocol`      | `string` | Frontend exposure protocol of MCP. It is usually used by a protocol converter such as a gateway. If no converter is used, it is the same as `protocol`, such as `stdio`, `sse`, `streamable`, `http`, or `dubbo`. |
| `description`        | `string` | MCP service description.                                                                                       |
| `repository`         | `string` | Repository of the MCP service.                                                                                     |
| `versionDetail`      | `object`              | Queried version information of the MCP service.                                                        |
| `localServerConfig`  | `map<string, object>` | Startup information for a local MCP service when the MCP service type is **stdio**.                    |
| `remoteServerConfig` | `object`              | Remote service information when the MCP service type is **not stdio**.                                |
| `enabled`            | `boolean` | Whether the MCP service is enabled.                                                                                      |
| `capabilities`       | `array`               | Capability types supported by the MCP service, such as `TOOL`, `PROMPT`, and `RESOURCE`.              |
| `backendEndpoints`   | `array`               | Backend endpoint details when the MCP service type is **not stdio**.                                  |
| `toolSpec`           | `map<string, object>` | Tool details when the MCP service supports the `TOOL` capability.                                    |
| `allVersions`        | `array`               | All version details of the MCP service.                                                              |

The `VersionDetail` structure is as follows:

| Name            | Type      | Description               |
|----------------|-----------|------------------|
| `version`      | `string` | MCP service version.       |
| `release_date` | `string` | MCP service release time.  |
| `is_latest`    | `boolean` | Whether this is the latest version of the MCP service. |

#### Examples

* Request example

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/admin/ai/mcp?namespaceId=public&mcpName=test&mcpId=d7a64724-a556-4fe4-82fa-e806d43e00dc'
```
* Response example

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

### 4.3. Update MCP Service

#### Description

Use this API to update an MCP service hosted on Nacos.

#### Since

`3.0.1`

#### Request Method

`PUT`

#### Authorization

Requires `write` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ai/mcp`

#### Request Parameters

| Name                     | Type         | Required  | Description                             |
|-------------------------|--------------|-------|--------------------------------|
| `namespaceId` | `string` | No | Namespace ID of the MCP service. Defaults to `public`. |
| `serverSpecification` | `string` | **Yes** | MCP service description details |
| `toolSpecification` | `string` | No | MCP service tool description details |
| `endpointSpecification` | `string` | No | Remote service endpoint details of the MCP service. This takes effect only for non-`stdio` protocols. |
| `overrideExisting` | `boolean` | No | Whether to overwrite the original `endpointSpecification` when updating the MCP service. This takes effect only for non-`stdio` protocols. |
| `latest` | `boolean` | No | - |

The details of the `serverSpecification`, `toolSpecification`, and `endpointSpecification` parameters are as follows:

> serverSpecification

| Name                  | Type                  | Description                                                                                              |
|----------------------|-----------------------|-------------------------------------------------------------------------------------------------|
| `id`                 | `string` | MCP service ID. It is usually a UUID and must be provided to locate the MCP service to update.                                                            |
| `name`               | `string` | MCP service name.                                                                                         |
| `protocol`           | `string` | MCP protocol, such as `stdio`, `sse`, `streamable`, `http`, or `dubbo`.                                             |
| `frontProtocol`      | `string` | Frontend exposure protocol of MCP. It is usually used by a protocol converter such as a gateway. If no converter is used, it is the same as `protocol`, such as `stdio`, `sse`, `streamable`, `http`, or `dubbo`. |
| `description`        | `string` | MCP service description.                                                                                       |
| `repository`         | `string` | Repository of the MCP service.                                                                                     |
| `versionDetail`      | `object`              | MCP service version information.                                                                      |
| `version`            | `string` | Simple version information of the MCP service, mainly used for compatibility. If `versionDetail` is set, this field is invalid.                                               |
| `localServerConfig`  | `map<string, object>` | Startup information for a local MCP service when the MCP service type is **stdio**.                    |
| `remoteServerConfig` | `object`              | Remote service information when the MCP service type is **not stdio**.                                |
| `enabled`            | `boolean` | Whether the MCP service is enabled.                                                                                      |
| `capabilities`       | `array`               | Capability types supported by the MCP service, such as `TOOL`, `PROMPT`, and `RESOURCE`.              |

The `VersionDetail` structure is as follows:

| Name            | Type      | Description               |
|----------------|-----------|------------------|
| `version`      | `string` | MCP service version number.       |
| `release_date` | `string` | MCP service version release time.    |
| `is_latest`    | `boolean` | Whether this MCP service version is the latest version. |

> toolSpecification

| Name               | Type                       | Description                                                                                      |
|-------------------|----------------------------|-----------------------------------------------------------------------------------------|
| `tools`           | `array`                   | Tool list provided by the MCP Server. See the standard MCP protocol definition of MCP Tool. |
| `toolsMeta`       | `map<string, object>`     | Extra metadata for tools provided by the MCP Server. This can extend information not defined in the standard MCP protocol. The key is the `name` of `McpTool`, and the value is the extended metadata. |
| `securitySchemes` | `array`                   | MCP tool security schemes. See the standard MCP protocol. |

The `McpTool` structure is as follows:

| Name           | Type                  | Description                                            |
|---------------|-----------------------|-----------------------------------------------|
| `name`        | `string` | MCP tool name                                     |
| `description` | `string` | MCP tool description                                     |
| `inputSchema` | `map<string, object>` | MCP tool input schema. See the standard MCP protocol; it mainly includes type, required flag, and description. |

The `McpToolMeta` structure is as follows:

| Name             | Type                  | Description                             |
|-----------------|-----------------------|--------------------------------|
| `invokeContext` | `map<string, string>` | Context information used when invoking the MCP tool, such as the backend service `Path`. |
| `enabled`       | `boolean` | Whether the MCP tool is enabled.                     |
| `templates`     | `map<string, string>` | Template information of the MCP tool. It is used to map parameters during protocol conversion.   |

The `SecurityScheme` structure is as follows:

| Name                 | Type     | Description                                                                                |
|---------------------|----------|-----------------------------------------------------------------------------------|
| `id`                | `string` | Security scheme ID. It is used and referenced by MCP tools.                                                            |
| `type`              | `string` | Security scheme type. Possible values include `http`, `apiKey`, `localEnv`, or other custom extensions.                                |
| `scheme`            | `string` | Security scheme subtype. Used when `type` is `http`. Possible values include `basic` or `bearer`.                       |
| `in`                | `string` | Security scheme location. Possible values include `query` and `header`.                                                   |
| `name`              | `string` | Security scheme name. Used when `type` is `apiKey` or `localEnv`, such as the key name of `apiKey` or the environment variable name of `localEnv`. |
| `defaultCredential` | `string` | Default credential used when no credential is provided in the configuration parameters. Optional.                                                             |

> endpointSpecification

| Name    | Type                  | Description                                                                                                                               |
|--------|-----------------------|----------------------------------------------------------------------------------------------------------------------------------|
| `type` | `string` | Backend service type of the MCP endpoint. Optional values are `REF` and `DIRECT`.                                                                                           |
| `data` | `map<string, string>` | Actual backend service data of the MCP endpoint. The parameters vary by `type`. For `REF`, pass `namespaceId`, `groupName`, and `serviceName`; for `DIRECT`, pass `address` and `port`. |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name    | Type     | Description         |
|--------|----------|------------|
| `data` | `string` | MCP service update result. |

#### Examples

* Request example

```shell
curl -X PUT '127.0.0.1:8848/nacos/v3/admin/ai/mcp' \
-d 'namespaceId=public' \
-d 'mcpName=test' \
-d 'serverSpecification={"protocol":"stdio","frontProtocol":"stdio","name":"test","id":"d7a64724-a556-4fe4-82fa-e806d43e00dc","description":"ceshi","versionDetail":{"version":"1.0.0"},"enabled":true,"localServerConfig":{"test":{}}}'
```
* Response example

```json
{
  "code" : 0,
  "message" : "success",
  "data" : "ok"
}
```

### 4.4. Create MCP Service

#### Description

Use this API to create an MCP service hosted on Nacos. The service can be converted from an existing API or come from the MCP marketplace.

#### Since

`3.0.1`

#### Request Method

`POST`

#### Authorization

Requires `write` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ai/mcp`

#### Request Parameters

| Name                     | Type         | Required  | Description                             |
|-------------------------|--------------|-------|--------------------------------|
| `namespaceId` | `string` | No | Namespace ID of the MCP service. Defaults to `public`. |
| `serverSpecification` | `string` | **Yes** | MCP service description details |
| `toolSpecification` | `string` | No | MCP service tool description details |
| `endpointSpecification` | `string` | No | Remote service endpoint details of the MCP service. This takes effect only for non-`stdio` protocols. |

The details of the `serverSpecification`, `toolSpecification`, and `endpointSpecification` parameters are as follows:

> serverSpecification

| Name                  | Type                  | Description                                                                                              |
|----------------------|-----------------------|-------------------------------------------------------------------------------------------------|
| `id`                 | `string` | MCP service ID. It is usually a UUID. It does not need to be provided because the system automatically generates it.                                                                   |
| `name`               | `string` | MCP service name.                                                                                         |
| `protocol`           | `string` | MCP protocol, such as `stdio`, `sse`, `streamable`, `http`, or `dubbo`.                                             |
| `frontProtocol`      | `string` | Frontend exposure protocol of MCP. It is usually used by a protocol converter such as a gateway. If no converter is used, it is the same as `protocol`, such as `stdio`, `sse`, `streamable`, `http`, or `dubbo`. |
| `description`        | `string` | MCP service description.                                                                                       |
| `repository`         | `string` | Repository of the MCP service.                                                                                     |
| `versionDetail`      | `object`              | MCP service version information.                                                                      |
| `version`            | `string` | Simple version information of the MCP service, mainly used for compatibility. If `versionDetail` is set, this field is invalid.                                               |
| `localServerConfig`  | `map<string, object>` | Startup information for a local MCP service when the MCP service type is **stdio**.                    |
| `remoteServerConfig` | `object`              | Remote service information when the MCP service type is **not stdio**.                                |
| `enabled`            | `boolean` | Whether the MCP service is enabled.                                                                                      |
| `capabilities`       | `array`               | Capability types supported by the MCP service, such as `TOOL`, `PROMPT`, and `RESOURCE`.              |

The `VersionDetail` structure is as follows:

| Name            | Type      | Description               |
|----------------|-----------|------------------|
| `version`      | `string` | MCP service version number.       |
| `release_date` | `string` | MCP service version release time.    |
| `is_latest`    | `boolean` | Whether this MCP service version is the latest version. |

> toolSpecification

| Name               | Type                       | Description                                                                                      |
|-------------------|----------------------------|-----------------------------------------------------------------------------------------|
| `tools`           | `array`                   | Tool list provided by the MCP Server. See the standard MCP protocol definition of MCP Tool. |
| `toolsMeta`       | `map<string, object>`     | Extra metadata for tools provided by the MCP Server. This can extend information not defined in the standard MCP protocol. The key is the `name` of `McpTool`, and the value is the extended metadata. |
| `securitySchemes` | `array`                   | MCP tool security schemes. See the standard MCP protocol. |

The `McpTool` structure is as follows:

| Name           | Type                  | Description                                            |
|---------------|-----------------------|-----------------------------------------------|
| `name`        | `string` | MCP tool name                                     |
| `description` | `string` | MCP tool description                                     |
| `inputSchema` | `map<string, object>` | MCP tool input schema. See the standard MCP protocol; it mainly includes type, required flag, and description. |

The `McpToolMeta` structure is as follows:

| Name             | Type                  | Description                             |
|-----------------|-----------------------|--------------------------------|
| `invokeContext` | `map<string, string>` | Context information used when invoking the MCP tool, such as the backend service `Path`. |
| `enabled`       | `boolean` | Whether the MCP tool is enabled.                     |
| `templates`     | `map<string, string>` | Template information of the MCP tool. It is used to map parameters during protocol conversion.   |

The `SecurityScheme` structure is as follows:

| Name                 | Type     | Description                                                                                |
|---------------------|----------|-----------------------------------------------------------------------------------|
| `id`                | `string` | Security scheme ID. It is used and referenced by MCP tools.                                                            |
| `type`              | `string` | Security scheme type. Possible values include `http`, `apiKey`, `localEnv`, or other custom extensions.                                |
| `scheme`            | `string` | Security scheme subtype. Used when `type` is `http`. Possible values include `basic` or `bearer`.                       |
| `in`                | `string` | Security scheme location. Possible values include `query` and `header`.                                                   |
| `name`              | `string` | Security scheme name. Used when `type` is `apiKey` or `localEnv`, such as the key name of `apiKey` or the environment variable name of `localEnv`. |
| `defaultCredential` | `string` | Default credential used when no credential is provided in the configuration parameters. Optional.                                                             |

> endpointSpecification

| Name    | Type                  | Description                                                                                                                               |
|--------|-----------------------|----------------------------------------------------------------------------------------------------------------------------------|
| `type` | `string` | Backend service type of the MCP endpoint. Optional values are `REF` and `DIRECT`.                                                                                           |
| `data` | `map<string, string>` | Actual backend service data of the MCP endpoint. The parameters vary by `type`. For `REF`, pass `namespaceId`, `groupName`, and `serviceName`; for `DIRECT`, pass `address` and `port`. |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name    | Type     | Description         |
|--------|----------|------------|
| `data` | `string` | ID of the newly created MCP service. |

#### Examples

* Request example

```shell
curl -X POST '127.0.0.1:8848/nacos/v3/admin/ai/mcp' \
-d 'namespaceId=public' \
-d 'mcpName=test' \
-d 'serverSpecification={"protocol":"stdio","frontProtocol":"stdio","name":"test","id":"","description":"ceshi","versionDetail":{"version":"1.0.0"},"enabled":true,"localServerConfig":{"test":{}}}'
```
* Response example

```json
{
  "code" : 0,
  "message" : "success",
  "data" : "58e5b430-b16d-4f28-9334-edb64303dc23"
}
```

### 4.5. Delete MCP Service

#### Description

Use this API to delete an MCP service hosted on Nacos.

#### Since

`3.0.1`

#### Request Method

`DELETE`

#### Authorization

Requires `write` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ai/mcp`

#### Request Parameters

| Name           | Type     | Required  | Description                                       |
|---------------|----------|-------|------------------------------------------|
| `namespaceId` | `string` | No     | Namespace ID of the MCP service. Defaults to `public`.                 |
| `mcpId`       | `string` | No     | MCP service ID. It is usually a UUID. Either `mcpId` or `mcpName` must be provided, and passing this value is recommended. |
| `mcpName`     | `string` | No     | Name pattern of the MCP service. Either `mcpName` or `mcpId` must be provided. Passing `mcpId` is recommended.    |
| `version`     | `string` | No     | MCP service version. If not specified, the latest version is used.                       |

#### Response Data

The response body follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name    | Type     | Description         |
|--------|----------|------------|
| `data` | `string` | MCP service deletion result. |

#### Examples

* Request example

```shell
curl -X DELETE '127.0.0.1:8848/nacos/v3/admin/ai/mcp?namespaceId=public&mcpName=test&mcpId=d7a64724-a556-4fe4-82fa-e806d43e00dc'
```
* Response example

```json
{
   "code" : 0,
   "message" : "success",
   "data" : "ok"
}
```

## 5. A2A Registry

### 5.1. Query Versions of a Specified AgentCard

#### Description

Use this API to query the version list of a specified AgentCard hosted on Nacos.

#### Since

`3.1.0`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ai/a2a/version/list`

#### Request Parameters

| Name           | Type     | Required  | Description                          |
|---------------|----------|-------|-----------------------------|
| `namespaceId` | `string` | No     | Namespace to which the AgentCard belongs. Defaults to `public`. |
| `agentName`   | `string` | **Yes** | AgentCard name                |

#### Response Data

The response body follows the [Nacos open API unified response format](#01-unified-response-body-format). The table below describes only the response parameters in the `data` field.

| Name                   | Type      | Description              |
|-----------------------|-----------|-----------------|
| `data`[i].`version`   | `string` | AgentCard version number.  |
| `data`[i].`createdAt` | `string` | Creation time of this version.       |
| `data`[i].`updatedAt` | `string` | Last update time of this version.     |
| `data`[i].`latest`    | `boolean` | Whether this version is marked as the latest published version. |

#### Examples

* Request example

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/admin/ai/a2a/version/list?namespaceId=public&agentName=GeoSpatial+Route+Planner+Agent'
```
* Response example

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

### 5.2. Query AgentCard List

#### Description

Use this API to query the list of AgentCards hosted on Nacos.

#### Since

`3.1.0`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ai/a2a/list`

#### Request Parameters

| Name           | Type     | Required  | Description                                              |
|---------------|----------|-------|-------------------------------------------------|
| `pageNo` | `integer` | **Yes** | Current page. Defaults to `1`. |
| `pageSize` | `integer` | **Yes** | Page size. Defaults to `100`. |
| `namespaceId` | `string` | No | Namespace ID of the AgentCard. Defaults to `public`. |
| `agentName` | `string` | No | AgentCard name. If empty, all AgentCards are queried. |
| `search` | `string` | No | blur or accurate |

#### Response Data

The response body follows the [Nacos open API unified response format](#01-unified-response-body-format). The table below describes only the response parameters in the `data` field.

| Name                                     | Type                       | Description                                                                                                     |
|-----------------------------------------|----------------------------|--------------------------------------------------------------------------------------------------------|
| `totalCount`                            | `integer` | Total number of services that match the criteria.                                                                                            |
| `pageNumber`                            | `integer` | Current page number, starting from `1`.                                                                                           |
| `pagesAvailable`                        | `integer` | Available pages.                                                                                                  |
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

The `AgentVersionDetail` content is as follows:

| Name         | Type      | Description              |
|-------------|-----------|-----------------|
| `version`   | `string` | AgentCard version. |
| `createdAt` | `string` | Creation time of this version. |
| `updatedAt` | `string` | Last update time of this version. |
| `latest`    | `boolean` | Whether this version is marked as the latest published version. |

#### Examples

* Request example

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/admin/ai/a2a/list?pageNo=1&pageSize=100&namespaceId=public&search=blur'
```
* Response example

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

### 5.3. Query AgentCard Details

#### Description

Use this API to query details of a specified AgentCard hosted on Nacos.

#### Since

`3.1.0`

#### Request Method

`GET`

#### Authorization

Requires `read` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ai/a2a`

#### Request Parameters

| Name                | Type     | Required  | Description                                                                                 |
|--------------------|----------|-------|------------------------------------------------------------------------------------|
| `namespaceId`      | `string` | No     | Namespace to which the AgentCard belongs. Defaults to `public`.                                                        |
| `agentName`        | `string` | **Yes** | AgentCard name                                                                       |
| `version`          | `string` | No     | AgentCard version. If empty, details of the latest version are returned.                                                          |
| `registrationType` | `string` | No     | Default registration type of the AgentCard. Optional values are `URL` and `SERVICE`. If not specified, the `url` is generated based on the default `registrationType` of this AgentCard. |

#### Response Data

The response body follows the [Nacos open API unified response format](#01-unified-response-body-format). The table below describes only the response parameters in the `data` field.

| Name                                 | Type                              | Description                                                                                                       |
|-------------------------------------|-----------------------------------|----------------------------------------------------------------------------------------------------------|
| `protocolVersion`                   | `string` | A2A protocol version of the AgentCard.                                                                                       |
| `name`                              | `string` | AgentCard name.                                                                                            |
| `description`                       | `string` | AgentCard description.                                                                                            |
| `version`                           | `string` | AgentCard version number.                                                                                           |
| `iconUrl`                           | `string` | AgentCard icon URL.                                                                                       |
| `capabilities`                      | `object`                         | AgentCard capabilities, matching [A2A standard capabilities](https://a2a-protocol.org/latest/specification/#552-agentcapabilities-object). |
| `skills`                            | `array`                          | AgentCard skill list, matching [A2A standard skill](https://a2a-protocol.org/latest/specification/#554-agentskill-object). |
| `url`                               | `string` | Default access URL of the AgentCard.                                                                                      |
| `preferredTransport`                | `string` | Transport protocol of the default access URL of the AgentCard. It should be `JSONRPC`, `GRPC`, or `HTTP+JSON`.                                                  |
| `additionalInterfaces`              | `array`                          | All accessible interfaces of the AgentCard, matching the [A2A standard](https://a2a-protocol.org/latest/specification/#555-agentinterface-object). |
| `provider`                          | `object`                         | AgentCard provider information, matching the [A2A standard](https://a2a-protocol.org/latest/specification/#551-agentprovider-object). |
| `documentationUrl`                  | `string` | Documentation URL of the AgentCard.                                                                                        |
| `securitySchemes`                   | `map<string, object>`             | AgentCard security scheme definitions, matching the [A2A standard](https://a2a-protocol.org/latest/specification/#553-securityscheme-object). |
| `security`                          | `array`                          | All security requirement objects of the AgentCard. |
| `defaultInputModes`                 | `array`                          | All default input modes of the AgentCard. |
| `defaultOutputModes`                | `array`                          | All default output modes of the AgentCard. |
| `supportsAuthenticatedExtendedCard` | `string` | Whether the AgentCard supports authenticated extended cards.                                                                                     |
| `registrationType`                  | `string` | Default registration type of the AgentCard. Optional values are `URL` and `SERVICE`.                                                                      |
| `latestVersion`                     | `string` | Whether the current AgentCard version is the latest version.                                                                                    |

#### Examples

* Request example

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/admin/ai/a2a?namespaceId=public&agentName=GeoSpatial+Route+Planner+Agent&version=1.0.0&registrationType=SERVICE'
```
* Response example

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

### 5.4. Update AgentCard

#### Description

Use this API to update an AgentCard hosted on Nacos.

#### Since

`3.1.0`

#### Request Method

`PUT`

#### Authorization

Requires `write` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ai/a2a`

#### Request Parameters

| Name                | Type        | Required  | Description                                                                                                              |
|--------------------|-------------|-------|-----------------------------------------------------------------------------------------------------------------|
| `namespaceId` | `string` | No | Namespace to which the AgentCard belongs. Defaults to `public`. |
| `agentCard` | `string` | **Yes** | Complete AgentCard object. For details, see [Standard AgentCard](https://a2a-protocol.org/latest/specification/#55-agentcard-object-structure). |
| `registrationType` | `string` | No | Default registration type of the AgentCard. Optional values are `URL` and `SERVICE`. If not specified, the `url` is generated based on the default `registrationType` of this AgentCard. |
| `setAsLatest` | `boolean` | No | Whether to set this version as the latest published version. Defaults to `false`. |

#### Response Data

The response body follows the [Nacos open API unified response format](#01-unified-response-body-format). The table below describes only the response parameters in the `data` field.

| Name    | Type     | Description               |
|--------|----------|------------------|
| `data` | `string` | AgentCard service update result. |

#### Examples

* Request example

```shell
curl -X PUT '127.0.0.1:8848/nacos/v3/admin/ai/a2a' \
-d 'namespaceId=public' \
-d 'agentCard={"protocolVersion":"0.2.9","name":"GeoSpatial Route Planner Agent","description":"Provides advanced route planning, traffic analysis, and custom map generation services. This agent can calculate optimal routes, estimate travel times considering real-time traffic, and create personalized maps with points of interest.","url":"https://georoute-agent.example.com/a2a/v1","preferredTransport":"JSONRPC","additionalInterfaces":[{"url":"https://georoute-agent.example.com/a2a/v1","transport":"JSONRPC"},{"url":"https://georoute-agent.example.com/a2a/grpc","transport":"GRPC"},{"url":"https://georoute-agent.example.com/a2a/json","transport":"HTTP+JSON"}],"provider":{"organization":"Example Geo Services Inc.","url":"https://www.examplegeoservices.com"},"iconUrl":"https://georoute-agent.example.com/icon.png","version":"1.2.0","documentationUrl":"https://docs.examplegeoservices.com/georoute-agent/api","capabilities":{"streaming":true,"pushNotifications":true,"stateTransitionHistory":false},"securitySchemes":{"google":{"type":"openIdConnect","openIdConnectUrl":"https://accounts.google.com/.well-known/openid-configuration"}},"security":[{"google":["openid","profile","email"]}],"defaultInputModes":["application/json","text/plain"],"defaultOutputModes":["application/json","image/png"],"skills":[{"id":"route-optimizer-traffic","name":"Traffic-Aware Route Optimizer","description":"Calculates the optimal driving route between two or more locations, taking into account real-time traffic conditions, road closures, and user preferences (e.g., avoid tolls, prefer highways).","tags":["maps","routing","navigation","directions","traffic"],"examples":["Plan a route from '\''1600 Amphitheatre Parkway, Mountain View, CA'\'' to '\''San Francisco International Airport'\'' avoiding tolls.","{\"origin\": {\"lat\": 37.422, \"lng\": -122.084}, \"destination\": {\"lat\": 37.7749, \"lng\": -122.4194}, \"preferences\": [\"avoid_ferries\"]}"],"inputModes":["application/json","text/plain"],"outputModes":["application/json","application/vnd.geo+json","text/html"]},{"id":"custom-map-generator","name":"Personalized Map Generator","description":"Creates custom map images or interactive map views based on user-defined points of interest, routes, and style preferences. Can overlay data layers.","tags":["maps","customization","visualization","cartography"],"examples":["Generate a map of my upcoming road trip with all planned stops highlighted.","Show me a map visualizing all coffee shops within a 1-mile radius of my current location."],"inputModes":["application/json"],"outputModes":["image/png","image/jpeg","application/json","text/html"]}],"supportsAuthenticatedExtendedCard":true,"signatures":[{"protected":"eyJhbGciOiJFUzI1NiIsInR5cCI6IkpPU0UiLCJraWQiOiJrZXktMSIsImprdSI6Imh0dHBzOi8vZXhhbXBsZS5jb20vYWdlbnQvandrcy5qc29uIn0","signature":"QFdkNLNszlGj3z3u0YQGt_T9LixY3qtdQpZmsTdDHDe3fXV9y9-B3m2-XgCpzuhiLt8E0tV6HXoZKHv4GtHgKQ"}]}' \
-d 'registrationType=SERVICE' \
-d 'setAsLatest=true'
```
* Response example

```json
{
  "code" : 0,
  "message" : "success",
  "data" : "ok"
}
```

### 5.5. Create AgentCard

#### Description

Use this API to create an AgentCard hosted on Nacos.

#### Since

`3.1.0`

#### Request Method

`POST`

#### Authorization

Requires `write` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ai/a2a`

#### Request Parameters

| Name                | Type        | Required  | Description                                                                                                              |
|--------------------|-------------|-------|-----------------------------------------------------------------------------------------------------------------|
| `namespaceId` | `string` | No | Namespace to which the AgentCard belongs. Defaults to `public`. |
| `agentCard` | `string` | **Yes** | Complete AgentCard object. For details, see [Standard AgentCard](https://a2a-protocol.org/latest/specification/#55-agentcard-object-structure). |
| `registrationType` | `string` | No | Default registration type of the AgentCard. Optional values are `URL` and `SERVICE`. If not specified, the `url` is generated based on the default `registrationType` of this AgentCard. Defaults to `URL`. |

#### Response Data

The response body follows the [Nacos open API unified response format](#01-unified-response-body-format). The table below describes only the response parameters in the `data` field.

| Name    | Type     | Description             |
|--------|----------|----------------|
| `data` | `string` | AgentCard publish result. |

#### Examples

* Request example

```shell
curl -X POST '127.0.0.1:8848/nacos/v3/admin/ai/a2a' \
-d 'namespaceId=public' \
-d 'agentCard={"protocolVersion":"0.2.9","name":"GeoSpatial Route Planner Agent","description":"Provides advanced route planning, traffic analysis, and custom map generation services. This agent can calculate optimal routes, estimate travel times considering real-time traffic, and create personalized maps with points of interest.","url":"https://georoute-agent.example.com/a2a/v1","preferredTransport":"JSONRPC","additionalInterfaces":[{"url":"https://georoute-agent.example.com/a2a/v1","transport":"JSONRPC"},{"url":"https://georoute-agent.example.com/a2a/grpc","transport":"GRPC"},{"url":"https://georoute-agent.example.com/a2a/json","transport":"HTTP+JSON"}],"provider":{"organization":"Example Geo Services Inc.","url":"https://www.examplegeoservices.com"},"iconUrl":"https://georoute-agent.example.com/icon.png","version":"1.2.0","documentationUrl":"https://docs.examplegeoservices.com/georoute-agent/api","capabilities":{"streaming":true,"pushNotifications":true,"stateTransitionHistory":false},"securitySchemes":{"google":{"type":"openIdConnect","openIdConnectUrl":"https://accounts.google.com/.well-known/openid-configuration"}},"security":[{"google":["openid","profile","email"]}],"defaultInputModes":["application/json","text/plain"],"defaultOutputModes":["application/json","image/png"],"skills":[{"id":"route-optimizer-traffic","name":"Traffic-Aware Route Optimizer","description":"Calculates the optimal driving route between two or more locations, taking into account real-time traffic conditions, road closures, and user preferences (e.g., avoid tolls, prefer highways).","tags":["maps","routing","navigation","directions","traffic"],"examples":["Plan a route from '\''1600 Amphitheatre Parkway, Mountain View, CA'\'' to '\''San Francisco International Airport'\'' avoiding tolls.","{\"origin\": {\"lat\": 37.422, \"lng\": -122.084}, \"destination\": {\"lat\": 37.7749, \"lng\": -122.4194}, \"preferences\": [\"avoid_ferries\"]}"],"inputModes":["application/json","text/plain"],"outputModes":["application/json","application/vnd.geo+json","text/html"]},{"id":"custom-map-generator","name":"Personalized Map Generator","description":"Creates custom map images or interactive map views based on user-defined points of interest, routes, and style preferences. Can overlay data layers.","tags":["maps","customization","visualization","cartography"],"examples":["Generate a map of my upcoming road trip with all planned stops highlighted.","Show me a map visualizing all coffee shops within a 1-mile radius of my current location."],"inputModes":["application/json"],"outputModes":["image/png","image/jpeg","application/json","text/html"]}],"supportsAuthenticatedExtendedCard":true,"signatures":[{"protected":"eyJhbGciOiJFUzI1NiIsInR5cCI6IkpPU0UiLCJraWQiOiJrZXktMSIsImprdSI6Imh0dHBzOi8vZXhhbXBsZS5jb20vYWdlbnQvandrcy5qc29uIn0","signature":"QFdkNLNszlGj3z3u0YQGt_T9LixY3qtdQpZmsTdDHDe3fXV9y9-B3m2-XgCpzuhiLt8E0tV6HXoZKHv4GtHgKQ"}]}' \
-d 'registrationType=SERVICE'
```
* Response example

```json
{
  "code" : 0,
  "message" : "success",
  "data" : "ok"
}
```

### 5.6. Delete AgentCard

#### Description

Use this API to delete an AgentCard hosted on Nacos.

#### Since

`3.1.0`

#### Request Method

`DELETE`

#### Authorization

Requires `write` permission for the corresponding namespace.

#### Request URL

`/nacos/v3/admin/ai/a2a`

#### Request Parameters

| Name           | Type     | Required  | Description                          |
|---------------|----------|-------|-----------------------------|
| `namespaceId` | `string` | No     | Namespace to which the AgentCard belongs. Defaults to `public`. |
| `agentName`   | `string` | **Yes** | AgentCard name                |
| `version`     | `string` | No     | AgentCard version. If empty, details of the latest version are returned.   |

#### Response Data

The response body follows the [Nacos open API unified response format](#01-unified-response-body-format). The table below describes only the response parameters in the `data` field.

| Name    | Type     | Description             |
|--------|----------|----------------|
| `data` | `string` | AgentCard deletion result. |

#### Examples

* Request example

```shell
curl -X DELETE '127.0.0.1:8848/nacos/v3/admin/ai/a2a?namespaceId=public&agentName=GeoSpatial+Route+Planner+Agent&version=1.0.0'
```
* Response example

```json
{
  "code" : 0,
  "message" : "success",
  "data" : "ok"
}
```

## 6. AI Prompt Management

### 6.1. Publish Prompt

#### Description

This API publishes a new Prompt version.

#### Since

`3.2.0`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/prompt`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. Defaults to `public`. |
| `promptKey` | `string` | **Yes** | Prompt key. |
| `version` | `string` | **Yes** | Version. |
| `template` | `string` | No | Template content. |
| `commitMsg` | `string` | No | Commit message. |
| `description` | `string` | No | Description. |
| `bizTags` | `string` | No | Business tags. |
| `variables` | `string` | No | Prompt template variable definitions as a JSON string. |

#### Response Data

On success, the API returns the common response body with `data` set to `true`; on failure, it returns the [Nacos OpenAPI common response format](../user/overview/api-overview.md#32-http-api-response-format).

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt' \
  -d 'namespaceId=public' -d 'promptKey=my-prompt' -d 'version=1.0.0' -d 'template=hello'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 6.2. Delete Prompt

#### Description

This API deletes the specified Prompt.

#### Since

`3.2.0`

#### Request Method

`DELETE`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/prompt`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `promptKey` | `string` | **Yes** | Prompt key. |

#### Response Data

On success, the API returns the common response body with `data` set to `true`; on failure, it returns the [Nacos OpenAPI common response format](../user/overview/api-overview.md#32-http-api-response-format).

#### Examples

* Request example

```shell
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt?namespaceId=public&promptKey=my-prompt'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 6.3. Get Prompt Detail

#### Description

This API queries Prompt details by version or label.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/prompt/detail`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `promptKey` | `string` | **Yes** | Prompt key. |
| `version` | `string` | No | Version. |
| `label` | `string` | No | Label. |
| `md5` | `string` | No | Content MD5. |

#### Response Data

The response body follows the [Nacos OpenAPI common response format](../user/overview/api-overview.md#32-http-api-response-format). `data` contains fields such as `promptKey`, `version`, `template`, `commitMsg`, and `md5`.

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt/detail?namespaceId=public&promptKey=my-prompt&version=1.0.0'
```

* Response example

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

#### Description

This API binds a label to the specified Prompt version.

#### Since

`3.2.0`

#### Request Method

`PUT`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/prompt/label`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `promptKey` | `string` | **Yes** | Prompt key. |
| `label` | `string` | **Yes** | Label name. |
| `version` | `string` | **Yes** | Version. |

#### Response Data

On success, the API returns the common response body with `data` set to `true`; on failure, it returns the [Nacos OpenAPI common response format](../user/overview/api-overview.md#32-http-api-response-format).

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt/label' \
  -d 'namespaceId=public' -d 'promptKey=my-prompt' -d 'label=stable' -d 'version=1.0.0'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 6.5. Unbind Label

#### Description

This API unbinds a label from a Prompt.

#### Since

`3.2.0`

#### Request Method

`DELETE`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/prompt/label`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `promptKey` | `string` | **Yes** | Prompt key. |
| `label` | `string` | **Yes** | Label name. |

#### Response Data

On success, the API returns the common response body with `data` set to `true`; on failure, it returns the [Nacos OpenAPI common response format](../user/overview/api-overview.md#32-http-api-response-format).

#### Examples

* Request example

```shell
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt/label?namespaceId=public&promptKey=my-prompt&label=stable'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 6.6. List Prompts

#### Description

This API queries Prompts by page.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/prompt/list`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `pageNo` | `integer` | **Yes** | Page number. |
| `pageSize` | `integer` | **Yes** | Number of records per page. |
| `namespaceId` | `string` | No | Namespace. |
| `promptKey` | `string` | No | Prompt key filter. |
| `search` | `string` | No | Search mode: `blur` or `accurate`. |
| `bizTags` | `string` | No | Business tags. |

#### Response Data

The response body follows the [Nacos OpenAPI common response format](../user/overview/api-overview.md#32-http-api-response-format). `data` is a paginated object that contains fields such as `totalCount`, `pageNumber`, `pagesAvailable`, and `pageItems`.

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt/list?pageNo=1&pageSize=10&namespaceId=public&search=blur'
```

* Response example

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

#### Description

This API queries metadata of the specified Prompt.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/prompt/metadata`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `promptKey` | `string` | **Yes** | Prompt key. |

#### Response Data

The response body follows the [Nacos OpenAPI common response format](../user/overview/api-overview.md#32-http-api-response-format). `data` contains fields such as `promptKey`, `description`, `bizTags`, `latestVersion`, `versions`, and `labels`.

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt/metadata?namespaceId=public&promptKey=my-prompt'
```

* Response example

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

#### Description

This API updates Prompt metadata, such as description and business tags.

#### Since

`3.2.0`

#### Request Method

`PUT`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/prompt/metadata`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `promptKey` | `string` | **Yes** | Prompt key. |
| `description` | `string` | No | Description. |
| `bizTags` | `string` | No | Business tags. |

#### Response Data

On success, the API returns the common response body with `data` set to `true`; on failure, it returns the [Nacos OpenAPI common response format](../user/overview/api-overview.md#32-http-api-response-format).

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt/metadata' \
  -d 'namespaceId=public' -d 'promptKey=my-prompt' -d 'description=desc'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 6.9. List Prompt Versions

#### Description

This API queries versions of the specified Prompt by page.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/prompt/versions`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `promptKey` | `string` | **Yes** | Prompt key. |
| `pageNo` | `integer` | **Yes** | Page number. |
| `pageSize` | `integer` | **Yes** | Number of records per page. |

#### Response Data

The response body follows the [Nacos OpenAPI common response format](../user/overview/api-overview.md#32-http-api-response-format). `data` is a paginated object that contains `totalCount`, `pageNumber`, `pagesAvailable`, and `pageItems`; each item contains fields such as `version`, `commitMsg`, and `gmtModified`.

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/prompt/versions?namespaceId=public&promptKey=my-prompt&pageNo=1&pageSize=10'
```

* Response example

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

#### Description

This API updates Prompt business tags.

#### Since

`3.2.1`

#### Request Method

`PUT`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/prompt/biz-tags`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `promptKey` | `string` | **Yes** | Prompt key. |
| `bizTags` | `string` | No | Business tags. |

### 6.11. Update Prompt Description

#### Description

This API updates the Prompt description.

#### Since

`3.2.1`

#### Request Method

`PUT`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/prompt/description`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `promptKey` | `string` | **Yes** | Prompt key. |
| `description` | `string` | **Yes** | Description. |

### 6.12. Create Prompt Draft

#### Description

This API creates a Prompt draft version, or recreates a draft from an existing version.

#### Since

`3.2.1`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/prompt/draft`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `promptKey` | `string` | **Yes** | Prompt key. |
| `basedOnVersion` | `string` | No | Version to base the draft on. |
| `targetVersion` | `string` | No | Target version. |
| `template` | `string` | No | Template content. |
| `variables` | `string` | No | Prompt template variable definitions as a JSON string. |
| `commitMsg` | `string` | No | Commit message. |
| `description` | `string` | No | Description. |
| `bizTags` | `string` | No | Business tags. |

### 6.13. Update Prompt Draft

#### Description

This API updates the current Prompt draft content.

#### Since

`3.2.1`

#### Request Method

`PUT`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/prompt/draft`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `promptKey` | `string` | **Yes** | Prompt key. |
| `template` | `string` | **Yes** | Template content. |
| `variables` | `string` | No | Prompt template variable definitions as a JSON string. |
| `commitMsg` | `string` | No | Commit message. |

### 6.14. Delete Prompt Draft

#### Description

This API deletes the current Prompt draft version.

#### Since

`3.2.1`

#### Request Method

`DELETE`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/prompt/draft`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `promptKey` | `string` | **Yes** | Prompt key. |

### 6.15. Force Publish Prompt Version

#### Description

This API force-publishes a Prompt version while bypassing pipeline validation.

#### Since

`3.2.1`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/prompt/force-publish`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `promptKey` | `string` | **Yes** | Prompt key. |
| `version` | `string` | **Yes** | Version number. |
| `updateLatestLabel` | `boolean` | No | Whether to update the `latest` label after publishing. |

### 6.16. Get Prompt Governance Details

#### Description

This API retrieves Prompt metadata, version governance information, and version summaries.

#### Since

`3.2.1`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/prompt/governance`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `promptKey` | `string` | **Yes** | Prompt key. |

### 6.17. Update Prompt Labels

#### Description

This API updates the runtime routing labels of a Prompt.

#### Since

`3.2.1`

#### Request Method

`PUT`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/prompt/labels`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `promptKey` | `string` | **Yes** | Prompt key. |
| `labels` | `string` | **Yes** | Label JSON string. |

### 6.18. Offline Prompt Version

#### Description

This API takes a specified Prompt version offline.

#### Since

`3.2.1`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/prompt/offline`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `promptKey` | `string` | **Yes** | Prompt key. |
| `version` | `string` | **Yes** | Version number. |

### 6.19. Online Prompt Version

#### Description

This API brings a specified Prompt version online.

#### Since

`3.2.1`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/prompt/online`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `promptKey` | `string` | **Yes** | Prompt key. |
| `version` | `string` | **Yes** | Version number. |

### 6.20. Publish Prompt Version

#### Description

This API publishes an approved Prompt version.

#### Since

`3.2.1`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/prompt/publish`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `promptKey` | `string` | **Yes** | Prompt key. |
| `version` | `string` | **Yes** | Version number. |
| `updateLatestLabel` | `boolean` | No | Whether to update the `latest` label after publishing. |

### 6.21. Redraft Prompt Version

#### Description

This API converts a reviewed Prompt version back to a draft.

#### Since

`3.2.2`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/prompt/redraft`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `promptKey` | `string` | **Yes** | Prompt key. |
| `version` | `string` | **Yes** | Version number. |

### 6.22. Submit Prompt Version for Review

#### Description

This API submits a Prompt version to the pipeline for review.

#### Since

`3.2.1`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/prompt/submit`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `promptKey` | `string` | **Yes** | Prompt key. |
| `version` | `string` | No | Version number. |

### 6.23. Get Prompt Version Details

#### Description

This API retrieves details of a specified Prompt version.

#### Since

`3.2.1`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/prompt/version`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `promptKey` | `string` | **Yes** | Prompt key. |
| `version` | `string` | No | Version number. |

### 6.24. Download Prompt Version

#### Description

This API downloads a specified Prompt version as a Markdown file.

#### Since

`3.2.2`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/prompt/version/download`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `promptKey` | `string` | **Yes** | Prompt key. |
| `version` | `string` | No | Version number. |

## 7. AI Skills Management

### 7.1. Get Skill Details

#### Description

This API obtains the details of a specified skill by namespace and skill name.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/skills`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `skillName` | `string` | **Yes** | Skill name. |

#### Response Data

The response follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). `data` contains fields such as name, description, instruction, resource, version, inputModes, and outputModes.

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills?namespaceId=public&skillName=my-skill'
```

* Response example

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

#### Description

This API creates a draft version of a skill based on an existing version or a new SkillCard.

#### Since

`3.2.0`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/skills/draft`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `skillName` | `string` | No | Skill name. |
| `basedOnVersion` | `string` | No | Create the draft based on this version. |
| `targetVersion` | `string` | No | Target version. |
| `skillCard` | `string` | No | Skill card JSON; required if basedOnVersion is not set |

#### Response Data

On success, returns the unified response body with `data` as a string indicating the draft creation result. On failure, returns the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format).

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/draft' \
  -d 'namespaceId=public' -d 'skillName=my-skill' -d 'basedOnVersion=1.0.0'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 7.3. Update Skill Draft Content

#### Description

This API updates the SkillCard content of the current skill draft version.

#### Since

`3.2.0`

#### Request Method

`PUT`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/skills/draft`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `skillCard` | `string` | **Yes** | Skill card JSON string containing complete Skill information |
| `skillName` | `string` | **Yes** | Skill name. |

#### Response Data

On success, returns the unified response body with `data` as a string indicating the draft update result. On failure, returns the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format).

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/draft' \
  -d 'namespaceId=public' -d 'skillName=my-skill' -d 'skillCard={}'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 7.4. Delete Skill

#### Description

This API deletes a skill from Nacos by namespace and skill name.

#### Since

`3.2.0`

#### Request Method

`DELETE`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/skills`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `skillName` | `string` | **Yes** | Skill name. |

#### Response Data

On success, returns the unified response body with `data` as a string indicating the operation result, such as "ok". On failure, returns the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format).

#### Examples

* Request example

```shell
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills?namespaceId=public&skillName=my-skill'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 7.5. List Skills

#### Description

This API filters and paginates the skill list by query conditions.

#### Since

`3.2.1`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/skills/list`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `pageNo` | `integer` | **Yes** | Page number. |
| `pageSize` | `integer` | **Yes** | Page size. |
| `filterableForm` | `string` | **Yes** | Filter condition form. |
| `namespaceId` | `string` | No | Namespace. |
| `skillName` | `string` | No | Skill name filter. |
| `search` | `string` | No | Search mode: accurate or blur |

#### Response Data

The response follows the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). `data` is a pagination structure containing totalCount, pageNumber, pagesAvailable, and pageItems. Each item includes fields such as name, description, and updateTime.

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/list?pageNo=1&pageSize=100&namespaceId=public&search=blur'
```

* Response example

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

#### Description

This API uploads a ZIP package in multipart/form-data format and registers the skill. The file must be a valid skill package.

#### Since

`3.2.2`

#### Request Method

`POST`

The request body type is `multipart/form-data`, and parameters are placed in the request body.

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/skills/upload`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID. Defaults to `public`. |
| `overwrite` | `boolean` | No | Whether to overwrite an existing skill with the same name. |
| `targetVersion` | `string` | No | Target version after upload. |
| `commitMsg` | `string` | No | Commit message. |
| `file` | `file` | No | ZIP file containing skill package. |

#### Response Data

On success, returns the unified response body with `data` as the uploaded skill name. On failure, returns the [Nacos open API unified response format](../user/overview/api-overview.md#32-http-api-response-format).

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/upload' \
  -F "file=@skill.zip" -F "namespaceId=public" -F "overwrite=false" -F "targetVersion=1.0.0" -F "commitMsg=initial"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "uploaded-skill-name"
}
```

### 7.7. Delete Skill Draft Version

#### Description

This API deletes the current draft version of a specified skill.

#### Since

`3.2.0`

#### Request Method

`DELETE`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/skills/draft`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `skillName` | `string` | **Yes** | Skill name. |

### 7.8. Update Skill Business Tags

#### Description

This API updates the business tag list of a skill without changing the version status.

#### Since

`3.2.0`

#### Request Method

`PUT`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/skills/biz-tags`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `skillName` | `string` | **Yes** | Skill name. |
| `bizTags` | `string` | **Yes** | Business tags. |

### 7.9. Update Skill Version Labels

#### Description

This API updates the version routing labels of a skill, such as latest.

#### Since

`3.2.0`

#### Request Method

`PUT`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/skills/labels`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `skillName` | `string` | **Yes** | Skill name. |
| `labels` | `string` | **Yes** | Label JSON string. |

### 7.10. Skill Version Online, Offline, and Publish Operations

#### Description

The following APIs are used to control the skill version publishing workflow.

#### Request Parameters

| Method | Request URL | Key parameters |
|--------|----------|----------|
| `POST` | `/nacos/v3/admin/ai/skills/offline` | `namespaceId`, `skillName`, `scope`, `version` |
| `POST` | `/nacos/v3/admin/ai/skills/online` | `namespaceId`, `skillName`, `scope`, `version` |
| `POST` | `/nacos/v3/admin/ai/skills/publish` | `namespaceId`, `skillName`, `version`, `updateLatestLabel` |
| `PUT` | `/nacos/v3/admin/ai/skills/scope` | `namespaceId`, `skillName`, `scope` |
| `POST` | `/nacos/v3/admin/ai/skills/submit` | `namespaceId`, `skillName`, `version` |

### 7.11. Get Skill Version Details

#### Since

`3.2.0`

#### Request Method

`GET`

#### Request URL

`/nacos/v3/admin/ai/skills/version`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `skillName` | `string` | **Yes** | Skill name. |
| `version` | `string` | No | Version number. |

### 7.12. Download Skill Version ZIP Package

#### Since

`3.2.0`

#### Request Method

`GET`

#### Request URL

`/nacos/v3/admin/ai/skills/version/download`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `skillName` | `string` | **Yes** | Skill name. |
| `version` | `string` | No | Version number. |

### 7.13. Offline Skill
#### Description
This interface allows executing an offline operation on a specific version or the entire skill, making it not callable.

#### Since

`3.2.0`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/skills/offline`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID, default is `public`. |
| `skillName` | `string` | **Yes** | Skill name. |
| `scope` | `string` | No | Use 'skill' for skill-level offline; otherwise version-level |
| `version` | `string` | No | Version identifier. |
#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/offline' -d "namespaceId=namespaceId&skillName=skillName&scope=scope&version=version"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.14. Online Skill
#### Description
This interface allows executing an online operation on a specific version or the entire skill, making it callable.

#### Since

`3.2.0`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/skills/online`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID, default is `public`. |
| `skillName` | `string` | **Yes** | Skill name. |
| `scope` | `string` | No | Use 'skill' for skill-level online; otherwise version-level |
| `version` | `string` | No | Version identifier. |
#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/online' -d "namespaceId=namespaceId&skillName=skillName&scope=scope&version=version"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 7.15. Publish Skill Version
#### Description
This interface allows publishing an approved skill version.

#### Since

`3.2.0`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/skills/publish`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID, default is `public`. |
| `skillName` | `string` | **Yes** | Skill name. |
| `version` | `string` | **Yes** | Version identifier. |
| `updateLatestLabel` | `boolean` | No | Whether to update the `latest` label after publishing. |
#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/publish' -d "namespaceId=namespaceId&skillName=skillName&version=version&updateLatestLabel=updateLatestLabel"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 7.16. Update Skill Visibility Scope
#### Description
This interface allows setting the visibility scope of a skill to PUBLIC or PRIVATE.

#### Since

`3.2.0`

#### Request Method

`PUT`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/skills/scope`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID, default is `public`. |
| `skillName` | `string` | **Yes** | Skill name. |
| `scope` | `string` | **Yes** | PUBLIC or PRIVATE |
#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/scope' -d "namespaceId=namespaceId&skillName=skillName&scope=scope"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 7.17. Submit Skill Version for Review
#### Description
This interface allows submitting a skill draft version to the pipeline for review.

#### Since

`3.2.0`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/skills/submit`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID, default is `public`. |
| `skillName` | `string` | **Yes** | Skill name. |
| `version` | `string` | No | Version identifier. |
#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/submit' -d "namespaceId=namespaceId&skillName=skillName&version=version"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 7.18. Force Publish Skill Version

#### Description

This API force-publishes a Skill version while bypassing pipeline validation.

#### Since

`3.2.1`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/skills/force-publish`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `skillName` | `string` | **Yes** | Skill name. |
| `version` | `string` | **Yes** | Version number. |
| `updateLatestLabel` | `boolean` | No | Whether to update the `latest` label after publishing. |

### 7.19. Redraft Skill Version

#### Description

This API converts a reviewed Skill version back to a draft.

#### Since

`3.2.2`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/skills/redraft`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `skillName` | `string` | **Yes** | Skill name. |
| `version` | `string` | **Yes** | Version number. |

### 7.20. Batch Upload Skills

#### Description

This API batch uploads Skills from a ZIP file that contains multiple Skill subdirectories.

#### Since

`3.2.2`

#### Request Method

`POST`

Request body type: `multipart/form-data`. Parameters are sent in the request body.

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/skills/upload/batch`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `overwrite` | `boolean` | No | Whether to overwrite existing skills with the same names. |
| `file` | `file` | No | ZIP package containing multiple Skill subdirectories. |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/skills/upload/batch' \
  -F "file=@skills.zip" -F "namespaceId=public" -F "overwrite=false"
```

## 8. AgentSpec Management

### 8.1. Get AgentSpec
#### Description
This interface allows getting the latest published version of an AgentSpec by namespace and name.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/agentspecs`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **Yes** | AgentSpec name. |
#### Response Data

| Name | Type | Description |
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

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs?namespaceId=public&agentSpecName=my-agentspec'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.2. Delete AgentSpec
#### Description
This interface allows deleting an AgentSpec and all its versions by namespace and name.

#### Since

`3.2.0`

#### Request Method

`DELETE`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/agentspecs`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **Yes** | AgentSpec name. |
#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs?namespaceId=public&agentSpecName=my-agentspec'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.3. Update AgentSpec Business Tags
#### Description
This interface allows updating the business tag list of an AgentSpec without changing version status.

#### Since

`3.2.0`

#### Request Method

`PUT`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/agentspecs/biz-tags`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **Yes** | AgentSpec name. |
| `bizTags` | `string` | **Yes** | Business tags; pass multiple tags using the agreed format. |
#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/biz-tags' -d "namespaceId=public&agentSpecName=my-agentspec&bizTags=demo"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.4. Create AgentSpec Draft Version
#### Description
This interface allows creating an AgentSpec draft version based on an existing version.

#### Since

`3.2.0`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/agentspecs/draft`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **Yes** | AgentSpec name. |
| `basedOnVersion` | `string` | No | Base version used to create the draft. |
#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/draft' -d "namespaceId=public&agentSpecName=my-agentspec&basedOnVersion=1.0.0"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.5. Update AgentSpec Draft Content
#### Description
This interface allows updating the card content of the current AgentSpec draft version.

#### Since

`3.2.0`

#### Request Method

`PUT`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/agentspecs/draft`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | No | AgentSpec name. |
| `agentSpecCard` | `string` | **Yes** | AgentSpec card JSON string containing complete AgentSpec information |
#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/draft' -d "namespaceId=public&agentSpecName=my-agentspec&agentSpecCard={}"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.6. Delete AgentSpec Draft Version
#### Description
This interface allows deleting the current draft version of a specified AgentSpec.

#### Since

`3.2.0`

#### Request Method

`DELETE`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/agentspecs/draft`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **Yes** | AgentSpec name. |
#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X DELETE 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/draft?namespaceId=public&agentSpecName=my-agentspec'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.7. Update AgentSpec Version Labels
#### Description
This interface allows updating AgentSpec version routing labels (e.g. latest label) without changing version status.

#### Since

`3.2.0`

#### Request Method

`PUT`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/agentspecs/labels`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **Yes** | AgentSpec name. |
| `labels` | `string` | **Yes** | Version labels, usually as a JSON string. |
#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/labels' -d "namespaceId=public&agentSpecName=my-agentspec&labels={\"latest\":\"1.0.0\"}"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.8. List AgentSpecs
#### Description
This interface allows paginated listing of AgentSpecs by namespace and name.

#### Since

`3.2.1`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/agentspecs/list`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `pageNo` | `integer` | **Yes** | Page number, starting from 1. |
| `pageSize` | `integer` | **Yes** | Number of items per page. |
| `filterableForm` | `string` | **Yes** | Filter condition form. |
| `namespaceId` | `string` | No | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | No | AgentSpec name. |
| `search` | `string` | No | Search mode: `accurate` or `blur`. |
#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/list?pageNo=1&pageSize=20&namespaceId=public&agentSpecName=my-agentspec&search=accurate'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.9. Offline AgentSpec
#### Description
This interface allows executing an offline operation on a specific version or the entire AgentSpec, making it not callable.

#### Since

`3.2.0`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/agentspecs/offline`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **Yes** | AgentSpec name. |
| `scope` | `string` | No | Use 'agentspec' for agentspec-level offline; otherwise version-level |
| `version` | `string` | No | Version identifier. |
#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/offline' -d "namespaceId=public&agentSpecName=my-agentspec&scope=agentspec&version=1.0.0"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.10. Online AgentSpec
#### Description
This interface allows executing an online operation on a specific version or the entire AgentSpec, making it callable.

#### Since

`3.2.0`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/agentspecs/online`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **Yes** | AgentSpec name. |
| `scope` | `string` | No | Use 'agentspec' for agentspec-level online; otherwise version-level |
| `version` | `string` | No | Version identifier. |
#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/online' -d "namespaceId=public&agentSpecName=my-agentspec&scope=agentspec&version=1.0.0"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.11. Publish AgentSpec Version
#### Description
This interface allows publishing an approved AgentSpec version.

#### Since

`3.2.0`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/agentspecs/publish`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **Yes** | AgentSpec name. |
| `version` | `string` | **Yes** | Version identifier. |
| `updateLatestLabel` | `boolean` | No | Whether to update the `latest` label after publishing. |
#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/publish' -d "namespaceId=public&agentSpecName=my-agentspec&version=1.0.0&updateLatestLabel=true"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.12. Update AgentSpec Visibility Scope
#### Description
This interface allows setting the visibility scope of an AgentSpec to PUBLIC or PRIVATE.

#### Since

`3.2.0`

#### Request Method

`PUT`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/agentspecs/scope`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **Yes** | AgentSpec name. |
| `scope` | `string` | **Yes** | PUBLIC or PRIVATE |
#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/scope' -d "namespaceId=public&agentSpecName=my-agentspec&scope=PUBLIC"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.13. Submit AgentSpec Version for Review
#### Description
This interface allows submitting an AgentSpec draft version to the pipeline for review.

#### Since

`3.2.0`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/agentspecs/submit`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **Yes** | AgentSpec name. |
| `version` | `string` | No | Version identifier. |
#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/submit' -d "namespaceId=public&agentSpecName=my-agentspec&version=1.0.0"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.14. Upload AgentSpec
#### Description
This interface allows uploading a ZIP-packaged AgentSpec; the package is parsed and the AgentSpec is created or updated.

#### Since

`3.2.0`

#### Request Method

`POST`

Request body type: `multipart/form-data`. Parameters are sent in the request body.

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/agentspecs/upload`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID, default is `public`. |
| `overwrite` | `boolean` | No | Whether to overwrite an existing resource with the same name. |
| `file` | `file` | No | ZIP file containing AgentSpec package. |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/upload' -F "file=@agentspec.zip" -F "namespaceId=public" -F "overwrite=false"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.15. Get AgentSpec Version
#### Description
This interface allows getting a specific version of an AgentSpec by namespace, name, and version.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/agentspecs/version`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **Yes** | AgentSpec name. |
| `version` | `string` | No | Version identifier. |
#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data.namespaceId | `string` | - |
| data.data.name | `string` | - |
| data.data.description | `string` | - |
| data.data.bizTags | `string` | - |
| data.data.content | `string` | - |
| data.data.resource | `object` | - |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/agentspecs/version?namespaceId=public&agentSpecName=my-agentspec&version=1.0.0'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.16. Force Publish AgentSpec Version

#### Description

This API force-publishes an AgentSpec version while bypassing pipeline validation.

#### Since

`3.2.1`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/agentspecs/force-publish`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **Yes** | AgentSpec name. |
| `version` | `string` | **Yes** | Version number. |
| `updateLatestLabel` | `boolean` | No | Whether to update the `latest` label after publishing. |

### 8.17. Redraft AgentSpec Version

#### Description

This API converts a reviewed AgentSpec version back to a draft.

#### Since

`3.2.2`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/agentspecs/redraft`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **Yes** | AgentSpec name. |
| `version` | `string` | **Yes** | Version number. |

### 8.18. Get AgentSpec Version Metadata

#### Description

This API retrieves metadata for a specified AgentSpec version without reading resource file content.

#### Since

`3.2.1`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/agentspecs/version/meta`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace ID, default is `public`. |
| `agentSpecName` | `string` | **Yes** | AgentSpec name. |
| `version` | `string` | No | Version number. |

## 9. Pipeline Execution Records

### 9.1. List Pipeline Execution Records

#### Description

This API lists Pipeline execution records by resource type, resource name, namespace, and version with pagination.

#### Since

`3.2.1`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/pipelines`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `resourceType` | `string` | **Yes** | Resource type. |
| `resourceName` | `string` | No | Resource name. |
| `namespaceId` | `string` | No | Namespace. |
| `version` | `string` | No | Resource version. |
| `pageNo` | `integer` | **Yes** | Page number. |
| `pageSize` | `integer` | **Yes** | Page size. |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | Response code. |
| data.message | `string` | Response message. |
| data.data | `string` | Paginated Pipeline execution records. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/pipelines?resourceType=agentspec&resourceName=my-agentspec&namespaceId=public&version=1.0.0&pageNo=1&pageSize=20'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 9.2. Get Pipeline Execution Record Details

#### Description

This API retrieves Pipeline execution record details by Pipeline ID.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/pipelines/{pipelineId}`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `pipelineId` | `string` | **Yes** | Pipeline ID. |

#### Response Data

| Name | Type | Description |
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

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/pipelines/pipeline-001'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 9.3. List Pipeline Execution Records

#### Description

This API lists Pipeline execution records by resource type, resource name, namespace, and version with pagination.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/pipelines/list`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `resourceType` | `string` | **Yes** | Resource type. |
| `resourceName` | `string` | No | Resource name. |
| `namespaceId` | `string` | No | Namespace. |
| `version` | `string` | No | Resource version. |
| `pageNo` | `integer` | **Yes** | Page number. |
| `pageSize` | `integer` | **Yes** | Page size. |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | Response code. |
| data.message | `string` | Response message. |
| data.data | `string` | Paginated Pipeline execution records. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/pipelines/list?resourceType=agentspec&resourceName=my-agentspec&namespaceId=public&version=1.0.0&pageNo=1&pageSize=20'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 9.4. Get Pipeline Execution Record Details

#### Description

This API retrieves Pipeline execution record details by Pipeline ID.

#### Since

`3.2.1`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/pipelines/detail`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `pipelineId` | `string` | **Yes** | Pipeline ID. |

#### Response Data

| Name | Type | Description |
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

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8848/nacos/v3/admin/ai/pipelines/detail?pipelineId=pipeline-001'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

## 10. AI Resource Import

These APIs use only enabled fixed sources from unified plugin management. Request and response `sourceId` equals the managed plugin name: `mcp-official`, `mcp-registry-protocol`, `skills-sh`, or `skills-well-known`. The historical source descriptor field named `pluginName` still means importerType, such as `mcp-registry`; it is not the source ID. One implementation can no longer be cloned to multiple endpoints through configuration.

### 10.1. List AI Resource Import Sources

#### Description

This API lists fixed AI resource import sources that are currently loaded and enabled. Source detail and canonical definitions are managed by `ai-resource-import:{sourceId}`.

#### Since

`3.2.2`

#### Request Method

`GET`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/import/sources`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `resourceType` | `string` | No | Resource type. |

### 10.2. Search External AI Resources

#### Description

This API searches importable external AI resources from a specified import source.

#### Since

`3.2.2`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/import/search`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `resourceType` | `string` | **Yes** | Resource type. |
| `sourceId` | `string` | **Yes** | Import source ID. |
| `query` | `string` | No | Search keyword. |
| `cursor` | `string` | No | Pagination cursor. |
| `limit` | `integer` | No | Result limit. |
| `options` | `string` | No | Extension options as a JSON string. |

### 10.3. Validate AI Resource Import Items

#### Description

This API validates whether selected external AI resources can be imported.

#### Since

`3.2.2`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/import/validate`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `resourceType` | `string` | **Yes** | Resource type. |
| `sourceId` | `string` | **Yes** | Import source ID. |
| `selectedItems` | `string` | **Yes** | Resource items to validate as a JSON string. |
| `overwriteExisting` | `boolean` | No | Whether to overwrite existing resources. |
| `options` | `string` | No | Extension options as a JSON string. |

### 10.4. Execute AI Resource Import

#### Description

This API imports the selected external AI resources.

#### Since

`3.2.2`

#### Request Method

`POST`

#### Authorization

Administrator permissions required.

#### Request URL

`/nacos/v3/admin/ai/import/execute`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | Namespace. |
| `resourceType` | `string` | **Yes** | Resource type. |
| `sourceId` | `string` | **Yes** | Import source ID. |
| `selectedItems` | `string` | **Yes** | Resource items to import as a JSON string. |
| `overwriteExisting` | `boolean` | No | Whether to overwrite existing resources. |
| `skipInvalid` | `boolean` | No | Whether to skip invalid resource items. |
| `validationToken` | `string` | No | Validation token. |
| `options` | `string` | No | Extension options as a JSON string. |
