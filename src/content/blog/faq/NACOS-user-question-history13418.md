---
id: "question-history-13418"
title: "怎么创建新的用户和密码？ nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "在Nacos中创建新的用户和密码，可以通过以下步骤进行：### 控制台操作1. **登录Nacos控制台**：首先，使用管理员账号（默认为`nacos`/`nacos`）登录Nacos控制台。2. **进入用户管理**：在控制台导航至`权限控制`  `用户管理`页面。3. **添加新用户**：点击`"
tags: ["创建","新","用户","密码"]
keywords: ["创建","新","用户","密码"]
---

在Nacos中创建新的用户和密码，可以通过以下步骤进行：

### 控制台操作
1. **登录Nacos控制台**：首先，使用管理员账号（默认为`nacos`/`nacos`）登录Nacos控制台。
2. **进入用户管理**：在控制台导航至`权限控制` > `用户管理`页面。
3. **添加新用户**：点击`添加用户`按钮，输入新用户的用户名和预先设定的密码。确保密码符合安全性要求。
4. **分配权限**（可选）：根据需要，为新用户分配相应的角色和权限，然后保存设置。

### 运维API调用
如果您偏好使用API操作，可以通过以下命令添加新用户：

```shell
curl -X POST 'http://${nacos_host}:${nacos_port}/nacos/v1/auth/users?username=${new_username}&password=${new_password}'
```
- 替换`${nacos_host}`和`${nacos_port}`为您的Nacos服务器地址和端口。
- 将`${new_username}`和`${new_password}`替换为想要创建的用户名和密码。注意，这里的密码应为已经BCrypt加密过的密文。您可以通过Nacos提供的`PasswordEncoderUtil`工具或相应语言的BCrypt库来加密密码。

### 数据库直接操作（仅限外置数据库）
对于使用外置数据库（如MySQL）的场景，您也可以直接在数据库层面操作：
1. **修改密码**：
   ```SQL
   UPDATE users SET password='${new_password}' WHERE username='${modified_username}';
   ```
2. **添加新用户**：
   ```SQL
   INSERT INTO users (username, password, enabled) VALUES ('${new_username}', '${new_password}', TRUE);
   ```
确保在执行这些SQL语句前，`${new_password}`已经被正确地BCrypt加密。

### 注意事项
- 在进行上述操作时，特别是直接操作数据库，需确保已开启鉴权功能且您拥有管理员权限。
- 内置Derby数据库不建议直接修改，以避免集群数据不一致的问题。
- 密码加密是必要的安全措施，务必使用BCrypt加密算法。

以上步骤详细介绍了如何在Nacos中创建新用户和密码，您可以根据实际情况选择最适合的方法进行操作。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13892)给我们反馈。
