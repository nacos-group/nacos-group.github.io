---
id: "question-history-8280"
title: "docker部署nacos集群nginx负载均衡，服务注册正常，但是grpc报错 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "首先，根据提供的知识内容，我们分析问题原因可能是由于Nacos集群通过Docker部署并使用Nginx做负载均衡时，gRPC通信遇到了障碍。gRPC报错通常涉及到网络配置、端口映射或负载均衡配置不当。Nacos在集群模式下使用gRPC通信的端口为9848（客户端gRPC请求服务端端口）和9849（服"
tags: ["docker","nacos集群","nginx","负载均衡","服务注册","grpc","报错"]
keywords: ["docker","nacos集群","nginx","负载均衡","服务注册","grpc","报错"]
---

首先，根据提供的知识内容，我们分析问题原因可能是由于Nacos集群通过Docker部署并使用Nginx做负载均衡时，gRPC通信遇到了障碍。gRPC报错通常涉及到网络配置、端口映射或负载均衡配置不当。Nacos在集群模式下使用gRPC通信的端口为9848（客户端gRPC请求服务端端口）和9849（服
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13626)给我们反馈。
