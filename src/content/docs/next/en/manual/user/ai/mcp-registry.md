---
title: MCP Registry
keywords: [Nacos AI Registry, MCP Server, MCP Registry, Lifecycle]
description: Manage MCP Server drafts, reviews, releases, versions, and runtime availability with Nacos 3.3.
sidebar:
  order: 3.5
---

# MCP Registry

Nacos manages MCP Server descriptions, tools, resources, protocols, versions, and endpoints for discovery and use by MCP clients, Agents, gateways, and routers. In 3.3, MCP Server joins the shared [AI Resource Lifecycle](./ai-resource-lifecycle.md), allowing teams to edit drafts and review changes before publishing.

## Managed Objects

| Object | Managed content |
| --- | --- |
| MCP Server resource | Name, namespace, enablement, visibility, and business tags |
| Definition version | Server description, protocol, tool and resource definitions, version state, and labels |
| Runtime endpoint | The address and runtime status of the actual service |

Publishing a definition and starting an MCP Server are separate operations. A published remote MCP Server still needs an accessible runtime endpoint. Existing API conversion also requires a gateway for protocol translation.

## Publish A Version

Use the new 3.3 console or lifecycle management APIs to change MCP definitions:

1. Create a draft with the server description, protocol, tools, and resources. To change a published definition, create a draft with a new version based on the existing one.
2. Save and check the draft, including tool parameters and the calling conventions expected by consumers.
3. Submit the draft. An enabled Pipeline node that supports MCP starts review. If no applicable node is available, submission publishes the version directly.
4. Check the completed review result. `reviewed` means review completed, not approval. Publish after approval; after rejection, redraft before editing, or resubmit to rerun checks.
5. Confirm the version is `online`, then verify discovery and calls from an MCP client, Agent, or gateway.

The standard lifecycle only permits editing drafts. Published and offline content cannot be overwritten directly. For emergency force publish, redraft, and online or offline rules, see [AI Resource Lifecycle](./ai-resource-lifecycle.md).

## Versions And Availability

- **Default version**: Standard publish and online actions automatically point `latest` to that version; no manual update is needed.
- **Suspend a version**: Take it offline. If it is latest, the server selects another remaining online version. Also check clients pinned to a version or custom label.
- **Suspend an MCP Server**: Disable the resource. Enabling it again does not automatically publish drafts or bring offline versions online.
- **Control access**: Combine visibility with caller permissions. Seeing a resource in a management view does not mean every runtime caller can use it.
- **Check endpoints**: If a definition is online but calls fail, check the MCP Server process, network, endpoints, and gateway configuration.

## Existing Registration Compatibility

Existing MCP create, update, and SDK automatic registration paths retain direct publishing behavior. Upgrading to 3.3 does not automatically put these requests through review. Legacy parameters that select the default version also retain compatibility semantics.

To require review before release, integrate with the draft, submit, and publish flow. The 3.3 Java SDK adds a `createDraft` parameter in `releaseMcpServer` overloads. Setting it to `true` creates a draft without submitting or publishing it; the default retains direct publishing. Confirm server support before using it, then complete publication through the lifecycle flow.

Whether an existing integration uses this parameter depends on the framework or component. Enabling Pipeline alone does not guarantee that existing automatic registration requests are reviewed. Legacy update compatibility also does not allow new draft APIs to overwrite published versions.

## Integration And References

- [MCP Server Auto Registration and Discovery](./mcp-auto-register.md): Application and framework integration.
- [Convert Existing APIs To MCP](./api-to-mcp.md): Expose existing HTTP or RPC APIs as MCP tools.
- [Nacos MCP Router](./nacos-mcp-router.md): Discovery, routing, and proxying.
- [AI Resource Lifecycle](./ai-resource-lifecycle.md): States, Pipelines, labels, and online or offline rules.
- [Admin API](../../admin/admin-api.md), [Console API](../../admin/console-api.md), and [Maintainer SDK](../../admin/maintainer-sdk.md): Programmatic management entry points.
