---
title: Nacos 2.1.2、2.2.0-BETA及go-sdk 2.1.1 版本同时发布，多语言生态再添大将
keywords: [2.1.2, 2.2.0-BETA, go-sdk, rust-sdk]
description: Nacos 2.1.2、2.2.0-BETA及go-sdk 2.1.1 版本同时发布，多语言生态再添大将。
date: "2022-10-28"
category: release
---

# Nacos 2.1.2、2.2.0-BETA及go-sdk 2.1.1 版本同时发布，多语言生态再添大将

距离2.1.1版本发布2个月后，Nacos社区又迎来一波大更新。本次发布包含了2个server版本，1个go-sdk版本以及新语言sdk的预告。

## Nacos 2.1.2

2.1.2 主要增强了控制台的UI效果，变更了控制台的样式，使得内容更加紧凑美观；

另外2.1.2对客户端大小进行了优化，大幅降低了客户端的jar包大小，同时还提供了纯净版java-client，方便没有依赖gRPC或希望使用非shaded版本客户端用户使用，可以到[Java SDK](https://nacos.io/docs/latest/guide/user/sdk/)中查看纯净版使用方式。

最后2.1.2修复了许多旧版本的问题，提高了稳定性。具体变更内容可参考变更日志：

```markdown
## Enhancement
[#6112] Unified derby-data variables.
[#7929] Reduce nacos-client jar size by minijar.
[#8941] Support Fuzzy Query in Authority Control--for api change.
[#8956] Internationalize product description content in nacos console.
[#8976] Create new namespace with duplicate namespace show name.
[#9091] build pure nacos-client when release.
[#9210] Naming Distro sync support revision.

## Refactor&dependency
[#8611] Close old datasource connection.
[#8650] Make cluster/report both receive and send metadata.
[#9013] refactor rpcClient and grpcClient to support set configuration.
[#9014] refactor TpsMonitorPoint.
[#9177] Upgrade org.yaml.snakeyaml version from 1.30 to 1.32
[#9325] Add switch for naming async query.

## BugFix
[#8882] Fix nacos-client 2.1.0 start error when using endpoint configuration.
[#8910] Fix calculate instance count error when using batch register.
[#8925] Fix the value of hasQueryString is always false.
[#8928] Fix the replaceAll operation is invalid for server list.
[#8931] Fix BatchInstanceData can't serialize problem.
[#8934] Fix header lost when request retrying.
[#8947] Fix the authentication/encryption plugin are not loaded on the nacos server.
[#9023] Fix corner case config dataId 'cipher-' can't be create.
[#9047] Fix ServerListMgr is not shutdown in nacos-client.
[#9060] Fix print logs for NamingTraceEvent continuously.
[#9062] Fix unsubscribe service failed problem.
[#9101] Fix the ConnectionTimeout property in the datasource connection is overwritten problem.
[#9227] Fix instance change event subscribe failed in 2.1.1 when no setting scope.
[#9230] Fix error event order for snapshot loading.
[#9269] Fix RpcClient parse ipv6 address error problem.
[#9271][#6876] Fix 'JraftServer' NPE after server exceptionally shutdown.
[#9277] Fix ClientServiceIndex not clean when service removed.
[#9305] Fix build resource with error dataId.
[#9311] Fix cache not removed when listener adding delay.
[#9323] Fix service checking problem in 1.x http openAPI.
```

## 2.2.0-BETA

2.2.0版本是2.X中一个较为重要的版本，它包含了一些较为重大的改动：

首先，2.2.0将会删除旧的冗余代码，即1.X模式服务发现和双写相关代码。删除后，2.2.0版本将无法从Nacos 1.X服务器升级，只能从至少2.0.0版本升级。此更改不会影响对1.X客户端请求的适配，用户仍然可以使用1.X客户端链接2.2.0版本服务端。

其次，2.2.0将会合并部分阿里巴巴编程之夏2022和开源之夏2022的课题结果，例如[V2版本的 openAPI](https://nacos.io/docs/v2/guide/user/open-api/) 和 [数据源插件](https://nacos.io/docs/v2/plugin/datasource-plugin/)。其他课题也将在未来版本中发布。

最后，2.2.0增强了在2.1.1版本被列为beta功能的`轨迹追踪插件`和`批量注册`，这使它们更易于使用。关于如何开发和使用`轨迹追踪插件`，可以参考[插件文档](https://nacos.io/docs/v2/plugin/trace-plugin/)进行开发。

由于这个版本中有许多重要的变化，所以社区计划做一个预发布的BETA版本。根据BETA测试的结果，下一个版本计划是BETA2或GA版本，欢迎广大用户积极[下载](https://github.com/alibaba/nacos/releases/tag/2.2.0-BETA)试用测试，帮助社区尽早发现问题。

> 注意：2.2.0-BETA是一个预发布的beta版本，可能存在一些问题，请尽量避免在生产环境中使用。

2.2.0-BETA版本具体变更内容可参考变更日志：

```markdown
## feature
[#5863][#9331] Support batch register and batch deregister service.
[#8308] Add v2 openAPI for nacos 2.0.
[#8312] Support datasource plugins.
[#8481] Support track tracing plugins.
[#9366] Support Ldaps authentication.

## Enhancement
[#7930] Reomve old redundant codes about 1.x naming.

## BugFix
[#9334] Fix group_id data length different in many tables.
[#9341] Fix can not create bean ldapAuthenticationProvider.
[#9351] Fix instance count error in prometheus metrics.

```

## 多语言SDK

### Go

Nacos [Go SDK v2.1.1](https://github.com/nacos-group/nacos-sdk-go/releases/tag/v2.1.1) 版本也在近期发布了正式版本，在v2.1.0带来大量新特性和改进的基础上，进一步加强了使用的稳定性，欢迎大家升级使用。

### Rust

Rust语言是最近非常如火如荼的新编程语言生态，Nacos社区的小伙伴第一时间加入了对rust生态的建设，目前[nacos-rust-sdk](https://github.com/nacos-group/nacos-sdk-rust)已完成基础的功能建设工作，同时实现了配置中心的核心功能，已发布v0.1.1版本供社区试用。

随着社区小伙伴的逐渐完善和更多愿意贡献的贡献者加入，[nacos-rust-sdk](https://github.com/nacos-group/nacos-sdk-rust)很快也能够支持注册中心的功能，发布1.0的正式版本，这里也欢迎更多对rust有兴趣，希望找个项目练手的小伙伴加入一起建设nacos-rust-sdk。

### PHP

PHP语言作为老牌服务端编程语言，以往有不少用户询问关于PHP客户端的问题；虽然社区中有很多根据openAPI自行开发的PHP客户端，但一直没有功能较全的版本和愿意持续维护捐献的PHP客户端实现，导致社区中一直没有属于nacos-group的PHP客户端。

今年由[huangwh2014](https://github.com/huangwh2014)贡献到社区的PHP客户端终于能够让PHP的项目能够接入Nacos，享受Nacos所带来的各种功能。

由于该版本的[PHP客户端](https://github.com/nacos-group/nacos-sdk-php)仍然是基于openAPI进行开发的，因此不具备gRPC的能力，希望社区的各位小伙伴积极参与项目，早日让PHP客户端进入2.X的时代。

## About Nacos

Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及流量管理。

Nacos 帮助您更敏捷和容易地构建、交付和管理微服务平台。 Nacos 是构建以“服务”为中心的现代应用架构 (例如微服务范式、云原生范式) 的服务基础设施。

Nacos社区同时也开启了关于[Nacos3.0](https://mp.weixin.qq.com/s/8UwwD_WxSJINP8Qr_1wogg)的畅想和规划，欢迎社区积极参与到新版本的建设中。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1577777/1660125280551-a2e881fe-d25e-4ebb-a28f-8e56683deef1.png#clientId=uf10cb19a-105c-4&crop=0&crop=0&crop=1&crop=1&from=url&id=Z9to1&margin=%5Bobject%20Object%5D&name=image.png&originHeight=794&originWidth=1650&originalType=binary&ratio=1&rotation=0&showTitle=false&size=185821&status=done&style=none&taskId=u63849e10-1dae-45cb-b559-04d106ebe86&title=)

最后欢迎大家扫码加入Nacos社区群
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1577777/1660125280778-c1822fb0-958b-4730-a6dc-0e92ba22f3f8.png#clientId=uf10cb19a-105c-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=374&id=u2619495f&margin=%5Bobject%20Object%5D&name=image.png&originHeight=923&originWidth=765&originalType=binary&ratio=1&rotation=0&showTitle=false&size=338166&status=done&style=none&taskId=u0690e9a0-6d58-4f72-82b1-7d4457a900e&title=&width=310)
