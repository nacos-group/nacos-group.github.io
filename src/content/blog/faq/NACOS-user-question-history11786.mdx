---
id: "question-history-11786"
title: "使用nacos 作为spring cloud 的注册中心、配置中心搭建的具体方法 nacos-opensource"
date: "2024-04-24"
category: expertConsultation
description: "nacos-opensource 使用nacos 作为spring cloud 的注册中心、配置中心搭建的具体方法"
tags: ["spring cloud","注册中心","配置中心","搭建","具体方法"]
keywords: ["spring cloud","注册中心","配置中心","搭建","具体方法"]
---

## 用户问题 ： 
 使用nacos 作为spring cloud 的注册中心、配置中心搭建的具体方法
 nacos-opensource 

---------------
## 专家官方解答 ：

使用Nacos作为Spring Cloud的注册中心和配置中心，可以简化分布式环境下的服务管理和配置管理。以下为具体的搭建步骤：

**一、搭建Nacos Server**

1. **下载Nacos**: 访问[Nacos官方下载页面](https://nacos.io/zh-cn/docs/quick-start.html)或[mvnrepository.com](https://mvnrepository.com/artifact/com.alibaba.cloud/spring-cloud-starter-alibaba-nacos-discovery)获取最新稳定版本的Nacos服务器包。

2. **启动Nacos Server**: 解压下载的Nacos包，进入解压后的目录，运行`startup.sh`（Linux/Mac）或`startup.cmd`（Windows）脚本启动Nacos Server。默认情况下，Nacos将监听8848端口提供服务。

**二、配置Spring Cloud应用**

**作为配置中心**

1. **添加依赖**：在Spring Cloud项目的pom.xml文件中引入`spring-cloud-starter-alibaba-nacos-config`依赖：

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
    <version>{{{latest_version}}}</version> <!-- 替换为实际使用的版本号 -->
</dependency>
```

2. **配置Nacos连接信息**：在application.properties或application.yml文件中添加Nacos配置中心的相关配置：

```properties
spring.cloud.nacos.config.server-addr=localhost:8848
```

3. **启用Nacos配置**：在Spring Boot主类上添加`@EnableNacosConfig`注解以启用Nacos配置支持。

4. **使用配置**：在需要使用配置的类或方法中，通过`@Value`注解注入Nacos配置。例如：

```java
@RestController
public class DemoController {

    @Value("${app.message}")
    private String message;

    @GetMapping("/message")
    public String getMessage() {
        return message;
    }
}
```

**作为注册中心**

1. **添加依赖**：在Spring Cloud项目的pom.xml文件中引入`spring-cloud-starter-alibaba-nacos-discovery`依赖：

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    <version>{{{latest_version}}}</version> <!-- 替换为实际使用的版本号 -->
</dependency>
```

2. **配置Nacos连接信息**：在application.properties或application.yml文件中添加Nacos注册中心的相关配置：

```properties
spring.cloud.nacos.discovery.server-addr=localhost:8848
```

3. **启用Nacos服务注册**：在Spring Boot主类上添加`@EnableDiscoveryClient`注解以启用Nacos服务注册与发现功能。

完成以上步骤后，重启Spring Cloud应用，它将自动向Nacos注册并获取配置信息。后续可通过Nacos控制台进行服务管理与配置管理。

**三、验证**

1. **配置中心验证**：在Nacos控制台创建或修改相应Data ID的配置，观察Spring Cloud应用是否能实时获取并应用新的配置。

2. **注册中心验证**：在Nacos控制台的服务列表中查看是否有Spring Cloud应用成功注册，以及其元信息是否正确。

通过上述步骤，您已成功将Nacos作为Spring Cloud的注册中心和配置中心进行搭建和使用。


<font color="#949494">---------------</font> 


## 参考链接 ：

*[Nacos 融合 Spring Cloud，成为注册配置中心](https://nacos.io/docs/latest/ecology/use-nacos-with-spring-cloud)
 
 *[Nacos 融合 Spring，成为注册配置中心](https://nacos.io/docs/latest/ecology/use-nacos-with-spring)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11790)给我们反馈。
