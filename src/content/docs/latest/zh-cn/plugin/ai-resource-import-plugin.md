---
title: AI 资源导入
keywords: [AI 资源导入, MCP Registry, Skill Registry, PluginConfigSpec]
description: 介绍统一管理后的 AI Resource Import 插件、四个内置来源、配置 definitions、安全边界和旧 SPI 迁移。
sidebar:
    order: 15
---

# AI 资源导入插件

AI Resource Import 插件把外部 registry、市场或企业资源库中的 MCP Server、Skill 等资源转换为 Nacos 可校验和写入的 artifact。它只负责外部协议和转换；命名空间、资源身份、鉴权、可见性、版本、发布 Pipeline 和存储仍由 AI Registry 领域负责。

## 统一来源模型

`ai-resource-import` 是 `ROUTED` 插件类型。一个 Builder 就是一个确定的外部来源：

```text
pluginId = ai-resource-import:{pluginName}
sourceId = managed pluginName
```

请求中的 `sourceId` 直接路由到一个 enabled Builder。原有 API 字段 `pluginName` 仍表示 importer/protocol 类型，以兼容 Console 数据模型；它不是 managed pluginName。

```text
sourceId
  -> AiResourceImportServiceBuilder(已接受配置快照)
  -> 请求级 AiResourceImportService
  -> AiResourceOperator(resourceType)
```

一个 `pluginName` 只能代表一个来源。不能再通过纯配置把同一个实现复制成多个 endpoint；如需另一个固定来源，必须提供不同 `pluginName` 的 Builder。

## 开关、状态和默认行为

AI 模块和当前功能模式允许时，family switch 决定是否加载导入插件：

```properties
nacos.plugin.ai-resource-import.enabled=true
```

`nacos.ai.resource.import.enabled` 是历史 alias。标准 key 只要存在就具有优先级，即使值为空也不回退 alias。两个 key 都未配置时 family gate 仍默认开启；只有显式配置 `false` 才关闭 AI Resource Import。发行包也显式将标准 key 设为 `true`。

每个来源的初始状态使用：

```properties
nacos.plugin.ai-resource-import.{pluginName}.enabled=true
```

有持久化统一插件状态时，持久化状态优先。运行时请求还会再次检查 Builder 状态，disabled 来源不会出现在来源列表，也不能执行 search、validate 或 execute。

## 四个内置来源

| pluginId | API importer type | 资源 | endpoint | 默认实现状态 |
| --- | --- | --- | --- | --- |
| `ai-resource-import:mcp-official` | `mcp-registry` | `mcp` | 固定官方 MCP Registry | enabled |
| `ai-resource-import:mcp-registry-protocol` | `mcp-registry` | `mcp` | 运维必须配置 | disabled |
| `ai-resource-import:skills-sh` | `skills-sh` | `skill` | 固定 `https://skills.sh` | enabled |
| `ai-resource-import:skills-well-known` | `skills-well-known` | `skill` | 运维必须配置 | disabled |

`mcp-official` 的 Console 展示名仍是 `Official MCP Registry`，`skills-sh` 仍显示 `skills.sh`。用户原有的来源选择、搜索、勾选候选、校验和执行体验保持不变。

### 固定 endpoint 来源

`mcp-official` 和 `skills-sh` 不声明 `endpoint`、`allow-http` 或 `allow-private-network`，也不接受旧 endpoint override。来源地址是实现身份的一部分。

```properties
nacos.plugin.ai-resource-import.mcp-official.enabled=true
nacos.plugin.ai-resource-import.skills-sh.enabled=true
```

### 运维配置 endpoint 来源

启用任意 MCP Registry protocol endpoint：

```properties
nacos.plugin.ai-resource-import.mcp-registry-protocol.enabled=true
nacos.plugin.ai-resource-import.mcp-registry-protocol.endpoint=https://registry.example.com/v0/servers
```

启用 Skill well-known registry：

```properties
nacos.plugin.ai-resource-import.skills-well-known.enabled=true
nacos.plugin.ai-resource-import.skills-well-known.endpoint=https://skills.example.com
```

`skills-well-known` 支持 discovery schema v0.1.0 和 v0.2.0。endpoint 是 registry 根地址时，会依次尝试 `/.well-known/agent-skills/index.json` 和 `/.well-known/skills/index.json`。

## 配置 definitions

所有 canonical full key 使用：

```text
nacos.plugin.ai-resource-import.{pluginName}.{itemKey}
```

公共 item：

| item key | type | default | effectMode | 适用实现 | 含义 |
| --- | --- | --- | --- | --- | --- |
| `endpoint` | `STRING` | 空 | `RESTART` | 两个可配置 endpoint 来源 | Registry/marketplace 根地址；启用后实际构建时不能为空。 |
| `allow-http` | `BOOLEAN` | `false` | `RESTART` | 两个可配置 endpoint 来源 | 是否允许非 HTTPS。 |
| `allow-private-network` | `BOOLEAN` | `false` | `RESTART` | 两个可配置 endpoint 来源 | 是否允许本机或私网目标。 |
| `display-name` | `STRING` | 各实现展示名 | `RUNTIME` | 全部 | API 和 Console 展示名。 |
| `description` | `STRING` | 各实现描述 | `RUNTIME` | 全部 | API 和 Console 描述。 |
| `max-item-count` | `NUMBER` | `500` | `RUNTIME` | 全部 | 一次请求允许的最大结果/文件数。 |
| `max-artifact-size` | `NUMBER` | `10485760` | `RUNTIME` | 全部 | HTTP 响应或 artifact 最大字节数。 |

这些 definition 当前都是 `required=false`、`sensitive=false`。`mcp-official` 和 `skills-sh` 只声明四个 `RUNTIME` 展示/限制字段；另外两个实现声明全部七项。

`endpoint`、`allow-http` 和 `allow-private-network` 不能用运行时 PUT 增加、修改或删除。修改静态配置并重启。其他四项可以通过 Console 或 PUT API 运行时更新，更新后的不可变 Builder 快照用于后续新请求。

## 有效配置和 alias

有效值遵循统一优先级：

```text
LOCAL_ONLY > RUNTIME_PERSISTED > STATIC > DEFAULT
```

旧 `nacos.plugin.ai.importer.*` key 只在一个迁移窗口作为 alias 读取：

| 新 pluginName | 旧前缀/alias 范围 |
| --- | --- |
| `mcp-official` | `nacos.plugin.ai.importer.mcp.official.` 下的展示、描述、限制和历史状态。 |
| `skills-sh` | `nacos.plugin.ai.importer.skills.skills-sh.` 下的展示、描述、限制和历史状态。 |
| `skills-well-known` | `nacos.plugin.ai.importer.skills.well-known.`；旧 `url`/`endpoint`、网络开关、展示、描述、限制和状态。 |
| `mcp-registry-protocol` | 无旧 alias。 |

固定来源的 endpoint override、`auth-ref`、来源/全局 timeout、`max-page-count`、`block-private-network`、全局默认值和任意 `properties.*` 已移除。

## 导入流程和生命周期

```text
列出来源 -> 搜索候选 -> 用户明确选择 -> 校验 -> 执行
```

- search 为一个请求构建 service，只返回候选摘要，不返回 MCP tools、Skill 包或秘密。
- validate 和 execute 分别构建一个 service，并在一次操作内复用它处理所有已选项，最后在 `finally` 中关闭。
- fetch 返回 artifact，但不能直接写 Nacos；资源 Operator 负责领域校验和持久化。
- 浏览器不能默认选择搜索结果；全选后也必须允许取消单项。

统一 API：

| 方法 | Admin | Console |
| --- | --- | --- |
| 来源 | `GET /v3/admin/ai/import/sources` | `GET /v3/console/ai/import/sources` |
| 搜索 | `POST /v3/admin/ai/import/search` | `POST /v3/console/ai/import/search` |
| 校验 | `POST /v3/admin/ai/import/validate` | `POST /v3/console/ai/import/validate` |
| 执行 | `POST /v3/admin/ai/import/execute` | `POST /v3/console/ai/import/execute` |

## 安全边界

- 用户请求不能提交任意 URL、IP、registry 根地址或凭证。
- 默认只允许 HTTPS，并阻止 loopback、link-local、multicast 和私网 DNS 结果。
- 只有运维拥有的可配置来源可以显式开启 `allow-http` 或 `allow-private-network`。
- 所有派生 URL 和重定向都必须重新校验相同网络策略。
- HTTP 响应和 artifact 必须受 `max-artifact-size` 限制；结果/文件数受 `max-item-count` 限制。
- Skill 包导入不得执行脚本，必须校验路径、摘要和压缩包总大小。

## 开发自定义来源

实现 `com.alibaba.nacos.plugin.ai.importer.spi.AiResourceImportServiceBuilder` 并通过 Java SPI 注册。Builder 本身是 managed plugin 和 `PluginConfigSpec`：

| Builder 方法 | 要求 |
| --- | --- |
| `pluginName()` | 稳定 managed 名称和 API `sourceId`。 |
| `importerType()` | API 兼容字段 `pluginName` 的 importer/protocol 元数据。 |
| `displayName()` / `description()` | 来自已接受配置快照。 |
| `supportedResourceTypes()` | 这个固定来源可产生的资源类型。 |
| `getConfigDefinitions()` | 声明来源拥有的全部 item。 |
| `applyConfig(config)` | 原子替换不可变有效配置快照。 |
| `getCurrentConfig()` | 返回最后接受的 canonical item-key 快照。 |
| `build()` | 从一个快照构建请求级 service，不再接受额外 properties。 |

SPI 文件：

```text
META-INF/services/com.alibaba.nacos.plugin.ai.importer.spi.AiResourceImportServiceBuilder
```

插件名冲突采用 first-wins + WARN。

## Breaking change 与迁移

旧的 Importer/Source 双 SPI 已移除，没有兼容 adapter。外部插件必须迁移并重新编译：

- 删除 `AiResourceImportSource` 和 Source Provider SPI。
- 删除 `nacos.ai.resource.import.sources[N].*`、preset 和复制 endpoint 的模型。
- 把来源 ID 固定为 Builder `pluginName()`，实现 `PluginConfigSpec` 和无参 `build()`。
- 把仍有效的属性迁到标准 full key。

旧 MCP import compatibility API 默认关闭；如需短期迁移，可使用 `nacos.ai.resource.import.legacy-mcp-api-enabled=true`。允许旧 API 抓取用户 URL 还必须额外显式开启 `nacos.ai.resource.import.allow-user-url=true`，不应作为长期方案。

参见[插件迁移指南](./migration.md)和[兼容与废弃](../manual/admin/compatibility-and-deprecation.md)。
