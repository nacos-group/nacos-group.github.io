---
name: nacos-java-sdk-doc
description: Updates Nacos Java SDK usage documentation by comparing Java Client interfaces with usage.md, then adding/removing APIs and overloads while preserving existing descriptions and examples.
---

# Nacos Java SDK 文档格式与 API 同步

编写或更新 **nacos-java-client 使用手册**（`manual/user/java-sdk/usage.md`）时，请严格遵循本 skill 下的格式说明；**通过解析 Nacos Java Client 的接口定义与 usage.md 对比，补全新增 API、标出新增重载、并标出接口中已删除的重载（文档需同步移除或标注）**。

**仅修改 next 版本文档**：本 skill 涉及的所有编辑、对比、补全，**只针对** `src/content/docs/next/` 下的 usage.md（中英文）。**不得**修改 `latest`、`v3.0` 或其他版本目录下的文档；其他版本由发布流程或人工同步。

## 格式说明位置

- **必读**：[reference.md](./reference.md) — 文档结构、单条 API 小节顺序、表格与代码块约定、大章划分、更新注意点。

## 何时使用

- 需要根据 **Java Client 接口** 补全或修正 usage.md 时（新增 API、新增重载、已删除的重载、签名变更）。
- 新增 Java SDK 使用手册中的 API 或小节时。
- 修改 `usage.md` 结构或表格/示例格式时。
- 需要统一中英文 usage 文档结构时。
- 希望生成的 Java SDK 文档与官网现有风格一致时。

## 用户需提供：Nacos 项目路径

本 skill 的对比与解析依赖 **Nacos 仓库中的 Java 接口源码**。不同使用者的本机路径不同，因此**不会**在 skill 或脚本中写死 nacos 路径。

- **约定**：参与开发/维护官网文档的人，通常也是 Nacos 的开发者或贡献者，本地会 clone 有 **nacos** 仓库。
- **使用前**：请先确认本机 nacos 仓库位置（例如 `~/Documents/nacos`、`../nacos`、`/path/to/nacos` 等）。
- **传参方式**：执行对比或解析时，通过参数 `--nacos-api-dir` 传入 nacos 中的 API 源码目录（见下方「使用方式」）。可传**绝对路径**或**相对于当前工作目录的相对路径**。

若本地暂无 nacos 仓库，可先 `git clone https://github.com/alibaba/nacos.git` 再执行脚本。

## Java Client API 定义来源

以下接口为文档的 API 来源，解析与对比均基于其源码。**Skill、Prompt 与 MCP、A2A 一样为独立能力，在 usage 中单独成章（与 MCP、A2A 同级）**；**shutdown 已在「Java SDK 的生命周期」章节说明，不单独列为 API 小节**。

| 接口 (interface) | 文档章节 | 说明 |
|------------------|----------|------|
| `com.alibaba.nacos.api.config.ConfigService` | 第 3 章 配置管理 API | 配置中心 |
| `com.alibaba.nacos.api.naming.NamingService` | 第 4 章 服务发现API | 注册中心 |
| `com.alibaba.nacos.api.lock.LockService` | 第 5 章 分布式锁API | lock、unLock 等 |
| `com.alibaba.nacos.api.ai.AiService`（MCP 相关方法） | 第 6 章 MCP 服务 | 查询/发布/注册/订阅 MCP 等 |
| `com.alibaba.nacos.api.ai.A2aService` | 第 7 章 A2A 注册中心 | AgentCard 等，AiService 继承此接口 |
| `com.alibaba.nacos.api.ai.AiService`（Skill 相关方法） | 第 8 章 Skill 能力 | loadSkill、subscribeSkill、unsubscribeSkill（新增能力，排在 A2A 后） |
| `com.alibaba.nacos.api.ai.AiService`（Prompt 相关方法） | 第 9 章 Prompt 能力 | getPrompt、subscribePrompt 等（新增能力，排在 A2A 后） |
| `com.alibaba.nacos.api.ai.AiService`（AgentSpec 相关方法） | 第 10 章 AgentSpec 能力 | loadAgentSpec、subscribeAgentSpec、unsubscribeAgentSpec（新增能力，排在 Prompt 后） |

**章节顺序约定**：已有模块（如 MCP、A2A）保持原有章号；新增大模块（如 Skill、Prompt、AgentSpec）在 A2A 之后、生命周期之前依次追加，后续新增能力也向后添加。

接口在 nacos 仓库中的路径：`api/src/main/java/com/alibaba/nacos/api/` 下对应包名。因此 `--nacos-api-dir` 应指向 **nacos 仓库根目录下的 `api/src/main/java`**（或任一包含 `com/alibaba/nacos/api` 的父目录）。

## 使用方式

### 1. 对比接口与文档（不修改任何文件）

在**文档仓库根目录**（nacos-group.github.io）执行，并**将下面的 nacos 路径替换为你本机的 nacos 仓库路径**：

```bash
# 将 YOUR_NACOS_REPO 替换为本机 nacos 仓库路径，例如 ../nacos 或 /Users/xxx/nacos
python .cursor/skills/nacos-java-sdk-doc/scripts/compare_java_api_with_doc.py \
  --nacos-api-dir YOUR_NACOS_REPO/api/src/main/java \
  --usage-md src/content/docs/next/zh-cn/manual/user/java-sdk/usage.md
```

- `--nacos-api-dir`：**必填**。你本机 nacos 仓库中的 `api/src/main/java` 的路径（绝对路径或相对当前目录均可）。
- `--usage-md`：当前要对比的 usage.md，**必须**为 next 版本路径，例如 `src/content/docs/next/zh-cn/manual/user/java-sdk/usage.md` 或 `.../next/en/...`；不要传入 `latest`、`v3.0` 等路径。

输出：

- **NEW APIs**：接口中存在、usage.md 中未出现的**方法名**（需按 reference.md 补全整条 API 小节）。
- **NEW OVERLOADS**：方法名已在文档中出现，但该**参数个数**的重载未在文档中体现（需在对应小节中**补充**方法签名/参数表/示例等）。
- **REMOVED OVERLOADS**：方法名在文档与接口中均有，但文档中写了该**参数个数**的重载而接口中已无此重载（需在对应小节中**删除**该重载的签名/参数/示例，或标注已废弃）。

可选：加 `--json` 输出机器可读的 JSON，便于脚本或 AI 使用。

### 2. 按 reference.md 补全与修改

1. 根据对比结果，对 **NEW APIs** 在对应大章下新增小节（如 3.x、4.x、5.x、6.x、7.x、8.x、9.x、10.x），按 reference.md 的「单条 API 的固定结构」书写：描述、方法签名、请求参数、返回值/返回参数、请求示例、异常说明（可选）。AiService 的 `shutdown` 不单独成节，已在第 11 章「Java SDK 的生命周期」中说明。
2. 对 **NEW OVERLOADS**，在已有 API 小节中**补充**该重载的签名、参数表与示例，不新增小节编号。
3. 对 **REMOVED OVERLOADS**，在已有 API 小节中**删除**该重载的签名、参数与示例；若需保留历史说明可改为标注「已废弃」等，以与当前接口一致。
4. 若某旧 API 的**签名或行为**有变更（除新增/删除重载外），在对比报告中可能不会逐条标出，需结合接口 Javadoc 与实现人工核对并修改描述/参数/示例。
5. 中英文 usage.md 同步：仅对 **next** 下的 zh-cn、en 两篇同步；章节编号、小节标题、表格列、代码逻辑一致，仅 frontmatter 与说明段落做本地化。

**不明确则暂不修改**：修改过程中若某处**无法从接口或现有文档明确判断**（如含义歧义、多解、与接口不一致原因不明等），**不要猜测修改**；应将该条列入报告中的「待确认内容」，待后续确认后再修改。

**设计上已废弃、不补回文档的 API**：部分接口重载在设计上已废弃，即使对比脚本或接口中仍存在，**不要**将其补回 usage.md。当前约定：**NamingService.getServicesOfServer** 带 **AbstractSelector** 参数的重载（如 4 参）已废弃，对比脚本已从「NEW OVERLOADS」中排除；若报告中未出现该项，也请勿主动添加。后续若有新增同类约定，会在本 skill 与对比脚本中同步更新（脚本内 `SKIP_NEW_OVERLOAD`）。

### 3. 修改完成后生成报告（必须）

每次对 next 版 usage.md 进行增删改后，**必须**生成一份**修改报告**，便于审阅与追溯。**报告不写入文档**（文档仅包含客户端/使用手册内容）；报告可**仅在对话中输出**，或由执行者自行保存到其他位置（如技能目录下临时文件等）。

报告应包含以下四部分：

| 部分 | 说明 |
|------|------|
| **新增的 API 文档** | 本次新增的小节（如 3.x、6.x），列出章节号与 API 名称（方法名）。 |
| **移除的 API 文档** | 本次删除或整节移除的 API 小节，列出原章节号与 API 名称。 |
| **修改的 API 文档** | 本次在已有小节内做了改动的 API，列出章节号、API 名称，并**标明修改类型**（见下表）。 |
| **待确认内容** | 因不明确而**未修改**的项：简要说明位置（章节/方法名）与待确认问题，待确认后再改。 |

**修改类型**（可多选）：**描述**（仅改描述文字）/ **API 定义**（签名、参数表、返回值之一或多个）/ **新增重载** / **删除重载** / **示例变更** / **异常说明**。

无变更时可在报告中说明「本次无变更」；有待确认项时必须在报告中列出，不得遗漏。

### 4. 仅解析接口（可选）

仅列出接口中的方法签名（不对比文档），不涉及文档修改与报告。同样需要**传入你本机的 nacos 路径**：

```bash
# 将 YOUR_NACOS_REPO 替换为本机 nacos 仓库路径
python .cursor/skills/nacos-java-sdk-doc/scripts/parse_java_interface.py --dir YOUR_NACOS_REPO/api/src/main/java
```

单文件解析：`--file path/to/ConfigService.java`（路径任意）。输出 JSON：`--json`。

## 脚本说明

| 脚本 | 作用 |
|------|------|
| [scripts/compare_java_api_with_doc.py](./scripts/compare_java_api_with_doc.py) | 解析 ConfigService、NamingService、AiService、A2aService，解析 usage.md 中已文档化的方法，输出**新增 API**、**新增重载**与**已删除重载**列表；**不修改任何文件**。 |
| [scripts/parse_java_interface.py](./scripts/parse_java_interface.py) | 解析 Java 接口源码，提取方法名、参数个数、返回类型、@since 等，供对比脚本或人工查阅。 |

## 禁止行为

- **禁止**修改 `latest`、`v3.0` 等非 next 版本文档；本 skill 只编辑 `src/content/docs/next/{zh-cn|en}/manual/user/java-sdk/usage.md`。
- **禁止**使用会整体覆盖 usage.md 段落或整篇的脚本，避免丢失已有描述、参数说明与示例。
- **禁止**在未明确时猜测修改：不明确的内容列入报告「待确认内容」，暂不修改。
- **禁止**修改文档后不生成报告：每次对 usage.md 增删改后必须生成修改报告（见本 skill「修改完成后生成报告」）；报告不写入文档，仅在对话中输出或自行保存。
- 正确做法：用对比脚本得到报告 → 按 reference.md **手工编辑** next 下的 usage.md（或由 AI 按报告逐条增改），只做必要同步并保留现有表述 → **生成修改报告**（新增/移除/修改的 API 及修改类型、待确认内容）。
