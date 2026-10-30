---
title: Cluster Addressing
keywords: [Addressing, cluster members, address-server, cluster.conf]
description: Learn how Nacos Server discovers cluster members with file and address-server modes.
sidebar:
    order: 10
---

# Cluster Addressing

Cluster addressing tells each Nacos Server node which nodes belong to the current cluster. After startup, the node builds the member list from the addressing result and uses it for internal communication, health checks, Raft/Distro coordination, and other cluster work.

Nacos 3.x mainly supports two cluster addressing modes:

| Mode | Value | When to use it |
|------|-------|----------------|
| File addressing | `file` | Cluster nodes are relatively stable and are configured through `cluster.conf` or `nacos.member.list`. |
| Address server | `address-server` | An external address server centrally provides the Nacos Server member list. |

:::note
This page describes the Nacos Server cluster member discovery mechanism. In the current Nacos 3.x source code, cluster addressing is not a general SPI plugin type managed by the unified plugin system. Do not use the old `AddressPlugin` interface as the development contract for new custom addressing plugins.
:::

## Select Addressing Mode

Use `nacos.core.member.lookup.type` to select the addressing mode:

```properties
nacos.core.member.lookup.type=file
```

Available values:

- `file`: use `cluster.conf` or `nacos.member.list`.
- `address-server`: pull the member list from an address server.

If `nacos.core.member.lookup.type` is not set, Nacos selects the mode in this order:

1. If `${nacos.home}/conf/cluster.conf` exists, use `file`.
2. If `nacos.member.list` is configured, use `file`.
3. Otherwise, use `address-server`.

Standalone mode uses standalone addressing and does not require a cluster member list.

## File Addressing

File addressing is the most common production deployment mode. Put all Nacos Server nodes in `${nacos.home}/conf/cluster.conf`, one node per line:

```text
10.0.0.11:8848
10.0.0.12:8848
10.0.0.13:8848
```

You can also configure the member list with `nacos.member.list`:

```properties
nacos.core.member.lookup.type=file
nacos.member.list=10.0.0.11:8848,10.0.0.12:8848,10.0.0.13:8848
```

When using file addressing, keep `cluster.conf` consistent on all nodes. Nacos watches `cluster.conf` and reloads it after changes, but production changes should still go through a controlled release process so nodes do not see different member lists.

## Address Server

Address server mode is useful when an external system manages the Nacos Server list. During startup, Nacos pulls the member list from the address server and refreshes it periodically.

Common configuration:

```properties
nacos.core.member.lookup.type=address-server
address.server.domain=address-server.example.com
address.server.port=8080
address.server.url=/serverlist
nacos.core.address-server.retry=5
```

Configuration reference:

| Configuration | Description | Default |
|---------------|-------------|---------|
| `address.server.domain` | Address server domain. You can also set `address_server_domain` as an environment variable. | `jmenv.tbsite.net` |
| `address.server.port` | Address server port. You can also set `address_server_port` as an environment variable. | `8080` |
| `address.server.url` | Path for pulling the member list. You can also set `address_server_url` as an environment variable. | `${nacos.server.contextPath}/serverlist` |
| `nacos.core.address-server.retry` | Startup retry count for pulling the member list. | `5` |
| `maxHealthCheckFailCount` | Mark the address server unhealthy after this many consecutive failures. | `12` |

The address server response must be parseable as a Nacos cluster member list. It is usually a multi-line `ip:port` list.

## Operational Advice

- In production, prefer `file` or a platform-managed `address-server`. Avoid manually writing different member lists on different nodes.
- Before changing cluster members, confirm that old and new nodes use compatible versions, ports, network rules, and datasource configuration.
- If you use `address-server`, monitor it. Address server failures affect member list refresh and may also cause startup failure.
- When troubleshooting member list issues, check `${nacos.home}/logs/nacos-cluster.log` and `${nacos.home}/logs/nacos.log` first.
- If the member list comes from `cluster.conf`, verify the file content, mount path, and actual file inside containers.

## Troubleshooting

| Symptom | What to check |
|---------|---------------|
| A node cannot see other members after startup | Check `nacos.core.member.lookup.type`, `cluster.conf`, and `nacos.member.list`. |
| Different nodes see different member lists | Check `cluster.conf` on each node and the configuration release process. |
| Startup fails with address server mode | Check whether `address.server.domain`, `address.server.port`, and `address.server.url` are reachable, and whether the response format is valid. |
| Address server is intermittently unhealthy | Check `nacos.core.address-server.retry`, `maxHealthCheckFailCount`, address server monitoring, and the network path. |
