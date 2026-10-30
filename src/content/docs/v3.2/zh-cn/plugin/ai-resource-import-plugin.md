---
title: AI 资源导入
keywords: [AI 资源导入, MCP Registry, Skill Registry, AI 管理中心]
description: 本文介绍 Nacos AI 资源导入插件的来源配置、导入流程、内置来源、安全边界和扩展方式。
sidebar:
    order: 12
---

# AI 资源导入插件

AI 资源导入插件用于把外部 registry、市场或企业内部资源库中的 AI 资源导入 Nacos AI 管理中心。导入后，资源会进入 Nacos 的命名空间、版本、可见性和生命周期体系。

导入插件只负责“从哪里发现资源”和“如何把外部资源转换成可导入内容”。它不拥有 Nacos 资源身份、鉴权、可见性、发布生命周期和存储模型。

## 适用场景

常见场景包括：

- 从官方 MCP registry 导入 MCP Server。
- 从 Skill well-known 地址导入 Skill。
- 从 skills.sh 或企业内部 Skill 市场导入 Skill。
- 让企业内部工具市场、私有 Git 索引或模型平台成为 AI 管理中心的资源来源。

导入适合做资源初始化和统一治理，不适合绕过 Nacos 的发布、审核和权限流程。

## 导入流程

统一导入流程如下：

```text
查询来源 -> 搜索候选资源 -> 选择候选 -> 校验冲突和依赖 -> 执行导入
```

每个导入来源由运维人员配置，并通过 `sourceId` 暴露给用户。用户在导入时选择 `sourceId`，不能在请求中提交任意 endpoint、IP、凭证或 registry 根路径。

| 阶段 | 说明 |
| --- | --- |
| 查询来源 | 返回当前可用于某类资源的导入来源。 |
| 搜索候选 | 从指定来源搜索摘要信息，不下载完整资源内容。 |
| 校验 | 拉取必要 artifact，检查类型、大小、冲突和依赖。 |
| 执行 | 将有效 artifact 交给对应资源 Operator，写入 Nacos AI 资源。 |

浏览器或控制台不应接收完整 artifact。MCP specification、Skill ZIP 等内容只应在服务端导入链路中流转。

## 来源配置

一个来源通常包含以下信息：

| 字段 | 说明 |
| --- | --- |
| `sourceId` | 稳定来源 ID，用户导入时选择它。 |
| `pluginName` | `ai-resource-import` 类型下的 importer 实现名。 |
| `resourceTypes` | 支持的资源类型，例如 `mcp` 或 `skill`。 |
| `endpoint` | 运维配置的来源地址。 |
| `enabled` | 来源是否启用。 |
| `authRef` | 可选的服务端凭证引用。凭证不返回给用户。 |
| `connectTimeout` / `readTimeout` | 访问外部来源的超时。 |
| `maxPageCount` / `maxItemCount` | 分页和条目限制。 |
| `maxArtifactSize` | 单个 artifact 最大大小。 |
| `properties` | importer 专属非敏感配置。 |

显式来源可以配置在 `nacos.ai.resource.import.sources[...]` 下，并通过 `nacos.ai.resource.import.enabled=true` 开启。内置 preset 来源使用 `nacos.plugin.ai.importer.*` 前缀独立启用或关闭。

默认插件加载时，官方 MCP Registry 和 skills.sh 来源会启用。需要关闭时，可以把对应 preset 的 `enabled` 配置为 `false`。

## 内置来源

### MCP 官方 Registry

启用官方 MCP 来源：

```properties
nacos.plugin.ai.importer.mcp.official.enabled=true
```

默认来源信息：

| 项目 | 默认值 |
| --- | --- |
| `sourceId` | `mcp-official` |
| importer | `mcp-registry` |
| 资源类型 | `mcp` |
| endpoint | `https://registry.modelcontextprotocol.io/v0/servers` |

可以通过 `nacos.plugin.ai.importer.mcp.official.*` 覆盖来源 ID、展示名、endpoint、认证引用、超时和大小限制。

### Skill Well-known

启用 Skill well-known 来源：

```properties
nacos.plugin.ai.importer.skills.well-known.enabled=true
nacos.plugin.ai.importer.skills.well-known.url=https://developers.cloudflare.com
```

默认来源信息：

| 项目 | 默认值 |
| --- | --- |
| `sourceId` | `skills-well-known` |
| importer | `skills-well-known` |
| 资源类型 | `skill` |
| endpoint | `nacos.plugin.ai.importer.skills.well-known.url` |

该来源会尝试读取 `/.well-known/agent-skills`，并兼容旧的 `/.well-known/skills`。它支持 Skill discovery v0.1.0 和 v0.2.0。

### skills.sh

启用 skills.sh 来源：

```properties
nacos.plugin.ai.importer.skills.skills-sh.enabled=true
```

默认来源信息：

| 项目 | 默认值 |
| --- | --- |
| `sourceId` | `skills-sh` |
| importer | `skills-sh` |
| 资源类型 | `skill` |
| endpoint | `https://skills.sh` |

## 安全边界

内置来源默认要求 HTTPS，并默认禁止访问 localhost、loopback、link-local、multicast 和私网地址。只有运维人员明确确认环境安全时，才应打开下列配置：

| 配置后缀 | 含义 | 默认值 |
| --- | --- | --- |
| `allow-http` / `allowHttp` | 允许非 HTTPS endpoint。 | `false` |
| `allow-private-network` / `allowPrivateNetwork` | 允许私网、localhost 等地址。 | `false` |

不要把外部 registry 当成可信输入。导入前仍需要校验文件路径、压缩包大小、摘要、内容类型和冲突策略。

## API 入口

统一导入 API 包括 Admin API 和 Console API：

| 接口面 | 路径 |
| --- | --- |
| Admin API | `/v3/admin/ai/import/sources`、`/search`、`/validate`、`/execute` |
| Console API | `/v3/console/ai/import/sources`、`/search`、`/validate`、`/execute` |

详细参数请参考 [运维 API](../manual/admin/admin-api.md) 和 [控制台 API](../manual/admin/console-api.md)。

## 开发自定义 Importer

自定义 importer 依赖：

```xml
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-ai-plugin</artifactId>
    <version>${project.version}</version>
</dependency>
```

实现 `com.alibaba.nacos.plugin.ai.importer.spi.AiResourceImportServiceBuilder`，并通过 Java SPI 声明：

```text
META-INF/services/com.alibaba.nacos.plugin.ai.importer.spi.AiResourceImportServiceBuilder
```

核心接口：

| 方法 | 说明 |
| --- | --- |
| `importerType()` | 稳定 importer 名称。 |
| `build(properties)` | 使用 importer 配置创建导入服务。 |
| `supportedResourceTypes()` | 支持导入的资源类型。 |
| `search(context)` | 返回候选摘要，不返回完整 payload。 |
| `fetch(context, item)` | 拉取选中资源的 artifact，不写入 Nacos。 |

如果需要提供预置来源，可以实现 `AiResourceImportSourceProvider`，并通过对应 SPI 文件声明。

## 排查

| 现象 | 排查方向 |
| --- | --- |
| 来源列表为空 | 检查 `nacos.ai.resource.import.enabled`、来源 `enabled` 和 importer 插件是否加载。 |
| 搜索失败 | 检查 endpoint、网络连通性、超时、认证引用和 HTTPS/私网限制。 |
| 校验出现冲突 | 查看资源名、版本和是否已有 editing/reviewing 版本。必要时重新编辑或使用覆盖策略。 |
| 导入后不可见 | 检查资源命名空间、可见性、鉴权和资源状态。 |
| 私网来源无法访问 | 只有确认风险后，才在对应来源上启用 `allow-private-network`。 |
