---
id: "question-history-15138"
title: "nacos 服务注册 发现 nacos-opensource"
date: "2024-06-07"
category: "expertConsultation"
description: "要实现Nacos的服务注册与发现，您可以按照以下步骤操作，这些步骤基于提供的知识内容：### 1. 添加依赖确保您的Spring Boot项目中包含了正确的Nacos服务发现起步依赖。根据您的Spring Boot版本选择合适的依赖版本。例如，对于Spring Boot 2.1.x，您应该在`pom"
---

## 用户问题 ： 
 nacos 服务注册 发现 nacos-opensource 

---------------
## 专家官方解答 ：

要实现Nacos的服务注册与发现，您可以按照以下步骤操作，这些步骤基于提供的知识内容：

### 1. 添加依赖

确保您的Spring Boot项目中包含了正确的Nacos服务发现起步依赖。根据您的Spring Boot版本选择合适的依赖版本。例如，对于Spring Boot 2.1.x，您应该在`pom.xml`中加入：

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    <version>${latest.version}</version>
</dependency>
```

其中`${latest.version}`需要替换为实际的最新版本号。版本对应关系可参考：[版本说明 Wiki](https://github.com/spring-cloud-incubator/spring-cloud-alibaba/wiki/%E7%89%88%E6%9C%AC%E8%AF%B4%E6%98%8E)

### 2. 配置服务提供者

#### i. 设置Nacos Server地址

在`application.properties`或`application.yml`中配置Nacos服务器的地址，例如：

```properties
server.port=8070
spring.application.name=service-provider
spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
```

确保Nacos服务器正在此地址上运行。

#### ii. 开启服务注册发现

在服务提供者的主类上添加`@EnableDiscoveryClient`注解：

```java
@SpringBootApplication
@EnableDiscoveryClient
public class NacosProviderApplication {
    // ... 其他代码 ...
}
```

并创建一个简单的RESTful API作为服务接口。

### 3. 配置服务消费者

#### i. 设置Nacos Server地址

如同服务提供者一样，服务消费者也需要配置Nacos服务器地址：

```properties
server.port=8080
spring.application.name=service-consumer
spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
```

#### ii. 开启服务注册发现与负载均衡

在服务消费者的主类同样添加`@EnableDiscoveryClient`注解，并通过`@LoadBalanced`注解使`RestTemplate`支持服务间负载均衡：

```java
@SpringBootApplication
@EnableDiscoveryClient
public class NacosConsumerApplication {
    @LoadBalanced
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
    // ... 其他代码 ...
}
```

之后，在消费者应用中通过`RestTemplate`调用服务提供者暴露的接口。

### 4. 测试服务调用

启动服务提供者(`NacosProviderApplication`)和消费者(`NacosConsumerApplication`)应用。通过访问消费者应用的某个端点，比如`http://localhost:8080/echo/2018`，验证是否能正确返回`Hello Nacos Discovery 2018`，这表明服务注册与发现机制已成功配置。

### 解释

以上步骤确保了您的Spring Cloud应用能够利用Nacos进行服务的注册与发现。服务提供者通过Nacos客户端向Nacos Server注册自己的信息，包括IP地址、端口等；而服务消费者则查询Nacos Server来发现服务实例列表，结合Ribbon实现客户端负载均衡，从而透明地调用到服务实例。这样，您的微服务架构就能灵活地扩展与管理服务。


<font color="#949494">---------------</font> 


## 参考链接 ：

*[Nacos功能和需求列表](https://nacos.io/docs/latest/archive/feature-list)
 
 *[Nacos 融合 Spring Cloud，成为注册配置中心](https://nacos.io/docs/latest/ecology/use-nacos-with-spring-cloud)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=15140)给我们反馈。
