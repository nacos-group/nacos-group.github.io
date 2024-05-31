---
id: "question-history-8240"
title: "Nacos Pod takes up a lot of memory cache. As the serv nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "针对Nacos Pod内存缓存占用过大的问题，主要从以下几个方面分析与解决：1. **检查JVM堆内存设置**：依据问题描述，随着Nacos Pod运行时间增长，内存缓存（RSS内存）持续增加，首先应检查Nacos的JVM堆内存配置是否合理。根据推荐实践，JVM堆内存不应超过物理内存的70%。请确保"
tags: ["Nacos","Pod","memory cache","service life","RSS memory"]
keywords: ["Nacos","Pod","memory cache","service life","RSS memory"]
---

针对Nacos Pod内存缓存占用过大的问题，主要从以下几个方面分析与解决：1. **检查JVM堆内存设置**：依据问题描述，随着Nacos Pod运行时间增长，内存缓存（RSS内存）持续增加，首先应检查Nacos的JVM堆内存配置是否合理。根据推荐实践，JVM堆内存不应超过物理内存的70%。请确保
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13591)给我们反馈。
