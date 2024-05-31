---
id: "question-history-11202"
title: "nacos 内置数据库 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "Nacos 支持使用内置数据库来存储配置信息，其内置的数据库为 Derby。使用 Derby 数据库时，Nacos 会依赖于其自研的一致性协议来确保所有 Nacos 节点之间的一致性。当在任意节点发布配置，Nacos 会通知所有节点更新它们的缓存，利用配置内容的 MD5 值来保证缓存与数据库数据的一"
tags: ["内置数据库"]
keywords: ["内置数据库"]
---

Nacos 支持使用内置数据库来存储配置信息，其内置的数据库为 Derby。使用 Derby 数据库时，Nacos 会依赖于其自研的一致性协议来确保所有 Nacos 节点之间的一致性。当在任意节点发布配置，Nacos 会通知所有节点更新它们的缓存，利用配置内容的 MD5 值来保证缓存与数据库数据的一
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13741)给我们反馈。
