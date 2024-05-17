---
id: "question-history-11767"
title: "nacos怎么用 nacos-opensource"
date: "2024-04-24"
category: expertConsultation
description: "nacos-opensource nacos怎么用"
---

## 用户问题 ： 
 nacos怎么用 nacos-opensource 

---------------
## 专家官方解答 ：

Nacos 的使用涉及以下几个主要步骤：

1. **版本选择**：
   首先，确定要使用的 Nacos 版本。访问 Nacos 的 [GitHub release 页面](https://github.com/alibaba/nacos/releases) 或查阅其 [官方博客](https://nacos.io/blog/)，了解各个版本的特性、稳定性以及兼容性，选择一个推荐的稳定版本，例如当前推荐的版本为 2.3.2。

2. **预备环境准备**：
   - **操作系统**：确保您正在使用 64-bit 的 Linux/Unix/Mac/Windows 操作系统，推荐选择 Linux/Unix/Mac。
   - **Java 环境**：安装并配置 64-bit JDK 1.8 或更高版本。您可以在 [Oracle 官网](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) 下载并按照 [官方指南](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/) 进行配置。
   - **Maven 环境**（仅限从源码构建）：如果您打算从源码构建 Nacos，需要安装并配置 Maven 3.2.x 或更高版本。您可以在 [Apache Maven 官网](https://maven.apache.org/download.cgi) 下载并按照 [Maven 设置指南](https://maven.apache.org/settings.html) 进行配置。

3. **获取 Nacos**：
   - **从源码构建**：克隆 Nacos GitHub 仓库 (`git clone https://github.com/alibaba/nacos.git`)，进入项目目录 (`cd nacos/`)，执行构建命令 (`mvn -Prelease-nacos -Dmaven.test.skip=true clean install -U`)。完成后，定位到编译后的二进制文件路径 (`cd distribution/target/nacos-server-$version/nacos/bin`），其中 `$version` 应替换为您实际构建得到的版本号。
   - **下载编译后压缩包**：直接从 [Nacos 最新稳定版本发布页](https://github.com/alibaba/nacos/releases) 下载 `nacos-server-$version.zip` 或 `nacos-server-$version.tar.gz` 压缩包，解压后进入 `nacos/bin` 目录。

4. **修改配置文件**：
   在 `conf/application.properties` 文件中，找到 `nacos.core.auth.plugin.nacos.token.secret.key` 属性，将其值更改为自定义的密钥（非默认值）。详情参见 [Nacos 鉴权插件文档](https://nacos.io/plugin/auth-plugin/)。**注意：** 文档中提供的默认值仅适用于临时测试，实际部署时务必更改。

5. **启动服务器**：
   根据您的操作系统，执行相应的启动命令：
   - **Linux/Unix/Mac**：在终端中运行 `sh startup.sh -m standalone`。如果遇到 `[` 符号找不到的错误，可以尝试 `bash startup.sh -m standalone`。
   - **Windows**：在命令提示符或 PowerShell 中运行 `startup.cmd -m standalone`。

6. **服务注册与发现、配置管理**：
   通过以下示例 HTTP 请求进行服务注册、发现和配置管理：
   - **服务注册**：
     ```bash
     curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.10&port=8080'
     ```
   - **服务发现**：
     ```bash
     curl -X GET 'http://127.0.0.1:8848/nacos/v1/ns/instance/list?serviceName=nacos.naming.serviceName'
     ```
   - **发布配置**：
     ```bash
     curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test&content=HelloWorld"
     ```
   - **获取配置**：
     ```bash
     curl -X GET "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test"
     ```

7. **关闭服务器**：
   根据操作系统，执行相应的关闭命令：
   - **Linux/Unix/Mac**：在终端中运行 `sh shutdown.sh`。
   - **Windows**：在命令提示符或 PowerShell 中运行 `shutdown.cmd`，或者双击 `shutdown.cmd` 文件。

以上就是使用 Nacos 的详细步骤，包括版本选择、环境准备、获取 Nacos、配置修改、启动服务器、进行服务注册与发现以及配置管理，最后关闭服务器。这些步骤基于提供的参考资料，涵盖了从安装到基本功能使用的全过程。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:Nacos raft日志太大怎么清理 
 
 *专家经验:Nacos 快速开始 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11782)给我们反馈。
