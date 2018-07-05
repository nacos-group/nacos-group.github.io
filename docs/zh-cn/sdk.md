# 配置管理
## 获取配置
### 描述

用于服务启动的时候从 ACM 获取配置。
```
public static String getConfig(String dataId, String group, long timeoutMs) throws ConfigException

```

### 请求参数

| 参数名 | 参数类型 | 描述 |
| :--- | :--- | :--- |
| dataId | string | 配置 ID，采用类似 package.class（如com.taobao.tc.refund.log.level）的命名规则保证全局唯一性，class 部分建议是配置的业务含义。全部字符小写。只允许英文字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节。 |
| group | string | 配置分组，建议填写产品名:模块名（如ACM:Test）保证唯一性，只允许英文字符和4种特殊字符（"."、":"、"-"、"\_"），不超过128字节。 |
| timeout | long | 读取配置超时时间，单位 ms，推荐值 3000。 |


### 返回值

| 参数类型 | 描述 |
| :--- | :--- |
| string | 配置值 |


### 请求示例

```
try {
    // 初始化配置服务，控制台通过示例代码自动获取下面参数
    ConfigService.init("${endpoint}", "${namespace}", "${accessKey}", "${secretKey}");
    // 主动获取配置
	String content = ConfigService.getConfig("${dataId}", "${group}", 3000);
	System.out.println(content);
} catch (ConfigException e) {
    // TODO Auto-generated catch block
    e.printStackTrace();
}
```

### 异常说明

读取配置超时或网络异常，抛出 ConfigException 异常。

## 监听配置
### 描述

如果希望 ACM 推送配置变更，可以使用 ACM 动态监听配置接口来实现。

```
public static void addListener(String dataId, ConfigChangeListenerAdapter listener)

```

### 请求参数

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
          <div data-type="p">配置分组，建议填写<strong>产品名：模块名</strong>（如 ACM:Test）保证唯一性。 只允许英文字符和4种特殊字符（&quot;.&quot;、&quot;:&quot;、&quot;-&quot;、&quot;_&quot;），不超过128字节。
          </div>
        </td>
      </tr>
      <tr>
        <td rowspan="1" colSpan="1">
          <div data-type="p">listener</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">ConfigChangeListener</div>
        </td>
        <td rowspan="1" colSpan="1">
          <div data-type="p">监听器，配置变更进入监听器的回调函数。</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>


### 返回值

| 参数类型 | 描述 |
| :--- | :--- |
| string | 配置值，初始化或者配置变更的时候通过回调函数返回该值。 |


### 请求示例

```

// 初始化配置服务，控制台通过示例代码自动获取下面参数
ConfigService.init("${endpoint}", "${namespace}", "${accessKey}", "${secretKey}");
// 初始化的时候，给配置添加监听,配置变更会回调通知
ConfigService.addListener("${dataId}", "${group}", new ConfigChangeListener() {
    public void receiveConfigInfo(String configInfo) {
        // 当配置更新后，通过该回调函数将最新值返回给用户
        System.out.println(configInfo);
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

## 删除监听
### 描述

取消监听配置，取消监听后配置不会再推送。

```
static public void removeListener(String dataId, String group, ManagerListener listener)

```

### 请求参数

| 参数名 | 参数类型 | 描述 |
| :--- | :--- | :--- |
| dataId | string | 配置 ID，采用类似 package.class（如com.taobao.tc.refund.log.level）的命名规则保证全局唯一性，class 部分建议是配置的业务含义。全部字符小写。只允许英文字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节。 |
| listener | ConfigChangeListenerAdapter | 监听器，配置变更进入监听器的回调函数。 |


### 使用示例

```
ConfigService.removeListener("yanlin", youListener);

```

## 发布配置
### 描述

用于通过程序自动发布 ACM 配置，以便通过自动化手段降低运维成本。

__注意：__创建和修改配置时使用的同一个发布接口，当配置不存在时会创建配置，当配置已存在时会更新配置。

```
public static boolean publishConfig(String dataId, String group, String content) throws ConfigException

```

### 请求参数

| 参数名 | 参数类型 | 描述 |
| :--- | :--- | :--- |
| dataId | string | 配置 ID，采用类似 `package.class`（如 `com.taobao.tc.refund.log.level`）的命名规则保证全局唯一性。建议根据配置的业务含义来定义 class 部分。全部字符均为小写。只允许英文字符和 4 种特殊字符（“.”、“:”、“-”、“\_”），不超过 256 字节。 |
| group | string | 配置分组，建议填写`产品名:模块名`（如 `ACM:Test`）来保证唯一性。只允许英文字符和 4 种特殊字符（“.”、“:”、“-”、“\_”），不超过 128 字节。 |
| content | string | 配置内容，不超过 100K 字节。 |


### 返回参数

| 参数类型 | 描述 |
| :--- | :--- |
| boolean | 是否发布成功 |


### 请求示例

```
try {
    // 初始化配置服务，控制台通过示例代码自动获取下面参数
    ConfigService.init("${endpoint}", "${namespace}", "${accessKey}", "${secretKey}");
    // 主动获取配置
	boolean isPublishOk = ConfigService.publishConfig("${dataId}", "${group}", "${content}");
	System.out.println(isPublishOk);
} catch (ConfigException e) {
    // TODO Auto-generated catch block
    e.printStackTrace();
}
```

### 异常说明

读取配置超时或网络异常，抛出 ConfigException 异常。

## 删除配置
### 描述

用于通过程序自动删除 ACM 配置，以便通过自动化手段降低运维成本。

__注意：__ 当配置已存在时会删除该配置，当配置不存在时会直接返回成功消息。


```
public static boolean removeConfig(String dataId, String group) throws ConfigException

```

### 请求参数

| 参数名 | 参数类型 | 描述 |
| :--- | :--- | :--- |
| dataId | string | 配置 ID |
| group | string | 配置分组 |


### 返回参数

| 参数类型 | 描述 |
| :--- | :--- |
| boolean | 是否删除成功 |


### 请求示例

```
try {
    // 初始化配置服务，控制台通过示例代码自动获取下面参数
    ConfigService.init("${endpoint}", "${namespace}", "${accessKey}", "${secretKey}");
    // 主动获取配置
	boolean isRemoveOk = ConfigService.removeConfig("${dataId}", "${group}");
	System.out.println(isRemoveOk);
} catch (ConfigException e) {
    // TODO Auto-generated catch block
    e.printStackTrace();
}
```

### 异常说明

读取配置超时或网络异常，抛出 ConfigException 异常。



# 服务发现SDK
## 注册实例
### 描述
注册一个实例到服务。
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

### 请求参数

| 名称 | 类型 | 描述 |
| :--- | :--- | --- |
| serviceName | 字符串 | 服务名 |
| ip | 字符串 | 服务实例ip |
| port | int | 服务实例port |
| clusterName | 字符串 | 集群名 |
| instance | 参见代码注释 | 实例属性 |

### 返回参数
无
### 请求示例
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

## 注销实例
### 描述
删除服务下的一个实例。
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

### 请求参数

| 名称 | 类型 | 描述 |
| :--- | :--- | :--- |
| serviceName | 字符串 | 服务名 |
| ip | 字符串 | 服务实例ip |
| port | int | 服务实例port |
| clusterName | 字符串 | 集群名 |

### 返回参数
无
### 请求示例
```java
NamingService naming = NamingFactory.createNaming(System.getProperty("serveAddr"));
naming.deregisterInstance("nacos.test.3", "11.11.11.11", 8888, "DEFAULT");
```
## 获取全部实例
### 描述
获取服务下的所有实例。
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

### 请求参数

| 名称 | 类型 | 描述 |
| :--- | :--- | --- |
| serviceName | 字符串 | 服务名 |
| clusters | List | 集群列表 |

### 返回参数
List<Instance> 实例列表。
### 请求示例
```java
NamingService naming = NamingFactory.createNaming(System.getProperty("serveAddr"));
System.out.println(naming.getAllInstances("nacos.test.3"));
```

## 获取健康或不健康实例列表
### 描述
根据条件获取过滤后的实例列表。
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

### 请求参数

| 名称 | 类型 | 描述 |
| :--- | :--- | --- |
| serviceName | 字符串 | 服务名 |
| clusters | List | 集群列表 |
| healthy | boolean | 是否健康 |

### 返回参数
List<Instance> 实例列表。
### 请求示例
```java
NamingService naming = NamingFactory.createNaming(System.getProperty("serveAddr"));
System.out.println(naming.selectInstances("nacos.test.3", true));
```

## 获取一个健康实例
### 描述
根据负载均衡算法随机获取一个健康实例。
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

### 请求参数

| 名称 | 类型 | 描述 |
| :--- | :--- | --- |
| serviceName | 字符串 | 服务名 |
| clusters | List | 集群列表 |

### 返回参数
Instance 实例。

### 请求示例
```java
NamingService naming = NamingFactory.createNaming(System.getProperty("serveAddr"));
System.out.println(naming.selectOneHealthyInstance("nacos.test.3"));
```

## 监听服务
### 描述
监听服务下的实例列表变化。
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

### 请求参数

| 名称 | 类型 | 描述 |
| :--- | :--- | --- |
| serviceName | 字符串 | 服务名 |
| clusters | List | 集群列表 |
| listener | EventListener |  回调listener |

### 返回参数
无

### 请求示例
```java
NamingService naming = NamingFactory.createNaming(System.getProperty("serveAddr"));
naming.subscribe("nacos.test.3", event -> {
    if (event instanceof NamingEvent) {
        System.out.println(((NamingEvent) event).getServceName());
        System.out.println(((NamingEvent) event).getInstances());
    }
});
```

## 取消监听服务
### 描述
取消监听服务下的实例列表变化。
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

### 请求参数

| 名称 | 类型 | 描述 |
| :--- | :--- | --- |
| serviceName | 字符串 | 服务名 |
| clusters | List | 集群列表 |
| listener | EventListener |  回调listener |

### 返回参数
无

### 请求示例
```java
NamingService naming = NamingFactory.createNaming(System.getProperty("serveAddr"));
naming.unsubscribe("nacos.test.3", event -> {});
```

