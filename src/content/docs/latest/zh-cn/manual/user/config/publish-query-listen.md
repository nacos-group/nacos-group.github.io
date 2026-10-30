---
title: 发布、查询与监听
keywords: [配置发布, 配置查询, 配置监听, md5]
description: 了解 Nacos 配置发布、查询、监听和客户端本地恢复的关键行为。
sidebar:
  order: 2
---

# 发布、查询与监听

配置管理最常见的三类动作是发布、查询和监听。发布改变服务端的配置状态，查询读取当前配置内容，监听让客户端在配置变化后及时刷新。

## 发布配置

发布配置会写入由 `namespaceId + groupName + dataId` 标识的配置资源。发布成功后，Nacos 会记录变更事实，并通知相关节点刷新本地缓存。

建议按角色选择入口：

| 场景 | 推荐入口 |
| --- | --- |
| 运维或发布平台发布配置 | 控制台、Admin API、Maintainer SDK |
| 自动化批量导入配置 | Admin API、Maintainer SDK |
| 普通业务应用读取配置 | Client SDK、Client OpenAPI |

普通业务应用不建议承担配置发布职责。这样可以降低误发布、越权发布和批量操作带来的风险。

## 查询配置

运行时查询需要带上配置身份字段：

| 字段 | 是否必填 | 说明 |
| --- | --- | --- |
| `dataId` | 是 | 配置名。 |
| `groupName` | 是 | 配置分组。 |
| `namespaceId` | 否 | 命名空间，默认 `public`。 |

各入口的参数和结果模型不同。Java SDK 将命名空间设在实例中，配置分组参数名为 `group`。3.3 的 `getConfig(GetConfigRequest)` 返回 `ConfigQueryResult`：

| 字段 | 说明 |
| --- | --- |
| `content` | 配置内容。 |
| `configType` | 配置类型。 |
| `md5` | 内容 md5，用于变更判断。 |
| `encryptedDataKey` | 使用配置加密插件时可能存在。 |

原有 `getConfig(dataId, group, timeoutMs)` 仍返回配置正文字符串。HTTP 接口的字段和返回格式见 [Client OpenAPI](../open-api.md)。

如果配置使用了配置加密插件，应用侧仍应通过正常 SDK 或 API 读取，不要绕过 Nacos 直接读数据库。

### Java SDK 3.3 请求对象

- 查询：`GetConfigRequest` 指定 `dataId`、`group` 和 `timeoutMs`，从结果读取正文及 `md5`。配置不存在时正文可为空。通常无需填写 `localMd5`，由 SDK 处理条件查询和内容恢复。
- 发布：`PublishConfigRequest` 支持 `content`、`type` 和可选 `casMd5`。需要防止并发覆盖时，先查询已有配置，再使用返回的 `md5` 进行 CAS 发布；不要对解密后的正文自行计算 MD5。
- 删除：`RemoveConfigRequest` 指定 `dataId` 和 `group`。

发布、删除都要检查结果的 `isSuccess()`，失败时读取错误码和错误信息，并处理可能抛出的 `NacosException`。不能只因没有异常就认为操作成功。示例见 [Java SDK 使用手册](../java-sdk/usage.md#3-配置管理-api)。

配置 `schema` 属于管理元数据，不是应用运行时配置正文，也不在 `ConfigQueryResult` 中返回；需要维护它时使用管理端入口。

## 监听配置

监听适合应用长期运行时使用。客户端注册监听后，SDK 负责接收服务端变更通知并获取配置内容。Java `Listener.receiveConfigInfo` 回调收到的已经是配置正文，应用直接解析和应用该内容即可，无需为每次回调再次查询。

Nacos 3.x 的 HTTP Client OpenAPI 不提供配置长轮询监听。需要监听时，优先使用官方 SDK 的长连接能力。

## 模糊订阅

模糊订阅用于按模式感知配置资源的新增和删除。它更适合平台型客户端或治理工具。普通业务应用通常只需要监听明确的 `dataId + groupName + namespaceId`。

使用模糊订阅时，仍要遵守配置资源身份和鉴权规则。不要把它当成绕过管理 API 的全量配置扫描能力。

## 本地快照和 Failover

客户端会维护本地恢复数据。不同数据的含义不同：

| 类型 | 作用 | 是否权威 |
| --- | --- | --- |
| Config snapshot | 服务端查询成功后的最后已知内容，用于网络异常时恢复读取。 | 否 |
| Config failover file | 用户维护的本地覆盖文件，用于紧急兜底。 | 本地最高优先级，但不会写回服务端 |
| listener state | 客户端监听意图，用于重连后恢复订阅。 | 否 |

当 failover 文件存在时，客户端可能优先读取本地覆盖内容。排查配置不生效时，要同时检查服务端配置、客户端 snapshot 和本地 failover 文件。

## 常见建议

- 生产配置发布前先评审，再通过控制台或发布平台操作。
- 应用侧监听配置后，要能处理回调失败、重复通知和配置解析失败。
- 区分普通配置监听与模糊订阅：普通 Listener 回调携带正文，模糊订阅只通知配置新增、删除。
- 对高风险配置，优先使用灰度发布验证。
- 大范围列表、导出、容量调整和本地缓存修复不要放在普通应用中执行。
