# Nacos Java SDK 文档格式参考

本文档定义 `manual/user/java-sdk/usage.md`（nacos-java-client 使用手册）的文档结构与书写约定，供 skill 或人工编写/更新 Java SDK 文档时引用。

**文档路径（仅 next 版本）**：`src/content/docs/next/{zh-cn|en}/manual/user/java-sdk/usage.md`。本 skill 仅针对上述 next 路径进行编写与同步；不修改 `latest`、`v3.0` 等其他版本文档。

---

## 1. Frontmatter

- 使用 YAML 元数据：`title`、`keywords`、`description`、`sidebar.order`。
- 中英文仅在此处及少量说明段落（如升级兼容、学习提示）做本地化，正文结构保持一致。

---

## 2. 标题层级与编号

| 层级 | 格式 | 示例 |
|------|------|------|
| 一级 | `# 标题` | `# Java SDK 使用手册` |
| 二级 | `## N. 章节名` | `## 1. 引用概述`、`## 3. 配置管理 API` |
| 三级 | `### N.M. 小节名` | `### 3.1. 获取配置`、`### 4.1. 注册实例` |
| 四级 | `#### 小节内标题` | `#### 描述`、`#### 请求参数`、`#### 请求示例` |

- 章节编号统一为「大章. 小节」（如 3.1、4.2）；四级为固定名称，不编号。

---

## 3. 单条 API 的固定结构

每个接口**必须**按以下顺序组织，标题名称固定：

| 顺序 | 小节标题 | 是否必填 | 说明 |
|------|----------|----------|------|
| 1 | **描述** | 必填 | 接口用途、注意事项；可含 blockquote `> 注意：...` |
| 2 | **方法签名** | 必填 | 紧跟描述后，用 ` ```java ` 代码块给出方法声明（可多行 overload） |
| 3 | **请求参数** | 必填 | Markdown 表格 |
| 4 | **返回值** 或 **返回参数** | 必填 | 表格或一句说明；命名二选一，与现有文档一致即可 |
| 5 | **请求示例** 或 **使用示例** | 必填 | 完整 Java 示例代码块 |
| 6 | **异常说明** | 可选 | 如抛出 `NacosException` 的情形 |

- 部分接口有「使用示例」与「请求示例」并存时，以现有文档为准；**异常说明**仅在有异常时添加。

---

## 4. 表格约定

### 4.1 请求参数表

- 表头之一：`| 参数名 \| 参数类型 \| 描述 |` 或 `| 名称 | 类型 | 描述 | 默认值 |`。
- 对齐使用 `:---` 等 Markdown 表格对齐。
- 若参数为对象（如 `LockInstance`、`Instance`），在该参数行下用「XXX对象中包含如下参数：」+ 新表格描述各字段。

### 4.2 返回值/返回参数表

- 表头：`| 参数类型 | 描述 |` 或与请求参数类似的「名称 | 类型 | 描述 | 默认值」。

### 4.3 嵌套类型（监听器、事件等）

- 单独子表，如「FuzzyWatchEventWatcher模糊订阅监听器」「ConfigFuzzyWatchChangeEvent模糊订阅事件」。
- 表头为「方法名/参数名」「类型」「描述」。

---

## 5. 代码块

- 语言统一为 **`java`**。
- 占位符：`{serverAddr}`、`{dataId}`、`{group}`、`{namespaceId}` 等，与现有 usage.md 一致。
- 多 overload 时可在同一小节内连续多个 ` ```java ` 方法签名。

---

## 6. 其他格式习惯

- **强调**：关键术语用 `**加粗**`（如 `**产品名:模块名**`、`**运维能力**`）。
- **注意事项**：`> 注意：...`；学习/调试提示可用 `> **学习提示**：...`。
- **实验性/版本说明**：使用 Docusaurus 块 `:::note ... :::`。
- **内部链接**：Markdown 锚点，如 `[批量注册服务实例](#48-批量注册服务实例)`；锚点由标题生成（小写、空格变 `-`、中文保留）。
- **版本/注解**：行内标注如 `@Since 1.4.1`、`该API的起始版本为3.1.1`。
- **子节**：复杂能力可再拆子节（如「配置模糊订阅容量保护机制」「预设提供的数据选择器」），使用 `####` 或 `###`，与现有文档层级一致。

---

## 7. 大章与模块划分（usage.md 目录）

编写或校验文档时，大章应保持以下顺序与范围：

| 章号 | 标题 | 内容概要 |
|------|------|----------|
| 1 | 引用概述 | Java 版本、Maven 坐标、纯净版、升级兼容性 |
| 2 | 初始化SDK | NacosFactory、Properties 示例 |
| 3 | 配置管理 API | getConfig、addListener、removeListener、publishConfig、removeConfig、getConfigAndSignListener、publishConfigCas、fuzzyWatch 等 |
| 4 | 服务发现API | 注册/注销实例、获取实例、selectInstances、subscribe/unsubscribe、批量、选择器、分页、模糊订阅等 |
| 5 | 分布式锁API | lock、unLock |
| 6 | MCP 服务 | 查询、发布、注册/注销 Endpoint、订阅/取消订阅 |
| 7 | A2A 注册中心 | AgentCard 查询/发布、Endpoint 注册/注销、订阅/取消订阅、批量注册 Endpoint |
| 8 | Skill 能力 | loadSkill、subscribeSkill、unsubscribeSkill（新增能力，排在 A2A 后） |
| 9 | Prompt 能力 | getPrompt、getPromptByVersion、getPromptByLabel、subscribePrompt、unsubscribePrompt（新增能力，排在 A2A 后） |
| 10 | Java SDK的生命周期 | 创建、shutdown（含 AiService.shutdown 等）、实例复用与资源释放；**shutdown 类 API 不单独成节** |

- **说明**：已有模块（MCP、A2A）保持原有顺序；新增大模块（如 Skill、Prompt）在 A2A 之后、生命周期之前依次追加，后续新增能力也向后添加。`shutdown` 在生命周期章统一说明，不再单独列为 API 小节。

---

## 8. 更新与引用时的注意点

- **中英文同步**：正文结构、章节编号、表格列、代码块逻辑应一致；仅 frontmatter 和少量说明段落做本地化。
- **新增 API**：按「3. 单条 API 的固定结构」插入到对应大章下，编号与现有 3.1、4.1 等风格一致。
- **新增重载**：在已有 API 小节中补充该重载的方法签名、参数表与示例，不新增小节编号。
- **已删除重载**：接口中已移除的重载，文档中应删除对应签名、参数与示例，或标注为已废弃，使文档与当前接口一致。
- **占位符**：示例中统一使用 `{serverAddr}` 等占位，不要写死 `localhost:8848`（除非文档明确写「示例地址」）。
- **链接**：站内用相对路径，如 `[Java SDK 配置参数](./properties.md)`；同文档内用锚点 `[xxx](#小节锚点)`。

---

**引用方式**：在 skill 或规则中说明「编写/更新 Java SDK 使用手册时，请遵循 `.cursor/skills/nacos-java-sdk-doc/reference.md` 中的格式与结构约定」。

---

## 9. 与 Java 接口的同步（本 skill 扩展）

- 新增/变更内容应来自 Nacos Java Client 接口：`ConfigService`、`NamingService`、`AiService`、`A2aService`（见 SKILL.md 中的「Java Client API 定义来源」）。AiService 的 Skill、Prompt 为新增能力，排在 A2A 后，分别对应第 8、9 章；`shutdown` 在生命周期章说明，不单独成 API 小节。
- 使用脚本 `scripts/compare_java_api_with_doc.py` 对比接口与 usage.md，可得到**新增 API**（需整条补全）、**新增重载**（在已有小节中补充签名/参数/示例）与**已删除重载**（在已有小节中删除或标注该重载）。**Nacos 项目路径由使用者提供**（`--nacos-api-dir`），skill 中不写死路径。
- 补全或修改时仍按本文档第 3、4、5、6 节的格式执行，并保持中英文结构一致。
- 修改过程中若有**不明确**之处（含义歧义、与接口不一致原因不明等），**暂不修改**，将该条列入修改报告的「待确认内容」，待确认后再改。修改完成后须生成修改报告；报告**不写入文档**，在对话中输出或由执行者自行保存，格式与类型说明见 SKILL.md。
