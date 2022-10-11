---
title: Java SDK
keywords: Java,SDK
description: Java SDK
---

# Java SDK

## Overview

Maven coordinates
```
<dependency>
<groupId>com.alibaba.nacos</groupId>
<artifactId>nacos-client</artifactId>
<version>${version}</version>
</dependency>
```


## Configuration Management
### Get configuration
#### Description

Get configuration from Nacos when a service starts.

```java
public String getConfig(String dataId, String group, long timeoutMs) throws NacosException
```

#### Request parameters

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
          <div data-type="p">Name</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">Type</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">Description</div>
        </td>
      </tr>
      <tr>
        <td rowspan="1" colSpan="1">
          <div data-type="p">dataId</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">string</div>
          <div data-type="p"></div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">Configuration ID. Use a naming rule similar to package.class (for example, com.taobao.tc.refund.log.level) to ensure global uniqueness. It is recommended to indicate business meaning of the configuration in the &quot;class&quot; section. Use
            lower case for all characters. Use alphabetical letters and these four special characters (&quot;.&quot;, &quot;:&quot;, &quot;-&quot;, &quot;_&quot;) only. Up to 256 characters are allowed.</div>
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
          <div data-type="p">Configuration group. To ensure uniqueness, format such as <strong>product name: module name </strong>(for example, Nacos:Test) is preferred. Use alphabetical letters and these four special characters (&quot;.&quot;, &quot;:&quot;, &quot;-&quot;,
            &quot;_&quot;) only. Up to 128 characters are allowed.</div>
        </td>
      </tr>
      <tr>
        <td rowspan="1" colSpan="1">
          <div data-type="p">timeout</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">long</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">Length of configuration read time-out (in ms). Recommended value: 3000.</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>


#### Return values

| Type | Description |
| :--- | :--- |
| string | configuration value |


#### Request example

```java
try {
    // Initialize the configuration service, and the console automatically obtains the following parameters through the sample code.
	String serverAddr = "{serverAddr}";
	String dataId = "{dataId}";
	String group = "{group}";
	Properties properties = new Properties();
	properties.put("serverAddr", serverAddr);
	ConfigService configService = NacosFactory.createConfigService(properties);
    // Actively get the configuration.
	String content = configService.getConfig(dataId, group, 5000);
	System.out.println(content);
} catch (NacosException e) {
    // TODO Auto-generated catch block
    e.printStackTrace();
}
```

#### Exception specification

A ConfigException is thrown in case of a configuration read time-out or a network error.

### Listen configuration
#### Description

Use dynamic configuration listening API to enable Nacos to send configuration change notifications.

```java
public void addListener(String dataId, ConfigChangeListenerAdapter listener)
```

#### Request parameters

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
          <div data-type="p">Name</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">Type</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">Description</div>
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
          <div data-type="p">Configuration ID. Use a naming rule similar to package.class (for example, com.taobao.tc.refund.log.level) to ensure global uniqueness. It is recommended to indicate business meaning of the configuration in the &quot;class&quot; section. Use
            lower case for all characters. Use alphabetical letters and these four special characters (&quot;.&quot;, &quot;:&quot;, &quot;-&quot;, &quot;_&quot;) only. Up to 256 characters are allowed.</div>
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
          <div data-type="p">Configuration group. To ensure uniqueness, format such as <strong>product name: module name </strong> (for example, Nacos:Test) is preferred. Use alphabetical letters and these four special characters (&quot;.&quot;, &quot;:&quot;, &quot;-&quot;,
            &quot;_&quot;) only. Up to 128 characters are allowed.</div>
        </td>
      </tr>
      <tr>
        <td rowspan="1" colSpan="1">
          <div data-type="p">listener</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">Config Change Listener</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">Listener. Configuration changes go into the callback function of the listener.</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

#### Return values

| Type | Description |
| :--- | :--- |
| string | Configuration value. This value is returned through the callback function during initialization or configuration modification. |

#### Request example

```java

// Initialize the configuration service, and the console automatically obtains the following parameters through the sample code.
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
		System.out.println("receive1:" + configInfo);
	}
	@Override
	public Executor getExecutor() {
		return null;
	}
});

// Keep the main thread alive throughout the test, because the configuration subscription runs in a daemon thread, which exits once the main thread exits. The following code is not required in a real environment.
while (true) {
    try {
        Thread.sleep(1000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}
```

### Delete Listening
#### Description

Cancel listen configuration. No more notification after cancellation.

```java
public void removeListener(String dataId, String group, Listener listener)
```

#### Request parameters

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
          <div data-type="p">Name</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">Type</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">Description</div>
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
          <div data-type="p">Configuration ID. Use a naming rule similar to package.class (for example, com.taobao.tc.refund.log.level) to ensure global uniqueness. It is recommended to indicate business meaning of the configuration in the &quot;class&quot; section. Use
            lower case for all characters. Use alphabetical letters and these four special characters (&quot;.&quot;, &quot;:&quot;, &quot;-&quot;, &quot;_&quot;) only. Up to 256 characters are allowed.</div>
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
                <div data-type="p">Configuration group
                </td>
            </tr>
      <tr>
        <td rowspan="1" colSpan="1">
          <div data-type="p">listener</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">ConfigChangeListenerAdapter</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">Listener. Configuration changes go into the callback function of the listener.</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

#### Request example

```java
String serverAddr = "{serverAddr}";
String dataId = "{dataId}";
String group = "{group}";
Properties properties = new Properties();
properties.put("serverAddr", serverAddr);
ConfigService configService = NacosFactory.createConfigService(properties);
configService.removeListener(dataId, group, yourListener);
```

### Publish configuration
#### Description

Publish Nacos configurations automatically to reduce the operation and maintenance cost.

__Note:__ It uses the same publishing interface to create or modify a configuration. If the specified configuration doesn’t exist, it will create a configuration. If the specified configuration exists, it will update the configuration.

```java
public boolean publishConfig(String dataId, String group, String content) throws NacosException;

@Since 1.4.1
public boolean publishConfig(String dataId, String group, String content, String type) throws NacosException;

```

#### Request parameters

| Name | Type | Description |
| :--- | :--- | :--- |
| dataId | string | Configuration ID. Naming rule is similar to package.class (com.taobao.tc.refund.log.level) is used to ensure the global uniqueness We recommend that you define class by business meaning. All characters must be in lower case. Use alphabetical letters and these four special characters (".", ":", "-", "\_") only. Up to 256 characters are allowed. |
| group | string | Configuration group. We recommend that you use product name: module name (for example Nacos:Test) to ensure the uniqueness. Use alphabetical letters and these four special characters (".", ":", "-", "\_") only. Up to 128 characters are allowed. |
| content | string | Configuration content. No more than 100K bytes. |
| type | string | @Since 1.4.1. Configuration type. See com.alibaba.nacos.api.config.ConfigType, default as TEXT. |

#### Response parameters

| Type | Description |
| :--- | :--- |
| boolean | If the publishing is successful |


#### Request example

```java
try {
    // Initialize the configuration service. Retrieves the following parameters in console with sample code
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

#### Exceptions

In case of reading configuration timeout or network issues, ConfigException exception is thrown.


### Delete configuration
#### Description

It deletes Nacos configurations automatically with program to reduce operation and maintenance costs with automation.

__Note:__ If the specified configuration exists, then it deletes the configuration. If the specified configuration doesn’t exist, then it returns a successful message.

```java
public boolean removeConfig(String dataId, String group) throws NacosException

```

#### Request parameters


| Parameter name | Parameter type | Description |
| :--- | :--- | :--- |
| dataId | String | Configuration ID |
| group | String | Configuration group |


#### Response parameters


| Parameter type | Description |
| :--- | :--- |
| boolean | If the deletion is successful |


#### Request example

```java
try {
    // Initialize the configuration service. Retrieves the following parameters in console with sample code
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

#### Exceptions

In case of reading configuration timeout or network issues, ConfigException exception is thrown.

## Service Discovery SDK
### Register Instance
#### Description
Register an instance to service.
```java
void registerInstance(String serviceName, String ip, int port) throws NacosException;

void registerInstance(String serviceName, String ip, int port, String clusterName) throws NacosException;

void registerInstance(String serviceName, Instance instance) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
| :--- | :--- | --- |
| serviceName | String | service name |
| ip | String | instance ip |
| port | int | instance port |
| clusterName | String | cluster name |
| instance | Refer to Java docs | instance properties |

#### Response
void
#### Request Example
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
service.setHealthCheckMode("server");
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

### Deregister Instance
#### Description
Remove instance from service.
```java
void deregisterInstance(String serviceName, String ip, int port) throws NacosException;

void deregisterInstance(String serviceName, String ip, int port, String clusterName) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
| :--- | :--- | :--- |
| serviceName | String | service name |
| ip | String | instance ip |
| port | int | instance port |
| clusterName | String | cluster name |

#### Response
None
#### Request Example
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
naming.deregisterInstance("nacos.test.3", "11.11.11.11", 8888, "DEFAULT");
```
### Get all instances of service
#### Description
Get all instances of service.
```java
List<Instance> getAllInstances(String serviceName) throws NacosException;

List<Instance> getAllInstances(String serviceName, List<String> clusters) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
| :--- | :--- | --- |
| serviceName | String | service name |
| clusters | List | cluster list |

#### Response
List<Instance> instance list。
#### Request Example
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
System.out.println(naming.getAllInstances("nacos.test.3"));
```

### Get filtered list of instance
#### Description
Get healthy or unhealthy instances of service.
```java
List<Instance> selectInstances(String serviceName, boolean healthy) throws NacosException;

List<Instance> selectInstances(String serviceName, List<String> clusters, boolean healthy) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
| :--- | :--- | --- |
| serviceName | String | service name |
| clusters | List | cluster list |
| healthy | boolean | healthy or not |

#### Response
List<Instance> instance list.
#### Request Example
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
System.out.println(naming.selectInstances("nacos.test.3", true));
```

### Get one healthy instance
#### Description
Get one healthy instance selected by load-balance strategy.
```java
Instance selectOneHealthyInstance(String serviceName) throws NacosException;

Instance selectOneHealthyInstance(String serviceName, List<String> clusters) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
| :--- | :--- | --- |
| serviceName | String | service name |
| clusters | List | cluster list |

#### Response
Instance

#### Request Example
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
System.out.println(naming.selectOneHealthyInstance("nacos.test.3"));
```

### Listen Service
#### Description
Listen for changes of instances under a service.
```java
void subscribe(String serviceName, EventListener listener) throws NacosException;

void subscribe(String serviceName, List<String> clusters, EventListener listener) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
| :--- | :--- | --- |
| serviceName | String | service name |
| clusters | List | cluster list |
| listener | EventListener | event listener |

#### Response
void

#### Request Example
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
naming.subscribe("nacos.test.3", event -> {
    if (event instanceof NamingEvent) {
        System.out.println(((NamingEvent) event).getServceName());
        System.out.println(((NamingEvent) event).getInstances());
    }
});
```

### Unlisten Service
#### Description
Cancel listening service.
```java
void unsubscribe(String serviceName, EventListener listener) throws NacosException;

void unsubscribe(String serviceName, List<String> clusters, EventListener listener) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
| :--- | :--- | --- |
| serviceName | String | service name |
| clusters | List | cluster list |
| listener | EventListener | event listener |

#### Response
void

#### Request Example
```java
NamingService naming = NamingFactory.createNamingService(System.getProperty("serveAddr"));
naming.unsubscribe("nacos.test.3", event -> {});
```
