---
title: 用户手册概览
keywords: [用户手册,配置中心,注册中心,AI管理中心,SDK,OpenAPI]
description: Nacos 用户手册的阅读入口，帮助用户按场景选择文档。
---

# 用户手册概览

用户手册面向接入 Nacos 的开发者、应用负责人和一线运维人员。这里不展开服务端部署和插件开发细节，而是帮助你理解应用如何使用 Nacos 的核心能力。

如果你刚开始接入，可以先按业务场景阅读：

| 场景 | 推荐入口 | 适合对象 |
| --- | --- | --- |
| 管理和发现 Skill、Agent、MCP Server、Prompt、AgentSpec 等 AI 资源 | [AI 管理中心](./ai/ai-registry-overview.md) | AI 应用开发者、平台工程师 |
| 发布、查询、监听和灰度配置 | [配置中心](./config/overview.md) | 应用开发者、配置管理员 |
| 注册实例、发现服务、订阅实例变化 | [注册中心](./naming/overview.md) | 微服务开发者、应用运维 |
| 通过 Java、Go、Python 等 SDK 接入 Nacos | [SDK 概览](./overview/other-language.md) | 应用开发者 |
| 了解客户端连接、缓存、重连和故障恢复 | [SDK 运行时](./sdk/runtime-guide.md) | 应用开发者、SRE |
| 使用 HTTP Client API 接入 Nacos | [OpenAPI 概览](./overview/api-overview.md)、[客户端 API](./open-api.md) | SDK 以外的客户端开发者 |
| 配置客户端身份和访问凭据 | [访问凭据](./auth.mdx) | 应用开发者、平台管理员 |
| 理解参数合法性和常见校验失败 | [参数校验](./parameters-check.md) | 应用开发者 |
| 了解服务端地址解析方式 | [寻址说明](./addressing.mdx) | 应用开发者、运维人员 |

## Client SDK、OpenAPI 和管理接口怎么选

业务应用优先使用 Client SDK。Client SDK 负责连接 Nacos、维护监听和订阅、处理本地缓存，并在连接恢复后尽量恢复运行时意图。

当语言运行时暂时没有合适的 SDK，或者只需要少量确定资源的读取、注册和发现能力时，可以使用客户端 OpenAPI。客户端 OpenAPI 不适合大范围管理资源。

需要发布大量配置、查询全量列表、管理命名空间、调整服务端状态或做审计运维时，请使用运维手册中的 Admin API、Console API 或 Maintainer SDK。

## 继续阅读

- 想先跑起来：阅读[快速开始](../../quickstart/quick-start.mdx)。
- 想了解部署和生产环境边界：阅读[部署手册](../admin/deployment/deployment-overview.md)和[部署最佳实践](../admin/deployment/deployment-best-practices.md)。
- 想了解插件能力：阅读[插件概览](../../plugin/overview.md)。
