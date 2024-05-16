---
id: "question-history-8187"
title: "如何在启动二进制版本的nacos时，设置日志级别为debug呢？ nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource 如何在启动二进制版本的nacos时，设置日志级别为debug呢？"
tags: ["启动","二进制版本","nacos","设置日志级别","debug"]
keywords: ["启动","二进制版本","nacos","设置日志级别","debug"]
---

## 用户问题 ： 
 如何在启动二进制版本的nacos时，设置日志级别为debug呢？ nacos-opensource 

---------------
## 专家官方解答 ：

如何在启动二进制版本的nacos时，设置日志级别为debug呢？

可以按照以下步骤来设置Nacos二进制版本的日志级别为debug：

**步骤一：通过接口动态修改日志级别**

1. 确定Nacos服务器的访问地址，记为`${nacos_host}`。
2. 使用curl命令调用Nacos提供的日志级别调整接口，指定日志名为`naming-event`（或需调整的其他日志名），并将日志级别设置为`DEBUG`：

   ```shell
   curl -X POST "${nacos_host}:8848/nacos/v1/ns/ops/log?logName=naming-event&logLevel=DEBUG"
   ```

   这样即可动态更改指定日志的级别，无需重启Nacos服务。

**步骤二：编辑配置文件更改日志级别**

1. 找到Nacos安装目录下的`conf`目录，定位到`nacos-logback.xml`文件。
2. 打开`nacos-logback.xml`，找到需要调整日志级别的logger节点（如`com.alibaba.nacos.client`、`com.alibaba.nacos.common.remote.client`等），将其`level`属性值修改为`DEBUG`。
3. 保存修改后的配置文件。
4. 重启Nacos服务以使新的日志级别生效。

**步骤三：针对Nacos客户端调整日志级别**

1. 如果需要修改的是Nacos客户端的日志级别，确保使用的是2.1.X或更高版本。
2. 在客户端启动参数中添加如下配置项：

   ```bash
   -Dcom.alibaba.nacos.config.log.level=DEBUG
   ```

   或者在客户端使用的日志框架配置文件（如logback.xml）中，为相关logger节点设置`level`属性为`DEBUG`，如：

   ```xml
   <logger name="com.alibaba.nacos.client" level="DEBUG" additivity="false">
       <appender-ref ref="${your log file ref}"/>
   </logger>

   <!-- 其他相关logger节点... -->
   ```

按照以上步骤，即可成功设置Nacos二进制版本的日志级别为debug。选择合适的方法（动态接口调整、编辑配置文件、客户端参数配置）进行操作，以满足不同的场景需求。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:如何在启动二进制版本的nacos时，设置日志级别为debug呢？ 
 
 *专家经验:Nacos升级的具体步骤 
 
 *专家经验:nacos哪个版本最常用 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11509)给我们反馈。
