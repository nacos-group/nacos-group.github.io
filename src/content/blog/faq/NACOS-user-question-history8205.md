---
id: "question-history-8205"
title: "为什么要在代码里面写拼接sql来实现crud nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "Nacos选择在代码中直接写拼接SQL来实现CRUD操作的原因主要基于以下几点：1. **轻量化设计需求**：作为一款基础服务组件，Nacos追求高度的轻量化以确保其高性能和低资源消耗。引入ORM（如JPA）框架会增加项目的依赖复杂度和部署包大小，据估计会使得部署包大小扩大超过20%，这与Nacos"
tags: ["crud","拼接sql"]
keywords: ["crud","拼接sql"]
---

Nacos选择在代码中直接写拼接SQL来实现CRUD操作的原因主要基于以下几点：1. **轻量化设计需求**：作为一款基础服务组件，Nacos追求高度的轻量化以确保其高性能和低资源消耗。引入ORM（如JPA）框架会增加项目的依赖复杂度和部署包大小，据估计会使得部署包大小扩大超过20%，这与Nacos
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13563)给我们反馈。
