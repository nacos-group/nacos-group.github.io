---
title: Agentic Resource Hub
keywords: [Nacos, Agentic Resource Hub, Skill, MCP, Agent, Prompt, AgentSpec, cross-Namespace, sharing]
description: Sharing, discovery, pinned reads and import for five resource types, with direct cross-Namespace cloning for Skill.
sidebar:
    order: 3
---

# Agentic Resource Hub

Agentic Resource Hub provides cross-Namespace sharing, discovery and reuse for Skill, MCP, Agent, Prompt and AgentSpec. All five types can share a concrete online version and import it into a target Namespace. Only Skill supports direct cross-Namespace cloning without a Hub publication.

This page describes development builds containing Hub. Verify that your Server, Console and SDK include the implementation; a release version number alone does not guarantee availability. This page remains in `next`; released-version documentation is unchanged.

Open the shared catalog from each resource's management page. Skill uses **Skill Registry → Shared Skills**; the other types have their own shared lists and details. Sharing is within one Nacos cluster and does not publish to an external resource marketplace.

## 1. Sharing and Reuse

| Operation | Permissions | Result |
|-----------|-------------|--------|
| Share | Source READ and WRITE; enabled resource and an online version; PUBLIC except for Prompt | Publish a reference to the specified version in Hub |
| Import from Hub | Access to the shared entry and WRITE permission on the target Namespace | Create an independent draft; source Namespace READ permission is not required |
| Direct clone (Skill only) | Source Skill READ and target Namespace WRITE, with source visibility checks | Create an independent draft from a specified version without first sharing it |

Use `hubEntryId` to identify an entry. Same-named resources may come from different Namespaces. Sharing pins source resource and version identities rather than following `latest`; adjustment is explicit and CAS checked. Long IDs and `metaVersion` are serialized as JSON strings.

Imported and copied drafts retain provenance and have independent lifecycles. Their content does not automatically synchronize with the source.

## 2. Enablement Requirements

Configure `${nacos.home}/conf/application.properties`:

```properties
nacos.ai.hub.enabled=true
```

The default is `true`. Hub requires the AI module. Setting `nacos.extension.ai.enabled=false` or `nacos.functionMode=microservice` prevents the AI module from loading.

Shared reads use the selected API audience's authentication and resource visibility settings. Anonymous browsing requires the selected auth plugin to explicitly enable anonymous AI access and permit this operation. Public visibility alone does not bypass authentication. Sharing, import, copy and governance require a user identity with the corresponding permissions.

The server's `nacos.ai.hub.enabled` capability and `ai_hub_enabled` state are distinct from the Java runtime SDK's `nacosAiAccessHub` discovery option. The SDK option defaults to `false`, querying only the bound namespace. Set `nacosAiAccessHub=true` to query both namespaces separately and combine pages with namespace results first and shared results in Hub popularity order. Same display names remain separate, identified by namespace and opaque name. `nacos-cli skill-search` likewise defaults to local discovery; `--hub` enables combined discovery and `--no-hub` explicitly disables it.

See [System Parameters](../../admin/system-configurations.md).

## 3. Share in Console: Skill Example

1. Open **AI Registry → Skill Registry**, then select the source Namespace and Skill.
2. Ensure the Skill is enabled and PUBLIC, and select an online version.
3. Select **Share to Hub** in **Hub Sharing Management**.
4. Open **Skill Registry → Shared Skills** to filter by Skill name or a business tag, inspect the shared version and file content, or download a ZIP package.

Hub counters are independent of source Skill and version counters. Skill management lists default to shared update time descending; `orderBy=download_count` selects Hub downloads. Client search uses shared popularity. ID ascending breaks ties; filtering and sorting precede pagination. Content inspection does not increase downloads.

Users with source Skill write permission can manage sharing. Users with source Skill read permission can navigate from Hub to the source detail page.

The owner can adjust the shared version or unshare it. Administrators can take down a share with a reason. Unsharing retains the source Skill and previously imported independent drafts.

Taking the shared version offline, disabling the source Skill, making it PRIVATE, or deleting it invalidates the share. Deleting and recreating a resource or version with the same name does not restore the old share.

## 4. Import into Your Namespace

Select import on the Hub detail page and enter a writable target Namespace, target Skill name and target version.

- The target version defaults to `0.0.1`. The imported version has status `draft`.
- An existing target Skill with the same name causes a conflict; import does not overwrite it.
- Revoked or invalid shares cannot be imported.
- Review and publish the draft through the [AI Resource Lifecycle](./ai-resource-lifecycle.md).

For API and SDK usage, see [Admin API](../../admin/admin-api.md#12-agentic-resource-hub) and [Maintainer SDK](../../admin/maintainer-sdk.md#13-agentic-resource-hub).

## 5. Direct Clone within a Cluster: Skill Only

Use the API or Maintainer SDK to specify the source Namespace, Skill name and online version, together with the target Namespace, name and version. The source Skill must be enabled. The caller needs source READ and target WRITE permissions and must pass source visibility checks.

Use `POST /v3/admin/ai/hub/skills/clone` or the corresponding Console route; the Maintainer SDK method is `cloneHubSkill`. The old `/copy` route and `copyHubSkill` method are removed. The target is an independent draft reviewed and published through the ordinary lifecycle. The compatible provenance marker remains `DIRECT_COPY`. The other four types support Hub import only, without direct clone entry points.

## 6. Disable Hub

```properties
nacos.ai.hub.enabled=false
```

Restart the server after changing the configuration. Keep the value consistent across Server instances in a cluster.

When disabled:

- Console hides the shared Skill tab, sharing buttons and shared reference links. Direct shared-page navigation redirects to an ordinary resource page. Refresh the page to apply the change.
- Existing list/search APIs for all five types return empty pages for the shared namespace after parameter and permission checks.
- Hub detail, content, download, sharing, adjustment, revocation, state lookup and import return HTTP `501` with business code `40001`.
- Existing shared data is retained. Ordinary resource operations, Skill direct cloning and source lifecycle cleanup continue to work.

Clients can query Hub enablement through the `ai_hub_enabled` field in [Get Nacos Cluster Status Information](../../admin/admin-api.md#119-get-nacos-cluster-status-information).

## 7. Read through Existing Skill APIs

> `__nacos_ai_hub__` is a reserved read-only namespace contract, not a business namespace. Do not create resources in it. Omitting `namespaceId` still selects `public` only; the HTTP API does not combine spaces or accept a new `source` selector.

| Audience | List/search | Detail/content/download |
|---|---|---|
| Client | `GET /v3/client/ai/skills/search` | `GET /v3/client/ai/skills` returns the pinned ZIP |
| Admin | `GET /v3/admin/ai/skills/list` | `GET /v3/admin/ai/skills`, `/version`, `/version/download` |
| Console | `GET /v3/console/ai/skills/list` | `GET /v3/console/ai/skills`, `/version`, `/version/download` |

Pass the business namespace for local resources or `namespaceId=__nacos_ai_hub__` for shared resources. For combined discovery, the SDK or CLI sends two requests and merges results. There is no dedicated Client Hub read API or cross-type list-Hub API. Share, adjust, unshare, governance, import and copy keep their management operations.

```shell
# The /nacos prefix is this example server's servlet context.
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" --get \
  'http://127.0.0.1:8848/nacos/v3/client/ai/skills/search' \
  --data-urlencode 'namespaceId=__nacos_ai_hub__' \
  --data-urlencode 'query=find' --data-urlencode 'pageNo=1' --data-urlencode 'pageSize=20'
```

Shared discovery returns `discoverySource="HUB"`, opaque `name`, string-serialized `hubEntryId`, `displayName`, `sourceDisplayName`, pinned `version`, and independent `downloadCount`. Ordinary results use `discoverySource="NAMESPACE"`. Pass the selected shared `name` as `skillName` and the returned `version` to retrieve that publication. Never use the display name as identity or fall back to latest after a version mismatch. For Admin/Console, the models remain `SkillSummary`, `SkillMeta` and `Skill`; `SkillMeta.origin` remains copy/import provenance, separate from `discoverySource`.

Successful ZIP responses are raw `application/zip` bytes. Shared downloads include `X-Nacos-Hub-Entry-Id` and `X-Nacos-Skill-Resolved-Version` headers, retain the original Skill directory name, and count only against the shared entry. The Maintainer SDK reuses `listSkills`, `getSkillMeta`, `getSkillVersionDetail`, and the general `downloadSkillVersion` method with the reserved namespace.

## 8. Four Additional Resource Types

| Type | Sharing and content | Import behavior |
|---|---|---|
| MCP | Enabled, PUBLIC, concrete online version; preserves MCP detail, endpoints, configuration and Tools/Resources | PRIVATE draft; STDIO creates no Naming service, ordinary REF retains its reference, source-owned Direct creates a target-owned service |
| Agent | Enabled, PUBLIC, concrete online version; reads the pinned source runtime snapshot | PRIVATE draft; no dynamic endpoints, clients or heartbeats are copied |
| Prompt | Enabled, concrete online version; no new PUBLIC/scope requirement; retains template, variables, review and labels | PRIVATE draft, subsequently published through the ordinary Prompt lifecycle |
| AgentSpec | Enabled, PUBLIC, concrete online version; retains AGENTS.md, files and review data | PRIVATE draft with independent content and provenance |

Reads reuse each resource's existing paths with `namespaceId=__nacos_ai_hub__`. Identify resources by the returned opaque name, never the display name. An incorrect version must not fall back to `latest`. Client content keeps its native DTO; do not require a top-level `hub` on Agent or AgentSpec content.

Viewing the pinned source version requires independent source READ and visibility checks. When `sourceReadable=false`, source Namespace ID and name are withheld without preventing valid Hub reads.

MCP Direct import requires an unambiguous persistent fixed address and checks target service conflicts. Unsharing the source does not delete imported resources; target deletion does not delete source or REF services. Import copies definitions and necessary service registrations, not a new running MCP deployment. REF availability still depends on its original service.

See the [Hub extension API reference](../../admin/resource-hub-api.md) for complete Admin, Console and Client paths, management parameters and responses.

## 9. SDK and CLI

Obtain the Maintainer facades through `skill()`, `mcp()`, `agent()`, `prompt()` and `agentSpec()`, using typed sharing and import requests. Shared reads retain existing resource methods with the reserved Namespace. Import does not publish automatically.

The CLI supports Hub search and download for Skill and AgentSpec. A local download is not a Nacos Namespace import. The CLI does not yet provide complete sharing, adjustment, revocation and import commands for all five types. Check the installed version's `--help`; use HTTP APIs or the Maintainer SDK for sharing automation.

## 10. Related Pages

- [Skill Registry](./skill-registry.md)
- [Admin API](../../admin/admin-api.md#12-agentic-resource-hub)
- [Maintainer SDK](../../admin/maintainer-sdk.md#13-agentic-resource-hub)
- [Hub Extension API Reference](../../admin/resource-hub-api.md)
- [AI Resource Lifecycle](./ai-resource-lifecycle.md)
