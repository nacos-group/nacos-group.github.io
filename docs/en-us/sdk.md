
# Configration Management
## Get configuration

### Description

Used to get the configuration from ACM when the service starts.

```
public static String getConfig(String dataId, String group, long timeoutMs) throws NacosException

```

### Request parameters

| Parameter name | Parameter type | Description |
| :--- | :--- | :--- |
| dataId | String | Configuration ID. Use a naming rule like package.class (for example, com.taobao.tc.refund.log.level) to ensure global uniqueness. It is recommended to indicate business meaning of the configuration in the "class" section. Use lower case for all characters. Use alphabetical letters and these four special characters (".", ":", "-", "\_") only. Up to 256 characters are allowed. |
| group | String | Configuration group. To ensure uniqueness, format such as __product name: module name __(for example, ACM:Test) is preferred. Use alphabetical letters and these four special characters (".", ":", "-", "\_") only. Up to 128 characters are allowed. |
| timeout | string | Length of configuration read time-out (in ms). Recommended value: 3000. |


### Return values

| Parameter type | Description |
| :--- | :--- |
| String | Configuration value |


### Request example

```
try {
    // Initialize the configuration service, and the console automatically obtains the following parameters through the sample code.
    ConfigService.init("${endpoint}", "${namespace}", "${accessKey}", "${secretKey}");
    // Actively get the configuration.
	String content = ConfigService.getConfig("${dataId}", "${group}", 3000);
	System.out.println(content);
} catch (ConfigException e) {
    // TODO Auto-generated catch block
    e.printStackTrace();
}
```

### Exception specification

A ConfigException exception is thrown in case of a configuration read time-out or a network error.

## Listen for configurations
### Description

Use the ACM dynamic configuration listening API to enable ACM to send configuration change notifications.

```
public static void addListener(String dataId, ConfigChangeListenerAdapter listener)

```

### Request parameters

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
          <div data-type="p">Parameter name</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">Parameter type</div>
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
          <div data-type="p">String</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">Configuration ID. Use a naming rule like package.class (for example, com.taobao.tc.refund.log.level) to ensure global uniqueness. It is recommended to indicate business meaning of the configuration in the &quot;class&quot; section. Use lower
            case for all characters. Use alphabetical letters and these four special characters (&quot;.&quot;, &quot;:&quot;, &quot;-&quot;, &quot;_&quot;) only. Up to 256 characters are allowed.</div>
        </td>
      </tr>
      <tr>
        <td rowspan="1" colSpan="1">
          <div data-type="p">group</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">String</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">Configuration group. To ensure uniqueness, format such as **product name: module name **(for example, ACM:Test) is preferred. Use alphabetical letters and these four special characters (&quot;.&quot;, &quot;:&quot;, &quot;-&quot;, &quot;_&quot;)
            only. Up to 128 characters are allowed.</div>
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


### Return values

| Parameter type | Description |
| :--- | :--- |
| String | Configuration value. This value is returned through the callback function during initialization or configuration modification. |


### Request example

```

// Initialize the configuration service, and the console automatically obtains the following parameters through the sample code.
ConfigService.init("${endpoint}", "${namespace}", "${accessKey}", "${secretKey}");
// Add listeners to the configuration during initialization, which calls back a notification of configuration changes.
ConfigService.addListener("${dataId}", "${group}", new ConfigChangeListener() {
    public void receiveConfigInfo(String configInfo) {
        // After the configuration is updated, the latest value is returned to the user by this callback function.
        System.out.println(configInfo);
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

## Publish configuration
### Description

It publishes ACM configurations automatically with program to reduce operation and maintenance costs with automation.

__Note:__ It uses the same publishing interface to create or modify a configuration. If the specified configuration doesn’t exist, then it creates a configuration. If the specified configuration exists, then it updates the configuration.

```
public static boolean publishConfig(String dataId, String group, String content) throws ConfigException

```


### Request parameters

| Parameter name | Parameter type | Description |
| :--- | :--- | :--- |
| dataId | String | Configuration ID. Naming convention similar to package.class (for example com.taobao.tc.refund.log.level) is used for ensuring the global uniqueness We recommended that you define the class part based on business meaning. All characters must be in lower case. Only English characters and four special characters (“. ”, “: ”, “-”, “\_”) are allowed. It must not exceed 256 bytes. |
| group | String | Configuration group. We recommend that you use product name: module name (for example ACM:Test) to ensure the uniqueness. Only English characters and four special characters (“. ”, “: ”, “-”, “\_”) are allowed. It must not exceed 128 bytes. |
| content | string | Configuration content. It must not exceed 100K bytes. |

### Response parameters

| Parameter type | Description |
| :--- | :--- |
| boolean | If the publishing is successful |


### Request example

```
try {
    // Initialize the configuration service. Retrieves the following parameters in console with sample code
    ConfigService.init("${endpoint}", "${namespace}", "${accessKey}", "${secretKey}");
    // Actively retrieves configuration
	boolean isPublishOk = ConfigService.publishConfig("${dataId}", "${group}", "${content}");
	System.out.println(isPublishOk);
} catch (ConfigException e) {
    // TODO Auto-generated catch block
    e.printStackTrace();
}
```

### Exceptions

In case of reading configuration timeout or network issues, ConfigException exception is thrown.


## Delete configuration
### Description

It deletes ACM configurations automatically with program to reduce operation and maintenance costs with automation.

__Note:__ If the specified configuration exists, then it deletes the configuration. If the specified configuration doesn’t exist, then it returns a successful message.

```
public static boolean removeConfig(String dataId, String group) throws ConfigException

```

### Request parameters


| Parameter name | Parameter type | Description |
| :--- | :--- | :--- |
| dataId | String | Configuration ID |
| group | String | Configuration group |


### Response parameters


| Parameter type | Description |
| :--- | :--- |
| boolean | If the deletion is successful |


### Request example

```
try {
    // Initialize the configuration service. Retrieves the following parameters in console with sample code
    ConfigService.init("${endpoint}", "${namespace}", "${accessKey}", "${secretKey}");
    // Actively retrieves configuration
	boolean isRemoveOk = ConfigService.removeConfig("${dataId}", "${group}");
	System.out.println(isRemoveOk);
} catch (ConfigException e) {
    // TODO Auto-generated catch block
    e.printStackTrace();
}
```

### Exceptions

In case of reading configuration timeout or network issues, ConfigException exception is thrown.

# Service Discovery SDK
## Register Instance
### Description
Register an instance to service.
```java
    /**
     * Register a instance to service
     *
     * @param serviceName name of service
     * @param ip          instance ip
     * @param port        instance port
     * @throws NacosException
     */
    void registerInstance(String serviceName, String ip, int port) throws NacosException;

    /**
     * Register a instance to service with specified cluster name
     *
     * @param serviceName name of service
     * @param ip          instance ip
     * @param port        instance port
     * @param clusterName instance cluster name
     * @throws NacosException
     */
    void registerInstance(String serviceName, String ip, int port, String clusterName) throws NacosException;

    /**
     * Register a instance to service with specified instance properties
     *
     * @param serviceName name of service
     * @param instance    instance to register
     * @throws NacosException
     */
    void registerInstance(String serviceName, Instance instance) throws NacosException;
```

### Request Parameters

| Name | Type | Description |
| :--- | :--- | --- |
| serviceName | String | service name |
| ip | String | instance ip |
| port | int | instance port |
| clusterName | String | cluster name |
| instance | Refer to Java docs | instance properties |

### Response
void
### Request Example
```java
NamingService naming = NamingFactory.createNaming(System.getProperty("serveAddr"));
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
service.setEnableClientBeat(true);
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
healthChecker.setCheckCode(400);
healthChecker.setCurlHost("USer-Agent|Nacos");
healthChecker.setCurlPath("/xxx.html");
cluster.setHealthChecker(healthChecker);
Map<String, String> clusterMeta = new HashMap<>();
clusterMeta.put("xxx", "yyyy");
cluster.setMetadata(clusterMeta);

instance.setCluster(cluster);

naming.registerInstance("nacos.test.4", instance);
```

## Deregister Instance
### Description
Remove instance from service.
```java
    /**
     * Deregister instance from a service
     *
     * @param serviceName name of service
     * @param ip          instance ip
     * @param port        instance port
     * @throws NacosException
     */
    void deregisterInstance(String serviceName, String ip, int port) throws NacosException;

    /**
     * Deregister instance with specified cluster name from a service
     *
     * @param serviceName name of service
     * @param ip          instance ip
     * @param port        instance port
     * @param clusterName     instance cluster name
     * @throws NacosException
     */
    void deregisterInstance(String serviceName, String ip, int port, String clusterName) throws NacosException;
```

### Request Parameters

| Name | Type | Description |
| :--- | :--- | :--- |
| serviceName | String | service name |
| ip | String | instance ip |
| port | int | instance port |
| clusterName | String | cluster name |

### Response
无
### Request Example
```java
NamingService naming = NamingFactory.createNaming(System.getProperty("serveAddr"));
naming.deregisterInstance("nacos.test.3", "11.11.11.11", 8888, "DEFAULT");
```
## Get all instances of service
### Description
Get all instances of service.
```java
    /**
     * Get all instances of a service
     *
     * @param serviceName name of service
     * @return A list of instance
     * @throws NacosException
     */
    List<Instance> getAllInstances(String serviceName) throws NacosException;

    /**
     * Get all instances within specified clusters of a service
     *
     * @param serviceName name of service
     * @param clusters    list of cluster
     * @return A list of qualified instance
     * @throws NacosException
     */
    List<Instance> getAllInstances(String serviceName, List<String> clusters) throws NacosException;
```

### Request Parameters

| Name | Type | Description |
| :--- | :--- | --- |
| serviceName | String | service name |
| clusters | List | cluster list |

### Response
List<Instance> instance list。
### Request Example
```java
NamingService naming = NamingFactory.createNaming(System.getProperty("serveAddr"));
System.out.println(naming.getAllInstances("nacos.test.3"));
```

## Get filtered list of instance
### Description
Get healthy or unhealthy instances of service.
```java
    /**
     * Get qualified instances of service
     *
     * @param serviceName name of service
     * @param healthy     a flag to indicate returning healthy or unhealthy instances
     * @return A qualified list of instance
     * @throws NacosException
     */
    List<Instance> selectInstances(String serviceName, boolean healthy) throws NacosException;

    /**
     * Get qualified instances within specified clusters of service
     *
     * @param serviceName name of service
     * @param clusters    list of cluster
     * @param healthy     a flag to indicate returning healthy or unhealthy instances
     * @return A qualified list of instance
     * @throws NacosException
     */
    List<Instance> selectInstances(String serviceName, List<String> clusters, boolean healthy) throws NacosException;
```

### Request Parameters

| Name | Type | Description |
| :--- | :--- | --- |
| serviceName | String | service name |
| clusters | List | cluster list |
| healthy | boolean | healty or not |

### Response
List<Instance> instance list.
### Request Example
```java
NamingService naming = NamingFactory.createNaming(System.getProperty("serveAddr"));
System.out.println(naming.selectInstances("nacos.test.3", true));
```

## Get one healthy instance
### Description
Get one healthy instance selected by load-balance strategy.
```java
    /**
     * Select one healthy instance of service using predefined load balance strategy
     *
     * @param serviceName name of service
     * @return qualified instance
     * @throws NacosException
     */
    Instance selectOneHealthyInstance(String serviceName) throws NacosException;

    /**
     * Select one healthy instance of service using predefined load balance strategy
     *
     * @param serviceName name of service
     * @param clusters    a list of clusters should the instance belongs to
     * @return qualified instance
     * @throws NacosException
     */
    Instance selectOneHealthyInstance(String serviceName, List<String> clusters) throws NacosException;
```

### Request Parameters

| Name | Type | Description |
| :--- | :--- | --- |
| serviceName | String | service name |
| clusters | List | cluster list |

### Response
Instance

### Request Example
```java
NamingService naming = NamingFactory.createNaming(System.getProperty("serveAddr"));
System.out.println(naming.selectOneHealthyInstance("nacos.test.3"));
```

## Listen Service
### Description
Listen for changes of instances under a service.
```java
    /**
     * Subscribe service to receive events of instances alteration
     *
     * @param serviceName name of service
     * @param listener    event listener
     * @throws NacosException
     */
    void subscribe(String serviceName, EventListener listener) throws NacosException;

    /**
     * Subscribe service to receive events of instances alteration
     *
     * @param serviceName name of service
     * @param clusters    list of cluster
     * @param listener    event listener
     * @throws NacosException
     */
    void subscribe(String serviceName, List<String> clusters, EventListener listener) throws NacosException;
```

### Request Parameters

| Name | Type | Description |
| :--- | :--- | --- |
| serviceName | String | service name |
| clusters | List | cluster list |
| listener | EventListener | event listener |

### Response
void

### Request Example
```java
NamingService naming = NamingFactory.createNaming(System.getProperty("serveAddr"));
naming.subscribe("nacos.test.3", event -> {
    if (event instanceof NamingEvent) {
        System.out.println(((NamingEvent) event).getServceName());
        System.out.println(((NamingEvent) event).getInstances());
    }
});
```

## Unlisten Service
### Description
Cancel listening service.
```java
    /**
     * Unsubscribe event listener of service
     *
     * @param serviceName name of service
     * @param listener    event listener
     * @throws NacosException
     */
    void unsubscribe(String serviceName, EventListener listener) throws NacosException;

    /**
     * Unsubscribe event listener of service
     *
     * @param serviceName name of service
     * @param clusters    list of cluster
     * @param listener    event listener
     * @throws NacosException
     */
    void unsubscribe(String serviceName, List<String> clusters, EventListener listener) throws NacosException;
```

### Request Parameters

| Name | Type | Description |
| :--- | :--- | --- |
| serviceName | String | service name |
| clusters | List | cluster list |
| listener | EventListener | event listener |

### Response
void

### Request Example
```java
NamingService naming = NamingFactory.createNaming(System.getProperty("serveAddr"));
naming.unsubscribe("nacos.test.3", event -> {});
```

