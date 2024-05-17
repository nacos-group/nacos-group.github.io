---
id: "question-history-8266"
title: "开源版本可以支持ak sk鉴权吗？ nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource 开源版本可以支持ak sk鉴权吗？"
tags: ["开源版本","ak sk鉴权"]
keywords: ["开源版本","ak sk鉴权"]
---

## 用户问题 ： 
 开源版本可以支持ak sk鉴权吗？ nacos-opensource 

---------------
## 专家官方解答 ：

开源版本的Nacos不支持ak/sk鉴权。

问题原因在于ak/sk是云产品提供的鉴权身份信息，其校验逻辑与具体实现方式依赖于云服务商（如阿里云MSE）。由于开源版Nacos不具备与云服务商内部鉴权系统对接的能力，因此无法支持ak/sk鉴权。

结论：在开源版本的Nacos中，无法启用ak/sk鉴权。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:开源版本可以支持ak/sk鉴权吗？ 
 
 *专家经验:Nacos k8s部署得nacos2.2.3版本集群模式怎么配置鉴权 
 
 *[Authorization](https://nacos.io/docs/latest/guide/user/auth)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11577)给我们反馈。
