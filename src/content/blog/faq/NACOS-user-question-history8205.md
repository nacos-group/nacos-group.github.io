---
id: "question-history-8205"
title: "为什么要在代码里面写拼接sql来实现crud nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource 为什么要在代码里面写拼接sql来实现crud"
tags: ["拼接sql","crud"]
keywords: ["拼接sql","crud"]
---

## 用户问题 ： 
 为什么要在代码里面写拼接sql来实现crud nacos-opensource 

---------------
## 专家官方解答 ：

在Nacos项目中，选择在代码中手写拼接SQL来实现CRUD（Create、Read、Update、Delete）操作，而不是采用ORM（Object-Relational Mapping）框架，主要是出于以下几个原因：

1. **保持轻量化与高性能**：作为基础组件而非业务组件，Nacos的设计目标强调轻量化与高性能。引入ORM框架，如JPA，会导致Nacos依赖增加，不仅会使得部署包大小显著扩大（超过20%），而且根据经验，ORM框架中包含的反射、Bean拷贝以及动态SQL逻辑等特性，虽然在许多业务场景下提供了便利，但对于Nacos而言却是不必要的资源消耗。这些额外的处理逻辑并不符合Nacos追求高效、简洁的需求，反而可能带来性能下降。

2. **简化需求与避免冗余功能**：Nacos对于数据库访问的需求相对简单直接，主要涉及对配置、服务等数据的基本CRUD操作。ORM框架通常提供的复杂映射、查询能力、关联操作等功能在此并无用武之地。直接使用JDBC（Java Database Connectivity）结合连接池进行数据库访问，能够更精确地控制SQL语句，确保其针对性和效率，避免了使用ORM时引入的潜在性能开销和复杂性。

综上所述，Nacos项目选择在代码中手动拼接SQL来实现CRUD操作，是为了保持项目的轻量化、高性能，以及避免引入ORM框架带来的不必要的复杂性和潜在性能损失。这样的决策有助于Nacos更好地服务于其作为基础组件的核心定位，专注于提供稳定、高效的配置管理与服务发现功能。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:为什么Nacos不使用ORM框架访问数据库 
 
 *专家经验:CatalogController 里面的接口和客户端SDK的API区别是什么 
 
 *[Nacos功能和需求列表](https://nacos.io/docs/latest/archive/feature-list)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11525)给我们反馈。
