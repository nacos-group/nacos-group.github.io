---
title: 配置变更
keywords: [Nacos, 配置变更, 配置审计, 配置格式校验, webhook, SPI, AOP, 插件开发]
description: Nacos 2.3.0引入配置变更插件支持，实现配置审计、格式校验与webhook回调。通过SPI注入，开发者能定制变更前后逻辑，增强配置管理灵活性。文章详述了插件概念、开发流程、加载与自定义参数传递，及DEMO实现。
sidebar:
    order: 8
---

# 配置变更插件

社区中一直以来都希望Nacos配置中心能在配置发生变更时，通知一些特定系统，用于发送记录、警告等审计功能。在2.3.0版本前，只能通过模拟Nacos客户端订阅配置的方式，对核心配置的变更操作进行订阅，在收到变更通知后，进行发送记录、警告等功能的执行。

这种实现方式有几个比较大的问题，第一是监听的配置需要逐个添加，难以对所有配置变更进行获取；第二是只能在配置变更后执行功能逻辑，无法做到前置的操作，如格式校验，白名单校验等。

因此Nacos在2.3.0版本后，支持通过[SPI](https://docs.oracle.com/javase/tutorial/sound/SPI-intro.html)注入配置变更插件，允许用户通过自定义插件的方式，对配置变更前，和变更完成后分别执行一些自定义逻辑，如格式校验，白名单校验，webhook等。

## 配置变更插件中的概念

Nacos的配置变更插件，参考了面向切面编程AOP的设计思想，将配置的变更操作（如新增，更新，删除）作为`切点（PointCut)`，并在这些切点`前(Before)`和`后(After)`织入插件。

### 配置变更切点(ConfigChangePointCutTypes)

Nacos根据配置变更的行为和来源，将配置变更操作在`com.alibaba.nacos.plugin.config.constants.ConfigChangePointCutTypes`中定位为了数个`配置变更切点(ConfigChangePointCutTypes)`，具体内容如下：

|切点名称|描述|起始版本|
|-----|-----|-----|
|PUBLISH_BY_HTTP|配置通过HTTP接口进行发布，包含了创建配置及修改配置|2.3.0|
|PUBLISH_BY_RPC|配置通过GRPC接口进行发布，包含了创建配置及修改配置|2.3.0|
|REMOVE_BY_HTTP|配置通过HTTP接口进行删除|2.3.0|
|REMOVE_BY_RPC|配置通过GRPC接口进行删除|2.3.0|
|IMPORT_BY_HTTP|配置通过HTTP接口进行导入|2.3.0|
|REMOVE_BATCH_HTTP|配置通过HTTP接口进行批量删除|2.3.0|

### 配置变更织入类型(ConfigChangeExecuteTypes)

Nacos的配置变更插件需要在`配置变更切点`之前或之后进行执行，即需要选择`配置变更织入类型(ConfigChangeExecuteTypes)`，定义在`com.alibaba.nacos.plugin.config.constants.ConfigChangeExecuteTypes`中，具体内容如下：

|织入类型|描述|起始版本|
|-----|-----|-----|
|EXECUTE_BEFORE_TYPE|插件实现在`配置变更切点`之**前**执行|2.3.0|
|EXECUTE_AFTER_TYPE|插件实现在`配置变更切点`之**后**执行|2.3.0|

## 插件开发

开发Nacos服务端配置变更插件，首先需要依赖配置变更插件的的相关API

```xml
        <dependency>
            <groupId>com.alibaba.nacos</groupId>
            <artifactId>nacos-config-plugin</artifactId>
            <version>${project.version}</version>
        </dependency>
```

`${project.version}` 为您开发插件所对应的Nacos版本，`2.3.0`及以上。

随后实现`com.alibaba.nacos.plugin.config.spi.ConfigChangePluginService`接口，该接口需要实现的方法如下：

|方法名|入参内容|返回内容|描述|
|-----|-----|-----|-----|
|getServiceType|void|String|插件的名称，用于区分不同类型的插件实现|
|getOrder|void|int|插件的执行顺序，配置变更插件采用链式插件设计，多个插件实现时会按照顺序执行，getOrder越小，顺序越靠前|
|executeType|void|ConfigChangeExecuteTypes|插件实现的`配置变更织入类型`|
|pointcutMethodNames|void|ConfigChangePointCutTypes[]|插件实现织入的`配置变更切点`|
|execute|ConfigChangeRequest,ConfigChangeResponse|void|实际插件执行的逻辑|

其中`ConfigChangeRequest`和`ConfigChangeResponse`分别为执行逻辑时传入的内容及执行结果，

`ConfigChangeRequest`的具体内容如下:

|字段名|字段类型|描述|
|-----|-----|-----|
|requestType|ConfigChangePointCutTypes|本次配置变更的切点类型|
|requestArgs|HashMap<String, Object>|本次配置变更的实际参数，主要包含有`namespace`,`group`,`dataId`,`content`等内容，不同的切点类型参数存在不同|

`ConfigChangeResponse `的具体内容如下:

|字段名|字段类型|描述|
|-----|-----|-----|
|responseType|ConfigChangePointCutTypes|本次配置变更的切点类型|
|isSuccess|boolean|执行是否成功，当返回值为`false`时，将会拦截本次配置变更，并直接返回失败的结果|
|retVal|Object|返回内容，预留字段，暂未启用|
|msg|String|执行结果信息，在`isSuccess`为`false`时获取，用于返回给客户端的信息|
|args|Object[]|配置变更操作的执行参数，在`EXECUTE_BEFORE_TYPE`的插件类型时生效，可用于修改实际执行的配置变更时的内容，如将content中的某些内容修改为其他值|

### 加载插件

插件开发完成后，需要打包成jar/zip，放置到nacos服务端的classpath中，如果您不知道如何修改classpath，请直接放置到`${nacos-server.path}/plugins`下

放置后，需要修改`${nacos-server.path}/conf/application.properties`中的以下配置

```properties
### 所启用的Nacos的配置变更插件的名称，与com.alibaba.nacos.plugin.config.spi.ConfigChangePluginService 的getServiceType 返回值对应
nacos.core.config.plugin.${configChangePluginName}.enabled=true
```

随后重启nacos集群，启动完成后，可在`${nacos-server.path}/logs/nacos.log`日志中看到如下日志。

```text
[ConfigChangePluginManager] Load ${className}(${classFullName}) ConfigChangeServiceName(${configChangePluginName}) successfully.
```

### 插件自定义参数传递

部分插件可能希望通过配置文件设置一些参数，自定义插件可以通过修改`${nacos-server.path}/conf/application.properties`中的以下配置完成：

```properties
### 所启用的Nacos的配置变更插件的名称，与com.alibaba.nacos.plugin.config.spi.ConfigChangePluginService 的getServiceType 返回值对应
nacos.core.config.plugin.${configChangePluginName}.${propertyKey}=${propertyValue}
```

之后能在`ConfigChangeRequest`中，通过下述方法获取该参数：

```Java
final Properties properties = (Properties) configChangeRequest.getArg(ConfigChangeConstants.PLUGIN_PROPERTIES);
final String ${propertyKey} = properties.getProperty("${propertyKey}");
```

## 插件DEMO实现

在[nacos-group/nacos-plugin](https://github.com/nacos-group/nacos-plugin)中，有一个demo的配置变更插件的实现，该demo插件实现了对配置内容格式的校验、配置导入名称白名单的校验、以及变更后回调webhook。打包成jar/zip，放置到nacos服务端的classpath中，在`${nacos-server.path}/conf/application.properties`中的加入以下配置：

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