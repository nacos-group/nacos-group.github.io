---
title: Plugin Overview
keywords: [Plugin, SPI, extension]
description: Learn the common Nacos plugin model, loading rules, design principles, and plugin documentation entry points.
sidebar:
    order: 1
---

# Plugin Overview

Nacos uses plugins to keep replaceable and extensible capabilities outside the core logic. You can use the built-in implementations, optional official plugins, community plugins, or custom plugins for security, databases, audit, observability, and traffic governance.

The plugin system serves two groups of readers:

- Users and operators need to know which capability is pluggable, where to place plugin JARs, and which configurations must stay consistent across the cluster.
- Developers and integrators need to understand the SPI boundary, how to declare implementations, and how to keep plugins from affecting the main Nacos request path.

## How Plugins Are Loaded

Most Nacos plugins are loaded through Java SPI. A plugin JAR declares implementation classes under `META-INF/services`. During startup, Nacos discovers these implementations through `NacosServiceLoader`, then plugin-specific `PluginProvider` implementations collect them into unified plugin information.

There are usually two ways to load a plugin:

1. Put the plugin JAR under `${nacos.home}/plugins`.
2. Add the plugin JAR and required dependencies to the Nacos Server startup classpath.

In production clusters, all Nacos Server nodes should use the same plugin JAR versions, dependency versions, and plugin configuration. This is especially important for auth, datasource, visibility, config change, and environment plugins because they can affect request results or data read/write behavior.

## Selection Rules

Different plugin types are enabled in different ways:

- **Exclusive plugins**: only one implementation is selected at a time. Auth plugins are selected by `nacos.core.auth.system.type`; datasource dialect plugins are selected by `spring.sql.init.platform`.
- **Multiple-instance plugins**: multiple implementations may be loaded at the same time. Config change plugins and trace plugins are typical examples.
- **Built-in and optional implementations**: some implementations are shipped with the Nacos distribution. LDAP, OIDC/OAuth, community datasource plugins, and encryption plugins may require separate plugin packages.
- **Unified plugin state is not the same as feature configuration**: Nacos 3.2 includes unified plugin management, but each plugin may still require its own feature configuration. Follow the corresponding plugin document for the actual enabling steps.

## Development Principles

When developing a plugin, follow these principles:

- **Stay within the documented SPI boundary**. Do not treat internal Nacos classes as stable contracts. When a reference implementation is needed, use the source code of your target Nacos version.
- **Keep plugin names stable and unique**. Plugin names are used in configuration, logs, and plugin state management. Renaming a plugin affects upgrades and operations.
- **Avoid blocking the main request path**. Plugins that call networks, disks, audit systems, KMS, or webhooks should use timeouts, fallback behavior, and dedicated executors when needed.
- **Do not hard-code secrets**. Keys, tokens, and database passwords should come from secure configuration, environment variables, or your enterprise key management system.
- **Match versions carefully**. Plugin APIs may evolve with Nacos versions. Before upgrading Nacos, validate the plugin version, dependency version, and configuration compatibility together.
- **Validate before production**. At minimum, verify plugin loading logs, core read/write paths, failure fallback, node restart, rolling upgrade, and rollback.

## Plugin Documents

| Plugin | When to read it |
|--------|-----------------|
| [Auth Plugin](./auth-plugin.md) | Use default RBAC, LDAP, OIDC/OAuth2, or custom authentication and authorization. |
| [Visibility Plugin](./visibility-plugin.md) | Control whether AI resources and similar objects are visible to the current caller. |
| [Multiple Data Sources](./datasource-plugin.md) | Use MySQL, PostgreSQL, Oracle, Derby, or community datasource dialect plugins. |
| [Configuration Encryption](./config-encryption-plugin.md) | Encrypt sensitive configuration content at storage and decrypt it when reading. |
| [Config Change Plugin](./config-change-plugin.md) | Validate, audit, or send webhook notifications before or after config changes. |
| [Tracing](./trace-plugin.md) | Subscribe to internal Nacos operation events for audit, troubleshooting, and operations. |
| [Custom Environment Plugin](./custom-environment-plugin.md) | Transform server configuration values when Nacos reads them, such as decrypting database passwords. |
| [Traffic Control](./control-plugin.md) | Limit connection count and TPS to protect Nacos Server stability. |
| [Cluster Addressing](./address-plugin.md) | Configure how Nacos Server discovers cluster members, such as `file` and `address-server`. |

## Reading Guidance

For deployment and operations, start with auth, visibility, datasource, configuration encryption, traffic control, and cluster addressing. These topics directly affect production security boundaries, storage, and stability.

For plugin development, start with this page, then read the SPI, loading, and failure fallback sections in the target plugin document. Each plugin has a different integration point, so do not copy configuration or lifecycle assumptions from another plugin type.
