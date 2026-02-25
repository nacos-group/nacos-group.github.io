---
name: nacos-doc-feedback
description: Finds nacos.io doc files from GitHub Content Source URLs, resolves both zh-cn and en counterparts, applies feedback and maintainer suggestions with version-scoped edits. Use when the user pastes a feedback block containing "文档详细信息", "Content Source", or "nacos.io ➟ GitHub 问题链接".
---

# Nacos 文档反馈处理

根据结构化反馈块，定位文档文件并按反馈与维护者建议修改内容。文档仓库根目录为 `src/content/docs`，结构为 `{version}/{locale}/...`（版本如 v3.0、next、latest，语言如 zh-cn、en）。

## 输入格式识别

反馈块通常包含三部分：

1. **用户反馈**：`[在此处输入反馈]` 下方的原始反馈内容。
2. **文档详细信息**（勿编辑）：含 Version ID、Content URL、**Content Source**（GitHub 文档源码 URL）、Service。
3. **Nacos维护者修改建议**（可选）：指定修改范围或具体建议。

从 **Content Source** 提取本地路径：URL 中从 `src/content` 开始到末尾即为仓库内路径。例如：

- `https://github.com/nacos-group/nacos-group.github.io/tree/develop-astro-nacos/src/content/docs/v3.0/zh-cn/manual/admin/upgrading.mdx`  
  → 路径：`src/content/docs/v3.0/zh-cn/manual/admin/upgrading.mdx`

若 URL 带 `blob` 或只有路径片段，同样只保留从 `src/content` 起的部分。在**当前工作区**（nacos-group.github.io）下按该路径查找文件。

## 工作流程

### 1. 解析反馈块

- 提取**用户反馈**正文。
- 提取 **Content Source**，得到 `src/content/docs/{version}/{locale}/...`。
- 提取**维护者修改建议**（若有）：是否限定版本、是否限定语言、具体改法。

### 2. 确定要修改的文件

**按 Content Source 找主文件**  
- 在仓库根下定位 `src/content/docs/{version}/{locale}/...` 的完整路径，确认文件存在。

**配对另一种语言**  
- 文档结构为 `docs/{version}/{locale}/...`，locale 为 `zh-cn` 或 `en`。
- 同一版本、同一相对路径下，若存在另一 locale，则**同时修改中英文**：  
  - 当前为 `zh-cn` → 再找同版本的 `en` 同路径文件并修改。  
  - 当前为 `en` → 再找同版本的 `zh-cn` 同路径文件并修改。  
- 若另一语言文件不存在（例如仅存在 zh-cn），则只改现有文件。

**版本范围（重要）**  
- **维护者明确指定版本**（如“只改 v3.0、next、latest”）：仅修改这些版本下的对应路径文件。  
- **维护者未指定版本**：  
  - 根据 Content Source 中的版本（如 v3.0）判断**大版本**（3.x）。  
  - 仅在**同一大版本**内查找其他版本（如 v3.0、next、latest 等）的同一相对路径；若存在且内容上存在相同问题，则**同步修改**。  
  - **不得**修改其他大版本（如 2.x、1.x）的文档，除非维护者明确要求“同时修改 2.x”等。

### 3. 执行修改

- 根据**用户反馈**理解缺失或错误（如“未涉及客户端兼容性”“需补充 3.0.3 与 1.x/2.x 兼容说明”）。  
- 优先遵循**维护者修改建议**（版本范围、是否只改部分版本、表述要求等）。  
- 对每个选中的文件：读入内容 → 按反馈与建议编辑（增补、改写、统一表述）→ 写回。  
- 中英文需**语义一致**，仅语言不同；若只改了一侧，务必同步另一侧。

### 4. 输出

- 列出本次修改的文件路径。  
- 简要说明每处修改点（如“在 upgrading.mdx 中增加客户端兼容性说明”“同步到 en 与 v3.0/next/latest”）。

## 路径与版本约定

| 项目     | 说明 |
|----------|------|
| 仓库根   | 工作区为 nacos-group.github.io，文档根为 `src/content/docs`。 |
| 版本目录 | 如 `v3.0`、`v2.5`、`next`、`latest`；大版本由主版本号区分（3.x、2.x）。 |
| 语言目录 | `zh-cn`、`en`，紧跟在版本目录下。 |
| 同文档   | 同一“文档”= 相同版本下相同相对路径（仅 locale 不同）。 |

## 示例

**反馈块示例：**

```text
[在此处输入反馈]
升级文档中未涉及客户端兼容性情况，比如 3.0.3 服务版本是否兼容客户端 1.x 2.x
---
#### 文档详细信息
* Content Source: https://github.com/nacos-group/nacos-group.github.io/tree/develop-astro-nacos/src/content/docs/v3.0/zh-cn/manual/admin/upgrading.mdx
* Service: 用户指南/开发指南/运维指南
---
[Nacos维护者修改建议]
只需要添加 v3.0、next、latest 3 个版本的文档。
```

**处理步骤简述：**

1. 路径：`src/content/docs/v3.0/zh-cn/manual/admin/upgrading.mdx`。  
2. 版本范围：仅 v3.0、next、latest（按维护者建议）。  
3. 文件集合：对 v3.0、next、latest 各取 zh-cn 与 en 的 `manual/admin/upgrading.mdx`（存在则加入）。  
4. 修改内容：在升级文档中增加客户端兼容性说明（如 3.0.3 与 1.x/2.x 兼容情况），中英文一致。

## 注意事项

- 不要修改反馈块中的“文档详细信息”部分。  
- 大版本边界：3.x 反馈不自动改 2.x/1.x；2.x 反馈不自动改 3.x/1.x；除非维护者明确要求。  
- 若某版本或某语言下无对应文件（路径不存在），跳过该组合，不创建新文件。  
- 编辑时保持原有 frontmatter、标题层级和站内链接格式。

## 更多示例

路径解析与多版本/语言配对示例见 [examples.md](examples.md)。
