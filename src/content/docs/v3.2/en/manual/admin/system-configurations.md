---
title: System Parameters
keywords: [Nacos, system parameters, configuration, application.properties]
description: Common system parameters for Nacos Server, Console, plugins, AI Registry, and compatibility capabilities.
sidebar:
  order: 6
---

# System Parameters

This page summarizes common Nacos 3.2.x server-side parameters. The main source is `${nacos.home}/conf/application.properties` in the Nacos distribution, with extra notes from current configuration code.

For production deployments, read [Deployment Best Practices](./deployment/deployment-best-practices.md) first, then use this page to confirm specific properties.

## Where to Configure

The main Nacos Server configuration file is `${nacos.home}/conf/application.properties`. The startup script also adds:

```shell
--spring.config.additional-location=file:${BASE_DIR}/conf/
```

The same property can come from the configuration file, JVM `-D` options, or the startup script. In general, JVM options have higher priority than the configuration file. Properties marked with `(-D)` are usually set through the startup script or JVM options.

:::caution
Nacos is an internal microservice component and should not be exposed to the public Internet. Console, auth, metrics, plugins, and AI Registry features should also run inside trusted internal networks with network isolation, access control, and audit protection.
:::

## Basic Startup

| Property | Description | Default |
| --- | --- | --- |
| `nacos.home(-D)` | Nacos home directory. | installation directory |
| `nacos.standalone(-D)` | Whether to start in standalone mode. `startup.sh -m standalone` sets this property. | `false` |
| `nacos.functionMode(-D)` | Function mode. `all` starts all available modules; `config` and `naming` start only Config and Naming, respectively; `microservice` starts Config and Naming without the AI module; `ai` starts AI together with its Config and Naming dependencies. | `all` |
| `nacos.deployment.type(-D)` | Deployment type. The startup script uses `merged` by default. | `merged` |
| `nacos.server.main.port` | Main Nacos Server port. | `8848` |
| `nacos.server.contextPath` | HTTP context path of Nacos Server. | `/nacos` |
| `spring.config.additional-location` | Extra configuration file locations. Separate multiple locations with commas. | `${nacos.home}/conf/` |
| `server.error.include-message` | Whether Spring Boot error responses include the message field. | `ALWAYS` |
| `server.max-http-request-header-size` | HTTP request header size limit set by the startup script. | `524288` |

## Network and Node Address

| Property | Description | Default |
| --- | --- | --- |
| `nacos.server.ip(-D)` | Explicit local server IP. It has higher priority than auto detection and `nacos.inetutils.ip-address`. | empty |
| `nacos.inetutils.ip-address` | Explicit local IP, commonly used in multi-NIC or container environments. | empty |
| `nacos.inetutils.prefer-hostname-over-ip` | Prefer hostname as node address. If enabled, `cluster.conf` should also use resolvable hostnames. | `false` |
| `nacos.remote.grpc.listen.ip(-D)` | Listen IP for gRPC ports. If unset, gRPC usually listens on all interfaces. | empty |

## Database

Nacos supports Derby, MySQL, PostgreSQL, Oracle, and custom database types through datasource dialect plugins. For setup, community plugins, and Oracle version requirements, see [Datasource Plugin](../../plugin/datasource-plugin.md).

| Property | Description | Default |
| --- | --- | --- |
| `spring.sql.init.platform` | Database type. Supported values include `derby`, `mysql`, `postgresql`, `oracle`, or a custom dialect plugin type. `oracle` requires Oracle 12c or later. | empty |
| `db.num` | Number of database URLs. | `0` |
| `db.url.0`, `db.url.1` | JDBC URLs. Use indexes for multiple URLs. | empty |
| `db.user`, `db.password` | Shared database credentials for all URLs. | empty |
| `db.user.0`, `db.password.0` | Credentials for a specific indexed URL. Use them when different URLs need different credentials. | empty |
| `db.pool.config.*` | HikariCP properties, such as `db.pool.config.connectionTimeout`. | HikariCP defaults |
| `nacos.plugin.datasource.log.enabled` | Whether to print datasource plugin logs. | `true` |

:::note
`spring.datasource.platform` is a legacy compatibility property. New deployments should use `spring.sql.init.platform`.
:::

## Web and Console

Nacos 3.x separates the Server and Console ports by default. Server APIs use `8848` by default, and the new Console uses `8080`. See [Console Manual](./console.md) for usage.

| Property | Description | Default |
| --- | --- | --- |
| `nacos.console.port` | Console port. | `8080` |
| `nacos.console.contextPath` | Console context path. | empty |
| `nacos.console.remote.server.context-path` | Server context path used by an independent Console deployment. | `/nacos` |
| `nacos.console.ui.enabled` | Whether to enable Console UI. | `true` |
| `nacos.console.ui.default` | Default Console UI. Valid values are `next` and `legacy`. | `next` |
| `spring.servlet.multipart.max-file-size` | Single upload file size limit for Console, such as Skill zip files. | `10MB` |
| `spring.servlet.multipart.max-request-size` | Total upload request size limit for Console. | `10MB` |
| `server.servlet.encoding.charset` | Servlet encoding. | `UTF-8` |

### Console CORS

| Property | Description | Default |
| --- | --- | --- |
| `nacos.console.cors.allow-credentials` | Whether credentials such as cookies, Authorization headers, and TLS client certificates are allowed. | `true` |
| `nacos.console.cors.allowed-headers` | Allowed headers. Empty means all headers are allowed. | empty |
| `nacos.console.cors.max-age` | CORS preflight cache time in seconds. | `18000` |
| `nacos.console.cors.allowed-methods` | Allowed HTTP methods. Empty means all methods are allowed. | empty |
| `nacos.console.cors.allowed-origins` | Allowed origins. Empty means all origin patterns are allowed. | empty |

## Access Log and Metrics

For metrics exposure and alerting suggestions, see [Monitoring Manual](./monitor.md).

| Property | Description | Default |
| --- | --- | --- |
| `server.tomcat.accesslog.enabled` | Whether to enable access logs. | `true` |
| `server.tomcat.accesslog.max-days` | Access log retention days. | `30` |
| `server.tomcat.accesslog.pattern` | Access log pattern. | distribution default |
| `server.tomcat.basedir` | Tomcat working directory and access log base directory. | `file:.` |
| `management.endpoints.web.exposure.include` | Exposed Actuator endpoints. Add `prometheus` to expose Prometheus metrics. | empty |
| `management.metrics.export.elastic.enabled` | Whether to enable the Elastic metrics exporter. | `false` |
| `management.metrics.export.influx.enabled` | Whether to enable the Influx metrics exporter. | `false` |
| `nacos.core.monitor.topn.enabled` | Whether to enable TopN metrics. | `true` |
| `nacos.core.monitor.topn.count` | TopN item count. | `10` |
| `nacos.core.monitor.topn.internalMs` | TopN collection interval in milliseconds. | `60000` |

## Cluster Member Discovery

| Property | Description | Default |
| --- | --- | --- |
| `nacos.member.list(-D)` | Cluster member list. The startup script `-c` option sets this JVM property. It can be used when `cluster.conf` does not exist. | empty |
| `nacos.member-change-event.queue.size` | Queue size for cluster member change events. | `128` |
| `nacos.core.member.lookup.type` | Member lookup type. Valid values are `file` and `address-server`. | `file` |
| `nacos.core.address-server.retry` | Retry count when initializing from the address server. | `5` |
| `address.server.domain` | Address server domain. | `jmenv.tbsite.net` |
| `address.server.port` | Address server port. | `8080` |
| `address.server.url` | Address server request path. | `/nacos/serverlist` |
| `nacos.core.member.meta.site` | Node site metadata. | empty |
| `nacos.core.member.meta.adweight` | Node weight metadata. | empty |
| `nacos.core.member.meta.weight` | Node weight metadata. | empty |

## gRPC

| Property | Description | Default |
| --- | --- | --- |
| `nacos.remote.server.grpc.sdk.max-inbound-message-size` | Maximum inbound SDK gRPC request size in bytes. | `10485760` |
| `nacos.remote.server.grpc.sdk.keep-alive-time` | SDK gRPC keepalive interval in milliseconds. | `7200000` |
| `nacos.remote.server.grpc.sdk.keep-alive-timeout` | SDK gRPC keepalive timeout in milliseconds. | `20000` |
| `nacos.remote.server.grpc.sdk.permit-keep-alive-time` | Minimum keepalive interval clients are permitted to configure, in milliseconds. | `300000` |
| `nacos.remote.server.grpc.cluster.max-inbound-message-size` | Maximum inbound cluster gRPC request size in bytes. | `10485760` |
| `nacos.remote.server.grpc.cluster.keep-alive-time` | Cluster gRPC keepalive interval in milliseconds. | `7200000` |
| `nacos.remote.server.grpc.cluster.keep-alive-timeout` | Cluster gRPC keepalive timeout in milliseconds. | `20000` |
| `nacos.remote.server.grpc.cluster.permit-keep-alive-time` | Minimum keepalive interval for cluster gRPC, in milliseconds. | `300000` |
| `remote.executor.times.of.processors(-D)` | Multiplier of CPU cores for the server request executor size. | `16` |
| `remote.executor.queue.size(-D)` | Queue size of the server request executor. | `16384` |

## Distro and Raft

Distro and Raft are internal consistency protocol parameters. Do not tune them in production unless you have diagnosed a protocol bottleneck or have maintainer guidance.

### Distro

| Property | Description | Default |
| --- | --- | --- |
| `nacos.core.protocol.distro.data.sync.delayMs` | Data sync delay in milliseconds. Updates for the same data key are merged within the delay window. | `1000` |
| `nacos.core.protocol.distro.data.sync.timeoutMs` | Timeout for one data sync in milliseconds. | `3000` |
| `nacos.core.protocol.distro.data.sync.retryDelayMs` | Retry delay after sync failure in milliseconds. | `3000` |
| `nacos.core.protocol.distro.data.verify.intervalMs` | Verification interval for synced data in milliseconds. | `5000` |
| `nacos.core.protocol.distro.data.verify.timeoutMs` | Timeout for one data verification in milliseconds. | `3000` |
| `nacos.core.protocol.distro.data.load.retryDelayMs` | Retry delay after snapshot load failure during startup in milliseconds. | `30000` |

### Raft

Raft properties use `nacos.core.protocol.raft.data.*`. The `data` segment is the current `RaftConfig` map field and should not be omitted.

| Property | Description | Default |
| --- | --- | --- |
| `nacos.core.protocol.raft.data.election_timeout_ms` | Election timeout in milliseconds. | `5000` |
| `nacos.core.protocol.raft.data.snapshot_interval_secs` | Snapshot interval in seconds. | `1800` |
| `nacos.core.protocol.raft.data.core_thread_num` | Internal Raft worker thread count. | `8` |
| `nacos.core.protocol.raft.data.cli_service_thread_num` | Raft business request thread count. | `4` |
| `nacos.core.protocol.raft.data.read_index_type` | Linear read strategy. | `ReadOnlySafe` |
| `nacos.core.protocol.raft.data.rpc_request_timeout_ms` | Raft RPC request timeout in milliseconds. | `5000` |
| `nacos.core.protocol.raft.data.max_byte_count_per_rpc` | Maximum bytes for one snapshot copy RPC. | `131072` |
| `nacos.core.protocol.raft.data.max_entries_size` | Maximum log entries sent from leader to follower in one batch. | `1024` |
| `nacos.core.protocol.raft.data.max_body_size` | Maximum body size for sending logs. | `524288` |
| `nacos.core.protocol.raft.data.max_append_buffer_size` | Append buffer size for logs. | `262144` |
| `nacos.core.protocol.raft.data.max_election_delay_ms` | Maximum random election delay in milliseconds. | `1000` |
| `nacos.core.protocol.raft.strict-mode` | Strict startup validation. If enabled, readiness fails when Raft cannot elect a leader. | `false` |

## Config

For daily usage, see [Config Center Manual](../user/config/overview.md).

| Property | Description | Default |
| --- | --- | --- |
| `nacos.config.push.maxRetryTime` | Maximum retry count for config change push. | `50` |
| `nacos.config.retention.days` | Config history retention days. | `30` |
| `nacos.config.search.max_capacity` | Queue capacity for content search tasks. | `4` |
| `nacos.config.search.max_thread` | Thread count limit for content search. | `2` |
| `nacos.config.search.wait_timeout` | Content search wait timeout in milliseconds. | `8000` |
| `nacos.config.derby.ops.enabled` | Whether Derby ops APIs are enabled when Derby is used. | `false` |
| `nacos.persistence.sql.derby.limit.enabled` | Whether SQL execution is limited when Derby is used. | `true` |
| `nacos.config.cache.type` | Config cache implementation type. | `nacos` |
| `nacos.config.history.clear.name` | Config history cleaner implementation name. | `nacos` |

## Naming

For daily usage, see [Naming Manual](../user/naming/overview.md).

| Property | Description | Default |
| --- | --- | --- |
| `nacos.naming.data.warmup` | Whether to wait for naming data warmup during startup. Readiness may fail until warmup is complete. | `false` |
| `nacos.naming.expireInstance` | Whether expired ephemeral instances are removed automatically. | `true` |
| `nacos.naming.empty-service.auto-clean` | Whether empty services are cleaned automatically. | `true` |
| `nacos.naming.empty-service.clean.initial-delay-ms` | Initial delay for empty service cleanup in milliseconds. | `50000` |
| `nacos.naming.empty-service.clean.period-time-ms` | Empty service cleanup period in milliseconds. | `30000` |
| `nacos.naming.clean.empty-service.interval` | Empty service cleanup interval in milliseconds. | `60000` |
| `nacos.naming.clean.empty-service.expired-time` | Empty service expiration time in milliseconds. | `60000` |
| `nacos.naming.clean.expired-metadata.interval` | Expired metadata cleanup interval in milliseconds. | `5000` |
| `nacos.naming.clean.expired-metadata.expired-time` | Expired metadata retention time in milliseconds. | `60000` |
| `nacos.naming.client.expired.time` | Ephemeral client data expiration time in milliseconds. | `180000` |
| `nacos.naming.push.pushTaskDelay` | Naming push delay in milliseconds. | `500` |
| `nacos.naming.push.pushTaskTimeout` | Naming push execution timeout in milliseconds. | `5000` |
| `nacos.naming.push.pushTaskRetryDelay` | Retry delay after naming push failure in milliseconds. | `1000` |
| `nacos.naming.service.metadata.length` | Total service metadata length limit. | `1024` |

## Parameter Validation

| Property | Description | Default |
| --- | --- | --- |
| `nacos.core.param.check.enabled` | Whether server-side parameter validation is enabled. See [Parameter Validation](../user/parameters-check.md). | `true` |
| `nacos.core.param.check.checker` | Parameter checker name. The built-in checker is used by default. | `default` |

## Auth and Visibility

For auth setup, read [Authorization](./auth.mdx) and [OIDC/OAuth2 Authentication](./oidc-auth.md). For visibility, see [Visibility Plugin](../../plugin/visibility-plugin.md).

| Property | Description | Default |
| --- | --- | --- |
| `nacos.core.auth.system.type` | Auth plugin type. The default implementation is `nacos`. LDAP, OIDC/OAuth2, and custom plugins can also be used. | `nacos` |
| `nacos.core.auth.enabled` | Whether SDK/gRPC request authentication is enabled. | `false` |
| `nacos.core.auth.admin.enabled` | Whether `/v3/admin/*` Admin API authentication is enabled. | `true` |
| `nacos.core.auth.console.enabled` | Whether `/v3/console/*` Console API and login authentication are enabled. | `true` |
| `nacos.core.auth.caching.enabled` | Whether auth information is cached. Permission updates may have a short delay when enabled. | `true` |
| `nacos.core.auth.server.identity.key` | Identity key for internal server-to-server requests. Starting with Nacos 3.2.4, it is also used by native JRaft gRPC. Configure the same non-empty value on every cluster member. | empty |
| `nacos.core.auth.server.identity.value` | Identity value for internal server-to-server requests. Starting with Nacos 3.2.4, it is also used by native JRaft gRPC. Configure the same non-empty value on every cluster member. | empty |
| `nacos.security.ignore.urls` | Auth ignored URLs. This is a legacy compatibility property and may be deprecated in the future. | distribution default |
| `nacos.core.auth.plugin.nacos.token.cache.enable` | Whether the default auth plugin caches tokens. | `false` |
| `nacos.core.auth.plugin.nacos.token.expire.seconds` | Token expiration time for the default auth plugin, in seconds. | `18000` |
| `nacos.core.auth.plugin.nacos.token.secret.key` | JWT signing secret for the default auth plugin. Use a Base64 string from an original secret of at least 32 characters. | empty |
| `nacos.core.auth.nacos.anonymous.ai.enabled` | Whether anonymous AI resource reads are allowed. Currently mainly applies to Skill and AgentSpec. | `false` |
| `nacos.plugin.visibility.enabled` | Whether the visibility plugin is enabled. | `true` |
| `nacos.plugin.visibility.type` | Visibility plugin type. The default `nacos` implementation reuses default auth plugin user information. | `nacos` |

:::caution[Nacos 3.2.4 cluster upgrades]
JRaft validates this server identity independently, even when `nacos.core.auth.enabled=false`. Before upgrading, configure the same non-empty key and value on every member. See the [Upgrade Manual](./upgrading.mdx) for rolling-upgrade and rollback constraints.
:::

### LDAP, OIDC, and OAuth2

LDAP is maintained as an optional plugin starting from Nacos 3.2. OIDC/OAuth2 is also plugin based. Before using these properties, confirm that the corresponding plugin is included in the distribution or placed in the plugin directory.

| Property | Description | Default |
| --- | --- | --- |
| `nacos.core.auth.ldap.url` | LDAP server URL. | empty |
| `nacos.core.auth.ldap.basedc` | LDAP base DN. | empty |
| `nacos.core.auth.ldap.userDn` | LDAP admin user DN. | empty |
| `nacos.core.auth.ldap.password` | LDAP admin password. | empty |
| `nacos.core.auth.ldap.userdn` | Login user DN template. `{0}` is replaced with the username. | empty |
| `nacos.core.auth.ldap.filter.prefix` | User filter prefix. | `uid` |
| `nacos.core.auth.ldap.case.sensitive` | Whether usernames are case-sensitive. | `true` |
| `nacos.core.auth.ldap.ignore.partial.result.exception` | Whether LDAP partial result exceptions are ignored. | `false` |
| `nacos.core.auth.plugin.oidc.issuer-uri` | OIDC issuer URI for auto-discovery. | empty |
| `nacos.core.auth.plugin.oidc.client-id` | OIDC client id. | empty |
| `nacos.core.auth.plugin.oidc.client-secret` | OIDC client secret. | empty |
| `nacos.core.auth.plugin.oidc.scope` | OIDC scopes. | `openid` |
| `nacos.core.auth.plugin.oidc.token-validation-method` | Token validation method. Valid values include `jwt` and `introspection`. | empty |
| `nacos.core.auth.plugin.oidc.jwks-cache-ttl-seconds` | JWKS cache TTL in seconds. | empty |
| `nacos.core.auth.plugin.oidc.username-claim` | Username claim. | `sub` |
| `nacos.core.auth.plugin.oidc.roles-claim` | Roles claim. | empty |
| `nacos.core.auth.plugin.oidc.admin-role` | Admin role name. | empty |
| `nacos.core.auth.plugin.oidc.auto-create-user` | Whether to auto-create users on first login. | `true` |
| `nacos.core.auth.plugin.oidc.authorization-endpoint` | External authorization endpoint. | empty |
| `nacos.core.auth.plugin.authorization-timeout-ms` | External authorization request timeout in milliseconds. | empty |
| `nacos.core.auth.plugin.oidc.strict-nonce-validation` | Whether strict nonce validation is enforced. | `false` |
| `nacos.core.auth.plugin.oidc.strict-audience-validation` | Whether strict audience validation is enforced. | `false` |

## Plugin Parameters

For the plugin system, see [Plugin Overview](../../plugin/overview.md).

| Property | Description | Default |
| --- | --- | --- |
| `nacos.custom.environment.enabled` | Whether the custom environment plugin is enabled. | `false` |
| `nacos.plugin.control.manager.type` | Traffic control plugin type. Set to `nacos` to use the default implementation. | empty |
| `nacos.plugin.control.rule.local.basedir` | Local directory for traffic control rules. | `${nacos.home}` |
| `nacos.plugin.control.rule.external.storage` | External rule storage type. Requires a custom implementation. | empty |
| `nacos.core.config.plugin.webhook.enabled` | Whether the config change webhook plugin is enabled. | `false` |
| `nacos.core.config.plugin.webhook.url` | Webhook URL. | empty |
| `nacos.core.config.plugin.webhook.contentMaxCapacity` | Maximum webhook payload size in bytes. | `102400` |
| `nacos.core.config.plugin.whitelist.enabled` | Whether the config import suffix whitelist plugin is enabled. | `false` |
| `nacos.core.config.plugin.whitelist.suffixs` | Allowed config import file suffixes. | `xml,text,properties,yaml,html` |
| `nacos.core.config.plugin.fileformatcheck.enabled` | Whether the imported file format check plugin is enabled. | `false` |

## Istio and Prometheus Service Discovery

These are long-standing ecology integration capabilities. See [Ecology Overview](../../ecology/overview.md).

| Property | Description | Default |
| --- | --- | --- |
| `nacos.extension.naming.istio.enabled` | Whether to load the Istio module. | `false` |
| `nacos.istio.mcp.server.enabled` | Whether to enable the Istio MCP server. | `false` |
| `nacos.istio.mcp.server.port` | Istio MCP server port. | `18848` |
| `nacos.istio.server.full` | Whether to use full push. | `true` |
| `nacos.istio.debounce.max` | Maximum debounce wait time for Istio push in milliseconds. | `5000` |
| `nacos.istio.debounce.after` | Debounce wait time for Istio push in milliseconds. | `100` |
| `nacos.istio.domain.suffix` | Istio domain suffix. | `nacos` |
| `nacos.prometheus.metrics.enabled` | Whether to enable the Prometheus service discovery helper API. | `false` |

## AI Registry

For usage, see [AI Registry Overview](../user/ai/ai-registry-overview.md). The properties below control module switches, protocol adapters, importers, and publish pipelines.

| Property | Description | Default |
| --- | --- | --- |
| `nacos.extension.ai.enabled` | Whether the AI module is enabled. When set to `false`, the AI module and its console entries are not loaded, while Config and Naming remain available. The `microservice` function mode does not load the AI module regardless of this value. | `true` |
| `nacos.ai.mcp.registry.enabled` | Whether the official MCP Registry protocol adapter is enabled. When enabled, it exposes an independent port through `nacos.ai.registry.port`. | `false` |
| `nacos.ai.skill.registry.enabled` | Whether the Skill Registry protocol adapter is enabled. When enabled, it exposes an independent port through `nacos.ai.registry.port`. | `false` |
| `nacos.ai.registry.port` | AI Registry protocol adapter port. | `9080` |
| `nacos.ai.mcp.registry.port` | Legacy property name. Deprecated. Use `nacos.ai.registry.port` instead. | `9080` |
| `nacos.plugin.ai-pipeline.enabled` | Whether AI publish pipeline is enabled. If unset, it does not actively disable the pipeline, but no pipeline runs when `type` is empty. | empty |
| `nacos.plugin.ai-pipeline.type` | Pipeline node type, such as `skill-scanner`. Separate multiple types with commas. | empty |
| `nacos.plugin.ai-pipeline.skill-scanner.enabled` | Enablement property passed to the built-in `skill-scanner` node. | empty |
| `nacos.plugin.ai-pipeline.skill-scanner.command` | External Skill scanner command path. | empty |
| `nacos.ai.skill.auto-publish-after-review.enabled` | Whether Skill versions are automatically published after approval. | `false` |
| `nacos.ai.resource.import.enabled` | Whether explicitly configured AI resource import sources are enabled. | `false` |
| `nacos.ai.resource.import.legacy-mcp-api-enabled` | Former compatibility switch for legacy MCP import APIs. It is no longer recognized starting with Nacos 3.2.4; use `nacos.core.api.compatibility.enabled` instead. | not applicable |
| `nacos.ai.resource.import.allow-user-url` | Whether legacy MCP direct URL imports may fetch user-provided URLs after the shared compatibility gate has reopened them. | `false` |
| `nacos.console.ai.mcp.import.enabled` | Whether Console `GET /v3/console/ai/mcp/importToolsFromMcp` may open outbound MCP connections. Set it to `false` to disable all such tool imports. | `true` |
| `nacos.console.ai.mcp.import.allowed-private-addresses` | Private or local IP/CIDR allowlist for Console MCP tool imports. Separate entries with commas. Public addresses do not need to be listed. | empty |
| `nacos.plugin.ai.importer.mcp.official.enabled` | Whether the built-in official MCP Registry import source is enabled. | `true` |
| `nacos.plugin.ai.importer.skills.well-known.enabled` | Whether the Skill well-known import source is enabled. | `false` |
| `nacos.plugin.ai.importer.skills.well-known.url` | Skill well-known registry root URL. | empty |
| `nacos.plugin.ai.importer.skills.skills-sh.enabled` | Whether the `skills.sh` import source is enabled. | `true` |
| `nacos.plugin.ai.importer.<preset>.allow-http` | Whether non-HTTPS endpoints are allowed for a source. Enable only in controlled environments. | `false` |
| `nacos.plugin.ai.importer.<preset>.allow-private-network` | Whether private-network or localhost endpoints are allowed for a source. Enable only in controlled environments. | `false` |

:::note
`nacos.console.ai.mcp.import.allowed-private-addresses` accepts only IPv4/IPv6 addresses or CIDR ranges, not hostnames, for example `192.168.0.0/16,10.0.0.8`. Every private or local address resolved from the target hostname must match the allowlist, and any invalid allowlist entry blocks the request. For a separately deployed Console, configure the property on every Console instance and restart each instance.
:::

## Experimental Features

Experimental features do not promise long-term stable behavior. Read [Experimental Features Overview](../../experimental/overview.md) before using them.

| Property | Description | Default |
| --- | --- | --- |
| `nacos.k8s.sync.enabled` | Whether the built-in K8s sync experimental capability is enabled. | `false` |
| `nacos.k8s.sync.outsideCluster` | Whether the Kubernetes API Server is accessed from outside the cluster. | `false` |
| `nacos.k8s.sync.kubeConfig` | Kubeconfig path used for access outside the cluster. | `/.kube/config` |

## Compatibility and Migration

These properties are used for upgrades, migration, or legacy compatibility. They are not the recommended model for new systems. See [Compatibility and Deprecation](./compatibility-and-deprecation.md) for more context.

| Property | Description | Default |
| --- | --- | --- |
| `nacos.core.api.compatibility.enabled` | Whether deprecated v3 Pipeline and MCP import APIs that explicitly use the compatibility gate are temporarily reopened during migration. | `false` |
| `nacos.core.api.compatibility.client.enabled` | Whether client API compatibility is enabled. | `true` |
| `nacos.core.api.compatibility.admin.enabled` | Whether Admin API compatibility is enabled. | `false` |
| `nacos.core.api.compatibility.console.enabled` | Whether Console API compatibility is enabled. | `false` |
| `nacos.config.gray.compatible.model` | Whether Beta/Tag gray-release compatibility and migration to the new gray model is enabled. | `true` |
| `nacos.gray.migrate.executor.multi` | Thread count for gray config migration. | `8` |
| `nacos.config.namespace.compatible.mode` | Whether empty namespace IDs are migrated to `public`. | `true` |
| `nacos.namespace.migrate.retry.times` | Retry count for namespace migration failures. | `3` |
| `nacos.namespace.migrate.batch.size` | Namespace migration batch size. | `100` |

:::note
Auth switches and API compatibility switches are different. `nacos.core.auth.admin.enabled` controls whether Admin API authentication is enabled. `nacos.core.api.compatibility.admin.enabled` controls whether Admin API compatibility behavior accepts requests. The shared `nacos.core.api.compatibility.enabled` switch reopens only a small set of deprecated v3 APIs that explicitly use the gate; it does not disable their existing authentication or replace `nacos-api-legacy-adapter`. Legacy v1/v2 HTTP APIs were removed from the main distribution starting with Nacos 3.2.0. Migrate to v3 APIs or temporarily use the legacy adapter.
:::

## Startup Script and Image Variables

The distribution `startup.sh` supports these common options:

| Option | Description | Related property |
| --- | --- | --- |
| `-m standalone` | Start in standalone mode. | `nacos.standalone=true` |
| `-m cluster` | Start in cluster mode. | `nacos.standalone=false` |
| `-f config` | Start config-related modules only. | `nacos.functionMode=config` |
| `-f naming` | Start naming-related modules only. | `nacos.functionMode=naming` |
| `-f microservice` | Start only the Config and Naming modules without the AI module (Nacos 3.2.2+). | `nacos.functionMode=microservice` |
| `-f ai` | Start AI-related modules. | `nacos.functionMode=ai` |
| `-c` | Set the cluster member list. | `nacos.member.list` |
| `-p embedded` | Use embedded storage in cluster mode. | `embeddedStorage=true` |
| `-d` | Set the deployment type. | `nacos.deployment.type` |

When using the official container image, common environment variables include `MODE`, `NACOS_SERVERS`, `PREFER_HOST_MODE`, `NACOS_AUTH_ENABLE`, `NACOS_AUTH_ADMIN_ENABLE`, `NACOS_AUTH_CONSOLE_ENABLE`, `NACOS_AUTH_TOKEN`, `NACOS_AUTH_IDENTITY_KEY`, `NACOS_AUTH_IDENTITY_VALUE`, and `NACOS_CONSOLE_PORT`. Different image versions may have different conversion scripts. For production deployments, mount a complete `application.properties` and treat the image repository or Helm Chart documentation as the source of truth.
