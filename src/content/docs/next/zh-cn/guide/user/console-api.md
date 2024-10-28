---
title: Console API 指南
keywords: [Console API,指南]
description: Console API 指南
sidebar:
    order: 8
---

# Console API 指南


- 文档规定
  - [API 统一返回体格式](#0.1)
  - [API 错误码汇总](#0.2)

- 配置管理
  - [获取配置详情](#1.1)
  - [发布或更新配置](#1.2)
  - [删除配置](#1.3)
  - [批量删除配置](#1.4)
  - [查询配置列表](#1.5)
  - [按配置内容搜索配置列表](#1.6)
  - [查询配置监听客户端信息](#1.7)
  - [查询订阅客户端信息（根据IP）](#1.8)
  - [导出配置](#1.9)
  - [导入配置](#1.10)
  - [克隆配置](#1.11)
  - [查询历史版本](#1.13)
  - [查询历史版本详情](#1.14)
  - [查询配置上一版本信息](#1.15)
  - [根据命名空间查询配置列表](#1.16)

- 服务管理
  - [创建服务](#2.1)
  - [删除服务](#2.2)
  - [更新服务](#2.3)
  - [获取选择器类型列表](#2.4)
  - [查询订阅者列表](#2.5)
  - [查询服务列表](#2.6)
  - [查询服务详情](#2.7)
  - [更新集群](#2.8)
  - [查询实例列表](#2.9)
  - [更新实例](#2.10)

- 命名空间
  - [查询命名空间列表](#3.1)
  - [查询命名空间详情](#3.2)
  - [创建命名空间](#3.3)
  - [更新命名空间](#3.4)
  - [删除命名空间](#3.5)
  - [检查命名空间 ID 是否存在](#3.6)

- 集群管理
  - [查询集群节点列表](#4.1)



## 文档规定

<h2 id="0.1">API 统一返回体格式</h2>

3.0版本Console API，所有接口请求的响应均为`json`类型的返回体，返回体具有相同的格式

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

返回体中各字段的含义如下表所示

|   名称    |   类型   | 描述                                                   |
| :-------: | :------: | ------------------------------------------------------ |
|  `code `  |  `int`   | 错误码，`0`代表执行成功，非`0`代表执行失败的某一种情况 |
| `message` | `String` | 错误码提示信息，执行成功为"`success`"                  |
|  `data`   | 任意类型 | 返回数据，执行失败时为详细出错信息                     |

<h2 id="0.2">API 错误码汇总</h2>

### 示例

API接口返回体中的错误码及对应提示信息汇总见下表

| 错误码  | 提示信息                     | 含义                       |
| ------- | ---------------------------- | -------------------------- |
| `0`     | `success`                    | 成功执行                   |
| `400`    | `Bad Request`              | 请求参数错误   |
| `401`    | `Unauthorized`             | 未授权         |
| `403`    | `Forbidden`                | 没有权限       |
| `404`    | `Not Found`                | 资源未找到     |
| `500`    | `Internal Server Error`    | 服务器内部错误 |
| `10000` | `parameter missing`          | 参数缺失                   |
| `10001` | `access denied`              | 访问拒绝                   |
| `10002` | `data access error`          | 数据访问错误               |
| `20001` | `'tenant' parameter error`   | `tenant`参数错误           |
| `20002` | `parameter validate error`   | 参数验证错误               |
| `20003` | `MediaType Error`            | 请求的`MediaType`错误      |
| `20004` | `resource not found`         | 资源未找到                 |
| `20005` | `resource conflict`          | 资源访问冲突               |
| `20006` | `config listener is null`    | 监听配置为空               |
| `20007` | `config listener error`      | 监听配置错误               |
| `20008` | `invalid dataId`             | 无效的`dataId`（鉴权失败） |
| `20009` | `parameter mismatch`         | 请求参数不匹配             |
| `21000` | `service name error`         | `serviceName`服务名错误    |
| `21001` | `weight error`               | `weight`权重参数错误       |
| `21002` | `instance metadata error`    | 实例`metadata`元数据错误   |
| `21003` | `instance not found`         | `instance`实例不存在       |
| `21004` | `instance error`             | `instance`实例信息错误     |
| `21005` | `service metadata error`     | 服务`metadata`元数据错误   |
| `21006` | `selector error`             | 访问策略`selector`错误     |
| `21007` | `service already exist`      | 服务已存在                 |
| `21008` | `service not exist`          | 服务不存在                 |
| `21009` | `service delete failure`     | 存在服务实例，服务删除失败 |
| `21010` | `healthy param miss`         | `healthy`参数缺失          |
| `21011` | `health check still running` | 健康检查仍在运行           |
| `22000` | `illegal namespace`          | 命名空间`namespace`不合法  |
| `22001` | `namespace not exist`        | 命名空间不存在             |
| `22002` | `namespace already exist`    | 命名空间已存在             |
| `23000` | `illegal state`              | 状态`state`不合法          |
| `23001` | `node info error`            | 节点信息错误               |
| `23002` | `node down failure`          | 节点离线操作出错           |
| ...     | ...                          | ...                        |
| 30000   | `server error`               | 其他内部错误               |

## 配置管理

<h2 id="1.1">获取配置详情</h2>

### 接口描述

获取指定的配置信息详情。

### 请求方式

`GET`

### 请求URL

`/v3/console/cs/config`

### 请求参数

| 参数名        | 类型     | 必填   | 参数描述                            |
| ------------- | -------- | ------ | ----------------------------------- |
| `namespaceId` | `String` | 否     | 命名空间，默认为`public`与 `''`相同 |
| `group`       | `String` | **是** | 配置分组名                          |
| `dataId`      | `String` | **是** | 配置名                              |

### 返回数据

| 参数名 | 参数类型        | 描述               |
| ------ | --------------- | ------------------ |
| `data` | `ConfigAllInfo` | 配置的详细信息对象 |

`ConfigAllInfo`对象包含以下字段：

| 字段名             | 类型     | 描述          |
| ------------------ | -------- | ------------- |
| `dataId`           | `String` | 配置名        |
| `group`            | `String` | 配置分组名    |
| `content`          | `String` | 配置内容      |
| `appName`          | `String` | 应用名        |
| `md5`              | `String` | 配置内容的MD5 |
| `type`             | `String` | 配置类型      |
| `tags`             | `String` | 配置标签      |
| `namespaceId`      | `String` | 命名空间ID    |
| `configTags`       | `String` | 配置标签列表  |
| `desc`             | `String` | 配置描述      |
| `schema`           | `String` | 配置的Schema  |
| `lastModifiedTime` | `String` | 上次修改时间  |

### 示例

* 请求示例

  ```shell
  curl -X GET 'http://127.0.0.1:8848/v3/console/cs/config?dataId=nacos.example&group=DEFAULT_GROUP&namespaceId=public'
  ```

* 返回示例

  ```json
  {
    "code": 0,
    "message": "success",
    "data": {
      "dataId": "nacos.example",
      "group": "DEFAULT_GROUP",
      "content": "配置内容",
      "appName": "示例应用",
      "md5": "9f67e6977b100e00cab385a75597db58",
      "type": "yaml",
      "tags": "tag1,tag2",
      "namespaceId": "public",
      "configTags": "tag1,tag2",
      "desc": "配置描述",
      "schema": "",
      "lastModifiedTime": "2023-12-05T01:48:03.380+0000"
    }
  }
  ```

<h2 id="1.2">发布或更新配置</h2>

### 接口描述

添加或更新配置。

### 请求方式

`POST`

`Content-Type:application/x-www-form-urlencoded`

### 请求URL

`/v3/console/cs/config`

### 请求Body

| 参数名        | 类型     | 必填   | 参数描述                             |
| ------------- | -------- | ------ | ------------------------------------ |
| `namespaceId` | `String` | 否     | 命名空间，默认为`public`与 `''`相同  |
| `group`       | `String` | **是** | 配置组名                             |
| `dataId`      | `String` | **是** | 配置名                               |
| `content`     | `String` | **是** | 配置内容                             |
| `type`        | `String` | 否     | 配置类型，例如`yaml`、`properties`等 |
| `appName`     | `String` | 否     | 应用名                               |
| `tag`         | `String` | 否     | 配置标签                             |
| `desc`        | `String` | 否     | 配置描述                             |
| `srcUser`     | `String` | 否     | 源用户                               |
| `configTags`  | `String` | 否     | 配置标签列表，多个标签用逗号分隔     |

### 返回数据

| 参数名 | 参数类型  | 描述         |
| ------ | --------- | ------------ |
| `data` | `boolean` | 是否执行成功 |

### 示例

* 请求示例

  ```shell
  curl -d 'dataId=nacos.example' \
    -d 'group=DEFAULT_GROUP' \
    -d 'namespaceId=public' \
    -d 'content=配置内容' \
    -d 'type=yaml' \
    -X POST 'http://127.0.0.1:8848/v3/console/cs/config'
  ```

* 返回示例

  ```json
  {
    "code": 0,
    "message": "success",
    "data": true
  }
  ```

<h2 id="1.3">删除配置</h2>

### 接口描述

删除指定的配置。

### 请求方式

`DELETE`

### 请求URL

`/v3/console/cs/config`

### 请求参数

| 参数名        | 类型     | 必填   | 参数描述                            |
| ------------- | -------- | ------ | ----------------------------------- |
| `namespaceId` | `String` | 否     | 命名空间，默认为`public`与 `''`相同 |
| `group`       | `String` | **是** | 配置分组名                          |
| `dataId`      | `String` | **是** | 配置名                              |
| `tag`         | `String` | 否     | 配置标签                            |

### 返回数据

| 参数名 | 参数类型  | 描述         |
| ------ | --------- | ------------ |
| `data` | `boolean` | 是否执行成功 |

### 示例

* 请求示例

  ```shell
  curl -X DELETE 'http://127.0.0.1:8848/v3/console/cs/config?dataId=nacos.example&group=DEFAULT_GROUP&namespaceId=public'
  ```

* 返回示例

  ```json
  {
    "code": 0,
    "message": "success",
    "data": true
  }
  ```

<h2 id="1.4">批量删除配置</h2>

### 接口描述

批量删除指定的配置。

### 请求方式

`DELETE`

### 请求URL

`/v3/console/cs/config/batchDelete`

### 请求参数

| 参数名 | 类型     | 必填   | 参数描述   |
| ------ | -------- | ------ | ---------- |
| `ids`  | `Long[]` | **是** | 配置ID列表 |

### 返回数据

| 参数名 | 参数类型  | 描述         |
| ------ | --------- | ------------ |
| `data` | `boolean` | 是否执行成功 |

### 示例

* 请求示例

  ```shell
  curl -X DELETE 'http://127.0.0.1:8848/v3/console/cs/config/batchDelete?ids=1&ids=2&ids=3'
  ```

* 返回示例

  ```json
  {
    "code": 0,
    "message": "success",
    "data": true
  }
  ```

<h2 id="1.5">查询配置列表</h2>

### 接口描述

获取配置列表信息。

### 请求方式

`GET`

### 请求URL

`/v3/console/cs/config/list`

### 请求参数

| 参数名        | 类型     | 必填   | 参数描述                            |
| ------------- | -------- | ------ | ----------------------------------- |
| `namespaceId` | `String` | 否     | 命名空间，默认为`public`与 `''`相同 |
| `group`       | `String` | 否     | 配置分组名                          |
| `dataId`      | `String` | 否     | 配置名                              |
| `config_tags` | `String` | 否     | 配置标签，多个标签用逗号分隔        |
| `appName`     | `String` | 否     | 应用名                              |
| `pageNo`      | `int`    | **是** | 页码，从1开始                       |
| `pageSize`    | `int`    | **是** | 每页显示数量，最大值为500           |

### 返回数据

| 参数名                | 参数类型   | 描述说明                                  |
| --------------------- | ---------- | ----------------------------------------- |
| `data`                | `Object`   | 分页查询结果                              |
| `data.totalCount`     | `int`      | 总数                                      |
| `data.pageNumber`     | `int`      | 当前页                                    |
| `data.pagesAvailable` | `int`      | 总页数                                    |
| `data.pageItems`      | `Object[]` | 配置项列表，参见[配置项信息](#ConfigInfo) |

<h3 id="ConfigInfo">配置项信息</h3>

| 参数名             | 参数类型 | 描述         |
| ------------------ | -------- | ------------ |
| `id`               | `Long`   | 配置ID       |
| `dataId`           | `String` | 配置名       |
| `group`            | `String` | 配置分组     |
| `content`          | `String` | 配置内容     |
| `md5`              | `String` | 配置内容MD5  |
| `type`             | `String` | 配置类型     |
| `appName`          | `String` | 应用名       |
| `desc`             | `String` | 配置描述     |
| `tags`             | `String` | 配置标签     |
| `encryptedDataKey` | `String` | 加密数据密钥 |
| `lastModifiedTime` | `String` | 上次修改时间 |

### 示例

* 请求示例

  ```shell
  curl -X GET 'http://127.0.0.1:8848/v3/console/cs/config/list?pageNo=1&pageSize=10&namespaceId=public'
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
          "id": 1,
          "dataId": "nacos.example",
          "group": "DEFAULT_GROUP",
          "content": "配置内容",
          "md5": "9f67e6977b100e00cab385a75597db58",
          "type": "yaml",
          "appName": "示例应用",
          "desc": "配置描述",
          "tags": "tag1,tag2",
          "encryptedDataKey": null,
          "lastModifiedTime": "2023-12-05T01:48:03.380+0000"
        }
      ]
    }
  }
  ```

<h2 id="1.6">按配置内容搜索配置列表</h2>

### 接口描述

根据配置内容搜索配置列表。

### 请求方式

`GET`

### 请求URL

`/v3/console/cs/config/searchDetail`

### 请求参数

| 参数名          | 类型     | 必填   | 参数描述                            |
| --------------- | -------- | ------ | ----------------------------------- |
| `namespaceId`   | `String` | 否     | 命名空间，默认为`public`与 `''`相同 |
| `group`         | `String` | 否     | 配置分组名                          |
| `dataId`        | `String` | 否     | 配置名                              |
| `config_tags`   | `String` | 否     | 配置标签，多个标签用逗号分隔        |
| `appName`       | `String` | 否     | 应用名                              |
| `config_detail` | `String` | **是** | 配置内容关键字                      |
| `search`        | `String` | 否     | 搜索类型，默认`blur`                |
| `pageNo`        | `int`    | **是** | 页码，从1开始                       |
| `pageSize`      | `int`    | **是** | 每页显示数量，最大值为500           |

### 返回数据

同[查询配置列表](#1.5-查询配置列表)的返回数据。

### 示例

* 请求示例

  ```shell
  curl -X GET 'http://127.0.0.1:8848/v3/console/cs/config/searchDetail?config_detail=关键字&pageNo=1&pageSize=10&namespaceId=public'
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
          "id": 1,
          "dataId": "nacos.example",
          "group": "DEFAULT_GROUP",
          "content": "配置内容包含关键字",
          "md5": "9f67e6977b100e00cab385a75597db58",
          "type": "yaml",
          "appName": "示例应用",
          "desc": "配置描述",
          "tags": "tag1,tag2",
          "encryptedDataKey": null,
          "lastModifiedTime": "2023-12-05T01:48:03.380+0000"
        }
      ]
    }
  }
  ```

<h2 id="1.7">查询配置监听客户端信息</h2>

### 接口描述

查询对指定配置订阅的客户端信息。

### 请求方式

`GET`

### 请求URL

`/v3/console/cs/config/listener`

### 请求参数

| 参数名        | 类型     | 必填   | 参数描述                   |
| ------------- | -------- | ------ | -------------------------- |
| `namespaceId` | `String` | 否     | 命名空间ID，默认为`public` |
| `group`       | `String` | **是** | 配置分组名                 |
| `dataId`      | `String` | **是** | 配置名                     |
| `sampleTime`  | `int`    | 否     | 采样时间，默认为`1`        |

### 返回数据

| 参数名 | 参数类型                  | 描述             |
| ------ | ------------------------- | ---------------- |
| `data` | `GroupkeyListenserStatus` | 监听状态信息对象 |

`GroupkeyListenserStatus`对象包含以下字段：

| 字段名                    | 类型                        | 描述           |
| ------------------------- | --------------------------- | -------------- |
| `groupKey`                | `String`                    | 配置的唯一键   |
| `listenersGroupkeyStatus` | `List<Map<String, Object>>` | 监听客户端列表 |

### 示例

* 请求示例

  ```shell
  curl -X GET 'http://127.0.0.1:8848/v3/console/cs/config/listener?dataId=nacos.example&group=DEFAULT_GROUP&namespaceId=public'
  ```

* 返回示例

  ```json
  {
    "code": 0,
    "message": "success",
    "data": {
      "groupKey": "nacos.example+DEFAULT_GROUP+public",
      "listenersGroupkeyStatus": [
        {
          "remoteIp": "127.0.0.1",
          "proc": "app1",
          "port": "8080",
          "appName": "testApp"
        }
      ]
    }
  }
  ```

<h2 id="1.8">查询订阅客户端信息（根据IP）</h2>

### 接口描述

根据客户端IP查询订阅的配置信息。

### 请求方式

`GET`

### 请求URL

`/v3/console/cs/config/listener/ip`

### 请求参数

| 参数名        | 类型      | 必填   | 参数描述                        |
| ------------- | --------- | ------ | ------------------------------- |
| `ip`          | `String`  | **是** | 客户端IP地址                    |
| `all`         | `boolean` | 否     | 是否查询所有配置，默认为`false` |
| `namespaceId` | `String`  | 否     | 命名空间ID，默认为`public`      |
| `sampleTime`  | `int`     | 否     | 采样时间，默认为`1`             |

### 返回数据

同[查询配置监听客户端信息](#1.7-查询配置监听客户端信息)的返回数据。

### 示例

* 请求示例

  ```shell
  curl -X GET 'http://127.0.0.1:8848/v3/console/cs/config/listener/ip?ip=127.0.0.1&namespaceId=public'
  ```

* 返回示例

  ```json
  {
    "code": 0,
    "message": "success",
    "data": {
      "groupKey": "",
      "listenersGroupkeyStatus": [
        {
          "groupKey": "nacos.example+DEFAULT_GROUP+public",
          "remoteIp": "127.0.0.1",
          "proc": "app1",
          "port": "8080",
          "appName": "testApp"
        }
      ]
    }
  }
  ```

<h2 id="1.9">导出配置</h2>

### 接口描述

导出指定的配置。

### 请求方式

`GET`

### 请求URL

`/v3/console/cs/config/export`

### 请求参数

| 参数名        | 类型     | 必填 | 参数描述                   |
| ------------- | -------- | ---- | -------------------------- |
| `namespaceId` | `String` | 否   | 命名空间ID，默认为`public` |
| `group`       | `String` | 否   | 配置分组名                 |
| `dataId`      | `String` | 否   | 配置名                     |
| `appName`     | `String` | 否   | 应用名                     |
| `ids`         | `Long[]` | 否   | 配置ID列表                 |

### 返回数据

以文件形式返回导出的配置数据。

### 示例

* 请求示例

  ```shell
  curl -X GET 'http://127.0.0.1:8848/v3/console/cs/config/export?namespaceId=public'
  ```

* 返回示例

  下载包含配置数据的文件。

<h2 id="1.10">导入配置</h2>

### 接口描述

导入并发布配置。

### 请求方式

`POST`

`Content-Type: multipart/form-data`

### 请求URL

`/v3/console/cs/config/import`

### 请求Body

| 参数名        | 类型               | 必填   | 参数描述                    |
| ------------- | ------------------ | ------ | --------------------------- |
| `namespaceId` | `String`           | 否     | 命名空间ID，默认为`public`  |
| `src_user`    | `String`           | 否     | 源用户                      |
| `policy`      | `SameConfigPolicy` | 否     | 配置冲突策略，默认为`ABORT` |
| `file`        | `MultipartFile`    | **是** | 包含配置数据的文件          |

`SameConfigPolicy`策略可选值：

- `ABORT`：中止操作
- `OVERWRITE`：覆盖已有配置
- `SKIP`：跳过已有配置

### 返回数据

| 参数名 | 参数类型              | 描述     |
| ------ | --------------------- | -------- |
| `data` | `Map<String, Object>` | 导入结果 |

### 示例

* 请求示例

  ```shell
  curl -F 'file=@configs.zip' \
    -F 'namespaceId=public' \
    -X POST 'http://127.0.0.1:8848/v3/console/cs/config/import'
  ```

* 返回示例

  ```json
  {
    "code": 0,
    "message": "success",
    "data": {
      "successCount": 10,
      "skipCount": 0,
      "failCount": 0,
      "failData": []
    }
  }
  ```

<h2 id="1.11">克隆配置</h2>

### 接口描述

克隆配置到指定命名空间。

### 请求方式

`POST`

`Content-Type: application/json`

### 请求URL

`/v3/console/cs/config/clone`

### 请求参数

| 参数名            | 类型                             | 必填   | 参数描述                    |
| ----------------- | -------------------------------- | ------ | --------------------------- |
| `namespaceId`     | `String`                         | **是** | 目标命名空间ID              |
| `src_user`        | `String`                         | 否     | 源用户                      |
| `policy`          | `SameConfigPolicy`               | 否     | 配置冲突策略，默认为`ABORT` |
| `configBeansList` | `SameNamespaceCloneConfigBean[]` | **是** | 要克隆的配置列表            |

`SameNamespaceCloneConfigBean`对象包含以下字段：

| 参数名 | 类型   | 描述   |
| ------ | ------ | ------ |
| `id`   | `Long` | 配置ID |

### 返回数据

| 参数名 | 参数类型              | 描述     |
| ------ | --------------------- | -------- |
| `data` | `Map<String, Object>` | 克隆结果 |

### 示例

* 请求示例

  ```shell
  curl -H "Content-Type: application/json" \
    -d '{"namespaceId":"target_namespace","configBeansList":[{"id":1},{"id":2}]}' \
    -X POST 'http://127.0.0.1:8848/v3/console/cs/config/clone'
  ```

* 返回示例

  ```json
  {
    "code": 0,
    "message": "success",
    "data": {
      "successCount": 2,
      "skipCount": 0,
      "failCount": 0,
      "failData": []
    }
  }
  ```



<h2 id="1.13">查询历史版本</h2>

### 描述

查询指定配置的历史版本列表。

### 请求类型

GET

### 请求 URL

`/v3/console/cs/history/list`

### 请求参数

| 名称        | 类型   | 是否必须 | 描述                           |
| ----------- | ------ | -------- | ------------------------------ |
| dataId      | string | 是       | 配置 ID                        |
| group       | string | 是       | 配置分组                       |
| namespaceId | string | 否       | 命名空间 ID，默认为空字符串    |
| pageNo      | int    | 否       | 当前页码，默认为 1             |
| pageSize    | int    | 否       | 分页大小，默认 100，最大为 500 |

### 返回参数

| 参数           | 类型                    | 描述                                 |
| -------------- | ----------------------- | ------------------------------------ |
| totalCount     | int                     | 历史版本总数                         |
| pageNumber     | int                     | 当前页码                             |
| pagesAvailable | int                     | 总页数                               |
| pageItems      | List<ConfigHistoryInfo> | 历史版本列表，每项为一个历史配置信息 |

`ConfigHistoryInfo` 结构：

| 名称             | 类型   | 描述                               |
| ---------------- | ------ | ---------------------------------- |
| id               | long   | 历史版本唯一标识                   |
| dataId           | string | 配置 ID                            |
| group            | string | 配置分组                           |
| namespaceId      | string | 命名空间 ID                        |
| appName          | string | 应用名                             |
| srcUser          | string | 操作用户                           |
| srcIp            | string | 操作 IP 地址                       |
| opType           | string | 操作类型（INSERT、UPDATE、DELETE） |
| md5              | string | 配置内容的 MD5 值                  |
| content          | string | 配置内容（可能为空）               |
| createdTime      | string | 创建时间                           |
| lastModifiedTime | string | 最后修改时间                       |

### 错误编码

| 错误代码 | 描述                  | 语义                   |
| -------- | --------------------- | ---------------------- |
| 400      | Bad Request           | 客户端请求中的语法错误 |
| 403      | Forbidden             | 没有权限               |
| 404      | Not Found             | 无法找到资源           |
| 500      | Internal Server Error | 服务器内部错误         |
| 200      | OK                    | 正常                   |

### 示例

* 请求示例

```bash
curl -X GET 'http://127.0.0.1:8848/v3/console/cs/history/list?dataId=example.data&group=DEFAULT_GROUP&pageNo=1&pageSize=10'
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
        "id": 203,
        "dataId": "example.data",
        "group": "DEFAULT_GROUP",
        "namespaceId": "",
        "appName": "",
        "srcUser": "admin",
        "srcIp": "127.0.0.1",
        "opType": "INSERT",
        "md5": "9f67e6977b100e00cab385a75597db58",
        "content": null,
        "createdTime": "2024-10-09T12:00:00Z",
        "lastModifiedTime": "2024-10-09T12:00:00Z"
      }
    ]
  }
}
```

<h2 id="1.14">查询历史版本详情</h2>

### 描述

查询指定配置项的历史版本详情。

### 请求类型

GET

### 请求 URL

`/v3/console/cs/history`

### 请求参数

| 名称        | 类型   | 是否必须 | 描述                                    |
| ----------- | ------ | -------- | --------------------------------------- |
| dataId      | string | 是       | 配置 ID                                 |
| group       | string | 是       | 配置分组                                |
| namespaceId | string | 否       | 命名空间 ID，默认为空字符串             |
| nid         | long   | 是       | 历史版本 ID，对应于历史记录的 `id` 字段 |

### 返回参数

`ConfigHistoryInfo` 对象，包含历史版本的详细信息。

（结构同 [查询历史版本](#1.13) 中的 `ConfigHistoryInfo`）

### 错误编码

| 错误代码 | 描述                  | 语义                   |
| -------- | --------------------- | ---------------------- |
| 400      | Bad Request           | 客户端请求中的语法错误 |
| 403      | Forbidden             | 没有权限               |
| 404      | Not Found             | 无法找到资源           |
| 500      | Internal Server Error | 服务器内部错误         |
| 200      | OK                    | 正常                   |

### 示例

* 请求示例

```bash
curl -X GET 'http://127.0.0.1:8848/v3/console/cs/history?dataId=example.data&group=DEFAULT_GROUP&nid=203'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 203,
    "dataId": "example.data",
    "group": "DEFAULT_GROUP",
    "namespaceId": "",
    "appName": "",
    "srcUser": "admin",
    "srcIp": "127.0.0.1",
    "opType": "INSERT",
    "md5": "9f67e6977b100e00cab385a75597db58",
    "content": "This is the content of the configuration at this historical version.",
    "createdTime": "2024-10-09T12:00:00Z",
    "lastModifiedTime": "2024-10-09T12:00:00Z"
  }
}
```

<h2 id="1.15">查询配置上一版本信息</h2>

### 描述

查询指定配置的上一版本信息。

### 请求类型

GET

### 请求 URL

`/v3/console/cs/history/previous`

### 请求参数

| 名称        | 类型   | 是否必须 | 描述                                                 |
| ----------- | ------ | -------- | ---------------------------------------------------- |
| dataId      | string | 是       | 配置 ID                                              |
| group       | string | 是       | 配置分组                                             |
| namespaceId | string | 否       | 命名空间 ID，默认为空字符串                          |
| id          | long   | 是       | 当前配置的 ID（对应于 `config_info` 表的 `id` 字段） |

### 返回参数

`ConfigHistoryInfo` 对象，包含上一版本的详细信息。

（结构同 [查询历史版本](#1.13) 中的 `ConfigHistoryInfo`）

### 错误编码

| 错误代码 | 描述                  | 语义                   |
| -------- | --------------------- | ---------------------- |
| 400      | Bad Request           | 客户端请求中的语法错误 |
| 403      | Forbidden             | 没有权限               |
| 404      | Not Found             | 无法找到资源           |
| 500      | Internal Server Error | 服务器内部错误         |
| 200      | OK                    | 正常                   |

### 示例

* 请求示例

```bash
curl -X GET 'http://127.0.0.1:8848/v3/console/cs/history/previous?dataId=example.data&group=DEFAULT_GROUP&id=309135486247505920'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 202,
    "dataId": "example.data",
    "group": "DEFAULT_GROUP",
    "namespaceId": "",
    "appName": "",
    "srcUser": "admin",
    "srcIp": "127.0.0.1",
    "opType": "UPDATE",
    "md5": "d41d8cd98f00b204e9800998ecf8427e",
    "content": "This is the content of the previous version.",
    "createdTime": "2024-10-08T12:00:00Z",
    "lastModifiedTime": "2024-10-08T12:00:00Z"
  }
}
```

<h2 id="1.16">根据命名空间查询配置列表</h2>

### 描述

查询指定命名空间下的所有配置项列表。

### 请求类型

GET

### 请求 URL

`/v3/console/cs/history/configs`

### 请求参数

| 名称        | 类型   | 是否必须 | 描述        |
| ----------- | ------ | -------- | ----------- |
| namespaceId | string | 是       | 命名空间 ID |

### 返回参数

| 参数 | 类型                    | 描述                           |
| ---- | ----------------------- | ------------------------------ |
| data | List<ConfigInfoWrapper> | 配置项列表，每项为一个配置信息 |

`ConfigInfoWrapper` 结构：

| 名称             | 类型   | 描述              |
| ---------------- | ------ | ----------------- |
| dataId           | string | 配置 ID           |
| group            | string | 配置分组          |
| content          | string | 配置内容          |
| md5              | string | 配置内容的 MD5 值 |
| namespaceId      | string | 命名空间 ID       |
| lastModifiedTime | string | 最后修改时间      |

### 错误编码

| 错误代码 | 描述                  | 语义                   |
| -------- | --------------------- | ---------------------- |
| 400      | Bad Request           | 客户端请求中的语法错误 |
| 403      | Forbidden             | 没有权限               |
| 404      | Not Found             | 无法找到资源           |
| 500      | Internal Server Error | 服务器内部错误         |
| 200      | OK                    | 正常                   |

### 示例

* 请求示例

```bash
curl -X GET 'http://127.0.0.1:8848/v3/console/cs/history/configs?namespaceId=public'
```

* 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": [
      {
        "dataId": "example.data",
        "group": "DEFAULT_GROUP",
        "content": "This is the content",
        "md5": "9f67e6977b100e00cab385a75597db58",
        "namespaceId": "public",
        "lastModifiedTime": "2024-10-09T12:00:00Z"
      }
    ]
}
```

## 服务管理

<h2 id="1.1">创建服务</h2>

### 描述

创建一个新的服务，该接口将创建一个持久化的服务。

### 请求方式

POST

### 请求 URL

`/v3/console/ns/service`

### 请求参数

| 参数名           | 类型   | 是否必填 | 描述                                                      |
| ---------------- | ------ | -------- | --------------------------------------------------------- |
| namespaceId      | string | 否       | 命名空间 ID，默认为 `public`                              |
| groupName        | string | 否       | 分组名，默认为 `DEFAULT_GROUP`                            |
| serviceName      | string | 是       | 服务名称                                                  |
| metadata         | string | 否       | 服务的元数据，JSON 字符串格式，如 `{"key1":"value1"}`     |
| selector         | string | 否       | 选择器，JSON 字符串格式，包含 `type` 和 `expression` 字段 |
| protectThreshold | float  | 否       | 保护阈值，取值范围为 0 到 1，默认为 0                     |
| ephemeral        | bool   | 否       | 是否为临时实例，`true` 或 `false`，默认为 `false`         |

### 参数说明

- `selector`：
  - `type`：选择器类型，目前支持 `none`、`label`。
  - `expression`：选择器表达式，当 `type` 为 `label` 时需要提供。
  - 示例：`{"type":"label","expression":"CONSUMER.label.A=PROVIDER.label.A"}`
- `metadata`：
  - 服务的自定义元数据，键值对形式的 JSON 字符串。

### 返回参数

| 参数名  | 类型   | 描述                    |
| ------- | ------ | ----------------------- |
| code    | int    | 状态码，0 表示成功      |
| message | string | 描述信息                |
| data    | string | 操作结果，一般为 `"ok"` |

### 示例

#### 请求示例

```bash
curl -X POST 'http://127.0.0.1:8848/v3/console/ns/service' \
-d 'namespaceId=public' \
-d 'groupName=DEFAULT_GROUP' \
-d 'serviceName=test_service' \
-d 'metadata={"version":"1.0"}' \
-d 'selector={"type":"none"}' \
-d 'protectThreshold=0.5' \
-d 'ephemeral=false'
```

#### 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

<h2 id="1.2">删除服务</h2>

### 描述

删除指定的服务。

### 请求方式

DELETE

### 请求 URL

`/v3/console/ns/service`

### 请求参数

| 参数名      | 类型   | 是否必填 | 描述                           |
| ----------- | ------ | -------- | ------------------------------ |
| namespaceId | string | 否       | 命名空间 ID，默认为 `public`   |
| groupName   | string | 否       | 分组名，默认为 `DEFAULT_GROUP` |
| serviceName | string | 是       | 服务名称                       |

### 返回参数

| 参数名  | 类型   | 描述                    |
| ------- | ------ | ----------------------- |
| code    | int    | 状态码，0 表示成功      |
| message | string | 描述信息                |
| data    | string | 操作结果，一般为 `"ok"` |

### 错误码

同上。

### 示例

#### 请求示例

```bash
curl -X DELETE 'http://127.0.0.1:8848/v3/console/ns/service?serviceName=test_service&namespaceId=public&groupName=DEFAULT_GROUP'
```

#### 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

<h2 id="1.3">更新服务</h2>

### 描述

更新已有服务的信息。

### 请求方式

PUT

### 请求 URL

`/v3/console/ns/service`

### 请求参数

| 参数名           | 类型   | 是否必填 | 描述                                                      |
| ---------------- | ------ | -------- | --------------------------------------------------------- |
| namespaceId      | string | 否       | 命名空间 ID，默认为 `public`                              |
| groupName        | string | 否       | 分组名，默认为 `DEFAULT_GROUP`                            |
| serviceName      | string | 是       | 服务名称                                                  |
| metadata         | string | 否       | 服务的元数据，JSON 字符串格式，如 `{"key1":"value1"}`     |
| selector         | string | 否       | 选择器，JSON 字符串格式，包含 `type` 和 `expression` 字段 |
| protectThreshold | float  | 否       | 保护阈值，取值范围为 0 到 1，默认为 0                     |

### 参数说明

同 [创建服务](#1.1) 接口。

### 返回参数

同 [创建服务](#1.1) 接口。

### 示例

#### 请求示例

```bash
curl -X PUT 'http://127.0.0.1:8848/v3/console/ns/service' \
-d 'namespaceId=public' \
-d 'groupName=DEFAULT_GROUP' \
-d 'serviceName=test_service' \
-d 'metadata={"version":"1.1"}' \
-d 'selector={"type":"label","expression":"CONSUMER.label.env=PROVIDER.label.env"}' \
-d 'protectThreshold=0.6'
```

#### 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

<h2 id="1.4">获取选择器类型列表</h2>

### 描述

获取所有支持的选择器类型。

### 请求方式

GET

### 请求 URL

`/v3/console/ns/service/selector/types`

### 请求参数

无

### 返回参数

| 参数名  | 类型         | 描述                                  |
| ------- | ------------ | ------------------------------------- |
| code    | int          | 状态码，0 表示成功                    |
| message | string       | 描述信息                              |
| data    | List<string> | 选择器类型列表，如 `["none","label"]` |

### 示例

#### 请求示例

```bash
curl -X GET 'http://127.0.0.1:8848/v3/console/ns/service/selector/types'
```

#### 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": ["none", "label"]
}
```

<h2 id="1.5">查询订阅者列表</h2>

### 描述

查询指定服务的订阅者列表。

### 请求方式

GET

### 请求 URL

`/v3/console/ns/service/subscribers`

### 请求参数

| 参数名      | 类型   | 是否必填 | 描述                           |
| ----------- | ------ | -------- | ------------------------------ |
| namespaceId | string | 否       | 命名空间 ID，默认为 `public`   |
| groupName   | string | 否       | 分组名，默认为 `DEFAULT_GROUP` |
| serviceName | string | 是       | 服务名称                       |
| pageNo      | int    | 否       | 页码，默认为 1                 |
| pageSize    | int    | 否       | 每页大小，默认为 1000          |
| aggregation | bool   | 否       | 是否聚合，默认为 `true`        |

### 返回参数

| 参数名  | 类型   | 描述               |
| ------- | ------ | ------------------ |
| code    | int    | 状态码，0 表示成功 |
| message | string | 描述信息           |
| data    | object | 订阅者列表信息     |

**data 对象结构：**

| 参数名      | 类型         | 描述                         |
| ----------- | ------------ | ---------------------------- |
| subscribers | List<object> | 订阅者列表，每项为订阅者信息 |
| count       | int          | 订阅者总数                   |

**订阅者信息结构：**

订阅者信息根据具体实现可能包含以下字段：

| 参数名   | 类型   | 描述           |
| -------- | ------ | -------------- |
| ip       | string | 订阅者 IP 地址 |
| port     | int    | 订阅者端口     |
| app      | string | 应用名称       |
| revision | string | 版本信息       |
| ...      | ...    | 其他字段       |

### 示例

#### 请求示例

```bash
curl -X GET 'http://127.0.0.1:8848/v3/console/ns/service/subscribers?serviceName=test_service&namespaceId=public&pageNo=1&pageSize=10'
```

#### 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "subscribers": [
      {
        "ip": "127.0.0.1",
        "port": 8080,
        "app": "test_app",
        "revision": "1.0"
      }
    ],
    "count": 1
  }
}
```

<h2 id="1.6">查询服务列表</h2>

### 描述

分页查询服务的详细信息。

### 请求方式

GET

### 请求 URL

`/v3/console/ns/service/list`

### 请求参数

| 参数名           | 类型   | 是否必填 | 描述                                   |
| ---------------- | ------ | -------- | -------------------------------------- |
| namespaceId      | string | 否       | 命名空间 ID，默认为 `public`           |
| pageNo           | int    | 是       | 页码，从 1 开始                        |
| pageSize         | int    | 是       | 每页大小                               |
| withInstances    | bool   | 否       | 是否返回实例信息，默认为 `false`       |
| serviceNameParam | string | 否       | 服务名称的搜索参数，支持模糊搜索       |
| groupNameParam   | string | 否       | 分组名称的搜索参数，支持模糊搜索       |
| instance         | string | 否       | 包含的实例名，支持模糊搜索             |
| hasIpCount       | bool   | 否       | 是否只返回有实例的服务，默认为 `false` |

### 返回参数

| 参数名  | 类型   | 描述               |
| ------- | ------ | ------------------ |
| code    | int    | 状态码，0 表示成功 |
| message | string | 描述信息           |
| data    | object | 服务列表信息       |

**data 对象结构：**

| 参数名      | 类型         | 描述                     |
| ----------- | ------------ | ------------------------ |
| count       | int          | 服务总数                 |
| serviceList | List<object> | 服务列表，每项为服务信息 |

**服务信息结构：**

| 参数名           | 类型   | 描述         |
| ---------------- | ------ | ------------ |
| name             | string | 服务名称     |
| groupName        | string | 分组名称     |
| metadata         | object | 服务的元数据 |
| selector         | object | 服务的选择器 |
| protectThreshold | float  | 保护阈值     |
| ...              | ...    | 其他服务属性 |

### 示例

#### 请求示例

```bash
curl -X GET 'http://127.0.0.1:8848/v3/console/ns/service/list?pageNo=1&pageSize=10&namespaceId=public&withInstances=false'
```

#### 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "count": 2,
    "serviceList": [
      {
        "name": "test_service",
        "groupName": "DEFAULT_GROUP",
        "metadata": {
          "version": "1.1"
        },
        "selector": {
          "type": "label",
          "expression": "CONSUMER.label.env=PROVIDER.label.env"
        },
        "protectThreshold": 0.6
      }
    ]
  }
}
```

<h2 id="1.7">查询服务详情</h2>

### 描述

获取指定服务的详细信息。

### 请求方式

GET

### 请求 URL

`/v3/console/ns/service`

### 请求参数

| 参数名      | 类型   | 是否必填 | 描述                           |
| ----------- | ------ | -------- | ------------------------------ |
| namespaceId | string | 否       | 命名空间 ID，默认为 `public`   |
| groupName   | string | 否       | 分组名，默认为 `DEFAULT_GROUP` |
| serviceName | string | 是       | 服务名称                       |

### 返回参数

| 参数名  | 类型   | 描述               |
| ------- | ------ | ------------------ |
| code    | int    | 状态码，0 表示成功 |
| message | string | 描述信息           |
| data    | object | 服务的详细信息     |

**data 对象结构：**

同 [查询服务列表](#1.6) 中的服务信息结构。

### 示例

#### 请求示例

```bash
curl -X GET 'http://127.0.0.1:8848/v3/console/ns/service?serviceName=test_service&namespaceId=public&groupName=DEFAULT_GROUP'
```

#### 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "name": "test_service",
    "groupName": "DEFAULT_GROUP",
    "metadata": {
      "version": "1.1"
    },
    "selector": {
      "type": "label",
      "expression": "CONSUMER.label.env=PROVIDER.label.env"
    },
    "protectThreshold": 0.6
  }
}
```

---

<h2 id="1.8">更新集群</h2>

### 描述

更新指定服务的集群信息。

### 请求方式

PUT

### 请求 URL

`/v3/console/ns/service/cluster`

### 请求参数

| 参数名                | 类型   | 是否必填 | 描述                                                  |
| --------------------- | ------ | -------- | ----------------------------------------------------- |
| namespaceId           | string | 否       | 命名空间 ID，默认为 `public`                          |
| serviceName           | string | 是       | 服务名称                                              |
| clusterName           | string | 是       | 集群名称                                              |
| healthChecker         | string | 是       | 健康检查器，JSON 字符串格式，包含健康检查类型及配置   |
| checkPort             | int    | 是       | 健康检查端口                                          |
| useInstancePort4Check | bool   | 是       | 是否使用实例端口进行健康检查，`true` 或 `false`       |
| metadata              | string | 否       | 集群的元数据，JSON 字符串格式，如 `{"key1":"value1"}` |

### 参数说明

- `healthChecker`：
  - 健康检查器的配置，JSON 字符串格式，包含 `type` 和具体的健康检查参数。
  - 示例：`{"type":"TCP","path":"/health","headers":{}}`

### 返回参数

| 参数名  | 类型   | 描述                    |
| ------- | ------ | ----------------------- |
| code    | int    | 状态码，0 表示成功      |
| message | string | 描述信息                |
| data    | string | 操作结果，一般为 `"ok"` |


### 示例

#### 请求示例

```bash
curl -X PUT 'http://127.0.0.1:8848/v3/console/ns/service/cluster' \
-d 'namespaceId=public' \
-d 'serviceName=test_service' \
-d 'clusterName=DEFAULT' \
-d 'healthChecker={"type":"TCP"}' \
-d 'checkPort=80' \
-d 'useInstancePort4Check=true' \
-d 'metadata={"zone":"us-east-1"}'
```

#### 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

<h2 id="1.1">查询实例列表</h2>

### 描述

分页查询指定服务的实例列表。

### 请求方式

GET

### 请求 URL

`/v3/console/ns/instance/list`

### 请求参数

| 参数名      | 类型   | 是否必填 | 描述                                 |
| ----------- | ------ | -------- | ------------------------------------ |
| namespaceId | string | 否       | 命名空间 ID，默认为 `public`         |
| groupName   | string | 否       | 分组名，默认为 `DEFAULT_GROUP`       |
| serviceName | string | 是       | 服务名称                             |
| healthyOnly | bool   | 否       | 是否仅返回健康的实例，默认为 `false` |
| enabledOnly | bool   | 否       | 是否仅返回启用的实例，默认为 `false` |
| pageNo      | int    | 是       | 页码，从 1 开始                      |
| pageSize    | int    | 是       | 每页大小                             |

### 返回参数

| 参数名  | 类型   | 描述               |
| ------- | ------ | ------------------ |
| code    | int    | 状态码，0 表示成功 |
| message | string | 描述信息           |
| data    | object | 实例列表信息       |

**data 对象结构：**

- **count**：实例总数
- **instances**：实例列表，每项为实例信息

**实例信息结构：**

| 参数名      | 类型   | 描述             |
| ----------- | ------ | ---------------- |
| ip          | string | 实例 IP 地址     |
| port        | int    | 实例端口         |
| weight      | double | 实例权重         |
| healthy     | bool   | 实例是否健康     |
| enabled     | bool   | 实例是否启用     |
| clusterName | string | 实例所属集群名称 |
| metadata    | object | 实例元数据       |
| instanceId  | string | 实例 ID          |
| ephemeral   | bool   | 是否为临时实例   |

### 示例

#### 请求示例

```bash
curl -X GET 'http://127.0.0.1:8848/v3/console/ns/instance/list?serviceName=test_service&namespaceId=public&pageNo=1&pageSize=10'
```

#### 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "count": 2,
    "instances": [
      {
        "ip": "127.0.0.1",
        "port": 8080,
        "weight": 1.0,
        "healthy": true,
        "enabled": true,
        "clusterName": "DEFAULT",
        "metadata": {
          "version": "1.0"
        },
        "instanceId": "127.0.0.1#8080#DEFAULT#DEFAULT_GROUP@@test_service",
        "ephemeral": true
      }
    ]
  }
}
```

<h2 id="1.2">更新实例</h2>

### 描述

更新指定实例的信息。

### 请求方式

PUT

### 请求 URL

`/v3/console/ns/instance`

### 请求参数

请求参数以表单形式提交（`application/x-www-form-urlencoded`）。

| 参数名      | 类型   | 是否必填 | 描述                                                |
| ----------- | ------ | -------- | --------------------------------------------------- |
| namespaceId | string | 否       | 命名空间 ID，默认为 `public`                        |
| groupName   | string | 否       | 分组名，默认为 `DEFAULT_GROUP`                      |
| serviceName | string | 是       | 服务名称                                            |
| clusterName | string | 否       | 集群名称，默认为 `DEFAULT`                          |
| ip          | string | 是       | 实例的 IP 地址                                      |
| port        | int    | 是       | 实例的端口号                                        |
| weight      | double | 否       | 实例的权重，取值范围为 0 到 10000，默认 1.0         |
| enabled     | bool   | 否       | 实例是否启用，`true` 或 `false`，默认 `true`        |
| healthy     | bool   | 否       | 实例是否健康，`true` 或 `false`，默认 `true`        |
| metadata    | string | 否       | 实例的元数据，JSON 字符串格式，如 `{"key":"value"}` |
| ephemeral   | bool   | 否       | 是否为临时实例，`true` 或 `false`，默认为 `false`   |

### 参数说明

- `weight`：
  - 实例的权重，默认值为 `1.0`。
  - 值必须在 `0` 到 `10000` 之间。
- `metadata`：
  - 实例的自定义元数据，键值对形式的 JSON 字符串。

### 返回参数

| 参数名  | 类型   | 描述                    |
| ------- | ------ | ----------------------- |
| code    | int    | 状态码，0 表示成功      |
| message | string | 描述信息                |
| data    | string | 操作结果，一般为 `"ok"` |


### 示例

#### 请求示例

```bash
curl -X PUT 'http://127.0.0.1:8848/v3/console/ns/instance' \
  -d 'namespaceId=public' \
  -d 'groupName=DEFAULT_GROUP' \
  -d 'serviceName=test_service' \
  -d 'ip=127.0.0.1' \
  -d 'port=8080' \
  -d 'weight=2.0' \
  -d 'enabled=true' \
  -d 'healthy=true' \
  -d 'metadata={"version":"1.1"}' \
  -d 'ephemeral=true'
```

#### 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": "ok"
}
```

## 命名空间

<h2 id="1.1">查询命名空间列表</h2>

### 描述

获取当前所有的命名空间列表。

### 请求方式

GET

### 请求 URL

`/v3/console/core/namespace/list`

### 请求参数

无

### 返回参数

| 参数名  | 类型            | 描述                             |
| ------- | --------------- | -------------------------------- |
| code    | int             | 状态码，0 表示成功               |
| message | string          | 描述信息                         |
| data    | List<Namespace> | 命名空间列表，每项为一个命名空间 |

**Namespace 对象结构：**

| 参数名            | 类型   | 描述                           |
| ----------------- | ------ | ------------------------------ |
| namespace         | string | 命名空间 ID                    |
| namespaceShowName | string | 命名空间显示名称               |
| namespaceDesc     | string | 命名空间描述                   |
| quota             | int    | 命名空间的容量（可忽略）       |
| configCount       | int    | 命名空间下的配置数量（可忽略） |
| type              | int    | 命名空间类型（0、1、2）        |


### 示例

#### 请求示例

```bash
curl -X GET 'http://127.0.0.1:8848/v3/console/core/namespace/list'
```

#### 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "namespace": "",
      "namespaceShowName": "public",
      "namespaceDesc": null,
      "quota": 200,
      "configCount": 10,
      "type": 0
    },
    {
      "namespace": "test_namespace",
      "namespaceShowName": "Test Namespace",
      "namespaceDesc": "This is a test namespace",
      "quota": 200,
      "configCount": 5,
      "type": 2
    }
  ]
}
```

<h2 id="1.2">查询命名空间详情</h2>

### 描述

根据命名空间 ID 获取命名空间的详细信息。

### 请求方式

GET

### 请求 URL

`/v3/console/core/namespace`

### 请求参数

| 参数名      | 类型   | 是否必填 | 描述        |
| ----------- | ------ | -------- | ----------- |
| namespaceId | string | 是       | 命名空间 ID |

### 返回参数

| 参数名  | 类型      | 描述               |
| ------- | --------- | ------------------ |
| code    | int       | 状态码，0 表示成功 |
| message | string    | 描述信息           |
| data    | Namespace | 命名空间详细信息   |

**Namespace 对象结构：**

同上。


### 示例

#### 请求示例

```bash
curl -X GET 'http://127.0.0.1:8848/v3/console/core/namespace?namespaceId=test_namespace'
```

#### 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "namespace": "test_namespace",
    "namespaceShowName": "Test Namespace",
    "namespaceDesc": "This is a test namespace",
    "quota": 200,
    "configCount": 5,
    "type": 2
  }
}
```

<h2 id="1.3">创建命名空间</h2>

### 描述

创建一个新的命名空间。

### 请求方式

POST

### 请求 URL

`/v3/console/core/namespace`

### 请求参数

| 参数名            | 类型   | 是否必填 | 描述                                      |
| ----------------- | ------ | -------- | ----------------------------------------- |
| customNamespaceId | string | 否       | 自定义的命名空间 ID，如果不填写将自动生成 |
| namespaceName     | string | 是       | 命名空间名称                              |
| namespaceDesc     | string | 否       | 命名空间描述                              |

### 参数说明

- `customNamespaceId`：
  - 如果为空，系统将自动生成一个 UUID 作为命名空间 ID。
  - 如果提供，必须匹配正则表达式 `^[\w-]+`，且长度不超过 128 个字符，且不能重复。
- `namespaceName`：
  - 必须匹配正则表达式 `^[^@#$%^&*]+$`，不能包含非法字符。

### 返回参数

| 参数名  | 类型    | 描述                      |
| ------- | ------- | ------------------------- |
| code    | int     | 状态码，0 表示成功        |
| message | string  | 描述信息                  |
| data    | boolean | 创建结果，`true` 表示成功 |



### 示例

#### 请求示例

```bash
curl -X POST 'http://127.0.0.1:8848/v3/console/core/namespace' \
-d 'customNamespaceId=my_namespace_id' \
-d 'namespaceName=My Namespace' \
-d 'namespaceDesc=This is my custom namespace'
```

#### 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```



<h2 id="1.4">更新命名空间</h2>

### 描述

更新已有的命名空间的信息。

### 请求方式

PUT

### 请求 URL

`/v3/console/core/namespace`

### 请求参数

| 参数名        | 类型   | 是否必填 | 描述             |
| ------------- | ------ | -------- | ---------------- |
| namespaceId   | string | 是       | 命名空间 ID      |
| namespaceName | string | 是       | 新的命名空间名称 |
| namespaceDesc | string | 否       | 新的命名空间描述 |

### 参数说明

- `namespaceId`：
  - 要更新的命名空间的 ID。
- `namespaceName`：
  - 必须匹配正则表达式 `^[^@#$%^&*]+$`，不能包含非法字符。

### 返回参数

| 参数名  | 类型    | 描述                      |
| ------- | ------- | ------------------------- |
| code    | int     | 状态码，0 表示成功        |
| message | string  | 描述信息                  |
| data    | boolean | 更新结果，`true` 表示成功 |


### 示例

#### 请求示例

```bash
curl -X PUT 'http://127.0.0.1:8848/v3/console/core/namespace' \
-d 'namespaceId=my_namespace_id' \
-d 'namespaceName=My Updated Namespace' \
-d 'namespaceDesc=Updated description'
```

#### 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```



<h2 id="1.5">删除命名空间</h2>

### 描述

删除指定的命名空间。

### 请求方式

DELETE

### 请求 URL

`/v3/console/core/namespace`

### 请求参数

| 参数名      | 类型   | 是否必填 | 描述        |
| ----------- | ------ | -------- | ----------- |
| namespaceId | string | 是       | 命名空间 ID |

### 返回参数

| 参数名  | 类型    | 描述                      |
| ------- | ------- | ------------------------- |
| code    | int     | 状态码，0 表示成功        |
| message | string  | 描述信息                  |
| data    | boolean | 删除结果，`true` 表示成功 |


### 示例

#### 请求示例

```bash
curl -X DELETE 'http://127.0.0.1:8848/v3/console/core/namespace?namespaceId=my_namespace_id'
```

#### 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```



<h2 id="1.6">检查命名空间 ID 是否存在</h2>

### 描述

检查指定的命名空间 ID 是否已存在。

### 请求方式

GET

### 请求 URL

`/v3/console/core/namespace/exist`

### 请求参数

| 参数名            | 类型   | 是否必填 | 描述                      |
| ----------------- | ------ | -------- | ------------------------- |
| customNamespaceId | string | 是       | 要检查的自定义命名空间 ID |

### 返回参数

| 参数名  | 类型    | 描述                                            |
| ------- | ------- | ----------------------------------------------- |
| code    | int     | 状态码，0 表示成功                              |
| message | string  | 描述信息                                        |
| data    | boolean | 检查结果，`true` 表示已存在，`false` 表示不存在 |


### 示例

#### 请求示例

```bash
curl -X GET 'http://127.0.0.1:8848/v3/console/core/namespace/exist?customNamespaceId=my_namespace_id'
```

#### 返回示例（存在）

```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

## 集群管理

<h2 id="4.5">查询集群节点列表</h2>

### 描述

获取集群中所有节点的列表，可根据关键字过滤。

### 请求方式

`GET`

### 请求 URL

`/v3/console/core/cluster/nodes`

### 请求参数

| 参数名  | 类型   | 是否必填 | 描述                                   |
| ------- | ------ | -------- | -------------------------------------- |
| keyword | string | 否       | 关键字，用于过滤节点信息（如 IP 地址） |

### 返回参数

| 参数名  | 类型           | 描述                         |
| ------- | -------------- | ---------------------------- |
| code    | int            | 状态码，0 表示成功           |
| message | string         | 描述信息                     |
| data    | List\<Member\> | 节点列表，每项为一个节点信息 |

**Member 对象结构：**

| 参数名        | 类型   | 描述                            |
| ------------- | ------ | ------------------------------- |
| ip            | string | 节点 IP 地址                    |
| port          | int    | 节点端口                        |
| state         | string | 节点状态（UP、DOWN 等）         |
| address       | string | 节点地址（IP:Port）             |
| failAccessCnt | int    | 失败访问次数                    |
| abilities     | object | 节点能力信息（可选）            |
| extendInfo    | object | 扩展信息（如版本、Raft 信息等） |

**abilities 对象结构：**

| 参数名        | 类型   | 描述         |
| ------------- | ------ | ------------ |
| remoteAbility | object | 远程能力信息 |
| configAbility | object | 配置能力信息 |
| namingAbility | object | 命名能力信息 |

**extendInfo 对象结构：**

| 参数名          | 类型   | 描述                   |
| --------------- | ------ | ---------------------- |
| lastRefreshTime | long   | 最后刷新时间（时间戳） |
| version         | string | 节点版本               |
| raftPort        | string | Raft 通信端口          |
| raftMetaData    | object | Raft 元数据（可选）    |

### 示例

#### 请求示例

```bash
curl -X GET 'http://127.0.0.1:8848/v3/console/core/cluster/nodes?keyword=127.0.0.1'
```

#### 返回示例

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "ip": "127.0.0.1",
      "port": 8848,
      "state": "UP",
      "address": "127.0.0.1:8848",
      "failAccessCnt": 0,
      "abilities": {
        "remoteAbility": {
          "supportRemoteConnection": true
        },
        "configAbility": {
          "supportRemoteMetrics": false
        },
        "namingAbility": {
          "supportJraft": true
        }
      },
      "extendInfo": {
        "lastRefreshTime": 1664521263623,
        "version": "2.1.0",
        "raftPort": "7848",
        "raftMetaData": {
          "metaDataMap": {
            "naming_persistent_service_v2": {
              "leader": "127.0.0.1:7848",
              "raftGroupMember": [
                "127.0.0.1:7848"
              ],
              "term": 12
            }
          }
        }
      }
    }
  ]
}
```

