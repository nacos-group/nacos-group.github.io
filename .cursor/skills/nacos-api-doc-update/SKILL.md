---
name: nacos-api-doc-update
description: Updates Nacos API documentation from Swagger api.json. **Must try to refresh api.json via curl first**; only if that fails, use existing api.json. **Compare** generated md with existing docs and **update in place** (add/remove params, fix URL/curl); **do not** use any sync script that overwrites sections (preserve existing descriptions and examples). Use when updating API docs from Swagger or generating console/admin/client API markdown.
---

# Nacos API 文档更新

根据 Swagger 导出的 `api.json` 更新文档仓库中的 API 文档（console-api、admin-api、open-api）。建议按**每个 api.json 拆分子计划**执行，避免混淆不同文档的格式。

## 执行顺序：必须先尝试更新 api.json

**每次执行本 skill 时，在生成或更新文档之前，必须先尝试用 curl 拉取最新的 api.json**（覆盖对应 `public/swagger/...` 下的文件）。  
**仅在 curl 失败时**（例如本地 Nacos 未启动、端口不可用、网络错误等）才使用仓库中已有的 api.json 进行生成，并在结论报告中说明「本次未更新 api.json，原因：xxx」。

不得以「仓库中 api.json 已修改」「担心本地服务未启动」等为由跳过更新步骤；**默认行为是先执行更新，失败再回退到已有文件**。

## 交付要求：必须产生实际文件变更

**本 skill 的交付结果是「已修改并保存」的文档文件**（如 `src/content/docs/next/zh-cn/manual/admin/console-api.md` 等），而不是仅创建脚本或仅生成未写入的文本。

- 结论报告中「已更新文档」须与仓库中**实际发生变更**的文件一致；若最终没有任何 `.md` 文件被修改，须在报告中明确说明「未修改任何文档文件」并给出原因。

## 更新方式：对比后针对性更新（禁止整段覆盖）

**禁止使用批量替换脚本**。禁止使用会整体覆盖文档段落或整篇的 sync/patch 脚本（如 `sync_doc_from_swagger.py` 及其同类脚本）。此类脚本会覆盖已有内容，导致**参数描述、返回说明、示例**（如 curl 中的真实示例值）丢失。仅允许使用**仅对比、不写文件的脚本**（如 `compare_doc_with_swagger.py`）生成差异报告，再在文档上做**针对性、逐处修改**。

**正确流程**：
1. 用 `swagger_to_md.py` 根据 api.json **生成**参考用的 Markdown 片段（可针对单个接口或整篇，用 `--filter-path` 等控制）。
2. **对比**「生成的片段」与「已有文档」中对应接口（按 #### 请求URL + 请求方式 匹配）。
3. **在已有文档上做针对性更新**（直接编辑对应的 `.md` 文件）：
   - **与 api.json 对齐**：参数表增删（文档多出的参数删掉、缺失的参数补上）、类型/必填与 api.json 一致；请求 URL、请求方式、鉴权状态按需修正；curl 示例中的 URL/参数名与 api.json 一致。
   - **保留已有内容**：已有文档中的**参数描述**、**返回字段描述**、**请求示例 / 返回示例**（含手写示例）应尽量保留；仅当某参数已从 api 移除时删掉该参数行，仅当缺少某参数时补上一行（描述可先来自生成片段或简写，后续再润色）。
4. 若某接口在 api.json 中为**新增**（文档中尚无对应小节），可将生成片段作为新小节插入文档，再按需润色描述与示例。

即：**以生成片段为参考做对比，只改需要同步的项，不整段替换，避免覆盖掉已有的描述和示例。**

## 1. 更新 Swagger api.json

在文档仓库根目录（nacos-group.github.io）下执行（需本地 Nacos Console 端口 8080、Nacos Server 端口 8848 可用）：

```bash
curl "http://localhost:8080/v3/api-docs/console-api" -H "accept-language:en-US" > public/swagger/console/en/api.json
curl "http://localhost:8080/v3/api-docs/console-api" -H "accept-language:zh-CN" > public/swagger/console/zh/api.json
curl "http://localhost:8848/nacos/v3/api-docs/admin-api" -H "accept-language:en-US" > public/swagger/admin/en/api.json
curl "http://localhost:8848/nacos/v3/api-docs/admin-api" -H "accept-language:zh-CN" > public/swagger/admin/zh/api.json
curl "http://localhost:8848/nacos/v3/api-docs/client-api" -H "accept-language:zh-CN" > public/swagger/client/zh/api.json
curl "http://localhost:8848/nacos/v3/api-docs/client-api" -H "accept-language:en-US" > public/swagger/client/en/api.json
```

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
- 找出**新增**或**发生变更**的 API（path/method/参数/返回结构变化）。
- 使用本 skill 自带的 **Python 脚本**（仅 `swagger_to_md.py`）生成符合现有 api.md 风格的 Markdown 片段，**作为对比参考**，不要用任何 sync 脚本把生成内容整段写回文档。

**重要：参数与 api.json 同步**。对**每个**已在文档中的接口，用 api.json 的 `parameters` / `requestBody` 与文档中的「请求参数」或「请求Body」表逐项对比：若文档里写了某参数而 api.json 中该 path+method 下已**没有**该参数，应在文档中**删除**该参数行；若 api.json 有而文档没有，应**补上**该参数行。脚本输出是“以 api.json 为准”的参考，用于**对比后在已有文档上做针对性修改**，保留文档中已有的描述与示例。

**脚本路径**：`.cursor/skills/nacos-api-doc-update/scripts/swagger_to_md.py`。在文档仓库根目录下执行，例如：

```bash
# console 文档（中文）
python .cursor/skills/nacos-api-doc-update/scripts/swagger_to_md.py \
  --json public/swagger/console/zh/api.json --doc-type console --locale zh-cn

# admin 文档（中文）
python .cursor/skills/nacos-api-doc-update/scripts/swagger_to_md.py \
  --json public/swagger/admin/zh/api.json --doc-type admin --locale zh-cn

# client 文档（中文）
python .cursor/skills/nacos-api-doc-update/scripts/swagger_to_md.py \
  --json public/swagger/client/zh/api.json --doc-type client --locale zh-cn
```

可选参数：`--filter-path "正则"` 只生成匹配 path 的接口；`--section-start N` 指定起始小节编号。脚本会从 api.json 解析 parameters/requestBody/response schema（含 Result、Result&lt;Page&lt;T&gt;&gt; 等），生成请求参数表、返回数据表及 curl 示例。生成时需区分的文档类型与格式见 [reference.md](reference.md)。

## 4. 审查与补全

- 对脚本生成的每一处内容做一次 review。
- **再次核对**：对已有接口，文档中的请求参数/请求Body 表是否与 api.json 完全一致（无多写、无漏写）。
- 根据对 `api.json`（OpenAPI 3）的理解，补全**错误**或**缺失**（如描述、示例、返回字段说明、鉴权说明等）。
- **不确定或需人工补充**的点记录到**结论报告**中，在任务结束时一并给出。

## 5. 结论报告

- **首先说明**：本次实际修改并保存了哪些文档文件（完整路径）；若未修改任何文件，必须明确写「未修改任何文档文件」及原因。
- 列出本次更新的文档文件及修改概要（若同时更新了 zh-cn 与 en，请分别列出）。
- 若本次**只更新了单一 locale**（zh-cn 或 en），在报告中明确写出「未更新另一 locale」，并建议补做另一侧同步。
- 列出需您确认或手动补充的项（不确定的描述、缺失的示例、跨版本兼容说明等）。

---

详细格式差异、各 doc 类型下的标题与表格约定见 [reference.md](reference.md)。脚本用法见 [reference.md](reference.md#脚本用法)。
