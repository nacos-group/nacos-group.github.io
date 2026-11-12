---
title: 流量防护
keywords: [流量防护, 限流, 连接数限制, TPS, Control Plugin]
description: 本文介绍 Nacos 流量防护插件的能力、默认实现、规则配置和自定义扩展方式。
sidebar:
    order: 12
---

# 流量防护插件

流量防护插件用于在高压或异常访问场景下保护 Nacos 服务端。它可以限制连接数量，也可以限制核心接口的 TPS，帮助服务端快速拒绝过量请求，避免局部流量问题扩大成集群不可用。

Nacos 2.3.0 起支持通过 SPI 注入流量防护插件。统一插件类型为 `control`，执行模式为 `EXCLUSIVE`，加载阶段为 `STANDARD`，类型非 critical。当前内置插件身份是 `control:nacos`，不声明配置 definitions，因此 `configurable=false`。如果没有选择实现，Nacos 使用轻量 no-limit facade，不加载规则、指标或限流后台资源。

## 核心概念

| 概念 | 说明 |
| --- | --- |
| ControlPoint | 被保护的访问点。例如节点总连接数、配置查询、配置发布、服务注册等。 |
| ConnectionControlRule | 连接数规则，用于限制单个节点可接受的连接数量。 |
| TpsControlRule | TPS 规则，用于限制某个 ControlPoint 的请求频率。 |
| `monitor` 模式 | 只统计和记录命中情况，不拦截请求。适合灰度观察。 |
| `intercept` 模式 | 命中规则后直接拒绝请求。适合确认阈值后的保护动作。 |

## 启用默认实现

在 `${nacos.home}/conf/application.properties` 中配置：

```properties
nacos.plugin.control.type=nacos
```

历史键 `nacos.plugin.control.manager.type` 仍是静态 alias；同时配置时标准键优先并记录迁移 WARN。选择是 `RESTART` 语义，运行时状态 API 不能切换实现。

默认规则文件存储在 `${nacos.home}/data/connection` 和 `${nacos.home}/data/tps`。如果希望换到其他目录：

```properties
nacos.plugin.control.rule.local.basedir=/opt/nacos-control-rules
```

此时规则会存储在：

```text
/opt/nacos-control-rules/data/connection
/opt/nacos-control-rules/data/tps
```

规则目录和外部规则存储属于 control 模块配置，不是 `control:nacos` 的 definitions。选择的实现会在统一状态恢复和有效配置应用后执行一次启动初始化；未选择的实现仍可列出，但不会构建 manager 或启动后台资源。

启动后可以查看 `${nacos.home}/logs/plugin-control.log`，确认插件是否加载成功。

## 配置连接数规则

连接数规则文件名固定为 `limitRule`：

```bash
mkdir -p ${nacos.home}/data/connection
cat > ${nacos.home}/data/connection/limitRule <<'EOF'
{"countLimit":1000}
EOF
```

规则字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `countLimit` | int | 节点总连接数限制。`-1` 表示不限制。 |
| `monitorIpList` | Set&lt;String&gt; | 需要详细观察的 IP 列表。命中后会在 `remote-digest.log` 中记录更多连接行为。 |

## 配置 TPS 规则

每个 ControlPoint 对应一个规则文件，文件名建议与 ControlPoint 一致：

```bash
mkdir -p ${nacos.home}/data/tps
cat > ${nacos.home}/data/tps/ConfigQuery <<'EOF'
{"pointName":"ConfigQuery","pointRule":{"maxCount":100,"monitorType":"intercept"}}
EOF
```

规则字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `pointName` | String | 规则对应的 ControlPoint 名称。 |
| `pointRule.ruleName` | String | 规则名。同一个 ControlPoint 可以有多个规则名。 |
| `pointRule.maxCount` | int | TPS 上限。`-1` 表示不限制。 |
| `pointRule.period` | TimeUnit | 统计周期，默认是秒级。 |
| `pointRule.monitorType` | String | `monitor` 或 `intercept`。 |

生产环境建议先使用 `monitor` 模式观察真实流量，再切换到 `intercept` 模式。

## 支持的 ControlPoint

| ControlPoint | 保护内容 | 请求来源 |
| --- | --- | --- |
| `connection` | 节点总连接数 | gRPC 长连接、配置长轮询 |
| `HealthCheck` | gRPC 健康检查 | gRPC |
| `ConfigPublish` | 配置发布 | HTTP、gRPC |
| `ConfigQuery` | 配置查询 | HTTP、gRPC |
| `ConfigRemove` | 配置删除 | gRPC |
| `ConfigListen` | 配置监听 | gRPC |
| `ConfigFuzzyWatch` | 配置模糊订阅 | gRPC |
| `ClusterConfigChangeNotify` | 集群配置变更通知 | gRPC |
| `RemoteNamingInstanceRegisterDeregister` | 服务实例注册和注销 | gRPC |
| `RemoteNamingInstanceBatchRegister` | 服务实例批量注册 | gRPC |
| `RemoteNamingServiceListQuery` | 服务列表查询 | gRPC |
| `RemoteNamingServiceQuery` | 服务查询 | gRPC |
| `RemoteNamingServiceSubscribeUnSubscribe` | 服务订阅和取消订阅 | gRPC |
| `NamingInstanceRegister` | 服务实例注册 | HTTP |
| `NamingInstanceDeregister` | 服务实例注销 | HTTP |
| `NamingInstanceUpdate` | 服务实例更新 | HTTP |
| `NamingInstanceMetadataUpdate` | 服务实例元数据更新 | HTTP |
| `NamingServiceSubscribe` | 服务订阅和查询 | HTTP |
| `NamingInstanceQuery` | 单个服务实例查询 | HTTP |
| `NamingServiceRegister` | 服务创建 | HTTP |
| `NamingServiceDeregister` | 服务删除 | HTTP |
| `NamingServiceQuery` | 服务查询 | HTTP |
| `NamingServiceListQuery` | 服务列表查询 | HTTP |
| `NamingServiceUpdate` | 服务元数据更新 | HTTP |

ControlPoint 名称来自代码中的 `@TpsControl` 注解。不同 Nacos 版本可能会新增 ControlPoint，升级后建议重新核对目标版本代码和默认文档。

## 外部规则存储

默认实现使用本地文件保存规则。集群规模较大、节点较多或容器化部署时，逐个节点维护本地规则会比较困难。此时可以实现外部规则存储插件：

```text
com.alibaba.nacos.plugin.control.spi.ExternalRuleStorageBuilder
```

并在配置中指定外部存储类型：

```properties
nacos.plugin.control.rule.external.storage=${controlPluginName}
```

外部存储可以对接数据库、配置中心或企业内部规则系统。具体一致性和下发策略由插件实现负责。

## 自定义插件开发

自定义流量防护插件需要实现：

| SPI / 抽象类 | 作用 |
| --- | --- |
| `ControlManagerBuilder` | 声明插件名，并根据启动时有效配置创建连接数管理器和 TPS 管理器。 |
| `ConnectionControlManager` | 加载连接数规则，并判断新连接是否允许建立。 |
| `TpsControlManager` | 注册 ControlPoint，加载 TPS 规则，并判断请求是否允许继续执行。 |
| `ExternalRuleStorageBuilder` | 可选。用于接入外部规则存储。 |

核心依赖：

```xml
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-control-plugin</artifactId>
    <version>${project.version}</version>
</dependency>
```

实现后通过 SPI 文件注册：

```text
META-INF/services/com.alibaba.nacos.plugin.control.spi.ControlManagerBuilder
```

如果实现了外部规则存储，还需要注册：

```text
META-INF/services/com.alibaba.nacos.plugin.control.spi.ExternalRuleStorageBuilder
```

新 `ControlManagerBuilder` 可以通过 `PluginConfigDefinitionSpec` 声明私有配置，标准键为 `nacos.plugin.control.{pluginName}.{itemKey}`。在 control 定义安全的 manager 替换/关闭生命周期前，这些 definitions 必须使用 `RESTART`；旧 builder 的无参数构建方法仍保持二进制兼容。

## 运维建议

- 先观察再拦截。新规则先用 `monitor` 模式运行一段时间，确认阈值不会误伤正常流量。
- 规则按节点生效。本地文件规则不会自动同步到其他节点。
- 对核心接口设置不同阈值。配置查询、配置发布、服务注册、服务订阅的流量特征不同，不建议共用一个阈值。
- 保留应急入口。过低的连接数或 TPS 阈值可能影响控制台、SDK、探活和运维接口。
- 结合监控使用。流量防护适合做保护动作，容量评估仍应结合连接数、请求量、线程池、数据库和 JVM 监控。
