---
id: "question-history-15416"
title: "如何解决Nacos serverIdentity 权限绕过的问题"
date: "2024-07-01"
category: "expertConsultation"
description: "为了解决Nacos serverIdentity权限绕过的问题，我们首先需要明确您的Nacos服务器当前的版本情况及配置状态。根据已有的知识，以下是分析与建议步骤：### 问题原因分析- 在Nacos早期版本中，存在身份认证绕过漏洞，这通常与未正确配置鉴权参数或使用默认密钥值相关。- 特别是当`na"
---

## 用户问题 ： 
 如何解决Nacos serverIdentity 权限绕过的问题  

---------------
## 专家官方解答 ：

为了解决Nacos serverIdentity权限绕过的问题，我们首先需要明确您的Nacos服务器当前的版本情况及配置状态。根据已有的知识，以下是分析与建议步骤：

### 问题原因分析
- 在Nacos早期版本中，存在身份认证绕过漏洞，这通常与未正确配置鉴权参数或使用默认密钥值相关。
- 特别是当`nacos.core.auth.enabled`未设置为`true`，以及`nacos.core.auth.plugin.nacos.token.secret.key`、`nacos.core.auth.server.identity.key`、`nacos.core.auth.server.identity.value`保持默认值时，容易遭受此类攻击。

### 解决步骤
1. **确认Nacos版本**：首先，您需要确定当前运行的Nacos服务器版本。如果版本低于1.4.1，请直接跳至步骤3。如果版本位于1.4.1至1.4.4之间或2.0.0至2.2.0之间，请检查步骤2。对于1.4.5及以上或2.2.0.1及以上的版本，理论上不存在该漏洞，但若扫描工具仍报告问题，请联系安全工程师复查。

2. **修改默认配置**：对于存在风险的版本，请确保执行以下操作：
   - 设置`nacos.core.auth.enabled=true`以启用鉴权。
   - 修改`nacos.core.auth.plugin.nacos.token.secret.key`、`nacos.core.auth.server.identity.key`、`nacos.core.auth.server.identity.value`的默认值为自定义的、安全的值。
   - 参考官方文档进行配置更改：[Nacos身份验证指南](https://nacos.io/docs/latest/guide/user/auth/)

3. **版本升级**：强烈建议将Nacos升级到最新稳定版本。至少应升级到1.4.5或2.2.0.1以上，这些版本已修补了已知的身份认证绕过漏洞。查看[官方发布页面](https://github.com/alibaba/nacos/releases)获取最新版本信息。

4. **特别处理**：若因特殊原因无法立即升级，且版本低于2.3.0，考虑限制外部访问，通过防火墙规则或IP白名单仅允许内部网络访问Nacos服务，降低风险。

### 解释
- 步骤1至步骤3旨在从根本上解决身份认证绕过的问题，通过升级软件、加强鉴权配置来提升系统安全性。
- 特别强调版本升级是因为新版本通常包含了对已知安全问题的修复，是应对安全漏洞的最佳实践。
- 对于无法直接升级的情况，采取网络访问控制是一种临时但有效的缓解措施。

请按照上述步骤操作，并根据实际情况调整解决方案。如果在实施过程中遇到具体技术难题，进一步的细节查询或帮助请求将更加有效。


<font color="#949494">---------------</font> 


## 参考链接 ：

* 专家经验：Nacos 身份认证绕过漏洞 
 
 * 专家经验：/nacos/v1/core/cluster/nodes 这个访问权限如何关闭？ 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=16010)给我们反馈。
