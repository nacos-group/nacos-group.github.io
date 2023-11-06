---
title: control plugin
keywords: [anti-fragile,control limit,connection limit,TPS]
description: Nacos support control plugin.
---

> Translated by AI.
# Control Plugin

Starting from version 2.3.0, Nacos supports injecting control related plugins through [SPI](https://docs.oracle.com/javase/tutorial/sound/SPI-intro.html), and selecting a specific plugin implementation as the actual control capability in the `application.properties` configuration file. This document provides a detailed introduction on how to implement an control plugin and how to make it effective.

## Concepts in Control Plugin

Anti-fragility is a strategy that restricts access to a **certain resource** on the server when the **frequency and number** of accesses reach a certain level. It is used to protect the server from quickly rejecting requests under high pressure, preventing widespread unavailability caused by excessive resource access and exhaustion. The Nacos control plugin abstracts information primarily into `control point` and `control rules`.

### Control Point

The control point correspond to the mapping of resources occupied when making requests to the server. Currently, they mainly focus on `Connections` and `Transactions Per Second (TPS)`.

- The "Connections" control point primarily monitors the number of long connections used by Nacos 2.X clients and the number of long polling connections used by Nacos 1.X clients. These two types of connections are monitored independently.
- The "Transactions Per Second (TPS)" control point mainly monitors the frequency of access to core interfaces in the Nacos server. Similar operation interfaces are considered as the same monitor point. For example, the registration service v1 interface and v2 interface are treated as the same monitor point. Please refer to the document for specific TPS monitor [point names](#1.1).

### Control Rule

The control rules are different limitation rules that are executed for each control point. They are specifically categorized as "Connection Control Rules" `ConnectionControlRule` and "Transactions Per Second Control Rules" `TpsControlRule`.

`ConnectionControlRule` mainly include follow contents:

|Field name|Type|Description|
|-----|-----|-----|
| countLimit | int | Total count limit for connections. Default is -1, indicating no limitation. |
| monitorIpList | Set | List of IPs to be monitored by trace. It is used to observe the operations performed on the corresponding IP connections in detail. Once added, the connection requests from the corresponding IPs will be logged in detail in the `remote-digest.log` file. |

`TpsControlRule` mainly include follow contents:

|Field name|Type|Description|
|-----|-----|-----|
| pointName | String | Name of the control point corresponding to the rule. |
| pointRule | RuleDetail | Specific details of the rule content. |

And `RuleDetail` mainly include follow contents:

|Field name|Type|Description|
|-----|-----|-----|
| ruleName | String | Name of the rule. It is different from the control point name. A control point can have multiple rule names. |
| maxCount | int | Total count limit for TPS. Default is -1, indicating no limitation. |
| period | TimeUnit | The period in which the rule is effective, such as counting at the second level or minute level. Default is `TimeUnit.SECONDS` for second level. |
| monitorType | String | Monitoring type, can be either `monitor` or `intercept`. It corresponds to monitoring mode (only counting and printing TPS, even if the rule is triggered, no interception) and interception mode. |

## Plugin Development

To develop a control plugin for the Nacos server, you first need to depend on the relevant API of the control plugin.

```xml
        <dependency>
            <groupId>com.alibaba.nacos</groupId>
            <artifactId>nacos-control-plugin</artifactId>
            <version>${project.version}</version>
        </dependency>
```

`${project.version}` is the Nacos version, at least `2.3.0`.

Then to extend `com.alibaba.nacos.plugin.control.connection.ConnectionControlManager` abstract class and `com.alibaba.nacos.plugin.control.tps.TpsControlManager`abstract class，implement their methods; Then implement `com.alibaba.nacos.plugin.control.spi.ControlManagerBuilder` interface to build the two above classes; Finally add the SPI file to `META-INF/services`.

`com.alibaba.nacos.plugin.control.connection.ConnectionControlManager` need implement follow methods:

|Method name|Parameters|Return|Description|
|-----|-----|-----|-----|
|applyConnectionLimitRule|ConnectionControlRule|void|Apply new connection limit rule|
|check|ConnectionCheckRequest|ConnectionCheckResponse|To determine if the connection count rule is hit, if the success field in the ConnectionCheckResponse is `false`, new connections will be rejected.|

`com.alibaba.nacos.plugin.control.tps.TpsControlManager` need implement follow methods:

|Method name|Parameters|Return|Description|
|-----|-----|-----|-----|
| registerTpsPoint | String | void | Registers a TPS control point. The Nacos server will register the current TPS control point to the plugin during startup. The input parameter is the name of the TPS control point. Please refer to the document for [point names](#1.1). The plugin needs to maintain a TpsBarrier within this method to record TPS and rule content. For more details, refer to [Custom Time Windows for TPS](#1.2). |
| applyTpsRule | String, TpsControlRule | void | Applies a new TPS rule and associates it with the TPS control point name for update. |
| check | TpsCheckRequest | TpsCheckResponse | Checks if the TPS rule is hit. If the success field in the TpsCheckResponse is false, new requests will be rejected. |

`com.alibaba.nacos.plugin.control.spi.ControlManagerBuilder` need implement follow methods:

|Method name|Parameters|Return|Description|
|-----|-----|-----|-----|
| getName | void | String | Returns the name of the plugin. It is used to match the specified type in the configuration file and use the matched plugin. |
| buildConnectionControlManager | void | ConnectionControlManager | Creates an implementation of `ConnectionControlManager` for the plugin. When it is null, the `no limit` implementation will be used. |
| buildTpsControlManager | void | TpsControlManager | Creates an implementation of `TpsControlManager` for the plugin. When it is null, the `no limit` implementation will be used. |

### Load Plugin

After the plugin finished, it needs to be packaged into jar/zip and places in the classpath of the nacos server. If you don't know how to add plugins into the classpath, please place plugins under `${nacos-server.path}/plugins` directly.

After Adding plugins into classpath, also need to modify some configuration in `${nacos-server.path}/conf/application.properties`.

```properties
### The name of the control plugin enabled in Nacos, corresponding to the return value of com.alibaba.nacos.plugin.control.spi.ControlManagerBuilder's getName method.
nacos.plugin.control.manager.type=${controlPluginName}
```

After restarting the Nacos cluster and completing the startup, you can see the following logs in `${nacos-server.path}/logs/plugin-control.log`:

```text
Found control manager plugin of name=${controlPluginName}
Build connection control manager, class=${your plugin ConnectionControlManager class}
Build tps control manager, class=${your plugin TpsControlManager class}
```

## Use the default Nacos Control Plugin

Starting from version 2.3.0, Nacos comes with a built-in simple control plugin implementation, which can limit the connection count and specified interface TPS of the Nacos server.

### Enable the default Nacos Control Plugin

Modify the following configurations in `${nacos-server.path}/conf/application.properties`:

```properties
nacos.plugin.control.manager.type=nacos
```

### Setting control plugin for default Nacos control plugin

You can modify and set control rules by creating and modifying the control rule file. By default, the rules for the control plugin are defined in JSON format.

For example, if you want to set the connection limit to 100, you can perform the following steps:

```shell
mkdir -p ${nacos.home}/data/connection/
echo '{"countLimit": 100}' > ${nacos.home}/data/connection/limitRule
```

Then restart Nacos server node.

What's more, if you want set the TPS of query config as 100, you can perform the following steps:

 ```shell
 mkdir -p ${nacos.home}/data/tps/
 # ConfigQuery is the PointName of the query config API.
 echo '{"pointName":"ConfigQuery","pointRule":{"maxCount":100,"monitorType":"intercept"}}' > ${nacos.home}/data/tps/ConfigQuery 
 ```

Then restart Nacos server node.

More control rules and control point names please move to [point names](#1.1).

### The Storage Dir of Control Rules

The built-in simple control plugin implementation in Nacos stores and reads control rules through the local file system. By default, the rules are stored in `${nacos.home}/data/connection` and `${nacos.home}/data/tps` directories.

If you want to change the directory for storing the rule files, you can modify the following configuration in `${nacos-server.path}/conf/application.properties`:

```properties
nacos.plugin.control.rule.local.basedir=${expectedDir}
```

In this way, the control rules will be stored in `${expectedDir}/data/connection` and `${expectedDir}/data/tps`.

<h4 id="1.1"></h4>

## Supported Control PointNames

|control pointNames|meaning|description|started version|
|-----|-----|-----|-----|
|connection|Total Connections|Maximum Supported Connection Limit for a Specific Node|2.3.0|
|ConfigPublish|Configuration Publish Interface TPS|Maximum Supported TPS Limit for Configuration Publishing on a Specific Node, including both HTTP and gRPC access sources|2.3.0|
|ConfigQuery|Configuration Query Interface TPS|Maximum Supported TPS Limit for Configuration Querying on a Specific Node, including both HTTP and gRPC access sources|2.3.0|
|ConfigRemove|Configuration Removal Interface TPS|Maximum Supported TPS Limit for Configuration Removal on a Specific Node, including both HTTP and gRPC access sources|2.3.0|
|ConfigListen|Configuration Listening Interface TPS|Maximum Supported TPS Limit for Configuration Listening on a Specific Node, only including gRPC access source|2.3.0|
|RemoteNamingInstanceRegisterDeregister|Remote Naming Instance Register and Deregister Interface TPS|TPS Limit for Registering or Deregistering Service Instances, only including gRPC access source|2.3.0|
|RemoteNamingInstanceBatchRegister|Remote Naming Instance Batch Register Interface TPS|TPS Limit for Batch Registering Service Instances, only including gRPC access source|2.3.0|
|RemoteNamingServiceListQuery|Remote Naming Service List Query Interface TPS|TPS Limit for Service List Query, only including gRPC access source|2.3.0|
|RemoteNamingServiceQuery|Remote Naming Service Query Interface TPS|TPS Limit for Service Query, only including gRPC access source|2.3.0|
|RemoteNamingServiceSubscribeUnSubscribe|Remote Naming Service Subscribe and Unsubscribe Interface TPS|TPS Limit for Service Subscribe and Unsubscribe, only including gRPC access source|2.3.0|
|NamingInstanceRegister|Naming Instance Register Interface TPS|TPS Limit for Registering Service Instances, only including HTTP access source|2.3.0|
|NamingInstanceDeregister|Naming Instance Deregister Interface TPS|TPS Limit for Deregistering Service Instances, only including HTTP access source|2.3.0|
|NamingInstanceUpdate|Naming Instance Metadata Update Interface TPS|TPS Limit for Updating Service Instance Metadata, only including HTTP access source|2.3.0|
|NamingInstanceMetadataUpdate|Naming Instance Batch Metadata Update Interface TPS|TPS Limit for Batch Updating Service Instance Metadata, only including HTTP access source|2.3.0|
|NamingServiceSubscribe|Naming Service Query and Subscribe Interface TPS|TPS Limit for Service Query and Subscribe, only including HTTP access source|2.3.0|
|NamingInstanceQuery|Single Service Instance Query Interface TPS|TPS Limit for Querying Single Service Instance, only including HTTP access source|2.3.0|
|HttpHealthCheck|Service Instance Heartbeat Renewal Interface TPS|TPS Limit for Service Instance Heartbeat Renewal, only including HTTP access source|2.3.0|
|NamingServiceRegister|Service Create Interface TPS|TPS Limit for Creating Services, different from `NamingInstanceRegister`, this monitoring point represents the TPS for the interface of creating an empty service, only including HTTP access source|2.3.0|
|NamingServiceDeregister|Service Delete Interface TPS|TPS Limit for Deleting Services, different from `NamingInstanceDeregister`, this monitoring point represents the TPS for the interface of deleting services, only including HTTP access source|2.3.0|
|NamingServiceQuery|Service Query Interface TPS|TPS Limit for Service Query, different from `NamingInstanceQuery`, this monitoring point represents the TPS for the interface of querying service information, only including HTTP access source|2.3.0|
|NamingServiceListQuery|Service List Query Interface TPS|TPS Limit for Service List Query, different from `NamingServiceSubscribe`, this monitoring point represents the TPS for the interface of service list query, only including HTTP access source|2.3.0|
|NamingServiceUpdate|Service Metadata Update Interface TPS|TPS Limit for Service Metadata Update, different from `NamingInstanceUpdate`, this monitoring point represents the TPS for the interface of updating service metadata, only including HTTP access source|2.3.0|

## Advanced Development

Nacos control plugin also supports advanced extensions to meet the higher requirements of developers and users in this aspect.

### External Storage for Control Rules

By default, the Nacos control plugin only supports storing and modifying control rules for individual nodes through the local file system. For users with large-scale or multiple clusters, adjusting each node individually can be time-consuming and cumbersome. Additionally, in many containerized environments, there may be issues with disk mounting and persistence for the local file system.

To address these concerns, the Nacos control plugin allows the option to add an external storage for unified storage and distribution of control rules. This external storage can be implemented by the plugin itself, such as using a `database` or a `configuration center`.

To enable external storage for control rules, you need to implement the `com.alibaba.nacos.plugin.control.spi.ExternalRuleStorageBuilder` interface in your plugin development, and place the plugin jar file along with the interface implementation in the `${nacos-server.path}/plugins` directory.

After placing the plugin files, you need to modify the following configuration in `${nacos-server.path}/conf/application.properties`:

```properties
nacos.plugin.control.rule.external.storage=${controlPluginName}
```

Afterwards, restart the Nacos node for the changes to take effect.

### Dynamic Loading of Control Rules

In custom plugin implementations, there are two ways to dynamically load contrl rules:

1. Call the `com.alibaba.nacos.plugin.control.ControlManagerCenter#reloadTpsControlRule` method or `com.alibaba.nacos.plugin.control.ControlManagerCenter#reloadConnectionControlRule` method.

2. Publish a `ConnectionLimitRuleChangeEvent` or `TpsControlRuleChangeEvent` event using `NotifyCenter.publishEvent()`.

These methods allow you to reload and update the control rules dynamically in your custom plugin implementation.

### Custom Format Parse for Control Rules

By default, Nacos uses the `Json` format as the text format for control rules. However, plugin developers can use other formats such as `Yaml` or other custom formats for parsing.

To use a custom format for rule parsing, you can override the `com.alibaba.nacos.plugin.control.connection.ConnectionControlManager#buildConnectionControlRuleParser` and `com.alibaba.nacos.plugin.control.tps.TpsControlManager#buildTpsControlRuleParser` methods. Implement a custom format rule parser by creating a `RuleParser` that can parse rules in your desired format. Nacos will then use this custom rule parser to parse the rule text.

Additionally, you can enhance the default custom rules by parsing them into more advanced rules. This can be done in combination with the custom logic of your plugin, allowing for more advanced control.

<h4 id="1.2"></h4>

### Custom Time Windows for TPS

It is well-known that different time window algorithms can lead to significant differences in TPS statistics. Nacos defaults to a simple per-second statistical method, where TPS is counted based on clock seconds. This is sufficient for most scenarios, but for users with higher accuracy requirements, more precise methods such as sliding windows may be needed for TPS statistics.

In such cases, plugin developers can customize the time window and statistical methods for TPS by inheriting from `com.alibaba.nacos.plugin.control.tps.barrier.TpsBarrier` and `com.alibaba.nacos.plugin.control.tps.barrier.RuleBarrier`. Additionally, the `com.alibaba.nacos.plugin.control.tps.TpsControlManager#buildTpsBarrierCreator` method needs to be overridden. This allows for the generation of the corresponding custom implementation during plugin initialization and dynamic loading of control rules.

By implementing these customizations, plugin developers can control the time window and statistical methods used for TPS in a way that meets the specific accuracy requirements of their users.