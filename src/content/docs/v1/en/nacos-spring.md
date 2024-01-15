---
title: Nacos Spring
keywords: [Nacos,Spring]
description: Nacos Spring
---

# Nacos Spring

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

## Related Projects

* [Nacos](https://github.com/alibaba/nacos)
* [Nacos Spring](https://github.com/nacos-group/nacos-spring-project)
* [Nacos Spring Boot](https://github.com/nacos-group/nacos-spring-boot-project)
* [Spring Cloud Alibaba](https://github.com/spring-cloud-incubator/spring-cloud-alibaba)