---
id: "question-history-10495"
title: "#Nacos的自动健康检查是如何工作的？ nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "Nacos的自动健康检查主要是通过Spring Actuator与Nacos客户端集成来实现的。当您的应用集成了Nacos作为配置中心（通过`nacos-spring-boot-starter`或`spring-cloud-alibaba-nacos-config`）或服务发现（通过`nacos-s"
tags: ["Nacos","自动健康检查","工作原理"]
keywords: ["Nacos","自动健康检查","工作原理"]
---

## 用户问题 ： 
 #Nacos的自动健康检查是如何工作的？ nacos-opensource 

---------------
## 专家官方解答 ：

Nacos的自动健康检查主要是通过Spring Actuator与Nacos客户端集成来实现的。当您的应用集成了Nacos作为配置中心（通过`nacos-spring-boot-starter`或`spring-cloud-alibaba-nacos-config`）或服务发现（通过`nacos-spring-boot-starter`或`spring-cloud-alibaba-nacos-discovery`）时，健康检查功能会默认启用。

### 工作原理简述：

1. **集成Spring Actuator**：Spring Actuator为应用提供了生产级别的监控端点，其中包括健康检查端点（默认为`/actuator/health`）。当请求到达此端点时，Spring Boot应用会检查所有注册的健康检查指示器（Indicator）。

2. **Nacos健康检查端点**：对于集成Nacos的Spring Boot应用，会有特定的健康检查端点，比如`nacos-config`和`nacos-discovery`。这些端点负责检查Nacos相关的健康状态，比如是否能正常从Nacos服务器获取配置、注册服务是否正常等。

3. **检查逻辑**：Nacos客户端会根据配置定期向Nacos服务器发送心跳，同时监测配置更新和服务发现的可用性。健康检查过程中，会验证这些通信是否顺畅，以及配置是否能正确加载等。

4. **返回健康状态**：基于检查结果，这些端点会报告应用的健康状态。如果一切正常，健康检查结果将显示为“UP”；如果有问题，则显示为“DOWN”。

### 如何控制健康检查：

虽然默认情况下健康检查是开启的，但您可以通过配置来关闭这些检查。如前所述，如果您使用的是`spring-cloud-alibaba-nacos-discovery`或`spring-cloud-alibaba-nacos-config`，可以通过以下配置来禁用健康检查：
```properties
# 关闭nacos discovery的健康检查
management.endpoint.nacos-discovery.enabled=false
# 关闭nacos config的健康检查
management.endpoint.nacos-config.enabled=false
```
通过设置这些属性为`false`，可以阻止Spring Actuator在健康检查时考虑Nacos相关的健康指标。

### 总结：
Nacos的自动健康检查机制是通过Spring Actuator框架集成实现的，它监控Nacos客户端与服务器之间的通信状况以及配置管理的健康性。用户可根据需要调整健康检查策略，以适应不同的运维需求。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：Nacos 麻烦咨询下 spring actuator 如何关闭 nacosconfig 的健康检查 ？ 
 
 *[Java SDK](https://nacos.io/docs/latest/guide/user/sdk)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13692)给我们反馈。
