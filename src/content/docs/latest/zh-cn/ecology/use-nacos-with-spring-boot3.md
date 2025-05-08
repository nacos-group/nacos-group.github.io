---
title: Nacos 融合 Spring Boot3，成为注册配置中心
keywords: [Nacos,Spring Boot3]
description: 本文主要面向 Spring Boot3 的使用者，通过示例来介绍如何使用 Nacos 来实现分布式环境下的配置管理和服务发现。
sidebar:
    order: 3
---

# Nacos 融合 Spring Boot3，成为注册配置中心

本文主要面向 Spring Boot3 的使用者，通过两个示例来介绍如何使用 Nacos 来实现分布式环境下的配置管理和服务发现。

* 通过 Nacos Server 和 spring-alibaba-nacos-config 实现配置的动态变更；
  * * 将nacos中的配置作为Spring环境上下文属性源至一，可以通过@Value和@ConfigrationProperties引用属性，也可以通过Environment#getProperty()获取属性值。
  * * 通过@NacosConfig注解将nacos中的配置值直接注入到一个SpringBean的属性中，支持基础类型，对象类型以及集合类型。
  * * 通过@NacosConfigListener注解接收nacos中配置的变更时间，在回调方法中进行自定义业务逻辑。

SpringBoot2及以下的应用请参考旧版本 [Nacos 融合 Spring Boot(Deprated)](use-nacos-with-spring-boot.md)，旧版本已经不在更新演进，建议升级至SpringBoot3.
 
## 前提条件

您需要先下载 Nacos 并启动 Nacos server。操作步骤参见 [Nacos 快速入门](../quickstart/quick-start.mdx)。

## 启动配置管理

启动了 Nacos server 后，您就可以参考以下示例代码，为您的 Spring Boot3 应用启动 Nacos 配置管理服务了。

1. 添加依赖。

```
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-alibaba-nacos-config</artifactId>
    <version>2023.0.3.2</version>
</dependency>
```
spring-alibaba-nacos-config组件从Spring Cloud Alibaba内部孵化而来，可以在SpringBoot3应用中独立使用(包括Spring AI及Spring AI Alibaba应用)，当前被托管在Spring Cloud Alibaba项目中。

2. 在 `application.properties` 中配置 Nacos server 的地址：

```
spring.application.name=springboot3x
spring.config.import[0]=nacos:springboot3x.properties?group=DEFAULT_GROUP
spring.nacos.config.server-addr=127.0.0.1:8848
```
通过spring.config.import将  `dataId` 为 `springboot3x.properties` ，`group`=`DEFAULT_GROUP`的配置作为配置源。
如果需要指定多个nacos配置作为属性源，可以通过以下形式添加多个属性源
```
spring.config.import[0]=nacos:springboot3x.properties?group=DEFAULT_GROUP
spring.config.import[1]=nacos:{dataId1}?group={group1}
spring.config.import[2]=nacos:{dataId2}?group={group2}
```

通过spring.nacos.config.server-addr指定nacos的地址

3. 通过 Spring 的 `@Value` 以及 `@NacosConfig` 注解设置属性值。

```
@RestController
public class ConfigController {

	@Value("${plainKey}")
	String testKey;
	
	@NacosConfig(dataId = "routeconfig", group = "config", key = "rate")
	String rate;

	@RequestMapping("/testPlainKey")
	public String test() {
		return testKey;
	}

	@RequestMapping("/rate")
	public String rate() {
		return rate;
	}

}
```
**注意**：@Value和@NacosConfig都可以将nacos的属性注入到Spring Bean的字段中，两者的区别在于：

* @Value是Spring提供的注解，nacos中的属性源是众多属性源之一，通过@Value引用配置值会收到其他属性源的影响，优先级为JVM>ENV>Nacos
* 在SpringBoot应用中，@Value不支持运行期动态更新，@NacosConfig支持运行期动态更新。。
* @NacosConfig需要设置目标的dataId和group以及配置中的指定key，准确性更高。
* @NacosConfig支持复杂对象的注入，如自定义JavaBean以及其集合类型，如Set List及Map
* @NacosConfig可以作用于SpringBean，类似@ConfigurationProperties。


4. 通过  `@NacosConfigListener` 接收配置变更回调事件。

```
@Service
public class MyRateConfigService {

	@NacosConfigListener(dataId = "routeconfig",group = "config")
	public void rate(String rateConfig) {
		System.out.println("receiveRateConfig:"+rateConfig);
	}

}
```

**注意**：@NacosConfigListener默认不会进行回调初始值，如果需要收到初始值，可以通过指定initNotify=true

5. 启动应用，在浏览器中输入 `http://localhost:8080/testPlainKey` 和 `http://localhost:8080/rate` , 可以获取配置值。

6. 在Nacos控制台中修改配置，刷新页面，查看最新值，并且观察控制台输出确认变更回调方法是否执行。

关于@NacosConfig及@NacosConfigListener注解更多详细的用法，请参考：[Spring Nacos Config配置中心注解](../../../../blog/Nacos-gvr7dx_awbbpb_mmufdmayp5dfozci.md)


## 相关项目
* [Nacos](https://github.com/alibaba/nacos)
* [Spring Cloud Alibaba](https://github.com/alibaba/spring-cloud-alibaba)
