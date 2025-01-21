---
title: Java SDK Usage
keywords: [Java,SDK,Usage]
description: This document introduces the usage of Nacos's Java SDK (nacos-client), including how to configure the Nacos Client, how to use the Nacos Client, and how to utilize the Nacos Client's API.
sidebar:
    order: 2
---

# Java SDK 使用手册

## 1. 引用概述

### 1.1. Java 版本依赖

Nacos 的 Java SDK（或称Nacos-Java-Client）需要 JDK 1.8 及以上版本的Java运行环境。

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
        <nacos.version>3.0.0-ALPHA.2</nacos.version>
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
                            String syncType= event.getChangedType();
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

## 5. Java SDK的生命周期

Nacos的Java SDK 生命周期从创建时开始，到调用`shutdown()`方法时结束，期间对应创建的线程池、连接等均会始终保留，及时连接断开，也会不断重试重新建立连接。

因此在使用时需要注意应用中创建的Nacos Java SDK的实例个数，避免造成线程池和连接的泄漏，在更换Nacos Java SDK实例时，切记调用`shutdown()`方法，同时在应用中应尽量复用同一个Nacos Java SDK实例，避免频繁的初始化实例。
