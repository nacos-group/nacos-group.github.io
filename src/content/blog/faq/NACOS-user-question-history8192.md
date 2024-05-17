---
id: "question-history-8192"
title: "自研注册中心 配置中心 并兼容 nacos client 是否存在开源协议的冲突？ nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource 自研注册中心 配置中心 并兼容 nacos client 是否存在开源协议的冲突？"
tags: ["自研注册中心","配置中心","nacos","client","开源协议","冲突"]
keywords: ["自研注册中心","配置中心","nacos","client","开源协议","冲突"]
---

## 用户问题 ： 
 自研注册中心 配置中心 并兼容 nacos client 是否存在开源协议的冲突？ nacos-opensource 

---------------
## 专家官方解答 ：

不存在开源协议的冲突。

原因分析：
根据我了解的知识中的内容，Nacos使用的是Apache License 2.0开源协议。该协议具有很高的开放度和灵活性，允许用户在遵循一定条件的前提下自由地使用、复制、修改、合并、发布和再许可被授权软件的副本。这些条件包括：

1. 保留原始版权、许可和免责声明。
2. 修改后的代码需以源代码形式提供。
3. 不得移除或修改原始代码中的版权和许可声明。

问题中提到自研注册中心/配置中心兼容nacos-client，这意味着在不直接复制或修改Nacos源代码的情况下，仅按照Nacos公开的通信协议和接口规范（而非其源代码）进行自主研发。这种情况下，自研产品与Nacos之间不存在直接的代码关联，因而无需考虑开源协议的约束。

对于可能涉及的兼容性工作，如对接nacos-client库（假设其同样采用Apache License 2.0），只要在使用和分发时遵循上述开源协议要求（如保留版权声明、提供修改后的源代码等），就不会与Nacos的开源协议产生冲突。

综上所述，自研注册中心/配置中心并兼容nacos-client，在遵守Apache License 2.0相关规定的情况下，不会存在开源协议冲突问题。您可以放心进行相关研发工作，并确保在项目中正确引用和遵守Nacos及其组件的开源协议条款。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:二次开发Nacos 是否存在开源协议的冲突？ 
 
 *专家经验:NACOS 配置中心和注册中心是分两个集群部署还是放在一个集群中 
 
 *[Nacos 融合 Spring，成为注册配置中心](https://nacos.io/docs/latest/ecology/use-nacos-with-spring)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11513)给我们反馈。
