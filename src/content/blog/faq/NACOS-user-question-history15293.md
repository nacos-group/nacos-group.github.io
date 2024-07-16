---
id: "question-history-15293"
title: "http: 127.0.0.1:8848 nacos v1 core cluster nodes naco"
date: "2024-07-01"
category: "expertConsultation"
description: "根据已有的知识，针对您提出的问题“nacos-opensource http://127.0.0.1:8848/nacos/v1/core/cluster/nodes 存在未授权访问，这个安全漏洞怎么修复”，我们可以按照以下逻辑进行分析与解答：### 1. 分析问题原因- 根据第1篇参考内容，我们知"
---

## 用户问题 ： 
 http: 127.0.0.1:8848 nacos v1 core cluster nodes nacos存在未授权访问，这个安全漏洞怎么修复  

---------------
## 专家官方解答 ：

根据已有的知识，针对您提出的问题“nacos-opensource http://127.0.0.1:8848/nacos/v1/core/cluster/nodes 存在未授权访问，这个安全漏洞怎么修复”，我们可以按照以下逻辑进行分析与解答：

### 1. 分析问题原因

- 根据第1篇参考内容，我们知道在Nacos的旧版本中，`/nacos/v1/core/cluster/nodes`接口是公开的，允许未经身份验证的访问。但在Nacos 2.3.0及之后的版本中，该接口已被限制为需要Admin权限才能访问。因此，未授权访问的问题可能是由于Nacos服务器版本较旧或者虽然版本满足条件但未正确配置鉴权所致。

### 2. 提供解决方案

#### 步骤一：检查Nacos版本

- **执行操作**：首先，确认当前运行的Nacos服务器版本。如果版本低于2.3.0，请立即进行升级。

#### 步骤二：开启鉴权

- **执行操作**：确保Nacos服务端已开启鉴权。这通常涉及修改Nacos配置中的`nacos.core.auth.enabled`参数，将其设为`true`。根据第3篇参考内容，还需要正确配置其他鉴权相关参数，如`nacos.core.auth.plugin.nacos.token.secret.key`等，避免使用默认值以提升安全性。

#### 步骤三：配置访问控制

- **执行操作**：对于具体接口访问权限的控制，根据Nacos的版本和配置，可能需要在配置文件中进一步细化哪些角色或用户可以访问特定API，确保只有具有相应权限的用户或服务能访问`/nacos/v1/core/cluster/nodes`。

#### 步骤四：验证修复

- **执行操作**：完成上述步骤后，重启Nacos服务，并尝试再次访问`http://127.0.0.1:8848/nacos/v1/core/cluster/nodes`，以验证未授权访问的问题是否已被修复。

### 3. 解释

- 升级Nacos版本至2.3.0及以上并开启鉴权是解决此问题的关键步骤，因为这些版本加强了对敏感接口的访问控制。通过修改配置参数，可以有效地限制未授权的访问请求，从而提高系统的安全性。
- 配置具体的鉴权参数并避免使用默认值，是为了增加攻击者破解难度，防止因使用默认配置而造成的潜在安全风险。

### 注意

- 如果在执行上述步骤后问题依旧存在，或者有其他特定情况，请参照Nacos官方文档提供的详细指南进行深入排查或寻求专业支持。
- 若您的应用场景有特殊需求，比如必须保持现有Nacos版本不变，那么考虑采取网络层面的保护措施，如防火墙规则或IP白名单限制外部访问，但请注意这并非长久之计，升级和正确配置鉴权才是根本解决之道。

### 参考链接

- [Nacos官方文档 - 用户鉴权](https://nacos.io/docs/latest/guide/user/auth/)
- [Nacos Docker部署说明](https://github.com/nacos-group/nacos-docker)
- [Nacos身份认证绕过漏洞解决方案](https://nacos.io/blog/announcement-token-secret-key/?source=activity)

希望以上信息能帮助您有效解决Nacos的未授权访问问题。


<font color="#949494">---------------</font> 


## 参考链接 ：

* 专家经验：/nacos/v1/core/cluster/nodes 这个访问权限如何关闭？ 
 
 * 专家经验：Nacos 身份认证绕过漏洞 
 
 * 专家经验：Nacos部署集群模式怎么打开鉴权 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=16009)给我们反馈。
