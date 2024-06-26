---
id: "question-history-11185"
title: "nacos nacos 怎么安装 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "为了安装Nacos，请遵循以下详细步骤：1. **版本选择**：   首先，访问Nacos的[release notes](https://github.com/alibaba/nacos/releases)以确定最新的稳定版本。当前推荐的稳定版本为2.3.2。选择适合您需求的版本进行安装。2. *"
tags: ["安装"]
keywords: ["安装"]
---

为了安装Nacos，请遵循以下详细步骤：

1. **版本选择**：
   首先，访问Nacos的[release notes](https://github.com/alibaba/nacos/releases)以确定最新的稳定版本。当前推荐的稳定版本为2.3.2。选择适合您需求的版本进行安装。

2. **预备环境准备**：
   - 确保您的操作系统是64位的Linux/Unix/Mac/Windows，推荐使用Linux/Unix/Mac。
   - 安装64位JDK 1.8或更高版本。如需下载和配置，请访问：[JDK下载](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) 和 [JDK配置指南](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/)。
   - 配置Maven 3.2.x或更高版本。下载地址：[Maven下载](https://maven.apache.org/download.cgi)，配置说明：[Maven配置](https://maven.apache.org/settings.html)。

3. **下载Nacos**：
   有两种方式获取Nacos：
   
   - **源码方式**：
     ```
     git clone https://github.com/alibaba/nacos.git
     cd nacos/
     mvn -Prelease-nacos -Dmaven.test.skip=true clean install -U
     ls -al distribution/target/
     ```
     然后根据实际路径进入`nacos-server-$version/nacos/bin`目录。
     
   - **下载安装包**：
     访问[最新稳定版本](https://github.com/alibaba/nacos/releases)下载`nacos-server-$version.zip`或`.tar.gz`，解压后进入`nacos/bin`目录。

4. **修改配置文件**（针对特定版本）：
   在`conf/application.properties`中设置`nacos.core.auth.plugin.nacos.token.secret.key`，以启用自定义鉴权密钥。避免使用默认值，确保生产安全。

5. **启动Nacos服务器**：
   - **Linux/Unix/Mac**：执行`sh startup.sh -m standalone`。若遇到[[符号错误，使用`bash startup.sh -m standalone`。
   - **Windows**：运行`startup.cmd -m standalone`。

   注意：推荐在至少2C4G 60G配置的机器上运行Nacos。

完成上述步骤后，Nacos将成功安装并运行在单机模式下。接下来，您可以根据需要进行服务注册、发现和配置管理操作。如果需要在ARM架构下使用Docker部署Nacos，可选用带有`slim`标识的镜像版本，例如`v2.3.1-slim`，并参考官方文档的Docker快速启动指南进行配置调整。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13724)给我们反馈。
