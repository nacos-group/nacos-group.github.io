---
id: "question-history-12690"
title: "nacos 是否支持postgrelsql PG？ nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "Nacos确实支持PostgreSQL（简称Postgres）。从Nacos 2.2版本开始，官方已经增加了对PostgreSQL、Oracle及达梦数据库的支持。为了在Nacos中使用PostgreSQL，您可以按照以下步骤操作：1. **检查插件是否存在**：   首先访问[Nacos插件仓库]"
tags: ["nacos","postgrelsql","PG","支持"]
keywords: ["nacos","postgrelsql","PG","支持"]
---

## 用户问题 ： 
 nacos 是否支持postgrelsql PG？ nacos-opensource 

---------------
## 专家官方解答 ：

Nacos确实支持PostgreSQL（简称Postgres）。从Nacos 2.2版本开始，官方已经增加了对PostgreSQL、Oracle及达梦数据库的支持。为了在Nacos中使用PostgreSQL，您可以按照以下步骤操作：

1. **检查插件是否存在**：
   首先访问[Nacos插件仓库](https://github.com/nacos-group/nacos-plugin)，在这个仓库中查找是否有针对PostgreSQL的现成插件。根据知识内容，PostgreSQL插件应当已被包含。

2. **准备插件**：
   如果社区已经提供了PostgreSQL插件，您直接下载使用即可。如果未找到，理论上需要自行开发数据源插件，但鉴于问题中特定于PostgreSQL，我们假设已有现成插件可用。

3. **放置插件**：
   将下载的PostgreSQL插件放置到Nacos服务器的`${nacos-server.path}/plugins`目录下。

4. **配置Nacos**：
   修改Nacos服务器配置文件`${nacos-server.path}/conf/application.properties`，添加或调整以下配置项以适应PostgreSQL：
   ```properties
   spring.datasource.platform=postgresql
   db.url.0=jdbc:postgresql://127.0.0.1:5432/nacos?tcpKeepAlive=true&reWriteBatchedInserts=true&ApplicationName=nacos_java
   db.user=您的数据库用户名
   db.password=您的数据库密码
   db.pool.config.driverClassName=org.postgresql.Driver
   ```
   注意替换`您的数据库用户名`和`您的数据库密码`为实际的数据库访问凭据。

5. **启动Nacos服务器**：
   完成上述配置后，重新启动Nacos服务器，它将使用PostgreSQL作为其后端数据库。

通过这些步骤，您可以成功地使Nacos支持并使用PostgreSQL数据库。如果您在操作过程中遇到任何问题，可以参考Nacos的官方文档，特别是关于[数据源插件的说明](https://nacos.io/docs/latest/plugin/datasource-plugin/)部分。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：Nacos的数据库支持情况介绍 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13854)给我们反馈。
