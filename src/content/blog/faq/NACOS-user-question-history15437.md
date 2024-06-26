---
id: "question-history-15437"
title: "nacos登录密码忘记了如何修改，nacos是2.2.0版本的 nacos-opensource"
date: "2024-06-17"
category: "expertConsultation"
description: "根据您的问题，您使用的是Nacos 2.2.0版本并且忘记了登录密码。根据我了解的知识中的信息，我们可以按照以下步骤来解决这个问题：### 分析问题原因Nacos默认提供了一个管理员账户，用户名和密码均为`nacos`。如果您忘记了自定义的密码或者初始化时未更改默认密码，您需要通过官方提供的方法来重"
---

## 用户问题 ： 
 nacos登录密码忘记了如何修改，nacos是2.2.0版本的 nacos-opensource 

---------------
## 专家官方解答 ：

根据您的问题，您使用的是Nacos 2.2.0版本并且忘记了登录密码。根据我了解的知识中的信息，我们可以按照以下步骤来解决这个问题：

### 分析问题原因
Nacos默认提供了一个管理员账户，用户名和密码均为`nacos`。如果您忘记了自定义的密码或者初始化时未更改默认密码，您需要通过官方提供的方法来重置密码。

### 修改密码的步骤

#### 方法一：通过控制台（需要有其他管理员账号）

1. 如果您还有其他具有管理员权限的账号，可以登录Nacos控制台。
2. 进入`权限控制` -> `用户管理`。
3. 选择需要修改密码的用户，点击修改密码进行操作。

#### 方法二：使用运维API（需要知道其他管理员账号的凭据）

1. 确保您有管理员权限的凭据（如另一个管理员账号的用户名和密码）。
2. 执行以下命令来修改密码（以修改用户名为`forgotten_password_user`的用户为例）：
   ```shell
   curl -X PUT 'http://nacos_server_ip:nacos_server_port/nacos/v1/auth/users?username=forgotten_password_user&newPassword=new_password'
   ```
   - 替换`nacos_server_ip`和`nacos_server_port`为您Nacos服务器的实际IP地址和端口号。
   - 将`forgotten_password_user`替换为您忘记密码的用户名。
   - 将`new_password`替换为您想要设置的新密码。

#### 方法三：直接在数据库中修改（仅限外置数据库）

1. **注意**：此方法仅适用于使用MySQL等外置数据库的场景，内置Derby数据库不适用。
2. 使用数据库管理工具连接到Nacos配置的数据库。
3. 执行SQL更新密码，记得先使用`PasswordEncoderUtil`工具或相应语言的BCrypt库对新密码进行加密：
   ```sql
   UPDATE users SET password='加密后的新密码' WHERE username='forgotten_password_user';
   ```
   - 将`加密后的新密码`替换为使用BCrypt加密过的新密码。
   - 将`forgotten_password_user`替换为您忘记密码的用户名。

### 解释说明
- 如果您没有其他管理员账号的访问权限，直接通过数据库修改密码是最直接的方法，但前提是您使用的是外置数据库。
- 使用任何API或数据库操作前，请确保您具备相应的权限，并且了解这些操作的影响，尤其是在生产环境中。
- BCrypt加密是为了增强密码的安全性，确保在存储和传输过程中密码不易被破解。

综上所述，您可以根据实际情况选择最合适的方式来重置Nacos的登录密码。如果遇到任何具体操作上的困难，再次确认操作步骤或查阅Nacos官方文档可能会提供进一步的帮助。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：nacos用户密码设置 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=15507)给我们反馈。
