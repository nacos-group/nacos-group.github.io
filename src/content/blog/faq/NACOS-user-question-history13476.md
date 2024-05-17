---
id: "question-history-13476"
title: "nacos如何启动 nacos-opensource"
date: "2024-05-14"
category: expertConsultation
description: "nacos-opensource nacos如何启动"
tags: ["nacos","启动"]
keywords: ["nacos","启动"]
---

## 用户问题 ： 
 nacos如何启动 nacos-opensource 

---------------
## 专家官方解答 ：

要启动Nacos开源版，根据其运行环境（非Docker或Docker环境），有不同的步骤：

### 非Docker环境启动步骤：

1. **修改配置文件**：打开Nacos服务器的`application.properties`文件。
2. **开启鉴权**（可选，但推荐）：为了安全性，建议开启鉴权功能。将配置项`nacos.core.auth.enabled`的值改为`true`，并设置`nacos.core.auth.system.type=nacos`。
3. **自定义密钥**（开启鉴权后）：若需自定义JWT密钥，设置`nacos.core.auth.default.token.secret.key`和`nacos.core.auth.plugin.nacos.token.secret.key`为Base64编码的密钥字符串，确保密钥长度不低于32字符且在所有节点间保持一致。
4. **保存并关闭文件**。
5. **启动Nacos服务**：根据你的环境（如使用Java命令或脚本），执行相应的启动命令。

### Docker环境启动步骤：

#### 使用官方镜像

1. **设置环境变量**：在启动Docker容器时，通过`-e`参数设置环境变量以开启鉴权，如`NACOS_AUTH_ENABLE=true`。
2. **其他鉴权配置**（可选）：可根据需要设置`NACOS_AUTH_TOKEN_EXPIRE_SECONDS`、`NACOS_AUTH_TOKEN`等环境变量。
3. **运行容器**：执行Docker命令启动容器，如`docker run --env NACOS_AUTH_ENABLE=true -p 8848:8848 nacos/nacos-server`。

#### 使用自定义镜像

1. **修改Dockerfile或基础镜像配置**：在构建镜像前，确保`application.properties`文件中的鉴权配置已正确设置，即`nacos.core.auth.enabled=true`和`nacos.core.auth.system.type=nacos`。
2. **构建镜像**：使用Docker build命令构建自定义镜像。
3. **运行容器**：使用新构建的镜像启动Docker容器，如有必要，同样可通过环境变量调整鉴权及其他相关配置。

### 注意事项：

- 鉴权配置修改后即时生效，无需重启服务端，但修改密钥时需谨慎，确保新密钥有效，以免造成登录失败或访问异常。
- 在Docker环境中，使用官方镜像时可通过环境变量灵活配置鉴权，简化了配置管理过程。

以上步骤提供了启动Nacos服务并在不同场景下开启鉴权的指导。


<font color="#949494">---------------</font> 


## 参考链接 ：

*[Authorization](https://nacos.io/docs/latest/guide/user/auth)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13489)给我们反馈。
