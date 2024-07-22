---
title: Java SDK 配置参数
keywords: [ Java,SDK,配置参数 ]
description: 本文档介绍了Nacos的Java SDK(nacos-client)目前所支持的配置参数列表,以及对Nacos Java SDK读取配置参数的原理做简要介绍。
sidebar:
  order: 2
---

# Java SDK 配置参数

## 1. Java SDK 读取参数配置

### 1.1. 介绍

Nacos Java SDK 通过 `NacosClientProperties`, 一个类似于 `Spring Environment`用来统一管理客户端的各种配置项。

### 1.2. 特点

- 统一管理 Properties、命令行参数、环境变量和默认值
- 提供优先级搜索功能, 默认搜索顺序 `properties -> 命令行参数 -> 环境参数 -> 默认值`, 可通过调整优先级来调整搜索顺序,
  默认是 `properties` 优先
- 配置隔离, 每个 `NacosClientProperties` 对象,除去全局性的配置互不影响.

### 1.3. 如何使用

#### 1.3.1. 优先级

默认优先级是 `properties`, 可通过以下2种方式来调整:

```
- (命令行参数)-Dnacos.env.first=PROPERTIES|JVM|ENV
- (环境变量)NACOS_ENV_FIRST=PROPERTIES|JVM|ENV
```

默认情况相当于`-Dnacos.env.first=PROPERTIES`.

以上2种方式都指定的情况下,客户端优先使用命令行参数的方式获取优先级参数,若是通过命令行参数的方式没有获取到优先级参数则使用环境变量的方式获取优先级参数.如果以上2种方式都未指定优先级参数默认优先级为`properties`

默认优先级:
![default_order.png](/img/nacos_client_properties_default_order.png)

优先级: PROPERTIES
![default_order.png](/img/nacos_client_properties_default_order.png)

优先级: JVM
![jvm_order.png](/img/nacos_client_properties_jvm_order.png)

优先级: ENV
![jvm_order.png](/img/nacos_client_properties_env_order.png)

#### 1.3.2. 搜索

`NacosClientProperties` 会按照指定优先级进行搜索配置, 以默认优先级(`PROPERTIES`)为例, 如果要获取一个 key 为
`key1`的值, 查找顺序如下:

![search_order.png](/img/nacos_client_properties_search_order.png)

`NacosClientProperties` 会按照上图顺序搜索,直到查询到为止.

#### 1.3.3. 配置隔离

为了应对多注册中心,多配置中心的场景, `NacosClientProperties` 引入配置隔离的概念. 在 `NacosClientProperties` 中总共有4个取值源,
分别是: 用户自定义的properties、命令行参数、 环境变量和默认值, 其中 `命令行参数、 环境变量和默认值`
这3个是全局共享的无法做到隔离, 那么只剩下用户自定义的properties对象是可以进行隔离的, 每个 `NacosClientProperties`
对象中包含不同的 `Properties` 对象, 通过这种方法做到配置互不影响.

> 注意: 全局共享的配置: 命令行参数、 环境参数和默认值 一旦初始化完毕,后续使用无法更改,使用 `setProperty`
> 方法,也无法修改. `setProperty` 只能修改`NacosClientProperties` 对象中包含的 `Properties` 对象中的值

#### 1.3.4. 配置派生

在配置隔离的概念之上又引入了配置派生的概念, 其目的是让配置能够继承.所有 `NacosClientProperties`
对象都是由 `NacosClientProperties.PROTOTYPE` 对象派生而来. 无法通过其他方式创建 `NacosClientProperties` 对象

```java
// global properties
NacosClientProperties.PROTOTYPE.setProperty("global-key1","global-value1");

// properties1 
NacosClientProperties properties1 = NacosClientProperties.PROTOTYPE.derive();
properties1.

setProperty("properties1-key1","properties1-value1");

// properties2
NacosClientProperties properties2 = properties1.derive();
properties2.

setProperty("properties2-key1","properties2-value1");
```

以上代码如下图所示:
![derive.png](/img/nacos_client_properties_derive.png)

那么搜索会怎么搜索呢? 以默认优先级(PROPERTIES)为例:

```java
// value == global-value1
String value = properties2.getProperty("global-key1");

```

![derive_search.png](/img/nacos_client_properties_derive_search.png)

#### 1.3.5. API

| 方法名           | 入参内容                          | 返回内容                  | 描述                                                                                  |
|---------------|-------------------------------|-----------------------|-------------------------------------------------------------------------------------|
| getProperty   | key: String                   | String                | 获取 key 对应的 value 值, 不存在返回 null                                                      |
| getProperty   | key: String, default: String  | String                | 获取 key 对应的 value 值, 不存在返回默认值                                                        |
| getBoolean    | key: String                   | Boolean               | 获取 key 对应的 Boolean 值, 不存在则返回 null                                                   |
| getBoolean    | key: String, default: Boolean | Boolean               | 获取 key 对应的 Boolean 值, 不存在返回默认值                                                      |
| getInteger    | key: String                   | Integer               | 获取 key 对应的 Integer 值, 不存在返回 null                                                    |
| getInteger    | key: String, default: Integer | Integer               | 获取 key 对应的 Integer 值, 不存在返回默认值                                                      |
| getLong       | key: String                   | Long                  | 获取 key 对应的 Long 值, 不存在返回 null                                                       |
| getLong       | key: String, default: Long    | Long                  | 获取 key 对应的 Long 值, 不存在返回默认值                                                         |
| setProperty   | key: String, value: String    | void                  | 设置 key-value 到 NacosClientProperties 对象中,已存的值会被覆盖                                   |
| addProperties | properties: Properties        | void                  | 添加 Properties 到 NacosClientProperties 对象中,已存在到值会被覆盖                                 |
| containsKey   | key: String                   | boolean               | 判断是否包含指定 key 的值, 包含返回 true 否则 false                                                 |
| asProperties  | void                          | Properties            | 将 NacosClientProperties 对象转换为 Properties 对象                                         |
| derive        | void                          | NacosClientProperties | 创建一个继承父 NacosClientProperties 所有配置的 NacosClientProperties 对象, 内部包含一个空 Properties    |
| derive        | Properties                    | NacosClientProperties | 创建一个继承父 NacosClientProperties 所有配置的 NacosClientProperties 对象, 内部包含指定的 Properties 对象 |

## 2. Java SDK 配置参数列表

### 2.1. 通用参数

通用参数为初始化注册中心`NamingService`和配置中心`ConfigServie`时均生效的参数：

| 参数名                 | PropertyKeyConst的Key  | 含义                                                                                                           | 可选值                                               | 默认值                      |
|---------------------|-----------------------|--------------------------------------------------------------------------------------------------------------|---------------------------------------------------|--------------------------|
| serverAddr          | SERVER_ADDR           | Nacos Server的地址列表，即此JAVA SDK访问哪个Nacos Server                                                                 | 任意域名或IP，多个地址通过英文逗号`,`分割，多个地址必须属于同一个Nacos Server集群 | 无                        |
| contextPath         | CONTEXT_PATH          | Nacos Server OpenAPI 的 context path，对应Nacos Server 的`server.servlet.context-path`  参数                        | 任意URL支持的path                                      | nacos                    |
| endpoint            | ENDPOINT              | Nacos Server的地址获取接入点，Java SDK或通过该接入点查询Nacos Server的实际域名或IP地址                                                 | 任意域名或IP                                           | 无                        |
| endpointPort        | ENDPOINT_PORT         | Nacos Server的地址获取接入点的端口，配合endpoint使用，即请求${endpoint}:${endpointPort}/nacos/serverlist                         | 0~65535                                           | 8080                     |
| endpointContextPath | ENDPOINT_CONTEXT_PATH | Nacos Server的地址获取接入点的context path，配合endpoint使用，${endpoint}:${endpointPort}/${endpointContextPath}/serverlist | 任意URL支持的path                                      | nacos                    |
| clusterName         | CLUSTER_NAME          | Nacos Server在接入点中的集群名，配合endpoint使用，${endpoint}:${endpointPort}/${endpointContextPath}/${clusterName}         | 任意URL支持的path                                      | serverlist               |
| endpointQueryParams | ENDPOINT_QUERY_PARAMS | Nacos Server的地址获取接入点的请求参数，用于接入点服务扩展自定义逻辑，格式key=value                                                         | 任意URL参数，key=value                                 | 无                        |
| namespace           | NAMESPACE             | 该 JAVA SDK 所归属的命名空间Id， 设置后该SDK只能访问该命名空间的资源（配置或服务）                                                            | 命名空间Id                                            | 空字符串``                   |
| username            | USERNAME              | 开启鉴权功能后，访问Nacos Server所使用的用户名                                                                                | 任意字符串                                             | 无                        |
| password            | PASSWORD              | 开启鉴权功能后，访问Nacos Server所使用的用户名对应的密码                                                                           | 任意字符串                                             | 无                        |
| accessKey           | ACCESS_KEY            | 使用阿里云RAM鉴权时需要使用的accessKey                                                                                    | 任意字符串                                             | 无                        |
| secretKey           | SECRET_KEY            | 使用阿里云RAM鉴权时需要使用的secretKey                                                                                    | 任意字符串                                             | 无                        | |
| ramRoleName         | RAM_ROLE_NAME         | 使用阿里云RAM鉴权时需要使用的ramRoleName                                                                                  | 任意字符串                                             | 无                        |
| signatureRegionId   | SIGNATURE_REGION_ID   | 使用阿里云RAM鉴权时，需要使用的signatureRegionId                                                                           | 任意字符串                                             | 无                        |
| logAllProperties    | LOG_ALL_PROPERTIES    | 启动Java SDK时，是否打印全量参数，包含自定义properties、JVM和环境变量，主要用户调试和问题排查。                                                   | boolean                                           | false                    |
| ~~serverName~~      | ~~SERVER_NAME~~       | 该 JAVA SDK 的名称，目前仅在访问endpoint时使用，由于使用率低且命名不合理，将废弃                                                            | 任意字符串                                             | 由serverAddr/endpoint自动拼接 |

### 2.2. 配置中心相关参数

仅在初始化配置中心`ConfigServie`时生效：

| 参数名                        | PropertyKeyConst的Key           | 含义                                                               | 可选值       | 默认值                                            | 
|----------------------------|--------------------------------|------------------------------------------------------------------|-----------|------------------------------------------------|
| clientWorkerMaxThreadCount | CLIENT_WORKER_MAX_THREAD_COUNT | 自动计算配置中心ConfigService进行配置监听时的最大线程池个数                             | >=2 的int值 | CPU个数                                          |
| clientWorkerThreadCount    | CLIENT_WORKER_THREAD_COUNT     | 指定配置中心ConfigService进行配置监听时的线程池个数，优先级高于clientWorkerMaxThreadCount | >=2 的int值 | Max(2, Min(clientWorkerMaxThreadCount, CPU个数)) |
| enableRemoteSyncConfig     | ENABLE_REMOTE_SYNC_CONFIG      | 配置中心ConfigService进行配置监听时立刻对监听的配置进行和服务端的同步和通知，开启可能影响启动监听的速度       | boolean   | false                                          |
| ~~configRetryTime~~        | ~~CONFIG_RETRY_TIME~~          | 旧版本配置中心使用长轮询重试间隔时间，已废弃                                           | 任意int     | 2000                                           |
| ~~configLongPollTimeout~~  | ~~CONFIG_LONG_POLL_TIMEOUT~~   | 旧版本配置中心使用长轮询超时时间，已废弃                                             | 任意int     | 30000                                          |
| ~~maxRetry~~               | ~~MAX_RETRY~~                  | 旧版本配置中心使用的最大重试次数参数，已废弃                                           | 任意int     | 3                                              |

### 2.3. 注册中心相关参数

仅在初始化注册中心`NamingServie`时生效：

| 参数名                              | PropertyKeyConst的Key                 | 含义                                                                | 可选值       | 默认值                                             | 
|----------------------------------|--------------------------------------|-------------------------------------------------------------------|-----------|-------------------------------------------------|
| namingLoadCacheAtStart           | NAMING_LOAD_CACHE_AT_START           | 注册中心NamingService在启动时读取本地磁盘缓存来初始化数据                               | boolean   | false                                           |
| namingCacheRegistryDir           | NAMING_CACHE_REGISTRY_DIR            | 注册中心NamingService的本地磁盘缓存目录名拓展名，用于同一节点中区分多个NamingService实例         | 任意字符串     | 空字符串                                            |
| namingAsyncQuerySubscribeService | NAMING_ASYNC_QUERY_SUBSCRIBE_SERVICE | 注册中心NamingService开启异步查询订阅服务的功能，作为数据推送链路异常时的兜底辅助                   | boolean   | false                                           |
| namingPollingMaxThreadCount      | NAMING_POLLING_MAX_THREAD_COUNT      | 自动计算注册中心NamingService异步查询订阅服务的最大线程个数                              | >=1 的int值 | CPU个数                                           |
| namingPollingThreadCount         | NAMING_POLLING_THREAD_COUNT          | 指定注册中心NamingService异步查询订阅服务的线程个数，优先级高于namingPollingMaxThreadCount | >=1 的int值 | Max(2, Min(namingPollingMaxThreadCount, CPU个数)) |
| namingRequestDomainMaxRetryCount | NAMING_REQUEST_DOMAIN_RETRY_COUNT    | 当初始化注册中心NamingService`serverAddr`仅有一个地址时，请求Nacos Server失败后的最大重试次数 | 任意int值    | 3                                               |
| namingPushEmptyProtection        | NAMING_PUSH_EMPTY_PROTECTION         | 注册中心NamingService开启推空保护功能，当订阅服务时发现服务地址列表为0时，忽略此地址列表               | boolean   | false                                           |
| redoDelayTime                    | REDO_DELAY_TIME                      | 注册中心NamingService与Nacos Server链接断开后，间隔多长时间检查并进行redo操作，单位毫秒        | 任意long值   | 3000                                            |
| redoDelayThreadCount             | REDO_DELAY_THREAD_COUNT              | 注册中心NamingService执行redo操作的线程数                                     | 任意int值    | 1                                               |
| ~~namingClientBeatThreadCount~~  | ~~NAMING_CLIENT_BEAT_THREAD_COUNT~~  | 注册中心NamingService旧版本使用的，用于发送所注册服务实例心跳的线程数，已废弃                     | 任意int值    | 无                                               |

### 2.4. 连接相关

Nacos Java SDK 连接Nacos Server时，可以设置一系列的参数，来提升针对网络抖动时的容错能力，这部分配置暂时**只能通过JVM参数(
-D)**进行设置，社区正在进行改造，支持其能够通过`NacosClientProperties`（即初始化Java SDK时传入的Properties）进行配置，尽请期待。

| 参数名                                                             | 含义                                                                                 | 可选值     | 默认值           | 
|-----------------------------------------------------------------|------------------------------------------------------------------------------------|---------|---------------|
| nacos.server.grpc.port.offset                                   | Nacos Server GRPC端口相对主端口的偏移量                                                       | 任意int值  | 1000          |
| nacos.remote.client.grpc.name                                   | 该Nacos Java SDK的GRPC连接的名字                                                          | 任意字符串   | null          |
| nacos.remote.client.grpc.connect.keep.alive                     | 该Nacos Java SDK的GRPC连接的Keep Alive                                                  | 任意Long值 | 5000          |
| nacos.remote.client.grpc.retry.times                            | 该Nacos Java SDK的GRPC连接发起请求时的最大重试次数                                                 | 任意int值  | 3             |
| nacos.remote.client.grpc.timeout                                | 该Nacos Java SDK的GRPC连接发起请求时的请求超时时间                                                 | 任意Long值 | 3000          |
| nacos.remote.client.grpc.pool.alive                             | 该Nacos Java SDK的GRPC连接所使用的线程池的线程Keep Alive时间，单位毫秒                                  | 任意Long值 | 10000         |
| nacos.remote.client.grpc.pool.core.size                         | 该Nacos Java SDK的GRPC连接所使用的线程池的最小大小                                                 | 任意int值  | CPU个数*2       |
| nacos.remote.client.grpc.pool.max.size                          | 该Nacos Java SDK的GRPC连接所使用的线程池的最大大小                                                 | 任意int值  | CPU个数*8       |
| nacos.remote.client.grpc.server.check.timeout                   | 该Nacos Java SDK的GRPC连接刚连接上服务端时，进行连接注册的超时时间                                         | 任意Long值 | 3000          |
| nacos.remote.client.grpc.queue.size                             | 该Nacos Java SDK的GRPC连接的请求队列长度                                                      | 任意int值  | 10000         |
| nacos.remote.client.grpc.health.retry                           | 该Nacos Java SDK的GRPC连接的健康检查重试次数，达到这个次数健康检查失败的连接会被客户端强制关闭，进行重连                      | 任意int值  | 3             |
| nacos.remote.client.grpc.health.timeout                         | 该Nacos Java SDK的GRPC连接的健康检查超时时间                                                    | 任意Long值 | 3000          |
| nacos.remote.client.grpc.maxinbound.message.size                | 该Nacos Java SDK的GRPC连接单次请求的Request的最大大小，单位byte                                     | 任意int值  | 10M           |
| nacos.remote.client.grpc.channel.keep.alive                     | 该Nacos Java SDK的GRPC连接对应的TCP Channel的Keep Alive时间，此时间应该大于`connect.keep.alive`,单位毫秒 | 任意int值  | 6 * 60 * 1000 |
| nacos.remote.client.grpc.channel.keep.alive.timeout             | 该Nacos Java SDK的GRPC连接对应的TCP Channel的Keep Alive超时时间，单位毫秒                           | 任意Long值 | 20 * 1000     |
| nacos.remote.client.grpc.channel.capability.negotiation.timeout | 该Nacos Java SDK的GRPC连接对应的TLS握手超时时间                                                 | 任意Long值 | 5000          |

### 2.5. 其他参数

Nacos Java SDK 中有部分参数对运行时期的影响较小，且需要全局一致，因此此类参数目前需要通过JVM参数（-D）或环境变量进行设置，一般使用时使用默认值即可，仅在遇到一些特殊场景时才需要设置。

| 参数名                       | 含义                                                                                                                 | 可选值                | 默认值               | 
|---------------------------|--------------------------------------------------------------------------------------------------------------------|--------------------|-------------------|
| PER_TASK_CONFIG_SIZE      | 每个`ConfigService`可监听的最大配置数                                                                                         | 任意int              | 3000              |
| JM.SNAPSHOT.PATH          | Nacos Java SDK的本地快照根目录，根目录下会创建`naming`和`config`两个目录用于存放订阅的服务和配置的缓存信息                                               | 任意目录               | ${user.home}      |
| JM.LOG.PATH               | Nacos Java SDK的日志输出目录，正常情况下Nacos Java SDK的日志会输出到该目录下，部分特殊的场景和版本，可能会输出到业务日志中（如使用了log4j1.0的版本，或使用Spring Cloud重载了日志配置 | 任意目录               | ${user.home}/logs |
| nacos.server.port         | 默认的Nacos Server**配置中心和鉴权login**的端口，当传入的`serverAddr`参数中不带有端口号时，使用此设置的端口连接Nacos Server，建议统一通过`serverAddr`参数设置端口      | 0～65535            | 8848              |
| nacos.naming.exposed.port | 默认的Nacos Server**注册中心**的端口，当传入的`serverAddr`参数中不带有端口号时，使用此设置的端口连接Nacos Server，建议统一通过`serverAddr`参数设置端口              | 0～65535            | 8848              |
| nacos.client.contextPath  | 默认的Nacos Server contentPath，`contextPath`和`endpointContextPath` 未传入时使用                                             | 任意URL支持的path       | nacos             |
| nacos.env.first           | Nacos JAVA SDK 的 `NacosClientProperties` 配置搜索顺序。详情见[1.3.1. 优先级](#131-优先级)                                          | PROPERTIES/JVM/ENV | PROPERTIES        |
| project.name              | 该SDK所归属的应用名，可在服务订阅者列表和配置订阅者列表中使用，仅作为参考字段使用                                                                         | 任意字符串              | unknown           |
| ~~NACOS.CONNECT.TIMEOUT~~ | 连接服务时的连接超时时间，旧版本Http使用，已废弃                                                                                         | 任意int              | 1000              |
