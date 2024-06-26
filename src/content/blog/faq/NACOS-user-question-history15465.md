---
id: "question-history-15465"
title: "nacos 鉴权涉及到端口有哪些？ nacos-opensource"
date: "2024-06-17"
category: "expertConsultation"
description: "在Nacos的鉴权过程中，直接涉及的端口主要是用于HTTP通信的主端口，默认为8848。这是客户端、控制台以及OpenAPI进行交互的主要端口。鉴权操作如登录获取accessToken通常是通过此端口进行的，例如使用curl命令登录Nacos服务器：```plaincurl -X POST '127"
---

## 用户问题 ： 
 nacos 鉴权涉及到端口有哪些？ nacos-opensource 

---------------
## 专家官方解答 ：

在Nacos的鉴权过程中，直接涉及的端口主要是用于HTTP通信的主端口，默认为8848。这是客户端、控制台以及OpenAPI进行交互的主要端口。鉴权操作如登录获取accessToken通常是通过此端口进行的，例如使用curl命令登录Nacos服务器：

```plain
curl -X POST '127.0.0.1:8848/nacos/v1/auth/login' -d 'username=nacos&password=nacos'
```

成功登录后，返回的accessToken需在后续的配置信息或服务信息请求中作为鉴权参数使用，依然是通过HTTP端口（默认8848）传递，如：

```plain
curl -X GET '127.0.0.1:8848/nacos/v1/cs/configs?accessToken=your_access_token_here'
```

虽然gRPC端口（默认为主端口+1000，即9848）在Nacos中用于客户端与服务端的某些通信，但它并不直接参与鉴权过程中的数据传输。鉴权主要还是基于HTTP协议完成的。

总结步骤如下：
1. **登录鉴权**：通过HTTP端口（默认8848）发起登录请求，提交用户名和密码，获取accessToken。
2. **使用accessToken**：在之后的所有需要鉴权的HTTP请求中，将获取到的accessToken作为查询参数附加在URL后面，继续通过8848端口进行通信。

请注意，虽然gRPC端口在Nacos的内部通信中扮演重要角色，但它与鉴权操作本身无直接关联。如果在特定配置或场景下需要调整这些端口，请参考Nacos官方文档提供的指导进行配置。


<font color="#949494">---------------</font> 


## 参考链接 ：

*[Authorization](https://nacos.io/docs/latest/guide/user/auth)
 
 *专家经验：Nacos部署开放端口，集群部署开通端口 
 
 *专家经验：Nacos如何指定端口 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=15535)给我们反馈。
