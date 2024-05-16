---
id: "question-history-11185"
title: "nacos nacos 怎么安装 nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource nacos nacos 怎么安装"
tags: ["安装"]
keywords: ["安装"]
---

## 用户问题 ： 
 nacos nacos 怎么安装 nacos-opensource 

---------------
## 专家官方解答 ：

Nacos 是阿里巴巴开源的一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。如果您需要安装 Nacos，以下是详细的步骤：

1. **版本选择**:
   首先，访问 Nacos 的 [release notes](https://github.com/alibaba/nacos/releases) 和 [博客](https://nacos.io/blog/)，以了解当前推荐的稳定版本及其支持的功能。当前推荐的稳定版本为 2.3.2。

2. **预备环境准备**:
   - **操作系统**: 安装 64-bit 的 Linux/Unix/Mac 操作系统（Windows 亦可，但推荐前者）。
   - **Java**: 确保已安装 64-bit JDK 1.8 或更高版本。您可以通过 [此处](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) 下载并按照 [指南](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/) 配置 Java 环境。
   - **Maven**: 若您计划从源码构建 Nacos，请确保已安装 Maven 3.2.x 或更高版本。您可在 [这里](https://maven.apache.org/download.cgi) 下载并参照 [官方文档](https://maven.apache.org/settings.html) 进行配置。

3. **下载源码或安装包**:
   - **源码方式**:
     执行以下命令克隆 Nacos GitHub 仓库并构建项目：
     ```
     git clone https://github.com/alibaba/nacos.git
     cd nacos/
     mvn -Prelease-nacos -Dmaven.test.skip=true clean install -U
     ls -al distribution/target/
     
     // 将 $version 替换为您实际构建得到的版本号
     cd distribution/target/nacos-server-$version/nacos/bin
     ```

   - **安装包方式**:
     访问 [Nacos 最新稳定版本](https://github.com/alibaba/nacos/releases) 下载 `nacos-server-$version.zip` 或 `nacos-server-$version.tar.gz` 压缩包。解压后进入 `nacos/bin` 目录：
     ```
     unzip nacos-server-$version.zip 或者 tar -xvf nacos-server-$version.tar.gz
     cd nacos/bin
     ```

4. **修改配置文件**:
   在 `conf` 目录下找到 `application.properties` 文件，根据需要调整配置。特别注意，在 2.2.0.1 和 2.2.1 版本中，必须设置 `nacos.core.auth.plugin.nacos.token.secret.key` 值以确保正常启动。参考 [鉴权-自定义密钥](https://nacos.io/plugin/auth-plugin/) 文档，设置一个自定义密钥，切勿使用默认值。

5. **启动服务器**:
   根据您的操作系统，执行相应的启动命令（建议在至少 2C4G 60G 配置的机器上运行 Nacos）：
   - **Linux/Unix/Mac**:
     ```
     sh startup.sh -m standalone
     ```
     如遇到 `[` 符号找不到的错误，可尝试：
     ```
     bash startup.sh -m standalone
     ```

   - **Windows**:
     ```
     startup.cmd -m standalone
     ```

6. **服务注册与发现、配置管理验证**:
   可以通过执行以下 curl 命令来验证 Nacos 服务注册、发现以及配置管理功能是否正常工作：

   - **服务注册**:
     ```
     curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.10&port=8080'
     ```

   - **服务发现**:
     ```
     curl -X GET 'http://127.0.0.1:8848/nacos/v1/ns/instance/list?serviceName=nacos.naming.serviceName'
     ```

   - **发布配置**:
     ```
     curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test&content=HelloWorld"
     ```

   - **获取配置**:
     ```
     curl -X GET "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test"
     ```

7. **关闭服务器**:
   当需要停止 Nacos 服务时，执行以下命令：

   - **Linux/Unix/Mac**:
     ```
     sh shutdown.sh
     ```

   - **Windows**:
     ```
     shutdown.cmd
     ```

按照以上步骤，您即可成功安装并启动 Nacos 服务器，完成服务注册、发现与配置管理的基本验证。后续在实际使用中，可根据项目需求进一步配置和集成 Nacos。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:Nacos 快速开始 
 
 *专家经验:Nacos raft日志太大怎么清理 
 
 *专家经验:Nacos 介绍 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11687)给我们反馈。
