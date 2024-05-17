---
id: "question-history-10492"
title: "#Nacos的服务注册与发现是如何保证实时性的？ nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource #Nacos的服务注册与发现是如何保证实时性的？"
tags: ["服务注册","发现","实时性"]
keywords: ["服务注册","发现","实时性"]
---

## 用户问题 ： 
 #Nacos的服务注册与发现是如何保证实时性的？ nacos-opensource 

---------------
## 专家官方解答 ：

Nacos的服务注册与发现保证实时性的机制主要包括以下几个关键点：

1. **心跳续约机制**：
   临时服务（ephemeral=true）采用心跳续约机制来实时检测服务实例的存活状态。每个注册到Nacos的服务实例通过nacos-client定期向Nacos服务器发送心跳包，表明其仍处于活跃状态。当服务实例因故障、网络中断等原因未能按时发送心跳时，Nacos服务器会在心跳超时后将其视为下线，并从服务列表中移除，确保服务发现的实时性。

2. **Distro协议**：
   Nacos自研的AP协议Distro负责临时服务和实例数据的一致性同步。当服务实例注册、注销或状态发生变化时，这些更新通过Distro协议迅速传播至整个Nacos集群，确保各个节点上的服务列表信息保持一致。这种高效的分布式数据同步机制确保了服务发现的实时性和准确性。

3. **Raft协议**：
   对于持久化服务（ephemeral=false），其数据同步基于CP协议Raft实现。虽然Raft协议主要用于保障持久化数据的强一致性，但对于涉及持久化服务和服务实例元数据的变更，Raft协议同样能够确保这些变更在Nacos集群内实时同步，从而不影响服务发现的实时性。

4. **健康检查**：
   持久化服务由Nacos服务端进行主动健康检查。一旦检测到服务实例不健康，Nacos会立即将其状态标记为不健康，避免将流量导向有问题的节点。这种实时的健康状态监控和响应机制有助于服务发现系统及时剔除异常实例，确保服务调用方获得的是最新且可用的服务列表。

综上所述，Nacos通过心跳续约机制、Distro协议、Raft协议以及健康检查功能，多维度、全方位地保障了服务注册与发现的实时性。无论是临时服务还是持久化服务，Nacos都能够实时感知服务实例的增删、状态变化，并快速同步这些信息到整个集群，确保服务消费者能够及时获取到准确的服务列表，进行高效的服务调用。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:Nacos nacos 2.3.0 如何关闭cp模式，只保留ap的注册中心？ 
 
 *专家经验:Nacos中持久化服务和临时服务的区别 
 
 *[Open API 指南](https://nacos.io/docs/latest/guide/user/open-api)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11652)给我们反馈。
