---
title: Nacos SDK Overview
keywords: [SDK, Client SDK, Maintainer SDK, Java SDK, Go SDK, Python SDK]
description: Learn the Nacos SDK boundary, language SDK entries, and runtime guide.
sidebar:
    order: 1
---

# Nacos SDK Overview

Nacos SDKs let applications and tools access Nacos through typed interfaces. Before choosing a document, distinguish the two SDK roles:

| SDK Type | Use Case | Document Entry |
| --- | --- | --- |
| Client SDK | Application runtime access, including reading and listening to configurations, registering instances, subscribing to services, and querying or subscribing to AI resources. | [SDK Runtime Guide](../sdk/runtime-guide.md), language SDK manuals |
| Maintainer SDK | Operations tools, management platforms, consoles, or automation tasks that call Nacos management capabilities. | [Maintainer SDK](../../admin/maintainer-sdk.md) |

Business applications should prefer the Client SDK. The Client SDK manages connections, local cache, listeners, subscriptions, and reconnect recovery. To understand runtime behavior, read [SDK Runtime Guide](../sdk/runtime-guide.md) first.

## Officially Maintained Client SDKs

| Language | Manual | Code Repository | Package Repository |
| --- | --- | --- | --- |
| Java | [Java SDK Usage](../java-sdk/usage.md) | [alibaba/nacos](https://github.com/alibaba/nacos) | [Maven Central](https://mvnrepository.com/artifact/com.alibaba.nacos/nacos-client) |
| Go | [Go SDK Usage](../go-sdk/usage.md) | [nacos-group/nacos-sdk-go](https://github.com/nacos-group/nacos-sdk-go) | `github.com/nacos-group/nacos-sdk-go/v2` |
| Python | [Python SDK Usage](../python-sdk/usage.md) | [nacos-group/nacos-sdk-python](https://github.com/nacos-group/nacos-sdk-python) | [PyPI](https://pypi.org/project/nacos-sdk-python/) |

Java is the current reference implementation for Client SDK runtime semantics. Go, Python, and other language SDKs align their connection, cache, subscription, and recovery behavior as their language runtime capabilities evolve.

## Community SDKs

The community also provides SDKs for other languages. Their maintenance status, protocol support, and Nacos version compatibility may differ. Before production adoption, confirm repository activity, supported Nacos versions, auth capabilities, and local cache behavior.

| Language | Code Repository | Package Repository |
| --- | --- | --- |
| C++ | [nacos-group/nacos-sdk-cpp](https://github.com/nacos-group/nacos-sdk-cpp) | / |
| Node.js | [nacos-group/nacos-sdk-nodejs](https://github.com/nacos-group/nacos-sdk-nodejs) | [npm](https://www.npmjs.com/package/nacos) |
| C# | [nacos-group/nacos-sdk-csharp](https://github.com/nacos-group/nacos-sdk-csharp) | [NuGet](https://www.nuget.org/packages/nacos-sdk-csharp) |
| Rust | [nacos-group/nacos-sdk-rust](https://github.com/nacos-group/nacos-sdk-rust) | [crates.io](https://crates.io/crates/nacos-sdk/versions) |

If your language does not have a suitable SDK, read [OpenAPI Overview](./api-overview.md) and [Client API](../open-api.md) to understand the HTTP Client API boundary.
