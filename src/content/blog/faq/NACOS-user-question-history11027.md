---
id: "question-history-11027"
title: "Nacos 各位大佬，请教个问题，nacos动态刷新问题，具体表现是我开发机器Windows可以动态刷新，Linux环境就不能，每次修改配置还需要重启服务。版本是：springcloud 2021.0.4， nacos 2021.0.4，大佬们有遇见过类似的情况吗，是怎么解决的呢？修改完配置之后 看日志推送的配置也是对的，但是refresh keys changed：是空数组，感觉是和老配置对比不成功 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "根据你描述的问题，我们可以按照以下逻辑进行分析和排查：1. **环境差异检查**：首先，由于你在Windows开发环境下能正常实现Nacos配置的动态刷新，而在Linux生产环境则不能，这可能指向环境配置或系统行为的差异。需要确认Linux环境与Windows环境在以下几个方面的配置是否一致：   "
tags: ["动态刷新问题","Windows","Linux环境","重启服务","springcloud 2021.0.4","nacos 2021.0.4","配置推送","refresh keys changed","空数组"]
keywords: ["动态刷新问题","Windows","Linux环境","重启服务","springcloud 2021.0.4","nacos 2021.0.4","配置推送","refresh keys changed","空数组"]
---

根据你描述的问题，我们可以按照以下逻辑进行分析和排查：1. **环境差异检查**：首先，由于你在Windows开发环境下能正常实现Nacos配置的动态刷新，而在Linux生产环境则不能，这可能指向环境配置或系统行为的差异。需要确认Linux环境与Windows环境在以下几个方面的配置是否一致：   
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13716)给我们反馈。
