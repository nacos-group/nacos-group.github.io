---
name: nacos-doc-sync-en
description: Syncs Chinese (zh-cn) documentation changes to corresponding English (en) files. Automatically creates or updates the English counterpart whenever a zh-cn doc is created or edited under src/content/docs/ or src/content/download/. Use when creating, editing, or updating any zh-cn documentation file.
---

# Nacos 中英文文档同步

当创建或编辑 `zh-cn` 文档时，自动同步创建或更新对应的 `en` 英文文档。

## 适用范围

| 内容类型 | 中文路径 | 英文路径 |
|---------|---------|---------|
| 版本文档 | `src/content/docs/{version}/zh-cn/...` | `src/content/docs/{version}/en/...` |
| 下载页面 | `src/content/download/zh-cn/...` | `src/content/download/en/...` |

## 工作流程

### 1. 识别被修改的中文文件

当你创建或编辑了一个路径中包含 `zh-cn` 的文档文件（`.md` 或 `.mdx`），记录该文件路径。

### 2. 计算英文文件路径

将路径中的 `zh-cn` 替换为 `en`：

- `src/content/docs/next/zh-cn/manual/admin/console-api.md` → `src/content/docs/next/en/manual/admin/console-api.md`
- `src/content/download/zh-cn/nacos-server.mdx` → `src/content/download/en/nacos-server.mdx`

### 3. 判断英文文件是否已存在

- **已存在** → 读取英文文件，将本次中文变更同步到英文文件（编辑模式）。
- **不存在** → 基于中文文件创建英文文件（创建模式）。

### 4. 同步内容

#### 创建模式（英文文件不存在）

1. 复制中文文件的完整内容。
2. 翻译 frontmatter：`title`、`keywords`、`description` 翻译为英文；其余字段（`sidebar`、`order`、`position` 等）保持不变。
3. 翻译正文内容为英文，保持：
   - Markdown 结构（标题层级、列表、表格、代码块）完全一致。
   - 所有链接、图片路径、import 语句、组件引用不变。
   - 代码示例中的注释翻译为英文，代码本身不变。
   - 专有名词保留原文（如 Nacos、gRPC、Spring Cloud 等）。

#### 编辑模式（英文文件已存在）

1. 对比中文文件的变更内容（新增、修改、删除的段落）。
2. 在英文文件中找到对应位置，应用等效的英文变更：
   - **新增段落**：在英文文件的相同位置插入翻译后的英文段落。
   - **修改段落**：更新英文文件中对应段落的翻译。
   - **删除段落**：在英文文件中删除对应段落。
3. 如果 frontmatter 有变更（如 `title`、`keywords`、`description`），同步翻译更新。
4. 保留英文文件中已有的、未被本次变更影响的翻译内容，不要重新翻译未变更的部分。

### 5. 确认目录存在

写入英文文件前，确保目标目录存在。如 `en` 子目录不存在，先创建。

### 6. 输出结果

完成同步后，向用户说明：

- 同步的英文文件路径。
- 同步类型（创建 / 更新）。
- 主要同步内容概要。

## 翻译规范

- 技术文档风格，简洁准确。
- 使用英文技术社区的惯用表达，不要逐字直译。
- 表格中的内容逐单元格翻译。
- `:::tip`、`:::note`、`:::caution` 等 admonition 内部内容翻译，标记本身不变。
- frontmatter 中 `sidebar.label`（如存在）也需翻译。
- 若中文文件中存在英文段落（如 API 路径、代码），保持不变。

## 不处理的情况

- 编辑的文件路径中不包含 `zh-cn`（如直接编辑 `en` 文件），不触发同步。
- `_sidebar.json` 的翻译由 `translations.en` 字段管理，不在此 skill 范围内。
- `src/i18n/` 下的 UI 翻译文件不在此 skill 范围内。

## 注意事项

- 同步是**单向**的：`zh-cn` → `en`。
- 保持文件扩展名一致（`.md` 对 `.md`，`.mdx` 对 `.mdx`）。
- 不要改动中文源文件。
- 如果英文文件已存在但内容结构与中文差异较大（如历史遗留），优先以中文文件结构为准，但保留英文文件中已翻译好的内容。
