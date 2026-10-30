---
title: AI 存储
keywords: [AI 存储, AI 管理中心, AI Storage, Plugin]
description: 本文介绍 Nacos AI 存储插件的职责、默认实现、路由模型和自定义开发边界。
sidebar:
    order: 16
---

# AI 存储插件

AI 存储插件用于保存 AI 资源版本关联的二进制或文本内容。它只负责按 storage key 读、写、删除内容。资源元数据、版本、标签、可见性和生命周期仍由 AI 管理中心负责。

这个边界很重要。不要把存储插件理解为新的 AI 资源模型。它只是内容存储后端。

统一插件类型为 `ai-storage`，执行模式为 `ROUTED`，加载阶段为 `STANDARD`，类型 critical。插件身份是 `ai-storage:{provider}`。路由器会在每次操作前检查统一状态；被禁用的 provider 会明确失败，不会回退到另一个已发现实现。

## 什么时候需要关注

默认情况下，Nacos 使用 `nacos_config` provider 存储 AI 资源内容。多数部署不需要修改。

当出现以下需求时，可以考虑自定义 AI 存储插件：

- Skill 包、AgentSpec 包或其他资源内容需要放到对象存储。
- 资源内容体积较大，需要和 Nacos 元数据存储分离。
- 企业已有统一制品库、加密存储或备份系统。
- 希望对内容读写的一致性、备份、迁移和留存策略做独立控制。

## 存储模型

AI 资源元数据会记录内容所在位置。存储层使用 `StorageKey` 表达这个位置：

```text
provider -> opaque key
```

| 概念 | 说明 |
| --- | --- |
| `provider` | 存储提供者类型，例如 `nacos_config`。 |
| opaque key | provider 自己理解的内容 key。上层不应解析它。 |
| content | 与资源版本关联的字节或文本内容。 |
| metadata | AI 资源元数据，不由存储插件维护。 |

`AiResourceStorageRouter` 根据 `provider` 路由到对应的 `AiResourceStorage`。provider 缺失或未注册时，读取和写入都应显式失败。

## 默认 provider

默认 provider 是 `nacos_config`。它通过 Nacos 配置存储保存 AI 资源内容，适合默认部署和中小规模资源内容。

内置插件身份为 `ai-storage:nacos_config`，默认启用、不声明 definitions，因此 `configurable=false`。AI 模块启用时，它通常是 active critical provider，不能在仍被任一资源域选择时禁用。

使用默认 provider 时仍要注意：

- AI 资源从用户视角仍是 Skill、Prompt、MCP 或 AgentSpec，不是普通配置。
- 配置加密、数据库、备份和容量策略可能间接影响默认存储。
- 大体积资源或高频下载场景，需要结合实际压测评估。

Prompt、Skill、AgentSpec 和 Agent 分别用以下模块路由键选择 provider：

```properties
nacos.ai.prompt.storage.provider=nacos_config
nacos.ai.skill.storage.provider=nacos_config
nacos.ai.agentspec.storage.provider=nacos_config
nacos.ai.agent.storage.provider=nacos_config
```

这些键是 AI 资源域路由策略，不是 `ai-storage:nacos_config` 的 definitions。AI 模块启用时，每个不同的选中 provider 都必须已发现且启用；其它可用 provider 不能作为回退。AI 功能模式关闭或 `nacos.extension.ai.enabled=false` 时，该类型不构成启动要求。

## 开发自定义存储

自定义存储插件依赖：

```xml
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-ai-plugin</artifactId>
    <version>${project.version}</version>
</dependency>
```

实现 `com.alibaba.nacos.plugin.ai.storage.spi.AiResourceStorageBuilder`，并通过 Java SPI 声明：

```text
META-INF/services/com.alibaba.nacos.plugin.ai.storage.spi.AiResourceStorageBuilder
```

核心方法：

| 方法 | 说明 |
| --- | --- |
| `type()` | 稳定 provider 类型。 |
| `build()` | 创建 `AiResourceStorage`。 |

`AiResourceStorage` 需要实现：

| 方法 | 说明 |
| --- | --- |
| `type()` | 运行时 provider 类型。 |
| `save(storageKey, content)` | 保存内容。 |
| `get(storageKey)` | 读取内容，不存在时返回空结果。 |
| `delete(storageKey)` | 删除内容。 |

`AiResourceStorage` 继承 `PluginConfigSpec`。有私有配置的实现应通过 definitions 声明，并使用 `nacos.plugin.ai-storage.{provider}.{itemKey}`；builder 只负责创建服务，definitions、`applyConfig` 和当前快照属于构建出的服务实例。旧二进制服务未声明 definitions 时仍可加载，但自动显示为不可配置。

## 实现要求

自定义 provider 应在文档和运维说明中明确：

- 单个内容对象的大小上限。
- `save` 成功后何时可读。
- `delete` 成功后何时不可读。
- 读取是一致读还是最终一致。
- 备份、迁移和跨集群复制方式。
- storage key 是否可以出现在 API 响应、日志或审计记录中。

存储插件不得修改资源元数据、版本状态、标签、可见性和鉴权结果。发布前审核仍由 [AI 发布 Pipeline 插件](./ai-pipeline-plugin.md) 负责。

## 状态和启动校验

统一插件状态已经接入 `AiResourceStorageRouter`。非 critical provider 被禁用后仍保持加载和可见，但新操作会失败。AI storage 实例在 Spring Context 刷新期间由 builder 注册，所以选中 provider 的 critical 校验会在注册完成后、Nacos 报告启动成功前执行。

## 排查

| 现象 | 排查方向 |
| --- | --- |
| 资源内容读取失败 | 检查元数据中的 provider、资源域选择键、插件是否加载且统一状态为启用。 |
| 上传成功但下载失败 | 检查 `save` 后的一致性、对象存储权限、网络和 key 生成逻辑。 |
| 删除后仍可下载 | 检查 provider 的删除一致性和缓存策略。 |
| 切换 provider 后旧资源不可读 | 检查迁移计划。旧版本资源仍会使用旧 provider 的 storage key。 |
