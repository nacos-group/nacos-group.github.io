---
title: Agentic Resource Hub
keywords: [Nacos, Agentic Resource Hub, Skill, cross-namespace, sharing]
description: This document describes Agentic Resource Hub, including Skill sharing, discovery, download, import, cross-Namespace copy and feature configuration.
sidebar:
    order: 3
---

# Agentic Resource Hub

Agentic Resource Hub provides cross-Namespace resource sharing in Nacos. Starting with `3.3.0`, it supports Skill sharing, discovery, download, import and copy.

Use **Skill Registry** to manage Skills in the current Namespace and **Agentic Resource Hub** to browse shared Skills.

## 1. Sharing and Reuse

| Operation | Permissions | Result |
|-----------|-------------|--------|
| Share | Source Skill READ and WRITE permissions; the Skill must be enabled and PUBLIC, with an online version | Publish a reference to the specified version in Hub |
| Import from Hub | Access to the shared entry and WRITE permission on the target Namespace | Create an independent draft; source Namespace READ permission is not required |
| Direct copy | Source Skill READ and target Namespace WRITE permissions, with source visibility checks | Create an independent draft from a specified version without first sharing it |

Use `hubEntryId` to identify a Hub entry. Skills from different Namespaces may have the same name. Shared versions do not follow changes to the source `latest` label.

Imported and copied drafts retain provenance and have independent lifecycles. Their content does not automatically synchronize with the source.

## 2. Enablement Requirements

Configure `${nacos.home}/conf/application.properties`:

```properties
nacos.ai.hub.enabled=true
```

The default is `true`. Hub requires the AI module. Setting `nacos.extension.ai.enabled=false` or `nacos.functionMode=microservice` prevents the AI module from loading.

Hub APIs use Admin/Console authentication and resource visibility settings. Enable authentication for the corresponding scope. Shared entries support anonymous read-only access; sharing, import, copy and governance require a user identity with the corresponding permissions.

See [System Parameters](../../admin/system-configurations.md).

## 3. Share a Skill in Console

1. Open **AI Registry → Skill Registry**, then select the source Namespace and Skill.
2. Ensure the Skill is enabled and PUBLIC, and select an online version.
3. Select **Share to Hub** in **Hub Sharing Management**.
4. Open **Agentic Resource Hub** to search by name, description keywords and tags, inspect the shared version and file content, or download a ZIP package.

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

## 5. Direct Copy within a Cluster

Use the API or Maintainer SDK to specify the source Namespace, Skill name and online version, together with the target Namespace, name and version. The source Skill must be enabled. The caller needs source READ and target WRITE permissions and must pass source visibility checks.

Copy creates an independent draft with provenance in the target Namespace. Review and publish it through the AI resource lifecycle.

## 6. Disable Hub

```properties
nacos.ai.hub.enabled=false
```

Restart the server after changing the configuration. Keep the value consistent across Server instances in a cluster.

When disabled:

- Console hides the Hub entry, Skill sharing buttons and Hub reference links. Direct Hub page navigation redirects to an ordinary resource page. Refresh the page to apply the change.
- Hub list requests return empty pages after passing parameter and permission checks.
- Hub detail, content, download, sharing, adjustment, revocation, state lookup and import return HTTP `501` with business code `40001`.
- Existing shared data is retained. Ordinary Skill operations, direct copy and source lifecycle cleanup continue to work.

Clients can query Hub enablement through the `ai_hub_enabled` field in [Get Nacos Cluster Status Information](../../admin/admin-api.md#119-get-nacos-cluster-status-information).

## 7. Related Pages

- [Skill Registry](./skill-registry.md)
- [Admin API](../../admin/admin-api.md#12-agentic-resource-hub)
- [Maintainer SDK](../../admin/maintainer-sdk.md#13-agentic-resource-hub)
- [AI Resource Lifecycle](./ai-resource-lifecycle.md)
