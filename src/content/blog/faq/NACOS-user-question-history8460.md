---
id: "question-history-8460"
title: "nacos v2.2.3版本，k8s 微服务注册nacos，强制删除 pod, nacos注册实例不会消失，一直显示健康。跪求大佬帮忙看看！ nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "根据您的描述和提供的知识内容，问题的原因可能在于Nacos中注册的实例为非持久化服务，这类服务依赖客户端心跳保持活跃状态。当您在Kubernetes (k8s) 环境下强制删除Pod后，若Pod内的服务进程没有正确终止，或者存在某些情况下服务实例的心跳机制仍在运行，Nacos服务端会继续收到心跳信号"
tags: ["nacos","v2.2.3","k8s","微服务","注册","nacos","强制删除","pod","注册实例","不会消失","一直显示健康"]
keywords: ["nacos","v2.2.3","k8s","微服务","注册","nacos","强制删除","pod","注册实例","不会消失","一直显示健康"]
---

根据您的描述和提供的知识内容，问题的原因可能在于Nacos中注册的实例为非持久化服务，这类服务依赖客户端心跳保持活跃状态。当您在Kubernetes (k8s) 环境下强制删除Pod后，若Pod内的服务进程没有正确终止，或者存在某些情况下服务实例的心跳机制仍在运行，Nacos服务端会继续收到心跳信号
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13677)给我们反馈。
