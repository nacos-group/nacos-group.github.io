# v3 HTTP API 文档更新核对记录

本记录供维护者复核，未作为官网页面发布，因此仅使用中文。更新范围为 `next` 的 Client、Admin、Console 中英文六页和对应六份 Swagger 快照；`latest`、历史版本、默认插件实现及 `ai-registry-adaptor` 不在本轮范围内。

## 输入基线

- Nacos 源码：`/Users/xiweng.yy/Documents/java/opensource/nacos`，分支 `v3.0-develop-swagger-generator`，HEAD `81aa3b8a470caf6e9ee8b61a2d76affc5022eb3d`，工作区干净，仅作只读参考。
- 文档基线：`develop-astro-nacos`，HEAD `03e9f0da24d`；工作分支 `docs/refresh-v3-openapi-20261026`。
- 2026-10-26 15:28–15:29（Asia/Shanghai）在线抓取，未使用备用 JSON。使用 `Accept-Language: zh-CN` / `en-US`，全部校验成功后成批替换；后续子任务只读该冻结快照。
- `info.version`：`3.3.0-RC`。操作数量 Client 25、Admin 195、Console 160，每组中英文 wire 结构一致。现有文档已覆盖全部 380 个接口，无需新增路由小节；接口起始版本沿用各 operation 的 `x-nacos-api-since.version`。
- 参考修复说明：Nacos 源码中的 `v3-api-swagger-coverage-scan.md` 和 `doc/v3-swagger-api-changelog.md`。
- 本轮是文档契约纠正，不将本次注解或模型转换器修正描述为新增业务能力或破坏性变更。

| 快照 | URL | SHA-256 |
| --- | --- | --- |
| Client en-US | `http://127.0.0.1:28848/nacos/v3/api-docs/client-api` | `42b1199b21e10ad839ffe3eb0a45df6fd9499585fa4b48f4cea0d9b9de714032` |
| Client zh-CN | 同上 | `e8ca59fdf349670dddd0f7af15aa638901d3de2d0aa947150cc96a9d8a2a3811` |
| Admin en-US | `http://127.0.0.1:28848/nacos/v3/api-docs/admin-api` | `47b1cad884819dc578ddaf7051dc52f3fa905e8d98bf0c50b0deb95de6034d6e` |
| Admin zh-CN | 同上 | `a57b1db78e86651dbcb9f31a20384b976c30f84a69e54875b660c7937035ae3f` |
| Console en-US | `http://127.0.0.1:28080/v3/api-docs/console-api` | `fea888a2e4aba1ec49e7c0c9f549c52f0d621106fa8e87223fe51eebd7482f6d` |
| Console zh-CN | 同上 | `ea87cfe13b09379cad5dd6110c843776511aab7661e0cf04d6f09342b5d1d614` |

## 修改内容

- `src/content/docs/next/{zh-cn,en}/manual/user/open-api.md`：Discover 诊断请求头、条件查询及 304 响应、ZIP 下载、命名列表类型和动态 Map 说明。
- `src/content/docs/next/{zh-cn,en}/manual/admin/admin-api.md`：灰度规则别名与优先级、默认值、请求体必填、字符串 ID、Map 值类型、列表/分页和统一返回体层级。
- `src/content/docs/next/{zh-cn,en}/manual/admin/console-api.md`：默认值、上传与 JSON 请求体、兼容 `setAsLatest`、状态查询对象、二进制导出及响应字段说明。
- 保留已有业务解释、鉴权示例、内部链接、章节顺序、命名领域模型和中英文对应关系。
- `map<string, any>` 表示值可为任意 JSON 类型；明确值类型的 Map、命名模型映射、固定字段以及禁止额外属性的 schema 不作同样放宽。
- 文档生成工具正确区分 `additionalProperties: true` / `{}`、明确值类型、`false` 与固定属性。新增可选 `--strict-response-types` 校验标量与 Map 类型，同时保留源码已确认、但 Swagger 泛型内联后丢失的领域类型名。
- 删除 11 条已修复的 multipart 文件必填豁免；保留 Console clone 和 Copilot 的两个精准规则，共三个差异，并更新源码提交和快照哈希。

## 已确认的 Swagger 与源码差异

以下路径均省略部署 context path。证据路径相对于上述冻结的 Nacos 源码；未修改 Nacos 源码。

| 接口 / 模型 | 差异与文档处理 | 代码证据 / 后续建议 |
| --- | --- | --- |
| `GET /v3/client/ai/skills`、`GET /v3/admin/ai/skills/version/download`、`GET /v3/console/ai/skills/version/download` | Swagger 声明 `application/octet-stream`；实际返回 `application/zip`。文档按实际 ZIP 响应说明，Client 条件请求的 304 无响应体。 | `ai/src/main/java/com/alibaba/nacos/ai/controller/SkillClientController.java:139`、同目录 `SkillAdminController.java:174–185`、`console/src/main/java/com/alibaba/nacos/console/controller/v3/ai/ConsoleSkillController.java:167–178`，公共构造器 `ai/src/main/java/com/alibaba/nacos/ai/utils/SkillRequestUtil.java:66,93`。建议修正下载媒体类型注解。 |
| `GET /v3/admin/ai/prompt/version/download`、`GET /v3/console/ai/prompt/version/download` | Swagger 声明 `application/octet-stream`；实际为 `text/markdown;charset=UTF-8` 和 attachment，不使用 JSON `Result`。文档按 Markdown 文件下载说明。 | `ai/src/main/java/com/alibaba/nacos/ai/controller/PromptAdminController.java:247–264`、`console/src/main/java/com/alibaba/nacos/console/controller/v3/ai/ConsolePromptController.java:239–257`、`ai/src/main/java/com/alibaba/nacos/ai/utils/PromptMarkdownBuilder.java:135–141`。建议同步修正下载媒体类型注解。 |
| `POST /v3/console/cs/config/clone` | `body[].cfgId` 实际用于选择源配置，Swagger 数组元素未标必填。文档保留必填及精准豁免。 | `console/src/main/java/com/alibaba/nacos/console/handler/impl/inner/config/ConfigInnerHandler.java:447–463`，`config/src/main/java/com/alibaba/nacos/config/server/service/ConfigCloneService.java:113–114`。建议补 DTO 的必填声明。 |
| `POST /v3/console/copilot/config` | Swagger 使用完整 `CopilotProperties`，额外暴露 `enabled`、`defaultNamespace`；Controller 只更新 `apiKey/model/studioUrl/studioProject`。文档仅列有效写入字段。 | `console/src/main/java/com/alibaba/nacos/console/controller/v3/ai/ConsoleCopilotConfigController.java:155–189`。建议使用独立写入 DTO。 |
| `GET /v3/admin/cs/ops/derby` | Swagger 的 `Result<Object>.data` 是未约束的 `{}`，没有提供实际 JDBC 查询行列表的结构。文档据源码写为 `array<map<string, any>>`。旧生成工具将未知 schema 默认解释为 string，不能据此声称 Swagger 明确声明了 string。 | `config/src/main/java/com/alibaba/nacos/config/server/controller/v3/ConfigOpsControllerV3.java:176–200`。建议为查询结果补准确泛型或响应 schema。 |

同名模型按本轮要求暂缓生成器修复，以下冲突在 Admin/Console 快照中仍存在，Client 组对应模型正确。相关操作保留源码确认的人工展开表：

| 同名类型 | 冲突结构 | 影响的上下文 |
| --- | --- | --- |
| `AgentProvider` | `api.ai.model.agent` 使用 `name/url`；`api.ai.model.a2a` 使用 `organization/url`，Swagger 保留后者。 | `/ai/agents` 及列表等 Agent 元数据响应。 |
| `AgentVersionDetail` | 新 Agent 包含 `namespaceId/agentName/status/callInterfaces` 等；A2A 只有 `version/createdAt/updatedAt/latest`，Swagger 保留后者。 | `GET /ai/agents/version`，`POST/PUT /ai/agents/draft`。 |
| `SecurityScheme` | MCP 模型有 `id/type/scheme/in/name/defaultCredential`，A2A 模型继承 `HashMap<String,Object>`；Swagger component 只剩 `empty` 等 Map 派生属性。 | MCP 工具安全配置，以及 A2A AgentCard 的安全定义。 |

上述包路径均位于 `api/src/main/java/com/alibaba/nacos/api/ai/model/`。例如 `AgentAdminController.java:294,360,390` 的返回泛型来自 `model.agent.AgentVersionDetail`；`model/mcp/McpToolSpecification.java:48` 引用本包 `SecurityScheme`。维护者后续应在 schema 命名和缓存层隔离完整类型身份。

另有一项已排除的误报：`GET /v3/admin/ns/health/checkers` 的响应值是 `AbstractHealthChecker`，Swagger 将该模型内联为带 `type` discriminator 的对象，其内容与命名组件完全一致。工具仅在泛型名称和内联模型精确匹配时恢复 `map<string, AbstractHealthChecker>`，不将它放宽为任意 JSON。

## 验证记录

初始 raw compare（每种语言）：Client 1 项，Admin 2 项，Console 16 项。该脚本原先只检查参数和命名响应类型，不能代替默认值、条件约束、标量 ID、二进制响应或 Map 值类型审查。

- 四个技能脚本 `py_compile` 通过。
- 六份 Swagger 无悬空引用，operation 数量正确，中英文结构相同；11 个 multipart 上传的请求体与 `file` 均显式必填。全部 operation 的 Since 与原文档一致，未按本次提交日期新增版本标记。
- 六份 raw compare：Client/Admin 为 0；Console 每种语言仅上述 3 条有证据的差异。带精准豁免的最终检查、全部响应路径/标量与 Map 类型/命名根类型检查均为 0；Agent 请求头严格检查通过。
- 统一门禁已纳入全量严格响应检查，以免下轮更新重新引入重复 `data` 或丢失字段类型。对 inline 泛型保留源码确认的命名类型，不能将脚本通过解释为对同名模型碰撞的修复。
- 中英文结构签名一致，分别包含 Client 25、Admin 195、Console 160 个唯一接口；frontmatter、章节和接口顺序保持原样，导航配置与 `latest` 无改动。
- 链接审查：372 个内部链接及其中 308 个锚点全部有效，包含 6 个 Swagger 页面入口；没有新增或删除旧链接。
- 70 处响应示例中的字符串 ID 检查通过；650 个 fenced JSON 可解析，708 个 Shell 示例通过 `bash -n` 语法检查。未执行示例中的业务写入请求。
- 工具回归：25 项动态/强类型 Map、数组容器、基本类型别名及 ID 路径断言，加 7 项精确内联 Map 模型恢复与约束保留断言通过。本次快照没有 Map 值为组合 schema 的情况，不将这些断言宣称为所有 OpenAPI 组合约束的验证。
- `npm run build` 最终退出码为 0，生成 3811 个页面及 sitemap；Pagefind 建立 2 个语言、1508 页、32631 词的搜索索引。六个 API 页面及本次修正的关键参数均已收录。
- 逐表核对最终生成 HTML 与 Markdown，共 1479 张表格内容一致；372 个最终页面正文内部链接及其锚点全部有效，六份发布 Swagger 资源与冻结输入逐字节一致。
- 修复中文 Client 文档历史示例中未闭合的行内代码，避免渲染时丢失版本前缀 `:v`；最终六页表格行的反引号均成对闭合。
- 构建使用本机现有 Node.js 20.13.1 / npm 10.5.2，以及项目已安装的 Pagefind x64 二进制（通过 `PAGEFIND_EXTENDED_BINARY_PATH` 指定）。未修改依赖或全局配置。
- 构建仍有既有 CSS 压缩、代码语言标签、浏览器兼容数据陈旧及中文搜索词干提示；均未导致失败。本轮未扩大修改这些站点级事项。
- 构建脚本自动刷新的贡献者 JSON 和头像已恢复；新下载的三个头像移至临时验证目录保留，不纳入改动。

最终构建日志：`/private/tmp/nacos-v3-doc-verify-20261026.y8t8M5/build-final-render.log`。该临时目录还保留快照、最终 HTML 表格及正文链接的核对脚本与构建前资料备份。
