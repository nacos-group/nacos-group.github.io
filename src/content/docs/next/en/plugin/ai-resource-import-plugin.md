---
title: AI Resource Import
keywords: [AI Resource Import, MCP Registry, Skill Registry, PluginConfigSpec]
description: Learn the unified AI Resource Import plugins, four built-in sources, definitions, security boundaries, and old SPI migration.
sidebar:
    order: 15
---

# AI Resource Import Plugin

AI Resource Import plugins convert MCP Servers, Skills, and future AI resources from external registries, marketplaces, or enterprise catalogs into artifacts that Nacos can validate and write. They own only the external protocol and conversion. Namespace, identity, auth, visibility, versioning, publish Pipeline, and storage remain AI Registry responsibilities.

## Unified source model

`ai-resource-import` is a `ROUTED` plugin type. One Builder represents one fixed external source:

```text
pluginId = ai-resource-import:{pluginName}
sourceId = managed pluginName
```

A request `sourceId` routes directly to one enabled Builder. The existing API field `pluginName` remains importer/protocol metadata for Console compatibility; it is not the managed plugin name.

```text
sourceId
  -> AiResourceImportServiceBuilder(accepted snapshot)
  -> request-scoped AiResourceImportService
  -> AiResourceOperator(resourceType)
```

One `pluginName` represents exactly one source. Configuration can no longer clone one implementation to multiple endpoints. Ship another Builder with a distinct `pluginName` for another fixed source.

## Gates, state, and defaults

When AI function mode and the AI module permit it, the family switch controls importer loading:

```properties
nacos.plugin.ai-resource-import.enabled=true
```

`nacos.ai.resource.import.enabled` is a historical alias, and the standard key wins. The official distribution `application.properties` sets the standard key to `true`, so AI Resource Import is enabled by default. Set it to `false` explicitly only when the deployment must disable this capability.

Initial source state uses:

```properties
nacos.plugin.ai-resource-import.{pluginName}.enabled=true
```

Persisted unified state takes precedence. Runtime routing also checks Builder state; disabled sources are neither listed nor allowed to search, validate, or execute.

## Four built-in sources

| pluginId | API importer type | Resource | Endpoint | Distribution initial state |
| --- | --- | --- | --- | --- |
| `ai-resource-import:mcp-official` | `mcp-registry` | `mcp` | Fixed official MCP Registry | enabled |
| `ai-resource-import:mcp-registry-protocol` | `mcp-registry` | `mcp` | Operator configuration required | disabled |
| `ai-resource-import:skills-sh` | `skills-sh` | `skill` | Fixed `https://skills.sh` | enabled |
| `ai-resource-import:skills-well-known` | `skills-well-known` | `skill` | Operator configuration required | disabled |

The Console still displays `Official MCP Registry` for `mcp-official` and `skills.sh` for `skills-sh`. The existing select, search, choose candidates, validate, and execute experience remains unchanged.

### Fixed endpoint sources

`mcp-official` and `skills-sh` do not declare `endpoint`, `allow-http`, or `allow-private-network` and do not accept old endpoint overrides. The source endpoint is part of implementation identity.

```properties
nacos.plugin.ai-resource-import.mcp-official.enabled=true
nacos.plugin.ai-resource-import.skills-sh.enabled=true
```

### Operator-configured endpoint sources

Enable an MCP Registry protocol endpoint:

```properties
nacos.plugin.ai-resource-import.mcp-registry-protocol.enabled=true
nacos.plugin.ai-resource-import.mcp-registry-protocol.endpoint=https://registry.example.com/v0/servers
```

Enable a Skill well-known registry:

```properties
nacos.plugin.ai-resource-import.skills-well-known.enabled=true
nacos.plugin.ai-resource-import.skills-well-known.endpoint=https://skills.example.com
```

`skills-well-known` supports discovery schema v0.1.0 and v0.2.0. For a registry root, it tries `/.well-known/agent-skills/index.json` and then `/.well-known/skills/index.json`.

## Configuration definitions

Canonical full keys use:

```text
nacos.plugin.ai-resource-import.{pluginName}.{itemKey}
```

Common items:

| Item key | Type | Default | effectMode | Implementations | Meaning |
| --- | --- | --- | --- | --- | --- |
| `endpoint` | `STRING` | empty | `RESTART` | Two configurable endpoint sources | Registry or marketplace root; it must be non-empty when the source builds. |
| `allow-http` | `BOOLEAN` | `false` | `RESTART` | Two configurable endpoint sources | Permit non-HTTPS targets. |
| `allow-private-network` | `BOOLEAN` | `false` | `RESTART` | Two configurable endpoint sources | Permit local or private targets. |
| `display-name` | `STRING` | Per-implementation display name | `RUNTIME` | All | API and Console display name. |
| `description` | `STRING` | Per-implementation description | `RUNTIME` | All | API and Console description. |
| `max-item-count` | `NUMBER` | `500` | `RUNTIME` | All | Maximum result/file count per request. |
| `max-artifact-size` | `NUMBER` | `10485760` | `RUNTIME` | All | Maximum HTTP response or artifact bytes. |

All current definitions are `required=false` and `sensitive=false`. `mcp-official` and `skills-sh` expose only the four `RUNTIME` display/limit fields. The two configurable endpoint implementations expose all seven.

Runtime PUT cannot add, change, or remove `endpoint`, `allow-http`, or `allow-private-network`. Change static configuration and restart. The other four fields are runtime-effective, and a new immutable Builder snapshot is used by subsequent requests.

## Effective config and aliases

Effective values use:

```text
LOCAL_ONLY > RUNTIME_PERSISTED > STATIC > DEFAULT
```

Old `nacos.plugin.ai.importer.*` keys remain aliases for one migration window:

| New pluginName | Old prefix/alias scope |
| --- | --- |
| `mcp-official` | Display, description, limits, and historical state under `nacos.plugin.ai.importer.mcp.official.` |
| `skills-sh` | Display, description, limits, and historical state under `nacos.plugin.ai.importer.skills.skills-sh.` |
| `skills-well-known` | Old `url`/`endpoint`, network flags, display, description, limits, and state under `nacos.plugin.ai.importer.skills.well-known.` |
| `mcp-registry-protocol` | No old aliases. |

Fixed-source endpoint overrides, `auth-ref`, source/global timeouts, `max-page-count`, `block-private-network`, global defaults, and arbitrary `properties.*` are removed.

## Flow and lifecycle

```text
list sources -> search -> explicit user selection -> validate -> execute
```

- Search builds one service and returns only candidate summaries, not MCP tools, Skill packages, or secrets.
- Validate and execute each build one service, reuse it for all selected items in that operation, and close it in `finally`.
- Fetch returns an artifact but never writes Nacos directly. A resource Operator validates and persists it.
- The browser must not select search results by default. Select-all must still allow individual deselection.

Unified APIs:

| Operation | Admin | Console |
| --- | --- | --- |
| Sources | `GET /v3/admin/ai/import/sources` | `GET /v3/console/ai/import/sources` |
| Search | `POST /v3/admin/ai/import/search` | `POST /v3/console/ai/import/search` |
| Validate | `POST /v3/admin/ai/import/validate` | `POST /v3/console/ai/import/validate` |
| Execute | `POST /v3/admin/ai/import/execute` | `POST /v3/console/ai/import/execute` |

## Security boundary

- Requests cannot submit arbitrary URLs, IPs, registry roots, or credentials.
- HTTPS is required by default, and loopback, link-local, multicast, and private DNS results are blocked.
- Only operator-owned configurable sources can opt in to `allow-http` or `allow-private-network`.
- Derived URLs and redirects must reapply the same network policy.
- HTTP responses and artifacts are capped by `max-artifact-size`; result/file counts are capped by `max-item-count`.
- Skill import must not execute scripts and must validate paths, digests, and aggregate archive size.

## Develop a source

Implement `com.alibaba.nacos.plugin.ai.importer.spi.AiResourceImportServiceBuilder` and register it through Java SPI. The Builder itself is the managed plugin and implements `PluginConfigSpec`:

| Builder method | Requirement |
| --- | --- |
| `pluginName()` | Stable managed name and API `sourceId`. |
| `importerType()` | Importer/protocol metadata returned in the API `pluginName` field. |
| `displayName()` / `description()` | Read from the accepted config snapshot. |
| `supportedResourceTypes()` | Resource types produced by this fixed source. |
| `getConfigDefinitions()` | Declare every item owned by the source. |
| `applyConfig(config)` | Atomically replace the immutable effective snapshot. |
| `getCurrentConfig()` | Return the last accepted canonical item-key snapshot. |
| `build()` | Build a request-scoped service from one snapshot without extra properties. |

SPI file:

```text
META-INF/services/com.alibaba.nacos.plugin.ai.importer.spi.AiResourceImportServiceBuilder
```

Duplicate names use first-wins with a WARN.

## Breaking change and migration

The old Importer/Source dual SPI is removed with no compatibility adapter. External plugins must be migrated and recompiled:

- Remove `AiResourceImportSource` and the Source Provider SPI.
- Remove `nacos.ai.resource.import.sources[N].*`, presets, and cloned endpoints.
- Make the Builder `pluginName()` the fixed source ID, implement `PluginConfigSpec`, and use no-argument `build()`.
- Move effective properties to canonical full keys.

Old MCP import compatibility APIs are disabled by default. A temporary migration can set `nacos.ai.resource.import.legacy-mcp-api-enabled=true`. Fetching a user URL also requires the explicit `nacos.ai.resource.import.allow-user-url=true` opt-in and is not a long-term solution.

See [Plugin Migration Guide](./migration.md) and [Compatibility and Deprecation](../manual/admin/compatibility-and-deprecation.md).
