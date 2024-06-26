---
id: "question-history-15649"
title: "com.alibaba.nacos.api.exception.NacosException: faile nacos-opensource"
date: "2024-06-18"
category: "expertConsultation"
description: "根据您提供的错误信息，`nacos-opensource com.alibaba.nacos.api.exception.NacosException: failed to req API:archive-eureka:8848/nacos/v1/ns/instance/list. code:400"
---

## 用户问题 ： 
 com.alibaba.nacos.api.exception.NacosException: failed to req API:archive-eureka:8848 nacos v1 ns instance list. code:400 msg: Param 'serviceName' is illegal, illegal characters should not appear in the param. nacos-opensource 

---------------
## 专家官方解答 ：

根据您提供的错误信息，`nacos-opensource com.alibaba.nacos.api.exception.NacosException: failed to req API:archive-eureka:8848/nacos/v1/ns/instance/list. code:400 msg: Param 'serviceName' is illegal, illegal characters should not appear in the param.` 这个错误表明您在尝试通过Nacos API列出实例时，传入的服务名称(`serviceName`)包含了不被允许的非法字符。

依托于已知的知识，我们可以分析问题原因及提供相应的解决步骤：

### 分析问题原因

1. **参数校验失败**：Nacos服务端在接收到您的请求后，进行了参数校验，并发现`serviceName`参数含有不应该出现的字符。
2. **非法字符限制**：根据Nacos的参数校验规则，服务名称应满足正则表达式`^(?!@).((?!@@)[^\u4E00-\u9FA5])*$`，这意味着服务名称不能包含中文字符，不能以`@`开头，也不能连续出现两个`@`符号。

### 解决步骤

1. **检查服务名称**：首先，您需要检查传递给API请求中的`serviceName`参数，确认它是否包含了上述不允许的字符类型。
   
2. **修改服务名称**：如果服务名称确实包含了非法字符，您需要对其进行修改，确保其符合Nacos的校验规则。例如，移除所有中文字符、确保不以`@`开头，且没有连续的`@@`。

3. **重新发起请求**：在修改服务名称后，再次尝试发起请求到Nacos服务端，这次应该能成功执行，不再收到参数校验失败的错误信息。

### 解释

- 为什么需要这样做？Nacos实施严格的参数校验是为了提升系统的稳定性和安全性，防止因不当的输入导致的数据异常或安全漏洞。
- 修改服务名称并重新请求是直接针对错误提示的解决方式，确保请求参数的合法合规性是与Nacos交互的基础，可以避免类似错误的发生。

请按照以上步骤操作，如果问题依然存在，可能需要进一步检查请求的其他参数或网络环境等外部因素。


<font color="#949494">---------------</font> 


## 参考链接 ：

*[参数校验](https://nacos.io/docs/latest/guide/user/parameters-check)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=15701)给我们反馈。
