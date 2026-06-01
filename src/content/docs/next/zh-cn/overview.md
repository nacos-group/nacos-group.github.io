---
title: Nacos 概览
keywords: [Nacos, 服务发现, 配置管理, AI Registry]
description: 了解 Nacos 的命名来源、核心能力、产品优势、设计理念和推荐阅读路径。
---

# Nacos 概览

Nacos 读作 `/nɑ:kəʊs/`，名称来自 **Dynamic Naming and Configuration Service**。

Nacos 是一个面向云原生和 AI 应用的动态服务发现、配置管理和 AI Registry 平台。它最早围绕两个核心问题构建：应用如何找到服务，应用如何安全地读取和更新配置。进入 3.x 后，Nacos 在这些能力之上扩展了 AI Registry，用来管理 MCP Server、A2A Agent、Prompt、Skill 等 AI 资源。

Nacos 的目标很直接：让应用在运行时安全、及时地找到它需要的服务、配置和 AI 能力。

## 核心能力

| 能力 | 解决的问题 | 推荐入口 |
| --- | --- | --- |
| 服务发现 | 服务如何注册、发现、订阅和感知健康状态 | [快速开始](./quickstart/quick-start.mdx)、[客户端 API](./manual/user/open-api.md) |
| 配置管理 | 配置如何集中管理、动态更新、回滚和审计 | [快速开始](./quickstart/quick-start.mdx)、[Java SDK](./manual/user/java-sdk/usage.md) |
| AI Registry | MCP Server、Agent、Prompt、Skill 如何注册、治理和发现 | [AI Registry 概览](./manual/user/ai/ai-registry-overview.md) |
| 运维治理 | 集群如何部署、监控、升级和管理权限 | [部署手册](./manual/admin/deployment/deployment-overview.md)、[监控手册](./manual/admin/monitor.md)、[权限校验](./manual/admin/auth.mdx) |
| 插件扩展 | 如何扩展鉴权、数据源、加密、限流、环境和链路追踪能力 | [插件](./plugin/auth-plugin.md) |

## Nacos 3.x 重点变化

Nacos 3.x 继续保留服务发现和配置管理能力，同时强化了 API、安全和 AI 场景。

- **统一的 v3 API**：Client API、Admin API、Console API 面向不同调用者，边界更清晰。
- **默认鉴权更严格**：控制台和管理接口默认更重视身份认证和权限控制。
- **AI Registry 成为一等能力**：可以管理 MCP Server、A2A Agent、Prompt、Skill、AgentSpec 等 AI 资源。
- **插件能力更完整**：鉴权、可见性、发布 Pipeline、资源导入、数据源和追踪等能力可以按需扩展。
- **运维能力更明确**：部署、监控、升级、系统参数、Admin API 和 Maintainer SDK 更适合平台化运维。

## 产品优势

### 易于使用

Nacos 提供控制台、SDK、OpenAPI 和运维 SDK。开发者可以快速接入服务发现和配置管理，运维人员也可以通过可视化页面和 API 管理集群。

### 能力完整

Nacos 覆盖服务发现、配置管理、健康检查、配置历史、灰度发布、权限控制、监控、插件扩展等能力。Nacos 3.x 还增加了 AI Registry，用来管理 MCP、A2A、Prompt、Skill 等 AI 应用资源。

### 面向生产

Nacos 支持集群模式、外部数据库、监控指标、鉴权、运维 API 和升级流程。它适合从本地开发逐步走向生产环境。

### 生态开放

Nacos 可以和 Spring Cloud、Dubbo、Kubernetes、Higress、Dify、Spring AI Alibaba 等生态协同使用。插件机制也允许团队按自己的安全、存储和治理要求扩展 Nacos。

## 设计理念

![设计理念简图](/img/doc/overview/design-philosophy-with-ai.svg)

### 易于使用

Nacos 的核心功能应当容易接入、容易理解、容易运维。用户不需要先理解复杂实现，才能完成服务注册、配置读取或 AI 资源发现。

### 面向标准

Nacos 尽量使用清晰、稳定的接口和模型。服务发现、配置管理、v3 API、MCP、A2A、OpenAPI 和插件扩展都应尽量减少不必要的私有约束。

### 高可用

Nacos 面向运行时基础设施。服务发现、配置管理和 AI 资源发现都可能影响应用运行，因此 Nacos 在集群、存储、推送、恢复和运维可观测性上持续增强。

### 方便扩展

不同团队会有不同的安全、审计、数据源和发布流程。Nacos 通过插件和清晰的 API 边界，让用户在不修改核心代码的情况下扩展能力。

## 技术架构

![Nacos 架构图](/img/doc/overview/3.0_overview.svg)

Nacos 以通信模块、一致性协议、存储和运行时基础能力为底座，对外提供服务发现、配置管理和 AI Registry。SDK、OpenAPI、控制台和运维 SDK 是用户访问这些能力的主要入口。

插件和生态组件位于架构两侧。插件用于扩展 Nacos 本身，生态组件用于连接 Spring Cloud、Dubbo、Kubernetes、Higress、Dify、Spring AI Alibaba 等系统。

## 数据模型

![Nacos 数据模型图](/img/doc/overview/data-model.svg)

Nacos 的核心资源通常通过命名空间隔离。

- 服务发现中，资源名通常是服务名。
- 配置管理中，资源名通常是 Data ID。
- AI Registry 中，资源名可以是 MCP Server 名、Agent 名、Prompt Key、Skill 名或 AgentSpec 名。

命名空间适合区分环境、租户或业务域。生产环境建议为不同环境使用不同命名空间，避免测试资源影响线上应用。

## 部署模式

![Nacos 部署模式图](/img/doc/overview/deploy-structure.svg)

Nacos 支持单机模式和集群模式。

**单机模式**适合本地开发、功能验证和测试环境。它启动简单，也可以使用内置 Derby 数据库。它不适合承载高可用生产流量。

**集群模式**适合生产环境。多个节点共同提供服务，配合外部数据库和一致性协议提升可用性。生产环境建议同时配置监控、告警、鉴权和备份策略。

## 推荐阅读路径

如果你第一次接触 Nacos：

1. 阅读 [快速开始](./quickstart/quick-start.mdx)，先把 Nacos 跑起来。
2. 阅读 [Java SDK](./manual/user/java-sdk/usage.md) 或 [客户端 API](./manual/user/open-api.md)，完成应用接入。
3. 阅读 [API 概览](./manual/user/overview/api-overview.md)，理解 Client API、Admin API 和 Console API 的边界。

如果你负责生产环境：

1. 阅读 [部署手册](./manual/admin/deployment/deployment-overview.md)，确认部署模式、端口和存储。
2. 阅读 [系统参数](./manual/admin/system-configurations.md) 和 [监控手册](./manual/admin/monitor.md)。
3. 阅读 [权限校验](./manual/admin/auth.mdx)、[运维 API](./manual/admin/admin-api.md) 和 [运维 SDK](./manual/admin/maintainer-sdk.md)。

如果你正在构建 AI 应用：

1. 阅读 [AI Registry 概览](./manual/user/ai/ai-registry-overview.md)。
2. 按场景选择 MCP、Agent、Prompt 或 Skill 文档。
3. 需要治理版本时，阅读 [AI 资源生命周期](./manual/user/ai/ai-resource-lifecycle.md)。

## 下一步行动

- 第一次体验 Nacos：阅读 [快速开始](./quickstart/quick-start.mdx)。
- 准备生产部署：阅读 [部署手册](./manual/admin/deployment/deployment-overview.md)。
- 接入 AI Registry：阅读 [AI Registry 概览](./manual/user/ai/ai-registry-overview.md)。
- 查看 API 边界：阅读 [API 概览](./manual/user/overview/api-overview.md)。
- 参与社区贡献：阅读 [贡献指南](./contribution/contributing.md)。
