---
id: "question-history-8183"
title: "Nacos部署开放端口，集群部署开通端口 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "Nacos部署时涉及的开放端口及其配置方法如下：1. **主要端口及其用途**:   - **8848**: 主端口，用于客户端、控制台及OpenAPI的HTTP通信。   - **9848**: 客户端gRPC请求服务端端口，客户端通过此端口与服务端建立gRPC连接。   - **9849**: "
tags: ["Nacos","部署","开放端口","集群部署","开通端口"]
keywords: ["Nacos","部署","开放端口","集群部署","开通端口"]
---

Nacos部署时涉及的开放端口及其配置方法如下：

1. **主要端口及其用途**:
   - **8848**: 主端口，用于客户端、控制台及OpenAPI的HTTP通信。
   - **9848**: 客户端gRPC请求服务端端口，客户端通过此端口与服务端建立gRPC连接。
   - **9849**: 服务端gRPC请求服务端端口，用于服务间内部通信和同步。
   - **7848**: Jraft请求服务端端口，处理服务端间的Raft协议相关请求。

2. **端口配置**:
   - **服务端主端口配置**: 通过`server.port`属性指定服务端的主端口，如需更改默认的8848端口，可在配置文件中设置此属性。
   - **客户端gRPC端口偏移**: gRPC客户端端口默认为主端口加1000（即9848），服务端不直接支持修改此偏移量。若需调整，需借助VIP/SLB等网络设备进行端口映射。
   - **客户端端口指定**: 客户端连接时，通过`serverAddr`指定服务端地址和主端口，如`nacos_host:8848`。客户端gRPC端口可通过JVM参数`-D nacos.server.grpc.port.offset`自定义偏移量，例如设置为5000，则gRPC端口变为主端口+5000。

3. **集群部署端口考虑**:
   - 在集群部署场景下，确保每个节点的主端口配置一致，其他端口会根据主端口自动计算得出。
   - 若需通过网络设备公开服务，通常只需映射主端口（8848）和服务间通信的gRPC端口（9848）。

4. **注意事项**:
   - 修改客户端gRPC端口偏移量时，确保服务端已通过VIP/SLB正确映射相应端口，以避免通信失败。
   - 集群部署时，考虑是否根据业务规模和隔离需求将配置中心与注册中心分开部署或合并部署。

参考文档：
- [Nacos部署文档](https://nacos.io/docs/latest/guide/admin/cluster-mode-quick-start/)
- [Nacos兼容性与升级指导](https://nacos.io/docs/latest/upgrading/200-compatibility/)
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13543)给我们反馈。
