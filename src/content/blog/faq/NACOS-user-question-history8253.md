---
id: "question-history-8253"
title: "CatalogController 里面的接口和客户端SDK的API区别是什么啊？ nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource CatalogController 里面的接口和客户端SDK的API区别是什么啊？"
tags: ["CatalogController","接口","客户端SDK","API","区别"]
keywords: ["CatalogController","接口","客户端SDK","API","区别"]
---

## 用户问题 ： 
 CatalogController 里面的接口和客户端SDK的API区别是什么啊？ nacos-opensource 

---------------
## 专家官方解答 ：

CatalogController 里面的接口和客户端SDK的API在Nacos系统中扮演着不同的角色，具有以下显著的区别：

**1. 目标用户与使用场景**

- **CatalogController接口**：属于Nacos的Admin API范畴，主要面向运维人员和控制台使用。这类接口设计的目的是为了满足运维管理需求，如全面掌握服务实例的状态信息（包括已标记为下线的实例），以便进行故障排查、监控、配置调整等运维操作。其应用场景更侧重于系统的维护和治理。

- **客户端SDK API**：对应于Nacos的openAPI，是为应用程序开发者提供的服务发现与配置管理接口。它们旨在帮助开发者在编写代码时轻松集成Nacos服务，如动态获取服务实例列表（过滤掉不可用、下线的实例）、订阅/发布配置等。客户端SDK API聚焦于服务的正常运行时交互，确保应用能够快速、准确地找到可用的服务实例或获取最新配置。

**2. 数据暴露范围与过滤规则**

- **CatalogController接口**：返回的数据更为全面，包括已标记为下线的实例。它不会过滤掉任何状态的服务实例，旨在为运维人员提供完整、详尽的服务实例视图，便于进行全方位的运维管理和问题诊断。

- **客户端SDK API**：在返回服务实例列表时，会主动过滤掉不可用、下线的实例，仅向应用程序提供当前处于活动状态、可供调用的服务实例信息。这种设计有助于保证应用程序连接到稳定、健康的实例，避免因连接到问题实例而导致的故障或性能下降。

**3. 控制器分类与职责划分**

- **CatalogController**：作为Admin API的一部分，专门负责与服务目录相关的管理操作，通常涉及到更深层次的系统状态查询与控制功能。

- **ServiceController**和**InstanceController**：属于openAPI的控制器，分别处理与服务定义和服务实例直接相关的操作。这些API设计简洁、易用，符合开发者在构建微服务架构时对服务发现与配置管理的核心需求。

综上所述，CatalogController里的接口与客户端SDK的API在Nacos系统中服务于不同目标用户，适应不同使用场景，且在数据暴露范围、过滤规则及控制器职责上存在明显差异。CatalogController接口着重于为运维人员提供全面的系统状态信息以进行精细运维，而客户端SDK API则致力于为开发者提供精简、高效的服务发现与配置管理能力，确保应用程序的稳定运行。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:CatalogController 里面的接口和客户端SDK的API区别是什么 
 
 *[Nacos功能和需求列表](https://nacos.io/docs/latest/archive/feature-list)
 
 *[鉴权插件](https://nacos.io/docs/latest/plugin/auth-plugin)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11566)给我们反馈。
