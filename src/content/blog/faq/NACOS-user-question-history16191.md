---
id: "question-history-16191"
title: "服务端用2.2.3版本的nacos，需要用什么版本的sdk"
date: "2024-07-15"
category: "expertConsultation"
description: "根据已有的知识，Nacos服务端2.2.3版本属于Nacos2.X系列。根据兼容性规则：- Nacos2.X的服务端版本能够兼容所有的Nacos2.X的客户端版本，以及Nacos1.2.0之后的所有客户端版本。因此，您应该使用Nacos2.X系列的SDK，具体版本可以选择任意Nacos2.X版本，包"
---

## 用户问题 ： 
 服务端用2.2.3版本的nacos，需要用什么版本的sdk  

---------------
## 专家官方解答 ：

根据已有的知识，Nacos服务端2.2.3版本属于Nacos2.X系列。根据兼容性规则：

- Nacos2.X的服务端版本能够兼容所有的Nacos2.X的客户端版本，以及Nacos1.2.0之后的所有客户端版本。

因此，您应该使用Nacos2.X系列的SDK，具体版本可以选择任意Nacos2.X版本，包括2.2.3及之后的版本。如果希望利用最新的API特性，推荐选择与服务端相近或更新的客户端版本，比如Nacos2.2.3或更高版本的SDK。

**解释说明：**
1. 由于Nacos服务端2.2.3属于2.X系列，根据兼容性表格，它向下兼容所有1.2.0及以后的1.X客户端，同时也兼容所有2.X的客户端。
2. Nacos在2.2.0版本引入了新的openAPI v2，虽然这不影响基本的客户端兼容性，但如果您计划利用这些新API，选择与服务端相近或更新的客户端会更加合适，以确保所有功能都能得到最佳支持。
3. 不需要指定一个确切的客户端版本号，只要确保是在Nacos2.X范围内即可，这样可以确保与服务端2.2.3的兼容性并获取最佳性能与特性支持。

综上所述，为了获得最佳体验和兼容性，建议使用Nacos2.2.3或更高版本的SDK。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：Nacos客户端和服务端版本的兼容性问题 
 
 *专家经验：Nacos1.0和Nacos2.0的api有什么区别？2.0的中小版本升级相关问题 
 
 *专家经验：Does nacos 2.2.3 support jdk17 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=16201)给我们反馈。
