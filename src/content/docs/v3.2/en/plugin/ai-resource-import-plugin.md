---
title: AI Resource Import
keywords: [AI Resource Import, MCP Registry, Skill Registry, AI Registry]
description: Learn how Nacos imports AI resources from external registries, how sources are configured, and how to extend importers.
sidebar:
    order: 12
---

# AI Resource Import Plugin

The AI resource import plugin brings AI resources from external registries, marketplaces, or internal catalogs into Nacos AI Registry. After import, the resource enters the Nacos namespace, version, visibility, and lifecycle model.

The importer only owns external source discovery and conversion into import artifacts. Nacos resource identity, auth, visibility, lifecycle, and storage still belong to AI Registry.

## Use Cases

Typical use cases:

- Import MCP Servers from the official MCP registry.
- Import Skills from a Skill well-known endpoint.
- Import Skills from skills.sh or an internal Skill marketplace.
- Connect an internal tool catalog, private Git index, or model platform as an AI Registry source.

Import is for resource onboarding and governance. It should not bypass Nacos publish, review, or permission flows.

## Import Flow

The unified flow is:

```text
list sources -> search candidates -> select candidates -> validate conflicts and dependencies -> execute import
```

Each source is configured by operators and exposed as a `sourceId`. Users select a `sourceId` during import. Requests must not submit arbitrary endpoints, IPs, credentials, or registry roots.

| Step | Description |
| --- | --- |
| List sources | Returns import sources available for a resource type. |
| Search candidates | Searches summaries from the selected source. Full payloads are not downloaded. |
| Validate | Fetches required artifacts and checks type, size, conflicts, and dependencies. |
| Execute | Passes valid artifacts to the resource operator and writes Nacos AI resources. |

Browsers and consoles should not receive full artifacts. MCP specifications, Skill ZIP files, and similar payloads should only flow inside the server-side import path.

## Source Configuration

A source usually contains:

| Field | Description |
| --- | --- |
| `sourceId` | Stable source ID selected by users. |
| `pluginName` | Importer implementation name under `ai-resource-import`. |
| `resourceTypes` | Supported resource types, such as `mcp` or `skill`. |
| `endpoint` | Source endpoint configured by operators. |
| `enabled` | Whether the source is enabled. |
| `authRef` | Optional server-side credential reference. Credentials are not returned to users. |
| `connectTimeout` / `readTimeout` | Network timeouts. |
| `maxPageCount` / `maxItemCount` | Page and item limits. |
| `maxArtifactSize` | Maximum artifact size. |
| `properties` | Importer-specific non-secret properties. |

Explicit sources can be configured under `nacos.ai.resource.import.sources[...]` and enabled with `nacos.ai.resource.import.enabled=true`. Built-in preset sources are enabled or disabled independently with `nacos.plugin.ai.importer.*` properties.

When the default importer plugin is loaded, the official MCP Registry source and skills.sh source are enabled by default. To disable them, set the corresponding preset `enabled` property to `false`.

## Built-in Sources

### Official MCP Registry

Enable the official MCP source:

```properties
nacos.plugin.ai.importer.mcp.official.enabled=true
```

Defaults:

| Item | Default |
| --- | --- |
| `sourceId` | `mcp-official` |
| importer | `mcp-registry` |
| resource type | `mcp` |
| endpoint | `https://registry.modelcontextprotocol.io/v0/servers` |

Use the `nacos.plugin.ai.importer.mcp.official.*` prefix to override source ID, display name, endpoint, auth reference, timeouts, and size limits.

### Skill Well-known

Enable a Skill well-known source:

```properties
nacos.plugin.ai.importer.skills.well-known.enabled=true
nacos.plugin.ai.importer.skills.well-known.url=https://developers.cloudflare.com
```

Defaults:

| Item | Default |
| --- | --- |
| `sourceId` | `skills-well-known` |
| importer | `skills-well-known` |
| resource type | `skill` |
| endpoint | `nacos.plugin.ai.importer.skills.well-known.url` |

The importer tries `/.well-known/agent-skills` and falls back to the legacy `/.well-known/skills` path. It supports Skill discovery v0.1.0 and v0.2.0.

### skills.sh

Enable skills.sh:

```properties
nacos.plugin.ai.importer.skills.skills-sh.enabled=true
```

Defaults:

| Item | Default |
| --- | --- |
| `sourceId` | `skills-sh` |
| importer | `skills-sh` |
| resource type | `skill` |
| endpoint | `https://skills.sh` |

## Security Boundaries

Built-in sources require HTTPS by default and reject localhost, loopback, link-local, multicast, and private network endpoints. Only enable the following options in a controlled private deployment:

| Suffix | Meaning | Default |
| --- | --- | --- |
| `allow-http` / `allowHttp` | Allow non-HTTPS endpoints. | `false` |
| `allow-private-network` / `allowPrivateNetwork` | Allow private, localhost, and similar endpoints. | `false` |

Do not treat an external registry as trusted input. Validate file paths, archive size, digest, content type, and conflict policy before import.

## API Entry Points

Unified import provides Admin API and Console API:

| Surface | Paths |
| --- | --- |
| Admin API | `/v3/admin/ai/import/sources`, `/search`, `/validate`, `/execute` |
| Console API | `/v3/console/ai/import/sources`, `/search`, `/validate`, `/execute` |

For parameters, see [Admin API](../manual/admin/admin-api.md) and [Console API](../manual/admin/console-api.md).

## Develop a Custom Importer

Add the dependency:

```xml
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-ai-plugin</artifactId>
    <version>${project.version}</version>
</dependency>
```

Implement `com.alibaba.nacos.plugin.ai.importer.spi.AiResourceImportServiceBuilder` and declare it with Java SPI:

```text
META-INF/services/com.alibaba.nacos.plugin.ai.importer.spi.AiResourceImportServiceBuilder
```

Core methods:

| Method | Description |
| --- | --- |
| `importerType()` | Stable importer name. |
| `build(properties)` | Builds the import service from importer configuration. |
| `supportedResourceTypes()` | Resource types this importer can produce. |
| `search(context)` | Returns candidate summaries, not full payloads. |
| `fetch(context, item)` | Fetches the selected artifact, but does not write to Nacos. |

To provide preset sources, implement `AiResourceImportSourceProvider` and declare the corresponding SPI file.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Source list is empty | Check `nacos.ai.resource.import.enabled`, source `enabled`, and whether the importer plugin is loaded. |
| Search fails | Check endpoint, network, timeout, auth reference, and HTTPS/private-network restrictions. |
| Validation reports conflicts | Check resource name, version, and whether an editing or reviewing version already exists. |
| Imported resource is not visible | Check namespace, visibility, auth, and resource status. |
| Private source cannot be reached | Enable `allow-private-network` only after confirming the risk. |
