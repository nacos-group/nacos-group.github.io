---
title: AI Registry Overview
keywords: [Nacos AI Registry, Skill Registry, A2A Registry, MCP Registry, Prompt Registry, AgentSpecs Registry]
description: Learn the Nacos AI Registry panorama, core resources, and entry points for different users.
sidebar:
  order: 1
---

# AI Registry Overview

AI Registry is the Nacos 3.x capability for registering, governing, discovering, and distributing AI resources. It sits beside configuration management and service discovery as a core Nacos capability.

In a microservice system, Nacos helps applications find services, read configuration, and react to changes. In an AI application, the application also needs to find Skills, Agents, MCP Servers, Prompts, AgentSpecs, and other AI resources. AI Registry provides the place where these resources enter the platform, get governed, are published by version, and are discovered at runtime.

## AI Registry Panorama

An AI application usually goes through resource creation, publishing, runtime discovery, and ongoing governance. Nacos AI Registry puts these resources into a shared namespace, version, and permission model.

| Scenario | Resource managed by Nacos | Runtime usage | Governance focus |
| --- | --- | --- | --- |
| Skill | Skill packages, SkillCards, versions, and labels | Agents or toolchains download by name, version, or label | Package source, review, visibility, and distribution scope |
| Agent | AgentCards, Agent endpoints, and versions | Multi-agent applications discover Agents and call them | Endpoints, versions, external providers, and visibility |
| MCP Server | MCP server metadata, tools, resources, endpoints, and versions | MCP clients, MCP Router, gateways, or Agents discover and call tools | Protocols, endpoints, tool switches, import, and proxy |
| Prompt | Prompt templates, variables, versions, and labels | Applications read templates by Prompt key, version, or label | Review, rollback, latest labels, and canary usage |
| AgentSpec | Agent specification packages, manifests, content, and resources | Agent platforms, developer tools, or AI applications load specification packages | Package integrity, versions, labels, and public scope |

All these resources are isolated by namespace. Teams can use namespaces for environments, tenants, or business domains.

## Skill Registry

Skill Registry manages reusable AI capability packages. A Skill can describe its name, inputs and outputs, dependent resources, versions, and visibility. Platform teams can package common capabilities as Skills, while developers or Agent runtimes fetch them by name, version, or label.

Common use cases include:

- Package internal tools, automation flows, or model capabilities as distributable Skills.
- Use draft, review, publish, online, and offline states to control production availability.
- Use business tags, version labels, and visibility scope to manage who can use a Skill.
- Download Skill ZIP packages through client APIs for runtimes or developer tools.

See [Skill Registry](./skill-registry.md) for details.

## Agent Registry

Agent Registry (A2A Registry) manages Agents that can be discovered and called. Nacos stores AgentCards, endpoints, and version information so multi-agent applications can discover suitable Agents at runtime.

Agents can come from different sources. Spring AI Alibaba applications can auto-register Agents. Custom Agents can be published through SDKs or APIs. Agents from external providers can also be imported and governed in one place. Platform teams can manage Agent versions, endpoints, and visibility in a consistent way.

Agent Registry focuses on callable Agent entries. AgentSpecs Registry focuses on Agent specification packages. They can work together, but they are not the same resource.

See [Agent Registry](./agent-registry.md) for details.

## MCP Registry

MCP Registry is one of the most common AI Registry integration scenarios. It gives MCP Servers, existing APIs, external tool services, and AI applications a unified registration and discovery entry point.

![MCP Registry architecture](/img/doc/overview/mcp-registry-overview.svg)

Nacos can manage MCP Server metadata, tools, resources, endpoints, versions, and protocol exposure. New MCP Servers can auto-register into Nacos. Existing HTTP or RPC services can be declared and converted into MCP tools with gateway support. MCP Servers from external providers can also be imported and governed in one place.

Common MCP Registry paths include:

- A new MCP Server auto-registers into Nacos and is discovered by MCP clients or Agents at runtime.
- An existing API is converted into an MCP Server through server, tool, and endpoint declarations.
- Nacos MCP Router discovers MCP Servers in Nacos and exposes routing or proxy capabilities to clients.
- Dify, Higress, Spring AI Alibaba, and other ecosystem components read MCP Server information from Nacos.

See [MCP Server Auto Registration and Discovery](./mcp-auto-register.md), [Convert Existing APIs To MCP](./api-to-mcp.md), [Nacos MCP Router](./nacos-mcp-router.md), and [Dify Discovers Nacos MCP Server](./dify-nacos-mcp.md) for details.

## Prompt Registry

Prompt Registry manages prompt templates. It is useful when you want to move prompts out of application code and manage their versions, variables, labels, and release states in a platform.

Common usage includes:

- Manage template content and variable descriptions by Prompt key.
- Keep each prompt change as a version for audit and rollback.
- Use labels such as `latest`, `stable`, or `canary` to control the version read by applications.
- Query prompts through client APIs when an application starts or while it is running.

See [Prompt Registry](./prompt-registry.md) for details.

## AgentSpecs Registry

AgentSpecs Registry manages Agent specification packages and their metadata. An AgentSpec usually contains manifest information, descriptive content, and related resource files. It is useful for distributing standardized Agent descriptions to Agent platforms, developer tools, and AI applications.

Nacos supports AgentSpec ZIP upload, draft creation, draft update, submit, publish, force publish, redraft, online, offline, labels, business tags, visibility scope, and version metadata query. At runtime, client APIs can get an AgentSpec by name, version, or label, and can also search available AgentSpecs with pagination.

See [AgentSpecs Registry](./agentspec-registry.md) for details.

## Relationship With Config And Naming

AI Registry is not just configuration management with another name. It is also not ordinary service discovery.

Configuration management focuses on publishing, querying, listening to, and auditing configuration content. Service discovery focuses on services, instances, health state, and subscription push. AI Registry focuses on AI resource models, versions, lifecycle states, visibility, and runtime discovery.

Some AI resources reuse Config or Naming internally. For example, MCP Server metadata may currently be stored through configuration records, and endpoints may be represented through service discovery. From the user perspective, the resource is still an MCP Server, not a normal configuration item or a normal service.

## Common Paths

If you build AI applications:

- To download and use reusable capability packages, start with [Skill Registry](./skill-registry.md) and [Client API](../open-api.md#3-ai).
- To register, discover, or call A2A Agents, start with [Agent Registry](./agent-registry.md).
- To discover and call MCP Servers, start with [MCP Server Auto Registration and Discovery](./mcp-auto-register.md) and [Nacos MCP Router](./nacos-mcp-router.md).
- To expose existing HTTP or RPC APIs as MCP tools, start with [Convert Existing APIs To MCP](./api-to-mcp.md).
- To query Prompts from applications, start with [Prompt Registry](./prompt-registry.md) and [Client API](../open-api.md#3-ai).
- To distribute or load Agent specification packages, start with [AgentSpecs Registry](./agentspec-registry.md) and [Client API](../open-api.md#3-ai).

If you operate a platform:

- To govern Prompt, Skill, and AgentSpec versions, start with [AI Resource Lifecycle](./ai-resource-lifecycle.md).
- To manage MCP, Prompt, Skill, AgentSpec, or external AI resource import, see [Admin API](../../admin/admin-api.md) and [Console API](../../admin/console-api.md).
- To add release checks, security scans, or external resource import, look at Pipeline, import, and visibility capabilities.

## Resource Lifecycle

Versioned resources such as Prompt, Skill, and AgentSpec usually follow this flow:

```text
create draft -> update draft -> submit -> publish -> online -> offline or online again
```

If no publish Pipeline is enabled, submit may publish directly. If a Pipeline is enabled, the resource must pass the checks first. Administrators can force publish in emergency cases, but force publish skips Pipeline validation and should be used carefully.

For details, see [AI Resource Lifecycle](./ai-resource-lifecycle.md).

## Reading Suggestions

1. Read this page to understand what AI Registry manages.
2. Choose the Skill, Agent, MCP, Prompt, or AgentSpecs guide for your resource type.
3. Read [AI Resource Lifecycle](./ai-resource-lifecycle.md) to understand versions and states.
4. Use the API, SDK, or console manual when you are ready to integrate.
