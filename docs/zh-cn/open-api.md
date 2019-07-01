---
title: Open API 指南
keywords: Open API
description: Open API 指南
---

- 配置管理
  - [获取配置](#1.1)
  - [监听配置](#1.2)
  - [发布配置](#1.3)
  - [删除配置](#1.4)


- 服务发现
  - [注册实例](#2.1)
  - [注销实例](#2.2)
  - [修改实例](#2.3)
  - [查询实例列表](#2.4)
  - [查询实例详情](#2.5)
  - [发送实例心跳](#2.6)
  - [创建服务](#2.7)
  - [删除服务](#2.8)
  - [修改服务](#2.9)
  - [查询服务](#2.10)
  - [查询服务列表](#2.11)
  - [查询系统开关](#2.12)
  - [修改系统开关](#2.13)
  - [查看系统当前数据指标](#2.14)
  - [查看当前集群Server列表](#2.15)
  - [查看当前集群leader](#2.16)
  - [更新实例的健康状态](#2.17)

# Open API 指南
# 配置管理

<h2 id="1.1">获取配置</h2>

### 描述

获取Nacos上的配置。

### 请求类型
GET

### 请求URL
/nacos/v1/cs/configs

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
| 404 | Not Found | 无法找到资源 |
| 500 | Internal Server Error | 服务器内部错误 |
| 200 | OK | 正常 |


### 示例
* 请求示例

    ```plain
    http:serverIp:8848/nacos/v1/cs/configs?dataId=dataIdparam&group=groupParam&tenant=tenantParam

    ```
* 返回示例

    ```
    contentTest
    ```


<h2 id="1.2">监听配置</h2>

### 描述

监听 Nacos 上的配置，以便实时感知配置变更。如果配置变更，则用[获取配置](~~64131~~)接口获取配置的最新值，动态刷新本地缓存。

注册监听采用的是异步 Servlet 技术。注册监听本质就是带着配置和配置值的 MD5 值和后台对比。如果 MD5 值不一致，就立即返回不一致的配置。如果值一致，就等待住 30 秒。返回值为空。

### 请求类型
POST

### 请求URL
/nacos/v1/cs/configs/listener

### 请求参数

<div class="bi-table">
  <table>
    <colgroup>
      <col width="auto" />
      <col width="118px" />
      <col width="115px" />
      <col width="325px" />
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
          <div data-type="p">Listening-Configs</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">string</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">是</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">监听数据报文。格式为 dataId^2Group^2contentMD5^2tenant^1或者dataId^2Group^2contentMD5^1。</div>
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
| Long-Pulling-Timeout | string | 是 | 长轮训等待 30s，此处填写 30000。 |


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
| 404 | Not Found | 无法找到资源 |
| 500 | Internal Server Error | 服务器内部错误 |
| 200 | OK | 正常 |


### 示例
* 请求示例

```
http://serverIp:8848/nacos/v1/cs/configs/listener

POST 请求体数据内容：

Listening-Configs=dataId^2group^2contentMD5^2tenant^1
```

* 返回示例

```
如果配置变化

dataId^2group^2tenant^1

如果配置无变化：会返回空串
```

<h2 id="1.3">发布配置</h2>

### 描述

发布 Nacos 上的配置。

### 请求类型

POST

### 请求 URL
/nacos/v1/cs/configs

### 请求参数

| 名称 | 类型 | 是否必须 | 描述 |
| :--- | :--- | :--- | :--- |
| tenant | string | 否 | 租户信息，对应 Nacos 的命名空间字段 |
| dataId | string | 是 | 配置 ID |
| group | string | 是 | 配置分组 |
| content | string | 是 | 配置内容 |
| type | String | 否 | 配置类型 |


### 返回参数

| 参数类型 | 描述 |
| :--- | :--- |
| boolean | 是否发布成功 |


### 错误编码

| 错误代码 | 描述 | 语义 |
| :--- | :--- | :--- |
| 400 | Bad Request | 客户端请求中的语法错误 |
| 403 | Forbidden | 没有权限 |
| 404 | Not Found | 无法找到资源 |
| 500 | Internal Server Error | 服务器内部错误 |
| 200 | OK | 正常 |


### 示例
* 请求示例

```
http:serverIp:8848/nacos/v1/cs/configs

http body：
dataId=dataIdparam&group=groupParam&tenant=tenantParam&content=contentParam&type=typeParam

```
* 返回示例

```
true
```

<h2 id="1.4">删除配置</h2>

### 描述

删除 Nacos 上的配置。

### 请求类型
DELETE

### 请求 URL
/nacos/v1/cs/configs

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
| 404 | Not Found | 无法找到资源 |
| 500 | Internal Server Error | 服务器内部错误 |
| 200 | OK | 正常 |


### 示例
* 请求示例

```
http:serverIp:8848/nacos/v1/cs/configs?dataId=dataIdparam&group=groupParam

```

* 返回示例

```
true
```

# 服务发现

<h2 id="2.1">注册实例</h2>

### 描述
注册一个实例到服务。

### 请求类型
POST

### 请求路径
```plain
/nacos/v1/ns/instance
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| ip | 字符串 | 是 | 服务实例IP |
| port | int | 是 | 服务实例port |
| namespaceId | 字符串 | 否 | 命名空间ID |
| weight | double | 否 | 权重 |
| enabled | boolean | 否 | 是否上线 |
| healthy | boolean | 否 | 是否健康 |
| metadata | 字符串 | 否 | 扩展信息 |
| clusterName | 字符串 | 否 | 集群名 |
| serviceName | 字符串 | 是 | 服务名 |
| groupName | 字符串 | 否 | 分组名 |
| ephemeral | boolean | 否 | 是否临时实例 |

### 示例请求
```plain
curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?port=8848&healthy=true&ip=11.11.11.11&weight=1.0&serviceName=nacos.test.3&encoding=GBK&namespaceId=n1''
```
### 示例返回
ok

<h2 id="2.2">注销实例</h2>

### 描述
删除服务下的一个实例。

### 请求类型
DELETE

### 请求路径
```plain
/nacos/v1/ns/instance
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| serviceName | 字符串 | 是 | 服务名 |
| groupName | 字符串 | 否 | 分组名 |
| ip | 字符串 | 是 | 服务实例IP |
| port | int | 是 | 服务实例port |
| clusterName | 字符串 | 否 | 集群名称 |
| namespaceId | 字符串 | 否 | 命名空间ID |
| ephemeral | boolean | 否 | 是否临时实例 |

### 示例请求
```plain
curl -X DELETE 127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.test.1&ip=1.1.1.1&port=8888&clusterName=TEST1
```
### 示例返回
ok

<h2 id="2.3">修改实例</h2>

### 描述
修改服务下的一个实例。

### 请求类型
PUT

### 请求路径
```plain
/nacos/v1/ns/instance
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| serviceName | 字符串 | 是 | 服务名 |
| groupName | 字符串 | 否 | 分组名 |
| ip | 字符串 | 是 | 服务实例IP |
| port | int | 是 | 服务实例port |
| clusterName | 字符串 | 否 | 集群名称 |
| namespaceId | 字符串 | 否 | 命名空间ID |
| weight | double | 否 | 权重 |
| metadata | JSON | 否 | 扩展信息 |
| enabled | boolean | 否 | 是否打开流量 |
| ephemeral | boolean | 否 | 是否临时实例 |

### 示例请求
```plain
curl -X PUT 127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.test.1&ip=1.1.1.1&port=8888&clusterName=TEST1&weight=8&metadata={}
```
### 示例返回
ok

<h2 id="2.4">查询实例列表</h2>

### 描述
查询服务下的实例列表

### 请求类型
GET

### 请求路径
```plain
/nacos/v1/ns/instance/list
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| serviceName | 字符串 | 是 | 服务名 |
| groupName | 字符串 | 否 | 分组名 |
| namespaceId | 字符串 | 否 | 命名空间ID |
| clusters | 字符串，多个集群用逗号分隔 | 否 | 集群名称 |
| healthyOnly | boolean | 否，默认为false | 是否只返回健康实例 |

### 示例请求
```plain
curl -X GET 127.0.0.1:8848/nacos/v1/ns/instance/list?serviceName=nacos.test.1
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
<h2 id="2.5">查询实例详情</h2>

### 描述
查询一个服务下个某个实例详情。

### 请求类型
GET

### 请求路径
```plain
/nacos/v1/ns/instance
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| serviceName | 字符串 | 是 | 服务名 |
| groupName | 字符串 | 否 | 分组名 |
| ip | 字符串 | 是 | 实例IP |
| port | 字符串 | 是 | 实例端口 |
| namespaceId | 字符串 | 否 | 命名空间ID |
| cluster | 字符串 | 否 | 集群名称 |
| healthyOnly | boolean | 否，默认为false | 是否只返回健康实例 |
| ephemeral | boolean | 否 | 是否临时实例 |

### 示例请求
```plain
curl -X GET '127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.test.2&ip=10.10.10.10&port=8888&cluster=DEFAULT'
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

<h2 id="2.6">发送实例心跳</h2>

### 描述
发送某个实例的心跳

### 请求类型
PUT

### 请求路径
```plain
/nacos/v1/ns/instance/beat
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| serviceName | 字符串 | 是 | 服务名 |
| groupName | 字符串 | 否 | 分组名 |
| ephemeral | boolean | 否 | 是否临时实例 |
| beat | JSON格式字符串 | 是 | 实例心跳内容 |

### 示例请求
```plain
curl -X PUT '127.0.0.1:8848/nacos/v1/ns/instance/beat?serviceName=nacos.test.2&beat=%7b%22cluster%22%3a%22c1%22%2c%22ip%22%3a%22127.0.0.1%22%2c%22metadata%22%3a%7b%7d%2c%22port%22%3a8080%2c%22scheduled%22%3atrue%2c%22serviceName%22%3a%22jinhan0Fx4s.173TL.net%22%2c%22weight%22%3a1%7d'
```
### 示例返回
```
ok
```


<h2 id="2.7">创建服务</h2>

### 描述
创建一个服务

### 请求类型
POST

### 请求路径
```plain
/nacos/v1/ns/service
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| serviceName | 字符串 | 是 | 服务名 |
| groupName | 字符串 | 否 | 分组名 |
| namespaceId | 字符串 | 否 | 命名空间ID |
| protectThreshold | 浮点数 | 否 | 保护阈值,取值0到1,默认0 |
| metadata | 字符串 | 否 | 元数据 |
| selector | JSON格式字符串 | 否 | 访问策略 |

### 示例请求
```plain
curl -X POST '127.0.0.1:8848/nacos/v1/ns/service?serviceName=nacos.test.2&metadata=k1%3dv1'
```
### 示例返回
```
ok
```


<h2 id="2.8">删除服务</h2>

### 描述
删除一个服务,只有当服务下实例数为0时允许删除

### 请求类型
DELETE

### 请求路径
```plain
/nacos/v1/ns/service
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| serviceName | 字符串 | 是 | 服务名 |
| groupName | 字符串 | 否 | 分组名 |
| namespaceId | 字符串 | 否 | 命名空间ID |


### 示例请求
```plain
curl -X DELETE '127.0.0.1:8848/nacos/v1/ns/service?serviceName=nacos.test.2'
```
### 示例返回
```
ok
```

<h2 id="2.9">修改服务</h2>

### 描述
更新一个服务

### 请求类型
PUT

### 请求路径
```plain
/nacos/v1/ns/service
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| serviceName | 字符串 | 是 | 服务名 |
| groupName | 字符串 | 否 | 分组名 |
| namespaceId | 字符串 | 否 | 命名空间ID |
| protectThreshold | 浮点数 | 否 | 保护阈值,取值0到1,默认0 |
| metadata | 字符串 | 否 | 元数据 |
| selector | JSON格式字符串 | 否 | 访问策略 |

### 示例请求
```plain
curl -X PUT '127.0.0.1:8848/nacos/v1/ns/service?serviceName=nacos.test.2&metadata=k1%3dv1'
```
### 示例返回
```
ok
```


<h2 id="2.10">查询服务</h2>

### 描述
查询一个服务

### 请求类型
GET

### 请求路径
```plain
/nacos/v1/ns/service
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| serviceName | 字符串 | 是 | 服务名 |
| groupName | 字符串 | 否 | 分组名 |
| namespaceId | 字符串 | 否 | 命名空间ID |


### 示例请求
```plain
curl -X GET '127.0.0.1:8848/nacos/v1/ns/service?serviceName=nacos.test.2'
```
### 示例返回
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


<h2 id="2.11">查询服务列表</h2>

### 描述
查询服务列表

### 请求类型
GET

### 请求路径
```plain
/nacos/v1/ns/service/list
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| pageNo | int | 是 | 当前页码 |
| pageSize | int | 是 | 分页大小 |
| groupName | 字符串 | 否 | 分组名 |
| namespaceId | 字符串 | 否 | 命名空间ID |


### 示例请求
```plain
curl -X GET '127.0.0.1:8848/nacos/v1/ns/service/list?pageNo=1&pageSize=2'
```
### 示例返回
```
{
    "count":148,
    "doms": [
        "nacos.test.1",
        "nacos.test.2"
    ]
}
```

<h2 id="2.12">查询系统开关</h2>

### 描述
查询系统开关

### 请求类型
GET

### 请求路径
```plain
/nacos/v1/ns/operator/switches
```

### 请求参数


### 示例请求
```plain
curl -X GET '127.0.0.1:8848/nacos/v1/ns/operator/switches'
```
### 示例返回
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

<h2 id="2.13">修改系统开关</h2>

### 描述
修改系统开关

### 请求类型
PUT

### 请求路径
```plain
/nacos/v1/ns/operator/switches
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| entry | 字符串 | 是 | 开关名 |
| value | 字符串 | 是 | 开关值 |
| debug | boolean | 否 | 是否只在本机生效,true表示本机生效,false表示集群生效 |


### 示例请求
```plain
curl -X PUT '127.0.0.1:8848/nacos/v1/ns/operator/switches?entry=pushEnabled&value=false&debug=true'
```
### 示例返回
```
ok
```

<h2 id="2.14">查看系统当前数据指标</h2>

### 描述
查看系统当前数据指标

### 请求类型
GET

### 请求路径
```plain
/nacos/v1/ns/operator/metrics
```

### 请求参数


### 示例请求
```plain
curl -X GET '127.0.0.1:8848/nacos/v1/ns/operator/metrics'
```
### 示例返回
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

<h2 id="2.15">查看当前集群Server列表</h2>

### 描述
查看当前集群Server列表

### 请求类型
GET

### 请求路径
```plain
/nacos/v1/ns/operator/servers
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| healthy | boolean | 否 | 是否只返回健康Server节点 |

### 示例请求
```plain
curl -X GET '127.0.0.1:8848/nacos/v1/ns/operator/servers'
```

### 示例返回
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


<h2 id="2.16">查看当前集群leader</h2>

### 描述
查看当前集群leader

### 请求类型
GET

### 请求路径
```plain
/nacos/v1/ns/raft/leader
```

### 请求参数


### 示例请求
```plain
curl -X GET '127.0.0.1:8848/nacos/v1/ns/raft/leader'
```
### 示例返回
```
{
    leader: "{"heartbeatDueMs":2500,"ip":"1.1.1.1:8848","leaderDueMs":12853,"state":"LEADER","term":54202,"voteFor":"1.1.1.1:8848"}"
}
```

<h2 id="2.17">更新实例的健康状态</h2>

### 描述
更新实例的健康状态,仅在集群的健康检查关闭时才生效,当集群配置了健康检查时,该接口会返回错误

### 请求类型
PUT

### 请求路径
```plain
/nacos/v1/ns/health/instance
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| namespaceId | 字符串 | 否 | 命名空间ID |
| serviceName | 字符串 | 是 | 服务名 |
| groupName | 字符串 | 否 | 分组名 |
| clusterName | 字符串 | 否 | 集群名 |
| ip | 字符串 | 是 | 服务实例IP |
| port | int | 是 | 服务实例port |
| healthy | boolean | 是 | 是否健康 |



### 示例请求
```plain
curl -X PUT 'http://127.0.0.1:8848/nacos/v1/ns/health/instance?port=8848&healthy=true&ip=11.11.11.11&serviceName=nacos.test.3&namespaceId=n1''
```
### 示例返回
ok
