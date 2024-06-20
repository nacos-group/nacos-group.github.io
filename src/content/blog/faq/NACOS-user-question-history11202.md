---
id: "question-history-11202"
title: "nacos 内置数据库 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "Nacos 支持使用内置数据库来存储配置信息，其内置的数据库为 Derby。使用 Derby 数据库时，Nacos 会依赖于其自研的一致性协议来确保所有 Nacos 节点之间的一致性。当在任意节点发布配置，Nacos 会通知所有节点更新它们的缓存，利用配置内容的 MD5 值来保证缓存与数据库数据的一"
tags: ["内置数据库"]
keywords: ["内置数据库"]
---

## 用户问题 ： 
 nacos 内置数据库 nacos-opensource 

---------------
## 专家官方解答 ：

Nacos 支持使用内置数据库来存储配置信息，其内置的数据库为 Derby。使用 Derby 数据库时，Nacos 会依赖于其自研的一致性协议来确保所有 Nacos 节点之间的一致性。当在任意节点发布配置，Nacos 会通知所有节点更新它们的缓存，利用配置内容的 MD5 值来保证缓存与数据库数据的一致性。

### 使用内置 Derby 数据库的步骤简述：

1. **配置使用内置数据库**：
   默认情况下，如果不做额外配置，Nacos 会使用嵌入式的 Derby 数据库。这通常适用于测试或轻量级部署场景，因为 Derby 是一个轻量级的、基于 Java 的数据库，无需单独安装。

2. **配置调整**（虽然未直接提及具体调整步骤，但基于理解）：
   - 确保 Nacos 的配置文件（如 `application.properties`）中未显式配置外部数据库连接信息，这样 Nacos 就会默认使用 Derby。
   - 若需调整 Derby 的数据存储位置等，可查阅 Nacos 官方文档中关于如何配置内部 Derby 数据库的相关部分。

3. **注意事项**：
   - 内置 Derby 数据库适合单机或测试环境，因其不支持高并发和大规模数据存储。
   - 在生产环境中，推荐使用外部 MySQL 或其他受支持的数据库，以获得更好的性能和稳定性。
   - 直接修改 Derby（或任何内置/外置数据库）中的配置内容而不通过 Nacos API 或控制台，会导致客户端无法收到通知，从而影响配置的一致性。

### 结论：
内置 Derby 数据库为 Nacos 提供了一种简便的启动方式，特别适用于快速测试和轻量级部署。然而，对于生产环境的部署，建议采用外部数据库（如 MySQL）以确保系统的高可用性和数据一致性。在所有场景下，务必通过 Nacos 提供的正确途径来管理配置，避免直接操作数据库记录。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：Nacos的数据库支持情况介绍 
 
 *专家经验：Nacos 配置中心的数据同步和一致性问题 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13741)给我们反馈。
