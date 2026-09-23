---
title: SDK 运行时指南
keywords: [SDK,客户端运行时,连接,本地缓存,重连,配置监听,服务订阅]
description: 介绍 Nacos Client SDK 在应用运行过程中的连接、缓存、监听、订阅和故障恢复行为。
---

# SDK 运行时指南

SDK 运行时指南关注应用启动之后发生的事：客户端如何连接 Nacos，如何监听配置和订阅服务，网络抖动时怎样恢复，以及哪些本地数据可以作为临时兜底。

这篇文档不替代具体语言 SDK 的 API 手册。它说明 Client SDK 的共同运行时语义。Java SDK 是当前基准实现，Go、Python 等语言 SDK 会按语言能力逐步对齐。

## 1. Client SDK 的边界

业务应用优先使用 Client SDK。它面向应用运行时，适合做这些事情：

- 读取已知配置，并监听这些配置的变更。
- 注册和注销当前应用实例。
- 查询和订阅已知下游服务。
- 查询、订阅或注册运行时 AI 资源，例如 MCP endpoint、Agent endpoint、Prompt、Skill 和 AgentSpec。
- 在连接恢复后，尽量恢复应用已经声明过的监听、订阅和临时实例注册。

Client SDK 不适合做大范围管理。不要用它来列举全部命名空间、全部配置、全部服务或全部客户端。配置批量管理、审计、运维查询和服务端状态调整，应使用 Admin API、Console API 或 Maintainer SDK。

## 2. 初始化时先确定运行时身份

一个 SDK 实例通常绑定一个命名空间。应用需要访问多个命名空间时，建议创建多个 SDK 实例，并在应用退出时关闭这些实例。

Nacos 3.3 默认开启 Client 鉴权。未配置正确身份或权限时，配置读取、服务注册/发现和 AI 请求可能失败。默认插件请在创建 SDK 前设置用户名和密码，由 SDK 获取并刷新 token；其他插件按对应身份模式配置。详见[配置访问凭据](../auth.mdx)。

初始化时重点确认这些信息：

| 信息 | 说明 |
| --- | --- |
| `serverAddr` 或 `endpoint` | `serverAddr` 适合固定 Nacos 集群地址；`endpoint` 适合通过地址服务动态获取服务端列表。 |
| `namespace` | 当前 SDK 实例访问的命名空间。 |
| `group`、`dataId`、`serviceName` | 运行时访问资源时使用的业务标识。 |
| `username`、`password`、`accessKey`、`secretKey` 等凭据 | 3.3 默认需要按服务端鉴权模式配置；SDK 不会使用控制台浏览器的登录状态。 |
| `contextPath` | Nacos HTTP API 的 context path，默认是 `nacos`。 |
| gRPC 端口偏移 | Nacos 3.x 客户端仍沿用主端口加偏移量的计算方式，默认从 `8848` 推导出 `9848`。 |

配置和服务发现 SDK 通常需要 HTTP 与 gRPC 端口均可达：HTTP 用于登录等请求，gRPC 用于运行时长连接。仅使用 AI 子服务时，按第 6 节的传输模式及兼容路径准备网络；选择 HTTP 不会把同一应用中的 ConfigService、NamingService 也改为 HTTP。

## 3. 连接不是一次性动作

Nacos 2.x 以后，Client SDK 的主要运行时通道是 gRPC 长连接。客户端会解析服务端地址列表，选择服务端建立连接，并通过健康检查、服务端 reset、地址列表变化等信号触发重连。

连接恢复后，SDK 会把已经声明过的运行时意图重新挂到新连接上。例如：

- 配置监听会重新同步已知监听项。
- 服务订阅会重新订阅。
- 临时实例会重新注册。
- AI endpoint 和订阅会在对应能力支持时重新恢复。

这类恢复是运行时恢复，不是服务端数据修复。一次写入请求超时后，客户端不能仅凭本地状态判断服务端是否已经成功处理。

## 4. 配置运行时

配置读取和监听建议遵循几个原则：

- 应用读取已知 `dataId` 和 `group` 的配置，不要在业务运行时做大范围配置搜索。
- 需要持续感知变更时，使用监听能力，而不是高频轮询。
- 如果需要“先读当前值，再监听后续变化”，优先使用语言 SDK 中对应的查询并监听方法。
- 监听回调中避免做长时间阻塞逻辑。需要复杂处理时，把事件交给业务线程池。
- 配置发布、删除、历史和批量管理属于管理场景，建议使用 Admin API 或 Maintainer SDK。

Java SDK 在本地维护配置 snapshot。服务端查询成功后会写入 snapshot；服务端不可用时，某些读取路径可以使用最后一次成功读取到的本地数据兜底。

本地 failover 文件是更强的本地覆盖能力。它需要用户主动维护，用于 Nacos 服务端不可用、远端配置存在风险或发布窗口需要临时冻结配置时。failover 文件不会自动写回服务端。

## 5. 服务发现运行时

服务发现运行时围绕注册、订阅和本地服务视图工作。

- 临时实例适合普通应用实例。连接断开后，服务端会清理连接维度的临时状态；客户端重连后会 redo 注册。
- 持久化实例适合需要由服务端健康检查维护状态的场景。它的生命周期不只绑定到客户端连接。
- 订阅服务时，客户端会接收服务端 push，并维护本地服务视图。
- 本地缓存只是最后一次已知的服务视图，不是服务端权威状态。
- 开启推空保护后，客户端可以忽略异常的空实例列表，避免可用服务视图被意外清空。

如果服务端不可用，客户端可能暂时使用本地缓存或 failover 视图。业务调用方仍应保留自己的超时、重试和熔断策略。

## 6. AI 资源运行时

AI 管理中心中的部分资源也会进入运行时。应用可以查询 Prompt、Skill、AgentSpec，或者注册 MCP endpoint、Agent endpoint，并订阅资源变化。

AI 运行时和配置、服务发现一样，也需要区分“资源管理”和“运行时使用”：

- 创建、发布、上线、下线、导入和治理资源属于管理动作。
- 应用运行时查询、下载、订阅和注册 endpoint 属于 Client SDK 或 Client API 场景。

更多资源模型请阅读 [AI 管理中心](../ai/ai-registry-overview.md)。

### 6.1. Java SDK 的资源入口与传输

3.3 Java SDK 通过 `AiService.mcp()`、`agent()`、`skill()`、`prompt()`、`agentSpec()` 取得子服务，共享一个命名空间、认证和关闭流程。子入口本身不会为应用创建独立 SDK。

| 模式 | 使用方式 |
| --- | --- |
| `grpc`（默认） | 具有 gRPC 实现的资源使用 gRPC；显式 gRPC 的网络失败不会自动变成 HTTP 请求。 |
| `http` | 使用服务端支持的 AI HTTP 能力，需要 HTTP 主端口可达。SDK 负责认证、客户端标识和端点活性维护。 |
| `auto` | 按资源能力和连接状态选择；符合条件的连接失败可以转用 HTTP，业务错误不触发切换。 |

Skill、AgentSpec 当前使用 HTTP 路径，即使总模式为 `grpc` 也需要 HTTP 可达。旧 A2A 路由使用 gRPC；选择 RAD 路由后，A2A 兼容操作才按 Agent 模式执行。不存在相应能力的旧服务端不会因为设置 `auto` 就获得新 API。

在创建 SDK 前设置模式，例如只让 Agent 使用 HTTP：

```java
Properties properties = new Properties();
properties.setProperty("serverAddr", "{serverAddr}");
properties.setProperty("namespace", "public");
properties.setProperty("username", System.getenv("NACOS_USERNAME"));
properties.setProperty("password", System.getenv("NACOS_PASSWORD"));
properties.setProperty("nacosAiTransportMode", "grpc");
properties.setProperty("nacosAiAgentTransportMode", "http");
AiService aiService = AiFactory.createAiService(properties);
AgentService agents = aiService.agent();
```

资源覆盖值和总值都在初始化时校验并固定，修改 Properties 不会热切换已有实例。完整参数见 [AI 资源参数](../java-sdk/properties.md#26-ai-资源参数)。

### 6.2. 订阅、端点活性与错误处理

- Agent 订阅优先使用服务端 Watch 通知，不支持时回退为有界 Discover 轮询；SDK 向应用交付完整快照。收到不可用事件时撤销旧视图，终止性错误修复后重新订阅。
- MCP、Skill、Prompt、AgentSpec 保留各自的订阅轮询。SDK 已获取的内容通过对应监听器传递，应用无需把所有回调都处理成一次额外查询。
- HTTP 注册的 Agent/MCP 运行端点由 SDK 维护客户端标识及心跳。保留注册使用的实例；正常退出时通过同一实例注销，再关闭 `AiService`。取消订阅或下线资源定义不会停止业务进程。
- 权限、参数、版本冲突、容量或迁移限制应按业务错误处理。发布超时后结果可能未知，先查询状态，不应盲目换一种传输重发；端点重连恢复不等于定义发布可以自动重试。

### 6.3. 旧 A2A 与 RAD 的兼容

3.3 SDK 在首次可靠协商后固定当前实例使用旧 A2A 或 RAD 路由。选定旧 A2A 的实例在服务端升级后不会自动改走 RAD；需要重新创建 SDK 才重新判断。选定 RAD 后，业务或迁移错误不会使其静默退回旧 A2A。

旧 A2A 与通用 Agent 注册同一资源时应避免混用发布来源。需要新 Agent 能力时，先完成服务端升级及迁移，再接入 SDK；参见 [Agent 管理](../ai/agent-registry.md)、[RAD 接入指南](../ai/rad-discovery.md)和[升级手册](../../admin/upgrading.mdx)。

## 7. 本地缓存、failover 和 redo

SDK 运行时会使用几类本地或内存数据：

| 数据 | 用途 | 注意事项 |
| --- | --- | --- |
| 配置 snapshot | 保存最后一次成功读取到的配置内容。 | 只用于恢复读取，不代表服务端最新状态。 |
| 配置 failover 文件 | 用户主动维护的本地配置覆盖。 | 优先级高，但不会写回服务端。 |
| 服务本地缓存 | 保存最后一次已知服务实例视图。 | 适合作为短期兜底，不应长期替代服务端。 |
| 服务 failover 数据 | 开启 failover 时覆盖服务发现结果。 | 只影响本地发现视图。 |
| redo 数据 | 记录订阅、临时实例注册等运行时意图。 | 重连后用于恢复，不代表写入已经持久化。 |

这些数据的共同点是：它们都不是服务端权威状态。排障时要同时看客户端日志、服务端状态和管理 API 结果。

## 8. 运行期排障

遇到客户端问题时，可以先按下面顺序排查：

| 现象 | 排查方向 |
| --- | --- |
| 启动后无法连接 | 检查 `serverAddr`、`endpoint`、HTTP 端口、gRPC 端口、context path 和网络策略。 |
| 鉴权失败 | 检查服务端鉴权插件、客户端凭据、token 刷新、RAM/OIDC 等身份模式是否匹配。 |
| 配置监听不触发 | 检查 `dataId`、`group`、`namespace` 是否一致，确认客户端连接是否反复重连。 |
| 服务订阅结果为空 | 检查服务名、group、cluster、实例健康状态和推空保护配置。 |
| 网络抖动后实例消失 | 检查临时实例 redo 是否恢复，确认客户端是否已重新连接。 |
| 本地缓存数据不符合预期 | 检查 `JM.SNAPSHOT.PATH`、failover 开关和缓存文件是否被人工修改。 |

Java SDK 的常用本地路径包括：

- `JM.LOG.PATH`：客户端日志根目录，默认在用户目录下的 `logs` 目录。
- `JM.SNAPSHOT.PATH`：配置和服务本地缓存根目录，默认在用户目录下。

更多 Java SDK 参数请阅读 [Java SDK 配置参数](../java-sdk/properties.md)。服务端端口和部署边界请阅读 [部署手册](../../admin/deployment/deployment-overview.md)。

## 9. 关闭 SDK

应用退出或不再使用 SDK 实例时，应调用对应语言 SDK 的关闭方法。关闭会释放连接、后台任务、监听和订阅上下文。

关闭 SDK 不会删除用户维护的 failover 文件，也不会把本地缓存写回服务端。
