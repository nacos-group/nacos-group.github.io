---
id: "question-history-14576"
title: "如何通过openAPI访问开启鉴权后的nacos nacos-opensource"
date: "2024-05-23"
category: "expertConsultation"
description: "要通过Open-API访问已开启鉴权的Nacos，可以遵循以下步骤：1. **登录获取AccessToken**:   首先，需要使用curl命令通过POST请求登录Nacos服务器并获取AccessToken。确保替换`$serverAddr`为你的Nacos服务器地址，`$username`和`"
tags: ["openAPI","访问","鉴权","nacos"]
keywords: ["openAPI","访问","鉴权","nacos"]
---

要通过Open-API访问已开启鉴权的Nacos，可以遵循以下步骤：

1. **登录获取AccessToken**:
   首先，需要使用curl命令通过POST请求登录Nacos服务器并获取AccessToken。确保替换`${serverAddr}`为你的Nacos服务器地址，`${username}`和`${password}`为你的Nacos账户凭证。

   ```bash
   curl -X POST '${serverAddr}/nacos/v1/auth/login' -d 'username=${username}&password=${password}'
   ```
   成功登录后，服务器会返回类似以下的JSON响应，包含`accessToken`字段：

   ```json
   {"accessToken":"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYWNvcyIs...","tokenTtl":18000,"globalAdmin":true}
   ```

2. **使用AccessToken进行后续操作**:
   获取到`accessToken`后，在进行任何需要鉴权的操作时，都需要将其附加到URL作为查询参数。例如，查询配置信息或注册服务实例时：

   - 查询配置信息示例：
     ```bash
     curl -X GET '${serverAddr}/nacos/v1/cs/configs?accessToken=${accessToken}&dataId=nacos.example.1&group=nacos_group'
     ```

   - 注册服务实例示例：
     ```bash
     curl -X POST 'http://${serverAddr}/nacos/v1/ns/instance?accessToken=${accessToken}&port=8848&healthy=true&ip=11.11.11.11&weight=1.0&serviceName=nacos.test.3&encoding=GBK&namespaceId=n1'
     ```

   在这些命令中，`${accessToken}`应替换为第一步获取到的实际AccessToken值。

总结来说，通过Open-API访问鉴权后的Nacos主要涉及两步：登录获取AccessToken，然后在后续的API调用中使用这个AccessToken进行鉴权认证。请确保妥善保管AccessToken，并根据实际需求定期更新，以保证安全性。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=14577)给我们反馈。
