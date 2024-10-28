---
title: Console API Guide
keywords: [Console API,Guide]
description: Console API Guide
sidebar:
    order: 8
---

# Console API Guide

- Documentation Specifications
    - [Unified API Response Format](#0.1)
    - [API Error Codes Summary](#0.2)

- Configuration Management
    - [Get Configuration Details](#1.1)
    - [Publish or Update Configuration](#1.2)
    - [Delete Configuration](#1.3)
    - [Batch Delete Configuration](#1.4)
    - [Query Configuration List](#1.5)
    - [Search Configuration List by Content](#1.6)
    - [Query Configuration Listener Client Info](#1.7)
    - [Query Subscriber Client Info (by IP)](#1.8)
    - [Export Configuration](#1.9)
    - [Import Configuration](#1.10)
    - [Clone Configuration](#1.11)
    - [Query Historical Versions](#1.13)
    - [Query Historical Version Details](#1.14)
    - [Query Previous Version of Configuration](#1.15)
    - [Query Configuration List by Namespace](#1.16)

- Service Management
    - [Create Service](#2.1)
    - [Delete Service](#2.2)
    - [Update Service](#2.3)
    - [Get Selector Type List](#2.4)
    - [Query Subscriber List](#2.5)
    - [Query Service List](#2.6)
    - [Query Service Details](#2.7)
    - [Update Cluster](#2.8)
    - [Query Instance List](#2.9)
    - [Update Instance](#2.10)

- Namespace
    - [Query Namespace List](#3.1)
    - [Query Namespace Details](#3.2)
    - [Create Namespace](#3.3)
    - [Update Namespace](#3.4)
    - [Delete Namespace](#3.5)
    - [Check if Namespace ID Exists](#3.6)

- Cluster Management
    - [Query Cluster Node List](#4.1)

## Documentation Specifications

<h2 id="0.1">Unified API Response Format</h2>

In version 3.0 of the Console API, all API responses are in `json` format, and the response body has a consistent structure:

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

The meaning of each field in the response body is as follows:

|   Name    |   Type   | Description                                          |
| :-------: | :------: | ---------------------------------------------------- |
|  `code`   |  `int`   | Error code; `0` means success, non-`0` indicates a specific failure |
| `message` | `String` | Error message; "`success`" when executed successfully |
|  `data`   | Any type | Return data; detailed error information when execution fails |

<h2 id="0.2">API Error Codes Summary</h2>

### Example

The error codes and corresponding messages in the API response body are summarized below:

| Error Code | Message                      | Meaning                             |
| ---------- | ---------------------------- | ----------------------------------- |
| `0`        | `success`                    | Successful execution                |
| `400`      | `Bad Request`                | Request parameter error             |
| `401`      | `Unauthorized`               | Unauthorized                        |
| `403`      | `Forbidden`                  | No permission                       |
| `404`      | `Not Found`                  | Resource not found                  |
| `500`      | `Internal Server Error`      | Internal server error               |
| `10000`    | `parameter missing`          | Missing parameter                   |
| `10001`    | `access denied`              | Access denied                       |
| `10002`    | `data access error`          | Data access error                   |
| `20001`    | `'tenant' parameter error`   | `tenant` parameter error            |
| `20002`    | `parameter validate error`   | Parameter validation error          |
| `20003`    | `MediaType Error`            | Request `MediaType` error           |
| `20004`    | `resource not found`         | Resource not found                  |
| `20005`    | `resource conflict`          | Resource access conflict            |
| `20006`    | `config listener is null`    | Configuration listener is null      |
| `20007`    | `config listener error`      | Configuration listener error        |
| `20008`    | `invalid dataId`             | Invalid `dataId` (authentication failed) |
| `20009`    | `parameter mismatch`         | Request parameter mismatch          |
| `21000`    | `service name error`         | `serviceName` error                 |
| `21001`    | `weight error`               | `weight` parameter error            |
| `21002`    | `instance metadata error`    | Instance `metadata` error           |
| `21003`    | `instance not found`         | `instance` does not exist           |
| `21004`    | `instance error`             | `instance` information error        |
| `21005`    | `service metadata error`     | Service `metadata` error            |
| `21006`    | `selector error`             | Access policy `selector` error      |
| `21007`    | `service already exist`      | Service already exists              |
| `21008`    | `service not exist`          | Service does not exist              |
| `21009`    | `service delete failure`     | Service deletion failed due to existing instances |
| `21010`    | `healthy param miss`         | Missing `healthy` parameter         |
| `21011`    | `health check still running` | Health check is still running       |
| `22000`    | `illegal namespace`          | Illegal `namespace`                 |
| `22001`    | `namespace not exist`        | Namespace does not exist            |
| `22002`    | `namespace already exist`    | Namespace already exists            |
| `23000`    | `illegal state`              | Illegal `state`                     |
| `23001`    | `node info error`            | Node information error              |
| `23002`    | `node down failure`          | Node offline operation error        |
| ...        | ...                          | ...                                 |
| `30000`    | `server error`               | Other internal errors               |

## Configuration Management

<h2 id="1.1">Get Configuration Details</h2>

### Interface Description

Retrieve detailed information of the specified configuration.

### Request Method

`GET`

### Request URL

`/v3/console/cs/config`

### Request Parameters

| Parameter     | Type     | Required | Description                                         |
| ------------- | -------- | -------- | --------------------------------------------------- |
| `namespaceId` | `String` | No       | Namespace, default is `public`, same as `''`        |
| `group`       | `String` | **Yes**  | Configuration group name                            |
| `dataId`      | `String` | **Yes**  | Configuration name                                  |

### Return Data

| Parameter | Type            | Description                      |
| --------- | --------------- | -------------------------------- |
| `data`    | `ConfigAllInfo` | Detailed information of the configuration |

The `ConfigAllInfo` object contains the following fields:

| Field Name         | Type     | Description                 |
| ------------------ | -------- | --------------------------- |
| `dataId`           | `String` | Configuration name          |
| `group`            | `String` | Configuration group name    |
| `content`          | `String` | Configuration content       |
| `appName`          | `String` | Application name            |
| `md5`              | `String` | MD5 of the configuration content |
| `type`             | `String` | Configuration type          |
| `tags`             | `String` | Configuration tags          |
| `namespaceId`      | `String` | Namespace ID                |
| `configTags`       | `String` | Configuration tag list      |
| `desc`             | `String` | Configuration description   |
| `schema`           | `String` | Configuration schema        |
| `lastModifiedTime` | `String` | Last modified time          |

### Example

* Request Example

  ```shell
  curl -X GET 'http://127.0.0.1:8848/v3/console/cs/config?dataId=nacos.example&group=DEFAULT_GROUP&namespaceId=public'
  ```

* Return Example

  ```json
  {
    "code": 0,
    "message": "success",
    "data": {
      "dataId": "nacos.example",
      "group": "DEFAULT_GROUP",
      "content": "Configuration content",
      "appName": "Example Application",
      "md5": "9f67e6977b100e00cab385a75597db58",
      "type": "yaml",
      "tags": "tag1,tag2",
      "namespaceId": "public",
      "configTags": "tag1,tag2",
      "desc": "Configuration description",
      "schema": "",
      "lastModifiedTime": "2023-12-05T01:48:03.380+0000"
    }
  }
  ```

<h2 id="1.2">Publish or Update Configuration</h2>

### Interface Description

Add or update a configuration.

### Request Method

`POST`

`Content-Type: application/x-www-form-urlencoded`

### Request URL

`/v3/console/cs/config`

### Request Body

| Parameter     | Type     | Required | Description                                    |
| ------------- | -------- | -------- | ---------------------------------------------- |
| `namespaceId` | `String` | No       | Namespace, default is `public`, same as `''`   |
| `group`       | `String` | **Yes**  | Configuration group name                       |
| `dataId`      | `String` | **Yes**  | Configuration name                             |
| `content`     | `String` | **Yes**  | Configuration content                          |
| `type`        | `String` | No       | Configuration type, e.g., `yaml`, `properties` |
| `appName`     | `String` | No       | Application name                               |
| `tag`         | `String` | No       | Configuration tag                              |
| `desc`        | `String` | No       | Configuration description                      |
| `srcUser`     | `String` | No       | Source user                                    |
| `configTags`  | `String` | No       | Configuration tag list, separated by commas    |

### Return Data

| Parameter | Type      | Description          |
| --------- | --------- | -------------------- |
| `data`    | `boolean` | Whether execution was successful |

### Example

* Request Example

  ```shell
  curl -d 'dataId=nacos.example' \
    -d 'group=DEFAULT_GROUP' \
    -d 'namespaceId=public' \
    -d 'content=Configuration content' \
    -d 'type=yaml' \
    -X POST 'http://127.0.0.1:8848/v3/console/cs/config'
  ```

* Return Example

  ```json
  {
    "code": 0,
    "message": "success",
    "data": true
  }
  ```

<h2 id="1.3">Delete Configuration</h2>

### Interface Description

Delete the specified configuration.

### Request Method

`DELETE`

### Request URL

`/v3/console/cs/config`

### Request Parameters

| Parameter     | Type     | Required | Description                                         |
| ------------- | -------- | -------- | --------------------------------------------------- |
| `namespaceId` | `String` | No       | Namespace, default is `public`, same as `''`        |
| `group`       | `String` | **Yes**  | Configuration group name                            |
| `dataId`      | `String` | **Yes**  | Configuration name                                  |
| `tag`         | `String` | No       | Configuration tag                                   |

### Return Data

| Parameter | Type      | Description          |
| --------- | --------- | -------------------- |
| `data`    | `boolean` | Whether execution was successful |

### Example

* Request Example

  ```shell
  curl -X DELETE 'http://127.0.0.1:8848/v3/console/cs/config?dataId=nacos.example&group=DEFAULT_GROUP&namespaceId=public'
  ```

* Return Example

  ```json
  {
    "code": 0,
    "message": "success",
    "data": true
  }
  ```

<h2 id="1.4">Batch Delete Configuration</h2>

### Interface Description

Batch delete specified configurations.

### Request Method

`DELETE`

### Request URL

`/v3/console/cs/config/batchDelete`

### Request Parameters

| Parameter | Type      | Required | Description      |
| --------- | --------- | -------- | ---------------- |
| `ids`     | `Long[]`  | **Yes**  | List of config IDs |

### Return Data

| Parameter | Type      | Description          |
| --------- | --------- | -------------------- |
| `data`    | `boolean` | Whether execution was successful |

### Example

* Request Example

  ```shell
  curl -X DELETE 'http://127.0.0.1:8848/v3/console/cs/config/batchDelete?ids=1&ids=2&ids=3'
  ```

* Return Example

  ```json
  {
    "code": 0,
    "message": "success",
    "data": true
  }
  ```

<h2 id="1.5">Query Configuration List</h2>

### Interface Description

Retrieve configuration list information.

### Request Method

`GET`

### Request URL

`/v3/console/cs/config/list`

### Request Parameters

| Parameter     | Type     | Required | Description                                         |
| ------------- | -------- | -------- | --------------------------------------------------- |
| `namespaceId` | `String` | No       | Namespace, default is `public`, same as `''`        |
| `group`       | `String` | No       | Configuration group name                            |
| `dataId`      | `String` | No       | Configuration name                                  |
| `config_tags` | `String` | No       | Configuration tags, separated by commas             |
| `appName`     | `String` | No       | Application name                                    |
| `pageNo`      | `int`    | **Yes**  | Page number, starting from 1                        |
| `pageSize`    | `int`    | **Yes**  | Number of items per page, maximum value is 500      |

### Return Data

| Parameter                | Type            | Description                                      |
| ------------------------ | --------------- | ------------------------------------------------ |
| `data`                   | `Object`        | Paginated query results                          |
| `data.totalCount`        | `int`           | Total count                                      |
| `data.pageNumber`        | `int`           | Current page                                     |
| `data.pagesAvailable`    | `int`           | Total pages                                      |
| `data.pageItems`         | `Object[]`      | List of configuration items, see [Configuration Item Info](#ConfigInfo) |

<h3 id="ConfigInfo">Configuration Item Info</h3>

| Parameter          | Type     | Description               |
| ------------------ | -------- | ------------------------- |
| `id`               | `Long`   | Configuration ID          |
| `dataId`           | `String` | Configuration name        |
| `group`            | `String` | Configuration group       |
| `content`          | `String` | Configuration content     |
| `md5`              | `String` | MD5 of configuration content |
| `type`             | `String` | Configuration type        |
| `appName`          | `String` | Application name          |
| `desc`             | `String` | Configuration description |
| `tags`             | `String` | Configuration tags        |
| `encryptedDataKey` | `String` | Encrypted data key        |
| `lastModifiedTime` | `String` | Last modified time        |

### Example

* Request Example

  ```shell
  curl -X GET 'http://127.0.0.1:8848/v3/console/cs/config/list?pageNo=1&pageSize=10&namespaceId=public'
  ```

* Return Example

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
          "content": "Configuration content",
          "md5": "9f67e6977b100e00cab385a75597db58",
          "type": "yaml",
          "appName": "Example Application",
          "desc": "Configuration description",
          "tags": "tag1,tag2",
          "encryptedDataKey": null,
          "lastModifiedTime": "2023-12-05T01:48:03.380+0000"
        }
      ]
    }
  }
  ```

<h2 id="1.6">Search Configuration List by Content</h2>

### Interface Description

Search configuration list based on configuration content.

### Request Method

`GET`

### Request URL

`/v3/console/cs/config/searchDetail`

### Request Parameters

| Parameter        | Type     | Required | Description                                         |
| ---------------- | -------- | -------- | --------------------------------------------------- |
| `namespaceId`    | `String` | No       | Namespace, default is `public`, same as `''`        |
| `group`          | `String` | No       | Configuration group name                            |
| `dataId`         | `String` | No       | Configuration name                                  |
| `config_tags`    | `String` | No       | Configuration tags, separated by commas             |
| `appName`        | `String` | No       | Application name                                    |
| `config_detail`  | `String` | **Yes**  | Configuration content keyword                       |
| `search`         | `String` | No       | Search type, default is `blur`                      |
| `pageNo`         | `int`    | **Yes**  | Page number, starting from 1                        |
| `pageSize`       | `int`    | **Yes**  | Number of items per page, maximum value is 500      |

### Return Data

Same as the return data of [Query Configuration List](#1.5).

### Example

* Request Example

  ```shell
  curl -X GET 'http://127.0.0.1:8848/v3/console/cs/config/searchDetail?config_detail=keyword&pageNo=1&pageSize=10&namespaceId=public'
  ```

* Return Example

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
          "content": "Configuration content contains keyword",
          "md5": "9f67e6977b100e00cab385a75597db58",
          "type": "yaml",
          "appName": "Example Application",
          "desc": "Configuration description",
          "tags": "tag1,tag2",
          "encryptedDataKey": null,
          "lastModifiedTime": "2023-12-05T01:48:03.380+0000"
        }
      ]
    }
  }
  ```

<h2 id="1.7">Query Configuration Listener Client Info</h2>

### Interface Description

Query client information that subscribes to the specified configuration.

### Request Method

`GET`

### Request URL

`/v3/console/cs/config/listener`

### Request Parameters

| Parameter     | Type     | Required | Description                      |
| ------------- | -------- | -------- | -------------------------------- |
| `namespaceId` | `String` | No       | Namespace ID, default is `public` |
| `group`       | `String` | **Yes**  | Configuration group name          |
| `dataId`      | `String` | **Yes**  | Configuration name                |
| `sampleTime`  | `int`    | No       | Sampling time, default is `1`     |

### Return Data

| Parameter | Type                      | Description               |
| --------- | ------------------------- | ------------------------- |
| `data`    | `GroupkeyListenserStatus` | Listener status object    |

The `GroupkeyListenserStatus` object contains the following fields:

| Field Name               | Type                          | Description             |
| ------------------------ | ----------------------------- | ----------------------- |
| `groupKey`               | `String`                      | Unique key of the configuration |
| `listenersGroupkeyStatus`| `List<Map<String, Object>>`   | List of listener clients |

### Example

* Request Example

  ```shell
  curl -X GET 'http://127.0.0.1:8848/v3/console/cs/config/listener?dataId=nacos.example&group=DEFAULT_GROUP&namespaceId=public'
  ```

* Return Example

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
