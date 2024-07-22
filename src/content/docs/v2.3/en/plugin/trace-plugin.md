---
title: Trace Tracking
keywords: [Nacos, Trace Tracking, Push Tracking, Change Tracking, SPI mechanism, Plugin Development, Service Registration, Deregistration, Distributed Tracing, Beta Testing]
description: Nacos supports custom trace tracking plugins via the SPI mechanism, monitoring operations like service registration and deregistration to facilitate rapid issue localization by operations personnel. Plugins are based on an event model, including types like RegisterInstanceTraceEvent, making them easily extensible and customizable. Currently in Beta, users should be aware of potential API changes.
---
# Trace Tracking Plugin

Starting from version 2.2.0, Nacos allows injection of trace tracking implementation plugins through the [SPI](https://docs.oracle.com/javase/tutorial/sound/SPI-intro.html) mechanism. Plugins can subscribe and process tracing events, handling them according to desired methods (e.g., logging, storage). This document provides a comprehensive guide on implementing a trace tracking plugin and enabling its functionality.

> Note:
> The trace tracking plugin is currently in Beta testing; its APIs and interface definitions may undergo significant modifications in future updates. Please ensure compatibility with your plugin's target version.
>
> Unlike conventional distributed tracing, Nacos's trace tracking focuses on monitoring and recording operations related to Nacos, such as service registration, de-registration, pushes, and status changes, not inter-service communication paths. For monitoring service interactions, use dedicated distributed tracing solutions.

## Concepts in Trace Tracking Plugins

### Trace Event

Nacos embeds tracing points at critical operational stages, defining a series of trace events (`TraceEvent`). Linking multiple events targeting the same resource (e.g., services, configurations) forms a trace for that resource.

A `TraceEvent` includes:

|Field Name| Description|
|----------|------------|
|type| The type of event, defined by specific events|
|eventTime| Time of the event occurrence|
|namespaceId| Namespace ID of the event's corresponding resource|
|group| Group name of the event's corresponding resource|
|name| Resource name, such as a service name or configuration dataId|

Nacos has predefined sub-event types:

|Event Name| Description| Details|
|----------|------------|--------|
|RegisterInstanceTraceEvent| Service instance registration event, triggered when registering a service provider||
|DeregisterInstanceTraceEvent| Service instance deregistration event, triggered upon service provider deregistration||
|RegisterServiceTraceEvent| Service registration event, distinct from instance registration, occurs during service creation||
|DeregisterServiceTraceEvent| Service deregistration event, different from instance deregistration, happens when deleting a service||
|SubscribeServiceTraceEvent| Service subscription event, activated when subscribing to a service||
|UnsubscribeServiceTraceEvent| Service unsubscription event, triggered upon unsubscribing from a service||
|PushServiceTraceEvent| Service push event, occurs during service push||
|HealthStateChangeTraceEvent| Service instance health state change event, triggered when instance health changes due to heartbeats or health checks||

## Plugin Development

To develop a Nacos server-side trace tracking plugin, first, depend on the trace tracking plugin's API:

```xml
        <dependency>
            <groupId>com.alibaba.nacos</groupId>
            <artifactId>nacos-trace-plugin</artifactId>
            <version>${project.version}</version>
        </dependency>
```

Replace `${project.version}` with the Nacos version for which you're developing the plugin.

Next, implement the `com.alibaba.nacos.plugin.trace.spi.NacosTraceSubscriber` interface and register your implementation into SPI services.

The required methods include:

|Method Name| Input Content| Return Content| Description|
|-----------|--------------|---------------|------------|
|getName| void| String| The plugin's name; if names conflict, the latter loaded plugin will overwrite the former.|
|subscribeTypes| void| List<Class<? extends TraceEvent>>| The types of events this plugin subscribes to; returns an empty list for no subscriptions.|
|onEvent| TraceEvent| void| The logic for event handling; input event types are defined by `subscribeTypes`.|
|executor| void| Executor| If not `null`, the `onEvent` call uses this Executor; otherwise, it uses the event distribution thread.|

> Note:
> It is advised to use a dedicated Executor in plugin implementations to prevent blocking I/O operations in one plugin from delaying other events' processing.

A demo trace tracking plugin implementation is available in the [nacos-group/nacos-plugin](https://github.com/nacos-group/nacos-plugin) repository, subscribing to instance registration and deregistration events and logging them.

## Plugin Degradation Strategy

As a monitoring enhancement, trace tracking plugins do not impact Nacos data. Thus, when issues arise, the primary workflow should remain unaffected.

Hence, using a dedicated Executor is recommended. If there are blocking I/O operations in the plugin, I/O exceptions could stall other event `onEvent` calls, causing a backlog.

In case of a backlog, the trace tracking plugin's event queue automatically discards subsequent events once its capacity is reached, ensuring overall system stability. Log entries indicating dropped events will appear in `nacos.log`.

## Appendix: Sub-trace Event Details

<h3 id="1.1">RegisterInstanceTraceEvent</h3>

> Since 2.2.0.

type: `REGISTER_INSTANCE_TRACE_EVENT`

Extra Content:

|Field Name|Description|
|-----|---|
|clientIp|The source IP of registering service instance request, probably null.|
|rpc|Whether the source request is gRPC, `true` when request is gRPC, `false` is HTTP.|
|instanceIp|The IP or Host of service instance registered|
|instancePort|The Port of service instance registered|

<h3 id="1.2">DeregisterInstanceTraceEvent</h3>

> Since 2.2.0.

type: `DEREGISTER_INSTANCE_TRACE_EVENT`

Extra Content:

|Field Name|Description|
|-----|---|
|clientIp|The source IP of de-registering service instance request, probably null.|
|reason|The reason of de-registering, details see [DeregisterInstanceReason](#1.2.1)|
|rpc|Whether the source request is gRPC, `true` when request is gRPC, `false` is HTTP.|
|instanceIp|The IP or Host of service instance de-registered|
|instancePort|The Port of service instance de-registered|

<h4 id="1.2.1"> DeregisterInstanceReason </h4>

|Reason|Description|
|-----|---|
|REQUEST|De-registration comes from client requests, in other word, user initiated de-registration.|
|NATIVE_DISCONNECTED|De-registration comes from client disconnected|
|SYNCED_DISCONNECTED|De-registration comes from client disconnected in other server node, and synced from other server node.|
|HEARTBEAT_EXPIRE|De-registration comes from heartbeat timeout for 1.X version client.|

<h3 id="1.3">RegisterServiceTraceEvent</h3>

> Since 2.2.0.

type: `REGISTER_SERVICE_TRACE_EVENT`

Extra Content: None

<h3 id="1.4">DeregisterServiceTraceEvent</h3>

> Since 2.2.0.

type: `DEREGISTER_SERVICE_TRACE_EVENT`

Extra Content: None

<h3 id="1.5">SubscribeServiceTraceEvent</h3>

> Since 2.2.0.

type: `SUBSCRIBE_SERVICE_TRACE_EVENT`

Extra Content:

|Field Name|Description|
|-----|---|
|clientIp|The IP of subscriber|

<h3 id="1.6">UnsubscribeServiceTraceEvent</h3>

> Since 2.2.0.

type: `UNSUBSCRIBE_SERVICE_TRACE_EVENT`

Extra Content:

|Field Name|Description|
|-----|---|
|clientIp|The IP of subscriber|

<h3 id="1.7">PushServiceTraceEvent</h3>

> Since 2.2.0.

type: `PUSH_SERVICE_TRACE_EVENT`

Extra Content:

|Field Name|Description|
|-----|---|
|clientIp|The IP of subscriber|
|instanceSize|The size of service instance for this push|
|pushCostTimeForAll|The full cost for this push, means that the cost from start pushing to end pushing, including the wait time in combined queue and the time for executing.|
|pushCostTimeForNetWork|The network cost for this push, means that the cost from executing to end pushing, only including the network cost.|
|serviceLevelAgreementTime|The actual cost for this push, means the cost from services changeing to end pushing. It's a reference value not accuracy.|

<h3 id="1.8">HealthStateChangeTraceEvent</h3>

> Since 2.2.0.

type: `HEALTH_STATE_CHANGE_TRACE_EVENT`

Extra Content:

|Field Name|Description|
|-----|---|
|instanceIp|The IP or Host of service instance changed|
|instancePort|The Port of service instance changed|
|isHealthy|The change result is healthy or not|
|healthCheckType|The type of health check|
|healthStateChangeReason|The reason of healthy changed|
