---
id: "question-history-11417"
title: "如何docker部署nacos集群 nacos-opensource"
date: "2024-04-24"
category: expertConsultation
description: "nacos-opensource 如何docker部署nacos集群"
tags: ["docker","部署","nacos","集群"]
keywords: ["docker","部署","nacos","集群"]
---

## 用户问题 ： 
 如何docker部署nacos集群 nacos-opensource 

---------------
## 专家官方解答 ：

如何docker部署Nacos集群？

首先，我们来分析问题。要使用Docker部署Nacos集群，我们需要确保以下关键因素得到妥善处理：

1. **选择正确的Nacos Docker镜像**：应使用官方推荐或经过验证的稳定版本，以确保集群的可靠性和兼容性。
2. **配置鉴权**：为了保证Nacos集群的安全性，通常需要开启鉴权功能，并正确设置相关的鉴权参数。
3. **配置集群模式**：在Docker环境中部署Nacos集群，需要明确配置其为集群模式，并确保节点间能够正常通信。
4. **端口映射**：由于Docker容器运行在宿主机网络环境下，需要正确映射Nacos所需的端口，以便外部访问和节点间通信。

基于上述分析，结合我了解的知识中给出的建议，以下是详细部署Nacos集群的步骤：

**步骤1：选择并拉取Nacos Docker镜像**

使用官方提供的Nacos Docker镜像，确保版本为2.2.3或其他您所需的稳定版本。在命令行中执行以下命令拉取镜像：

```bash
docker pull nacos/nacos-server:2.2.3
```

**步骤2：设置环境变量以开启鉴权**

根据我了解的知识中提到的参数，为Docker容器设置相应的环境变量以启用鉴权。这里提供示例值，实际部署时请替换为您自己的密钥和身份标识：

```bash
export NACOS_AUTH_ENABLE=true
export NACOS_AUTH_TOKEN=nacos-secret-key
export NACOS_AUTH_IDENTITY_KEY=my-nacos-identity-key
export NACOS_AUTH_IDENTITY_VALUE=my-nacos-identity-value
```

**步骤3：创建Docker Compose文件以部署Nacos集群**

创建一个名为`docker-compose.yml`的文件，内容如下。确保调整`NACOS_SERVER_IP`和`CLUSTER_CONF`以适应您的实际环境（例如，使用不同节点的IP地址和端口）。此外，根据需要映射其他所需端口。

```yaml
version: '3'
services:
  nacos-1:
    image: nacos/nacos-server:2.2.3
    container_name: nacos-1
    environment:
      - NACOS_AUTH_ENABLE=${NACOS_AUTH_ENABLE}
      - NACOS_AUTH_TOKEN=${NACOS_AUTH_TOKEN}
      - NACOS_AUTH_IDENTITY_KEY=${NACOS_AUTH_IDENTITY_KEY}
      - NACOS_AUTH_IDENTITY_VALUE=${NACOS_AUTH_IDENTITY_VALUE}
      - MODE=cluster
      - NACOS_SERVER_IP=192.168.1.100
      - CLUSTER_CONF=192.168.1.100:8848,192.168.1.101:8848,192.168.1.102:8848
    ports:
      - "8848:8848"
      - "9848:9848"
      - "9849:9849"
      - "7848:7848"

  nacos-2:
    image: nacos/nacos-server:2.2.3
    container_name: nacos-2
    environment:
      - NACOS_AUTH_ENABLE=${NACOS_AUTH_ENABLE}
      - NACOS_AUTH_TOKEN=${NACOS_AUTH_TOKEN}
      - NACOS_AUTH_IDENTITY_KEY=${NACOS_AUTH_IDENTITY_KEY}
      - NACOS_AUTH_IDENTITY_VALUE=${NACOS_AUTH_IDENTITY_VALUE}
      - MODE=cluster
      - NACOS_SERVER_IP=192.168.1.101
      - CLUSTER_CONF=192.168.1.100:8848,192.168.1.101:8848,192.168.1.102:8848
    ports:
      - "8848:8848"
      - "9848:9848"
      - "9849:9849"
      - "7848:7848"

  nacos-3:
    image: nacos/nacos-server:2.2.3
    container_name: nacos-3
    environment:
      - NACOS_AUTH_ENABLE=${NACOS_AUTH_ENABLE}
      - NACOS_AUTH_TOKEN=${NACOS_AUTH_TOKEN}
      - NACOS_AUTH_IDENTITY_KEY=${NACOS_AUTH_IDENTITY_KEY}
      - NACOS_AUTH_IDENTITY_VALUE=${NACOS_AUTH_IDENTITY_VALUE}
      - MODE=cluster
      - NACOS_SERVER_IP=192.168.1.102
      - CLUSTER_CONF=192.168.1.100:8848,192.168.1.101:8848,192.168.1.102:8848
    ports:
      - "8848:8848"
      - "9848:9848"
      - "9849:9849"
      - "7848:7848"
```

**步骤4：启动Nacos集群**

在包含`docker-compose.yml`文件的目录下，执行以下命令启动Nacos集群：

```bash
docker-compose up -d
```

以上步骤完成后，您将在Docker环境中成功部署了一个由三个节点组成的Nacos集群，且已启用鉴权功能。您可以访问任意节点的8848端口（如 http://192.168.1.100:8848/nacos/ ）并通过登录界面验证鉴权功能是否生效，并确保节点间通信正常。

综上所述，通过选择合适的Nacos Docker镜像、设置鉴权环境变量、编写Docker Compose文件配置集群模式和端口映射，以及启动Nacos集群，我们完成了在Docker环境中部署Nacos集群的过程。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:Nacos k8s部署得nacos2.2.3版本集群模式怎么配置鉴权 
 
 *[Nacos功能和需求列表](https://nacos.io/docs/latest/archive/feature-list)
 
 *专家经验:Nacos部署开放端口，集群部署开通端口 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11712)给我们反馈。
