---
id: "question-history-12730"
title: "修改nacos默认密码的方法说明 nacos-opensource"
date: "2024-05-10"
category: expertConsultation
description: "nacos-opensource 修改nacos默认密码的方法说明"
tags: ["修改","默认密码","方法说明"]
keywords: ["修改","默认密码","方法说明"]
---

## 用户问题 ： 
 修改nacos默认密码的方法说明 nacos-opensource 

---------------
## 专家官方解答 ：

修改Nacos默认密码的方法可以遵循以下步骤进行：

### 初始化集群前修改默认密码
1. **修改数据库脚本**：在Nacos集群初始化之前，直接编辑`${nacos.home}/conf/`目录下的数据库脚本文件（如`mysql-schema.sql`），找到关于`users`表的插入语句，将默认密码`nacos`替换为所需的密码`${new_password}`。注意，${new_password}需要先经过BCrypt加密处理。

### 初始化集群后修改密码
#### 通过控制台
2. **登录控制台**：访问Nacos控制台，进入`权限控制` -> `用户管理`。
3. **修改密码**：选择需要修改密码的用户（默认为`nacos`用户），输入新密码并确认修改。

#### 通过运维API
4. **使用CURL命令**：执行如下命令修改密码（确保已开启鉴权且有管理员权限）：
   ```shell
   curl -X PUT 'http://${nacos_host}:${nacos_port}/nacos/v1/auth/users?username=nacos&newPassword=${new_password}'
   ```
   其中，`${nacos_host}`和`${nacos_port}`分别是Nacos服务器的地址和端口，`${new_password}`是已加密的新密码。

### 直接操作外置数据库
5. **数据库直接修改**：如果Nacos配置了外置数据库（非Derby内置数据库），可以通过SQL命令直接修改密码。
   ```sql
   UPDATE users SET password='${new_password}' WHERE username='nacos';
   ```
   同样，${new_password}需提前加密处理。

### 注意事项
- **密码加密**：无论通过哪种方式修改密码，都需要确保新密码经过了BCrypt加密。
- **内置数据库限制**：对于使用内置Derby数据库的场景，不建议直接修改数据库记录，以避免集群数据不一致的问题。
- **权限要求**：无论是通过控制台还是API修改密码，都需要具有管理员权限。

以上步骤详细介绍了修改Nacos默认密码的各种方法，确保了操作的安全性和兼容性。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:nacos用户密码设置 
 
 *专家经验:Nacos 配置加密 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=12731)给我们反馈。
