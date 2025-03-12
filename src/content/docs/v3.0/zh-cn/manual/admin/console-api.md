---
title: 控制台API
keywords: [ Nacos,控制台API ]
description: Nacos 控制台的一些API，如果您需要自定义开发Nacos对应的控制台UI，可以使用这些API进行数据的获取。
sidebar:
  order: 10
---

# 控制台API

Nacos 提供了若干开放的控制台API，当您有自定义开发Nacos对应的控制台UI需求时，您可以通过这些API，获取Nacos
Server节点中的数据，从而实现自定义的Nacos控制台UI界面。

同时配合关闭Nacos 默认控制台UI来使用自定义UI，相关详情请参考[控制台手册-关闭默认控制台](./console/#33-关闭默认控制台)

## 0. 控制台API 相关说明

### 0.1 统一返回体格式

自3.0版本开始，OpenAPI/AdminAPI/ConsoleAPI均使用相同的返回体格式。

完整的返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)
，本文档中所有的API返回数据只阐述`data`字段中的返回参数。

### 0.2 统一路径格式

Nacos的控制台 API，使用统一的Path格式进行的规范。格式为`[/$nacos.console.contextPath]/v3/console/[module]/[subPath]...`,
其中

- `$nacos.console.contextPath`：控制台的根路径，默认为``，可以通过`nacos.console.contextPath`配置项进行修改。
- `module`：控制台的模块名称，例如`server`、`cs`、`ns`、`core`等。
- `subPath`：控制台的子路径，例如`state`、`namespace`、`config`等， 可能有多层子路径。

下列列出的控制台API，采用默认`$nacos.console.contextPath`的情况进行展示，若已修改部署环境中的`$nacos.console.contextPath`
配置项，请自行修改调用API时的请求URL。

同时下列列出的控制台API样例中，均采用默认Nacos Console的端口进行展示，若已修改部署环境中的`$nacos.console.port`
配置项，请自行修改调用API时的请求URL。

### 0.3 鉴权认证

Nacos 3.X 的控制台 API默认启用鉴权认证，除少量被标记为`公开接口`的API外，请在调用API时，携带正确的身份信息，否则请求将会被拦截。

若想要关闭鉴权，请设置`nacos.core.auth.console.enabled=false`，然后重启Nacos 控制台。

## 1. Nacos 基础控制台API

基础控制台API提供了Nacos 集群的基础信息，例如集群信息、命名空间信息等。

### 1.1. 获取集群状态信息

#### 接口描述

通过该接口，可以获取到Nacos 集群的基础状态和开关信息，例如：版本号，运行模式，鉴权是否开启等；该接口不会返回Nacos 集群的节点信息。

#### 请求方式

`GET`

#### 鉴权状态

公开接口，无需身份信息。

#### 请求URL

`/v3/console/server/state`

#### 请求参数

无

#### 返回数据

| 参数名                           | 参数类型      | 描述                                                                        |
|-------------------------------|-----------|---------------------------------------------------------------------------|
| version                       | `String`  | Nacos集群的版本号，例如`3.0.0`                                                     |
| startup_mode                  | `String`  | Nacos集群的模式，例如`standalone`、`cluster`                                       |
| server_port                   | `int`     | Nacos集群的主端口，例如`8848`                                                      |
| function_mode                 | `String`  | Nacos集群的功能模式，例如`config`、`naming`、`all`, 若为`null`时，相当于`all`                |
| datasource_platform           | `String`  | Nacos集群的数据源类型，例如`mysql`、`derby`等，若为``时，说明使用默认数据源类型                        |
| console_ui_enabled            | `Boolean` | Nacos控制台UI是否启用                                                            |
| auth_enabled                  | `Boolean` | Nacos是否启用鉴权                                                               |
| auth_admin_request            | `Boolean` | Nacos是否需要初始化admin用户`nacos`                                                |
| auth_system_type              | `String`  | Nacos鉴权的插件类型，例如`nacos`等，若为``时，说明使用默认鉴权系统类型                                |
| login_page_enabled            | `Boolean` | Nacos控制台是否启用登录页                                                           |
| plugin_datasource_log_enabled | `Boolean` | Nacos是否启用打印数据源访问Debug日志                                                   |
| config_retention_days         | `int`     | Nacos集群的配置历史数据保留天数，单位为天                                                   | 
| isManageCapacity              | `Boolean` | Nacos是否启用配置容量限制检查，默认为`true`，开启时仅会统计当前配置的使用量，在超过限额时不会拒绝请求。                 |
| isCapacityLimitCheck          | `Boolean` | Nacos是否启用配置容量限制检查，默认为`false`，开启后当配置容量超出限额时，会拒绝配置的变更请求。                    |
| defaultMaxSize                | `int`     | Nacos集群的配置文件大小限制，单位为Byte，默认为`102400`，即100KB。                              |
| defaultGroupQuota             | `int`     | Nacos集群的单个分组（GroupName）下的配置文件数量限额，默认为`200`。                               |
| defaultClusterQuota           | `int`     | Nacos集群的整个集群配置文件数量限额，默认为`100000`。                                         |
| isHealthCheck                 | `Boolean` | Nacos是否启用naming模块健康检查，默认为`true`，开启后当注册到nacos上的服务实例出现异常时，Nacos会主动剔除该服务端节点。 |
| ~~maxContent~~                | `int`     | 已废弃，请使用`defaultMaxSize`。                                                  |
| ~~defaultMaxAggrSize~~        | `int`     | 未实际使用，已废弃                                                                 |
| ~~defaultMaxAggrCount~~       | `int`     | 未实际使用，已废弃                                                                 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/server/state'
```

* 返回示例

```json
{
  "defaultMaxSize": "102400",
  "auth_system_type": "nacos",
  "auth_enabled": "false",
  "defaultMaxAggrSize": "1024",
  "maxHealthCheckFailCount": "12",
  "maxContent": "10485760",
  "console_ui_enabled": "true",
  "defaultMaxAggrCount": "10000",
  "auth_admin_request": "false",
  "defaultGroupQuota": "200",
  "config_retention_days": "30",
  "startup_mode": "standalone",
  "isHealthCheck": "true",
  "version": "3.0.0-SNAPSHOT",
  "function_mode": null,
  "isManageCapacity": "true",
  "isCapacityLimitCheck": "false",
  "datasource_platform": "",
  "notifyConnectTimeout": "100",
  "server_port": "8848",
  "notifySocketTimeout": "200",
  "defaultClusterQuota": "100000",
  "login_page_enabled": "false",
  "plugin_datasource_log_enabled": "false"
}
```

### 1.2. 获取控制台公告信息

#### 接口描述

通过该接口，可以获取到Nacos 控制台希望在浏览器中显示的公告信息。Nacos默认控制台UI会在未开启鉴权时调用此接口，返回集群未开启鉴权的提示。

#### 请求方式

`GET`

#### 鉴权状态

公开接口，无需身份信息。

#### 请求URL

`/v3/console/server/announcement`

#### 请求参数

| 参数名        | 类型       | 必填 | 参数描述                                        |
|------------|----------|----|---------------------------------------------|
| `language` | `String` | 否  | 访问的语言i18n值，默认为`zh-CN`，目前仅支持`zh-CN`和`en-US`。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述      |
|--------|----------|---------|
| `data` | `String` | 控制台公告内容 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/server/announcement?language=zh-CN'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "当前集群没有开启鉴权，请参考<a href=\"https://nacos.io/zh-cn/docs/v2/guide/user/auth.html\">文档</a>开启鉴权~"
}
```

### 1.3. 获取控制台引导内容

#### 接口描述

通过该接口，可以获取Nacos控制台的引导信息。Nacos默认控制台UI会在关闭Nacos控制台UI时调用，以获取引导信息，相关详情请参考[控制台手册-关闭默认控制台](./console/#33-关闭默认控制台)。

#### 请求方式

`GET`

#### 鉴权状态

公开接口，无需身份信息。

#### 请求URL

`/v3/console/server/guide`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述      |
|--------|----------|---------|
| `data` | `String` | 控制台引导内容 | 

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/server/guide'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "当前节点已关闭Nacos开源控制台使用，请修改application.properties中的nacos.console.ui.enabled参数为true打开开源控制台使用，详情查看<a href=\"https://nacos.io/zh-cn/docs/v2/guide/admin/console-guide.html\">文档</a>中关于<code>关闭默认控制台部分</code>。"
}
```

### 1.4. 获取Nacos控制台的存活状态

#### 接口描述

通过该接口，可以获取Nacos控制台的存活状态，Nacos控制台是否可正常接受和响应请求。

#### 请求方式

`GET`

#### 鉴权状态

公开接口，无需身份信息。

#### 请求URL

`/v3/console/health/liveness`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述      |
|--------|----------|---------|
| `data` | `String` | 固定为`ok` |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/health/liveness'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 1.5. 获取Nacos控制台的可读状态

#### 接口描述

通过该接口，可以获取Nacos控制台的是否处于可读取状态，即Nacos控制台是否可以读取到数据。

#### 请求方式

`GET`

#### 鉴权状态

公开接口，无需身份信息。

#### 请求URL

`/v3/console/health/readiness`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述                               |
|--------|----------|----------------------------------|
| `data` | `String` | 若为可读状态时，固定为`ok`，否则为不可读的模块即对应原因信息 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/health/readiness'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 1.6. 获取Nacos节点运行信息

#### 接口描述

通过该接口，可以获取Nacos节点运行信息，包括节点ip，节点运行状态，节点元数据等。

#### 请求方式

`GET`

#### 鉴权状态

需要Nacos 管理员用户权限。

#### 请求URL

`/v3/console/core/cluster/nodes`

#### 请求参数

| 参数名         | 类型       | 必填 | 参数描述                 |
|-------------|----------|----|----------------------|
| `ipKeyWord` | `String` | 否  | 节点ip的过滤关键字，支持前缀模糊匹配。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名 | 参数类型 | 描述 |
|-----|------|----|

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/core/cluster/nodes'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "ip": "127.0.0.1",
      "port": 8848,
      "state": "UP",
      "extendInfo": {
        "lastRefreshTime": 1733221062619,
        "raftMetaData": {
          "metaDataMap": {
            "naming_instance_metadata": {
              "leader": "127.0.0.1:7848",
              "raftGroupMember": [
                "127.0.0.1:7848"
              ],
              "term": 1
            },
            "naming_persistent_service": {
              "leader": "127.0.0.1:7848",
              "raftGroupMember": [
                "127.0.0.1:7848"
              ],
              "term": 1
            },
            "naming_persistent_service_v2": {
              "leader": "127.0.0.1:7848",
              "raftGroupMember": [
                "127.0.0.1:7848"
              ],
              "term": 1
            },
            "naming_service_metadata": {
              "leader": "127.0.0.1:7848",
              "raftGroupMember": [
                "127.0.0.1:7848"
              ],
              "term": 1
            }
          }
        },
        "raftPort": "7848",
        "readyToUpgrade": true,
        "supportGrayModel": true,
        "version": "3.0.0-SNAPSHOT"
      },
      "address": "127.0.0.1:8848",
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

### 1.7. 获取Nacos命名空间列表

#### 接口描述

通过该接口，可以获取当前Nacos集群的命名空间列表。

#### 请求方式

`GET`

#### 鉴权状态

公开接口，无需身份信息。

> 由于命名空间是Nacos的基础隔离概念，因此大多数数据查询的接口都需要选择某个命名空间才能进行查询。因此，获取命名空间列表的能力应该是公开接口。

#### 请求URL

`/v3/console/core/namespace/list`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                 | 参数类型      | 描述                                           |
|---------------------|-----------|----------------------------------------------|
| `namespace`         | `String`  | 命名空间id                                       |
| `namespaceShowName` | `String`  | 命名空间名称                                       |
| `namespaceDesc`     | `String`  | 命名空间描述                                       |
| `configCount`       | `Integer` | 命名空间下的配置个数                                   |
| `quota`             | `Integer` | 命名空间的配置个数配额，需开启配置配额功能才会实际生效，默认不开启，仅做预留字段。    |
| `type`              | `Integer` | 命名空间的类型，预留字段，目前为`0`时为默认命名空间、`2`时为自定义创建的命名空间。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/core/namespace/list'
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

### 1.8. 获取命名空间详情

#### 接口描述

通过该接口，可以获取指定命名空间的详情。

#### 请求方式

`GET`

#### 鉴权状态

需要Nacos 管理员用户权限。

#### 请求URL

`/v3/console/core/namespace`

#### 请求参数

| 参数名           | 类型       | 必填 | 参数描述    |
|---------------|----------|----|---------|
| `namespaceId` | `String` | 是  | 命名空间id。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                 | 参数类型      | 描述                                           |
|---------------------|-----------|----------------------------------------------|
| `namespace`         | `String`  | 命名空间id                                       |
| `namespaceShowName` | `String`  | 命名空间名称                                       |
| `namespaceDesc`     | `String`  | 命名空间描述                                       |
| `configCount`       | `Integer` | 命名空间下的配置个数                                   |
| `quota`             | `Integer` | 命名空间的配置个数配额，需开启配置配额功能才会实际生效，默认不开启，仅做预留字段。    |
| `type`              | `Integer` | 命名空间的类型，预留字段，目前为`0`时为默认命名空间、`2`时为自定义创建的命名空间。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/core/namespace?namespaceId=public'
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

### 1.9. 创建新命名空间

#### 接口描述

通过该接口，可以创建新的命名空间。

#### 请求方式

`POST`

#### 鉴权状态

需要Nacos 管理员用户权限。

#### 请求URL

`/v3/console/core/namespace`

#### 请求参数

| 参数名                 | 类型       | 必填 | 参数描述                     |
|---------------------|----------|----|--------------------------|
| `customNamespaceId` | `String` | 否  | 命名空间id，未填入时将会使用UUID生成ID。 |
| `namespaceName`     | `String` | 是  | 命名空间名称。                  |
| `namespaceDesc`     | `String` | 是  | 命名空间描述。                  |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型      | 描述          |
|--------|-----------|-------------|
| `data` | `Boolean` | 创建命名空间是否成功。 | 

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/core/namespace' -d 'namespaceName=test&namespaceDesc=test'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 1.10. 更新命名空间

#### 接口描述

通过该接口，可以更新命名空间的信息，无法更新命名空间ID，仅能更新命名空间的名称和描述。

#### 请求方式

`PUT`

#### 鉴权状态

需要Nacos 管理员用户权限。

#### 请求URL

`/v3/console/core/namespace`

#### 请求参数

| 参数名             | 类型       | 必填 | 参数描述    |
|-----------------|----------|----|---------|
| `namespaceId`   | `String` | 是  | 命名空间ID  |
| `namespaceName` | `String` | 是  | 命名空间名称。 |
| `namespaceDesc` | `String` | 否  | 命名空间描述。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型      | 描述          |
|--------|-----------|-------------|
| `data` | `Boolean` | 更新命名空间是否成功。 | 

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/core/namespace' -d 'namespaceId=test&namespaceName=test&namespaceDesc=test'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 1.11. 删除命名空间

#### 接口描述

通过该接口，可以删除命名空间。默认命名空间`public`无法被删除。

#### 请求方式

`DELETE`

#### 鉴权状态

需要Nacos 管理员用户权限。

#### 请求URL

`/v3/console/core/namespace`

#### 请求参数

| 参数名           | 类型       | 必填 | 参数描述    |
|---------------|----------|----|---------|
| `namespaceId` | `String` | 是  | 命名空间ID。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型      | 描述          |
|--------|-----------|-------------|
| `data` | `Boolean` | 删除命名空间是否成功。 | 

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8080/v3/console/core/namespace?namespaceId=test'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 1.12. 检查命名空间是否存在

#### 接口描述

通过该接口，可以检查命名空间ID是否存在。默认控制台ID将在创建命名空间前调用，确认自定义的命名空间ID是否已经存在，以防冲突。

#### 请求方式

`GET`

#### 鉴权状态

公开接口，无需身份信息。

#### 请求URL

`/v3/console/core/namespace/exist`

#### 请求参数

| 参数名                 | 类型       | 必填 | 参数描述                          |
|---------------------|----------|----|-------------------------------|
| `customNamespaceId` | `String` | 是  | 命名空间ID，传入空字符串时认为是需要自动生成的UUID。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型      | 描述                             |
|--------|-----------|--------------------------------|
| `data` | `Boolean` | 命名空间是否存在，存在是为`true`，否则为`false` |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/core/namespace/exist?customNamespaceId=test'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": false
}
```

## 2. 配置管理

### 2.1. 获取配置详情

#### 接口描述

通过该接口，可以获取指定配置的详情。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/cs/config`

#### 请求参数

| 参数名           | 类型       | 必填 | 参数描述                |
|---------------|----------|----|---------------------|
| `dataId`      | `String` | 是  | 配置ID。               |
| `groupName`   | `String` | 是  | 配置分组。               |
| `namespaceId` | `String` | 否  | 命名空间ID，默认值为`public` |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

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
curl -X GET 'http://127.0.0.1:8080/v3/console/cs/config?dataId=test&groupName=test'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "appName": "",
    "configTags": null,
    "content": "test",
    "createIp": "127.0.0.1",
    "createTime": 1741681316620,
    "createUser": "nacos",
    "dataId": "test",
    "desc": null,
    "encryptedDataKey": "",
    "groupName": "test",
    "id": "873472517803610112",
    "md5": "098f6bcd4621d373cade4e832627b4f6",
    "modifyTime": 1741681316620,
    "namespaceId": "public",
    "type": "text"
  }
}
```

### 2.2. 发布配置

#### 接口描述

通过该接口，可以创建新的配置或更新已有配置。

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/cs/config`

#### 请求参数

| 参数名           | 类型       | 必填 | 参数描述                     |
|---------------|----------|----|--------------------------|
| `dataId`      | `String` | 是  | 配置ID。                    |
| `groupName`   | `String` | 是  | 配置分组。                    |
| `namespaceId` | `String` | 否  | 命名空间ID，默认值为`public`      |
| `content`     | `String` | 是  | 配置内容。                    |
| `desc`        | `String` | 否  | 配置描述。                    |
| `type`        | `String` | 否  | 配置类型，默认值为`text`。         |
| `configTags`  | `String` | 否  | 配置标签，多个标签之间用英文逗号分隔。      |
| `appName`     | `String` | 否  | 配置所属应用名称，主要用于标记配置所使用的应用。 |

- 当配置已存在(`dataId`,`groupName`相同)时，再次调用此接口将会对此配置进行更新
- 同时更新配置时，若请求`Header`中存在`betaIps`，则会将配置标记为BETA配置，在终止BETA或完全发布配置之前，控制台UI需要进行特殊处理。

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型      | 描述        |
|--------|-----------|-----------|
| `data` | `Boolean` | 创建配置是否成功。 | 

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/cs/config' -d 'dataId=test&groupName=test&namespaceId=public&content=test'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 2.3. 删除配置

#### 接口描述

通过该接口，可以删除指定配置。

#### 请求方式

`DELETE`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/cs/config`

#### 请求参数

| 参数名           | 类型       | 必填 | 参数描述                 |
|---------------|----------|----|----------------------|
| `dataId`      | `String` | 是  | 配置ID。                |
| `groupName`   | `String` | 是  | 配置分组。                |
| `namespaceId` | `String` | 否  | 命名空间ID，默认值为`public`。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型      | 描述        |
|--------|-----------|-----------|
| `data` | `Boolean` | 删除配置是否成功。 | 

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8080/v3/console/cs/config?dataId=test&groupName=test'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 2.4. 批量删除配置

#### 接口描述

通过该接口，可以批量删除指定配置。

#### 请求方式

`DELETE`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/cs/config/batchDelete`

#### 请求参数

| 参数名   | 类型       | 必填 | 参数描述                                  |
|-------|----------|----|---------------------------------------|
| `ids` | `String` | 是  | 配置的存储ID列表，并非`dataId`列表，多个ID之间用英文逗号分隔。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型      | 描述        |
|--------|-----------|-----------|
| `data` | `Boolean` | 删除配置是否成功。 | 

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8080/v3/console/cs/config/batchDelete?ids=838025461287096320,838025489170829312'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 2.5. 查询配置列表

#### 接口描述

通过该接口，可以查询指定命名空间下的配置列表。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/cs/config/list`

#### 请求参数

| 参数名           | 类型        | 必填 | 参数描述                                                                            |
|---------------|-----------|----|---------------------------------------------------------------------------------|
| `pageNo`      | `Integer` | 是  | 当前页码，起始值为1。                                                                     |
| `pageSize`    | `Integer` | 是  | 每页显示的配置数量。                                                                      |
| `search`      | `String`  | 否  | 查询模式，支持`blur`和`accurate`，分别对应模糊搜索和精确搜索，默认值`accurate`                            |
| `namespaceId` | `String`  | 否  | 命名空间ID，默认值为`public`。                                                            |
| `dataId`      | `String`  | 否  | 配置ID，当`search`为`blur`时，可使用`*`进行模糊搜索，例如`test*`，当值为``或缺失时，查询全部符合`groupName`条件的配置。 |
| `groupName`   | `String`  | 否  | 配置分组，当`search`为`blur`时，可使用`*`进行模糊搜索，例如`test*`，当值为``或缺失时，查询全部符合`dataId`条件的配置。    |
| `appName`     | `String`  | 否  | 配置所属应用名称，默认为空，传入时过滤归属于此应用的配置，值为空时查询所有应用的配置。                                     |
| `configTags`  | `String`  | 否  | 配置标签，多个标签之间用英文逗号分隔，默认为空，传入时过滤拥有此tag的配置，值为空时查询所有tag的配置。                          |
| `type`        | `String`  | 否  | 配置的类型，默认值为空，传入时过滤此类型的配置，值为空时查询所有类型的配置。                                          |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

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
curl -X GET 'http://127.0.0.1:8080/v3/console/cs/config/list?dataId=&groupName=&appName=&configTags=&pageNo=1&pageSize=10&namespaceId=&type=&search=blur'
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
        "dataId": "aaa",
        "groupName": "DEFAULT_GROUP",
        "id": "873471898128748544",
        "md5": null,
        "modifyTime": 0,
        "namespaceId": "public",
        "type": "text"
      },
      {
        "appName": "",
        "createTime": 0,
        "dataId": "bbb",
        "groupName": "DEFAULT_GROUP",
        "id": "873473460813172736",
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

### 2.6. 通过配置内容查询配置

:::note
此接口性能较低，过多调用容易造成稳定性问题，请尽量使用其他接口。
:::

#### 接口描述

通过该接口，可以通过配置内容查询对应配置的列表。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/cs/config/searchDetail`

#### 请求参数

| 参数名           | 类型        | 必填 | 参数描述                                                                            |
|---------------|-----------|----|---------------------------------------------------------------------------------|
| `pageNo`      | `Integer` | 是  | 当前页码，起始值为1。                                                                     |
| `pageSize`    | `Integer` | 是  | 每页显示的配置数量。                                                                      |
| `search`      | `String`  | 否  | 查询模式，支持`blur`和`accurate`，分别对应模糊搜索和精确搜索，默认值`accurate`                            |
| `namespaceId` | `String`  | 否  | 命名空间ID，默认值为`public`。                                                            |
| `dataId`      | `String`  | 否  | 配置ID，当`search`为`blur`时，可使用`*`进行模糊搜索，例如`test*`，当值为``或缺失时，查询全部符合`groupName`条件的配置。 |
| `groupName`   | `String`  | 否  | 配置分组，当`search`为`blur`时，可使用`*`进行模糊搜索，例如`test*`，当值为``或缺失时，查询全部符合`dataId`条件的配置。    |
| `appName`     | `String`  | 否  | 配置所属应用名称，默认为空，传入时过滤归属于此应用的配置，值为空时查询所有应用的配置。                                     |
| `configTags`  | `String`  | 否  | 配置标签，多个标签之间用英文逗号分隔，默认为空，传入时过滤拥有此tag的配置，值为空时查询所有tag的配置。                          |
| `type`        | `String`  | 否  | 配置的类型，默认值为空，传入时过滤此类型的配置，值为空时查询所有类型的配置。                                          |
| `content`     | `String`  | 否  | 配置内容，默认值为空，传入时过滤包含此内容的配置，值为空时查询所有内容的配置。                                         |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

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
curl -X GET 'http://127.0.0.1:8080/v3/console/cs/config/searchDetail?dataId=&groupName=&appName=&configTags=&pageNo=1&pageSize=10&namespaceId=&type=&search=blur&configDetail=*11*'
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
      }
    ],
    "pageNumber": 1,
    "pagesAvailable": 1,
    "totalCount": 1
  }
}
```

### 2.7. 查询配置的监听者列表

#### 接口描述

通过该接口，可以查询指定配置的监听者列表。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/cs/config/listener`

#### 请求参数

| 参数名           | 类型       | 必填 | 参数描述                 |
|---------------|----------|----|----------------------|
| `dataId`      | `String` | 是  | 配置ID。                |
| `groupName`   | `String` | 是  | 配置分组。                |
| `namespaceId` | `String` | 否  | 命名空间ID，默认值为`public`。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名               | 参数类型                  | 描述                                    |
|-------------------|-----------------------|---------------------------------------|
| `queryType`       | `String`              | 订阅者查询类型，该接口为`config`。                 |
| `listenersStatus` | `Map<String, String>` | 订阅者列表，key为订阅者IP，value为订阅者订阅当前配置的MD5值。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/cs/config/listener?dataId=test&groupName=test'
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

### 2.8. 查询某个订阅者IP订阅了哪些配置

#### 接口描述

通过该接口，可以查询某个订阅者IP订阅了哪些配置。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/cs/config/listener/ip`

#### 请求参数

| 参数名           | 类型       | 必填 | 参数描述                 |
|---------------|----------|----|----------------------|
| `ip`          | `String` | 是  | 订阅者IP。               |
| `namespaceId` | `String` | 否  | 命名空间ID，默认值为`public`。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名               | 参数类型                  | 描述                                                                            |
|-------------------|-----------------------|-------------------------------------------------------------------------------|
| `queryType`       | `String`              | 订阅者查询类型，该接口为`ip`。                                                             |
| `listenersStatus` | `Map<String, String>` | 订阅者列表，key为订阅的配置信息，格式为`dataId`+`groupName`+`namespaceId`，value为订阅者订阅当前配置的MD5值。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/cs/config/listener/ip?ip=127.0.0.1'
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

### 2.9. 导出配置

#### 接口描述

通过该接口，可以将所选或所查询的配置，导出的配置为zip文件，进行备份或导入到其他Nacos集群。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/cs/config/export2`

#### 请求参数

| 参数名           | 类型       | 必填 | 参数描述                         |
|---------------|----------|----|------------------------------|
| `dataId`      | `String` | 是  | 需要导出的配置ID的pattern，例如`test*`。 |
| `groupName`   | `String` | 是  | 需要导出的配置分组的pattern，例如`test*`。 |
| `ids`         | `String` | 是  | 需要导出的配置的存储ID，多个ID用英文逗号分隔。    |
| `namespaceId` | `String` | 否  | 命名空间ID，默认值为`public`。         |
| `appName`     | `String` | 否  | 需要导出的配置所属的应用名称。              |

> 使用时建议分开使用 `ids` 和 `dataId` + `groupName` 的组合，只选择一种方式，另一类传入空字符串，否则可能导致导出文件为空内容。

#### 返回数据

导出成功是为byte数组的file
attachment模式，导出失败时返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)。

#### 示例

* 请求示例

```shell
curl -X GET "http://127.0.0.1:8080/v3/console/cs/config/export2?dataId=&groupId=&ids=" --output ~/test.zip
```

* 返回示例

```shell
unzip ~/test.zip
> Archive:  /path/to/test.zip
>   inflating: DEFAULT_GROUP/111
>   inflating: DEFAULT_GROUP/qtc-user.yaml
>   inflating: .metadata.yml
```

### 2.10. 导入配置

:::note
目前导入配置接口能够同时支持旧版本导出的zip文件和新版本导出的zip文件，但后续版本可能会移除对旧版本格式导入导出配置的支持，建议使用新的[导出配置](#210-导出配置)
接口进行配置文件的导出。
:::

#### 接口描述

通过该接口，可以将从Nacos导出的zip文件导入到Nacos的指定命名空间中

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/cs/config/import`

#### 请求参数

| 参数名           | 类型                 | 必填 | 参数描述                                                                                                               |
|---------------|--------------------|----|--------------------------------------------------------------------------------------------------------------------|
| `file`        | `MultipartFile`    | 是  | 导入的zip文件。                                                                                                          |
| `namespaceId` | `String`           | 否  | 导入的配置所属的命名空间ID，默认值为`public`。                                                                                       |
| `policy`      | `SameConfigPolicy` | 否  | 导入策略，当导入的配置`dataId`和`groupName`相同，存在冲突时，所进行的导入策略。可选值有`ABORT(终止导入)`,`SKIP(跳过冲突配置)`,`OVERWRITE(覆盖冲突配置)`。默认值为`ABORT`。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名         | 参数类型  | 描述         |
|-------------|-------|------------|
| `succCount` | `int` | 导入成功的配置数量。 |
| `skipCount` | `int` | 导入跳过的配置数量。 |

#### 示例

* 请求示例

```shell
curl -vX POST "http://127.0.0.1:8080/v3/console/cs/config/import?namespaceId=test" -F "file=@/path/to/test.zip"
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

### 2.11. 克隆配置

#### 接口描述

通过该接口，可以将所选或所查询的配置克隆到其他命名空间。

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/cs/config/clone`

#### 请求参数

| 参数名                 | 类型                                   | 必填 | 参数描述                                                                                                               |
|---------------------|--------------------------------------|----|--------------------------------------------------------------------------------------------------------------------|
| `targetNamespaceId` | `String`                             | 是  | 目标命名空间ID。                                                                                                          |
| `policy`            | `SameConfigPolicy`                   | 否  | 克隆策略，当导入的配置`dataId`和`groupName`相同，存在冲突时，所进行的克隆策略。可选值有`ABORT(终止克隆)`,`SKIP(跳过冲突配置)`,`OVERWRITE(覆盖冲突配置)`。默认值为`ABORT`. |
| `body`              | `List<SameNamespaceCloneConfigBean>` | 是  | `body`内容为HTTP请求的body，类型为`application/json`, 需要克隆的配置列表。                                                             |
| `body`[i].`cfgId`   | `String`                             | 是  | 待克隆配置的存储ID。                                                                                                        |
| `body`[i].`dataId`  | `String`                             | 是  | 待克隆配置的目标`dataId`，即克隆后，配置在新命名空间中的`dataId`。                                                                          |
| `body`[i].`group`   | `String`                             | 是  | 待克隆配置的目标分组，即克隆后，配置在新命名空间中的`groupName`。                                                                             |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名         | 参数类型  | 描述         |
|-------------|-------|------------|
| `succCount` | `int` | 成功克隆的配置数量。 |
| `skipCount` | `int` | 克隆跳过的配置数量。 |

#### 示例

* 请求示例

```shell
curl -H "Content-Type: application/json" -X POST  "http://127.0.0.1:8080/v3/console/cs/config/clone?targetNamespaceId=test&policy=ABORT" -d "[{\"cfgId\":\"838029534438625280\",\"dataId\":\"111\",\"group\":\"DEFAULT_GROUP\"},{\"cfgId\":\"838033747294031872\",\"dataId\":\"qtc-user.yaml\",\"group\":\"DEFAULT_GROUP\"}]"
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

### 2.12. 停止配置BETA发布

:::note
只有在[发布配置](#22-发布配置)时设置了`Header`的`betaIps`后，将配置变更为BETA发布中的状态，调用此接口才能停止BETA发布状态。
:::

#### 接口描述

通过该接口，可以将配置从BETA发布状态停止，即回滚配置的Beta发布状态。

#### 请求方式

`DELETE`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/cs/config/beta`

#### 请求参数

| 参数名           | 类型       | 必填 | 参数描述                      |
|---------------|----------|----|---------------------------|
| `dataId`      | `String` | 是  | 配置的`dataId`。              |
| `groupName`   | `String` | 是  | 配置的`groupName`。           |
| `namespaceId` | `String` | 否  | 配置所属的命名空间ID，默认值为`public`。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名 | 参数类型 | 描述 |
|-----|------|----|

#### 示例

* 请求示例

```shell
curl -X DELETE "http://127.0.0.1:8080/v3/console/cs/config/beta?dataId=test&groupName=DEFAULT_GROUP"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 2.13. 查询配置Beta发布状态

:::note
只有在[发布配置](#22-发布配置)时设置了`Header`的`betaIps`后，将配置变更为BETA发布中的状态，调用此接口才能获取到配置详情。
:::

#### 接口描述

通过该接口，可以查询配置的BETA发布状态。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/cs/config/beta`

#### 请求参数

| 参数名           | 类型       | 必填 | 参数描述                      |
|---------------|----------|----|---------------------------|
| `dataId`      | `String` | 是  | 配置的`dataId`。              |
| `groupName`   | `String` | 是  | 配置的`groupName`。           |
| `namespaceId` | `String` | 否  | 配置所属的命名空间ID，默认值为`public`。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

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
curl "http://127.0.0.1:8080/v3/console/cs/config/beta?dataId=111&groupName=DEFAULT_GROUP"
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
    "dataId": "111",
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

### 2.14. 查询配置发布历史

#### 接口描述

通过该接口，可以查询配置的发布历史。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/cs/history/list`

#### 请求参数

| 参数名           | 类型       | 必填 | 参数描述                      |
|---------------|----------|----|---------------------------|
| `pageNo`      | `int`    | 是  | 当前页码，起始为`1`               |
| `pageSize`    | `int`    | 是  | 每页显示的记录数。                 |
| `dataId`      | `String` | 是  | 配置的`dataId`。              |
| `groupName`   | `String` | 是  | 配置的`groupName`。           |
| `namespaceId` | `String` | 否  | 配置所属的命名空间ID，默认值为`public`。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

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
curl "http://127.0.0.1:8080/v3/console/cs/history/list?pageNo=1&pageSize=10&dataId=111&groupName=DEFAULT_GROUP"
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
        "dataId": "111",
        "groupName": "DEFAULT_GROUP",
        "id": "18",
        "md5": null,
        "modifyTime": 1741683760489,
        "namespaceId": "public",
        "opType": "D         ",
        "publishType": "gray",
        "srcIp": "127.0.0.1",
        "srcUser": "nacos",
        "type": null
      },
      {
        "appName": "",
        "createTime": 1272988800000,
        "dataId": "111",
        "groupName": "DEFAULT_GROUP",
        "id": "17",
        "md5": null,
        "modifyTime": 1741683449619,
        "namespaceId": "public",
        "opType": "I         ",
        "publishType": "gray",
        "srcIp": "0:0:0:0:0:0:0:1",
        "srcUser": "nacos",
        "type": null
      },
      {
        "appName": "",
        "createTime": 1272988800000,
        "dataId": "111",
        "groupName": "DEFAULT_GROUP",
        "id": "7",
        "md5": null,
        "modifyTime": 1741682102157,
        "namespaceId": "public",
        "opType": "I         ",
        "publishType": "formal",
        "srcIp": "0:0:0:0:0:0:0:1",
        "srcUser": "nacos",
        "type": null
      }
    ],
    "pageNumber": 1,
    "pagesAvailable": 1,
    "totalCount": 3
  }
}
```

### 2.15. 查询配置的某次历史变更记录

#### 接口描述

通过该接口，可以查询配置的某次历史变更记录。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/cs/history`

#### 请求参数

| 参数名           | 类型       | 必填 | 参数描述                      |
|---------------|----------|----|---------------------------|
| `nid`         | `String` | 是  | 历史记录的ID。                  |
| `dataId`      | `String` | 是  | 配置的dataId。                
| `groupName`   | `String` | 是  | 配置的groupName。             |
| `namespaceId` | `String` | 否  | 配置所属的命名空间ID，默认值为`public`。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

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
curl "http://127.0.0.1:8080/v3/console/cs/history?dataId=111&groupName=DEFAULT_GROUP&nid=7"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
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
  }
}
```

### 2.16. 查询配置最新状态的前一次变更历史

#### 接口描述

通过该接口，可以查询配置最新状态的前一次变更历史。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/cs/history/previous`

#### 请求参数

| 参数名           | 类型       | 必填 | 参数描述                      |
|---------------|----------|----|---------------------------|
| `id`          | `String` | 是  | 配置的存储ID。                  |
| `dataId`      | `String` | 是  | 配置的dataId。                |
| `groupName`   | `String` | 是  | 配置的groupName。             |
| `namespaceId` | `String` | 否  | 配置所属的命名空间ID，默认值为`public`。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

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
curl "http://127.0.0.1:8080/v3/console/cs/history/previous?id=838029534438625280&dataId=111&groupName=DEFAULT_GROUP"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
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
  }
}
```

### 2.17. 查询命名空间下的配置列表

#### 接口描述

通过该接口，可以查询命名空间下的配置列表，仅查询dataId和groupName，用于配置历史UI的下拉选择。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/cs/history/configs`

#### 请求参数

| 参数名           | 类型       | 必填 | 参数描述                      |
|---------------|----------|----|---------------------------|
| `namespaceId` | `String` | 否  | 配置所属的命名空间ID，默认值为`public`。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名         | 参数类型     | 描述            |
|-------------|----------|---------------|
| `dataId`    | `String` | 配置的dataId。    |
| `groupName` | `String` | 配置的groupName。 |

> 其他字段均无用。

#### 示例

* 请求示例

```shell
curl "http://127.0.0.1:8080/v3/console/cs/history/configs?namespaceId=public"
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

## 3. 服务管理

### 3.1. 创建服务

#### 接口描述

通过该接口，可以创建一个空服务。

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ns/service`

#### 请求参数

| 参数名                | 类型                    | 必填 | 参数描述                                                   |
|--------------------|-----------------------|----|--------------------------------------------------------|
| `serviceName`      | `String`              | 是  | 服务名。                                                   |
| `groupName`        | `String`              | 否  | 服务所属的groupName，默认值为`DEFAULT_GROUP`。                    |
| `namespaceId`      | `String`              | 否  | 服务所属的命名空间ID，默认值为`public`。                              |
| `protectThreshold` | `String`              | 否  | 服务的防护阈值，默认值为`0.0`。                                     |
| `selector`         | `jsonString`          | 否  | 服务的路由选择器，默认值为`{"type":"none"}`，无选择器，另外还支持通过label 进行路由。 |
| `metadata`         | `Map<String, String>` | 否  | 服务的元数据，默认值为`{}`。                                       |
| `ephemeral`        | `Boolean`             | 否  | 服务是否临时，默认值为`false`即持久化服务。                              |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述             |
|--------|----------|----------------|
| `data` | `String` | 创建成功时，固定为`ok`。 |

#### 示例

* 请求示例

```shell
curl -X POST "http://127.0.0.1:8080/v3/console/ns/service?serviceName=test&groupName=DEFAULT_GROUP&namespaceId=public"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 3.2. 删除服务

:::note
此接口为删除服务，而不是删除服务实例（服务提供者），且当服务下还有服务实例存在时，服务会无法删除。
:::

#### 接口描述

通过该接口，可以删除一个服务。

#### 请求方式

`DELETE`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ns/service`

#### 请求参数

| 参数名           | 类型       | 必填 | 参数描述                                |
|---------------|----------|----|-------------------------------------|
| `serviceName` | `String` | 是  | 服务名。                                |
| `groupName`   | `String` | 否  | 服务所属的groupName，默认值为`DEFAULT_GROUP`。 |
| `namespaceId` | `String` | 否  | 服务所属的命名空间ID，默认值为`public`。           |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述             |
|--------|----------|----------------|
| `data` | `String` | 删除成功时，固定为`ok`。 |

#### 示例

* 请求示例

```shell
curl -X DELETE "http://127.0.0.1:8080/v3/console/ns/service?serviceName=test&groupName=DEFAULT_GROUP&namespaceId=public"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 3.3. 更新服务元数据

#### 接口描述

通过该接口，可以更新一个服务的元数据。仅能更新服务的元数据，如`metadata`、`selector`
等。服务的serviceName、groupName、namespaceId等不能更新。

#### 请求方式

`PUT`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ns/service`

#### 请求参数

| 参数名                | 类型                    | 必填 | 参数描述                                                   |
|--------------------|-----------------------|----|--------------------------------------------------------|
| `serviceName`      | `String`              | 是  | 服务名。                                                   |
| `groupName`        | `String`              | 否  | 服务所属的groupName，默认值为`DEFAULT_GROUP`。                    |
| `namespaceId`      | `String`              | 否  | 服务所属的命名空间ID，默认值为`public`。                              |
| `protectThreshold` | `String`              | 否  | 服务的防护阈值，默认值为`0.0`。                                     |
| `selector`         | `jsonString`          | 否  | 服务的路由选择器，默认值为`{"type":"none"}`，无选择器，另外还支持通过label 进行路由。 |
| `metadata`         | `Map<String, String>` | 否  | 服务的元数据，默认值为`{}`。                                       |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述             |
|--------|----------|----------------|
| `data` | `String` | 更新成功时，固定为`ok`。 |

#### 示例

* 请求示例

```shell
curl -X PUT "http://127.0.0.1:8080/v3/console/ns/service?serviceName=test&groupName=DEFAULT_GROUP&namespaceId=public" -d "protectThreshold=0"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 3.4. 获取支持的服务路由选择器类型列表

#### 接口描述

通过该接口，可以获取支持的服务路由选择器类型列表，用于控制台UI在创建和更新服务时，选择对应的路由选择器类型的下拉选择框。

#### 请求方式

`GET`

#### 鉴权状态

公开接口，无需身份信息。

#### 请求URL

`/v3/console/ns/service/selector/types`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名     | 参数类型     | 描述                  |
|---------|----------|---------------------|
| `label` | `String` | 通过label表达式进行路由选择过滤。 |
| `none`  | `String` | 无选择器。               |

#### 示例

* 请求示例

```shell
curl -X GET "http://127.0.0.1:8080/v3/console/ns/service/selector/types"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": [
    "label",
    "none"
  ]
}
```

### 3.5. 查询服务列表

#### 接口描述

通过该接口，可以查询指定命名空间下的服务列表。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ns/service/list`

#### 请求参数

| 参数名                  | 类型        | 必填 | 参数描述                              |
|----------------------|-----------|----|-----------------------------------|
| `pageNo`             | `Integer` | 是  | 页码，起始为`1`。                        |
| `pageSize`           | `Integer` | 是  | 每页显示条数。                           |
| `serviceNameParam`   | `String`  | 否  | 服务名的pattern，为空时查询所有服务。            |
| `groupNameParam`     | `String`  | 否  | 服务所属的groupName的pattern，为空时查询所有服务。 |
| `namespaceId`        | `String`  | 否  | 服务所属的命名空间ID。                      |
| `ignoreEmptyService` | `Boolean` | 否  | 是否仅返回有实例的服务，默认为`false`，即查询空服务。    |
| `withInstances`      | `Boolean` | 否  | 是否返回服务的实例详情，默认为`false`。           |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                   | 参数类型     | 描述           |
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
curl -X GET "http://127.0.0.1:8080/v3/console/ns/service/list?pageNo=1&pageSize=10&namespaceId=public"
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

### 3.6. 查询服务的订阅者列表

#### 接口描述

通过该接口，可以查询指定服务下的订阅者列表。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ns/service/subscribers`

#### 请求参数

| 参数名           | 类型        | 必填 | 参数描述                                |
|---------------|-----------|----|-------------------------------------|
| `pageNo`      | `Integer` | 是  | 页码，起始为`1`。                          |
| `pageSize`    | `Integer` | 是  | 每页显示条数。                             |
| `serviceName` | `String`  | 是  | 服务名。                                |
| `groupName`   | `String`  | 否  | 服务所属的groupName，默认值为`DEFAULT_GROUP`。 |
| `namespaceId` | `String`  | 否  | 服务所属的命名空间ID，默认值为`public`。           |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

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
curl -X GET "http://127.0.0.1:8080/v3/console/ns/service/subscribers?pageNo=1&pageSize=10&serviceName=test&groupName=DEFAULT_GROUP"
```

* 返回示例

```json
{
  "code": 0,
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
        "serviceName": "test"
      }
    ],
    "pageNumber": 1,
    "pagesAvailable": 1,
    "totalCount": 1
  },
  "message": "success"
}
```

### 3.7. 查询服务详情

#### 接口描述

通过该接口，可以查询指定服务详情。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ns/service`

#### 请求参数

| 参数名           | 类型       | 必填 | 参数描述                                |
|---------------|----------|----|-------------------------------------|
| `serviceName` | `String` | 是  | 服务名。                                |
| `groupName`   | `String` | 否  | 服务所属的groupName，默认值为`DEFAULT_GROUP`。 |
| `namespaceId` | `String` | 否  | 服务所属的命名空间ID，默认值为`public`。           |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

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
curl -X GET "http://127.0.0.1:8080/v3/console/ns/service?serviceName=test"
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
          "type": "TCP"
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

### 3.8. 更新服务集群元数据

#### 接口描述

通过该接口，可以更新指定服务集群的元数据。

#### 请求方式

`PUT`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ns/service/cluster`

#### 请求参数

| 参数名                     | 类型                    | 必填 | 参数描述                                |
|-------------------------|-----------------------|----|-------------------------------------|
| `clusterName`           | `String`              | 是  | 集群名。                                |
| `serviceName`           | `String`              | 是  | 服务名。                                |
| `checkPort`             | `int`                 | 是  | 健康检查端口。                             |
| `useInstancePort4Check` | `Boolean`             | 是  | 是否使用所注册的实例的`IP:Port`进行健康检查。         |
| `healthChecker`         | `jsonString`          | 是  | 健康检查器。                              |
| `groupName`             | `String`              | 否  | 服务所属的groupName，默认值为`DEFAULT_GROUP`。 |
| `namespaceId`           | `String`              | 否  | 服务所属的命名空间ID，默认值为`public`。           |
| `metadata`              | `Map<String, String>` | 否  | 服务元数据。                              |

> `healthChecker`参数为健康检查器的JSON字符串，目前支持三种健康检查器：
> 1. `None`: 无健康检查，`{"type":"NONE"}`
> 2. `TCP`: TCP端口检查，`{"type":"TCP"}`
> 3. `HTTP`: HTTP端口检查，`{"type":"HTTP","path":"/liveness","headers":"health"}`, 其中`path`为HTTP的uri，`headers`
     为HTTP请求头。

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述             |
|--------|----------|----------------|
| `data` | `String` | 更新成功时，固定为`ok`。 |

#### 示例

* 请求示例

```shell
curl -X PUT "http://127.0.0.1:8080/v3/console/ns/service/cluster" -d "serviceName=test&clusterName=DEFAULT&checkPort=80&useInstancePort4Check=true&healthChecker={\"type\":\"none\"}"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 3.9. 查询服务的实例列表

#### 接口描述

通过该接口，可以查询指定服务的实例列表。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ns/instance/list`

#### 请求参数

| 参数名           | 类型        | 必填 | 参数描述                                |
|---------------|-----------|----|-------------------------------------|
| `pageNo`      | `int`     | 是  | 页码，起始为1。                            |
| `pageSize`    | `int`     | 是  | 每页记录数。                              |
| `serviceName` | `String`  | 是  | 服务名。                                |
| `groupName`   | `String`  | 否  | 服务所属的groupName，默认值为`DEFAULT_GROUP`。 |
| `namespaceId` | `String`  | 否  | 服务所属的命名空间ID，默认值为`public`。           |
| `healthyOnly` | `Boolean` | 否  | 是否只返回健康实例。                          |
| `enabledOnly` | `Boolean` | 否  | 是否只返回未下线实例。                         |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                          | 参数类型                  | 描述                                    |
|------------------------------|-----------------------|---------------------------------------|
| `totalCount`                 | `int`                 | 符合条件的实例的总数。                           |
| `pageNumber`                 | `int`                 | 当前页码，起始为`1`。                          |
| `pagesAvailable`             | `int`                 | 可用页码。                                 |
| `pageItems`                  | `List`                | 实例列表。                                 |
| `pageItems`[i].`instanceId`  | `String`              | 实例ID。                                 |
| `pageItems`[i].`ip`          | `String`              | 实例IP。                                 |
| `pageItems`[i].`port`        | `int`                 | 实例端口。                                 |
| `pageItems`[i].`weight`      | `double`              | 实例权重。                                 |
| `pageItems`[i].`healthy`     | `Boolean`             | 实例是否健康。                               |
| `pageItems`[i].`enabled`     | `Boolean`             | 实例是否已上线。                              |
| `pageItems`[i].`ephemeral`   | `Boolean`             | 实例是否临时。                               |
| `pageItems`[i].`clusterName` | `String`              | 实例所属集群。                               |
| `pageItems`[i].`serviceName` | `String`              | 实例所属服务，格式为`groupName`@@`serviceName`。 |
| `pageItems`[i].`metadata`    | `Map<String, String>` | 实例元数据。                                |

:::note
关于心跳的参数`instanceHeartBeatInterval`, `instanceHeartBeatTimeOut`和`ipDeleteTimeout`
用于兼容1.X客户端的心跳模式数据，后续版本可能会移除对1.X客户端的支持，届时这3个参数将被废弃。
:::

#### 示例

* 请求示例

```shell
curl -X GET "http://127.0.0.1:8080/v3/console/ns/instance/list?&serviceName=test&clusterName=DEFAULT&groupName=DEFAULT_GROUP&pageSize=10&pageNo=1"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "pageItems": [
      {
        "clusterName": "DEFAULT",
        "enabled": true,
        "ephemeral": false,
        "healthy": false,
        "instanceHeartBeatInterval": 5000,
        "instanceHeartBeatTimeOut": 15000,
        "instanceId": "1.1.1.1#3306#DEFAULT#DEFAULT_GROUP@@test",
        "instanceIdGenerator": "simple",
        "ip": "1.1.1.1",
        "ipDeleteTimeout": 30000,
        "metadata": {},
        "port": 3306,
        "serviceName": "DEFAULT_GROUP@@test",
        "weight": 1.0
      }
    ],
    "pageNumber": 1,
    "pagesAvailable": 1,
    "totalCount": 1
  }
}
```

### 3.10. 更新实例元数据

#### 接口描述

通过该接口，可以更新指定服务的实例元数据，包括权重和上下线状态；无法更新实例的服务名、分组名、命名空间、IP及端口。

#### 请求方式

`PUT`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ns/instance`

#### 请求参数

| 参数名           | 类型                    | 必填 | 参数描述                                |
|---------------|-----------------------|----|-------------------------------------|
| `serviceName` | `String`              | 是  | 服务名。                                |
| `ip`          | `String`              | 是  | 实例IP。                               |
| `port`        | `int`                 | 是  | 实例端口。                               |
| `groupName`   | `String`              | 否  | 服务所属的groupName，默认值为`DEFAULT_GROUP`。 |
| `namespaceId` | `String`              | 否  | 服务所属的命名空间ID，默认值为`public`。           |
| `clusterName` | `String`              | 否  | 实例所属集群, 默认值为`DEFAULT`。              |
| `ephemeral`   | `Boolean`             | 否  | 实例是否临时，默认值为`true`。                  |
| `weight`      | `double`              | 否  | 实例权重。                               |
| `enabled`     | `Boolean`             | 否  | 实例是否已上线。                            |
| `metadata`    | `Map<String, String>` | 否  | 实例元数据。                              |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/open-api/#11-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述             |
|--------|----------|----------------|
| `data` | `String` | 更新成功时，固定为`ok`。 |

#### 示例

* 请求示例

```shell
curl -X PUT "http://127.0.0.1:8080/v3/console/ns/instance" -d 'serviceName=test&clusterName=DEFAULT&groupName=DEFAULT_GROUP&ip=1.1.1.1&port=3306&ephemeral=true&weight=100&enabled=false&metadata=%7B%22%E5%95%A6%E5%95%A6%E5%95%A6%26%E5%95%B5%E5%95%B5%E5%95%B5%22%3A%22xxx%22%7D'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```