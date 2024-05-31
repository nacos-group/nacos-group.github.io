---
id: "question-history-8190"
title: "nacos服务端开启鉴权的情况下，是否会对已经发布业务服务（通过nacos客户端链接）产生稳定性的影响？ nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "在nacos服务端开启鉴权的情况下，通常不会直接影响已经发布业务服务的稳定性。这是因为鉴权主要是为了保护配置中心资源不被未授权访问，它在服务端进行权限验证，并不影响已经建立连接的客户端的正常通信。以下是基于提供的知识内容的分析：1. **鉴权机制作用域**：鉴权主要是在客户端尝试访问或修改Nacos"
tags: ["nacos","鉴权","稳定性","业务服务","nacos客户端","链接"]
keywords: ["nacos","鉴权","稳定性","业务服务","nacos客户端","链接"]
---

在nacos服务端开启鉴权的情况下，通常不会直接影响已经发布业务服务的稳定性。这是因为鉴权主要是为了保护配置中心资源不被未授权访问，它在服务端进行权限验证，并不影响已经建立连接的客户端的正常通信。以下是基于提供的知识内容的分析：1. **鉴权机制作用域**：鉴权主要是在客户端尝试访问或修改Nacos
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13549)给我们反馈。
