---
id: "question-history-8274"
title: "Nacos2.0.3 data source does not support pgsql nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource Nacos2.0.3 data source does not support pgsql"
tags: ["Nacos2.0.3","data source","does not support","pgsql"]
keywords: ["Nacos2.0.3","data source","does not support","pgsql"]
---

## 用户问题 ： 
 Nacos2.0.3 data source does not support pgsql nacos-opensource 

---------------
## 专家官方解答 ：

在Nacos 2.0.3版本中，您遇到“data source does not support pgsql”的问题，其原因在于Nacos官方在2.0.3版本之前并未提供对PostgreSQL数据库的直接支持。根据我了解的知识中的信息，Nacos在2.2版本开始才引入了数据源插件机制，允许通过插件形式扩展对包括PostgreSQL在内的多种数据库的支持。因此，在Nacos 2.0.3版本中，系统无法识别和处理PostgreSQL的数据源配置，导致您遇到不支持的提示。

针对这一问题，我了解的知识中给出了明确的解决方案：

1. **确认插件存在**：访问[https://github.com/nacos-group/nacos-plugin](https://github.com/nacos-group/nacos-plugin)项目，查看是否有适用于PostgreSQL的插件已经由社区贡献并发布。

2. **开发自定义插件**：若社区未提供现成的PostgreSQL插件，您需要按照[https://nacos.io/docs/latest/plugin/datasource-plugin/](https://nacos.io/docs/latest/plugin/datasource-plugin/)文档指导，自行开发满足需求的数据源插件。

3. **部署插件**：将获取或开发完成的PostgreSQL插件放置到nacos-server的`${nacos-server.path}/plugins`目录下。

4. **配置数据库连接**：在nacos-server的`${nacos-server.path}/conf/application.properties`文件中，更新与数据库相关的配置项，以适应PostgreSQL连接参数。例如：

   ```
   spring.datasource.platform=postgresql
   db.url.0=jdbc:postgresql://127.0.0.1:5432/nacos?tcpKeepAlive=true&reWriteBatchedInserts=true&ApplicationName=nacos_java
   db.user=nacos
   db.password=nacos
   db.pool.config.driverClassName=org.postgresql.Driver
   ```

5. **启动Nacos服务**：完成上述配置后，重新启动nacos-server，使其加载并使用新配置的PostgreSQL数据源。

综上所述，由于Nacos 2.0.3版本不直接支持PostgreSQL，您需要采取以下步骤解决该问题：

1. 确认或开发适用于PostgreSQL的Nacos数据源插件。
2. 将插件部署到nacos-server的指定目录。
3. 在`application.properties`中配置PostgreSQL连接参数。
4. 重启nacos-server以应用新的数据源设置。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:Nacos的数据库支持情况介绍 
 
 *专家经验:nacos-opensource 那这个文件越来越多会有性能影响吗 
 
 *专家经验:Nacos 欢迎你 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11583)给我们反馈。
