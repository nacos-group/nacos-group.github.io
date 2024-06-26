---
id: "question-history-13476"
title: "nacos如何启动 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "启动Nacos服务端取决于您所处的环境（非Docker或Docker环境）以及是否需要启用鉴权。以下是根据您的需求整理的启动步骤：### 非Docker环境下启动Nacos并启用鉴权：1. **修改配置文件**：打开Nacos的`application.properties`文件，进行以下修改以启用"
tags: ["启动"]
keywords: ["启动"]
---

启动Nacos服务端取决于您所处的环境（非Docker或Docker环境）以及是否需要启用鉴权。以下是根据您的需求整理的启动步骤：

### 非Docker环境下启动Nacos并启用鉴权：

1. **修改配置文件**：打开Nacos的`application.properties`文件，进行以下修改以启用鉴权：
   - 设置鉴权系统类型及启用鉴权：
     ```properties
     nacos.core.auth.system.type=nacos
     nacos.core.auth.enabled=true
     ```
   - 可选：自定义密钥，确保安全性。使用Base64编码的字符串，且密钥长度至少32字符：
     ```properties
     nacos.core.auth.default.token.secret.key=您的Base64编码密钥
     nacos.core.auth.plugin.nacos.token.secret.key=与上相同的Base64编码密钥
     ```

2. **启动Nacos服务端**：根据您的环境和平台，使用相应的脚本或命令启动Nacos服务端。例如，在Linux环境下，您可能通过执行类似`sh startup.sh -m standalone`的命令来启动（确保已正确配置JAVA_HOME等环境变量）。

### Docker环境下启动Nacos并启用鉴权：

1. **使用官方镜像**：
   - **启动命令**：使用Docker命令行，加上鉴权相关的环境变量来启动容器，如：
     ```powershell
     docker run --env PREFER_HOST_MODE=hostname --env MODE=standalone \
                --env NACOS_AUTH_ENABLE=true \
                -p 8848:8848 nacos/nacos-server
     ```
     您还可以根据需要设置其他鉴权相关环境变量，如`NACOS_AUTH_TOKEN_EXPIRE_SECONDS`来调整token失效时间。

2. **使用自定义镜像**：
   - **修改配置**：在构建自定义镜像前，编辑Nacos的`application.properties`，确保鉴权配置正确设置。
   - **构建并运行**：修改配置后，构建您的Docker镜像，然后使用类似于上述官方镜像的命令，但指向您的自定义镜像来启动容器。

### 启用Nacos在Spring应用中的服务发现与配置管理：

- **注解驱动**：在Spring Boot应用的主类或配置类上添加`@EnableNacos`注解来启用Nacos的功能。这将同时启用服务发现和服务配置管理。

请注意，上述步骤提供了启动Nacos服务端及在Spring应用中启用Nacos的基本指导。具体操作可能还需参照您的实际环境和版本做出适当调整。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13901)给我们反馈。
