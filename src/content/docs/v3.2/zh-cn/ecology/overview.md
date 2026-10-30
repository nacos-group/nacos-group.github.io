---
title: 生态融合概览
keywords: [Nacos, 生态融合, Spring, Dubbo, Kubernetes, Prometheus, MCP]
description: 了解 Nacos 生态融合文档的场景分类、阅读入口和使用建议。
sidebar:
    order: 0
---

# 生态融合概览

Nacos 生态融合文档介绍 Nacos 如何与应用框架、云原生基础设施、迁移同步工具、监控系统和 AI 工具链配合使用。

如果你只是想了解 Nacos 的核心能力，请先阅读[概览](../overview.md)、[配置管理概览](../manual/user/config/overview.md)、[服务发现概览](../manual/user/naming/overview.md)和 [AI 管理中心概述](../manual/user/ai/ai-registry-overview.md)。生态融合文档更适合在明确接入场景后阅读。

## 按场景选择文档

| 场景 | 适合阅读 |
| --- | --- |
| Java 微服务接入 | [Dubbo 融合 Nacos](./use-nacos-with-dubbo.md)、[Spring](./use-nacos-with-spring.md)、[Spring Boot](./use-nacos-with-spring-boot.md)、[Spring Boot 3](./use-nacos-with-spring-boot3.md)、[Spring Cloud](./use-nacos-with-spring-cloud.md) |
| 云原生基础设施 | [CoreDNS](./use-nacos-with-coredns.md)、[Istio](./use-nacos-with-istio.md) |
| Kubernetes 服务同步 | [Kubernetes 服务发现同步](./use-nacos-with-k8s-sync.md)、[Nacos Controller 同步服务](./use-nacos-controller-to-sync-service.md) |
| 注册中心迁移与同步 | [NacosSync 用户手册](./use-nacos-sync.md) |
| Prometheus 业务实例发现 | [使用 Nacos 提供 Prometheus 服务发现](./use-nacos-prometheus-sd.md) |
| AI 工具链接入 | [Nacos MCP Router 使用手册](./use-nacos-mcp-router.md) |

## 生态能力和核心能力的关系

生态能力通常围绕 Nacos 的核心能力展开：

- 应用框架接入 Nacos，主要使用配置管理和服务发现。
- Kubernetes、CoreDNS、Istio 等基础设施集成，主要使用服务发现或把服务发现信息同步到其他系统。
- NacosSync 面向注册中心迁移和多注册中心同步。
- Prometheus 服务发现让 Prometheus 从 Nacos 获取业务应用实例 target。
- MCP Router 等 AI 生态组件围绕 AI 应用的工具调用和服务发现展开。

这些文档会涉及外部项目、框架版本和部署环境。使用前请同时阅读对应外部项目的官方文档，并在测试环境验证版本兼容性。

## 关于生态能力状态

生态融合章节既包含长期维护的接入文档，也包含仍在持续演进的生态联动能力。部分 Kubernetes 相关同步和控制器能力可能调整接口、配置和维护方式。涉及这类能力时，请同时阅读[实验性功能概览](../experimental/overview.md)。
