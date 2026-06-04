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

开启鉴权后，控制台会进入登录流程。使用默认鉴权实现时，首次启用鉴权需要初始化管理员用户密码。

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
| Agent 管理 | 管理 A2A Agent 的注册和发现信息。 |
| AgentSpecs 管理 | 管理 AgentSpec 资源和版本。 |
| MCP 管理 | 管理 MCP Server、工具列表、端点和 API 转换。 |

完整说明请阅读 [AI 管理中心概述](../user/ai/ai-registry-overview.md)。

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
| 插件管理 | 查看已加载插件和插件状态。 |
| 用户列表 | 管理控制台用户。 |
| 角色管理 | 管理角色和用户关系。 |
| 权限管理 | 管理资源权限。 |

如果看不到某些菜单，通常是当前用户不是管理员、功能模式限制了模块，或相关功能未启用。

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
