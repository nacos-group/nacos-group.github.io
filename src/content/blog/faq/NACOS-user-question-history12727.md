---
id: "question-history-12727"
title: "nacos  如何管理页面设置密码？ nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "在Nacos管理页面设置密码，主要涉及初始化时的密码设置、集群初始化后的密码修改以及新增用户。以下是详细步骤：### 初始化集群时设置默认用户密码1. **修改默认密码脚本**：在Nacos初始化前，编辑`$nacos.home/conf/`目录下的`mysql-schema.sql`（或`derb"
tags: ["nacos","管理页面","设置密码"]
keywords: ["nacos","管理页面","设置密码"]
---

在Nacos管理页面设置密码，主要涉及初始化时的密码设置、集群初始化后的密码修改以及新增用户。以下是详细步骤：

### 初始化集群时设置默认用户密码
1. **修改默认密码脚本**：在Nacos初始化前，编辑`${nacos.home}/conf/`目录下的`mysql-schema.sql`（或`derby-schema.sql`，取决于你使用的数据库类型），找到关于`users`表的插入语句，将`nacos`的默认密码替换为加密后的${new_password}。记得使用BCrypt加密算法对新密码进行加密，可利用Nacos提供的工具类`PasswordEncoderUtil`进行加密，或者查找相应语言的BCrypt加密工具包。

### 初始化集群后修改密码
1. **通过控制台修改**：
   - 登录Nacos控制台。
   - 进入`权限控制` > `用户管理`。
   - 选择需要修改密码的用户，点击编辑，输入新密码并保存。

2. **使用运维API修改**：
   ```shell
   curl -X PUT 'http://${nacos_host}:${nacos_port}/nacos/v1/auth/users?username=${modified_username}&newPassword=${new_password}'
   ```
   确保使用管理员权限，并且${new_password}已预先加密。

### 新增用户名密码
1. **通过控制台添加**：
   - 登录Nacos控制台。
   - 进入`权限控制` > `用户管理`。
   - 点击添加用户，输入新用户名和密码，完成添加。

2. **使用运维API添加**：
   ```shell
   curl -X POST 'http://${nacos_host}:${nacos_port}/nacos/v1/auth/users?username=${new_username}&password=${new_password}'
   ```
   同样，确保操作具有管理员权限，且密码已加密。

### 注意事项
- 修改或添加的密码需使用BCrypt加密。
- 对于直接数据库操作，仅适用于外置数据库（如MySQL），且要确保操作不会导致集群数据不一致。
- 内置Derby数据库不建议直接修改，以免数据不一致问题。
- 操作均需在开启鉴权后，使用管理员权限执行。

以上步骤涵盖了在Nacos管理页面设置密码的主要方法，确保遵循安全实践，合理管理访问权限。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13868)给我们反馈。
