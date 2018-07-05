# 配置管理
## 获取配置
### 描述

获取Nacos上的配置。

### 请求类型
GET

### 请求URL
/nacos/config.co

### 请求参数

| 名称 | 类型 | 是否必须 | 描述 |
| :--- | :--- | :--- | :--- |
| tenant | string | 否 | 租户信息，对应 Nacos 的命名空间字段。 |
| dataId | string | 是 | 配置 ID。 |
| group | string | 是 | 配置分组。 |


### 返回参数

| 参数类型 | 描述 |
| :--- | :--- |
| string | 配置值 |


### 错误编码

| 错误代码 | 描述 | 语义 |
| :--- | :--- | :--- |
| 400 | Bad Request | 客户端请求中的语法错误 |
| 403 | Forbidden | 没有权限 |
| 404 | Not Found | 客户端错误，未找到 |
| 500 | Internal Server Error | 服务器内部错误 |
| 200 | OK | 正常 |


### 示例
* 请求示例

    ```
    http:serverIp:8080/nacos/config.co?dataId=dataIdparam&group=groupParam&tenant=tenantParam

    ```
* 返回示例

    ```
    contentTest
    ```


## 监听配置
### 描述

监听 Nacos 上的配置，以便实时感知配置变更。如果配置变更，则用[获取配置](~~64131~~)接口获取配置的最新值，动态刷新本地缓存。

注册监听采用的是异步 Servlet 技术。注册监听本质就是带着配置和配置值的 MD5 值和后台对比。如果 MD5 值不一致，就立即返回不一致的配置。如果值一致，就等待住 30 秒。返回值为空。

### 请求类型
POST

### 请求URL
/nacos/config.co

### 请求参数

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
          <div data-type="p">名称</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">类型</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">是否必须</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">描述</div>
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
          <div data-type="p">是</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">监听数据报文。格式为 dataId^2Group2contentMD5^2tenant^1或者dataId^2Group2contentMD5^1。</div>
          <ul data-type="unordered-list">
            <li data-type="list-item" data-list-type="unordered-list">
              <div data-type="p">dataId：配置 ID</div>
            </li>
            <li data-type="list-item" data-list-type="unordered-list">
              <div data-type="p">group：配置分组</div>
            </li>
            <li data-type="list-item" data-list-type="unordered-list">
              <div data-type="p">contentMD5：配置内容 MD5 值</div>
            </li>
            <li data-type="list-item" data-list-type="unordered-list">
              <div data-type="p">tenant：租户信息，对应 Nacos 的命名空间字段(非必填)</div>
            </li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
</div>


### Header 参数

| 名称 | 类型 | 是否必须 | 描述 |
| :--- | :--- | :--- | :--- |
| longPullingTimeout | string | 是 | 长轮训等待 30s，此处填写 30000。 |


### 参数说明
* 配置多个字段间分隔符：^2  = Character.toString((char) 2
* 配置间分隔符：^1 = Character.toString((char) 1)
* contentMD5:  MD5(content)，第一次本地缓存为空，所以这块为空串

### 返回参数

| 参数类型 | 描述 |
| :--- | :--- |
| string | 配置值 |


### 错误编码

| 错误代码 | 描述 | 语义 |
| :--- | :--- | :--- |
| 400 | Bad Request | 客户端请求中的语法错误 |
| 403 | Forbidden | 没有权限 |
| 404 | Not Found | 客户端错误，未找到 |
| 500 | Internal Server Error | 服务器内部错误 |
| 200 | OK | 正常 |


### 示例
* 请求示例

```
http://serverIp:8080/nacos/config.co

POST 请求体数据内容：

Probe-Modify-Request=dataId^2group^2contentMD5^2tenant^1

```

* 返回示例

```
如果配置变化

dataId^2group^2tenant^1

如果配置无变化：会返回空串
```

## 发布配置
### 描述

发布 Nacos 上的配置。

### 请求类型

POST

### 请求 URL

/nacos/basestone.do

### 请求参数

| 名称 | 类型 | 是否必须 | 描述 |
| :--- | :--- | :--- | :--- |
| tenant | string | 否 | 租户信息，对应 Nacos 的命名空间字段 |
| dataId | string | 是 | 配置 ID |
| group | string | 是 | 配置分组 |
| content | string | 是 | 配置内容 |


### 返回参数

| 参数类型 | 描述 |
| :--- | :--- |
| boolean | 是否发布成功 |


### 错误编码

| 错误代码 | 描述 | 语义 |
| :--- | :--- | :--- |
| 400 | Bad Request | 客户端请求中的语法错误 |
| 403 | Forbidden | 没有权限 |
| 404 | Not Found | 客户端错误，未找到 |
| 500 | Internal Server Error | 服务器内部错误 |
| 200 | OK | 正常 |


### 示例
* 请求示例

```
http:serverIp:8080/nacos/basestone.do?method=syncUpdateAll

http body：
dataId=dataIdparam&group=groupParam&tenant=tenantParam&content=contentParam

```
* 返回示例

```
true
```

## 删除配置
### 描述

删除 Nacos 上的配置。

### 请求类型
POST

### 请求 URL
/nacos/datum.do

### 请求参数

| 名称 | 类型 | 是否必须 | 描述 |
| :--- | :--- | :--- | :--- |
| tenant | string | 否 | 租户信息，对应 Naocs 的命名空间字段 |
| dataId | string | 是 | 配置 ID |
| group | string | 是 | 配置分组 |


### 返回参数

| 参数类型 | 描述 |
| :--- | :--- |
| boolean | 是否删除成功 |


### 错误编码

| 错误代码 | 描述 | 语义 |
| :--- | :--- | :--- |
| 400 | Bad Request | 客户端请求中的语法错误 |
| 403 | Forbidden | 没有权限 |
| 404 | Not Found | 客户端错误，未找到 |
| 500 | Internal Server Error | 服务器内部错误 |
| 200 | OK | 正常 |


### 示例
* 请求示例

```
http:serverIp:8080/nacos/datum.do?method=deleteAllDatums

http body：
dataId=dataIdparam&group=groupParam

```

* 返回示例

```
true
```

# 服务发现API
## 注册实例
### 描述
注册一个实例到服务。

### 请求类型
PUT

### 请求路径
```plain
/nacos/naming/instance
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| ip | 字符串 | 是 | 服务实例ip |
| port | int | 是 | 服务实例port |
| tenant | 字符串 | 否 | 租户ID |
| weight | double | 否 | 权重 |
| healthy | boolean | 否 | 是否健康 |
| metadata | 字符串 | 否 | 扩展信息 |
| cluster | JSON格式字符串 | 否 | 集群信息 |
| service | JSON格式字符串 | 否，不存在则serviceName必须存在。 | 服务信息 |
| serviceName | 字符串 | 如果service参数存在，则不必选，否则必选。 | 服务名 |

service参数格式：

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| name | 字符串 | 是 | 服务名 |
| app | int | 否 | 应用名 |
| group | 字符串 | 否 | 服务分组 |
| protectThreshold | double | 否 | 保护阈值 |
| enableHealthCheck | boolean | 否 | 是否打开心跳检查 |
| enableClientBeat | boolean | 否 | 是否打开客户端心跳 |
| metadata | JSON | 否 | 扩展信息 |

cluster参数格式：

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| name | 字符串 | 是 | 集群名 |
| serviceName | 字符串 | 是 | 集群归属的服务名 |
| healthChecker | JSON | 否 | 健康检查方式 |
| defaultPort | int | 否 | 默认实例端口 |
| defaultCheckPort | int | 否 | 默认健康检查端口 |
| userIPPort4Check | boolean | 否 | 是否用实例端口做健康检查 |
| metadata | JSON | 否 | 扩展信息 |

healthChecker目前支持三种：TCP、HTTP和MYSQL。
根据type的类型，需要传递的参数各有区别。
TCP类型：

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| type=TCP | 字符串 | 是 | 检查类型 |

HTTP类型：

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| type=HTTP | 字符串 | 是 | 检查类型 |
| curlPath | 字符串 | 是 | 检查路径 |
| curlHost | 字符串 | 否 | 检查host，存放HTTP Header |
| checkCode | int | 否，默认200 | 预期返回码 |

MYSQL类型：

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| type=MYSQL | 字符串 | 是 | 检查类型 |
| user | 字符串 | 是 | mysql用户 |
| pwd | 字符串 | 是 | mysql密码 |
| cmd | 字符串 | 是 | 执行命令 |

### 示例请求
```plain
curl -X PUT 'http://127.0.0.1:8080/nacos/naming/instance?cluster=%7b%22metadata%22%3a%7b%7d%2c%22defaultCheckPort%22%3a80%2c%22defaultPort%22%3a80%2c%22healthChecker%22%3a%7b%22type%22%3a%22TCP%22%7d%2c%22name%22%3a%22%22%2c%22useIPPort4Check%22%3atrue%7d&port=8080&healthy=true&ip=11.11.11.11&weight=1.0&serviceName=nacos.test.3&encoding=GBK&tenant=n1''
```
### 示例返回
ok

## 删除实例
### 描述
删除服务下的一个实例。

### 请求类型
DELETE

### 请求路径
```plain
/nacos/naming/instance
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| serviceName | 字符串 | 是 | 服务名 |
| ip | 字符串 | 是 | 服务实例ip |
| port | int | 是 | 服务实例port |
| cluster | 字符串 | 是 | 集群名称 |
| tenant | 字符串 | 否 | 租户ID |

### 示例请求
```plain
curl -X DELETE 127.0.0.1:8080/nacos/naming/instance?serviceName=nacos.test.1&ip=1.1.1.1&port=8888&cluster=TEST1
```
### 示例返回
ok
## 修改实例
### 描述
修改服务下的一个实例。

### 请求类型
POST

### 请求路径
```plain
/nacos/naming/instance
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| serviceName | 字符串 | 是 | 服务名 |
| ip | 字符串 | 是 | 服务实例ip |
| port | int | 是 | 服务实例port |
| cluster | 字符串 | 是 | 集群名称 |
| tenant | 字符串 | 否 | 租户ID |
| weight | double | 否 | 权重 |
| metadata | JSON | 否 | 扩展信息 |

### 示例请求
```plain
curl -X POST 127.0.0.1:8080/nacos/naming/instance?serviceName=nacos.test.1&ip=1.1.1.1&port=8888&cluster=TEST1&weight=8&metadata={}
```
### 示例返回
ok

## 查询实例列表
### 描述
查询服务下的实例列表

### 请求类型
GET

### 请求路径
```plain
/nacos/naming/instances
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| serviceName | 字符串 | 是 | 服务名 |
| tenant | 字符串 | 否 | 租户Id |
| clusters | 字符串，多个集群用逗号分隔 | 否 | 集群名称 |
| healthyOnly | boolean | 否，默认为false | 是否只返回健康实例 |

### 示例请求
```plain
curl -X GET 127.0.0.1:8080/nacos/naming/instances?serviceName=nacos.test.1
```
### 示例返回
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
## 查询实例详情
### 描述
查询一个服务下个某个实例详情。

### 请求类型
GET

### 请求路径
```plain
/nacos/naming/instance
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| serviceName | 字符串 | 是 | 服务名 |
| ip | 字符串 | 是 | 实例IP |
| port | 字符串 | 是 | 实例端口 |
| tenant | 字符串 | 否 | 租户Id |
| clusters | 字符串，多个集群用逗号分隔 | 否 | 集群名称 |
| healthyOnly | boolean | 否，默认为false | 是否只返回健康实例 |

### 示例请求
```plain
curl -X GET '127.0.0.1:8080/nacos/naming/instance?serviceName=nacos.test.2&ip=10.10.10.10&port=8888&cluster=DEFAULT'
```
### 示例返回
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

