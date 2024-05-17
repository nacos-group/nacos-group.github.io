---
id: "question-history-11436"
title: "为什么使用Nacos而不是Eureka nacos-opensource"
date: "2024-04-24"
category: expertConsultation
description: "nacos-opensource 为什么使用Nacos而不是Eureka"
tags: ["Nacos","Eureka"]
keywords: ["Nacos","Eureka"]
---

## 用户问题 ： 
 为什么使用Nacos而不是Eureka nacos-opensource 

---------------
## 专家官方解答 ：

使用Nacos而不是Eureka的原因主要体现在以下几个方面：

1. **功能全面性**：Nacos不仅提供服务发现与注册的基本功能，还集成了配置管理和消息总线等增值服务。这意味着使用Nacos可以一站式解决服务治理中的多种需求，简化系统架构，降低集成复杂度。相比之下，Eureka仅专注于服务注册与发现，对于其他如配置管理的需求需额外引入其他组件，增加了系统的组件数量和维护成本。

2. **高可靠性和可用性**：Nacos支持配置多个注册中心，这种集群部署方式显著提升了服务的可靠性，即使某个节点出现故障，服务仍能保持正常运行。而Eureka依赖单一服务注册中心，其可用性受限于该中心的稳定性。在对服务连续性有较高要求的场景中，Nacos的多节点部署特性更具优势。

3. **多数据中心支持**：Nacos原生支持多数据中心场景下的服务注册与发现，能够更好地适应分布式、跨地域的大型系统架构。反观Eureka，处理多数据中心情况通常需要借助第三方工具或进行定制开发，增加了部署和运维难度。

4. **轻量化与高性能设计**：Nacos选择直接使用JDBC+连接池访问数据库，避免引入ORM或JPA框架，从而保持组件的轻量化并提升性能。这样的设计有助于减少不必要的资源消耗，确保在大规模、高并发场景下依然能高效稳定地运行。相比之下，Eureka若采用ORM框架可能导致部署包增大、性能下降等问题。

综上所述，选择Nacos而非Eureka，主要是考虑到Nacos在功能全面性、高可靠可用性、多数据中心支持以及轻量化高性能设计等方面的显著优势。这些特性使Nacos更适合应用于复杂的分布式架构，尤其在需要一体化服务治理解决方案、追求高可用性以及对性能有严格要求的场景中，Nacos无疑是更优的选择。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:Nacos和Eureka的区别是什么？ 
 
 *专家经验:为什么Nacos不使用ORM框架访问数据库 
 
 *专家经验:Nacos 介绍 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11720)给我们反馈。
