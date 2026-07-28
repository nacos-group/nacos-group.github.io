---
title: Plugin Operations and Configuration
keywords: [Plugin Management, PluginConfigSpec, plugin-configs.json, Runtime Configuration, Console]
description: Learn Nacos plugin state, configuration sources, sensitive values, runtime updates, persistence, Console behavior, and troubleshooting.
sidebar:
    order: 2
---

# Plugin Operations and Configuration

This document helps Nacos operators and platform administrators inspect plugins, distinguish module gates from plugin state, and safely update implementation-owned configuration.

## Inventory and detail

In the new Console, Platform Management > Plugin Management groups loaded plugins by `pluginType`. The Admin APIs are:

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/v3/admin/core/plugin/list` | List loaded plugins, optionally filtered by `pluginType`. |
| `GET` | `/v3/admin/core/plugin/detail` | Read state, definitions, effective config, and value metadata. |
| `PUT` | `/v3/admin/core/plugin/status` | Update implementation state. |
| `PUT` | `/v3/admin/core/plugin/config` | Replace the complete override map of one source. |

Console API exposes equivalent proxies under `/v3/console/plugin/*`. See [Admin API](../manual/admin/admin-api.md) and [Console API](../manual/admin/console-api.md).

Important list and detail fields:

| Field | Meaning |
| --- | --- |
| `pluginId` | `{pluginType}:{pluginName}`. |
| `enabled` | Whether the implementation may participate on the current node. |
| `executionMode` | `EXCLUSIVE`, `CHAIN`, `ROUTED`, or `BROADCAST`. |
| `exclusive` | Compatibility field equivalent to `executionMode=EXCLUSIVE`. |
| `typeCritical` | Whether the type can become critical. |
| `critical` | Whether this implementation cannot currently be disabled by itself. |
| `configurable` | Whether at least one valid `ConfigItemDefinition` is declared. |
| `config` | Accepted effective item-key snapshot; sensitive values are masked. |
| `configDefinitions` | Definitions including aliases, type, default, required, sensitive, and effect mode. |
| `configValueMetas` | `source` and `overridden` for each canonical item key. |

## Configuration definitions

`ConfigItemDefinition.key` is an implementation-local item key without the full prefix. Static configuration uses:

```text
nacos.plugin.{pluginType}.{pluginName}.{itemKey}
```

| Metadata | Operational meaning |
| --- | --- |
| `aliases` | Historical static keys. They remain readable and may be accepted as API input, but emit migration WARN logs. Persistence stores only canonical item keys. |
| `type` | `STRING`, `NUMBER`, `BOOLEAN`, or `ENUM`. |
| `defaultValue` | Used when no higher-priority source exists. |
| `required` | A final value must exist. |
| `sensitive` | Detail responses mask the value and logs must not expose it. |
| `effectMode` | `RUNTIME` can be updated online; `RESTART` requires static configuration and restart. |

Definition normalization is first-wins. Blank keys, reserved `enabled`, duplicate keys, and later definitions or aliases that conflict with an earlier key or alias are ignored with WARN logs.

## Sources and precedence

For `STANDARD` plugins, effective values are resolved in this order:

```text
LOCAL_ONLY > RUNTIME_PERSISTED > STATIC > DEFAULT
```

| Source | Meaning | Persistence/synchronization |
| --- | --- | --- |
| `DEFAULT` | Definition default. | No |
| `STATIC` | `application.properties`, environment, JVM, or Spring parameters. | Owned by the deployment system |
| `RUNTIME_PERSISTED` | Cluster-wide runtime override. | Yes |
| `LOCAL_ONLY` | Current-node diagnosis or emergency override. | No |

`configValueMetas.source` identifies the effective source. `overridden=true` means that more than one non-default source has the same key; `DEFAULT` is not counted.

Runtime-persisted config is stored in `${nacos.home}/data/plugin/plugin-configs.json`. Nacos owns this file; do not edit it manually. It stores only `pluginId + itemKey + value`, not aliases, full static keys, source, or versions. Enabled state is managed separately and is not stored in this file.

## Update semantics

The `config` sent to `PUT .../plugin/config` is the **complete target-source map**, not a patch:

- `localOnly=false` replaces the complete `RUNTIME_PERSISTED` map.
- `localOnly=true` replaces the current node's complete `LOCAL_ONLY` map.
- An empty map clears all overrides for that plugin and source.
- Omitting an existing key removes it. Only `RUNTIME` items can be added, changed, or removed online.
- Canonical item keys, normalized full keys, and unique aliases are normalized to item keys. Undefined or ambiguous keys return a validation error.

For example, override the default auth token lifetime on only the current node:

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/core/plugin/config' \
  -d 'pluginType=auth' \
  -d 'pluginName=nacos' \
  -d 'config={"token.expire.seconds":"3600"}' \
  -d 'localOnly=true'
```

Updates for one plugin are serialized. A persisted update stores the source first, then resolves, validates, and applies. Persistence failure leaves memory and the plugin unchanged. If persistence succeeds but `applyConfig` fails, the new source remains accepted and the API reports an explicit error. Fix the plugin and submit the same complete map to retry apply manually.

## `RUNTIME` and `RESTART`

Startup apply accepts both modes. A runtime PUT cannot add, change, or remove a `RESTART` item.

Static refresh follows the same boundary:

- Changed `RUNTIME` static values are resolved and applied when needed.
- Changed `RESTART` values produce WARN logs, while the process keeps its startup snapshot.
- Detail responses return the accepted snapshot rather than an unapplied restart-required environment value.

To change a `RESTART` item, update static configuration on all nodes and perform a planned rolling restart.

## Sensitive values

Detail responses mask sensitive items with a value containing `******`. On update, any value containing this standard marker means "preserve the target source value":

- If that source already has the key, Nacos keeps its original value.
- If the source does not have the key, the input is ignored. Nacos never copies an effective value from another source, such as `STATIC`, into a runtime override.

The Console can therefore submit the masked display value without overwriting a secret. To actually change a secret, submit a new value without the marker. Logs include only `pluginId`, item key, and target source.

## State updates and critical validation

Status APIs support cluster-persisted and `localOnly=true` current-node updates, but some types cannot be switched online:

- `EXCLUSIVE` types use static `type` selection and cannot be switched by the status API.
- An active critical type must retain every provider required by its policy; invalid updates are rejected before persistence and apply.
- `environment` runs before context creation, so runtime state updates are rejected.
- `control` builds its manager bundle during startup and rejects runtime selection changes.

The status API does not modify module gates. For example, `visibility:nacos` may remain loaded and enabled while `nacos.plugin.visibility.enabled=false` prevents the visibility path from running.

## New Console behavior

The Next Console detail view treats the detail API as its source of truth:

- `RUNTIME` definitions are editable. `RESTART` definitions are read-only and instruct users to edit static configuration and restart.
- Effective source and overridden state are shown for every value.
- Cluster-wide runtime-persisted and current-node local-only updates are separate modes.
- A submission retains only overrides belonging to the target source; it does not copy effective `STATIC` or `DEFAULT` values.
- If any `LOCAL_ONLY` override is active, cluster submission is blocked because lower-priority persisted values are hidden. Clear local-only overrides, refresh detail, and then edit cluster configuration.

This workflow applies to the Next Console only. Legacy Console does not provide the unified config editor.

## Startup and troubleshooting

1. Use the same plugin JARs, dependencies, and versions on every cluster node.
2. Confirm that the target `pluginId` is available on every node.
3. Distinguish the module gate, exclusive selection, implementation state, and implementation config.
4. Inspect effective `source` for unexpected `LOCAL_ONLY` or `RUNTIME_PERSISTED` overrides.
5. Confirm that nodes restarted after a `RESTART` change.
6. Remove duplicate implementations or definitions reported by WARN logs; never rely on SPI scan order.
