---
title: 服务发现概览
keywords: [服务发现, Naming, 注册中心, Nacos]
description: 了解 Nacos 服务发现的资源模型、服务类型、接口边界和推荐使用方式。
sidebar:
  order: 1
---

# 服务发现概览

Nacos 服务发现用于管理服务、实例、集群、健康状态和订阅关系。服务提供者把实例注册到 Nacos，服务消费者按服务名查询或订阅实例列表，再选择合适的实例发起调用。

服务发现关注的是“某个服务现在有哪些可用实例”。它不是通用流量治理引擎，也不是服务网格控制面。权重、健康保护、元数据和客户端 selector 都服务于发现语义，不应被理解成完整的流量治理系统。

## 资源模型

服务发现的顶层资源是 Service：

```text
namespaceId -> groupName -> serviceName
```

Cluster 和 Instance 是从属资源：

```text
namespaceId -> groupName -> serviceName -> clusterName -> instance
```

| 资源 | 说明 |
| --- | --- |
| Namespace | 隔离环境、租户或业务域。 |
| Group | 在命名空间内继续分组服务。 |
| Service | 服务发现单元。消费者通常按服务名查询实例。 |
| Cluster | Service 下的集群分组，常用于机房、区域或部署单元。 |
| Instance | 具体服务实例，通常由 IP、端口、cluster 和元数据描述。 |

## 临时服务和持久服务

每个 Service 都有服务类型。服务类型决定实例状态由哪条一致性路径维护。

| 服务类型 | 含义 | 主要状态路径 |
| --- | --- | --- |
| 临时服务 | 实例由存活客户端持有。客户端断开、心跳过期或连接释放后，实例会被移除。 | 偏 AP 的运行时 client state 和 Distro 同步。 |
| 持久服务 | 实例作为持久资源管理，可从服务端 snapshot 恢复。 | 偏 CP 的持久 client state 和元数据持久化。 |

`ephemeral` 是 Service 级语义。实例请求中的 `ephemeral` 必须和所属 Service 类型匹配。不要在同一个 Service 下混用临时实例和持久实例。

## 运行面和管理面

| 接口面 | 适合做什么 |
| --- | --- |
| Client SDK | 注册实例、注销实例、查询服务、订阅服务变化、本地缓存和 failover。 |
| Client OpenAPI | 面向自定义 HTTP 客户端，注册、续约、注销和查询指定服务实例。 |
| Admin API | 管理 Service、Instance、Cluster、健康状态、client、subscriber 和日志级别。 |
| Console API | 支撑控制台服务发现页面。 |
| Maintainer SDK | 以 Java SDK 方式执行管理和诊断操作。 |

普通业务应用通常只需要注册自己、注销自己、查询已知下游服务，或订阅已知服务变化。服务列表、订阅者列表、client 诊断、元数据批量修改等属于管理能力。

## 发现视图

Nacos 返回给消费者的不是原始存储数据，而是经过过滤和保护后的发现视图。常见影响因素包括：

- cluster 过滤。
- `enabled` 状态。
- `healthy` 状态。
- 服务端内部过滤规则。
- 保护阈值。
- 客户端 selector 和权重选择。

因此，查询结果和管理页看到的全部实例可能不同。排查时要先确认自己看的是运行时发现视图，还是管理视图。

## 推荐阅读

- 想了解注册、心跳、注销和临时/持久实例，阅读 [实例生命周期](./instance-lifecycle.md)。
- 想理解健康状态、权重、保护阈值和元数据覆盖，阅读 [健康、权重与元数据](./health-and-metadata.md)。
- 想了解订阅推送、缓存、failover 和诊断，阅读 [订阅、推送与运维](./subscription-and-ops.md)。
- 需要具体 HTTP 参数，阅读 [客户端 API](../open-api.md) 和 [运维 API](../../admin/admin-api.md)。
