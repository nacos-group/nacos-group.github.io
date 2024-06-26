---
id: "question-history-14945"
title: "CVE-2021-29441 漏洞怎么修复 nacos-opensource"
date: "2024-06-03"
category: "expertConsultation"
description: "针对CVE-2021-29441漏洞的修复，可以按照以下步骤操作：1. **检查当前Nacos版本**：首先确认您使用的Nacos服务器版本。如果版本低于1.4.1，存在身份认证绕过漏洞，需要紧急升级。2. **升级Nacos至最新版本**：如果发现版本过低，应立即升级到1.4.1或更高版本，推荐升"
---

## 用户问题 ： 
 CVE-2021-29441 漏洞怎么修复 nacos-opensource 

---------------
## 专家官方解答 ：

针对CVE-2021-29441漏洞的修复，可以按照以下步骤操作：

1. **检查当前Nacos版本**：首先确认您使用的Nacos服务器版本。如果版本低于1.4.1，存在身份认证绕过漏洞，需要紧急升级。

2. **升级Nacos至最新版本**：如果发现版本过低，应立即升级到1.4.1或更高版本，推荐升级到最新稳定版。这可以通过访问Nacos官方GitHub仓库获取发行版或者查阅Nacos官方文档了解升级步骤。

3. **开启鉴权功能**：确保在nacos.properties或相应的配置文件中设置`nacos.core.auth.enabled=true`，以启用鉴权功能。

4. **修改默认密钥与标识**：为了进一步增强安全性，需修改以下配置项的默认值：
   - `nacos.core.auth.plugin.nacos.token.secret.key`
   - `nacos.core.auth.server.identity.key`
   - `nacos.core.auth.server.identity.value`

   应选择复杂且不易被猜测的值来替换这些默认密钥。

5. **重置nacos用户密码**：考虑对默认的nacos用户密码进行重置，确保其安全性。

6. **验证与测试**：完成上述步骤后，重启Nacos服务并进行充分的测试，包括验证身份认证功能是否正常工作，以及新设置的密钥是否生效。

7. **反馈与复查**：如果在执行上述步骤后，漏洞扫描工具仍报告存在身份认证绕过漏洞，可能是因为扫描器的误报。此时，建议联系提供扫描服务的安全工程师，请求他们根据最新的配置重新评估系统安全状况。

参考文档链接：
- [Nacos身份认证与鉴权配置指南](https://nacos.io/docs/latest/guide/user/auth/)
- [关于Nacos Token Secret Key的重要公告](https://nacos.io/blog/announcement-token-secret-key/?source=activity)

遵循以上步骤，可以有效解决CVE-2021-29441身份认证绕过漏洞问题，并提升Nacos系统的整体安全性。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：Nacos 身份认证绕过漏洞 
 
 *专家经验：/nacos/v1/cs/ops/derby接口是否有SQL注入漏洞 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=14946)给我们反馈。
