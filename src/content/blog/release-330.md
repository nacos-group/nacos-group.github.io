---
title: Nacos 3.3.0 正式发布：支持 ARD，完善 Agent 注册发现与 AI 资源管理
keywords: [Nacos, 3.3.0, ARD, RAD, AI Registry, Agent, MCP, Skill, 2.5.5]
description: Nacos 3.3.0 正式发布，支持 ARD 资源发现，完善 Agent 注册发现、MCP 与 Skill 管理，并介绍升级迁移、同期 2.5.5 及 Codex/Qoder 插件预览版。
date: "2026-10-29"
category: announcement
---

Nacos 社区正式发布 3.3.0！

经过 BETA、RC 版本的持续迭代，Nacos 3.3.0 进一步完善 AI Registry 能力，带来协议无关的 Agent 管理与发现、统一的 AI 资源检索，以及更完整的 MCP 和 Skill 生命周期管理。同时，新版本新增 DNS 服务发现，增强实验性的分布式锁，并持续改进配置管理、服务发现、安全性和控制台体验。

## 一、3.3.0 主要变更

Agent 开始跨机器、跨团队部署之后，几个问题会一起冒出来：这个 Agent 有哪些能力、是哪个版本、跑在什么地址上，这些信息变了谁来通知我。团队攒下的 MCP、Skill 和 Prompt 也是类似处境——发布流程不完整，要用的人还不好找。

围绕这些问题，Nacos 3.3.0 带来了以下更新：

- **Agent 注册与发现**：引入协议无关的 Agent 资源模型，支持版本管理和运行端点管理，并通过 RAD（Remote Agent Discovery）发现 Agent、协商传输协议、订阅端点变化，配套提供 Java SDK 与控制台操作。
- **ARD 资源发现**：新增对 ARD（Agentic Resource Discovery）的支持，通过统一入口搜索 Agent、Skill、Prompt 和 MCP 等资源，支持关键词检索、可选的向量检索、资源目录浏览和资源文件获取。
- **MCP 与 Skill 管理**：MCP 接入统一生命周期，支持草稿、审核、发布、上下线和可见性管理；Skill 改进上传检查、批量处理和版本元数据展示。
- **DNS 与分布式锁**：新增支持 A、AAAA、SRV 记录的 DNS 服务发现，并增强实验性的分布式锁，支持可重入、自动续约和 FIFO 等待。
- **插件与安全**：统一插件配置和生命周期管理，调整相关服务端配置 key，支持运行时配置更新；Client API 鉴权默认开启，增强集群身份认证及资源导入、上传等入口的校验。
- **兼容性与稳定性**：升级至 Spring Boot 4.0.6，完善 Jackson 2 / Jackson 3 适配；修复集群重启、客户端重连等场景下的实例恢复问题，并优化配置页面布局、浏览器兼容性和多语言支持。

完整变更记录与版本下载请见：[Nacos Release Notes](https://github.com/alibaba/nacos/releases/tag/3.3.0)。

## 二、几个重点变化

### 2.1 升级前需要处理的事项

对于已经运行 Nacos 的团队，升级前首先需要确认的是：现有应用能否正常访问，历史资源能否继续使用，以及滚动升级期间有哪些限制。

3.3.0 调整了部分默认配置，也引入了历史 AI 资源的迁移流程。建议在升级前检查以下事项，并在测试环境验证。

#### Client API 鉴权默认开启

如果现有应用一直通过默认配置访问 Nacos，且没有配置客户端凭据，需要特别关注这项变化。

从 3.3.0 开始，未配置 `nacos.core.auth.enabled` 时，其默认值为 `true`。此前依赖默认配置、未提供凭据的客户端，升级后可能遇到鉴权失败。

升级前应检查服务端配置，以及业务应用、脚本和运维工具使用的凭据。已有显式 `nacos.core.auth.enabled=false` 配置仍然生效，Admin API 和 Console API 的鉴权默认值没有变化。

对于需要分阶段启用鉴权的集群，可以先明确保留原有配置，完成客户端凭据配置和验证后，再统一开启鉴权。

#### 插件配置 key 调整，需要同步检查部署配置

除了功能上的变化，3.3.0 的插件生命周期重构也调整了多类服务端配置 key。如果集群使用了自定义配置文件、容器环境变量或部署脚本，升级时需要一并检查这些配置。

本次调整涉及插件选择、鉴权参数、数据库连接、AI Pipeline 和资源导入等。插件实现参数统一采用 `nacos.plugin.{pluginType}.{pluginName}.{itemKey}` 的命名方式，主要对应关系如下：

| 配置范围 | 原配置 key | 新配置 key |
| --- | --- | --- |
| 鉴权插件选择 | `nacos.core.auth.system.type` | `nacos.plugin.auth.type` |
| 默认鉴权插件的 Token 参数 | `nacos.core.auth.plugin.nacos.token.*` | `nacos.plugin.auth.nacos.token.*` |
| 鉴权信息缓存 | `nacos.core.auth.caching.enabled` | `nacos.plugin.auth.nacos.caching.enabled` |
| AI 匿名访问 | `nacos.core.auth.nacos.anonymous.ai.enabled` | `nacos.plugin.auth.nacos.anonymous.ai.enabled` |
| LDAP 参数 | `nacos.core.auth.ldap.*` | `nacos.plugin.auth.ldap.{itemKey}`，部分字段名同步调整 |
| OIDC 参数 | `nacos.core.auth.plugin.oidc.*` | `nacos.plugin.auth.oidc.*` |
| 数据库方言选择 | `spring.sql.init.platform` | `nacos.plugin.datasource-dialect.type` |
| 数据库连接与连接池参数 | `db.*` | `nacos.plugin.datasource.db.*`，连接池字段使用标准连字符命名 |
| 数据库查询超时 | JVM 参数 `QUERYTIMEOUT` | `nacos.plugin.datasource.db.query-timeout` |
| 流控插件选择 | `nacos.plugin.control.manager.type` | `nacos.plugin.control.type` |
| 配置变更插件启用状态 | `nacos.core.config.plugin.{pluginName}.enabled` | `nacos.plugin.config-change.{pluginName}.enabled` |
| 可见性插件选择 | `nacos.plugin.visibility.type` | `nacos.plugin.visibility.{pluginName}.enabled`，按实现管理启用状态 |
| AI Pipeline 启动链 | `nacos.plugin.ai-pipeline.type` | `nacos.plugin.ai-pipeline.{pluginName}.enabled`，按实现管理启用状态 |
| AI 资源导入总开关 | `nacos.ai.resource.import.enabled` | `nacos.plugin.ai-resource-import.enabled` |
| 内置资源导入插件启用状态 | `nacos.plugin.ai.importer.*.enabled` | `nacos.plugin.ai-resource-import.{pluginName}.enabled` |

部分字段除了前缀变化，也调整了名称。例如，LDAP 的 `basedc` 改为 `base-dn`，`userDn` 改为 `user-dn`；连接池的 `maximumPoolSize` 改为 `maximum-pool-size`。AI Pipeline 中也统一了部分字段命名，例如 Skill Scanner 的 `useLlm`、`llmApiKey` 分别改为 `use-llm`、`llm-api-key`。迁移时应按插件的配置定义逐项核对。

已有配置可以通过保留的历史别名继续读取，服务端会输出迁移提示。新部署和更新后的部署模板应使用新的标准 key。升级时有四条规则需要留意。

第一条也是最容易出问题的一条：新 key 优先于旧 key，空值同样生效。如果新模板已经包含某个标准 key，即使其值为空，也不会回退读取旧 key。所以要把实际配置值迁移到新 key，避免新模板中的空值或默认值覆盖已有配置。

配置是否需要重启，由配置项的生效模式决定。鉴权插件选择、数据库连接参数、Token 密钥及 LDAP/OIDC 参数等仍需重启生效；只有支持运行时更新的配置项，才可以通过插件管理接口动态修改。

静态启用配置只用于确定插件的初始状态。如果已经通过插件管理接口保存了运行时配置或启停状态，这些值可能优先于配置文件。排查配置未生效时，记得同时查看插件当前状态和配置来源。

还有部分旧导入配置需要重新整理。旧 `nacos.ai.resource.import.sources[N].*` 来源模型已移除，不提供自动迁移，使用这类配置的部署需要按受管导入插件重新配置来源；旧 `nacos.plugin.ai.importer.*` 中保留的等价参数，也要逐项迁移到新的插件配置下。

对于尚未接入统一配置定义的第三方配置变更插件，其参数仍通过旧的 `nacos.core.config.plugin.{pluginName}.{propertyKey}` 兼容路径传入，应结合插件版本确认迁移方式。

`nacos.core.auth.enabled`、Admin/Console 鉴权开关和服务端身份配置等核心配置保持原有名称。此次迁移应按配置项核对，避免对所有 `nacos.core.*` 参数直接替换前缀。

#### 历史 A2A 数据需要按兼容流程迁移

已经接入 A2A 注册中心的应用，不必为了用上新的 Agent 管理与发现能力就改接入方式。3.3.0 保留了原有 A2A 接口，并提供历史数据的兼容迁移流程。

已有历史 A2A 数据的集群，需要按照升级指南启用：

```properties
nacos.ai.a2a.compatibility.mode=AUTO
```

滚动升级期间，历史 A2A 数据继续作为读写依据。待集群成员能力、数据同步和校验条件满足后，Nacos 自动协调迁移与切换，将已有 Agent 纳入新的 Agent 模型和 RAD 能力体系。

这里有一个额外需要注意的点：默认的 `CANONICAL` 模式并不会扫描和迁移历史 A2A 数据。换句话说，光换安装包不会帮你迁移数据。已有集群请按升级指南完成准备和验证；切换完成后，也不要再让仅支持旧逻辑的服务端节点重新加入。

#### MCP 会在后台对账后切换到新的管理流程

多团队共同维护一个 MCP 服务时，草稿、审核、发布、上下线这套流程会更有价值。3.3.0 把 MCP 纳入统一生命周期，同时保留已有客户端和网关使用的服务数据。

升级后，Nacos 会在后台核对历史 MCP 数据，建立对应的资源和版本记录。在数据一致、所有集群成员具备相应能力后，再切换到新的管理流程。

迁移期间，原有 MCP 管理路径继续工作；新的生命周期写操作需要等待切换完成。历史 Config、Naming 数据及其服务方式保持兼容，因此升级时需要保留这些数据和迁移状态。

对于已有部署，建议重点验证历史 MCP 查询、版本更新和服务发现。控制台里出现了新的资源记录，底层历史数据也先别清理；切换完成后，同样不要再让旧节点承接 MCP 管理写入。

#### 其他需要检查的兼容变化

除了上述变化，使用旧接口、早期版本数据或 BETA / RC SDK 的应用，还需要检查以下事项：

- **已废弃接口**：部分旧 Pipeline 和 MCP 导入接口默认返回 HTTP 410。仍在使用这些接口的应用应迁移到新接口；`nacos.core.api.compatibility.enabled=true` 可作为临时过渡配置。
- **更早版本的数据**：从 3.0 之前的版本升级，需要先经过较早的 3.x 版本，完成历史配置数据迁移。保留了旧版无类型标记 Raft 日志的集群，也需要先处理对应数据，单纯更换运行版本不会转换已有日志。
- **BETA / RC Agent SDK**：新增 RAD `subscribeAgent` 方法的返回值调整为 `void`，初始状态和后续变化统一通过 Listener 接收，使用这些接口的应用需要适配并重新编译。
- **客户端监控**：`nacos-client` 不再强制依赖 Prometheus 客户端。需要采集客户端指标时，应由应用向 Micrometer 的 `Metrics.globalRegistry` 注册具体的 `MeterRegistry`，并配置相应的指标导出。

### 2.2 ARD：按任务发现需要的 AI 资源

只用三五个工具的时候，把清单写在代码或配置里就够了。等团队攒到几十个甚至上百个 MCP 服务、Skill 和 Agent，“眼下这个任务该用哪个能力”本身就成了一个要单独解决的问题。

把全部资源描述都塞进模型上下文，既占上下文，也让工具清单越来越难维护。ARD（Agentic Resource Discovery）走的是按需发现的路子：应用先围绕当前任务搜索，再读取相关资源的说明和内容，然后决定怎么用。

Nacos 3.3.0 新增对 ARD 的支持，应用可以通过统一入口，搜索已经在 Nacos 中管理的多种 AI 资源。

#### 从搜索到获取资源

一次资源发现大致分三步：

1. **搜索候选资源**：根据查询内容返回相关资源，也可以按资源类型等条件缩小范围。基础检索走关键词，配置向量检索后可以结合语义召回。
2. **了解资源能力**：读取候选资源的描述和元数据，判断它适不适合当前任务。应用也可以通过目录、列表和聚合信息，浏览当前有哪些可发现的资源。
3. **获取所需内容**：根据结果中的资源引用，取回对应版本的 Skill 包、Prompt、MCP 描述或 Agent 定义，供应用进一步加载使用。

搜索结果会结合资源的在线状态、当前版本和调用者可见范围来处理。实际效果好不好，很大程度上取决于资源描述写得是否清楚、索引有没有建完，以及检索方式怎么配。

#### 以订单退款分析为例

假设团队已经在 Nacos 中发布了两个资源，并允许业务助手访问：

| 资源 | 类型 | 用途 |
| --- | --- | --- |
| 订单退款查询 | MCP | 查询订单与退款记录 |
| 退款分析报告 | Skill | 定义统计口径、分析步骤和报告格式 |

用户向业务助手提出请求：

> 查询上周的退款情况，按商品类别整理一份分析报告。

应用首先需要找到查询退款数据的工具。它可以围绕“退款”搜索 MCP 服务，例如向 `/v3/ai/ard/search?namespaceId=public` 提交以下请求正文：

```json
{
  "query": {
    "text": "退款",
    "filter": {
      "type": ["application/mcp-server-card+json"]
    }
  },
  "pageSize": 5
}
```

获得候选资源后，应用读取 MCP 描述，确认其提供的工具和参数，再通过 MCP 客户端查询数据。

接下来，应用搜索并获取“退款分析报告”Skill，按照其中的统计口径和格式整理结果。后续如果团队调整了报告模板，可以通过 Skill 的版本管理发布更新，应用再按资源发现和版本规则获取所需内容。

这个例子里，应用围绕当前任务查找和加载资源，省掉了预先维护一份完整工具清单的功夫。至于选哪个候选资源、要不要真的发起调用、报告怎么生成，仍然由接入方的应用逻辑和 Agent 执行流程决定。

#### 如何启用 ARD

想在现有应用里试试这种按需发现，可以先挑一组描述清楚、用途明确的 MCP 或 Skill，发布后验证搜索和内容获取流程。

ARD 默认关闭，通过以下配置开启：

```properties
nacos.ai.ard.enabled=true
```

ARD 使用 AI Registry 适配器的独立端口，默认端口为 `9080`。接入时需要配置适配器访问地址，并按部署的鉴权策略携带凭据。向量检索要另外配置相应服务——开了 ARD 不等于就有了语义检索。

#### ARD 和 RAD 怎么配合

ARD 和 RAD 长得太像了，如何区分呢？简单可以理解为：**ARD 找能用上的能力，RAD 找 Agent 的访问地址。**

应用调用外部能力，一般分两步：先找到适合当前任务的资源，再确认怎么访问它。ARD（Agentic Resource Discovery）和 RAD（Remote Agent Discovery）各管一步。

| 能力 | 面向对象 | 主要用途 |
| --- | --- | --- |
| ARD，发现能用上的能力 | Agent、Skill、Prompt、MCP 等多种 AI 资源 | 根据任务搜索候选资源，浏览资源目录，并获取对应版本的资源描述或内容 |
| RAD，发现 Agent 的访问地址 | 远程 Agent | 发现 Agent 的运行端点、协商传输协议，并订阅端点等发现信息的变化 |

举个例子。业务助手要调用一个退款分析 Agent，先用 ARD 搜索相关能力，读候选 Agent 的描述，确认它能不能满足任务要求。

选定之后，再通过 RAD 拿到运行端点和协议信息，按对应协议发起调用，并通过订阅感知后续变化。如果搜到的是 Skill 或 MCP 服务，就由应用按相应资源类型加载内容或建立连接。

往后 Nacos 会继续通过 RAD 扩展对更多 Agent 协议的支持，包括 AG-UI 等，为不同框架和交互场景提供统一的注册与发现入口。

### 2.3 其他改进

除了升级迁移和 ARD，3.3.0 还有一批更贴近日常开发、运维的变化。

**DNS 服务发现与分布式锁。** 有些应用不方便引入 SDK，更习惯直接用 DNS 拿服务地址。3.3.0 新增的 DNS 服务发现支持通过 UDP、TCP 查询 A、AAAA 和 SRV 记录，为这类应用提供了新的接入方式。DNS 默认关闭，启用后默认只监听本机地址，需要远程访问时记得配置监听地址。另外，针对多实例应用的互斥访问和任务协调，实验性的分布式锁提供了 Java SDK，支持可重入、看门狗续约和 FIFO 等待。

**Skill 上传和版本管理。** Skill 在团队里反复编辑、发布，最让人头疼的是上传失败只告诉你“失败”，或者页面上显示的还是上一版的描述。本次改进覆盖了上传预检查、版本冲突、批量处理结果，以及空文件、多行描述这些边角场景。草稿编辑、发布和上下线时，描述与对应版本保持一致，使用者能核对到实际生效的内容。

**插件配置和资源可见性。** 企业接入 Nacos，很少是从零开始——已有的权限规则和扩展能力都得能接上。3.3.0 统一了插件配置和生命周期管理，支持运行时配置更新及控制台配置操作。可见性插件增加了授权、撤权和自定义范围扩展能力，便于对接企业权限体系；需要注意的是，扩展可见范围之后，实际能不能访问仍由相应的权限策略说了算。

**配置、服务发现和控制台。** 主要使用配置管理和服务发现的用户，这个版本同样有收获。Config SDK 增加了基于请求与结果对象的接口，支持加密配置 CAS 发布和条件查询。Naming 修复了集群重启、连接频繁切换及重试任务异常等场景下的实例恢复问题。控制台重排了配置详情、编辑和历史页面，解决了操作按钮超出可视区域、页面嵌套滚动等问题。

**运行环境与依赖适配。** 应用陆续升级 Spring Boot 和 Jackson，SDK 这边也得跟上。3.3.0 服务端升级至 Spring Boot 4.0.6，客户端完善了 Jackson 2 / Jackson 3 的运行时适配。Nacos Server 和 Console 需要 Java 17 及以上，Nacos Client 和 Maintainer Client 继续支持 Java 8 及以上。

## 三、Nacos 2.5.5 同期发布

对于继续使用 Nacos 2.x 的团队，社区同期发布了 Nacos 2.5.5。

该版本以问题修复和稳定性改进为主，增强了服务端文件路径及 HTTP 健康检查的校验，修复了集群整体重启时服务实例丢失、gRPC 报文异常，以及 HTTP 请求处理和集群成员一致性等问题。服务端和客户端继续保持 Java 8 基线。

升级前，建议结合发布说明检查已有的路径配置和自定义 HTTP 健康检查配置。完整变更与下载地址请见：[Nacos 2.5.5 Release Notes](https://github.com/alibaba/nacos/releases/tag/2.5.5)。

## 四、Nacos AI Registry 插件：在 Codex 和 Qoder 中使用团队资源

资源放进 Nacos 只是第一步，还得让它们出现在成员每天用的工具里：写代码时能翻到团队的接口规范，排查问题时能调起内部查询工具，自己攒的那套工作流程也能分享给别人。

为此，Nacos 社区发布了面向 Codex 和 Qoder 的 Nacos AI Registry 插件，首个预览版本为 0.1.0。插件安装在对应的 AI 应用中，连接已有的 Nacos AI Registry，通过对话发现、使用和管理团队资源。

插件主要提供以下能力：

- **使用团队 Skill**：搜索和读取技能，按需安装到本地，并检查更新、处理本地修改或恢复已有版本。
- **共享自己的 Skill**：将本地工作流程整理为技能，完成上传预检、保存草稿、提交和发布，供团队成员复用。
- **使用 MCP 和远端 Agent**：发现已经注册的 MCP 服务和 A2A Agent，核对连接信息与认证方式，按需试用或保存本地连接。
- **根据任务寻找能力**：当任务缺少合适能力时，助手可以尝试搜索 Nacos 中的资源，先读取 Skill 或试用服务，再根据用户选择决定是否长期保留。

以前文的退款分析为例，如果团队已经发布了订单查询 MCP 和报告 Skill，用户可以在对话中提出“查询上周退款情况，按团队模板整理报告”。助手会围绕任务寻找已有资源，再判断如何使用。团队成员也可以把改进后的分析流程整理成新的 Skill，走完发布流程后共享给其他人。

Codex 版同时提供对话引导和资源中心页面，方便查看已接入资源、发现新资源和管理自己的技能；Qoder 版目前以原生分步问答和工具调用为主。两端分别维护连接配置和本地状态。

插件运行需要 Python 3.11+，面向本地执行环境。按 README 完成安装和初始化，就可以从搜索一个团队 Skill 或试用一个 MCP 服务开始。具体操作系统、应用版本和已验证功能范围，请参阅各自文档：

- [Agent 插件总览](https://github.com/nacos-group/nacos-plugin/blob/ap-0.1.0/agent-plugins/README.md)
- [Codex 插件 README：安装、初始化与使用](https://github.com/nacos-group/nacos-plugin/blob/ap-0.1.0/agent-plugins/codex/README.md)
- [Qoder 插件 README：安装、初始化与使用](https://github.com/nacos-group/nacos-plugin/blob/ap-0.1.0/agent-plugins/qoder/README.md)
- [0.1.0 发布说明与安装包](https://github.com/nacos-group/nacos-plugin/releases/tag/ap-0.1.0)

感谢参与 3.3.0 开发、测试和问题反馈的社区贡献者。使用中遇到问题或有功能建议，欢迎提到 [Nacos GitHub](https://github.com/alibaba/nacos)；插件相关的接入体验和兼容性问题，可以提到 [nacos-plugin Issues](https://github.com/nacos-group/nacos-plugin/issues)。
