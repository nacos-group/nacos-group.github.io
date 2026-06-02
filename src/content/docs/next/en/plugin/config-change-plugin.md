---
title: Config Change Plugin
keywords: [Config Change, config audit, config format check, webhook]
description: Learn how the Nacos config change plugin works, how to enable it, and how to develop custom config governance logic.
sidebar:
    order: 6
---

# Config Change Plugin

The config change plugin inserts custom logic before or after configuration publish, update, delete, import, and related operations. It is designed for config governance. It does not redefine the Nacos config storage model.

Typical use cases:

- **Pre-change validation**: validate format, naming rules, content risk, size, or import file suffix.
- **Pre-change blocking**: reject a config change and return an error message when a rule fails.
- **Post-change audit**: write config change records to an audit system.
- **Post-change notification**: notify downstream systems through webhooks or messaging systems.

## Execution Model

The config change plugin follows an AOP-like model. Nacos represents config change operations as pointcuts, and plugins can run before or after those pointcuts.

| Concept | Description |
|---------|-------------|
| Pointcut | A config change point classified by operation and source. |
| Before plugin | Runs synchronously before the config change. It can validate, reject, or rewrite parameters. |
| After plugin | Runs asynchronously after the config change. It is suitable for audit and notification. |
| Order | Plugins for the same pointcut run by `getOrder()` in ascending order. Lower values run earlier. |

The current SPI defines these pointcuts:

| Pointcut | Meaning |
|----------|---------|
| `PUBLISH_BY_HTTP` | Create or update config through HTTP or the console. |
| `PUBLISH_BY_RPC` | Create or update config through gRPC. |
| `PUBLISH_BY_UNKNOWN` | Create or update config when the source cannot be identified. |
| `REMOVE_BY_HTTP` | Delete a single config through HTTP or the console. |
| `REMOVE_BY_RPC` | Delete a single config through gRPC. |
| `REMOVE_BY_UNKNOWN` | Delete a single config when the source cannot be identified. |
| `IMPORT_BY_HTTP` | Import config files through HTTP or the console. |
| `REMOVE_BATCH_HTTP` | Batch delete configs through HTTP or the console. |

:::note
Before plugins affect the main config change path. Avoid slow calls or uncontrolled external systems in Before plugins. After plugin failures do not roll back already committed config changes.
:::

## Enable a Plugin

Put the plugin JAR under `${nacos.home}/plugins`, or add it to the Nacos Server startup classpath. The plugin must declare its implementation in `META-INF/services/com.alibaba.nacos.plugin.config.spi.ConfigChangePluginService`.

Then enable the plugin in `${nacos.home}/conf/application.properties`:

```properties
nacos.core.config.plugin.${configChangePluginName}.enabled=true
```

`${configChangePluginName}` must match the value returned by `getServiceType()`. Nacos 3.2 also has unified plugin state management, but the config change execution path still reads the `enabled` property above. For production use, follow the plugin document and configure both loading and feature enabling correctly.

Plugin-specific configuration uses this prefix:

```properties
nacos.core.config.plugin.${configChangePluginName}.${propertyKey}=${propertyValue}
```

Example settings for webhook, whitelist, and file format check plugins:

```properties
# webhook
nacos.core.config.plugin.webhook.enabled=true
nacos.core.config.plugin.webhook.url=http://localhost:8080/webhook/send?token=***
nacos.core.config.plugin.webhook.contentMaxCapacity=102400

# whitelist
nacos.core.config.plugin.whitelist.enabled=true
nacos.core.config.plugin.whitelist.suffixs=xml,text,properties,yaml,html

# file format check
nacos.core.config.plugin.fileformatcheck.enabled=true
```

## Develop a Plugin

Add the dependency:

```xml
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-config-plugin</artifactId>
    <version>${project.version}</version>
</dependency>
```

Implement `com.alibaba.nacos.plugin.config.spi.ConfigChangePluginService`:

| Method | Description |
|--------|-------------|
| `getServiceType()` | Stable plugin name used by configuration, logs, and plugin state management. |
| `getOrder()` | Execution order. Lower values run earlier. |
| `executeType()` | Return `EXECUTE_BEFORE_TYPE` or `EXECUTE_AFTER_TYPE`. |
| `pointcutMethodNames()` | Return the pointcuts handled by this plugin. |
| `execute(request, response)` | Run plugin logic. |

`ConfigChangeRequest` contains the current pointcut and change parameters. Common parameters include `namespaceId`, `group`, `dataId`, `content`, `srcIp`, `srcUser`, and `grayName`. Nacos also passes:

| Argument | Description |
|----------|-------------|
| `ConfigChangeConstants.ORIGINAL_ARGS` | Original method arguments. |
| `ConfigChangeConstants.PLUGIN_PROPERTIES` | Plugin-specific configuration. |

`ConfigChangeResponse` carries plugin results:

| Field | Description |
|-------|-------------|
| `success` | If a Before plugin sets it to `false`, the config change is rejected. |
| `msg` | Error message returned to the caller when the change is rejected. |
| `args` | Replacement arguments provided by a Before plugin. The order and types must match the original arguments. |
| `retVal` | Reserved return value. |

## Production Advice

- Keep Before plugins lightweight and define a clear failure policy.
- Use After plugins for audit and notification, but do not assume their side effects can roll back a config change.
- When multiple plugins subscribe to the same pointcut, set `getOrder()` explicitly.
- After changing plugin configuration, verify that every node has loaded the same plugin and configuration.
- If a webhook URL contains a token, do not commit it to public repositories or write it to logs.

## Troubleshooting

| Symptom | What to check |
|---------|---------------|
| Plugin does not run | Check whether the JAR is on the classpath, `META-INF/services` is correct, and `enabled` is `true`. |
| Before plugin does not reject a change | Check `executeType()`, `pointcutMethodNames()`, and whether the plugin sets `response.setSuccess(false)`. |
| Plugin properties are empty | Check whether the prefix is `nacos.core.config.plugin.${serviceType}.`, and whether `serviceType` matches `getServiceType()`. |
| Post-change notification is unstable | Check timeout, retry, and exception handling for the external system used by the After plugin. |
