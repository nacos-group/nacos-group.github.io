---
id: "question-history-15605"
title: "服务端根据nacos.core.auth.plugin.nacos.token.secret.key生成的 nacos-opensource"
date: "2024-06-17"
category: "expertConsultation"
description: "根据提供的知识内容，nacos-opensource服务端根据`nacos.core.auth.plugin.nacos.token.secret.key`生成的accessToken确实有过期时间。过期时间的具体值可以通过配置项`nacos.core.auth.plugin.nacos.token"
---

## 用户问题 ： 
 服务端根据nacos.core.auth.plugin.nacos.token.secret.key生成的accessToken有过期时间吗？多久？过期了会怎么办？ nacos-opensource 

---------------
## 专家官方解答 ：

根据提供的知识内容，nacos-opensource服务端根据`nacos.core.auth.plugin.nacos.token.secret.key`生成的accessToken确实有过期时间。过期时间的具体值可以通过配置项`nacos.core.auth.plugin.nacos.token.expire.seconds`来设定，默认值为18000秒（即5小时）。

过期了会怎么办呢？

1. **对于Java SDK鉴权**：如果accessToken过期，客户端在使用该过期的token进行API调用时，将会收到权限验证失败的响应。这时，客户端需要重新通过登录接口获取新的accessToken，并在后续请求中使用新token。

2. **对于Open-API鉴权**：情况类似，当accessToken过期，继续使用它进行API请求同样会导致鉴权失败。正确的做法也是重新调用登录接口（如示例中的POST请求到`/nacos/v1/auth/login`），以获取新的accessToken并用于后续请求。

综上所述，当accessToken过期后，解决办法是重新进行认证以获取新的有效token，确保服务调用的正常进行。这避免了因token失效导致的服务访问中断问题。

参考链接已在上述中提及的知识点内直接展示。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：Server端开启鉴权以后客户端的链接方法 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=15606)给我们反馈。
