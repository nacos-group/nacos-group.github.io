---
id: "question-history-11763"
title: "nacos修改默认用户名和密码的具体步骤 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "要修改Nacos的默认用户名和密码，您可以按照以下步骤操作：### 初始化集群前修改默认用户名和密码1. **准备加密密码**：首先，您需要使用BCrypt算法对新密码进行加密。可以利用Nacos提供的`PasswordEncoderUtil`工具类进行加密。在Java环境中，运行以下代码片段，将`"
tags: ["修改","默认","用户名","密码","具体步骤"]
keywords: ["修改","默认","用户名","密码","具体步骤"]
---

要修改Nacos的默认用户名和密码，您可以按照以下步骤操作：

### 初始化集群前修改默认用户名和密码
1. **准备加密密码**：首先，您需要使用BCrypt算法对新密码进行加密。可以利用Nacos提供的`PasswordEncoderUtil`工具类进行加密。在Java环境中，运行以下代码片段，将`nacos`替换为您想要设置的新用户名（如果也想修改用户名的话），并获取加密后的密码：
   ```java
   public class Main {
       public static void main(String[] args) {
           System.out.println(new BCryptPasswordEncoder().encode("your_new_password"));
       }
   }
   ```
   
2. **修改SQL脚本**：在Nacos初始化之前，编辑`${nacos.home}/conf/`目录下的数据库初始化脚本，如`mysql-schema.sql`，将默认的用户名和密码更新为加密后的新值：
   ```sql
   INSERT INTO users (username, password, enabled) VALUES ('your_new_username', 'your_generated_bcrypt_password', TRUE);
   ```

### 初始化集群后修改密码
由于初始化后用户名不可修改，仅能修改密码：
1. **通过控制台修改**：登录Nacos控制台，进入`权限控制` -> `用户管理`，选择相应的用户进行密码修改。

2. **使用运维API修改**：
   ```shell
   curl -X PUT 'http://nacos_host:nacos_port/nacos/v1/auth/users?username=existing_username&newPassword=new_password'
   ```
   确保您具有管理员权限，并将`existing_username`和`new_password`（需先加密）替换为实际值。

### 新增用户名和密码
1. **通过控制台添加**：在Nacos控制台的`权限控制` -> `用户管理`界面，手动添加新用户及密码。

2. **使用运维API添加**：
   ```shell
   curl -X POST 'http://nacos_host:nacos_port/nacos/v1/auth/users?username=new_username&password=new_password'
   ```
   确保新密码已提前加密，并且操作者拥有管理员权限。

### 直接在外部数据库修改
对于使用外部数据库（非Derby）的场景：
- **修改密码**：
  ```sql
  UPDATE users SET password='new_bcrypt_password' WHERE username='existing_username';
  ```
  
- **添加用户**：
  ```sql
  INSERT INTO users (username, password, enabled) VALUES ('new_username', 'new_bcrypt_password', TRUE);
  ```
  记得将`new_bcrypt_password`替换为预先加密的密码。

请注意，直接操作数据库仅适用于外置数据库，并且确保操作不会破坏集群间的数据一致性。在进行任何修改前，建议备份相关数据以防不测。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13790)给我们反馈。
