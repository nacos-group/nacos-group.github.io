---
title: Distributed Lock
keywords: [Nacos, Experimental Features, Distributed Lock, LockService]
description: Understand the experimental positioning, usage, and boundary of the Nacos distributed lock.
sidebar:
    order: 2
---

# Distributed Lock

The Nacos distributed lock is an experimental capability in 3.x. It is designed for simple and short mutual exclusion control, such as preventing multiple processes from running a lightweight task at the same time.

:::caution
Distributed Lock is currently experimental. Its APIs, lease semantics, authentication model, operations capabilities, and SDK support may change. If community feedback is limited, it may later be moved to an ecosystem repository under `nacos-group` for separate maintenance.
:::

## Suitable scenarios

- Only one application instance should run a short task at a time.
- A lightweight operation should not be triggered repeatedly.
- You want to validate Nacos lock behavior and SDK behavior in a test environment.

## Unsuitable scenarios

- Critical business transactions that need a strong production-grade lock service.
- Scenarios that require fencing tokens, owner tokens, reentrant locks, fairness queues, or automatic renewal.
- Scenarios that require multi-language SDKs, complete management APIs, query APIs, or watch APIs.
- Untrusted networks where the lock is expected to act as a security boundary.

## Current boundary

| Capability | Current state |
| --- | --- |
| Lock type | The built-in type is `NACOS_LOCK`. |
| Lock identity | Mainly identified by `lockType` and `key`. |
| Lease | The client passes a lease duration, and the server calculates the expiration time from the current time. |
| Default lease | When the requested lease is negative, `nacos.lock.default_expire_time` is used. |
| Maximum lease | `nacos.lock.max_expire_time` limits the maximum requested lease duration. |
| SDK | It is mainly used through the Java SDK `LockService`. |
| Operations | Complete query, watch, and operations APIs are not provided yet. |
| Authentication | It is not recommended for untrusted networks. |

## Java SDK example

```java
Properties properties = new Properties();
properties.put("serverAddr", "127.0.0.1:8848");

LockService lockService = NacosLockFactory.createLockService(properties);
LockInstance lock = NLockFactory.getLock("demo-lock", 5000L);

try {
    if (lockService.lock(lock)) {
        // Execute a short critical section.
    }
} finally {
    lockService.unLock(lock);
}
```

In a mixed-version cluster, the client may fail to create or use a lock if some server nodes do not support distributed lock capability. During upgrade or canary rollout, confirm that all target nodes support this capability first.

## Operations suggestions

- Use it only in trusted internal networks, and control which clients can call it.
- Use a short lease duration to avoid long lock occupation.
- Handle failures and timeouts in your business code. Do not assume that acquiring a lock always succeeds.
- Watch lock-related metrics, including lock success, unlock success, and alive lock count.

## Related documents

- [Java SDK Usage](../manual/user/java-sdk/usage.md)
- [Monitor Manual](../manual/admin/monitor.md)
- [Experimental Features Overview](./overview.md)
