---
id: "question-history-11203"
title: "nacos 启动命令 nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource nacos 启动命令"
tags: ["nacos","启动命令"]
keywords: ["nacos","启动命令"]
---

## 用户问题 ： 
 nacos 启动命令 nacos-opensource 

---------------
## 专家官方解答 ：

要启动Nacos，您可以按照以下步骤操作：

1. **预备环境准备**：
   - **操作系统**：确保您使用的操作系统为64位，支持Linux/Unix/Mac/Windows，推荐选用Linux/Unix/Mac。
   - **Java环境**：安装并配置64 bit JDK 1.8+。您可以在[这里](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)下载并按照[此处](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/)的指南进行配置。
   - **Maven（仅源码构建）**：如果您计划从源码构建Nacos，需要安装并配置Maven 3.2.x+。下载地址为[这里](https://maven.apache.org/download.cgi)，配置说明见[此处](https://maven.apache.org/settings.html)。

2. **获取Nacos**：
   - **源码方式**：
     - 通过Git克隆Nacos仓库：`git clone https://github.com/alibaba/nacos.git`
     - 进入项目目录并构建：`cd nacos/ && mvn -Prelease-nacos -Dmaven.test.skip=true clean install -U`
     - 查找构建后的安装包路径：`ls -al distribution/target/`
     - 进入目标版本的bin目录（将 `$version` 替换为实际路径）：`cd distribution/target/nacos-server-$version/nacos/bin`
   - **压缩包方式**：
     - 从[Nacos最新稳定版本](https://github.com/alibaba/nacos/releases)下载nacos-server-$version.zip或nacos-server-$version.tar.gz。
     - 解压文件：`unzip nacos-server-$version.zip` 或 `tar -xvf nacos-server-$version.tar.gz`
     - 进入解压后的bin目录：`cd nacos/bin`

3. **修改配置文件**（仅针对特定版本）：
   - 对于2.2.0.1和2.2.1版本，必须在`conf/application.properties`文件中设置`nacos.core.auth.plugin.nacos.token.secret.key`值，详情参阅[鉴权-自定义密钥](https://nacos.io/plugin/auth-plugin/)。请注意，使用默认值可能导致安全风险，实际应用中应更换为自定义密钥。

4. **启动服务器**：
   - **Linux/Unix/Mac**：
     - 执行启动脚本，以单机模式（standalone）运行：`sh startup.sh -m standalone`
     - 如果遇到`[[`符号找不到的错误（Ubuntu系统等），可尝试：`bash startup.sh -m standalone`
   - **Windows**：
     - 执行启动脚本，以单机模式（standalone）运行：`startup.cmd -m standalone`

至此，您已完成Nacos的启动过程。接下来，您可以进行服务注册、发现以及配置管理等操作。如需关闭Nacos服务器，请参照相关平台（Linux/Unix/Mac或Windows）的关闭指令。


<font color="#949494">---------------</font> 


## 参考链接 ：

*[Nacos 融合 Spring，成为注册配置中心](https://nacos.io/docs/latest/ecology/use-nacos-with-spring)
 
 *专家经验:Nacos 快速开始 
 
 *[Nacos 2.0 升级文档](https://nacos.io/docs/latest/upgrading/200-upgrading)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11705)给我们反馈。
