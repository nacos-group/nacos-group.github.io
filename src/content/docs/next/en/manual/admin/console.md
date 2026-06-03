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

After authentication is enabled, the console enters the login flow. When the default authentication implementation is used, the administrator password must be initialized the first time authentication is enabled.

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
| Agent Registry | Manage A2A Agent registration and discovery information. |
| AgentSpecs Registry | Manage AgentSpec resources and versions. |
| MCP Registry | Manage MCP Servers, tools, endpoints, and API conversion. |

For complete guidance, read [AI Registry Overview](../user/ai/ai-registry-overview.md).

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
| Plugin Management | View loaded plugins and plugin state. |
| User List | Manage console users. |
| Role Management | Manage roles and user relationships. |
| Privilege Management | Manage resource permissions. |

If a menu is missing, the common causes are that the current user is not an administrator, the function mode hides the module, or the related capability is not enabled.

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
