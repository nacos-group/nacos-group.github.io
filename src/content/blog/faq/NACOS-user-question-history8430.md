---
id: "question-history-8430"
title: "请问nacos支持IPV6 都要做什么配置？谢谢 nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource 请问nacos支持IPV6 都要做什么配置？谢谢"
tags: ["IPV6","配置"]
keywords: ["IPV6","配置"]
---

## 用户问题 ： 
 请问nacos支持IPV6 都要做什么配置？谢谢 nacos-opensource 

---------------
## 专家官方解答 ：

Nacos支持IPv6配置主要涉及两方面：Nacos Server端配置和Nacos Client端配置。以下是具体步骤：

**1. Nacos Server端配置**

对于Nacos Server端，自2.1版本后，它能够自动识别IPv4或IPv6环境，无需额外配置。但在特定情况下，可能需要手动干预：

- **自动识别配置**：如果您使用的是Nacos 2.1或更高版本，且希望让Nacos Server自动适应IPv6环境，无需进行任何特殊配置。

- **强制使用IPv6配置**（可选）：在双栈环境中，若需强制Nacos Server使用IPv6地址，您可以在Nacos的配置文件（如`application.properties`）中设置以下属性之一：

  ```properties
  nacos.server.ip=ipv6-only-address
  # 或
  nacos.inetutils.ip-address=ipv6-only-address
  ```

  将`ipv6-only-address`替换为您的服务器实际IPv6地址。

- **`cluster.conf`配置**（集群部署时）：如果Nacos以集群模式部署，确保`cluster.conf`文件中列出的各个节点地址均为IPv6格式。

**2. Nacos Client端配置**

Nacos Client全版本均支持配置IPv6地址。在创建客户端时，直接设置服务地址为IPv6地址即可：

```java
Properties properties = new Properties();
properties.setProperty("serverAddr", "ipv6:8848"); // 使用IPv6地址和端口
NamingFactory.createNamingService(properties);
// 或
ConfigFactory.createConfigService(properties);
```

确保将`ipv6:8848`替换为实际的Nacos Server IPv6地址和端口（默认为8848）。

**注意事项**：

- 如果在配置过程中遇到`java.net.MalformedURLException`异常，请根据异常信息检查是否误输入了端口或遗漏了端口。确保服务地址格式正确（例如：`[ipv6-address]:[port]`）。

按照以上步骤完成Nacos Server端和Client端的IPv6配置后，Nacos即可在IPv6环境下正常运行，提供服务发现与注册功能。

综上所述，Nacos支持IPv6主要涉及Nacos Server端自动识别或手动配置以适应IPv6环境，以及在Nacos Client端指定IPv6服务地址。根据实际需求和所使用的Nacos版本，按上述步骤进行相应配置即可。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:Nacos是否支持IPV6 
 
 *专家经验:Nacos和Eureka的区别是什么？ 
 
 *专家经验:为什么Nacos不使用ORM框架访问数据库 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11614)给我们反馈。
