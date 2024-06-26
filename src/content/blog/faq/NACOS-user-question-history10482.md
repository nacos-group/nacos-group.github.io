---
id: "question-history-10482"
title: "#什么是nacos nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "Nacos是阿里巴巴开源的一个动态服务发现、配置管理和服务管理平台，特别设计用于简化云原生应用的构建与管理。Nacos的核心特性包括：1. **服务发现与健康检查**：Nacos支持DNS与RPC方式的服务发现机制，能够自动发现、路由及负载均衡微服务。它通过健康检查机制监控服务实例状态，确保只将请求"
tags: ["什么是nacos"]
keywords: ["什么是nacos"]
---

## 用户问题 ： 
 #什么是nacos nacos-opensource 

---------------
## 专家官方解答 ：

Nacos是阿里巴巴开源的一个动态服务发现、配置管理和服务管理平台，特别设计用于简化云原生应用的构建与管理。Nacos的核心特性包括：

1. **服务发现与健康检查**：Nacos支持DNS与RPC方式的服务发现机制，能够自动发现、路由及负载均衡微服务。它通过健康检查机制监控服务实例状态，确保只将请求转发给健康的实例。

2. **动态配置服务**：提供了一个集中式的外部化配置存储，允许你在Nacos中集中管理应用的配置，应用可以在运行时动态获取或更新这些配置。配置变更时，Nacos能实时推送到相关应用。

3. **动态DNS服务**：具备动态DNS服务功能，支持权重路由，为流量管理如蓝绿部署、灰度发布、流量镜像等场景提供灵活性。

4. **服务与元数据管理**：强大的服务和元数据管理能力，方便进行微服务及其相关信息的维护。

Nacos旨在提升微服务平台的构建、部署与运维效率，不仅适用于云端环境，也适合传统数据中心。关于Nacos的部署，它默认开放四个端口以支持其功能，其中最重要的是客户端、控制台及OpenAPI使用的HTTP端口8848，以及客户端gRPC请求服务端端口9848。在集群部署时，通常只需对外暴露这两个端口即可。

更多详细信息与操作指引，可以参考Nacos官方文档的[集群模式快速启动](https://nacos.io/docs/latest/guide/admin/cluster-mode-quick-start/)和[兼容性说明](https://nacos.io/docs/latest/upgrading/200-compatibility/)部分。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：Nacos和Eureka的区别是什么？ 
 
 *专家经验：Nacos 介绍 
 
 *专家经验：Nacos部署开放端口，集群部署开通端口 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13679)给我们反馈。
