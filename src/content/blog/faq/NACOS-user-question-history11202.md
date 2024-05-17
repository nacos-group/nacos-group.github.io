---
id: "question-history-11202"
title: "nacos 内置数据库 nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource nacos 内置数据库"
tags: ["内置数据库"]
keywords: ["内置数据库"]
---

## 用户问题 ： 
 nacos 内置数据库 nacos-opensource 

---------------
## 专家官方解答 ：

Nacos 内置数据库是指随 Nacos 服务一同提供、无需用户额外独立部署的数据库解决方案。Nacos 支持两种内置数据库：MySQL 和 Derby。

**MySQL**：
MySQL 是一个广泛使用的开源关系型数据库管理系统。在使用 Nacos 时，若选择 MySQL 作为数据存储后端，用户需自行安装并配置 MySQL 服务器。Nacos 提供了相应的数据库初始化脚本（如 `mysql-schema.sql`），用于创建所需的表结构及初始数据。用户应将该脚本应用到已部署的 MySQL 实例中，确保 Nacos 能够正确连接并使用 MySQL 数据库。具体操作通常包括以下步骤：

1. **安装 MySQL**：按照官方指南在目标环境中安装 MySQL 服务器。
2. **创建数据库**：在 MySQL 中创建一个用于 Nacos 的专用数据库，例如名为 `nacos`。
3. **初始化数据库**：将 Nacos 提供的 `mysql-schema.sql` 文件中的 SQL 语句执行于刚创建的 `nacos` 数据库中，以构建必要的表结构和初始数据。
4. **配置 Nacos**：在 Nacos 服务的配置文件（如 `${nacos-server.path}/conf/application.properties`）中，设置与 MySQL 服务器的连接参数，包括数据库 URL、用户名、密码等。

**Derby**：
Derby 是一个轻量级、嵌入式的 Java 关系型数据库引擎。当选择 Derby 作为 Nacos 的内置数据库时，无需用户单独部署数据库服务器。Nacos 会在启动时自动携带并初始化 Derby 数据库。这意味着用户无需执行额外的数据库安装、配置及初始化步骤，只需确保 Nacos 服务正常启动即可。

总结起来，Nacos 内置数据库支持如下两种情况：

1. **MySQL**：需要用户自行安装 MySQL 服务器，执行数据库初始化脚本，然后在 Nacos 配置中指定 MySQL 连接参数。
2. **Derby**：无需独立部署数据库，Nacos 服务启动时会自动集成并初始化 Derby 数据库。

选择哪种内置数据库取决于用户的实际需求，如数据规模、高可用性要求、运维复杂度等因素。MySQL 适用于大规模生产环境，提供更强的数据处理能力和扩展性，但需要额外的安装与维护工作。而 Derby 更适合快速搭建小型测试环境或开发环境，因其开箱即用的特性简化了部署流程。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:无法在nacos/conf下找到nacos-mysql.sql文件 
 
 *[Nacos功能和需求列表](https://nacos.io/docs/latest/archive/feature-list)
 
 *专家经验:Nacos的数据库支持情况介绍 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11704)给我们反馈。
