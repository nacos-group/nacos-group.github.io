---
id: "question-history-8185"
title: "服务多实例进行滚动更新重启中断 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "在进行nacos-opensource服务多实例的滚动更新重启时，若遇到中断问题，可以按以下步骤分析原因并尝试解决方案：### 1. 分析问题原因- **服务未彻底关闭**：检查服务提供者是否完全关闭，确保没有残留进程仍在发送心跳至Nacos，导致Nacos未能及时摘除该实例。- **推空保护机制*"
tags: ["服务多实例","滚动更新重启中断"]
keywords: ["服务多实例","滚动更新重启中断"]
---

在进行nacos-opensource服务多实例的滚动更新重启时，若遇到中断问题，可以按以下步骤分析原因并尝试解决方案：

### 1. 分析问题原因

- **服务未彻底关闭**：检查服务提供者是否完全关闭，确保没有残留进程仍在发送心跳至Nacos，导致Nacos未能及时摘除该实例。
- **推空保护机制**：确认服务提供者全部下线后，Nacos客户端是否有推空保护(`namingPushEmptyProtection`)开启，这可能导致客户端在无可用实例时拒绝服务。
- **客户端或服务端版本问题**：老版本的Nacos-Client可能无法快速感知服务实例变化，特别是使用UDP协议时，延迟可能长达10秒。同时，确认Nacos-Server和客户端版本是否兼容且非过时。
- **应用框架缓存问题**：如Spring Cloud的Feign、Ribbon等组件可能有自身的服务实例缓存，导致即便Nacos客户端已获取新地址，应用仍使用旧地址。
- **网络或配置问题**：检查网络连通性，以及Nacos配置是否正确，确保客户端能够及时接收到服务实例变更通知。

### 2. 解决方案步骤

#### 2.1 验证服务状态

- 登录Nacos控制台，检查服务列表中是否存在已关闭但仍显示在线的服务实例。
  - 如果存在，请在目标节点上彻底终止相关进程，并检查是否有其他应用或进程误注册相同服务。
  
#### 2.2 调整推空保护设置

- 如果因推空保护导致服务不可用，可以在客户端配置中设置`namingPushEmptyProtection=false`，关闭此保护机制。但需谨慎操作，避免在服务真正为空时造成影响。

#### 2.3 升级客户端与服务端版本

- 确保使用最新或推荐版本的Nacos-Client和Nacos-Server，以获得最佳的服务发现性能。考虑升级到Nacos-Client 2.x版本，以减少服务发现延迟。

#### 2.4 检查应用框架缓存策略

- 查看应用日志和配置，了解是否有服务实例缓存策略（如Ribbon的配置），适当调整缓存刷新策略或超时时间，确保能及时使用最新的服务实例信息。

#### 2.5 网络与日志检查

- 确保网络畅通，检查是否有防火墙或网络策略阻止Nacos的通信。
- 分析Nacos-Client和服务应用的日志，查找服务发现失败或使用旧地址的线索。

### 结论

通过上述步骤，可以系统地诊断和解决nacos-opensource服务多实例滚动更新重启期间的中断问题。关键在于确保服务实例状态的准确同步，优化配置以适应快速变化的服务环境，并及时排查网络与应用层面的潜在障碍。[[nacos-opensource服务发现示例]](https://github.com/nacos-group/nacos-examples/tree/master/nacos-spring-cloud-example/nacos-spring-cloud-discovery-example)可作为参考配置与实践基础。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13545)给我们反馈。
