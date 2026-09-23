---
title: Console Manual
keywords: [Nacos, Console, Operations]
description: Learn how to access and use the Nacos 3.x new console, including navigation, permissions, and common issues.
sidebar:
    order: 12
---

# Console Manual

The Nacos console is the visual operations entry for users, operators, and platform administrators. It is suitable for daily viewing, publishing, rollback, troubleshooting, and permission management. It is not recommended as the integration interface for automation systems.

For automation, use [Admin API](./admin-api.md), [Maintainer SDK](./maintainer-sdk.md), or the corresponding business OpenAPI first. Console API mainly serves page interactions, so its interfaces and fields may change when the console is upgraded.

## Access the console

Nacos 3.x uses the new console by default. After startup, visit:

```text
http://{console-host}:8080/
```

By default, the root path redirects to `/next/`. If `nacos.console.contextPath` is configured, include that context path in the URL.

Common configuration:

| Configuration | Description |
| --- | --- |
| `nacos.console.port` | Console port. The default is `8080`. |
| `nacos.console.contextPath` | Console context path. The default is empty. |
| `nacos.console.ui.enabled` | Whether the default console is enabled. Enabled by default. |
| `nacos.console.ui.default` | Default console version. The default is `next`. |

If you deploy the console independently, it is enough to know here that the console and Nacos Server can run separately. For deployment steps, read [Independent Console](./deployment/deployment-independent.md).

## Login and permissions

Nacos 3.3 enables console authentication by default and prompts you to sign in. With the default authentication implementation, initialize the administrator password on first use. Signing in authenticates browser operations only; applications and API requests from a terminal still need their own credentials.

If authentication is not enabled, the console does not pretend that a login page is a security boundary. Always run Nacos in a trusted internal network, and do not expose it to the public Internet.

Related documents:

- [Authorization Manual](./auth.mdx)
- [Access Credentials](../user/auth.mdx)
- [OIDC/OAuth2 Authentication](./oidc-auth.md)

## Namespace selection

The namespace selected in the console affects resource lists. Configurations, services, AI resources, and other resources are shown by namespace.

When troubleshooting a missing resource, check the current namespace first. Then check permissions, visibility, and resource state.

## AI Registry

AI Registry manages resources used by AI applications. The new console shows this menu group when AI capability is enabled and the current startup mode allows it.

Common entries:

| Entry | Purpose |
| --- | --- |
| Skill Registry | Manage Skill metadata, versions, packages, and publish state. |
| Prompt Registry | Manage Prompt templates, versions, and variables. |
| Agent Registry | Manage the Agent catalog, versioned call definitions (including A2A AgentCards), and runtime endpoints. |
| AgentSpecs Registry | Manage AgentSpec resources and versions. |
| MCP Registry | Manage MCP Servers, tools, endpoints, and API conversion. |

For complete guidance, read [AI Registry Overview](../user/ai/ai-registry-overview.md).

### Create and publish Agents and MCP Servers

1. Select the target namespace and open Agent Registry or MCP Registry. Import an existing A2A AgentCard or create an Agent; for an MCP Server, enter its description, tools, and connection settings for the selected protocol. Saving creates the first draft version.
2. Open the resource details and check the version content and visibility scope. The built-in policy defaults new Agents and MCP Servers to public. For a private release, change the scope to private before submitting. See [Visibility Plugin](../../plugin/visibility-plugin.md) for permission rules.
3. Select the draft's submit-for-review action. Without applicable enabled review nodes, submission publishes the version immediately. Otherwise, check the version's review results and publish after approval. If review fails and changes are needed, return the version to draft, edit it, and submit again.
4. Confirm that the target version is `online` and the resource is enabled. Successful publication updates `latest` automatically. Verify discovery and actual calls using the application's identity.

Version content can only be edited in draft state. For later changes, select an existing version in version history and create a draft from it; for MCP Servers, use an online version. Resolve any existing version being edited or reviewed first. See [AI Resource Lifecycle](../user/ai/ai-resource-lifecycle.md) for state rules and administrator force-publish scenarios.

### Inspect versions and runtime endpoints

Select a version in the resource details to check its definition, state, and labels. Enabling or disabling a resource is separate from taking a version online or offline; taking a version online does not enable a disabled resource.

- **Agent**: Select the version and call protocol, then inspect declared endpoints and runtime endpoints separately. The runtime endpoint section is read-only and can be refreshed to show health and runtime version bindings. To enable or disable an instance, follow the service link to its Naming service details. See [RAD Integration Guide](../user/ai/rad-discovery.md) for application examples of endpoint registration, deregistration, and subscription.
- **MCP Server**: Check the selected version's tools and connection settings. Remote services with available addresses show frontend or backend endpoints; for `stdio` services, inspect the package and launch arguments. Publishing a definition does not start an MCP process. See [MCP Management](../user/ai/mcp-registry.md) for integration options.

If the MCP page reports lifecycle migration in progress or temporary service unavailability, keep operations read-only until migration completes or service recovers; see the [Upgrade Guide](./upgrading.mdx). Toolchains can search and download published resources through [ARD Resource Discovery](../user/ai/ard-discovery.md).

## Configuration Center

The Configuration Center menu manages config publishing, query, listening, and rollback.

Common operations:

- Query configurations by `Data ID`, `Group`, and namespace.
- Create, edit, and publish configurations.
- View history versions and roll back when needed.
- Query listeners to confirm whether clients have received config changes.
- When importing, exporting, or cloning configurations, pay attention to file size and target namespace.

To understand the configuration model, gray release, import and export, and troubleshooting, read [Configuration Overview](../user/config/overview.md).

## Service Registry

The Service Registry menu is used to view services, instances, and subscription relationships.

Common operations:

- Query services and healthy instance counts in the service list.
- Open service details to view clusters, instances, metadata, and weight.
- Adjust instance weight or online and offline state.
- Query subscribers to confirm whether consumers subscribe to the target service.

Console operations may affect service discovery results. Before changing weight, metadata, or online state for production services, confirm the change window and rollback plan.

For complete guidance, read [Service Discovery Overview](../user/naming/overview.md).

## Platform management

Platform management usually serves administrators. Menus may differ under different startup modes and permissions.

| Entry | Purpose |
| --- | --- |
| Namespace | Create, edit, and delete namespaces. |
| Cluster Management | View cluster nodes and basic status. |
| Plugin Management | View unified inventory, state, effective configuration and sources, and safely update runtime definitions. |
| User List | Manage console users. |
| Role Management | Manage roles and user relationships. |
| Privilege Management | Manage resource permissions. |

If a menu is missing, the common causes are that the current user is not an administrator, the function mode hides the module, or the related capability is not enabled.

### Next Console Plugin Management

The plugin list uses `pluginType:pluginName` identities and shows execution mode, critical, and configurable metadata. Detail shows:

- enabled state and whether it comes from persisted cluster state or a current-node `localOnly` override;
- definition type, default, aliases, required, sensitivity, and `effectMode`;
- each effective value's `source` and `overridden` flag, with `LOCAL_ONLY > RUNTIME_PERSISTED > STATIC > DEFAULT`;
- a masked marker instead of plaintext for sensitive values.

Only `RUNTIME` definitions are editable online. `RESTART` items are read-only and direct operators to change static configuration and restart. A configuration submission replaces the complete map for the selected source; an empty map clears it. Clear current-node `localOnly` overrides before a cluster operation, or they continue to win over persisted values. Illegal runtime state changes to active critical providers, exclusive selection, and PRE_CONTEXT plugins are rejected.

These capabilities apply only to Next Console. Legacy Console does not implement the unified plugin configuration workflow. See [Plugin Operations](../../plugin/operations.md) for the complete semantics.

## Legacy console

The legacy console can still be used as the default entry by setting `nacos.console.ui.default=legacy`. You can also visit `/legacy/` directly.

The legacy console uses older frontend styles and dependencies. It is recommended only for compatibility with existing habits. New deployments should use the new console. The legacy console may be removed in a later version.

When you prepare a new deployment, verify an upgrade, or take documentation screenshots, use the new console first.

## FAQ

**Why does the root path enter `/next/`?**

This is the default behavior of Nacos 3.x. The new console is the default console.

**Why is there no login page?**

Usually authentication is not enabled. In this case, the console has no login protection. Use it only in a trusted internal network.

**Why can I not see AI Registry, Configuration Center, or Service Registry?**

Check `nacos.functionMode`, `nacos.extension.ai.enabled`, and current user permissions first. Different startup modes hide unrelated menus.

**Why does independent console access fail?**

Check the address from console to Nacos Server, `nacos.console.remote.server.context-path`, the server context path, and server identity authentication. For detailed steps, read [Independent Console](./deployment/deployment-independent.md).

**What should I do if file upload fails?**

Check whether the file exceeds `spring.servlet.multipart.max-file-size` or `spring.servlet.multipart.max-request-size`. The default value is `10MB`.

## Continue reading

- [Deployment Overview](./deployment/deployment-overview.md)
- [Deployment Best Practices](./deployment/deployment-best-practices.md)
- [System Configurations](./system-configurations.md)
- [Console API](./console-api.md)
