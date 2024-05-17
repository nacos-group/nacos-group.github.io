---
id: "question-history-13407"
title: "nacos默认用户名密码 nacos-opensource"
date: "2024-05-13"
category: expertConsultation
description: "nacos-opensource nacos默认用户名密码"
tags: ["nacos","默认用户名密码"]
keywords: ["nacos","默认用户名密码"]
---

## 用户问题 ： 
 nacos默认用户名密码 nacos-opensource 

---------------
## 专家官方解答 ：

Nacos的默认用户名和密码均为`nacos`。这一信息直接来源于初始化设置，默认情况下，Nacos会使用这些凭证作为管理员账户的凭据。

如果您需要修改默认的用户名和密码，或者是在初始化集群之后管理用户凭证，可以遵循以下步骤：

1. **初始化时修改默认密码**：在Nacos集群部署前，编辑`${nacos.home}/conf/`目录下的数据库脚本文件（如`mysql-schema.sql`），将默认密码替换为加密后的自定义密码。记得使用BCrypt算法对新密码进行加密。

2. **初始化后修改密码**：
   - 通过Nacos控制台的“权限控制” -> “用户管理”界面进行在线修改。
   - 使用运维API调用，如通过`curl`命令执行PUT请求来修改指定用户的密码。

3. **新增用户**：
   - 同样，可以在控制台的“用户管理”界面添加新用户。
   - 或者利用运维API的POST请求，提供新用户名和加密后的密码来创建用户。

4. **直接数据库操作**（仅适用于外置数据库如MySQL）：
   - 更新密码：执行SQL更新语句修改特定用户的密码，确保密码已加密。
   - 添加用户：通过执行SQL插入语句添加新用户记录，密码同样需要提前加密。

请注意，以上操作，特别是在进行API调用和直接数据库操作时，需确保已开启鉴权并具备管理员权限。此外，对于Nacos的身份认证绕过漏洞问题，确保系统已升级至安全版本，并按照官方指南修改相关安全配置，特别是检查和更新`nacos.core.auth.plugin.nacos.token.secret.key`等敏感配置的值。

参考链接：
- Nacos官方文档关于认证授权的详细指南：[https://nacos.io/docs/latest/guide/user/auth/](https://nacos.io/docs/latest/guide/user/auth/)
- Nacos关于Token Secret Key的重要公告：[https://nacos.io/blog/announcement-token-secret-key/?source=activity](https://nacos.io/blog/announcement-token-secret-key/?source=activity)


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:nacos用户密码设置 
 
 *专家经验:Nacos 身份认证绕过漏洞 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13410)给我们反馈。
