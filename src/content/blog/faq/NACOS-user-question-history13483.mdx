---
id: "question-history-13483"
title: "nacos 开启鉴权 nacos-opensource"
date: "2024-05-14"
category: expertConsultation
description: "nacos-opensource nacos 开启鉴权"
tags: ["开源","nacos","开启","鉴权"]
keywords: ["开源","nacos","开启","鉴权"]
---

## 用户问题 ： 
 nacos 开启鉴权 nacos-opensource 

---------------
## 专家官方解答 ：

要开启Nacos的鉴权功能，无论是非Docker环境、Docker环境还是k8s环境下的部署，都需要确保几个关键配置项正确设置。以下是基于提供的知识内容整理的步骤与说明：

### 非Docker环境开启鉴权

1. **编辑配置文件**：修改`application.properties`，确保以下配置项被设置：
   - `nacos.core.auth.system.type=nacos`
   - `nacos.core.auth.enabled=true`
   
   如果需要自定义密钥，可以设置：
   ```properties
   nacos.core.auth.default.token.secret.key=your_base64_encoded_secret_key
   nacos.core.auth.plugin.nacos.token.secret.key=your_base64_encoded_secret_key
   ```
   确保密钥经过Base64编码且长度超过32字符。

2. **无需重启**：鉴权开关修改后立即生效，但动态修改`token.secret.key`时需保证新密钥有效，避免登录异常。

### Docker环境开启鉴权

#### 使用官方镜像

1. **启动容器时设置环境变量**：
   ```powershell
   docker run \
     --env PREFER_HOST_MODE=hostname \
     --env MODE=standalone \
     --env NACOS_AUTH_ENABLE=true \
     -p 8848:8848 \
     nacos/nacos-server
   ```
   可根据需求添加其他鉴权相关的环境变量，如`NACOS_AUTH_TOKEN_EXPIRE_SECONDS`、`NACOS_AUTH_TOKEN`等。

#### 自定义镜像

1. **修改配置文件**：在构建镜像前，更改`application.properties`中的相应配置为：
   - `nacos.core.auth.system.type=nacos`
   - `nacos.core.auth.enabled=true`
   
2. **构建并运行自定义镜像**：确保配置文件中的改动被应用至Docker镜像中，并正常启动容器。

### k8s环境部署Nacos集群模式

1. **设置环境变量**：在Kubernetes部署配置中，为每个Nacos实例的Pod设置必要的环境变量，如`NACOS_AUTH_ENABLE=true`、`NACOS_AUTH_TOKEN=your_base64_encoded_secret_key`等。

### 共通注意事项

- **密钥管理**：确保所有节点使用相同的密钥，以免因密钥不一致导致403错误。
- **文档参考**：具体配置详情和最新实践可参考Nacos官方文档：[Nacos鉴权指南](https://nacos.io/docs/latest/guide/user/auth/) 和 [Nacos Docker镜像文档](https://github.com/nacos-group/nacos-docker)。

通过以上步骤，即可在不同环境下成功开启Nacos的鉴权功能，确保服务安全可控。


<font color="#949494">---------------</font> 


## 参考链接 ：

*[Authorization](https://nacos.io/docs/latest/guide/user/auth)
 
 *专家经验:Nacos k8s部署得nacos2.2.3版本集群模式怎么配置鉴权 
 
 *[鉴权插件](https://nacos.io/docs/latest/plugin/auth-plugin)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13496)给我们反馈。
