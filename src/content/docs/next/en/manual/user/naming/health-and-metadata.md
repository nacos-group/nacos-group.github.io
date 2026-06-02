---
title: Health, Weight, And Metadata
keywords: [Health Check, Weight, Protection Threshold, Metadata, enabled]
description: Learn health state, enabled, weight, protection threshold, and metadata priority in Nacos service discovery.
sidebar:
  order: 3
---

# Health, Weight, And Metadata

Service discovery results are affected by health state, `enabled`, weight, protection threshold, and metadata. Understanding these fields helps avoid confusing "the instance exists" with "the instance will be discovered by consumers".

## healthy And enabled

`healthy` means whether the instance is currently considered available by Nacos health logic. It may come from ephemeral instance heartbeat, active health checks for persistent instances, manual health updates, or synchronization between nodes.

`enabled` means whether the instance is allowed to receive discovery traffic. Disabled instances should not be returned to runtime OpenAPI consumers, and they are also filtered by Java SDK selection.

| Field | Focus | Usually changed by |
| --- | --- | --- |
| `healthy` | Whether the instance is healthy. | Heartbeat, health checker, responsible node synchronization, or manual update in specific scenarios. |
| `enabled` | Whether the instance can be selected by consumers. | Operators, console, Admin API, or Maintainer SDK. |

If an instance exists but does not appear in consumer query results, check `enabled`, `healthy`, cluster filter, and protection threshold first.

## Ephemeral Service Health

Ephemeral service instances are driven by client liveness.

HTTP or compatible clients renew instances by heartbeat. Reserved metadata keys can tune heartbeat behavior:

| Key | Meaning |
| --- | --- |
| `preserved.heart.beat.interval` | Expected heartbeat interval. |
| `preserved.heart.beat.timeout` | Timeout before the instance is marked unhealthy. |
| `preserved.ip.delete.timeout` | Timeout before the instance can be deleted. |

gRPC SDK clients keep ephemeral instances alive through the connection lifecycle. The Naming module cleans runtime state through connection close and release events. Applications do not need to implement an extra gRPC heartbeat for this.

## Persistent Service Health

Persistent service instances are maintained by server-side active health checks. Cluster metadata decides the health checker type and port behavior.

Built-in active check types include:

- TCP
- HTTP
- MySQL
- NONE

Manual health updates are allowed only when the cluster health checker is `NONE`. If an active health checker is configured, the checker should own the health state.

## Weight

`weight` is an instance-level value used by client-side weighted selection. Runtime selection usually ignores instances whose weight is less than or equal to `0`.

Nacos stores and returns weight, but it does not guarantee that every consumer load balances by weight. The final selection behavior depends on the client or upper framework.

## Protection Threshold

The Service `protectThreshold` prevents discovery results from shrinking to too few healthy instances.

When the healthy ratio is less than or equal to the protection threshold, the server enters a protected view, returns a wider instance set, and marks unhealthy instances as healthy in that protected view.

Protection threshold is an availability protection mechanism. It does not mean the underlying instances are truly healthy. When protection takes effect, investigate why the number of truly healthy instances dropped.

## Metadata Priority

Naming has two sources of instance metadata:

| Source | Meaning | Priority |
| --- | --- | --- |
| Runtime metadata | Metadata submitted when the application registers or renews an instance. | Lower |
| Operational metadata | Metadata written through console, Admin API, Maintainer SDK, or similar management paths. | Higher |

When the same key exists in both runtime metadata and operational metadata, the external discovery view uses operational metadata. Operational metadata represents an explicit management override.

## Selector Boundaries

Naming has several selector-like concepts:

- Internal server filtering: cluster, enabled, healthy, protection threshold, and similar rules.
- Service selector in legacy APIs: a compatibility field. Do not build new behavior on it.
- SDK client selector: local listener or selection filtering. It does not change server state.

If you need new server-side filtering or governance, use explicit APIs and plugin boundaries. Do not rely on legacy selector fields to express new semantics.
