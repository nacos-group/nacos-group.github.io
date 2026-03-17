---
title: "构建 SkillHub，如何赢取用户，还能获得口碑"
description: "构建 SkillHub，如何赢取用户，还能获得口碑"
date: "2026-03-17"
category: "article"
keywords: ["Nacos"]
authors: "CH3CHO"
---

作者：濯光、望宸

OpenClaw 官方提供了 ClawHub，提供了全球最全、最优质的 Claw Skills。但由于存在`Rate limit exceeded` 的安装难题，在国内通过构建镜像站来解决，是一个技术上可行的方案。但是也面临着争议。



## 一、四大争议
### 不稳定：服务可用性无法保障
ClawHub 频繁出现 `Rate limit exceeded`，国内用户安装 Skill 时体验极差。这不是 ClawHub 不努力，而是一个由个人开发者运营的社区平台，天然难以承受全球级别的流量冲击。OpenClaw 在两周内从零飙升到 17 万星标，ClawHub 的基础设施没能跟上这个速度。



镜像站解决了中国用户的可用性问题，但也引出了新的矛盾——高频抓取导致服务器成本飙升至每月五位数美元。OpenClaw 采用 MIT 协议，镜像在法律上完全合规，但生态的可持续性问题浮出水面：在传统包管理生态中，npm mirror、PyPI 镜像都有成熟的协作惯例，AI Skill 领域还没有建立起这套规范。



对企业来说，这意味着一个根本性风险：你的 Agent 所依赖的 Skill 源，可能因为上游的一次限流、一场纠纷或一次宕机而不可用。

### 不安全：安全建设滞后于生态增长
可用性之外，安全问题更加严峻。2025 年 12 月末，恶意 Skill 就已经开始出现在 ClawHub 上，而当时 OpenClaw 正处于爆发式增长期，ClawHub 尚未建立自动化安全扫描机制。



2026 年 1 月 24 日，安全公司 Koi Security 披露了 **ClawHavoc 事件**：在审计的 2,857 个 Skill 中，341 个（约 11.9%）含有恶意代码，伪装成加密货币交易工具，实际窃取用户的 API Key、钱包私钥、SSH 凭证和浏览器密码。攻击者甚至利用了 OpenClaw 的持久记忆机制，通过修改 SOUL.md 和 MEMORY.md 文件来永久篡改 Agent 行为。



事件发生后，各方快速响应——OpenClaw 与 VirusTotal 合作建立了自动化扫描，任命了专职安全负责人并发布了威胁模型；腾讯 SkillHub 也联合朱雀安全实验室推出了 EdgeOne ClawScan 安全体检工具。这些都是积极的补救措施。



但教训已经很清楚：**生态增长跑在了安全建设前面，攻击者比防御者先到。** 对于企业来说，这个时间差是不可承受的。

### 不可溯源：版本和来源缺乏追踪
当同一个 Skill 同时存在于 ClawHub 和 镜像站上时，哪个版本是最新的？如果 ClawHub 下架了一个有安全问题的 Skill，镜像站多久能同步下架？如果 ClawHub 发布了安全补丁，镜像站的用户什么时候能拿到更新？

镜像站通过高频抓取来保持和 ClawHub 的一致性，但这种"非正式同步"缺乏版本溯源保障。企业无法确认自己使用的 Skill 版本来自哪里、经过了什么修改、是否包含上游的最新安全修复。

### 不可控：发布门槛低，缺乏审核机制
ClawHub 目前的发布门槛是"一个注册满一周的 GitHub 账号"。这是社区生态繁荣的基础——低门槛才能吸引大量开发者贡献 Skill。但 ClawHavoc 事件已经证明，低门槛也意味着恶意 Skill 更容易混入。对于企业生产环境，这样的准入标准远远不够。

---

综合来看，**不稳定、不安全、不可溯源、不可控**——这四个问题不是某个平台的失误，而是社区 Skill 仓库在快速增长期的结构性局限。社区平台的核心使命是降低门槛、促进共享，这和企业对稳定性、安全性、可追溯性、可管控性的要求之间，存在天然的张力。



那么，企业级的 Skill 治理应该怎么做？



## 企业的 Skill 管理的理想形态
这场争议是一个好的反思契机。站在企业开发者的视角，一套可靠的 AI Skill 管理体系至少需要做到以下几点：

### 1. 自主可控：与外部平台解耦
从社区发现了好用的 Skill？可以引入。但引入之后，它应该进入企业自己的注册中心，由自己管理——和外部平台彻底解耦。ClawHavoc 的安全风暴，都不应该影响到你的生产环境。



另外，**企业最有价值的 Skill 往往不是从社区拿来的，而是自己写的。** 内部业务流程、私有 API 对接、行业专有知识——这些 Skill 包含了企业的核心 Know-how 和业务流程，天然不适合放到任何公共平台上。它们需要一个私有的、可管控的内部 Registry 来承载。

![](https://img.alicdn.com/imgextra/i2/O1CN01j0Q2nh1wdecXYE4UZ_!!6000000006331-2-tps-2752-1536.png)

### 2. 纵深防御：安全能力不依赖外部
ClawHavoc 之后，ClawHub 在安全上做了大量投入。但这些毕竟是事后补救。对企业来说，教训很明确：**不能把安全完全寄托于外部平台的进化速度。**

****

在自己的 Registry 层面建立独立的安全能力——不管 Skill 来自哪个平台，进入内部之前都必须经过自主可控的安全检查：Prompt 注入检测、敏感信息识别、权限越界扫描。这不是对社区平台的不信任，而是纵深防御的基本原则。

### 3. 版本溯源：每一次变更可追踪
当同一个 Skill 在 ClawHub 和其他镜像站上同时存在时，版本溯源变得极其困难。但在企业内部，这个问题必须有确定的答案：当前生产环境跑的是哪个版本？谁审批的上线？上一个版本是什么？需要回滚时能不能秒级切换？

### 4. 发布管控：上线必须经过审批
ClawHub 目前的发布门槛是"一个注册满一周的 GitHub 账号"。这对开放社区来说是合理的低门槛，但对企业生产环境来说远远不够。一个 Skill 能不能上生产、谁来批准、内容有没有风险——必须有流程来保障。

## Nacos AI Registry: 企业自己的 Skill Registry
Nacos 在 3.2.x 版本中推出了 **Skill Registry** 能力: 一个企业自主可控的 AI Skill 注册中心。如果说 ClawHub 是社区的 Skill npm，那 Nacos Skill Registry 就是企业私有的 Skill npm。

![](https://img.alicdn.com/imgextra/i1/O1CN014QOfuT1e1UXEX7hYc_!!6000000003811-2-tps-3538-1486.png)

### Skill 全生命周期管理
#### 注册与发现
Skill 支持 JSON 和 Zip 包两种方式注册，Zip 包内包含 SKILL.md 和资源文件——和 ClawHub 的 Skill 格式兼容，社区 Skill 可以零改造引入。注册后支持模糊搜索和精确搜索，方便团队内部发现和复用已有 Skill。Nacos 控制台提供了可视化的 Skill 管理界面，创建、编辑、查看详情都可以在 Web UI 上完成，不需要只靠命令行。

#### 审核流程
Skill 发布不再是"提交即上线"。3.2.0 将引入审核工作流，支持多级审批：

+ 开发者提交 Skill → 审核人审批 → 发布到指定环境
+ 测试环境可配置为直接发布，生产环境强制审批
+ 完整的审批记录留存，满足企业审计合规要求

前文提到 ClawHub 的发布门槛只需"一个注册满一周的 GitHub 账号"，而 Nacos 的审核流程确保每一个进入生产环境的 Skill 都经过了明确的授权。

#### 版本管理与灰度发布
每个 Skill 的每一次变更都有完整的版本记录。配合 Prompt Registry 的标签机制（`stable` / `canary` / `gray`），可以实现灰度发布和秒级回滚。一个典型的使用场景：

1. 开发者发布 Skill v1.1.0，标签绑定为 `canary`
2. 灰度环境的 Agent 自动拉取 `canary` 版本，验证效果
3. 验证通过后，将 `stable` 标签从 v1.0.0 切换到 v1.1.0
4. 生产环境所有 Agent 实时感知变更，自动加载新版本
5. 出了问题？把 `stable` 切回 v1.0.0，秒级回滚，业务无感

前文提到的"每一次变更都留痕"，在这里有了完整的工程化落地。

#### 命名空间隔离
不同团队、不同项目、不同环境的 Skill 通过命名空间天然隔离。开发团队在 `dev` 空间里随便折腾，不会影响 `production` 空间里正在运行的 Agent。企业自研的私有 Skill 和从社区引入的公共 Skill，也可以分开管理、各司其职。

#### 实时推送与动态加载
这是 Nacos 相比其他 Registry 方案最独特的优势。Nacos 本身就是经过大规模验证的配置中心，配置推送能力在 Skill 管理场景下开箱即用——Skill 或 Prompt 在 Registry 中更新后，所有订阅的 Agent 实时收到变更通知，动态加载新内容，**无需重启应用**。在传统方案中，更新一个 Skill 可能要重新部署 Agent；在 Nacos 中，改完即时生效。

#### AI Copilot 辅助能力
Nacos 还内置了 AI Copilot，辅助 Skill 和 Prompt 的开发：

+ **Skill 智能优化**：对已有 Skill 的指令进行分析和改进建议
+ **Skill 自动生成**：根据业务场景描述自动生成 Skill 草稿
+ **Prompt 优化与调试**：流式输出优化建议，帮助开发者快速迭代 Prompt 模板

### nacos-cli：开发者的 Skill 管理利器
光有 Registry 还不够，开发者需要趁手的工具。社区开源了 [nacos-cli](https://github.com/nacos-group/nacos-cli)——专门为 Skill 管理设计的命令行工具。

**安装**

```bash
# Linux / macOS：一行命令安装
curl -fsSL https://nacos.io/nacos-installer.sh | sudo bash -s -- --cli

# 或者通过 npm
npm install -g @nacos-group/cli

# 不想装？npx 直接用
npx @nacos-group/cli --help
```

**日常使用**

```bash
# 列出所有 Skill
nacos-cli skill-list -s 127.0.0.1:8848

# 下载 Skill 到本地
nacos-cli skill-get my-skill -o ~/.skills

# 上传本地 Skill 到 Registry
nacos-cli skill-upload /path/to/skill

# 批量上传一个目录下的所有 Skill
nacos-cli skill-upload --all /path/to/skills

# 实时同步：Registry 中的 Skill 变更时自动同步到本地
nacos-cli skill-sync --all
```

如果你用过 `clawhub install`、`clawhub search`，那 nacos-cli 的体验是类似的——区别在于，你的 Skill 源从公共社区变成了企业自己的 Nacos 集群。nacos-cli 还提供交互式终端模式，支持自动补全，适合日常管理和调试。

### 不只是 Skill：完整的 AI 资产注册中心
在实际的 AI 应用中，Skill 不是孤立存在的——它需要和 Prompt 模板、MCP 工具链、Agent 协作协议配合使用。因此 Nacos AI Registry 在 Skill 之外，还覆盖了完整的 AI 资产管理：

| 资产类型 | 核心能力 |
| --- | --- |
| **Skill Registry** | 注册、版本管理、搜索发现、Zip 导入、CLI 管理 |
| **Prompt Registry** | 多版本发布、标签化灰度、模板变量、实时推送 |
| **MCP Registry** | MCP Server 注册、工具管理、多协议端点适配 |
| **Agent Registry** | A2A Agent Card 管理、版本控制、端点发现 |


所有这些都运行在企业自己的基础设施上，数据不出私有网络，不存在"被镜像"或"被抓取"的问题。

### 3.2.0 正式版即将上线的能力
| 能力 | 解决什么问题 | 对应本文提到的哪个痛点 |
| --- | --- | --- |
| **审核流程** | Skill 发布前的审批工作流，支持多级审批 | ClawHub 发布门槛过低，企业需要管控 |
| **安全扫描** | 自动检测 Prompt 注入、敏感信息等风险 | ClawHavoc 教训：安全不能只靠外部平台 |
| **细粒度权限** | 区分"谁能编辑"和"谁能发布到生产" | 企业上线管控需求 |


每一项能力，都直接回应着这次生态事件中暴露的具体问题。

## 开放生态与企业治理：互补而非替代
ClawHub 作为 OpenClaw 的官方 Skill 注册中心，承担着技能发现、社区共享和生态繁荣的核心角色。



但企业把 Skill 从社区引入生产之后——或者更常见的，企业自己开发了大量内部 Skill 之后——就需要一套不同的体系来管理。ClawHavoc 事件告诉我们生态的安全建设可能滞后于增长速度，**这些外部的不确定性，不应该传导到你的生产环境。**

****

**社区是发现的地方，Registry 是治理的地方。** 两者配合，才是 AI Skill 管理的完整图景。

---

Nacos Skill Registry 及完整 AI Registry 已在 3.2.0-BETA 版本中可用，3.2.0 正式版即将发布。

+ Nacos GitHub：[https://github.com/alibaba/nacos](https://github.com/alibaba/nacos)
+ nacos-cli GitHub：[https://github.com/nacos-group/nacos-cli](https://github.com/nacos-group/nacos-cli)
+ 官方文档：[https://nacos.io](https://nacos.io)

---


