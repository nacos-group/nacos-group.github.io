---
title: User Manual Overview
keywords: [user manual, configuration center, service registry, AI Registry, SDK, OpenAPI]
description: An entry point for the Nacos user manual, helping users choose documents by scenario.
---

# User Manual Overview

The user manual is for developers, application owners, and operators who integrate applications with Nacos. It focuses on how applications use Nacos, not on server deployment or plugin development details.

If you are new to Nacos, start from your scenario:

| Scenario | Recommended entry | Audience |
| --- | --- | --- |
| Manage and discover AI resources such as Skills, Agents, MCP Servers, Prompts, and AgentSpecs | [AI Registry](./ai/ai-registry-overview.md) | AI application developers, platform engineers |
| Publish, query, listen to, and gray-release configurations | [Configuration Center](./config/overview.md) | Application developers, configuration owners |
| Register instances, discover services, and subscribe to instance changes | [Service Registry](./naming/overview.md) | Microservice developers, application operators |
| Integrate Nacos through Java, Go, Python, or another SDK | [SDK Overview](./overview/other-language.md) | Application developers |
| Understand client connections, cache, reconnect, and recovery behavior | [SDK Runtime](./sdk/runtime-guide.md) | Application developers, SREs |
| Integrate through HTTP Client APIs | [OpenAPI Overview](./overview/api-overview.md), [Client API](./open-api.md) | Client developers outside the SDK ecosystem |
| Configure client identity and credentials | [Access Credentials](./auth.mdx) | Application developers, platform administrators |
| Understand parameter validation and common validation failures | [Parameters Check](./parameters-check.md) | Application developers |
| Understand server address resolution | [Addressing](./addressing.mdx) | Application developers, operators |

## Choosing Client SDK, OpenAPI, Or Management APIs

Business applications should prefer the Client SDK. The Client SDK connects to Nacos, maintains listeners and subscriptions, handles local cache, and tries to recover runtime intent after reconnect.

Use the Client OpenAPI when your language runtime does not have a suitable SDK yet, or when you only need a small set of known resource read, registration, and discovery operations. The Client OpenAPI is not designed for broad resource management.

For bulk configuration publishing, full-list queries, namespace management, server state changes, or audit and operations work, use the Admin API, Console API, or Maintainer SDK in the admin manual.

## Continue Reading

- To run Nacos quickly, read [Quick Start](../../quickstart/quick-start.mdx).
- To understand deployment and production boundaries, read [Deployment Manual](../admin/deployment/deployment-overview.md) and [Deployment Best Practices](../admin/deployment/deployment-best-practices.md).
- To understand plugin capabilities, read [Plugin Overview](../../plugin/overview.md).
