---
title: 插件迁移指南
keywords: [插件迁移, 配置迁移, AI Resource Import, ConfigChangeConfigs, 兼容性]
description: 从历史插件选择 key、私有配置和旧 AI Resource Import SPI 迁移到统一插件管理模型。
sidebar:
    order: 4
---

# 插件迁移指南

统一插件管理把“模块是否进入插件能力”“选择哪个实现”“实现是否 enabled”“实现私有配置”拆成四个独立层次。升级前先按这个模型分类旧配置，避免把历史总开关直接迁成某个实现的配置或状态。

## 通用迁移步骤

1. 记录当前插件 JAR、实现名、模块开关、选择 key、实现 enabled key 和私有配置。
2. 把实现身份映射为稳定的 `pluginType:pluginName`。
3. 对 `EXCLUSIVE` 类型改用标准 `nacos.plugin.{pluginType}.type`。
4. 对实现配置改用 `nacos.plugin.{pluginType}.{pluginName}.{itemKey}`。
5. 保留 alias 只用于一个兼容窗口，观察迁移 WARN；确认新 key 生效后删除 alias。
6. 先滚动部署新插件和静态配置，再通过插件详情检查 effective source。
7. `RESTART` 字段必须随节点重启；不要用 PUT API 尝试修改。

对 STATIC `PluginConfigSpec` 配置项，标准完整 key 按“是否存在”取得优先级，而不是按值是否非空。空的标准值仍会屏蔽历史 alias，并可能触发 required 校验；只有彻底删除标准属性后才会回退 alias。同时存在多个 alias 时，按 definition 中的声明顺序取第一个。选择 key 仍遵循各插件族文档中的规则。API 接受的 alias 会被归一化，`plugin-configs.json` 和 local-only map 只保存 canonical item key。

持久化实现状态会覆盖静态 `.enabled` 初始值。升级前除静态文件外，还要导出现有插件状态和运行时配置；否则即使修改了 `application.properties`，已有持久化状态仍可能保持实现启用或禁用。

## SPI 与加载兼容性

统一配置契约为多数旧版零配置插件提供 default 方法，因此它们通常仍能二进制加载，但会显示 `configurable=false`。以下变化需要插件作者在升级前明确处理：

- AI Resource Import 的旧 Importer/Source SPI 没有兼容适配器，必须迁移到 `AiResourceImportServiceBuilder`，并同步更新服务注册、配置和调用方。详细模型见下文。
- AI Pipeline 不再加载 `PublishPipelineServiceBuilder`。插件应以 public 无参构造直接注册 `PublishPipelineService`，并实现配置 definitions、当前快照和 apply 回调。
- 第三方数据源插件如果实现或注册了已移除的 `ConfigInfoBetaMapper`、`ConfigInfoTagMapper` 或 `ConfigMigrateMapper`，必须删除这些 SPI 依赖并重新编译。3.0 之前的配置数据迁移应在升级前完成。
- 相同 `pluginType:pluginName` 的重复实现现在按确定性的 first-wins 规则处理。升级前应消除重复 ID，不能依赖旧版不确定的覆盖顺序。
- `auth`、`datasource-dialect`、`ai-storage` 等关键插件类型在选中实现缺失、被禁用或初始化失败时可能阻止服务启动。滚动升级前应在预发环境验证实现选择、状态和初始化结果。

## 实现选择 key

| pluginType | 标准 key | 历史 alias | 默认/行为 |
| --- | --- | --- | --- |
| `auth` | `nacos.plugin.auth.type` | `nacos.core.auth.system.type` | 默认 `nacos`。 |
| `datasource-dialect` | `nacos.plugin.datasource-dialect.type` | `spring.sql.init.platform` | standalone/embedded 默认 `derby`，普通 cluster 默认 `mysql`。`spring.datasource.platform` 已移除。 |
| `control` | `nacos.plugin.control.type` | `nacos.plugin.control.manager.type` | 空表示 no-limit。 |

这些选择都在启动时快照，变更需要重启。不要用 status API 切换 exclusive 实现。

数据源连接参数也已迁移到统一命名空间：`db.num`、`db.url.{index}`、`db.user[.{index}]`、`db.password[.{index}]`、`db.pool.config.*` 和 JVM 参数 `QUERYTIMEOUT` 应迁移到 `nacos.plugin.datasource.db.*`。连接池 item 使用 canonical kebab-case。这些参数仍只在重启后生效，不通过插件配置 API 动态修改。

## Auth、Visibility 和 AI Pipeline

- 默认鉴权实现配置从 `nacos.core.auth.plugin.nacos.*` 和 `nacos.core.auth.caching.enabled` 迁到 `nacos.plugin.auth.nacos.*`。
- LDAP 从 `nacos.core.auth.ldap.*` 迁到 `nacos.plugin.auth.ldap.*`；未被生产代码消费的 `nacos.core.auth.ldap.userdn` 模板 key 不是有效 alias。
- OIDC 从 `nacos.core.auth.plugin.oidc.*` 迁到 `nacos.plugin.auth.oidc.*`。当前全部字段为 `RESTART`。
- `nacos.plugin.visibility.enabled` 仍是能力总开关；废弃的 `nacos.plugin.visibility.type` 是 `RESTART` selector，仍决定 AI 领域请求的实现并参与初始状态计算。`nacos.plugin.visibility.{name}.enabled` 和 `visibility:{name}` 的持久化统一状态决定该实现是否可用。
- `nacos.plugin.ai-pipeline.enabled` 仍是 Pipeline 总开关；历史 `nacos.plugin.ai-pipeline.type` 只用于启动时初始 chain 状态。后续成员变更使用统一插件状态，节点参数使用各自 definition。

目标发行包已经声明 `nacos.plugin.auth.type=nacos` 和 `auth:nacos` 的标准默认项。升级时应把保留的鉴权选择和实现配置复制到这些标准 key，不能让历史 alias 与目标默认值并存；否则标准 selector 会继续选择 `nacos`，标准 `PluginConfigSpec` key 即使为空也会屏蔽 alias。启动脚本只会特殊迁移 `application.properties` 中有效的旧 token secret，其他鉴权值都需要显式迁移。

## Config Change

新 Config Change 实现应直接在 `ConfigChangePluginService` 上声明 `PluginConfigSpec`：

```text
nacos.plugin.config-change.{pluginName}.{itemKey}
```

历史 `nacos.core.config.plugin.{pluginName}.*` 仍会在兼容周期内提供给没有 definition 的旧实现；历史 `{name}.enabled` 只用于没有持久化状态时初始化 unified state。`ConfigChangeConfigs` 已废弃，新实现不要依赖它，也不要继续把 `PLUGIN_PROPERTIES` 当成第二套 enabled gate。

旧二进制插件仍可加载，但显示 `configurable=false`。迁移版本应增加 definition、`applyConfig` 和当前配置快照。

## AI Resource Import breaking change

AI Resource Import 已从“Importer + 可复制 Source/preset”双层模型改为一个 Builder 对应一个确定来源：

```text
ai-resource-import:{pluginName}
sourceId = managed pluginName
```

新开关和配置：

```properties
nacos.plugin.ai-resource-import.enabled=true
nacos.plugin.ai-resource-import.{pluginName}.enabled=true
nacos.plugin.ai-resource-import.{pluginName}.{itemKey}=value
```

标准 key 和历史 alias 都未配置时，family gate 仍默认开启；只有显式 `false` 才关闭。升级期间必须保持导入能力关闭的部署，应在发布前明确设置 `nacos.plugin.ai-resource-import.enabled=false`。

需要删除或重写的旧模型：

- `nacos.plugin.ai.importer.*`
- `nacos.ai.resource.import.sources[N].*`
- `AiResourceImportSource`
- `AiResourceImportSourceProvider` / Source Provider SPI
- preset 来源模型
- 通过配置复制同一个 importer 到多个 endpoint

原有 API 的 `sourceId` 现在等于 managed `pluginName`；API 字段 `pluginName` 仍表示 importer/protocol 类型，用于兼容控制台数据模型。一个 `pluginName` 只代表一个固定来源。需要第二个企业 endpoint 时，提供另一个具有不同 `pluginName` 的 `AiResourceImportServiceBuilder`，不能复制配置实例。

新 Builder 自身实现 `PluginConfigSpec`，提供 `pluginName()`、`importerType()`、展示信息、支持的资源类型、definitions、`applyConfig`、当前快照和无参 `build()`。请求级 service 从已接受的不可变快照创建；请求不再携带 source 配置或任意 endpoint。

四个内置来源：

| pluginId | importer type | 默认实现状态 | endpoint |
| --- | --- | --- | --- |
| `ai-resource-import:mcp-official` | `mcp-registry` | enabled | 固定官方 MCP Registry |
| `ai-resource-import:mcp-registry-protocol` | `mcp-registry` | disabled | 运维必须配置 |
| `ai-resource-import:skills-sh` | `skills-sh` | enabled | 固定 `https://skills.sh` |
| `ai-resource-import:skills-well-known` | `skills-well-known` | disabled | 运维必须配置 |

`mcp-official` 和 `skills-sh` 继续使用原有 Console 展示名称，用户仍按来源搜索、选择、校验、导入。旧 `nacos.plugin.ai.importer.*` 中仍有效的展示、描述、限制、状态和可配置 endpoint key 只在一个迁移窗口作为 alias 读取；固定来源 endpoint override、`auth-ref`、来源/全局 timeout、`max-page-count`、`block-private-network`、全局默认值和任意 `properties.*` 已移除。

旧 Importer/Source SPI 没有兼容适配器，外部实现必须重新编译并迁移。完整 definitions 和示例见 [AI 资源导入插件](./ai-resource-import-plugin.md)。

## 上线和回滚

- 先在单节点验证 plugin list/detail、effective source、敏感脱敏和 `RESTART` 提示。
- 集群滚动升级期间，不要提交依赖新 definition 的 runtime config，直到所有节点都运行新插件。
- 保留旧 alias 的第一个版本要持续监控 WARN；下一个维护窗口删除旧 key。
- 回滚前清理只有新版本认识的 runtime override，避免旧版本忽略或误读配置。
- AI Resource Import 旧 SPI 无兼容适配器；需要回滚时必须同时回滚插件 JAR、配置和调用方，不能混跑两种模型。
