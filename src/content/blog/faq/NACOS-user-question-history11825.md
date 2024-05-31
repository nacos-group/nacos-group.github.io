---
id: "question-history-11825"
title: "nacos 为什么要关闭双写？ nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "在Nacos集群升级完成后，关闭双写的主要原因是为了解除因双写机制带来的性能约束，从而提升系统运行效率。双写机制原本是为了确保数据在升级过程中的一致性，即在新旧两个版本的数据存储之间同时写入数据，确保双方数据同步。这一过程虽然增强了数据可靠性，但是也消耗了额外的系统资源，尤其是在写操作频繁的场景下，"
tags: ["双写"]
keywords: ["双写"]
---

在Nacos集群升级完成后，关闭双写的主要原因是为了解除因双写机制带来的性能约束，从而提升系统运行效率。双写机制原本是为了确保数据在升级过程中的一致性，即在新旧两个版本的数据存储之间同时写入数据，确保双方数据同步。这一过程虽然增强了数据可靠性，但是也消耗了额外的系统资源，尤其是在写操作频繁的场景下，可能会影响到服务的响应速度和处理能力。

根据 我了解的知识 中提供的信息，关闭双写的操作可以通过执行以下API调用来实现：

```shell
curl -X PUT 'localhost:8848/nacos/v1/ns/operator/switches?entry=doubleWriteEnabled&value=false'
```

执行此操作后，观察`logs/naming-server.log`日志，若出现`Disable Double write, stop and clean v1.x cache and features`的日志信息，表明双写功能已被成功关闭。

需要注意的是，关闭双写是一个不可逆的操作，一旦执行，在未进行再次配置之前，将无法平滑地回退到旧版本或者更低级别的数据一致性模式。因此，在执行此操作前，必须确保集群处于正常且稳定运行的状态，并且已经过充分的验证，确认关闭双写不会对现有业务造成负面影响。

总之，关闭双写是性能优化的一个策略，旨在提升Nacos集群在生产环境中的运行效率，但需谨慎操作，确保业务连续性和数据一致性不受影响。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13812)给我们反馈。
