---
id: "question-history-11031"
title: "Nacos nacos 2.3.0全新安装也需要关闭双写吗？ nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "根据提供的知识内容，对于Nacos 2.3.0全新安装是否需要关闭双写的问题，可以明确如下：1. **原因分析：**   Nacos从2.1版本开始，在部署时就已经支持直接以新版本的运行模式启动，这种模式下并不存在双写模式。因此，2.3.0作为2.X系列的较新版本，其默认部署即是不含双写模式的。2."
tags: ["nacos","2.3.0","双写"]
keywords: ["nacos","2.3.0","双写"]
---

## 用户问题 ： 
 Nacos nacos 2.3.0全新安装也需要关闭双写吗？ nacos-opensource 

---------------
## 专家官方解答 ：

根据提供的知识内容，对于Nacos 2.3.0全新安装是否需要关闭双写的问题，可以明确如下：

1. **原因分析：**
   Nacos从2.1版本开始，在部署时就已经支持直接以新版本的运行模式启动，这种模式下并不存在双写模式。因此，2.3.0作为2.X系列的较新版本，其默认部署即是不含双写模式的。

2. **结论：**
   Nacos 2.3.0全新安装不需要进行关闭双写的操作，因为该版本默认不启用双写模式。

3. **额外说明：**
   参考内容中提到的关闭双写操作是针对那些从旧版本升级至2.1及以上版本，并且在升级过程中可能启用了双写模式以确保数据一致性的场景。对于全新部署的2.3.0版本，这一步骤是不必要的。

综上所述，Nacos 2.3.0全新安装环境下，无需考虑关闭双写设置。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：Nacos nacos 2.3.0全新安装也需要关闭双写吗？ 
 
 *[Nacos 2.0 升级文档](https://nacos.io/docs/latest/upgrading/200-upgrading)
 
 *专家经验：Nacos nacos 2.3.0 如何关闭cp模式，只保留ap的注册中心？ 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13720)给我们反馈。
