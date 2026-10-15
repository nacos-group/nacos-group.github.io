---
title: Agentic Resource Hub
keywords: [Nacos, Agentic Resource Hub, Skill, 跨 Namespace, 共享]
description: 本文档介绍 Agentic Resource Hub，包括 Skill 的共享、查询、下载、导入、跨 Namespace 复制和开关配置。
sidebar:
    order: 3
---

# Agentic Resource Hub

Agentic Resource Hub 是 Nacos 提供的跨 Namespace 资源共享能力。从 `3.3.0` 版本开始，支持 Skill 的共享、查询、下载、导入和复制。

在 **Skill 管理** 中管理当前 Namespace 的 Skill，在 **Agentic 资源 Hub** 中浏览共享 Skill。

## 1. 共享与复用

| 操作 | 权限要求 | 结果 |
|------|----------|------|
| 共享 | 源 Skill 的 READ、WRITE 权限；资源已启用、可见范围为 PUBLIC，指定版本已上线 | 在 Hub 中发布指向指定版本的引用 |
| 从 Hub 导入 | 可访问共享条目，并具有目标 Namespace 的 WRITE 权限 | 在目标 Namespace 创建独立草稿，不要求源 Namespace READ 权限 |
| 直接复制 | 源 Skill 的 READ 权限、目标 Namespace 的 WRITE 权限，并通过源资源可见性检查 | 从指定源版本创建独立草稿，无需先共享到 Hub |

Hub 条目使用 `hubEntryId` 标识，同名 Skill 可以来自不同 Namespace。共享版本不会随源 Skill 的 `latest` 标签自动变化。

导入和复制后的草稿保留来源信息，拥有独立的生命周期，不会与源内容自动同步。

## 2. 启用条件

在 `${nacos.home}/conf/application.properties` 中配置：

```properties
nacos.ai.hub.enabled=true
```

默认值为 `true`。Hub 依赖 AI 模块；设置 `nacos.extension.ai.enabled=false` 或 `nacos.functionMode=microservice` 时不加载 AI 模块。

Hub API 使用 Admin/Console 的鉴权和资源可见性配置，需启用对应范围的鉴权。共享条目支持匿名只读访问；共享、导入、复制和治理操作需要用户身份及对应权限。

配置说明见[系统参数](../../admin/system-configurations.md)。

## 3. 在控制台共享 Skill

1. 在 **AI 注册中心 → Skill 管理** 中选择源 Namespace 和 Skill。
2. 确认 Skill 已启用、可见范围为 PUBLIC，选择已上线的版本。
3. 在 **Hub 共享管理** 中选择 **共享到 Hub**。
4. 进入 **Agentic 资源 Hub**，按名称、描述关键词和标签查找共享条目，查看共享版本和文件内容，或下载 ZIP 包。

具有源 Skill 写入权限的用户可以管理共享；具有源 Skill 读取权限的用户可以从 Hub 跳转到源资源详情。

共享者可以调整共享版本或取消共享；管理员可以填写原因并强制下架共享。取消共享保留源 Skill 和已导入的独立草稿。

共享版本下线、源 Skill 停用、改为 PRIVATE 或被删除时，共享失效。源资源或版本被删除后以同名重建，不会自动恢复旧共享。

## 4. 导入到自己的 Namespace

在 Hub 详情中选择导入，填写有写入权限的目标 Namespace、目标 Skill 名称和目标版本。

- 目标版本默认为 `0.0.1`，导入后状态为 `draft`。
- 目标 Namespace 中已有同名 Skill 时返回冲突，不覆盖现有资源。
- 已撤销或失效的共享无法导入。
- 导入后按 [AI 资源生命周期](./ai-resource-lifecycle.md) 审核和发布。

API 和 SDK 调用方式见[运维 API](../../admin/admin-api.md#12-agentic-resource-hub) 和 [Maintainer SDK](../../admin/maintainer-sdk.md#13-agentic-resource-hub)。

## 5. 同集群跨 Namespace 复制

通过 API 或 Maintainer SDK 指定源 Namespace、Skill 名称和已上线版本，以及目标 Namespace、名称和版本。源 Skill 必须已启用，调用方需具备源 READ 和目标 WRITE 权限，并通过源资源可见性检查。

复制后在目标 Namespace 创建独立草稿并保留来源信息，后续按 AI 资源生命周期审核和发布。

## 6. 关闭 Hub

```properties
nacos.ai.hub.enabled=false
```

修改配置后重启服务端，集群内各 Server 实例应保持一致。

关闭后：

- 控制台隐藏 Hub 入口、Skill 共享按钮和 Hub 引用链接；直接访问 Hub 页面会跳转到普通资源页面。刷新页面后生效。
- Hub 列表请求通过参数和权限检查后返回空分页结果。
- Hub 详情、内容、下载、共享、调整、撤销、状态查询和导入返回 HTTP `501`，业务码为 `40001`。
- 已有共享数据保留；普通 Skill 操作、直接复制和源资源生命周期清理继续执行。

客户端可通过[获取 Nacos 集群状态信息](../../admin/admin-api.md#119-获取nacos集群状态信息)接口中的 `ai_hub_enabled` 字段查询 Hub 开关状态。

## 7. 继续阅读

- [Skill 管理](./skill-registry.md)
- [运维 API](../../admin/admin-api.md#12-agentic-resource-hub)
- [Maintainer SDK](../../admin/maintainer-sdk.md#13-agentic-resource-hub)
- [AI 资源生命周期](./ai-resource-lifecycle.md)
