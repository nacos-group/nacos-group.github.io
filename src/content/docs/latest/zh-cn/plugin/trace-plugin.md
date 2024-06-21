---
title: 轨迹追踪
keywords: [Nacos, 轨迹追踪, 推送轨迹, 变更轨迹, SPI机制, 插件开发, 服务注册, 注销, 链路追踪, Beta测试]
description: Nacos通过SPI机制支持自定义轨迹追踪插件，用于服务注册、注销等操作的监控，帮助运维快速定位问题。插件基于事件模型，如RegisterInstanceTraceEvent等，便于扩展和定制化处理。目前处于Beta阶段，需留意API变动。
sidebar:
    order: 5
---

# 轨迹追踪插件

Nacos从2.2.0版本开始，可通过[SPI](https://docs.oracle.com/javase/tutorial/sound/SPI-intro.html)机制注入轨迹追踪实现插件，在插件中订阅并处理追踪事件，并按照您期望的方式进行处理（如打日志，写入存储等）。本文档详细介绍一个轨迹追踪插件如何实现以及如何使其生效。

> 注意:
> 目前轨迹追踪插件处于Beta测试阶段,其API及接口方法定义可能会在后续版本升级而有较大修改，请注意您的插件适用版本。
>
> Nacos 的轨迹追踪不同于一般意义的链路追踪， 主要目的是追踪和记录一些Nacos的相关操作，如服务注册、注销、推送、状态变更等，并非追踪微服务间的相互访问链路，如需要监控追踪服务间的相互访问，请使用对应的链路追踪项目。

## 轨迹追踪插件中的概念

### 追踪事件 TraceEvent

Nacos 在关键操作的链路中进行了埋点，定义了一系列的追踪事件`TraceEvent`， 将多个针对相同资源（如服务，配置等）的追踪事件串起来之后，便得到了该资源的轨迹。

在追踪事件`TraceEvent`中，会包含如下内容：

|字段名|描述|
|-----|---|
|type|事件的类型，由具体事件定义|
|eventTime|事件发生的时间|
|namespaceId|事件对应资源的命名空间ID|
|group| 事件对应资源的分组名|
|name | 事件对应资源的资源名，如服务名或配置的dataId|

目前Nacos中已经定义的子追踪事件类型有：

|事件名|描述|详情|
|-----|---|---|
|RegisterInstanceTraceEvent|服务实例注册事件，主要发生于注册服务提供者时|[事件详情](#1.1)|
|DeregisterInstanceTraceEvent|服务实例注销事件，主要发生于注销服务提供者时|[事件详情](#1.2)|
|RegisterServiceTraceEvent|服务注册事件，不同于`服务实例注册事件`，主要发生于创建空服务时|[事件详情](#1.3)|
|DeregisterServiceTraceEvent|服务注销事件，不同于`服务实例注销事件`，主要发生于删除空服务时|[事件详情](#1.4)|
|SubscribeServiceTraceEvent|服务订阅事件，主要发生于订阅服务时|[事件详情](#1.5)|
|UnsubscribeServiceTraceEvent|取消服务订阅事件，主要发生于取消订阅服务时|[事件详情](#1.6)|
|PushServiceTraceEvent|服务推送事件，主要发生于发生服务推送时|[事件详情](#1.7)|
|HealthStateChangeTraceEvent|服务实例健康状态变更事件，主要发生于实例因心跳/健康检查而导致实例健康状态变化时|[事件详情](#1.8)|

## 插件开发

开发Nacos服务端轨迹追踪插件，首先需要依赖轨迹追踪插件的相关API

```xml
        <dependency>
            <groupId>com.alibaba.nacos</groupId>
            <artifactId>nacos-trace-plugin</artifactId>
            <version>${project.version}</version>
        </dependency>
```

`${project.version}` 为您开发插件所对应的Nacos版本

随后实现`com.alibaba.nacos.plugin.trace.spi.NacosTraceSubscriber`接口， 并将您的实现添加到SPI的services当中。

接口中需要实现的方法如下：

|方法名|入参内容|返回内容|描述|
|-----|-----|-----|---|
|getName|void|String|插件的名称，当名字相同时，后加载的插件会覆盖先加载的插件。|
|subscribeTypes|void|List<Class<? extends TraceEvent>>|该插件期望订阅的事件类型，返回空列表是不订阅。|
|onEvent|TraceEvent|void|处理事件的具体逻辑，输入的具体事件类型由`subscribeTypes`接口定义|
|executor|void|Executor|当返回不为`null`时，将使用该Executor进行`onEvent`调用，否则将使用事件分发线程进行调用|

> 注意:
> 建议插件实现时使用独立Executor，如插件实现中有存在阻塞的IO操作，当存在IO异常时将阻塞其他事件的onEvent调用，导致积压问题。

在[nacos-group/nacos-plugin](https://github.com/nacos-group/nacos-plugin)中，有一个demo的轨迹追踪插件实现，该demo插件订阅了注册及注销实例的事件，并打印到日志中。

## 轨迹追踪插件的降级

由于轨迹追踪插件增强监控类别的插件，不会对Nacos的数据造成影响，因此当轨迹追踪插件出现问题时，因尽量不影响Nacos主要链路。

因此建议插件实现时使用独立Executor，如插件实现中有存在阻塞的IO操作，当存在IO异常时将阻塞其他事件的onEvent调用，导致积压问题。

如果不幸发生积压，轨迹追踪插件的事件队列达到上限时，会自动丢弃后来的事件，以保证系统整体稳定性。

发生丢弃时能从`nacos.log`中看到`Trace Event Publish failed, event : {}, publish queue size : {}`字样。

## 附录：子追踪事件详情

<h3 id="1.1">服务实例注册事件 RegisterInstanceTraceEvent</h3>

> 2.2.0版本开始支持。

type: `REGISTER_INSTANCE_TRACE_EVENT`

额外内容：

|字段名|描述|
|-----|---|
|clientIp|注册服务实例请求的来源IP，可能为null|
|rpc|来源是否为gRPC，`true`时为gRPC注册，`false`时为HTTP注册|
|instanceIp|所注册实例的地址IP/HOST|
|instancePort|所注册实例的端口PORT|

<h3 id="1.2">服务实例注销事件 DeregisterInstanceTraceEvent</h3>

> 2.2.0版本开始支持。

type: `DEREGISTER_INSTANCE_TRACE_EVENT`

额外内容：

|字段名|描述|
|-----|---|
|clientIp|注销服务实例请求的来源IP，可能为null|
|reason|注销服务实例的原因，详情见[服务实例注销原因](#1.2.1)|
|rpc|来源是否为gRPC，`true`时为gRPC注册，`false`时为HTTP注册|
|instanceIp|所注销实例的地址IP/HOST|
|instancePort|所注销实例的端口PORT|

<h4 id="1.2.1"> 服务实例注销原因 DeregisterInstanceReason </h4>

|原因|描述|
|-----|---|
|REQUEST|注销来自于客户端请求，即由用户发起的注销|
|NATIVE_DISCONNECTED|注销来自于客户端链接断开|
|SYNCED_DISCONNECTED|注销来自于客户端链接断开，但该客户端链接是与集群其他的节点，断开后同步到本节点的|
|HEARTBEAT_EXPIRE|注销来自于客户端心跳请求超时，适用于1.X版本的客户端|

<h3 id="1.3">服务注册事件 RegisterServiceTraceEvent</h3>

> 2.2.0版本开始支持。

type: `REGISTER_SERVICE_TRACE_EVENT`

额外内容：无

<h3 id="1.4">服务注销事件 DeregisterServiceTraceEvent</h3>

> 2.2.0版本开始支持。

type: `DEREGISTER_SERVICE_TRACE_EVENT`

额外内容：无

<h3 id="1.5">服务订阅事件 SubscribeServiceTraceEvent</h3>

> 2.2.0版本开始支持。

type: `SUBSCRIBE_SERVICE_TRACE_EVENT`

额外内容：

|字段名|描述|
|-----|---|
|clientIp|订阅者IP|

<h3 id="1.6">取消服务订阅事件 UnsubscribeServiceTraceEvent</h3>

> 2.2.0版本开始支持。

type: `UNSUBSCRIBE_SERVICE_TRACE_EVENT`

额外内容：

|字段名|描述|
|-----|---|
|clientIp|订阅者IP|

<h3 id="1.7">服务推送事件 PushServiceTraceEvent</h3>

> 2.2.0版本开始支持。

type: `PUSH_SERVICE_TRACE_EVENT`

额外内容：

|字段名|描述|
|-----|---|
|clientIp|订阅者IP|
|instanceSize|本次推送的提供者数量|
|pushCostTimeForAll|本次推送总耗时，定义为开始发起推送到推送结束时的耗时，包含了在聚合队列中的等待时间以及执行推送的时间|
|pushCostTimeForNetWork|本次推送的网络耗时，定义为执行推送到推送结束的耗时，仅包含了网络耗时|
|serviceLevelAgreementTime|本次推送的实际生效耗时，定义为服务变更到推送结束时的耗时，粗略值|

<h3 id="1.8">服务实例健康状态变更事件 HealthStateChangeTraceEvent</h3>

> 2.2.0版本开始支持。

type: `HEALTH_STATE_CHANGE_TRACE_EVENT`

额外内容：

|字段名|描述|
|-----|---|
|instanceIp|实例的地址IP/HOST|
|instancePort|实例的端口PORT|
|isHealthy|变更结果是否为健康|
|healthCheckType|健康检查的类型|
|healthStateChangeReason|健康状态发生的原因|
