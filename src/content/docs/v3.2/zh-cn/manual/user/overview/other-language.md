---
title: Nacos SDK 概览
keywords: [SDK,Client SDK,Maintainer SDK,Java SDK,Go SDK,Python SDK]
description: Nacos SDK 的能力边界、语言 SDK 入口和运行时指南。
sidebar:
    order: 1
---

# Nacos SDK 概览

Nacos SDK 用于让应用或工具以类型化方式访问 Nacos。阅读 SDK 文档时，先区分两个角色：

| SDK 类型 | 使用场景 | 文档入口 |
| --- | --- | --- |
| Client SDK | 应用运行时读取配置、监听配置、注册实例、订阅服务、查询或订阅 AI 资源。 | [SDK 运行时指南](../sdk/runtime-guide.md)、各语言 SDK 使用手册 |
| Maintainer SDK | 运维工具、管理平台、控制台或自动化任务调用 Nacos 管理能力。 | [运维 SDK](../../admin/maintainer-sdk.md) |

业务应用优先使用 Client SDK。Client SDK 会管理连接、本地缓存、监听、订阅和重连恢复。需要理解这些运行期行为时，请先阅读 [SDK 运行时指南](../sdk/runtime-guide.md)。

## 官方维护的 Client SDK

| 编程语言 | 使用手册 | 代码仓库 | 包仓库 |
| --- | --- | --- | --- |
| Java | [Java SDK 使用手册](../java-sdk/usage.md) | [alibaba/nacos](https://github.com/alibaba/nacos) | [Maven Central](https://mvnrepository.com/artifact/com.alibaba.nacos/nacos-client) |
| Go | [Go SDK 使用手册](../go-sdk/usage.md) | [nacos-group/nacos-sdk-go](https://github.com/nacos-group/nacos-sdk-go) | `github.com/nacos-group/nacos-sdk-go/v2` |
| Python | [Python SDK 使用手册](../python-sdk/usage.md) | [nacos-group/nacos-sdk-python](https://github.com/nacos-group/nacos-sdk-python) | [PyPI](https://pypi.org/project/nacos-sdk-python/) |

Java SDK 是当前 Client SDK 运行时语义的基准实现。Go、Python 等语言 SDK 会按语言运行时能力逐步对齐连接、缓存、订阅和故障恢复行为。

## 社区 SDK

社区也提供了其他语言 SDK。不同 SDK 的维护状态、协议支持和 Nacos 版本兼容性可能不同。生产接入前，请确认其仓库活跃度、支持的 Nacos 版本、鉴权能力和本地缓存行为。

| 编程语言 | 代码仓库 | 包仓库 |
| --- | --- | --- |
| C++ | [nacos-group/nacos-sdk-cpp](https://github.com/nacos-group/nacos-sdk-cpp) | / |
| Node.js | [nacos-group/nacos-sdk-nodejs](https://github.com/nacos-group/nacos-sdk-nodejs) | [npm](https://www.npmjs.com/package/nacos) |
| C# | [nacos-group/nacos-sdk-csharp](https://github.com/nacos-group/nacos-sdk-csharp) | [NuGet](https://www.nuget.org/packages/nacos-sdk-csharp) |
| Rust | [nacos-group/nacos-sdk-rust](https://github.com/nacos-group/nacos-sdk-rust) | [crates.io](https://crates.io/crates/nacos-sdk/versions) |

如果没有合适的语言 SDK，可以先使用 [OpenAPI 概览](./api-overview.md) 和 [客户端 API](../open-api.md) 了解 HTTP Client API 的能力边界。
