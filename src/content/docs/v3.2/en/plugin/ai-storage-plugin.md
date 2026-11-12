---
title: AI Storage
keywords: [AI Storage, AI Registry, Plugin]
description: Learn the responsibility, default provider, routing model, and extension boundary of the Nacos AI storage plugin.
sidebar:
    order: 13
---

# AI Storage Plugin

The AI storage plugin stores binary or text content associated with AI resource versions. It only reads, writes, and deletes content by storage key. AI resource metadata, versions, labels, visibility, and lifecycle are still owned by AI Registry.

This boundary matters. A storage plugin is not a new AI resource model. It is only a content backend.

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

Notes:

- From the user perspective, the AI resource is still a Skill, Prompt, MCP Server, or AgentSpec. It is not a normal config item.
- Configuration encryption, database, backup, and capacity settings may indirectly affect the default storage.
- For large content or high-frequency downloads, validate the deployment with real load tests.

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

## Implementation Requirements

A custom provider should document:

- Maximum object size.
- When content becomes readable after `save`.
- When content becomes unreadable after `delete`.
- Whether reads are strongly consistent or eventually consistent.
- Backup, migration, and cross-cluster replication.
- Whether storage keys may appear in API responses, logs, or audit records.

The storage plugin must not modify resource metadata, version status, labels, visibility, or auth results. Publish review is still handled by the [AI Publish Pipeline Plugin](./ai-pipeline-plugin.md).

## Current Integration Note

Unified plugin management can list loaded `ai-storage` plugins. In the current version, unified enablement is not fully wired into `AiResourceStorageRouter`. Until that is completed, routing is controlled by registered storage providers.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Resource content cannot be read | Check whether the provider in metadata exists and whether the target storage plugin is loaded. |
| Upload succeeds but download fails | Check post-save consistency, object storage permission, network, and key generation. |
| Content is still downloadable after deletion | Check delete consistency and cache policy in the provider. |
| Old resources cannot be read after provider migration | Check the migration plan. Existing versions still use the old provider and storage key. |
