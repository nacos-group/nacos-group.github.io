---
title: AgentSpecs 管理
keywords: [Nacos AI 管理中心, AgentSpecs 管理, AgentSpec, AI Agent]
description: 了解 Nacos AgentSpecs 管理如何管理 AgentSpec 规范包、版本、标签、可见范围和运行时查询。
sidebar:
  order: 10
---

# AgentSpecs 管理

AgentSpecs 管理（AgentSpecs Registry）用来管理 Agent 规范包。它面向 Agent 平台、开发工具和 AI 应用，帮助团队分发标准化的 Agent 描述、资源和版本。

Agent 管理关注“可被发现和调用的 Agent 入口”。AgentSpecs 管理关注“描述 Agent 能力、行为和资源的规范包”。两者可以配合使用：平台可以先通过 AgentSpec 分发标准描述，再通过 Agent 管理暴露可调用的 Agent 实例。

## 适合解决的问题

- 多个团队需要复用同一份 Agent 规范，但不希望复制到各自仓库。
- Agent 规范需要版本化发布，并支持回滚和标签路由。
- 开发工具、Agent 平台或 AI 应用需要按名称、版本或标签获取 AgentSpec。
- 平台团队需要控制 AgentSpec 的公开范围、业务标签和上下线状态。
- AgentSpec 发布前需要经过审核、安全扫描或其他 Pipeline 检查。

## AgentSpec 包含什么

在 Nacos 中，AgentSpec 通常由元数据、描述内容和资源信息组成。

| 内容 | 说明 |
| --- | --- |
| 基础信息 | 命名空间、名称、描述、业务标签、来源和可见范围 |
| 规范内容 | AgentSpec 的主要描述内容，用于表达 Agent 的能力、约束或使用方式 |
| 资源信息 | 与 AgentSpec 一起分发的资源文件或资源元数据 |
| 版本信息 | 版本号、状态、标签、更新时间和发布信息 |

AgentSpec 可以通过 ZIP 包上传，也可以通过草稿接口创建和更新。发布后，运行时应用可以通过客户端 API 查询或搜索可用 AgentSpec。

## 生命周期

AgentSpec 使用 Nacos AI 资源的通用生命周期。

```text
上传或创建草稿 -> 更新草稿 -> 提交审核 -> 发布 -> 上线 -> 下线或重新上线
```

常见管理动作包括：

- 上传 ZIP 包，创建或更新 AgentSpec。
- 创建草稿版本，并基于草稿持续修改内容。
- 提交审核，由 Pipeline 执行检查。
- 发布版本，并按需要更新 `latest` 或其他版本标签。
- 设置公开或私有可见范围。
- 对单个版本或整个 AgentSpec 执行上线、下线。
- 查询版本详情或版本元数据。

更多状态说明见 [AI 资源生命周期](./ai-resource-lifecycle.md)。

## 运行时查询

AI 应用、Agent 平台或开发工具可以通过客户端 API 获取 AgentSpec：

- 按 `name` 查询 AgentSpec。
- 按 `version` 精确获取指定版本。
- 按 `label` 获取标签指向的版本。
- 按关键词分页搜索 AgentSpec。

如果客户端已经缓存了内容，可以结合 API 的 `md5` 参数判断本地内容是否需要更新。具体请求参数和返回结构见 [客户端 API](../open-api.md#3-ai-相关)。

## 给平台和运维人员的建议

- 用命名空间区分环境、租户或业务域，避免测试规范影响生产使用。
- 为生产可用版本维护清晰标签，例如 `latest`、`stable` 或业务自定义标签。
- 对公开范围、业务标签和发布权限做统一约束。
- 对高风险 AgentSpec 启用 Pipeline 检查，避免未经审核的内容直接进入生产。
- 下线 AgentSpec 前先确认是否仍有 Agent 平台、开发工具或 AI 应用依赖该版本。

## 相关文档

- [AI 管理中心概述](./ai-registry-overview.md)
- [AI 资源生命周期](./ai-resource-lifecycle.md)
- [客户端 API](../open-api.md#3-ai-相关)
- [运维 API](../../admin/admin-api.md#8-agentspec-管理)
