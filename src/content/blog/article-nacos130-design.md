---
title: Nacos 1.3.0 全新内核构建过程
keywords: [nacos1.3.0, 内核]
description: Nacos 1.3.0 全新内核构建过程
date: "2020-02-12"
category: article
---

# Nacos 1.3.0 特性以及功能使用文档

<a name="0YIG0"></a>

## 概述

本次1.3.0的改动程度很大，涉及两大模块的修改以及新增一个核心模块

1. nacos-core模块修改
   1. nacos集群节点成员寻址模式的统一管理
   2. nacos内部事件机制
   3. nacos一致性协议层
2. nacos-config模块修改
   1. 新增内嵌分布式数据存储组件
   2. 内嵌存储与外置存储细分
   3. 内嵌存储简单运维
3. nacos-consistency模块新增
   1. 对于AP协议以及CP协议的统一抽象

<br />

<a name="rnkDY"></a>

## 系统参数变化

<a name="1Gmg9"></a>

### 新增

| **core模块** | nacos.watch-file.max-dirs | JVM参数 | 最大可监听目录数量 |
| :---: | --- | --- | --- |
|  | nacos.core.notify.ring-buffer-size | JVM参数 | 快速通知队列的最大长度 |
|  | nacos.core.notify.share-buffer-size | JVM参数 | 慢速通知队列的最大长度 |
|  | nacos.core.member.fail-access-cnt | JVM参数、application.properties配置 | 集群成员节点最大失败访问次数 |
|  | nacos.core.address-server.retry | JVM参数、application.properties配置 | 地址服务器寻址模式，首次启动请求重试次数 |

<br />

<a name="kxo8O"></a>

## Nacos的未来整体逻辑架构及其组件

![1561217775318-6e408805-18bb-4242-b4e9-83c5b929b469.png](https://cdn.nlark.com/yuque/0/2020/png/333972/1587129046320-5a286f38-8db4-4e76-9b42-8bd859f51a60.png#align=left&display=inline&height=1184&margin=%5Bobject%20Object%5D&name=1561217775318-6e408805-18bb-4242-b4e9-83c5b929b469.png&originHeight=1184&originWidth=1608&size=279074&status=done&style=none&width=1608)

<a name="Hyc6u"></a>

## Nacos集群成员节点寻址模式

<br />在1.3.0之前，nacos的naming模块以及config模块存在各自的集群成员节点列表管理任务。为了统一nacos集群下成员列表的寻址模式，将集群节点管理的实现从naming模块以及config模块剥离出来，统一下沉到了core模块的寻址模，同时新增命令行参数 **-Dnacos.member.list **进行设置nacos集群节点列表，该参数可以看作是cluster.conf文件的一个替代。目前nacos的寻址模式类别如下

   1. 单机模式下：StandaloneMemberLookup
   2. 集群模式
      1. cluster.conf文件存在：FileConfigMemberLookup
      2. cluster.conf文件不存在或者 -Dnacos.member.list没有设置：AddressServerMemberLookup



如果说想指定某一种寻址模式，则设置此参数：**nacos.core.member.lookup.type=[file,address-server]**

逻辑图如下
![](https://cdn.nlark.com/yuque/__puml/e209a677aa8b5ffce23589e987ee5129.svg#lake_card_v2=eyJjb2RlIjoiQHN0YXJ0dW1sXG5cbigqKSAtLT4gXCJMb29rdXBGYWN0b3J5LmluaXQoKVwiXG5cbmlmIFwic3RhbmRhbG9uZSBtb2RlXCIgdGhlblxuICAtLT5bdHJ1ZV0gXCJyZXR1cm4gU3RhbmRhbG9uZU1lbWJlckxvb2t1cFwiXG4gIC0tPiBMb29rdXAucnVuKClcbmVsc2VcbiBpZiBcImNsdXN0ZXIuY29uZiBleGlzdHNcIiB0aGVuXG4gICAgLS0-W3RydWVdIFwicmV0dXJuIEZpbGVDb25maWdNZW1iZXJMb29rdXBcIlxuICAgIC0tPiBMb29rdXAucnVuKClcbiBlbHNlXG4gICAgLT5bZmFsc2VdIFwicmV0dXJuIEFkZHJlc3NTZXJ2ZXJNZW1iZXJMb29rdXBcIlxuICAgIC0tPiBMb29rdXAucnVuKClcbiBlbmRpZlxuZW5kaWZcblxuLS0-ICgqKVxuXG5AZW5kdW1sIiwidHlwZSI6InB1bWwiLCJpZCI6IlplWGtkIiwidXJsIjoiaHR0cHM6Ly9jZG4ubmxhcmsuY29tL3l1cXVlL19fcHVtbC9lMjA5YTY3N2FhOGI1ZmZjZTIzNTg5ZTk4N2VlNTEyOS5zdmciLCJjYXJkIjoiZGlhZ3JhbSJ9)

<a name="wqkMp"></a>
### 寻址模式详细
接下来介绍除了单机模式下的寻址模式的其他两种寻址模式<br />

<a name="egl3H"></a>

#### FileConfigMemberLookup

该寻址模式是基于cluster.conf文件进行管理的，每个节点会读取各自${nacos.home}/conf下的cluster.conf文件内的成员节点列表，然后组成一个集群。并且在首次读取完${nacos.home}/conf下的cluster.conf文件后，会自动向操作系统的_**inotify**_机制注册一个目录监听器，监听${nacos.home}/conf目录下的所有文件变动（注意，这里只会监听文件，对于子目录下的文件变动无法监听）<br />当需要进行集群节点扩缩容时，需要手动去修改每个节点各自${nacos.home}/conf下的cluster.conf的成员节点列表内容。

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
首次启动时直接读取cluster.conf文件内的节点列表信息，然后向WatchFileCenter注册一个目录监听器，当cluster.conf文件发生变动时自动触发_**readClusterConfFromDisk()**_重新读取cluster.conf文件<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/333972/1591014354207-49c1e934-2aa5-465a-8a2b-0b09902814f8.png#align=left&display=inline&height=531&margin=%5Bobject%20Object%5D&name=image.png&originHeight=531&originWidth=1169&size=105696&status=done&style=none&width=1169)

<a name="yFTCl"></a>

#### AddressServerMemberLookup

该寻址模式是基于一个额外的web服务器来管理cluster.conf，每个节点定期向该web服务器请求cluster.conf的文件内容，然后实现集群节点间的寻址，以及扩缩容。<br />当需要进行集群扩缩容时，只需要修改cluster.conf文件即可，然后每个节点向地址服务器请求时会自动的得到最新的cluster.conf文件内容。

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
在初始化时，会主动去向地址服务器同步当前的集群成员列表信息，如果失败则进行重试，其最大重试次数可通过设置_**nacos.core.address-server.retry**_来控制，默认是5次，然后成功之后，将创建定时任务去向地址服务器同步集群成员节点信息<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/333972/1591014362972-004f5338-af0d-4d0d-b769-4f3d5118c08a.png#align=left&display=inline&height=846&margin=%5Bobject%20Object%5D&name=image.png&originHeight=846&originWidth=1149&size=188886&status=done&style=none&width=1149)

<a name="sgOTI"></a>

### 节点管理和寻址模式如何结合的

![image.png](https://cdn.nlark.com/yuque/0/2020/png/333972/1591014400580-39b83aa0-c548-4241-a49e-0d72abda2a95.png#align=left&display=inline&height=715&margin=%5Bobject%20Object%5D&name=image.png&originHeight=715&originWidth=1189&size=131826&status=done&style=none&width=1189)<br />MemberLookup在启动之后，会根据不同的寻址模式，执行寻址任务，将收集到集群节点列表信息，调用memberChange，触发集群节点变动，然后发布节点变更事件

<a name="idHpC"></a>

## Nacos一致性协议协议层抽象

从nacos的未来的整体架构图可以看出，一致性协议层将是作为nacos的最为核心的模块，将服务于构建在core模块之上的各个功能模块，或者服务与core模块本身。而一致性协议因为分区容错性的存在，需要在可用性与一致性之间做选择，因此就存在两大类一致性：最终一致性和强一致性。在nacos中，这两类一致性协议都是可能用到的，比如naming模块，对于服务实例的数据管理分别用到了AP以及CP，而对于config模块，将会涉及使用CP。同时还有如下几个功能需求点

1. 目前持久化服务使用用了变种版本的raft，并且业务和raft协议耦合，因此需要抽离解耦，同时是选择一个标准的Java版Raft实现
1. 对于中小用户，配置基本其实不会超级多，独立一个mysql，相对重一些，需要一个轻量化的存储方案，并且支持2.0不依赖mysql和3.0依赖mysql可配置能力
1. 由于CP或者AP，其存在多种实现，如何对一致性协议层做一次很好的抽象，以便将来可以快速的实现底层一致性协议具体实现的替换，比如Raft协议，目前nacos的选型是JRaft，不排除将来nacos会自己实现一个标准raft协议或者实现Paxos协议
1. 由于Nacos存在多个独立工作的功能模块，每个功能模块之间不能出现影响，比如A模块处理请求过慢或者出现异常时，不能影响B模块的正常工作，即每个功能模块在使用一致性协议时，如何将每个模块的数据处理进行隔离？

根据一致协议以及上述功能需求点，本次做了一个抽象的一致协议层以及相关的接口
<a name="3w8xM"></a>

### 一致协议抽象

<a name="p7zRo"></a>

#### ConsistencyProtocol

所谓一致性，即多个副本之间是否能够保持一致性的特性，而副本的本质就是数据，对数据的操作，不是获取就是修改。同时，一致协议其实是针对分布式情况的，而这必然涉及多个节点，因此，需要有相应的接口能够调整一致性协议的协同工作节点。如果我们要观察一致性协议运行的情况，该怎么办？比如Raft协议，我们希望得知当前集群中的Leader是谁，任期的情况，当前集群中的成员节点有谁？因此，还需要提供一个一致性协议元数据获取。<br />综上所述，ConsistencyProtcol的大致设计可以出来了

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
而针对CP协议，由于存在Leader的概念，因此需要提供一个方法用于获取CP协议当前的Leader是谁

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

#### 数据操作请求提交对象：Log、GetRequest

上面说到，一致性协议其实是对于数据操作而言的，数据操作基本分为两大类：数据查询以及数据修改，同时还要满足不同功能模块之间的数据进行隔离。因此这里针对数据修改操作以及数据查询操作分别阐述。

1. 数据修改
   1. 数据修改操作，一定要知道本次请求是属于哪一个功能模块的
   2. 数据修改操作，首先一定要知道这个数据的修改操作具体是哪一种修改操作，方便功能模块针对真正的数据修改操作进行相应的逻辑操作
   3. 数据修改操作，一定要知道修改的数据是什么，即请求体，为了使得一致性协议层更为通用，这里对于请求体的数据结构，选择了byte[]数组
   4. 数据的类型，由于我们将真正的数据序列化为了byte[]数组，为了能够正常序列化，我们可能还需要记录这个数据的类型是什么
   5. 本次请求的信息摘要或者标识信息
   6. 本次请求的额外信息，用于将来扩展需要传输的数据

综上，可以得出Log对象的设计如下

```protobuf
message Log {
	// 功能模块分组信息
    string group = 1;
    // 摘要或者标识
    string key = 2;
    // 具体请求数据
    bytes data = 3;
    // 数据类型
    string type = 4;
    // 更为具体的数据操作
    string operation = 5;
    // 额外信息
    map<string, string> extendInfo = 6;
}
```

2. 数据查询
   1. 数据查询操作，一定要知道本次请求是由哪一个功能模块发起的
   2. 数据查询的条件是什么，为了兼容各种存储结构的数据查询操作，这里用byte[]进行存储
   3. 本次请求的额外信息，用于将来扩展需要传输的数据

综上，可以得出GetRequest对象的设计如下

```protobuf
message GetRequest {
	// 功能模块分组信息
    string group = 1;
    // 具体请求数据
    bytes data = 2;
    // 额外信息
    map<string, string> extendInfo = 3;
}
```

<a name="vBig4"></a>

#### 功能模块使用一致性协议：LogProcessor

当数据操作通过一致性协议进行submit之后，每个节点需要去处理这个Log或者GetRequest对象，因此，我们需要抽象出一个Log、GetRequest对象的Processor，不同的功能模块通过实现该处理器，ConsistencyProtocol内部会根据Log、GetRequest的group属性，将Log、GetRequest对象路由到具体的Processor，当然，Processor也需要表明自己是属于哪一个功能模块的。

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
针对CP协议，比如Raft协议，存在快照的设计，因此我们需要针对CP协议单独扩展出一个方法

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

#### 综述

从上面这几点可以看出来，ConsistencyProtocol是对上层功能模块暴露出来的使用接口，每个ConsistencyProtocol后面有具体的一致性协议实现的Backend，由于Backend无法很好的兼容nacos现有的架构设计，因此额外设计的LogProcessor就是为了解决这个问题。<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/333972/1591015048030-8a4bff4a-20ed-46dd-a7f7-98655b22946f.png#align=left&display=inline&height=591&margin=%5Bobject%20Object%5D&name=image.png&originHeight=591&originWidth=886&size=93327&status=done&style=none&width=886)<br />同时，由于在一致性协议层内部的Backend中需要实现对不同业务模块的数据进行隔离处理，而这个一块逻辑由请求对象和LogProcessor的group属性来实现<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/333972/1591015155835-a897262e-8e57-409c-bf94-d57bf765c80b.png#align=left&display=inline&height=591&margin=%5Bobject%20Object%5D&name=image.png&originHeight=591&originWidth=910&size=118083&status=done&style=none&width=910)

<a name="C1yU6"></a>

### 一致性协议层工作流程

我们可以通过一个时序图看看，一致性协议层的大致工作流程
![](https://cdn.nlark.com/yuque/__puml/30b7e270e7aef8bb63136aaffbe5bfbf.svg#lake_card_v2=eyJjb2RlIjoiQHN0YXJ0dW1sXG5cbnBhcnRpY2lwYW50IFwiTWVtYmVyTWFuYWdlclwiIGFzIE5hY29zQ2x1c3RlclxucGFydGljaXBhbnQgXCJCdXNpbmVzc01vZHVsZVwiIGFzIEJpelxucGFydGljaXBhbnQgXCJDb25zaXN0ZW5jeVByb3RvY29sXCIgYXMgUHJvdG9jb2xcbnBhcnRpY2lwYW50IFwiQ0FQQmFja2VuZFwiIGFzIEJhY2tlbmRcbnBhcnRpY2lwYW50IFwiQ29uZmlnXCIgYXMgQ29uZmlnXG5wYXJ0aWNpcGFudCBcIkxvZ1Byb2Nlc3NvclwiIGFzIFByb2Nlc3NvclxucGFydGljaXBhbnQgXCJMb2dcIiBhcyBMb2dcblxuYWN0aXZhdGUgTmFjb3NDbHVzdGVyXG5OYWNvc0NsdXN0ZXIgLT4gTmFjb3NDbHVzdGVyOiBpbml0KCkg5Yid5aeL5YyWTmFjb3Ppm4bnvqRcblxuTmFjb3NDbHVzdGVyIC0-IENvbmZpZzog6I635Y-WQ29uZmln5a-56LGhXG5hY3RpdmF0ZSBDb25maWdcbkNvbmZpZyAtPiBDb25maWc6IOaUtumbhkxvZ1Byb2Nlc3NvcueahOS_oeaBr1xuQ29uZmlnIC0-IE5hY29zQ2x1c3RlclxuZGVhY3RpdmF0ZSBDb25maWdcblxuXG5OYWNvc0NsdXN0ZXIgLT4gUHJvdG9jb2w6IOiOt-WPluaJgOaciUNvbnNpc3RlbmN5UHJvdG9jb2zlrp7njrBcbmFjdGl2YXRlIFByb3RvY29sXG5cbk5hY29zQ2x1c3RlciAtPiBQcm90b2NvbDogaW5pdChDb25maWcpIOaWueazleaJp-ihjFxuXG5kZWFjdGl2YXRlIFByb3RvY29sXG5kZWFjdGl2YXRlIE5hY29zQ2x1c3RlclxuXG5cbkJpeiAtPiBMb2c6IOWIm-W7uuS4gOS4quS6i-WKoeWvueixoVxuYWN0aXZhdGUgQml6XG5hY3RpdmF0ZSBMb2dcblxuXG5Mb2cgLT4gTG9nOiDorr7nva5kYXRhXG5Mb2cgLT4gTG9nOiDorr7nva5rZXlcbkxvZyAtPiBMb2c6IOiuvue9rmNsYXNzTmFtZVxuTG9nIC0-IExvZzog6K6-572uZXh0ZW5kSW5mb1xuTG9nIC0-IEJpelxuZGVhY3RpdmF0ZSBMb2dcblxuQml6IC0-IFByb3RvY29sOiBzdWJtaXQoTG9nKSDosIPnlKjkuIDoh7TmgKfljY_orq7ov5vooYzkuovliqHmj5DkuqRcbmFjdGl2YXRlIFByb3RvY29sXG5cblByb3RvY29sIC0-IEJhY2tlbmQ6IOWGhemDqOS4gOiHtOaAp-WNj-iuruW3peS9nFxuYWN0aXZhdGUgQmFja2VuZFxuXG5CYWNrZW5kIC0-IFByb3RvY29sOiDov5Tlm57lt6XkvZzlpITnkIbnu5PmnpxcbmRlYWN0aXZhdGUgQmFja2VuZFxuXG5Qcm90b2NvbCAtPiBQcm9jZXNzb3I6IOWwhkxvZ-WIhuWPkeWIsOWvueW6lOeahFByb2Nlc3Nvcu-8jOiwg-eUqCBvbkFwcGx5IOaWueazlVxuYWN0aXZhdGUgUHJvdG9jb2xcbmRlYWN0aXZhdGUgUHJvdG9jb2xcblxuUHJvY2Vzc29yIC0-IEJpejog5LqL5Yqh5o-Q5Lqk57uT5p6cXG5cbmRlYWN0aXZhdGUgUHJvY2Vzc29yXG5kZWFjdGl2YXRlIEJpelxuXG5AZW5kdW1sIiwidHlwZSI6InB1bWwiLCJtYXJnaW4iOnRydWUsImlkIjoiNFZpMkwiLCJ1cmwiOiJodHRwczovL2Nkbi5ubGFyay5jb20veXVxdWUvX19wdW1sLzMwYjdlMjcwZTdhZWY4YmI2MzEzNmFhZmZiZTViZmJmLnN2ZyIsImNhcmQiOiJkaWFncmFtIn0=)

<a name="xtBNU"></a>

### Nacos一致性协议层之CP协议的实现选择——JRaft

一致性协议层抽象好之后，剩下就是具体一致性协议实现的选择了，这里我们选择了蚂蚁金服开源的JRaft，那么我们如何将JRaft作为CP协议的一个Backend呢？下面的简单流程图描述了当JRaft作为CP协议的一个Backend时的初始化流程

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

JRaftProtocol是当JRaft作为CP协议的Backend时的一个ConsistencyProtocol的具体实现，其内部有一个JRaftServer成员属性，JRaftServer分装了JRaft的各种API操作，比如数据操作的提交，数据的查询，成员节点的变更，Leader节点的查询等等。

_**注意事项：JRaft运行期间产生的数据在${nacos.home}/data/protocol/raft文件目录下。不同的业务模块有不同的文件分组，如果当节点出现crash或者异常关闭时，清空该目录下的文件，重启节点即可**_

由于JRaft实现了raft group的概念，因此，完全可以利用raft group的设计，为每个功能模块单独创建一个raft group。这里给出部分代码，该代码体现了如何将LogProcessor嵌入到状态机中并为每个LogPrcessor创建一个Raft Group

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

#### 疑问解答：为什么要创建多个raft group

或许有的人会有疑问，既然之前已经设计出了LogProcessor，完全可以利用一个Raft Group，在状态机appl时，根据Log的group属性进行路由到不同的LogProcessor即可，每个功能模块就创建一个raft group，不是会消耗大量的资源吗？<br />正如之前所说，我们希望独立工作的模块之间相互不存在影响，比如A模块处理Log因为存在Block操作可能使得apply的速度缓慢，亦或者可能中途发生异常，对于Raft协议来说，当日志apply失败时，状态机将不能够继续向前推进，因为如果继续向前推进的话，由于上一步的apply失败，后面的所有apply都可能失败，将会导致这个节点的数据与其他节点的数据永远不一致。如果说我们将所有独立工作的模块，对于数据操作的请求处理放在同一个raft group，即一个状态机中，就不可避免的会出现上述所说的问题，某个模块在apply日志发生不可控的因素时，会影响其他模块的正常工作。

<a name="2GyRw"></a>

### JRaft运维操作

为了使用者能够对JRaft进行相关简单的运维，比如Leader的切换，重置当前Raft集群成员，触发某个节点进行Snapshot操作等等，提供了一个简单的HTTP接口进行操作，并且该接口有一定的限制，即每次只会执行一条运维指令

1、切换某一个Raft Group的Leader节点

```java
POST /nacos/v1/core/ops/raft
{
    "groupId": "xxx",
    "command": "transferLeader"
    "value": "ip:{raft_port} or ip:{raft_port},ip:{raft_port},ip:{raft_port}"
}
```

<a name="Fs7VE"></a>

2、重置某一个Raft Group的集群成员

```java
POST /nacos/v1/core/ops/raft
{
    "groupId": "xxx",
    "command": "resetRaftCluster",
    "value": "ip:{raft_port},ip:{raft_port},ip:{raft_port},ip:{raft_port}"
}
```

注意，该操作是一个高危操作，仅仅当Raft集群的 n/2 + 1节点crash之后无法满足过半投票的要求才可以使用该运维命令，用于快速让当前剩余的节点重组Raft集群，对外提供服务，但是这个操作很大程度会造成数据的丢失<br />

<a name="VfG5T"></a>

3、触发某一个Raft Group执行快照操作

```java
POST /nacos/v1/core/ops/raft
{
    "groupId": "xxx",
    "command": "doSnapshot",
    "value": "ip:{raft_port}"
}
```

<a name="m9LfI"></a>

4、移除某一个Raft Group中的某一成员

```java
POST /nacos/v1/core/ops/raft
{
    "groupId": "xxx",
    "command": "removePeer",
    "value": "ip:{raft_port}"
}
```

<a name="ev3MW"></a>

5、批量移除某一个Raft Group中的多个成员

```java
POST /nacos/v1/core/ops/raft
{
    "groupId": "xxx",
    "command": "removePeers",
    "value": "ip:{raft_port},ip:{raft_port},ip:{raft_port},..."
}
```

<a name="GzMuP"></a>

### JRaft协议相关配置参数

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

#### 线性读参数解析

1. **ReadOnlySafe**
   1. 该线性读模式，每次Follower进行读请求时，需要和Leader同步日志提交位点信息，而Leader，需要向过半的Follower发起证明自己是Leader的轻量的RPC请求，相当于一个Follower读，至少需要1 + （n/2）+ 1 次的RPC请求。
2. **ReadOnlyLeaseBased**
   1. 该线性读模式，每次Follower进行读请求时，Leader只需要判断自己的Leader租约是否过期了，如果没有过期，直接可以回复Follower自己是Leader，但是该机制对于机器时钟要求很严格，如果有做时钟同步的话，可以考虑使用该线性读模式。


<a name="WiLDa"></a>

## Nacos内嵌分布式ID

nacos内嵌的分布式ID为Snakeflower，dataCenterId默认为1，workerId的值计算方式如下

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

如果需要手动指定dataCenterId以及workerId，则在application.properties或者启动时添加命令行参数

```yaml
### set the dataCenterID manually
# nacos.core.snowflake.data-center=
### set the WorkerID manually
# nacos.core.snowflake.worker-id=
```

<a name="ZLp5w"></a>

## Nacos内嵌的轻量的基于Derby的分布式关系型存储

<a name="1B5KV"></a>

### 背景

1. 如果配置文件数量较少，在集群模式下需要高可用数据库集群作为支撑的成本太大，期望有一个轻量的分布式关系型存储来解决
2. nacos内部一些元数据信息存储，比如用户信息，命名空间信息
3. 思路来源：[https://github.com/rqlite/rqlite](https://github.com/rqlite/rqlite)

<a name="Du2qc"></a>

### 设计思路

<a name="NzxHa"></a>

#### 目标

设计目标，是期望nacos存在两种数据存储模式，一种是现在的方式，数据存储在外置数据源（关系型数据库）；第二种方式是内嵌存储数据源（Apache Derby）。用户能够使用命令行参数配置的方式，随意使用这两种数据存储模式<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/333972/1591015542106-f14d2579-229f-4bfb-a432-e40854e65d6d.png#align=left&display=inline&height=903&margin=%5Bobject%20Object%5D&name=image.png&originHeight=903&originWidth=1514&size=237497&status=done&style=none&width=1514)

<a name="LqUtU"></a>

#### 总体

将一次请求操作涉及的SQL上下文按顺序保存起来。然后通过一致协议层将本次请求涉及的SQL上下文进行同步，然后每个节点将其解析并重新按顺序在一次数据库会话中执行。<br />![未命名文件 (1).png](https://cdn.nlark.com/yuque/0/2020/png/333972/1587204104465-2270480a-de25-4c84-a11b-6edd2de99e66.png#align=left&display=inline&height=814&margin=%5Bobject%20Object%5D&name=%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%20%281%29.png&originHeight=814&originWidth=1149&size=130886&status=done&style=none&width=1149)

<a name="yxFYn"></a>

#### 谁可以处理请求

当使用者开启1.3.0的新特性——内嵌分布式关系型数据存储时，所有的写操作请求都将路由到Leader节点进行处理；但是，由于Raft状态机的特性，当某一个节点在apply数据库操作请求时发生非SQL逻辑错误引发的异常时，将导致状态机无法继续正常进行工作，此时将会触发配置管理模块的降级操作

```java
private void registerSubscribe() {
	NotifyCenter.registerSubscribe(new SmartSubscribe() {

		@Override
		public void onEvent(Event event) {
			if (event instanceof RaftDBErrorRecoverEvent) {
				downgrading = false;
				return;
			}
			if (event instanceof RaftDBErrorEvent) {
				downgrading = true;
			}
		}

		@Override
		public boolean canNotify(Event event) {
			return (event instanceof RaftDBErrorEvent) || (event instanceof RaftDBErrorRecoverEvent);
		}
	});
}
```

因此，综上所述，可以通过活动图来理解下，什么情况下需要将请求进行转发
![](https://cdn.nlark.com/yuque/__puml/db53c1ade61235d4c9659607b98ef7c6.svg#lake_card_v2=eyJjb2RlIjoiQHN0YXJ0dW1sXG5cbigqKSAtLT4gXCJGaWx0ZXIuZG9GaWx0ZXJcIlxuXG5pZiBcIuacrOiKgueCueaYr0xlYWRlclwiIHRoZW5cbiAgLWxlZnQtPlt0cnVlXSBcIuacrOiKgueCueWkhOeQhlwiXG4gIC0tPiAoKilcbmVsc2VcbiAgICBpZiBcIuezu-e7n-mZjee6p-W8gOWQr1wiIHRoZW5cbiAgICAgICAgLS0-W3RydWVdIFwi6L2s5Y-R57uZTGVhZGVyXCJcbiAgICAgICAgLS0-ICgqKVxuICAgIGVsc2VcbiAgICAgICAgaWYgXCLlhpnmk43kvZzor7fmsYJcIiB0aGVuXG4gICAgICAgICAgICAtLT5bdHJ1ZV0gXCLovazlj5Hnu5lMZWFkZXJcIlxuICAgICAgICAgICAgLS0-ICgqKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICAtLT5bZmFsc2VdIFwi5pys6IqC54K55aSE55CGXCJcbiAgICAgICAgZW5kaWZcbiAgICBlbmRpZlxuZW5kaWZcblxuQGVuZHVtbCIsInR5cGUiOiJwdW1sIiwibWFyZ2luIjp0cnVlLCJpZCI6IjFuWW9HIiwidXJsIjoiaHR0cHM6Ly9jZG4ubmxhcmsuY29tL3l1cXVlL19fcHVtbC9kYjUzYzFhZGU2MTIzNWQ0Yzk2NTk2MDdiOThlZjdjNi5zdmciLCJjYXJkIjoiZGlhZ3JhbSJ9)

<a name="g1buf"></a>

#### 相关数据承载对象

数据库的DML语句是select、insert、update、delete，根据SQL语句对于数据操作的性质，可以分为两大类：query以及update，select语句对应的是数据查询，insert、update、delete语句对应的是数据修改。同时在进行数据库操作时，为了避免SQL注入，使用的是PreparedStatement，因此需要SQL语句+参数，因此可以得到两个关于数据库操作的Request对象

1. SelectRequest
```java
public class SelectRequest implements Serializable {

    private static final long serialVersionUID = 2212052574976898602L;
    // 查询类别，因为目前使用的是JdbcTemplate，查询单个、查询多个，是否使用RowMapper转为对象
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

#### 配置发布

配置发布操作涉及三个事务：

1. config_info保存配置信息
2. config_tags_relation保存配置与标签的关联关系
3. his_config_info保存一条配置操作历史记录

这三个事务都在配置发布这个大事务下，如果说我们对每个事务操作进行一个Raft协议提交，假设1、2两个事务通过Raft提交后都成功Apply了，第三个事务在进行Raft提交后apply失败，那么对于这个配置发布的大事务来说，是需要整体回滚的，否则就会违反原子性，那么可能需要说将事务回滚操作又进行一次Raft提交，那么整体的复杂程度上升，并且直接引入了分布式事务的管理，因此为了避免这个问题，我们将这三个事务涉及的SQL上下文进行整合成一个大的SQL上下文，对这大的SQL上下文进行Raft协议提交。保证了三个子事务在同一次数据库会话当中，成功解决原子性的问题，同时由于Raft协议对于事务日志的处理是串行执行的，因此相当于将数据库的事务隔离级别调整为串行化。

```java
public void addConfigInfo(final String srcIp,
			final String srcUser, final ConfigInfo configInfo, final Timestamp time,
			final Map<String, Object> configAdvanceInfo, final boolean notify) {

	try {
		final String tenantTmp = StringUtils.isBlank(configInfo.getTenant()) ?
					StringUtils.EMPTY :
					configInfo.getTenant();
		configInfo.setTenant(tenantTmp);
        
        // 通过雪花ID算法获取数据库主键
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

通过一个时序图来更加直观的理解
![](https://cdn.nlark.com/yuque/__puml/618e8997395fbc74433ac4a60f67b6b4.svg#lake_card_v2=eyJjb2RlIjoiQHN0YXJ0dW1sXG5cbmF1dG9udW1iZXJcblxuYWN0b3IgXCJVc2VyXCIgYXMgVXNlclxuXG5wYXJ0aWNpcGFudCBcIkNvbmZpZ1NlcnZpY2VcIiBhcyBTZXJ2aWNlXG5wYXJ0aWNpcGFudCBcIlBlcnNpc3RlbmNlU2VydmljZVwiIGFzIFJlcG9zaXRvcnlcbnBhcnRpY2lwYW50IFwiRGVyYnlcIiBhcyBEQlxucGFydGljaXBhbnQgXCJTUUxDb250ZXh0VXRpbHNcIiBhcyBTUUxDb250ZXh0XG5wYXJ0aWNpcGFudCBcIkxvZ1Byb2Nlc3NvclwiIGFzIFByb2Nlc3NvclxucGFydGljaXBhbnQgXCJDb25zaXN0ZW5jeVByb3RvY29sXCIgYXMgUHJvdG9jb2xcbnBhcnRpY2lwYW50IFwiTG9nXCIgYXMgTG9nXG5cbmFjdGl2YXRlIFVzZXJcblxuVXNlciAtPiBTZXJ2aWNlOiDlj5HotbfphY3nva7lj5HluIPor7fmsYJcbmFjdGl2YXRlIFNlcnZpY2VcblxuU2VydmljZSAtPiBSZXBvc2l0b3J5OiDphY3nva7lj5HluINcbmFjdGl2YXRlIFJlcG9zaXRvcnlcblxuUmVwb3NpdG9yeSAtPiBTUUxDb250ZXh0OiDmi6bmiKrlvZPliY1TUUzkuIrkuIvmlodcbmFjdGl2YXRlIFNRTENvbnRleHRcblxuUmVwb3NpdG9yeSAtPiBSZXBvc2l0b3J5OiBjb21taXQg5pON5L2cXG5cblNRTENvbnRleHQgLT4gUmVwb3NpdG9yeTog5b2T5YmN6K-35rGC5raJ5Y-K55qE5omA5pyJU1FM5LiK5LiL5paHXG5cbmRlYWN0aXZhdGUgU1FMQ29udGV4dFxuXG5SZXBvc2l0b3J5IC0-IExvZzog5p6E5bu66K-35rGC5L2TXG5cbmFjdGl2YXRlIExvZ1xuZGVhY3RpdmF0ZSBMb2dcblxuUmVwb3NpdG9yeSAtPiBQcm90b2NvbDogc3VibWl0KCkg6L-b6KGM6K-35rGC5o-Q5LqkXG5hY3RpdmF0ZSBQcm90b2NvbFxuZGVhY3RpdmF0ZSBSZXBvc2l0b3J5XG5cblByb3RvY29sIC0-IFByb2Nlc3Nvcjogb25BcHBseSgpIOaWueazle-8jOeKtuaAgeacuuWkjeWItkxvZ1xuYWN0aXZhdGUgUHJvY2Vzc29yXG5cblByb2Nlc3NvciAtPiBSZXBvc2l0b3J5OiDmiafooYzmiYDmnInnmoRTUUzkuIrkuIvmlodcbmFjdGl2YXRlIFJlcG9zaXRvcnlcblxuUmVwb3NpdG9yeSAtPiBEQjog5pWw5o2u6JC95bqTXG5hY3RpdmF0ZSBEQlxuXG5EQiAtPiBSZXBvc2l0b3J5OiDnu5PmnZ_lubbov5Tlm57nu5PmnpxcbmRlYWN0aXZhdGUgREJcblxuUmVwb3NpdG9yeSAtPiBQcm9jZXNzb3I6IOi_lOWbnkxvZ0Z1dHVyZeW5tuiuvue9ruacrOasoeaJp-ihjOeahOe7k-aenFxuZGVhY3RpdmF0ZSBSZXBvc2l0b3J5XG5cblByb2Nlc3NvciAtPiBQcm90b2NvbDog6L-U5ZueTG9nRnV0dXJlXG5kZWFjdGl2YXRlIFByb2Nlc3NvclxuXG5Qcm90b2NvbCAtPiBTZXJ2aWNlOiDmnKzmrKHor7fmsYLnmoTnu5PmnpxcbmRlYWN0aXZhdGUgUHJvdG9jb2xcblxuU2VydmljZSAtPiBVc2VyXG5kZWFjdGl2YXRlIFNlcnZpY2VcbmRlYWN0aXZhdGUgVXNlclxuXG5AZW5kdW1sIiwidHlwZSI6InB1bWwiLCJtYXJnaW4iOnRydWUsImlkIjoiVnQxNzciLCJ1cmwiOiJodHRwczovL2Nkbi5ubGFyay5jb20veXVxdWUvX19wdW1sLzYxOGU4OTk3Mzk1ZmJjNzQ0MzNhYzRhNjBmNjdiNmI0LnN2ZyIsImNhcmQiOiJkaWFncmFtIn0=)

<a name="AAJTE"></a>


### 如何使用新特性

```bash
./startup.sh -p embedded
```

是否启用内嵌的分布式关系型存储的活动图
![](https://cdn.nlark.com/yuque/__puml/1fd656ba3b39fe5de8fea78efdf98dd1.svg#lake_card_v2=eyJjb2RlIjoiQHN0YXJ0dW1sXG5cbigqKSAtLT4gXCJDb25maWcuc3RhcnQoKVwiXG5cbmlmIFwi5Y2V5py65qih5byPXCIgdGhlblxuICAtcmlnaHQtPlt0cnVlXSBcInJldHVybiDpu5jorqTljZXmnLrlrZjlgqjooYzkuLpcIlxuICAtLT4gKCopXG5lbHNlXG4gaWYgXCLlt7LphY3nva7lpJbnva7lrZjlgqhcIiB0aGVuXG4gICAgLS0-W3RydWVdIFwicmV0dXJuIOWklue9ruaVsOaNruWtmOWCqOihjOS4ulwiXG4gICAgLS0-ICgqKVxuIGVsc2VcbiAgICBpZiBcIuW8gOWQr-WGheW1jOWtmOWCqFwiIHRoZW5cbiAgICAgICAgLS0-W3RydWVdIFwicmV0dXJuIOi9u-mHj-WGheW1jOWIhuW4g-W8j-WtmOWCqOihjOS4ulwiXG4gICAgICAgIC0tPiAoKilcbiAgICBlbHNlXG4gICAgICAgIC0-W2ZhbHNlXSBcInJldHVybiDpu5jorqTlpJbnva7mlbDmja7lrZjlgqjooYzkuLpcIlxuICAgICAgICAtLT4gKCopXG5cdFx0ZW5kaWZcbiBlbmRpZlxuZW5kaWZcblxuQGVuZHVtbCIsInR5cGUiOiJwdW1sIiwibWFyZ2luIjp0cnVlLCJpZCI6IkNNN1VDIiwidXJsIjoiaHR0cHM6Ly9jZG4ubmxhcmsuY29tL3l1cXVlL19fcHVtbC8xZmQ2NTZiYTNiMzlmZTVkZThmZWE3OGVmZGY5OGRkMS5zdmciLCJjYXJkIjoiZGlhZ3JhbSJ9)

<a name="9UAXN"></a>

### 新特性的相关运维操作

直接查询每个节点的derby存储的数据

```java
GET /nacos/v1/cs/ops/derby?sql=select * from config_info

return List<Map<String, Object>>
```

<a name="YcqO2"></a>

### 不足

1. 在数据库上层构建一层分布式数据操作同步层，对数据库的操作存在了限制，比如第一步insert操作，然后select操作，最后在update操作，这种在数据修改语句中穿插着查询语句的操作顺序是不支持的
1. 限制了数据库的性能，由于间接的将数据库事务隔离级别调整为了串行化，人为的将并发能力降低了

<a name="7dul8"></a>

### 未来演进

将于Apache Derby官方一起尝试基于Raft实现BingLog的同步复制操作，从底层实现数据库同步能力

