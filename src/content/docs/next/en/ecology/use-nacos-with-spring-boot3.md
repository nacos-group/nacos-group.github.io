---
title: Nacos with Spring Boot 3
keywords: [Nacos, Spring Boot 3]
description: Use Nacos for configuration management in Spring Boot 3 applications, with examples of configuration loading and change notifications.
sidebar:
  order: 3
---

# Nacos with Spring Boot 3

This guide introduces configuration management with Nacos in Spring Boot 3 applications.

* Use Nacos Server and `spring-alibaba-nacos-config` for dynamic configuration:
  * Add Nacos configuration as a Spring property source and access values through `@Value`, `@ConfigurationProperties`, or `Environment#getProperty()`.
  * Inject Nacos values into Spring beans through `@NacosConfig`, including basic types, objects, and collections.
  * Receive configuration changes through `@NacosConfigListener` and handle them in application callbacks.

For Spring Boot 2 or earlier, see the older [Nacos with Spring Boot guide](./use-nacos-with-spring-boot.md). That integration is no longer actively developed; upgrading to Spring Boot 3 is recommended.

## Prerequisites

Download Nacos and start the server as described in [Nacos Quick Start](../quickstart/quick-start.mdx).

Nacos 3.3 enables client authentication by default. With the default auth plugin, prepare an application account with read permission for the target configuration as described in [Access Credentials](../manual/user/auth.mdx). Set the `NACOS_USERNAME` and `NACOS_PASSWORD` environment variables before starting the application. The examples use Spring placeholders to read credentials. Provide the address and credentials locally or through the deployment environment, rather than only in remote configuration that requires Nacos login to read.

Remote configuration loading may fail without valid credentials or read permission. Check the account, password, namespace, and resource permissions before starting the application.

## Enable Configuration Management

After starting Nacos Server, follow these steps to enable configuration management in a Spring Boot 3 application.

1. Add the dependency.

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-alibaba-nacos-config</artifactId>
    <version>2023.0.3.2</version>
</dependency>
```

The `spring-alibaba-nacos-config` component originated in Spring Cloud Alibaba and remains hosted in that project. It can be used independently in Spring Boot 3 applications, including Spring AI and Spring AI Alibaba applications.

2. Configure the Nacos server address and credentials in `application.properties`:

```properties
spring.application.name=springboot3x
spring.config.import[0]=nacos:springboot3x.properties?group=DEFAULT_GROUP
spring.nacos.config.server-addr=127.0.0.1:8848
spring.nacos.config.username=${NACOS_USERNAME}
spring.nacos.config.password=${NACOS_PASSWORD}
```

`spring.config.import` adds the configuration with `dataId=springboot3x.properties` and `group=DEFAULT_GROUP` as a property source. To import multiple configurations:

```properties
spring.config.import[0]=nacos:springboot3x.properties?group=DEFAULT_GROUP
spring.config.import[1]=nacos:{dataId1}?group={group1}
spring.config.import[2]=nacos:{dataId2}?group={group2}
```

Set the Nacos address through `spring.nacos.config.server-addr`.

This guide uses the standalone `spring-alibaba-nacos-config` component with the `spring.nacos.config` prefix. For the Spring Cloud starter, see [Spring Cloud Integration](./use-nacos-with-spring-cloud.md); do not mix the two sets of property names.

3. Inject values through Spring's `@Value` and `@NacosConfig` annotations.

```java
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

**Note**: Both annotations can inject Nacos properties into Spring bean fields, with these differences:

* `@Value` uses Spring's property sources, including Nacos. Other sources affect the result; JVM properties take precedence over environment variables, which take precedence over Nacos properties.
* In Spring Boot applications, `@Value` does not support runtime refresh by itself, while `@NacosConfig` does.
* `@NacosConfig` specifies the target `dataId`, `group`, and key directly, without interference from other property sources.
* `@NacosConfig` supports complex objects and collections, such as custom Java beans, `Set`, `List`, and `Map`.
* `@NacosConfig` can also be applied to a Spring bean, similarly to `@ConfigurationProperties`.

4. Receive change callbacks with `@NacosConfigListener`.

```java
@Service
public class MyRateConfigService {

    @NacosConfigListener(dataId = "routeconfig", group = "config")
    public void rate(String rateConfig) {
        System.out.println("receiveRateConfig:" + rateConfig);
    }
}
```

**Note**: `@NacosConfigListener` does not deliver the initial value by default. Set `initNotify=true` to receive the current configuration once at startup.

5. Start the application and visit `http://localhost:8080/testPlainKey` and `http://localhost:8080/rate` to read the values.
6. Modify the configurations in the Nacos console, refresh the pages, and inspect application output to confirm that the change callbacks run.

For more annotation examples, see [Spring Nacos Config Annotations](/en/blog/nacos-gvr7dx_awbbpb_mmufdmayp5dfozci/).

## Related Projects

* [Nacos](https://github.com/alibaba/nacos)
* [Spring Cloud Alibaba](https://github.com/alibaba/spring-cloud-alibaba)
