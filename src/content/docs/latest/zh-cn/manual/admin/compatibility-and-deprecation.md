---
title: 兼容与废弃
keywords: [Nacos, 兼容, 废弃, 迁移, Legacy]
description: 了解 Nacos 兼容能力、废弃能力和迁移入口。
sidebar:
    order: 8
---

# 兼容与废弃

Nacos 会在版本演进中保留一部分兼容能力，帮助用户完成升级和迁移。这些能力不是推荐的新模型。新接入和新开发应优先使用当前文档中的标准能力。

## 状态怎么理解

| 状态 | 含义 | 用户建议 |
| --- | --- | --- |
| 标准能力 | 当前推荐使用的 API、SDK、配置或资源模型。 | 新系统直接使用。 |
| 仅兼容 | 为了避免破坏已有用户而保留。 | 只在迁移期使用，不要继续扩展依赖。 |
| 已废弃 | 仍可用，但后续可能移除。 | 尽快迁移到替代方案。 |
| 待移除 | 已废弃，且移除条件或方向已经明确。 | 制定迁移计划，不建议继续上线新用法。 |
| 实验性 | 尚未承诺稳定行为。 | 先小范围验证，接受后续不兼容调整。 |

## 常见兼容入口

| 场景 | 当前建议 | 继续阅读 |
| --- | --- | --- |
| v1/v2 HTTP API | 迁移到 v3 OpenAPI 或当前 SDK。确有迁移窗口需求时，临时使用 legacy adapter。 | [升级手册](./upgrading.mdx)、[OpenAPI 概览](../user/overview/api-overview.md) |
| 兼容开关 | 只在升级或迁移窗口期打开。稳定后关闭。 | [系统参数](./system-configurations.md) |
| Beta/Tag 灰度配置兼容 | 升级时打开兼容和迁移配置，稳定后使用新版灰度模型。 | [升级手册](./upgrading.mdx)、[系统参数](./system-configurations.md) |
| 默认命名空间迁移 | 关注空命名空间到 `public` 的迁移行为。 | [升级手册](./upgrading.mdx)、[Java SDK 使用手册](../user/java-sdk/usage.md#13-升级兼容性) |
| 旧控制台 | 仅用于兼容存量使用习惯。新部署使用新控制台。 | [控制台手册](./console.md#旧控制台) |
| Java SDK 已废弃配置项 | 不在新系统中继续使用。 | [Java SDK 属性配置](../user/java-sdk/properties.md) |
| CLI 已废弃命令 | 使用显式生命周期命令替代快捷 publish 命令。 | [Nacos CLI 使用指南](./nacos-cli.md) |
| 实验性功能 | 只在明确接受变更风险后使用。 | [实验性功能概览](../../experimental/overview.md) |

## 使用兼容能力时要确认什么

- 它是否只是为了升级或迁移临时使用。
- 是否有明确的替代 API、SDK、配置或资源模型。
- 是否会改变鉴权、可见性、响应格式、性能或数据一致性。
- 是否需要额外安装插件、adapter 或独立组件。
- 迁移完成后如何关闭兼容开关或移除兼容组件。

## 不建议的做法

- 在新业务中主动依赖旧 API 或已废弃 SDK 方法。
- 把兼容字段当作新的资源语义。
- 长期打开短期兼容开关而不做迁移。
- 用 Console API 作为自动化系统的长期稳定接口。
- 把实验性功能当作稳定生产能力。

## 相关文档

- [升级手册](./upgrading.mdx)
- [系统参数](./system-configurations.md)
- [OpenAPI 概览](../user/overview/api-overview.md)
- [控制台手册](./console.md)
- [实验性功能概览](../../experimental/overview.md)
