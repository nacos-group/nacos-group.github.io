---
title: 插件体系概览
keywords: [插件, PluginType, SPI, PluginConfigSpec, 插件管理]
description: 了解 Nacos 统一插件身份、执行模式、状态、配置和生命周期，以及当前所有服务端插件类型。
sidebar:
    order: 1
---

# 插件体系概览

Nacos 使用插件把鉴权、数据库方言、可见性、审计、流量防护和 AI 扩展等可替换能力与核心领域模型分离。服务端插件由领域 SPI 提供行为，并由统一插件管理体系提供清单、状态、配置和诊断能力。

本文介绍服务端统一管理的插件。Java 客户端中的 `ClientAuthService`、`IConfigFilter`、`ServerListProvider` 等扩展运行在客户端进程中，不会出现在服务端插件管理 API 或控制台中。

## 插件身份

每个服务端插件由类型和实现名唯一标识：

```text
pluginId = pluginType:pluginName
```

例如，默认鉴权插件是 `auth:nacos`，LDAP 鉴权插件是 `auth:ldap`，AI 官方 MCP 导入来源是 `ai-resource-import:mcp-official`。

- `pluginType` 表示扩展类别，由 Nacos 的 `PluginType` 注册表定义。
- `pluginName` 是该类别下稳定且唯一的实现名。
- `pluginId` 用于管理 API、插件状态、持久化配置和诊断日志。插件升级时不要随意修改它。

同一插件类型的 Provider 按 `PluginProvider.getOrder()` 升序处理；order 相同时保持 SPI 服务发现顺序，随后再执行确定性的 **first-wins** 注册。空实现、空名称和后到达的重复 `pluginId` 会被忽略并记录 WARN，已经注册的实现不会被覆盖。配置 definition 的 key 或 alias 冲突也采用 first-wins，并忽略后来冲突项。

## 当前插件类型

| pluginType | 执行模式 | 类型级 critical | 初始化阶段 | 主要用途 |
| --- | --- | --- | --- | --- |
| `auth` | `EXCLUSIVE` | 是 | `STANDARD` | 选择一个鉴权实现。 |
| `datasource-dialect` | `EXCLUSIVE` | 是 | `STANDARD` | 选择数据库 SQL 方言和 mapper 族。 |
| `config-change` | `CHAIN` | 否 | `STANDARD` | 按 pointcut 和顺序执行配置变更插件。 |
| `encryption` | `ROUTED` | 否 | `STANDARD` | 按密文 dataId 中的算法名路由。 |
| `trace` | `BROADCAST` | 否 | `STANDARD` | 向所有匹配且启用的订阅者广播事件。 |
| `environment` | `CHAIN` | 否 | `PRE_CONTEXT` | 在 Spring 上下文创建前按顺序转换环境配置。 |
| `control` | `EXCLUSIVE` | 否 | `STANDARD` | 启动时选择一个流量防护 manager 实现。 |
| `visibility` | `ROUTED` | 否 | `STANDARD` | 根据领域请求路由可见性实现。 |
| `ai-pipeline` | `CHAIN` | 否 | `STANDARD` | 按顺序执行 AI 资源发布审核节点。 |
| `ai-storage` | `ROUTED` | 是 | `STANDARD` | 按 `StorageKey.provider` 路由内容存储。 |
| `ai-resource-import` | `ROUTED` | 否 | `STANDARD` | 按 `sourceId` 路由一个确定的外部来源。 |

`critical` 是类型能力，不表示该类型的每个实现永远都不能禁用。只有类型当前处于 active 状态时，`PluginTypePolicy` 才会校验领域实际要求的 provider。详情中的 `critical=true` 表示这个具体实现当前不能单独禁用；`typeCritical` 表示该类型具备 critical 能力。

集群寻址文档仍放在插件目录中，但当前寻址实现使用 `MemberLookup`，不属于 `PluginType`，也不受统一插件管理 API 管理。参见[集群寻址](./address-plugin.md)。

## 四种执行模式

- `EXCLUSIVE`：启动时选择一个实现。选择 key 为 `nacos.plugin.{pluginType}.type`，当前不支持通过运行时状态 API 切换。
- `CHAIN`：所有符合领域条件且状态为 enabled 的实现按稳定顺序执行。
- `ROUTED`：可以同时加载多个实现，领域根据算法名、provider、`sourceId` 或请求上下文选择一个 enabled 实现。
- `BROADCAST`：所有订阅目标事件且状态为 enabled 的实现都会收到事件。

统一插件管理负责 loaded/enabled/config；具体如何选择、排序、失败中止或降级，由对应领域 SPI 定义。

## 状态、模块开关和选择配置

下列概念不能混用：

| 层次 | 职责 | 示例 |
| --- | --- | --- |
| 模块或能力总开关 | 决定核心流程是否进入某类插件能力，也可用于延迟加载整个类型。 | `nacos.extension.ai.enabled`、`nacos.plugin.visibility.enabled`、`nacos.plugin.ai-pipeline.enabled` |
| 类型选择 key | 为 `EXCLUSIVE` 类型选择启动实现，变更后需要重启。 | `nacos.plugin.auth.type=nacos` |
| 实现初始状态 | 为非单选实现提供未持久化状态覆盖时的启动默认值。 | `nacos.plugin.trace.audit.enabled=true` |
| 统一插件状态 | 运行时决定已加载实现能否参与执行；可持久化到集群，也可只改当前节点。 | 插件状态 PUT API |
| 实现配置 | 只包含该实现自己声明的 definition，不负责模块开关或实现选择。 | `nacos.plugin.auth.nacos.token.expire.seconds` |

已加载不等于已启用；实现已启用也不能绕过模块总开关。类型级延迟加载只影响首次发现：一个非 critical 类型因总开关关闭而未加载时，开启总开关会触发一次发现、状态恢复和配置 apply；之后再次关闭总开关只停止领域执行，不会卸载实例。

## 统一配置

实现通过 `PluginConfigSpec` 声明 `ConfigItemDefinition`。标准静态 key 是：

```text
nacos.plugin.{pluginType}.{pluginName}.{itemKey}
```

definition 可声明 `key`、`aliases`、`type`、`defaultValue`、`required`、`sensitive` 和 `effectMode`。`enabled` 保留给插件状态，不能作为普通 definition key。

`STANDARD` 插件的有效值优先级是：

```text
LOCAL_ONLY > RUNTIME_PERSISTED > STATIC > DEFAULT
```

`PRE_CONTEXT` 的 `environment` 插件只读取 `STATIC > DEFAULT`。它必须在 Spring 上下文创建前生效，因此所有配置和状态变更都要求重启，不能通过运行时 API 更新。

完整的配置来源、敏感值、`RUNTIME`/`RESTART` 语义和管理 API 用法见[插件运维与配置](./operations.md)。

## 加载和生命周期

常规 `STANDARD` 插件在 Spring 上下文刷新后由统一管理器初始化。启动时会先加载运行时持久化配置，再对每个 configurable 实现计算完整有效配置并调用 `applyConfig`。实现即使没有 runtime override，也会收到启动配置。

需要在配置完成后创建运行资源的适配器可以实现 `PluginStartupLifecycle`。统一管理器只对 enabled 实现调用幂等的 `initialize()`。这个回调不代表插件天然支持运行时资源替换；未定义替换和关闭生命周期的类型仍必须拒绝相关运行时切换。

`environment` 在 `PRE_CONTEXT` 阶段发现、解析和 apply，后续统一管理器复用同一实例和已接受快照，不能再次加载。

## 阅读路径

- 运维人员：先读[插件运维与配置](./operations.md)，再读目标插件族页面。
- 插件开发者：先读[插件开发指南](./development.md)，再核对目标领域 SPI。
- 从旧 key 或旧 SPI 升级：阅读[插件迁移指南](./migration.md)。

| 插件族 | 文档 |
| --- | --- |
| 鉴权与可见性 | [鉴权插件](./auth-plugin.md)、[可见性插件](./visibility-plugin.md) |
| 数据与配置 | [多数据源](./datasource-plugin.md)、[配置加密](./config-encryption-plugin.md)、[配置变更](./config-change-plugin.md) |
| 稳定性与观测 | [轨迹追踪](./trace-plugin.md)、[自定义环境变量](./custom-environment-plugin.md)、[流量防护](./control-plugin.md) |
| AI 扩展 | [AI 发布 Pipeline](./ai-pipeline-plugin.md)、[AI 资源导入](./ai-resource-import-plugin.md)、[AI 存储](./ai-storage-plugin.md) |
