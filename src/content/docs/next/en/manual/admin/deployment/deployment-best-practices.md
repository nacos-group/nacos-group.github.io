---
title: Deployment Best Practices
keywords: [Nacos, deployment, best practices, internal network, authentication, independent console]
description: This guide describes recommended network, storage, authentication, console, plugin, and operations practices for production Nacos deployments.
sidebar:
  order: 6
---

# Nacos Deployment Best Practices

Nacos is a foundational microservice component. In production, it may carry service discovery, configuration management, and AI Registry workloads. A good deployment is not only about starting a cluster. It is also about clear network boundaries, reliable storage, access control, and safe operations.

> Attention
> - Nacos is an internal microservice component and must run in a trusted internal network. Do not expose it to the public internet.
> - The default Nacos authentication implementation is a simple weak-auth system to prevent business misuse. It is not a strong-auth system for defending against malicious attacks.
> - If Nacos must run in an untrusted network, or if strong authentication is required, develop a custom plugin based on the official simple implementation. See [Auth Plugin](../../../plugin/auth-plugin.md).

## Recommended Topology

For production, use cluster mode and separate Nacos Server, Nacos Console, database, and client access paths.

```text
Applications / SDKs
      |
Internal VIP or SLB
      |
Nacos Server cluster  ---- External database
      |
Internal management network
      |
Nacos Console
```

Recommendations:

- Deploy Nacos Server in a trusted internal network and expose only required ports to internal clients.
- Deploy Nacos Console independently and allow access only from operations, platform, or development management networks.
- Allow only Nacos Server to access the database. Do not expose the database to applications or the public internet.
- Allow server-to-server communication ports only between Nacos Server nodes.
- Do not expose any Nacos entry point directly to the public internet. For cross-network access, use VPN, private links, bastion hosts, or enterprise gateways.

## Network And Ports

Since Nacos 3.0, the console port is separated from the server main port. Default ports:

| Port | Purpose | Exposure advice |
| --- | --- | --- |
| `8848` | HTTP API port for OpenAPI, Admin API, and selected plugin requests | Expose only to internal clients, console, or gateways |
| `9848` | Client gRPC port | Expose only to internal clients; VIP/SLB must use TCP forwarding |
| `9849` | Server-to-server gRPC port | Allow only between Nacos Server nodes |
| `7848` | Raft communication port | Allow only between Nacos Server nodes |
| `8080` | Nacos Console port | Expose only to the management network |

When using VIP, SLB, or Nginx, forward `9848` as TCP traffic. Do not proxy it as HTTP or HTTP/2. For details, see [Deployment Overview](./deployment-overview.md).

## Independent Console Deployment

For production, deploy the console independently. This separates the high-privilege management entry from the server runtime path and reduces the impact of console traffic on core server workloads.

Recommended setup:

1. Start Nacos Server with `sh startup.sh -d server`.
2. Start Nacos Console with `sh startup.sh -d console`.
3. Point the console `cluster.conf` to Server nodes or an internal VIP.
4. Keep server identity and token secret settings consistent between Console and Server.
5. Expose the console only to the management network and protect it with enterprise access controls.

For step-by-step instructions, see [Independent Console](./deployment-independent.md).

## Database Storage

For production, use an external database. Embedded Derby is suitable for local development, standalone testing, and temporary validation, but not recommended as production storage.

Nacos currently officially supports four database types:

| Database | Platform value | Description |
| --- | --- | --- |
| Derby | `derby` | Embedded database for local and test use. |
| MySQL | `mysql` | Common production external database. |
| PostgreSQL | `postgresql` | Officially supported. |
| Oracle | `oracle` | Officially supports Oracle 12c or later. |

Recommendations:

- Import the schema of the target Nacos version before startup.
- Use the same database type, schema, and plugin version on all Nacos Server nodes.
- Grant only the required database permissions to the Nacos database account.
- Prepare database backup and restore procedures, and test restore before upgrades.
- Validate compatibility and upgrade paths in a test environment before using community datasource plugins in production. Oracle 11g and earlier versions are no longer maintained by Oracle, and the current Oracle plugin no longer keeps backward compatibility with them.

For details, see [Datasource Plugin](../../../plugin/datasource-plugin.md) and [System Configurations](../system-configurations.md#112-database).

## Authentication And Credentials

Unless the deployment is purely local and temporary, enable authentication and explicitly configure server identity and token secret.

Basic configuration:

```properties
nacos.core.auth.enabled=true
nacos.plugin.auth.type=nacos
nacos.core.auth.server.identity.key=${your_identity_key}
nacos.core.auth.server.identity.value=${your_identity_value}
nacos.plugin.auth.nacos.token.secret.key=${your_token_secret}
```

Recommendations:

- Do not use default, sample, or short token secrets.
- Use the same server identity settings on all Server nodes and independent Console nodes.
- Choose the right auth plugin for the environment: default Nacos auth, LDAP, OIDC/OAuth2, or a custom plugin.
- Manage SDK, OpenAPI, and console accounts separately. Avoid shared high-privilege accounts.
- After permission changes, remember that local auth caches may introduce a short delay.

For details, see [Authorization Manual](../auth.mdx), [Access Credentials](../../user/auth.mdx), and [Auth Plugin](../../../plugin/auth-plugin.md).

## Visibility And Resource Governance

Authentication answers “can this user access the system”. Visibility answers “which resources can this user see”. If you use AI Registry, evaluate the visibility plugin so different teams, tenants, or users do not see unrelated resources.

Related docs:

- [Visibility Plugin](../../../plugin/visibility-plugin.md)
- [AI Resource Lifecycle](../../user/ai/ai-resource-lifecycle.md)

## Traffic Control

When a cluster carries many client connections or sudden traffic spikes on core APIs, enable the traffic control plugin. Start with `monitor` mode, then switch to `intercept` after the threshold is validated.

```properties
nacos.plugin.control.type=nacos
```

Pay attention to:

- Client gRPC long connections.
- Config query and listener traffic.
- Service registration, deregistration, and subscription traffic.
- Console and operations API request rate.

For details, see [Traffic Control Plugin](../../../plugin/control-plugin.md).

## Configuration Encryption

Use the configuration encryption plugin for sensitive configs. It stores selected `dataId` values as ciphertext and uses `encrypted_data_key` to store the data key.

```text
cipher-aes-application-prod.yaml
```

Recommendations:

- Load the same algorithm plugin on the server and on clients that need decryption.
- Before upgrades, confirm that tables contain the `encrypted_data_key` column.
- Configuration encryption does not replace authentication, network isolation, or TLS.
- In enterprise production environments, connect a custom plugin to KMS or HSM if needed.

For details, see [Configuration Encryption Plugin](../../../plugin/config-encryption-plugin.md).

## Monitoring, Backup, And Upgrade

Prepare these operations capabilities before going online:

- Connect Prometheus and Grafana. Monitor JVM, thread pools, gRPC connections, request volume, database pools, and topN resources.
- Back up the database and key files regularly, such as `application.properties`, `cluster.conf`, and the plugin directory.
- Before upgrades, compare the target version schema and test upgrade and rollback in a staging environment.
- When changing auth, datasource, independent console, or plugin configuration, roll out to a small set of nodes first.
- Keep an emergency runbook for disabling traffic rules, rolling back plugins, switching database connections, and restoring console access.

Related docs:

- [Monitor Manual](../monitor.md)
- [Upgrading Manual](../upgrading.mdx)
- [System Configurations](../system-configurations.md)

## Go-Live Checklist

| Check | Recommendation |
| --- | --- |
| Network boundary | Open ports only inside trusted internal networks. Do not expose Nacos to the public internet. |
| Deployment mode | Use cluster mode for production and deploy the console independently. |
| Database | Use an external database, import the target schema, and verify backup and restore. |
| Authentication | Enable auth, configure server identity, and use a strong token secret. |
| Clients | Use an internal VIP/SLB address and provide proper credentials. |
| Visibility | Enable and verify resource visibility for multi-team or AI Registry scenarios. |
| Traffic control | Start in `monitor` mode, then use `intercept` after thresholds are verified. |
| Config encryption | Use the `cipher-${algorithmName}-` prefix for sensitive configs and verify decryption. |
| Monitoring | Alert on connections, request volume, database, JVM, and error logs. |
| Upgrade and rollback | Compare schemas, back up data, and rehearse rollback before upgrades. |
