---
id: "question-history-12711"
title: "nacos 如何修改密码？ nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "在Nacos中修改密码，您可以根据Nacos集群的初始化状态以及您是否拥有管理员权限，选择合适的方法进行操作。以下是具体的步骤指导：### 如果Nacos集群尚未初始化1. **自定义初始化密码**：   - 在部署Nacos前，手动编辑配置文件。找到`$nacos.home/conf/`目录下的`"
tags: ["修改密码"]
keywords: ["修改密码"]
---

在Nacos中修改密码，您可以根据Nacos集群的初始化状态以及您是否拥有管理员权限，选择合适的方法进行操作。以下是具体的步骤指导：

### 如果Nacos集群尚未初始化

1. **自定义初始化密码**：
   - 在部署Nacos前，手动编辑配置文件。找到`${nacos.home}/conf/`目录下的`mysql-schema.sql`（或其他数据库类型对应的schema文件），修改默认用户密码插入语句。
   ```sql
   INSERT INTO users (username, password, enabled) VALUES ('nacos', '${new_password}', TRUE);
   ```
   - 确保`${new_password}`已使用BCrypt加密。您可利用Nacos提供的`PasswordEncoderUtil`工具类进行加密，或查找相应语言的BCrypt加密库。

### 如果Nacos集群已经初始化

#### 通过控制台修改

1. **登录Nacos控制台**。
2. 导航至**权限控制** > **用户管理**。
3. 选择需要修改密码的用户，点击编辑，输入新密码并保存。

#### 使用运维API修改

1. **准备API调用**：
   - 确定`nacos_host`和`nacos_port`为您的Nacos服务器地址和端口。
   - 准备好`modified_username`（当前用户名）和经过BCrypt加密的`new_password`。
2. **执行PUT请求**：
   ```shell
   curl -X PUT 'http://${nacos_host}:${nacos_port}/nacos/v1/auth/users?username=${modified_username}&newPassword=${new_password}'
   ```

#### 直接在外部数据库修改（仅限外置数据库如MySQL）

1. **加密新密码**：使用BCrypt工具提前加密`new_password`。
2. **执行SQL更新**：
   ```sql
   UPDATE users SET password='${new_password}' WHERE username='${modified_username}';
   ```

### 注意事项
- 上述所有涉及修改密码的操作，在Nacos开启鉴权后，都需要管理员权限。
- 内置Derby数据库不建议直接修改，以避免数据不一致问题，推荐通过控制台或API操作。
- 确保在执行密码修改操作前，已正确加密新密码。

综上所述，修改Nacos密码可通过控制台界面、运维API调用或直接操作外部数据库实现，具体选择哪种方法取决于您的具体场景和权限。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13862)给我们反馈。
