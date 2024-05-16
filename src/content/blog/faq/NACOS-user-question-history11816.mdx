---
id: "question-history-11816"
title: "nacos 支持国产化数据库么？ nacos-opensource"
date: "2024-04-24"
category: expertConsultation
description: "nacos-opensource nacos 支持国产化数据库么？"
tags: ["国产化数据库"]
keywords: ["国产化数据库"]
---

## 用户问题 ： 
 nacos 支持国产化数据库么？
 nacos-opensource 

---------------
## 专家官方解答 ：

Nacos 支持国产化数据库。

原因分析：
Nacos官方提供了对MySQL数据库和Derby数据库的支持，同时也指出，由于Nacos支持MySQL5.6版本以上协议的数据库，这意味着包括TiDB、MariaDB在内的兼容MySQL协议的数据库均能被Nacos直接支持。此外，Nacos从2.2版本开始，为了满足社区对其他数据库（特别是国产化数据库）支持的需求，提供了数据源插件机制，并已在[nacos-group/nacos-plugin](https://github.com/nacos-group/nacos-plugin)项目下发布了支持PostgreSQL、Oracle及达梦数据库的插件。这意味着，通过引入对应的插件，Nacos可以支持包括国产化数据库在内的多种非默认数据库。

具体步骤：

1. **检查需求的数据库类型**：确认您希望Nacos支持的国产化数据库类型。

2. **查询插件支持情况**：访问[nacos-group/nacos-plugin](https://github.com/nacos-group/nacos-plugin)项目，查看是否有适用于您所需国产化数据库的插件。例如，如果您需要支持达梦数据库，项目中已有相应插件。

3. **获取插件**：
   - 若社区已提供所需数据库插件，直接下载并准备使用。
   - 若社区未提供，您需要自行开发。参照[Nacos数据源插件开发文档](https://nacos.io/docs/latest/plugin/datasource-plugin/)进行开发。

4. **放置插件**：将准备好的插件文件放入Nacos服务器的`${nacos-server.path}/plugins`目录下。

5. **配置数据库连接信息**：修改`${nacos-server.path}/conf/application.properties`文件，更新以下数据库相关配置项：
   - `spring.sql.init.platform`：设置为所选数据库对应的平台标识。
   - `db.url.0`：设置为连接目标数据库的JDBC URL。
   - `db.user`：设置为数据库用户名。
   - `db.password`：设置为数据库密码。
   - 可能需要的其他特定数据库驱动或连接属性。

   以PostgreSQL为例，配置可能如下所示：
   ```
   spring.datasource.platform=postgresql
   db.url.0=jdbc:postgresql://127.0.0.1:5432/nacos?tcpKeepAlive=true&reWriteBatchedInserts=true&ApplicationName=nacos_java
   db.user=nacos
   db.password=nacos
   db.pool.config.driverClassName=org.postgresql.Driver
   ```

6. **启动Nacos服务器**：完成上述配置后，启动Nacos服务器，使其使用新配置的国产化数据库作为数据源。

综上所述，Nacos通过引入数据源插件机制，能够支持国产化数据库。只需按照上述步骤，检查需求、获取或开发插件、配置数据库连接信息，最后启动Nacos服务器即可实现国产化数据库的支持。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:Nacos的数据库支持情况介绍 
 
 *[进阶指南](https://github.com/spring-cloud-alibaba-group/spring-cloud-alibaba-group.github.io/tree/master/i18n/zh-cn/docusaurus-plugin-content-docs/current/user-guide/sentinel/advanced-guide.md)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11817)给我们反馈。
