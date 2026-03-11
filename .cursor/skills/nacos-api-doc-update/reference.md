# Nacos API 文档格式参考

本文档说明 console-api、admin-api、open-api 三种文档的格式差异，以及脚本 `swagger_to_md.py` 的用法约定。

## 文档类型与格式差异

### Console API（console-api.md）

- **curl 基址**：`http://127.0.0.1:8080`（控制台端口，无 `/nacos` 前缀）。
- **请求 URL 展示**：path 原样，如 `/v3/console/ns/service`。
- **鉴权状态** 表述：公开为 `公开接口，无需身份信息。`；需鉴权时按**请求方式**区分：**GET/HEAD** 使用 `需要具有对应\`命名空间读取\`权限的用户身份。`，**POST/PUT/DELETE/PATCH** 使用 `需要具有对应\`命名空间写入\`权限的用户身份。`（脚本按 method 自动区分）。
- 包含 **鉴权状态** 小节。

### Admin API（admin-api.md）

- **curl 基址**：`http://127.0.0.1:8848/nacos`（Server 端口 + contextPath）。
- **请求 URL 展示**：path 需带 `/nacos` 前缀，如 `/nacos/v3/console/...`（与 api.json 中 path 的对应关系以实际 Swagger 为准）。
- **鉴权状态**：需鉴权时为 `需管理员权限`。
- 包含 **鉴权状态** 小节。

### Client / Open API（open-api.md）

- **curl 基址**：`127.0.0.1:8848/nacos`（与 admin 类似，文档中示例常省略 `http://`，脚本生成时可按现有文档风格统一）。
- **请求 URL 展示**：path 带 `/nacos` 前缀，如 `/nacos/v3/client/cs/config`。
- **不包含**「鉴权状态」小节（client 文档结构不同，仅请求方式、请求 URL、请求头、请求参数、返回数据、示例等）。
- 若有 **请求头** 表格，按现有 open-api 文档格式单独列出。

## 通用约定

- **请求参数**：不区分「请求参数」与「请求Body」，统一使用小节标题 **请求参数**；若既有 query 又有 body，可在同一小节下先后列出两个参数表。
- **请求参数表**：表头为 `| 参数名 | 类型 | 必填 | 参数描述 |`，类型与必填与 api.json 一致（必填可用 **是**）。
- **返回数据表**：表头为 `| 参数名 | 参数类型 | 描述 |`（或 `| 参数名 | 参数类型 | 描述 |`），描述来自 schema/description。
- **示例**：* 请求示例 / * 返回示例，请求示例使用 shell + curl；**POST/PUT 请求尽量使用 `-d` 包装请求参数**（如 `-d "key=value"` 或 `-d '{"key":"value"}'`），返回示例使用 json 代码块。
- **非 form 的请求体**：大部分 API 使用 form 表单（`application/x-www-form-urlencoded`）。若 API 使用 **application/json** 或 **multipart/form-data**（如文件上传），**仅在「请求方式」**中标注请求体类型（如「请求体类型：`application/json`」），并在请求示例中用 `-H 'Content-Type: application/json'` 或 `-F` 明确指定；**不要在「请求参数」下重复写「请求体为 xxx」**。脚本 `swagger_to_md.py` 已在请求方式下输出该说明，与现有文档一致。
- **请求参数结构**：若接口仅有 body 参数（无 query），请求参数下**只保留一个参数表**即可，**不要**添加「无（Query 参数）」或额外「请求参数」小节；请求体类型已在请求方式中说明。对比脚本 `compare_doc_with_swagger.py` 会按「单表且 api 无 query 仅有 body 时将该表视为 body」规则识别。
- 脚本生成内容应与 api.json 的 parameters/requestBody/response schema 一致，避免文档多出或漏掉参数。

## 脚本用法

- **路径**：`.cursor/skills/nacos-api-doc-update/scripts/swagger_to_md.py`
- **执行位置**：文档仓库根目录（nacos-group.github.io）。
- **必选参数**：
  - `--json`：api.json 路径，如 `public/swagger/console/zh/api.json`。
  - `--doc-type`：`console` | `admin` | `client`。
  - `--locale`：`zh-cn` | `en`（用于 i18n 占位，若脚本内有 locale 相关逻辑）。
- **可选参数**：
  - `--filter-path "正则"`：只生成 path 匹配该正则的接口。
  - `--section-start N`：起始小节编号（如从 1.5 开始则传入 5 或相应起始值，具体以脚本实现为准）。
- 脚本从 api.json 解析 `paths`、`components.schemas`，按 path + method 生成每个接口的 Markdown（接口描述、请求方式、鉴权状态、请求 URL、**请求参数**（统一标题，不区分 Body）、返回数据、示例）；POST/PUT 的 curl 示例使用 `-d` 包装参数；输出到 stdout，**仅作对比参考**，不可用整段覆盖的方式写回文档。

### 仅对比脚本（不写文件）

- **路径**：`.cursor/skills/nacos-api-doc-update/scripts/compare_doc_with_swagger.py`
- **作用**：对比已有文档与 api.json，输出差异报告（参数缺/多、必填不一致、curl 占位符等），**不修改任何文件**。可用于快速定位需要人工针对性修改的接口。
- **用法**：`python .cursor/skills/nacos-api-doc-update/scripts/compare_doc_with_swagger.py --json public/swagger/console/zh/api.json --doc-type console --doc-file src/content/docs/next/zh-cn/manual/admin/console-api.md`
- **禁止**：任何会批量替换文档内容的脚本（如已禁止的 sync_doc_from_swagger.py）。

## 更新方式：对比后针对性更新

- **禁止**使用会整体覆盖文档段落或整篇的 sync/patch 脚本（如已移除的 sync_doc_from_swagger.py），以免丢失已有文档中的参数描述、返回说明、示例。
- 正确做法：用 `swagger_to_md.py` 生成参考片段 → **对比**生成片段与已有文档中对应接口 → **直接编辑**已有 `.md`，只做必要同步（参数增删、类型/必填、URL、鉴权、curl 与 api.json 一致），**保留**已有文档里的参数描述、返回字段描述、请求/返回示例。
