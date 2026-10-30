---
title: 参数校验
keywords: [Nacos, 参数校验, 参数规则]
description: 了解 Nacos 服务端参数校验的开关、默认规则和常见错误。
sidebar:
    order: 9
---

# 参数校验

Nacos 会在服务端对部分请求参数做统一格式校验。这个能力用于减少错误参数、特殊字符和异常长度带来的资源异常、推送异常或不可预期行为。

参数校验不替代业务语义校验。比如某个接口要求 `dataId` 必填，仍由对应接口逻辑判断；统一参数校验主要判断“传入的值格式是否合法”。

## 开关

服务端参数校验默认开启：

```properties
nacos.core.param.check.enabled=true
```

关闭后，统一格式校验不会执行，但各业务模块仍可能保留自己的必要校验。生产环境不建议关闭。

默认校验器为 `default`。如果通过扩展方式提供了新的校验器，可以使用：

```properties
nacos.core.param.check.checker=default
```

## 默认规则

下面是当前默认校验器的主要规则。空值通常不会被统一格式校验拦截，但接口本身可能仍要求必填。

| 参数 | 最大长度 | 规则 |
| --- | --- | --- |
| `namespaceShowName` | 256 | 不允许出现 `@#$%^&*`。 |
| `namespaceId` / `tenant` / `namespace` | 64 | 只允许字母、数字、下划线和短横线。 |
| `dataId` | 256 | 只允许字母、数字、`_`、`-`、`.`、`:`。 |
| `serviceName` / `service` | 512 | 不能以 `@` 开头；不能包含中文、空白字符或连续 `@@`。 |
| `group` / `groupName` | 128 | 只允许字母、数字、`_`、`-`、`.`、`:`。 |
| `cluster` / `clusterName` | 64 | 只允许字母、数字、`-`、`_`。多个集群用逗号分隔时，每个集群都按此规则校验。 |
| `ip` | 128 | 不能包含中文或空白字符。 |
| `port` | - | 必须是 `0` 到 `65535` 之间的整数。 |
| 实例 `metadata` | 1024 | 所有 key 和 value 的字符长度总和不能超过上限。 |
| `mcpName` | 128 | 只允许字母、数字、`-`、`_`、`/`、`.`。 |
| `agentName` | 64 | 只允许可打印 ASCII 字符。 |
| `skillName` | 64 | 只允许小写字母、数字和短横线；不能以短横线开头或结尾；不能包含连续 `--`。 |

实例元数据长度上限可以通过以下配置覆盖：

```properties
nacos.naming.service.metadata.length=1024
```

也可以通过环境变量覆盖：

```bash
NACOS_NAMING_SERVICE_METADATA_LENGTH=1024
```

## 常见错误

| 错误信息 | 常见原因 |
| --- | --- |
| `Param 'namespaceShowName' is illegal, the param length should not exceed 256.` | 命名空间名称超过长度上限。 |
| `Param 'namespaceId/tenant' is illegal, illegal characters should not appear in the param.` | 命名空间 ID 包含除字母、数字、下划线、短横线之外的字符。 |
| `Param 'dataId' is illegal, the param length should not exceed 256.` | `dataId` 超过长度上限。 |
| `Param 'group' is illegal, the param length should not exceed 128.` | `group` 超过长度上限。 |
| `Param 'serviceName' is illegal, illegal characters should not appear in the param.` | 服务名包含中文、空白字符、连续 `@@`，或以 `@` 开头。 |
| `Param 'cluster' is illegal, illegal characters should not appear in the param.` | 集群名包含除字母、数字、短横线、下划线之外的字符。 |
| `Param 'ip' is illegal, illegal characters should not appear in the param.` | IP 参数包含中文或空白字符。 |
| `Param 'port' is illegal, the value should be between 0 and 65535.` | 端口不是整数，或超出范围。 |
| `Param 'Metadata' is illegal, the param length should not exceed 1024.` | 实例元数据 key/value 总长度超过上限。 |
| `Skill name must be 1-64 characters` | Skill 名称超过长度上限。 |
| `Skill name may only contain lowercase letters, numbers, and hyphens, and must not start or end with a hyphen` | Skill 名称格式不符合规则。 |
| `Skill name must not contain consecutive hyphens (--)` | Skill 名称包含连续短横线。 |

## 使用建议

- 配置管理场景中，优先使用简短稳定的 `dataId` 和 `group`。
- 服务发现中，不要把环境、版本、地域等复杂信息塞进服务名。更适合放到命名空间、分组、集群或元数据中。
- 元数据适合表达少量键值信息，不适合存放大段 JSON、证书、脚本或配置正文。
- 如果升级后出现参数校验错误，先修正调用方参数。只有在紧急迁移窗口期内，才考虑临时关闭统一参数校验。

## 相关文档

- [配置管理概览](./config/overview.md)
- [服务发现概览](./naming/overview.md)
- [AI 管理中心概述](./ai/ai-registry-overview.md)
- [系统参数](../admin/system-configurations.md)
