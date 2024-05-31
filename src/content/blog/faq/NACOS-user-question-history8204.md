---
id: "question-history-8204"
title: "nacos升级到2.3.0后，元数据大小限制导致部分API无法注册 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "在Nacos升级到2.3.0后，遇到“Param 'Metadata' is illegal, the param length should not exceed 1024.”的错误，意味着您的部分API无法注册，这是由于元数据大小超过了Nacos服务端新设定的限制1024个字符。这一改变旨在增强"
tags: ["nacos","2.3.0","元数据大小限制","API无法注册"]
keywords: ["nacos","2.3.0","元数据大小限制","API无法注册"]
---

在Nacos升级到2.3.0后，遇到“Param 'Metadata' is illegal, the param length should not exceed 1024.”的错误，意味着您的部分API无法注册，这是由于元数据大小超过了Nacos服务端新设定的限制1024个字符。这一改变旨在增强
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13562)给我们反馈。
