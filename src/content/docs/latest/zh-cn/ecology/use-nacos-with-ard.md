---
title: ARD 接入指南
keywords: [Nacos, ARD, Agentic Resource Discovery, AI 资源发现, 生态融合]
description: 启用 Nacos 3.3 ARD，接入资源搜索、分类统计、目录发现和资源下载。
sidebar:
    order: 9.1
---

# ARD 接入指南

[ARD（Agentic Resource Discovery）](https://agenticresourcediscovery.org/) 是面向 AI 资源描述、搜索与发现的开放规范。[官方规范](https://agenticresourcediscovery.org/spec/)署名作者包括 Junjie Bu（Google）、R. V. Guha（Microsoft）和 Shaun Smith（Hugging Face），规范源码见[官方 GitHub 仓库](https://github.com/ards-project/ard-spec)。

Nacos 3.3 提供 ARD 协议兼容接口，支持搜索 Agent、Skill、Prompt 和 MCP Server，并获取对应的资源内容。

本文介绍服务端配置和 HTTP 接入。资源发布条件、返回类型及使用方式见 [AI 管理中心的 ARD 资源发现](../manual/user/ai/ard-discovery.md)。如果应用需要发现 Agent 的运行端点或订阅变更，请阅读 [RAD 接入指南](../manual/user/ai/rad-discovery.md)；RAD 是 Remote Agent Discovery，与 ARD 的用途不同。

## 1. 启用 ARD

在 Nacos Server 的 `conf/application.properties` 中配置：

```properties
nacos.ai.ard.enabled=true
nacos.ai.resource.search.enabled=true
nacos.ai.registry.port=9080
nacos.ai.ard.catalog.base-url=http://127.0.0.1:9080
```

重启 Nacos Server 后，ARD 在独立的 HTTP 端口提供服务。上面的 base URL 适合本机验证，其他机器接入时需改为客户端可访问的地址。

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| `nacos.ai.ard.enabled` | `false` | 开启 ARD 接口。无需同时开启 MCP Registry 或 Skill Registry 兼容接口。 |
| `nacos.ai.resource.search.enabled` | `true` | AI 资源搜索开关。启用 ARD 时必须保持开启，否则 Nacos 启动失败。 |
| `nacos.ai.registry.port` | `9080` | ARD 与其他 AI Registry 兼容接口共用的端口。 |
| `nacos.ai.ard.catalog.base-url` | 未配置 | 用于生成目录、搜索结果中的完整访问地址。未配置时从当前请求推导；通过网关接入时应显式配置。 |
| `nacos.ai.ard.catalog.host.identifier` | `nacos` | 目录中的主机标识，同时用于生成资源标识。部署到团队环境时建议使用自己管理的域名。 |

已有集群先按[升级手册](../manual/admin/upgrading.mdx)完成 3.3 升级和数据库初始化。普通关键词搜索不需要配置向量模型或安装 pgvector。

### 1.1. 通过网关访问

`nacos.ai.ard.catalog.base-url` 应填写**适配器的完整对外地址**，可以包含网关路径前缀。例如：

```properties
nacos.ai.ard.catalog.base-url=https://nacos.example.com/ard
```

此时返回的资源 URL 以 `https://nacos.example.com/ard/v3/ai/ard/` 开头。网关需要把 `/ard/` 下的请求转发到适配器端口，并去掉该前缀。该配置只影响返回的 URL，不会创建网关路由，也不会自动追加主服务的 `/nacos` 路径。

若客户端通过主机根路径 `/.well-known/ai-catalog.json` 发现 Registry，还需将该路径转发到适配器的同名路径。默认直接访问 9080 端口时，接口路径不带 `/nacos`。

### 1.2. 使用向量插件增强资源发现

需要补充相似内容召回时，可以接入 [AI 向量插件](../plugin/ai-vector-plugin.md)。配置完成并建立向量索引后，ARD 搜索会结合关键词与向量结果，客户端继续使用本文的搜索请求。

向量插件是可选能力，安装 pgvector 不会自动接入外部 embedding 模型。默认向量生成方式、数据库准备、效果验证和排障见插件指南；资源的发布状态、可见性和鉴权要求保持不变。

## 2. 准备资源和访问凭据

1. 在 Nacos 中发布至少一个资源用于验证。例如，按 [Agent 管理](../manual/user/ai/agent-registry.md)创建 `public` 命名空间中的 `route-planner`，发布版本 `1.0.0`。
2. 确认资源已启用，`latest` 指向 `online` 版本，并为接入账号授予所需的读取权限。
3. 按[配置访问凭据](../manual/user/auth.mdx)登录，在同一终端保存响应中的 `accessToken`。

以下命令使用 Bash，Windows 可使用 Git Bash 或 WSL：

```bash
export ARD_BASE_URL='http://127.0.0.1:9080'
export NACOS_ACCESS_TOKEN='<accessToken-from-login-response>'
```

默认鉴权插件的登录接口位于主服务，例如 `http://127.0.0.1:8848/nacos/v3/auth/user/login`；ARD 请求使用 9080 端口，并通过 `accessToken` 请求头携带该 token。token 过期后需重新登录。

Nacos 3.3 默认开启客户端鉴权，ARD 也需要有效凭据。使用默认鉴权插件时，只有显式设置 `nacos.plugin.auth.nacos.anonymous.ai.enabled=true` 才允许匿名读取，且匿名调用只能发现公开资源。携带错误或过期 token 的请求仍返回 `401 UNAUTHENTICATED`，不会转为匿名访问。`PUBLIC` 仅表示可见范围，不代替匿名开关或接口权限。各类资源的默认 scope 及修改方式见[可见性插件](../plugin/visibility-plugin.md)，发布条件见 [ARD 资源发现](../manual/user/ai/ard-discovery.md)。

## 3. 搜索资源

```bash
curl -sS -X POST "${ARD_BASE_URL}/v3/ai/ard/search?namespaceId=public" \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  -H 'Content-Type: application/json' \
  -d '{
    "query": {
      "text": "route",
      "filter": {
        "type": ["application/a2a-agent-card+json"]
      }
    },
    "federation": "none",
    "pageSize": 10
  }'
```

`query.text` 必填。示例只搜索可以导出 A2A AgentCard 的资源；去掉 `filter` 可搜索全部四类资源，其他类型的 `type` 值见 [ARD 资源发现](../manual/user/ai/ard-discovery.md)。

`query.filter` 按字段筛选，可使用 `type`、`tags`、`capabilities` 等字段。一个字段的数组中任意值匹配即可，不同字段需要同时满足。`namespaceId` 是 Nacos 扩展参数，应放在 URL 查询参数中，省略时使用 `public`。

搜索响应直接返回 ARD JSON，主要字段如下：

| 字段 | 用途 |
| --- | --- |
| `results` | 本页匹配的资源。每项包含 `identifier`、`displayName`、`type`、`url`、`version` 等信息。 |
| `results[].score` | 0～100 的整数相关度分数。 |
| `results[].source` | 提供结果的 Registry 地址。 |
| `pageToken` | 下一页令牌。存在时，在相同查询条件下将其放入下一次请求体。 |
| `referrals` | 推荐查询的其他 Registry。当前本地检索返回空数组。 |

搜索的 `pageSize` 默认 10，最大 50。`federation` 接受 `auto`、`referrals`、`none`，默认 `auto`；当前未配置上游 Registry 时，这三种模式都只查询本地资源。

## 4. 浏览与分类统计

### 4.1. 分页列出资源

不需要关键词时，使用 `/agents` 浏览资源。虽然接口名为 `agents`，结果也包含 Skill、Prompt 和 MCP Server。

```bash
curl -sS -G "${ARD_BASE_URL}/v3/ai/ard/agents" \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  --data-urlencode 'namespaceId=public' \
  --data-urlencode "filter=type = 'application/a2a-agent-card+json'" \
  --data-urlencode 'orderBy=displayName' \
  --data-urlencode 'pageSize=20'
```

列表响应使用 `items`。存在 `pageToken` 时，将其作为查询参数继续取下一页。`pageSize` 默认 20，最大 100。过滤条件使用单引号包裹值，多个条件用 `AND` 连接；时间条件可写为 `createdAfter > '2026-01-01'`。

### 4.2. 查看资源分类

`explore` 返回匹配资源的分类计数，适合在工具选择页面展示类型或标签筛选项：

```bash
curl -sS -X POST "${ARD_BASE_URL}/v3/ai/ard/explore?namespaceId=public" \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  -H 'Content-Type: application/json' \
  -d '{
    "resultType": {
      "facets": [
        {"field": "type", "limit": 10},
        {"field": "tags", "limit": 20}
      ]
    }
  }'
```

响应中的 `facets.type.buckets`、`facets.tags.buckets` 分别包含 `value` 和 `count`。统计只包括调用方可发现的资源；可添加与搜索相同的 `query.filter` 限定范围。

## 5. 发现目录和获取资源内容

主机级目录提供 Registry 入口：

```bash
curl -sS "${ARD_BASE_URL}/.well-known/ai-catalog.json" \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}"
```

该目录的 `entries` 包含 `application/ai-registry+json` 类型的条目，`metadata.searchEndpoint`、`metadata.exploreEndpoint` 和 `metadata.listEndpoint` 给出对应接口地址。它不会列出所有资源。

获取某个命名空间的资源目录：

```bash
curl -sS "${ARD_BASE_URL}/v3/ai/ard/ai-catalog.json?namespaceId=public" \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}"
```

目录的 `entries` 包含 Registry 条目及可发现的资源。选择资源条目后，直接使用它的 `url` 下载内容；搜索的 `results` 和列表的 `items` 中也提供该地址。

```bash
export ARTIFACT_URL='<resource-url-from-response>'
curl -f -sS "${ARTIFACT_URL}" \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  -o artifact.bin
```

资源 URL 指向适配器的 `/v3/ai/ard/artifacts`。按条目的 `type` 和响应 `Content-Type` 解析文件：Skill 返回完整 ZIP 包，其他资源返回 JSON。URL 已包含版本等定位参数，应完整保留；Agent URL 还包含内容摘要和表示类型。版本下线或原 URL 失效时，重新搜索并获取可用版本的地址。

## 6. 常见问题

| 现象 | 检查方式 |
| --- | --- |
| 无法连接或接口返回 404 | 确认 ARD 已开启并重启，访问的是适配器端口；检查网关转发和路径前缀。 |
| 返回 `401 UNAUTHENTICATED` | 检查是否携带有效 token，过期后重新登录；匿名访问需要管理员显式开启。 |
| 请求成功但没有结果 | 检查命名空间、筛选条件、读取权限、资源启用状态和 `latest` 对应的上线版本。刚发布或刚升级后，等待搜索同步完成再查询。 |
| 返回 `400 INVALID_ARGUMENT` | 检查 JSON、必填字段和过滤语法；搜索与列表的请求格式不同。 |
| 搜索成功但资源 URL 无法访问 | 检查 `catalog.base-url` 是否是客户端可达的适配器地址，以及网关是否转发了 artifact 路径。 |
| 资源下载返回 `404 NOT_FOUND` | 重新搜索确认资源和版本仍可用，不要手工改写 Agent URL 中的版本、摘要或表示类型。 |

ARD 错误体使用 `{"errorCode":"...","message":"..."}`，不使用 Nacos v3 API 的 `code`、`data` 包装。

协议背景见 [ARD 规范](https://agenticresourcediscovery.org/spec/)。Nacos 3.3 的兼容基线为上游草案 [5fa2f5a](https://github.com/ards-project/ard-spec/commit/5fa2f5aef790b478319f6a3b43adf4661b0ed0e0)，接入时以本文列出的支持范围为准。
