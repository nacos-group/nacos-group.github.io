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

### Publish Operation Messages

:::note[Pending feature]
The operation-message feature described below is proposed in [Nacos PR #15914](https://github.com/alibaba/nacos/pull/15914). Before using it, confirm that your server, console, and Maintainer SDK versions include the change. This page does not imply support in existing releases.
:::

Formal, CAS, and gray/Beta publication can accept an optional `changeMessage` to explain the current operation. It is independent of the configuration description `desc` and is neither configuration content nor a persistent configuration property.

- The limit is 512 Unicode code points, not bytes or Java `String.length()` units.
- Omitted, empty, or whitespace-only input is treated as absent. Other text is preserved, including surrounding whitespace and line breaks.
- Oversized input rejects the publish request. A CAS conflict does not create a history record carrying the attempted message.
- History list, detail, and previous-version queries return the selected record's `changeMessage`. Old records and operations without a message return an absent value.
- An update history record stores the content snapshot from before the change, while its message belongs to the operation that replaced that snapshot. Do not interpret it as the message that originally produced the stored content.
- Rollback publication takes a fresh message rather than copying the target record's message. Rolling back an insert deletes the configuration and has no publish-message input.
- Messages are not sent to configuration listeners or copied by import, export, clone, or metadata-only updates.

No database schema upgrade is needed. Existing callers may omit the field. Upgrade all serving nodes before relying on persistence, because older servers may ignore it. The ordinary Client `ConfigService` has no new message parameter; use [Admin API](../../admin/admin-api.md), [Maintainer SDK](../../admin/maintainer-sdk.md), or the console.

## Query Config

Runtime query needs config identity fields:

| Field | Required | Description |
| --- | --- | --- |
| `dataId` | Yes | Config name. |
| `groupName` | Yes | Config group. |
| `namespaceId` | No | Namespace. Defaults to `public`. |

Parameter and result models vary by entry point. The Java SDK takes the namespace from its instance, and names the group parameter `group`. In 3.3, `getConfig(GetConfigRequest)` returns `ConfigQueryResult`:

| Field | Description |
| --- | --- |
| `content` | Config content. |
| `configType` | Config type. |
| `md5` | Content md5 for change detection. |
| `encryptedDataKey` | May exist when the configuration encryption plugin is used. |

The existing `getConfig(dataId, group, timeoutMs)` still returns the content string. See [Client OpenAPI](../open-api.md) for HTTP parameters and response formats.

If configuration encryption is enabled, applications should still read through normal SDKs or APIs. Do not bypass Nacos and read the database directly.

### Java SDK 3.3 Request Objects

- Query: set `dataId`, `group` and `timeoutMs` in `GetConfigRequest`, then read content and `md5` from the result. Content can be null when the configuration does not exist. Usually omit `localMd5` and let the SDK handle conditional queries and content recovery.
- Publish: `PublishConfigRequest` supports `content`, `type` and optional `casMd5`. To prevent concurrent overwrites, query an existing configuration and publish with its returned `md5`. Do not compute MD5 from decrypted content.
- Delete: set `dataId` and `group` in `RemoveConfigRequest`.

For publication and deletion, check `isSuccess()` and read the error code and message on failure. Also handle possible `NacosException` errors; the absence of an exception does not prove success. See the [Java SDK Usage Guide](../java-sdk/usage.md#3-configuration-management-api) for examples.

Configuration `schema` is management metadata, not runtime configuration content, and is not returned in `ConfigQueryResult`. Maintain it through management entry points.

## Listen For Changes

Listening is for long-running applications. After registration, the SDK receives server change notifications and fetches configuration content. Java `Listener.receiveConfigInfo` already receives the content: parse and apply it without querying again on every callback.

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
- Distinguish ordinary config listeners from fuzzy watch: Listener callbacks carry content, while fuzzy watch reports configuration additions and deletions.
- Use gray release for high-risk config changes.
- Do not run wide list, export, capacity changes, or local cache repair from normal applications.
