---
id: "question-history-12710"
title: "nacos的默认用户名密码是什么？ nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "Nacos的默认用户名和密码均为`nacos`。这一信息是在Nacos初始化时设置的，默认管理员账户的凭证。如果您需要修改这些默认凭证，可以根据Nacos的不同使用阶段参照以下步骤操作：1. **初始化集群前修改默认密码：**   - 在Nacos集群启动前，编辑`$nacos.home/conf/"
tags: ["nacos","默认用户名密码"]
keywords: ["nacos","默认用户名密码"]
---

## 用户问题 ： 
 nacos的默认用户名密码是什么？ nacos-opensource 

---------------
## 专家官方解答 ：

Nacos的默认用户名和密码均为`nacos`。这一信息是在Nacos初始化时设置的，默认管理员账户的凭证。如果您需要修改这些默认凭证，可以根据Nacos的不同使用阶段参照以下步骤操作：

1. **初始化集群前修改默认密码：**
   - 在Nacos集群启动前，编辑`${nacos.home}/conf/`目录下的数据库schema文件（如`mysql-schema.sql`），更改默认密码插入语句中的`password`字段为加密后的${new_password}。记得使用BCrypt算法对新密码进行加密。

2. **初始化集群后修改密码：**
   - 通过Nacos控制台的“权限控制”->“用户管理”界面修改。
   - 或利用运维API调用，例如：
     ```shell
     curl -X PUT 'http://${nacos_host}:${nacos_port}/nacos/v1/auth/users?username=nacos&newPassword=${new_password}'
     ```
   这里，${new_password}同样需要是BCrypt加密后的密码字符串。

3. **新增用户：**
   - 同样可以在控制台的“用户管理”界面添加新用户。
   - 也可以使用API调用来添加：
     ```shell
     curl -X POST 'http://${nacos_host}:${nacos_port}/nacos/v1/auth/users?username=${new_username}&password=${new_password}'
     ```
   添加时，提供的密码也需提前进行BCrypt加密。

请注意，直接在数据库中修改密码或添加用户仅适用于外置数据库（如MySQL），并且操作前确保密码已正确加密。对于内置Derby数据库，不建议直接修改数据库记录，以避免集群数据不一致的问题。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：nacos用户密码设置 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13861)给我们反馈。
