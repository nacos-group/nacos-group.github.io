---
id: "question-history-11742"
title: "开防火墙时nacos要开哪些端口？ nacos-opensource"
date: "2024-04-24"
category: expertConsultation
description: "nacos-opensource 开防火墙时nacos要开哪些端口？"
tags: ["防火墙","端口"]
keywords: ["防火墙","端口"]
---

## 用户问题 ： 
 开防火墙时nacos要开哪些端口？
 nacos-opensource 

---------------
## 专家官方解答 ：

当您开启防火墙时，针对Nacos服务，需要开放以下端口：

1. **主端口**：8848，这是Nacos客户端、控制台及OpenAPI所使用的HTTP端口。确保防火墙允许外部流量通过此端口访问Nacos服务。

2. **客户端gRPC请求服务端端口**：9848，用于客户端向服务端发起连接和请求。同样，防火墙需放行此端口，以确保客户端与Nacos服务间的正常通信。

综上所述，为使Nacos在防火墙保护下正常运行，您需要在防火墙设置中开放端口8848和9848。这两个端口是Nacos服务对外提供核心功能所必需的，允许它们之间的网络通信，即可确保客户端能成功连接并使用Nacos配置中心服务。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:Nacos部署开放端口，集群部署开通端口 
 
 *专家经验:主流的配置中心有哪些？ 
 
 *[Nacos Docker 快速开始](https://nacos.io/docs/latest/quickstart/quick-start-docker)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11750)给我们反馈。
