---
title: AI 发布 Pipeline
keywords: [AI Pipeline, AI 管理中心, Skill, Prompt, AgentSpec]
description: 本文介绍 Nacos AI 发布 Pipeline 插件的执行模型、内置实现、配置和开发方式。
sidebar:
    order: 14
---

# AI 发布 Pipeline 插件

AI 发布 Pipeline 在 AI 资源发布前执行审核、扫描或拦截。它可以批准或拒绝发布，但不能改变资源的规范身份、版本或可见性。

统一插件类型为 `ai-pipeline`，执行模式为 `CHAIN`，加载阶段为 `STANDARD`，类型非 critical。一次发布会筛选支持目标资源类型且状态启用的节点，再按 `getPreferOrder()` 升序串行执行；任一节点拒绝后停止剩余节点并保存结果。

## 开关、状态和加载

三类控制项职责不同：

| 配置或状态 | 职责 |
| --- | --- |
| `nacos.plugin.ai-pipeline.enabled` | AI 模块拥有的动态总开关。为 `false` 时延迟加载该类型；切换为 `true` 后才发现服务、恢复状态并应用配置。 |
| `nacos.plugin.ai-pipeline.type` | 历史启动链组成，只在没有持久化状态时初始化实现状态。 |
| `ai-pipeline:{pipelineId}` 状态 | 当前链成员的权威来源。禁用节点仍保留在清单中，但不参与发布。 |
| `nacos.plugin.ai-pipeline.{pipelineId}.{itemKey}` | 节点通过 `PluginConfigSpec` 声明和消费的私有配置。 |

总开关关闭或没有匹配节点时，发布不被 Pipeline 拦截。服务实例必须保持轻量，在第一次 `applyConfig` 前不要初始化 CLI、连接或线程等运行资源。

## 内置节点

Nacos 内置以下两个节点，均支持 `SKILL`、`AGENTSPEC` 和 `PROMPT`：

| pluginId | 默认状态 | 作用 |
| --- | --- | --- |
| `ai-pipeline:skill-scanner` | 启用 | 调用 `skill-scanner` CLI 扫描资源。 |
| `ai-pipeline:skill-spector` | 启用 | 调用 `skill-spector` CLI 进行静态和可选 LLM 风险分析。 |

### skill-scanner definitions

标准前缀为 `nacos.plugin.ai-pipeline.skill-scanner.`：

| key | aliases | 类型 | 默认值 | sensitive | effectMode |
| --- | --- | --- | --- | --- | --- |
| `order` | 无 | NUMBER | `100` | 否 | RUNTIME |
| `command` | `executable`, `path` | STRING | `skill-scanner` | 否 | RESTART |
| `use-llm` | `useLlm` | BOOLEAN | `false` | 否 | RESTART |
| `llm-api-key` | `llmApiKey` | STRING | 空 | 是 | RESTART |
| `llm-model` | `llmModel` | STRING | 空 | 否 | RESTART |
| `llm-provider` | `llmProvider` | STRING | 空 | 否 | RESTART |
| `enable-meta` | `enableMeta` | BOOLEAN | `false` | 否 | RESTART |

示例：

```properties
nacos.plugin.ai-pipeline.enabled=true
nacos.plugin.ai-pipeline.skill-scanner.command=/opt/scanners/skill-scanner
nacos.plugin.ai-pipeline.skill-scanner.use-llm=true
nacos.plugin.ai-pipeline.skill-scanner.llm-api-key=${SKILL_SCANNER_API_KEY}
```

### skill-spector definitions

标准前缀为 `nacos.plugin.ai-pipeline.skill-spector.`：

| key | aliases | 类型 | 默认值 | sensitive | effectMode |
| --- | --- | --- | --- | --- | --- |
| `order` | 无 | NUMBER | `90` | 否 | RUNTIME |
| `command` | `executable`, `path` | STRING | `skill-spector` | 否 | RESTART |
| `use-llm` | `useLlm` | BOOLEAN | `false` | 否 | RESTART |
| `provider` | 无 | STRING | 空 | 否 | RESTART |
| `model` | 无 | STRING | 空 | 否 | RESTART |
| `api-key` | `apiKey` | STRING | 空 | 是 | RESTART |
| `base-url` | `baseUrl` | STRING | 空 | 否 | RESTART |
| `log-level` | `logLevel` | STRING | `WARNING` | 否 | RESTART |
| `risk-score-threshold` | `riskScoreThreshold` | NUMBER | `50` | 否 | RESTART |
| `max-findings` | `maxFindings` | NUMBER | `20` | 否 | RESTART |

`risk-score-threshold` 限制为 `0..100`；`max-findings` 最大为 `100`，零、负数或无效值使用默认值。现有进程环境变量优先于从 SkillSpector 插件配置复制的值。

除 `order` 外，两个内置节点都会在首次应用配置时解析命令并创建不可变扫描选项，因此这些字段需要重启。敏感 API key 在详情响应中脱敏。找不到命令时节点仍可查询，但实际扫描会拒绝发布并提示安装。

## 开发自定义 Pipeline

依赖：

```xml
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-ai-plugin</artifactId>
    <version>${project.version}</version>
</dependency>
```

直接实现 `com.alibaba.nacos.plugin.ai.pipeline.spi.PublishPipelineService`，提供 public 无参构造方法，并通过以下 Java SPI 注册：

```text
META-INF/services/com.alibaba.nacos.plugin.ai.pipeline.spi.PublishPipelineService
```

| 方法 | 说明 |
| --- | --- |
| `pipelineId()` | 稳定节点名，组成 `ai-pipeline:{pipelineId}`。 |
| `execute(context)` | 执行审核并返回通过或拒绝。 |
| `getPreferOrder()` | 链顺序，值越小越早。 |
| `pipelineResourceTypes()` | 支持的资源类型。 |
| `getConfigDefinitions()` | 声明 definitions。 |
| `applyConfig(config)` | 原子应用完整有效 item map。 |
| `getCurrentConfig()` | 返回已接受配置快照。 |

旧 `PublishPipelineServiceBuilder` SPI 和任意 `Properties` 构建路径已经移除。旧插件必须迁移为服务本身实现 `PluginConfigSpec`；不能只替换 SPI 注册文件而保留 builder。

## 运维建议

- 所有节点保持相同的插件 JAR、CLI 和 RESTART 配置；`order` 可通过统一 PUT 配置在运行时调整。
- 外部命令设置超时并返回可读拒绝原因，不要在日志中输出资源全文或凭据。
- 用详情页确认 `effectiveConfig`、来源和当前快照；修改 RESTART 字段后重启所有节点。
- Pipeline 结果是发布治理记录，不替代资源鉴权、可见性或内容存储。

相关内容：[插件运维](./operations.md)、[插件开发](./development.md)、[AI 资源生命周期](../manual/user/ai/ai-resource-lifecycle.md)。
