---
title: Nacos with Spring Projects
keywords: [Nacos,Spring,quick start]
description: This quick start introduces how to enable Nacos configuration management and service discovery features for your Spring project.
sidebar:
    order: 2
---

# Nacos with Spring Projects

This quick start introduces how to enable Nacos configuration management and service discovery features for your Spring project.

For more details about Nacos Spring Boot: [nacos-spring-project](https://github.com/nacos-group/nacos-spring-project/wiki/Nacos-Spring-Project-0.3.1-%E6%96%B0%E5%8A%9F%E8%83%BD%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C).

The quick start includes two samples:
* How to enable Nacos server and Nacos Spring configuration modules to implement dynamic configuration management;
* How to enable Nacos server and Nacos Spring service discovery modules to implement service registration and discovery.

## Prerequisite

Follow instructions in [Nacos Quick Start](../quickstart/quick-start.mdx) to download Nacos and start the Nacos server.

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

5. Now you can call [Nacos Open API](../guide/user/open-api.md) to publish a configruation to the Nacos server. Assume the dataId is `example`, and content is `useLocalCache=true`.

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

5. Call [Nacos Open API](../guide/user/open-api.md) to register a service called `example`to the Nacos Server.

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

# Nacos Spring Key Features

This section provides a detailed description of the key features of [`nacos-spring-context`](https://github.com/nacos-group/nacos-spring-project):

- Annotation-Driven
- Dependency Injection
- Externalized Configuration
- Event-Driven

## 1. Annotation-Driven

### 1.1. Enable Nacos

`@EnableNacos` is a modular-driven annotation that enables all features of Nacos Spring, including **Service Discovery** and **Distributed Configuration**. It equals to  `@EnableNacosDiscovery` and 
`@EnableNacosConfig`, which can be configured separately and used in different scenarios.

### 1.2. Configure Change Listener method

Suppose there was a config in Nacos Server whose `dataId` is "testDataId" and `groupId` is default group("DEFAULT_GROUP"). Now you would like to change its content by using the `ConfigService#publishConfig` method:

```java
@NacosInjected
private ConfigService configService;

@Test
public void testPublishConfig() throws NacosException {
    configService.publishConfig(DATA_ID, DEFAULT_GROUP, "9527");
}
```

Then you would like to add a listener, which will be listening for the config changes. You can do this by adding a config change listener method into your Spring Beans:

```java
@NacosConfigListener(dataId = DATA_ID)
public void onMessage(String config) {
    assertEquals("mercyblitz", config); // asserts true
}
```

The code below has the same effect:

```java
configService.addListener(DATA_ID, DEFAULT_GROUP, new AbstractListener() {
    @Override
    public void receiveConfigInfo(String config) {
        assertEquals("9527", config); // asserts true
    }
});
```

**Note:** `@NacosConfigListener` supports richer type conversions.

- See [Simple Sample of `@NacosConfigListener`](https://github.com/nacos-group/nacos-spring-project/blob/master/nacos-spring-samples/nacos-spring-webmvc-sample/src/main/java/com/alibaba/nacos/samples/spring/listener/SimpleNacosConfigListener.java)

#### 1.2.1. Type Conversion

The type conversion of `@NacosConfigListener` includes both build-in and customized implementations. By default, build-in type conversion is based on Spring `DefaultFormattingConversionService`, which means it covers most of the general cases as well as the rich features of the higher Spring framework. 

For example, the content "9527" in the preceding example can also be listened by a method with integer or the `Integer` argument:

```java
@NacosConfigListener(dataId = DATA_ID)
public void onInteger(Integer value) {
    assertEquals(Integer.valueOf(9527), value); // asserts true
}

@NacosConfigListener(dataId = DATA_ID)
public void onInt(int value) {
    assertEquals(9527, value); // asserts true
}
```

Of course, [`nacos-spring-context`](https://github.com/nacos-group/nacos-spring-project) provides elastic extension for developers. If you define a named `nacosConfigConversionService` Spring Bean whose type is `ConversionService` , the `DefaultFormattingConversionService` will be ignored. In addition, you can customize the implementation of  the `NacosConfigConverter` interface to specify a listener method for type conversion:

```java
public class UserNacosConfigConverter implements NacosConfigConverter<User> {

    @Override
    public boolean canConvert(Class<User> targetType) {
        return true;
    }

    @Override
    public User convert(String source) {
        return JSON.parseObject(source, User.class);
    }
}
```

The `UserNacosConfigConverter` class binds the `@NacosConfigListener.converter()` attribute:

```java
@NacosInjected
private ConfigService configService;

@Test
public void testPublishUser() throws NacosException {
    configService.publishConfig("user", DEFAULT_GROUP, "{\"id\":1,\"name\":\"mercyblitz\"}");
}

@NacosConfigListener(dataId = "user", converter = UserNacosConfigConverter.class)
public void onUser(User user) {
    assertEquals(Long.valueOf(1L), user.getId()); 
    assertEquals("mercyblitz", user.getName());
}
```

- See [Type Conversion Sample of `@NacosConfigListener`](https://github.com/nacos-group/nacos-spring-project/blob/master/nacos-spring-samples/nacos-spring-webmvc-sample/src/main/java/com/alibaba/nacos/samples/spring/listener/PojoNacosConfigListener.java)

#### 1.2.2. Timeout of Execution

As it might cost some time to run customized `NacosConfigConverter`, you can set  max execution time in the `@NacosConfigListener.timeout()` attribute to prevent it from blocking other listeners:

```java
@Configuration
public class Listeners {

    private Integer integerValue;

    private Double doubleValue;

    @NacosConfigListener(dataId = DATA_ID, timeout = 50)
    public void onInteger(Integer value) throws Exception {
        Thread.sleep(100); // timeout of execution
        this.integerValue = value;
    }

    @NacosConfigListener(dataId = DATA_ID, timeout = 200)
    public void onDouble(Double value) throws Exception {
        Thread.sleep(100); // normal execution
        this.doubleValue = value;
    }

    public Integer getIntegerValue() {
        return integerValue;
    }

    public Double getDoubleValue() {
        return doubleValue;
    }
}
```

The `integerValue` of `Listeners` Bean is always `null` and will not be changed. Therefore, those asserts will be `true`:

```java
@Autowired
private Listeners listeners;

@Test
public void testPublishConfig() throws NacosException {
    configService.publishConfig(DATA_ID, DEFAULT_GROUP, "9527");
    assertNull(listeners.getIntegerValue()); // asserts true
    assertEquals(Double.valueOf(9527), listeners.getDoubleValue());   // asserts true
}
```

- See [Timeout Sample of `@NacosConfigListener`](https://github.com/nacos-group/nacos-spring-project/blob/master/nacos-spring-samples/nacos-spring-webmvc-sample/src/main/java/com/alibaba/nacos/samples/spring/listener/TimeoutNacosConfigListener.java)

### 1.3. Global and Special Nacos Properties

The `globalProperties` is a required attribute in any `@EnableNacos`, `@EnableNacosDiscovery` or `@EnableNacosConfig`, and its type is `@NacosProperties`. `globalProperties` initializes "**Global Nacos Properties**" that will be used by other annotations 
and components, e,g `@NacosInjected`. In other words, **Global Nacos Properties**" defines the global and default properties. It is set with the lowest priority and can be overridden if needed. The precedence of overiding rules is shown in the following table:

| Precedence Order | Nacos Annotation                                             | Required |
| ---------------- | ------------------------------------------------------------ | -------- |
| 1                | `*.properties()`                                             | N        |
| 2                | `@EnableNacosConfig.globalProperties()` or `@EnableNacosDiscovery.globalProperties()` | Y        |
| 3                | `@EnableNacos.globalProperties()`                            | Y        |


`*.properties()` defines special Nacos properties which come from one of the following:  

- `@NacosInjected.properties()` 
- `@NacosConfigListener.properties()`
- `@NacosPropertySource.properties()` 
- `@NacosConfigurationProperties.properties()`

Special Nacos properties are also configured by `@NacosProperties`. However, they are optional and are used to override Global Nacos Properties in special scenarios. If not defined, the Nacos Properties will 
try to retrieve properities from `@EnableNacosConfig.globalProperties()` or `@EnableNacosDiscovery.globalProperties()`, or 
`@EnableNacos.globalProperties()`.

### 1.4. `@NacosProperties`

`@NacosProperties` is a uniform annotation for global and special Nacos properties. It serves as a mediator between Java `Properties` and `NacosFactory` class.   `NacosFactory` is responsible for creating `ConfigService` or `NamingService` instances. 

The attributes of `@NacosProperties` completely support placeholders whose source is all kinds of `PropertySource` in Spring `Environment` abstraction, typically Java System `Properties` and OS environment variables. The prefix of all placeholders are `nacos.`.  The mapping between the attributes of `@NacosProperties` and Nacos properties are shown below: 

| Attribute       | Property       | Placeholder              | Description | Required  |
| --------------- | -------------- | ------------------------ | ----------- | --------- |
| `endpoint()`    | `endpoint`     | `${nacos.endpoint:}`     |             |     N     |
| `namespace()`   | `namespace`    | `${nacos.namespace:}`    |             |     N     |
| `accessKey()`   | `access-key`   | `${nacos.access-key:}`   |             |     N     |
| `secretKey()`   | `secret-key`   | `${nacos.secret-key:}`   |             |     N     |
| `serverAddr()`  | `server-addr`  | `${nacos.server-addr:}`  |             |     Y     |
| `contextPath()` | `context-path` | `${nacos.context-path:}` |             |     N     |
| `clusterName()` | `cluster-name` | `${nacos.cluster-name:}` |             |     N     |
| `encode()`      | `encode`       | `${nacos.encode:UTF-8}`  |             |     N     |


Note that there are some differences in the placeholders of `globalProperties()` between `@EnableNacosDiscovery` and `@EnableNacosConfig`:


| Attribute       | `@EnableNacosDiscovery`'s Placeholder                     |`@EnableNacosConfig`'s Placeholder  |
| --------------- | -------------------------------------------------------- | -------------------------------------------------    |
| `endpoint()`    | `${nacos.discovery.endpoint:${nacos.endpoint:}}`         |`${nacos.config.endpoint:${nacos.endpoint:}}`         |
| `namespace()`   | `${nacos.discovery.namespace:${nacos.namespace:}}`       |`${nacos.config.namespace:${nacos.namespace:}}`       |
| `accessKey()`   | `${nacos.discovery.access-key:${nacos.access-key:}}`     |`${nacos.config.access-key:${nacos.access-key:}}`     |
| `secretKey()`   | `${nacos.discovery.secret-key:${nacos.secret-key:}}`     |`${nacos.config.secret-key:${nacos.secret-key:}}`     |
| `serverAddr()`  | `${nacos.discovery.server-addr:${nacos.server-addr:}}`   | `${nacos.config.server-addr:${nacos.server-addr:}}`   |
| `contextPath()` | `${nacos.discovery.context-path:${nacos.context-path:}}` | `${nacos.config.context-path:${nacos.context-path:}}` |
| `clusterName()` | `${nacos.discovery.cluster-name:${nacos.cluster-name:}}` |`${nacos.config.cluster-name:${nacos.cluster-name:}}` |
| `encode()`      | `${nacos.discovery.encode:${nacos.encode:UTF-8}}`        |`${nacos.config.encode:${nacos.encode:UTF-8}}`        |

These placeholders of `@EnableNacosDiscovery` and `@EnableNacosConfig` are designed to isolate different Nacos servers, and are unnecessary in most scenarios.  By default, general placeholders will be reused.

## 2. Dependency Injection

`@NacosInjected` is a core annotation which is used to inject `ConfigService` or `NamingService` instance in your Spring Beans and make these instances **cacheable**. This means the instances will be the same if their `@NacosProperties` are equal, regargless of whether the properties come from global or special Nacos properties:

```java
@NacosInjected
private ConfigService configService;

@NacosInjected(properties = @NacosProperties(encode = "UTF-8"))
private ConfigService configService2;

@NacosInjected(properties = @NacosProperties(encode = "GBK"))
private ConfigService configService3;

@NacosInjected
private NamingService namingService;

@NacosInjected(properties = @NacosProperties(encode = "UTF-8"))
private NamingService namingService2;

@NacosInjected(properties = @NacosProperties(encode = "GBK"))
private NamingService namingService3;

@Test
public void testInjection() {

    Assert.assertEquals(configService, configService2);
    Assert.assertNotEquals(configService2, configService3);

    Assert.assertEquals(namingService, namingService2);
    Assert.assertNotEquals(namingService2, namingService3);
}
```

The property `configService` uses `@EnableNacos#globalProperties()` or `@EnableNacosConfig#globalProperties()`, and because the default value of the `encode` attribute is "UTF-8", therefore the `configService` instance and the `configService2` instance which is annotated by `@NacosProperties(encode = "UTF-8")` are the same. The same is true for `namingService` and `namingService2`.

More importantly, unlike the `ConfigService` instances created by the `NacosFactory.createConfigService()` method, the `ConfigService` instances created by the `@NacosInjected` annotation support Nacos Spring events. For instance, there will be an `NacosConfigPublishedEvent`  after an enhanced `ConfigService` invokes the `publishConfig()` method. Refer to the [Event/Listener Driven](#eventlistener-driven) section for more details.

- See [Dependency Injection Sample](https://github.com/nacos-group/nacos-spring-project/blob/master/nacos-spring-samples/nacos-spring-webmvc-sample/src/main/java/com/alibaba/nacos/samples/spring/NacosConfiguration.java)

## 3. Externalized Configuration

Externalized configuration is a concept introduced by Spring Boot, which allows applications to receive external property sources to control runtime behavior. Nacos Server runs an isolation process outside the application to maintain the application configurations. [`nacos-spring-context`](https://github.com/nacos-group/nacos-spring-project) provides properties features including object binding, dynamic configuration(auto-refreshed) and so on, and dependence on Spring Boot or Spring Cloud framework is required.

Here is a simple comparison between  [`nacos-spring-context`](https://github.com/nacos-group/nacos-spring-project) and Spring stack:

| Spring Stack               | Nacos Spring                    | Highlight                                      |
| -------------------------- | ------------------------------- | ---------------------------------------------- |
| `@Value`                   | `@NacosValue`                   | auto-refreshed                                 |
| `@ConfigurationProperties` | `@NacosConfigurationProperties` | auto-refreshed,`@NacosProperty`,`@NacosIgnore` |
| `@PropertySource`          | `@NacosPropertySource`          | auto-refreshed, precedence order control       |
| `@PropertySources`         | `@NacosPropertySources`         |                                                |

- See [Auto-Refreshed Sample of `@NacosConfigurationProperties`](https://github.com/nacos-group/nacos-spring-project/blob/master/nacos-spring-samples/nacos-spring-webmvc-sample/src/main/java/com/alibaba/nacos/samples/spring/properties/NacosConfigurationPropertiesConfiguration.java)

- See [Sample of `@NacosPropertySources` and `@NacosPropertySource`](https://github.com/nacos-group/nacos-spring-project/blob/master/nacos-spring-samples/nacos-spring-webmvc-sample/src/main/java/com/alibaba/nacos/samples/spring/env/NacosPropertySourceConfiguration.java)

## 4. Event/Listener Driven

Nacos Event/Listener Driven is based on the standard Spring Event/Listener mechanism. The `ApplicationEvent` of Spring is an abstract super class for all Nacos Spring events:

| Nacos Spring Event                           | Trigger                                                      |
| -------------------------------------------- | ------------------------------------------------------------ |
| `NacosConfigPublishedEvent`                  | After `ConfigService.publishConfig()`                        |
| `NacosConfigReceivedEvent`                   | After`Listener.receiveConfigInfo()`                          |
| `NacosConfigRemovedEvent`                    | After `configService.removeConfig()`                         |
| `NacosConfigTimeoutEvent`                    | `ConfigService.getConfig()` on timeout                       |
| `NacosConfigListenerRegisteredEvent`         | After `ConfigService.addListner()` or `ConfigService.removeListener()` |
| `NacosConfigurationPropertiesBeanBoundEvent` | After `@NacosConfigurationProperties` binding                |
| `NacosConfigMetadataEvent`                   | After Nacos Config operations                                |

- See [Event/Listener Sample](https://github.com/nacos-group/nacos-spring-project/blob/master/nacos-spring-samples/nacos-spring-webmvc-sample/src/main/java/com/alibaba/nacos/samples/spring/event/NacosEventListenerConfiguration.java)

# Related Projects

* [Nacos](https://github.com/alibaba/nacos)
* [Nacos Spring](https://github.com/nacos-group/nacos-spring-project)
* [Nacos Spring Boot](https://github.com/nacos-group/nacos-spring-boot-project)
* [Spring Cloud Alibaba](https://github.com/spring-cloud-incubator/spring-cloud-alibaba)
