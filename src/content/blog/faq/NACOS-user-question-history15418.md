---
id: "question-history-15418"
title: "nacos默认需要放开哪几个端口号 nacos-opensource"
date: "2024-06-17"
category: "expertConsultation"
description: "Nacos默认需要放开以下四个端口号：1. **8848**：这是Nacos服务的主端口，用于客户端、控制台以及OpenAPI的HTTP通信。2. **9848**：客户端gRPC请求服务端的端口，客户端通过此端口向Nacos服务端发起连接和请求。3. **9849**：服务端gRPC请求服务端的端"
---

## 用户问题 ： 
 nacos默认需要放开哪几个端口号 nacos-opensource 

---------------
## 专家官方解答 ：

Nacos默认需要放开以下四个端口号：

1. **8848**：这是Nacos服务的主端口，用于客户端、控制台以及OpenAPI的HTTP通信。
2. **9848**：客户端gRPC请求服务端的端口，客户端通过此端口向Nacos服务端发起连接和请求。
3. **9849**：服务端gRPC请求服务端的端口，主要用于服务间的同步等操作。
4. **7848**：Jraft请求服务端的端口，用于处理服务端之间的Raft相关请求。

这些端口是基于Nacos服务端的主端口（默认8848）并通过固定的偏移量计算得出。通常情况下，只需公开主端口（8848）和服务端gRPC端口（9848）即可满足大多数场景下的网络配置需求，尤其是在使用VIP或负载均衡器的情况下。

关于Nacos端口的配置和指定，可以参考Nacos官方文档提供的详细信息：
- [Nacos部署文档](https://nacos.io/docs/latest/guide/admin/cluster-mode-quick-start/)
- [Nacos兼容性与升级指南](https://nacos.io/docs/latest/upgrading/200-compatibility/)

此外，对于客户端想要自定义gRPC端口偏移量的情况，可以通过设置JVM参数`-D nacos.server.grpc.port.offset`来实现，但需要注意确保服务端通过VIP/SLB正确映射相应的端口以避免访问问题。

关于Nacos版本的选择，推荐使用最新的2.X稳定版本，具体版本信息可从以下链接获取：
- [Nacos官网下载页面](https://nacos.io/download/nacos-server/)
- [GitHub Release页面](https://github.com/alibaba/nacos/releases)

请根据实际部署环境和需求，参照上述信息进行端口配置与版本选择。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：Nacos部署开放端口，集群部署开通端口 
 
 *专家经验：Nacos如何指定端口 
 
 *专家经验：nacos哪个版本最常用 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=15488)给我们反馈。
