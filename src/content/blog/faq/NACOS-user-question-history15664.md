---
id: "question-history-15664"
title: "Nacos application.properties如何配置 nacos actuator healt nacos-opensource"
date: "2024-06-18"
category: "expertConsultation"
description: "要配置Nacos的`/nacos/actuator/health`访问端口，首先需要明确一点，Nacos使用Spring Boot Actuator来暴露健康检查等端点信息。因此，配置健康检查端点的访问实际上涉及到Spring Boot Actuator的配置，而非直接修改Nacos特定的端口配置。"
---

## 用户问题 ： 
 Nacos application.properties如何配置 nacos actuator health访问端口 nacos-opensource 

---------------
## 专家官方解答 ：

要配置Nacos的`/nacos/actuator/health`访问端口，首先需要明确一点，Nacos使用Spring Boot Actuator来暴露健康检查等端点信息。因此，配置健康检查端点的访问实际上涉及到Spring Boot Actuator的配置，而非直接修改Nacos特定的端口配置。根据提供的知识内容，我们可以按照以下步骤操作：

### 分析问题原因

Nacos本身不直接控制 `/nacos/actuator/health` 这个路径的端口，这个路径属于Spring Actuator框架的一部分，它暴露了应用的健康状况信息。默认情况下，Spring Boot应用的所有Actuator端点（包括健康检查）都监听在应用的主端口上，这个端口通常由`server.port`配置项决定。

### 配置步骤

1. **开启健康检查端点**  
   默认情况下，健康检查端点（health）通常是开启的，但确保它已被正确暴露，可以在`conf/application.properties`中添加或确认以下配置：
   ```properties
   management.endpoints.web.exposure.include=health
   ```
   这行配置表示将`health`端点包含在Web暴露的端点列表中。

2. **指定Nacos服务端口**  
   虽然这不是直接改变健康检查端口，但你可以通过调整Nacos服务端的主端口间接影响访问路径，因为Actuator端点会运行在这个主端口上。在`conf/application.properties`中设置：
   ```properties
   server.port=8848 # 举例，你可以根据需要设置为你希望的端口
   ```

3. **确保访问权限**  
   如果你的Nacos实例需要对Actuator端点进行鉴权，参照知识中的说明，可以通过Spring Security来实现。但请注意，这不会改变端口，而是控制谁能访问这些端点。

### 解释

- 通过上述步骤，我们实际上是通过配置管理端点的暴露和指定Nacos服务的主端口来间接管理健康检查端口的访问。因为Nacos的Actuator端点（包括`/health`）是基于Spring Boot Actuator实现的，它们共享Nacos服务的应用服务器端口。
- 如果有特定需求，如仅暴露健康检查而隐藏其他Actuator端点，可以精确配置`management.endpoints.web.exposure.include`来达到目的。
- 修改端口或暴露设置后，记得**重启Nacos节点**以使更改生效。

综上所述，直接修改`/nacos/actuator/health`的“端口”并不实际，因为它是基于Nacos服务的主端口运行的。你需要调整的是Nacos服务的整体监听端口，并通过Spring Actuator的配置管理哪些端点被暴露出来。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：怎么能让nacos 的actuator 查不到任何信息呢 
 
 *专家经验：Nacos如何指定端口 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=15716)给我们反馈。
