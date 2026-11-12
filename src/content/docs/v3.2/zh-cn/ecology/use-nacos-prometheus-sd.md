---
title: 使用 Nacos 提供 Prometheus 服务发现
keywords: [Nacos, Prometheus, Service Discovery, HTTP SD]
description: 了解如何让 Prometheus 通过 Nacos 服务发现动态获取业务应用抓取目标。
sidebar:
    order: 11
---

# 使用 Nacos 提供 Prometheus 服务发现

Nacos 可以把服务发现中的实例列表转换为 Prometheus 可读取的 HTTP Service Discovery 数据。这样 Prometheus 不需要静态维护每个业务应用实例地址，可以定期从 Nacos 获取最新 target。

:::note
本文说明的是“Prometheus 如何发现注册在 Nacos 上的业务应用实例”。它不是 Nacos Server 自身监控指标的开启方式。采集 Nacos Server 指标请阅读[监控手册](../manual/admin/monitor.md)。
:::

## 使用前确认

- 业务应用已经注册到 Nacos 服务发现。
- Prometheus 能访问 Nacos Server 的 HTTP 端口。
- 业务应用自身已经暴露 Prometheus 可抓取的 metrics 端口和路径。
- Nacos Server 与 Prometheus 都运行在可信内部网络中。

## 开启能力

Nacos 的 Prometheus 服务发现能力默认关闭。需要在 `application.properties` 中开启：

```properties
nacos.prometheus.metrics.enabled=true
```

修改后重启 Nacos Server。

这个配置只影响 Prometheus 服务发现接口，不会开启 `/actuator/prometheus`。如果你要采集 Nacos Server 自身指标，需要配置：

```properties
management.endpoints.web.exposure.include=prometheus
```

## 接口列表

`${nacos.server.contextPath}` 为 Nacos Server 的访问路径，默认是 `/nacos`。

| 接口 | 说明 |
| --- | --- |
| `GET ${nacos.server.contextPath}/prometheus` | 返回当前集群中全部命名空间下的服务实例。 |
| `GET ${nacos.server.contextPath}/prometheus/namespaceId/{namespaceId}` | 返回指定命名空间下的服务实例。 |
| `GET ${nacos.server.contextPath}/prometheus/namespaceId/{namespaceId}/service/{service}` | 返回指定命名空间和服务下的服务实例。 |

返回内容是 Prometheus HTTP Service Discovery 格式：

```json
[
  {
    "targets": [
      "127.0.0.1:8080"
    ],
    "labels": {
      "__meta_clusterName": "DEFAULT",
      "env": "prod",
      "version": "1.0.0"
    }
  }
]
```

`targets` 来自 Nacos 实例的 `ip` 和 `port`。`labels` 中包含实例集群名 `__meta_clusterName`，也会包含实例元数据。元数据 key 中的 `.` 和 `-` 会被转换为 `_`，以便符合 Prometheus label 命名习惯。

## Prometheus 配置示例

下面示例让 Prometheus 从 Nacos 获取指定命名空间中的业务应用实例：

```yaml
scrape_configs:
  - job_name: nacos-services
    http_sd_configs:
      - url: http://127.0.0.1:8848/nacos/prometheus/namespaceId/public
        refresh_interval: 30s
```

如果业务应用的 metrics 路径不是 Prometheus 默认路径，需要在 Prometheus 中继续配置 `metrics_path` 或 relabel 规则。

## 鉴权和网络边界

默认情况下，不应把 Prometheus 服务发现接口暴露给公网。请通过内网、网关、网络策略或防火墙限制访问来源。

开启 Nacos 鉴权后，受保护的 Prometheus 服务发现接口需要使用 Basic Auth 传递身份信息：

```shell
curl "http://127.0.0.1:8848/nacos/prometheus" \
  -H "Authorization: Basic ${base64_encode_username_password}"
```

鉴权配置请阅读[鉴权手册](../manual/admin/auth.mdx)。

## 常见问题

**开启 `nacos.prometheus.metrics.enabled=true` 后，为什么没有 Nacos Server 指标？**

这是预期行为。该配置只开启 Prometheus 服务发现接口。Nacos Server 自身指标请阅读[监控手册](../manual/admin/monitor.md)。

**Prometheus 能拿到 target，但抓取失败怎么办？**

检查业务应用实例的 `ip`、`port`、metrics 路径和网络连通性。Nacos 只提供服务发现中的实例地址，不会替业务应用暴露 metrics。

**返回结果为空怎么办？**

检查命名空间、服务名、实例是否已注册，以及 Prometheus 访问的 Nacos Server 是否连接到同一个集群。
