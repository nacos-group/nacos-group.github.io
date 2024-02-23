---
title: CustomEnvironment
keywords: [CustomEnvironment,CustomConfiguration,DatabasePasswordencryption]
description: Nacos Custom environment variable plugin, can customize the extension server configuration and other functions, such as database password encryption.
sidebar:
    order: 6
---

# CustomEnvironmentPlugins

Since version 2.2.0, Nacos support to inject custom environment plugins through [SPI](https://docs.oracle.com/javase/tutorial/sound/SPI-intro.html),to customize the configuration of nacos in the plugin and do it the way you expect (such as database password encryption).
This document will describe how to implement a custom environment plugin and how to make it work.
> Attention:
> At present, the track tracing plugin is still in the beta stage, and its API and interface definitions maybe modified with version upgrades. Please pay attention to the applicable version of your plugin.

## Plugin Development

To develop a Nacos custom environment plugin, developer first need to depend on the relevant API of the custom environment plugin.

```xml
        <dependency>
            <groupId>com.alibaba.nacos</groupId>
            <artifactId>nacos-custom-environment-plugin</artifactId>
            <version>${project.version}</version>
        </dependency>
```

`${project.version}` is the version of Nacos for your development plugin.

Then implement interface `com.alibaba.nacos.plugin.environment.spi.CustomEnvironmentPluginService`, and put your implementation into services of SPI.

The methods of interface in following:

| method name         | parameters                  | returns                  | description                                                                                                                                                                                                                    |
|-------------|-----------------------|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pluginName  | `void`                | `String`              | The name of the plugin.                                                                                                                                                                                               |
| propertyKey | `void`                | `Set<String>`         | Specifies the name of the configuration item that you want to customize for the server.                                                                                                                               |
| order       | `void`                | `Integer`             | The higher the number, the higher the priority of the plugin. Multiple plugins customize the same configuration item at the same time. The plugin with a higher priority overwrites the plugin with a lower priority. |
| customValue | `Map<String, Object>` | `Map<String, Object>` | The entry parameter is the value of the configuration item corresponding to propertyKey, and the exit parameter is the value of the self-defined configuration item.                                                  |

In [nacos-group/nacos-plugin](https://github.com/nacos-group/nacos-plugin)，providing a demo implementation for custom environment plugin. This demo implements the database password Base64 decryption,
So,you can set the ciphertext database password instead of the plaintext password in the `application.properties` configuration file.

# How to use
After the plugin finished, it needs to be packaged into jar/zip and places in the classpath of the nacos server. If you don't know how to add plugins into the classpath, please place plugins under `${nacos-server.path}/plugins` directly.

After Adding plugins into classpath, also need to modify some configuration in `${nacos-server.path}/conf/application.properties`.

```properties
### open custom environment
nacos.custom.environment.enabled=true
```

Restart nacos cluster, some logs can be saw in `${nacos-server.path}/logs/core-auth.log`:

```text
[CustomEnvironmentPluginManager] Load customEnvironmentPluginService(xxx) customEnvironmentPluginName(xxx) successfully..
```
