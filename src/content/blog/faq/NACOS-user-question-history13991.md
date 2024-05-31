---
id: "question-history-13991"
title: "nacos安装配置和部署教程 nacos-opensource"
date: "2024-05-22"
category: "expertConsultation"
description: "要进行Nacos的安装配置和部署，您可以遵循以下详细步骤：### 1. 版本选择- **推荐版本**：根据官方推荐，稳定版本为2.3.2。请访问[Nacos Release Notes](https://github.com/alibaba/nacos/releases)以获取最新信息。### 2."
tags: ["安装配置","部署教程"]
keywords: ["安装配置","部署教程"]
---

要进行Nacos的安装配置和部署，您可以遵循以下详细步骤：

### 1. 版本选择
- **推荐版本**：根据官方推荐，稳定版本为2.3.2。请访问[Nacos Release Notes](https://github.com/alibaba/nacos/releases)以获取最新信息。

### 2. 预备环境准备
- **操作系统**：确保使用64位的Linux/Unix/Mac/Windows系统，推荐Linux/Unix/Mac。
- **Java环境**：安装并配置Java 1.8+版本。[下载地址](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) & [配置指南](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/)。
- **Maven环境**：安装Maven 3.2.x+版本。[下载地址](https://maven.apache.org/download.cgi) & [配置指南](https://maven.apache.org/settings.html)。

### 3. 下载与安装
#### 通过源码
```shell
git clone https://github.com/alibaba/nacos.git
cd nacos/
mvn -Prelease-nacos -Dmaven.test.skip=true clean install -U
cd distribution/target/nacos-server-$version/nacos/bin
```
#### 或通过发行包
- 从[Nacos Releases](https://github.com/alibaba/nacos/releases)下载`nacos-server-$version.zip`或`.tar.gz`。
- 解压并进入`nacos/bin`目录。

### 4. 修改配置文件（非必须，但强烈建议）
- 在`conf/application.properties`中，建议设置`nacos.core.auth.plugin.nacos.token.secret.key`以增强安全性。具体设置方法请参考[鉴权-自定义密钥](https://nacos.io/plugin/auth-plugin/)。

### 5. 启动Nacos服务器
- **Linux/Unix/Mac**:
  ```shell
  sh startup.sh -m standalone
  ```
  若Ubuntu系统遇到运行错误，尝试使用：
  ```shell
  bash startup.sh -m standalone
  ```
- **Windows**:
  ```shell
  startup.cmd -m standalone
  ```

### 注意事项
- 运行Nacos建议的最低硬件配置为2C4G 60G。
- Nacos 2.1及以上版本无需关注双写模式的开关，因为这些版本默认不启用双写模式或已提供相应配置选项。

### 服务注册与配置管理示例
- **服务注册**：
  ```shell
  curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=您的IP&port=端口号'
  ```
- **获取配置**：
  ```shell
  curl -X GET 'http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test'
  ```

### 服务器关闭
- **Linux/Unix/Mac**:
  ```shell
  sh shutdown.sh
  ```
- **Windows**:
  ```shell
  shutdown.cmd
  ```

以上步骤涵盖了Nacos的基本安装配置和部署流程，确保每一步操作成功后再进行下一步，以避免配置或启动时的常见问题。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=14009)给我们反馈。
