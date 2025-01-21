---
title: Config Change Plugin
keywords: [Config Change,Config audit,Config format check,webhook]
description: Nacos support Config Change Plugin.
sidebar:
    order: 8
---

> Translated by AI.
# Config Change Plugin

Community has long been hoping for Nacos Configuration Center to provide notifications to specific systems when configurations change. These notifications are used for recording, warning, and auditing purposes. Before version 2.3.0, the only way to achieve this was by simulating Nacos client subscription to the configurations. This approach involved subscribing to changes in core configurations and executing functionalities such as sending records and warnings upon receiving change notifications.

However, this implementation had a few significant issues. Firstly, individual configurations needed to be added one by one, making it difficult to capture all configuration changes. Secondly, functionalities could only be executed after configuration changes, and there was no capability for performing pre-change operations such as format validation or whitelist validation.

To address these limitations, starting from Nacos version 2.3.0, Nacos introduced support for injecting configuration change plugins through the [SPI](https://docs.oracle.com/javase/tutorial/sound/SPI-intro.html). This allows users to define custom plugins to execute specific logic before and after configuration changes. Examples of such logic include format validation, whitelist validation, and webhook integrations.

These enhancements provide more flexibility and control for users to implement their own custom logic before and after configuration changes in Nacos Configuration Center.

## Concepts in Config Change Plugin

Nacos's configuration change plugin design takes inspiration from the aspect-oriented programming (AOP) paradigm. It treats configuration change operations, such as adding, updating, and deleting, as the `pointcuts` and weaves the plugins `before` and `after` these pointcuts.

### ConfigChangePointCutTypes

Nacos has categorized the configuration change operations based on their behaviors and sources. These configuration change operations are defined as several `ConfigChangePointCutTypes` in `com.alibaba.nacos.plugin.config.constants.ConfigChangePointCutTypes`. The specific details are as follows:

|PointCut Name|Description|Start version|
|-----|-----|-----|
|PUBLISH_BY_HTTP|Configuration is published through the HTTP interface, including creating and modifying configurations.|2.3.0|
|PUBLISH_BY_RPC|Configuration is published through the gRPC interface, including creating and modifying configurations.|2.3.0|
|REMOVE_BY_HTTP|Configuration is removed through the HTTP interface.|2.3.0|
|REMOVE_BY_RPC|Configuration is removed through the gRPC interface.|2.3.0|
|IMPORT_BY_HTTP|Configuration is imported through the HTTP interface.|2.3.0|
|REMOVE_BATCH_HTTP|Configurations are batch removed through the HTTP interface.|2.3.0|

### ConfigChangeExecuteTypes

In Nacos, the configuration change plugins need to be executed before or after the `ConfigChangePointCutTypes` by selecting the `ConfigChangeExecuteTypes`. These execution types are defined in `com.alibaba.nacos.plugin.config.constants.ConfigChangeExecuteTypes`. The specific details are as follows:

|Execute Type|Description|Start version|
|-----|-----|-----|
|EXECUTE_BEFORE_TYPE|Plugin execute **Before** `ConfigChangePointCutTypes`|2.3.0|
|EXECUTE_AFTER_TYPE|Plugin execute **After** `ConfigChangePointCutTypes`|2.3.0|

## Plugin Development

To develop a config change plugin for the Nacos server, you first need to depend on the relevant API of the config change plugin.

```xml
        <dependency>
            <groupId>com.alibaba.nacos</groupId>
            <artifactId>nacos-config-plugin</artifactId>
            <version>${project.version}</version>
        </dependency>
```

`${project.version}` is the Nacos version, at least `2.3.0`.

Then implement `com.alibaba.nacos.plugin.config.spi.ConfigChangePluginService` interface, which include following method:

|Method name|Parameters|Return|Description|
|-----|-----|-----|-----|
|getServiceType|void|String|Returns the name of the plugin, which is used to differentiate between different types of plugin implementations.|
|getOrder|void|int|Returns the execution order of the plugin. The configuration change plugin is designed with a chain plugin pattern, where multiple plugins are executed in order. The smaller the return value of getOrder, the earlier the plugin is executed.|
|executeType|void|ConfigChangeExecuteTypes|Returns `ConfigChangeExecuteTypes` implemented by the plugin.|
|pointcutMethodNames|void|ConfigChangePointCutTypes[]|Returns `ConfigChangePointCutTypes` where the plugin is implemented.|
|execute|ConfigChangeRequest,ConfigChangeResponse|void|Executes the actual logic of the plugin.|

`ConfigChangeRequest` and `ConfigChangeResponse` refer to the contents passed in during the execution of logic and the resulting execution outcome, respectively.

`ConfigChangeRequest` mainly include follow contents:

|Field name|Type|Description|
|-----|-----|-----|
|requestType|ConfigChangePointCutTypes|The pointcut types of this configuration change|
|requestArgs|HashMap<String, Object>|The actual parameters of this configuration change, mainly including `namespace`, `group`, `dataId`, `content`, etc., with different parameters for different pointcut types|

`ConfigChangeResponse` mainly include follow contents:

|Field name|Type|Description|
|-----|-----|-----|
|responseType|ConfigChangePointCutTypes|The pointcut types of this configuration change|
|isSuccess|boolean|Indicates whether the execution is successful. When the return value is `false`, the configuration change will be intercepted and the failure result will be returned directly|
|retVal|Object|Return content, a reserved field that is currently not used|
|msg|String|Execution result information, obtained when `isSuccess` is `false`, used to return information to the client|
|args|Object[]|The execution parameters of the configuration change, effective for the `EXECUTE_BEFORE_TYPE` plugin type. It can be used to modify the content of the actual executed configuration change, such as changing certain values in content to other values|

### Load Plugin

After the plugin finished, it needs to be packaged into jar/zip and places in the classpath of the nacos server. If you don't know how to add plugins into the classpath, please place plugins under `${nacos-server.path}/plugins` directly.

After Adding plugins into classpath, also need to modify some configuration in `${nacos-server.path}/conf/application.properties`.

```properties
### The name of the config change plugin enabled in Nacos, corresponding to the return value of com.alibaba.nacos.plugin.config.spi.ConfigChangePluginService's getServiceType method.
nacos.core.config.plugin.${configChangePluginName}.enabled=true
```

After restarting the Nacos cluster and completing the startup, you can see the following logs in `${nacos-server.path}/logs/plugin-control.log`:

```text
[ConfigChangePluginManager] Load ${className}(${classFullName}) ConfigChangeServiceName(${configChangePluginName}) successfully.
```

### Custom Plugin properties

Some plugins may want to set certain parameters through a configuration file. Custom plugins can modify the following configurations in `${nacos-server.path}/conf/application.properties` to achieve this:

```properties
### The name of the config change plugin enabled in Nacos, corresponding to the return value of com.alibaba.nacos.plugin.config.spi.ConfigChangePluginService's getServiceType method.
nacos.core.config.plugin.${configChangePluginName}.${propertyKey}=${propertyValue}
```

In `ConfigChangeRequest`, getting properties by following way:

```Java
final Properties properties = (Properties) configChangeRequest.getArg(ConfigChangeConstants.PLUGIN_PROPERTIES);
final String ${propertyKey} = properties.getProperty("${propertyKey}");
```

## Plugin Demo

In the [nacos-group/nacos-plugin](https://github.com/nacos-group/nacos-plugin) repository, there is a demo implementation of a configuration change plugin. This demo plugin implements validation of the configuration content format, validation of the whitelist for importing configuration names, and a webhook callback after the change. To use this plugin, you need to package it as a JAR/ZIP file and place it in the classpath of the Nacos server. Additionally, add the following configuration in `${nacos-server.path}/conf/application.properties`:

```properties
# webhook
#nacos.core.config.plugin.webhook.enabled=true
# It is recommended to use EB https://help.aliyun.com/document_detail/413974.html
#nacos.core.config.plugin.webhook.url=http://${webhookIp}:${webhookPort}/${webhookUri}?token=***
# The content push max capacity ,byte
#nacos.core.config.plugin.webhook.contentMaxCapacity=102400

# whitelist
#nacos.core.config.plugin.whitelist.enabled=true
# The import file suffixs
#nacos.core.config.plugin.whitelist.suffixs=xml,text,properties,yaml,html

# fileformatcheck,which validate the import file of type and content
#nacos.core.config.plugin.fileformatcheck.enabled=true
```