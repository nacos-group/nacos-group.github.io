---
title: Addressing Plugin
keywords: [Nacos, Addressing Plugin, SPI, Server-side, Client-side, Custom Plugin]
description: This article elaborates on the support for cluster addressing plugins in Nacos starting from version 2.3.0, including steps to develop server and client-side addressing plugins, implementation details of interfaces, and how to configure and enable these plugins. It also alerts developers that the addressing plugin is currently in Beta, with potential API changes in future updates.
---
# Addressing Plugin

Starting with version 2.3.0, Nacos supports injecting cluster addressing-related plugins through the [SPI](https://docs.oracle.com/javase/tutorial/sound/SPI-intro.html) mechanism and selecting one of the plugin implementations in the `application.properties` configuration file for actual addressing services. This document will provide a comprehensive guide on implementing an addressing plugin and making it effective.

> Note:
> The addressing plugin is currently in Beta testing, and its APIs and interface definitions may change with subsequent version upgrades. Please ensure your plugin compatibility accordingly.

## Overview of Addressing Plugins

Currently, Nacos offers three addressing methods: single-machine addressing, configuration file addressing, and address server addressing. With addressing plugins, users can write their own addressing logic.

## Developing Nacos Server-Side Addressing Plugin

To develop a Nacos server-side addressing plugin, first, depend on the relevant API for addressing plugins:

```xml
        <dependency>
            <groupId>com.alibaba.nacos</groupId>
            <artifactId>nacos-address-plugin</artifactId>
            <version>${project.version}</version>
        </dependency>
```

Where `${project.version}` corresponds to the Nacos version you are developing the plugin against.

Then, implement the `com.alibaba.nacos.plugin.address.spi.AddressPlugin` interface and add your implementation to the SPI's services.

Methods to implement within the interface include:

|Method Name|Input|Return|Description|
|-----|-----|-----|---|
|start|void|void|Initiates the addressing function of the plugin.|
|getServerList|void|List<String>|Returns all Nacos cluster node addresses in the format `IP:Port`.|
|getPluginName|void|String|The name of the plugin; when names clash, the later-loaded plugin overrides the earlier one.|
|registerListener|Consumer<List<String>>|AddressPlugin|Registers a listener called when cluster addresses change.|
|shutdown|void|void|Disables the plugin.|

The `com.alibaba.nacos.plugin.address.spi.AbstractAddressPlugin` abstract class provides default implementations for `getServerList`, `registerListener`, and `shutdown`. Users extending `AbstractAddressPlugin` only need to implement the remaining methods. The `AbstractAddressPlugin` has a `serverList` member variable (List<String>) representing the cluster address collection, which users must maintain after calling the start method.

For configuring plugin-related parameters in the property file, use keys prefixed with `address.plugin`, accessible via the `com.alibaba.nacos.plugin.address.common.AddressProperties` singleton:

```properties
address.plugin.${key} = ${val}
```

Post-configuration, developers can retrieve parameters through:

```java
AddressProperties.getProperty(${key})
```

### Using Server-Side Plugins

After development, package the plugin as a jar/zip and place it in the Nacos server's classpath or directly into `${nacos-server.path}/plugins`.

Modify `${nacos-server.path}/conf/application.properties`:

```properties
### Enabled Nacos addressing plugin name, corresponding to `com.alibaba.nacos.plugin.address.spi.AddressService#getPlugin` return value
nacos.core.member.lookup.type=${addressPluginName}
```

Restart Nacos cluster, and upon receiving requests, observe logs in `${nacos-server.path}/logs/nacos-cluster.log`:

```text
[AddressPluginManager] Load AddressPlugin(xxxx) PluginName(xxx) successfully.
```

### Leveraging Built-in Nacos Addressing Plugins

For backward compatibility, without custom plugins, configurations remain unchanged with `nacos.core.member.lookup.type=[file,address-server]`.

## Client-Side Plugins

### Implementing Custom Plugins

Nacos client-side users follow similar steps as the server-side for custom addressing plugin implementation. After packaging the developed client plugin into a jar/zip and placing it in the application's classpath, it automatically takes effect. When initializing `NacosConfigService` or `NacosNamingService`, include a property in the passed `Properties` object with key `addressPluginName` and value from `getPluginName` method of the plugin.

```java
 Properties properties = new Properties();
 properties.put("addressPluginName", ${addressPluginName});
 ConfigService configService = NacosFactory.createConfigService(properties);
 String content = configService.getConfig(dataId, group, 5000);
```

### Using Built-in Nacos Client-Side Plugins

For Nacos Java client, built-in addressing plugin adaptations ensure compatibility with previous versions. Without custom plugins, client usage remains unchanged.

### Addressing Plugins for Other Language Clients

Awaiting community contributions.