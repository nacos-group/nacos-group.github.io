---
id: "question-history-13486"
title: "windows 安装nacos nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "要在Windows上安装Nacos，请遵循以下步骤：1. **环境准备**:   - 确保您的系统满足以下要求：     - 64位操作系统（支持Windows）。     - 64位JDK 1.8+。如果您尚未安装，请从[这里](http://www.oracle.com/technetwork/"
tags: ["windows","安装","nacos"]
keywords: ["windows","安装","nacos"]
---

要在Windows上安装Nacos，请遵循以下步骤：

1. **环境准备**:
   - 确保您的系统满足以下要求：
     - 64位操作系统（支持Windows）。
     - 64位JDK 1.8+。如果您尚未安装，请从[这里](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)下载并按照[指南](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/)进行配置。

2. **下载Nacos Server**:
   - 访问[Nacos最新稳定版本发布页](https://github.com/alibaba/nacos/releases)，下载`nacos-server-$version.zip`文件，其中`$version`代表您选择的版本号，例如2.3.2。
   - 下载完成后，解压文件到您希望安装Nacos的目录，例如：
     ```
     unzip nacos-server-$version.zip
     ```
     然后进入解压后的`nacos/bin`目录。

3. **修改配置文件（可选）**:
   - 虽然对于大多数基本安装场景这不是必需的，但根据需要，您可以调整`conf`目录下的`application.properties`文件。比如，为了安全性考虑，您可以设置自定义的鉴权密钥，详情请参考[Nacos鉴权插件文档](https://nacos.io/plugin/auth-plugin/)。

4. **启动Nacos Server**:
   - 在Windows环境下，通过命令行工具，定位到`bin`目录，然后执行启动命令：
     ```
     startup.cmd -m standalone
     ```
     这将以单机模式启动Nacos服务器。

5. **验证安装**:
   - 打开浏览器，访问 `http://127.0.0.1:8848/nacos`，您应该能看到Nacos的登录界面。默认用户名和密码为 `nacos`。
   - 使用提供的[curl命令](http://127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.10&port=8080)测试服务注册或进行其他操作，进一步验证Nacos是否正常工作。

6. **关闭Nacos Server**:
   - 当您需要停止Nacos服务时，可以通过执行`bin`目录下的`shutdown.cmd`文件来完成：
     ```
     shutdown.cmd
     ```
     或者直接双击该文件执行。

以上步骤概述了在Windows系统上安装并运行Nacos的基本流程。请根据实际情况调整配置，并确保遵循Nacos官方文档的指导以获得最佳实践和最新的配置信息。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13911)给我们反馈。
