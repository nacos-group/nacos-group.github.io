---
title: Nacos 融合 Spring，成为注册配置中心
keywords: [Nacos, Spring, 注解驱动, 依赖注入, 外部化配置, 事件驱动, 配置管理, 服务发现]
description: 本文主要面向 Spring 的使用者，通过两个示例来介绍如何使用 Nacos 来实现分布式环境下的配置管理和服务发现。
sidebar:
    order: 2
---

# Nacos 融合 Spring，成为注册配置中心

本文主要面向 Spring 的使用者，通过两个示例来介绍如何使用 Nacos 来实现分布式环境下的配置管理和服务发现。

关于 Nacos Spring 的详细文档请参看：[nacos-spring-project](https://github.com/nacos-group/nacos-spring-project/wiki/Nacos-Spring-Project-0.3.1-%E6%96%B0%E5%8A%9F%E8%83%BD%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C)。

* 通过 Nacos server 和 Nacos Spring 配置管理模块，实现配置的动态变更；
* 通过 Nacos server 和 Nacos Spring 服务发现模块，实现服务的注册与发现。

## 前提条件

您需要先下载 Nacos 并启动 Nacos server。操作步骤参见 [Nacos 快速入门](../quickstart/quick-start.md)。

## 启动配置管理

启动了 Nacos server 后，您就可以参考以下示例代码，为您的 Spring 应用启动 Nacos 配置管理服务了。完整示例代码请参考：[nacos-spring-config-example](https://github.com/nacos-group/nacos-examples/tree/master/nacos-spring-example/nacos-spring-config-example)

1. 添加依赖。

```
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-spring-context</artifactId>
    <version>${latest.version}</version>
</dependency>
```

最新版本可以在 maven 仓库，如 "[mvnrepository.com](https://mvnrepository.com/artifact/com.alibaba.nacos/nacos-spring-context)" 中获取。

2. 添加 `@EnableNacosConfig` 注解启用 Nacos Spring 的配置管理服务。以下示例中，我们使用 `@NacosPropertySource` 加载了 `dataId` 为 `example` 的配置源，并开启自动更新：

```
@Configuration
@EnableNacosConfig(globalProperties = @NacosProperties(serverAddr = "127.0.0.1:8848"))
@NacosPropertySource(dataId = "example", autoRefreshed = true)
public class NacosConfiguration {

}
```

3. 通过 Nacos 的 `@NacosValue` 注解设置属性值。

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

4. 启动 Tomcat，调用 `curl http://localhost:8080/config/get`尝试获取配置信息。由于此时还未发布过配置，所以返回内容是 `false`。

5. 通过调用 [Nacos Open API](../guide/user/open-api.md) 向 Nacos Server 发布配置：dataId 为`example`，内容为`useLocalCache=true`

```
curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=example&group=DEFAULT_GROUP&content=useLocalCache=true"
```

6. 再次访问 `http://localhost:8080/config/get`，此时返回内容为`true`，说明程序中的`useLocalCache`值已经被动态更新了。

## 启动服务发现

本节演示如何在您的 Spring 项目中启动 Nacos 的服务发现功能。完整示例代码请参考：[nacos-spring-discovery-example](https://github.com/nacos-group/nacos-examples/tree/master/nacos-spring-example/nacos-spring-discovery-example)

1. 添加依赖。

```
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-spring-context</artifactId>
    <version>${latest.version}</version>
</dependency>
```

最新版本可以在 maven 仓库，如 "[mvnrepository.com](https://mvnrepository.com/artifact/com.alibaba.nacos/nacos-spring-context)" 中获取。

2. 通过添加 `@EnableNacosDiscovery` 注解开启 Nacos Spring 的服务发现功能：

```
@Configuration
@EnableNacosDiscovery(globalProperties = @NacosProperties(serverAddr = "127.0.0.1:8848"))
public class NacosConfiguration {

}
```

3. 使用 `@NacosInjected` 注入  Nacos 的 `NamingService` 实例：

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

4. 启动 Tomcat，调用 `curl http://localhost:8080/discovery/get?serviceName=example`，此时返回为空 JSON 数组`[]`。

5. 通过调用 [Nacos Open API](../guide/user/open-api.md) 向  Nacos server 注册一个名称为 `example` 服务。

```
curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?serviceName=example&ip=127.0.0.1&port=8080'
```

6. 再次访问 `curl http://localhost:8080/discovery/get?serviceName=example`，此时返回内容为：

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

# Nacos Spring关键特性

下文将介绍 [`nacos-spring-context`](https://github.com/nacos-group/nacos-spring-project) 中的一些关键的特性：

- 注解驱动
- 依赖注入
- 外部化配置
- 事件驱动

## 1. 注解驱动

### 1.1. 启用 Nacos

`@EnableNacos`是一个模块驱动的注解，它支持 Nacos Spring 的所有功能，包括**服务发现**和**配置管理**。它等于 `@EnableNacosDiscovery` 加上 `@EnableNacosConfig`，可以单独配置并在不同场景中使用。

### 1.2. 配置监听

假设在 Nacos 服务中有一个配置，其 `dataId` 是 "testDataId" 而 `groupId` 是默认组（"DEFAULT_GROUP"）。 现在，您可以使用 `ConfigService#publishConfig` 方法更改其内容：

```java
@NacosInjected
private ConfigService configService;

@Test
public void testPublishConfig() throws NacosException {
    configService.publishConfig(DATA_ID, DEFAULT_GROUP, "9527");
}
```

然后您可以添加一个监听器，它将监听配置的变化。 您可以通过在 Spring Bean 中添加配置变更监听器方法来执行此操作：

```java
@NacosConfigListener(dataId = DATA_ID)
public void onMessage(String config) {
    assertEquals("mercyblitz", config); // asserts true
}
```

下面的代码具有相同的效果：

```java
configService.addListener(DATA_ID, DEFAULT_GROUP, new AbstractListener() {
    @Override
    public void receiveConfigInfo(String config) {
        assertEquals("9527", config); // asserts true
    }
});
```

另外，`@NacosConfigListener` 支持更丰富的类型转换。

- 请参看： [Simple Sample of `@NacosConfigListener`](https://github.com/nacos-group/nacos-spring-project/blob/master/nacos-spring-samples/nacos-spring-webmvc-sample/src/main/java/com/alibaba/nacos/samples/spring/listener/SimpleNacosConfigListener.java)


#### 1.2.1. 类型

`@NacosConfigListener` 的类型转换包括内置和自定义实现。 默认情况下，内置类型转换基于 Spring `DefaultFormattingConversionService`，这意味着它包好了大多数情况以及 Spring 框架更高级版本的丰富功能。 

例如，前面示例中的内容 "9527" 也可以通过带 "int" 或 "Integer" 参数的方法进行监听：:

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

当然, [`nacos-spring-context`](https://github.com/nacos-group/nacos-spring-project) 为开发人员提供弹性扩展。 如果定义名为`nacosConfigConversionService`的Spring Bean，其类型为`ConversionService`，则将忽略`DefaultFormattingConversionService`。 此外，您可以自定义`NacosConfigConverter`接口的实现，以指定类型转换的侦听器方法：

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

`UserNacosConfigConverter` 类绑定在 `@NacosConfigListener.converter()` 属性上，如下:

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

- 请参看：[Type Conversion Sample of `@NacosConfigListener`](https://github.com/nacos-group/nacos-spring-project/blob/master/nacos-spring-samples/nacos-spring-webmvc-sample/src/main/java/com/alibaba/nacos/samples/spring/listener/PojoNacosConfigListener.java)


#### 1.2.2. 超时时间

由于运行自定义的 `NacosConfigConverter` 可能需要一些时间，因此您可以在 `@NacosConfigListener.timeout()` 属性中设置最大执行时间，以防止它阻塞其他侦听器：

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

`Listeners` Bean 的 `integerValue` 总是为`null`，不会改变。 因此，以下断言都将是 `true`：

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

- 请参看：[Timeout Sample of `@NacosConfigListener`](https://github.com/nacos-group/nacos-spring-project/blob/master/nacos-spring-samples/nacos-spring-webmvc-sample/src/main/java/com/alibaba/nacos/samples/spring/listener/TimeoutNacosConfigListener.java)

### 1.3. 全局和自定义 Nacos 属性

`globalProperties` 是任何 `@EnableNacos`，`@EnableNacosDiscovery` 或 `@EnableNacosConfig` 中的必选属性，其类型为 `@NacosProperties`。 

`globalProperties` 将初始化为其他注解或组件的 "**全局 Nacos 属性**"，例如：`@NacosInjected`。 

换句话说，**全局 Nacos 属性** 定义全局和默认属性。它设置为具有最低优先级，并且也可以被覆盖。覆盖优先级如下表所示：

| Precedence Order | Nacos Annotation                                             | Required |
| ---------------- | ------------------------------------------------------------ | -------- |
| 1                | `*.properties()`                                             | N        |
| 2                | `@EnableNacosConfig.globalProperties()` or `@EnableNacosDiscovery.globalProperties()` | Y        |
| 3                | `@EnableNacos.globalProperties()`                            | Y        |


`*.properties()` 定义来自以下之一的自定义 Nacos 属性：  

- `@NacosInjected.properties()` 
- `@NacosConfigListener.properties()`
- `@NacosPropertySource.properties()` 
- `@NacosConfigurationProperties.properties()`

自定义的 Nacos 属性也由 `@NacosProperties` 配置。 不过，它们是可选的，用于在特殊情况下覆盖全局 Nacos 属性。 如果没有定义，Nacos 属性将尝试从 `@EnableNacosConfig.globalProperties()` 或 `@EnableNacosDiscovery.globalProperties()` 或
 `@EnableNacos.globalProperties()` 中查找属性。


### 1.4. `@NacosProperties`

`@NacosProperties` 是全局和自定义 Nacos 属性的统一注解。 它充当Java `Properties` 和 `NacosFactory` 类之间的中介。`NacosFactory` 负责创建 `ConfigService` 或 `NamingService` 实例。 

`@NacosProperties` 的属性完全支持占位符，它的源是Spring `Environment` 抽象中的各种 `PropertySource`，通常是Java System `Properties` 和操作系统环境变量。 所有占位符的前缀都是 `nacos.`。`@NacosProperties` 和 Nacos 属性的属性之间的映射如下所示： 

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


请注意，`@EnableNacosDiscovery` 和 `@EnableNacosConfig` 之间 `globalProperties()` 的占位符存在一些差异：


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


这些 `@EnableNacosDiscovery` 和 `@EnableNacosConfig` 的占位符用于隔离不同的 Nacos 服务，在大多数情况下都是不必要的。默认情况下，将使用常规占位符。

## 2. 依赖注入

`@NacosInjected` 是一个核心注解，用于在Spring Beans 中注入 `ConfigService` 或 `NamingService` 实例，并使这些实例**可缓存**。 这意味着如果它们的 `@NacosProperties` 相等，则实例将是相同的，无论属性是来自全局还是自定义的 Nacos 属性：

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

属性 `configService` 使用 `@EnableNacos#globalProperties()` 或 `@EnableNacosConfig#globalProperties()`，因为 `encode` 属性的默认值是  "UTF-8"，因此 `configService` 实例和由 `@NacosProperties(encode ="UTF-8")` 注解的 `configService2` 实例是相同的。 `namingService` 和 `namingService2` 也是如此。

值得注意的是，与 `NacosFactory.createConfigService()` 方法创建的 `ConfigService` 实例不同，`@NacosInjected` 注解创建的 `ConfigService` 实例支持 Nacos Spring 事件。 例如，在增强的 `ConfigService` 调用 `publishConfig()` 方法之后会有一个 `NacosConfigPublishedEvent`。 有关更多详细信息，请参阅"事件驱动"部分。

- 请参看：[Dependency Injection Sample](https://github.com/nacos-group/nacos-spring-project/blob/master/nacos-spring-samples/nacos-spring-webmvc-sample/src/main/java/com/alibaba/nacos/samples/spring/NacosConfiguration.java)


## 3. 外部化配置

外部化配置是 Spring Boot 引入的概念，它允许应用程序接收外部属性源以控制运行时行为。 Nacos Server 在应用程序外部运行单独的进程以维护应用程序配置。 [`nacos-spring-context`](https://github.com/nacos-group/nacos-spring-project) 提供了对象绑定，动态配置（自动刷新）等功能。

这里有 [`nacos-spring-context`](https://github.com/nacos-group/nacos-spring-project) 和 Spring Stack 之间的简单比较：

| Spring Stack               | Nacos Spring                    | Highlight                                      |
| -------------------------- | ------------------------------- | ---------------------------------------------- |
| `@Value`                   | `@NacosValue`                   | auto-refreshed                                 |
| `@ConfigurationProperties` | `@NacosConfigurationProperties` | auto-refreshed,`@NacosProperty`,`@NacosIgnore` |
| `@PropertySource`          | `@NacosPropertySource`          | auto-refreshed, precedence order control       |
| `@PropertySources`         | `@NacosPropertySources`         |                                                |


- 请参看：[Auto-Refreshed Sample of `@NacosConfigurationProperties`](https://github.com/nacos-group/nacos-spring-project/blob/master/nacos-spring-samples/nacos-spring-webmvc-sample/src/main/java/com/alibaba/nacos/samples/spring/properties/NacosConfigurationPropertiesConfiguration.java)
- 请参看：[Sample of `@NacosPropertySources` and `@NacosPropertySource`](https://github.com/nacos-group/nacos-spring-project/blob/master/nacos-spring-samples/nacos-spring-webmvc-sample/src/main/java/com/alibaba/nacos/samples/spring/env/NacosPropertySourceConfiguration.java)

## 4. 事件驱动

Nacos 事件驱动 基于标准的 Spring Event / Listener 机制。 Spring 的 `ApplicationEvent` 是所有 Nacos Spring 事件的抽象超类：

| Nacos Spring Event                           | Trigger                                                      |
| -------------------------------------------- | ------------------------------------------------------------ |
| `NacosConfigPublishedEvent`                  | After `ConfigService.publishConfig()`                        |
| `NacosConfigReceivedEvent`                   | After`Listener.receiveConfigInfo()`                          |
| `NacosConfigRemovedEvent`                    | After `configService.removeConfig()`                         |
| `NacosConfigTimeoutEvent`                    | `ConfigService.getConfig()` on timeout                       |
| `NacosConfigListenerRegisteredEvent`         | After `ConfigService.addListner()` or `ConfigService.removeListener()` |
| `NacosConfigurationPropertiesBeanBoundEvent` | After `@NacosConfigurationProperties` binding                |
| `NacosConfigMetadataEvent`                   | After Nacos Config operations                                |

- 请参看：[Event/Listener Sample](https://github.com/nacos-group/nacos-spring-project/blob/master/nacos-spring-samples/nacos-spring-webmvc-sample/src/main/java/com/alibaba/nacos/samples/spring/event/NacosEventListenerConfiguration.java)

# 相关项目

* [Nacos](https://github.com/alibaba/nacos)
* [Nacos Spring](https://github.com/nacos-group/nacos-spring-project)
* [Nacos Spring Boot](https://github.com/nacos-group/nacos-spring-boot-project)
* [Spring Cloud Alibaba](https://github.com/spring-cloud-incubator/spring-cloud-alibaba)
