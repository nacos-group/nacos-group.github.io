# Nacos API 文档格式参考

本文档说明 console-api、admin-api、open-api 三种文档的格式差异，以及脚本 `swagger_to_md.py` 的用法约定。

## 目录

- [文档类型与格式差异](#文档类型与格式差异)
- [通用约定](#通用约定)
- [脚本用法](#脚本用法)
- [Agent 管理专项规则](#agent-管理专项规则)
- [更新方式：对比后针对性更新](#更新方式对比后针对性更新)

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

- **请求参数**：不区分「请求参数」与「请求Body」，统一使用小节标题 **请求参数**；若既有 query 又有 body，合并到同一个参数表中展示，可在描述列注明参数来源。
- **请求参数表**：表头为 `| 参数名 | 类型 | 必填 | 参数描述 |`，类型与必填与 api.json 一致（必填可用 **是**）。
- **返回数据表**：表头为 `| 参数名 | 参数类型 | 描述 |`（或 `| 参数名 | 参数类型 | 描述 |`），描述来自 schema/description。
- **类型名称**：基础类型与容器关键字使用小写（如 `string`、`array<string>`、`map<string, object>`）；已知容器元素类型不得省略，例如 `array<integer>` 不能简化为 `array`。Swagger `$ref` 指向的命名 schema 保留原名称（如 `ServerVersionDetail`、`array<McpServerValidationItem>`）。当文档已展开某个命名类型时，引用字段必须继续使用该名称，不得降级为 `object` 或 `array<object>`。
- **统一返回体层级**：`Result<T>` 的业务字段直接位于根级 `data`。返回表写 `data`、`data.field`，不要写成 `data.data`；`code` 和 `message` 也不是 `data` 的子字段。
- **同名 schema 冲突**：当 Swagger 中一个 schema 名对应源码中多个不同包的模型时，核对 operation 返回类型、示例、Spec 和源码，不能仅按 `components.schemas` 中碰撞后留下的定义展开字段。
- **示例**：* 请求示例 / * 返回示例，请求示例使用 shell + curl；**POST/PUT 请求尽量使用 `-d` 包装请求参数**（如 `-d "key=value"` 或 `-d '{"key":"value"}'`），返回示例使用 json 代码块。
- **非 form 的请求体**：大部分 API 使用 form 表单（`application/x-www-form-urlencoded`）。若 API 使用 **application/json** 或 **multipart/form-data**（如文件上传），**仅在「请求方式」**中标注请求体类型（如「请求体类型：`application/json`」），并在请求示例中用 `-H 'Content-Type: application/json'` 或 `-F` 明确指定；**不要在「请求参数」下重复写「请求体为 xxx」**。脚本 `swagger_to_md.py` 已在请求方式下输出该说明，与现有文档一致。
- **请求参数结构**：若接口仅有 body 参数（无 query），请求参数下**只保留一个参数表**即可，**不要**添加「无（Query 参数）」或额外「请求参数」小节；请求体类型已在请求方式中说明。对比脚本 `compare_doc_with_swagger.py` 会按「单表且 api 无 query 仅有 body 时将该表视为 body」规则识别。
- 脚本生成内容应与 api.json 的 parameters/requestBody/response schema 一致，避免文档多出或漏掉参数。

## 脚本用法

### 安全刷新 Swagger

- **路径**：`.agents/skills/nacos-api-doc-update/scripts/refresh_swagger.py`
- 默认一次刷新 Admin、Console、Client 的中英文六份 Swagger。脚本使用 `curl -fSsL` 下载到临时目录，校验 JSON/OpenAPI、非空 operation、版本一致和每个 family 的 zh/en wire 结构后再替换目标文件。
- `--scope admin|console|client`：只刷新指定 family，但 zh/en 仍成对处理。
- `--validate-existing`：不联网、不写文件，也不创建仓库内临时目录；只验证仓库现有快照并输出 source HEAD、版本、operation 数量、SHA-256 与 URL。
- 任一抓取或校验失败时，不得改用直接重定向覆盖目标文件；保留原快照并报告失败。

- **路径**：`.agents/skills/nacos-api-doc-update/scripts/swagger_to_md.py`
- **执行位置**：文档仓库根目录（nacos-group.github.io）。
- **必选参数**：
  - `--json`：api.json 路径，如 `public/swagger/console/zh/api.json`。
  - `--doc-type`：`console` | `admin` | `client`。
  - `--locale`：`zh-cn` | `en`；标题、表头、必填值和鉴权说明会按 locale 输出。
- **可选参数**：
  - `--filter-path "正则"`：只生成 path 匹配该正则的接口。
  - `--section-start N`：起始小节编号（如从 1.5 开始则传入 5 或相应起始值，具体以脚本实现为准）。
- 脚本从 api.json 解析 `paths`、`components.schemas`，按 path + method 生成每个接口的 Markdown（接口描述、请求方式、鉴权状态、请求 URL、**请求参数**（统一标题，不区分 Body）、返回数据、示例）；POST/PUT 的 curl 示例使用 `-d` 包装参数；输出到 stdout，**仅作对比参考**，不可用整段覆盖的方式写回文档。

### 仅对比脚本（不写文件）

- **路径**：`.agents/skills/nacos-api-doc-update/scripts/compare_doc_with_swagger.py`
- **作用**：对比已有文档与 api.json，输出差异报告（参数缺/多、必填不一致、curl 占位符等），**不修改任何文件**。可用于快速定位需要人工针对性修改的接口。
- **用法**：`python .agents/skills/nacos-api-doc-update/scripts/compare_doc_with_swagger.py --json public/swagger/console/zh/api.json --doc-type console --doc-file src/content/docs/next/zh-cn/manual/admin/console-api.md`
- **豁免项（可选）**：对已确认的 Swagger 限制/bug，可使用 `--exemptions-file` 传入豁免文件（JSON），按 endpoint 精确忽略对应 issue。Admin 与 Console 共用 `.agents/skills/nacos-api-doc-update/exemptions/admin-console-api-exemptions.json`；Client 不使用该文件。
- **严格响应路径（新增/改动接口）**：使用 `--strict-response-paths` 检查 `Result<T>` 被错误写成 `data.code`、`data.message`、`data.data` 的重复包装。
- **命名响应根类型（新增/改动接口）**：使用 `--require-named-response-root`，要求响应表存在 `data | NamedType` 根行。
- **严格 Header（Header 相关接口）**：使用 `--strict-headers` 检查文档及 curl 多写的 Nacos Header、必填 Header 缺失，以及 `Request-Module` 是否为 `AI`。历史 Client API 可能保留 Swagger 未声明的 `Client-Version`、`User-Agent`，因此全量启用前应先治理或精准豁免；Agent 路由族必须严格启用。
- **JSON 示例**：使用 `--validate-json-examples` 解析文档中的所有 fenced JSON 示例。
- **豁免生命周期**：带豁免的全量扫描使用 `--audit-exemptions`；缺少证据元数据、使用宽泛规则或本轮未命中的豁免都会报错。带 `--filter-path` 时只审计匹配路径，最终仍需执行一次全量审计。
- **失败退出**：最终门禁必须使用 `--fail-on-diff`；发现任何未豁免问题时退出码为 1，不能只查看脚本是否“运行成功”。
- **禁止**：任何会批量替换文档内容的脚本（如已禁止的 sync_doc_from_swagger.py）。

### 六份文档统一门禁

- **路径**：`.agents/skills/nacos-api-doc-update/scripts/validate_all_api_docs.py`
- 一条命令校验现有 Swagger 快照、六份 raw compare、六份带精准豁免的最终 compare、Agent 严格响应/Header、豁免生命周期、中英文 operation 顺序和字段类型、JSON 示例及 `git diff --check`：

```bash
python3 .agents/skills/nacos-api-doc-update/scripts/validate_all_api_docs.py
```

- 该脚本不执行语法编译或站点构建；完整门禁固定依次执行 `python3 -m py_compile ...`、上述统一脚本、`npm run build`，并以三条命令退出码均为 0 为通过标准。

建议的 Agent Client 专项命令：

```bash
python3 .agents/skills/nacos-api-doc-update/scripts/compare_doc_with_swagger.py \
  --json public/swagger/client/zh/api.json \
  --doc-type client \
  --doc-file src/content/docs/next/zh-cn/manual/user/open-api.md \
  --filter-path '^/v3/client/ai/agents(?:/|$)' \
  --strict-headers \
  --strict-response-paths \
  --require-named-response-root \
  --validate-json-examples \
  --fail-on-diff
```

## Agent 管理专项规则

### Client Header 契约

必须以 `method + path` 为键，不能把同一路由族中某个接口的可选/必填规则复制到其他接口。

| API | `X-Nacos-Client-Id` | `Request-Module` |
|-----|---------------------|------------------|
| `GET /v3/client/ai/agents`（Discover） | 可选 | 不存在 |
| `GET /v3/client/ai/agents/search` | 可选 | 不存在 |
| `POST /v3/client/ai/agents`（发布定义） | 不存在 | 不存在 |
| `POST /v3/client/ai/agents/endpoints` | 必填 | 必填，值固定为 `AI` |
| `DELETE /v3/client/ai/agents/endpoints` | 必填 | 必填，值固定为 `AI` |
| `PUT /v3/client/ai/agents/endpoints/heartbeat` | 必填 | 必填，值固定为 `AI` |

- Client ID 长度为 1～256，匹配 `[A-Za-z0-9._:-]+`，无默认值。
- Search/Discover 携带 Client ID 时只续约已存在的 Client，不创建空 Client，也不续约 Endpoint Publisher 活性，不能代替 Publisher heartbeat。
- Endpoint 注册、注销、心跳的文档参数表和 curl 必须同时展示两个 Header；定义发布不得添加 Publisher Header。
- Spring `@RequestHeader(required=false)` 可能只是为了进入统一参数校验，不能单独作为可选依据；同时核对 Swagger `@Parameter`、服务端校验和 Spec。

### Agent 与 A2A 的边界

- Agent Management 是协议无关的主管理面和新接入推荐方向，其 API 计划逐步替代旧 A2A 管理 API；A2A 仍可作为协议适配器存在。不得将此写成“A2A 协议已废弃”或“旧 API 当前已全部删除”。
- 新用户和 SDK 优先兼容 Agent Management API；已有 A2A 集成按后续发布及迁移说明逐步切换。兼容截止版本必须来自当次 Spec/发布说明。
- 若 Agent 定义可投影为 AgentCard，不应描述成同时维护第二套独立事实源；旧 A2A Endpoint 的存储和替换语义只有在对应 Spec/源码已变更时才能改写。

### 同名模型碰撞检查

每次刷新都要重新检测以下简单类名是否仍对应多个 FQCN；若 Swagger 已提供唯一 schema 名，应以修复后的 schema 为准并移除 workaround。

| 上下文 | 当前应核对的源码模型与关键字段 |
|--------|------------------------------|
| Agent Management、RAD、`/ai/agents` | `model.agent.AgentProvider`：`name`、`url` |
| 旧 A2A / AgentCard | `model.a2a.AgentProvider`：`organization`、`url` |
| Agent 管理或定义发布返回 | `model.agent.AgentVersionDetail`：`namespaceId`、`agentName`、`version`、`status`、`callInterfaces`、作者、摘要和审计时间 |
| A2A 版本列表 | `model.a2a.AgentVersionDetail`：`version`、`createdAt`、`updatedAt`、`latest` |

判断顺序为：适用且已实现的 Spec → Controller 返回泛型/import/外层 DTO → 源码模型与服务校验 → operation 示例 → 碰撞后的 Swagger component。修正仅限对应 operation/章节，禁止全局替换简单类名。

### 路由族完整性

- 使用 `^/v3/(admin|console|client)/ai/agents(?:/|$)`，避免把 `/agentspecs` 误计入。
- Admin/Console 去除 surface 前缀后按 `method + relative path` 比较；Client RAD 路由族单独比较。
- 本次快照的回归参考为 Admin 17、Console 17、Client 6。该数字用于发现意外遗漏，不得阻止由新 Swagger/源码确认的合法新增 API；新增后应同步更新回归参考。

## 更新方式：对比后针对性更新

- **禁止**使用会整体覆盖文档段落或整篇的 sync/patch 脚本（如已移除的 sync_doc_from_swagger.py），以免丢失已有文档中的参数描述、返回说明、示例。
- 正确做法：用 `swagger_to_md.py` 生成参考片段 → **对比**生成片段与已有文档中对应接口 → **直接编辑**已有 `.md`，只做必要同步（参数增删、类型/必填、URL、鉴权、curl 与 api.json 一致），**保留**已有文档里的参数描述、返回字段描述、请求/返回示例。
