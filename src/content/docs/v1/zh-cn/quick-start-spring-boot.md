---
title: Nacos Spring Boot 快速开始
keywords: [Nacos,Spring Boot]
description: Nacos Spring Boot 快速开始
---

# Nacos Spring Boot 快速开始

本文主要面向 Spring Boot 的使用者，通过两个示例来介绍如何使用 Nacos 来实现分布式环境下的配置管理和服务发现。

关于 Nacos Spring Boot 的详细文档请参看：[nacos-spring-boot-project](https://github.com/nacos-group/nacos-spring-boot-project/wiki/spring-boot-0.2.2-%E4%BB%A5%E5%8F%8A-0.1.2%E7%89%88%E6%9C%AC%E6%96%B0%E5%8A%9F%E8%83%BD%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C)。

* 通过 Nacos Server 和 nacos-config-spring-boot-starter 实现配置的动态变更；
* 通过 Nacos Server 和 nacos-discovery-spring-boot-starter 实现服务的注册与发现。

## 前提条件

您需要先下载 Nacos 并启动 Nacos server。操作步骤参见 [Nacos 快速入门](https://nacos.io/docs/v1/quickstart/quick-start/)。

## 启动配置管理

启动了 Nacos server 后，您就可以参考以下示例代码，为您的 Spring Boot 应用启动 Nacos 配置管理服务了。完整示例代码请参考：[nacos-spring-boot-config-example](https://github.com/nacos-group/nacos-examples/tree/master/nacos-spring-boot-example/nacos-spring-boot-config-example)

1. 添加依赖。

```
<dependency>
    <groupId>com.alibaba.boot</groupId>
    <artifactId>nacos-config-spring-boot-starter</artifactId>
    <version>${latest.version}</version>
</dependency>
```

**注意**：版本 [0.2.x.RELEASE](https://mvnrepository.com/artifact/com.alibaba.boot/nacos-config-spring-boot-starter) 对应的是 Spring Boot 2.x 版本，版本 [0.1.x.RELEASE](https://mvnrepository.com/artifact/com.alibaba.boot/nacos-config-spring-boot-starter) 对应的是 Spring Boot 1.x 版本。

2. 在 `application.properties` 中配置 Nacos server 的地址：

```
nacos.config.server-addr=127.0.0.1:8848
```

3. 使用 `@NacosPropertySource` 加载 `dataId` 为 `example` 的配置源，并开启自动更新：

```plain
@SpringBootApplication
@NacosPropertySource(dataId = "example", autoRefreshed = true)
public class NacosConfigApplication {

    public static void main(String[] args) {
        SpringApplication.run(NacosConfigApplication.class, args);
    }
}
```

4. 通过 Nacos 的 `@NacosValue` 注解设置属性值。

```
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

5. 启动 `NacosConfigApplication`，调用 `curl http://localhost:8080/config/get`，返回内容是 `false`。

6. 通过调用 [Nacos Open API](https://nacos.io/docs/latest/open-api/) 向 Nacos server 发布配置：dataId 为`example`，内容为`useLocalCache=true`

```
curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=example&group=DEFAULT_GROUP&content=useLocalCache=true"
```

7. 再次访问 `http://localhost:8080/config/get`，此时返回内容为`true`，说明程序中的`useLocalCache`值已经被动态更新了。

## 启动服务发现

本节演示如何在您的 Spring Boot 项目中启动 Nacos 的服务发现功能。完整示例代码请参考：[nacos-spring-boot-discovery-example](https://github.com/nacos-group/nacos-examples/tree/master/nacos-spring-boot-example/nacos-spring-boot-discovery-example)

1. 添加依赖。

```
<dependency>
    <groupId>com.alibaba.boot</groupId>
    <artifactId>nacos-discovery-spring-boot-starter</artifactId>
    <version>${latest.version}</version>
</dependency>
```

**注意**：版本 [0.2.x.RELEASE](https://mvnrepository.com/artifact/com.alibaba.boot/nacos-discovery-spring-boot-starter) 对应的是 Spring Boot 2.x 版本，版本 [0.1.x.RELEASE](https://mvnrepository.com/artifact/com.alibaba.boot/nacos-discovery-spring-boot-starter) 对应的是 Spring Boot 1.x 版本。

2. 在 `application.properties` 中配置 Nacos server 的地址：

```
nacos.discovery.server-addr=127.0.0.1:8848
```

3. 使用 `@NacosInjected` 注入 Nacos 的 `NamingService` 实例：

```
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

@SpringBootApplication
public class NacosDiscoveryApplication {

    public static void main(String[] args) {
        SpringApplication.run(NacosDiscoveryApplication.class, args);
    }
}
```


4. 启动 `NacosDiscoveryApplication`，调用 `curl http://localhost:8080/discovery/get?serviceName=example`，此时返回为空 JSON 数组`[]`。

5. 通过调用 [Nacos Open API](https://nacos.io/docs/latest/open-api/) 向  Nacos server 注册一个名称为 `example` 服务

```
curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?serviceName=example&ip=127.0.0.1&port=8080'
```

6. 再次访问 `curl http://localhost:8080/discovery/get?serviceName=example`，此时返回内容为：

```
[
  {
    "instanceId": "127.0.0.1-8080-DEFAULT-example",
    "ip": "127.0.0.1",
    "port": 8080,
    "weight": 1.0,
    "healthy": true,
    "cluster": {
      "serviceName": null,
      "name": "",
      "healthChecker": {
        "type": "TCP"
      },
      "defaultPort": 80,
      "defaultCheckPort": 80,
      "useIPPort4Check": true,
      "metadata": {}
    },
    "service": null,
    "metadata": {}
  }
]
```

## 相关项目
* [Nacos](https://github.com/alibaba/nacos)
* [Nacos Spring](https://github.com/nacos-group/nacos-spring-project)
* [Nacos Spring Boot](https://github.com/nacos-group/nacos-spring-boot-project)
* [Spring Cloud Alibaba](https://github.com/alibaba/spring-cloud-alibaba)
