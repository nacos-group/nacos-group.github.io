---
title: Subscription, Push, And Operations
keywords: [Service Subscription, Service Push, Local Cache, failover, Naming Operations]
description: Learn Nacos service subscription, push, local cache, failover, and common operations diagnostics.
sidebar:
  order: 4
---

# Subscription, Push, And Operations

Service consumers can query services or subscribe to service changes. Subscription is suitable for long-running applications. After service instances change, Nacos pushes the new discovery view to clients. Clients then update local cache and notify listeners.

## Query And Subscribe

Query is a one-time read. Subscription records a subscriber under the client connection and returns the current `ServiceInfo` view. When the service changes later, the server pushes the new view to subscribed clients.

| Action | Typical scenario |
| --- | --- |
| Query service instances | Read downstream addresses during startup, or when long-term change listening is not needed. |
| Subscribe to service changes | Long-running applications need to observe instance online/offline, weight, and health changes. |
| Unsubscribe | The application no longer needs change notifications for the service. |

HTTP Client OpenAPI is suitable for querying specified service instances. It does not provide long-connection subscription. Use the official SDK when you need subscriptions.

## Push And Retry

Naming push carries the current discovery view of a subscribed service. After receiving a push, the client updates memory cache and disk cache, and notifies listeners according to the instance diff.

Push is best-effort within the current connection lifecycle. When push fails, the server can add delayed retry for the target client. Clients should also recover from missed pushes through re-query, reconnect redo, and local cache.

## Local Cache And Failover

Clients usually keep a service-info cache. It is used to:

- Load the last known service view during startup.
- Provide a temporary discovery view during network interruption.
- Trigger listeners when push or query results change.

Naming failover is a local discovery view override. When the failover switch is enabled and a service has valid failover data, the SDK can return the failover view instead of the server view.

Local cache and failover are not server-side data repair mechanisms. Do not use client local data to repair the registry in reverse.

## Reconnect And Redo

After a connection disconnects, the client needs to restore runtime intent after reconnecting. Naming redo covers:

- Ephemeral instance registration.
- Batch ephemeral instance registration.
- Service subscription.
- Fuzzy subscription state.

Persistent service state is held by the server. Unless an operation is explicitly runtime intent, clients should not restore it through redo.

## Operations Diagnostics

Naming Admin API and Maintainer SDK can inspect or manage:

- Service and Instance metadata.
- Cluster health check configuration.
- Client lists and details.
- Services published or subscribed by a client.
- Publishers and subscribers of a service.
- Naming metrics, switches, and log levels.

These APIs are management surfaces. They are useful for troubleshooting, but ordinary business applications should not depend on them at runtime.

## Common Issues

| Symptom | What to check |
| --- | --- |
| Subscription does not receive changes | Check SDK connection, service identity, listener registration, and server-side subscriber information. |
| Query result has fewer instances than the console list | Check cluster, enabled, healthy, protection threshold, and client selector. |
| Client still sees an instance after it went offline | Check client cache, push failure, and whether failover mode is enabled. |
| gRPC client does not restore instances after reconnect | Check redo data, connection state, and registration request errors. |
| Service list or subscriber diagnostics are slow | Check query scope, page size, node load, and visibility filtering. |

## Production Advice

- Applications should subscribe only to the services they call. Avoid subscribing to all services.
- Observe subscriber count, push failures, connection count, and healthy instance ratio for critical services.
- When using `enabled=false` to drain an instance, confirm that callers use the official SDK or correctly handle enabled state.
- Failover is for emergency fallback. Exit failover mode after recovery.
- Management tools that access large Naming datasets should paginate and control request frequency.
