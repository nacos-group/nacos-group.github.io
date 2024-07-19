---
title: Configuration Change Plugins
keywords: [Nacos, Configuration Change, Configuration Auditing, Configuration Format Validation, Webhook, SPI, AOP, Plugin Development]
description: Nacos introduces configuration change plugins in version 2.3.0, enabling configuration auditing, format validation, and webhook callbacks. Leveraging SPI injection, developers can customize pre- and post-change logic, enhancing configuration management flexibility. This article delves into plugin concepts, development流程, loading procedures, custom parameter passing, and provides a demo implementation.
---

# Configuration Change Plugins

The community has long desired for Nacos Configuration Center to notify specific systems upon configuration changes, facilitating logging, alerts, and other audit functions. Prior to version 2.3.0, the only approach was to mimic Nacos client subscription to configurations, allowing for subscription to core configuration change operations. Upon receiving change notifications, actions such as logging and alerts were executed.

This implementation had several major drawbacks: first, monitored configurations had to be added individually, making it difficult to capture all configuration changes; second, only post-change actions could be performed, lacking pre-change operations like format validation and whitelist checks.

Consequently, starting from version 2.3.0, Nacos supports injecting configuration change plugins via [SPI](https://docs.oracle.com/javase/tutorial/sound/SPI-intro.html), enabling users to implement custom logic before and after configuration changes through plugins, including format validation, whitelist checks, and webhooks.

## Concepts in Configuration Change Plugins

Adopting the design philosophy of Aspect-Oriented Programming (AOP), Nacos configures change operations (such as creation, update, deletion) as `join points (PointCut)` and weaves plugins `before` and `after` these join points.

### Configuration Change Join Points (ConfigChangePointCutTypes)

Based on the behavior and source of configuration changes, Nacos defines several `Configuration Change Join Points (ConfigChangePointCutTypes)` in `com.alibaba.nacos.plugin.config.constants.ConfigChangePointCutTypes`. Details include:

|Join Point Name| Description| Starting Version|
|-----|-----|-----|
|PUBLISH_BY_HTTP| Configurations published through HTTP interfaces, including creation and modification.| 2.3.0|
|PUBLISH_BY_RPC| Configurations published through GRPC interfaces, including creation and modification.| 2.3.0|
|REMOVE_BY_HTTP| Configurations deleted through HTTP interfaces.| 2.3.0|
|REMOVE_BY_RPC| Configurations deleted through GRPC interfaces.| 2.3.0|
|IMPORT_BY_HTTP| Configurations imported through HTTP interfaces.| 2.3.0|
|REMOVE_BATCH_HTTP| Batch deletion of configurations through HTTP interfaces.| 2.3.0|

### Configuration Change Weaving Types (ConfigChangeExecuteTypes)

Nacos configuration change plugins need to execute before or after `Configuration Change Join Points`, choosing `Configuration Change Weaving Types (ConfigChangeExecuteTypes)` defined in `com.alibaba.nacos.plugin.config.constants.ConfigChangeExecuteTypes`. Details are:

|Weaving Type| Description| Starting Version|
|-----|-----|-----|
|EXECUTE_BEFORE_TYPE| Plugin implementation executes **before** the Configuration Change Join Point.| 2.3.0|
|EXECUTE_AFTER_TYPE| Plugin implementation executes **after** the Configuration Change Join Point.| 2.3.0|

## Plugin Development

To develop Nacos server-side configuration change plugins, start by depending on the relevant API for configuration change plugins.

```xml
        <dependency>
            <groupId>com.alibaba.nacos</groupId>
            <artifactId>nacos-config-plugin</artifactId>
            <version>${project.version}</version>
        </dependency>
```

`${project.version}` should match the Nacos version you are developing the plugin for, starting from `2.3.0`.

Then, implement the `com.alibaba.nacos.plugin.config.spi.ConfigChangePluginService` interface, with methods to implement:

|Method Name| Input Content| Return Content| Description|
|-----|-----|-----|-----|
|getServiceType| void| String| The name of the plugin, distinguishing different types of plugin implementations.|
|getOrder| void| int| Execution order of the plugin; in a chain-like plugin design, multiple plugins execute in order, with smaller getOrder values preceding.|
|executeType| void| ConfigChangeExecuteTypes| The `Configuration Change Weaving Type` implemented by the plugin.|
|pointcutMethodNames| void| ConfigChangePointCutTypes[]| The `Configuration Change Join Points` woven by the plugin.|
|execute| ConfigChangeRequest, ConfigChangeResponse| void| The actual execution logic of the plugin.|

The `ConfigChangeRequest` and `ConfigChangeResponse` detail the logic execution contents and results.

### Loading Plugins

After plugin development, package into jar/zip and place in Nacos server's classpath, or directly under `${nacos-server.path}/plugins`. Modify `${nacos-server.path}/conf/application.properties`:

```properties
### Enabled Nacos configuration change plugin name, corresponding to the getServiceType return value of com.alibaba.nacos.plugin.config.spi.ConfigChangePluginService
nacos.core.config.plugin.${configChangePluginName}.enabled=true
```

Restart the Nacos cluster. Upon completion, logs will appear in `${nacos-server.path}/logs/nacos.log`:

```text
[ConfigChangePluginManager] Load ${className}(${classFullName}) ConfigChangeServiceName(${configChangePluginName}) successfully.
```

### Custom Parameter Passing for Plugins

Some plugins may require configuring parameters via a configuration file. This can be achieved by modifying `${nacos-server.path}/conf/application.properties`:

```properties
### Enabled Nacos configuration change plugin name, corresponding to the getServiceType return value of com.alibaba.nacos.plugin.config.spi.ConfigChangePluginService
nacos.core.config.plugin.${configChangePluginName}.${propertyKey}=${propertyValue}
```

Parameters can then be retrieved in `ConfigChangeRequest`:

```Java
final Properties properties = (Properties) configChangeRequest.getArg(ConfigChangeConstants.PLUGIN_PROPERTIES);
final String ${propertyKey} = properties.getProperty("${propertyKey}