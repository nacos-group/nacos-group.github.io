---
title: Java SDK Usage
keywords: [Java,SDK,Usage]
description: This document introduces the usage of Nacos's Java SDK (nacos-client), including how to configure the Nacos Client, how to use the Nacos Client, and how to utilize the Nacos Client's API.
sidebar:
    order: 2
---

# Java SDK Usage

Nacos Java SDK, also known as Nacos Java Client, provides Java access to Nacos configuration management, service discovery, AI Registry, and distributed lock capabilities.

The Java SDK is intended for application runtime access. It provides APIs to publish, delete, read, and listen to configurations; register, deregister, query, and subscribe to service instances; access AI resources; and acquire or release distributed locks.

It does not provide broad management operations such as listing all configurations or all services in a namespace. For range-based queries, higher-priority updates, or operational management, use the Nacos Maintainer SDK or Admin API.

## 0. Before You Start

### 0.1. Choose the Right Access Method

| What You Need | Recommended Entry |
| --- | --- |
| Read and listen to configurations, register instances, and subscribe to services in a Java application. | Use the Java SDK described in this page. |
| Query or subscribe to AI resources such as MCP, Agent, Skill, Prompt, and AgentSpec in a Java application. | Use the AI sections in this page, and read [AI Registry Overview](../ai/ai-registry-overview.md) first. |
| Access Nacos from Go, Python, or another language. | Read [SDK Overview](../overview/other-language.md) and choose the SDK for that language. |
| Understand connections, reconnects, local cache, failover, and lifecycle behavior. | Read [SDK Runtime](../sdk/runtime-guide.md). |
| Query a small number of known configurations or services through HTTP. | Use [Client API](../open-api.md). |
| Publish configurations, query lists, manage namespaces, manage services, or perform operations tasks. | Use [Admin API](../../admin/admin-api.md) or [Maintainer SDK](../../admin/maintainer-sdk.md). |

The Java SDK maintains connections, listeners, subscriptions, local cache, and reconnect recovery. Business applications should prefer SDK capabilities instead of manually composing internal requests or depending on Console APIs.

### 0.2. Usage Principles

- One SDK instance belongs to one namespace. Create separate instances when accessing multiple namespaces.
- Reuse SDK instances inside an application. Frequent client creation wastes connections and thread resources.
- Call `shutdown()` when the application exits, reloads, or replaces a client instance.
- A configuration listener receives a change notification. The application should read the configuration content again and refresh its own state.
- A service subscription returns a runtime discovery view. It may be affected by health state, weight, protection threshold, cluster, selector, and other factors.
- AI resources are affected by namespace, version, label, publish state, and visibility. In production, when using MCP, Agent, Skill, Prompt, or other resources that support versions or labels, specify the expected version or label when possible, and handle missing, invisible, or changed resources.
- An AI resource subscription receives a change notification. The application should read the MCP, Agent, Skill, Prompt, or AgentSpec content again and refresh or degrade according to its own runtime model.
- Distributed lock is experimental. Before production use, read [Distributed Lock](../../../experimental/distributed-lock.md) and validate the behavior carefully.

## 1. Dependency Overview

### 1.1. Java Version

Nacos Java SDK requires JDK 1.8 or later.

### 1.2. Maven Coordinates
```
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-client</artifactId>
    <version>${version}</version>
</dependency>
```

#### 1.2.1. Pure Java SDK

> Note: Since Nacos Java SDK 2.0 introduced gRPC, some dependencies are shaded into `nacos-client` to avoid conflicts with gRPC versions introduced by user applications. This makes `nacos-client` larger.
> If your application does not introduce gRPC by itself, or you have confirmed that there is no version conflict, you can use the pure client classifier to reduce dependency size.

```xml
    <properties>
        <!-- The pure client is supported since 2.1.2. -->
        <nacos.version>3.2.0</nacos.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>com.alibaba.nacos</groupId>
            <artifactId>nacos-client</artifactId>
            <version>${nacos.version}</version>
            <!-- Specify the pure SDK. -->
            <classifier>pure</classifier>
        </dependency>
        <!-- When using the pure client, introduce nacos-api and nacos-common of the same version. Otherwise, runtime class-not-found errors may occur. -->
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

### 1.3. Upgrade Compatibility

In 3.x the default namespace ID was changed from empty string to `public` (see [issue #9846](https://github.com/alibaba/nacos/issues/9846)). The 3.0 client uses `public` by default, so it is incompatible with older servers when using the default namespace.

Before upgrading, ensure that **the server is already 3.0 or above**, or **you are not using the config center in the default namespace**.

## 2. Initialize the SDK

To initialize the Nacos SDK, use the `NacosFactory` class to create clients for different modules:

```java

String serverAddr = "localhost:8848";

// Initialize the Nacos Java SDK for the config center.
ConfigService configService = NacosFactory.createConfigService(serverAddr);

// Initialize the Nacos Java SDK for the registry.
NamingService namingService = NacosFactory.createNamingService(serverAddr);

// The Nacos Java SDK for distributed lock does not support initialization with only serverAddr. Use Properties instead.
```

If you need to configure additional parameters during SDK initialization, use the `Properties` class:

```java

Properties properties = new Properties();
// Specify the Nacos Server address.
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "localhost:8848");
// Specify the namespace of the Nacos SDK.
properties.setProperty(PropertyKeyConst.NAMESPACE, "${namespaceId}");

// Initialize the Nacos Java SDK for the config center.
ConfigService configService = NacosFactory.createConfigService(properties);

// Initialize the Nacos Java SDK for the registry.
NamingService namingService = NacosFactory.createNamingService(properties);

// Initialize the Nacos Java SDK for distributed lock.
LockService lockService = NacosLockFactory.createLockService(properties);
```

For more parameters involved in initialization, see [Java SDK Properties](./properties.md).

> Note: A Nacos Java SDK instance can access only configurations and services in the same namespace. To access configurations or services in different namespaces, create different Nacos Java SDK instances.

## 3. Configuration Management API
### 3.1. Get Config
#### Description

Gets configuration from Nacos when a service starts.
```java
public String getConfig(String dataId, String group, long timeoutMs) throws NacosException
```

#### Request Parameters

| Parameter | Type | Description |
| :--- | :--- | :--- |
| dataId | string | Configuration ID. Use a naming rule similar to `package.class`, such as `com.taobao.tc.refund.log.level`, to ensure global uniqueness. The `class` part should describe the business meaning of the configuration. Use lowercase characters only. Only letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The maximum length is 256 bytes. |
| group | string | Configuration group. We recommend using `product:module`, such as `Nacos:Test`, to ensure uniqueness. Only letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The maximum length is 128 bytes. |
| timeout | long | Timeout for reading the configuration, in milliseconds. The recommended value is 3000. |


#### Return Value

| Type | Description |
| :--- | :--- |
| string | Configuration value |


#### Request Example

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

#### Exceptions

If reading the configuration times out or a network error occurs, a `NacosException` is thrown.

### 3.2. Listen to Config
#### Description

If you want Nacos to push configuration changes, use the Nacos dynamic configuration listener API.

```java
public void addListener(String dataId, String group, Listener listener) 
```

#### Request Parameters

| Parameter | Type | Description |
| :--- | :--- |:-----------------------------------------------------------------------------------------------------------------------------------------------|
| dataId | string | Configuration ID. Use a naming rule similar to `package.class`, such as `com.taobao.tc.refund.log.level`, to ensure global uniqueness. The `class` part should describe the business meaning of the configuration. Use lowercase characters only. Only letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The maximum length is 256 bytes. |
| group | string | Configuration group. We recommend using **product:module**, such as `Nacos:Test`, to ensure uniqueness. Only letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The maximum length is 128 bytes. |
| listener | Listener | Listener callback invoked when the configuration changes. |

#### Return Value

| Type | Description |
| :--- | :--- |
| string | Configuration value, returned through the callback during initialization or configuration changes. |


#### Request Example

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

// Keep the main thread alive for testing because configuration subscription uses daemon threads.
// This code is not required in production.
while (true) {
    try {
        Thread.sleep(1000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}
```

### 3.3. Remove Listener
#### Description

Cancels the configuration listener. After the listener is removed, configuration changes are no longer pushed.

```java
public void removeListener(String dataId, String group, Listener listener)
```

#### Request Parameters

| Parameter | Type | Description |
| :--- | :--- | :--- |
| dataId | string | Configuration ID. Use a naming rule similar to `package.class`, such as `com.taobao.tc.refund.log.level`, to ensure global uniqueness. The `class` part should describe the business meaning of the configuration. Use lowercase characters only. Only letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The maximum length is 256 bytes. |
| group | string | Configuration group |
| listener | ConfigChangeListenerAdapter | Listener callback invoked when the configuration changes. |


#### Usage Example

```java
String serverAddr = "{serverAddr}";
String dataId = "{dataId}";
String group = "{group}";
Properties properties = new Properties();
properties.put("serverAddr", serverAddr);
ConfigService configService = NacosFactory.createConfigService(properties);
configService.removeListener(dataId, group, yourListener);
```

### 3.4. Publish Config
#### Description

Publishes Nacos configurations automatically from a program to reduce operations costs through automation.

Note: The same publish API is used to create and update configurations. If the configuration does not exist, it is created. If the configuration already exists, it is updated.

```java
public boolean publishConfig(String dataId, String group, String content) throws NacosException;

public boolean publishConfig(String dataId, String group, String content, String type) throws NacosException;

```

#### Request Parameters

| Parameter | Type | Description |
| :--- | :--- | :--- |
| dataId | string | Configuration ID. Use a naming rule similar to `package.class`, such as `com.taobao.tc.refund.log.level`, to ensure global uniqueness. We recommend defining the `class` part according to the business meaning of the configuration. Use lowercase characters only. Only letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The maximum length is 256 bytes. |
| group | string | Configuration group. We recommend using `product:module`, such as `Nacos:Test`, to ensure uniqueness. Only letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The maximum length is 128 bytes. |
| content | string | Configuration content. The maximum size is 100 KB. |
| type | string | @Since 1.4.1. Configuration type. See `com.alibaba.nacos.api.config.ConfigType`. The default value is `TEXT`. |


#### Return Parameters

| Type | Description |
| :--- | :--- |
| boolean | Whether the publish operation succeeded |


#### Request Example

```java
try {
    // Initialize the configuration service. The console automatically obtains the following parameters through the sample code.
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

#### Exceptions

If reading the configuration times out or a network error occurs, a `NacosException` is thrown.

### 3.5. Delete Config
#### Description

Deletes Nacos configurations automatically from a program to reduce operations costs through automation.

> Note: If the configuration exists, it is deleted. If the configuration does not exist, a success message is returned directly.


```java
public boolean removeConfig(String dataId, String group) throws NacosException

```

#### Request Parameters

| Parameter | Type | Description |
| :--- | :--- | :--- |
| dataId | string | Configuration ID |
| group | string | Configuration group |


#### Return Parameters

| Type | Description |
| :--- | :--- |
| boolean | Whether the deletion succeeded |


#### Request Example

```java
try {
    // Initialize the configuration service. The console automatically obtains the following parameters through the sample code.
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

#### Exceptions

If reading the configuration times out or a network error occurs, a `NacosException` is thrown.

### 3.6. Get Config with Listener

#### Description

If you want to register a listener when the program obtains the configuration for the first time so that the listener can be used for subsequent configuration updates, use this API directly.

> This API is equivalent to calling `getConfig` first and then calling `addListener`.

```java
String getConfigAndSignListener(String dataId, String group, long timeoutMs, Listener listener) throws NacosException;
```

#### Request Parameters

| Parameter | Type | Description |
| :--- | :--- | :--- |
| dataId | string | Configuration ID. Use a naming rule similar to `package.class`, such as `com.taobao.tc.refund.log.level`, to ensure global uniqueness. The `class` part should describe the business meaning of the configuration. Use lowercase characters only. Only letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The maximum length is 256 bytes. |
| group | string | Configuration group. We recommend using `product:module`, such as `Nacos:Test`, to ensure uniqueness. Only letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The maximum length is 128 bytes. |
| timeout | long | Timeout for reading the configuration, in milliseconds. The recommended value is 3000. |
| listener | Listener | Listener callback invoked when the configuration changes. |

#### Return Value

| Type | Description |
| :--- | :--- |
| string | Configuration value |


#### Request Example

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

#### Exceptions

If reading the configuration times out or a network error occurs, a `NacosException` is thrown.

### 3.7. Publish Config with Compare-And-Swap (CAS)

#### Description

When `publishConfig` is used directly to publish configurations, concurrent updates from different processes may overwrite each other. In this case, use the configuration publish API with Compare-And-Swap (CAS) to prevent this situation.

Note: The same publish API is used to create and update configurations. If the configuration does not exist, it is created. If the configuration already exists, it is updated.

```java
boolean publishConfigCas(String dataId, String group, String content, String casMd5) throws NacosException;

boolean publishConfigCas(String dataId, String group, String content, String casMd5, String type) throws NacosException;
```

#### Request Parameters

| Parameter | Type | Description |
| :--- | :--- |:-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| dataId | string | Configuration ID. Use a naming rule similar to `package.class`, such as `com.taobao.tc.refund.log.level`, to ensure global uniqueness. We recommend defining the `class` part according to the business meaning of the configuration. Use lowercase characters only. Only letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The maximum length is 256 bytes. |
| group | string | Configuration group. We recommend using `product:module`, such as `Nacos:Test`, to ensure uniqueness. Only letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The maximum length is 128 bytes. |
| content | string | Configuration content. The maximum size is 100 KB. |
| casMd5 | string | MD5 of the previous configuration content |
| type | string | Configuration type. See `com.alibaba.nacos.api.config.ConfigType`. The default value is `TEXT`. |

#### Return Parameters

| Type | Description |
| :--- | :--- |
| boolean | Whether the publish operation succeeded |


#### Request Example

```java
try {
    // Initialize the configuration service. The console automatically obtains the following parameters through the sample code.
    String serverAddr = "{serverAddr}";
    String dataId = "{dataId}";
    String group = "{group}";
    String oldContent = "oldContent";
    String oldContentMd5 = "63fb636909f1ebad67110e49117e6de4";
    Properties properties = new Properties();
    properties.put("serverAddr", serverAddr);
    ConfigService configService = NacosFactory.createConfigService(properties);
    // For the first publish, pass null as casMd5.
    boolean isPublishOk = configService.publishConfigCas(dataId, group, oldContent, null);
    System.out.println(isPublishOk);
    // The old MD5 is correct, so the update succeeds.
    isPublishOk = configService.publishConfigCas(dataId, group, "newContent", oldContentMd5);
    System.out.println(isPublishOk);
    // The old MD5 is incorrect, so the update fails.
    isPublishOk = configService.publishConfigCas(dataId, group, "newContent2", oldContentMd5);
    System.out.println(isPublishOk);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exceptions

If reading the configuration times out or a network error occurs, a `NacosException` is thrown.



### 3.8. Fuzzy Watch Config

#### Description

The `fuzzyWatch` API can batch-subscribe to configurations that match the specified group rule and configuration `dataId` rule. Use `*` for prefix fuzzy matching, suffix fuzzy matching, or bilateral fuzzy matching.
<br/>Fuzzy watch pushes only configuration add and delete events. It does not directly push the content of configuration changes. In a fuzzy watch listener, you can use the `addListener` API together with fuzzy watch to listen for configuration content changes.<br/>
For stability, Nacos applies upper-limit protection to the number of fuzzy watch rules and the number of configurations matched by a single rule. For details, see [Fuzzy Watch Capacity Protection](#fuzzy-watch-capacity-protection).

```java

/**
 * Subscribes to change events for all configurations in the current namespace that match the specified group rule and dataId rule.
 * The fuzzy watch list is asynchronously returned through the watcher callback.
 * @param dataIdPattern dataId matching rule
 * @param groupNamePattern group matching rule
 * @param watcher fuzzy watch listener
 */
void fuzzyWatch(String dataIdPattern, String groupNamePattern, FuzzyWatchEventWatcher watcher);

/**
 * Subscribes to change events for all configurations in the current namespace that match the specified group rule and dataId rule,
 * and obtains the current matched configuration list in Future mode.
 * The fuzzy watch list is asynchronously returned through the watcher callback.
 * @param dataIdPattern dataId matching rule
 * @param groupNamePattern group matching rule
 * @param watcher fuzzy watch listener
 * @return Future that can be used to wait for the asynchronous configuration push result
 */
Future<Set<String>> fuzzyWatchWithGroupKeys(String dataIdPattern, String groupNamePattern,
		FuzzyWatchEventWatcher watcher) throws NacosException;


/**
 * Cancels the subscription to change events for all configurations in the current namespace that match the specified group rule and dataId rule.
 * @param dataIdPattern dataId matching rule
 * @param groupNamePattern group matching rule
 * @param watcher fuzzy watch listener to remove
 */
void cancelFuzzyWatch(String dataIdPattern, String groupNamePattern, FuzzyWatchEventWatcher watcher);


/**
 * Subscribes to change events for all configurations in the current namespace that match the specified group rule.
 *
 * @param groupNamePattern group matching rule
 * @param watcher fuzzy watch listener
 */
void fuzzyWatch(String groupNamePattern, FuzzyWatchEventWatcher watcher) throws NacosException;

/**
 * Subscribes to change events for all configurations in the current namespace that match the specified group rule.
 * A Future can be used to obtain the current matched configuration list.
 *
 * @param groupNamePattern group matching rule
 * @param watcher fuzzy watch listener
 * @return Future that can be used to wait for the asynchronous configuration push result
 */
Future<Set<String>> fuzzyWatchWithGroupKeys(String groupNamePattern,
		FuzzyWatchEventWatcher watcher) throws NacosException;

/**
 * Cancels the subscription to change events for all configurations in the current namespace that match the specified group rule.
 *
 * @param groupNamePattern group matching rule
 * @param watcher fuzzy watch listener to remove
 */
void cancelFuzzyWatch(String groupNamePattern, FuzzyWatchEventWatcher watcher) ;


```

#### Request Parameters

| Parameter | Type | Description |
| :--- | :--- |:--------------------------------------------------------------------------------|
| dataIdPattern | string | Configuration ID matching rule. Supports prefix fuzzy matching, such as `mydataId*`; suffix fuzzy matching, such as `*mydatdId`; and bilateral fuzzy matching, such as `*mydatadId*`. |
| groupNamePattern | string | Configuration group matching rule. Supports prefix fuzzy matching, such as `mygroup*`; suffix fuzzy matching, such as `*mygroup`; and bilateral fuzzy matching, such as `*mygroup*`. |
| watcher | FuzzyWatchEventWatcher | Fuzzy watch listener |


#### FuzzyWatchEventWatcher Fuzzy Watch Listener
| Method | Parameter Type | Description |
| :--- | :--- |:------------------------------------------------------------------------|
| onEvent | ConfigFuzzyWatchChangeEvent | Fuzzy watch callback event object |
| getExecutor | void | Specifies the thread pool used to execute callback events. If it is empty, callbacks are executed in the Nacos push thread. |

#### ConfigFuzzyWatchChangeEvent Fuzzy Watch Event
| Parameter   | Type   | Description |
|:------------|:-------|:----------------------------------------------------------------------------------------------------------------|
| dataId      | string | `dataId` of the changed configuration |
| group       | string | Group of the changed configuration |
| namespace   | string | Namespace of the changed configuration |
| changedType | string | Change type received by the client, including `ADD_CONFIG` for added configurations and `DELETE_CONFIG` for removed configurations |
| syncType    | string | Type that triggered the change, including `FUZZY_WATCH_INIT_NOTIFY` for initial push, `FUZZY_WATCH_DIFF_SYNC_NOTIFY` for change reconciliation, and `FUZZY_WATCH_RESOURCE_CHANGED` for configuration change push |



#### Return Parameters

| Type | Description |
| :--- |:-------------------------------------------------------------------------------------------|
| Future<Set<String>> | A Future object that can obtain the current matched configuration list. After the list of configurations matched by the rule is pushed to the client, you can obtain the list through the Future object.<br/>*Note: When capacity protection is triggered, the returned configuration list may be incomplete. |
```java
// The returned parameter is a groupKey list. You can use the GroupKey utility class to obtain dataId, group, and namespace.
String[] groupKeyItems = GroupKey.parseKey(String groupKey);
String dataId=groupKeyItems[0];
String group=groupKeyItems[1];
String namespace=groupKeyItems[2];
```
#### Fuzzy Watch Capacity Protection

For stability, to avoid server memory pressure and client push storms caused by too many rules or too many configurations matched by rules, Nacos provides capacity protection for fuzzy watch at two levels. When an upper limit is exceeded, fuzzy watch pushes are suppressed.<br/>
1. Upper-limit protection for the number of fuzzy watch rules. The default upper limit is 20 and can be adjusted by the `nacos.config.fuzzy.watch.max.pattern.count` parameter.
2. Upper-limit protection for the number of configurations matched by a single fuzzy watch rule. The default upper limit is 500 and can be adjusted by the `nacos.config.fuzzy.watch.max.pattern.match.config.count` parameter.

When registering a fuzzy watch listener in the `fuzzyWatch` API, the listener can also implement `FuzzyWatchLoadWatcher` to perceive capacity protection events.
#### FuzzyWatchLoadWatcher Fuzzy Watch Load Listener
| Method | Description |
| :--- |:----------------------------------|
| onPatternOverLimit | Triggered when pushes for the current fuzzy watch rule are suppressed because the rule count exceeds the upper limit |
| onConfigReachUpLimit | Triggered when pushes for the current fuzzy watch rule are suppressed because the number of matched configurations reaches the upper limit |

*Note:
1. When capacity protection is triggered, the configuration list returned by `fuzzyWatchWithGroupKeys` may be incomplete.
2. When configuration-count upper-limit protection is triggered, configuration deletion events may also fail to be pushed because of the protection mechanism.


#### Request Example

```java
try {
    // Initialize the configuration service. The console automatically obtains the following parameters through the sample code.
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
                            // Do something.
                        }

                        @Override
                        public void onPatternOverLimit() {
			    System.out.println("pattern count over limit");
			    // Do something.
                        }

                        @Override
                        public void onConfigReachUpLimit() {
			    System.out.println("pattern match config count reach to up limit");
			    // Do something.
                        }
    });

    Set<String> matchGroupKeys = fuzzyWatchFuture.get();
    System.out.println("get group keys count:"+matchGroupKeys.size());

} catch (NacosException e) {
    e.printStackTrace();
}
```

### 3.9. Get config with result object

#### Description

Get configuration from Nacos and receive a result object containing content and metadata (e.g. MD5) for use in CAS publish and similar operations. This API is available since 3.0.

```java
ConfigQueryResult getConfigWithResult(String dataId, String group, long timeoutMs) throws NacosException;
```

#### Request parameters

| Parameter | Type | Description |
| :--- | :--- | :--- |
| dataId | string | Configuration ID; use a package.class-style name; only letters and 4 special chars (".", ":", "-", "_"); max 256 bytes. |
| group | string | Configuration group; recommend product:module; only letters and 4 special chars; max 128 bytes. |
| timeoutMs | long | Read timeout in ms; recommend 3000. |

#### Return value

| Type | Description |
| :--- | :--- |
| ConfigQueryResult | Contains content, md5, etc.; can be used with [CAS publish config](#37-publish-config-with-compare-and-swap-cas). |

#### Request example

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

#### Exception

NacosException on read timeout or network error.

### 3.10. Get server status

#### Description

Get the current config server status.

```java
String getServerStatus();
```

#### Request parameters

None.

#### Return value

| Type | Description |
| :--- | :--- |
| String | Server status. |

#### Request example

```java
ConfigService configService = NacosFactory.createConfigService("{serverAddr}");
String status = configService.getServerStatus();
System.out.println(status);
```

### 3.11. Add config filter

#### Description

Add a config filter for request/response filtering when getting or publishing config. Prefer extending `com.alibaba.nacos.api.config.filter.AbstractConfigFilter`. This API is available since 2.3.0.

```java
void addConfigFilter(IConfigFilter configFilter);
```

#### Request parameters

| Parameter | Type | Description |
| :--- | :--- | :--- |
| configFilter | IConfigFilter | Filter instance; recommend using an AbstractConfigFilter subclass. |

#### Return value

None.

#### Request example

```java
ConfigService configService = NacosFactory.createConfigService("{serverAddr}");
configService.addConfigFilter(new AbstractConfigFilter() {
    @Override
    public void init(Properties properties) {}
    @Override
    public void doFilter(IConfigRequest request, IConfigResponse response, IConfigFilterChain chain) throws NacosException {
        // filter logic
        chain.doFilter(request, response);
    }
    @Override
    public int getOrder() { return 0; }
    @Override
    public String getFilterName() { return "myFilter"; }
});
```


### 3.12. Request/Result Pattern API (3.3.0+)

#### Description

Starting from version 3.3.0, Nacos Config Client introduces a new Request/Result pattern API to replace the existing numerous overloaded methods. The new API offers the following advantages:

- **Extensibility**: Parameters are carried through Request objects, so new parameters don't require new overloaded methods
- **Detailed results**: Result objects return success/errorCode/errorMessage instead of just boolean
- **304 caching**: `getConfig` supports conditional GET, where the server compares md5 and returns 304 to reduce network transfer
- **Encrypted config CAS**: Obtain casMd5 through `ConfigQueryResult.getMd5()`, enabling CAS publish for encrypted configs

> Note: The original API is fully preserved. New and old APIs can be mixed, no migration required.

#### 3.12.1. Get Config (Request Pattern)

```java
public ConfigQueryResult getConfig(GetConfigRequest request) throws NacosException
```

**GetConfigRequest Parameters**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| dataId | string | Configuration ID |
| group | string | Configuration group, defaults to `DEFAULT_GROUP` when empty |
| timeoutMs | long | Read timeout in milliseconds |
| localMd5 | string | Optional, locally cached config content MD5 for 304 conditional GET. When not set, the client automatically resolves from local cache |

**Return Value ConfigQueryResult**

| Field | Type | Description |
| :--- | :--- | :--- |
| content | string | Configuration content |
| md5 | string | MD5 of the config content, can be used for CAS publish |
| configType | string | Configuration type |
| encryptedDataKey | string | Data key for encrypted config |

**Example**

```java
try {
    ConfigService configService = NacosFactory.createConfigService(properties);

    // Basic usage: automatic 304 caching
    GetConfigRequest request = GetConfigRequest.builder()
        .dataId("app-config.yaml")
        .group("DEFAULT_GROUP")
        .timeoutMs(3000)
        .build();

    ConfigQueryResult result = configService.getConfig(request);
    String content = result.getContent();
    String md5 = result.getMd5();  // Can be used for subsequent CAS publish

} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 3.12.2. Publish Config (Request Pattern)

```java
public PublishConfigResult publishConfig(PublishConfigRequest request) throws NacosException
```

**PublishConfigRequest Parameters**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| dataId | string | Configuration ID |
| group | string | Configuration group, defaults to `DEFAULT_GROUP` when empty |
| content | string | Configuration content |
| type | string | Configuration type, see `ConfigType`, uses default type when empty |
| casMd5 | string | Optional, expected MD5 for CAS (Compare-And-Swap) publish. When set, publish only succeeds if the server-side config MD5 matches |

**Return Value PublishConfigResult**

| Field | Type | Description |
| :--- | :--- | :--- |
| success | boolean | Whether publish succeeded |
| errorCode | int | Error code on failure, 0 indicates success |
| errorMessage | string | Detailed error message on failure |
| md5 | string | MD5 of the published config content |

**Example**

```java
try {
    ConfigService configService = NacosFactory.createConfigService(properties);

    // Normal publish
    PublishConfigRequest request = PublishConfigRequest.builder()
        .dataId("app-config.yaml")
        .group("DEFAULT_GROUP")
        .content("key: value")
        .type("yaml")
        .build();

    PublishConfigResult result = configService.publishConfig(request);
    if (result.isSuccess()) {
        System.out.println("Publish success, md5=" + result.getMd5());
    } else {
        System.out.println("Publish failed: code=" + result.getErrorCode()
            + ", msg=" + result.getErrorMessage());
    }

    // CAS publish (prevent concurrent overwrite)
    PublishConfigRequest casRequest = PublishConfigRequest.builder()
        .dataId("app-config.yaml")
        .group("DEFAULT_GROUP")
        .content("new content")
        .type("yaml")
        .casMd5("previous-md5-from-getConfig")
        .build();
    PublishConfigResult casResult = configService.publishConfig(casRequest);

} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 3.12.3. Delete Config (Request Pattern)

```java
public RemoveConfigResult removeConfig(RemoveConfigRequest request) throws NacosException
```

**RemoveConfigRequest Parameters**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| dataId | string | Configuration ID |
| group | string | Configuration group, defaults to `DEFAULT_GROUP` when empty |

**Return Value RemoveConfigResult**

| Field | Type | Description |
| :--- | :--- | :--- |
| success | boolean | Whether delete succeeded |
| errorCode | int | Error code on failure |
| errorMessage | string | Detailed error message on failure |

**Example**

```java
try {
    ConfigService configService = NacosFactory.createConfigService(properties);

    RemoveConfigRequest request = RemoveConfigRequest.builder()
        .dataId("app-config.yaml")
        .group("DEFAULT_GROUP")
        .build();

    RemoveConfigResult result = configService.removeConfig(request);
    if (result.isSuccess()) {
        System.out.println("Delete success");
    } else {
        System.out.println("Delete failed: " + result.getErrorMessage());
    }
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 3.12.4. 304 Conditional GET Cache Mechanism

Starting from version 3.3.0, `getConfig(GetConfigRequest)` supports 304 conditional GET caching, which can significantly reduce network transfer and server overhead.

**How It Works**

1. When the client calls `getConfig(GetConfigRequest)`, it automatically resolves the config content MD5 from local `CacheData` or snapshot files
2. Sends `localMd5` with the query request to the server
3. The server compares `localMd5` with the current config MD5:
   - **Match**: Returns 304 Not-Modified, response does not contain config content
   - **No match**: Returns 200 OK, response contains the latest config content and MD5
4. After receiving 304, the client reads content from the local snapshot; after receiving 200, it updates the local snapshot

**Applicable Scenarios**

- Large config content (e.g., over 10KB), saves network bandwidth on repeated reads
- High QPS config read scenarios, reduces server serialization and response building overhead
- When the client already has local cache, avoids repeatedly fetching the same content

**Usage**

No additional configuration required. Simply use `getConfig(GetConfigRequest)` to automatically enable 304 caching.

```java
// Automatic 304 (recommended)
ConfigQueryResult result = configService.getConfig(
    GetConfigRequest.builder()
        .dataId("large-config.yaml")
        .group("DEFAULT_GROUP")
        .timeoutMs(3000)
        .build());
```

#### 3.12.5. CAS Publish for Encrypted Configs

**Background**: The plaintext content of encrypted configs cannot be obtained through `getConfig()` (returns encrypted content), making it impossible to calculate casMd5 for CAS publish, posing a concurrent overwrite risk.

**Solution**: Use the Request/Result pattern API

1. Call `getConfig(GetConfigRequest)` to obtain `ConfigQueryResult`
2. Directly obtain the server-returned config MD5 via `result.getMd5()` (no plaintext content needed)
3. Pass this MD5 as `casMd5` to `PublishConfigRequest` for CAS publish

```java
try {
    ConfigService configService = NacosFactory.createConfigService(properties);

    // 1. Query encrypted config, obtain MD5
    ConfigQueryResult queryResult = configService.getConfig(
        GetConfigRequest.builder()
            .dataId("encrypted-config")
            .group("DEFAULT_GROUP")
            .timeoutMs(3000)
            .build());
    String casMd5 = queryResult.getMd5();

    // 2. Use MD5 for CAS publish (encrypted configs can also be safely published)
    PublishConfigResult publishResult = configService.publishConfig(
        PublishConfigRequest.builder()
            .dataId("encrypted-config")
            .group("DEFAULT_GROUP")
            .content("new encrypted content")
            .type("text")
            .casMd5(casMd5)
            .build());

    if (publishResult.isSuccess()) {
        System.out.println("Encrypted config CAS publish success");
    } else {
        System.out.println("CAS failed (config may have been modified by others): "
            + publishResult.getErrorMessage());
    }
} catch (NacosException e) {
    e.printStackTrace();
}
```

## 4. Service Discovery API

> **Tip for learning**: When you register an instance using the Service Discovery API, the instance will be removed from Nacos once the client process exits, so you won't see it in the Nacos console. For learning or debugging, you can keep the process running after registration (e.g. with `Thread.sleep()`) so you can verify in the Nacos console that the instance was registered successfully.

### 4.1. Register Instance
#### Description
Registers an instance to a service.

> Because the same Nacos Client instance can register only one instance to a service, if the same Nacos Client instance registers instances to the same service multiple times, the later instance overwrites the earlier one.
> For proxy registration scenarios, use [Batch Register Service Instances](#48-batch-register-service-instances).

```java
void registerInstance(String serviceName, String ip, int port) throws NacosException;

void registerInstance(String serviceName, String groupName, String ip, int port) throws NacosException;

void registerInstance(String serviceName, String ip, int port, String clusterName) throws NacosException;

void registerInstance(String serviceName, String groupName, String ip, int port, String clusterName) throws NacosException;

void registerInstance(String serviceName, Instance instance) throws NacosException;

void registerInstance(String serviceName, String groupName, Instance instance) throws NacosException;
```

#### Request Parameters

| Name        | Type | Description | Default Value |
|:------------|:-------|----------|---------------|
| serviceName | string | Service name | None, required |
| groupName   | string | Group name | DEFAULT_GROUP |
| ip          | string | Service instance IP | None, required |
| port        | int | Service instance port | None, required |
| clusterName | string | Cluster name | DEFAULT |
| instance    | See code comments | Instance properties | None, required |

#### Return Parameters
None.
#### Request Example
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));

// The following registration requests have the same result: they register an instance in group `DEFAULT_GROUP`
// for service `nacos.test.service` with IP `127.0.0.1`, port `8848`, and clusterName `DEFAULT`.
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

// Keep the process running so you can see the registered instance in the Nacos console (for learning/debugging)
Thread.sleep(300000); // e.g. keep for 5 minutes
```

### 4.2. Deregister Instance
#### Description
Deletes an instance from a service.

> If the service is registered through [Batch Register Service Instances](#48-batch-register-service-instances), using deregister instance will deregister all batch-registered instances.
> To deregister only some batch-registered instances, use [Batch Deregister Service Instances](#49-batch-deregister-service-instances).

```java
void deregisterInstance(String serviceName, String ip, int port) throws NacosException;

void deregisterInstance(String serviceName, String groupName, String ip, int port) throws NacosException;

void deregisterInstance(String serviceName, String ip, int port, String clusterName) throws NacosException;

void deregisterInstance(String serviceName, String groupName, String ip, int port, String clusterName) throws NacosException;

void deregisterInstance(String serviceName, Instance instance) throws NacosException;

void deregisterInstance(String serviceName, String groupName, Instance instance);
```

#### Request Parameters

| Name        | Type | Description | Default Value |
|:------------|:-------|----------|---------------|
| serviceName | string | Service name | None, required |
| groupName   | string | Group name | DEFAULT_GROUP |
| ip          | string | Service instance IP | None, required |
| port        | int | Service instance port | None, required |
| clusterName | string | Cluster name | DEFAULT |
| instance    | See code comments | Instance properties | None, required |

#### Return Parameters
None.
#### Request Example
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
// The following deregistration requests have the same result: they deregister an instance in group `DEFAULT_GROUP`
// for service `nacos.test.service` with IP `127.0.0.1`, port `8848`, and clusterName `DEFAULT`.
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

### 4.3. Get All Instances
#### Description
Gets all instances under a service.
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

#### Request Parameters

| Name        | Type | Description | Default Value |
|:------------|:--------|------------------------------------------------------------|---------------|
| serviceName | string | Service name | None, required |
| groupName   | string | Group name | DEFAULT_GROUP |
| subscribe   | Boolean | Whether to subscribe to the service. If `true`, the service is subscribed to and queries prefer the in-memory cache. If `false`, queries are sent directly to Nacos Server. | true |
| clusters    | List of strings | Instance `clusterName`. If the list is empty, all instances are queried. | Empty list |

#### Return Parameters
`List<Instance>` instance list.
#### Request Example
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
// The following query requests have the same result.
System.out.println(naming.getAllInstances("nacos.test.service"));
System.out.println(naming.getAllInstances("nacos.test.service", "DEFAULT_GROUP"));
System.out.println(naming.getAllInstances("nacos.test.service", true));
System.out.println(naming.getAllInstances("nacos.test.service", "DEFAULT_GROUP", true));
System.out.println(naming.getAllInstances("nacos.test.service", new ArrayList<>()));
System.out.println(naming.getAllInstances("nacos.test.service", "DEFAULT_GROUP", new ArrayList<>()));
System.out.println(naming.getAllInstances("nacos.test.service", new ArrayList<>(), true));
System.out.println(naming.getAllInstances("nacos.test.service", "DEFAULT_GROUP", new ArrayList<>(), true));
```

### 4.4. Get Healthy or Unhealthy Instances
#### Description
Gets a filtered instance list based on conditions.
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

#### Request Parameters

| Name        | Type | Description | Default Value |
|:------------|:--------|------------------------------------------------------------|---------------|
| serviceName | string | Service name | None, required |
| groupName   | string | Group name | DEFAULT_GROUP |
| subscribe   | Boolean | Whether to subscribe to the service. If `true`, the service is subscribed to and queries prefer the in-memory cache. If `false`, queries are sent directly to Nacos Server. | true |
| clusters    | List of strings | Instance `clusterName`. If the list is empty, all instances are queried. | Empty list |
| healthy     | boolean | Whether the instances are healthy. If `true`, only healthy instances are returned. Otherwise, unhealthy instances are returned. | true |

#### Return Parameters
`List<Instance>` instance list.
#### Request Example
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
// The following query requests have the same result.
System.out.println(naming.selectInstances("nacos.test.service", true));
System.out.println(naming.selectInstances("nacos.test.service", "DEFAULT_GROUP", true));
System.out.println(naming.selectInstances("nacos.test.service", true, true));
System.out.println(naming.selectInstances("nacos.test.service", "DEFAULT_GROUP", true, true));
System.out.println(naming.selectInstances("nacos.test.service", new ArrayList<>(), true));
System.out.println(naming.selectInstances("nacos.test.service", "DEFAULT_GROUP", new ArrayList<>(), true));
System.out.println(naming.selectInstances("nacos.test.service", new ArrayList<>(), true, true));
System.out.println(naming.selectInstances("nacos.test.service", "DEFAULT_GROUP", new ArrayList<>(), true, true));
```

### 4.5. Select One Healthy Instance
#### Description
Randomly selects one healthy instance based on the load-balancing algorithm.
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

#### Request Parameters

| Name        | Type | Description | Default Value |
|:------------|:--------|------------------------------------------------------------|---------------|
| serviceName | string | Service name | None, required |
| groupName   | string | Group name | DEFAULT_GROUP |
| subscribe   | Boolean | Whether to subscribe to the service. If `true`, the service is subscribed to and queries prefer the in-memory cache. If `false`, queries are sent directly to Nacos Server. | true |
| clusters    | List of strings | Instance `clusterName`. If the list is empty, all instances are queried. | Empty list |


#### Return Parameters
`Instance` instance.

#### Request Example
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
// The following query requests have the same result.
System.out.println(naming.selectOneHealthyInstance("nacos.test.service"));
System.out.println(naming.selectOneHealthyInstance("nacos.test.service", "DEFAULT_GROUP"));
System.out.println(naming.selectOneHealthyInstance("nacos.test.service", true));
System.out.println(naming.selectOneHealthyInstance("nacos.test.service", "DEFAULT_GROUP", true));
System.out.println(naming.selectOneHealthyInstance("nacos.test.service", new ArrayList<>()));
System.out.println(naming.selectOneHealthyInstance("nacos.test.service", "DEFAULT_GROUP", new ArrayList<>()));
System.out.println(naming.selectOneHealthyInstance("nacos.test.service", new ArrayList<>(), true));
System.out.println(naming.selectOneHealthyInstance("nacos.test.service", "DEFAULT_GROUP", new ArrayList<>(), true));
```

### 4.6. Subscribe to Service
#### Description
Listens for changes in the instance list under a service.
```java
void subscribe(String serviceName, EventListener listener) throws NacosException;

void subscribe(String serviceName, String groupName, EventListener listener) throws NacosException;

void subscribe(String serviceName, List<String> clusters, EventListener listener) throws NacosException;

void subscribe(String serviceName, String groupName, List<String> clusters, EventListener listener) throws NacosException;
```

#### Request Parameters

| Name        | Type | Description | Default Value |
|:------------|:--------------|-----------------------------|---------------|
| serviceName | string | Service name | None, required |
| groupName   | string | Group name | DEFAULT_GROUP |
| clusters    | List of strings | Instance `clusterName`. If the list is empty, all instances are queried. | Empty list |
| listener    | EventListener | Callback listener | None, required |

#### Return Parameters
None.

#### Request Example
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

#### Use a Custom Thread Pool for Asynchronous Listening

Nacos supports asynchronous listener callbacks with a custom thread pool. Replace `EventListener` with `AbstractEventListener` and implement the `Executor getExecutor()` method to return the custom thread pool. Nacos Client uses this thread pool for asynchronous callbacks when the service changes.

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

#### Listen to Service Change Diffs

Starting from Nacos 2.4.0, Nacos supports listening to service change diffs, including which instances are added, removed, or modified compared with the previous notification. Replace `EventListener` with `AbstractNamingChangeListener` and implement the `onChange` method. A `NamingChangeEvent` is passed to `onChange`, and `InstancesDiff` records the instance changes in this notification compared with the previous one.

To avoid issues caused by incorrect or abnormal diffs, `NamingChangeEvent` can still obtain the final service instance list through the `getInstances` method.

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

### 4.7. Unsubscribe from Service
#### Description
Cancels listening for changes in the instance list under a service.
```java
void unsubscribe(String serviceName, EventListener listener) throws NacosException;

void unsubscribe(String serviceName, String groupName, EventListener listener) throws NacosException;

void unsubscribe(String serviceName, List<String> clusters, EventListener listener) throws NacosException;

void unsubscribe(String serviceName, String groupName, List<String> clusters, EventListener listener) throws NacosException;
```

#### Request Parameters

| Name        | Type | Description | Default Value |
|:------------|:--------------|-----------------------------|---------------|
| serviceName | string | Service name | None, required |
| groupName   | string | Group name | DEFAULT_GROUP |
| clusters    | List of strings | Instance `clusterName`. If the list is empty, all instances are queried. | Empty list |
| listener    | EventListener | Callback listener | None, required |

> Note: When unsubscribing from a service, use the same `listener` that was used for subscription. Otherwise, unsubscription may fail.

#### Return Parameters
None.

#### Request Example
```java

NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
EventListener serviceListener = event -> {};
naming.subscribe("nacos.test.service", serviceListener);
naming.unsubscribe("nacos.test.service", serviceListener);
naming.unsubscribe("nacos.test.service", "DEFAULT_GROUP", serviceListener);
naming.unsubscribe("nacos.test.service", new ArrayList<>(), serviceListener);
naming.unsubscribe("nacos.test.service", "DEFAULT_GROUP", new ArrayList<>(), serviceListener);
```

### 4.8. Batch Register Service Instances

#### Description

Registers a series of instances to a specified service.

> Because the same Nacos Client instance can register only one instance to a service, if the same Nacos Client instance registers instances to the same service multiple times, the later instance overwrites the earlier one.
> To support proxy registration scenarios in the community, such as Nacos-Sync and Proxy-Registry, where different instances of the same service need to be registered from one client, the community added the batch registration capability.

```java
void batchRegisterInstance(String serviceName, String groupName, List<Instance> instances) throws NacosException;
```

#### Request Parameters

| Name        | Type | Description | Default Value |
|:------------|:--------------|--------|---------------|
| serviceName | string | Service name | None, required |
| groupName   | string | Group name | DEFAULT_GROUP |
| instances   | List of `Instance` | Service instance list | None, required |

#### Return Parameters
None.
#### Request Example
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

### 4.9. Batch Deregister Service Instances

#### Description

Deregisters a series of instances from a specified service.

> This API is designed for users who use batch registration. It allows users to deregister some or all batch-registered instances.

```java
void batchDeregisterInstance(String serviceName, String groupName, List<Instance> instances) throws NacosException;
```

#### Request Parameters

| Name        | Type | Description | Default Value |
|:------------|:--------------|--------|---------------|
| serviceName | string | Service name | None, required |
| groupName   | string | Group name | DEFAULT_GROUP |
| instances   | List of `Instance` | Service instance list | None, required |

#### Return Parameters
None.
#### Request Example
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

### 4.10. Subscribe to Service with Selector

#### Description

Uses a selector with custom logic to listen for changes in the instance list under a service. When the service list changes, the custom selector filters the data. A callback notification is sent only when the filtered data still changes.

```java
void subscribe(String serviceName, NamingSelector selector, EventListener listener) throws NacosException;

void subscribe(String serviceName, String groupName, NamingSelector selector, EventListener listener) throws NacosException;
```

#### Request Parameters

| Name        | Type | Description | Default Value |
|:------------|:---------------|-----------------------------|---------------|
| serviceName | string | Service name | None, required |
| groupName   | string | Group name | DEFAULT_GROUP |
| clusters    | List of strings | Instance `clusterName`. If the list is empty, all instances are queried. | Empty list |
| selector    | NamingSelector | Custom data selector | None, required |
| listener    | EventListener  | Callback listener | None, required |

#### Return Parameters
None.

#### Request Example
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
EventListener serviceListener = event -> {
    if (event instanceof NamingEvent) {
        System.out.println(((NamingEvent) event).getServiceName());
        System.out.println(((NamingEvent) event).getInstances());
    }
};
// Selects only subscribed instances whose IP starts with `127.0`.
NamingSelector selector = NamingSelectorFactory.newIpSelector("127.0.*");
naming.subscribe("nacos.test.service", "DEFAULT_GROUP", selector, serviceListener);

```

#### Built-in Data Selectors

Nacos Client provides multiple built-in data selectors for default scenarios:
1. Cluster selector: `NamingSelectorFactory.newClusterSelector(Collection<String> clusters)`. When the `clusters` parameter is passed during service subscription, Nacos Client automatically uses this data selector.
2. IP selector: `NamingSelectorFactory.newClusterSelector(String ipRegex)`. A callback is notified only when an instance IP matches the passed `ipRegex`.
3. Metadata selector: `NamingSelectorFactory.newMetadataSelector(Map<String, String> metadata)`. A callback is notified only when the instance metadata contains **all** metadata entries passed to the selector.
4. Any metadata selector: `NamingSelectorFactory.newMetadataSelector(Map<String, String> metadata, false)`. A callback is notified when the instance metadata contains **any one pair** of metadata entries passed to the selector.

#### Develop a Custom Data Selector

In most cases, creating a custom data selector only requires creating `DefaultNamingSelector`. During construction, pass a `Predicate<Instance> filter` as the result that determines whether a single instance meets your filtering conditions. This is similar to the `filter` method in Java streams, so you only need to consider the filtering condition for a single instance.

If `DefaultNamingSelector` cannot meet your requirements, implement the `NamingSelector` interface, perform complex logic validation based on the passed `NamingContext`, and finally output `NamingResult` to Nacos Client.

### 4.11. Unsubscribe from Service with Selector

#### Description

If you use a selector with custom logic to listen for changes in the instance list under a service, use the `unsubscribe from service with selector` API to correctly cancel the listener.

> Note: When unsubscribing, pass the same selector and listener used for subscription. Otherwise, unsubscription may fail.

```java
void unsubscribe(String serviceName, NamingSelector selector, EventListener listener) throws NacosException;

void unsubscribe(String serviceName, String groupName, NamingSelector selector, EventListener listener) throws NacosException;
```

#### Request Parameters

| Name        | Type | Description | Default Value |
|:------------|:---------------|-----------------------------|---------------|
| serviceName | string | Service name | None, required |
| groupName   | string | Group name | DEFAULT_GROUP |
| clusters    | List of strings | Instance `clusterName`. If the list is empty, all instances are queried. | Empty list |
| selector    | NamingSelector | Custom data selector | None, required |
| listener    | EventListener  | Callback listener | None, required |

#### Return Parameters
None.

#### Request Example
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
EventListener serviceListener = event -> {
    if (event instanceof NamingEvent) {
        System.out.println(((NamingEvent) event).getServiceName());
        System.out.println(((NamingEvent) event).getInstances());
    }
};
// Selects only subscribed instances whose IP starts with `127.0`.
NamingSelector selector = NamingSelectorFactory.newIpSelector("127.0.*");
naming.subscribe("nacos.test.service", "DEFAULT_GROUP", selector, serviceListener);
naming.unsubscribe("nacos.test.service", "DEFAULT_GROUP", selector, serviceListener);

```

### 4.12. Get Services with Pagination

#### Description

Get the list of services in the current client namespace with pagination.

```java
ListView<String> getServicesOfServer(int pageNo, int pageSize) throws NacosException;

ListView<String> getServicesOfServer(int pageNo, int pageSize, String groupName) throws NacosException;
```

> **Note**: The `getServicesOfServer` overloads that take `AbstractSelector` are **deprecated** and should not be used; they are not listed in this document. They will be marked with `@Deprecated` in the API in a future release. Use only the two-parameter or three-parameter overloads above.

#### Request Parameters

| Name      | Type | Description | Default Value |
|:----------|:----|------------|---------------|
| pageNo    | int | Page number | None, required |
| pageSize  | int | Number of services per page | None, required |
| groupName | string | Group name | DEFAULT_GROUP |

#### Return Parameters
Service name list: `ListView<String>`.

#### Request Example
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
// Equivalent to `naming.getServicesOfServer(1, 10, "DEFAULT_GROUP");`
ListView<String> result = naming.getServicesOfServer(1, 10);
System.out.println(result.getCount());
System.out.println(result.getData());
```

### 4.13. Get Services Subscribed by the Current Client

#### Description

Gets all services subscribed to by the current client.

```java
List<ServiceInfo> getSubscribeServices() throws NacosException;
```

#### Request Parameters

None.

#### Return Parameters
Service list: `List<ServiceInfo>`.

#### Request Example
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
System.out.println(naming.getSubscribeServices());
```



### 4.14. Fuzzy Watch Service

#### Description

The `fuzzyWatch` API can batch-subscribe to services that match the specified group rule and `serviceName` rule. Use `*` for prefix fuzzy matching, suffix fuzzy matching, or bilateral fuzzy matching.
<br/>Fuzzy watch pushes only service add and delete events. It does not directly push the instance list under a service. In a service fuzzy watch listener, you can use the `subscribe` API together with fuzzy watch to listen for changes in the instance list under a service.<br/>
For stability, Nacos applies upper-limit protection to the number of fuzzy watch rules and the number of services matched by a single rule. For details, see [Fuzzy Watch Service Capacity Protection](#fuzzy-watch-service-capacity-protection).

```java

/**
 * Subscribes to change events for all services in the current namespace that match the specified group rule and service name rule.
 *
 * @param serviceNamePattern service name matching rule
 * @param groupNamePattern group matching rule
 * @param watcher fuzzy watch listener
 */
void fuzzyWatch(String serviceNamePattern, String groupNamePattern, FuzzyWatchEventWatcher watcher)
		throws NacosException;

/**
 * Subscribes to change events for all services in the current namespace that match the specified group rule and serviceName rule,
 * and obtains the current matched service list in Future mode.
 * The fuzzy watch list is asynchronously returned through the watcher callback.
 * @param serviceNamePattern serviceName matching rule
 * @param groupNamePattern group matching rule
 * @param watcher fuzzy watch listener
 * @return Future that can be used to wait for the asynchronous service push result
 */
Future<ListView<String>> fuzzyWatchWithServiceKeys(String serviceNamePattern, String groupNamePattern,
		FuzzyWatchEventWatcher watcher) throws NacosException;


/**
 * Cancels the subscription to change events for all services in the current namespace that match the specified group rule.
 * @param serviceNamePattern service matching rule
 * @param groupNamePattern group matching rule
 * @param watcher fuzzy watch listener to remove
 */
void cancelFuzzyWatch(String serviceNamePattern, String groupNamePattern, FuzzyWatchEventWatcher watcher);


/**
 * Subscribes to change events for all services in the current namespace that match the specified group rule.
 *
 * @param groupNamePattern group matching rule
 * @param watcher fuzzy watch listener
 */
void fuzzyWatch(String groupNamePattern, FuzzyWatchEventWatcher watcher) throws NacosException;

/**
 * Subscribes to change events for all services in the current namespace that match the specified group rule.
 * A Future can be used to obtain the current matched service list.
 *
 * @param groupNamePattern group matching rule
 * @param watcher fuzzy watch listener
 * @return Future that can be used to wait for the asynchronous service push result
 */
Future<ListView<String>> fuzzyWatchWithServiceKeys(String groupNamePattern,
		FuzzyWatchEventWatcher watcher) throws NacosException;

/**
 * Cancels the subscription to service events for all services in the current namespace that match the specified group rule and service rule.
 *
 * @param groupNamePattern group matching rule
 * @param watcher fuzzy watch listener to remove
 */
void cancelFuzzyWatch(String groupNamePattern, FuzzyWatchEventWatcher watcher) ;


```

#### Request Parameters

| Parameter | Type | Description |
| :--- | :--- |:-----------------------------------------------------------------------------|
| serviceNamePattern | string | Service name matching rule. Supports prefix fuzzy matching, such as `myservice*`; suffix fuzzy matching, such as `*service`; and bilateral fuzzy matching, such as `*service*`. |
| groupNamePattern | string | Configuration group matching rule. Supports prefix fuzzy matching, such as `mygroup*`; suffix fuzzy matching, such as `*mygroup`; and bilateral fuzzy matching, such as `*mygroup*`. |
| watcher | FuzzyWatchEventWatcher | Fuzzy watch listener |


#### FuzzyWatchEventWatcher Fuzzy Watch Listener
| Method | Parameter Type | Description |
| :--- | :--- |:------------------------------------------------------------------------|
| onEvent | FuzzyWatchChangeEvent | Fuzzy watch callback event object |
| getExecutor | void | Specifies the thread pool used to execute callback events. If it is empty, callbacks are executed in the Nacos push thread. |

#### FuzzyWatchChangeEvent Fuzzy Watch Event
| Parameter   | Type   | Description |
|:------------|:-------|:------------------------------------------------------------------------------------------------------------------------|
| serviceName | string | Changed service name |
| groupName   | string | Group of the changed service |
| namespace   | string | Namespace of the changed service |
| changedType | string | Change type received by the client, including `ADD_SERVICE` for added services and `DELETE_SERVICE` for removed services |
| syncType    | string | Type that triggered the change, including `FUZZY_WATCH_INIT_NOTIFY` for initial push of the existing service list, `FUZZY_WATCH_DIFF_SYNC_NOTIFY` for change reconciliation, and `FUZZY_WATCH_RESOURCE_CHANGED` for service change push |



#### Return Parameters

| Type | Description |
| :--- |:----------------------------------------------------------------------------------------|
| Future<ListView<String>> | A Future object for the current matched service list. After the list of services matched by the rule is pushed to the client, you can obtain the list through the Future object.<br/>*Note: When capacity protection is triggered, the returned service list may be incomplete. |
```java
// The returned parameter is a serviceKey list. You can use the NamingUtils utility class to obtain serviceName, groupName, and namespace.
 String[] serviceKeyItems = NamingUtils.parseServiceKey(serviceKey);
 String namespace = serviceKeyItems[0];
 String groupName = serviceKeyItems[1];
 String serviceName = serviceKeyItems[2];
```
#### Fuzzy Watch Service Capacity Protection

For stability, to avoid server memory pressure and client push storms caused by too many rules or too many services matched by rules, Nacos provides capacity protection for fuzzy watch at two levels. When an upper limit is exceeded, fuzzy watch pushes are suppressed.<br/>
1. Upper-limit protection for the number of fuzzy watch rules. The default upper limit is 20 and can be adjusted by the `nacos.naming.fuzzy.watch.max.pattern.count` parameter.
2. Upper-limit protection for the number of services matched by a single fuzzy watch rule. The default upper limit is 500 and can be adjusted by the `nacos.naming.fuzzy.watch.max.pattern.match.service.count` parameter.

When registering a fuzzy watch listener in the `fuzzyWatch` API, the listener can also implement `FuzzyWatchLoadWatcher` to perceive capacity protection events.
#### FuzzyWatchLoadWatcher Fuzzy Watch Load Listener
| Method | Description |
| :--- |:-----------------------------|
| onPatternOverLimit | Triggered when pushes for the current fuzzy watch rule are suppressed because the rule count exceeds the upper limit |
| onServiceReachUpLimit | Triggered when pushes for the current fuzzy watch rule are suppressed because the number of matched services reaches the upper limit |

*Note:
1. When capacity protection is triggered, the service list returned by `fuzzyWatchWithServiceKeys` may be incomplete.
2. When service-count upper-limit protection is triggered, service offline events may also fail to be pushed because of the protection mechanism.


#### Request Example

```java
try {
		// Initialize the configuration service. The console automatically obtains the following parameters through the sample code.
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

### 4.15. Get server status

#### Description

Get the current naming server status.

```java
String getServerStatus();
```

#### Request parameters

None.

#### Return value

| Type | Description |
| :--- | :--- |
| String | Server status. |

#### Request example

```java
NamingService naming = NacosFactory.createNamingService("{serverAddr}");
String status = naming.getServerStatus();
System.out.println(status);
```

## 5. Distributed Lock API

:::note
The distributed lock capability was added in version 3.0. It is still experimental, and its ecosystem is not yet complete. There may be issues, so use it with caution.
:::

> The current version of distributed lock does not yet provide the corresponding operations API or lock listener API. Support will be added in later versions.

### 5.1. Acquire Distributed Lock

#### Description

This API attempts to acquire a distributed lock. It returns `false` if acquisition fails and `true` if acquisition succeeds.

```java
Boolean lock(LockInstance instance) throws NacosException;
```

#### Request Parameters

| Name     | Type | Description | Default Value |
|:---------|:-------------|------------|------|
| instance | LockInstance | Lock object instance for the distributed lock | None, required |

The `LockInstance` object contains the following parameters:

| Name        | Type | Description | Default Value |
|:------------|:-------------------|--------------------------------------------------|------|
| key         | String | Unique key of the distributed lock. For locks of the same type, the same key means the same lock is expected. | None, required |
| expiredTime | long | Expiration time of the distributed lock, in milliseconds. `0` means the lock is released immediately after it is acquired. If the configured value is less than 0, the default value `30000` is used. | 0 |
| params      | Map<String,String> | Custom parameters used to extend custom lock attributes | None |
| lockType    | String | Distributed lock type. Currently, only `"NACOS_LOCK"` is supported. | None |

> Nacos currently provides one default lock type implementation, `"NACOS_LOCK"`, which can be quickly created through `new NLock()`. More lock types will be supported later.

#### Return Parameters

Lock acquisition result `Boolean`. Returns `true` if the lock is acquired; otherwise returns `false`.

#### Request Example

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

### 5.2. Release Distributed Lock

#### Description

This API releases an acquired distributed lock. It returns `true` if release succeeds; otherwise returns `false`.

```java
Boolean unLock(LockInstance instance) throws NacosException;
```

#### Request Parameters

| Name     | Type | Description | Default Value |
|:---------|:-------------|------------|------|
| instance | LockInstance | Lock object instance for the distributed lock | None, required |

The `LockInstance` object contains the following parameters:

| Name        | Type | Description | Default Value |
|:------------|:-------------------|--------------------------------------------------|------|
| key         | String | Unique key of the distributed lock. For locks of the same type, the same key means the same lock is expected. | None, required |
| expiredTime | long | Expiration time of the distributed lock, in milliseconds. `0` means the lock is released immediately after it is acquired. If the configured value is less than 0, the default value `30000` is used. | 0 |
| params      | Map<String,String> | Custom parameters used to extend custom lock attributes | None |
| lockType    | String | Distributed lock type. Currently, only `"NACOS_LOCK"` is supported. | None |

> Nacos currently provides one default lock type implementation, `"NACOS_LOCK"`, which can be quickly created through `new NLock()`. More lock types will be supported later.

#### Return Parameters

Lock release result `Boolean`. Returns `true` if the lock is released; otherwise returns `false`.

#### Request Example

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

### 5.3. Remote Try Lock

#### Description

Use this API to directly send a remote lock request. The semantics are the same as `lock`: returns `true` on success and `false` on failure.

```java
Boolean remoteTryLock(LockInstance instance) throws NacosException;
```

#### Request Parameters

| Name     | Type | Description | Default Value |
|:---------|:-------------|------------|------|
| instance | LockInstance | Lock object instance for the distributed lock | None, required |

#### Return Parameters

Remote lock result `Boolean`: returns `true` if lock is acquired, otherwise `false`.

#### Request Example

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

### 5.4. Remote Release Lock

#### Description

Use this API to directly send a remote unlock request to release the distributed lock. Returns `true` on success and `false` on failure.

```java
Boolean remoteReleaseLock(LockInstance instance) throws NacosException;
```

#### Request Parameters

| Name     | Type | Description | Default Value |
|:---------|:-------------|------------|------|
| instance | LockInstance | Lock object instance for the distributed lock | None, required |

#### Return Parameters

Remote unlock result `Boolean`: returns `true` if lock is released, otherwise `false`.

#### Request Example

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

## 6. MCP Service

### 6.1. Query MCP Service

#### Description

This API queries the details of a specified MCP service, including its metadata and callable Endpoint information. When no version is specified, it queries the latest published version.

```java
McpServerDetailInfo getMcpServer(String mcpName) throws NacosException;

McpServerDetailInfo getMcpServer(String mcpName, String version) throws NacosException;
```

#### Request Parameters

| Name    | Type | Description | Default Value |
|:--------|:-------|---------|-----------------|
| mcpName | String | MCP service name | None, required |
| version | String | MCP service version | Empty. When empty, the latest published version is queried. |

#### Return Parameters

MCP service details: `McpServerDetailInfo`.

#### Request Example

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

### 6.2. Release New MCP Service Version

#### Description

This API releases a new MCP service version. If the MCP service is released for the first time, a new MCP service is created.

If the MCP service and specified version already exist, the request is idempotent and does not create or modify that version again.


```java
String releaseMcpServer(McpServerBasicInfo serverSpecification, McpToolSpecification toolSpecification) throws NacosException;

String releaseMcpServer(McpServerBasicInfo serverSpecification, McpToolSpecification toolSpecification, McpResourceSpecification resourceSpecification) throws NacosException;

String releaseMcpServer(McpServerBasicInfo serverSpecification, McpToolSpecification toolSpecification, McpEndpointSpec endpointSpecification) throws NacosException;

String releaseMcpServer(McpServerBasicInfo serverSpecification, McpToolSpecification toolSpecification, McpResourceSpecification resourceSpecification, McpEndpointSpec endpointSpecification) throws NacosException;
```

#### Request Parameters

| Name                  | Type | Description | Default Value |
|:----------------------|:-------------------------|---------------------|------|
| serverSpecification   | McpServerBasicInfo | MCP service basic information | None, required |
| toolSpecification     | McpToolSpecification | MCP service tool information | None, required |
| resourceSpecification | McpResourceSpecification | MCP service resource and resource template information | None, optional |
| endpointSpecification | McpEndpointSpec | MCP service endpoint information | None, optional |

#### Return Parameters

MCP service ID: `String`.

#### Request Example

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

### 6.3. Register MCP Service Endpoint

#### Description

Registers an MCP service endpoint to the specified MCP service version.

If the registered MCP service does not exist, a service-not-found exception is thrown.

```java
void registerMcpServerEndpoint(String mcpName, String address, int port) throws NacosException;

void registerMcpServerEndpoint(String mcpName, String address, int port, String version) throws NacosException;
```

#### Request Parameters

| Name    | Type | Description | Default Value |
|:--------|:-------|-----------------|--------------------------|
| mcpName | String | MCP service name | None, required |
| address | String | MCP service endpoint address | None, required |
| port    | int | MCP service endpoint port | None, required |
| version | String | MCP service version | Empty. When empty, the endpoint is registered to the latest version. |

#### Return Parameters

None.

#### Request Example

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

### 6.4. Deregister MCP Service Endpoint

#### Description

Deregisters an MCP service endpoint from the specified MCP service version.

```java
void deregisterMcpServerEndpoint(String mcpName, String address, int port) throws NacosException;
```

#### Request Parameters

| Name    | Type | Description | Default Value |
|:--------|:-------|-----------------|------|
| mcpName | String | MCP service name | None, required |
| address | String | MCP service endpoint address | None, required |
| port    | int | MCP service endpoint port | None, required |

#### Return Parameters

None.

#### Request Example

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

### 6.5. Subscribe to MCP Service

#### Description

Subscribes to an MCP service. When the MCP service releases a new version, a notification is received.

> In the current version, subscription is implemented through polling queries, so notifications may have some delay. You can configure the `nacosAiMcpServerCacheUpdateInterval` parameter to adjust the query interval. The default value is 10000 ms.

```java
McpServerDetailInfo subscribeMcpServer(String mcpName, AbstractNacosMcpServerListener mcpServerListener) throws NacosException;

McpServerDetailInfo subscribeMcpServer(String mcpName, String version, AbstractNacosMcpServerListener mcpServerListener) throws NacosException;
```

#### Request Parameters

| Name     | Type | Description | Default Value |
|:---------|:-------------------------------|----------|-----------------|
| mcpName  | String | MCP service name | None, required |
| version  | String | MCP service version | Empty. When empty, the latest version is subscribed to. |
| listener | AbstractNacosMcpServerListener | MCP service listener | None, required |

#### Return Parameters

When subscription succeeds, the current MCP service details `McpServerDetailInfo` are returned.

#### Request Example

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

### 6.6. Unsubscribe from MCP Service

#### Description

Unsubscribes from an MCP service. The `mcpServerListener` passed during unsubscription must be the same as the one used during subscription. Otherwise, unsubscription may fail.

```java
void unsubscribeMcpServer(String mcpName, AbstractNacosMcpServerListener mcpServerListener) throws NacosException;

void unsubscribeMcpServer(String mcpName, String version, AbstractNacosMcpServerListener mcpServerListener) throws NacosException;
```

#### Request Parameters

| Name     | Type | Description | Default Value |
|:---------|:-------------------------------|----------|-------------------|
| mcpName  | String | MCP service name | None, required |
| version  | String | MCP service version | Empty. When empty, the latest version is unsubscribed from. |
| listener | AbstractNacosMcpServerListener | MCP service listener | None, required |

#### Return Parameters

None.

#### Request Example

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

## 7. A2A Registry

### 7.1. Query AgentCard

#### Description

Queries an AgentCard.

```java
AgentCardDetailInfo getAgentCard(String agentName) throws NacosException;

AgentCardDetailInfo getAgentCard(String agentName, String version) throws NacosException;

AgentCardDetailInfo getAgentCard(String agentName, String version, String registrationType) throws NacosException;
```

#### Request Parameters

| Name             | Type | Description | Default Value |
|:-----------------|:-------|---------|----------------------------------------------|
| agentName        | String | Agent name | None, required |
| version          | String | Agent version | Empty. When empty, the latest version is queried. |
| registrationType | String | Registration type | Empty. When empty, `url` is automatically filled based on the `registrationType` used during registration. |

#### Return Parameters

When the query succeeds, the current AgentCard details `AgentCardDetailInfo` are returned.

#### Request Example

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

### 7.2. Release New AgentCard Version

#### Description

Releases a new AgentCard version. If release fails, an exception is thrown.

```java
void releaseAgentCard(AgentCard agentCard) throws NacosException;

void releaseAgentCard(AgentCard agentCard, String registrationType) throws NacosException;

void releaseAgentCard(AgentCard agentCard, String registrationType, boolean setAsLatest) throws NacosException;
```

#### Request Parameters

| Name             | Type | Description | Default Value |
|:-----------------|:----------|------------------------------------------------------------------------------------------------------------------------|-----------|
| agentCard        | AgentCard | AgentCard information | None, required |
| registrationType | String | Registration type. Optional values are `URL` and `SERVICE`. The default value is `URL`. It sets the default way to obtain the `url` of this AgentCard. `URL` means reading the `url` directly from registration, and `SERVICE` means generating the `url` based on the endpoint registered in Nacos. | `SERVICE` |
| setAsLatest      | boolean | Whether to set this AgentCard as the latest version | `false` |


#### Return Parameters

None.

#### Request Example

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

### 7.3. Register Agent Endpoint

#### Description

Registers an endpoint under an AgentCard.

```java
void registerAgentEndpoint(String agentName, String version, String address, int port) throws NacosException;

void registerAgentEndpoint(String agentName, String version, String address, int port, String transport) throws NacosException;

void registerAgentEndpoint(String agentName, String version, String address, int port, String transport, String path) throws NacosException;

void registerAgentEndpoint(String agentName, String version, String address, int port, String transport, String path, boolean supportTls) throws NacosException;

void registerAgentEndpoint(String agentName, AgentEndpoint endpoint) throws NacosException;
```

#### Request Parameters

| Name       | Type | Description | Default Value |
|:-----------|:--------------|----------------------------------------------|-----------|
| agentName  | String | Agent name | None, required |
| version    | String | Agent version | None, required |
| address    | String | Agent IP address | None, required |
| port       | int | Agent port | None, required |
| transport  | String | Transport method of the endpoint: `JSONRPC`, `GRPC`, or `HTTP+JSON` | `JSONRPC` |
| path       | String | Access path of the endpoint | Empty string |
| supportTls | boolean | Whether TLS is supported | `false` |
| endpoint   | AgentEndpoint | AgentEndpoint | None, required |

#### Return Parameters

None.

#### Request Example

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

### 7.4. Deregister Agent Endpoint

#### Description

Deregisters an endpoint from an AgentCard.

```java
void deregisterAgentEndpoint(String agentName, String version, String address, int port) throws NacosException;

void deregisterAgentEndpoint(String agentName, AgentEndpoint endpoint) throws NacosException;
```

#### Request Parameters

| Name      | Type | Description | Default Value |
|:----------|:--------------|---------------|------|
| agentName | String | Agent name | None, required |
| version   | String | Agent version | None, required |
| address   | String | Agent IP address | None, required |
| port      | int | Agent port | None, required |
| endpoint  | AgentEndpoint | AgentEndpoint | None, required |

#### Return Parameters

None.

#### Request Example

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

### 7.5. Subscribe to AgentCard

#### Description

Subscribes to an AgentCard. When the AgentCard releases a new version, a notification is received.

> In the current version, subscription is implemented through polling queries, so notifications may have some delay. You can configure the `nacosAiAgentCardCacheUpdateInterval` parameter to adjust the query interval. The default value is 10000 ms.

```java
AgentCardDetailInfo subscribeAgentCard(String agentName, AbstractNacosAgentCardListener agentCardListener) throws NacosException;

AgentCardDetailInfo subscribeAgentCard(String agentName, String version, AbstractNacosAgentCardListener agentCardListener) throws NacosException;
```

#### Request Parameters

| Name      | Type | Description | Default Value |
|:----------|:-------------------------------|---------|-------------|
| agentName | String | Agent name | None, required |
| version   | String | Agent version | When empty, the latest version is subscribed to. |
| listener  | AbstractNacosAgentCardListener | Listener | None, required |

#### Return Parameters

When subscription succeeds, the current AgentCard details `AgentCardDetailInfo` are returned.

#### Request Example

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

### 7.6. Unsubscribe from AgentCard

Unsubscribes from an AgentCard. The `agentCardListener` passed during unsubscription must be the same as the one used during subscription. Otherwise, unsubscription may fail.

#### Description

```java
void unsubscribeAgentCard(String agentName, AbstractNacosAgentCardListener agentCardListener) throws NacosException;

void unsubscribeAgentCard(String agentName, String version, AbstractNacosAgentCardListener agentCardListener) throws NacosException;
```

#### Request Parameters

| Name      | Type | Description | Default Value |
|:----------|:-------------------------------|---------|---------------|
| agentName | String | Agent name | None, required |
| version   | String | Agent version | When empty, the latest version is unsubscribed from. |
| listener  | AbstractNacosAgentCardListener | Listener | None, required |

#### Return Parameters

None.

#### Request Example

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

### 7.7. Batch Register Agent Endpoints

Batch-registers multiple endpoints under an AgentCard.

> The same client can register only one set of endpoints to one AgentCard. Therefore, this API conflicts with [Register Agent Endpoint](#73-register-agent-endpoint): endpoints batch-registered by this API overwrite the previously registered endpoints for the same Agent.
> If the same client registers endpoints for multiple different AgentCards, they do not overwrite each other.

> This API is available since version 3.1.1.

#### Description

```java
void registerAgentEndpoint(String agentName, Collection<AgentEndpoint> endpoints) throws NacosException;
```

#### Request Parameters

| Name      | Type | Description | Default Value |
|:----------|:--------------------------|-------------------|-----------|
| agentName | String | Agent name | None, required |
| endpoints | Collection<AgentEndpoint> | Agent endpoint collection | None, required |

> Note: The `version` of all `AgentEndpoint` objects in `endpoints` should be non-empty and the same.

#### Return Parameters

None.

#### Request Example

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

## 8. Skill Capabilities

> Skills are distributed via the Java SDK as ZIP packages containing SKILL.md and all resource files (binary resources are decoded from Base64 back to raw bytes). The SDK currently exposes three download variants: by name, by version, and by label, and also supports subscribing to Skill changes.

### 8.1. Download Skill ZIP

#### Description

Download the latest Skill ZIP package (byte array) by skill name.

```java
byte[] downloadSkillZip(String skillName) throws NacosException;
```

#### Request Parameters

| Name      | Type   | Description                    | Default     |
|:----------|:-------|--------------------------------|-------------|
| skillName | String | Skill name (unique identifier) | — required  |

#### Response

Skill ZIP bytes `byte[]` containing SKILL.md and all resource files.

#### Example

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

#### Exceptions

Throws NacosException when the skill is not found or on query error.

### 8.2. Download Skill ZIP by Version

#### Description

Download a specific version of the Skill ZIP package (byte array) by skill name and version.

```java
byte[] downloadSkillZipByVersion(String skillName, String version) throws NacosException;
```

#### Request Parameters

| Name      | Type   | Description                              | Default     |
|:----------|:-------|------------------------------------------|-------------|
| skillName | String | Skill name (unique identifier)           | — required  |
| version   | String | Target skill version; latest when null   | —           |

#### Response

Skill ZIP bytes `byte[]`.

#### Example

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

#### Exceptions

Throws NacosException when the skill or specified version is not found, or on query error.

### 8.3. Download Skill ZIP by Label

#### Description

Download a labeled Skill ZIP package (byte array) by skill name and label.

```java
byte[] downloadSkillZipByLabel(String skillName, String label) throws NacosException;
```

#### Request Parameters

| Name      | Type   | Description                                    | Default     |
|:----------|:-------|------------------------------------------------|-------------|
| skillName | String | Skill name (unique identifier)                 | — required  |
| label     | String | Target label (for example: `latest`, `stable`) | — required  |

#### Response

Skill ZIP bytes `byte[]`.

#### Example

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

#### Exceptions

Throws NacosException when the skill or specified label is not found, or on query error.

### 8.4. Subscribe Skill

#### Description

Subscribe to Skill changes; the listener is invoked when the Skill ZIP content changes. version and label are optional to narrow the subscription.

```java
byte[] subscribeSkill(String skillName, String version, String label, AbstractNacosSkillListener skillListener) throws NacosException;
```

#### Request Parameters

| Name          | Type                       | Description                          | Default     |
|:--------------|:---------------------------|--------------------------------------|-------------|
| skillName     | String                     | Skill name                           | — required  |
| version       | String                     | Target skill version, optional       | —           |
| label         | String                     | Target label, optional               | —           |
| skillListener | AbstractNacosSkillListener | Callback listener for Skill changes  | — required  |

#### Response

Returns current Skill ZIP bytes `byte[]` when subscribed successfully; may be null if the skill is not found.

#### Example

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

#### Exceptions

Throws NacosException when request parameters are invalid or subscription processing fails.

### 8.5. Unsubscribe Skill

#### Description

Unsubscribe from Skill changes. skillName, version, label, and listener must match those used when subscribing.

```java
void unsubscribeSkill(String skillName, String version, String label, AbstractNacosSkillListener skillListener) throws NacosException;
```

#### Request Parameters

| Name          | Type                       | Description                       | Default     |
|:--------------|:---------------------------|-----------------------------------|-------------|
| skillName     | String                     | Skill name                        | — required  |
| version       | String                     | Target version, optional          | —           |
| label         | String                     | Target label, optional            | —           |
| skillListener | AbstractNacosSkillListener | Listener used when subscribing    | — required  |

#### Response

None.

#### Example

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

#### Exceptions

Throws NacosException when request parameters are invalid or unsubscribe processing fails.

## 9. Prompt Capabilities

### 9.1. Get Prompt

#### Description

Get the Prompt object for the current version by prompt key.

```java
Prompt getPrompt(String promptKey) throws NacosException;
```

#### Request Parameters

| Name      | Type | Description | Default Value |
|:----------|:-------|-----------------|------|
| promptKey | String | Prompt key (unique identifier) | None, required |

#### Return Parameters

| Type | Description |
| :--- | :--- |
| Prompt | Prompt object for current version |

#### Request Example

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

#### Exceptions

Throws NacosException when prompt not found or query error.

### 9.2. Get Prompt by Version

#### Description

Get the Prompt object by prompt key and version. Returns latest version when version is null.

```java
Prompt getPromptByVersion(String promptKey, String version) throws NacosException;
```

#### Request Parameters

| Name      | Type | Description | Default Value |
|:----------|:-------|-----------------------|------|
| promptKey | String | Prompt key (unique identifier) | None, required |
| version   | String | Target version. `null` means latest. | None |

#### Return Parameters

| Type | Description |
| :--- | :--- |
| Prompt | Prompt object for the specified version |

#### Request Example

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

### 9.3. Get Prompt by Label

#### Description

Get the Prompt object by prompt key and label.

```java
Prompt getPromptByLabel(String promptKey, String label) throws NacosException;
```

#### Request Parameters

| Name      | Type | Description | Default Value |
|:----------|:-------|-------------------|------|
| promptKey | String | Prompt key (unique identifier) | None, required |
| label     | String | Target label | None, required |

#### Return Parameters

| Type | Description |
| :--- | :--- |
| Prompt | Prompt object for that label |

#### Request Example

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

### 9.4. Subscribe Prompt

#### Description

Subscribe to prompt changes; the listener is invoked when prompt configuration changes. version and label are optional to narrow the subscription.

```java
Prompt subscribePrompt(String promptKey, String version, String label, AbstractNacosPromptListener promptListener) throws NacosException;
```

#### Request Parameters

| Name           | Type | Description | Default Value |
|:---------------|:---------------------------|-----------------|------|
| promptKey      | String | Prompt key | None, required |
| version        | String | Target version, optional | None |
| label          | String | Target label, optional | None |
| promptListener | AbstractNacosPromptListener | Callback listener for prompt changes | None, required |

#### Return Parameters

| Type | Description |
| :--- | :--- |
| Prompt | Current Prompt on subscribe success, or null if not found |

#### Request Example

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

### 9.5. Unsubscribe Prompt

#### Description

Unsubscribe from prompt changes. version, label, and listener must match those used when subscribing.

```java
void unsubscribePrompt(String promptKey, String version, String label, AbstractNacosPromptListener promptListener) throws NacosException;
```

#### Request Parameters

| Name           | Type | Description | Default Value |
|:---------------|:---------------------------|-------------|------|
| promptKey      | String | Prompt key | None, required |
| version        | String | Target version, optional | None |
| label          | String | Target label, optional | None |
| promptListener | AbstractNacosPromptListener | Listener used when subscribing | None, required |

#### Return Parameters

None.

#### Request Example

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

## 10. AgentSpec Capabilities

### 10.1. Load AgentSpec

#### Description

Load the complete AgentSpec object by AgentSpec name, including main configuration and all resource configurations.

```java
AgentSpec loadAgentSpec(String agentSpecName) throws NacosException;
```

#### Request Parameters

| Name          | Type | Description | Default Value |
|:-----------|:-------|------------------------|------|
| agentSpecName | String | AgentSpec name (unique identifier) | None, required |

#### Return Parameters

Returns AgentSpec object `AgentSpec` on success.

#### Request Example

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

### 10.2. Subscribe AgentSpec

#### Description

Subscribe to a specific AgentSpec. The listener is invoked when the AgentSpec configuration changes.

```java
AgentSpec subscribeAgentSpec(String agentSpecName, AbstractNacosAgentSpecListener agentSpecListener)
        throws NacosException;
```

#### Request Parameters

| Name          | Type | Description | Default Value |
|:-------------|:---------------------------------|-------------------------|------|
| agentSpecName | String | AgentSpec name | None, required |
| agentSpecListener | AbstractNacosAgentSpecListener | Callback listener for AgentSpec changes | None, required |

#### Return Parameters

Returns current AgentSpec `AgentSpec` when subscribed successfully; may be null if not found.

#### Request Example

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

### 10.3. Unsubscribe AgentSpec

#### Description

Unsubscribe from a specific AgentSpec. The listener must be the same instance used during subscription.

```java
void unsubscribeAgentSpec(String agentSpecName, AbstractNacosAgentSpecListener agentSpecListener)
        throws NacosException;
```

#### Request Parameters

| Name          | Type | Description | Default Value |
|:-------------|:---------------------------------|---------------------|------|
| agentSpecName | String | AgentSpec name | None, required |
| agentSpecListener | AbstractNacosAgentSpecListener | Listener used when subscribing | None, required |

#### Return Parameters

None.

#### Request Example

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

## 11. Agent Management and Discovery

The Agent management and discovery APIs are the protocol-neutral primary entry point for Agent integrations. They cover catalog search, definition discovery, local polling subscriptions, definition publication, and Runtime Endpoint registration. The legacy A2A APIs in Chapter 7 remain available during the compatibility period, but this Agent API set is intended to replace them. New users and SDK implementations should integrate with the Agent management and discovery APIs first instead of the legacy A2A APIs.

Agent APIs use the namespace configured when the `AiService` is created. The SDK copies each request and binds that namespace without mutating the caller-owned object. All APIs in this chapter are available since version 3.3.0.

### 11.1. Search Agents

#### Description

Search for visible and enabled Agents that have at least one online version in the current namespace. `agentNameContains` performs a case-sensitive literal substring match. Values in `tagsAll` are ANDed, while values in `protocolsAny` are ORed.

```java
Page<AgentCatalogEntry> searchAgents(AgentSearchRequest request) throws NacosException;
```

#### Request Parameters

| Name    | Type               | Description             | Default Value |
|:--------|:-------------------|-------------------------|---------------|
| request | AgentSearchRequest | Agent search conditions | None, required |

`AgentSearchRequest` contains the following fields:

| Name              | Type           | Description                                                      | Default Value |
|:------------------|:---------------|------------------------------------------------------------------|---------------|
| namespaceId       | String         | Injected from `AiService` by the SDK; callers should leave it unset | SDK namespace |
| agentNameContains | String         | Case-sensitive literal substring of the Agent name               | None |
| tagsAll           | List\<String\> | Tags that the Agent must contain                                  | None |
| protocolsAny      | List\<String\> | Calling protocols that any online version may expose             | None |
| pageNo            | Integer        | One-based page number                                             | 1 |
| pageSize          | Integer        | Number of entries per page, from 1 through 100                    | 20 |

#### Return Parameters

Returns `Page<AgentCatalogEntry>` with the total count, current page number, available page count, and Agent catalog entries. Each entry contains Agent presentation metadata, the latest version, and label and protocol summaries for every online version. It does not contain Endpoints.

#### Request Example

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

#### Exceptions

Throws `NacosException` when the request is null, page parameters are out of range, a request namespace differs from the SDK namespace, or the remote request fails.

### 11.2. Discover an Agent

#### Description

Resolve a complete Agent discovery snapshot by Agent name and an optional exact version or label. An optional filter can prune calling protocols and Endpoint sets. The filter only prunes the current result: it neither selects another Agent version nor performs load balancing.

```java
AgentDiscoveryResult discoverAgent(AgentReference reference) throws NacosException;

AgentDiscoveryResult discoverAgent(AgentReference reference, AgentDiscoveryFilter filter)
        throws NacosException;
```

#### Request Parameters

| Name      | Type                   | Description                                                   | Default Value |
|:----------|:-----------------------|---------------------------------------------------------------|---------------|
| reference | AgentReference         | Agent reference                                               | None, required |
| filter    | AgentDiscoveryFilter   | Optional protocol, transport, Endpoint-source, and metadata filter | None |

`AgentReference` contains the following fields:

| Name      | Type   | Description                                                | Default Value |
|:----------|:-------|------------------------------------------------------------|---------------|
| agentName | String | Agent name                                                 | None, required |
| version   | String | Exact online version; mutually exclusive with `label`     | None |
| label     | String | Label resolved to an online version at request time; mutually exclusive with `version` | None |

Every `AgentDiscoveryFilter` field is optional:

| Name             | Type                   | Description                                                       |
|:-----------------|:-----------------------|-------------------------------------------------------------------|
| protocols        | List\<String\>         | Allowed calling protocols; values are ORed                         |
| protocolVersion  | String                 | Exact protocol-version match against candidate interfaces          |
| transports       | List\<String\>         | Allowed transports; values are ORed                                |
| endpointSources  | List\<EndpointSource\> | Allowed `RUNTIME` or `DECLARED` sources                            |
| metadataSelector | Map\<String, String\>  | Exact key/value pairs that Endpoint metadata must contain          |

#### Return Parameters

Returns `AgentDiscoveryResult`, containing the namespace, Agent name, resolved exact version, `contentDigest`, and calling interfaces with resolved Endpoint sets. The returned `endpointSets` are authoritative for this discovery snapshot.

When both `version` and `label` are absent, definition metadata uses the current latest version while Runtime Endpoints may be compatible with any current online version. Explicit `label=latest` is stricter: both definition metadata and Runtime Endpoints are restricted to the current latest version.

#### Request Example

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

#### Exceptions

Throws `NacosException` when the Agent reference is invalid, `version` and `label` are both set, the filter is invalid, the Agent or target version does not exist, or the remote request fails.

### 11.3. Subscribe to an Agent

#### Description

Start an SDK-local polling subscription with the same Agent reference and optional filter used by Discover. This is not a server Watch or Push operation. If the target is initially absent, the method returns `null` but retains the polling task. When the target appears, or the resolved version, `contentDigest`, or any `sourceRevision` changes, the listener receives a new complete replacement snapshot.

```java
AgentDiscoveryResult subscribeAgent(AgentReference reference,
        AbstractNacosAgentDiscoveryListener listener) throws NacosException;

AgentDiscoveryResult subscribeAgent(AgentReference reference, AgentDiscoveryFilter filter,
        AbstractNacosAgentDiscoveryListener listener) throws NacosException;
```

#### Request Parameters

| Name      | Type                                   | Description                                      | Default Value |
|:----------|:---------------------------------------|--------------------------------------------------|---------------|
| reference | AgentReference                         | Same Agent reference used by Discover            | None, required |
| filter    | AgentDiscoveryFilter                   | Same optional filter used by Discover             | None |
| listener  | AbstractNacosAgentDiscoveryListener    | Listener for complete replacement snapshots      | None, required |

#### Return Parameters

Returns the current `AgentDiscoveryResult`. Returns `null` while the target is absent without canceling the polling task.

#### Request Example

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

#### Exceptions

Throws `NacosException` when the reference, filter, or listener is invalid, or the initial Discover request fails.

### 11.4. Unsubscribe from an Agent

#### Description

Cancel an SDK-local Agent polling subscription. Pass the same `AgentReference`, equivalent filter, and listener instance that were used to subscribe.

```java
void unsubscribeAgent(AgentReference reference,
        AbstractNacosAgentDiscoveryListener listener) throws NacosException;

void unsubscribeAgent(AgentReference reference, AgentDiscoveryFilter filter,
        AbstractNacosAgentDiscoveryListener listener) throws NacosException;
```

#### Request Parameters

| Name      | Type                                   | Description                                      | Default Value |
|:----------|:---------------------------------------|--------------------------------------------------|---------------|
| reference | AgentReference                         | Agent reference used to subscribe                | None, required |
| filter    | AgentDiscoveryFilter                   | Filter used to subscribe; use `null` for an unfiltered subscription | None |
| listener  | AbstractNacosAgentDiscoveryListener    | Same listener instance used to subscribe         | None, required |

#### Return Parameters

None.

#### Request Example

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

#### Exceptions

Throws `NacosException` when the reference, filter, or listener is invalid.

### 11.5. Register Agent Runtime Endpoints

#### Description

Register this SDK publisher's complete Runtime Endpoint batch for one Agent protocol. Registering the same `(agentName, protocol)` again for the same publisher completely replaces the previous batch, so omitted Endpoints are removed. The SDK retains the complete batch as redo intent after reconnecting. Endpoint registration does not implicitly create an Agent definition.

```java
void registerAgentEndpoints(AgentEndpointRegistrationBatch batch) throws NacosException;
```

#### Request Parameters

| Name  | Type                             | Description                          | Default Value |
|:------|:---------------------------------|--------------------------------------|---------------|
| batch | AgentEndpointRegistrationBatch   | Complete Endpoint registration batch | None, required |

`AgentEndpointRegistrationBatch` contains the following fields:

| Name           | Type             | Description                                                            | Default Value |
|:---------------|:-----------------|------------------------------------------------------------------------|---------------|
| namespaceId    | String           | Injected from `AiService` by the SDK; callers should leave it unset    | SDK namespace |
| agentName      | String           | Agent name                                                             | None, required |
| runtimeVersion | String           | Version of the deployed implementation                                 | None, required |
| versionRange   | String           | Agent-version range served by this deployment; must contain `runtimeVersion` | `[runtimeVersion]` |
| protocol       | String           | Canonical protocol token for the Endpoints                              | None, required |
| endpoints      | List\<Endpoint\> | This publisher's complete Endpoint set, containing 1 through 1000 entries | None, required |

`Endpoint` contains the following fields:

| Name      | Type                 | Description                                      | Default Value |
|:----------|:---------------------|--------------------------------------------------|---------------|
| uri       | String               | Complete absolute calling URI                    | None, required |
| transport | String               | Canonical transport, such as `HTTP+JSON`         | None, required |
| priority  | Integer              | Priority; lower values are preferred             | 0 |
| weight    | Double               | Weight among Endpoints with the same priority    | 1 |
| metadata  | Map\<String, String\> | Flat Endpoint metadata                         | None |

> Do not set `healthy` in a registration request. Health is supplied in discovery results.

#### Return Parameters

None.

#### Request Example

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

#### Exceptions

Throws `NacosException` when the batch or an Endpoint is invalid, `versionRange` does not contain `runtimeVersion`, the request carries a namespace different from the SDK namespace, or publication fails.

### 11.6. Deregister Agent Runtime Endpoints

#### Description

Remove Endpoints by their `uri` and `transport` natural keys from the complete batch cached by this SDK publisher. The SDK registers the complete retained batch again. When no Endpoint remains, it deregisters this publisher's entire publication under `(agentName, protocol)`.

```java
void deregisterAgentEndpoints(AgentEndpointDeregistrationBatch batch) throws NacosException;
```

#### Request Parameters

| Name  | Type                               | Description                           | Default Value |
|:------|:-----------------------------------|---------------------------------------|---------------|
| batch | AgentEndpointDeregistrationBatch   | Endpoint deregistration intent batch  | None, required |

`AgentEndpointDeregistrationBatch` contains the Agent name, protocol, and the Endpoints to remove. The SDK injects `namespaceId`. Each Endpoint in the list needs only the natural-key fields `uri` and `transport`.

#### Return Parameters

None.

#### Request Example

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

#### Exceptions

Throws `NacosException` when the batch or Endpoint natural key is invalid, the request carries a namespace different from the SDK namespace, or publication fails.

### 11.7. Publish an Agent Definition from Code

#### Description

Publish one exact Agent version from application code. The request uses the `AiService` namespace. The SDK copies the request and never mutates the caller-owned object. With `autoSubmit=false`, it only creates or returns an equivalent draft. With `autoSubmit=true`, it runs the ordinary submit pipeline after creating the draft and returns the final observable `reviewing`, `reviewed`, or `online` version. This is not a force-publish operation.

Equivalent retries for the same namespace, Agent, and exact version are idempotent and converge on the existing state. An existing draft can be resumed by changing only `autoSubmit` to `true` on the same request. Different content, author, change description, or explicitly supplied initial metadata is a conflict. `autoSubmit=false` cannot move an advanced version back to draft.

> The `AgentProvider` and `AgentVersionDetail` types in this section are from `com.alibaba.nacos.api.ai.model.agent`, not the same-named legacy A2A types under `com.alibaba.nacos.api.ai.model.a2a`.

```java
AgentVersionDetail publishAgent(AgentPublishRequest request) throws NacosException;
```

#### Request Parameters

| Name    | Type                | Description                      | Default Value |
|:--------|:--------------------|----------------------------------|---------------|
| request | AgentPublishRequest | Agent definition publication request | None, required |

`AgentPublishRequest` reuses the fields from `AgentDraftCreateRequest` and adds `autoSubmit`:

| Name              | Type                       | Description                                                          | Default Value |
|:------------------|:---------------------------|----------------------------------------------------------------------|---------------|
| agentName         | String                     | Agent name                                                           | None, required |
| displayName       | String                     | Optional presentation name when the Agent is first created           | None |
| description       | String                     | Optional catalog description when the Agent is first created         | None |
| iconUrl           | String                     | Optional icon URI when the Agent is first created                     | None |
| provider          | AgentProvider              | Optional provider `name` and `url` when the Agent is first created    | None |
| tags              | List\<String\>             | Optional public catalog tags when the Agent is first created          | None |
| extensions        | Map\<String, Object\>      | Optional public extensions when the Agent is first created            | None |
| version           | String                     | Exact SemVer version to create                                        | None, required |
| callInterfaces    | List\<AgentCallInterface\> | Non-empty ordered protocol definitions; exactly one of this and `basedOnVersion` must be set | Conditionally required |
| basedOnVersion    | String                     | Exact source version whose content is reused; mutually exclusive with `callInterfaces` | Conditionally required |
| author            | String                     | Version author                                                        | None |
| changeDescription | String                     | Version change description                                            | None |
| autoSubmit        | boolean                    | Whether to run the ordinary submit pipeline after draft creation      | false |

`AgentCallInterface` contains the protocol, optional protocol version, `descriptorMediaType`, native `nativeDescriptor`, a non-empty `endpointSourceOrder`, and optional declared Endpoints. Protocols cannot repeat within one version.

The first version of an Agent must provide `callInterfaces` directly because no source version exists yet; `basedOnVersion` is invalid for that initial creation. A subsequent version must still choose exactly one of direct content and one exact source version.

#### Return Parameters

Returns the exact `AgentVersionDetail`, including the namespace, Agent name, version, current status, calling interfaces, author, change description, `contentDigest`, and audit timestamps.

#### Request Example

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

#### Exceptions

Throws `NacosException` when the request is null, the version or definition is invalid, `callInterfaces` and `basedOnVersion` do not follow the exclusive-or rule, content or state conflicts, submit fails, or the current `AiService` implementation does not support this capability.

## 12. Java SDK Lifecycle

The lifecycle of the Nacos Java SDK starts when the SDK instance is created and ends when the `shutdown()` method is called. During this period, the corresponding thread pools, connections, and other resources remain reserved. Even if the connection is disconnected, the SDK keeps retrying to re-establish the connection.

Therefore, pay attention to the number of Nacos Java SDK instances created in your application to avoid thread pool and connection leaks. When replacing a Nacos Java SDK instance, remember to call the `shutdown()` method. In an application, reuse the same Nacos Java SDK instance as much as possible and avoid frequent initialization.
