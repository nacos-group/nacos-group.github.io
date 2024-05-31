---
id: "question-history-14006"
title: "nacos 安装的详细步骤说明,linux docker nacos-opensource"
date: "2024-05-22"
category: "expertConsultation"
description: "要在Linux环境下通过Docker安装Nacos，请按照以下详细步骤操作：1. **克隆Nacos-Docker项目**:   首先，打开终端并运行以下命令以克隆Nacos-Docker项目从GitHub到本地环境。   ```bash   git clone https://github.com"
tags: ["nacos","安装","详细步骤","说明","linux","docker"]
keywords: ["nacos","安装","详细步骤","说明","linux","docker"]
---

## 用户问题 ： 
 nacos 安装的详细步骤说明,linux docker nacos-opensource 

---------------
## 专家官方解答 ：

要在Linux环境下通过Docker安装Nacos，请按照以下详细步骤操作：

1. **克隆Nacos-Docker项目**:
   首先，打开终端并运行以下命令以克隆Nacos-Docker项目从GitHub到本地环境。

   ```bash
   git clone https://github.com/nacos-group/nacos-docker.git
   cd nacos-docker
   ```

2. **选择运行模式**:
   Nacos支持多种运行模式，包括单机模式（使用Derby或MySQL作为存储）和集群模式。以下是不同模式的启动方法：

   - **单机模式 - Derby**:
     如果你想快速启动一个使用Derby数据库的单机版Nacos，执行以下命令：

     ```bash
     docker-compose -f example/standalone-derby.yaml up
     ```

   - **单机模式 - MySQL**:
     若需使用MySQL作为数据存储，根据你的MySQL版本选择相应的yaml文件启动：

     - 对于MySQL 5.7:

       ```bash
       docker-compose -f example/standalone-mysql-5.7.yaml up
       ```

     - 对于MySQL 8:

       ```bash
       docker-compose -f example/standalone-mysql-8.yaml up
       ```

   - **集群模式**:
     若要部署Nacos集群，使用以下命令，注意这通常需要预先配置好相关网络和主机名解析：

     ```bash
     docker-compose -f example/cluster-hostname.yaml up
     ```

3. **验证Nacos服务**:
   成功启动后，可以通过访问Nacos控制台来验证服务是否正常运行：

   - **控制台访问**:
     打开浏览器，访问 `http://127.0.0.1:8848/nacos/`。默认用户名和密码都是 `nacos`。

4. **服务注册与发现示例**:
   一旦Nacos服务器运行起来，你可以开始进行服务的注册与发现。以下是一些基本的CURL命令示例：

   - **服务注册**:
     ```bash
     curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.10&port=8080'
     ```

   - **服务发现**:
     ```bash
     curl -X GET 'http://127.0.0.1:8848/nacos/v1/ns/instance/list?serviceName=nacos.naming.serviceName'
     ```

以上步骤覆盖了在Linux系统上通过Docker部署Nacos的主要流程，确保每一步都成功执行且符合你的环境配置。如果遇到问题，可以查阅Nacos官方文档或在GitHub项目页面寻找解决方案。


<font color="#949494">---------------</font> 


## 参考链接 ：

*[Nacos Docker 快速开始](https://nacos.io/docs/latest/quickstart/quick-start-docker)
 
 *[Nacos 2.0 升级文档](https://nacos.io/docs/latest/upgrading/200-upgrading)
 
 *[Nacos功能和需求列表](https://nacos.io/docs/latest/archive/feature-list)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=14015)给我们反馈。
