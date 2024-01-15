---
title: Nacos 2.2.2发布，优化启动体验和鉴权提示
keywords: [2.2.2, auth]
description: Nacos 2.2.2发布，优化启动体验和鉴权提示
date: "2023-04-11"
category: release
---
# Nacos 2.2.2发布，优化启动体验和鉴权提示

Nacos社区近期发布了2.2.0.1和2.2.1版本，对默认鉴权插件做出了较大的改动，详情查看[风险说明](src/content/blog/announcement-token-secret-key.md)及[2.2.1发布](release-221.md)。
由于Nacos默认控制台ui中默认依赖了`token.secret.key`，所以在移除了`token.secret.key`的默认值后，许多新部署或默认使用latest版本镜像的用户出现大量启动失败的情况，对用户的易用性造成了较大影响。
因此2.2.2版本主要针对该问题进行了优化。

## 新版本发布
### Nacos 2.2.2

Nacos于2.2.0.1和2.2.1版本时移除了3个和鉴权有关的默认值，以避免用户部署时因各种原因未修改而引入的撞库风险。但其中`token.secret.key`在Nacos默认控制台ui的登陆页中被强制依赖，因此使得很多使用默认配置或对安全性要求不那么高的环境无法直接启动运行，给大量用户造成了使用困扰。

所以2.2.2版本的主要改动就是在**未开启鉴权**的情况下，通过取消默认控制台ui中的登录要求，从而移除对`token.secret.key`的强制依赖；在**开启鉴权**的情况下，用户仍然需要设置自定义的`token.secret.key`、`nacos.core.auth.server.identity.key`和 `nacos.core.auth.server.identity.value`。
否则将导致节点无法启动、登录失败、鉴权无法通过。

2.2.2 版本更多具体变更内容可参考变更日志：

```markdown
## Enhancement&Refactor
[#10153] Close console login page when auth.enabled is false.
[#10276] Default close openssl for client.

## BugFix
[#10208] Remove DefaultSettingPropertySource.java.
```

### Nacos-Go-SDK 2.2.1
Nacos-Go-SDK 2.2.1 主要修复了2.2.0中一个错误的内存使用问题，同时也修复了其他的一些使用问题，更加稳定，欢迎使用。

```markdown
* update get cache config log print by @binbin0325 in #594
* fixed memory usage problem caused by maxInt chan by @binbin0325 in #596
* 调整 [INFO] logDir cacheDir 日志输出 by @Cotch22 in #590
* 修复初始化并发读写的情况 by @tonglin96 in #591
* grpc default port init by @binbin0325 in #598
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

