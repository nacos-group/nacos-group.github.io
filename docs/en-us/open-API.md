# Configuration Management
## Get configurations
### Description

This API is used to get configurations in Nacos.

### Request type
GET

### Request URL
/nacos/v1/cs/configs

### Request parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| tenant | string | No | Tenant information. It corresponds to the Namespace field in Nacos. |
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
    http:serverIp:8848/nacos/v1/cs/configs?dataId=dataIdparam&group=groupParam&tenant=tenantParam
    
    ```
* Return example
    
    ```
    contentTest
    ```


## Listen for configurations
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


## Publish configuration
### Description

It publishes configurations in Nacos.

### Request Type

POST

### Request URL

/nacos/v1/cs/configs

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
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |


### Example
### Request example

```
http:serverIp:8848/nacos/v1/cs/configs

http body：
dataId=dataIdparam&group=groupParam&tenant=tenantParam&content=contentParam

```

#### Response example

```
true
```


## Delete configuration
### Description

It deletes configurations in Nacos.

### Request Type
DELETE

### Request URL

/nacos/v1/cs/configs

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
| 404 | Not Found | Not found resource |
| 500 | Internal Server Error | Internal server error |
| 200 | OK | Normal |


### Example
#### Request example

```
http:serverIp:8848/nacos/cs/configs?dataId=dataIdparam&group=groupParam

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
/nacos/v1/ns/instance
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| ip | String | yes | IP of instance |
| port | int | yes | Port of instance |
| tenant | String | no | ID of tenant |
| weight | double | no | Weight |
| enable | boolean | no | enabled or not |
| healthy | boolean | no | healthy or not |
| metadata | String | no | extended information |
| clusterName | String | no | cluster name |
| serviceName | String | yes | service name |


### Request Example
```plain
curl -X PUT 'http://127.0.0.1:8848/nacos/v1/ns/instance?port=8848&healthy=true&ip=11.11.11.11&weight=1.0&serviceName=nacos.test.3&encoding=GBK&tenant=n1''
```

### Response Example
ok

## Deregister Instance
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
| ip | String | yes | IP of instance |
| port | int | yes | Port of instance |
| cluster | String | yes | Cluster name |
| tenant | String | no | ID of tenant |

### Request Example
```plain
curl -X DELETE 127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.test.1&ip=1.1.1.1&port=8888&cluster=TEST1
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
/nacos/v1/ns/instance
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| serviceName | String | yes | Service name |
| ip | String | yes | IP of instance |
| port | int | yes | Port of instance |
| cluster | String | yes | Cluster name |
| tenant | String | no | ID of tenant |
| weight | double | no | Weight |
| metadata | JSON | no | Extended information |

### Request Example
```plain
curl -X POST 127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.test.1&ip=1.1.1.1&port=8888&cluster=TEST1&weight=8&metadata={}
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
/nacos/v1/ns/instance/list
```

### Request Parameters

| Name | Type | Required | Description |
| :--- | :--- | :--- | --- |
| serviceName | String | yes | Service name |
| tenant | String | no | ID of tenant |
| clusters | String, splited by comma | no | Cluster name |
| healthyOnly | boolean | no, default value is false | Return healthy instance or not |

### Request Example
```plain
curl -X GET 127.0.0.1:8848/nacos/v1/ns/instance/list?serviceName=nacos.test.1
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
| serviceName | String | yes | Service name |
| ip | String | yes | IP of instance |
| port | String | yes | Port of instance |
| tenant | String | no | ID of tenant |
| clusters | String, splited by comma | no | Cluster name |

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

