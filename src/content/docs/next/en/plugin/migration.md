---
title: Plugin Migration Guide
keywords: [Plugin Migration, Configuration Migration, AI Resource Import, ConfigChangeConfigs, Compatibility]
description: Migrate historical plugin selection keys, private configuration, and the old AI Resource Import SPI to unified plugin management.
sidebar:
    order: 4
---

# Plugin Migration Guide

Unified plugin management separates four layers: module entry, implementation selection, implementation enabled state, and implementation-owned configuration. Classify existing settings into these layers before upgrading. Do not convert a historical family-wide gate into a private definition or implementation state.

## General migration

1. Record plugin JARs, implementation names, module gates, selection keys, enabled keys, and private properties.
2. Map every implementation to a stable `pluginType:pluginName`.
3. Move `EXCLUSIVE` selection to `nacos.plugin.{pluginType}.type`.
4. Move implementation config to `nacos.plugin.{pluginType}.{pluginName}.{itemKey}`.
5. Keep aliases for one compatibility window and monitor migration WARN logs; remove them after canonical keys are verified.
6. Roll out the plugin and static config first, then inspect effective source in plugin detail.
7. Restart nodes for `RESTART` fields; do not try to update them with PUT APIs.

Canonical keys win when an alias is also present. API aliases are normalized, and `plugin-configs.json` and local-only maps store only canonical item keys.

## Implementation selection

| pluginType | Standard key | Historical alias | Default/behavior |
| --- | --- | --- | --- |
| `auth` | `nacos.plugin.auth.type` | `nacos.core.auth.system.type` | Default `nacos`. |
| `datasource-dialect` | `nacos.plugin.datasource-dialect.type` | `spring.sql.init.platform` | Standalone/embedded defaults to `derby`; ordinary cluster mode defaults to `mysql`. `spring.datasource.platform` is removed. |
| `control` | `nacos.plugin.control.type` | `nacos.plugin.control.manager.type` | Empty means no-limit. |

All selections are snapshotted at startup. Do not use the status API to switch an exclusive implementation.

## Auth, Visibility, and AI Pipeline

- Move default auth settings from `nacos.core.auth.plugin.nacos.*` and `nacos.core.auth.caching.enabled` to `nacos.plugin.auth.nacos.*`.
- Move LDAP from `nacos.core.auth.ldap.*` to `nacos.plugin.auth.ldap.*`. The unused `nacos.core.auth.ldap.userdn` template key is not a valid alias.
- Move OIDC from `nacos.core.auth.plugin.oidc.*` to `nacos.plugin.auth.oidc.*`. All current fields are `RESTART`.
- `nacos.plugin.visibility.enabled` remains the capability gate; `nacos.plugin.visibility.type` is only historical initial selection. Implementation state belongs to unified `visibility:{name}` state.
- `nacos.plugin.ai-pipeline.enabled` remains the Pipeline gate. Historical `nacos.plugin.ai-pipeline.type` supplies only initial chain state at startup. Use unified state for later membership and per-node definitions for configuration.

## Config Change

A new Config Change implementation declares `PluginConfigSpec` directly on `ConfigChangePluginService`:

```text
nacos.plugin.config-change.{pluginName}.{itemKey}
```

Historical `nacos.core.config.plugin.{pluginName}.*` properties remain available during the compatibility window only for old implementations without definitions. Historical `{name}.enabled` is used only to initialize unified state when no persisted state exists. `ConfigChangeConfigs` is deprecated. New implementations must not depend on it or treat `PLUGIN_PROPERTIES` as a second enabled gate.

Old binary plugins still load but show `configurable=false`. A migration release should add definitions, `applyConfig`, and a current snapshot.

## AI Resource Import breaking change

AI Resource Import has replaced the former "Importer plus clonable Source/preset" model with one Builder for one fixed source:

```text
ai-resource-import:{pluginName}
sourceId = managed pluginName
```

New gates and configuration:

```properties
nacos.plugin.ai-resource-import.enabled=true
nacos.plugin.ai-resource-import.{pluginName}.enabled=true
nacos.plugin.ai-resource-import.{pluginName}.{itemKey}=value
```

Remove or rewrite these legacy concepts:

- `nacos.plugin.ai.importer.*`
- `nacos.ai.resource.import.sources[N].*`
- `AiResourceImportSource`
- `AiResourceImportSourceProvider` and the Source Provider SPI
- the preset source model
- cloning one importer to multiple endpoints through configuration

The existing API `sourceId` is now the managed `pluginName`. The API `pluginName` field remains importer/protocol metadata for Console compatibility. One `pluginName` represents exactly one source. To add a second enterprise endpoint, ship another `AiResourceImportServiceBuilder` with a distinct `pluginName`.

The Builder itself implements `PluginConfigSpec` and provides `pluginName()`, `importerType()`, display metadata, supported resource types, definitions, `applyConfig`, current snapshot, and no-argument `build()`. A request-scoped service is created from the accepted immutable snapshot; requests no longer carry source configuration or arbitrary endpoints.

Built-in sources:

| pluginId | Importer type | Default implementation state | Endpoint |
| --- | --- | --- | --- |
| `ai-resource-import:mcp-official` | `mcp-registry` | enabled | Fixed official MCP Registry |
| `ai-resource-import:mcp-registry-protocol` | `mcp-registry` | disabled | Operator configuration required |
| `ai-resource-import:skills-sh` | `skills-sh` | enabled | Fixed `https://skills.sh` |
| `ai-resource-import:skills-well-known` | `skills-well-known` | disabled | Operator configuration required |

`mcp-official` and `skills-sh` retain their Console display names and the user search-select-validate-import experience. Effective historical `nacos.plugin.ai.importer.*` display, description, limit, state, and configurable endpoint keys remain aliases for one migration window. Fixed-source endpoint overrides, `auth-ref`, source/global timeouts, `max-page-count`, `block-private-network`, global defaults, and arbitrary `properties.*` are removed.

There is no compatibility adapter for the old Importer/Source SPI. External implementations must be recompiled and migrated. See [AI Resource Import](./ai-resource-import-plugin.md) for definitions and examples.

## Rollout and rollback

- Verify plugin list/detail, effective sources, sensitive masking, and `RESTART` guidance on one node first.
- During a rolling upgrade, do not submit runtime config that requires new definitions until every node runs the new plugin.
- Monitor alias WARN logs in the first release, then remove old keys in the next maintenance window.
- Before rollback, clear runtime overrides understood only by the new version.
- The old AI Resource Import SPI has no adapter. Roll back plugin JARs, configuration, and callers together; do not mix the two models.
