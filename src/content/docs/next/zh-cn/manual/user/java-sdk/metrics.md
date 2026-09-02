---
title: Java SDK 客户端指标
keywords: [Java, SDK, 指标, Micrometer, Prometheus]
description: 通过 Micrometer 开启 nacos-client 客户端指标，选择合适的 Prometheus registry，并迁移 3.3 版本之前的指标名与单位。
sidebar:
  order: 5
---

# Java SDK 客户端指标

从 Nacos 3.3 开始，`nacos-client` 不再强依赖 `io.prometheus:simpleclient`。所有客户端指标都通过 Micrometer 的 `Metrics.globalRegistry` 记录，SDK 保持轻量，也不会强制绑定任何指标后端。

是否上报由 registry 决定，而不是由客户端决定：

- 未注册任何 `MeterRegistry` 时，记录调用是安全的 no-op。
- 应用一旦注册具体的 registry，所有 nacos 客户端指标会自动流入其中。

:::note
Nacos Server 自身有独立的指标暴露入口，请参考[监控手册](../../admin/monitor.md)。
:::

## 1. 开启客户端指标

### 1.1. `enableClientMetrics` 开关

客户端属性 `enableClientMetrics`（`PropertyKeyConst.ENABLE_CLIENT_METRICS`）控制 `NamingService` 与 `ConfigService` 的记录点，包括 naming gRPC 请求 timer、naming 失败请求 counter、config 监听数 gauge 以及 naming 服务信息 gauge，默认值为 `true`。若应用有其他自有的指标采集方案，可以显式关闭以跳过这些记录调用：

```properties
enableClientMetrics=false
```

:::note
AI Agent watch 相关的 gauge 与事件 counter（[第 3 节](#3-指标一览)中 `module="ai"` 的序列）目前**不受**该开关控制：`AgentWatchClientMetrics` 直接在 `MetricsMonitor` 上记录，不读取该属性。
:::

多数场景保持默认即可：未注册 registry 时，记录调用本身开销极低。

### 1.2. Spring Boot 应用

Spring Boot 会为所有支持的后端自动装配 `MeterRegistry` bean，并在启动时把它加入 `Metrics.globalRegistry`。引入 actuator 与 Prometheus registry starter：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

再暴露 scrape 端点：

```properties
management.endpoints.web.exposure.include=health,info,prometheus
```

Nacos 客户端指标会与应用自身指标一起出现在 `/actuator/prometheus`，无需 Nacos 侧的额外配置。

:::caution
`/actuator/prometheus` 端点本身来自 `spring-boot-starter-actuator`。如果应用尚未依赖 Actuator，上面的组合即最小依赖；缺少它就没有可暴露的 scrape 端点。另外注意，设置 `management.metrics.use-global-registry=false` 会阻止 Spring 管理的 registry 被加入 `Metrics.globalRegistry`，Nacos 客户端指标因此**不会**自动流入其中——此时请参考[1.3 节](#13-非-spring-应用)自行把选定的 registry 注册到 `Metrics.globalRegistry`。
:::

### 1.3. 非 Spring 应用

在创建任何 `NamingService` 或 `ConfigService` 之前，将具体的 `MeterRegistry` 注册到 `Metrics.globalRegistry`。注册时机不受限制：先创建的 meter 会在 registry 加入 composite 后立即被采集。

```java
import io.micrometer.core.instrument.Metrics;
import io.micrometer.prometheusmetrics.PrometheusConfig;
import io.micrometer.prometheusmetrics.PrometheusMeterRegistry;

PrometheusMeterRegistry registry = new PrometheusMeterRegistry(PrometheusConfig.DEFAULT);
Metrics.globalRegistry.add(registry);

// 通过任意 HTTP 端点暴露 registry.scrape() 的结果。
```

如果应用已经为其他库维护了 `MeterRegistry`，直接复用即可：把同一个 registry 实例加入 `Metrics.globalRegistry`，Nacos 客户端指标会与应用其他指标一起被采集。

### 1.4. 选择合适的 Prometheus registry 制品

Micrometer 提供两个 Prometheus registry，`nacos-client` 两者都支持：

| 制品 | 底层 Prometheus 客户端 | 何时选择 |
| --- | --- | --- |
| `io.micrometer:micrometer-registry-prometheus` | `io.prometheus:prometheus-metrics-core`（新客户端） | 新应用，或已经使用新 Prometheus 客户端的应用。 |
| `io.micrometer:micrometer-registry-prometheus-simpleclient` | `io.prometheus:simpleclient`（旧客户端） | 因其他库兼容性要求，必须保留旧 Prometheus 客户端的应用。 |

二者只选其一。同时向同一个 `CollectorRegistry` 注册两个 Prometheus registry 会导致序列重复。

## 2. 单独引入 `io.prometheus:simpleclient` 不再有效

在 Nacos 3.3 之前，只要把 `io.prometheus:simpleclient` 加进 classpath，客户端就会自行创建并注册 collector，`nacos_monitor`、`nacos_client_request` 等指标就能被抓取到。

从 Nacos 3.3 开始，**这一假设不再成立**：

- `nacos-client` 不再创建任何 Prometheus collector；
- `io.prometheus:simpleclient` 自身不认识 Micrometer，不会往 `Metrics.globalRegistry` 注册任何东西；
- 升级后如果只保留了裸的 `simpleclient` 依赖，客户端指标会**静默消失**。

若要继续导出 Nacos 客户端指标，请把裸的 `simpleclient` 依赖替换为 [1.4 节](#14-选择合适的-prometheus-registry-制品) 中的 Micrometer Prometheus registry，并确保它已经注册到 `Metrics.globalRegistry`。

## 3. 指标一览

下列名称与标签即为 Prometheus scrape 端点上出现的形式。Micrometer 会为 Timer 追加基础单位后缀（`_seconds`），但**不会**为名字本身已经以 `_total` 结尾的 Counter 再追加一次 `_total`。

### 3.1. Gauge

| 序列 | 标签 | 含义 |
| --- | --- | --- |
| `nacos_monitor` | `module="naming"`, `name="serviceInfoMapSize"` | 客户端缓存中当前订阅的服务数。 |
| `nacos_monitor` | `module="config"`, `name="listenConfigCount"` | `ConfigService` 当前监听的配置数。 |
| `nacos_monitor` | `module="ai"`, `name="agentWatchIntentCount"` | 当前跟踪的 AI Agent watch intent 数。 |
| `nacos_monitor` | `module="ai"`, `name="agentWatchPendingCount"` | 当前待派发的 AI Agent watch 回调数。 |
| `nacos_monitor` | `module="ai"`, `name="agentWatchDirtyCount"` | 当前被标记为 dirty 的 AI Agent watch 条目数。 |

`nacos_monitor` 保持历史名称与标签结构，Nacos 2.x 上构建的 dashboard 可继续读取同名序列。

### 3.2. 请求 Timer

`nacos_client_request` 在 Prometheus 上以 `nacos_client_request_seconds_{bucket,count,sum,max}` 形式导出。

:::note
默认装配下，只有 **naming** HTTP 客户端记录该 timer（`module="naming"`，位于 `NamingHttpClientProxy`）。config 侧的包装类 `MetricsHttpAgent`（记录 `module="config"`）目前只在 SDK 自身的测试中被实例化；通过 `NacosFactory` 创建的常规 `ConfigService` 并不会用它包装 `HttpAgent`。要得到 `module="config"` 序列，请自行用 `new MetricsHttpAgent(agent)` 包装，或关注未来 SDK 默认装配它的变更。
:::

| 标签 | 取值 |
| --- | --- |
| `module` | `naming`（默认装配）、`config`（仅在手动装配 `MetricsHttpAgent` 时出现，见上方说明） |
| `method` | `GET`、`POST`、`DELETE` |
| `url` | `naming`：完整构造出的请求 URL（服务器地址 + 路径，基数高，聚合时需谨慎）；`config`：请求路径，例如 `/cs/configs` |
| `code` | HTTP 状态码字符串。naming 路径在拿到响应前抛出异常时**不会**产生 timer 序列（请求直接失败、无序列）；手动装配的 config 路径中 `MetricsHttpAgent` 会在 `finally` 块里记录 `code="NA"` |

从 Nacos 3.3 开始，`method` 标签反映真实 HTTP 方法。此前 `httpPost` 与 `httpDelete` 都被记录为 `method="GET"`，按 method 分组的告警与 dashboard 在升级后会看到流量重新分布。

Bucket 边界沿用 Prometheus Java 客户端默认值，通过 Micrometer service level objectives 暴露，`histogram_quantile()` 可继续使用：

```text
le="0.005" le="0.01" le="0.025" le="0.05" le="0.075" le="0.1"
le="0.25" le="0.5" le="0.75" le="1.0" le="2.5" le="5.0" le="7.5" le="10.0" le="+Inf"
```

### 3.3. Naming 请求失败 Counter

`nacos_client_naming_request_failed_total` 是 Micrometer Counter。因为基础名已经以 `_total` 结尾，导出序列保持同名，不会再叠加后缀。

| 标签 | 取值 |
| --- | --- |
| `module` | `naming` |
| `req_class` | 失败 gRPC 请求的 simple class name，例如 `InstanceRequest` |
| `res_status` | 响应 result code；未拿到响应时为 `NONE` |
| `res_code` | 响应 error code；未拿到响应时为 `NONE` |
| `err_class` | 抛出异常的 simple class name；未抛异常时为 `NONE` |

### 3.4. AI watch 事件 Counter

`nacos_client_ai_watch_events_total` 统计 AI Agent watch 事件。两个标签都是封闭枚举，基数受控。

| 标签 | 取值 |
| --- | --- |
| `event` | `discover_refresh`、`fingerprint_mismatch`、`retry`、`capacity_rejection`、`listener_callback` |
| `result` | `success`、`unchanged`、`mismatch`、`scheduled`、`rejected`、`failed` |

## 4. 从 Nacos 3.2 及更早版本迁移

线上格式只有两处变化。Gauge 与两个 Counter 的名称和标签完全保持，基于它们的 dashboard 无需修改。

### 4.1. `nacos_client_request` 系列被重命名

| 迁移前 | 迁移后 |
| --- | --- |
| `nacos_client_request_bucket` | `nacos_client_request_seconds_bucket` |
| `nacos_client_request_count` | `nacos_client_request_seconds_count` |
| `nacos_client_request_sum` | `nacos_client_request_seconds_sum` |
| — | `nacos_client_request_seconds_max`（新增） |

重命名来自 Micrometer：它会为 Timer 序列追加基础单位。所有引用旧名的 PromQL 表达式、告警规则、dashboard 面板都需要同步更新。

### 4.2. `_sum` 单位从毫秒变为秒

Nacos 3.3 之前，客户端将 `System.currentTimeMillis() - start` ——一个毫秒数——直接喂给一个 bucket 边界以秒定义的 Prometheus histogram。观测值与边界做的是数值比较，因此：

- 大于 `10` 的观测（慢于 10 ms 的请求，长尾部分）只会落到 `le="+Inf"`；
- 不大于 `10` 的观测（10 ms 及更快的请求，常见情形）会落进有限 bucket——但这些 bucket 的名义量纲是秒。一个 3 ms 的请求会被计入 `le="5.0"`，一个名义上代表 5 秒的 bucket。

无论哪种情况，分布都是无意义的，而 `_sum` 值以毫秒计、序列名却暗示秒。

从 Nacos 3.3 开始，耗时通过 Micrometer Timer 记录：

- `nacos_client_request_seconds_sum` 单位为**秒**；
- Bucket 会真正被填充，`histogram_quantile()` 首次给出可用的分位数。

### 4.3. 保留旧 dashboard 的 recording rule

如果暂时无法重写全部 dashboard，可通过 recording rule 保留旧名。将规则部署在抓取客户端指标的 Prometheus 实例上：

```yaml
groups:
  - name: nacos_client_request_migration
    interval: 30s
    rules:
      - record: nacos_client_request_count
        expr: nacos_client_request_seconds_count
      - record: nacos_client_request_sum
        expr: nacos_client_request_seconds_sum * 1000
      - record: nacos_client_request_bucket
        expr: nacos_client_request_seconds_bucket
```

`* 1000` 用来把新的秒制 `_sum` 换算回旧 dashboard 期望的毫秒制。Bucket 边界未变，`nacos_client_request_bucket` 可直接沿用。

:::caution
Recording rule 只能保留名字和单位，无法还原 3.3 之前的 bucket 数据：观测值携带毫秒量级的数值，却被与秒量级的边界比较——10 ms 及更快的请求落进了以秒解读的有限 bucket，更慢的请求堆积在 `+Inf`。基于旧数据算出的分位数无意义。升级后的分位数才是首次真正可用的数据，与升级前会有明显差异。
:::

### 4.4. PromQL 迁移示例

| 目的 | 迁移前 | 迁移后 |
| --- | --- | --- |
| 按 module 统计 QPS | `sum(rate(nacos_client_request_count[1m])) by (module)` | `sum(rate(nacos_client_request_seconds_count[1m])) by (module)` |
| 平均耗时（毫秒） | `sum(rate(nacos_client_request_sum[5m])) / sum(rate(nacos_client_request_count[5m]))` | `1000 * sum(rate(nacos_client_request_seconds_sum[5m])) / sum(rate(nacos_client_request_seconds_count[5m]))` |
| p99 耗时 | `histogram_quantile(0.99, sum(rate(nacos_client_request_bucket[5m])) by (le))` | `histogram_quantile(0.99, sum(rate(nacos_client_request_seconds_bucket[5m])) by (le))` |
| 按 method 统计错误率 | `sum(rate(nacos_client_request_count{code!="200",code!="NA"}[5m])) by (method)` | `sum(rate(nacos_client_request_seconds_count{code!="200",code!="NA"}[5m])) by (method)` |

p99 结果单位为秒。若 dashboard 显示单位是毫秒，请在面板中乘以 `1000`。

## 5. 指标失败绝不影响业务请求

`MetricsMonitor` 中所有记录路径都会吞掉 `Throwable`，因此损坏的 registry 不会：

- 覆盖成功的业务结果（`MetricsHttpAgent` 的记录调用在 `finally` 块中执行）；
- 掩盖 HTTP 或 gRPC 调用抛出的原始异常；
- 取消上报指标的定时任务。

首次失败会通过 `com.alibaba.nacos.client.monitor.MetricsMonitor` 以 `WARN` 级别打印一次日志，后续失败会被抑制，避免刷爆客户端日志。若某次发布后指标不再上报，检查一次该日志并定位底层 registry 问题即可。

## 6. 排查建议

**Prometheus scrape 输出中找不到 Nacos 客户端指标**

确认 `Metrics.globalRegistry` 上确实注册了 `MeterRegistry`。Spring Boot 应用请检查 actuator starter 与 Micrometer Prometheus registry 都在 classpath 上；非 Spring 应用请确认注册代码在第一次调用 Nacos 客户端之前执行，且之后没有其他库清空 composite registry。

**已设置 `enableClientMetrics=true` 但仍然没有数据**

该属性只控制 SDK 内部是否调用记录点，并不负责注册后端。参考上一条。

**只有部分客户端指标出现**

Meter 是懒创建的：`nacos_client_request{module="naming"}` 只有在第一次 naming HTTP 调用之后才会出现，`nacos_client_naming_request_failed_total` 只有在真的发生 naming 请求失败之后才会出现。`nacos_client_request{module="config"}` 在默认装配下根本不会出现——如何自行装配 `MetricsHttpAgent` 见 [3.2 节](#32-请求-timer)的说明。在断定指标坏了之前，先触发一次相应代码路径。

**从 Nacos 3.2 升级后分位数看起来不对**

参见 [4.2 节](#42-_sum-单位从毫秒变为秒)。3.3 之前 histogram 用毫秒量级的观测值对比秒量级的 bucket 边界——10 ms 及更快的请求落进以秒解读的有限 bucket，更慢的堆积在 `+Inf`——旧分位数本就不可用；新分位数才是首次有意义的数据。

**升级后 `method` 标签分布发生变化**

从 Nacos 3.3 开始，`httpPost` 与 `httpDelete` 会以真实方法记录；此前它们都被记为 `method="GET"`。按 `method` 分组的 dashboard 会看到流量从 `GET` 迁移到 `POST` 与 `DELETE`，这是修复，不是回归。
