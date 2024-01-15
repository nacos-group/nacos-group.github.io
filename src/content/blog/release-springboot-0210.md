---
title: Nacos-spring-boot0.2.10发布，全面支持Nacos2.0
keywords: [Nacos-spring-boot0.2.10, Nacos2.0]
description: Nacos-spring-boot0.2.10发布，全面支持Nacos2.0
date: "2021-07-26"
category: release
---

# Nacos-spring-boot0.2.10发布，全面支持Nacos2.0

<a name="0YIG0"></a>

随着Nacos2.0成熟稳定，Nacos-spring-boot发布0.1.10、0.2.10两个核心版本，全面支持了Nacos2.0，同时支持自动识别配置类型注入能力，修复了高并发场景下数据一致性问题。

```java
<dependency>
  <groupId>com.alibaba.boot</groupId>
  <artifactId>nacos-config-spring-boot-starter</artifactId>
  <version>0.2.10</version>
</dependency>
```

Nacos-spring-boot老用户，将相关maven依赖进行如下替换，即可快速升级。

本文将系统介绍新版本增强能力，并且以一次生产环境的配置管理项目构建过程为例，详细描述新版本Nacos Spring Boot0.2.10版本的部署，帮助Spring Boot老用户快速上岸Nacos2.0，感受长连接带来的10倍性能提升。

## Nacos-spring-boot新版本特性

新发布的0.1.10版本和0.2.10版本主要feature增强包括以下几个部分：

### 全面兼容Nacos2体系，向长连接时代演进

Nacos1体系中，配置中心的订阅、实时推送功能主要通过长轮训进行。尽管长轮训是HTTP短连接体系中被采用较多的动态刷新解决方案，但也不可避免地存在时延过高等缺陷；在生产实践中暴露了一定问题，如下面这两个链接所示

[https://github.com/alibaba/nacos/issues/6345](https://github.com/alibaba/nacos/issues/6345)

[https://github.com/alibaba/nacos/issues/2674](https://github.com/alibaba/nacos/issues/2674)

Nacos2体系将整个配置中心的订阅、推送功能重构成为了基于gRPC的长连接方案，保证了配置刷新实时推送；迄今为止，已经历了大量的生产环境考验。

### 自动识别配置的文件类型

在使用Nacos-spring-boot新版本之后，即使用户对配置类型未设置的情况下，nacos-spring-boot也会自动识别该配置的文件类型(json/yaml/properties)并给定默认值。

该机制极大降低了因为文件类型不匹配，业务侧出现配置处理错误的风险。下图为新版本Nacos-spring-boot项目在一次配置文件刷新过程中的工作机制。

![springboot1.png](/img/blog/springboot1.png)

### @NacosValue注解全面支持Spel表达式

Spel表达式全称为“Spring Expression Language”，是Spring自带的一种动态字符串构建方式表达式）。用户可以方便地使用Spel表达式来定义NacosValue，与Spring功能完美整合，减少SpringBoot用户们的工作量。
<a name="1Gmg9"></a>

```
    @NacosValue(value = "${app.name}", autoRefreshed = true)
    private String nacosNameAutoRefreshed;

    @NacosValue(value = "${app.name:Nacos}", autoRefreshed = true)
    private String nacosNameAutoRefreshedWithDefaultValue;

    @NacosValue("${app.name}")
    private String nacosNameNotAutoRefreshed;

    @NacosValue("${app.nacosFieldIntValue:" + VALUE_1 + "}")
    private int nacosFieldIntValue;

    @NacosValue(value = "${app.nacosFieldIntValueAutoRefreshed}", autoRefreshed = true)
    private int nacosFieldIntValueAutoRefreshed;
```

### 修复了高并发场景下的一致性问题
一些用户在使用Nacos-spring-boot项目进行大规模压测的过程中，出现了一些配置读取错误：在大流量频繁修改某些dataId的配置的过程中，客户端可能会拉取到旧版本的配置数据，导致客户端配置数据反复。
Nacos-spring-boot新版本通过增加智能锁、升级Nacos-spring依赖等方式，对于潜在的线程安全风险进行了修复。

## 生产演示

在Nacos服务端，为了方便Nacos部署升级和尽可能保证配置信息的信息安全，我们是从[阿里云微服务引擎MSE](https://cn.aliyun.com/product/aliware/mse?spm=nacos-website.topbar.0.0.0) 中购买的一个2核CPU+4G内存的三节点Nacos集群。

![springboot2](/img/blog/springboot2.png)

在Nacos客户端，在Springboot老用户可以通过下面方式升级到Nacos-spring-boot新版本。

### 在 Maven 项目的 pom.xml 文件中增加（或升级）以下依赖来获取 Starter

```
<dependency>
  <groupId>com.alibaba.boot</groupId>
  	<artifactId>nacos-config-spring-boot-starter</artifactId>
  	<version>0.2.10</version>
</dependency>
```

注： 使用时请根据自定义构建的Spring Boot版本选择相应的nacos-config-spring-boot-starter版本：nacos-config-spring-boot-starter 版本 0.2.10 对应 Spring Boot 2.x 版本，版本 0.1.10 对应 Spring Boot 1.x 版本。

### 在 application.properties 文件中配置连接信息

nacos.config.server-addr=${nacos_server_address}:8848
注：${nacos_server_address}为占位符，表示Nacos server的地址，可直接填入上文中购买的Nacos集群的公网或内网地址。

### 使用 @NacosPropertySource 加载 dataId 为 example 的配置源，并开启自动更新

```
@SpringBootApplication
@NacosPropertySource(dataId = "com.alibaba.nacos.example.properties", autoRefreshed = true)
public class NacosConfigApplication {
     public static void main(String[] args) {
         SpringApplication.run(NacosConfigApplication.class, args);
     } 
}
```

### 使用 @NacosValue 注解设置属性值。

```
@Controller 
@RequestMapping("config") 
public class ConfigController { 
    @NacosValue(value = "${connectTimeoutInMills:5000}", autoRefreshed = true) 
    private int connectTimeoutInMills;  
    @RequestMapping(value = "/get", method = GET) 
    @ResponseBody 
    public int get() { 
        return connectTimeoutInMills;
    } 
}
```

## 结果验证
在本地启动客户端项目，并运行以下命令：

```curl localhost:8080/config/get```

若返回以下信息，则说明 SDK 可正常使用。

```3000```

在MSE控制台将示例配置 com.alibaba.nacos.example.properties 更改为以下内容并发布。

```connectTimeoutInMills=6000```

若Console打印出更新的配置内容 ，则说明SDK的配置自动更新功能正常；工程正式跨入高性能配置中心时代。

