---
title: 控制台API
keywords: [ Nacos,控制台API ]
description: Nacos 控制台的一些API，如果您需要自定义开发Nacos对应的控制台UI，可以使用这些API进行数据的获取。
sidebar:
  order: 13
---

# 控制台API

Nacos 提供了若干开放的控制台API，当您有自定义开发Nacos对应的控制台UI需求时，您可以通过这些API，获取Nacos
Server节点中的数据，从而实现自定义的Nacos控制台UI界面。

如果需要关闭默认控制台 UI 并接入自定义 UI，请先阅读[控制台手册](./console.md)，确认控制台入口、端口和 UI 开关配置。

## 0. 控制台API 相关说明

### 0.1. 适用边界

控制台 API 面向 Nacos 控制台和自定义控制台 UI。它服务于页面展示、表单提交和控制台交互流程。

| 适合使用 | 不适合使用 |
| --- | --- |
| 自定义 Nacos 控制台 UI。 | 业务应用运行时访问配置和服务。 |
| 对接默认控制台已有的页面数据和交互流程。 | 构建发布平台、审计平台或运维自动化脚本。 |
| 在关闭默认控制台 UI 后，为自定义 UI 提供服务端数据。 | 替代 Admin API 做通用管理面集成。 |

业务应用请使用 SDK 或[客户端 API](../user/open-api.md)。运维平台、发布平台和自动化脚本请优先使用[运维 API](./admin-api.md)或[运维 SDK](./maintainer-sdk.md)。

### 0.2. 统一路径格式

Nacos的控制台 API，使用统一的Path格式进行的规范。格式为`[/$nacos.console.contextPath]/v3/console/[module]/[subPath]...`,
其中

- `$nacos.console.contextPath`：控制台的根路径，默认为``，可以通过`nacos.console.contextPath`配置项进行修改。
- `module`：控制台的模块名称，例如`server`、`cs`、`ns`、`core`等。
- `subPath`：控制台的子路径，例如`state`、`namespace`、`config`等， 可能有多层子路径。

下列列出的控制台API，采用默认`$nacos.console.contextPath`的情况进行展示，若已修改部署环境中的`$nacos.console.contextPath`
配置项，请自行修改调用API时的请求URL。

同时下列列出的控制台API样例中，均采用默认Nacos Console的端口进行展示，若已修改部署环境中的`$nacos.console.port`
配置项，请自行修改调用API时的请求URL。

### 0.3. 鉴权认证

Nacos 3.X 的控制台 API默认启用鉴权认证，除少量被标记为`公开接口`的API外，请在调用API时，携带正确的身份信息，否则请求将会被拦截。

若想要关闭鉴权，请设置`nacos.core.auth.console.enabled=false`，然后重启Nacos 控制台。

### 0.4. Swagger 类型文档

Nacos 3.X 的控制台 API 也提供了Swagger风格的文档，您可以通过访问[Nacos Swagger控制台 API](/swagger/console/)查看。

## 1. Nacos 基础控制台API

基础控制台API提供了Nacos 集群的基础信息，例如集群信息、命名空间信息等。

### 1.1. 获取集群状态信息

#### 接口描述

通过该接口，可以获取到Nacos 集群的基础状态和开关信息，例如：版本号，运行模式，鉴权是否开启等；该接口不会返回Nacos 集群的节点信息。

#### 起始版本

`3.0.0`

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

#### 起始版本

`3.0.0`

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

#### 起始版本

`3.0.0`

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

#### 起始版本

`3.0.0`

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

#### 起始版本

`3.0.0`

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

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需要Nacos 管理员用户权限。

#### 请求URL

`/v3/console/core/cluster/nodes`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `keyword` | `string` | 否 | 按节点地址或状态等信息筛选节点。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名 | 参数类型 | 描述 |
|-----|------|----|

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/core/cluster/nodes?keyword=127.0.0.1'
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

#### 起始版本

`3.0.0`

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

#### 起始版本

`3.0.0`

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

#### 起始版本

`3.0.0`

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

#### 起始版本

`3.0.0`

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

#### 起始版本

`3.0.0`

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

#### 起始版本

`3.0.0`

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

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/plugin`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pluginType` | `string` | **是** | 插件类型，如 `auth`、`control`、`datasource-dialect`。 |
| `pluginName` | `string` | **是** | 插件名称，如 `nacos`；完整身份为 `pluginType:pluginName`。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.pluginId | `string` | 插件唯一标识。 |
| data.pluginType | `string` | 插件类型。 |
| data.pluginName | `string` | 插件名称。 |
| data.enabled | `boolean` | 当前是否已启用。 |
| data.critical | `boolean` | 是否为关键插件（关键插件不可被禁用）。 |
| data.typeCritical | `boolean` | 插件类型是否声明为 critical。 |
| data.executionMode | `string` | `EXCLUSIVE`、`CHAIN`、`ROUTED` 或 `BROADCAST`。 |
| data.exclusive | `boolean` | 是否为排他选择类型。 |
| data.configurable | `boolean` | 是否支持控制台动态配置。 |
| data.config | `map<string, string>` | 有效配置，敏感项显示 masked marker。 |
| data.configDefinitions | `array<ConfigItemDefinition>` | 配置项定义列表。 |
| data.configValueMetas | `map<string, PluginConfigValueMeta>` | 以配置键为索引的有效来源及覆盖信息。 |

`ConfigItemDefinition` 包含 `key`、`name`、`description`、`defaultValue`、`type`、`required`、`enumValues: array<string>`、`aliases: array<string>`、`sensitive` 和 `effectMode`；`PluginConfigValueMeta` 包含 `key`、`source` 和 `overridden`。其中 `type` 可为 `STRING`、`NUMBER`、`BOOLEAN`、`ENUM`，`effectMode` 可为 `RUNTIME`、`RESTART`，`source` 可为 `DEFAULT`、`STATIC`、`RUNTIME_PERSISTED`、`LOCAL_ONLY`。

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/plugin?pluginType=auth&pluginName=nacos'
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
    "config": {},
    "configDefinitions": [],
    "configValueMetas": {}
  }
}
```

### 1.14. 查询插件在集群节点上的可用性

#### 接口描述

通过该接口，可以获取指定插件在各集群节点上的可用情况。

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/plugin/availability`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pluginType` | `string` | **是** | 插件类型，如 `auth`、`control`、`datasource-dialect`。 |
| `pluginName` | `string` | **是** | 插件名称。 |

#### 返回数据

返回 data 为 Map&lt;节点地址, 是否可用&gt;，键为 Nacos 节点地址（如 `127.0.0.1:8848`），值为该节点上该插件是否可用。

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/plugin/availability?pluginType=auth&pluginName=nacos'
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

替换目标运行时来源的完整配置 map。只能提交 definitions 中 `RUNTIME` 项；`RESTART` 项在 Next Console 中只读，修改、删除或新增都会被拒绝。敏感字段返回 masked marker 时，原样提交 marker 表示保留目标来源中已有值。

#### 起始版本

`3.2.0`

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
| `config` | `string` | **是** | 完整 JSON item map，具体字段由插件 definitions 定义。 |
| `localOnly` | `boolean` | 否 | `true` 仅写当前节点的 `LOCAL_ONLY`；否则写 `RUNTIME_PERSISTED`。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data | `string` | 操作结果描述信息。 |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/plugin/config' \
  -d 'pluginType=auth' \
  -d 'pluginName=ldap' \
  -d 'config={"connect-timeout":"6000"}' \
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

### 1.16. 获取插件列表

#### 接口描述

通过该接口，可以获取插件列表，可按插件类型筛选。

#### 起始版本

`3.2.0`

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

返回 data 为插件信息数组，每项包含名称、类型、状态、critical、executionMode、configurable 等元数据。

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
      "name": "nacos",
      "type": "auth",
      "enabled": true
    }
  ]
}
```

### 1.17. 启用或禁用插件

#### 接口描述

更新插件状态。集群持久化状态优先于静态初值，本地状态优先于持久化状态。EXCLUSIVE 选择、PRE_CONTEXT 实现和 active critical provider 的非法运行时修改会被拒绝。

#### 起始版本

`3.2.0`

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
  -d 'pluginName=ldap' \
  -d 'enabled=true' \
  -d 'localOnly=false'
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

#### 起始版本

`3.0.0`

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

#### 起始版本

`3.0.0`

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
| `use` | `string` | 否 | 配置使用场景。 |
| `effect` | `string` | 否 | 配置生效范围。 |
| `schema` | `string` | 否 | 配置内容对应的 Schema。 |
| `tag` | `string` | 否 | 配置灰度标签。 |
| `srcUser` | `string` | 否 | 发布操作的来源用户标识。 |
| `encryptedDataKey` | `string` | 否 | 加密配置的数据密钥。 |

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

#### 起始版本

`3.0.0`

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
| `tag` | `string` | 否 | 配置灰度标签。 |

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

#### 起始版本

`3.0.0`

#### 请求方式

`DELETE`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/cs/config/batchDelete`

#### 请求参数

| 参数名   | 类型       | 必填 | 参数描述                                  |
|-------|----------|----|---------------------------------------|
| `ids` | `array<integer>` | 是  | 配置的存储ID列表，并非`dataId`列表，多个ID之间用英文逗号分隔。 |
| `namespaceId` | `string` | 否 | 配置所属命名空间 ID，默认值为 `public`。 |

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

#### 起始版本

`3.0.0`

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

#### 起始版本

`3.0.0`

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

#### 起始版本

`3.0.0`

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

#### 起始版本

`3.0.0`

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

#### 起始版本

`3.0.0`

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
| `ids`         | `array<integer>` | 否  | 需要导出的配置的存储ID，多个ID用英文逗号分隔。    |
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

#### 起始版本

`3.0.0`

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
| `file`        | `file`    | **是**  | multipart 表单中的导入 ZIP 文件。                                                                                                          |
| `namespaceId` | `string` | 否  | Query 参数或 multipart 表单字段；导入配置所属命名空间 ID，默认值为 `public`。                                                                                       |
| `policy`      | `string` | 否  | Query 参数或 multipart 表单字段；冲突时可选 `ABORT`、`SKIP` 或 `OVERWRITE`，默认值为 `ABORT`。 |
| `srcUser`    | `string` | 否  | Query 参数或 multipart 表单字段；导入操作来源用户标识。                                                                                                       |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名         | 参数类型  | 描述         |
|-------------|-------|------------|
| `succCount` | `integer` | 导入成功的配置数量。 |
| `skipCount` | `integer` | 导入跳过的配置数量。 |

#### 示例

* 请求示例

```shell
curl -vX POST "http://127.0.0.1:8080/v3/console/cs/config/import?namespaceId=test&policy=ABORT&srcUser=console" -F "file=@/path/to/test.zip" -F "namespaceId=test" -F "policy=ABORT" -F "srcUser=console"
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

#### 起始版本

`3.0.0`

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
| `namespaceId`    | `string` | 否     | 源配置所属命名空间 ID，默认值为 `public`。 |
| `targetNamespaceId` | `string` | **是** | 目标命名空间ID。                                                                                                           |
| `policy`         | `string` | 否     | 克隆策略，当导入的配置`dataId`和`groupName`相同，存在冲突时，所进行的克隆策略。可选值有`ABORT(终止克隆)`,`SKIP(跳过冲突配置)`,`OVERWRITE(覆盖冲突配置)`。默认值为`ABORT`。 |
| `body[].cfgId` | `integer` | **是** | JSON 请求体中待克隆配置的 ID；每个有效条目都需要提供。 |
| `body[].dataId` | `string` | 否 | JSON 请求体中目标配置的 `dataId`；为空时沿用源配置值。 |
| `body[].group` | `string` | 否 | JSON 请求体中目标配置的分组；为空时沿用源配置值。 |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名         | 参数类型  | 描述         |
|-------------|-------|------------|
| `succCount` | `integer` | 成功克隆的配置数量。 |
| `skipCount` | `integer` | 克隆跳过的配置数量。 |

#### 示例

* 请求示例

```shell
curl -H "Content-Type: application/json" -X POST "http://127.0.0.1:8080/v3/console/cs/config/clone?namespaceId=public&targetNamespaceId=target&policy=ABORT" -d "[{\"cfgId\":838029534438625280,\"dataId\":\"111\",\"group\":\"DEFAULT_GROUP\"},{\"cfgId\":838033747294031872,\"dataId\":\"qtc-user.yaml\",\"group\":\"DEFAULT_GROUP\"}]"
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

#### 起始版本

`3.0.0`

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

#### 起始版本

`3.0.0`

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

#### 起始版本

`3.0.0`

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

#### 起始版本

`3.0.0`

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
| `extInfo`     | `string` | JSON 编码的扩展信息字符串，目前包括`src_user`、`type`、`c_desc`，若`publishType`为`gray`, 其中还包括`grayRule`。 |

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

#### 起始版本

`3.0.0`

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
| `extInfo`     | `string` | JSON 编码的扩展信息字符串，目前包括`src_user`、`type`、`c_desc`，若`publishType`为`gray`, 其中还包括`grayRule`。 |

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

#### 起始版本

`3.0.0`

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

#### 起始版本

`3.0.0`

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

#### 起始版本

`3.0.0`

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

#### 起始版本

`3.0.0`

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

#### 起始版本

`3.0.0`

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

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ns/service/list`

#### 请求参数

| 参数名                  | 类型        | 必填 | 参数描述                              |
|----------------------|-----------|----|-----------------------------------|
| `pageNo`             | `integer` | 是  | 页码，起始为`1`。                        |
| `pageSize`           | `integer` | 是  | 每页显示条数。                           |
| `serviceNameParam`   | `string` | 否  | 服务名的pattern，为空时查询所有服务。            |
| `groupNameParam`     | `string` | 否  | 服务所属的groupName的pattern，为空时查询所有服务。 |
| `namespaceId`        | `string` | 否  | 服务所属的命名空间ID。                      |
| `ignoreEmptyService` | `boolean` | 否  | 是否仅返回有实例的服务，默认为`false`，即查询空服务。    |
| `withInstances`      | `boolean` | 否  | 是否返回服务的实例详情，默认为`false`。           |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                   | 参数类型     | 描述           |
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

#### 起始版本

`3.0.0`

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ns/service/subscribers`

#### 请求参数

| 参数名           | 类型        | 必填 | 参数描述                                |
|---------------|-----------|----|-------------------------------------|
| `pageNo`      | `integer` | 是  | 页码，起始为`1`。                          |
| `pageSize`    | `integer` | 是  | 每页显示条数。                             |
| `serviceName`  | `string` | 是  | 服务名。                                |
| `groupName`    | `string` | 否  | 服务所属的groupName，默认值为`DEFAULT_GROUP`。 |
| `namespaceId`  | `string` | 否  | 服务所属的命名空间ID，默认值为`public`。           |
| `aggregation`  | `boolean` | 否  | 是否聚合查询。                             |

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

#### 起始版本

`3.0.0`

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
| `selector`                                          | `object` | 服务选择器。                               |
| `metadata`                                          | `object` | 服务元数据。                               |
| `clusterMap`                                        | `object` | 服务集群列表, key为cluster的名称，value为集群详细信息。 |
| `clusterMap`.$ClusterName.`clusterName`             | `string` | 集群名。                                 |
| `clusterMap`.$ClusterName.`healthChecker`           | `object` | 健康检查器。                               |
| `clusterMap`.$ClusterName.`healthyCheckPort`        | `integer` | 健康检查端口。                              |
| `clusterMap`.$ClusterName.`useInstancePortForCheck` | `boolean` | 是否使用所注册的实例的`IP:Port`进行健康检查。          |
| `clusterMap`.$ClusterName.`metadata`                | `object` | 集群元数据。                               |

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

#### 起始版本

`3.0.0`

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
| `checkPort`             | `integer` | 是  | 健康检查端口。                             |
| `useInstancePort4Check` | `boolean` | 是  | 是否使用所注册的实例的`IP:Port`进行健康检查。         |
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

#### 起始版本

`3.0.0`

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
| `pageItems`                  | `array`                | 实例列表。                                 |
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

#### 起始版本

`3.0.0`

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

### 3.11. 删除持久化实例

#### 接口描述

通过该接口，可以删除指定服务下的**持久化实例**。该接口仅支持删除`ephemeral=false`的实例，不支持删除临时实例。

#### 起始版本

`3.2.2`

#### 请求方式

`DELETE`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ns/instance`

#### 请求参数

| 参数名        | 类型      | 必填 | 参数描述                                       |
| ------------- | --------- | ---- | ---------------------------------------------- |
| `serviceName` | `string`  | 是   | 服务名。                                       |
| `ip`          | `string`  | 是   | 实例IP。                                       |
| `port`        | `integer` | 是   | 实例端口。                                     |
| `groupName`   | `string`  | 否   | 服务所属的groupName，默认值为`DEFAULT_GROUP`。 |
| `namespaceId` | `string`  | 否   | 服务所属的命名空间ID，默认值为`public`。       |
| `clusterName` | `string`  | 否   | 实例所属集群, 默认值为`DEFAULT`。              |
| `ephemeral`   | `boolean` | 否   | 实例是否临时，仅支持传入`false`，默认值为`false`。 |
| `healthy`     | `boolean` | 否   | 实例是否健康。                              |
| `weight`      | `number`  | 否   | 实例权重。                                |
| `enabled`     | `boolean` | 否   | 实例是否可用。                              |
| `metadata`    | `string`  | 否   | 实例元数据，JSON 对象字符串。                   |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名 | 参数类型 | 描述                     |
| ------ | -------- | ------------------------ |
| `data` | `string` | 删除成功时，固定为`ok`。 |

#### 示例

* 请求示例

```shell
curl -X DELETE "http://127.0.0.1:8080/v3/console/ns/instance?serviceName=test&clusterName=DEFAULT&groupName=DEFAULT_GROUP&ip=1.1.1.1&port=3306&ephemeral=false"
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

#### 起始版本

`3.0.0`

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
| `mcpId`       | `string` | 二选一必填 | MCP服务的ID，一般为UUID。与`mcpName`二者必须填其一（因 OpenAPI 规范限制，无法在文档中表达“二选一必填”，实际调用时需至少传其中一个）。建议传入`mcpId`。 |
| `mcpName`     | `string` | 二选一必填 | MCP服务的名字模版。与`mcpId`二者必须填其一，建议传入`mcpId`。    |
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
| `versionDetail`      | `ServerVersionDetail`       | MCP服务所查询的版本信息。                                                                                  |
| `localServerConfig`  | `map<string, object>` | MCP服务若类型为**stdio**，存在此信息，记录本地MCP服务的启动信息。                                                        |
| `remoteServerConfig` | `McpServerRemoteServiceConfig`  | MCP服务若类型为**非stdio**，存在此信息，记录远端服务的信息 。                                                           |
| `enabled`            | `boolean` | MCP服务是否启用。                                                                                      |
| `capabilities`       | `array<string>`                | MCP服务支持的能力类型，如`TOOL`,`PROMPT`,`RESOURCE`。                                                       |
| `backendEndpoints`   | `array<McpEndpointInfo>`                | MCP服务若类型为**非stdio**，存在此信息，记录访问远端服务的具体地址信息。                                                      |
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

#### 起始版本

`3.0.0`

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
| `versionDetail`      | `ServerVersionDetail`       | MCP服务的版本信息。                                                                                     |
| `version`            | `string` | MCP服务的简易版本版本信息，主要用于兼容，若已设置`versionDetail`,则该字段无效。                                               |    |
| `localServerConfig`  | `map<string, object>` | MCP服务若类型为**stdio**，存在此信息，记录本地MCP服务的启动信息。                                                        |
| `remoteServerConfig` | `McpServerRemoteServiceConfig`  | MCP服务若类型为**非stdio**，存在此信息，记录远端服务的信息 。                                                           |
| `enabled`            | `boolean` | MCP服务是否启用。                                                                                      |
| `capabilities`       | `array<string>`                | MCP服务支持的能力类型，如`TOOL`,`PROMPT`,`RESOURCE`。                                                       |

其中`ServerVersionDetail`结构如下：

| 参数名            | 参数类型      | 描述               |
|----------------|-----------|------------------|
| `version`      | `string` | MCP服务的版本号。       |
| `release_date` | `string` | MCP服务的版本发布时间。    |
| `is_latest`    | `boolean` | MCP服务的版本是否为最新版本。 |

> toolSpecification

| 参数名               | 参数类型                       | 描述                                                                                      |
|-------------------|----------------------------|-----------------------------------------------------------------------------------------|
| `tools`           | `array<McpTool>`            | 该MCP Server所提供的工具列表，参考标准MCP协议中对于MCP Tool的定义                                             |
| `toolsMeta`       | `map<string, McpToolMeta>` | 该MCP Server所提供的工具的额外元数据信息，可用于扩展标准MCP协议中未定义但又使用中需要的信息。key为`McpTool`的`name`, value为拓展元数据。 |
| `securitySchemes` | `array<SecurityScheme>`     | MCP工具的安全方案，参考标准MCP协议。                                                                   |

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

#### 起始版本

`3.0.0`

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
| `versionDetail`      | `ServerVersionDetail`       | MCP服务的版本信息。                                                                                     |
| `version`            | `string` | MCP服务的简易版本版本信息，主要用于兼容，若已设置`versionDetail`,则该字段无效。                                               |    |
| `localServerConfig`  | `map<string, object>` | MCP服务若类型为**stdio**，存在此信息，记录本地MCP服务的启动信息。                                                        |
| `remoteServerConfig` | `McpServerRemoteServiceConfig`  | MCP服务若类型为**非stdio**，存在此信息，记录远端服务的信息 。                                                           |
| `enabled`            | `boolean` | MCP服务是否启用。                                                                                      |
| `capabilities`       | `array<string>`                | MCP服务支持的能力类型，如`TOOL`,`PROMPT`,`RESOURCE`。                                                       |

其中`ServerVersionDetail`结构如下：

| 参数名            | 参数类型      | 描述               |
|----------------|-----------|------------------|
| `version`      | `string` | MCP服务的版本号。       |
| `release_date` | `string` | MCP服务的版本发布时间。    |
| `is_latest`    | `boolean` | MCP服务的版本是否为最新版本。 |

> toolSpecification

| 参数名               | 参数类型                       | 描述                                                                                      |
|-------------------|----------------------------|-----------------------------------------------------------------------------------------|
| `tools`           | `array<McpTool>`            | 该MCP Server所提供的工具列表，参考标准MCP协议中对于MCP Tool的定义                                             |
| `toolsMeta`       | `map<string, McpToolMeta>` | 该MCP Server所提供的工具的额外元数据信息，可用于扩展标准MCP协议中未定义但又使用中需要的信息。key为`McpTool`的`name`, value为拓展元数据。 |
| `securitySchemes` | `array<SecurityScheme>`     | MCP工具的安全方案，参考标准MCP协议。                                                                   |

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

#### 起始版本

`3.0.0`

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

#### 起始版本

`3.0.0`

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
| `search`      | `string` | 否     | blur or accurate                  |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](../user/overview/api-overview.md#32-http-api-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                           | 参数类型                  | 描述                                                                                              |
|-----------------------------------------------|-----------------------|-------------------------------------------------------------------------------------------------|
| `totalCount`                                  | `integer` | 符合条件的服务的总数。                                                                                     |
| `pageNumber`                                  | `integer` | 当前页码，起始为`1`。                                                                                    |
| `pagesAvailable`                              | `integer` | 可用页码。                                                                                           |
| `pageItems`                                   | `array<McpServerBasicInfo>`                | 服务列表。                                                                                           |
| `pageItems`[i].`id`                           | `string` | MCP服务的ID，一般为UUID。                                                                               |
| `pageItems`[i].`name`                         | `string` | MCP服务名。                                                                                         |
| `pageItems`[i].`protocol`                     | `string` | MCP的协议，如`stdio`,`sse`,`streamable`,`http`,`dubbo`等。                                             |
| `pageItems`[i].`frontProtocol`                | `string` | MCP的前端暴露协议，一般是提供给协议转换器（如网关）使用，若无转换器，则与`protocol`相同，如`stdio`,`sse`,`streamable`,`http`,`dubbo`等。 |
| `pageItems`[i].`description`                  | `string` | MCP服务的描述。                                                                                       |
| `pageItems`[i].`repository`                   | `string` | MCP服务的存储仓库。                                                                                     |                                                                                          |
| `pageItems`[i].`versionDetail`                | `ServerVersionDetail`       | MCP服务当前最新的版本信息。                                                                                 |
| `pageItems`[i].`localServerConfig`            | `map<string, object>` | MCP服务若类型为**stdio**，存在此信息，记录本地MCP服务的启动信息。                                                        |
| `pageItems`[i].`remoteServerConfig`           | `McpServerRemoteServiceConfig`  | MCP服务若类型为**非stdio**，存在此信息，记录远端服务的信息 。                                                           |
| `pageItems`[i].`latestPublishedVersion`       | `string` | MCP服务最新版本的版本号。                                                                                  |
| `pageItems`[i].`versionDetails`               | `array<ServerVersionDetail>` | MCP服务版本详情的列表。                                                                                   |
| `pageItems`[i].`capabilities`                 | `array<string>`                | MCP服务支持的能力类型，如`TOOL`,`PROMPT`,`RESOURCE`。                                                       |

其中`ServerVersionDetail`结构如下：

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

#### 起始版本

`3.0.3`

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
| `data` | `array<McpSchema.Tool>` | MCP工具元数据信息,符合[MCP工具元数据标准定义](https://modelcontextprotocol.io/specification/2025-06-18/server/tools#tool)。 |

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

#### 起始版本

`3.1.0`

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
| `importType`  | `string` | **是** | enum of `file`, `json`, `url`           |
| `data`        | `string` | **是** | 导入数据的内容                                 |
| `overrideExisting` | `boolean` | 否 | 服务已存在时是否覆盖，默认值为 `false`。 |
| `validateOnly` | `boolean` | 否 | 是否仅执行校验而不导入，默认值为 `false`。 |
| `skipInvalid` | `boolean` | 否 | 是否跳过无效服务，默认值为 `false`。 |
| `selectedServers` | `array<string>` | 否 | 选择需要校验的服务；为空时处理全部服务。 |
| `cursor`      | `string` | 否     | Optional start cursor for URL-based import pagination. |
| `limit`       | `integer` | 否     | 分页的页大小                                  |
| `search`      | `string`   | 否     | Optional fuzzy search keyword for registry import listing. Only used when importType is 'url'. |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名              | 参数类型                            | 描述        |
|------------------|---------------------------------|-----------|
| `valid`          | `boolean` | 导入服务是否合法。 |
| `totalCount`     | `integer` | 导入服务总数。   |
| `validCount`     | `integer` | 导入服务有效个数。 |
| `invalidCount`   | `integer` | 导入服务无效个数。 |
| `duplicateCount` | `integer` | 导入服务重复个数。 |
| `servers`        | `array<McpServerValidationItem>` | 导入服务列表。   |
| `errors`         | `array<string>`                  | 导入服务错误列表。 |

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
-d 'overrideExisting=false' \
-d 'validateOnly=true' \
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

#### 起始版本

`3.1.0`

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
| `importType`       | `string` | **是** | enum of `file`, `json`, `url`           |
| `data`             | `string` | **是** | 导入数据的内容                                 |
| `cursor`           | `string` | 否     | Optional start cursor for URL-based import pagination. |
| `limit`            | `integer` | 否     | 分页的页大小                                  |
| `search`           | `string`    | 否     | Optional fuzzy search keyword for registry import listing. Only used when importType is 'url'. |
| `overrideExisting` | `boolean` | 否     | 导入时若服务已存在时是否覆盖。默认为`false`。              |                                    |
| `validateOnly`     | `boolean` | 否     | 是否仅执行校验而不实际导入。默认为 `false`。 |
| `skipInvalid`      | `boolean` | 否     | 导入时是否忽略错误无效的服务。默认为`false`。              |
| `selectedServers`  | `array<string>` | 否     | 选择部分服务进行导入,为空时导入所有                      |


#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名            | 参数类型                          | 描述        |
|----------------|-------------------------------|-----------|
| `success`      | `boolean` | 导入服务是否成功。 |
| `totalCount`   | `integer` | 导入服务总数。   |
| `successCount` | `integer` | 导入服务成功个数。 |
| `failedCount`  | `integer` | 导入服务失败个数。 |
| `skippedCount` | `integer` | 导入服务跳过个数。 |
| `results`      | `array<McpServerImportResult>` | 导入服务列表。   |

其中`McpServerImportResult`描述如下:

| 参数名            | 参数类型      | 描述                     |
|----------------|-----------|------------------------|
| `serverName`   | `string` | 服务名称。                  |
| `serverId`     | `string` | 服务ID。                  |
| `status`       | `string` | 服务导入状态。                |
| `errorMessage` | `string` | 服务导入失败的错误信息，仅在导入失败时存在。 |


#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/mcp/import/execute' \
-d 'namespaceId=public' \
-d 'importType=url' \
-d 'data=' \
-d 'overrideExisting=false' \
-d 'validateOnly=false' \
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

#### 起始版本

`3.1.0`

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
| `search`      | `string` | **是** | blur or accurate |

#### 返回数据

返回体遵循[Nacos open API 统一返回体格式](#01-统一返回体格式)，下表只阐述`data`字段中的返回参数。

| 参数名                                     | 参数类型                       | 描述                                                                                                     |
|-----------------------------------------|----------------------------|--------------------------------------------------------------------------------------------------------|
| `totalCount`                            | `integer` | 符合条件的服务的总数。                                                                                            |
| `pageNumber`                            | `integer` | 当前页码，起始为`1`。                                                                                           |
| `pagesAvailable`                        | `integer` | 可用页码。                                                                                                  |
| `pageItems`                             | `array<AgentCardVersionInfo>`                     | 服务列表。                                                                                                  |
| `pageItems`[i].`protocolVersion`        | `string` | AgentCard的A2A协议版本。                                                                                     |
| `pageItems`[i].`name`                   | `string` | AgentCard的名称。                                                                                          |
| `pageItems`[i].`description`            | `string` | AgentCard的描述。                                                                                          |
| `pageItems`[i].`version`                | `string` | AgentCard的版本号。                                                                                         |
| `pageItems`[i].`iconUrl`                | `string` | AgentCard的iconURL。                                                                                     |
| `pageItems`[i].`capabilities`           | `AgentCapabilities`          | AgentCard的能力，匹配[A2A标准能力](https://a2a-protocol.org/latest/specification/#552-agentcapabilities-object)。 |
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

#### 起始版本

`3.1.0`

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

#### 起始版本

`3.1.0`

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
| `capabilities`                      | `AgentCapabilities`                 | AgentCard的能力，匹配[A2A标准能力](https://a2a-protocol.org/latest/specification/#552-agentcapabilities-object)。   |
| `skills`                            | `array<AgentSkill>`                | AgentCard的技能列表,匹配[A2A标准技能](https://a2a-protocol.org/latest/specification/#554-agentskill-object)。        |
| `url`                               | `string` | AgentCard的默认访问的URL。                                                                                      |
| `preferredTransport`                | `string` | AgentCard的默认访问URL的传输协议，应该为`JSONRPC`,`GRPC`,`HTTP+JSON`。                                                  |
| `additionalInterfaces`              | `array<AgentInterface>`            | AgentCard的所有可访问接口列表,匹配[A2A标准](https://a2a-protocol.org/latest/specification/#555-agentinterface-object)。 |
| `provider`                          | `AgentProvider`                   | AgentCard的提供商信息，匹配[A2A标准](https://a2a-protocol.org/latest/specification/#551-agentprovider-object)。      |
| `documentationUrl`                  | `string` | AgentCard的文档 URL。                                                                                        |
| `securitySchemes`                   | `map<string, SecurityScheme>`     | AgentCard的安全配置定义。匹配[A2A标准](https://a2a-protocol.org/latest/specification/#553-securityscheme-object)     |
| `security`                          | `array<map<string, array<string>>>` | AgentCard的所有安全要求对象列表。                                                                                    |
| `defaultInputModes`                 | `array<string>`                    | AgentCard的所有默认输入模式。                                                                                      |
| `defaultOutputModes`                | `array<string>`                    | AgentCard的所有默认输出模式。                                                                                      |
| `supportsAuthenticatedExtendedCard` | `boolean` | AgentCard是否支持认证的扩展卡。                                                                                     |
| `registrationType`                  | `string` | AgentCard的默认注册类型，可选`URL`和`SERVICE`。                                                                      |
| `latestVersion`                     | `boolean` | AgentCard当前版本是否为最新版本。                                                                                    |


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

#### 起始版本

`3.1.0`

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

#### 起始版本

`3.1.0`

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

#### 起始版本

`3.1.0`

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

Prompt 管理 API 提供 Prompt 的草稿、发布、上下线、治理查询、版本查询与下载能力。

### 6.1. 删除Prompt
#### 接口描述
通过该接口，可以删除指定Prompt。

#### 起始版本

`3.2.0`

#### 请求方式

`DELETE`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `promptKey` | `string` | **是** | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `boolean` | - |

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
  "data": {}
}
```


### 6.2. 更新 Prompt 业务标签
#### 接口描述
通过该接口，可更新 Prompt 业务标签。

#### 起始版本

`3.2.1`

#### 请求方式

`PUT`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt/biz-tags`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `promptKey` | `string` | **是** | - |
| `bizTags` | `string` | 否 | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/prompt/biz-tags' -d "namespaceId=namespaceId&promptKey=promptKey&bizTags=bizTags"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.3. 更新 Prompt 描述
#### 接口描述
通过该接口，可更新 Prompt 描述。

#### 起始版本

`3.2.1`

#### 请求方式

`PUT`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt/description`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `promptKey` | `string` | **是** | - |
| `description` | `string` | **是** | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/prompt/description' -d "namespaceId=namespaceId&promptKey=promptKey&description=description"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.4. 创建 Prompt 草稿
#### 接口描述
通过该接口，可创建 Prompt 草稿版本，或基于已有版本重新创建草稿。

#### 起始版本

`3.2.1`

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `promptKey` | `string` | **是** | - |
| `basedOnVersion` | `string` | 否 | - |
| `targetVersion` | `string` | 否 | - |
| `template` | `string` | 否 | - |
| `variables` | `string` | 否 | - |
| `commitMsg` | `string` | 否 | - |
| `description` | `string` | 否 | - |
| `bizTags` | `string` | 否 | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/prompt/draft' -d "namespaceId=namespaceId&promptKey=promptKey&basedOnVersion=basedOnVersion&targetVersion=targetVersion&template=template&variables=variables&commitMsg=commitMsg&description=description&bizTags=bizTags"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.5. 更新 Prompt 草稿
#### 接口描述
通过该接口，可更新当前 Prompt 草稿内容。

#### 起始版本

`3.2.1`

#### 请求方式

`PUT`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `promptKey` | `string` | **是** | - |
| `template` | `string` | **是** | - |
| `variables` | `string` | 否 | - |
| `commitMsg` | `string` | 否 | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/prompt/draft' -d "namespaceId=namespaceId&promptKey=promptKey&template=template&variables=variables&commitMsg=commitMsg"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.6. 删除 Prompt 草稿
#### 接口描述
通过该接口，可删除当前 Prompt 草稿版本。

#### 起始版本

`3.2.1`

#### 请求方式

`DELETE`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `promptKey` | `string` | **是** | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8080/v3/console/ai/prompt/draft?namespaceId=public&promptKey=my-prompt'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.7. 强制发布 Prompt 版本
#### 接口描述
通过该接口，可绕过流水线校验强制发布 Prompt 版本。

#### 起始版本

`3.2.1`

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt/force-publish`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `promptKey` | `string` | **是** | - |
| `version` | `string` | **是** | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/prompt/force-publish' -d "namespaceId=public&promptKey=my-prompt&version=1.0.0"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.8. 查询 Prompt 治理详情
#### 接口描述
通过该接口，可查询 Prompt 元数据、版本治理信息和版本摘要。

#### 起始版本

`3.2.1`

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt/governance`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `promptKey` | `string` | **是** | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data.schemaVersion | `integer` | - |
| data.data.promptKey | `string` | - |
| data.data.description | `string` | - |
| data.data.bizTags | `array` | - |
| data.data.bizTagsStr | `string` | - |
| data.data.latestVersion | `string` | - |
| data.data.gmtModified | `integer` | - |
| data.data.editingVersion | `string` | - |
| data.data.reviewingVersion | `string` | - |
| data.data.onlineCnt | `integer` | - |
| data.data.labels | `map<string, string>` | Skill 的版本标签。 |
| data.data.downloadCount | `integer` | - |
| data.data.writable | `boolean` | 当前用户是否可写该 Skill。 |
| data.data.versions | `array<SkillVersionSummary>` | Skill 版本摘要列表。 |
| data.data.versionDetails | `array` | - |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/prompt/governance?namespaceId=public&promptKey=my-prompt'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.9. 更新 Prompt 标签
#### 接口描述
通过该接口，可更新 Prompt 的运行时路由标签。

#### 起始版本

`3.2.1`

#### 请求方式

`PUT`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt/labels`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `promptKey` | `string` | **是** | - |
| `labels` | `string` | **是** | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data.totalCount | `integer` | 符合条件的 Skill 总数。 |
| data.data.pageNumber | `integer` | 当前页码。 |
| data.data.pagesAvailable | `integer` | 可用页数。 |
| data.data.pageItems | `array<SkillSummary>` | 当前页的 Skill 摘要列表。 |
| data.data.pageItems[i].namespaceId | `string` | Skill 所属命名空间 ID。 |
| data.data.pageItems[i].name | `string` | Skill 名称。 |
| data.data.pageItems[i].description | `string` | Skill 描述。 |
| data.data.pageItems[i].updateTime | `integer` | 最后更新时间。 |
| data.data.pageItems[i].owner | `string` | Skill 所有者。 |
| data.data.pageItems[i].enable | `boolean` | Skill 是否启用。 |
| data.data.pageItems[i].bizTags | `string` | 业务标签。 |
| data.data.pageItems[i].from | `string` | Skill 来源。 |
| data.data.pageItems[i].scope | `string` | 可见范围。 |
| data.data.pageItems[i].labels | `map<string, string>` | 版本标签。 |
| data.data.pageItems[i].editingVersion | `string` | 正在编辑的版本。 |
| data.data.pageItems[i].reviewingVersion | `string` | 正在评审的版本。 |
| data.data.pageItems[i].onlineCnt | `integer` | 已上线版本数量。 |
| data.data.pageItems[i].downloadCount | `integer` | 下载次数。 |
| data.data.pageItems[i].writable | `boolean` | 当前用户是否可写。 |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/prompt/labels' -d "namespaceId=namespaceId&promptKey=promptKey&labels=labels"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.10. 查询Prompt列表
#### 接口描述
通过该接口，可以分页查询Prompt列表。

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt/list`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pageNo` | `integer` | **是** | - |
| `pageSize` | `integer` | **是** | - |
| `namespaceId` | `string` | 否 | - |
| `promptKey` | `string` | 否 | - |
| `search` | `string` | 否 | blur or accurate |
| `bizTags` | `string` | 否 | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/prompt/list?pageNo=1&pageSize=10&namespaceId=public&promptKey=my-prompt&search=blur&bizTags=tag-a'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.11. 下线 Prompt 版本
#### 接口描述
通过该接口，可下线指定 Prompt 版本。

#### 起始版本

`3.2.1`

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt/offline`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `promptKey` | `string` | **是** | - |
| `version` | `string` | **是** | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/prompt/offline' -d "namespaceId=namespaceId&promptKey=promptKey&version=version"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.12. 上线 Prompt 版本
#### 接口描述
通过该接口，可上线指定 Prompt 版本。

#### 起始版本

`3.2.1`

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt/online`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `promptKey` | `string` | **是** | - |
| `version` | `string` | **是** | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/prompt/online' -d "namespaceId=namespaceId&promptKey=promptKey&version=version"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.13. 发布 Prompt 版本
#### 接口描述
通过该接口，可发布已通过评审的 Prompt 版本。

#### 起始版本

`3.2.1`

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt/publish`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `promptKey` | `string` | **是** | - |
| `version` | `string` | **是** | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/prompt/publish' -d "namespaceId=public&promptKey=my-prompt&version=1.0.0"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.14. 重新编辑 Prompt 版本
#### 接口描述
通过该接口，可将已评审的 Prompt 版本重新转为草稿。

#### 起始版本

`3.2.2`

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt/redraft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `promptKey` | `string` | **是** | - |
| `version` | `string` | **是** | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/prompt/redraft' -d "namespaceId=namespaceId&promptKey=promptKey&version=version"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.15. 提交 Prompt 版本
#### 接口描述
通过该接口，可提交 Prompt 版本进入流水线评审。

#### 起始版本

`3.2.1`

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt/submit`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `promptKey` | `string` | **是** | - |
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
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/prompt/submit' -d "namespaceId=namespaceId&promptKey=promptKey&version=version"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.16. 查询 Prompt 版本详情
#### 接口描述
通过该接口，可查询指定 Prompt 版本详情。

#### 起始版本

`3.2.1`

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt/version`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `promptKey` | `string` | **是** | - |
| `version` | `string` | 否 | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data.promptKey | `string` | - |
| data.data.version | `string` | - |
| data.data.status | `string` | - |
| data.data.commitMsg | `string` | - |
| data.data.srcUser | `string` | - |
| data.data.gmtModified | `integer` | - |
| data.data.publishPipelineInfo | `string` | - |
| data.data.downloadCount | `integer` | - |
| data.data.template | `string` | - |
| data.data.md5 | `string` | - |
| data.data.variables | `array` | - |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/prompt/version?namespaceId=public&promptKey=my-prompt&version=1.0.0'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.17. 下载 Prompt 版本
#### 接口描述
通过该接口，可将指定 Prompt 版本下载为 Markdown 文件。

#### 起始版本

`3.2.2`

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt/version/download`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `promptKey` | `string` | **是** | - |
| `version` | `string` | 否 | - |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/prompt/version/download?namespaceId=public&promptKey=my-prompt&version=1.0.0'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.18. 查询Prompt版本列表
#### 接口描述
通过该接口，可以分页查询指定Prompt的版本列表。

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/prompt/versions`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `promptKey` | `string` | **是** | - |
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
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/prompt/versions?namespaceId=public&promptKey=my-prompt&pageNo=1&pageSize=10'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

## 7. Skills 管理

Skills 管理 API 提供 Skill 的查询、草稿、发布、上下线、版本管理与 ZIP 上传能力。

### 7.1. 查询Skill详情
#### 接口描述
通过该接口，可以查询托管在Nacos上指定Skill的详细信息。

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/skills`

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
| data.data.updateTime | `integer` | - |
| data.data.owner | `string` | - |
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
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/skills?namespaceId=public&skillName=my-skill&version=1.0.0'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.2. 删除Skill
#### 接口描述
通过该接口，可以删除托管在Nacos上的Skill。

#### 起始版本

`3.2.0`

#### 请求方式

`DELETE`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/skills`

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
curl -X DELETE 'http://127.0.0.1:8080/v3/console/ai/skills?namespaceId=public&skillName=my-skill&version=1.0.0'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.3. 更新Skill业务标签
#### 接口描述
通过该接口，可更新Skill的业务标签列表，无需变更版本状态。

#### 起始版本

`3.2.0`

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
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/skills/biz-tags' -d "namespaceId=public&skillName=my-skill&bizTags=bizTags"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.4. 创建Skill草稿版本
#### 接口描述
通过该接口，可基于某一已有版本或全新 SkillCard 创建草稿版本。

#### 起始版本

`3.2.0`

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
| `commitMsg` | `string` | 否 | 草稿版本的提交说明。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/skills/draft' -d "namespaceId=public&skillName=my-skill&targetVersion=1.0.0&skillCard={}&commitMsg=initial"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.5. 更新Skill草稿内容
#### 接口描述
通过该接口，可更新当前草稿版本的 SkillCard 内容。

#### 起始版本

`3.2.0`

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
| `skillCard` | `string` | **是** | Skill card JSON string containing complete Skill information |
| `setAsLatest` | `boolean` | 否 | 是否将更新后的草稿设为最新版本。 |
| `commitMsg` | `string` | 否 | 草稿版本的提交说明。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/skills/draft' -d "namespaceId=public&skillCard={}&setAsLatest=true&commitMsg=update"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.6. 删除Skill草稿版本
#### 接口描述
通过该接口，可删除指定Skill的当前草稿版本。

#### 起始版本

`3.2.0`

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
curl -X DELETE 'http://127.0.0.1:8080/v3/console/ai/skills/draft?namespaceId=public&skillName=my-skill'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.7. 强制发布 Skill 版本
#### 接口描述
通过该接口，可绕过流水线校验强制发布 Skill 版本。

#### 起始版本

`3.2.1`

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/skills/force-publish`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `skillName` | `string` | **是** | - |
| `version` | `string` | **是** | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/skills/force-publish' -d "namespaceId=public&skillName=my-skill&version=1.0.0"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.8. 更新Skill版本标签
#### 接口描述
通过该接口，可更新Skill的版本路由标签（如 latest 标签），无需变更版本状态。

#### 起始版本

`3.2.0`

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
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/skills/labels' -d "namespaceId=public&skillName=my-skill&labels=labels"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.9. 查询Skill列表
#### 接口描述
通过该接口，可以查询托管在Nacos上的Skill列表。

#### 起始版本

`3.2.0`

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/skills/list`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pageNo` | `integer` | **是** | - |
| `pageSize` | `integer` | **是** | - |
| `namespaceId` | `string` | 否 | - |
| `skillName` | `string` | 否 | - |
| `search` | `string` | 否 | blur or accurate |
| `orderBy` | `string` | 否 | 排序字段及方向。 |
| `owner` | `string` | 否 | 按资源所有者筛选。 |
| `scope` | `string` | 否 | 按可见范围筛选。 |
| `bizTag` | `string` | 否 | 按业务标签筛选。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/skills/list?pageNo=1&pageSize=10&namespaceId=public&skillName=my-skill&search=blur&orderBy=updateTime'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.10. 下线Skill
#### 接口描述
通过该接口，可对指定版本或整个Skill执行下线操作，使其不可被调用。

#### 起始版本

`3.2.0`

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
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/skills/offline' -d "namespaceId=public&skillName=my-skill&scope=scope&version=version"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.11. 上线Skill
#### 接口描述
通过该接口，可对指定版本或整个Skill执行上线操作，使其可被调用。

#### 起始版本

`3.2.0`

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
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/skills/online' -d "namespaceId=public&skillName=my-skill&scope=scope&version=version"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.12. 发布Skill版本
#### 接口描述
通过该接口，可将审核通过的Skill版本正式发布。

#### 起始版本

`3.2.0`

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

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/skills/publish' -d "namespaceId=public&skillName=my-skill&version=1.0.0"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.13. 重新编辑 Skill 版本
#### 接口描述
通过该接口，可将已评审的 Skill 版本重新转为草稿。

#### 起始版本

`3.2.2`

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/skills/redraft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `skillName` | `string` | **是** | - |
| `version` | `string` | **是** | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/skills/redraft' -d "namespaceId=public&skillName=my-skill&version=version"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.14. 更新Skill可见范围
#### 接口描述
通过该接口，可将Skill的可见范围设置为 PUBLIC（公开）或 PRIVATE（私有）。

#### 起始版本

`3.2.0`

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
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/skills/scope' -d "namespaceId=public&skillName=my-skill&scope=scope"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.15. 提交Skill版本审核
#### 接口描述
通过该接口，可将Skill草稿版本提交至流水线进行审核。

#### 起始版本

`3.2.0`

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
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/skills/submit' -d "namespaceId=public&skillName=my-skill&version=version"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.16. 上传Skill（ZIP）
#### 接口描述
通过该接口，可通过ZIP文件上传Skill。

#### 起始版本

`3.2.0`

#### 请求方式

`POST`

请求体类型：`multipart/form-data`（如文件上传），请求示例中需使用 `-F` 或 `-H 'Content-Type: multipart/form-data'`。

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/skills/upload`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID；既可作为 Query 参数传递，也可作为 multipart 表单字段，默认值为 `public`。 |
| `overwrite` | `boolean` | 否 | 是否覆盖已有草稿；既可作为 Query 参数传递，也可作为 multipart 表单字段，默认值为 `false`。 |
| `targetVersion` | `string` | 否 | 上传后的目标版本；既可作为 Query 参数传递，也可作为 multipart 表单字段。 |
| `commitMsg` | `string` | 否 | 版本提交说明；既可作为 Query 参数传递，也可作为 multipart 表单字段。 |
| `uploadAction` | `string` | 否 | 上传动作；既可作为 Query 参数传递，也可作为 multipart 表单字段。 |
| `file` | `file` | **是** | multipart 表单中的 Skill ZIP 文件。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/skills/upload?namespaceId=public&overwrite=false&targetVersion=1.0.0&commitMsg=init&uploadAction=CREATE' -F "file=@/path/to/skill.zip" -F "overwrite=false" -F "namespaceId=public" -F "targetVersion=1.0.0" -F "commitMsg=init" -F "uploadAction=CREATE"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.17. 批量上传 Skill
#### 接口描述
通过该接口，可从包含多个 Skill 子目录的 ZIP 文件批量上传 Skill。

#### 起始版本

`3.2.2`

#### 请求方式

`POST`

请求体类型：`multipart/form-data`（如文件上传），请求示例中需使用 `-F` 或 `-H 'Content-Type: multipart/form-data'`。

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/skills/upload/batch`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | 命名空间 ID；既可作为 Query 参数传递，也可作为 multipart 表单字段，省略时使用默认命名空间。 |
| `overwrite` | `boolean` | 否 | 是否覆盖已有草稿；既可作为 Query 参数传递，也可作为 multipart 表单字段，默认值为 `false`。 |
| `file` | `file` | **是** | multipart 表单中包含多个 Skill 子目录的 ZIP 文件。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data.succeeded | `array<string>` | 上传成功的 Skill 名称。 |
| data.data.failed | `array<FailedItem>` | 上传失败的条目。 |
| data.data.results | `array<BatchUploadItemResult>` | 每个上传条目的处理结果。 |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/skills/upload/batch?namespaceId=public&overwrite=false' -F "namespaceId=public" -F "overwrite=false" -F "file=@/path/to/skills.zip"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.18. 查询Skill版本详情
#### 接口描述
通过该接口，可按命名空间、Skill名称和版本号查询指定版本的 Skill 详情。

#### 起始版本

`3.2.0`

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
| data.data.resource | `map<string, SkillResource>` | 以资源标识为键的 Skill 资源映射。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/skills/version?namespaceId=public&skillName=my-skill&version=1.0.0'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.19. 下载Skill版本 ZIP 包
#### 接口描述
通过该接口，可下载指定版本的 Skill ZIP 包。

#### 起始版本

`3.2.0`

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
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/skills/version/download?namespaceId=public&skillName=my-skill&version=1.0.0'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 7.20. 预检 Skill 上传

#### 接口描述

通过该接口，可校验 ZIP 文件中的一个或多个 Skill 包，并返回每个包所需的上传动作。

#### 起始版本

`3.3.0`

#### 请求方式

`POST`

请求体类型：`multipart/form-data`。

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/skills/upload/precheck`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Query 参数或 multipart 表单字段；省略时使用默认命名空间。 |
| `file` | `file` | **是** | 包含一个或多个 Skill 包的 ZIP 文件。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `array<SkillUploadPrecheckResult>` | 每个 Skill 包的上传预检结果。 |

`SkillUploadPrecheckResult` 结构如下：

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `namespaceId` | `string` | 目标命名空间 ID。 |
| `entryPath` | `string` | Skill 包在 ZIP 中的入口路径。 |
| `skillName` | `string` | Skill 名称。 |
| `reason` | `string` | 预检结论说明。 |
| `owner` | `string` | 已有 Skill 的所有者。 |
| `maxPublishedVersion` | `string` | 当前已发布的最高版本。 |
| `parsedVersion` | `string` | 从包中解析出的版本。 |
| `targetVersion` | `string` | 建议上传的目标版本。 |
| `exists` | `boolean` | Skill 是否已存在。 |
| `editingVersion` | `string` | 当前编辑中的版本。 |
| `reviewingVersion` | `string` | 当前评审中的版本。 |
| `precheckCode` | `string` | 预检结果代码。 |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/skills/upload/precheck?namespaceId=public' -F 'file=@/path/to/skills.zip'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "namespaceId": "public",
      "entryPath": "my-skill",
      "skillName": "my-skill",
      "targetVersion": "1.0.0",
      "exists": false,
      "precheckCode": "READY"
    }
  ]
}
```

## 8. AgentSpec 管理

AgentSpec 管理 API 提供 AgentSpec 的查询、草稿、发布、上下线、版本管理与 ZIP 上传能力。

### 8.1. 查询 AgentSpec
#### 接口描述
通过该接口，可按命名空间和名称查询 AgentSpec 的最新已发布版本。

#### 起始版本

`3.2.0`

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
| data.data.owner | `string` | AgentSpec 所有者。 |
| data.data.enable | `boolean` | - |
| data.data.bizTags | `string` | - |
| data.data.from | `string` | - |
| data.data.scope | `string` | - |
| data.data.labels | `map<string, string>` | AgentSpec 的版本标签。 |
| data.data.editingVersion | `string` | - |
| data.data.reviewingVersion | `string` | - |
| data.data.onlineCnt | `integer` | - |
| data.data.downloadCount | `integer` | - |
| data.data.writable | `boolean` | 当前用户是否可写该 AgentSpec。 |
| data.data.versions | `array<AgentSpecVersionSummary>` | AgentSpec 版本摘要列表。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/agentspecs?namespaceId=public&agentSpecName=my-agent&version=1.0.0'
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
| data.data.totalCount | `integer` | 符合条件的 AgentSpec 总数。 |
| data.data.pageNumber | `integer` | 当前页码。 |
| data.data.pagesAvailable | `integer` | 可用页数。 |
| data.data.pageItems | `array<AgentSpecSummary>` | 当前页的 AgentSpec 摘要列表。 |
| data.data.pageItems[i].namespaceId | `string` | AgentSpec 所属命名空间 ID。 |
| data.data.pageItems[i].name | `string` | AgentSpec 名称。 |
| data.data.pageItems[i].description | `string` | AgentSpec 描述。 |
| data.data.pageItems[i].updateTime | `integer` | 最后更新时间。 |
| data.data.pageItems[i].owner | `string` | AgentSpec 所有者。 |
| data.data.pageItems[i].enable | `boolean` | AgentSpec 是否启用。 |
| data.data.pageItems[i].bizTags | `string` | 业务标签。 |
| data.data.pageItems[i].from | `string` | AgentSpec 来源。 |
| data.data.pageItems[i].scope | `string` | 可见范围。 |
| data.data.pageItems[i].labels | `map<string, string>` | 版本标签。 |
| data.data.pageItems[i].editingVersion | `string` | 正在编辑的版本。 |
| data.data.pageItems[i].reviewingVersion | `string` | 正在评审的版本。 |
| data.data.pageItems[i].onlineCnt | `integer` | 已上线版本数量。 |
| data.data.pageItems[i].downloadCount | `integer` | 下载次数。 |
| data.data.pageItems[i].writable | `boolean` | 当前用户是否可写。 |

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8080/v3/console/ai/agentspecs?namespaceId=public&agentSpecName=my-agent'
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
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/agentspecs/biz-tags' -d "namespaceId=public&agentSpecName=my-agent&bizTags=bizTags"
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

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agentspecs/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `agentSpecName` | `string` | **是** | - |
| `basedOnVersion` | `string` | 否 | - |
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
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agentspecs/draft' -d "namespaceId=public&agentSpecName=my-agent&targetVersion=1.0.0"
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

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agentspecs/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `agentSpecCard` | `string` | **是** | AgentSpec card JSON string containing complete AgentSpec information |
| `setAsLatest` | `boolean` | 否 | 是否将更新后的草稿设为最新版本。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/agentspecs/draft' -d "namespaceId=public&agentSpecCard={}&setAsLatest=true"
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
curl -X DELETE 'http://127.0.0.1:8080/v3/console/ai/agentspecs/draft?namespaceId=public&agentSpecName=my-agent'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 8.7. 强制发布 AgentSpec 版本
#### 接口描述
通过该接口，可绕过流水线校验强制发布 AgentSpec 版本。

#### 起始版本

`3.2.1`

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agentspecs/force-publish`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `agentSpecName` | `string` | **是** | - |
| `version` | `string` | **是** | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agentspecs/force-publish' -d "namespaceId=public&agentSpecName=my-agent&version=1.0.0"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 8.8. 更新 AgentSpec 版本标签
#### 接口描述
通过该接口，可更新 AgentSpec 的版本路由标签（如 latest 标签），无需变更版本状态。

#### 起始版本

`3.2.0`

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
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/agentspecs/labels' -d "namespaceId=public&agentSpecName=my-agent&labels=labels"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 8.9. 查询 AgentSpec 列表
#### 接口描述
通过该接口，可按命名空间和名称分页查询 AgentSpec 列表。

#### 起始版本

`3.2.0`

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
| `orderBy` | `string` | 否 | 排序字段及方向。 |
| `owner` | `string` | 否 | 按资源所有者筛选。 |
| `scope` | `string` | 否 | 按可见范围筛选。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/agentspecs/list?pageNo=1&pageSize=10&namespaceId=public&agentSpecName=my-agent&search=blur&orderBy=updateTime'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 8.10. 下线 AgentSpec
#### 接口描述
通过该接口，可对指定版本或整个 AgentSpec 执行下线操作，使其不可被调用。

#### 起始版本

`3.2.0`

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
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agentspecs/offline' -d "namespaceId=public&agentSpecName=my-agent&scope=scope&version=version"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 8.11. 上线 AgentSpec
#### 接口描述
通过该接口，可对指定版本或整个 AgentSpec 执行上线操作，使其可被调用。

#### 起始版本

`3.2.0`

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
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agentspecs/online' -d "namespaceId=public&agentSpecName=my-agent&scope=scope&version=version"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 8.12. 发布 AgentSpec 版本
#### 接口描述
通过该接口，可将审核通过的 AgentSpec 版本正式发布。

#### 起始版本

`3.2.0`

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

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agentspecs/publish' -d "namespaceId=public&agentSpecName=my-agent&version=1.0.0"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 8.13. 重新编辑 AgentSpec 版本
#### 接口描述
通过该接口，可将已评审的 AgentSpec 版本重新转为草稿。

#### 起始版本

`3.2.2`

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agentspecs/redraft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `agentSpecName` | `string` | **是** | - |
| `version` | `string` | **是** | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agentspecs/redraft' -d "namespaceId=public&agentSpecName=my-agent&version=version"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 8.14. 更新 AgentSpec 可见范围
#### 接口描述
通过该接口，可将 AgentSpec 的可见范围设置为 PUBLIC（公开）或 PRIVATE（私有）。

#### 起始版本

`3.2.0`

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
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/agentspecs/scope' -d "namespaceId=public&agentSpecName=my-agent&scope=scope"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 8.15. 提交 AgentSpec 版本审核
#### 接口描述
通过该接口，可将 AgentSpec 草稿版本提交至流水线进行审核。

#### 起始版本

`3.2.0`

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
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agentspecs/submit' -d "namespaceId=public&agentSpecName=my-agent&version=version"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 8.16. 上传 AgentSpec
#### 接口描述
通过该接口，可上传 ZIP 格式的 AgentSpec 包，自动解析并创建或更新 AgentSpec。

#### 起始版本

`3.2.0`

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
| `namespaceId` | `string` | 否 | 命名空间 ID；既可作为 Query 参数传递，也可作为 multipart 表单字段，默认值为 `public`。 |
| `overwrite` | `boolean` | 否 | 是否覆盖已有草稿；既可作为 Query 参数传递，也可作为 multipart 表单字段，默认值为 `false`。 |
| `file` | `file` | **是** | multipart 表单中的 AgentSpec ZIP 文件。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agentspecs/upload?namespaceId=public&overwrite=false' -F "namespaceId=public" -F "overwrite=false" -F "file=@/path/to/skills.zip"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 8.17. 查询 AgentSpec 版本
#### 接口描述
通过该接口，可按命名空间、名称和版本号查询指定版本的 AgentSpec 详情。

#### 起始版本

`3.2.0`

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
| data.data.resource | `map<string, AgentSpecResource>` | 以资源标识为键的 AgentSpec 资源映射。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/agentspecs/version?namespaceId=public&agentSpecName=my-agent&version=1.0.0'
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

Pipeline 管理 API 提供 Pipeline 执行记录列表、详情与实例查询能力。

### 9.1. 查询 Pipeline 执行记录列表
#### 接口描述
通过该接口，可按资源类型、资源名称、命名空间和版本分页查询 Pipeline 执行记录。

#### 起始版本

`3.2.1`

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
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/pipelines?resourceType=skill&resourceName=my-skill&namespaceId=public&version=1.0.0&pageNo=1&pageSize=10'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 9.2. 查询 Pipeline 执行记录
#### 接口描述
通过该接口，可按 Pipeline ID 查询 Pipeline 执行记录详情。

#### 起始版本

`3.2.1`

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/pipelines/detail`

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
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/pipelines/detail?pipelineId=pipeline-001'
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

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/pipelines/list`

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
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/pipelines/list?resourceType=skill&resourceName=my-skill&namespaceId=public&version=1.0.0&pageNo=1&pageSize=10'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 9.4. 查询 Pipeline 执行记录
#### 接口描述
通过该接口，可按 Pipeline ID 查询 Pipeline 执行记录详情。

#### 起始版本

`3.2.0`

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

## 10. AI 资源导入

AI 资源导入 API 提供外部 AI 资源导入源查询、搜索、校验与执行能力。

API 的 `sourceId` 等于 managed `pluginName`，当前固定为 `mcp-official`、`mcp-registry-protocol`、`skills-sh` 或 `skills-well-known`。来源描述中的 `pluginName` 字段仍表示 importerType，不是 sourceId。Next Console 保持 `mcp-official` 与 `skills-sh` 原有展示名称和搜索—选择—校验—导入体验，但不再支持 preset 或复制 endpoint。

### 10.1. 执行 AI 资源导入
#### 接口描述
通过该接口，可导入选中的外部 AI 资源。

#### 起始版本

`3.2.2`

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/import/execute`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `resourceType` | `string` | **是** | - |
| `sourceId` | `string` | **是** | - |
| `selectedItems` | `string` | **是** | - |
| `overwriteExisting` | `boolean` | 否 | - |
| `skipInvalid` | `boolean` | 否 | - |
| `validationToken` | `string` | 否 | - |
| `options` | `string` | 否 | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data.success | `boolean` | - |
| data.data.totalCount | `integer` | - |
| data.data.successCount | `integer` | - |
| data.data.failedCount | `integer` | - |
| data.data.skippedCount | `integer` | - |
| data.data.results | `array` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/import/execute' -d "namespaceId=namespaceId&resourceType=resourceType&sourceId=sourceId&selectedItems=selectedItems&overwriteExisting=overwriteExisting&skipInvalid=skipInvalid&validationToken=validationToken&options=options"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 10.2. 搜索外部 AI 资源
#### 接口描述
通过该接口，可从指定导入源搜索可导入的外部 AI 资源。

#### 起始版本

`3.2.2`

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/import/search`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `resourceType` | `string` | **是** | - |
| `sourceId` | `string` | **是** | - |
| `query` | `string` | 否 | - |
| `cursor` | `string` | 否 | - |
| `limit` | `integer` | 否 | - |
| `options` | `string` | 否 | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data.sourceId | `string` | - |
| data.data.resourceType | `string` | - |
| data.data.nextCursor | `string` | - |
| data.data.hasMore | `boolean` | - |
| data.data.items | `array` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/import/search' -d "namespaceId=namespaceId&resourceType=resourceType&sourceId=sourceId&query=query&cursor=cursor&limit=limit&options=options"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 10.3. 查询 AI 资源导入源
#### 接口描述
通过该接口，可查询当前配置的 AI 资源导入源。

#### 起始版本

`3.2.2`

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/import/sources`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `resourceType` | `string` | 否 | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `array` | - |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/import/sources?resourceType=skill'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 10.4. 校验 AI 资源导入项
#### 接口描述
通过该接口，可校验选中的外部 AI 资源是否可导入。

#### 起始版本

`3.2.2`

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/import/validate`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | - |
| `resourceType` | `string` | **是** | - |
| `sourceId` | `string` | **是** | - |
| `selectedItems` | `string` | **是** | - |
| `overwriteExisting` | `boolean` | 否 | - |
| `options` | `string` | 否 | - |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data.sourceId | `string` | - |
| data.data.resourceType | `string` | - |
| data.data.validationToken | `string` | - |
| data.data.items | `array` | - |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/import/validate' -d "namespaceId=namespaceId&resourceType=resourceType&sourceId=sourceId&selectedItems=selectedItems&overwriteExisting=overwriteExisting&options=options"
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

## 11. Copilot

Copilot 相关 API 提供配置获取/保存、Prompt 调试与优化、Skill 生成与优化等能力（部分接口为 SSE 流式返回）。

### 11.1. 获取Copilot配置

#### 接口描述

获取当前 Copilot 配置。当前实现从存储配置中复制 `apiKey`、`model`、`studioUrl`、`studioProject`；响应模型同时序列化默认的 `enabled=true` 和 `defaultNamespace=public`。后两项不能通过 11.2 的保存接口修改。

#### 起始版本

`3.2.0`

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
    "enabled": true,
    "defaultNamespace": "public",
    "apiKey": "",
    "model": "qwen-turbo",
    "studioUrl": null,
    "studioProject": "NacosCopilot"
  }
}
```

### 11.2. 保存Copilot配置

#### 接口描述

创建或更新 Copilot 配置，仅处理 `apiKey`、`model`、`studioUrl`、`studioProject`。请求模型虽然还暴露 `enabled`、`defaultNamespace`，但当前 Controller 会忽略这两个字段：已有配置保留原值，新配置使用默认值。

#### 起始版本

`3.2.0`

#### 请求方式

`POST`

请求体类型：`application/json`。请求示例中需使用 `-H 'Content-Type: application/json'`。

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/copilot/config`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `apiKey` | `string` | 否 | Copilot 调用模型服务时使用的 API Key；省略时保留已有值或使用默认配置。 |
| `model` | `string` | 否 | Copilot 使用的模型标识；省略时保留已有值或使用默认配置。 |
| `studioUrl` | `string` | 否 | 关联的 AgentScope Studio 服务地址；省略时保留已有值或使用默认配置。 |
| `studioProject` | `string` | 否 | 关联的 AgentScope Studio 项目标识；省略时保留已有值或使用默认配置。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| data | `boolean` | 是否保存成功。 |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/copilot/config' \
  -H 'Content-Type: application/json' \
  -d '{"apiKey":"your-api-key","model":"qwen-turbo","studioUrl":"http://127.0.0.1:8080","studioProject":"NacosCopilot"}'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 11.3. 流式调试Prompt

#### 接口描述

通过该接口，可使用用户输入流式调试Prompt并返回模型响应，返回SSE流。

#### 起始版本

`3.2.0`

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

### 11.4. 流式优化Prompt

#### 接口描述

通过该接口，可流式优化Prompt，返回SSE流。

#### 起始版本

`3.2.0`

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

### 11.5. 流式生成Skill

#### 接口描述

通过该接口，可基于背景信息流式生成Skill，返回SSE流。

#### 起始版本

`3.2.0`

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
| `selectedMcpTools`   | `array<map<string, object>>` | 否 | 选中的 MCP 工具。      |
| `conversationHistory` | `ConversationHistory` | 否 | 对话历史。           |

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

### 11.6. 流式优化Skill

#### 接口描述

通过该接口，可基于目标与对话历史流式优化Skill，返回SSE流。

#### 起始版本

`3.2.0`

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
| `conversationHistory` | `ConversationHistory` | 否 | 对话历史。           |
| `targetFileName`      | `string` | 否 | 目标文件名。          |
| `optimizationGoal`    | `string` | 否 | 优化目标。           |
| `skill`               | `Skill` | 否 | 待优化的 Skill 定义。   |
| `selectedMcpTools`   | `array<map<string, object>>` | 否 | 选中的 MCP 工具。      |

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

## 12. Agent 管理

Agent 管理 API 提供 Agent 定义、草稿、版本流转、运行时端点和分页查询能力。Agent 名称和版本号均按原值区分大小写；版本号格式为 `MAJOR.MINOR.PATCH[-PRERELEASE]`，不接受 `+BUILD` 元数据。

这套 Agent 管理 API 是后续推荐的统一集成方向，未来将逐步替代现有 A2A 管理 API。新接入的用户和 SDK 应优先对接并兼容 Agent 管理 API，避免为新集成继续依赖旧 A2A API；已有 A2A 集成可依据后续版本发布和迁移说明逐步切换。这里描述的是管理 API 的演进，不表示 A2A 协议本身已废弃。

本节的 `AgentProvider` 和 `AgentVersionDetail` 属于 **Agent 管理模型**。它们与 A2A 注册中心中同名的 Swagger Schema 不是同一结构：这里的 `AgentProvider` 使用 `name`、`url`，这里的 `AgentVersionDetail` 包含完整版本元数据和调用接口。当前 Swagger 因 Java 类型同名会将这两个 Schema 错误地指向 A2A 模型，阅读本节时应以如下结构为准。

常用命名类型关系如下：

| 类型 | 结构或关键字段 |
|------|----------------|
| `AgentOverview` | `agent: Agent`、`versionPage: Page<AgentVersionSummary>` |
| `Agent` | `namespaceId`、`agentName`、`displayName`、`description`、`iconUrl`、`provider: AgentProvider`、`tags: array<string>`、`extensions: map<string, object>`、`status`、`owner`、`scope`、`versionInfo: AgentVersionInfo`、`versionCatalog: AgentVersionCatalog`、`metaVersion`、`createTime`、`updateTime` |
| `AgentSummary` | 与 `Agent` 的摘要字段相同，但不包含 `extensions` |
| `AgentProvider` | `name: string`、`url: string` |
| `AgentVersionInfo` | `editingVersion`、`reviewingVersion`、`onlineCnt`、`labels: map<string, string>` |
| `AgentVersionCatalog` | `latestVersion`、`onlineVersions: array<AgentVersionCatalogEntry>` |
| `AgentVersionCatalogEntry` | `version`、`labels: array<string>`、`protocols: array<string>` |
| `AgentVersionSummary` | `version`、`status`、`author`、`changeDescription`、`contentDigest`、`createTime`、`updateTime` |
| `AgentVersionDetail` | `namespaceId`、`agentName`、`version`、`status`、`callInterfaces: array<AgentCallInterface>`、`author`、`changeDescription`、`contentDigest`、`createTime`、`updateTime` |
| `ConsoleRuntimeEndpointView` | `runtimeEndpointSnapshot: RuntimeEndpointSnapshot`、`namingServiceRef: NamingServiceRef` |

`AgentCallInterface` 及声明端点结构如下：

| 字段 | 类型 | 描述 |
|------|------|------|
| `protocol` | `string` | 协议标识；同一版本内唯一。 |
| `protocolVersion` | `string` | 协议版本。 |
| `descriptorMediaType` | `string` | `nativeDescriptor` 的媒体类型。 |
| `nativeDescriptor` | `object` | 完整的协议原生描述符；仅该字段因内容由协议决定而保留为 `object`。 |
| `endpointSourceOrder` | `array<EndpointSource>` | 端点来源优先级；元素为 `RUNTIME` 或 `DECLARED`，不可重复。 |
| `declaredEndpoints` | `array<Endpoint>` | 从原生描述符派生的静态端点。 |

`Endpoint` 包含 `uri: string`、`transport: string`、`priority: integer`、`weight: number`、`metadata: map<string, string>` 和 `healthy: boolean`。

运行时端点命名类型关系如下：

| 类型 | 结构或关键字段 |
|------|----------------|
| `RuntimeEndpointSnapshot` | `namespaceId`、`agentName`、`protocol`、可选 `version`、`items: array<RuntimeEndpointSnapshotItem>` |
| `RuntimeEndpointSnapshotItem` | `endpoint: Endpoint`、`bindings: array<RuntimeVersionBinding>`、`state`、`enabled`、`healthy`、`lastUpdatedTime` |
| `RuntimeVersionBinding` | `runtimeVersion`、`versionRange` |
| `NamingServiceRef` | `namespaceId`、`groupName`、`serviceName` |

Agent 资源状态仅支持 `enable`、`disable`；Agent 版本状态为 `draft`、`reviewing`、`reviewed`、`online`、`offline`。

### 12.1. 查询 Agent 概览

#### 接口描述

通过该接口，可查询 Agent 定义及其有限数量的版本摘要。

#### 起始版本

`3.3.0`

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/agents`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Agent 所属命名空间 ID，省略时使用默认命名空间。 |
| `agentName` | `string` | **是** | Agent 名称。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `AgentOverview` | Agent 定义及版本摘要分页结果。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/agents?namespaceId=public&agentName=my-agent'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "agent": {"namespaceId": "public", "agentName": "my-agent"},
    "versionPage": {"totalCount": 0, "pageNumber": 1, "pagesAvailable": 0, "pageItems": []}
  }
}
```

### 12.2. 更新 Agent

#### 接口描述

通过该接口，可替换 Agent 定义中的所有可写字段。

#### 起始版本

`3.3.0`

#### 请求方式

`PUT`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agents`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Agent 所属命名空间 ID。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `displayName` | `string` | 否 | Agent 展示名称。 |
| `description` | `string` | 否 | Agent 描述。 |
| `iconUrl` | `string` | 否 | Agent 图标 URL。 |
| `provider` | `string` | 否 | JSON 编码的 `AgentProvider`。 |
| `tags` | `string` | 否 | JSON 编码的字符串标签数组。 |
| `extensions` | `string` | 否 | JSON 编码的扩展属性对象。 |
| `status` | `string` | **是** | Agent 资源状态，仅支持 `enable` 或 `disable`。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `Agent` | 更新后的 Agent 定义。 |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/agents' -d 'namespaceId=public&agentName=my-agent&displayName=My Agent&status=enable'
```

* 返回示例

```json
{"code":0,"message":"success","data":{"namespaceId":"public","agentName":"my-agent","displayName":"My Agent","status":"enable"}}
```

### 12.3. 删除 Agent

#### 接口描述

通过该接口，可删除 Agent 定义及其全部版本内容。

#### 起始版本

`3.3.0`

#### 请求方式

`DELETE`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agents`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Agent 所属命名空间 ID。 |
| `agentName` | `string` | **是** | Agent 名称。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `null` | 删除成功时无业务数据。 |

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8080/v3/console/ai/agents?namespaceId=public&agentName=my-agent'
```

* 返回示例

```json
{"code":0,"message":"success","data":null}
```

### 12.4. 创建 Agent 草稿

#### 接口描述

通过该接口，可创建 Agent 的初始草稿或后续草稿版本。请求必须且只能提供 `callInterfaces` 或 `basedOnVersion` 之一；首次创建 Agent 时不存在可复制的已有版本，因此必须直接提供非空 `callInterfaces`。仅首次创建时可通过同一请求初始化 Agent 元数据，后续草稿不接受这些元数据字段。

#### 起始版本

`3.3.0`

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agents/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Agent 所属命名空间 ID。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `version` | `string` | **是** | 新草稿版本号。 |
| `displayName` | `string` | 否 | Agent 展示名称。 |
| `description` | `string` | 否 | Agent 描述。 |
| `iconUrl` | `string` | 否 | Agent 图标 URL。 |
| `provider` | `string` | 否 | JSON 编码的 `AgentProvider`。 |
| `tags` | `string` | 否 | JSON 编码的字符串标签数组。 |
| `extensions` | `string` | 否 | JSON 编码的扩展属性对象。 |
| `callInterfaces` | `string` | 否 | JSON 编码的非空 `array<AgentCallInterface>`；与 `basedOnVersion` 二选一，首次创建 Agent 时必须提供。 |
| `author` | `string` | 否 | 草稿作者。 |
| `changeDescription` | `string` | 否 | 版本变更说明。 |
| `basedOnVersion` | `string` | 否 | 创建草稿所基于的已有精确版本；与 `callInterfaces` 二选一，首次创建 Agent 时不可使用。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `AgentVersionDetail` | 创建后的 Agent 草稿版本详情。 |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agents/draft' \
  -d 'namespaceId=public' \
  -d 'agentName=my-agent' \
  -d 'version=1.0.0' \
  -d 'displayName=My Agent' \
  -d 'author=nacos' \
  --data-urlencode 'callInterfaces=[{"protocol":"A2A","protocolVersion":"0.3.0","descriptorMediaType":"application/json","nativeDescriptor":{"protocolVersion":"0.3.0","name":"my-agent","description":"Customer support agent","url":"https://agent.example.com/a2a","version":"1.0.0","capabilities":{},"defaultInputModes":["text"],"defaultOutputModes":["text"],"skills":[]},"endpointSourceOrder":["DECLARED"],"declaredEndpoints":[{"uri":"https://agent.example.com/a2a","transport":"JSONRPC","priority":0,"weight":1.0}]}]'
```

* 返回示例

```json
{"code":0,"message":"success","data":{"namespaceId":"public","agentName":"my-agent","version":"1.0.0","status":"draft","callInterfaces":[{"protocol":"A2A","protocolVersion":"0.3.0","descriptorMediaType":"application/json","nativeDescriptor":{"protocolVersion":"0.3.0","name":"my-agent","description":"Customer support agent","url":"https://agent.example.com/a2a","version":"1.0.0","capabilities":{},"defaultInputModes":["text"],"defaultOutputModes":["text"],"skills":[]},"endpointSourceOrder":["DECLARED"],"declaredEndpoints":[{"uri":"https://agent.example.com/a2a","transport":"JSONRPC","priority":0,"weight":1.0}]}],"author":"nacos"}}
```

### 12.5. 更新 Agent 草稿

#### 接口描述

通过该接口，可替换 Agent 草稿的调用接口及变更说明。

#### 起始版本

`3.3.0`

#### 请求方式

`PUT`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agents/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Agent 所属命名空间 ID。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `version` | `string` | **是** | 待更新的草稿版本。 |
| `callInterfaces` | `string` | **是** | JSON 编码的 `array<AgentCallInterface>`。 |
| `changeDescription` | `string` | 否 | 版本变更说明。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `AgentVersionDetail` | 更新后的 Agent 草稿版本详情。 |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/agents/draft' \
  -d 'namespaceId=public' \
  -d 'agentName=my-agent' \
  -d 'version=1.0.0' \
  -d 'changeDescription=update endpoints' \
  --data-urlencode 'callInterfaces=[{"protocol":"A2A","protocolVersion":"0.3.0","descriptorMediaType":"application/json","nativeDescriptor":{"protocolVersion":"0.3.0","name":"my-agent","description":"Customer support agent","url":"https://agent.example.com/a2a","version":"1.0.0","capabilities":{},"defaultInputModes":["text"],"defaultOutputModes":["text"],"skills":[]},"endpointSourceOrder":["DECLARED"],"declaredEndpoints":[{"uri":"https://agent.example.com/a2a","transport":"JSONRPC"}]}]'
```

* 返回示例

```json
{"code":0,"message":"success","data":{"namespaceId":"public","agentName":"my-agent","version":"1.0.0","status":"draft","callInterfaces":[{"protocol":"A2A","protocolVersion":"0.3.0","descriptorMediaType":"application/json","nativeDescriptor":{"protocolVersion":"0.3.0","name":"my-agent","description":"Customer support agent","url":"https://agent.example.com/a2a","version":"1.0.0","capabilities":{},"defaultInputModes":["text"],"defaultOutputModes":["text"],"skills":[]},"endpointSourceOrder":["DECLARED"],"declaredEndpoints":[{"uri":"https://agent.example.com/a2a","transport":"JSONRPC"}]}],"changeDescription":"update endpoints"}}
```

### 12.6. 删除 Agent 草稿

#### 接口描述

通过该接口，可删除指定的当前 Agent 草稿。

#### 起始版本

`3.3.0`

#### 请求方式

`DELETE`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agents/draft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Agent 所属命名空间 ID。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `version` | `string` | **是** | 待删除的草稿版本。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `null` | 删除成功时无业务数据。 |

#### 示例

* 请求示例

```shell
curl -X DELETE 'http://127.0.0.1:8080/v3/console/ai/agents/draft?namespaceId=public&agentName=my-agent&version=1.0.0'
```

* 返回示例

```json
{"code":0,"message":"success","data":null}
```

### 12.7. 强制发布 Agent 版本

#### 接口描述

通过该接口，可绕过常规评审要求强制发布工作中的 Agent 版本。

#### 起始版本

`3.3.0`

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agents/force-publish`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Agent 所属命名空间 ID。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `version` | `string` | **是** | 待强制发布的版本。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `AgentVersionSummary` | 发布后的版本摘要，成功时状态为 `online`。 |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agents/force-publish' -d 'namespaceId=public&agentName=my-agent&version=1.0.0'
```

* 返回示例

```json
{"code":0,"message":"success","data":{"version":"1.0.0","status":"online","author":"nacos"}}
```

### 12.8. 更新 Agent 标签

#### 接口描述

通过该接口，可替换 Agent 自定义标签，并保留由服务管理的 latest 标签。

#### 起始版本

`3.3.0`

#### 请求方式

`PUT`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agents/labels`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Agent 所属命名空间 ID。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `labels` | `string` | **是** | JSON 编码的 `map<string, string>`，键为自定义标签，值为精确版本号；不得写入保留标签 `latest`。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `Agent` | 更新标签后的 Agent 定义。 |

#### 示例

* 请求示例

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/agents/labels' -d 'namespaceId=public&agentName=my-agent&labels={"stable":"1.0.0"}'
```

* 返回示例

```json
{"code":0,"message":"success","data":{"namespaceId":"public","agentName":"my-agent","status":"enable","versionInfo":{"labels":{"latest":"1.0.0","stable":"1.0.0"}}}}
```

### 12.9. 查询 Agent 列表

#### 接口描述

通过该接口，可筛选并分页查询 Agent 摘要。

#### 起始版本

`3.3.0`

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/agents/list`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pageNo` | `integer` | **是** | 页码，从 1 开始。 |
| `pageSize` | `integer` | **是** | 每页数量。 |
| `namespaceId` | `string` | 否 | Agent 所属命名空间 ID。 |
| `agentName` | `string` | 否 | 按 Agent 名称筛选。 |
| `orderBy` | `string` | 否 | 排序字段；当前仅支持 `download_count`。 |
| `owner` | `string` | 否 | 按所有者筛选。 |
| `scope` | `string` | 否 | 按可见范围筛选，支持 `PUBLIC` 或 `PRIVATE`，不区分大小写。 |
| `bizTag` | `string` | 否 | 按业务标签模糊筛选。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `Page<AgentSummary>` | Agent 摘要分页结果，`pageItems` 类型为 `array<AgentSummary>`。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/agents/list?pageNo=1&pageSize=20&namespaceId=public&agentName=my-agent'
```

* 返回示例

```json
{"code":0,"message":"success","data":{"totalCount":0,"pageNumber":1,"pagesAvailable":0,"pageItems":[]}}
```

### 12.10. 下线 Agent 版本

#### 接口描述

通过该接口，可下线指定 Agent 版本。

#### 起始版本

`3.3.0`

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agents/offline`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Agent 所属命名空间 ID。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `version` | `string` | **是** | 待下线的版本。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `AgentVersionSummary` | 下线后的版本摘要，状态为 `offline`。 |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agents/offline' -d 'namespaceId=public&agentName=my-agent&version=1.0.0'
```

* 返回示例

```json
{"code":0,"message":"success","data":{"version":"1.0.0","status":"offline","author":"nacos"}}
```

### 12.11. 上线 Agent 版本

#### 接口描述

通过该接口，可上线指定 Agent 版本。

#### 起始版本

`3.3.0`

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agents/online`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Agent 所属命名空间 ID。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `version` | `string` | **是** | 待上线的版本。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `AgentVersionSummary` | 上线后的版本摘要，状态为 `online`。 |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agents/online' -d 'namespaceId=public&agentName=my-agent&version=1.0.0'
```

* 返回示例

```json
{"code":0,"message":"success","data":{"version":"1.0.0","status":"online","author":"nacos"}}
```

### 12.12. 发布 Agent 版本

#### 接口描述

通过该接口，可发布已评审的 Agent 版本。

#### 起始版本

`3.3.0`

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agents/publish`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Agent 所属命名空间 ID。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `version` | `string` | **是** | 待发布的版本。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `AgentVersionSummary` | 发布后的版本摘要，状态为 `online`。 |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agents/publish' -d 'namespaceId=public&agentName=my-agent&version=1.0.0'
```

* 返回示例

```json
{"code":0,"message":"success","data":{"version":"1.0.0","status":"online","author":"nacos"}}
```

### 12.13. 重新编辑 Agent 版本

#### 接口描述

通过该接口，可将已评审的 Agent 版本重新转为草稿。

#### 起始版本

`3.3.0`

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agents/redraft`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Agent 所属命名空间 ID。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `version` | `string` | **是** | 待重新编辑的版本。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `AgentVersionSummary` | 转为草稿后的版本摘要，状态为 `draft`。 |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agents/redraft' -d 'namespaceId=public&agentName=my-agent&version=1.0.0'
```

* 返回示例

```json
{"code":0,"message":"success","data":{"version":"1.0.0","status":"draft","author":"nacos"}}
```

### 12.14. 查询 Agent 运行时端点

#### 接口描述

通过该接口，可查询 Agent 指定协议的运行时端点快照及 Naming 服务引用。

#### 起始版本

`3.3.0`

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/agents/runtime-endpoints`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Agent 所属命名空间 ID。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `protocol` | `string` | **是** | 需要查询的 Agent 协议。 |
| `version` | `string` | 否 | 精确 Agent 版本过滤条件；省略时返回该协议下每个自然端点的有效条目及其全部版本绑定。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `ConsoleRuntimeEndpointView` | 运行时端点快照及 Naming 服务引用；没有实例时 `runtimeEndpointSnapshot.items` 为空数组。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/agents/runtime-endpoints?namespaceId=public&agentName=my-agent&protocol=A2A&version=1.0.0'
```

* 返回示例

```json
{"code":0,"message":"success","data":{"runtimeEndpointSnapshot":{"namespaceId":"public","agentName":"my-agent","protocol":"A2A","version":"1.0.0","items":[]},"namingServiceRef":{"namespaceId":"public","groupName":"DEFAULT_GROUP","serviceName":"my-agent@@A2A"}}}
```

### 12.15. 提交 Agent 版本

#### 接口描述

通过该接口，可提交 Agent 草稿版本进入评审。

#### 起始版本

`3.3.0`

#### 请求方式

`POST`

#### 鉴权状态

需要具有对应`命名空间写入`权限的用户身份。

#### 请求URL

`/v3/console/ai/agents/submit`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Agent 所属命名空间 ID。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `version` | `string` | **是** | 待提交评审的草稿版本。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `AgentVersionSummary` | 提交后的版本摘要，状态为 `reviewing`。 |

#### 示例

* 请求示例

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agents/submit' -d 'namespaceId=public&agentName=my-agent&version=1.0.0'
```

* 返回示例

```json
{"code":0,"message":"success","data":{"version":"1.0.0","status":"reviewing","author":"nacos"}}
```

### 12.16. 查询 Agent 版本

#### 接口描述

通过该接口，可查询指定 Agent 版本的完整定义。

#### 起始版本

`3.3.0`

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/agents/version`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `namespaceId` | `string` | 否 | Agent 所属命名空间 ID。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `version` | `string` | **是** | 需要查询的 Agent 版本。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `AgentVersionDetail` | Agent 版本详情，包含完整的 `array<AgentCallInterface>`。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/agents/version?namespaceId=public&agentName=my-agent&version=1.0.0'
```

* 返回示例

```json
{"code":0,"message":"success","data":{"namespaceId":"public","agentName":"my-agent","version":"1.0.0","status":"online","callInterfaces":[{"protocol":"A2A","protocolVersion":"0.3.0","descriptorMediaType":"application/json","nativeDescriptor":{"protocolVersion":"0.3.0","name":"my-agent","description":"Customer support agent","url":"https://agent.example.com/a2a","version":"1.0.0","capabilities":{},"defaultInputModes":["text"],"defaultOutputModes":["text"],"skills":[]},"endpointSourceOrder":["DECLARED"],"declaredEndpoints":[{"uri":"https://agent.example.com/a2a","transport":"JSONRPC"}]}],"author":"nacos","contentDigest":"sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"}}
```

### 12.17. 查询 Agent 版本列表

#### 接口描述

通过该接口，可分页查询指定 Agent 的版本摘要。

#### 起始版本

`3.3.0`

#### 请求方式

`GET`

#### 鉴权状态

需要具有对应`命名空间读取`权限的用户身份。

#### 请求URL

`/v3/console/ai/agents/versions`

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|--------|------|------|----------|
| `pageNo` | `integer` | **是** | 页码，从 1 开始。 |
| `pageSize` | `integer` | **是** | 每页数量。 |
| `namespaceId` | `string` | 否 | Agent 所属命名空间 ID。 |
| `agentName` | `string` | **是** | Agent 名称。 |
| `status` | `string` | 否 | 按版本状态筛选，可选 `draft`、`reviewing`、`reviewed`、`online`、`offline`。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|--------|----------|------|
| `data` | `Page<AgentVersionSummary>` | Agent 版本摘要分页结果，`pageItems` 类型为 `array<AgentVersionSummary>`。 |

#### 示例

* 请求示例

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/agents/versions?pageNo=1&pageSize=20&namespaceId=public&agentName=my-agent&status=online'
```

* 返回示例

```json
{"code":0,"message":"success","data":{"totalCount":0,"pageNumber":1,"pagesAvailable":0,"pageItems":[]}}
```
