---
title: Use Nacos For Prometheus Service Discovery
keywords: [Nacos, Prometheus, Service Discovery, HTTP SD]
description: Learn how Prometheus can use Nacos service discovery to dynamically obtain scrape targets for business applications.
sidebar:
    order: 11
---

# Use Nacos For Prometheus Service Discovery

Nacos can convert service instances in service discovery into HTTP Service Discovery data that Prometheus can read. Prometheus can then obtain the latest targets from Nacos instead of maintaining every business application instance statically.

:::note
This page explains how Prometheus discovers business application instances registered in Nacos. It is not the way to enable Nacos Server monitoring metrics. To collect Nacos Server metrics, read the [Monitoring Manual](../manual/admin/monitor.md).
:::

## Before you start

- Business applications have registered instances in Nacos service discovery.
- Prometheus can access the HTTP port of Nacos Server.
- Business applications expose metrics ports and paths that Prometheus can scrape.
- Nacos Server and Prometheus run in a trusted internal network.

## Enable the capability

Prometheus service discovery support in Nacos is disabled by default. Enable it in `application.properties`:

```properties
nacos.prometheus.metrics.enabled=true
```

Restart Nacos Server after the change.

This configuration only affects Prometheus service discovery endpoints. It does not enable `/actuator/prometheus`. To collect Nacos Server metrics, configure:

```properties
management.endpoints.web.exposure.include=prometheus
```

## Endpoints

`${nacos.server.contextPath}` is the Nacos Server context path. The default value is `/nacos`.

| Endpoint | Description |
| --- | --- |
| `GET ${nacos.server.contextPath}/prometheus` | Return service instances from all namespaces in the current cluster. |
| `GET ${nacos.server.contextPath}/prometheus/namespaceId/{namespaceId}` | Return service instances from a namespace. |
| `GET ${nacos.server.contextPath}/prometheus/namespaceId/{namespaceId}/service/{service}` | Return service instances from a namespace and service. |

The response follows the Prometheus HTTP Service Discovery format:

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

`targets` are built from the Nacos instance `ip` and `port`. `labels` include the instance cluster name `__meta_clusterName` and instance metadata. Metadata keys containing `.` or `-` are converted to `_` to match Prometheus label naming conventions.

## Prometheus configuration example

The following example lets Prometheus obtain business application instances from a namespace in Nacos:

```yaml
scrape_configs:
  - job_name: nacos-services
    http_sd_configs:
      - url: http://127.0.0.1:8848/nacos/prometheus/namespaceId/public
        refresh_interval: 30s
```

If business applications use a metrics path other than the Prometheus default path, configure `metrics_path` or relabeling rules in Prometheus.

## Authentication and network boundary

Do not expose Prometheus service discovery endpoints to the public Internet. Restrict access by internal network, gateway, network policy, or firewall.

After Nacos authentication is enabled, protected Prometheus service discovery endpoints need Basic Auth credentials:

```shell
curl "http://127.0.0.1:8848/nacos/prometheus" \
  -H "Authorization: Basic ${base64_encode_username_password}"
```

For authentication configuration, read the [Authorization Manual](../manual/admin/auth.mdx).

## FAQ

**Why are Nacos Server metrics still unavailable after `nacos.prometheus.metrics.enabled=true` is enabled?**

This is expected. That configuration only enables Prometheus service discovery endpoints. For Nacos Server metrics, read the [Monitoring Manual](../manual/admin/monitor.md).

**Prometheus gets targets, but scraping fails. What should I check?**

Check the business application instance `ip`, `port`, metrics path, and network connectivity. Nacos only provides instance addresses from service discovery. It does not expose metrics for business applications.

**The response is empty. What should I check?**

Check the namespace, service name, instance registration state, and whether the Nacos Server accessed by Prometheus belongs to the expected cluster.
