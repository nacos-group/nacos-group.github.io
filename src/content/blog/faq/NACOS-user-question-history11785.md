---
id: "question-history-11785"
title: "SpringCloud 使用 Nacos 作为注册中心、配置中心搭建 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "要使用Nacos作为Spring Cloud应用的注册中心和配置中心进行搭建，您可以遵循以下步骤：### 1. 环境准备- **确保Nacos Server已启动**：首先，您需要下载并启动Nacos Server。根据[Nacos快速入门](../quickstart/quick-start.md"
tags: ["SpringCloud","Nacos","注册中心","配置中心","搭建"]
keywords: ["SpringCloud","Nacos","注册中心","配置中心","搭建"]
---

要使用Nacos作为Spring Cloud应用的注册中心和配置中心进行搭建，您可以遵循以下步骤：

### 1. 环境准备
- **确保Nacos Server已启动**：首先，您需要下载并启动Nacos Server。根据[Nacos快速入门](../quickstart/quick-start.md)操作指南完成此步骤。

### 2. 添加依赖
- 对于Spring Cloud应用，添加`spring-cloud-starter-alibaba-nacos-discovery`和`spring-cloud-starter-alibaba-nacos-config`依赖到您的项目中。这些依赖允许您的应用与Nacos服务发现和配置管理服务集成。最新的依赖版本可以在[mvnrepository.com](https://mvnrepository.com/)上查找，例如搜索`spring-cloud-starter-alibaba-nacos-discovery`。

### 3. 配置文件
- 在您的Spring Cloud应用的配置文件（如`application.properties`或`bootstrap.properties`）中，添加Nacos服务器地址和其他必要配置：
  ```properties
  spring.cloud.nacos.config.server-addr=127.0.0.1:8848
  spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
  ```
  这里指定了Nacos Server的地址，确保它与您实际运行的Nacos Server地址匹配。

### 4. 启用服务发现
- 在您的Spring Boot主类或配置类上使用`@EnableDiscoveryClient`注解，启用服务发现功能：
  ```java
  @SpringBootApplication
  @EnableDiscoveryClient
  public class Application {
      public static void main(String[] args) {
          SpringApplication.run(Application.class, args);
      }
  }
  ```

### 5. 配置管理
- 您可以通过在Nacos控制台上创建配置文件（指定`dataId`和`group`），然后在应用中使用`@Value`或`@ConfigurationProperties`注解来注入配置值。也可以通过`@NacosPropertySource`来动态加载配置源。

### 6. 注册服务
- 无需额外编码，当您的应用启动时，由于添加了`spring-cloud-starter-alibaba-nacos-discovery`依赖并配置了`server-addr`，应用会自动向Nacos注册服务。

### 7. 验证
- **验证服务注册**：通过Nacos控制台检查您的服务是否成功注册。
- **验证配置中心**：修改Nacos控制台上的配置并观察应用是否能自动获取新的配置值。

### 参考资料
- [Nacos Config](https://github.com/spring-cloud-incubator/spring-cloud-alibaba/wiki/Nacos-config)
- [Nacos Discovery](https://github.com/spring-cloud-incubator/spring-cloud-alibaba/wiki/Nacos-discovery)

按照上述步骤操作后，您的Spring Cloud应用即可利用Nacos作为注册中心和服务配置中心，实现服务的自动发现与配置的动态管理。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13796)给我们反馈。
