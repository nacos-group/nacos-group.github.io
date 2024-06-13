---
title: 2.4.0-BETA发布，欢迎试用
keywords: [2.4.0, BETA]
description: 2.4.0-BETA发布，欢迎试用
date: "2024-06-13"
category: release
---
# 2.4.0-BETA发布，欢迎试用

## 2.4.0-BETA发布

经过社区的大量贡献，Nacos 2.4.0版本终于进入的Beta发布阶段，这个版本支持许多新功能：

其他主要功能包括支持Nacos集群节点之间的TLS Grpc通信作为可选功能，以提高Nacos的安全性，这意味着Nacos不仅支持客户端和服务器之间的TLS通信。

此外，Nacos开始支持用户在注册中心模块中在回调订阅者之前扩展选择器，不仅可以通过健康和集群选择服务实例。Nacos客户端支持通过新事件回调服务差异，以减少订阅者缓存和比较逻辑。

第三个主要功能是在Nacos控制台中支持一些配置的使用，并为插件提供更多增强使用，例如支持将所有元数据添加到Prometheus SD协议和支持阿里云RAM V4签名。

除了大量功能更新外，这个版本还修复了一些以前版本中的bug，并升级了部分存在安全漏洞的依赖项。

### Nacos 移除默认密码

此次版本最主要的功能是Nacos支持维护者初始化admin用户`nacos`的密码，而不是使用默认密码，以提高部署Nacos集群的默认安全性。首次部署Nacos集群时，Nacos引擎不会再带有默认的用户名密码`nacos/nacos`，而是需要在开启鉴权后，通过API或Nacos控制台进行`nacos`用户的密码初始化操作，具体可以参考[文档](../docs/next/manual/admin/auth/#31-设置管理员密码)。

对旧版本升级到此版本的用户不受影响，可以使用之前版本中设置的`nacos`用户的密码进行访问，但仍然建议无论是否升级新版本，都修改`nacos`。

### Nacos集群节点之间的TLS Grpc通信

此次版本同样支持了，Nacos集群节点之间的TLS Grpc通信作为可选功能，以提高Nacos的安全性，这意味着Nacos不仅支持客户端和服务器之间的TLS通信。

### 注册中心数据选择器及服务变更差异事件

此次版本开始支持用户在注册中心模块中在回调订阅者之前扩展选择器，不仅可以通过健康和集群选择服务实例。Nacos客户端支持通过新事件回调服务差异，以减少订阅者缓存和比较逻辑。

具体可以参考文档[监听服务变化的差值](../docs/next/manual/user/java-sdk/usage/#监听服务变化的差值)和[带选择器的监听服务](../docs/next/manual/user/java-sdk/usage/#410-带选择器的监听服务)。

### 其他改动

除了上述改动，Nacos2.4.0版本还支持了：将所有元数据添加到Prometheus SD协议、支持阿里云RAM V4签名、配置中心控制台的使用优化、修复大量bug及升级部分依赖以修复安全漏洞等，具体的变更内容请参考：

```markdown
## Feature
[#10374] Support naming custom selectors and support service diff events.
[#11456] Support TLS Grpc communication between Nacos cluster nodes.
[#11847] Nacos console support publish config with cas.
[#11943] Record users for import configs.
[#11957] Remove default password for user `nacos`.
[#12130] Add metadata as labels in prometheus http sd.
[#12162] Support aliyun ram v4 signature method.

## Enhancement&Refactor
[#11956] Refactor nacos client logging module, use SPI load current logger adapter.
[#12013] Enhance to fast config Nacos memory setting in startup.sh by environment CUSTOM_NACOS_MEMORY.
[#12072] Support does not impose any limit when totalCountLimit is less than 0.
[#12166] Enhance nacos client init properties logger.
[#12177] Update console header link to new nacos.io.

## BugFix
[#10639] Fix the `encrypted_data_key` is text type so that old version can't upgrade directly.
[#11902] Fix leak of request and response for java native runtime for nacos-client.
[#11926] Fix Nacos can't triggle self protection when disk full in some OS.
[#11951] Fix the problem that the serviceName and groupName are not resolved correctly when deleting an empty service instance.
[#11967] Fix Config can't publish and listen when dataId contains some special words in Window OS.
[#11968] Fix Multiple config change plugin implementation configuration conflicts problem.
[#12022] Fix nacos datasource plugin ClassCastException problem.
[#12060] Fix too large ttl when auth disabled.
[#12146] Fix the operation type does not display when rolling back a configuration with a delete operation type.
[#12168] Fix the labels of the query conditions on the Permission Control - Role Management page are still displayed in Chinese after switching the system language to English.

## Dependency
[#11904] Bump Spring Security to 5.7.12.
[#11975] Remove unused dependency javatuple.
[#11980] Bump spring framework to 5.3.34.
[#12135] Upgrade module naocs-console from junit4 to junit5.
```

## Nacos Go SDK 2.2.6发布

Nacos Go SDK 2.2.6版本 主要对旧版本存在的许多BUG进行修复，同时支持TLS的gRPC请求，欢迎升级新版本使用，具体变更如下:

```markdown
* [FIX #716] fix the monitor in naming_grpc_proxy. by @brotherlu-xcq in https://github.com/nacos-group/nacos-sdk-go/pull/717
* fix too many logger fault  by @Kuri-su in https://github.com/nacos-group/nacos-sdk-go/pull/722
* nacos-go-sdk support grpc tls by @shiyiyue1102 in https://github.com/nacos-group/nacos-sdk-go/pull/746
* Bump golang.org/x/net from 0.17.0 to 0.23.0 by @dependabot in https://github.com/nacos-group/nacos-sdk-go/pull/748
* 🐞 fix:Adjust lock order to address concurrency issue by @XiaoK29 in https://github.com/nacos-group/nacos-sdk-go/pull/740
* fix panic when server push request has request headers. by @brotherlu-xcq in https://github.com/nacos-group/nacos-sdk-go/pull/739
* Fix unit test failed of logger package. by @wangjian-pg in https://github.com/nacos-group/nacos-sdk-go/pull/734
* support app connection labels by @shiyiyue1102 in https://github.com/nacos-group/nacos-sdk-go/pull/754
* Bump google.golang.org/protobuf from 1.30.0 to 1.33.0 by @dependabot in https://github.com/nacos-group/nacos-sdk-go/pull/732
* fix: auth login failed in address mode. (#728) by @xiaomiusa87 in https://github.com/nacos-group/nacos-sdk-go/pull/730
* grpc add log by @binbin0325 in https://github.com/nacos-group/nacos-sdk-go/pull/757
* refine redo subscribe by @binbin0325 in https://github.com/nacos-group/nacos-sdk-go/pull/758
```

## 展望
### 2.X 后续计划

从2021年3月 2.0.0正式版发布至今，2.X版本已经走了接近2年时间，如今2.4.0版本发布，针对默认密码等安全问题和其他强烈诉求进行优化和支持，在之后的2.4.X版本中，会主要对当前版本的问题进行修复，并做出小范围的功能优化。同时对于2.5.0版本，会作为一个Nacos3.0的过度版本，对大量代码进行优化重构，在提升稳定性、健壮性的同时，提升易用性和可观测性，向Nacos3.0版本平稳过度。

### 3.0 计划

Nacos社区同时也开启了关于[Nacos3.0](https://mp.weixin.qq.com/s/8UwwD_WxSJINP8Qr_1wogg) 的畅想和规划，Nacos将会从统一控制面、支持国产化、存储计算分离等方向进一步演进Nacos的功能和架构，欢迎社区积极参与到新版本的建设中。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/1577777/1698198629123-af9f1216-f996-4ac2-81bf-436048823d21.png)

![image.png](https://cdn.nlark.com/yuque/0/2022/png/1577777/1660125280551-a2e881fe-d25e-4ebb-a28f-8e56683deef1.png#clientId=uf10cb19a-105c-4&crop=0&crop=0&crop=1&crop=1&from=url&id=Z9to1&margin=%5Bobject%20Object%5D&name=image.png&originHeight=794&originWidth=1650&originalType=binary&ratio=1&rotation=0&showTitle=false&size=185821&status=done&style=none&taskId=u63849e10-1dae-45cb-b559-04d106ebe86&title=#crop=0&crop=0&crop=1&crop=1&id=rUihF&originHeight=794&originWidth=1650&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

## About Nacos

Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及流量管理。

Nacos 帮助您更敏捷和容易地构建、交付和管理微服务平台。 Nacos 是构建以“服务”为中心的现代应用架构 (例如微服务范式、云原生范式) 的服务基础设施。

最后欢迎大家扫码加入Nacos社区群

![image.png](https://cdn.nlark.com/yuque/0/2023/png/1577777/1679276899363-83081d59-67c6-4501-9cf8-0d84ba7c6d7e.png#averageHue=%23c1c2c2&clientId=u9dfeac18-3281-4&from=paste&height=551&id=ubcf45e51&name=image.png&originHeight=1102&originWidth=854&originalType=binary&ratio=2&rotation=0&showTitle=false&size=155261&status=done&style=none&taskId=ud6bea1fe-b003-441b-a810-84435d2aeff&title=&width=427)

