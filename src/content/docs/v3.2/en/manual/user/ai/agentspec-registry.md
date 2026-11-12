---
title: AgentSpecs Registry
keywords: [Nacos AI Registry, AgentSpecs Registry, AgentSpec, AI Agent]
description: Learn how Nacos AgentSpecs Registry manages AgentSpec packages, versions, labels, visibility scope, and runtime query.
sidebar:
  order: 10
---

# AgentSpecs Registry

AgentSpecs Registry manages Agent specification packages. It is designed for Agent platforms, developer tools, and AI applications that need to distribute standardized Agent descriptions, resources, and versions.

Agent Registry focuses on callable Agent entries. AgentSpecs Registry focuses on specification packages that describe Agent capabilities, behavior, and resources. They can work together: a platform can distribute a standard description through AgentSpec and expose callable Agent instances through Agent Registry.

## Problems It Solves

- Multiple teams need to reuse the same Agent specification without copying it into every repository.
- Agent specifications need versioned publishing, rollback, and label-based routing.
- Developer tools, Agent platforms, or AI applications need to fetch AgentSpecs by name, version, or label.
- Platform teams need to control visibility scope, business tags, and online or offline states.
- AgentSpecs need review, security scanning, or other Pipeline checks before release.

## What An AgentSpec Contains

In Nacos, an AgentSpec usually contains metadata, descriptive content, and resource information.

| Content | Description |
| --- | --- |
| Basic information | Namespace, name, description, business tags, source, and visibility scope |
| Specification content | Main AgentSpec content that describes Agent capabilities, constraints, or usage |
| Resource information | Resource files or resource metadata distributed with the AgentSpec |
| Version information | Version, state, labels, update time, and publish information |

An AgentSpec can be uploaded as a ZIP package, or created and updated through draft APIs. After publishing, runtime applications can query or search available AgentSpecs through client APIs.

## Lifecycle

AgentSpec follows the common Nacos AI resource lifecycle.

```text
upload or create draft -> update draft -> submit -> publish -> online -> offline or online again
```

Common management actions include:

- Upload a ZIP package to create or update an AgentSpec.
- Create a draft version and keep updating its content.
- Submit the draft so Pipeline checks can run.
- Publish a version and update `latest` or other labels when needed.
- Set the visibility scope to public or private.
- Bring a single version or the whole AgentSpec online or offline.
- Query version details or version metadata.

For more state details, see [AI Resource Lifecycle](./ai-resource-lifecycle.md).

## Runtime Query

AI applications, Agent platforms, and developer tools can use client APIs to fetch AgentSpecs:

- Query an AgentSpec by `name`.
- Fetch a specific version by `version`.
- Fetch the version pointed to by `label`.
- Search AgentSpecs with pagination and keywords.

If a client already caches content locally, it can use the `md5` parameter in the API to decide whether the local content should be refreshed. For request parameters and response fields, see [Client API](../open-api.md#3-ai).

## Suggestions For Platform Operators

- Use namespaces to separate environments, tenants, or business domains.
- Keep clear labels for production-ready versions, such as `latest`, `stable`, or business-specific labels.
- Apply consistent rules for visibility scope, business tags, and publish permissions.
- Enable Pipeline checks for high-risk AgentSpecs before they enter production.
- Before taking an AgentSpec offline, confirm whether Agent platforms, developer tools, or AI applications still depend on that version.

## Related Documents

- [AI Registry Overview](./ai-registry-overview.md)
- [AI Resource Lifecycle](./ai-resource-lifecycle.md)
- [Client API](../open-api.md#3-ai)
- [Admin API](../../admin/admin-api.md#8-agentspec-management)
