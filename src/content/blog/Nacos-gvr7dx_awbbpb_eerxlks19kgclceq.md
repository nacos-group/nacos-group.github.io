---
title: "OpenClaw 不踩坑恶意 Skills ，企业需要自己的Skills Registry：Nacos 3.2 发布"
description: "OpenClaw 不踩坑恶意 Skills ，企业需要自己的Skills Registry：Nacos 3.2 发布"
date: "2026-03-10"
category: "article"
keywords: ["Nacos"]
authors: "CH3CHO"
---

作者：柳遵飞(翼严)，杨翊(席翁)，朱桐(濯光)，陈欣渝(恰橙)，刘鹏(墨松)

OpenClaw 的 ClawHub 市场已有 1w+ Skills，每天还在疯涨——听起来很美，直到大量恶意 Skills 被扒了出来。有个"邮件清理"Skill，装上第一次运行就把你的 .env、SSH 密钥打包发出去了。ClawHub 下载的是裸 zip 包，没签名、没校验、没沙箱，Skill 一加载就继承了 Agent 的全部权限——能读你的文件，能 rm -rf，为所欲为。这就好比你雇了个实习生，没做背调，第一天就给了 root 权限。

所以也就有了 “ ClawHub 一半是毒药” 的说法，企业要用 OpenClaw 或其他 Agent，必须要解决好安全问题，Skills 安全就是 OpenClaw 企业落地一个核心问题。 私有化 Skills Registry 要做的，就是在 Agent 和 Skill 之间加一道安检门——发布前扫描、签名验证、沙箱隔离、权限最小化，让每个 Skill 从"我信你"变成"我验过你"。

Nacos 3.2版本发布了**Skills Registry**，解决这个问题应运而生；



![](https://img.alicdn.com/imgextra/i2/O1CN01czX0LZ1wYcGKjra4c_!!6000000006320-2-tps-3538-1486.png)





2025 年初，Nacos 确定了全面拥抱 AI 的发展路线，并在此方向上持续投入。去年已率先上线 **MCP Registry** 与 **Agent Registry**，为 AI 资源的注册与治理迈出了第一步。



![](https://img.alicdn.com/imgextra/i2/O1CN011p9EWf1itJXaFLx3K_!!6000000004470-2-tps-1801-1010.png)

**Nacos 3.2** 是 Nacos 迈向 AI 时代的一个里程碑式版本（当前为 Beta 版本），本版本主要更新包括：

+ **AI Registry**：在 MCP、Agent 基础上补齐 Prompt Registry 与 Skill Registry，四类资源在控制台统一入口，支持注册、检索、版本管理与命名空间隔离。
+ **Nacos Copilot**：基于 Agentscope-Java 将大模型能力集成进控制台，为 Prompt、Skill 提供结构化优化建议，支持在控制台内完成「编辑—优化—发布」全流程。
+ **nacos-cli**：官方命令行工具，支持配置与 Skill 的查询、发布、上传、同步等操作，便于脚本化、CI/CD 与 Agent 工作流对接。
+ **nacos-setup**：一键安装与部署工具，支持 macOS、Linux、Windows，单机与集群模式均可，降低本地体验与运维门槛。
+ AI生态集成：支持对接openclaw/hiclaw/copaw，cursor/qoder，agentscope-java框架实现skill集成

## 一、Skill Registry：让 Skill 从“散落文件”到“平台统一管理”
Skill 本质是 Agent 可调用的能力包（检索、调 API、执行脚本等）。GitHub 等平台已支持 Skill 的开放共享，而企业内往往需要私有化、可管控的 Skill 注册中心。**Skill Registry** 聚焦私有化 Skill 注册与治理：在实现 Skill 的团队共享与分发基础上，提供企业级能力，包括命名空间与数据隔离、权限管理、数据安全等，与配置、服务一样在控制台完成全生命周期管理。

在 AI Registry 的 Skill 页面中可以完成：

+ Skill 的注册、更新、查看与删除，覆盖基础生命周期。
+ 按名称检索与分页浏览，便于在 Skill 数量较多时快速定位。
+ 支持 ZIP 上传及下载，方便用标准包批量导入导出。
+ 支持按命名空间隔离，多环境、多团队互不干扰。

Skill 与配置、服务一样，具备可查、可追溯、可协作的治理能力。

## <font style="color:rgb(6, 10, 38);">二、 OpenClaw </font>集成 Nacos Skill Regsitry
OpenClaw 作为新一代开源个人 AI 助手，近期因将 AI 从“对话者”进化为“执行者”而备受瞩目。它可以运行于用户本地设备，主打隐私安全与长期记忆，能直接操作电脑、管理日程及自动化处理复杂任务。其核心魅力在于模块化的 **Skills（技能）** 架构，允许开发者无限扩展其能力边界，通过自定义技能轻松连接各类应用与服务。

为了让 OpenClaw 具备从 Nacos 搜索、安装和发布 Skill 的能力，并方便团队内部共享自定义技能，我们开发了 `nacos-skill-registry` 技能。

前提条件：已经根据 [https://openclaw.ai/](https://openclaw.ai/) 部署好openclaw。

以下是使用指南：

#### Step1 安装并启动nacos
**Linux / macOS：**

```bash
curl -fsSL https://nacos.io/nacos-installer.sh | sudo bash
```

**Windows（PowerShell）：**

```powershell
iwr -UseBasicParsing https://nacos.io/nacos-installer.ps1 | iex
```

执行 `sudo nacos-setup -v 3.2.0-BETA` 在本地启动 3.2.0-BETA版本。



#### Step2 安装 nacos-skill-registry 技能
运行以下命令，将插件脚本下载至 OpenClaw 的技能目录，安装该技能后，openclaw将会获取如何管理nacos中的skill：

```bash
curl -s https://download.nacos.io/SKILL.md -o ~/.openclaw/skills/nacos-skill-registry/SKILL.md --create-dirs
```

安装后 OpenClaw 会自动加载，首次使用时会引导你安装 nacos-cli 并配置 Nacos 连接信息。结合第六章的一键安装命令本地快速部署 Nacos ，即可实现对 openclaw 中的 skills 的统一管理。

#### Step3  使用 Nacos Skills Registry 中的技能
在 OpenClaw 中直接用自然语言即可，例如：

+ "Nacos 上有哪些可用的 skill？"
+ "帮我找一个处理 PDF 的 skill"
+ "把 `data-analysis` skill 装好，我马上要用它分析报表。"
+ "把这个新开发的 skill 上传到团队的 Nacos 仓库。"

## 三、AI Registry：四类资源，统一入口
企业内的 AI 资源已由单一模型与接口扩展为多类资产：**MCP**（Model Context Protocol）提供标准化上下文与工具接入，**Agent** 承载任务与工作流，**Prompt** 定义指令与行为边界，**Skill** 封装可复用能力。资源一多，便容易分散在不同系统与团队中，维护归属、检索路径与版本信息难以统一，协作与治理成本随之上升。

Nacos 自 2025 年起将 AI 资源的注册与治理纳入产品方向，先后上线 **MCP Registry** 与 **Agent Registry**。本版本在此基础上补齐 **Prompt Registry** 与 **Skill Registry**，并在控制台统一为 **AI Registry**：注册、检索、版本管理及权限与命名空间与现有 Nacos 能力一致，跨团队复用与多环境隔离均在控制台完成。



## 四、Prompt Registry：从“能写 Prompt”到“能管理 Prompt”
Prompt 是驱动 Agent 行为与输出的核心输入，其质量与一致性直接影响 Agent 的稳定性与可运维性；若仅依赖分散在文档或代码中的片段，难以实现团队共享、多环境一致与变更可追溯。**Prompt Registry** 将 Prompt 纳入平台统一管理：按 Key 建模板、支持变量占位、版本与历史可查，与 Nacos 配置管理的思路一致，仅管理对象由配置项扩展为 Prompt。

本版本中 Prompt Registry 提供完整的生命周期管理：

+ 支持按 Prompt Key 创建模板，并通过 `{{variable}}` 变量占位提升复用性。
+ 发布新版本时可带版本号、描述、提交说明，方便团队协作与变更追溯。
+ 支持按 Key 搜索、分页查看，以及按命名空间隔离，适合多环境并行管理。
+ 支持历史查看与版本迭代，避免线上实际生效版本难以追溯的问题。



## 五、Nacos Copilot：把大模型能力接进控制台
AI 能力正从独立工具形态向产品内置能力演进。Nacos 在 3.2 中将大模型接进控制台，推出 **Nacos Copilot**：基于 **agentscope-java** 接入大模型，在控制台内即可对 Prompt、Skill 做优化，无需在外部工具与平台之间来回切换。

+ **Prompt 优化**：在控制台对 Prompt 进行结构化优化，提升清晰度与可执行性，遵循变量格式与保守优化原则，避免偏离预期语义。
+ **Skill 优化**：针对 Skill 的描述、指令与结构给出改进建议，支持流式输出，便于实时查看与调整。

在 Nacos 内即可完成“编辑—优化—发布”全流程，无需切出控制台。

后续将延伸至配置管理、服务管理等场景，使 AI 能力从零散使用走向系统化应用。



## 六、nacos-setup：本地快速部署
试用 Nacos 或在本机搭建环境时，常需面对安装包选择、配置修改、端口冲突、Java 版本等环节。

**nacos-setup** 是官方的一键安装与部署工具，一条命令完成下载、安装与启动，支持 **macOS、Linux、Windows**，单机与集群都支持。旨在降低本地体验与运维门槛：数分钟内即可在本机完成 Nacos 的安装与启动，并可使用 AI Registry、配置中心与服务发现等能力。

**如何使用**：先通过官方安装脚本安装 nacos-setup 

### Linux/macOS
```markdown
 curl -fsSL https://nacos.io/nacos-installer.sh | sudo bash
```

### Windows (PowerShell)
使用 PowerShell 执行

```markdown
iwr -UseBasicParsing https://nacos.io/nacos-installer.ps1 | iex
```





**单机模式与集群模式**：

+ **单机模式**：适合本地开发、联调或演示，一条命令即可在本机启动一个 Nacos 实例。例如执行 `nacos-setup -v 3.2.0-beta` 安装并启动 3.2 版本；可通过 `-p` 指定端口、`-d` 指定安装目录，使用 `--detach` 后台运行。
+ **集群模式**：适合在本地模拟生产环境或多节点高可用验证。通过 `-c` 指定集群 ID、`-n` 指定节点数量，例如 `nacos-setup -c prod -n 3 -v 3.2.0-beta` 可创建 3 节点集群；支持 `--join` 加入已有集群、`--leave` 移除节点、`--clean` 清理后重建。通过 `--join`、`--leave` 配合不同 `-v` 版本号，可以在集群中逐个节点切换版本，模拟滚动升级、重启等操作，快速验证版本升级的兼容性等问题。更多参数见 [nacos-setup](https://github.com/nacos-group/nacos-setup) 使用说明。



## 七、nacos-cli：命令行里的 Nacos 能力
Agent 与自动化流水线更依赖“执行命令、解析输出”的交互方式，而非在控制台中逐项操作。**nacos-cli** 将配置、Skill、Prompt 等能力以命令行方式暴露：支持通过单条命令完成配置查询、Skill 上传、Prompt 拉取等操作，便于脚本与 CI/CD 复用，Agent 也可通过执行命令与 Nacos 交互，无需依赖控制台或特定语言 SDK，接入方式统一，利于自动化集成。

**如何使用**：nacos-cli 可以通过一下这两种方式集成：

1. 通过官方安装脚本单独安装 nacos-cli，安装后在终端配置 Nacos 地址即可使用。
Linux / macOS：	

```bash
curl -fsSL https://nacos.io/nacos-installer.sh | sudo bash -s -- --cli
```

Windows（PowerShell）：	

```powershell
iwr -UseBasicParsing https://nacos.io/nacos-installer.ps1 -OutFile $env:TEMP\nacos-installer.ps1; & $env:TEMP\nacos-installer.ps1 -cli; Remove-Item $env:TEMP\nacos-installer.ps1
```

2. 如果你有 Node.js 环境，也可以通过 npm ：
    - npm 全局安装

```java
npm install -g @nacos-group/cli
nacos-cli --help
```

npx 免安装直接使用

```java
npx @nacos-group/cli --help
```

   Skill 上传、下载、同步等操作示例见下文「快速开始」。更多用法见 [nacos-cli](https://github.com/nacos-group/nacos-cli)。

**当前能力**：

+ **配置中心**：支持配置的列表（`config-list`）、查询（`config-get`）、发布（`config-set`）等基础操作。
+ **Skill Registry**：支持 Skill 的列表、拉取、上传、同步等（如 `skill-list`、`skill-get`、`skill-upload`、`skill-sync`），支持配置文件和交互模式，便于脚本化与流水线集成。



## 八、快速开始
以下通过「本地一键安装 → 控制台管理 Prompt/Skill、开启 Copilot → nacos-cli 操作 Skill」进行最小化演示，便于快速体验 3.2 版本的 AI Registry 能力。

### 安装 Nacos
通过官方一键安装脚本安装 Nacos，支持单机与集群。

**Linux / macOS：**

```bash
curl -fsSL https://nacos.io/nacos-installer.sh | sudo bash
```

**Windows（PowerShell）：**

```powershell
     iwr -UseBasicParsing https://nacos.io/nacos-installer.ps1 | iex
```

执行 `sudo nacos-setup -v 3.2-BETA` 即可安装并启动 Nacos 3.2 的beta版本。

启动成功后浏览器将打开登录页，默认用户名为 `nacos`，密码会自动生成并复制至剪贴板，输入用户名nacos并粘贴密码登录后，即可在控制台看到 **AI Registry** 入口。

### 启用 Nacos Copilot
**Nacos Copilot** 借助大模型能力为 Prompt、Skill 提供优化建议，因此需配置访问大模型的 LLM 访问凭证（如 API Key）。

配置方式任选其一即可：

+ **方式一**：在控制台 **设置（Setting）** 中手动填入 API Key 并保存；
+ **方式二**：在 Nacos 所在环境配置环境变量 `COPILOT_API_KEY`，然后重启 Nacos 使配置生效。

> **说明**：当前 Beta 版本暂时仅对接阿里千问系列模型，后续将支持更多大模型厂商。
>

### 体验 AI Registry
登录控制台后，在左侧菜单进入 **AI Registry**，可分别体验 **Prompt Registry** 与 **Skill Registry**：

+ **Prompt Registry**：在「Prompt」页签中可创建 Prompt（按 Key 建模板、使用 `{{variable}}` 变量占位）、编辑内容、发布新版本并填写版本说明，支持按 Key 搜索、分页查看与命名空间隔离；在历史版本中可查看迭代记录与回溯。
+ **Skill Registry**：在「Skill」页签中可注册或上传 Skill（支持 ZIP 包）、按名称检索与分页浏览、下载到本地；支持按命名空间隔离，便于多环境、多团队管理。创建、更新、删除等操作均在控制台完成，与配置、服务保持一致的治理体验。

若已启用 **Nacos Copilot**（见上文「启用 Nacos Copilot」），还可在 Prompt、Skill 的编辑页中体验 **Prompt 优化**与 **Skill 优化**功能：对当前内容发起优化后，由大模型给出结构化改进建议，支持流式输出，便于在控制台内完成「编辑—优化—发布」全流程。

### 通过 nacos-cli 连接 Nacos
通过 nacos-setup 启动的 Nacos 启用了鉴权，使用 [nacos-cli](https://github.com/nacos-group/nacos-cli) 连接时**需要指定密码**。在命令中通过 `-p` 指定密码即可连接，示例：`nacos-cli -p <密码>` ,密码可在 第一步中的终端中获取。

连接成功后，可通过以下命令进行 Skill 的基础管理：

+ **skill-list**：查看 Nacos 上的 Skill 列表；
+ **skill-get**：按名称拉取单个 Skill；
+ **skill-upload**：将本地目录中的 Skill 上传至 Nacos；
+ **skill-sync**：将 Nacos 上指定的 Skill 从服务端同步至本地目录，便于在 AI 工具中直接使用。

配置的查询、发布等可通过 `config-list`、`config-get`、`config-set` 等命令完成。更多命令与参数见 [nacos-cli](https://github.com/nacos-group/nacos-cli) 使用说明。

> **说明**：除 `-p` 指定密码外，还可通过 `-h` 指定服务地址、`--port` 指定端口、`--conf` 指定配置文件路径等，配置文件内可填写服务地址、端口、用户名、密码、命名空间等，适用于需固定连接信息的场景。
>

## 九、其他AI生态集成
### AI Coding Agent （Qoder、Cursor、Claude等）集成 nacos-skills-Registry
当前主流 AI coding CLI（Qoder、Cursor、Claude Code、Gemini CLI 等）都支持 Skill 机制，可以通过安装 Skill 来扩展 AI 的能力。

`<font style="color:rgb(6, 10, 38);">nacos-skill-registry</font>`<font style="color:rgb(6, 10, 38);">可以</font>让你的 AI coding CLI 具备从 Nacos 搜索、安装和发布 Skill 的能力，方便团队共享 Skill。

**安装**

```bash
curl -s https://download.nacos.io/SKILL.md -o ~/.skills/nacos-skill-registry/SKILL.md --create-dirs
```

安装后 AI coding CLI 会自动加载，首次使用时会引导你安装 nacos-cli 并配置 Nacos 连接信息。

**使用**

在 AI coding CLI 中直接用自然语言即可，例如：

+ "Nacos 上有哪些可用的 skill？"
+ "帮我找一个代码审查相关的 skill"
+ "安装 code-review 这个 skill"
+ "把我写的 skill 发布到 Nacos"

在 Cursor 所在环境安装并配置 **nacos-cli** 后，终端可直接调用 Nacos 完成配置与 Skill 的读写；Nacos 内置的 **nacos-skill** 可从控制台或通过 `skill-sync` 同步到 Cursor 的本地 Skill 目录，Cursor 加载后即可在编辑器内通过自然语言或工具调用 Nacos 的配置与 Skill。终端侧通过 nacos-cli、对话与工作流侧通过 nacos-skill，二者配合即可在 Cursor 内完成配置管理与 Skill 管理。

**与 Cursor 集成的操作步骤**（以下均在 Cursor 所在环境完成）：

1. **安装并配置 nacos-cli**  
按前文「nacos-cli」章节完成安装，在终端配置 Nacos 服务地址与命名空间（如通过环境变量或 nacos-cli 的 config 命令），使 Cursor 内终端可访问 Nacos。
2. **将 nacos-skill 同步到 Cursor 本地 Skill 目录**  
登录 Nacos 控制台，进入 **AI Registry → Skill**，找到内置的 **nacos-skill**，使用控制台提供的「下载到本地」能力，将 nacos-skill 下载到 Cursor 使用的本地 Skill 目录（即 Cursor 的 skill 根目录，具体路径以 Cursor 文档为准）。也可在终端使用 nacos-cli 的 `skill-sync` 命令，将 nacos-skill 从 Nacos 同步到该目录。
3. **在 Cursor 中加载并使用**  
在 Cursor 中加载已同步的 nacos-skill 后，即可在编辑器内通过自然语言或 Skill 暴露的工具，完成对 Nacos 配置的查询、发布、修改，以及对 Skill 的列表、拉取、上传等管理操作；同时可在 Cursor 终端直接执行 nacos-cli 命令，完成配置与 Skill 的脚本化操作。至此，配置管理与 Skill 管理均可在 Cursor 内完成。

更多 nacos-cli 命令与参数见 [nacos-cli](https://github.com/nacos-group/nacos-cli) 使用说明。

### 兼容 skills.sh 平台
skills.sh 是一个开放的 Agent Skills 生态系统，充当着 Cursor、Claude Code 等 AI 助手的“全球应用商店”，它通过标准化的协议汇聚了海量由社区贡献的高质量工作流与提示词；用户只需访问其官网浏览资源，并利用 `npx skills add` 命令即可一键将 GitHub 上的专业技能（如代码审查、架构设计等）无缝集成到本地环境，从而以极低的成本快速复用全球开发者的智慧，瞬间大幅提升 AI Agent 在特定领域的专业表现。

通过 nacos-cli 和 Nacos Server，可以将 Nacos 打造为团队级 AI Skill 注册中心，与 `npx skills` 生态无缝集成。

**已完成：通过 nacos-cli 上传 Skill 到 Nacos**

支持将通过 `npx skills` 下载到本地的 Skill 上传至 Nacos，实现团队内部的 Skill 集中管理和分发。

+ **使用示例：**

```bash
# 1. 通过 npx skills 下载 Skill
npx skills add my-skill

# 2. 上传到 Nacos
nacos-cli skill-upload ~/.skills/my-skill --config ~/.nacos-cli.conf

# 3. 批量上传整个目录
nacos-cli skill-upload --all ~/.skills --config ~/.nacos-cli.conf

# 4. 团队成员拉取
nacos-cli skill-get my-skill --config ~/.nacos-cli.conf
```

**计划中：Nacos Server 作为 npx skills 的 Registry 后端**

通过 Nacos Server 支持修改 `npx skills` 的 registry URL，使 `npx skills` 命令可直接对接 Nacos，无需 nacos-cli 中转。

+ **目标架构：**

```plain
npx skills find [query]          # 搜索结果包含 Nacos 中的 Skill
npx skills add skill-name        # 直接从 Nacos 拉取 Skill
```

+ **预期效果：**
    - Nacos Server 提供 skills.sh 兼容的 API，`npx skills add` 可直接识别并拉取 Nacos 中的 Skill
    - 搜索、下载操作通过 `npx skills` 原生命令完成，体验与公共 skills.sh 一致
    - 上传仍通过 `nacos-cli skill-upload` 完成（`npx skills` 本身无 publish 能力）

### 4.在 AgentScope Java 中接入 Prompt 与 Skill
即将发布的 Agentscope Java 新版本将支持全面接入 Nacos AI Registry 的 Prompt 与 Skill 能力。若希望在 Java 侧 Agent 中直接使用 Nacos 上管理的 Prompt、Skill，可通过 **Agentscope Java** 与 Nacos 完成接入，在 Agent 运行时按需拉取或订阅，并支持配置变更的实时感知。

**Step1:依赖版本**

建议使用以下版本（与 Nacos 3.2 兼容）：

+ **AgentScope Java**：`1.0.10`，用于在 Agent 中集成Prompt与Skill能力。

Maven 依赖示例：

```xml

<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-client</artifactId>
    <version>3.2.0-BETA</version>
</dependency>

<dependency>
    <groupId>io.agentscope</groupId>
    <artifactId>agentscope-core</artifactId>
    <version>1.0.10</version>
</dependency>
<dependency>
    <groupId>io.agentscope</groupId>
    <artifactId>agentscope-extensions-nacos-prompt</artifactId>
    <version>1.0.10</version>
</dependency>
<dependency>
    <groupId>io.agentscope</groupId>
    <artifactId>agentscope-extensions-nacos-skill</artifactId>
    <version>1.0.10</version>
</dependency>

```

**Step2:构建 AiService**

使用 Nacos 提供的 `AiFactory`，传入连接 Nacos 所需的 `Properties`（至少包含 `serverAddr`、可选 `namespace` 等），即可创建 `AiService` 实例，用于拉取与订阅 Prompt、Skill。示例：

```java
import com.alibaba.nacos.api.ai.AiFactory;
import com.alibaba.nacos.api.ai.AiService;
import com.alibaba.nacos.api.PropertyKeyConst;

Properties properties = new Properties();
properties.put(PropertyKeyConst.SERVER_ADDR, "127.0.0.1:8848");  // Nacos 地址
properties.put(PropertyKeyConst.NAMESPACE, "public");            // 可选，命名空间

AiService aiService = AiFactory.createAiService(properties);
// 后续使用 aiService 获取 / 订阅 Prompt、Skill
```

**Step3:接入 Prompt**

在 agentscope-java 中接入 Nacos 的 Prompt：通过 AiService 等接口，按 Prompt Key 从 Nacos 拉取或订阅已在控制台配置好的 Prompt 模板（含变量占位），在 Agent 逻辑中填入变量后即可使用。支持按需获取与监听变更，便于 Prompt 在 Nacos 侧迭代而 Java 侧无需重启。

```java
import com.alibaba.nacos.api.PropertyKeyConst;
import com.alibaba.nacos.api.config.ConfigFactory;
import com.alibaba.nacos.api.config.ConfigService;
import io.agentscope.core.nacos.prompt.NacosPromptListener;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class Main {
    public static void main(String[] args) throws Exception {

        // 1. 创建 NacosPromptListener
        NacosPromptListener promptListener = new NacosPromptListener(configService);

        // 2. 准备模板变量
        Map<String, String> variables = new HashMap<>();
        variables.put("role", "技术顾问");
        variables.put("domain", "Java开发");
        variables.put("style", "简洁专业");

        // 3. 获取渲染后的 Prompt（支持默认值兜底）
        String defaultPrompt = "你是一个AI助手，请回答用户的问题。";
        String sysPrompt = promptListener.getPrompt("my-agent", variables, defaultPrompt);

        // 4. 用 Prompt 构建 Agent
        ReActAgent agent = ReActAgent.builder()
                .name("MyAgent")
                .sysPrompt(sysPrompt)
                .model(DashScopeChatModel.builder()
                        .apiKey(System.getenv("DASHSCOPE_API_KEY"))
                        .modelName("qwen-plus")
                        .build())
                .memory(new InMemoryMemory())
                .build();

        // 6. 调用 Agent
        Msg response = agent.call(Msg.builder()
                .name("user")
                .role(MsgRole.USER)
                .content(TextBlock.builder().text("你好").build())
                .build()).block();

        System.out.println(response.getFirstContentBlock());
    }
}
```

**Step4:接入 Skill**

在 agentscope-java 中接入 Nacos 的 Skill 有两种常见方式：

+ **方式一：nacos-cli 的 skill-sync + FileSystemSkillRepository**  
使用 nacos-cli 的 `skill-sync` 命令将 Nacos 上指定的 Skill 同步到本地目录，在 agentscope-java 中配置 **FileSystemSkillRepository** 指向该目录，Agent 从本地文件系统加载 Skill，适合「先同步、后本地加载」的离线或脚本化流程。

```java
// 1. 同步指定Skill至本地

// 2. 通过Skill路径，配置FileSystemSkillRepository
FileSystemSkillRepository repository = new FileSystemSkillRepository(skillsBaseDir, false);
if (!repository.skillExists(SKILL_NAME)) {
    // ...    
    return;
}
AgentSkill skill = repository.getSkill(SKILL_NAME);

// 3. 加载使用Skill
Toolkit toolkit = new Toolkit();
SkillBox skillBox = new SkillBox(toolkit);
skillBox.registration().skill(skill).apply();

ReActAgent agent = ReActAgent.builder()
                    // ...
                    .toolkit(toolkit)
                    .skillBox(skillBox)
                    // ...
                    .build();
```

+ **方式二：NacosSkillRepository**  
在 agentscope-java 中直接使用 **NacosSkillRepository**，通过已构建的 AiService（或 Nacos 连接配置）从 Nacos 拉取或订阅 Skill，Agent 运行时从 Nacos 实时获取，支持变更订阅与自动感知，适合需要与 Nacos 保持同步的在线场景。

```java
// 1. 获取指定Skill
NacosSkillRepository repo = new NacosSkillRepository(aiService, "public")
if (repo.skillExists(SKILL_NAME)) {
    AgentSkill skill = repo.getSkill(SKILL_NAME);
    System.out.println("Skill: " + skill.getName() + " - " + skill.getDescription());
} else {
    System.out.println("Skill not found: " + SKILL_NAME);
}
```

具体接入方式与示例可参考 Nacos 与 agentscope-java 的官方文档与示例工程。

### 
## 结语
Nacos 3.2 是 Nacos 迈向 AI 时代的重要一步：在持续做好配置中心与服务发现的基础上，将 **AI Registry**、**Nacos Copilot**、**nacos-cli**、**nacos-setup** 串成一条从「注册与治理」到「优化、消费与落地」的完整链路，帮助开发者在本地与生产环境中更顺畅地管理 Prompt、Skill、MCP、Agent 等 AI 资源。

Skills Registry 是 Nacos 3.x 架构下重要模块，在Agent 安全治理中，Nacos 还会再下个版本继续深化 安全围栏审核，数据细粒度鉴权，Skills 资源审批、Skills 签名等安全特性，面向 Skills 效果也会进行创建 Skills 和验证Skills 的体验优化，也欢迎大家在社区里边反馈需求和问题，我们会及时跟进，可以加入我们的钉钉社区群：115205016856 进行讨论；

过去几年，Nacos 在云原生时代陪伴了大量开发者，成为微服务配置与发现领域的基础设施之一。在 AI 时代，Nacos 将继续服务广大开发者与团队，助力构建稳定、可运维的 AI 基础设施。后续规划将围绕以下方向展开：

+ **AI Registry** 功能持续完善：包括多版本管理、Agent 侧灰度分发、以及 Prompt、Skill、MCP、Agent 等 AI 资源间的整合与联动；
+ 私有化 AI 注册中心的企业级能力建设：包括智能检索、路由、以及安全、升级与合规；
+ **Nacos Copilot** 持续进化：深化 AI 能力在产品中的运用，让优化与推荐更智能、更贴近使用场景。



相关项目：

+ [nacos](https://github.com/alibaba/nacos/)
+ [agentscope-java](https://github.com/agentscope-ai/agentscope-java)
+ [nacos-cli](https://github.com/nacos-group/nacos-cli)
+ [nacos-setup](https://github.com/nacos-group/nacos-setup)


