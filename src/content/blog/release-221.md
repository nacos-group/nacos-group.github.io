---
title: Nacos 多个新版本发布，rust-sdk完全适配完成
keywords: [2.2.1, Go 2.2.0, Rust 0.2.3]
description: Nacos 多个新版本发布，rust-sdk完全适配完成
date: "2023-03-20"
category: release
---
# Nacos 多个新版本发布，rust-sdk完全适配完成

Nacos社区新年后好事不断，先是年初在电子标准院2022年度开源成熟度评估中被评为`优秀贰级`，同时获得了`CSDN年度开发者影响力项目`和`InfoQ 十大开源新锐项目`；随后又发布了许多新版本，其中包括Nacos 2.2.1、 1.4.5、rust-sdk 0.2.3 以及 go-sdk 2.2.0版本；在同学们的积极参与下，社区也是又增加了3位新的Committer。

## 新版本发布
### Nacos 2.2.1

Nacos 2.2.1版本主要针对Nacos社区于12月发布的2.2.0版本进行了一系列的升级以及修复，例如通过[logback-adapter](https://github.com/nacos-group/logback-adapter)适配了新版本的logback、升级了grpc、jraft等依赖，从而升级了对应的netty和rocksdb版本，解决旧版本netty的安全漏洞和rocksdb对于ARM64、M1芯片架构的直接支持。
功能方面，新增一个Beta功能，支持Grpc的TLS功能，用户可在服务端和客户端分别加载CA文件，保证传输过程中的数据进行加密。

在客户端层面，新增了服务发现模块对Aliyun STS鉴权模式的支持，以及对GraalVM的支持。

插件方面，为多数据源插件添加了打印SQL的功能，方面插件开发者或使用者获得插件所生成的SQL，减少排查问题的时间；
同时对默认鉴权插件进行了一定重构，移除了对`jjwt`的依赖同时提升性能、移除`token.secret.key`、`nacos.core.auth.server.identity.key` 和 `nacos.core.auth.server.identity.value`的默认值并提醒用户配置自定义的`token.secret.key`、`nacos.core.auth.server.identity.key` 和 `nacos.core.auth.server.identity.value`以提高安全性，具体情况请查看[风险公告](https://nacos.io/blog/announcement-token-secret-key/)。

易用性方面，新增通过配置内容检索配置的功能，但该功能**会损耗大量性能**，因此从内部进行了限流，也请用户尽量避免使用。

2.2.1 版本更多具体变更内容可参考变更日志：

```markdown
## feature
[#9276] Add search config by content.
[#9703] add catalog v2 API to support list instances which is un-enabled.
[#9710] Support prometheus-sd basic auth.
[#9888] Beta support Grpc TLS feature.
[#10062] Naming support aliyun STS auth.

## Enhancement&Refactor
[#9510] Add sql log print function.
[#9646] Replace concatenated strings with placeholders.
[#9708] Clean expired and invalid connections for HTTP client.
[#9783] Handle public namespaceId as default namespaceId for publish and query config for V2 http api.
[#9837] Enhance Grpc connected time when cluster started to load snapshot quickly.
[#9859] Refactor default auth plugin, use custom JWT instead of jjwt.
[#9860] Adapt logback 1.4.5 by SPI.
[#9885] Add prometheus api exception handling.
[#9949] Use Grpc replace all Http request between servers.
[#9951] Judge the message whether `null` for metadata processor.
[#10084] Client use Async appender to print log.

## BugFix
[#9621] Fix Config Client server check always up problem.
[#9728] Fix prometheus http sd only return public namespace problem.
[#9732] Fix namespace v2 api auth not work problem.
[#9734] Fix http login url without default port problem.
[#9795] Fix export config failure problem for non admin user after opening auth.
[#9816] Fix redo data is different from server when register and unregister service with concurrency.
[#9819] Fix update password failure problem after use nginx.
[#9825] Fix config histroy page paged problem.
[#9861] Fix auth check before distro filter.
[#9862] Fix LDAP login failed.
[#9943] Fix Config cas update can't work when using derby database.
[#10014] Clear confused logic about namespace properties.
[#10038] Fix load failover file failure.

## Dependency
[#9504][#9767] Upgeade-spring-boot version to 2.6.14.
[#9789] Upgrade jraft version to 1.3.12.
[#9772] Upgrade Grpc version to 1.50.2.
[#9985] Replace flatten-maven-plugin with easyj-maven-plugin.
[#10091] Upgrade snakeYaml to 2.0.
```
### Nacos 1.4.5

Nacos 1.4.5版本基于1.4.4版本，将部分合并在2.X的问题和优化，同步到最新的1.X版本中，具体内容可查看变更日志：

```markdown
# Enhancement
[#9064] Enhance error message and error code by merging #9045 and #8881 into v1.x.
[#10089] Enhance STS auth for naming and async client log into v1.x.

# BugFix
[#3720] Fix not admin user can change others password by api.
[#8979] Fix some ui problem by merging #8787、#8156 and #7364 into the v1.
[#9020] Fix startup failed without prefix CUSTOM_SEARCH_LOCATIONS.

# Dependency
[#8541] Upgrade spring-boot version to 2.6.8.
```

### Nacos-Rust-SDK 0.2.3

Nacos-Rust-SDK 在年前已经完成了对配置中心的功能适配， 经过社区同学的积极贡献，[Nacos-Rust-SDK 0.2.3](https://github.com/nacos-group/nacos-sdk-rust/releases/tag/v0.2.3)版本终于完成了所有功能的适配，同时还能够绑定到nodejs中使用。欢迎正在使用rust的同学使用，并反馈意见。

```markdown
* enhance: add some debug log by @onewe
* chore: some logic optimization. by @CherishCai
* add some unit tests by @onewe
* chore: Optimize and Unified code.
* ci: fix codecov tarpaulin with 0.22.0
* chore: try exclude tls openssl by @CherishCai
* [ISSUES #100] Change: naming api register_instance/select_instances by @onewe
* doc: link to nacos-sdk-rust-binding-node by @CherishCai
* [ISSUES #102] fix naming changed service log by @onewe
* [ISSUES #101]  env cq count decrease to 1 by @onewe
* [ISSUES #107] Add asynchronous api by @onewe
* chore: upgrade version to 0.2.3 by @CherishCai
```

### Nacos-Go-SDK 2.2.0

Nacos-Go-SDK 2.2.0 支持了批量注册服务的`batchRegister`接口，同时修复了一些旧版本bug，具体内容可查看变更日志：

```markdown
* config center support for disable local cache by @wangdongyun in #565
* support batch register by @binbin0325 in #573
* refine grpc_client by @binbin0325 in #574
* fix MaxInt64 overflows on ARM 32-bits by @bavelee in #575
* fix panic for rpc errorResponse by @binbin0325 in #577
* fix QueryInstancesOfService clusters by @binbin0325 in #578
```

## 展望
### 2.X 后续计划
从2021年3月 2.0.0正式版发布至今，2.X版本已经走了接近2年时间，如今2.2.1版本发布，说明2.X版本已经逐渐成熟稳定，在2.X的后续计划中，除了鼓励社区中提供和完善已有的插件多种实现以外，依旧会为其易用性和扩展性进一步增强，添加更多的插件功能：

- 寻址插件
- 配置变更钩子插件

### 3.0 计划
Nacos社区同时也开启了关于[Nacos3.0](https://mp.weixin.qq.com/s/8UwwD_WxSJINP8Qr_1wogg)的畅想和规划，Nacos将会从统一控制面、支持国产化、存储计算分离等方向进一步演进Nacos的功能和架构，欢迎社区积极参与到新版本的建设中。

![image.png](/img/blog/2_2_0-release/220-roadmap.png)
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1577777/1660125280551-a2e881fe-d25e-4ebb-a28f-8e56683deef1.png#clientId=uf10cb19a-105c-4&crop=0&crop=0&crop=1&crop=1&from=url&id=Z9to1&margin=%5Bobject%20Object%5D&name=image.png&originHeight=794&originWidth=1650&originalType=binary&ratio=1&rotation=0&showTitle=false&size=185821&status=done&style=none&taskId=u63849e10-1dae-45cb-b559-04d106ebe86&title=#crop=0&crop=0&crop=1&crop=1&id=rUihF&originHeight=794&originWidth=1650&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

## About Nacos
Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及流量管理。

Nacos 帮助您更敏捷和容易地构建、交付和管理微服务平台。 Nacos 是构建以“服务”为中心的现代应用架构 (例如微服务范式、云原生范式) 的服务基础设施。

最后欢迎大家扫码加入Nacos社区群

![image.png](https://cdn.nlark.com/yuque/0/2023/png/1577777/1679276899363-83081d59-67c6-4501-9cf8-0d84ba7c6d7e.png#averageHue=%23c1c2c2&clientId=u9dfeac18-3281-4&from=paste&height=551&id=ubcf45e51&name=image.png&originHeight=1102&originWidth=854&originalType=binary&ratio=2&rotation=0&showTitle=false&size=155261&status=done&style=none&taskId=ud6bea1fe-b003-441b-a810-84435d2aeff&title=&width=427)
