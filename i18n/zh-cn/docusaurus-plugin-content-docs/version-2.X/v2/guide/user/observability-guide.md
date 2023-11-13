---
title: Nacos 客户端可观测性能力使用文档
keywords: Nacos, monitor, metric, trace
description: Nacos 客户端可观测性能力使用文档
---

# Naocs 客户端可观测性能力使用文档

Nacos 客户端目前已全面增强其可观测性能力。在 Metric 方面，新增了数个不同类型的新指标，并支持同时导出至 `Prometheus` 和 `OpenTelemetry Collector`；在 Trace 方面，依照 OpenTelemetry API 实现了 Trace spans 埋点，可完全兼容 OpenTelemetry 生态。<br />本文档的目的在于快速引导用户获取 Naocs 客户端可观测性指标。

## 获取 Metric

### 环境配置

本示例需要部署以下服务以演示如何获取 Nacos 客户端的 Metric：

- 部署 Nacos 服务，详见 [Nacos 部署手册](https://nacos.io/zh-cn/docs/v2/guide/admin/deployment.html)。客户端可观测性能力与 Nacos 服务端无关，因此您可以选择任意 2.X 版本以上的 Nacos 服务端。
- 用户业务代码方面，此处以 Spring Cloud 为例，参考 [Nacos Spring Cloud 生态融合](https://nacos.io/zh-cn/docs/v2/ecology/use-nacos-with-spring-cloud.html) 文档，将 Nacos 作为配置中心和服务注册/发现中心使用，您也可以选择其它 Nacos 客户端支持的框架。**请务必注意此处使用的 Nacos 客户端版本是否支持客户端观测性增强功能**。
- 部署 Prometheus，详见 [Prometheus 官方文档](https://prometheus.io/docs/prometheus/latest/getting_started/)
  > 请先在 Prometheus 配置文件中添加以下内容，其中 `{host}` 为上述 Spring Cloud 服务所在主机的 IP 地址，`{port}` 为上述 Spring Cloud 服务所在主机的端口号。
  > 然后再通过该配置文件启动 Prometheus 服务。

```yaml
metrics_path: "/actuator/prometheus"
static_configs:
  - targets: ["{host}:{port}"]
```

- 部署 OpenTelemetry Collector，详见 [OpenTelemetry Collector 官方文档](https://opentelemetry.io/docs/collector/getting-started/)。当您采用容器方式部署时，请参考下例，务必注意需要**暴露 **`**4318**`** 端口**，`4318` 端口用于 OpenTelemetry Collector 以 HTTP 而非 GRPC 协议接收 OTLP(OpenTelemetry Protocol) 数据。由于采用 Micrometer 作为 Metric 导出工具，Nacos 客户端**只能**通过 HTTP 协议传输 OTLP 数据。

```bash
docker run -p 4317:4317 -p 4318:4318 -v example/config.yaml:/etc/otelcol/config.yaml --name="otel" otel/opentelemetry-collector:0.85.0
```

由于 Nacos 客户端的 Metric 功能是默认关闭的，因此我们需要通过 JVM 参数或环境变量来开启 Nacos 客户端的 Metric 功能。如下所示，其中 `your-application.jar` 是您编译完成后的 Spring Cloud 应用：<br />配置 JVM 参数：

```bash
java \
-Dnacos.metrics.enable=true \ # 开启 Nacos 客户端的 Metric 功能，默认为 false
-Dnacos.metrics.otel.enable=true \ # 允许 Metric 导出至 OpenTelemetry Collector，默认为 false
-Dnacos.metrics.otel.collector.endpoint="http://localhost:4318/v1/metrics" \ # OpenTelemetry Collector 的导出地址，必须为 http://host:port/ 或 https://host:port/ 格式，默认为 http://localhost:4318/v1/metrics
-jar your-application.jar
```

或者配置环境变量：

```bash
export NACOS_METRICS_ENABLE=true # 开启 Nacos 客户端的 Metric 功能，默认为 false
export NACOS_METRICS_OTEL_ENABLE=true # 允许 Metric 导出至 OpenTelemetry Collector，默认为 false
export NACOS_METRICS_OTEL_COLLECTOR_ENDPOINT="http://localhost:4318/v1/metrics" # OpenTelemetry Collector 的导出地址，必须为 http://host:port/ 或 https://host:port/ 格式，默认为 http://localhost:4318/v1/metrics

java -jar your-application.jar
```

### 获取指标

> 以下假设您的 Spring Cloud 应用部署在 `localhost:8080` 。Prometheus 部署在 `localhost:9090` 。OpenTelemetry Collector 部署在 `localhost:4318` 。

#### Prometheus

请先确保导入了 Spring Boot Actuator 的依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
    <version>${spring.boot.version}</version>
</dependency>
```

并在 Spring 的配置文件中添加以下内容：

```yaml
management:
  endpoints:
    web:
      exposure:
        include: "*"
```

或

```properties
management.endpoints.web.exposure.include=*
```

完成上述配置与部署后，您可以直接访问 `localhost:8080/acutator/prometheus` 来查看暴露的 Metric 指标：<br />![](https://s2.loli.net/2023/09/17/4WZv9q6NjBifbHK.png#id=BSDQJ&originHeight=1358&originWidth=1991&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />您也可以直接访问 `http://localhost:9090/graph` ，从 Prometheus 的可视化界面查询指标。以下例子查询了 `nacos_client_config_counter_total` 的指标信息：<br />![](https://s2.loli.net/2023/09/17/6V4iK98HpeYGU2y.png#id=JnYae&originHeight=633&originWidth=2513&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />随后，您可以根据自己的需求处理这些指标，例如[通过 Grafana 对 Metric 进行可视化](https://prometheus.io/docs/tutorials/visualizing_metrics_using_grafana/#adding-prometheus-as-a-data-source-in-grafana)等。

#### OpenTelemetry Collector

在确保 `nacos.metrics.enable=true` 的同时，**必须**设置 `nacos.metrics.otel.enable=true` 才能使您的 Metric 数据导出至 OpenTelemetry Collector。<br />您可以通过 `nacos.metrics.otel.collector.endpoint` 设置 OpenTelemetry Collector 的部署位置，如果不设置，将默认为 `http://localhost:4318/v1/metrics` 。<br />OpenTelemetry Collector 的功能十分强大，能够同时接受/导出多种形式的观测数据，下方展示了本例中 OpenTelemetry Collector 的 `config.yaml` ，您可以参考 [OpenTelemetry Collector 文档](https://opentelemetry.io/docs/collector/configuration/)进行进一步定制。

```yaml
receivers:
  otlp:
    protocols:
      grpc:
      http:

processors:
  batch:

exporters:
  logging:
    loglevel: debug

extensions:
  health_check:
  pprof:
  zpages:

service:
  extensions: [health_check, pprof, zpages]
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [logging]
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [logging]
```

此处我们配置 Collector 接受 grpc 和 http 方式传输的 OTLP(OpenTelemetry Protocol) 数据；同时，采用 `logging` 的方式导出指标，即直接显示在 OpenTelemetry Collector 的标准输入输出中，如下图所示。<br />![](https://s2.loli.net/2023/09/17/D4hX1q2PTyHVwMW.png#id=SBmgU&originHeight=1316&originWidth=2301&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />接下来，通过修改 `config.yaml` ，您可以将 Nacos 客户端所有的 Metric 数据导出到任何 [OpenTelemetry Collector 支持的导出方式](https://opentelemetry.io/docs/collector/configuration/#exporters)中，包括但不限于 kafka、jaeger 和 zipkin 等。

### 拓展：自定义指标导出方式

通过 OpenTelemetry Collector ，您能够将 Nacos 客户端的 Metric 数据导出到许多可观测性服务中。但您可能希望在不额外部署 OpenTelemetry Collector 的情况下，直接将 Nacos 客户端与特定的可观测性服务对接（类似 Prometheus 方式）。出于性能考虑，Nacos 客户端没有直接实现更多的指标导出器，而以下内容将引导您自定义 Nacos 客户端的 Metric 导出方式。<br />Nacos 客户端使用 Micrometer 收集 Metric 数据，并且提供了一个方法 `MetricsMonitor.getNacosMeterRegistry()` 用于获取指标注册器，这意味着您能够十分容易的对其进行配置。以下代码提供了一个示范，将 Nacos 客户端的 Metric 数据导出至 Elasticsearch :<br />_添加相关依赖_

```xml
<dependency>
  <groupId>io.micrometer</groupId>
  <artifactId>micrometer-registry-elastic</artifactId>
  <version>${micrometer.version}</version>
</dependency>
```

_配置 Elasticsearch 导出方式_

```java
CompositeMeterRegistry nacosMeterRegistry = MetricsMonitor.getNacosMeterRegistry();

ElasticConfig elasticConfig = new ElasticConfig() {
    @Override
    @Nullable
    public String get(String k) {
        return null;
    }
};

MeterRegistry registry = new ElasticMeterRegistry(elasticConfig, Clock.SYSTEM);
registry.config().commonTags("nacos.client.version", VersionUtils.getFullClientVersion());
nacosMeterRegistry.add(registry);
```

您可以参考 [Micrometer 官方文档](https://micrometer.io/docs) 查看更多 Nacos 客户端支持的指标导出方式。

## 获取 Trace

Nacos 客户端使用 OpenTelemetry API 实现了 Trace spans 埋点。这意味着您可以通过 OpenTelemetry SDK ([Manual instrumentation](https://opentelemetry.io/docs/instrumentation/java/manual/)) 或是 OpenTelemetry Java agent ([Automatic Instrumentation](https://opentelemetry.io/docs/instrumentation/java/automatic/)) 来获取 Nacos 客户端的所有 Trace 数据；而当您并未使用 OpenTelemetry SDK 或是 OpenTelemetry Java agent 时，OpenTelemetry API 将几乎不会做任何事，[不会收集、导出任何数据，也不会对您的应用造成任何性能影响](https://opentelemetry.io/docs/concepts/instrumentation/libraries/#opentelemetry-api)。<br />获取 OpenTelemetry Trace 数据有手动(Manual)和自动(Automatic)，两种方式，以下介绍较为通用和简易的自动方式。若您有更多 Trace 指标自定义需求，请查看 [OpenTelemetry 手动观测文档](https://opentelemetry.io/docs/instrumentation/java/manual/)。

### 环境配置

本示例需要部署以下服务以演示如何获取 Nacos 客户端的 Trace：

- 部署 Nacos 服务，详见 [Nacos 部署手册](https://nacos.io/zh-cn/docs/v2/guide/admin/deployment.html)。客户端可观测性能力与 Nacos 服务端无关，因此您可以选择任意 2.X 版本以上的 Nacos 服务端。
- 用户业务代码方面，此处以 Spring Cloud 为例，参考 [Nacos Spring Cloud 生态融合](https://nacos.io/zh-cn/docs/v2/ecology/use-nacos-with-spring-cloud.html) 文档，将 Nacos 作为配置中心和服务注册/发现中心使用，您也可以选择其它 Nacos 客户端支持的框架。**请务必注意此处使用的 Nacos 客户端版本是否支持客户端观测性增强功能**。
- 请您务必阅读[Automatic Instrumentation](https://opentelemetry.io/docs/instrumentation/java/automatic/)，了解如何下载和使用 OpenTelemetry Java agent 以进行应用自动观测。

一旦您下载了 OpenTelemetry Java agent 的 JAR 包，并准备好了您的 Spring Cloud + Nacos 应用，您可以通过以下方式启动您的 Spring Cloud 应用：

```bash
java -javaagent:path/to/opentelemetry-javaagent.jar -Dotel.service.name=spring-cloud-nacos -jar myapp.jar
```

其中，`path/to/` 是您存放 OpenTelemetry Java agent JAR 包的路径，`spring-cloud-nacos` 用于告知 Java agent 您的应用名称，`myapp.jar` 是您的 Spring Cloud 应用的 JAR 包。<br />现在，您已经完成所有的环境配置了。接下来，您可以通过任何 OpenTelemetry 支持的方式来获取 Nacos 客户端的 Trace 数据。

### 获取指标

您可以通过[更详细的配置](https://opentelemetry.io/docs/instrumentation/java/automatic/agent-config/) OpenTelemetry Java agent 来实现多种 Trace 数据导出方式。如果如上述例子一样，不进行特殊配置，那么 OpenTelemetry Java agent 将会默认以 OTLP(OpenTelemetry Protocol) 的方式导出 Trace 数据。此时，您可以和获取 Metric 数据类似，通过部署 OpenTelemetry Collector 来接收 Trace 数据；但如果您希望通过更直接了当的方式获取 Trace 数据并进行可视化分析，您可以选择使用 [Jaeger](https://www.jaegertracing.io/) 。<br />您可以参考 [Jaeger quick-start](https://www.jaegertracing.io/docs/1.49/getting-started/) 快速部署 Jaeger 。例如仅需要以下 docker 命令即可运行一个完整的 Jaeger 服务：

```bash
docker run --rm --name jaeger \
  -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
  -p 6831:6831/udp \
  -p 6832:6832/udp \
  -p 5778:5778 \
  -p 16686:16686 \
  -p 4317:4317 \
  -p 4318:4318 \
  -p 14250:14250 \
  -p 14268:14268 \
  -p 14269:14269 \
  -p 9411:9411 \
  jaegertracing/all-in-one:1.49
```

在确保您的 Spring Cloud 应用和 Jaeger 服务（假设它们都部署在本地）都按照上文所述配置启动后，您可以访问 `http://localhost:16686/search` 来查看 Jaeger 的可视化界面：<br />![](https://s2.loli.net/2023/09/19/bE5vngczryOAUjX.png#id=s10j1&originHeight=1317&originWidth=2517&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />在 `Service` 中找到您在 `-Dotel.service.name` 所配置的应用名称，此时您可能发现主页面中并没有 Nacos 的 Trace 信息，这是因为 OpenTelemetry Java agent 同时监控了 grpc 或其它一些代码的链路，导致额外的 Trace 信息较多。您可以通过 `Operation` 选项进行过滤，找到以 `Nacos.client` 为前缀的 Trace 信息。我们以 `Nacos.client.config.service/getServerConfig` 这条 Trace 数据为例<br />![](https://s2.loli.net/2023/09/19/1v7XOqJpgGhuWZi.png#id=rRNFe&originHeight=1318&originWidth=2517&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />可以看到 Nacos 客户端向服务端发送了三次配置请求的链路，其中两次配置请求失败了，而有一次配置请求成功了。我们发现配置成功的请求拥有特别多的 Span ，这是由于 Nacos 客户端与服务端之间的 grpc 长连接导致内部 grpc span 增长。深入观察失败的链路如下图所示：<br />![](https://s2.loli.net/2023/09/19/BmU3De2uJZnbEoG.png#id=WoRZr&originHeight=1316&originWidth=2519&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />从 Trace 信息我们可以看到出错的配置的具体信息，如 `data.id`，`group` 等，同时也能够看到该链路出错的原因：`300: config data not exist` 。
