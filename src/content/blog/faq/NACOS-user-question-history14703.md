---
id: "question-history-14703"
title: "如何开启鉴权 nacos-opensource"
date: "2024-05-29"
category: "expertConsultation"
description: "要开启Nacos的服务端鉴权功能，您可以根据您的部署环境（非Docker或Docker环境）采取以下步骤操作：### 非Docker环境1. **修改配置文件**：编辑Nacos服务端的`application.properties`文件，进行如下更改：   - 将原来的配置：     ```   "
tags: ["鉴权"]
keywords: ["鉴权"]
---

## 用户问题 ： 
 如何开启鉴权 nacos-opensource 

---------------
## 专家官方解答 ：

要开启Nacos的服务端鉴权功能，您可以根据您的部署环境（非Docker或Docker环境）采取以下步骤操作：

### 非Docker环境

1. **修改配置文件**：编辑Nacos服务端的`application.properties`文件，进行如下更改：
   - 将原来的配置：
     ```
     nacos.core.auth.enabled=false
     ```
   - 更改为：
     ```properties
     nacos.core.auth.system.type=nacos
     nacos.core.auth.enabled=true
     ```
   这将启用Nacos的内置鉴权系统。

2. **自定义密钥**（可选）：为了提高安全性，您还可以自定义JWT令牌的密钥。在`application.properties`中添加或修改以下配置，确保使用Base64编码的密钥，且原始密钥长度至少为32个字符：
   ```properties
   nacos.core.auth.default.token.secret.key=YOUR_ENCODED_SECRET_KEY
   nacos.core.auth.plugin.nacos.token.secret.key=YOUR_ENCODED_SECRET_KEY
   ```
   请替换`YOUR_ENCODED_SECRET_KEY`为您自己的密钥。

3. **无需重启**：鉴权开关修改后立即生效，无需重启Nacos服务端。但请注意，动态修改`token.secret.key`时要确保新密钥有效，以免导致登录或访问异常。

### Docker环境

1. **使用环境变量**：如果您通过Docker部署Nacos，可以在启动容器时通过环境变量来开启鉴权和其他相关配置。例如，使用如下命令启动容器：
   ```powershell
   docker run --env PREFER_HOST_MODE=hostname \
              --env MODE=standalone \
              --env NACOS_AUTH_ENABLE=true \
              -p 8848:8848 \
              nacos/nacos-server
   ```
   此命令设置了`NACOS_AUTH_ENABLE=true`来开启鉴权。

2. **自定义鉴权参数**（可选）：除了`NACOS_AUTH_ENABLE`，您还可以设置如`NACOS_AUTH_TOKEN_EXPIRE_SECONDS`等其他环境变量来自定义鉴权行为。

### 客户端鉴权

一旦服务端鉴权开启，客户端在访问Nacos时必须提供有效的认证信息。对于Java SDK，您需要在配置中加入用户名和密码；而对于Open-API或其它语言的SDK，您需要先通过API登录获取AccessToken，然后在每次请求中携带此AccessToken进行鉴权。

以上步骤详细介绍了如何在Nacos中开启鉴权功能以及客户端如何进行相应的鉴权操作。


<font color="#949494">---------------</font> 


## 参考链接 ：

*[Authorization](https://nacos.io/docs/latest/guide/user/auth)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=14724)给我们反馈。
