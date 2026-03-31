# 文档反馈处理示例

## 解析 Content Source 得到路径

| Content Source URL 片段 | 提取的本地路径 |
|-------------------------|----------------|
| `.../tree/develop-astro-nacos/src/content/docs/v3.0/zh-cn/manual/admin/upgrading.mdx` | `src/content/docs/v3.0/zh-cn/manual/admin/upgrading.mdx` |
| `.../blob/develop/src/content/docs/latest/en/manual/user/java-sdk/usage.md` | `src/content/docs/latest/en/manual/user/java-sdk/usage.md` |

从 URL 中定位 `src/content`，从该词开始到 URL 末尾即为路径（去掉分支名等前缀）。

## 配对语言与多版本

给定路径 `src/content/docs/v3.0/zh-cn/manual/admin/upgrading.mdx`：

- **版本**：v3.0  
- **相对路径**（版本与 locale 之后）：`manual/admin/upgrading.mdx`  
- **同文档英文**：`src/content/docs/v3.0/en/manual/admin/upgrading.mdx`  
- **同大版本其他版本**（若维护者未限定）：next、latest 下同相对路径，即  
  - `src/content/docs/next/zh-cn/manual/admin/upgrading.mdx`  
  - `src/content/docs/next/en/manual/admin/upgrading.mdx`  
  - `src/content/docs/latest/zh-cn/manual/admin/upgrading.mdx`  
  - `src/content/docs/latest/en/manual/admin/upgrading.mdx`  

若维护者写“只改 v3.0、next、latest”，则只改上述 6 个文件中实际存在的那些，不找 v2.x。

## 版本边界

- 反馈来自 `docs/v3.0/...`：只考虑 v3.0、next、latest 等 3.x 版本，**不**改 v2.4、v2.5 等。  
- 反馈来自 `docs/v2.5/...`：只考虑 v2.x 版本，**不**改 v3.0、next、latest。  
- 仅当维护者明确说“同时修改 2.x”或“所有版本”时，才跨大版本修改。
