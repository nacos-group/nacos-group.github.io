---
title: "Nacos 3.2 Skill Registry 正式版发布，让 AI 能力在企业更安全、可控落地"
description: "Nacos 3.2 Skill Registry，让 AI 能力在企业更安全、可控落地"
date: "2026-04-02"
category: "article"
keywords: ["Nacos"]
authors: "阿里云高级工程师"
---

作者：柳遵飞(翼严)  杨翊(席翁) 

## 一 .背景和前言
过去一年，团队内部有过一段时间关于未来是低代码平台还是高代码框架的讨论：

+ 低代码平台：典型代表 Dify，门槛低、流程确定性高，但灵活性受限
+ 高代码框架：核心是 ReAct结构，LLM+Prompt+Tool，由模型自主决策，特点是灵活度强、能充分利用 AI 泛化推理能力，但幻觉问题更突出，Prompt 调试成本很高

不久之后, Anthropic推出Skill， 成为这两者之间的关键平衡点：在保留灵活度的同时，通过能力封装与边界约束，提升 Agent 在特定任务上的确定性与可复用性，收到用户企业广泛应用，而年前OpenClaw 快速出圈，ClawHub、SkillHub 等公开 Skill 市场的推出也如雨后春笋般，Skill规模数万+，生态仍在高速扩张。

然而，繁荣的公开 Skill 市场背后，同时也暴露出各种安全隐患，根据Snyk对ClawHub中的3984个Skill的采样报告，存在安全缺陷的Skill占据36.82%，CRITICAL级别问题13.4%，凭证 Secret泄漏，Prompt注入等问题也有较高比例，这些问题成为企业内落地Agent的重大挑战。

![](https://img.alicdn.com/imgextra/i1/O1CN01kUh5iz1FrN0Vchxu7_!!6000000000540-2-tps-1390-572.png)

Snyk: [https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/)

Cisco: [https://blogs.cisco.com/ai/personal-ai-agents-like-openclaw-are-a-security-nightmare](https://blogs.cisco.com/ai/personal-ai-agents-like-openclaw-are-a-security-nightmare)

## 二.企业落地 Skill 面临核心挑战
根据我们在和包括内部团队和外部企业的交流过程中，各方对Skill在企业内部落地普遍关注的几个方面进行了梳理，主要面临以下挑战：

**安全挑战**：恶意代码、已知漏洞、敏感信息外泄风险持续存在，缺乏有效的准入管控机制。

**权限挑战**：谁可见、谁可用、谁可改、谁可发——职责边界模糊，越权访问难以防范。

**稳定性挑战**：版本混乱、升级不可控、问题难以回滚，影响业务连续性。

**治理挑战**：缺少审计日志、追溯链条不完整、缺乏合规证据链，无法通过监管审查。

这四类问题相互耦合，不能依靠单点能力解决，必须通过平台化治理体系统筹应对。

## 三.Nacos 3.2 Skill Registry：企业级 AI 资源治理平台
Nacos 3.2 推出的私有化 Skill Registry，面向企业生产场景，在 Agent 与 Skill 之间构建「验证后信任」的治理层，将 Skill 的审核、管理、分发与追溯统一纳管，形成完整的企业级 AI 资源控制闭环。

![](https://img.alicdn.com/imgextra/i1/O1CN01tahwwg1bKmN1yYRCX_!!6000000003447-2-tps-1592-745.png)



### 0.Quick Start 快速开始
MacOS/Linux

```plain
curl -fsSL https://nacos.io/nacos-installer.sh |  bash
```



Windows(PowelShell)

```plain
iwr -UseBasicParsing https://nacos.io/nacos-installer.ps1 | iex
```



脚本运行后会自动打开Nacos控制台：

![](https://img.alicdn.com/imgextra/i4/O1CN01rhW4fv1TH6GKtDCLL_!!6000000002356-2-tps-2557-1314.png)



*终端执行 nacos-setup --help 及 nacos-cli --help查看更多功能

### 1.Skill 安全审核流水线
Nacos 3.2 内置开箱即用的安全审核插件，覆盖 10+ 项常用风险扫描，同时提供标准接口支持插件化扩展，满足企业定制化安全策略需求。

审核流程遵循「未通过，不发布」的准入原则，将安全要求从「文档规范」升级为「系统强约束」，彻底消除人为绕过风险。Skill 入库前必须经过可编排、可审计、可升级的审核流程，实现多维扫描、风险分级、审核决策的全流程管控。

![](https://img.alicdn.com/imgextra/i4/O1CN01b0bt8q1KWMvONT8n0_!!6000000001171-2-tps-1757-1001.png)

![](https://img.alicdn.com/imgextra/i2/O1CN01gw7QxQ1K5nx8QG0Ee_!!6000000001113-2-tps-2557-1350.png)

![](https://img.alicdn.com/imgextra/i4/O1CN01x9BZ5T1j2TT0nfErI_!!6000000004490-2-tps-1255-625.png)

### 2.多版本管理与灰度分发
**版本生命周期管理**：支持草稿（DRAFT）、审核中、灰度（GRAY）、正式（FORMAL）、下线等完整生命周期，每个阶段状态明确，版本不可变。

**标签灰度放量**：通过 dev/lastest/stable 等标签绑定版本，精准控制分发范围，支持逐步放量，降低新版本上线风险。

**异常快速回滚**：灰度阶段发现问题，切换标签映射即可实现秒级回滚，无需重新发版，保障业务稳定性。

![](https://img.alicdn.com/imgextra/i1/O1CN01mPhmlO22hfnIhFAyQ_!!6000000007152-2-tps-1919-932.png)

### 3.权限模型与多层隔离
Nacos 3.2 采用三层边界设计，实现细粒度的权限管控：

**RBAC 角色权限**：定义发布者、审核员、只读用户等角色，明确职责边界。

**命名空间隔离**：隔离不同团队、环境与租户，防止越权访问。

**Skill 维度可见性**：支持单 Skill 级别的公开、私有、指定范围开放配置，谁能看、谁能用、谁能改、谁能发，都有明确策略与责任归属。

### 4.全链路审计与追溯
Nacos 3.2 提供完整的审计能力，覆盖 Skill 全生命周期：

+ **上传记录**：谁在何时上传了哪个版本，来源可追溯
+ **审核日志**：谁审核、审核结论、审核时间全程留存
+ **发布记录**：谁发布、发布到哪些 Agent、发布策略存档
+ **调用追溯**：哪些 Agent 调用了哪个版本，问题定位有据可查

只有审计闭环打通，运维、合规、治理才能真正形成体系，满足监管要求。

### 5.多途径 Skill 接入与分发
Nacos 3.2 提供多种灵活的 Skill 接入方式，满足不同场景下的获取和安装需求：

+ **Agent 自主发现**：Nacos 提供引导 Skill，Agent 可通过以下命令自动发现可用能力：

```shell
curl -s https://download.nacos.io/SKILL.md
```

执行后将展示 Skill 安装指南及列表查询方法，帮助 Agent 快速定位和获取所需能力。

+ **CLI 一键安装**：通过 nacos-cli 工具实现 Skill 的快速下载与安装，支持从 Registry 直接拉取并本地部署。

```bash
# 列出所有可用 Skills
nacos-cli skill-list

# 按名称过滤查询
nacos-cli skill-list --name mysql-query --page 1 --size 20

# 下载指定 Skill 到本地
nacos-cli skill-get mysql-query -o ~/.skills
```

详细指令参考 [Nacos CLI 文档](https://nacos.io/docs/latest/manual/admin/nacos-cli/?spm=5238cd80.2ef5001f.0.0.3f613b7ccoPTpP#51-ai-%E6%8A%80%E8%83%BD%E7%AE%A1%E7%90%86)。

+ **Shell 脚本批量拉取**：支持通过 skills.sh 脚本链接 Nacos Registry 批量获取 Skills，适用于自动化部署和 CI/CD 场景。

```bash
# 配置 Nacos Registry 地址
export SKILLS_API_URL=http://${nacos.host}:9080

# 使用 npx 执行 skill 命令安装
npx skills add mysql-query redis-query
```

相关实现详见 [GitHub Issue #14770](https://github.com/alibaba/nacos/issues/14770)。

## 四.开放架构：插件化企业定制扩展
![](https://img.alicdn.com/imgextra/i2/O1CN0112WSsF1gxmAko1TVc_!!6000000004209-2-tps-1747-976.png)



## 五.多Agent协作生态：构建企业私有 AI 管理平台
![](https://intranetproxy.alipay.com/skylark/lark/0/2026/png/2483/1774839214121-14fa9b62-6145-4a7b-8c27-bfb539020e52.png)

Nacos 3.2 作为底层基础设施，与 HiClaw（Agent 执行层）、HiMarket（私有化市场层）形成完整的企业私有 AI 管理平台生态：

+ **HiClaw**：Agent 运行时，消费 Skill、Prompt、AgentSpec 资源
+ **HiMarket**：基于 Nacos 定制的私有化 Skill 市场 + Worker 市场
+ **Nacos**：统一 AI 资源管理(Prompt,Skill,MCP,AgentCard)、治理与插件化扩展

去年9月份，我们畅想配置驱动的Agent网络架构，[https://mp.weixin.qq.com/s/kcMjTTM8UoJgTqZe9w5HGg](https://mp.weixin.qq.com/s/kcMjTTM8UoJgTqZe9w5HGg)，此刻，我们Nacos+Himarket+HiClaw将此架构畅想变为了现实。

## 六.迈向多Agent架构网络的协作中枢
Nacos 3.2 是一个起点，完成了全面拥抱AI时代的第一步。

![](https://img.alicdn.com/imgextra/i2/O1CN01354Q0r1t6jIs2jvX1_!!6000000005853-2-tps-1572-746.png)

我们期望未来Nacos成为企业 AI 时代的资源治理基础设施一部分，成为多Agent架构网络的协作中枢。

![](https://img.alicdn.com/imgextra/i3/O1CN01Pdjbiy1dO6Tbog8Zw_!!6000000003725-2-tps-1841-999.png)

**统一资源控制平面**

整合四大注册中心，统一身份、权限、版本与分发策略，形成企业级一致入口。

**治理能力持续深化**

增强审核、灰度、审计与回滚能力，让每次资源变更可验证、可追溯、可止损。

**场景化智能推荐**

基于场景做 AI 资源推荐，支持 AgentSpec 自动化组装，降低 Agent 构建门槛。

**多Agent协作中枢**

在AgentSpec之上构建Agent Team Spec，形成 基础AI资源+单Agent组装编排+多Agent协作网络构建 ，基于OT协议集成Agent运行时数据，升级Nacos Copilot实现智能数据分析，实现多Agent协作安全可控地自我进化。

### 后续版本规划
Nacos为了实现上述目标，基于社区反馈与路线图规划，AI Registry 将在后续版本中持续演进：

**AI 资源生命周期管理**：引入活跃度检测机制，实现热数据启动加载、冷数据按需延迟加载及自动下线，优化资源占用。

**数据智能层**：基于 OT 协议集成 Tracing 数据，构建无本地存储的 Copilot 智能分析能力，实现 AI 资源运行态可观测。

**全链路审计追溯**：补齐 AI 资源操作的完整审计日志与全链路追溯能力，满足企业合规要求。

**语义智能检索**：基于向量数据库与大模型实现自然语言搜索、AgentSpec 自动化组装与智能路由。

**多协议适配与开放生态**：除适配 A2A Protocol 1.0.0 版本外，还将探索 ACP、Matrix 等主流 Agent 通信协议的对接，支持 AgentCard 字段规范演进与跨平台 Agent 互操作，构建开放的 Agent 协作生态。

**Coding Agent 插件**：分阶段演进 Coding Agent 能力，从 Markdown 指令到 MCP 协议支持，最终提供原生远程 MCP 端点，实现在 Claude Code、Cursor 等工具中直接操作 Nacos 资源。

相关 Issue：[#14801](https://github.com/alibaba/nacos/issues/14801) [#14792](https://github.com/alibaba/nacos/issues/14792) [#14790](https://github.com/alibaba/nacos/issues/14790) [#14789](https://github.com/alibaba/nacos/issues/14789) [#14621](https://github.com/alibaba/nacos/issues/14621) [#14603](https://github.com/alibaba/nacos/issues/14603)

## 七.结语
Nacos过去8年中成为微服务时代的基础设施之一，收到开源社区的开发者广泛地支持，希望Nacos在AI时代也同样和大家结伴同行共同成长，欢迎扫描以下二维码联系到我们。



钉钉群     

![](https://img.alicdn.com/imgextra/i1/O1CN01D3MZC11w30wI4NtV2_!!6000000006251-2-tps-443-449.png)

微信群

![](https://img.alicdn.com/imgextra/i3/O1CN01cFLXnC22FHEola4GD_!!6000000007090-2-tps-465-453.png)



相关链接：

Nacos Github：[https://github.com/alibaba/nacos](https://github.com/alibaba/nacos)

Nacos Cli：[https://github.com/nacos-group/nacos-cli](https://github.com/nacos-group/nacos-cli)

Nacos Installer&Setup：[https://github.com/nacos-group/nacos-setup](https://github.com/nacos-group/nacos-setup)





