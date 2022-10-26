---
title: 配置变更插件
keywords: 配置变更,插件
description: 本文描述如何设计实现、使用配置变更插件
---
# 配置变更插件

## 基本诉求

>nacos作为易于构建云原生应用的动态服务发现、配置管理和服务管理平台，服务和配置的管理是其核心的业务功能，也是实现微服务治理的关键。而配置的管理直接影响着服务实例的运行，对于配置的变更则是需要严格把控，安全性和准确性是配置变更的基本要求。
对于配置变更的途径主要包括控制台Console、OpenAPI和SDK客户端等方式，对于控制台Console的变更方式一般需要进行变更审批，更为严格。而SDK方式或OpenAPI则直接通过client、HTTP调用请求nacos-server进行变更，此种方式一般未走审批流程，存在一定的风险性。

因此，为了更加保证配置变更的安全性，社区中主要提出了以下几个配置变更的需求：
- WebHook：进行配置变更（含发布、修改、上传、删除操作）情况的通知，保证用户的及时感知配置的变化情况 。
- 文件后缀白名单：对上传的文件后缀（配置变更的上传文件操作）进行白名单处理，防止非法文件上传，带来入侵风险。
- 文件内容格式校验：对所发布配置的内容和格式进行校验（配置变更的发布操作），防止前端校验失败，误传至后端，带来不必要的风险。

## 如何实现

### 模块结构

![](https://s3.bmp.ovh/imgs/2022/10/25/a77196e50c8abe6e.png)

定义统一的全局切面，通过AOP机制进行对gRPC、HTTP入口方法切入，并置入相应的配置变更插件服务。其置入的配置变更插件服务情况由插件服务管理
根据application.properties(所配置的相关插件服务开启情况)以及插件服务类型（例如WebHook需对发布、删除等所有变更动作进行切入）进行决定。

通过SPI机制进行对配置变更插件服务的操作进行抽象，定义了配置变更插件的顶级接口。nacos默认实现WebHook，文件上传后缀白名单，文件上传格式内容校验插件服务，用户也可进行自定义实现更多的配置变更插件服务。

服务的具体执行由服务执行Handler进行处理，来协调变更前或变更后服务的执行顺序以及消息传递。而插件服务的管理由插件服务管理根据
application.properties的配置情况进行动态加载。

### 详细类图

![](https://s3.bmp.ovh/imgs/2022/10/25/2c4e3b0f9a59ef7a.png)

## 如何使用

### 参数说明

| 参数名 | 含义                                       | 可选值                                | 默认值                                                  | 支持版本 |
| --- |------------------------------------------|------------------------------------|------------------------------------------------------| --- |
| nacos.core.config.plugin.webhook.enabled | 是否打开WebHook配置变更插件                        | true/false                         | false                                                | >= 2.1.1 |
| nacos.core.config.plugin.webhook.url | 配置变更信息所推送的WebHook地址（推荐使用[EventBridge](https://help.aliyun.com/document_detail/413974.html)） | 可成功推送的WebHook地址                    | http://***.aliyuncs.com/webhook/putEvents?token= *** | >= 2.1.1 |
| nacos.core.config.plugin.webhook.maxCapacityContent | WebHook推送内容最大容量值（单位：Byte）                | 正整数（≤102400)                       | 102400                                               | >= 2.1.1 |
| nacos.core.config.plugin.whiteList.enabled | 是否打开文件上传后缀白名单配置变更插件                      | true/false                         | false                                                | >= 2.1.1 |
| nacos.core.config.plugin.whiteList.urls | 文件上传白名单后缀集合（“,”进行分割）                     | xml,text,properties,yaml,json,html | xml,text,properties,yaml,json,html                   | >= 2.1.1 |
| nacos.core.config.plugin.fileformatcheck.enabled | 是否打开文件上传内容格式检查配置变更插件                     | true/false                         | false                                                | >= 2.1.1 |

配置变更插件服务已在config-plugin-default-impl模块下进行默认实现，用户使用配置变更插件服务；
只需需要修改`${nacos-server.path}/conf/application.properties`中的以下配置即可，具体的配置参数说明，见上表。

```properties
##*************** Config Change Plugin Related Configurations ***************#
# webhook
nacos.core.config.plugin.webhook.enabled=false
# It is recommended to use EB https://help.aliyun.com/document_detail/413974.html
nacos.core.config.plugin.webhook.url=http://***.aliyuncs.com/webhook/putEvents?token=***
nacos.core.config.plugin.webhook.maxCapacityContent=102400
# whitelist
nacos.core.config.plugin.whiteList.enabled=false
nacos.core.config.plugin.whiteList.urls=xml,text,properties,yaml,json,html
# filecheck
nacos.core.config.plugin.fileformatcheck.enabled=false
```

启动nacos单机版/集群，在有**发生配置变更动作**后，可以从`${nacos-server.path}/logs/nacos.log`中看到如下日志：

```text
INFO [ConfigChangePluginManager] Load com.alibaba.nacos.plugin.config.impl.NacosWebHookPluginService(xxx) ConfigChangeServiceName(webhook) successfully.

INFO [ConfigChangePluginManager] Load com.alibaba.nacos.plugin.config.impl.NacosFileFormatPluginService(xxx) ConfigChangeServiceName(fileformatcheck) successfully.

INFO [ConfigChangePluginManager] Load com.alibaba.nacos.plugin.config.impl.NacosWhiteListPluginService(xxx) ConfigChangeServiceName(whitelist) successfully.
```


### 如何拓展

#### 前置条件

- [AOP](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#aop)以及nacos中配置变更的基础概念
- 拓展插件服务抽象类`AbstractxxxPluginService`和插件服务接口`ConfigChangeService`
- 拓展插件服务的相关配置类`ConfigChangeConstants`

nacos中的配置变更：
- 配置变更的动作（发布、删除、上传等），对应AOP概念中的Pointcut
- 配置变更的前置\后置，对应AOP概念中的Advice

`ConfigChangeService`的主要方法如下：

|方法名| 入参内容                                                         | 返回内容                     | 描述           |
|-----|--------------------------------------------------------------|--------------------------|--------------|
|execute | ProceedingJoinPoint, ConfigChangeRequest,ConfigChangeResponse | void                     | 插件服务具体执行     |
 |executeType| no params        | ConfigChangeExecuteTypes | 服务插件执行类型（前置\后置） |
 |getServiceType| no params     | String                   | 服务名          |
 |getOrder| no params          | int                      | 执行优先级        |
 |pointcutMethodNames|no params |ConfigChangePointCutTypes[]| 所切入的配置变更动作集合 |

所拓展的`AbstractxxxPluginService`只需去实现该接口的中executeType、 getServiceType 、getOrder三个方法即可，pointcutMethodNames
根据getServiceType默认实现。而execute方法则交由`AbstractxxxPluginService`的子类去具体实现。

注意：getServiceType的实现需要以`ConfigChangeConstants.xxx.class.getSimpleName().toLowerCase(Locale.ROOT) `格式去定义，并在
`ConfigChangeConstants`中进行相关配置。

在`ConfigChangeConstants`中是定义配置变更插件服务的基本信息。


```text
    // 配置变更切入动作（必须）
    public static final ConfigChangePointCutTypes[] CONFIG_CHANGE_POINT_CUT_TYPES_TYPES = {};
    // 其他所需信息，与application.properties关联（例如xxx.enabled是否开启，建议必须设置该属性，保证服务的灵活性）
```


#### 示例描述

> nacos的默认实现和用户拓展是同样的原理，因此以下示例则采用WebHook的nacos默认实现进行描述。 

- 在nacos-config-plugin模块中的`com.alibaba.nacos.plugin.config.spi`包下，定义所需拓展的插件服务抽象类，并实现`ConfigChangeService`接口。 
关于

![](https://s3.bmp.ovh/imgs/2022/10/25/4609eb81a7b031c3.png)

- 在nacos-config-plugin模块中的`com.alibaba.nacos.plugin.config.constants`包下，添加你所需的配置信息。
![](https://s3.bmp.ovh/imgs/2022/10/25/2344b8a5377cfb40.png)

- 在`application.properties`配置文件中添加配置信息。
![](https://s3.bmp.ovh/imgs/2022/10/25/8ee816d7ad8f97af.png)

- 在在nacos-config-plugin-default-impl模块中的`com.alibaba.nacos.plugin.config.impl`进行实现你的服务。由于其中采用AOP实现，
因此你需要了解一下ProceedingJointPoint的作用,请参考[AOP](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#aop)。
![](https://s3.bmp.ovh/imgs/2022/10/25/952e0f67e4456cfb.png)

- 测试，在`application.properties`中修改你的配置信息，并进行相应的配置变更操作，查看对应的插件服务执行情况。









