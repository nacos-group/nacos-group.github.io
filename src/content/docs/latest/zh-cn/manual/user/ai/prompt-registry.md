---
title: Prompt 管理
keywords: [Nacos Prompt 管理, AI Prompt]
description: 使用 Nacos 管理 Prompt 模板、变量、版本、标签和发布流程。
sidebar:
  order: 9
---

# Prompt 管理

Prompt 管理用于集中维护 AI 应用使用的提示词模板。它适合管理经常调整、需要版本控制、需要灰度或审核的 Prompt。

把 Prompt 放在 Nacos 中，可以让应用在不重新发布代码的情况下获取最新 Prompt，也可以让团队统一管理 Prompt 的版本、标签和发布流程。

## Prompt 是什么

在 AI 管理中心中，一个 Prompt 是一个版本化资源。它通常包含：

- Prompt 模板内容。
- 模板变量定义。
- 版本号、作者和提交说明。
- 标签，例如 `latest`。
- 描述和业务标签。

Prompt 的资源标识是：

```text
namespaceId -> prompt -> promptKey
```

`promptKey` 是 Prompt 名称。建议使用稳定、可读、能表达业务含义的名称，例如 `order-summary`、`risk-check`。

## 适合使用 Prompt 管理的场景

- 多个应用复用同一套 Prompt。
- Prompt 需要频繁优化，但不希望每次都发布应用。
- 生产 Prompt 需要审核后才能上线。
- 需要保留 Prompt 历史版本，方便回滚和审计。
- 需要用标签控制应用读取哪个版本。

如果 Prompt 只在单个应用中临时使用，且不需要版本管理，可以继续放在应用代码或应用配置中。

## 推荐发布流程

日常变更建议使用以下流程：

```text
创建草稿 -> 修改模板和变量 -> 提交审核 -> 发布 -> 更新 latest 标签 -> 应用读取
```

没有启用 Pipeline 时，提交和发布流程会更短。启用 Pipeline 后，可以在发布前做格式检查、安全扫描或团队自定义审核。

管理员可以强制发布 Prompt 版本。强制发布会跳过 Pipeline 校验，只建议用于紧急修复。

## 运行时如何读取

应用可以通过 Client API 查询 Prompt。常见方式有两种：

- 按版本查询：适合需要完全固定行为的应用。
- 按标签查询：适合希望跟随 `latest` 或其他标签自动升级的应用。

如果应用传入本地缓存的 md5，服务端可以判断内容是否变化。内容没有变化时，应用可以继续使用本地缓存，减少网络和解析开销。

客户端 API 参考：[查询 Prompt](../open-api.md#31-查询-prompt)。

## 标签使用建议

`latest` 是最常用的标签，通常指向当前推荐版本。

建议把标签当作“版本指针”，而不是版本内容本身。修改标签不会改变 Prompt 内容，只会改变标签指向的版本。

生产环境建议：

- 应用默认读取 `latest` 或明确约定的业务标签。
- 重要发布先创建新版本，再切换标签。
- 不要把标签指向草稿或审核中的版本。

## 给开发者的建议

- 把变量名设计得稳定，不要频繁改名。
- 在提交说明里写清楚本次 Prompt 调整的目的。
- 对关键 Prompt 保留可回滚版本。
- 本地开发可以使用指定版本，生产环境再切换为标签。

## 给运维和平台人员的建议

- 为生产 Prompt 启用发布 Pipeline。
- 对强制发布建立审计要求。
- 定期检查长期未使用的 Prompt 和草稿。
- 对高风险 Prompt 设置更严格的可见性和权限。

## 相关文档

- [AI 管理中心概述](./ai-registry-overview.md)
- [AI 资源生命周期](./ai-resource-lifecycle.md)
- [客户端 API](../open-api.md#3-ai-相关)
- [运维 API](../../admin/admin-api.md#6-ai-prompt-管理)
- [控制台 API](../../admin/console-api.md#6-prompt-管理)
