---
id: "question-history-11763"
title: "nacos修改默认用户名和密码的具体步骤 nacos-opensource"
date: "2024-04-24"
category: expertConsultation
description: "nacos-opensource nacos修改默认用户名和密码的具体步骤"
tags: ["修改","默认","用户名","密码","具体步骤"]
keywords: ["修改","默认","用户名","密码","具体步骤"]
---

## 用户问题 ： 
 nacos修改默认用户名和密码的具体步骤
 nacos-opensource 

---------------
## 专家官方解答 ：

修改Nacos默认用户名和密码的具体步骤如下：

**步骤一：初始化集群前设置默认用户密码**

如果您正在初始化Nacos集群，并希望在初始阶段就更改默认的用户名和密码，可以按照以下步骤操作：

1. **定位配置文件**：进入Nacos安装目录下的`${nacos.home}/conf/`目录。

2. **编辑数据库脚本**：找到并打开`derby-schema.sql`（对于内置数据库Derby）或`mysql-schema.sql`（对于外置数据库MySQL）文件。

3. **修改插入语句**：找到关于`users`表的插入语句，将默认用户名（通常为`nacos`）和密码（通常为`nacos`）更改为所需的自定义用户名和密码。确保新密码经过BCrypt加密。

   示例（以MySQL为例）：
   ```mysql
   INSERT INTO users (username, password, enabled) VALUES ('${new_username}', '${new_password}', TRUE);
   ```

   其中，`${new_username}`替换为新的用户名，`${new_password}`替换为经过BCrypt加密的新密码。

4. **保存并退出**：保存修改后的数据库脚本文件。

**步骤二：初始化集群后设置用户名密码**

如果您已经完成了Nacos集群的初始化，可以按照以下任一方式修改默认用户名密码或新增用户：

**方法一：通过Nacos控制台**

1. **访问控制台**：打开Nacos控制台（默认地址：`http://localhost:8848/nacos/`），登录默认账号（用户名：`nacos`，密码：`nacos`）。

2. **进入权限管理**：点击左侧菜单栏的“权限控制”，接着选择“用户管理”。

3. **修改密码**：找到需要修改密码的用户（如默认用户`nacos`），点击操作列的“编辑”按钮，更新密码后保存。

**方法二：使用运维API**

1. **准备参数**：确定目标用户名、新密码以及Nacos服务器的`nacos_host`和`nacos_port`。

2. **执行修改密码命令**（以修改默认用户名`nacos`的密码为例）：
   ```shell
   curl -X PUT 'http://${nacos_host}:${nacos_port}/nacos/v1/auth/users?username=nacos&newPassword=${new_password}'
   ```

**方法三：直接在数据库中操作（仅适用于外置数据库如MySQL）**

1. **连接数据库**：使用数据库客户端工具连接到Nacos配置的外置数据库。

2. **执行修改密码SQL**（以修改默认用户名`nacos`的密码为例）：
   ```sql
   UPDATE users SET password='${new_password}' WHERE username='nacos';
   ```

3. **执行新增用户SQL**（以新增用户名`new_user`为例）：
   ```sql
   INSERT INTO users (username, password, enabled) VALUES ('new_user', '${new_password}', TRUE);
   ```

请注意，所有涉及密码的操作均需确保新密码已使用BCrypt加密，并且在Nacos开启鉴权的情况下，上述操作需具备管理员权限。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:nacos用户密码设置 
 
 *[Nacos Docker 快速开始](https://nacos.io/docs/latest/quickstart/quick-start-docker)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11778)给我们反馈。
