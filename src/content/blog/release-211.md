---
title: Nacos 四周年，2.1.1 及 1.4.4 版本同时发布
keywords: [2.1.1, 1.4.4]
description: 为了庆祝 Nacos 开源四周年，我们同时推出 2.1.1 和 1.4.4 两个新版本，回馈小伙伴们的信任！
date: "2022-08-10"
category: release
---
# Nacos 四周年，2.1.1 及 1.4.4 版本同时发布

2022年7月， 为了庆祝 Nacos 开源四周年，我们同时推出 2.1.1 和 1.4.4 两个新版本，回馈小伙伴们的信任！

这四年，我们完成了 1.0，2.0 两个大版本演进，发布了46个版本，快速迭代，进入中国开源活跃项目TOP10！

这四年，我们完成了从Dubbo/Spring到服务网格生态的完整支持，生态繁荣，被4600+上下游项目依赖引用！

这四年，我们市场占有率提升到了 55% 以上，官网累计访问突破100万，《Nacos 架构与原理》 突破6w阅读！

这四年，我们吸引成千上万家数字化升级企业，打造虎牙、爱奇艺、好未来、掌门、小米、小鹏、蔚来等标杆！

这四年，我们吸引了246+ contributor，30+ committer，8+ PMC，分布各大头部厂商，发挥越来越大作用！

未来，我们将全面启动 Nacos 3.0 项目，统一控制面，加大生态集成，全面提升体验，尽情期待～

## 新版本发布

### 2.1.1 版本特性

该版本核心解决 Nacos 2.0 广泛使用暴露出的一些稳定性问题（包括默认实现鉴权插件、Grpc请求和distro一致性协议的性能等），另外Beta测试“批量注册服务”和“服务追踪事件”两个新功能。

具体变更内容可查看changeLog：
```
## Features
[#5863] (BETA) Support batch register service.
[#7424] Add version data compare in the history list.
[#8305] (REMOVE) Remove leave nacos server nodes API temporarily.
[#8481] (BETA) Add TRACE Event to server.
[#8755] Add default fuzzy search feature.

## Enhancement
[#8099] Fast failure for distro sync task and verify task if cluster disconnect.
[#8150] Add the namespace description item to the namespace list page.
[#8345] Add validation for service cluster name.
[#8515] Optimize some code in InetUtils.
[#8561] Enhance default authentication plugin performance.
[#8574] Enhance filter service info for push callback.
[#8592] Ehhance GrpcUtil memory and cpu cost.
[#8622] Add NacosEnvironment and add some unit tests.

## Refactor&dependency
[#8369] Remove mina dependency.
[#8383] Upgrade jackson version to 2.12.6.1.
[#8421] Remove commonOkHttp dependency.
[#8472] Remove useless dependency.
[#8479] Refactor singleton construction as private.
[#8540] Upgrade spring-boot version to 2.6.8.
[#8594] Makes distro data load timeout can be configured.
[#8596] Explicitly specify spring-boot-maven-plugin version same as spring-boot.
[#8623] Upgrade mysql-connector-java to 8.0.28.

## BugFix
[#7039] Fix config encryptedData md5 calculation problem.
[#8153] Fix NPE for AutoExpireCache.
[#8243][#8653] Fix health check plugin problem.
[#8275] Fix can't register service when use skywalking.
[#8295] Fix can't login when use embedded storage in cluster model.
[#8318] Fix findAllConfigInfoForDumpAll sql args error.
[#8372] Fix client can't use https connection.
[#8424] Fix cycle dependency problem.
[#8428] Fix naming subscribe bug when multiple NamingService.
[#8505] Fix log configuration conflict in spring-boot project.
[#8514][#8539] Fix prometheus api error in client.
[#8516] Fix the persistent instance becomes a temporary instance.
[#8602] Fix display error after delete current namespace.
[#8632] Fix subscribe disabled instance problem in the first time.
[#8635] Fix NPE when call the shutdown method.
[#8720] Fix the problem that config aspect invalid problem.
[#8742] Fix change instance metadata, the revision of service not change.
[#8784] Fix some bugs for Console UI.
[#8833] Fix import config failed when open auth.
[#8880] Fix constantly loading config when not read permission.
```
#### 批量注册服务 -- batchRegister

批量注册服务的需求主要来自于Nacos社区的另一个组件 -- Nacos-Sync，Nacos-Sync作为一个支持多注册中心迁移的第三方工具，一直帮助社区用户平滑的从Eureka，Consul等其他注册中心迁移到Nacos中。

在Nacos2.0发布后，Nacos-Sync第一时间进行了更新。但在更新后，由于Nacos2.0的注册机制发生了一定的变化，同一个客户端针对同一个服务只能注册一个实例，这导致了Nacos-Sync这种代理服务模式无法使用同一个客户端进行同一个服务的多个实例的代理注册，易用性大大降低。

同时社区发现，有一些特殊的应用，如网关，proxy，dubbo3多协议支持等，也需要一些代理注册的能力，因此社区在进行数次方案讨论后，最终由社区同学[chenhao26-nineteen](https://github.com/chenhao26-nineteen) 完成批量注册服务的功能开发，并在2.1.1版本进行beta测试。

批量注册服务功能主要用于代理注册的场景，允许应用使用同一个客户端对同一个服务进行多个实例的注册请求。大多数传统使用场景下，用户仍然使用registerService功能即可。

#### 服务追踪事件 -- trace event

自从阿里云的[MSE](https://www.aliyun.com/product/aliware/mse?spm=nacos-website.topbar.0.0.0) Nacos发布了关于[推送轨迹](https://developer.aliyun.com/article/982835?utm_content=m_1000348405)相关的文章后，社区反响热烈，都希望能在开源添加对应的功能。

[MSE](https://www.aliyun.com/product/aliware/mse?spm=nacos-website.topbar.0.0.0)团队得知社区的强烈需求后，由[scienceZ](https://github.com/scienceZ)同学完成对事件抽象剥离，并贡献到开源社区。

目前该功能同样属于beta测试，暂时只能通过在源码中订阅对应事件的方式进行追踪，后续版本同样会将该功能作为SPI插件的形式开放，方便社区同学按照自己的需求定制推送轨迹。

> 注意： 上述两个功能均属于Beta测试阶段，其API，功能可能与后续正式发布时的有一定区别。

### 1.4.4 版本特性

Nacos 1.X版本已经不再进行功能演进，只进行一些bugfix和优化，因此本次版本发布主要也是进行一些bug的修复和优化，并且将一些可能有问题的依赖进行升级；建议大家尽快升级到 Nacos 2.0，以便享受快速迭代红利！

具体变更内容可查看changeLog：
```
# Enhancement
[#5344] Reset raft cluster ops for no leader by JRaft Api.
[#5884][#7810] Add the permission for history config.
[#7284] Enhance print exception details.
[#7799] Enhance console exception handler.
[#7802] Enhance thread pool manager.
[#7801] Enhance connection release timeout between server.
[#7803] Apply some Jraft Enhancement from 2.X.
[#7925] Client stops the UpdateTask after a service is unsubscribed.
[#8072] Reduce memory cost in DistroProtocol initialization to avoid OutOfMemoryError.
[#8144] Add volatile modifier to NamingProxy.serversFromEndpoint.
[#8203] Fix the concurrency problem about the iterator of ServerListManager.
[#8434] Enhance DistroConsistencyServiceImpl listen/unListen.

# BugFix
[#6198][#7809] Fix StringUtils.join throw NullPointerException.
[#6273] Fix loop leave server.
[#7141][#7804] Fix the problem of the operator column being empty while configuring adding and deleting records.
[#7750][#7869] Fix bug in permissions management module, such as redundant 'nacos,' when change password.
[#7757][#7761] Fix jraft request parse failed problem.
[#7807] Fix yaml parse concurrent problem.
[#7836] Fix nacos-client can't parse `localhost` problem.
[#8012] Fix NPE in DistroConsistencyServiceImpl.Notifier.
[#8283] Fix thread safety problem when concurrently registering with the same cluster.
[#8428] Fix naming subscribe bug when multiple NamingService .
[#8539] Fix prometheus api error.

# Dependency
[#7813] Upgrade log4j2 to 2.17.1.
[#7813] Upgrade logback to 1.2.9.
[#7813] Upgrade Jraft to 1.3.9.
[#8421] Remove commonOkHttp dependency.
[#8169] Upgrade spring-boot version to 2.6.6.
```

## About Nacos
Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及流量管理。

Nacos 帮助您更敏捷和容易地构建、交付和管理微服务平台。 Nacos 是构建以“服务”为中心的现代应用架构 (例如微服务范式、云原生范式) 的服务基础设施。

Nacos社区同时也开启了关于[Nacos3.0](https://mp.weixin.qq.com/s/8UwwD_WxSJINP8Qr_1wogg)的畅想和规划，欢迎社区积极参与到新版本的建设中。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1577777/1660125280551-a2e881fe-d25e-4ebb-a28f-8e56683deef1.png#clientId=uf10cb19a-105c-4&crop=0&crop=0&crop=1&crop=1&from=url&id=Z9to1&margin=%5Bobject%20Object%5D&name=image.png&originHeight=794&originWidth=1650&originalType=binary&ratio=1&rotation=0&showTitle=false&size=185821&status=done&style=none&taskId=u63849e10-1dae-45cb-b559-04d106ebe86&title=)

最后欢迎大家扫码加入Nacos社区群
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1577777/1660125280778-c1822fb0-958b-4730-a6dc-0e92ba22f3f8.png#clientId=uf10cb19a-105c-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=374&id=u2619495f&margin=%5Bobject%20Object%5D&name=image.png&originHeight=923&originWidth=765&originalType=binary&ratio=1&rotation=0&showTitle=false&size=338166&status=done&style=none&taskId=u0690e9a0-6d58-4f72-82b1-7d4457a900e&title=&width=310)
