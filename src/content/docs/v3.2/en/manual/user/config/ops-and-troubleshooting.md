---
title: Operations And Troubleshooting
keywords: [Config Operations, Config Capacity, dump, Config History, Troubleshooting]
description: Learn Nacos config capacity, history, dump, local cache, and common troubleshooting paths.
sidebar:
  order: 4
---

# Operations And Troubleshooting

Configuration operations focus on scale, release safety, history, and runtime visibility. Most operations should be performed through the console, Admin API, or Maintainer SDK. They should not run inside normal business applications.

## Capacity Control

Nacos uses capacity information to protect config storage from unbounded growth.

| Scope | Meaning |
| --- | --- |
| Cluster | Total number of formal configs in the cluster. |
| Namespace | Number of formal configs in one namespace. |
| Group | Number of formal configs in one group when namespace-level capacity is not used. |

Capacity mainly contains three fields:

| Field | Description |
| --- | --- |
| `quota` | Maximum number of config records in this scope. `0` means the default value. |
| `usage` | Current counted number of config records. |
| `maxSize` | Maximum content size of one config item in bytes. `0` means the default value. |

Default values:

| Setting | Default |
| --- | --- |
| `defaultClusterQuota` | `100000` |
| `defaultGroupQuota` | `200` |
| `defaultTenantQuota` | `200` |
| `defaultMaxSize` | `100 * 1024` bytes |
| `correctUsageDelay` | `600` seconds |
| `initialExpansionPercent` | `100` |

Gray versions are publish states of existing configs. They are not counted as independent formal configs.

## History And Rollback

Config publish, delete, gray publish, and gray delete are recorded in history. History helps answer:

- Who changed the config.
- When the change happened.
- What content and publish type were involved.

For rollback, review the history content first and then publish it again as formal config. Do not use local dump files as the rollback source.

## Dump And Local Cache

Server-side local dump is a query cache. During startup, Nacos rebuilds local service state from the persistence layer. After config changes, nodes refresh local cache through dump tasks.

Remember:

- The database or embedded storage is the authoritative source.
- Local dump is not authoritative.
- If local dump lags behind, periodic dump or management repair should recover it from persistence.
- If local disk cannot safely save dump content, runtime query correctness is affected. Treat it as a serious problem.

Admin local cache operations are for emergency repair. They should not be used as the normal synchronization mechanism.

## Common Issues

| Symptom | What to check |
| --- | --- |
| Application does not read the new config | Check whether it listens to the correct `namespaceId/groupName/dataId`, receives notification, and queries again. |
| Only some nodes return old content | Check whether dump has completed on those nodes, and inspect config dump logs and cluster change notifications. |
| Gray client does not match | Check beta IP or tag, and confirm that `grayName` and the rule exist. |
| Config publish fails | Check parameter validation, capacity limit, auth, config change plugins, and content size. |
| List query is slow | Check search scope, page size, database health, and `nacos.config.search.*` settings. |
| Local and server content differ | Check client failover files, snapshots, and server dump state. |

## Production Advice

- Keep config publish permissions in the console, release platform, or operation tools.
- Gray release high-risk changes before formal publish.
- Keep clear change notes and approval records for important configs.
- Monitor config push, dump tasks, database health, and config subscriber count.
- Regularly clean unused configs, long-running gray versions, and unused namespaces.
