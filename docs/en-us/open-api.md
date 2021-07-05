---
title: Open API Guide
keywords: Open API,Guide
description: Open API Guide
---

# Open API Guide

- Configuration Management
  - [Get configurations](#1.1)
  - [Listen for configurations](#1.2)
  - [Publish configuration](#1.3)
  - [Delete configuration](#1.4)
  - [Query list of history configuration](#1.5)
  - [Query the history details of the configuration](#1.6)
  - [Query the previous version of the configuration](#1.7)

- Service Discovery
  - [Register instance](#2.1)
  - [Deregister instance](#2.2)
  - [Modify instance](#2.3)
  - [Query instances](#2.4)
  - [Query instance detail](#2.5)
  - [Send instance beat](#2.6)
  - [Create service](#2.7)
  - [Delete service](#2.8)
  - [Update service](#2.9)
  - [Query service](#2.10)
  - [Query service list](#2.11)
  - [Query system switches](#2.12)
  - [Update system switch](#2.13)
  - [Query system metrics](#2.14)
  - [Query server list](#2.15)
  - [Query the leader of current cluster](#2.16)
  - [Update instance health status](#2.17)
  - [Batch update instance metadata(Beta)](#2.18)
  - [Batch delete instance metadata(Beta)](#2.19)

- Namespace
  - [Get namespace](#3.1)
  - [Create namespace](#3.2)
  - [Update namespace](#3.3)
  - [Delete namespace](#3.4)

## Configuration Management

<h2 id="1.1">Get configurations</h2>

### Description

This API is used to get configurations in Nacos.

### Request type
GET

### Request URL
/nacos/v1/cs/configs

### Request parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| tenant | string | No | Tenant information. It corresponds to the Namespace ID field in Nacos. |
| dataId | string | Yes | Configuration ID |
| group | string | Yes | Configuration group |

### Return parameters

| Parameter type | Description |
| :--- | :--- |
| String | Configuration value |


### Error codes

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in the client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |


### Example
* Request example

    ```
    curl -X GET 'http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.example&group=com.alibaba.nacos'

    ```
* Return example

    ```
    contentTest
    ```


<h2 id="1.2">Listen for configurations</h2>

### Description

This API is used to listen for configurations in Nacos to capture configuration changes. In case of any configuration changes, you can use the [Get Configurations](~~64131~~) API to obtain the latest value of the configuration and dynamically refresh the local cache.

A listener is registered using an asynchronous servlet. The nature of registering a listener is to compare the configuration value and the MD5 value of it with that of the backend. If the values differ, the inconsistent configuration is returned immediately. Otherwise, an empty string is returned after 30 seconds.

### Request type
POST

### Request URL
/nacos/v1/cs/configs/listener

### Request parameters

<div class="bi-table">
  <table>
    <colgroup>
      <col width="auto" />
      <col width="75px" />
      <col width="96px" />
      <col width="385px" />
    </colgroup>
    <tbody>
      <tr>
        <td rowspan="1" colSpan="1">
          <div data-type="p">Name</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">Type</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">Required</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">Description</div>
        </td>
      </tr>
      <tr>
        <td rowspan="1" colSpan="1">
          <div data-type="p">Listening-Configs</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">string</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">No</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">A request to listen for data packets. </div>
          <div data-type="p">Format : dataId^group^2contentMD5^tenant^1 or dataId^group^2contentMD5^1.</div>
          <ul data-type="unordered-list">
            <li data-type="list-item" data-list-type="unordered-list">
              <div data-type="p">dataId : Configuration ID</div>
            </li>
            <li data-type="list-item" data-list-type="unordered-list">
              <div data-type="p">group : Configuration group</div>
            </li>
            <li data-type="list-item" data-list-type="unordered-list">
              <div data-type="p">contentMD5 : The MD5 value of the configuration</div>
            </li>
            <li data-type="list-item" data-list-type="unordered-list">
              <div data-type="p">tenant : Tenant information. It corresponds to the Namespace field in Nacos (not must)</div>
            </li>
          </ul>
        </td>
      </tr>
      <tr>
        <td rowspan="1" colSpan="1">
          <div data-type="p">Listening-Configs</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">string</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">Yes</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">A request to listen for data packets.</div>
        </td>
      </tr>
      <tr>
        <td rowspan="1" colSpan="1">
          <div data-type="p">tenant</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">string</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">Yes</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">A packet field indicating tenant information. It corresponds to the Namespace field in Nacos.</div>
        </td>
      </tr>
      <tr>
        <td rowspan="1" colSpan="1">
          <div data-type="p">dataId</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">string</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">Yes</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">A packet field indicating the configuration ID.</div>
        </td>
      </tr>
      <tr>
        <td rowspan="1" colSpan="1">
          <div data-type="p">group</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">string</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">Yes</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">A packet field indicating the configuration group.</div>
        </td>
      </tr>
      <tr>
        <td rowspan="1" colSpan="1">
          <div data-type="p">contentMD5</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">string</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">Yes</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">A packet field indicating the MD5 value of the configuration.</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>


### Header parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| Long-Pulling-Timeout | string | Yes | The timeout for long polling is 30s. Enter 30,000 here. |


### Parameter description
* A delimiter to separate fields within a configuration: ^2  = Character.toString((char) 2
* A delimiter to separate configurations: ^1 = Character.toString((char) 1)
* contentMD5:  MD5(content). This is an empty string because the first local cache is empty.

### Return parameters

| Parameter type | Description |
| :--- | :--- |
| String | Configuration value |


### Error codes

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in the client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Client error, not found |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |


### Example
* Request example

```
http://serverIp:8848/nacos/v1/cs/configs/listener

POST request body data:

Listening-Configs=dataId^2group^2contentMD5^2tenant^1

```

* Return example

```
In case of any configuration changes,

dataId^2group^2tenant^1

Otherwise, an empty string is returned.

```


<h2 id="1.3">Publish configuration</h2>

### Description

It publishes configurations in Nacos.

### Request Type

POST

### Request URL

/nacos/v1/cs/configs

### Request parameters


| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| tenant | String | No | The tenant, corresponding to the namespace ID field of Nacos |
| dataId | String | Yes | Configuration ID |
| group | String | Yes | Configuration group |
| content | String | Yes | Configuration content |
| type | String | No | Configuration type |

### Response parameters

| Parametertype | Description |
| --- | --- |
| boolean | If the publishing is successful  |


### Error code

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |


### Example
### Request example

```
curl -X POST 'http://127.0.0.1:8848/nacos/v1/cs/configs' -d 'dataId=nacos.example&group=com.alibaba.nacos&content=contentTest'

```

#### Response example

```
true
```


<h2 id="1.4">Delete configuration</h2>

### Description

It deletes configurations in Nacos.

### Request Type
DELETE

### Request URL

/nacos/v1/cs/configs

### Request parameters


| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| tenant | String | No | The tenant, corresponding to the namespace ID field of Nacos |
| dataId | String | Yes | Configuration ID |
| group | String | Yes | Configuration group |


### Response parameters


| Parameter type | Description |
| :--- | :--- |
| boolean | If the deletion is successful |


### Error code

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |


### Example
#### Request example

```
curl -X DELETE 'http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.example&group=com.alibaba.nacos'

```

#### Response example

```
true
```

<h2 id="1.5">Query list of history configuration</h2>

### Description

Query list of history configuration.

### Request Type
GET

### Request URL

```
/nacos/v1/cs/history?search=accurate
```

### Request parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| tenant | string | No | Tenant information. It corresponds to the Namespace ID field in Nacos. |
| dataId | string | Yes | Configuration ID |
| group | string | Yes | Configuration group |
| pageNo | integer | no | page number |
| pageSize | integer | no | page size (default:100, max:500) |

### Error code

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |


### Example
#### Request example

```
curl -X GET 'http://127.0.0.1:8848/nacos/v1/cs/history?search=accurate&dataId=nacos.example&group=com.alibaba.nacos'
```

#### Response example

```
{
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
      "md5": null,
      "content": null,
      "srcIp": "0:0:0:0:0:0:0:1",
      "srcUser": null,
      "opType": "I         ",
      "createdTime": "2010-05-04T16:00:00.000+0000",
      "lastModifiedTime": "2020-12-05T01:48:03.380+0000"
    }
  ]
}
```

<h2 id="1.6">Query the history details of the configuration</h2>

### Description

Query the history details of the configuration

### Request Type
GET

### Request URL

```
/nacos/v1/cs/history
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| nid | Integer | Yes | history config info ID |
| tenant | string | No | Tenant information. It corresponds to the Namespace ID field in Nacos. (Since 2.0.3) |
| dataId | string | Yes | Configuration ID (Since 2.0.3) |
| group | string | Yes | Configuration group (Since 2.0.3) |
> Note: From version 2.0.3, this interface need add three parameter, include tenant, dataId and group, tenant can not be provided. 

### Error Code

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |


### Example
#### Request example

```
curl -X GET 'http://127.0.0.1:8848/nacos/v1/cs/history?nid=203&tenant=&dataId=nacos.example&group=com.alibaba.nacos'
```

#### Response example

```
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
  "opType": "I         ",
  "createdTime": "2010-05-04T16:00:00.000+0000",
  "lastModifiedTime": "2020-12-05T01:48:03.380+0000"
}
```

<h2 id="1.7">Query the previous version of the configuration</h2>

### Description

Query the previous version of the configuration.(Since 1.4.0)

### Request Type
GET

### Request URL
/nacos/v1/cs/history/previous

### Request Paramters

| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| id | Integer | Yes | configuration unique id |
| tenant | string | No | Tenant information. It corresponds to the Namespace ID field in Nacos. (Since 2.0.3) |
| dataId | string | Yes | Configuration ID (Since 2.0.3) |
| group | string | Yes | Configuration group (Since 2.0.3) |
> Note: From version 2.0.3, this interface need add three parameter, include tenant, dataId and group, tenant can not be provided. 

### Error Code

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |


### Example
#### Request example
```
curl -X GET 'http://127.0.0.1:8848/nacos/v1/cs/history/previous?id=309135486247505920&tenant=&dataId=nacos.example&group=com.alibaba.nacos'
```

#### Response example

```
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
  "opType": "I         ",
  "createdTime": "2010-05-04T16:00:00.000+0000",
  "lastModifiedTime": "2020-12-05T01:48:03.380+0000"
}
```

## Service Discovery

<h2 id="2.1">Register instance</h2>

### Description
Register an instance to service.

### Request Type
POST

### Request Path
```plain
/nacos/v1/ns/instance
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| ip | String | yes | IP of instance |
| port | int | yes | Port of instance |
| namespaceId | String | no | ID of namespace |
| weight | double | no | Weight |
| enabled | boolean | no | enabled or not |
| healthy | boolean | no | healthy or not |
| metadata | String | no | extended information |
| clusterName | String | no | cluster name |
| serviceName | String | yes | service name |
| groupName | String | no | group name |
| ephemeral | boolean | no | if instance is ephemeral |

### Error Codes

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in the client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |

### Request Example
```plain
curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?port=8848&healthy=true&ip=11.11.11.11&weight=1.0&serviceName=nacos.test.3&encoding=GBK&namespaceId=n1'
```

### Response Example
ok

<h2 id="2.2">Deregister instance</h2>

### Description
Delete instance from service.

### Request Type
DELETE

### Request Path
```plain
/nacos/v1/ns/instance
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| serviceName | String | yes | Service name |
| groupName | String | no | group name |
| ephemeral | boolean | no | if instance is ephemeral |
| ip | String | yes | IP of instance |
| port | int | yes | Port of instance |
| clusterName | String | no | Cluster name |
| namespaceId | String | no | ID of namespace |

### error Codes

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in the client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |

### Request Example
```plain
curl -X DELETE '127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.test.1&ip=1.1.1.1&port=8888&clusterName=TEST1'
```
### Response Example
ok

<h2 id="2.3">Modify instance</h2>

### Description
Modify an instance of service.

### Request Type
PUT

### Request Path
```plain
/nacos/v1/ns/instance
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| serviceName | String | yes | Service name |
| groupName | String | no | group name |
| ephemeral | boolean | no | if instance is ephemeral |
| ip | String | yes | IP of instance |
| port | int | yes | Port of instance |
| clusterName | String | no | Cluster name |
| namespaceId | String | no | ID of namespace |
| weight | double | no | Weight |
| enabled | boolean | no | If enabled |
| metadata | JSON | no | Extended information |

### error Codes

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in the client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |

### Request Example
```plain
curl -X PUT '127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.test.1&ip=1.1.1.1&port=8888&clusterName=TEST1&weight=8&metadata={}'
```
### Response Example
ok

<h2 id="2.4">Query instances</h2>

### Description
Query instance list of service.

### Request Type
GET

### Request Path
```plain
/nacos/v1/ns/instance/list
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| serviceName | String | yes | Service name |
| groupName | String | no | group name |
| namespaceId | String | no | ID of namespace |
| clusters | String, splited by comma | no | Cluster name |
| healthyOnly | boolean | no, default value is false | Return healthy instance or not |

### Error Codes

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in the client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |

### Request Example
```plain
curl -X GET '127.0.0.1:8848/nacos/v1/ns/instance/list?serviceName=nacos.test.1'
```
### Response Example
```json
{
	"dom": "nacos.test.1",
	"cacheMillis": 1000,
	"useSpecifiedURL": false,
	"hosts": [{
		"valid": true,
		"marked": false,
		"instanceId": "10.10.10.10-8888-DEFAULT-nacos.test.1",
		"port": 8888,
		"ip": "10.10.10.10",
		"weight": 1.0,
		"metadata": {}
	}],
	"checksum": "3bbcf6dd1175203a8afdade0e77a27cd1528787794594",
	"lastRefTime": 1528787794594,
	"env": "",
	"clusters": ""
}
```

<h2 id="2.5">Query instance detail</h2>

### Description
Query instance details of service.

### Request Type
GET

### Request Path
```plain
/nacos/v1/ns/instance
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| namespaceId | String | no | ID of namespace |
| serviceName | String | yes | Service name |
| groupName | String | no | group name |
| ephemeral | boolean | no | if instance is ephemeral |
| ip | String | yes | IP of instance |
| port | String | yes | Port of instance |
| cluster | String | no | Cluster name |

### Error Codes

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in the client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |

### Request Example
```plain
curl -X GET '127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.test.2&ip=10.10.10.10&port=8888&cluster=DEFAULT'
```

### Response Example
```json
{
	"metadata": {},
	"instanceId": "10.10.10.10-8888-DEFAULT-nacos.test.2",
	"port": 8888,
	"service": "nacos.test.2",
	"healthy": false,
	"ip": "10.10.10.10",
	"clusterName": "DEFAULT",
	"weight": 1.0
}
```

<h2 id="2.6">Send instance beat</h2>

### Description
Send instance beat

### Request Type
PUT

### Request Path
```plain
/nacos/v1/ns/instance/beat
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| namespaceId | String | no | ID of namespace |
| serviceName | String | yes | service name |
| groupName | String | no | group name |
| beat | String | yes | beat content |

### Error Codes

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in the client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |

### Request Example
```plain
curl -X PUT '127.0.0.1:8848/nacos/v1/ns/instance/beat?serviceName=nacos.test.2&beat=%7b%22cluster%22%3a%22c1%22%2c%22ip%22%3a%22127.0.0.1%22%2c%22metadata%22%3a%7b%7d%2c%22port%22%3a8080%2c%22scheduled%22%3atrue%2c%22serviceName%22%3a%22jinhan0Fx4s.173TL.net%22%2c%22weight%22%3a1%7d'
```
### Response Example
```
ok
```


<h2 id="2.7">Create service</h2>

### Description
Create service

### Request Type
POST

### Request Path
```plain
/nacos/v1/ns/service
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| serviceName | String | yes | service name |
| groupName | String | no | group name |
| namespaceId | String | no | namespace id |
| protectThreshold | float | no | set value from 0 to 1, default 0 |
| metadata | String | no | metadata of service |
| selector | JSON | no | visit strategy |

### Error Codes

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in the client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |

### Request Example
```plain
curl -X POST '127.0.0.1:8848/nacos/v1/ns/service?serviceName=nacos.test.2&metadata=k1%3dv1'
```
### Response Example
```
ok
```


<h2 id="2.8">Delete service</h2>

### Description
Delete a service, only permitted when instance count is 0.

### Request Type
DELETE

### Request Path
```plain
/nacos/v1/ns/service
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| serviceName | String | yes | service name |
| groupName | String | no | group name |
| namespaceId | String | no | namespace id |

### Error Codes

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in the client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |

### Request Example
```plain
curl -X DELETE '127.0.0.1:8848/nacos/v1/ns/service?serviceName=nacos.test.2'
```
### Response Example
```
ok
```

<h2 id="2.9">Update service</h2>

### Description
Update a service

### Request Type
PUT

### Request Path
```plain
/nacos/v1/ns/service
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| serviceName | String | yes | service name |
| groupName | String | no | group name |
| namespaceId | String | no | namespace id |
| protectThreshold | float | no | set value from 0 to 1, default 0 |
| metadata | String | no | metadata of service |
| selector | JSON | no | visit strategy |

### Error Codes

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in the client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |

### Request Example
```plain
curl -X PUT '127.0.0.1:8848/nacos/v1/ns/service?serviceName=nacos.test.2&metadata=k1%3dv1'
```
### Response Example
```
ok
```


<h2 id="2.10">Query service</h2>

### Description
Query a service

### Request Type
GET

### Request Path
```plain
/nacos/v1/ns/service
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| serviceName | String | yes | service name |
| groupName | String | no | group name |
| namespaceId | String | no | namespace id |

### Error Codes

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in the client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |

### Request Example
```plain
curl -X GET '127.0.0.1:8848/nacos/v1/ns/service?serviceName=nacos.test.2'
```
### Response Example
```
{
    metadata: { },
    groupName: "DEFAULT_GROUP",
    namespaceId: "public",
    name: "nacos.test.2",
    selector: {
        type: "none"
    },
    protectThreshold: 0,
    clusters: [
        {
            healthChecker: {
                type: "TCP"
            },
            metadata: { },
            name: "c1"
        }
    ]
}
```


<h2 id="2.11">Query service list</h2>

### Description
Query service list

### Request Type
GET

### Request Path
```plain
/nacos/v1/ns/service/list
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| pageNo | int | yes | current page number |
| pageSize | int | yes | page size |
| groupName | String | no | group name |
| namespaceId | String | no | namespace id |

### Error Codes

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in the client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |

### Request Example
```plain
curl -X GET '127.0.0.1:8848/nacos/v1/ns/service/list?pageNo=1&pageSize=2'
```
### Response Example
```
{
    "count":148,
    "doms": [
        "nacos.test.1",
        "nacos.test.2"
    ]
}
```

<h2 id="2.12">Query system switches</h2>

### Description
Query system switches

### Request Type
GET

### Request Path
```plain
/nacos/v1/ns/operator/switches
```

### Request Parameters

### Error Codes

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in the client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |

### Request Example
```plain
curl -X GET '127.0.0.1:8848/nacos/v1/ns/operator/switches'
```
### Response Example
```
{
    name: "00-00---000-NACOS_SWITCH_DOMAIN-000---00-00",
    masters: null,
    adWeightMap: { },
    defaultPushCacheMillis: 10000,
    clientBeatInterval: 5000,
    defaultCacheMillis: 3000,
    distroThreshold: 0.7,
    healthCheckEnabled: true,
    distroEnabled: true,
    enableStandalone: true,
    pushEnabled: true,
    checkTimes: 3,
    httpHealthParams: {
        max: 5000,
        min: 500,
        factor: 0.85
    },
    tcpHealthParams: {
        max: 5000,
        min: 1000,
        factor: 0.75
    },
    mysqlHealthParams: {
        max: 3000,
        min: 2000,
        factor: 0.65
    },
    incrementalList: [ ],
    serverStatusSynchronizationPeriodMillis: 15000,
    serviceStatusSynchronizationPeriodMillis: 5000,
    disableAddIP: false,
    sendBeatOnly: false,
    limitedUrlMap: { },
    distroServerExpiredMillis: 30000,
    pushGoVersion: "0.1.0",
    pushJavaVersion: "0.1.0",
    pushPythonVersion: "0.4.3",
    pushCVersion: "1.0.12",
    enableAuthentication: false,
    overriddenServerStatus: "UP",
    defaultInstanceEphemeral: true,
    healthCheckWhiteList: [ ],
    checksum: null
}
```

<h2 id="2.13">Update system switch</h2>

### Description
Update system switch

### Request Type
PUT

### Request Path
```plain
/nacos/v1/ns/operator/switches
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| entry | String | yes | switch name |
| value | String | yes | switch value |
| debug | boolean | no | if affect the local server, true means yes, false means no, default true |

### Error Codes

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in the client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |

### Request Example
```plain
curl -X PUT '127.0.0.1:8848/nacos/v1/ns/operator/switches?entry=pushEnabled&value=false&debug=true'
```
### Response Example
```
ok
```

<h2 id="2.14">Query system metrics</h2>

### Description
Query system metrics

### Request Type
GET

### Request Path
```plain
/nacos/v1/ns/operator/metrics
```

### Request Parameters

### Error Codes

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in the client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |

### Request Example
```plain
curl -X GET '127.0.0.1:8848/nacos/v1/ns/operator/metrics'
```
### Response Example
```
{
    serviceCount: 336,
    load: 0.09,
    mem: 0.46210432,
    responsibleServiceCount: 98,
    instanceCount: 4,
    cpu: 0.010242796,
    status: "UP",
    responsibleInstanceCount: 0
}
```

<h2 id="2.15">Query server list</h2>

### Description
Query server list

### Request Type
GET

### Request Path
```plain
/nacos/v1/ns/operator/servers
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| healthy | boolean | no | if return healthy servers only |

### Error Codes

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in the client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |

### Request Example
```plain
curl -X GET '127.0.0.1:8848/nacos/v1/ns/operator/servers'
```

### Response Example
```
{
    servers: [
        {
            ip: "1.1.1.1",
            servePort: 8848,
            site: "unknown",
            weight: 1,
            adWeight: 0,
            alive: false,
            lastRefTime: 0,
            lastRefTimeStr: null,
            key: "1.1.1.1:8848"
        },
        {
            ip: "1.1.1.2",
            servePort: 8848,
            site: "unknown",
            weight: 1,
            adWeight: 0,
            alive: false,
            lastRefTime: 0,
            lastRefTimeStr: null,
            key: "1.1.1.2:8848"
        },
        {
            ip: "1.1.1.3",
            servePort: 8848,
            site: "unknown",
            weight: 1,
            adWeight: 0,
            alive: false,
            lastRefTime: 0,
            lastRefTimeStr: null,
            key: "1.1.1.3:8848"
        }
    ]
}
```


<h2 id="2.16">Query the leader of current cluster</h2>

### Description
Query the leader of current cluster

### Request Type
GET

### Request Path
```plain
/nacos/v1/ns/raft/leader
```

### Request Parameters

### Error Codes

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in the client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |

### Request Example
```plain
curl -X GET '127.0.0.1:8848/nacos/v1/ns/raft/leader'
```
### Response Example
```
{
    leader: "{"heartbeatDueMs":2500,"ip":"1.1.1.1:8848","leaderDueMs":12853,"state":"LEADER","term":54202,"voteFor":"1.1.1.1:8848"}"
}
```

<h2 id="2.17">Update instance health status</h2>

### Description
Update instance health status, only works when the cluster health checker is set to NONE.

### Request Type
PUT

### Request Path
```plain
/nacos/v1/ns/health/instance
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| serviceName | String | yes | service name |
| groupName | String | no | group name |
| namespaceId | String | no | namespace id |
| clusterName | String | no | cluster name |
| ip | String | yes | ip of instance |
| port | int | yes | port of instance |
| healthy | boolean | yes | if healthy |

### Error Codes

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in the client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |

### Request Example
```plain
curl -X PUT 'http://127.0.0.1:8848/nacos/v1/ns/health/instance?port=8848&healthy=true&ip=11.11.11.11&serviceName=nacos.test.3&namespaceId=n1'
```
### Response Example
ok


<h2 id="2.18">Batch update instance metadata(Beta)</h2>

### Description
Batch update instance metadata(Since 1.4)

> Note: This API is a Beta API, later versions maybe modify or even delete. Please use it with caution.

### Request Type
PUT

### Request Path
```plain
/nacos/v1/ns/instance/metadata/batch
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| namespaceId | String | yes | ID of namespace |
| serviceName | String | yes | Service name(group@@serviceName) |
| consistencyType | String | no | instance type (ephemeral/persist) |
| instances | JSON | no | The instances which need to update |
| metadata | JSON | yes | Metadata |

### Error Codes

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in the client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |

### Parameter description
* consistencyType: The priority higher than param instances, if config it, the param instances will be ignored. When when value equals 'ephemeral', all the ephemeral instances in serviceName will be updated. When when value equals 'persist', all the persist instances in serviceName will be updated. When other value, no instances will be updated.
* instances: json array. To locate particular instances by (ip + port + ephemeral + cluster).

### Request Example
```plain
curl -X PUT 'http://localhost:8848/nacos/v1/ns/instance/metadata/batch' -d 'namespaceId=public&serviceName=xxxx@@xxxx&instances=[{"ip":"3.3.3.3","port": "8080","ephemeral":"true","clusterName":"xxxx-cluster"},{"ip":"2.2.2.2","port":"8080","ephemeral":"true","clusterName":"xxxx-cluster"}]&metadata={"age":"20","name":"cocolan"}' 
or
curl -X PUT 'http://localhost:8848/nacos/v1/ns/instance/metadata/batch' -d 'namespaceId=public&serviceName=xxxx@@xxxx&consistencyType=ephemeral&metadata={"age":"20","name":"cocolan"}'
```
### Response Example
```
{"updated":["2.2.2.2:8080:unknown:xxxx-cluster:ephemeral","3.3.3.3:8080:unknown:xxxx-cluster:ephemeral"]}
```

<h2 id="2.19">Batch delete instance metadata(Beta)</h2>

### Description
Batch delete instance metadata(Since 1.4)

> Note: This API is a Beta API, later versions maybe modify or even delete. Please use it with caution.

### Request Type
DELETE

### Request Path
```plain
/nacos/v1/ns/instance/metadata/batch
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| namespaceId | String | yes | ID of namespace |
| serviceName | String | yes | Service name(group@@serviceName) |
| consistencyType | String | no | instance type (ephemeral/persist) |
| instances | JSON | no | The instances which need to update |
| metadata | JSON | yes | Metadata |

### Error Codes

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in the client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |

### Parameter description
* consistencyType: The priority higher than param instances, if config it, the param instances will be ignored. When when value equals 'ephemeral', all the ephemeral instances in serviceName will be updated. When when value equals 'persist', all the persist instances in serviceName will be updated. When other value, no instances will be updated.
* instances: json array. To locate particular instances by (ip + port + ephemeral + cluster).

### Request Example
```plain
curl -X DELETE 'http://localhost:8848/nacos/v1/ns/instance/metadata/batch' -d 'namespaceId=public&serviceName=xxxx@@xxxx&instances=[{"ip":"3.3.3.3","port": "8080","ephemeral":"true","clusterName":"xxxx-cluster"},{"ip":"2.2.2.2","port":"8080","ephemeral":"true","clusterName":"xxxx-cluster"}]&metadata={"age":"20","name":"cocolan"}' 
or
curl -X DELETE 'http://localhost:8848/nacos/v1/ns/instance/metadata/batch' -d 'namespaceId=public&serviceName=xxxx@@xxxx&consistencyType=ephemeral&metadata={"age":"20","name":"cocolan"}'
```
### Response Example
```
{"updated":["2.2.2.2:8080:unknown:xxxx-cluster:ephemeral","3.3.3.3:8080:unknown:xxxx-cluster:ephemeral"]}
```

## Namespace

<h2 id="3.1">Get namespace</h2>

### Description
This API is used to get namespaces in Nacos.

### Request Type
GET

### Request Path
```plain
/nacos/v1/ns/instance
```

### Request Parameters
None

### error Codes

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in the client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |

### Request Example
```plain
curl -X GET 'http://localhost:8848/nacos/v1/console/namespaces'
```
### Response Example
```
{"code":200,"message":null,"data":[{"namespace":"","namespaceShowName":"public","quota":200,"configCount":0,"type":0}]}
```

<h2 id="3.2">Create namespace</h2>

### Description
Create namespace

### Request Type
POST

### Request Path
```plain
/nacos/v1/console/namespaces
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| customNamespaceId | String | yes | ID of namespace |
| namespaceName | String | yes | Namespace name |
| namespaceDesc | String | no | Namespace description |

### error Codes

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in the client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |

### Request Example
```plain
curl -X POST 'http://localhost:8848/nacos/v1/console/namespaces' -d 'customNamespaceId=&namespaceName=dev&namespaceDesc='
```
### Response Example
```
true
```

<h2 id="3.3">Modify namespace</h2>

### Description
Update namespace

### Request Type
PUT

### Request Path
```plain
/nacos/v1/console/namespaces
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| namespaceId | String | yes | ID of namespace |
| namespaceName | String | yes | Namespace name |
| namespaceDesc | String | yes | Namespace description |

### error Codes

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in the client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |

### Request Example
```plain
curl -X PUT 'http://localhost:8848/nacos/v1/console/namespaces' -d 'namespace=dev&namespaceShowName=开发环境2&namespaceDesc=只用于开发2'
```
### Response Example
```
true
```

<h2 id="3.4">Delete namespace</h2>

### Description
It deletes namespace in Nacos.

### Request Type
DELETE

### Request Path
```plain
/nacos/v1/console/namespaces
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| namespaceId | String | yes | ID of namespace |

### error Codes

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in the client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |

### Request Example
```plain
curl -X DELETE 'http://localhost:8848/nacos/v1/console/namespaces' -d 'namespaceId=dev'
```
### Response Example
```
true
```