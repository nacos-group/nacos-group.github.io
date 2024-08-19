---
id: "question-history-16606"
title: "nacos什么版本同时支持ipv4和ipv6"
date: "2024-08-15"
category: "expertConsultation"
description: "Nacos从2.1版本开始，服务器端（Nacos Server）自动支持IPv4和IPv6双栈环境，无需特别配置即可同时兼容这两种协议。在2.1之前的版本中，虽然也支持IPv6，但需要手动配置`nacos.server.ip`或`nacos.inetutils.ip-address`来指定IPv6地"
---

## 用户问题 ： 
 nacos什么版本同时支持ipv4和ipv6  

---------------
## 专家官方解答 ：

Nacos从2.1版本开始，服务器端（Nacos Server）自动支持IPv4和IPv6双栈环境，无需特别配置即可同时兼容这两种协议。在2.1之前的版本中，虽然也支持IPv6，但需要手动配置`nacos.server.ip`或`nacos.inetutils.ip-address`来指定IPv6地址，并在集群配置文件`cluster.conf`中配置相应的IPv6地址。对于客户端（Nacos-Client），任何版本都支持IPv6，只需在创建客户端时直接指定IPv6地址作为服务端地址即可。

简而言之，Nacos 2.1及之后的版本均能同时支持IPv4和IPv6，确保了良好的网络协议兼容性。 若要获取Nacos的最新稳定版本，可以访问[Nacos官方网站的下载页面](https://nacos.io/download/nacos-server/)或查看[GitHub上的Release](https://github.com/alibaba/nacos/releases)，以获取最新的版本信息。对于与Spring Cloud Alibaba的版本适配信息，请参考[spring cloud alibaba网站](https://sca.aliyun.com/docs/2023/overview/version-explain/?spm=5176.29160081.0.0.74801a15rjcsKN)。

以上内容已根据提供的知识进行了整合和解答，无需进一步提问。


<font color="#949494">---------------</font> 


## 参考链接 ：

* 专家经验：Nacos是否支持IPV6 
 
 * 专家经验：nacos哪个版本最常用 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=16608)给我们反馈。
