---
title: Kubernetes 生态实验能力
keywords: [Nacos, 实验性功能, K8S Sync, Nacos Controller]
description: 了解 Nacos Kubernetes 生态同步能力的实验性边界。
sidebar:
    order: 3
---

# Kubernetes 生态实验能力

Nacos 生态中存在一些连接 Kubernetes 的同步和控制器能力。它们通常用于验证 Kubernetes 服务发现与 Nacos 服务发现之间的联动。

:::caution
本页内容按实验性功能或生态实验能力处理。它们可能依赖特定版本、外部组件或社区维护节奏。接口、配置和维护位置可能调整。若社区反馈较少，部分能力后续可能剥离到 `nacos-group` 生态仓库独立维护。
:::

NacosSync 和 Prometheus 服务发现辅助能力是长期存在的生态能力，不按实验性功能处理。NacosSync 请阅读[生态融合中的 NacosSync 用户手册](../ecology/use-nacos-sync.md)，Prometheus 服务发现辅助能力请阅读[监控手册](../manual/admin/monitor.md)和[生态融合中的 Prometheus SD 文档](../ecology/use-nacos-prometheus-sd.md)。

## Kubernetes 服务同步

Kubernetes 服务同步用于监听 Kubernetes 中的 Service、Pod 等资源变化，并将服务和实例信息同步到 Nacos 服务发现中。

当前文档中记录的能力以单向同步为主，适合做 Kubernetes 服务发现与 Nacos 服务发现的联动验证。正式生产使用前，需要确认 Kubernetes 版本、同步方向、冲突处理和失败恢复策略。

阅读：[Nacos 支持从 K8S 服务发现中同步服务元数据](../ecology/use-nacos-with-k8s-sync.md)

## Nacos Controller 服务同步

Nacos Controller 可用于 Kubernetes 与 Nacos 服务发现的联动场景。它更适合在 Kubernetes 环境中验证服务同步和控制器模式。

在生产环境使用前，请先确认控制器版本、权限范围、同步方向和回滚方案。

阅读：[使用 Nacos Controller 同步服务](../ecology/use-nacos-controller-to-sync-service.md)

## 使用建议

- 先把同步方向、权威数据源和冲突处理规则写清楚。
- 在小范围服务上验证，不要一次性同步大规模生产服务。
- 为同步任务配置监控和告警，避免无感知的数据漂移。
- 升级 Nacos 或外部系统前，先在测试环境验证同步行为。
