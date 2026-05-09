---
title: "Nacos Skill Registry: 面向个人场景的Skill中心实践"
description: "Nacos Skill Registry: 面向个人场景的Skill中心实践"
date: "2026-05-09"
category: "article"
keywords: ["Nacos"]
authors: "阿里云高级工程师"
---

作者：柳遵飞（翼严）

![](https://img.alicdn.com/imgextra/i4/O1CN01mdK1M51cySIwZqUt7_!!6000000003669-2-tps-1600-900.png)

<font style="color:rgb(107, 114, 128);">Nacos 作为 Skill Registry</font>

<font style="color:rgb(17, 24, 39);">AI Agent 进入日常工作流后，能力复用的载体正在发生变化。</font>

<font style="color:rgb(17, 24, 39);">过去，我们复用的是脚本、配置、模板和文档；现在，越来越多可复用经验会被沉淀成 Skill。一个 Skill 通常包含触发场景、执行步骤、工具调用方式、输出格式、确认规则和任务边界。它不只是提示词，而是一个 Agent 能否稳定完成某类工作的关键资产。</font>

<font style="color:rgb(17, 24, 39);">在 Nacos 3.2 中，Nacos 上线了 Skill Registry 能力，用于帮助企业构建私有化 SkillHub。这个方向很自然：企业内部有大量专属流程、工具链、知识库和安全边界，Skill 需要被统一管理、分发和复用。</font>

<font style="color:rgb(17, 24, 39);">但 Skill Registry 的价值不只在企业私有化场景中成立。</font>

<font style="color:rgb(17, 24, 39);">随着一人公司、OPOC（One Person One Company）和个人 AI 助手的发展，个人和企业的工作边界正在变得模糊。一个个人开发者可能同时维护开源项目、处理客户问题、写文档、做内容发布、管理知识库、跟踪行业信息。这些任务背后同样有大量稳定流程，也同样值得沉淀成 Skill。</font>

<font style="color:rgb(17, 24, 39);">因此，Nacos Skill Registry 也可以用于个人场景：基于外部社区的 Skill 中心做改造，或者把个人工作和生活中的高频流程沉淀成自己的 Skill 中心。无论面向企业还是个人，Skill 都会成为长期积累的核心资产。</font>

<font style="color:rgb(17, 24, 39);">这篇文章记录的是我在日常工作中，把 Nacos Skill Registry 用作个人助手 Skill 中心的一组实践。</font>

## <font style="color:rgb(17, 24, 39);">个人助手为什么需要 Skill 中心</font>
<font style="color:rgb(17, 24, 39);">个人使用多个 Agent 已经很常见。Codex 可以处理代码修改和源码分析，QoderWork 可以辅助工程任务，其他 Agent 可以做文档、搜索、知识库整理或自动化流程。</font>

<font style="color:rgb(17, 24, 39);">工具可以很多，但工作方法不应该散落在每个 Agent 的本地目录里。</font>

<font style="color:rgb(17, 24, 39);">以日常工作为例，下面这些流程都适合沉淀成 Skill：</font>

+ <font style="color:rgb(17, 24, 39);">GitHub issue triage：读取上下文、判断类型、建议标签、生成评论草稿、确认后写入。</font>
+ <font style="color:rgb(17, 24, 39);">GitHub PR review：检查 diff、判断冲突、确认 reviewer 身份、生成 review 建议。</font>
+ <font style="color:rgb(17, 24, 39);">Aone 自动开发：读取 workitem、创建分支、补充评论、推进开发任务。</font>
+ <font style="color:rgb(17, 24, 39);">AI 信息监控：跟踪高信号来源、去重、排序、摘要并生成文章素材。</font>
+ <font style="color:rgb(17, 24, 39);">文档发布：把本地 Markdown、图片和知识库内容整理成可发布版本。</font>

<font style="color:rgb(17, 24, 39);">如果这些 Skill 只存在于某一个 Agent 中，切换 Agent 时就需要重新同步。一个 Agent 中优化过的规则，另一个 Agent 也无法自然获得。时间久了，还会出现多个本地版本，难以判断哪一份才是最新。</font>

<font style="color:rgb(17, 24, 39);">个人 Skill 中心要解决的就是这件事：让个人长期沉淀的工作方法可以被发现、安装、更新和发布，而不是绑定在某一个 Agent 上。</font>

![](https://img.alicdn.com/imgextra/i3/O1CN01hbSkne1VCBFPCSHo0_!!6000000002616-2-tps-1600-900.png)

<font style="color:rgb(107, 114, 128);">多 Agent 共享工作流架构</font>

## <font style="color:rgb(17, 24, 39);">Nacos 在个人 Skill 中心里的角色</font>
<font style="color:rgb(17, 24, 39);">Nacos 原本擅长管理服务注册、配置和发现。放到 Agent Skill 场景中，它可以承担类似的 registry 角色，只是管理对象从服务实例变成了 Skill。</font>

<font style="color:rgb(17, 24, 39);">在个人助手场景中，Nacos 可以做四件事。</font>

<font style="color:rgb(17, 24, 39);">第一，作为 Skill 目录。用户可以查询自己有哪些 Skill，每个 Skill 的描述、版本和适用场景是什么。</font>

<font style="color:rgb(17, 24, 39);">第二，作为安装入口。不同 Agent 可以从同一个 Nacos registry 获取同一份 Skill，而不是各自维护一份副本。</font>

<font style="color:rgb(17, 24, 39);">第三，作为版本管理入口。Skill 在真实任务中被修正后，可以发布新版本，再被其他 Agent 安装或更新。</font>

<font style="color:rgb(17, 24, 39);">第四，作为个人能力资产的沉淀位置。一个人长期使用 Agent 形成的工作方法，不再只是对话上下文里的临时经验，而是可以被保存、复用和持续维护的资产。</font>

<font style="color:rgb(17, 24, 39);">这与企业私有 SkillHub 的逻辑是一致的，只是使用主体从组织变成了个人，管理对象从企业流程扩展到个人工作和生活流程。</font>

![](https://img.alicdn.com/imgextra/i2/O1CN01EENvbt1m135ae480I_!!6000000004893-2-tps-1600-900.png)

<font style="color:rgb(107, 114, 128);">个人 Skill 中心实践场景</font>

## 实践场景
### <font style="color:rgb(17, 24, 39);">实践场景一：社区 Issue Triage</font>
<font style="color:rgb(17, 24, 39);">GitHub issue triage 是最早适合沉淀为 Skill 的场景之一。</font>

<font style="color:rgb(17, 24, 39);">处理社区 issue 时，Agent 不能只根据标题生成回复。它需要读取 issue 描述、评论历史、相关源码或文档，再判断是否需要补充信息、建议标签、给出排查方向，或者准备关闭说明。</font>

<font style="color:rgb(17, 24, 39);">我把 Nacos 和 HiClaw 社区的处理经验整理成一个共享 Skill。两个项目共用一套基本流程，但通过 profile 区分项目差异：</font>

+ <font style="color:rgb(17, 24, 39);">Nacos 有自己的标签体系、模块边界和维护者口吻。</font>
+ <font style="color:rgb(17, 24, 39);">HiClaw 有自己的运行环境、用户问题类型和回复方式。</font>
+ <font style="color:rgb(17, 24, 39);">低信息量 issue 需要轻量回复。</font>
+ <font style="color:rgb(17, 24, 39);">涉及评论、标签、关闭 issue 等外部写操作时，必须先给确认包。</font>

<font style="color:rgb(17, 24, 39);">这个场景说明，Skill 不一定要一项目一份。对于相似流程，可以用一个 Skill 承载公共逻辑，再通过 profile 表达项目差异。</font>

### <font style="color:rgb(17, 24, 39);">实践场景二：PR Review</font>
<font style="color:rgb(17, 24, 39);">PR review 看起来是“读 diff”，实际要处理的规则更多。</font>

<font style="color:rgb(17, 24, 39);">例如：</font>

+ <font style="color:rgb(17, 24, 39);">当前 reviewer 身份需要运行时读取，不能写死账号。</font>
+ <font style="color:rgb(17, 24, 39);">PR 是否存在冲突会影响后续处理方式。</font>
+ <font style="color:rgb(17, 24, 39);">如果已有维护者反馈，需要避免重复评论。</font>
+ <font style="color:rgb(17, 24, 39);">对于需要补充 issue 的 PR，应先走 issue-first gate。</font>
+ <font style="color:rgb(17, 24, 39);">非冲突 PR 通常先生成 briefing 和建议评论，再等待确认。</font>

<font style="color:rgb(17, 24, 39);">这些规则很适合沉淀成 Skill。它让 Agent 在不同仓库、不同 PR 上保持一致的审查顺序和输出方式。</font>

<font style="color:rgb(17, 24, 39);">这里有一个重要经验：Skill 中不要硬编码个人身份。像 reviewer 登录名这类信息，应通过</font><font style="color:rgb(17, 24, 39);"> </font>`gh api user --jq .login`<font style="color:rgb(17, 24, 39);"> </font><font style="color:rgb(17, 24, 39);">等命令在运行时读取。这样 Skill 才能被不同用户和不同 Agent 复用。</font>

### <font style="color:rgb(17, 24, 39);">实践场景三：Aone 自动开发</font>
<font style="color:rgb(17, 24, 39);">Aone workitem 处理也是一个典型的个人工作流程。</font>

<font style="color:rgb(17, 24, 39);">这类流程通常包含读取需求或缺陷、确认当前负责人、创建开发分支、补充评论、推进代码修改等动作。很多步骤会在长期工作中反复出现，不适合每次从头交代。</font>

<font style="color:rgb(17, 24, 39);">把它沉淀成 Skill 后，Agent 可以按照固定流程协助处理 workitem，减少重复说明。</font>

<font style="color:rgb(17, 24, 39);">这个场景也带来一个边界提醒：共享 Skill 中不能出现真实姓名、工号、固定账号、Token、AK/SK 或看起来像凭据的示例。能运行时读取的身份信息就运行时读取，需要示例时使用占位符。</font>

<font style="color:rgb(17, 24, 39);">这个原则同样适用于个人 Skill 中心。个人使用不代表可以把敏感信息写进 Skill。Skill 是能力资产，不应该变成凭据存储。</font>

### <font style="color:rgb(17, 24, 39);">实践场景四：AI 信息监控和内容生成</font>
<font style="color:rgb(17, 24, 39);">AI update monitor 是另一个适合个人 Skill 中心的场景。</font>

<font style="color:rgb(17, 24, 39);">每天跟踪 OpenAI、Anthropic、Google DeepMind、Meta AI、Hugging Face、研究员博客、YouTube、X 等来源，本质上是一套长期重复的信息处理流程：</font>

+ <font style="color:rgb(17, 24, 39);">哪些来源值得关注。</font>
+ <font style="color:rgb(17, 24, 39);">如何去重。</font>
+ <font style="color:rgb(17, 24, 39);">如何判断重要性。</font>
+ <font style="color:rgb(17, 24, 39);">哪些内容值得生成摘要。</font>
+ <font style="color:rgb(17, 24, 39);">哪些内容适合扩展成文章。</font>
+ <font style="color:rgb(17, 24, 39);">如何保存到 Obsidian 或发布目录。</font>

<font style="color:rgb(17, 24, 39);">如果每次都临时让 Agent “帮我看看最近 AI 有什么新东西”，输出会很不稳定。把来源、筛选标准、输出结构和文章生成流程沉淀成 Skill 后，它就变成了个人信息处理能力的一部分。</font>

<font style="color:rgb(17, 24, 39);">这类 Skill 不只面向工作，也可以面向生活：旅行计划、家庭账单整理、阅读清单、健身记录、个人知识库维护，都可以按类似方式沉淀。</font>

## <font style="color:rgb(17, 24, 39);">实践中的几个经验</font>
<font style="color:rgb(17, 24, 39);">第一，</font>`SKILL.md`<font style="color:rgb(17, 24, 39);"> </font><font style="color:rgb(17, 24, 39);">要保持轻量。</font>

<font style="color:rgb(17, 24, 39);">入口文件只放触发条件、核心步骤和验收标准。长模板、项目 profile、评论示例、复杂参考资料放到</font><font style="color:rgb(17, 24, 39);"> </font>`references/`<font style="color:rgb(17, 24, 39);">。这样 Agent 更容易快速读取，也方便后续维护。</font>

<font style="color:rgb(17, 24, 39);">第二，Skill 尽量无状态。</font>

<font style="color:rgb(17, 24, 39);">Skill 描述的是“怎么做事”，运行记录不应该放在 Skill 目录里。已处理的 issue、PR 记录、草稿、确认历史和任务进度，应放在 Agent 无关的用户工作区。这样换 Agent 后仍然可以接续已有任务。</font>

<font style="color:rgb(17, 24, 39);">第三，外部写操作要确认。</font>

<font style="color:rgb(17, 24, 39);">评论、标签、关闭 issue、提交 review、修改远端文档，这些动作会影响外部系统。Agent 可以准备草稿和操作计划，但执行前需要用户确认。</font>

<font style="color:rgb(17, 24, 39);">第四，Skill 需要真实任务验证。</font>

<font style="color:rgb(17, 24, 39);">Skill 写得通顺不代表可用。GitHub triage、PR review、Aone 自动开发这类流程，最好用真实任务验证输出质量，再发布到 registry。</font>

<font style="color:rgb(17, 24, 39);">第五，版本发布后要检查。</font>

<font style="color:rgb(17, 24, 39);">发布 Skill 后，需要通过</font><font style="color:rgb(17, 24, 39);"> </font>`nacos-cli skill-list --name <skill-name>`<font style="color:rgb(17, 24, 39);"> </font><font style="color:rgb(17, 24, 39);">确认新版本可见。不要只停留在本地文件修改。</font>

![](https://img.alicdn.com/imgextra/i3/O1CN01PkC0Yi1hoRjAnudOu_!!6000000004324-2-tps-1600-900.png)

<font style="color:rgb(107, 114, 128);">Skill 生命周期</font>

## <font style="color:rgb(17, 24, 39);">Quick Start：搭建个人 Skill 中心</font>
![](https://img.alicdn.com/imgextra/i3/O1CN01Wmiim027N87D8mMcM_!!6000000007784-2-tps-1600-900.png)

<font style="color:rgb(107, 114, 128);">Quick Start 三步跑通个人 Skill 中心</font>

<font style="color:rgb(17, 24, 39);">下面是一条最小可用路径，适合个人开发者先在本地跑起 Nacos，再让 Agent 具备 Skill Registry 的操作能力，最后完成一次从创建到同步的实践。</font>

### <font style="color:rgb(17, 24, 39);">1. 安装最新版本的 Nacos</font>
<font style="color:rgb(17, 24, 39);">本地一键安装&启动nacos</font>

```plain
curl -fsSL https://nacos.io/nacos-installer.sh | bash
```

以上脚本会自动安装&部署最新版本的nacos，帮助你快速体验nacos功能。

### <font style="color:rgb(17, 24, 39);">2. 安装 nacos-skill-registry Skill</font>
<font style="color:rgb(17, 24, 39);">这一步会把 Nacos Skill Registry 的使用方法安装到 Agent 中，让它知道如何通过</font><font style="color:rgb(17, 24, 39);"> </font>`nacos-cli`<font style="color:rgb(17, 24, 39);"> </font><font style="color:rgb(17, 24, 39);">和 Nacos 交互，包括 Skill 查询、安装、发布、版本同步、冲突合并等操作。</font>

<font style="color:rgb(17, 24, 39);">以 Codex 为例，可以输入一下提示词让 Agent 安装 </font>`nacos-skill-registry`<font style="color:rgb(17, 24, 39);">：</font>

```plain
https://download.nacos.io/SKILL.md 安装一下这个SKILL并运行
```



Agent会引导你初始化本地profile

`nacos-cli`<font style="color:rgb(17, 24, 39);"> </font><font style="color:rgb(17, 24, 39);">使用 profile 管理连接信息。第一次使用时创建默认 profile：</font>

```plain
nacos-cli profile edit
```

<font style="color:rgb(17, 24, 39);">按照指引输入用户名密码完成profile初始化</font>

执行nacos-cli skill-list，<font style="color:rgb(17, 24, 39);">如果能列出 Skill，说明本地连接已经可用。</font>

### <font style="color:rgb(17, 24, 39);">3. 创建一个 Skill 并同步到 Nacos</font>
<font style="color:rgb(17, 24, 39);">接下来可以从一个很小的个人流程开始，例如“每周整理待办”“处理某类工单”“生成固定格式的文章草稿”。不要一开始追求复杂，先让 Agent 帮你创建一个能真实使用的 Skill。</font>

<font style="color:rgb(17, 24, 39);">可以这样对 Agent 说：</font>

```plain
帮我创建一个用于整理每周工作总结的 Skill，创建完成后发布到Nacos
```



<font style="color:rgb(17, 24, 39);">当这个 Skill 后续在本地使用过程中进行迭代优化，可以通过对话让 Agent 同步到 Nacos；如果需要在另外一个agent中(比如Cusor，Qoder)也需要使用这个skill，可以在另外的agent也安装下 </font>`nacos-skill-registry`<font style="color:rgb(17, 24, 39);"> 这个skill，就可以实现多agent skill共享。</font>

## <font style="color:rgb(17, 24, 39);">结语</font>
<font style="color:rgb(17, 24, 39);">Nacos 3.2 的 Skill Registry 能力，首先服务的是企业私有化 SkillHub 场景。但在个人助手和 OPOC 越来越普遍的背景下，个人同样需要自己的 Skill 中心。</font>

<font style="color:rgb(17, 24, 39);">Skill 是个人和企业在 AI Agent 时代沉淀能力的重要载体。企业有企业的流程资产，个人也有个人的工作方法、知识处理方式和生活流程。</font>

<font style="color:rgb(17, 24, 39);">当这些 Skill 可以被 Nacos 管理、安装和更新时，个人助手就不再只是一个临时对话窗口，而会逐渐形成自己的能力库。</font>

<font style="color:rgb(17, 24, 39);">这也是我认为 Nacos Skill Registry 值得面向个人场景继续探索的原因：它不仅适合企业构建私有 SkillHub，也适合个人构建自己的助手能力中心。</font>




