---
id: "question-history-8270"
title: "How to continue sending requests to service instances nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "在Nacos中，若要向健康状态为false的服务实例继续发请求，可以采取以下步骤：1. **使用Nacos-Client的`getAllInstances`方法**：首先，利用Nacos客户端提供的`getAllInstances`方法来获取指定服务的所有实例信息。这包括了健康状态为false及权重"
tags: ["继续发送请求","服务实例","健康状态","false"]
keywords: ["继续发送请求","服务实例","健康状态","false"]
---

在Nacos中，若要向健康状态为false的服务实例继续发请求，可以采取以下步骤：1. **使用Nacos-Client的`getAllInstances`方法**：首先，利用Nacos客户端提供的`getAllInstances`方法来获取指定服务的所有实例信息。这包括了健康状态为false及权重
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13618)给我们反馈。
