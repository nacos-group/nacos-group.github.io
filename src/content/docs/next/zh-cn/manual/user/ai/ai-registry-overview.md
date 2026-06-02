---
title: AI 管理中心概述
keywords: [Nacos AI 管理中心, Skill 管理, Agent 管理, MCP 管理, Prompt 管理, AgentSpecs 管理]
description: 了解 Nacos AI 管理中心的全景场景、核心资源和不同角色的使用入口。
sidebar:
  order: 1
---

# AI 管理中心概述

AI 管理中心（AI Registry）是 Nacos 3.x 面向 AI 应用提供的注册、治理、发现和分发能力。它和配置管理、服务发现一样，是 Nacos 的核心能力之一。

在传统微服务中，Nacos 帮助应用找到服务、读取配置、感知变更。在 AI 应用中，应用还需要找到 Skill、Agent、MCP Server、Prompt、AgentSpec 等 AI 资源。AI 管理中心解决的就是这些资源如何进入平台、如何被治理、如何按版本发布，以及如何被运行时应用发现的问题。

## AI 管理中心全景

一个 AI 应用从开发到运行，通常会经历资源沉淀、资源发布、运行时发现和持续治理几个阶段。Nacos AI 管理中心负责把这些资源放到统一的命名空间、版本和权限体系中。

| 场景 | Nacos 管理的资源 | 运行时如何使用 | 平台治理重点 |
| --- | --- | --- | --- |
| Skill | Skill 包、SkillCard、版本和标签 | Agent 或工具链按名称、版本或标签下载 | 包来源、审核、可见性和分发范围 |
| Agent | AgentCard、Agent 端点和版本 | Multi-agent 应用发现 Agent 并发起调用 | 端点、版本、外部提供商和可见性 |
| MCP Server | MCP 服务描述、工具、资源、端点和版本 | MCP Client、MCP Router、网关或 Agent 发现并调用工具 | 协议、端点、工具开关、导入和代理 |
| Prompt | Prompt 模板、变量、版本和标签 | 应用按 Prompt Key、版本或标签读取模板 | 评审、回滚、latest 标签和灰度使用 |
| AgentSpec | Agent 规范包、manifest、内容和资源 | Agent 平台、开发工具或 AI 应用获取规范包 | 包完整性、版本、标签和公开范围 |

这些资源都使用命名空间隔离。团队可以用命名空间区分环境、租户或业务域。

## Skill 管理

Skill 管理（Skill Registry）用来管理可复用的 AI 能力包。一个 Skill 可以描述能力名称、输入输出、依赖资源、版本和可见范围。平台团队可以把常用能力沉淀为 Skill，开发者或 Agent 运行时再按名称、版本或标签获取。

常见使用场景包括：

- 将企业内部工具、自动化流程或模型能力封装成可分发的 Skill。
- 通过草稿、审核、发布、上下线流程控制 Skill 的生产可用状态。
- 使用业务标签、版本标签和可见范围管理不同团队可使用的 Skill。
- 通过客户端 API 下载 Skill ZIP 包，供运行时或开发工具加载。

详细说明见 [Skill 管理](./skill-registry.md)。

## Agent 管理

Agent 管理（A2A Registry）用来管理可被发现和调用的 Agent。Nacos 记录 AgentCard、端点和版本信息，让 Multi-agent 应用可以在运行时发现合适的 Agent。

Agent 可以来自不同来源：Spring AI Alibaba 应用可以自动注册 Agent；自定义 Agent 可以通过 SDK 或 API 发布；外部提供商的 Agent 也可以导入后统一治理。平台侧可以围绕 Agent 的版本、端点和可见性做统一管理。

Agent 管理关注“可调用的 Agent 入口”。AgentSpecs 管理关注“Agent 规范包”。两者可以配合使用，但不是同一种资源。

详细说明见 [Agent 管理](./agent-registry.md)。

## MCP 管理

MCP 管理是 AI 管理中心中最常被直接集成的场景之一。它让 MCP Server、存量 API、外部工具服务和 AI 应用之间有一个统一的登记与发现入口。

![MCP 管理架构图](/img/doc/overview/mcp-registry-overview.svg)

Nacos 可以管理 MCP Server 的服务描述、工具、资源、端点、版本和协议暴露方式。新构建的 MCP Server 可以自动注册到 Nacos。存量 HTTP 或 RPC 服务可以通过声明和网关能力转换成 MCP 工具。外部提供商的 MCP Server 也可以导入后统一治理。

围绕 MCP 管理，常见路径有：

- 新 MCP Server 自动注册到 Nacos，运行时由 MCP Client 或 Agent 发现。
- 存量 API 通过服务声明、工具声明和端点声明转换为 MCP Server。
- Nacos MCP Router 统一发现 Nacos 中的 MCP Server，并向客户端提供路由或代理能力。
- Dify、Higress、Spring AI Alibaba 等生态组件通过 Nacos 获取 MCP Server 信息。

详细说明见 [MCP Server 自动注册与发现手册](./mcp-auto-register.md)、[存量 API 转换 MCP 手册](./api-to-mcp.md)、[Nacos MCP Router 手册](./nacos-mcp-router.md) 和 [Dify 发现 Nacos MCP 服务](./dify-nacos-mcp.md)。

## Prompt 管理

Prompt 管理用来管理提示词模板。它适合将应用中的 Prompt 从代码中拆出来，交给平台统一管理版本、变量、标签和发布状态。

Prompt 常见使用方式包括：

- 按 Prompt Key 管理模板内容和变量说明。
- 用版本保存每次 Prompt 变更，便于审计和回滚。
- 使用 `latest`、`stable`、`canary` 等标签控制运行时读取的版本。
- 通过客户端 API 在应用启动或运行中查询 Prompt。

详细说明见 [Prompt 管理](./prompt-registry.md)。

## AgentSpecs 管理

AgentSpecs 管理（AgentSpecs Registry）用来管理 Agent 规范包及其元数据。一个 AgentSpec 通常包含 manifest 信息、描述内容和相关资源文件。它更适合面向 Agent 平台、开发工具和 AI 应用分发标准化的 Agent 描述。

Nacos 为 AgentSpec 提供上传 ZIP、创建草稿、更新草稿、提交审核、发布、强制发布、重新编辑、上下线、标签、业务标签、可见范围和版本元数据查询等能力。运行时可以通过客户端 API 按名称、版本或标签获取 AgentSpec，也可以分页搜索可用 AgentSpec。

详细说明见 [AgentSpecs 管理](./agentspec-registry.md)。

## 它和配置管理、服务发现的关系

AI 管理中心不是把 AI 资源简单地当成配置或服务。

配置管理关注配置内容的发布、查询、监听和历史。服务发现关注服务、实例、健康状态和订阅推送。AI 管理中心关注 AI 资源本身的模型、版本、发布状态、可见性和运行时发现。

有些资源会复用配置管理或服务发现作为底层能力。例如 MCP Server 的元数据当前可能存储在配置记录中，端点可能使用服务发现表达。但从用户角度看，它仍然是 MCP Server 资源，而不是普通配置或普通服务。

## 常见使用路径

如果你是 AI 应用开发者：

- 想下载和使用可复用能力包，先看 [Skill 管理](./skill-registry.md) 和 [客户端 API](../open-api.md#3-ai-相关)。
- 想注册、发现或调用 A2A Agent，先看 [Agent 管理](./agent-registry.md)。
- 想发现和调用 MCP Server，先看 [MCP Server 自动注册与发现手册](./mcp-auto-register.md) 和 [Nacos MCP Router 手册](./nacos-mcp-router.md)。
- 想把现有 HTTP 或 RPC API 暴露成 MCP 工具，先看 [存量 API 转换 MCP 手册](./api-to-mcp.md)。
- 想在应用中查询 Prompt，先看 [Prompt 管理](./prompt-registry.md) 和 [客户端 API](../open-api.md#3-ai-相关)。
- 想分发或读取 Agent 规范包，先看 [AgentSpecs 管理](./agentspec-registry.md) 和 [客户端 API](../open-api.md#3-ai-相关)。

如果你是平台或运维人员：

- 想治理 Prompt、Skill、AgentSpec 的版本，先看 [AI 资源生命周期](./ai-resource-lifecycle.md)。
- 想管理 MCP、Prompt、Skill、AgentSpec 或导入外部 AI 资源，参考 [运维 API](../../admin/admin-api.md) 和 [控制台 API](../../admin/console-api.md)。
- 想接入发布审核、安全扫描或外部资源导入，优先关注 [AI 发布 Pipeline 插件](../../../plugin/ai-pipeline-plugin.md)、[AI 资源导入插件](../../../plugin/ai-resource-import-plugin.md) 和 [可见性插件](../../../plugin/visibility-plugin.md)。

## 资源生命周期

Prompt、Skill、AgentSpec 等版本化资源通常会经历以下过程：

```text
创建草稿 -> 修改草稿 -> 提交审核 -> 发布 -> 上线 -> 下线或重新上线
```

没有启用发布审核时，提交可能直接发布。启用 Pipeline 后，资源需要先通过检查。管理员可以在紧急场景下强制发布，但这会跳过 Pipeline 校验，应当谨慎使用。

更多状态和操作说明见 [AI 资源生命周期](./ai-resource-lifecycle.md)。

## 阅读建议

1. 先读本文，了解 AI 管理中心管什么。
2. 按资源类型选择 Skill、Agent、MCP、Prompt 或 AgentSpecs 文档。
3. 再读 [AI 资源生命周期](./ai-resource-lifecycle.md)，了解版本和发布状态。
4. 最后查阅 API、SDK 或控制台手册完成集成。
