---
id: "question-history-8420"
title: "请问一下1.2.0如何修改默认密码 nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource 请问一下1.2.0如何修改默认密码"
tags: ["1.2.0","修改","默认密码"]
keywords: ["1.2.0","修改","默认密码"]
---

## 用户问题 ： 
 请问一下1.2.0如何修改默认密码 nacos-opensource 

---------------
## 专家官方解答 ：

在Nacos 1.2.0版本中，修改默认密码的步骤如下：

1. **确认Nacos部署模式**：Nacos可以使用内置的嵌入式数据库（如Derby）进行部署，也可以使用外置数据库（如MySQL）。不同的部署模式，修改默认密码的方法略有不同。

2. **针对内置数据库部署**：

   a. **直接在配置文件中修改**：找到Nacos安装目录下的`conf/derby-schema.sql`文件，定位到与用户密码相关的SQL插入语句。将其中默认的密码（通常为'nacos'）替换为你希望设置的新密码。确保新密码经过BCrypt加密处理。

   b. **重新启动Nacos**：修改配置文件后，需要重启Nacos服务以使更改生效。执行`nacos/bin/startup.sh`（Linux环境）或`nacos/bin/startup.cmd`（Windows环境）启动Nacos。

   c. **验证密码更改**：使用新密码尝试登录Nacos控制台，确认密码已成功更新。

3. **针对外置数据库部署**：

   a. **直接在数据库中修改**：登录Nacos所使用的外置数据库（如MySQL），执行相应的SQL更新语句来更改默认用户的密码。例如：

      ```sql
      UPDATE users SET password='{{新密码经BCrypt加密后的值}}' WHERE username='nacos';
      ```

      确保新密码已经过BCrypt加密处理。

   b. **验证密码更改**：使用新密码尝试登录Nacos控制台，确认密码已成功更新。

**注意事项**：

- **BCrypt加密**：无论是直接修改配置文件还是在数据库中更新密码，都需要确保新密码经过BCrypt加密。可以使用Nacos提供的`PasswordEncoderUtil`工具类（或其他语言的BCrypt库）进行加密。

- **权限要求**：如果Nacos开启了鉴权功能，进行上述操作可能需要具备管理员权限。

综上所述，通过上述步骤即可在Nacos 1.2.0版本中成功修改默认密码。根据你的部署模式选择相应的方法进行操作。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:nacos用户密码设置 
 
 *专家经验:如何解决Nacos连接超时问题 
 
 *[Nacos 2.0 升级文档](https://nacos.io/docs/latest/upgrading/200-upgrading)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11605)给我们反馈。
