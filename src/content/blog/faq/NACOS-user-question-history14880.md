---
id: "question-history-14880"
title: "nacos2开启了加密功能，ConfigService configService = NacosFact nacos-opensource"
date: "2024-06-02"
category: "expertConsultation"
description: "在Nacos 2.x中，如果你已经开启了配置加密功能，并且需要通过`NacosFactory.createConfigService(Properties properties)`的方式来创建`ConfigService`实例，你需要确保传递给`Properties`对象的用户名和密码已经是加密后的"
---

## 用户问题 ： 
 nacos2开启了加密功能，ConfigService configService = NacosFactory.createConfigService(properties)中的properties要如何设置用户名和密码 nacos-opensource 

---------------
## 专家官方解答 ：

在Nacos 2.x中，如果你已经开启了配置加密功能，并且需要通过`NacosFactory.createConfigService(Properties properties)`的方式来创建`ConfigService`实例，你需要确保传递给`Properties`对象的用户名和密码已经是加密后的形式。根据提供的知识内容，这里主要涉及的是Nacos客户端链接Nacos服务端的用户密码处理方式，社区并未直接提供一个统一的加密插件来处理这部分的加密，因为客户端通常由用户自行控制如何读取和处理配置信息。

### 分析问题原因
1. **客户端安全需求**：虽然Nacos服务端可以处理存储在配置中心的敏感信息加密，但客户端连接服务端时使用的凭证（用户名和密码）的安全性也需要保障。
2. **Nacos客户端行为**：Nacos客户端并不会直接处理配置文件中的加密逻辑，而是依赖用户应用在初始化客户端前完成敏感信息的解密或转换。

### 具体步骤
由于Nacos客户端不直接处理加密，你需要在你的应用程序中，即在调用`NacosFactory.createConfigService(Properties properties)`之前，手动处理用户名和密码的加密逻辑。以下是基于提供的知识内容，可以采取的步骤：

1. **加密用户名和密码**：假设你决定使用BCrypt（社区推荐用于用户密码加密的方法之一）加密客户端连接Nacos服务端的密码。你需要在你的应用程序代码中，使用类似`PasswordEncoderUtil`工具（或任何支持BCrypt的库）对密码进行加密。

    ```java
    // 引入BCrypt工具类或使用Nacos提供的PasswordEncoderUtil
    String encryptedPassword = PasswordEncoderUtil.encode("your_plain_password");
    ```

2. **构建Properties对象**：将加密后的密码设置到`Properties`对象中。

    ```java
    Properties properties = new Properties();
    properties.setProperty("serverAddr", "nacos_server_address");
    properties.setProperty("username", "your_username");
    properties.setProperty("password", encryptedPassword); // 使用加密后的密码
    // 其他必要属性设置...
    ```

3. **创建ConfigService实例**：使用加密后的凭据创建`ConfigService`实例。

    ```java
    ConfigService configService = NacosFactory.createConfigService(properties);
    ```

### 解释
- **为何需要提前加密**：Nacos服务端若未特别配置支持解密客户端密码（通常不这么做），则客户端需要将能够被服务端识别的加密密码直接传入。这样即使配置信息在网络中传输或存储时被截获，攻击者也无法直接从加密的密码中获取明文信息。
- **安全性注意事项**：虽然客户端侧加密增加了安全性，但务必确保加密算法的安全强度，且妥善管理加密密钥（如BCrypt实际上并不需要存储密钥，因为它基于salt进行加密，每个密码加密结果都是唯一的）。

请注意，这里的加密处理主要关注客户端到服务端的认证凭证安全，对于存储在Nacos配置中心的其他敏感数据，你应该利用Nacos提供的配置加密插件来进一步增强安全性。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：Nacos 配置加密 
 
 *专家经验：nacos用户密码设置 
 
 *[Authorization](https://nacos.io/docs/latest/guide/user/auth)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=14905)给我们反馈。
