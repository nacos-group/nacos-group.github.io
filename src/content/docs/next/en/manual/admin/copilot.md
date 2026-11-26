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

- Names follow Spring's configuration-key rules: `Prod-Qwen`, `PROD-QWEN`, and `prod-qwen` identify the same connection, and `nacos.copilot.selectedConnection` is trimmed and lower-cased before merging, lookup, and selection. A name is one configuration-key element; declarations containing dots or non-ASCII characters cannot be resolved by Spring and are ignored. An underscore is not a name separator: `prod_qwen` resolves to a separate connection named `prodqwen`.
- When one connection is declared under several spellings, the spellings belong to the same configuration block and their fields merge into one connection; no spelling is selected over another and no spelling's fields are dropped.
- Connection fields follow Spring's precedence: JVM system properties over environment variables, and environment variables over property files. The environment-variable spelling replaces dots and hyphens with underscores, for example `NACOS_COPILOT_CONNECTIONS_PROD_QWEN_MODEL` and `NACOS_COPILOT_CONNECTIONS_PROD_QWEN_API_KEY`; an explicit empty value at higher precedence blocks lower values. This applies to keys only; model, credential, and selection values are used verbatim.
- A deployment connection replaces the entire lower-source connection with the same normalized name; it does not inherit its fields.

### 2.2 Validation

Every connection is validated at load time. `providerId` and `model` are required. The provider prefix must be resolvable, and an explicit `baseUrl` must pass the HTTPS and public-address check. A connection that fails validation is marked unavailable with its diagnostic reason, while other connections keep serving.

## 3. Selection and fallback

Copilot routes requests to:

1. the connection named by `nacos.copilot.selectedConnection`;
2. otherwise the first available deployment connection;
3. otherwise the first available legacy connection.

Connections are ordered by priority and then by name, so ties resolve deterministically: deployment connections take precedence over the legacy connection. A selection that is missing, disabled, or unavailable falls back to the default order and is reported with a warning on refresh. When Copilot is disabled with `nacos.copilot.enabled=false`, no connection is routed: the settings page shows no active connection and the API returns a `null` `activeConnection`, while the connection list stays visible.

## 4. Configuration precedence and refresh

Each refresh captures three inputs once: the current `nacos.copilot.*` deployment configuration, raw `copilot-config.json`, and pure built-in defaults. For global fields, deployment declarations override stored values, which override defaults. An absent field inherits; a string declared as `null`, empty, or whitespace only clears the value and blocks lower sources. Stored JSON `null` clears survive unrelated saves; `false` and `0` are real values. Deployment connections replace same-name lower-source definitions as a whole; writing connection fields through the generic configuration API does not override them. A blank `nacos.copilot.selectedConnection` clears the effective selection without changing the stored selection.

In a merged deployment, additions and updates to the configuration file refresh Copilot without a restart. **Deleting a deployment key requires a restart**: the watcher retains removed keys while the process runs. A pure console deployment does not watch the file and requires a restart for any file change. Environment changes also require a restart. Removing a deployment selection lets the stored selection take effect only after restart.

Refresh is per node. Saving through one console does not implicitly refresh other consoles. Keep provider dependencies and connection configuration identical, and align the storage server, namespace, and read/write permissions; shared storage alone does not synchronize runtime snapshots.

**Upgrade impact:** blank deployment placeholders now clear values instead of inheriting stored settings, and legacy credentials now prefer deployment, then stored, then environment values. Review existing placeholders and credentials before upgrading.

## 5. Console behavior

The console Settings page lists every connection with its source (`Deployment config` or `Legacy config`), model, availability, and — when the key comes from the process environment — a `Key from environment` badge, shows the connection currently in use, and stores the selection you submit. Only an existing, enabled, and available connection can be selected; the save request is rejected otherwise. The check uses the connection table from the last refresh, so a key typed into the deprecated section must be saved before the legacy connection can be selected. A save waits for synchronous refresh, including model validation, DNS lookup for an explicit `baseUrl`, and Studio initialization when configured. Step5 asynchronous save/validation is still pending; the current status fields remain `available` and `unavailableReason`. `Automatic` clears the stored selection so the default order applies, and a stored selection that can no longer serve requests falls back to `Automatic` in the form.

Deployment configuration wins over the stored selection. When `nacos.copilot.selectedConnection` is set, a connection saved through the console — or `Automatic` — is persisted but does not change the active connection. The page shows a notice naming the deployment-selected connection, and the API reports `effectiveSelectedConnection` with `selectedConnectionSource`: `DEPLOYMENT` when the deployment declares the selection, `STORED` when the stored value is effective, and `NONE` when no selection is configured. Remove the deployment setting and restart the node to let the stored selection take effect.

Reading an unreadable or invalid stored JSON object returns HTTP 503 / `SERVER_ERROR`, without credential details or fabricated defaults; trailing content is rejected. Saving rejects the same stored document before writing.

Saving patches only submitted fields; omitted fields and existing `null` clears are preserved. The request validates before conditional persistence, then resolves and activates this node's snapshot. A pre-persist read or write failure rejects the save without changing runtime state. An activation exception returns a sanitized "stored but not activated" error. A rare local read failure after persistence remains a deferred gap, with no compensation protocol.

The stored api key is never returned in plain text: the Console API returns a mask, and connection metadata only reports whether a credential is configured and where it comes from (`ENVIRONMENT`, `DEPLOYMENT`, or `CONSOLE`), never the value itself. A saved selection that no longer exists is still listed as a warning so it can be changed.

## 6. Migrate from the deprecated apiKey and model

Older installations configure one implicit connection through `nacos.copilot.apiKey`, `nacos.copilot.model`, the stored console fields, or the `COPILOT_API_KEY` environment variable. That connection is still loaded as the `legacy` connection, but it is deprecated:

1. Declare a deployment connection with a stable name, `providerId`, `model`, and `apiKey`.
2. Optionally set `nacos.copilot.selectedConnection` to that name.
3. Restart or trigger a configuration refresh, then confirm the active connection on the console Settings page.
4. Remove the old `apiKey` and `model` settings once the new connection is confirmed.

Notes:

- Legacy credentials resolve in this order: deployment `nacos.copilot.apiKey`, stored `apiKey`, then `COPILOT_API_KEY`. An explicit clear at the highest declaring source blocks lower sources. Clearing a stored key blocks environment fallback but cannot erase a deployment credential; its source remains `DEPLOYMENT`.
- The deprecated key and model fields remain editable even without a runtime `LEGACY` connection, so they can be configured or cleared during migration.
- Without a real legacy declaration, built-in defaults do not create a synthetic legacy connection or warning. A real `LEGACY` connection logs the migration warning on each refresh and keeps serving during the deprecation window; a deployment connection merely named `legacy` does not trigger it.
