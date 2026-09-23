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

Nacos 3.3 enables Client authentication by default. Missing or incorrect credentials or permissions can cause configuration reads, service registration/discovery, and AI requests to fail. With the default plugin, configure username and password before creating the SDK so it can obtain and refresh tokens. Use the required credential mode for other plugins. See [Access Credentials](../auth.mdx).

Confirm these fields during initialization:

| Information | Description |
| --- | --- |
| `serverAddr` or `endpoint` | Use `serverAddr` for a fixed Nacos cluster address. Use `endpoint` when the client obtains the server list from an address service. |
| `namespace` | The namespace bound to the current SDK instance. |
| `group`, `dataId`, `serviceName` | Business identifiers used when accessing runtime resources. |
| `username`, `password`, `accessKey`, `secretKey`, and other credentials | Nacos 3.3 enables Client authentication by default. Configure credentials for the selected plugin; logging in to the console does not configure SDK credentials. |
| `contextPath` | The context path of Nacos HTTP APIs. The default is `nacos`. |
| gRPC port offset | Nacos 3.x clients still use the same main-port-plus-offset rule. By default, `9848` is derived from `8848`. |

Configuration and naming SDKs normally need both HTTP and gRPC reachable: HTTP handles login and related requests, while gRPC handles runtime connections. For AI-only applications, prepare networking for the selected transport and compatibility route in section 6. Selecting HTTP for AI does not switch ConfigService or NamingService to HTTP.

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

### 6.1. Java SDK Resource Services and Transports

The 3.3 Java SDK provides `AiService.mcp()`, `agent()`, `skill()`, `prompt()` and `agentSpec()`. These services share one namespace, authentication and shutdown lifecycle; obtaining a resource service does not create a separate SDK instance.

| Mode | Behavior |
| --- | --- |
| `grpc` (default) | Resources with gRPC implementations use gRPC. A network failure in explicit gRPC mode does not automatically become an HTTP request. |
| `http` | Uses supported AI HTTP capabilities and requires the HTTP main port. The SDK manages authentication, client identity and endpoint liveness. |
| `auto` | Selects by resource capability and connection state. Eligible connection failures can use HTTP; business errors do not trigger fallback. |

Skill and AgentSpec currently use HTTP, even when the overall mode is `grpc`. The legacy A2A route uses gRPC; after choosing RAD, compatible A2A operations follow the Agent transport setting. Setting `auto` does not add missing API capabilities to an older server.

Configure modes before creating the SDK. For example, use HTTP only for Agent:

```java
Properties properties = new Properties();
properties.setProperty("serverAddr", "{serverAddr}");
properties.setProperty("namespace", "public");
properties.setProperty("username", System.getenv("NACOS_USERNAME"));
properties.setProperty("password", System.getenv("NACOS_PASSWORD"));
properties.setProperty("nacosAiTransportMode", "grpc");
properties.setProperty("nacosAiAgentTransportMode", "http");
AiService aiService = AiFactory.createAiService(properties);
AgentService agents = aiService.agent();
```

The overall mode and every override are validated and fixed at initialization. Editing Properties does not switch an existing instance. See [AI Resource Parameters](../java-sdk/properties.md#26-ai-resource-parameters).

### 6.2. Subscriptions, Endpoint Liveness and Errors

- Agent subscriptions prefer server Watch notifications and fall back to bounded Discover polling when unsupported. Applications receive complete snapshots. Discard the old view on unavailable events; subscribe again after resolving terminal errors.
- MCP, Skill, Prompt and AgentSpec retain their subscription polling. Their listeners carry content already fetched by the SDK, so applications need not turn every callback into another query.
- The SDK maintains client identity and heartbeats for Agent/MCP endpoints registered over HTTP. Retain the registering instance; on normal exit, deregister through that same instance and close `AiService`. Unsubscribing or taking a definition offline does not stop the business process.
- Treat permissions, parameters, version conflicts, capacity and migration restrictions as business errors. Publication timeouts may have an unknown outcome: query the state before retrying, rather than blindly switching transports. Endpoint reconnection recovery does not imply automatic definition-publication retries.

### 6.3. Legacy A2A and RAD Compatibility

After the first reliable negotiation, the 3.3 SDK fixes an instance's route to legacy A2A or RAD. An instance that selected legacy A2A does not switch to RAD when the server is upgraded; recreate the SDK to negotiate again. Once RAD is selected, business or migration errors do not silently fall back to legacy A2A.

Avoid mixing legacy A2A and generic Agent publication sources for the same resource. Complete server upgrade and migration before adopting new Agent capabilities. See [Agent Management](../ai/agent-registry.md), [RAD Integration](../ai/rad-discovery.md) and [Upgrading](../../admin/upgrading.mdx).

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
