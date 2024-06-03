---
id: "question-history-14928"
title: "2.3.2 版本开启鉴权之后的默认用户和密码 nacos-opensource"
date: "2024-06-03"
category: "expertConsultation"
description: "在Nacos 2.3.2版本中，开启鉴权后，默认用户仍然是`nacos`，但默认情况下，密码不再是明文的`nacos`。根据Nacos的安全实践，强烈建议在初始化或首次启动时即修改默认密码。如果在开启鉴权的过程中没有特别设置，默认密码应该是通过BCrypt加密的`nacos`值。由于加密后的密码每次"
---

## 用户问题 ： 
 2.3.2 版本开启鉴权之后的默认用户和密码 nacos-opensource 

---------------
## 专家官方解答 ：

在Nacos 2.3.2版本中，开启鉴权后，默认用户仍然是`nacos`，但默认情况下，密码不再是明文的`nacos`。根据Nacos的安全实践，强烈建议在初始化或首次启动时即修改默认密码。如果在开启鉴权的过程中没有特别设置，默认密码应该是通过BCrypt加密的`nacos`值。由于加密后的密码每次生成可能不同，你需要通过以下步骤来确认或重置此密码：

### 确认或重置默认用户密码

1. **使用Nacos提供的密码加密工具**
   - 首先，你可以利用Nacos提供的`PasswordEncoderUtil`工具类来生成加密后的密码。执行以下Java代码段：
     ```java
     public class Main {
         public static void main(String[] args) {
             System.out.println(new BCryptPasswordEncoder().encode("你的新密码"));
         }
     }
     ```
   - 将`你的新密码`替换为你想要设置的新密码，运行这段代码，它将输出加密后的密码。

2. **修改数据库中的密码（仅适用于外置数据库）**
   - 如果你使用的是MySQL等外置数据库，可以直接更新`users`表中的密码字段。使用上一步得到的加密密码执行SQL语句：
     ```sql
     UPDATE users SET password='加密后的新密码' WHERE username='nacos';
     ```
   - 请注意，对于内置Derby数据库，不建议直接修改数据库，因为这可能导致集群数据不一致。

3. **通过控制台修改密码（推荐）**
   - 登录Nacos控制台，进入`权限控制` -> `用户管理`，找到`nacos`用户，点击编辑，输入新密码并保存。此操作需要当前已有管理员权限。

4. **使用运维API修改密码**
   - 如果你希望通过API修改，确保你有管理员权限，并且Nacos服务已经开启了API访问。执行如下CURL命令：
     ```shell
     curl -X PUT 'http://${nacos_host}:${nacos_port}/nacos/v1/auth/users?username=nacos&newPassword=加密后的新密码'
     ```
     其中，`加密后的新密码`是上一步得到的加密密码。

### 总结
- 开启鉴权后，默认用户名为`nacos`，但默认密码需根据实际情况确认或重置，推荐使用加密工具生成密码并按照上述步骤进行设置。
- 考虑到安全性，建议采用控制台或API方式修改密码，以确保操作的正确性和安全性。
- 对于生产环境，务必遵循最佳安全实践，如定期更换密码，限制访问权限，以及不直接暴露Nacos服务至公网。

请注意，操作前请确保有适当的备份和恢复计划，以防不测。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：nacos用户密码设置 
 
 *专家经验：Nacos不开启鉴权&暴露公网会导致风险 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=14930)给我们反馈。
