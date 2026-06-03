---
title: "SkillClaw × Nacos：从一次 Agent 会话到可治理 Skill Registry 的自动演化闭环"
description: "SkillClaw × Nacos：从一次 Agent 会话到可治理 Skill Registry 的自动演化闭环"
date: "2026-06-03"
category: "article"
keywords: ["Nacos"]
authors: "阿里云高级工程师"
---

作者：墨松



Agent 越来越强。但它的经验，还只属于你一个人。

## Agent 与 Skill：一场正在发生的变革
从 Claude Code、OpenClaw 到各种 Agent，从 MCP 生态到 AgentSpec 标准，AI Agent 正在以前所未有的速度进入日常工作。它们已经能写代码、排障、读文档、执行命令——但这只是第一步。

真正让 Agent 能力产生差异化的，是 **Skill**。一个<font style="color:rgb(20, 20, 20);">编程 Agent 是否注入项目规范 Skill，产出质量天差地别</font>；一个加载了排障 SOP Skill 的运维 Agent，不再需要从零推理——答案已经在 Skill 里了。Skill 正成为 Agent 时代的核心竞争力。

然而，这里还有两个关键问题没有真正解决。

## 两个问题：经验的产生与共享
### 产生之困：好 Skill 为何难以诞生
![](https://img.alicdn.com/imgextra/i1/O1CN01bP3HVC1f8BxeDzhbT_!!6000000003961-2-tps-1448-1086.png)

Agent 已经能写代码、排障、生成文档。但一次真实任务中沉淀下来的经验，却很难从「一次个人的成功实践」转化为可复用的 Skill。

许多 Agent 应用已能调用工具、读取文件、修改代码，也能通过 prompt 或 Skill 注入领域能力。但问题在于，这些能力要么是静态配置的，要么即便在使用中得到了优化，也只是留在本地的 memory 里，没有形成可复用的团队资产。

**真实经验往往来自任务现场——不是在设计文档里想出来的，而是在实战中试出来的**：

+ 某类问题应该先检查哪些上下文；
+ 某个工具调用前需要做什么前置判断；
+ 哪种输出格式更容易被团队接受；
+ 某个失败案例说明原有 Skill 还缺少一条约束；
+ 某个团队已形成稳定流程，但尚未写成可复用资产。

这些场景反复出现，但经验始终停留在当事人的脑中。以排障为例，踩过几次坑之后你自然知道先看哪里、后查什么；以周报为例，写过几轮之后你会摸索出一套团队最认可的格式。但换一个人遇到同样的问题，还是得从头再来——Agent 的价值就无法放大。

**核心矛盾：经验每天都在产生，却没有机制把它从一次会话中提取出来、固化为可复用的 Skill。**

### 共享之困：有了 Skill，团队怎么用上
![](https://img.alicdn.com/imgextra/i4/O1CN01WJOho61P0pkI0ECMV_!!6000000001779-2-tps-1448-1086.png)

即使我们把经验提炼成了 Skill，第二个问题随之而来：**这个 Skill 怎么被团队其他人发现和使用？**

如果 Skill 只是本地目录里的文件，它仍然停留在个人机器上。一旦进入团队协作场景，核心挑战就变成了：

+ 谁维护这个 Skill？
+ 哪个版本是稳定的？
+ 自动生成的内容能不能直接分发？
+ 出了问题怎么回滚？
+ 团队其他人怎么发现并拉取？

经验一旦只留在本地，就只能在一个人身上发挥作用。更大的价值来自团队复用：一个人踩过的坑、总结出的流程、验证过的做法，需要能沉淀下来，并**让团队里的下一个人不需要再踩一遍**。

**核心矛盾：Skill 已经产生，却没有一个团队级的 Registry 来承接它的版本、审核、分发和治理。**

---

SkillClaw 与 Nacos 这两个开源项目，分别从不同切入点回应了上述问题——SkillClaw 聚焦 Agent 运行时，解决「经验如何从真实会话中生长为可复用 Skill」；Nacos 聚焦团队资产，解决「Skill 如何被安全地注册、管理、审核与分发」。下面逐一介绍。

## SkillClaw：从真实会话中提炼经验
![](https://img.alicdn.com/imgextra/i4/O1CN01jfWpDi1mdylBvgYWT_!!6000000004978-2-tps-1672-941.png)

<font style="color:rgb(20, 20, 20);">SkillClaw 是高德技术团队提出的一个框架，论文 </font>[<font style="color:#117CEE;">《SkillClaw: Let Skills Evolve Collectively with Agentic Evolver》</font>](https://arxiv.org/abs/2604.08377)<font style="color:rgb(20, 20, 20);"> 已在 arXiv 发表，代码在</font><font style="color:#117CEE;"> </font>[<font style="color:#117CEE;">GitHub</font>](https://github.com/AMAP-ML/SkillClaw)<font style="color:rgb(20, 20, 20);"> 开源。</font>

<font style="color:rgb(20, 20, 20);">它</font>定位于 Agent 运行时，通过本地 proxy 接管 Agent 的模型调用，在上下文中注入可用的 Skill 目录，并记录 Agent 执行任务时的关键过程：会话 turn、工具调用、工具结果、错误、Skill 命中、修改内容和评分信息。Evolve Server 基于这些数据来判断：这次任务里是否有可复用经验？已有 Skill 是否需要改进？是否应生成一个新 Skill？

因此，SkillClaw 解决的是 **「经验如何产生」** 的问题。

它不要求每次都手写 Skill，而是让 Skill 从真实工作流中逐步长出来。Agent 做过的任务越多，越容易沉淀出贴合真实场景的 Skill。这意味着：

+ 可以从真实 Agent 使用数据中发现可复用模式，并将其沉淀为可复用的 Skill；
+ 可以持续改进已有 Skill，而不是每次重新写 prompt；
+ 可以为不同 Agent 客户端提供统一的 Skill 生成和同步入口。

---

## Nacos AI Registry：让 Skill 进入团队共享体系
![](https://img.alicdn.com/imgextra/i1/O1CN01jAqZuD1FGGwGXU7XL_!!6000000000459-2-tps-1672-941.png)

[**Nacos AI Registry**](https://github.com/alibaba/nacos) 回答了第二个问题。

在 Nacos 中，Skill 作为一种 AI Resource，可以注册、管理。它有版本、标签，可以处于 draft、reviewing、online 等状态，也可以进入 Pipeline 审核流程，并通过 label 分发给不同运行时。

这让 Skill 从「个人经验文件」变成「团队可治理资源」：

+ 可通过`latest` 标签拉取最新 skill，也可以自定义标签；
+ draft / reviewing / online — 承接自动演化的候选结果；
+ 审计与 Trace — 记录谁创建、谁发布、为什么发布；
+ 统一 Registry — 团队成员可从中发现、拉取和复用 Skill。

Nacos 解决的是 **「经验如何共享」** 的问题。

---

## 1+1>2：让产生、治理、分发形成闭环
前面分别介绍了 SkillClaw 和 Nacos 各自解决的问题。单独来看，它们已经分别回答了「经验从哪来」和「经验到哪去」；但结合起来，会发挥更大的价值——**产生、治理、分发，三者串成一条闭环，才构成一条可落地的完整链路**。

<font style="color:rgb(20, 20, 20);">正是看到了这一点，SkillClaw 与 Nacos 两个团队决定联合共建，将 SkillClaw 的本地经验提取能力与 Nacos AI Registry 的团队治理能力打通，双方通过共建以下工作：</font>

+ **<font style="color:rgb(20, 20, 20);">Registry 后端对接</font>**<font style="color:rgb(20, 20, 20);">：SkillClaw 内置了 Nacos 作为 Skill Registry 后端，通过简单配置即可将本地生成的候选 Skill 提交到 Nacos，而非仅停留在本地文件或对象存储。</font>
+ **<font style="color:rgb(20, 20, 20);">生命周期治理</font>**<font style="color:rgb(20, 20, 20);">：SkillClaw 自动生成的候选 Skill 默认进入 Nacos 的 Skill 生命周期流程，经过 draft → review → online 的完整治理流程，不会直接穿透到线上。</font>
+ **<font style="color:rgb(20, 20, 20);">版本与标签分发</font>**<font style="color:rgb(20, 20, 20);">：通过 Nacos 的 label 机制管理 Skill 版本，SkillClaw 客户端按标签（如 </font>`<font style="color:rgb(20, 20, 20);">latest</font>`<font style="color:rgb(20, 20, 20);">）拉取并同步到本地 Skill 路径，Agent 启动时自动 reload。</font>

<font style="color:rgb(20, 20, 20);">形成了从 Memory 到 Skill Registry 的完整演化闭环，</font>下面先看整个闭环如何运转，再看治理如何保障。

![](https://img.alicdn.com/imgextra/i2/O1CN01jQalzG1xpOP5UIDYo_!!6000000006492-2-tps-1672-941.png)

### 闭环运转：<font style="color:rgb(0, 0, 0);">SkillClaw 产生 Skill，Nacos 管理与分发 Skill</font>
SkillClaw 负责让经验从真实会话中生长出来，Nacos 负责让这些经验安全地进入团队共享体系。结合起来看，**一个负责产生，一个负责传播，形成一个完整的演化闭环。**

在 SkillClaw × Nacos 的组合里：

+ SkillClaw 从真实任务中提炼候选 Skill；
+ Nacos 承接 draft → review → online 的全生命周期治理；
+ 自动生成与人工审核结合，既保证效率又保证质量；
+ Agent 运行时只读取 Skill，不持有发布和删除权限。

简单说：**SkillClaw 把个人使用 Agent 时的经验转化为 Skill，Nacos 把这些 Skill 变成团队可共享、可治理的 AI 资源。**

这不是一个「把文件上传到存储桶」的辅助工具，而是一条面向团队协作场景的、Agent Skill 持续演化的完整链路。

### 治理保障：让团队敢于共享
当 Skill 只在个人本地使用时，风险相对可控。但一旦要被团队其他成员和多个 Agent 客户端复用，就不能再只是一个本地文件。

这也是 Nacos 在这条链路中的核心价值之一：它让 SkillClaw 生成的经验不只是「能分享」，而是以受控方式进入团队共享体系。生成的候选 Skill 不会直接分发，而是进入一条受控的治理链路：

1. SkillClaw 生成候选 Skill，不做最终发布决策；
2. Nacos 承接 draft → review → online 的治理流程，以及 label、审计、回滚以及 Skill 的上下线；
3. Agent 运行时只读取 Skill，不持有发布和删除权限；
4. 敏感信息、危险命令、越权工具等检查，通过 Nacos Pipeline 和 skill-scanner 插件接入。

Nacos 的治理能力是可扩展的。它支持 Pipeline 插件机制，团队可以将自己的安全规则、合规规则和质量检查接入发布流程。同时，Nacos 也提供了基于 skill-scanner 的默认插件，承接 Skill 发布前的基础扫描（敏感信息、潜在危险指令、外链、不符合团队规范的内容等）。

这样，SkillClaw 带来从真实会话中持续沉淀经验的能力，Nacos 带来让这些经验安全进入团队共享的治理能力。

<font style="color:rgb(20, 20, 20);">展望未来，SkillClaw 与 Nacos 还将从两个方向进一步深化。</font>

**<font style="color:rgb(20, 20, 20);">一是打通生成链路与会话追踪，让每一次自动演化都有据可查。</font>**<font style="color:rgb(20, 20, 20);"> </font><font style="color:rgb(20, 20, 20);">每次 Skill</font><font style="color:rgb(20, 20, 20);"> </font><font style="color:rgb(20, 20, 20);">的版本变更，都会记录基于哪次会话、用了什么资源、验证得分多少、为什么最终发布。团队不仅能放心使用自动生成的 Skill，还能清楚地回答「这个版本是怎么来的」。</font>

**<font style="color:rgb(20, 20, 20);">二是将自动演化能力从 Skill 扩展到 AgentSpec。</font>**<font style="color:rgb(20, 20, 20);"> AgentSpec 承载了 Agent 的完整装配策略——模型配置、Skill 集合、Prompt 引用、安全策略等。纳入演化闭环后，Agent 的整套行为配置都可以从真实运行中持续生长，而不只是 Skill 在变、其他配置还靠人手写。</font>

---

## QuickStart：从一次周报会话到团队可复用 Skill
<font style="color:rgb(20, 20, 20);">前面介绍了 SkillClaw 与 Nacos 各自的能力，以及两者结合形成的闭环。下面通过一个完整实例，演示整条链路的实际运作：从一次 Claude Code 周报会话出发，自动提炼为可复用 Skill 并注册到 Nacos，再启动新会话直接用一句话复用同一个 Skill。</font>

### Step1. 安装并部署 Nacos
```bash
curl -fsSL https://nacos.io/nacos-installer.sh | bash
```

启动成功后，终端会显示 Nacos 的 ServerPort、Console URL、账户名和密码。**这些信息在后续配置中会反复用到，建议先记下来。**

![](https://img.alicdn.com/imgextra/i3/O1CN01bS5wBw1eesbzL3nL7_!!6000000003897-2-tps-2096-1514.png)

### Step2. 启动 SkillClaw Proxy 和 Evolver
**环境准备**

```bash
# 1. 克隆 SkillClaw
git clone git@github.com:AMAP-ML/SkillClaw.git

# 2. 创建虚拟环境并安装
cd SkillClaw
python3 -m venv .venv
source .venv/bin/activate
pip install -e .

# 3. 设置 LLM 和环境变量
export SKILLCLAW_HOME=$(pwd)
export SKILLCLAW_API_URL="YOUR_API_URL"
export SKILLCLAW_API_KEY="YOUR_API_KEY"
export SKILLCLAW_MODEL_ID="YOUR_MODEL_NAME"

# 4. 填入 Step1 中得到的 Nacos 参数
export SKILLCLAW_DEMO_NACOS_USER_NAME="YOUR_NACOS_USER_NAME"
export SKILLCLAW_DEMO_NACOS_PASSWORD="YOUR_NACOS_PASSWORD"
export SKILLCLAW_DEMO_NACOS_SERVER_PORT="YOUR_NACOS_PORT"
```

**配置并启动 Skill Proxy**

> 以下命令在刚才虚拟环境已激活的终端中继续执行。
>

```bash
mkdir -p /tmp/skillclaw-demo/{skills,records,share,learn,verify}

# ── 大模型配置 ──
skillclaw config llm.api_base "$SKILLCLAW_API_URL"
skillclaw config llm.model_id "$SKILLCLAW_MODEL_ID"
skillclaw config llm.api_key "$SKILLCLAW_API_KEY"
skillclaw config claw_type Claude

# ── Skill Registry 配置（连接 Nacos）──
skillclaw config sharing.enabled true
skillclaw config sharing.skill_backend nacos
skillclaw config sharing.nacos_server http://localhost:$SKILLCLAW_DEMO_NACOS_SERVER_PORT/nacos
skillclaw config sharing.nacos_username "$SKILLCLAW_DEMO_NACOS_USER_NAME"
skillclaw config sharing.nacos_password "$SKILLCLAW_DEMO_NACOS_PASSWORD"
skillclaw config sharing.nacos_publish_mode review
skillclaw config sharing.nacos_label latest

# ── 会话与同步配置 ──
skillclaw config sharing.session_upload_interval 3
skillclaw config sharing.skill_reload_mode poll
skillclaw config sharing.skill_reload_interval_seconds 60
skillclaw config sharing.auto_pull_on_start true

# ── 路径配置 ──
skillclaw config skills.dir /tmp/skillclaw-demo/skills
skillclaw config sharing.local_root /tmp/skillclaw-demo/share
skillclaw config record.dir /tmp/skillclaw-demo/records
skillclaw config evolve.server_url http://127.0.0.1:32218

# 启动 Proxy
skillclaw start --daemon \
  --port 32217 \
  --log-file /tmp/skillclaw-demo/proxy.log

# 确认启动成功
skillclaw status
```

**启动 SkillClaw Evolver**

> 打开新终端，同样先激活虚拟环境。
>

```bash
cd $SKILLCLAW_HOME && source .venv/bin/activate

skillclaw-evolve-server \
  --use-skillclaw-config \
  --port 32218 \
  --interval 60 \
  --verbose \
  > /tmp/skillclaw-demo/evolve.log 2>&1
```

### Step3. 启动 Agent 并对话
> 打开 Claude Code，通过三轮对话逐步教会它周报的格式规范。
>

**第一轮：输入周报内容和格式要求**

在 Claude Code 中输入：

```plain
帮我写本周工作周报到weekly-report.md。飞书格式。#weekly-report
做了：1.完成user-auth-service OAuth2接入(UAT环境)
2.修复JIRA-2847登录超时、JIRA-2851密码重置、JIRA-2860验证码冷却
3.参加PR-1247和PR-1253 review。
格式：标题=[姓名]W{周数}周报；四个section：本周完成/进行中/下周计划/风险与协调；
每条=[代号]描述|关联JIRA|完成度%；结尾写---周报已同步至飞书#weekly-report
```

运行结果:

![](https://img.alicdn.com/imgextra/i4/O1CN012DgI2F1sEEBa48OUu_!!6000000005734-2-tps-3840-2064.png)

**第二轮：修改周报格式**

继续对话，追加格式修正：

```plain
标题必须是一级标题；四个section必须是二级标题；每条任务固定格式：
[代号]描述|关联JIRA链接|完成度%。没有JIRA的也要写关联JIRA|(无)。请重写。
```

运行结果:

![](https://img.alicdn.com/imgextra/i2/O1CN01SZ68b61xLAGNwKVea_!!6000000006426-2-tps-3840-2064.png)

**第三轮：最终修正**

再次追加要求，完成最后一轮迭代：

```plain
JIRA展开为完整链接；OAuth2/登录超时/密码重置/验证码冷却都归UAT；
进行中/下周计划/风险与协调如果没内容写(无)；
最后一行必须精确等于：---周报已同步至飞书#weekly-report。请再次修正。
```

运行结果:

![](https://img.alicdn.com/imgextra/i2/O1CN01xmfASO1NiE2QB7NNT_!!6000000001603-2-tps-3840-2872.png)

> 三轮对话结束后，SkillClaw 会在后台自动完成 session 上传、触发 Evolver 生成 Skill 并提交到 Nacos。
>

### Step4. 查看 Evolver 生成结果
在 **Evolve Server** 的日志中查找以下内容：

```plain
[EvolveServer] uploaded skill ......
```

可以看到 Evolve Server 生成了名为 `weekly-report-md` 的 Skill。

![](https://img.alicdn.com/imgextra/i2/O1CN01dehjRO1DjSx9cYmq0_!!6000000000252-2-tps-3840-2110.png)

### Step5. 登录 Nacos 查看 Skill Registry
使用 Step1 中得到的 Console URL、账户名和密码登录 Nacos 控制台，进入「Skill 管理」页面。

**验收标准**：确认 `weekly-report-md` 出现在 Skill 列表中：

![](https://img.alicdn.com/imgextra/i4/O1CN01uFK1Tc1TgkSHbxi0Q_!!6000000002412-2-tps-3754-1954.png)

点击 Skill 进入详情页，可以看到审核状态为「已通过」，点击下方审核流水线可以查看完整的审核信息：

![](https://img.alicdn.com/imgextra/i2/O1CN01k17Vtn1mZOncR0Oyq_!!6000000004968-2-tps-3746-1964.png)

![](https://img.alicdn.com/imgextra/i2/O1CN014TwNAd1GfIBuvfOGE_!!6000000000649-2-tps-3740-1954.png)

点击发布按钮后，该 Skill 的版本 `0.0.1` 已发布并打上了 `latest` 标签。

![](https://img.alicdn.com/imgextra/i4/O1CN017zMkif1POeLDI1bSs_!!6000000001831-2-tps-3748-1962.png)

### Step6. 新会话测试 Skill 复用
启动 Claude 新会话，仅用一句话描述任务：

```plain
写本周周报到weekly-report.md，做了：1.完成OAuth2接入 2.修复JIRA-2847/2851/2860 3.review PR-1247/1253
```

运行结果:

1. **Claude 自动识别周报场景，读取已生成的「周报 Skill」**

![](https://img.alicdn.com/imgextra/i4/O1CN0137n9Cd1FO3fk8ylo9_!!6000000000476-2-tps-3840-2110.png)

2. **基于 Skill 中的格式和规范，生成符合团队标准的周报**

![](https://img.alicdn.com/imgextra/i1/O1CN01JNXH0Y1dAp0I7ccBq_!!6000000003696-2-tps-3840-2110.png)

> 相比第一步需要 200+ 字的详细 prompt，现在只需一句话——Skill 已自动完成了格式注入和规范约束。
>

### <font style="color:rgb(38, 38, 38);">Step7. 停止并恢复 Agent 配置</font>
验证完成后，可以通过以下指令，关闭 SkillClaw 并恢复 Agent 配置

```bash
skillclaw stop
skillclaw restore claude
```

---

## 更多落地场景：这条链路还能做什么
如果你正在构建 Agent、Agent 平台、AI Registry 或团队知识复用工具，SkillClaw × Nacos 提供了一条从真实使用到团队共享的产品路径。本文 Demo 只展示了从一次会话到新会话的闭环，但实际可落地的场景远不止于此：

**新人接手老项目**：老项目的难点往往不是文档不全，而是规范藏在资深同学的操作习惯里——怎么跑测试、先看哪些配置、哪些模块不能随便改。资深同学带 Agent 跑过几次真实需求或排障后，SkillClaw 能把这些实操经验沉淀成 Skill，Nacos 审核后分发给团队。新同学接手时，不只是拿到文档，而是让 Agent 直接继承团队验证过的做事方式。

**团队反复处理同类线上问题**：登录失败、配置未生效、依赖超时，第一次排查时，总依赖对系统熟悉的人。SkillClaw 记录 Agent 排查过程中的上下文、工具调用和判断顺序，提炼为排障 Skill；经 Nacos 审核发布后，下次值班遇到类似问题，Agent 就能沿着验证过的路径排查，而不是每次从头推理。

**平台能力推广到业务项目**：统一 SDK、配置规范、发布检查这类能力，过去依赖接入文档和人工答疑。平台同学带 Agent 完成几次真实接入后，SkillClaw 提炼接入步骤和常见分支，Nacos 按版本和标签分发给不同业务团队——让平台最佳实践从"文档说明"变成"可被 Agent 执行的 Skill"。

**团队统一 Agent 工作方式**：Claude Code、Cursor 等不同客户端同时使用时，同一个任务可能因个人 prompt 和配置不同而产出不一致。SkillClaw 从多人真实使用中提炼出稳定有效的工作模式，Nacos 将其作为团队能力统一管理分发——团队统一的不是某个客户端，而是 Agent 做事时应该遵循的经验。

**一线支持沉淀高频问题**：安装失败、配置错误、版本不兼容等重复问题，支持同学用 Agent 解决时，SkillClaw 记录判断路径和回答方式，形成支持类 Skill，Nacos 审核发布后即可被整个团队复用，既减少重复答疑，也避免未审核的经验直接扩散。

这些场景的共同点是：Skill 不是凭空设计出来的，而是在真实 Agent 使用中生长出来的；它也不停留在个人本地，而是通过 Nacos 进入团队可审核、可分发、可持续更新的共享体系。

---

## 结语：让个人经验成为团队 AI 资产
SkillClaw 的出发点，不是止步于让个人记录经验，而是让个人在使用 Agent 过程中沉淀的经验，可以被团队其他人复用。Nacos 则让这种复用变得可管理——有版本、有标签、有审核、有分发、有回滚，也有审计。

我们希望实现一个简单的目标：

> **让 Agent 在真实工作中产生的经验，沉淀为 Skill，通过 Nacos 在团队内共享、持续演化。**
>

SkillClaw 让经验从会话中产生，Nacos 让经验进入团队 Registry。一个负责「发现与生成」，一个负责「治理与分发」。

我们也欢迎开源社区一起参与：试用 MVP，提供真实使用场景，反馈你们希望如何管理和分发 Agent Skills——让 Agent 的经验不再散落在一次次个人对话里，而是成为可以被团队共享、持续演化的开源 AI 资产。



## 相关链接
[1] SkillClaw: [https://github.com/AMAP-ML/SkillClaw](https://github.com/AMAP-ML/SkillClaw)  
[2] Nacos: [https://github.com/alibaba/nacos](https://github.com/alibaba/nacos)


