---
id: "question-history-8230"
title: "服务端的udp发送和客户端的定时更新的时间问题。A调用B， B下线后。A的本地缓存还没变更，nacos也没 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "首先，根据提供的知识内容，我们可以分析该问题的原因如下：1. **UDP不可靠性**：Nacos 1.x版本中使用UDP协议进行服务变更的推送，UDP协议本身具有不可靠性，可能导致客户端未接收到服务下线的通知。2. **客户端本地缓存**：即使Nacos-Client收到了服务变更通知，客户端（如A"
tags: ["udp发送","客户端","定时更新","时间问题","A调用B","B下线","本地缓存","变更","主动通知","Client端","接收","报错","解决方案"]
keywords: ["udp发送","客户端","定时更新","时间问题","A调用B","B下线","本地缓存","变更","主动通知","Client端","接收","报错","解决方案"]
---

首先，根据提供的知识内容，我们可以分析该问题的原因如下：1. **UDP不可靠性**：Nacos 1.x版本中使用UDP协议进行服务变更的推送，UDP协议本身具有不可靠性，可能导致客户端未接收到服务下线的通知。2. **客户端本地缓存**：即使Nacos-Client收到了服务变更通知，客户端（如A
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13582)给我们反馈。
