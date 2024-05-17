---
id: "question-history-12456"
title: "nacos日志打开debug nacos-opensource"
date: "2024-04-28"
category: expertConsultation
description: "nacos-opensource nacos日志打开debug"
tags: ["日志","debug"]
keywords: ["日志","debug"]
---

## 用户问题 ： 
 nacos日志打开debug
 nacos-opensource 

---------------
## 专家官方解答 ：

为了打开Nacos的日志debug模式，您可以按照以下步骤操作：

1. **动态修改Nacos Server日志级别**（针对Nacos服务端）:
   - 使用curl命令通过Nacos提供的接口来修改特定日志模块的日志级别为DEBUG：
     ```shell
     curl -X POST 'http://${nacos_host}:8848/nacos/v1/ns/ops/log?logName=naming-event&logLevel=DEBUG'
     ```
     这里`logName`可以替换为您希望调试的日志模块名称，例如`naming-server`等；`nacos_host`是Nacos服务器的地址。

2. **修改Nacos配置文件**（针对Nacos服务端和客户端配置文件调整）:
   - 对于Nacos Server，直接编辑`${nacos.home}/conf/nacos-logback.xml`文件，找到相应日志模块的配置，将日志级别改为`DEBUG`后重启Nacos服务。
   - 对于Nacos Client，如果您使用的是2.1.X及以上版本，可以通过设置系统属性`com.alibaba.nacos.config.log.level=DEBUG`来调整日志级别。对于老版本或需要更细致控制，需在应用的日志配置文件（如logback.xml）中，针对Nacos相关的logger设置日志级别为DEBUG，如上文示例所示。

3. **验证日志输出**:
   - 在完成上述设置后，重新触发相关操作以产生日志，然后检查Nacos的日志输出位置（如服务端的日志默认路径或根据配置文件设定的位置），确认日志级别是否已成功调整为DEBUG。

请注意，这些操作主要涉及Nacos服务端与客户端日志级别的调整，确保根据您的具体需求选择合适的方法进行配置。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:如何在启动二进制版本的nacos时，设置日志级别为debug呢？ 
 
 *专家经验:如何获取Nacos-Client的日志？ 
 
 *专家经验:Nacos raft日志太大怎么清理 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=12461)给我们反馈。
