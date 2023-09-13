---
title: v0.5.0 of Nacos-sdk-csharp was released! Capabilities aligned with Java SDK！
keywords: [csharp, sdk]
description: v0.5.0 of Nacos-sdk-csharp was released! Capabilities aligned with Java SDK!
---

# v0.5.0 of Nacos-sdk-csharp was released!

After promoted by Alibaba Summer of Coding(ASoC), [nacos-sdk-csharp](https://github.com/nacos-group/nacos-sdk-csharp) released a new version 0.5.0. So far, nacos-sdk-csharp will have the same capabilities as the Java-sdk.

Thanks for contribution of Aman, Wenqing Huang during ASoC.

## Main release note of v0.5.0 of Nacos-sdk-csharp

1. Fixed auth request return 403
2. Failover of configuration was change from memory to file
3. Fixed can not retrieve available service after specify load balance strategy
4. Fixed can not refresh accesstoken due to only login once
5. Support Yaml and Ini parser
6. Support subscribe and unsubscribe of naming
7. Support PreferredNetworks to choose the network adapter
8. Perfect ASP.NET Core integration

## 近期预告

Nacos社区和阿里巴巴编程之夏的成果远不止此，很快将会有cpp和python的新版本sdk发布哦。

## 如何共建

我们欢迎任何人积极参与Nacos社区。如果您在文档中发现拼写错误，在代码中发现错误，或想要新功能或想要提供建议，您可以[在GitHub上创建一个issues](https://github.com/alibaba/Nacos/issues/new) 。

如果您想开始着手，可以选择github仓库中有以下标签的issues。

 -  [good first issue](https://github.com/alibaba/nacos/labels/good%20first%20issue) ：对于新手来说是非常好的入门issues。
 
 -  [contribution welcome](https://github.com/alibaba/nacos/labels/contribution%20欢迎) ：非常需要解决的问题和非常重要的模块，但目前缺少贡献者，欢迎贡献者来贡献。

除了以上的通用标签，还可以关注Nacos的多语言共建，目前我们已经支持各类主流语言：

* [csharp](https://github.com/nacos-group/nacos-sdk-csharp)
* [go](https://github.com/nacos-group/nacos-sdk-go)
* [cpp](https://github.com/nacos-group/nacos-sdk-cpp)
* [python](https://github.com/nacos-group/nacos-sdk-python)
* [nodejs](https://github.com/nacos-group/nacos-sdk-nodejs)

欢迎大家加入Nacos社区，贡献社区。用Apache的话说，**“社区高于代码”!**。

## [](https://github.com/alibaba/nacos)新人时刻 - "什么是Nacos？"
> 还不知道什么是Nacos? 没关系，在github上star一下跟程序猿兄弟打个招呼吧!!

[Nacos](https://github.com/alibaba/nacos) 是阿里巴巴于2018年7月份新开源的项目，Nacos的主要愿景是期望通过提供易用的 `动态服务发现`、`服务配置管理`、`服务共享与管理` 的基础设施，帮助用户在云原生时代更好的构建、交付、管理自己的微服务平台。

github项目地址在 [这里](https://github.com/alibaba/nacos)
