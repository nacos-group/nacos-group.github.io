---
title: Nacos 客户端可观测性指标文档
keywords: Nacos, monitor, metric, trace
description: Nacos 客户端可观测性指标文档
---

# Nacos 客户端可观测性指标文档

## Metric

### Metric 命名规范

Meter（指标计量器）是观测 Metric 指标的基本数据结构；Tag（标签）是 Micrometer 中一个 Meter 拥有的属性字段，类似于 OpenTelemetry 中的 Attribute。

- Metric 指标的 meter-name 和 tag-key 命名应遵守 [Micrometer 的规范](https://micrometer.io/docs/concepts#_naming_meters)。在保证语义清晰的前提下，应当使用尽量少的单词命名，单词之间应使用 **.** (dot，英文句号) 分隔。

  > 只要遵守了 Micrometer 的命名规范，在导出到不同的指标收集服务时，Micrometer 将会自动将命名转换为对应的格式，例如在 Micrometer 中定义 `registry.timer("http.server.requests");`
  > Micrometer 将对应转换为：
  >
  > 1. Prometheus - `http_server_requests_duration_seconds`
  > 2. Atlas - `httpServerRequests`
  > 3. Graphite - `http.server.requests`
  > 4. InfluxDB - `http_server_requests`

- tag-value 必须非空。
- 在 Nacos 客户端 Metric 指标中，还必须遵循以下规范：
  1.  meter-name 必须以 nacos.client.{config/naming} 为前缀，后缀一般以其 meter 类型命名，但对于某些有区分度高的指标可以例外，如 `nacos.client.naming.cache`
  2.  每个单独指标的 tag 中必须拥有一个 `name` 字段作为 key，而其 value 用于解释该 meter 指标的监控内容，以驼峰命名法命名，首字母小写，例如 `notifyCostDuration`。

以下是一个 Nacos 客户端 Metric 指标的例子，其 Meter-name 为 `nacos.client.config.timer`，其 `{Tag-key: Tag-value}` 为 `{name: notifyCostDuration}`。

| **meter name**            | `**name**`<br />** tag** | **指标描述**                   | **类型** |
| ------------------------- | ------------------------ | ------------------------------ | -------- |
| nacos.client.config.timer | notifyCostDuration       | 客户端单次配置变更时的通知耗时 | Timer    |

### 配置中心

> nacos.monitor.listenConfigCount（配置数量）指标是先前支持的 Nacos 客户端指标，为了向后兼容考虑，我们没有改动其 meter name 和 `name` tag

| **meter name**              | `**name**`<br />** tag**        | **指标描述**                                   | **类型** |
| --------------------------- | ------------------------------- | ---------------------------------------------- | -------- |
| nacos.client.config.timer   | configRequest                   | 配置请求用时（HTTP）                           | Timer    |
| nacos.client.config.timer   | notifyCostDuration              | 客户端单次配置变更时的通知耗时                 | Timer    |
| nacos.client.config.timer   | rpcCostDuration                 | 客户端配置 RPC 请求耗时                        | Timer    |
| nacos.client.config.timer   | handleServerRequestCostDuration | 客户端（config 模块）处理推送耗时              | Timer    |
| nacos.monitor               | listenConfigCount               | 配置数量                                       | Gauge    |
| nacos.client.config.common  | serverNumber                    | 客户端（config 模块）检测到的 Nacos 服务端数量 | Gauge    |
| nacos.client.config.counter | syncWithServer                  | 客户端与服务端配置同步次数                     | Counter  |
| nacos.client.config.counter | querySuccess                    | 客户端配置查询成功次数                         | Counter  |
| nacos.client.config.counter | queryFailed                     | 客户端配置查询失败次数                         | Counter  |
| nacos.client.config.counter | publishSuccess                  | 客户端配置发布成功次数                         | Counter  |
| nacos.client.config.counter | publishFailed                   | 客户端配置发布失败次数                         | Counter  |
| nacos.client.config.counter | removeSuccess                   | 客户端配置移除成功次数                         | Counter  |
| nacos.client.config.counter | removeFailed                    | 客户端配置移除失败次                           | Counter  |
| nacos.client.config.counter | serverRequestHandle             | 客户端（config 模块）处理服务端推送次数        | Counter  |

### 服务注册/发现中心

> nacos.monitor.serviceInfoMapSize（服务数量）指标是先前支持的 Nacos 客户端指标，为了向后兼容考虑，我们没有改动其 meter name 和 `name` tag

| **meter name**              | `**name**`<br />** tag**        | **指标描述**                                   | **类型** |
| --------------------------- | ------------------------------- | ---------------------------------------------- | -------- |
| nacos.client.naming.timer   | namingRequest                   | 服务注册/订阅请求用时（HTTP）                  | Timer    |
| nacos.client.naming.timer   | rpcCostDuration                 | 客户端服务 RPC 请求耗时                        | Timer    |
| nacos.client.naming.timer   | handleServerRequestCostDuration | 客户端（namin 模块）处理推送耗时               | Timer    |
| nacos.monitor               | serviceInfoMapSize              | 服务数量                                       | Gauge    |
| nacos.client.naming.cache   | instanceRedoCacheSize           | 可回滚的服务实例缓存大小(gRPC)                 | Gauge    |
| nacos.client.naming.cache   | subscribeRedoCacheSize          | 可回滚的服务订阅缓存大小(gRPC)                 | Gauge    |
| nacos.client.naming.cache   | serviceInfoFailoverCacheSize    | 故障恢复时的服务信息缓存大小                   | Gauge    |
| nacos.client.naming.common  | serverNumber                    | 客户端（naming 模块）检测到的 Nacos 服务端数量 | Gauge    |
| nacos.client.naming.common  | subscribeServiceNumber          | 客户端已订阅的服务数量                         | Gauge    |
| nacos.client.naming.common  | scheduledSyncTasksNumber        | 客户端目前等待与服务端同步服务信息的任务数量   | Gauge    |
| nacos.client.naming.counter | serverRequestHandle             | 客户端（naming 模块）处理服务端推送次数        | Counter  |

## Trace

### Trace 命名规范

Naocs 客户端 Trace 指标命名规范应当参考 [OpenTelemetry Trace 语义约定文档](https://opentelemetry.io/docs/specs/otel/trace/semantic_conventions/)。

#### Span 定义

Nacos 客户端 Span 名称应当以 `Nacos.client.{config/naming}` 为前缀，请注意 `Nacos` 的首字母需要大写，其余均为小写。随后应当以 Span 所在层次添加相应后缀 `.rpc`, `.http`, `.service` 或 `.worker`。最后用 `/` 分隔，再添加 Span 的具体操作，一般可以以 Span 所观测的函数名命名。一个标准的 Nacos 客户端 Span 名称应当如下所示：

```latex
Nacos.client.config.service/queryConfig
```

每个 Nacos 客户端 Span 必须携带 `nacos.client.version` 属性，其 value 通过 `VersionUtils.getFullClientVersion()` 取得。下例展示了一个 Nacos 客户端 Span 的创建过程：

```java
private static final String NACOS_CLIENT_VERSION_ATTRIBUTE = "nacos.client.version";
...
String spanName = "Nacos.client.config.service/queryConfig";
Span span = TraceMonitor.getTracer().spanBuilder(spanName)
            .setAttribute(NACOS_CLIENT_VERSION_ATTRIBUTE, VersionUtils.getFullClientVersion())
            .startSpan();
```

#### Span Attributes 命名

一个 Span 会包含多种 Attributes（属性）以描述其具体信息。[OpenTelemetry Trace 语义约定文档](https://opentelemetry.io/docs/specs/otel/trace/semantic_conventions/) 规定了部分 Attributes 的命名规范，Nacos 客户端主要涉及其中的 Net/HTTP/RPC 部分。要直接使用 OpenTelemetry 语义约定，需要导入相关的 Maven 依赖：

```xml
<dependency>
    <groupId>io.opentelemetry</groupId>
    <artifactId>opentelemetry-semconv</artifactId>
    <version>${io.opentelemetry.version}-alpha</version>
</dependency>
```

参考[该文档](https://opentelemetry.io/docs/instrumentation/java/manual/#semantic-attributes)以了解如何在 Java 代码中使用 OpenTelemetry 语义约定。<br />Nacos 自身也定义了类似 `opentelemetry-semconv` 的 Span Attributes 命名规范 `com.alibaba.nacos.common.constant.NacosSemanticAttributes` ，可以直接使用该类中的常量来设置 Span Attributes key。如果需要添加新的 Span Attributes，而 `opentelemetry-semconv` 中又没有相关定义，请直接修改/添加 `com.alibaba.nacos.common.constant.NacosSemanticAttributes` 中的常量，以避免 Span Attributes key 出现 Magic value 问题。

### 配置中心

#### 网络通信层

| **Span 名称**                   | **所在层次** | **Span 埋点**                                                                             | **描述**                            |
| ------------------------------- | ------------ | ----------------------------------------------------------------------------------------- | ----------------------------------- |
| Nacos.client.config.rpc/GRPC    | 网络通信层   | com.alibaba.nacos.client.config.impl.ClientWorker.ConfigRpcTransportClient.requestProxy() | 监控客户端配置中心 RPC 请求         |
| Nacos.client.config.http/GET    | 网络通信层   | com.alibaba.nacos.client.config.http.ServerHttpAgent.httpGet()                            | 监控客户端配置中心 HTTP Get 请求    |
| Nacos.client.config.http/POST   | 网络通信层   | com.alibaba.nacos.client.config.http.ServerHttpAgent.httpPost()                           | 监控客户端配置中心 HTTP Post 请求   |
| Nacos.client.config.http/DELETE | 网络通信层   | com.alibaba.nacos.client.config.http.ServerHttpAgent.httpDelete()                         | 监控客户端配置中心 HTTP Delete 请求 |

#### 用户接口层

| **Span 名称**                                         | **所在层次** | **Span 埋点**                                                                 | **描述**                   |
| ----------------------------------------------------- | ------------ | ----------------------------------------------------------------------------- | -------------------------- |
| Nacos.client.config.service/queryConfig               | 用户接口层   | com.alibaba.nacos.client.config.NacosConfigService.getConfigAndSignListener() | 客户端查询配置             |
| Nacos.client.config.service/addTenantListeners        | 用户接口层   | com.alibaba.nacos.client.config.NacosConfigService.getConfigAndSignListener() | 客户端添加指定租户监听器   |
| Nacos.client.config.service/addListener               | 用户接口层   | com.alibaba.nacos.client.config.NacosConfigService.addListener()              | 客户端添加监听器           |
| Nacos.client.config.service/removeListener            | 用户接口层   | com.alibaba.nacos.client.config.NacosConfigService.removeListener()           | 客户端移除监听器           |
| Nacos.client.config.service/getFailoverConfig         | 用户接口层   | com.alibaba.nacos.client.config.NacosConfigService.getConfigInner()           | 客户端获取故障恢复配置     |
| Nacos.client.config.service/getEncryptDataKeyFailover | 用户接口层   | com.alibaba.nacos.client.config.NacosConfigService.getConfigInner()           | 客户端获取故障恢复加密配置 |
| Nacos.client.config.service/getServerConfig           | 用户接口层   | com.alibaba.nacos.client.config.NacosConfigService.getConfigInner()           | 客户端获取服务端配置       |
| Nacos.client.config.service/getSnapshotConfig         | 用户接口层   | com.alibaba.nacos.client.config.NacosConfigService.getConfigInner()           | 客户端获取快照配置         |
| Nacos.client.config.service/getEncryptDataKeySnapshot | 用户接口层   | com.alibaba.nacos.client.config.NacosConfigService.getConfigInner()           | 客户端获取加密快照配置     |
| Nacos.client.config.service/removeConfig              | 用户接口层   | com.alibaba.nacos.client.config.NacosConfigService.removeConfigInner()        | 客户端移除配置             |
| Nacos.client.config.service/publishConfig             | 用户接口层   | com.alibaba.nacos.client.config.NacosConfigService.publishConfigInner()       | 客户端发布配置             |
| Nacos.client.config.service/getServerStatus           | 用户接口层   | com.alibaba.nacos.client.config.NacosConfigService.getServerStatus()          | 客户端获取服务端状态       |

#### 核心逻辑层

| **Span 名称**                                                        | **所在层次** | **Span 埋点**                                                                                                | **描述**                                 |
| -------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| Nacos.client.config.worker/addListenerCache                          | 核心逻辑层   | com.alibaba.nacos.client.config.impl.ClientWorker.addListeners()                                             | 客户端添加监听器缓存                     |
| Nacos.client.config.worker/addTenantListenerCache                    | 核心逻辑层   | com.alibaba.nacos.client.config.impl.ClientWorker.addTenantListeners()                                       | 客户端添加指定租户监听器缓存             |
| Nacos.client.config.worker/addTenantListenersWithContentCache        | 核心逻辑层   | com.alibaba.nacos.client.config.impl.ClientWorker.addTenantListenersWithContent()                            | 客户端添加带特定内容的指定租户监听器缓存 |
| Nacos.client.config.worker/removeListenerCache                       | 核心逻辑层   | com.alibaba.nacos.client.config.impl.ClientWorker.removeListeners()                                          | 客户端移除监听器缓存                     |
| Nacos.client.config.worker/removeTenantListenerCache                 | 核心逻辑层   | com.alibaba.nacos.client.config.impl.ClientWorker.removeTenantListeners()                                    | 客户端移除指定租户监听器缓存             |
| Nacos.client.config.worker/handleConfigChangeNotifyRequestFromServer | 核心逻辑层   | com.alibaba.nacos.client.config.impl.ClientWorker.ConfigRpcTransportClient.handleConfigChangeNotifyRequest() | 客户端处理服务端推送的配置变更通知请求   |
| Nacos.client.config.worker/handleClientConfigMetricRequestFromServer | 核心逻辑层   | com.alibaba.nacos.client.config.impl.ClientWorker.ConfigRpcTransportClient.handleClientConfigMetricRequest() | 客户端处理服务端推送的配置指标通知请求   |
| Nacos.client.config.worker/queryConfigRequest                        | 核心逻辑层   | com.alibaba.nacos.client.config.impl.ClientWorker.ConfigRpcTransportClient.queryConfig()                     | 客户端查询配置                           |
| Nacos.client.config.worker/publishConfigRequest                      | 核心逻辑层   | com.alibaba.nacos.client.config.impl.ClientWorker.ConfigRpcTransportClient.publishConfig()                   | 客户端发布配置                           |
| Nacos.client.config.worker/removeConfigRequest                       | 核心逻辑层   | com.alibaba.nacos.client.config.impl.ClientWorker.ConfigRpcTransportClient.removeConfig()                    | 客户端移除配置                           |

### 服务注册/发现中心

#### 网络通信层

| **Span 名称**                     | **所在层次** | **Span 埋点**                                                                       | **描述**                     |
| --------------------------------- | ------------ | ----------------------------------------------------------------------------------- | ---------------------------- |
| Nacos.client.naming.rpc/GRPC      | 网络通信层   | com.alibaba.nacos.client.naming.remote.gprc.NamingGrpcClientProxy.requestToServer() | 监控客户端服务中心 RPC 请求  |
| Nacos.client.naming.http/{method} | 网络通信层   | com.alibaba.nacos.client.naming.remote.http.NamingHttpClientProxy.callServer()      | 监控客户端服务中心 HTTP 请求 |

#### 用户接口层

| **Span 名称**                                        | **所在层次** | **Span 埋点**                                                                 | **描述**                 |
| ---------------------------------------------------- | ------------ | ----------------------------------------------------------------------------- | ------------------------ |
| Nacos.client.naming.service/registerInstance         | 用户接口层   | com.alibaba.nacos.client.naming.NacosNamingService.registerInstance()         | 客户端注册服务实例       |
| Nacos.client.naming.service/batchRegisterInstance    | 用户接口层   | com.alibaba.nacos.client.naming.NacosNamingService.batchRegisterInstance()    | 客户端批量注册服务实例   |
| Nacos.client.naming.service/batchDeregisterInstance  | 用户接口层   | com.alibaba.nacos.client.naming.NacosNamingService.batchDeregisterInstance()  | 客户端批量注销服务实例   |
| Nacos.client.naming.service/deregisterInstance       | 用户接口层   | com.alibaba.nacos.client.naming.NacosNamingService.deregisterInstance()       | 客户端注销服务实例       |
| Nacos.client.naming.service/getAllInstances          | 用户接口层   | com.alibaba.nacos.client.naming.NacosNamingService.getAllInstances()          | 客户端获取所有服务实例   |
| Nacos.client.naming.service/selectInstances          | 用户接口层   | com.alibaba.nacos.client.naming.NacosNamingService.selectInstances()          | 客户端选择服务实例       |
| Nacos.client.naming.service/selectOneHealthyInstance | 用户接口层   | com.alibaba.nacos.client.naming.NacosNamingService.selectOneHealthyInstance() | 客户端选择单个健康实例   |
| Nacos.client.naming.service/subscribe                | 用户接口层   | com.alibaba.nacos.client.naming.NacosNamingService.subscribe()                | 客户端订阅服务实例       |
| Nacos.client.naming.service/unsubscribe              | 用户接口层   | com.alibaba.nacos.client.naming.NacosNamingService.unsubscribe()              | 客户端取消订阅服务实例   |
| Nacos.client.naming.service/getServicesOfServer      | 用户接口层   | com.alibaba.nacos.client.naming.NacosNamingService.getServicesOfServer()      | 客户端获取服务端服务列表 |
| Nacos.client.naming.service/getServerStatus          | 用户接口层   | com.alibaba.nacos.client.naming.NacosNamingService.getServerStatus()          | 客户端获取服务端状态     |

#### 核心逻辑层

| **Span 名称**                                            | **所在层次** | **Span 埋点**                                                                               | **描述**                                    |
| -------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Nacos.client.naming.worker/onServerListChangedEvent      | 核心逻辑层   | com.alibaba.nacos.client.naming.remote.gprc.NamingGrpcClientProxy.onEvent()                 | 客户端处理服务列表变更事件（grpc）          |
| Nacos.client.naming.worker/getRetainInstance             | 核心逻辑层   | com.alibaba.nacos.client.naming.remote.gprc.NamingGrpcClientProxy.getRetainInstance()       | 客户端获取保留实例（grpc）                  |
| Nacos.client.naming.worker/doBatchRegisterService        | 核心逻辑层   | com.alibaba.nacos.client.naming.remote.gprc.NamingGrpcClientProxy.doBatchRegisterService()  | 客户端批量注册服务（grpc）                  |
| Nacos.client.naming.worker/doRegisterService             | 核心逻辑层   | com.alibaba.nacos.client.naming.remote.gprc.NamingGrpcClientProxy.doRegisterService()       | 客户端注册服务（grpc）                      |
| Nacos.client.naming.worker/doDeregisterService           | 核心逻辑层   | com.alibaba.nacos.client.naming.remote.gprc.NamingGrpcClientProxy.doDeregisterService()     | 客户端注销服务（grpc）                      |
| Nacos.client.naming.worker/queryInstancesOfService       | 核心逻辑层   | com.alibaba.nacos.client.naming.remote.gprc.NamingGrpcClientProxy.queryInstancesOfService() | 客户端查询服务实例（grpc）                  |
| Nacos.client.naming.worker/getServiceList                | 核心逻辑层   | com.alibaba.nacos.client.naming.remote.gprc.NamingGrpcClientProxy.getServiceList()          | 客户端获取服务列表（grpc）                  |
| Nacos.client.naming.worker/doSubscribe                   | 核心逻辑层   | com.alibaba.nacos.client.naming.remote.gprc.NamingGrpcClientProxy.doSubscribe()             | 客户端订阅服务实例（grpc）                  |
| Nacos.client.naming.worker/doUnsubscribe                 | 核心逻辑层   | com.alibaba.nacos.client.naming.remote.gprc.NamingGrpcClientProxy.doUnsubscribe()           | 客户端取消订阅服务实例（grpc）              |
| Nacos.client.naming.worker/serverHealthy                 | 核心逻辑层   | com.alibaba.nacos.client.naming.remote.gprc.NamingGrpcClientProxy.serverHealthy()           | 服务端健康情况（grpc）                      |
| Nacos.client.naming.worker/handleNamingRequestFromServer | 核心逻辑层   | com.alibaba.nacos.client.naming.remote.gprc.NamingPushRequestHandler.requestReply()         | 客户端处理服务端推送的服务注册/发现相关请求 |
| Nacos.client.naming.worker/registerService               | 核心逻辑层   | com.alibaba.nacos.client.naming.remote.http.NamingHttpClientProxy.registerService()         | 客户端注册服务（http）                      |
| Nacos.client.naming.worker/deregisterService             | 核心逻辑层   | com.alibaba.nacos.client.naming.remote.http.NamingHttpClientProxy.deregisterService()       | 客户端注销服务（http）                      |
| Nacos.client.naming.worker/updateInstance                | 核心逻辑层   | com.alibaba.nacos.client.naming.remote.http.NamingHttpClientProxy.updateInstance()          | 客户端更新服务实例（http）                  |
| Nacos.client.naming.worker/queryInstancesOfService       | 核心逻辑层   | com.alibaba.nacos.client.naming.remote.http.NamingHttpClientProxy.queryInstances()          | 客户端查询服务实例（http）                  |
| Nacos.client.naming.worker/queryService                  | 核心逻辑层   | com.alibaba.nacos.client.naming.remote.http.NamingHttpClientProxy.queryService()            | 客户端查询服务（http）                      |
| Nacos.client.naming.worker/createService                 | 核心逻辑层   | com.alibaba.nacos.client.naming.remote.http.NamingHttpClientProxy.createService()           | 客户端创建服务（http）                      |
| Nacos.client.naming.worker/deleteService                 | 核心逻辑层   | com.alibaba.nacos.client.naming.remote.http.NamingHttpClientProxy.deleteService()           | 客户端删除服务（http）                      |
| Nacos.client.naming.worker/updateService                 | 核心逻辑层   | com.alibaba.nacos.client.naming.remote.http.NamingHttpClientProxy.updateService()           | 客户端更新服务（http）                      |
| Nacos.client.naming.worker/serverHealthy                 | 核心逻辑层   | com.alibaba.nacos.client.naming.remote.http.NamingHttpClientProxy.serverHealthy()           | 服务端健康情况（http）                      |
| Nacos.client.naming.worker/getServiceList                | 核心逻辑层   | com.alibaba.nacos.client.naming.remote.http.NamingHttpClientProxy.getServiceList()          | 客户端获取服务列表（http）                  |
