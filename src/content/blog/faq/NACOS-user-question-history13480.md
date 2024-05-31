---
id: "question-history-13480"
title: "nacos 集群部署 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "在进行Nacos集群部署时，需关注以下几个关键步骤和注意事项，以确保部署的成功与安全性：### 1. 鉴权配置为了保障Nacos集群的安全，建议启用鉴权功能。根据Nacos官方文档，需要配置以下参数：- `nacos.core.auth.enabled`=true 开启鉴权功能。- `nacos.c"
tags: ["nacos","集群部署"]
keywords: ["nacos","集群部署"]
---

## 用户问题 ： 
 nacos 集群部署 nacos-opensource 

---------------
## 专家官方解答 ：

在进行Nacos集群部署时，需关注以下几个关键步骤和注意事项，以确保部署的成功与安全性：

### 1. 鉴权配置
为了保障Nacos集群的安全，建议启用鉴权功能。根据Nacos官方文档，需要配置以下参数：
- `nacos.core.auth.enabled`=true 开启鉴权功能。
- `nacos.core.auth.plugin.nacos.token.secret.key` 设置一个大于32位的字符串作为Token密钥，并进行Base64编码。
- `nacos.core.auth.server.identity.key` 与 `nacos.core.auth.server.identity.value` 用于服务间身份验证。

在Kubernetes (k8s) 环境下，可以通过设置环境变量实现：
- NACOS_AUTH_ENABLE=true
- NACOS_AUTH_TOKEN=（Base64编码后的密钥）
- NACOS_AUTH_IDENTITY_KEY=（自定义的标识键）
- NACOS_AUTH_IDENTITY_VALUE=（标识键的值）

### 2. 端口配置与开放
Nacos集群需要正确配置端口以确保服务间的通信无阻。默认情况下，Nacos会使用以下端口：
- 主端口（HTTP）: 8848
- 客户端gRPC端口: 9848
- 服务端gRPC端口: 9849
- Jraft请求服务端端口: 7848

在Kubernetes中，可以通过Service或者NodePort/LoadBalancer服务类型来公开必要的端口，通常至少需要公开8848和9848端口。

### 3. 集群模式配置
确保每个Nacos节点都知道其他节点的存在，这通常通过配置文件中的`cluster.conf`或相应的环境变量来实现。每个节点地址应列于此配置项中。

### 4. 部署策略选择
根据业务需求决定是否将配置中心与注册中心分离部署。对于资源有限或服务较少的场景，可考虑合并在同一集群部署。而对于大型复杂系统，建议配置中心与注册中心独立部署以提高隔离性、可用性和可管理性。

### 实施步骤概览
1. **准备环境**：确认Kubernetes集群已就绪，准备好Nacos的Docker镜像。
2. **配置鉴权**：按照上述鉴权参数设置环境变量。
3. **端口映射**：在Kubernetes的Deployment或Service定义中正确映射所需的端口。
4. **集群配置**：在每个Nacos实例的配置中指定其他节点地址。
5. **部署Nacos实例**：使用Kubernetes的Deployment资源部署Nacos Pod，并确保有适当的数量以满足高可用需求。
6. **服务发现与负载均衡**：配置Kubernetes Service确保外部访问和服务发现的正常运作。

参考链接：
- [Nacos官方鉴权文档](https://nacos.io/docs/latest/guide/user/auth/)
- [Nacos官方Docker部署说明](https://github.com/nacos-group/nacos-docker)
- [Nacos集群模式快速启动指南](https://nacos.io/docs/latest/guide/admin/cluster-mode-quick-start/)
- [Nacos升级与兼容性说明](https://nacos.io/docs/latest/upgrading/200-compatibility/)


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：Nacos部署集群模式怎么打开鉴权 
 
 *专家经验：Nacos部署开放端口，集群部署开通端口 
 
 *专家经验：NACOS 配置中心和注册中心是分两个集群部署还是放在一个集群中 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13905)给我们反馈。
