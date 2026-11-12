---
title: Hub Extension API Reference
keywords: [Nacos, Hub, MCP, Agent, Prompt, AgentSpec, API]
description: Fixed Hub management routes, parameters, response models and shared-read contracts for MCP, Agent, Prompt and AgentSpec.
sidebar:
    order: 20
---

# Hub Extension API Reference

This page extends the Skill documentation in [Admin API](./admin-api.md#12-agentic-resource-hub) and [Console API](./console-api.md#13-agentic-resource-hub) with the other four types. The management APIs declare `3.3.0` as their source-level starting version. Your deployment must actually contain Hub; a version number alone does not establish that a published release includes development-branch features.

## 1. Addresses, Identity and Type Boundaries

Admin examples use `http://127.0.0.1:8848`; the paths below include the default `/nacos` context. Console uses `http://127.0.0.1:8080` without that prefix. Adjust for custom contexts or proxies. Supply identity as required by your auth plugin; examples use the `accessToken` header.

These are separate fixed routes, not a `{resourceType}` placeholder API. Each row is one operation. Parameters and response types for the same operation are shared by the four resource types; the path selects the type. All five types support import; only Skill has `/clone`. The four types below have no `/copy` or `/clone`, nor dedicated `/hub/.../list`, `detail`, `content` or `download` read APIs.

### 1.1. MCP

| Operation and parameters | Method | Admin URL | Console URL |
|---|---|---|---|
| [Share](#21-share) | POST | `/nacos/v3/admin/ai/hub/mcp/share` | `/v3/console/ai/hub/mcp/share` |
| [Adjust](#22-adjust-the-shared-version) | POST | `/nacos/v3/admin/ai/hub/mcp/adjust` | `/v3/console/ai/hub/mcp/adjust` |
| [Unshare](#23-unshare) | POST | `/nacos/v3/admin/ai/hub/mcp/unshare` | `/v3/console/ai/hub/mcp/unshare` |
| [Force unshare](#24-force-unshare) | POST | `/nacos/v3/admin/ai/hub/mcp/force-unshare` | `/v3/console/ai/hub/mcp/force-unshare` |
| [Source state](#25-get-source-sharing-state) | GET | `/nacos/v3/admin/ai/hub/mcp/source-share` | `/v3/console/ai/hub/mcp/source-share` |
| [Governance state](#26-get-governance-state) | GET | `/nacos/v3/admin/ai/hub/mcp/governance-state` | `/v3/console/ai/hub/mcp/governance-state` |
| [Import](#27-import-from-hub) | POST | `/nacos/v3/admin/ai/hub/mcp/import` | `/v3/console/ai/hub/mcp/import` |

### 1.2. Agent

| Operation and parameters | Method | Admin URL | Console URL |
|---|---|---|---|
| [Share](#21-share) | POST | `/nacos/v3/admin/ai/hub/agent/share` | `/v3/console/ai/hub/agent/share` |
| [Adjust](#22-adjust-the-shared-version) | POST | `/nacos/v3/admin/ai/hub/agent/adjust` | `/v3/console/ai/hub/agent/adjust` |
| [Unshare](#23-unshare) | POST | `/nacos/v3/admin/ai/hub/agent/unshare` | `/v3/console/ai/hub/agent/unshare` |
| [Force unshare](#24-force-unshare) | POST | `/nacos/v3/admin/ai/hub/agent/force-unshare` | `/v3/console/ai/hub/agent/force-unshare` |
| [Source state](#25-get-source-sharing-state) | GET | `/nacos/v3/admin/ai/hub/agent/source-share` | `/v3/console/ai/hub/agent/source-share` |
| [Governance state](#26-get-governance-state) | GET | `/nacos/v3/admin/ai/hub/agent/governance-state` | `/v3/console/ai/hub/agent/governance-state` |
| [Import](#27-import-from-hub) | POST | `/nacos/v3/admin/ai/hub/agent/import` | `/v3/console/ai/hub/agent/import` |

### 1.3. Prompt

| Operation and parameters | Method | Admin URL | Console URL |
|---|---|---|---|
| [Share](#21-share) | POST | `/nacos/v3/admin/ai/hub/prompt/share` | `/v3/console/ai/hub/prompt/share` |
| [Adjust](#22-adjust-the-shared-version) | POST | `/nacos/v3/admin/ai/hub/prompt/adjust` | `/v3/console/ai/hub/prompt/adjust` |
| [Unshare](#23-unshare) | POST | `/nacos/v3/admin/ai/hub/prompt/unshare` | `/v3/console/ai/hub/prompt/unshare` |
| [Force unshare](#24-force-unshare) | POST | `/nacos/v3/admin/ai/hub/prompt/force-unshare` | `/v3/console/ai/hub/prompt/force-unshare` |
| [Source state](#25-get-source-sharing-state) | GET | `/nacos/v3/admin/ai/hub/prompt/source-share` | `/v3/console/ai/hub/prompt/source-share` |
| [Governance state](#26-get-governance-state) | GET | `/nacos/v3/admin/ai/hub/prompt/governance-state` | `/v3/console/ai/hub/prompt/governance-state` |
| [Import](#27-import-from-hub) | POST | `/nacos/v3/admin/ai/hub/prompt/import` | `/v3/console/ai/hub/prompt/import` |

### 1.4. AgentSpec

| Operation and parameters | Method | Admin URL | Console URL |
|---|---|---|---|
| [Share](#21-share) | POST | `/nacos/v3/admin/ai/hub/agentspec/share` | `/v3/console/ai/hub/agentspec/share` |
| [Adjust](#22-adjust-the-shared-version) | POST | `/nacos/v3/admin/ai/hub/agentspec/adjust` | `/v3/console/ai/hub/agentspec/adjust` |
| [Unshare](#23-unshare) | POST | `/nacos/v3/admin/ai/hub/agentspec/unshare` | `/v3/console/ai/hub/agentspec/unshare` |
| [Force unshare](#24-force-unshare) | POST | `/nacos/v3/admin/ai/hub/agentspec/force-unshare` | `/v3/console/ai/hub/agentspec/force-unshare` |
| [Source state](#25-get-source-sharing-state) | GET | `/nacos/v3/admin/ai/hub/agentspec/source-share` | `/v3/console/ai/hub/agentspec/source-share` |
| [Governance state](#26-get-governance-state) | GET | `/nacos/v3/admin/ai/hub/agentspec/governance-state` | `/v3/console/ai/hub/agentspec/governance-state` |
| [Import](#27-import-from-hub) | POST | `/nacos/v3/admin/ai/hub/agentspec/import` | `/v3/console/ai/hub/agentspec/import` |

## 2. Management Operation Contracts

POST uses `application/x-www-form-urlencoded`; GET parameters use the query string. IDs are positive 64-bit integers and serialize as JSON strings. Do not convert them to JavaScript `number`. Example IDs and revisions such as `101` and `1` must be replaced with the actual returned ID and latest `metaVersion`.

### 2.1. Share

Requires source READ and WRITE. The source must be enabled and the concrete version online. MCP, Agent and AgentSpec must be PUBLIC; Prompt has no new scope requirement. Sharing pins a version rather than following `latest`.

#### Request Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| `sourceNamespaceId` | `string` | **Yes** | Source Namespace, excluding the reserved Hub Namespace. |
| `sourceName` | `string` | **Yes** | Actual source name; the promptKey for Prompt. |
| `sourceVersion` | `string` | **Yes** | Concrete online version, never `latest`. |
| `expectedSourceResourceId` | `string` | No | Expected source ID for fixed-identity validation. |

#### Response Data

| Name | Type | Description |
|---|---|---|
| `data` | `HubShareResult` | [Sharing result](#31-hubshareresult). A repeat may return `ALREADY_SHARED`. |

#### Example

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST \
  'http://127.0.0.1:8848/nacos/v3/admin/ai/hub/mcp/share' \
  --data-urlencode 'sourceNamespaceId=public' --data-urlencode 'sourceName=weather-mcp' \
  --data-urlencode 'sourceVersion=1.0.0'
```

For another type, select its fixed URL from the index and its actual source name; the fields are unchanged.

### 2.2. Adjust the Shared Version

Requires source READ and WRITE; the new source version must remain shareable. `expectedMetaVersion` implements CAS. A stale revision conflicts; re-read state before deciding whether to retry.

#### Request Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| `hubEntryId` | `string` | **Yes** | Hub entry ID belonging to the selected type. |
| `targetVersion` | `string` | **Yes** | New concrete online source version, not an import target version. |
| `expectedMetaVersion` | `string` | **Yes** | Most recently fetched entry revision. |

#### Response Data

| Name | Type | Description |
|---|---|---|
| `data` | `HubShareResult` | Updated state/revision; outcome may be `ADJUSTED` or `UNCHANGED`. |

#### Example

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST \
  'http://127.0.0.1:8848/nacos/v3/admin/ai/hub/mcp/adjust' \
  --data-urlencode 'hubEntryId=101' --data-urlencode 'targetVersion=2.0.0' \
  --data-urlencode 'expectedMetaVersion=1'
```

### 2.3. Unshare

Requires source WRITE. Authorized cleanup remains available after the source becomes private or the version offline. Neither the source nor previously imported targets are deleted.

#### Request Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| `hubEntryId` | `string` | **Yes** | Shared entry ID for this type. |
| `expectedMetaVersion` | `string` | **Yes** | Most recently fetched revision. |

#### Response Data

| Name | Type | Description |
|---|---|---|
| `data` | `HubShareResult` | `active=false`; outcome may be `UNSHARED` or `ALREADY_UNSHARED`. |

#### Example

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST \
  'http://127.0.0.1:8848/nacos/v3/admin/ai/hub/mcp/unshare' \
  --data-urlencode 'hubEntryId=101' --data-urlencode 'expectedMetaVersion=2'
```

### 2.4. Force Unshare

Requires independent global-administrator governance authority; ordinary resource ACLs cannot substitute for it. The reason is recorded and CAS is checked.

#### Request Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| `hubEntryId` | `string` | **Yes** | Shared entry ID for this type. |
| `expectedMetaVersion` | `string` | **Yes** | Most recently fetched revision. |
| `reason` | `string` | **Yes** | Nonblank takedown reason, at most 512 characters. |

#### Response Data

| Name | Type | Description |
|---|---|---|
| `data` | `HubShareResult` | Takedown result with `active=false`. |

#### Example

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST \
  'http://127.0.0.1:8080/v3/console/ai/hub/mcp/force-unshare' \
  --data-urlencode 'hubEntryId=101' --data-urlencode 'expectedMetaVersion=2' \
  --data-urlencode 'reason=Retired by administrator'
```

### 2.5. Get Source Sharing State

Despite using GET, requires source WRITE. It is not a public directory API and does not require the source still to be shareable. An existing, never-shared source returns `data=null`.

#### Request Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| `sourceNamespaceId` | `string` | **Yes** | Source Namespace. |
| `sourceName` | `string` | **Yes** | Actual source resource name. |

#### Response Data

| Name | Type | Description |
|---|---|---|
| `data` | `HubResourceShareState` | [Minimal state](#32-hubresourcesharestate), or `null`. |

#### Example

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" --get \
  'http://127.0.0.1:8848/nacos/v3/admin/ai/hub/mcp/source-share' \
  --data-urlencode 'sourceNamespaceId=public' --data-urlencode 'sourceName=weather-mcp'
```

### 2.6. Get Governance State

Requires global-administrator governance authority, not simply Hub READ or an ordinary resource ACL.

#### Request Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| `hubEntryId` | `string` | **Yes** | Hub entry ID for this type. |

#### Response Data

| Name | Type | Description |
|---|---|---|
| `data` | `HubResourceShareState` | Governance CAS revision and state, without database or file-storage details. |

#### Example

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" --get \
  'http://127.0.0.1:8080/v3/console/ai/hub/mcp/governance-state' \
  --data-urlencode 'hubEntryId=101'
```

### 2.7. Import from Hub

Requires valid Hub read access and target Namespace WRITE, without source Namespace READ. Creates an independent PRIVATE draft, with no automatic review, publication or synchronization. Existing names, versions and dependency conflicts are not overwritten.

#### Request Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| `hubEntryId` | `string` | **Yes** | Pinned shared entry ID; the route fixes its type. |
| `targetNamespaceId` | `string` | **Yes** | Writable business Namespace, never the reserved Hub Namespace. |
| `targetName` | `string` | **Yes** | New name satisfying the selected type's naming rules. |
| `targetVersion` | `string` | No | Draft version, default `0.0.1`; never `latest`. |
| `mcpRemoteServerConfig` | `string` | No | MCP only: JSON-encoded `McpServerRemoteServiceConfig`, at most 65536 characters. Normally omit it; if supplied it must equal the pinned source configuration, not override or rebind connections. Do not set this field for the other three types. |

Do not also supply `sourceNamespaceId`, `sourceName` or `sourceVersion`, even as empty strings. They cannot act as a second source selector.

#### Response Data

| Name | Type | Description |
|---|---|---|
| `data` | `HubResourceTransferResult` | [Independent draft and provenance](#33-hubresourcetransferresult). |

#### Example

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST \
  'http://127.0.0.1:8848/nacos/v3/admin/ai/hub/mcp/import' \
  --data-urlencode 'hubEntryId=101' --data-urlencode 'targetNamespaceId=team-b' \
  --data-urlencode 'targetName=weather-imported' --data-urlencode 'targetVersion=0.0.1'
```

MCP STDIO creates no Naming service; ordinary REF retains its original reference; source-owned Direct creates a target-owned service from one valid, unambiguous persistent fixed address. Existing target services conflict. Failure cleanup affects only state owned by this import. Target deletion preserves source/REF services; source revocation preserves imported targets. Agent import does not copy dynamic runtime registrations.

## 3. Response Models

Successful JSON uses `Result<T>` with root `code`, `message` and `data`, not `data.data`. Management responses are for authorized callers; do not expose their source identity fields directly in a public directory.

### 3.1. HubShareResult

| Name | Type | Description |
|---|---|---|
| `data` | `HubShareResult` | Sharing lifecycle operation result. |
| `data.hubEntryId` | `string` | Shared entry ID. |
| `data.displayName` | `string` | Presentation name, not read identity. |
| `data.sourceNamespaceId` | `string` | Source Namespace authorized for this management operation. |
| `data.sourceResourceId` | `string` | Pinned source resource ID. |
| `data.sourceName` | `string` | Actual source name. |
| `data.sourceVersionId` | `string` | Pinned source version ID. |
| `data.sourceVersion` | `string` | Pinned source version. |
| `data.metaVersion` | `string` | CAS revision for subsequent writes. |
| `data.outcome` | `HubShareOutcome` | `CREATED`, `ALREADY_SHARED`, `REACTIVATED`, `ADJUSTED`, `UNCHANGED`, `UNSHARED`, `ALREADY_UNSHARED` or `FORCE_UNSHARED`. |
| `data.active` | `boolean` | Whether sharing is active. |

### 3.2. HubResourceShareState

| Name | Type | Description |
|---|---|---|
| `data` | `HubResourceShareState` | Source-WRITE/admin-authorized state; nullable. |
| `data.hubEntryId` | `string` | Shared entry ID. |
| `data.metaVersion` | `string` | CAS revision. |
| `data.sharedVersion` | `string` | Current concrete shared version. |
| `data.active` | `boolean` | Active flag. |

### 3.3. HubResourceTransferResult

| Name | Type | Description |
|---|---|---|
| `data` | `HubResourceTransferResult` | Independent target draft. |
| `data.targetNamespaceId` | `string` | Target Namespace. |
| `data.targetName` | `string` | Target name. |
| `data.draftVersion` | `string` | New draft version. |
| `data.status` | `string` | `draft`. |
| `data.origin` | `string` | `HUB` for the four import types documented here. |
| `data.targetResourceId` | `string` | Target resource ID. |
| `data.hubEntryId` | `string` | Pinned source publication ID. |
| `data.resourceType` | `string` | `mcp`, `agent`, `prompt` or `agentspec`. |

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "targetNamespaceId": "team-b",
    "targetName": "weather-imported",
    "draftVersion": "0.0.1",
    "status": "draft",
    "origin": "HUB",
    "targetResourceId": "201",
    "hubEntryId": "101",
    "resourceType": "mcp"
  }
}
```

## 4. Read through Existing Resource APIs

All paths below use GET with `namespaceId=__nacos_ai_hub__`. Prefix Admin paths with the deployed `/nacos` context; use the Console port for Console paths. Existing filters, pagination and response models remain type-specific, not a new generic Hub content DTO.

| Type | Existing Admin / Console resource paths | Existing Client paths | Identity parameter |
|---|---|---|---|
| MCP | `/v3/admin/ai/mcp`, `/v3/console/ai/mcp`, plus `/list`, `/versions`, `/version` | `/v3/client/ai/mcp/search`, `/v3/client/ai/mcp` | `mcpName`: opaque name returned by shared discovery |
| Agent | `/v3/admin/ai/agents`, `/v3/console/ai/agents`, plus `/list`, `/versions`, `/version`, `/runtime-endpoints` | `/v3/client/ai/agents/search`, `/v3/client/ai/agents` | `agentName`: opaque name; runtime snapshots retain `protocol` |
| Prompt | `/list`, `/governance`, `/versions`, `/version`, `/version/download` under `/v3/admin/ai/prompt` or `/v3/console/ai/prompt`; compatible `/metadata`, `/detail` reads remain | `/v3/client/ai/prompt/search`, `/v3/client/ai/prompt` | `promptKey`: opaque name; use `/governance` for management detail |
| AgentSpec | `/v3/admin/ai/agentspecs`, `/v3/console/ai/agentspecs`, plus `/list`, `/version`, `/version/meta` | `/v3/client/ai/agentspecs/search`, `/v3/client/ai/agentspecs` | `agentSpecName` for Admin/Console; `name` for Client |

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" --get \
  'http://127.0.0.1:8848/nacos/v3/client/ai/agentspecs' \
  --data-urlencode 'namespaceId=__nacos_ai_hub__' \
  --data-urlencode 'name=101' --data-urlencode 'version=1.0.0'
```

Reads require Hub READ and publication validity, without additional source READ. Anonymous admission depends on the auth plugin and anonymous AI configuration; PUBLIC alone does not bypass auth. Identity and version must match the current pinned reference, without `latest` fallback. Conflicting repeated Namespace parameters are rejected. Revocation, pinned-version offline, source deletion or disabling makes content unreadable; becoming PRIVATE also invalidates non-Prompt sources.

Management/search `hub` metadata uses `HubResourceDiscoveryInfo`: `hubEntryId`, `resourceType`, opaque `resourceName`, pinned `version`, `sourceDisplayName`, `author`, `downloadCount`, `updateTime` and `sourceReadable`. `sourceNamespaceId` and `sourceName` are returned only after independent source READ and visibility checks. Do not require source permission for an otherwise valid Hub content read.

Client Agent retains `AgentDiscoveryResult`; AgentSpec retains `AgentSpec`. Neither requires top-level `hub` content metadata. MCP retains its detail structure and Prompt its native template DTO. A missing `hub` field alone cannot indicate failure across all Client reads. Ordinary Namespace behavior is unchanged.

## 5. Disabled Capability and Errors

With `nacos.ai.hub.enabled=false`, shared directories return empty pages after identity and parameter checks. Hub content and all seven management operations return HTTP `501` / `API_FUNCTION_DISABLED` (`40001`). Skill direct cloning remains available.

Invalid parameters normally return HTTP `400` / `PARAMETER_VALIDATE_ERROR` (`20002`); permission rejection is `403`; CAS, name or service-dependency conflicts are `409`. Missing/invalid resources retain each resource API's error model; do not assume one business error code across every type. Source-storage system faults must return sanitized 5xx rather than an empty directory. Handle unsuccessful results separately.

## 6. SDK and Further Reading

- [Maintainer SDK](./maintainer-sdk.md#13-agentic-resource-hub): typed requests and facades.
- [Agentic Resource Hub guide](../user/ai/resource-hub.md): permissions, lifecycle, MCP ownership and CLI scope.
- [Client API](../user/open-api.md): existing search parameters and content models.
