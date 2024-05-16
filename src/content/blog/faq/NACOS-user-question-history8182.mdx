---
id: "question-history-8182"
title: "nacos用户密码设置 nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource nacos用户密码设置"
tags: ["nacos","用户密码设置"]
keywords: ["nacos","用户密码设置"]
---

## 用户问题 ： 
 nacos用户密码设置 nacos-opensource 

---------------
## 专家官方解答 ：

Nacos用户密码设置涉及到以下几个方面：

1. **初始化集群时设置默认用户密码**：
   - 默认情况下，Nacos初始化时会创建一个管理员账户，用户名和密码均为`nacos`。
   - 若要在初始化时更改默认密码，需在`${nacos.home}/conf/`目录下修改`derby-schema.sql`和`mysql-schema.sql`文件中的相关SQL语句。具体做法是，找到`users`表的插入语句，将`'nacos', 'nacos'`替换为`'nacos', '${new_password}'`，其中`${new_password}`需使用BCrypt算法加密。您可以使用相应的编程语言工具包或Nacos提供的`PasswordEncoderUtil`进行加密。

2. **初始化集群后设置用户名密码**：
   - **修改密码**：
     - **通过控制台**：登录Nacos控制台，进入“权限控制”->“用户管理”，选择目标用户进行密码修改。
     - **通过运维API**：发送PUT请求至`http://${nacos_host}:${nacos_port}/nacos/v1/auth/users?username=${modified_username}&newPassword=${new_password}`。注意，这些操作在开启鉴权后需要管理员权限。
   - **新增用户名密码**：
     - **通过控制台**：同样在“权限控制”->“用户管理”界面，添加新用户并设定其密码。
     - **通过运维API**：发送POST请求至`http://${nacos_host}:${nacos_port}/nacos/v1/auth/users?username=${new_username}&password=${new_password}`。同样需要管理员权限。

3. **直接在数据库操作**（仅适用于外置数据库如MySQL）：
   - **修改密码**：执行SQL语句`UPDATE users SET password='${new_password}' WHERE username='${modified_username}'`，其中`${new_password}`需使用BCrypt加密。
   - **新增用户名密码**：执行SQL语句`INSERT INTO users (username, password, enabled) VALUES ('${new_username}', '${new_password}', TRUE)`，同样需要对`${new_password}`进行BCrypt加密。

综上所述，Nacos用户密码的设置涵盖了初始化时的默认密码修改、集群初始化后的密码修改与新增用户，以及直接在数据库层面的操作。无论是通过控制台、运维API还是直接对数据库进行操作，都需要确保密码经过BCrypt加密，并在开启鉴权后以管理员权限进行。根据实际需求和环境条件，可选择合适的方法进行用户密码的设置与管理。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:nacos用户密码设置 
 
 *专家经验:Nacos 配置加密 
 
 *专家经验:nacos 代码结构 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11504)给我们反馈。
