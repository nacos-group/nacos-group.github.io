---
title: 分布式锁
keywords: [Nacos, 实验性功能, 分布式锁, LockService]
description: 了解 Nacos 分布式锁的实验性定位、使用方式和能力边界。
sidebar:
    order: 2
---

# 分布式锁

Nacos 分布式锁是 3.x 中的实验性能力。它面向简单、短时的互斥控制，例如避免多个进程同时执行一段轻量级任务。

:::caution
分布式锁当前属于实验性功能。接口、租约语义、鉴权方式、运维能力和 SDK 支持范围都可能调整。若社区反馈较少，后续可能剥离到 `nacos-group` 生态仓库独立维护。
:::

## 适合的场景

- 多个应用实例中，只希望一个实例短时间执行某个任务。
- 控制一次轻量级运维动作，避免重复触发。
- 在测试环境验证 Nacos 锁能力和 SDK 行为。

## 不适合的场景

- 需要强生产级锁服务的关键业务事务。
- 需要 fencing token、owner token、可重入、公平队列或自动续约的场景。
- 需要跨语言 SDK、完整管理 API、查询 API 或监听 API 的场景。
- 运行在不可信网络中，并把锁作为安全边界的场景。

## 当前能力边界

| 能力 | 当前状态 |
| --- | --- |
| 锁类型 | 内置类型为 `NACOS_LOCK`。 |
| 锁标识 | 主要由 `lockType` 和 `key` 标识。 |
| 租约 | 客户端传入租约时长，服务端按当前时间计算过期时间。 |
| 默认租约 | 请求租约为负数时，使用 `nacos.lock.default_expire_time`。 |
| 最大租约 | 使用 `nacos.lock.max_expire_time` 限制最大租约时长。 |
| SDK | 当前主要通过 Java SDK 的 `LockService` 使用。 |
| 管理能力 | 暂不提供完整的查询、监听和运维管理 API。 |
| 鉴权 | 当前不建议在不可信网络中使用。 |

## Java SDK 使用示例

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

混合版本集群中，如果服务端不支持分布式锁能力，客户端可能无法成功创建或使用锁。升级和灰度验证时，请先确认所有目标节点都支持该能力。

## 运维建议

- 只在可信内部网络中使用，并控制调用方范围。
- 为锁设置较短租约，避免长时间占用。
- 在业务侧做好失败和超时处理，不要假设加锁一定成功。
- 关注锁相关指标，观察加锁成功率、解锁成功率和存活锁数量。

## 相关文档

- [Java SDK 使用手册](../manual/user/java-sdk/usage.md)
- [监控手册](../manual/admin/monitor.md)
- [实验性功能概览](./overview.md)
