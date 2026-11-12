---
title: Instance Lifecycle
keywords: [Service Registration, Instance Heartbeat, Ephemeral Instance, Persistent Instance]
description: Learn how Nacos service instances are registered, renewed, deregistered, updated, and cleaned up.
sidebar:
  order: 2
---

# Instance Lifecycle

The instance lifecycle describes how a service instance is registered, discovered, updated, deregistered, and cleaned up. Understanding this process helps troubleshoot missing instances, abnormal health state, and unexpected subscription results.

## Register Instances

When registering an instance, specify the service identity and instance address:

| Field | Description |
| --- | --- |
| `namespaceId` | Namespace. The default is `public`. |
| `groupName` | Group. The default is `DEFAULT_GROUP`. |
| `serviceName` | Service name. |
| `ip` / `port` | Instance address. |
| `clusterName` | Cluster name. The default is `DEFAULT`. |
| `ephemeral` | Whether the instance is ephemeral. It must match the Service type. |
| `metadata` | Instance metadata. |

Ephemeral instances are usually registered by running application processes. Persistent instances are usually maintained by management workflows. Do not use persistent instances as "ephemeral instances without health checks", and do not treat ephemeral instances as long-term persistent data.

## Ephemeral Instances

Ephemeral instances are runtime state. They depend on live clients.

For gRPC SDK clients, instances are attached to the client connection. After the connection is disconnected, the server removes publisher and subscriber state associated with that connection. After reconnecting, the SDK re-registers instances and restores subscriptions from redo data.

For HTTP or compatible clients, heartbeat renewal keeps instances alive. In Nacos 3.x HTTP OpenAPI, registration and renewal use the same endpoint. `heartBeat=true` means the request is a renewal.

A renewal request only means the instance is still alive. It does not re-parse full instance metadata. If the instance has expired and been removed, the client must register the full instance information again.

## Persistent Instances

Persistent instances are maintained through the server persistence path. They are suitable for management through the console, Admin API, or Maintainer SDK.

When writing a persistent instance fails, Nacos does not fall back to the temporary Distro path. The corresponding CP path must be available. Persistent instance recovery depends on server snapshots and metadata recovery.

Persistent and ephemeral services cannot be mixed under the same Service identity. If a service has already been created as an ephemeral service, do not force persistent instances into it. Adjust the service design first.

## Deregister Instances

Deregistration removes the instance from the owning client or persistence path and triggers a service change event.

For runtime clients, deregistering a missing instance is usually treated as a successful no-op. When an application exits, call deregistration or close the SDK when possible, so the server can clean runtime state quickly.

## Update Instances

Instance updates are commonly used to change:

- `enabled` state.
- `weight`.
- Instance extension metadata.

Instance metadata written through management paths is operational metadata. It overrides runtime registration metadata with the same key. For details, see [Health, Weight, And Metadata](./health-and-metadata.md).

## Batch Registration

Batch registration is useful when an SDK or integration layer publishes multiple ephemeral instances at once. The server attaches these publications to the owning client and triggers service change events.

Batch registration is not a batch management API. Use Admin API or Maintainer SDK for batch management, listing, and diagnostics.

## Cleanup Behavior

Common cleanup sources include:

- gRPC connection disconnection.
- HTTP heartbeat timeout.
- Ephemeral client expiration.
- Empty service cleanup.
- Metadata expiration cleanup.

Cleanup affects subscription push and service discovery results. When troubleshooting an instance that "suddenly disappeared", check client connection state, heartbeat logs, server cleanup logs, and Distro synchronization together.
