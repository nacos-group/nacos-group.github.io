---
id: "question-history-8187"
title: "如何在启动二进制版本的nacos时，设置日志级别为debug呢？ nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "在启动二进制版本的Nacos时，若要设置日志级别为debug，您可以按照以下步骤操作：1. **动态修改日志级别**（无需重启Nacos服务器）:   - 使用curl命令通过Nacos提供的接口来调整特定日志模块的级别。例如，要将naming-event日志级别设置为DEBUG，执行以下命令：  "
tags: ["日志级别","debug"]
keywords: ["日志级别","debug"]
---

在启动二进制版本的Nacos时，若要设置日志级别为debug，您可以按照以下步骤操作：

1. **动态修改日志级别**（无需重启Nacos服务器）:
   - 使用curl命令通过Nacos提供的接口来调整特定日志模块的级别。例如，要将naming-event日志级别设置为DEBUG，执行以下命令：
     ```shell
     curl -X POST '${nacos_host}:8848/nacos/v1/ns/ops/log?logName=naming-event&logLevel=DEBUG'
     ```
     其中`${nacos_host}`应替换为您的Nacos服务器地址，`logName`为日志模块名称，如需调整其他模块，请替换相应的名称，`logLevel`则替换为您希望设置的日志级别。

2. **修改配置文件**（需要重启Nacos服务器）:
   - 如果您希望持久化更改或调整所有日志的级别，可以编辑`${nacos.home}/conf/nacos-logback.xml`文件。直接在XML中找到并修改相关`<logger>`标签的`level`属性为`DEBUG`。例如：
     ```xml
     <logger name="com.alibaba.nacos" level="DEBUG"/>
     ```
     这会将com.alibaba.nacos包下所有类的日志级别设为DEBUG。修改后，需要重启Nacos服务器使更改生效。

综上所述，您可以根据实际需求选择动态修改或通过配置文件的方式来设置Nacos的启动日志级别为DEBUG。需要注意的是，动态修改适用于快速调试，而修改配置文件则更适合长期设定。请确保在操作前备份相关配置以防不测。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13547)给我们反馈。
