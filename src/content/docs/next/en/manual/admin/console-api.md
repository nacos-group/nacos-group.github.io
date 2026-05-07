---
title: Console API
keywords: [ Nacos,Console API ]
description: The Nacos Console provides some APIs that you can use to retrieve data when custom-developing a UI for the Nacos Console.
sidebar:
  order: 13
---

# 控制台API

Nacos 提供了若干开放的控制台API，当您有自定义开发Nacos对应的控制台UI需求时，您可以通过这些API，获取Nacos
Server节点中的数据，从而实现自定义的Nacos控制台UI界面。

同时配合关闭Nacos 默认控制台UI来使用自定义UI，相关详情请参考[控制台手册-关闭默认控制台](./console/#33-关闭默认控制台)

## 0. 控制台API 相关说明

### 0.1. 统一路径格式

Nacos的控制台 API，使用统一的Path格式进行的规范。格式为`[/$nacos.console.contextPath]/v3/console/[module]/[subPath]...`,
其中

- `$nacos.console.contextPath`：控制台的根路径，默认为``，可以通过`nacos.console.contextPath`配置项进行修改。
- `module`：控制台的模块名称，例如`server`、`cs`、`ns`、`core`等。
- `subPath`：控制台的子路径，例如`state`、`namespace`、`config`等， 可能有多层子路径。

下列列出的控制台API，采用默认`$nacos.console.contextPath`的情况进行展示，若已修改部署环境中的`$nacos.console.contextPath`
配置项，请自行修改调用API时的请求URL。

同时下列列出的控制台API样例中，均采用默认Nacos Console的端口进行展示，若已修改部署环境中的`$nacos.console.port`
配置项，请自行修改调用API时的请求URL。

### 0.2. 鉴权认证

Nacos 3.X 的控制台 API默认启用鉴权认证，除少量被标记为`公开接口`的API外，请在调用API时，携带正确的身份信息，否则请求将会被拦截。

若想要关闭鉴权，请设置`nacos.core.auth.console.enabled=false`，然后重启Nacos 控制台。

### 0.3. Swagger 类型文档

Nacos 3.X 的控制台 API 也提供了Swagger风格的文档，您可以通过访问[Nacos Swagger控制台 API](/swagger/console/)查看。

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
| version                       | `string` | Nacos集群的版本号，例如`3.0.0`                                                     |
| startup_mode                  | `string` | Nacos集群的模式，例如`standalone`、`cluster`                                       |
| server_port                   | `integer` | Nacos集群的主端口，例如`8848`                                                      |
| function_mode                 | `string` | Nacos集群的功能模式，例如`config`、`naming`、`all`, 若为`null`时，相当于`all`                |
| datasource_platform           | `string` | Nacos集群的数据源类型，例如`mysql`、`derby`等，若为``时，说明使用默认数据源类型                        |
| console_ui_enabled            | `boolean` | Nacos控制台UI是否启用                                                            |
| auth_enabled                  | `boolean` | Nacos是否启用鉴权                                                               |
| auth_admin_request            | `boolean` | Nacos是否需要初始化admin用户`nacos`                                                |
| auth_system_type              | `string` | Nacos鉴权的插件类型，例如`nacos`等，若为``时，说明使用默认鉴权系统类型                                |
| login_page_enabled            | `boolean` | Nacos控制台是否启用登录页                                                           |
| plugin_datasource_log_enabled | `boolean` | Nacos是否启用打印数据源访问Debug日志                                                   |
| config_retention_days         | `integer` | Nacos集群的配置历史数据保留天数，单位为天                                                   | 
| isManageCapacity              | `boolean` | Nacos是否启用配置容量限制检查，默认为`true`，开启时仅会统计当前配置的使用量，在超过限额时不会拒绝请求。                 |
| isCapacityLimitCheck          | `boolean` | Nacos是否启用配置容量限制检查，默认为`false`，开启后当配置容量超出限额时，会拒绝配置的变更请求。                    |
| defaultMaxSize                | `integer` | Nacos集群的配置文件大小限制，单位为Byte，默认为`102400`，即100KB。                              |
| defaultGroupQuota             | `integer` | Nacos集群的单个分组（GroupName）下的配置文件数量限额，默认为`200`。                               |
| defaultClusterQuota           | `integer` | Nacos集群的整个集群配置文件数量限额，默认为`100000`。                                         |
| isHealthCheck                 | `boolean` | Nacos是否启用naming模块健康检查，默认为`true`，开启后当注册到nacos上的服务实例出现异常时，Nacos会主动剔除该服务端节点。 |
| ~~maxContent~~                | `integer` | 已废弃，请使用`defaultMaxSize`。                                                  |
| ~~defaultMaxAggrSize~~        | `integer` | 未实际使用，已废弃                                                                 |
| ~~defaultMaxAggrCount~~       | `integer` | 未实际使用，已废弃                                                                 |

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
| `language` | `string` | 否  | 访问的语言i18n值，默认为`zh-CN`，目前仅支持`zh-CN`和`en-US`。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述      |
|--------|----------|---------|
| `data` | `string` | 控制台公告内容 |

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

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述      |
|--------|----------|---------|
| `data` | `string` | 控制台引导内容 | 

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

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述      |
|--------|----------|---------|
| `data` | `string` | 固定为`ok` |

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

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述                               |
|--------|----------|----------------------------------|
| `data` | `string` | 若为可读状态时，固定为`ok`，否则为不可读的模块即对应原因信息 |

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

无。

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

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

任意有效鉴权身份信息。

> 由于命名空间是Nacos的基础隔离概念，因此大多数数据查询的接口都需要选择某个命名空间才能进行查询。因此，获取命名空间列表的能力应该是任意有效身份信息用户均可访问。

#### 请求URL

`/v3/console/core/namespace/list`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                 | 参数类型      | 描述                                           |
|---------------------|-----------|----------------------------------------------|
| `namespace`         | `string` | 命名空间id                                       |
| `namespaceShowName` | `string` | 命名空间名称                                       |
| `namespaceDesc`     | `string` | 命名空间描述                                       |
| `configCount`       | `integer` | 命名空间下的配置个数                                   |
| `quota`             | `integer` | 命名空间的配置个数配额，需开启配置配额功能才会实际生效，默认不开启，仅做预留字段。    |
| `type`              | `integer` | 命名空间的类型，预留字段，目前为`0`时为默认命名空间、`2`时为自定义创建的命名空间。 |

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
| `namespaceId` | `string` | 是  | 命名空间id。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                 | 参数类型      | 描述                                           |
|---------------------|-----------|----------------------------------------------|
| `namespace`         | `string` | 命名空间id                                       |
| `namespaceShowName` | `string` | 命名空间名称                                       |
| `namespaceDesc`     | `string` | 命名空间描述                                       |
| `configCount`       | `integer` | 命名空间下的配置个数                                   |
| `quota`             | `integer` | 命名空间的配置个数配额，需开启配置配额功能才会实际生效，默认不开启，仅做预留字段。    |
| `type`              | `integer` | 命名空间的类型，预留字段，目前为`0`时为默认命名空间、`2`时为自定义创建的命名空间。 |

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
| `customNamespaceId` | `string` | 否  | 命名空间id，未填入时将会使用UUID生成ID。 |
| `namespaceName`     | `string` | 是  | 命名空间名称。                  |
| `namespaceDesc`     | `string` | 否  | 命名空间描述。                  |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型      | 描述          |
|--------|-----------|-------------|
| `data` | `boolean` | 创建命名空间是否成功。 | 

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
| `namespaceId`   | `string` | 是  | 命名空间ID  |
| `namespaceName` | `string` | 是  | 命名空间名称。 |
| `namespaceDesc` | `string` | 否  | 命名空间描述。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型      | 描述          |
|--------|-----------|-------------|
| `data` | `boolean` | 更新命名空间是否成功。 | 

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
| `namespaceId` | `string` | 是  | 命名空间ID。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型      | 描述          |
|--------|-----------|-------------|
| `data` | `boolean` | 删除命名空间是否成功。 | 

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

任意有效鉴权身份信息。

#### 请求URL

`/v3/console/core/namespace/exist`

#### 请求参数

| 参数名                 | 类型       | 必填 | 参数描述                          |
|---------------------|----------|----|-------------------------------|
| `customNamespaceId` | `string` | 是  | 命名空间ID，传入空字符串时认为是需要自动生成的UUID。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型      | 描述                             |
|--------|-----------|--------------------------------|
| `data` | `boolean` | 命名空间是否存在，存在是为`true`，否则为`false` |

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

### 1.13. 获取插件详情

#### 接口描述

通过该接口，可以按类型和名称获取指定插件的详情信息。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/plugin`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pluginType` | `string` | **是** | 插件类型，如 `auth`（鉴权）、`control`（控制）、`datasource`（数据源）等。 |
| `pluginName` | `string` | **是** | 插件名称，如 `nacos-default-auth-plugin`。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.pluginId | `string` | 插件唯一标识。 |
| data.pluginType | `string` | 插件类型。 |
| data.pluginName | `string` | 插件名称。 |
| data.enabled | `boolean` | 当前是否已启用。 |
| data.critical | `boolean` | 是否为关键插件（关键插件不可被禁用）。 |
| data.configurable | `boolean` | 是否支持控制台动态配置。 |
| data.config | `object` | 插件当前配置项。 |
| data.configDefinitions | `array` | 插件配置项定义列表，用于渲染配置表单。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/plugin?pluginType=auth&pluginName=nacos-default-auth-plugin'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "name": "nacos-default-auth-plugin",
    "type": "auth",
    "enabled": true,
    "config": {}
  }
}
```

### 1.14. 查询插件在集群节点上的可用性

#### 接口描述

通过该接口，可以获取指定插件在各集群节点上的可用情况。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/plugin/availability`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pluginType` | `string` | **是** | 插件类型，如 `auth`、`control`、`datasource` 等。 |
| `pluginName` | `string` | **是** | 插件名称。 |

#### 返回数据

返回 data 为 Map&lt;节点地址, 是否可用&gt;，键为 Nacos 节点地址（如 `127.0.0.1:8848`），值为该节点上该插件是否可用。

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/plugin/availability?pluginType=auth&pluginName=nacos-default-auth-plugin'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "127.0.0.1:8848": true
  }
}
```

### 1.15. 更新插件配置

#### 接口描述

通过该接口，可以更新插件的配置。需要提供插件类型、名称及配置内容。

#### 请求方式

`PUT`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/plugin/config`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pluginType` | `string` | **是** | 插件类型。 |
| `pluginName` | `string` | **是** | 插件名称。 |
| `config` | `string` | 否 | 插件配置内容，JSON 对象，具体字段由插件定义。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data | `string` | 操作结果描述信息。 |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/plugin/config' \
  -d 'pluginType=auth' \
  -d 'pluginName=nacos-default-auth-plugin' \
  -d 'config={}'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "Plugin configuration updated successfully"
}
```

### 1.16. 获取插件列表

#### 接口描述

通过该接口，可以获取插件列表，可按插件类型筛选。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/plugin/list`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pluginType` | `string` | 否 | 插件类型；不传则返回所有类型的插件列表。 |

#### 返回数据

返回 data 为插件信息数组，每项包含插件名称、类型、是否启用等。

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/plugin/list?pluginType=auth'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "name": "nacos-default-auth-plugin",
      "type": "auth",
      "enabled": true
    }
  ]
}
```

### 1.17. 启用或禁用插件

#### 接口描述

通过该接口，可以更新插件的启用状态（启用或禁用）。

#### 请求方式

`PUT`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/plugin/status`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pluginType` | `string` | **是** | 插件类型。 |
| `pluginName` | `string` | **是** | 插件名称。 |
| `enabled` | `boolean` | **是** | 是否启用，`true` 启用、`false` 禁用。 |
| `localOnly` | `boolean` | 否 | 是否仅更新本地节点插件状态。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data | `string` | 操作结果描述信息。 |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/plugin/status' \
  -d 'pluginType=auth' \
  -d 'pluginName=nacos-default-auth-plugin' \
  -d 'enabled=True'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "Plugin status updated successfully"
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
| `dataId`      | `string` | 是  | 配置ID。               |
| `groupName`   | `string` | 是  | 配置分组。               |
| `namespaceId` | `string` | 否  | 命名空间ID，默认值为`public` |

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
| `dataId`      | `string` | 是  | 配置ID。                    |
| `groupName`   | `string` | 是  | 配置分组。                    |
| `namespaceId` | `string` | 否  | 命名空间ID，默认值为`public`      |
| `content`     | `string` | 是  | 配置内容。                    |
| `desc`        | `string` | 否  | 配置描述。                    |
| `type`        | `string` | 否  | 配置类型，默认值为`text`。         |
| `configTags`  | `string` | 否  | 配置标签，多个标签之间用英文逗号分隔。      |
| `appName`     | `string` | 否  | 配置所属应用名称，主要用于标记配置所使用的应用。 |

- 当配置已存在(`dataId`,`groupName`相同)时，再次调用此接口将会对此配置进行更新
- 同时更新配置时，若请求`Header`中存在`betaIps`，则会将配置标记为BETA配置，在终止BETA或完全发布配置之前，控制台UI需要进行特殊处理。

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型      | 描述        |
|--------|-----------|-----------|
| `data` | `boolean` | 创建配置是否成功。 | 

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
| `dataId`      | `string` | 是  | 配置ID。                |
| `groupName`   | `string` | 是  | 配置分组。                |
| `namespaceId` | `string` | 否  | 命名空间ID，默认值为`public`。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型      | 描述        |
|--------|-----------|-----------|
| `data` | `boolean` | 删除配置是否成功。 | 

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
| `ids` | `string` | 是  | 配置的存储ID列表，并非`dataId`列表，多个ID之间用英文逗号分隔。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型      | 描述        |
|--------|-----------|-----------|
| `data` | `boolean` | 删除配置是否成功。 | 

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
| `pageNo`      | `integer` | 是  | 当前页码，起始值为1。                                                                     |
| `pageSize`    | `integer` | 是  | 每页显示的配置数量。                                                                      |
| `dataId`      | `string` | **是** | 配置ID，当`search`为`blur`时，可使用`*`进行模糊搜索，例如`test*`，当值为``或缺失时，查询全部符合`groupName`条件的配置。 |
| `groupName`   | `string` | **是** | 配置分组，当`search`为`blur`时，可使用`*`进行模糊搜索，例如`test*`，当值为``或缺失时，查询全部符合`dataId`条件的配置。    |
| `search`      | `string` | 否  | blur or accurate                            |
| `namespaceId` | `string` | 否  | 命名空间ID，默认值为`public`。                                                            |
| `appName`     | `string` | 否  | 配置所属应用名称，默认为空，传入时过滤归属于此应用的配置，值为空时查询所有应用的配置。                                     |
| `configTags`  | `string` | 否  | 配置标签，多个标签之间用英文逗号分隔，默认为空，传入时过滤拥有此tag的配置，值为空时查询所有tag的配置。                          |
| `type`        | `string` | 否  | 配置的类型，默认值为空，传入时过滤此类型的配置，值为空时查询所有类型的配置。                                          |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                          | 参数类型     | 描述                         |
|------------------------------|----------|----------------------------|
| `totalCount`                 | `integer` | 符合规则的配置总数。                 |
| `pagesAvailable`             | `integer` | 可用页码总数。                    |
| `pageNumber`                 | `integer` | 当前页码。                      |
| `pageItems`                  | `List`   | 符合规则的配置列表。                 |
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
| `pageNo`      | `integer` | 是  | 当前页码，起始值为1。                                                                     |
| `pageSize`    | `integer` | 是  | 每页显示的配置数量。                                                                      |
| `search`      | `string` | 否  | blur or accurate                            |
| `namespaceId` | `string` | 否  | 命名空间ID，默认值为`public`。                                                            |
| `dataId`      | `string` | 否  | 配置ID，当`search`为`blur`时，可使用`*`进行模糊搜索，例如`test*`，当值为``或缺失时，查询全部符合`groupName`条件的配置。 |
| `groupName`   | `string` | 否  | 配置分组，当`search`为`blur`时，可使用`*`进行模糊搜索，例如`test*`，当值为``或缺失时，查询全部符合`dataId`条件的配置。    |
| `appName`     | `string` | 否  | 配置所属应用名称，默认为空，传入时过滤归属于此应用的配置，值为空时查询所有应用的配置。                                     |
| `configTags`  | `string` | 否  | 配置标签，多个标签之间用英文逗号分隔，默认为空，传入时过滤拥有此tag的配置，值为空时查询所有tag的配置。                          |
| `type`         | `string` | 否  | 配置的类型，默认值为空，传入时过滤此类型的配置，值为空时查询所有类型的配置。                                          |
| `configDetail` | `string` | 是  | 配置内容检索条件，用于按配置内容过滤，支持模糊匹配（如 `*11*`）。                                         |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                          | 参数类型     | 描述                         |
|------------------------------|----------|----------------------------|
| `totalCount`                 | `integer` | 符合规则的配置总数。                 |
| `pagesAvailable`             | `integer` | 可用页码总数。                    |
| `pageNumber`                 | `integer` | 当前页码。                      |
| `pageItems`                  | `List`   | 符合规则的配置列表。                 |
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
| `dataId`      | `string` | 是  | 配置ID。                |
| `groupName`   | `string` | 是  | 配置分组。                |
| `namespaceId` | `string` | 否  | 命名空间ID，默认值为`public`。 |
| `aggregation` | `boolean` | 否  | 是否聚合查询。             |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名               | 参数类型                  | 描述                                    |
|-------------------|-----------------------|---------------------------------------|
| `queryType`       | `string` | 订阅者查询类型，该接口为`config`。                 |
| `listenersStatus` | `map<string, string>` | 订阅者列表，key为订阅者IP，value为订阅者订阅当前配置的MD5值。 |

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
| `ip`          | `string` | 是  | 订阅者IP。               |
| `all`         | `boolean` | 否  | 是否查询全部订阅数据。         |
| `namespaceId` | `string` | 否  | 命名空间ID，默认值为`public`。 |
| `aggregation` | `boolean` | 否  | 是否聚合查询。             |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名               | 参数类型                  | 描述                                                                            |
|-------------------|-----------------------|-------------------------------------------------------------------------------|
| `queryType`       | `string` | 订阅者查询类型，该接口为`ip`。                                                             |
| `listenersStatus` | `map<string, string>` | 订阅者列表，key为订阅的配置信息，格式为`dataId`+`groupName`+`namespaceId`，value为订阅者订阅当前配置的MD5值。 |

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
| `dataId`      | `string` | 否  | 需要导出的配置ID的pattern，例如`test*`。 |
| `groupName`   | `string` | 否  | 需要导出的配置分组的pattern，例如`test*`。 |
| `ids`         | `string` | 否  | 需要导出的配置的存储ID，多个ID用英文逗号分隔。    |
| `namespaceId` | `string` | 否  | 命名空间ID，默认值为`public`。         |
| `appName`     | `string` | 否  | 需要导出的配置所属的应用名称。              |

> 使用时建议分开使用 `ids` 和 `dataId` + `groupName` 的组合，只选择一种方式，另一类传入空字符串，否则可能导致导出文件为空内容。

#### 返回数据

导出成功是为byte数组的file
attachment模式，导出失败时返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)。

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

请求体类型：`multipart/form-data`。

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/cs/config/import`

#### 请求参数

| 参数名           | 类型                 | 必填 | 参数描述                                                                                                               |
|---------------|--------------------|----|--------------------------------------------------------------------------------------------------------------------|
| `file`        | `MultipartFile`    | 否  | 导入的zip文件。                                                                                                          |
| `namespaceId` | `string` | 否  | 导入的配置所属的命名空间ID，默认值为`public`。                                                                                       |
| `policy`      | `string` | 否  | 导入策略，当导入的配置`dataId`和`groupName`相同，存在冲突时，所进行的导入策略。可选值有`ABORT(终止导入)`,`SKIP(跳过冲突配置)`,`OVERWRITE(覆盖冲突配置)`。默认值为`ABORT`。 |
| `src_user`    | `string` | 否  | 导入操作来源用户标识。                                                                                                       |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名         | 参数类型  | 描述         |
|-------------|-------|------------|
| `succCount` | `integer` | 导入成功的配置数量。 |
| `skipCount` | `integer` | 导入跳过的配置数量。 |

#### 示例

* 请求示例

```shell
curl -vX POST "http://127.0.0.1:8080/v3/console/cs/config/import" -F "file=@/path/to/test.zip" -F "namespaceId=test"
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

请求体类型：`application/json`，为配置列表数组。

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/cs/config/clone`

#### 请求参数

| 参数名              | 类型       | 必填    | 参数描述                                                                                                               |
|------------------|----------|-------|--------------------------------------------------------------------------------------------------------------------|
| `srcUser`        | `string` | 否     | 克隆操作来源用户标识。                                                                                                        |
| `targetNamespaceId` | `string` | **是** | 目标命名空间ID。                                                                                                           |
| `policy`         | `string` | 否     | 克隆策略，当导入的配置`dataId`和`groupName`相同，存在冲突时，所进行的克隆策略。可选值有`ABORT(终止克隆)`,`SKIP(跳过冲突配置)`,`OVERWRITE(覆盖冲突配置)`。默认值为`ABORT`。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名         | 参数类型  | 描述         |
|-------------|-------|------------|
| `succCount` | `integer` | 成功克隆的配置数量。 |
| `skipCount` | `integer` | 克隆跳过的配置数量。 |

#### 示例

* 请求示例

```shell
curl -H "Content-Type: application/json" -X POST "http://127.0.0.1:8080/v3/console/cs/config/clone?targetNamespaceId=public&policy=ABORT" -d "[{\"cfgId\":838029534438625280,\"dataId\":\"111\",\"group\":\"DEFAULT_GROUP\"},{\"cfgId\":838033747294031872,\"dataId\":\"qtc-user.yaml\",\"group\":\"DEFAULT_GROUP\"}]"
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
| `dataId`      | `string` | 是  | 配置的`dataId`。              |
| `groupName`   | `string` | 是  | 配置的`groupName`。           |
| `namespaceId` | `string` | 否  | 配置所属的命名空间ID，默认值为`public`。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

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
| `dataId`      | `string` | 是  | 配置的`dataId`。              |
| `groupName`   | `string` | 是  | 配置的`groupName`。           |
| `namespaceId` | `string` | 否  | 配置所属的命名空间ID，默认值为`public`。 |

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
| `pageNo`      | `integer` | 是  | 当前页码，起始为`1`               |
| `pageSize`    | `integer` | 是  | 每页显示的记录数。                 |
| `dataId`      | `string` | 是  | 配置的`dataId`。              |
| `groupName`   | `string` | 是  | 配置的`groupName`。           |
| `namespaceId` | `string` | 否  | 配置所属的命名空间ID，默认值为`public`。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                          | 参数类型     | 描述                                |
|------------------------------|----------|-----------------------------------|
| `totalCount`                 | `integer` | 历史记录的总数。                          |
| `pageNumber`                 | `integer` | 当前页码，起始为`1`。                      |
| `pagesAvailable`             | `integer` | 可用页码。                             |
| `pageItems`                  | `List`   | 历史记录列表。                           |
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
| `nid`         | `integer` | 是  | 历史记录的ID。                  |
| `dataId`      | `string` | 是  | 配置的dataId。                
| `groupName`   | `string` | 是  | 配置的groupName。             |
| `namespaceId` | `string` | 否  | 配置所属的命名空间ID，默认值为`public`。 |

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
| `id`          | `integer` | 是  | 配置的存储ID。                  |
| `dataId`      | `string` | 是  | 配置的dataId。                |
| `groupName`   | `string` | 是  | 配置的groupName。             |
| `namespaceId` | `string` | 否  | 配置所属的命名空间ID，默认值为`public`。 |

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
| `namespaceId` | `string` | **是** | 配置所属的命名空间ID，默认值为`public`。 |

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
| `serviceName`      | `string` | 是  | 服务名。                                                   |
| `groupName`        | `string` | 否  | 服务所属的groupName，默认值为`DEFAULT_GROUP`。                    |
| `namespaceId`      | `string` | 否  | 服务所属的命名空间ID，默认值为`public`。                              |
| `protectThreshold` | `number` | 否  | 服务的防护阈值，默认值为`0.0`。                                     |
| `selector`         | `string` | 否  | 服务的路由选择器，默认值为`{"type":"none"}`，无选择器，另外还支持通过label 进行路由。 |
| `metadata`         | `string` | 否  | 服务的元数据，默认值为`{}`。                                       |
| `ephemeral`        | `boolean` | 否  | 服务是否临时，默认值为`false`即持久化服务。                              |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述             |
|--------|----------|----------------|
| `data` | `string` | 创建成功时，固定为`ok`。 |

#### 示例

* 请求示例

```shell
curl -X POST "http://127.0.0.1:8080/v3/console/ns/service" -d "serviceName=test&groupName=DEFAULT_GROUP&namespaceId=public"
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
| `serviceName` | `string` | 是  | 服务名。                                |
| `groupName`   | `string` | 否  | 服务所属的groupName，默认值为`DEFAULT_GROUP`。 |
| `namespaceId` | `string` | 否  | 服务所属的命名空间ID，默认值为`public`。           |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述             |
|--------|----------|----------------|
| `data` | `string` | 删除成功时，固定为`ok`。 |

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
| `serviceName`      | `string` | 是  | 服务名。                                                   |
| `groupName`        | `string` | 否  | 服务所属的groupName，默认值为`DEFAULT_GROUP`。                    |
| `namespaceId`      | `string` | 否  | 服务所属的命名空间ID，默认值为`public`。                              |
| `protectThreshold` | `number` | 否  | 服务的防护阈值，默认值为`0.0`。                                     |
| `ephemeral`        | `boolean` | 否  | 是否临时实例，如 `true`/`false`。                                  |
| `selector`         | `string` | 否  | 服务的路由选择器，默认值为`{"type":"none"}`，无选择器，另外还支持通过label 进行路由。 |
| `metadata`         | `string` | 否  | 服务的元数据，默认值为`{}`。                                       |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述             |
|--------|----------|----------------|
| `data` | `string` | 更新成功时，固定为`ok`。 |

#### 示例

* 请求示例

```shell
curl -X PUT "http://127.0.0.1:8080/v3/console/ns/service" -d "serviceName=test&groupName=DEFAULT_GROUP&namespaceId=public&protectThreshold=0"
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

任意有效鉴权身份信息。

#### 请求URL

`/v3/console/ns/service/selector/types`

#### 请求参数

无

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名     | 参数类型     | 描述                  |
|---------|----------|---------------------|
| `label` | `string` | 通过label表达式进行路由选择过滤。 |
| `none`  | `string` | 无选择器。               |

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
| `pageNo`             | `string` | 是  | 页码，起始为`1`。                        |
| `pageSize`           | `string` | 是  | 每页显示条数。                           |
| `serviceNameParam`   | `string` | 否  | 服务名的pattern，为空时查询所有服务。            |
| `groupNameParam`     | `string` | 否  | 服务所属的groupName的pattern，为空时查询所有服务。 |
| `namespaceId`        | `string` | 否  | 服务所属的命名空间ID。                      |
| `ignoreEmptyService` | `string` | 否  | 是否仅返回有实例的服务，默认为`false`，即查询空服务。    |
| `withInstances`      | `string` | 否  | 是否返回服务的实例详情，默认为`false`。           |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                   | 参数类型     | 描述           |
|---------------------------------------|----------|--------------|
| `totalCount`                          | `integer` | 符合条件的服务的总数。  |
| `pageNumber`                          | `integer` | 当前页码，起始为`1`。 |
| `pagesAvailable`                      | `integer` | 可用页码。        |
| `pageItems`                           | `List`   | 服务列表。        |
| `pageItems`[i].`name`                 | `string` | 服务名。         |
| `pageItems`[i].`groupName`            | `string` | 服务的分组名。      |
| `pageItems`[i].`clusterCount`         | `string` | 服务下的集群数量。    |
| `pageItems`[i].`ipCount`              | `string` | 服务下的实例数量。    |
| `pageItems`[i].`healthyInstanceCount` | `string` | 服务下的健康实例数量。  |
| `pageItems`[i].`triggerFlag`          | `string` | 是否触发了服务的保护。  |

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
| `pageNo`      | `string` | 是  | 页码，起始为`1`。                          |
| `pageSize`    | `string` | 是  | 每页显示条数。                             |
| `serviceName`  | `string` | 是  | 服务名。                                |
| `groupName`    | `string` | 否  | 服务所属的groupName，默认值为`DEFAULT_GROUP`。 |
| `namespaceId`  | `string` | 否  | 服务所属的命名空间ID，默认值为`public`。           |
| `aggregation`  | `string` | 否  | 是否聚合查询。                             |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                          | 参数类型      | 描述                   |
|------------------------------|-----------|----------------------|
| `totalCount`                 | `integer` | 符合条件的服务的总数。          |
| `pageNumber`                 | `integer` | 当前页码，起始为`1`。         |
| `pagesAvailable`             | `integer` | 可用页码。                |
| `pageItems`                  | `List`    | 服务列表。                |
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
| `serviceName` | `string` | 是  | 服务名。                                |
| `groupName`   | `string` | 否  | 服务所属的groupName，默认值为`DEFAULT_GROUP`。 |
| `namespaceId` | `string` | 否  | 服务所属的命名空间ID，默认值为`public`。           |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                                 | 参数类型         | 描述                                   |
|-----------------------------------------------------|--------------|--------------------------------------|
| `namespaceId`                                       | `string` | 服务所属的namespaceId。                    |
| `groupName`                                         | `string` | 服务所属的groupName。                      |
| `serviceName`                                       | `string` | 服务名。                                 |
| `ephemeral`                                         | `boolean` | 服务的持久化属性，`true`为临时服务，`false`为持久化服务。  |
| `protectThreshold`                                  | `number` | 服务防护阈值。                              |
| `selector`                                          | `jsonObject` | 服务选择器。                               |
| `metadata`                                          | `jsonObject` | 服务元数据。                               |
| `clusterMap`                                        | `jsonObject` | 服务集群列表, key为cluster的名称，value为集群详细信息。 |
| `clusterMap`.$ClusterName.`clusterName`             | `string` | 集群名。                                 |
| `clusterMap`.$ClusterName.`healthChecker`           | `jsonObject` | 健康检查器。                               |
| `clusterMap`.$ClusterName.`healthyCheckPort`        | `integer` | 健康检查端口。                              |
| `clusterMap`.$ClusterName.`useInstancePortForCheck` | `boolean` | 是否使用所注册的实例的`IP:Port`进行健康检查。          |
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
| `clusterName`           | `string` | 是  | 集群名。                                |
| `serviceName`           | `string` | 是  | 服务名。                                |
| `checkPort`             | `string` | 是  | 健康检查端口。                             |
| `useInstancePort4Check` | `string` | 是  | 是否使用所注册的实例的`IP:Port`进行健康检查。         |
| `healthChecker`         | `string` | 是  | 健康检查器。                              |
| `groupName`             | `string` | 否  | 服务所属的groupName，默认值为`DEFAULT_GROUP`。 |
| `namespaceId`           | `string` | 否  | 服务所属的命名空间ID，默认值为`public`。           |
| `metadata`              | `string` | 否  | 服务元数据。                              |

> `healthChecker`参数为健康检查器的JSON字符串，目前支持三种健康检查器：
> 1. `None`: 无健康检查，`{"type":"NONE"}`
> 2. `TCP`: TCP端口检查，`{"type":"TCP"}`
> 3. `HTTP`: HTTP端口检查，`{"type":"HTTP","path":"/liveness","headers":"health"}`, 其中`path`为HTTP的uri，`headers`
     为HTTP请求头。

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述             |
|--------|----------|----------------|
| `data` | `string` | 更新成功时，固定为`ok`。 |

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
| `pageNo`      | `integer` | 是  | 页码，起始为1。                            |
| `pageSize`    | `integer` | 是  | 每页记录数。                              |
| `serviceName` | `string` | 是  | 服务名。                                |
| `groupName`   | `string` | 否  | 服务所属的groupName，默认值为`DEFAULT_GROUP`。 |
| `namespaceId`  | `string` | 否  | 服务所属的命名空间ID，默认值为`public`。           |
| `clusterName`  | `string` | 否  | 集群名，不传则查询所有集群的实例。                      |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                          | 参数类型                  | 描述                                    |
|------------------------------|-----------------------|---------------------------------------|
| `totalCount`                 | `integer` | 符合条件的实例的总数。                           |
| `pageNumber`                 | `integer` | 当前页码，起始为`1`。                          |
| `pagesAvailable`             | `integer` | 可用页码。                                 |
| `pageItems`                  | `List`                | 实例列表。                                 |
| `pageItems`[i].`instanceId`  | `string` | 实例ID。                                 |
| `pageItems`[i].`ip`          | `string` | 实例IP。                                 |
| `pageItems`[i].`port`        | `integer` | 实例端口。                                 |
| `pageItems`[i].`weight`      | `number` | 实例权重。                                 |
| `pageItems`[i].`healthy`     | `boolean` | 实例是否健康。                               |
| `pageItems`[i].`enabled`     | `boolean` | 实例是否已上线。                              |
| `pageItems`[i].`ephemeral`   | `boolean` | 实例是否临时。                               |
| `pageItems`[i].`clusterName` | `string` | 实例所属集群。                               |
| `pageItems`[i].`serviceName` | `string` | 实例所属服务，格式为`groupName`@@`serviceName`。 |
| `pageItems`[i].`metadata`    | `map<string, string>` | 实例元数据。                                |

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
| `serviceName` | `string` | 是  | 服务名。                                |
| `ip`          | `string` | 是  | 实例IP。                               |
| `port`        | `integer` | 是  | 实例端口。                               |
| `groupName`   | `string` | 否  | 服务所属的groupName，默认值为`DEFAULT_GROUP`。 |
| `namespaceId` | `string` | 否  | 服务所属的命名空间ID，默认值为`public`。           |
| `clusterName` | `string` | 否  | 实例所属集群, 默认值为`DEFAULT`。              |
| `ephemeral`   | `boolean` | 否  | 实例是否临时，默认值为`true`。                  |
| `weight`      | `number` | 否  | 实例权重。                               |
| `healthy`     | `boolean` | 否  | 实例健康状态。                             |
| `enabled`     | `boolean` | 否  | 实例是否已上线。                            |
| `metadata`    | `string` | 否  | 实例元数据。                              |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述             |
|--------|----------|----------------|
| `data` | `string` | 更新成功时，固定为`ok`。 |

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

## 4. MCP 管理

### 4.1. 查询MCP服务的详情

#### 接口描述

通过该接口，可以查询托管在Nacos上指定MCP服务的服务的详细信息。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/mcp`

#### 请求参数

| 参数名           | 参数类型     | 是否必填  | 描述                                       |
|---------------|----------|-------|------------------------------------------|
| `namespaceId` | `string` | 否     | MCP服务的命名空间ID，默认为`public`                 |
| `mcpId`       | `string` | One of two required | MCP service ID (usually UUID). One of `mcpId` and `mcpName` must be provided (OpenAPI cannot express this constraint; at least one is required in practice). Prefer `mcpId`. |
| `mcpName`     | `string` | One of two required | MCP service name template. One of `mcpId` and `mcpName` must be provided; prefer `mcpId`.    |
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
| `versionDetail`      | `VersionDetail`       | MCP服务所查询的版本信息。                                                                                  |
| `localServerConfig`  | `Map<String, Object>` | MCP服务若类型为**stdio**，存在此信息，记录本地MCP服务的启动信息。                                                        |
| `remoteServerConfig` | `RemoteServerConfig`  | MCP服务若类型为**非stdio**，存在此信息，记录远端服务的信息 。                                                           |
| `enabled`            | `boolean` | MCP服务是否启用。                                                                                      |
| `capabilities`       | `List`                | MCP服务支持的能力类型，如`TOOL`,`PROMPT`,`RESOURCE`。                                                       |
| `backendEndpoints`   | `List`                | MCP服务若类型为**非stdio**，存在此信息，记录访问远端服务的具体地址信息。                                                      |
| `toolSpec`           | `Map<String, Object>` | MCP服务支持的能力类型包含`TOOL`时，存在此信息，记录工具的详细配置信息。                                                        |
| `allVersions`        | `List<VersionDetail>` | MCP服务的所有版本详情的列表。                                                                                |

其中`VersionDetail`结构如下：

| 参数名            | 参数类型      | 描述               |
|----------------|-----------|------------------|
| `version`      | `string` | MCP服务的版本号。       |
| `release_date` | `string` | MCP服务的版本发布时间。    |
| `is_latest`    | `boolean` | MCP服务的版本是否为最新版本。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/mcp?namespaceId=public&mcpName=test&mcpId=d7a64724-a556-4fe4-82fa-e806d43e00dc'
```
* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "",
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

### 4.2. 更新MCP服务

#### 接口描述

通过该接口，可以更新托管在Nacos上的MCP服务。

#### 请求方式

`PUT`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/mcp`

#### 请求参数

| 参数名                     | 参数类型         | 是否必填  | 描述                                                      |
|-------------------------|--------------|-------|---------------------------------------------------------|
| `namespaceId`           | `string` | 否     | MCP服务的命名空间ID，默认为`public`                                |
| `latest`                | `boolean` | 否     | 是否按最新版本更新，如 `true`。                                      |
| `serverSpecification`   | `string` | **是** | MCP服务的描述详情                                              |
| `toolSpecification`     | `string` | 否     | MCP服务的工具描述详情                                            |
| `endpointSpecification` | `string` | 否     | MCP服务的远端服务地址详情，仅在非`stdio`协议时生效                          |
| `overrideExisting`      | `boolean` | 否     | MCP服务更新时是否覆盖原endpointSpecification，默认不覆盖，仅在非`stdio`协议时生效 |

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
| `versionDetail`      | `VersionDetail`       | MCP服务的版本信息。                                                                                     |
| `version`            | `string` | MCP服务的简易版本版本信息，主要用于兼容，若已设置`versionDetail`,则该字段无效。                                               |    |
| `localServerConfig`  | `Map<String, Object>` | MCP服务若类型为**stdio**，存在此信息，记录本地MCP服务的启动信息。                                                        |
| `remoteServerConfig` | `RemoteServerConfig`  | MCP服务若类型为**非stdio**，存在此信息，记录远端服务的信息 。                                                           |
| `enabled`            | `boolean` | MCP服务是否启用。                                                                                      |
| `capabilities`       | `List`                | MCP服务支持的能力类型，如`TOOL`,`PROMPT`,`RESOURCE`。                                                       |

其中`VersionDetail`结构如下：

| 参数名            | 参数类型      | 描述               |
|----------------|-----------|------------------|
| `version`      | `string` | MCP服务的版本号。       |
| `release_date` | `string` | MCP服务的版本发布时间。    |
| `is_latest`    | `boolean` | MCP服务的版本是否为最新版本。 |

> toolSpecification

| 参数名               | 参数类型                       | 描述                                                                                      |
|-------------------|----------------------------|-----------------------------------------------------------------------------------------|
| `tools`           | `List<McpTool>`            | 该MCP Server所提供的工具列表，参考标准MCP协议中对于MCP Tool的定义                                             |
| `toolsMeta`       | `Map<String, McpToolMeta>` | 该MCP Server所提供的工具的额外元数据信息，可用于扩展标准MCP协议中未定义但又使用中需要的信息。key为`McpTool`的`name`, value为拓展元数据。 |
| `securitySchemes` | `List<SecurityScheme>`     | MCP工具的安全方案，参考标准MCP协议。                                                                   |

其中`McpTool`结构如下：

| 参数名           | 参数类型                  | 描述                                            |
|---------------|-----------------------|-----------------------------------------------|
| `name`        | `string` | MCP 工具的名称                                     |
| `description` | `string` | MCP 工具的描述                                     |
| `inputSchema` | `Map<String, Object>` | MCP工具的入参描述，参考标准MCP协议，主要包含，`类型`,`是否必须`,`描述` 等。 |

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
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/mcp' \
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

### 4.3. 创建MCP服务

#### 接口描述

通过该接口，可以创建托管在Nacos上的MCP服务，可以是存量API转换的MCP服务，也可以是MCP市场中的MCP服务。

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/mcp`

#### 请求参数

| 参数名                     | 参数类型         | 是否必填  | 描述                             |
|-------------------------|--------------|-------|--------------------------------|
| `namespaceId`           | `string` | 否     | MCP服务的命名空间ID，默认为`public`       |
| `serverSpecification`   | `string` | **是** | MCP服务的描述详情                     |
| `toolSpecification`     | `string` | 否     | MCP服务的工具描述详情                   |
| `endpointSpecification` | `string` | 否     | MCP服务的远端服务地址详情，仅在非`stdio`协议时生效 |

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
| `versionDetail`      | `VersionDetail`       | MCP服务的版本信息。                                                                                     |
| `version`            | `string` | MCP服务的简易版本版本信息，主要用于兼容，若已设置`versionDetail`,则该字段无效。                                               |    |
| `localServerConfig`  | `Map<String, Object>` | MCP服务若类型为**stdio**，存在此信息，记录本地MCP服务的启动信息。                                                        |
| `remoteServerConfig` | `RemoteServerConfig`  | MCP服务若类型为**非stdio**，存在此信息，记录远端服务的信息 。                                                           |
| `enabled`            | `boolean` | MCP服务是否启用。                                                                                      |
| `capabilities`       | `List`                | MCP服务支持的能力类型，如`TOOL`,`PROMPT`,`RESOURCE`。                                                       |

其中`VersionDetail`结构如下：

| 参数名            | 参数类型      | 描述               |
|----------------|-----------|------------------|
| `version`      | `string` | MCP服务的版本号。       |
| `release_date` | `string` | MCP服务的版本发布时间。    |
| `is_latest`    | `boolean` | MCP服务的版本是否为最新版本。 |

> toolSpecification

| 参数名               | 参数类型                       | 描述                                                                                      |
|-------------------|----------------------------|-----------------------------------------------------------------------------------------|
| `tools`           | `List<McpTool>`            | 该MCP Server所提供的工具列表，参考标准MCP协议中对于MCP Tool的定义                                             |
| `toolsMeta`       | `Map<String, McpToolMeta>` | 该MCP Server所提供的工具的额外元数据信息，可用于扩展标准MCP协议中未定义但又使用中需要的信息。key为`McpTool`的`name`, value为拓展元数据。 |
| `securitySchemes` | `List<SecurityScheme>`     | MCP工具的安全方案，参考标准MCP协议。                                                                   |

其中`McpTool`结构如下：

| 参数名           | 参数类型                  | 描述                                            |
|---------------|-----------------------|-----------------------------------------------|
| `name`        | `string` | MCP 工具的名称                                     |
| `description` | `string` | MCP 工具的描述                                     |
| `inputSchema` | `Map<String, Object>` | MCP工具的入参描述，参考标准MCP协议，主要包含，`类型`,`是否必须`,`描述` 等。 |

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
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/mcp' \
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

### 4.4. 删除MCP服务

#### 接口描述

通过该接口，可以删除托管在Nacos上的MCP服务。

#### 请求方式

`DELETE`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/mcp`

#### 请求参数

| 参数名           | 参数类型     | 是否必填  | 描述                                       |
|---------------|----------|-------|------------------------------------------|
| `namespaceId` | `string` | 否     | MCP服务的命名空间ID，默认为`public`                 |
| `mcpId`       | `string` | One of two required | MCP service ID (usually UUID). One of `mcpId` and `mcpName` must be provided (OpenAPI cannot express this constraint; at least one is required in practice). Prefer `mcpId`. |
| `mcpName`     | `string` | One of two required | MCP service name template. One of `mcpId` and `mcpName` must be provided; prefer `mcpId`.    |
| `version`     | `string` | 否     | MCP服务的版本，未传入是为最新版本                       |


#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述         |
|--------|----------|------------|
| `data` | `string` | MCP服务删除结果。 |

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8080/v3/console/ai/mcp?namespaceId=public&mcpName=test&mcpId=d7a64724-a556-4fe4-82fa-e806d43e00dc'
```
* 返回示例

```json
{
  "code" : 0,
  "message" : "success",
  "data" : "ok"
}
```

### 4.5. 查询MCP服务的服务列表

#### 接口描述

通过该接口，可以查询托管在Nacos上的MCP服务的服务列表。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/mcp/list`

#### 请求参数

| 参数名           | 参数类型     | 是否必填  | 描述                                                     |
|---------------|----------|-------|--------------------------------------------------------|
| `pageNo`      | `integer` | **是** | 当前页，默认为`1`                                             |
| `pageSize`    | `integer` | **是** | 页条目数，默认为`20`，最大为`500`                                  |
| `namespaceId` | `string` | 否     | MCP服务的命名空间ID，默认为`public`                               |
| `mcpName`     | `string`   | 否     | MCP服务的名字模版，为空时查询所有MCP服务，当`search`为`blur`时，可使用`*`进行模糊搜索 |
| `search`      | `string` | 否     | 搜索的类型，可选之`blur`和`accurate`，默认为`blur`。                  |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                           | 参数类型                  | 描述                                                                                              |
|-----------------------------------------------|-----------------------|-------------------------------------------------------------------------------------------------|
| `totalCount`                                  | `integer` | 符合条件的服务的总数。                                                                                     |
| `pageNumber`                                  | `integer` | 当前页码，起始为`1`。                                                                                    |
| `pagesAvailable`                              | `integer` | 可用页码。                                                                                           |
| `pageItems`                                   | `List`                | 服务列表。                                                                                           |
| `pageItems`[i].`id`                           | `string` | MCP服务的ID，一般为UUID。                                                                               |
| `pageItems`[i].`name`                         | `string` | MCP服务名。                                                                                         |
| `pageItems`[i].`protocol`                     | `string` | MCP的协议，如`stdio`,`sse`,`streamable`,`http`,`dubbo`等。                                             |
| `pageItems`[i].`frontProtocol`                | `string` | MCP的前端暴露协议，一般是提供给协议转换器（如网关）使用，若无转换器，则与`protocol`相同，如`stdio`,`sse`,`streamable`,`http`,`dubbo`等。 |
| `pageItems`[i].`description`                  | `string` | MCP服务的描述。                                                                                       |
| `pageItems`[i].`repository`                   | `string` | MCP服务的存储仓库。                                                                                     |                                                                                          |
| `pageItems`[i].`versionDetail`                | `VersionDetail`       | MCP服务当前最新的版本信息。                                                                                 |
| `pageItems`[i].`localServerConfig`            | `Map<String, Object>` | MCP服务若类型为**stdio**，存在此信息，记录本地MCP服务的启动信息。                                                        |
| `pageItems`[i].`remoteServerConfig`           | `RemoteServerConfig`  | MCP服务若类型为**非stdio**，存在此信息，记录远端服务的信息 。                                                           |
| `pageItems`[i].`latestPublishedVersion`       | `string` | MCP服务最新版本的版本号。                                                                                  |
| `pageItems`[i].`versionDetails`               | `List<VersionDetail>` | MCP服务版本详情的列表。                                                                                   |
| `pageItems`[i].`capabilities`                 | `List`                | MCP服务支持的能力类型，如`TOOL`,`PROMPT`,`RESOURCE`。                                                       |

其中`VersionDetail`结构如下：

| 参数名            | 参数类型      | 描述               |
|----------------|-----------|------------------|
| `version`      | `string` | MCP服务的版本号。       |
| `release_date` | `string` | MCP服务的版本发布时间。    |
| `is_latest`    | `boolean` | MCP服务的版本是否为最新版本。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/mcp/list?pageNo=1&pageSize=100&namespaceId=public&search=blur'
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

### 4.6. 导入MCP工具

#### 接口描述

通过该接口，可以通过指定MCP`URL`的方式直接获取MCP工具并导入，避免逐个填写。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/mcp/importToolsFromMcp`

#### 请求参数

| 参数名             | 参数类型     | 是否必填  | 描述                                      |
|-----------------|----------|-------|-----------------------------------------|
| `transportType` | `string` | **是** | MCP服务的传输协议类型，`mcp-sse`或`mcp-streamable` |
| `baseUrl`       | `string` | **是** | MCP服务的baseURL                           |
| `endpoint`      | `string` | **是** | MCP服务的可访问端点                             |
| `authToken`     | `string` | 否     | MCP服务访问的身份Token                         |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型                   | 描述                                                                                                       |
|--------|------------------------|----------------------------------------------------------------------------------------------------------|
| `data` | `List<McpSchema.Tool>` | MCP工具元数据信息,符合[MCP工具元数据标准定义](https://modelcontextprotocol.io/specification/2025-06-18/server/tools#tool)。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/mcp/importToolsFromMcp?transportType=mcp-sse&baseUrl=%2Fsse&endpoint=http%3A%2F%2Flocalhost'
```
* 返回示例

```json
{
  "code" : 0,
  "message" : "success",
  "data" : [ {
    "name" : "getNacosInformation",
    "description" : "Get nacos detail information by nacos cluster name, the information includes nacos hosts and accessToken, accessToken is optional.",
    "inputSchema" : {
      "type" : "object",
      "properties" : {
        "arg0" : {
          "type" : "string",
          "description" : "nacos cluster name"
        }
      },
      "required" : [ "arg0" ],
      "additionalProperties" : false
    }
  } ]
}
```

### 4.7. 验证待导入的MCP服务

#### 接口描述

通过该接口，可以验证当前待导入的MCP服务内容是否符合规则，返回的内容中包含有效个数和无效个数，无效的服务在对应字段中有错误信息。

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/mcp/import/validate`

#### 请求参数

| 参数名           | 参数类型     | 是否必填  | 描述                                      |
|---------------|----------|-------|-----------------------------------------|
| `namespaceId` | `string` | 否     | MCP服务的命名空间ID                            |
| `importType`  | `string` | **是** | 导入的类型，可选值有`file`,`json`和`url`           |
| `data`        | `string` | **是** | 导入数据的内容                                 |
| `cursor`      | `string` | 否     | 分页的起始索引                                 |                         |
| `limit`       | `integer` | 否     | 分页的页大小                                  |
| `search`      | `string`   | 否     | 导入列表的可选模糊搜索关键字。仅当 importType 为`url`时使用。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名              | 参数类型                            | 描述        |
|------------------|---------------------------------|-----------|
| `valid`          | `boolean` | 导入服务是否合法。 |
| `totalCount`     | `integer` | 导入服务总数。   |
| `validCount`     | `integer` | 导入服务有效个数。 |
| `invalidCount`   | `integer` | 导入服务无效个数。 |
| `duplicateCount` | `integer` | 导入服务重复个数。 |
| `servers`        | `List<McpServerValidationItem>` | 导入服务列表。   |
| `errors`         | `List<String>`                  | 导入服务错误列表。 |

其中`McpServerValidationItem`描述如下:

| 参数名          | 参数类型      | 描述       |
|--------------|-----------|----------|
| `serverName` | `string` | 服务名称。    |
| `serverId`   | `string` | 服务ID。    |
| `status`     | `string` | 服务状态。    |
| `selected`   | `boolean` | 服务是否被选中。 |
| `exists`     | `boolean` | 服务是否已存在。 |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/mcp/import/validate' \
-d 'namespaceId=public' \
-d 'importType=url' \
-d 'data=' \
-d 'limit=10'
```
* 返回示例

```json
{
  "code" : 0,
  "message" : "success",
  "data" : {
    "valid" : true,
    "totalCount" : 3,
    "validCount" : 3,
    "invalidCount" : 0,
    "duplicateCount" : 0,
    "servers" : [ {
      "serverName" : "server1",
      "serverId" : "id1",
      "status" : "valid",
      "selected" : true,
      "exists" : false
    }, {
      "serverName" : "server2",
      "serverId" : "id2",
      "status" : "valid",
      "selected" : false,
      "exists" : false
    } ],
    "errors" : [ ]
  }
}
```

### 4.8. 导入的MCP服务

#### 接口描述

通过该接口，可以通过`文件`,`JSON`和指定MCP`URL`的方式直接导入MCP服务，避免逐个填写。

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/mcp/import/execute`

#### 请求参数

| 参数名                | 参数类型      | 是否必填  | 描述                                      |
|--------------------|-----------|-------|-----------------------------------------|
| `namespaceId`      | `string` | 否     | MCP服务的命名空间ID                            |
| `importType`       | `string` | **是** | 导入的类型，可选值有`file`,`json`和`url`           |
| `data`             | `string` | **是** | 导入数据的内容                                 |
| `cursor`           | `string` | 否     | 分页的起始索引                                 |                         |
| `limit`            | `integer` | 否     | 分页的页大小                                  |
| `search`           | `string`    | 否     | 导入列表的可选模糊搜索关键字。仅当 importType 为`url`时使用。 |
| `overrideExisting` | `boolean` | 否     | 导入时若服务已存在时是否覆盖。默认为`false`。              |                                    |
| `skipInvalid`      | `boolean` | 否     | 导入时是否忽略错误无效的服务。默认为`false`。              |
| `selectedServers`  | `string` | 否     | 选择部分服务进行导入,为空时导入所有                      |


#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名            | 参数类型                          | 描述        |
|----------------|-------------------------------|-----------|
| `success`      | `boolean` | 导入服务是否成功。 |
| `totalCount`   | `integer` | 导入服务总数。   |
| `successCount` | `integer` | 导入服务成功个数。 |
| `failedCount`  | `integer` | 导入服务失败个数。 |
| `skippedCount` | `integer` | 导入服务跳过个数。 |
| `results`      | `List<McpServerImportResult>` | 导入服务列表。   |

其中`McpServerImportResult`描述如下:

| 参数名            | 参数类型      | 描述                     |
|----------------|-----------|------------------------|
| `serverName`   | `string` | 服务名称。                  |
| `serverId`     | `string` | 服务ID。                  |
| `status`       | `string` | 服务导入状态。                |
| `errorMessage` | `boolean` | 服务导入失败的错误信息，仅在导入失败时存在。 |


#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/mcp/import/execute' \
-d 'namespaceId=public' \
-d 'importType=url' \
-d 'data=' \
-d 'overrideExisting=false' \
-d 'skipInvalid=false' \
-d 'selectedServers=[]' \
-d 'limit=10'
```
* 返回示例

```json
{
  "code" : 0,
  "message" : "success",
  "data" : {
    "success" : true,
    "totalCount" : 5,
    "successCount" : 4,
    "failedCount" : 1,
    "skippedCount" : 0,
    "results" : [ {
      "serverName" : "server1",
      "serverId" : "id1",
      "status" : "success"
    }, {
      "serverName" : "server2",
      "status" : "failed",
      "errorMessage" : "Connection failed"
    } ]
  }
}
```

## 5. A2A 注册中心

### 5.1. 查询AgentCard的列表

#### 接口描述

通过该接口，可以查询托管在Nacos上的AgentCard的列表。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/a2a/list`

#### 请求参数

| 参数名           | 参数类型     | 是否必填  | 描述                                              |
|---------------|----------|-------|-------------------------------------------------|
| `pageNo`      | `integer` | **是** | 当前页，默认为`1`                                      |
| `pageSize`    | `integer` | **是** | 页条目数，默认为`100`                                   |
| `namespaceId` | `string` | 否     | AgentCard的命名空间ID，默认为`public`                    |
| `agentName`   | `string` | 否     | AgentCard的名称，为空是查询所有AgentCard                   |
| `search`      | `string` | **是** | AgentCard名称的匹配模式，可选之`blur`和`accurate`，默认为`blur` |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                     | 参数类型                       | 描述                                                                                                     |
|-----------------------------------------|----------------------------|--------------------------------------------------------------------------------------------------------|
| `totalCount`                            | `integer` | 符合条件的服务的总数。                                                                                            |
| `pageNumber`                            | `integer` | 当前页码，起始为`1`。                                                                                           |
| `pagesAvailable`                        | `integer` | 可用页码。                                                                                                  |
| `pageItems`                             | `List`                     | 服务列表。                                                                                                  |
| `pageItems`[i].`protocolVersion`        | `string` | AgentCard的A2A协议版本。                                                                                     |
| `pageItems`[i].`name`                   | `string` | AgentCard的名称。                                                                                          |
| `pageItems`[i].`description`            | `string` | AgentCard的描述。                                                                                          |
| `pageItems`[i].`version`                | `string` | AgentCard的版本号。                                                                                         |
| `pageItems`[i].`iconUrl`                | `string` | AgentCard的iconURL。                                                                                     |
| `pageItems`[i].`capabilities`           | `AgentCapability`          | AgentCard的能力，匹配[A2A标准能力](https://a2a-protocol.org/latest/specification/#552-agentcapabilities-object)。 |
| `pageItems`[i].`skills`                 | `List<AgentSkill>`         | AgentCard的技能列表,匹配[A2A标准技能](https://a2a-protocol.org/latest/specification/#554-agentskill-object)。      |
| `pageItems`[i].`latestPublishedVersion` | `string` | AgentCard的最新发布版本。                                                                                      |
| `pageItems`[i].`versionDetails`         | `List<AgentVersionDetail>` | AgentCard的所有版本详情。                                                                                      |
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
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/a2a/list?pageNo=1&pageSize=100&namespaceId=public&search=blur'
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

### 5.2. 查询指定AgentCard的版本列表

#### 接口描述

通过该接口，可以查询指定托管在Nacos上的AgentCard的版本列表。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/a2a/version/list`

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
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/a2a/version/list?namespaceId=public&agentName=GeoSpatial+Route+Planner+Agent'
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

### 5.3. 查询AgentCard的详情

#### 接口描述

通过该接口，可以查询托管在Nacos上指定AgentCard的详细信息。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/a2a`

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
| `capabilities`                      | `AgentCapability`                 | AgentCard的能力，匹配[A2A标准能力](https://a2a-protocol.org/latest/specification/#552-agentcapabilities-object)。   |
| `skills`                            | `List<AgentSkill>`                | AgentCard的技能列表,匹配[A2A标准技能](https://a2a-protocol.org/latest/specification/#554-agentskill-object)。        |
| `url`                               | `string` | AgentCard的默认访问的URL。                                                                                      |
| `preferredTransport`                | `string` | AgentCard的默认访问URL的传输协议，应该为`JSONRPC`,`GRPC`,`HTTP+JSON`。                                                  |
| `additionalInterfaces`              | `List<AgentInterface>`            | AgentCard的所有可访问接口列表,匹配[A2A标准](https://a2a-protocol.org/latest/specification/#555-agentinterface-object)。 |
| `provider`                          | `AgentProvider`                   | AgentCard的提供商信息，匹配[A2A标准](https://a2a-protocol.org/latest/specification/#551-agentprovider-object)。      |
| `documentationUrl`                  | `string` | AgentCard的文档 URL。                                                                                        |
| `securitySchemes`                   | `Map<String, SecurityScheme>`     | AgentCard的安全配置定义。匹配[A2A标准](https://a2a-protocol.org/latest/specification/#553-securityscheme-object)     |
| `security`                          | `List<Map<String, List<String>>>` | AgentCard的所有安全要求对象列表。                                                                                    |
| `defaultInputModes`                 | `List<String>`                    | AgentCard的所有默认输入模式。                                                                                      |
| `defaultOutputModes`                | `List<String>`                    | AgentCard的所有默认输出模式。                                                                                      |
| `supportsAuthenticatedExtendedCard` | `string` | AgentCard是否支持认证的扩展卡。                                                                                     |
| `registrationType`                  | `string` | AgentCard的默认注册类型，可选`URL`和`SERVICE`。                                                                      |
| `latestVersion`                     | `string` | AgentCard当前版本时否为最新版本。                                                                                    |


#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/a2a?namespaceId=public&agentName=GeoSpatial+Route+Planner+Agent&version=1.0.0&registrationType=SERVICE'
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

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/a2a`

#### 请求参数

| 参数名                | 参数类型        | 是否必填  | 描述                                                                                                              |
|--------------------|-------------|-------|-----------------------------------------------------------------------------------------------------------------|
| `namespaceId`      | `string` | 否     | AgentCard所属的命名空间，默认`public`                                                                                     |
| `agentCard`        | `string` | **是** | AgentCard的完整对象，详情请参考[标准AgentCard](https://a2a-protocol.org/latest/specification/#55-agentcard-object-structure) |
| `registrationType` | `string` | 否     | AgentCard的默认注册类型，可选`URL`和`SERVICE`。未填写时根据此AgentCard的默认`registrationType`进行`url`的生成                              |
| `setAsLatest`      | `boolean` | 否     | 是否设置此版本为最新发布版本，默认为false                                                                                         |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述               |
|--------|----------|------------------|
| `data` | `string` | AgentCard服务更新结果。 |


#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/a2a' \
-d 'namespaceId=public' \
-d 'agentCard={"protocolVersion":"0.2.9","name":"GeoSpatial Route Planner Agent","description":"Provides advanced route planning, traffic analysis, and custom map generation services. This agent can calculate optimal routes, estimate travel times considering real-time traffic, and create personalized maps with points of interest.","url":"https://georoute-agent.example.com/a2a/v1","preferredTransport":"JSONRPC","additionalInterfaces":[{"url":"https://georoute-agent.example.com/a2a/v1","transport":"JSONRPC"},{"url":"https://georoute-agent.example.com/a2a/grpc","transport":"GRPC"},{"url":"https://georoute-agent.example.com/a2a/json","transport":"HTTP+JSON"}],"provider":{"organization":"Example Geo Services Inc.","url":"https://www.examplegeoservices.com"},"iconUrl":"https://georoute-agent.example.com/icon.png","version":"1.2.0","documentationUrl":"https://docs.examplegeoservices.com/georoute-agent/api","capabilities":{"streaming":true,"pushNotifications":true,"stateTransitionHistory":false},"securitySchemes":{"google":{"type":"openIdConnect","openIdConnectUrl":"https://accounts.google.com/.well-known/openid-configuration"}},"security":[{"google":["openid","profile","email"]}],"defaultInputModes":["application/json","text/plain"],"defaultOutputModes":["application/json","image/png"],"skills":[{"id":"route-optimizer-traffic","name":"Traffic-Aware Route Optimizer","description":"Calculates the optimal driving route between two or more locations, taking into account real-time traffic conditions, road closures, and user preferences (e.g., avoid tolls, prefer highways).","tags":["maps","routing","navigation","directions","traffic"],"examples":["Plan a route from '1600 Amphitheatre Parkway, Mountain View, CA' to 'San Francisco International Airport' avoiding tolls.","{\"origin\": {\"lat\": 37.422, \"lng\": -122.084}, \"destination\": {\"lat\": 37.7749, \"lng\": -122.4194}, \"preferences\": [\"avoid_ferries\"]}"],"inputModes":["application/json","text/plain"],"outputModes":["application/json","application/vnd.geo+json","text/html"]},{"id":"custom-map-generator","name":"Personalized Map Generator","description":"Creates custom map images or interactive map views based on user-defined points of interest, routes, and style preferences. Can overlay data layers.","tags":["maps","customization","visualization","cartography"],"examples":["Generate a map of my upcoming road trip with all planned stops highlighted.","Show me a map visualizing all coffee shops within a 1-mile radius of my current location."],"inputModes":["application/json"],"outputModes":["image/png","image/jpeg","application/json","text/html"]}],"supportsAuthenticatedExtendedCard":true,"signatures":[{"protected":"eyJhbGciOiJFUzI1NiIsInR5cCI6IkpPU0UiLCJraWQiOiJrZXktMSIsImprdSI6Imh0dHBzOi8vZXhhbXBsZS5jb20vYWdlbnQvandrcy5qc29uIn0","signature":"QFdkNLNszlGj3z3u0YQGt_T9LixY3qtdQpZmsTdDHDe3fXV9y9-B3m2-XgCpzuhiLt8E0tV6HXoZKHv4GtHgKQ"}]}' \
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

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/a2a`

#### 请求参数

| 参数名                | 参数类型        | 是否必填  | 描述                                                                                                              |
|--------------------|-------------|-------|-----------------------------------------------------------------------------------------------------------------|
| `namespaceId`      | `string` | 否     | AgentCard所属的命名空间，默认`public`                                                                                     |
| `agentCard`        | `string` | **是** | AgentCard的完整对象，详情请参考[标准AgentCard](https://a2a-protocol.org/latest/specification/#55-agentcard-object-structure) |
| `registrationType` | `string` | 否     | AgentCard的默认注册类型，可选`URL`和`SERVICE`。未填写时根据此AgentCard的默认`registrationType`进行`url`的生成, 默认值为`URL`                   |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名    | 参数类型     | 描述             |
|--------|----------|----------------|
| `data` | `string` | AgentCard发布结果。 |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/a2a' \
-d 'namespaceId=public' \
-d 'agentCard={"protocolVersion":"0.2.9","name":"GeoSpatial Route Planner Agent","description":"Provides advanced route planning, traffic analysis, and custom map generation services. This agent can calculate optimal routes, estimate travel times considering real-time traffic, and create personalized maps with points of interest.","url":"https://georoute-agent.example.com/a2a/v1","preferredTransport":"JSONRPC","additionalInterfaces":[{"url":"https://georoute-agent.example.com/a2a/v1","transport":"JSONRPC"},{"url":"https://georoute-agent.example.com/a2a/grpc","transport":"GRPC"},{"url":"https://georoute-agent.example.com/a2a/json","transport":"HTTP+JSON"}],"provider":{"organization":"Example Geo Services Inc.","url":"https://www.examplegeoservices.com"},"iconUrl":"https://georoute-agent.example.com/icon.png","version":"1.2.0","documentationUrl":"https://docs.examplegeoservices.com/georoute-agent/api","capabilities":{"streaming":true,"pushNotifications":true,"stateTransitionHistory":false},"securitySchemes":{"google":{"type":"openIdConnect","openIdConnectUrl":"https://accounts.google.com/.well-known/openid-configuration"}},"security":[{"google":["openid","profile","email"]}],"defaultInputModes":["application/json","text/plain"],"defaultOutputModes":["application/json","image/png"],"skills":[{"id":"route-optimizer-traffic","name":"Traffic-Aware Route Optimizer","description":"Calculates the optimal driving route between two or more locations, taking into account real-time traffic conditions, road closures, and user preferences (e.g., avoid tolls, prefer highways).","tags":["maps","routing","navigation","directions","traffic"],"examples":["Plan a route from '1600 Amphitheatre Parkway, Mountain View, CA' to 'San Francisco International Airport' avoiding tolls.","{\"origin\": {\"lat\": 37.422, \"lng\": -122.084}, \"destination\": {\"lat\": 37.7749, \"lng\": -122.4194}, \"preferences\": [\"avoid_ferries\"]}"],"inputModes":["application/json","text/plain"],"outputModes":["application/json","application/vnd.geo+json","text/html"]},{"id":"custom-map-generator","name":"Personalized Map Generator","description":"Creates custom map images or interactive map views based on user-defined points of interest, routes, and style preferences. Can overlay data layers.","tags":["maps","customization","visualization","cartography"],"examples":["Generate a map of my upcoming road trip with all planned stops highlighted.","Show me a map visualizing all coffee shops within a 1-mile radius of my current location."],"inputModes":["application/json"],"outputModes":["image/png","image/jpeg","application/json","text/html"]}],"supportsAuthenticatedExtendedCard":true,"signatures":[{"protected":"eyJhbGciOiJFUzI1NiIsInR5cCI6IkpPU0UiLCJraWQiOiJrZXktMSIsImprdSI6Imh0dHBzOi8vZXhhbXBsZS5jb20vYWdlbnQvandrcy5qc29uIn0","signature":"QFdkNLNszlGj3z3u0YQGt_T9LixY3qtdQpZmsTdDHDe3fXV9y9-B3m2-XgCpzuhiLt8E0tV6HXoZKHv4GtHgKQ"}]}' \
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

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/a2a`

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
curl -X DELETE 'http://127.0.0.1:8080/v3/console/ai/a2a?namespaceId=public&agentName=GeoSpatial+Route+Planner+Agent&version=1.0.0'
```
* 返回示例

```json
{
  "code" : 0,
  "message" : "success",
  "data" : "ok"
}
```

## 6. Prompt 管理

Prompt 管理 API 提供 Prompt 的发布、查询、标签绑定与版本管理能力。

### 6.1. 发布Prompt

#### 接口描述

通过该接口，可以发布新版本的Prompt。

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，不传默认为 `public`。 |
| `promptKey` | `string` | **是** | Prompt 的唯一键/标识。 |
| `version` | `string` | **是** | 版本号，如 `1.0.0`。 |
| `template` | `string` | **是** | Prompt 模板正文内容。 |
| `commitMsg` | `string` | 否 | 本次发布的提交说明。 |
| `description` | `string` | 否 | Prompt 的描述信息。 |
| `bizTags` | `string` | 否 | 业务标签，用于分类检索，多个标签可逗号分隔。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data | `boolean` | 是否发布成功。 |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/prompt' \
  -d 'namespaceId=public' \
  -d 'promptKey=my-prompt' \
  -d 'version=1.0.0' \
  -d 'template=' \
  -d 'commitMsg=' \
  -d 'description=' \
  -d 'bizTags='
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 6.2. 删除Prompt

#### 接口描述

通过该接口，可以删除指定Prompt。

#### 请求方式

`DELETE`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，不传默认为 `public`。 |
| `promptKey` | `string` | **是** | 要删除的 Prompt 的唯一键。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data | `boolean` | 是否删除成功。 |

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8080/v3/console/ai/prompt?namespaceId=public&promptKey=my-prompt'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 6.3. 查询Prompt详情

#### 接口描述

通过该接口，可按标签/版本/最新优先查询Prompt详情。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt/detail`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，不传默认为 `public`。 |
| `promptKey` | `string` | **是** | Prompt 的唯一键。 |
| `version` | `string` | 否 | 指定版本号；不传时与 `label`、`md5` 一起决定返回版本（标签或最新等）。 |
| `label` | `string` | 否 | 标签名，如 `stable`、`latest`，返回该标签指向的版本。 |
| `md5` | `string` | 否 | 内容 MD5，用于精确匹配某一版本。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.promptKey | `string` | Prompt 唯一键。 |
| data.version | `string` | 版本号。 |
| data.commitMsg | `string` | 该版本的提交说明。 |
| data.srcUser | `string` | 发布该版本的用户。 |
| data.gmtModified | `integer` | 最后修改时间戳。 |
| data.template | `string` | Prompt 模板正文。 |
| data.md5 | `string` | 内容 MD5。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/prompt/detail?namespaceId=public&promptKey=my-prompt&version=1.0.0&label=&md5='
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

通过该接口，可将标签绑定到指定Prompt版本。

#### 请求方式

`PUT`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt/label`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，不传默认为 `public`。 |
| `promptKey` | `string` | **是** | Prompt 的唯一键。 |
| `label` | `string` | **是** | 标签名，如 `stable`、`latest`。 |
| `version` | `string` | **是** | 要绑定到的版本号。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data | `boolean` | 是否绑定成功。 |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/prompt/label' \
  -d 'namespaceId=public' \
  -d 'promptKey=my-prompt' \
  -d 'label=stable' \
  -d 'version=1.0.0'
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

通过该接口，可解绑Prompt的标签。

#### 请求方式

`DELETE`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt/label`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，不传默认为 `public`。 |
| `promptKey` | `string` | **是** | Prompt 的唯一键。 |
| `label` | `string` | **是** | 要解绑的标签名。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data | `boolean` | 是否解绑成功。 |

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8080/v3/console/ai/prompt/label?namespaceId=public&promptKey=my-prompt&label=stable'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 6.6. 查询Prompt列表

#### 接口描述

通过该接口，可以分页查询Prompt列表。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt/list`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pageNo` | `integer` | **是** | 页码，从 1 开始。 |
| `pageSize` | `integer` | **是** | 每页条数。 |
| `namespaceId` | `string` | 否 | 命名空间 ID，不传默认为 `public`。 |
| `promptKey` | `string` | 否 | 按 Prompt 键过滤，支持模糊或精确（由 `search` 决定）。 |
| `search` | `string` | 否 | 搜索模式：`blur` 模糊匹配，`accurate` 精确匹配。 |
| `bizTags` | `string` | 否 | 按业务标签过滤。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| totalCount | `integer` | 总条数。 |
| pageNumber | `integer` | 当前页码。 |
| pagesAvailable | `integer` | 总页数。 |
| pageItems | `List` | 当前页的 Prompt 摘要列表。 |
| pageItems[i].schemaVersion | `integer` | 元数据 schema 版本。 |
| pageItems[i].promptKey | `string` | Prompt 唯一键。 |
| pageItems[i].description | `string` | 描述。 |
| pageItems[i].bizTags | `array` | 业务标签。 |
| pageItems[i].latestVersion | `string` | 最新版本号。 |
| pageItems[i].gmtModified | `integer` | 最后修改时间戳。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/prompt/list?pageNo=1&pageSize=10&namespaceId=public&promptKey=&search=blur&bizTags='
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

### 6.7. 查询Prompt元数据

#### 接口描述

通过该接口，可以查询指定Prompt的元数据信息。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt/metadata`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，不传默认为 `public`。 |
| `promptKey` | `string` | **是** | Prompt 的唯一键。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.schemaVersion | `integer` | 元数据 schema 版本。 |
| data.promptKey | `string` | Prompt 唯一键。 |
| data.description | `string` | 描述。 |
| data.bizTags | `array` | 业务标签。 |
| data.latestVersion | `string` | 最新版本号。 |
| data.gmtModified | `integer` | 最后修改时间戳。 |
| data.versions | `array` | 版本列表摘要。 |
| data.labels | `object` | 标签与版本号的映射。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/prompt/metadata?namespaceId=public&promptKey=my-prompt'
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

### 6.8. 更新Prompt元数据

#### 接口描述

通过该接口，可更新Prompt的元数据（如描述、业务标签）。

#### 请求方式

`PUT`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt/metadata`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，不传默认为 `public`。 |
| `promptKey` | `string` | **是** | Prompt 的唯一键。 |
| `description` | `string` | 否 | 更新后的描述。 |
| `bizTags` | `string` | 否 | 更新后的业务标签。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data | `boolean` | 是否更新成功。 |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/prompt/metadata' \
  -d 'namespaceId=public' \
  -d 'promptKey=my-prompt' \
  -d 'description=' \
  -d 'bizTags='
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 6.9. 查询Prompt版本列表

#### 接口描述

通过该接口，可以分页查询指定Prompt的版本列表。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt/versions`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，不传默认为 `public`。 |
| `promptKey` | `string` | **是** | Prompt 的唯一键。 |
| `pageNo` | `integer` | **是** | 页码，从 1 开始。 |
| `pageSize` | `integer` | **是** | 每页条数。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| totalCount | `integer` | 总条数。 |
| pageNumber | `integer` | 当前页码。 |
| pagesAvailable | `integer` | 总页数。 |
| pageItems | `List` | 当前页的版本列表。 |
| pageItems[i].promptKey | `string` | Prompt 唯一键。 |
| pageItems[i].version | `string` | 版本号。 |
| pageItems[i].commitMsg | `string` | 该版本的提交说明。 |
| pageItems[i].srcUser | `string` | 发布该版本的用户。 |
| pageItems[i].gmtModified | `integer` | 最后修改时间戳。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/prompt/versions?namespaceId=public&promptKey=my-prompt&pageNo=1&pageSize=10'
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

## 7. Skills 管理

Skills 管理 API 提供 Skill 的注册、查询、更新、删除及列表、ZIP 上传能力。

### 7.1. 查询Skill详情

#### 接口描述

通过该接口，可以查询托管在Nacos上指定Skill的详细信息。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/skills`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，不传默认为 `public`。 |
| `skillName` | `string` | **是** | Skill 名称/唯一标识。 |
| `version` | `string` | 否 | 版本号；不传则返回最新版本。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.namespaceId | `string` | 所属命名空间 ID。 |
| data.name | `string` | Skill 名称。 |
| data.description | `string` | Skill 描述。 |
| data.instruction | `string` | Skill 使用说明/指令。 |
| data.resource | `object` | Skill 关联资源信息。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/skills?namespaceId=public&skillName=my-skill&version=1.0.0'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "name": "my-skill",
    "description": "",
    "instruction": "",
    "resource": {},
    "versionDetail": {
      "version": "1.0.0"
    }
  }
}
```

### 7.2. 删除Skill

#### 接口描述

通过该接口，可以删除托管在Nacos上的Skill。

#### 请求方式

`DELETE`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/skills`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID，不传默认为 `public`。 |
| `skillName` | `string` | **是** | 要删除的 Skill 名称。 |
| `version` | `string` | 否 | 版本号；不传则删除该 Skill 下所有版本（或按实现语义）。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data | `string` | 操作结果，成功时为 `ok`。 |

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8080/v3/console/ai/skills?namespaceId=public&skillName=my-skill&version=1.0.0'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 7.3. 查询Skill列表

#### 接口描述

通过该接口，可以查询托管在Nacos上的Skill列表。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/skills/list`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pageNo` | `integer` | **是** | 页码，从 1 开始。 |
| `pageSize` | `integer` | **是** | 每页条数。 |
| `namespaceId` | `string` | 否 | 命名空间 ID，不传默认为 `public`。 |
| `skillName` | `string` | 否 | 按 Skill 名称过滤，支持模糊或精确（由 `search` 决定）。 |
| `search` | `string` | 否 | 搜索模式：`blur` 模糊匹配，`accurate` 精确匹配。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| totalCount | `integer` | 总条数。 |
| pageNumber | `integer` | 当前页码。 |
| pagesAvailable | `integer` | 总页数。 |
| pageItems | `List` | 当前页的 Skill 摘要列表。 |
| pageItems[i].namespaceId | `string` | 所属命名空间 ID。 |
| pageItems[i].name | `string` | Skill 名称。 |
| pageItems[i].description | `string` | 描述。 |
| pageItems[i].updateTime | `integer` | 最后更新时间戳。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/skills/list?pageNo=1&pageSize=100&namespaceId=public&skillName=&search=blur'
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
        "versionDetail": {
          "version": "1.0.0"
        }
      }
    ]
  }
}
```

### 7.4. 上传Skill（ZIP）

#### 接口描述

通过该接口，可通过ZIP文件上传Skill。

#### 请求方式

`POST`

请求体类型：`multipart/form-data`。

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/skills/upload`

#### 请求参数

| 参数名         | 类型     | 必填 | 参数描述                                                                 |
|-------------|--------|----|----------------------------------------------------------------------|
| `file`      | `file` | 否  | 包含 Skill 定义的 ZIP 文件。                                                  |
| `namespaceId` | `string` | 否 | 命名空间 ID，不传默认为 `public`。                                                 |
| `overwrite` | `boolean` | 否 | 导入时若 Skill 已存在是否覆盖，默认 `false`。                                          |
| `targetVersion` | `string` | 否 | 要创建的 Skill 版本号，例如 `1.0.0`。版本解析优先级：`SKILL.md` 中 frontmatter 的 `metadata.version` → ZIP 包中的 `meta.json` → 该 `targetVersion` 参数 → 默认 `0.0.1`。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data | `string` | 解析并注册后的 Skill 名称。 |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/skills/upload' \
  -F "file=@/path/to/skill.zip" \
  -F "namespaceId=public" \
  -F "targetVersion=1.0.0"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "my-skill"
}
```

### 7.5. Update Skill Business Tags
#### 接口描述
This interface allows updating the business tag list of a skill without changing version status.

#### 请求方式

`PUT`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/skills/biz-tags`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `skillName` | `string` | **是** | - |
| `bizTags` | `string` | **是** | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/skills/biz-tags' -d "namespaceId=namespaceId&skillName=skillName&bizTags=bizTags"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 7.6. Delete Skill Draft Version
#### 接口描述
This interface allows deleting the current draft version of a specified skill.

#### 请求方式

`DELETE`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/skills/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `skillName` | `string` | **是** | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8080/v3/console/ai/skills/draft?namespaceId=namespaceId&skillName=skillName'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 7.7. Create Skill Draft Version
#### 接口描述
This interface allows creating a draft version based on an existing version or a brand-new SkillCard.

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/skills/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `skillName` | `string` | 否 | - |
| `basedOnVersion` | `string` | 否 | - |
| `targetVersion` | `string` | 否 | - |
| `skillCard` | `string` | 否 | Skill card JSON; required if basedOnVersion is not set |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/skills/draft' -d "namespaceId=namespaceId&skillName=skillName&basedOnVersion=basedOnVersion&targetVersion=targetVersion&skillCard=skillCard"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 7.8. Update Skill Draft Content
#### 接口描述
This interface allows updating the SkillCard content of the current draft version.

#### 请求方式

`PUT`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/skills/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `skillName` | `string` | **是** | - |
| `skillCard` | `string` | **是** | Skill card JSON string containing complete Skill information |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/skills/draft' -d "namespaceId=namespaceId&skillName=skillName&skillCard=skillCard"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 7.9. Update Skill Version Labels
#### 接口描述
This interface allows updating skill version routing labels (e.g. latest label) without changing version status.

#### 请求方式

`PUT`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/skills/labels`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `skillName` | `string` | **是** | - |
| `labels` | `string` | **是** | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/skills/labels' -d "namespaceId=namespaceId&skillName=skillName&labels=labels"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 7.10. Offline Skill
#### 接口描述
This interface allows executing an offline operation on a specific version or the entire skill, making it not callable.

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/skills/offline`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `skillName` | `string` | **是** | - |
| `scope` | `string` | 否 | Use 'skill' for skill-level offline; otherwise version-level |
| `version` | `string` | 否 | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/skills/offline' -d "namespaceId=namespaceId&skillName=skillName&scope=scope&version=version"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 7.11. Online Skill
#### 接口描述
This interface allows executing an online operation on a specific version or the entire skill, making it callable.

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/skills/online`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `skillName` | `string` | **是** | - |
| `scope` | `string` | 否 | Use 'skill' for skill-level online; otherwise version-level |
| `version` | `string` | 否 | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/skills/online' -d "namespaceId=namespaceId&skillName=skillName&scope=scope&version=version"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 7.12. Publish Skill Version
#### 接口描述
This interface allows publishing an approved skill version.

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/skills/publish`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `skillName` | `string` | **是** | - |
| `version` | `string` | **是** | - |
| `updateLatestLabel` | `boolean` | 否 | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/skills/publish' -d "namespaceId=namespaceId&skillName=skillName&version=version&updateLatestLabel=updateLatestLabel"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 7.13. Update Skill Visibility Scope
#### 接口描述
This interface allows setting the visibility scope of a skill to PUBLIC or PRIVATE.

#### 请求方式

`PUT`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/skills/scope`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `skillName` | `string` | **是** | - |
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
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/skills/scope' -d "namespaceId=namespaceId&skillName=skillName&scope=scope"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 7.14. Submit Skill Version for Review
#### 接口描述
This interface allows submitting a skill draft version to the pipeline for review.

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/skills/submit`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `skillName` | `string` | **是** | - |
| `version` | `string` | 否 | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/skills/submit' -d "namespaceId=namespaceId&skillName=skillName&version=version"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 7.15. Get Skill Version Detail
#### 接口描述
This interface allows querying the detail of a specific Skill version by namespace, skill name, and version number.

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/skills/version`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `skillName` | `string` | **是** | - |
| `version` | `string` | 否 | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data.namespaceId | `string` | - |
| data.data.name | `string` | - |
| data.data.description | `string` | - |
| data.data.skillMd | `string` | - |
| data.data.resource | `object` | - |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/skills/version?namespaceId=namespaceId&skillName=skillName&version=version'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 7.16. Download Skill Version ZIP
#### 接口描述
This interface allows downloading the ZIP package of a specific Skill version.

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/skills/version/download`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `skillName` | `string` | **是** | - |
| `version` | `string` | 否 | - |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/skills/version/download?namespaceId=namespaceId&skillName=skillName&version=version'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

## 8. AgentSpec 管理

AgentSpec 管理 API 提供 AgentSpec 的查询、草稿、发布、上下线及 ZIP 上传等能力。

### 8.1. Delete AgentSpec
#### 接口描述
This interface allows deleting an AgentSpec and all its versions by namespace and name.

#### 请求方式

`DELETE`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agentspecs`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `agentSpecName` | `string` | **是** | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8080/v3/console/ai/agentspecs?namespaceId=namespaceId&agentSpecName=agentSpecName'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.2. Get AgentSpec
#### 接口描述
This interface allows getting the latest published version of an AgentSpec by namespace and name.

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/agentspecs`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `agentSpecName` | `string` | **是** | - |
| `version` | `string` | 否 | - |

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
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/agentspecs?namespaceId=namespaceId&agentSpecName=agentSpecName&version=version'
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

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agentspecs/biz-tags`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `agentSpecName` | `string` | **是** | - |
| `bizTags` | `string` | **是** | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/agentspecs/biz-tags' -d "namespaceId=namespaceId&agentSpecName=agentSpecName&bizTags=bizTags"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.4. Delete AgentSpec Draft Version
#### 接口描述
This interface allows deleting the current draft version of a specified AgentSpec.

#### 请求方式

`DELETE`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agentspecs/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `agentSpecName` | `string` | **是** | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8080/v3/console/ai/agentspecs/draft?namespaceId=namespaceId&agentSpecName=agentSpecName'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.5. Create AgentSpec Draft Version
#### 接口描述
This interface allows creating an AgentSpec draft version based on an existing version.

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agentspecs/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `agentSpecName` | `string` | **是** | - |
| `basedOnVersion` | `string` | 否 | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agentspecs/draft' -d "namespaceId=namespaceId&agentSpecName=agentSpecName&basedOnVersion=basedOnVersion"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 8.6. Update AgentSpec Draft Content
#### 接口描述
This interface allows updating the card content of the current AgentSpec draft version.

#### 请求方式

`PUT`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agentspecs/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `agentSpecName` | `string` | 否 | - |
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
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/agentspecs/draft' -d "namespaceId=namespaceId&agentSpecName=agentSpecName&agentSpecCard=agentSpecCard"
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

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agentspecs/labels`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `agentSpecName` | `string` | **是** | - |
| `labels` | `string` | **是** | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/agentspecs/labels' -d "namespaceId=namespaceId&agentSpecName=agentSpecName&labels=labels"
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

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/agentspecs/list`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pageNo` | `integer` | **是** | - |
| `pageSize` | `integer` | **是** | - |
| `namespaceId` | `string` | 否 | - |
| `agentSpecName` | `string` | 否 | - |
| `search` | `string` | 否 | Search mode: accurate or blur |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/agentspecs/list?pageNo=pageNo&pageSize=pageSize&namespaceId=namespaceId&agentSpecName=agentSpecName&search=search'
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

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agentspecs/offline`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `agentSpecName` | `string` | **是** | - |
| `scope` | `string` | 否 | Use 'agentspec' for agentspec-level offline; otherwise version-level |
| `version` | `string` | 否 | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agentspecs/offline' -d "namespaceId=namespaceId&agentSpecName=agentSpecName&scope=scope&version=version"
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

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agentspecs/online`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `agentSpecName` | `string` | **是** | - |
| `scope` | `string` | 否 | Use 'agentspec' for agentspec-level online; otherwise version-level |
| `version` | `string` | 否 | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agentspecs/online' -d "namespaceId=namespaceId&agentSpecName=agentSpecName&scope=scope&version=version"
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

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agentspecs/publish`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `agentSpecName` | `string` | **是** | - |
| `version` | `string` | **是** | - |
| `updateLatestLabel` | `boolean` | 否 | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agentspecs/publish' -d "namespaceId=namespaceId&agentSpecName=agentSpecName&version=version&updateLatestLabel=updateLatestLabel"
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

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agentspecs/scope`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `agentSpecName` | `string` | **是** | - |
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
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/agentspecs/scope' -d "namespaceId=namespaceId&agentSpecName=agentSpecName&scope=scope"
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

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agentspecs/submit`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `agentSpecName` | `string` | **是** | - |
| `version` | `string` | 否 | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agentspecs/submit' -d "namespaceId=namespaceId&agentSpecName=agentSpecName&version=version"
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

请求体类型：`multipart/form-data`（如文件上传），请求示例中需使用 `-F` 或 `-H 'Content-Type: multipart/form-data'`。

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agentspecs/upload`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `overwrite` | `boolean` | 否 | - |

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `overwrite` | `boolean` | 否 | - |
| `file` | `file` | 否 | ZIP file containing agentspec package |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agentspecs/upload?namespaceId=namespaceId&overwrite=overwrite' -F "namespaceId=" -F "overwrite=" -F "file="
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

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/agentspecs/version`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `agentSpecName` | `string` | **是** | - |
| `version` | `string` | 否 | - |

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
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/agentspecs/version?namespaceId=namespaceId&agentSpecName=agentSpecName&version=version'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

## 9. Pipeline 管理

Pipeline 管理 API 提供执行记录查询能力。

### 9.1. List Pipeline Executions
#### 接口描述
This interface allows paginated listing of Pipeline execution records by resource type, name, namespace, and version.

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/pipelines`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `resourceType` | `string` | **是** | - |
| `resourceName` | `string` | 否 | - |
| `namespaceId` | `string` | 否 | - |
| `version` | `string` | 否 | - |
| `pageNo` | `integer` | **是** | - |
| `pageSize` | `integer` | **是** | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/pipelines?resourceType=resourceType&resourceName=resourceName&namespaceId=namespaceId&version=version&pageNo=pageNo&pageSize=pageSize'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 9.2. Get Pipeline Execution
#### 接口描述
This interface allows retrieving a Pipeline execution record by pipeline ID.

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/pipelines/{pipelineId}`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pipelineId` | `string` | **是** | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data.executionId | `string` | - |
| data.data.resourceType | `string` | - |
| data.data.resourceName | `string` | - |
| data.data.namespaceId | `string` | - |
| data.data.version | `string` | - |
| data.data.status | `string` | - |
| data.data.pipeline | `array` | - |
| data.data.createTime | `integer` | - |
| data.data.updateTime | `integer` | - |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/pipelines/{pipelineId}'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

## 10. Copilot

Copilot 相关 API 提供配置获取/保存、Prompt 调试与优化、Skill 生成与优化等能力（部分接口为 SSE 流式返回）。

### 10.1. 获取Copilot配置

#### 接口描述

获取当前Copilot配置，仅返回apiKey、model、studioUrl、studioProject。

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/copilot/config`

#### 请求参数

无

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.enabled | `boolean` | Copilot 功能是否启用。 |
| data.defaultNamespace | `string` | 默认使用的命名空间 ID。 |
| data.apiKey | `string` | 调用大模型等外部服务的 API Key（脱敏或原文由实现决定）。 |
| data.model | `string` | 默认使用的模型标识。 |
| data.studioUrl | `string` | 关联的 Studio 服务地址。 |
| data.studioProject | `string` | 关联的 Studio 项目标识。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/copilot/config'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "apiKey": "",
    "model": "",
    "studioUrl": "",
    "studioProject": ""
  }
}
```

### 10.2. 保存Copilot配置

#### 接口描述

创建或更新Copilot配置，仅接受apiKey、model、studioUrl、studioProject，其他字段使用默认值。

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/copilot/config`

#### 请求参数

无（请求体可传 apiKey、model、studioUrl、studioProject 等字段，具体以实际接口为准）。

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data | `boolean` | 是否保存成功。 |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/copilot/config'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 10.3. 流式调试Prompt

#### 接口描述

通过该接口，可使用用户输入流式调试Prompt并返回模型响应，返回SSE流。

#### 请求方式

`POST`

请求体类型：`application/json`。

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/copilot/prompt/debug`

#### 请求参数

| 参数名       | 类型     | 必填 | 参数描述     |
|-----------|--------|----|----------|
| `userInput` | `string` | 否 | 用户输入内容。 |
| `prompt`    | `string` | 否 | 待调试的 Prompt。 |

#### 返回数据

无（SSE 流式返回）

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/copilot/prompt/debug' -H 'Content-Type: application/json' -d '{"userInput":"","prompt":""}'
```

* 返回示例

```json
{}
```

### 10.4. 流式优化Prompt

#### 接口描述

通过该接口，可流式优化Prompt，返回SSE流。

#### 请求方式

`POST`

请求体类型：`application/json`。

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/copilot/prompt/optimize`

#### 请求参数

| 参数名              | 类型     | 必填 | 参数描述        |
|------------------|--------|----|-------------|
| `optimizationGoal` | `string` | 否 | 优化目标。       |
| `prompt`           | `string` | 否 | 待优化的 Prompt。 |

#### 返回数据

无（SSE 流式返回）

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/copilot/prompt/optimize' -H 'Content-Type: application/json' -d '{"optimizationGoal":"","prompt":""}'
```

* 返回示例

```json
{}
```

### 10.5. 流式生成Skill

#### 接口描述

通过该接口，可基于背景信息流式生成Skill，返回SSE流。

#### 请求方式

`POST`

请求体类型：`application/json`。

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/copilot/skill/generate`

#### 请求参数

| 参数名                | 类型     | 必填 | 参数描述           |
|--------------------|--------|----|----------------|
| `backgroundInfo`     | `string` | 否 | 背景信息。           |
| `selectedMcpTools`   | `array` | 否 | 选中的 MCP 工具。      |
| `conversationHistory` | `object` | 否 | 对话历史。           |

#### 返回数据

无（SSE 流式返回）

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/copilot/skill/generate' -H 'Content-Type: application/json' -d '{"backgroundInfo":"","selectedMcpTools":"","conversationHistory":""}'
```

* 返回示例

```json
{}
```

### 10.6. 流式优化Skill

#### 接口描述

通过该接口，可基于目标与对话历史流式优化Skill，返回SSE流。

#### 请求方式

`POST`

请求体类型：`application/json`。

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/copilot/skill/optimize`

#### 请求参数

| 参数名                | 类型     | 必填 | 参数描述           |
|--------------------|--------|----|----------------|
| `conversationHistory` | `object` | 否 | 对话历史。           |
| `targetFileName`      | `string` | 否 | 目标文件名。          |
| `optimizationGoal`    | `string` | 否 | 优化目标。           |
| `skill`               | `string` | 否 | 待优化的 Skill 内容。   |
| `selectedMcpTools`   | `array` | 否 | 选中的 MCP 工具。      |

#### 返回数据

无（SSE 流式返回）

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/copilot/skill/optimize' -H 'Content-Type: application/json' -d '{"conversationHistory":"","targetFileName":"","optimizationGoal":"","skill":"","selectedMcpTools":""}'
```

* 返回示例

```json
{}
```
