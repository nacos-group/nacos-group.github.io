---
id: "question-history-11818"
title: "nacos 支持 pgSQL么？ nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "Nacos确实支持PostgreSQL（简称PgSQL）。从Nacos2.2版本开始，官方已经加入了对PostgreSQL、Oracle及达梦数据库的支持。为了在Nacos中使用PostgreSQL，你可以按照以下具体步骤操作：1. **检查插件是否存在**：   首先访问[Nacos的GitHub"
tags: ["nacos","pgSQL"]
keywords: ["nacos","pgSQL"]
---

Nacos确实支持PostgreSQL（简称PgSQL）。从Nacos2.2版本开始，官方已经加入了对PostgreSQL、Oracle及达梦数据库的支持。为了在Nacos中使用PostgreSQL，你可以按照以下具体步骤操作：

1. **检查插件是否存在**：
   首先访问[Nacos的GitHub插件仓库](https://github.com/nacos-group/nacos-plugin)，在`nacos-datasource-plugin-ext`目录下查找是否有针对PostgreSQL的现成插件。根据知识内容，社区已为PostgreSQL提供了支持插件。

2. **准备插件**：
   如果官方仓库中已有PostgreSQL插件，直接下载并准备使用。如果未找到，理论上需要自行开发数据源插件，但根据情境，PostgreSQL插件应该是可用的，所以这一步通常不需要执行。

3. **放置插件**：
   将下载的PostgreSQL插件放置到`nacos-server`的`plugins`目录下。

4. **配置修改**：
   修改`nacos-server`配置文件夹下的`conf/application.properties`，添加或调整以下配置项以适应PostgreSQL：
   ```
   spring.datasource.platform=postgresql
   db.url.0=jdbc:postgresql://127.0.0.1:5432/nacos?tcpKeepAlive=true&reWriteBatchedInserts=true&ApplicationName=nacos_java
   db.user=你的数据库用户名
   db.password=你的数据库密码
   db.pool.config.driverClassName=org.postgresql.Driver
   ```
   注意替换`你的数据库用户名`和`你的数据库密码`为实际的数据库访问凭证。

5. **启动Nacos服务器**：
   完成上述配置后，启动Nacos服务器，它将使用PostgreSQL作为其后端数据库。

综上所述，通过使用官方或社区提供的PostgreSQL插件，并适当配置，Nacos能够顺利支持PostgreSQL数据库。确保遵循正确的配置步骤以保证Nacos与PostgreSQL的兼容与稳定运行。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13807)给我们反馈。
