---
id: "question-history-11431"
title: "如何实现Nacos 融合 Spring Boot 成为注册配置中心 nacos-opensource"
date: "2024-04-24"
category: expertConsultation
description: "nacos-opensource 如何实现Nacos 融合 Spring Boot 成为注册配置中心"
tags: ["Nacos","Spring Boot","注册配置中心"]
keywords: ["Nacos","Spring Boot","注册配置中心"]
---

## 用户问题 ： 
 如何实现Nacos 融合 Spring Boot 成为注册配置中心 nacos-opensource 

---------------
## 专家官方解答 ：

Nacos 融合 Spring Boot 成为注册配置中心的实现主要包括以下步骤：

1. **前提条件**：
   首先确保已下载并启动 Nacos Server。具体操作可参照[Nacos 快速入门](../quickstart/quick-start.md)。

2. **启动配置管理**：
   - **添加依赖**：在 Spring Boot 项目的 `pom.xml` 或 `build.gradle` 文件中引入 `nacos-config-spring-boot-starter`。注意根据项目使用的 Spring Boot 版本选择对应的 starter 版本（2.x 版本使用 0.2.x.RELEASE，1.x 版本使用 0.1.x.RELEASE）。

   ```xml
   <dependency>
       <groupId>com.alibaba.boot</groupId>
       <artifactId>nacos-config-spring-boot-starter</artifactId>
       <version>${latest.version}</version>
   </dependency>
   ```

   - **配置 Nacos Server 地址**：在 `application.properties` 文件中指定 Nacos Server 的地址。

   ```
   nacos.config.server-addr=127.0.0.1:8848
   ```

   - **加载 Nacos 配置源**：使用 `@NacosPropertySource` 注解指定 `dataId` 为 `example` 的配置源，并开启自动更新。

   ```java
   @SpringBootApplication
   @NacosPropertySource(dataId = "example", autoRefreshed = true)
   public class NacosConfigApplication {
   
       public static void main(String[] args) {
           SpringApplication.run(NacosConfigApplication.class, args);
       }
   }
   ```

   - **使用 Nacos 注解设置属性值**：在需要使用 Nacos 配置的类或方法上，使用 `@NacosValue` 注解绑定配置项，并开启自动更新。

   ```java
   @Controller
   @RequestMapping("config")
   public class ConfigController {
   
       @NacosValue(value = "${useLocalCache:false}", autoRefreshed = true)
       private boolean useLocalCache;
   
       @RequestMapping(value = "/get", method = GET)
       @ResponseBody
       public boolean get() {
           return useLocalCache;
       }
   }
   ```

   - **验证动态更新**：启动 `NacosConfigApplication`，通过 HTTP 请求获取配置值。首次请求返回 `false`。随后通过 Nacos Open API 更新配置（如 `useLocalCache=true`），再次请求时返回值应更新为 `true`，证明配置已动态刷新。

3. **启动服务发现**：
   - **添加依赖**：与配置管理类似，引入 `nacos-discovery-spring-boot-starter`，同样需注意 Spring Boot 版本与 starter 版本的对应关系。

   ```xml
   <dependency>
       <groupId>com.alibaba.boot</groupId>
       <artifactId>nacos-discovery-spring-boot-starter</artifactId>
       <version>${latest.version}</version>
   </dependency>
   ```

   - **配置 Nacos Server 地址**：与配置管理相同，在 `application.properties` 文件中指定 Nacos Server 的地址。

   ```
   nacos.discovery.server-addr=127.0.0.1:8848
   ```

   - **注入 NamingService 实例**：在需要使用服务发现功能的类中，使用 `@NacosInjected` 注解注入 `NamingService` 实例。

   ```java
   @Controller
   @RequestMapping("discovery")
   public class DiscoveryController {
   
       @NacosInjected
       private NamingService namingService;
   
       @RequestMapping(value = "/get", method = GET)
       @ResponseBody
       public List<Instance> get(@RequestParam String serviceName) throws NacosException {
           return namingService.getAllInstances(serviceName);
       }
   }
   ```

   - **验证服务发现**：启动 `NacosDiscoveryApplication`，通过 HTTP 请求查询服务实例列表。初始请求返回空数组。接着通过 Nacos Open API 向 Nacos Server 注册一个服务实例，再次请求时应返回注册的服务实例信息，表明服务发现功能已启用。

综上所述，通过上述步骤，即可成功将 Nacos 融合到 Spring Boot 项目中，实现配置管理和服务发现功能。


<font color="#949494">---------------</font> 


## 参考链接 ：

*[Nacos 融合 Spring Boot，成为注册配置中心](https://nacos.io/docs/latest/ecology/use-nacos-with-spring-boot)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11717)给我们反馈。
