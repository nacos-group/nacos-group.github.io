---
title: "Team 版 OpenClaw：HiClaw 开源，5 分钟完成本地安装"
description: "Team 版 OpenClaw：HiClaw 开源，5 分钟完成本地安装"
date: "2026-03-04"
category: "article"
keywords: ["Nacos"]
authors: "CH3CHO"
---

作者：澄潭、望宸

![](https://img.alicdn.com/imgextra/i3/O1CN012oQYVj1zeWDFWq4y7_!!6000000006739-49-tps-1312-816.webp)



作为模型服务的新入口，OpenClaw 能帮你写代码、查邮件、操作 GitHub、设置定时任务等，这种通过 IM 直接下发指令的交互创新，能给用户带来“爽感”。但当历史指令积压越多、Long Horizon 项目数量越多时，问题就来了：



+ **安全风险**：每个 Agent 都要配置自己的 API Key，GitHub PAT、LLM Key 散落各处。2026 年 1 月的 CVE-2026-25253 漏洞让我们意识到，这种 "self-hackable" 架构在便利的同时，也带来了极大的安全风险。
+ **记忆爆炸：** 一个 Agent 承担太多角色，既要做前端，又做后端，还要写文档。`skills/` 目录越来越乱，`MEMORY.md` 里混杂各种记忆，每次加载都要塞一大堆无关上下文。既浪费 token，又会带来记忆混乱。
+ **多 Agent 协作效率低**：对每个 SubAgent 进行手动配置、手动分配任务、手动同步进度，你想专注于业务指令和输出，但在 Agents 的"保姆"这一角色上，花了大量时间。
+ **移动端体验一言难尽**：想在手机上指挥 Agent 干活，却发现飞书、钉钉的机器人接入流程要几天甚至几周。
+ **配置门槛高：** 即便是资深程序员从安装、配置到使用，可能也需要大半天时间，某鱼上还出现了 OpenClaw 的付费安装项目，提供上门服务。 



如果你也有同感，那 **HiClaw** 就是为此而生的。



## 01 HiClaw 的定位
**HiClaw = OpenClaw 超进化，可以理解为 Team 版的 OpenClaw。**



核心创新是在 **OpenClaw 的基础上，** 引入了 **Manager Agent** 角色。它不直接干活，而是帮你管理 Worker Agent 团队，就像钢铁侠的管家 **贾维斯** 一样。

```plain
┌─────────────────────────────────────────────────────┐
│                   你的本地环境                       │
│  ┌───────────────────────────────────────────────┐ │
│  │           Manager Agent (AI 管家)             │ │
│  │                    ↓ 管理                     │ │
│  │    Worker Alice    Worker Bob    Worker ...   │ │
│  │    (前端开发)       (后端开发)                  │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
         ↑
    你（真人管理员）
    只需做决策，不用当保姆
```



这套管理系统是**按需启用**的，可以灵活选择：

**模式一：直接对话 Manager**

+ 简单任务直接告诉 Manager，它自己处理
+ 适合快速问答、简单操作

****

**模式二：Manager 分派 Worker**

+ 复杂任务由 Manager 拆解，分配给专业 Worker
+ 每个 Worker 有独立的 Skills 和 Memory
+ 技能和记忆**完全隔离**，不会互相污染



除了 Manager Agent 角色外，HiClaw 实现了多项进化，包括：

| 维度 | OpenClaw | HiClaw |
| :---: | :---: | :---: |
| 定位 | 一个或多个 Claw<br/>![](https://img.alicdn.com/imgextra/i3/O1CN01jsjxfq28Zmf0YTCmO_!!6000000007947-2-tps-2754-614.png) | 一个由 Manager 管理的 Claw Team![](https://img.alicdn.com/imgextra/i2/O1CN01J9yun91DjvKXgfL54_!!6000000000253-2-tps-1691-382.png) |
| 部署 | 单进程 | 分布式容器 |
| 拓扑 | 扁平对等 | Manager + Workers |
| 凭证管理 | 每个 Agent 持有 | AI Gateway 集中管理 |
| 模型选择 | 统一模型 | 按 Worker 任务类型分配最优模型 |
| 成本效率 | 简单任务也用昂贵模型 | 简单任务用便宜模型，节省 60-80% |
| Skills | 手动配置 | Manager 按需分配 |
| Memory | 混合存储 | Worker 独立隔离 |
| 通信 | 内部总线 | Matrix 协议 |
| 移动端 | 企业 IM | Element + 多客户端可选 |
| 故障隔离 | 共享进程 | 容器级隔离 |
| 多实例协作 | 不支持 | 通过外部 IM 渠道互联 |
| 外部渠道 | 需自行配置 | 开箱即用（Channel 插件） |




我们将结合这些进化项，一一阐述如何解决 OpenClaw 的落地挑战。



## 02 OpenClaw 的安全风险，HiClaw 如何解
原生 OpenClaw 架构下，每个 Agent 都需要持有真实的 API Key，一旦 Agent 被攻击或意外输出，这些凭证就可能泄露。



HiClaw 的解决方案是：Worker 永远不持有真实凭证。真实的 API Key、GitHub PAT 等凭证存储在 AI Gateway，Worker 调用外部服务时，通过 Gateway 代理。即使 Worker 被攻击，攻击者也拿不到真实凭证。Manager 的安全设计同样严格：它知道 Worker 要做什么任务，但不知道 API Key、GitHub PAT。Manager 的职责是"管理和协调"，不直接执行文件读写、代码编写。

| 维度 | OpenClaw 原生 | HiClaw |
| --- | --- | --- |
| 凭证持有 | 每个 Agent 自己持有 | Worker 只持有 Consumer Token |
| 泄漏途径 | Agent 可直接输出凭证 | Manager 无法访问真实凭证 |
| 攻击面 | 每个 Agent 都是入口 | 只有 Manager 需要防护 |




OpenClaw 有一个很棒的开放技能生态 skills.sh，社区里已经有 80,000+ 个技能可以一键安装，爬虫工具使用方式、主流前端库教程、SEO黑科技...



但是，在原生 OpenClaw 里你可能不敢轻易用它。毕竟一个公开技能库里的 SKILL.md 你没法完全审查，如果某个技能诱导 Agent 输出凭证、执行危险命令，后果不堪设想。因为 Agent 本身就持有你的 API Key 和各种凭证。



得益于 HiClaw 在设计上，每个 Worker 运行在完全隔离的容器里，而且不持有任何真实凭证。开发者们就可以放心让 Claw 去检索和自主安装 skills。

```plain
Worker 能看到什么？
✅ 任务文件、代码仓库、它自己的工作目录
✅ Consumer Token（类似"门禁卡"，只能调用 AI API）
❌ 看不到你的 LLM API Key
❌ 看不到 GitHub PAT
❌ 看不到任何加密凭证
```



此外，HiClaw 给 Worker 内置了 `find-skills` 技能，当 Worker 遇到需要特定领域知识的任务时，它会主动搜索并安装合适的技能：

```plain
Manager 派发任务: "开发一个 Higress WASM Go 插件"
                  ↓
Worker 发现自己缺少工具
                  ↓
skills find higress wasm
  → alibaba/higress@higress-wasm-go-plugin  (3.2K installs)
                  ↓
skills add alibaba/higress@higress-wasm-go-plugin -g -y
                  ↓
技能安装完成，Worker 获得完整的插件开发脚手架和工作流
```



如果你有顾虑，或者有内部技能需要积累，HiClaw 也支持切换到自建私有技能库——只需要在 Manager 里设置一个环境变量：

```plain
SKILLS_API_URL=https://your-private-registry.example.com
```



只要你的私有库实现了和 skills.sh 相同的 API，Worker 就会无缝切换到内部搜索。两种场景下，Worker 的使用方式完全一致。

<font style="color:rgb(240, 246, 252);background-color:rgb(13, 17, 23);"></font>

## **03 OpenClaw 移动端接入难，HiClaw 如何解**
OpenClaw 的移动端体验一言难尽：想在手机上指挥 Agent 干活，却发现飞书、钉钉的机器人接入流程要走公司审批流程，且公司整体会有 bot api 额度限制。



HiClaw 内置 Matrix 服务器，支持多种客户端：

+ **一键安装后直接用**：无需配置飞书/钉钉机器人。
+ **手机上随时指挥**：下载 Matrix 客户端，Element Mobile 或者 FluffyChat。
+ **消息实时推送**：不会折叠到"服务号"。
+ **所有对话可见**：你、Manager、Worker 在同一个 Room，全程透明。



## 04 OpenClaw 的 SubAgent 低效协作，HiClaw 如何解
对每个 SubAgent 进行手动配置、手动分配任务、手动同步进度，你想专注于业务指令和输出，但在 Agents 的"保姆"这一角色上，花了大量时间。

### 共享上下文，无需重复沟通
从 Manager-Worker 的角度看，HiClaw 是一个 **Supervisor 架构**：Manager 作为中心节点协调所有 Worker。但因为基于 Matrix 群聊房间协作，它同时也具备了 **Swarm（蜂群）架构** 的特点。



在 Swarm 模式下，每个 Agent 都能看到群聊房间里的完整上下文：

+ Alice 说"我在做登录页面"。
+ Bob 自动知道前端在做什么，API 设计时可以配合。
+ 不需要 Manager 做额外的信息同步。

### 防惊群设计：按需唤醒
HiClaw 做了**防惊群设计**。避免群里每条消息都触发所有 Agent 去调用 LLM，成本和延迟都会爆炸的情况。

```plain
规则：Agent 只有被 @ 的时候才会触发 LLM 调用
```

+ 群聊消息主要是有意义的沟通信息。
+ Agent 不会因为无关消息被唤醒。
+ 成本可控，响应及时。

### Human in the Loop：全程透明，随时干预
和 OpenClaw 原生的 Sub Agent 系统相比，HiClaw 的 Multi-Agent 系统不仅更易用，而且**更透明**：

![](https://img.alicdn.com/imgextra/i3/O1CN01Tp4CbN1EW0uvkyRKy_!!6000000000358-2-tps-1360-854.png)

**核心优势**：

+ **全程可见**：所有 Agent 的协作过程都在 Matrix 群聊里。
+ **随时介入**：发现问题可以直接 @某个 Agent 修正。
+ **自然交互**：就像在微信群里和一群同事协作。



HiClaw 的 Manager 可以帮你做这些事

| 能力 | 说明 |
| --- | --- |
| **Worker 生命周期管理** | "帮我创建一个前端 Worker" → 自动完成配置、技能分配 |
| **自动分派任务** | 你说目标，Manager 拆解并分配给合适的 Worker |
| **Heartbeat 自动监工** | 定期检查 Worker 状态，发现卡住自动提醒你 |
| **项目群自动拉起** | 为项目创建 Matrix Room，邀请相关人员 |




## 05 OpenClaw 的记忆爆炸，HiClaw 如何解
一个 Agent 承担太多角色，既要做前端，又做后端，还要写文档。`skills/` 目录越来越乱，`MEMORY.md` 里混杂各种记忆，每次加载都要塞一大堆无关上下文。既浪费 token，又会带来记忆混乱。



HiClaw 的一个关键设计：**工作中间产物不发到群聊**。Agent 之间的大量协作（文件交换、代码片段、临时数据），通过底层的 **MinIO 共享文件系统** 完成：

```plain
┌─────────────────────────────────────────────────────────────┐
│                    Matrix 群聊房间                          │
│         只保留有意义的沟通和决策记录                         │
│                   （上下文精简）                             │
└─────────────────────────────────────────────────────────────┘
                            ↑ 有意义的信息
                            │
┌─────────────────────────────────────────────────────────────┐
│                   MinIO 共享文件系统                        │
│         代码、文档、临时文件等大量中间产物                    │
│                  （不污染群聊上下文）                        │
└─────────────────────────────────────────────────────────────┘
```

这样群聊里的上下文始终保持在合理规模，不会因为大量文件交换而迅速膨胀。



假设一个项目需要：

+ 3 次代码开发任务（每个 50k tokens）
+ 10 次信息收集任务（每个 100k tokens）

**原生 OpenClaw**（统一用 Sonnet）：

```plain
代码: 3 × 50k × $3/M = $0.45
信息: 10 × 100k × $3/M = $3.00
总计: $3.45
```

****

**HiClaw**（按任务分配模型）：

```plain
代码: 3 × 50k × $3/M = $0.45 (Sonnet)
信息: 10 × 100k × $0.25/M = $0.25 (Haiku)
总计: $0.70
```

**节省 80% 成本**，同时保证代码质量。



## 06 HiClaw 架构的设计思考
OpenClaw 的设计就像一个完整的生物体：有**大脑**（LLM）、**中枢神经系统**（pi-mono）、**感知器官眼睛和嘴**（各种 Channel）。但原生设计中，大脑和感知器官都是"外接"的，你需要自己去配置 LLM Provider、去对接各种消息渠道。



HiClaw 做了一次"器官移植"手术，把这些外接组件变成**内置器官**：

```plain
┌────────────────────────────────────────────────────────────────────┐
│                         HiClaw All-in-One                          │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                     OpenClaw (pi-mono)                       │ │
│  │                      中枢神经系统                             │ │
│  └──────────────────────────────────────────────────────────────┘ │
│           ↑                              ↑                        │
│  ┌────────────────┐              ┌────────────────┐               │
│  │  Higress AI    │              │   Tuwunel      │               │
│  │  Gateway       │              │   Matrix       │               │
│  │  (大脑接入)     │              │   Server       │               │
│  │                │              │   (感知器官)    │               │
│  │  灵活切换       │              │                │               │
│  │  LLM供应商      │              │  Element Web   │               │
│  │  和模型         │              │  FluffyChat    │               │
│  └────────────────┘              │  (自带客户端)   │               │
│                                  └────────────────┘               │
└────────────────────────────────────────────────────────────────────┘
```

### LLM 接入：Higress AI Gateway
**大脑（LLM）不再外接，而是通过 AI Gateway 灵活管理**：

+ **一个入口，多种模型**：在 Higress 控制台即可切换Qwen、OpenAI、Claude 等不同模型供应商
+ **凭证集中管理**：API Key 只需要配置一次，所有 Agent 共享
+ **按需授权**：每个 Worker 只获得调用权限，永远接触不到真实的 API Key



### 通信接入：内置 Matrix Server
**感知器官也变成内置的**：

+ **Tuwunel Matrix Server**：开箱即用的消息服务器，无需任何配置
+ **自带 Element Web 客户端**：浏览器打开就能对话
+ **移动端友好**：支持 FluffyChat、Element Mobile 等全平台客户端
+ **零对接成本**：不需要申请飞书/钉钉机器人，不需要等待审批

>  换个比喻：OpenClaw 原生就像一台组装电脑，你需要自己买显卡（LLM）、显示器（Channel）然后装驱动。HiClaw 则是一台开箱即用的笔记本，所有外设都集成好了，开机就能干活。
>



HiClaw 集成了多个开源组件（Higress、Tuwunel、MinIO、Element Web...），但不用担心部署复杂度，基于 All-in-One 的思路设计了配置打包，解决配置门槛高的问题。



## 07 快速开始
### 第一步：安装
**<font style="color:rgb(31, 35, 40);">macOS / Linux：</font>**

```bash
bash <(curl -sSL https://higress.ai/hiclaw/install.sh)
```

**<font style="color:rgb(31, 35, 40);">Windows（PowerShell 7+）：</font>**

```bash
Set-ExecutionPolicy Bypass -Scope Process -Force; Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://higress.ai/hiclaw/install.ps1'))
```

这个脚本的特点：

+ **跨平台兼容**：Mac、Linux、Windows 全支持
+ **智能检测**：根据时区自动选择最近的镜像仓库
+ **Docker 封装**：所有组件跑在容器里，屏蔽操作系统差异
+ **最少配置**：只需要一个 LLM API Key，其他都是可选的

****

安装完成后，你会看到：

![](https://img.alicdn.com/imgextra/i4/O1CN01Cu1OME1wkyxCErMYc_!!6000000006347-2-tps-2112-1782.png)



真正的开箱即用，不是"开箱后还要配半天"的那种，包括以下组件：

| 组件 | 端口 | 用途 |
| --- | --- | --- |
| Higress Gateway | 18080 | AI Gateway + 反向代理 |
| Higress Console | 18001 | 模型配置、路由管理 |
| Element Web | 18080 | 对话客户端（浏览器） |
| MinIO | 9000/9001 | 共享文件系统 |


****

### 第二步：打开浏览器，登录开始对话
1. 打开浏览器访问安装时显示的 URL（`[http://127.0.0.1:18088](http://127.0.0.1:18088)`）
2. 输入安装时显示的用户名和密码登录
3. 你会看到一个 "Manager" 的对话

### 第三步：创建你的第一个 Worker
![](https://img.alicdn.com/imgextra/i2/O1CN01d1NJNk1pB4ajfnS7s_!!6000000005321-2-tps-999-912.png)

### 第四步：Manager 分配任务，Worker 完成任务
![](https://img.alicdn.com/imgextra/i4/O1CN01tZTMAm1SCEQmwFIB5_!!6000000002210-2-tps-1556-1234.png)

### 第五步：随时随地在手机上查看进度
1. 下载 **FluffyChat**（iOS/Android/全平台）
2. 登录时选择"其他服务器"，填入你的 Matrix 服务器地址
3. 随时查看 Worker 的进度，随时干预

![](https://img.alicdn.com/imgextra/i4/O1CN01ymacVo23UgAPnvvci_!!6000000007259-2-tps-589-1280.png)

## 08 Showcase：实现一款 SaaS 产品
<font style="color:rgb(31, 35, 40);">假设你想做一个 SaaS 产品——从 idea 到上线到增长，传统上你需要产品、设计、开发、测试、运营……但现在你可以这样：</font>

```plain
你: 帮我创建 4 个 Worker：
    - alex: 产品经理
    - sam: 全栈开发
    - taylor: 内容运营
    - jordan: 数据分析

Manager: 好的，4 个 Worker 已创建，各自有独立的技能和记忆。

你: 启动项目：AI 写作助手 MVP，下周要上线

Manager: 收到，我来规划项目...

         [创建项目群，邀请所有 Worker 加入]
         [起草项目计划]
         
         计划如下，请确认：
         
         Phase 1: 产品定义
         - task-001: 竞品调研 & PRD（alex）
         
         Phase 2: 开发
         - task-002: 技术选型 & 架构（sam，依赖 task-001）
         - task-003: 核心功能开发（sam，依赖 task-002）
         - task-004: 代码审查（alex，依赖 task-003）
         
         Phase 3: 上线准备
         - task-005: 发布素材准备（taylor，依赖 task-001）
         
         确认后我开始分配任务。

你: 确认

Manager: [更新项目状态为 active]
         
         @alex 你有新任务 [task-001]：竞品调研 & PRD
         目标：输出 PRD 文档，明确 MVP 功能边界
         规格：~/hiclaw-fs/shared/tasks/task-001/spec.md
         完成后在项目群 @我 汇报

[1 小时后]

alex: @manager task-001 完成
      PRD 已输出：核心功能包括 AI 续写、多模型切换、历史记录
      结果：~/hiclaw-fs/shared/tasks/task-001/result.md

Manager: [读取 result.md，状态：SUCCESS]
         [更新项目计划，task-001 标记完成]
         
         @sam 你有新任务 [task-002]：技术选型 & 架构
         PRD 参考：~/hiclaw-fs/shared/tasks/task-001/result.md
         
         @taylor 你有新任务 [task-005]：发布素材准备
         产品定位参考：~/hiclaw-fs/shared/tasks/task-001/result.md

[1 小时后]

sam: @manager task-002 完成
     技术栈：Next.js + Vercel + Supabase

Manager: [更新计划，分配 task-003]
         
         @sam 继续开发核心功能 [task-003]

[1 小时后]

sam: @manager task-003 完成，已部署到 Vercel
     Demo 地址：https://xxx.vercel.app

Manager: [更新计划，分配 task-004]
         
         @alex 请验收 [task-004]：产品验收
         测试地址：https://xxx.vercel.app
         对照 PRD 验收功能完整性

[验收中发现问题]

alex: @manager task-004 需要修改
      问题：多模型切换没有引导，用户不知道怎么选
      建议：增加模型对比说明页
      结果：~/hiclaw-fs/shared/tasks/task-004/result.md
      状态：REVISION_NEEDED → 返回 task-003

Manager: [读取 result.md，状态：REVISION_NEEDED]
         [创建修订任务 task-006]
         
         @sam task-004 验收发现问题，需要修改
         
         修改任务 [task-006]：增加模型选择引导页
         反馈详情：~/hiclaw-fs/shared/tasks/task-004/result.md
         完成后 @我 汇报

[修改完成]

sam: @manager task-006 完成，引导页已加上

Manager: [task-006 完成，task-004 重新验收通过]
         [所有开发任务完成]
         
         @你 MVP 开发完成！
         - 代码已部署：https://xxx.vercel.app
         - 产品验收通过
         - 发布素材已就绪
         
         项目计划：~/hiclaw-fs/shared/projects/proj-xxx/plan.md

你: 准备上线。@taylor 明天 Product Hunt 发布

taylor: 收到，已排期。素材已准备完毕。

[上线当天 — Manager 自动检测进度]

Manager: @你 Product Hunt 发布提醒
         当前排名：第 3 名
         Upvotes: 423
         评论数: 87
         
         @jordan 请配置数据埋点

jordan: 收到，开始配置 GA4 + 自定义事件...

[数据就绪后]

jordan: @manager 埋点配置完成
        看板地址：https://analytics.google.com/xxx
        
        首日数据：
        - 注册用户：1,247
        - 次日留存：34%
        - AI 续写使用率：78%
        - 多模型切换使用率：23%

Manager: @你 项目「AI 写作助手 MVP」上线数据日报
         
         核心指标：
         - 首日注册：1,247
         - 次日留存：34%
         - 功能使用：续写 78%，切换 23%
         
         洞察：多模型切换使用率偏低
         建议：@alex 分析原因，优化引导流程

[就这样，Manager 贯穿始终：规划 → 分配 → 监控 → 协调 → 汇报]
```

**<u>一个AI，带着 4 个 AI 员工，干完了一个团队的活。而你只需要躺在沙发上在手机上查看进度，并在关键决策时参与指导。</u>**



HiClaw 保留了 OpenClaw 的核心理念（自然语言对话、Skills 生态、MCP 工具等），同时解决了安全和易用性上的痛点。如果你是：

+ **独立开发者**：一个人想干一个团队的活
+ **OpenClaw 深度用户**：想要更安全、更易用的体验
+ **一人公司创始人**：需要 AI 员工帮你分担工作



HiClaw 就是为你准备的。



HiClaw 是开源项目，基于 Apache 2.0 协议，由 Higress 团队基于 OpenClaw、Higress AI Gateway、Element IM 客户端+Tuwunel IM 服务器（均基于 Matrix 实时通信协议）、MinIO 共享文件系统打造。

+ **GitHub**: [https://github.com/higress-group/hiclaw](https://github.com/higress-group/hiclaw)
+ **文档**: [https://github.com/higress-group/hiclaw/tree/main/docs](https://github.com/higress-group/hiclaw/tree/main/docs)
+ **官网**：[https://higress.ai/hiclaw](https://higress.ai/hiclaw)
+ **钉群**： 163855016601
+ **Discord：**[https://discord.gg/n6mV8xEYUF](https://discord.gg/n6mV8xEYUF)


