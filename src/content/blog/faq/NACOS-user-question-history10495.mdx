---
id: "question-history-10495"
title: "#Nacos的自动健康检查是如何工作的？ nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource #Nacos的自动健康检查是如何工作的？"
tags: ["自动健康检查","工作原理"]
keywords: ["自动健康检查","工作原理"]
---

## 用户问题 ： 
 #Nacos的自动健康检查是如何工作的？ nacos-opensource 

---------------
## 专家官方解答 ：

Nacos的自动健康检查工作原理如下：

首先，Nacos作为服务发现与配置管理平台，其自动健康检查机制主要用于监控服务实例的运行状态，确保服务调用方能够准确地访问到可用的服务实例。这一过程主要涉及以下几个方面：

1. **服务实例上报心跳**：
   - 当服务实例启动并接入Nacos后，会按照预设的时间间隔向Nacos服务器发送心跳（health check）请求。这通常通过在服务端代码中集成Nacos客户端实现，客户端会定时发送心跳包，表明该服务实例处于活跃状态。

2. **Nacos服务器处理心跳**：
   - Nacos服务器接收到心跳请求后，更新对应服务实例的最后心跳时间戳，表明该实例仍在正常运行。此外，Nacos服务器可能会记录其他与实例健康状态相关的指标，如响应时间、CPU使用率等，具体取决于配置和实现。

3. **健康阈值设定与判断**：
   - Nacos允许用户配置健康检查的超时时间和阈值。若服务实例超过预设的心跳间隔仍未发送心跳，Nacos将认定该实例为不健康（unhealthy）。同样，如果实例上报的其他健康指标超出预设阈值，也可能被标记为不健康。

4. **实例列表维护与更新**：
   - 基于上述健康检查结果，Nacos动态维护服务实例列表，包括健康与不健康实例。当客户端请求服务列表时，Nacos默认返回健康实例列表，确保服务调用方能访问到稳定可用的服务。同时，对于不健康实例，Nacos可能触发告警通知或执行相应的容错策略，如剔除不健康实例、触发服务重启等。

5. **API与Actuator支持**：
   - Nacos通过API（如`selectInstances`方法）允许用户查询健康或不健康实例列表，便于运维人员了解服务集群的整体健康状况。另外，对于Spring Boot应用集成Nacos的情况，可通过Spring Actuator暴露的管理端点（如`management.endpoint.nacos-discovery.enabled`和`management.endpoint.nacos-config.enabled`）关闭特定服务（如nacos-discovery、nacos-config）的健康检查功能，但这并非关闭Nacos本身的自动健康检查机制，而是针对Spring Boot应用与Nacos交互时的相关健康检查行为。

综上所述，Nacos的自动健康检查通过服务实例定期上报心跳、Nacos服务器处理心跳并依据预设阈值判断实例健康状态、动态维护实例列表以及提供API和Actuator支持，共同实现了对服务实例健康状况的实时监控与管理。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:Nacos 麻烦咨询下 spring actuator 如何关闭 nacosconfig 的健康检查 ？ 
 
 *[Java SDK](https://nacos.io/docs/latest/guide/user/sdk)
 
 *专家经验:Nacos nacos 2.3.0 如何关闭cp模式，只保留ap的注册中心？ 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11655)给我们反馈。
