---
title: Visibility Plugin
keywords: [Visibility, Plugin, Auth, AI Registry]
description: Learn what the Nacos visibility plugin does, how the default implementation works, how to configure it, and how it relates to auth plugins.
sidebar:
    order: 3
---

# Visibility Plugin

The visibility plugin decides whether a resource is visible to the current caller. It often works with auth plugins, but it is not the same thing.

- **Auth** decides whether an identity can perform a read or write action on a target resource.
- **Visibility** decides whether a resource should be visible to that identity, and whether it should appear in detail, list, or search results.

This distinction is especially important for AI Registry. Skills, Prompts, AgentSpecs, and similar resources can be `PUBLIC` or `PRIVATE`. A resource can be online but still invisible to a caller that is not the owner, not an administrator, and not explicitly authorized.

## When To Use It

Visibility plugins are useful when:

- List and search APIs should return only resources visible to the caller.
- Private resources should not be leaked through counts, empty pages, or error messages.
- Resource owners should be able to manage their own resources.
- Public resources should be readable by more callers, but not writable by everyone.
- Platform teams need explicit grants for selected roles or identities.

## Relationship With Auth Plugins

A visibility plugin can make visibility decisions by itself, or delegate explicit grants to the selected auth plugin. The default implementation uses the second approach.

The default implementation maps explicit visibility permission to this resource format:

```text
@@visibility/{namespaceId}/{resourceType}/{resourceName}
```

Then it asks the current auth plugin to evaluate that resource. This keeps the responsibilities separate:

| Capability | Responsibility |
| --- | --- |
| Auth plugin | Authenticate the caller and authorize read or write permissions on a resource. |
| Visibility plugin | Decide whether a resource should appear in detail, list, or search results. |

## Default Visibility Implementation

Nacos provides a default visibility implementation named `nacos`. It is provided by the default Nacos auth implementation and currently serves AI Registry resources.

Default behavior:

| Scenario | Behavior |
| --- | --- |
| New resource without `scope` | Defaults to `PRIVATE`. |
| Global administrator | Can read and write all visibility-aware resources. |
| Owner accessing own resource | Can read and write. |
| Non-owner reading a `PUBLIC` resource | Allowed. |
| Non-owner writing a `PUBLIC` resource | Not automatically allowed. Write permission is still required. |
| Explicit visibility grant | Evaluated by the auth plugin through `@@visibility/...`. |
| Anonymous AI public read | Works only when the endpoint allows anonymous access and anonymous AI access is enabled. |
| Denied read | The API may return not found to avoid leaking resource existence. |
| Denied write | Returns access denied. |

List and search APIs must not page first and then filter visibility in memory. That would make `totalCount` inaccurate, create empty pages, and cause unpredictable latency. Visibility should be applied before count and page queries run.

## Configuration

The default configuration includes visibility plugin settings:

```properties
nacos.plugin.visibility.enabled=true
nacos.plugin.visibility.type=nacos
```

When using the default `nacos` visibility implementation, enable Nacos auth as well. The default visibility service reuses user information from the auth context.

```properties
nacos.core.auth.system.type=nacos
nacos.core.auth.enabled=true
nacos.core.auth.admin.enabled=true
nacos.core.auth.console.enabled=true
```

Plugin-specific properties use this prefix:

```properties
nacos.plugin.visibility.{serviceName}.*
```

For example, a custom plugin named `example` can read:

```properties
nacos.plugin.visibility.example.timeout=3000
```

## Visibility SPI

Custom visibility plugins implement `com.alibaba.nacos.plugin.visibility.spi.VisibilityService`.

| Method | Description |
| --- | --- |
| `getVisibilityServiceName()` | Return the plugin name selected by `nacos.plugin.visibility.type`. |
| `init(properties)` | Initialize plugin-specific properties. |
| `resolveDefaultScopeForCreate(identity, apiType, resourceType)` | Return the default `scope` when a create request does not specify one. Default is `PRIVATE`. |
| `validateVisibility(identity, action, apiType, resource)` | Decide whether one resource is visible or writable for the current identity. |
| `adviseQuery(identity, action, apiType, queryContext)` | Return visibility advice for list and search queries. |

## QueryAdvisor

List and search APIs use `QueryAdvisor` to convert visibility into query conditions.

| Advice | Meaning |
| --- | --- |
| `ALL` | Add no visibility filter. Usually used for administrators. |
| `PUBLIC` | Return only public resources. Anonymous callers usually use this advice. |
| `OWNER` | Return only resources owned by the current identity. |
| `PUBLIC_AND_OWNER` | Return public resources and private resources owned by the current identity. |
| `AuthorizedResources` | Include additional explicitly authorized resources. |

When the storage layer supports conditional queries, merge these conditions into the storage query instead of loading all resources and filtering in memory.

## Impact On AI Registry

AI Registry resources are affected by lifecycle state, visibility, and auth at the same time:

- `scope=PUBLIC` means non-owners can read the resource.
- `scope=PRIVATE` means the resource is visible only to the owner and administrators by default.
- Online means the resource can be returned to runtime queries. It does not mean every caller can see it.
- Write operations still require ownership, administrator permission, or an explicit write grant.

For AI resource states, see [AI Resource Lifecycle](../manual/user/ai/ai-resource-lifecycle.md).
