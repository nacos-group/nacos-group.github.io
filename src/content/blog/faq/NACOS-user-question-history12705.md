---
id: "question-history-12705"
title: "nacos不使用外部数据库（如mysql) 怎么配置？ nacos-opensource"
date: "2024-05-01"
category: expertConsultation
description: "nacos-opensource nacos不使用外部数据库（如mysql) 怎么配置？"
tags: ["配置","不使用外部数据库","mysql"]
keywords: ["配置","不使用外部数据库","mysql"]
---

## 用户问题 ： 
 nacos不使用外部数据库（如mysql) 怎么配置？ nacos-opensource 

---------------
## 专家官方解答 ：

Nacos在不使用外部数据库（如MySQL）的情况下，可以配置其使用内置的嵌入式数据库Derby来进行数据存储。根据提供的知识内容，以下是配置Nacos使用自带的持久层（Derby）来保证配置中心一致性的步骤：

1. **修改Nacos配置文件**：
   - 打开Nacos的配置文件`application.properties`或`application.yaml`，这两个文件通常位于Nacos的conf目录下。
   - 需要注释掉或移除配置中指向外部MySQL数据库的相关设置。这些设置通常包括但不限于`spring.datasource.*`相关的属性。
   - 确保Nacos配置为使用其内置的Derby数据库。默认情况下，如果不配置外部数据库，Nacos会使用Derby。但为了明确和保险，可以添加或确认以下配置：
     ```yaml
     spring.datasource.platform=derby
     ```

2. **验证配置**：
   - 重启Nacos服务器后，Nacos将会使用Derby作为数据存储。
   - 你可以通过Nacos的控制台界面检查配置是否正确加载，以及数据是否能够正常保存和读取。

**解释**：
- 使用Derby作为存储方式，Nacos通过其内部的一致性协议来管理配置数据的一致性。这意味着，当你在任何一个Nacos节点上发布配置更改时，Nacos会负责通知集群中的所有其他节点，以确保它们的缓存与最新配置保持同步。
- 由于Derby是嵌入式的数据库，因此这种方式简化了部署和运维的复杂度，尤其是在不需要高可用配置存储或者测试环境中非常适用。
- 然而，需要注意的是，相比于外部MySQL数据库，Derby可能在性能、数据容量和高可用性方面存在局限，特别是在生产环境承载大规模配置或高并发访问的场景下，可能不是最佳选择。

综上所述，通过调整配置让Nacos使用其内置的Derby数据库，可以在不依赖外部MySQL的情况下配置和运行Nacos配置中心，满足基本的配置管理需求。


<font color="#949494">---------------</font> 


## 参考链接 ：

*[Nacos 融合 Spring，成为注册配置中心](https://nacos.io/docs/latest/ecology/use-nacos-with-spring)
 
 *专家经验:Nacos 配置中心的数据同步和一致性问题 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=12708)给我们反馈。
