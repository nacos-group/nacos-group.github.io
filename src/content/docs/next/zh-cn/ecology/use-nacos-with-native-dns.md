---
title: 内置 DNS 服务发现
keywords: [Nacos, DNS, 服务发现, A, AAAA, CoreDNS]
description: 使用 Nacos 3.3 内置 DNS 查询服务实例，了解配置、域名规则、UDP/TCP 接入及常见问题。
sidebar:
    order: 6.1
---

# 内置 DNS 服务发现

Nacos 3.3 内置 DNS 服务，可以把已注册服务的实例地址作为 DNS 记录返回，供使用域名解析的应用发现服务。支持 IPv4 的 A 记录、IPv6 的 AAAA 记录，以及包含端口和权重信息的 SRV 记录。非 Nacos 后缀域名可选择性地转发到上游 DNS 服务器。默认关闭。

内置 DNS 随 Nacos Server 启动，不需要额外部署 Nacos DNS 插件。已有独立 CoreDNS 插件的接入方式可继续参考 [Nacos 融合 CoreDNS](./use-nacos-with-coredns.md)。两种方式的配置和域名规则应分别按对应指南使用。

## 1. 启用内置 DNS

在提供服务发现能力的 Nacos Server 上，将以下配置加入 `conf/application.properties`，然后重启：

```properties
nacos.naming.dns.enabled=true
nacos.naming.dns.bind-address=127.0.0.1
nacos.naming.dns.port=5353
nacos.naming.dns.domain-suffix=nacos
nacos.naming.dns.default-group=DEFAULT_GROUP
nacos.naming.dns.namespace=public
nacos.naming.dns.ttl=60
```

这组配置将 `public` 命名空间中的服务通过 `.nacos` 域名提供查询，默认分组为 `DEFAULT_GROUP`，记录 TTL 为 60 秒。`namespace` 填命名空间 ID；其配置默认值为空，查询 `public` 命名空间时应像示例一样显式填写。完整参数说明见[系统参数](../manual/admin/system-configurations.md#内置-dns)。

`bind-address` 默认为 `127.0.0.1`，防止 DNS 端口被不可信网络访问。仅在可信内网环境中，且已配置防火墙规则时，才设置为 `0.0.0.0` 或具体网卡地址。DNS 在同一地址和端口上监听 UDP 和 TCP，默认端口 `5353` 独立于 Nacos 的 HTTP/gRPC 端口。启用前确认两个协议的端口均未被占用。集群中需要提供 DNS 查询的节点应使用相同的命名空间、后缀及分组配置。

:::caution[DNS 访问控制]
DNS 查询不携带 `accessToken`，也不经过 Nacos HTTP API 的鉴权流程。能够访问 DNS 端口的调用方可以查询所配置命名空间中的服务地址。默认 `bind-address=127.0.0.1` 仅允许本机访问；仅在可信内网环境中才设置为具体网卡地址或 `0.0.0.0`，并通过防火墙或网络策略限定来源。开启客户端鉴权不会自动保护 DNS 查询。
:::

## 2. 域名规则

使用上面的配置时：

| 查询域名 | 服务名 | 分组 | 命名空间 |
| --- | --- | --- | --- |
| `dns-demo.nacos.` | `dns-demo` | 配置的默认分组 `DEFAULT_GROUP` | 配置的 `public` |
| `dns-demo.prod.nacos.` | `dns-demo` | 显式分组 `prod` | 配置的 `public` |

通用格式为 `{serviceName}.{domainSuffix}` 或 `{serviceName}.{groupName}.{domainSuffix}`。示例末尾的 `.` 表示完整域名，便于查询时避免追加系统搜索域。

域名中的服务名和分组名各占一段，以 `.` 分隔。含点号的服务名（例如 `com.example.Service`）不能直接套用这一格式；不要在域名中再拼接 namespace 或 cluster。建议用于 DNS 发现的服务名和显式分组名使用小写字母、数字及短横线。命名空间统一由服务端配置选择，不能通过单次 DNS 请求切换。

## 3. 使用 dig 验证

先在 `public` 命名空间、`DEFAULT_GROUP` 分组中准备服务 `dns-demo`，并确认至少有一个**健康且启用**的实例。服务注册和实例状态说明见[实例生命周期](../manual/user/naming/instance-lifecycle.md)。

下面以本机 Nacos Server 为例，查询 IPv4 地址：

```bash
dig @127.0.0.1 -p 5353 dns-demo.nacos. A
```

检查响应状态及 ANSWER 区域。若服务有地址为 `10.0.0.10` 的健康实例，答案中会包含类似记录：

```text
dns-demo.nacos. 60 IN A 10.0.0.10
```

验证同一端口的 TCP 查询：

```bash
dig @127.0.0.1 -p 5353 dns-demo.nacos. A +tcp
```

服务注册了健康的 IPv6 实例时，可查询 AAAA 记录：

```bash
dig @127.0.0.1 -p 5353 dns-demo.nacos. AAAA
```

查询 SRV 记录可一次性获取服务端口、权重和目标地址：

```bash
dig @127.0.0.1 -p 5353 dns-demo.nacos. SRV
```

每个健康实例生成一条 SRV 记录，`priority=0`、`weight=instance.weight`、`port=instance.port`，目标名为实例 IP 派生的主机名。附加区域（additional section）包含目标的 glue A/AAAA 记录，因此一次 SRV 查询即可同时获得端口和地址，无需二次查询。

查询其他分组时，将分组写入域名。以下命令要求服务位于 `prod` 分组：

```bash
dig @127.0.0.1 -p 5353 dns-demo.prod.nacos. A
```

解析结果有以下规则：

- 仅返回健康且启用的实例，并按 A/AAAA 选择对应的 IP 地址类型。
- 每次响应最多包含 20 条地址记录，返回顺序可能变化。实例较多时，单次查询结果不是完整实例列表。
- A 和 AAAA 响应只返回 IP 地址，不返回服务端口、权重或实例元数据。应用需要另行约定连接端口；SRV 响应同时包含端口和权重。需要实例元数据或变更订阅时，可使用 [Java SDK](../manual/user/java-sdk/usage.md)。
- 支持 SRV 记录用于服务发现查询。TXT、MX 等记录类型暂不提供。UDP 响应被截断时，客户端需要通过 TCP 重试；TCP 查询同样受每次最多 20 条记录的限制。
- 实例变更后的生效时间还受 DNS 缓存影响，排障时可直接查询 Nacos DNS，和应用的解析结果对比。

## 4. 接入应用和容器网络

`dig -p 5353` 用于直接验证 Nacos DNS。普通应用通常通过系统 DNS 解析域名，可在现有 DNS 服务中配置后缀转发，将 `.nacos` 查询转到 Nacos DNS，其他域名继续使用原有解析服务。

### 4.1. 转发非 Nacos 域名到上游 DNS（可选）

Nacos DNS 可作为**条件转发器**，将不匹配配置后缀的域名转发到上游 DNS。这不是开放递归解析器：仅转发非内部后缀的查询，错误响应不设置递归可用（RA）标志。

在 `conf/application.properties` 中启用转发：

```properties
nacos.naming.dns.forward-enabled=true
nacos.naming.dns.forward-servers=8.8.8.8,1.1.1.1:53
nacos.naming.dns.forward-timeout-ms=3000
```

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| `forward-enabled` | `false` | 启用非后缀域名向上游 DNS 的转发 |
| `forward-servers` | 空 | 上游 DNS 服务器，支持 `host`、`host:port`、`[ipv6]:port` 格式。非法或空条目在启动时跳过并输出警告。 |
| `forward-timeout-ms` | `3000` | 单上游超时（毫秒），最小 100ms。所有上游尝试的总时间预算为该值的 2 倍。 |

转发行为：

- 上游返回 `NOERROR` 或 `NXDOMAIN` 的响应原样返回给客户端。
- 上游返回 `SERVFAIL`、`REFUSED` 或发生网络错误时，自动尝试下一个配置的服务器。
- 所有上游均失败时，客户端收到 `SERVFAIL`（而非 `NXDOMAIN`），避免上游临时故障毒化客户端负缓存。
- `SimpleResolver` 按 `host:port` 缓存，避免每次查询新建 socket。

:::caution[转发安全]
启用转发后，若 DNS 端口可被不可信网络访问，Nacos 可能被滥用作反射放大攻击源。请保持 `bind-address` 为 `127.0.0.1` 或可信内网地址，切勿将转发 DNS 服务暴露到公网。
:::

### 4.2. 使用 CoreDNS 转发

在现有 CoreDNS 的 Corefile 中增加对应域名的配置段，将 `10.0.0.20` 替换为 CoreDNS 可访问的 Nacos Server 地址：

```text
nacos:53 {
    forward . 10.0.0.20:5353
}
```

此处使用的是 CoreDNS 自带的 [forward 插件](https://coredns.io/plugins/forward/)，将 DNS 请求转发给 Nacos 内置 DNS。它与单独部署 [Nacos CoreDNS 插件](./use-nacos-with-coredns.md)的方式不同。保留现有 Corefile 中其他域名的解析配置。

### 4.3. Docker 与 Kubernetes

Docker 部署时，在已有 `docker run` 命令中增加 `-p 5353:5353/udp -p 5353:5353/tcp`，并确保容器内已配置和启用 DNS。只映射 HTTP/gRPC 端口无法访问 DNS。

Kubernetes 可为已启用 DNS 的 Nacos Pod 创建独立的 ClusterIP Service。以下示例的 `selector` 需替换为实际 Pod 标签；Service 与 Pod 应位于同一个 Kubernetes namespace：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nacos-dns
spec:
  selector:
    app: nacos
  ports:
    - name: dns-udp
      port: 5353
      targetPort: 5353
      protocol: UDP
    - name: dns-tcp
      port: 5353
      targetPort: 5353
      protocol: TCP
```

按 [Kubernetes Service 的协议配置](https://kubernetes.io/docs/concepts/services-networking/service/#protocol-support)同时开放 UDP/TCP，并检查网络策略允许 DNS 调用方访问。创建 Service 只提供访问地址；应用使用系统 DNS 时，仍需配置相应的域名转发。

## 5. 监控指标

当 classpath 中包含 Spring Boot Actuator 时，Nacos DNS 暴露以下 Micrometer 指标：

| 指标 | 类型 | 标签 | 说明 |
| --- | --- | --- | --- |
| `nacos.dns.queries.total` | Counter | — | 收到的 DNS 查询总数 |
| `nacos.dns.queries.success` | Counter | — | 本地应答成功的查询数 |
| `nacos.dns.queries.forwarded` | Counter | — | 转发到上游的查询数 |
| `nacos.dns.queries.failed` | Counter | — | 失败的查询数 |
| `nacos.dns.query.duration` | Timer | `type`, `rcode` | 查询处理耗时，按记录类型（A/AAAA/SRV/OTHER/UNKNOWN）和响应码打标签 |
| `nacos.dns.forward.queries.total` | Counter | — | 转发尝试总数 |
| `nacos.dns.forward.queries.success` | Counter | — | 上游成功响应数 |
| `nacos.dns.forward.queries.failed` | Counter | — | 所有上游均失败数 |
| `nacos.dns.forward.duration` | Timer | `server`, `result` | 按上游服务器统计的转发耗时 |

标签值均为有限基数：`type` 最多 5 个值，`rcode` 使用标准 DNS 响应码名称，`server` 来自配置的上游列表。绝不使用域名作为标签，避免基数爆炸。

未引入 Actuator 时，DNS 服务正常启动，指标收集在内存注册表中但不对外导出。

## 6. 常见问题

| 现象 | 检查方式 |
| --- | --- |
| 查询超时或连接被拒绝 | 确认已启用 DNS 并重启；检查配置的 `bind-address:port` 上的 UDP/TCP 监听、端口冲突、容器映射及防火墙。启动日志中的 `Nacos DNS server started` 可帮助确认监听是否成功。 |
| 返回 `NXDOMAIN` | 检查后缀、服务名、分组和服务端配置的命名空间 ID，确认存在健康且启用的实例。对于转发域名，`NXDOMAIN` 可能来自上游服务器。若配置和实例正常，再查看服务端日志是否有查询异常。 |
| 返回 `SERVFAIL` | 本地查询时检查服务端日志是否有异常。转发查询时表示所有上游均失败或超时，检查 `forward-servers` 是否可达、`forward-timeout-ms` 是否合适。 |
| 返回 `NOERROR`，但 ANSWER 为空 | 检查请求的地址类型。例如服务只有 IPv4 实例时，AAAA 查询没有地址可返回。 |
| 返回 `NOTIMP` | 确认查询类型为 A、AAAA 或 SRV，TXT、MX 等类型暂不支持。 |
| UDP 可查，TCP 失败或大响应失败 | 检查 TCP 端口映射与网络策略，不能只允许 UDP。 |
| 直接查询正常，应用解析失败或仍使用旧地址 | 检查应用使用的 DNS、后缀转发和缓存 TTL；确认解析出的实例 IP 对应用可达，并使用正确的服务端口。 |
| 转发查询慢或超时 | 检查上游服务器可达性。转发总预算为 `2 × forward-timeout-ms`；多个慢上游时，后续服务器可能因预算耗尽被跳过。 |
