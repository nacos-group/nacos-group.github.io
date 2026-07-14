---
title: Skill 管理
keywords: [Nacos Skill Registry, Skill 管理, AI Skill, Agent Skill]
description: 本文档介绍 Nacos Skill 管理（Skill Registry），包括 Skill 的创建、版本管理、安全审核、发布和分发等功能
sidebar:
    order: 2
---

# Skill 管理

Skill 管理（Skill Registry）是 Nacos 提供的私有 Skill 仓库能力。它将 Skill 的存储、版本管理、安全审核和分发集中在一个平台上，让团队成员可以方便地发现、安装和共享 Skill。

Nacos 从 `3.2.0` 版本开始，提供了 Skill 管理能力，支持 Skill 的创建、版本管理、安全审核、发布和分发。

## 1. Nacos 中的 Skill

### 1.1. Skill 的定义与结构

Skills 通常指 Agent Skills，旨在将通用大语言模型转化为具有特定领域专业知识、可复用工作流的"专家型Agent"。

Skill 是 AI Agent 的可复用能力单元。每个 Skill 定义了一组指令（Instruction），告诉 Agent **在什么场景下**、**按照什么步骤**来完成特定任务。一个 Skill 包含：

- **SKILL.md**：核心文件，包含 YAML frontmatter（名称、描述等元数据）和 Markdown 正文（详细指令）。Agent 加载 Skill 时，完整的 SKILL.md 内容会被注入执行上下文。
- **资源文件（Resource）**：可选的附属文件，如模板、数据、脚本等，按类型组织在子目录中。

示例：

```
skill-sample/
├── SKILL.md          # Required: instructions + metadata
├── scripts/          # Optional: executable code
├── references/       # Optional: documentation
└── assets/           # Optional: templates, resources
```

### 1.2. Skill 管理的核心价值

- **团队共享**：将团队积累的最佳实践沉淀为 Skill，一次创建，团队共用
- **版本管控**：完整的版本生命周期管理，支持草稿、审核、发布、上下线
- **安全保障**：内置发布流水线（Pipeline），集成安全扫描，防止 Prompt 注入、数据泄露等风险
- **灵活分发**：通过 CLI、API、SDK 多种方式进行 Skill 的发现与安装
- **可见性控制**：支持 PUBLIC / PRIVATE 两种可见性，按需控制 Skill 的访问范围

## 2. Skill 管理

### 2.1. 生命周期

每个 Skill 版本有以下四种状态，构成完整的生命周期流转：

```
draft ──> reviewing ──> online ──> offline
  ^           │                       │
  └───────────┘                       │
  (Pipeline 拒绝时回退)                 │
                                      └──> online (可重新上线)
```

| 状态 | 说明 |
|------|------|
| `draft` | 草稿，可自由编辑内容 |
| `reviewing` | 已提交审核，Pipeline 执行中 |
| `online` | 已发布上线，对外可用 |
| `offline` | 已下线，不再对外提供 |

> **约束**：
> - 同一个 Skill 同时只能有一个 draft 或 reviewing 状态的版本。
> - 版本一旦发布（online）后内容不可修改，如需变更请基于该版本新建草稿，修改后重新提交审核并发布。

Skill 从创建到使用，经历以下完整流程：

#### 2.1.1. 创建

支持三种创建方式：

| 方式 | 说明 |
|------|------|
| **手动创建** | 在控制台填写名称、描述和 SKILL.md 内容，创建一个 draft 版本 |
| **ZIP 上传** | 上传包含 SKILL.md 的 ZIP 包，系统自动解析并创建 Skill |
| **AI 生成** | 提供背景描述，由 Copilot 自动生成完整的 Skill 内容 |

#### 2.1.2. 草稿（Draft）

- **新建草稿**：创建全新的 Skill 或为已有 Skill 创建新版本的草稿
- **Fork 草稿**：基于已发布的版本创建草稿，自动继承内容，版本号递增
- **编辑草稿**：修改 SKILL.md 内容、描述和资源文件
- **删除草稿**：放弃当前草稿，释放工作位

> 同一 Skill 同时只允许存在一个 draft 或 reviewing 版本，需等当前工作版本处理完毕后才能创建新草稿。

#### 2.1.3. 提交审核（Submit）

将 draft 版本提交审核。提交后版本状态变为 `reviewing`：

- **有 Pipeline 配置**：触发发布流水线执行安全扫描等检查
- **无 Pipeline 配置**：直接发布为 online 状态

#### 2.1.4. 发布流水线（Pipeline）

Pipeline 是可配置的审核流程，在 Skill 发布前进行自动化检查。**Pipeline 默认关闭**，关闭时提交审核会直接发布为 online 状态。

Pipeline 采用插件化架构，通过 Java SPI 机制加载检查节点。内置提供 **skill-scanner** 插件（基于 [Cisco AI Defense skill-scanner](https://github.com/cisco-ai-defense/skill-scanner)），用户也可以实现 `PublishPipelineServiceBuilder` 接口开发自定义插件，并通过 SPI 注册到 Pipeline 中。多个插件按 `getPreferOrder()` 排序串行执行，前一个通过后才执行下一个。

开启 Pipeline 需要在 `application.properties` 中配置：

```properties
# 启用 Pipeline 并指定检查节点
nacos.plugin.ai-pipeline.enabled=true
nacos.plugin.ai-pipeline.type=skill-scanner

# 检查节点配置（以 skill-scanner 为例）
nacos.plugin.ai-pipeline.skill-scanner.enabled=true
nacos.plugin.ai-pipeline.skill-scanner.command=/path/to/skill-scanner
```

skill-scanner 插件检测以下风险：

- Prompt 注入攻击
- 数据泄露风险
- 恶意代码模式

Pipeline 执行结果：

| 结果 | 处理 |
|------|------|
| **APPROVED** | 版本保持 `reviewing` 状态，等待手动点击发布 |
| **REJECTED** | 版本回退为 `draft`，可修改后重新提交 |

#### 2.1.5. 发布（Publish）

- **正常发布**：Pipeline 审核通过后，将 `reviewing` 版本发布为 `online`，可选择是否更新 `latest` 标签
- **强制发布**：管理员特权操作，绕过 Pipeline 校验直接发布。当 Pipeline 拒绝发布但实际情况需要紧急上线时，全局管理员可在控制台执行强制发布，该操作会记录审计日志

#### 2.1.6. 上下线

支持两个粒度的上下线操作：

| 粒度 | 说明 |
|------|------|
| **版本级别** | 对单个版本执行 online / offline 操作 |
| **Skill 级别** | 全局启用 / 禁用整个 Skill，影响所有版本的可发现性 |

### 2.2. 版本与标签

Skill 使用**语义化版本号**（SemVer），如 `1.0.0`、`1.1.2`。创建新草稿时，版本号自动递增或可手动指定（需大于基线版本）。

**标签（Labels）** 是 label → version 的映射，用于为版本赋予语义别名：

| 标签 | 示例 | 用途 |
|------|------|------|
| `latest` | `latest → 1.2.0` | 客户端默认获取的版本 |
| `stable` | `stable → 1.1.0` | 标记经过验证的稳定版本 |
| 自定义 | `canary → 1.3.0` | 按需自定义的路由标签 |

客户端查询 Skill 时，可通过标签名获取对应版本，默认使用 `latest` 标签。

标签管理操作：

- 发布时可选择自动更新 `latest` 标签指向新版本
- 在版本时间线中可手动绑定/解绑自定义标签（如 `stable`、`canary`）

### 2.3. 可见性

每个 Skill 有 `scope` 属性控制可见范围：

| 范围 | 说明 |
|------|------|
| **PUBLIC** | 命名空间内所有用户可见可下载 |
| **PRIVATE** | 仅 Owner（创建者）和被授权用户可见 |

可见性影响列表查询、详情查看和下载操作。写操作（编辑、发布、删除等）需要 Owner 身份或显式的写权限。在详情页可随时切换 Skill 的 `scope`（PUBLIC ↔ PRIVATE），切换为 PRIVATE 后，非 Owner 用户将无法在列表中看到该 Skill。

### 2.4. 业务标签

业务标签（Biz Tags）用于对 Skill 进行业务分类，如 `["retail", "finance"]`。

- 在详情页可添加或移除业务标签
- 标签以 JSON 数组格式存储
- 可用于列表页的筛选和分类展示

## 3. 管理控制台

Nacos 控制台提供了完整的 Skill 管理界面，位于 **AI 注册中心 > Skill 管理** 菜单下。

### 3.1. Skill 列表页

列表页以卡片形式展示所有 Skill，提供以下功能：

- **搜索**：按 Skill 名称关键字搜索
- **排序**：支持按默认排序或下载量排序
- **卡片信息**：显示名称、描述、业务标签、在线版本数、是否有草稿、下载量、更新时间；列表接口同时返回展示版本 `SKILL.md` 中解析出的 `frontMatter`，可用于展示 `alias` 等自定义元数据
- **批量操作**：支持多选后批量删除
- **快捷入口**：上传 ZIP、创建新 Skill

### 3.2. Skill 详情页

详情页提供 Skill 的完整管理视图，包括基本信息、版本管理、内容编辑、Pipeline 状态、CLI 命令卡片等。

#### 3.2.1. 版本管理

详情页右侧以版本时间线展示所有版本，支持版本切换和以下操作：

| 操作 | 说明 |
|------|------|
| **创建草稿** | 基于已有版本创建新草稿，同一时刻只允许存在一个 draft 或 reviewing 版本 |
| **编辑草稿** | 在线编辑 SKILL.md 内容、描述信息和资源文件，实时保存 |
| **删除草稿** | 放弃当前草稿，释放工作位 |
| **提交审核** | 将 draft 提交为 reviewing，提交前需确保描述和 SKILL.md 内容不为空 |
| **发布** | Pipeline 通过后发布为 online，可选择自动更新 `latest` 标签 |
| **强制发布** | 仅管理员可见，Pipeline 拒绝时可绕过校验直接发布 |

#### 3.2.2. 上下线管理

- **版本级别**：在版本时间线或操作区对单个版本执行 online / offline
- **Skill 级别**：详情页顶部的启用开关控制整个 Skill 的可发现性，禁用后所有版本对客户端不可见

#### 3.2.3. 可见性管理

详情页顶部提供可见性开关，支持 PUBLIC ↔ PRIVATE 切换。切换为 PRIVATE 后，非 Owner 用户将无法发现该 Skill。

#### 3.2.4. 标签管理

- **版本标签（Labels）**：在版本时间线或侧边栏卡片中绑定 / 解绑自定义标签（如 `stable`、`canary`），仅 online / offline 版本可操作
- **业务标签（Biz Tags）**：在侧边栏卡片中添加或移除业务分类标签，用于列表页的筛选和分类展示

### 3.3. Skill 创建与上传

提供三种方式新建 Skill：

- **手动创建**：通过创建对话框填写 Skill 名称、描述和 SKILL.md 内容
- **AI 生成**：输入背景描述，可关联 MCP 工具和对话历史，由 Copilot 流式生成完整 Skill
- **上传 ZIP**：直接上传 Skill ZIP 包，系统自动解析其中的 SKILL.md 和资源文件，创建为新版本

### 3.4. Skill 优化

在详情页可对已有 Skill 进行 AI 辅助优化：

- 选择要优化的目标文件（SKILL.md 或资源文件）
- 输入优化目标描述
- 可关联 MCP 工具和对话历史作为优化上下文
- Copilot 流式输出优化后的内容，支持一键应用

> 3.3 的 AI 生成和 3.4 的 AI 优化功能由 Copilot 提供支持，使用前需配置大模型 API Key。可通过环境变量 `COPILOT_API_KEY`（推荐）或在控制台 **设置中心** 页面配置。

## 4. CLI / API / SDK 参考

Skill 管理提供多种接入方式，详细用法请参考各自的专项文档。

### 4.1. nacos-cli

[nacos-cli](../../admin/nacos-cli.md) 是 Skill 管理的命令行工具，提供 Skill 的搜索、安装、上传和同步功能。详细的安装配置和 Skill 管理命令请参考 [Nacos CLI 使用指南 - AI 技能管理](../../admin/nacos-cli.md#51-ai-技能管理-)。

### 4.2. REST API

Skill 管理提供三层 REST API：

| API 层 | 说明 | 文档链接 |
|--------|------|----------|
| **Client API** | 客户端运行时查询/下载 Skill（支持匿名访问） | [客户端API - 下载 Skill](../open-api.md#34-下载-skill) |
| **Console API** | 控制台管理操作（需登录认证） | [控制台API - Skills 管理](../../admin/console-api.md#7-skills-管理) |
| **Admin API** | 集群内部管理接口 | [运维API - AI Skills 管理](../../admin/admin-api.md#7-ai-skills-管理) |

其中，Skill 列表查询的返回项包含 `frontMatter` 字段，内容为展示版本 `SKILL.md` YAML front matter 解析后的键值对；当对应版本不存在、`SKILL.md` 无 front matter 或解析失败时，该字段可能为空。

### 4.3. Java SDK

Nacos 提供两种 Java SDK 用于 Skill 的程序化管理：

| SDK | 适用场景 | 文档链接 |
|-----|---------|----------|
| **nacos-client** | 客户端运行时加载和订阅 Skill | [Java SDK - Skill 能力](../java-sdk/usage.md#8-skill-能力) |
| **nacos-maintainer-client** | 运维管理操作（创建、发布、上下线等），适用于自动化运维和 CI/CD | [运维SDK - Skill 能力](../../admin/maintainer-sdk.md#9-skill-能力) |
