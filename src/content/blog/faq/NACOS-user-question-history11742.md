---
id: "question-history-11742"
title: "开防火墙时nacos要开哪些端口？ nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "在为Nacos配置防火墙时，需要开放以下端口以确保其正常运行和服务发现、配置管理等功能不受影响：1. **主HTTP端口**（默认8848）：这是Nacos客户端、控制台以及OpenAPI使用的端口，用于处理HTTP请求。2. **客户端gRPC端口**（默认9848）：用于客户端通过gRPC协议向"
tags: ["防火墙","端口"]
keywords: ["防火墙","端口"]
---

在为Nacos配置防火墙时，需要开放以下端口以确保其正常运行和服务发现、配置管理等功能不受影响：

1. **主HTTP端口**（默认8848）：这是Nacos客户端、控制台以及OpenAPI使用的端口，用于处理HTTP请求。
2. **客户端gRPC端口**（默认9848）：用于客户端通过gRPC协议向服务端发起连接和请求。
3. **服务端gRPC端口**（默认9849）：虽然主要用于服务间同步，但在某些场景下可能也需要此端口开放。
4. **Jraft请求服务端端口**（默认7848）：用于处理服务端间的Raft相关请求，确保集群的一致性。

通常情况下，**至少需要开放8848和9848端口**。如果Nacos部署为集群模式或有特定需求，可能还需要考虑开放9849和7848端口。

请注意，如果在客户端或服务端设置了非默认的gRPC端口偏移量，确保相应的自定义端口也在防火墙中正确配置并开放。特别是当客户端指定了不同的gRPC端口偏移量时，确保VIP/SLB等网络设备进行了正确的端口映射。

参考链接：
- [Nacos部署开放端口说明](https://nacos.io/docs/latest/guide/admin/cluster-mode-quick-start/)
- [Nacos端口指定说明](https://nacos.io/docs/latest/guide/admin/cluster-mode-quick-start/)
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13779)给我们反馈。
