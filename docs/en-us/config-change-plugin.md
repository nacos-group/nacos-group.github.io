---
title: CONFIGURING CHANGE PLUG-IN
keywords: CONFIGURING CHANGE,PLUG-IN
description: This article describes how to design, implement, and use a configuration change plug-in
---
# Configuring the Change Plug-in

## The basic demands

>nacos is a dynamic service discovery, configuration management and service management platform that is easy to build cloud native applications. Service and configuration management is the core business function of NACOS, which is also the key to realize micro-service governance. Configuration management directly affects the operation of service instances, and configuration changes need to be strictly controlled. Security and accuracy are the basic requirements for configuration changes.
Configuration changes can be made through the Console, OpenAPI, and SDK client. Changes to the console generally require change approval, which is more stringent. However, SDK or OpenAPI directly requests nacos-server to make changes through client or HTTP calls, which generally does not go through the approval process and has certain risks.
Therefore, in order to ensure the security of configuration change, the community mainly put forward the following configuration change requirements:
- WebHook:Notifies users of configuration changes (including publishing, modifying, uploading, and deleting operations) to ensure that users are aware of configuration changes in a timely manner.
- fileWhiteList:Whitelists uploaded file suffixes (uploaded files with configuration changes) to prevent illegal file uploads and incurs intrusion risks.
- fileFormatCheck:Verify the content and format of published configurations (publishing configuration changes) to prevent the front-end verification failure and mistransmission to the back-end, causing unnecessary risks.
## How to implement

### Modular structure

![](https://s3.bmp.ovh/imgs/2022/10/25/c1b37928f8c7e290.png)

Define a unified global aspect, cut into gRPC and HTTP entry methods through AOP mechanisms, and place corresponding configuration change plug-in services. The configuration change plug-in service it places is managed by the plug-in service
properties(the enabled status of the relevant plug-in service configured) and the type of plug-in service (for example, WebHook needs to enter all change actions such as publication and deletion).

Through the SPI mechanism, the operation of configuration change plug-in service is abstracted, and the top-level interface of configuration change plug-in is defined. By default, nacos implements WebHook, file upload suffix whitelist, file upload format content verification plug-in services, and users can also customize to realize more configuration change plug-in services.

The specific execution of the service is handled by the service execution Handler, which coordinates the order of service execution and message passing before or after the change. The management of plug-in services is governed by plug-in service management
application.properties is dynamically loaded.

### Detailed class diagram

![](https://s3.bmp.ovh/imgs/2022/10/25/2c4e3b0f9a59ef7a.png)

## How to use

### Parameter specification

|Parameter names |Meaning	 | Optional value	                                     |  Default value | Support version |
| --- |------------------------------------------|-----------------------------------------------------|------------------------------------------------------| --- |
| nacos.core.config.plugin.webhook.enabled | Whether to open the WebHook configuration change plug-in                        | true/false                                          | false                                                | >= 2.1.1 |
| nacos.core.config.plugin.webhook.url | Configure the WebHook address pushed by the change information（recommended use[EventBridge](https://help.aliyun.com/document_detail/413974.html)） | The WebHook address that can be successfully pushed | http://***.aliyuncs.com/webhook/putEvents?token= *** | >= 2.1.1 |
| nacos.core.config.plugin.webhook.maxCapacityContent | Maximum capacity of WebHook content (unit: Byte)                | positive whole number(≤102400)                                        | 102400                                               | >= 2.1.1 |
| nacos.core.config.plugin.whiteList.enabled | Whether to enable the file upload suffix whitelist configuration change plug-in                      | true/false                                          | false                                                | >= 2.1.1 |
| nacos.core.config.plugin.whiteList.urls | File upload whitelist suffix set (split by ", ")                  | xml,text,properties,yaml,json,html                  | xml,text,properties,yaml,json,html                   | >= 2.1.1 |
| nacos.core.config.plugin.fileformatcheck.enabled | Whether to open the file upload Content Format Check the configuration change plug-in                    | true/false                                          | false                                                | >= 2.1.1 |

Configuration changes plug-in service has been in the config-plugin-default-default implementation under impl module, user configuration changes plug-in services; Just need to modify the $[nacosserver path)/conf/application. The properties of the following configuration, specific configuration parameters, see above.

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

Start nacos standalone/cluster, in the **configuration changes action**, from `${nacos-server.path}/logs/nacos.log` see the log as follows:

```text
INFO [ConfigChangePluginManager] Load com.alibaba.nacos.plugin.config.impl.NacosWebHookPluginService(xxx) ConfigChangeServiceName(webhook) successfully.

INFO [ConfigChangePluginManager] Load com.alibaba.nacos.plugin.config.impl.NacosFileFormatPluginService(xxx) ConfigChangeServiceName(fileformatcheck) successfully.

INFO [ConfigChangePluginManager] Load com.alibaba.nacos.plugin.config.impl.NacosWhiteListPluginService(xxx) ConfigChangeServiceName(whitelist) successfully.
```

### How to develop


#### Preconditions

- The basic concept of configuration changes about nacos and [AOP](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#aop)
- Expand Plug-in abstract class `AbstractxxxPluginService` and Plug-in interface `ConfigChangeService`
- Expand the plug-in services related configuration class `ConfigChangeConstants`

In the hacos configuration changes:
- Configuration changes of action (distribution, delete, upload, etc.), corresponding to the concept of AOP Pointcut 
- in the front/rear configuration changes, the corresponding Advice of AOP concepts

|method name|parameters|returns| description                              |
|-----|--------------------------------------------------------------|--------------------------|------------------------------------------|
|execute | ProceedingJoinPoint, ConfigChangeRequest,ConfigChangeResponse | void                     | plug-in concrete execution services      |
|executeType| no params        | ConfigChangeExecuteTypes | services do plug-in type(rear and front) |
|getServiceType| no params     | String                   | service name                             |
|getOrder| no params          | int                      | executive priorities                     |
|pointcutMethodNames|no params |ConfigChangePointCutTypes[]| cut by configuration changes the set     |



Expand the `AbstractxxxPluginService` executeType need to implement this interface,
GetServiceType, getorder three methods can, pointcutMethodNames according to getServiceType default implementation.
While the execute method to a `AbstractxxxPluginService` subclass to specific implementation.
Note: GetServiceType implementation need to be 'ConfigChangeConstants.xxx.Class.getSimpleName().toLowerCase(Locale. ROOT)
`ConfigChangeConstants` format to define, and in the relevant configuration.

Is defined in the `ConfigChangeConstants` configuration changes the basic information of the plug-in services.

```text
    // Configuration changes into action (must)
    public static final ConfigChangePointCutTypes[] CONFIG_CHANGE_POINT_CUT_TYPES_TYPES = {};
    // Other information needed, associated with application, the properties (such as xxx.enabled, suggested that the attribute must be set, guarantee the flexibility of service)
```
#### Sample description

- In nacos-config-plugin module ` com.alibaba.nacos.plugin.config.spi` package, abstract class definitions needed to expand the plug-in services, and implement ` ConfigChangeService ` interface.
![](https://s3.bmp.ovh/imgs/2022/10/26/91b7825ca471ffb3.png)

- In nacos-config-plugin module ` com.alibaba.nacos.plugin.config.constants ` package, adding the configuration information you need.
![](https://s3.bmp.ovh/imgs/2022/10/26/e53c9683345e6efe.png)

- Add the configuration information in the `application.properties` configuration file.

![](https://s3.bmp.ovh/imgs/2022/10/25/8ee816d7ad8f97af.png)

- In nacos-config-plugin-default-impl module of ` com.alibaba.nacos.plugin.config.impl ` implement your service. Because of its AOP implementation,
So you need to see what the proceedingJointpoints are doing, see also[AOP](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#aop)。

![](https://s3.bmp.ovh/imgs/2022/10/25/952e0f67e4456cfb.png)

- To test, modify your configuration information in `application.properties` and make corresponding configuration changes to see the corresponding plug-in service execution.









