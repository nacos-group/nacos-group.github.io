---
title: AI Registry Overview
keywords: [Nacos AI Registry, MCP Registry, A2A Registry, Prompt Registry, Skill Registry]
description: Learn what Nacos AI Registry manages and where different users should start.
sidebar:
  order: 1
---

# AI Registry Overview

AI Registry is the Nacos 3.x capability for registering, governing, discovering, and distributing AI resources. It sits beside configuration management and service discovery as a core Nacos capability.

In a microservice system, Nacos helps applications find services, read configuration, and react to changes. In an AI application, the application also needs to find MCP Servers, Agents, Prompts, Skills, and other AI resources. AI Registry provides the place where these resources are registered, published, governed, and discovered at runtime.

## What AI Registry Manages

AI Registry manages these resource types:

| Resource | What it manages | Typical users |
| --- | --- | --- |
| MCP Server | MCP server metadata, tools, resources, endpoints, and versions | AI applications, MCP clients, platform administrators |
| A2A Agent | AgentCard metadata, Agent endpoints, and versions | Agent developers, multi-agent applications |
| Prompt | Prompt templates, variables, versions, and labels | AI application developers, Prompt maintainers |
| Skill | Skill packages, versions, review, and distribution | Development teams, platform teams, automation tools |
| AgentSpec | Agent specification packages, versions, and visibility | Agent platforms, developer tools |

All these resources are isolated by namespace. Teams can use namespaces for environments, tenants, or business domains.

## Relationship With Config And Naming

AI Registry is not just configuration management with another name. It is also not ordinary service discovery.

Configuration management focuses on publishing, querying, listening to, and auditing configuration content. Service discovery focuses on services, instances, health state, and subscription push. AI Registry focuses on AI resource models, versions, lifecycle states, visibility, and runtime discovery.

Some AI resources reuse Config or Naming internally. For example, MCP Server metadata may currently be stored through configuration records, and endpoints may be represented through service discovery. From the user perspective, the resource is still an MCP Server, not a normal configuration item or a normal service.

## Common Paths

If you build AI applications:

- To discover and call MCP Servers, start with [MCP Server Auto Registration and Discovery](./mcp-auto-register.md) and [Nacos MCP Router](./nacos-mcp-router.md).
- To expose existing HTTP or RPC APIs as MCP tools, start with [Convert Existing APIs To MCP](./api-to-mcp.md).
- To query Prompts from applications, start with [Prompt Management](./prompt-registry.md) and [Client API](../open-api.md#3-ai).

If you build Agents:

- To register or discover A2A Agents, start with [A2A Registry](./agent-registry.md).
- To distribute Agent specification packages, use the AgentSpec APIs and Maintainer SDK.

If you operate a platform:

- To govern Prompt, Skill, and AgentSpec versions, start with [AI Resource Lifecycle](./ai-resource-lifecycle.md).
- To manage AI resources through APIs, see [Admin API](../../admin/admin-api.md#4-mcp-management) and [Console API](../../admin/console-api.md#4-mcp-management).
- To add release checks, security scans, or external resource import, look at Pipeline, import, and visibility capabilities.

## Resource Lifecycle

Versioned resources such as Prompt, Skill, and AgentSpec usually follow this flow:

```text
create draft -> update draft -> submit -> publish -> online -> offline or online again
```

If no publish Pipeline is enabled, submit may publish directly. If a Pipeline is enabled, the resource must pass the checks first. Administrators can force publish in emergency cases, but force publish skips Pipeline validation and should be used carefully.

For details, see [AI Resource Lifecycle](./ai-resource-lifecycle.md).

## Recommended Reading Order

1. Read this page to understand what AI Registry manages.
2. Read [AI Resource Lifecycle](./ai-resource-lifecycle.md) to understand versions and states.
3. Choose the MCP, Agent, Prompt, or Skill guide for your resource type.
4. Use the API, SDK, or console manual when you are ready to integrate.
