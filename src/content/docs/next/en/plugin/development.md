---
title: Plugin Development Guide
keywords: [Plugin Development, Java SPI, PluginConfigSpec, applyConfig, PluginStartupLifecycle]
description: Learn Nacos server plugin SPI registration, unified configuration, binary compatibility, lifecycle, and development checks.
sidebar:
    order: 3
---

# Plugin Development Guide

When developing a Nacos server plugin, first implement the matching domain SPI, and then integrate unified configuration and state. Unified management does not replace domain behavior contracts or allow a plugin to bypass Nacos resources, authorization, responses, or errors.

## Select the domain SPI

| pluginType | Stable implementation name | Main domain SPI |
| --- | --- | --- |
| `auth` | `getAuthServiceName()` | `AuthPluginService` |
| `datasource-dialect` | `getType()` | `DatabaseDialect` with matching `Mapper` implementations |
| `config-change` | `getServiceType()` | `ConfigChangePluginService` |
| `encryption` | `algorithmName()` | `EncryptionPluginService` |
| `trace` | `getName()` | `NacosTraceSubscriber` |
| `environment` | `pluginName()` | `CustomEnvironmentPluginService` |
| `control` | `getName()` | `ControlManagerBuilder` |
| `visibility` | `getVisibilityServiceName()` | `VisibilityService` |
| `ai-pipeline` | `pipelineId()` | `PublishPipelineService` |
| `ai-storage` | `type()` | `AiResourceStorage` / `AiResourceStorageBuilder` |
| `ai-resource-import` | `pluginName()` | `AiResourceImportServiceBuilder` |

List the implementation class in `META-INF/services/{fully-qualified SPI name}`. Put the plugin JAR under `${nacos.home}/plugins` or on the Nacos Server startup classpath. Every node must also have its dependencies.

## Stable identity and conflicts

The plugin name must be non-blank, stable, and unique within its `pluginType`. Unified registration is first-wins: a later duplicate `pluginId` is ignored with a WARN that names both classes. A domain provider that builds a map from multiple SPI implementations must also detect duplicates and must not silently overwrite with `put`.

Never use SPI scan order as selection. Use the type's static `type` key or the documented domain route.

## Declare unified configuration

A configurable runtime implementation implements `com.alibaba.nacos.api.plugin.PluginConfigSpec`:

```java
public final class ExamplePlugin implements PluginConfigSpec {
    private volatile Map<String, String> currentConfig = Map.of();

    @Override
    public List<ConfigItemDefinition> getConfigDefinitions() {
        return List.of(
                new ConfigItemDefinition.Builder(
                        "timeout", "Timeout", ConfigItemType.NUMBER)
                        .defaultValue("3000")
                        .required(true)
                        .aliases(List.of("legacy.example.timeout"))
                        .effectMode(ConfigItemEffectMode.RUNTIME)
                        .build());
    }

    @Override
    public void applyConfig(Map<String, String> config) {
        currentConfig = Map.copyOf(config);
    }

    @Override
    public Map<String, String> getCurrentConfig() {
        return currentConfig;
    }
}
```

Requirements:

- A definition `key` is only the item key. Core builds `nacos.plugin.{pluginType}.{pluginName}.{itemKey}`.
- Declare `type`, `defaultValue`, `required`, `sensitive`, `effectMode`, and every compatible `alias`.
- Never declare `enabled`; it belongs to unified plugin state.
- `applyConfig` receives a complete effective canonical item-key snapshot. Validate and build immutable state before atomically publishing it.
- `getCurrentConfig` returns the last accepted snapshot instead of re-reading Spring environment.
- Definition key and alias registration is first-wins. Do not publish internally conflicting definitions.

The default `isConfigurable()` returns true only when definitions are non-empty. Such an implementation must provide reliable apply and snapshot callbacks.

## Effect mode

Use `RUNTIME` only when the field can be changed without rebuilding an irreplaceable resource. Common `RESTART` cases include:

- implementation or provider selection;
- key parsers, LDAP/OIDC clients, datasources, thread pools, or subprocess options built at startup;
- resources without a defined atomic replace, close, and failure-recovery lifecycle.

`environment` is `PRE_CONTEXT`. Core exposes any definition it declares as `RUNTIME` as `RESTART` with a WARN.

## Startup lifecycle

A regular implementation follows:

```text
discover -> restore state -> resolve effective config -> applyConfig
         -> optional PluginStartupLifecycle.initialize -> expose to domain
```

Implement `PluginStartupLifecycle` only when runtime resources must be created after config acceptance. `initialize()` must be idempotent and is also used for deferred type loading. It does not automatically enable runtime rebuilding.

A type-level module gate may defer discovery of a non-critical type. Do not independently reload the domain SPI from another singleton or manager, because that bypasses unified state and configuration.

## Legacy binary compatibility

Unified domain SPIs inherit `PluginConfigSpec` through compatibility defaults. An old binary implementation with no definitions still loads and appears as `configurable=false`; current config is empty and apply is a no-op. Do not guess private properties to make it configurable.

A new implementation should declare definitions, implement atomic `applyConfig`, and return its accepted snapshot. Compatibility adapters still exist in a few domains:

- Config Change can still pass old `nacos.core.config.plugin.{name}.*` properties to legacy implementations, but `ConfigChangeConfigs` is deprecated.
- Visibility uses old `init(Properties)` only for implementations without unified definitions.

These adapters do not make a legacy implementation configurable.

## Security and stability

- Values marked `sensitive=true` must never appear in logs, exceptions, trace, or APIs.
- Set connection, read, and total timeouts for external IO. Non-decision plugins such as Trace and after-hooks should use dedicated executors and documented degradation.
- Do not change shared Nacos resource identity, v3 `Result<T>`, error codes, or authorization boundaries.
- Keep plugin packages, dependencies, static configuration, and alias migration consistent across the cluster.
- Test state/config updates, duplicate IDs, duplicate definitions, apply failures, and rolling upgrades.

## Pre-release checklist

1. `pluginType:pluginName` is unique in the target cluster.
2. The SPI filename and implementation class are correct and constructible.
3. Definitions do not contain `enabled` and have no key/alias conflicts.
4. `applyConfig` is atomic and safe to retry with the same map.
5. Fields genuinely support online replacement before being marked `RUNTIME`.
6. Domain execution checks unified state.
7. Missing or disabled active critical providers fail explicitly.
8. Documentation lists canonical keys, aliases, defaults, sensitivity, and effect modes.
