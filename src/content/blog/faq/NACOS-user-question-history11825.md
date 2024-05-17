---
id: "question-history-11825"
title: "nacos 为什么要关闭双写？ nacos-opensource"
date: "2024-04-24"
category: expertConsultation
description: "nacos-opensource nacos 为什么要关闭双写？"
tags: ["关闭","双写"]
keywords: ["关闭","双写"]
---

## 用户问题 ： 
 nacos 为什么要关闭双写？
 nacos-opensource 

---------------
## 专家官方解答 ：

Nacos需要关闭双写的原因在于释放性能并确保系统的稳定运行。在集群升级完成后，启用双写模式是为了实现数据的平滑过渡，即在新旧版本之间保持数据同步，以降低升级风险。然而，双写机制会同时向新旧数据存储进行写入操作，虽然保障了数据一致性，但这种额外的操作会带来一定的性能开销。

在确认集群升级后的运行状况无误，即新版本系统能够正常且稳定地提供服务后，继续维持双写模式便不再必要。关闭双写可以消除对旧数据存储的写入，从而释放这部分性能资源，使Nacos系统专注于单一的新版本数据存储，进一步提升服务效率。此外，关闭双写也有助于简化系统架构，避免因维护两套数据存储可能导致的问题，有利于系统的长期稳定运行。

具体关闭双写的步骤如下：

1. **执行关闭命令**：
   使用`curl`命令发送一个PUT请求至Nacos服务器的特定API接口，以关闭双写功能。命令格式如下：

   ```
   curl -X PUT 'localhost:8848/nacos/v1/ns/operator/switches?entry=doubleWriteEnabled&value=false'
   ```

   这里，`localhost:8848`应替换为实际Nacos服务器的地址和端口。

2. **验证关闭结果**：
   关闭命令执行后，检查`logs/naming-server.log`日志文件，查找是否存在如下提示信息：

   ```
   Disable Double write, stop and clean v1.x cache and features
   ```

   出现该字样表明双写已成功关闭。

需要注意的是，关闭双写后将无法进行平滑降级，因此在执行此操作前务必确保集群升级后各项功能正常，系统运行无误。对于Nacos 2.1.X、2.2.X、2.3.X及之后的2.X版本，由于其直接以新版本运行模式启动，不存在双写模式，故无需执行关闭双写的操作。


<font color="#949494">---------------</font> 


## 参考链接 ：

*[Nacos 2.0 升级文档](https://nacos.io/docs/latest/upgrading/200-upgrading)
 
 *专家经验:Nacos nacos 2.3.0全新安装也需要关闭双写吗？ 
 
 *专家经验:为什么Nacos不使用ORM框架访问数据库 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11832)给我们反馈。
