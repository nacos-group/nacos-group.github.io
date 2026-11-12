---
title: Compatibility And Deprecation
keywords: [Nacos, Compatibility, Deprecation, Migration, Legacy]
description: Understand Nacos compatibility capabilities, deprecated capabilities, and migration entry points.
sidebar:
    order: 8
---

# Compatibility And Deprecation

As Nacos evolves, some compatibility capabilities remain available to help users upgrade and migrate. They are not the recommended model for new usage. New integrations and new development should prefer the canonical capabilities described in the current documentation.

## How to read status

| Status | Meaning | User guidance |
| --- | --- | --- |
| Canonical | The currently recommended API, SDK, configuration, or resource model. | Use it for new systems. |
| Compatibility-only | Retained to avoid breaking existing users. | Use only during migration. Do not expand reliance on it. |
| Deprecated | Still available, but may be removed later. | Migrate to the replacement as soon as possible. |
| Pending removal | Deprecated, with a known removal direction or condition. | Make a migration plan. Do not use it for new rollouts. |
| Experimental | Not promised as stable behavior yet. | Validate in a small scope and accept possible incompatible changes. |

## Common compatibility entry points

| Scenario | Current guidance | Continue reading |
| --- | --- | --- |
| v1/v2 HTTP APIs | Migrate to v3 OpenAPI or current SDKs. If a migration window is required, use the legacy adapter temporarily. | [Upgrading Manual](./upgrading.mdx), [OpenAPI Overview](../user/overview/api-overview.md) |
| Compatibility switches | Enable them only during upgrade or migration windows. Disable them after the system becomes stable. | [System Configurations](./system-configurations.md) |
| Beta/Tag gray release compatibility | Enable compatibility and migration configuration during upgrade, then use the new gray model after stabilization. | [Upgrading Manual](./upgrading.mdx), [System Configurations](./system-configurations.md) |
| Default namespace migration | Pay attention to migration from empty namespace to `public`. | [Upgrading Manual](./upgrading.mdx), [Java SDK Usage](../user/java-sdk/usage.md#13-upgrade-compatibility) |
| Legacy console | Use only for compatibility with existing habits. New deployments should use the new console. | [Console Manual](./console.md#legacy-console) |
| Deprecated Java SDK properties | Do not use them in new systems. | [Java SDK Properties](../user/java-sdk/properties.md) |
| Deprecated CLI commands | Use explicit lifecycle commands instead of shortcut publish commands. | [Nacos CLI User Guide](./nacos-cli.md) |
| Experimental features | Use only when you accept the change risk. | [Experimental Features Overview](../../experimental/overview.md) |

## What to confirm before using compatibility capabilities

- Whether the capability is only for temporary upgrade or migration use.
- Whether there is a replacement API, SDK, configuration, or resource model.
- Whether it changes authentication, visibility, response shape, performance, or data consistency.
- Whether it requires an extra plugin, adapter, or standalone component.
- How to disable the compatibility switch or remove the compatibility component after migration.

## Not recommended

- Depending on old APIs or deprecated SDK methods in new business.
- Treating compatibility fields as new resource semantics.
- Keeping short-term compatibility switches enabled for a long time without migration.
- Using Console API as a long-term stable automation interface.
- Treating experimental features as stable production capabilities.

## Related documents

- [Upgrading Manual](./upgrading.mdx)
- [System Configurations](./system-configurations.md)
- [OpenAPI Overview](../user/overview/api-overview.md)
- [Console Manual](./console.md)
- [Experimental Features Overview](../../experimental/overview.md)
