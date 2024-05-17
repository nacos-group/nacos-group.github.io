---
id: "question-history-11826"
title: "nacos 怎么关闭双写？ nacos-opensource"
date: "2024-04-24"
category: expertConsultation
description: "nacos-opensource nacos 怎么关闭双写？"
tags: ["关闭","双写"]
keywords: ["关闭","双写"]
---

## 用户问题 ： 
 nacos 怎么关闭双写？
 nacos-opensource 

---------------
## 专家官方解答 ：

要关闭Nacos的双写功能，首先需要确认当前Nacos集群的版本。这是因为不同版本的处理方式有所差异：

1. **对于Nacos 2.1及以上版本（包括2.1.X、2.2.X、2.3.X及之后的2.X版本）**，这些版本在部署时已经默认以新版本运行模式启动，不存在双写模式，因此无需执行任何操作去关闭双写。

2. **对于早于Nacos 2.1版本的集群**，在集群升级完成后，如果希望关闭双写以释放性能，可以通过以下步骤进行：

   a. **执行关闭命令**：使用`curl`工具向Nacos服务器发送特定的API请求，以关闭双写功能。命令如下：

      ```
      curl -X PUT 'localhost:8848/nacos/v1/ns/operator/switches?entry=doubleWriteEnabled&value=false'
      ```

   b. **验证关闭结果**：关闭操作完成后，可以在Nacos服务器的`logs/naming-server.log`日志文件中查找`Disable Double write, stop and clean v1.x cache and features`字样。出现该字样表明双写已成功关闭。

   c. **注意事项**：关闭双写后，集群将无法平滑回退到旧版本。因此，在执行关闭操作前，务必确保集群升级后运行正常且无任何问题。

综上所述，针对您的问题“nacos怎么关闭双写？”，答案取决于您使用的Nacos版本。如果您使用的是Nacos 2.1及以上版本，无需进行任何操作，因为系统默认已关闭双写。若使用的是早于2.1版本的Nacos集群且已完成升级，可按照上述步骤通过API调用关闭双写，并通过日志确认关闭状态。同时，请确保在关闭双写前集群运行稳定，因为关闭后无法平滑回退。


<font color="#949494">---------------</font> 


## 参考链接 ：

*[Nacos 2.0 升级文档](https://nacos.io/docs/latest/upgrading/200-upgrading)
 
 *专家经验:Nacos nacos 2.3.0全新安装也需要关闭双写吗？ 
 
 *专家经验:Nacos nacos 2.3.0 如何关闭cp模式，只保留ap的注册中心？ 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11833)给我们反馈。
