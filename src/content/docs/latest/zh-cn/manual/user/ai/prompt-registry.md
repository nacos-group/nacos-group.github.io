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

Prompt 使用统一的 [AI 资源生命周期](./ai-resource-lifecycle.md)。日常变更从草稿开始，已发布的模板和变量不能直接覆盖。

```text
创建草稿 -> 修改模板和变量 -> 提交 -> 审核通过后发布为 online -> 应用读取
```

- 有已启用且支持 Prompt 的 Pipeline 节点时，提交后进入 `reviewing`。审核完成进入 `reviewed`，通过后可发布；拒绝后需先重新编辑再修改，或重新提交以重跑检查。
- 没有适用 Pipeline 节点时，提交直接发布上线。
- 发布或重新上线会由服务端自动更新 `latest`，无需再手动设置。

管理员可在应急场景强制发布 `draft`、`reviewing` 或 `reviewed` 版本，跳过 Pipeline 校验。已下线版本需要使用重新上线操作。

## 运行时如何读取

应用可以通过 Client API 查询 Prompt。常见方式有两种：

- 按版本查询：适合需要完全固定行为的应用。
- 按标签查询：适合希望跟随 `latest` 或其他标签自动升级的应用。

如果应用传入本地缓存的 md5，服务端可以判断内容是否变化。内容没有变化时，应用可以继续使用本地缓存，减少网络和解析开销。

客户端 API 参考：[查询 Prompt](../open-api.md#31-查询-prompt)。

## 标签使用建议

`latest` 由服务端维护。发布或重新上线时指向该版本；下线或删除当前 latest 版本时，会从剩余在线版本中重新选择，没有在线版本时移除。自定义标签操作不能手动覆盖 latest。

生产环境建议：

- 需要跟随每次发布的应用可以读取 `latest`。
- 需要固定行为的应用使用显式版本；需要灰度或人工控制切换时使用 `stable`、`canary` 等自定义标签。
- 先发布并验证目标版本，再切换自定义标签。切换标签不会改变内容或自动上线版本。
- 下线版本前，检查仍使用该版本或指向它的自定义标签的应用。

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
