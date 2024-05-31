---
id: "question-history-10505"
title: "#Nacos配置中心宕机，还能读取到配置吗 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "当Nacos配置中心发生宕机时，应用实例是否还能读取到配置取决于以下几个因素，基于提供的知识内容，我们可以分析如下：1. **本地缓存机制**：Nacos提供了配置的本地缓存能力，即当配置项被客户端成功拉取后，会存储在本地。如果Nacos配置中心宕机，而应用实例在此之前已经成功拉取并缓存了配置信息，"
tags: ["Nacos配置中心","宕机","读取","配置"]
keywords: ["Nacos配置中心","宕机","读取","配置"]
---

当Nacos配置中心发生宕机时，应用实例是否还能读取到配置取决于以下几个因素，基于提供的知识内容，我们可以分析如下：1. **本地缓存机制**：Nacos提供了配置的本地缓存能力，即当配置项被客户端成功拉取后，会存储在本地。如果Nacos配置中心宕机，而应用实例在此之前已经成功拉取并缓存了配置信息，
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13702)给我们反馈。
