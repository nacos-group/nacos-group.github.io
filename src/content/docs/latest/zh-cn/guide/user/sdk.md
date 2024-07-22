---
title: Java SDK
keywords: [Java,SDK]
description: Java SDK
sidebar:
    order: 1
---

> 该文档即将废弃，推荐查看[用户手册-JAVA SDK-JAVA SDK 使用手册](../../manual/user/java-sdk/usage.md)。

# Java SDK

## 概述部分

Maven 坐标
```
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-client</artifactId>
    <version>${version}</version>
</dependency>
```

> 注意：由于Nacos Java SDK在2.0版本后引入了gRPC，为了避免用户业务引入的gRPC版本不同导致冲突，使用了shaded技术将部分依赖直接封装进nacos-client中，导致nacos-client较大。
> 如果用户未自行引入gRPC或确认版本无冲突，希望使用纯净版的nacos-client以减小依赖，可以使用classifier来指定使用纯净版。

```xml
    <properties>
        <!-- 2.1.2版本以上支持纯净版客户端 -->
        <nacos.version>2.1.2</nacos.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>com.alibaba.nacos</groupId>
            <artifactId>nacos-client</artifactId>
            <version>${nacos.version}</version>
            <!-- 指定纯净版SDK -->
            <classifier>pure</classifier>
        </dependency>
        <!-- 使用纯净版时必须要引入同版本nacos-api和nacos-common，否则可能出现运行时找不到类的问题 -->
        <dependency>
            <groupId>${project.groupId}</groupId>
            <artifactId>nacos-common</artifactId>
            <version>${nacos.version}</version>
        </dependency>
        <dependency>
            <groupId>${project.groupId}</groupId>
            <artifactId>nacos-api</artifactId>
            <version>${nacos.version}</version>
        </dependency>
    </dependencies>
```

## 配置管理
### 获取配置
#### 描述

用于服务启动的时候从 Nacos 获取配置。
```java
public String getConfig(String dataId, String group, long timeoutMs) throws NacosException
```

#### 请求参数

| 参数名 | 参数类型 | 描述 |
| :--- | :--- | :--- |
| dataId | string | 配置 ID，采用类似 package.class（如com.taobao.tc.refund.log.level）的命名规则保证全局唯一性，class 部分建议是配置的业务含义。全部字符小写。只允许英文字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节。 |
| group | string | 配置分组，建议填写产品名:模块名（Nacos:Test）保证唯一性，只允许英文字符和4种特殊字符（"."、":"、"-"、"\_"），不超过128字节。 |
| timeout | long | 读取配置超时时间，单位 ms，推荐值 3000。 |


#### 返回值

| 参数类型 | 描述 |
| :--- | :--- |
| string | 配置值 |


#### 请求示例

```java
try {
	String serverAddr = "{serverAddr}";
	String dataId = "{dataId}";
	String group = "{group}";
	Properties properties = new Properties();
	properties.put("serverAddr", serverAddr);
	ConfigService configService = NacosFactory.createConfigService(properties);
	String content = configService.getConfig(dataId, group, 5000);
	System.out.println(content);
} catch (NacosException e) {
    // TODO Auto-generated catch block
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 监听配置
#### 描述

如果希望 Nacos 推送配置变更，可以使用 Nacos 动态监听配置接口来实现。

```java
public void addListener(String dataId, String group, Listener listener) 
```

#### 请求参数

<div class="bi-table">
  <table>
    <colgroup>
      <col width="auto" />
      <col width="auto" />
      <col width="auto" />
    </colgroup>
    <tbody>
      <tr>
        <td rowspan="1" colSpan="1">
          <div data-type="p">参数名</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">参数类型</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">描述</div>
        </td>
      </tr>
      <tr>
        <td rowspan="1" colSpan="1">
          <div data-type="p">dataId</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">string</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">配置 ID，采用类似 package.class（如com.taobao.tc.refund.log.level）的命名规则保证全局唯一性，class 部分建议是配置的业务含义。 全部字符小写。只允许英文字符和 4 种特殊字符（&quot;.&quot;、&quot;:&quot;、&quot;-&quot;、&quot;_&quot;）。不超过 256 字节。</div>
        </td>
      </tr>
      <tr>
        <td rowspan="1" colSpan="1">
          <div data-type="p">group</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">string</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">配置分组，建议填写<strong>产品名：模块名</strong>（如 Nacos:Test）保证唯一性。 只允许英文字符和4种特殊字符（&quot;.&quot;、&quot;:&quot;、&quot;-&quot;、&quot;_&quot;），不超过128字节。
          </div>
        </td>
      </tr>
      <tr>
        <td rowspan="1" colSpan="1">
          <div data-type="p">listener</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">Listener</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">监听器，配置变更进入监听器的回调函数。</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>


#### 返回值

| 参数类型 | 描述 |
| :--- | :--- |
| string | 配置值，初始化或者配置变更的时候通过回调函数返回该值。 |


#### 请求示例

```java
String serverAddr = "{serverAddr}";
String dataId = "{dataId}";
String group = "{group}";
Properties properties = new Properties();
properties.put("serverAddr", serverAddr);
ConfigService configService = NacosFactory.createConfigService(properties);
String content = configService.getConfig(dataId, group, 5000);
System.out.println(content);
configService.addListener(dataId, group, new Listener() {
	@Override
	public void receiveConfigInfo(String configInfo) {
		System.out.println("recieve1:" + configInfo);
	}
	@Override
	public Executor getExecutor() {
		return null;
	}
});

// 测试让主线程不退出，因为订阅配置是守护线程，主线程退出守护线程就会退出。 正式代码中无需下面代码
while (true) {
    try {
        Thread.sleep(1000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}
```

### 删除监听
#### 描述

取消监听配置，取消监听后配置不会再推送。

```java
public void removeListener(String dataId, String group, Listener listener)
```

#### 请求参数

| 参数名 | 参数类型 | 描述 |
| :--- | :--- | :--- |
| dataId | string | 配置 ID，采用类似 package.class（如com.taobao.tc.refund.log.level）的命名规则保证全局唯一性，class 部分建议是配置的业务含义。全部字符小写。只允许英文字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节。 |
| group | string | 配置分组 |
| listener | ConfigChangeListenerAdapter | 监听器，配置变更进入监听器的回调函数。 |


#### 使用示例

```java
String serverAddr = "{serverAddr}";
String dataId = "{dataId}";
String group = "{group}";
Properties properties = new Properties();
properties.put("serverAddr", serverAddr);
ConfigService configService = NacosFactory.createConfigService(properties);
configService.removeListener(dataId, group, yourListener);
```

### 发布配置
#### 描述

用于通过程序自动发布 Nacos 配置，以便通过自动化手段降低运维成本。

注意：创建和修改配置时使用的同一个发布接口，当配置不存在时会创建配置，当配置已存在时会更新配置。

```java
public boolean publishConfig(String dataId, String group, String content) throws NacosException;

@Since 1.4.1
public boolean publishConfig(String dataId, String group, String content, String type) throws NacosException;

```

#### 请求参数

| 参数名 | 参数类型 | 描述 |
| :--- | :--- | :--- |
| dataId | string | 配置 ID，采用类似 `package.class`（如 `com.taobao.tc.refund.log.level`）的命名规则保证全局唯一性。建议根据配置的业务含义来定义 class 部分。全部字符均为小写。只允许英文字符和 4 种特殊字符（“.”、“:”、“-”、“\_”），不超过 256 字节。 |
| group | string | 配置分组，建议填写`产品名:模块名`（如 Nacos`:Test`）来保证唯一性。只允许英文字符和 4 种特殊字符（“.”、“:”、“-”、“\_”），不超过 128 字节。 |
| content | string | 配置内容，不超过 100K 字节。 |
| type | string | @Since 1.4.1. 配置类型，见 `com.alibaba.nacos.api.config.ConfigType`，默认为TEXT |


#### 返回参数

| 参数类型 | 描述 |
| :--- | :--- |
| boolean | 是否发布成功 |


#### 请求示例

```java
try {
    // 初始化配置服务，控制台通过示例代码自动获取下面参数
	String serverAddr = "{serverAddr}";
	String dataId = "{dataId}";
	String group = "{group}";
	Properties properties = new Properties();
	properties.put("serverAddr", serverAddr);
    ConfigService configService = NacosFactory.createConfigService(properties);
	boolean isPublishOk = configService.publishConfig(dataId, group, "content");
	System.out.println(isPublishOk);
} catch (NacosException e) {
    // TODO Auto-generated catch block
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 删除配置
#### 描述

用于通过程序自动删除 Nacos 配置，以便通过自动化手段降低运维成本。

__注意：__ 当配置已存在时会删除该配置，当配置不存在时会直接返回成功消息。


```java
public boolean removeConfig(String dataId, String group) throws NacosException

```

#### 请求参数

| 参数名 | 参数类型 | 描述 |
| :--- | :--- | :--- |
| dataId | string | 配置 ID |
| group | string | 配置分组 |


#### 返回参数

| 参数类型 | 描述 |
| :--- | :--- |
| boolean | 是否删除成功 |


#### 请求示例

```java
try {
    // 初始化配置服务，控制台通过示例代码自动获取下面参数
	String serverAddr = "{serverAddr}";
	String dataId = "{dataId}";
	String group = "{group}";
	Properties properties = new Properties();
	properties.put("serverAddr", serverAddr);

	ConfigService configService = NacosFactory.createConfigService(properties);
	boolean isRemoveOk = configService.removeConfig(dataId, group);
	System.out.println(isRemoveOk);
} catch (NacosException e) {
    // TODO Auto-generated catch block
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。



## 服务发现SDK
### 注册实例
#### 描述注册一个实例到服务。
```java
void registerInstance(String serviceName, String ip, int port) throws NacosException;

void registerInstance(String serviceName, String ip, int port, String clusterName) throws NacosException;

void registerInstance(String serviceName, Instance instance) throws NacosException;
```

#### 请求参数

| 名称 | 类型 | 描述 |
| :--- | :--- | --- |
| serviceName | 字符串 | 服务名 |
| ip | 字符串 | 服务实例IP |
| port | int | 服务实例port |
| clusterName | 字符串 | 集群名 |
| instance | 参见代码注释 | 实例属性 |

#### 返回参数
无
#### 请求示例
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
naming.registerInstance("nacos.test.3", "11.11.11.11", 8888, "TEST1");

Instance instance = new Instance();
instance.setIp("55.55.55.55");
instance.setPort(9999);
instance.setHealthy(false);
instance.setWeight(2.0);
Map<String, String> instanceMeta = new HashMap<>();
instanceMeta.put("site", "et2");
instance.setMetadata(instanceMeta);

Service service = new Service("nacos.test.4");
service.setApp("nacos-naming");
service.sethealthCheckMode("server");
service.setEnableHealthCheck(true);
service.setProtectThreshold(0.8F);
service.setGroup("CNCF");
Map<String, String> serviceMeta = new HashMap<>();
serviceMeta.put("symmetricCall", "true");
service.setMetadata(serviceMeta);
instance.setService(service);

Cluster cluster = new Cluster();
cluster.setName("TEST5");
AbstractHealthChecker.Http healthChecker = new AbstractHealthChecker.Http();
healthChecker.setExpectedResponseCode(400);
healthChecker.setCurlHost("USer-Agent|Nacos");
healthChecker.setCurlPath("/xxx.html");
cluster.setHealthChecker(healthChecker);
Map<String, String> clusterMeta = new HashMap<>();
clusterMeta.put("xxx", "yyyy");
cluster.setMetadata(clusterMeta);

instance.setCluster(cluster);

naming.registerInstance("nacos.test.4", instance);
```

### 注销实例
#### 描述
删除服务下的一个实例。
```java
void deregisterInstance(String serviceName, String ip, int port) throws NacosException;

void deregisterInstance(String serviceName, String ip, int port, String clusterName) throws NacosException;
```

#### 请求参数

| 名称 | 类型 | 描述 |
| :--- | :--- | :--- |
| serviceName | 字符串 | 服务名 |
| ip | 字符串 | 服务实例IP |
| port | int | 服务实例port |
| clusterName | 字符串 | 集群名 |

#### 返回参数
无
#### 请求示例
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
naming.deregisterInstance("nacos.test.3", "11.11.11.11", 8888, "DEFAULT");
```
### 获取全部实例
#### 描述
获取服务下的所有实例。
```java
List<Instance> getAllInstances(String serviceName) throws NacosException;

List<Instance> getAllInstances(String serviceName, List<String> clusters) throws NacosException;
```

#### 请求参数

| 名称 | 类型 | 描述 |
| :--- | :--- | --- |
| serviceName | 字符串 | 服务名 |
| clusters | List | 集群列表 |

#### 返回参数
List&lt;Instance> 实例列表。
#### 请求示例
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
System.out.println(naming.getAllInstances("nacos.test.3"));
```

### 获取健康或不健康实例列表
#### 描述
根据条件获取过滤后的实例列表。
```java
List<Instance> selectInstances(String serviceName, boolean healthy) throws NacosException;

List<Instance> selectInstances(String serviceName, List<String> clusters, boolean healthy) throws NacosException;
```

#### 请求参数

| 名称 | 类型 | 描述 |
| :--- | :--- | --- |
| serviceName | 字符串 | 服务名 |
| clusters | List | 集群列表 |
| healthy | boolean | 是否健康 |

#### 返回参数
List&lt;Instance> 实例列表。
#### 请求示例
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
System.out.println(naming.selectInstances("nacos.test.3", true));
```

### 获取一个健康实例
#### 描述
根据负载均衡算法随机获取一个健康实例。
```java
Instance selectOneHealthyInstance(String serviceName) throws NacosException;

Instance selectOneHealthyInstance(String serviceName, List<String> clusters) throws NacosException;
```

#### 请求参数

| 名称 | 类型 | 描述 |
| :--- | :--- | --- |
| serviceName | 字符串 | 服务名 |
| clusters | List | 集群列表 |

#### 返回参数
Instance 实例。

#### 请求示例
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
System.out.println(naming.selectOneHealthyInstance("nacos.test.3"));
```

### 监听服务
#### 描述
监听服务下的实例列表变化。
```java
void subscribe(String serviceName, EventListener listener) throws NacosException;

void subscribe(String serviceName, List<String> clusters, EventListener listener) throws NacosException;
```

#### 请求参数

| 名称 | 类型 | 描述 |
| :--- | :--- | --- |
| serviceName | 字符串 | 服务名 |
| clusters | List | 集群列表 |
| listener | EventListener |  回调listener |

#### 返回参数
无

#### 请求示例
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
naming.subscribe("nacos.test.3", event -> {
    if (event instanceof NamingEvent) {
        System.out.println(((NamingEvent) event).getServceName());
        System.out.println(((NamingEvent) event).getInstances());
    }
});
```

### 取消监听服务
#### 描述
取消监听服务下的实例列表变化。
```java
void unsubscribe(String serviceName, EventListener listener) throws NacosException;

void unsubscribe(String serviceName, List<String> clusters, EventListener listener) throws NacosException;
```

#### 请求参数

| 名称 | 类型 | 描述 |
| :--- | :--- | --- |
| serviceName | 字符串 | 服务名 |
| clusters | List | 集群列表 |
| listener | EventListener |  回调listener |

#### 返回参数
无

#### 请求示例
```java

NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
naming.unsubscribe("nacos.test.3", event -> {});

```

## NacosClientProperties
### 介绍
从 `2.1.2` 开始引入了 `NacosClientProperties`, 一个类似于 `Spring Environment`用来统一管理客户端的各种配置项. 之前客户端的配置项散落3个地方: 用户传入的 Properties、命令行参数和环境变量. 这种没有一个统一的获取配置的入口,并且不方便做配置的隔离. 基于以上的问题,引入 `NacosClientProperties`.

### 特点
- 统一管理 Properties、命令行参数、环境变量和默认值
- 提供优先级搜索功能, 默认搜索顺序 `properties -> 命令行参数 -> 环境参数 -> 默认值`, 可通过调整优先级来调整搜索顺序, 默认是 `properties` 优先
- 配置隔离, 每个 `NacosClientProperties` 对象,除去全局性的配置互不影响.


### 如何使用
#### 相关概念
##### 优先级
默认优先级是 `properties`, 可通过以下2种方式来调整:
- (命令行参数)-Dnacos.env.first=PROPERTIES|JVM|ENV
- (环境变量)NACOS_ENV_FIRST=PROPERTIES|JVM|ENV

以上2种方式都指定的情况下,客户端优先使用命令行参数的方式获取优先级参数,若是通过命令行参数的方式没有获取到优先级参数则使用环境变量的方式获取优先级参数.如果以上2种方式都未指定优先级参数默认优先级为`properties`

默认优先级:
![default_order.png](/img/nacos_client_properties_default_order.png) 

优先级: PROPERTIES
![default_order.png](/img/nacos_client_properties_default_order.png) 

优先级: JVM
![jvm_order.png](/img/nacos_client_properties_jvm_order.png) 

优先级: ENV
![jvm_order.png](/img/nacos_client_properties_env_order.png) 

##### 搜索
`NacosClientProperties` 会按照指定优先级进行搜索配置, 以默认优先级(`PROPERTIES`)为例, 如果要获取一个 key 为
`key1`的值, 查找顺序如下:

![search_order.png](/img/nacos_client_properties_search_order.png) 

`NacosClientProperties` 会按照上图顺序搜索,直到查询到为止.

#### 配置隔离
为了应对多注册中心,多配置中心的场景, `NacosClientProperties` 引入配置隔离的概念. 在 `NacosClientProperties` 中总共有4个取值源, 分别是: 用户自定义的properties、命令行参数、 环境变量和默认值, 其中 `命令行参数、 环境变量和默认值` 
这3个是全局共享的无法做到隔离, 那么只剩下用户自定义的properties对象是可以进行隔离的, 每个 `NacosClientProperties` 对象中包含不同的 `Properties` 对象, 通过这种方法做到配置互不影响.

> 注意: 全局共享的配置: 命令行参数、 环境参数和默认值 一旦初始化完毕,后续使用无法更改,使用 `setProperty` 方法,也无法修改. `setProperty` 只能修改`NacosClientProperties` 对象中包含的 `Properties` 对象中的值

#### 配置派生
在配置隔离的概念之上又引入了配置派生的概念, 其目的是让配置能够继承.所有 `NacosClientProperties` 对象都是由 `NacosClientProperties.PROTOTYPE` 对象派生而来. 无法通过其他方式创建 `NacosClientProperties` 对象
```java
// global properties
NacosClientProperties.PROTOTYPE.setProperty("global-key1", "global-value1");

// properties1 
NacosClientProperties properties1 = NacosClientProperties.PROTOTYPE.derive();
properties1.setProperty("properties1-key1", "properties1-value1");

// properties2
NacosClientProperties properties2 = properties1.derive();
properties2.setProperty("properties2-key1", "properties2-value1");
```
以上代码如下图所示:
![derive.png](/img/nacos_client_properties_derive.png) 

那么搜索会怎么搜索呢? 以默认优先级(PROPERTIES)为例:
```java
// value == global-value1
String value = properties2.getProperty("global-key1");

```
![derive_search.png](/img/nacos_client_properties_derive_search.png) 



#### API
|方法名| 入参内容| 返回内容| 描述|
| -   | -      | -     | -  |
|getProperty| key: String | String  | 获取 key 对应的 value 值, 不存在返回 null|
|getProperty| key: String, default: String  | String | 获取 key 对应的 value 值, 不存在返回默认值|
|getBoolean | key: String | Boolean | 获取 key 对应的 Boolean 值, 不存在则返回 null |
|getBoolean | key: String, default: Boolean | Boolean | 获取 key 对应的 Boolean 值, 不存在返回默认值|
|getInteger | key: String | Integer | 获取 key 对应的 Integer 值, 不存在返回 null |
|getInteger | key: String, default: Integer | Integer | 获取 key 对应的 Integer 值, 不存在返回默认值|
|getLong    | key: String | Long    | 获取 key 对应的 Long 值, 不存在返回 null|
|getLong    | key: String, default: Long | Long | 获取 key 对应的 Long 值, 不存在返回默认值|
|setProperty| key: String, value: String | void | 设置 key-value 到 NacosClientProperties 对象中,已存的值会被覆盖|
|addProperties| properties: Properties | void | 添加 Properties 到 NacosClientProperties 对象中,已存在到值会被覆盖|
|containsKey| key: String | boolean | 判断是否包含指定 key 的值, 包含返回 true 否则 false|
|asProperties| void | Properties | 将 NacosClientProperties 对象转换为 Properties 对象|
|derive| void | NacosClientProperties | 创建一个继承父 NacosClientProperties 所有配置的 NacosClientProperties 对象, 内部包含一个空 Properties |
|derive| Properties | NacosClientProperties | 创建一个继承父 NacosClientProperties 所有配置的 NacosClientProperties 对象, 内部包含指定的 Properties 对象|