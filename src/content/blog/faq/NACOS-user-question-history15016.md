---
id: "question-history-15016"
title: "为什么开启鉴权以后登录提示用户名密码错误 nacos-opensource"
date: "2024-06-05"
category: "expertConsultation"
description: "根据您提供的信息，当Nacos开启鉴权之后登录提示用户名密码错误，这可能是由以下几个原因导致的：1. **密码未正确加密**：Nacos存储的用户密码是经过BCrypt加密的。如果您直接在数据库中修改了密码而没有进行加密，或者通过API设置密码时未提供加密后的密码，系统将无法识别并验证您的密码，从而"
---

## 用户问题 ： 
 为什么开启鉴权以后登录提示用户名密码错误 nacos-opensource 

---------------
## 专家官方解答 ：

根据您提供的信息，当Nacos开启鉴权之后登录提示用户名密码错误，这可能是由以下几个原因导致的：

1. **密码未正确加密**：Nacos存储的用户密码是经过BCrypt加密的。如果您直接在数据库中修改了密码而没有进行加密，或者通过API设置密码时未提供加密后的密码，系统将无法识别并验证您的密码，从而导致登录失败。

2. **用户名输入错误**：确保您输入的用户名准确无误，包括大小写。Nacos对用户名区分大小写。

3. **权限问题**：如果尝试通过API修改密码或添加用户，在鉴权开启后，这些操作需要管理员权限。请确认执行这些操作的账户具有相应的权限。

4. **BCrypt加密不一致**：即使使用了正确的加密方法，由于BCrypt加密会生成随机盐值，每次加密同一个明文密码得到的密文可能会不同。因此，直接复制粘贴之前加密过的密码到数据库或API请求中可能不会生效，需要每次都使用加密工具或`PasswordEncoderUtil`重新生成加密密码。

### 解决步骤

#### 确认密码加密

- 使用Nacos提供的`PasswordEncoderUtil`工具来正确加密您的新密码。具体操作如下：
  1. 复制并运行以下Java代码段：
     ```java
     public class Temp {
         public static void main(String[] args) {
             System.out.println(new com.alibaba.nacos.common.utils.security.BCryptPasswordEncoder().encode("your_desired_password"));
         }
     }
     ```
  2. 将`your_desired_password`替换为您想要设置的密码，执行该程序，获取加密后的密码。
  
- 如果您不熟悉Java环境，也可以查找对应语言的BCrypt库进行密码加密。

#### 更新密码

- **通过控制台**：登录Nacos控制台，导航至`权限控制` -> `用户管理`，选择相应用户进行密码修改。
  
- **通过API**：使用管理员权限，执行如下CURL命令更新密码（确保`new_password`是经过BCrypt加密的）：
  ```shell
  curl -X PUT 'http://${nacos_host}:${nacos_port}/nacos/v1/auth/users?username=${your_username}&newPassword=${new_password}'
  ```

#### 检查用户名和权限

- 确保使用正确的用户名登录，并检查执行修改或添加用户操作的账户是否具备管理员权限。

#### 数据库直接操作注意事项

- 对于外置数据库，如需直接在数据库层面操作，请确保密码已加密且操作账户拥有相应权限。对于内置Derby数据库，请避免直接修改，以免造成数据不一致问题。

综上所述，解决登录提示用户名密码错误的问题关键在于确保密码正确加密、用户名准确无误，以及操作时拥有必要的权限。按照上述步骤进行操作，应该能解决您的问题。如果问题依旧存在，可能需要进一步检查Nacos的日志文件，以获取更详细的错误信息。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：nacos用户密码设置 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=15069)给我们反馈。
