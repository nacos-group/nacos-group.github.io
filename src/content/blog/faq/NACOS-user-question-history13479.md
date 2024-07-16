---
id: "question-history-13479"
title: "linux部署nacos"
date: "2024-07-01"
category: "expertConsultation"
description: "要在Linux上部署Nacos，可以遵循以下详细步骤，这些步骤基于提供的知识内容：### 1. 准备环境确保您的Linux系统满足以下要求：- **操作系统**: 64位的Linux/Unix/Mac/Windows，推荐使用Linux/Unix/Mac。- **Java**: 需要安装64位的JD"
---

## 用户问题 ： 
 linux部署nacos  

---------------
## 专家官方解答 ：

要在Linux上部署Nacos，可以遵循以下详细步骤，这些步骤基于提供的知识内容：

### 1. 准备环境

确保您的Linux系统满足以下要求：
- **操作系统**: 64位的Linux/Unix/Mac/Windows，推荐使用Linux/Unix/Mac。
- **Java**: 需要安装64位的JDK 1.8或更高版本。如果您还没有安装，可以从[这里下载](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)并按照[官方指南](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/)进行配置。
- **Maven**: 安装Maven 3.2.x或更高版本。您可以通过[此链接下载](https://maven.apache.org/download.cgi)并按照[Maven配置指南](https://maven.apache.org/settings.html)进行配置。

### 2. 获取Nacos

#### 通过源码获取
```bash
git clone https://github.com/alibaba/nacos.git
cd nacos/
mvn -Prelease-nacos -Dmaven.test.skip=true clean install -U
ls -al distribution/target/
cd distribution/target/nacos-server-$version/nacos/bin
```
这里的`$version`需要替换为您实际克隆的Nacos版本号。

#### 或者下载编译后的压缩包
- 访问[Nacos的GitHub Release页面](https://github.com/alibaba/nacos/releases)，下载最新稳定版本的`nacos-server-$version.zip`或`targz`包。
- 解压下载的文件：
```bash
unzip nacos-server-$version.zip 或者 tar -xvf nacos-server-$version.tar.gz
cd nacos/bin
```

### 3. 启动Nacos服务器

对于生产环境，推荐以集群模式部署Nacos，但这里提供单机模式作为示例：

```bash
bash startup.sh -m standalone
```
如果您使用的是Ubuntu系统并且运行脚本时报错，尝试使用`bash`代替`sh`。

### 4. 配置与优化

- **端口配置**: 默认情况下，Nacos使用8848作为主端口，但根据您的网络环境，您可能需要调整这些端口并通过`server.port`配置。关于Nacos端口的详细信息，请参考[官方文档](https://nacos.io/docs/latest/guide/admin/cluster-mode-quick-start/)。
- **关闭双写**: 在集群部署稳定后，考虑性能优化，可以通过API关闭双写功能：
```bash
curl -X PUT 'localhost:8848/nacos/v1/ns/operator/switches?entry=doubleWriteEnabled&value=false'
```
请确保在关闭双写前，您的集群已成功运行并验证无误，因为这将影响到平滑降级的能力。

### 5. 后续操作与监控

- **日志检查**: 通过查看`logs/naming-server.log`文件，确认Nacos服务启动成功并监控其运行状态。
- **健康检查**: 根据需要，通过Nacos提供的API或界面进行服务的健康检查和管理。

### 总结

以上步骤涵盖了在Linux系统上部署Nacos的基本流程。请根据实际情况调整配置，比如选择合适的部署模式（单机或集群）、调整端口设置等。确保每一步操作成功后，再进行下一步，以避免部署过程中出现问题。此外，持续关注Nacos的官方文档和社区更新，以便获取最新的部署指导和最佳实践。


<font color="#949494">---------------</font> 


## 参考链接 ：

* 专家经验：Nacos部署开放端口，集群部署开通端口 
 
 * [Nacos 2.0 升级文档](https://nacos.io/docs/latest/upgrading/200-upgrading)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=16001)给我们反馈。
