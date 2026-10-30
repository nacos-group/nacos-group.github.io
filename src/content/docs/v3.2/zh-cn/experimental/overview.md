---
title: 实验性功能概览
keywords: [Nacos, 实验性功能, 分布式锁, K8S Sync, Nacos Controller]
description: 了解 Nacos 实验性功能的定位、使用边界和当前推荐阅读入口。
sidebar:
    order: 1
---

# 实验性功能概览

实验性功能用于承载仍在验证中的新能力、生态实验能力或辅助工具。它们可以帮助社区更早试用新方向，但不等同于 Nacos 的稳定核心能力。

:::caution
本章节中的功能属于实验性功能或生态实验能力。接口、配置、数据模型和维护方式都可能发生较大修改。若社区反馈较少，部分能力后续可能从 Nacos 主仓库剥离到 `nacos-group` 生态仓库独立维护。
:::

## 适合如何使用

- 先在测试环境或小流量环境验证，不建议直接承担关键生产链路。
- 使用前阅读对应功能页中的边界说明，确认它是否满足当前场景。
- 记录版本、配置和使用方式，方便升级时核对兼容性变化。
- 如果功能对业务有价值，建议在社区反馈场景、问题和改进建议。

## 当前内容

| 功能 | 适合场景 | 文档 |
| --- | --- | --- |
| 分布式锁 | 简单、短时的互斥控制 | [分布式锁](./distributed-lock.md) |
| Kubernetes 服务同步 | 将 Kubernetes 中的服务和实例信息同步到 Nacos 服务发现 | [Kubernetes 生态实验能力](./ecosystem-integrations.md) |
| Nacos Controller 服务同步 | Kubernetes 与 Nacos 服务发现的联动验证 | [Kubernetes 生态实验能力](./ecosystem-integrations.md) |

## 和核心功能的关系

Nacos 的稳定核心能力仍然是服务发现、配置管理和 AI 管理中心。实验性功能可能复用这些能力，但它们自身的资源模型、接口和维护节奏还没有完全稳定。

如果你需要稳定的服务注册、配置发布、AI 资源管理、鉴权、可见性、部署和监控能力，请优先阅读对应的正式文档：

- [配置管理概览](../manual/user/config/overview.md)
- [服务发现概览](../manual/user/naming/overview.md)
- [AI 管理中心概述](../manual/user/ai/ai-registry-overview.md)
- [部署最佳实践](../manual/admin/deployment/deployment-best-practices.md)
