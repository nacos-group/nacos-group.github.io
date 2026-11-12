---
title: Hub 扩展接口参考
keywords: [Nacos, Hub, MCP, Agent, Prompt, AgentSpec, API]
description: MCP、Agent、Prompt、AgentSpec 的 Hub 管理固定路由、请求参数、返回模型和共享读取契约。
sidebar:
    order: 20
---

# Hub 扩展接口参考

本页补充 [Admin API](./admin-api.md#12-agentic-resource-hub) 和 [Console API](./console-api.md#13-agentic-resource-hub) 中的 Skill 接口，涵盖其余四类资源。以下管理 API 的源码起始版本为 `3.3.0`；部署构建必须实际包含 Hub 实现，不能据版本号认定已发布发行包包含开发分支功能。

## 1. 地址、身份与类型边界

Admin 示例基址为 `http://127.0.0.1:8848`，下表已包含默认 `/nacos` context；Console 基址为 `http://127.0.0.1:8080`，没有 `/nacos` 前缀。自定义 context 或代理时按部署调整。请求使用当前鉴权插件要求的身份；下文以 `accessToken` Header 为例。

以下是独立的固定路由，不接受 `{resourceType}` 占位参数。每行对应一个操作；同一操作在四类资源上的参数与返回类型相同，类型由路径确定。五类均支持导入，只有 Skill 有 `/clone`。本页四类资源没有 `/copy` 或 `/clone`，也没有专用的 `/hub/.../list`、`detail`、`content`、`download` 读接口。

### 1.1. MCP

| 操作与参数说明 | 方法 | Admin URL | Console URL |
|---|---|---|---|
| [共享](#21-共享) | POST | `/nacos/v3/admin/ai/hub/mcp/share` | `/v3/console/ai/hub/mcp/share` |
| [调整版本](#22-调整共享版本) | POST | `/nacos/v3/admin/ai/hub/mcp/adjust` | `/v3/console/ai/hub/mcp/adjust` |
| [取消共享](#23-取消共享) | POST | `/nacos/v3/admin/ai/hub/mcp/unshare` | `/v3/console/ai/hub/mcp/unshare` |
| [强制下架](#24-强制下架) | POST | `/nacos/v3/admin/ai/hub/mcp/force-unshare` | `/v3/console/ai/hub/mcp/force-unshare` |
| [源共享状态](#25-查询源共享状态) | GET | `/nacos/v3/admin/ai/hub/mcp/source-share` | `/v3/console/ai/hub/mcp/source-share` |
| [治理状态](#26-查询治理状态) | GET | `/nacos/v3/admin/ai/hub/mcp/governance-state` | `/v3/console/ai/hub/mcp/governance-state` |
| [导入](#27-从-hub-导入) | POST | `/nacos/v3/admin/ai/hub/mcp/import` | `/v3/console/ai/hub/mcp/import` |

### 1.2. Agent

| 操作与参数说明 | 方法 | Admin URL | Console URL |
|---|---|---|---|
| [共享](#21-共享) | POST | `/nacos/v3/admin/ai/hub/agent/share` | `/v3/console/ai/hub/agent/share` |
| [调整版本](#22-调整共享版本) | POST | `/nacos/v3/admin/ai/hub/agent/adjust` | `/v3/console/ai/hub/agent/adjust` |
| [取消共享](#23-取消共享) | POST | `/nacos/v3/admin/ai/hub/agent/unshare` | `/v3/console/ai/hub/agent/unshare` |
| [强制下架](#24-强制下架) | POST | `/nacos/v3/admin/ai/hub/agent/force-unshare` | `/v3/console/ai/hub/agent/force-unshare` |
| [源共享状态](#25-查询源共享状态) | GET | `/nacos/v3/admin/ai/hub/agent/source-share` | `/v3/console/ai/hub/agent/source-share` |
| [治理状态](#26-查询治理状态) | GET | `/nacos/v3/admin/ai/hub/agent/governance-state` | `/v3/console/ai/hub/agent/governance-state` |
| [导入](#27-从-hub-导入) | POST | `/nacos/v3/admin/ai/hub/agent/import` | `/v3/console/ai/hub/agent/import` |

### 1.3. Prompt

| 操作与参数说明 | 方法 | Admin URL | Console URL |
|---|---|---|---|
| [共享](#21-共享) | POST | `/nacos/v3/admin/ai/hub/prompt/share` | `/v3/console/ai/hub/prompt/share` |
| [调整版本](#22-调整共享版本) | POST | `/nacos/v3/admin/ai/hub/prompt/adjust` | `/v3/console/ai/hub/prompt/adjust` |
| [取消共享](#23-取消共享) | POST | `/nacos/v3/admin/ai/hub/prompt/unshare` | `/v3/console/ai/hub/prompt/unshare` |
| [强制下架](#24-强制下架) | POST | `/nacos/v3/admin/ai/hub/prompt/force-unshare` | `/v3/console/ai/hub/prompt/force-unshare` |
| [源共享状态](#25-查询源共享状态) | GET | `/nacos/v3/admin/ai/hub/prompt/source-share` | `/v3/console/ai/hub/prompt/source-share` |
| [治理状态](#26-查询治理状态) | GET | `/nacos/v3/admin/ai/hub/prompt/governance-state` | `/v3/console/ai/hub/prompt/governance-state` |
| [导入](#27-从-hub-导入) | POST | `/nacos/v3/admin/ai/hub/prompt/import` | `/v3/console/ai/hub/prompt/import` |

### 1.4. AgentSpec

| 操作与参数说明 | 方法 | Admin URL | Console URL |
|---|---|---|---|
| [共享](#21-共享) | POST | `/nacos/v3/admin/ai/hub/agentspec/share` | `/v3/console/ai/hub/agentspec/share` |
| [调整版本](#22-调整共享版本) | POST | `/nacos/v3/admin/ai/hub/agentspec/adjust` | `/v3/console/ai/hub/agentspec/adjust` |
| [取消共享](#23-取消共享) | POST | `/nacos/v3/admin/ai/hub/agentspec/unshare` | `/v3/console/ai/hub/agentspec/unshare` |
| [强制下架](#24-强制下架) | POST | `/nacos/v3/admin/ai/hub/agentspec/force-unshare` | `/v3/console/ai/hub/agentspec/force-unshare` |
| [源共享状态](#25-查询源共享状态) | GET | `/nacos/v3/admin/ai/hub/agentspec/source-share` | `/v3/console/ai/hub/agentspec/source-share` |
| [治理状态](#26-查询治理状态) | GET | `/nacos/v3/admin/ai/hub/agentspec/governance-state` | `/v3/console/ai/hub/agentspec/governance-state` |
| [导入](#27-从-hub-导入) | POST | `/nacos/v3/admin/ai/hub/agentspec/import` | `/v3/console/ai/hub/agentspec/import` |

## 2. 管理操作契约

POST 使用 `application/x-www-form-urlencoded`；GET 参数在 Query 中。ID 为正的 64 位整数；JSON 返回字符串，调用者不要转为 JavaScript `number`。下例 `101`、`1` 仅为示例，后续请求应使用实际返回的 ID 和最新 `metaVersion`。

### 2.1. 共享

需源资源 READ、WRITE 权限。源资源必须启用，指定版本已上线；MCP、Agent、AgentSpec 必须为 PUBLIC，Prompt 不增加 scope 要求。版本固定，不自动跟随 `latest`。

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|---|---|---|---|
| `sourceNamespaceId` | `string` | **是** | 源 Namespace，不能为 Hub 保留 Namespace。 |
| `sourceName` | `string` | **是** | 源资源实际名称；Prompt 为 promptKey。 |
| `sourceVersion` | `string` | **是** | 明确的已上线版本，不接受 `latest`。 |
| `expectedSourceResourceId` | `string` | 否 | 预期源资源 ID，校验固定资源身份。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|---|---|---|
| `data` | `HubShareResult` | [共享操作结果](#31-hubshareresult)。重复共享可返回 `ALREADY_SHARED`。 |

#### 示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST \
  'http://127.0.0.1:8848/nacos/v3/admin/ai/hub/mcp/share' \
  --data-urlencode 'sourceNamespaceId=public' --data-urlencode 'sourceName=weather-mcp' \
  --data-urlencode 'sourceVersion=1.0.0'
```

共享其他类型时使用索引中的固定 URL 和对应源名称；字段不变。

### 2.2. 调整共享版本

需源 READ、WRITE，目标源版本满足共享条件。通过 `expectedMetaVersion` 执行 CAS，过期修订返回冲突；重新读取状态后再决定是否重试。

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|---|---|---|---|
| `hubEntryId` | `string` | **是** | 对应类型的 Hub 条目 ID。 |
| `targetVersion` | `string` | **是** | 新的明确上线源版本，不是导入目标版本。 |
| `expectedMetaVersion` | `string` | **是** | 最近获取的条目修订号。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|---|---|---|
| `data` | `HubShareResult` | 新状态和修订号；结果可为 `ADJUSTED` 或 `UNCHANGED`。 |

#### 示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST \
  'http://127.0.0.1:8848/nacos/v3/admin/ai/hub/mcp/adjust' \
  --data-urlencode 'hubEntryId=101' --data-urlencode 'targetVersion=2.0.0' \
  --data-urlencode 'expectedMetaVersion=1'
```

### 2.3. 取消共享

需源 WRITE。源已变为 private 或版本下线时，仍可由有权限者执行清理。不会删除源或已导入目标。

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|---|---|---|---|
| `hubEntryId` | `string` | **是** | 对应类型的共享条目 ID。 |
| `expectedMetaVersion` | `string` | **是** | 最近读取的条目修订号。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|---|---|---|
| `data` | `HubShareResult` | `active=false`；结果可为 `UNSHARED` 或 `ALREADY_UNSHARED`。 |

#### 示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST \
  'http://127.0.0.1:8848/nacos/v3/admin/ai/hub/mcp/unshare' \
  --data-urlencode 'hubEntryId=101' --data-urlencode 'expectedMetaVersion=2'
```

### 2.4. 强制下架

需独立的全局管理员治理权限；普通资源 ACL 不能替代管理员身份。操作记录下架原因并通过 CAS 检查。

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|---|---|---|---|
| `hubEntryId` | `string` | **是** | 对应类型的共享条目 ID。 |
| `expectedMetaVersion` | `string` | **是** | 最近读取的条目修订号。 |
| `reason` | `string` | **是** | 非空下架原因，最多 512 个字符。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|---|---|---|
| `data` | `HubShareResult` | 下架结果；`active=false`。 |

#### 示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST \
  'http://127.0.0.1:8080/v3/console/ai/hub/mcp/force-unshare' \
  --data-urlencode 'hubEntryId=101' --data-urlencode 'expectedMetaVersion=2' \
  --data-urlencode 'reason=Retired by administrator'
```

### 2.5. 查询源共享状态

虽然为 GET，仍需源 WRITE；不是公开目录接口，也不要求源当前仍可共享。源资源存在但未共享时 `data=null`。

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|---|---|---|---|
| `sourceNamespaceId` | `string` | **是** | 源 Namespace。 |
| `sourceName` | `string` | **是** | 源资源实际名称。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|---|---|---|
| `data` | `HubResourceShareState` | [精简状态](#32-hubresourcesharestate)或 `null`。 |

#### 示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" --get \
  'http://127.0.0.1:8848/nacos/v3/admin/ai/hub/mcp/source-share' \
  --data-urlencode 'sourceNamespaceId=public' --data-urlencode 'sourceName=weather-mcp'
```

### 2.6. 查询治理状态

需全局管理员治理权限，不因调用者拥有 Hub READ 或某个普通资源 ACL 而开放。

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|---|---|---|---|
| `hubEntryId` | `string` | **是** | 对应类型的 Hub 条目 ID。 |

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|---|---|---|
| `data` | `HubResourceShareState` | 包含用于治理 CAS 的修订号，不返回数据库或文件存储信息。 |

#### 示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" --get \
  'http://127.0.0.1:8080/v3/console/ai/hub/mcp/governance-state' \
  --data-urlencode 'hubEntryId=101'
```

### 2.7. 从 Hub 导入

需合法 Hub 读取权限与目标 Namespace WRITE，不要求源 Namespace READ。创建独立 PRIVATE 草稿，不自动审核、上线或同步。目标同名、版本或依赖冲突时不覆盖已有资源。

#### 请求参数

| 参数名 | 类型 | 必填 | 参数描述 |
|---|---|---|---|
| `hubEntryId` | `string` | **是** | 固定共享条目 ID；路径确定资源类型。 |
| `targetNamespaceId` | `string` | **是** | 有写权限的业务 Namespace，不能为保留 Hub Namespace。 |
| `targetName` | `string` | **是** | 符合该类型命名规则的新名称。 |
| `targetVersion` | `string` | 否 | 草稿版本，默认 `0.0.1`，不接受 `latest`。 |
| `mcpRemoteServerConfig` | `string` | 否 | 仅 MCP；`McpServerRemoteServiceConfig` 的 JSON 字符串，最多 65536 字符。通常省略；如传入必须与固定源配置一致，不能用它覆盖或重绑连接。其他三类禁止设置此字段。 |

不能同时传入 `sourceNamespaceId`、`sourceName` 或 `sourceVersion`，即使其值为空也不能作为第二套来源选择器。

#### 返回数据

| 参数名 | 参数类型 | 描述 |
|---|---|---|
| `data` | `HubResourceTransferResult` | [目标草稿与来源信息](#33-hubresourcetransferresult)。 |

#### 示例

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" -X POST \
  'http://127.0.0.1:8848/nacos/v3/admin/ai/hub/mcp/import' \
  --data-urlencode 'hubEntryId=101' --data-urlencode 'targetNamespaceId=team-b' \
  --data-urlencode 'targetName=weather-imported' --data-urlencode 'targetVersion=0.0.1'
```

MCP STDIO 不创建 Naming 服务；普通 REF 保留源引用；源自有 Direct 从唯一、合法的持久固定地址创建目标自有服务。目标服务已存在时冲突，导入失败仅清理本次拥有的状态。删除目标不删除源或 REF 服务；源撤销不删除已导入目标。Agent 导入不复制动态运行时注册。

## 3. 响应模型

成功 JSON 使用 `Result<T>`，根层级为 `code`、`message`、`data`，不是 `data.data`。管理响应仅供已授权调用者；不要把来源身份字段直接公开到目录。

### 3.1. HubShareResult

| 参数名 | 参数类型 | 描述 |
|---|---|---|
| `data` | `HubShareResult` | 共享生命周期操作结果。 |
| `data.hubEntryId` | `string` | 共享条目 ID。 |
| `data.displayName` | `string` | 展示名称，不作为读取身份。 |
| `data.sourceNamespaceId` | `string` | 授权管理操作涉及的源 Namespace。 |
| `data.sourceResourceId` | `string` | 固定源资源 ID。 |
| `data.sourceName` | `string` | 源资源名称。 |
| `data.sourceVersionId` | `string` | 固定源版本 ID。 |
| `data.sourceVersion` | `string` | 固定源版本。 |
| `data.metaVersion` | `string` | 后续写操作的 CAS 修订号。 |
| `data.outcome` | `HubShareOutcome` | `CREATED`、`ALREADY_SHARED`、`REACTIVATED`、`ADJUSTED`、`UNCHANGED`、`UNSHARED`、`ALREADY_UNSHARED`、`FORCE_UNSHARED`。 |
| `data.active` | `boolean` | 当前共享是否启用。 |

### 3.2. HubResourceShareState

| 参数名 | 参数类型 | 描述 |
|---|---|---|
| `data` | `HubResourceShareState` | 源写权限或管理员授权后的状态；可为 `null`。 |
| `data.hubEntryId` | `string` | 共享条目 ID。 |
| `data.metaVersion` | `string` | CAS 修订号。 |
| `data.sharedVersion` | `string` | 当前明确共享版本。 |
| `data.active` | `boolean` | 启用状态。 |

### 3.3. HubResourceTransferResult

| 参数名 | 参数类型 | 描述 |
|---|---|---|
| `data` | `HubResourceTransferResult` | 独立目标草稿。 |
| `data.targetNamespaceId` | `string` | 目标 Namespace。 |
| `data.targetName` | `string` | 目标名称。 |
| `data.draftVersion` | `string` | 新草稿版本。 |
| `data.status` | `string` | `draft`。 |
| `data.origin` | `string` | 本页四类导入为 `HUB`。 |
| `data.targetResourceId` | `string` | 目标资源 ID。 |
| `data.hubEntryId` | `string` | 固定来源的共享条目 ID。 |
| `data.resourceType` | `string` | `mcp`、`agent`、`prompt` 或 `agentspec`。 |

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "targetNamespaceId": "team-b",
    "targetName": "weather-imported",
    "draftVersion": "0.0.1",
    "status": "draft",
    "origin": "HUB",
    "targetResourceId": "201",
    "hubEntryId": "101",
    "resourceType": "mcp"
  }
}
```

## 4. 通过原有资源接口读取

以下均为 GET，并须传 `namespaceId=__nacos_ai_hub__`。Admin 路径加部署的 `/nacos` context；Console 路径使用 Console 端口。筛选、分页和响应沿用该资源既有接口，不能把五类模型统一替换为自定义 Hub 内容 DTO。

| 类型 | Admin / Console 已有资源路径 | Client 已有路径 | 身份参数 |
|---|---|---|---|
| MCP | `/v3/admin/ai/mcp`、`/v3/console/ai/mcp`，及各自 `/list`、`/versions`、`/version` | `/v3/client/ai/mcp/search`、`/v3/client/ai/mcp` | `mcpName` 为共享目录返回的不透明名称 |
| Agent | `/v3/admin/ai/agents`、`/v3/console/ai/agents`，及 `/list`、`/versions`、`/version`、`/runtime-endpoints` | `/v3/client/ai/agents/search`、`/v3/client/ai/agents` | `agentName` 为不透明名称；运行时快照沿用 `protocol` |
| Prompt | `/v3/admin/ai/prompt`、`/v3/console/ai/prompt` 的 `/list`、`/governance`、`/versions`、`/version`、`/version/download`；保留 `/metadata`、`/detail` 兼容读取 | `/v3/client/ai/prompt/search`、`/v3/client/ai/prompt` | `promptKey` 为不透明名称；管理详情用 `/governance` |
| AgentSpec | `/v3/admin/ai/agentspecs`、`/v3/console/ai/agentspecs`，及 `/list`、`/version`、`/version/meta` | `/v3/client/ai/agentspecs/search`、`/v3/client/ai/agentspecs` | Admin/Console 为 `agentSpecName`，Client 为 `name` |

```shell
curl -H "accessToken: ${NACOS_ACCESS_TOKEN}" --get \
  'http://127.0.0.1:8848/nacos/v3/client/ai/agentspecs' \
  --data-urlencode 'namespaceId=__nacos_ai_hub__' \
  --data-urlencode 'name=101' --data-urlencode 'version=1.0.0'
```

读取须通过 Hub READ 和共享有效性检查，不额外要求源 READ。匿名访问取决于所选鉴权插件与匿名 AI 配置；PUBLIC 本身不绕过鉴权。资源身份和版本必须匹配当前共享引用，不得回退 `latest`。重复冲突的 Namespace 参数会被拒绝。共享被撤销、固定源版本下线、源被删除或停用后，内容不可读；除 Prompt 外，源改为 PRIVATE 也会撤销共享有效性。

四类管理/搜索模型中的 `hub` 元信息使用 `HubResourceDiscoveryInfo`，包含 `hubEntryId`、`resourceType`、不透明 `resourceName`、固定 `version`、`sourceDisplayName`、`author`、`downloadCount`、`updateTime` 和 `sourceReadable`。`sourceNamespaceId`、`sourceName` 仅在独立的源 READ 与可见性检查通过后返回；不能要求调用者先有源权限才能读 Hub。

Client Agent 保持 `AgentDiscoveryResult`，AgentSpec 保持 `AgentSpec`，不要求内容响应具有顶层 `hub`。MCP 保持原详情结构，Prompt 保持原模板 DTO。不能用响应缺少 `hub` 判断所有 Client 读取失败。普通 Namespace 的读取语义不变。

## 5. 关闭能力与异常

`nacos.ai.hub.enabled=false` 时，在完成身份和参数检查后，共享目录返回空页，Hub 内容和七类管理操作返回 HTTP `501` / `API_FUNCTION_DISABLED`（`40001`）。Skill 直接克隆不受此开关影响。

参数非法通常为 HTTP `400` / `PARAMETER_VALIDATE_ERROR`（`20002`）；权限拒绝为 `403`，CAS、同名或服务依赖冲突为 `409`。不存在或失效资源按照各资源接口的既有错误模型返回，不能假定所有类型的业务错误码相同。来源存储系统故障应返回脱敏 5xx，不能伪装为空目录。错误结果与成功结果应分开处理。

## 6. SDK 与进一步阅读

- [Maintainer SDK](./maintainer-sdk.md#13-agentic-resource-hub)：类型化请求与 facade。
- [Agentic Resource Hub 使用指南](../user/ai/resource-hub.md)：权限、生命周期、MCP 所有权及 CLI 范围。
- [Client API](../user/open-api.md)：普通资源接口的搜索参数与内容结构。
