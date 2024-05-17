---
id: "question-history-11189"
title: "nacos 如何修改密码？ nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource nacos 如何修改密码？"
tags: ["修改密码"]
keywords: ["修改密码"]
---

## 用户问题 ： 
 nacos 如何修改密码？ nacos-opensource 

---------------
## 专家官方解答 ：

修改Nacos密码的步骤如下：

1. **通过控制台修改密码**：
   - 登录Nacos控制台。
   - 进入“权限控制”模块，点击“用户管理”。
   - 找到需要修改密码的用户，点击对应的“编辑”或“修改”按钮。
   - 在弹出的界面中，输入新的密码并确认，然后保存更改。

2. **使用运维API修改密码**：
   - 准备好新的密码以及Nacos服务器的地址（`nacos_host`）和端口（`nacos_port`）。
   - 执行以下CURL命令（需替换实际值）：

     ```shell
     curl -X PUT 'http://${nacos_host}:${nacos_port}/nacos/v1/auth/users?username=<目标用户名>&newPassword=<新密码>'
     ```

   > 注意：上述操作在开启鉴权后，需要具有管理员权限。

3. **直接在数据库中修改密码**（适用于使用外置数据库如MySQL部署的Nacos）：
   - 登录Nacos所配置的外置数据库（如MySQL）。
   - 执行以下SQL命令（替换实际值），更新指定用户的密码：

     ```sql
     UPDATE users SET password='<BCrypted新密码>' WHERE username='<目标用户名>';
     ```

   > 注意：
   > - `<BCrypted新密码>`需要使用BCrypt算法进行加密。您可以使用相应的编程语言工具包或Nacos提供的`PasswordEncoderUtil`来完成加密。
   > - 内置的Derby数据库不支持直接修改，因其需要通过Raft协议保持数据一致性。直接修改可能导致集群数据不一致。

综上所述，用户可以根据实际情况选择合适的方法来修改Nacos的密码。这些方法包括通过控制台进行直观操作、利用运维API进行远程调用，或者直接访问外置数据库进行更新。务必确保在进行密码修改时具备相应权限，并正确使用BCrypt加密新密码。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:nacos用户密码设置 
 
 *专家经验:Nacos 配置加密 
 
 *[Nacos 2.0 升级文档](https://nacos.io/docs/latest/upgrading/200-upgrading)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11691)给我们反馈。
