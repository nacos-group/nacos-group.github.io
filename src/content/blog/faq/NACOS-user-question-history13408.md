---
id: "question-history-13408"
title: "nacos修改密码 nacos-opensource"
date: "2024-05-13"
category: expertConsultation
description: "nacos-opensource nacos修改密码"
tags: ["修改密码"]
keywords: ["修改密码"]
---

## 用户问题 ： 
 nacos修改密码 nacos-opensource 

---------------
## 专家官方解答 ：

在Nacos中修改密码，可以根据不同场景采取以下步骤：

### 场景一：通过控制台修改
1. **登录Nacos控制台**：使用管理员账号登录Nacos Web控制台。
2. **导航至权限控制**：点击“权限控制”菜单下的“用户管理”。
3. **选择用户并修改密码**：找到需要修改密码的用户，点击编辑按钮，输入新密码并保存。

### 场景二：使用运维API修改
1. **准备API请求**：构造PUT请求，格式如下：
   ```shell
   curl -X PUT 'http://${nacos_host}:${nacos_port}/nacos/v1/auth/users?username=${modified_username}&newPassword=${new_password}'
   ```
   其中，`${nacos_host}`和`${nacos_port}`分别替换为Nacos服务器的地址和端口，`${modified_username}`是需修改密码的用户名，`${new_password}`是加密后的新密码。
   
2. **加密新密码**：确保`${new_password}`已经过BCrypt加密。如果不熟悉加密过程，可利用Nacos提供的`PasswordEncoderUtil`工具或查找相应语言的BCrypt加密库进行加密。
3. **执行请求**：在终端或Postman等工具中执行上述构造的API请求。

### 场景三：直接在外部数据库修改（仅限外置数据库）
1. **连接数据库**：使用数据库管理工具登录到Nacos配置的外置数据库，如MySQL。
2. **更新密码**：执行SQL更新语句，例如：
   ```sql
   UPDATE users SET password='${new_password}' WHERE username='${modified_username}';
   ```
   确保`${new_password}`已经过BCrypt加密。
3. **验证修改**：重新登录Nacos控制台，验证密码是否成功修改。

### 注意事项：
- 上述操作在Nacos开启鉴权后均需管理员权限。
- 内置Derby数据库不支持直接修改密码，以保持集群数据一致性。
- 修改密码时，记得按照要求对新密码进行加密处理。

参考链接：
- [Nacos用户密码设置](https://nacos.io/zh-cn/docs/user-password-settings.html)
- [Nacos配置加密](https://nacos.io/zh-cn/docs/configuration-encryption.html)


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:nacos用户密码设置 
 
 *专家经验:Nacos 配置加密 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13411)给我们反馈。
