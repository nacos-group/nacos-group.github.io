---
id: "question-history-15152"
title: "nacos 默认端口介绍 nacos-opensource"
date: "2024-06-07"
category: "expertConsultation"
description: "Nacos默认端口的介绍如下：1. **主端口 (HTTP)**: 默认为8848。此端口用于客户端、控制台以及OpenAPI的HTTP通信。客户端通过这个端口与Nacos服务端进行配置信息、服务发现等数据交互。2. **客户端gRPC请求服务端端口**: 默认为9848，即主端口+1000。这个端"
---

## 用户问题 ： 
 nacos 默认端口介绍 nacos-opensource 

---------------
## 专家官方解答 ：

Nacos默认端口的介绍如下：

1. **主端口 (HTTP)**: 默认为8848。此端口用于客户端、控制台以及OpenAPI的HTTP通信。客户端通过这个端口与Nacos服务端进行配置信息、服务发现等数据交互。

2. **客户端gRPC请求服务端端口**: 默认为9848，即主端口+1000。这个端口用于客户端通过gRPC协议向Nacos服务端发起连接和请求，增强了通信的效率和性能。

3. **服务端gRPC请求服务端端口**: 默认为9849，即主端口+1001。此端口用于Nacos服务间的数据同步和其他内部通信需求，确保集群状态的一致性。

4. **Jraft请求服务端端口**: 默认为7848，即主端口-1000。它负责处理服务端间的Raft协议相关请求，保证分布式环境下的数据一致性。

这些端口的配置可以通过Nacos的配置文件进行调整，尤其是`server.port`可以用来指定服务端的主端口，而其他端口则会根据与主端口的偏移量自动计算得出。需要注意的是，如果要修改gRPC端口与主端口的默认偏移量，通常需要借助网络设备如VIP或SLB来进行自定义的端口映射以确保客户端和服务端之间的正常通信。

关于如何指定或调整这些端口的详细信息，您可以参考Nacos官方文档提供的指南：
- [Nacos集群模式快速启动](https://nacos.io/docs/latest/guide/admin/cluster-mode-quick-start/)
- [Nacos兼容性升级指南](https://nacos.io/docs/latest/upgrading/200-compatibility/)


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：Nacos部署开放端口，集群部署开通端口 
 
 *专家经验：Nacos如何指定端口 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=15162)给我们反馈。
