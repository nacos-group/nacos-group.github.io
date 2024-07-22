---
title: Java SDK 使用手册
keywords: [Java,SDK,使用手册]
description: 本文档介绍了Nacos的Java SDK(nacos-client)的使用方式，包括如何配置Nacos Client、如何使用Nacos Client、如何使用Nacos Client的API。
sidebar:
    order: 1
---

# Java SDK 使用手册

## 1. 引用概述

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
        <nacos.version>2.4.0</nacos.version>
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

## 2. 初始化SDK

Nacos 初始化SDK仅需要使用 `NacosFactory` 类进行不同模块的创建即可：

```java

String serverAddr = "localhost:8848";

# 初始化配置中心的Nacos Java SDK
ConfigService configService = NacosFactory.createConfigService(serverAddr);

# 初始化配置中心的Nacos Java SDK
NamingService namingService = NacosFactory.createNamingService(serverAddr);
```

如果初始化SDK时，还需要配置一些参数，可以使用 `Properties` 类进行配置：

```java

Properties properties = new Properties();
# 指定Nacos-Server的地址
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "localhost:8848");
# 指定Nacos-SDK的命名空间
properties.setProperty(PropertyKeyConst.NAMESPACE, "${namespaceId}");

# 初始化配置中心的Nacos Java SDK
ConfigService configService = NacosFactory.createConfigService(properties);

# 初始化配置中心的Nacos Java SDK
NamingService namingService = NacosFactory.createNamingService(properties);
```

更多初始化时所涉及的参数配置，请参考[Java SDK 配置参数](./properties.md)。

> 注意：一个Nacos Java SDK实例只能用于获取同一个命名空间下的配置和服务，如果要获取不同的命名空间下的配置或服务，需要创建不同的Nacos Java SDK实例。

## 3. 配置管理 API
### 3.1. 获取配置
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
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 3.2. 监听配置
#### 描述

如果希望 Nacos 推送配置变更，可以使用 Nacos 动态监听配置接口来实现。

```java
public void addListener(String dataId, String group, Listener listener) 
```

#### 请求参数

| 参数名 | 参数类型 | 描述                                                                                                                                             |
| :--- | :--- |:-----------------------------------------------------------------------------------------------------------------------------------------------|
| dataId | string | 配置 ID，采用类似 package.class（如com.taobao.tc.refund.log.level）的命名规则保证全局唯一性，class 部分建议是配置的业务含义。全部字符小写。只允许英文字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节。 |
| group | string | 配置分组，建议填写**产品名:模块名**（Nacos:Test）保证唯一性，只允许英文字符和4种特殊字符（"."、":"、"-"、"\_"），不超过128字节。                                                               |
| listener | Listener | 监听器，配置变更进入监听器的回调函数。                                                                                                                            |

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

### 3.3. 删除监听
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

### 3.4. 发布配置
#### 描述

用于通过程序自动发布 Nacos 配置，以便通过自动化手段降低运维成本。

注意：创建和修改配置时使用的同一个发布接口，当配置不存在时会创建配置，当配置已存在时会更新配置。

```java
public boolean publishConfig(String dataId, String group, String content) throws NacosException;

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
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 3.5. 删除配置
#### 描述

用于通过程序自动删除 Nacos 配置，以便通过自动化手段降低运维成本。

>注意: 当配置已存在时会删除该配置，当配置不存在时会直接返回成功消息。


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
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 3.6. 带监听器的获取配置

#### 描述

如果希望在程序首次启动获取配置时自行注册的Listener用于以后配置更新，建议您直接使用该接口。

> 该接口等价于先使用`getConfig`之后再使用`addListener`。

```java
String getConfigAndSignListener(String dataId, String group, long timeoutMs, Listener listener) throws NacosException;
```

#### 请求参数

| 参数名 | 参数类型 | 描述 |
| :--- | :--- | :--- |
| dataId | string | 配置 ID，采用类似 package.class（如com.taobao.tc.refund.log.level）的命名规则保证全局唯一性，class 部分建议是配置的业务含义。全部字符小写。只允许英文字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节。 |
| group | string | 配置分组，建议填写产品名:模块名（Nacos:Test）保证唯一性，只允许英文字符和4种特殊字符（"."、":"、"-"、"\_"），不超过128字节。 |
| timeout | long | 读取配置超时时间，单位 ms，推荐值 3000。 |
| listener | Listener | 监听器，配置变更进入监听器的回调函数。                                                                                                                            |

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
    String content = configService.getConfigAndSignListener(dataId, group, 5000, new Listener() {
        @Override
        public void receiveConfigInfo(String configInfo) {
            System.out.println("recieve1:" + configInfo);
        }
        @Override
        public Executor getExecutor() {
            return null;
        }
    });
    System.out.println(content);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 3.7. 带Compare-And-Swap（CAS）的发布配置

#### 描述

直接使用`publishConfig`进行配置发布时，可能存在不同进程间并发的配置覆盖问题，此时可以使用带Compare-And-Swap（CAS）的发布配置API，来保证不会此类情形。

注意：创建和修改配置时使用的同一个发布接口，当配置不存在时会创建配置，当配置已存在时会更新配置。

```java
boolean publishConfigCas(String dataId, String group, String content, String casMd5) throws NacosException;

boolean publishConfigCas(String dataId, String group, String content, String casMd5, String type) throws NacosException;
```

#### 请求参数

| 参数名 | 参数类型 | 描述                                                                                                                                                         |
| :--- | :--- |:-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| dataId | string | 配置 ID，采用类似 `package.class`（如 `com.taobao.tc.refund.log.level`）的命名规则保证全局唯一性。建议根据配置的业务含义来定义 class 部分。全部字符均为小写。只允许英文字符和 4 种特殊字符（“.”、“:”、“-”、“\_”），不超过 256 字节。 |
| group | string | 配置分组，建议填写`产品名:模块名`（如 Nacos`:Test`）来保证唯一性。只允许英文字符和 4 种特殊字符（“.”、“:”、“-”、“\_”），不超过 128 字节。                                                                    |
| content | string | 配置内容，不超过 100K 字节。                                                                                                                                          |
| casMd5 | string | 前配置内容的md5                                                                                                                                                  |
| type | string | 配置类型，见 `com.alibaba.nacos.api.config.ConfigType`，默认为TEXT                                                                                                   |

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
    String oldContent = "oldContent";
    String oldContentMd5 = "63fb636909f1ebad67110e49117e6de4";
    Properties properties = new Properties();
    properties.put("serverAddr", serverAddr);
    ConfigService configService = NacosFactory.createConfigService(properties);
    # 首次发布，casMd5传入null。
    boolean isPublishOk = configService.publishConfigCas(dataId, group, oldContent, null);
    System.out.println(isPublishOk);
    # old Md5 正确，变成成功
    isPublishOk = configService.publishConfigCas(dataId, group, "newContent", oldContentMd5);
    System.out.println(isPublishOk);
    # old Md5 错误，变成失败
    isPublishOk = configService.publishConfigCas(dataId, group, "newContent2", oldContentMd5);
    System.out.println(isPublishOk);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

## 4. 服务发现API
### 4.1. 注册实例
#### 描述
注册一个实例到服务。

> 由于同一个Nacos Client实例，仅能向一个服务注册一个实例；若同一个Nacos Client实例多次向同一个服务注册实例，后注册的实例将会覆盖先注册的实例。
> 若有存在代理注册的场景，请使用[批量注册服务实例](#48-批量注册服务实例)

```java
void registerInstance(String serviceName, String ip, int port) throws NacosException;

void registerInstance(String serviceName, String groupName, String ip, int port) throws NacosException;

void registerInstance(String serviceName, String ip, int port, String clusterName) throws NacosException;

void registerInstance(String serviceName, String groupName, String ip, int port, String clusterName) throws NacosException;

void registerInstance(String serviceName, Instance instance) throws NacosException;

void registerInstance(String serviceName, String groupName, Instance instance) throws NacosException;
```

#### 请求参数

| 名称          | 类型     | 描述       | 默认值           |
|:------------|:-------|----------|---------------|
| serviceName | 字符串    | 服务名      | 无，必填          |
| groupName   | 字符串    | 分组名      | DEFAULT_GROUP |
| ip          | 字符串    | 服务实例IP   | 无，必填          |
| port        | int    | 服务实例port | 无，必填          |
| clusterName | 字符串    | 集群名      | DEFAULT       |
| instance    | 参见代码注释 | 实例属性     | 无，必填          |

#### 返回参数
无
#### 请求示例
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));

# 以下注册请求所造成的结果均一致, 注册分组名为`DEFAULT_GROUP`, 服务名为`nacos.test.service`的实例，实例的ip为`127.0.0.1`, port为`8848`, clusterName为`DEFAULT`.
naming.registerInstance("nacos.test.service", "127.0.0.1", 8848);
naming.registerInstance("nacos.test.service", "DEFAULT_GROUP", "127.0.0.1", 8848);
naming.registerInstance("nacos.test.service", "127.0.0.1", 8848, "DEFAULT");
naming.registerInstance("nacos.test.service", "DEFAULT_GROUP", "127.0.0.1", 8848, "DEFAULT");
Instance instance = new Instance();
instance.setIp("127.0.0.1");
instance.setPort(8848);
instance.setClusterName("DEFAULT");
naming.registerInstance("nacos.test.service", instance);
naming.registerInstance("nacos.test.service", "DEFAULT_GROUP", instance);
```

### 4.2. 注销实例
#### 描述
删除服务下的一个实例。

> 若该服务是通过[批量注册服务实例](#48-批量注册服务实例)进行注册，使用注销实例进行注销时，将注销所有批量注册的实例。
> 若仅希望注销部分批量注册的实例，请使用[批量注销服务实例](#49-批量注销服务实例)

```java
void deregisterInstance(String serviceName, String ip, int port) throws NacosException;

void deregisterInstance(String serviceName, String groupName, String ip, int port) throws NacosException;

void deregisterInstance(String serviceName, String ip, int port, String clusterName) throws NacosException;

void deregisterInstance(String serviceName, String groupName, String ip, int port, String clusterName) throws NacosException;

void deregisterInstance(String serviceName, Instance instance) throws NacosException;

void deregisterInstance(String serviceName, String groupName, Instance instance);
```

#### 请求参数

| 名称          | 类型     | 描述       | 默认值           |
|:------------|:-------|----------|---------------|
| serviceName | 字符串    | 服务名      | 无，必填          |
| groupName   | 字符串    | 分组名      | DEFAULT_GROUP |
| ip          | 字符串    | 服务实例IP   | 无，必填          |
| port        | int    | 服务实例port | 无，必填          |
| clusterName | 字符串    | 集群名      | DEFAULT       |
| instance    | 参见代码注释 | 实例属性     | 无，必填          |

#### 返回参数
无
#### 请求示例
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
# 以下注销请求所造成的结果均一致, 注销分组名为`DEFAULT_GROUP`, 服务名为`nacos.test.service`的实例，实例的ip为`127.0.0.1`, port为`8848`, clusterName为`DEFAULT`.
naming.deregisterInstance("nacos.test.service", "127.0.0.1", 8848);
naming.deregisterInstance("nacos.test.service", "DEFAULT_GROUP", "127.0.0.1", 8848);
naming.deregisterInstance("nacos.test.service", "127.0.0.1", 8848, "DEFAULT");
naming.deregisterInstance("nacos.test.service", "DEFAULT_GROUP", "127.0.0.1", 8848, "DEFAULT");
Instance instance = new Instance();
instance.setIp("127.0.0.1");
instance.setPort(8848);
instance.setClusterName("DEFAULT");
naming.deregisterInstance("nacos.test.service", instance);
naming.deregisterInstance("nacos.test.service", "DEFAULT_GROUP", instance);
```

### 4.3. 获取全部实例
#### 描述
获取服务下的所有实例。
```java
List<Instance> getAllInstances(String serviceName) throws NacosException;

List<Instance> getAllInstances(String serviceName, String groupName) throws NacosException;

List<Instance> getAllInstances(String serviceName, boolean subscribe) throws NacosException;

List<Instance> getAllInstances(String serviceName, String groupName, boolean subscribe) throws NacosException;

List<Instance> getAllInstances(String serviceName, List<String> clusters) throws NacosException;

List<Instance> getAllInstances(String serviceName, String groupName, List<String> clusters) throws NacosException;

List<Instance> getAllInstances(String serviceName, List<String> clusters, boolean subscribe) throws NacosException;

List<Instance> getAllInstances(String serviceName, String groupName, List<String> clusters, boolean subscribe) throws NacosException;
```

#### 请求参数

| 名称          | 类型      | 描述                                                         | 默认值           |
|:------------|:--------|------------------------------------------------------------|---------------|
| serviceName | 字符串     | 服务名                                                        | 无，必填          |
| groupName   | 字符串     | 分组名                                                        | DEFAULT_GROUP |
| subscribe   | Boolean | 是否订阅服务，为true时将会订阅该服务，同时查询优先通过内存缓存；为false时将直接查询Nacos Server | true          |
| clusters    | 字符串列表   | 实例的clusterName，空列表时将查询所有实例。                                | 空列表           |

#### 返回参数
List&lt;Instance> 实例列表。
#### 请求示例
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
# 以下查询请求所造成的结果均一致.
System.out.println(naming.getAllInstances("nacos.test.service"));
System.out.println(naming.getAllInstances("nacos.test.service", "DEFAULT_GROUP"));
System.out.println(naming.getAllInstances("nacos.test.service", true));
System.out.println(naming.getAllInstances("nacos.test.service", "DEFAULT_GROUP", true));
System.out.println(naming.getAllInstances("nacos.test.service", new ArrayList<>()));
System.out.println(naming.getAllInstances("nacos.test.service", "DEFAULT_GROUP", new ArrayList<>()));
System.out.println(naming.getAllInstances("nacos.test.service", new ArrayList<>(), true));
System.out.println(naming.getAllInstances("nacos.test.service", "DEFAULT_GROUP", new ArrayList<>(), true));
```

### 4.4. 获取健康或不健康实例列表
#### 描述
根据条件获取过滤后的实例列表。
```java
List<Instance> selectInstances(String serviceName, boolean healthy) throws NacosException;

List<Instance> selectInstances(String serviceName, String groupName, boolean healthy) throws NacosException;

List<Instance> selectInstances(String serviceName, boolean healthy, boolean subscribe) throws NacosException;

List<Instance> selectInstances(String serviceName, String groupName, boolean healthy, boolean subscribe) throws NacosException;

List<Instance> selectInstances(String serviceName, List<String> clusters, boolean healthy) throws NacosException;

List<Instance> selectInstances(String serviceName, String groupName, List<String> clusters, boolean healthy) throws NacosException;

List<Instance> selectInstances(String serviceName, List<String> clusters, boolean healthy, boolean subscribe) throws NacosException;

List<Instance> selectInstances(String serviceName, String groupName, List<String> clusters, boolean healthy, boolean subscribe) throws NacosException;
```

#### 请求参数

| 名称          | 类型      | 描述                                                         | 默认值           |
|:------------|:--------|------------------------------------------------------------|---------------|
| serviceName | 字符串     | 服务名                                                        | 无，必填          |
| groupName   | 字符串     | 分组名                                                        | DEFAULT_GROUP |
| subscribe   | Boolean | 是否订阅服务，为true时将会订阅该服务，同时查询优先通过内存缓存；为false时将直接查询Nacos Server | true          |
| clusters    | 字符串列表   | 实例的clusterName，空列表时将查询所有实例。                                | 空列表           |
| healthy     | boolean | 是否健康，为true时仅会返回健康的实例列表，反之则返回不健康的实例列表。                      | true          |

#### 返回参数
List&lt;Instance> 实例列表。
#### 请求示例
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
# 以下查询请求所造成的结果均一致.
System.out.println(naming.selectInstances("nacos.test.service", true));
System.out.println(naming.selectInstances("nacos.test.service", "DEFAULT_GROUP", true));
System.out.println(naming.selectInstances("nacos.test.service", true, true));
System.out.println(naming.selectInstances("nacos.test.service", "DEFAULT_GROUP", true, true));
System.out.println(naming.selectInstances("nacos.test.service", new ArrayList<>(), true));
System.out.println(naming.selectInstances("nacos.test.service", "DEFAULT_GROUP", new ArrayList<>(), true));
System.out.println(naming.selectInstances("nacos.test.service", new ArrayList<>(), true, true));
System.out.println(naming.selectInstances("nacos.test.service", "DEFAULT_GROUP", new ArrayList<>(), true, true));
```

### 4.5. 获取一个健康实例
#### 描述
根据负载均衡算法随机获取一个健康实例。
```java
Instance selectOneHealthyInstance(String serviceName) throws NacosException;

Instance selectOneHealthyInstance(String serviceName, String groupName) throws NacosException;

Instance selectOneHealthyInstance(String serviceName, boolean subscribe) throws NacosException;

Instance selectOneHealthyInstance(String serviceName, String groupName, boolean subscribe) throws NacosException;

Instance selectOneHealthyInstance(String serviceName, List<String> clusters) throws NacosException;

Instance selectOneHealthyInstance(String serviceName, String groupName, List<String> clusters) throws NacosException;

Instance selectOneHealthyInstance(String serviceName, List<String> clusters, boolean subscribe) throws NacosException;

Instance selectOneHealthyInstance(String serviceName, String groupName, List<String> clusters, boolean subscribe) throws NacosException;
```

#### 请求参数

| 名称          | 类型      | 描述                                                         | 默认值           |
|:------------|:--------|------------------------------------------------------------|---------------|
| serviceName | 字符串     | 服务名                                                        | 无，必填          |
| groupName   | 字符串     | 分组名                                                        | DEFAULT_GROUP |
| subscribe   | Boolean | 是否订阅服务，为true时将会订阅该服务，同时查询优先通过内存缓存；为false时将直接查询Nacos Server | true          |
| clusters    | 字符串列表   | 实例的clusterName，空列表时将查询所有实例。                                | 空列表           |


#### 返回参数
Instance 实例。

#### 请求示例
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
# 以下查询请求所造成的结果均一致.
System.out.println(naming.selectOneHealthyInstance("nacos.test.service"));
System.out.println(naming.selectOneHealthyInstance("nacos.test.service", "DEFAULT_GROUP"));
System.out.println(naming.selectOneHealthyInstance("nacos.test.service", true));
System.out.println(naming.selectOneHealthyInstance("nacos.test.service", "DEFAULT_GROUP", true));
System.out.println(naming.selectOneHealthyInstance("nacos.test.service", new ArrayList<>()));
System.out.println(naming.selectOneHealthyInstance("nacos.test.service", "DEFAULT_GROUP", new ArrayList<>()));
System.out.println(naming.selectOneHealthyInstance("nacos.test.service", new ArrayList<>(), true));
System.out.println(naming.selectOneHealthyInstance("nacos.test.service", "DEFAULT_GROUP", new ArrayList<>(), true));
```

### 4.6. 监听服务
#### 描述
监听服务下的实例列表变化。
```java
void subscribe(String serviceName, EventListener listener) throws NacosException;

void subscribe(String serviceName, String groupName, EventListener listener) throws NacosException;

void subscribe(String serviceName, List<String> clusters, EventListener listener) throws NacosException;

void subscribe(String serviceName, String groupName, List<String> clusters, EventListener listener) throws NacosException;
```

#### 请求参数

| 名称          | 类型            | 描述                          | 默认值           |
|:------------|:--------------|-----------------------------|---------------|
| serviceName | 字符串           | 服务名                         | 无，必填          |
| groupName   | 字符串           | 分组名                         | DEFAULT_GROUP |
| clusters    | 字符串列表         | 实例的clusterName，空列表时将查询所有实例。 | 空列表           |
| listener    | EventListener | 回调listener                  | 无，必填          |

#### 返回参数
无

#### 请求示例
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
EventListener serviceListener = event -> {
    if (event instanceof NamingEvent) {
        System.out.println(((NamingEvent) event).getServiceName());
        System.out.println(((NamingEvent) event).getInstances());
    }
};
naming.subscribe("nacos.test.service", serviceListener);
naming.subscribe("nacos.test.service", "DEFAULT_GROUP", serviceListener);
naming.subscribe("nacos.test.service", new ArrayList<>(), serviceListener);
naming.subscribe("nacos.test.service", "DEFAULT_GROUP", new ArrayList<>(), serviceListener);
```

#### 使用自定义线程池进行异步监听

Nacos 支持使用自定义线程池进行异步监听回调，只需要将`EventListener`更换为`AbstractEventListener`，并实现`Executor getExecutor()`方法来返回自定义的线程池，Nacos Client将在服务发生变更时使用该线程池进行异步回调。

```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
ExecutorService executorService = Executors.newFixedThreadPool(1);
EventListener serviceListener = new AbstractEventListener() {
    @Override
    public void onEvent(Event event) {
        if (event instanceof NamingEvent) {
            System.out.println(((NamingEvent) event).getServiceName());
            System.out.println(((NamingEvent) event).getInstances());
        }
    }
    
    @Override
    public Executor getExecutor() {
        return executorService;
    }
};
naming.subscribe("nacos.test.service", serviceListener);
```

#### 监听服务变化的差值

Nacos 从2.4.0版本你开始，支持监听服务变化的差值，即和之前相比，有哪些实例被新增，移除和修改，只需要将`EventListener`更换为`AbstractNamingChangeListener`，实现`onChange`方法即可。`onChange`中会传入`NamingChangeEvent`,其中`InstancesDiff`记录了此次通知和之前相比的实例变化。

同时为了防止差值的错误和异常，`NamingChangeEvent`仍然可以通过`getInstances`方法获取最终的服务实例列表。

```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
ExecutorService executorService = Executors.newFixedThreadPool(1);
EventListener serviceListener = new AbstractNamingChangeListener() {
    @Override
    public void onChange(NamingChangeEvent event) {
        if (event.isAdded()) {
            System.out.println(event.getAddedInstances());
        }
        if (event.isRemoved()) {
            System.out.println(event.getRemovedInstances());
        }
        if (event.isModified()) {
            System.out.println(event.getModifiedInstances());
        }
    }
    
    @Override
    public Executor getExecutor() {
        return executorService;
    }
};
naming.subscribe("nacos.test.service", serviceListener);
```

### 4.7. 取消监听服务
#### 描述
取消监听服务下的实例列表变化。
```java
void unsubscribe(String serviceName, EventListener listener) throws NacosException;

void unsubscribe(String serviceName, String groupName, EventListener listener) throws NacosException;

void unsubscribe(String serviceName, List<String> clusters, EventListener listener) throws NacosException;

void unsubscribe(String serviceName, String groupName, List<String> clusters, EventListener listener) throws NacosException;
```

#### 请求参数

| 名称          | 类型            | 描述                          | 默认值           |
|:------------|:--------------|-----------------------------|---------------|
| serviceName | 字符串           | 服务名                         | 无，必填          |
| groupName   | 字符串           | 分组名                         | DEFAULT_GROUP |
| clusters    | 字符串列表         | 实例的clusterName，空列表时将查询所有实例。 | 空列表           |
| listener    | EventListener | 回调listener                  | 无，必填          |

> 注意：取消监听服务时，需要使用进行订阅时的`listener`进行取消监听，否则可能造成取消监听失败。

#### 返回参数
无

#### 请求示例
```java

NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
EventListener serviceListener = event -> {};
naming.subscribe("nacos.test.service", serviceListener);
naming.unsubscribe("nacos.test.service", serviceListener);
naming.unsubscribe("nacos.test.service", "DEFAULT_GROUP", serviceListener);
naming.unsubscribe("nacos.test.service", new ArrayList<>(), serviceListener);
naming.unsubscribe("nacos.test.service", "DEFAULT_GROUP", new ArrayList<>(), serviceListener);
```

### 4.8. 批量注册服务实例

#### 描述

注册一系列实例到指定服务。

> 由于同一个Nacos Client实例，仅能向一个服务注册一个实例；若同一个Nacos Client实例多次向同一个服务注册实例，后注册的实例将会覆盖先注册的实例。
> 考虑到社区存在代理注册的场景：如Nacos-Sync， Proxy-Registry等，需要在一个客户端中注册同一个服务的不同实例，社区新增了批量注册服务实例的功能。

```java
void batchRegisterInstance(String serviceName, String groupName, List<Instance> instances) throws NacosException;
```

#### 请求参数

| 名称          | 类型            | 描述     | 默认值           |
|:------------|:--------------|--------|---------------|
| serviceName | 字符串           | 服务名    | 无，必填          |
| groupName   | 字符串           | 分组名    | DEFAULT_GROUP |
| instances   | Instance的List | 服务实例列表 | 无，必填          |

#### 返回参数
无
#### 请求示例
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));

Instance instance1 = new Instance();
instance1.setIp("127.0.0.1");
instance1.setPort(8848);
instance1.setClusterName("DEFAULT");

Instance instance2 = new Instance();
instance2.setIp("127.0.0.1");
instance2.setPort(9848);
instance2.setClusterName("DEFAULT");

List<Instance> instances = new ArrayList<>(2);
instances.add(instance1);
instances.add(instance2);

naming.batchRegisterInstance("nacos.test.service", "DEFAULT_GROUP", instances);
```

### 4.9. 批量注销服务实例

#### 描述

从指定服务中注销一系列实例。

> 针对使用了批量注册服务实例的用户设计，允许用户选择一部分或全部批量注册的实例进行注销。

```java
void batchDeregisterInstance(String serviceName, String groupName, List<Instance> instances) throws NacosException;
```

#### 请求参数

| 名称          | 类型            | 描述     | 默认值           |
|:------------|:--------------|--------|---------------|
| serviceName | 字符串           | 服务名    | 无，必填          |
| groupName   | 字符串           | 分组名    | DEFAULT_GROUP |
| instances   | Instance的List | 服务实例列表 | 无，必填          |

#### 返回参数
无
#### 请求示例
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));

Instance instance1 = new Instance();
instance1.setIp("127.0.0.1");
instance1.setPort(8848);
instance1.setClusterName("DEFAULT");

Instance instance2 = new Instance();
instance2.setIp("127.0.0.1");
instance2.setPort(9848);
instance2.setClusterName("DEFAULT");

List<Instance> instances = new ArrayList<>(2);
instances.add(instance1);
instances.add(instance2);

naming.batchRegisterInstance("nacos.test.service", "DEFAULT_GROUP", instances);
naming.batchDeregisterInstance("nacos.test.service", "DEFAULT_GROUP", instances);
```

### 4.10. 带选择器的监听服务

#### 描述

使用自定义逻辑的选择器，监听服务下的实例列表变化，当服务列表发生变化时，会使用自定义的选择器进行过滤，当过滤后的数据仍然有变化时，才会进行回调通知。

```java
void subscribe(String serviceName, NamingSelector selector, EventListener listener) throws NacosException;

void subscribe(String serviceName, String groupName, NamingSelector selector, EventListener listener) throws NacosException;
```

#### 请求参数

| 名称          | 类型             | 描述                          | 默认值           |
|:------------|:---------------|-----------------------------|---------------|
| serviceName | 字符串            | 服务名                         | 无，必填          |
| groupName   | 字符串            | 分组名                         | DEFAULT_GROUP |
| clusters    | 字符串列表          | 实例的clusterName，空列表时将查询所有实例。 | 空列表           |
| selector    | NamingSelector | 自定义的数据选择器                   | 无，必填          |
| listener    | EventListener  | 回调listener                  | 无，必填          |

#### 返回参数
无

#### 请求示例
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
EventListener serviceListener = event -> {
    if (event instanceof NamingEvent) {
        System.out.println(((NamingEvent) event).getServiceName());
        System.out.println(((NamingEvent) event).getInstances());
    }
};
# 只会选择订阅ip为`127.0`开头的实例。
NamingSelector selector = NamingSelectorFactory.newIpSelector("127.0.*");
naming.subscribe("nacos.test.service", "DEFAULT_GROUP", selector, serviceListener);

```

#### 预设提供的数据选择器

Nacos Client 提供了预设的多种数据选择器以供默认场景下使用：
1. Cluster选择器，`NamingSelectorFactory.newClusterSelector(Collection<String> clusters)`, 当订阅服务时传入了`clusters`参数，Nacos Client将自动使用该数据选择器。
2. Ip选择器，`NamingSelectorFactory.newClusterSelector(String ipRegex)`，当实例的ip满足传入的ipRegex时，才会被通知回调。
3. 元数据选择器，`NamingSelectorFactory.newMetadataSelector(Map<String, String> metadata)`，当实例的元数据包含**所有**传入选择器的metadata时，才会被通知回调。
4. 任意元数据选择器，`NamingSelectorFactory.newMetadataSelector(Map<String, String> metadata, false)`,当实例的元数据包含**任意一对**传入选择器的metadata时，才会被通知回调。

#### 开发自定义数据选择器

多数情况下， 开发自定义数据选择器只需要创建`DefaultNamingSelector`即可，在构建时传入一个`Predicate<Instance> filter`作为单个实例是否满足您过滤条件的结果，类似Java中stream的filter方法，如此您仅需要考虑单个实例的过滤条件即可。

若是`DefaultNamingSelector`无法满足需求，您需要实现`NamingSelector`接口，根据传入的`NamingContext`进行复杂的逻辑校验，最后输出`NamingResult`给Nacos Client。

### 4.11. 取消带选择器的监听服务

#### 描述

使用自定义逻辑的选择器进行监听服务下的实例列表变化，那么在取消监听时需要使用`取消带选择器的监听服务`的API才能正确取消监听。

> 注意：取消监听时需要传入监听时使用的selector和listener，否则可能导致取消监听失败。

```java
void unsubscribe(String serviceName, NamingSelector selector, EventListener listener) throws NacosException;

void unsubscribe(String serviceName, String groupName, NamingSelector selector, EventListener listener) throws NacosException;
```

#### 请求参数

| 名称          | 类型             | 描述                          | 默认值           |
|:------------|:---------------|-----------------------------|---------------|
| serviceName | 字符串            | 服务名                         | 无，必填          |
| groupName   | 字符串            | 分组名                         | DEFAULT_GROUP |
| clusters    | 字符串列表          | 实例的clusterName，空列表时将查询所有实例。 | 空列表           |
| selector    | NamingSelector | 自定义的数据选择器                   | 无，必填          |
| listener    | EventListener  | 回调listener                  | 无，必填          |

#### 返回参数
无

#### 请求示例
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
EventListener serviceListener = event -> {
    if (event instanceof NamingEvent) {
        System.out.println(((NamingEvent) event).getServiceName());
        System.out.println(((NamingEvent) event).getInstances());
    }
};
# 只会选择订阅ip为`127.0`开头的实例。
NamingSelector selector = NamingSelectorFactory.newIpSelector("127.0.*");
naming.subscribe("nacos.test.service", "DEFAULT_GROUP", selector, serviceListener);
naming.unsubscribe("nacos.test.service", "DEFAULT_GROUP", selector, serviceListener);

```

### 4.12. 分页获取服务列表

#### 描述

通过分页的方式获取当前客户端所在命名空间的服务列表

```java
ListView<String> getServicesOfServer(int pageNo, int pageSize) throws NacosException;

ListView<String> getServicesOfServer(int pageNo, int pageSize, String groupName) throws NacosException;
```

> 注意，使用`AbstractSelector`的`getServicesOfServer`方法已废弃，请勿继续使用。

#### 请求参数

| 名称        | 类型  | 描述         | 默认值           |
|:----------|:----|------------|---------------|
| pageNo    | int | 分页序号       | 无，必填          |
| pageSize  | int | 分页中每页的服务个数 | 无，必填          |
| groupName | 字符串 | 分组名        | DEFAULT_GROUP |

#### 返回参数
服务名列表: ListView<String>

#### 请求示例
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
# 等价于`naming.getServicesOfServer(1, 10, "DEFAULT_GROUP");`
ListView<String> result = naming.getServicesOfServer(1, 10);
System.out.println(result.getCount());
System.out.println(result.getData());
```

### 4.13. 获取当前客户端所监听的服务列表

#### 描述

获取当前客户端所的所有服务列表

```java
List<ServiceInfo> getSubscribeServices() throws NacosException;
```

#### 请求参数

无

#### 返回参数
服务列表: List<ServiceInfo>

#### 请求示例
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
System.out.println(naming.getSubscribeServices());
```

## 5. Java SDK的生命周期

Nacos的Java SDK 生命周期从创建时开始，到调用`shutdown()`方法时结束，期间对应创建的线程池、连接等均会始终保留，及时连接断开，也会不断重试重新建立连接。

因此在使用时需要注意应用中创建的Nacos Java SDK的实例个数，避免造成线程池和连接的泄漏，在更换Nacos Java SDK实例时，切记调用`shutdown()`方法，同时在应用中应尽量复用同一个Nacos Java SDK实例，避免频繁的初始化实例。
