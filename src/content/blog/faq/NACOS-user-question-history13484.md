---
id: "question-history-13484"
title: "nacos9848端口干嘛的 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "Nacos的9848端口是专门用于客户端gRPC请求服务端的端口。这意味着，当Nacos客户端需要通过gRPC协议与Nacos服务端进行通信时，它会连接到这个端口发起请求和服务订阅等操作。此端口默认是在Nacos服务端的主端口（通常是8848）基础上加上1000的偏移量得到的。### 原因分析：根据"
tags: ["nacos9848端口","干嘛的"]
keywords: ["nacos9848端口","干嘛的"]
---

Nacos的9848端口是专门用于客户端gRPC请求服务端的端口。这意味着，当Nacos客户端需要通过gRPC协议与Nacos服务端进行通信时，它会连接到这个端口发起请求和服务订阅等操作。此端口默认是在Nacos服务端的主端口（通常是8848）基础上加上1000的偏移量得到的。

### 原因分析：
根据提供的知识内容，Nacos设计了几个关键端口以支持其服务发现和配置管理功能，其中9848端口就是其中之一，它服务于客户端到服务端的gRPC通信需求，这是为了实现更高效的数据传输和低延迟的服务发现机制。

### 端口用途总结：
- **端口9848**：Nacos客户端通过此端口与服务端建立gRPC连接，进行高效的数据交换和服务发现请求。

### 注意事项：
- 如果有特殊需求需修改gRPC端口，默认情况下不直接支持修改gRPC客户端端口相对于主端口的偏移量，但可以通过网络设备如VIP/SLB来进行端口映射以满足特定部署环境的要求。
- 客户端可以自定义其访问gRPC服务的端口偏移量，但需要确保服务端通过正确的网络配置（如VIP/SLB端口映射）来适应这种非默认配置，避免通信失败。

### 相关文档链接：
- Nacos部署与配置文档：[Nacos部署指南](https://nacos.io/docs/latest/guide/admin/cluster-mode-quick-start/)
- 兼容性与升级说明：[Nacos兼容性与升级指南](https://nacos.io/docs/latest/upgrading/200-compatibility/)
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13909)给我们反馈。
