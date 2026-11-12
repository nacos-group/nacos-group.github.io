---
title: Tracing
keywords: [Tracing, audit, diagnostics, Trace Plugin]
description: Learn the Nacos Trace plugin event model, use cases, development interface, and stability guidance.
sidebar:
    order: 10
---

# Tracing Plugin

The Nacos Trace plugin subscribes to internal Nacos resource operation events for audit, troubleshooting, and diagnostics. It records Nacos domain events such as service registration, service push, instance health changes, and AI resource operations.

It is not distributed tracing between application services. If you need request spans across business services, use OpenTelemetry, SkyWalking, Zipkin, or another distributed tracing system.

In unified plugin management, the type is `trace`, its execution mode is `BROADCAST`, its load phase is `STANDARD`, and the type is non-critical. A plugin identity is `trace:{getName()}`. The same event can be broadcast to multiple enabled subscribers; state is checked before every dispatch without rebuilding subscriptions.

## Use Cases

- Record Naming events such as service registration, deregistration, subscription, and push.
- Record instance health change reasons to troubleshoot unstable instances.
- Send Nacos resource operation events to logs, audit systems, or observability backends.
- Subscribe to AI resource lifecycle events for audit records of publish, online/offline, delete, and similar operations.

## Event Model

A Trace plugin implements `NacosTraceSubscriber`. During startup, Nacos loads subscribers through SPI and dispatches only the event types declared by each subscriber.

| Concept | Description |
|---------|-------------|
| `TraceEvent` | Base trace event. It contains event type, event time, namespace, group, and resource name. |
| Domain event | A subclass of `TraceEvent`, such as Naming events and AI resource events. |
| Subscriber | Plugin-provided event consumer. It receives only the event classes it subscribes to. |
| `executor()` | Optional executor. If non-null, Nacos uses it to call `onEvent()`. |

:::note
Trace plugins are observability extensions. They should not own main business decisions. Plugin failures must not break core Nacos data changes or request handling.
:::

## Current Events

Naming events:

| Event class | Event type | Meaning |
|-------------|------------|---------|
| `RegisterInstanceTraceEvent` | `REGISTER_INSTANCE_TRACE_EVENT` | Instance registration. |
| `BatchRegisterInstanceTraceEvent` | `BATCH_REGISTER_INSTANCE_TRACE_EVENT` | Batch instance registration. |
| `DeregisterInstanceTraceEvent` | `DEREGISTER_INSTANCE_TRACE_EVENT` | Instance deregistration. |
| `RegisterServiceTraceEvent` | `REGISTER_SERVICE_TRACE_EVENT` | Empty service creation. |
| `DeregisterServiceTraceEvent` | `DEREGISTER_SERVICE_TRACE_EVENT` | Empty service deletion. |
| `UpdateInstanceTraceEvent` | `UPDATE_INSTANCE_TRACE_EVENT` | Instance metadata or state update. |
| `UpdateServiceTraceEvent` | `UPDATE_SERVICE_TRACE_EVENT` | Service metadata update. |
| `SubscribeServiceTraceEvent` | `SUBSCRIBE_SERVICE_TRACE_EVENT` | Service subscription. |
| `UnsubscribeServiceTraceEvent` | `UNSUBSCRIBE_SERVICE_TRACE_EVENT` | Service unsubscription. |
| `PushServiceTraceEvent` | `PUSH_SERVICE_TRACE_EVENT` | Push service data to subscribers. |
| `HealthStateChangeTraceEvent` | `HEALTH_STATE_CHANGE_TRACE_EVENT` | Instance health state change. |

AI resource events:

| Event class | Event type | Meaning |
|-------------|------------|---------|
| `AiResourceTraceEvent` | `AI_RESOURCE_TRACE_EVENT` | AI resource lifecycle operation, such as create, review, publish, online/offline, delete, tag update, and scope update. |

`DeregisterInstanceTraceEvent` carries a deregistration reason. Common values include `REQUEST`, `NATIVE_DISCONNECTED`, `SYNCED_DISCONNECTED`, and `HEARTBEAT_EXPIRE`.

Nacos provides `trace:ai-resource-trace-log`. It writes `AiResourceTraceEvent` records to `ai-resource-trace.log` for AI resource audit compatibility. The implementation is enabled by default, declares no configuration definitions, and is reported as `configurable=false`.

## Enable a Plugin

Put the plugin JAR under `${nacos.home}/plugins`, or add it to the Nacos Server startup classpath. The plugin implementation must be declared in `META-INF/services/com.alibaba.nacos.plugin.trace.spi.NacosTraceSubscriber`.

After startup, check `${nacos.home}/logs/nacos.log` for the loading log:

```text
[TracePluginManager] Load NacosTraceSubscriber(...) name(...) successfully.
```

Starting from Nacos 3.2, Trace plugins are also exposed to unified plugin management with plugin type `trace`. If a Trace plugin is disabled, Nacos no longer dispatches events to that subscriber.

## Develop a Plugin

Add the dependency:

```xml
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-trace-plugin</artifactId>
    <version>${project.version}</version>
</dependency>
```

Implement `com.alibaba.nacos.plugin.trace.spi.NacosTraceSubscriber`:

| Method | Description |
|--------|-------------|
| `getName()` | Stable subscriber name. Duplicate identities use first-wins; later discoveries are ignored with a WARN. |
| `subscribeTypes()` | Event classes this subscriber wants to receive. |
| `onEvent(event)` | Handle the event. |
| `executor()` | Optional executor. Return a dedicated executor for slow IO. |

`NacosTraceSubscriber` inherits `PluginConfigSpec`. A new implementation with private settings declares their metadata through definitions, uses canonical keys under `nacos.plugin.trace.{pluginName}.{itemKey}`, and implements `applyConfig` plus a current snapshot. An older binary subscriber without definitions still loads but is reported as not configurable.

Minimal example:

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

## Degradation and Stability

The Trace publisher dispatches events through a queue. Under pressure, Nacos may drop new Trace events to protect server stability. When this happens, logs contain a message similar to:

```text
Trace Event Publish failed, event : ..., publish queue size : ...
```

Production advice:

- Use an independent `Executor` when writing to remote systems, files, databases, or message queues.
- Configure timeouts, rate limits, and failure handling for external sinks.
- Do not modify Nacos resources inside `onEvent()`.
- Do not write sensitive information to Trace logs.
- Dropped Trace events mean observability data is incomplete. They do not mean the main Nacos flow failed.

## Troubleshooting

| Symptom | What to check |
|---------|---------------|
| Plugin receives no events | Check the JAR, `META-INF/services`, `getName()`, and `subscribeTypes()`. |
| Event handling blocks | Check whether `onEvent()` performs slow IO. Implement `executor()` if needed. |
| Logs contain Trace Event Publish failed | Trace queue pressure is high. Check subscriber processing speed and external sinks. |
| Same-name plugins behave unexpectedly | Check the WARN log; first-wins keeps the first discovered subscriber and ignores later ones. |
