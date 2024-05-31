---
id: "question-history-11186"
title: "nacos-opensource 为什么Nacos不使用ORM框架访问数据库 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "Nacos不使用ORM框架访问数据库的原因在于其设计原则和性能考量。具体分析如下：1. **轻量化与高性能需求**：Nacos作为一款基础组件，主要服务于微服务架构中的服务发现、配置管理等功能，其设计追求轻量级与高性能。引入ORM框架，如JPA，虽然能简化数据库操作，但会显著增加项目的依赖复杂度和部"
tags: ["Nacos","ORM框架","访问数据库"]
keywords: ["Nacos","ORM框架","访问数据库"]
---

Nacos不使用ORM框架访问数据库的原因在于其设计原则和性能考量。具体分析如下：

1. **轻量化与高性能需求**：Nacos作为一款基础组件，主要服务于微服务架构中的服务发现、配置管理等功能，其设计追求轻量级与高性能。引入ORM框架，如JPA，虽然能简化数据库操作，但会显著增加项目的依赖复杂度和部署包大小，估计膨胀超过20%，这与Nacos追求的轻量化理念相悖。

2. **避免不必要的性能开销**：ORM框架通过对象关系映射，实现数据库操作的自动化，但这背后涉及大量的反射、Bean拷贝以及动态SQL生成等机制。这些机制在Nacos的应用场景中并非必要，反而会造成额外的性能损耗。直接使用JDBC配合连接池，Nacos能够更精细地控制SQL执行，减少中间层带来的开销，确保系统运行的高效性。

综上所述，Nacos选择绕过ORM框架，直接采用JDBC+连接池的方式访问数据库，这是基于其产品定位与性能优化的综合决策。这一策略确保了Nacos在提供服务的同时，保持了系统的轻量级特性和最大化性能。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13725)给我们反馈。
