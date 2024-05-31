---
id: "question-history-11018"
title: "Nacos 你们有遇到服务掉线吗   实际服务正常再跑  注册中心上没了 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "当遇到Nacos服务掉线，而实际服务仍在正常运行，但在注册中心不可见的情况，可以从以下几个方面进行分析与解决：1. **检查Nacos Client版本**：   - 首先确认当前使用的Nacos Client版本是否为1.4.1，因为该版本存在一个关于域名解析失败后停止心跳线程的BUG。如果确认为"
tags: ["服务掉线","注册中心"]
keywords: ["服务掉线","注册中心"]
---

当遇到Nacos服务掉线，而实际服务仍在正常运行，但在注册中心不可见的情况，可以从以下几个方面进行分析与解决：1. **检查Nacos Client版本**：   - 首先确认当前使用的Nacos Client版本是否为1.4.1，因为该版本存在一个关于域名解析失败后停止心跳线程的BUG。如果确认为
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13707)给我们反馈。
