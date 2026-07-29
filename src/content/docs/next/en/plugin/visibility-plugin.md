---
title: Visibility Plugin
keywords: [Visibility, Plugin, Auth, AI Registry]
description: Learn what the Nacos visibility plugin does, how the default implementation works, how to configure it, and how it relates to auth plugins.
sidebar:
    order: 6
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

Nacos provides `visibility:nacos`. `visibility` is a non-critical, `ROUTED`, `STANDARD` type. The built-in implementation declares no private definitions and appears as `configurable=false`.

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

Distinguish the capability gate, historical selection, and implementation state:

```properties
# Capability gate: disables execution and defers first loading
nacos.plugin.visibility.enabled=true

# Initial unified state of the built-in implementation
nacos.plugin.visibility.nacos.enabled=true

# Historical startup selection compatibility
nacos.plugin.visibility.type=nacos
```

The family gate defaults to enabled. When it is off, the implementation does not execute even if it remains loaded and enabled. Re-enabling triggers discovery, state restoration, and config apply if the type has not loaded yet. Persisted unified state takes precedence over `type` and static `{serviceName}.enabled`.

When using the default implementation, enable Nacos auth as well. It reuses user information from the auth context.

```properties
nacos.plugin.auth.type=nacos
nacos.core.auth.enabled=true
nacos.core.auth.admin.enabled=true
nacos.core.auth.console.enabled=true
```

Custom implementations are configurable only when they declare `PluginConfigSpec` definitions. Canonical full keys use:

```properties
nacos.plugin.visibility.{serviceName}.{itemKey}
```

Do not treat undeclared arbitrary properties as unified config. Old binary and zero-definition implementations still load but appear as `configurable=false`.

## Visibility SPI

Custom visibility plugins implement `com.alibaba.nacos.plugin.visibility.spi.VisibilityService`.

| Method | Description |
| --- | --- |
| `getVisibilityServiceName()` | Return the stable pluginName. |
| `init(properties)` | Deprecated legacy callback used only for implementations without definitions. |
| `resolveDefaultScopeForCreate(identity, apiType, resourceType)` | Return the default `scope` when a create request does not specify one. Default is `PRIVATE`. |
| `validateVisibility(identity, action, apiType, resource)` | Decide whether one resource is visible or writable for the current identity. |
| `adviseQuery(identity, action, apiType, queryContext)` | Return visibility advice for list and search queries. |

`VisibilityService` inherits `PluginConfigSpec`. A new implementation declares key/alias/type/default/required/sensitive/effectMode, applies one snapshot atomically, and returns its current config. Unified implementations do not receive legacy `init(Properties)`. Routing checks `visibility:{serviceName}` state before invocation.

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
