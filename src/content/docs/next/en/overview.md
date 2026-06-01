---
title: Nacos Overview
keywords: [Nacos, service discovery, configuration management, AI Registry]
description: Learn the Nacos name, pronunciation, core capabilities, product advantages, design principles, and recommended reading paths.
---

# Nacos Overview

Nacos is pronounced `/nɑ:kəʊs/`. The name comes from **Dynamic Naming and Configuration Service**.

Nacos is a dynamic service discovery, configuration management, and AI Registry platform for cloud-native and AI applications. The project started from two core problems: how applications find services, and how applications safely read and update configuration. In Nacos 3.x, these capabilities are extended with AI Registry, which manages AI resources such as MCP Servers, A2A Agents, Prompts, and Skills.

The goal is simple: applications should safely and quickly find the services, configuration, and AI capabilities they need at runtime.

## Core Capabilities

| Capability | What it solves | Start here |
| --- | --- | --- |
| Service discovery | Register, discover, subscribe to, and check services | [Quick Start](./quickstart/quick-start.mdx), [Client API](./manual/user/open-api.md) |
| Configuration management | Manage, update, roll back, and audit configuration | [Quick Start](./quickstart/quick-start.mdx), [Java SDK](./manual/user/java-sdk/usage.md) |
| AI Registry | Register, govern, and discover MCP Servers, Agents, Prompts, and Skills | [AI Registry Overview](./manual/user/ai/ai-registry-overview.md) |
| Operations | Deploy, monitor, upgrade, and secure Nacos clusters | [Deployment](./manual/admin/deployment/deployment-overview.md), [Monitoring](./manual/admin/monitor.md), [Authorization](./manual/admin/auth.mdx) |
| Plugins | Extend auth, data source, encryption, control, environment, and tracing behavior | [Plugins](./plugin/auth-plugin.md) |

## What Is New In Nacos 3.x

Nacos 3.x keeps the service discovery and configuration management capabilities, and adds stronger API, security, and AI features.

- **Unified v3 APIs**: Client API, Admin API, and Console API serve different callers with clearer boundaries.
- **Stronger default security**: Console and management APIs pay more attention to authentication and authorization.
- **AI Registry as a first-class capability**: Nacos can manage MCP Servers, A2A Agents, Prompts, Skills, AgentSpecs, and related versions.
- **Richer plugin model**: Auth, visibility, publish Pipeline, resource import, data source, and tracing can be extended when needed.
- **Clearer operations model**: Deployment, monitoring, upgrade, system parameters, Admin API, and Maintainer SDK are easier to use in platform operations.

## Product Advantages

### Easy To Use

Nacos provides a console, SDKs, OpenAPI, and Maintainer SDK. Developers can quickly connect applications to service discovery and configuration management. Operators can manage clusters through UI pages and APIs.

### Complete Capability Set

Nacos covers service discovery, configuration management, health checks, configuration history, gray release, authorization, monitoring, and plugin extension. Nacos 3.x also adds AI Registry for MCP, A2A, Prompt, Skill, and other AI application resources.

### Production-oriented

Nacos supports cluster mode, external databases, metrics, authentication, Admin API, and upgrade workflows. It can grow from local development to production operations.

### Open Ecosystem

Nacos works with Spring Cloud, Dubbo, Kubernetes, Higress, Dify, Spring AI Alibaba, and other ecosystems. The plugin model also lets teams extend Nacos for their own security, storage, and governance requirements.

## Design Principles

![Design principles](/img/doc/overview/design-philosophy-with-ai.svg)

### Easy To Use

Core Nacos features should be easy to adopt, understand, and operate. Users should not need to understand internal implementation details before they can register services, read configuration, or discover AI resources.

### Standards-oriented

Nacos prefers clear and stable interfaces and models. Service discovery, configuration management, v3 APIs, MCP, A2A, OpenAPI, and plugin extension should avoid unnecessary private constraints.

### Highly Available

Nacos is runtime infrastructure. Service discovery, configuration management, and AI resource discovery can all affect running applications. Nacos therefore continues to improve clustering, storage, push, recovery, and observability.

### Easy To Extend

Different teams have different security, audit, data source, and release processes. Nacos uses plugins and clear API boundaries so users can extend capabilities without changing core code.

## Architecture

![Nacos architecture](/img/doc/overview/3.0_overview.svg)

Nacos is built on communication, consistency, storage, and runtime foundation modules. On top of these foundations, it provides service discovery, configuration management, and AI Registry.

SDKs, OpenAPI, the console, and the Maintainer SDK are the main ways users access these capabilities.

Plugins and ecosystem integrations sit around the core. Plugins extend Nacos itself. Ecosystem integrations connect Nacos with Spring Cloud, Dubbo, Kubernetes, Higress, Dify, Spring AI Alibaba, and other systems.

## Data Model

![Nacos data model](/img/doc/overview/data-model.svg)

Nacos resources are usually isolated by namespace.

- In service discovery, the resource name is usually the service name.
- In configuration management, the resource name is usually the Data ID.
- In AI Registry, the resource name can be an MCP Server name, Agent name, Prompt key, Skill name, or AgentSpec name.

Use namespaces to separate environments, tenants, or business domains. In production, avoid mixing test and production resources in the same namespace.

## Deployment Modes

![Nacos deployment modes](/img/doc/overview/deploy-structure.svg)

Nacos supports standalone mode and cluster mode.

**Standalone mode** is suitable for local development, feature validation, and test environments. It is easy to start and can use the embedded Derby database. It is not recommended for highly available production traffic.

**Cluster mode** is suitable for production. Multiple nodes provide service together. With an external database and consistency protocols, the cluster has better availability. For production, also configure monitoring, alerting, authentication, and backup.

## Recommended Reading Paths

If you are new to Nacos:

1. Read [Quick Start](./quickstart/quick-start.mdx) and start Nacos first.
2. Read [Java SDK](./manual/user/java-sdk/usage.md) or [Client API](./manual/user/open-api.md) to connect an application.
3. Read [API Overview](./manual/user/overview/api-overview.md) to understand the boundary between Client API, Admin API, and Console API.

If you operate Nacos in production:

1. Read [Deployment](./manual/admin/deployment/deployment-overview.md) to confirm deployment mode, ports, and storage.
2. Read [System Configurations](./manual/admin/system-configurations.md) and [Monitoring](./manual/admin/monitor.md).
3. Read [Authorization](./manual/admin/auth.mdx), [Admin API](./manual/admin/admin-api.md), and [Maintainer SDK](./manual/admin/maintainer-sdk.md).

If you build AI applications:

1. Read [AI Registry Overview](./manual/user/ai/ai-registry-overview.md).
2. Choose the MCP, Agent, Prompt, or Skill document for your scenario.
3. If you need version governance, read [AI Resource Lifecycle](./manual/user/ai/ai-resource-lifecycle.md).

## Next Actions

- Try Nacos for the first time: read [Quick Start](./quickstart/quick-start.mdx).
- Prepare for production: read [Deployment](./manual/admin/deployment/deployment-overview.md).
- Use AI Registry: read [AI Registry Overview](./manual/user/ai/ai-registry-overview.md).
- Understand API boundaries: read [API Overview](./manual/user/overview/api-overview.md).
- Contribute to the community: read [Contributing](./contribution/contributing.md).
