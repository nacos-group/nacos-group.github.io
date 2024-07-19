---
title: 系统参数
keywords: [Nacos,系统参数]
description: Nacos系统参数介绍
sidebar:
    order: 4
---

# Nacos 系统参数介绍

## 1. Nacos Server

对于Server端来说，一般是设置在`{nacos.home}/conf/application.properties`里，如果参数名后标注了(-D)的，则表示是 JVM 的参数，需要在`{nacos.home}/bin/startup.sh`里进行相应的设置。例如像设置 nacos.home 的值，可以在`{nacos.home}/bin/startup.sh`进行如下设置：

```
JAVA_OPT="${JAVA_OPT} -Dnacos.home=${BASE_DIR}"
```

若没有标注(-D)的参数，则同时可以在`{nacos.home}/conf/application.properties`里和JVM参数中配置，如果同时配置了JVM参数和`{nacos.home}/conf/application.properties`，那么JVM参数的优先级更高。

### 1.1. 全局参数

#### 1.1.1. 基础参数

|参数名	| 含义	                                                                                        |     可选值	 |     默认值| 
|------|--------------------------------------------------------------------------------------------|-----------|-----------------|
|nacos.home(-D)| Nacos的根目录                                                                                  | 目录路径| Nacos安装的目录 | 
|nacos.standalone(-D)| 是否在单机模式                                                                                    | true/false | false |
|nacos.functionMode(-D)| 启动模式，支持只启动某一个模块，不设置时所有模块都会启动                                                               | config/naming/空 | 空 | 
|nacos.server.ip(-D)| Nacos服务端的IP，优先级比`nacos.inetutils.ip-address`更高，如果配置了该参数，则`nacos.inetutils.ip-address`不再生效  | 本机IP | null |
|nacos.inetutils.prefer-hostname-over-ip| 节点优先使用hostname作为本机ip，若为`true`时，`cluster.conf`里是否应该填`hostname`                              | true/false| false | 
|nacos.inetutils.ip-address | 本机IP，该参数设置后，将会使用这个IP去`cluster.conf`里进行匹配，请确保这个IP的值在`cluster.conf`里是存在的                     | 本机IP| null |
|nacos.core.sys.basic.processors| 指定服务端的处理器个数，用于部分虚拟化场景，防止读取CPU个数时读取到错误的值，导致线程数过多或过少                                         |正整数| CPU个数|
|nacos.core.monitor.topn.enabled| Nacos Server topN 监控统计能力开关                                                                 | true/false | true |
|nacos.core.monitor.topn.count| Nacos Server topN 监控统计 top的个数，如如配置为10，表示top10的配置和服务                                        | 正整数 | 10 |
|nacos.core.snowflake.worker-id| Nacos Server 的snowflake workerId                                                           | 正整数 | -1 |
|nacos.core.param.check.enabled| Nacos Server 参数校验能力开关，开启后将会校验请求时的参数是否符合规范，不符合将被拦截，详情查看 [参数校验](../user/parameters-check.md) | true/false | true |
|server.port| Nacos Server 的端口                                                                           | 正整数 | 8848 |
|server.servlet.context-path| Nacos Server 的Servlet上下文路径                                                                 | 正则表达式 | /nacos |
|spring.config.additional-location| Nacos Server 的额外配置文件路径，除`{nacos.home}/conf/application.properties`外，用户可以添加额外的配置文件          | 文件路径，多个文件路径用逗号分隔 | null | 

#### 1.1.2. 数据库

|参数名	|含义	 |     可选值	 |     默认值| 
|------|------|-----------|-----------------|
|spring.sql.init.platform|Nacos Server 使用的数据库类型 | mysql/空，指定为空时会根据`nacos.standalone`判断使用derby数据库还是mysql数据库；在使用[数据源插件](../../plugin/datasource-plugin.md)时，可以指定为插件对应的数据库值，比如oracle或postgresql | null |
|~~spring.datasource.platform~~|Nacos Server 使用的数据库类型，即将被废弃，请使用`spring.sql.init.platform`代替 | mysql/空 | null |
|db.num| 数据库数目 | 正整数 | 0 |
|db.url.0| 第一个数据库的URL | 字符串 | 空 |
|db.url.1| 第二个数据库的URL，当db.num=2时生效 | 字符串 | 空 | 
|db.user| 数据库连接的用户名 | 字符串 | 空 | 
|db.password| 数据库连接的密码 | 字符串 | 空 | 
|db.pool.config.xxx| 数据库连接池参数，使用的是hikari连接池，参数与hikari连接池相同，如`db.pool.config.connectionTimeout`或`db.pool.config.maximumPoolSize`|字符串|同hikariCp对应默认配置|

当前数据库配置支持多数据源。通过`db.num`来指定数据源个数，`db.url.index`为对应的数据库的链接。`db.user`以及`db.password`没有设置`index`时,所有的链接都以`db.user`和`db.password`用作认证。如果不同数据源的用户名称或者用户密码不一样时，可以通过符号`,`来进行切割，或者指定`db.user.index`,`db.user.password`来设置对应数据库链接的用户或者密码。需要注意的是，当`db.user`和`db.password`没有指定下标时，因为当前机制会根据`,`进行切割。所以当用户名或者密码存在`,`时，会把`,`切割后前面的值当成最后的值进行认证，会导致认证失败。

Nacos从1.3版本开始使用HikariCP连接池，但在1.4.1版本前，连接池配置由系统默认值定义，无法自定义配置。在1.4.1后，提供了一个方法能够配置HikariCP连接池。
`db.pool.config`为配置前缀，`xxx`为实际的hikariCP配置，如`db.pool.config.connectionTimeout`或`db.pool.config.maximumPoolSize`等。更多hikariCP的配置请查看[HikariCP](https://github.com/brettwooldridge/HikariCP)
需要注意的是，url,user,password会由`db.url.n`,`db.user`,`db.password`覆盖，driverClassName则是默认的MySQL8 driver（该版本mysql driver支持mysql5.x)

#### 1.1.2. Remoting

|参数名	|含义	 |     可选值	 |     默认值| 
|------|------|-----------|-----------------|
|nacos.remote.server.grpc.sdk.max-inbound-message-size|Nacos Server gRPC 能接收的单次最大客户端请求大小，单位byte| 正整数 |10 * 1024 * 1024|
|nacos.remote.server.grpc.cluster.max-inbound-message-size|Nacos Server gRPC 能接收的单次最大集群间请求大小，单位byte| 正整数 |10 * 1024 * 1024|
|nacos.metric.grpc.server.executor.enabled| Nacos Server gRPC线程池 监控能力开关 | true/false | true |
|nacos.metric.grpc.server.executor.interval| Nacos Server gRPC线程池的间隔时间，单位为毫秒 | 正整数 | 15000 |
|nacos.metric.grpc.server.connection.enabled| Nacos Server gRPC长连接 监控能力开关 | true/false | true |
|nacos.metric.grpc.server.connection.interval| Nacos Server gRPC长连接的间隔时间，单位为**秒** | 正整数 | 15 |
|remote.executor.times.of.processors(-D)| 服务端，处理请求的线程池大小的倍数, 例如配置为2，表示线程池大小为2 * CPU | 正整数 | 16 |
|remote.executor.queue.size(-D)|服务端，处理请求的线程池队列大小 | 正整数 | 16384 |

#### 1.1.3. 集群列表

|参数名	|含义	 |     可选值	 |     默认值| 
|------|------|-----------|-----------------|
|nacos.member.list|Nacos Server 地址列表，在`cluster.conf`不存在时生效 | `ip1:port1,ip2:port2` | null |
|nacos.member-change-event.queue.size| Nacos Server 集群节点变更事件队列的大小，当集群节点通过`cluster.conf`或地址服务器变更时，会将变更事件放入该队列，该队列会异步通知Server中的一些机制，比如Distro/Raft协议。 | 正整数 | 128 |
|nacos.core.member.lookup.type| Nacos Server 集群节点的发现方式，支持配置文件`cluster.conf`和地址服务器模式| file/address-server | file|
|nacos.core.address-server.retry|当`nacos.core.member.lookup.type`指定为`address-server`时生效，请求地址服务器的重试次数，超过重试次数后不再尝试从地址服务器获取NacosServer的集群列表| 正整数 | 5 |
|address.server.domain|当`nacos.core.member.lookup.type`指定为`address-server`时生效，地址服务器的域名 | 域名 | jmenv.tbsite.net|
|address.server.port|当`nacos.core.member.lookup.type`指定为`address-server`时生效，地址服务器的端口 | 0～65535 | 8080 |
|address.server.url|当`nacos.core.member.lookup.type`指定为`address-server`时生效，地址服务器的url | 字符串 | /serverlist |

### 1.2. Distro 协议

|参数名	|含义	 |     可选值	 |     默认值| 
|------|------|-----------|-----------------|
|nacos.core.protocol.distro.data.sync.delayMs|Distro协议同步数据的延迟时间，同一份数据处于延迟时间内多次变更时，会被合并为一次同步，单位为毫秒 | 正整数 | 1000 |
|nacos.core.protocol.distro.data.sync.timeoutMs|Distro协议同步数据的超时时间，同步到目标节点时超过该时间，则会认为同步失败，进行延迟后重试，单位为毫秒 | 正整数 | 3000 |
|nacos.core.protocol.distro.data.sync.retryDelayMs|Distro协议同步数据的重试间隔，当数据同步到目标节点失败时，进行该值时间的延迟后再重试，避免同步重试风暴，单位为毫秒 | 正整数 | 3000 |
|nacos.core.protocol.distro.data.verify.intervalMs|Distro协议数据验证的间隔，已经同步过的数据，会定期进行数据有效性验证，验证失败会重新发起该数据的同步，单位为毫秒 | 正整数 | 5000 | 
|nacos.core.protocol.distro.data.verify.timeoutMs|Distro协议数据验证的超时时间，单位为毫秒 | 正整数 | 3000 |
|nacos.core.protocol.distro.data.load.retryDelayMs|Distro协议快照数据加载的重试间隔，在节点刚启动时生效，单位为毫秒 | 正整数 | 30000 |
|nacos.core.protocol.distro.data.load.timeoutMs|Distro协议快照数据加载的超时时间，超过该时间未读取到其他节点的快照数据，则认为加载快照失败，单位为毫秒 | 正整数 | 30000 |

### 1.3 Raft 协议

|参数名	|含义	 |     可选值	 |     默认值| 
|------|------|-----------|-----------------|
|nacos.core.protocol.raft.election_timeout_ms|Raft协议选举超时时间，单位ms|正整数| 5000|
|nacos.core.protocol.raft.snapshot_interval_secs|Raft协议快照写入间隔时间，单位s|正整数| 3600|
|nacos.core.protocol.raft.core_thread_num|Raft协议的核心线程数，用于处理Raft同步的请求线程数|正整数| 8|
|nacos.core.protocol.raft.cli_service_thread_num|Raft协议的核心线程数，用于发起Raft同步数据的请求线程数|正整数| 4|
|nacos.core.protocol.raft.rpc_request_timeout_ms|Raft协议请求的超时时间，单位ms|正整数| 5000|
|nacos.core.protocol.raft.max_byte_count_per_rpc|Raft协议单次请求最大字节数|正整数| 128 * 1024|
|nacos.core.protocol.raft.max_entries_size|Raft协议单个日志的最大个数|正整数| 1024|
|nacos.core.protocol.raft.max_body_size|Raft协议发送日志的最大 body 大小|正整数| 512 * 1024|
|nacos.core.protocol.raft.max_append_buffer_size|Raft协议日志存储缓冲区最大大小|正整数| 256 * 1024|
|nacos.core.protocol.raft.max_election_delay_ms|Raft协议选举的最大随机间隔，选举定时器间隔会在指定时间之外随机的最大范围|正整数| 1000|

### 1.4. Naming模块

|参数名	|含义	 |     可选值	 |     默认值| 
|------|------|-----------|-----------------|
|nacos.naming.expireInstance| 是否自动摘除临时实例 | true/false | true |
|nacos.naming.clean.empty-service.interval| Naming模块的空服务清理间隔，单位毫秒 | 正整数 | 60 * 1000 |
|nacos.naming.clean.empty-service.expired-time| Naming模块的空服务过期时间，过期的空服务会被清理，单位毫秒 | 正整数 | 60 * 1000 |
|nacos.naming.clean.expired-metadata.interval| Naming模块的元数据清理间隔，单位毫秒 | 正整数 | 5000 |
|nacos.naming.clean.expired-metadata.expired-time| Naming模块的元数据过期时间，过期的元数据会被清理，单位毫秒 | 正整数 | 60 * 1000 |
|nacos.naming.client.expired.time| 临时Client对应数据的过期时间，当Distro协议停止对该Client的数据进行续约且时间超过该值时，该Client数据将被删除，主要应对Nacos Server之间断网的场景，单位毫秒 | 正整数 | 3 * 60 * 1000 |
|nacos.naming.push.pushTaskDelay|服务数据推送的延迟时间，同一个人服务处于延迟时间内多次变更时，会被合并为一次推送，单位为毫秒| 正整数 | 500 |
|nacos.naming.push.pushTaskTimeout|服务数据推送的超时时间，超过该时间未收到客户端的确认，将延迟后重试，单位为毫秒 | 正整数 | 5000 |
|nacos.naming.push.pushTaskRetryDelay|服务数据推送失败后的重试间隔时间，单位为毫秒 | 正整数 | 1000 |

### 1.5. Config模块

|参数名	|含义	 |     可选值	 |     默认值|
|------|------|-----------|-----------------|
|nacos.config.push.maxRetryTime|配置变更数据推送的延迟时间，同一个人配置处于延迟时间内多次变更时，会被合并为一次推送，单位为毫秒| 正整数 | 50 |
|nacos.config.retention.days|Nacos配置中心配置变更历史保留天数，超过该时间的配置变更历史会被删除| 正整数 | 30 | 
|nacos.config.search.max_capacity|Nacos配置中心，根据配置内容查找配置功能的最大队列个数，由于基于内容的检索十分消耗性能，因此对该功能的并发进行限制，最大不可超过32| 0～32 | 4 | 
|nacos.config.search.max_thread|根据配置内容查找配置功能的最大线程数，最大并发数，最大不可超过16| 0～16 | 2 | 
|nacos.config.search.wait_timeout|根据配置内容查找配置功能的等待超时时间，超过等待时间的查找任务会直接失败丢弃，单位毫秒| 正整数 | 8000 | 

### 1.6. CMDB模块

|参数名	|含义	 |     可选值	 |     默认值| 
|------|------|-----------|-----------------|
|nacos.cmdb.loadDataAtStart| 是否打开CMDB | true/false | false |
|nacos.cmdb.dumpTaskInterval| 全量dump的间隔，单位为秒 | 正整数 | 3600 | 
|nacos.cmdb.eventTaskInterval| 变更事件的拉取间隔，单位为秒 | 正整数 | 10 | 
|nacos.cmdb.labelTaskInterval| 标签集合的拉取间隔，单位为秒 | 正整数 | 300 | 

### 1.7. Istio模块

|参数名	|含义	 |     可选值	 |     默认值| 
|------|------|-----------|-----------------|
|nacos.extension.naming.istio.enabled| 是否加载istio模块| true/false | false |
|nacos.istio.mcp.server.enabled| 是否开启Istio MCP协议 | true/false | false |
|nacos.istio.mcp.server.port | Istio MCP协议监听端口 | 正整数 | 18848 |

### 1.8. 插件

#### 1.8.1. 鉴权插件

关于如何开发鉴权插件，请参考[鉴权插件](../../plugin/auth-plugin.md)

|参数名	|含义	 |     可选值	 |     默认值| 
|------|------|-----------|-----------------|
|nacos.core.auth.enabled|Nacos是否开启鉴权|true/false|false|
|nacos.core.auth.system.type|Nacos鉴权插件的类型|nacos/ldap/自定义插件类型|nacos|
|nacos.core.auth.server.identity.key|Nacos Server节点身份信息的key，用户Server节点之间通信的识别，当开启鉴权时为必填项|字符串|null|
|nacos.core.auth.server.identity.value|Nacos Server节点身份信息的value，用户Server节点之间通信的识别，当开启鉴权时为必填项|字符串|null|
|nacos.core.auth.enable.userAgentAuthWhite|Nacos Server使用UserAgent来进行Server节点之间通信的识别，在1.4.1版本后仅作为升级时的兼容，开启后会存在安全问题，后续版本将移除该参数|true/false|false|

同时对于Nacos默认鉴权插件的使用及更多默认鉴权插件的配置项，请参考[权限校验](../../guide/user/auth/#相关参数)

#### 1.8.2. 数据源插件

其他和数据库相关的开发，请参考[全局参数-数据库](#112-数据库)

|参数名	|含义	 |     可选值	 |     默认值|
|------|------|-----------|-----------------|
|spring.sql.init.platform|Nacos Server 使用的数据库类型 | mysql/空，指定为空时会根据`nacos.standalone`判断使用derby数据库还是mysql数据库；在使用[数据源插件](../../plugin/datasource-plugin.md)时，可以指定为插件对应的数据库值，比如oracle或postgresql | null |
|nacos.plugin.datasource.log.enabled｜Nacos Server 是否开启SQL日志打印，开启后会打印每一次执行的SQL，方便进行插件开发时的问题排查，但是较为损耗性能，日常状态建议关闭 | true/false | false |

#### 1.8.3. 环境变量插件

关于如何开发环境变量插件，请参考[环境变量插件](../../plugin/custom-environment-plugin.md)

|参数名	|含义	 |     可选值	 |     默认值|
|------|------|-----------|-----------------|
|nacos.custom.environment.enabled|Nacos Server 是否开启环境变量插件 | true/false | false |

#### 1.8.4. 反脆弱插件

反脆弱插件的开发，请参考[反脆弱插件](../../plugin/control-plugin.md)

|参数名	|含义	 |     可选值	 |     默认值| 
|------|------|-----------|-----------------|
|nacos.plugin.control.manager.type|Nacos反脆弱插件的类型 | nacos/其他自定义插件类型 | null |
|nacos.plugin.control.rule.external.storage|Nacos反脆弱插件，反脆弱规则外部存储类型，需要自行实现 | 字符串 | null |
|nacos.plugin.control.rule.local.basedir|Nacos反脆弱插件，反脆弱规则本地存储目录 | 文件路径 | ${nacos.home}/data/ |

#### 1.8.5. 配置变更插件

反脆弱插件的开发，请参考[配置变更插件](../../plugin/config-change-plugin.md)

|参数名	|含义	 |     可选值	 |     默认值| 
|------|------|-----------|-----------------|
|nacos.core.config.plugin.${configChangePluginName}.enabled=true|Nacos Server 是否开启配置变更插件 | true/false | false |
|nacos.core.config.plugin.${configChangePluginName}.${propertyKey}=${propertyValue}|配置变更插件的配置项 | 插件自定义 | 插件自定义 |

## 2. 镜像环境变量

属性配置列表

| 属性名称                                    | 描述                                        | 选项                                                                                                                                                                                    |
|-----------------------------------------|-------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| MODE                                    | 系统启动方式: 集群/单机，对应`nacos.standalone`  | cluster/standalone 默认 **cluster**                                                                                                                                                     |
| NACOS_SERVERS                           | 集群地址，对应`nacos.member.list`                 | p1:port1空格ip2:port2 空格ip3:port3                                                                                                                                                       |
| PREFER_HOST_MODE                        | 支持IP还是域名模式，对应`nacos.inetutils.prefer-hostname-over-ip` | hostname/ip 默认**IP**                                                                                                                                                                  |
| NACOS_SERVER_PORT                       | Nacos 运行端口，对应`server.port`                 | 默认**8848**                                                                                                                                                                            |
| NACOS_SERVER_IP                         | 多网卡模式下可以指定IP，对应`nacos.server.ip`        |                                                                                                                                                                                       |
| SPRING_DATASOURCE_PLATFORM              | 单机模式下支持MYSQL数据库，对应`spring.sql.init.platform` | mysql / 空 默认:空                                                                                                                                                                        |
| MYSQL_SERVICE_HOST                      | 数据库 连接地址                                  |                                                                                                                                                                                       |
| MYSQL_SERVICE_PORT                      | 数据库端口                                     | 默认 : **3306**                                                                                                                                                                         |
| MYSQL_SERVICE_DB_NAME                   | 数据库库名                                     |                                                                                                                                                                                       |
| MYSQL_SERVICE_USER                      | 数据库用户名                                    |                                                                                                                                                                                       |
| MYSQL_SERVICE_PASSWORD                  | 数据库用户密码                                   |                                                                                                                                                                                       |
| MYSQL_SERVICE_DB_PARAM                  | 数据库连接参数                                   | 默认:**characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useSSL=false**                                                                                  |
| MYSQL_DATABASE_NUM                      | 数据库个数                                     | 默认:**1**                                                                                                                                                                              |
| JVM_XMS                                 | -Xms                                      | 默认 :1g                                                                                                                                                                                |
| JVM_XMX                                 | -Xmx                                      | 默认 :1g                                                                                                                                                                                |
| JVM_XMN                                 | -Xmn                                      | 512m                                                                                                                                                                                  |
| JVM_MS                                  | - XX:MetaspaceSize                        | 默认 :128m                                                                                                                                                                              |
| JVM_MMS                                 | -XX:MaxMetaspaceSize                      | 默认 :320m                                                                                                                                                                              |
| NACOS_DEBUG                             | 是否开启远程DEBUG                               | y/n 默认 :n                                                                                                                                                                             |
| TOMCAT_ACCESSLOG_ENABLED                | `server.tomcat.accesslog.enabled`           | 默认 :false                                                                                                                                                                             |
| NACOS_AUTH_SYSTEM_TYPE                  | 权限系统类型选择,目前只支持nacos类型                     | 默认 :nacos                                                                                                                                                                             |
| NACOS_AUTH_ENABLE                       | 是否开启权限系统，对应`nacos.core.auth.enabled`  | 默认 :false                                                                                                                                                                             |
| NACOS_AUTH_TOKEN_EXPIRE_SECONDS         | token 失效时间                                | 默认 :18000                                                                                                                                                                             |
| NACOS_AUTH_TOKEN                        | token                                     | `注意：该环境变量的默认值在Nacos 2.2.1版本中已移除，开启鉴权时需要指定`                                                                                                                                                          |
| NACOS_AUTH_CACHE_ENABLE                 | 权限缓存开关 ,开启后权限缓存的更新默认有15秒的延迟               | 默认 : false                                                                                                                                                                            |
| MEMBER_LIST                             | 通过环境变量的方式设置集群地址                           | 例子:192.168.16.101:8847?raft_port=8807,192.168.16.101?raft_port=8808,192.168.16.101:8849?raft_port=8809                                                                                |
| EMBEDDED_STORAGE                        | 是否开启集群嵌入式存储模式                             | `embedded`  默认 : none                                                                                                                                                                 |
| NACOS_AUTH_CACHE_ENABLE                 | nacos.core.auth.caching.enabled           | default : false                                                                                                                                                                       |
| NACOS_AUTH_USER_AGENT_AUTH_WHITE_ENABLE | nacos.core.auth.enable.userAgentAuthWhite | default : false                                                                                                                                                                       |
| NACOS_AUTH_IDENTITY_KEY                 | nacos.core.auth.server.identity.key       | `注意：该环境变量的默认值在Nacos 2.2.1版本中已移除，开启鉴权时需要指定`                                                                                                                                                          |
| NACOS_AUTH_IDENTITY_VALUE               | nacos.core.auth.server.identity.value     | `注意：该环境变量的默认值在Nacos 2.2.1版本中已移除，开启鉴权时需要指定`                                                                                                                                                          |
| NACOS_SECURITY_IGNORE_URLS              | nacos.security.ignore.urls                | default : `/,/error,/**/*.css,/**/*.js,/**/*.html,/**/*.map,/**/*.svg,/**/*.png,/**/*.ico,/console-fe/public/**,/v1/auth/**,/v1/console/health/**,/actuator/**,/v1/console/server/**` |
| DB_POOL_CONNECTION_TIMEOUT              | 数据库连接池超时时间，单位为毫秒                          | 默认 : **30000**                                                                                                                                                                        |
| NACOS_CONSOLE_UI_ENABLED                | nacos.console.ui.enabled                  | default : `true`                                                                                                                                                                      |
| NACOS_CORE_PARAM_CHECK_ENABLED          | nacos.core.param.check.enabled            | default : `true`                                                                                                                                                                      |