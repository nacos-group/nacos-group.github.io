---
id: "question-history-14916"
title: "nacos修复CVE-2024-22243这个漏洞了吗 nacos-opensource"
date: "2024-06-03"
category: "expertConsultation"
description: "针对问题「nacos-opensource nacos修复CVE-2024-22243这个漏洞了吗」，根据提供的知识内容，可以明确如下：是的，Nacos针对CVE-2024-22243漏洞已经提供了修复方案。为了修复此漏洞，用户需要采取以下步骤：1. 更新Nacos Server的`pom.xml`"
---

## 用户问题 ： 
 nacos修复CVE-2024-22243这个漏洞了吗 nacos-opensource 

---------------
## 专家官方解答 ：

针对问题「nacos-opensource nacos修复CVE-2024-22243这个漏洞了吗」，根据提供的知识内容，可以明确如下：

是的，Nacos针对CVE-2024-22243漏洞已经提供了修复方案。为了修复此漏洞，用户需要采取以下步骤：

1. 更新Nacos Server的`pom.xml`文件中Spring框架的依赖版本至5.3.34。具体操作是在`pom.xml`里将`<spring.version>`标签的值设置为`5.3.34`，即`<spring.version>5.3.34</spring.version>`。

2. 目前，此修复已在Nacos Server的主干开发版本2.4.0中合并了Spring依赖的修改。但请注意，截至参考内容发布时，Nacos 2.4.0版本尚未正式发布。因此，用户需持续关注Nacos官方发布页面[[https://nacos.io/download/nacos-server/]](https://nacos.io/download/nacos-server/)以获取2.4.0版本的发布信息，并在新版本发布后及时进行升级。

综上所述，虽然直接的补丁版本（如2.4.0）还未正式发布，但已知的修复措施是明确的，用户只需等待新版本并按照上述指示操作即可完成对该漏洞的修复。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：nacos CVE-2024-22243 情况说明 
 
 *专家经验：Nacos 身份认证绕过漏洞 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=14919)给我们反馈。
