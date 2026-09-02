---
title: Java SDK Metrics
keywords: [Java, SDK, Metrics, Micrometer, Prometheus]
description: Enable nacos-client metrics with Micrometer, choose a Prometheus registry, and migrate dashboards from the pre-3.3 histogram names and units.
sidebar:
  order: 5
---

# Java SDK Metrics

Since Nacos 3.3, `nacos-client` no longer ships a hard dependency on `io.prometheus:simpleclient`. All client meters are recorded on Micrometer's `Metrics.globalRegistry`, so the SDK stays lightweight and no metric backend is forced on the application.

The behavior is opt-in through the registry, not through the client:

- With no `MeterRegistry` registered, recording is a safe no-op.
- As soon as the application adds a concrete registry, every nacos client meter starts to flow into it.

:::note
Nacos Server has its own metrics endpoint. See [Monitoring Manual](../../admin/monitor.md) for the server side.
:::

## 1. Enable client metrics

### 1.1. The `enableClientMetrics` switch

The client property `enableClientMetrics` (`PropertyKeyConst.ENABLE_CLIENT_METRICS`) gates every recording site inside the SDK. It defaults to `true` and applies to both `NamingService` and `ConfigService`. Set it to `false` to skip all recording calls, which is useful when the surrounding application manages metrics through another mechanism:

```properties
enableClientMetrics=false
```

Leaving the property at its default is the right choice in most cases: with no registry registered, the recording calls are already cheap.

### 1.2. Spring Boot applications

Spring Boot auto-configures a `MeterRegistry` bean for every supported backend and adds it to `Metrics.globalRegistry` on startup. Adding the Prometheus registry starter is enough:

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

Then expose the scrape endpoint:

```properties
management.endpoints.web.exposure.include=health,info,prometheus
```

Nacos client meters appear under `/actuator/prometheus` alongside the application's own meters. No extra wiring is required.

### 1.3. Non-Spring applications

Register a concrete `MeterRegistry` on `Metrics.globalRegistry` before creating any `NamingService` or `ConfigService`. The registry can be added at any time; meters created before the registration are picked up as soon as the registry joins the composite.

```java
import io.micrometer.core.instrument.Metrics;
import io.micrometer.prometheusmetrics.PrometheusConfig;
import io.micrometer.prometheusmetrics.PrometheusMeterRegistry;

PrometheusMeterRegistry registry = new PrometheusMeterRegistry(PrometheusConfig.DEFAULT);
Metrics.globalRegistry.add(registry);

// Expose registry.scrape() through an HTTP endpoint of your choice.
```

If the application already owns a `MeterRegistry` for other libraries, reuse it: adding the same registry instance to `Metrics.globalRegistry` is enough, and Nacos client meters are collected together with the rest.

### 1.4. Choosing a Prometheus registry artifact

Micrometer publishes two Prometheus registries. Both work with `nacos-client`:

| Artifact | Underlying Prometheus client | When to choose |
| --- | --- | --- |
| `io.micrometer:micrometer-registry-prometheus` | `io.prometheus:prometheus-metrics-core` (new client) | New applications, or applications already on the new Prometheus client. |
| `io.micrometer:micrometer-registry-prometheus-simpleclient` | `io.prometheus:simpleclient` (legacy client) | Applications that must stay on the legacy Prometheus client for compatibility with other libraries. |

Pick one, not both. Registering two Prometheus registries on the same `CollectorRegistry` produces duplicated series.

## 2. `io.prometheus:simpleclient` alone is no longer sufficient

Before Nacos 3.3, adding `io.prometheus:simpleclient` to the classpath was enough to see `nacos_monitor`, `nacos_client_request`, and the other client meters, because the client created and registered the collectors directly.

Since Nacos 3.3 this is **no longer true**:

- `nacos-client` does not create any Prometheus collector.
- `io.prometheus:simpleclient` on its own does not know about Micrometer and therefore does not register anything on `Metrics.globalRegistry`.
- The result is that the client meters silently disappear from the scrape output after upgrading.

To keep exporting Nacos client metrics, replace the bare `simpleclient` dependency with one of the Micrometer Prometheus registries from [section 1.4](#14-choosing-a-prometheus-registry-artifact) and make sure it is registered on `Metrics.globalRegistry`.

## 3. Metric reference

All names and tags below are what appears on the Prometheus scrape endpoint. Micrometer adds the base-unit suffix (`_seconds`) to timers; it does **not** append another `_total` to counters whose name already ends with `_total`.

### 3.1. Gauges

| Series | Tags | Description |
| --- | --- | --- |
| `nacos_monitor` | `module="naming"`, `name="serviceInfoMapSize"` | Number of subscribed services currently held in the client cache. |
| `nacos_monitor` | `module="config"`, `name="listenConfigCount"` | Number of configurations currently listened by `ConfigService`. |
| `nacos_monitor` | `module="ai"`, `name="agentWatchIntentCount"` | Number of AI agent watch intents currently tracked. |
| `nacos_monitor` | `module="ai"`, `name="agentWatchPendingCount"` | Number of AI agent watch callbacks pending dispatch. |
| `nacos_monitor` | `module="ai"`, `name="agentWatchDirtyCount"` | Number of AI agent watch entries marked dirty. |

The `nacos_monitor` gauge keeps the historical name and tag layout, so dashboards built on Nacos 2.x continue to read the same series.

### 3.2. Request timer

`nacos_client_request` is exported as `nacos_client_request_seconds_{bucket,count,sum,max}`.

| Tag | Values |
| --- | --- |
| `module` | `config`, `naming` |
| `method` | `GET`, `POST`, `DELETE` |
| `url` | Request path, for example `/cs/configs` or `/ns/instance/list` |
| `code` | HTTP status code as a string, or `NA` when no response was received |

Since Nacos 3.3, the `method` tag reflects the actual HTTP verb. In earlier versions `httpPost` and `httpDelete` were recorded under `method="GET"`; alerts and dashboards grouping by method may see the traffic redistributed after upgrading.

Bucket boundaries are the Prometheus Java client defaults, exposed as Micrometer service level objectives so `histogram_quantile()` keeps working:

```text
le="0.005" le="0.01" le="0.025" le="0.05" le="0.075" le="0.1"
le="0.25" le="0.5" le="0.75" le="1.0" le="2.5" le="5.0" le="7.5" le="10.0" le="+Inf"
```

### 3.3. Failed naming request counter

`nacos_client_naming_request_failed_total` is a Micrometer counter. Because the base name already ends with `_total`, the exported series keeps the same name; no double suffix is appended.

| Tag | Values |
| --- | --- |
| `module` | `naming` |
| `req_class` | Simple class name of the failed gRPC request, for example `InstanceRequest` |
| `res_status` | Response result code, or `NONE` when no response was received |
| `res_code` | Response error code, or `NONE` when no response was received |
| `err_class` | Simple class name of the thrown exception, or `NONE` when no exception was thrown |

### 3.4. AI watch event counter

`nacos_client_ai_watch_events_total` counts AI agent watch events. Both tags are closed enums, so cardinality stays bounded.

| Tag | Values |
| --- | --- |
| `event` | `discover_refresh`, `fingerprint_mismatch`, `retry`, `capacity_rejection`, `listener_callback` |
| `result` | `success`, `unchanged`, `mismatch`, `scheduled`, `rejected`, `failed` |

## 4. Migration from Nacos 3.2 and earlier

Only two things change on the wire. The gauge and the two counters keep their exact names and tags, so dashboards that read them continue to work.

### 4.1. `nacos_client_request` series are renamed

| Before | After |
| --- | --- |
| `nacos_client_request_bucket` | `nacos_client_request_seconds_bucket` |
| `nacos_client_request_count` | `nacos_client_request_seconds_count` |
| `nacos_client_request_sum` | `nacos_client_request_seconds_sum` |
| — | `nacos_client_request_seconds_max` (new) |

The rename comes from Micrometer, which appends the base unit to timer series. Every PromQL expression, alert rule, and dashboard panel that references the old names must be updated.

### 4.2. `_sum` unit changes from milliseconds to seconds

Before Nacos 3.3 the client fed `System.currentTimeMillis() - start` into a Prometheus histogram whose buckets were defined in seconds. Every observation therefore landed in `le="+Inf"` and the `_sum` value was in milliseconds.

Since Nacos 3.3 the elapsed time is recorded on a Micrometer timer:

- `nacos_client_request_seconds_sum` is in **seconds**.
- The buckets are populated correctly, so `histogram_quantile()` returns meaningful percentiles for the first time.

### 4.3. Recording rules for existing dashboards

If rewriting every dashboard is not an option, keep the old names alive with recording rules. Deploy them on the Prometheus instance that scrapes the clients:

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

The `* 1000` factor converts the new seconds-based `_sum` back into the milliseconds the old dashboards expect. Bucket boundaries did not change, so `nacos_client_request_bucket` can be reused as-is.

:::caution
Recording rules only preserve names and units. They cannot restore the fact that pre-3.3 buckets were unusable: any percentile computed from an old scrape was based on observations that all landed in `+Inf`. After upgrading, percentiles become meaningful for the first time and will look very different from the pre-3.3 values.
:::

### 4.4. PromQL migration examples

| Purpose | Before | After |
| --- | --- | --- |
| QPS by module | `sum(rate(nacos_client_request_count[1m])) by (module)` | `sum(rate(nacos_client_request_seconds_count[1m])) by (module)` |
| Average latency in ms | `sum(rate(nacos_client_request_sum[5m])) / sum(rate(nacos_client_request_count[5m]))` | `1000 * sum(rate(nacos_client_request_seconds_sum[5m])) / sum(rate(nacos_client_request_seconds_count[5m]))` |
| p99 latency | `histogram_quantile(0.99, sum(rate(nacos_client_request_bucket[5m])) by (le))` | `histogram_quantile(0.99, sum(rate(nacos_client_request_seconds_bucket[5m])) by (le))` |
| Error rate by method | `sum(rate(nacos_client_request_count{code!="200",code!="NA"}[5m])) by (method)` | `sum(rate(nacos_client_request_seconds_count{code!="200",code!="NA"}[5m])) by (method)` |

The p99 result is expressed in seconds. Multiply by `1000` in the panel if the dashboard unit is milliseconds.

## 5. Metrics failures never affect client requests

All recording paths inside `MetricsMonitor` swallow `Throwable`, so a broken registry cannot:

- Replace a successful business result (recording runs in a `finally` block of `MetricsHttpAgent`).
- Mask the original exception thrown by an HTTP or gRPC call.
- Cancel a scheduled task that reports metrics.

The first failure is logged at `WARN` level through `com.alibaba.nacos.client.monitor.MetricsMonitor`; subsequent failures are suppressed to avoid flooding the client log. If metrics stop appearing after a deployment, check that log once and fix the underlying registry issue.

## 6. Troubleshooting

**Nacos client meters are missing from the Prometheus scrape output**

Confirm that a `MeterRegistry` is actually registered on `Metrics.globalRegistry`. In a Spring Boot application, check that the actuator starter and the Micrometer Prometheus registry are on the classpath. In a non-Spring application, make sure the registration runs before the first Nacos client call and that no other library clears the composite registry afterwards.

**`enableClientMetrics=true` is set but nothing is recorded**

The property only gates calls inside the SDK; it does not register a backend. See the previous item.

**Only some client meters appear**

Meters are created lazily on first use. `nacos_client_request{module="config"}` shows up only after the first HTTP call, and `nacos_client_naming_request_failed_total` only after a naming request actually fails. Trigger the relevant code path before concluding that a meter is broken.

**Percentile values look wrong after upgrading from Nacos 3.2**

See [section 4.2](#42-_sum-unit-changes-from-milliseconds-to-seconds). The pre-3.3 histogram was fed milliseconds into second-based buckets, so old percentiles were unusable. New percentiles are the first meaningful ones.

**`method` label distribution changed after upgrading**

Since Nacos 3.3, `httpPost` and `httpDelete` are recorded with their real verb. Before that they were all recorded under `method="GET"`. Dashboards grouping by `method` will show a shift of traffic from `GET` to `POST` and `DELETE` after the upgrade; this is a fix, not a regression.
