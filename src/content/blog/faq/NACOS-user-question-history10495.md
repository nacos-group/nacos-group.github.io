---
id: "question-history-10495"
title: "#Nacos的自动健康检查是如何工作的？ nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "Nacos的自动健康检查主要是通过Spring Actuator与Nacos客户端集成来实现的。当您的应用集成了Nacos作为配置中心（通过`nacos-spring-boot-starter`或`spring-cloud-alibaba-nacos-config`）或服务发现（通过`nacos-s"
tags: ["Nacos","自动健康检查","工作原理"]
keywords: ["Nacos","自动健康检查","工作原理"]
---

Nacos的自动健康检查主要是通过Spring Actuator与Nacos客户端集成来实现的。当您的应用集成了Nacos作为配置中心（通过`nacos-spring-boot-starter`或`spring-cloud-alibaba-nacos-config`）或服务发现（通过`nacos-s
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13692)给我们反馈。
