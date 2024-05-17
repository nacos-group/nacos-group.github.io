---
id: "question-history-8444"
title: "各位大佬，想咨询下，怎么在 Nacos 2.3.0 通过helm方式部署设置开启授权认证功能？ nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource 各位大佬，想咨询下，怎么在 Nacos 2.3.0 通过helm方式部署设置开启授权认证功能？"
tags: ["Nacos","2.3.0","helm","授权认证","部署设置"]
keywords: ["Nacos","2.3.0","helm","授权认证","部署设置"]
---

## 用户问题 ： 
 各位大佬，想咨询下，怎么在 Nacos 2.3.0 通过helm方式部署设置开启授权认证功能？ nacos-opensource 

---------------
## 专家官方解答 ：

在Nacos 2.3.0版本中，您希望通过Helm方式部署并开启授权认证功能。根据提供的我了解的知识, Nacos开启鉴权主要涉及以下四个关键参数：

1. `nacos.core.auth.enabled`
2. `nacos.core.auth.plugin.nacos.token.secret.key`
3. `nacos.core.auth.server.identity.key`
4. `nacos.core.auth.server.identity.value`

对于使用Kubernetes (K8S) 和Docker部署Nacos集群模式的情况，可以通过设置相应的环境变量来开启鉴权：

- NACOS_AUTH_ENABLE
- NACOS_AUTH_TOKEN
- NACOS_AUTH_IDENTITY_KEY
- NACOS_AUTH_IDENTITY_VALUE

然而，对于使用Helm图表部署Nacos，您需要在Helm chart的配置文件或安装过程中指定这些环境变量，以便在部署时自动应用到Nacos容器中。以下是基于Helm方式部署Nacos并开启授权认证功能的具体步骤：

**步骤一：获取Nacos Helm Chart**

确保已安装Helm客户端，并添加Nacos官方Helm仓库（如果尚未添加）：

```bash
helm repo add nacos https://nacos.io/charts/
helm repo update
```

**步骤二：创建Helm values.yaml文件（或修改现有文件）**

创建一个名为`values.yaml`的文件（或直接编辑已有的该文件），用于覆盖默认的Helm chart配置。在此文件中添加或修改以下内容以设置授权认证相关的环境变量：

```yaml
server:
  env:
    # 开启鉴权
    NACOS_AUTH_ENABLE: "true"

    # 设置用于生产Token的密钥
    NACOS_AUTH_TOKEN: "<your_token_secret_key>"

    # 设置服务端之间请求的身份识别键
    NACOS_AUTH_IDENTITY_KEY: "<your_identity_key>"

    # 设置服务端之间请求的身份识别值
    NACOS_AUTH_IDENTITY_VALUE: "<your_identity_value>"
```

请替换 `<your_token_secret_key>`、`<your_identity_key>` 和 `<your_identity_value>` 为实际的密钥和值。这些值应具有足够的复杂性和保密性，以保证鉴权的安全性。

**步骤三：安装或升级Nacos Helm Chart**

使用以下命令安装或升级Nacos，同时指定自定义的`values.yaml`文件：

```bash
helm upgrade --install my-nacos nacos/nacos -f values.yaml
```

这里假设您使用`my-nacos`作为Helm release名称。如果已有同名的Nacos部署，此命令将执行升级操作，否则将进行新部署。确保Helm chart版本与您所需的Nacos 2.3.0版本相符。

通过以上步骤，您已成功使用Helm方式部署Nacos 2.3.0，并开启了授权认证功能。这些步骤依据我了解的知识中提到的开启鉴权所需的关键参数及环境变量设置方法，结合Helm部署的具体实践，实现了在部署过程中配置鉴权功能的目标。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:Nacos k8s部署得nacos2.2.3版本集群模式怎么配置鉴权 
 
 *专家经验:Nacos 身份认证绕过漏洞 
 
 *专家经验:Nacos raft日志太大怎么清理 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11625)给我们反馈。
