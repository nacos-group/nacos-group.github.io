---
title: AI Resource Lifecycle
keywords: [Nacos AI Registry, AI Resource Lifecycle, Agent, MCP, Prompt, Skill, AgentSpec]
description: Manage drafts, reviews, publishing, online and offline states, and version labels for all five AI resource types.
sidebar:
  order: 11
---

# AI Resource Lifecycle

Nacos introduced AI resource lifecycle management in 3.2. In 3.3, it covers Agent, MCP Server, Prompt, Skill, and AgentSpec. Platform teams can use a common release flow to keep unpublished changes separate from online resources.

This page describes the standard 3.3 lifecycle. Existing A2A and MCP registration APIs retain compatibility behavior. Also consult [Agent Registry](./agent-registry.md) and [MCP Registry](./mcp-registry.md) when integrating.

## Resource And Version

An AI resource is identified by namespace, resource type, and resource name. A resource can have multiple versions, such as `1.0.0` and `1.1.0` of the Prompt `order-summary`.

Resource operations manage enablement, visibility, and business tags. Version operations manage content editing, review, publishing, and online or offline states. Disabling a resource is different from taking one version offline.

## States

| Version state | Meaning | Typical next action |
| --- | --- | --- |
| `draft` | Editable draft | Edit the content, then submit |
| `reviewing` | Pipeline review is running; content cannot be edited | Wait for the result |
| `reviewed` | Review completed, but not necessarily approved | Check the result; publish if approved, or redraft or resubmit if rejected |
| `online` | Published and online | Use at runtime, or take offline |
| `offline` | Offline, with content retained and not editable | Bring online again, or delete after confirming it is no longer needed |

Publishing moves the version to `online`; no separate online action is needed. Runtime access also depends on resource enablement, caller permissions, and the query rules for the resource type.

## Standard Publish Flow

When an applicable Pipeline is available, use this flow for normal changes:

```text
create draft -> edit -> submit -> reviewing -> reviewed
                                                  |
                              publish after approval -> online
```

1. **Create and edit a draft**: Update the content and add a commit message. Published content cannot be overwritten through the standard lifecycle; create a draft with a new version.
2. **Submit**: If an enabled Pipeline node supports the resource type, the version enters review. If no applicable node is available, submission publishes it directly as `online`.
3. **Check the result**: Both `APPROVED` and `REJECTED` results move the version to `reviewed`. By default, approval still requires a publish action.
4. **Handle rejection**: To change content, use redraft to return to `draft`, then edit and submit. To rerun checks without editing, resubmit the `reviewed` version.
5. **Publish and verify**: Confirm the version is online, then verify query, download, or discovery from an application that uses it.

The Pipeline is disabled by default. Enabling the global switch alone does not ensure that every resource is reviewed: an enabled node must support that resource type. For configuration and extensions, see [AI Publish Pipeline Plugin](../../../plugin/ai-pipeline-plugin.md).

Administrators can use force publish in emergencies to skip Pipeline validation and publish a `draft`, `reviewing`, or `reviewed` version. Force publish does not replace the online action for an offline version. Record the reason and assess the risk.

## Draft Rules

- Content can only be edited in `draft`. A version whose review has completed must also be redrafted before editing.
- A resource can have only one current editing draft. If creation or redraft reports an existing working version, resolve the current draft or pending release before retrying.
- Redraft keeps the version number. Changing published content requires a new version.
- Deleting a draft discards unpublished changes without replacing online versions.

## Labels And latest

Version labels map readable names to versions, such as `stable -> 1.0.0`. Applications can pin a version or use the label selectors supported by the resource.

`latest` is a reserved label managed by the server. Standard lifecycle operations follow these rules:

| Operation | Effect on latest |
| --- | --- |
| Publish, force publish, or bring a version online again | Points to the version just brought online |
| Take the latest version offline or delete it | Selects the greatest remaining online version according to the resource's version ordering |
| No online versions remain | Removes latest |
| Update custom labels | Preserves the server-managed latest and does not accept manual overrides |

As a result, `latest` does not always mean the greatest version number: bringing an older version online again also makes it latest. For default-version compatibility in existing A2A and MCP direct registration APIs, see their resource guides.

For canary or production rollouts, use explicit versions or custom labels such as `stable` and `canary`, and confirm the target is online. Do not use unpublished versions as runtime targets. Updating a label changes version selection; it neither changes content nor brings a version online.

## Online And Offline

| Need | Action | What to check |
| --- | --- | --- |
| Suspend one version | Take it offline | Applications using an explicit version or custom label may lose access; check the automatic latest change |
| Restore an offline version | Bring it online again | Content is unchanged; latest moves to this version |
| Suspend a resource | Disable the resource | Runtime availability of all versions is affected |
| Restore a resource | Enable the resource | Drafts and offline versions are not automatically published or brought online |
| Remove unused content | Delete a version or resource | Confirm that applications no longer depend on it; deletion is not a substitute for reversible offline operations |

MCP Server and Agent definition versions are managed separately from running instances and endpoints. An online version does not mean the application process has started or its endpoints are healthy. Verify actual calls after publishing.

## Visibility And Permission

An online version may still be unavailable because the resource is disabled, visibility is restricted, or the caller lacks permissions. Check resource enablement, version state, client identity, and permissions in that order.

Visibility determines who can see a resource; authentication and authorization determine which operations the caller can perform. See [Visibility Plugin](../../../plugin/visibility-plugin.md) and [Authentication](../../admin/auth.mdx).

## Suggestions For Platform Teams

- Configure applicable Pipelines for production resources and verify that submission actually enters review.
- Before publishing, identify whether applications use an explicit version, latest, or a custom label, and assess the rollout impact.
- Keep recoverable historical versions and check consumers before taking versions offline or disabling resources.
- Separate environments with namespaces and keep audit records for force publish.

## Resource Guides

- [Agent Registry](./agent-registry.md): Agent definition versions and runtime endpoints.
- [MCP Registry](./mcp-registry.md): MCP definition publishing, legacy registration compatibility, and runtime verification.
- [Prompt Registry](./prompt-registry.md): Templates, variables, and application version selection.
- [Skill Registry](./skill-registry.md): Skill package creation, review, and distribution.
- [AgentSpecs Registry](./agentspec-registry.md): Specification package publishing and query.
