---
id: "question-history-11862"
title: "nacos v1 core cluster nodes 访问权限如何关闭？ nacos-opensource"
date: "2024-05-17"
category: expertConsultation
description: "nacos-opensource nacos v1 core cluster nodes 访问权限如何关闭？"
tags: ["访问权限","关闭"]
keywords: ["访问权限","关闭"]
---

## 用户问题 ： 
 nacos v1 core cluster nodes 访问权限如何关闭？ nacos-opensource 

---------------
## 专家官方解答 ：

要关闭 Nacos `/nacos/v1/core/cluster/nodes` 接口的访问权限，您可以按照以下步骤操作：

1. **修改配置文件**：打开 Nacos 的配置文件 `config.properties`，在文件中添加以下配置项：
   ```
   security.disabled=true
   ```
   这个设置会禁用 Nacos 的安全控制，从而间接关闭节点列表接口的访问。

2. **重启 Nacos 服务**：保存配置文件的更改后，需要重启 Nacos 服务以使更改生效。这将应用新的安全配置，关闭对外提供的集群节点信息接口。

**注意**：
- 关闭节点列表接口可能会影响到 Nacos 管理界面的功能，因为它依赖此接口来展示集群中所有节点的信息。在执行此操作前，请确保您已评估此变更对现有管理系统的影响，并准备好相应的应对措施。
- 如果您仅想针对特定接口进行鉴权或限制访问，而非完全禁用安全控制，可能需要自定义 Nacos 源码并重新编译部署，这超出了标准配置范畴。

参考链接：[Nacos 官方文档 - 安全设置](https://nacos.io/zh-cn/docs/security.html)

通过上述步骤，您可以实现 `/nacos/v1/core/cluster/nodes` 访问权限的关闭。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:/nacos/v1/core/cluster/nodes 这个访问权限如何关闭？ 
 
 *专家经验:Nacos 如何关闭/nacos/v2/console/namespace，使api不对外开放 
 
 *专家经验:怎么能让nacos 的actuator 查不到任何信息呢 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13829)给我们反馈。
