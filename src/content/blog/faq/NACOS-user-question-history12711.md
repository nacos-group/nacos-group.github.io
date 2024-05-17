---
id: "question-history-12711"
title: "nacos 如何修改密码？ nacos-opensource"
date: "2024-05-08"
category: expertConsultation
description: "nacos-opensource nacos 如何修改密码？"
tags: ["密码修改"]
keywords: ["密码修改"]
---

## 用户问题 ： 
 nacos 如何修改密码？ nacos-opensource 

---------------
## 专家官方解答 ：

在Nacos中修改密码，您可以按照以下步骤操作：

1. **控制台修改：**
   - 登录Nacos控制台。
   - 转至“权限控制” > “用户管理”。
   - 选择您想要修改密码的用户，点击编辑或者修改密码的相应操作。
   - 输入新密码并保存。

2. **使用运维API：**
   - 确保您有管理员权限，并且Nacos服务端已开启鉴权功能。
   - 执行如下Curl命令：
     ```shell
     curl -X PUT 'http://${nacos_host}:${nacos_port}/nacos/v1/auth/users?username=${modified_username}&newPassword=${new_password}'
     ```
     其中，`${nacos_host}` 和 `${nacos_port}` 分别替换为Nacos服务器的地址和端口，`${modified_username}` 是您要修改密码的用户名，`${new_password}` 是您设置的新密码。

3. **直接更新数据库（仅限外置数据库如MySQL）：**
   - 若Nacos配置了外部数据库，可直接登录该数据库。
   - 执行SQL语句修改密码：
     ```sql
     UPDATE users SET password='${new_password}' WHERE username='${modified_username}';
     ```
     这里`${new_password}` 需要先经过BCrypt加密处理。您可使用编程语言的BCrypt库进行加密，或者查找Nacos提供的`PasswordEncoderUtil`工具。

**注意：**
- 修改密码时，特别是通过API和数据库直接修改，需确保操作者具备相应的权限。
- 如果使用内置Derby数据库，不推荐直接修改数据库记录，因为这可能导致集群数据不一致。
- 新密码必须经过BCrypt加密，以符合Nacos的安全策略。

以上步骤涵盖了通过不同途径修改Nacos用户密码的方法，确保在操作过程中遵循最佳实践和安全指南。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:nacos用户密码设置 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=12718)给我们反馈。
