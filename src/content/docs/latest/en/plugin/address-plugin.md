---
title: Addressing Plugin
keywords: [Addressing, Plugin]
description: This article describes how to develop and use Nacos' addressing plugin.
sidebar:
    order: 2
    hidden: true
---

# Addressing Plugin

Since version 2.3.0, Nacos support to inject addressing plugins through [SPI](https://docs.oracle.com/javase/tutorial/sound/SPI-intro.html), and select a plugin implementation in the configuration file `application.properties ` as the actual addressing service. This document will describe how to implement an addressing plugin and how to make it work.

> Attention: 
> At present, the addressing plugin is still in the beta stage, and its API and interface definitions maybe modified with version upgrades. Please pay attention to the applicable version of your plugin.

## Overview Of Addressing Plugin

At present, there are three addressing modes for Nacos cluster addressing: stand-alone addressing, profile addressing and address server addressing. Through the addressing plugin, users can write their own addressing logic.

## Develop Nacos Server Addressing Plugin

To develop a Nacos server-side addressing plugin, developer first need to depend on the relevant API of the address plugin.

```xml
        <dependency>
            <groupId>com.alibaba.nacos</groupId>
            <artifactId>nacos-address-plugin</artifactId>
            <version>${project.version}</version>
        </dependency>
```

`${project.version}` is the version of Nacos for your development plugin.

Then implement interface`com.alibaba.nacos.plugin.address.spi.AddressPlugin`, and put your implementation into services of SPI.

The methods of interface in following:

|method name|parameters|returns|description|
|-----|-----|-----|---|
|start|void|String|Start the addressing function of the plugin.|
|getServerList|void|List&lt;String>|Returns the addresses of all Nacos cluster nodes. The address format is`IP: Port`.|
|getPluginName|void|String|The name of the plugin. When the name is the same, the plugin loaded later will overwrite the plugin loaded first.|
|registerListener|Consumer&lt;List&lt;String>>|AddressPlugin|Register the listener and call the listener when the cluster address changes|
|shutdown|void|void|Shutdown plugin|

This interface is defined by `com.alibaba.nacos.plugin.address.spi.AbstractAddressPlugin`.The abstract class implements`getServerList`, `registerListener` and `shutdown` methods by default, Users can inherit AbstractAddressPlugin to implement other methods when actually writing plugins. AbstractAddressPlugin has a List&lt;String>member variable named serverList, that is, the cluster address collection. The user needs to maintain this variable.
When users need to configure plugin related parameters in the configuration file, they need to configure keys starting with `address.plugin` in the property configuration file. In this case, the corresponding parameters can be obtained through the `com.alibaba.nacos.plugin.address.common.AddressProperties` singleton class
```properties
address.plugin.$ {key} = ${val}
```
After configuration, users can write plugins through the
```java
AddressProperties.getProperty(${key})
```
To get the parameters.

### Use Server Plugin

After the plugin finished, it needs to be packaged into jar/zip and places in the classpath of the nacos server. If you don't know how to add plugins into the classpath, please place plugins under `${nacos-server.path}/plugins` directly.

After Adding plugins into classpath, also need to modify some configuration in `${nacos-server.path}/conf/application.properties`.

```properties
### The plugin name nacos using，should be same as the return value of `com.alibaba.nacos.plugin.address.spi.AddressPlugin#getPluginName`
nacos.core.member.lookup.type=${addressPluginName}
```

Restart nacos cluster, and after any request, some logs can be saw in `${nacos-server.path}/logs/nacos-cluster.log`:

```text
[AddressPluginManager] Load AddressPlugin(xxxx) PluginName(xxx) successfully.
```

### Use the default Nacos addressing plugin

In order to be compatible with the addressing of the old version, when the user does not use the custom plug-in, the configuration is the same as the original, or the configuration item `nacos.core.member.lookup.type=[file, address server]`.

## Client Plugin

### Use Custom Plugins
The implementation of custom plugins is the same as that of the server. When users need to use custom plugins, they inherit `com.alibaba.nacos.plugin.address.spi.AbstractAddressPlugin` or implement `com.alibaba.nacos.plugin.address.spi.AddressPlugin`, package the developed client plug-in into jar/zip, and put it into your application's classpath to automatically take effect. When initializing `NacosConfigService` or `NacosNamingService`, the key passed in the `Properties` object is `addressPluginName`, and val is the parameter returned by the plugin `getPluginName`.
for example:
```java
 Properties properties = new Properties();
 properties.put("addressPluginName", ${addressPluginName});
 ConfigService configService = NacosFactory.createConfigService(properties);
 String content = configService.getConfig(dataId, group, 5000);
```

### Use the default Nacos addressing plugin
The Java client plug-in of Nacos is adapted to the old version. If the customized plug-in is not applicable, the use of the client is the same as before.

### Plugin for other programming language

TODO
