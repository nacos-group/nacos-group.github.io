# Configaration Management
## Get configurations
### Description

This API is used to get configurations in Nacos.

### Request type
GET

### Request URL
/nacos/config.co

### Request parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| tenant | string | No | Tenant information. It corresponds to the Namespace field in Nacos. |
| dataId | string | Yes | Configuration ID. |
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
| 404 | Not Found | Client error, not found |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |


### Example
* Request example

    ```
    http:serverIp:8080/nacos/config.co?dataId=dataIdparam&group=groupParam&tenant=tenantParam

    ```
* Return example

    ```
    contentTest
    ```


## Listen for configurations
### Description

This API is used to listen for configurations in Nacos to capture the configuration changes. In case of any configuration changes, you can use the [Get Configurations](~~64131~~) API to obtain the latest value of the configuration and dynamically refresh the local cache.

A listener is registered using an asynchronous servlet. The nature of registering a listener is to compare the configuration value and the MD5 value of it with that of the backend. If the values differ, the inconsistent configuration is returned immediately. Otherwise, an empty string is returned after 30 seconds.

### Request type
POST

### Request URL
/nacos/config.co

### Request parameters

<div class="bi-table">
  <table>
    <colgroup>
      <col width="auto" />
      <col width="auto" />
      <col width="auto" />
      <col width="auto" />
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
          <div data-type="p">Probe-Modify-Request</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">string</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">No</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">A request to listen for data packets. Format : dataId^group^2contentMD5^tenant^1 or dataId^group^2contentMD5^1.</div>
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
          <div data-type="p">Probe-Modify-Request</div>
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
| longPullingTimeout | string | Yes | The time-out for long polling is 30s. Enter 30,000 here. |


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
http://serverIp:8080/nacos/config.co

POST request body data:

Probe-Modify-Request=dataId^2group^2contentMD5^2tenant^1

```

* Return example

```
In case of any configuration changes,

dataId^2group^2tenant^1

Otherwise, an empty string is returned.

```


## Publish configuration
### Description

It publishes configurations on Nacos.

### Request Type

POST

### Request URL

`/nacos/basestone.do`

### Request parameters


| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| tenant | String | No | The tenant, corresponding to the namespace field of Nacos |
| dataId | String | Yes | Configuration ID |
| group | String | Yes | Configuration group |
| content | String | Yes | Configuration content |

### Response parameters

| Parametertype | Description |
| --- | --- |
| boolean | If the publishing is successful  |


### Error code

| Error code | Description | Meaning |
| :--- | :--- | :--- |
| 400 | Bad Request | Syntax error in client request |
| 403 | Forbidden | No permission |
| 404 | Not Found | Client error, not found |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |


### Example
### Request example

```
http:serverIp:8080/nacos/basestone.do?method=syncUpdateAll

http body：
dataId=dataIdparam&group=groupParam&tenant=tenantParam&content=contentParam

```

#### Response example

```
true
```


## Delete configuration
### Description

It deletes configurations on Nacos.

### Request Type
POST

### Request URL
`/nacos/datum.do`

### Request parameters


| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| tenant | String | No | The tenant, corresponding to the namespace field of Nacos |
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
| 404 | Not Found | Client error, not found |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |


### Example
#### Request example

```
http:serverIp:8080/nacos/datum.do?method=deleteAllDatums

http body：
dataId=dataIdparam&group=groupParam

```

#### Response example

```
true
```

# Service Discovery API
## Register Instance
### Description
Register an instance to service.

### Request Type
PUT

### Request Path
```plain
/nacos/naming/instance
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| ip | String | yes | IP of instance |
| port | int | yes | port of instance |
| tenant | String | no | ID of tenant |
| weight | double | no | Weight |
| healthy | boolean | no | healthy or not |
| metadata | String | no | extended information |
| cluster | JSON String | no | cluster information |
| service | JSON String | yes if servicName not exist | service information |
| serviceName | String | yes if service not exist | service name |

format of service：

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| name | String | yes | service name |
| app | int | no | application name |
| group | String | no | service group |
| protectThreshold | double | no | protect threshold |
| enableHealthCheck | boolean | no | health check enabled or not |
| enableClientBeat | boolean | no | client heart beat enabled or not |
| metadata | JSON String | no | extended information |

format cluster：

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| name | String | yes | virtual cluster name |
| serviceName | String | yes | service name of virtual cluster |
| healthChecker | JSON String | yes | health check type |
| defaultPort | int | no | default port of instance |
| defaultCheckPort | int | no | default health check port of instance |
| userIPPort4Check | boolean | no | if instance port used for health check |
| metadata | JSON String | no | extended information |

healthChecker currently supports three types：TCP, HTTP and MYSQL。
Depending on the type of type, there are differences in the parameters that need to be passed.

TCP type：

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| type=TCP | String | yes | check type |

HTTP type：

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| type=HTTP | String | yes | check type |
| curlPath | String | yes | check path |
| curlHost | String | no | HTTP Header |
| checkCode | int | no, default value is 200 | expected return code |

MYSQL type：

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| type=MYSQL | String | yes | check type |
| user | String | yes | mysql user name |
| pwd | String | yes | mysql password |
| cmd | String | yes | sql to execute |

### Request Example
```plain
curl -X PUT 'http://127.0.0.1:8080/nacos/naming/instance?cluster=%7b%22metadata%22%3a%7b%7d%2c%22defaultCheckPort%22%3a80%2c%22defaultPort%22%3a80%2c%22healthChecker%22%3a%7b%22type%22%3a%22TCP%22%7d%2c%22name%22%3a%22%22%2c%22useIPPort4Check%22%3atrue%7d&port=8080&healthy=true&ip=11.11.11.11&weight=1.0&serviceName=nacos.test.3&encoding=GBK&tenant=n1''
```

### Response Example
ok

## Deregister Instance
### Description
Delete instacne from service.

### Request Type
DELETE

### Request Path
```plain
/nacos/naming/instance
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| serviceName | String | yes | service name |
| ip | String | yes | IP of instance |
| port | int | yes | port of instance |
| cluster | String | yes | cluster name |
| tenant | String | no | ID of tenant |

### Request Example
```plain
curl -X DELETE 127.0.0.1:8080/nacos/naming/instance?serviceName=nacos.test.1&ip=1.1.1.1&port=8888&cluster=TEST1
```
### Response Example
ok
## Modify Instance
### Description
Modify an instance of service.

### Request Type
POST

### Request Path
```plain
/nacos/naming/instance
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| serviceName | String | yes | service name |
| ip | String | yes | IP of instance |
| port | int | yes | port of instance |
| cluster | String | yes | cluster name |
| tenant | String | no | ID of tenant |
| weight | double | no | weight |
| metadata | JSON | no | extended information |

### Request Example
```plain
curl -X POST 127.0.0.1:8080/nacos/naming/instance?serviceName=nacos.test.1&ip=1.1.1.1&port=8888&cluster=TEST1&weight=8&metadata={}
```
### Response Example
ok

## Query Instances
### Description
Query instance list of service.

### Request Type
GET

### Request Path
```plain
/nacos/naming/instances
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| serviceName | String | yes | service name |
| tenant | String | no | ID of tenant |
| clusters | String, splited by comma | no | cluster name |
| healthyOnly | boolean | no, default value is false | Return healthy instacne or not |

### Request Example
```plain
curl -X GET 127.0.0.1:8080/nacos/naming/instances?serviceName=nacos.test.1
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
## Query Instance Detail

### Description
Query instacne detail of service.

### Request Type
GET

### Request Path
```plain
/nacos/naming/instance
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| serviceName | String | yes | service name |
| ip | String | yes | IP of instance |
| port | String | yes | port of instance |
| tenant | String | no | ID of tenant |
| clusters | String, splited by comma | no | cluster name |

### Request Example
```plain
curl -X GET '127.0.0.1:8080/nacos/naming/instance?serviceName=nacos.test.2&ip=10.10.10.10&port=8888&cluster=DEFAULT'
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

