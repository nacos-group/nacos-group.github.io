---
id: "question-history-11787"
title: "使用nacos 作为微服务spring cloud的注册中心、配置中心搭建的具体方法 nacos-opensource"
date: "2024-04-24"
category: expertConsultation
description: "nacos-opensource 使用nacos 作为微服务spring cloud的注册中心、配置中心搭建的具体方法"
tags: ["微服务","spring cloud","注册中心","配置中心","搭建","具体方法"]
keywords: ["微服务","spring cloud","注册中心","配置中心","搭建","具体方法"]
---

## 用户问题 ： 
 使用nacos 作为微服务spring cloud的注册中心、配置中心搭建的具体方法
 nacos-opensource 

---------------
## 专家官方解答 ：

使用 Nacos 作为微服务 Spring Cloud 的注册中心和配置中心搭建的具体方法如下：

**一、环境准备**

确保已安装并启动 Nacos Server。按照 Nacos 官方文档的指引进行下载和快速入门配置。具体操作步骤参见 [Nacos 快速入门](../quickstart/quick-start.md)。

**二、集成 Nacos 作为配置中心**

1. **添加依赖**

   在 Spring Cloud 项目的 `pom.xml` 或 `build.gradle` 文件中引入 `spring-cloud-starter-alibaba-nacos-config` 依赖：

   ```xml
   <dependency>
       <groupId>com.alibaba.cloud</groupId>
       <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
       <version>${alibaba-cloud-version}</version>
   </dependency>
   ```

   替换 `${alibaba-cloud-version}` 为合适的阿里云 Spring Cloud 组件版本。

2. **配置应用**

   在 Spring Boot 应用的配置文件（如 `application.properties` 或 `application.yml`）中添加以下配置：

   ```properties
   spring.cloud.nacos.config.server-addr=127.0.0.1:8848
   ```

   指定 Nacos Server 的地址和端口。

3. **启用配置管理**

   在主配置类（或任意其他配置类）上添加 `@EnableNacosConfig` 注解，启用 Nacos 配置管理功能：

   ```java
   @SpringBootApplication
   @EnableNacosConfig
   public class Application {
       public static void main(String[] args) {
           SpringApplication.run(Application.class, args);
       }
   }
   ```

4. **使用配置**

   在需要使用 Nacos 配置的类中，通过 `@Value` 注解注入所需的配置项。例如：

   ```java
   @Component
   public class AppConfig {

       @Value("${app.timeout:1000}")
       private int timeout;

       // 使用 timeout 变量...
   }
   ```

   配置文件中的 `app.timeout` 属性将被自动注入到 `timeout` 字段中。若 Nacos 中未找到该配置项，将使用默认值 `1000`。

**三、集成 Nacos 作为注册中心**

1. **添加依赖**

   在 Spring Cloud 项目的 `pom.xml` 或 `build.gradle` 文件中引入 `spring-cloud-starter-alibaba-nacos-discovery` 依赖：

   ```xml
   <dependency>
       <groupId>com.alibaba.cloud</groupId>
       <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
       <version>${alibaba-cloud-version}</version>
   </dependency>
   ```

   替换 `${alibaba-cloud-version}` 为合适的阿里云 Spring Cloud 组件版本。

2. **配置应用**

   在 Spring Boot 应用的配置文件中添加以下配置：

   ```properties
   spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
   ```

   指定 Nacos Server 的地址和端口。

3. **启用服务发现**

   在主配置类（或任意其他配置类）上添加 `@EnableDiscoveryClient` 注解，启用 Nacos 服务发现功能：

   ```java
   @SpringBootApplication
   @EnableDiscoveryClient
   public class Application {
       public static void main(String[] args) {
           SpringApplication.run(Application.class, args);
       }
   }
   ```

4. **注册服务**

   Spring Cloud 应用启动后，会自动向 Nacos 注册中心注册自身服务。服务的元数据（如服务名、端口等）通常从 `bootstrap.properties` 或 `bootstrap.yml` 文件及应用主类的 `@SpringBootApplication` 注解中获取。

5. **使用服务发现**

   在需要调用其他服务的地方，使用 Spring Cloud 提供的 `RestTemplate`、`FeignClient` 等工具结合 `@LoadBalanced` 注解进行服务消费。例如：

   ```java
   @RestController
   public class ConsumerController {

       @Autowired
       private RestTemplate restTemplate;

       @GetMapping("/call-service")
       public String callService() {
           return restTemplate.getForObject("http://service-name/api", String.class);
       }
   }
   ```

   在上述示例中，`http://service-name/api` 会被自动解析为注册在 Nacos 上的服务实例列表，并通过负载均衡策略选择一个实例进行调用。

至此，您已成功将 Nacos 集成到 Spring Cloud 微服务架构中，作为注册中心和配置中心。应用现在能够从 Nacos 获取动态配置，并通过 Nacos 进行服务注册与发现。


<font color="#949494">---------------</font> 


## 参考链接 ：

*[Nacos 融合 Spring Cloud，成为注册配置中心](https://nacos.io/docs/latest/ecology/use-nacos-with-spring-cloud)
 
 *[Nacos 融合 Spring，成为注册配置中心](https://nacos.io/docs/latest/ecology/use-nacos-with-spring)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11791)给我们反馈。
