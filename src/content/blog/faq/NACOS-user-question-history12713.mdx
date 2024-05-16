---
id: "question-history-12713"
title: "nacos关闭双写 需要每个节点执行么？ nacos-opensource"
date: "2024-05-08"
category: expertConsultation
description: "nacos-opensource nacos关闭双写 需要每个节点执行么？"
tags: ["nacos","双写","每个节点","执行"]
keywords: ["nacos","双写","每个节点","执行"]
---

## 用户问题 ： 
 nacos关闭双写 需要每个节点执行么？ nacos-opensource 

---------------
## 专家官方解答 ：

在Nacos 2.3.0及之后的2.x版本中，双写模式实际上是默认关闭的，因为这些版本在启动时即采用新版本运行模式，不再需要手动关闭双写。但是，如果出于某种特殊需求或误解而考虑执行关闭双写的操作，根据提供的信息，关闭双写是通过API调用来实现的，命令如下：

```bash
curl -X PUT 'localhost:8848/nacos/v1/ns/operator/switches?entry=doubleWriteEnabled&value=false'
```

这个操作理论上只需要在一个集群节点上执行即可生效，因为Nacos集群间会同步配置信息。然而，考虑到操作的安全性和集群状态的一致性，最佳实践通常是在所有节点上执行此操作，确保集群中每个节点的配置状态一致，避免因个别节点配置不同步可能引发的问题。

执行后，可以通过检查`logs/naming-server.log`日志，寻找`Disable Double write, stop and clean v1.x cache and features`的日志条目，以确认双写已被成功关闭。

总之，虽然在新版本中关闭双写不再是必需的操作，如果需要执行，建议对集群中的每个节点执行上述API调用，以确保配置的一致性，并通过日志验证操作结果。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:Nacos nacos 2.3.0全新安装也需要关闭双写吗？ 
 
 *[Nacos 2.0 升级文档](https://nacos.io/docs/latest/upgrading/200-upgrading)
 
 *专家经验:Nacos nacos 2.3.0 如何关闭cp模式，只保留ap的注册中心？ 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=12720)给我们反馈。
