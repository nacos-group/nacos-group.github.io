---
id: "question-history-11816"
title: "nacos 支持国产化数据库么？ nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "Nacos确实支持国产化数据库。从Nacos2.2版本开始，官方增加了对国产数据库的支持，特别是针对PostgreSQL、Oracle及达梦数据库的直接支持。这意味着Nacos能够适应国内用户在数据库选型上的多样化需求，促进了软件的国产化适配。为了在Nacos中使用国产化数据库，您可以按照以下步骤操"
tags: ["国产化数据库"]
keywords: ["国产化数据库"]
---

Nacos确实支持国产化数据库。从Nacos2.2版本开始，官方增加了对国产数据库的支持，特别是针对PostgreSQL、Oracle及达梦数据库的直接支持。这意味着Nacos能够适应国内用户在数据库选型上的多样化需求，促进了软件的国产化适配。

为了在Nacos中使用国产化数据库，您可以按照以下步骤操作：

1. **检查社区插件**：
   访问[Nacos插件仓库](https://github.com/nacos-group/nacos-plugin)，查看是否有针对您所使用的国产数据库的现成插件。例如，对于PostgreSQL和Oracle，社区已经提供了相应的插件。

2. **自定义数据源插件**：
   如果社区中没有直接适用于您的国产数据库的插件，您需要根据官方文档[数据源插件开发指南](https://nacos.io/docs/latest/plugin/datasource-plugin/)来自行开发。这包括实现特定于数据库的数据源类和配置处理逻辑。

3. **部署插件**：
   将开发或获取到的数据源插件放置在nacos-server的`plugins`目录下。

4. **配置数据库连接**：
   修改nacos-server配置文件`conf/application.properties`，设置正确的数据库平台类型（如`spring.datasource.platform=postgresql`）、数据库URL、用户名、密码等信息。确保根据您的数据库类型调整连接参数和测试查询语句。

5. **启动Nacos服务**：
   完成上述配置后，启动Nacos服务器，它将使用您配置的国产数据库作为数据存储。

通过这些步骤，您可以成功地在Nacos中集成并使用国产化数据库，满足特定的项目需求或合规要求。这种灵活性体现了Nacos对多环境、多数据库类型的良好支持，有助于提升系统的兼容性和可扩展性。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13806)给我们反馈。
