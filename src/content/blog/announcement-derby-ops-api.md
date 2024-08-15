---
title: 关于Nacos Derby数据库运维接口相关问题公告
keywords: [ nacos, derby, ops, removal ]
description: 关于Nacos Derby数据库运维接口相关问题公告
date: "2024-07-16"
category: announcement
---

# 关于Nacos Derby数据库运维接口相关问题公告

尊敬的Nacos社区用户：

近期，社区收到了许多关于Nacos Derby数据库运维接口`/nacos/v1/cs/ops/derby`和`/nacos/v1/cs/ops/data/removal`
的反馈和问题报告，这些问题包括疑似存在SQL注入等安全隐患。为了向广大用户释疑解惑，并确保大家的系统安全，我们特此发布此公告进行详细说明。

### 1. 该接口作用说明

该接口`/nacos/v1/cs/ops/derby`和`/nacos/v1/cs/ops/data/removal`
在使用Derby数据库作为内置数据源时，用于运维人员进行数据运维和问题排查。如果使用外置数据库（如MySQL）该接口自动关闭访问不通。Derby不同于外置数据库（如MySQL），Derby数据库作为内置数据库不能像外置数据库那样方便地通过其他工具进行访问和查询。因此，此接口为运维人员提供了一种便捷的方法来执行Derby数据库SQL语句。

### 2. 该接口具备鉴权机制

我们已在接口设计中考虑到安全性问题。在Nacos系统开启鉴权功能时，访问该接口需要具备管理员（admin）用户权限，确保只有授权的运维人员才能执行相关操作。

### 3. 建议使用外置数据库

当Nacos使用MySQL等外置数据库时，`/nacos/v1/cs/ops/derby`和`/nacos/v1/cs/ops/data/removal`
接口将无法访问。这是因为外置数据库不需要通过此接口进行操作，它们通常具备其他办法来支撑数据管理和查询。

### 4. 使用Derby内置数据库的场景

使用Derby内置数据库的情形主要在本地开发测试环境中出现。当采用单例模式启动Nacos时，为了避免因搭建外置数据库而占用额外的资源，Derby数据库作为便捷的数据源备选方案被采用。

### 5. 总结

**综上所述，关于该接口如果有安全防护诉求，建议请开启Nacos鉴权机制，防止他人滥用该接口进行调用或攻击；**

若您的环境已使用如MySQL的外置数据库作为存储数据源，或已经开启了鉴权功能，那么您的系统没有任何风险隐患。

我们鼓励所有用户在生产环境中，务必开启鉴权并优先考虑使用外置数据库，以确保系统的安全性和稳定性。

同时Nacos社区也能体谅希望使用Derby数据库和运维对应数据库的需求，因此在`2.4.0`和`2.4.1`
两个版本中对相关功能进行了一定优化，分别添加了`derby ops`API的开关和默认限制`Derby SQL`
的可执行类型,您可以通过`nacos.config.derby.ops.enabled=true`和`nacos.persistence.sql.derby.limit.enabled=false`
来开启`derby ops`的接口以及扩大可执行的SQL类型。

感谢您对Nacos社区的支持与信任。如果您有任何问题，欢迎通过社区讨论区或其他反馈渠道告知我们，我们将尽快为您解答。
