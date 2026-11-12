---
title: 健康、权重与元数据
keywords: [健康检查, 权重, 保护阈值, 元数据, enabled]
description: 了解 Nacos 服务发现中的健康状态、enabled、权重、保护阈值和元数据优先级。
sidebar:
  order: 3
---

# 健康、权重与元数据

服务发现结果会受到健康状态、`enabled`、权重、保护阈值和元数据影响。理解这些字段，可以避免把“实例存在”和“实例会被消费者发现”混为一谈。

## healthy 和 enabled

`healthy` 表示实例当前是否被 Nacos 健康逻辑认为可用。它可能来自临时实例心跳、持久实例主动健康检查、手动健康更新或节点间同步。

`enabled` 表示实例是否允许接收发现流量。disabled 实例不应返回给运行时 OpenAPI 消费者，并会被 Java SDK selection 过滤。

| 字段 | 关注点 | 谁通常修改 |
| --- | --- | --- |
| `healthy` | 实例是否健康。 | 心跳、健康检查器、负责节点同步，或特定场景下的手动更新。 |
| `enabled` | 实例是否允许被消费者选择。 | 运维人员、控制台、Admin API 或 Maintainer SDK。 |

实例存在但没有出现在消费者查询结果中时，优先检查 `enabled`、`healthy`、cluster 过滤和保护阈值。

## 临时服务健康

临时服务实例由客户端存活状态驱动。

HTTP 或兼容客户端通过心跳续约。可以使用保留元数据 key 调整心跳行为：

| Key | 含义 |
| --- | --- |
| `preserved.heart.beat.interval` | 期望心跳间隔。 |
| `preserved.heart.beat.timeout` | 实例被标记为 unhealthy 前的超时时间。 |
| `preserved.ip.delete.timeout` | 实例可被删除前的超时时间。 |

gRPC SDK 客户端通过连接生命周期维持临时实例存活。Naming 模块依赖连接关闭和释放事件清理运行时状态，不需要业务再实现一套 gRPC 心跳。

## 持久服务健康

持久服务实例由服务端主动健康检查维护。Cluster 元数据决定健康检查类型和端口行为。

内置主动检查类型包括：

- TCP
- HTTP
- MySQL
- NONE

只有当 cluster health checker 为 `NONE` 时，才允许手动更新持久实例健康状态。如果配置了主动健康检查，健康状态应由检查器负责。

## 权重

`weight` 是实例级值，用于客户端权重选择。运行时选择通常会忽略 weight 小于等于 `0` 的实例。

Nacos 服务端负责保存和返回权重，但不保证所有消费者都按权重负载均衡。最终是否按权重选择，还取决于客户端或上层框架。

## 保护阈值

Service 的 `protectThreshold` 用于防止发现结果收缩到过少健康实例。

当健康比例小于等于保护阈值时，服务端会进入保护视图，返回更宽的实例集合，并在该保护视图中把 unhealthy 实例表现为 healthy。

保护阈值是可用性保护机制，不表示底层实例真实健康。看到保护阈值生效时，应尽快排查真实健康实例减少的原因。

## 元数据优先级

Naming 有两类实例元数据来源：

| 来源 | 含义 | 优先级 |
| --- | --- | --- |
| 运行时元数据 | 应用注册实例或心跳时提交的元数据。 | 较低 |
| 运维态元数据 | 通过控制台、Admin API、Maintainer SDK 等管理路径写入的元数据。 | 较高 |

当同一个 key 同时存在于运行时元数据和运维态元数据中，对外发现视图以运维态元数据为准。运维态元数据代表显式管理覆盖。

## Selector 边界

Naming 中存在几类 selector-like 概念：

- 服务端内部过滤：cluster、enabled、healthy、保护阈值等。
- 旧 API 中的 service selector：兼容字段，不建议作为新行为基础。
- SDK 客户端 selector：用于本地 listener 或 selection 过滤，不改变服务端状态。

如果需要新的服务端过滤或治理能力，应使用明确的 API 和插件边界，不要依赖旧 selector 字段表达新语义。
