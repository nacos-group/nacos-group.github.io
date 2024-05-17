---
id: "question-history-11858"
title: "nacos服务端动态修改日志级别 nacos-opensource"
date: "2024-04-25"
category: expertConsultation
description: "nacos-opensource nacos服务端动态修改日志级别"
tags: ["服务端","动态","修改","日志级别"]
keywords: ["服务端","动态","修改","日志级别"]
---

## 用户问题 ： 
 nacos服务端动态修改日志级别 
 nacos-opensource 

---------------
## 专家官方解答 ：

可以动态修改Nacos服务端的日志级别。以下是具体步骤：

1. **通过接口动态调整**：
   使用curl命令向Nacos Server发送请求，指定目标日志名及其要调整到的日志级别。示例命令如下：

   ```shell
   curl -X POST 'http://${nacos_host}:8848/nacos/v1/ns/ops/log?logName=<目标日志名>&logLevel=<目标日志级别>'
   ```

   其中：
   - `${nacos_host}`：替换为实际的Nacos Server主机地址。
   - `<目标日志名>`：要调整的日志组件名称，如`naming-event`。
   - `<目标日志级别>`：期望的日志级别，如`DEBUG`、`INFO`、`WARN`、`ERROR`等。

2. **直接编辑配置文件**：
   如果希望对所有日志或特定日志进行全面且持久的调整，可以编辑`${nacos.home}/conf/`目录下的`nacos-logback.xml`文件。找到对应的日志器配置（logger），修改其`level`属性为所需的日志级别。完成编辑后，需要重启Nacos Server以使更改生效。

综上所述，通过以上两种方式之一，即可动态地或永久性地修改Nacos服务端的日志级别。第一种方法适用于临时调试或快速调整单个日志组件级别，无需重启服务；第二种方法则适用于对日志系统进行全面配置或需要持久保存日志级别的场景，但需要重启Nacos服务以应用新的配置。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:如何在启动二进制版本的nacos时，设置日志级别为debug呢？ 
 
 *[# 日志](https://github/tree/master/docs/zh-cn/golang/logging.md)
 
 *专家经验:如何获取Nacos-Client的日志？ 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11859)给我们反馈。
