---
id: "question-history-11028"
title: "Nacos linux部署nacos可以配置access.log的保留时间吗 nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource Nacos linux部署nacos可以配置access.log的保留时间吗"
tags: ["linux","部署","access.log","保留时间"]
keywords: ["linux","部署","access.log","保留时间"]
---

## 用户问题 ： 
 Nacos linux部署nacos可以配置access.log的保留时间吗 nacos-opensource 

---------------
## 专家官方解答 ：

可以

在Nacos Linux部署环境中，您可以配置access.log的保留时间。由于Nacos使用的是Tomcat作为其内嵌服务器，其access.log遵循Spring Boot Tomcat Embedded的access log配置规则。因此，您可以通过调整相应的配置来设置access.log按天保留，具体步骤如下：

1. **编辑Nacos配置文件**：
   - 在Nacos的Linux部署环境中找到Nacos的配置文件（通常为`application.properties`或`application.yml`）。如果您使用的是自定义配置文件，请确保在启动Nacos时通过`-c`参数指定该文件路径。

2. **添加或修改相关配置项**：
   - 在配置文件中添加或更新以下属性，以设定access.log的保留时间和日志格式：
     ```properties
     server.tomcat.accesslog.enabled=true
     server.tomcat.accesslog.maxDays=15
     server.tomcat.accesslog.pattern=%{yyyyMMddHHmmssSSS}t|%a|%h|%H|%r|%{Referer}i|%s|%b|%D|%s
     ```
     这里：

     - `server.tomcat.accesslog.enabled=true`：启用access.log记录。
     - `server.tomcat.accesslog.maxDays=15`：设置access.log保留天数为15天。您可以根据实际需求调整这个数值。
     - `server.tomcat.accesslog.pattern`：定义access.log的日志格式。此处提供的示例格式包含了日期、客户端IP、请求方法、状态码等信息。您可以根据需要修改或保持此默认格式。

3. **重启Nacos服务**：
   - 应用上述配置更改后，需要重启Nacos服务以使新的access.log保留策略生效。您可以使用Nacos提供的启动脚本或系统服务管理命令（如`systemctl restart nacos`）进行重启。

完成以上步骤后，Nacos将按照您设定的规则保留access.log文件，超过指定天数的旧日志将会被自动清理。这样有助于您管理磁盘空间，同时保留足够时间范围内的访问日志以供分析和审计。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:Nacos 配置access.log的保留时间 
 
 *专家经验:Nacos部署开放端口，集群部署开通端口 
 
 *专家经验:Nacos nacos 2.3.0全新安装也需要关闭双写吗？ 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11680)给我们反馈。
