---
id: "question-history-11032"
title: "Nacos raft日志太大怎么清理 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "Nacos raft日志过大的问题主要原因是Nacos使用了Sofa的JRaft作为Raft协议的实现，其依赖的RocksDB存储系统在长时间运行后，会在`$nacos.home/data/protocol/raft/$raft_group/log`路径下生成大量以`LOG.*`开头的操作日志文件。"
tags: ["raft","日志","清理"]
keywords: ["raft","日志","清理"]
---

Nacos raft日志过大的问题主要原因是Nacos使用了Sofa的JRaft作为Raft协议的实现，其依赖的RocksDB存储系统在长时间运行后，会在`$nacos.home/data/protocol/raft/$raft_group/log`路径下生成大量以`LOG.*`开头的操作日志文件。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13721)给我们反馈。
