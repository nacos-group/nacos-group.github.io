---
id: "question-history-11416"
title: "如何使用docker方式部署nacos nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "要使用Docker方式部署Nacos，特别是配置为集群模式并开启鉴权，您可以遵循以下步骤：1. **准备环境**：   - 确保您的系统中已安装Docker，并且Docker服务正在运行。2. **获取Nacos Docker镜像**：   - 访问Nacos Docker镜像的GitHub仓库[["
tags: ["docker","部署","nacos"]
keywords: ["docker","部署","nacos"]
---

要使用Docker方式部署Nacos，特别是配置为集群模式并开启鉴权，您可以遵循以下步骤：

1. **准备环境**：
   - 确保您的系统中已安装Docker，并且Docker服务正在运行。

2. **获取Nacos Docker镜像**：
   - 访问Nacos Docker镜像的GitHub仓库[[1](https://github.com/nacos-group/nacos-docker)]以获取最新的镜像信息。您可以通过命令`docker pull nacos/nacos-server`来拉取官方的Nacos服务器镜像。

3. **配置鉴权参数**：
   - 根据Nacos集群部署需求，您需要设置以下环境变量来开启鉴权和其他相关安全配置：
     - `NACOS_AUTH_ENABLE=true`：开启鉴权功能。
     - `NACOS_AUTH_TOKEN=您自定义的长于32位的字符串（确保安全性），并进行Base64编码`：用于Token生产的密钥。
     - `NACOS_AUTH_IDENTITY_KEY=自定义的服务端标识键`：例如，`nacos_server`。
     - `NACOS_AUTH_IDENTITY_VALUE=自定义的服务端标识值`：用于识别不同服务端实例。

4. **启动Nacos容器**：
   - 使用如下命令启动Nacos容器，记得替换`<其他自定义参数>`为您可能需要的其他环境变量或配置（比如集群配置）：
     ```shell
     docker run -d --name nacos-server \
       -p 8848:8848 \
       -e MODE=cluster \
       -e NACOS_AUTH_ENABLE=true \
       -e NACOS_AUTH_TOKEN=<Base64编码后的密钥> \
       -e NACOS_AUTH_IDENTITY_KEY=nacos_server \
       -e NACOS_AUTH_IDENTITY_VALUE=my_unique_value \
       <其他自定义参数> \
       nacos/nacos-server
     ```
   - 注意，如果您打算部署Nacos集群，需要为每个节点分配不同的标识值，并且确保它们之间的网络通信畅通无阻。

5. **配置集群**：
   - 若要配置Nacos集群，您需要为每个节点指定不同的IP或主机名，并在`nacos.properties`中设置集群相关信息，或者通过环境变量传递。具体配置方法可以参考Nacos官方文档或Nacos-Docker仓库中的说明[[1](https://github.com/nacos-group/nacos-docker)]。

6. **验证部署**：
   - 访问http://localhost:8848/nacos/，使用配置的鉴权信息登录控制台，确认Nacos服务正常运行且鉴权功能生效。

通过上述步骤，您就可以成功使用Docker部署具有鉴权功能的Nacos服务了。如果需要更高级的配置或遇到具体问题，详细文档和帮助可以参考Nacos官方文档[[2](https://nacos.io/docs/latest/guide/user/auth/)]和Nacos-Docker项目页面[[1](https://github.com/nacos-group/nacos-docker)]。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13748)给我们反馈。
