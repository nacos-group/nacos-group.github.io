---
name: nacos-api-doc-update
description: Updates Nacos API documentation from Swagger api.json. **Must try the validated curl refresh first**; only if fetching or snapshot validation fails, use the complete existing zh/en snapshot. **Compare** generated md with existing docs and **update in place** (add/remove params, fix URL/curl); **do not** use any sync script that overwrites sections (preserve existing descriptions and examples). Use when updating API docs from Swagger or generating console/admin/client API markdown.
---

# Nacos API 文档更新

根据 Swagger 导出的 `api.json` 更新文档仓库中的 API 文档（console-api、admin-api、open-api）。建议按**每个 api.json 拆分子计划**执行，避免混淆不同文档的格式。

## 0. 冻结输入基线，避免一次任务使用多套事实

每轮更新只能使用一份已冻结并校验过的输入快照。开始编辑前必须完成：

1. **记录来源**：记录六份 Swagger 的 URL、抓取时间、`info.version`、operation 数量和 SHA-256，以及参考 Nacos 源码的 branch、HEAD 与工作区状态。子任务只读这份快照，不得各自重新抓取或覆盖 Swagger。
2. **源码新鲜度门禁**：若 live Swagger 包含本地源码没有的 operation，或本地源码包含 live Swagger 没有的已实现 operation，先判定为 freshness mismatch；不得用较旧一侧删除 API 或修改业务语义。参考源码是否同步必须遵守工作区 `AGENTS.md`，未经允许不得自行 pull、切分支或修改源码。
3. **安全刷新**：禁止使用 `curl ... > public/swagger/.../api.json` 直接覆盖已跟踪文件。必须先写临时文件，确认 HTTP 成功、JSON 可解析、存在 `openapi`、`paths` 非空、operation 数量合理、同一 API 的中英文结构一致，再批量替换。
4. **同轮一致性**：一个 API family 的 zh/en 必须来自同一次服务快照；任一 locale 失败时保留该 family 原有的一对文件，禁止一新一旧。运行中若版本、operation 数量或结构 fingerprint 变化，废弃旧对比结果并从头重跑。

本 skill 提供安全刷新脚本，内部仍使用 `curl --fail`，但只在整批校验成功后替换目标文件：

```bash
python3 .agents/skills/nacos-api-doc-update/scripts/refresh_swagger.py
```

只校验仓库中现有快照而不联网、不写文件：

```bash
python3 .agents/skills/nacos-api-doc-update/scripts/refresh_swagger.py --validate-existing
```

### 冲突时按信息维度裁决

- 已适用且已实现的 Spec：业务语义、生命周期和兼容方向。
- 与该构建匹配的 Controller、Form、公共模型、服务校验和 IT：实际字段、FQCN、业务必填及错误路径。
- 同构建 live Swagger：wire operation 清单、method/path、媒体类型和已正确表达的参数契约。
- checked-in Swagger 与旧文档：仅作为抓取失败时的回退参考。

标记为 target、future 或 experimental 且尚未实现的 Spec 不能单独作为“当前已有 API”的依据。若 live Swagger 与 Spec/源码冲突，先报告生成问题，不得机械用冲突后的 component 覆盖正确文档。

## 执行顺序：必须先尝试更新 api.json

**每次执行本 skill 时，在生成或更新文档之前，必须先尝试用 curl 拉取最新的 api.json**（覆盖对应 `public/swagger/...` 下的文件）。  
**仅在安全刷新失败时**（例如本地 Nacos 未启动、端口不可用、网络错误、JSON/OpenAPI 校验失败或 zh/en 结构不一致）才使用仓库中已有的完整 api.json 快照进行生成，并在结论报告中说明「本次未更新 api.json，原因：xxx」。

不得以「仓库中 api.json 已修改」「担心本地服务未启动」等为由跳过更新步骤；**默认行为是先执行更新，失败再回退到已有文件**。

## 交付要求：交付经过验证的正确状态

通常应把已确认的差异实际修改并保存到文档文件，而不是只创建脚本或生成未写入的文本。但**验证后无差异的 no-op 是合法结果**；禁止为了“产生变更”而改写措辞、类型格式或示例，制造下一轮反向修改。

- 结论报告中「已更新文档」须与仓库中**实际发生变更**的文件一致；若最终没有任何 `.md` 文件被修改，须说明「全量门禁通过，无需修改文档」。

## 更新方式：对比后针对性更新（禁止整段覆盖）

**禁止使用批量替换脚本**。禁止使用会整体覆盖文档段落或整篇的 sync/patch 脚本（如 `sync_doc_from_swagger.py` 及其同类脚本）。此类脚本会覆盖已有内容，导致**参数描述、返回说明、示例**（如 curl 中的真实示例值）丢失。仅允许使用**仅对比、不写文件的脚本**（如 `compare_doc_with_swagger.py`）生成差异报告，再在文档上做**针对性、逐处修改**。

**正确流程**：
1. 用 `swagger_to_md.py` 根据 api.json **生成**参考用的 Markdown 片段（可针对单个接口或整篇，用 `--filter-path` 等控制）。
2. **对比**「生成的片段」与「已有文档」中对应接口（按 #### 请求URL + 请求方式 匹配）。
3. **在已有文档上做针对性更新**（直接编辑对应的 `.md` 文件）：
   - **与 api.json 对齐**：参数表增删（文档多出的参数删掉、缺失的参数补上）、类型/必填与 api.json 一致；请求 URL、请求方式、鉴权状态按需修正；curl 示例中的 URL/参数名与 api.json 一致。
   - **起始版本同步（强制）**：每个 Swagger operation 若包含 `x-nacos-api-since.version`，文档中对应 API 小节必须在「接口描述」之后、「请求方式」之前增加或更新 `#### 起始版本`，内容为反引号包裹的版本号，如 `` `3.2.0` ``。若已有起始版本与 api.json 不一致，以 api.json 为准更新。新增 API 小节也必须包含该字段。
   - **保留已有内容**：已有文档中的**参数描述**、**返回字段描述**、**请求示例 / 返回示例**（含手写示例）应尽量保留；仅当某参数已从 api 移除时删掉该参数行，仅当缺少某参数时补上一行（描述可先来自生成片段或简写，后续再润色）。
   - **手写增强内容保护（强制）**：对文档中已有的手写增强内容（如参数说明扩展表、命令映射表、注意事项）即使 swagger 中无对应字段，也**不得删除**。这类内容默认视为高优先级人工补充，除非用户明确要求移除。
   - **空描述补全（强制）**：对“新增参数但描述为空/占位符（如 `-`）”的情况，必须结合接口描述、参数名、上下文给出可读描述；不要直接保留空描述。已有参数描述除非明显错误，否则保持原文。
   - **语言一致性（强制）**：`zh-cn` 文档新增或修改的参数描述必须是中文；`en` 文档必须是英文。禁止在 `zh-cn` 参数表中出现英文描述（专有名词除外）。
   - **文件字段类型约定（强制）**：对 `multipart/form-data` 请求体中 `format: binary` 的字段（如 `file`），文档参数类型统一写为 `file`（或 `file(binary)`），**禁止**回写为普通 `string`。对比时需把 `string(binary)` 识别为文件字段语义，不得误判为普通字符串。
   - **类型写法统一（强制）**：基础类型和容器关键字统一使用小写规范：`string`、`integer`、`number`、`boolean`、`file`、`object`、`array`、`map`。容器必须保留元素和值类型，如 `array<integer>`、`array<string>`、`map<string, string>`；禁止把已知的 `array<T>` 简化成 `array`。
   - **命名领域类型保护（强制）**：上述小写规则**不适用于** Swagger `$ref` 指向的命名 schema。只要字段引用了明确的领域类型，尤其文档紧邻位置已有该类型的展开表或说明，就必须保留 schema 名称及其上下文，例如 `ServerVersionDetail`、`McpServerRemoteServiceConfig`、`McpServerValidationItem`、`AgentCapabilities`、`array<AgentSkill>`；禁止泛化为 `object` 或 `array<object>`。只有在排除同名碰撞、并由 operation 上下文和源码确认后，才能按当前 Swagger 同步 schema 名称及展开说明。
   - **必填语义分层（强制）**：区分 transport required、business required 和 conditional required。Swagger 正确表达时按其 required；源码明确缺失必然失败但 Swagger 漏标时，文档标为必填并添加精准、可追溯豁免；互斥或按场景生效的字段写“条件必填”及条件，禁止把两端都简单标成必填。
   - **统一返回体层级（强制）**：`Result<T>` 的 `code`、`message`、`data` 位于响应根层级。返回数据表若只描述业务数据，应写作 `data`、`data.field`；禁止把统一返回体再次包进 `data`，生成 `data.code`、`data.message`、`data.data`。`data` 自身引用命名 schema 时，类型必须写为 `T`（分页则为 `Page<T>`），不能只展开字段而丢掉根类型。
   - **文档结构约定**：请求体类型**仅在「请求方式」**中标注，不要在「请求参数」下重复写「请求体为 xxx」。若接口无 query 仅有 body，请求参数下**只保留一个参数表**，**不要**添加「无（Query 参数）」或单独的「请求参数」块；对比脚本已适配「单表且 api 无 query 则视为 body」。
   - **单标题单表约定（强制）**：每个 API 小节下仅允许一个 `#### 请求参数` 标题。即使同时存在 query 与 body 参数，也必须合并为**一个参数表**展示；禁止再拆出第二个 `#### 请求参数`。如需提示来源，可在“描述”列中注明“Query 参数/Body 参数”。
   - **表格结构约定（强制）**：若现有文档在同一接口下有“参数表 + 说明表”等**上下关联的连续表格**，禁止在两表之间新增任何小标题（如 `#### 命令说明`）；保持原有标题层级与相邻表格结构不变。
4. 若某接口在 api.json 中为**新增**（文档中尚无对应小节），可将生成片段作为新小节插入文档，再按需润色描述与示例。

即：**以生成片段为参考做对比，只改需要同步的项，不整段替换，避免覆盖掉已有的描述和示例。**

## 额外强约束：按 API 粒度比对并保持原有顺序

为避免“新增接口导致整篇顺序漂移”，更新时必须遵守以下规则：

1. **比对粒度必须是单个 API**：以 `请求方式 + 请求URL` 作为唯一键，逐个接口比对与修改；禁止把整章/整段作为比对与替换单位。
2. **保持原文档章节顺序**：已有章节（如 `## 4. MCP 管理`、`## 5. A2A 管理`）及其先后顺序必须保持不变，除非用户明确要求调整。
3. **保持原接口顺序**：已存在的接口小节顺序必须保持不变；仅在对应章节中插入“新增 API”小节，默认追加到该章节末尾（或按用户指定位置插入）。
4. **禁止整段替换到章节尾**：禁止执行“从某个 `##` 标题替换到文件末尾”这类操作；如需修改多个接口，也必须逐个接口定位并编辑。
5. **编号仅做局部修正**：若插入新增接口影响 `x.y` 编号，只在该章节内做连续编号修正；不得跨章节重排编号。

建议执行顺序：
- 先从现有文档抽取接口顺序清单（`method + path`）。
- 再将 swagger 差异映射到该清单，按接口逐项更新参数/URL/curl。
- 最后仅为新增接口补充小节，并在该章节内校正编号。

## 1. 更新 Swagger api.json

在文档仓库根目录（nacos-group.github.io）下执行（需本地 Nacos Console 端口 8080、Nacos Server 端口 8848 可用）：

```bash
python3 .agents/skills/nacos-api-doc-update/scripts/refresh_swagger.py
```

可用 `--scope admin|console|client` 只刷新一个 family，但该 family 的 zh/en 仍必须成对刷新和校验。脚本失败时不得手工把失败响应写进目标文件；保留旧快照，并在结论中报告失败原因及本次实际采用的 Swagger provenance。

## 2. Swagger JSON 与文档路径映射

| Swagger 文件 | 文档文件（next 版本） |
|--------------|------------------------|
| `public/swagger/console/{i18n}/api.json` | `src/content/docs/next/{locale}/manual/admin/console-api.md` |
| `public/swagger/admin/{i18n}/api.json`    | `src/content/docs/next/{locale}/manual/admin/admin-api.md`   |
| `public/swagger/client/{i18n}/api.json`   | `src/content/docs/next/{locale}/manual/user/open-api.md`     |

**i18n → locale**：Swagger 目录为 `en`、`zh`；文档路径中 `en` 不变，`zh` 对应 **`zh-cn`**。

**双 locale 同步**：同一类型文档（console-api / admin-api / open-api）存在 **zh-cn** 与 **en** 两套。对任一侧做了修改（参数表、新增接口、curl 示例、描述等）后，应对**另一侧做同等更新**，保持中英文一致。仅当用户**明确**要求「只更新 zh-cn」或「只更新 en」时，才只改一侧；否则默认**同时更新 zh-cn 与 en**。

## 3. 找出变更并生成参考 Markdown

- 读取 `api.json`（`paths`、`components/schemas`）与对应的 `*.md`。
- 通过 path + method 对齐已有文档中的接口（如 `#### 请求URL` 后的 path 或标题）。
- 找出**新增**或**发生变更**的 API（path/method/参数/返回结构/`x-nacos-api-since.version` 起始版本变化）。
- 使用本 skill 自带的 **Python 脚本**（仅 `swagger_to_md.py`）生成符合现有 api.md 风格的 Markdown 片段，**作为对比参考**，不要用任何 sync 脚本把生成内容整段写回文档。

### 豁免项记录（Swagger 已知限制/临时 Bug）

- 对于已确认的 Swagger 暂不支持项或临时 bug，不应在每次扫描中重复报错。
- Admin 与 Console 共用的豁免统一记录到：`.agents/skills/nacos-api-doc-update/exemptions/admin-console-api-exemptions.json`；Client 不使用该文件。
- 运行对比脚本时加参数：

```bash
python .agents/skills/nacos-api-doc-update/scripts/compare_doc_with_swagger.py \
  --json public/swagger/admin/zh/api.json \
  --doc-type admin \
  --doc-file src/content/docs/next/zh-cn/manual/admin/admin-api.md \
  --exemptions-file .agents/skills/nacos-api-doc-update/exemptions/admin-console-api-exemptions.json
```

- 豁免仅用于“已确认且有追踪”的差异。每项必须写明精确 `method + path`、issue kind、参数路径、原因、Spec/源码证据、验证用 source commit、跟踪项（如有）和失效条件；禁止宽泛 `ignore_prefixes` 或整类 `ignore_api_only` 掩盖真实回归。
- 每轮先运行**不带豁免**的 raw compare，确认当前差异仍与证据一致；再运行带豁免的 compare。刷新后不再命中的豁免必须删除，不能把豁免当成永久基线。

**重要：参数与 api.json 同步**。对**每个**已在文档中的接口，用 api.json 的 `parameters` / `requestBody` 与文档中的「请求参数」或「请求Body」表逐项对比：若文档里写了某参数而 api.json 中该 path+method 下已**没有**该参数，应在文档中**删除**该参数行；若 api.json 有而文档没有，应**补上**该参数行。脚本输出是“以 api.json 为准”的参考，用于**对比后在已有文档上做针对性修改**，保留文档中已有的描述与示例。

**重要：起始版本与 api.json 同步**。对**每个**已在文档中的接口，读取 Swagger operation 的 `x-nacos-api-since.version`，并与文档小节中的 `#### 起始版本` 对比；缺失则补充，不一致则更新。若 operation 暂无该 extension，不要凭空编造版本号。

**脚本路径**：`.agents/skills/nacos-api-doc-update/scripts/swagger_to_md.py`。在文档仓库根目录下执行，例如：

```bash
# console 文档（中文）
python .agents/skills/nacos-api-doc-update/scripts/swagger_to_md.py \
  --json public/swagger/console/zh/api.json --doc-type console --locale zh-cn

# admin 文档（中文）
python .agents/skills/nacos-api-doc-update/scripts/swagger_to_md.py \
  --json public/swagger/admin/zh/api.json --doc-type admin --locale zh-cn

# client 文档（中文）
python .agents/skills/nacos-api-doc-update/scripts/swagger_to_md.py \
  --json public/swagger/client/zh/api.json --doc-type client --locale zh-cn
```

可选参数：`--filter-path "正则"` 只生成匹配 path 的接口；`--section-start N` 指定起始小节编号。脚本会从 api.json 解析 parameters/requestBody/response schema（含 Result、Result&lt;Page&lt;T&gt;&gt; 等），生成请求参数表、返回数据表及 curl 示例。生成时需区分的文档类型与格式见 [reference.md](reference.md)。

## 4. 审查与补全

- 对脚本生成的每一处内容做一次 review。
- **再次核对**：对已有接口，文档中的请求参数/请求Body 表是否与 api.json 完全一致（无多写、无漏写）。
- **响应类型上下文核对（强制）**：从每个 `200` 响应 schema 开始递归检查 `$ref`、数组 `items` 与映射 `additionalProperties`。文档中已有类型展开表或字段说明时，引用字段必须使用对应命名 schema（容器写作 `array<SchemaName>`、`map<string, SchemaName>`），不能只写 `object`、`array` 或 `array<object>`。匿名对象和动态扩展字段才保留通用类型。
- **同名 schema 冲突核对（强制）**：若不同 Java 包存在同名模型，Swagger `components.schemas` 可能只保留其中一个定义。此时不得机械采用冲突后的字段；必须结合该 operation 的声明返回类型和示例，并按项目文档优先级以 Spec、源码为准确认正确模型。将冲突的 schema 名、涉及接口和建议修复方式记录在结论报告中。
- **FQCN 核对（强制）**：遇到同名模型时，从 Controller 返回泛型、import、外层 DTO 字段和公共模型确认完整类名，路径只能辅助判断。修正只能限于对应 operation/章节，禁止对整篇文档全局替换同名类型。Form 中承载 JSON 的字段在 wire 上仍是 `string`，应在描述中注明其 JSON payload 类型；只有真正自由形态的 JSON 字段才写 `object`。
- 对新增或改动接口运行对比脚本时，加 `--strict-response-paths` 检查 `data.code`、`data.message`、`data.data` 等重复统一返回体路径；历史文档全量扫描可先不加该开关，避免既存格式问题遮蔽本次差异。
- 对命名业务响应，加 `--require-named-response-root`，确保文档存在精确的 `data | NamedType` 根行，而不是只展开子字段或完全漏掉返回类型。
- 根据对 `api.json`（OpenAPI 3）的理解，补全**错误**或**缺失**（如描述、示例、返回字段说明、鉴权说明等）。
- **不确定或需人工补充**的点记录到**结论报告**中，在任务结束时一并给出。

### Agent 管理专项回归规则

- 使用边界正则 `^/v3/(admin|console|client)/ai/agents(?:/|$)` 检查路由族，避免把 `/agentspecs` 计入。Admin、Console、Client 分别按 `method + normalized path` 比较 Swagger、文档及中英文 locale；当前 `17/17/6` 仅是本次快照的回归参考，发现合法新增 API 时应更新文档而不是永久拒绝扩展。
- Agent Client Header 必须按 **method + path** 判定，不能按 `/ai/agents` 路径族泛化。Search/Discover 的 Client ID 可选；定义发布没有 Publisher Header；Endpoint 注册、注销、心跳的 Client ID 和 `Request-Module: AI` 均必填。详细矩阵和 curl 规则见 [reference.md](reference.md#agent-管理专项规则)。
- 不能只看 Spring `@RequestHeader(required=false)` 判断业务可选性；该写法可能用于进入 Nacos 统一参数校验。必须同时核对 Swagger `@Parameter`、服务校验和 Spec。
- Agent Management 是协议无关的后续主管理面，文档可说明其 API 计划逐步替代旧 A2A API，并推荐新用户/SDK 优先兼容；这**不等于 A2A 协议已废弃或当前 API 已删除**。兼容截止版本只能来自当次 Spec/发布说明，不得永久写死在 skill。
- `AgentProvider`、`AgentVersionDetail` 等简单类名若同时存在于 Agent 与 A2A 包，必须按 FQCN 和 operation 上下文选择结构。每次刷新先检测碰撞是否仍存在；若 Swagger 已修复，应删除局部 workaround 和相关说明，而不是继续保留旧结论。

## 5. 最终确定性门禁

最终报告前按以下顺序执行；任何一步失败都不能写“验证通过”：

1. 使用下方固定的 `python3 -m py_compile` 命令校验 `refresh_swagger.py`、`swagger_to_md.py`、`compare_doc_with_swagger.py`、`validate_all_api_docs.py`。
2. `refresh_swagger.py --validate-existing` 校验六份 JSON、版本、operation 数量和中英文 Swagger 结构。
3. 六份文档先跑 raw compare，再带精准 exemptions 跑最终 compare。带豁免的全量命令同时使用 `--audit-exemptions`；最终命令必须使用 `--validate-json-examples --fail-on-diff`，输出问题数为 0 且退出码为 0。
4. 对本次新增/修改的 path 额外使用 `--strict-response-paths --require-named-response-root`；Client Header 相关 path 再加 `--strict-headers`。Agent Client 建议固定使用 `--filter-path '^/v3/client/ai/agents(?:/|$)'`。
5. 确认文档 operation 完整且无重复；中英文 operation 顺序、编号、Since、请求头/参数/响应字段的名称、类型和必填语义一致。翻译文本可不同。
6. 所有 `json` fenced code block 必须能被 `json.loads` 解析；需要省略或注释的示例改用 `jsonc` 或 `text`，不能在 `json` 中放 `...`。
7. 运行 `git diff --check`，确认仅有任务内文件变化。
8. 运行站点构建。只有构建命令退出 0 才能写“构建通过”；若因 Pagefind、Sitemap、外部网络等仓库级问题失败，应如实报告为部分验证，并单独确认六个目标 HTML 是否已生成，不能把页面已生成等同于完整构建成功。

步骤 2～7（包括六份 raw compare 和带精准豁免的最终 compare）使用统一只读门禁命令执行，避免每次手工拼接六组参数产生差异。完整固定命令顺序为：

```bash
python3 -m py_compile \
  .agents/skills/nacos-api-doc-update/scripts/refresh_swagger.py \
  .agents/skills/nacos-api-doc-update/scripts/swagger_to_md.py \
  .agents/skills/nacos-api-doc-update/scripts/compare_doc_with_swagger.py \
  .agents/skills/nacos-api-doc-update/scripts/validate_all_api_docs.py
python3 .agents/skills/nacos-api-doc-update/scripts/validate_all_api_docs.py
npm run build
```

统一脚本不执行 `py_compile` 或站点构建；不得省略上面三条命令中的首尾两条。仅当 `npm run build` 退出码为 0 时，才能声明完整构建通过。

## 6. 结论报告

- **首先说明**：本次实际修改并保存了哪些文档文件（完整路径）；若未修改任何文件，必须明确写「未修改任何文档文件」及原因。
- 列出本次更新的文档文件及修改概要（若同时更新了 zh-cn 与 en，请分别列出）。
- 若本次**只更新了单一 locale**（zh-cn 或 en），在报告中明确写出「未更新另一 locale」，并建议补做另一侧同步。
- 列出需您确认或手动补充的项（不确定的描述、缺失的示例、跨版本兼容说明等）。

---

详细格式差异、各 doc 类型下的标题与表格约定见 [reference.md](reference.md)。脚本用法见 [reference.md](reference.md#脚本用法)。
