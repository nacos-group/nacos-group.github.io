---
title: OIDC/OAuth2 认证
keywords: [OIDC, OAuth2, SSO, Keycloak, 单点登录]
description: Nacos OIDC/OAuth2 鉴权插件配置与使用指南，支持与 Keycloak、Okta、Auth0 等 IdP 集成实现单点登录和 bearer token 访问。
sidebar:
    order: 8
---

# OIDC/OAuth2 认证

## 概述

Nacos OIDC/OAuth2 鉴权插件的插件类型是 `oidc`。它为 Nacos 控制台提供基于 OpenID Connect 1.0 / OAuth2 的认证能力，使 Nacos 能够将用户认证委托给外部身份提供商（IdP）。

启用 OIDC 插件后，Nacos 控制台登录页会显示 **"使用 SSO 登录"** 按钮，用户点击后跳转到 IdP 完成认证，登录成功后自动回到 Nacos 控制台。

Java SDK 也可以使用 OAuth2 Client Credentials flow 获取 bearer token，并把 token 注入到请求中。控制台 SSO 和 SDK bearer token 是两个入口，但都由 `oidc` 鉴权插件在服务端校验。

### 适用场景

- 企业已部署统一身份系统（Keycloak、Okta、Auth0、Azure AD 等），希望 Nacos 接入 SSO
- 需要集中管理用户和权限，避免在 Nacos 中单独维护账号
- 希望符合企业安全合规要求（强制 MFA、审计日志、密码策略等）

### 支持的身份提供商

支持任何符合 OIDC 1.0 规范、暴露 `/.well-known/openid-configuration` 发现端点的 IdP。已验证：

- Keycloak（≥ 18.0）
- Okta
- Auth0
- Azure AD / Microsoft Entra ID

### 版本要求

- Nacos：3.2.0 及以上
- JDK：17 及以上

---

## 1. 前置条件

| 组件 | 版本要求 | 说明 |
|------|---------|------|
| JDK | 17+ | 编译和运行 Nacos |
| OIDC IdP | OIDC 1.0 兼容 | 本文以 Keycloak 24 为例 |
| Nacos | 3.2.0+ | 源码或预编译发行包 |

---

## 2. 准备 OIDC IdP（Keycloak 示例）

> 如果你已有可用的 OIDC IdP，跳过本节。

### 2.1 启动 Keycloak

```bash
docker run -d --name keycloak \
  -p 8081:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:24.0 \
  start-dev
```

启动后访问 `http://localhost:8081`，使用 `admin/admin` 登录管理控制台。

### 2.2 创建 Realm

1. 左上角下拉菜单点击 **Create Realm**
2. Realm name 填写：`nacos`
3. 点击 **Create**

### 2.3 创建 Client

1. 左侧菜单进入 **Clients** → **Create client**
2. 第一步：
   - Client type: `OpenID Connect`
   - Client ID: `nacos-server`
   - 点击 **Next**
3. 第二步：
   - Client authentication: `On`
   - Authorization: `Off`
   - 勾选 `Standard flow`
   - 点击 **Next**
4. 第三步：
   - Valid redirect URIs: `http://localhost:8080/*`
   - Web origins: `http://localhost:8080`
   - 点击 **Save**
5. 创建后进入 **Credentials** 标签页，复制 **Client secret** 备用

### 2.4 创建测试用户

1. 左侧菜单 **Users** → **Add user**
2. Username: `testuser`，Email: `test@example.com`，**Email verified: On**
3. 点击 **Create**
4. 进入用户详情的 **Credentials** 标签
5. 点击 **Set password**，输入密码，**Temporary: Off**

### 2.5 记录关键信息

| 项 | 值 |
|----|----|
| Issuer URI | `http://localhost:8081/realms/nacos` |
| Client ID | `nacos-server` |
| Client Secret | （步骤 2.3 中获取的值） |
| Discovery URL | `http://localhost:8081/realms/nacos/.well-known/openid-configuration` |

可以通过 curl 验证 Discovery 端点是否可访问：

```bash
curl http://localhost:8081/realms/nacos/.well-known/openid-configuration
```

---

## 3. 配置 application.properties

修改文件 `<NACOS_HOME>/conf/application.properties`。

### 3.1 切换鉴权系统类型为 OIDC/OAuth2

```properties
### 启用 OIDC/OAuth2 鉴权系统
nacos.plugin.auth.type=oidc

### 启用认证
nacos.core.auth.enabled=true
```

### 3.2 通用认证配置（必填）

即使启用了 OIDC，以下配置仍然**必填**，因为 Nacos 集群内部 server-to-server 通信使用 Nacos 自有的 JWT。

```properties
### 服务间通信身份标识（自定义任意非空字符串）
nacos.core.auth.server.identity.key=serverIdentity
nacos.core.auth.server.identity.value=security

### Nacos 内部 JWT 签名密钥（Base64 编码，原串至少 32 字符）
nacos.plugin.auth.nacos.token.secret.key=VGhpc0lzTXlDdXN0b21TZWNyZXRLZXkwMTIzNDU2Nzg=
```

> **重要**：标准值为空时，启动脚本会先迁移 `application.properties` 中有效的 `nacos.core.auth.plugin.nacos.token.secret.key`；只有标准 key 和历史 key 都没有有效值时才提示输入。可使用 `openssl rand -base64 32` 生成密钥。

### 3.3 OIDC 插件核心配置（必填）

```properties
### IdP 的 Issuer URI（用于自动发现 OIDC 端点）
nacos.plugin.auth.oidc.issuer-uri=http://localhost:8081/realms/nacos

### OAuth2 Client 凭证
nacos.plugin.auth.oidc.client-id=nacos-server
nacos.plugin.auth.oidc.client-secret=nacos-client-secret

### 请求的 OAuth2 scope
nacos.plugin.auth.oidc.scope=openid profile email

### 从 ID Token 中读取用户名的 claim 字段
nacos.plugin.auth.oidc.username-claim=preferred_username
```

### 3.4 OIDC 插件可选配置

| 配置项 | 默认值 | 说明 |
|--------|-------|------|
| `nacos.plugin.auth.oidc.token-validation-method` | `jwt` | 当前只实现 `jwt` / JWKS；`introspection` 不受支持 |
| `nacos.plugin.auth.oidc.jwks-cache-ttl-seconds` | `3600` | JWKS 公钥缓存 TTL（秒） |
| `nacos.plugin.auth.oidc.roles-claim` | `roles` | ID Token 中读取角色的 claim 名 |
| `nacos.plugin.auth.oidc.admin-role` | `nacos-admin` | 管理员角色名 |
| `nacos.plugin.auth.oidc.auto-create-user` | `true` | 兼容保留项，当前不改变运行行为 |
| `nacos.plugin.auth.oidc.authorization-endpoint` | （空） | 外部授权决策端点。为空时，当前实现会放行非管理员授权判断 |
| `nacos.plugin.auth.oidc.authorization-timeout-ms` | `5000` | 授权请求超时时间（毫秒） |
| `nacos.plugin.auth.oidc.strict-nonce-validation` | `true` | 是否启用严格 nonce 校验 |
| `nacos.plugin.auth.oidc.strict-audience-validation` | `true` | 是否启用严格 audience 校验 |

:::note
`strict-nonce-validation` 和 `strict-audience-validation` 未显式配置时默认开启。仅在开发联调或 IdP 暂时不满足校验要求时，才建议临时关闭，并在生产前恢复。
:::

:::caution
如果生产环境需要按命名空间、配置、服务或 AI 资源做权限隔离，请配置 `nacos.plugin.auth.oidc.authorization-endpoint`，或提供更严格的授权实现。当前实现中该配置为空时，非管理员授权判断会默认放行。
:::

### 3.5 Java SDK OAuth2 Client Credentials 配置

Java SDK 的 OIDC/OAuth2 客户端鉴权使用 OAuth2 Client Credentials flow，适合服务到服务访问。

```properties
nacos.client.auth.oidc.issuer-uri=https://idp.example.com/realms/nacos
nacos.client.auth.oidc.client-id=nacos-client
nacos.client.auth.oidc.client-secret=${client_secret}
nacos.client.auth.oidc.scope=openid
```

如果 IdP 不支持 Discovery，或希望跳过 Discovery，可以直接配置 token endpoint：

```properties
nacos.client.auth.oidc.token-endpoint=https://idp.example.com/realms/nacos/protocol/openid-connect/token
```

SDK 会在 token 过期前刷新，并向请求注入 `Authorization: Bearer ...` 和 `accessToken`。

---

## 4. 启动 Nacos

```bash
cd <NACOS_HOME>
bin/startup.sh -m standalone   # 单机模式
# 或
bin/startup.sh                  # 集群模式
```

观察日志：

```bash
tail -f logs/start.out
```

启动成功标志：日志中出现 `Nacos started successfully`。

---

## 5. 验证 OIDC 登录

### 5.1 浏览器访问

打开浏览器访问 `http://localhost:8080/`，Nacos 登录页会显示 **"使用 SSO 登录"** 按钮，用户名/密码表单被隐藏。

### 5.2 点击 SSO 按钮

点击按钮后浏览器跳转到 IdP 登录页。在 IdP 完成认证后自动跳回 Nacos 控制台。

### 5.3 验证 OIDC 用户行为

| 验证点 | 预期行为 |
|--------|---------|
| 用户名显示 | Header 显示 IdP 中的用户名 |
| 修改密码菜单 | **隐藏**（密码由 IdP 管理） |
| 权限管理菜单 | **隐藏**（权限由 IdP 集中管理） |
| 登出 | 跳转到 IdP logout 端点（RP-initiated logout） |

---

## 6. 登录流程

```
浏览器                Nacos                    IdP (Keycloak)
   |                    |                            |
   | GET /              |                            |
   |------------------->|                            |
   | HTML + JS          |                            |
   |<-------------------|                            |
   | GET /v3/console/server/state                    |
   |------------------->|                            |
   | {auth_system_type: "oidc"}                      |
   |<-------------------|                            |
   | 渲染 "使用 SSO 登录" 按钮                       |
   | 用户点击按钮                                    |
   | GET /v1/auth/oidc/login                         |
   |------------------->|                            |
   | 302 IdP authorize  |                            |
   |<-------------------|                            |
   | GET IdP authorize  |                            |
   |-------------------------------------------->    |
   | IdP 登录页         |                            |
   |<--------------------------------------------    |
   | 用户输入凭证       |                            |
   |-------------------------------------------->    |
   | 302 callback?code= |                            |
   |<--------------------------------------------    |
   | GET /v1/auth/oidc/callback?code=...             |
   |------------------->|                            |
   |                    | POST token endpoint        |
   |                    |--------------------------->|
   |                    | {access_token, id_token}    |
   |                    |<---------------------------|
   |                    | JWKS 签名校验              |
   |                    |--------------------------->|
   |                    |<---------------------------|
   | 302 / + Set-Cookie |                            |
   |<-------------------|                            |
   | JS 读取 cookies    |                            |
   | 同步到 localStorage|                            |
   | 删除 cookies       |                            |
   | 进入控制台         |                            |
```

---

## 7. 常见问题

### 7.1 启动卡在 "Please input the JWT token secret key"

**原因**：`nacos.plugin.auth.nacos.token.secret.key` 未设置。

**解决**：在 `application.properties` 中配置密钥：

```properties
nacos.plugin.auth.nacos.token.secret.key=VGhpc0lzTXlDdXN0b21TZWNyZXRLZXkwMTIzNDU2Nzg=
```

### 7.2 启动失败：Empty identity

**原因**：`nacos.core.auth.server.identity.key/value` 为空。

**解决**：

```properties
nacos.core.auth.server.identity.key=serverIdentity
nacos.core.auth.server.identity.value=security
```

### 7.3 IdP 报 redirect_uri 错误

**原因**：IdP client 配置的 Valid Redirect URIs 缺少 Nacos 回调地址。

**解决**：在 IdP client 配置中添加 `http://<nacos-host>:<port>/*`。

### 7.4 登录回调报 No valid OIDC token found

**原因**：JWT 签名校验失败。

**排查**：
1. 检查 `issuer-uri` 是否正确（注意末尾不要带斜杠）
2. 查看 `logs/nacos.log` 中的错误详情
3. 开发联调时可临时关闭严格 audience 校验：`nacos.plugin.auth.oidc.strict-audience-validation=false`
4. 确认 IdP 的 JWKS 端点可访问

### 7.5 登出后立即被自动登入

这是 OIDC SSO 的标准行为。IdP 的 SSO session 仍然有效，访问 Nacos 时 IdP 直接返回已登录状态。如需强制重新登录，手动访问 IdP 的 logout 端点清除 session。

---

## 8. 与其他认证模式对比

| 特性 | nacos | ldap | oidc |
|------|-------|------|------|
| 用户存储 | Nacos 内置数据库 | LDAP 服务器 | IdP |
| 密码管理 | Nacos 控制台 | LDAP 服务器 | IdP |
| 单点登录（SSO） | 否 | 否 | **是** |
| SDK OAuth2 Client Credentials | 否 | 否 | **是** |
| 多因素认证（MFA） | 否 | 取决于 LDAP | **是** |
| 授权来源 | Nacos 本地权限 | Nacos 本地权限 | IdP 角色或外部授权端点 |
| 适用场景 | 单机/小型部署 | 已有 LDAP 的企业 | 现代化企业 SSO |
