---
id: "question-history-13424"
title: "nacos 怎么开启鉴权？ nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "要开启Nacos的鉴权功能，您可以根据不同的部署环境采取以下步骤：### 针对Kubernetes (k8s) 和 Docker 部署的Nacos集群/单机模式：1. **设置环境变量**：在部署Nacos的Docker容器时，通过环境变量来开启鉴权及配置相关参数。至少需要设置以下环境变量：   -"
tags: ["鉴权"]
keywords: ["鉴权"]
---

要开启Nacos的鉴权功能，您可以根据不同的部署环境采取以下步骤：

### 针对Kubernetes (k8s) 和 Docker 部署的Nacos集群/单机模式：

1. **设置环境变量**：在部署Nacos的Docker容器时，通过环境变量来开启鉴权及配置相关参数。至少需要设置以下环境变量：
   - `NACOS_AUTH_ENABLE=true` 开启鉴权功能。
   - `NACOS_AUTH_TOKEN_SECRET_KEY` 设置用于生成Token的密钥，需大于32位并进行Base64编码。
   - 可选地，根据需要设置`NACOS_AUTH_IDENTITY_KEY` 和 `NACOS_AUTH_IDENTITY_VALUE` 用于服务端身份识别。

   示例Docker运行命令：
   ```powershell
   docker run \
     --env NACOS_AUTH_ENABLE=true \
     --env NACOS_AUTH_TOKEN_SECRET_KEY=VGhpc0lzTXlDdXN0b21TZWNyZXRLZXkwMTIzNDU2Nzg= \
     -p 8848:8848 \
     nacos/nacos-server
   ```

2. **使用官方文档**：详细配置可参考Nacos官方文档关于鉴权的部分：[Nacos鉴权文档](https://nacos.io/docs/latest/guide/user/auth/)

### 对于非Docker环境（直接使用发行包部署）：

1. **修改配置文件**：编辑Nacos的`application.properties`文件，确保包含以下配置：
   - `nacos.core.auth.enabled=true` 启用鉴权。
   - `nacos.core.auth.plugin.nacos.token.secret.key=YOUR_BASE64_ENCODED_SECRET_KEY` 设置自定义的Base64编码密钥。
   - 根据需要设置`nacos.core.auth.server.identity.key` 和 `nacos.core.auth.server.identity.value`。

### 注意事项：

- 密钥(`secret.key`)应当使用大于32字符的字符串，并进行Base64编码以增强安全性。
- 鉴权开关修改后即时生效，无需重启服务端，但修改`token.secret.key`时需谨慎，确保新密钥有效，以免导致登录失败或请求异常。
- 如使用自定义鉴权插件，还需配置`nacos.core.auth.system.type`等参数。

通过以上步骤，您可以根据实际情况为Nacos部署配置合适的鉴权机制，确保配置中心的安全访问。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13894)给我们反馈。
