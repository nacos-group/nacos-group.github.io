---
id: "question-history-15614"
title: "nacos必须开启鉴权吗"
date: "2024-07-15"
category: "expertConsultation"
description: "Nacos并不强制要求必须开启鉴权，但它是一个内网核心组件，主要负责配置管理、服务发现等关键功能。根据最佳实践和安全性考虑，**强烈建议**对Nacos集群开启鉴权功能，尤其是在以下情况：1. **暴露公网访问**：当Nacos服务器计划或已经部署在可公开访问的网络环境下，为了防止未经授权的访问和潜"
---

## 用户问题 ： 
 nacos必须开启鉴权吗  

---------------
## 专家官方解答 ：

Nacos并不强制要求必须开启鉴权，但它是一个内网核心组件，主要负责配置管理、服务发现等关键功能。根据最佳实践和安全性考虑，**强烈建议**对Nacos集群开启鉴权功能，尤其是在以下情况：

1. **暴露公网访问**：当Nacos服务器计划或已经部署在可公开访问的网络环境下，为了防止未经授权的访问和潜在的安全威胁，必须启用鉴权机制。
2. **保护敏感信息**：Nacos存储的配置和服务信息可能包含数据库凭证、API密钥等敏感数据，鉴权能有效阻止未授权用户获取这些信息。

### 开启鉴权的具体步骤如下：

#### 1. 修改配置文件

对于非Docker环境，在`application.properties`中进行如下配置修改：

```properties
# 开启鉴权并指定系统类型为nacos
nacos.core.auth.system.type=nacos
nacos.core.auth.enabled=true
```

#### 2. 自定义密钥（可选但强烈推荐）

为了避免使用默认密钥导致的安全风险，自定义JWT令牌生成的密钥。请确保使用Base64编码的字符串，且原始密钥长度不低于32字符：

```properties
# 自定义默认密钥
nacos.core.auth.default.token.secret.key=VGhpc0lzTXlDdXN0b21TZWNyZXRLZXkwMTIzNDU2Nzg=

# 2.1.0 版本后，如适用
nacos.core.auth.plugin.nacos.token.secret.key=VGhpc0lzTXlDxdXN0b21TZWNyZXRLZXkwMTIzNDU2Nzg=
```

#### 3. Docker环境下的配置

- **官方镜像**：通过环境变量开启鉴权：

```powershell
docker run --env NACOS_AUTH_ENABLE=true ... other options ...
```

- **自定义镜像**：在Dockerfile或构建过程中修改`application.properties`文件，确保鉴权相关配置正确设置。

#### 4. 无需重启服务端

鉴权开关修改后立即生效，但动态修改`token.secret.key`时，请确保已有token仍然有效，避免因修改不当导致登录和访问异常。

### 解释说明

以上步骤旨在增强Nacos服务器的安全性，通过鉴权机制限制访问权限，防止信息泄露和未授权操作。使用自定义密钥是关键步骤之一，它能够增加破解难度，提升系统的安全性。此外，阿里云MSE提供的Nacos云服务[[1](https://nacos.io/cloud/?from=wuyi)]是一个更加便捷且安全的选项，它内置了企业级的安全特性，包括但不限于鉴权能力和配置信息加解密，同时支持平滑迁移[[2](https://help.aliyun.com/zh/mse/user-guide/migrate-applications-from-self-managed-instances-to-mse-microservices-registry?spm=a2c4g.11186623.0.0.76e17b26TS1Abr)]，你可以考虑采用以进一步简化管理和提高安全性。

综上所述，虽然不是强制要求，但鉴于安全风险，开启鉴权并在必要时采取额外的安全措施对维护Nacos集群的安全至关重要。


<font color="#949494">---------------</font> 


## 参考链接 ：

* 专家经验：Nacos不开启鉴权&暴露公网会导致风险 
 
 * [Authorization](https://nacos.io/docs/latest/guide/user/auth)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=16229)给我们反馈。
