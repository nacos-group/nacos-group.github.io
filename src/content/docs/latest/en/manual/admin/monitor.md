---
title: Monitoring Manual
keywords: [Nacos, Monitoring, Prometheus, Grafana, Metrics]
description: Learn how to expose Nacos 3.x metrics, scrape them with Prometheus, use health checks, and design basic alerts.
sidebar:
    order: 9
---

# Monitoring Manual

Nacos monitoring focuses on two kinds of information:

- Nacos Server metrics, such as JVM, HTTP, gRPC, configuration management, and service discovery metrics.
- Health check endpoints, such as liveness and readiness.

:::note
This page covers the server side. Metrics recorded inside `nacos-client` (request timer, gauges, failure counters) are exported through Micrometer and are documented in [Java SDK Metrics](../user/java-sdk/metrics.md).
:::

## Expose Nacos Server metrics

Nacos exposes Prometheus metrics through Spring Boot Actuator. In the default configuration file, this capability is commented out. Enable it on every Nacos Server node:

```properties
management.endpoints.web.exposure.include=prometheus
```

If you already expose other Actuator endpoints, add `prometheus` to that list.

After restarting the node, visit:

```text
http://{nacos-server-host}:8848/nacos/actuator/prometheus
```

The `/nacos` prefix comes from the default `nacos.server.contextPath`. If you change the server context path, adjust the URL accordingly.

:::caution
Nacos is an internal microservice component and should not be exposed to the public Internet. `/actuator/**` is usually used by monitoring systems. Keep it in a trusted internal network, and restrict access by network policy, gateway, or Prometheus scrape source.
:::

## Prometheus scrape example

Prometheus can scrape every Nacos Server node directly:

```yaml
scrape_configs:
  - job_name: nacos
    metrics_path: /nacos/actuator/prometheus
    static_configs:
      - targets:
          - 10.0.0.1:8848
          - 10.0.0.2:8848
          - 10.0.0.3:8848
```

If Nacos Server uses a different port or context path, change `targets` and `metrics_path`.

Grafana can use Prometheus as the datasource. Community dashboard templates are available in [nacos-template](https://github.com/nacos-group/nacos-template).

## Health checks

Nacos 3.x provides v3 health check endpoints. They are suitable for load balancers, Kubernetes probes, or inspection systems.

| Target | Endpoint |
| --- | --- |
| Nacos Server state | `/nacos/v3/admin/core/state` |
| Nacos Server liveness | `/nacos/v3/admin/core/state/liveness` |
| Nacos Server readiness | `/nacos/v3/admin/core/state/readiness` |
| Independent console liveness | `/v3/console/health/liveness` |
| Independent console readiness | `/v3/console/health/readiness` |

If you change `nacos.server.contextPath` or `nacos.console.contextPath`, add the corresponding context path to the endpoint URL.

## Key metrics

Prometheus metric names may include suffixes based on Micrometer type. For example, timers usually export series such as `_seconds_count` and `_seconds_sum`. When troubleshooting, search the base name first, then inspect its labels.

### Basic resource and request metrics

| Metric | Description |
| --- | --- |
| `system_cpu_usage` | System CPU usage. |
| `system_load_average_1m` | System load average over 1 minute. |
| `jvm_memory_used_bytes` | JVM used memory. |
| `jvm_memory_max_bytes` | JVM max memory. |
| `jvm_gc_pause_seconds` | GC count and duration. |
| `jvm_threads_daemon` | JVM daemon thread count. |
| `http_server_requests_seconds` | HTTP request count and latency. |
| `grpc_server_requests` | gRPC request latency with labels such as `requestClass`, `success`, `errorCode`, and `module`. |
| `grpc_server_executor` | gRPC server executor status, including active count, pool size, and queued tasks. |

### Core metrics

| Metric | Description |
| --- | --- |
| `nacos_monitor{module="core",name="longConnection"}` | Long connection count by module. |
| `nacos_monitor_summary` | Summary metrics for Raft read index, leader read, apply log, and apply read. |

### Configuration management metrics

| Metric | Description |
| --- | --- |
| `nacos_monitor{module="config",name="getConfig"}` | Config query statistics. |
| `nacos_monitor{module="config",name="publish"}` | Config publish statistics. |
| `nacos_monitor{module="config",name="longPolling"}` | Config long polling count. |
| `nacos_monitor{module="config",name="configCount"}` | Config count. |
| `nacos_monitor{module="config",name="notifyTask"}` | Config notify task backlog. |
| `nacos_monitor{module="config",name="notifyClientTask"}` | Client notify task backlog. |
| `nacos_monitor{module="config",name="dumpTask"}` | Config dump task backlog. |
| `nacos_monitor{module="config",name="fuzzySearch"}` | Fuzzy search statistics. |
| `nacos_config_subscriber{version="v1"}` / `nacos_config_subscriber{version="v2"}` | Config listener count. |
| `nacos_timer{module="config",name="readConfigRt"}` | Read config latency. |
| `nacos_timer{module="config",name="writeConfigRt"}` | Write config latency. |
| `nacos_timer{module="config",name="notifyRt"}` | Notify latency. |
| `nacos_timer{module="config",name="dumpRt"}` | Dump latency. |
| `nacos_exception{module="config",name="illegalArgument"}` | Config illegal argument exception statistics. |
| `config_change_count` | TopN config change statistics. |

### Service discovery metrics

| Metric | Description |
| --- | --- |
| `nacos_monitor{module="naming",name="serviceCount"}` | Service count. |
| `nacos_monitor{module="naming",name="ipCount"}` | Instance count. |
| `nacos_monitor{module="naming",name="subscriberCount"}` | Subscriber count. |
| `nacos_monitor{module="naming",name="totalPush"}` | Total push count. |
| `nacos_monitor{module="naming",name="failedPush"}` | Failed push count. |
| `nacos_monitor{module="naming",name="emptyPush"}` | Empty push count. |
| `nacos_monitor{module="naming",name="avgPushCost"}` | Average push latency. |
| `nacos_monitor{module="naming",name="maxPushCost"}` | Maximum push latency. |
| `nacos_monitor{module="naming",name="leaderStatus"}` | Leader state of the service discovery module. |
| `nacos_monitor{module="naming",name="serviceSubscribedEventQueueSize"}` | Service subscribed event queue size. |
| `nacos_monitor{module="naming",name="serviceChangedEventQueueSize"}` | Service changed event queue size. |
| `nacos_monitor{module="naming",name="pushPendingTaskCount"}` | Pending push task count. |
| `nacos_naming_subscriber{version="v1"}` / `nacos_naming_subscriber{version="v2"}` | Service subscriber count. |
| `nacos_naming_publisher{version="v1"}` / `nacos_naming_publisher{version="v2"}` | Service provider count. |
| `service_change_count` | TopN service change statistics. |

### Experimental distributed lock metrics

Distributed Lock is an [experimental feature](../../experimental/distributed-lock.md). If you use it, watch these metrics:

| Metric | Description |
| --- | --- |
| `nacos_monitor{module="lock",name="grpcLockTotal"}` | Total gRPC lock requests. |
| `nacos_monitor{module="lock",name="grpcLockSuccess"}` | Successful gRPC lock requests. |
| `nacos_monitor{module="lock",name="grpcUnLockTotal"}` | Total gRPC unlock requests. |
| `nacos_monitor{module="lock",name="grpcUnLockSuccess"}` | Successful gRPC unlock requests. |
| `nacos_monitor{module="lock",name="aliveLockCount"}` | Current alive lock count. |
| `nacos_timer{module="lock",name="lockHandlerRt"}` | Lock request handling latency. |

## Alert suggestions

| Scenario | Watch |
| --- | --- |
| Node unavailable | Readiness failure, HTTP/gRPC request error rate, JVM resources, process liveness. |
| gRPC backlog | `grpc_server_executor` active count, queue, and completed task changes. |
| Config push delay | `notifyTask`, `notifyClientTask`, `notifyRt`, and `dumpTask`. |
| Config publish exception | `publish`, `writeConfigRt`, and `nacos_exception{module="config"}`. |
| Service push exception | `failedPush`, `pushPendingTaskCount`, `avgPushCost`, and `maxPushCost`. |
| Abnormal connection change | `longConnection`, `nacos_config_subscriber`, and `nacos_naming_subscriber`. |
| Lock usage exception | Lock success rate, unlock success rate, and `aliveLockCount`. |

## Troubleshooting

**`/actuator/prometheus` returns 404 or no data**

Check whether `management.endpoints.web.exposure.include` contains `prometheus`, confirm that the node has been restarted, and verify `nacos.server.contextPath`.

**`nacos.prometheus.metrics.enabled=true` is configured, but Nacos Server metrics are still unavailable**

This is expected. That configuration belongs to the [Prometheus service discovery ecology document](../../ecology/use-nacos-prometheus-sd.md). It does not enable Nacos Server metrics.

**Prometheus fails to scrape some nodes**

Check node ports, context path, network policy, and Prometheus scrape configuration. Every cluster node must expose metrics and be scraped separately.

**A module metric is missing**

Confirm whether the corresponding module is enabled. For example, if only the configuration module is started, service discovery metrics will not be complete. Experimental distributed lock metrics are meaningful only when the related capability is used.
