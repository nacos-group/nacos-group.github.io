---
id: "question-history-11189"
title: "nacos 如何修改密码？ nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "在Nacos中修改密码，您可以根据Nacos集群的初始化状态及您对系统的访问权限，选择以下几种方法之一进行操作：### 如果Nacos集群已初始化：1. **通过控制台修改：**   - 登录Nacos控制台。   - 转至`权限控制` - `用户管理`。   - 选择需要修改密码的用户，点击编辑按"
tags: ["修改密码"]
keywords: ["修改密码"]
---

在Nacos中修改密码，您可以根据Nacos集群的初始化状态及您对系统的访问权限，选择以下几种方法之一进行操作：

### 如果Nacos集群已初始化：

1. **通过控制台修改：**
   - 登录Nacos控制台。
   - 转至`权限控制` -> `用户管理`。
   - 选择需要修改密码的用户，点击编辑按钮进行密码修改。

2. **使用运维API修改：**
   - 执行PUT请求：
     ```shell
     curl -X PUT 'http://${nacos_host}:${nacos_port}/nacos/v1/auth/users?username=${modified_username}&newPassword=${new_password}'
     ```
   - 确保`${nacos_host}`和`${nacos_port}`替换为您的Nacos服务器地址和端口，`${modified_username}`为要修改密码的用户名，`${new_password}`为新密码（需先进行BCrypt加密）。

3. **直接在外部数据库修改：**
   - 对于使用MySQL等外部数据库的场景，登录数据库并执行SQL：
     ```sql
     UPDATE users SET password='${new_password}' WHERE username='${modified_username}';
     ```
   - 记得将`${new_password}`替换为BCrypt加密后的新密码，`${modified_username}`替换为用户名。

### 加密密码：
- 在修改密码时，无论通过哪种方式，新密码都需要先经过BCrypt加密。您可以使用Nacos提供的`PasswordEncoderUtil`工具类来加密密码，或者使用其他支持BCrypt加密的语言工具包。执行如下Java代码获取加密后的密码：
  ```java
  new BCryptPasswordEncoder().encode("your_plain_text_password");
  ```

请注意，上述操作通常需要管理员权限，并且在进行密码修改前，确保Nacos的鉴权功能已开启。如果您遇到任何具体操作上的困难或有其他与Nacos相关的疑问，请随时告知。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13728)给我们反馈。
