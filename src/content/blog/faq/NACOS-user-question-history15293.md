---
id: "question-history-15293"
title: "http: 127.0.0.1:8848 nacos v1 core cluster nodes naco nacos-opensource"
date: "2024-06-13"
category: "expertConsultation"
description: "为了解决您提到的nacos存在未授权访问的安全漏洞，我们可以按照以下步骤操作：### 1. **确定当前Nacos版本**首先，确认您当前使用的Nacos服务版本。这一步很关键，因为不同版本的解决方案有所差异。### 2. **升级Nacos版本（推荐）**- 如果您的Nacos版本低于2.3.0，"
---

## 用户问题 ： 
 http: 127.0.0.1:8848 nacos v1 core cluster nodes nacos存在未授权访问，这个安全漏洞怎么修复 nacos-opensource 

---------------
## 专家官方解答 ：

为了解决您提到的nacos存在未授权访问的安全漏洞，我们可以按照以下步骤操作：

### 1. **确定当前Nacos版本**
首先，确认您当前使用的Nacos服务版本。这一步很关键，因为不同版本的解决方案有所差异。

### 2. **升级Nacos版本（推荐）**
- 如果您的Nacos版本低于2.3.0，强烈建议您升级到2.3.0或更高版本。从2.3.0开始，`/nacos/v1/core/cluster/nodes`接口需要Admin权限才能访问，这直接解决了未授权访问的问题。升级步骤通常包括下载新版本、备份数据、停止旧服务、替换新文件、启动新服务等。

### 3. **开启鉴权**
无论您是否能立即升级，都需要确保Nacos服务端已开启鉴权。在配置文件中设置`nacos.core.auth.enabled=true`来开启鉴权功能。

### 4. **修改默认密钥和配置**
对于版本1.4.1及以后，特别是如果您的密钥仍然是默认值，务必修改以下配置项以增强安全性：
- `nacos.core.auth.plugin.nacos.token.secret.key`
- `nacos.core.auth.server.identity.key`
- `nacos.core.auth.server.identity.value`

具体的修改方法和推荐做法可参考Nacos官方文档：[身份验证配置指南](https://nacos.io/docs/latest/guide/user/auth/)

### 5. **网络访问控制**
如果Nacos服务只应被内部网络访问，考虑在网络层面限制外部访问，比如使用防火墙规则或者配置白名单仅允许特定IP访问。

### 6. **考虑阿里云MSE**
如果条件允许，可以选择阿里云的商业产品[MSE](https://www.aliyun.com/product/aliware/mse?spm=5176.28093861.0.0.5043510c7WFzAm&scm=20140722.X_data-499c7d713c8221078253._.V_1)，它不仅提供Nacos服务，还内置了安全防护措施，能够自动解决类似的安全隐患。

### 解释：
- 升级Nacos版本是最根本的解决办法，因为新版本直接限制了敏感接口的无授权访问。
- 开启鉴权并修改默认密钥是为了防止恶意用户利用已知默认配置进行攻击。
- 网络访问控制是从物理层面上增加额外的安全屏障。
- 推荐阿里云MSE是考虑到其为企业级应用提供了更全面的安全保障和服务支持。

请根据您的实际情况选择合适的解决方案并尽快实施，以确保系统的安全稳定运行。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：/nacos/v1/core/cluster/nodes 这个访问权限如何关闭？ 
 
 *专家经验：Nacos 身份认证绕过漏洞 
 
 *专家经验：【阿里云】根据监管部门开展的网络安全检查，发现您的阿里云IP:xxx上的Nacos服务存在高危安全问题，可能导致数据或资金损失，请尽快修复 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=15308)给我们反馈。
