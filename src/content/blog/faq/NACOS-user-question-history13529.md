---
id: "question-history-13529"
title: "nacos_config 中users 表中 username：nacos password的加密方式是什么 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "在Nacos的`users`表中，username为`nacos`的password加密方式是使用BCrypt算法进行加密的。Nacos采用这种加密方式来确保密码的安全性。如果您需要修改或设置密码，应该先使用BCrypt算法对新密码进行加密，然后再进行相应的更新操作。如果您想要获取BCrypt加密的"
tags: ["nacos_config","users","表","username","nacos","password","加密方式"]
keywords: ["nacos_config","users","表","username","nacos","password","加密方式"]
---

在Nacos的`users`表中，username为`nacos`的password加密方式是使用BCrypt算法进行加密的。Nacos采用这种加密方式来确保密码的安全性。如果您需要修改或设置密码，应该先使用BCrypt算法对新密码进行加密，然后再进行相应的更新操作。

如果您想要获取BCrypt加密的密码，可以使用Nacos提供的`PasswordEncoderUtil`工具类，具体做法是在Java环境中运行以下代码片段：
```java
public class PasswordEncoderUtil {
    public static void main(String[] args) {
        System.out.println(new BCryptPasswordEncoder().encode("您想要设置的密码"));
    }
}
```
运行这段代码，它会输出加密后的密码字符串，您可以将这个字符串用于更新数据库或者通过API设置新密码。

需要注意的是，每次加密生成的密码可能会因盐值的不同而有所差异，这是BCrypt加密机制为了增强安全性而设计的特性，因此不必担心每次生成的密文不一致。此外，直接在内置数据库（如Derby）中修改密码是不被推荐的，尤其是在集群环境下，因为这可能导致数据不一致。对于外置数据库如MySQL，修改时也务必确保使用了加密后的密码。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13915)给我们反馈。
