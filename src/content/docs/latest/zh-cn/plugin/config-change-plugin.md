---
title: 配置变更
keywords: [配置变更, 配置审计, 配置格式校验, webhook]
description: 本文介绍 Nacos 配置变更插件的用途、执行模型、启用方式和自定义开发方式。
sidebar:
    order: 9
---

# 配置变更插件

配置变更插件用于在配置发布、修改、删除、导入等操作前后织入自定义逻辑。它适合做配置治理，而不是替代 Nacos 的配置存储模型。

在统一插件管理中，本插件类型为 `config-change`，执行模式为 `CHAIN`，加载阶段为 `STANDARD`，类型非 critical。插件身份是 `config-change:{getServiceType()}`。Nacos Server 仓库只定义 SPI 和执行切面，不内置 `webhook`、`whitelist` 或 `fileformatcheck` 等生产实现；这些示例只有在外部插件 JAR 加入 classpath 后才存在。

常见场景包括：

- **变更前校验**：检查配置格式、命名规范、大小、内容风险或导入文件后缀。
- **变更前拦截**：发现不符合规则的配置时，阻止本次变更并返回失败信息。
- **变更后审计**：把配置变更记录写入审计系统。
- **变更后通知**：通过 Webhook 或消息系统通知下游平台。

## 工作模型

配置变更插件采用类似 AOP 的模型。Nacos 把配置变更操作抽象为 pointcut，插件可以选择在 pointcut 之前或之后执行。

| 概念 | 说明 |
|-----|------|
| Pointcut | 配置变更点，按操作和来源分类。 |
| Before 插件 | 在配置变更前同步执行，可校验、拦截或改写参数。 |
| After 插件 | 在配置变更完成后异步执行，适合审计、通知等尽力而为操作。 |
| 执行顺序 | 同一 pointcut 下，按 `getOrder()` 升序执行，值越小越早执行。 |

当前 SPI 定义的 pointcut 如下：

| Pointcut | 含义 |
|----------|------|
| `PUBLISH_BY_HTTP` | 通过 HTTP 或控制台创建、更新配置。 |
| `PUBLISH_BY_RPC` | 通过 gRPC 创建、更新配置。 |
| `PUBLISH_BY_UNKNOWN` | 来源无法识别的创建、更新配置。 |
| `REMOVE_BY_HTTP` | 通过 HTTP 或控制台删除单个配置。 |
| `REMOVE_BY_RPC` | 通过 gRPC 删除单个配置。 |
| `REMOVE_BY_UNKNOWN` | 来源无法识别的删除单个配置。 |
| `IMPORT_BY_HTTP` | 通过 HTTP 或控制台导入配置文件。 |
| `REMOVE_BATCH_HTTP` | 通过 HTTP 或控制台批量删除配置。 |

:::note
Before 插件会影响配置变更主链路。请避免在 Before 插件中调用慢接口或不可控外部系统。After 插件失败不会回滚已经完成的配置变更。
:::

## 启用与配置插件

先将插件 JAR 放入 `${nacos.home}/plugins`，或加入 Nacos Server 启动 classpath。插件实现需要通过 `META-INF/services/com.alibaba.nacos.plugin.config.spi.ConfigChangePluginService` 声明。

插件是否参与候选链只由统一状态 `config-change:{pluginName}` 决定。历史启用键只在不存在持久化状态时初始化该状态，缺省仍为 `false`：

```properties
nacos.core.config.plugin.${configChangePluginName}.enabled=true
```

`${configChangePluginName}` 必须和 `getServiceType()` 一致。持久化状态优先；启动后请通过插件状态 API 或 Next Console 管理，不需要维护第二个执行门禁。

新插件通过 `PluginConfigSpec` 声明配置，标准全键为：

```properties
nacos.plugin.config-change.${configChangePluginName}.${itemKey}=${propertyValue}
```

实现应声明 definition 的 key、历史 alias、类型、默认值、必填、敏感和生效模式，并通过 `applyConfig` 接收有效配置。Nacos 会把当前有效 item map 同时放入 `ConfigChangeConstants.PLUGIN_PROPERTIES`，保持现有请求契约。

未实现 definition 的旧二进制插件继续使用已废弃的兼容适配器读取 `nacos.core.config.plugin.{pluginName}.{propertyKey}`；它仍可加载并收到静态属性，但管理端显示 `configurable=false`，首次使用会记录迁移告警。`ConfigChangeConfigs` 已废弃但仍处于兼容周期，新代码不要继续依赖它。

## 开发插件

配置变更插件依赖：

```xml
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-config-plugin</artifactId>
    <version>${project.version}</version>
</dependency>
```

实现 `com.alibaba.nacos.plugin.config.spi.ConfigChangePluginService`：

| 方法 | 说明 |
|-----|------|
| `getServiceType()` | 插件名称，用于配置、日志和插件状态管理。 |
| `getOrder()` | 执行顺序，值越小越早执行。 |
| `executeType()` | 返回 `EXECUTE_BEFORE_TYPE` 或 `EXECUTE_AFTER_TYPE`。 |
| `pointcutMethodNames()` | 返回插件要处理的 pointcut 列表。 |
| `execute(request, response)` | 执行插件逻辑。 |

`ConfigChangeRequest` 中包含当前 pointcut 和变更参数。常见参数包括 `namespaceId`、`group`、`dataId`、`content`、`srcIp`、`srcUser`、`grayName` 等。Nacos 还会传入：

| 参数 | 说明 |
|------|------|
| `ConfigChangeConstants.ORIGINAL_ARGS` | 原始方法参数。 |
| `ConfigChangeConstants.PLUGIN_PROPERTIES` | 当前插件的自定义配置。 |

`ConfigChangeResponse` 用于返回插件执行结果：

| 字段 | 说明 |
|-----|------|
| `success` | Before 插件设置为 `false` 时，本次配置变更会被拦截。 |
| `msg` | 拦截时返回给调用方的错误信息。 |
| `args` | Before 插件提供的替换参数。替换时必须保持原参数顺序和类型。 |
| `retVal` | 预留返回值。 |

新实现还应实现 `PluginConfigSpec` 的定义、应用和当前快照方法。运行时配置必须先完成整组校验再原子切换；旧二进制实现可以继续沿用默认方法。

## 生产建议

- Before 插件要保持轻量，必须设置清晰的失败策略。
- After 插件适合做审计和通知，但不能假设自己的副作用能回滚配置变更。
- 多个插件订阅同一 pointcut 时，请明确 `getOrder()`，避免规则执行顺序不可预期。
- 插件配置变更后，请验证所有节点都加载了相同插件和相同配置。
- 如果 Webhook 中包含 token，请不要把 token 写入公开仓库或日志。

## 排查

| 现象 | 排查方向 |
|-----|---------|
| 插件未执行 | 检查 JAR、`META-INF/services` 和统一插件状态；首次迁移时再检查历史 `enabled` 初始化值。 |
| Before 插件没有拦截 | 检查 `executeType()`、`pointcutMethodNames()` 和 `response.setSuccess(false)` 是否正确。 |
| 新插件配置为空 | 检查标准前缀 `nacos.plugin.config-change.${serviceType}.`、definitions 和 `applyConfig`。 |
| 旧插件配置为空 | 检查兼容前缀 `nacos.core.config.plugin.${serviceType}.`；该路径已废弃，应安排迁移。 |
| 变更后通知不稳定 | 检查 After 插件外部系统超时、重试和异常处理。 |
