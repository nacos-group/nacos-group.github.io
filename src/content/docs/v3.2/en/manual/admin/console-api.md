---
title: Console API
keywords: [ Nacos,Console API ]
description: The Nacos Console provides some APIs that you can use to retrieve data when custom-developing a UI for the Nacos Console.
sidebar:
  order: 13
---

# Console API

Nacos provides Console APIs for the built-in Nacos console and custom console UI implementations. These APIs expose the data and interactions needed by console pages.

If you want to disable the default Nacos console UI and use a custom UI, read [Console Manual](./console.md) first to confirm the console entry, port, and UI switch configurations.

## 0. Console API Notes

### 0.1. Scope

Console APIs are intended for the Nacos console and custom console UI. They serve page rendering, form submission, and console interaction flows.

| Good Fit | Not a Good Fit |
| --- | --- |
| Custom Nacos console UI. | Runtime access to configurations and services from business applications. |
| Integrating with page data and interaction flows already used by the default console. | Building release platforms, audit platforms, or operations automation scripts. |
| Providing server-side data for a custom UI after disabling the default console UI. | Replacing Admin API as a general management-plane integration. |

Business applications should use SDKs or [Client API](../user/open-api.md). Operations platforms, release platforms, and automation scripts should prefer [Admin API](./admin-api.md) or [Maintainer SDK](./maintainer-sdk.md).

### 0.2. Unified Path Format

Nacos Console APIs use a unified path format: `[/$nacos.console.contextPath]/v3/console/[module]/[subPath]...`.

- `$nacos.console.contextPath`: Root path of the console. The default value is empty, and it can be changed with the `nacos.console.contextPath` configuration item.
- `module`: Console module name, such as `server`, `cs`, `ns`, or `core`.
- `subPath`: Console subpath, such as `state`, `namespace`, or `config`. It may contain multiple path levels.

The Console APIs listed below use the default `$nacos.console.contextPath`. If the deployment changes `$nacos.console.contextPath`, update the request URL accordingly when calling the API.

The examples below also use the default Nacos Console port. If the deployment changes `$nacos.console.port`, update the request URL accordingly when calling the API.

### 0.3. Authentication

Nacos 3.X Console APIs enable authentication by default. Except for a small number of APIs marked as public, callers must provide valid identity information.

To disable Console API authentication, set `nacos.core.auth.console.enabled=false` and restart Nacos Console.

### 0.4. Swagger Documentation

Nacos 3.X Console APIs also provide Swagger-style documentation. You can view it at [Nacos Swagger Console API](/swagger/console/).

## 1. Nacos Basic Console APIs

Basic Console APIs provide basic information about the Nacos cluster, such as cluster information and namespace information.

### 1.1. Get Cluster Status

#### Description

You can use this API to obtain basic status and switch information for the Nacos cluster, such as the version, startup mode, and whether authentication is enabled. This API does not return Nacos cluster node information.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Public API. No identity information is required.

#### Request URL

`/v3/console/server/state`

#### Request Parameters

None

#### Response Data

| Name                           | Type      | Description                                                                        |
|-------------------------------|-----------|---------------------------------------------------------------------------|
| version                       | `string` | Version number of the Nacos cluster, for example `3.0.0`                                                     |
| startup_mode                  | `string` | Mode of the Nacos cluster, for example `standalone`, `cluster`                                       |
| server_port                   | `integer` | Primary port of the Nacos cluster, for example `8848`                                                      |
| function_mode                 | `string` | Function mode of the Nacos cluster, for example `config`, `naming`, or `all`. If it is `null`, it is equivalent to `all`                |
| datasource_platform           | `string` | Data source type of the Nacos cluster, for example `mysql` or `derby`. If it is empty, the default data source type is used                        |
| console_ui_enabled            | `boolean` | Whether the Nacos console UI is enabled                                                            |
| auth_enabled                  | `boolean` | Whether Nacos authentication is enabled                                                               |
| auth_admin_request            | `boolean` | Whether Nacos needs to initialize the `nacos` admin user                                                |
| auth_system_type              | `string` | Authentication plugin type of Nacos, for example `nacos`. If it is empty, the default authentication system type is used                                |
| login_page_enabled            | `boolean` | Whether the Nacos console login page is enabled                                                           |
| plugin_datasource_log_enabled | `boolean` | Whether Nacos enables Debug logs for data source access                                                   |
| config_retention_days         | `integer` | Configuration history retention days of the Nacos cluster                                                   |
| isManageCapacity              | `boolean` | Whether Nacos enables configuration capacity limit management. The default is `true`. When enabled, it only counts current configuration usage and does not reject requests after the limit is exceeded.                 |
| isCapacityLimitCheck          | `boolean` | Whether Nacos enables configuration capacity limit checking. The default is `false`. When enabled, configuration change requests are rejected if the configuration capacity exceeds the limit.                    |
| defaultMaxSize                | `integer` | Configuration file size limit of the Nacos cluster, in bytes. The default is `102400`, which is 100 KB.                              |
| defaultGroupQuota             | `integer` | Configuration file count quota under a single group (`GroupName`) in the Nacos cluster. The default is `200`.                               |
| defaultClusterQuota           | `integer` | Cluster-wide configuration file count quota of the Nacos cluster. The default is `100000`.                                         |
| isHealthCheck                 | `boolean` | Whether Nacos enables health checks in the naming module. The default is `true`. When enabled, Nacos actively removes abnormal service instances registered with Nacos. |
| ~~maxContent~~                | `integer` | Deprecated. Use `defaultMaxSize`.                                                  |
| ~~defaultMaxAggrSize~~        | `integer` | Not actually used. Deprecated.                                                                 |
| ~~defaultMaxAggrCount~~       | `integer` | Not actually used. Deprecated.                                                                 |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/server/state'
```

* Response example

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

### 1.2. Get Console Announcement

#### Description

You can use this API to obtain the announcement that the Nacos console wants to display in the browser. The default Nacos console UI calls this API when authentication is not enabled, and the API returns a reminder that authentication is disabled for the cluster.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Public API. No identity information is required.

#### Request URL

`/v3/console/server/announcement`

#### Request Parameters

| Name        | Type       | Required | Description                                        |
|------------|----------|----|---------------------------------------------|
| `language` | `string` | No  | Language i18n value for the request. The default is `zh-CN`; currently only `zh-CN` and `en-US` are supported. |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name    | Type     | Description      |
|--------|----------|---------|
| `data` | `string` | Console announcement content |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/server/announcement?language=zh-CN'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "Authentication is not enabled for the current cluster. See the <a href=\"https://nacos.io/en/docs/v2/guide/user/auth.html\">documentation</a> to enable authentication."
}
```

### 1.3. Get Console Guide Content

#### Description

You can use this API to obtain guide information for the Nacos console. The default Nacos console UI calls this API when the console UI is disabled to obtain guide information. For details, see [Console Manual](./console.md).

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Public API. No identity information is required.

#### Request URL

`/v3/console/server/guide`

#### Request Parameters

None

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name    | Type     | Description      |
|--------|----------|---------|
| `data` | `string` | Console guide content |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/server/guide'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "The Nacos open-source console is disabled on the current node. Set `nacos.console.ui.enabled=true` in `application.properties` to enable it. For details, see the console documentation."
}
```

### 1.4. Get Nacos Console Liveness Status

#### Description

You can use this API to obtain the liveness status of the Nacos console, that is, whether the Nacos console can normally accept and respond to requests.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Public API. No identity information is required.

#### Request URL

`/v3/console/health/liveness`

#### Request Parameters

None

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name    | Type     | Description      |
|--------|----------|---------|
| `data` | `string` | Fixed as `ok` |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/health/liveness'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 1.5. Get Nacos Console Readiness Status

#### Description

You can use this API to obtain whether the Nacos console is in a readable state, that is, whether the Nacos console can read data.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Public API. No identity information is required.

#### Request URL

`/v3/console/health/readiness`

#### Request Parameters

None

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name    | Type     | Description                               |
|--------|----------|----------------------------------|
| `data` | `string` | Fixed as `ok` when the console is readable; otherwise, the value is the unreadable module or corresponding reason information. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/health/readiness'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 1.6. Get Nacos Node Runtime Information

#### Description

You can use this API to obtain Nacos node runtime information, including node IP, node runtime status, and node metadata.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Nacos administrator permission is required.

#### Request URL

`/v3/console/core/cluster/nodes`

#### Request Parameters

None.

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name | Type | Description |
|-----|------|----|

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/core/cluster/nodes'
```

* Response example

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

### 1.7. Get Nacos Namespace List

#### Description

You can use this API to obtain the namespace list of the current Nacos cluster.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Any valid authentication identity is required.

> Because namespace is the basic isolation concept in Nacos, most data query APIs must select a namespace before querying data. Therefore, any user with a valid identity should be able to access the namespace list.

#### Request URL

`/v3/console/core/namespace/list`

#### Request Parameters

None

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                 | Type      | Description                                           |
|---------------------|-----------|----------------------------------------------|
| `namespace`         | `string` | namespace ID                                       |
| `namespaceShowName` | `string` | namespace name                                       |
| `namespaceDesc`     | `string` | namespace description                                       |
| `configCount`       | `integer` | number of configurations in the namespace                                   |
| `quota`             | `integer` | configuration count quota of the namespace. It takes effect only after configuration quota is enabled. It is disabled by default and reserved only.    |
| `type`              | `integer` | namespace type. Reserved field. Currently, `0` indicates the default namespace, and `2` indicates a custom namespace. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/core/namespace/list'
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

### 1.8. Get Namespace Details

#### Description

You can use this API to obtain the details of a specified namespace.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Nacos administrator permission is required.

#### Request URL

`/v3/console/core/namespace`

#### Request Parameters

| Name           | Type       | Required | Description    |
|---------------|----------|----|---------|
| `namespaceId` | `string` | Yes  | namespace ID. |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                 | Type      | Description                                           |
|---------------------|-----------|----------------------------------------------|
| `namespace`         | `string` | namespace ID                                       |
| `namespaceShowName` | `string` | namespace name                                       |
| `namespaceDesc`     | `string` | namespace description                                       |
| `configCount`       | `integer` | number of configurations in the namespace                                   |
| `quota`             | `integer` | configuration count quota of the namespace. It takes effect only after configuration quota is enabled. It is disabled by default and reserved only.    |
| `type`              | `integer` | namespace type. Reserved field. Currently, `0` indicates the default namespace, and `2` indicates a custom namespace. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/core/namespace?namespaceId=public'
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

### 1.9. Create Namespace

#### Description

You can use this API to create a namespace.

#### Since

`3.0.0`

#### Request Method

`POST`

#### Authorization

Nacos administrator permission is required.

#### Request URL

`/v3/console/core/namespace`

#### Request Parameters

| Name                 | Type       | Required | Description                     |
|---------------------|----------|----|--------------------------|
| `customNamespaceId` | `string` | No  | Namespace ID. If it is not specified, a UUID is used to generate the ID. |
| `namespaceName`     | `string` | Yes  | namespace name.                  |
| `namespaceDesc`     | `string` | No  | namespace description.                  |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name    | Type      | Description          |
|--------|-----------|-------------|
| `data` | `boolean` | whether namespace creation succeeded. |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/core/namespace' -d 'namespaceName=test&namespaceDesc=test'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 1.10. Update Namespace

#### Description

You can use this API to update namespace information. The namespace ID cannot be updated; only the name and description can be updated.

#### Since

`3.0.0`

#### Request Method

`PUT`

#### Authorization

Nacos administrator permission is required.

#### Request URL

`/v3/console/core/namespace`

#### Request Parameters

| Name             | Type       | Required | Description    |
|-----------------|----------|----|---------|
| `namespaceId`   | `string` | Yes  | namespace ID  |
| `namespaceName` | `string` | Yes  | namespace name. |
| `namespaceDesc` | `string` | No  | namespace description. |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name    | Type      | Description          |
|--------|-----------|-------------|
| `data` | `boolean` | whether namespace update succeeded. |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/core/namespace' -d 'namespaceId=test&namespaceName=test&namespaceDesc=test'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 1.11. Delete Namespace

#### Description

You can use this API to delete a namespace. The default `public` namespace cannot be deleted.

#### Since

`3.0.0`

#### Request Method

`DELETE`

#### Authorization

Nacos administrator permission is required.

#### Request URL

`/v3/console/core/namespace`

#### Request Parameters

| Name           | Type       | Required | Description    |
|---------------|----------|----|---------|
| `namespaceId` | `string` | Yes  | namespace ID. |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name    | Type      | Description          |
|--------|-----------|-------------|
| `data` | `boolean` | whether namespace deletion succeeded. |

#### Examples

* Request example

```shell
curl -X DELETE 'http://127.0.0.1:8080/v3/console/core/namespace?namespaceId=test'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 1.12. Check Whether a Namespace Exists

#### Description

You can use this API to check whether a namespace ID exists. The default console calls this API before creating a namespace to confirm whether the custom namespace ID already exists and avoid conflicts.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Any valid authentication identity is required.

#### Request URL

`/v3/console/core/namespace/exist`

#### Request Parameters

| Name                 | Type       | Required | Description                          |
|---------------------|----------|----|-------------------------------|
| `customNamespaceId` | `string` | Yes  | Namespace ID. If an empty string is passed, a UUID is considered to need automatic generation. |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name    | Type      | Description                             |
|--------|-----------|--------------------------------|
| `data` | `boolean` | Whether the namespace exists. The value is `true` if it exists; otherwise, it is `false`. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/core/namespace/exist?customNamespaceId=test'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": false
}
```

### 1.13. Get Plugin Details

#### Description

You can use this API to obtain details about a specified plugin by type and name.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/plugin`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `pluginType` | `string` | **Yes** | Plugin type, such as `auth` (authentication), `control`, or `datasource`. |
| `pluginName` | `string` | **Yes** | Plugin name, such as `nacos-default-auth-plugin`. |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.pluginId | `string` | plugin unique identifier. |
| data.pluginType | `string` | plugin type. |
| data.pluginName | `string` | plugin name. |
| data.enabled | `boolean` | whether it is currently enabled. |
| data.critical | `boolean` | whether it is a critical plugin (critical plugins cannot be disabled). |
| data.configurable | `boolean` | whether dynamic configuration in the console is supported. |
| data.config | `object` | current plugin configuration items. |
| data.configDefinitions | `array` | plugin configuration item definition list, used to render the configuration form. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/plugin?pluginType=auth&pluginName=nacos-default-auth-plugin'
```

* Response example

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

### 1.14. Query Plugin Availability on Cluster Nodes

#### Description

You can use this API to obtain the availability of a specified plugin on each cluster node.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/plugin/availability`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `pluginType` | `string` | **Yes** | Plugin type, such as `auth`, `control`, or `datasource`. |
| `pluginName` | `string` | **Yes** | plugin name. |

#### Response Data

The returned `data` is a Map&lt;node address, availability&gt;. The key is the Nacos node address, such as `127.0.0.1:8848`, and the value indicates whether the plugin is available on that node.

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/plugin/availability?pluginType=auth&pluginName=nacos-default-auth-plugin'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "127.0.0.1:8848": true
  }
}
```

### 1.15. Update Plugin Configuration

#### Description

You can use this API to update plugin configuration. You must provide the plugin type, name, and configuration content.

#### Since

`3.2.0`

#### Request Method

`PUT`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/plugin/config`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `pluginType` | `string` | **Yes** | plugin type. |
| `pluginName` | `string` | **Yes** | plugin name. |
| `config` | `string` | No | Plugin configuration content as a JSON object. Specific fields are defined by the plugin. |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data | `string` | Operation result description. |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/plugin/config' \
  -d 'pluginType=auth' \
  -d 'pluginName=nacos-default-auth-plugin' \
  -d 'config={}'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "Plugin configuration updated successfully"
}
```

### 1.16. Get Plugin List

#### Description

You can use this API to obtain the plugin list. You can filter the list by plugin type.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/plugin/list`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `pluginType` | `string` | No | Plugin type. If not specified, plugins of all types are returned. |

#### Response Data

The returned `data` is an array of plugin information. Each item contains the plugin name, type, enabled status, and other fields.

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/plugin/list?pluginType=auth'
```

* Response example

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

### 1.17. Enable or Disable a Plugin

#### Description

You can use this API to update whether a plugin is enabled or disabled.

#### Since

`3.2.0`

#### Request Method

`PUT`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/plugin/status`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `pluginType` | `string` | **Yes** | plugin type. |
| `pluginName` | `string` | **Yes** | plugin name. |
| `enabled` | `boolean` | **Yes** | Whether it is enabled. `true` means enabled, and `false` means disabled. |
| `localOnly` | `boolean` | No | whether to update only the plugin status on the local node. |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data | `string` | Operation result description. |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/plugin/status' \
  -d 'pluginType=auth' \
  -d 'pluginName=nacos-default-auth-plugin' \
  -d 'enabled=True'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "Plugin status updated successfully"
}
```

## 2. Configuration Management

### 2.1. Get Configuration Details

#### Description

You can use this API to obtain the details of a specified configuration.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/cs/config`

#### Request Parameters

| Name           | Type       | Required | Description                |
|---------------|----------|----|---------------------|
| `dataId`      | `string` | Yes  | configuration ID.               |
| `groupName`   | `string` | Yes  | configuration group.               |
| `namespaceId` | `string` | No  | Namespace ID. The default is `public` |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                | Type     | Description                         |
|--------------------|----------|----------------------------|
| `id`               | `string` | Configuration ID in the storage system, usually a string of the Long type. |
| `dataId`           | `string` | configuration ID.                      |
| `groupName`        | `string` | configuration group.                      |
| `namespaceId`      | `string` | namespace ID.                    |
| `content`          | `string` | configuration content.                      |
| `desc`             | `string` | configuration description.                      |
| `md5`              | `string` | MD5 value of the configuration content.                 |
| `configTags`       | `string` | configuration tags.                     |
| `encryptedDataKey` | `string` | key used to encrypt configuration content. Exists when the configuration encryption plugin is used.     |
| `appName`          | `string` | application name to which the configuration belongs.                 |
| `type`             | `string` | configuration type.                      |
| `createTime`       | `integer` | configuration creation time.                    |
| `modifyTime`       | `integer` | configuration modification time.                    |
| `createUser`       | `string` | configuration creator.                     |
| `createIp`         | `string` | configuration creation IP.                    |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/cs/config?dataId=test&groupName=test'
```

* Response example

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

### 2.2. Publish Configuration

#### Description

You can use this API to create a new configuration or update an existing configuration.

#### Since

`3.0.0`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/cs/config`

#### Request Parameters

| Name           | Type       | Required | Description                     |
|---------------|----------|----|--------------------------|
| `dataId`      | `string` | Yes  | configuration ID.                    |
| `groupName`   | `string` | Yes  | configuration group.                    |
| `namespaceId` | `string` | No  | Namespace ID. The default is `public`      |
| `content`     | `string` | Yes  | configuration content.                    |
| `desc`        | `string` | No  | configuration description.                    |
| `type`        | `string` | No  | Configuration type. The default is `text`.         |
| `configTags`  | `string` | No  | Configuration tags. Multiple tags are separated by English commas.      |
| `appName`     | `string` | No  | Application name to which the configuration belongs. It is mainly used to mark the application that uses the configuration. |

- When the configuration already exists with the same `dataId` and `groupName`, calling this API again updates the configuration.
- When publishing a configuration, if the request `Header` contains `betaIps`, the configuration is marked as a BETA configuration. Before the BETA release is stopped or fully published, the console UI must handle it specially.

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name    | Type      | Description        |
|--------|-----------|-----------|
| `data` | `boolean` | whether configuration creation succeeded. |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/cs/config' -d 'dataId=test&groupName=test&namespaceId=public&content=test'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 2.3. Delete Configuration

#### Description

You can use this API to delete a specified configuration.

#### Since

`3.0.0`

#### Request Method

`DELETE`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/cs/config`

#### Request Parameters

| Name           | Type       | Required | Description                 |
|---------------|----------|----|----------------------|
| `dataId`      | `string` | Yes  | configuration ID.                |
| `groupName`   | `string` | Yes  | configuration group.                |
| `namespaceId` | `string` | No  | Namespace ID. The default is `public`. |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name    | Type      | Description        |
|--------|-----------|-----------|
| `data` | `boolean` | whether configuration deletion succeeded. |

#### Examples

* Request example

```shell
curl -X DELETE 'http://127.0.0.1:8080/v3/console/cs/config?dataId=test&groupName=test'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 2.4. Batch Delete Configurations

#### Description

You can use this API to batch delete specified configurations.

#### Since

`3.0.0`

#### Request Method

`DELETE`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/cs/config/batchDelete`

#### Request Parameters

| Name   | Type       | Required | Description                                  |
|-------|----------|----|---------------------------------------|
| `ids` | `array` | Yes  | Configuration storage ID list, not a `dataId` list. Separate multiple IDs with commas. |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name    | Type      | Description        |
|--------|-----------|-----------|
| `data` | `boolean` | whether configuration deletion succeeded. |

#### Examples

* Request example

```shell
curl -X DELETE 'http://127.0.0.1:8080/v3/console/cs/config/batchDelete?ids=838025461287096320,838025489170829312'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 2.5. Query Configuration List

#### Description

You can use this API to query the configuration list in a specified namespace.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/cs/config/list`

#### Request Parameters

| Name           | Type        | Required | Description                                                                            |
|---------------|-----------|----|---------------------------------------------------------------------------------|
| `pageNo`      | `integer` | Yes  | current page number, starts from 1.                                                                     |
| `pageSize`    | `integer` | Yes  | number of configurations displayed per page.                                                                      |
| `dataId`      | `string` | **Yes** | Configuration ID. When `search` is `blur`, you can use `*` for fuzzy search, such as `test*`. When the value is empty or missing, all configurations that match the `groupName` condition are queried. |
| `groupName`   | `string` | **Yes** | Configuration group. When `search` is `blur`, you can use `*` for fuzzy search, such as `test*`. When the value is empty or missing, all configurations that match the `dataId` condition are queried.    |
| `search`      | `string` | No  | blur or accurate                            |
| `namespaceId` | `string` | No  | Namespace ID. The default is `public`.                                                            |
| `appName`     | `string` | No  | Application name to which the configuration belongs. The default is empty. When specified, configurations belonging to this application are filtered; when empty, configurations for all applications are queried.                                     |
| `configTags`  | `string` | No  | Configuration tags separated by English commas. The default is empty. When specified, configurations with this tag are filtered; when empty, configurations for all tags are queried.                          |
| `type`        | `string` | No  | Configuration type. The default is empty. When specified, configurations of this type are filtered; when empty, configurations of all types are queried.                                          |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                          | Type     | Description                         |
|------------------------------|----------|----------------------------|
| `totalCount`                 | `integer` | total number of configurations that match the rule.                 |
| `pagesAvailable`             | `integer` | total number of available pages.                    |
| `pageNumber`                 | `integer` | current page number.                      |
| `pageItems`                  | `List`   | list of configurations that match the rule.                 |
| `pageItems`[i].`id`          | `string` | Configuration ID in the storage system, usually a string of the Long type. |
| `pageItems`[i].`dataId`      | `string` | configuration ID.                      |
| `pageItems`[i].`groupName`   | `string` | configuration group.                      |
| `pageItems`[i].`namespaceId` | `string` | namespace ID.                    |
| `pageItems`[i].`md5`         | `string` | MD5 value of the configuration content.                 |
| `pageItems`[i].`appName`     | `string` | application name to which the configuration belongs.                 |
| `pageItems`[i].`type`        | `string` | configuration type.                      |
| `pageItems`[i].`createTime`  | `integer` | configuration creation time.                    |
| `pageItems`[i].`modifyTime`  | `integer` | configuration modification time.                    |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/cs/config/list?dataId=&groupName=&appName=&configTags=&pageNo=1&pageSize=10&namespaceId=&type=&search=blur'
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

### 2.6. Query Configurations by Content

:::note
This API has relatively low performance. Too many calls may cause stability issues, so use other APIs whenever possible.
:::

#### Description

You can use this API to query the list of configurations that match configuration content.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/cs/config/searchDetail`

#### Request Parameters

| Name           | Type        | Required | Description                                                                            |
|---------------|-----------|----|---------------------------------------------------------------------------------|
| `pageNo`      | `integer` | Yes  | current page number, starts from 1.                                                                     |
| `pageSize`    | `integer` | Yes  | number of configurations displayed per page.                                                                      |
| `search`      | `string` | No  | blur or accurate                            |
| `namespaceId` | `string` | No  | Namespace ID. The default is `public`.                                                            |
| `dataId`      | `string` | No  | Configuration ID. When `search` is `blur`, you can use `*` for fuzzy search, such as `test*`. When the value is empty or missing, all configurations that match the `groupName` condition are queried. |
| `groupName`   | `string` | No  | Configuration group. When `search` is `blur`, you can use `*` for fuzzy search, such as `test*`. When the value is empty or missing, all configurations that match the `dataId` condition are queried.    |
| `appName`     | `string` | No  | Application name to which the configuration belongs. The default is empty. When specified, configurations belonging to this application are filtered; when empty, configurations for all applications are queried.                                     |
| `configTags`  | `string` | No  | Configuration tags separated by English commas. The default is empty. When specified, configurations with this tag are filtered; when empty, configurations for all tags are queried.                          |
| `type`         | `string` | No  | Configuration type. The default is empty. When specified, configurations of this type are filtered; when empty, configurations of all types are queried.                                          |
| `configDetail` | `string` | Yes  | Configuration content search condition, used to filter by configuration content. Fuzzy matching is supported, such as `*11*`.                                         |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                          | Type     | Description                         |
|------------------------------|----------|----------------------------|
| `totalCount`                 | `integer` | total number of configurations that match the rule.                 |
| `pagesAvailable`             | `integer` | total number of available pages.                    |
| `pageNumber`                 | `integer` | current page number.                      |
| `pageItems`                  | `List`   | list of configurations that match the rule.                 |
| `pageItems`[i].`id`          | `string` | Configuration ID in the storage system, usually a string of the Long type. |
| `pageItems`[i].`dataId`      | `string` | configuration ID.                      |
| `pageItems`[i].`groupName`   | `string` | configuration group.                      |
| `pageItems`[i].`namespaceId` | `string` | namespace ID.                    |
| `pageItems`[i].`md5`         | `string` | MD5 value of the configuration content.                 |
| `pageItems`[i].`appName`     | `string` | application name to which the configuration belongs.                 |
| `pageItems`[i].`type`        | `string` | configuration type.                      |
| `pageItems`[i].`createTime`  | `integer` | configuration creation time.                    |
| `pageItems`[i].`modifyTime`  | `integer` | configuration modification time.                    |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/cs/config/searchDetail?dataId=&groupName=&appName=&configTags=&pageNo=1&pageSize=10&namespaceId=&type=&search=blur&configDetail=*11*'
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
      }
    ],
    "pageNumber": 1,
    "pagesAvailable": 1,
    "totalCount": 1
  }
}
```

### 2.7. Query Configuration Listener List

#### Description

You can use this API to query the listener list of a specified configuration.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/cs/config/listener`

#### Request Parameters

| Name           | Type       | Required | Description                 |
|---------------|----------|----|----------------------|
| `dataId`      | `string` | Yes  | configuration ID.                |
| `groupName`   | `string` | Yes  | configuration group.                |
| `namespaceId` | `string` | No  | Namespace ID. The default is `public`. |
| `aggregation` | `boolean` | No  | Whether to query with aggregation.             |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name               | Type                  | Description                                    |
|-------------------|-----------------------|---------------------------------------|
| `queryType`       | `string` | Subscriber query type. This API is `config`.                 |
| `listenersStatus` | `map<string, string>` | Subscriber list. The key is the subscriber IP, and the value is the MD5 value of the current configuration subscribed to by the subscriber. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/cs/config/listener?dataId=test&groupName=test'
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

### 2.8. Query Configurations Subscribed by a Subscriber IP

#### Description

You can use this API to query which configurations are subscribed to by a specified subscriber IP.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/cs/config/listener/ip`

#### Request Parameters

| Name           | Type       | Required | Description                 |
|---------------|----------|----|----------------------|
| `ip`          | `string` | Yes  | subscriber IP.               |
| `all`         | `boolean` | No  | Whether to query all subscription data.         |
| `namespaceId` | `string` | No  | Namespace ID. The default is `public`. |
| `aggregation` | `boolean` | No  | Whether to query with aggregation.             |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name               | Type                  | Description                                                                            |
|-------------------|-----------------------|-------------------------------------------------------------------------------|
| `queryType`       | `string` | Subscriber query type. This API is `ip`.                                                             |
| `listenersStatus` | `map<string, string>` | Subscriber list. The key is the subscribed configuration information in the format `dataId` + `groupName` + `namespaceId`, and the value is the MD5 value of the current configuration subscribed to by the subscriber. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/cs/config/listener/ip?ip=127.0.0.1'
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

### 2.9. Export Configurations

#### Description

You can use this API to export selected or queried configurations as a ZIP file for backup or import into another Nacos cluster.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/cs/config/export2`

#### Request Parameters

| Name           | Type       | Required | Description                         |
|---------------|----------|----|------------------------------|
| `dataId`      | `string` | No  | Pattern of configuration IDs to export, for example `test*`. |
| `groupName`   | `string` | No  | Pattern of configuration groups to export, for example `test*`. |
| `ids`         | `array` | No  | Configuration storage ID list. Separate multiple IDs with commas.    |
| `namespaceId` | `string` | No  | Namespace ID. The default is `public`.         |
| `appName`     | `string` | No  | application name to which the configurations to export belong.              |

> It is recommended to use either `ids` or the `dataId` + `groupName` combination. Choose only one method and pass an empty string for the other type. Otherwise, the exported file may be empty.

#### Response Data

When export succeeds, the response is a byte-array file.
The file is returned in attachment mode. When export fails, the response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format).

#### Examples

* Request example

```shell
curl -X GET "http://127.0.0.1:8080/v3/console/cs/config/export2?dataId=&groupId=&ids=" --output ~/test.zip
```

* Response example

```shell
unzip ~/test.zip
> Archive:  /path/to/test.zip
>   inflating: DEFAULT_GROUP/111
>   inflating: DEFAULT_GROUP/qtc-user.yaml
>   inflating: .metadata.yml
```

### 2.10. Import Configurations

:::note
The import configuration API currently supports ZIP files exported by both older and newer versions. Later versions may remove support for importing and exporting configurations in the older format. It is recommended to use the new [Export Configurations](#210-export-configurations)
API to export configuration files.
:::

#### Description

You can use this API to import a ZIP file exported from Nacos into a specified Nacos namespace.

#### Since

`3.0.0`

#### Request Method

`POST`

Request body type: `multipart/form-data`.

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/cs/config/import`

#### Request Parameters

| Name           | Type                 | Required | Description                                                                                                               |
|---------------|--------------------|----|--------------------------------------------------------------------------------------------------------------------|
| `file`        | `MultipartFile`    | No  | imported ZIP file.                                                                                                          |
| `namespaceId` | `string` | No  | Namespace ID to which the imported configurations belong. The default is `public`.                                                                                       |
| `policy`      | `string` | No  | Import policy used when imported configurations have the same `dataId` and `groupName` and conflict. Valid values are `ABORT` (abort import), `SKIP` (skip conflicting configurations), and `OVERWRITE` (overwrite conflicting configurations). The default is `ABORT`. |
| `src_user`    | `string` | No  | source user identifier for the import operation.                                                                                                       |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name         | Type  | Description         |
|-------------|-------|------------|
| `succCount` | `integer` | number of configurations imported successfully. |
| `skipCount` | `integer` | number of configurations skipped during import. |

#### Examples

* Request example

```shell
curl -vX POST "http://127.0.0.1:8080/v3/console/cs/config/import" -F "file=@/path/to/test.zip" -F "namespaceId=test"
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

### 2.11. Clone Configurations

#### Description

You can use this API to clone selected or queried configurations to another namespace.

#### Since

`3.0.0`

#### Request Method

`POST`

Request body type: `application/json`, with a configuration list array.

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/cs/config/clone`

#### Request Parameters

| Name              | Type       | Required    | Description                                                                                                               |
|------------------|----------|-------|--------------------------------------------------------------------------------------------------------------------|
| `srcUser`        | `string` | No     | source user identifier for the clone operation.                                                                                                        |
| `targetNamespaceId` | `string` | **Yes** | target namespace ID.                                                                                                           |
| `policy`         | `string` | No     | Clone policy used when configurations have the same `dataId` and `groupName` and conflict. Valid values are `ABORT` (abort cloning), `SKIP` (skip conflicting configurations), and `OVERWRITE` (overwrite conflicting configurations). The default is `ABORT`. |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name         | Type  | Description         |
|-------------|-------|------------|
| `succCount` | `integer` | number of configurations cloned successfully. |
| `skipCount` | `integer` | number of configurations skipped during cloning. |

#### Examples

* Request example

```shell
curl -H "Content-Type: application/json" -X POST "http://127.0.0.1:8080/v3/console/cs/config/clone?targetNamespaceId=public&policy=ABORT" -d "[{\"cfgId\":838029534438625280,\"dataId\":\"111\",\"group\":\"DEFAULT_GROUP\"},{\"cfgId\":838033747294031872,\"dataId\":\"qtc-user.yaml\",\"group\":\"DEFAULT_GROUP\"}]"
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

### 2.12. Stop Configuration BETA Release

:::note
Only after `betaIps` is set in the `Header` when [publishing a configuration](#22-publish-configuration), which changes the configuration to the BETA publishing state, can this API be called to stop the BETA publishing state.
:::

#### Description

You can use this API to stop a configuration from the BETA publishing state, that is, roll back the configuration BETA publishing state.

#### Since

`3.0.0`

#### Request Method

`DELETE`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/cs/config/beta`

#### Request Parameters

| Name           | Type       | Required | Description                      |
|---------------|----------|----|---------------------------|
| `dataId`      | `string` | Yes  | Configuration `dataId`.              |
| `groupName`   | `string` | Yes  | Configuration `groupName`.           |
| `namespaceId` | `string` | No  | Namespace ID to which the configuration belongs. The default is `public`. |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name | Type | Description |
|-----|------|----|

#### Examples

* Request example

```shell
curl -X DELETE "http://127.0.0.1:8080/v3/console/cs/config/beta?dataId=test&groupName=DEFAULT_GROUP"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 2.13. Query Configuration BETA Release Status

:::note
Only after `betaIps` is set in the `Header` when [publishing a configuration](#22-publish-configuration), which changes the configuration to the BETA publishing state, can this API be called to obtain configuration details.
:::

#### Description

You can use this API to query the BETA publishing status of a configuration.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/cs/config/beta`

#### Request Parameters

| Name           | Type       | Required | Description                      |
|---------------|----------|----|---------------------------|
| `dataId`      | `string` | Yes  | Configuration `dataId`.              |
| `groupName`   | `string` | Yes  | Configuration `groupName`.           |
| `namespaceId` | `string` | No  | Namespace ID to which the configuration belongs. The default is `public`. |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                | Type     | Description                                  |
|--------------------|----------|-------------------------------------|
| `id`               | `string` | betaconfiguration storage ID.                        |
| `dataId`           | `string` | Configuration `dataId`.                          |
| `groupName`        | `string` | Configuration `groupName`.                       |
| `namespaceId`      | `string` | namespace to which the configuration belongs.                          |
| `desc`             | `string` | configuration description.                               |
| `md5`              | `string` | MD5 value of the configuration content.                          |
| `configTags`       | `string` | configuration tags.                              |
| `encryptedDataKey` | `string` | key used to encrypt configuration content. Exists when the configuration encryption plugin is used.              |
| `appName`          | `string` | application name to which the configuration belongs.                          |
| `type`             | `string` | configuration type.                               |
| `createTime`       | `integer` | configuration creation time.                             |
| `modifyTime`       | `integer` | configuration modification time.                             |
| `createUser`       | `string` | configuration creator.                              |
| `createIp`         | `string` | configuration creation IP.                             |
| `grayName`         | `string` | Gray release rule name. Fixed as `beta`.                |
| `grayRule`         | `string` | Gray release rule in JSON format. The `expr` field is the beta IP list. |

#### Examples

* Request example

```shell
curl "http://127.0.0.1:8080/v3/console/cs/config/beta?dataId=111&groupName=DEFAULT_GROUP"
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

### 2.14. Query Configuration Publishing History

#### Description

You can use this API to query the publishing history of a configuration.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/cs/history/list`

#### Request Parameters

| Name           | Type       | Required | Description                      |
|---------------|----------|----|---------------------------|
| `pageNo`      | `integer` | Yes  | current page number, starts from `1`               |
| `pageSize`    | `integer` | Yes  | number of records displayed per page.                 |
| `dataId`      | `string` | Yes  | Configuration `dataId`.              |
| `groupName`   | `string` | Yes  | Configuration `groupName`.           |
| `namespaceId` | `string` | No  | Namespace ID to which the configuration belongs. The default is `public`. |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                          | Type     | Description                                |
|------------------------------|----------|-----------------------------------|
| `totalCount`                 | `integer` | total number of history records.                          |
| `pageNumber`                 | `integer` | current page number, starts from `1`.                      |
| `pagesAvailable`             | `integer` | available pages.                             |
| `pageItems`                  | `List`   | history record list.                           |
| `pageItems`[i].`id`          | `string` | history record ID.                          |
| `pageItems`[i].`dataId`      | `string` | Configuration `dataId`.                        |
| `pageItems`[i].`groupName`   | `string` | Configuration `groupName`.                     |
| `pageItems`[i].`namespaceId` | `string` | namespace to which the configuration belongs.                        |
| `pageItems`[i].`appName`     | `string` | appName to which the configuration belongs.                     |
| `pageItems`[i].`opType`      | `string` | Operation type. `I` means insert, `U` means update, and `D` means delete.        |
| `pageItems`[i].`publishType` | `string` | Publish type. `formal` means normal publish, and `gray` means beta publish. |
| `pageItems`[i].`srcIp`       | `string` | source IP of the publish operation.                          |
| `pageItems`[i].`srcUser`     | `string` | Publishing user. This field exists only when authentication is enabled and the configuration is published after a user logs in.       |
| `pageItems`[i].`createTime`  | `integer` | configuration creation time.                           |
| `pageItems`[i].`modifyTime`  | `integer` | configuration modification time.                           |

#### Examples

* Request example

```shell
curl "http://127.0.0.1:8080/v3/console/cs/history/list?pageNo=1&pageSize=10&dataId=111&groupName=DEFAULT_GROUP"
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

### 2.15. Query a Configuration History Change Record

#### Description

You can use this API to query a specific history change record of a configuration.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/cs/history`

#### Request Parameters

| Name           | Type       | Required | Description                      |
|---------------|----------|----|---------------------------|
| `nid`         | `integer` | Yes  | history record ID.                  |
| `dataId`      | `string` | Yes  | Configuration `dataId`.
| `groupName`   | `string` | Yes  | Configuration `groupName`.             |
| `namespaceId` | `string` | No  | Namespace ID to which the configuration belongs. The default is `public`. |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name           | Type         | Description                                                                          |
|---------------|--------------|-----------------------------------------------------------------------------|
| `id`          | `string` | history record ID.                                                                    |
| `dataId`      | `string` | Configuration `dataId`.                                                                  |
| `groupName`   | `string` | Configuration `groupName`.                                                               |
| `namespaceId` | `string` | namespace to which the configuration belongs.                                                                  |
| `content`     | `string`     |
| `appName`     | `string` | appName to which the configuration belongs.                                                               |
| `opType`      | `string` | Operation type. `I` means insert, `U` means update, and `D` means delete.                                                  |
| `publishType` | `string` | Publish type. `formal` means normal publish, and `gray` means beta publish.                                           |
| `srcIp`       | `string` | source IP of the publish operation.                                                                    |
| `srcUser`     | `string` | Publishing user. This field exists only when authentication is enabled and the configuration is published after a user logs in.                                                 |
| `createTime`  | `integer` | configuration creation time.                                                                     |
| `modifyTime`  | `integer` | configuration modification time.                                                                     |
| `grayName`    | `string` | Gray release rule name. Fixed as `beta`.                                                        |
| `extInfo`     | `JsonString` | Extended information. Currently includes `src_user`, `type`, and `c_desc`. If `publishType` is `gray`, it also includes `grayRule`. |

#### Examples

* Request example

```shell
curl "http://127.0.0.1:8080/v3/console/cs/history?dataId=111&groupName=DEFAULT_GROUP&nid=7"
```

* Response example

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

### 2.16. Query Previous Change History Before the Latest Configuration State

#### Description

You can use this API to query the previous change history before the latest state of a configuration.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/cs/history/previous`

#### Request Parameters

| Name           | Type       | Required | Description                      |
|---------------|----------|----|---------------------------|
| `id`          | `integer` | Yes  | configuration storage ID.                  |
| `dataId`      | `string` | Yes  | Configuration `dataId`.                |
| `groupName`   | `string` | Yes  | Configuration `groupName`.             |
| `namespaceId` | `string` | No  | Namespace ID to which the configuration belongs. The default is `public`. |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name           | Type         | Description                                                                          |
|---------------|--------------|-----------------------------------------------------------------------------|
| `id`          | `string` | history record ID.                                                                    |
| `dataId`      | `string` | Configuration `dataId`.                                                                  |
| `groupName`   | `string` | Configuration `groupName`.                                                               |
| `namespaceId` | `string` | namespace to which the configuration belongs.                                                                  |
| `content`     | `string`     |
| `appName`     | `string` | appName to which the configuration belongs.                                                               |
| `opType`      | `string` | Operation type. `I` means insert, `U` means update, and `D` means delete.                                                  |
| `publishType` | `string` | Publish type. `formal` means normal publish, and `gray` means beta publish.                                           |
| `srcIp`       | `string` | source IP of the publish operation.                                                                    |
| `srcUser`     | `string` | Publishing user. This field exists only when authentication is enabled and the configuration is published after a user logs in.                                                 |
| `createTime`  | `integer` | configuration creation time.                                                                     |
| `modifyTime`  | `integer` | configuration modification time.                                                                     |
| `grayName`    | `string` | Gray release rule name. Fixed as `beta`.                                                        |
| `extInfo`     | `JsonString` | Extended information. Currently includes `src_user`, `type`, and `c_desc`. If `publishType` is `gray`, it also includes `grayRule`. |

#### Examples

* Request example

```shell
curl "http://127.0.0.1:8080/v3/console/cs/history/previous?id=838029534438625280&dataId=111&groupName=DEFAULT_GROUP"
```

* Response example

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

### 2.17. Query Configuration List in a Namespace

#### Description

You can use this API to query the configuration list in a namespace. It returns only `dataId` and `groupName` for the drop-down selection in the configuration history UI.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/cs/history/configs`

#### Request Parameters

| Name           | Type       | Required | Description                      |
|---------------|----------|----|---------------------------|
| `namespaceId` | `string` | **Yes** | Namespace ID to which the configuration belongs. The default is `public`. |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name         | Type     | Description            |
|-------------|----------|---------------|
| `dataId`    | `string` | Configuration `dataId`.    |
| `groupName` | `string` | Configuration `groupName`. |

> All other fields are unused.

#### Examples

* Request example

```shell
curl "http://127.0.0.1:8080/v3/console/cs/history/configs?namespaceId=public"
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

## 3. Service Management

### 3.1. Create Service

#### Description

You can use this API to create an empty service.

#### Since

`3.0.0`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ns/service`

#### Request Parameters

| Name                | Type                    | Required | Description                                                   |
|--------------------|-----------------------|----|--------------------------------------------------------|
| `serviceName`      | `string` | Yes  | service name.                                                   |
| `groupName`        | `string` | No  | Group name to which the service belongs. The default is `DEFAULT_GROUP`.                    |
| `namespaceId`      | `string` | No  | Namespace ID to which the service belongs. The default is `public`.                              |
| `protectThreshold` | `number` | No  | Service protection threshold. The default is `0.0`.                                     |
| `selector`         | `string` | No  | Service selector. The default is `{"type":"none"}`, which means no selector. Routing by label is also supported. |
| `metadata`         | `string` | No  | Service metadata. The default is `{}`.                                       |
| `ephemeral`        | `boolean` | No  | Whether the service is ephemeral. The default is `false`, meaning a persistent service.                              |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name    | Type     | Description             |
|--------|----------|----------------|
| `data` | `string` | Fixed as `ok` when creation succeeds. |

#### Examples

* Request example

```shell
curl -X POST "http://127.0.0.1:8080/v3/console/ns/service" -d "serviceName=test&groupName=DEFAULT_GROUP&namespaceId=public"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 3.2. Delete Service

:::note
This API deletes a service, not service instances (service providers). If the service still has instances, it cannot be deleted.
:::

#### Description

You can use this API to delete a service.

#### Since

`3.0.0`

#### Request Method

`DELETE`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ns/service`

#### Request Parameters

| Name           | Type       | Required | Description                                |
|---------------|----------|----|-------------------------------------|
| `serviceName` | `string` | Yes  | service name.                                |
| `groupName`   | `string` | No  | Group name to which the service belongs. The default is `DEFAULT_GROUP`. |
| `namespaceId` | `string` | No  | Namespace ID to which the service belongs. The default is `public`.           |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name    | Type     | Description             |
|--------|----------|----------------|
| `data` | `string` | Fixed as `ok` when deletion succeeds. |

#### Examples

* Request example

```shell
curl -X DELETE "http://127.0.0.1:8080/v3/console/ns/service?serviceName=test&groupName=DEFAULT_GROUP&namespaceId=public"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 3.3. Update Service Metadata

#### Description

You can use this API to update service metadata. Only service metadata, such as `metadata` and `selector`,
can be updated. The service `serviceName`, `groupName`, and `namespaceId` cannot be updated.

#### Since

`3.0.0`

#### Request Method

`PUT`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ns/service`

#### Request Parameters

| Name                | Type                    | Required | Description                                                   |
|--------------------|-----------------------|----|--------------------------------------------------------|
| `serviceName`      | `string` | Yes  | service name.                                                   |
| `groupName`        | `string` | No  | Group name to which the service belongs. The default is `DEFAULT_GROUP`.                    |
| `namespaceId`      | `string` | No  | Namespace ID to which the service belongs. The default is `public`.                              |
| `protectThreshold` | `number` | No  | Service protection threshold. The default is `0.0`.                                     |
| `ephemeral`        | `boolean` | No  | Whether it is an ephemeral instance, such as `true` or `false`.                                  |
| `selector`         | `string` | No  | Service selector. The default is `{"type":"none"}`, which means no selector. Routing by label is also supported. |
| `metadata`         | `string` | No  | Service metadata. The default is `{}`.                                       |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name    | Type     | Description             |
|--------|----------|----------------|
| `data` | `string` | Fixed as `ok` when update succeeds. |

#### Examples

* Request example

```shell
curl -X PUT "http://127.0.0.1:8080/v3/console/ns/service" -d "serviceName=test&groupName=DEFAULT_GROUP&namespaceId=public&protectThreshold=0"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 3.4. Get Supported Service Selector Type List

#### Description

You can use this API to obtain the list of supported service selector types. The console UI uses it to render the selector type drop-down when creating or updating services.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

Any valid authentication identity is required.

#### Request URL

`/v3/console/ns/service/selector/types`

#### Request Parameters

None

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name     | Type     | Description                  |
|---------|----------|---------------------|
| `label` | `string` | Filter routing selection by label expression. |
| `none`  | `string` | No selector.               |

#### Examples

* Request example

```shell
curl -X GET "http://127.0.0.1:8080/v3/console/ns/service/selector/types"
```

* Response example

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

### 3.5. Query Service List

#### Description

You can use this API to query the service list in a specified namespace.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ns/service/list`

#### Request Parameters

| Name                  | Type        | Required | Description                              |
|----------------------|-----------|----|-----------------------------------|
| `pageNo`             | `integer` | Yes  | Page number, starting from `1`. |
| `pageSize`           | `integer` | Yes  | Page size. |
| `serviceNameParam`   | `string` | No  | Service name pattern. Queries all services when empty.            |
| `groupNameParam`     | `string` | No  | Group name pattern of the service. Queries all services when empty. |
| `namespaceId`        | `string` | No  | namespace ID to which the service belongs.                      |
| `ignoreEmptyService` | `boolean` | No  | Whether to return only services with instances. Defaults to `false`, meaning empty services are included. |
| `withInstances`      | `boolean` | No  | Whether to return service instance details. Defaults to `false`. |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                                   | Type     | Description           |
|---------------------------------------|----------|--------------|
| `totalCount`                          | `integer` | total number of services that match the condition.  |
| `pageNumber`                          | `integer` | current page number, starts from `1`. |
| `pagesAvailable`                      | `integer` | available pages.        |
| `pageItems`                           | `List`   | service list.        |
| `pageItems`[i].`name`                 | `string` | service name.         |
| `pageItems`[i].`groupName`            | `string` | group name of the service.      |
| `pageItems`[i].`clusterCount`         | `string` | number of clusters under the service.    |
| `pageItems`[i].`ipCount`              | `string` | number of instances under the service.    |
| `pageItems`[i].`healthyInstanceCount` | `string` | number of healthy instances under the service.  |
| `pageItems`[i].`triggerFlag`          | `string` | whether service protection is triggered.  |

#### Examples

* Request example

```shell
curl -X GET "http://127.0.0.1:8080/v3/console/ns/service/list?pageNo=1&pageSize=10&namespaceId=public"
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

### 3.6. Query Service Subscriber List

#### Description

You can use this API to query the subscriber list of a specified service.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ns/service/subscribers`

#### Request Parameters

| Name           | Type        | Required | Description                                |
|---------------|-----------|----|-------------------------------------|
| `pageNo`      | `integer` | Yes  | Page number, starting from `1`. |
| `pageSize`    | `integer` | Yes  | Page size. |
| `serviceName`  | `string` | Yes  | service name.                                |
| `groupName`    | `string` | No  | Group name to which the service belongs. The default is `DEFAULT_GROUP`. |
| `namespaceId`  | `string` | No  | Namespace ID to which the service belongs. The default is `public`.           |
| `aggregation`  | `boolean` | No  | Whether to aggregate the query. |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                          | Type      | Description                   |
|------------------------------|-----------|----------------------|
| `totalCount`                 | `integer` | total number of services that match the condition.          |
| `pageNumber`                 | `integer` | current page number, starts from `1`.         |
| `pagesAvailable`             | `integer` | available pages.                |
| `pageItems`                  | `List`    | service list.                |
| `pageItems`[i].`ip`          | `string` | subscriber IP.               |
| `pageItems`[i].`port`        | `integer` | subscriber port.               |
| `pageItems`[i].`address`     | `string` | Subscriber address, usually `ip:port`. |
| `pageItems`[i].`agent`       | `string` | subscriber client version.            |
| `pageItems`[i].`appName`     | `string` | application to which the subscriber belongs.             |
| `pageItems`[i].`namespaceId` | `string` | namespace to which the subscriber belongs.           |
| `pageItems`[i].`groupName`   | `string` | subscribed group name.              |
| `pageItems`[i].`serviceName` | `string` | subscribed service name.              |

#### Examples

* Request example

```shell
curl -X GET "http://127.0.0.1:8080/v3/console/ns/service/subscribers?pageNo=1&pageSize=10&serviceName=test&groupName=DEFAULT_GROUP"
```

* Response example

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

### 3.7. Query Service Details

#### Description

You can use this API to query the details of a specified service.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ns/service`

#### Request Parameters

| Name           | Type       | Required | Description                                |
|---------------|----------|----|-------------------------------------|
| `serviceName` | `string` | Yes  | service name.                                |
| `groupName`   | `string` | No  | Group name to which the service belongs. The default is `DEFAULT_GROUP`. |
| `namespaceId` | `string` | No  | Namespace ID to which the service belongs. The default is `public`.           |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                                                 | Type         | Description                                   |
|-----------------------------------------------------|--------------|--------------------------------------|
| `namespaceId`                                       | `string` | namespace ID to which the service belongs.                    |
| `groupName`                                         | `string` | groupName to which the service belongs.                      |
| `serviceName`                                       | `string` | service name.                                 |
| `ephemeral`                                         | `boolean` | Service persistence attribute. `true` means an ephemeral service, and `false` means a persistent service.  |
| `protectThreshold`                                  | `number` | service protection threshold.                              |
| `selector`                                          | `jsonObject` | service selector.                               |
| `metadata`                                          | `jsonObject` | service metadata.                               |
| `clusterMap`                                        | `jsonObject` | Service cluster list. The key is the cluster name, and the value is the cluster details. |
| `clusterMap`.$ClusterName.`clusterName`             | `string` | cluster name.                                 |
| `clusterMap`.$ClusterName.`healthChecker`           | `jsonObject` | health checker.                               |
| `clusterMap`.$ClusterName.`healthyCheckPort`        | `integer` | health check port.                              |
| `clusterMap`.$ClusterName.`useInstancePortForCheck` | `boolean` | Whether to use the registered instance `IP:Port` for health checks.          |
| `clusterMap`.$ClusterName.`metadata`                | `jsonObject` | cluster metadata.                               |

#### Examples

* Request example

```shell
curl -X GET "http://127.0.0.1:8080/v3/console/ns/service?serviceName=test"
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

### 3.8. Update Service Cluster Metadata

#### Description

You can use this API to update metadata for a specified service cluster.

#### Since

`3.0.0`

#### Request Method

`PUT`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ns/service/cluster`

#### Request Parameters

| Name                     | Type                    | Required | Description                                |
|-------------------------|-----------------------|----|-------------------------------------|
| `clusterName`           | `string` | Yes  | cluster name.                                |
| `serviceName`           | `string` | Yes  | service name.                                |
| `checkPort`             | `integer` | Yes  | Health check port. |
| `useInstancePort4Check` | `boolean` | Yes  | Whether to use the registered instance `IP:Port` for health checks. |
| `healthChecker`         | `string` | Yes  | health checker.                              |
| `groupName`             | `string` | No  | Group name to which the service belongs. The default is `DEFAULT_GROUP`. |
| `namespaceId`           | `string` | No  | Namespace ID to which the service belongs. The default is `public`.           |
| `metadata`              | `string` | No  | service metadata.                              |

> The `healthChecker` parameter is a JSON string for the health checker. Three health checkers are currently supported:
> 1. `None`: no health check, `{"type":"NONE"}`
> 2. `TCP`: TCP port check, `{"type":"TCP"}`
> 3. `HTTP`: HTTP port check, `{"type":"HTTP","path":"/liveness","headers":"health"}`. `path` is the HTTP URI, and `headers`
     are HTTP request headers.

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name    | Type     | Description             |
|--------|----------|----------------|
| `data` | `string` | Fixed as `ok` when update succeeds. |

#### Examples

* Request example

```shell
curl -X PUT "http://127.0.0.1:8080/v3/console/ns/service/cluster" -d "serviceName=test&clusterName=DEFAULT&checkPort=80&useInstancePort4Check=true&healthChecker={\"type\":\"none\"}"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 3.9. Query Service Instance List

#### Description

You can use this API to query the instance list of a specified service.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ns/instance/list`

#### Request Parameters

| Name           | Type        | Required | Description                                |
|---------------|-----------|----|-------------------------------------|
| `pageNo`      | `integer` | Yes  | Page number, starts from 1.                            |
| `pageSize`    | `integer` | Yes  | number of records per page.                              |
| `serviceName` | `string` | Yes  | service name.                                |
| `groupName`   | `string` | No  | Group name to which the service belongs. The default is `DEFAULT_GROUP`. |
| `namespaceId`  | `string` | No  | Namespace ID to which the service belongs. The default is `public`.           |
| `clusterName`  | `string` | No  | Cluster name. If not specified, instances in all clusters are queried.                      |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                          | Type                  | Description                                    |
|------------------------------|-----------------------|---------------------------------------|
| `totalCount`                 | `integer` | total number of instances that match the condition.                           |
| `pageNumber`                 | `integer` | current page number, starts from `1`.                          |
| `pagesAvailable`             | `integer` | available pages.                                 |
| `pageItems`                  | `List`                | instance list.                                 |
| `pageItems`[i].`instanceId`  | `string` | instance ID.                                 |
| `pageItems`[i].`ip`          | `string` | instance IP.                                 |
| `pageItems`[i].`port`        | `integer` | instance port.                                 |
| `pageItems`[i].`weight`      | `number` | instance weight.                                 |
| `pageItems`[i].`healthy`     | `boolean` | whether the instance is healthy.                               |
| `pageItems`[i].`enabled`     | `boolean` | whether the instance is online.                              |
| `pageItems`[i].`ephemeral`   | `boolean` | whether the instance is ephemeral.                               |
| `pageItems`[i].`clusterName` | `string` | cluster to which the instance belongs.                               |
| `pageItems`[i].`serviceName` | `string` | Service to which the instance belongs, in the format `groupName`@@`serviceName`. |
| `pageItems`[i].`metadata`    | `map<string, string>` | instance metadata.                                |

:::note
The heartbeat-related parameters `instanceHeartBeatInterval`, `instanceHeartBeatTimeOut`, and `ipDeleteTimeout`
are used to be compatible with heartbeat mode data from 1.x clients. Later versions may remove support for 1.x clients, and these three parameters will be deprecated at that time.
:::

#### Examples

* Request example

```shell
curl -X GET "http://127.0.0.1:8080/v3/console/ns/instance/list?&serviceName=test&clusterName=DEFAULT&groupName=DEFAULT_GROUP&pageSize=10&pageNo=1"
```

* Response example

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

### 3.10. Update Instance Metadata

#### Description

You can use this API to update metadata for instances of a specified service, including weight and online/offline status. You cannot update the service name, group name, namespace, IP address, or port of an instance.

#### Since

`3.0.0`

#### Request Method

`PUT`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ns/instance`

#### Request Parameters

| Name           | Type                    | Required | Description                                |
|---------------|-----------------------|----|-------------------------------------|
| `serviceName` | `string` | Yes  | service name.                                |
| `ip`          | `string` | Yes  | instance IP.                               |
| `port`        | `integer` | Yes  | instance port.                               |
| `groupName`   | `string` | No  | Group name to which the service belongs. The default is `DEFAULT_GROUP`. |
| `namespaceId` | `string` | No  | Namespace ID to which the service belongs. The default is `public`.           |
| `clusterName` | `string` | No  | Cluster to which the instance belongs. The default is `DEFAULT`.              |
| `ephemeral`   | `boolean` | No  | Whether the instance is ephemeral. The default is `true`.                  |
| `weight`      | `number` | No  | instance weight.                               |
| `healthy`     | `boolean` | No  | instance health status.                             |
| `enabled`     | `boolean` | No  | whether the instance is online.                            |
| `metadata`    | `string` | No  | instance metadata.                              |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name    | Type     | Description             |
|--------|----------|----------------|
| `data` | `string` | Fixed as `ok` when update succeeds. |

#### Examples

* Request example

```shell
curl -X PUT "http://127.0.0.1:8080/v3/console/ns/instance" -d 'serviceName=test&clusterName=DEFAULT&groupName=DEFAULT_GROUP&ip=1.1.1.1&port=3306&ephemeral=true&weight=100&enabled=false&metadata=%7B%22%E5%95%A6%E5%95%A6%E5%95%A6%26%E5%95%B5%E5%95%B5%E5%95%B5%22%3A%22xxx%22%7D'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

### 3.11. Delete Persistent Instance

#### Description

You can use this API to delete a **persistent instance** under a specified service. This API supports deleting only instances with `ephemeral=false`; it does not support deleting ephemeral instances.

#### Since

`3.2.2`

#### Request Method

`DELETE`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ns/instance`

#### Request Parameters

| Name        | Type      | Required | Description                                       |
| ------------- | --------- | ---- | ---------------------------------------------- |
| `serviceName` | `string`  | Yes   | service name.                                       |
| `ip`          | `string`  | Yes   | instance IP.                                       |
| `port`        | `integer` | Yes   | instance port.                                     |
| `groupName`   | `string`  | No   | Group name to which the service belongs. The default is `DEFAULT_GROUP`. |
| `namespaceId` | `string`  | No   | Namespace ID to which the service belongs. The default is `public`.       |
| `clusterName` | `string`  | No   | Cluster to which the instance belongs. The default is `DEFAULT`.              |
| `ephemeral`   | `boolean` | No   | Whether the instance is ephemeral. Only `false` is supported. The default is `false`. |
| `healthy`     | `boolean` | No   | Whether the instance is healthy. |
| `weight`      | `number`  | No   | Instance weight. |
| `enabled`     | `boolean` | No   | Whether the instance is enabled. |
| `metadata`    | `string`  | No   | Instance metadata as a JSON object string. |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name | Type | Description                     |
| ------ | -------- | ------------------------ |
| `data` | `string` | Fixed as `ok` when deletion succeeds. |

#### Examples

* Request example

```shell
curl -X DELETE "http://127.0.0.1:8080/v3/console/ns/instance?serviceName=test&clusterName=DEFAULT&groupName=DEFAULT_GROUP&ip=1.1.1.1&port=3306&ephemeral=false"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

## 4. MCP Management

### 4.1. Query MCP Service Details

#### Description

You can use this API to query the details of a specified MCP service hosted on Nacos.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ai/mcp`

#### Request Parameters

| Name           | Type     | Required  | Description                                       |
|---------------|----------|-------|------------------------------------------|
| `namespaceId` | `string` | No     | Namespace ID of the MCP service. The default is `public`                 |
| `mcpId`       | `string` | One of two required | MCP service ID (usually UUID). One of `mcpId` and `mcpName` must be provided (OpenAPI cannot express this constraint; at least one is required in practice). Prefer `mcpId`. |
| `mcpName`     | `string` | One of two required | MCP service name template. One of `mcpId` and `mcpName` must be provided; prefer `mcpId`.    |
| `version`     | `string` | No     | version of the MCP service. If not specified, the latest version is returned                      |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                  | Type                  | Description                                                                                              |
|----------------------|-----------------------|-------------------------------------------------------------------------------------------------|
| `id`                 | `string` | MCP service ID, usually a UUID.                                                                               |
| `name`               | `string` | MCP service name.                                                                                         |
| `namespaceId`        | `string` | namespace ID to which the MCP service belongs.                                                                                 |
| `protocol`           | `string` | MCP protocol, such as `stdio`, `sse`, `streamable`, `http`, or `dubbo`.                                             |
| `frontProtocol`      | `string` | Frontend exposure protocol of the MCP service. It is generally used by protocol converters, such as gateways. If there is no converter, it is the same as `protocol`, such as `stdio`, `sse`, `streamable`, `http`, or `dubbo`. |
| `description`        | `string` | MCP service description.                                                                                       |
| `repository`         | `string` | repository of the MCP service.                                                                                     |                                                                                          |
| `versionDetail`      | `VersionDetail`       | queried version information of the MCP service.                                                                                  |
| `localServerConfig`  | `Map<String, Object>` | When the MCP service type is **stdio**, this information exists and records startup information for the local MCP service.                                                        |
| `remoteServerConfig` | `RemoteServerConfig`  | When the MCP service type is **non-stdio**, this information exists and records remote service information.                                                           |
| `enabled`            | `boolean` | whether the MCP service is enabled.                                                                                      |
| `capabilities`       | `List`                | Capability types supported by the MCP service, such as `TOOL`, `PROMPT`, or `RESOURCE`.                                                       |
| `backendEndpoints`   | `List`                | When the MCP service type is **non-stdio**, this information exists and records specific address information for accessing the remote service.                                                      |
| `toolSpec`           | `Map<String, Object>` | This information exists when the capability types supported by the MCP service include `TOOL`; it records detailed tool configuration information.                                                        |
| `allVersions`        | `List<VersionDetail>` | list of all version details of the MCP service.                                                                                |

The `VersionDetail` structure is as follows:

| Name            | Type      | Description               |
|----------------|-----------|------------------|
| `version`      | `string` | version number of the MCP service.       |
| `release_date` | `string` | release time of the MCP service version.    |
| `is_latest`    | `boolean` | whether the MCP service version is the latest version. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/mcp?namespaceId=public&mcpName=test&mcpId=d7a64724-a556-4fe4-82fa-e806d43e00dc'
```
* Response example

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

### 4.2. Update MCP Service

#### Description

You can use this API to update an MCP service hosted on Nacos.

#### Since

`3.0.0`

#### Request Method

`PUT`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/mcp`

#### Request Parameters

| Name                     | Type         | Required  | Description                                                      |
|-------------------------|--------------|-------|---------------------------------------------------------|
| `namespaceId`           | `string` | No     | Namespace ID of the MCP service. The default is `public`                                |
| `latest`                | `boolean` | No     | Whether to update by the latest version, such as `true`.                                      |
| `serverSpecification`   | `string` | **Yes** | MCP service description details                                              |
| `toolSpecification`     | `string` | No     | MCP service tool description details                                            |
| `endpointSpecification` | `string` | No     | Remote service address details of the MCP service. Takes effect only for non-`stdio` protocols                          |
| `overrideExisting`      | `boolean` | No     | whether to overwrite the original `endpointSpecification` when updating the MCP service. It is not overwritten by default and takes effect only for non-`stdio` protocols |

The details of the `serverSpecification`, `toolSpecification`, and `endpointSpecification` parameters are as follows:

> serverSpecification

| Name                  | Type                  | Description                                                                                              |
|----------------------|-----------------------|-------------------------------------------------------------------------------------------------|
| `id`                 | `string` | MCP service ID, usually a UUID. It must be passed to locate the MCP service to update.                                                            |
| `name`               | `string` | MCP service name.                                                                                         |
| `protocol`           | `string` | MCP protocol, such as `stdio`, `sse`, `streamable`, `http`, or `dubbo`.                                             |
| `frontProtocol`      | `string` | Frontend exposure protocol of the MCP service. It is generally used by protocol converters, such as gateways. If there is no converter, it is the same as `protocol`, such as `stdio`, `sse`, `streamable`, `http`, or `dubbo`. |
| `description`        | `string` | MCP service description.                                                                                       |
| `repository`         | `string` | repository of the MCP service.                                                                                     |    |
| `versionDetail`      | `VersionDetail`       | version information of the MCP service.                                                                                     |
| `version`            | `string` | Simple version information of the MCP service, mainly used for compatibility. If `versionDetail` is set, this field is invalid.                                               |    |
| `localServerConfig`  | `Map<String, Object>` | When the MCP service type is **stdio**, this information exists and records startup information for the local MCP service.                                                        |
| `remoteServerConfig` | `RemoteServerConfig`  | When the MCP service type is **non-stdio**, this information exists and records remote service information.                                                           |
| `enabled`            | `boolean` | whether the MCP service is enabled.                                                                                      |
| `capabilities`       | `List`                | Capability types supported by the MCP service, such as `TOOL`, `PROMPT`, or `RESOURCE`.                                                       |

The `VersionDetail` structure is as follows:

| Name            | Type      | Description               |
|----------------|-----------|------------------|
| `version`      | `string` | version number of the MCP service.       |
| `release_date` | `string` | release time of the MCP service version.    |
| `is_latest`    | `boolean` | whether the MCP service version is the latest version. |

> toolSpecification

| Name               | Type                       | Description                                                                                      |
|-------------------|----------------------------|-----------------------------------------------------------------------------------------|
| `tools`           | `List<McpTool>`            | Tool list provided by this MCP Server. Refer to the standard MCP protocol definition of MCP Tool.                                             |
| `toolsMeta`       | `Map<String, McpToolMeta>` | Additional metadata information of tools provided by this MCP Server. It can extend information that is not defined in the standard MCP protocol but is required during use. The key is the `name` of `McpTool`, and the value is extended metadata. |
| `securitySchemes` | `List<SecurityScheme>`     | Security schemes of the MCP tool. Refer to the standard MCP protocol.                                                                   |

The `McpTool` structure is as follows:

| Name           | Type                  | Description                                            |
|---------------|-----------------------|-----------------------------------------------|
| `name`        | `string` | MCP tool name                                     |
| `description` | `string` | MCP tool description                                     |
| `inputSchema` | `Map<String, Object>` | Input parameter description of the MCP tool. Refer to the standard MCP protocol. It mainly contains `Type`, whether the parameter is required, `Description`, and other fields. |

The `McpToolMeta` structure is as follows:

| Name             | Type                  | Description                             |
|-----------------|-----------------------|--------------------------------|
| `invokeContext` | `map<string, string>` | Context information when the MCP tool is called, such as the backend service `Path`. |
| `enabled`       | `boolean` | whether the MCP tool is enabled.                     |
| `templates`     | `map<string, string>` | Template information of the MCP tool. Used to map parameters during protocol conversion.   |

The `SecurityScheme` structure is as follows:

| Name                 | Type     | Description                                                                                |
|---------------------|----------|-----------------------------------------------------------------------------------|
| `id`                | `string` | Security scheme ID, which is used and referenced by MCP tools.                                                            |
| `type`              | `string` | Security scheme type. Possible values include `http`, `apiKey`, `localEnv`, or other custom extensions.                                |
| `scheme`            | `string` | Security scheme subtype. Used when `type` is `http`. Possible values include `basic` or `bearer`.                       |
| `in`                | `string` | Security scheme location. Possible values include `query` and `header`.                                                   |
| `name`              | `string` | Security scheme name. Used when `type` is `apiKey` or `localEnv`. For example, the key name of `apiKey` or the environment name of `localEnv`. |
| `defaultCredential` | `string` | Default credential used when no identity is entered in the configuration parameters. Optional.                                                             |

> endpointSpecification

| Name    | Type                  | Description                                                                                                                               |
|--------|-----------------------|----------------------------------------------------------------------------------------------------------------------------------|
| `type` | `string` | Backend service type of the MCP endpoint. Valid values are `REF` and `DIRECT`.                                                                                           |
| `data` | `map<string, string>` | Actual backend service data of the MCP endpoint. Different parameters are passed based on `type`. For example, `REF` passes `namespaceId`, `groupName`, and `serviceName`; `DIRECT` passes `address` and `port`. |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name    | Type     | Description         |
|--------|----------|------------|
| `data` | `string` | MCP service update result. |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/mcp' \
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

### 4.3. Create MCP Service

#### Description

You can use this API to create an MCP service hosted on Nacos. It can be an MCP service converted from an existing API, or an MCP service from the MCP marketplace.

#### Since

`3.0.0`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/mcp`

#### Request Parameters

| Name                     | Type         | Required  | Description                             |
|-------------------------|--------------|-------|--------------------------------|
| `namespaceId`           | `string` | No     | Namespace ID of the MCP service. The default is `public`       |
| `serverSpecification`   | `string` | **Yes** | MCP service description details                     |
| `toolSpecification`     | `string` | No     | MCP service tool description details                   |
| `endpointSpecification` | `string` | No     | Remote service address details of the MCP service. Takes effect only for non-`stdio` protocols |

The details of the `serverSpecification`, `toolSpecification`, and `endpointSpecification` parameters are as follows:

> serverSpecification

| Name                  | Type                  | Description                                                                                              |
|----------------------|-----------------------|-------------------------------------------------------------------------------------------------|
| `id`                 | `string` | MCP service ID, usually a UUID. It does not need to be passed; the system generates it automatically.                                                                   |
| `name`               | `string` | MCP service name.                                                                                         |
| `protocol`           | `string` | MCP protocol, such as `stdio`, `sse`, `streamable`, `http`, or `dubbo`.                                             |
| `frontProtocol`      | `string` | Frontend exposure protocol of the MCP service. It is generally used by protocol converters, such as gateways. If there is no converter, it is the same as `protocol`, such as `stdio`, `sse`, `streamable`, `http`, or `dubbo`. |
| `description`        | `string` | MCP service description.                                                                                       |
| `repository`         | `string` | repository of the MCP service.                                                                                     |    |
| `versionDetail`      | `VersionDetail`       | version information of the MCP service.                                                                                     |
| `version`            | `string` | Simple version information of the MCP service, mainly used for compatibility. If `versionDetail` is set, this field is invalid.                                               |    |
| `localServerConfig`  | `Map<String, Object>` | When the MCP service type is **stdio**, this information exists and records startup information for the local MCP service.                                                        |
| `remoteServerConfig` | `RemoteServerConfig`  | When the MCP service type is **non-stdio**, this information exists and records remote service information.                                                           |
| `enabled`            | `boolean` | whether the MCP service is enabled.                                                                                      |
| `capabilities`       | `List`                | Capability types supported by the MCP service, such as `TOOL`, `PROMPT`, or `RESOURCE`.                                                       |

The `VersionDetail` structure is as follows:

| Name            | Type      | Description               |
|----------------|-----------|------------------|
| `version`      | `string` | version number of the MCP service.       |
| `release_date` | `string` | release time of the MCP service version.    |
| `is_latest`    | `boolean` | whether the MCP service version is the latest version. |

> toolSpecification

| Name               | Type                       | Description                                                                                      |
|-------------------|----------------------------|-----------------------------------------------------------------------------------------|
| `tools`           | `List<McpTool>`            | Tool list provided by this MCP Server. Refer to the standard MCP protocol definition of MCP Tool.                                             |
| `toolsMeta`       | `Map<String, McpToolMeta>` | Additional metadata information of tools provided by this MCP Server. It can extend information that is not defined in the standard MCP protocol but is required during use. The key is the `name` of `McpTool`, and the value is extended metadata. |
| `securitySchemes` | `List<SecurityScheme>`     | Security schemes of the MCP tool. Refer to the standard MCP protocol.                                                                   |

The `McpTool` structure is as follows:

| Name           | Type                  | Description                                            |
|---------------|-----------------------|-----------------------------------------------|
| `name`        | `string` | MCP tool name                                     |
| `description` | `string` | MCP tool description                                     |
| `inputSchema` | `Map<String, Object>` | Input parameter description of the MCP tool. Refer to the standard MCP protocol. It mainly contains `Type`, whether the parameter is required, `Description`, and other fields. |

The `McpToolMeta` structure is as follows:

| Name             | Type                  | Description                             |
|-----------------|-----------------------|--------------------------------|
| `invokeContext` | `map<string, string>` | Context information when the MCP tool is called, such as the backend service `Path`. |
| `enabled`       | `boolean` | whether the MCP tool is enabled.                     |
| `templates`     | `map<string, string>` | Template information of the MCP tool. Used to map parameters during protocol conversion.   |

The `SecurityScheme` structure is as follows:

| Name                 | Type     | Description                                                                                |
|---------------------|----------|-----------------------------------------------------------------------------------|
| `id`                | `string` | Security scheme ID, which is used and referenced by MCP tools.                                                            |
| `type`              | `string` | Security scheme type. Possible values include `http`, `apiKey`, `localEnv`, or other custom extensions.                                |
| `scheme`            | `string` | Security scheme subtype. Used when `type` is `http`. Possible values include `basic` or `bearer`.                       |
| `in`                | `string` | Security scheme location. Possible values include `query` and `header`.                                                   |
| `name`              | `string` | Security scheme name. Used when `type` is `apiKey` or `localEnv`. For example, the key name of `apiKey` or the environment name of `localEnv`. |
| `defaultCredential` | `string` | Default credential used when no identity is entered in the configuration parameters. Optional.                                                             |

> endpointSpecification

| Name    | Type                  | Description                                                                                                                               |
|--------|-----------------------|----------------------------------------------------------------------------------------------------------------------------------|
| `type` | `string` | Backend service type of the MCP endpoint. Valid values are `REF` and `DIRECT`.                                                                                           |
| `data` | `map<string, string>` | Actual backend service data of the MCP endpoint. Different parameters are passed based on `type`. For example, `REF` passes `namespaceId`, `groupName`, and `serviceName`; `DIRECT` passes `address` and `port`. |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name    | Type     | Description         |
|--------|----------|------------|
| `data` | `string` | ID of the newly created MCP service. |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/mcp' \
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

### 4.4. Delete MCP Service

#### Description

You can use this API to delete an MCP service hosted on Nacos.

#### Since

`3.0.0`

#### Request Method

`DELETE`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/mcp`

#### Request Parameters

| Name           | Type     | Required  | Description                                       |
|---------------|----------|-------|------------------------------------------|
| `namespaceId` | `string` | No     | Namespace ID of the MCP service. The default is `public`                 |
| `mcpId`       | `string` | One of two required | MCP service ID (usually UUID). One of `mcpId` and `mcpName` must be provided (OpenAPI cannot express this constraint; at least one is required in practice). Prefer `mcpId`. |
| `mcpName`     | `string` | One of two required | MCP service name template. One of `mcpId` and `mcpName` must be provided; prefer `mcpId`.    |
| `version`     | `string` | No     | version of the MCP service. If not specified, the latest version is used                       |


#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name    | Type     | Description         |
|--------|----------|------------|
| `data` | `string` | MCP service deletion result. |

#### Examples

* Request example

```shell
curl -X DELETE 'http://127.0.0.1:8080/v3/console/ai/mcp?namespaceId=public&mcpName=test&mcpId=d7a64724-a556-4fe4-82fa-e806d43e00dc'
```
* Response example

```json
{
  "code" : 0,
  "message" : "success",
  "data" : "ok"
}
```

### 4.5. Query MCP Service List

#### Description

You can use this API to query the list of MCP services hosted on Nacos.

#### Since

`3.0.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ai/mcp/list`

#### Request Parameters

| Name           | Type     | Required  | Description                                                     |
|---------------|----------|-------|--------------------------------------------------------|
| `pageNo`      | `integer` | **Yes** | current page. The default is `1`                                             |
| `pageSize`    | `integer` | **Yes** | page item count. The default is `20`, and the maximum is `500`                                  |
| `namespaceId` | `string` | No     | Namespace ID of the MCP service. The default is `public`                               |
| `mcpName`     | `string`   | No     | MCP service name pattern. Queries all MCP services when empty. When `search` is `blur`, `*` can be used for fuzzy search |
| `search`      | `string` | No     | blur or accurate                  |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                                           | Type                  | Description                                                                                              |
|-----------------------------------------------|-----------------------|-------------------------------------------------------------------------------------------------|
| `totalCount`                                  | `integer` | total number of services that match the condition.                                                                                     |
| `pageNumber`                                  | `integer` | current page number, starts from `1`.                                                                                    |
| `pagesAvailable`                              | `integer` | available pages.                                                                                           |
| `pageItems`                                   | `List`                | service list.                                                                                           |
| `pageItems`[i].`id`                           | `string` | MCP service ID, usually a UUID.                                                                               |
| `pageItems`[i].`name`                         | `string` | MCP service name.                                                                                         |
| `pageItems`[i].`protocol`                     | `string` | MCP protocol, such as `stdio`, `sse`, `streamable`, `http`, or `dubbo`.                                             |
| `pageItems`[i].`frontProtocol`                | `string` | Frontend exposure protocol of the MCP service. It is generally used by protocol converters, such as gateways. If there is no converter, it is the same as `protocol`, such as `stdio`, `sse`, `streamable`, `http`, or `dubbo`. |
| `pageItems`[i].`description`                  | `string` | MCP service description.                                                                                       |
| `pageItems`[i].`repository`                   | `string` | repository of the MCP service.                                                                                     |                                                                                          |
| `pageItems`[i].`versionDetail`                | `VersionDetail`       | current latest version information of the MCP service.                                                                                 |
| `pageItems`[i].`localServerConfig`            | `Map<String, Object>` | When the MCP service type is **stdio**, this information exists and records startup information for the local MCP service.                                                        |
| `pageItems`[i].`remoteServerConfig`           | `RemoteServerConfig`  | When the MCP service type is **non-stdio**, this information exists and records remote service information.                                                           |
| `pageItems`[i].`latestPublishedVersion`       | `string` | version number of the latest MCP service version.                                                                                  |
| `pageItems`[i].`versionDetails`               | `List<VersionDetail>` | list of MCP service version details.                                                                                   |
| `pageItems`[i].`capabilities`                 | `List`                | Capability types supported by the MCP service, such as `TOOL`, `PROMPT`, or `RESOURCE`.                                                       |

The `VersionDetail` structure is as follows:

| Name            | Type      | Description               |
|----------------|-----------|------------------|
| `version`      | `string` | version number of the MCP service.       |
| `release_date` | `string` | release time of the MCP service version.    |
| `is_latest`    | `boolean` | whether the MCP service version is the latest version. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/mcp/list?pageNo=1&pageSize=100&namespaceId=public&search=blur'
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

### 4.6. Import MCP Tools

#### Description

You can use this API to directly obtain and import MCP tools by specifying an MCP `URL`, avoiding manual entry one by one.

#### Since

`3.0.3`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ai/mcp/importToolsFromMcp`

#### Request Parameters

| Name             | Type     | Required  | Description                                      |
|-----------------|----------|-------|-----------------------------------------|
| `transportType` | `string` | **Yes** | Transport protocol type of the MCP service, `mcp-sse` or `mcp-streamable` |
| `baseUrl`       | `string` | **Yes** | baseURL of the MCP service                           |
| `endpoint`      | `string` | **Yes** | accessible endpoint of the MCP service                             |
| `authToken`     | `string` | No     | identity token used to access the MCP service                         |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name    | Type                   | Description                                                                                                       |
|--------|------------------------|----------------------------------------------------------------------------------------------------------|
| `data` | `List<McpSchema.Tool>` | MCP tool metadata information that complies with the [standard MCP tool metadata definition](https://modelcontextprotocol.io/specification/2025-06-18/server/tools#tool). |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/mcp/importToolsFromMcp?transportType=mcp-sse&baseUrl=%2Fsse&endpoint=http%3A%2F%2Flocalhost'
```
* Response example

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

### 4.7. Validate MCP Services to Import

#### Description

You can use this API to validate whether the MCP service content to import complies with the rules. The response includes valid and invalid counts, and invalid services contain error information in the corresponding fields.

#### Since

`3.1.0`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/mcp/import/validate`

#### Request Parameters

| Name           | Type     | Required  | Description                                      |
|---------------|----------|-------|-----------------------------------------|
| `namespaceId` | `string` | No     | namespace ID of the MCP service                            |
| `importType`  | `string` | **Yes** | enum of `file`, `json`, `url`           |
| `data`        | `string` | **Yes** | content of the import data                                 |
| `cursor`      | `string` | No     | Optional start cursor for URL-based import pagination. |
| `limit`       | `integer` | No     | page size for pagination                                  |
| `search`      | `string`   | No     | Optional fuzzy search keyword for registry import listing. Only used when importType is 'url'. |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name              | Type                            | Description        |
|------------------|---------------------------------|-----------|
| `valid`          | `boolean` | whether the imported services are valid. |
| `totalCount`     | `integer` | total number of imported services.   |
| `validCount`     | `integer` | number of valid imported services. |
| `invalidCount`   | `integer` | number of invalid imported services. |
| `duplicateCount` | `integer` | number of duplicate imported services. |
| `servers`        | `List<McpServerValidationItem>` | imported service list.   |
| `errors`         | `List<String>`                  | imported service error list. |

The `McpServerValidationItem` description is as follows:

| Name          | Type      | Description       |
|--------------|-----------|----------|
| `serverName` | `string` | service name.    |
| `serverId`   | `string` | service ID.    |
| `status`     | `string` | service status.    |
| `selected`   | `boolean` | whether the service is selected. |
| `exists`     | `boolean` | whether the service already exists. |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/mcp/import/validate' \
-d 'namespaceId=public' \
-d 'importType=url' \
-d 'data=' \
-d 'limit=10'
```
* Response example

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

### 4.8. Import MCP Services

#### Description

You can use this API to directly import MCP services by using a `file`, `JSON`, or specified MCP `URL`, avoiding manual entry one by one.

#### Since

`3.1.0`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/mcp/import/execute`

#### Request Parameters

| Name                | Type      | Required  | Description                                      |
|--------------------|-----------|-------|-----------------------------------------|
| `namespaceId`      | `string` | No     | namespace ID of the MCP service                            |
| `importType`       | `string` | **Yes** | enum of `file`, `json`, `url`           |
| `data`             | `string` | **Yes** | content of the import data                                 |
| `cursor`           | `string` | No     | Optional start cursor for URL-based import pagination. |
| `limit`            | `integer` | No     | page size for pagination                                  |
| `search`           | `string`    | No     | Optional fuzzy search keyword for registry import listing. Only used when importType is 'url'. |
| `overrideExisting` | `boolean` | No     | Whether to overwrite the service if it already exists during import. The default is `false`.              |                                    |
| `skipInvalid`      | `boolean` | No     | Whether to ignore invalid services with errors during import. The default is `false`.              |
| `selectedServers`  | `array` | No     | Selected services to import. Empty means importing all services. |


#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name            | Type                          | Description        |
|----------------|-------------------------------|-----------|
| `success`      | `boolean` | whether service import succeeded. |
| `totalCount`   | `integer` | total number of imported services.   |
| `successCount` | `integer` | number of services imported successfully. |
| `failedCount`  | `integer` | number of services that failed to import. |
| `skippedCount` | `integer` | number of services skipped during import. |
| `results`      | `List<McpServerImportResult>` | imported service list.   |

The `McpServerImportResult` description is as follows:

| Name            | Type      | Description                     |
|----------------|-----------|------------------------|
| `serverName`   | `string` | service name.                  |
| `serverId`     | `string` | service ID.                  |
| `status`       | `string` | service import status.                |
| `errorMessage` | `boolean` | error information for service import failure. Exists only when import fails. |


#### Examples

* Request example

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
* Response example

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

## 5. A2A Registry

### 5.1. Query AgentCard List

#### Description

You can use this API to query the list of AgentCards hosted on Nacos.

#### Since

`3.1.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ai/a2a/list`

#### Request Parameters

| Name           | Type     | Required  | Description                                              |
|---------------|----------|-------|-------------------------------------------------|
| `pageNo`      | `integer` | **Yes** | current page. The default is `1`                                      |
| `pageSize`    | `integer` | **Yes** | page item count. The default is `100`                                   |
| `namespaceId` | `string` | No     | Namespace ID of the AgentCard. The default is `public`                    |
| `agentName`   | `string` | No     | AgentCard name. Queries all AgentCards when empty                   |
| `search`      | `string` | **Yes** | blur or accurate |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                                     | Type                       | Description                                                                                                     |
|-----------------------------------------|----------------------------|--------------------------------------------------------------------------------------------------------|
| `totalCount`                            | `integer` | total number of services that match the condition.                                                                                            |
| `pageNumber`                            | `integer` | current page number, starts from `1`.                                                                                           |
| `pagesAvailable`                        | `integer` | available pages.                                                                                                  |
| `pageItems`                             | `List`                     | service list.                                                                                                  |
| `pageItems`[i].`protocolVersion`        | `string` | A2A protocol version of the AgentCard.                                                                                     |
| `pageItems`[i].`name`                   | `string` | AgentCard name.                                                                                          |
| `pageItems`[i].`description`            | `string` | AgentCard description.                                                                                          |
| `pageItems`[i].`version`                | `string` | AgentCard version number.                                                                                         |
| `pageItems`[i].`iconUrl`                | `string` | AgentCard icon URL.                                                                                     |
| `pageItems`[i].`capabilities`           | `AgentCapability`          | AgentCard capabilities, matching [A2A standard capabilities](https://a2a-protocol.org/latest/specification/#552-agentcapabilities-object). |
| `pageItems`[i].`skills`                 | `List<AgentSkill>`         | AgentCard skill list, matching [A2A standard skills](https://a2a-protocol.org/latest/specification/#554-agentskill-object).      |
| `pageItems`[i].`latestPublishedVersion` | `string` | latest published version of the AgentCard.                                                                                      |
| `pageItems`[i].`versionDetails`         | `List<AgentVersionDetail>` | all version details of the AgentCard.                                                                                      |
| `pageItems`[i].`registrationType`       | `string` | Default registration type of the AgentCard. Valid values are `URL` and `SERVICE`.                                                                    |

The `AgentVersionDetail` structure contains the following fields:

| Name         | Type      | Description              |
|-------------|-----------|-----------------|
| `version`   | `string` | AgentCard version number.  |
| `createdAt` | `string` | creation time of this version.       |
| `updatedAt` | `string` | last update time of this version.     |
| `latest`    | `boolean` | whether this version is marked as the latest published version. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/a2a/list?pageNo=1&pageSize=100&namespaceId=public&search=blur'
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

### 5.2. Query Version List of a Specified AgentCard

#### Description

You can use this API to query the version list of a specified AgentCard hosted on Nacos.

#### Since

`3.1.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ai/a2a/version/list`

#### Request Parameters

| Name           | Type     | Required  | Description                          |
|---------------|----------|-------|-----------------------------|
| `namespaceId` | `string` | No     | Namespace to which the AgentCard belongs. The default is `public` |
| `agentName`   | `string` | **Yes** | AgentCard name                |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                   | Type      | Description              |
|-----------------------|-----------|-----------------|
| `data`[i].`version`   | `string` | AgentCard version number.  |
| `data`[i].`createdAt` | `string` | creation time of this version.       |
| `data`[i].`updatedAt` | `string` | last update time of this version.     |
| `data`[i].`latest`    | `boolean` | whether this version is marked as the latest published version. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/a2a/version/list?namespaceId=public&agentName=GeoSpatial+Route+Planner+Agent'
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

### 5.3. Query AgentCard Details

#### Description

You can use this API to query details of a specified AgentCard hosted on Nacos.

#### Since

`3.1.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ai/a2a`

#### Request Parameters

| Name                | Type     | Required  | Description                                                                                 |
|--------------------|----------|-------|------------------------------------------------------------------------------------|
| `namespaceId`      | `string` | No     | Namespace to which the AgentCard belongs. The default is `public`                                                        |
| `agentName`        | `string` | **Yes** | AgentCard name                                                                       |
| `version`          | `string` | No     | AgentCard version number. Returns the latest version details when empty                                                          |
| `registrationType` | `string` | No     | Default registration type of the AgentCard. Valid values are `URL` and `SERVICE`. If not specified, the `url` is generated based on the default `registrationType` of this AgentCard. |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name                                 | Type                              | Description                                                                                                       |
|-------------------------------------|-----------------------------------|----------------------------------------------------------------------------------------------------------|
| `protocolVersion`                   | `string` | A2A protocol version of the AgentCard.                                                                                       |
| `name`                              | `string` | AgentCard name.                                                                                            |
| `description`                       | `string` | AgentCard description.                                                                                            |
| `version`                           | `string` | AgentCard version number.                                                                                           |
| `iconUrl`                           | `string` | AgentCard icon URL.                                                                                       |
| `capabilities`                      | `AgentCapability`                 | AgentCard capabilities, matching [A2A standard capabilities](https://a2a-protocol.org/latest/specification/#552-agentcapabilities-object).   |
| `skills`                            | `List<AgentSkill>`                | AgentCard skill list, matching [A2A standard skills](https://a2a-protocol.org/latest/specification/#554-agentskill-object).        |
| `url`                               | `string` | default access URL of the AgentCard.                                                                                      |
| `preferredTransport`                | `string` | transport protocol of the default access URL of the AgentCard. It should be `JSONRPC`, `GRPC`, or `HTTP+JSON`.                                                  |
| `additionalInterfaces`              | `List<AgentInterface>`            | List of all accessible AgentCard interfaces, matching the [A2A standard](https://a2a-protocol.org/latest/specification/#555-agentinterface-object). |
| `provider`                          | `AgentProvider`                   | AgentCard provider information, matching the [A2A standard](https://a2a-protocol.org/latest/specification/#551-agentprovider-object).      |
| `documentationUrl`                  | `string` | AgentCard documentation URL.                                                                                        |
| `securitySchemes`                   | `Map<String, SecurityScheme>`     | AgentCard security configuration definition, matching the [A2A standard](https://a2a-protocol.org/latest/specification/#553-securityscheme-object).     |
| `security`                          | `List<Map<String, List<String>>>` | list of all security requirement objects of the AgentCard.                                                                                    |
| `defaultInputModes`                 | `List<String>`                    | all default input modes of the AgentCard.                                                                                      |
| `defaultOutputModes`                | `List<String>`                    | all default output modes of the AgentCard.                                                                                      |
| `supportsAuthenticatedExtendedCard` | `string` | whether the AgentCard supports authenticated extended cards.                                                                                     |
| `registrationType`                  | `string` | Default registration type of the AgentCard. Valid values are `URL` and `SERVICE`.                                                                      |
| `latestVersion`                     | `string` | whether the current AgentCard version is the latest version.                                                                                    |


#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/a2a?namespaceId=public&agentName=GeoSpatial+Route+Planner+Agent&version=1.0.0&registrationType=SERVICE'
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

You can use this API to update an AgentCard hosted on Nacos.

#### Since

`3.1.0`

#### Request Method

`PUT`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/a2a`

#### Request Parameters

| Name                | Type        | Required  | Description                                                                                                              |
|--------------------|-------------|-------|-----------------------------------------------------------------------------------------------------------------|
| `namespaceId`      | `string` | No     | Namespace to which the AgentCard belongs. The default is `public`                                                                                     |
| `agentCard`        | `string` | **Yes** | Complete AgentCard object. For details, see the [standard AgentCard](https://a2a-protocol.org/latest/specification/#55-agentcard-object-structure). |
| `registrationType` | `string` | No     | Default registration type of the AgentCard. Valid values are `URL` and `SERVICE`. If not specified, the `url` is generated based on the default `registrationType` of this AgentCard.                              |
| `setAsLatest`      | `boolean` | No     | Whether to set this version as the latest published version. The default is `false`.                                                                                         |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name    | Type     | Description               |
|--------|----------|------------------|
| `data` | `string` | AgentCard service update result. |


#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/a2a' \
-d 'namespaceId=public' \
-d 'agentCard={"protocolVersion":"0.2.9","name":"GeoSpatial Route Planner Agent","description":"Provides advanced route planning, traffic analysis, and custom map generation services. This agent can calculate optimal routes, estimate travel times considering real-time traffic, and create personalized maps with points of interest.","url":"https://georoute-agent.example.com/a2a/v1","preferredTransport":"JSONRPC","additionalInterfaces":[{"url":"https://georoute-agent.example.com/a2a/v1","transport":"JSONRPC"},{"url":"https://georoute-agent.example.com/a2a/grpc","transport":"GRPC"},{"url":"https://georoute-agent.example.com/a2a/json","transport":"HTTP+JSON"}],"provider":{"organization":"Example Geo Services Inc.","url":"https://www.examplegeoservices.com"},"iconUrl":"https://georoute-agent.example.com/icon.png","version":"1.2.0","documentationUrl":"https://docs.examplegeoservices.com/georoute-agent/api","capabilities":{"streaming":true,"pushNotifications":true,"stateTransitionHistory":false},"securitySchemes":{"google":{"type":"openIdConnect","openIdConnectUrl":"https://accounts.google.com/.well-known/openid-configuration"}},"security":[{"google":["openid","profile","email"]}],"defaultInputModes":["application/json","text/plain"],"defaultOutputModes":["application/json","image/png"],"skills":[{"id":"route-optimizer-traffic","name":"Traffic-Aware Route Optimizer","description":"Calculates the optimal driving route between two or more locations, taking into account real-time traffic conditions, road closures, and user preferences (e.g., avoid tolls, prefer highways).","tags":["maps","routing","navigation","directions","traffic"],"examples":["Plan a route from '1600 Amphitheatre Parkway, Mountain View, CA' to 'San Francisco International Airport' avoiding tolls.","{\"origin\": {\"lat\": 37.422, \"lng\": -122.084}, \"destination\": {\"lat\": 37.7749, \"lng\": -122.4194}, \"preferences\": [\"avoid_ferries\"]}"],"inputModes":["application/json","text/plain"],"outputModes":["application/json","application/vnd.geo+json","text/html"]},{"id":"custom-map-generator","name":"Personalized Map Generator","description":"Creates custom map images or interactive map views based on user-defined points of interest, routes, and style preferences. Can overlay data layers.","tags":["maps","customization","visualization","cartography"],"examples":["Generate a map of my upcoming road trip with all planned stops highlighted.","Show me a map visualizing all coffee shops within a 1-mile radius of my current location."],"inputModes":["application/json"],"outputModes":["image/png","image/jpeg","application/json","text/html"]}],"supportsAuthenticatedExtendedCard":true,"signatures":[{"protected":"eyJhbGciOiJFUzI1NiIsInR5cCI6IkpPU0UiLCJraWQiOiJrZXktMSIsImprdSI6Imh0dHBzOi8vZXhhbXBsZS5jb20vYWdlbnQvandrcy5qc29uIn0","signature":"QFdkNLNszlGj3z3u0YQGt_T9LixY3qtdQpZmsTdDHDe3fXV9y9-B3m2-XgCpzuhiLt8E0tV6HXoZKHv4GtHgKQ"}]}' \
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

You can use this API to create an AgentCard hosted on Nacos.

#### Since

`3.1.0`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/a2a`

#### Request Parameters

| Name                | Type        | Required  | Description                                                                                                              |
|--------------------|-------------|-------|-----------------------------------------------------------------------------------------------------------------|
| `namespaceId`      | `string` | No     | Namespace to which the AgentCard belongs. The default is `public`                                                                                     |
| `agentCard`        | `string` | **Yes** | Complete AgentCard object. For details, see the [standard AgentCard](https://a2a-protocol.org/latest/specification/#55-agentcard-object-structure). |
| `registrationType` | `string` | No     | Default registration type of the AgentCard. Valid values are `URL` and `SERVICE`. If not specified, the `url` is generated based on the default `registrationType` of this AgentCard. The default is `URL`.                   |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name    | Type     | Description             |
|--------|----------|----------------|
| `data` | `string` | AgentCard publishing result. |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/a2a' \
-d 'namespaceId=public' \
-d 'agentCard={"protocolVersion":"0.2.9","name":"GeoSpatial Route Planner Agent","description":"Provides advanced route planning, traffic analysis, and custom map generation services. This agent can calculate optimal routes, estimate travel times considering real-time traffic, and create personalized maps with points of interest.","url":"https://georoute-agent.example.com/a2a/v1","preferredTransport":"JSONRPC","additionalInterfaces":[{"url":"https://georoute-agent.example.com/a2a/v1","transport":"JSONRPC"},{"url":"https://georoute-agent.example.com/a2a/grpc","transport":"GRPC"},{"url":"https://georoute-agent.example.com/a2a/json","transport":"HTTP+JSON"}],"provider":{"organization":"Example Geo Services Inc.","url":"https://www.examplegeoservices.com"},"iconUrl":"https://georoute-agent.example.com/icon.png","version":"1.2.0","documentationUrl":"https://docs.examplegeoservices.com/georoute-agent/api","capabilities":{"streaming":true,"pushNotifications":true,"stateTransitionHistory":false},"securitySchemes":{"google":{"type":"openIdConnect","openIdConnectUrl":"https://accounts.google.com/.well-known/openid-configuration"}},"security":[{"google":["openid","profile","email"]}],"defaultInputModes":["application/json","text/plain"],"defaultOutputModes":["application/json","image/png"],"skills":[{"id":"route-optimizer-traffic","name":"Traffic-Aware Route Optimizer","description":"Calculates the optimal driving route between two or more locations, taking into account real-time traffic conditions, road closures, and user preferences (e.g., avoid tolls, prefer highways).","tags":["maps","routing","navigation","directions","traffic"],"examples":["Plan a route from '1600 Amphitheatre Parkway, Mountain View, CA' to 'San Francisco International Airport' avoiding tolls.","{\"origin\": {\"lat\": 37.422, \"lng\": -122.084}, \"destination\": {\"lat\": 37.7749, \"lng\": -122.4194}, \"preferences\": [\"avoid_ferries\"]}"],"inputModes":["application/json","text/plain"],"outputModes":["application/json","application/vnd.geo+json","text/html"]},{"id":"custom-map-generator","name":"Personalized Map Generator","description":"Creates custom map images or interactive map views based on user-defined points of interest, routes, and style preferences. Can overlay data layers.","tags":["maps","customization","visualization","cartography"],"examples":["Generate a map of my upcoming road trip with all planned stops highlighted.","Show me a map visualizing all coffee shops within a 1-mile radius of my current location."],"inputModes":["application/json"],"outputModes":["image/png","image/jpeg","application/json","text/html"]}],"supportsAuthenticatedExtendedCard":true,"signatures":[{"protected":"eyJhbGciOiJFUzI1NiIsInR5cCI6IkpPU0UiLCJraWQiOiJrZXktMSIsImprdSI6Imh0dHBzOi8vZXhhbXBsZS5jb20vYWdlbnQvandrcy5qc29uIn0","signature":"QFdkNLNszlGj3z3u0YQGt_T9LixY3qtdQpZmsTdDHDe3fXV9y9-B3m2-XgCpzuhiLt8E0tV6HXoZKHv4GtHgKQ"}]}' \
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

You can use this API to delete an AgentCard hosted on Nacos.

#### Since

`3.1.0`

#### Request Method

`DELETE`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/a2a`

#### Request Parameters

| Name           | Type     | Required  | Description                          |
|---------------|----------|-------|-----------------------------|
| `namespaceId` | `string` | No     | Namespace to which the AgentCard belongs. The default is `public` |
| `agentName`   | `string` | **Yes** | AgentCard name                |
| `version`     | `string` | No     | AgentCard version number. Returns the latest version details when empty   |

#### Response Data

The response body follows the [Nacos Open API unified response format](../user/overview/api-overview.md#32-http-api-response-format). The table below describes only the response parameters in the `data` field.

| Name    | Type     | Description             |
|--------|----------|----------------|
| `data` | `string` | AgentCard deletion result. |

#### Examples

* Request example

```shell
curl -X DELETE 'http://127.0.0.1:8080/v3/console/ai/a2a?namespaceId=public&agentName=GeoSpatial+Route+Planner+Agent&version=1.0.0'
```
* Response example

```json
{
  "code" : 0,
  "message" : "success",
  "data" : "ok"
}
```

## 6. Prompt Management

Prompt Management APIs provide draft, publish, online/offline, governance query, version query, and download capabilities for Prompts.

### 6.1. Delete Prompt
#### Description
This interface allows deleting a specific Prompt.

#### Since

`3.2.0`

#### Request Method

`DELETE`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/prompt`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `promptKey` | `string` | **Yes** | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `boolean` | - |

#### Examples

* Request example

```shell
curl -X DELETE 'http://127.0.0.1:8080/v3/console/ai/prompt?namespaceId=public&promptKey=my-prompt'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.2. Update Prompt Biz Tags
#### Description
This interface updates Prompt biz tags.

#### Since

`3.2.1`

#### Request Method

`PUT`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/prompt/biz-tags`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `promptKey` | `string` | **Yes** | - |
| `bizTags` | `string` | No | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/prompt/biz-tags' -d "namespaceId=namespaceId&promptKey=promptKey&bizTags=bizTags"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.3. Update Prompt Description
#### Description
This interface updates the Prompt description.

#### Since

`3.2.1`

#### Request Method

`PUT`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/prompt/description`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `promptKey` | `string` | **Yes** | - |
| `description` | `string` | **Yes** | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/prompt/description' -d "namespaceId=namespaceId&promptKey=promptKey&description=description"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.4. Create Prompt Draft
#### Description
This interface creates a Prompt draft version or forks a draft from an existing version.

#### Since

`3.2.1`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/prompt/draft`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `promptKey` | `string` | **Yes** | - |
| `basedOnVersion` | `string` | No | - |
| `targetVersion` | `string` | No | - |
| `template` | `string` | No | - |
| `variables` | `string` | No | - |
| `commitMsg` | `string` | No | - |
| `description` | `string` | No | - |
| `bizTags` | `string` | No | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/prompt/draft' -d "namespaceId=namespaceId&promptKey=promptKey&basedOnVersion=basedOnVersion&targetVersion=targetVersion&template=template&variables=variables&commitMsg=commitMsg&description=description&bizTags=bizTags"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.5. Update Prompt Draft
#### Description
This interface updates the current Prompt draft content.

#### Since

`3.2.1`

#### Request Method

`PUT`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/prompt/draft`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `promptKey` | `string` | **Yes** | - |
| `template` | `string` | **Yes** | - |
| `variables` | `string` | No | - |
| `commitMsg` | `string` | No | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/prompt/draft' -d "namespaceId=namespaceId&promptKey=promptKey&template=template&variables=variables&commitMsg=commitMsg"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.6. Delete Prompt Draft
#### Description
This interface deletes the current Prompt draft version.

#### Since

`3.2.1`

#### Request Method

`DELETE`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/prompt/draft`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `promptKey` | `string` | **Yes** | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X DELETE 'http://127.0.0.1:8080/v3/console/ai/prompt/draft?namespaceId=public&promptKey=my-prompt'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.7. Force Publish Prompt Version
#### Description
This interface force-publishes a Prompt version by bypassing pipeline validation.

#### Since

`3.2.1`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/prompt/force-publish`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `promptKey` | `string` | **Yes** | - |
| `version` | `string` | **Yes** | - |
| `updateLatestLabel` | `boolean` | No | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/prompt/force-publish' -d "namespaceId=namespaceId&promptKey=promptKey&version=version&updateLatestLabel=updateLatestLabel"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.8. Get Prompt Governance Detail
#### Description
This interface retrieves Prompt metadata, version governance information, and version summaries.

#### Since

`3.2.1`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ai/prompt/governance`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `promptKey` | `string` | **Yes** | - |

#### Response Data

| Name | Type | Description |
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
| data.data.labels | `object` | - |
| data.data.downloadCount | `integer` | - |
| data.data.versions | `array` | - |
| data.data.versionDetails | `array` | - |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/prompt/governance?namespaceId=public&promptKey=my-prompt'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.9. Update Prompt Labels
#### Description
This interface updates runtime routing labels of a Prompt.

#### Since

`3.2.1`

#### Request Method

`PUT`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/prompt/labels`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `promptKey` | `string` | **Yes** | - |
| `labels` | `string` | **Yes** | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/prompt/labels' -d "namespaceId=namespaceId&promptKey=promptKey&labels=labels"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.10. List Prompts
#### Description
This interface allows listing Prompts with pagination.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ai/prompt/list`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `pageNo` | `integer` | **Yes** | - |
| `pageSize` | `integer` | **Yes** | - |
| `namespaceId` | `string` | No | - |
| `promptKey` | `string` | No | - |
| `search` | `string` | No | blur or accurate |
| `bizTags` | `string` | No | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/prompt/list?pageNo=1&pageSize=10&namespaceId=public&promptKey=my-prompt&search=blur&bizTags=tag-a'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.11. Offline Prompt Version
#### Description
This interface takes a specified Prompt version offline.

#### Since

`3.2.1`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/prompt/offline`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `promptKey` | `string` | **Yes** | - |
| `version` | `string` | **Yes** | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/prompt/offline' -d "namespaceId=namespaceId&promptKey=promptKey&version=version"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.12. Online Prompt Version
#### Description
This interface brings a specified Prompt version online.

#### Since

`3.2.1`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/prompt/online`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `promptKey` | `string` | **Yes** | - |
| `version` | `string` | **Yes** | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/prompt/online' -d "namespaceId=namespaceId&promptKey=promptKey&version=version"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.13. Publish Prompt Version
#### Description
This interface publishes an approved Prompt version.

#### Since

`3.2.1`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/prompt/publish`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `promptKey` | `string` | **Yes** | - |
| `version` | `string` | **Yes** | - |
| `updateLatestLabel` | `boolean` | No | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/prompt/publish' -d "namespaceId=namespaceId&promptKey=promptKey&version=version&updateLatestLabel=updateLatestLabel"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.14. Redraft Prompt Version
#### Description
This interface transitions a reviewed Prompt version back to draft.

#### Since

`3.2.2`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/prompt/redraft`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `promptKey` | `string` | **Yes** | - |
| `version` | `string` | **Yes** | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/prompt/redraft' -d "namespaceId=namespaceId&promptKey=promptKey&version=version"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.15. Submit Prompt Version
#### Description
This interface submits a Prompt version for pipeline review.

#### Since

`3.2.1`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/prompt/submit`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `promptKey` | `string` | **Yes** | - |
| `version` | `string` | No | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/prompt/submit' -d "namespaceId=namespaceId&promptKey=promptKey&version=version"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.16. Get Prompt Version Detail
#### Description
This interface retrieves details of a specified Prompt version.

#### Since

`3.2.1`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ai/prompt/version`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `promptKey` | `string` | **Yes** | - |
| `version` | `string` | No | - |

#### Response Data

| Name | Type | Description |
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

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/prompt/version?namespaceId=public&promptKey=my-prompt&version=1.0.0'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.17. Download Prompt Version
#### Description
This interface downloads a specified Prompt version as a Markdown file.

#### Since

`3.2.2`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ai/prompt/version/download`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `promptKey` | `string` | **Yes** | - |
| `version` | `string` | No | - |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/prompt/version/download?namespaceId=public&promptKey=my-prompt&version=1.0.0'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 6.18. List Prompt Versions
#### Description
This interface allows listing versions of a specific Prompt with pagination.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ai/prompt/versions`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `promptKey` | `string` | **Yes** | - |
| `pageNo` | `integer` | **Yes** | - |
| `pageSize` | `integer` | **Yes** | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/prompt/versions?namespaceId=public&promptKey=my-prompt&pageNo=1&pageSize=10'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

## 7. Skills Management

Skills Management APIs provide query, draft, publish, online/offline, version management, and ZIP upload capabilities for Skills.

### 7.1. Get Skill Details
#### Description
This interface allows retrieving detailed information of a specific Skill hosted on Nacos.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ai/skills`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `skillName` | `string` | **Yes** | - |
| `version` | `string` | No | - |

#### Response Data

| Name | Type | Description |
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

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/skills?namespaceId=public&skillName=my-skill&version=1.0.0'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.2. Delete Skill
#### Description
This interface allows deleting a Skill hosted on Nacos.

#### Since

`3.2.0`

#### Request Method

`DELETE`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/skills`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `skillName` | `string` | **Yes** | - |
| `version` | `string` | No | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X DELETE 'http://127.0.0.1:8080/v3/console/ai/skills?namespaceId=public&skillName=my-skill&version=1.0.0'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.3. Update Skill Business Tags
#### Description
This interface allows updating the business tag list of a skill without changing version status.

#### Since

`3.2.0`

#### Request Method

`PUT`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/skills/biz-tags`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `skillName` | `string` | **Yes** | - |
| `bizTags` | `string` | **Yes** | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/skills/biz-tags' -d "namespaceId=public&skillName=my-skill&bizTags=bizTags"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.4. Create Skill Draft Version
#### Description
This interface allows creating a draft version based on an existing version or a brand-new SkillCard.

#### Since

`3.2.0`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/skills/draft`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `skillName` | `string` | No | - |
| `basedOnVersion` | `string` | No | - |
| `targetVersion` | `string` | No | - |
| `skillCard` | `string` | No | Skill card JSON; required if basedOnVersion is not set |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/skills/draft' -d "namespaceId=public&skillName=my-skill&basedOnVersion=basedOnVersion&targetVersion=targetVersion&skillCard=skillCard"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.5. Update Skill Draft Content
#### Description
This interface allows updating the SkillCard content of the current draft version.

#### Since

`3.2.0`

#### Request Method

`PUT`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/skills/draft`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `skillName` | `string` | **Yes** | - |
| `skillCard` | `string` | **Yes** | Skill card JSON string containing complete Skill information |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/skills/draft' -d "namespaceId=public&skillName=my-skill&skillCard=skillCard"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.6. Delete Skill Draft Version
#### Description
This interface allows deleting the current draft version of a specified skill.

#### Since

`3.2.0`

#### Request Method

`DELETE`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/skills/draft`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `skillName` | `string` | **Yes** | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X DELETE 'http://127.0.0.1:8080/v3/console/ai/skills/draft?namespaceId=public&skillName=my-skill'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.7. Force Publish Skill Version
#### Description
This interface force-publishes a Skill version by bypassing pipeline validation.

#### Since

`3.2.1`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/skills/force-publish`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `skillName` | `string` | **Yes** | - |
| `version` | `string` | **Yes** | - |
| `updateLatestLabel` | `boolean` | No | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/skills/force-publish' -d "namespaceId=public&skillName=my-skill&version=version&updateLatestLabel=updateLatestLabel"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.8. Update Skill Version Labels
#### Description
This interface allows updating skill version routing labels (e.g. latest label) without changing version status.

#### Since

`3.2.0`

#### Request Method

`PUT`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/skills/labels`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `skillName` | `string` | **Yes** | - |
| `labels` | `string` | **Yes** | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/skills/labels' -d "namespaceId=public&skillName=my-skill&labels=labels"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.9. List Skills
#### Description
This interface allows querying the list of Skills hosted on Nacos.

#### Since

`3.2.1`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ai/skills/list`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `filterableForm` | `string` | **Yes** | - |
| `pageNo` | `integer` | **Yes** | - |
| `pageSize` | `integer` | **Yes** | - |
| `namespaceId` | `string` | No | - |
| `skillName` | `string` | No | - |
| `search` | `string` | No | blur or accurate |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/skills/list?filterableForm=true&pageNo=1&pageSize=10&namespaceId=public&skillName=my-skill&search=blur'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.10. Offline Skill
#### Description
This interface allows executing an offline operation on a specific version or the entire skill, making it not callable.

#### Since

`3.2.0`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/skills/offline`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `skillName` | `string` | **Yes** | - |
| `scope` | `string` | No | Use 'skill' for skill-level offline; otherwise version-level |
| `version` | `string` | No | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/skills/offline' -d "namespaceId=public&skillName=my-skill&scope=scope&version=version"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.11. Online Skill
#### Description
This interface allows executing an online operation on a specific version or the entire skill, making it callable.

#### Since

`3.2.0`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/skills/online`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `skillName` | `string` | **Yes** | - |
| `scope` | `string` | No | Use 'skill' for skill-level online; otherwise version-level |
| `version` | `string` | No | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/skills/online' -d "namespaceId=public&skillName=my-skill&scope=scope&version=version"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.12. Publish Skill Version
#### Description
This interface allows publishing an approved skill version.

#### Since

`3.2.0`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/skills/publish`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `skillName` | `string` | **Yes** | - |
| `version` | `string` | **Yes** | - |
| `updateLatestLabel` | `boolean` | No | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/skills/publish' -d "namespaceId=public&skillName=my-skill&version=version&updateLatestLabel=updateLatestLabel"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.13. Redraft Skill Version
#### Description
This interface transitions a reviewed Skill version back to draft.

#### Since

`3.2.2`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/skills/redraft`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `skillName` | `string` | **Yes** | - |
| `version` | `string` | **Yes** | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/skills/redraft' -d "namespaceId=public&skillName=my-skill&version=version"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.14. Update Skill Visibility Scope
#### Description
This interface allows setting the visibility scope of a skill to PUBLIC or PRIVATE.

#### Since

`3.2.0`

#### Request Method

`PUT`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/skills/scope`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `skillName` | `string` | **Yes** | - |
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
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/skills/scope' -d "namespaceId=public&skillName=my-skill&scope=scope"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.15. Submit Skill Version for Review
#### Description
This interface allows submitting a skill draft version to the pipeline for review.

#### Since

`3.2.0`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/skills/submit`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `skillName` | `string` | **Yes** | - |
| `version` | `string` | No | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/skills/submit' -d "namespaceId=public&skillName=my-skill&version=version"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.16. Upload Skill (ZIP)
#### Description
This interface allows uploading a Skill from a ZIP file.

#### Since

`3.2.2`

#### Request Method

`POST`

Request body type: `multipart/form-data` (for example, file upload). Use `-F` or `-H 'Content-Type: multipart/form-data'` in request examples.

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/skills/upload`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `overwrite` | `boolean` | No | - |
| `targetVersion` | `string` | No | - |
| `commitMsg` | `string` | No | - |

| Name | Type | Required | Description |
|--------|------|------|----------|
| `file` | `file` | No | ZIP file containing skill |
| `overwrite` | `boolean` | No | - |
| `namespaceId` | `string` | No | - |
| `targetVersion` | `string` | No | - |
| `commitMsg` | `string` | No | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/skills/upload?namespaceId=public&overwrite=false&targetVersion=1.0.0&commitMsg=init' -F "file=@/path/to/skill.zip" -F "overwrite=false" -F "namespaceId=public" -F "targetVersion=1.0.0" -F "commitMsg=init"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.17. Batch Upload Skills
#### Description
This interface uploads multiple Skills from a ZIP file that contains one-level Skill subdirectories.

#### Since

`3.2.2`

#### Request Method

`POST`

Request body type: `multipart/form-data` (for example, file upload). Use `-F` or `-H 'Content-Type: multipart/form-data'` in request examples.

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/skills/upload/batch`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `overwrite` | `boolean` | No | - |

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `overwrite` | `boolean` | No | - |
| `file` | `file` | No | ZIP file containing skill directories |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data.succeeded | `array` | - |
| data.data.failed | `array` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/skills/upload/batch?namespaceId=public&overwrite=false' -F "namespaceId=public" -F "overwrite=false" -F "file=@/path/to/skills.zip"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.18. Get Skill Version Detail
#### Description
This interface allows querying the detail of a specific Skill version by namespace, skill name, and version number.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ai/skills/version`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `skillName` | `string` | **Yes** | - |
| `version` | `string` | No | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data.namespaceId | `string` | - |
| data.data.name | `string` | - |
| data.data.description | `string` | - |
| data.data.skillMd | `string` | - |
| data.data.resource | `object` | - |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/skills/version?namespaceId=public&skillName=my-skill&version=1.0.0'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 7.19. Download Skill Version ZIP
#### Description
This interface allows downloading the ZIP package of a specific Skill version.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ai/skills/version/download`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `skillName` | `string` | **Yes** | - |
| `version` | `string` | No | - |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/skills/version/download?namespaceId=public&skillName=my-skill&version=1.0.0'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

## 8. AgentSpec Management

AgentSpec Management APIs provide query, draft, publish, online/offline, version management, and ZIP upload capabilities for AgentSpecs.

### 8.1. Get AgentSpec
#### Description
This interface allows getting the latest published version of an AgentSpec by namespace and name.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ai/agentspecs`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `agentSpecName` | `string` | **Yes** | - |
| `version` | `string` | No | - |

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
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/agentspecs?namespaceId=public&agentSpecName=my-agent&version=1.0.0'
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

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/agentspecs`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `agentSpecName` | `string` | **Yes** | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X DELETE 'http://127.0.0.1:8080/v3/console/ai/agentspecs?namespaceId=public&agentSpecName=my-agent'
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

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/agentspecs/biz-tags`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `agentSpecName` | `string` | **Yes** | - |
| `bizTags` | `string` | **Yes** | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/agentspecs/biz-tags' -d "namespaceId=public&agentSpecName=my-agent&bizTags=bizTags"
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

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/agentspecs/draft`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `agentSpecName` | `string` | **Yes** | - |
| `basedOnVersion` | `string` | No | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agentspecs/draft' -d "namespaceId=public&agentSpecName=my-agent&basedOnVersion=basedOnVersion"
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

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/agentspecs/draft`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `agentSpecName` | `string` | No | - |
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
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/agentspecs/draft' -d "namespaceId=public&agentSpecName=my-agent&agentSpecCard=agentSpecCard"
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

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/agentspecs/draft`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `agentSpecName` | `string` | **Yes** | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X DELETE 'http://127.0.0.1:8080/v3/console/ai/agentspecs/draft?namespaceId=public&agentSpecName=my-agent'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 8.7. Force Publish AgentSpec Version
#### Description
This interface force-publishes an AgentSpec version by bypassing pipeline validation.

#### Since

`3.2.1`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/agentspecs/force-publish`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `agentSpecName` | `string` | **Yes** | - |
| `version` | `string` | **Yes** | - |
| `updateLatestLabel` | `boolean` | No | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agentspecs/force-publish' -d "namespaceId=public&agentSpecName=my-agent&version=version&updateLatestLabel=updateLatestLabel"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 8.8. Update AgentSpec Version Labels
#### Description
This interface allows updating AgentSpec version routing labels (e.g. latest label) without changing version status.

#### Since

`3.2.0`

#### Request Method

`PUT`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/agentspecs/labels`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `agentSpecName` | `string` | **Yes** | - |
| `labels` | `string` | **Yes** | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/agentspecs/labels' -d "namespaceId=public&agentSpecName=my-agent&labels=labels"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 8.9. List AgentSpecs
#### Description
This interface allows paginated listing of AgentSpecs by namespace and name.

#### Since

`3.2.1`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ai/agentspecs/list`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `filterableForm` | `string` | **Yes** | - |
| `pageNo` | `integer` | **Yes** | - |
| `pageSize` | `integer` | **Yes** | - |
| `namespaceId` | `string` | No | - |
| `agentSpecName` | `string` | No | - |
| `search` | `string` | No | Search mode: accurate or blur |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/agentspecs/list?filterableForm=true&pageNo=1&pageSize=10&namespaceId=public&agentSpecName=my-agent&search=blur'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 8.10. Offline AgentSpec
#### Description
This interface allows executing an offline operation on a specific version or the entire AgentSpec, making it not callable.

#### Since

`3.2.0`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/agentspecs/offline`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `agentSpecName` | `string` | **Yes** | - |
| `scope` | `string` | No | Use 'agentspec' for agentspec-level offline; otherwise version-level |
| `version` | `string` | No | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agentspecs/offline' -d "namespaceId=public&agentSpecName=my-agent&scope=scope&version=version"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 8.11. Online AgentSpec
#### Description
This interface allows executing an online operation on a specific version or the entire AgentSpec, making it callable.

#### Since

`3.2.0`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/agentspecs/online`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `agentSpecName` | `string` | **Yes** | - |
| `scope` | `string` | No | Use 'agentspec' for agentspec-level online; otherwise version-level |
| `version` | `string` | No | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agentspecs/online' -d "namespaceId=public&agentSpecName=my-agent&scope=scope&version=version"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 8.12. Publish AgentSpec Version
#### Description
This interface allows publishing an approved AgentSpec version.

#### Since

`3.2.0`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/agentspecs/publish`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `agentSpecName` | `string` | **Yes** | - |
| `version` | `string` | **Yes** | - |
| `updateLatestLabel` | `boolean` | No | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agentspecs/publish' -d "namespaceId=public&agentSpecName=my-agent&version=version&updateLatestLabel=updateLatestLabel"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 8.13. Redraft AgentSpec Version
#### Description
This interface transitions a reviewed AgentSpec version back to draft.

#### Since

`3.2.2`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/agentspecs/redraft`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `agentSpecName` | `string` | **Yes** | - |
| `version` | `string` | **Yes** | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agentspecs/redraft' -d "namespaceId=public&agentSpecName=my-agent&version=version"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 8.14. Update AgentSpec Visibility Scope
#### Description
This interface allows setting the visibility scope of an AgentSpec to PUBLIC or PRIVATE.

#### Since

`3.2.0`

#### Request Method

`PUT`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/agentspecs/scope`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `agentSpecName` | `string` | **Yes** | - |
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
curl -X PUT 'http://127.0.0.1:8080/v3/console/ai/agentspecs/scope' -d "namespaceId=public&agentSpecName=my-agent&scope=scope"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 8.15. Submit AgentSpec Version for Review
#### Description
This interface allows submitting an AgentSpec draft version to the pipeline for review.

#### Since

`3.2.0`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/agentspecs/submit`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `agentSpecName` | `string` | **Yes** | - |
| `version` | `string` | No | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agentspecs/submit' -d "namespaceId=public&agentSpecName=my-agent&version=version"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 8.16. Upload AgentSpec
#### Description
This interface allows uploading a ZIP-packaged AgentSpec; the package is parsed and the AgentSpec is created or updated.

#### Since

`3.2.0`

#### Request Method

`POST`

Request body type: `multipart/form-data` (for example, file upload). Use `-F` or `-H 'Content-Type: multipart/form-data'` in request examples.

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/agentspecs/upload`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `overwrite` | `boolean` | No | - |

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `overwrite` | `boolean` | No | - |
| `file` | `file` | No | ZIP file containing agentspec package |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/agentspecs/upload?namespaceId=public&overwrite=false' -F "namespaceId=public" -F "overwrite=false" -F "file=@/path/to/skills.zip"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 8.17. Get AgentSpec Version
#### Description
This interface allows getting a specific version of an AgentSpec by namespace, name, and version.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ai/agentspecs/version`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `agentSpecName` | `string` | **Yes** | - |
| `version` | `string` | No | - |

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
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/agentspecs/version?namespaceId=public&agentSpecName=my-agent&version=1.0.0'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

## 9. Pipeline Management

Pipeline Management APIs provide capabilities to query Pipeline execution record lists, details, and instances.

### 9.1. List Pipeline Executions
#### Description
This interface allows paginated listing of Pipeline execution records by resource type, name, namespace, and version.

#### Since

`3.2.1`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ai/pipelines`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `resourceType` | `string` | **Yes** | - |
| `resourceName` | `string` | No | - |
| `namespaceId` | `string` | No | - |
| `version` | `string` | No | - |
| `pageNo` | `integer` | **Yes** | - |
| `pageSize` | `integer` | **Yes** | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/pipelines?resourceType=skill&resourceName=my-skill&namespaceId=public&version=1.0.0&pageNo=1&pageSize=10'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 9.2. Get Pipeline Execution
#### Description
This interface allows retrieving a Pipeline execution record by pipeline ID.

#### Since

`3.2.1`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ai/pipelines/detail`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `pipelineId` | `string` | **Yes** | - |

#### Response Data

| Name | Type | Description |
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

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/pipelines/detail?pipelineId=pipeline-001'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 9.3. List Pipeline Executions
#### Description
This interface allows paginated listing of Pipeline execution records by resource type, name, namespace, and version.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ai/pipelines/list`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `resourceType` | `string` | **Yes** | - |
| `resourceName` | `string` | No | - |
| `namespaceId` | `string` | No | - |
| `version` | `string` | No | - |
| `pageNo` | `integer` | **Yes** | - |
| `pageSize` | `integer` | **Yes** | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `string` | - |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/pipelines/list?resourceType=skill&resourceName=my-skill&namespaceId=public&version=1.0.0&pageNo=1&pageSize=10'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 9.4. Get Pipeline Execution
#### Description
This interface allows retrieving a Pipeline execution record by pipeline ID.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ai/pipelines/{pipelineId}`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `pipelineId` | `string` | **Yes** | - |

#### Response Data

| Name | Type | Description |
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

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/pipelines/{pipelineId}'
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

AI Resource Import APIs provide query, search, validation, and execution capabilities for external AI resource import sources.

### 10.1. Execute AI Resource Import
#### Description
This interface imports selected external AI resources.

#### Since

`3.2.2`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/import/execute`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `resourceType` | `string` | **Yes** | - |
| `sourceId` | `string` | **Yes** | - |
| `selectedItems` | `string` | **Yes** | - |
| `overwriteExisting` | `boolean` | No | - |
| `skipInvalid` | `boolean` | No | - |
| `validationToken` | `string` | No | - |
| `options` | `string` | No | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data.success | `boolean` | - |
| data.data.totalCount | `integer` | - |
| data.data.successCount | `integer` | - |
| data.data.failedCount | `integer` | - |
| data.data.skippedCount | `integer` | - |
| data.data.results | `array` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/import/execute' -d "namespaceId=namespaceId&resourceType=resourceType&sourceId=sourceId&selectedItems=selectedItems&overwriteExisting=overwriteExisting&skipInvalid=skipInvalid&validationToken=validationToken&options=options"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 10.2. Search External AI Resources
#### Description
This interface searches importable external AI resources from a specified source.

#### Since

`3.2.2`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/import/search`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `resourceType` | `string` | **Yes** | - |
| `sourceId` | `string` | **Yes** | - |
| `query` | `string` | No | - |
| `cursor` | `string` | No | - |
| `limit` | `integer` | No | - |
| `options` | `string` | No | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data.sourceId | `string` | - |
| data.data.resourceType | `string` | - |
| data.data.nextCursor | `string` | - |
| data.data.hasMore | `boolean` | - |
| data.data.items | `array` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/import/search' -d "namespaceId=namespaceId&resourceType=resourceType&sourceId=sourceId&query=query&cursor=cursor&limit=limit&options=options"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 10.3. List AI Resource Import Sources
#### Description
This interface lists configured AI resource import sources.

#### Since

`3.2.2`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/ai/import/sources`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `resourceType` | `string` | No | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data | `array` | - |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/ai/import/sources?resourceType=skill'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```


### 10.4. Validate AI Resource Import Items
#### Description
This interface validates selected external AI resources before import.

#### Since

`3.2.2`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/ai/import/validate`

#### Request Parameters

| Name | Type | Required | Description |
|--------|------|------|----------|
| `namespaceId` | `string` | No | - |
| `resourceType` | `string` | **Yes** | - |
| `sourceId` | `string` | **Yes** | - |
| `selectedItems` | `string` | **Yes** | - |
| `overwriteExisting` | `boolean` | No | - |
| `options` | `string` | No | - |

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.code | `integer` | - |
| data.message | `string` | - |
| data.data.sourceId | `string` | - |
| data.data.resourceType | `string` | - |
| data.data.validationToken | `string` | - |
| data.data.items | `array` | - |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/ai/import/validate' -d "namespaceId=namespaceId&resourceType=resourceType&sourceId=sourceId&selectedItems=selectedItems&overwriteExisting=overwriteExisting&options=options"
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

## 11. Copilot

Copilot-related APIs provide configuration retrieval and saving, Prompt debugging and optimization, Skill generation and optimization, and other capabilities. Some APIs return SSE streams.

### 11.1. Get Copilot Configuration

#### Description

Get the current Copilot configuration. Only `apiKey`, `model`, `studioUrl`, and `studioProject` are returned.

#### Since

`3.2.0`

#### Request Method

`GET`

#### Authorization

A user identity with the corresponding `namespace read` permission is required.

#### Request URL

`/v3/console/copilot/config`

#### Request Parameters

None

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data.enabled | `boolean` | whether the Copilot feature is enabled. |
| data.defaultNamespace | `string` | default namespace ID. |
| data.apiKey | `string` | API key used to call external services such as large models. Whether it is masked or returned as raw text depends on the implementation. |
| data.model | `string` | default model identifier. |
| data.studioUrl | `string` | associated Studio service address. |
| data.studioProject | `string` | associated Studio project identifier. |

#### Examples

* Request example

```shell
curl -X GET 'http://127.0.0.1:8080/v3/console/copilot/config'
```

* Response example

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

### 11.2. Save Copilot Configuration

#### Description

Create or update the Copilot configuration. Only `apiKey`, `model`, `studioUrl`, and `studioProject` are accepted. Other fields use `Default`.

#### Since

`3.2.0`

#### Request Method

`POST`

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/copilot/config`

#### Request Parameters

None. The request body can contain fields such as `apiKey`, `model`, `studioUrl`, and `studioProject`; use the actual API behavior as the source of truth.

#### Response Data

| Name | Type | Description |
|--------|----------|------|
| data | `boolean` | whether saving succeeded. |

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/copilot/config'
```

* Response example

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### 11.3. Stream Prompt Debugging

#### Description

You can use this API to stream-debug a Prompt with user input and return model responses as an SSE stream.

#### Since

`3.2.0`

#### Request Method

`POST`

Request body type: `application/json`.

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/copilot/prompt/debug`

#### Request Parameters

| Name       | Type     | Required | Description     |
|-----------|--------|----|----------|
| `userInput` | `string` | No | user input content. |
| `prompt`    | `string` | No | Prompt to debug. |

#### Response Data

None. The response is returned as an SSE stream.

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/copilot/prompt/debug' -H 'Content-Type: application/json' -d '{"userInput":"","prompt":""}'
```

* Response example

```json
{}
```

### 11.4. Stream Prompt Optimization

#### Description

You can use this API to stream-optimize a Prompt and return an SSE stream.

#### Since

`3.2.0`

#### Request Method

`POST`

Request body type: `application/json`.

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/copilot/prompt/optimize`

#### Request Parameters

| Name              | Type     | Required | Description        |
|------------------|--------|----|-------------|
| `optimizationGoal` | `string` | No | optimization goal.       |
| `prompt`           | `string` | No | Prompt to optimize. |

#### Response Data

None. The response is returned as an SSE stream.

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/copilot/prompt/optimize' -H 'Content-Type: application/json' -d '{"optimizationGoal":"","prompt":""}'
```

* Response example

```json
{}
```

### 11.5. Stream Skill Generation

#### Description

You can use this API to stream-generate a Skill based on background information and return an SSE stream.

#### Since

`3.2.0`

#### Request Method

`POST`

Request body type: `application/json`.

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/copilot/skill/generate`

#### Request Parameters

| Name                | Type     | Required | Description           |
|--------------------|--------|----|----------------|
| `backgroundInfo`     | `string` | No | background information.           |
| `selectedMcpTools`   | `array` | No | selected MCP tools.      |
| `conversationHistory` | `object` | No | conversation history.           |

#### Response Data

None. The response is returned as an SSE stream.

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/copilot/skill/generate' -H 'Content-Type: application/json' -d '{"backgroundInfo":"","selectedMcpTools":"","conversationHistory":""}'
```

* Response example

```json
{}
```

### 11.6. Stream Skill Optimization

#### Description

You can use this API to stream-optimize a Skill based on a target and conversation history, and return an SSE stream.

#### Since

`3.2.0`

#### Request Method

`POST`

Request body type: `application/json`.

#### Authorization

A user identity with the corresponding `namespace write` permission is required.

#### Request URL

`/v3/console/copilot/skill/optimize`

#### Request Parameters

| Name                | Type     | Required | Description           |
|--------------------|--------|----|----------------|
| `conversationHistory` | `object` | No | conversation history.           |
| `targetFileName`      | `string` | No | target file name.          |
| `optimizationGoal`    | `string` | No | optimization goal.           |
| `skill`               | `string` | No | Skill content to optimize.   |
| `selectedMcpTools`   | `array` | No | selected MCP tools.      |

#### Response Data

None. The response is returned as an SSE stream.

#### Examples

* Request example

```shell
curl -X POST 'http://127.0.0.1:8080/v3/console/copilot/skill/optimize' -H 'Content-Type: application/json' -d '{"conversationHistory":"","targetFileName":"","optimizationGoal":"","skill":"","selectedMcpTools":""}'
```

* Response example

```json
{}
```
