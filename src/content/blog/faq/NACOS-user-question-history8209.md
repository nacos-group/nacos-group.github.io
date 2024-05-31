---
id: "question-history-8209"
title: "nacos 客户端与服务端进行grpc通信,我们服务器有特殊需要指定通信的grpc客户端 端口 ,请问有支持么 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "Nacos确实支持指定gRPC客户端通信端口的需求。根据提供的知识，这里是如何操作的具体步骤：1. **服务端端口指定**：   - Nacos服务端可以通过配置`server.port`来指定其主端口。其他端口，包括gRPC客户端所对应的端口，会根据预设的偏移量自动计算。默认情况下，gRPC客户端"
tags: ["nacos","grpc通信","服务器","指定","通信","grpc客户端","端口","支持"]
keywords: ["nacos","grpc通信","服务器","指定","通信","grpc客户端","端口","支持"]
---

Nacos确实支持指定gRPC客户端通信端口的需求。根据提供的知识，这里是如何操作的具体步骤：1. **服务端端口指定**：   - Nacos服务端可以通过配置`server.port`来指定其主端口。其他端口，包括gRPC客户端所对应的端口，会根据预设的偏移量自动计算。默认情况下，gRPC客户端
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13567)给我们反馈。
