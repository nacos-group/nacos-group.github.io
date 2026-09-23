---
title: ARD 资源发现
keywords: [Nacos AI 管理中心, ARD, Agentic Resource Discovery, 资源搜索, 资源目录]
description: 了解如何通过 ARD 发现 Nacos 中的 Agent、Skill、Prompt 和 MCP Server，以及资源发布、可见性和内容使用规则。
sidebar:
  order: 3.2
---

# ARD 资源发现

[ARD（Agentic Resource Discovery）](https://agenticresourcediscovery.org/) 是面向 AI 资源描述、搜索与发现的开放规范。[官方规范](https://agenticresourcediscovery.org/spec/)署名作者包括 Junjie Bu（Google）、R. V. Guha（Microsoft）和 Shaun Smith（Hugging Face），规范源码见[官方 GitHub 仓库](https://github.com/ards-project/ard-spec)。

Nacos 3.3 通过 ARD 协议兼容接口，将已发布的 Agent、Skill、Prompt 和 MCP Server 提供给 AI 应用和工具链，客户端可以先搜索能力，再获取资源内容。

服务端启用、鉴权及完整 HTTP 示例见[生态融合中的 ARD 接入指南](../../../ecology/use-nacos-with-ard.md)。本页说明资源如何进入发现结果，以及应用如何使用这些结果。

## 1. 选择发现方式

| 使用场景 | 入口 |
| --- | --- |
| 工具链需要通过 ARD 协议搜索多种 AI 资源、浏览目录并下载内容 | [ARD 接入指南](../../../ecology/use-nacos-with-ard.md) |
| 应用需要发现 Agent 的调用定义、运行端点并订阅变化 | [RAD 接入指南](./rad-discovery.md)，RAD 全称为 Remote Agent Discovery |
| 应用直接使用 Nacos API 搜索资源，或需要搜索 AgentSpec | [客户端 API](../open-api.md)中的 AI 资源搜索及各资源专用接口 |

ARD 当前覆盖 Agent、Skill、Prompt、MCP 四类资源。AgentSpec 通过 Nacos 原生 API 获取，不包含在 ARD 结果中。

## 2. 让资源可以被发现

在对应资源的管理页面完成创建和发布即可，无需再向 ARD 注册一份：

1. 按 [Agent](./agent-registry.md)、[Skill](./skill-registry.md)、[Prompt](./prompt-registry.md)或 [MCP](./mcp-registry.md) 指南创建资源，补充名称、描述及业务标签，便于使用者搜索和筛选。
2. 按 [AI 资源生命周期](./ai-resource-lifecycle.md)完成提交和发布，确认资源已启用，`latest` 指向 `online` 版本。仅保存草稿或审核完成，尚未发布的版本不会进入发现结果。
3. 确认资源可见范围和调用账号的权限。`PUBLIC` 资源可公开发现；`PRIVATE` 资源只对具备相应读取权限的身份可见。匿名调用只能发现公开资源，且服务端需先开启匿名访问。
4. 使用接入账号查询目录或搜索资源，检查名称、版本和资源地址。

`public` 命名空间与 `PUBLIC` 可见范围是两个不同设置。在 `public` 命名空间创建资源，并不等于将其公开。

搜索返回 `latest` 指向的当前上线版本，不会把各个历史版本都作为独立结果列出。发布、下线或修改资源后，搜索同步可能需要一些时间；刚启动或升级时，结果也可能暂不完整。排查缺失资源时，先确认发布状态和权限，再重试查询。

## 3. 筛选和使用结果

ARD 的 `type` 表示可下载内容的媒体类型，不是 Nacos 的资源类型名。搜索时可用 `query.filter.type` 限定应用能够处理的内容：

| 资源 | `type` | 获取内容后如何使用 |
| --- | --- | --- |
| Agent：A2A 表示 | `application/a2a-agent-card+json` | 交给 A2A 客户端解析 AgentCard。 |
| Agent：Nacos 定义 | `application/vnd.nacos.ai-agent+json` | 读取版本化的 Agent 定义和调用接口；运行端点发现与订阅使用 RAD。 |
| Skill | `application/agent-skills+zip` | 获取包含 `SKILL.md` 及打包资源的 ZIP，供支持 Skill 的工具加载。 |
| Prompt | `application/vnd.nacos.ai-prompt+json` | 读取 Prompt 内容及变量定义，按应用输入使用模板。 |
| MCP Server | `application/mcp-server-card+json` | 读取 MCP Server 描述，使用 MCP 客户端连接实际服务。 |

应用从结果中读取 `identifier`、`version`、`type` 和 `url`，再按 `url` 下载内容。搜索响应中的资源放在 `results`，列表响应放在 `items`，目录响应放在 `entries`；分页和下载示例见 [ARD 接入指南](../../../ecology/use-nacos-with-ard.md)。

### 3.1. Agent 的两种表示

一个 Agent 在单次 ARD 查询中最多返回一个条目。当前 `latest` 仅包含 A2A 接口且能导出完整 AgentCard 时，默认返回 A2A 表示；包含多种协议的定义优先返回 Nacos 表示。应用只支持 A2A 时，应按 A2A 媒体类型筛选。

是否能返回 A2A 表示取决于当前 `latest` 版本。即使旧版本支持 A2A，也不会因此在当前版本的 ARD 结果中返回旧 AgentCard。

Agent 下载内容属于指定版本的定义，不包含运行端点或实时健康状态。声明地址中的默认健康标记也不代表实际探活结果。需要按健康状态选择运行实例时，使用 [RAD](./rad-discovery.md) 发现端点，再由相应协议客户端调用。

## 4. 验证接入

1. 使用与应用相同的身份和命名空间搜索，确认能找到已发布的目标资源。
2. 获取结果中的 `url`，检查返回的版本和 `Content-Type` 是否符合应用预期。
3. Skill、Prompt 在工具或应用中验证加载；Agent、MCP Server 还需验证实际服务的网络连通性和调用凭据。

ARD 提供搜索、目录和内容获取。资源的编辑、发布及上下线仍通过 Nacos 控制台、[运维 API](../../admin/admin-api.md) 或 [Maintainer SDK](../../admin/maintainer-sdk.md) 完成。
