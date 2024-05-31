---
id: "question-history-11786"
title: "使用nacos 作为spring cloud 的注册中心、配置中心搭建的具体方法 nacos-opensource"
date: "2024-05-31"
category: "expertConsultation"
description: "要使用Nacos作为Spring Cloud的注册中心和配置中心进行搭建，可以遵循以下步骤：### 1. 环境准备与依赖添加- **下载并启动Nacos Server**：首先，确保你已按照[Nacos快速入门](../quickstart/quick-start.md)的指引下载并启动了Nacos"
---

要使用Nacos作为Spring Cloud的注册中心和配置中心进行搭建，可以遵循以下步骤：

### 1. 环境准备与依赖添加

- **下载并启动Nacos Server**：首先，确保你已按照[Nacos快速入门](../quickstart/quick-start.md)的指引下载并启动了Nacos Server。默认情况下，Nacos运行在`127.0.0.1:8848`。

- **添加Maven依赖**：在你的Spring Cloud项目中，添加Nacos相关的Spring Cloud Starter依赖。对于Spring Cloud Alibaba集成，依赖如下：

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
    <version>${latest.version}</version>
</dependency>
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    <version>${latest.version}</version>
</dependency>
```
最新版本号请在[mvnrepository.com](https://mvnrepository.com/artifact/com.alibaba.cloud/spring-cloud-starter-alibaba-nacos-config)查询。

### 2. 配置文件设置

- **bootstrap.yml或application.yml**：配置Nacos服务器地址及应用相关信息。例如：

```yaml
spring:
  cloud:
    nacos:
      config:
        server-addr: 127.0.0.1:8848
        namespace: ${your-namespace-id} # 可选，用于多环境配置隔离
        group: DEFAULT_GROUP
        file-extension: yml
      discovery:
        server-addr: 127.0.0.1:8848
        service: ${your-service-name}
```

### 3. 启用Nacos配置管理

- 在你的Spring Boot主类上添加注解`@EnableNacosConfig`（如果使用Spring Cloud Alibaba）或`@EnableNacosDiscovery`和相关配置（如示例代码所示），以启用配置管理和服务发现。

### 4. 动态配置加载

- 使用`@NacosValue`注解注入配置值到Bean中，如示例代码展示的`useLocalCache`属性，该值会随Nacos中配置的变更而自动更新。

### 5. 服务注册与发现

- 通过`@EnableNacosDiscovery`注解开启服务发现功能，并可选择性地注入`NamingService`来管理服务实例。

### 6. 测试验证

- **配置验证**：通过Nacos控制台或API更改配置并观察应用是否能实时获取新的配置值。
- **服务发现验证**：部署多个服务实例后，使用Nacos提供的API注册服务实例，并通过你的服务发现客户端检查能否正确发现服务列表。

以上步骤概述了如何将Nacos集成到Spring Cloud项目中作为注册中心和配置中心的基本过程。具体实现细节和高级配置选项，请参考官方文档链接：[Nacos Config](https://github.com/spring-cloud-incubator/spring-cloud-alibaba/wiki/Nacos-config) 和 [Nacos Discovery](https://github.com/spring-cloud-incubator/spring-cloud-alibaba/wiki/Nacos-discovery)。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=14855)给我们反馈。
