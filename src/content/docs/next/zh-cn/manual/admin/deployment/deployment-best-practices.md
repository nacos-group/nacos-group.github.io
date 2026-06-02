---
title: 部署最佳实践
keywords: [Nacos, 部署, 最佳实践, 内网, 鉴权, 控制台独立部署]
description: 本文介绍生产环境部署 Nacos 时推荐的网络、存储、鉴权、控制台、插件和运维实践。
sidebar:
  order: 6
---

# Nacos 部署最佳实践

Nacos 是微服务体系中的基础组件，通常承载服务发现、配置管理和 AI 管理中心等核心能力。生产部署时，先把网络边界、数据存储、访问控制和运维入口设计清楚，比单纯“把集群跑起来”更重要。

> 注意
> - Nacos 是一个内部微服务组件，需要在可信的内部网络中运行，不可暴露在公网环境，防止带来安全风险。
> - Nacos 提供简单的鉴权实现，为防止业务错用的弱鉴权体系，不是防止恶意攻击的强鉴权体系。
> - 如果运行在不可信的网络环境或者有强鉴权诉求，请参考官方简单实现进行[自定义插件开发](../../../plugin/auth-plugin.md)。

## 推荐拓扑

生产环境推荐使用集群模式，并把 Nacos Server、Nacos Console、数据库和客户端访问面分开管理。

```text
业务应用 / SDK
      |
内部 VIP 或 SLB
      |
Nacos Server 集群  ---- 外置数据库
      |
内部管理网络
      |
Nacos Console
```

建议：

- Nacos Server 部署在可信内网，只向业务应用开放必要端口。
- Nacos Console 独立部署，并只允许运维、平台或研发管理网络访问。
- 数据库只允许 Nacos Server 访问，不向业务应用或公网暴露。
- 集群间通信端口只允许 Nacos Server 节点之间访问。
- 所有入口都不要直接暴露到公网。确实需要跨网络访问时，应通过 VPN、专线、堡垒机或企业网关接入。

## 网络和端口

Nacos 3.0 起，控制台端口与服务端主端口解耦。默认端口如下：

| 端口 | 用途 | 暴露建议 |
| --- | --- | --- |
| `8848` | HTTP API 端口，用于 OpenAPI、Admin API 和部分插件请求 | 只向内部客户端、控制台或网关开放 |
| `9848` | 客户端 gRPC 端口 | 只向内部客户端开放，VIP/SLB 需要 TCP 转发 |
| `9849` | 服务端 gRPC 通信端口 | 只允许 Nacos Server 节点互通 |
| `7848` | Raft 通信端口 | 只允许 Nacos Server 节点互通 |
| `8080` | Nacos Console 端口 | 只向管理网络开放 |

使用 VIP、SLB 或 Nginx 时，`9848` 必须按 TCP 转发，不要按 HTTP 或 HTTP/2 代理。更多端口说明请参考[部署手册概览](./deployment-overview.md)。

## 控制台独立部署

生产环境建议采用控制台独立部署。这样可以把高权限管理入口和服务端运行面拆开，减少控制台请求对核心服务端的影响。

推荐做法：

1. Nacos Server 使用 `sh startup.sh -d server` 启动。
2. Nacos Console 使用 `sh startup.sh -d console` 启动。
3. Console 的 `cluster.conf` 指向 Server 节点或内部 VIP。
4. Console 与 Server 使用一致的 server identity 和 token secret 配置。
5. Console 入口只开放给管理网络，并配合企业访问控制。

详细步骤请参考[控制台独立部署](./deployment-independent.md)。

## 数据库存储

生产环境建议使用外置数据库。内置 Derby 适合本地开发、单机测试和临时验证，不建议作为生产存储。

当前 Nacos 官方默认支持 4 种数据库：

| 数据库 | 配置值 | 说明 |
| --- | --- | --- |
| Derby | `derby` | 内置数据库，适合本地和测试。 |
| MySQL | `mysql` | 常用生产外置数据库。 |
| PostgreSQL | `postgresql` | 官方默认支持。 |
| Oracle | `oracle` | 官方默认支持 Oracle 12c 及以上版本。 |

部署建议：

- 启动前先导入目标版本对应数据库的 schema。
- 所有 Nacos Server 节点使用相同数据库类型、相同 schema 和相同插件版本。
- 数据库账号只授予 Nacos 必需权限。
- 建立数据库备份和恢复流程，并在升级前做恢复演练。
- 使用社区数据源插件前，先在测试环境验证兼容性和升级路径。Oracle 11g 及更低版本已经停止官方维护，当前 Oracle 插件不再向下兼容。

详细配置请参考[多数据源插件](../../../plugin/datasource-plugin.md)和[系统参数](../system-configurations.md#112-数据库)。

## 鉴权和访问凭据

如果不是纯本地临时环境，建议开启鉴权，并显式配置服务端身份和 token secret。

基础配置包括：

```properties
nacos.core.auth.enabled=true
nacos.core.auth.system.type=nacos
nacos.core.auth.server.identity.key=${your_identity_key}
nacos.core.auth.server.identity.value=${your_identity_value}
nacos.core.auth.plugin.nacos.token.secret.key=${your_token_secret}
```

建议：

- 不要使用默认、示例或过短的 token secret。
- 所有 Server 节点和独立 Console 使用一致的 server identity 配置。
- 按环境选择合适的鉴权插件：默认 Nacos 鉴权、LDAP、OIDC/OAuth2 或自定义插件。
- SDK、OpenAPI、控制台账号分别管理，避免多人共用高权限账号。
- 重要权限变更后，留意本地缓存带来的短暂延迟。

详细说明请参考[鉴权手册](../auth.mdx)、[访问凭据](../../user/auth.mdx)和[鉴权插件](../../../plugin/auth-plugin.md)。

## 可见性和资源治理

鉴权决定“能不能访问”，可见性决定“能看到哪些资源”。如果使用 AI 管理中心，建议同时评估可见性插件，避免不同团队、租户或用户之间看到不相关资源。

相关文档：

- [可见性插件](../../../plugin/visibility-plugin.md)
- [AI 资源生命周期](../../user/ai/ai-resource-lifecycle.md)

## 流量防护

当集群承载较多客户端连接或核心接口存在突增流量时，可以启用流量防护插件。建议先使用 `monitor` 模式观察，再切换到 `intercept` 模式。

```properties
nacos.plugin.control.manager.type=nacos
```

重点关注：

- 客户端 gRPC 长连接数量。
- 配置查询和监听流量。
- 服务注册、注销、订阅流量。
- 控制台和运维 API 的访问频率。

详细配置请参考[流量防护插件](../../../plugin/control-plugin.md)。

## 配置加密

敏感配置建议使用配置加密插件。配置加密可以让指定 `dataId` 的配置以密文存储，并通过 `encrypted_data_key` 保存数据密钥。

```text
cipher-aes-application-prod.yaml
```

建议：

- 服务端和需要解密的客户端都加载相同算法插件。
- 升级前确认数据库表包含 `encrypted_data_key` 字段。
- 加密配置不能替代鉴权、网络隔离或 TLS。
- 企业生产环境可以通过自定义插件接入 KMS 或 HSM。

详细说明请参考[配置加密插件](../../../plugin/config-encryption-plugin.md)。

## 监控、备份和升级

上线前建议准备以下运维能力：

- 接入 Prometheus 和 Grafana，监控 JVM、线程池、gRPC 连接、请求量、数据库连接池和 topN 资源。
- 定期备份数据库和关键配置文件，例如 `application.properties`、`cluster.conf` 和插件目录。
- 升级前对比目标版本 schema，并在测试环境完成升级和回滚演练。
- 变更鉴权、数据源、控制台独立部署或插件配置时，优先灰度一组节点。
- 保存明确的应急操作手册，包括关闭限流规则、回滚插件、切换数据库连接和恢复控制台访问。

相关文档：

- [监控手册](../monitor.md)
- [升级手册](../upgrading.mdx)
- [系统参数](../system-configurations.md)

## 上线检查清单

| 检查项 | 建议 |
| --- | --- |
| 网络边界 | 所有端口仅在可信内网开放，不暴露公网。 |
| 部署模式 | 生产环境使用集群模式，控制台独立部署。 |
| 数据库 | 使用外置数据库，导入目标版本 schema，完成备份恢复验证。 |
| 鉴权 | 开启鉴权，配置 server identity 和足够强的 token secret。 |
| 客户端 | SDK 使用内部 VIP/SLB 地址，并正确携带访问凭据。 |
| 可见性 | 多团队或 AI 管理中心场景下启用并验证资源可见性。 |
| 流量防护 | 先 monitor 后 intercept，阈值按真实流量设置。 |
| 配置加密 | 敏感配置使用 `cipher-${algorithmName}-` 前缀并验证解密链路。 |
| 监控告警 | 建立连接数、请求量、数据库、JVM 和错误日志告警。 |
| 升级回滚 | 升级前完成 schema 对比、备份和回滚演练。 |
