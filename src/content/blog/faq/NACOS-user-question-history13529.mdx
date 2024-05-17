---
id: "question-history-13529"
title: "nacos_config 中users 表中 username：nacos password的加密方式是什么 nacos-opensource"
date: "2024-05-16"
category: expertConsultation
description: "nacos-opensource nacos_config 中users 表中 username：nacos password的加密方式是什么"
tags: ["nacos_config","users","表","username","nacos","password","加密方式"]
keywords: ["nacos_config","users","表","username","nacos","password","加密方式"]
---

## 用户问题 ： 
 nacos_config 中users 表中 username：nacos password的加密方式是什么 nacos-opensource 

---------------
## 专家官方解答 ：

在Nacos的`users`表中，username为`nacos`的password加密方式是使用BCrypt加密算法。Nacos采用这种加密算法来确保存储的密码安全。如果您需要获取或设置该密码，应该遵循以下步骤进行加密处理：

1. **初始化时修改默认密码**：在Nacos集群初始化前，可以通过修改`mysql-schema.sql`或`derby-schema.sql`中的插入语句来设置加密后的密码。这里，`${new_password}`需要先使用BCrypt算法加密。

2. **使用PasswordEncoderUtil工具加密**：Nacos提供了`PasswordEncoderUtil`工具类来帮助生成BCrypt加密的密码。您可以直接使用该工具类的main方法，将想要设置的密码（如`nacos`）作为参数传入，它会输出加密后的密码字符串。每个加密结果因内部盐值随机生成而有所不同，这是正常现象。

3. **数据库直接修改**：对于外置数据库（非Derby内置数据库），如果需要直接在数据库层面修改密码，也必须使用BCrypt加密后的密码进行更新操作。例如，使用SQL语句`UPDATE users SET password='${new_password}' WHERE username='${modified_username}';`时，`${new_password}`必须是BCrypt加密的结果。

请注意，直接操作内置数据库（Derby）来修改密码是不推荐的，因为这可能导致集群数据不一致。对于密码加密和管理，推荐使用Nacos提供的控制台界面、API或遵循正确的数据库操作流程来确保安全性和一致性。

综上所述，`nacos`用户的密码加密方式为BCrypt，且在进行任何密码相关的修改时，都应确保遵循BCrypt加密规范以维护系统安全性。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:nacos用户密码设置 
 
 *专家经验:Nacos 配置加密 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13530)给我们反馈。
