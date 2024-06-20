---
id: "question-history-11033"
title: "Nacos 麻烦咨询下  spring actuator 如何关闭 nacosconfig 的健康检查 ？ nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "要关闭Nacos Config在Spring Actuator中的健康检查，您可以按照以下步骤操作：1. **确认依赖版本**：首先确认您使用的是否为`spring-cloud-alibaba-nacos-config`或相关版本，因为早期的`nacos-spring-boot-starter`不支"
tags: ["spring actuator","关闭","nacosconfig","健康检查"]
keywords: ["spring actuator","关闭","nacosconfig","健康检查"]
---

## 用户问题 ： 
 Nacos 麻烦咨询下  spring actuator 如何关闭 nacosconfig 的健康检查 ？ nacos-opensource 

---------------
## 专家官方解答 ：

要关闭Nacos Config在Spring Actuator中的健康检查，您可以按照以下步骤操作：

1. **确认依赖版本**：首先确认您使用的是否为`spring-cloud-alibaba-nacos-config`或相关版本，因为早期的`nacos-spring-boot-starter`不支持直接关闭健康检查。

2. **应用配置调整**：在您的Spring Boot应用的`application.yml`或`application.properties`文件中，添加以下配置项来关闭Nacos Config的健康检查端点：
   ```yaml
   # application.yml 示例
   management:
     endpoint:
       nacos-config:
         enabled: false
   ```
   或者
   ```properties
   # application.properties 示例
   management.endpoint.nacos-config.enabled=false
   ```

3. **重启应用**：完成配置后，需要重启您的Spring Boot应用以使更改生效。

通过上述步骤，Nacos Config的健康检查将不再由Spring Actuator暴露。如果您发现这些配置不生效或者有其他特殊情况，请检查是否正确配置了依赖版本，并确保没有其他配置覆盖了上述设置。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：Nacos 麻烦咨询下 spring actuator 如何关闭 nacosconfig 的健康检查 ？ 
 
 *专家经验：怎么能让nacos 的actuator 查不到任何信息呢 
 
 *[Java SDK](https://nacos.io/docs/latest/guide/user/sdk)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13722)给我们反馈。
