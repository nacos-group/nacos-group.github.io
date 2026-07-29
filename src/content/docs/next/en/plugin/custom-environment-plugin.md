---
title: Custom Environment Plugin
keywords: [Custom Environment, custom configuration, database password encryption, Environment Plugin]
description: Learn how the Nacos custom environment plugin transforms server configuration values during startup.
sidebar:
    order: 11
---

# Custom Environment Plugin

The custom environment plugin transforms selected Nacos Server configuration values before Nacos consumes them. Typical use cases include decrypting database passwords, adapting deployment-specific variables, and converting secrets from an enterprise key system into startup configuration values that Nacos can read.

It works on **Nacos Server startup configuration**. It does not encrypt or transform business configurations stored in the Nacos configuration center. For business config encryption, see [Configuration Encryption](./config-encryption-plugin.md).

In unified plugin management, the type is `environment`, its execution mode is `CHAIN`, its load phase is `PRE_CONTEXT`, and the type is non-critical. A plugin identity is `environment:{pluginName()}`. Because PRE_CONTEXT must transform the Environment before the Spring context exists, it resolves only `STATIC > DEFAULT` and exposes every configuration item as `RESTART`. Runtime state or configuration updates and later STATIC refreshes do not rerun the plugin; restart is required.

:::note
The custom environment plugin is mainly for deployment-time adaptation. Plugin APIs may evolve with Nacos versions, so use a plugin version that matches your target Nacos version.
:::

## How It Works

A plugin declares the configuration keys it wants to process. During startup, if `nacos.custom.environment.enabled=true`, Nacos collects the original values of these keys, passes them to the plugin, and adds the converted values back as a higher-priority configuration source.

Rules:

- A plugin can read and return only the keys declared by `propertyKey()`.
- Returned keys that are not declared by the plugin are removed.
- Returned entries with `null` values are removed and do not override original configuration.
- When multiple plugins process the same key, they run by `order()` in ascending order. Later values override earlier values, so a larger `order()` has higher final priority.

For example, a plugin can declare the canonical datasource password key and convert an encrypted value in `application.properties` into the plain database password required by datasource initialization:

```properties
nacos.custom.environment.enabled=true
nacos.plugin.environment.demo-environment.enabled=true
nacos.plugin.datasource.db.password.0=ENC(base64-or-kms-value)
```

## Enable the Plugin

Put the plugin JAR under `${nacos.home}/plugins`, or add it to the Nacos Server startup classpath. The plugin implementation must be declared in `META-INF/services/com.alibaba.nacos.plugin.environment.spi.CustomEnvironmentPluginService`.

Then enable the feature in `${nacos.home}/conf/application.properties`:

```properties
nacos.custom.environment.enabled=true
```

This is the static family gate; when false, implementations are not loaded. Each implementation can also set startup state with `nacos.plugin.environment.{pluginName}.enabled`. Runtime status API changes for this type are rejected.

After startup, check `${nacos.home}/logs/nacos.log` for the loading log:

```text
[CustomEnvironmentPluginManager] Load customEnvironmentPluginService(...) customEnvironmentPluginName(...) successfully.
```

## Develop a Plugin

Add the dependency:

```xml
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-custom-environment-plugin</artifactId>
    <version>${project.version}</version>
</dependency>
```

Implement `com.alibaba.nacos.plugin.environment.spi.CustomEnvironmentPluginService`:

| Method | Description |
|--------|-------------|
| `pluginName()` | Stable plugin name used in `environment:{pluginName}`. |
| `propertyKey()` | Configuration keys transformed by this plugin. |
| `order()` | Override order. Larger values have higher final priority. |
| `customValue(property)` | Input contains original values for declared keys. Return converted key-value pairs. |

Minimal example:

```java
public class DemoEnvironmentPlugin implements CustomEnvironmentPluginService {

    @Override
    public Set<String> propertyKey() {
        return Collections.singleton("nacos.plugin.datasource.db.password.0");
    }

    @Override
    public Map<String, Object> customValue(Map<String, Object> property) {
        String key = "nacos.plugin.datasource.db.password.0";
        String encrypted = (String) property.get(key);
        return Collections.singletonMap(key, decrypt(encrypted));
    }

    @Override
    public Integer order() {
        return 0;
    }

    @Override
    public String pluginName() {
        return "demo-environment";
    }
}
```

`CustomEnvironmentPluginService` inherits `PluginConfigSpec`. Private settings use `nacos.plugin.environment.{pluginName}.{itemKey}` and declare metadata through definitions. Even if an implementation declares an item as `RUNTIME`, management normalizes it to `RESTART` and logs a WARN. After the startup snapshot is accepted, later changes require restart. An older binary without definitions still loads but is reported as `configurable=false`.

## Production Advice

- List the exact configuration keys handled by the plugin. Avoid modifying unrelated startup parameters.
- If decryption fails, fail fast with clear logs instead of letting Nacos start with an invalid password.
- Do not hard-code secrets in plugin code. Use environment variables, KMS, HSM, or your enterprise key service.
- If the plugin calls an external key service, configure timeouts and failure behavior so startup does not wait forever.
- All nodes should use the same plugin JAR and dependency versions.
- `propertyKey()` should declare the canonical keys consumed by current modules. An older implementation that declares only `db.password.*` can process only the legacy alias.

## Troubleshooting

| Symptom | What to check |
|---------|---------------|
| Plugin does not take effect | Check whether `nacos.custom.environment.enabled` is `true` and whether the JAR is on the classpath. |
| No loading log appears | Check the `META-INF/services` file and whether `pluginName()` returns a non-empty value. |
| Converted value is not used | Check whether the key is declared by `propertyKey()` and returned with the same key. |
| Multiple plugins override the same key | Check `order()` values. The larger value wins in the final configuration. |
