---
id: "question-history-13484"
title: "nacos9848端口干嘛的 nacos-opensource"
date: "2024-05-14"
category: expertConsultation
description: "nacos-opensource nacos9848端口干嘛的"
tags: ["nacos9848端口","干嘛的"]
keywords: ["nacos9848端口","干嘛的"]
---

## 用户问题 ： 
 nacos9848端口干嘛的 nacos-opensource 

---------------
## 专家官方解答 ：

Nacos的9848端口主要用于客户端gRPC请求服务端，即客户端通过此端口向Nacos服务端发起连接和数据请求。这是Nacos服务发现和配置管理功能中的一个关键通信端口，确保了客户端与服务端之间的高效数据交换。此端口是基于gRPC协议，相较于HTTP提供了更高效的通信方式，特别适用于需要低延迟和高吞吐量的场景。

根据Nacos的配置规范，该端口是通过主端口（默认8848）加上固定的偏移量1000来自动计算得到的。如果需要调整此端口或进行特定的网络配置，可以通过VIP/SLB等网络设备进行端口映射以满足特定环境的需求。但请注意，直接在Nacos服务端更改gRPC端口的偏移量配置并不直接支持，需要依赖外部网络配置来实现端口的重定向。

因此，当提到Nacos的9848端口时，其主要功能和用途在于支撑客户端到服务端的gRPC通信，是Nacos集群部署和客户端交互中的一个基础组件。[[了解更多关于Nacos端口配置与使用的详细信息请点击这里](https://nacos.io/docs/latest/guide/admin/cluster-mode-quick-start/) 和 [这里](https://nacos.io/docs/latest/upgrading/200-compatibility/)。]


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:Nacos部署开放端口，集群部署开通端口 
 
 *专家经验:Nacos如何指定端口 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13497)给我们反馈。
