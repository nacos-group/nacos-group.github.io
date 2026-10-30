---
title: Experimental Features Overview
keywords: [Nacos, Experimental Features, Distributed Lock, Kubernetes Sync, Nacos Controller]
description: Understand the positioning, usage boundary, and reading entry points for Nacos experimental features.
sidebar:
    order: 1
---

# Experimental Features Overview

Experimental features carry new capabilities, ecosystem experimental capabilities, or auxiliary tools that are still being validated. They let the community try new directions early, but they are not the same as stable Nacos core capabilities.

:::caution
Features in this section are experimental features or ecosystem experimental capabilities. Their APIs, configuration, data models, and maintenance model may change significantly. If community feedback is limited, some capabilities may later be moved out of the Nacos main repository and maintained separately under `nacos-group`.
:::

## How to use them

- Verify them in a test environment or a small traffic environment first.
- Read the boundary section of each feature before using it.
- Record versions, configuration, and usage details so upgrades can be checked later.
- If a feature is useful to your business, share scenarios, issues, and suggestions with the community.

## Current content

| Feature | Suitable scenario | Document |
| --- | --- | --- |
| Distributed Lock | Simple and short mutual exclusion control | [Distributed Lock](./distributed-lock.md) |
| Kubernetes Service Sync | Sync Kubernetes service and instance information into Nacos service discovery | [Kubernetes Ecosystem Experimental Capabilities](./ecosystem-integrations.md) |
| Nacos Controller service sync | Validate Kubernetes and Nacos service discovery integration | [Kubernetes Ecosystem Experimental Capabilities](./ecosystem-integrations.md) |

## Relationship with core capabilities

The stable core capabilities of Nacos remain service discovery, configuration management, and AI Registry. Experimental features may reuse these capabilities, but their own resource models, APIs, and maintenance rhythm are not fully stable yet.

If you need stable service registration, configuration publishing, AI resource management, authentication, visibility, deployment, or monitoring, start with the official manuals:

- [Configuration Overview](../manual/user/config/overview.md)
- [Service Discovery Overview](../manual/user/naming/overview.md)
- [AI Registry Overview](../manual/user/ai/ai-registry-overview.md)
- [Deployment Best Practices](../manual/admin/deployment/deployment-best-practices.md)
