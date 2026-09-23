---
title: ARD Resource Discovery
keywords: [Nacos AI Registry, ARD, Agentic Resource Discovery, Resource search, Resource catalog]
description: Discover Agents, Skills, Prompts, and MCP Servers in Nacos through ARD, including publishing, visibility, and artifact usage rules.
sidebar:
  order: 3.2
---

# ARD Resource Discovery

[ARD (Agentic Resource Discovery)](https://agenticresourcediscovery.org/) is an open specification for describing, searching, and discovering AI resources. The [official specification](https://agenticresourcediscovery.org/spec/) credits Junjie Bu (Google), R. V. Guha (Microsoft), and Shaun Smith (Hugging Face) as authors. Its source is available in the [official GitHub repository](https://github.com/ards-project/ard-spec).

Nacos 3.3 exposes published Agents, Skills, Prompts, and MCP Servers to AI applications and toolchains through ARD-compatible endpoints. Clients can search for capabilities and then retrieve their artifacts.

For server setup, authentication, and complete HTTP examples, see the [ARD Integration Guide in Ecology](../../../ecology/use-nacos-with-ard.md). This page explains which resources appear in discovery results and how applications use them.

## 1. Choose a discovery method

| Use case | Entry point |
| --- | --- |
| A toolchain needs ARD to search multiple AI resource types, browse catalogs, and download artifacts | [ARD Integration Guide](../../../ecology/use-nacos-with-ard.md) |
| An application needs Agent call definitions, runtime endpoints, and change subscriptions | [RAD Integration Guide](./rad-discovery.md); RAD stands for Remote Agent Discovery |
| An application uses Nacos APIs directly to search resources, or needs to search AgentSpecs | AI resource search and resource-specific endpoints in the [Client API](../open-api.md) |

ARD currently covers Agents, Skills, Prompts, and MCP Servers. AgentSpecs are accessed through native Nacos APIs and are not included in ARD results.

## 2. Make resources discoverable

Create and publish resources through their management pages. No separate ARD registration is required:

1. Follow the [Agent](./agent-registry.md), [Skill](./skill-registry.md), [Prompt](./prompt-registry.md), or [MCP](./mcp-registry.md) guide to create a resource. Provide a name, description, and business tags to help users search and filter.
2. Submit and publish it through the [AI Resource Lifecycle](./ai-resource-lifecycle.md). Confirm that the resource is enabled and `latest` points to an `online` version. Drafts and reviewed but unpublished versions do not appear in discovery results.
3. Check visibility and the caller's permissions. `PUBLIC` resources are publicly discoverable; `PRIVATE` resources are visible only to identities with the required read permissions. Anonymous callers can discover only public resources, and anonymous access must first be enabled on the server.
4. Query the catalog or search as the integration account, and check the resource name, version, and URL.

The `public` namespace and `PUBLIC` visibility scope are separate settings. Creating a resource in the `public` namespace does not make it public.

Search returns the current online version selected by `latest`, rather than listing every historical version as a separate result. Search synchronization may take time after a resource is published, taken offline, or updated. Results may also be temporarily incomplete after startup or upgrade. When a resource is missing, check its publishing state and permissions before retrying.

## 3. Filter and use results

ARD `type` is the media type of the downloadable artifact, rather than the Nacos resource type name. Use `query.filter.type` to select formats your application can handle:

| Resource | `type` | How to use the artifact |
| --- | --- | --- |
| Agent: A2A representation | `application/a2a-agent-card+json` | Parse the AgentCard with an A2A client. |
| Agent: Nacos definition | `application/vnd.nacos.ai-agent+json` | Read the versioned Agent definition and call interfaces; use RAD for runtime endpoint discovery and subscriptions. |
| Skill | `application/agent-skills+zip` | Retrieve the ZIP containing `SKILL.md` and packaged resources for a tool that supports Skills. |
| Prompt | `application/vnd.nacos.ai-prompt+json` | Read the Prompt content and variable definitions, then use the template with application inputs. |
| MCP Server | `application/mcp-server-card+json` | Read the MCP Server description and connect to the actual service with an MCP client. |

Read `identifier`, `version`, `type`, and `url` from a result, then download the artifact from `url`. Search responses place resources in `results`, list responses in `items`, and catalog responses in `entries`. See the [ARD Integration Guide](../../../ecology/use-nacos-with-ard.md) for pagination and download examples.

### 3.1. Agent representations

A single ARD query returns at most one entry per Agent. If the current `latest` contains only A2A interfaces and can export a complete AgentCard, the default is the A2A representation. Definitions containing multiple protocols prefer the Nacos representation. Applications that support only A2A should filter by the A2A media type.

Availability of the A2A representation depends on the current `latest` version. An older version supporting A2A does not cause its AgentCard to be returned for the current version in ARD.

An Agent artifact contains the definition for a specific version, without runtime endpoints or live health state. Default health flags on declared addresses do not represent health probes either. To select healthy running instances, use [RAD](./rad-discovery.md) to discover endpoints, then invoke them with the appropriate protocol client.

## 4. Verify the integration

1. Search with the application's identity and namespace, and confirm that the published resource is found.
2. Fetch the result's `url` and check that the version and `Content-Type` match what the application expects.
3. Verify Skill and Prompt loading in the tool or application. For Agents and MCP Servers, also verify connectivity and credentials for the actual service.

ARD provides search, catalogs, and artifact retrieval. Edit, publish, and take resources online or offline through the Nacos console, [Admin API](../../admin/admin-api.md), or [Maintainer SDK](../../admin/maintainer-sdk.md).
