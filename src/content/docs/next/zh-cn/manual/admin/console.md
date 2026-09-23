---
title: 控制台手册
keywords: [Nacos, 控制台, Console, 运维]
description: 了解 Nacos 3.x 新控制台的访问入口、功能导航和常见使用问题。
sidebar:
    order: 12
---

# 控制台手册

Nacos 控制台是面向用户、运维人员和平台管理员的可视化操作入口。它适合日常查看、发布、回滚、排障和权限管理，不建议作为自动化系统的调用接口。

自动化操作请优先使用 [Admin API](./admin-api.md)、[Maintainer SDK](./maintainer-sdk.md) 或对应业务 OpenAPI。控制台 API 主要服务于页面交互，接口和字段可能随控制台升级调整。

## 进入控制台

Nacos 3.x 默认使用新控制台。启动后访问：

```text
http://{console-host}:8080/
```

默认情况下，根路径会跳转到 `/next/`。如果配置了 `nacos.console.contextPath`，需要在地址中带上对应上下文路径。

常见配置如下：

| 配置项 | 说明 |
| --- | --- |
| `nacos.console.port` | 控制台端口，默认 `8080`。 |
| `nacos.console.contextPath` | 控制台上下文路径，默认空。 |
| `nacos.console.ui.enabled` | 是否启用默认控制台，默认启用。 |
| `nacos.console.ui.default` | 默认控制台版本，默认 `next`。 |

如果你采用控制台独立部署，只需要知道控制台和 Nacos Server 可以分开运行。具体部署步骤请阅读[控制台独立部署](./deployment/deployment-independent.md)。

## 登录和权限

Nacos 3.3 默认开启控制台鉴权，访问时会进入登录流程。使用默认鉴权实现时，首次使用需要初始化管理员用户密码。控制台登录只用于页面操作；应用接入和终端中的 API 请求仍需单独配置访问凭据。

如果未开启鉴权，控制台不会把登录页伪装成安全边界。请务必把 Nacos 放在可信内部网络中，不要暴露到公网。

权限相关文档：

- [鉴权手册](./auth.mdx)
- [访问凭据](../user/auth.mdx)
- [OIDC/OAuth2 认证](./oidc-auth.md)

## 命名空间选择

控制台顶部或页面上下文中的命名空间会影响资源列表。配置、服务、AI 资源等都会按命名空间隔离展示。

排查“资源不存在”时，先确认当前命名空间是否正确，再检查权限、可见性和资源状态。

## AI 管理中心

AI 管理中心用于管理 AI 应用依赖的资源。新控制台会在 AI 功能启用且当前启动模式允许时展示这一组菜单。

常见入口包括：

| 入口 | 用途 |
| --- | --- |
| Skill 管理 | 管理 Skill 元数据、版本、包文件和发布状态。 |
| Prompt 管理 | 管理 Prompt 模板、版本和变量。 |
| Agent 管理 | 管理 Agent 目录、版本化调用定义（含 A2A AgentCard）和运行端点。 |
| AgentSpecs 管理 | 管理 AgentSpec 资源和版本。 |
| MCP 管理 | 管理 MCP Server、工具列表、端点和 API 转换。 |

完整说明请阅读 [AI 管理中心概述](../user/ai/ai-registry-overview.md)。

### 创建和发布 Agent、MCP Server

1. 选择目标命名空间，进入 Agent 管理或 MCP 管理。Agent 可以从已有 A2A AgentCard 导入，也可以新建；MCP Server 按使用的协议填写服务描述、工具和连接信息。保存后得到首个草稿版本。
2. 进入资源详情，核对版本内容和可见范围。内置策略下，Agent、MCP Server 首次创建时默认公开；需要私有发布时，先将可见范围改为私有，再提交。具体权限规则见[可见性插件](../../plugin/visibility-plugin.md)。
3. 在草稿版本上选择“提交审核”。没有适用的已启用审核节点时，提交会直接发布上线；有审核节点时，查看该版本的审核结果，通过后再选择“发布”。审核未通过且需要修改时，先“退回草稿”，编辑后重新提交。
4. 确认目标版本为 `online`，资源处于启用状态。发布成功后，服务端自动更新 `latest`；再使用业务应用的身份验证发现和实际调用。

版本内容只能在草稿状态编辑。后续变更可在版本历史中选择已有版本，再“基于此版本创建草稿”；MCP Server 应从在线版本创建新草稿。已有编辑中或审核中的版本时，先处理该版本。完整状态规则和管理员强制发布场景见 [AI 资源生命周期](../user/ai/ai-resource-lifecycle.md)。

### 查看版本和运行端点

在资源详情中切换版本，核对该版本的定义、状态和标签。资源启用/禁用与版本上线/下线是不同操作；上线一个版本不会自动启用已禁用的资源。

- **Agent**：选择版本和调用协议，分别查看“声明端点”和“运行时端点”。运行时端点区域只读，可刷新查看健康状态和运行版本绑定；需要启用或禁用实例时，通过页面提供的服务入口进入 Naming 服务详情。注册、注销和订阅端点的应用示例见 [RAD 接入指南](../user/ai/rad-discovery.md)。
- **MCP Server**：核对所选版本的工具及连接信息。远程服务有可用地址时，详情中展示前端或后端端点；`stdio` 服务查看包和启动参数。Nacos 不会因为发布定义而启动 MCP 进程，接入方式见 [MCP 管理](../user/ai/mcp-registry.md)。

如果 MCP 页面提示生命周期迁移中或服务暂不可用，先保持只读，待迁移或服务恢复后再修改，参见[升级手册](./upgrading.mdx)。需要通过工具链搜索和下载已发布资源时，使用 [ARD 资源发现](../user/ai/ard-discovery.md)。

## 配置中心

配置中心菜单用于管理配置的发布、查询、监听和回滚。

常见操作包括：

- 在配置列表中按 `Data ID`、`Group` 和命名空间查询配置。
- 新建、编辑和发布配置。
- 查看历史版本，并在需要时回滚。
- 查询监听者，确认客户端是否收到配置变更。
- 导入、导出或克隆配置时，注意文件大小和目标命名空间。

如果需要了解配置模型、灰度发布、导入导出和排障方式，请阅读[配置管理概览](../user/config/overview.md)。

## 注册中心

注册中心菜单用于查看服务、实例和订阅关系。

常见操作包括：

- 在服务列表中查询服务和健康实例数量。
- 进入服务详情查看集群、实例、元数据和权重。
- 调整实例权重或上下线状态。
- 查询订阅者，确认消费者是否订阅到目标服务。

控制台操作会影响服务发现结果。对生产服务调整权重、元数据或上下线状态前，请先确认变更窗口和回滚方案。

完整说明请阅读[服务发现概览](../user/naming/overview.md)。

## 平台管理

平台管理通常面向管理员。不同启动模式和权限下，菜单可能不同。

| 入口 | 用途 |
| --- | --- |
| 命名空间 | 创建、编辑和删除命名空间。 |
| 集群管理 | 查看集群节点和基础状态。 |
| 插件管理 | 查看统一插件清单、状态、有效配置和来源，并按 definitions 安全更新运行时项。 |
| 用户列表 | 管理控制台用户。 |
| 角色管理 | 管理角色和用户关系。 |
| 权限管理 | 管理资源权限。 |

如果看不到某些菜单，通常是当前用户不是管理员、功能模式限制了模块，或相关功能未启用。

### Next Console 插件管理

插件列表按 `pluginType:pluginName` 展示实现，并标明执行模式、critical 和 configurable。详情页会显示：

- 当前启用状态，以及该状态是持久化集群状态还是当前节点 `localOnly` 覆盖；
- `configDefinitions` 中的类型、默认值、alias、必填、敏感和 `effectMode`；
- 每个有效配置值的 `source` 与 `overridden`，来源优先级为 `LOCAL_ONLY > RUNTIME_PERSISTED > STATIC > DEFAULT`；
- 敏感值的 masked marker，而不是明文。

只有 `RUNTIME` definition 可以在线编辑；`RESTART` 项只读并提示通过静态配置修改后重启。提交配置会替换选定来源的完整 map，空 map 表示清空。集群操作前应先清理当前节点的 `localOnly` 覆盖，否则它仍会压过持久化值。active critical provider、EXCLUSIVE 选择和 PRE_CONTEXT 插件的非法运行时状态修改会被拒绝。

这些能力只适用于 Next Console；Legacy Console 不提供统一插件配置工作流。完整运维语义见[插件运维](../../plugin/operations.md)。

## 旧控制台

旧控制台仍可通过配置 `nacos.console.ui.default=legacy` 作为默认入口，也可以直接访问 `/legacy/`。

旧控制台使用的前端风格和依赖组件较旧，只建议用于兼容存量使用习惯。新版本推荐使用新控制台。后续版本中，旧控制台可能被移除。

如果你在做新部署、升级验证或文档截图，请优先使用新控制台。

## 常见问题

**访问根路径后为什么进入 `/next/`？**

这是 Nacos 3.x 的默认行为。新控制台是默认控制台。

**为什么没有登录页？**

通常是因为未开启鉴权。此时控制台不提供登录保护，请只在可信内部网络中使用。

**为什么看不到 AI 管理中心、配置中心或注册中心？**

先检查 `nacos.functionMode`、`nacos.extension.ai.enabled` 和当前用户权限。不同启动模式会隐藏不相关菜单。

**控制台独立部署后为什么访问失败？**

检查控制台到 Nacos Server 的地址、`nacos.console.remote.server.context-path`、服务端上下文路径，以及服务端身份认证配置。详细步骤请阅读[控制台独立部署](./deployment/deployment-independent.md)。

**上传文件失败怎么办？**

检查文件大小是否超过 `spring.servlet.multipart.max-file-size` 或 `spring.servlet.multipart.max-request-size`。默认值为 `10MB`。

## 继续阅读

- [部署手册概览](./deployment/deployment-overview.md)
- [部署最佳实践](./deployment/deployment-best-practices.md)
- [系统参数](./system-configurations.md)
- [控制台 API](./console-api.md)
