---
title: Plugin System Overview
keywords: [Plugin, PluginType, SPI, PluginConfigSpec, Plugin Management]
description: Learn the unified Nacos plugin identity, execution modes, state, configuration, lifecycle, and all current server plugin types.
sidebar:
    order: 1
---

# Plugin System Overview

Nacos uses plugins to separate replaceable capabilities such as authentication, database dialects, visibility, auditing, traffic control, and AI extensions from core domain models. A server plugin supplies behavior through a domain SPI and participates in unified inventory, state, configuration, and diagnostics.

This document covers server plugins managed by the unified system. Java client extensions such as `ClientAuthService`, `IConfigFilter`, and `ServerListProvider` run in client processes and do not appear in the server plugin APIs or Console.

## Plugin identity

Every server plugin is uniquely identified by a type and implementation name:

```text
pluginId = pluginType:pluginName
```

For example, the default auth plugin is `auth:nacos`, LDAP auth is `auth:ldap`, and the official MCP import source is `ai-resource-import:mcp-official`.

- `pluginType` is an extension category in the Nacos `PluginType` registry.
- `pluginName` is a stable, unique implementation name within that category.
- `pluginId` is used by management APIs, plugin state, persisted configuration, and diagnostics. Do not change it casually during an upgrade.

Discovery uses a deterministic **first-wins** rule. Null implementations, blank names, and later duplicate `pluginId` values are ignored with WARN logs; an existing registration is never replaced. Configuration definition key and alias conflicts also use first-wins and ignore later conflicting entries.

## Current plugin types

| pluginType | Execution mode | Type critical | Initialization | Purpose |
| --- | --- | --- | --- | --- |
| `auth` | `EXCLUSIVE` | Yes | `STANDARD` | Select one authentication and authorization implementation. |
| `datasource-dialect` | `EXCLUSIVE` | Yes | `STANDARD` | Select a database SQL dialect and mapper family. |
| `config-change` | `CHAIN` | No | `STANDARD` | Run config change plugins by pointcut and order. |
| `encryption` | `ROUTED` | No | `STANDARD` | Route by the algorithm in an encrypted dataId. |
| `trace` | `BROADCAST` | No | `STANDARD` | Broadcast events to every matching enabled subscriber. |
| `environment` | `CHAIN` | No | `PRE_CONTEXT` | Transform environment values in order before Spring context creation. |
| `control` | `EXCLUSIVE` | No | `STANDARD` | Select one traffic-control manager implementation at startup. |
| `visibility` | `ROUTED` | No | `STANDARD` | Route visibility decisions from domain requests. |
| `ai-pipeline` | `CHAIN` | No | `STANDARD` | Run ordered AI resource publish-review nodes. |
| `ai-storage` | `ROUTED` | Yes | `STANDARD` | Route content storage by `StorageKey.provider`. |
| `ai-resource-import` | `ROUTED` | No | `STANDARD` | Route by `sourceId` to one fixed external source. |

`critical` is a type capability; it does not make every implementation of that type permanently non-disableable. `PluginTypePolicy` validates the providers required by the domain only while the type is active. In detail responses, `critical=true` means that this particular implementation cannot currently be disabled by itself, while `typeCritical` identifies the type-level capability.

Cluster addressing remains in the plugin documentation for continuity, but current addressing uses `MemberLookup`. It is not a `PluginType` and is not managed by the unified plugin APIs. See [Cluster Addressing](./address-plugin.md).

## Four execution modes

- `EXCLUSIVE`: select one implementation at startup. The selection key is `nacos.plugin.{pluginType}.type`; runtime state APIs cannot switch it.
- `CHAIN`: run every domain-matching enabled implementation in stable order.
- `ROUTED`: load multiple implementations and let the domain select an enabled implementation by algorithm, provider, `sourceId`, or request context.
- `BROADCAST`: deliver an event to every enabled implementation that subscribes to it.

Unified plugin management owns loaded/enabled/config state. Each domain SPI still defines selection, ordering, failure handling, and degradation.

## State, module switches, and selection

Do not mix these layers:

| Layer | Responsibility | Example |
| --- | --- | --- |
| Module or capability gate | Decides whether the core path enters a capability and may defer loading an entire type. | `nacos.extension.ai.enabled`, `nacos.plugin.visibility.enabled`, `nacos.plugin.ai-pipeline.enabled` |
| Type selection key | Selects an `EXCLUSIVE` implementation at startup; changes require restart. | `nacos.plugin.auth.type=nacos` |
| Initial implementation state | Supplies a startup default when no persisted state override exists. | `nacos.plugin.trace.audit.enabled=true` |
| Unified plugin state | Controls whether a loaded implementation may execute; it may be persisted cluster-wide or changed only on one node. | Plugin status PUT API |
| Implementation config | Contains only definitions owned by one implementation, not module gates or selection. | `nacos.plugin.auth.nacos.token.expire.seconds` |

Loaded does not mean enabled, and enabled implementations cannot bypass the module gate. Type-level deferred loading affects first discovery only. Enabling the gate of a deferred non-critical type triggers one-time discovery, state restoration, and config apply. Disabling the gate later stops domain execution but does not unload the instances.

## Unified configuration

An implementation declares `ConfigItemDefinition` entries through `PluginConfigSpec`. The standard static key is:

```text
nacos.plugin.{pluginType}.{pluginName}.{itemKey}
```

A definition can declare `key`, `aliases`, `type`, `defaultValue`, `required`, `sensitive`, and `effectMode`. `enabled` is reserved for plugin state and cannot be a normal definition key.

For `STANDARD` plugins, effective value precedence is:

```text
LOCAL_ONLY > RUNTIME_PERSISTED > STATIC > DEFAULT
```

The `PRE_CONTEXT` `environment` type resolves only `STATIC > DEFAULT`. It must run before Spring context creation, so all state and configuration changes require restart and cannot use runtime APIs.

For sources, sensitive values, `RUNTIME`/`RESTART`, and API workflows, see [Plugin Operations and Configuration](./operations.md).

## Loading and lifecycle

Regular `STANDARD` plugins are initialized by the unified manager after Spring context refresh. Runtime-persisted configuration is loaded first, and then every configurable plugin receives a complete resolved snapshot through `applyConfig`, even when it has no runtime override.

An adapter that must create resources after configuration can implement `PluginStartupLifecycle`. The unified manager invokes idempotent `initialize()` only for enabled implementations. This callback does not imply that runtime resource replacement is supported; a type without replace-and-close semantics must still reject such switching.

`environment` is discovered, resolved, and applied during `PRE_CONTEXT`. The later unified manager reuses the same instances and accepted snapshots and must not load them again.

## Where to go next

- Operators: read [Plugin Operations and Configuration](./operations.md), then the target plugin-family page.
- Plugin developers: read [Plugin Development Guide](./development.md), then verify the target domain SPI.
- Users upgrading old keys or SPIs: read [Plugin Migration Guide](./migration.md).

| Family | Documentation |
| --- | --- |
| Auth and visibility | [Auth Plugin](./auth-plugin.md), [Visibility Plugin](./visibility-plugin.md) |
| Data and config | [Datasource Plugin](./datasource-plugin.md), [Config Encryption](./config-encryption-plugin.md), [Config Change](./config-change-plugin.md) |
| Stability and observability | [Trace Plugin](./trace-plugin.md), [Custom Environment](./custom-environment-plugin.md), [Control Plugin](./control-plugin.md) |
| AI extensions | [AI Publish Pipeline](./ai-pipeline-plugin.md), [AI Resource Import](./ai-resource-import-plugin.md), [AI Storage](./ai-storage-plugin.md) |
