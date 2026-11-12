---
title: Service Discovery Overview
keywords: [Service Discovery, Naming, Registry, Nacos]
description: Learn the Nacos service discovery model, service types, API boundaries, and recommended usage.
sidebar:
  order: 1
---

# Service Discovery Overview

Nacos service discovery manages services, instances, clusters, health state, and subscriptions. Service providers register instances into Nacos. Service consumers query or subscribe to instance lists by service name, and then select a suitable instance to call.

Service discovery answers one question: "Which instances are currently available for this service?" It is not a general traffic governance engine or a service mesh control plane. Weight, health protection, metadata, and client selectors serve discovery semantics. They should not be treated as a complete traffic governance system.

## Resource Model

The top-level resource in service discovery is Service:

```text
namespaceId -> groupName -> serviceName
```

Cluster and Instance are subordinate resources:

```text
namespaceId -> groupName -> serviceName -> clusterName -> instance
```

| Resource | Description |
| --- | --- |
| Namespace | Isolates environments, tenants, or business domains. |
| Group | Groups services again inside a namespace. |
| Service | The service discovery unit. Consumers usually query instances by service name. |
| Cluster | A cluster group under a Service, often used for data centers, regions, or deployment units. |
| Instance | A concrete service instance, usually described by IP, port, cluster, and metadata. |

## Ephemeral And Persistent Services

Each Service has a service type. The type decides which consistency path maintains instance state.

| Service type | Meaning | Main state path |
| --- | --- | --- |
| Ephemeral service | Instances are held by live clients. When the client disconnects, heartbeat expires, or the connection is released, instances are removed. | AP-oriented runtime client state and Distro synchronization. |
| Persistent service | Instances are managed as persistent resources and can be restored from server snapshots. | CP-oriented persistent client state and metadata persistence. |

`ephemeral` is a Service-level semantic. The `ephemeral` field in instance requests must match the Service type. Do not mix ephemeral and persistent instances under the same Service identity.

## Runtime And Management Surfaces

| Surface | Typical use |
| --- | --- |
| Client SDK | Register instances, deregister instances, query services, subscribe to service changes, use local cache, and use failover. |
| Client OpenAPI | For custom HTTP clients that need to register, renew, deregister, or query specific service instances. |
| Admin API | Manage Services, Instances, Clusters, health state, clients, subscribers, and log levels. |
| Console API | Support the service discovery pages in Nacos Console. |
| Maintainer SDK | Run management and diagnostic operations through a Java SDK. |

Business applications usually only need to register themselves, deregister themselves, query known downstream services, or subscribe to known service changes. Service lists, subscriber lists, client diagnostics, and bulk metadata updates are management capabilities.

## Discovery View

The result returned to consumers is not raw storage data. It is a discovery view after filtering and protection. Common factors include:

- Cluster filter.
- `enabled` state.
- `healthy` state.
- Internal server filtering rules.
- Protection threshold.
- Client selector and weight selection.

Therefore, query results may differ from the full instance list shown in the management page. When troubleshooting, first confirm whether you are looking at the runtime discovery view or the management view.

## Recommended Reading

- For registration, heartbeat, deregistration, and ephemeral or persistent instances, read [Instance Lifecycle](./instance-lifecycle.md).
- For health state, weight, protection threshold, and metadata overrides, read [Health, Weight, And Metadata](./health-and-metadata.md).
- For subscription push, cache, failover, and diagnostics, read [Subscription, Push, And Operations](./subscription-and-ops.md).
- For HTTP parameters, read [Client API](../open-api.md) and [Admin API](../../admin/admin-api.md).
