---
id: "question-history-13483"
title: "nacos 开启鉴权 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "要开启Nacos的鉴权功能，首先明确你的部署环境，这里提供非Docker环境、Docker环境以及Kubernetes环境下的操作指导。### 非Docker环境1. **修改配置文件**：   - 打开`application.properties`文件。   - 修改或添加以下配置项以开启鉴权："
tags: ["nacos-opensource","鉴权","开启鉴权"]
keywords: ["nacos-opensource","鉴权","开启鉴权"]
---

要开启Nacos的鉴权功能，首先明确你的部署环境，这里提供非Docker环境、Docker环境以及Kubernetes环境下的操作指导。

### 非Docker环境

1. **修改配置文件**：
   - 打开`application.properties`文件。
   - 修改或添加以下配置项以开启鉴权：
     ```properties
     nacos.core.auth.system.type=nacos
     nacos.core.auth.enabled=true
     ```
   - 可选地，自定义JWT密钥以增强安全性（确保密钥长度至少32字符，并进行Base64编码）：
     ```properties
     nacos.core.auth.default.token.secret.key=你的Base64编码密钥
     nacos.core.auth.plugin.nacos.token.secret.key=你的Base64编码密钥
     ```
   - 保存更改并重启Nacos服务端。

### Docker环境

#### 使用官方镜像

1. **启动容器时设置环境变量**：
   - 使用如下命令启动Nacos容器，开启鉴权及其他相关配置：
     ```powershell
     docker run \
       --env PREFER_HOST_MODE=hostname \
       --env MODE=standalone \
       --env NACOS_AUTH_ENABLE=true \
       --env NACOS_AUTH_TOKEN_EXPIRE_SECONDS=你期望的过期时间（默认18000秒） \
       --env NACOS_AUTH_TOKEN=你的Base64编码密钥（推荐修改） \
       --env NACOS_AUTH_CACHE_ENABLE=true/false（是否开启权限缓存，默认false） \
       -p 8848:8848 \
       nacos/nacos-server
     ```

#### 使用自定义镜像

1. **修改配置文件**：
   - 在构建镜像前，编辑Nacos源代码中的`application.properties`文件，设置与上述非Docker环境中相同或相似的鉴权配置。
2. **构建并运行自定义镜像**：
   - 完成配置修改后，构建你的自定义Docker镜像，并使用包含鉴权配置的命令运行容器。

### Kubernetes环境

1. **配置环境变量**：
   - 在Kubernetes的Deployment或StatefulSet配置中，通过环境变量方式设置鉴权参数，如：
     ```yaml
     spec:
       containers:
         - name: nacos-server
           image: nacos/nacos-server
           env:
             - name: NACOS_AUTH_ENABLE
               value: "true"
             - name: NACOS_AUTH_TOKEN
               value: "你的Base64编码密钥"
             # 其他鉴权相关环境变量...
     ```
   - 确保配置了所有必要的鉴权环境变量，并考虑使用ConfigMap或Secret来管理敏感信息。

### 注意事项

- 动态修改`token.secret.key`时，确保新密钥的有效性，避免登录异常。
- 对于Kubernetes部署，确保所有Nacos实例间的鉴权配置一致，避免因配置不一导致的访问问题。
- 详细文档和最新指南请参考官方资源：
  - [Nacos官方文档-鉴权](https://nacos.io/docs/latest/guide/user/auth/)
  - [Nacos Docker镜像说明](https://github.com/nacos-group/nacos-docker)
  
以上步骤适用于开启Nacos的鉴权功能，确保遵循每个步骤以正确配置和启用鉴权。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13908)给我们反馈。
