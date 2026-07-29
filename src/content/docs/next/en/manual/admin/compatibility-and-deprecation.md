---
title: Compatibility And Deprecation
keywords: [Nacos, Compatibility, Deprecation, Migration, Legacy]
description: Understand Nacos compatibility capabilities, deprecated capabilities, and migration entry points.
sidebar:
    order: 8
---

# Compatibility And Deprecation

As Nacos evolves, some compatibility capabilities remain available to help users upgrade and migrate. They are not the recommended model for new usage. New integrations and new development should prefer the canonical capabilities described in the current documentation.

## How to read status

| Status | Meaning | User guidance |
| --- | --- | --- |
| Canonical | The currently recommended API, SDK, configuration, or resource model. | Use it for new systems. |
| Compatibility-only | Retained to avoid breaking existing users. | Use only during migration. Do not expand reliance on it. |
| Deprecated | Still available, but may be removed later. | Migrate to the replacement as soon as possible. |
| Pending removal | Deprecated, with a known removal direction or condition. | Make a migration plan. Do not use it for new rollouts. |
| Experimental | Not promised as stable behavior yet. | Validate in a small scope and accept possible incompatible changes. |

## Common compatibility entry points

| Scenario | Current guidance | Continue reading |
| --- | --- | --- |
| v1/v2 HTTP APIs | Migrate to v3 OpenAPI or current SDKs. If a migration window is required, use the legacy adapter temporarily. | [Upgrading Manual](./upgrading.mdx), [OpenAPI Overview](../user/overview/api-overview.md) |
| Compatibility switches | Enable them only during upgrade or migration windows. Disable them after the system becomes stable. | [System Configurations](./system-configurations.md) |
| Beta/Tag gray release compatibility | Starting with Nacos 3.3, legacy `config_info_beta` and `config_info_tag` tables are no longer migrated automatically. Migrate them to the current `config_info_gray` gray model before upgrade. Current beta/tag APIs remain backed by `config_info_gray` and `GrayRule`. | [Upgrading Manual](./upgrading.mdx), [Configuration Gray Release](../user/config/gray-release.md) |
| Default namespace migration | Starting with Nacos 3.3, storage migration or double-write between empty tenant values and `public` is no longer automatic. Blank or omitted namespace requests are still normalized to the default namespace `public`. | [Upgrading Manual](./upgrading.mdx), [Java SDK Usage](../user/java-sdk/usage.md#13-upgrade-compatibility) |
| Plugin management refactor | Migrate to `pluginType:pluginName`, canonical definition keys, and unified state. The old AI Resource Import two-level SPI/source/preset model is removed. | [Plugin Migration](../../plugin/migration.md), [AI Resource Import Plugin](../../plugin/ai-resource-import-plugin.md) |
| Legacy console | Use only for compatibility with existing habits. New deployments should use the new console. | [Console Manual](./console.md#legacy-console) |
| Deprecated Java SDK properties | Do not use them in new systems. | [Java SDK Properties](../user/java-sdk/properties.md) |
| Deprecated CLI commands | Use explicit lifecycle commands instead of shortcut publish commands. | [Nacos CLI User Guide](./nacos-cli.md) |
| Experimental features | Use only when you accept the change risk. | [Experimental Features Overview](../../experimental/overview.md) |

## Nacos 3.3 Config Compatibility Migration Removal

Nacos 3.3 removes runtime compatibility migration logic for Config data from versions before 3.0, including default-namespace storage migration between legacy empty tenant values and `public`, migration from legacy `config_info_beta`/`config_info_tag` tables to `config_info_gray`, and the related double-write and mixed-version synchronization logic.

When upgrading from versions before 3.0 to 3.3, if the old deployment did not use the default namespace and did not use beta gray release, this compatibility removal does not affect smooth upgrade for this compatibility area. If the old deployment used the default namespace or beta gray release, operators must complete data migration before upgrading to 3.3: migrate default-namespace data from the empty tenant to `public`, and migrate legacy beta/tag gray data to the current `config_info_gray` gray model.

This does not remove current default namespace semantics or current beta/tag gray APIs. Blank or omitted namespace requests are still normalized to `public`; current beta/tag gray behavior remains backed by `config_info_gray` and `GrayRule`.

## Plugin Management and AI Resource Import Breaking Change

The next line uses unified plugin identity, state, configuration sources, and lifecycle. A historical implementation without `PluginConfigSpec` still loads but is automatically reported as `configurable=false`. Config Change's `ConfigChangeConfigs` is deprecated but remains in its compatibility window.

AI Resource Import requires an incompatible migration: `AiResourceImportSource`, the Source Provider SPI, presets, `nacos.ai.resource.import.sources[N].*`, and cloning one implementation to multiple endpoints through configuration are removed. One `pluginName` now identifies one fixed source, and `sourceId` equals the managed pluginName. The existing API field named `pluginName` continues to mean importerType. New deployments use `nacos.plugin.ai-resource-import.*`; see [Plugin Migration](../../plugin/migration.md).

## What to confirm before using compatibility capabilities

- Whether the capability is only for temporary upgrade or migration use.
- Whether there is a replacement API, SDK, configuration, or resource model.
- Whether it changes authentication, visibility, response shape, performance, or data consistency.
- Whether it requires an extra plugin, adapter, or standalone component.
- How to disable the compatibility switch or remove the compatibility component after migration.

## Not recommended

- Depending on old APIs or deprecated SDK methods in new business.
- Treating compatibility fields as new resource semantics.
- Keeping short-term compatibility switches enabled for a long time without migration.
- Using Console API as a long-term stable automation interface.
- Treating experimental features as stable production capabilities.

## Related documents

- [Upgrading Manual](./upgrading.mdx)
- [System Configurations](./system-configurations.md)
- [OpenAPI Overview](../user/overview/api-overview.md)
- [Console Manual](./console.md)
- [Experimental Features Overview](../../experimental/overview.md)
