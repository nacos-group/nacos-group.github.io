---
title: 集群寻址
keywords: [寻址, 集群成员, address-server, cluster.conf]
description: 本文介绍 Nacos Server 集群成员寻址机制，以及 file 和 address-server 两种常用寻址方式。
sidebar:
    order: 10
---

# 集群寻址

集群寻址用于告诉 Nacos Server 当前集群有哪些节点。每个节点启动后，会根据寻址结果建立集群成员列表，再完成节点通信、健康检查、Raft/Distro 等内部协作。

当前 Nacos 3.x 的集群寻址主要支持两种模式：

| 模式 | 配置值 | 适用场景 |
|-----|-------|---------|
| 文件寻址 | `file` | 集群节点相对固定，由 `cluster.conf` 或 `nacos.member.list` 指定。 |
| 地址服务器寻址 | `address-server` | 集群节点列表由外部地址服务器统一下发，适合需要集中管理节点列表的环境。 |

:::note
本文介绍的是 Nacos Server 集群成员发现机制。当前 Nacos 3.x 源码中，集群寻址不属于统一插件管理中的通用 SPI 插件类型。请不要继续按旧版本 `AddressPlugin` 接口开发自定义寻址插件。
:::

## 选择寻址模式

Nacos 通过 `nacos.core.member.lookup.type` 指定寻址模式：

```properties
nacos.core.member.lookup.type=file
```

可选值如下：

- `file`：使用 `cluster.conf` 或 `nacos.member.list`。
- `address-server`：从地址服务器拉取集群节点列表。

如果没有显式配置 `nacos.core.member.lookup.type`，Nacos 会按以下顺序选择：

1. 如果存在 `${nacos.home}/conf/cluster.conf`，使用 `file`。
2. 如果配置了 `nacos.member.list`，使用 `file`。
3. 否则使用 `address-server`。

单机模式下，Nacos 会使用单机寻址，不需要配置集群成员列表。

## 文件寻址

文件寻址是最常用的生产部署方式。将所有 Nacos Server 节点写入 `${nacos.home}/conf/cluster.conf`，每行一个节点地址：

```text
10.0.0.11:8848
10.0.0.12:8848
10.0.0.13:8848
```

也可以使用 `nacos.member.list` 指定节点列表：

```properties
nacos.core.member.lookup.type=file
nacos.member.list=10.0.0.11:8848,10.0.0.12:8848,10.0.0.13:8848
```

使用文件寻址时，建议保持所有节点上的 `cluster.conf` 内容一致。Nacos 会监听 `cluster.conf` 变更并重新读取节点列表，但生产环境仍建议通过发布流程统一修改，避免节点间看到不同的集群成员。

## 地址服务器寻址

地址服务器寻址适用于由外部系统统一管理 Nacos Server 列表的场景。Nacos 启动时会访问地址服务器，拉取节点列表，并定期刷新。

常用配置如下：

```properties
nacos.core.member.lookup.type=address-server
address.server.domain=address-server.example.com
address.server.port=8080
address.server.url=/serverlist
nacos.core.address-server.retry=5
```

对应含义如下：

| 配置项 | 说明 | 默认值 |
|-------|------|-------|
| `address.server.domain` | 地址服务器域名。也可以通过环境变量 `address_server_domain` 指定。 | `jmenv.tbsite.net` |
| `address.server.port` | 地址服务器端口。也可以通过环境变量 `address_server_port` 指定。 | `8080` |
| `address.server.url` | 获取节点列表的路径。也可以通过环境变量 `address_server_url` 指定。 | `${nacos.server.contextPath}/serverlist` |
| `nacos.core.address-server.retry` | 启动时拉取节点列表的重试次数。 | `5` |
| `maxHealthCheckFailCount` | 地址服务器连续失败达到该次数后，标记地址服务器不健康。 | `12` |

地址服务器返回内容应能被解析为 Nacos 集群节点列表，通常为多行 `ip:port` 格式。

## 运维建议

- 生产环境优先使用 `file` 或由平台统一维护的 `address-server`，避免每个节点临时写入不同的成员列表。
- 变更集群成员前，先确认新老节点版本、端口、网络策略和数据源配置一致。
- 如果使用 `address-server`，请把地址服务器纳入监控。地址服务器不可用会影响节点列表刷新，首次启动时也可能导致 Nacos 启动失败。
- 排查集群成员问题时，优先查看 `${nacos.home}/logs/nacos-cluster.log` 和 `${nacos.home}/logs/nacos.log`。
- 如果节点列表来自 `cluster.conf`，请检查文件内容、挂载路径和容器内实际文件是否一致。

## 常见问题

| 现象 | 排查方向 |
|-----|---------|
| 节点启动后看不到其它成员 | 检查 `nacos.core.member.lookup.type`、`cluster.conf` 或 `nacos.member.list` 是否正确。 |
| 部分节点成员列表不同 | 检查每个节点的 `cluster.conf` 内容和配置发布流程。 |
| 使用地址服务器时启动失败 | 检查 `address.server.domain`、`address.server.port`、`address.server.url` 是否可访问，并确认返回内容格式正确。 |
| 地址服务器偶发异常 | 检查 `nacos.core.address-server.retry`、`maxHealthCheckFailCount`、地址服务器监控和网络链路。 |
