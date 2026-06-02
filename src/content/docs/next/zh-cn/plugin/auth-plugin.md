---
title: 鉴权插件
keywords: [鉴权, 插件, RBAC, LDAP, OIDC, OAuth2]
description: 本文介绍 Nacos 鉴权插件的工作模型、内置实现、默认鉴权实现提供的 v3 Auth API，以及自定义插件开发方式。
sidebar:
    order: 2
---

# 鉴权插件

Nacos 从 2.1.0 开始支持通过 [SPI](https://docs.oracle.com/javase/tutorial/sound/SPI-intro.html) 扩展鉴权能力。服务端会根据 `application.properties` 中的 `nacos.core.auth.system.type` 选择一个鉴权插件，用它完成身份认证和权限校验。

鉴权插件回答的问题是：**当前请求是谁发起的，它是否可以对目标资源执行这个操作**。

```text
IdentityContext + Resource + Action -> 允许或拒绝
```

如果你只是想开启 Nacos 自带的鉴权能力，请先阅读[运维手册 - 权限校验](../manual/admin/auth.mdx)。如果你要接入企业身份系统，请阅读 [OIDC/OAuth2 认证](../manual/admin/oidc-auth.md)。本文更关注插件模型、内置插件边界和扩展开发。

## 鉴权插件中的概念

### 身份信息 IdentityContext

`IdentityContext` 是请求发起方在鉴权插件中的身份描述。不同插件可以使用不同的身份材料。

常见身份材料包括：

| 身份材料 | 典型来源 |
| --- | --- |
| `username`、`password` | 默认 Nacos 鉴权登录 |
| `accessToken` | 默认 Nacos 鉴权或兼容 token 传递 |
| `Authorization: Bearer ...` | OIDC/OAuth2、默认 Nacos token |
| access key、signature | RAM 或自定义签名类插件 |
| `remote_ip` | 请求来源地址，Nacos 会默认注入 |

插件通过 `identityNames()` 声明自己需要从请求中提取哪些身份字段。服务端会把这些字段放入 `IdentityContext`，再交给插件判断。

### 资源 Resource

`Resource` 是请求要操作的对象。资源由 Nacos 的控制器、协议层和资源解析器生成，鉴权插件不应该重新定义 Nacos 的资源模型。

常见字段如下：

| 字段 | 说明 |
| --- | --- |
| `namespaceId` | 资源所在命名空间。部分全局接口可能为空。 |
| `group` | 配置分组或服务分组。部分接口可能为空。 |
| `name` | 资源名，例如配置 `dataId`、服务名，或控制台资源名。 |
| `type` | 资源类型，对应模块或显式资源类型。 |
| `properties` | 额外信息，例如 gRPC 请求名、`@Secured` 标签等。 |

### 操作 Action

Nacos 当前主要使用两类操作：

| 操作 | 说明 |
| --- | --- |
| `r` | 读、查询、列表、订阅等读操作。 |
| `w` | 创建、更新、删除、发布等写操作。 |

## 内置鉴权实现

Nacos 3.2 提供以下内置鉴权实现。它们都通过同一套鉴权 SPI 接入，但身份来源和权限模型不同。

| 插件类型 | 适用场景 | 说明 |
| --- | --- | --- |
| `nacos` | 默认用户名、密码、token 和 RBAC | Nacos 自带的默认实现。适合可信内网中的基础访问控制。 |
| `ldap` | 已有 LDAP 用户体系 | LDAP 负责身份认证，Nacos 继续负责 token、角色和权限。3.2 起 LDAP 作为独立可选插件提供。 |
| `oidc` | 企业 SSO、OAuth2/OIDC IdP | 通过 OIDC/OAuth2 接入 Keycloak、Okta、Auth0、Microsoft Entra ID 等身份提供方。 |
| 自定义类型 | 企业自定义安全体系 | 由用户实现 `AuthPluginService` 并放入服务端 classpath。 |

:::note
默认 `nacos` 鉴权实现是一个面向可信内网的基础实现，主要防止业务误用。它不是面向公网攻击场景的强鉴权系统。生产环境不要把 Nacos 直接暴露到公网。
:::

### 默认 Nacos 鉴权实现

默认 Nacos 鉴权实现的插件类型是 `nacos`。它提供用户名密码登录、JWT token、用户管理、角色管理、权限管理，以及默认 AI 资源可见性实现。

开启时通常需要配置：

```properties
nacos.core.auth.system.type=nacos
nacos.core.auth.enabled=true
nacos.core.auth.admin.enabled=true
nacos.core.auth.console.enabled=true
nacos.core.auth.server.identity.key=${custom_server_identity_key}
nacos.core.auth.server.identity.value=${custom_server_identity_value}
nacos.core.auth.plugin.nacos.token.secret.key=${custom_base64_token_secret_key}
```

默认实现使用 RBAC 模型：

| 对象 | 说明 |
| --- | --- |
| User | Nacos 本地用户。 |
| Role | 绑定到用户的角色。 |
| Permission | 绑定到角色的资源和操作。 |

`ROLE_ADMIN` 是全局管理员角色。拥有该角色的用户可以访问所有资源和控制台管理功能。

默认资源权限通常使用以下格式：

```text
{namespaceId}:{group}:{signType}/{resourceName}
```

例如：

| 资源 | 示例 |
| --- | --- |
| 配置 | `public:DEFAULT_GROUP:config/example.properties` |
| 服务 | `public:DEFAULT_GROUP:naming/com.example.Service` |
| 控制台用户管理 | `console/users` |
| 控制台角色管理 | `console/roles` |
| 控制台权限管理 | `console/permissions` |
| 可见性显式授权 | `@@visibility/public/skill/example-skill` |

#### 默认鉴权实现提供的 v3 Auth API

`/v3/auth/*` 这组 API 不是 Nacos Core 的通用 API，而是默认 Nacos 鉴权实现提供的插件 API。文档和使用时都应该把它们归在默认鉴权实现下面。

| API | 方法 | 说明 | 鉴权状态 |
| --- | --- | --- | --- |
| `/v3/auth/user/login` | `POST` | 使用用户名和密码登录，返回 `accessToken`。`nacos` 和 `ldap` 类型支持该接口。 | 公开登录接口。 |
| `/v3/auth/user/admin` | `POST` | 初始化管理员用户 `nacos`。仅在还没有全局管理员时可用。 | 初始化入口，用后即关闭。 |
| `/v3/auth/user` | `POST` | 创建本地用户。 | 需要 `console/users` 写权限。 |
| `/v3/auth/user` | `PUT` | 修改用户密码。管理员可改任意用户，普通用户只能改自己。 | 需要身份校验。 |
| `/v3/auth/user` | `DELETE` | 删除本地用户，不能删除全局管理员。 | 需要 `console/users` 写权限。 |
| `/v3/auth/user/list` | `GET` | 分页查询用户。 | 需要 `console/users` 读权限。 |
| `/v3/auth/user/search` | `GET` | 按用户名模糊搜索。 | 需要 `console/users` 写权限。 |
| `/v3/auth/role` | `POST` | 创建角色或给用户绑定角色。 | 需要 `console/roles` 写权限。 |
| `/v3/auth/role` | `DELETE` | 删除角色，或移除用户上的某个角色。 | 需要 `console/roles` 写权限。 |
| `/v3/auth/role/list` | `GET` | 分页查询角色。 | 需要 `console/roles` 读权限。 |
| `/v3/auth/role/search` | `GET` | 按角色名模糊搜索。 | 需要 `console/roles` 读权限。 |
| `/v3/auth/permission` | `POST` | 给角色添加权限。 | 需要 `console/permissions` 写权限。 |
| `/v3/auth/permission` | `DELETE` | 删除角色上的权限。 | 需要 `console/permissions` 写权限。 |
| `/v3/auth/permission/list` | `GET` | 分页查询权限。 | 需要 `console/permissions` 读权限。 |
| `/v3/auth/permission` | `GET` | 判断权限是否重复。 | 需要 `console/permissions` 读权限。 |

:::note
OIDC/OAuth2 模式下，用户、角色、密码和权限通常由外部 IdP 或外部授权服务管理。此时不要把默认鉴权实现的用户和权限 API 当作 OIDC/OAuth2 的管理接口。
:::

### LDAP 鉴权插件

LDAP 插件类型是 `ldap`。Nacos 3.2 起，LDAP 插件从默认鉴权实现中分离为独立可选插件。

LDAP 插件的边界是：

- LDAP 负责校验用户名和密码。
- Nacos 仍然签发登录 token。
- Nacos 仍然使用本地角色和权限做授权。
- 登录接口仍然使用 `/v3/auth/user/login`。

启用示例：

```properties
nacos.core.auth.system.type=ldap
nacos.core.auth.enabled=true
nacos.core.auth.admin.enabled=true
nacos.core.auth.console.enabled=true

nacos.core.auth.ldap.url=ldap://localhost:389
nacos.core.auth.ldap.basedc=dc=example,dc=org
nacos.core.auth.ldap.userDn=cn=admin,${nacos.core.auth.ldap.basedc}
nacos.core.auth.ldap.password=admin
nacos.core.auth.ldap.userdn=cn={0},dc=example,dc=org
nacos.core.auth.ldap.filter.prefix=uid
```

部署时请确认：

- `nacos-ldap-auth-plugin-<version>.jar` 已在 Nacos 的 `plugins/` 目录或 classpath 中。
- `org.springframework.ldap:spring-ldap-core` 相关 jar 已放入 `plugins/` 目录。

### OIDC/OAuth2 鉴权插件

OIDC/OAuth2 插件类型是 `oidc`。它面向企业 SSO 和外部身份提供方，支持通过 OIDC Discovery 接入 Keycloak、Okta、Auth0、Microsoft Entra ID 等 IdP。

它和默认 Nacos 鉴权的差异是：

- 身份认证由外部 IdP 完成。
- 控制台登录使用 `/v1/auth/oidc/*` 兼容接口完成浏览器跳转和回调。
- Java SDK 可以使用 OAuth2 Client Credentials flow 获取 bearer token。
- Nacos 本地用户、角色、权限和密码管理不再是身份源。
- 默认 `/v3/auth/user/login` 不适用于 `oidc` 类型。
- 如果未配置外部授权端点，当前实现会默认放行非管理员授权判断。

启用示例：

```properties
nacos.core.auth.system.type=oidc
nacos.core.auth.enabled=true
nacos.core.auth.admin.enabled=true
nacos.core.auth.console.enabled=true

nacos.core.auth.plugin.oidc.issuer-uri=https://idp.example.com/realms/nacos
nacos.core.auth.plugin.oidc.client-id=nacos-server
nacos.core.auth.plugin.oidc.client-secret=${client_secret}
nacos.core.auth.plugin.oidc.scope=openid profile email
```

详细配置、Keycloak 示例和排查方法请参考[运维手册 - OIDC/OAuth2 认证](../manual/admin/oidc-auth.md)。

## 服务端插件开发

开发服务端鉴权插件时，需要依赖鉴权插件 API：

```xml
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-auth-plugin</artifactId>
    <version>${project.version}</version>
</dependency>
```

随后实现 `com.alibaba.nacos.plugin.auth.spi.server.AuthPluginService`，并通过 Java SPI 注册。

| 方法 | 说明 |
| --- | --- |
| `getAuthServiceName()` | 返回插件名，需要和 `nacos.core.auth.system.type` 对应。 |
| `identityNames()` | 声明插件需要从请求中提取的身份字段。 |
| `enableAuth(action, type)` | 判断指定操作和资源类型是否需要鉴权。 |
| `validateIdentity(identityContext, resource)` | 校验身份，并把已认证用户等信息写入 `IdentityContext`。 |
| `validateAuthority(identityContext, permission)` | 校验身份是否拥有目标资源的目标操作权限。 |
| `isLoginEnabled()` | 判断控制台是否展示插件提供的登录能力。 |
| `isAdminRequest()` | 判断当前请求是否属于管理员初始化流程。 |

插件打包后放入 `${nacos-server.path}/plugins`，并配置：

```properties
nacos.core.auth.system.type=${authServiceName}
nacos.core.auth.enabled=true
```

重启后，可以在 `${nacos-server.path}/logs/nacos.log` 中查看插件加载日志。

## 客户端鉴权插件

客户端鉴权插件负责把身份材料注入到请求中。服务端仍然由当前选中的鉴权插件做最终判断。

Java 客户端内置了几类常用实现：

| 客户端实现 | 身份材料 | 说明 |
| --- | --- | --- |
| 默认 Nacos 实现 | `username`、`password`、`accessToken` | 对接服务端默认 `nacos` 或 `ldap` 登录接口。 |
| RAM 实现 | `accessKey`、`secretKey`、签名 | 面向阿里云 RAM 兼容场景。 |
| OIDC/OAuth2 实现 | `Authorization: Bearer ...`、`accessToken` | 使用 OAuth2 Client Credentials flow 获取 token。 |

默认 Nacos 客户端示例：

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "localhost:8848");
properties.setProperty(PropertyKeyConst.USERNAME, "nacos");
properties.setProperty(PropertyKeyConst.PASSWORD, "nacos");
NamingFactory.createNamingService(properties);
ConfigFactory.createConfigService(properties);
```

OIDC/OAuth2 客户端示例：

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "localhost:8848");
properties.setProperty("nacos.client.auth.oidc.issuer-uri", "https://idp.example.com/realms/nacos");
properties.setProperty("nacos.client.auth.oidc.client-id", "nacos-client");
properties.setProperty("nacos.client.auth.oidc.client-secret", "${client_secret}");
properties.setProperty("nacos.client.auth.oidc.scope", "openid");
NamingFactory.createNamingService(properties);
ConfigFactory.createConfigService(properties);
```

自定义 Java 客户端鉴权插件需要实现 `com.alibaba.nacos.plugin.auth.spi.client.ClientAuthService`，或继承 `com.alibaba.nacos.plugin.auth.spi.client.AbstractClientAuthService`。

| 方法 | 说明 |
| --- | --- |
| `login(properties)` | 初始化或刷新身份材料。 |
| `setServerList(serverList)` | 获取客户端当前服务端地址列表。 |
| `setNacosRestTemplate(template)` | 获取 Nacos HTTP 客户端，便于执行登录或刷新。 |
| `getLoginIdentityContext(resource)` | 返回需要注入到请求中的身份材料。 |
| `shutdown()` | 释放插件资源。 |

## 与可见性插件的关系

鉴权和可见性经常一起出现，但它们解决的问题不同：

- 鉴权判断当前身份是否能访问一个指定资源。
- 可见性判断一个资源是否应该出现在详情、列表或搜索结果中。

可见性插件可以复用鉴权插件做显式授权判断，例如默认实现会使用 `@@visibility/{namespaceId}/{resourceType}/{resourceName}` 这类资源名向当前鉴权插件查询权限。更多说明请参考[可见性插件](./visibility-plugin.md)。
