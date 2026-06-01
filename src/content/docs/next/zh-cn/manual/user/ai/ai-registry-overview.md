---
title: AI Registry 概览
keywords: [Nacos AI Registry, MCP Registry, A2A Registry, Prompt Registry, Skill Registry]
description: 了解 Nacos AI Registry 管理哪些 AI 资源，以及不同角色应该从哪里开始。
sidebar:
  order: 1
---

# AI Registry 概览

AI Registry 是 Nacos 3.x 面向 AI 应用提供的注册、治理、发现和分发能力。它和配置管理、服务发现一样，是 Nacos 的核心能力之一。

在传统微服务中，Nacos 帮助应用找到服务、读取配置、感知变更。在 AI 应用中，应用还需要找到 MCP Server、Agent、Prompt、Skill 等 AI 资源。AI Registry 解决的就是这些资源如何登记、发布、治理和被运行时应用发现的问题。

## AI Registry 管理什么

AI Registry 主要管理以下资源：

| 资源 | 适合管理的内容 | 常见使用者 |
| --- | --- | --- |
| MCP Server | MCP 服务描述、工具、资源、端点和版本 | AI 应用、MCP Client、平台管理员 |
| A2A Agent | AgentCard、Agent 端点和版本 | Agent 开发者、Multi-agent 应用 |
| Prompt | Prompt 模板、变量、版本和标签 | AI 应用开发者、Prompt 管理员 |
| Skill | Skill 包、版本、审核和分发 | 开发团队、平台团队、自动化工具 |
| AgentSpec | Agent 规范包、版本和可见性 | Agent 平台、开发者工具 |

这些资源都使用命名空间隔离。团队可以用命名空间区分环境、租户或业务域。

## 它和配置管理、服务发现的关系

AI Registry 不是把 AI 资源简单地当成配置或服务。

配置管理关注配置内容的发布、查询、监听和历史。服务发现关注服务、实例、健康状态和订阅推送。AI Registry 关注 AI 资源本身的模型、版本、发布状态、可见性和运行时发现。

有些资源会复用配置管理或服务发现作为底层能力。例如 MCP Server 的元数据当前可能存储在配置记录中，端点可能使用服务发现表达。但从用户角度看，它仍然是 MCP Server 资源，而不是普通配置或普通服务。

## 常见使用路径

如果你是 AI 应用开发者：

- 想发现和调用 MCP Server，先看 [MCP Server 自动注册与发现手册](./mcp-auto-register.md) 和 [Nacos MCP Router 手册](./nacos-mcp-router.md)。
- 想把现有 HTTP 或 RPC API 暴露成 MCP 工具，先看 [存量 API 转换 MCP 手册](./api-to-mcp.md)。
- 想在应用中查询 Prompt，先看 [Prompt 管理](./prompt-registry.md) 和 [客户端 API](../open-api.md#3-ai-相关)。

如果你是 Agent 开发者：

- 想注册或发现 A2A Agent，先看 [Agent 注册中心](./agent-registry.md)。
- 想分发 Agent 规范包，先看 AgentSpec 相关 API 和 Maintainer SDK。

如果你是平台或运维人员：

- 想治理 Prompt、Skill、AgentSpec 的版本，先看 [AI 资源生命周期](./ai-resource-lifecycle.md)。
- 想管理 AI 资源 API，参考 [运维 API](../../admin/admin-api.md#4-mcp-管理) 和 [控制台 API](../../admin/console-api.md#4-mcp-管理)。
- 想接入发布审核、安全扫描或外部资源导入，优先关注 Pipeline、导入和可见性相关能力。

## 资源生命周期

Prompt、Skill、AgentSpec 等版本化资源通常会经历以下过程：

```text
创建草稿 -> 修改草稿 -> 提交审核 -> 发布 -> 上线 -> 下线或重新上线
```

没有启用发布审核时，提交可能直接发布。启用 Pipeline 后，资源需要先通过检查。管理员可以在紧急场景下强制发布，但这会跳过 Pipeline 校验，应当谨慎使用。

更多状态和操作说明见 [AI 资源生命周期](./ai-resource-lifecycle.md)。

## 推荐阅读顺序

1. 先读本文，了解 AI Registry 管什么。
2. 再读 [AI 资源生命周期](./ai-resource-lifecycle.md)，了解版本和发布状态。
3. 按资源类型选择 MCP、Agent、Prompt 或 Skill 文档。
4. 最后查阅 API、SDK 或控制台手册完成集成。
