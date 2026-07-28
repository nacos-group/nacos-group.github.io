---
title: AI Storage
keywords: [AI Storage, AI Registry, Plugin]
description: Learn the responsibility, default provider, routing model, and extension boundary of the Nacos AI storage plugin.
sidebar:
    order: 16
---

# AI Storage Plugin

The AI storage plugin stores binary or text content associated with AI resource versions. It only reads, writes, and deletes content by storage key. AI resource metadata, versions, labels, visibility, and lifecycle are still owned by AI Registry.

This boundary matters. A storage plugin is not a new AI resource model. It is only a content backend.

Its unified type is `ai-storage`, execution mode is `ROUTED`, load phase is `STANDARD`, and the type is critical. A plugin identity is `ai-storage:{provider}`. The router checks unified state before every operation; a disabled provider fails explicitly instead of falling back to another discovered implementation.

## When To Care

By default, Nacos uses the `nacos_config` provider to store AI resource content. Most deployments do not need to change it.

Consider a custom AI storage plugin when:

- Skill packages, AgentSpec packages, or similar content should be stored in object storage.
- Large content should be separated from Nacos metadata storage.
- Your organization already has a unified artifact, encrypted storage, or backup system.
- You need independent consistency, backup, migration, or retention policies for content.

## Storage Model

AI resource metadata records where content is stored. Storage uses `StorageKey`:

```text
provider -> opaque key
```

| Concept | Description |
| --- | --- |
| `provider` | Storage provider type, such as `nacos_config`. |
| opaque key | Provider-specific content key. Upper layers should not parse it. |
| content | Bytes or text associated with a resource version. |
| metadata | AI resource metadata. It is not maintained by the storage plugin. |

`AiResourceStorageRouter` routes by `provider`. If the provider is missing or not registered, reads and writes should fail explicitly.

## Default Provider

The default provider is `nacos_config`. It stores AI resource content through Nacos config storage and is suitable for default deployments and small to medium content.

Its built-in identity is `ai-storage:nacos_config`. It is enabled by default, declares no definitions, and is reported as `configurable=false`. When the AI module is active, it is normally an active critical provider and cannot be disabled while any resource domain still selects it.

Notes:

- From the user perspective, the AI resource is still a Skill, Prompt, MCP Server, or AgentSpec. It is not a normal config item.
- Configuration encryption, database, backup, and capacity settings may indirectly affect the default storage.
- For large content or high-frequency downloads, validate the deployment with real load tests.

Prompt, Skill, AgentSpec, and Agent select providers independently through module routing keys:

```properties
nacos.ai.prompt.storage.provider=nacos_config
nacos.ai.skill.storage.provider=nacos_config
nacos.ai.agentspec.storage.provider=nacos_config
nacos.ai.agent.storage.provider=nacos_config
```

These are AI domain routing policy, not definitions owned by `ai-storage:nacos_config`. When the AI module is active, every distinct selected provider must be discovered and enabled; another available provider is not a fallback. When AI function mode is off or `nacos.extension.ai.enabled=false`, this type does not impose a startup requirement.

## Develop Custom Storage

Add the dependency:

```xml
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-ai-plugin</artifactId>
    <version>${project.version}</version>
</dependency>
```

Implement `com.alibaba.nacos.plugin.ai.storage.spi.AiResourceStorageBuilder` and declare it with Java SPI:

```text
META-INF/services/com.alibaba.nacos.plugin.ai.storage.spi.AiResourceStorageBuilder
```

Builder methods:

| Method | Description |
| --- | --- |
| `type()` | Stable provider type. |
| `build()` | Creates an `AiResourceStorage`. |

`AiResourceStorage` methods:

| Method | Description |
| --- | --- |
| `type()` | Runtime provider type. |
| `save(storageKey, content)` | Saves content. |
| `get(storageKey)` | Reads content. Missing content returns empty result. |
| `delete(storageKey)` | Deletes content. |

`AiResourceStorage` inherits `PluginConfigSpec`. An implementation with private settings declares definitions under `nacos.plugin.ai-storage.{provider}.{itemKey}`. The builder only creates the service; definitions, `applyConfig`, and the current snapshot belong to the built service instance. An older binary service without definitions still loads but is automatically reported as not configurable.

## Implementation Requirements

A custom provider should document:

- Maximum object size.
- When content becomes readable after `save`.
- When content becomes unreadable after `delete`.
- Whether reads are strongly consistent or eventually consistent.
- Backup, migration, and cross-cluster replication.
- Whether storage keys may appear in API responses, logs, or audit records.

The storage plugin must not modify resource metadata, version status, labels, visibility, or auth results. Publish review is still handled by the [AI Publish Pipeline Plugin](./ai-pipeline-plugin.md).

## State and Startup Validation

Unified state is wired into `AiResourceStorageRouter`. A disabled non-critical provider remains loaded and visible, but new operations fail. AI storage instances are registered by builders during Spring context refresh, so critical validation of selected providers runs after registration and before Nacos reports startup success.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Resource content cannot be read | Check the provider in metadata, the domain selector, plugin loading, and unified enabled state. |
| Upload succeeds but download fails | Check post-save consistency, object storage permission, network, and key generation. |
| Content is still downloadable after deletion | Check delete consistency and cache policy in the provider. |
| Old resources cannot be read after provider migration | Check the migration plan. Existing versions still use the old provider and storage key. |
