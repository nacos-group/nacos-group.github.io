---
title: 自定义环境变量
keywords: [自定义环境变量,自定义配置,数据库密码加密]
description: Nacos自定义环境变量插件支持通过SPI机制扩展服务端配置，实现如数据库密码加密等功能，适用于2.2.0及以上版本，目前处于Beta阶段，需留意API变动。
sidebar:
    order: 6
---

# 自定义环境变量插件

Nacos从2.2.0版本开始，可通过[SPI](https://docs.oracle.com/javase/tutorial/sound/SPI-intro.html)机制注入自定义环境变量实现插件，在插件中自定义nacos的配置，并按照您期望的方式进行处理（如数据库密码加密）。本文档详细介绍一个自定义环境变量插件如何实现以及如何使其生效。

> 注意:
> 目前自定义环境变量插件处于Beta测试阶段,其API及接口方法定义可能会在后续版本升级而有较大修改，请注意您的插件适用版本。

## 插件开发

开发Nacos服务端自定义环境变量插件，首先需要依赖自定义环境变量插件的相关API

```xml
        <dependency>
            <groupId>com.alibaba.nacos</groupId>
            <artifactId>nacos-custom-environment-plugin</artifactId>
            <version>${project.version}</version>
        </dependency>
```

`${project.version}` 为您开发插件所对应的Nacos版本

随后实现`com.alibaba.nacos.plugin.environment.spi.CustomEnvironmentPluginService`接口， 并将您的实现添加到SPI的services当中。

接口中需要实现的方法如下：

| 方法名         | 入参内容                  | 返回内容                  | 描述                                                 |
|-------------|-----------------------|-----------------------|----------------------------------------------------|
| pluginName  | `void`                | `String`              | 插件的名称。                                             |
| propertyKey | `void`                | `Set<String>`         | 需要对服务端自定义的配置项名称。                                   |
| order       | `void`                | `Integer`             | 插件的优先级,数字越大优先级越高,多个插件同时自定义同一个配置项,优先级高的插件将会覆盖优先级低的。 |
| customValue | `Map<String, Object>` | `Map<String, Object>` | 入参为propertyKey对应的配置项的值，出参为自定义之后的配置项值。              |

在[nacos-group/nacos-plugin](https://github.com/nacos-group/nacos-plugin)中，有一个demo的自定义环境变量插件实现，该demo插件实现了将数据库密码Base64解密，
于是您可以在`application.properties`配置文件中设置密文数据库密码而不是明文密码。

# 如何使用
插件开发完成后，需要打包成jar/zip，放置到nacos服务端的classpath中，如果您不知道如何修改classpath，请直接放置到`${nacos-server.path}/plugins`下

放置后，需要修改`${nacos-server.path}/conf/application.properties`中的以下配置

```properties
### 开启自定义环境变量功能
nacos.custom.environment.enabled=true
```

随后重启nacos集后，可以从`${nacos-server.path}/logs/nacos.log`中看到如下日志：

```text
[CustomEnvironmentPluginManager] Load customEnvironmentPluginService(xxx) customEnvironmentPluginName(xxx) successfully..
```
