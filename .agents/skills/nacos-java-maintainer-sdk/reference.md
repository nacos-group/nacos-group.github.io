# Nacos 运维 SDK（Maintainer SDK）文档格式参考

本文档定义 `manual/admin/maintainer-sdk.md`（运维 SDK 使用手册）的文档结构与书写约定，供 skill 或人工编写/更新运维 SDK 文档时引用。

**文档路径（仅 next 版本）**：`src/content/docs/next/{zh-cn|en}/manual/admin/maintainer-sdk.md`。本 skill 仅针对上述 next 路径进行编写与同步；不修改 `latest`、`v3.0` 等其他版本文档。

---

## 1. Frontmatter

- 使用 YAML 元数据：`title`、`keywords`、`description`、`sidebar.order`。
- 中英文仅在此处及少量说明段落做本地化，正文结构保持一致。

---

## 2. 标题层级与编号

| 层级 | 格式 | 示例 |
|------|------|------|
| 一级 | `# 标题` | `# 运维SDK` |
| 二级 | `## N. 章节名` | `## 1. 引用概述`、`## 3. 配置中心运维 API` |
| 三级 | `### N.M. 小节名` | `### 3.1. 获取配置`、`### 4.1. 创建服务` |
| 四级 | `#### 小节内标题` | `#### 描述`、`#### 请求参数`、`#### 返回值`、`#### 请求示例`、`#### 异常说明` |

- 章节编号统一为「大章. 小节」（如 3.1、4.2）；四级为固定名称，不编号。

---

## 3. 单条 API 的固定结构

每个接口**必须**按以下顺序组织，标题名称固定：

| 顺序 | 小节标题 | 是否必填 | 说明 |
|------|----------|----------|------|
| 1 | **描述** | 必填 | 接口用途、注意事项；可含 blockquote `> 注意：...`、`:::note` |
| 2 | **方法签名** | 必填 | 紧跟描述后，用 ` ```java ` 代码块给出方法声明（可多行 overload） |
| 3 | **请求参数** | 必填 | Markdown 表格 |
| 4 | **返回值** 或 **返回参数** | 必填 | 表格或一句说明；命名二选一，与现有文档一致即可 |
| 5 | **请求示例** | 必填 | 完整 Java 示例代码块 |
| 6 | **异常说明** | 可选 | 如抛出 `NacosException` 的情形 |

- 复杂返回类型可另附「具体 XXX 的内容如下」+ 子表格描述各字段。

---

## 4. 表格约定

### 4.1 请求参数表

- 表头之一：`| 参数名 | 参数类型 | 描述 |` 或 `| 名称 | 类型 | 描述 | 默认值 |`。
- 对齐使用 `:---` 等 Markdown 表格对齐。
- 若参数为对象，可在该参数行下用「XXX对象中包含如下参数：」+ 新表格描述各字段。

### 4.2 返回值/返回参数表

- 表头：`| 参数类型 | 描述 |` 或「名称 | 类型 | 描述」。

### 4.3 嵌套类型（如 Page、ConfigDetailInfo 等）

- 单独子表说明「具体 Page 及 ConfigBasicInfo 的内容如下」等，表头为「参数名」「参数类型」「描述」。

---

## 5. 代码块

- 语言统一为 **`java`**。
- 占位符：`{serverAddr}`、`{dataId}`、`{group}`、`{namespaceId}`、`Constants.DEFAULT_GROUP`、`Constants.DEFAULT_NAMESPACE_ID` 等，与现有 maintainer-sdk.md 一致。
- 多 overload 时可在同一小节内连续多个 ` ```java ` 方法签名；示例中变量名与文档一致（如 `configMaintainerService`、`maintainService`、`aiMaintainerService`）。

---

## 6. 其他格式习惯

- **强调**：关键术语用 `**加粗**`（如 **运维SDK**、**配置中心**、**服务发现**）。
- **注意事项**：`> 注意：...`；`:::note ... :::`。
- **内部链接**：Markdown 锚点，如 `[获取配置](#31-获取配置)`；锚点由标题生成（小写、空格变 `-`、中文保留）。
- **版本/注解**：行内标注如 `@Since x.x.x`、`该API的起始版本为x.x.x`（若接口有 @since）。

---

## 7. 大章与模块划分（maintainer-sdk.md 目录）

编写或校验文档时，大章应保持以下顺序与范围：

| 章号 | 标题 | 内容概要 |
|------|------|----------|
| 1 | 引用概述 | Java 版本、Maven 坐标 |
| 2 | 初始化SDK | Factory、Properties 示例（ConfigMaintainerFactory、NamingMaintainerFactory 等） |
| 3 | 配置中心运维 API | getConfig、publishConfig、deleteConfig、deleteConfigs、listConfigs、searchConfigs、cloneConfig、getListeners、Beta 灰度、配置历史、dump、日志级别、更新元数据等（来自 ConfigMaintainerService 及其配置相关父接口，不含 Core） |
| 4 | 服务发现运维API | 服务 CRUD、实例注册/注销/更新、实例列表、统计、日志、健康检查、逻辑集群、**客户端列表与详情**（getClientList、getClientDetail、getPublishedServiceList、getSubscribeServiceList、getPublishedClientList、getSubscribeClientList 等，来自 NamingClientMaintainerService）及 NamingMaintainerService 其他能力（不含 Core） |
| 5 | 其他Nacos核心运维API | getServerState、liveness、readiness、raftOps、getIdGenerators、updateLogLevel、listClusterNodes、updateLookupMode、getCurrentClients、reloadConnectionCount、smartReloadCluster、reloadSingleClient、getClusterLoaderMetrics、命名空间 CRUD、checkNamespaceIdExist、**插件** listPlugins、getPluginDetail、updatePluginStatus、updatePluginConfig、getPluginAvailability 等（来自 CoreMaintainerService） |
| 6 | MCP 服务 | listMcpServer、searchMcpServer、getMcpServer、createLocalMcpServer、createRemoteMcpServer、updateMcpServer、deleteMcpServer 等 |
| 7 | A2A 注册中心 | registerAgent、getAgentCard、updateAgentCard、deleteAgent、版本与搜索、分页等 |
| 8 | （若已增加）Prompt 能力 | listPrompts、getPromptMeta、版本与标签、删除等 |
| 9 | （若已增加）Skill 能力 | registerSkill、getSkillDetail、updateSkill、deleteSkill、列表与分页等 |
| 10 | （若已增加）AgentSpec 能力 | getAgentSpecDetail、getAgentSpecAdminDetail、getAgentSpecVersionDetail、deleteAgentSpec、listAgentSpecs、listAgentSpecAdminItems、uploadAgentSpecFromZip、草稿/提交流程、labels/bizTags/scope 等 |

---

## 8. 与 Java 接口的同步（本 skill 扩展）

- 新增/变更内容应来自 Nacos Maintainer Client 接口（见 SKILL.md「Maintainer API 定义来源与章节」）。**存在多层继承**：ConfigMaintainerService 继承 CoreMaintainerService、BetaConfigMaintainerService、ConfigHistoryMaintainerService、ConfigOpsMaintainerService；NamingMaintainerService 继承 CoreMaintainerService、ServiceMaintainerService、InstanceMaintainerService、NamingClientMaintainerService；AiMaintainerService 继承 McpMaintainerService、A2aMaintainerService，并通过 `agentSpec()/prompt()/skill()` 代理到对应维护接口。解析时需展开继承链，并按「声明接口」归属到对应章节（第 3 章不包含 Core 方法，第 4 章不包含 Core 方法，第 5 章仅 Core 方法，第 10 章为 AgentSpec 接口能力）。
- 使用脚本 `scripts/compare_maintainer_api_with_doc.py` 对比接口与 maintainer-sdk.md，可得到**新增 API**（需整条补全）、**新增重载**（在已有小节中补充签名/参数/示例）与**已删除重载**（在已有小节中删除或标注该重载）。**Nacos 项目路径由使用者提供**（`--nacos-maintainer-dir`），skill 中不写死路径。
- 补全或修改时仍按本文档第 3、4、5、6 节的格式执行，并保持中英文结构一致。
- 修改过程中若有**不明确**之处，**暂不修改**，将该条列入修改报告的「待确认内容」，待确认后再改。修改完成后须生成修改报告；报告**不写入文档**，在对话中输出或由执行者自行保存。

---

**引用方式**：在 skill 或规则中说明「编写/更新运维 SDK 使用手册时，请遵循 `.cursor/skills/nacos-java-maintainer-sdk/reference.md` 中的格式与结构约定」。
