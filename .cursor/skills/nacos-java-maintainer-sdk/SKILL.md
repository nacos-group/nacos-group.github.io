# Nacos 运维 SDK（Maintainer SDK）文档格式与 API 同步

编写或更新 **运维 SDK 使用手册**（`manual/admin/maintainer-sdk.md`）时，请严格遵循本 skill 下的格式说明；**通过解析 Nacos Maintainer Client 的接口定义（含多层继承）与 maintainer-sdk.md 对比，补全新增 API、标出新增重载、并标出接口中已删除的重载（文档需同步移除或标注）**。

**仅修改 next 版本文档**：本 skill 涉及的所有编辑、对比、补全，**只针对** `src/content/docs/next/` 下的 maintainer-sdk.md（中英文）。**不得**修改 `latest`、`v3.0` 或其他版本目录下的文档；其他版本由发布流程或人工同步。

## 格式说明位置

- **必读**：[reference.md](./reference.md) — 文档结构、单条 API 小节顺序、表格与代码块约定、大章划分、更新注意点。

## 何时使用

- 需要根据 **Maintainer Java 接口** 补全或修正 maintainer-sdk.md 时（新增 API、新增重载、已删除的重载、签名变更）。
- 新增运维 SDK 使用手册中的 API 或小节时。
- 修改 maintainer-sdk.md 结构或表格/示例格式时。
- 需要统一中英文 maintainer-sdk 文档结构时。
- 希望生成的运维 SDK 文档与官网现有风格一致时。

## 用户需提供：Nacos 项目路径

本 skill 的对比与解析依赖 **Nacos 仓库中的 Maintainer Client 接口源码**。不同使用者的本机路径不同，因此**不会**在 skill 或脚本中写死 nacos 路径。

- **约定**：参与开发/维护官网文档的人，通常也是 Nacos 的开发者或贡献者，本地会 clone 有 **nacos** 仓库。
- **使用前**：请先确认本机 nacos 仓库位置（例如 `~/Documents/nacos`、`../nacos`、`/path/to/nacos` 等）。
- **传参方式**：执行对比或解析时，通过参数 `--nacos-maintainer-dir` 传入 nacos 中的 **maintainer-client 源码目录**（见下方「使用方式」）。可传**绝对路径**或**相对于当前工作目录的相对路径**。

若本地暂无 nacos 仓库，可先 `git clone https://github.com/alibaba/nacos.git` 再执行脚本。

## Maintainer API 定义来源与章节

以下接口为文档的 API 来源；**存在多层继承关系**，解析时需展开父接口方法并按「章节归属」归类（见 reference.md）。文档大章与接口对应关系如下：

| 接口 (interface) | 文档章节 | 说明 |
|------------------|----------|------|
| `ConfigMaintainerService` 及其配置相关父接口（`BetaConfigMaintainerService`、`ConfigHistoryMaintainerService`、`ConfigOpsMaintainerService`，**不含** `CoreMaintainerService`） | 第 3 章 配置中心运维 API | 配置中心 |
| `NamingMaintainerService` 及其服务发现相关父接口（`ServiceMaintainerService`、`InstanceMaintainerService`、`NamingClientMaintainerService`，**不含** `CoreMaintainerService`） | 第 4 章 服务发现运维API | 注册中心 |
| `CoreMaintainerService` | 第 5 章 其他Nacos核心运维API | Nacos 核心通用 |
| `McpMaintainerService`（由 `AiMaintainerService` 继承） | 第 6 章 MCP 服务 | Ai 相关 - MCP |
| `A2aMaintainerService`（由 `AiMaintainerService` 继承） | 第 7 章 A2A 注册中心 | Ai 相关 - A2A |
| `PromptMaintainerService`（由 `AiMaintainerService` 继承） | 第 8 章（若文档已增加） | Ai 相关 - Prompt |
| `SkillMaintainerService`（由 `AiMaintainerService` 继承） | 第 9 章（若文档已增加） | Ai 相关 - Skill |

接口在 nacos 仓库中的路径：`maintainer-client/src/main/java/com/alibaba/nacos/maintainer/client/` 下对应包名（`config/`、`naming/`、`core/`、`ai/`）。因此 `--nacos-maintainer-dir` 应指向 **nacos 仓库根目录下的 `maintainer-client/src/main/java`**（或任一包含 `com/alibaba/nacos/maintainer/client` 的父目录）。

## 设计上不文档化的 API（豁免列表）

以下方法虽在接口中存在，但**不视为对外能力 API**，**不要**在 maintainer-sdk.md 中单独成节或补全；对比脚本会从「NEW APIs」中排除，不会建议补全。

| 方法名 | 所属接口 | 说明 |
|--------|----------|------|
| `fillAllPattern` | ConfigMaintainerService | 仅为其他 API 提供的公有工具方法（将字符串补全为首尾 `*` 的模糊匹配模式），非实际运维能力，不写入 API 文档。 |

后续若有同类约定，在本表与对比脚本的 `SKIP_NEW_API` 中同步更新。

## 使用方式

### 1. 对比接口与文档（不修改任何文件）

在**文档仓库根目录**（nacos-group.github.io）执行，并**将下面的 nacos 路径替换为你本机的 nacos 仓库路径**：

```bash
# 将 YOUR_NACOS_REPO 替换为本机 nacos 仓库路径
python .cursor/skills/nacos-java-maintainer-sdk/scripts/compare_maintainer_api_with_doc.py \
  --nacos-maintainer-dir YOUR_NACOS_REPO/maintainer-client/src/main/java \
  --maintainer-md src/content/docs/next/zh-cn/manual/admin/maintainer-sdk.md
```

- `--nacos-maintainer-dir`：**必填**。本机 nacos 仓库中的 `maintainer-client/src/main/java` 的路径（绝对路径或相对当前目录均可）。
- `--maintainer-md`：当前要对比的 maintainer-sdk.md，**必须**为 next 版本路径；不要传入 `latest`、`v3.0` 等路径。

输出：

- **NEW APIs**：接口中存在、maintainer-sdk.md 中未出现的**方法名**（需按 reference.md 补全整条 API 小节）。
- **NEW OVERLOADS**：方法名已在文档中出现，但该**参数个数**的重载未在文档中体现（需在对应小节中**补充**方法签名/参数表/示例等）。
- **REMOVED OVERLOADS**：方法名在文档与接口中均有，但文档中写了该**参数个数**的重载而接口中已无此重载（需在对应小节中**删除**该重载的签名/参数/示例，或标注已废弃）。

可选：加 `--json` 输出机器可读的 JSON，便于脚本或 AI 使用。

### 2. 按 reference.md 补全与修改

1. 根据对比结果，对 **NEW APIs** 在对应大章下新增小节（如 3.x、4.x、…），按 reference.md 的「单条 API 的固定结构」书写：描述、方法签名、请求参数、返回值/返回参数、请求示例、异常说明（可选）。
2. 对 **NEW OVERLOADS**，在已有 API 小节中**补充**该重载的签名、参数表与示例，不新增小节编号。
3. 对 **REMOVED OVERLOADS**，在已有 API 小节中**删除**该重载的签名、参数与示例；若需保留历史说明可改为标注「已废弃」等，以与当前接口一致。
4. 若某旧 API 的**签名或行为**有变更（除新增/删除重载外），需结合接口 Javadoc 与实现人工核对并修改描述/参数/示例。
5. 中英文 maintainer-sdk.md 同步：仅对 **next** 下的 zh-cn、en 两篇同步；章节编号、小节标题、表格列、代码逻辑一致，仅 frontmatter 与说明段落做本地化。

**不明确则暂不修改**：修改过程中若某处**无法从接口或现有文档明确判断**，**不要猜测修改**；应将该条列入报告中的「待确认内容」，待后续确认后再修改。

### 3. 修改完成后生成报告（必须）

每次对 next 版 maintainer-sdk.md 进行增删改后，**必须**生成一份**修改报告**，便于审阅与追溯。**报告不写入文档**；报告可**仅在对话中输出**，或由执行者自行保存到其他位置。

报告应包含：**新增的 API 文档**、**移除的 API 文档**、**修改的 API 文档**（含修改类型：描述 / API 定义 / 新增重载 / 删除重载 / 示例变更 / 异常说明）、**待确认内容**。无变更时可在报告中说明「本次无变更」；有待确认项时必须在报告中列出。

### 4. 仅解析接口（可选）

仅列出接口中的方法签名（含继承展开），不对比文档。同样需要**传入你本机的 nacos 路径**：

```bash
python .cursor/skills/nacos-java-maintainer-sdk/scripts/parse_maintainer_interface.py \
  --dir YOUR_NACOS_REPO/maintainer-client/src/main/java
```

单文件解析：`--file path/to/ConfigMaintainerService.java`。按章节输出：`--by-chapter`。输出 JSON：`--json`。

## 脚本说明

| 脚本 | 作用 |
|------|------|
| [scripts/parse_maintainer_interface.py](./scripts/parse_maintainer_interface.py) | 解析 Maintainer Java 接口源码，**支持多层继承**：解析 `extends` 并递归加载父接口，按章节归属汇总方法；提取方法名、参数个数、返回类型、@since、声明接口等。 |
| [scripts/compare_maintainer_api_with_doc.py](./scripts/compare_maintainer_api_with_doc.py) | 解析各章节对应接口（含继承），解析 maintainer-sdk.md 中已文档化的方法，输出**新增 API**、**新增重载**与**已删除重载**列表；**不修改任何文件**。 |

## 禁止行为

- **禁止**修改 `latest`、`v3.0` 等非 next 版本文档；本 skill 只编辑 `src/content/docs/next/{zh-cn|en}/manual/admin/maintainer-sdk.md`。
- **禁止**使用会整体覆盖 maintainer-sdk.md 段落或整篇的脚本，避免丢失已有描述、参数说明与示例。
- **禁止**在未明确时猜测修改：不明确的内容列入报告「待确认内容」，暂不修改。
- 正确做法：用对比脚本得到报告 → 按 reference.md **手工编辑** next 下的 maintainer-sdk.md（或由 AI 按报告逐条增改），只做必要同步并保留现有表述 → **生成修改报告**。
