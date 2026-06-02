---
title: Publish, Query, And Listen
keywords: [Config Publish, Config Query, Config Listen, md5]
description: Learn the key behavior of Nacos config publish, query, listen, and local recovery.
sidebar:
  order: 2
---

# Publish, Query, And Listen

The most common configuration actions are publish, query, and listen. Publish changes server-side config state. Query reads current content. Listen lets clients refresh after a change.

## Publish Config

Publishing writes the config resource identified by `namespaceId + groupName + dataId`. After the write succeeds, Nacos records the change and notifies related nodes to refresh local cache.

Choose the entry point by role:

| Scenario | Recommended entry point |
| --- | --- |
| Operation or release platform publishes config | Console, Admin API, Maintainer SDK |
| Automation imports config in batches | Admin API, Maintainer SDK |
| Business application reads config | Client SDK, Client OpenAPI |

Business applications should not usually be responsible for publishing config. This reduces the risk of accidental publish, permission misuse, and batch operation mistakes.

## Query Config

Runtime query needs config identity fields:

| Field | Required | Description |
| --- | --- | --- |
| `dataId` | Yes | Config name. |
| `groupName` | Yes | Config group. |
| `namespaceId` | No | Namespace. Defaults to `public`. |

The response usually contains:

| Field | Description |
| --- | --- |
| `content` | Config content. |
| `contentType` | Config type. |
| `md5` | Content md5 for change detection. |
| `encryptedDataKey` | May exist when the configuration encryption plugin is used. |
| `lastModified` | Last modified time. |

If configuration encryption is enabled, applications should still read through normal SDKs or APIs. Do not bypass Nacos and read the database directly.

## Listen For Changes

Listening is for long-running applications. A client registers a listener, and the server pushes a change notification when the config changes. The client then queries the content again.

This design has two benefits:

- Push messages are lightweight and only carry the changed identity.
- The final content still comes from the normal query path.

Nacos 3.x Client OpenAPI does not provide HTTP long-polling config listen. Use the long connection support in official SDKs when listening is required.

## Fuzzy Watch

Fuzzy watch is used to detect config resource additions and deletions by pattern. It is more suitable for platform clients and governance tools. Business applications usually only need to listen to a specific `dataId + groupName + namespaceId`.

Fuzzy watch still follows config identity and auth rules. Do not use it as a way to bypass management APIs for full config scanning.

## Local Snapshot And Failover

Clients maintain local recovery data. Different data has different meaning:

| Type | Purpose | Authoritative |
| --- | --- | --- |
| Config snapshot | Last known content from successful server queries. Used as fallback during network errors. | No |
| Config failover file | User-maintained local override for emergency fallback. | Highest local priority, but it is not written back to the server |
| listener state | Client listen intent. Used to recover subscriptions after reconnect. | No |

When a failover file exists, the client may read local override content first. When troubleshooting config mismatch, check server config, client snapshot, and local failover files together.

## Recommendations

- Review production config before publishing it through the console or release platform.
- Client listener callbacks should handle callback failure, duplicate notifications, and parse errors.
- Do not treat change push as config content. Query again after receiving a notification.
- Use gray release for high-risk config changes.
- Do not run wide list, export, capacity changes, or local cache repair from normal applications.
