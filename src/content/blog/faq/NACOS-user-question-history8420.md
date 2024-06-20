---
id: "question-history-8420"
title: "请问一下1.2.0如何修改默认密码 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "在Nacos 1.2.0中修改默认密码的步骤如下：1. **初始化前修改**：   如果你的Nacos集群尚未初始化，可以在初始化之前修改默认的用户名和密码。你需要编辑`$nacos.home/conf/`目录下的`mysql-schema.sql`或`derby-schema.sql`（取决于你使"
tags: ["1.2.0","修改","默认密码"]
keywords: ["1.2.0","修改","默认密码"]
---

## 用户问题 ： 
 请问一下1.2.0如何修改默认密码 nacos-opensource 

---------------
## 专家官方解答 ：

在Nacos 1.2.0中修改默认密码的步骤如下：

1. **初始化前修改**：
   如果你的Nacos集群尚未初始化，可以在初始化之前修改默认的用户名和密码。你需要编辑`${nacos.home}/conf/`目录下的`mysql-schema.sql`或`derby-schema.sql`（取决于你使用的数据库类型），找到关于`users`表的插入语句，将默认密码`nacos`替换为你希望设置的新密码。注意，新密码需要经过BCrypt加密。你可以使用Nacos提供的`PasswordEncoderUtil`工具类进行加密，具体操作是在Java环境中运行以下代码，并将`nacos`替换为你想要设定的密码，之后获取输出的加密密码：

   ```java
   public class PasswordEncoderUtil {
       public static void main(String[] args) {
           System.out.println(new BCryptPasswordEncoder().encode("你想要设定的密码"));
       }
   }
   ```

2. **初始化后修改**：
   一旦Nacos集群已经初始化，用户名`nacos`将不能被修改，但你可以通过控制台或API来修改密码。以下是通过控制台修改密码的步骤：

   - 登录Nacos控制台。
   - 导航至`权限控制` -> `用户管理`。
   - 选择默认用户`nacos`，点击修改密码，按照提示操作即可。

   或者，使用运维API来修改密码，确保你有管理员权限，并且Nacos的鉴权功能已开启：

   ```shell
   curl -X PUT 'http://${nacos_host}:${nacos_port}/nacos/v1/auth/users?username=nacos&newPassword=${new_password}'
   ```

   其中，`${new_password}`应替换为BCrypt加密后的新密码。

请注意，直接在数据库中修改密码仅适用于外置数据库（如MySQL），并且需要确保密码经过正确的加密处理。对于内置Derby数据库，不推荐直接修改，以避免数据一致性问题。

参考链接：
- Nacos密码加密工具使用：[Nacos官方文档](https://nacos.io/docs/zh-cn/2.0.3/api.html#%E5%AF%86%E7%A0%81%E5%8A%A0%E5%AF%86%E5%B7%A5%E5%85%B7)
- Nacos权限控制与用户管理API：[Nacos API文档](https://nacos.io/zh-cn/docs/open-api.html)

以上步骤可以帮助你在Nacos 1.2.0中完成修改默认密码的操作。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：nacos用户密码设置 
 
 *专家经验：Nacos 配置加密 
 
 *专家经验：/nacos/v1/core/cluster/nodes 这个访问权限如何关闭？ 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13642)给我们反馈。
