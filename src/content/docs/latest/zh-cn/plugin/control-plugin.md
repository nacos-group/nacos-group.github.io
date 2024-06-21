---
title: 反脆弱
keywords: [反脆弱, Nacos, SPI, 连接数限制, TPS, 插件开发, 反脆弱规则, 监控点, ControlPoint, ControlRule]
description: Nacos 支持反脆弱插件，避免高压下的集群容量问题。
sidebar:
    order: 7
---

# 反脆弱插件

Nacos 从2.3.0版本开始，支持通过[SPI](https://docs.oracle.com/javase/tutorial/sound/SPI-intro.html)的方式注入反脆弱相关插件，并在`application.properties`配置文件中选择某一种插件实现作为实际反脆弱能力。本文档会详细介绍如何实现一个反脆弱插件和如何使其生效。

## 反脆弱插件中的概念

反脆弱是对访问服务端的**某种资源**的**频率和次数**达到一定程度时进行的限制访问的策略，用于保护服务端在高压情况下能快速拒绝请求，防止过多的资源访问导致服务端资源耗尽引起的大面积不可用；Nacos反脆弱插件，将信息主要抽象为`监控点`和`反脆弱规则`。

### 监控点（ControlPoint）

监控点对应的请求服务端时所占用的资源的映射，目前主要针对的是`连接(Connection)`以及`每秒请求数(TPS)`。

- 连接(Connection)监控点主要监控Nacos 服务端中使用Nacos2.X客户端的长连接数量以及使用Nacos1.X客户端的配置长轮询数量，两者独立监控。
- 每秒请求数(TPS)监控点主要是监控Nacos 服务端中各核心接口被访问的频率，同类型的操作接口会被视为相同的监控点，如注册服务的v1接口和v2接口，具体的每秒请求数(TPS)监控点可查看本文档下文[监控点名称](#1.1)。

### 反脆弱规则（ControlRule）

反脆弱规则是针对每个监控点而执行的不同的限制规则，具体又分为`连接数规则（ConnectionControlRule）`和`每秒请求数规则（TpsControlRule）`

`连接数规则（ConnectionControlRule）`主要包含如下内容：

|字段名|类型|描述|
|-----|-----|-----|
|countLimit|int|连接数总数限制，默认为-1，不限制|
|monitorIpList|Set&lt;String&gt;|trace监控的Ip列表，用于详细观察对应ip的连接做了哪些操作，添加后，对应ip的连接请求会被详细打印在remote-digest.log日志中|

`每秒请求数规则（TpsControlRule）`主要包含如下内容：

|字段名|类型|描述|
|-----|-----|-----|
|pointName|String|规则所对应的监控点名称|
|pointRule|RuleDetail|规则内容的具体细节|

其中`RuleDetail`又包含如下内容：

|字段名|类型|描述|
|-----|-----|-----|
|ruleName|String|规则的名称，区别于监控点名称，同一个监控点可以有多个规则名|
|maxCount|int|TPS总数限制，默认为-1，不限制|
|period|TimeUnit|规则生效的周期，即统计到秒级/分钟级等，默认`TimeUnit.SECONDS`秒级|
|monitorType|String|监控类型，取值为`monitor`或`intercept`，对应为监控模式（只统计和打印tps，即使触发规则也不拦截）和拦截模式|

## 插件开发

开发Nacos服务端反脆弱插件，首先需要依赖反脆弱插件的相关API

```xml
        <dependency>
            <groupId>com.alibaba.nacos</groupId>
            <artifactId>nacos-control-plugin</artifactId>
            <version>${project.version}</version>
        </dependency>
```

`${project.version}` 为您开发插件所对应的Nacos版本，`2.3.0`及以上。

随后继承`com.alibaba.nacos.plugin.control.connection.ConnectionControlManager`抽象类和`com.alibaba.nacos.plugin.control.tps.TpsControlManager`抽象类，实现缺失的方法；然后实现`com.alibaba.nacos.plugin.control.spi.ControlManagerBuilder` 接口，创建上述实现的两个抽象类；最后将您的实现添加到SPI的services当中。

`com.alibaba.nacos.plugin.control.connection.ConnectionControlManager`需要实现的方法如下：

|方法名|入参内容|返回内容|描述|
|-----|-----|-----|-----|
|applyConnectionLimitRule|ConnectionControlRule|void|应用新的连接数规则|
|check|ConnectionCheckRequest|ConnectionCheckResponse|判断是否命中连接数规则，如果ConnectionCheckResponse中的sucess为false，将会拒绝新连接的建立|

`com.alibaba.nacos.plugin.control.tps.TpsControlManager`需要实现的方法如下：

|方法名|入参内容|返回内容|描述|
|-----|-----|-----|-----|
|registerTpsPoint|String|void|注册TPS监控点，Nacos服务会在启动时向插件注册当前的TPS监控买点，入参为TPS监控点的名字，具体的监控点名称可查看本文档下文[监控点名称](#1.1)；插件需要在方法内，维护一个用于记录TPS和规则内容的`TpsBarrier`，详情查看[自定义TPS时间窗口](#1.2)。|
|applyTpsRule|String,TpsControlRule|void|应用新的TPS规则，根据TPS监控点名称关联及更新。|
|check|TpsCheckRequest|TpsCheckResponse|判断是否命中TPS规则，如果TpsCheckResponse中的sucess为false，将会拒绝新的请求。|

`com.alibaba.nacos.plugin.control.spi.ControlManagerBuilder` 需要实现的方法如下：

|方法名|入参内容|返回内容|描述|
|-----|-----|-----|-----|
|getName|void|String|插件的名称，和配置文件中指定的类型进行匹配，使用命中的的插件。|
|buildConnectionControlManager| void |ConnectionControlManager|创建插件对应的`ConnectionControlManager `实现，为null时会使用`no limit`实现。|
|buildTpsControlManager| void |TpsControlManager|创建插件对应的`TpsControlManager`实现，为null时会使用`no limit`实现。|

### 加载插件

插件开发完成后，需要打包成jar/zip，放置到nacos服务端的classpath中，如果您不知道如何修改classpath，请直接放置到`${nacos-server.path}/plugins`下

放置后，需要修改`${nacos-server.path}/conf/application.properties`中的以下配置

```properties
### 所启用的Nacos的反脆弱插件的名称，与com.alibaba.nacos.plugin.control.spi.ControlManagerBuilder 的getName 返回值对应
nacos.plugin.control.manager.type=${controlPluginName}
```

随后重启nacos集群，启动完成后，可以从`${nacos-server.path}/logs/plugin-control.log`中看到如下日志：

```text
Found control manager plugin of name=${controlPluginName}
Build connection control manager, class=${your plugin ConnectionControlManager class}
Build tps control manager, class=${your plugin TpsControlManager class}
```

## 使用Nacos自带的反脆弱插件

Nacos2.3.0版本起，自带一个简易的反脆弱插件实现，可以做到对Nacos服务端的连接数及指定接口TPS进行限制。

### 启用Nacos自带的反脆弱插件

需要修改`${nacos-server.path}/conf/application.properties`中的以下配置

```properties
nacos.plugin.control.manager.type=nacos
```

### 设置反脆弱规则

可通过创建和修改反脆弱规则文件的方式，修改和设置反脆弱规则，默认反脆弱插件的规则是通过json格式定义的；例如想要设置连接限制为100，可执行如下操作:

```shell
mkdir -p ${nacos.home}/data/connection/
echo '{"countLimit": 100}' > ${nacos.home}/data/connection/limitRule
```
随后重启Nacos节点即可。

又例如想要设置配置查询接口的TPS为100，可执行如下操作：

 ```shell
 mkdir -p ${nacos.home}/data/tps/
 # ConfigQuery 为配置查询接口的监控点名称（pointName)
 echo '{"pointName":"ConfigQuery","pointRule":{"maxCount":100,"monitorType":"intercept"}}' > ${nacos.home}/data/tps/ConfigQuery 
 ```
随后重启Nacos节点即可。

其他更多反脆弱规则，以及具体的反脆弱监控点名称，请查看下文[监控点名称](#1.1)。

### 反脆弱规则存储位置

Nacos自带的简易反脆弱插件实现，Nacos服务端会通过本地文件系统，存储和读取反脆弱规则，默认所在目录的为`${nacos.home}/data/connection`及`${nacos.home}/data/tps`中，如果想将规则文件更换目录存储，可以在`${nacos-server.path}/conf/application.properties`中修改以下配置:

```properties
nacos.plugin.control.rule.local.basedir=${expectedDir}
```

这样规则将会被存储在`${expectedDir}/data/connection`及`${expectedDir}/data/tps`中。

<h4 id="1.1"></h4>

## 当前支持的监控点名称

|监控点名称|对应内容|描述|起始版本|
|-----|-----|-----|-----|
|connection|节点总连接数|指定节点最大可支持连接数限制|2.3.0|
|ConfigPublish|配置发布接口TPS|指定节点最大可支持配置发布的TPS限制，同时包含了通过http访问和grpc访问的来源|2.3.0|
|ConfigQuery|配置查询接口TPS|指定节点最大可支持配置查询的TPS限制，同时包含了通过http访问和grpc访问的来源|2.3.0|
|ConfigRemove|配置移除接口TPS|指定节点最大可支持配置移除的TPS限制，同时包含了通过http访问和grpc访问的来源|2.3.0|
|ConfigListen|配置监听接口TPS|指定节点最大可支持配置监听的TPS限制，仅包含通过grpc访问的来源|2.3.0|
|RemoteNamingInstanceRegisterDeregister|服务实例注册及注销接口TPS|服务实例注册或注销的TPS限制，仅包含通过grpc访问的来源|2.3.0|
|RemoteNamingInstanceBatchRegister|服务实例批量注册接口TPS|服务实例批量注册的TPS限制，仅包含通过grpc访问的来源|2.3.0|
|RemoteNamingServiceListQuery|服务列表查询接口TPS|服务列表查询的TPS限制，仅包含通过grpc访问的来源|2.3.0|
|RemoteNamingServiceQuery|服务查询接口TPS|服务查询的TPS限制，仅包含通过grpc访问的来源|2.3.0|
|RemoteNamingServiceSubscribeUnSubscribe|服务订阅和取消订阅接口TPS|服务订阅和取消订阅的TPS限制，仅包含通过grpc访问的来源|2.3.0|
|NamingInstanceRegister|服务实例注册接口TPS|服务实例注册的TPS限制，仅包含通过http访问的来源|2.3.0|
|NamingInstanceDeregister|服务实例注销接口TPS|服务实例注销的TPS限制，仅包含通过http访问的来源|2.3.0|
|NamingInstanceUpdate|服务实例元数据更新接口TPS|服务实例更新的TPS限制，仅包含通过http访问的来源|2.3.0|
|NamingInstanceMetadataUpdate|服务实例元数据批量更新接口TPS|服务实例元数据批量更新的TPS限制，仅包含通过http访问的来源|2.3.0|
|NamingServiceSubscribe|服务实例查询及订阅接口TPS|服务订阅及查询的TPS限制，仅包含通过http访问的来源|2.3.0|
|NamingInstanceQuery|单个服务实例查询接口TPS|单个服务实例查询的TPS限制，仅包含通过http访问的来源|2.3.0|
|HttpHealthCheck|服务实例心跳续约接口TPS|服务实例心跳续约的TPS限制，仅包含通过http访问的来源|2.3.0|
|NamingServiceRegister|服务创建接口TPS|服务创建的TPS限制，与`NamingInstanceRegister`不同，此监控点表示的是创建空服务接口所对应的TPS，仅包含通过http访问的来源|2.3.0|
|NamingServiceDeregister|服务删除接口TPS|服务删除的TPS限制，与`NamingInstanceDeregister `不同，此监控点表示的是删除服务接口所对应的TPS，仅包含通过http访问的来源|2.3.0|
|NamingServiceQuery|服务查询接口TPS|服务查询的TPS限制，与`NamingInstanceQuery `不同，此监控点表示的是查询服务信息接口所对应的TPS，仅包含通过http访问的来源|2.3.0|
|NamingServiceListQuery|服务列表查询接口TPS|服务列表查询的TPS限制，与`NamingServiceSubscribe `不同，此监控点表示的是服务列表查询接口所对应的TPS，仅包含通过http访问的来源|2.3.0|
|NamingServiceUpdate|服务元数据更新接口TPS|服务元数据更新的TPS限制，与`NamingInstanceUpdate `不同，此监控点表示的是服务元数据更新接口所对应的TPS，仅包含通过http访问的来源|2.3.0|

## 反脆弱插件进阶开发

Nacos反脆弱插件还支持一些进阶式的拓展，以满足对此方面有更高要求的开发者和用户。

### 反脆弱规则外部存储

Nacos反脆弱插件的默认情况下，仅支持通过本地文件系统来存储和修改单节点的反脆弱规则，对于一些集群规模较大或集群较多的用户，逐个节点进行调整会消耗大量时间和操作；同时本地文件系统在许多容器化环境中，存在磁盘挂载和持久化的问题。因此Nacos反脆弱插件允许增加一个可选的外部存储进行反脆弱规则的统一存储和下发，外部存储可有插件自行实现对接，例如`数据库`,`配置中心`等。

要实现反脆弱规则的外部存储，需要在开发插件时，实现`com.alibaba.nacos.plugin.control.spi.ExternalRuleStorageBuilder`接口，并随插件jar文件一起放置在`${nacos-server.path}/plugins`下。

放置后，需要修改`${nacos-server.path}/conf/application.properties`中的以下配置

```properties
nacos.plugin.control.rule.external.storage=${controlPluginName}
```

随后重启Nacos节点即可。

### 动态加载反脆弱规则

在自定义插件实现中，可以通过两种方式进行反脆弱规则的动态加载：

1. 调用`com.alibaba.nacos.plugin.control.ControlManagerCenter#reloadTpsControlRule`方法或`com.alibaba.nacos.plugin.control.ControlManagerCenter#reloadConnectionControlRule`方法。
2. 通过`NotifyCenter.publishEvent()`发布`ConnectionLimitRuleChangeEvent` 或`TpsControlRuleChangeEvent`事件。

### 反脆弱规则的自定义格式解析

Nacos 默认使用`Json`格式作为反脆弱规则的文本格式，插件开发者也可以使用其他的格式，如`Yaml`或其他自定义格式进行解析。

重写`com.alibaba.nacos.plugin.control.connection.ConnectionControlManager#buildConnectionControlRuleParser`及`com.alibaba.nacos.plugin.control.tps.TpsControlManager#buildTpsControlRuleParser`，实现自定义格式规则解析器`RuleParser`，Nacos将使用自定义的规则解析器`RuleParser`进行规则文本的解析。

同时，也可以解析成默认自定义规则的增强规则，配合自定义插件的定制逻辑实现更高程度的反脆弱控制。

<h4 id="1.2"></h4>

### 自定义TPS时间窗口

众所周知，在统计TPS时，存在时间窗口算法的区别，不同的时间窗口对TPS的统计结果会有较大的区别。

Nacos默认使用简单的同秒统计方式，即按照时钟的秒来进行统计。对于大多数场景来说是足够使用的，但对于一些精确度要求高的用户而言，可能需要使用滑动窗口等更精确的方式进行统计。

此时需要插件开发者，继承`com.alibaba.nacos.plugin.control.tps.barrier.TpsBarrier`和`com.alibaba.nacos.plugin.control.tps.barrier.RuleBarrier`，自定义实现TPS的时间窗口和统计方式。并重写`com.alibaba.nacos.plugin.control.tps.TpsControlManager#buildTpsBarrierCreator`，在初始化插件和动态加载反脆弱规则时，生成对应的自定义实现。