---
title: 可见性插件
keywords: [可见性, 插件, 鉴权, AI 管理中心]
description: 本文介绍 Nacos 可见性插件的用途、默认实现、配置方式，以及它和鉴权插件的关系。
sidebar:
    order: 6
---

# 可见性插件

可见性插件用于判断一个资源对当前调用者是否可见。它和鉴权插件经常配合使用，但不是同一件事。

- **鉴权** 判断“这个身份能不能对这个资源执行读或写操作”。
- **可见性** 判断“这个资源是否应该被这个身份看到，是否应该进入详情、列表或搜索结果”。

这个区别在 AI 管理中心中尤其重要。Agent、MCP Server、Skill、Prompt、AgentSpec 都可以设置为 `PUBLIC` 或 `PRIVATE`。一个资源即使已经上线，也可能因为调用者不是 Owner、不是管理员、也没有显式授权而不可见。

## 适用场景

可见性插件适合处理这些问题：

- 列表和搜索接口只返回调用者可见的资源。
- 私有资源不应该通过列表数量、空页或错误信息泄露存在性。
- 资源 Owner 可以管理自己的资源。
- 公共资源可以被更多调用者读取，但不代表任何人都能写。
- 平台可以用显式授权让某些角色看到或操作特定资源。

## 和鉴权插件的关系

可见性插件可以独立判断，也可以把显式授权交给当前鉴权插件判断。默认实现采用后一种方式。

默认实现中，可见性插件会把显式可见性权限映射成一个特殊资源：

```text
@@visibility/{namespaceId}/{resourceType}/{resourceName}
```

然后它把这个资源交给当前鉴权插件做权限判断。这样可以保持职责清晰：

| 能力 | 负责内容 |
| --- | --- |
| 鉴权插件 | 认证身份，并判断身份是否有某个资源的读写权限。 |
| 可见性插件 | 判断资源是否应出现在详情、列表和搜索结果里。 |

## 默认可见性实现

Nacos 默认提供 `visibility:nacos`。`visibility` 是 `ROUTED`、非 critical、`STANDARD` 类型；默认实现没有私有 definitions，因此 `configurable=false`。

### 新建资源的默认 scope

Nacos 3.3 使用内置 `visibility:nacos` 且该插件可用时，未显式指定 scope 的新资源采用以下默认值：

| 资源类型 | 默认 scope |
| --- | --- |
| Agent | `PUBLIC` |
| MCP Server | `PUBLIC` |
| Skill | `PRIVATE` |
| Prompt | `PRIVATE` |
| AgentSpec | `PRIVATE` |

这些规则只用于首次创建资源。创建新版本、发布、运行端点注册及重试不会把已有 `PRIVATE` 资源改成 `PUBLIC`。自定义可见性插件可以按资源类型提供不同默认值，不能将上表推广为所有插件的规则。

插件关闭、所选实现不可用或返回空默认值时，新建资源的 scope 回退为 `PRIVATE`。但插件关闭或不可用时，当前 AI 资源访问会跳过可见性检查，不能把这个回退值当作访问保护。使用内置实现时，对应 API 的鉴权若被关闭，可见性检查也会放行。需要保护私有资源时，应同时保留鉴权和可见性插件。

### 读取和写入

以下为内置插件的可见性判断，调用方还需满足相应接口的鉴权要求：

| 场景 | 行为 |
| --- | --- |
| 全局管理员访问 | 可以读取和写入所有可见性资源。 |
| Owner 访问自己的资源 | 可以读取和写入。 |
| 非 Owner 读取 `PUBLIC` 资源 | 允许读取。 |
| 非 Owner 写 `PUBLIC` 资源 | 不自动允许，仍需要写权限。 |
| 显式可见性授权 | 通过 `@@visibility/...` 资源交给鉴权插件判断。 |
| 匿名访问 AI 公共资源 | 仅在接口显式允许匿名且开启匿名 AI 访问时生效。 |
| 读取被拒绝 | 具体 API 可以返回未找到，以避免泄露资源存在。 |
| 写入被拒绝 | 返回权限不足。 |

列表和搜索接口不能先分页再在内存中过滤可见性。这样会导致 `totalCount` 不准、页面为空或延迟不可控。正确做法是在查询条件中提前加入可见性条件。

## 修改资源的 scope

`scope` 是整个资源的可见范围，适用于该资源的各个版本；它与名为 `public` 的命名空间无关。修改 scope 不会自动发布版本、启用资源，也不会修改实际 Agent 或 MCP Server 的业务鉴权。

Agent、MCP 的创建和发布请求不接受 scope 参数。需要私有发布时，先创建草稿，通过独立 scope 接口设为 `PRIVATE`，再提交发布。MCP SDK 的直接发布方式可能直接上线，需要预先确认可见范围，或改用[草稿发布流程](../manual/user/ai/mcp-registry.md)。

按[配置访问凭据](../manual/user/auth.mdx)登录并保存 `NACOS_ACCESS_TOKEN`。下面分别以已创建的 Agent `route-planner` 和 MCP Server `weather-service` 为例，按需选择命令并替换资源名；调用账号需具备接口写权限，且通过该资源的写可见性检查。

```bash
curl -sS -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/agents/scope' \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  --data-urlencode 'namespaceId=public' \
  --data-urlencode 'agentName=route-planner' \
  --data-urlencode 'scope=PRIVATE'
```

```bash
curl -sS -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/ai/mcp/scope' \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  --data-urlencode 'namespaceId=public' \
  --data-urlencode 'mcpName=weather-service' \
  --data-urlencode 'scope=PRIVATE'
```

改为公开时使用 `scope=PUBLIC`。这些接口不传 version；完整参数与其他资源的 scope 操作见[运维 API](../manual/admin/admin-api.md)，Java 管理应用也可使用[运维 SDK](../manual/admin/maintainer-sdk.md)。

修改后先查询资源确认 scope，再用实际业务账号验证详情、列表和发现结果。不要只用管理员账号验证私有可见性。向指定身份共享私有资源时，应使用显式可见性授权，而不是为了单个调用方把资源改为公开；可见性授权与接口权限的关系见[鉴权插件](./auth-plugin.md)。

## 配置方式

需要区分能力总开关、历史选择和实现状态：

```properties
# 能力总开关：关闭时不执行，并延迟首次加载
nacos.plugin.visibility.enabled=true

# 内置实现的初始统一状态
nacos.plugin.visibility.nacos.enabled=true

# 启动时选择 AI 资源使用的实现，修改后需重启
nacos.plugin.visibility.type=nacos
```

family gate 默认开启。关闭后即使实现仍显示 loaded/enabled 也不会执行；重新开启会在尚未加载时触发一次发现、状态恢复和配置 apply。持久化统一状态优先于 `type` 和静态 `{serviceName}.enabled`。

如果使用默认实现，请同时开启 Nacos 鉴权。它复用鉴权上下文中的用户信息。

```properties
nacos.plugin.auth.type=nacos
nacos.core.auth.enabled=true
nacos.core.auth.admin.enabled=true
nacos.core.auth.console.enabled=true
```

自定义实现只有声明 `PluginConfigSpec` definitions 后才可配置，canonical full key 为：

```properties
nacos.plugin.visibility.{serviceName}.{itemKey}
```

不要把未声明的任意属性当作统一配置。旧二进制实现或零 definition 实现仍可加载，但显示 `configurable=false`。

## 可见性 SPI

自定义可见性插件需要实现 `com.alibaba.nacos.plugin.visibility.spi.VisibilityService`。

| 方法 | 说明 |
| --- | --- |
| `getVisibilityServiceName()` | 返回稳定 pluginName。 |
| `init(properties)` | 已废弃的旧配置回调，只用于没有 definitions 的兼容实现。 |
| `resolveDefaultScopeForCreate(identity, apiType, resourceType)` | 资源首次创建时决定默认 scope。SPI 默认方法返回 `PRIVATE`；内置实现对 Agent、MCP 返回 `PUBLIC`，自定义实现可覆盖。 |
| `validateVisibility(identity, action, apiType, resource)` | 判断单个资源是否对当前身份可见或可写。 |
| `adviseQuery(identity, action, apiType, queryContext)` | 为列表和搜索生成可见性查询建议。 |

`VisibilityService` 继承 `PluginConfigSpec`。新实现应声明 key/alias/type/default/required/sensitive/effectMode，实现原子 `applyConfig` 并返回当前快照。统一配置实现不会再调用旧 `init(Properties)`。运行时路由在调用前检查 `visibility:{serviceName}` 状态。

## 查询建议 QueryAdvisor

列表和搜索接口会使用 `QueryAdvisor` 把可见性转换为查询条件。

| 建议 | 说明 |
| --- | --- |
| `ALL` | 不增加可见性过滤，通常用于管理员。 |
| `PUBLIC` | 只返回公共资源。匿名调用者通常使用该策略。 |
| `OWNER` | 只返回 Owner 是当前身份的资源。 |
| `PUBLIC_AND_OWNER` | 返回公共资源和当前身份拥有的私有资源。 |
| `AuthorizedResources` | 额外包含显式授权的资源。 |

如果存储层支持条件查询，应优先在存储查询中合并这些条件，而不是把所有资源加载到内存后再过滤。

## AI 管理中心中的影响

AI 管理中心资源会同时受到生命周期、可见性和鉴权影响：

- `scope=PUBLIC` 表示资源可以被非 Owner 读取。
- `scope=PRIVATE` 表示资源默认只对 Owner 和管理员可见，也可以通过显式授权共享给其他身份。
- 资源上线只表示它可被运行时查询，不代表所有人都能看到它。
- 写操作仍然需要 Owner 身份、管理员身份或显式写权限。

更多 AI 资源状态说明，请参考 [AI 资源生命周期](../manual/user/ai/ai-resource-lifecycle.md)。
