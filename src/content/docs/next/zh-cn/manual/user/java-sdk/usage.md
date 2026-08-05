---
title: Java SDK 使用手册
keywords: [Java,SDK,使用手册]
description: 本文档介绍了Nacos的Java SDK(nacos-client)的使用方式，包括如何配置Nacos Client、如何使用Nacos Client、如何使用Nacos Client的API。
sidebar:
    order: 2
---

# Java SDK 使用手册

Nacos 的 Java SDK（或称Nacos-Java-Client），是一个针对 Nacos 配置中心、服务注册中心、分布式锁等场景的 Java SDK。旨在为Java的微服务或分布式应用提供稳定易用的配置中心、服务注册中心、分布式锁等功能，方便开发者访问Nacos进行配置、服务和分布式锁的操作。

因为Nacos-Java-Client的定位，所以Nacos-Java-Client会提供配置、服务实例的`发布`，`删除`,`获取`,`订阅`以及分布式锁的获取和释放，但不提供大范围的数据获取，如`列举命名空间下所有配置列表`, `列举命名空间下所有服务列表`等操作。

如果需要大范围的获取数据，或者需要具有更高优先级的更新数据等`运维能力`，您需要使用Nacos的`运维SDK`。

## 0. 使用前说明

### 0.1. 先选择合适的接入方式

| 你要做什么 | 推荐入口 |
| --- | --- |
| 在 Java 应用中读取配置、监听配置、注册实例、订阅服务。 | 使用本文介绍的 Java SDK。 |
| 在 Java 应用中查询或订阅 MCP、Agent、Skill、Prompt、AgentSpec 等 AI 资源。 | 使用本文 AI 相关章节，并先阅读 [AI 管理中心概述](../ai/ai-registry-overview.md)。 |
| 在 Go、Python 或其他语言中接入 Nacos。 | 阅读 [SDK 概览](../overview/other-language.md)，选择对应语言 SDK。 |
| 理解连接、重连、本地缓存、failover 和生命周期。 | 阅读 [SDK 运行时](../sdk/runtime-guide.md)。 |
| 通过 HTTP 查询少量已知配置或服务。 | 使用[客户端 API](../open-api.md)。 |
| 发布配置、查询列表、管理命名空间、管理服务或执行运维操作。 | 使用[运维 API](../../admin/admin-api.md)或[运维 SDK](../../admin/maintainer-sdk.md)。 |

Java SDK 面向应用运行时。它会维护连接、监听、订阅、本地缓存和重连恢复。业务应用应优先复用 SDK 提供的能力，不建议直接拼接内部请求或依赖控制台 API。

### 0.2. 使用原则

- 一个 SDK 实例对应一个命名空间。访问多个命名空间时，请分别创建实例。
- 应用内尽量复用 SDK 实例，避免频繁创建客户端导致连接和线程资源浪费。
- 应用退出、热重载或替换客户端实例时，请调用 `shutdown()` 释放资源。
- 配置监听收到的是变更通知。业务需要重新读取配置内容，并按自己的逻辑完成刷新。
- 服务订阅返回的是运行时发现视图，可能受到健康状态、权重、保护阈值、cluster 和 selector 等因素影响。
- AI 资源受命名空间、版本、标签、发布状态和可见性影响。生产环境中使用 MCP、Agent、Skill、Prompt 等支持版本或标签的资源时，建议明确版本或标签，并处理资源不存在、不可见或版本变化的情况。
- AI 资源订阅收到的是变更通知。业务需要重新读取 MCP、Agent、Skill、Prompt 或 AgentSpec 内容，并按自己的运行时模型完成刷新或降级。
- 分布式锁属于实验性功能，生产使用前请先阅读[分布式锁文档](../../../experimental/distributed-lock.md)并完成充分验证。

## 1. 引用概述

### 1.1. Java 版本依赖

Nacos 的 Java SDK需要 JDK 1.8 及以上版本的Java运行环境。

### 1.2. Maven 坐标
```
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-client</artifactId>
    <version>${version}</version>
</dependency>
```

#### 1.2.1. 纯净版 Java SDK

> 注意：由于Nacos Java SDK在2.0版本后引入了gRPC，为了避免用户业务引入的gRPC版本不同导致冲突，使用了shaded技术将部分依赖直接封装进nacos-client中，导致nacos-client较大。
> 如果用户未自行引入gRPC或确认版本无冲突，希望使用纯净版的nacos-client以减小依赖，可以使用classifier来指定使用纯净版。

```xml
    <properties>
        <!-- 2.1.2版本以上支持纯净版客户端 -->
        <nacos.version>3.2.0</nacos.version>
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

### 1.3. 升级兼容性

3.x 将默认命名空间 ID 从空字符串改为 `public`（参见 [issue #9846](https://github.com/alibaba/nacos/issues/9846)）。3.0 客户端默认使用 `public`，在默认命名空间下连接老版本服务端时会不兼容。

升级前请确认：**服务端已升级至 3.0 及以上**，或**未在默认命名空间下使用配置中心**。

## 2. 初始化SDK

Nacos 初始化SDK仅需要使用 `NacosFactory` 类进行不同模块的创建即可：

```java

String serverAddr = "localhost:8848";

// 初始化配置中心的Nacos Java SDK
ConfigService configService = NacosFactory.createConfigService(serverAddr);

// 初始化注册中心的Nacos Java SDK
NamingService namingService = NacosFactory.createNamingService(serverAddr);

// 分布式锁的Nacos Java SDK不支持仅传入serverAddr进行初始化，请使用Properties进行。
```

如果初始化SDK时，还需要配置一些参数，可以使用 `Properties` 类进行配置：

```java

Properties properties = new Properties();
// 指定Nacos-Server的地址
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "localhost:8848");
// 指定Nacos-SDK的命名空间
properties.setProperty(PropertyKeyConst.NAMESPACE, "${namespaceId}");

// 初始化配置中心的Nacos Java SDK
ConfigService configService = NacosFactory.createConfigService(properties);

// 初始化注册中心的Nacos Java SDK
NamingService namingService = NacosFactory.createNamingService(properties);

// 初始化分布式锁的Nacos Java SDK
LockService lockService = NacosLockFactory.createLockService(properties);
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
    // 首次发布，casMd5传入null。
    boolean isPublishOk = configService.publishConfigCas(dataId, group, oldContent, null);
    System.out.println(isPublishOk);
    // old Md5 正确，变成成功
    isPublishOk = configService.publishConfigCas(dataId, group, "newContent", oldContentMd5);
    System.out.println(isPublishOk);
    // old Md5 错误，变成失败
    isPublishOk = configService.publishConfigCas(dataId, group, "newContent2", oldContentMd5);
    System.out.println(isPublishOk);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。



### 3.8. 配置模糊订阅

#### 描述

通过fuzzyWatch接口可以对指定分组group和配置dataId规则的配置进行批量订阅，
可通过*进行前缀模糊，后缀模糊，双边模糊匹配。
<br/>模糊订阅功能仅会推送配置的新增以及删除事件，并不会直接推送配置变更的内容，可在配置模糊订阅的监听器中结合addListener接口实现配置内容的变更监听。<br/>
处于稳定性考虑，Nacos对模糊订阅的规则数量以及单个规则匹配的配置数量有上限保护。具体参照[配置模糊订阅容量保护机制](#配置模糊订阅容量保护机制)一节。

```java

/**
 * 订阅当前命名空间下指定分组group规则及dataId规则下所有配置的变更事件
 * 模糊订阅的列表将以异步的方式通过watcher回调
 * @param dataIdPattern dataId匹配规则
 * @param groupNamePattern 分组匹配规则
 * @param watcher  模糊订阅监听器
 */
void fuzzyWatch(String dataIdPattern, String groupNamePattern, FuzzyWatchEventWatcher watcher);

/**
 * 订阅当前命名空间下指定分组group规则及dataId规则下所有配置的变更事件,并以Future模式获取规则当前匹配的配置列表
 * 模糊订阅的列表将以异步的方式通过watcher回调
 * @param dataIdPattern dataId匹配规则
 * @param groupNamePattern 分组group匹配规则
 * @param watcher  模糊订阅监听器
 * @return Future 可通过future等待配置异步推送结果                
 */
Future<Set<String>> fuzzyWatchWithGroupKeys(String dataIdPattern, String groupNamePattern,
		FuzzyWatchEventWatcher watcher) throws NacosException;


/**
 * 取消订阅当前命名空间下指定分组group规则及dataId规则下所有配置的变更事件
 * @param dataIdPattern   dataId匹配规则
 * @param groupNamePattern 分组group匹配规则
 * @param watcher      需要移除的模糊订阅watcher
 */
void cancelFuzzyWatch(String dataIdPattern, String groupNamePattern, FuzzyWatchEventWatcher watcher);


/**
 * 订阅当前命名空间下指定分组group规则下所有配置的变更事件
 *
 * @param groupNamePattern 分组匹配规则
 * @param watcher  模糊订阅监听器
 */
void fuzzyWatch(String groupNamePattern, FuzzyWatchEventWatcher watcher) throws NacosException;

/**
 * 订阅当前命名空间下指定分组group规则下所有配置的变更事件，可通过Future获取当前匹配的所有配置列表
 *
 * @param groupNamePattern 分组group匹配规则
 * @param watcher  模糊订阅监听器
 * @return Future 可通过future等待配置异步推送结果
 */
Future<Set<String>> fuzzyWatchWithGroupKeys(String groupNamePattern,
		FuzzyWatchEventWatcher watcher) throws NacosException;

/**
 * 取消订阅当前命名空间下指定分组group规则及dataId规则下所有配置的变更事件
 *
 * @param groupNamePattern 分组group匹配规则
 * @param watcher    需要移除的模糊订阅watcher
 */
void cancelFuzzyWatch(String groupNamePattern, FuzzyWatchEventWatcher watcher) ;


```

#### 请求参数

| 参数名 | 参数类型 | 描述                                                                              |
| :--- | :--- |:--------------------------------------------------------------------------------|
| dataIdPattern | string | 配置ID匹配规则，支持a.前缀模糊匹配(如,mydataId\*) b.后缀模糊匹配(如*mydatdId)，c.双边模糊匹配(如\*mydatadId\*) |
| groupNamePattern | string | 配置分组匹配规则，支持a.前缀模糊匹配(如 mygroup*) b.后缀模糊匹配(如 \*mygroup)，c.双边模糊匹配(如 \*mygroup\*)        |      |
| watcher | FuzzyWatchEventWatcher | 模糊订阅监听器                                                                         |


#### FuzzyWatchEventWatcher模糊订阅监听器
| 方法名 | 方法参数类型 | 描述                                                                      |
| :--- | :--- |:------------------------------------------------------------------------|
| onEvent | ConfigFuzzyWatchChangeEvent | 模糊订阅回调事件对象 |
| getExecutor | void | 可指定执行回调事件的线程池，如果为空，将以nacos推送线程中执行回调  |      |

#### ConfigFuzzyWatchChangeEvent模糊订阅事件
| 参数名         | 参数类型   | 描述                                                                                                              |
|:------------|:-------|:----------------------------------------------------------------------------------------------------------------|
| dataId      | string | 变更的配置dataId                                                                                                     |
| group       | string | 变更的配置分组group                                                                                                    |      |
| namespace   | string | 变更的配命名空间                                                                                                        |
| changedType | string | 变更类型，表示客户端接收到的配置变更类型，包含ADD_CONFIG-新增配置，DELETE_CONFIG-移除配置                                                       |
| syncType    | string | 触发变更的类型，包含FUZZY_WATCH_INIT_NOTIFY-初始化推送，FUZZY_WATCH_DIFF_SYNC_NOTIFY-变更对账触发，FUZZY_WATCH_RESOURCE_CHANGED-配置变更推送 |



#### 返回参数

| 参数类型 | 描述                                                                                         |
| :--- |:-------------------------------------------------------------------------------------------|
| Future<Set<String>> | 返可获取当前匹配的配置列表的future对象，当规则匹配的配置列表已经推送到客户端时，可通过future对象获取配置列表<br/>*注意：当触发容量保护时，返回的配置列表可能不全 |
```java
//返回的参数为groupKey列表，可通过GroupKey工具类获取dataId，group及namespace
String[] groupKeyItems = GroupKey.parseKey(String groupKey);
String dataId=groupKeyItems[0];
String group=groupKeyItems[1];
String namespace=groupKeyItems[2];
```
#### 配置模糊订阅容量保护机制

处于稳定性角度考虑，避免过多的规则及规则匹配的配置数量导致服务端内存压力以及对客户端造成推送风暴，Nacos在两个层面对模糊订阅功能设计了容量保护机制，当超过上限时，模糊订阅的推送将被抑制。<br/>
1. 模糊订阅规则数量上限保护 ,默认的模糊订阅规则数量上限为20,可通过参数nacos.config.fuzzy.watch.max.pattern.count调整上限。
2. 单个模糊订阅规则匹配的配置数量上限保护， 默认单个模糊订阅规则匹配的配置数量上限为500，可通过nacos.config.fuzzy.watch.max.pattern.match.config.count调整上限。

在fuzzyWatch接口中注册模糊订阅监听器可同时实现FuzzyWatchLoadWatcher负载监听器感知容量保护机制的发生。
#### FuzzyWatchLoadWatcher模糊订阅负载监听器
| 方法名  | 描述                                |
| :--- |:----------------------------------|
| onPatternOverLimit | 当前模糊订阅规则因超过上限，推送被抑制时触发            |
| onConfigReachUpLimit | 当前模糊订阅规则匹配的配置数量达到上限，推送被抑制时触发      |

*注意：
1.  当触发容量保护时，通过fuzzyWatchWithGroupKeys返回的配置列表可能不是完整的配置列表。
2.  当触发配置数量上限保护时，配置删除的事件也可能因保护机制而导致无法推送。


#### 请求示例

```java
try {
    // 初始化配置服务，控制台通过示例代码自动获取下面参数
    String serverAddr = "{serverAddr}";
    String dataIdPattern = "testDataId*";
    String groupPattern = "group*";
    Properties properties = new Properties();
    properties.put("serverAddr", serverAddr);
    properties.put("namespace", "mynamespaceId");

    ConfigService configService = NacosFactory.createConfigService(properties);
    Future<Set<String>> fuzzyWatchFuture = configService.fuzzyWatchWithGroupKeys(dataIdPattern, groupPattern, new AbstractFuzzyWatchEventWatcher() {
                        @Override
                        public void onEvent(ConfigFuzzyWatchChangeEvent event) {
                            String changedType= event.getChangedType();
                            String syncType= event.getSyncType();
                            String groupChanged = event.getGroup();
                            String dataIdChanged = event.getDataId();
                            String namespace = event.getNamespace();
                            //do something
                        }

                        @Override
                        public void onPatternOverLimit() {
			    System.out.println("pattern count over limit");
			    //do something...
                        }

                        @Override
                        public void onConfigReachUpLimit() {
			    System.out.println("pattern match config count reach to up limit");
			    //do something...
                        }
    });

    Set<String> matchGroupKeys = fuzzyWatchFuture.get();
    System.out.println("get group keys count:"+matchGroupKeys.size());

} catch (NacosException e) {
    e.printStackTrace();
}
```

### 3.9. 获取配置（含结果对象）

#### 描述

用于从 Nacos 获取配置并得到包含配置内容与 MD5 等元数据的结果对象，便于后续 CAS 发布等操作。该 API 的起始版本为 3.0。

```java
ConfigQueryResult getConfigWithResult(String dataId, String group, long timeoutMs) throws NacosException;
```

#### 请求参数

| 参数名 | 参数类型 | 描述 |
| :--- | :--- | :--- |
| dataId | string | 配置 ID，采用类似 package.class 的命名规则保证全局唯一性，只允许英文字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节。 |
| group | string | 配置分组，建议填写产品名:模块名保证唯一性，只允许英文字符和 4 种特殊字符，不超过 128 字节。 |
| timeoutMs | long | 读取配置超时时间，单位 ms，推荐值 3000。 |

#### 返回值

| 参数类型 | 描述 |
| :--- | :--- |
| ConfigQueryResult | 包含配置内容（content）、MD5（md5）等字段，可用于 [带 CAS 的发布配置](#37-带compare-and-swapcas的发布配置)。 |

#### 请求示例

```java
try {
    String serverAddr = "{serverAddr}";
    String dataId = "{dataId}";
    String group = "{group}";
    Properties properties = new Properties();
    properties.put("serverAddr", serverAddr);
    ConfigService configService = NacosFactory.createConfigService(properties);
    ConfigQueryResult result = configService.getConfigWithResult(dataId, group, 5000);
    String content = result.getContent();
    String md5 = result.getMd5();
    System.out.println(content);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常时，抛出 NacosException。

### 3.10. 获取服务端状态

#### 描述

获取当前配置中心服务端状态。

```java
String getServerStatus();
```

#### 请求参数

无。

#### 返回值

| 参数类型 | 描述 |
| :--- | :--- |
| String | 服务端状态。 |

#### 请求示例

```java
ConfigService configService = NacosFactory.createConfigService("{serverAddr}");
String status = configService.getServerStatus();
System.out.println(status);
```

### 3.11. 添加配置过滤器

#### 描述

添加配置过滤器，用于在获取/发布配置时对请求或响应进行过滤。建议通过继承 `com.alibaba.nacos.api.config.filter.AbstractConfigFilter` 扩展过滤器。该 API 的起始版本为 2.3.0。

```java
void addConfigFilter(IConfigFilter configFilter);
```

#### 请求参数

| 参数名 | 参数类型 | 描述 |
| :--- | :--- | :--- |
| configFilter | IConfigFilter | 配置过滤器实例，建议使用 AbstractConfigFilter 子类。 |

#### 返回值

无。

#### 请求示例

```java
ConfigService configService = NacosFactory.createConfigService("{serverAddr}");
configService.addConfigFilter(new AbstractConfigFilter() {
    @Override
    public void init(Properties properties) {}
    @Override
    public void doFilter(IConfigRequest request, IConfigResponse response, IConfigFilterChain chain) throws NacosException {
        // 过滤逻辑
        chain.doFilter(request, response);
    }
    @Override
    public int getOrder() { return 0; }
    @Override
    public String getFilterName() { return "myFilter"; }
});
```


## 4. 服务发现API

> **学习提示**：使用服务发现 API 注册实例时，客户端进程退出后 Nacos 会将该实例摘除，控制台将看不到刚注册的实例。学习或调试时可在注册后使用 `Thread.sleep()` 等方式保持进程运行，以便在 Nacos 控制台确认注册是否成功。

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

// 以下注册请求所造成的结果均一致, 注册分组名为`DEFAULT_GROUP`, 服务名为`nacos.test.service`的实例，实例的ip为`127.0.0.1`, port为`8848`, clusterName为`DEFAULT`.
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

// 保持进程不退出，便于在 Nacos 控制台查看已注册的实例（学习/调试用）
Thread.sleep(300000); // 例如保持 5 分钟
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
// 以下注销请求所造成的结果均一致, 注销分组名为`DEFAULT_GROUP`, 服务名为`nacos.test.service`的实例，实例的ip为`127.0.0.1`, port为`8848`, clusterName为`DEFAULT`.
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
// 以下查询请求所造成的结果均一致.
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
// 以下查询请求所造成的结果均一致.
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
// 以下查询请求所造成的结果均一致.
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
// 只会选择订阅ip为`127.0`开头的实例。
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
// 只会选择订阅ip为`127.0`开头的实例。
NamingSelector selector = NamingSelectorFactory.newIpSelector("127.0.*");
naming.subscribe("nacos.test.service", "DEFAULT_GROUP", selector, serviceListener);
naming.unsubscribe("nacos.test.service", "DEFAULT_GROUP", selector, serviceListener);

```

### 4.12. 分页获取服务列表

#### 描述

通过分页的方式获取当前客户端所在命名空间的服务列表。

```java
ListView<String> getServicesOfServer(int pageNo, int pageSize) throws NacosException;

ListView<String> getServicesOfServer(int pageNo, int pageSize, String groupName) throws NacosException;
```

> **注意**：带 `AbstractSelector` 的 `getServicesOfServer` 方法已废弃，不建议使用，本文档不再列出；后续会在 API 定义中标记为 `@Deprecated`。请仅使用上述两参数或三参数重载。

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
// 等价于`naming.getServicesOfServer(1, 10, "DEFAULT_GROUP");`
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



### 4.14. 服务模糊订阅

#### 描述

通过fuzzyWatch接口可以对符指定group和serviceName规则的服务进行批量订阅， 可通过*进行前缀模糊，后缀模糊，双边模糊匹配。
<br/>模糊订阅功能仅会推送服务的新增以及删除事件，并不会直接推送服务下实例列表，可在服务模糊订阅的监听器中结合subscribe接口实现服务下实例列表的变更监听。<br/>
处于稳定性考虑，Nacos对模糊订阅的规则数量以及单个规则匹配的服务数量有上限保护。具体参照[服务模糊容量保护机制](#服务模糊订阅容量保护机制)一节。

```java

/**
 * 订阅当前命名空间下指定分组group规则及服务名规则下所有服务的变更事件
 *
 * @param serviceNamePattern 服务名匹配规则
 * @param groupNamePattern 分组匹配规则
 * @param watcher  模糊订阅监听器
 */
void fuzzyWatch(String serviceNamePattern, String groupNamePattern, FuzzyWatchEventWatcher watcher)
		throws NacosException;

/**
 * 订阅当前命名空间下指定分组group规则及服务serviceName规则下所有服务的变更事件,并以Future模式获取规则当前匹配的服务列表
 * 模糊订阅的列表将以异步的方式通过watcher回调
 * @param serviceNamePattern 服务serviceName匹配规则
 * @param groupNamePattern 分组group匹配规则
 * @param watcher  模糊订阅监听器
 * @return Future 可通过future等待配置异步推送结果                
 */
Future<ListView<String>> fuzzyWatchWithServiceKeys(String serviceNamePattern, String groupNamePattern,
		FuzzyWatchEventWatcher watcher) throws NacosException;


/**
 * 取消订阅当前命名空间下指定分组group规则下所有服务的变更事件
 * @param serviceNamePattern   服务匹配规则
 * @param groupNamePattern 分组group匹配规则
 * @param watcher      需要移除的模糊订阅watcher
 */
void cancelFuzzyWatch(String serviceNamePattern, String groupNamePattern, FuzzyWatchEventWatcher watcher);


/**
 * 订阅当前命名空间下指定分组group规则下所有服务的变更事件
 *
 * @param groupNamePattern 分组匹配规则
 * @param watcher  模糊订阅监听器
 */
void fuzzyWatch(String groupNamePattern, FuzzyWatchEventWatcher watcher) throws NacosException;

/**
 * 订阅当前命名空间下指定分组group规则下所有服务的变更事件，可通过Future获取当前匹配的所有服务列表
 *
 * @param groupNamePattern 分组group匹配规则
 * @param watcher  模糊订阅监听器
 * @return Future 可通过future等待配置异步推送结果
 */
Future<ListView<String>> fuzzyWatchWithServiceKeys(String groupNamePattern,
		FuzzyWatchEventWatcher watcher) throws NacosException;

/**
 * 取消订阅当前命名空间下指定分组group规则及服务规则下所有配置的服务事件
 *
 * @param groupNamePattern 分组group匹配规则
 * @param watcher    需要移除的模糊订阅watcher
 */
void cancelFuzzyWatch(String groupNamePattern, FuzzyWatchEventWatcher watcher) ;


```

#### 请求参数

| 参数名 | 参数类型 | 描述                                                                           |
| :--- | :--- |:-----------------------------------------------------------------------------|
| serviceNamePattern | string | 服务名匹配规则，支持a.前缀模糊匹配(如,myservice*) b.后缀模糊匹配(如\*service)，c.双边模糊匹配(如\*service\*) |
| groupNamePattern | string | 配置分组匹配规则，支持a.前缀模糊匹配(如 mygroup*) b.后缀模糊匹配(如 \*mygroup)，c.双边模糊匹配(如 \*mygroup\*)     |      |
| watcher | FuzzyWatchEventWatcher | 模糊订阅监听器                                                                      |


#### FuzzyWatchEventWatcher模糊订阅监听器
| 方法名 | 方法参数类型 | 描述                                                                      |
| :--- | :--- |:------------------------------------------------------------------------|
| onEvent | FuzzyWatchChangeEvent | 模糊订阅回调事件对象 |
| getExecutor | void | 可指定执行回调事件的线程池，如果为空，将以nacos推送线程中执行回调  |      |

#### FuzzyWatchChangeEvent模糊订阅事件
| 参数名         | 参数类型   | 描述                                                                                                                      |
|:------------|:-------|:------------------------------------------------------------------------------------------------------------------------|
| serviceName | string | 变更的服务名                                                                                                                  |
| groupName   | string | 变更的服务分组group                                                                                                            |      |
| namespace   | string | 变更的命名空间                                                                                                                 |
| changedType | string | 变更类型，表示客户端接收到的服务变更类型，包含ADD_SERVICE-新增服务，DELETE_SERVICE-移除服务                                                             |
| syncType    | string | 触发变更的类型，包含FUZZY_WATCH_INIT_NOTIFY-初始化推送已存在的服务列表，FUZZY_WATCH_DIFF_SYNC_NOTIFY-变更对账触发，FUZZY_WATCH_RESOURCE_CHANGED-服务变更推送 |



#### 返回参数

| 参数类型 | 描述                                                                                      |
| :--- |:----------------------------------------------------------------------------------------|
| Future<ListView<String>> | 返回当前匹配的服务列表的future对象，当规则匹配的服务列表已经推送到客户端时，可通过future对象获取服务列表<br/>*注意：当触发容量保护时，返回的服务列表可能不全 |
```java
//返回的参数为serviceKey列表，可通过NamingUtils工具类获取serviceName，groupName及namespace
 String[] serviceKeyItems = NamingUtils.parseServiceKey(serviceKey);
 String namespace = serviceKeyItems[0];
 String groupName = serviceKeyItems[1];
 String serviceName = serviceKeyItems[2];
```
#### 服务模糊订阅容量保护机制

处于稳定性角度考虑，避免过多的规则及规则匹配的服务数量导致服务端内存压力以及对客户端造成推送风暴，Nacos在两个层面对模糊订阅功能设计了容量保护机制，当超过上限时，模糊订阅的推送将被抑制。<br/>
1. 模糊订阅规则数量上限保护 ,默认的模糊订阅规则数量上限为20,可通过参数nacos.naming.fuzzy.watch.max.pattern.count调整上限。
2. 单个模糊订阅规则匹配的服务数量上限保护， 默认单个模糊订阅规则匹配的配置数量上限为500，可通过nacos.naming.fuzzy.watch.max.pattern.match.service.count调整上限。

在fuzzyWatch接口中注册模糊订阅监听器可同时实现FuzzyWatchLoadWatcher负载监听器感知容量保护机制的发生。
#### FuzzyWatchLoadWatcher模糊订阅负载监听器
| 方法名  | 描述                           |
| :--- |:-----------------------------|
| onPatternOverLimit | 当前模糊订阅规则因超过上限，推送被抑制时触发       |
| onServiceReachUpLimit | 当前模糊订阅规则匹配的服务数量达到上限，推送被抑制时触发 |

*注意：
1.  当触发容量保护时，通过fuzzyWatchWithServiceKeys返回的服务列表可能不是完整的服务列表。
2.  当触发服务数量上限保护时，服务下线的事件也可能因保护机制而导致无法推送。


#### 请求示例

```java
try {
		// 初始化配置服务，控制台通过示例代码自动获取下面参数
		String serverAddr = "{serverAddr}";
		String serviceNamePattern = "service*";
		String groupPattern = "group*";
		Properties properties = new Properties();
		properties.put("serverAddr", serverAddr);
		properties.put("namespace", "mynamespaceId");

		Future<ListView<String>> future = namingService.fuzzyWatchWithServiceKeys(serviceNamePattern, groupPattern, new AbstractFuzzyWatchEventWatcher() {
@Override
public void onEvent(FuzzyWatchChangeEvent event) {
		System.out.println(event.toString());
		}

@Override
public void onPatternOverLimit() {
		System.out.println("pattern service over limit ");

		}

@Override
public void onServiceReachUpLimit() {
		System.out.println("pattern service over limit ");
		}
		});
		} catch (NacosException e) {
		e.printStackTrace();
		}
```

### 4.15. 获取服务端状态

#### 描述

获取当前服务注册与发现服务端状态。

```java
String getServerStatus();
```

#### 请求参数

无。

#### 返回值

| 参数类型 | 描述 |
| :--- | :--- |
| String | 服务端状态。 |

#### 请求示例

```java
NamingService naming = NacosFactory.createNamingService("{serverAddr}");
String status = naming.getServerStatus();
System.out.println(status);
```

## 5. 分布式锁API

:::note
分布式锁功能于3.0版本中添加，目前功能还处于实验性阶段，功能生态还未完善，可能存在一定的问题，请谨慎使用。
:::

> 分布式锁功能目前版本还缺少对应的运维API和监听对应锁的API，将在后续版本中添加支持。

### 5.1. 获取分布式锁

#### 描述

通过此接口可以尝试获取分布式锁，如果获取失败，则返回false，如果获取成功，则返回true。

```java
Boolean lock(LockInstance instance) throws NacosException;
```

#### 请求参数

| 名称       | 类型           | 描述         | 默认值  |
|:---------|:-------------|------------|------|
| instance | LockInstance | 分布式锁的锁对象实例 | 无，必填 |

LockInstance对象中包含如下参数：

| 名称          | 类型                 | 描述                                               | 默认值  |
|:------------|:-------------------|--------------------------------------------------|------|
| key         | String             | 分布式锁的唯一key，同一类型的锁若key相同时，则认为期望获取同一把锁             | 无，必填 |
| expiredTime | long               | 分布式锁的过期时间，单位为毫秒，0表示取到锁后立刻释放，若设置的值小于0，将使用默认值30000 | 0    |
| params      | Map<String,String> | 自定义参数，用于扩展锁的自定义属性                                | 无    |
| lockType    | String             | 分布式锁类型，目前仅支持"NACOS_LOCK"                         | 无    |

> Nacos 目前提供一个默认实现的锁类型，即"NACOS_LOCK"，可通过`new NLock()`进行快速创建，后续会支持更多类型的锁。

#### 返回参数

获取锁的结果`Boolean`，如果获取锁成功，则返回`true`，否则返回`false`。

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
LockService lockService = NacosLockFactory.createLockService(properties);
NLock nLock = new NLock("testLock", 5000L);
try {
     if (lockService.lock(nLock)) {
        System.out.printf("try to lock `testLock` successfully.");
     } else {
        System.out.printf("try to lock `testLock` failed, please retry later.");
     } 
} catch (NacosException e) {
    e.printStackTrace();
} finally {
    System.out.printf("try to unlock `testLock`, result: " + lockService.unLock(nLock));
}
```

### 5.2. 释放分布式锁

#### 描述

通过此接口可以释放获取到的分布式锁，如果释放成功，则返回true，否则返回false。

```java
Boolean unLock(LockInstance instance) throws NacosException;
```

#### 请求参数

| 名称       | 类型           | 描述         | 默认值  |
|:---------|:-------------|------------|------|
| instance | LockInstance | 分布式锁的锁对象实例 | 无，必填 |

LockInstance对象中包含如下参数：

| 名称          | 类型                 | 描述                                               | 默认值  |
|:------------|:-------------------|--------------------------------------------------|------|
| key         | String             | 分布式锁的唯一key，同一类型的锁若key相同时，则认为期望获取同一把锁             | 无，必填 |
| expiredTime | long               | 分布式锁的过期时间，单位为毫秒，0表示取到锁后立刻释放，若设置的值小于0，将使用默认值30000 | 0    |
| params      | Map<String,String> | 自定义参数，用于扩展锁的自定义属性                                | 无    |
| lockType    | String             | 分布式锁类型，目前仅支持"NACOS_LOCK"                         | 无    |

> Nacos 目前提供一个默认实现的锁类型，即"NACOS_LOCK"，可通过`new NLock()`进行快速创建，后续会支持更多类型的锁。

#### 返回参数

释放锁的结果`Boolean`，如果获取锁成功，则返回`true`，否则返回`false`。

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
LockService lockService = NacosLockFactory.createLockService(properties);
NLock nLock = new NLock("testLock", 5000L);
try {
     if (lockService.lock(nLock)) {
        System.out.printf("try to lock `testLock` successfully.");
     } else {
        System.out.printf("try to lock `testLock` failed, please retry later.");
     } 
} catch (NacosException e) {
    e.printStackTrace();
} finally {
    System.out.printf("try to unlock `testLock`, result: " + lockService.unLock(nLock));
}
```

### 5.3. 远程尝试获取分布式锁

#### 描述

通过此接口可以直接发起远程加锁请求尝试获取分布式锁，语义与`lock`一致，获取成功返回`true`，否则返回`false`。

```java
Boolean remoteTryLock(LockInstance instance) throws NacosException;
```

#### 请求参数

| 名称       | 类型           | 描述         | 默认值  |
|:---------|:-------------|------------|------|
| instance | LockInstance | 分布式锁的锁对象实例 | 无，必填 |

#### 返回参数

远程尝试加锁结果`Boolean`，获取成功返回`true`，否则返回`false`。

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
LockService lockService = NacosLockFactory.createLockService(properties);
NLock nLock = new NLock("testLock", 5000L);
try {
    Boolean lockResult = lockService.remoteTryLock(nLock);
    System.out.printf("remote try lock result: " + lockResult);
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 5.4. 远程释放分布式锁

#### 描述

通过此接口可以直接发起远程解锁请求释放分布式锁，释放成功返回`true`，否则返回`false`。

```java
Boolean remoteReleaseLock(LockInstance instance) throws NacosException;
```

#### 请求参数

| 名称       | 类型           | 描述         | 默认值  |
|:---------|:-------------|------------|------|
| instance | LockInstance | 分布式锁的锁对象实例 | 无，必填 |

#### 返回参数

远程解锁结果`Boolean`，释放成功返回`true`，否则返回`false`。

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
LockService lockService = NacosLockFactory.createLockService(properties);
NLock nLock = new NLock("testLock", 5000L);
try {
    Boolean lockResult = lockService.remoteTryLock(nLock);
    if (lockResult) {
        System.out.printf("remote try lock success, begin release.");
        Boolean releaseResult = lockService.remoteReleaseLock(nLock);
        System.out.printf("remote release result: " + releaseResult);
    }
} catch (NacosException e) {
    e.printStackTrace();
}
```

## 6. MCP 服务

### 6.1. 查询MCP 服务

#### 描述

通过此接口可以查询指定的MCP服务详细信息，其中包含了MCP服务的元信息和可调用的Endpoint信息。未指定版本时，查询最新的已发布版本。

```java
McpServerDetailInfo getMcpServer(String mcpName) throws NacosException;

McpServerDetailInfo getMcpServer(String mcpName, String version) throws NacosException;
```

#### 请求参数

| 名称      | 类型     | 描述      | 默认值             |
|:--------|:-------|---------|-----------------|
| mcpName | String | MCP服务名称 | 无，必填            |
| version | String | MCP服务版本 | 空，当填入为空时，查询最新的已发布版本 |

#### 返回参数

MCP服务详细信息 `McpServerDetailInfo` 

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
try {
    McpServerDetailInfo detailInfo = aiService.getMcpServer(mcpName, null);
    System.out.println(JacksonUtils.toJson(detailInfo));
} catch (Exception e) {
    e.printStackTrace();
}
```

### 6.2. 发布新版本MCP服务

#### 描述

通过此接口可以发布新的MCP服务版本，若MCP服务为首次发布，则会创建新的MCP服务。

当MCP服务及指定版本已存在时，该请求保持幂等，不会重复创建或修改已有版本。


```java
String releaseMcpServer(McpServerBasicInfo serverSpecification, McpToolSpecification toolSpecification) throws NacosException;

String releaseMcpServer(McpServerBasicInfo serverSpecification, McpToolSpecification toolSpecification, McpResourceSpecification resourceSpecification) throws NacosException;

String releaseMcpServer(McpServerBasicInfo serverSpecification, McpToolSpecification toolSpecification, McpEndpointSpec endpointSpecification) throws NacosException;

String releaseMcpServer(McpServerBasicInfo serverSpecification, McpToolSpecification toolSpecification, McpResourceSpecification resourceSpecification, McpEndpointSpec endpointSpecification) throws NacosException;
```

#### 请求参数

| 名称                    | 类型                       | 描述                  | 默认值  |
|:----------------------|:-------------------------|---------------------|------|
| serverSpecification   | McpServerBasicInfo       | MCP服务基本信息           | 无，必填 |
| toolSpecification     | McpToolSpecification     | MCP服务工具信息           | 无，必填 |
| resourceSpecification | McpResourceSpecification | MCP服务资源和资源模板信息      | 无，可选 |
| endpointSpecification | McpEndpointSpec          | MCP服务Endpoint信息     | 无，可选 |

#### 返回参数

MCP服务的ID `String`.

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
try {
    McpServerBasicInfo serverSpecification = buildMcpSeverSpec(mcpName, version, isLatest);
    McpToolSpecification toolSpecification = buildTools();
    System.out.println(aiService.releaseMcpServer(serverSpecification, toolSpecification));

    McpResourceSpecification resourceSpecification = buildResources();
    System.out.println(aiService.releaseMcpServer(serverSpecification, toolSpecification, resourceSpecification, null));
} catch (Exception e) {
    e.printStackTrace();
}
```

### 6.3. 注册MCP服务的Endpoint

#### 描述

注册MCP服务Endpoint到指定MCP服务版本中。

当注册的MCP服务不存在时，会抛出服务不存在的异常。

```java
void registerMcpServerEndpoint(String mcpName, String address, int port) throws NacosException;

void registerMcpServerEndpoint(String mcpName, String address, int port, String version) throws NacosException;
```

#### 请求参数

| 名称      | 类型     | 描述              | 默认值                      |
|:--------|:-------|-----------------|--------------------------|
| mcpName | String | MCP服务名称         | 无，必填                     |
| address | String | MCP服务Endpoint地址 | 无，必填                     |
| port    | int    | MCP服务Endpoint端口 | 无，必填                     |
| version | String | MCP服务版本         | 空，当填入为空时，注册Endpoint到最新版本 |

#### 返回参数

无

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
try {
    aiService.registerMcpServerEndpoint(mcpName, "127.0.0.1", 8848, version);
} catch (Exception e) {
    e.printStackTrace();
}
```

### 6.4. 注销MCP服务的Endpoint

#### 描述

注销MCP服务Endpoint到指定MCP服务版本中。

```java
void deregisterMcpServerEndpoint(String mcpName, String address, int port) throws NacosException;
```

#### 请求参数

| 名称      | 类型     | 描述              | 默认值  |
|:--------|:-------|-----------------|------|
| mcpName | String | MCP服务名称         | 无，必填 |
| address | String | MCP服务Endpoint地址 | 无，必填 |
| port    | int    | MCP服务Endpoint端口 | 无，必填 |

#### 返回参数

无

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
try {
    aiService.deregisterMcpServerEndpoint(mcpName, "127.0.0.1", 8848);
} catch (Exception e) {
    e.printStackTrace();
}
```

### 6.5. 订阅MCP 服务

#### 描述

订阅MCP服务，当MCP服务发布新版本时，会收到通知。

> 当前版本的订阅是通过轮询查询实现的，可能通知有一定的延迟，可以通过配置`nacosAiMcpServerCacheUpdateInterval`参数来调整查询间隔，默认为10000ms。

```java
McpServerDetailInfo subscribeMcpServer(String mcpName, AbstractNacosMcpServerListener mcpServerListener) throws NacosException;

McpServerDetailInfo subscribeMcpServer(String mcpName, String version, AbstractNacosMcpServerListener mcpServerListener) throws NacosException;
```

#### 请求参数

| 名称       | 类型                             | 描述       | 默认值             |
|:---------|:-------------------------------|----------|-----------------|
| mcpName  | String                         | MCP服务名称  | 无，必填            |
| version  | String                         | MCP服务版本  | 空，当填入为空时，订阅最新版本 |
| listener | AbstractNacosMcpServerListener | MCP服务监听器 | 无，必填            |

#### 返回参数

订阅成功时，返回当前MCP服务详细信息 `McpServerDetailInfo`.

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
try {
    ExampleListener listener = new ExampleListener(i);
    aiService.subscribeMcpServer(mcpName, listener);
} catch (Exception e) {
    e.printStackTrace();
}
```

```java
private static class ExampleListener extends AbstractNacosMcpServerListener {
    
    private final int id;
    
    private ExampleListener(int id) {
        this.id = id;
    }
    
    @Override
    public void onEvent(NacosMcpServerEvent event) {
        System.out.printf("---------------mcp server listener %s called start---------------%n", id);
        System.out.printf("mcp server namespaceId: %s, mcpId: %s, mcpName: %s%n", event.getNamespaceId(),
                event.getMcpId(), event.getMcpName());
        System.out.println("mcp server endpoint: " + JacksonUtils.toJson(
                event.getMcpServerDetailInfo().getBackendEndpoints()));
        System.out.println(
                "mcp server tools size: " + event.getMcpServerDetailInfo().getToolSpec().getTools().size());
        System.out.println("mcp server version: " + event.getMcpServerDetailInfo().getVersionDetail().getVersion());
        System.out.printf("---------------mcp server listener %s called end---------------%n", id);
    }
}
```

### 6.6. 取消订阅MCP 服务

#### 描述

取消订阅MCP服务。取消订阅时传入的监听器`mcpServerListener`必须和订阅时一致，否则会导致取消订阅失败。

```java
void unsubscribeMcpServer(String mcpName, AbstractNacosMcpServerListener mcpServerListener) throws NacosException;

void unsubscribeMcpServer(String mcpName, String version, AbstractNacosMcpServerListener mcpServerListener) throws NacosException;
```

#### 请求参数

| 名称       | 类型                             | 描述       | 默认值               |
|:---------|:-------------------------------|----------|-------------------|
| mcpName  | String                         | MCP服务名称  | 无，必填              |
| version  | String                         | MCP服务版本  | 空，当填入为空时，取消订阅最新版本 |
| listener | AbstractNacosMcpServerListener | MCP服务监听器 | 无，必填              |

#### 返回参数

无

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
try {
    ExampleListener listener = new ExampleListener(i);
    aiService.subscribeMcpServer(mcpName, listener);
    aiService.unsubscribeMcpServer(mcpName, listener);
} catch (Exception e) {
    e.printStackTrace();
}
```

## 7. A2A 注册中心

### 7.1. 查询AgentCard

#### 描述

查询AgentCard。

```java
AgentCardDetailInfo getAgentCard(String agentName) throws NacosException;

AgentCardDetailInfo getAgentCard(String agentName, String version) throws NacosException;

AgentCardDetailInfo getAgentCard(String agentName, String version, String registrationType) throws NacosException;
```

#### 请求参数

| 名称               | 类型     | 描述      | 默认值                                          |
|:-----------------|:-------|---------|----------------------------------------------|
| agentName        | String | Agent名称 | 无，必填                                         |
| version          | String | Agent版本 | 空，当填入为空时，查询最新版本                              |
| registrationType | String | 注册方式    | 空，当填入为空时，根据注册时的`registrationType`自动进行`url`装填 |

#### 返回参数

查询成功时，返回当前AgentCard详细信息 `AgentCardDetailInfo`.

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
try {
    AgentCardDetailInfo result = aiService.getAgentCard(agentName);
    result = aiService.getAgentCard(agentName, "1.0.0");
    result = aiService.getAgentCard(agentName, "1.0.0", "url");
} catch (Exception e) {
    e.printStackTrace();
}
```

### 7.2. 发布新版本AgentCard

#### 描述

发布新版本AgentCard。发布失败时抛出异常。

```java
void releaseAgentCard(AgentCard agentCard) throws NacosException;

void releaseAgentCard(AgentCard agentCard, String registrationType) throws NacosException;

void releaseAgentCard(AgentCard agentCard, String registrationType, boolean setAsLatest) throws NacosException;
```

#### 请求参数

| 名称               | 类型        | 描述                                                                                                                     | 默认值       |
|:-----------------|:----------|------------------------------------------------------------------------------------------------------------------------|-----------|
| agentCard        | AgentCard | AgentCard信息                                                                                                            | 无，必填      |
| registrationType | String    | 注册方式，可选值为`URL`和`SERVICE`，默认为`URL`，设置此AgentCard默认的`url`获取方式，`URL`代表直接读取注册时的`url`，`SERVICE`代表根据注册在Nacos中的endpoint生成`url` | `SERVICE` |
| setAsLatest      | boolean   | 是否设置此AgentCard为最新版本                                                                                                    | `false`   |


#### 返回参数

无

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
try {
    AgentCard agentCard = new AgentCard();
    agentCard.setName("test");
    agentCard.setDescription("test for agent card");
    agentCard.setUrl("http://localhost:8848");
    agentCard.setVersion("1.0.0");
    agentCard.setProtocolVersion("0.3.0");
    aiService.releaseAgentCard(agentCard);
    aiService.releaseAgentCard(agentCard, "SERVICE");
    aiService.releaseAgentCard(agentCard, "SERVICE", false);
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 7.3. 注册Agent的Endpoint

#### 描述

注册Endpoint到AgentCard下。

```java
void registerAgentEndpoint(String agentName, String version, String address, int port) throws NacosException;

void registerAgentEndpoint(String agentName, String version, String address, int port, String transport) throws NacosException;

void registerAgentEndpoint(String agentName, String version, String address, int port, String transport, String path) throws NacosException;

void registerAgentEndpoint(String agentName, String version, String address, int port, String transport, String path, boolean supportTls) throws NacosException;

void registerAgentEndpoint(String agentName, AgentEndpoint endpoint) throws NacosException;
```

#### 请求参数

| 名称         | 类型            | 描述                                           | 默认值       |
|:-----------|:--------------|----------------------------------------------|-----------|
| agentName  | String        | Agent名称                                      | 无，必填      |
| version    | String        | Agent版本                                      | 无，必填      |
| address    | String        | Agent的IP地址                                   | 无，必填      |
| port       | int           | Agent的端口号                                    | 无，必填      |
| transport  | String        | 该endpoint的传输方式`JSONRPC`, `GRPC`, `HTTP+JSON` | `JSONRPC` |
| path       | String        | 该endpoint的访问路径                               | 空字符串      |
| supportTls | boolean       | 是否支持TLS                                      | `false`   |
| endpoint   | AgentEndpoint | AgentEndpoint                                | 无，必填      |

#### 返回参数

 无

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
try {
    aiService.registerAgentEndpoint("test", "1.0.0", "127.0.0.1", 8848);
    aiService.registerAgentEndpoint("test", "1.0.0", "127.0.0.1", 8848, "JSONRPC");
    aiService.registerAgentEndpoint("test", "1.0.0", "127.0.0.1", 8848, "JSONRPC", "");
    aiService.registerAgentEndpoint("test", "1.0.0", "127.0.0.1", 8848, "JSONRPC", "", false);
    AgentEndpoint endpoint = new AgentEndpoint();
    endpoint.setAddress("127.0.0.1");
    endpoint.setPort(8848);
    endpoint.setTransport("JSONRPC");
    endpoint.setPath("");
    endpoint.setSupportTls(false);
    endpoint.setVersion("1.0.0");
    aiService.registerAgentEndpoint("test", endpoint);
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 7.4. 注销Agent的Endpoint

#### 描述

从AgentCard中注销Endpoint。

```java
void deregisterAgentEndpoint(String agentName, String version, String address, int port) throws NacosException;

void deregisterAgentEndpoint(String agentName, AgentEndpoint endpoint) throws NacosException;
```

#### 请求参数

| 名称        | 类型            | 描述            | 默认值  |
|:----------|:--------------|---------------|------|
| agentName | String        | Agent名称       | 无，必填 |
| version   | String        | Agent版本       | 无，必填 |
| address   | String        | Agent的IP地址    | 无，必填 |
| port      | int           | Agent的端口号     | 无，必填 |
| endpoint  | AgentEndpoint | AgentEndpoint | 无，必填 |

#### 返回参数

 无

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
try {
    aiService.deregisterAgentEndpoint("test", "1.0.0", "127.0.0.1", 8848);
    AgentEndpoint endpoint = new AgentEndpoint();
    endpoint.setAddress("127.0.0.1");
    endpoint.setPort(8848);
    endpoint.setVersion("1.0.0");
    aiService.deregisterAgentEndpoint("test", endpoint);
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 7.5. 订阅AgentCard

#### 描述

订阅AgentCard，当AgentCard发布新版本时，会收到通知。

> 当前版本的订阅是通过轮询查询实现的，可能通知有一定的延迟，可以通过配置`nacosAiAgentCardCacheUpdateInterval`参数来调整查询间隔，默认为10000ms。

```java
AgentCardDetailInfo subscribeAgentCard(String agentName, AbstractNacosAgentCardListener agentCardListener) throws NacosException;

AgentCardDetailInfo subscribeAgentCard(String agentName, String version, AbstractNacosAgentCardListener agentCardListener) throws NacosException;
```

#### 请求参数

| 名称        | 类型                             | 描述      | 默认值         |
|:----------|:-------------------------------|---------|-------------|
| agentName | String                         | Agent名称 | 无，必填        |
| version   | String                         | Agent版本 | 当为空时，订阅最新版本 |
| listener  | AbstractNacosAgentCardListener | 监听器     | 无，必填        |

#### 返回参数

订阅成功时，返回当前AgentCard详细信息 `AgentCardDetailInfo`.

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
try {
    aiService.subscribeAgentCard("test", new AbstractNacosAgentCardListener() {
        @Override
        public void onEvent(NacosAgentCardEvent event) {
            System.out.println("---------------agent card listener called start---------------");
            System.out.println(JacksonUtils.toJson(event.getAgentCard()));
            System.out.println("---------------agent card listener called end---------------");
        }
    });
    aiService.subscribeAgentCard("test", "", new AbstractNacosAgentCardListener() {
        @Override
        public void onEvent(NacosAgentCardEvent event) {
            System.out.println("---------------agent card listener called start---------------");
            System.out.println(JacksonUtils.toJson(event.getAgentCard()));
            System.out.println("---------------agent card listener called end---------------");
        }
    });
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 7.6. 取消订阅AgentCard

取消订阅MCP服务。取消订阅时传入的监听器`agentCardListener`必须和订阅时一致，否则会导致取消订阅失败。

#### 描述

```java
void unsubscribeAgentCard(String agentName, AbstractNacosAgentCardListener agentCardListener) throws NacosException;

void unsubscribeAgentCard(String agentName, String version, AbstractNacosAgentCardListener agentCardListener) throws NacosException;
```

#### 请求参数

| 名称        | 类型                             | 描述      | 默认值           |
|:----------|:-------------------------------|---------|---------------|
| agentName | String                         | Agent名称 | 无，必填          |
| version   | String                         | Agent版本 | 当为空时，取消订阅最新版本 |
| listener  | AbstractNacosAgentCardListener | 监听器     | 无，必填          |

#### 返回参数

无

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
AbstractNacosAgentCardListener listener = new AbstractNacosAgentCardListener() {};
try {
    aiService.subscribeAgentCard("test", listener);
    aiService.unsubscribeAgentCard("test", listener);
    aiService.unsubscribeAgentCard("test", "", listener);
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 7.7. 批量注册Agent的Endpoint

批量注册多个Endpoint到AgentCard下。

> 同一个Client只能向一个AgentCard注册一份Endpoints， 因此此API和[注册Agent的Endpoint](#73-注册agent的endpoint)API存在冲突，即此接口批量注册的Endpoint会覆盖之前注册的Endpoint（针对同一个Agent）。
> 若同个Client注册多个不同AgentCard的Endpoints，则不会互相覆盖。

> 该API的起始版本为3.1.1。

#### 描述

```java
void registerAgentEndpoint(String agentName, Collection<AgentEndpoint> endpoints) throws NacosException;
```

#### 请求参数

| 名称        | 类型                        | 描述                | 默认值       |
|:----------|:--------------------------|-------------------|-----------|
| agentName | String                    | Agent名称           | 无，必填      |
| endpoints | Collection<AgentEndpoint> | Agent Endpoint 集合 | 无，必填      |

> 注意：endpoints中的所有AgentEndpoint的version应该不为空且相同。

#### 返回参数

无

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
try {
    AgentEndpoint endpoint1 = new AgentEndpoint();
    endpoint1.setAddress("127.0.0.1");
    endpoint1.setPort(8848);
    endpoint1.setTransport("JSONRPC");
    endpoint1.setPath("");
    endpoint1.setSupportTls(false);
    endpoint1.setVersion("1.0.0");

    AgentEndpoint endpoint2 = new AgentEndpoint();
    endpoint2.setAddress("127.0.0.1");
    endpoint2.setPort(8848);
    endpoint2.setTransport("JSONRPC");
    endpoint2.setPath("");
    endpoint2.setSupportTls(false);
    endpoint2.setVersion("1.0.0");
    
    aiService.registerAgentEndpoint("test", List.of(endpoint1, endpoint2));
} catch (NacosException e) {
    e.printStackTrace();
}
```

## 8. Skill 能力

> Skill 在 Java SDK 中以 ZIP 压缩包的形式分发，包含 SKILL.md 和全部资源文件（二进制资源会从 Base64 自动解码为原始字节）。SDK 当前提供按名称、按版本、按标签三种下载方式，并支持订阅 Skill 变更。

### 8.1. 下载 Skill ZIP

#### 描述

根据 Skill 名称下载最新版本的 Skill ZIP 压缩包（字节数组）。

```java
byte[] downloadSkillZip(String skillName) throws NacosException;
```

#### 请求参数

| 名称       | 类型     | 描述                    | 默认值  |
|:---------|:-------|-----------------------|------|
| skillName | String | Skill 名称（唯一标识）        | 无，必填 |

#### 返回参数

Skill ZIP 压缩包字节数组 `byte[]`，包含 SKILL.md 与全部资源文件。

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
try {
    byte[] skillZip = aiService.downloadSkillZip("{skillName}");
    System.out.println("skill zip bytes: " + skillZip.length);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

Skill 不存在或查询异常时，抛出 NacosException。

### 8.2. 按版本下载 Skill ZIP

#### 描述

根据 Skill 名称和目标版本下载对应版本的 Skill ZIP 压缩包（字节数组）。

```java
byte[] downloadSkillZipByVersion(String skillName, String version) throws NacosException;
```

#### 请求参数

| 名称       | 类型     | 描述                       | 默认值  |
|:---------|:-------|--------------------------|------|
| skillName | String | Skill 名称（唯一标识）           | 无，必填 |
| version   | String | 目标 Skill 版本，为 null 时获取最新版本 | 无     |

#### 返回参数

Skill ZIP 压缩包字节数组 `byte[]`。

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
try {
    byte[] skillZip = aiService.downloadSkillZipByVersion("{skillName}", "1.0.0");
    System.out.println("skill zip bytes: " + skillZip.length);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

Skill 或指定版本不存在、查询异常时，抛出 NacosException。

### 8.3. 按标签下载 Skill ZIP

#### 描述

根据 Skill 名称和标签下载对应标签的 Skill ZIP 压缩包（字节数组）。

```java
byte[] downloadSkillZipByLabel(String skillName, String label) throws NacosException;
```

#### 请求参数

| 名称       | 类型     | 描述                         | 默认值  |
|:---------|:-------|----------------------------|------|
| skillName | String | Skill 名称（唯一标识）             | 无，必填 |
| label     | String | 目标标签（例如：`latest`、`stable`） | 无，必填 |

#### 返回参数

Skill ZIP 压缩包字节数组 `byte[]`。

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
try {
    byte[] skillZip = aiService.downloadSkillZipByLabel("{skillName}", "{label}");
    System.out.println("skill zip bytes: " + skillZip.length);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

Skill 或指定标签不存在、查询异常时，抛出 NacosException。

### 8.4. 订阅 Skill

#### 描述

订阅 Skill 变更，当 Skill ZIP 内容变化时通过监听器回调。version、label 可选，用于限定订阅范围。

```java
byte[] subscribeSkill(String skillName, String version, String label, AbstractNacosSkillListener skillListener) throws NacosException;
```

#### 请求参数

| 名称            | 类型                       | 描述              | 默认值  |
|:--------------|:-------------------------|-----------------|------|
| skillName     | String                   | Skill 名称        | 无，必填 |
| version       | String                   | 目标 Skill 版本，可选 | 无     |
| label         | String                   | 目标标签，可选        | 无     |
| skillListener | AbstractNacosSkillListener | Skill 变更回调监听器  | 无，必填 |

#### 返回参数

订阅成功时返回当前 Skill ZIP 压缩包字节数组 `byte[]`，未找到时可为 null。

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
try {
    byte[] skillZip = aiService.subscribeSkill("{skillName}", null, "{label}", new AbstractNacosSkillListener() {
        @Override
        public void onEvent(NacosSkillEvent event) {
            System.out.println("skill changed: " + event.getSkillName());
            System.out.println("resolved version: " + event.getResolvedVersion());
            System.out.println("md5: " + event.getMd5());
        }
    });
    System.out.println("skill zip bytes: " + (skillZip != null ? skillZip.length : 0));
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

请求参数不合法或订阅处理异常时，抛出 NacosException。

### 8.5. 取消订阅 Skill

#### 描述

取消对 Skill 的订阅。取消时传入的 skillName、version、label、listener 需与订阅时一致。

```java
void unsubscribeSkill(String skillName, String version, String label, AbstractNacosSkillListener skillListener) throws NacosException;
```

#### 请求参数

| 名称            | 类型                       | 描述          | 默认值  |
|:--------------|:-------------------------|-------------|------|
| skillName     | String                   | Skill 名称    | 无，必填 |
| version       | String                   | 目标版本，可选    | 无     |
| label         | String                   | 目标标签，可选    | 无     |
| skillListener | AbstractNacosSkillListener | 订阅时使用的监听器 | 无，必填 |

#### 返回参数

无

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
AbstractNacosSkillListener listener = new AbstractNacosSkillListener() {};
try {
    aiService.subscribeSkill("{skillName}", null, "{label}", listener);
    aiService.unsubscribeSkill("{skillName}", null, "{label}", listener);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

请求参数不合法或取消订阅处理异常时，抛出 NacosException。

## 9. Prompt 能力

### 9.1. 获取 Prompt

#### 描述

根据 Prompt 的 key 获取当前版本的 Prompt 对象。

```java
Prompt getPrompt(String promptKey) throws NacosException;
```

#### 请求参数

| 名称        | 类型     | 描述              | 默认值  |
|:----------|:-------|-----------------|------|
| promptKey | String | Prompt 的 key（唯一标识） | 无，必填 |

#### 返回参数

| 参数类型 | 描述          |
| :--- | :--- |
| Prompt | 当前版本的 Prompt 对象 |

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
try {
    Prompt prompt = aiService.getPrompt("{promptKey}");
    System.out.println(JacksonUtils.toJson(prompt));
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

Prompt 不存在或查询异常时，抛出 NacosException。

### 9.2. 按版本获取 Prompt

#### 描述

根据 Prompt 的 key 和指定版本获取 Prompt 对象。version 为 null 时返回最新版本。

```java
Prompt getPromptByVersion(String promptKey, String version) throws NacosException;
```

#### 请求参数

| 名称        | 类型     | 描述                    | 默认值  |
|:----------|:-------|-----------------------|------|
| promptKey | String | Prompt 的 key（唯一标识）     | 无，必填 |
| version   | String | 目标版本，null 表示最新版本     | 无      |

#### 返回参数

| 参数类型 | 描述            |
| :--- | :--- |
| Prompt | 指定版本的 Prompt 对象 |

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
try {
    Prompt prompt = aiService.getPromptByVersion("{promptKey}", "1.0.0");
    System.out.println(JacksonUtils.toJson(prompt));
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 9.3. 按标签获取 Prompt

#### 描述

根据 Prompt 的 key 和标签获取对应版本的 Prompt 对象。

```java
Prompt getPromptByLabel(String promptKey, String label) throws NacosException;
```

#### 请求参数

| 名称        | 类型     | 描述                | 默认值  |
|:----------|:-------|-------------------|------|
| promptKey | String | Prompt 的 key（唯一标识） | 无，必填 |
| label     | String | 目标标签              | 无，必填 |

#### 返回参数

| 参数类型 | 描述            |
| :--- | :--- |
| Prompt | 该标签对应的 Prompt 对象 |

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
try {
    Prompt prompt = aiService.getPromptByLabel("{promptKey}", "{label}");
    System.out.println(JacksonUtils.toJson(prompt));
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 9.4. 订阅 Prompt

#### 描述

订阅 Prompt 变更，当 Prompt 配置变化时通过监听器回调。version、label 可选，用于限定订阅范围。

```java
Prompt subscribePrompt(String promptKey, String version, String label, AbstractNacosPromptListener promptListener) throws NacosException;
```

#### 请求参数

| 名称             | 类型                         | 描述              | 默认值  |
|:---------------|:---------------------------|-----------------|------|
| promptKey      | String                     | Prompt 的 key      | 无，必填 |
| version        | String                     | 目标版本，可选        | 无      |
| label          | String                     | 目标标签，可选        | 无      |
| promptListener | AbstractNacosPromptListener | Prompt 变更回调监听器 | 无，必填 |

#### 返回参数

| 参数类型 | 描述                    |
| :--- | :--- |
| Prompt | 订阅成功时返回当前 Prompt，未找到可为 null |

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
try {
    Prompt prompt = aiService.subscribePrompt("{promptKey}", null, null, new AbstractNacosPromptListener() {
        @Override
        public void onEvent(NacosPromptEvent event) {
            System.out.println("prompt changed: " + event.getPromptKey());
        }
    });
    System.out.println(JacksonUtils.toJson(prompt));
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 9.5. 取消订阅 Prompt

#### 描述

取消对 Prompt 的订阅。取消时传入的 version、label、listener 需与订阅时一致。

```java
void unsubscribePrompt(String promptKey, String version, String label, AbstractNacosPromptListener promptListener) throws NacosException;
```

#### 请求参数

| 名称             | 类型                         | 描述          | 默认值  |
|:---------------|:---------------------------|-------------|------|
| promptKey      | String                     | Prompt 的 key | 无，必填 |
| version        | String                     | 目标版本，可选    | 无      |
| label          | String                     | 目标标签，可选    | 无      |
| promptListener | AbstractNacosPromptListener | 订阅时使用的监听器 | 无，必填 |

#### 返回参数

无

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
AbstractNacosPromptListener listener = new AbstractNacosPromptListener() {};
try {
    aiService.subscribePrompt("{promptKey}", null, null, listener);
    aiService.unsubscribePrompt("{promptKey}", null, null, listener);
} catch (NacosException e) {
    e.printStackTrace();
}
```

## 10. AgentSpec 能力

### 10.1. 查询 AgentSpec

#### 描述

根据 AgentSpec 名称查询完整的 AgentSpec 对象，包含主配置及全部资源配置。

```java
AgentSpec loadAgentSpec(String agentSpecName) throws NacosException;
```

#### 请求参数

| 名称         | 类型     | 描述                     | 默认值  |
|:-----------|:-------|------------------------|------|
| agentSpecName | String | AgentSpec 名称（唯一标识） | 无，必填 |

#### 返回参数

查询成功时，返回 AgentSpec 对象 `AgentSpec`.

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
try {
    AgentSpec agentSpec = aiService.loadAgentSpec("{agentSpecName}");
    System.out.println(JacksonUtils.toJson(agentSpec));
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 10.2. 订阅 AgentSpec

#### 描述

订阅指定 AgentSpec，当 AgentSpec 配置发生变更时通过监听器回调。

```java
AgentSpec subscribeAgentSpec(String agentSpecName, AbstractNacosAgentSpecListener agentSpecListener)
        throws NacosException;
```

#### 请求参数

| 名称           | 类型                               | 描述                      | 默认值  |
|:-------------|:---------------------------------|-------------------------|------|
| agentSpecName | String                           | AgentSpec 名称              | 无，必填 |
| agentSpecListener | AbstractNacosAgentSpecListener | AgentSpec 变更回调监听器        | 无，必填 |

#### 返回参数

订阅成功时，返回当前 AgentSpec 对象 `AgentSpec`，未找到时可为 null。

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
try {
    AgentSpec agentSpec = aiService.subscribeAgentSpec("{agentSpecName}", new AbstractNacosAgentSpecListener() {
        @Override
        public void onEvent(NacosAgentSpecEvent event) {
            System.out.println("agent spec changed: " + event.getAgentSpecName());
        }
    });
    System.out.println(JacksonUtils.toJson(agentSpec));
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 10.3. 取消订阅 AgentSpec

#### 描述

取消对指定 AgentSpec 的订阅。取消时传入的监听器必须与订阅时一致，否则可能导致取消失败。

```java
void unsubscribeAgentSpec(String agentSpecName, AbstractNacosAgentSpecListener agentSpecListener)
        throws NacosException;
```

#### 请求参数

| 名称           | 类型                               | 描述                  | 默认值  |
|:-------------|:---------------------------------|---------------------|------|
| agentSpecName | String                           | AgentSpec 名称          | 无，必填 |
| agentSpecListener | AbstractNacosAgentSpecListener | 订阅时使用的监听器          | 无，必填 |

#### 返回参数

无

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
AbstractNacosAgentSpecListener listener = new AbstractNacosAgentSpecListener() {};
try {
    aiService.subscribeAgentSpec("{agentSpecName}", listener);
    aiService.unsubscribeAgentSpec("{agentSpecName}", listener);
} catch (NacosException e) {
    e.printStackTrace();
}
```

## 11. Agent 管理与发现

Agent 管理与发现 API 是协议无关的 Agent 接入主入口，覆盖目录搜索、定义发现、本地轮询订阅、定义发布以及运行时 Endpoint 注册。在兼容期内，第 7 章的旧 A2A API 仍可使用，但未来将由本章的 Agent API 替代。新接入的用户和 SDK 应优先兼容 Agent 管理与发现 API，而不是旧 A2A API。

Agent API 使用创建 `AiService` 时配置的 Namespace。SDK 会复制请求对象并绑定该 Namespace，不会修改调用方传入的对象。以下 API 均自 3.3.0 版本起提供。

### 11.1. 搜索 Agent

#### 描述

搜索当前 Namespace 中可见、已启用且至少存在一个在线版本的 Agent。`agentNameContains` 执行大小写敏感的字面量子串匹配，`tagsAll` 中的值按 AND 匹配，`protocolsAny` 中的值按 OR 匹配。

```java
Page<AgentCatalogEntry> searchAgents(AgentSearchRequest request) throws NacosException;
```

#### 请求参数

| 名称    | 类型               | 描述             | 默认值  |
|:------|:-----------------|----------------|------|
| request | AgentSearchRequest | Agent 搜索条件 | 无，必填 |

`AgentSearchRequest` 包含以下字段：

| 名称                | 类型           | 描述                                           | 默认值 |
|:------------------|:-------------|----------------------------------------------|-----|
| namespaceId       | String       | 由 SDK 根据 `AiService` 注入，调用方应留空              | SDK Namespace |
| agentNameContains | String       | Agent 名称中大小写敏感的字面量子串                   | 无 |
| tagsAll           | List\<String\> | Agent 必须同时包含的全部标签                         | 无 |
| protocolsAny      | List\<String\> | 任一在线版本需要暴露的任一调用协议                    | 无 |
| pageNo            | Integer      | 从 1 开始的页码                                 | 1 |
| pageSize          | Integer      | 每页数量，取值范围为 1～100                         | 20 |

#### 返回参数

返回 `Page<AgentCatalogEntry>`，包含总数、当前页码、总页数和 Agent 目录条目。每个条目包含 Agent 展示信息、最新版本以及所有在线版本的标签和协议摘要，不包含 Endpoint。

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
properties.setProperty(PropertyKeyConst.NAMESPACE, "{namespaceId}");
AiService aiService = AiFactory.createAiService(properties);

AgentSearchRequest request = new AgentSearchRequest();
request.setAgentNameContains("order");
request.setTagsAll(Arrays.asList("production", "public"));
request.setProtocolsAny(Collections.singletonList("a2a"));
request.setPageNo(1);
request.setPageSize(20);

Page<AgentCatalogEntry> page = aiService.searchAgents(request);
System.out.println(JacksonUtils.toJson(page));
```

#### 异常说明

请求为空、页码或每页数量越界、请求中携带与 SDK 不同的 Namespace，或远程请求失败时，抛出 `NacosException`。

### 11.2. 发现 Agent

#### 描述

根据 Agent 名称以及可选的精确版本或标签，获取一个完整的 Agent 发现快照。可通过 Filter 裁剪调用协议和 Endpoint 集合。Filter 只裁剪当前结果，不会选择另一个 Agent 版本，也不执行负载均衡。

```java
AgentDiscoveryResult discoverAgent(AgentReference reference) throws NacosException;

AgentDiscoveryResult discoverAgent(AgentReference reference, AgentDiscoveryFilter filter)
        throws NacosException;
```

#### 请求参数

| 名称      | 类型                     | 描述                                  | 默认值  |
|:--------|:-----------------------|-------------------------------------|------|
| reference | AgentReference         | Agent 引用                         | 无，必填 |
| filter    | AgentDiscoveryFilter   | 可选的协议、传输、Endpoint 来源和元数据过滤条件 | 无    |

`AgentReference` 包含以下字段：

| 名称      | 类型     | 描述                                      | 默认值  |
|:--------|:-------|-----------------------------------------|------|
| agentName | String | Agent 名称                             | 无，必填 |
| version   | String | 精确在线版本，与 `label` 互斥              | 无    |
| label     | String | 请求时解析到在线版本的标签，与 `version` 互斥 | 无    |

`AgentDiscoveryFilter` 的所有字段均为可选：

| 名称              | 类型                    | 描述                                      |
|:----------------|:----------------------|-----------------------------------------|
| protocols       | List\<String\>          | 允许的调用协议，列表内按 OR 匹配                 |
| protocolVersion | String                 | 与候选调用接口的协议版本精确匹配                   |
| transports      | List\<String\>          | 允许的传输类型，列表内按 OR 匹配                 |
| endpointSources | List\<EndpointSource\>  | 允许的 `RUNTIME` 或 `DECLARED` 来源           |
| metadataSelector | Map\<String, String\> | Endpoint Metadata 必须同时包含的精确键值             |

#### 返回参数

返回 `AgentDiscoveryResult`，其中包含 Namespace、Agent 名称、解析后的精确版本、`contentDigest` 以及包含已解析 EndpointSet 的调用接口。结果中的 `endpointSets` 是本次发现的权威地址集。

`version` 和 `label` 均留空时，定义元数据使用当前 latest，运行时 Endpoint 则可匹配任一当前在线版本。显式设置 `label=latest` 时，定义和运行时 Endpoint 都严格限定为当前 latest。

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
properties.setProperty(PropertyKeyConst.NAMESPACE, "{namespaceId}");
AiService aiService = AiFactory.createAiService(properties);

AgentReference reference = new AgentReference();
reference.setAgentName("{agentName}");

AgentDiscoveryFilter filter = new AgentDiscoveryFilter();
filter.setProtocols(Collections.singletonList("a2a"));
filter.setEndpointSources(Arrays.asList(EndpointSource.RUNTIME, EndpointSource.DECLARED));

AgentDiscoveryResult result = aiService.discoverAgent(reference, filter);
System.out.println(JacksonUtils.toJson(result));
```

#### 异常说明

Agent 引用无效、`version` 与 `label` 同时设置、Filter 无效、Agent 或目标版本不存在，或远程请求失败时，抛出 `NacosException`。

### 11.3. 订阅 Agent

#### 描述

使用与发现相同的 Agent 引用和可选 Filter 启动 SDK 本地轮询订阅。该能力不是服务端 Watch/Push。目标初始不存在时返回 `null`，但 SDK 会保留轮询任务；目标后续出现，或解析的版本、`contentDigest` 或任一 `sourceRevision` 发生变化时，监听器收到新的完整替换快照。

```java
AgentDiscoveryResult subscribeAgent(AgentReference reference,
        AbstractNacosAgentDiscoveryListener listener) throws NacosException;

AgentDiscoveryResult subscribeAgent(AgentReference reference, AgentDiscoveryFilter filter,
        AbstractNacosAgentDiscoveryListener listener) throws NacosException;
```

#### 请求参数

| 名称      | 类型                                    | 描述                       | 默认值  |
|:--------|:--------------------------------------|--------------------------|------|
| reference | AgentReference                        | 与发现请求相同的 Agent 引用 | 无，必填 |
| filter    | AgentDiscoveryFilter                  | 与发现请求相同的可选 Filter  | 无    |
| listener  | AbstractNacosAgentDiscoveryListener   | 接收完整替换快照的监听器         | 无，必填 |

#### 返回参数

返回当前 `AgentDiscoveryResult`；目标尚不存在时返回 `null`，不会因此取消轮询。

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
properties.setProperty(PropertyKeyConst.NAMESPACE, "{namespaceId}");
AiService aiService = AiFactory.createAiService(properties);

AgentReference reference = new AgentReference();
reference.setAgentName("{agentName}");

AbstractNacosAgentDiscoveryListener listener = new AbstractNacosAgentDiscoveryListener() {
    @Override
    public void onEvent(NacosAgentDiscoveryEvent event) {
        AgentDiscoveryResult snapshot = event.getAgentDiscoveryResult();
        System.out.println("agent changed: " + JacksonUtils.toJson(snapshot));
    }
};

AgentDiscoveryResult current = aiService.subscribeAgent(reference, listener);
System.out.println(JacksonUtils.toJson(current));
```

#### 异常说明

引用、Filter 或监听器无效，或首次发现请求失败时，抛出 `NacosException`。

### 11.4. 取消订阅 Agent

#### 描述

取消 SDK 本地的 Agent 轮询订阅。必须传入订阅时相同的 `AgentReference`、Filter 语义和监听器实例。

```java
void unsubscribeAgent(AgentReference reference,
        AbstractNacosAgentDiscoveryListener listener) throws NacosException;

void unsubscribeAgent(AgentReference reference, AgentDiscoveryFilter filter,
        AbstractNacosAgentDiscoveryListener listener) throws NacosException;
```

#### 请求参数

| 名称      | 类型                                    | 描述                              | 默认值  |
|:--------|:--------------------------------------|---------------------------------|------|
| reference | AgentReference                        | 订阅时使用的 Agent 引用           | 无，必填 |
| filter    | AgentDiscoveryFilter                  | 订阅时使用的 Filter；未过滤订阅传 `null` | 无    |
| listener  | AbstractNacosAgentDiscoveryListener   | 订阅时使用的同一监听器实例             | 无，必填 |

#### 返回参数

无。

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
properties.setProperty(PropertyKeyConst.NAMESPACE, "{namespaceId}");
AiService aiService = AiFactory.createAiService(properties);

AgentReference reference = new AgentReference();
reference.setAgentName("{agentName}");
AbstractNacosAgentDiscoveryListener listener = new AbstractNacosAgentDiscoveryListener() {
    @Override
    public void onEvent(NacosAgentDiscoveryEvent event) {
        System.out.println(JacksonUtils.toJson(event.getAgentDiscoveryResult()));
    }
};
try {
    aiService.subscribeAgent(reference, listener);
    aiService.unsubscribeAgent(reference, listener);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

引用、Filter 或监听器无效时，抛出 `NacosException`。

### 11.5. 注册 Agent 运行时 Endpoint

#### 描述

为一个 Agent 协议注册当前 SDK Publisher 的完整运行时 Endpoint Batch。同一 Publisher 再次注册相同 `(agentName, protocol)` 时会完整替换上一个 Batch，未再提交的 Endpoint 会被删除。SDK 会保存该完整 Batch 作为重连后的 redo 意图。Endpoint 注册不会隐式创建 Agent 定义。

```java
void registerAgentEndpoints(AgentEndpointRegistrationBatch batch) throws NacosException;
```

#### 请求参数

| 名称  | 类型                               | 描述                  | 默认值  |
|:----|:---------------------------------|---------------------|------|
| batch | AgentEndpointRegistrationBatch | 完整的 Endpoint 注册 Batch | 无，必填 |

`AgentEndpointRegistrationBatch` 包含以下字段：

| 名称           | 类型             | 描述                                               | 默认值 |
|:-------------|:---------------|--------------------------------------------------|-----|
| namespaceId  | String         | 由 SDK 根据 `AiService` 注入，调用方应留空                  | SDK Namespace |
| agentName    | String         | Agent 名称                                        | 无，必填 |
| runtimeVersion | String       | 当前部署的实现版本                                     | 无，必填 |
| versionRange | String         | 该部署能服务的 Agent 版本范围，必须包含 `runtimeVersion`      | `[runtimeVersion]` |
| protocol     | String         | Endpoint 所属的规范协议 Token                          | 无，必填 |
| endpoints    | List\<Endpoint\> | 当前 Publisher 的完整 Endpoint 集合，数量为 1～1000 | 无，必填 |

`Endpoint` 包含以下字段：

| 名称       | 类型                  | 描述                                   | 默认值 |
|:---------|:--------------------|--------------------------------------|-----|
| uri      | String              | 完整绝对调用 URI                       | 无，必填 |
| transport | String             | 规范传输类型，如 `HTTP+JSON`             | 无，必填 |
| priority | Integer             | 优先级，数值越小越优先                     | 0 |
| weight   | Double              | 同一优先级内的权重                        | 1 |
| metadata | Map\<String, String\> | 扁平 Endpoint 元数据                    | 无 |

> 注册请求不应设置 `healthy`；健康状态由发现结果提供。

#### 返回参数

无。

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
properties.setProperty(PropertyKeyConst.NAMESPACE, "{namespaceId}");
AiService aiService = AiFactory.createAiService(properties);

Endpoint endpoint = new Endpoint();
endpoint.setUri("https://agent.example.com:443/a2a");
endpoint.setTransport("HTTP+JSON");
endpoint.setPriority(0);
endpoint.setWeight(1.0D);

AgentEndpointRegistrationBatch batch = new AgentEndpointRegistrationBatch();
batch.setAgentName("{agentName}");
batch.setRuntimeVersion("1.1.0");
batch.setVersionRange("[1.0.0,2.0.0)");
batch.setProtocol("a2a");
batch.setEndpoints(Collections.singletonList(endpoint));

aiService.registerAgentEndpoints(batch);
```

#### 异常说明

Batch 或 Endpoint 校验失败、`versionRange` 不包含 `runtimeVersion`、请求中携带与 SDK 不同的 Namespace，或发布失败时，抛出 `NacosException`。

### 11.6. 注销 Agent 运行时 Endpoint

#### 描述

按 `uri` 和 `transport` 组成的自然键，从当前 SDK Publisher 缓存的完整 Batch 中移除 Endpoint。SDK 会重新注册保留后的完整 Batch；当没有 Endpoint 剩余时，注销该 Publisher 在 `(agentName, protocol)` 下的整份 Publication。

```java
void deregisterAgentEndpoints(AgentEndpointDeregistrationBatch batch) throws NacosException;
```

#### 请求参数

| 名称  | 类型                                 | 描述                    | 默认值  |
|:----|:-----------------------------------|-----------------------|------|
| batch | AgentEndpointDeregistrationBatch | Endpoint 注销意图 Batch | 无，必填 |

`AgentEndpointDeregistrationBatch` 包含 Agent 名称、协议和要移除的 Endpoint 列表。`namespaceId` 由 SDK 注入；列表中的 Endpoint 只需要填写自然键字段 `uri` 和 `transport`。

#### 返回参数

无。

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
properties.setProperty(PropertyKeyConst.NAMESPACE, "{namespaceId}");
AiService aiService = AiFactory.createAiService(properties);

Endpoint endpoint = new Endpoint();
endpoint.setUri("https://agent.example.com:443/a2a");
endpoint.setTransport("HTTP+JSON");

AgentEndpointDeregistrationBatch batch = new AgentEndpointDeregistrationBatch();
batch.setAgentName("{agentName}");
batch.setProtocol("a2a");
batch.setEndpoints(Collections.singletonList(endpoint));

aiService.deregisterAgentEndpoints(batch);
```

#### 异常说明

Batch 或 Endpoint 自然键无效、请求中携带与 SDK 不同的 Namespace，或发布失败时，抛出 `NacosException`。

### 11.7. 代码式发布 Agent 定义

#### 描述

从应用代码中发布一个精确 Agent 版本。请求使用 `AiService` 的 Namespace，SDK 会复制请求对象且不会修改调用方对象。`autoSubmit=false` 时只创建或返回等价 draft；`autoSubmit=true` 时在创建 draft 后执行普通 submit Pipeline，并返回最终可观察到的 `reviewing`、`reviewed` 或 `online` 版本。此操作不是 force-publish。

同一 Namespace、Agent 和精确版本的等价重试具有幂等和状态收敛语义。已有 draft 可通过将同一请求的 `autoSubmit` 改为 `true` 继续提交。内容、作者、变更说明或显式首次元数据不等价时返回冲突；已进入后续状态的版本不能通过 `autoSubmit=false` 回退为 draft。

> 本节使用的 `AgentProvider` 和 `AgentVersionDetail` 位于 `com.alibaba.nacos.api.ai.model.agent` 包，不是旧 A2A 的 `com.alibaba.nacos.api.ai.model.a2a` 同名类型。

```java
AgentVersionDetail publishAgent(AgentPublishRequest request) throws NacosException;
```

#### 请求参数

| 名称    | 类型                 | 描述             | 默认值  |
|:------|:-------------------|----------------|------|
| request | AgentPublishRequest | Agent 定义发布请求 | 无，必填 |

`AgentPublishRequest` 复用 `AgentDraftCreateRequest` 的字段，并增加 `autoSubmit`：

| 名称                | 类型                        | 描述                                                   | 默认值 |
|:------------------|:--------------------------|------------------------------------------------------|-----|
| agentName         | String                    | Agent 名称                                            | 无，必填 |
| displayName       | String                    | 首次创建 Agent 时的可选展示名称                              | 无 |
| description       | String                    | 首次创建 Agent 时的可选目录描述                              | 无 |
| iconUrl           | String                    | 首次创建 Agent 时的可选图标 URI                           | 无 |
| provider          | AgentProvider             | 首次创建 Agent 时的可选提供方 `name` 和 `url`                 | 无 |
| tags              | List\<String\>             | 首次创建 Agent 时的可选公开目录标签                            | 无 |
| extensions        | Map\<String, Object\>      | 首次创建 Agent 时的可选公开扩展                               | 无 |
| version           | String                    | 要创建的精确 SemVer 版本                                 | 无，必填 |
| callInterfaces    | List\<AgentCallInterface\> | 非空的有序协议定义；与 `basedOnVersion` 必须且只能填写其中一项 | 条件必填 |
| basedOnVersion    | String                    | 复用内容的精确源版本；与 `callInterfaces` 二选一             | 条件必填 |
| author            | String                    | Version 作者                                        | 无 |
| changeDescription | String                    | Version 变更说明                                      | 无 |
| autoSubmit        | boolean                   | 是否在创建 draft 后执行普通 submit Pipeline                | false |

`AgentCallInterface` 包含协议、协议版本、`descriptorMediaType`、原生 `nativeDescriptor`、非空的 `endpointSourceOrder` 以及可选的声明式 Endpoint。同一 Version 中的 `protocol` 不能重复。

首次创建 Agent 时必须直接提供 `callInterfaces`，因为尚不存在可复用的源版本，不能使用 `basedOnVersion`。创建后续版本时仍必须在直接内容和一个精确源版本之间二选一。

#### 返回参数

返回精确的 `AgentVersionDetail`，包含 Namespace、Agent 名称、版本、当前状态、调用接口、作者、变更说明、`contentDigest` 和审计时间。

#### 请求示例

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
properties.setProperty(PropertyKeyConst.NAMESPACE, "{namespaceId}");
AiService aiService = AiFactory.createAiService(properties);

AgentInterface binding = new AgentInterface();
binding.setUrl("https://agent.example.com:443/a2a");
binding.setProtocolBinding("HTTP+JSON");
binding.setProtocolVersion("1.0");

AgentCapabilities capabilities = new AgentCapabilities();
capabilities.setStreaming(Boolean.TRUE);
AgentCard card = new AgentCard();
card.setName("{agentName}");
card.setDescription("Order Agent");
card.setVersion("1.0.0");
card.setSupportedInterfaces(Collections.singletonList(binding));
card.setCapabilities(capabilities);

Endpoint declaredEndpoint = new Endpoint();
declaredEndpoint.setUri(binding.getUrl());
declaredEndpoint.setTransport(binding.getProtocolBinding());

AgentCallInterface callInterface = new AgentCallInterface();
callInterface.setProtocol("a2a");
callInterface.setProtocolVersion("1.0");
callInterface.setDescriptorMediaType("application/json");
callInterface.setNativeDescriptor(
        JacksonUtils.toObj(JacksonUtils.toJson(card), Map.class));
callInterface.setEndpointSourceOrder(
        Arrays.asList(EndpointSource.DECLARED, EndpointSource.RUNTIME));
callInterface.setDeclaredEndpoints(Collections.singletonList(declaredEndpoint));

AgentPublishRequest request = new AgentPublishRequest();
request.setAgentName("{agentName}");
request.setDisplayName("Order Agent");
request.setVersion("1.0.0");
request.setCallInterfaces(Collections.singletonList(callInterface));
request.setAuthor("{author}");
request.setChangeDescription("Initial version");
request.setAutoSubmit(true);

AgentVersionDetail detail = aiService.publishAgent(request);
System.out.println(JacksonUtils.toJson(detail));
```

#### 异常说明

请求为空、版本或定义校验失败、`callInterfaces` 和 `basedOnVersion` 未按二选一规则填写、等价性或状态冲突、提交失败，或当前 `AiService` 实现不支持此能力时，抛出 `NacosException`。

## 12. Java SDK的生命周期

Nacos的Java SDK 生命周期从创建时开始，到调用`shutdown()`方法时结束，期间对应创建的线程池、连接等均会始终保留，即使连接断开，也会不断重试重新建立连接。

因此在使用时需要注意应用中创建的Nacos Java SDK的实例个数，避免造成线程池和连接的泄漏，在更换Nacos Java
SDK实例时，切记调用`shutdown()`方法，同时在应用中应尽量复用同一个Nacos Java SDK实例，避免频繁的初始化实例。
