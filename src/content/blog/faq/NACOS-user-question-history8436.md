---
id: "question-history-8436"
title: "nacos docker如何运行 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "要运行Nacos using Docker，您可以遵循以下步骤：1. **准备环境**: 确保您的系统上已安装Docker并且Docker服务正在运行。2. **获取Nacos Docker镜像**: 您可以从Docker Hub获取最新的Nacos镜像，或者使用Nacos提供的特定版本。可以通过以"
tags: ["nacos","docker","运行"]
keywords: ["nacos","docker","运行"]
---

要运行Nacos using Docker，您可以遵循以下步骤：

1. **准备环境**: 确保您的系统上已安装Docker并且Docker服务正在运行。

2. **获取Nacos Docker镜像**: 您可以从Docker Hub获取最新的Nacos镜像，或者使用Nacos提供的特定版本。可以通过以下命令拉取官方镜像：
   ```bash
   docker pull nacos/nacos-server
   ```

3. **启动Nacos容器**: 使用以下命令启动Nacos服务作为一个Docker容器。这将映射Nacos的Web界面端口8848到主机的相同端口，并且配置Nacos以使用嵌入式数据库运行：
   ```bash
   docker run --name nacos-server -p 8848:8848 -d nacos/nacos-server
   ```
   如果您希望Nacos使用外部MySQL数据库，需要传递相应的环境变量到Docker容器，例如：
   ```bash
   docker run --name nacos-server \
              -p 8848:8848 \
              -e MODE=standalone \
              -e MYSQL_SERVICE_HOST=<your-mysql-host> \
              -e MYSQL_SERVICE_PORT=<your-mysql-port> \
              -e MYSQL_DATABASE=<your-db-name> \
              -e MYSQL_USER=<your-username> \
              -e MYSQL_PASSWORD=<your-password> \
              -d nacos/nacos-server
   ```
   具体的环境变量配置请参考Nacos官方文档。

4. **验证Nacos运行状态**: 访问`http://localhost:8848/nacos`，使用默认用户名`nacos`和密码`nacos`登录Nacos控制台，确认服务已经成功启动。

5. **（可选）配置持久化**: 对于生产环境，考虑将Nacos的数据目录映射到宿主机，以便数据持久化。可以通过在`docker run`命令中添加`-v`参数实现，例如：
   ```bash
   docker run ... -v <host-dir>:/home/nacos/data ...
   ```

通过上述步骤，您可以成功地基于Docker运行Nacos服务。更多高级配置和集群部署方法，请参考Nacos官方Docker部署文档[[链接](https://github.com/nacos-group/nacos-docker)]以及Kubernetes部署文档[[链接](https://github.com/nacos-group/nacos-k8s/blob/master/README-CN.md)]。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13656)给我们反馈。
