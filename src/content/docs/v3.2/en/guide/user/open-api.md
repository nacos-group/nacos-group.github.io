---
title: Open API Guide
keywords: [Open API,Guide]
description: Open API Guide
sidebar:
    order: 3
---

# Open API Guide

Nacos 2.X is compatible with Nacos 1.X OpenAPI, please refer to the document [Nacos1.X OpenAPI](https://nacos.io/en/docs/v1/open-api/).

> Attension: OpenAPIs which do not specify a supported version, will be supported since 2.2.0.

- Documentation Conventions
  - [API unified return body format](#0.1)
  - [API error code summary](#0.2)

- Configuration Management
  - [Get configuration](#1.1)
  - [Publish configuration](#1.2)
  - [Delete configuration](#1.3)
  - [Query list of history configuration](#1.4)
  - [Query the history details of the configuration](#1.5)
  - [Query the previous version of the configuration](#1.6)
  - [Query the list of configurations under the specified namespace](#1.7)

- Service Discovery
  - [Register instance](#2.1)
  - [Deregister instance](#2.2)
  - [Modify instance](#2.3)
  - [Query instance detail](#2.4)
  - [Query instances](#2.5)
  - [Batch update instance metadata(Beta)](#2.6)
  - [Batch delete instance metadata(Beta)](#2.7)
  - [Create service](#2.8)
  - [Delete service](#2.9)
  - [Update service](#2.10)
  - [Query service](#2.11)
  - [Query service list](#2.12)
  - [Query system switches](#2.13)
  - [Update system switch](#2.14)
  - [Query system metrics](#2.15)
  - [Update instance health status](#2.16)
  - [Query client list (new)](#2.17)
  - [Query client (new)](#2.18)
  - [Query the registration information of the client (new)](#2.19)
  - [Query the subscription information of the client (new)](#2.20)
  - [Query the client that registered the specified service (new)](#2.21)
  - [Query the information of clients subscribed to the specified service (new)](#2.22)

- Namespace
  - [Query namespaces](#3.1)
  - [Query namespace](#3.2)
  - [Create namespace](#3.3)
  - [Update namespace](#3.4)
  - [Delete namespace](#3.5)

- Cluster
  - [Query the current node](#4.1)
  - [Query the list of cluster nodes](#4.2)
  - [Query the current node health status](#4.3)
  - [Switch addressing modes](#4.4)
- Connection Load Management
  - [Query the List of Current Node Client Connections](#5.1)
  - [Reload the Number of Current Node Client Connections](#5.2)
  - [Intelligently Balance the Number of Client Connections in the Cluster](#5.3)
  - [Reset a Specific Client Connection](#5.4)
  - [Get SDK Metrics for the Cluster](#5.5)


## Documentation Conventions

<h2 id="0.1">API unified return body format</h2>

In Nacos 2.X, the response to all interface requests is a return body of type `json`, which has the same format

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

The meanings of the fields in the return body are shown in the following table

|   name    |   type   | description                                                                                          |
|:---------:|:--------:|------------------------------------------------------------------------------------------------------|
|  `code `  |  `int`   | Error code，`0` means the execution succeeded, non-`0` means the execution failed in one of the cases |
| `message` | `String` | Error code prompt message, execution success as "`success`"                                          |
|  `data`   |  `Any`   | Return data, detailed error message in case of execution failure                                     |

> Since the `code` field is the same as the message field in case of successful execution, only the `data` field of the returned data will be introduced in the subsequent introduction of the returned results of the interface

<h2 id="0.2">API error code summary</h2>

The error codes and corresponding prompt messages in the return body of the API interface are summarized in the following table

| Error Code | message                      | meaning                                          |
|------------|------------------------------|--------------------------------------------------|
| `0`        | `success`                    | Successful execution                             |
| `10000`    | `parameter missing`          | Missing parameters                               |
| `10001`    | `access denied`              | Access Denied                                    |
| `10002`    | `data access error`          | Data access error                                |
| `20001`    | `'tenant' parameter error`   | `tenant` parameter error                         |
| `20002`    | `parameter validate error`   | Parameter validation error                       |
| `20003`    | `MediaType Error`            | `MediaType` error for HTTP requests              |
| `20004`    | `resource not found`         | Resource not found                               |
| `20005`    | `resource conflict`          | Resource access conflicts                        |
| `20006`    | `config listener is null`    | Listening configuration is empty                 |
| `20007`    | `config listener error`      | Listening configuration error                    |
| `20008`    | `invalid dataId`             | Invalid `dataId` (authentication failure)        |
| `20009`    | `parameter mismatch`         | Request parameter mismatch                       |
| `21000`    | `service name error`         | `serviceName` error                              |
| `21001`    | `weight error`               | `weight` error                                   |
| `21002`    | `instance metadata error`    | Instance `metadata` error                        |
| `21003`    | `instance not found`         | `instance` not found                             |
| `21004`    | `instance error`             | `instance` error                                 |
| `21005`    | `service metadata error`     | Service `metadata` error                         |
| `21006`    | `selector error`             | `selector` error                                 |
| `21007`    | `service already exist`      | Service already exists                           |
| `21008`    | `service not exist`          | Service does not exist                           |
| `21009`    | `service delete failure`     | Service instance exists, service deletion failed |
| `21010`    | `healthy param miss`         | `healthy` parameter miss                         |
| `21011`    | `health check still running` | Health check is still running                    |
| `22000`    | `illegal namespace`          | `namespace` is illegal                           |
| `22001`    | `namespace not exist`        | Namespace does not exist                         |
| `22002`    | `namespace already exist`    | Namespace already exists                         |
| `23000`    | `illegal state`              | `state` is illegal                               |
| `23001`    | `node info error`            | Node information error                           |
| `23002`    | `node down failure`          | Node offline operation error                     |
| ...        | ...                          | ...                                              |
| 30000      | `server error`               | Other internal errors                            |

## Configuration Management

<h2 id="1.1">Get configuration</h2>

### Description

Get the specified configuration

### Request Method

`GET`

### Request URL

`/nacos/v2/cs/config`

### Request Parameters

| Parameter     | Type     | Required | Description                    |
|---------------|----------|----------|--------------------------------|
| `namespaceId` | `String` | N        | Namespace, default is `public` |
| `group`       | `String` | **Y**    | Config group name              |
| `dataId`      | `String` | **Y**    | Config name                    |
| `tag`         | `String` | N        | Tag                            |

### Return Data

| Parameter | Type     | Description    |
|-----------|----------|----------------|
| `data`    | `String` | Config content |

### Example

* Request Example

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/cs/config?dataId=nacos.example&group=DEFAULT_GROUP&namespaceId=public'
    ```

* Response Example

    ```json
    {
	      "code": 0,
	      "message": "success",
	      "data": "contentTest"
    }
    ```

<h2 id="1.2">Publish configuration</h2>

### Description

Publish the specified configuration

> Update the configuration when it already exists

### Request Method

`POST`

`Content-Type:application/x-www-form-urlencoded`

### Request URL

`/nacos/v2/cs/config`

### Request Body

| Parameter     | Type     | Required | Description                                          |
|---------------|----------|----------|------------------------------------------------------|
| `namespaceId` | `String` | N        | Namespace, default is `public`                       |
| `group`       | `String` | **Y**    | Config group                                         |
| `dataId`      | `String` | **Y**    | Config name                                          |
| `content`     | `String` | **Y**    | Config content                                       |
| `tag`         | `String` | N        | Tag                                                  |
| `appName`     | `String` | N        | Application name                                     |
| `srcUser`     | `String` | N        | Source user                                          |
| `configTags`  | `String` | N        | Configure Tag list, can be multiple, comma separated |
| `desc`        | `String` | N        | Config description                                   |
| `use`         | `String` | N        | -                                                    |
| `effect`      | `String` | N        | -                                                    |
| `type`        | `String` | N        | Config type                                          |
| `schema`      | `String` | N        | -                                                    |

### Return Data

| Parameter | Type      | Description                         |
|-----------|-----------|-------------------------------------|
| `data`    | `boolean` | Whether the execution is successful |

### Example

* Request Example

    ```shell
    curl -d 'dataId=nacos.example' \
      -d 'group=DEFAULT_GROUP' \
      -d 'namespaceId=public' \
      -d 'content=contentTest' \
      -X POST 'http://127.0.0.1:8848/nacos/v2/cs/config'
    ```

* Response Example

    ```json
    {
	      "code": 0,
	      "message": "success",
	      "data": true
    }
    ```

<h2 id="1.3">Delete configuration</h2>

### Description

Delete the specified configuration

### Request Method

`DELETE`

### Request URL

`/nacos/v2/cs/config`

### Request Parameters

| Parameter     | Type     | Required | Description                    |
|---------------|----------|----------|--------------------------------|
| `namespaceId` | `String` | N        | Namespace, default is `public` |
| `group`       | `String` | **Y**    | Config group name              |
| `dataId`      | `String` | **Y**    | Config name                    |
| `tag`         | `String` | N        | Tag                            |

### Return Data

| Parameter | Type      | Description                         |
|-----------|-----------|-------------------------------------|
| `data`    | `boolean` | Whether the execution is successful |

### Example

* Request Example

    ```shell
    curl -X DELETE 'http://127.0.0.1:8848/nacos/v2/cs/config?dataId=nacos.example&group=DEFAULT_GROUP&namespaceId=public'
    ```

* Response Example

    ```json
    {
          "code": 0,
          "message": "success",
          "data": true
    }
    ```

<h2 id="1.4">Query list of history configuration</h2>

### Description

Get a list of historical versions of the specified configuration

### Request Method

`GET`

### Request URL

`/nacos/v2/cs/history/list`

### Request Parameters

| Parameter     | Type     | Required | Description                                                |
|---------------|----------|----------|------------------------------------------------------------|
| `namespaceId` | `String` | N        | Namespace, default is `public`                             |
| `group`       | `String` | **Y**    | Config group name                                          |
| `dataId`      | `String` | **Y**    | Config name                                                |
| `pageNo`      | `int`    | N        | Current page, default is `1`                               |
| `pageSize`    | `int`    | N        | Number of page entries, default is `100`, maximum is `500` |

### Return Data

| Parameter                 | Type  | Description                                                                  |
|-----------------------|------------|--------------------------------------------------------------------------------|
| `data`                | `Object`   | Paging Search Results                                                          |
| `data.totalCount`     | `int`      | Total                                                                          |
| `data.pageNumber`     | `int`      | Current page                                                                   |
| `data.pagesAvailable` | `int`      | Total number of pages                                                          |
| `data.pageItems`      | `Object[]` | List of historical configuration items, refer to [Historical configuration item](#ConfigHistoryInfo) |

### Example

* Request Example

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/cs/history/list?dataId=nacos.example&group=com.alibaba.nacos&namespaceId='
    ```

* Response Example

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

<h2 id="1.5">Query the history details of the configuration</h2>

### Description

Get the historical configuration of the specified version

### Request Method

`GET`

### Request URL

`/nacos/v2/cs/history`

### Request Parameters

| Parameter     | Type     | Required | Description                    |
|---------------|----------|----------|--------------------------------|
| `namespaceId` | `String` | N        | Namespace, default is `public` |
| `group`       | `String` | **Y**    | Config group name              |
| `dataId`      | `String` | **Y**    | Config name                    |
| `nid`         | `long`   | **Y**    | History configuration id       |

<h3 id="ConfigHistoryInfo">Return Data</h3>

| Parameter               | Type     | Description                     |
|-------------------------|----------|---------------------------------|
| `data`                  | `Object` | Historical configuration item   |
| `data.id`               | `String` | Config `id`                     |
| `data.lastId`           | `int`    |                                 |
| `data.dataId`           | `String` | Config name                     |
| `data.group`            | `String` | config group                    |
| `data.tenant`           | `String` | Tenant (namespace)              |
| `data.appName`          | `String` | Application name                |
| `data.md5`              | `String` | The md5 value of config content |
| `data.content`          | `String` | Config content                  |
| `data.srcIp`            | `String` | Source ip                       |
| `data.srcUser`          | `String` | Source user                     |
| `data.opType`           | `String` | Operator type                   |
| `data.createdTime`      | `String` | Creation time                   |
| `data.lastModifiedTime` | `String` | Last modified time              |
| `data.encryptedDataKey` | `String` |                                 |

### Example

* Request Example

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/cs/history?dataId=nacos.example&group=com.alibaba.nacos&namespaceId=&nid=203'
    ```

* Response Example

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

<h2 id="1.6">Query the previous version of the configuration</h2>

### Description

Get the previous version of the specified configuration

### Request Method

`GET`

### Request URL

`/nacos/v2/cs/history/previous`

### Request Parameters

| Parameter     | Type     | Required | Description                    |
|---------------|----------|----------|--------------------------------|
| `namespaceId` | `String` | N        | Namespace, default is `public` |
| `group`       | `String` | **Y**    | Config group name              |
| `dataId`      | `String` | **Y**    | Config name                    |
| `id`          | `long`   | **Y**    | config id                      |

<h3 id="ConfigHistoryInfo">Return Data</h3>

| Parameter | Type     | Description                                                                                 |
|-----------|----------|---------------------------------------------------------------------------------------------|
| `data`    | `Object` | Historical configuration item, refer to [Historical configuration item](#ConfigHistoryInfo) |

### Example

* Request Example

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/cs/history/previous?id=309135486247505920&dataId=nacos.example&group=com.alibaba.nacos&namespaceId='
    ```

* Response Example

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

<h2 id="1.7">Query the list of configurations under the specified namespace</h2>

### Description

Get the list of configurations under the specified namespace

### Request Method

`GET`

### Request URL

`/nacos/v2/cs/history/configs`

### Request Parameters

| Parameter     | Type     | Required | Description |
|---------------|----------|----------|-------------|
| `namespaceId` | `String` | **Y**    | Namespace   |

### Return Data

| Parameter               | Type       | Description                     |
|-------------------------|------------|---------------------------------|
| `data`                  | `Object[]` | Config list                     |
| `data.id`               | `String`   | config `id`                     |
| `data.dataId`           | `String`   | Config name                     |
| `data.group`            | `String`   | Config group                    |
| `data.content`          | `String`   | Config content                  |
| `data.md5`              | `String`   | the md5 value of config content |
| `data.encryptedDataKey` | `String`   |                                 |
| `data.tenant`           | `String`   | Tenant (namespace)              |
| `data.appName`          | `String`   | Application name                |
| `data.type`             | `String`   | config file Type                |
| `data.lastModified`     | `long`     | Last modified time              |

> Only the `dataId`, `group`, `tenant`, `appName`, `type` fields are valid for the configuration information in the returned data, the other fields are default values

### Example

* Request Example

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/cs/history/configs?namespaceId='
    ```

* Response Example

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

## Service Discovery

<h2 id="2.1">Register instance</h2>

### Description

Register an instance

### Request Method

`POST`

`Content-Type:application/x-www-form-urlencoded`

### Request URL

`/nacos/v2/ns/instance`

### Request Body

| Parameter     | Type                 | Required | Description                                               |
|---------------|----------------------|----------|-----------------------------------------------------------|
| `namespaceId` | `String`             | N        | Namespace`Id`, default is `public`                        |
| `groupName`   | `String`             | N        | Group name, default is `DEFAULT_GROUP`                    |
| `serviceName` | `String`             | **Y**    | Service name                                              |
| `ip`          | `String`             | **Y**    | `IP` address                                              |
| `port`        | `int`                | **Y**    | Port number                                               |
| `clusterName` | `String`             | N        | Cluster name, default is `DEFAULT`                        |
| `healthy`     | `boolean`            | N        | Whether to find only healthy instances, default is `true` |
| `weight`      | `double`             | N        | Instance weights, default is `1.0`                        |
| `enabled`     | `boolean`            | N        | Enable or not, default is `true`                          |
| `metadata`    | `JSON format String` | N        | Instance metadata                                         |
| `ephemeral`   | `boolean`            | N        | Whether it is a temporary instance                        |

### Return Data

| Parameter | Type      | Description                         |
|-----------|-----------|-------------------------------------|
| `data`    | `boolean` | Whether the execution is successful |

### Example

* Request Example

    ```shell
    curl -d 'serviceName=test_service' \
      -d 'ip=127.0.0.1' \
      -d 'port=8090' \
      -d 'weight=0.9' \
      -d 'ephemeral=true' \
      -X POST 'http://127.0.0.1:8848/nacos/v2/ns/instance'
    ```

* Response Example

    ```json
    {
          "code": 0,
          "message": "success",
          "data": true
    }
    ```

<h2 id="2.2">Deregister instance</h2>

### Description

Deregister a specified instance

### Request Method

`DELETE`

`Content-Type:application/x-www-form-urlencoded`

### Request URL

`/nacos/v2/ns/instance`

### Request Body

| Parameter     | Type                 | Required | Description                                               |
|---------------|----------------------|----------|-----------------------------------------------------------|
| `namespaceId` | `String`             | N        | Namespace`Id`, default is `public`                        |
| `groupName`   | `String`             | N        | Group name, default is `DEFAULT_GROUP`                    |
| `serviceName` | `String`             | **Y**    | Service name                                              |
| `ip`          | `String`             | **Y**    | `IP` address                                              |
| `port`        | `int`                | **Y**    | Port number                                               |
| `clusterName` | `String`             | N        | Cluster name, default is `DEFAULT`                        |
| `healthy`     | `boolean`            | N        | Whether to find only healthy instances, default is `true` |
| `weight`      | `double`             | N        | Instance weights, default is `1.0`                        |
| `enabled`     | `boolean`            | N        | Enable or not, default is `true`                          |
| `metadata`    | `JSON format String` | N        | Instance metadata                                         |
| `ephemeral`   | `boolean`            | N        | Whether it is a temporary instance                        |

### Return Data

| Parameter | Type      | Description                         |
|-----------|-----------|-------------------------------------|
| `data`    | `boolean` | Whether the execution is successful |

### Example

* Request Example

    ```shell
    curl -d 'serviceName=test_service' \
      -d 'ip=127.0.0.1' \
      -d 'port=8090' \
      -d 'weight=0.9' \
      -d 'ephemeral=true' \
      -X DELETE 'http://127.0.0.1:8848/nacos/v2/ns/instance'
    ```

* Response Example

    ```json
    {
          "code": 0,
          "message": "success",
          "data": true
    }
    ```

<h2 id="2.3">Modify instance</h2>

### Description

Modify instance information

> The metadata updated through this interface has a higher priority and has the ability to remember. After the instance removed, it will still exist for a period of time. If the instance is re-registered during this period, the metadata will still be Effective. You can modify the memory time through `nacos.naming.clean.expired-metadata.expired-time` **and** `nacos.naming.clean.expired-metadata.interval`

### Request Method

`PUT`

`Content-Type:application/x-www-form-urlencoded`

### Request URL

`/nacos/v2/ns/instance`

### Request Body

| Parameter     | Type                 | Required | Description                                               |
|---------------|----------------------|----------|-----------------------------------------------------------|
| `namespaceId` | `String`             | N        | Namespace`Id`, default is `public`                        |
| `groupName`   | `String`             | N        | Group name, default is `DEFAULT_GROUP`                    |
| `serviceName` | `String`             | **Y**    | Service name                                              |
| `ip`          | `String`             | **Y**    | `IP` address                                              |
| `port`        | `int`                | **Y**    | Port number                                               |
| `clusterName` | `String`             | N        | Cluster name, default is `DEFAULT`                        |
| `healthy`     | `boolean`            | N        | Whether to find only healthy instances, default is `true` |
| `weight`      | `double`             | N        | Instance weights, default is `1.0`                        |
| `enabled`     | `boolean`            | N        | Enable or not, default is `true`                          |
| `metadata`    | `JSON format String` | N        | Instance metadata                                         |
| `ephemeral`   | `boolean`            | N        | Whether it is a temporary instance                        |

### Return Data

| Parameter | Type      | Description                         |
|-----------|-----------|-------------------------------------|
| `data`    | `boolean` | Whether the execution is successful |

### Example

* Request Example

    ```shell
    curl -d 'serviceName=test_service' \
      -d 'ip=127.0.0.1' \
      -d 'port=8090' \
      -d 'weight=0.9' \
      -d 'ephemeral=true' \
      -X PUT 'http://127.0.0.1:8848/nacos/v2/ns/instance'
    ```

* Response Example

    ```json
    {
          "code": 0,
          "message": "success",
          "data": true
    }
    ```

<h2 id="2.4">Query instance detail</h2>

### Description

Query the details of a specific instance

### Request Method

`GET`

### Request URL

`/nacos/v2/ns/instance`

### Request Parameters

| Parameter     | Type     | Required | Description                            |
|---------------|----------|----------|----------------------------------------|
| `namespaceId` | `String` | N        | Namespace`Id`, default is `public`     |
| `groupName`   | `String` | N        | Group name, default is `DEFAULT_GROUP` |
| `serviceName` | `String` | **Y**    | Service name                           |
| `clusterName` | `String` | N        | Cluster name, default is `DEFAULT`     |
| `ip`          | `String` | **Y**    | `IP` address                           |
| `port`        | `int`    | **Y**    | Port number                            |

### Return Data

| Parameter          | Type      | Description                  |
|--------------------|-----------|------------------------------|
| `data`             | `Object`  | Instance details information |
| `data.serviceName` | `String`  | Service name                 |
| `data.ip`          | `String`  | `IP` address                 |
| `data.port`        | `int`     | Port number                  |
| `data.clusterName` | `String`  | Cluster name                 |
| `data.weight`      | `double`  | Instance weight              |
| `data.healthy`     | `boolean` | healthy                      |
| `data.instanceId`  | `String`  | Instance `id`                |
| `data.metadata`    | `map`     | Instance metadata            |

### Example

* Request Example

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/ns/instance?namespaceId=public&groupName=&serviceName=test_service&ip=127.0.0.1&port=8080'
    ```

* Response Example

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

<h2 id="2.5">Query instances</h2>

### Description

Query the list of instances under the specified service

### Request Method

`GET`

### Request URL

`/nacos/v2/ns/instance/list`

### Request Header

| Parameter        | Type     | Required | Description                      |
|------------------|----------|----------|----------------------------------|
| `User-Agent`     | `String` | N        | User agent, default is empty     |
| `Client-Version` | `String` | N        | Client version, default is empty |

### Request Parameters

| Parameter     | Type      | Required | Description                                                                     |
|---------------|-----------|----------|---------------------------------------------------------------------------------|
| `namespaceId` | `String`  | N        | Namespace`Id`, default is `public`                                              |
| `groupName`   | `String`  | N        | Group name, default is empty                                                    |
| `serviceName` | `String`  | **Y**    | Service name                                                                    |
| `clusterName` | `String`  | N        | Cluster name, default is `DEFAULT`                                              |
| `ip`          | `String`  | N        | `IP` address, the default is empty, which means no restrictions on `IP` address |
| `port`        | `int`     | N        | Port numberThe default is `0`, which means no restriction on port number        |
| `healthyOnly` | `boolean` | N        | Whether to get only healthy instances, default is `false`                       |
| `app`         | `String`  | N        | Application name, default is empty                                              |

### Return Data

| Parameter                              | Type       | Description                                       |
|----------------------------------------|------------|---------------------------------------------------|
| `data`                                 |            | List of instances of the specified service        |
| `data.name`                            | `String`   | Group name@@Service name                          |
| `data.groupName`                       | `String`   | Group name                                        |
| `data.clusters`                        | `String`   | Cluster name                                      |
| `data.cacheMillis`                     | `int`      | Cache name                                        |
| `data.hosts`                           | `Object[]` | Instance list                                     |
| `data.hosts.ip`                        | `String`   | Instance `IP`                                     |
| `data.hosts.port`                      | `int`      | Instance Port number                              |
| `data.hosts.weight`                    | `double`   | Instance weight                                   |
| `data.hosts.healthy`                   | `boolean`  | Instance healthy                                  |
| `data.hosts.enabled`                   | `boolean`  | Instance is enabled                               |
| `data.hosts.ephemeral`                 | `boolean`  | Whether it is a temporary instance                |
| `data.hosts.clusterName`               | `String`   | Name of the cluster where the instance is located |
| `data.hosts.serviceName`               | `String`   | Service name                                      |
| `data.hosts.metadata`                  | `map`      | Instance metadata                                 |
| `data.hosts.instanceHeartBeatTimeOut`  | `int`      | Instance heartbeat timeout time                   |
| `data.hosts.ipDeleteTimeout`           | `int`      | Instance delete timeout time                      |
| `data.hosts.instanceHeartBeatInterval` | `int`      | Instance heartbeat interval                       |
| `data.lastRefTime`                     | `int`      | last refresh time                                 |
| `data.checksum`                        | `int`      | checksum                                          |
| `data.allIPs`                          | `boolean`  |                                                   |
| `data.reachProtectionThreshold`        | `boolean`  | Whether the protection threshold is reached       |
| `data.valid`                           | `boolean`  | Valid                                             |

### Example

* Request Example

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/ns/instance/list?serviceName=test_service&ip=127.0.0.1'
    ```

* Response Example

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

<h2 id="2.6">Batch update instance metadata</h2>

### Description

Batch update instance metadata

> If the key corresponding to the metadata does not exist, add the corresponding metadata.

### Request Method

`PUT`

`Content-Type:application/x-www-form-urlencoded`

### Request URL

`/nacos/v2/ns/instance/metadata/batch`

### Request Body

| Parameter         | Type                 | Required | Description                            |
|-------------------|----------------------|----------|----------------------------------------|
| `namespaceId`     | `String`             | N        | Namespace`Id`, default is `public`     |
| `groupName`       | `String`             | N        | Group name, default is `DEFAULT_GROUP` |
| `serviceName`     | `String`             | **Y**    | Service name                           |
| `consistencyType` | `String`             | N        | Persistence type,  default is empty    |
| `instances`       | `JSON format String` | N        | Instance list, default is empty        |
| `metadata`        | `JSON format String` | **Y**    | Instance metadata                      |

### Parameter Description

> - `consistencyType`: Persistence type of Instance, when ``persist`'' means update the metadata of persistent Instance; otherwise means update the metadata of temporary Instance
> - `instances`: Instance list to be updated, `json` array, locate an instance by `ip+port+ephemeral+cluster`, null means update the metadata of all instances under the specified service

### Return Data

| Parameter | Type      | Description                         |
|-----------|-----------|-------------------------------------|
| `data`    | `boolean` | Whether the execution is successful |

### Example

* Request Example

    ```shell
    curl -d 'serviceName=test_service' \
      -d 'consistencyType=ephemeral' \
      -d 'instances=[{"ip":"3.3.3.3","port": "8080","ephemeral":"true","clusterName":"xxxx-cluster"},{"ip":"2.2.2.2","port":"8080","ephemeral":"true","clusterName":"xxxx-cluster"}]' \
      -d 'metadata={"age":"20","name":"cocolan"}' \
      -X PUT 'http://127.0.0.1:8848/nacos/v2/ns/instance/metadata/batch'
    ```

* Response Example

    ```json
    {
          "code": 0,
          "message": "success",
          "data": true
    }
    ```

<h2 id="2.7">Batch delete instance metadata</h2>

### Description

Batch delete instance metadata

> If the key corresponding to the metadata does not exist, then no operation is performed

### Request Method

`DELETE`

`Content-Type:application/x-www-form-urlencoded`

### Request URL

`/nacos/v2/ns/instance/metadata/batch`

### Request Body

| Parameter         | Type                 | Required | Description                            |
|-------------------|----------------------|----------|----------------------------------------|
| `namespaceId`     | `String`             | N        | Namespace`Id`, default is `public`     |
| `groupName`       | `String`             | N        | Group name, default is `DEFAULT_GROUP` |
| `serviceName`     | `String`             | **Y**    | Service name                           |
| `consistencyType` | `String`             | N        | Persistence type,  default is empty    |
| `instances`       | `JSON format String` | N        | Instance list, default is empty        |
| `metadata`        | `JSON format String` | **Y**    | Instance metadata                      |

### Parameter Description

> - `consistencyType`: Persistence type of Instance, when ``persist`'' means update the metadata of persistent Instance; otherwise means update the metadata of temporary Instance
> - `instances`: Instance list to be updated, `json` array, locate an instance by `ip+port+ephemeral+cluster`, null means update the metadata of all instances under the specified service

### Return Data

| Parameter | Type      | Description                         |
|-----------|-----------|-------------------------------------|
| `data`    | `boolean` | Whether the execution is successful |

### Example

* Request Example

    ```shell
    curl -d 'serviceName=test_service' \
      -d 'consistencyType=ephemeral' \
      -d 'instances=[{"ip":"3.3.3.3","port": "8080","ephemeral":"true","clusterName":"xxxx-cluster"},{"ip":"2.2.2.2","port":"8080","ephemeral":"true","clusterName":"xxxx-cluster"}]' \
      -d 'metadata={"age":"20","name":"cocolan"}' \
      -X DELETE 'http://127.0.0.1:8848/nacos/v2/ns/instance/metadata/batch'
    ```

* Response Example

    ```json
    {
          "code": 0,
          "message": "success",
          "data": true
    }
    ```

<h2 id="2.8">Create service</h2>

### Description

Create a service

> Failed to create when service already exists

### Request Method

`POST`

`Content-Type:application/x-www-form-urlencoded`

### Request URL

`/nacos/v2/ns/service`

### Request Body

| Parameter          | Type                 | Required | Description                                            |
|--------------------|----------------------|----------|--------------------------------------------------------|
| `namespaceId`      | `String`             | N        | Namespace`Id`, default is `public`                     |
| `groupName`        | `String`             | N        | Group name, default is `DEFAULT_GROUP`                 |
| `serviceName`      | `String`             | **Y**    | Service name                                           |
| `metadata`         | `JSON format String` | N        | Service metadata, default is empty                     |
| `ephemeral`        | `boolean`            | N        | Whether it is a temporary instance, default is `false` |
| `protectThreshold` | `float`              | N        | Protection threshold, default is `0`                   |
| `selector`         | `JSON format String` | N        | Selector, default is empty                             |

### Return Data

| Parameter | Type      | Description                         |
|-----------|-----------|-------------------------------------|
| `data`    | `boolean` | Whether the execution is successful |

### Example

* Request Example

    ```shell
    curl -d 'serviceName=nacos.test.1' \
      -d 'ephemeral=true' \
      -d 'metadata={"k1":"v1"}' \
      -X POST 'http://127.0.0.1:8848/nacos/v2/ns/service'
    ```

* Response Example

    ```json
    {
          "code": 0,
          "message": "success",
          "data": true
    }
    ```

<h2 id="2.9">Delete service</h2>

### Description

Delete the specified service

> An error is reported when the service does not exist, and deletion fails when an instance of the service still exists

### Request Method

`DELETE`

### Request URL

`/nacos/v2/ns/service`

### Request Parameters

| Parameter     | Type     | Required | Description                            |
|---------------|----------|----------|----------------------------------------|
| `namespaceId` | `String` | N        | Namespace`Id`, default is `public`     |
| `groupName`   | `String` | N        | Group name, default is `DEFAULT_GROUP` |
| `serviceName` | `String` | **Y**    | Service name                           |

### Return Data

| Parameter | Type      | Description                         |
|-----------|-----------|-------------------------------------|
| `data`    | `boolean` | Whether the execution is successful |

### Example

* Request Example

    ```shell
    curl -X DELETE 'http://127.0.0.1:8848/nacos/v2/ns/service?serviceName=nacos.test.1'
    ```

* Response Example

    ```json
    {
          "code": 0,
          "message": "success",
          "data": true
    }
    ```

<h2 id="2.10">Update service</h2>

### Description

Update the specified service

> Error when service does not exist

### Request Method

`POST`

`Content-Type:application/x-www-form-urlencoded`

### Request URL

`/nacos/v2/ns/service`

### Request Parameters

| Parameter          | Type                 | Required | Description                            |
|--------------------|----------------------|----------|----------------------------------------|
| `namespaceId`      | `String`             | N        | Namespace`Id`, default is `public`     |
| `groupName`        | `String`             | N        | Group name, default is `DEFAULT_GROUP` |
| `serviceName`      | `String`             | **Y**    | Service name                           |
| `metadata`         | `JSON format String` | N        | Service metadata, default is empty     |
| `protectThreshold` | `float`              | N        | Protection threshold, default is `0`   |
| `selector`         | `JSON format String` | N        | Selector, default is empty             |

### Return Data

| Parameter | Type      | Description                         |
|-----------|-----------|-------------------------------------|
| `data`    | `boolean` | Whether the execution is successful |

### Example

* Request Example

    ```shell
    curl -d 'serviceName=nacos.test.1' \
      -d 'metadata={"k1":"v2"}' \
      -X PUT 'http://127.0.0.1:8848/nacos/v2/ns/service'
    ```

* Response Example

    ```json
    {
          "code": 0,
          "message": "success",
          "data": true
    }
    ```

<h2 id="2.11">Query service</h2>

### Description

Query detailed information about a specific service

> Error when service does not exist

### Request Method

`GET`

### Request URL

`/nacos/v2/ns/service`

### Request Parameters

| Parameter     | Type     | Required | Description                        |
|---------------|----------|----------|------------------------------------|
| `namespaceId` | `String` | N        | Namespace`Id`, default is `public` |
| `groupName`   | `String` | N        | Group name, default is empty       |
| `serviceName` | `String` | **Y**    | Service name                       |

### Return Data

| Parameter               | Type      | Description                        |
|-------------------------|-----------|------------------------------------|
| `data`                  |           | Service information                |
| `data.namespace`        | `String`  | Namespace                          |
| `data.groupName`        | `String`  | Group name                         |
| `data.serviceName`      | `String`  | Service name                       |
| `data.clusterMap`       | `map`     | Cluster information                |
| `data.metadata`         | `map`     | Service metadata                   |
| `data.protectThreshold` | `float`   | Protection threshold               |
| `data.selector`         | `Object`  | Selector                           |
| `data.ephemeral`        | `Boolean` | Whether it is a temporary instance |

### Example

* Request Example

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/ns/service?serviceName=nacos.test.1'
    ```

* Response Example

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

<h2 id="2.12">Query service list</h2>

### Description

Check the list of eligible services

### Request Method

`GET`

### Request URL

`/nacos/v2/ns/service/list`

### Request Parameters

| Parameter     | Type                 | Required | Description                                  |
|---------------|----------------------|----------|----------------------------------------------|
| `namespaceId` | `String`             | N        | Namespace`Id`, default is `public`           |
| `groupName`   | `String`             | N        | Group name, default is empty                 |
| `selector`    | `JSON format String` | **Y**    | Selector                                     |
| `pageNo`      | `int`                | N        | Current page, default is `1`                 |
| `pageSize`    | `int`                | N        | Number of page, default is `20`, Up to `500` |

### Return Data

| Parameter       | Type       | Description               |
|-----------------|------------|---------------------------|
| `data`          |            | Service list              |
| `data.count`    | `String`   | Number of services        |
| `data.services` | `String[]` | Service list after paging |

### Example

* Request Example

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/ns/service/list'
    ```

* Response Example

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

<h2 id="2.13">Query system switches</h2>

### Description

Query system switches

### Request Method

`GET`

### Request URL

`/nacos/v2/ns/operator/switches`

### Return Data

| Parameter | Type     | Description               |
|-----------|----------|---------------------------|
| `data`    | `Object` | System switch information |

### Example

* Request Example

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/ns/operator/switches'
    ```

* Response Example

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

<h2 id="2.14">Update system switch</h2>

### Description

Update system switch

### Request Method

`PUT`

`Content-Type:application/x-www-form-urlencoded`

### Request URL

`/nacos/v2/ns/operator/switches`

### Request Body

| Parameter | Type      | Required | Description                                                                                                                          |
|-----------|-----------|----------|--------------------------------------------------------------------------------------------------------------------------------------|
| `entry`   | `String`  | **Y**    | Entry                                                                                                                                |
| `value`   | `String`  | **Y**    | Value                                                                                                                                |
| `debug`   | `boolean` | N        | Whether it takes effect on local machine only,`true` means it takes effect on local machine,`false` means it takes effect on cluster |

### Return Data

| Parameter | Type     | Description                         |
|-----------|----------|-------------------------------------|
| `data`    | `String` | "ok" indicates successful execution |

### Example

* Request Example

    ```shell
    curl -d 'entry=pushEnabled' \
      -d 'value=false' \
      -d 'debug=true' \
      -X PUT 'http://127.0.0.1:8848/nacos/v2/ns/operator/switches'
    ```

* Response Example

    ```json
    {
          "code": 0,
          "message": "success",
          "data": "ok"
    }
    ```

<h2 id="2.15">Query system metrics</h2>

### Description

Query system metrics

### Request Method

`GET`

### Request URL

`/nacos/v2/ns/operator/metrics`

### Request Parameters

| Parameter    | Type      | Required | Description                         |
|--------------|-----------|----------|-------------------------------------|
| `onlyStatus` | `boolean` | N        | Show status only, default is `true` |

> When `onlyStatus` is set to `true`, only the string indicating the system status is returned

### Return Data

| Parameter                          | Type     | Description                      |
|------------------------------------|----------|----------------------------------|
| `data`                             | `Object` | System metrics                   |
| `data.status`                      | `String` | System status                    |
| `data.serviceCount`                | `int`    | Number of services               |
| `data.instanceCount`               | `int`    | Number of instances              |
| `data.subscribeCount`              | `int`    | Number of subscriptions          |
| `data.raftNotifyTaskCount`         | `int`    | Number of `Raft` notify task     |
| `data.responsibleServiceCount`     | `int`    |                                  |
| `data.responsibleInstanceCount`    | `int`    |                                  |
| `data.clientCount`                 | `int`    | Number of client                 |
| `data.connectionBasedClientCount`  | `int`    | Number of connectionBasedClient  |
| `data.ephemeralIpPortClientCount`  | `int`    | Number of ephemeralIpPortClient  |
| `data.persistentIpPortClientCount` | `int`    | Number of persistentIpPortClient |
| `data.responsibleClientCount`      | `int`    |                                  |
| `data.cpu`                         | `float`  | `cpu` utilization                |
| `data.load`                        | `float`  | load                             |
| `data.mem`                         | `float`  | Memory usage                     |

### Example

* Request Example

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/ns/operator/metrics'
    ```

* Response Example

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

<h2 id="2.16">Update instance health status</h2>

### Description

Update the health status of the instance

### Request Method

`PUT`

`Content-Type:application/x-www-form-urlencoded`

### Request URL

`/nacos/v2/ns/health/instance`

### Request Body

| Parameter     | Type      | Required | Description                            |
|---------------|-----------|----------|----------------------------------------|
| `namespaceId` | `String`  | N        | Namespace`Id`, default is `public`     |
| `groupName`   | `String`  | N        | Group name, default is `DEFAULT_GROUP` |
| `serviceName` | `String`  | **Y**    | Service name                           |
| `clusterName` | `String`  | N        | Cluster name, default is `DEFAULT`     |
| `ip`          | `String`  | **Y**    | `IP` address                           |
| `port`        | `int`     | **Y**    | Port number                            |
| `healthy`     | `boolean` | **Y**    | healthy                                |

### Return Data

| Parameter | Type     | Description                           |
|-----------|----------|---------------------------------------|
| `data`    | `String` | "`ok`" indicates successful execution |

### Example

* Request Example

    ```shell
    curl -d 'serviceName=nacos.test.1' \
      -d 'ip=127.0.0.1' \
      -d 'port=8080' \
      -d 'healthy=false' \
      -X PUT 'http://127.0.0.1:8848/nacos/v2/ns/health/instance'
    ```

* Response Example

    ```json
    {
          "code": 0,
          "message": "success",
          "data": "ok"
    }
    ```

<h2 id="2.17">Query client list (new)</h2>

### Description

Query the current list of all clients

### Request Method

`GET`

### Request URL

`/nacos/v2/ns/client/list`

### Return Data

| Parameter | Type       | Description      |
|-----------|------------|------------------|
| `data`    | `String[]` | Client `id` list |

### Example

* Request Example

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/ns/client/list'
    ```

* Response Example

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

> For different versions of the nacos client, there are different ways to create clients.
>
> For `nacos client` in `1.x` version, each Instance will create two clients based on `ip+port`, corresponding to Instance registration and service subscription, respectively, with `clientId` in the format `ip:port#ephemeral`
>
> For `nacos client` in `2.x` version, each Instance establishes a `RPC` connection, which corresponds to an `RPC` connection-based client with both registration and subscription functions, with `clientId` in the format `time_ip_port`


<h2 id="2.18">Query client (new)</h2>

### Description

Query the details of the specified client

> Error when client does not exist

### Request Method

`GET`

### Request URL

`/nacos/v2/ns/client`

### Request Parameters

| Parameter      | Type| Required | Description   |
|------------|----------|----------|------------|
| `clientId` | `String` | **Y**   | Client `id` |

### Return Data

| Parameter              | Type      | Description                        |
|------------------------|-----------|------------------------------------|
| `data`                 | `Object`  | Client Information                 |
| `data.clientId`        | `String`  | Client `id`                        |
| `data.ephemeral`       | `boolean` | Whether it is a temporary instance |
| `data.lastUpdatedTime` | `int`     | Last update time                   |
| `data.clientType`      | `String`  | Client type                        |
| `data.clientIp`        | `String`  | Client `IP`                        |
| `data.clientPort`      | `String`  | Client `port`                      |
| `data.connectType`     | `String`  | Connection type                    |
| `data.appName`         | `String`  | Application name                   |
| `data.Version`         | `String`  | Client version                     |

> Only when `clientType` is `connection`, the `connectType`, `appName` and `appName` fields will be displayed

### Example

* Request Example

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/ns/client?clientId=1664527081276_127.0.0.1_4400'
    ```

* Response Example

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

<h2 id="2.19">Query the registration information of the client (new)</h2>

### Description

Query the registration information of the specified client

> Error when client does not exist

### Request Method

`GET`

### Request URL

`/nacos/v2/ns/client/publish/list`

### Request Parameters

| Parameter  | Type     | Required | Description |
|------------|----------|----------|-------------|
| `clientId` | `String` | **Y**    | Client `id` |

### Return Data

| Parameter                         | Type       | Description                               |
|-----------------------------------|------------|-------------------------------------------|
| `data`                            | `Object[]` | List of services registered by the client |
| `data.namespace`                  | `String`   | Namespace                                 |
| `data.group`                      | `String`   | Group name                                |
| `data.serviceName`                | `String`   | Service name                              |
| `data.registeredInstance`         | `Object`   | Instances registered under this service   |
| `data.registeredInstance.ip`      | `String`   | `IP` address                              |
| `data.registeredInstance.port`    | `int`      | Port number                               |
| `data.registeredInstance.cluster` | `String`   | Cluster name                              |

### Example

* Request Example

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/ns/client/publish/list?clientId=1664527081276_127.0.0.1_4400'
    ```

* Response Example

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

<h2 id="2.20">Query the subscription information of the client (new)</h2>

### Description

Query the subscription information of the specified client

> Error when client does not exist

### Request Method

`GET`

### Request URL

`/nacos/v2/ns/client/subscribe/list`

### Request Parameters

| Parameter  | Type     | Required | Description |
|------------|----------|----------|-------------|
| `clientId` | `String` | **Y**    | Client `id` |

### Return Data

| Parameter                   | Type       | Description                                        |
|-----------------------------|------------|----------------------------------------------------|
| `data`                      | `Object[]` | List of services to which the client is subscribed |
| `data.namespace`            | `String`   | Namespace                                          |
| `data.group`                | `String`   | Group name                                         |
| `data.serviceName`          | `String`   | Service name                                       |
| `data.subscriberInfo`       | `Object`   | Subscription Information                           |
| `data.subscriberInfo.app`   | `String`   | Application                                        |
| `data.subscriberInfo.agent` | `String`   | Client Information                                 |
| `data.subscriberInfo.addr`  | `String`   | Address                                            |

### Example

* Request Example

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/ns/client/subscribe/list?clientId=1664527081276_127.0.0.1_4400'
    ```

* Response Example

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

<h2 id="2.21">Query the client that registered the specified service (new)</h2>

### Description

Query the client information of the registered specified service

### Request Method

`GET`

### Request URL

`/nacos/v2/ns/client/service/publisher/list`

### Request Parameters

| Parameter     | Type      | Required | Description                                                         |
|---------------|-----------|----------|---------------------------------------------------------------------|
| `namespaceId` | `String`  | N        | Namespace`Id`, default is `public`                                  |
| `groupName`   | `String`  | N        | Group name, default is `DEFAULT_GROUP`                              |
| `serviceName` | `String`  | **Y**    | Service name                                                        |
| `ephemeral`   | `boolean` | N        | Whether it is a temporary instance                                  |
| `ip`          | `String`  | N        | `IP` address, default is empty, indicates unrestricted `IP` address |
| `port`        | `int`     | N        | Port number, default is empty, Indicates unrestricted `Port` number |

### Return Data

| Parameter       | Type     | Description   |
|-----------------|----------|---------------|
| `data`          |          | Client list   |
| `data.clientId` | `String` | Client `id`   |
| `data.ip`       | `String` | Client `IP`   |
| `data.port`     | `int`    | Client `port` |

### Example

* Request Example

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/ns/client/service/publisher/list?serviceName=nacos.test.1&ip=&port='
    ```

* Response Example

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

<h2 id="2.22">Query the information of clients subscribed to the specified service (new)</h2>

### Description

Query the clients subscribed to the specified service

### Request Method

`GET`

### Request URL

`/nacos/v2/ns/client/service/subscriber/list`

### Request Parameters

| Parameter     | Type    | Required | Description                                                         |
|---------------|---------|----------|---------------------------------------------------------------------|
| `namespaceId` | String  | N        | Namespace`Id`, default is `public`                                  |
| `groupName`   | String  | N        | Group name, default is `DEFAULT_GROUP`                              |
| `serviceName` | String  | **Y**    | Service name                                                        |
| `ephemeral`   | boolean | N        | Whether it is a temporary instance                                  |
| `ip`          | String  | N        | `IP` address, default is empty, indicates unrestricted `IP` address |
| `port`        | int     | N        | Port number, default is empty, Indicates unrestricted `Port` number |

### Return Data

| Parameter       | Type     | Description   |
|-----------------|----------|---------------|
| `data`          |          | Client list   |
| `data.clientId` | `String` | Client `id`   |
| `data.ip`       | `String` | Client `IP`   |
| `data.port`     | `int`    | Client `port` |

### Example

* Request Example

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/ns/client/service/subscriber/list?serviceName=nacos.test.1&ip=&port='
    ```

* Response Example

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

## Namespace

<h2 id="3.1">Query namespaces</h2>

### Description

Query all namespaces

### Request Method

`GET`

### Request URL

`/nacos/v2/console/namespace/list`

### Return Data

| Parameter                | Type       | Description                       |
|--------------------------|------------|-----------------------------------|
| `data`                   | `Object[]` | Namespaces                        |
| `data.namespace`         | `String`   | Namespace`ID`                     |
| `data.namespaceShowName` | `String`   | Namespace name                    |
| `data.namespaceDesc`     | `String`   | Namespace description             |
| `data.quota`             | `int`      | the capacity of Namespace         |
| `data.configCount`       | `int`      | Number of configs under namespace |
| `data.type`              | `int`      | Namespace type                    |

> There are 3 types of Namespace, `0 ` - Global Namespace `1 ` - Default Private Namespace `2 ` - Custom Namespace

### Example

* Request Example

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/console/namespace/list'
    ```

* Response Example

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

<h2 id="3.2">Query namespace</h2>

### Description

Query information about a specific Namespace

> Error when namespace does not exist

### Request Method

`GET`

### Request URL

`/nacos/v2/console/namespace`

### Request Parameters

| Parameter     | Type     | Required | Description   |
|---------------|----------|----------|---------------|
| `namespaceId` | `String` | **Y**    | Namespace`Id` |

### Return Data

| Parameter                | Type     | Description                       |
|--------------------------|----------|-----------------------------------|
| `data`                   | `Object` | Namespace                         |
| `data.namespace`         | `String` | Namespace `ID`                    |
| `data.namespaceShowName` | `String` | Namespace name                    |
| `data.namespaceDesc`     | `String` | Namespace description             |
| `data.quota`             | `int`    | the capacity of Namespace         |
| `data.configCount`       | `int`    | Number of configs under namespace |
| `data.type`              | `int`    | Namespace type                    |

> There are 3 types of Namespace, `0 ` - Global Namespace `1 ` - Default Private Namespace `2 ` - Custom Namespace

### Example

* Request Example

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/console/namespace?namespaceId=test_namespace'
    ```

* Response Example

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

<h2 id="3.3">Create namespace</h2>

### Description

Create a namespace

> Error when namespace already exists

### Request Method

`POST`

`Content-Type:application/x-www-form-urlencoded`

### Request URL

`/nacos/v2/console/namespace`

### Request Body

| Parameter       | Type     | Required | Description           |
|-----------------|----------|----------|-----------------------|
| `namespaceId`   | `String` | **Y**    | Namespace`Id`         |
| `namespaceName` | `String` | **Y**    | Namespace name        |
| `namespaceDesc` | `String` | N        | Namespace Description |

### Return Data

| Parameter | Type      | Description                         |
|-----------|-----------|-------------------------------------|
| `data`    | `boolean` | Whether the execution is successful |

### Example

* Request Example

    ```shell
    curl -d 'namespaceId=test_namespace' \
      -d 'namespaceName=test' \
      -X POST 'http://127.0.0.1:8848/nacos/v2/console/namespace'
    ```

* Response Example

    ```json
    {
          "code": 0,
          "message": "success",
          "data": true
    }
    ```

<h2 id="3.4">Update namespace</h2>

### Description

Edit namespace

### Request Method

`PUT`

`Content-Type:application/x-www-form-urlencoded`

### Request URL

`/nacos/v2/console/namespace`

### Request Body

| Parameter       | Type     | Required | Description           |
|-----------------|----------|----------|-----------------------|
| `namespaceId`   | `String` | **Y**    | Namespace`Id`         |
| `namespaceName` | `String` | **Y**    | Namespace name        |
| `namespaceDesc` | `String` | N        | Namespace Description |

### Return Data

| Parameter | Type      | Description                         |
|-----------|-----------|-------------------------------------|
| `data`    | `boolean` | Whether the execution is successful |

### Example

* Request Example

    ```shell
    curl -d 'namespaceId=test_namespace' \
      -d 'namespaceName=test.nacos' \
      -X PUT 'http://127.0.0.1:8848/nacos/v2/console/namespace'
    ```

* Response Example

    ```json
    {
          "code": 0,
          "message": "success",
          "data": true
    }
    ```

<h2 id="3.5">Delete namespace</h2>

### Description

Delete the specified namespace

### Request Method

`DELETE`

### Request URL

`/nacos/v2/console/namespace`

### Request Parameters

| Parameter     | Type     | Required | Description   |
|---------------|----------|----------|---------------|
| `namespaceId` | `String` | **Y**    | Namespace`Id` |

### Return Data

| Parameter | Type      | Description                         |
|-----------|-----------|-------------------------------------|
| `data`    | `boolean` | Whether the execution is successful |

### Example

* Request Example

    ```shell
    curl -d 'namespaceId=test_namespace' \
      -X DELETE 'http://127.0.0.1:8848/nacos/v2/console/namespace'
    ```

* Response Example

    ```json
    {
          "code": 0,
          "message": "success",
          "data": true
    }
    ```

## Cluster

<h2 id="4.1">Query the current node</h2>

### Description

Query the current `nacos` node

### Request Method

`GET`

### Request URL

`/nacos/v2/core/cluster/node/self`

<h3 id="Member">Return Data</h3>

| Parameter            | Type     | Description              |
|----------------------|----------|--------------------------|
| `data`               | `Object` | Current node             |
| `data.ip`            | `String` | Node `IP` address        |
| `data.port`          | `int`    | Node port                |
| `data.state`         | `String` | Node status              |
| `data.extendInfo`    | `Object` | Node extend information  |
| `data.address`       | `String` | Node address （`IP:port`） |
| `data.failAccessCnt` | `int`    | Number of failed access  |
| `data.abilities`     | `Object` |                          |

### Example

* Request Example

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/core/cluster/node/self'
    ```

* Response Example

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

<h2 id="4.2">Query the list of cluster nodes</h2>

### Description

Query the information of all nodes in the cluster

### Request Method

`GET`

### Request URL

`/nacos/v2/core/cluster/node/list`

### Request Parameters

| Parameter | Type     | Required | Description                    |
|-----------|----------|----------|--------------------------------|
| `address` | `String` | N        | Node address, default is empty |
| `state`   | `String` | N        | Node status, default is empty  |

> `address`corresponds to the prefix match condition of the Node address to be queried, and is not restricted when it is empty
>
> `state`corresponds to the filter condition of node status and is not restricted when it is empty

### Return Data

| Parameter | Type       | Description                              |
|-----------|------------|------------------------------------------|
| `data`    | `Object[]` | Node list, refer to [Node info](#Member) |

### Example

* Request Example

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/core/cluster/node/list'
    ```

* Response Example

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

<h2 id="4.3">Query the current node health status</h2>

### Description

Query the current `nacos` node health status

### Request Method

`GET`

### Request URL

`/nacos/v2/core/cluster/node/self/health`

<h3 id="Member">Return Data</h3>

| Parameter | Type     | Description                |
|-----------|----------|----------------------------|
| `data`    | `String` | Current node health status |

> Node has five states: `STARTING`, `UP`, `SUSPICIOUS`, `DOWN` and `ISOLATION`.

### Example

* Request Example

    ```shell
    curl -X GET 'http://127.0.0.1:8848/nacos/v2/core/cluster/node/self/health'
    ```

* Response Example

    ```json
    {
    	"code": 0,
    	"message": "success",
    	"data": "UP"
    }
    ```


<h2 id="4.4">Switch addressing modes</h2>

### Description

Switch addressing modes

### Request Method

`PUT`

`Content-Type:application/x-www-form-urlencoded`

### Request URL

`/nacos/v2/core/cluster/lookup`

### Request Body

| Parameter | Type     | Required | Description     |
|-----------|----------|----------|-----------------|
| `type`    | `String` | **Y**    | Addressing mode |

> There are two addressing modes: `file` (file configuration) and `address-server` (address server)

### Return Data

| Parameter | Type      | Description                         |
|-----------|-----------|-------------------------------------|
| `data`    | `boolean` | Whether the execution is successful |

### Example

* Request Example

    ```shell
    curl -d 'type=file' \
      -X PUT 'http://127.0.0.1:8848/nacos/v2/core/cluster/lookup'
    ```

* Response Example

    ```json
    {
    	"code": 0,
    	"message": "success",
    	"data": true
    }
    ```

## Connection Load Management

### <h2 id="5.1">Query the List of Current Node Client Connections</h2>

#### Description

Query the list of client connections on the current `Nacos` node.

#### Request Method

`GET`

#### Request URL

`/nacos/v2/core/loader/current`

#### Return Data

| Parameter      | Type      | Description          |
|----------------|-----------|----------------------|
| `traced`       | `Boolean` | Monitoring indicator |
| `abilityTable` | `Map`     | Capability table     |
| `metaInfo`     | `Object`  | Metadata             |
| `connected`    | `Integer` | Connection status    |
| `labels`       | `Map`     | Labels               |

#### Example

* Request Example

```shell
curl -X GET 'http://localhost:8848/nacos/v2/core/loader/current'
```

* Response Example

```json
{
    "1697424543845_127.0.0.1_11547": {
        "traced": false,
        "abilityTable": null,
        "metaInfo": {
            "connectType": "GRPC",
            "clientIp": "192.168.49.1",
            "localPort": 9848,
            "version": "Nacos-Java-Client:v2.1.0",
            "connectionId": "1697424543845_127.0.0.1_11547",
            "createTime": "2023-10-16T10:49:03.907+08:00",
            "lastActiveTime": 1697424869827,
            "appName": "unknown",
            "tenant": "",
            "labels": {
                "source": "sdk",
                "taskId": "0",
                "module": "config",
                "AppName": "unknown"
            },
            "tag": null,
            "sdkSource": true,
            "clusterSource": false
        },
        "connected": true,
        "labels": {
            "source": "sdk",
            "taskId": "0",
            "module": "config",
            "AppName": "unknown"
        }
    }
}

```

<h2 id="5.2">Reload the Number of Current Node Client Connections</h2>

### Description

Reload the number of client connections on the current `Nacos` node.

### Request Method

`GET`

### Request URL

`/nacos/v2/core/loader/current/reloadCurrent`

### Request Parameters

| Parameter         | Type      | Required | Description       |
|-------------------|-----------|----------|-------------------|
| `count`           | `Integer` | **Y**    | ID of connections |
| `redirectAddress` | `String`  | N        | Redirect address  |

### Return Data

| Parameter | Type     | Description      |
|-----------|----------|------------------|
| `data`    | `String` | Execution result |

### Example

* Request Example

    ```shell
    curl -X GET 'http://localhost:8848/nacos/v2/core/loader/reloadCurrent?count=1&redirectAddress=127.0.0.1:8848'
    ```

* Response Example

    ```text
    success
    ```

<h2 id="5.3">Intelligently Balance the Number of Client Connections in the Cluster</h2>

### Description

Intelligently balance the client connections among all nodes in the `Nacos` cluster.

### Request Method

`GET`

### Request URL

`/nacos/v2/core/loader/current/smartReloadCluster`

### Request Parameters

| Parameter      | Type     | Required | Description                                                                                                                                                 |
|----------------|----------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `loaderFactor` | `Float`  | N        | The loading factor, with a default value of 0.1, determines the number of SDKs per node, calculated as (1 - loaderFactor) * avg ~ (1 + loaderFactor) * avg. |
| `force`        | `String` | N        | Force flag                                                                                                                                                  |

### Return Data

| Parameter | Type     | Description      |
|-----------|----------|------------------|
| `data`    | `String` | Execution result |

### Example

* Request Example

    ```shell
    curl -X GET 'http://localhost:8848/nacos/v2/core/loader/smartReloadCluster?loaderFactor=1'
    ```

* Response Example

    ```text
    Ok
    ```

<h2 id="5.4">Reset a Specific Client Connection</h2>

### Description

Send a connection reset request based on the `SDK` connection ID.

### Request Method

`GET`

### Request URL

`/nacos/v2/core/loader/current/reloadClient`

### Request Body

| Parameter         | Type     | Required | Description   |
|-------------------|----------|----------|---------------|
| `connectionId`    | `String` | **Y**    | Connection ID |
| `redirectAddress` | `String` | N        | Reset address |

### Return Data

| Parameter | Type     | Description      |
|-----------|----------|------------------|
| `data`    | `String` | Execution result |

### Example

* Request Example

    ```shell
    curl -X GET 'http://localhost:8848/nacos/v2/core/loader/reloadClient?connectionId=1&redirectAddress=127.0.0.1:8848'
    ```

* Response Example

    ```text
    success
    ```

<h2 id="5.5">Get SDK Metrics for the Cluster</h2>

### Description

Get SDK metrics for all nodes in the `Nacos` cluster.

### Request Method

`GET`

### Request URL

`/nacos/v2/core/loader/current/cluster`

### Return Data

| Parameter        | Type                  | Description                                                                                                                                                               |
|------------------|-----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `total`          | `Integer`             | Current number of cluster nodes                                                                                                                                           |
| `min`            | `Integer`             | Minimum load value                                                                                                                                                        |
| `avg`            | `Integer`             | Average load value                                                                                                                                                        |
| `max`            | `Integer`             | Maximum load value                                                                                                                                                        |
| `memberCount`    | `Integer`             | Number of members in the current node                                                                                                                                     |
| `metricsCount`   | `Integer`             | Number of load information                                                                                                                                                |
| `threshold`      | `Float`               | Load threshold. The threshold is calculated as: Average load value * 1.1                                                                                                  |
| `detail`         | `String`              | Contains detailed load information for each node                                                                                                                          |
| `detail.address` | `Map<String, String>` | Node address                                                                                                                                                              |
| `detail.metric`  | `Map<String, String>` | Metric information                                                                                                                                                        |
| `completed`      | `Boolean`             | Indicates whether the collection of load information has been completed. If true, it means that load information for all nodes has been collected, otherwise, it is false |

### Example

* Request Example

    ```shell
    curl -X GET 'http://localhost:8848/nacos/v2/core/loader/cluster'
    ```

* Response Example

    ```json
    {
        "1697424543845_127.0.0.1_11547": {
            "traced": false,
            "abilityTable": null,
            "metaInfo": {
                "connectType": "GRPC",
                "clientIp": "192.168.49.1",
                "localPort": 9848,
                "version": "Nacos-Java-Client:v2.1.0",
                "connectionId": "1697424543845_127.0.0.1_11547",
                "createTime": "2023-10-16T10:49:03.907+08:00",
                "lastActiveTime": 1697424869827,
                "appName": "unknown",
                "tenant": "",
                "labels": {
                "source": "sdk",
                "taskId": "0",
                "module": "config",
                "AppName": "unknown"
            },
            "tag": null,
            "sdkSource": true,
            "clusterSource": false
            },
            "connected": true,
            "labels": {
                "source": "sdk",
                "taskId": "0",
                "module": "config",
                "AppName": "unknown"
            }
        }
    }
    ```