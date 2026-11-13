---
title: Copilot Assistant
keywords: [Nacos Copilot, model connection, connection selection, apiKey migration, providerId]
description: Configure Nacos Copilot model connections, choose the connection used by the console assistant, and migrate from the deprecated api key settings.
sidebar:
  order: 15
---

# Copilot Assistant

Nacos Copilot is the console-side AI assistant for Prompt debugging and optimization and for Skill generation and optimization. Every request is served by a **model connection** that describes the provider, the model, and the credential.

This page covers connection configuration, connection selection, credential handling, and migration from the deprecated `apiKey`/`model` settings.

## 1. Enablement

Copilot is enabled by default in console deployments and requires a routable model connection before it becomes available. It is not loaded when `nacos.deployment.type=server`. Set `nacos.copilot.enabled=false` to disable it explicitly.

When no connection is routable, Copilot stays unavailable instead of failing individual requests. The console Settings page shows the current connection state.

## 2. Define connections

Connections are declared under the `nacos.copilot.connections.<name>` prefix in the deployment configuration:

```properties
nacos.copilot.connections.prod-qwen.providerId=dashscope
nacos.copilot.connections.prod-qwen.model=qwen-max
nacos.copilot.connections.prod-qwen.apiKey=<api-key>
nacos.copilot.connections.prod-qwen.displayName=Production Qwen
nacos.copilot.selectedConnection=prod-qwen
```

| Field | Required | Description |
| --- | --- | --- |
| `providerId` | Yes | Model provider identifier resolved by the Copilot model resolver, for example `dashscope`. |
| `model` | Yes | Model identifier understood by the provider. |
| `apiKey` | No | Credential used to call the provider. |
| `baseUrl` | No | Custom endpoint. It must use HTTPS and resolve to a public address unless its host matches `nacos.copilot.base-url.allowlist`. |
| `endpointPath` | No | Path appended to the resolved endpoint. |
| `displayName` | No | Label shown in the console; defaults to the connection name. |
| `enabled` | No | Whether the connection may be routed; defaults to `true`. |
| `stream` | No | Provider streaming preference passed to the model client. |
| `enableThinking` | No | Provider thinking-mode preference passed to the model client. |
| `options` | No | Provider-specific options. |

### 2.1 Connection names

- Names are case-insensitive: they are trimmed and lower-cased with `Locale.ROOT` before merging, lookup, and selection, so `Prod-Qwen` and `prod-qwen` identify the same connection. `nacos.copilot.selectedConnection` follows the same rule.
- A name is a single configuration-key element, so it may contain only ASCII letters, digits, and `-`. Dots and surrounding whitespace are not valid in a key. A declaration that violates this grammar is skipped with a warning instead of being loaded.
- When one connection is declared under several spellings, the lower-case spelling wins if it is present; otherwise the first spelling in lexicographic order wins. The other spellings are reported and ignored, including their fields.
- A deployment connection replaces the legacy connection with the same name.

### 2.2 Validation

Every connection is validated at load time. `providerId` and `model` are required. The provider prefix must be resolvable, and an explicit `baseUrl` must pass the HTTPS and public-address check. A connection that fails validation is marked unavailable with its diagnostic reason, while other connections keep serving.

## 3. Selection and fallback

Copilot routes requests to:

1. the connection named by `nacos.copilot.selectedConnection`;
2. otherwise the first available deployment connection;
3. otherwise the first available legacy connection.

Connections are ordered by priority and then by name, so ties resolve deterministically: deployment connections take precedence over the legacy connection. A selection that is missing, disabled, or unavailable falls back to the default order and is reported with a warning on refresh. When Copilot is disabled with `nacos.copilot.enabled=false`, no connection is routed: the settings page shows no active connection and the API returns a `null` `activeConnection`, while the connection list stays visible.

## 4. Configuration precedence and refresh

The effective Copilot configuration is merged per field: an explicit `nacos.copilot.*` value overrides `copilot-config.json`, which overrides the built-in default. A blank `nacos.copilot.selectedConnection` counts as not declared, so it neither clears nor overrides a stored selection; the same applies to the credential fields only when they are explicitly cleared. Connection fields are read from the deployment configuration only; writing the same fields into `copilot-config.json` through the generic configuration API does not override a deployment connection.

In a merged deployment, Copilot re-binds `nacos.copilot.*` when the configuration file changes, so the connection table, `selectedConnection`, and `enabled` apply without a restart. A pure console deployment does not watch the configuration file and requires a restart. Environment variable changes are not picked up while the process runs and also require a restart.

## 5. Console behavior

The console Settings page lists every connection with its source (`Deployment config` or `Legacy config`), model, availability, and — when the key comes from the process environment — a `Key from environment` badge, shows the connection currently in use, and stores the selection you submit. Only an existing, enabled, and available connection can be selected; the save request is rejected otherwise. The check uses the connection table from the last refresh and does not contact the provider, so a key typed into the deprecated section must be saved before the legacy connection can be selected. `Automatic` clears the stored selection so the default order applies, and a stored selection that can no longer serve requests falls back to `Automatic` in the form.

Deployment configuration wins over the stored selection. When `nacos.copilot.selectedConnection` is set, a connection saved through the console — or `Automatic` — is persisted but does not change the active connection. The page shows a notice naming the deployment-selected connection, and the API reports `effectiveSelectedConnection` with `selectedConnectionSource`: `DEPLOYMENT` when the deployment declares the selection, `STORED` when the stored value is effective, and `NONE` when no selection is configured. Remove the deployment setting to let the stored selection take effect.

The stored api key is never returned in plain text: the Console API returns a mask, and connection metadata only reports whether a credential is configured and where it comes from (`ENVIRONMENT`, `DEPLOYMENT`, or `CONSOLE`), never the value itself. A saved selection that no longer exists is still listed as a warning so it can be changed.

## 6. Migrate from the deprecated apiKey and model

Older installations configure one implicit connection through `nacos.copilot.apiKey`, `nacos.copilot.model`, the stored console fields, or the `COPILOT_API_KEY` environment variable. That connection is still loaded as the `legacy` connection, but it is deprecated:

1. Declare a deployment connection with a stable name, `providerId`, `model`, and `apiKey`.
2. Optionally set `nacos.copilot.selectedConnection` to that name.
3. Restart or trigger a configuration refresh, then confirm the active connection on the console Settings page.
4. Remove the old `apiKey` and `model` settings once the new connection is confirmed.

Notes:

- The legacy connection prefers `COPILOT_API_KEY` over the stored or deployment `apiKey`. Clearing the stored key from the console marks the credential as cleared, so the legacy connection stops falling back to the environment and becomes unavailable instead of silently reusing the process credential.
- An explicit deployment `nacos.copilot.apiKey` still applies through the regular precedence, even after the stored key is cleared. The legacy connection then reports `DEPLOYMENT` as its credential source, and the console marks it with a `Key from deployment config` badge, so it is clear that a key saved in the form is not the one in use.
- The console shows the legacy key and model section — marked as deprecated — only when the legacy connection exists.
- Loading the legacy connection logs a deprecation warning with the migration hint on every configuration refresh; the connection keeps serving during the deprecation window.
