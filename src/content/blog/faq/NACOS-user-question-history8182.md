---
id: "question-history-8182"
title: "nacos用户密码设置 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "在Nacos中设置或修改用户密码，可以根据不同的场景采取以下步骤：### 初始化集群时设置默认用户密码1. **修改数据库脚本**：在Nacos集群初始化前，进入`$nacos.home/conf/`目录，编辑`mysql-schema.sql`（假设使用MySQL作为外部数据库），修改默认密码插入"
tags: ["nacos","用户密码设置"]
keywords: ["nacos","用户密码设置"]
---

在Nacos中设置或修改用户密码，可以根据不同的场景采取以下步骤：

### 初始化集群时设置默认用户密码
1. **修改数据库脚本**：在Nacos集群初始化前，进入`${nacos.home}/conf/`目录，编辑`mysql-schema.sql`（假设使用MySQL作为外部数据库），修改默认密码插入语句，如：`INSERT INTO users (username, password, enabled) VALUES ('nacos', '${new_password}', TRUE);`。记得将`${new_password}`替换为经过BCrypt加密的新密码。加密工具可使用Nacos提供的`PasswordEncoderUtil`类，通过运行Java代码获取加密后的密码。

### 初始化集群后修改密码
1. **通过控制台修改**：登录Nacos控制台，进入“权限控制”->“用户管理”，选择相应用户进行密码修改。
2. **使用运维API**：执行PUT请求修改密码，如：`curl -X PUT 'http://${nacos_host}:${nacos_port}/nacos/v1/auth/users?username=${modified_username}&newPassword=${new_password}'`。确保已将`${modified_username}`和`${new_password}`替换为实际用户名和加密后的新密码。

### 新增用户名密码
1. **通过控制台添加**：在Nacos控制台的“权限控制”->“用户管理”界面，添加新用户并设置密码。
2. **使用运维API添加**：执行POST请求添加新用户，如：`curl -X POST 'http://${nacos_host}:${nacos_port}/nacos/v1/auth/users?username=${new_username}&password=${new_password}'`。请先确保`${new_password}`已加密。

### 数据库直接操作（仅限外置数据库）
- **修改密码**：执行SQL语句更新用户密码，如：`UPDATE users SET password='${new_password}' WHERE username='${modified_username}';`，确保密码已加密。
- **添加用户**：执行SQL插入新用户，如：`INSERT INTO users (username, password, enabled) VALUES ('${new_username}', '${new_password}', TRUE);`，密码需提前加密。

### 注意事项
- 修改内置数据库（如Derby）的用户密码不推荐，因可能导致数据不一致。
- 执行API操作和直接数据库操作需确保已开启鉴权且具备管理员权限。
- 对于Nacos配置中心存储的敏感信息，可考虑使用Nacos提供的配置加密插件进行加密处理。

以上步骤涵盖了初始化时设置、集群初始化后修改与新增用户密码的方法，以及注意事项，确保了安全性与灵活性。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13542)给我们反馈。
