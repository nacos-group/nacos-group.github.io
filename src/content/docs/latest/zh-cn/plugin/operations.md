---
title: 插件运维与配置
keywords: [插件管理, PluginConfigSpec, plugin-configs.json, 运行时配置, Console]
description: 说明 Nacos 插件状态、配置来源、敏感值、运行时更新、持久化、控制台和排障方法。
sidebar:
    order: 2
---

# 插件运维与配置

本文面向 Nacos 运维人员和平台管理员，说明如何读取插件清单、区分模块开关与插件状态，以及如何安全地更新实现配置。

## 清单和详情

新控制台的“平台管理 → 插件管理”按 `pluginType` 展示已加载插件。对应 Admin API 为：

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| `GET` | `/v3/admin/core/plugin/list` | 列出已加载插件，可按 `pluginType` 过滤。 |
| `GET` | `/v3/admin/core/plugin/detail` | 查询一个插件的状态、definition、有效配置和值元数据。 |
| `PUT` | `/v3/admin/core/plugin/status` | 更新实现状态。 |
| `PUT` | `/v3/admin/core/plugin/config` | 替换一个配置来源的完整 override map。 |

Console API 提供等价代理路径 `/v3/console/plugin/*`。详细参数见 [Admin API](../manual/admin/admin-api.md) 和 [Console API](../manual/admin/console-api.md)。

列表和详情中的关键字段：

| 字段 | 含义 |
| --- | --- |
| `pluginId` | `{pluginType}:{pluginName}`。 |
| `enabled` | 当前节点上实现是否允许参与领域执行。 |
| `executionMode` | `EXCLUSIVE`、`CHAIN`、`ROUTED` 或 `BROADCAST`。 |
| `exclusive` | 为兼容保留，等价于 `executionMode=EXCLUSIVE`。 |
| `typeCritical` | 该插件类型是否可能成为 critical。 |
| `critical` | 当前状态下这个具体实现是否不能单独禁用。 |
| `configurable` | 是否声明了至少一个有效 `ConfigItemDefinition`。 |
| `config` | 已接受并实际生效的 item-key 配置快照；敏感值已脱敏。 |
| `configDefinitions` | 配置定义，包括 alias、类型、默认值、必填、敏感和 effect mode。 |
| `configValueMetas` | 每个 canonical item key 的 `source` 与 `overridden`。 |

## 配置 definition

`ConfigItemDefinition.key` 是实现内的 item key，不带完整前缀。静态配置使用：

```text
nacos.plugin.{pluginType}.{pluginName}.{itemKey}
```

| 元数据 | 运维含义 |
| --- | --- |
| `aliases` | 历史静态 key。读取或 API 输入时可兼容，但会记录迁移 WARN；持久化只保存 canonical item key。 |
| `type` | `STRING`、`NUMBER`、`BOOLEAN` 或 `ENUM`。 |
| `defaultValue` | 没有更高优先级来源时使用。 |
| `required` | 最终值必须存在。 |
| `sensitive` | 详情响应脱敏，日志不得输出值。 |
| `effectMode` | `RUNTIME` 可运行时更新；`RESTART` 只能通过静态配置并重启生效。 |

解析 `PluginConfigSpec` 配置项的 STATIC 来源时，normalized 标准完整 key 只要存在就具有优先级，即使值为空字符串也不回退 alias。只有标准 key 不存在时才检查 alias；同时存在多个 alias 时，按 definition 中的声明顺序取第一个，其余 alias 被忽略并记录 WARN。

definition 归一化采用 first-wins。空 key、保留 key `enabled`、重复 key，以及与先前 key/alias 冲突的后来 definition 或 alias 都会被忽略并记录 WARN。

## 配置来源和优先级

对 `STANDARD` 插件，有效值按以下顺序解析：

```text
LOCAL_ONLY > RUNTIME_PERSISTED > STATIC > DEFAULT
```

| source | 含义 | 是否持久化/同步 |
| --- | --- | --- |
| `DEFAULT` | definition 默认值。 | 否 |
| `STATIC` | `application.properties`、环境变量、JVM 或 Spring 参数。 | 由部署系统管理 |
| `RUNTIME_PERSISTED` | 集群运行时 override。 | 是，进入插件配置持久化和集群同步 |
| `LOCAL_ONLY` | 当前节点诊断或应急 override。 | 否 |

`configValueMetas.source` 是当前有效值的来源。`overridden=true` 表示同一个 key 同时存在多个非默认来源；它不把 `DEFAULT` 计入覆盖判断。

运行时持久化配置的落盘文件是 `${nacos.home}/data/plugin/plugin-configs.json`。该文件由 Nacos 管理，不要手工编辑。它只保存 `pluginId + itemKey + value`，不保存 alias、完整静态 key、source 或版本。插件 enabled 状态由独立的统一状态路径管理，不写入这个配置文件。

## 更新语义

`PUT .../plugin/config` 的 `config` 是目标来源的**完整 map**，不是 patch：

- `localOnly=false` 替换 `RUNTIME_PERSISTED` 的完整 map。
- `localOnly=true` 替换当前节点 `LOCAL_ONLY` 的完整 map。
- 提交空 map 会清除该来源对这个插件的全部 override。
- 省略某个现有 key 表示移除它；只有 `RUNTIME` 字段允许在运行时增加、修改或移除。
- canonical item key、完整标准 key 和唯一匹配的 alias 都会先归一化成 item key。未声明或歧义 key 会返回参数校验错误。

例如，只对当前节点覆盖默认鉴权 token 过期时间：

```shell
curl -X PUT 'http://127.0.0.1:8848/nacos/v3/admin/core/plugin/config' \
  -d 'pluginType=auth' \
  -d 'pluginName=nacos' \
  -d 'config={"token.expire.seconds":"3600"}' \
  -d 'localOnly=true'
```

同一个插件的更新会串行执行。持久化更新遵循“先持久化来源，再解析/校验，再 apply”。如果持久化失败，内存来源和插件都不改变；如果持久化成功但 `applyConfig` 失败，新来源仍被保留，API 返回明确错误。修复插件后可以重新提交同一个完整 map 触发人工重试。

## `RUNTIME` 与 `RESTART`

启动 apply 可以接收两种字段。运行时 PUT 只能改变 `RUNTIME` 字段；对 `RESTART` 字段的增加、修改或删除都会被拒绝。

服务端静态配置刷新也会遵守相同边界：

- `RUNTIME` 静态值变化会重新解析并按需调用 `applyConfig`。
- `RESTART` 静态值变化只记录 WARN，当前进程继续使用启动时已接受的快照。
- 详情返回已生效快照，不把尚未重启生效的新静态值误报为 effective。

要修改 `RESTART` 字段，请更新所有节点的静态配置并按计划滚动重启。

## 敏感值

敏感字段在详情中使用包含 `******` 的脱敏值。提交更新时，任何包含标准 marker 的值（包括前后保留部分的形式）都表示“保留目标来源原值”：

- 如果目标来源已有该 key，Nacos 保留同一来源中的原值。
- 如果目标来源没有该 key，输入被忽略，不会把 `STATIC` 等其他来源的有效值复制成 runtime override。

因此控制台编辑敏感值时可以原样提交脱敏展示值而不覆盖秘密。需要真的变更秘密时，提交不含 masked marker 的新值。日志只记录 `pluginId`、item key 和目标 source，不能记录秘密。

## 状态更新和 critical 校验

状态 API 支持集群持久化更新和 `localOnly=true` 的当前节点更新，但不是所有类型都能运行时切换：

- `EXCLUSIVE` 类型由静态 `type` key 在启动时选择，状态 API 不用于切换实现。
- active critical 类型必须保留策略要求的 enabled provider；违反要求的更新会在持久化和应用前被拒绝。
- `environment` 是启动前插件，运行时状态更新被拒绝。
- `control` 的 manager bundle 在启动阶段构建，当前也拒绝运行时选择变更。

模块开关不会被状态 API 修改。例如关闭 `nacos.plugin.visibility.enabled` 会阻止可见性流程执行，即使 `visibility:nacos` 仍显示 loaded 和 enabled。

## 新控制台行为

Next Console 的插件详情以 detail API 为唯一事实源：

- `RUNTIME` definition 可编辑；`RESTART` definition 只读，并提示修改静态配置后重启。
- 显示每个值的 effective source 和 overridden 状态。
- 将“集群运行时持久化”和“仅当前节点”作为两个明确模式。
- 构造提交 map 时只保留属于目标 source 的 override，不会把 `STATIC`/`DEFAULT` 有效值复制进去。
- 当前节点存在 `LOCAL_ONLY` override 时，控制台会阻止集群配置提交，避免覆盖被隐藏的较低优先级 persisted 值。先清空本地 override，再编辑集群配置。

本文只描述 Next Console；Legacy Console 不提供这套统一配置编辑工作流。

## 启动和排障检查

1. 确保集群所有节点使用同版本插件 JAR 和依赖。
2. 检查 plugin list 中目标 `pluginId` 是否在所有节点可用。
3. 区分模块总开关、exclusive 选择 key、实现状态和实现配置。
4. 查看详情中的 `source`，确认期望值是否被 `LOCAL_ONLY` 或 `RUNTIME_PERSISTED` 覆盖。
5. 对 `RESTART` 配置确认节点已经重启。
6. 出现重复 ID、definition key 或 alias WARN 时，移除冲突实现/定义，不要依赖 SPI 扫描顺序。
