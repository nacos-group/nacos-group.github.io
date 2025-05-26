---
title: Tracing
keywords: [Track tracing, push tracing, modifying tracing]
description: Nacos supports Track tracing plugin, can help developers and maintainers find out problems quickly by extending plugin like push tracing.
sidebar:
    order: 5
---

# Track tracing plugin

Since version 2.2.0, Nacos support to inject track tracing plugins through [SPI](https://docs.oracle.com/javase/tutorial/sound/SPI-intro.html), to subscribe and process trace events in the plugin with the way you want (such as logging, writing to storage, etc.). 
This document will describe how to implement a track tracing plugin and how to make it work.

> Attention:
> At present, the track tracing plugin is still in the beta stage, and its API and interface definitions maybe modified with version upgrades. Please pay attention to the applicable version of your plugin.
> 
> The track tracing of Nacos is different from the tracking in general sense. It is mainly used to trace and record some Nacos related operations, such as service registration, de-registration, push, status change, etc. 
> It is not used to trace the access and request between micro-services. If you need to monitor the access and request between services, please use the corresponding tracing projects.

## Concepts in Track tracing Plugin

### TraceEvent

Nacos embeds points in the important operations, and defines a series of trace events named 'TraceEvent'. After combined multiple 'TraceEvent's for the same resource (such as services, configurations, etc.), the trace of the resource will be gotten.

The TraceEvent will include following:

|Field Name|Description|
|-----|---|
|type|Type of event, defined by sub-events|
|eventTime|Time of the event occurs|
|namespaceId|Corresponding resource namespace ID of the event|
|group| Corresponding resource group name of the event|
|name | Corresponding resource name of the event，such as service name or dataId for config|

Currently, the sub event types defined in Nacos include:

|Event Name|Description|Details|
|-----|---|---|
|RegisterInstanceTraceEvent|The event for service instance registration, mainly occurs when the service provider is registered|[Detail](#1.1)|
|DeregisterInstanceTraceEvent|The event for service instance de-registration, mainly occurs when the service provider is de-registered|[Detail](#1.2)|
|RegisterServiceTraceEvent|The event for service registration, different from `RegisterInstanceTraceEvent`, mainly occurs when create empty services|[Detail](#1.3)|
|DeregisterServiceTraceEvent|The event for service de-registration, different from `DeregisterInstanceTraceEvent`, mainly occurs when remove empty services|[Detail](#1.4)|
|SubscribeServiceTraceEvent|The event for service subscription, mainly occurs when the service is subscribed|[Detail](#1.5)|
|UnsubscribeServiceTraceEvent|The event for service unsubscription, mainly occurs when the service is unsubscribed|[Detail](#1.6)|
|PushServiceTraceEvent|The event for service pushing, mainly occurs when the service is pushed to subscribed|[Detail](#1.7)|
|HealthStateChangeTraceEvent|The event for service instance health state changing, mainly occurs when an instance's health state changes due to a heartbeat/health check|[Detail](#1.8)|

## Plugin Development

To develop a Nacos track tracing plugin, developer first need to depend on the relevant API of the track tracing plugin.

```xml
        <dependency>
            <groupId>com.alibaba.nacos</groupId>
            <artifactId>nacos-trace-plugin</artifactId>
            <version>${project.version}</version>
        </dependency>
```

`${project.version}` is the version of Nacos for your development plugin.

Then implement interface `com.alibaba.nacos.plugin.trace.spi.NacosTraceSubscriber`, and put your implementation into services of SPI.

The methods of interface in following:

|method name|parameters|returns|description|
|-----|-----|-----|---|
|getName|void|String|he name of the plugin. When the name is the same, the plugin loaded later will overwrite the plugin loaded first.|
|subscribeTypes|void|List<Class<? extends TraceEvent>>|The expected the event type of the subscription for this plugin. If returns an empty list, plugin will not subscribe any event.|
|onEvent|TraceEvent|void|The logic for handle events. The type of events will defined by `subscribeTypes`.|
|executor|void|Executor|When return not `null`, Nacos will use the `Executor` to call `onEvent`, otherwise use event distribution thread to call `onEvent`.|

> Attention:
> It is recommend that you use a dependent Executor for plugin implementations, such as blocked IO operations in plugin implementations, which will block onEvent called to other events when there are IO exceptions, causing backlogs.

In [nacos-group/nacos-plugin](https://github.com/nacos-group/nacos-plugin)，providing a demo implementation for track tracing plugin. This demo subscribes `RegisterInstanceTraceEvent` and `DeregisterInstanceTraceEvent` and print result information into logs.

## Degradation of Track Tracking Plugin

Because the Track Tracking Plugin is for the monitoring category, and will not affect Nacos data. So when the Track Tracking Plugin has problems, it should not affect the Nacos primary works.

It is recommend that you use a dependent Executor for plugin implementations, such as blocked IO operations in plugin implementations, which will block onEvent called to other events when there are IO exceptions, causing backlogs.

If the backlog occurs unfortunately, subsequent events will be automatically discarded when the event queue of the Track Tracking Plugin reaches the upper limit to ensure overall system stability.

You can see the words `Trace Event Publish failed, event : {}, publish queue size : {}` in `nacos.log` when the discard occurred

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
