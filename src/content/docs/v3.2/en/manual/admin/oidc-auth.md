---
title: OIDC/OAuth2 Authentication
keywords: [OIDC, OAuth2, SSO, Keycloak, Single Sign-On]
description: Guide for configuring the Nacos OIDC/OAuth2 auth plugin to integrate with Keycloak, Okta, Auth0, and other identity providers for SSO and bearer token access.
sidebar:
    order: 8
---

# OIDC/OAuth2 Authentication

## Overview

The Nacos OIDC/OAuth2 auth plugin uses plugin type `oidc`. It provides OpenID Connect 1.0 / OAuth2 based authentication for the Nacos console, allowing Nacos to delegate user authentication to an external Identity Provider (IdP).

When the OIDC plugin is enabled, the Nacos console login page displays a **"Sign in with SSO"** button. Users click the button to be redirected to the IdP for authentication, and are automatically returned to the Nacos console upon successful login.

The Java SDK can also use the OAuth2 Client Credentials flow to obtain bearer tokens and inject them into requests. Console SSO and SDK bearer tokens are different entry points, but the server validates both through the `oidc` auth plugin.

### Use Cases

- Enterprise with an existing identity system (Keycloak, Okta, Auth0, Azure AD, etc.) that wants Nacos to use SSO
- Centralized user and permission management, avoiding separate account maintenance in Nacos
- Compliance with enterprise security requirements (MFA, audit logging, password policies)

### Supported Identity Providers

Any OIDC 1.0 compliant IdP that exposes a `/.well-known/openid-configuration` discovery endpoint. Verified with:

- Keycloak (>= 18.0)
- Okta
- Auth0
- Azure AD / Microsoft Entra ID

### Requirements

- Nacos: 3.2.0+
- JDK: 17+

---

## 1. Prerequisites

| Component | Version | Notes |
|-----------|---------|-------|
| JDK | 17+ | For compiling and running Nacos |
| OIDC IdP | OIDC 1.0 compliant | This guide uses Keycloak 24 as an example |
| Nacos | 3.2.0+ | Source or pre-built distribution |

---

## 2. Set Up OIDC IdP (Keycloak Example)

> Skip this section if you already have a working OIDC IdP.

### 2.1 Start Keycloak

```bash
docker run -d --name keycloak \
  -p 8081:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:24.0 \
  start-dev
```

Access `http://localhost:8081` and log in with `admin/admin`.

### 2.2 Create a Realm

1. Click **Create Realm** in the top-left dropdown
2. Realm name: `nacos`
3. Click **Create**

### 2.3 Create a Client

1. Go to **Clients** → **Create client**
2. Step 1:
   - Client type: `OpenID Connect`
   - Client ID: `nacos-server`
   - Click **Next**
3. Step 2:
   - Client authentication: `On`
   - Authorization: `Off`
   - Check `Standard flow`
   - Click **Next**
4. Step 3:
   - Valid redirect URIs: `http://localhost:8080/*`
   - Web origins: `http://localhost:8080`
   - Click **Save**
5. Go to the **Credentials** tab and copy the **Client secret**

### 2.4 Create a Test User

1. Go to **Users** → **Add user**
2. Username: `testuser`, Email: `test@example.com`, **Email verified: On**
3. Click **Create**
4. Go to the **Credentials** tab
5. Click **Set password**, enter a password, set **Temporary: Off**

### 2.5 Record Key Information

| Item | Value |
|------|-------|
| Issuer URI | `http://localhost:8081/realms/nacos` |
| Client ID | `nacos-server` |
| Client Secret | (from step 2.3) |
| Discovery URL | `http://localhost:8081/realms/nacos/.well-known/openid-configuration` |

Verify the discovery endpoint:

```bash
curl http://localhost:8081/realms/nacos/.well-known/openid-configuration
```

---

## 3. Configure application.properties

Edit `<NACOS_HOME>/conf/application.properties`.

### 3.1 Switch Auth System To OIDC/OAuth2

```properties
### Enable OIDC/OAuth2 auth
nacos.core.auth.system.type=oidc

### Enable authentication
nacos.core.auth.enabled=true
```

### 3.2 General Auth Configuration (Required)

These settings are still **required** even with OIDC enabled, as Nacos uses its own JWT for internal server-to-server communication.

```properties
### Server identity for inter-node communication (any non-empty string)
nacos.core.auth.server.identity.key=serverIdentity
nacos.core.auth.server.identity.value=security

### Internal JWT signing key (Base64 encoded, original string >= 32 chars)
nacos.core.auth.plugin.nacos.token.secret.key=VGhpc0lzTXlDdXN0b21TZWNyZXRLZXkwMTIzNDU2Nzg=
```

> **Important**: If `nacos.core.auth.plugin.nacos.token.secret.key` is not set, the startup script will enter interactive mode prompting for input. Generate a key with `openssl rand -base64 32`.

### 3.3 OIDC Plugin Configuration (Required)

```properties
### IdP Issuer URI (for OIDC auto-discovery)
nacos.core.auth.plugin.oidc.issuer-uri=http://localhost:8081/realms/nacos

### OAuth2 Client credentials
nacos.core.auth.plugin.oidc.client-id=nacos-server
nacos.core.auth.plugin.oidc.client-secret=nacos-client-secret

### OAuth2 scopes
nacos.core.auth.plugin.oidc.scope=openid profile email

### Claim field for username extraction from ID Token
nacos.core.auth.plugin.oidc.username-claim=preferred_username
```

### 3.4 OIDC Optional Configuration

| Property | Default | Description |
|----------|---------|-------------|
| `nacos.core.auth.plugin.oidc.token-validation-method` | `jwt` | Token validation method. The current implementation validates JWTs through JWKS. `introspection` is reserved and should not be documented as a supported runtime path yet |
| `nacos.core.auth.plugin.oidc.jwks-cache-ttl-seconds` | `3600` | JWKS public key cache TTL (seconds) |
| `nacos.core.auth.plugin.oidc.roles-claim` | `roles` | Claim name for roles in ID Token |
| `nacos.core.auth.plugin.oidc.admin-role` | `nacos-admin` | Admin role name |
| `nacos.core.auth.plugin.oidc.auto-create-user` | `true` | Auto-create user on first login |
| `nacos.core.auth.plugin.oidc.authorization-endpoint` | (empty) | External authorization decision endpoint. When empty, the current implementation allows non-admin authorization decisions |
| `nacos.core.auth.plugin.oidc.authorization-timeout-ms` | `5000` | Authorization request timeout (ms) |
| `nacos.core.auth.plugin.oidc.strict-nonce-validation` | `true` | Enable strict nonce validation |
| `nacos.core.auth.plugin.oidc.strict-audience-validation` | `true` | Enable strict audience validation |

:::note
`strict-nonce-validation` and `strict-audience-validation` are enabled by default when not explicitly configured. Disable them only temporarily during development or IdP integration debugging, and turn them back on before production.
:::

:::caution
If production needs permission isolation by namespace, config, service, or AI resource, configure `nacos.core.auth.plugin.oidc.authorization-endpoint`, or provide a stricter authorization implementation. In the current implementation, an empty endpoint allows non-admin authorization decisions by default.
:::

### 3.5 Java SDK OAuth2 Client Credentials

The Java SDK OIDC/OAuth2 client auth uses the OAuth2 Client Credentials flow. It is intended for service-to-service access.

```properties
nacos.client.auth.oidc.issuer-uri=https://idp.example.com/realms/nacos
nacos.client.auth.oidc.client-id=nacos-client
nacos.client.auth.oidc.client-secret=${client_secret}
nacos.client.auth.oidc.scope=openid
```

If the IdP does not support Discovery, or if you want to skip Discovery, set the token endpoint directly:

```properties
nacos.client.auth.oidc.token-endpoint=https://idp.example.com/realms/nacos/protocol/openid-connect/token
```

The SDK refreshes the token before expiration and injects both `Authorization: Bearer ...` and `accessToken`.

---

## 4. Start Nacos

```bash
cd <NACOS_HOME>
bin/startup.sh -m standalone   # Standalone mode
# or
bin/startup.sh                  # Cluster mode
```

Check logs:

```bash
tail -f logs/start.out
```

Success indicator: `Nacos started successfully` in logs.

---

## 5. Verify OIDC Login

### 5.1 Access the Console

Open `http://localhost:8080/` in your browser. The login page should display a **"Sign in with SSO"** button with the username/password form hidden.

### 5.2 Click the SSO Button

Clicking the button redirects to the IdP login page. After authenticating at the IdP, you are automatically redirected back to the Nacos console.

### 5.3 Verify OIDC User Behavior

| Check | Expected Behavior |
|-------|-------------------|
| Username display | Header shows the IdP username |
| Change Password menu | **Hidden** (passwords managed by IdP) |
| Permission management | **Hidden** (managed by IdP) |
| Logout | Redirects to IdP logout endpoint (RP-initiated logout) |

---

## 6. Login Flow

```
Browser              Nacos                    IdP (Keycloak)
   |                    |                            |
   | GET /              |                            |
   |------------------->|                            |
   | HTML + JS          |                            |
   |<-------------------|                            |
   | GET /v3/console/server/state                    |
   |------------------->|                            |
   | {auth_system_type: "oidc"}                      |
   |<-------------------|                            |
   | Render "Sign in with SSO" button                |
   | User clicks button |                            |
   | GET /v1/auth/oidc/login                         |
   |------------------->|                            |
   | 302 IdP authorize  |                            |
   |<-------------------|                            |
   | GET IdP authorize  |                            |
   |-------------------------------------------->    |
   | IdP login page     |                            |
   |<--------------------------------------------    |
   | User enters creds  |                            |
   |-------------------------------------------->    |
   | 302 callback?code= |                            |
   |<--------------------------------------------    |
   | GET /v1/auth/oidc/callback?code=...             |
   |------------------->|                            |
   |                    | POST token endpoint        |
   |                    |--------------------------->|
   |                    | {access_token, id_token}    |
   |                    |<---------------------------|
   |                    | JWKS signature validation   |
   |                    |--------------------------->|
   |                    |<---------------------------|
   | 302 / + Set-Cookie |                            |
   |<-------------------|                            |
   | JS reads cookies   |                            |
   | Syncs to localStorage                           |
   | Deletes cookies    |                            |
   | Enters console     |                            |
```

---

## 7. Troubleshooting

### 7.1 Startup hangs at "Please input the JWT token secret key"

**Cause**: `nacos.core.auth.plugin.nacos.token.secret.key` is not set.

**Fix**: Set a Base64-encoded key in `application.properties`:

```properties
nacos.core.auth.plugin.nacos.token.secret.key=VGhpc0lzTXlDdXN0b21TZWNyZXRLZXkwMTIzNDU2Nzg=
```

### 7.2 Startup fails: Empty identity

**Cause**: `nacos.core.auth.server.identity.key/value` are empty.

**Fix**:

```properties
nacos.core.auth.server.identity.key=serverIdentity
nacos.core.auth.server.identity.value=security
```

### 7.3 IdP reports redirect_uri error

**Cause**: The IdP client's Valid Redirect URIs does not include the Nacos callback URL.

**Fix**: Add `http://<nacos-host>:<port>/*` to the IdP client configuration.

### 7.4 Callback returns "No valid OIDC token found"

**Cause**: JWT signature validation failed.

**Steps**:
1. Verify `issuer-uri` matches the IdP's actual issuer (no trailing slash)
2. Check `logs/nacos.log` for detailed errors
3. During development, temporarily disable strict audience validation: `nacos.core.auth.plugin.oidc.strict-audience-validation=false`
4. Verify the IdP's JWKS endpoint is accessible

### 7.5 Auto-login after logout

This is standard OIDC SSO behavior. The IdP's SSO session is still valid, so the IdP returns a logged-in state automatically. To force re-authentication, clear the IdP session at its logout endpoint.

---

## 8. Comparison with Other Auth Modes

| Feature | nacos | ldap | oidc |
|---------|-------|------|------|
| User storage | Nacos built-in DB | LDAP server | IdP |
| Password management | Nacos console | LDAP server | IdP |
| Single Sign-On | No | No | **Yes** |
| SDK OAuth2 Client Credentials | No | No | **Yes** |
| Multi-Factor Auth | No | Depends on LDAP | **Yes** |
| Authorization source | Local Nacos permissions | Local Nacos permissions | IdP roles or external authorization endpoint |
| Use case | Small standalone deployments | Enterprises with LDAP | Modern enterprise SSO |
