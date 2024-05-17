---
id: "question-history-8237"
title: "nacos 开源版本类型 nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource nacos 开源版本类型"
tags: ["opensource","nacos 开源版本类型"]
keywords: ["opensource","nacos 开源版本类型"]
---

## 用户问题 ： 
 nacos 开源版本类型 nacos-opensource 

---------------
## 专家官方解答 ：

Nacos 开源版本类型主要包括稳定版本和非稳定版本（如ALPHA、BETA、RC版本）。稳定版本是指经过充分测试并修复了已知重大问题的版本，适用于生产环境部署。自Nacos 1.0之后，所有非ALPHA、BETA、RC标记的版本均视为稳定版本。尽管Nacos1.X系列仍会进行重大BUG和安全漏洞的修复，但功能迭代已停止。因此，对于用户来说，推荐使用的是Nacos 2.X系列的最新稳定版本。这些版本可以在Nacos官方网站[https://nacos.io/download/nacos-server/](https://nacos.io/download/nacos-server/)或GitHub release页面[https://github.com/alibaba/nacos/releases](https://github.com/alibaba/nacos/releases)获取。

需要注意的是，Nacos开源版本在鉴权机制上有所限制。开源版本不支持使用AK/SK（Access Key/Secret Key）这种基于云产品提供的身份认证方式进行鉴权，因为这涉及到具体的校验逻辑和云产商提供的服务。对于有此类需求的用户，可能需要考虑使用如阿里云MSE等云服务提供商提供的Nacos商业版或寻求其他鉴权解决方案。

在Java环境支持方面，Nacos开源版本广泛支持从JDK 8到JDK 17的所有版本。理论上，Nacos也有可能兼容JDK 17以上（如JDK 19或JDK 21），但这需要更多的测试验证以确保其在新版本Java环境下的稳定运行。

综上所述，Nacos开源版本类型主要分为稳定版本和非稳定版本，其中稳定版本是用户的首选，且当前推荐使用Nacos 2.X系列的最新版本。在功能特性上，开源版本不支持AK/SK鉴权，但全面支持JDK 8至JDK 17，并可能兼容更高版本的Java环境。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:nacos哪个版本最常用 
 
 *专家经验:开源版本可以支持ak/sk鉴权吗？ 
 
 *专家经验:Does nacos 2.2.3 support jdk17 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11552)给我们反馈。
