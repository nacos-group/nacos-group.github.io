---
title: AI 发布 Pipeline
keywords: [AI Pipeline, AI 管理中心, Skill, Prompt, MCP, AgentSpec]
description: 本文介绍 Nacos AI 发布 Pipeline 插件的使用场景、启用方式、执行模型和开发边界。
sidebar:
    order: 11
---

# AI 发布 Pipeline 插件

AI 发布 Pipeline 插件用于在 AI 资源发布前做审核、扫描或拦截。它适合放在生产发布链路上，帮助平台团队检查 Skill、Prompt、MCP Server、AgentSpec 等资源是否满足安全、格式或合规要求。

Pipeline 属于 AI 资源治理。它可以批准或拒绝一次发布操作，但不改变 AI 资源的命名空间、资源名、版本和可见性模型。

## 什么时候使用

建议在以下场景启用 Pipeline：

- Skill 包需要安全扫描，避免引入危险脚本、越权访问或不符合企业规范的内容。
- Prompt、AgentSpec 或 MCP Server 需要经过格式校验、合规检查或人工流程。
- 生产环境希望把“创建草稿”和“正式发布”隔离开。
- 管理员需要看到每次发布审核的结果和失败原因。

如果没有启用 Pipeline，资源提交后可能直接进入可发布或上线状态。是否直接发布由具体资源类型和当前控制台流程决定。

## 执行模型

Pipeline 是有序链式插件。一次发布会按资源类型选择匹配的 Pipeline 节点，并按 `getPreferOrder()` 升序执行。

```text
提交发布
  -> 创建 Pipeline 执行记录
  -> 按顺序执行节点
  -> 全部通过：发布继续
  -> 任一拒绝：发布停止，版本保持未发布状态
```

执行时需要注意：

- Pipeline 只处理被配置且支持目标资源类型的节点。
- 某个节点拒绝后，后续节点不会继续执行。
- Pipeline 关闭或没有匹配节点时，发布流程不会被 Pipeline 拦截。
- 管理员的强制发布会跳过 Pipeline 校验。它适合应急，不适合日常发布。

当前统一插件管理可以列出已加载的 `ai-pipeline` 插件。但在执行链路完全接入统一启停状态前，Pipeline 是否参与发布主要由 Pipeline 自身配置控制。

## 启用内置 skill-scanner

Nacos 默认插件集合中提供了 `skill-scanner` Pipeline 节点。它可以处理 Skill、Prompt、AgentSpec 中可扫描的内容，常见场景是接入外部 Skill 扫描工具。

在 `${nacos.home}/conf/application.properties` 中启用：

```properties
nacos.plugin.ai-pipeline.enabled=true
nacos.plugin.ai-pipeline.type=skill-scanner
nacos.plugin.ai-pipeline.skill-scanner.enabled=true
nacos.plugin.ai-pipeline.skill-scanner.command=/path/to/skill-scanner
```

配置含义：

| 配置项 | 说明 |
| --- | --- |
| `nacos.plugin.ai-pipeline.enabled` | 是否启用 AI Pipeline。 |
| `nacos.plugin.ai-pipeline.type` | 参与执行的 Pipeline 节点类型。 |
| `nacos.plugin.ai-pipeline.skill-scanner.enabled` | 是否启用 `skill-scanner` 节点。 |
| `nacos.plugin.ai-pipeline.skill-scanner.command` | Skill 扫描工具命令路径。 |

生产环境应在所有 Nacos Server 节点上使用相同插件版本和相同配置。扫描命令依赖外部可执行文件时，也要保证每个节点都能访问该命令。

## 开发自定义 Pipeline

自定义 Pipeline 节点依赖：

```xml
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-ai-plugin</artifactId>
    <version>${project.version}</version>
</dependency>
```

实现 `com.alibaba.nacos.plugin.ai.pipeline.spi.PublishPipelineServiceBuilder`，并通过 Java SPI 声明：

```text
META-INF/services/com.alibaba.nacos.plugin.ai.pipeline.spi.PublishPipelineServiceBuilder
```

核心方法：

| 方法 | 说明 |
| --- | --- |
| `pipelineId()` | 稳定节点 ID，用于配置、日志和执行记录。 |
| `build(properties)` | 根据配置创建 `PublishPipelineService`。 |

`PublishPipelineService` 需要提供：

| 方法 | 说明 |
| --- | --- |
| `pipelineId()` | 运行时节点 ID。 |
| `execute(context)` | 执行审核逻辑，返回通过或拒绝。 |
| `getPreferOrder()` | 节点执行顺序，值越小越早执行。 |
| `pipelineResourceTypes()` | 支持的资源类型，如 Skill、Prompt、MCP 或 AgentSpec。 |

## 开发建议

- 让同一资源版本和同一输入得到确定结果，避免审核结果随机变化。
- 调用外部系统时必须设置超时。不要让发布链路无限等待。
- 拒绝发布时返回可读的原因，方便资源作者修复。
- 不要在 Pipeline 中修改资源内容。需要修改内容时，应回到草稿编辑流程。
- 不要在日志中输出完整 Skill 包、Prompt 内容、密钥或凭证。

## 排查

| 现象 | 排查方向 |
| --- | --- |
| 提交后没有进入审核 | 检查 `nacos.plugin.ai-pipeline.enabled` 和 `nacos.plugin.ai-pipeline.type` 是否配置。 |
| `skill-scanner` 未执行 | 检查 `skill-scanner.enabled`、扫描命令路径和插件 JAR 是否在 classpath 中。 |
| 发布一直失败 | 查看 Pipeline 执行记录，确认是哪一个节点拒绝，并检查返回原因。 |
| 统一插件管理显示已禁用但仍执行 | 以当前版本的 Pipeline 配置为准。统一启停状态尚未完全接入执行链路。 |

相关内容可继续阅读 [AI 资源生命周期](../manual/user/ai/ai-resource-lifecycle.md) 和 [AI 资源导入插件](./ai-resource-import-plugin.md)。
