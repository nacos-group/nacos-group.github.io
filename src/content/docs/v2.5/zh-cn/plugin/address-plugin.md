---
title: 寻址插件
keywords: [寻址, 插件]
description: 本文描述如何开发及使用Nacos的寻址插件
sidebar:
    order: 2
    hidden: true
---

# 寻址插件

Nacos从2.3.0版本开始，支持通过[SPI](https://docs.oracle.com/javase/tutorial/sound/SPI-intro.html)的方式注入集群寻址相关插件，并在`application.properties`配置文件中选择某一种插件实现作为实际寻址服务。本文档会详细介绍如何实现一个寻址插件和如何使其生效。

> 注意：
> 目前寻址插件还处于Beta测试的阶段，其API及接口定义可能会随后续版本升级而有所修改，请注意您的插件适用版本。

## 寻址插件概述

当前Nacos集群寻址有三种寻址方式，单机寻址，配置文件寻址和地址服务器寻址，通过寻址插件，用户可以编写自己的寻址逻辑。

## 开发Nacos服务端寻址插件

开发Nacos服务端寻址插件，首先需要依赖寻址插件的相关API

```xml
        <dependency>
            <groupId>com.alibaba.nacos</groupId>
            <artifactId>nacos-address-plugin</artifactId>
            <version>${project.version}</version>
        </dependency>
```

`${project.version}` 为您开发插件所对应的Nacos版本

随后实现`com.alibaba.nacos.plugin.address.spi.AddressPlugin`接口， 并将您的实现添加到SPI的services当中。

接口中需要实现的方法如下：

|方法名|入参内容|返回内容|描述|
|-----|-----|-----|---|
|start|void|void|启动该插件的寻址功能。|
|getServerList|void|List&lt;String>|返回所有Nacos集群结点的地址，地址格式为`IP:Port`。|
|getPluginName|void|String|插件的名称，当名字相同时，后加载的插件会覆盖先加载的插件|
|registerListener|Consumer&lt;List&lt;String>>|AddressPlugin|注册监听器, 当集群地址发生改变时调用监听器的方法|
|shutdown|void|void|关闭插件|

该接口由`com.alibaba.nacos.plugin.address.spi.AbstractAddressPlugin`抽象类默认实现`getServerList`, `registerListener`和`shutdown`方法，
用户在实际编写插件时继承`AbstractAddressPlugin`实现其余方法即可。`AbstractAddressPlugin`有一个名为serverList的List&lt;String>成员变量，即集群地址集合，用户需要在start方法调用后，维护
该变量即可。
当用户需要在配置文件中配置插件相关的参数， 需要在property配置文件中配置以address.plugin开头的key，这时变可以通过`com.alibaba.nacos.plugin.address.common.AddressProperties`单例类获取对应的参数
```properties
address.plugin.${key} = ${val}
```
配置之后，用户在编写插件时便可以通过
```java
AddressProperties.getProperty(${key})
```
来获取参数。

### 使用服务端插件

插件开发完成后，需要打包成jar/zip，放置到nacos服务端的classpath中，如果您不知道如何修改classpath，请直接放置到`${nacos-server.path}/plugins`下

放置后，需要修改`${nacos-server.path}/conf/application.properties`中的以下配置

```properties
### 所启用的Nacos的寻址插件的名称，与`com.alibaba.nacos.plugin.address.spi.AddressService#getPlugin返回值对应
nacos.core.member.lookup.type=${addressPluginName}
```
随后重启nacos集群，在有请求访问到nacos节点后，可以从`${nacos-server.path}/logs/nacos-cluster.log`中看到如下日志：

```text
[AddressPluginManager] Load AddressPlugin(xxxx) PluginName(xxx) successfully.
```

### 使用Nacos自带的寻址插件

为了与老版本的寻址兼容，用户在不使用自定义插件时该配置与原来相同，还是`nacos.core.member.lookup.type=[file,address-server]`这一配置项.

## 客户端插件

### 使用自定义插件
Nacos的客户端用户自定义寻址插件实现方式和服务端相同，当用户需要使用自定义插件时，继承`com.alibaba.nacos.plugin.address.spi.AbstractAddressPlugin`或者实现`com.alibaba.nacos.plugin.address.spi.AddressPlugin`接口，将开发完成的客户端插件打包成jar/zip，放入到您应用的classpath中即可自动生效。在初始化`NacosConfigService`或者`NacosNamingService`时，在传递的`Properties`对象中传入key为`addressPluginName`，val为插件`getPluginName`返回值的参数。
如:
```java
 Properties properties = new Properties();
 properties.put("addressPluginName", ${addressPluginName});
 ConfigService configService = NacosFactory.createConfigService(properties);
 String content = configService.getConfig(dataId, group, 5000);
```

### 使用Nacos自带的寻址插件
Nacos的Java客户端插件适配了老版本，如果不使用自定义的插件，客户端的使用和之前没有区别。

### 其他语言客户端寻址插件

待社区贡献。
