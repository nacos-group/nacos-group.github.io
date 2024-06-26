---
id: "question-history-15634"
title: "服务端根据nacos.core.auth.plugin.nacos.token.secret.key生成的 nacos-opensource"
date: "2024-06-18"
category: "expertConsultation"
description: "nacos-opensource 服务端根据`nacos.core.auth.plugin.nacos.token.secret.key`生成的accessToken确实有过期时间。根据提供的知识内容，在服务端配置中可以通过`nacos.core.auth.plugin.nacos.token.ex"
---

## 用户问题 ： 
 服务端根据nacos.core.auth.plugin.nacos.token.secret.key生成的accessToken有过期时间吗？ nacos-opensource 

---------------
## 专家官方解答 ：

nacos-opensource 服务端根据`nacos.core.auth.plugin.nacos.token.secret.key`生成的accessToken确实有过期时间。根据提供的知识内容，在服务端配置中可以通过`nacos.core.auth.plugin.nacos.token.expire.seconds`来设定这个过期时间，其默认单位是秒。这意味着，一旦accessToken被生成并提供给客户端使用，它将在指定的秒数后失效。

具体来说，如果服务端配置如下所示：
```properties
nacos.core.auth.plugin.nacos.token.expire.seconds=18000
```
这意味着accessToken的有效期为18000秒（即5小时）。一旦accessToken过期，客户端需要重新通过登录接口获取新的accessToken来进行后续的鉴权操作。

此外，知识中还提到，如果开启了Token缓存功能（通过设置`nacos.core.auth.plugin.nacos.token.cache.enable=true`），服务端会对accessToken进行缓存处理，但这并不改变accessToken本身的过期机制，只是优化了服务端处理accessToken的效率。

总结如下：
1. **AccessToken有过期时间**：是的，由`nacos.core.auth.plugin.nacos.token.expire.seconds`配置决定，默认配置下有明确的过期时间。
2. **过期时间配置**：过期时间通过服务端配置项`nacos.core.auth.plugin.nacos.token.expire.seconds`设定，单位为秒。
3. **开启缓存的影响**：虽然服务端支持Token缓存来优化性能，但这不影响accessToken本身的过期逻辑，仅影响鉴权处理效率。

以上信息基于提供的知识内容进行解答，若有其他疑问或需要进一步的帮助，请随时告知。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：Server端开启鉴权以后客户端的链接方法 
 
 *专家经验：实际服务正常再跑 注册中心上没了怎么回事? 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=15686)给我们反馈。
