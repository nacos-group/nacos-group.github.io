---
id: "question-history-16278"
title: "如何处理网传的Nacos 0day漏洞"
date: "2024-07-24"
category: "expertConsultation"
description: "关于网传的Nacos 0day漏洞，根据已有知识，可以明确以下几点：1. **漏洞不实信息澄清**：Nacos社区已官方回应，所传的“0day漏洞”并不属实。涉及的运维接口`/nacos/v1/cs/ops/derby`和`/nacos/v1/cs/ops/data/removal`主要用于单机模式"
---

## 用户问题 ： 
 如何处理网传的Nacos 0day漏洞  

---------------
## 专家官方解答 ：

关于网传的Nacos "0day漏洞"，根据已有知识，可以明确以下几点：

1. **漏洞不实信息澄清**：Nacos社区已官方回应，所传的“0day漏洞”并不属实。涉及的运维接口`/nacos/v1/cs/ops/derby`和`/nacos/v1/cs/ops/data/removal`主要用于单机模式下的数据库运维，且强调在单机模式下如有安全需求应开启鉴权机制。官方回应链接：[本公告](https://nacos.io/blog/announcement-derby-ops-api/?source=news_announcement/)。

2. **安全加固建议**：
   - 对于使用单机模式的用户，Nacos社区建议开启鉴权机制以增强安全性。这可以通过设置相关配置实现，确保他人无法滥用接口。
   - 升级到Nacos 2.4.0及以上版本也是一个推荐做法，因为这些版本默认关闭了运维接口，从而减少了潜在风险。升级指南链接：[Nacos 2.4.0发布信息](https://nacos.io/blog/release-240/?source=news/)。

3. **身份认证绕过漏洞处理**：如果存在身份认证绕过漏洞的担忧，首先确认当前使用的Nacos版本。对于版本低于1.4.1的用户，需要升级并调整相关鉴权配置；1.4.5及以上或2.2.0.1及以上的版本则无此漏洞，但仍需检查配置是否为默认值。具体调整指引可参考：[Nacos鉴权文档](https://nacos.io/docs/latest/guide/user/auth/) 和 [身份认证绕过漏洞公告](https://nacos.io/blog/announcement-token-secret-key/?source=activity)。

4. **/nacos/v1/cs/ops/derby接口说明**：此接口并非SQL注入漏洞，而是专为Derby数据库运维设计，允许查询数据库数据以辅助问题排查。为防止非授权访问，建议实施鉴权措施，并确认仅管理员权限可访问。更多关于鉴权开启方法，请参考：[Nacos鉴权配置指南](https://nacos.io/docs/latest/guide/user/auth/)。

综上所述，处理网传Nacos "0day漏洞"的策略主要是：确认并升级至安全版本，开启鉴权机制，以及根据实际版本情况调整相关安全配置。这样既可以保护系统免受潜在威胁，也能确保运维接口的合理与安全使用。


<font color="#949494">---------------</font> 


## 参考链接 ：

* 专家经验：如何处理网传的Nacos “0day漏洞” 
 
 * 专家经验：Nacos 身份认证绕过漏洞 
 
 * 专家经验：/nacos/v1/cs/ops/derby接口是否有SQL注入漏洞 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=16279)给我们反馈。
