---
title: Nacos 2.3.0 正式版发布、 Nacos Controller 项目开源
keywords: [2.3.0]
description: Nacos 2.3.0 正式版发布、 Nacos Controller 项目开源。
date: "2023-12-07"
category: release
---
# Nacos 2.3.0 正式版发布、 Nacos Controller 项目开源

## 新版本发布

Nacos 2.3.0-BETA版本经过1个多月的社区测试，修复了部分的问题并对部分新功能的使用进行了少量优化后，于2023年12月7日正式发布。

Nacos 2.3.0版本基于[2.3.0-BETA](./release-230-beta.md) 版本为基础，主要进行了如下更新：

- 基于`能力协商机制`，支持通过Grpc的方式进行持久化服务实例的注册及删除。
- Console UI中显示更多内容，例如部署模式等。
- 对`参数校验功能`的实现方式进行优化。
- 对`TopN`指标的实现进行重构，优化准确性和内存消耗。

详细的更新日志请查看：

```markdown
## Feature
[#11393] Support register or deregister persistent instance by grpc.

## Enhancement&Refactor
[#11275] Enhance console ui deploy, show more information like `mode`.
[#11298] Strip groupNamePrefix of instance serviceName at register or deregister.
[#11310] Simplify the validate method for serviceinfo.
[#11342] Simplify BatchDeregister instances conditions to ip and port.
[#11343] Simplified parameters checker control logic.
[#11352] Refactor topN logic to enhance memory usage and accuracy.

## BugFix
[#10353] Handling DataIntegrityViolationException and DuplicateKeyException together.
[#11299] Fix console ui auth pagination failure.
[#11382] Fix console ui listening query pagination failure.
[#11384] Fix console ui comparing configuration failure.
[#11390] Fix Config EncryptionPluginService order problem.
[#11442] Fix listen configuration check failed without namespace.

## Dependency
[#11216] Declare httpcore as direct dependency to fix avoid conflict.
[#11396] Upgrade jackson same with spring boot dependency.
[#11439] Upgrade some UI component to solve security problem.
```

## 展望
### 2.X 后续计划

从2021年3月 2.0.0正式版发布至今，2.X版本已经走了接近2年时间，如今2.3.0版本发布，完成了大部分功能的插件化提炼，在之后的2.3.X版本中，会主要对当前版本的问题进行修复，并做出小范围的功能优化。同时对于2.4.0版本，会作为一个Nacos3.0的过度版本，对大量代码进行优化重构，在提升稳定性、健壮性的同时，提升易用性和可观测性，向Nacos3.0版本平稳过度。

### 3.0 计划

Nacos社区同时也开启了关于[Nacos3.0](https://mp.weixin.qq.com/s/8UwwD_WxSJINP8Qr_1wogg) 的畅想和规划，Nacos将会从统一控制面、支持国产化、存储计算分离等方向进一步演进Nacos的功能和架构，欢迎社区积极参与到新版本的建设中。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/1577777/1698198629123-af9f1216-f996-4ac2-81bf-436048823d21.png)

![image.png](https://cdn.nlark.com/yuque/0/2022/png/1577777/1660125280551-a2e881fe-d25e-4ebb-a28f-8e56683deef1.png#clientId=uf10cb19a-105c-4&crop=0&crop=0&crop=1&crop=1&from=url&id=Z9to1&margin=%5Bobject%20Object%5D&name=image.png&originHeight=794&originWidth=1650&originalType=binary&ratio=1&rotation=0&showTitle=false&size=185821&status=done&style=none&taskId=u63849e10-1dae-45cb-b559-04d106ebe86&title=#crop=0&crop=0&crop=1&crop=1&id=rUihF&originHeight=794&originWidth=1650&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

## About Nacos

Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及流量管理。

Nacos 帮助您更敏捷和容易地构建、交付和管理微服务平台。 Nacos 是构建以“服务”为中心的现代应用架构 (例如微服务范式、云原生范式) 的服务基础设施。

最后欢迎大家扫码加入Nacos社区群

![image.png](https://cdn.nlark.com/yuque/0/2023/png/1577777/1679276899363-83081d59-67c6-4501-9cf8-0d84ba7c6d7e.png#averageHue=%23c1c2c2&clientId=u9dfeac18-3281-4&from=paste&height=551&id=ubcf45e51&name=image.png&originHeight=1102&originWidth=854&originalType=binary&ratio=2&rotation=0&showTitle=false&size=155261&status=done&style=none&taskId=ud6bea1fe-b003-441b-a810-84435d2aeff&title=&width=427)

