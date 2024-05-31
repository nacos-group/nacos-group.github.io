---
id: "question-history-13443"
title: "对于持久化实例， nacos服务端会向实例的 ip:port 发送心跳检测吗？ nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "在Nacos中，对于**持久化实例**（ephemeral=false），**Nacos服务端确实会向实例的ip:port发送心跳检测**。这一做法是为了监控这些实例的健康状态。如果服务端发现某个持久化实例不响应心跳检测或者健康检查失败，它会将该实例标记为不健康，从而避免上游服务继续将流量导向这个不"
tags: ["持久化实例","心跳检测","ip:port","nacos服务端"]
keywords: ["持久化实例","心跳检测","ip:port","nacos服务端"]
---

在Nacos中，对于**持久化实例**（ephemeral=false），**Nacos服务端确实会向实例的ip:port发送心跳检测**。这一做法是为了监控这些实例的健康状态。如果服务端发现某个持久化实例不响应心跳检测或者健康检查失败，它会将该实例标记为不健康，从而避免上游服务继续将流量导向这个不健康的节点。这种机制确保了服务调用的可靠性和稳定性，因为持久化实例的数据是长期存在且不会因为客户端的短暂网络波动或重启而被自动移除的。

简而言之，Nacos服务端对持久化实例进行主动健康检查，通过向它们的ip:port发送心跳检测来确保服务实例的有效性和服务质量。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13898)给我们反馈。
