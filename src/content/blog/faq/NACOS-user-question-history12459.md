---
id: "question-history-12459"
title: "nacos docker单机版部署 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "为了在Docker环境中部署Nacos单机版并配置鉴权，您可以遵循以下步骤操作：1. **准备环境**：   - 确保您的系统中已安装Docker并且可以正常运行。2. **拉取Nacos Docker镜像**：   执行以下命令从Docker Hub获取最新版本的Nacos镜像：   ```bas"
tags: ["nacos","docker","单机版","部署"]
keywords: ["nacos","docker","单机版","部署"]
---

为了在Docker环境中部署Nacos单机版并配置鉴权，您可以遵循以下步骤操作：

1. **准备环境**：
   - 确保您的系统中已安装Docker并且可以正常运行。

2. **拉取Nacos Docker镜像**：
   执行以下命令从Docker Hub获取最新版本的Nacos镜像：
   ```bash
   docker pull nacos/nacos-server
   ```

3. **设置环境变量以开启鉴权**：
   在启动Docker容器时，您需要设置特定的环境变量来启用鉴权及其他相关配置。以下是开启鉴权所需的环境变量示例：
   ```bash
   docker run -d --name my-nacos-server \
     -p 8848:8848 \
     -e MODE=standalone \
     -e NACOS_AUTH_ENABLE=true \
     -e NACOS_AUTH_TOKEN=your_secret_key_base64_encoded \
     -e NACOS_AUTH_IDENTITY_KEY=identity_key \
     -e NACOS_AUTH_IDENTITY_VALUE=identity_value \
     nacos/nacos-server
   ```
   - `NACOS_AUTH_ENABLE=true` 开启鉴权功能。
   - `NACOS_AUTH_TOKEN` 应设置为一个强密码，经过Base64编码后的字符串，作为Token的密钥。
   - `NACOS_AUTH_IDENTITY_KEY` 和 `NACOS_AUTH_IDENTITY_VALUE` 用于服务间身份验证，可以根据实际情况设定。

4. **解释说明**：
   - 上述命令中，`-d` 表示以后台模式运行容器，`--name` 为容器命名，`-p 8848:8848` 映射容器的8848端口到宿主机的相同端口，便于访问Nacos控制台。
   - `MODE=standalone` 指定Nacos以单机模式运行。
   - 记得替换`your_secret_key_base64_encoded`为您的实际密钥，该密钥需要先生成一个大于32位的字符串，然后进行Base64编码。
   - 鉴权相关环境变量的设置参考了Nacos官方文档的指南，确保了服务的安全性。

通过以上步骤，您就可以成功在Docker中部署一个配置了鉴权的Nacos单机版实例。更多关于Nacos配置和管理的详细信息，可以参考Nacos官方文档：
- [Nacos鉴权文档](https://nacos.io/docs/latest/guide/user/auth/)
- [Nacos-Docker项目](https://github.com/nacos-group/nacos-docker)
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13838)给我们反馈。
