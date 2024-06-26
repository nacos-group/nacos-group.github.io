---
id: "question-history-15434"
title: "nacos作为注册中心使用，数据会存储在外部共享数据库吗 nacos-opensource"
date: "2024-06-17"
category: "expertConsultation"
description: "Nacos 作为服务注册中心使用时，其数据存储方式是可以配置的。默认情况下，Nacos 使用嵌入式数据库（SQLite）来存储服务实例信息、配置数据等。但是，为了适应生产环境的需求，Nacos 支持将数据存储在外部的共享数据库中，以提高数据的可靠性和可扩展性。**依托于** 知识: Nacos 配置"
---

## 用户问题 ： 
 nacos作为注册中心使用，数据会存储在外部共享数据库吗 nacos-opensource 

---------------
## 专家官方解答 ：

Nacos 作为服务注册中心使用时，其数据存储方式是可以配置的。默认情况下，Nacos 使用嵌入式数据库（SQLite）来存储服务实例信息、配置数据等。但是，为了适应生产环境的需求，Nacos 支持将数据存储在外部的共享数据库中，以提高数据的可靠性和可扩展性。

**依托于** {{{知识: Nacos 配置外部数据库教程}}}, 我可以提供具体的步骤来说明如何配置 Nacos 使用外部共享数据库：

1. **选择数据库类型**：确保你所选择的外部数据库（如 MySQL、PostgreSQL 等）已经安装并运行正常。Nacos 支持多种数据库类型，但推荐使用 MySQL。

2. **修改 Nacos 配置文件**：
   - 找到 Nacos 的配置文件 `application.properties`（在 Nacos 的 conf 目录下）。
   - 根据你选择的数据库类型，修改相应的配置项。例如，若选用 MySQL，你需要设置如下的属性：
     ```
     spring.datasource.platform=mysql
     db.num=1
     db.url.0=jdbc:mysql://<数据库地址>:<端口>/<数据库名>?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
     db.user=<用户名>
     db.password=<密码>
     ```
   - 请替换 `<数据库地址>`, `<端口>`, `<数据库名>`, `<用户名>`, `<密码>` 为实际的数据库连接信息。

3. **初始化数据库表结构**：
   - Nacos 提供了 SQL 脚本用于初始化数据库表结构。根据你所使用的数据库类型，在 Nacos 分发包的 `nacos/conf` 目录下找到对应的 SQL 脚本，如 `nacos-mysql.sql`，并在你的数据库中执行这个脚本。

4. **重启 Nacos 服务器**：保存配置文件的更改后，重启 Nacos 服务器。Nacos 将开始使用你配置的外部数据库来存储和管理数据。

**解释**：
- 修改配置文件是为了让 Nacos 知道要连接哪个外部数据库以及如何连接。
- 初始化数据库表结构是必要的，因为 Nacos 需要在特定的数据库表中存储服务实例和配置信息。
- 重启服务器使配置生效，确保 Nacos 使用新配置的数据库来处理数据。

通过以上步骤，Nacos 就能成功地将数据存储在外部共享数据库中了。这不仅提高了数据管理的灵活性，也便于在集群部署中实现数据共享。


<font color="#949494">---------------</font> 


## 参考链接 ：

*[Dubbo 融合 Nacos 成为注册中心](https://nacos.io/docs/latest/ecology/use-nacos-with-dubbo)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=15504)给我们反馈。
