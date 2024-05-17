---
id: "question-history-11836"
title: "nacos 是否有推空保护机制？ nacos-opensource"
date: "2024-04-24"
category: expertConsultation
description: "nacos-opensource nacos 是否有推空保护机制？"
---

## 用户问题 ： 
 nacos 是否有推空保护机制？ nacos-opensource 

---------------
## 专家官方解答 ：

Nacos确实存在推空保护机制。在Nacos中，开启客户端推空保护的参数是：namingPushEmptyProtection=true。这意味着，当您在使用支持该功能的新版本Java客户端时，可以通过设置此参数来启用推空保护。

然而，需要注意的是，客户端的推空保护当前仅适用于使用Java语言且版本较新的客户端。对于那些使用其他编程语言编写的客户端，或是使用旧版Java客户端的应用，可能并不具备推空保护的能力，依然存在推送空配置的风险。

针对这种情况，如果您希望确保所有客户端（包括不同语言版本及旧版Java客户端）都能享受到推空保护，可以考虑采用阿里云的商业产品——MSE（微服务引擎）。MSE在开源Nacos的基础上增强了服务端的推空保护功能，能够适应各种版本的客户端和多语言客户端，从而提供更为全面的保护。

总结来说：

1. **Nacos原生支持**：在使用支持推空保护的新版Java客户端时，通过设置参数 `namingPushEmptyProtection=true` 即可启用推空保护。

2. **应对多语言及旧版客户端**：若需兼容使用不同语言或旧版Java客户端的应用，建议采用**阿里云MSE**，它在服务端提供了推空保护功能，能有效覆盖各类客户端场景，消除推送空配置的风险。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:Nacos推空保护 
 
 *专家经验:Nacos是否支持IPV6 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11837)给我们反馈。
