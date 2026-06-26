---
title: "多 Agent 时代，如何管理散落在各处的 Skill？"
description: "多 Agent 时代，如何管理散落在各处的 Skill？"
date: "2026-06-26"
category: "article"
keywords: ["Nacos"]
authors: "阿里云高级工程师"
---

作者：墨松

## 你的 Skill 散落在几个地方？
![](https://img.alicdn.com/imgextra/i3/O1CN01XKUIk71E978aHUW8A_!!6000000000308-2-tps-1536-1024.png)

<font style="color:rgb(13, 18, 57);">当前 AI Coding 的发展正处在百花齐放的时代，没有永远的王者。模型越来越强，Cursor、Claude Code、Codex 轮番成为阶段性首选；再加上额度限制、响应延迟等现实问题，开发者早就习惯了“鸡蛋不放在一个篮子里”。</font>

<font style="color:rgb(13, 18, 57);">除了编程工具，各种通用 Agent 也在不断涌现，每出一个新的，总有人第一时间去尝鲜。</font>

<font style="color:rgb(13, 18, 57);">如今，同时使用多个 AI Agent 干活，一边试用刚冒出来的新工具，一边防着正在用的突然掉链子，已经成为这个时代的开发新常态。</font>

<font style="color:rgb(34, 34, 34);">然而，工具可以无缝切换，Skill 却无法自动跟随。在 Codex 中更新过的 Skill，Claude Code 里仍是旧版，Cursor 目录下还可能并存一份同名但内容迥异的副本。起初手动复制尚可忍受，时间一长便陷入混乱：哪份才是最新？该用谁覆盖谁？接入新工具时是否还要重复搬运？</font>

**<font style="color:rgb(34, 34, 34);">这种碎片化的版本管理不仅降低工作效率，更在反复确认中不断消耗人的心力。</font>**

## 一份 Skill，一个中心仓库
<font style="color:rgb(34, 34, 34);">其实社区早就意识到了这个问题，也涌现了不少解法。有人用 Git submodule 或 Monorepo 统一管理，但改个 Prompt 还要走 commit/push/pull 流程，对日常 Coding 来说太重；有人试过 Syncthing 这类通用文件同步工具，但它只懂文件不懂 Skill 语义，双向修改时极易产生覆盖灾难；还有人转向 LangSmith 等 Prompt 管理平台，却发现它们是为 LLM 应用开发设计的，根本不管本地 Agent 配置文件的死活。</font>

<font style="color:rgb(34, 34, 34);">开源社区也出现了一些专门针对 Agent Skill 管理的尝试，有的提供了基础的分类检索与统一索引，让散落的 Prompt 有了归处；有的则聚焦跨项目共享，试图解决同一个 Skill 在多个工程中重复维护的问题。</font>

<font style="color:rgb(34, 34, 34);">这些探索都精准切中了痛点的某个侧面，但试了一圈下来，我发现它们要么解决了“存储”，没解决“自动分发”；要么解决了“共享”，没解决“多 Agent 目录的实时同步与冲突感知”。当你的 Cursor、Claude Code、Codex 同时开着，需要的是改一处就全部生效、且随时知道哪份是最新的——这个“最后一公里”的闭环，依然没有现成的轮子能完整补上。</font>

**<font style="color:rgb(34, 34, 34);">既然现有方案都在“部分解决”，那就自己造一个能彻底闭环的。</font>**

![](https://img.alicdn.com/imgextra/i1/O1CN01dPE1a91XRPf42yEkx_!!6000000002920-2-tps-1447-1087.png)

<font style="color:rgb(34, 34, 34);">这就是 Nacos Skill Sync 的由来。</font>它做的事情可以用一句话概括：**把 Skill 收敛到一个中心仓库，再按需分发给各个 Agent。**

具体来说：

+ 只维护一份**中心仓库**，统一存放 Skill 内容和同步状态
+ 默认用**软链接**让各 Agent 目录指向中心仓库——改一处，全部生效。环境不支持软链接的话，也可以切换到复制模式，由 CLI 负责把内容同步过去
+ **同步状态随时可查**：远端有没有更新、本地有没有改动、是否存在冲突，一眼就知道下一步该干什么

它提供两种模式，可以按需选择：

| 模式 | 一句话概括 | 适合谁 |
| --- | --- | --- |
| **Registry mode** | Nacos AI Registry + 可视化管理 + 跨设备共享 | 想系统管理自己 Skill 库的人，或者需要团队共建 Skill 的场景 |
| **Local mode** | 本地中心仓库 + 软链接/复制同步 + 零服务依赖 | 只想先把本机多个 Agent 的 Skill 统一起来，不想折腾部署 |


两种模式共用一套操作习惯，Local mode 适合先在本机收拢 Skill；Registry mode 则会在对应 profile 下维护独立的 Skill repo 和同步状态。这样不同 profile 的 Skill 不会互相覆盖；真正切换同步来源时，CLI 会先把旧的 profile 的软链接安全落回各 Agent 的本地副本。

**先从 Local mode 用起完全没问题**，后续需要跨设备共享、团队协作或版本治理时，再切到 Registry mode。

### Registry mode：远端 Registry 统一管理
![](https://img.alicdn.com/imgextra/i4/O1CN01R1FT1j1XAT0UAxUB3_!!6000000002883-2-tps-3752-1966.png)

如果你手上有十几个 Skill 在持续迭代，或者团队里几个人都在用同一套 Skill，把它们散放在各自的本地目录里，迟早会出问题——版本不一致、改了没人同步、新成员不知道去哪找。

Registry mode 做的，是把 Skill 放进 Nacos AI Registry 这个统一入口：

+ **可视化**：控制台里浏览、搜索、查看 Skill，不用再翻目录
+ **版本治理**：草稿、审核、发布、回滚、label——个人能追踪每个 Skill 的状态，团队能把高频 Skill 沉淀成稳定版本
+ **跨设备同步**：家里电脑和公司电脑从同一个 Registry 拉 Skill，新设备接入不用再手动整理
+ **双向流通**：远端的可以同步到本地，本地沉淀的也能推上去，不会只留在某一个人的电脑上

一句话：**Skill 从"本地配置文件"变成了可追溯、可共享、可管理的 Registry 资产。**

### Local mode：把本机 Skill 收拢成一份
<font style="color:rgb(34, 34, 34);">Local mode 更轻量——无需接入 Nacos AI Registry，仅在本地构建中心仓库，并默认以软链接方式关联各 Agent 的 Skill 目录。</font>

<font style="color:rgb(34, 34, 34);">其核心目标是消除多 Agent 环境下的 Skill 冗余与版本不一致问题。当</font>**<font style="color:rgb(34, 34, 34);">同一份 Skill 在 Codex、Claude、Qoder、Cursor、Kiro、Lingma 等工具中存在多个副本时，Local mode 将其收敛为单一信源，确保修改一处即可全局生效</font>**<font style="color:rgb(34, 34, 34);">。</font>

目前会自动发现 Codex、Claude、Qoder、QoderWork、Cursor、Kiro、Lingma、CoPaw、OpenClaw，以及通用的 `~/.agents/skills` 和 `~/.skills`；其他目录也可以通过 `skill-sync agent add` 手动加入。

已经散落在各 Agent 目录里的 Skill 也可以逐步纳入中心仓库。处理单个 Skill 时，执行 `skill-sync add <skill>`，CLI 会检查各 Agent 目录里的同名内容，并在有差异时让你选择来源；如果想批量扫描已有目录，确认范围后再执行 `skill-sync add --all`。内容一致的会直接统一，不一致的会停下来让你选择以哪一份为准。

反过来，如果某个 Skill 不想再由 Skill Sync 管理，执行 `skill-sync remove <skill>`；想一次性取消全部同步，可以用 `skill-sync remove --all`。这个操作不会删除 Agent 里的 Skill，而是先把中心仓库内容复制回各 Agent，再移除同步状态。

Local mode 也可以自然升级到 Registry mode。将来想升级到跨设备或团队协作，不用重新整理，绑定一个 profile 就能接入远端。

## 快速上手
### 方式一：Agent 自驱动（推荐）
我们提供了一份标准的 `SKILL.md`，其中完整描述了 `nacos-skill-sync` 的使用规范与交互流程。只需将下方指令发送给 Agent，它便会自动读取该 Skill、检查本地环境并执行同步；遇到模式选择或内容冲突等需人工决策的节点时，会主动暂停并向你确认。

```plain
阅读下面的 Skill，使用它来同步我本地的 Skill：
https://nacos.io/skill-sync/SKILL.md
```

### 方式二：CLI 手动操作
若希望自行控制同步流程，可通过 CLI 完成。

**Registry mode（跨设备 / 团队协作）**

```bash
# 1. 准备 CLI（二选一）
curl -fsSL https://nacos.io/nacos-installer.sh | bash -s -- --cli
# 或者直接使用 npx
npx @nacos-group/cli@latest skill-sync --help

# 2. 配置 CLI profile
npx @nacos-group/cli@latest profile edit test

# 3. 添加 Skill，启动同步，查看状态
npx @nacos-group/cli@latest --profile test skill-sync add pdf
npx @nacos-group/cli@latest --profile test skill-sync start
npx @nacos-group/cli@latest --profile test skill-sync status
```

**Local mode（单机轻量同步，无需 profile）**

```bash
npx @nacos-group/cli skill-sync add pdf
npx @nacos-group/cli skill-sync start
npx @nacos-group/cli skill-sync status
```

## 使用案例
下面两个例子分别对应 Local mode 和 Registry mode：一个从个人本机开始，把高频工作流先收拢起来；另一个面向跨设备和团队协作，把共同规范放进 Registry。

### 案例一：记录工作内容&生成周报 Skill
很多人每天都会在多个 Agent 里处理不同任务：用 Codex 改代码，用 Claude Code 查日志，用 Cursor 补测试。任务做完后，工作记录也跟着散在不同对话里。到周五再回头整理，常常要翻聊天、补背景、合并重复事项，最后写出来的周报还容易变成流水账。

![](https://img.alicdn.com/imgextra/i4/O1CN01pCBJP01u1WR0266FY_!!6000000005977-2-tps-1600-620.png)

这个问题可以先从本机解决：把每天怎么记录、周报怎么合并这些习惯沉淀成一个 `biweekly-work-report` Skill，放在 Local mode 里给本机 Agent 共用。任务结束时记录结果和影响，遇到同主题工作时合并更新，生成周报时保留进展、风险和下周计划。

**使用 Skill Sync 将某个 Agent 创建的**`biweekly-work-report`**同步至所有的 Agent：**

![](https://img.alicdn.com/imgextra/i2/O1CN01TR1bIT1n97hHrsJ43_!!6000000005046-2-tps-3022-1464.png)

**后续所有 Agent 都可以使用这个 Skill：**

**Codex：**

![](https://img.alicdn.com/imgextra/i1/O1CN01u57jnG24XG2IMsmnm_!!6000000007400-2-tps-1988-850.png)

**Claude Code:**

![](https://img.alicdn.com/imgextra/i2/O1CN01dgJCz91OH28yXaCTI_!!6000000001679-2-tps-1352-350.png)

这样做不需要先准备服务端，也不用把私人工作记录同步出去。更关键的是，这不是把 Skill 复制一次就结束：后面在 Codex 里调整了周报字段，Claude Code 和 Cursor 看到的也会是更新后的 `work-report`。

### 案例二：文档统一格式 Skill
团队文档的问题更典型。接口文档、技术方案、故障复盘可能由不同人、不同设备、不同 Agent 生成，标题层级、参数表字段、风险说明和评审清单很容易各写各的。靠口头提醒不稳定，复制模板又经常复制到旧版本。

![](https://img.alicdn.com/imgextra/i3/O1CN01Btj6gr25B6UfqyLUv_!!6000000007487-2-tps-1800-1120.png)

这类格式规范更适合放进 Registry mode。团队可以把技术方案结构、API 参数表字段顺序、术语写法、截图说明和评审检查项整理成一个 `doc-format` Skill。

![](https://img.alicdn.com/imgextra/i4/O1CN01IHlZqp1xiWT2EmbeO_!!6000000006477-2-tps-3750-1954.png)

**使用 Skill Sync 将 AI Registry 中的**`doc-format`**同步至所有多个设备的 Agent：**

![](https://img.alicdn.com/imgextra/i1/O1CN01F6Iwj11Yo8vwrahZf_!!6000000003105-2-tps-3840-1202.png)

**后续不同设备的 Agent 都可以使用这个 Skill：**

**设备 A Codex:**

![](https://img.alicdn.com/imgextra/i2/O1CN01XibX051Q9p8lkjkyB_!!6000000001934-2-tps-2048-936.png)

**设备 B Qoder:**

![](https://img.alicdn.com/imgextra/i1/O1CN012oJMga22Rdwvdh45B_!!6000000007117-2-tps-2028-636.png)

规范更新后，只维护 Registry 里的这一份。公司电脑、家里电脑、新设备，以及团队成员的 Agent 同步后都会继续使用同一套格式。

## 日常维护：看 status 就够了
用起来之后，日常只看一个命令的输出：

```plain
Mode: nacos
Profile: team
Sync daemon: running (pid: 12345)

SKILL   STATUS          AGENTS              NEXT
pdf     Synced          codex,claude,qoder  -
review  Local changes   codex,claude,qoder  auto-upload pending
draft   Uploaded        codex,claude,qoder  waiting publish
block   Upload blocked  codex,claude,qoder  Nacos draft exists; review/clear it, auto-upload will retry
triage  Conflict        codex,claude,qoder  skill-sync resolve triage
```

每个 Skill 什么状态、覆盖了哪些 Agent、下一步该干什么——都在这了。

| 状态 | 意味着什么 |
| --- | --- |
| `Synced` | 一切正常，不用管 |
| `Linked` | Local mode 下已经链接到本地中心仓库 |
| `Local changes` | 本地有改动；开启 auto-upload 时 daemon 会自动上传，关闭时会保留在本地 |
| `Uploaded` | 已上传为草稿，等待审核或发布 |
| `Conflict` | 本地和远端都改了，需要你选一个版本 |
| `Upload blocked` | 远端已有草稿或审核中版本，需要先在 Nacos 里处理；处理后会自动重试 |


遇到冲突也不用慌，`resolve` 命令可以选以远端 Registry、中心仓库还是某个 Agent 的版本为准。**策略默认保守——不会擅自替你做选择，你明确指定了来源才会执行。**

## 让 Skill 有一份可信来源
多 Agent 并行会越来越常见，真正需要管理的，不只是用哪个 Agent，而是这些 Agent 共同依赖的 Skill。

更理想的方式，是把 Skill 放进 Registry：有统一入口，有版本记录，也能在多台设备和团队成员之间共享。Local mode 则提供了一个更轻的入口，不需要先准备服务端，也能先把本机散落的 Skill 收拢起来。

无论从哪种方式开始，目标都是一样的：让 Skill 有一份可信来源。Agent 可以换，Skill 不应该跟着散。

欢迎大家使用 Nacos Skill Sync。如果在使用中发现任何问题，或有更好的改进建议，也欢迎随时反馈给我们。

---

**相关链接**

+ Nacos 开源地址：[github.com/alibaba/nacos](https://github.com/alibaba/nacos)
+ Nacos CLI：[https://github.com/nacos-group/nacos-cli](https://github.com/nacos-group/nacos-cli)
+ Nacos Skill Sync：[https://nacos.io/skill-sync/SKILL.md](https://nacos.io/skill-sync/SKILL.md)


