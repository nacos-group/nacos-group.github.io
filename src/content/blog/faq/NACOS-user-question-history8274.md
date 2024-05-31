---
id: "question-history-8274"
title: "Nacos2.0.3 data source does not support pgsql nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "在Nacos 2.0.3版本中，官方确实还未直接支持PostgreSQL数据库，这与您遇到的“Nacos2.0.3 data source does not support pgsql”的问题相吻合。根据 我了解的知识 中的信息，Nacos是从2.2版本开始才正式支持PostgreSQL的。因此，若"
tags: ["Nacos2.0.3","data source","does not support","pgsql"]
keywords: ["Nacos2.0.3","data source","does not support","pgsql"]
---

在Nacos 2.0.3版本中，官方确实还未直接支持PostgreSQL数据库，这与您遇到的“Nacos2.0.3 data source does not support pgsql”的问题相吻合。根据 我了解的知识 中的信息，Nacos是从2.2版本开始才正式支持PostgreSQL的。因此，若要解决您当前在Nacos 2.0.3中不支持PostgreSQL数据源的问题，您可以考虑以下几个步骤：

1. **升级Nacos版本**：首先推荐的做法是将您的Nacos服务升级到2.2或更高版本，这些版本原生支持PostgreSQL。您可以在[Nacos GitHub Release页面](https://github.com/alibaba/nacos/releases)找到最新的发行版进行升级。

2. **引入PostgreSQL插件**：如果您因为某些原因无法立即升级，可以尝试查看Nacos社区是否有针对2.0.3版本的PostgreSQL插件。但根据官方说明，数据库扩展支持是从2.2版本开始内置的，所以直接找到适用于2.0.3的现成插件可能性较小。

3. **自定义数据源插件**：作为更高级的解决方案，您可以参考Nacos提供的数据源插件开发指南[[https://nacos.io/docs/latest/plugin/datasource-plugin/]](https://nacos.io/docs/latest/plugin/datasource-plugin/)来自行开发适用于Nacos 2.0.3的PostgreSQL数据源插件。这包括实现特定于PostgreSQL的数据源类，并将其正确配置到Nacos中。

4. **配置更改**：一旦您有了支持PostgreSQL的数据源插件，需要按照Nacos的配置要求，在`${nacos-server.path}/conf/application.properties`中进行相应的配置调整，例如设置`spring.datasource.platform=postgresql`，以及正确的数据库URL、用户名和密码等。

综上所述，最直接且长期有效的解决方案是升级到支持PostgreSQL的Nacos版本。如果升级不可行，则探索社区已有资源或自行开发插件是较为复杂但可行的替代方案。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13620)给我们反馈。
