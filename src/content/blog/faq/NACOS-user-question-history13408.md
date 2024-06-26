---
id: "question-history-13408"
title: "nacos修改密码 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "在Nacos中修改密码，可以根据初始化阶段和集群状态的不同，采取以下步骤：### 初始化集群前修改默认密码1. **修改默认密码脚本**     在Nacos集群初始化之前，可以直接修改`$nacos.home/conf/`目录下的数据库初始化脚本（如`mysql-schema.sql`），将默认管"
tags: ["修改密码"]
keywords: ["修改密码"]
---

## 用户问题 ： 
 nacos修改密码 nacos-opensource 

---------------
## 专家官方解答 ：

在Nacos中修改密码，可以根据初始化阶段和集群状态的不同，采取以下步骤：

### 初始化集群前修改默认密码
1. **修改默认密码脚本**  
   在Nacos集群初始化之前，可以直接修改`${nacos.home}/conf/`目录下的数据库初始化脚本（如`mysql-schema.sql`），将默认管理员账户的密码更改为所需的值。例如：
   ```sql
   INSERT INTO users (username, password, enabled) VALUES ('nacos', '${new_password}', TRUE);
   ```
   其中`${new_password}`需先通过BCrypt加密。可以使用Nacos提供的工具类`PasswordEncoderUtil`进行加密：
   ```java
   public class PasswordEncoderUtil {
       public static void main(String[] args) {
           System.out.println(new BCryptPasswordEncoder().encode("nacos"));
       }
   }
   ```
   运行上述Java代码，将`nacos`替换为想要设定的新密码，获取加密后的密码并填入SQL脚本。

### 初始化集群后修改密码
#### 通过控制台
1. **登录Nacos控制台**  
   使用默认或已知的管理员账户登录Nacos控制台。
2. **进入用户管理**  
   在控制台导航至`权限控制` -> `用户管理`。
3. **修改密码**  
   选择需要修改密码的用户，点击编辑，输入新密码并保存。

#### 使用运维API
1. **修改现有用户密码**  
   执行PUT请求：
   ```shell
   curl -X PUT 'http://${nacos_host}:${nacos_port}/nacos/v1/auth/users?username=${modified_username}&newPassword=${new_password}'
   ```
   其中`${modified_username}`为用户名，`${new_password}`为加密后的新密码。

#### 直接修改数据库（外置数据库）
1. **连接数据库**  
   使用数据库管理工具连接到Nacos使用的外置数据库。
2. **更新密码**  
   执行SQL更新语句：
   ```sql
   UPDATE users SET password='${new_password}' WHERE username='${modified_username}';
   ```
   确保`${new_password}`已进行BCrypt加密。

### 注意事项
- 内置Derby数据库不建议直接修改，以避免数据不一致问题。
- 修改密码时确保拥有管理员权限。
- 密码加密是必要的安全措施，务必遵守。

以上步骤涵盖了不同场景下修改Nacos用户密码的方法，确保操作符合系统安全规范。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：nacos用户密码设置 
 
 *专家经验：Nacos 配置加密 
 
 *专家经验：nacos 代码结构 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13889)给我们反馈。
