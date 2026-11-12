---
title: Agentic Resource Hub
keywords: [Nacos, Agentic Resource Hub, Skill, MCP, Agent, Prompt, AgentSpec, 跨 Namespace, 共享]
description: 五类资源的共享、发现、固定版本读取和导入，以及 Skill 的跨 Namespace 克隆。
sidebar:
    order: 3
---

# Agentic Resource Hub

Agentic Resource Hub 为 Skill、MCP、Agent、Prompt、AgentSpec 提供跨 Namespace 的共享、发现和复用能力。五类资源均可共享已上线的明确版本并导入目标 Namespace；只有 Skill 支持不经 Hub 的直接跨 Namespace 克隆。

本页描述包含 Hub 功能的开发构建，请确认部署的 Server、Console 和 SDK 包含对应实现；不能仅凭版本号判断已发布发行包具备这些功能。本页位于 `next`，已发布版本文档不受影响。

在各类资源的管理页面进入对应共享目录。Skill 使用 **Skill 管理 → 共享 Skill** 页签；其余类型提供各自的共享列表和详情。共享在同一 Nacos 集群内生效，不代表发布到外部资源市场。

## 1. 共享与复用

| 操作 | 权限要求 | 结果 |
|------|----------|------|
| 共享 | 源资源 READ、WRITE，资源启用且指定版本上线；除 Prompt 外还须为 PUBLIC | 在 Hub 中发布指向指定版本的引用 |
| 从 Hub 导入 | 可访问共享条目，并具有目标 Namespace 的 WRITE 权限 | 在目标 Namespace 创建独立草稿，不要求源 Namespace READ 权限 |
| 直接克隆（仅 Skill） | 源 Skill READ、目标 Namespace WRITE，并通过源资源可见性检查 | 从指定源版本创建独立草稿，无需先共享到 Hub |

Hub 条目使用 `hubEntryId` 标识，同名资源可以来自不同 Namespace。共享固定源资源与版本身份，不随 `latest` 自动变化；调整版本需显式提交并通过 CAS 检查。长整数 ID、`metaVersion` 在 JSON 中按字符串返回。

导入和克隆后的草稿保留来源及版本信息，拥有独立生命周期，不与源内容自动同步。

## 2. 启用条件

在 `${nacos.home}/conf/application.properties` 中配置：

```properties
nacos.ai.hub.enabled=true
```

默认值为 `true`。Hub 依赖 AI 模块；设置 `nacos.extension.ai.enabled=false` 或 `nacos.functionMode=microservice` 时不加载 AI 模块。

共享读取沿用所选 API 范围的鉴权及资源可见性配置。匿名浏览要求所选鉴权插件明确开启匿名 AI 访问并允许此操作，公开可见本身不代表绕过鉴权。共享、导入、复制和治理操作需要用户身份及对应权限。

服务端 `nacos.ai.hub.enabled` 能力和 `ai_hub_enabled` 状态，与 Java 运行时 SDK 的 `nacosAiAccessHub` 发现选项相互独立。SDK 选项默认为 `false`，只查询绑定命名空间。显式设置 `nacosAiAccessHub=true` 后，分别查询绑定命名空间和共享命名空间，再按当前命名空间在前、共享空间按热度顺序在后的规则组合分页。同名展示资源保留独立身份，以命名空间和不透明名称区分。`nacos-cli skill-search` 同样默认只查当前空间，`--hub` 开启组合发现，`--no-hub` 显式关闭共享发现。

配置说明见[系统参数](../../admin/system-configurations.md)。

## 3. 在控制台共享（以 Skill 为例）

1. 在 **AI 注册中心 → Skill 管理** 中选择源 Namespace 和 Skill。
2. 确认 Skill 已启用、可见范围为 PUBLIC，选择已上线的版本。
3. 在 **Hub 共享管理** 中选择 **共享到 Hub**。
4. 进入 **Skill 管理 → 共享 Skill**，按名称或单个业务标签筛选共享条目，查看共享版本和文件内容，或下载 ZIP 包。

共享计数与源 Skill 及版本计数独立。Skill 管理列表默认按共享更新时间降序，可用 `orderBy=download_count` 按 Hub 下载量排序；Client 搜索按共享热度排序。相同值按条目 ID 升序，筛选和排序先于分页。预览正文不增加下载量。

具有源 Skill 写入权限的用户可以管理共享；具有源 Skill 读取权限的用户可以从 Hub 跳转到源资源详情。

共享者可以调整共享版本或取消共享；管理员可以填写原因并强制下架共享。取消共享保留源 Skill 和已导入的独立草稿。

共享版本下线、源 Skill 停用、改为 PRIVATE 或被删除时，共享失效。源资源或版本被删除后以同名重建，不会自动恢复旧共享。

## 4. 导入到自己的 Namespace

在 Hub 详情中选择导入，填写有写入权限的目标 Namespace、目标 Skill 名称和目标版本。

- 目标版本默认为 `0.0.1`，导入后状态为 `draft`。
- 目标 Namespace 中已有同名 Skill 时返回冲突，不覆盖现有资源。
- 已撤销或失效的共享无法导入。
- 导入后按 [AI 资源生命周期](./ai-resource-lifecycle.md) 审核和发布。

API 和 SDK 调用方式见[运维 API](../../admin/admin-api.md#12-agentic-resource-hub) 和 [Maintainer SDK](../../admin/maintainer-sdk.md#13-agentic-resource-hub)。

## 5. 同集群跨 Namespace 克隆（仅 Skill）

通过 API 或 Maintainer SDK 指定源 Namespace、Skill 名称和已上线版本，以及目标 Namespace、名称和版本。源 Skill 必须已启用，调用方需具备源 READ 和目标 WRITE 权限，并通过源资源可见性检查。

使用 `POST /v3/admin/ai/hub/skills/clone` 或对应 Console 路由；Maintainer SDK 使用 `cloneHubSkill`。旧 `/copy` 路由和 `copyHubSkill` 方法已移除。目标为独立草稿，按普通生命周期审核和发布。兼容来源标记仍为 `DIRECT_COPY`。其余四类资源仅支持从 Hub 导入，没有直接克隆入口。

## 6. 关闭 Hub

```properties
nacos.ai.hub.enabled=false
```

修改配置后重启服务端，集群内各 Server 实例应保持一致。

关闭后：

- 控制台隐藏共享 Skill 页签、共享按钮和共享引用链接；直接访问共享页面会跳转到普通资源页面。刷新页面后生效。
- 五类资源的现有列表和搜索接口在选择共享命名空间时，通过参数和权限检查后返回空分页结果。
- Hub 详情、内容、下载、共享、调整、撤销、状态查询和导入返回 HTTP `501`，业务码为 `40001`。
- 已有共享数据保留；普通资源操作、Skill 直接克隆和源资源生命周期清理继续执行。

客户端可通过[获取 Nacos 集群状态信息](../../admin/admin-api.md#119-获取nacos集群状态信息)接口中的 `ai_hub_enabled` 字段查询 Hub 开关状态。

## 7. 通过现有 Skill 接口读取

> `__nacos_ai_hub__` 是保留的只读命名空间契约，不是业务命名空间，不得在其中创建资源。不传 `namespaceId` 仍仅查询 `public`；HTTP 接口不自动组合两个空间，也不增加 `source` 选择参数。

| 调用方 | 列表／搜索 | 详情／正文／下载 |
|---|---|---|
| Client | `GET /v3/client/ai/skills/search` | `GET /v3/client/ai/skills` 返回固定版本 ZIP |
| Admin | `GET /v3/admin/ai/skills/list` | `GET /v3/admin/ai/skills`、`/version`、`/version/download` |
| Console | `GET /v3/console/ai/skills/list` | `GET /v3/console/ai/skills`、`/version`、`/version/download` |

普通资源传业务命名空间，共享资源传 `namespaceId=__nacos_ai_hub__`。需要组合发现时，由 SDK 或 CLI 请求两个空间并合并结果，不新增 Client Hub 专用读取或跨类型 list Hub 接口。分享、调整、撤销、治理、导入和复制保留相应管理操作。

```shell
# /nacos 是本示例服务端的 Servlet context。
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" --get \
  'http://127.0.0.1:8848/nacos/v3/client/ai/skills/search' \
  --data-urlencode 'namespaceId=__nacos_ai_hub__' \
  --data-urlencode 'query=find' --data-urlencode 'pageNo=1' --data-urlencode 'pageSize=20'
```

共享发现结果包含 `discoverySource="HUB"`、不透明 `name`、按字符串序列化的 `hubEntryId`、`displayName`、`sourceDisplayName`、固定 `version` 和独立 `downloadCount`。普通结果使用 `discoverySource="NAMESPACE"`。获取共享资源时，将所选共享结果的 `name` 作为 `skillName`，并携带返回的 `version`，不要以展示名定位，也不要在版本不匹配时回退 latest。Admin/Console 沿用 `SkillSummary`、`SkillMeta` 和 `Skill` 模型；`SkillMeta.origin` 仍用于复制和导入溯源，与 `discoverySource` 分离。

成功 ZIP 响应为原始 `application/zip` 字节，共享下载带有 `X-Nacos-Hub-Entry-Id` 和 `X-Nacos-Skill-Resolved-Version` 响应头，保留真实 Skill 目录名称，仅增加共享条目计数。Maintainer SDK 在 `listSkills`、`getSkillMeta`、`getSkillVersionDetail` 和通用 `downloadSkillVersion` 方法中传入保留命名空间即可。

## 8. 四类扩展资源

| 类型 | 共享条件与内容 | 导入行为 |
|---|---|---|
| MCP | 已启用、PUBLIC、明确上线版本；保留原 MCP 详情、端点、配置和 Tools/Resources | PRIVATE 草稿；STDIO 不创建 Naming 服务，普通 REF 保留原引用，源自有 Direct 创建目标自有服务 |
| Agent | 已启用、PUBLIC、明确上线版本；读取固定源版本运行时端点快照 | PRIVATE 草稿，不复制动态端点、客户端或心跳 |
| Prompt | 已启用、明确上线版本；不新增 PUBLIC/scope 要求；保留模板、变量、审核和标签 | PRIVATE 草稿，之后按普通 Prompt 流程发布 |
| AgentSpec | 已启用、PUBLIC、明确上线版本；保留 AGENTS.md、资源文件和审核信息 | PRIVATE 草稿，内容与来源独立保存 |

读取复用各资源原有路径，传入 `namespaceId=__nacos_ai_hub__`；以返回的不透明名称定位，不用展示名。错误版本不得回退 `latest`。Client 保持原生内容 DTO，不能要求 Agent 或 AgentSpec 内容响应一定包含顶层 `hub`。

“查看固定源版本”需独立通过源 READ 与可见性检查。`sourceReadable=false` 时不返回源 Namespace ID 和名称，但不影响合法 Hub 内容读取。

MCP Direct 导入要求无歧义的持久固定地址，并检查目标服务冲突。源取消共享不删除已导入资源；删除目标不删除源或 REF 服务。导入复制资源定义和必要服务注册，不代表部署了新的 MCP 应用；REF 运行仍依赖原服务。

完整 Admin、Console、Client 路径、管理参数和响应见 [Hub 扩展接口参考](../../admin/resource-hub-api.md)。

## 9. SDK 与 CLI

Maintainer SDK 分别通过 `skill()`、`mcp()`、`agent()`、`prompt()`、`agentSpec()` 获取对应 facade，使用类型化共享与导入请求。共享读取使用原有资源方法及保留 Namespace；导入不会自动发布。

当前 CLI 的 Skill、AgentSpec 搜索与下载可使用 Hub。下载到本地不等于导入 Nacos Namespace；CLI 尚无五类完整的共享、调整、取消和导入命令。请检查安装版本的 `--help`，共享管理自动化使用 HTTP API 或 Maintainer SDK。

## 10. 继续阅读

- [Skill 管理](./skill-registry.md)
- [运维 API](../../admin/admin-api.md#12-agentic-resource-hub)
- [Maintainer SDK](../../admin/maintainer-sdk.md#13-agentic-resource-hub)
- [Hub 扩展接口参考](../../admin/resource-hub-api.md)
- [AI 资源生命周期](./ai-resource-lifecycle.md)
