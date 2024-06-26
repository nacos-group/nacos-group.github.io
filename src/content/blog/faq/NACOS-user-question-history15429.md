---
id: "question-history-15429"
title: "如何关闭nacos健康检查 nacos-opensource"
date: "2024-06-17"
category: "expertConsultation"
description: "要关闭Nacos的健康检查，首先需要确定您使用的具体组件。根据提供的信息，这里有两种场景：### 场景一：使用nacos-spring-boot-starter如果您正在使用`nacos-spring-boot-starter`，当前并不直接支持通过配置来关闭Nacos Config和Nacos D"
---

## 用户问题 ： 
 如何关闭nacos健康检查 nacos-opensource 

---------------
## 专家官方解答 ：

要关闭Nacos的健康检查，首先需要确定您使用的具体组件。根据提供的信息，这里有两种场景：

### 场景一：使用nacos-spring-boot-starter
如果您正在使用`nacos-spring-boot-starter`，当前并不直接支持通过配置来关闭Nacos Config和Nacos Discovery的健康检查功能。您可能需要继续关注[nacos-group/nacos-spring-boot-starter](https://github.com/nacos-group/nacos-spring-boot-project)项目未来的更新，以便了解何时会增加这项功能支持。

### 场景二：使用spring-cloud-alibaba相关组件
对于采用`spring-cloud-alibaba-nacos-discovery`或`spring-cloud-alibaba-nacos-config`的用户，可以通过Spring Boot Actuator的端点管理来关闭Nacos的健康检查。具体操作步骤如下：

1. **关闭Nacos Discovery健康检查**  
   在您的`application.properties`或`application.yml`文件中，添加如下配置：
   ```properties
   management.endpoint.nacos-discovery.enabled=false
   ```
   
2. **关闭Nacos Config健康检查**  
   同样，在配置文件中加入以下设置：
   ```properties
   management.endpoint.nacos-config.enabled=false
   ```

这两个配置项会分别禁用Nacos Discovery和Nacos Config的健康检查端点，从而在Actuator的健康检查报告中排除这些部分。

### 解释
通过修改`management.endpoint.*.enabled`属性为`false`，您可以有选择地禁用特定的健康检查端点。这样做可以让Actuator在进行系统健康状况评估时，不考虑被禁用的服务，这对于希望自定义健康检查逻辑或者避免某些服务状态影响整体健康判断的场景非常有用。

请根据您实际使用的依赖库选择对应的解决方案实施。如果您的情况不属于上述任一描述，或者有其他疑问，请提供更多详细信息，以便获得更准确的帮助。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：Nacos 麻烦咨询下 spring actuator 如何关闭 nacosconfig 的健康检查 ？ 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=15499)给我们反馈。
