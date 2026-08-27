---
title: 系统参数
keywords: [Nacos, 系统参数, 配置项, application.properties]
description: Nacos Server、Console、插件、AI 管理中心和兼容能力的常用系统参数。
sidebar:
  order: 6
---

# 系统参数

本文整理 Nacos 3.3.x 常用服务端参数。主要来源是发行包中的 `${nacos.home}/conf/application.properties`，并结合当前代码中的配置读取逻辑补充说明。

如果你正在部署生产集群，建议先阅读[部署最佳实践](./deployment/deployment-best-practices.md)，再回到本文确认具体参数。

## 配置放在哪里

Nacos Server 的主要配置文件是 `${nacos.home}/conf/application.properties`。启动脚本会额外带上：

```shell
--spring.config.additional-location=file:${BASE_DIR}/conf/
```

同一个参数可以来自配置文件、JVM `-D` 参数或启动脚本。一般情况下，JVM 参数优先级高于配置文件。带 `(-D)` 标识的参数通常需要通过启动脚本或 JVM 参数设置。

:::caution
Nacos 是内部微服务组件，不应暴露在公网。开启控制台、鉴权、监控、插件和 AI 管理中心能力时，也应放在可信内部网络中，并配合网络隔离、访问控制和审计。
:::

## 基础启动参数

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| `nacos.home(-D)` | Nacos 根目录。 | 安装目录 |
| `nacos.standalone(-D)` | 是否以单机模式启动。`startup.sh -m standalone` 会设置该参数。 | `false` |
| `nacos.functionMode(-D)` | 启动功能模式。`all` 表示启动全部可用模块；`config`、`naming` 分别只启动配置中心、服务发现；`microservice` 仅启动 Config 和 Naming，不加载 AI 模块；`ai` 启动 AI 及其依赖的 Config 和 Naming。 | `all` |
| `nacos.deployment.type(-D)` | 部署形态。启动脚本默认设置为 `merged`；独立控制台部署时会使用控制台相关配置。 | `merged` |
| `nacos.server.main.port` | Nacos Server 主端口。 | `8848` |
| `nacos.server.contextPath` | Nacos Server HTTP 上下文路径。 | `/nacos` |
| `spring.config.additional-location` | 额外配置文件路径。多个路径用逗号分隔。 | `${nacos.home}/conf/` |
| `server.error.include-message` | Spring Boot 错误响应是否包含 message。 | `ALWAYS` |
| `server.max-http-request-header-size` | HTTP 请求头大小上限，启动脚本默认设置。 | `524288` |

## 网络与节点地址

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| `nacos.server.ip(-D)` | 指定本机 IP。优先级高于自动探测和 `nacos.inetutils.ip-address`。 | 空 |
| `nacos.inetutils.ip-address` | 指定本机 IP，通常用于多网卡或容器网络。 | 空 |
| `nacos.inetutils.prefer-hostname-over-ip` | 节点地址优先使用 hostname。开启后，`cluster.conf` 也应使用可解析的 hostname。 | `false` |
| `nacos.remote.grpc.listen.ip(-D)` | gRPC 端口监听 IP。未设置时通常监听所有网卡。 | 空 |

## 数据库

Nacos 通过数据源方言插件支持 Derby、MySQL、PostgreSQL、Oracle 和自定义数据库类型。更多安装方式、社区插件和 Oracle 版本要求见[多数据源插件](../../plugin/datasource-plugin.md)。

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| `nacos.plugin.datasource-dialect.type` | 启动时选择 `derby`、`mysql`、`postgresql`、`oracle` 或自定义方言。 | 单机/embedded 为 `derby`，普通集群为 `mysql` |
| `nacos.plugin.datasource.db.num` | 外置数据库连接地址数量。 | `0` |
| `nacos.plugin.datasource.db.url.{index}` | 逐下标 JDBC URL。 | 空 |
| `nacos.plugin.datasource.db.user[.{index}]` | 公共或逐连接用户名。 | 空 |
| `nacos.plugin.datasource.db.password[.{index}]` | 公共或逐连接密码。 | 空 |
| `nacos.plugin.datasource.db.pool.config.*` | HikariCP 参数；稳定键使用 kebab-case，例如 `maximum-pool-size`。 | 各项默认值见数据源插件文档 |
| `nacos.plugin.datasource.db.query-timeout` | JDBC query timeout，单位秒。 | `3` |
| `nacos.plugin.datasource.log.enabled` | 是否输出数据源插件相关日志。 | `true` |

:::note
`spring.sql.init.platform` 是方言选择的历史 alias；`db.*` 是连接配置 alias。标准键优先。`spring.datasource.platform` 已移除。
:::

## Web 与控制台

Nacos 3.x 默认将 Server 和 Console 分成两个端口。Server API 默认是 `8848`，新控制台默认是 `8080`。控制台使用方式见[控制台手册](./console.md)。

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| `nacos.console.port` | 控制台端口。 | `8080` |
| `nacos.console.contextPath` | 控制台上下文路径。 | 空 |
| `nacos.console.remote.server.context-path` | 独立控制台访问远端 Nacos Server 时使用的 Server 上下文路径。 | `/nacos` |
| `nacos.console.ui.enabled` | 是否启用控制台 UI。 | `true` |
| `nacos.console.ui.default` | 默认控制台 UI。可选 `next` 或 `legacy`。 | `next` |
| `spring.servlet.multipart.max-file-size` | 控制台上传单文件大小上限，例如 Skill zip。 | `10MB` |
| `spring.servlet.multipart.max-request-size` | 控制台上传请求总大小上限。 | `10MB` |
| `server.servlet.encoding.charset` | Servlet 编码。 | `UTF-8` |

### 控制台 CORS

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| `nacos.console.cors.allow-credentials` | 是否允许携带 Cookie、Authorization header、TLS client certificate 等凭据。 | `true` |
| `nacos.console.cors.allowed-headers` | 允许的请求头。留空表示允许所有请求头。 | 空 |
| `nacos.console.cors.max-age` | CORS 预检请求缓存时间，单位秒。 | `18000` |
| `nacos.console.cors.allowed-methods` | 允许的 HTTP 方法。留空表示允许所有方法。 | 空 |
| `nacos.console.cors.allowed-origins` | 允许的来源。留空表示允许所有来源模式。 | 空 |

## 访问日志与监控

监控指标暴露和告警建议见[监控手册](./monitor.md)。

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| `server.tomcat.accesslog.enabled` | 是否开启访问日志。 | `true` |
| `server.tomcat.accesslog.max-days` | 访问日志保留天数。 | `30` |
| `server.tomcat.accesslog.pattern` | 访问日志格式。 | 发行包默认格式 |
| `server.tomcat.basedir` | Tomcat 工作目录和访问日志基准目录。 | `file:.` |
| `management.endpoints.web.exposure.include` | Actuator 暴露的 endpoint。开启 Prometheus 指标时加入 `prometheus`。 | 空 |
| `management.metrics.export.elastic.enabled` | 是否启用 Elastic metrics exporter。 | `false` |
| `management.metrics.export.influx.enabled` | 是否启用 Influx metrics exporter。 | `false` |
| `nacos.core.monitor.topn.enabled` | 是否开启 TopN 监控统计。 | `true` |
| `nacos.core.monitor.topn.count` | TopN 统计数量。 | `10` |
| `nacos.core.monitor.topn.internalMs` | TopN 统计周期，单位毫秒。 | `60000` |

## 集群成员发现

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| `nacos.member.list(-D)` | 集群成员列表。启动脚本 `-c` 参数会写入该 JVM 参数；当 `cluster.conf` 不存在时可使用。 | 空 |
| `nacos.member-change-event.queue.size` | 集群成员变更事件队列大小。 | `128` |
| `nacos.core.member.lookup.type` | 成员发现方式。可选 `file` 或 `address-server`。 | `file` |
| `nacos.core.address-server.retry` | 地址服务器初始化重试次数。 | `5` |
| `address.server.domain` | 地址服务器域名。 | `jmenv.tbsite.net` |
| `address.server.port` | 地址服务器端口。 | `8080` |
| `address.server.url` | 地址服务器请求路径。 | `/nacos/serverlist` |
| `nacos.core.member.meta.site` | 节点站点元数据。 | 空 |
| `nacos.core.member.meta.adweight` | 节点权重元数据。 | 空 |
| `nacos.core.member.meta.weight` | 节点权重元数据。 | 空 |

## gRPC

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| `nacos.remote.server.grpc.sdk.max-inbound-message-size` | SDK gRPC 请求最大接收大小，单位 byte。 | `10485760` |
| `nacos.remote.server.grpc.sdk.keep-alive-time` | SDK gRPC keepalive 间隔，单位毫秒。 | `7200000` |
| `nacos.remote.server.grpc.sdk.keep-alive-timeout` | SDK gRPC keepalive 超时，单位毫秒。 | `20000` |
| `nacos.remote.server.grpc.sdk.permit-keep-alive-time` | 允许客户端配置的最小 keepalive 间隔，单位毫秒。 | `300000` |
| `nacos.remote.server.grpc.cluster.max-inbound-message-size` | 集群间 gRPC 请求最大接收大小，单位 byte。 | `10485760` |
| `nacos.remote.server.grpc.cluster.keep-alive-time` | 集群间 gRPC keepalive 间隔，单位毫秒。 | `7200000` |
| `nacos.remote.server.grpc.cluster.keep-alive-timeout` | 集群间 gRPC keepalive 超时，单位毫秒。 | `20000` |
| `nacos.remote.server.grpc.cluster.permit-keep-alive-time` | 集群间 gRPC 允许的最小 keepalive 间隔，单位毫秒。 | `300000` |
| `remote.executor.times.of.processors(-D)` | 服务端请求处理线程数相对 CPU 核数的倍数。 | `16` |
| `remote.executor.queue.size(-D)` | 服务端请求处理线程池队列大小。 | `16384` |

## Distro 与 Raft

Distro 和 Raft 是 Nacos 内部一致性协议参数。除非已经定位到协议层瓶颈或由维护者建议，生产环境不建议随意调整。

### Distro

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| `nacos.core.protocol.distro.data.sync.delayMs` | 数据同步延迟，单位毫秒。相同数据在延迟窗口内会合并同步。 | `1000` |
| `nacos.core.protocol.distro.data.sync.timeoutMs` | 单次数据同步超时，单位毫秒。 | `3000` |
| `nacos.core.protocol.distro.data.sync.retryDelayMs` | 同步失败后的重试延迟，单位毫秒。 | `3000` |
| `nacos.core.protocol.distro.data.verify.intervalMs` | 已同步数据校验间隔，单位毫秒。 | `5000` |
| `nacos.core.protocol.distro.data.verify.timeoutMs` | 单次数据校验超时，单位毫秒。 | `3000` |
| `nacos.core.protocol.distro.data.load.retryDelayMs` | 启动加载快照失败后的重试延迟，单位毫秒。 | `30000` |

### Raft

Raft 参数通过 `nacos.core.protocol.raft.data.*` 配置。`data` 是当前代码中 `RaftConfig` 的配置映射字段，不应省略。

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| `nacos.core.protocol.raft.data.election_timeout_ms` | 选举超时时间，单位毫秒。 | `5000` |
| `nacos.core.protocol.raft.data.snapshot_interval_secs` | 快照执行周期，单位秒。 | `1800` |
| `nacos.core.protocol.raft.data.core_thread_num` | Raft 内部工作线程数。 | `8` |
| `nacos.core.protocol.raft.data.cli_service_thread_num` | Raft 业务请求处理线程数。 | `4` |
| `nacos.core.protocol.raft.data.read_index_type` | 线性读策略。 | `ReadOnlySafe` |
| `nacos.core.protocol.raft.data.rpc_request_timeout_ms` | Raft RPC 请求超时，单位毫秒。 | `5000` |
| `nacos.core.protocol.raft.data.max_byte_count_per_rpc` | 单次 snapshot copy RPC 最大字节数。 | `131072` |
| `nacos.core.protocol.raft.data.max_entries_size` | Leader 向 Follower 单次发送的最大日志条数。 | `1024` |
| `nacos.core.protocol.raft.data.max_body_size` | 发送日志的最大 body 大小。 | `524288` |
| `nacos.core.protocol.raft.data.max_append_buffer_size` | 日志写入缓冲区大小。 | `262144` |
| `nacos.core.protocol.raft.data.max_election_delay_ms` | 选举随机延迟最大值，单位毫秒。 | `1000` |
| `nacos.core.protocol.raft.strict-mode` | Raft 启动校验严格模式。开启后，Raft 无法选举时 readiness 会返回失败。 | `false` |

## 配置中心

配置中心的日常使用见[配置中心手册](../user/config/overview.md)。

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| `nacos.config.push.maxRetryTime` | 配置变更推送最大重试次数。 | `50` |
| `nacos.config.retention.days` | 配置历史保留天数。 | `30` |
| `nacos.config.search.max_capacity` | 内容搜索任务队列容量上限。 | `4` |
| `nacos.config.search.max_thread` | 内容搜索线程数上限。 | `2` |
| `nacos.config.search.wait_timeout` | 内容搜索等待超时，单位毫秒。 | `8000` |
| `nacos.config.derby.ops.enabled` | 使用 Derby 时是否开启 Derby 运维接口。 | `false` |
| `nacos.persistence.sql.derby.limit.enabled` | 使用 Derby 时是否限制可执行 SQL 范围。 | `true` |
| `nacos.config.cache.type` | 配置缓存实现类型。 | `nacos` |
| `nacos.config.history.clear.name` | 配置历史清理实现名称。 | `nacos` |

## 服务发现

服务发现的日常使用见[注册中心手册](../user/naming/overview.md)。

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| `nacos.naming.data.warmup` | 是否在启动时等待服务发现数据预热。开启后 readiness 可能在预热完成前失败。 | `false` |
| `nacos.naming.expireInstance` | 是否自动摘除过期临时实例。 | `true` |
| `nacos.naming.empty-service.auto-clean` | 是否自动清理空服务。 | `true` |
| `nacos.naming.empty-service.clean.initial-delay-ms` | 空服务清理首次延迟，单位毫秒。 | `50000` |
| `nacos.naming.empty-service.clean.period-time-ms` | 空服务清理周期，单位毫秒。 | `30000` |
| `nacos.naming.clean.empty-service.interval` | 空服务清理间隔，单位毫秒。 | `60000` |
| `nacos.naming.clean.empty-service.expired-time` | 空服务过期时间，单位毫秒。 | `60000` |
| `nacos.naming.clean.expired-metadata.interval` | 过期元数据清理间隔，单位毫秒。 | `5000` |
| `nacos.naming.clean.expired-metadata.expired-time` | 过期元数据保留时间，单位毫秒。 | `60000` |
| `nacos.naming.client.expired.time` | 临时 Client 数据过期时间，单位毫秒。 | `180000` |
| `nacos.naming.push.pushTaskDelay` | 服务推送延迟，单位毫秒。 | `500` |
| `nacos.naming.push.pushTaskTimeout` | 服务推送执行超时，单位毫秒。 | `5000` |
| `nacos.naming.push.pushTaskRetryDelay` | 服务推送失败重试延迟，单位毫秒。 | `1000` |
| `nacos.naming.service.metadata.length` | 服务元数据总长度限制。 | `1024` |

## 参数校验

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| `nacos.core.param.check.enabled` | 是否开启服务端参数校验。规则见[参数校验](../user/parameters-check.md)。 | `true` |
| `nacos.core.param.check.checker` | 参数校验器名称。默认使用内置校验器。 | `default` |

## 鉴权与可见性

鉴权配置应优先阅读[权限校验](./auth.mdx)和[OIDC/OAuth2 认证](./oidc-auth.md)。可见性插件见[可见性插件](../../plugin/visibility-plugin.md)。

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| `nacos.plugin.auth.type` | 启动时选择鉴权插件；`nacos.core.auth.system.type` 是历史 alias。 | `nacos` |
| `nacos.core.auth.enabled` | 是否开启通用鉴权系统和 Open API 鉴权，包括 Client/Open HTTP API 及 SDK/gRPC 请求。 | `false` |
| `nacos.core.auth.admin.enabled` | 是否开启 Admin API scope 鉴权；除 `/v3/admin/*` 外，也包括标记为 `ADMIN_API` 的插件自有端点。 | `true` |
| `nacos.core.auth.console.enabled` | 是否开启 `/v3/console/*` Console API 和登录鉴权。 | `true` |
| `nacos.plugin.auth.nacos.caching.enabled` | 是否缓存鉴权信息；`nacos.core.auth.caching.enabled` 是历史 alias。开启后权限变更会有短暂延迟。 | `true` |
| `nacos.core.auth.server.identity.key` | Server 间内部请求的身份标识 key。Nacos 3.2.4 起也用于 JRaft 原生 gRPC；集群所有节点必须配置相同的非空值。 | 空 |
| `nacos.core.auth.server.identity.value` | Server 间内部请求的身份标识 value。Nacos 3.2.4 起也用于 JRaft 原生 gRPC；集群所有节点必须配置相同的非空值。 | 空 |
| `nacos.security.ignore.urls` | 鉴权忽略路径。该参数属于历史兼容项，未来可能废弃。 | 发行包默认值 |
| `nacos.plugin.auth.nacos.token.cache.enable` | 默认鉴权插件 token 缓存；旧 `nacos.core.auth.plugin.nacos.token.cache.enable` 是 alias。 | `false` |
| `nacos.plugin.auth.nacos.token.expire.seconds` | 默认鉴权插件 token 过期秒数；`nacos.core.auth.plugin.nacos.token.expire.seconds` 是历史 alias。 | `18000` |
| `nacos.plugin.auth.nacos.token.secret.key` | JWT 签名密钥，敏感且 RESTART；`nacos.core.auth.plugin.nacos.token.secret.key` 是历史 alias。 | 空 |
| `nacos.plugin.auth.nacos.anonymous.ai.enabled` | 是否允许显式 opt-in 的 AI 端点接受匿名读取；`nacos.core.auth.nacos.anonymous.ai.enabled` 是历史 alias。显式携带空或无效凭据不会回退为匿名。 | `false` |
| `nacos.plugin.visibility.enabled` | 是否开启可见性插件。 | `true` |
| `nacos.plugin.visibility.type` | 废弃的 `RESTART` selector，仍决定 AI 领域请求的实现，并在没有持久化状态时参与初始化实现状态。 | `nacos` |
| `nacos.plugin.visibility.{pluginName}.enabled` | 实现的静态初始状态；持久化插件状态优先。默认 `nacos` 实现会复用默认鉴权插件用户信息。 | `nacos` 为 `true` |

:::caution[JRaft Server identity]
从 Nacos 3.2.4 起，JRaft 会独立校验上述 Server identity，即使 `nacos.core.auth.enabled=false` 也不会跳过。升级或部署集群前，必须在所有节点配置一致的非空 key 和 value。
:::

### LDAP、OIDC 与 OAuth2

LDAP 与 OIDC/OAuth2 是可选插件。下表列出标准前缀，具体 definitions、alias、默认值和 effectMode 见[鉴权插件](../../plugin/auth-plugin.md)。

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| `nacos.plugin.auth.ldap.{itemKey}` | LDAP definitions：`url`、`base-dn`、`timeout`、`user-dn`、`password`、`filter-prefix`、`case-sensitive`、`ignore-partial-result-exception`。 | 见[鉴权插件文档](../../plugin/auth-plugin.md) |
| `nacos.plugin.auth.oidc.{itemKey}` | OIDC definitions，包括 issuer/client、JWT/JWKS、claim、外部授权和严格校验选项。当前只实现 `jwt`/JWKS，不支持 introspection。 | 见[鉴权插件文档](../../plugin/auth-plugin.md) |

## 插件参数

插件体系说明见[插件化概览](../../plugin/overview.md)。

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| `nacos.custom.environment.enabled` | 是否启用自定义环境变量插件。 | `false` |
| `nacos.plugin.control.type` | 启动时选择流量防护实现；`nacos.plugin.control.manager.type` 是历史 alias。 | 空（no-limit） |
| `nacos.plugin.control.rule.local.basedir` | 本地流量防护规则目录。 | `${nacos.home}` |
| `nacos.plugin.control.rule.external.storage` | 外部规则存储类型，需要自行实现。 | 空 |
| `nacos.plugin.{pluginType}.{pluginName}.enabled` | 非互斥实现的启动初始状态；持久化/本地 state 可覆盖。`auth`、`datasource-dialect`、`control` 等互斥类型应使用 selector 选择实现。 | 由实现和类型策略决定 |
| `nacos.plugin.{pluginType}.{pluginName}.{itemKey}` | 实现 definitions 的标准配置键。 | 由 definition 决定 |

配置变更插件的历史 `nacos.core.config.plugin.{pluginName}.*` 只用于旧二进制兼容；Nacos Server 不内置 webhook、whitelist 或 fileformatcheck 实现。新实现使用 `nacos.plugin.config-change.{pluginName}.{itemKey}`。

## Istio 与 Prometheus 服务发现

这两类能力属于长期存在的生态融合能力，使用方式见[生态融合概览](../../ecology/overview.md)。

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| `nacos.extension.naming.istio.enabled` | 是否加载 Istio 模块。 | `false` |
| `nacos.istio.mcp.server.enabled` | 是否开启 Istio MCP server。 | `false` |
| `nacos.istio.mcp.server.port` | Istio MCP server 端口。 | `18848` |
| `nacos.istio.server.full` | 是否使用全量推送。 | `true` |
| `nacos.istio.debounce.max` | Istio 推送防抖最大等待时间，单位毫秒。 | `5000` |
| `nacos.istio.debounce.after` | Istio 推送防抖等待时间，单位毫秒。 | `100` |
| `nacos.istio.domain.suffix` | Istio 域名后缀。 | `nacos` |
| `nacos.prometheus.metrics.enabled` | 是否开启 Prometheus 服务发现辅助接口。 | `false` |

## AI 管理中心

AI 管理中心的使用方式见[AI 管理中心概述](../user/ai/ai-registry-overview.md)。下面参数只负责模块开关、协议适配、导入和发布 Pipeline。

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| `nacos.extension.ai.enabled` | 是否启用 AI 模块。设为 `false` 时不加载 AI 模块及其控制台入口，Config 和 Naming 不受影响；`microservice` 功能模式下无论该值为何都不会加载 AI 模块。 | `true` |
| `nacos.ai.mcp.registry.enabled` | 是否启用官方 MCP Registry 协议适配。开启后会使用 `nacos.ai.registry.port` 暴露独立端口。 | `false` |
| `nacos.ai.skill.registry.enabled` | 是否启用 Skill Registry 协议适配。开启后会使用 `nacos.ai.registry.port` 暴露独立端口。 | `false` |
| `nacos.ai.registry.port` | AI Registry 协议适配端口。 | `9080` |
| `nacos.ai.mcp.registry.port` | 旧参数名，已废弃。请改用 `nacos.ai.registry.port`。 | `9080` |
| `nacos.plugin.ai-pipeline.enabled` | AI Pipeline 动态模块总开关；关闭时延迟加载类型。 | `true` |
| `nacos.plugin.ai-pipeline.type` | 历史启动链，仅用于没有持久化状态时初始化节点状态。 | 空 |
| `nacos.plugin.ai-pipeline.skill-scanner.{itemKey}` | `skill-scanner` definitions；只有 `order` 为 RUNTIME。 | 见 [AI Pipeline 插件文档](../../plugin/ai-pipeline-plugin.md) |
| `nacos.plugin.ai-pipeline.skill-spector.{itemKey}` | `skill-spector` definitions；只有 `order` 为 RUNTIME。 | 见 [AI Pipeline 插件文档](../../plugin/ai-pipeline-plugin.md) |
| `nacos.ai.skill.auto-publish-after-review.enabled` | Skill 审核通过后是否自动发布版本。 | `false` |
| `nacos.plugin.ai-resource-import.enabled` | AI Resource Import 模块总开关；标准 key 和 alias 都未配置时仍默认开启，只有显式 `false` 才关闭。发行包也显式将标准 key 设为 `true`。 | `true` |
| `nacos.plugin.ai-resource-import.{pluginName}.enabled` | 每个固定来源的启动初始状态。 | `mcp-official`/`skills-sh` 开启，其余关闭 |
| `nacos.plugin.ai-resource-import.{pluginName}.{itemKey}` | 来源 definitions；endpoint/网络开关为 RESTART，其余展示和限制为 RUNTIME。 | 见 [AI 资源导入插件文档](../../plugin/ai-resource-import-plugin.md) |
| `nacos.ai.resource.import.legacy-mcp-api-enabled` | 旧 MCP 导入 API 兼容开关；Nacos 3.2.4 起不再识别，请改用 `nacos.core.api.compatibility.enabled`。 | 不适用 |
| `nacos.ai.resource.import.allow-user-url` | 通过共享兼容开关重新开启旧 MCP 直接 URL 导入后，是否允许抓取用户提供的 URL。 | `false` |
| `nacos.console.ai.mcp.import.enabled` | 是否允许 Console 的 `GET /v3/console/ai/mcp/importToolsFromMcp` 发起出站 MCP 连接。设为 `false` 会关闭全部此类 tools 导入。 | `true` |
| `nacos.console.ai.mcp.import.allowed-private-addresses` | Console MCP tools 导入允许访问的私网或本地 IP/CIDR 白名单，多个条目用逗号分隔；公网地址不需要加入。 | 空 |

旧 `nacos.plugin.ai.importer.*`、`nacos.ai.resource.import.sources[N].*`、preset 和复制 endpoint 模型已移除或只保留明确列出的迁移 alias，不能用于新部署。详见 [AI 资源导入插件](../../plugin/ai-resource-import-plugin.md)。

:::note
`nacos.console.ai.mcp.import.allowed-private-addresses` 只接受 IPv4/IPv6 地址或 CIDR，不接受域名，例如 `192.168.0.0/16,10.0.0.8`。目标域名解析出的每一个私网或本地地址都必须命中白名单；任一非法白名单条目都会阻止请求。独立部署 Console 时，需要在每个 Console 实例上配置并重启。
:::

## 实验性功能

实验性功能不承诺长期稳定行为。使用前请阅读[实验性功能概览](../../experimental/overview.md)。

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| `nacos.k8s.sync.enabled` | 是否开启内置 K8s sync 实验能力。 | `false` |
| `nacos.k8s.sync.outsideCluster` | 是否从 Kubernetes 集群外访问 API Server。 | `false` |
| `nacos.k8s.sync.kubeConfig` | 集群外访问时使用的 kubeconfig 路径。 | `/.kube/config` |

## 兼容与迁移参数

这些参数用于升级、迁移或兼容旧行为。它们不代表新系统推荐模型。更多背景见[兼容与废弃](./compatibility-and-deprecation.md)。

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| `nacos.core.api.compatibility.enabled` | 是否在迁移窗口内临时重新开启显式接入兼容门禁的废弃 v3 Pipeline 和 MCP 导入 API。 | `false` |
| `nacos.core.api.compatibility.client.enabled` | 是否开启客户端 API 兼容能力。 | `true` |
| `nacos.core.api.compatibility.admin.enabled` | 是否开启 Admin API 兼容能力。 | `false` |
| `nacos.core.api.compatibility.console.enabled` | 是否开启 Console API 兼容能力。 | `false` |

:::note
鉴权开关和 API 兼容开关不是同一类参数。`nacos.core.auth.admin.enabled` 控制 Admin API 是否鉴权；`nacos.core.api.compatibility.admin.enabled` 控制 Admin API 兼容行为是否接受请求。共享的 `nacos.core.api.compatibility.enabled` 只重新开启显式接入门禁的少量废弃 v3 API，且不会关闭其原有鉴权，也不替代 `nacos-api-legacy-adapter`。旧版 v1/v2 HTTP API 从 Nacos 3.2.0 起已从主发行包移除，需要迁移到 v3 API 或临时使用 legacy adapter。
:::

:::caution[Nacos 3.3 配置迁移开关移除]
`nacos.config.gray.compatible.model`、`nacos.gray.migrate.executor.multi`、`nacos.config.namespace.compatible.mode`、`nacos.namespace.migrate.retry.times` 和 `nacos.namespace.migrate.batch.size` 已不再是 Nacos 3.3 服务端参数。3.3 不再自动迁移 3.0 之前的空 tenant/default namespace 存储，也不再自动迁移旧 beta/tag 灰度表。受影响部署需要在升级前自行完成数据迁移，详见[升级手册](./upgrading.mdx#217-配置中心兼容迁移移除-nacos-330)。
:::

## 启动脚本和镜像变量

发行包 `startup.sh` 支持以下常用启动参数：

| 启动参数 | 说明 | 对应配置 |
| --- | --- | --- |
| `-m standalone` | 单机模式启动。 | `nacos.standalone=true` |
| `-m cluster` | 集群模式启动。 | `nacos.standalone=false` |
| `-f config` | 只启动配置中心相关模块。 | `nacos.functionMode=config` |
| `-f naming` | 只启动服务发现相关模块。 | `nacos.functionMode=naming` |
| `-f microservice` | 仅启动配置中心和服务发现模块，不加载 AI 模块（Nacos 3.2.2+）。 | `nacos.functionMode=microservice` |
| `-f ai` | 启动 AI 相关模块。 | `nacos.functionMode=ai` |
| `-c` | 设置集群成员列表。 | `nacos.member.list` |
| `-p embedded` | 集群模式下使用嵌入式存储。 | `embeddedStorage=true` |
| `-d` | 设置部署形态。 | `nacos.deployment.type` |

使用官方容器镜像时，常见环境变量包括 `MODE`、`NACOS_SERVERS`、`PREFER_HOST_MODE`、`NACOS_AUTH_ENABLE`、`NACOS_AUTH_ADMIN_ENABLE`、`NACOS_AUTH_CONSOLE_ENABLE`、`NACOS_AUTH_TOKEN`、`NACOS_AUTH_IDENTITY_KEY`、`NACOS_AUTH_IDENTITY_VALUE`、`NACOS_CONSOLE_PORT` 等。不同镜像版本的转换脚本可能不同，生产部署建议挂载完整 `application.properties`，并以镜像仓库或 Helm Chart 的说明为准。
