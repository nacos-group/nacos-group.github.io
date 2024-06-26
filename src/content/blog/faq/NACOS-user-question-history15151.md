---
id: "question-history-15151"
title: "nacos 端口介绍 nacos-opensource"
date: "2024-06-07"
category: "expertConsultation"
description: "关于Nacos端口的介绍，根据提供的知识内容，可以详细解析如下：### Nacos默认及重要端口说明Nacos服务端暴露的主要端口及其用途包括：1. **主端口 (默认8848)**: 这是Nacos客户端、控制台以及OpenAPI所使用的HTTP端口，用于配置管理、服务发现的HTTP请求。2. *"
---

## 用户问题 ： 
 nacos 端口介绍 nacos-opensource 

---------------
## 专家官方解答 ：

关于Nacos端口的介绍，根据提供的知识内容，可以详细解析如下：

### Nacos默认及重要端口说明

Nacos服务端暴露的主要端口及其用途包括：

1. **主端口 (默认8848)**: 这是Nacos客户端、控制台以及OpenAPI所使用的HTTP端口，用于配置管理、服务发现的HTTP请求。

2. **gRPC客户端请求服务端端口 (默认9848)**: 即主端口+1000偏移量，用于客户端通过gRPC协议向Nacos服务端发起连接和请求。

3. **服务端gRPC请求服务端端口 (默认9849)**: 即主端口+1001偏移量，用于服务间的同步和其他内部通信。

4. **Jraft请求服务端端口 (默认7848)**: 即主端口-1000偏移量，用于处理服务端间的Raft一致性算法相关的请求。

### 如何指定与调整端口

- **服务端端口指定**: 通过配置`server.port`来设定Nacos服务端的主端口，其他端口会依据上述偏移量自动计算得出。

- **客户端gRPC端口偏移量调整**: 客户端可以通过JVM参数`-D nacos.server.grpc.port.offset`来自定义gRPC端口相对于主端口的偏移量。例如，若设置偏移量为5000，则客户端gRPC端口会在主端口基础上增加5000。需要注意的是，如果客户端偏移量非默认值，服务端需通过VIP/SLB正确映射端口，以确保客户端能成功访问。

### 网络设备端口映射注意事项

- 对于需要通过VIP或网络负载均衡器(NLB/SLB)暴露Nacos服务的情况，通常只需映射主端口(默认8848)和客户端gRPC端口(默认9848)。如果客户端使用了非默认的gRPC偏移量，还需确保相应的gRPC端口也被正确映射。

### 链接引用

- Nacos官方部署与集群模式快速启动文档: [Nacos集群部署指南](https://nacos.io/docs/latest/guide/admin/cluster-mode-quick-start/)
- Nacos兼容性与升级说明: [Nacos兼容性与升级指南](https://nacos.io/docs/latest/upgrading/200-compatibility/)

综上所述，Nacos通过灵活的端口配置与自动偏移量计算机制，支持了多样化的部署需求，同时也强调了在网络配置上的注意事项，以确保服务间的正常通信。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：Nacos部署开放端口，集群部署开通端口 
 
 *专家经验：Nacos如何指定端口 
 
 *专家经验：Nacos 介绍 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=15161)给我们反馈。
