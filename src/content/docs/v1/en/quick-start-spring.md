---
title: Quick Start for Nacos Spring Projects
keywords: [Nacos,Spring,quick start]
description: This quick start introduces how to enable Nacos configuration management and service discovery features for your Spring project.
---

# Quick Start for Nacos Spring Projects

This quick start introduces how to enable Nacos configuration management and service discovery features for your Spring project.

For more details about Nacos Spring Boot: [nacos-spring-project](https://github.com/nacos-group/nacos-spring-project/wiki/Nacos-Spring-Project-0.3.1-%E6%96%B0%E5%8A%9F%E8%83%BD%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C).

The quick start includes two samples:
* How to enable Nacos server and Nacos Spring configuration modules to implement dynamic configuration management;
* How to enable Nacos server and Nacos Spring service discovery modules to implement service registration and discovery.

## Prerequisite

Follow instructions in [Nacos Quick Start](https://nacos.io/en/docs/next/quickstart/quick-start/) to download Nacos and start the Nacos server.

## Enable Configuration Service

Once you start the Nacos server, you can follow the steps below to enable the Nacos configuration management service for your Spring project. 

Sample project: [nacos-spring-config-example](https://github.com/nacos-group/nacos-examples/tree/master/nacos-spring-example/nacos-spring-config-example)

1. Add the Nacos Spring dependency.

```
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-spring-context</artifactId>
    <version>${latest.version}</version>
</dependency>
```

The the latest version can be available in maven repositories such as "[mvnrepository.com](https://mvnrepository.com/artifact/com.alibaba.nacos/nacos-spring-context)".

2. Add the `@EnableNacosConfig` annotation to enable the configuration service. In the code below, `@NacosPropertySource` is used to load the configuration source whose  `dataId` is `example` , and autorefresh is also enabled:

```
@Configuration
@EnableNacosConfig(globalProperties = @NacosProperties(serverAddr = "127.0.0.1:8848"))
@NacosPropertySource(dataId = "example", autoRefreshed = true)
public class NacosConfiguration {

}
```

3. Specify the property value for the `@NacosValue` annotation of Nacos. 

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

4. Start Tomcat and call  `curl http://localhost:8080/config/get` to get configuration information. Because no configuration has been published, a `false`message is returned.

5. Now you can call [Nacos Open API](https://nacos.io/docs/latest/open-api/) to publish a configruation to the Nacos server. Assume the dataId is `example`, and content is `useLocalCache=true`.

```
curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=example&group=DEFAULT_GROUP&content=useLocalCache=true"
```

6. Access `http://localhost:8080/config/get`again, and you get a return message of `true`, indicating that the value of `useLocalCache`in your application has been updated.

## Enable Service Discovery

Now you would like to enable the service discovery function of Nacos in your Spring project. 

Sampe project: [nacos-spring-discovery-example](https://github.com/nacos-group/nacos-examples/tree/master/nacos-spring-example/nacos-spring-discovery-example)

1. Add the Nacos Spring dependency.

```
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-spring-context</artifactId>
    <version>${latest.version}</version>
</dependency>
```

The the latest version can be available in maven repositories such as "[mvnrepository.com](https://mvnrepository.com/artifact/com.alibaba.nacos/nacos-spring-context)".

2. Add the `@EnableNacosDiscovery` annotation to enable the service discovery function of Nacos:

```
@Configuration
@EnableNacosDiscovery(globalProperties = @NacosProperties(serverAddr = "127.0.0.1:8848"))
public class NacosConfiguration {

}
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
```

4. Start Tomcat and call `curl http://localhost:8080/discovery/get?serviceName=example`, and the return value is an empty JSON array `[]`.

5. Call [Nacos Open API](https://nacos.io/docs/latest/open-api/) to register a service called `example`to the Nacos Server.

```
curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?serviceName=example&ip=127.0.0.1&port=8080'
```

6. Access `curl http://localhost:8080/discovery/get?serviceName=example`again, and you will get the following return:

```
[
  {
    "instanceId": "127.0.0.1#8080#DEFAULT#example",
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
