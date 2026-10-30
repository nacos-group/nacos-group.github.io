---
title: Parameter Validation
keywords: [Nacos, Parameter Validation, Parameter Rules]
description: Learn the Nacos server-side parameter validation switch, default rules, and common errors.
sidebar:
    order: 9
---

# Parameter Validation

Nacos validates some request parameters on the server side. This reduces unexpected behavior caused by invalid characters, abnormal length, or malformed resource names.

Parameter validation does not replace business semantic validation. For example, if an API requires `dataId`, the API logic still checks that requirement. The unified validator mainly checks whether a provided value has a valid format.

## Switch

Server-side parameter validation is enabled by default:

```properties
nacos.core.param.check.enabled=true
```

When it is disabled, unified format validation is skipped, but each business module may still keep its required checks. Disabling it in production is not recommended.

The default checker is `default`. If you provide another checker through extension, configure:

```properties
nacos.core.param.check.checker=default
```

## Default rules

The following table lists the main rules of the current default checker. Empty values are usually not blocked by the unified format validator, but an API may still require them.

| Parameter | Max length | Rule |
| --- | --- | --- |
| `namespaceShowName` | 256 | Must not contain `@#$%^&*`. |
| `namespaceId` / `tenant` / `namespace` | 64 | Allows letters, digits, underscores, and hyphens. |
| `dataId` | 256 | Allows letters, digits, `_`, `-`, `.`, and `:`. |
| `serviceName` / `service` | 512 | Must not start with `@`; must not contain Chinese characters, whitespace, or consecutive `@@`. |
| `group` / `groupName` | 128 | Allows letters, digits, `_`, `-`, `.`, and `:`. |
| `cluster` / `clusterName` | 64 | Allows letters, digits, `-`, and `_`. When multiple clusters are separated by commas, each cluster is validated with this rule. |
| `ip` | 128 | Must not contain Chinese characters or whitespace. |
| `port` | - | Must be an integer between `0` and `65535`. |
| Instance `metadata` | 1024 | Total character length of all keys and values must not exceed the limit. |
| `mcpName` | 128 | Allows letters, digits, `-`, `_`, `/`, and `.`. |
| `agentName` | 64 | Allows printable ASCII characters. |
| `skillName` | 64 | Allows lowercase letters, digits, and hyphens; must not start or end with a hyphen; must not contain consecutive `--`. |

The metadata length limit can be overridden with:

```properties
nacos.naming.service.metadata.length=1024
```

It can also be overridden with an environment variable:

```bash
NACOS_NAMING_SERVICE_METADATA_LENGTH=1024
```

## Common errors

| Error message | Common cause |
| --- | --- |
| `Param 'namespaceShowName' is illegal, the param length should not exceed 256.` | The namespace display name exceeds the length limit. |
| `Param 'namespaceId/tenant' is illegal, illegal characters should not appear in the param.` | The namespace ID contains characters other than letters, digits, underscores, or hyphens. |
| `Param 'dataId' is illegal, the param length should not exceed 256.` | `dataId` exceeds the length limit. |
| `Param 'group' is illegal, the param length should not exceed 128.` | `group` exceeds the length limit. |
| `Param 'serviceName' is illegal, illegal characters should not appear in the param.` | The service name contains Chinese characters, whitespace, consecutive `@@`, or starts with `@`. |
| `Param 'cluster' is illegal, illegal characters should not appear in the param.` | The cluster name contains characters other than letters, digits, hyphens, or underscores. |
| `Param 'ip' is illegal, illegal characters should not appear in the param.` | The IP parameter contains Chinese characters or whitespace. |
| `Param 'port' is illegal, the value should be between 0 and 65535.` | The port is not an integer or is out of range. |
| `Param 'Metadata' is illegal, the param length should not exceed 1024.` | The total length of metadata keys and values exceeds the limit. |
| `Skill name must be 1-64 characters` | The Skill name exceeds the length limit. |
| `Skill name may only contain lowercase letters, numbers, and hyphens, and must not start or end with a hyphen` | The Skill name format is invalid. |
| `Skill name must not contain consecutive hyphens (--)` | The Skill name contains consecutive hyphens. |

## Suggestions

- In configuration management, use short and stable `dataId` and `group` values.
- In service discovery, do not put environment, version, region, or other complex information into the service name. Namespace, group, cluster, or metadata is usually more suitable.
- Metadata is suitable for a small number of key-value pairs. Do not use it to store large JSON payloads, certificates, scripts, or configuration content.
- If validation errors appear after an upgrade, fix caller parameters first. Temporarily disabling unified validation should be limited to an emergency migration window.

## Related documents

- [Configuration Overview](./config/overview.md)
- [Service Discovery Overview](./naming/overview.md)
- [AI Registry Overview](./ai/ai-registry-overview.md)
- [System Configurations](../admin/system-configurations.md)
