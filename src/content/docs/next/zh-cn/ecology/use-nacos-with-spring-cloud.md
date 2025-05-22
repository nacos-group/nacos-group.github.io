---
title: Nacos 融合 Spring Cloud，成为注册配置中心
keywords: [Nacos,Spring Cloud]
description: 本文主要面向 Spring Cloud 的使用者，通过示例来介绍如何使用 Nacos 来实现分布式环境下的配置管理和服务发现
sidebar:
  order: 4
---

# Nacos 融合 Spring Cloud，成为注册配置中心

本文主要面向 [Spring Cloud](https://spring.io/projects/spring-cloud) 的使用者，通过两个示例来介绍如何使用 Nacos 来实现分布式环境下的配置管理和服务注册发现。

* 通过 Nacos Server 和 spring-cloud-starter-alibaba-nacos-config 实现配置的动态变更。
  * 将nacos中的配置作为Spring环境上下文属性源之一，可以通过@Value和@ConfigrationProperties引用属性，也可以通过Environment#getProperty()获取属性值。
  * 通过@NacosConfig注解将nacos中的配置值直接注入到一个SpringBean的属性中，支持基础类型，对象类型以及集合类型。
  * 通过@NacosConfigListener注解接收nacos中配置的变更事件，在回调方法中进行自定义业务逻辑。
* 通过 Nacos Server 和 spring-cloud-starter-alibaba-nacos-discovery 实现服务的注册与发现。

## 前提条件

您需要先下载 Nacos 并启动 Nacos server。操作步骤参见 [Nacos 快速入门](../quickstart/quick-start.mdx)

## 启动配置管理

启动了 Nacos server 后，您就可以参考以下示例代码，为您的 Spring Cloud 应用启动 Nacos 配置管理服务了。

1. 添加依赖。

```
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
    <version>2023.0.3.2</version>
</dependency>
```
您可以在Spring Cloud Alibaba官网查看版本关系说明，建议您使用最新的2023.x版本。
：[版本说明 ](https://sca.aliyun.com/docs/2023/overview/version-explain/)

2. 在 `application.properties` 中配置 Nacos server 的地址：

```
spring.application.name=springclouddemo2023x
spring.config.import[0]=nacos:springclouddemo2023x.properties?group=DEFAULT_GROUP
spring.cloud.nacos.config.server-addr=127.0.0.1:8848
```
通过spring.config.import将  `dataId` 为 `springclouddemo2023x.properties` ，`group`=`DEFAULT_GROUP`的配置作为配置源。
如果需要指定多个nacos配置作为属性源，可以通过以下形式添加多个属性源
```
spring.config.import[0]=nacos:springclouddemo2023x.properties?group=DEFAULT_GROUP
spring.config.import[1]=nacos:{dataId1}?group={group1}
spring.config.import[2]=nacos:{dataId2}?group={group2}
```
通过spring.cloud.nacos.config.server-addr指定nacos的地址

3. 通过 Spring 的 `@Value` 以及 `@NacosConfig` 注解设置属性值。

```
@RestController
public class ConfigController {

	@Value("${plainKey}")
	String testKey;
	
	@NacosConfig(dataId = "routeconfig",group = "config",key = "rate")
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
* @Value默认不支持运行期动态更新，需要结合@RefreshScope注解实现动态刷新，@NacosConfig默认支持运行期动态更新。。
* @NacosConfig需要设置目标的dataId和group以及配置中的指定key，不受其他属性源影响，准确性更高。
* @NacosConfig支持复杂对象的注入，如自定义JavaBean以及其集合类型，如Set List及Map。
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

7. **注意**：@NacosConfig以及@NacosConfigListener是SpringCloudAlibaba新版本提供的功能，在各系列的最新版本中都已支持
* 2023.x 系列需升级版本至 2023.0.3.2
* 2022.x 系列需升级版本至 2022.0.0.2
* 2021.x 系列需升级版本至 2021.0.6.2
* 2.2.x 系列需升级至 2.2.11

关于注解更多详细的用法，请参考：[Spring Nacos Config配置中心注解](../../../../blog/Nacos-gvr7dx_awbbpb_mmufdmayp5dfozci.md)

## 启动服务发现

本节通过实现一个简单的 `echo service` 演示如何在您的 Spring Cloud 项目中启用 Nacos 的服务发现功能，如下图示:

![echo service](https://cdn.nlark.com/lark/0/2018/png/15914/1542119181336-b6dc0fc1-ed46-43a7-9e5f-68c9ca344d60.png)

完整示例代码请参考：[nacos-spring-cloud-discovery-example](https://github.com/nacos-group/nacos-examples/tree/master/nacos-spring-cloud-example/nacos-spring-cloud-discovery-example)

1. 添加依赖：

```
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    <version>2023.0.3.2</version>
</dependency>
```
您可以在Spring Cloud Alibaba官网查看版本关系说明，建议您使用最新的2023.x版本。
：[版本说明 ](https://sca.aliyun.com/docs/2023/overview/version-explain/)

2. 配置服务提供者，从而服务提供者可以通过 Nacos 的服务注册发现功能将其服务注册到 Nacos server 上。

i. 在 `application.properties` 中配置 Nacos server 的地址：

```
server.port=8070
spring.application.name=service-provider

spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
```

ii. 通过 Spring Cloud 原生注解 `@EnableDiscoveryClient` 开启服务注册发现功能：

```
@SpringBootApplication
@EnableDiscoveryClient
public class NacosProviderApplication {

	public static void main(String[] args) {
		SpringApplication.run(NacosProviderApplication.class, args);
	}

	@RestController
	class EchoController {
		@RequestMapping(value = "/echo/{string}", method = RequestMethod.GET)
		public String echo(@PathVariable String string) {
			return "Hello Nacos Discovery " + string;
		}
	}
}
```


3. 配置服务消费者，从而服务消费者可以通过 Nacos 的服务注册发现功能从 Nacos server 上获取到它要调用的服务。

i. 在 `application.properties` 中配置 Nacos server 的地址：

```
server.port=8080
spring.application.name=service-consumer

spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
```

ii. 通过 Spring Cloud 原生注解 `@EnableDiscoveryClient`  开启服务注册发现功能。给 [RestTemplate](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-resttemplate.html) 实例添加  `@LoadBalanced` 注解，开启 `@LoadBalanced` 与 [Ribbon](https://cloud.spring.io/spring-cloud-netflix/multi/multi_spring-cloud-ribbon.html) 的集成：

```
@SpringBootApplication
@EnableDiscoveryClient
public class NacosConsumerApplication {

    @LoadBalanced
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    public static void main(String[] args) {
        SpringApplication.run(NacosConsumerApplication.class, args);
    }

    @RestController
    public class TestController {

        private final RestTemplate restTemplate;

        @Autowired
        public TestController(RestTemplate restTemplate) {this.restTemplate = restTemplate;}

        @RequestMapping(value = "/echo/{str}", method = RequestMethod.GET)
        public String echo(@PathVariable String str) {
            return restTemplate.getForObject("http://service-provider/echo/" + str, String.class);
        }
    }
}
```


4. 启动 `ProviderApplication` 和 `ConsumerApplication` ，调用 `http://localhost:8080/echo/2018`，返回内容为 `Hello Nacos Discovery 2018`。

## 相关项目

* [Nacos](https://github.com/alibaba/nacos)
* [Nacos Spring](https://github.com/nacos-group/nacos-spring-project)
* [Nacos Spring Boot](https://github.com/nacos-group/nacos-spring-boot-project)
* [Spring Cloud Alibaba](https://github.com/alibaba/spring-cloud-alibaba)
