---
title: 使用Nacos作为Prometheus SD协议提供方
keywords: [Nacos, Prometheus, Service Discovery]
description: 本文简单介绍Nacos如何作为Prometheus SD协议提供方
sidebar:
    order: 11
---

# 使用Nacos作为Prometheus SD协议提供方

Nacos 支持提供特定 [Prometheus SD](https://prometheus.io/docs/prometheus/latest/http_sd/) 协议的HTTP API，让Prometheus能够自动发现注册在Nacos上的微服务端点，并通过此端点自动获取对应的metrics数据。

关于如何在Prometheus上配置SD协议，请查询[Prometheus SD](https://prometheus.io/docs/prometheus/latest/http_sd/)相关文档，本文档不再赘述，本文档仅介绍Nacos所提供的HTTP SD API及注意事项。

## 开启Nacos 的 Prometheus SD 支持

Nacos的Prometheus SD 支持是**默认关闭**的， 当需要使用时，修改配置文件`application.properties`，将`nacos.prometheus.metrics.enabled`设置为`true`后重新启动Nacos Server即可。

> 注意，默认情况下，Nacos的Prometheus SD HTTP API 是**不鉴权**的，即所有请求都允许访问，请参考[Nacos 的 Prometheus SD HTTP API 的鉴权](#nacos-的-prometheus-sd-http-api-的鉴权)开启鉴权或自行限制可访此地址的网络范围。

## Nacos 的 Prometheus SD HTTP API 

Nacos的Prometheus SD HTTP API 提供了以下三个接口：

- `GET ${nacos.server.contextPath}/prometheus`
  - 获取当前集群中所有命名空间下的所有服务实例信息
- `GET ${nacos.server.contextPath}/prometheus/namespaceId/${namespaceId}`
  - 获取指定命名空间下的所有服务实例信息
- `GET ${nacos.server.contextPath}/prometheus/namespaceId/{namespaceId}/service/{service}`
  - 获取指定命名空间下的指定服务实例信息 

其中，`${nacos.server.contextPath}`为Nacos Server的访问路径，默认为`/nacos`。

接口的返回内容遵循[Prometheus SD](https://prometheus.io/docs/prometheus/latest/http_sd/)协议，大致内容如下:

```json
[
  {
    "targets": [
      "127.0.0.1:9999"
    ],
    "labels": {
      "__meta_clusterName": "DEFAULT",
      "__custom_metadata": "false"
    }
  }
]
```

其中`__meta_clusterName` 为实例的集群名称，`__custom_metadata` 为是否自定义元数据，即注册服务实例时填写的实例元数据。

## Nacos 的 Prometheus SD HTTP API 的鉴权

Nacos 的 Prometheus SD HTTP API被定义为`Client`类型的业务API，此类型API默认情况下**不开启鉴权**，需参考[鉴权文档](../manual/admin/auth.mdx) 开启鉴权。

开启鉴权后，需通过`Basic Auth`方案进行身份信息的传递, 如：

```shell
curl "localhost:8848/nacos/prometheus" -H "Authorization: Basic [base64_encode(username:password)]"
```