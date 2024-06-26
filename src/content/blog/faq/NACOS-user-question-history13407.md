---
id: "question-history-13407"
title: "nacos默认用户名密码 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "Nacos的默认用户名和密码均为`nacos`。这一信息直接来源于其初始化设置，默认情况下，Nacos会使用这些凭证作为管理员账户的凭据。如果您需要修改默认的用户名密码或者在初始化集群后管理用户密码，可以遵循以下步骤：1. **初始化集群时修改默认密码：**   - 在Nacos安装目录的`conf"
tags: ["nacos","默认用户名密码"]
keywords: ["nacos","默认用户名密码"]
---

## 用户问题 ： 
 nacos默认用户名密码 nacos-opensource 

---------------
## 专家官方解答 ：

Nacos的默认用户名和密码均为`nacos`。这一信息直接来源于其初始化设置，默认情况下，Nacos会使用这些凭证作为管理员账户的凭据。

如果您需要修改默认的用户名密码或者在初始化集群后管理用户密码，可以遵循以下步骤：

1. **初始化集群时修改默认密码：**
   - 在Nacos安装目录的`conf/`文件夹下，找到`mysql-schema.sql`或`derby-schema.sql`（取决于您使用的数据库类型）。
   - 修改相应的SQL插入语句，将`nacos`的默认密码替换为您想要设置的新密码。记得使用BCrypt算法对新密码进行加密。您可以使用Nacos提供的`PasswordEncoderUtil`工具类来完成加密过程。

2. **初始化集群后修改密码：**
   - 通过Nacos控制台的“权限控制”->“用户管理”界面进行密码修改。
   - 或者，使用运维API调用，例如：`curl -X PUT 'http://${nacos_host}:${nacos_port}/nacos/v1/auth/users?username=${modified_username}&newPassword=${new_password}'`，需确保已开启鉴权并具备管理员权限。

3. **新增用户：**
   - 同样，您可以通过控制台的“用户管理”界面添加新用户。
   - 也可通过API调用实现，命令示例：`curl -X POST 'http://${nacos_host}:${nacos_port}/nacos/v1/auth/users?username=${new_username}&password=${new_password}'`，操作时需考虑鉴权状态和权限要求。

4. **直接在数据库中修改：**
   - 对于使用外置数据库（非Derby）的情况，可以直接执行SQL语句来修改密码或添加用户。记得密码需先进行BCrypt加密处理。

请注意，对于安全方面的考虑，如果发现存在身份认证绕过漏洞，应立即采取措施升级Nacos至最新稳定版本，并按照官方文档调整相关安全配置，如修改`nacos.core.auth.plugin.nacos.token.secret.key`等敏感参数，以避免潜在风险。具体指导可参考Nacos官方文档的[身份验证指南](https://nacos.io/docs/latest/guide/user/auth/)和关于[Token Secret Key的重要公告](https://nacos.io/blog/announcement-token-secret-key/?source=activity)。

综上所述，无论是初始化时的密码设定还是后续的管理操作，都应确保遵循最佳安全实践，以维护Nacos系统的安全性。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：nacos用户密码设置 
 
 *专家经验：Nacos 身份认证绕过漏洞 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13888)给我们反馈。
