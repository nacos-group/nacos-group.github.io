---
title: Configuration Gray Release
keywords: [Config Gray Release, Beta, Tag, grayName]
description: Learn the Nacos configuration gray release model, matching rules, release flow, and precautions.
sidebar:
  order: 3
---

# Configuration Gray Release

Configuration gray release publishes one or more gray versions for the same config resource, in addition to the formal version. It is useful when you want a small group of clients to read new content before promoting it to the formal config.

A gray version is not a new top-level config resource. It belongs to the same config identity:

```text
namespaceId -> groupName -> dataId -> grayName
```

The formal config and gray versions share `namespaceId`, `groupName`, and `dataId`, but they can have different content, md5, encrypted data key, and gray rule.

## Built-in Gray Rules

Nacos currently provides two common rules:

| Rule | `grayName` | Match | Priority |
| --- | --- | --- | --- |
| Beta | `beta` | `ClientIp` matches the beta IP list. | High |
| Tag | `tag_{tag}` | Request tag matches the configured tag. | Next |

One config can have multiple gray versions. Runtime query evaluates gray rules first and then falls back to the formal config.

By default, a config can have up to `10` gray versions. You can adjust this with `nacos.config.gray.version.max.count`.

## Upgrade Compatibility

Current beta and tag gray release behavior is backed by `config_info_gray` and `GrayRule`. Starting with Nacos 3.3, Nacos no longer automatically migrates legacy `config_info_beta` and `config_info_tag` tables from versions before 3.0 into `config_info_gray`.

If you upgrade from a version before 3.0 to 3.3 and the old deployment used beta gray release, migrate the legacy beta/tag gray data to the current `config_info_gray` gray model before upgrading. If the old deployment did not use beta gray release, this compatibility removal does not affect smooth upgrade for this gray compatibility area.

This change does not remove current beta/tag gray APIs. Publishing, querying, and stopping gray release with `betaIps` or `tag` still work through the current gray model.

## Query Behavior

Gray query follows these rules:

- Normal query first tries to match gray rules. If matched, it returns gray content.
- If no gray rule matches, it returns the formal config.
- If a request explicitly specifies a tag but no matching tag gray version exists, Nacos returns a tag-specific not-found result.
- Admin formal query should not silently return gray content.
- Admin beta query returns the beta version when it exists.

When validating gray release, confirm that the client sends the expected IP or tag. Do not judge gray effectiveness only from the formal config detail page.

## Recommended Flow

A safe gray release flow is:

```text
publish formal config
  -> publish gray version
  -> let selected clients read gray content
  -> observe logs, metrics, and business result
  -> promote to formal config, or stop gray release
```

Include both gray and formal publish actions in audit records. Gray publish also triggers config change events, so related clients may receive notifications and query again.

## Encryption And History

Gray config can be affected by the configuration encryption plugin in the same way as formal config. The server stores gray content and its encrypted data key separately.

Gray publish and delete are also recorded in history. History records contain the publish type, `grayName`, and extension information for troubleshooting.

## Precautions

- Gray content is still a version state of the same config resource. Do not use it to represent another independent config.
- Control the number of gray versions and stop unused gray versions in time.
- Before gray release, confirm that clients can send the expected IP or tag.
- After validation, explicitly promote to formal config or stop gray release.
- In a cluster, different nodes may need a short time to finish local dump before they show the same gray view.
