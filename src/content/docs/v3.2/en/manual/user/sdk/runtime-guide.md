---
title: SDK Runtime Guide
keywords: [SDK, client runtime, connection, local cache, reconnect, configuration listener, service subscription]
description: Learn how the Nacos Client SDK handles connections, local cache, listeners, subscriptions, and failure recovery during application runtime.
---

# SDK Runtime Guide

The SDK runtime guide focuses on what happens after an application starts: how the client connects to Nacos, how it listens to configuration and subscribes to services, how it recovers from network jitter, and which local data can be used as temporary fallback.

This page does not replace the API manual for each language SDK. It describes common Client SDK runtime semantics. Java is the current reference implementation. Go, Python, and other language SDKs align with these semantics as their runtime capabilities evolve.

## 1. Client SDK Boundary

Business applications should prefer the Client SDK. It is designed for application runtime access and is suitable for:

- Reading known configurations and listening to their changes.
- Registering and deregistering the current application instance.
- Querying and subscribing to known downstream services.
- Querying, subscribing to, or registering runtime AI resources such as MCP endpoints, Agent endpoints, Prompts, Skills, and AgentSpecs.
- Recovering declared runtime intent, such as listeners, subscriptions, and ephemeral instance registrations, after reconnect.

The Client SDK is not a broad management interface. Do not use it to list all namespaces, all configurations, all services, or all clients. Use the Admin API, Console API, or Maintainer SDK for bulk configuration management, audit queries, operations queries, and server state changes.

## 2. Decide Runtime Identity During Initialization

An SDK instance usually binds to one namespace. If an application needs to access multiple namespaces, create multiple SDK instances and close them when they are no longer needed.

Confirm these fields during initialization:

| Information | Description |
| --- | --- |
| `serverAddr` or `endpoint` | Use `serverAddr` for a fixed Nacos cluster address. Use `endpoint` when the client obtains the server list from an address service. |
| `namespace` | The namespace bound to the current SDK instance. |
| `group`, `dataId`, `serviceName` | Business identifiers used when accessing runtime resources. |
| `username`, `password`, `accessKey`, `secretKey`, and other credentials | When auth is enabled, the SDK carries identity material according to the server-side auth mode. |
| `contextPath` | The context path of Nacos HTTP APIs. The default is `nacos`. |
| gRPC port offset | Nacos 3.x clients still use the same main-port-plus-offset rule. By default, `9848` is derived from `8848`. |

The deployment must make both the HTTP port and the gRPC port reachable. The HTTP port is used for OpenAPI, login, and some compatibility requests. The gRPC port is used for most long-lived client runtime requests.

## 3. Connection Is Not A One-Time Action

Since Nacos 2.x, the main Client SDK runtime channel is a gRPC long-lived connection. The client resolves the server list, selects a server, establishes a connection, and reconnects when health checks fail, the server sends a reset request, or the server list changes.

After reconnect, the SDK attaches declared runtime intent to the new connection again. For example:

- Configuration listeners are resynchronized.
- Service subscriptions are resubscribed.
- Ephemeral instances are registered again.
- AI endpoints and subscriptions are recovered when the capability supports recovery.

This is runtime recovery, not server-side data repair. If a write request times out, the client cannot decide from local state alone whether the server has processed it.

## 4. Configuration Runtime

Use configuration runtime capabilities with these principles:

- Applications should read known `dataId` and `group` values. Avoid broad configuration search during business runtime.
- Use listeners for continuous change awareness instead of high-frequency polling.
- If the application needs to read the current value and then listen for later changes, use the corresponding query-and-listen method in the language SDK.
- Avoid long blocking logic inside listener callbacks. Hand events to a business thread pool when processing is complex.
- Configuration publish, delete, history, and bulk management are management scenarios. Prefer the Admin API or Maintainer SDK.

The Java SDK maintains local configuration snapshots. After a successful server query, the client writes the snapshot. When the server is unavailable, some read paths can fall back to the last successfully read local data.

Local failover files provide stronger local override. They are maintained by users and are used when Nacos servers are unavailable, remote changes are risky, or a release window needs to temporarily freeze configuration. Failover files are not written back to the server automatically.

## 5. Service Discovery Runtime

Service discovery runtime centers on registration, subscription, and local service views.

- Ephemeral instances are suitable for ordinary application instances. After a connection is disconnected, the server clears connection-scoped ephemeral state. The client redoes registration after reconnect.
- Persistent instances are suitable when the server should maintain health status through health checks. Their lifecycle is not only bound to the client connection.
- When subscribing to a service, the client receives server pushes and maintains a local service view.
- Local cache is only the last known service view, not the authoritative server state.
- Push-empty protection can ignore abnormal empty instance lists and avoid replacing a usable view with an empty one unexpectedly.

If the server is unavailable, the client may temporarily use local cache or a failover view. Business callers should still keep their own timeout, retry, and circuit-breaking strategies.

## 6. AI Resource Runtime

Some resources in AI Registry also enter runtime. Applications can query Prompts, Skills, and AgentSpecs, register MCP endpoints or Agent endpoints, and subscribe to resource changes.

As with configuration and service discovery, AI runtime needs a clear split between resource management and runtime use:

- Creating, publishing, bringing online, taking offline, importing, and governing resources are management actions.
- Querying, downloading, subscribing to resources, and registering endpoints at application runtime are Client SDK or Client API scenarios.

For more resource models, read [AI Registry](../ai/ai-registry-overview.md).

## 7. Local Cache, Failover, And Redo

The SDK runtime uses several kinds of local or in-memory data:

| Data | Purpose | Notes |
| --- | --- | --- |
| Configuration snapshot | Stores the last successfully read configuration content. | Used only for read recovery. It does not represent the latest server state. |
| Configuration failover file | A user-maintained local configuration override. | It has high local priority but is not written back to the server. |
| Service local cache | Stores the last known service instance view. | Suitable for short-term fallback. It should not replace the server for a long time. |
| Service failover data | Overrides service discovery results when failover is enabled. | It only affects the local discovery view. |
| Redo data | Records runtime intent such as subscriptions and ephemeral registrations. | Used for recovery after reconnect. It does not prove that a write has been persisted. |

The common rule is simple: these data types are not authoritative server state. During troubleshooting, check client logs, server state, and management API results together.

## 8. Runtime Troubleshooting

When a client issue occurs, start with this checklist:

| Symptom | What To Check |
| --- | --- |
| Cannot connect after startup | Check `serverAddr`, `endpoint`, HTTP port, gRPC port, context path, and network policy. |
| Auth failure | Check the server-side auth plugin, client credentials, token refresh, and whether RAM/OIDC identity modes match the deployment. |
| Configuration listener does not fire | Check whether `dataId`, `group`, and `namespace` are consistent, and whether the client is reconnecting repeatedly. |
| Service subscription result is empty | Check service name, group, cluster, instance health status, and push-empty protection settings. |
| Instance disappears after network jitter | Check whether ephemeral instance redo has recovered and whether the client has reconnected. |
| Local cache data is unexpected | Check `JM.SNAPSHOT.PATH`, the failover switch, and whether cache files were changed manually. |

Common Java SDK local paths include:

- `JM.LOG.PATH`: client log root directory. By default, it is under the user's `logs` directory.
- `JM.SNAPSHOT.PATH`: configuration and service local cache root directory. By default, it is under the user's home directory.

For more Java SDK parameters, read [Java SDK Configuration Parameters](../java-sdk/properties.md). For server ports and deployment boundaries, read [Deployment Manual](../../admin/deployment/deployment-overview.md).

## 9. Close SDK Instances

When an application exits or no longer uses an SDK instance, call the close method provided by the language SDK. Closing releases connections, background tasks, listeners, and subscription context.

Closing an SDK does not delete user-maintained failover files and does not write local cache back to the server.
