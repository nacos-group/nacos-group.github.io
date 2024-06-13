---
id: "question-history-15275"
title: "nacos 鉴权涉及到端口有哪些 nacos-opensource"
date: "2024-06-13"
category: "expertConsultation"
description: "在Nacos的鉴权过程中，直接涉及的端口主要是Nacos服务的HTTP端口，即默认的8848端口。这是因为无论是Java SDK中的鉴权配置、其他语言SDK的鉴权（虽然具体方法未给出，但原理相同），还是通过Open-API进行鉴权操作，所有的鉴权请求都是通过HTTP协议发送到Nacos服务器的。例如"
---

## 用户问题 ： 
 nacos 鉴权涉及到端口有哪些 nacos-opensource 

---------------
## 专家官方解答 ：

在Nacos的鉴权过程中，直接涉及的端口主要是Nacos服务的HTTP端口，即默认的8848端口。这是因为无论是Java SDK中的鉴权配置、其他语言SDK的鉴权（虽然具体方法未给出，但原理相同），还是通过Open-API进行鉴权操作，所有的鉴权请求都是通过HTTP协议发送到Nacos服务器的。例如，Java SDK中的鉴权信息是在建立配置服务时作为属性的一部分被设置，并通过HTTP端口与Nacos服务器交互；Open-API鉴权的登录请求和后续带鉴权信息的配置或服务信息请求也都是通过HTTP协议经由8848端口进行的。

### 具体步骤与解释

1. **初始化配置服务**: 在使用Java SDK时，通过设置`serverAddr`属性指向Nacos服务器地址（默认HTTP端口8848），鉴权信息如用户名和密码也是在这个阶段通过`Properties`对象配置进去。此步骤确保了客户端能够正确连接到Nacos服务器并携带鉴权信息。

    ```java
    String serverAddr = "nacos-server-ip:8848"; // 默认HTTP端口
    Properties properties = new Properties();
    properties.put("serverAddr", serverAddr);
    properties.put("username", "your_username");
    properties.put("password", "your_password");
    ```

    **解释**: 这段代码配置了Nacos客户端连接到服务器所需的地址及鉴权凭据，所有后续请求都会使用这些凭据通过8848端口与Nacos服务器通讯。

2. **Open-API鉴权登录**: 使用CURL命令通过POST方式向Nacos服务器的8848端口发送登录请求，包含用户名和密码。成功后，服务器响应包含一个accessToken，该token需用于后续API请求中进行鉴权。

    ```shell
    curl -X POST '127.0.0.1:8848/nacos/v1/auth/login' -d 'username=nacos&password=nacos'
    ```

    **解释**: 登录请求明确指向了Nacos服务器的HTTP端口（8848），获取到的accessToken是访问受保护资源的身份验证令牌。

3. **使用accessToken进行API调用**: 获得accessToken后，任何需要鉴权的API调用（如查询配置或注册服务实例）都需要在请求URL后附加`accessToken=${accessToken}`。这确保了请求的合法性和安全性，所有这类请求也同样是通过HTTP协议和8848端口进行。

    ```shell
    curl -X GET '127.0.0.1:8848/nacos/v1/cs/configs?accessToken=${accessToken}&dataId=nacos.example.1&group=nacos_group'
    ```

    **解释**: 此步骤展示了如何在实际API调用中应用accessToken进行鉴权，确保了只有经过身份验证的客户端才能访问或修改数据。

综上所述，Nacos的鉴权机制主要依赖于其HTTP服务端口（默认8848），无论是直接在客户端配置中设置鉴权信息，还是通过API调用进行鉴权认证，均是通过此端口完成。其他如gRPC端口（默认9848）虽然对于Nacos的服务间通信至关重要，但在鉴权流程中并不直接涉及。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：Nacos如何指定端口 
 
 *专家经验：Nacos部署开放端口，集群部署开通端口 
 
 *[Authorization](https://nacos.io/docs/latest/guide/user/auth)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=15289)给我们反馈。
