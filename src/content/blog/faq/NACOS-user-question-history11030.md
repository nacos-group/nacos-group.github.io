---
id: "question-history-11030"
title: "Nacos 请问nacos有arm架构的docker镜像么 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "Nacos确实提供有针对ARM架构的Docker镜像。您可以在社区中找到带有`slim`标识的镜像版本，例如`v2.3.1-slim`，这些镜像是专为ARM架构设计的。要使用此镜像，您可以参照以下步骤操作：1. 访问Nacos官方文档的Docker快速启动指南，链接为：[http://localho"
tags: ["arm架构","docker镜像"]
keywords: ["arm架构","docker镜像"]
---

## 用户问题 ： 
 Nacos 请问nacos有arm架构的docker镜像么 nacos-opensource 

---------------
## 专家官方解答 ：

Nacos确实提供有针对ARM架构的Docker镜像。您可以在社区中找到带有`slim`标识的镜像版本，例如`v2.3.1-slim`，这些镜像是专为ARM架构设计的。要使用此镜像，您可以参照以下步骤操作：

1. 访问Nacos官方文档的Docker快速启动指南，链接为：[http://localhost:4321/docs/next/quickstart/quick-start-docker/](http://localhost:4321/docs/next/quickstart/quick-start-docker/)
2. 下载或更新您的配置文件，如`example/standalone-derby.yaml`，将其中指定的Nacos镜像版本替换为带有`slim`字样的ARM镜像版本，例如从默认的镜像更改为`v2.3.1-slim`或其他适用的ARM版本。
3. 根据文档指引，使用更新后的配置文件启动Docker容器。

这样配置后，您就可以在基于ARM架构的服务器或设备上成功部署Nacos了。如果在部署过程中遇到其他问题，可以进一步查阅Nacos Docker部署的相关文档或社区讨论。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：Nacos 请问nacos有arm架构的docker镜像么 
 
 *[FAQ](https://nacos.io/docs/latest/guide/user/faq)
 
 *专家经验：Nacos Docker镜像的参数和Nacos系统参数的映射关系 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13719)给我们反馈。
