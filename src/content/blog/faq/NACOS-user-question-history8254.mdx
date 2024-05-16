---
id: "question-history-8254"
title: "The API deregisterInstances provided by the client SDK is called successfully, but the instance is not offline. nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource The API deregisterInstances provided by the client SDK is called successfully, but the instance is not offline."
tags: ["deregisterInstances","client SDK","instance","offline"]
keywords: ["deregisterInstances","client SDK","instance","offline"]
---

## 用户问题 ： 
 The API deregisterInstances provided by the client SDK is called successfully, but the instance is not offline. nacos-opensource 

---------------
## 专家官方解答 ：

问题分析：
根据我了解的知识中的描述，出现“API deregisterInstances provided by the client SDK is called successfully, but the instance is not offline”这一现象，可能是由于以下几个原因：

1. **非持久化服务**：客户端持续发送心跳维持服务在线状态。即使服务被删除或实例被注销，客户端在检测到服务状态变化后可能会自动重新发布数据，导致服务重新出现在线状态。

2. **代理注册**：如果服务是通过代理程序注册的，仅调用客户端SDK的deregisterInstances接口可能无法彻底移除服务，因为代理程序可能仍在继续注册该服务。

3. **客户端进程未完全关闭**：即使服务提供者的应用程序被关闭，如果客户端进程未完全结束，它依然可能发送心跳维持服务在线。

4. **网络问题**：客户端断网后，服务端可能无法及时感知到客户端下线，导致服务实例在控制台上长时间显示为在线状态。

5. **幽灵Pod**：在Kubernetes环境中，可能存在已无法找到但其进程仍在节点上运行的Pod，这种情况也可能导致服务实例未被正确下线。

解决方案：

基于以上分析，针对问题原因，可采取以下具体步骤来解决或排查问题：

**步骤1：确保使用正确的API**

确保您使用的是客户端SDK提供的`deregisterService`接口而非`deregisterInstances`，以同时删除服务并移除心跳任务。这一步适用于非持久化服务的场景。

**步骤2：彻底关闭相关进程**

确保要删除服务的客户端应用程序及进程已完全关闭。您可以检查操作系统任务管理器或使用命令行工具确认相关进程是否已结束。一旦进程终止，Nacos应能自动移除已停止的服务。

**步骤3：检查并处理幽灵Pod**

在Kubernetes环境中，检查是否存在幽灵Pod（即已无法找到但其进程仍在节点上运行的Pod）。如存在此类情况，需找出并清理这些Pod，确保服务实例真正下线。

**步骤4：处理代理注册场景**

如果您的服务是通过代理程序注册的，需要在代理程序中相应地移除或注销该服务。确保代理程序与Nacos控制台的操作同步，避免代理程序继续注册已删除的服务。

**步骤5：网络问题排查**

对于因网络问题导致的服务实例未下线，可尝试恢复客户端与Nacos服务器之间的网络连接，或等待Nacos服务器在心跳超时后自动下线服务实例。如果问题持续存在，应进一步排查网络环境和防火墙设置。

综上所述，针对“API deregisterInstances provided by the client SDK is called successfully, but the instance is not offline”的问题，通过执行上述步骤，通常可以定位并解决导致服务实例无法成功下线的各种原因。


<font color="#949494">---------------</font> 


## 参考链接 ：

*[Nacos系统参数介绍](https://nacos.io/docs/latest/guide/admin/system-configurations)
 
 *专家经验:在Nacos控制台上删除服务或实例，过一会儿还会出现 
 
 *专家经验:Why Use HTTP for Registration of the Nacos2.0 Raft Protocol 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11567)给我们反馈。
