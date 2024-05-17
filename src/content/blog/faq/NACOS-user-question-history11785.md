---
id: "question-history-11785"
title: "SpringCloud 使用 Nacos 作为注册中心、配置中心搭建 nacos-opensource"
date: "2024-04-24"
category: expertConsultation
description: "nacos-opensource SpringCloud 使用 Nacos 作为注册中心、配置中心搭建"
tags: ["Nacos","注册中心","配置中心","搭建"]
keywords: ["Nacos","注册中心","配置中心","搭建"]
---

## 用户问题 ： 
 SpringCloud 使用 Nacos 作为注册中心、配置中心搭建
 nacos-opensource 

---------------
## 专家官方解答 ：

**SpringCloud 使用 Nacos 作为注册中心、配置中心搭建**

首先，让我们依托我了解的知识分析问题的原因。在分布式系统中，SpringCloud 作为一个成熟的微服务架构解决方案，需要一个统一的服务注册中心和配置中心来协调各微服务之间的通信和配置管理。Nacos 正好具备这些功能，能够作为 SpringCloud 的注册中心和配置中心，提供服务的注册与发现、配置的动态变更等核心能力。因此，问题的核心在于如何将 Nacos 集成到 SpringCloud 环境中，以实现这两个关键角色。

我了解的知识中给出了详细的步骤指导，下面我们将按照以下顺序，给出具体的搭建步骤：

### **步骤一：准备 Nacos 服务器**

1. **下载并安装 Nacos**：访问 [Nacos 官方网站](https://nacos.io/) 或 [GitHub releases 页面](https://github.com/alibaba/nacos/releases)，下载适合您系统的 Nacos 服务器版本。

2. **启动 Nacos**：解压下载的文件后，进入 `bin` 目录，根据操作系统类型（Linux/Unix 或 Windows）执行相应的启动脚本（如 `startup.sh` 或 `startup.cmd`）。确保 Nacos 服务器成功运行且默认监听端口为 `8848`。

### **步骤二：集成 Nacos 作为配置中心**

1. **添加依赖**：在 SpringCloud 项目的 `pom.xml` 或 `build.gradle` 文件中引入 `spring-cloud-starter-alibaba-nacos-config` 依赖。例如，使用 Maven 添加如下依赖：

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
    <version>{{{latest_version}}}</version> <!-- 替换为当前最新的稳定版本 -->
</dependency>
```

2. **配置 SpringCloud 项目**：
   - 在 `bootstrap.properties` 或 `bootstrap.yml` 文件中配置 Nacos 服务器地址及应用名等信息：

   ```properties
   spring.application.name=your-service-name
   spring.cloud.nacos.config.server-addr=127.0.0.1:8848
   ```

   - 如果需要使用命名空间、分组或自定义配置文件格式等高级特性，请参考 [Nacos Config 文档](https://github.com/spring-cloud-incubator/spring-cloud-alibaba/wiki/Nacos-config) 进行相应配置。

3. **使用 Nacos 配置**：
   - 在 Nacos 控制台（默认访问地址 `http://127.0.0.1:8848/nacos`）创建对应的配置文件（如 `your-service-name.properties` 或 `your-service-name.yml`），输入所需的配置项。
   - 在 SpringCloud 项目中通过 `@Value` 或 `@ConfigurationProperties` 注解注入配置项，或直接使用 `Environment` 获取配置。

### **步骤三：集成 Nacos 作为注册中心**

1. **添加依赖**：在 SpringCloud 项目的 `pom.xml` 或 `build.gradle` 文件中引入 `spring-cloud-starter-alibaba-nacos-discovery` 依赖。例如，使用 Maven 添加如下依赖：

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    <version>{{{latest_version}}}</version> <!-- 替换为当前最新的稳定版本 -->
</dependency>
```

2. **配置 SpringCloud 项目**：
   - 在 `application.properties` 或 `application.yml` 文件中配置 Nacos 服务器地址及应用名等信息：

   ```properties
   spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
   ```

   - 如需启用健康检查、元数据等高级特性，请参考 [Nacos Discovery 文档](https://github.com/spring-cloud-incubator/spring-cloud-alibaba/wiki/Nacos-discovery) 进行相应配置。

3. **启用服务注册与发现**：
   - 在 SpringCloud 服务提供者中，只需添加以上依赖并完成配置，服务便会自动注册到 Nacos。
   - 在 SpringCloud 服务消费者中，通过 `@LoadBalanced` 注解修饰 `RestTemplate` 或使用 `FeignClient`，结合服务名进行远程调用，实现服务发现。

### **步骤四：验证集成效果**

1. **配置中心验证**：在 Nacos 控制台修改配置文件内容，观察 SpringCloud 项目是否能实时感知并应用新的配置。

2. **注册中心验证**：
   - 在 Nacos 控制台的服务列表中，确认服务提供者已成功注册。
   - 服务消费者应能正常调用到服务提供者，可通过日志、监控或调试工具验证调用链路。

至此，您已完成 SpringCloud 使用 Nacos 作为注册中心、配置中心的搭建工作。通过集成 Nacos，您的 SpringCloud 微服务架构拥有了高效、稳定的配置管理和服务注册发现机制。


<font color="#949494">---------------</font> 


## 参考链接 ：

*[Nacos 融合 Spring，成为注册配置中心](https://nacos.io/docs/latest/ecology/use-nacos-with-spring)
 
 *[Nacos 融合 Spring Cloud，成为注册配置中心](https://nacos.io/docs/latest/ecology/use-nacos-with-spring-cloud)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11789)给我们反馈。
