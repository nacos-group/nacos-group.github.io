---
title: Nacos 3.0.1发布，支持MCP Registry API
keywords: [3.0.1, MCP Registry, MCP Router]
description: Nacos 3.0.1发布，支持MCP Registry API，同时Nacos MCP Router发布， 支持SSE和STREAMABLE模式。
date: "2025-05-26"
category: announcement
---
## 1. Nacos 3.0.1发布，支持MCP Registry API

Nacos`3.0.1`版本发布了，在`3.0.0`版本的基础上， 主要支持了`MCP的多命名空间管理能力`和`MCP多版本管理能力`，同时Nacos社区参与到MCP Registry API标准的贡献当中，并**率先支持**了[标准MCP Registry API](https://github.com/modelcontextprotocol/registry/blob/main/api/openapi.yaml)。

在Nacos `3.0.1`版本部署时可以通过`nacos.ai.mcp.registry.enabled=true`参数开启标准MCP Registry API，并通过`nacos.ai.mcp.registry.port`(默认9080)参数指定MCP Registry API的运行端口。由于MCP Registry API会需要占用额外端口和资源，因此使用默认配置启动时将不会启用MCP Registry API功能。

> 由于官方社区MCP Registry API标准的改动， MCP Server定义的元数据存在一定的变化， 这部分变化将会导致一定的数据结构不兼容，从3.0.0版本升级到3.0.1之后会导致控制台无法读取到旧版本MCP Server数据。  Nacos社区提供了[迁移工具](https://download.nacos.io/nacos-server/mcp-migration-tool.jar)，运行迁移工具后将会把原本MCP Server迁移到默认命名空间`public`下。具体迁移工具的使用请查看[文档](https://nacos.io/docs/latest/manual/admin/upgrading/#218-迁移mcp服务可选)
>
> 随着MCP Registry API的公布， MCP Server的数据结构也已趋于稳定，之后的版本将会保持升级的兼容性。
>

除了一些新功能，此版本还对初始化密码的提示以及window操作系统下的启动脚本进行了优化， 另外还修复了一些3.0.0版本中的bug。

具体`3.0.1`的变更日志如下：

```markdown
## Feature/Refactor

[#13356] Support multiple namespace for MCP feature.
[#13377] Support [mcp registry](https://github.com/modelcontextprotocol/registry/blob/main/api/openapi.yaml) api in nacos mcp module.
[#13401] Support version controller for mcp server.

## Enhancement/Refactor

[#13335] Enhance the windows startup.cmd to reduce duplicate hint for secret.token.key.
[#13348] Enhance the hints for initing password.

## BugFix

[#13249] Fix configuration change plugin return incompatibility.
[#13267] Fix cannot delete service which contains illegal character.
[#13273] Fix create cluseter client don't use `nacos.remote.client.grpc` config.
[#13321] Fix prometheus metrics api can't accept problem.
[#13345] Fix apiClient readTimeout must be zero.
[#13368] Fix cannot delete the namespace in console ui problem.
[#13405] Fix listen config problem with default namespace.
[#13413] Fix Hints problem for mcp stdio server.
```

### MCP Registry API

[MCP Registry API](https://github.com/modelcontextprotocol/registry/blob/main/api/openapi.yaml) 是 [MCP官方社区](https://github.com/modelcontextprotocol) 所提出的一个用于统一各个MCP发布市场的一种OpenAPI。它被设计为<font style="color:rgb(13, 18, 57);">集中管理公开可用的MCP服务器元数据的REST API，允许MCP服务器创建者以标准化格式提交和维护其服务器的元数据。该API使MCP客户端应用（如Clause，Cline等）和“服务器聚合器”类型消费者能够发现并安装MCP服务器。类似于提供了一个MCP服务的一个`Maven中央元数据仓库`。

[MCP官方社区](https://github.com/modelcontextprotocol)不提供MCP Registry的私有化部署支持，这对于一些不希望将自身MCP服务暴露在公开环境中的服务提供方来说，就需要自行适配MCP Registry API 并提供相应的管理功能。

Nacos 在`3.0.1`版本中**率先支持**MCP Registry API，这为有需求进行私有化MCP服务暴露的服务提供方提供了拆箱即用的MCP Registry API能力以及MCP服务的管理能力。

在部署Nacos `3.0.1`版本时， 只需开启`nacos.ai.mcp.registry.enabled=true`参数，并设置`nacos.ai.mcp.registry.port`(默认9080)参数，即可访问MCP Registry API。

![](https://cdn.nlark.com/yuque/0/2025/png/1577777/1748239352229-4d1a92ba-3fc3-486e-9058-7d7900a798cb.png)

![](https://cdn.nlark.com/yuque/0/2025/png/1577777/1748239352066-ea7c1f03-9ada-4935-ae8c-b91f6291f7a9.png)

### MCP多命名空间管理及MCP多版本管理

Nacos `3.0.1`版本中， 允许MCP自由的注册到任意命名空间中，如此就可以复用Nacos的命名空间隔离能力，让MCP服务根据环境、租户等因素进行资源隔离。

![](https://cdn.nlark.com/yuque/0/2025/png/1577777/1748239385809-dd4fdeac-bc3e-4157-980a-b6378605b93d.png)

同时Nacos `3.0.1`版本也支持对MCP 服务本身的版本进行管理，MCP服务发布者可以选择其中一个版本并设置为最新版本（默认使用），方便发布者进行MCP 服务的灰度。

![](https://cdn.nlark.com/yuque/0/2025/png/1577777/1748239385925-209755ab-aa51-4f40-8ae5-f02eab06d5fe.png)

![](https://cdn.nlark.com/yuque/0/2025/png/1577777/1748239386108-81af0ada-6b47-44d3-91f9-93c8c548e3cf.png)

## 2. Nacos-MCP-Router升级，支持sse、steamable

Nacos-MCP-Router是一个基于MCP官方标准SDK实现的的MCP Server，提供MCP Server推荐、分发、安装及代理其他MCP Server的功能，帮助用户更方便的使用MCP Server服务。Nacos-MCP-Router支持暴露为stdio、sse、streamable HTTP协议，同时支持docker部署。此外，Nacos-MCP-Router支持proxy模式，只需简单几个环境变量就能快速把原来stdio、sse协议的MCP Server转换为streamableHTTP协议MCP server。其使用方式主要有3种：

1. 本地测试：router模式+stdio协议，

![](https://cdn.nlark.com/yuque/0/2025/png/1577777/1748239403931-e3d29063-6a77-4873-805b-92a116ebcc54.png)

2. 远程部署：router模式+sse/streamableHTTP协议

![](https://cdn.nlark.com/yuque/0/2025/png/1577777/1748239403726-e92b9f78-66fc-4cb9-b8bd-2a3740de9128.png)

3. 一键转换streamableHTTP：proxy模式

![](https://cdn.nlark.com/yuque/0/2025/png/1577777/1748239403852-c9897db3-e6d4-470b-918b-f85586e050df.png)

欢迎参考[文档](https://github.com/nacos-group/nacos-mcp-router/blob/main/README.md)安装试用。


## 3. Nacos MeetUp活动预告

随着 Nacos 3.0.1 正式版本已经发布，Nacos社区线下技术交流会（MeetUp）也筹备完成。活动聚焦前沿技术趋势，特设AI大模型与场景化应用、云原生安全实践、Spring Cloud Alibaba生态、Dubbo 新特性、Spring AI Alibaba技术探索及Higress周边生态等专题研讨。会议于2024年6月初举行，诚邀广大Nacos用户、开发者及技术爱好者莅临交流。

参与报名请参见：[Nacos3.0 开源开发者沙龙 Agent&MCP 专场](./nacos-gvr7dx_awbbpb_to2k53t2lzzkmqw8.md)

## 4. About Nacos
Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及AI管理。

Nacos 帮助用户更敏捷和容易地构建、交付和管理云原生AI应用的平台。 Nacos 是构建以“服务”为中心的现代应用架构 (例如微服务范式、云原生范式、AI原生范式) 的服务基础设施。

Nacos 3.0 还有很多待完成的功能及大量待探索和开发的领域，欢迎大家扫码加入 Nacos 社区群及 Nacos MCP社区讨论群，参与 Nacos 社区的贡献和讨论，在 Nacos 社区一起搭把手，让你的代码和能力有机会能在各行各业领域内进行释放能量，期待认识你和你一起共建 Nacos 社区；



_<font style="color:#585A5A;">“Nacos 相信一切都是服务，每个服务节点被构想为一个星球，每个服务都是一个星系；Nacos 致力于帮助这些服务建立连接赋予智能，助力每个有面向星辰的梦想能够透过云层，飞在云上，更好的链接整片星空。”</font>_



Nacos 官网：[https://nacos.io/](https://nacos.io/)

Nacos 仓库地址：[https://github.com/alibaba/nacos](https://github.com/alibaba/nacos)

“Nacos社区群5”群的钉钉群号： 120960003144

“Nacos MCP 社区讨论群”群的钉钉群号： 97760026913

| ![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/297800/1745409709892-b3a5252e-eb16-41ea-a25c-91d9acc75353.png) | ![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/297800/1745409712778-599a0535-4433-43b8-b413-bff9dc1ab1e8.png) |
| --- | --- |

