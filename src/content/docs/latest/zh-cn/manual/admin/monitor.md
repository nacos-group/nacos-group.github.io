---
title: 监控手册
keywords: [Nacos, 监控, Prometheus, Grafana, 指标]
description: 了解 Nacos 3.x 的指标暴露、Prometheus 抓取、健康检查和常用告警建议。
sidebar:
    order: 9
---

# 监控手册

Nacos 监控主要关注两类信息：

- Nacos Server 自身指标，例如 JVM、HTTP、gRPC、配置管理和服务发现指标。
- 健康检查入口，例如 liveness 和 readiness。

## 暴露 Nacos Server 指标

Nacos 通过 Spring Boot Actuator 暴露 Prometheus 指标。默认配置文件中该能力是注释状态。需要在每个 Nacos Server 节点上开启：

```properties
management.endpoints.web.exposure.include=prometheus
```

如果你已经暴露了其他 Actuator endpoint，请把 `prometheus` 加入列表。

重启节点后，访问：

```text
http://{nacos-server-host}:8848/nacos/actuator/prometheus
```

其中 `/nacos` 来自默认的 `nacos.server.contextPath`。如果你修改了服务端上下文路径，请同步调整访问地址。

:::caution
Nacos 是内部微服务组件，不应暴露在公网。`/actuator/**` 通常用于监控系统抓取，请放在可信内部网络中，并通过网络策略、网关或 Prometheus 抓取端限制访问来源。
:::

## Prometheus 抓取示例

Prometheus 可以直接抓取每个 Nacos Server 节点：

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

如果 Nacos Server 使用了不同端口或上下文路径，请修改 `targets` 和 `metrics_path`。

Grafana 可以使用 Prometheus 作为数据源。社区维护的 Dashboard 模板可参考 [nacos-template](https://github.com/nacos-group/nacos-template)。

## 健康检查

Nacos 3.x 提供 v3 健康检查接口。它们适合给负载均衡、Kubernetes 探针或巡检系统使用。

| 对象 | 接口 |
| --- | --- |
| Nacos Server 状态 | `/nacos/v3/admin/core/state` |
| Nacos Server liveness | `/nacos/v3/admin/core/state/liveness` |
| Nacos Server readiness | `/nacos/v3/admin/core/state/readiness` |
| 独立控制台 liveness | `/v3/console/health/liveness` |
| 独立控制台 readiness | `/v3/console/health/readiness` |

如果修改了 `nacos.server.contextPath` 或 `nacos.console.contextPath`，请把对应上下文路径加入接口地址。

## 关键指标

Prometheus 中的指标名称会根据 Micrometer 类型带上后缀。例如 timer 通常会导出 `_seconds_count`、`_seconds_sum` 等序列。排查时可以先搜索基础名称，再查看具体标签。

### 基础资源和请求

| 指标 | 说明 |
| --- | --- |
| `system_cpu_usage` | 系统 CPU 使用率。 |
| `system_load_average_1m` | 1 分钟系统负载。 |
| `jvm_memory_used_bytes` | JVM 已使用内存。 |
| `jvm_memory_max_bytes` | JVM 最大内存。 |
| `jvm_gc_pause_seconds` | GC 次数和耗时。 |
| `jvm_threads_daemon` | JVM daemon 线程数。 |
| `http_server_requests_seconds` | HTTP 请求次数和耗时。 |
| `grpc_server_requests` | gRPC 请求耗时，包含 `requestClass`、`success`、`errorCode`、`module` 等标签。 |
| `grpc_server_executor` | gRPC 服务端线程池状态，包含 active、pool size、queue task 等标签。 |

### Core 指标

| 指标 | 说明 |
| --- | --- |
| `nacos_monitor{module="core",name="longConnection"}` | 按模块统计的长连接数量。 |
| `nacos_monitor_summary` | Raft read index、leader read、apply log、apply read 等摘要指标。 |

### 配置管理指标

| 指标 | 说明 |
| --- | --- |
| `nacos_monitor{module="config",name="getConfig"}` | 配置查询统计。 |
| `nacos_monitor{module="config",name="publish"}` | 配置发布统计。 |
| `nacos_monitor{module="config",name="longPolling"}` | 配置长轮询数量。 |
| `nacos_monitor{module="config",name="configCount"}` | 配置数量。 |
| `nacos_monitor{module="config",name="notifyTask"}` | 配置通知任务堆积。 |
| `nacos_monitor{module="config",name="notifyClientTask"}` | 客户端通知任务堆积。 |
| `nacos_monitor{module="config",name="dumpTask"}` | 配置 dump 任务堆积。 |
| `nacos_monitor{module="config",name="fuzzySearch"}` | 模糊查询统计。 |
| `nacos_config_subscriber{version="v1"}` / `nacos_config_subscriber{version="v2"}` | 配置监听者数量。 |
| `nacos_timer{module="config",name="readConfigRt"}` | 读配置耗时。 |
| `nacos_timer{module="config",name="writeConfigRt"}` | 写配置耗时。 |
| `nacos_timer{module="config",name="notifyRt"}` | 通知耗时。 |
| `nacos_timer{module="config",name="dumpRt"}` | dump 耗时。 |
| `nacos_exception{module="config",name="illegalArgument"}` | 配置参数异常统计。 |
| `config_change_count` | 配置变更 TopN 统计。 |

### 服务发现指标

| 指标 | 说明 |
| --- | --- |
| `nacos_monitor{module="naming",name="serviceCount"}` | 服务数量。 |
| `nacos_monitor{module="naming",name="ipCount"}` | 实例数量。 |
| `nacos_monitor{module="naming",name="subscriberCount"}` | 订阅者数量。 |
| `nacos_monitor{module="naming",name="totalPush"}` | 推送总数。 |
| `nacos_monitor{module="naming",name="failedPush"}` | 推送失败数。 |
| `nacos_monitor{module="naming",name="emptyPush"}` | 空推送数。 |
| `nacos_monitor{module="naming",name="avgPushCost"}` | 平均推送耗时。 |
| `nacos_monitor{module="naming",name="maxPushCost"}` | 最大推送耗时。 |
| `nacos_monitor{module="naming",name="leaderStatus"}` | 服务发现模块 leader 状态。 |
| `nacos_monitor{module="naming",name="serviceSubscribedEventQueueSize"}` | 服务订阅事件队列长度。 |
| `nacos_monitor{module="naming",name="serviceChangedEventQueueSize"}` | 服务变更事件队列长度。 |
| `nacos_monitor{module="naming",name="pushPendingTaskCount"}` | 待推送任务数量。 |
| `nacos_naming_subscriber{version="v1"}` / `nacos_naming_subscriber{version="v2"}` | 服务订阅者数量。 |
| `nacos_naming_publisher{version="v1"}` / `nacos_naming_publisher{version="v2"}` | 服务提供者数量。 |
| `service_change_count` | 服务变更 TopN 统计。 |

### 实验性分布式锁指标

分布式锁属于[实验性功能](../../experimental/distributed-lock.md)。如果使用该能力，可以关注：

| 指标 | 说明 |
| --- | --- |
| `nacos_monitor{module="lock",name="grpcLockTotal"}` | gRPC 加锁请求总数。 |
| `nacos_monitor{module="lock",name="grpcLockSuccess"}` | gRPC 加锁成功数。 |
| `nacos_monitor{module="lock",name="grpcUnLockTotal"}` | gRPC 解锁请求总数。 |
| `nacos_monitor{module="lock",name="grpcUnLockSuccess"}` | gRPC 解锁成功数。 |
| `nacos_monitor{module="lock",name="aliveLockCount"}` | 当前存活锁数量。 |
| `nacos_timer{module="lock",name="lockHandlerRt"}` | 锁请求处理耗时。 |

## 告警建议

| 场景 | 建议关注 |
| --- | --- |
| 节点不可用 | readiness 失败、HTTP/gRPC 请求错误率、JVM 资源、进程存活。 |
| gRPC 堆积 | `grpc_server_executor` 的 active、queue、completed task 变化。 |
| 配置推送延迟 | `notifyTask`、`notifyClientTask`、`notifyRt`、`dumpTask`。 |
| 配置发布异常 | `publish`、`writeConfigRt`、`nacos_exception{module="config"}`。 |
| 服务推送异常 | `failedPush`、`pushPendingTaskCount`、`avgPushCost`、`maxPushCost`。 |
| 连接异常变化 | `longConnection`、`nacos_config_subscriber`、`nacos_naming_subscriber`。 |
| 锁使用异常 | 加锁成功率、解锁成功率、`aliveLockCount`。 |

## 常见排查

**访问 `/actuator/prometheus` 返回 404 或没有数据**

检查 `management.endpoints.web.exposure.include` 是否包含 `prometheus`，确认节点已重启，并核对 `nacos.server.contextPath`。

**配置了 `nacos.prometheus.metrics.enabled=true`，但仍没有 Nacos Server 指标**

这是预期行为。该配置属于 [Prometheus 服务发现生态文档](../../ecology/use-nacos-prometheus-sd.md)，不用于开启 Nacos Server 自身指标。

**Prometheus 抓取部分节点失败**

检查节点端口、上下文路径、网络策略和 Prometheus 抓取配置。集群每个节点都需要单独暴露并被抓取。

**指标中没有某个模块**

确认对应模块是否启用。例如仅启动配置模块时，服务发现相关指标不会完整出现。实验性分布式锁指标也只有使用相关能力后才有意义。
