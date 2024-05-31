---
id: "question-history-11198"
title: "docker 怎么安装nacos nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "要通过Docker安装Nacos，请遵循以下步骤：1. **获取Nacos Docker镜像**：   访问Nacos的Docker镜像仓库，你可以直接使用命令行拉取官方镜像。对于稳定需求，可以选择不带特定后缀的版本，例如：   ```shell   docker pull nacos/nacos-"
tags: ["nacos","安装"]
keywords: ["nacos","安装"]
---

要通过Docker安装Nacos，请遵循以下步骤：

1. **获取Nacos Docker镜像**：
   访问Nacos的Docker镜像仓库，你可以直接使用命令行拉取官方镜像。对于稳定需求，可以选择不带特定后缀的版本，例如：
   ```shell
   docker pull nacos/nacos-server
   ```
   如果你需要ARM架构的镜像，可以选用带有`-slim`标识的版本，如社区提供的`v2.3.1-slim`镜像，通过以下命令获取：
   ```shell
   docker pull nacos/nacos-server:v2.3.1-slim
   ```

2. **准备配置文件**（可选）：
   根据你的需求，你可能需要自定义Nacos的配置。可以通过创建一个包含自定义配置的YAML文件（如`standalone-derby.yaml`），并将此文件映射到Docker容器中。例如，如果你想要修改默认的数据库配置或开启鉴权，就需要这一步骤。

3. **启动Nacos Server**：
   使用以下命令启动Nacos Docker容器，确保将`<CONFIG_PATH>`替换为你配置文件的实际路径（如果有的话），并根据实际情况设置环境变量以开启鉴权或其他高级配置：
   ```shell
   docker run -d --name my-nacos-server \
      -p 8848:8848 \
      -e MODE=cluster \          # 或者使用 'standalone' 模式
      -v <CONFIG_PATH>:/home/nacos/conf/application.properties \
      -e NACOS_AUTH_ENABLE=true \
      -e NACOS_AUTH_TOKEN=your_secret_token \
      -e NACOS_AUTH_IDENTITY_KEY=your_identity_key \
      -e NACOS_AUTH_IDENTITY_VALUE=your_identity_value \
      nacos/nacos-server
   ```
   这里，`-p 8848:8848`用于映射容器的8848端口到主机的相同端口，以便访问Nacos控制台。

4. **验证安装**：
   访问 `http://localhost:8848/nacos`，你应该能看到Nacos的登录界面。如果启用了鉴权，需要输入正确的凭据访问管理界面。

以上步骤基于Nacos官方Docker镜像及文档指导，确保了从拉取镜像到启动服务的全过程。更多详细配置和高级用法，请参考Nacos官方文档：
- [Nacos-Docker仓库](https://github.com/nacos-group/nacos-docker)
- [Nacos官方文档-鉴权配置](https://nacos.io/docs/latest/guide/user/auth/)
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13737)给我们反馈。
