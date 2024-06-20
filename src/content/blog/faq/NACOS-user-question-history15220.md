---
id: "question-history-15220"
title: "nacos需要暴露的端口都有哪些？全部列出 nacos-opensource"
date: "2024-06-12"
category: "expertConsultation"
description: "Nacos在部署时需要暴露的端口及其默认值如下：1. **主端口 (HTTP)**: 默认为8848，此端口用于客户端、控制台及OpenAPI的HTTP通信。2. **客户端gRPC端口**: 默认为主端口+1000，即9848，用于客户端通过gRPC协议向服务端发起连接和请求。3. **服务端gR"
---

## 用户问题 ： 
 nacos需要暴露的端口都有哪些？全部列出 nacos-opensource 

---------------
## 专家官方解答 ：

Nacos在部署时需要暴露的端口及其默认值如下：

1. **主端口 (HTTP)**: 默认为8848，此端口用于客户端、控制台及OpenAPI的HTTP通信。
2. **客户端gRPC端口**: 默认为主端口+1000，即9848，用于客户端通过gRPC协议向服务端发起连接和请求。
3. **服务端gRPC端口**: 默认为主端口+1001，即9849，用于服务间同步等内部通信。
4. **Jraft请求服务端端口**: 默认为主端口-1000，即7848，用于处理服务端间的Raft相关请求。

**注意**：用户主要需关注和配置的是**主端口**(`server.port`)，其他端口会根据该主端口的偏移量自动计算得出。若需调整gRPC端口与主端口的偏移关系，需借助VIP/SLB等网络设备进行端口映射，而不是直接在Nacos服务端配置偏移量。

**参考资料**: 
- [Nacos部署开放端口，集群部署开通端口](https://nacos.io/docs/latest/guide/admin/cluster-mode-quick-start/)
- [Nacos如何指定端口](https://nacos.io/docs/latest/guide/admin/cluster-mode-quick-start/)
  
以上信息基于提供的知识内容，如需进一步了解或有其他配置需求，请查阅Nacos官方文档。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：Nacos部署开放端口，集群部署开通端口 
 
 *专家经验：Nacos如何指定端口 
 
 *专家经验：主流的配置中心有哪些？ 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=15221)给我们反馈。
