---
title: Configuration Overview
keywords: [Configuration Management, Config, Nacos Config]
description: Learn the Nacos configuration model, API boundaries, read path, and recommended usage.
sidebar:
  order: 1
---

# Configuration Overview

Nacos configuration management stores and distributes dynamic configuration for applications. Applications can query configuration from Nacos and listen for changes, so environment differences, switches, and runtime parameters do not need to be hard-coded.

Configuration management owns the lifecycle of config resources: publish, query, listen, gray release, history, rollback, import, export, clone, and capacity control. It is not a document store, object storage service, secret lifecycle system, or service discovery model.

## Resource Model

A config item is identified by three fields:

```text
namespaceId -> groupName -> dataId
```

| Field | Description |
| --- | --- |
| `namespaceId` | Namespace, usually used to isolate environments, tenants, or business domains. The default namespace is `public`. |
| `groupName` | Config group, usually used for applications, modules, or business groups. |
| `dataId` | Config name. It is the main resource name of the config item. |

Config content is handled as a whole. Nacos stores and distributes `content`, but it does not understand individual business fields inside the file. `type` only describes the content type, such as `TEXT`, `JSON`, or `YAML`.

## Runtime And Management Surfaces

Nacos 3.x separates runtime usage from management usage more clearly.

| Surface | Audience | Typical use |
| --- | --- | --- |
| Client SDK | Applications | Query known configs, listen for changes, and read local snapshots. |
| Client OpenAPI | Clients that cannot use gRPC SDKs | Query one known config item. |
| Admin API | Operation platforms, release platforms, automation tools | Publish, delete, list, search, gray release, history, capacity, and diagnostics. |
| Console API | Nacos Console | Support console configuration workflows. |
| Maintainer SDK | Operation programs | Run management operations through a Java SDK. |

Business applications should usually read and listen to the configs they need. Large list queries, search, batch import, capacity changes, and local cache repair are management operations. Use the console, Admin API, or Maintainer SDK for them.

## Read Path

Config content is persisted. Runtime queries are usually served from server-side local cache and dump files, so high-frequency reads do not directly hit the database.

After a write succeeds, Nacos publishes a config change event. Each node reloads the affected config from the persistence layer and refreshes local cache and dump files.

This means:

- The persistence layer is the authoritative data source.
- Local dump is a server-side cache, not a new source of truth.
- After receiving a change push, clients should query the config again.
- After one node writes a config, other nodes may need to wait for local dump completion before their runtime view is updated.

## md5 And Change Detection

Nacos uses `md5` as the content version. A client listener compares the local md5 with the server state. After publish, delete, or gray changes, the client receives a notification and then queries the content again.

Do not treat a change notification as the full config content. It only means that the config may have changed.

## Recommended Reading

- For query, publish, and listen behavior, read [Publish, Query, And Listen](./publish-query-listen.md).
- For small-scope verification, read [Configuration Gray Release](./gray-release.md).
- For cache, capacity, history, import/export, and troubleshooting, read [Operations And Troubleshooting](./ops-and-troubleshooting.md).
- For HTTP parameters, read [Client API](../open-api.md) and [Admin API](../../admin/admin-api.md).
