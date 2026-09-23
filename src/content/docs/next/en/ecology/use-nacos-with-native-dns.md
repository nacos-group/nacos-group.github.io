---
title: Built-in DNS Service Discovery
keywords: [Nacos, DNS, Service discovery, A, AAAA, CoreDNS]
description: Query service instances with Nacos 3.3 built-in DNS, including configuration, domain names, UDP/TCP access, and troubleshooting.
sidebar:
    order: 6.1
---

# Built-in DNS Service Discovery

Nacos 3.3 includes a DNS server that returns registered service instance addresses as DNS records, allowing applications to discover services through name resolution. It supports A records for IPv4 and AAAA records for IPv6 and is disabled by default.

Built-in DNS starts with Nacos Server and requires no additional Nacos DNS plugin. For an existing deployment of the separate CoreDNS plugin, see [Nacos with CoreDNS](./use-nacos-with-coredns.md). Follow the corresponding guide for each integration's configuration and domain naming rules.

## 1. Enable built-in DNS

Add the following to `conf/application.properties` on a Nacos Server that provides service discovery, then restart it:

```properties
nacos.naming.dns.enabled=true
nacos.naming.dns.port=5353
nacos.naming.dns.domain-suffix=nacos
nacos.naming.dns.default-group=DEFAULT_GROUP
nacos.naming.dns.namespace=public
nacos.naming.dns.ttl=60
```

This configuration exposes services from the `public` namespace under `.nacos`, with `DEFAULT_GROUP` as the default group and a record TTL of 60 seconds. Set `namespace` to the namespace ID. Its configuration default is empty; explicitly set it to `public` as shown when querying that namespace. See [System Parameters](../manual/admin/system-configurations.md#built-in-dns) for all settings.

DNS listens on both UDP and TCP on the same port. The default port, `5353`, is independent of the Nacos HTTP/gRPC ports. Before enabling it, confirm that the port is available for both protocols. Cluster nodes serving DNS queries should use the same namespace, suffix, and group settings.

:::caution[DNS access control]
DNS queries do not carry an `accessToken` or pass through Nacos HTTP API authentication. Callers that can reach the DNS port can query service addresses in the configured namespace. Restrict access through a trusted internal network, firewall, or network policy. Enabling client authentication does not automatically protect DNS queries.
:::

## 2. Domain naming rules

With the configuration above:

| Query name | Service name | Group | Namespace |
| --- | --- | --- | --- |
| `dns-demo.nacos.` | `dns-demo` | Configured default group `DEFAULT_GROUP` | Configured `public` |
| `dns-demo.prod.nacos.` | `dns-demo` | Explicit group `prod` | Configured `public` |

The formats are `{serviceName}.{domainSuffix}` and `{serviceName}.{groupName}.{domainSuffix}`. The trailing `.` in the examples makes the name fully qualified, avoiding the addition of system search domains.

Service and group names each occupy one dot-separated label in the query name. Service names containing dots, such as `com.example.Service`, cannot be used directly in this format. Do not append namespace or cluster labels. For DNS discovery, use lowercase letters, digits, and hyphens in service names and explicit group names. The server configuration selects the namespace; individual DNS queries cannot switch it.

## 3. Verify with dig

Prepare a service named `dns-demo` in the `public` namespace and `DEFAULT_GROUP`, with at least one **healthy and enabled** instance. See [Instance Lifecycle](../manual/user/naming/instance-lifecycle.md) for registration and instance states.

To query IPv4 addresses from a local Nacos Server:

```bash
dig @127.0.0.1 -p 5353 dns-demo.nacos. A
```

Check the response status and ANSWER section. If the service has a healthy instance at `10.0.0.10`, the answer includes a record such as:

```text
dns-demo.nacos. 60 IN A 10.0.0.10
```

Verify TCP queries on the same port:

```bash
dig @127.0.0.1 -p 5353 dns-demo.nacos. A +tcp
```

When the service has healthy IPv6 instances, query AAAA records:

```bash
dig @127.0.0.1 -p 5353 dns-demo.nacos. AAAA
```

Include the group in the domain name to query another group. The following command requires the service to be in the `prod` group:

```bash
dig @127.0.0.1 -p 5353 dns-demo.prod.nacos. A
```

Resolution follows these rules:

- Only healthy, enabled instances are returned, filtered to the IP address family requested by A or AAAA.
- Each response contains at most 20 address records, and their order can vary. For larger services, one query does not return the complete instance list.
- Responses contain IP addresses only, without service ports, weights, or instance metadata. Applications must obtain the connection port separately. Use the [Java SDK](../manual/user/java-sdk/usage.md) when these details or change subscriptions are needed.
- SRV, TXT, MX, and other record types are not currently provided. Clients must retry over TCP when a UDP response is truncated. TCP responses are also limited to 20 records per query.
- DNS caching affects how quickly instance changes reach applications. During troubleshooting, compare a direct query to Nacos DNS with the application's resolution result.

## 4. Connect applications and container networks

Use `dig -p 5353` to verify Nacos DNS directly. Applications typically resolve names through system DNS. Configure suffix-based forwarding in your existing DNS service so that `.nacos` queries go to Nacos DNS while other domains keep using their existing resolvers. Built-in DNS does not provide upstream recursion or forwarding configuration.

### 4.1. Forward from CoreDNS

Add a zone to your existing Corefile, replacing `10.0.0.20` with a Nacos Server address reachable from CoreDNS:

```text
nacos:53 {
    forward . 10.0.0.20:5353
}
```

This uses CoreDNS's built-in [forward plugin](https://coredns.io/plugins/forward/) to send DNS requests to Nacos built-in DNS. It is a different integration from deploying the [Nacos CoreDNS plugin](./use-nacos-with-coredns.md). Keep the existing Corefile configuration for other domains.

### 4.2. Docker and Kubernetes

For Docker, add `-p 5353:5353/udp -p 5353:5353/tcp` to your existing `docker run` command and ensure DNS is configured and enabled inside the container. Publishing only HTTP/gRPC ports does not expose DNS.

For Kubernetes, create a separate ClusterIP Service for Nacos Pods with DNS enabled. Replace the example `selector` with the actual Pod labels. The Service and Pods must be in the same Kubernetes namespace:

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

Expose both UDP and TCP as described in [Kubernetes Service protocol support](https://kubernetes.io/docs/concepts/services-networking/service/#protocol-support), and check that network policies allow DNS callers. The Service provides an address for access; applications using system DNS still need the corresponding domain forwarding configuration.

## 5. Troubleshooting

| Symptom | What to check |
| --- | --- |
| Query times out or the connection is refused | Confirm DNS was enabled and the server restarted. Check UDP/TCP listeners on port 5353, port conflicts, container mappings, and firewalls. The startup log message `Nacos DNS server started on port` helps confirm successful binding. |
| `NXDOMAIN` | Check the suffix, service name, group, and configured namespace ID. Confirm there are healthy, enabled instances. If those are correct, inspect server logs for query errors. |
| `NOERROR` with an empty ANSWER section | Check the requested address family. For example, a service with only IPv4 instances has no addresses to return for AAAA. |
| `NOTIMP` | Use A or AAAA. SRV, TXT, and other record types are not currently supported. |
| UDP works but TCP or larger responses fail | Check TCP port mappings and network policies; allowing only UDP is insufficient. |
| Direct queries work but applications fail to resolve or use stale addresses | Check the application's DNS resolver, suffix forwarding, and cache TTL. Confirm the returned instance IP is reachable and the application uses the correct service port. |
