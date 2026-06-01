---
title: AI Resource Lifecycle
keywords: [Nacos AI Registry, AI Resource Lifecycle, Prompt, Skill, AgentSpec]
description: Understand draft, review, publish, online, and offline flows for versioned AI Registry resources.
sidebar:
  order: 11
---

# AI Resource Lifecycle

Many AI Registry resources need version management. Prompts keep different template versions. Skills keep different package versions. AgentSpecs distribute different specification versions.

This page explains the shared lifecycle for these resources. Each resource type may have its own fields and APIs, but the main ideas are the same.

## Resource And Version

An AI resource is identified by namespace, resource type, and resource name.

```text
namespaceId -> resourceType -> resourceName
```

A resource can have multiple versions. The resource stores metadata such as description, visibility, business tags, and the current editing version. A version stores the actual content, status, author, publish information, and storage location.

For example:

- `public -> prompt -> order-summary` is a Prompt resource.
- `1.0.0` and `1.1.0` are versions of that Prompt.
- `latest` can point to the recommended version.

## States

A resource can be enabled or disabled. If it is disabled, runtime clients should not treat it as available even if the resource still exists.

A version usually has one of these states:

| State | Meaning |
| --- | --- |
| `draft` | Editable draft |
| `reviewing` | Submitted for Pipeline or review processing |
| `reviewed` | Review completed and waiting for publish |
| `online` | Published and queryable at runtime |
| `offline` | Kept in history but not used for normal runtime routing |

## Standard Publish Flow

The recommended flow is:

```text
create draft -> update draft -> submit -> review -> publish -> online
```

Common paths:

| Scenario | Recommended action |
| --- | --- |
| Normal change | Create a draft, submit it, publish after review |
| No Pipeline enabled | Submit may publish directly or make the version ready to publish |
| Emergency fix | Let an administrator force publish and record the reason |

Force publish skips Pipeline validation. It is useful for emergencies, not for daily releases.

## Draft Rules

A draft is the editable version. It keeps unfinished changes away from online applications.

Recommended practices:

- Create a draft before changing an online version.
- Do not point labels to a draft.
- Deleting a draft should not affect online versions.
- Keep one active draft for a resource when possible, so different edits do not overwrite each other.

## Labels And latest

Labels map readable names to versions. The most common label is `latest`.

Runtime applications can query by explicit version or by label. When querying by label, Nacos resolves the label to a version at request time.

Labels should point only to usable versions. They should not point to `draft` or `reviewing` versions.

## Online And Offline

Publishing means a version has completed the publish process. Online means the version can be returned to runtime clients.

Offline does not mean deleted. An offline version can still be kept for audit, rollback, or manual query. Whether it can be brought online again depends on the resource type and permission rules.

## Visibility And Permission

AI Registry query results are affected by visibility and authentication. A resource can be `online` but still invisible to a caller that has no permission.

Visibility decides whether a resource should appear in detail, list, or search results. Auth decides whether the current identity can read or write the target resource. They work together, but they have different responsibilities. For details, see [Visibility Plugin](../../../plugin/visibility-plugin.md).

Platform administrators should check three things:

- Whether the resource is enabled.
- Whether the version is online.
- Whether the caller can see the resource.

## Suggestions For Platform Teams

- Enable publish Pipelines for production resources.
- Require review or audit notes for force publish.
- Use namespaces to separate environments.
- Clean up unused drafts and long-offline versions regularly.
- Keep the `latest` label clear for important resources.
