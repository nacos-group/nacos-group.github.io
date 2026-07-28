---
title: AI Publish Pipeline
keywords: [AI Pipeline, AI Registry, Skill, Prompt, AgentSpec]
description: Learn the execution model, built-in implementations, configuration, and development contract of Nacos AI publish pipeline plugins.
sidebar:
    order: 14
---

# AI Publish Pipeline Plugin

The AI publish pipeline runs review, scanning, or interception before an AI resource is published. It may approve or reject publication, but it cannot change the resource's canonical identity, version, or visibility.

Its unified type is `ai-pipeline`, execution mode is `CHAIN`, load phase is `STANDARD`, and the type is non-critical. For each publication, Nacos selects enabled nodes supporting the resource type and runs them serially by `getPreferOrder()` in ascending order. A rejection stops the remaining nodes and persists the result.

## Gate, State, and Loading

These controls have separate owners:

| Configuration or state | Responsibility |
| --- | --- |
| `nacos.plugin.ai-pipeline.enabled` | Dynamic family gate owned by the AI module. When false, type loading is deferred; enabling discovers services, restores state, and applies configuration. |
| `nacos.plugin.ai-pipeline.type` | Legacy startup chain composition, used only to initialize implementation state when no persisted state exists. |
| `ai-pipeline:{pipelineId}` state | Authoritative current chain membership. A disabled node remains in inventory but does not run. |
| `nacos.plugin.ai-pipeline.{pipelineId}.{itemKey}` | Private configuration declared and consumed by the node through `PluginConfigSpec`. |

When the family gate is off or no node matches, publication proceeds without interception. Service instances must remain lightweight and defer CLI, connection, or thread initialization until their first `applyConfig`.

## Built-in Nodes

Nacos bundles two nodes. Both support `SKILL`, `AGENTSPEC`, and `PROMPT`:

| pluginId | Default state | Purpose |
| --- | --- | --- |
| `ai-pipeline:skill-scanner` | Enabled | Invokes the `skill-scanner` CLI. |
| `ai-pipeline:skill-spector` | Enabled | Invokes the `skill-spector` CLI for static and optional LLM risk analysis. |

### skill-scanner definitions

The canonical prefix is `nacos.plugin.ai-pipeline.skill-scanner.`:

| key | aliases | type | default | sensitive | effectMode |
| --- | --- | --- | --- | --- | --- |
| `order` | None | NUMBER | `100` | No | RUNTIME |
| `command` | `executable`, `path` | STRING | `skill-scanner` | No | RESTART |
| `use-llm` | `useLlm` | BOOLEAN | `false` | No | RESTART |
| `llm-api-key` | `llmApiKey` | STRING | empty | Yes | RESTART |
| `llm-model` | `llmModel` | STRING | empty | No | RESTART |
| `llm-provider` | `llmProvider` | STRING | empty | No | RESTART |
| `enable-meta` | `enableMeta` | BOOLEAN | `false` | No | RESTART |

Example:

```properties
nacos.plugin.ai-pipeline.enabled=true
nacos.plugin.ai-pipeline.skill-scanner.command=/opt/scanners/skill-scanner
nacos.plugin.ai-pipeline.skill-scanner.use-llm=true
nacos.plugin.ai-pipeline.skill-scanner.llm-api-key=${SKILL_SCANNER_API_KEY}
```

### skill-spector definitions

The canonical prefix is `nacos.plugin.ai-pipeline.skill-spector.`:

| key | aliases | type | default | sensitive | effectMode |
| --- | --- | --- | --- | --- | --- |
| `order` | None | NUMBER | `90` | No | RUNTIME |
| `command` | `executable`, `path` | STRING | `skill-spector` | No | RESTART |
| `use-llm` | `useLlm` | BOOLEAN | `false` | No | RESTART |
| `provider` | None | STRING | empty | No | RESTART |
| `model` | None | STRING | empty | No | RESTART |
| `api-key` | `apiKey` | STRING | empty | Yes | RESTART |
| `base-url` | `baseUrl` | STRING | empty | No | RESTART |
| `log-level` | `logLevel` | STRING | `WARNING` | No | RESTART |
| `risk-score-threshold` | `riskScoreThreshold` | NUMBER | `50` | No | RESTART |
| `max-findings` | `maxFindings` | NUMBER | `20` | No | RESTART |

`risk-score-threshold` is clamped to `0..100`. `max-findings` is capped at `100`, and zero, negative, or invalid values use the default. Existing process environment variables take precedence over values copied from SkillSpector plugin configuration.

Except for `order`, both built-in nodes resolve their command and create immutable scan options on first configuration application, so these fields require restart. Sensitive API keys are masked in detail responses. If the command cannot be found, the node remains queryable, but an attempted scan rejects publication with an installation hint.

## Develop a Custom Pipeline

Dependency:

```xml
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-ai-plugin</artifactId>
    <version>${project.version}</version>
</dependency>
```

Directly implement `com.alibaba.nacos.plugin.ai.pipeline.spi.PublishPipelineService`, provide a public no-argument constructor, and register it through:

```text
META-INF/services/com.alibaba.nacos.plugin.ai.pipeline.spi.PublishPipelineService
```

| Method | Requirement |
| --- | --- |
| `pipelineId()` | Stable node name used in `ai-pipeline:{pipelineId}`. |
| `execute(context)` | Run review and return approval or rejection. |
| `getPreferOrder()` | Chain order; lower values run first. |
| `pipelineResourceTypes()` | Supported resource types. |
| `getConfigDefinitions()` | Declare definitions. |
| `applyConfig(config)` | Atomically accept the complete effective item map. |
| `getCurrentConfig()` | Return the accepted snapshot. |

The former `PublishPipelineServiceBuilder` SPI and arbitrary `Properties` construction path have been removed. Existing plugins must migrate so the service itself implements `PluginConfigSpec`; replacing only the SPI registration while retaining a builder is insufficient.

## Operations Guidance

- Keep plugin JARs, CLIs, and RESTART configuration identical on all nodes. `order` can be changed through the unified PUT configuration API at runtime.
- Set timeouts for external commands and return readable rejection reasons. Do not log full resources or credentials.
- Use plugin detail to verify `effectiveConfig`, sources, and the accepted snapshot. Restart every node after changing RESTART fields.
- Pipeline results are publication governance records; they do not replace authorization, visibility, or content storage.

Related reading: [Plugin Operations](./operations.md), [Plugin Development](./development.md), and [AI Resource Lifecycle](../manual/user/ai/ai-resource-lifecycle.md).
