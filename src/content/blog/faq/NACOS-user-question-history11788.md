---
id: "question-history-11788"
title: "使用nacos 作为微服务dubbo的注册中心、配置中心搭建的具体方法 nacos-opensource"
date: "2024-04-24"
category: expertConsultation
description: "nacos-opensource 使用nacos 作为微服务dubbo的注册中心、配置中心搭建的具体方法"
tags: ["微服务","dubbo","注册中心","配置中心","搭建","具体方法"]
keywords: ["微服务","dubbo","注册中心","配置中心","搭建","具体方法"]
---

## 用户问题 ： 
 使用nacos 作为微服务dubbo的注册中心、配置中心搭建的具体方法
 nacos-opensource 

---------------
## 专家官方解答 ：

使用Nacos作为微服务Dubbo的注册中心和配置中心搭建的具体方法如下：

**一、准备工作**

确保已经具备以下环境和依赖：

1. **JDK**：安装并配置Java开发环境，版本需与Dubbo和Nacos兼容。
2. **Maven**或**Gradle**：构建工具，用于管理项目依赖。
3. **Dubbo**：在项目中添加Dubbo相关依赖。
4. **Nacos Server**：下载并安装Nacos服务器，启动Nacos服务。

**二、配置Dubbo服务端以使用Nacos作为注册中心**

1. **添加Dubbo Nacos依赖**：在服务提供者的`pom.xml`或`build.gradle`文件中引入Dubbo Nacos相关依赖。

   Maven示例：

   ```xml
   <dependencies>
       <dependency>
           <groupId>com.alibaba.cloud</groupId>
           <artifactId>spring-cloud-starter-dubbo</artifactId>
           <version>版本号</version>
       </dependency>
       <dependency>
           <groupId>com.alibaba.cloud</groupId>
           <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
           <version>版本号</version>
       </dependency>
   </dependencies>
   ```

   Gradle示例：

   ```groovy
   dependencies {
       implementation 'com.alibaba.cloud:spring-cloud-starter-dubbo:版本号'
       implementation 'com.alibaba.cloud:spring-cloud-starter-alibaba-nacos-discovery:版本号'
   }
   ```

2. **配置Dubbo Spring Boot应用**：在服务提供者的`application.yml`或`application.properties`中配置Nacos作为注册中心。

   ```yaml
   spring:
     application:
       name: your-service-name # 服务名称
   dubbo:
     registry:
       address: nacos://localhost:8848 # Nacos服务器地址及端口
     protocol:
       name: dubbo
       port: -1 # 关闭Dubbo内置的端口，避免与Nacos冲突

   # Nacos服务发现配置（可选，若已全局配置则无需重复）
   nacos:
     discovery:
       server-addr: localhost:8848 # Nacos服务器地址及端口
   ```

3. **定义Dubbo服务接口及实现**：按照常规方式编写Dubbo服务接口和其实现类。

4. **开启Dubbo注解支持**：在Spring Boot主类上添加`@EnableDubbo`注解，启用Dubbo功能。

**三、配置Dubbo消费端以使用Nacos作为注册中心**

1. **添加相同依赖**：消费端项目也需要添加与服务端相同的Dubbo Nacos依赖。

2. **配置消费端应用**：在消费端的`application.yml`或`application.properties`中同样配置Nacos作为注册中心。

   ```yaml
   spring:
     application:
       name: your-consumer-name # 消费者名称
   dubbo:
     registry:
       address: nacos://localhost:8848 # Nacos服务器地址及端口

   # Nacos服务发现配置（可选，若已全局配置则无需重复）
   nacos:
     discovery:
       server-addr: localhost:8848 # Nacos服务器地址及端口
   ```

3. **引用Dubbo服务**：在消费端通过`@Reference`注解引用服务端提供的Dubbo服务。

**四、配置Nacos作为配置中心**

1. **添加Nacos配置中心依赖**：在服务提供者和消费端项目的`pom.xml`或`build.gradle`中引入Nacos配置中心依赖。

   Maven示例：

   ```xml
   <dependency>
       <groupId>com.alibaba.cloud</groupId>
       <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
       <version>版本号</version>
   </dependency>
   ```

   Gradle示例：

   ```groovy
   dependencies {
       implementation 'com.alibaba.cloud:spring-cloud-starter-alibaba-nacos-config:版本号'
   }
   ```

2. **配置Nacos配置中心**：在服务提供者和消费端的`bootstrap.yml`或`bootstrap.properties`中配置Nacos作为配置中心。

   ```yaml
   spring:
     cloud:
       nacos:
         config:
           server-addr: localhost:8848 # Nacos服务器地址及端口
           namespace: your-namespace # （可选）Nacos命名空间ID
           group: DEFAULT_GROUP # （可选）配置分组，默认为DEFAULT_GROUP
           file-extension: yaml # （可选）配置文件类型，默认为properties
           refresh-enabled: true # （可选）开启自动刷新配置
   ```

3. **创建Nacos配置**：在Nacos控制台创建对应的配置文件（如`your-service-name.yaml`），并填充所需的配置项。

4. **使用Nacos配置**：在服务提供者和消费端的代码中通过`@Value`注解或`@ConfigurationProperties`等Spring Boot特性来注入和使用Nacos配置中心中的配置。

至此，您已完成使用Nacos作为微服务Dubbo的注册中心和配置中心的搭建。服务提供者会将其服务信息注册到Nacos，消费端通过Nacos发现并调用服务，同时，所有服务实例的配置均从Nacos配置中心统一拉取和管理。


<font color="#949494">---------------</font> 


## 参考链接 ：

*[Dubbo 融合 Nacos 成为注册中心](https://nacos.io/docs/latest/ecology/use-nacos-with-dubbo)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11792)给我们反馈。
