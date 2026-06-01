---
title: 可见性插件
keywords: [可见性, 插件, 鉴权, AI 管理中心]
description: 本文介绍 Nacos 可见性插件的用途、默认实现、配置方式，以及它和鉴权插件的关系。
sidebar:
    order: 2
---

# 可见性插件

可见性插件用于判断一个资源对当前调用者是否可见。它和鉴权插件经常配合使用，但不是同一件事。

- **鉴权** 判断“这个身份能不能对这个资源执行读或写操作”。
- **可见性** 判断“这个资源是否应该被这个身份看到，是否应该进入详情、列表或搜索结果”。

这个区别在 AI 管理中心中尤其重要。Skill、Prompt、AgentSpec 等资源可以是 `PUBLIC` 或 `PRIVATE`。一个资源即使已经上线，也可能因为调用者不是 Owner、不是管理员、也没有显式授权而不可见。

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

Nacos 默认提供名为 `nacos` 的可见性实现。它由默认 Nacos 鉴权实现提供，当前主要服务于 AI 管理中心资源。

默认行为如下：

| 场景 | 行为 |
| --- | --- |
| 新建资源未指定 `scope` | 默认使用 `PRIVATE`。 |
| 全局管理员访问 | 可以读取和写入所有可见性资源。 |
| Owner 访问自己的资源 | 可以读取和写入。 |
| 非 Owner 读取 `PUBLIC` 资源 | 允许读取。 |
| 非 Owner 写 `PUBLIC` 资源 | 不自动允许，仍需要写权限。 |
| 显式可见性授权 | 通过 `@@visibility/...` 资源交给鉴权插件判断。 |
| 匿名访问 AI 公共资源 | 仅在接口显式允许匿名且开启匿名 AI 访问时生效。 |
| 读取被拒绝 | 具体 API 可以返回未找到，以避免泄露资源存在。 |
| 写入被拒绝 | 返回权限不足。 |

列表和搜索接口不能先分页再在内存中过滤可见性。这样会导致 `totalCount` 不准、页面为空或延迟不可控。正确做法是在查询条件中提前加入可见性条件。

## 配置方式

默认配置中已经包含可见性插件配置：

```properties
nacos.plugin.visibility.enabled=true
nacos.plugin.visibility.type=nacos
```

如果使用默认 `nacos` 可见性实现，请同时开启 Nacos 鉴权能力。默认实现会复用鉴权上下文中的用户信息。

```properties
nacos.core.auth.system.type=nacos
nacos.core.auth.enabled=true
nacos.core.auth.admin.enabled=true
nacos.core.auth.console.enabled=true
```

插件专属配置可以使用以下前缀：

```properties
nacos.plugin.visibility.{serviceName}.*
```

例如自定义插件名是 `example`，可以读取：

```properties
nacos.plugin.visibility.example.timeout=3000
```

## 可见性 SPI

自定义可见性插件需要实现 `com.alibaba.nacos.plugin.visibility.spi.VisibilityService`。

| 方法 | 说明 |
| --- | --- |
| `getVisibilityServiceName()` | 返回插件名，需要和 `nacos.plugin.visibility.type` 对应。 |
| `init(properties)` | 初始化插件专属配置。 |
| `resolveDefaultScopeForCreate(identity, apiType, resourceType)` | 资源创建时，如果请求没有指定 `scope`，返回默认可见性。默认是 `PRIVATE`。 |
| `validateVisibility(identity, action, apiType, resource)` | 判断单个资源是否对当前身份可见或可写。 |
| `adviseQuery(identity, action, apiType, queryContext)` | 为列表和搜索生成可见性查询建议。 |

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
- `scope=PRIVATE` 表示资源默认只对 Owner 和管理员可见。
- 资源上线只表示它可被运行时查询，不代表所有人都能看到它。
- 写操作仍然需要 Owner 身份、管理员身份或显式写权限。

更多 AI 资源状态说明，请参考 [AI 资源生命周期](../manual/user/ai/ai-resource-lifecycle.md)。
