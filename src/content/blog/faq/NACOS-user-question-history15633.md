---
id: "question-history-15633"
title: "nacos accessToken有过期时间吗？ nacos-opensource"
date: "2024-06-18"
category: "expertConsultation"
description: "nacos accessToken确实有过期时间。根据提供的知识内容，在服务端配置中，默认的accessToken过期时间是通过`nacos.core.auth.plugin.nacos.token.expire.seconds`参数设定的，其默认值为18000秒（即5小时）。具体来说：1. **过"
---

## 用户问题 ： 
 nacos accessToken有过期时间吗？ nacos-opensource 

---------------
## 专家官方解答 ：

nacos accessToken确实有过期时间。根据提供的知识内容，在服务端配置中，默认的accessToken过期时间是通过`nacos.core.auth.plugin.nacos.token.expire.seconds`参数设定的，其默认值为18000秒（即5小时）。

具体来说：
1. **过期时间配置**：服务端配置文件中有一个参数控制accessToken的过期时间，即`nacos.core.auth.plugin.nacos.token.expire.seconds`，该值默认设置为18000秒。
   
2. **开启Token缓存功能的影响**：从2.2.1版本开始，服务端支持Token缓存功能。当此功能开启时，服务端会在生成新的accessToken或者返回缓存中的accessToken时，根据Token在缓存中存留的时间动态调整返回的`tokenTtl`值。即使缓存中有Token，当该Token接近过期（具体为过期时间的90%）时，服务端也会重新生成并更新缓存，以确保客户端使用的Token不会立即或很快过期。

综上所述，nacos的accessToken是有时限的，并且服务端提供了配置项来管理这个过期时间，同时引入了Token缓存机制来优化性能和管理Token的有效性。用户可以根据实际需求调整这些配置以适应不同的安全策略和性能要求。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：Server端开启鉴权以后客户端的链接方法 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=15685)给我们反馈。
