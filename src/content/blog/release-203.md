---
title: Nacos 2.0.3版本发布，继续提升集群稳定性及升级稳定性
keywords: [2.0.3]
description: Nacos 2.0.3版本发布，继续提升集群稳定性及升级稳定性
date: "2021-07-29"
category: release
---

# Nacos 2.0.3版本发布，继续提升集群稳定性及升级稳定性

## Nacos 2.0.3


Nacos2.0.3 中，Nacos社区继续针对1.X到2.0.X升级的健壮性和高可用做了充分优化，扫除上生产的稳定性忧虑；Java/Spring-boot/Golang/C#/Cpp多语言客户端也全面支持Nacos2.0，拉齐多语言代差；并且优化了大量控制台UI的易用功能，提升用户使用效率。

主要变更内容如下：


```
## Features

[#6384] Add redo feature for nacos client naming.

## Enhancement

[#1469] Add cluster delete button.
[#5884] Add the permission for history config.
[#5909] Enhance LADP auth log print out when auth check failed.
[#5999] Adpat nacos endpoint in AddressServerMemberLookup.
[#6100] Enhance config managerment UI.
[#6129] Add ServerConfigChangeEvent when config file changed.
[#6142] Redo register and subscribe when reconnection auth check failed.
[#6160] Optimization of IP address acquisition method in nacos client.
[#6175] If the client already disconnect, ignore this request to avoid NPE.
[#6178] Unified configuration page style
[#6204] Get data from database if user or role info not found in cache.
[#6367] Add IOReactorExceptionHandler to avoid IOReactor out of loop when meet unknown Network error.
[#6386] Stop v1 distro verification when cluster upgraded to v2.
[#6403] Make the expired time of naming client be configurable in nacos-server.

## BugFix

[#6107] Fix Chinese account show with gibber in home page.
[#6109] Fix get InstanceUpgradeHelper instance error for double write service.
[#6116] Fix unable to check client beats when register same ip and port in old clients with high concurrent.
[#6169] Fix cluster page internationalization.
[#6198] Fix NPE when use StringUtils.join illegal.
[#6295] Fix instance metadata will not be removed for ip port client.
[#6335] Fix startup error when the JAVA_HOME path contains spaces under Linux/Unix/Mac system.
[#6382][#6476] Fix nacos-istio serviceInfo.getChecksum() always is empty.
[#6423] Fix yaml parse concurrent problem.
```


完整的Release Note请查看 [2.0.3](https://github.com/alibaba/nacos/releases/tag/2.0.3) 。


## 从Nacos1.X升级Nacos2.0.X


Nacos服务端支持从1.X平滑升级到Nacos2.0.X；由于Nacos2.0对服务发现的数据结构进行了重构，因此升级过程中会采用异步双写数据的功能，在升级到2.0模式前，对数据进行校验，保证升级过程中的稳定运行。


在集群所有节点都升级到Nacos2.0.X版本之后，集群中的每一台节点都将开启自检，检查Nacos1.X模式下的数据是否和Nacos2.0模式下的数据一致，主要对比的是两个模式下的服务数及实例数是否相等，以及是否还有双写任务。
只有服务数及实例数相等，且没有双写任务之后，Nacos节点才会判定自身节点已经准备好升级到2.0模式，可以通过控制台的集群管理中节点元数据的`readyToUpgrade`字段来判断该节点是否准备完成。


当集群中所有节点都完成准备后，集群节点将会切换运行模式到2.0模式，此时请求流量将会切换至2.0模式运行，且开始接受gRPC的请求。如果未切换时，来自gRPC的请求将会提示`Nacos cluster is running with 1.X mode, can't accept gRPC request temporarily. Please check the server status or close Double write to force open 2.0 mode.`


另外，从Nacos2.0.2版本开始，Nacos为升级添加了一些接口方便用户检查升级状态，找到升级到2.0模式不成功的原因，并且在特殊情况下能够进行主动补偿。


比如接口`/nacos/v1/ns/upgrade/ops/metrics`， 可以快速的查看到当前节点的状态，如当前1.X模式的服务数，实例数；2.0模式的服务数，实例数；双写任务遗留量；对应模式缺失的服务名等等内容，帮助用户快速定位升级问题。


更多升级相关信息请查看 [Nacos 2.0 升级文档](https://nacos.io/docs/latest/upgrading/200-upgrading/)


## 客户端支持2.0


目前Golang、C#、Cpp、nacos-spring-boot，客户端已经支持了nacos2.0的grpc能力，欢迎大家试用
​

- [nacos-spring-boot v0.1.10](https://github.com/nacos-group/nacos-spring-boot-project/releases/tag/0.1.10)
- [nacos-spring-boot v0.2.10](https://github.com/nacos-group/nacos-spring-boot-project/releases/tag/0.2.10)
- [nacos-sdk-go v2.0.0-Alpha.1](https://github.com/nacos-group/nacos-sdk-go/releases/tag/v2.0.0-Alpha.1)
- [nacos-sdk-csharp v1.1.0](https://github.com/nacos-group/nacos-sdk-csharp/releases/tag/v1.1.0)
- [nacos-sdk-cpp v1.0.8](https://github.com/nacos-group/nacos-sdk-cpp/releases/tag/1.0.8)

Python的多语言客户端正在紧张开发中，相信很快能与大家见面。 Nodejs部分欢迎社区小伙伴一起参与建设~

## 2.1版本预告


自2.0版本12月初社区发布后，经过数个版本的优化，功能和性能趋于稳定；因此社区开始规划2.1版本。


在Nacos2.1版本中，我们计划移除对Nacos1.X服务端的升级支持，以移除1.X模式及双写等冗余代码，提升代码质量及可读性，用户仍可以从2.0.X版本进行升级。


在功能上，Nacos2.1版本将会开放部分功能的插件化能力，如已经在进行的Selector插件，鉴权插件及配置加解密插件。


另外，我们会对Nacos2.0的第三方依赖进行一些精简，减少用户使用过程中依赖冲突的问题。


## 社区


感谢来自社区同学们的持续贡献，正是有了大家的共同努力，Nacos才能变得越来越完善。


在此郑重感谢对本次Release有卓越贡献的社区同学（根据字母顺序）：


- [brotherlu-xcq](https://github.com/brotherlu-xcq)
- [MajorHe1](https://github.com/MajorHe1)
- [pixystone](https://github.com/pixystone)
- [shalk](https://github.com/shalk)
- [SunJiFengPlus](https://github.com/SunJiFengPlus)
- [zzq1314zll](https://github.com/zzq1314zll)


期待各位成为Nacos committer。


## About Nacos


Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及流量管理。


Nacos 帮助您更敏捷和容易地构建、交付和管理微服务平台。 Nacos 是构建以“服务”为中心的现代应用架构 (例如微服务范式、云原生范式) 的服务基础设施。
