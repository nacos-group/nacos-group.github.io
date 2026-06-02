---
title: 系统参数
keywords: [ Nacos,系统参数 ]
description: Nacos系统参数介绍
sidebar:
  order: 6
---

# Nacos 系统参数介绍

## 1. Nacos Server

对于Server端来说，一般是设置在`{nacos.home}/conf/application.properties`里，如果参数名后标注了(-D)的，则表示是 JVM
的参数，需要在`{nacos.home}/bin/startup.sh`里进行相应的设置。例如像设置 nacos.home
的值，可以在`{nacos.home}/bin/startup.sh`进行如下设置：

```
JAVA_OPT="${JAVA_OPT} -Dnacos.home=${BASE_DIR}"
```

若没有标注(-D)的参数，则同时可以在`{nacos.home}/conf/application.properties`
里和JVM参数中配置，如果同时配置了JVM参数和`{nacos.home}/conf/application.properties`，那么JVM参数的优先级更高。

### 1.1. 全局参数

#### 1.1.1. 基础参数

| 参数名	                                    | 含义	                                                                                        | 可选值	             | 默认值        | 
|-----------------------------------------|--------------------------------------------------------------------------------------------|------------------|------------|
| nacos.home(-D)                          | Nacos的根目录                                                                                  | 目录路径             | Nacos安装的目录 | 
| nacos.standalone(-D)                    | 是否在单机模式                                                                                    | true/false       | false      |
| nacos.functionMode(-D)                  | 启动模式，支持只启动某一个模块，不设置时所有模块都会启动                                                               | config/naming/空  | 空          | 
| nacos.server.ip(-D)                     | Nacos服务端的IP，优先级比`nacos.inetutils.ip-address`更高，如果配置了该参数，则`nacos.inetutils.ip-address`不再生效  | 本机IP             | null       |
| nacos.inetutils.prefer-hostname-over-ip | 节点优先使用hostname作为本机ip，若为`true`时，`cluster.conf`里是否应该填`hostname`                              | true/false       | false      | 
| nacos.inetutils.ip-address              | 本机IP，该参数设置后，将会使用这个IP去`cluster.conf`里进行匹配，请确保这个IP的值在`cluster.conf`里是存在的                     | 本机IP             | null       |
| nacos.core.sys.basic.processors         | 指定服务端的处理器个数，用于部分虚拟化场景，防止读取CPU个数时读取到错误的值，导致线程数过多或过少                                         | 正整数              | CPU个数      |
| nacos.core.monitor.topn.enabled         | Nacos Server topN 监控统计能力开关                                                                 | true/false       | true       |
| nacos.core.monitor.topn.count           | Nacos Server topN 监控统计 top的个数，如如配置为10，表示top10的配置和服务                                        | 正整数              | 10         |
| nacos.core.snowflake.worker-id          | Nacos Server 的snowflake workerId                                                           | 正整数              | -1         |
| nacos.core.param.check.enabled          | Nacos Server 参数校验能力开关，开启后将会校验请求时的参数是否符合规范，不符合将被拦截，详情查看 [参数校验](../user/parameters-check.md) | true/false       | true       |
| nacos.server.main.port                  | Nacos Server 的端口，替代之前的`server.port`                                                        | 正整数              | 8848       |
| nacos.server.contextPath                | Nacos Server 的Web Servlet上下文路径, 替代之前的`server.servlet.context-path`                         | 任意路径             | /nacos     |
| spring.config.additional-location       | Nacos Server 的额外配置文件路径，除`{nacos.home}/conf/application.properties`外，用户可以添加额外的配置文件          | 文件路径，多个文件路径用逗号分隔 | null       | 
| nacos.remote.grpc.listen.ip(-D)         | Nacos Server Grpc Port LISTEN IP，Nacos 服务端 Grpc 监听IP，默认绑定全零IP                              | 本机IP             | null       |

#### 1.1.2. Database

| Property | Meaning | Values | Default |
| --- | --- | --- | --- |
| spring.sql.init.platform | Database type used by Nacos Server | `derby`, `mysql`, `postgresql`, `oracle`, empty, or a custom datasource plugin type. `oracle` requires Oracle 12c or later. If empty, Nacos chooses Derby or external storage based on `nacos.standalone`. | null |
| db.num | Number of database connections | positive integer | 0 |
| db.url.0 | JDBC URL of the first database connection | string | empty |
| db.url.1 | JDBC URL of the second database connection, used when `db.num=2` | string | empty |
| db.user | Database username shared by all connections when indexed usernames are not configured | string | empty |
| db.password | Database password shared by all connections when indexed passwords are not configured | string | empty |
| db.pool.config.xxx | HikariCP pool properties, such as `db.pool.config.connectionTimeout` or `db.pool.config.maximumPoolSize` | string | HikariCP defaults |

The database configuration supports multiple connection URLs within the same database type. Use `db.num` to set the number of connections, and `db.url.0`, `db.url.1`, and so on for JDBC URLs. If `db.user` and `db.password` are not indexed, all connections use the same credentials. If each connection has different credentials, use `db.user.0`, `db.password.0`, `db.user.1`, `db.password.1`, and so on. For database dialects and more database types, see [Datasource Plugin](../../plugin/datasource-plugin.md).

Nacos uses HikariCP as the connection pool. `db.pool.config` is the prefix for HikariCP properties. If `db.pool.config.driverClassName` is not configured, the default driver class is the MySQL 8 driver.

#### 1.1.2. Remoting

| 参数名	                                                      | 含义	                                       | 可选值	       | 默认值              | 
|-----------------------------------------------------------|-------------------------------------------|------------|------------------|
| nacos.remote.server.grpc.sdk.max-inbound-message-size     | Nacos Server gRPC 能接收的单次最大客户端请求大小，单位byte  | 正整数        | 10 * 1024 * 1024 |
| nacos.remote.server.grpc.cluster.max-inbound-message-size | Nacos Server gRPC 能接收的单次最大集群间请求大小，单位byte  | 正整数        | 10 * 1024 * 1024 |
| nacos.metric.grpc.server.executor.enabled                 | Nacos Server gRPC线程池 监控能力开关               | true/false | true             |
| nacos.metric.grpc.server.executor.interval                | Nacos Server gRPC线程池的间隔时间，单位为毫秒           | 正整数        | 15000            |
| nacos.metric.grpc.server.connection.enabled               | Nacos Server gRPC长连接 监控能力开关               | true/false | true             |
| nacos.metric.grpc.server.connection.interval              | Nacos Server gRPC长连接的间隔时间，单位为**秒**        | 正整数        | 15               |
| remote.executor.times.of.processors(-D)                   | 服务端，处理请求的线程池大小的倍数, 例如配置为2，表示线程池大小为2 * CPU | 正整数        | 16               |
| remote.executor.queue.size(-D)                            | 服务端，处理请求的线程池队列大小                          | 正整数        | 16384            |

#### 1.1.3. 集群列表

| 参数名	                                 | 含义	                                                                                                         | 可选值	                  | 默认值              | 
|--------------------------------------|-------------------------------------------------------------------------------------------------------------|-----------------------|------------------|
| nacos.member.list                    | Nacos Server 地址列表，在`cluster.conf`不存在时生效                                                                     | `ip1:port1,ip2:port2` | null             |
| nacos.member-change-event.queue.size | Nacos Server 集群节点变更事件队列的大小，当集群节点通过`cluster.conf`或地址服务器变更时，会将变更事件放入该队列，该队列会异步通知Server中的一些机制，比如Distro/Raft协议。 | 正整数                   | 128              |
| nacos.core.member.lookup.type        | Nacos Server 集群节点的发现方式，支持配置文件`cluster.conf`和地址服务器模式                                                         | file/address-server   | file             |
| nacos.core.address-server.retry      | 当`nacos.core.member.lookup.type`指定为`address-server`时生效，请求地址服务器的重试次数，超过重试次数后不再尝试从地址服务器获取NacosServer的集群列表     | 正整数                   | 5                |
| address.server.domain                | 当`nacos.core.member.lookup.type`指定为`address-server`时生效，地址服务器的域名                                             | 域名                    | jmenv.tbsite.net |
| address.server.port                  | 当`nacos.core.member.lookup.type`指定为`address-server`时生效，地址服务器的端口                                             | 0～65535               | 8080             |
| address.server.url                   | 当`nacos.core.member.lookup.type`指定为`address-server`时生效，地址服务器的url                                            | 字符串                   | /serverlist      |

### 1.2. Distro 协议

| 参数名	                                              | 含义	                                                          | 可选值	 | 默认值   | 
|---------------------------------------------------|--------------------------------------------------------------|------|-------|
| nacos.core.protocol.distro.data.sync.delayMs      | Distro协议同步数据的延迟时间，同一份数据处于延迟时间内多次变更时，会被合并为一次同步，单位为毫秒          | 正整数  | 1000  |
| nacos.core.protocol.distro.data.sync.timeoutMs    | Distro协议同步数据的超时时间，同步到目标节点时超过该时间，则会认为同步失败，进行延迟后重试，单位为毫秒       | 正整数  | 3000  |
| nacos.core.protocol.distro.data.sync.retryDelayMs | Distro协议同步数据的重试间隔，当数据同步到目标节点失败时，进行该值时间的延迟后再重试，避免同步重试风暴，单位为毫秒 | 正整数  | 3000  |
| nacos.core.protocol.distro.data.verify.intervalMs | Distro协议数据验证的间隔，已经同步过的数据，会定期进行数据有效性验证，验证失败会重新发起该数据的同步，单位为毫秒  | 正整数  | 5000  | 
| nacos.core.protocol.distro.data.verify.timeoutMs  | Distro协议数据验证的超时时间，单位为毫秒                                      | 正整数  | 3000  |
| nacos.core.protocol.distro.data.load.retryDelayMs | Distro协议快照数据加载的重试间隔，在节点刚启动时生效，单位为毫秒                          | 正整数  | 30000 |
| nacos.core.protocol.distro.data.load.timeoutMs    | Distro协议快照数据加载的超时时间，超过该时间未读取到其他节点的快照数据，则认为加载快照失败，单位为毫秒       | 正整数  | 30000 |

### 1.3 Raft 协议

| 参数名	                                            | 含义	                                                                  | 可选值	       | 默认值        | 
|-------------------------------------------------|----------------------------------------------------------------------|------------|------------|
| nacos.core.protocol.raft.election_timeout_ms    | Raft协议选举超时时间，单位ms                                                    | 正整数        | 5000       |
| nacos.core.protocol.raft.snapshot_interval_secs | Raft协议快照写入间隔时间，单位s                                                   | 正整数        | 3600       |
| nacos.core.protocol.raft.core_thread_num        | Raft协议的核心线程数，用于处理Raft同步的请求线程数                                        | 正整数        | 8          |
| nacos.core.protocol.raft.cli_service_thread_num | Raft协议的核心线程数，用于发起Raft同步数据的请求线程数                                      | 正整数        | 4          |
| nacos.core.protocol.raft.rpc_request_timeout_ms | Raft协议请求的超时时间，单位ms                                                   | 正整数        | 5000       |
| nacos.core.protocol.raft.max_byte_count_per_rpc | Raft协议单次请求最大字节数                                                      | 正整数        | 128 * 1024 |
| nacos.core.protocol.raft.max_entries_size       | Raft协议单个日志的最大个数                                                      | 正整数        | 1024       |
| nacos.core.protocol.raft.max_body_size          | Raft协议发送日志的最大 body 大小                                                | 正整数        | 512 * 1024 |
| nacos.core.protocol.raft.max_append_buffer_size | Raft协议日志存储缓冲区最大大小                                                    | 正整数        | 256 * 1024 |
| nacos.core.protocol.raft.max_election_delay_ms  | Raft协议选举的最大随机间隔，选举定时器间隔会在指定时间之外随机的最大范围                               | 正整数        | 1000       |
| nacos.core.protocol.raft.strict_mode            | 从`2.4.2`版本开始支持，Raft的启动校验是否采用严格模式，开启后，当raft无法选举时，引擎的readiness接口将返回500 | true/false | false      |

### 1.4. Naming模块

| 参数名	                                             | 含义	                                                                                             | 可选值	       | 默认值           | 
|--------------------------------------------------|-------------------------------------------------------------------------------------------------|------------|---------------|
| nacos.naming.expireInstance                      | 是否自动摘除临时实例                                                                                      | true/false | true          |
| nacos.naming.data.warmup                         | 从`2.4.2`版本开始支持，是否在启动时校验数据是否预热，开启可能造成Server的readiness接口返回500，需要等待预热完成，启动时间变长                     | true/false | false         |
| nacos.naming.clean.empty-service.interval        | Naming模块的空服务清理间隔，单位毫秒                                                                           | 正整数        | 60 * 1000     |
| nacos.naming.clean.empty-service.expired-time    | Naming模块的空服务过期时间，过期的空服务会被清理，单位毫秒                                                                | 正整数        | 60 * 1000     |
| nacos.naming.clean.expired-metadata.interval     | Naming模块的元数据清理间隔，单位毫秒                                                                           | 正整数        | 5000          |
| nacos.naming.clean.expired-metadata.expired-time | Naming模块的元数据过期时间，过期的元数据会被清理，单位毫秒                                                                | 正整数        | 60 * 1000     |
| nacos.naming.client.expired.time                 | 临时Client对应数据的过期时间，当Distro协议停止对该Client的数据进行续约且时间超过该值时，该Client数据将被删除，主要应对Nacos Server之间断网的场景，单位毫秒 | 正整数        | 3 * 60 * 1000 |
| nacos.naming.push.pushTaskDelay                  | 服务数据推送的延迟时间，同一个人服务处于延迟时间内多次变更时，会被合并为一次推送，单位为毫秒                                                  | 正整数        | 500           |
| nacos.naming.push.pushTaskTimeout                | 服务数据推送的超时时间，超过该时间未收到客户端的确认，将延迟后重试，单位为毫秒                                                         | 正整数        | 5000          |
| nacos.naming.push.pushTaskRetryDelay             | 服务数据推送失败后的重试间隔时间，单位为毫秒                                                                          | 正整数        | 1000          |

### 1.5. Config模块

| 参数名	                                      | 含义	                                                                  | 可选值	       | 默认值   |
|-------------------------------------------|----------------------------------------------------------------------|------------|-------|
| nacos.config.push.maxRetryTime            | 配置变更数据推送的延迟时间，同一个人配置处于延迟时间内多次变更时，会被合并为一次推送，单位为毫秒                     | 正整数        | 50    |
| nacos.config.retention.days               | Nacos配置中心配置变更历史保留天数，超过该时间的配置变更历史会被删除                                 | 正整数        | 30    | 
| nacos.config.search.max_capacity          | Nacos配置中心，根据配置内容查找配置功能的最大队列个数，由于基于内容的检索十分消耗性能，因此对该功能的并发进行限制，最大不可超过32 | 0～32       | 4     | 
| nacos.config.search.max_thread            | 根据配置内容查找配置功能的最大线程数，最大并发数，最大不可超过16                                    | 0～16       | 2     | 
| nacos.config.search.wait_timeout          | 根据配置内容查找配置功能的等待超时时间，超过等待时间的查找任务会直接失败丢弃，单位毫秒                          | 正整数        | 8000  | 
| nacos.config.derby.ops.enabled            | 当使用derby数据库作为存储时，是否开启derby的相关运维接口                                    | true/false | false |
| nacos.persistence.sql.derby.limit.enabled | 当使用derby数据库作为存储时,限制derby数据库可执行的SQL范围为DML和部分DDL，从`2.4.1`版本开始支持        | true/false | true  |

### 1.6. CMDB模块

| 参数名	                         | 含义	            | 可选值	       | 默认值   | 
|------------------------------|----------------|------------|-------|
| nacos.cmdb.loadDataAtStart   | 是否打开CMDB       | true/false | false |
| nacos.cmdb.dumpTaskInterval  | 全量dump的间隔，单位为秒 | 正整数        | 3600  | 
| nacos.cmdb.eventTaskInterval | 变更事件的拉取间隔，单位为秒 | 正整数        | 10    | 
| nacos.cmdb.labelTaskInterval | 标签集合的拉取间隔，单位为秒 | 正整数        | 300   | 

### 1.7. Istio模块

| 参数名	                                 | 含义	             | 可选值	       | 默认值   | 
|--------------------------------------|-----------------|------------|-------|
| nacos.extension.naming.istio.enabled | 是否加载istio模块     | true/false | false |
| nacos.istio.mcp.server.enabled       | 是否开启Istio MCP协议 | true/false | false |
| nacos.istio.mcp.server.port          | Istio MCP协议监听端口 | 正整数        | 18848 |

### 1.8. 插件

#### 1.8.1. Auth plugin

For enabling auth, see [Authorization](./auth.mdx). For developing auth plugins, see [Auth Plugin](../../plugin/auth-plugin.md).

| Property | Meaning | Values | Default |
| --- | --- | --- | --- |
| nacos.core.auth.enabled | Enable auth for Open API, SDK, and gRPC requests | true/false | true |
| nacos.core.auth.admin.enabled | Enable auth for Admin API requests | true/false | true |
| nacos.core.auth.console.enabled | Enable auth for Console API requests | true/false | true |
| nacos.core.auth.system.type | Selected Nacos auth plugin type | nacos/ldap/oidc/custom plugin type | nacos |
| nacos.core.auth.server.identity.key | Server-to-server identity key. Required when auth is enabled in a cluster | string | null |
| nacos.core.auth.server.identity.value | Server-to-server identity value. Required when auth is enabled in a cluster | string | null |
| nacos.core.auth.caching.enabled | Cache user, role, and permission data. Permission changes may have about 15 seconds of delay | true/false | true |

Since Nacos 3.2, the `ldap` plugin is provided as a standalone optional plugin. The `oidc` plugin integrates with OIDC/OAuth2 identity providers. For details, see [OIDC/OAuth2 Authentication](./oidc-auth.md).

#### 1.8.2. Visibility plugin

For the relationship between visibility and auth, see [Visibility Plugin](../../plugin/visibility-plugin.md).

| Property | Meaning | Values | Default |
| --- | --- | --- | --- |
| nacos.plugin.visibility.enabled | Enable the resource visibility plugin | true/false | true |
| nacos.plugin.visibility.type | Selected visibility plugin type | nacos/custom plugin type | nacos |

#### 1.8.3. Datasource plugin

For database configuration and datasource plugin details, see [Database](#112-database) and [Datasource Plugin](../../plugin/datasource-plugin.md).

| Property | Meaning | Values | Default |
| --- | --- | --- | --- |
| spring.sql.init.platform | Database type used by Nacos Server | `derby`, `mysql`, `postgresql`, `oracle`, empty, or a custom datasource plugin type. `oracle` requires Oracle 12c or later | null |
| nacos.plugin.datasource.log.enabled | Whether to print SQL logs. Useful for plugin development and troubleshooting, but expensive for daily production use | true/false | false |

#### 1.8.4. Environment plugin

For development details, see [Custom Environment Plugin](../../plugin/custom-environment-plugin.md).

| Property | Meaning | Values | Default |
| --- | --- | --- | --- |
| nacos.custom.environment.enabled | Enable the custom environment plugin | true/false | false |

#### 1.8.5. Control plugin

The control plugin protects the server with request-rate and connection-count limits. For details, see [Traffic Control Plugin](../../plugin/control-plugin.md).

| Property | Meaning | Values | Default |
| --- | --- | --- | --- |
| nacos.plugin.control.manager.type | Selected traffic control plugin type | `nacos` or a custom plugin type | null |
| nacos.plugin.control.rule.external.storage | External rule storage type. Requires a custom implementation | string | null |
| nacos.plugin.control.rule.local.basedir | Base directory for local traffic control rules. Rules are stored under `data/connection` and `data/tps` in this directory | file path | `${nacos.home}` |

#### 1.8.6. Config change plugin

For development details, see [Config Change Plugin](../../plugin/config-change-plugin.md).

| Property | Meaning | Values | Default |
| --- | --- | --- | --- |
| nacos.core.config.plugin.${configChangePluginName}.enabled=true | Enable a config change plugin | true/false | false |
| nacos.core.config.plugin.${configChangePluginName}.${propertyKey}=${propertyValue} | Plugin-specific configuration | plugin-specific | plugin-specific |

### 1.9. 控制台

| 参数名	                                     | 含义	                                                                             | 可选值	                | 默认值      | 
|------------------------------------------|---------------------------------------------------------------------------------|---------------------|----------|
| nacos.console.port                       | Nacos 控制台端口                                                                     | 端口号                 | 8080     |
| nacos.console.contextPath                | Nacos 控制台上下文路径                                                                  | 上下文路径               | ""       |
| nacos.console.remote.server.context-path | Nacos 控制台访问的远程Nacos服务上下文路径，仅在`console`独立控制台部署模式下有效，对应`nacos.server.contextPath` | Nacos 服务的 Web，上下文路径 | "/nacos" |
| nacos.console.ui.enabled                 | 控制台是否开启UI界面                                                                     | true/false          | true     |
| nacos.console.cors.allow-credentials     | 控制台CORS是否允许凭据（cookies、authorization headers、TLS client certificates）            | true/false          | true     |
| nacos.console.cors.allowed-headers       | 控制台CORS允许的请求头，逗号分隔。留空表示允许所有请求头(*)                                               | 请求头列表               | ""       |
| nacos.console.cors.max-age               | 控制台CORS预检请求缓存最大时间(秒)                                                            | 正整数                 | 18000    |
| nacos.console.cors.allowed-methods       | 控制台CORS允许的HTTP方法，逗号分隔。留空表示允许所有方法(*)                                             | 方法列表                | ""       |
| nacos.console.cors.allowed-origins       | 控制台CORS允许的来源，逗号分隔。留空表示允许所有来源模式(*)。例如: http://localhost:8080,https://example.com | 来源列表                | ""       |

### 1.10. AI模块

| 参数名	                          | 含义	                                                                                | 可选值	       | 默认值   | 
|-------------------------------|------------------------------------------------------------------------------------|------------|-------|
| nacos.extension.ai.enabled    | 是否启用Nacos AI模块，默认为true。AI模块需要同时启用配置模块和服务模块，启用后可以使用MCP注册中心和A2A注册中心。                 | true/false | true  |
| nacos.ai.mcp.registry.enabled | 是否启用官方MCP Registry协议适配，默认为false。当设置为true时，Nacos将启动一个独立的端口，且暴露官方MCP Registry协议和API。 | true/false | false |
| nacos.ai.mcp.registry.port    | Nacos 官方MCP Registry API的端口，仅在`nacos.ai.mcp.registry.enabled`为true时生效              | 端口号        | 9080  |

### 1.11. 其他短期参数

Nacos 中存在部分用于兼容旧版本或平滑升级使用的参数配置，在对应版本中有效，在未来版本中会移除，请根据版本进行配置。

| 参数名	                                         | 含义	                                                                                                       | 计划版本         | 可选值	       | 默认值   | 
|----------------------------------------------|-----------------------------------------------------------------------------------------------------------|--------------|------------|-------|
| nacos.core.api.compatibility.client.enabled  | Nacos Client API（OpenAPI） 是否开启兼容模式，开启时将允许使用老版本Client API（OpenAPI），建议暂时打开，并尽快推动客户端版本升级到2.X以上               | 3.0.0~latest | true/false | true  |
| nacos.core.api.compatibility.admin.enabled   | Nacos Admin API（OpenAPI） 是否开启兼容模式，开启时将允许使用老版本Admin API（OpenAPI），不建议打开                                     | 3.0.0~latest | true/false | false |
| nacos.core.api.compatibility.console.enabled | Nacos Console API（OpenAPI） 是否开启兼容模式，开启时将允许使用老版本Console API（OpenAPI）），不建议打开                                | 3.0.0~latest | true/false | false |
| nacos.config.gray.compatible.model           | Nacos Beta灰度配置是否使用兼容模式，开启时将对beta灰度配置进行双写兼容和迁移，`2.5.0`版本开始支持。关闭后对Beta灰度配置的性能和启动速度有大幅提升，建议升级时打开，稳定后关闭       | 2.5.0~latest | true/false | true  |
| nacos.gray.migrate.executor.multi            | Nacos 灰度配置迁移线程池大小。在`nacos.config.gray.compatible.model=true`时有效，用于启动时迁移Beta灰度配置到新版本灰度配置的线程数，越高效率好，启动速度越快。 | 2.5.0~latest | 任意正整数      | 8     |
| nacos.config.namespace.compatible.mode       | Nacos 命名空间兼容模式，开启时，Nacos会自动将`namespaceId=""`的配置，自动迁移到`namespaceId="public"`下。建议升级时打开，稳定后关闭                | 3.0.0~latest | true/false | true  |
| nacos.namespace.migrate.retry.times          | Nacos 命名空间迁移重试次数，避免因网络抖动等问题导致迁移失败，在`nacos.namespace.compatible.mode=true`时有效                              | 3.0.0~latest | 任意正整数      | 3     |
| nacos.namespace.migrate.batch.size           | Nacos 命名空间迁移一次批量迁移的配置数量，在`nacos.namespace.compatible.mode=true`时有效，值越大效率越高，但对数据库的压力也越大                    | 3.0.0~latest | 任意正整数      | 100   |

## 2. 镜像环境变量

属性配置列表

| 属性名称                                    | 描述                                                     | 选项                                                                                                                                                                                    |
|-----------------------------------------|--------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| MODE                                    | 系统启动方式: 集群/单机，对应`nacos.standalone`                     | cluster/standalone 默认 **cluster**                                                                                                                                                     |
| NACOS_SERVERS                           | 集群地址，对应`nacos.member.list`                             | p1:port1空格ip2:port2 空格ip3:port3                                                                                                                                                       |
| PREFER_HOST_MODE                        | 支持IP还是域名模式，对应`nacos.inetutils.prefer-hostname-over-ip` | hostname/ip 默认**IP**                                                                                                                                                                  |
| NACOS_SERVER_PORT                       | Nacos 运行端口，对应`server.port`                             | 默认**8848**                                                                                                                                                                            |
| NACOS_SERVER_IP                         | 多网卡模式下可以指定IP，对应`nacos.server.ip`                       |                                                                                                                                                                                       |
| SPRING_DATASOURCE_PLATFORM              | 单机模式下支持MYSQL数据库，对应`spring.sql.init.platform`           | mysql / 空 默认:空                                                                                                                                                                        |
| MYSQL_SERVICE_HOST                      | 数据库 连接地址                                               |                                                                                                                                                                                       |
| MYSQL_SERVICE_PORT                      | 数据库端口                                                  | 默认 : **3306**                                                                                                                                                                         |
| MYSQL_SERVICE_DB_NAME                   | 数据库库名                                                  |                                                                                                                                                                                       |
| MYSQL_SERVICE_USER                      | 数据库用户名                                                 |                                                                                                                                                                                       |
| MYSQL_SERVICE_PASSWORD                  | 数据库用户密码                                                |                                                                                                                                                                                       |
| MYSQL_SERVICE_DB_PARAM                  | 数据库连接参数                                                | 默认:**characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useSSL=false**                                                                                  |
| MYSQL_DATABASE_NUM                      | 数据库个数                                                  | 默认:**1**                                                                                                                                                                              |
| JVM_XMS                                 | -Xms                                                   | 默认 :1g                                                                                                                                                                                |
| JVM_XMX                                 | -Xmx                                                   | 默认 :1g                                                                                                                                                                                |
| JVM_XMN                                 | -Xmn                                                   | 512m                                                                                                                                                                                  |
| JVM_MS                                  | - XX:MetaspaceSize                                     | 默认 :128m                                                                                                                                                                              |
| JVM_MMS                                 | -XX:MaxMetaspaceSize                                   | 默认 :320m                                                                                                                                                                              |
| NACOS_DEBUG                             | 是否开启远程DEBUG                                            | y/n 默认 :n                                                                                                                                                                             |
| TOMCAT_ACCESSLOG_ENABLED                | `server.tomcat.accesslog.enabled`                      | 默认 :false                                                                                                                                                                             |
| NACOS_AUTH_SYSTEM_TYPE                  | 权限系统类型选择,目前只支持nacos类型                                  | 默认 :nacos                                                                                                                                                                             |
| NACOS_AUTH_ENABLE                       | 是否开启权限系统，对应`nacos.core.auth.enabled`                   | 默认 :false                                                                                                                                                                             |
| NACOS_AUTH_TOKEN_EXPIRE_SECONDS         | token 失效时间                                             | 默认 :18000                                                                                                                                                                             |
| NACOS_AUTH_TOKEN                        | token                                                  | `注意：该环境变量的默认值在Nacos 2.2.1版本中已移除，开启鉴权时需要指定`                                                                                                                                            |
| NACOS_AUTH_CACHE_ENABLE                 | 权限缓存开关 ,开启后权限缓存的更新默认有15秒的延迟                            | 默认 : false                                                                                                                                                                            |
| MEMBER_LIST                             | 通过环境变量的方式设置集群地址                                        | 例子:192.168.16.101:8847?raft_port=8807,192.168.16.101?raft_port=8808,192.168.16.101:8849?raft_port=8809                                                                                |
| EMBEDDED_STORAGE                        | 是否开启集群嵌入式存储模式                                          | `embedded`  默认 : none                                                                                                                                                                 |
| NACOS_AUTH_CACHE_ENABLE                 | nacos.core.auth.caching.enabled                        | default : false                                                                                                                                                                       |
| NACOS_AUTH_USER_AGENT_AUTH_WHITE_ENABLE | nacos.core.auth.enable.userAgentAuthWhite              | default : false                                                                                                                                                                       |
| NACOS_AUTH_IDENTITY_KEY                 | nacos.core.auth.server.identity.key                    | `注意：该环境变量的默认值在Nacos 2.2.1版本中已移除，开启鉴权时需要指定`                                                                                                                                            |
| NACOS_AUTH_IDENTITY_VALUE               | nacos.core.auth.server.identity.value                  | `注意：该环境变量的默认值在Nacos 2.2.1版本中已移除，开启鉴权时需要指定`                                                                                                                                            |
| NACOS_SECURITY_IGNORE_URLS              | nacos.security.ignore.urls                             | default : `/,/error,/**/*.css,/**/*.js,/**/*.html,/**/*.map,/**/*.svg,/**/*.png,/**/*.ico,/console-fe/public/**,/v1/auth/**,/v1/console/health/**,/actuator/**,/v1/console/server/**` |
| DB_POOL_CONNECTION_TIMEOUT              | 数据库连接池超时时间，单位为毫秒                                       | 默认 : **30000**                                                                                                                                                                        |
| NACOS_CONSOLE_UI_ENABLED                | nacos.console.ui.enabled                               | default : `true`                                                                                                                                                                      |
| NACOS_CORE_PARAM_CHECK_ENABLED          | nacos.core.param.check.enabled                         | default : `true`                                                                                                                                                                      |
| NACOS_AUTH_ADMIN_ENABLE                 | nacos.core.auth.admin.enable                           | default : `true`                                                                                                                                                                      |
| NACOS_AUTH_CONSOLE_ENABLE               | nacos.core.auth.console.enable                         | default : `true`                                                                                                                                                                      |
| NACOS_CONSOLE_PORT                      | nacos.console.port                                     | default : `8080`                                                                                                                                                                      |
| NACOS_CONSOLE_CONTEXTPATH               | nacos.console.contextPath                              | default : ``                                                                                                                                                                          |
