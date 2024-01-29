---
title: Quick Start for Nacos Spring Boot Projects
keywords: [Nacos,Spring Boot]
description: Quick Start for Nacos Spring Boot Projects
---

# Quick Start for Nacos Spring Boot Projects

This quick start introduces how to enable Nacos configuration management and service discovery features for your Spring Boot project.

For more details about Nacos Spring Boot: [nacos-spring-boot-project](https://github.com/nacos-group/nacos-spring-boot-project/wiki/spring-boot-0.2.2-%E4%BB%A5%E5%8F%8A-0.1.2%E7%89%88%E6%9C%AC%E6%96%B0%E5%8A%9F%E8%83%BD%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C).

The quick start includes two samples:
* How to enable dynamic configuration updates with Nacos server and nacos-config-spring-boot-starter;
* How to enable service registration and discovery with Nacos Server and nacos-discovery-spring-boot-starter.

## Prerequisite

Follow instructions in [Nacos Quick Start](https://nacos.io/docs/v1/quickstart/quick-start/) to download Nacos and start the Nacos server.

## Enable Configuration Service

Once you start the Nacos server, you can follow the steps below to enable the Nacos configuration management service for your Spring Boot project. 

Sample project: [nacos-spring-boot-config-example](https://github.com/nacos-group/nacos-examples/tree/master/nacos-spring-boot-example/nacos-spring-boot-config-example)

1. Add the Nacos Spring Boot dependency.

```
<dependency>
    <groupId>com.alibaba.boot</groupId>
    <artifactId>nacos-config-spring-boot-starter</artifactId>
    <version>${latest.version}</version>
</dependency>
```

**Note**: Version [0.2.x.RELEASE](https://mvnrepository.com/artifact/com.alibaba.boot/nacos-config-spring-boot-starter) is compatible with the Spring Boot 2.0.x line. Version [0.1.x.RELEASE](https://mvnrepository.com/artifact/com.alibaba.boot/nacos-config-spring-boot-starter) is compatible with the Spring Boot 1.x line.

2. Configure the Nacos server address in `application.properties` :

```
nacos.config.server-addr=127.0.0.1:8848
```

3. Use `@NacosPropertySource` to load the configuration source whose `dataId` is `example` , and enable autorefresh of configuration updates:

```plain
@SpringBootApplication
@NacosPropertySource(dataId = "example", autoRefreshed = true)
public class NacosConfigApplication {

    public static void main(String[] args) {
        SpringApplication.run(NacosConfigApplication.class, args);
    }
}
```

4. Specify the property value of the `@NacosValue` annotation of Nacos.

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

5. Start `NacosConfigApplication`and call `curl http://localhost:8080/config/get`. You will get a return message of `false`, as no configuration has been published so far.

6. Call [Nacos Open API](https://nacos.io/docs/latest/open-api/) to publish a configuration to the Nacos server. Assume the dataId is `example`, and the content is `useLocalCache=true`.

```
curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=example&group=DEFAULT_GROUP&content=useLocalCache=true"
```

7. Access `http://localhost:8080/config/get`again, and the returned value will be`true`，indicating that the value of `useLocalCache`in your application has been updated.

## Enable Service Discovery

Now you would also like to enable the service discovery feature of Nacos in your Spring Boot project. 

Sample project: [nacos-spring-boot-discovery-example](https://github.com/nacos-group/nacos-examples/tree/master/nacos-spring-boot-example/nacos-spring-boot-discovery-example)

1. Add the Nacos Spring Boot dependency.

```
<dependency>
    <groupId>com.alibaba.boot</groupId>
    <artifactId>nacos-discovery-spring-boot-starter</artifactId>
    <version>${latest.version}</version>
</dependency>
```

**Note**: Version [0.2.x.RELEASE](https://mvnrepository.com/artifact/com.alibaba.boot/nacos-discovery-spring-boot-starter) is compatible with the Spring Boot 2.0.x line. Version [0.1.x.RELEASE](https://mvnrepository.com/artifact/com.alibaba.boot/nacos-discovery-spring-boot-starter) is compatible with the Spring Boot 1.x line.

2. Configure the Nacos server address in `application.properties` :

```
nacos.discovery.server-addr=127.0.0.1:8848
```

3. Use `@NacosInjected` to inject a Nacos `NamingService` instance:

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


4. Start `NacosDiscoveryApplication`and call `curl http://localhost:8080/discovery/get?serviceName=example`，you will get a return value of an empty JSON array `[]`.

5. Call [Nacos Open API](https://nacos.io/docs/latest/open-api/) to register a service called `example` to the Nacos server.

```
curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?serviceName=example&ip=127.0.0.1&port=8080'
```

6. Access `curl http://localhost:8080/discovery/get?serviceName=example`again and you will get the following return:

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

## Related Projects
* [Nacos](https://github.com/alibaba/nacos)
* [Nacos Spring](https://github.com/nacos-group/nacos-spring-project)
* [Nacos Spring Boot](https://github.com/nacos-group/nacos-spring-boot-project)
* [Spring Cloud Alibaba](https://github.com/alibaba/spring-cloud-alibaba)
