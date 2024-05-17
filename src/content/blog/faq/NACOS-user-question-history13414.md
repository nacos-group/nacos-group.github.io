---
id: "question-history-13414"
title: "invalid server identity key or value, please make sure set `nacos.core.auth. nacos-opensource"
date: "2024-05-13"
category: expertConsultation
description: "nacos-opensource invalid server identity key or value, please make sure set `nacos.core.auth."
tags: ["invalid server identity key","value","set","nacos.core.auth"]
keywords: ["invalid server identity key","value","set","nacos.core.auth"]
---

## 用户问题 ： 
 invalid server identity key or value, please make sure set `nacos.core.auth. nacos-opensource 

---------------
## 专家官方解答 ：

遇到“nacos-opensource invalid server identity key or value, please make sure set `nacos.core.auth.server.identity.key` and `nacos.core.auth.server.identity.value`”的错误提示，意味着Nacos在尝试验证服务端身份时发现配置的密钥对不正确或未设置。这通常是由于Nacos鉴权机制要求服务端有一个明确且匹配的标识密钥对以确保安全性。根据提供的知识内容，这个问题可以通过以下步骤解决：

1. **检查配置**：首先，确保你已经在Nacos的配置文件（如application.properties）中正确设置了`nacos.core.auth.server.identity.key`和`nacos.core.auth.server.identity.value`这两个参数。这些值应当是自定义的、唯一的键值对，用于标识Nacos服务器的身份。

2. **设置自定义键值对**：你需要为`nacos.core.auth.server.identity.key`设置一个自定义的键名，为`nacos.core.auth.server.identity.value`设置相应的值。例如：
   - `nacos.core.auth.server.identity.key=myCustomIdentityKey`
   - `nacos.core.auth.server.identity.value=mySecureIdentityValue`

   确保所有Nacos集群节点上的这些配置保持一致。

3. **重启Nacos服务器**：修改配置后，重启所有Nacos服务器实例，使得新的配置生效。

4. **验证配置**：重启后，再次尝试访问Nacos服务，验证是否还存在403错误。如果配置正确无误，该错误应已被解决。

**解释**：这些步骤的目的是确保Nacos服务器能够正确识别自身身份，防止未经授权的访问。自定义的服务器标识密钥对是鉴权机制的关键部分，用于增加系统的安全性。通过避免使用默认值并确保所有集群节点配置一致，可以有效防止因默认配置被利用而导致的安全风险。如果问题依然存在，建议检查是否有配置遗漏或冲突，并回顾Nacos的官方文档或社区讨论以获取更多帮助。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:Nacos鉴权相关建议 
 
 *专家经验:启动报错java.lang.IllegalArgumentException: the length of secret key must great than or equal 32 bytes... 
 
 *专家经验:nacso 报 403 invalid token 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13415)给我们反馈。
