---
title: Auth Plugin
keywords: [Auth, Plugin, RBAC, LDAP, OIDC, OAuth2]
description: Learn how Nacos auth plugins work, what built-in implementations are available, which v3 Auth APIs belong to the default auth plugin, and how to build custom plugins.
sidebar:
    order: 5
---

# Auth Plugin

Since 2.1.0, Nacos can load auth implementations through [SPI](https://docs.oracle.com/javase/tutorial/sound/SPI-intro.html). The server selects one auth plugin at startup through `nacos.plugin.auth.type`; `nacos.core.auth.system.type` is a historical alias.

An auth plugin answers one question: **who is calling, and can that caller perform this action on this resource**.

```text
IdentityContext + Resource + Action -> allow or reject
```

If you only need to enable the built-in auth capability, start with [Admin Manual - Authorization](../manual/admin/auth.mdx). If you need enterprise SSO or an external identity provider, see [OIDC/OAuth2 Authentication](../manual/admin/oidc-auth.md). This page focuses on the plugin model, built-in implementation boundaries, and custom extension.

## Unified Management Contract

`auth` is an `EXCLUSIVE`, `STANDARD` type with type-level `critical=true`. When any auth entry gate is enabled, or an auth type is explicitly configured, the selected provider becomes the active critical implementation. A missing or disabled provider fails startup; Nacos does not fall back to another implementation.

| Implementation | pluginId | Configurable | Selection and lifecycle |
| --- | --- | --- | --- |
| Default Nacos | `auth:nacos` | Yes | Default selection. Token secret is `RESTART`; other private fields support runtime apply. |
| LDAP | `auth:ldap` | Yes | All private fields are `RESTART`. |
| OIDC | `auth:oidc` | Yes | All private fields are `RESTART`; active selection performs additional config validation. |

```properties
nacos.plugin.auth.type=nacos
```

Selection is snapshotted at startup and cannot be changed through runtime plugin state. `nacos.core.auth.enabled`, `nacos.core.auth.admin.enabled`, and `nacos.core.auth.console.enabled` are request-entry gates, not `auth:nacos` definitions.

## Concepts

### IdentityContext

`IdentityContext` describes the caller. Different plugins can use different identity material.

Common identity fields include:

| Identity material | Typical source |
| --- | --- |
| `username`, `password` | Default Nacos login |
| `accessToken` | Default Nacos token or compatibility token passing |
| `Authorization: Bearer ...` | OIDC/OAuth2 or default Nacos token |
| access key, signature | RAM or custom signing plugin |
| `remote_ip` | Request source address injected by Nacos |

A plugin declares the fields it needs through `identityNames()`. Nacos extracts those fields from the request, puts them into `IdentityContext`, and passes the context to the selected plugin.

### Resource

`Resource` is the object being accessed. Nacos controllers, protocol filters, and resource parsers create it. Auth plugins should consume this model instead of redefining Nacos resource semantics.

| Field | Description |
| --- | --- |
| `namespaceId` | Resource namespace. Some global APIs may leave it empty. |
| `group` | Config group or service group. Some APIs may leave it empty. |
| `name` | Resource name, such as config `dataId`, service name, or console resource name. |
| `type` | Resource type or explicit resource type. |
| `properties` | Extra request metadata, such as gRPC request name or `@Secured` tags. |

### Action

Nacos mainly uses two actions:

| Action | Description |
| --- | --- |
| `r` | Read, query, list, subscribe, or similar read operations. |
| `w` | Create, update, delete, publish, or similar write operations. |

## Built-In Auth Implementations

Nacos 3.2 provides the following built-in auth implementations. They share the same auth SPI, but their identity source and permission model are different.

| Plugin type | Best fit | Notes |
| --- | --- | --- |
| `nacos` | Default username, password, token, and RBAC | Built-in default implementation for basic access control in trusted internal networks. |
| `ldap` | Existing LDAP user directory | LDAP authenticates users. Nacos still issues tokens and uses local roles and permissions. Since 3.2, LDAP is a standalone optional plugin. |
| `oidc` | Enterprise SSO and OAuth2/OIDC IdP | Integrates with Keycloak, Okta, Auth0, Microsoft Entra ID, and similar providers through OIDC/OAuth2. |
| Custom type | Enterprise-specific security system | Implement `AuthPluginService` and add it to the server classpath. |

:::note
The default `nacos` auth implementation is designed for trusted internal networks and basic misuse prevention. It is not a strong-auth boundary for public hostile networks. Do not expose Nacos directly to the public Internet.
:::

### Default Nacos Auth Implementation

The default Nacos auth implementation has plugin ID `auth:nacos`. It provides username/password login, JWT tokens, user management, role management, permission management, and the default AI resource visibility integration.

Typical configuration:

```properties
nacos.plugin.auth.type=nacos
nacos.core.auth.enabled=true
nacos.core.auth.admin.enabled=true
nacos.core.auth.console.enabled=true
nacos.core.auth.server.identity.key=${custom_server_identity_key}
nacos.core.auth.server.identity.value=${custom_server_identity_value}
nacos.plugin.auth.nacos.token.secret.key=${custom_base64_token_secret_key}
```

`auth:nacos` definitions:

| Item key | Historical alias | Type / default | Sensitive | effectMode |
| --- | --- | --- | --- | --- |
| `token.secret.key` | `nacos.core.auth.plugin.nacos.token.secret.key` | `STRING` / empty | Yes | `RESTART` |
| `token.expire.seconds` | `nacos.core.auth.plugin.nacos.token.expire.seconds` | `NUMBER` / `18000` | No | `RUNTIME` |
| `token.cache.enable` | `nacos.core.auth.plugin.nacos.token.cache.enable` | `BOOLEAN` / `false` | No | `RUNTIME` |
| `caching.enabled` | `nacos.core.auth.caching.enabled` | `BOOLEAN` / `true` | No | `RUNTIME` |
| `anonymous.ai.enabled` | `nacos.core.auth.nacos.anonymous.ai.enabled` | `BOOLEAN` / `false` | No | `RUNTIME` |

All definitions are `required=false`. When an auth entry needs tokens, `token.secret.key` must in practice be valid Base64 that decodes to at least 32 bytes. Plugin detail masks it.

The default implementation uses an RBAC model:

| Object | Description |
| --- | --- |
| User | Local Nacos user. |
| Role | Role bound to a user. |
| Permission | Resource and action bound to a role. |

`ROLE_ADMIN` is the global administrator role. Users with this role can access all resources and console management features.

Default permission resources usually use this format:

```text
{namespaceId}:{group}:{signType}/{resourceName}
```

Examples:

| Resource | Example |
| --- | --- |
| Config | `public:DEFAULT_GROUP:config/example.properties` |
| Service | `public:DEFAULT_GROUP:naming/com.example.Service` |
| Console user management | `console/users` |
| Console role management | `console/roles` |
| Console permission management | `console/permissions` |
| Explicit visibility grant | `@@visibility/public/skill/example-skill` |

#### v3 Auth APIs Owned By The Default Implementation

The `/v3/auth/*` API family is provided by the default Nacos auth plugin. It is not a generic Nacos Core API surface, so it should be documented and used as part of the default auth implementation.

| API | Method | Purpose | Auth state |
| --- | --- | --- | --- |
| `/v3/auth/user/login` | `POST` | Log in with username and password and return `accessToken`. Supported by `nacos` and `ldap`. | Public login endpoint. |
| `/v3/auth/user/admin` | `POST` | Initialize the `nacos` administrator when no global admin exists. | Bootstrap endpoint, rejected after initialization. |
| `/v3/auth/user` | `POST` | Create a local user. | Requires `console/users` write permission. |
| `/v3/auth/user` | `PUT` | Update a user password. Admins can update any user. Normal users can update only themselves. | Requires identity validation. |
| `/v3/auth/user` | `DELETE` | Delete a local user. Global admins cannot be deleted. | Requires `console/users` write permission. |
| `/v3/auth/user/list` | `GET` | List users with pagination. | Requires `console/users` read permission. |
| `/v3/auth/user/search` | `GET` | Fuzzy search usernames. | Requires `console/users` write permission. |
| `/v3/auth/role` | `POST` | Create a role or bind a role to a user. | Requires `console/roles` write permission. |
| `/v3/auth/role` | `DELETE` | Delete a role or remove a role from a user. | Requires `console/roles` write permission. |
| `/v3/auth/role/list` | `GET` | List roles with pagination. | Requires `console/roles` read permission. |
| `/v3/auth/role/search` | `GET` | Fuzzy search role names. | Requires `console/roles` read permission. |
| `/v3/auth/permission` | `POST` | Add a permission to a role. | Requires `console/permissions` write permission. |
| `/v3/auth/permission` | `DELETE` | Delete a permission from a role. | Requires `console/permissions` write permission. |
| `/v3/auth/permission/list` | `GET` | List permissions with pagination. | Requires `console/permissions` read permission. |
| `/v3/auth/permission` | `GET` | Check whether a permission already exists. | Requires `console/permissions` read permission. |

:::note
In OIDC/OAuth2 mode, users, roles, passwords, and permissions are usually managed by the external IdP or an external authorization service. Do not treat the default auth user and permission APIs as OIDC/OAuth2 management APIs.
:::

### LDAP Auth Plugin

The LDAP plugin ID is `auth:ldap`. Since Nacos 3.2, LDAP is separated from the default auth implementation and provided as a standalone optional plugin.

LDAP plugin boundaries:

- LDAP authenticates usernames and passwords.
- Nacos still issues login tokens.
- Nacos still uses local roles and permissions for authorization.
- Login still uses `/v3/auth/user/login`.

Example:

```properties
nacos.plugin.auth.type=ldap
nacos.core.auth.enabled=true
nacos.core.auth.admin.enabled=true
nacos.core.auth.console.enabled=true

nacos.plugin.auth.ldap.url=ldap://localhost:389
nacos.plugin.auth.ldap.base-dn=dc=example,dc=org
nacos.plugin.auth.ldap.user-dn=cn=admin,dc=example,dc=org
nacos.plugin.auth.ldap.password=${ldap_bind_password}
nacos.plugin.auth.ldap.filter-prefix=uid
```

All `auth:ldap` definitions are `RESTART` and `required=false`:

| Item key | Historical alias | Type / default | Sensitive |
| --- | --- | --- | --- |
| `url` | `nacos.core.auth.ldap.url` | `STRING` / `ldap://localhost:389` | No |
| `base-dn` | `nacos.core.auth.ldap.basedc` | `STRING` / `dc=example,dc=org` | No |
| `timeout` | `nacos.core.auth.ldap.timeout` | `NUMBER` / `3000` | No |
| `user-dn` | `nacos.core.auth.ldap.userDn` | `STRING` / `cn=admin,dc=example,dc=org` | No |
| `password` | `nacos.core.auth.ldap.password` | `STRING` / `password` | Yes |
| `filter-prefix` | `nacos.core.auth.ldap.filter.prefix` | `STRING` / `uid` | No |
| `case-sensitive` | `nacos.core.auth.ldap.case.sensitive` | `BOOLEAN` / `true` | No |
| `ignore-partial-result-exception` | `nacos.core.auth.ldap.ignore.partial.result.exception` | `BOOLEAN` / `false` | No |

The historical `nacos.core.auth.ldap.userdn` template was not consumed by production code and is not a supported alias.

Before enabling LDAP, check that:

- `nacos-ldap-auth-plugin-<version>.jar` is available in the Nacos `plugins/` directory or classpath.
- `org.springframework.ldap:spring-ldap-core` related jars are available in the `plugins/` directory.

### OIDC/OAuth2 Auth Plugin

The OIDC/OAuth2 plugin ID is `auth:oidc`. It is designed for enterprise SSO and external identity providers. It supports Keycloak, Okta, Auth0, Microsoft Entra ID, and similar providers through OIDC Discovery.

Differences from the default Nacos auth implementation:

- Authentication is delegated to the external IdP.
- Console login uses compatibility endpoints under `/v1/auth/oidc/*` for browser redirect and callback.
- The Java SDK can use the OAuth2 Client Credentials flow to obtain bearer tokens.
- Local Nacos user, role, permission, and password management are no longer the identity source of truth.
- `/v3/auth/user/login` does not apply to plugin type `oidc`.
- If no external authorization endpoint is configured, the current implementation allows non-admin authorization decisions by default.

Example:

```properties
nacos.plugin.auth.type=oidc
nacos.core.auth.enabled=true
nacos.core.auth.admin.enabled=true
nacos.core.auth.console.enabled=true

nacos.plugin.auth.oidc.issuer-uri=https://idp.example.com/realms/nacos
nacos.plugin.auth.oidc.client-id=nacos-server
nacos.plugin.auth.oidc.client-secret=${client_secret}
nacos.plugin.auth.oidc.scope=openid profile email
```

All `auth:oidc` fields are `RESTART` and `required=false`; historical aliases use `nacos.core.auth.plugin.oidc.{itemKey}`:

| Item key | Type / default | Sensitive | Notes |
| --- | --- | --- | --- |
| `issuer-uri` | `STRING` / empty | No | Conditionally required when OIDC is selected. |
| `client-id` | `STRING` / empty | No | Conditionally required when OIDC is selected. |
| `client-secret` | `STRING` / empty | Yes | Browser login also requires it. |
| `scope` | `STRING` / `openid profile email` | No | Login scopes. |
| `token-validation-method` | `STRING` / `jwt` | No | Current code implements JWT/JWKS only. |
| `jwks-cache-ttl-seconds` | `NUMBER` / `3600` | No | Must be positive. |
| `username-claim` | `STRING` / `preferred_username` | No | Username claim. |
| `roles-claim` | `STRING` / `roles` | No | Role claim. |
| `admin-role` | `STRING` / `nacos-admin` | No | Global admin mapping. |
| `auto-create-user` | `BOOLEAN` / `true` | No | Reserved compatibility field with no current runtime effect. |
| `authorization-endpoint` | `STRING` / empty | No | External non-admin authorization endpoint. |
| `authorization-timeout-ms` | `NUMBER` / `5000` | No | External authorization timeout. |
| `strict-nonce-validation` | `BOOLEAN` / `true` | No | Strict nonce validation. |
| `strict-audience-validation` | `BOOLEAN` / `true` | No | Strict audience/azp validation. |

For detailed setup, Keycloak examples, and troubleshooting, see [Admin Manual - OIDC/OAuth2 Authentication](../manual/admin/oidc-auth.md).

## Server Plugin Development

To build a server-side auth plugin, depend on the auth plugin API:

```xml
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-auth-plugin</artifactId>
    <version>${project.version}</version>
</dependency>
```

Then implement `com.alibaba.nacos.plugin.auth.spi.server.AuthPluginService` and register it with Java SPI.

| Method | Description |
| --- | --- |
| `getAuthServiceName()` | Return the stable pluginName selected by `nacos.plugin.auth.type`. |
| `identityNames()` | Declare identity fields that should be extracted from requests. |
| `enableAuth(action, type)` | Decide whether the action and resource type require auth. |
| `validateIdentity(identityContext, resource)` | Authenticate the caller and enrich `IdentityContext`. |
| `validateAuthority(identityContext, permission)` | Authorize the caller for the target resource and action. |
| `isLoginEnabled()` | Declare whether the console should expose plugin-provided login. |
| `isAdminRequest()` | Declare whether the request is an administrator bootstrap flow. |

Package the plugin and place it under `${nacos-server.path}/plugins`, then configure:

```properties
nacos.plugin.auth.type=${authServiceName}
nacos.core.auth.enabled=true
```

After restart, check `${nacos-server.path}/logs/nacos.log` for plugin loading logs.

`AuthPluginService` inherits `PluginConfigSpec`. An old binary implementation with no definitions still loads but appears as `configurable=false`. A new implementation should declare definitions, implement atomic `applyConfig`, and return its accepted snapshot. Do not declare module gates, `type` selection, or `enabled` as private config.

## Client Auth Plugins

Client auth plugins inject identity material into requests. The selected server-side auth plugin still makes the final decision.

The Java client includes these common implementations:

| Client implementation | Identity material | Notes |
| --- | --- | --- |
| Default Nacos | `username`, `password`, `accessToken` | Integrates with the default `nacos` or `ldap` login API. |
| RAM | `accessKey`, `secretKey`, signature | For Alibaba Cloud RAM-compatible scenarios. |
| OIDC/OAuth2 | `Authorization: Bearer ...`, `accessToken` | Uses the OAuth2 Client Credentials flow. |

Default Nacos client example:

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "localhost:8848");
properties.setProperty(PropertyKeyConst.USERNAME, "nacos");
properties.setProperty(PropertyKeyConst.PASSWORD, "nacos");
NamingFactory.createNamingService(properties);
ConfigFactory.createConfigService(properties);
```

OIDC/OAuth2 client example:

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

Custom Java client auth plugins should implement `com.alibaba.nacos.plugin.auth.spi.client.ClientAuthService`, or extend `com.alibaba.nacos.plugin.auth.spi.client.AbstractClientAuthService`.

| Method | Description |
| --- | --- |
| `login(properties)` | Initialize or refresh identity material. |
| `setServerList(serverList)` | Receive the current client-side server list. |
| `setNacosRestTemplate(template)` | Receive the HTTP client used for login or refresh calls. |
| `getLoginIdentityContext(resource)` | Return identity material to inject into requests. |
| `shutdown()` | Release plugin-owned resources. |

## Relationship With Visibility Plugins

Auth and visibility often appear together, but they answer different questions:

- Auth decides whether the current identity can access one target resource.
- Visibility decides whether a resource should appear in detail, list, or search results.

A visibility plugin may delegate explicit permission checks to the selected auth plugin. For example, the default implementation checks resources such as `@@visibility/{namespaceId}/{resourceType}/{resourceName}` through the current auth plugin. See [Visibility Plugin](./visibility-plugin.md) for details.
