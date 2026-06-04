---
title: 配置变更
keywords: [配置变更, 配置审计, 配置格式校验, webhook]
description: 本文介绍 Nacos 配置变更插件的用途、执行模型、启用方式和自定义开发方式。
sidebar:
    order: 6
---

# 配置变更插件

配置变更插件用于在配置发布、修改、删除、导入等操作前后织入自定义逻辑。它适合做配置治理，而不是替代 Nacos 的配置存储模型。

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

## 启用插件

先将插件 JAR 放入 `${nacos.home}/plugins`，或加入 Nacos Server 启动 classpath。插件实现需要通过 `META-INF/services/com.alibaba.nacos.plugin.config.spi.ConfigChangePluginService` 声明。

然后在 `${nacos.home}/conf/application.properties` 中启用目标插件：

```properties
nacos.core.config.plugin.${configChangePluginName}.enabled=true
```

`${configChangePluginName}` 必须和插件实现的 `getServiceType()` 返回值一致。Nacos 3.2 起还有统一插件状态管理能力，但配置变更执行链路仍会读取上述 `enabled` 配置，因此生产使用时请同时按插件文档完成启用配置。

插件可以读取自己的自定义配置：

```properties
nacos.core.config.plugin.${configChangePluginName}.${propertyKey}=${propertyValue}
```

例如 Webhook、白名单、文件格式校验类插件可以使用如下配置：

```properties
# webhook
nacos.core.config.plugin.webhook.enabled=true
nacos.core.config.plugin.webhook.url=http://localhost:8080/webhook/send?token=***
nacos.core.config.plugin.webhook.contentMaxCapacity=102400

# whitelist
nacos.core.config.plugin.whitelist.enabled=true
nacos.core.config.plugin.whitelist.suffixs=xml,text,properties,yaml,html

# file format check
nacos.core.config.plugin.fileformatcheck.enabled=true
```

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

## 生产建议

- Before 插件要保持轻量，必须设置清晰的失败策略。
- After 插件适合做审计和通知，但不能假设自己的副作用能回滚配置变更。
- 多个插件订阅同一 pointcut 时，请明确 `getOrder()`，避免规则执行顺序不可预期。
- 插件配置变更后，请验证所有节点都加载了相同插件和相同配置。
- 如果 Webhook 中包含 token，请不要把 token 写入公开仓库或日志。

## 排查

| 现象 | 排查方向 |
|-----|---------|
| 插件未执行 | 检查 JAR 是否在 classpath 中，`META-INF/services` 是否声明正确，`enabled` 是否为 `true`。 |
| Before 插件没有拦截 | 检查 `executeType()`、`pointcutMethodNames()` 和 `response.setSuccess(false)` 是否正确。 |
| 插件配置为空 | 检查配置前缀是否为 `nacos.core.config.plugin.${serviceType}.`，其中 `serviceType` 和 `getServiceType()` 保持一致。 |
| 变更后通知不稳定 | 检查 After 插件外部系统超时、重试和异常处理。 |
