---
id: "question-history-11845"
title: "nacos v1 core cluster nodes 的访问权限如何关闭？防止漏洞"
date: "2024-07-01"
category: "expertConsultation"
description: "内容要有条理，分步骤：1. **问题原因分析：**   根据提供的知识内容，访问权限问题主要涉及Nacos的特定接口`/nacos/v1/core/cluster/nodes`，该接口在Nacos的旧版本中是公开的，但在2.3.0之后的版本中已被调整为需要Admin权限才能访问。这表明关闭或限制此接"
---

## 用户问题 ： 
 nacos v1 core cluster nodes 的访问权限如何关闭？防止漏洞  

---------------
## 专家官方解答 ：

内容要有条理，分步骤：

1. **问题原因分析：**
   根据提供的知识内容，访问权限问题主要涉及Nacos的特定接口`/nacos/v1/core/cluster/nodes`，该接口在Nacos的旧版本中是公开的，但在2.3.0之后的版本中已被调整为需要Admin权限才能访问。这表明关闭或限制此接口的访问权限主要是出于安全考虑，以防止未授权访问可能导致的信息泄露或恶意操作。

2. **解决方案步骤：**
   - **步骤一：版本升级**  
     首先，推荐将Nacos服务器的版本升级到2.3.0或更高版本。这样可以直接利用Nacos新版本中对`/nacos/v1/core/cluster/nodes`接口的内置权限管理功能，确保只有具有Admin权限的用户才能访问此接口。[[nacos-opensource](https://nacos.io/cloud/?from=wuyi)]
   
   - **步骤二：开启鉴权**  
     在完成版本升级后，确保Nacos服务端已开启鉴权功能。可以通过设置`nacos.core.auth.enabled=true`来开启全局鉴权。[[nacos-opensource](https://nacos.io/docs/latest/guide/user/auth/)]

   - **步骤三：配置安全策略**  
     为了进一步增强安全性，根据Nacos版本的不同，可能还需要修改一些安全相关的配置项，例如`nacos.core.auth.plugin.nacos.token.secret.key`、`nacos.core.auth.server.identity.key`、`nacos.core.auth.server.identity.value`等，避免使用默认值，以防止因使用默认配置而被轻易绕过鉴权。[[nacos-opensource](https://nacos.io/blog/announcement-token-secret-key/?source=activity)]

   - **步骤四：网络访问控制**  
     如果由于特殊原因无法立即升级，且客户端访问Nacos是在局域网环境下，可以通过配置防火墙规则或设置Nacos服务的白名单来限制外网对该接口的访问，作为一种临时的安全措施。

3. **解释：**
   以上步骤首先通过版本升级和开启鉴权从根本上解决了接口的权限控制问题，确保只有授权用户能访问敏感接口。修改默认安全配置项是为了增加攻击者破解难度，提高系统安全性。而网络访问控制作为辅助手段，可以在一定程度上缓解外部威胁。这些措施综合应用，可以有效关闭或严格控制`/nacos/v1/core/cluster/nodes`接口的访问权限，从而防止潜在的安全漏洞。


<font color="#949494">---------------</font> 


## 参考链接 ：

* 专家经验：/nacos/v1/core/cluster/nodes 这个访问权限如何关闭？ 
 
 * 专家经验：Nacos 身份认证绕过漏洞 
 
 * 专家经验：怎么能让nacos 的actuator 查不到任何信息呢 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=15995)给我们反馈。
