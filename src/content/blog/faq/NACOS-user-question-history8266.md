---
id: "question-history-8266"
title: "开源版本可以支持ak sk鉴权吗？ nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "开源版本的Nacos不支持ak/sk鉴权。这是因为ak/sk作为一种云产品提供的鉴权方式，其具体的校验逻辑和实现依赖于云服务商，例如阿里云MSE。开源软件无法内置这些特定于云服务商的鉴权机制，只能由用户根据所使用的云平台来配置相应的鉴权方式。因此，Nacos开源版本不能直接支持ak/sk鉴权。对于想"
tags: ["ak sk鉴权"]
keywords: ["ak sk鉴权"]
---

开源版本的Nacos不支持ak/sk鉴权。这是因为ak/sk作为一种云产品提供的鉴权方式，其具体的校验逻辑和实现依赖于云服务商，例如阿里云MSE。开源软件无法内置这些特定于云服务商的鉴权机制，只能由用户根据所使用的云平台来配置相应的鉴权方式。因此，Nacos开源版本不能直接支持ak/sk鉴权。

对于想要在Nacos中实施鉴权的用户，Nacos提供了自己的鉴权体系，可以通过配置参数来开启。具体而言，你需要配置`nacos.core.auth.enabled`来开启鉴权功能，并设置其他相关参数如`nacos.core.auth.plugin.nacos.token.secret.key`等以配置鉴权的详细行为。这些配置适用于无论是Kubernetes（k8s）部署、Docker部署还是直接使用发行包部署的各种场景。详细的配置方法和参数说明，可以参考Nacos官方文档：[Nacos鉴权文档](https://nacos.io/docs/latest/guide/user/auth/)。

总结来说，虽然Nacos开源版不支持ak/sk鉴权，但用户仍可通过Nacos内置的鉴权机制来实现安全控制。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13614)给我们反馈。
