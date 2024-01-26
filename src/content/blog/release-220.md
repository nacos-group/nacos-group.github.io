---
title: Nacos 2.2.0 版本发布，新增多种插件支持
keywords: [2.2.0, plugins]
description: Nacos 2.2.0 版本发布，新增多种插件支持！
date: "2022-12-16"
category: release
---
# Nacos 2.2.0 版本发布，新增多种插件支持

## 新版本发布
### 2.2.0正式版 版本特性

Nacos社区于10月分发布了2.2.0-BETA版本，根据近1个多月的社区反馈，2.2.0-BETA没有发现严重的核心功能问题，主要的反馈集中在数据库插件的优化修复以及一些小bug修复。

因此不再进行BETA2版本的发布，而直接发布2.2.0的GA正式版。

![2.2.0架构图](/img/blog/2_2_0-release/220-structure.png)

2.2.0版本是2.X中一个较为重要的版本，它包含了一些较为重大的改动：

首先，2.2.0将会删除旧的冗余代码，即1.X模式服务发现和双写相关代码。删除后，2.2.0版本将无法从Nacos 1.X服务器升级，只能从至少2.0.0版本升级。此更改不会影响对1.X客户端请求的适配，用户仍然可以使用1.X客户端链接2.2.0版本服务端。

其次，2.2.0添加了数个新的插件支持，例如 [数据源插件](https://nacos.io/docs/v2/plugin/datasource-plugin/)、[自定义环境变量插件](https://nacos.io/docs/v2/plugin/custom-environment-plugin/)和`限流管控插件`。

其中[自定义环境变量插件](https://nacos.io/docs/v2/plugin/custom-environment-plugin/)是社区需求配置加密数据库密码的需求的升级抽象插件，允许通过插件的方式对nacos服务端启动时的配置进行特殊处理，比如可以配置数据库密码为密文，在插件中进行解密，以此来支持配置加密数据库密码以及后续可能有的其他关于配置特殊处理的需求。

`限流管控插件`是将早期开源之夏项目中的连接限流模块进行插件化改造后的插件，可提供用户以扩展的方式编写限流管控能力，以保护Nacos服务端在高压下运行的稳定性。
> 由于限流管控插件的改造还未完全完成，目前将不会发布插件SPI至maven仓库中，想要尝试的开发者或用户可以根据Nacos 源代码中 plugin/control 下的SPI先行拓展使用，帮助社区更早的发现问题。

最后，2.2.0增强了在2.1.1版本被列为beta功能的`轨迹追踪插件`和`批量注册`，这使它们更易于使用。关于如何开发和使用`轨迹追踪插件`，可以参考[插件文档](https://nacos.io/docs/v2/plugin/trace-plugin/)进行开发。

2.2.0 版本具体变更内容可参考变更日志：

```markdown
## feature
[#5863][#9331] Support batch register and batch deregister service.
[#8308] Add v2 openAPI for nacos 2.0.
[#8312] Support datasource plugins.
[#8481] Support track tracing plugins.
[#8694] Support prometheus http service discovery(prometheus http sd).
[#9318] Support caseSentive for Ldap auth plugin.
[#9366] Support Ldaps authentication.

## Enhancement&Refactor
[#7930] Reomve old redundant codes about 1.x naming.
[#9391] Optimization Chooser.
[#9393] Make server stop auto when starting error.
[#9414] Optimize fuzzy queries to make SQL more general.
[#9415][#9449][#9466][#9497] Enhancement datasource plugins.
[#9423] ExternalDataSourceProperties add isEmpty check to support external config.
[#9459] Modify the method modifier of NacosApplicationListener to default.
[#9471] Keep console query condition in configuration After return list config pages.
[#9597] Keep console query condition in discovery After return list service pages.
[#9615] Enhance client choose server node to request server more dispersed.
[#9653] Refactor connection limit module to plugin.

## BugFix
[#9334] Fix group_id data length different in many tables.
[#9341] Fix can not create bean ldapAuthenticationProvider.
[#9351] Fix instance count error in prometheus metrics.
[#9367] Fix auth plugin's property 'token.secret.key' base64 decode error.
[#9408][#9437] Fix console namespace list deploy problems.
[#9461] Fix ClientWorker NullPointer judgement order.
[#9474] Fix some instance is unhealthy after change to http health check.
[#9478] Fix the chooser bug when all instances have a zero weight.
[#9584] Fix console configuration query button overflow hidden problem.
[#9586] Fix problem of deregister instance failure after service expired metadata auto clean.

## Dependency
[#9652] Upgrade ui dependencies to fix some depend vulnerability.
```

## 社区
### 贡献者激励活动
在2.1.1版本发布时，许多小伙伴收到了Nacos社区的小礼品，2.2.0版本发布后，又一期的礼品如期而至，本次礼品主要针对在7月初至12月初期间，为Nacos及其周边生态产品有所贡献的新贡献者以及保持持续贡献的优秀贡献者们。欢迎更多的新鲜贡献者加入Nacos社区，同时也欢迎获得了礼品的贡献者们可以继续贡献社区，激励活动会一直保持～期待收集齐所有的Nacos社区礼品哦～

本次的礼品将会是Nacos&Seata&Higress的帆布袋，请没留下联系方式的贡献者们尽快在github上添加，以免错过活动～

| ![bag_nacos.jpg](/img/blog/2_2_0-release/bag_nacos.jpg) | ![bag_seata.jpg](/img/blog/2_2_0-release/bag_seata.jpg) |
| --- | --- |

## 展望
### 2.X 后续计划
从2021年3月 2.0.0正式版发布至今，2.X版本已经走了接近2年时间，如今2.2.0版本发布，说明2.X版本已经逐渐成熟稳定，在2.X的后续计划中，除了鼓励社区中提供和完善已有的插件多种实现以外，依旧会为其易用性和扩展性进一步增强，添加更多的插件功能：

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

![image.png](https://cdn.nlark.com/yuque/0/2022/png/1577777/1660125280778-c1822fb0-958b-4730-a6dc-0e92ba22f3f8.png#clientId=uf10cb19a-105c-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=374&id=u2619495f&margin=%5Bobject%20Object%5D&name=image.png&originHeight=923&originWidth=765&originalType=binary&ratio=1&rotation=0&showTitle=false&size=338166&status=done&style=none&taskId=u0690e9a0-6d58-4f72-82b1-7d4457a900e&title=&width=310)
