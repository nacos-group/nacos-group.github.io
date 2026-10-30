---
title: 轨迹追踪
keywords: [轨迹追踪, 操作审计, 诊断, Trace Plugin]
description: 本文介绍 Nacos Trace 插件的事件模型、适用场景、开发方式和稳定性建议。
sidebar:
    order: 7
---

# 轨迹追踪插件

Nacos Trace 插件用于订阅 Nacos 内部资源操作事件，帮助运维人员做审计、排障和诊断。它记录的是 Nacos 领域事件，例如服务注册、服务推送、实例健康状态变化、AI 资源操作等。

它不是应用服务之间的分布式链路追踪。如果需要观察业务服务之间的调用链，请使用 OpenTelemetry、SkyWalking、Zipkin 等链路追踪体系。

## 适用场景

- 记录服务注册、注销、订阅、推送等 Naming 事件。
- 记录实例健康状态变化原因，辅助排查实例上下线抖动。
- 将 Nacos 资源操作写入日志、审计系统或观测平台。
- 订阅 AI 资源生命周期事件，保留资源发布、上线、下线、删除等审计记录。

## 工作模型

Trace 插件实现 `NacosTraceSubscriber`。Nacos 启动时通过 SPI 加载订阅者，并按订阅者声明的事件类型分发事件。

| 概念 | 说明 |
|-----|------|
| `TraceEvent` | Trace 基础事件，包含事件类型、发生时间、命名空间、分组和资源名。 |
| 领域事件 | `TraceEvent` 的子类，例如 Naming 事件和 AI 资源事件。 |
| 订阅者 | 插件实现的事件消费者，只会收到自己订阅的事件类型。 |
| `executor()` | 可选执行器。返回非空值时，Nacos 使用该执行器调用 `onEvent()`。 |

:::note
Trace 插件属于观测扩展，不应拥有主业务决策权。插件失败不能影响 Nacos 核心数据变更和请求处理。
:::

## 当前事件类型

Naming 相关事件：

| 事件类 | Event type | 含义 |
|--------|------------|------|
| `RegisterInstanceTraceEvent` | `REGISTER_INSTANCE_TRACE_EVENT` | 实例注册。 |
| `BatchRegisterInstanceTraceEvent` | `BATCH_REGISTER_INSTANCE_TRACE_EVENT` | 批量实例注册。 |
| `DeregisterInstanceTraceEvent` | `DEREGISTER_INSTANCE_TRACE_EVENT` | 实例注销。 |
| `RegisterServiceTraceEvent` | `REGISTER_SERVICE_TRACE_EVENT` | 空服务创建。 |
| `DeregisterServiceTraceEvent` | `DEREGISTER_SERVICE_TRACE_EVENT` | 空服务删除。 |
| `UpdateInstanceTraceEvent` | `UPDATE_INSTANCE_TRACE_EVENT` | 实例元数据或状态更新。 |
| `UpdateServiceTraceEvent` | `UPDATE_SERVICE_TRACE_EVENT` | 服务元数据更新。 |
| `SubscribeServiceTraceEvent` | `SUBSCRIBE_SERVICE_TRACE_EVENT` | 服务订阅。 |
| `UnsubscribeServiceTraceEvent` | `UNSUBSCRIBE_SERVICE_TRACE_EVENT` | 取消服务订阅。 |
| `PushServiceTraceEvent` | `PUSH_SERVICE_TRACE_EVENT` | 向订阅者推送服务数据。 |
| `HealthStateChangeTraceEvent` | `HEALTH_STATE_CHANGE_TRACE_EVENT` | 实例健康状态变化。 |

AI 资源相关事件：

| 事件类 | Event type | 含义 |
|--------|------------|------|
| `AiResourceTraceEvent` | `AI_RESOURCE_TRACE_EVENT` | AI 资源生命周期操作，例如创建、评审、发布、上线、下线、删除、标签更新和 scope 更新。 |

`DeregisterInstanceTraceEvent` 会携带注销原因。常见值包括 `REQUEST`、`NATIVE_DISCONNECTED`、`SYNCED_DISCONNECTED` 和 `HEARTBEAT_EXPIRE`。

Nacos 默认提供了 AI 资源 Trace 日志订阅者，会将 `AiResourceTraceEvent` 写入 `ai-resource-trace.log`，用于兼容 AI 资源审计日志。

## 启用插件

将插件 JAR 放入 `${nacos.home}/plugins`，或加入 Nacos Server 启动 classpath。插件实现需要通过 `META-INF/services/com.alibaba.nacos.plugin.trace.spi.NacosTraceSubscriber` 声明。

启动后，可在 `${nacos.home}/logs/nacos.log` 中查看加载日志：

```text
[TracePluginManager] Load NacosTraceSubscriber(...) name(...) successfully.
```

Nacos 3.2 起，Trace 插件也会暴露给统一插件管理，插件类型为 `trace`。如果关闭了某个 Trace 插件，Nacos 不会再向该订阅者分发事件。

## 开发插件

插件依赖：

```xml
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-trace-plugin</artifactId>
    <version>${project.version}</version>
</dependency>
```

实现 `com.alibaba.nacos.plugin.trace.spi.NacosTraceSubscriber`：

| 方法 | 说明 |
|-----|------|
| `getName()` | 稳定订阅者名称。重复名称会被后加载的实现覆盖。 |
| `subscribeTypes()` | 返回希望订阅的事件类列表。 |
| `onEvent(event)` | 处理事件。 |
| `executor()` | 可选执行器。涉及慢 IO 时建议返回独立线程池。 |

最小示例：

```java
public class NamingAuditTraceSubscriber implements NacosTraceSubscriber {

    @Override
    public String getName() {
        return "naming-audit";
    }

    @Override
    public List<Class<? extends TraceEvent>> subscribeTypes() {
        return Collections.singletonList(RegisterInstanceTraceEvent.class);
    }

    @Override
    public void onEvent(TraceEvent event) {
        // Write audit log or send to an observability backend.
    }
}
```

## 降级和稳定性

Trace publisher 使用队列分发事件。队列压力过大时，Nacos 可以丢弃新的 Trace 事件以保护服务端稳定性。发生丢弃时，日志中会出现类似信息：

```text
Trace Event Publish failed, event : ..., publish queue size : ...
```

生产建议：

- 写远端系统、文件、数据库或消息队列时，使用独立 `Executor`。
- 为外部 sink 设置超时、限流和失败重试策略。
- 不要在 `onEvent()` 中修改 Nacos 资源。
- 不要把敏感信息写入 Trace 日志。
- 事件丢弃代表观测数据不完整，不代表 Nacos 主流程失败。

## 排查

| 现象 | 排查方向 |
|-----|---------|
| 插件没有收到事件 | 检查 JAR、`META-INF/services`、`getName()` 和 `subscribeTypes()`。 |
| 事件处理阻塞 | 检查是否在 `onEvent()` 中执行慢 IO，必要时实现 `executor()`。 |
| 日志出现 Trace Event Publish failed | 说明 Trace 队列压力过大，检查订阅者处理速度和外部 sink。 |
| 同名插件行为异常 | 检查是否有多个订阅者返回相同 `getName()`。 |
