---
title: Traffic Control
keywords: [traffic control, rate limit, connection limit, TPS, Control Plugin]
description: This guide explains how the Nacos control plugin protects the server with connection and TPS limits, and how to configure or extend it.
sidebar:
    order: 7
---

# Traffic Control Plugin

The traffic control plugin protects Nacos Server under high load or abnormal access patterns. It can limit connection count and TPS for core APIs, so the server can reject excessive requests early instead of letting a local traffic problem grow into a cluster-wide outage.

Since Nacos 2.3.0, traffic control can be extended through SPI. The default implementation name is `nacos`. If `nacos.plugin.control.manager.type` is not configured, Nacos uses no-limit managers and does not actively limit connections or TPS.

## Concepts

| Concept | Description |
| --- | --- |
| ControlPoint | A protected access point, such as total node connections, config query, config publish, or service registration. |
| ConnectionControlRule | A rule that limits how many connections a single node can accept. |
| TpsControlRule | A rule that limits request rate for one ControlPoint. |
| `monitor` mode | Count and log matched traffic without rejecting requests. Use it for observation. |
| `intercept` mode | Reject requests when the rule is matched. Use it after the threshold is verified. |

## Enable The Default Implementation

Configure `${nacos.home}/conf/application.properties`:

```properties
nacos.plugin.control.manager.type=nacos
```

By default, rule files are stored in `${nacos.home}/data/connection` and `${nacos.home}/data/tps`. To use another base directory:

```properties
nacos.plugin.control.rule.local.basedir=/opt/nacos-control-rules
```

Rules will then be stored in:

```text
/opt/nacos-control-rules/data/connection
/opt/nacos-control-rules/data/tps
```

After startup, check `${nacos.home}/logs/plugin-control.log` to confirm that the plugin is loaded.

## Configure A Connection Rule

The connection rule file name is fixed as `limitRule`:

```bash
mkdir -p ${nacos.home}/data/connection
cat > ${nacos.home}/data/connection/limitRule <<'EOF'
{"countLimit":1000}
EOF
```

Rule fields:

| Field | Type | Description |
| --- | --- | --- |
| `countLimit` | int | Total connection limit for one node. `-1` means unlimited. |
| `monitorIpList` | Set&lt;String&gt; | IPs that need detailed observation. Matched connection behavior is logged in `remote-digest.log`. |

## Configure A TPS Rule

Each ControlPoint uses one rule file. The file name should match the ControlPoint:

```bash
mkdir -p ${nacos.home}/data/tps
cat > ${nacos.home}/data/tps/ConfigQuery <<'EOF'
{"pointName":"ConfigQuery","pointRule":{"maxCount":100,"monitorType":"intercept"}}
EOF
```

Rule fields:

| Field | Type | Description |
| --- | --- | --- |
| `pointName` | String | The ControlPoint protected by this rule. |
| `pointRule.ruleName` | String | Rule name. One ControlPoint may have multiple rule names. |
| `pointRule.maxCount` | int | TPS limit. `-1` means unlimited. |
| `pointRule.period` | TimeUnit | Statistics period. Default is seconds. |
| `pointRule.monitorType` | String | `monitor` or `intercept`. |

For production, run new rules in `monitor` mode first, then switch to `intercept` after the threshold is verified.

## Supported ControlPoints

| ControlPoint | Protected operation | Source |
| --- | --- | --- |
| `connection` | Total node connections | gRPC long connections, config long polling |
| `HealthCheck` | gRPC health check | gRPC |
| `ConfigPublish` | Config publish | HTTP, gRPC |
| `ConfigQuery` | Config query | HTTP, gRPC |
| `ConfigRemove` | Config remove | gRPC |
| `ConfigListen` | Config listener | gRPC |
| `ConfigFuzzyWatch` | Config fuzzy watch | gRPC |
| `ClusterConfigChangeNotify` | Cluster config change notification | gRPC |
| `RemoteNamingInstanceRegisterDeregister` | Service instance register and deregister | gRPC |
| `RemoteNamingInstanceBatchRegister` | Batch service instance register | gRPC |
| `RemoteNamingServiceListQuery` | Service list query | gRPC |
| `RemoteNamingServiceQuery` | Service query | gRPC |
| `RemoteNamingServiceSubscribeUnSubscribe` | Service subscribe and unsubscribe | gRPC |
| `NamingInstanceRegister` | Service instance register | HTTP |
| `NamingInstanceDeregister` | Service instance deregister | HTTP |
| `NamingInstanceUpdate` | Service instance update | HTTP |
| `NamingInstanceMetadataUpdate` | Service instance metadata update | HTTP |
| `NamingServiceSubscribe` | Service subscribe and query | HTTP |
| `NamingInstanceQuery` | Single service instance query | HTTP |
| `NamingServiceRegister` | Service create | HTTP |
| `NamingServiceDeregister` | Service delete | HTTP |
| `NamingServiceQuery` | Service query | HTTP |
| `NamingServiceListQuery` | Service list query | HTTP |
| `NamingServiceUpdate` | Service metadata update | HTTP |

ControlPoint names come from `@TpsControl` annotations in the code. New Nacos versions may add more ControlPoints, so check the target version when upgrading.

## External Rule Storage

The default implementation stores rules in local files. For large clusters or containerized deployments, maintaining local files node by node is inconvenient. You can implement an external rule storage plugin:

```text
com.alibaba.nacos.plugin.control.spi.ExternalRuleStorageBuilder
```

Then configure:

```properties
nacos.plugin.control.rule.external.storage=${controlPluginName}
```

The external storage can use a database, a configuration center, or an internal rule system. Consistency and delivery behavior are controlled by the plugin implementation.

## Develop A Custom Plugin

A custom traffic control plugin implements:

| SPI / abstract class | Purpose |
| --- | --- |
| `ControlManagerBuilder` | Declares the plugin name and creates connection and TPS managers. |
| `ConnectionControlManager` | Loads connection rules and decides whether new connections are allowed. |
| `TpsControlManager` | Registers ControlPoints, loads TPS rules, and decides whether requests can continue. |
| `ExternalRuleStorageBuilder` | Optional. Integrates external rule storage. |

Core dependency:

```xml
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-control-plugin</artifactId>
    <version>${project.version}</version>
</dependency>
```

Register the implementation through SPI:

```text
META-INF/services/com.alibaba.nacos.plugin.control.spi.ControlManagerBuilder
```

If external rule storage is implemented, also register:

```text
META-INF/services/com.alibaba.nacos.plugin.control.spi.ExternalRuleStorageBuilder
```

## Operations Advice

- Observe before intercepting. Run new rules in `monitor` mode first to avoid rejecting normal traffic.
- Rules are node-local by default. Local file rules are not automatically synchronized to other nodes.
- Use different thresholds for different APIs. Config query, config publish, service registration, and service subscription have different traffic patterns.
- Keep an emergency path. Too-low thresholds may affect console access, SDK traffic, health checks, and operations APIs.
- Use monitoring together with traffic control. The plugin provides protection actions; capacity planning still needs connection, request, thread pool, database, and JVM metrics.
