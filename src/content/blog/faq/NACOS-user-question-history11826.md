---
id: "question-history-11826"
title: "nacos 怎么关闭双写？ nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "要关闭Nacos的双写功能，您可以按照以下步骤操作：1. **确认集群状态**：在执行关闭操作前，请确保您的Nacos集群正在正常运行，并且已经过一段时间的稳定观察，确认无误。2. **执行关闭命令**：使用curl命令通过API来关闭双写功能。具体命令为：   ```shell   curl -X"
tags: ["双写","关闭"]
keywords: ["双写","关闭"]
---

要关闭Nacos的双写功能，您可以按照以下步骤操作：

1. **确认集群状态**：在执行关闭操作前，请确保您的Nacos集群正在正常运行，并且已经过一段时间的稳定观察，确认无误。

2. **执行关闭命令**：使用curl命令通过API来关闭双写功能。具体命令为：
   ```shell
   curl -X PUT 'localhost:8848/nacos/v1/ns/operator/switches?entry=doubleWriteEnabled&value=false'
   ```
   这里`localhost:8848`是Nacos服务器的地址和端口，如果您的Nacos部署在其他地址或端口，请相应修改。

3. **验证关闭结果**：关闭操作成功后，您可以在Nacos的日志文件，通常是`logs/naming-server.log`中查找类似`Disable Double write, stop and clean v1.x cache and features`的日志条目，这表明双写功能已经被成功关闭。

**重要提醒**：关闭双写后，系统将不再进行数据的双写备份，这意味着在追求性能提升的同时，您可能会失去一部分数据冗余带来的安全性。此外，一旦关闭，将无法平滑降级回之前的配置状态，请在执行此操作前做好充分的考量和备份。

根据提供的知识内容，没有其他参考内容与此问题直接关联，因此以上步骤已涵盖关闭Nacos双写的全部必要信息。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13813)给我们反馈。
