---
id: "question-history-12730"
title: "修改nacos默认密码的方法说明 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "修改Nacos默认密码的方法可以分为以下几种情况：### 初始化集群前设置默认用户密码1. **修改初始化脚本**：在Nacos集群初始化之前，编辑`$nacos.home/conf/`目录下的`mysql-schema.sql`（或相应的数据库类型脚本），找到关于`users`表的插入语句，将默认"
tags: ["修改","默认密码","方法说明"]
keywords: ["修改","默认密码","方法说明"]
---

## 用户问题 ： 
 修改nacos默认密码的方法说明 nacos-opensource 

---------------
## 专家官方解答 ：

修改Nacos默认密码的方法可以分为以下几种情况：

### 初始化集群前设置默认用户密码
1. **修改初始化脚本**：在Nacos集群初始化之前，编辑`${nacos.home}/conf/`目录下的`mysql-schema.sql`（或相应的数据库类型脚本），找到关于`users`表的插入语句，将默认密码`nacos`替换为你想要的密码`${new_password}`。注意，这里的`${new_password}`需要先经过BCrypt加密。
   - 加密密码方法：可以使用Nacos提供的工具类`PasswordEncoderUtil`，通过运行以下Java代码获取加密后的密码：
     ```java
     System.out.println(new BCryptPasswordEncoder().encode("你想要设置的密码"));
     ```
2. **应用加密密码**：将加密后的密码替换到SQL脚本中，完成初始化后，Nacos的默认用户密码即为设定的新密码。

### 初始化集群后修改密码
1. **通过控制台修改**：
   - 登录Nacos控制台。
   - 进入`权限控制` -> `用户管理`。
   - 选择`nacos`用户，点击修改密码，按照界面提示操作。

2. **使用运维API修改**：
   - 执行HTTP PUT请求：
     ```shell
     curl -X PUT 'http://${nacos_host}:${nacos_port}/nacos/v1/auth/users?username=nacos&newPassword=${new_password}'
     ```
     其中`${new_password}`需提前加密。

3. **直接修改数据库（仅限外置数据库如MySQL）**：
   - 登录数据库管理工具。
   - 执行SQL更新语句：
     ```sql
     UPDATE users SET password='${new_password}' WHERE username='nacos';
     ```
     确保`${new_password}`已加密。

### 注意事项
- 内置数据库（如Derby）不建议直接修改，因可能导致数据不一致。
- 修改密码时，如果Nacos开启了鉴权，操作需具有管理员权限。
- 确保在执行任何密码修改操作前，已备份相关配置和数据，以防不测。

以上步骤覆盖了修改Nacos默认密码的主要方法，确保遵循每个步骤的安全与规范操作。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：nacos用户密码设置 
 
 *专家经验：Nacos 配置加密 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13869)给我们反馈。
