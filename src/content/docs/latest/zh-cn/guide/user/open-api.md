---
title: Open API 指南
keywords: [Open API,指南]
description: Open API 指南
sidebar:
    order: 3
---

# Open API 指南

Nacos 2.X 版本兼容 Nacos1.X 版本的OpenAPI, 请参考文档[Nacos1.X OpenAPI](https://nacos.io/docs/v1/open-api)使用。

> 注意：未特殊注明支持版本的OpenAPI均从2.2.0版本开始支持。

- 文档约定
    - [API 统一返回体格式](#0.1)
    - [API 错误码汇总](#0.2)

- 配置管理
    - [获取配置](#1.1)
    - [发布配置](#1.2)
    - [删除配置](#1.3)
    - [查询配置历史版本列表](#1.4)
    - [查询具体版本的历史配置](#1.5)
    - [查询配置上一版本信息](#1.6)
    - [查询指定命名空间下的配置列表](#1.7)
- 服务发现
    - [注册实例](#2.1)
    - [注销实例](#2.2)
    - [更新实例](#2.3)
    - [查询实例详情](#2.4)
    - [查询指定服务下的实例列表](#2.5)
    - [批量更新实例元数据(Beta)](#2.6)
    - [批量删除实例元数据(Beta)](#2.7)
    - [创建服务](#2.8)
    - [删除服务](#2.9)
    - [修改服务](#2.10)
    - [查询服务详情](#2.11)
    - [查询服务列表](#2.12)
    - [查询系统开关](#2.13)
    - [修改系统开关](#2.14)
    - [查看系统当前数据指标](#2.15)
    - [更新实例的健康状态](#2.16)
    - [查询客户端列表（新）](#2.17)
    - [查询客户端信息（新）](#2.18)
    - [查询客户端的注册信息（新）](#2.19)
    - [查询客户端的订阅信息（新）](#2.20)
    - [查询注册指定服务的客户端信息（新）](#2.21)
    - [查询订阅指定服务的客户端信息（新）](#2.22)
- 命名空间
    - [查询命名空间列表](#3.1)
    - [查询具体命名空间](#3.2)
    - [新增命名空间](#3.3)
    - [编辑命名空间](#3.4)
    - [删除命名空间](#3.5)
- 集群管理
    - [查询当前节点信息](#4.1)
    - [查询集群节点列表](#4.2)
    - [查询当前节点健康状态](#4.3)
    - [切换寻址模式](#4.4)

## 文档规定

<h2 id="0.1">API 统一返回体格式</h2>

2.0版本Open API，所有接口请求的响应均为`json`类型的返回体，返回体具有相同的格式

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

返回体中各字段的含义如下表所示

|   名称    |   类型   | 描述                                                   |
|:---------:|:--------:|--------------------------------------------------------|
|  `code `  |  `int`   | 错误码，`0`代表执行成功，非`0`代表执行失败的某一种情况 |
| `message` | `String` | 错误码提示信息，执行成功为"`success`"                  |
|  `data`   | 任意类型 | 返回数据，执行失败时为详细出错信息                     |

> 由于执行成功的情况下code字段与message字段相同，后续在介绍接口的返回结果时，只介绍返回数据的data字段

<h2 id="0.2">API 错误码汇总</h2>

API接口返回体中的错误码及对应提示信息汇总见下表

| 错误码  | 提示信息                     | 含义                       |
|---------|------------------------------|----------------------------|
| `0`     | `success`                    | 成功执行                   |
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

<h2 id="1.1">获取配置</h2>

### 接口描述

获取指定配置

### 请求方式

`GET`

### 请求URL

`/nacos/v2/cs/config`

### 请求参数

| 参数名        | 类型     | 必填   | 参数描述                     |
|---------------|----------|--------|--------------------------|
| `namespaceId` | `String` | 否     | 命名空间，默认为`public`与 `''`相同 |
| `group`       | `String` | **是** | 配置分组名                    |
| `dataId`      | `String` | **是** | 配置名                      |
| `tag`         | `String` | 否     | 标签                       |

### 返回数据

| 参数名 | 参数类型 | 描述     |
|--------|----------|----------|
| `data` | `String` | 配置内容 |

### 示例

* 请求示例

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/cs/config?dataId=nacos.example&group=DEFAULT_GROUP&namespaceId=public'
    ```

* 返回示例

    ```json
    {
	      "code": 0,
	      "message": "success",
	      "data": "contentTest"
    }
    ```

<h2 id="1.2">发布配置</h2>

### 接口描述

发布指定配置

> 当配置已存在时，则对配置进行更新

### 请求方式

`POST`

`Content-Type:application/x-www-form-urlencoded`

### 请求URL

`/nacos/v2/cs/config`

### 请求Body

| 参数名        | 类型     | 必填   | 参数描述                       |
|---------------|----------|--------|--------------------------------|
| `namespaceId` | `String` | 否     | 命名空间，默认为`public`与 `''`相同     |
| `group`       | `String` | **是** | 配置组名                       |
| `dataId`      | `String` | **是** | 配置名                         |
| `content`     | `String` | **是** | 配置内容                       |
| `tag`         | `String` | 否     | 标签                           |
| `appName`     | `String` | 否     | 应用名                         |
| `srcUser`     | `String` | 否     | 源用户                         |
| `configTags`  | `String` | 否     | 配置标签列表，可多个，逗号分隔 |
| `desc`        | `String` | 否     | 配置描述                       |
| `use`         | `String` | 否     | -                              |
| `effect`      | `String` | 否     | -                              |
| `type`        | `String` | 否     | 配置类型                       |
| `schema`      | `String` | 否     | -                              |

### 返回数据

| 参数名 | 参数类型  | 描述         |
|--------|-----------|--------------|
| `data` | `boolean` | 是否执行成功 |

### 示例

* 请求示例

    ```shell
    curl -d 'dataId=nacos.example' \
      -d 'group=DEFAULT_GROUP' \
      -d 'namespaceId=public' \
      -d 'content=contentTest' \
      -X POST 'http://127.0.0.1:8848/nacos/v2/cs/config'
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

删除指定配置

### 请求方式

`DELETE`

### 请求URL

`/nacos/v2/cs/config`

### 请求参数

| 参数名        | 类型     | 必填   | 参数描述                 |
|---------------|----------|--------|--------------------------|
| `namespaceId` | `String` | 否     | 命名空间，默认为`public`与 `''`相同 |
| `group`       | `String` | **是** | 配置分组名               |
| `dataId`      | `String` | **是** | 配置名                   |
| `tag`         | `String` | 否     | 标签                     |

### 返回数据

| 参数名 | 参数类型  | 描述         |
|--------|-----------|--------------|
| `data` | `boolean` | 是否执行成功 |

### 示例

* 请求示例

    ```shell
    curl -X DELETE 'http://127.0.0.1:8848/nacos/v2/cs/config?dataId=nacos.example&group=DEFAULT_GROUP&namespaceId=public'
    ```

* 返回示例

    ```json
    {
          "code": 0,
          "message": "success",
          "data": true
    }
    ```

<h2 id="1.4">查询配置历史列表</h2>

### 接口描述

获取指定配置的历史版本列表

### 请求方式

`GET`

### 请求URL

`/nacos/v2/cs/history/list`

### 请求参数

| 参数名        | 类型     | 必填   | 参数描述                           |
|---------------|----------|--------|------------------------------------|
| `namespaceId` | `String` | 否     | 命名空间，默认为`public`与 `''`相同           |
| `group`       | `String` | **是** | 配置分组名                         |
| `dataId`      | `String` | **是** | 配置名                             |
| `pageNo`      | `int`    | 否     | 当前页，默认为`1`                  |
| `pageSize`    | `int`    | 否     | 页条目数，默认为`100`，最大为`500` |

### 返回数据

| 参数名                | 参数类型   | 描述说明                                                 |
|-----------------------|------------|----------------------------------------------------------|
| `data`                | `Object`   | 分页查询结果                                             |
| `data.totalCount`     | `int`      | 总数                                                     |
| `data.pageNumber`     | `int`      | 当前页                                                   |
| `data.pagesAvailable` | `int`      | 总页数                                                   |
| `data.pageItems`      | `Object[]` | 历史配置项列表，参见[历史配置项信息](#ConfigHistoryInfo) |

### 示例

* 请求示例

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/cs/history/list?dataId=nacos.example&group=com.alibaba.nacos&namespaceId='
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

<h2 id="1.5">查询具体版本的历史配置</h2>

### 接口描述

获取指定版本的历史配置

### 请求方式

`GET`

### 请求URL

`/nacos/v2/cs/history`

### 请求参数

| 参数名        | 类型     | 必填   | 参数描述               |
|---------------|----------|--------|------------------------|
| `namespaceId` | `String` | 否     | 命名空间，默认为`public`与 `''`相同 |
| `group`       | `String` | **是** | 配置分组名             |
| `dataId`      | `String` | **是** | 配置名                 |
| `nid`         | `long`   | **是** | 历史配置id             |

<h3 id="ConfigHistoryInfo">返回数据</h3>

| 参数名                     | 参数类型     | 描述说明       |
|-------------------------|----------|------------|
| `data`                  | `Object` | 历史配置项      |
| `data.id`               | `String` | 配置`id`     |
| `data.lastId`           | `int`    |            |
| `data.dataId`           | `String` | 配置名        |
| `data.group`            | `String` | 配置分组       |
| `data.tenant`           | `String` | 租户信息（命名空间） |
| `data.appName`          | `String` | 应用名        |
| `data.md5`              | `String` | 配置内容的md5值  |
| `data.content`          | `String` | 配置内容       |
| `data.srcIp`            | `String` | 源ip        |
| `data.srcUser`          | `String` | 源用户        |
| `data.opType`           | `String` | 操作类型       |
| `data.createdTime`      | `String` | 创建时间       |
| `data.lastModifiedTime` | `String` | 上次修改时间     |
| `data.encryptedDataKey` | `String` |            |

### 示例

* 请求示例

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/cs/history?dataId=nacos.example&group=com.alibaba.nacos&namespaceId=&nid=203'
    ```

* 返回示例

    ```json
    {
    	"code": 0,
    	"message": "success",
    	"data": {
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
    }
    ```

<h2 id="1.6">查询配置上一版本信息</h2>

### 接口描述

获取指定配置的上一版本

### 请求方式

`GET`

### 请求URL

`/nacos/v2/cs/history/previous`

### 请求参数

| 参数名        | 类型     | 必填   | 参数描述               |
|---------------|----------|--------|------------------------|
| `namespaceId` | `String` | 否     | 命名空间，默认为`public`与 `''`相同 |
| `group`       | `String` | **是** | 配置分组名             |
| `dataId`      | `String` | **是** | 配置名                 |
| `id`          | `long`   | **是** | 配置id                 |

<h3 id="ConfigHistoryInfo">返回数据</h3>

| 参数名 | 参数类型 | 描述说明                                             |
|--------|----------|------------------------------------------------------|
| `data` | `Object` | 历史配置项，参见[历史配置项信息](#ConfigHistoryInfo) |

### 示例

* 请求示例

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/cs/history/previous?id=309135486247505920&dataId=nacos.example&group=com.alibaba.nacos&namespaceId='
    ```

* 返回示例

    ```json
    {
    	"code": 0,
    	"message": "success",
    	"data": {
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
    }
    ```

<h2 id="1.7">查询指定命名空间下的配置列表</h2>

### 接口描述

获取指定命名空间下的配置信息列表

### 请求方式

`GET`

### 请求URL

`/nacos/v2/cs/history/configs`

### 请求参数

| 参数名        | 类型     | 必填   | 参数描述 |
|---------------|----------|--------|----------|
| `namespaceId` | `String` | **是** | 命名空间 |

### 返回数据

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

### 示例

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

## 服务发现

<h2 id="2.1">注册实例</h2>

### 接口描述

注册一个实例

### 请求方式

`POST`

`Content-Type:application/x-www-form-urlencoded`

### 请求URL

`/nacos/v2/ns/instance`

### 请求Body

| 参数名        | 参数类型         | 是否必填 | 描述说明                         |
|---------------|------------------|----------|----------------------------------|
| `namespaceId` | `String`         | 否       | 命名空间`Id`，默认为`public`     |
| `groupName`   | `String`         | 否       | 分组名，默认为`DEFAULT_GROUP`    |
| `serviceName` | `String`         | **是**   | 服务名                           |
| `ip`          | `String`         | **是**   | `IP`地址                         |
| `port`        | `int`            | **是**   | 端口号                           |
| `clusterName` | `String`         | 否       | 集群名称，默认为`DEFAULT`        |
| `healthy`     | `boolean`        | 否       | 是否只查找健康实例，默认为`true` |
| `weight`      | `double`         | 否       | 实例权重，默认为`1.0`            |
| `enabled`     | `boolean`        | 否       | 是否可用，默认为`true`           |
| `metadata`    | `JSON格式String` | 否       | 实例元数据                       |
| `ephemeral`   | `boolean`        | 否       | 是否为临时实例                   |

### 返回数据

| 参数名 | 参数类型  | 描述         |
|--------|-----------|--------------|
| `data` | `boolean` | 是否执行成功 |

### 示例

* 请求示例

    ```shell
    curl -d 'serviceName=test_service' \
      -d 'ip=127.0.0.1' \
      -d 'port=8090' \
      -d 'weight=0.9' \
      -d 'ephemeral=true' \
      -X POST 'http://127.0.0.1:8848/nacos/v2/ns/instance'
    ```

* 返回示例

    ```json
    {
          "code": 0,
          "message": "success",
          "data": true
    }
    ```

<h2 id="2.2">注销实例</h2>

### 接口描述

注销指定实例

### 请求方式

`DELETE`

`Content-Type:application/x-www-form-urlencoded`

### 请求URL

`/nacos/v2/ns/instance`

### 请求Body

| 参数名        | 参数类型         | 是否必填 | 描述说明                         |
|---------------|------------------|----------|----------------------------------|
| `namespaceId` | `String`         | 否       | 命名空间`Id`，默认为`public`     |
| `groupName`   | `String`         | 否       | 分组名，默认为`DEFAULT_GROUP`    |
| `serviceName` | `String`         | **是**   | 服务名                           |
| `ip`          | `String`         | **是**   | `IP`地址                         |
| `port`        | `int`            | **是**   | 端口号                           |
| `clusterName` | `String`         | 否       | 集群名称，默认为`DEFAULT`        |
| `healthy`     | `boolean`        | 否       | 是否只查找健康实例，默认为`true` |
| `weight`      | `double`         | 否       | 实例权重，默认为`1.0`            |
| `enabled`     | `boolean`        | 否       | 是否可用，默认为`true`           |
| `metadata`    | `JSON格式String` | 否       | 实例元数据                       |
| `ephemeral`   | `boolean`        | 否       | 是否为临时实例                   |

### 返回数据

| 参数名 | 参数类型  | 描述         |
|--------|-----------|--------------|
| `data` | `boolean` | 是否执行成功 |

### 示例

* 请求示例

    ```shell
    curl -d 'serviceName=test_service' \
      -d 'ip=127.0.0.1' \
      -d 'port=8090' \
      -d 'weight=0.9' \
      -d 'ephemeral=true' \
      -X DELETE 'http://127.0.0.1:8848/nacos/v2/ns/instance'
    ```

* 返回示例

    ```json
    {
          "code": 0,
          "message": "success",
          "data": true
    }
    ```

<h2 id="2.3">更新实例</h2>

### 接口描述

修改实例信息

> 通过该接口更新的元数据拥有更高的优先级，且具有记忆能力；会在对应实例删除后，依旧存在一段时间，如果在此期间实例重新注册，该元数据依旧生效；您可以通过`nacos.naming.clean.expired-metadata.expired-time`及`nacos.naming.clean.expired-metadata.interval`对记忆时间进行修改

### 请求方式

`PUT`

`Content-Type:application/x-www-form-urlencoded`

### 请求URL

`/nacos/v2/ns/instance`

### 请求Body

| 参数名        | 参数类型         | 是否必填 | 描述说明                         |
|---------------|------------------|----------|----------------------------------|
| `namespaceId` | `String`         | 否       | 命名空间`Id`，默认为`public`     |
| `groupName`   | `String`         | 否       | 分组名，默认为`DEFAULT_GROUP`    |
| `serviceName` | `String`         | **是**   | 服务名                           |
| `ip`          | `String`         | **是**   | `IP`地址                         |
| `port`        | `int`            | **是**   | 端口号                           |
| `clusterName` | `String`         | 否       | 集群名称，默认为`DEFAULT`        |
| `healthy`     | `boolean`        | 否       | 是否只查找健康实例，默认为`true` |
| `weight`      | `double`         | 否       | 实例权重，默认为`1.0`            |
| `enabled`     | `boolean`        | 否       | 是否可用，默认为`true`           |
| `metadata`    | `JSON格式String` | 否       | 实例元数据                       |
| `ephemeral`   | `boolean`        | 否       | 是否为临时实例                   |

### 返回数据

| 参数名 | 参数类型  | 描述         |
|--------|-----------|--------------|
| `data` | `boolean` | 是否执行成功 |

### 示例

* 请求示例

    ```shell
    curl -d 'serviceName=test_service' \
      -d 'ip=127.0.0.1' \
      -d 'port=8090' \
      -d 'weight=0.9' \
      -d 'ephemeral=true' \
      -X PUT 'http://127.0.0.1:8848/nacos/v2/ns/instance'
    ```

* 返回示例

    ```json
    {
          "code": 0,
          "message": "success",
          "data": true
    }
    ```

<h2 id="2.4">查询实例详情</h2>

### 接口描述

查询某个具体实例的详情信息

### 请求方式

`GET`

### 请求URL

`/nacos/v2/ns/instance`

### 请求参数

| 参数名        | 参数类型 | 是否必填 | 描述说明                      |
|---------------|----------|----------|-------------------------------|
| `namespaceId` | `String` | 否       | 命名空间`Id`，默认为`public`  |
| `groupName`   | `String` | 否       | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName` | `String` | **是**   | 服务名                        |
| `clusterName` | `String` | 否       | 集群名称，默认为`DEFAULT`     |
| `ip`          | `String` | **是**   | `IP`地址                      |
| `port`        | `int`    | **是**   | 端口号                        |

### 返回数据

| 参数名             | 参数类型  | 描述说明     |
|--------------------|-----------|--------------|
| `data`             | `Object`  | 实例详情信息 |
| `data.serviceName` | `String`  | 服务名       |
| `data.ip`          | `String`  | `IP`地址     |
| `data.port`        | `int`     | 端口号       |
| `data.clusterName` | `String`  | 集群名称     |
| `data.weight`      | `double`  | 实例权重     |
| `data.healthy`     | `boolean` | 是否健康     |
| `data.instanceId`  | `String`  | 实例`id`     |
| `data.metadata`    | `map`     | 实例元数据   |

### 示例

* 请求示例

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/ns/instance?namespaceId=public&groupName=&serviceName=test_service&ip=127.0.0.1&port=8080'
    ```

* 返回示例

    ```json
    {
    	"code": 0,
    	"message": "success",
    	"data": {
    		"serviceName": "DEFAULT_GROUP@@test_service",
    		"ip": "127.0.0.1",
    		"port": 8080,
    		"clusterName": "DEFAULT",
    		"weight": 1.0,
    		"healthy": true,
    		"instanceId": null,
    		"metadata": {
    			"value": "1"
    		}
    	}
    }
    ```

<h2 id="2.5">查询指定服务的实例列表</h2>

### 接口描述

查询指定服务下的实例详情信息列表

### 请求方式

`GET`

### 请求URL

`/nacos/v2/ns/instance/list`

### 请求头

| 参数名           | 参数类型 | 是否必填 | 描述说明             |
|------------------|----------|----------|----------------------|
| `User-Agent`     | `String` | 否       | 用户代理，默认为空   |
| `Client-Version` | `String` | 否       | 客户端版本，默认为空 |

### 请求参数

| 参数名        | 参数类型  | 是否必填 | 描述说明                               |
|---------------|-----------|----------|----------------------------------------|
| `namespaceId` | `String`  | 否       | 命名空间`Id`，默认为`public`           |
| `groupName`   | `String`  | 否       | 分组名，默认为`DEFAULT_GROUP`        |
| `serviceName` | `String`  | **是**   | 服务名                                 |
| `clusterName` | `String`  | 否       | 集群名称，默认为`DEFAULT`              |
| `ip`          | `String`  | 否       | `IP`地址，默认为空，表示不限制`IP`地址 |
| `port`        | `int`     | 否       | 端口号，默认为`0`，表示不限制端口号    |
| `healthyOnly` | `boolean` | 否       | 是否只获取健康实例，默认为`false`      |
| `app`         | `String`  | 否       | 应用名，默认为空                       |

### 返回数据

| 参数名                                 | 参数类型   | 描述说明      |
|----------------------------------------|------------|-----------|
| `data`                                 |            | 指定服务的实例列表 |
| `data.name`                            | `String`   | 分组名@@服务名  |
| `data.groupName`                       | `String`   | 分组名       |
| `data.clusters`                        | `String`   | 集群名       |
| `data.cacheMillis`                     | `int`      | 缓存时间      |
| `data.hosts`                           | `Object[]` | 实例列表      |
| `data.hosts.ip`                        | `String`   | 实例`IP`    |
| `data.hosts.port`                      | `int`      | 实例端口号     |
| `data.hosts.weight`                    | `double`   | 实例权重      |
| `data.hosts.healthy`                   | `boolean`  | 实例是否健康    |
| `data.hosts.enabled`                   | `boolean`  | 实例是否可用    |
| `data.hosts.ephemeral`                 | `boolean`  | 是否为临时实例   |
| `data.hosts.clusterName`               | `String`   | 实例所在的集群名称 |
| `data.hosts.serviceName`               | `String`   | 服务名       |
| `data.hosts.metadata`                  | `map`      | 实例元数据     |
| `data.hosts.instanceHeartBeatTimeOut`  | `int`      | 实例心跳超时时间  |
| `data.hosts.ipDeleteTimeout`           | `int`      | 实例删除超时时间  |
| `data.hosts.instanceHeartBeatInterval` | `int`      | 实例心跳间隔    |
| `data.lastRefTime`                     | `int`      | 上次刷新时间    |
| `data.checksum`                        | `int`      | 校验码       |
| `data.allIPs`                          | `boolean`  |           |
| `data.reachProtectionThreshold`        | `boolean`  | 是否到达保护阈值  |
| `data.valid`                           | `boolean`  | 是否有效      |

### 示例

* 请求示例

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/ns/instance/list?serviceName=test_service&ip=127.0.0.1'
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

<h2 id="2.6">批量更新实例元数据</h2>

### 接口描述

批量更新实例的元数据,

> 对应元数据的键不存在时，则添加对应元数据

### 请求方式

`PUT`

`Content-Type:application/x-www-form-urlencoded`

### 请求URL

`/nacos/v2/ns/instance/metadata/batch`

### 请求Body

| 参数名            | 参数类型         | 是否必填 | 描述说明                      |
|-------------------|------------------|----------|-------------------------------|
| `namespaceId`     | `String`         | 否       | 命名空间`Id`，默认为`public`  |
| `groupName`       | `String`         | 否       | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName`     | `String`         | **是**   | 服务名                        |
| `consistencyType` | `String`         | 否       | 持久化类型，默认为空          |
| `instances`       | `JSON格式String` | 否       | 需要更新的实例列表，默认为空  |
| `metadata`        | `JSON格式String` | **是**   | 实例元数据                    |

### 参数说明

> - `consistencyType`: 实例的持久化类型，当为‘`persist`’，表示对持久化实例的元数据进行更新；否则表示对临时实例的元数据进行更新
> - `instances`: 待更新的实例列表，`json`数组，通过`ip+port+ephemeral+cluster`定位到某一实例，为空则表示更新指定服务下所有实例的元数据

### 返回数据

| 参数名 | 参数类型  | 描述         |
|--------|-----------|--------------|
| `data` | `boolean` | 是否执行成功 |

### 示例

* 请求示例

    ```shell
    curl -d 'serviceName=test_service' \
      -d 'consistencyType=ephemeral' \
      -d 'instances=[{"ip":"3.3.3.3","port": "8080","ephemeral":"true","clusterName":"xxxx-cluster"},{"ip":"2.2.2.2","port":"8080","ephemeral":"true","clusterName":"xxxx-cluster"}]' \
      -d 'metadata={"age":"20","name":"cocolan"}' \
      -X PUT 'http://127.0.0.1:8848/nacos/v2/ns/instance/metadata/batch'
    ```

* 返回示例

    ```json
    {
          "code": 0,
          "message": "success",
          "data": true
    }
    ```

<h2 id="2.7">批量删除实例元数据</h2>

### 接口描述

批量删除实例的元数据,

> 对应元数据的键不存在时，则不做操作

### 请求方式

`DELETE`

`Content-Type:application/x-www-form-urlencoded`

### 请求URL

`/nacos/v2/ns/instance/metadata/batch`

### 请求Body

| 参数名            | 参数类型         | 是否必填 | 描述说明                      |
|-------------------|------------------|----------|-------------------------------|
| `namespaceId`     | `String`         | 否       | 命名空间`Id`，默认为`public`  |
| `groupName`       | `String`         | 否       | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName`     | `String`         | **是**   | 服务名                        |
| `consistencyType` | `String`         | 否       | 持久化类型，默认为空          |
| `instances`       | `JSON格式String` | 否       | 需要更新的实例列表，默认为空  |
| `metadata`        | `JSON格式String` | **是**   | 实例元数据                    |

### 参数说明

> - `consistencyType`: 实例的持久化类型，当为‘`persist`’，表示对持久化实例的元数据进行删除；否则表示对临时实例的元数据进行
> - `instances`: 待更新的实例列表，`json`数组，通过`ip+port+ephemeral+cluster`定位到某一实例，为空则表示更新指定服务下所有实例的元数据

### 返回数据

| 参数名 | 参数类型  | 描述         |
|--------|-----------|--------------|
| `data` | `boolean` | 是否执行成功 |

### 示例

* 请求示例

    ```shell
    curl -d 'serviceName=test_service' \
      -d 'consistencyType=ephemeral' \
      -d 'instances=[{"ip":"3.3.3.3","port": "8080","ephemeral":"true","clusterName":"xxxx-cluster"},{"ip":"2.2.2.2","port":"8080","ephemeral":"true","clusterName":"xxxx-cluster"}]' \
      -d 'metadata={"age":"20","name":"cocolan"}' \
      -X DELETE 'http://127.0.0.1:8848/nacos/v2/ns/instance/metadata/batch'
    ```

* 返回示例

    ```json
    {
          "code": 0,
          "message": "success",
          "data": true
    }
    ```

<h2 id="2.8">创建服务</h2>

### 接口描述

创建一个服务

> 服务已存在时会创建失败

### 请求方式

`POST`

`Content-Type:application/x-www-form-urlencoded`

### 请求URL

`/nacos/v2/ns/service`

### 请求Body

| 参数名             | 参数类型         | 是否必填 | 描述说明                      |
|--------------------|------------------|----------|-------------------------------|
| `namespaceId`      | `String`         | 否       | 命名空间`Id`，默认为`public`  |
| `groupName`        | `String`         | 否       | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName`      | `String`         | **是**   | 服务名                        |
| `metadata`         | `JSON格式String` | 否       | 服务元数据，默认为空          |
| `ephemeral`        | `boolean`        | 否       | 是否为临时实例，默认为`false` |
| `protectThreshold` | `float`          | 否       | 保护阈值，默认为`0`           |
| `selector`         | `JSON格式String` | 否       | 访问策略，默认为空            |

### 返回数据

| 参数名 | 参数类型  | 描述         |
|--------|-----------|--------------|
| `data` | `boolean` | 是否执行成功 |

### 示例

* 请求示例

    ```shell
    curl -d 'serviceName=nacos.test.1' \
      -d 'ephemeral=true' \
      -d 'metadata={"k1":"v1"}' \
      -X POST 'http://127.0.0.1:8848/nacos/v2/ns/service'
    ```

* 返回示例

    ```json
    {
          "code": 0,
          "message": "success",
          "data": true
    }
    ```

<h2 id="2.9">删除服务</h2>

### 接口描述

删除指定服务

> 服务不存在时会报错，且服务还存在实例时会删除失败

### 请求方式

`DELETE`

### 请求URL

`/nacos/v2/ns/service`

### 请求参数

| 参数名        | 参数类型 | 是否必填 | 描述说明                      |
|---------------|----------|----------|-------------------------------|
| `namespaceId` | `String` | 否       | 命名空间`Id`，默认为`public`  |
| `groupName`   | `String` | 否       | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName` | `String` | **是**   | 服务名                        |

### 返回数据

| 参数名 | 参数类型  | 描述         |
|--------|-----------|--------------|
| `data` | `boolean` | 是否执行成功 |

### 示例

* 请求示例

    ```shell
    curl -X DELETE 'http://127.0.0.1:8848/nacos/v2/ns/service?serviceName=nacos.test.1'
    ```

* 返回示例

    ```json
    {
          "code": 0,
          "message": "success",
          "data": true
    }
    ```

<h2 id="2.10">修改服务</h2>

### 接口描述

更新指定服务

> 服务不存在时会报错

### 请求方式

`POST`

`Content-Type:application/x-www-form-urlencoded`

### 请求URL

`/nacos/v2/ns/service`

### 请求参数

| 参数名             | 参数类型         | 是否必填 | 描述说明                      |
|--------------------|------------------|----------|-------------------------------|
| `namespaceId`      | `String`         | 否       | 命名空间`Id`，默认为`public`  |
| `groupName`        | `String`         | 否       | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName`      | `String`         | **是**   | 服务名                        |
| `metadata`         | `JSON格式String` | 否       | 服务元数据，默认为空          |
| `protectThreshold` | `float`          | 否       | 保护阈值，默认为`0`           |
| `selector`         | `JSON格式String` | 否       | 访问策略，默认为空            |

### 返回数据

| 参数名 | 参数类型  | 描述         |
|--------|-----------|--------------|
| `data` | `boolean` | 是否执行成功 |

### 示例

* 请求示例

    ```shell
    curl -d 'serviceName=nacos.test.1' \
      -d 'metadata={"k1":"v2"}' \
      -X PUT 'http://127.0.0.1:8848/nacos/v2/ns/service'
    ```

* 返回示例

    ```json
    {
          "code": 0,
          "message": "success",
          "data": true
    }
    ```

<h2 id="2.11">查询服务详情</h2>

### 接口描述

查询某个具体服务的详情信息

> 服务不存在时会报错

### 请求方式

`GET`

### 请求URL

`/nacos/v2/ns/service`

### 请求参数

| 参数名        | 参数类型 | 是否必填 | 描述说明                        |
|---------------|----------|----------|---------------------------------|
| `namespaceId` | `String` | 否       | 命名空间`Id`，默认为`public`    |
| `groupName`   | `String` | 否       | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName` | `String` | **是**   | 服务名                          |

### 返回数据

| 参数名                  | 参数类型  | 描述说明       |
|-------------------------|-----------|----------------|
| `data`                  |           | 服务信息       |
| `data.namespace`        | `String`  | 命名空间       |
| `data.groupName`        | `String`  | 分组名         |
| `data.serviceName`      | `String`  | 服务名         |
| `data.clusterMap`       | `map`     | 集群信息       |
| `data.metadata`         | `map`     | 服务元数据     |
| `data.protectThreshold` | `float`   | 保护阈值       |
| `data.selector`         | `Object`  | 访问策略       |
| `data.ephemeral`        | `Boolean` | 是否为临时实例 |

### 示例

* 请求示例

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/ns/service?serviceName=nacos.test.1'
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

<h2 id="2.12">查询服务列表</h2>

### 接口描述

查询符合条件的服务列表

### 请求方式

`GET`

### 请求URL

`/nacos/v2/ns/service/list`

### 请求参数

| 参数名        | 参数类型         | 是否必填 | 描述说明                          |
|---------------|------------------|----------|-----------------------------------|
| `namespaceId` | `String`         | 否       | 命名空间`Id`，默认为`public`      |
| `groupName`   | `String`         | 否       | 分组名，默认为`DEFAULT_GROUP`   |
| `selector`    | `JSON格式String` | **是**   | 访问策略                          |
| `pageNo`      | `int`            | 否       | 当前页，默认为`1`                 |
| `pageSize`    | `int`            | 否       | 页条目数，默认为`20`，最大为`500` |

### 返回数据

| 参数名          | 参数类型   | 描述说明         |
|-----------------|------------|------------------|
| `data`          |            | 服务列表信息     |
| `data.count`    | `String`   | 服务数目         |
| `data.services` | `String[]` | 分页后的服务列表 |

### 示例

* 请求示例

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/ns/service/list'
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

<h2 id="2.13">查询系统开关</h2>

### 接口描述

查询系统开关

### 请求方式

`GET`

### 请求URL

`/nacos/v2/ns/operator/switches`

### 返回数据

| 参数名 | 参数类型 | 描述说明     |
|--------|----------|--------------|
| `data` | `Object` | 系统开关信息 |

### 示例

* 请求示例

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/ns/operator/switches'
    ```

* 返回示例

    ```json
    {
    	"code": 0,
    	"message": "success",
    	"data": {
    		"masters": null,
    		"adWeightMap": {},
    		"defaultPushCacheMillis": 10000,
    		"clientBeatInterval": 5000,
    		"defaultCacheMillis": 3000,
    		"distroThreshold": 0.7,
    		"healthCheckEnabled": true,
    		"autoChangeHealthCheckEnabled": true,
    		"distroEnabled": true,
    		"enableStandalone": true,
    		"pushEnabled": true,
    		"checkTimes": 3,
    		"httpHealthParams": {
    			"max": 5000,
    			"min": 500,
    			"factor": 0.85
    		},
    		"tcpHealthParams": {
    			"max": 5000,
    			"min": 1000,
    			"factor": 0.75
    		},
    		"mysqlHealthParams": {
    			"max": 3000,
    			"min": 2000,
    			"factor": 0.65
    		},
    		"incrementalList": [],
    		"serverStatusSynchronizationPeriodMillis": 2000,
    		"serviceStatusSynchronizationPeriodMillis": 5000,
    		"disableAddIP": false,
    		"sendBeatOnly": false,
    		"lightBeatEnabled": true,
    		"doubleWriteEnabled": false,
    		"limitedUrlMap": {},
    		"distroServerExpiredMillis": 10000,
    		"pushGoVersion": "0.1.0",
    		"pushJavaVersion": "0.1.0",
    		"pushPythonVersion": "0.4.3",
    		"pushCVersion": "1.0.12",
    		"pushCSharpVersion": "0.9.0",
    		"enableAuthentication": false,
    		"overriddenServerStatus": null,
    		"defaultInstanceEphemeral": true,
    		"healthCheckWhiteList": [],
    		"name": "00-00---000-NACOS_SWITCH_DOMAIN-000---00-00",
    		"checksum": null
    	}
    }
    ```

<h2 id="2.14">修改系统开关</h2>

### 接口描述

修改系统开关

### 请求方式

`PUT`

`Content-Type:application/x-www-form-urlencoded`

### 请求URL

`/nacos/v2/ns/operator/switches`

### 请求Body

| 参数名  | 参数类型  | 是否必填  | 描述说明                                                |
|---------|-----------|-------|---------------------------------------------------------|
| `entry` | `String`  | **是** | 开关名                                                  |
| `value` | `String`  | **是** | 开关值                                                  |
| `debug` | `boolean` | 否     | 是否只在本机生效,`true`表示本机生效,`false`表示集群生效 |

### 返回数据

| 参数名 | 参数类型 | 描述             |
|--------|----------|------------------|
| `data` | `String` | “`ok`”表示执行成功 |

### 示例

* 请求示例

    ```shell
    curl -d 'entry=pushEnabled' \
      -d 'value=false' \
      -d 'debug=true' \
      -X PUT 'http://127.0.0.1:8848/nacos/v2/ns/operator/switches'
    ```

* 返回示例

    ```json
    {
          "code": 0,
          "message": "success",
          "data": "ok"
    }
    ```

<h2 id="2.15">查询系统当前数据指标</h2>

### 接口描述

查询系统当前数据指标

### 请求方式

`GET`

### 请求URL

`/nacos/v2/ns/operator/metrics`

### 请求参数

| 参数名       | 参数类型  | 是否必填 | 描述说明                 |
|--------------|-----------|----------|--------------------------|
| `onlyStatus` | `boolean` | 否       | 只显示状态，默认为`true` |

> 当`onlyStatus`设置为`true`时，只返回表示系统状态的字符串

### 返回数据

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

### 示例

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

<h2 id="2.16">更新实例健康状态</h2>

### 接口描述

更新实例的健康状态

### 请求方式

`PUT`

`Content-Type:application/x-www-form-urlencoded`

### 请求URL

`/nacos/v2/ns/health/instance`

### 请求Body

| 参数名        | 参数类型  | 是否必填 | 描述说明                      |
|---------------|-----------|----------|-------------------------------|
| `namespaceId` | `String`  | 否       | 命名空间`Id`，默认为`public`  |
| `groupName`   | `String`  | 否       | 分组名，默认为`DEFAULT_GROUP` |
| `serviceName` | `String`  | **是**   | 服务名                        |
| `clusterName` | `String`  | 否       | 集群名，默认为`DEFAULT`       |
| `ip`          | `String`  | **是**   | `IP`地址                      |
| `port`        | `int`     | **是**   | 端口号                        |
| `healthy`     | `boolean` | **是**   | 是否健康                      |

### 返回数据

| 参数名 | 参数类型 | 描述               |
|--------|----------|--------------------|
| `data` | `String` | “`ok`”表示执行成功 |

### 示例

* 请求示例

    ```shell
    curl -d 'serviceName=nacos.test.1' \
      -d 'ip=127.0.0.1' \
      -d 'port=8080' \
      -d 'healthy=false' \
      -X PUT 'http://127.0.0.1:8848/nacos/v2/ns/health/instance'
    ```

* 返回示例

    ```json
    {
          "code": 0,
          "message": "success",
          "data": "ok"
    }
    ```

<h2 id="2.17">查询客户端列表（新）</h2>

### 接口描述

查询当前所有的客户端列表

### 请求方式

`GET`

### 请求URL

`/nacos/v2/ns/client/list`

### 返回数据

| 参数名 | 参数类型   | 描述说明       |
|--------|------------|----------------|
| `data` | `String[]` | 客户端`id`列表 |

### 示例

* 请求示例

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/ns/client/list'
    ```

* 返回示例

    ```json
    {
    	"code": 0,
    	"message": "success",
    	"data": [
    		"10.128.164.35:9956#true",
    		"1664358687402_127.0.0.1_2300",
    		"1664358642902_127.0.0.1_2229",
    		"192.168.139.1:49825#true",
    		"10.128.164.35:9954#true",
    		"192.168.139.1:53556#true"
    	]
    }
    ```

> 对于不同版本的nacos client，建立客户端的方式不同。
>
> 对于`1.x`版本，每个实例会建立两个基于`ip+port`的客户端，分别对应实例注册与服务订阅，`clientId`格式为 `ip:port#ephemeral`
>
> 对于`2.x`版本的`nacos client`, 每个实例会建立一个`RPC`连接，对应一个基于`RPC`连接的客户端，兼具注册与订阅功能，`clientId`
> 格式为`time_ip_port`



<h2 id="2.18">查询客户端信息（新）</h2>

### 接口描述

查询指定客户端的详细信息

> 客户端不存在时会报错

### 请求方式

`GET`

### 请求URL

`/nacos/v2/ns/client`

### 请求参数

| 参数名     | 参数类型 | 是否必填 | 描述说明   |
|------------|----------|----------|------------|
| `clientId` | `String` | **是**   | 客户端`id` |

### 返回数据

| 参数名                 | 参数类型  | 描述说明       |
|------------------------|-----------|----------------|
| `data`                 | `Object`  | 客户端信息     |
| `data.clientId`        | `String`  | 客户端`id`     |
| `data.ephemeral`       | `boolean` | 是否为临时实例 |
| `data.lastUpdatedTime` | `int`     | 上次更新时间   |
| `data.clientType`      | `String`  | 客户端类型     |
| `data.clientIp`        | `String`  | 客户端`IP`     |
| `data.clientPort`      | `String`  | 客户端端口     |
| `data.connectType`     | `String`  | 连接类型       |
| `data.appName`         | `String`  | 应用名         |
| `data.Version`         | `String`  | 客户端版本     |

> 只有当`clientType`为`connection`时，会显示`connectType`，`appName`和`appName`字段

### 示例

* 请求示例

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/ns/client?clientId=1664527081276_127.0.0.1_4400'
    ```

* 返回示例

    ```json
    {
    	"code": 0,
    	"message": "success",
    	"data": {
    		"clientId": "1664527081276_127.0.0.1_4400",
    		"ephemeral": true,
    		"lastUpdatedTime": 1664527081642,
    		"clientType": "connection",
    		"connectType": "GRPC",
    		"appName": "-",
    		"version": "Nacos-Java-Client:v2.1.0",
    		"clientIp": "10.128.164.35",
    		"clientPort": "4400"
    	}
    }
    ```

<h2 id="2.19">查询客户端的注册信息（新）</h2>

### 接口描述

查询指定客户端的注册信息

> 客户端不存在时会报错

### 请求方式

`GET`

### 请求URL

`/nacos/v2/ns/client/publish/list`

### 请求参数

| 参数名     | 参数类型 | 是否必填 | 描述说明   |
|------------|----------|----------|------------|
| `clientId` | `String` | **是**   | 客户端`id` |

### 返回数据

| 参数名                            | 参数类型   | 描述说明             |
|-----------------------------------|------------|----------------------|
| `data`                            | `Object[]` | 客户端注册的服务列表 |
| `data.namespace`                  | `String`   | 命名空间             |
| `data.group`                      | `String`   | 分组名               |
| `data.serviceName`                | `String`   | 服务名               |
| `data.registeredInstance`         | `Object`   | 该服务下注册的实例   |
| `data.registeredInstance.ip`      | `String`   | `IP`地址             |
| `data.registeredInstance.port`    | `int`      | 端口号               |
| `data.registeredInstance.cluster` | `String`   | 集群名               |

### 示例

* 请求示例

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/ns/client/publish/list?clientId=1664527081276_127.0.0.1_4400'
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

<h2 id="2.20">查询客户端的订阅信息（新）</h2>

### 接口描述

查询指定客户端的订阅信息

> 客户端不存在时会报错

### 请求方式

`GET`

### 请求URL

`/nacos/v2/ns/client/subscribe/list`

### 请求参数

| 参数名     | 参数类型 | 是否必填 | 描述说明   |
|------------|----------|----------|------------|
| `clientId` | `String` | **是**   | 客户端`id` |

### 返回数据

| 参数名                      | 参数类型   | 描述说明             |
|-----------------------------|------------|----------------------|
| `data`                      | `Object[]` | 客户端订阅的服务列表 |
| `data.namespace`            | `String`   | 命名空间             |
| `data.group`                | `String`   | 分组名               |
| `data.serviceName`          | `String`   | 服务名               |
| `data.subscriberInfo`       | `Object`   | 订阅信息             |
| `data.subscriberInfo.app`   | `String`   | 应用                 |
| `data.subscriberInfo.agent` | `String`   | 客户端信息           |
| `data.subscriberInfo.addr`  | `String`   | 地址                 |

### 示例

* 请求示例

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/ns/client/subscribe/list?clientId=1664527081276_127.0.0.1_4400'
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
    			"subscriberInfo": {
    				"app": "unknown",
    				"agent": "Nacos-Java-Client:v2.1.0",
    				"addr": "10.128.164.35"
    			}
    		}
    	]
    }
    ```

<h2 id="2.21">查询注册指定服务的客户端信息（新）</h2>

### 接口描述

查询注册指定服务的客户端信息

### 请求方式

`GET`

### 请求URL

`/nacos/v2/ns/client/service/publisher/list`

### 请求参数

| 参数名        | 参数类型  | 是否必填 | 描述说明                           |
|---------------|-----------|----------|------------------------------------|
| `namespaceId` | `String`  | 否       | 命名空间`Id`，默认为`public`       |
| `groupName`   | `String`  | 否       | 分组名，默认为`DEFAULT_GROUP`      |
| `serviceName` | `String`  | **是**   | 服务名                             |
| `ephemeral`   | `boolean` | 否       | 是否为临时实例                     |
| `ip`          | `String`  | 否       | `IP`地址，默认为空，不限制`IP`地址 |
| `port`        | `int`     | 否       | 端口号，默认为空，表示不限制端口号 |

### 返回数据

| 参数名          | 参数类型 | 描述说明   |
|-----------------|----------|------------|
| `data`          |          | 客户端列表 |
| `data.clientId` | `String` | 客户端`id` |
| `data.ip`       | `String` | 客户端`IP` |
| `data.port`     | `int`    | 客户端端口 |

### 示例

* 请求示例

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/ns/client/service/publisher/list?serviceName=nacos.test.1&ip=&port='
    ```

* 返回示例

    ```json
    {
    	"code": 0,
    	"message": "success",
    	"data": [
    		{
    			"clientId": "1664527081276_127.0.0.1_4400",
    			"ip": "10.128.164.35",
    			"port": 9950
    		},
    		{
    			"clientId": "10.128.164.35:9954#true",
    			"ip": "10.128.164.35",
    			"port": 9954
    		}
    	]
    }
    ```

<h2 id="2.22">查询订阅指定服务的客户端信息（新）</h2>

### 接口描述

查询订阅指定服务的客户端信息

### 请求方式

`GET`

### 请求URL

`/nacos/v2/ns/client/service/subscriber/list`

### 请求参数

| 参数名        | 参数类型 | 是否必填 | 描述说明                           |
|---------------|----------|----------|------------------------------------|
| `namespaceId` | String   | 否       | 命名空间`Id`，默认为`public`       |
| `groupName`   | String   | 否       | 分组名，默认为`DEFAULT_GROUP`      |
| `serviceName` | String   | **是**   | 服务名                             |
| `ephemeral`   | boolean  | 否       | 是否为临时实例                     |
| `ip`          | String   | 否       | `IP`地址，默认为空，不限制`IP`地址 |
| `port`        | int      | 否       | 端口号，默认为空，表示不限制端口号 |

### 返回数据

| 参数名          | 参数类型 | 描述说明   |
|-----------------|----------|------------|
| `data`          |          | 客户端列表 |
| `data.clientId` | `String` | 客户端`id` |
| `data.ip`       | `String` | 客户端`IP` |
| `data.port`     | `int`    | 客户端端口 |

### 示例

* 请求示例

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/ns/client/service/subscriber/list?serviceName=nacos.test.1&ip=&port='
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

## 命名空间

<h2 id="3.1">查询命名空间列表</h2>

### 接口描述

查询当前所有的命名空间

### 请求方式

`GET`

### 请求URL

`/nacos/v2/console/namespace/list`

### 返回数据

| 参数名                   | 参数类型   | 描述说明             |
|--------------------------|------------|----------------------|
| `data`                   | `Object[]` | 命名空间列表         |
| `data.namespace`         | `String`   | 命名空间`ID`         |
| `data.namespaceShowName` | `String`   | 命名空间名称         |
| `data.namespaceDesc`     | `String`   | 命名空间描述         |
| `data.quota`             | `int`      | 命名空间的容量       |
| `data.configCount`       | `int`      | 命名空间下的配置数量 |
| `data.type`              | `int`      | 命名空间类型         |

> 命名空间分为3种类型，`0 `- 全局命名空间   `1` - 默认私有命名空间  `2 `- 自定义命名空间

### 示例

* 请求示例

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/console/namespace/list'
    ```

* 返回示例

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
    			"configCount": 1,
    			"type": 0
    		}
    	]
    }
    ```

<h2 id="3.2">查询具体命名空间</h2>

### 接口描述

查询具体命名空间的信息

> 命名空间不存在时会报错

### 请求方式

`GET`

### 请求URL

`/nacos/v2/console/namespace`

### 请求参数

| 参数名        | 参数类型 | 是否必填 | 描述说明     |
|---------------|----------|----------|--------------|
| `namespaceId` | `String` | **是**   | 命名空间`Id` |

### 返回数据

| 参数名                   | 参数类型 | 描述说明             |
|--------------------------|----------|----------------------|
| `data`                   | `Object` | 命名空间信息         |
| `data.namespace`         | `String` | 命名空间`ID`         |
| `data.namespaceShowName` | `String` | 命名空间名称         |
| `data.namespaceDesc`     | `String` | 命名空间描述         |
| `data.quota`             | `int`    | 命名空间的容量       |
| `data.configCount`       | `int`    | 命名空间下的配置数量 |
| `data.type`              | `int`    | 命名空间类型         |

> 命名空间分为3种类型，`0` - 全局命名空间   `1` - 默认私有命名空间  `2` - 自定义命名空间

### 示例

* 请求示例

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/console/namespace?namespaceId=test_namespace'
    ```

* 返回示例

    ```json
    {
    	"code": 0,
    	"message": "success",
    	"data": {
    		"namespace": "test_namespace",
    		"namespaceShowName": "test",
    		"namespaceDesc": null,
    		"quota": 200,
    		"configCount": 0,
    		"type": 2
    	}
    }
    ```

<h2 id="3.3">创建命名空间</h2>

### 接口描述

创建一个命名空间

> 命名空间已存在时会报错

### 请求方式

`POST`

`Content-Type:application/x-www-form-urlencoded`

### 请求URL

`/nacos/v2/console/namespace`

### 请求Body

| 参数名          | 参数类型 | 是否必填 | 描述说明     |
|-----------------|----------|----------|--------------|
| `namespaceId`   | `String` | **是**   | 命名空间`Id` |
| `namespaceName` | `String` | **是**   | 命名空间名称 |
| `namespaceDesc` | `String` | 否       | 命名空间描述 |

### 返回数据

| 参数名 | 参数类型  | 描述         |
|--------|-----------|--------------|
| `data` | `boolean` | 是否执行成功 |

### 示例

* 请求示例

    ```shell
    curl -d 'namespaceId=test_namespace' \
      -d 'namespaceName=test' \
      -X POST 'http://127.0.0.1:8848/nacos/v2/console/namespace'
    ```

* 返回示例

    ```json
    {
          "code": 0,
          "message": "success",
          "data": true
    }
    ```

<h2 id="3.4">编辑命名空间</h2>

### 接口描述

编辑命名空间信息

### 请求方式

`PUT`

`Content-Type:application/x-www-form-urlencoded`

### 请求URL

`/nacos/v2/console/namespace`

### 请求Body

| 参数名          | 参数类型 | 是否必填 | 描述说明     |
|-----------------|----------|----------|--------------|
| `namespaceId`   | `String` | **是**   | 命名空间`Id` |
| `namespaceName` | `String` | **是**   | 命名空间名称 |
| `namespaceDesc` | `String` | 否       | 命名空间描述 |

### 返回数据

| 参数名 | 参数类型  | 描述         |
|--------|-----------|--------------|
| `data` | `boolean` | 是否执行成功 |

### 示例

* 请求示例

    ```shell
    curl -d 'namespaceId=test_namespace' \
      -d 'namespaceName=test.nacos' \
      -X PUT 'http://127.0.0.1:8848/nacos/v2/console/namespace'
    ```

* 返回示例

    ```json
    {
          "code": 0,
          "message": "success",
          "data": true
    }
    ```

<h2 id="3.5">删除命名空间</h2>

### 接口描述

删除指定命名空间

### 请求方式

`DELETE`

### 请求URL

`/nacos/v2/console/namespace`

### 请求参数

| 参数名        | 参数类型 | 是否必填 | 描述说明     |
|---------------|----------|----------|--------------|
| `namespaceId` | `String` | **是**   | 命名空间`Id` |

### 返回数据

| 参数名 | 参数类型  | 描述         |
|--------|-----------|--------------|
| `data` | `boolean` | 是否执行成功 |

### 示例

* 请求示例

    ```shell
    curl -d 'namespaceId=test_namespace' \
      -X DELETE 'http://127.0.0.1:8848/nacos/v2/console/namespace'
    ```

* 返回示例

    ```json
    {
          "code": 0,
          "message": "success",
          "data": true
    }
    ```

## 集群管理

<h2 id="4.1">查询当前节点信息</h2>

### 接口描述

查询当前`nacos`节点信息

### 请求方式

`GET`

### 请求URL

`/nacos/v2/core/cluster/node/self`

<h3 id="Member">返回数据</h3>

| 参数名               | 参数类型 | 描述说明              |
|----------------------|----------|-----------------------|
| `data`               | `Object` | 当前节点信息          |
| `data.ip`            | `String` | 节点`IP`地址          |
| `data.port`          | `int`    | 节点端口              |
| `data.state`         | `String` | 节点状态              |
| `data.extendInfo`    | `Object` | 节点扩展信息          |
| `data.address`       | `String` | 节点地址（`IP:port`） |
| `data.failAccessCnt` | `int`    | 失败访问次数          |
| `data.abilities`     | `Object` |                       |

### 示例

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
    		"ip": "10.128.164.35",
    		"port": 8848,
    		"state": "UP",
    		"extendInfo": {
    			"lastRefreshTime": 1664521263623,
    			"raftMetaData": {
    				"metaDataMap": {
    					"naming_instance_metadata": {
    						"leader": "10.128.164.35:7848",
    						"raftGroupMember": [
    							"10.128.164.35:7848"
    						],
    						"term": 12
    					},
    					"naming_persistent_service_v2": {
    						"leader": "10.128.164.35:7848",
    						"raftGroupMember": [
    							"10.128.164.35:7848"
    						],
    						"term": 12
    					},
    					"naming_service_metadata": {
    						"leader": "10.128.164.35:7848",
    						"raftGroupMember": [
    							"10.128.164.35:7848"
    						],
    						"term": 12
    					}
    				}
    			},
    			"raftPort": "7848",
    			"readyToUpgrade": true,
    			"version": "2.1.0"
    		},
    		"address": "10.128.164.35:8848",
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
    		}
    	}
    }
    ```

<h2 id="4.2">查询集群节点列表</h2>

### 接口描述

查询集群节点列表

### 请求方式

`GET`

### 请求URL

`/nacos/v2/core/cluster/node/list`

### 请求参数

| 参数名    | 参数类型 | 是否必填 | 描述说明           |
|-----------|----------|----------|--------------------|
| `address` | `String` | 否       | 节点地址，默认为空 |
| `state`   | `String` | 否       | 节点状态，默认为空 |

> `address `对应于需要查询的节点地址的前缀匹配条件，为空时不做限制
>
> `state`对应节点状态的筛选条件，为空时不做限制

### 返回数据

| 参数名 | 参数类型   | 描述说明                              |
|--------|------------|---------------------------------------|
| `data` | `Object[]` | 节点列表，详情参见[节点详情](#Member) |

### 示例

* 请求示例

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/core/cluster/node/list'
    ```

* 返回示例

    ```json
    {
    	"code": 0,
    	"message": "success",
    	"data": [
    		{
    			"ip": "10.128.164.35",
    			"port": 8848,
    			"state": "UP",
    			"extendInfo": {
    				"lastRefreshTime": 1664521263623,
    				"raftMetaData": {
    					"metaDataMap": {
    						"naming_instance_metadata": {
    							"leader": "10.128.164.35:7848",
    							"raftGroupMember": [
    								"10.128.164.35:7848"
    							],
    							"term": 12
    						},
    						"naming_persistent_service_v2": {
    							"leader": "10.128.164.35:7848",
    							"raftGroupMember": [
    								"10.128.164.35:7848"
    							],
    							"term": 12
    						},
    						"naming_service_metadata": {
    							"leader": "10.128.164.35:7848",
    							"raftGroupMember": [
    								"10.128.164.35:7848"
    							],
    							"term": 12
    						}
    					}
    				},
    				"raftPort": "7848",
    				"readyToUpgrade": true,
    				"version": "2.1.0"
    			},
    			"address": "10.128.164.35:8848",
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
    			}
    		}
    	]
    }
    ```

<h2 id="4.3">查询当前节点健康状态</h2>

### 接口描述

查询当前`nacos`节点健康状态

### 请求方式

`GET`

### 请求URL

`/nacos/v2/core/cluster/node/self/health`

<h3 id="Member">返回数据</h3>

| 参数名 | 参数类型 | 描述说明         |
|--------|----------|------------------|
| `data` | `String` | 当前节点健康状态 |

> 节点共有 `STARTING`， `UP`，`SUSPICIOUS`，`DOWN`，`ISOLATION`五种状态

### 示例

* 请求示例

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/core/cluster/node/self/health'
    ```

* 返回示例

    ```json
    {
    	"code": 0,
    	"message": "success",
    	"data": "UP"
    }
    ```


<h2 id="4.4">切换集群寻址模式</h2>

### 接口描述

切换集群寻址模式

### 请求方式

`PUT`

`Content-Type:application/x-www-form-urlencoded`

### 请求URL

`/nacos/v2/core/cluster/lookup`

### 请求Body

| 参数名 | 参数类型 | 是否必填 | 描述说明 |
|--------|----------|----------|----------|
| `type` | `String` | **是**   | 寻址模式 |

> 寻址模式有两种：`file`（文件配置）和 `address-server`（地址服务器）

### 返回数据

| 参数名 | 参数类型  | 描述         |
|--------|-----------|--------------|
| `data` | `boolean` | 是否执行成功 |

### 示例

* 请求示例

    ```shell
    curl -d 'type=file' \
      -X PUT 'http://127.0.0.1:8848/nacos/v2/core/cluster/lookup'
    ```

* 返回示例

    ```json
    {
    	"code": 0,
    	"message": "success",
    	"data": true
    }
    ```


