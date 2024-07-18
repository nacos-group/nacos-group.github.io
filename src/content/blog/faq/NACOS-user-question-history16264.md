---
id: "question-history-16264"
title: "日志保留天数"
date: "2024-07-18"
category: "expertConsultation"
description: "关于Nacos日志的保留天数，这实际上涉及到两种不同类型的日志：1. **访问日志(access.log)**：根据Nacos配置接入Spring Boot嵌入式Tomcat的设定，你可以通过调整配置来指定access.log的保留天数。具体做法是，在你的Nacos配置文件中加入以下内容：   ``"
---

## 用户问题 ： 
 日志保留天数  

---------------
## 专家官方解答 ：

关于Nacos日志的保留天数，这实际上涉及到两种不同类型的日志：

1. **访问日志(access.log)**：根据Nacos配置接入Spring Boot嵌入式Tomcat的设定，你可以通过调整配置来指定access.log的保留天数。具体做法是，在你的Nacos配置文件中加入以下内容：
   ```properties
   server.tomcat.accesslog.enabled=true
   server.tomcat.accesslog.maxDays=15
   ```
   这里`maxDays`参数设定了日志文件的最大保留天数为15天。你可以根据需要调整这个数值。[[参考链接](https://tomcat.apache.org/tomcat-9.0-doc/config/valve.html#Access_Logging)]

2. **配置变更历史日志(his_config_info表)**：当Nacos使用MySQL作为后端数据库存储配置信息时，配置的每一次变更都会被记录在他的`his_config_info`表中。默认情况下，Nacos会清理30天前的变更历史记录。要修改这个保留周期，你可以通过调整`nacos.config.retention.days`参数来实现。例如，若想将保留周期改为60天，可以在配置文件中添加：
   ```properties
   nacos.config.retention.days=60
   ```
   注意，如果配置变更非常频繁，或者需要长期保留这些历史记录，除了调整保留天数外，还应考虑增加数据库的存储能力和定期备份策略。[[相关说明](#)]

综上所述，Nacos的访问日志和配置变更历史日志的保留天数都可以通过配置进行调整，以满足不同的运维需求。如果你有特定的日志类型或者遇到了不同的情况，请提供更多信息以便给出更准确的建议。


<font color="#949494">---------------</font> 


## 参考链接 ：

* 专家经验：Nacos 配置access.log的保留时间 
 
 * 专家经验：请问nacos使用mysql作为后端数据库，记录会保留多久呢？ 
 
 * 专家经验：Nacos raft日志太大怎么清理 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=16277)给我们反馈。
