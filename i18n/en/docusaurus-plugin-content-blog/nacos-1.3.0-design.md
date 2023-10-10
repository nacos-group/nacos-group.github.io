---
title: Nacos 1.3.0 new kernel construction process
keywords: [nacos1.3.0,kernel]
description: Nacos 1.3.0 new kernel construction process
---

# Nacos 1.3.0 Documentation of features and functionality

<a name="0YIG0"></a>

## Summarize

This 1.3.0 is implanted to a great extent, involving the modification of two large modules and the addition of a core module

1. nacos-core module modification
   1. nacos
   2. nacos internal event mechanism
   3. nacos consistency protocol layer
2. nacos-config module modification
   1. Add embedded distributed data storage components
   2. Separation of embedded storage and external storage
   3. Simple operation and maintenance of embedded storage
3. Add nacos-consistency module
   1. Unified abstraction for AP protocol and CP protocol

<a name="rnkDY"></a>

## System parameters changes

<a name="1Gmg9"></a>

### Updates

| **core** | nacos.watch-file.max-dirs | JVM parameter | Maximum number of monitored directories |
| :----: | ---- | ---- | ---- |
|  | nacos.core.notify.ring-buffer-size | JVM parameter | Quick notification of the maximum length of the queue |
|  | nacos.core.notify.share-buffer-size | JVM parameter | The maximum length of the slow notification queue |
|  | nacos.core.member.fail-access-cnt | JVM parameter.properties | Maximum number of failed visits to cluster member nodes |
|  | nacos.core.address-server.retry | JVM parameter、application.properties | Address server addressing mode, first start request retry times |

<br />

<a name="kxo8O"></a>

## The future overall logical architecture of Nacos and its components

![1561217775318-6e408805-18bb-4242-b4e9-83c5b929b469.png](https://cdn.nlark.com/yuque/0/2020/png/333972/1587129046320-5a286f38-8db4-4e76-9b42-8bd859f51a60.png#align=left&display=inline&height=1184&margin=%5Bobject%20Object%5D&name=1561217775318-6e408805-18bb-4242-b4e9-83c5b929b469.png&originHeight=1184&originWidth=1608&size=279074&status=done&style=none&width=1608)

<a name="Hyc6u"></a>

## Nacos cluster member node addressing mode

Before 1.3.0, nacos' naming module and config module had their own member list management tasks. In order to unify the replacement mode of nacos assigning the next member list, the implementation of merge management is replaced from the named module and the config module, unified to the addressing module of the core module, and the command line parameters are added at the same time -Dnacos.member.list **To set the list listed by nacos, this parameter can be called an alternative to the cluster.conf file. The current nacos addressing mode categories are as follows

   1. In stand-alone mode: StandaloneMemberLookup
   2. Play mode
      1. The cluster.conf file exists: FileConfigMemberLookup
      2. The cluster.conf file does not exist or -Dnacos.member.list is not set: AddressServerMemberLookup



If you want to specify an addressing mode, set this parameter：**nacos.core.member.lookup.type=[file,address-server]**

The logical diagram is as follows
![](https://cdn.nlark.com/yuque/__puml/e209a677aa8b5ffce23589e987ee5129.svg#lake_card_v2=eyJjb2RlIjoiQHN0YXJ0dW1sXG5cbigqKSAtLT4gXCJMb29rdXBGYWN0b3J5LmluaXQoKVwiXG5cbmlmIFwic3RhbmRhbG9uZSBtb2RlXCIgdGhlblxuICAtLT5bdHJ1ZV0gXCJyZXR1cm4gU3RhbmRhbG9uZU1lbWJlckxvb2t1cFwiXG4gIC0tPiBMb29rdXAucnVuKClcbmVsc2VcbiBpZiBcImNsdXN0ZXIuY29uZiBleGlzdHNcIiB0aGVuXG4gICAgLS0-W3RydWVdIFwicmV0dXJuIEZpbGVDb25maWdNZW1iZXJMb29rdXBcIlxuICAgIC0tPiBMb29rdXAucnVuKClcbiBlbHNlXG4gICAgLT5bZmFsc2VdIFwicmV0dXJuIEFkZHJlc3NTZXJ2ZXJNZW1iZXJMb29rdXBcIlxuICAgIC0tPiBMb29rdXAucnVuKClcbiBlbmRpZlxuZW5kaWZcblxuLS0-ICgqKVxuXG5AZW5kdW1sIiwidHlwZSI6InB1bWwiLCJpZCI6IlplWGtkIiwidXJsIjoiaHR0cHM6Ly9jZG4ubmxhcmsuY29tL3l1cXVlL19fcHVtbC9lMjA5YTY3N2FhOGI1ZmZjZTIzNTg5ZTk4N2VlNTEyOS5zdmciLCJjYXJkIjoiZGlhZ3JhbSJ9)

<a name="wqkMp"></a>

### Addressing mode details

Next, I introduce two other addressing modes in addition to the addressing mode in stand-alone mode<br />

<a name="egl3H"></a>

#### FileConfigMemberLookup

This addressing mode is managed based on the cluster.conf file, and each node will read the list of member nodes in the cluster.conf file under their respective ${nacos.home}/conf and then form a cluster. And after reading the cluster.conf file under ${nacos.home}/conf for the first time, it will automatically register a directory listener with the operating system's _**inotify**_ mechanism to monitor ${nacos.home}/ All file changes in the conf directory (note that only files will be monitored here, and file changes in subdirectories cannot be monitored)<br />When you need to expand or shrink the cluster nodes, you need to manually modify the content of the member node list of cluster.conf under ${nacos.home}/conf for each node.

```java
private FileWatcher watcher = new FileWatcher() {
		@Override
		public void onChange(FileChangeEvent event) {
			readClusterConfFromDisk();
		}

		@Override
		public boolean interest(String context) {
			return StringUtils.contains(context, "cluster.conf");
		}
};

@Override
public void start() throws NacosException {
	readClusterConfFromDisk();

	if (memberManager.getServerList().isEmpty()) {
		throw new NacosException(NacosException.SERVER_ERROR,
					"Failed to initialize the member node, is empty");
	}

	// Use the inotify mechanism to monitor file changes and automatically
	// trigger the reading of cluster.conf
	try {
		WatchFileCenter.registerWatcher(ApplicationUtils.getConfFilePath(), watcher);
	}
	catch (Throwable e) {
		Loggers.CLUSTER.error("An exception occurred in the launch file monitor : {}", e);
	}
}
```

The first time you directly read the node list information in the cluster.conf file, then register a directory listener with WatchFileCenter, and automatically trigger _**readClusterConfFromDisk()**_ to re-read cluster.conf when the cluster.conf file changes file<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/333972/1591014354207-49c1e934-2aa5-465a-8a2b-0b09902814f8.png#align=left&display=inline&height=531&margin=%5Bobject%20Object%5D&name=image.png&originHeight=531&originWidth=1169&size=105696&status=done&style=none&width=1169)

<a name="yFTCl"></a>

#### AddressServerMemberLookup

This addressing mode is based on an additional web server to manage cluster.conf. Each node periodically requests the content of the cluster.conf file from the web server, and then implements addressing between cluster nodes and expansion and contraction. <br />When you need to expand or shrink the cluster, you only need to modify the cluster.conf file, and then each node will automatically get the latest cluster.conf file content when it requests the address server.

```java
@Override
public void start() throws NacosException {
	if (start.compareAndSet(false, true)) {
		this.maxFailCount = Integer.parseInt(ApplicationUtils.getProperty("maxHealthCheckFailCount", "12"));
		initAddressSys();
		run();
	}
}

private void initAddressSys() {
	String envDomainName = System.getenv("address_server_domain");
	if (StringUtils.isBlank(envDomainName)) {
		domainName = System.getProperty("address.server.domain", "jmenv.tbsite.net");
	} else {
		domainName = envDomainName;
	}
	String envAddressPort = System.getenv("address_server_port");
	if (StringUtils.isBlank(envAddressPort)) {
		addressPort = System.getProperty("address.server.port", "8080");
	} else {
		addressPort = envAddressPort;
	}
	addressUrl = System.getProperty("address.server.url",
				ApplicationUtils.getContextPath() + "/" + "serverlist");
	addressServerUrl = "http://" + domainName + ":" + addressPort + addressUrl;
	envIdUrl = "http://" + domainName + ":" + addressPort + "/env";

	Loggers.CORE.info("ServerListService address-server port:" + addressPort);
	Loggers.CORE.info("ADDRESS_SERVER_URL:" + addressServerUrl);
}

@SuppressWarnings("PMD.UndefineMagicConstantRule")
private void run() throws NacosException {
	// With the address server, you need to perform a synchronous member node pull at startup
	// Repeat three times, successfully jump out
	boolean success = false;
	Throwable ex = null;
	int maxRetry = ApplicationUtils.getProperty("nacos.core.address-server.retry", Integer.class, 5);
	for (int i = 0; i < maxRetry; i ++) {
		try {
			syncFromAddressUrl();
			success = true;
			break;
		} catch (Throwable e) {
			ex = e;
			Loggers.CLUSTER.error("[serverlist] exception, error : {}", ExceptionUtil.getAllExceptionMsg(ex));
		}
	}
	if (!success) {
		throw new NacosException(NacosException.SERVER_ERROR, ex);
	}

	GlobalExecutor.scheduleByCommon(new AddressServerSyncTask(), 5_000L);
}
```

During initialization, it will take the initiative to synchronize the current cluster member list information with the address server, and if it fails, retry, the maximum number of retries can be controlled by setting _**nacos.core.address-server.retry**_, The default is 5 times, and then after success, a scheduled task will be created to synchronize the cluster member node information to the address server<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/333972/1591014362972-004f5338-af0d-4d0d-b769-4f3d5118c08a.png#align=left&display=inline&height=846&margin=%5Bobject%20Object%5D&name=image.png&originHeight=846&originWidth=1149&size=188886&status=done&style=none&width=1149)

<a name="sgOTI"></a>

### How node management and addressing modes are combined

![image.png](https://cdn.nlark.com/yuque/0/2020/png/333972/1591014400580-39b83aa0-c548-4241-a49e-0d72abda2a95.png#align=left&display=inline&height=715&margin=%5Bobject%20Object%5D&name=image.png&originHeight=715&originWidth=1189&size=131826&status=done&style=none&width=1189)<br />After MemberLookup starts, it will perform addressing tasks according to different addressing modes, will collect cluster node list information, call memberChange, trigger cluster node changes, and then publish node change events

<a name="idHpC"></a>

## Nacos consensus protocol protocol layer abstraction

From the overall architecture of nacos in the future, it can be seen that the consistency protocol layer will be the core module of nacos, and will serve each functional module built on the core module, or the service and core module itself. The consistency protocol needs to choose between availability and consistency because of the existence of partition fault tolerance, so there are two major types of consistency: final consistency and strong consistency. In nacos, both types of consistency protocols are possible. For example, the naming module uses AP and CP for data management of service instances, respectively. For the config module, it will involve the use of CP. At the same time, there are the following functional demand points

1. At present, the persistence service uses a variant version of raft, and the business and the raft protocol are coupled. Therefore, it needs to be decoupled and decoupled. At the same time, a standard Java version of Raft is selected for implementation.
2. For small and medium-sized users, the configuration is basically not super much. An independent mysql is relatively heavy and requires a light-weight storage solution. It also supports 2.0 not dependent on mysql and 3.0 dependent on mysql configurability
3. Due to CP or AP, there are many implementations, how to make a good abstraction of the consistency protocol layer, so that in the future can quickly achieve the specific implementation of the underlying consistency protocol replacement, such as the Raft protocol, the current selection of nacos It is JRaft, it is not excluded that in the future nacos will implement a standard raft protocol or Paxos protocol by itself
4. Since there are multiple function modules working independently in Nacos, there can be no influence between each function module. For example, when the A module processes the request too slowly or an exception occurs, it cannot affect the normal operation of the B module, that is, each function module is in use. How to isolate the data processing of each module when using a consistent protocol?

According to the consensus protocol and the above functional requirements, this time an abstract consensus protocol layer and related interfaces were made

<a name="3w8xM"></a>

### Consensus agreement abstraction

<a name="p7zRo"></a>

#### ConsistencyProtocol

The so-called consistency is the characteristic of whether multiple copies can maintain consistency, and the essence of the copy is data, and the operation of the data is either acquisition or modification. At the same time, the consensus protocol is actually for distributed situations, and this necessarily involves multiple nodes. Therefore, there is a need for a corresponding interface to be able to adjust the coordination protocol of the collaborative work node. What if we want to observe the operation of the consistency agreement? For example, the Raft protocol, we want to know who is the leader in the current cluster, the term of office, and who are the member nodes in the current cluster? Therefore, it is also necessary to provide a consistent protocol metadata acquisition. <br />In summary, the general design of ConsistencyProtcol can come out

```java
public interface ConsistencyProtocol<T extends Config, P extends LogProcessor> extends CommandOperations {

    /**
     * Consistency protocol initialization: perform initialization operations based on the incoming Config
     * 一致性协议初始化，根据 Config 实现类
     *
     * @param config {@link Config}
     */
    void init(T config);

    /**
     * Add a log handler
     *
     * @param processors {@link LogProcessor}
     */
    void addLogProcessors(Collection<P> processors);

    /**
     * Copy of metadata information for this consensus protocol
     * 该一致性协议的元数据信息
     *
     * @return metaData {@link ProtocolMetaData}
     */
    ProtocolMetaData protocolMetaData();

    /**
     * Obtain data according to the request
     *
     * @param request request
     * @return data {@link Response}
     * @throws Exception
     */
    Response getData(GetRequest request) throws Exception;

    /**
     * Get data asynchronously
     *
     * @param request request
     * @return data {@link CompletableFuture<Response>}
     */
    CompletableFuture<Response> aGetData(GetRequest request);

    /**
     * Data operation, returning submission results synchronously
     * 同步数据提交，在 Datum 中已携带相应的数据操作信息
     *
     * @param data {@link Log}
     * @return submit operation result {@link Response}
     * @throws Exception
     */
    Response submit(Log data) throws Exception;

    /**
     * Data submission operation, returning submission results asynchronously
     * 异步数据提交，在 Datum 中已携带相应的数据操作信息，返回一个Future，自行操作，提交发生的异常会在CompleteFuture中
     *
     * @param data {@link Log}
     * @return {@link CompletableFuture<Response>} submit result
     * @throws Exception when submit throw Exception
     */
    CompletableFuture<Response> submitAsync(Log data);

    /**
     * New member list
     * 新的成员节点列表，一致性协议自行处理相应的成员节点是加入还是离开
     *
     * @param addresses [ip:port, ip:port, ...]
     */
    void memberChange(Set<String> addresses);

    /**
     * Consistency agreement service shut down
     * 一致性协议服务关闭
     */
    void shutdown();

}
```

For the CP protocol, due to the concept of Leader, it is necessary to provide a method for obtaining who is the current Leader of the CP protocol.

```java
public interface CPProtocol<C extends Config> extends ConsistencyProtocol<C> {

	/**
	 * Returns whether this node is a leader node
	 *
	 * @param group business module info
	 * @return is leader
	 * @throws Exception
	 */
	boolean isLeader(String group) throws Exception;

}
```

<a name="oJFpB"></a>

#### Data operation request submission object：Log、GetRequest

As mentioned above, the consistency protocol is actually for data operations. Data operations are basically divided into two categories: data query and data modification, and at the same time, data isolation between different functional modules must be satisfied. Therefore, the data modification operations and data query operations are explained separately here.

1. Data modification
   1. Data modification operation, you must know which functional module this request belongs to
   2. For data modification operations, you must first know what kind of modification operation this data modification operation is for, so that the function module can perform corresponding logical operations for the real data modification operation
   3. For data modification operations, you must know what the modified data is, that is, the request body. In order to make the consistency protocol layer more general, here for the data structure of the request body, the byte[] array is selected
   4. The type of data, because we serialize the real data into a byte[] array, in order to be able to serialize normally, we may also need to record what the type of this data is
   5. The information summary or identification information of this request
   6. The additional information for this request is used to expand the data to be transmitted in the future

In summary, it can be concluded that the design of the Log object is as follows

```protobuf

message Log {
	// Function module grouping information
    string group = 1;
    // Abstract or logo
    string key = 2;
    // Specific request data
    bytes data = 3;
    // type of data
    string type = 4;
    // More specific data manipulation
    string operation = 5;
    // extra information
    map<string, string> extendInfo = 6;
}
```

2. Data query
    1. For data query operations, you must know which function module initiated the request
    2. What are the conditions for data query? In order to be compatible with data query operations of various storage structures, here byte[] is used for storage
    3. The additional information for this request is used to expand the data to be transmitted in the future

In summary, the design of the GetRequest object is as follows

```protobuf
message GetRequest {
	// Function module grouping information
    string group = 1;
    // Specific request data
    bytes data = 2;
    // extra information
    map<string, string> extendInfo = 3;
}
```

<a name="vBig4"></a>

#### Function modules use consistency protocol：LogProcessor

After the data operation is submitted through the consistency protocol, each node needs to process the Log or GetRequest object. Therefore, we need to abstract a Log and GetRequest object Processor. Different functional modules implement the processor. ConsistencyProtocol will internally According to the group attributes of Log and GetRequest, the Log and GetRequest objects are routed to a specific Processor. Of course, the Processor also needs to indicate which functional module it belongs to.

```java
public abstract class LogProcessor {

    /**
     * get data by key
     *
     * @param request request {@link GetRequest}
     * @return target type data
     */
    public abstract Response onRequest(GetRequest request);

    /**
     * Process Submitted Log
     *
     * @param log {@link Log}
     * @return {@link boolean}
     */
    public abstract Response onApply(Log log);

    /**
     * Irremediable errors that need to trigger business price cuts
     *
     * @param error {@link Throwable}
     */
    public void onError(Throwable error) {
    }

    /**
     * In order for the state machine that handles the transaction to be able to route
     * the Log to the correct LogProcessor, the LogProcessor needs to have an identity
     * information
     *
     * @return Business unique identification name
     */
    public abstract String group();

}
```

For the CP protocol, such as the Raft protocol, there is a snapshot design, so we need to separately extend a method for the CP protocol

```java
public abstract class LogProcessor4CP extends LogProcessor {

    /**
     * Discovery snapshot handler
     * It is up to LogProcessor to decide which SnapshotOperate should be loaded and saved by itself
     *
     * @return {@link List <SnapshotOperate>}
     */
    public List<SnapshotOperation> loadSnapshotOperate() {
        return Collections.emptyList();
    }

}
```

<a name="zbsAE"></a>

#### Summary

As can be seen from the above points, ConsistencyProtocol is the use interface exposed to the upper layer functional modules. Each ConsistencyProtocol has a backend implemented by a specific consistency protocol. Because Backend cannot be well compatible with nacos existing architecture design, so The additional LogProcessor is designed to solve this problem.<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/333972/1591015048030-8a4bff4a-20ed-46dd-a7f7-98655b22946f.png#align=left&display=inline&height=591&margin=%5Bobject%20Object%5D&name=image.png&originHeight=591&originWidth=886&size=93327&status=done&style=none&width=886)<br />同At the time, because the backend inside the consistency protocol layer needs to implement the isolation processing of the data of different business modules, and this piece of logic is implemented by the request object and the group attribute of the LogProcessor<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/333972/1591015155835-a897262e-8e57-409c-bf94-d57bf765c80b.png#align=left&display=inline&height=591&margin=%5Bobject%20Object%5D&name=image.png&originHeight=591&originWidth=910&size=118083&status=done&style=none&width=910)

<a name="C1yU6"></a>

### Consistent protocol layer workflow

We can take a look at a sequence diagram, the general workflow of the consistency protocol layer
![](https://cdn.nlark.com/yuque/__puml/30b7e270e7aef8bb63136aaffbe5bfbf.svg#lake_card_v2=eyJjb2RlIjoiQHN0YXJ0dW1sXG5cbnBhcnRpY2lwYW50IFwiTWVtYmVyTWFuYWdlclwiIGFzIE5hY29zQ2x1c3RlclxucGFydGljaXBhbnQgXCJCdXNpbmVzc01vZHVsZVwiIGFzIEJpelxucGFydGljaXBhbnQgXCJDb25zaXN0ZW5jeVByb3RvY29sXCIgYXMgUHJvdG9jb2xcbnBhcnRpY2lwYW50IFwiQ0FQQmFja2VuZFwiIGFzIEJhY2tlbmRcbnBhcnRpY2lwYW50IFwiQ29uZmlnXCIgYXMgQ29uZmlnXG5wYXJ0aWNpcGFudCBcIkxvZ1Byb2Nlc3NvclwiIGFzIFByb2Nlc3NvclxucGFydGljaXBhbnQgXCJMb2dcIiBhcyBMb2dcblxuYWN0aXZhdGUgTmFjb3NDbHVzdGVyXG5OYWNvc0NsdXN0ZXIgLT4gTmFjb3NDbHVzdGVyOiBpbml0KCkg5Yid5aeL5YyWTmFjb3Ppm4bnvqRcblxuTmFjb3NDbHVzdGVyIC0-IENvbmZpZzog6I635Y-WQ29uZmln5a-56LGhXG5hY3RpdmF0ZSBDb25maWdcbkNvbmZpZyAtPiBDb25maWc6IOaUtumbhkxvZ1Byb2Nlc3NvcueahOS_oeaBr1xuQ29uZmlnIC0-IE5hY29zQ2x1c3RlclxuZGVhY3RpdmF0ZSBDb25maWdcblxuXG5OYWNvc0NsdXN0ZXIgLT4gUHJvdG9jb2w6IOiOt-WPluaJgOaciUNvbnNpc3RlbmN5UHJvdG9jb2zlrp7njrBcbmFjdGl2YXRlIFByb3RvY29sXG5cbk5hY29zQ2x1c3RlciAtPiBQcm90b2NvbDogaW5pdChDb25maWcpIOaWueazleaJp-ihjFxuXG5kZWFjdGl2YXRlIFByb3RvY29sXG5kZWFjdGl2YXRlIE5hY29zQ2x1c3RlclxuXG5cbkJpeiAtPiBMb2c6IOWIm-W7uuS4gOS4quS6i-WKoeWvueixoVxuYWN0aXZhdGUgQml6XG5hY3RpdmF0ZSBMb2dcblxuXG5Mb2cgLT4gTG9nOiDorr7nva5kYXRhXG5Mb2cgLT4gTG9nOiDorr7nva5rZXlcbkxvZyAtPiBMb2c6IOiuvue9rmNsYXNzTmFtZVxuTG9nIC0-IExvZzog6K6-572uZXh0ZW5kSW5mb1xuTG9nIC0-IEJpelxuZGVhY3RpdmF0ZSBMb2dcblxuQml6IC0-IFByb3RvY29sOiBzdWJtaXQoTG9nKSDosIPnlKjkuIDoh7TmgKfljY_orq7ov5vooYzkuovliqHmj5DkuqRcbmFjdGl2YXRlIFByb3RvY29sXG5cblByb3RvY29sIC0-IEJhY2tlbmQ6IOWGhemDqOS4gOiHtOaAp-WNj-iuruW3peS9nFxuYWN0aXZhdGUgQmFja2VuZFxuXG5CYWNrZW5kIC0-IFByb3RvY29sOiDov5Tlm57lt6XkvZzlpITnkIbnu5PmnpxcbmRlYWN0aXZhdGUgQmFja2VuZFxuXG5Qcm90b2NvbCAtPiBQcm9jZXNzb3I6IOWwhkxvZ-WIhuWPkeWIsOWvueW6lOeahFByb2Nlc3Nvcu-8jOiwg-eUqCBvbkFwcGx5IOaWueazlVxuYWN0aXZhdGUgUHJvdG9jb2xcbmRlYWN0aXZhdGUgUHJvdG9jb2xcblxuUHJvY2Vzc29yIC0-IEJpejog5LqL5Yqh5o-Q5Lqk57uT5p6cXG5cbmRlYWN0aXZhdGUgUHJvY2Vzc29yXG5kZWFjdGl2YXRlIEJpelxuXG5AZW5kdW1sIiwidHlwZSI6InB1bWwiLCJtYXJnaW4iOnRydWUsImlkIjoiNFZpMkwiLCJ1cmwiOiJodHRwczovL2Nkbi5ubGFyay5jb20veXVxdWUvX19wdW1sLzMwYjdlMjcwZTdhZWY4YmI2MzEzNmFhZmZiZTViZmJmLnN2ZyIsImNhcmQiOiJkaWFncmFtIn0=)

<a name="xtBNU"></a>

### The implementation option of CP protocol in Nacos consistency protocol layer——JRaft

After the consistency protocol layer is abstracted, the rest is the choice of concrete consistency protocol implementation. Here we have chosen Ant Financial's open source JRaft, so how can we use JRaf as a backend of the CP protocol? The following simple flow chart describes the initialization process when JRaft is used as a Backend of the CP protocol

```java
/**
 * A concrete implementation of CP protocol: JRaft
 *
 * <pre>
 *                                           ┌──────────────────────┐               
 *                                           │                      │               
 *            ┌──────────────────────┐       │                      ▼               
 *            │   ProtocolManager    │       │        ┌───────────────────────────┐ 
 *            └──────────────────────┘       │        │for p in [LogProcessor4CP] │ 
 *                        │                  │        └───────────────────────────┘ 
 *                        ▼                  │                      │               
 *      ┌──────────────────────────────────┐ │                      ▼               
 *      │    discovery LogProcessor4CP     │ │             ┌─────────────────┐      
 *      └──────────────────────────────────┘ │             │  get p.group()  │      
 *                        │                  │             └─────────────────┘      
 *                        ▼                  │                      │               
 *                 ┌─────────────┐           │                      │               
 *                 │ RaftConfig  │           │                      ▼               
 *                 └─────────────┘           │      ┌──────────────────────────────┐
 *                        │                  │      │  create raft group service   │
 *                        ▼                  │      └──────────────────────────────┘
 *              ┌──────────────────┐         │                                      
 *              │  JRaftProtocol   │         │                                      
 *              └──────────────────┘         │                                      
 *                        │                  │                                      
 *                     init()                │                                      
 *                        │                  │                                      
 *                        ▼                  │                                      
 *               ┌─────────────────┐         │                                      
 *               │   JRaftServer   │         │                                      
 *               └─────────────────┘         │                                      
 *                        │                  │                                      
 *                        │                  │                                      
 *                        ▼                  │                                      
 *             ┌────────────────────┐        │                                      
 *             │JRaftServer.start() │        │                                      
 *             └────────────────────┘        │                                      
 *                        │                  │                                      
 *                        └──────────────────┘                                      
 * </pre>
 * 
 * @author <a href="mailto:liaochuntao@live.com">liaochuntao</a>
 */
```

JRaftProtocol is a concrete implementation of a ConsistencyProtocol when JRaft is used as the backend of the CP protocol. It has a JRaftServer member attribute inside. JRaftServer distributes various API operations of JRaft, such as data operation submission, data query, and member node changes. , Leader node query, etc.

_**Note: The data generated during JRaft operation is in the ${nacos.home}/data/protocol/raft file directory. Different business modules have different file groupings. If the node crashes or shuts down abnormally, clear the files in the directory and restart the node**_

Since JRaft implements the concept of raft group, it is possible to use the design of raft group to create a raft group for each function module. Here is part of the code, which shows how to embed LogProcessor in the state machine and create a Raft Group for each LogPrcessor

```java
synchronized void createMultiRaftGroup(Collection<LogProcessor4CP> processors) {
	// There is no reason why the LogProcessor cannot be processed because of the synchronization
	if (!this.isStarted) {
		this.processors.addAll(processors);
		return;
	}

	final String parentPath = Paths
				.get(ApplicationUtils.getNacosHome(), "data/protocol/raft").toString();

	for (LogProcessor4CP processor : processors) {
		final String groupName = processor.group();
		if (multiRaftGroup.containsKey(groupName)) {
			throw new DuplicateRaftGroupException(groupName);
		}

		// Ensure that each Raft Group has its own configuration and NodeOptions
		Configuration configuration = conf.copy();
		NodeOptions copy = nodeOptions.copy();
		JRaftUtils.initDirectory(parentPath, groupName, copy);

		// Here, the LogProcessor is passed into StateMachine, and when the StateMachine
		// triggers onApply, the onApply of the LogProcessor is actually called
		NacosStateMachine machine = new NacosStateMachine(this, processor);

		copy.setFsm(machine);
		copy.setInitialConf(configuration);

		// Set snapshot interval, default 1800 seconds
		int doSnapshotInterval = ConvertUtils.toInt(raftConfig
							.getVal(RaftSysConstants.RAFT_SNAPSHOT_INTERVAL_SECS),
					RaftSysConstants.DEFAULT_RAFT_SNAPSHOT_INTERVAL_SECS);

		// If the business module does not implement a snapshot processor, cancel the snapshot
		doSnapshotInterval = CollectionUtils
					.isEmpty(processor.loadSnapshotOperate()) ? 0 : doSnapshotInterval;

		copy.setSnapshotIntervalSecs(doSnapshotInterval);
		Loggers.RAFT.info("create raft group : {}", groupName);
		RaftGroupService raftGroupService = new RaftGroupService(groupName,
					localPeerId, copy, rpcServer, true);

		// Because RpcServer has been started before, it is not allowed to start again here
		Node node = raftGroupService.start(false);
		machine.setNode(node);
		RouteTable.getInstance().updateConfiguration(groupName, configuration);
		RaftExecutor.executeByCommon(() -> registerSelfToCluster(groupName, localPeerId, configuration));

		// Turn on the leader auto refresh for this group
		Random random = new Random();
		long period = nodeOptions.getElectionTimeoutMs() + random.nextInt(5 * 1000);
		RaftExecutor.scheduleRaftMemberRefreshJob(() -> refreshRouteTable(groupName),
					nodeOptions.getElectionTimeoutMs(), period, TimeUnit.MILLISECONDS);
		multiRaftGroup.put(groupName,
					new RaftGroupTuple(node, processor, raftGroupService, machine));
	}
}
```

<a name="4czvB"></a>

#### Q&A: Why do you want to create multiple raft groups

Some people may have doubts. Since the LogProcessor has been designed before, you can use a Raft Group. When the state machine is appl, you can route to different LogProcessors according to the Log group attribute. Each function module creates a Raft group, will it consume a lot of resources? <br />As mentioned before, we hope that the modules that work independently do not affect each other. For example, the A module processing Log may cause the application speed to be slow because of the Block operation, or an exception may occur halfway. For the Raft protocol , When the log apply fails, the state machine will not be able to continue to move forward, because if you continue to move forward, due to the previous step of the apply failure, all subsequent applications may fail, which will cause the data of this node and other nodes Data is never consistent. If we put all the modules that work independently in the same raft group, that is, a state machine, for the data processing request processing, the above-mentioned problems will inevitably occur, and a module will be uncontrollable in the apply log. Factors will affect the normal operation of other modules.

<a name="2GyRw"></a>

### JRaft operation and maintenance

In order to allow users to perform simple operation and maintenance of JRaft, such as leader switching, resetting the current Raft cluster members, triggering a node to perform Snapshot operations, etc., a simple HTTP interface is provided for operation, and the interface has certain Limit, that is, only one operation instruction can be executed at a time

1、Switch the leader node of a certain Raft Group

```java
POST /nacos/v1/core/ops/raft
{
    "groupId": "xxx",
    "command": "transferLeader"
    "value": "ip:{raft_port} or ip:{raft_port},ip:{raft_port},ip:{raft_port}"
}
```

<a name="Fs7VE"></a>

2、Reset a Raft Group cluster member

```java
POST /nacos/v1/core/ops/raft
{
    "groupId": "xxx",
    "command": "resetRaftCluster",
    "value": "ip:{raft_port},ip:{raft_port},ip:{raft_port},ip:{raft_port}"
}
```

Note that this operation is a high-risk operation. This operation and maintenance command can only be used when the n/2 + 1 node of the Raft cluster fails to meet the requirements of more than half of the vote after the crash. It is used to quickly reorganize the remaining nodes to the Raft cluster to provide external Service, but this operation will greatly cause the loss of data<br />

<a name="VfG5T"></a>

3、Trigger a Raft Group to perform a snapshot operation

```java
POST /nacos/v1/core/ops/raft
{
    "groupId": "xxx",
    "command": "doSnapshot",
    "value": "ip:{raft_port}"
}
```

<a name="m9LfI"></a>

4、Remove a member of a Raft Group

```java
POST /nacos/v1/core/ops/raft
{
    "groupId": "xxx",
    "command": "removePeer",
    "value": "ip:{raft_port}"
}
```

<a name="ev3MW"></a>

5、Remove multiple members of a Raft Group in batches

```java
POST /nacos/v1/core/ops/raft
{
    "groupId": "xxx",
    "command": "removePeers",
    "value": "ip:{raft_port},ip:{raft_port},ip:{raft_port},..."
}
```

<a name="GzMuP"></a>

### JRaft protocol related configuration parameters

```yaml
### Sets the Raft cluster election timeout, default value is 5 second
nacos.core.protocol.raft.data.election_timeout_ms=5000
### Sets the amount of time the Raft snapshot will execute periodically, default is 30 minute
nacos.core.protocol.raft.data.snapshot_interval_secs=30
### Requested retries, default value is 1
nacos.core.protocol.raft.data.request_failoverRetries=1
### raft internal worker threads
nacos.core.protocol.raft.data.core_thread_num=8
### Number of threads required for raft business request processing
nacos.core.protocol.raft.data.cli_service_thread_num=4
### raft linear read strategy, defaults to index
nacos.core.protocol.raft.data.read_index_type=ReadOnlySafe
### rpc request timeout, default 5 seconds
nacos.core.protocol.raft.data.rpc_request_timeout_ms=5000
```

#### Linear reading parameter analysis

1. **ReadOnlySafe**
   1. In this linear read mode, every time a Follower makes a read request, it needs to synchronize with the Leader to submit the site information, and the Leader needs to initiate a lightweight RPC request to prove that it is the Leader to more than half of the Follower, which is equivalent to a Follower read, at least 1 + (n/2) + 1 RPC request is required.
2. **ReadOnlyLeaseBased**
   1. In this linear read mode, each time the Follower makes a read request, the Leader only needs to determine whether its Leader lease has expired. If it does not expire, it can directly reply that the Follower is the Leader, but the mechanism has strict requirements on the machine clock. For clock synchronization, consider using this linear read mode.

<a name="WiLDa"></a>

## Nacos embedded distributed ID

The distributed ID embedded in nacos is Snakeflower, the dataCenterId defaults to 1, and the value of workerId is calculated as follows

```yaml
InetAddress address;
try {
	address = InetAddress.getLocalHost();
} catch (final UnknownHostException e) {
	throw new IllegalStateException(
						"Cannot get LocalHost InetAddress, please check your network!");
}
byte[] ipAddressByteArray = address.getAddress();
workerId = (((ipAddressByteArray[ipAddressByteArray.length - 2] & 0B11)
					<< Byte.SIZE) + (ipAddressByteArray[ipAddressByteArray.length - 1]
					& 0xFF));
```
If you need to manually specify dataCenterId and workerId, add command line parameters in application.properties or startup

```yaml
### set the dataCenterID manually
# nacos.core.snowflake.data-center=
### set the WorkerID manually
# nacos.core.snowflake.worker-id=
```

<a name="ZLp5w"></a>

## Nacos embedded lightweight Derby-based distributed relational storage

<a name="1B5KV"></a>

### Background

1. If the number of configuration files is small, the cost of supporting a highly available database cluster in the cluster mode is too large, and it is expected to have a lightweight distributed relational storage to solve
2. Some metadata information storage inside nacos, such as user information, namespace information
3. Source of ideas:[https://github.com/rqlite/rqlite](https://github.com/rqlite/rqlite)

<a name="Du2qc"></a>

### Design ideas

<a name="NzxHa"></a>

#### aims

The design goal is to expect nacos to have two data storage modes, one is the current way, the data is stored in an external data source (relational database); the second way is the embedded storage data source (Apache Derby). Users can use the command line parameter configuration to freely use these two data storage modes<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/333972/1591015542106-f14d2579-229f-4bfb-a432-e40854e65d6d.png#align=left&display=inline&height=903&margin=%5Bobject%20Object%5D&name=image.png&originHeight=903&originWidth=1514&size=237497&status=done&style=none&width=1514)

<a name="LqUtU"></a>

#### overall

Save the SQL context involved in a request operation in order. Then synchronize the SQL context involved in this request through the consensus protocol layer, and then each node parses it and executes it again in a database session in sequence.<br />![未命名文件 (1).png](https://cdn.nlark.com/yuque/0/2020/png/333972/1587204104465-2270480a-de25-4c84-a11b-6edd2de99e66.png#align=left&display=inline&height=814&margin=%5Bobject%20Object%5D&name=%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%20%281%29.png&originHeight=814&originWidth=1149&size=130886&status=done&style=none&width=1149)

<a name="yxFYn"></a>

#### Related data bearing objects

The DML statements of the database are select, insert, update, and delete. According to the nature of SQL statements for data operations, they can be divided into two categories: query and update. The select statement corresponds to data query, and the insert, update, and delete statements correspond to Data modification. At the same time, when performing database operations, in order to avoid SQL injection, PreparedStatement is used, so SQL statements + parameters are required, so two Request objects about database operations can be obtained

1. SelectRequest

```java
public class SelectRequest implements Serializable {

    private static final long serialVersionUID = 2212052574976898602L;
    // Query category, because currently using JdbcTemplate, query a single, multiple queries, whether to use RowMapper into an object
    private byte queryType;
    // sql语句
    // select * from config_info where
    private String sql;
    private Object[] args;
    private String className;
}
```

2. ModifyRequest

```java
public class ModifyRequest implements Serializable {

    private static final long serialVersionUID = 4548851816596520564L;

    private int executeNo;
    private String sql;
    private Object[] args;
}
```

<a name="moKl7"></a>

#### Configure publishing

The configuration release operation involves three transactions:

1. config_info saves configuration information
2. config_tags_relation saves the association relationship between configuration and tags
3. his_config_info saves a history of configuration operations

These three transactions are all configured and released under this big transaction. If we say that we perform a Raft protocol submission for each transaction operation, assume that 1, 2 transactions are successfully applied after being submitted through Raft, and the third transaction is in Raft. Apply fails after submission, then for the big transaction released by this configuration, it needs to be rolled back as a whole, otherwise it will violate the atomicity, then it may be necessary to say that the transaction rollback operation is again Raft submitted, then the overall complexity Rise, and directly introduce the management of distributed transactions, so in order to avoid this problem, we integrate the SQL contexts involved in these three transactions into a large SQL context, and submit the Raft protocol to this large SQL context. It ensures that the three sub-transactions successfully solve the atomicity problem in the same database session. At the same time, because the Raft protocol processes the transaction log serially, it is equivalent to adjusting the transaction isolation level of the database to serialization.

```java
public void addConfigInfo(final String srcIp,
			final String srcUser, final ConfigInfo configInfo, final Timestamp time,
			final Map<String, Object> configAdvanceInfo, final boolean notify) {

	try {
		final String tenantTmp = StringUtils.isBlank(configInfo.getTenant()) ?
					StringUtils.EMPTY :
					configInfo.getTenant();
		configInfo.setTenant(tenantTmp);
        
        // Obtain the database primary key through the snowflake ID algorithm
		long configId = idGeneratorManager.nextId(RESOURCE_CONFIG_INFO_ID);
		long hisId = idGeneratorManager.nextId(RESOURCE_CONFIG_HISTORY_ID);

		addConfigInfoAtomic(configId, srcIp, srcUser, configInfo, time,
					configAdvanceInfo);
		String configTags = configAdvanceInfo == null ?
					null :
					(String) configAdvanceInfo.get("config_tags");

		addConfigTagsRelation(configId, configTags, configInfo.getDataId(),
					configInfo.getGroup(), configInfo.getTenant());
		insertConfigHistoryAtomic(hisId, configInfo, srcIp, srcUser, time, "I");
		EmbeddedStorageContextUtils.onModifyConfigInfo(configInfo, srcIp, time);
		databaseOperate.blockUpdate();
	}
	finally {
		EmbeddedStorageContextUtils.cleanAllContext();
	}
}

public long addConfigInfoAtomic(final long id, final String srcIp,
			final String srcUser, final ConfigInfo configInfo, final Timestamp time,
			Map<String, Object> configAdvanceInfo) {
	...
    // 参数处理
    ...
	final String sql =
				"INSERT INTO config_info(id, data_id, group_id, tenant_id, app_name, content, md5, src_ip, src_user, gmt_create,"
						+ "gmt_modified, c_desc, c_use, effect, type, c_schema) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
	final Object[] args = new Object[] { id, configInfo.getDataId(),
				configInfo.getGroup(), tenantTmp, appNameTmp, configInfo.getContent(),
				md5Tmp, srcIp, srcUser, time, time, desc, use, effect, type, schema, };
	SqlContextUtils.addSqlContext(sql, args);
	return id;
}

public void addConfigTagRelationAtomic(long configId, String tagName, String dataId,
			String group, String tenant) {
	final String sql =
				"INSERT INTO config_tags_relation(id,tag_name,tag_type,data_id,group_id,tenant_id) "
						+ "VALUES(?,?,?,?,?,?)";
	final Object[] args = new Object[] { configId, tagName, null, dataId, group,
				tenant };
	SqlContextUtils.addSqlContext(sql, args);
}

public void insertConfigHistoryAtomic(long configHistoryId, ConfigInfo configInfo,
			String srcIp, String srcUser, final Timestamp time, String ops) {
	...
    // 参数处理
    ...
	final String sql =
				"INSERT INTO his_config_info (id,data_id,group_id,tenant_id,app_name,content,md5,"
						+ "src_ip,src_user,gmt_modified,op_type) VALUES(?,?,?,?,?,?,?,?,?,?,?)";
	final Object[] args = new Object[] { configHistoryId, configInfo.getDataId(),
				configInfo.getGroup(), tenantTmp, appNameTmp, configInfo.getContent(),
				md5Tmp, srcIp, srcUser, time, ops };

	SqlContextUtils.addSqlContext(sql, args);
}

/**
 * Temporarily saves all insert, update, and delete statements under
 * a transaction in the order in which they occur
 *
 * @author <a href="mailto:liaochuntao@live.com">liaochuntao</a>
 */
public class SqlContextUtils {

    private static final ThreadLocal<ArrayList<ModifyRequest>> SQL_CONTEXT =
            ThreadLocal.withInitial(ArrayList::new);

    public static void addSqlContext(String sql, Object... args) {
        ArrayList<ModifyRequest> requests = SQL_CONTEXT.get();
        ModifyRequest context = new ModifyRequest();
        context.setExecuteNo(requests.size());
        context.setSql(sql);
        context.setArgs(args);
        requests.add(context);
        SQL_CONTEXT.set(requests);
    }

    public static List<ModifyRequest> getCurrentSqlContext() {
        return SQL_CONTEXT.get();
    }

    public static void cleanCurrentSqlContext() {
        SQL_CONTEXT.remove();
    }

}
```

A more intuitive understanding through a timing diagram
![](https://cdn.nlark.com/yuque/__puml/618e8997395fbc74433ac4a60f67b6b4.svg#lake_card_v2=eyJjb2RlIjoiQHN0YXJ0dW1sXG5cbmF1dG9udW1iZXJcblxuYWN0b3IgXCJVc2VyXCIgYXMgVXNlclxuXG5wYXJ0aWNpcGFudCBcIkNvbmZpZ1NlcnZpY2VcIiBhcyBTZXJ2aWNlXG5wYXJ0aWNpcGFudCBcIlBlcnNpc3RlbmNlU2VydmljZVwiIGFzIFJlcG9zaXRvcnlcbnBhcnRpY2lwYW50IFwiRGVyYnlcIiBhcyBEQlxucGFydGljaXBhbnQgXCJTUUxDb250ZXh0VXRpbHNcIiBhcyBTUUxDb250ZXh0XG5wYXJ0aWNpcGFudCBcIkxvZ1Byb2Nlc3NvclwiIGFzIFByb2Nlc3NvclxucGFydGljaXBhbnQgXCJDb25zaXN0ZW5jeVByb3RvY29sXCIgYXMgUHJvdG9jb2xcbnBhcnRpY2lwYW50IFwiTG9nXCIgYXMgTG9nXG5cbmFjdGl2YXRlIFVzZXJcblxuVXNlciAtPiBTZXJ2aWNlOiDlj5HotbfphY3nva7lj5HluIPor7fmsYJcbmFjdGl2YXRlIFNlcnZpY2VcblxuU2VydmljZSAtPiBSZXBvc2l0b3J5OiDphY3nva7lj5HluINcbmFjdGl2YXRlIFJlcG9zaXRvcnlcblxuUmVwb3NpdG9yeSAtPiBTUUxDb250ZXh0OiDmi6bmiKrlvZPliY1TUUzkuIrkuIvmlodcbmFjdGl2YXRlIFNRTENvbnRleHRcblxuUmVwb3NpdG9yeSAtPiBSZXBvc2l0b3J5OiBjb21taXQg5pON5L2cXG5cblNRTENvbnRleHQgLT4gUmVwb3NpdG9yeTog5b2T5YmN6K-35rGC5raJ5Y-K55qE5omA5pyJU1FM5LiK5LiL5paHXG5cbmRlYWN0aXZhdGUgU1FMQ29udGV4dFxuXG5SZXBvc2l0b3J5IC0-IExvZzog5p6E5bu66K-35rGC5L2TXG5cbmFjdGl2YXRlIExvZ1xuZGVhY3RpdmF0ZSBMb2dcblxuUmVwb3NpdG9yeSAtPiBQcm90b2NvbDogc3VibWl0KCkg6L-b6KGM6K-35rGC5o-Q5LqkXG5hY3RpdmF0ZSBQcm90b2NvbFxuZGVhY3RpdmF0ZSBSZXBvc2l0b3J5XG5cblByb3RvY29sIC0-IFByb2Nlc3Nvcjogb25BcHBseSgpIOaWueazle-8jOeKtuaAgeacuuWkjeWItkxvZ1xuYWN0aXZhdGUgUHJvY2Vzc29yXG5cblByb2Nlc3NvciAtPiBSZXBvc2l0b3J5OiDmiafooYzmiYDmnInnmoRTUUzkuIrkuIvmlodcbmFjdGl2YXRlIFJlcG9zaXRvcnlcblxuUmVwb3NpdG9yeSAtPiBEQjog5pWw5o2u6JC95bqTXG5hY3RpdmF0ZSBEQlxuXG5EQiAtPiBSZXBvc2l0b3J5OiDnu5PmnZ_lubbov5Tlm57nu5PmnpxcbmRlYWN0aXZhdGUgREJcblxuUmVwb3NpdG9yeSAtPiBQcm9jZXNzb3I6IOi_lOWbnkxvZ0Z1dHVyZeW5tuiuvue9ruacrOasoeaJp-ihjOeahOe7k-aenFxuZGVhY3RpdmF0ZSBSZXBvc2l0b3J5XG5cblByb2Nlc3NvciAtPiBQcm90b2NvbDog6L-U5ZueTG9nRnV0dXJlXG5kZWFjdGl2YXRlIFByb2Nlc3NvclxuXG5Qcm90b2NvbCAtPiBTZXJ2aWNlOiDmnKzmrKHor7fmsYLnmoTnu5PmnpxcbmRlYWN0aXZhdGUgUHJvdG9jb2xcblxuU2VydmljZSAtPiBVc2VyXG5kZWFjdGl2YXRlIFNlcnZpY2VcbmRlYWN0aXZhdGUgVXNlclxuXG5AZW5kdW1sIiwidHlwZSI6InB1bWwiLCJtYXJnaW4iOnRydWUsImlkIjoiVnQxNzciLCJ1cmwiOiJodHRwczovL2Nkbi5ubGFyay5jb20veXVxdWUvX19wdW1sLzYxOGU4OTk3Mzk1ZmJjNzQ0MzNhYzRhNjBmNjdiNmI0LnN2ZyIsImNhcmQiOiJkaWFncmFtIn0=)

<a name="AAJTE"></a>

### How to use new features

```bash
./startup.sh -p embedded
```

Whether to enable the embedded distributed relational storage activity diagram
![](https://cdn.nlark.com/yuque/__puml/1fd656ba3b39fe5de8fea78efdf98dd1.svg#lake_card_v2=eyJjb2RlIjoiQHN0YXJ0dW1sXG5cbigqKSAtLT4gXCJDb25maWcuc3RhcnQoKVwiXG5cbmlmIFwi5Y2V5py65qih5byPXCIgdGhlblxuICAtcmlnaHQtPlt0cnVlXSBcInJldHVybiDpu5jorqTljZXmnLrlrZjlgqjooYzkuLpcIlxuICAtLT4gKCopXG5lbHNlXG4gaWYgXCLlt7LphY3nva7lpJbnva7lrZjlgqhcIiB0aGVuXG4gICAgLS0-W3RydWVdIFwicmV0dXJuIOWklue9ruaVsOaNruWtmOWCqOihjOS4ulwiXG4gICAgLS0-ICgqKVxuIGVsc2VcbiAgICBpZiBcIuW8gOWQr-WGheW1jOWtmOWCqFwiIHRoZW5cbiAgICAgICAgLS0-W3RydWVdIFwicmV0dXJuIOi9u-mHj-WGheW1jOWIhuW4g-W8j-WtmOWCqOihjOS4ulwiXG4gICAgICAgIC0tPiAoKilcbiAgICBlbHNlXG4gICAgICAgIC0-W2ZhbHNlXSBcInJldHVybiDpu5jorqTlpJbnva7mlbDmja7lrZjlgqjooYzkuLpcIlxuICAgICAgICAtLT4gKCopXG5cdFx0ZW5kaWZcbiBlbmRpZlxuZW5kaWZcblxuQGVuZHVtbCIsInR5cGUiOiJwdW1sIiwibWFyZ2luIjp0cnVlLCJpZCI6IkNNN1VDIiwidXJsIjoiaHR0cHM6Ly9jZG4ubmxhcmsuY29tL3l1cXVlL19fcHVtbC8xZmQ2NTZiYTNiMzlmZTVkZThmZWE3OGVmZGY5OGRkMS5zdmciLCJjYXJkIjoiZGlhZ3JhbSJ9)

<a name="9UAXN"></a>

### New features related operation and maintenance operations

Directly query the data stored in each node's derby

```java
GET /nacos/v1/cs/ops/derby?sql=select * from config_info

return List<Map<String, Object>>
```

<a name="YcqO2"></a>

### insufficient

1. Build a distributed data operation synchronization layer on the upper layer of the database, there are restrictions on the operation of the database, such as the first insert operation, then the select operation, and finally the update operation, which is interspersed with query statements in the data modification statement The order of operations is not supported
2. Limiting the performance of the database, due to the indirect adjustment of the database transaction isolation level to serialization, the concurrency ability is artificially reduced

<a name="7dul8"></a>

### Future evolution

Apache Derby official will try to realize the synchronous replication operation of BingLog based on Raft, and realize the database synchronization capability from the bottom

