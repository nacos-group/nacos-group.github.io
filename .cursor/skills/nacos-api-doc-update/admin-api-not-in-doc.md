# Admin API：文档覆盖说明

## 对比逻辑修复说明

此前「api.json 中有但文档中无的接口」列表为**误报**。原因是对比脚本 `compare_doc_with_swagger.py` 的小节分割正则只匹配了 `### 3.16.`（数字后带**点**）的小节标题，而 admin-api 文档中部分小节使用 `### 3.16 查询容量信息`（数字后为**空格**），导致这些小节未被识别为独立 API，从而被算作「文档中无」。

**已修复**：小节分割改为 `^### \d+\.\d+(?:\.|\s)`，同时支持 `### X.Y.` 与 `### X.Y ` 两种标题格式。修复后，GET/POST `/v3/admin/cs/capacity`（3.16、3.17）等接口均能正确匹配到文档。

## 当前状态

修复后重新执行对比，**已不再出现**「api.json 中有但文档中无的接口」段落，即 api.json 中的 Admin API 与文档中的小节已能一一对应。若仍有个别 path+method 未覆盖，可再次运行对比脚本定位：

```bash
python3 .cursor/skills/nacos-api-doc-update/scripts/compare_doc_with_swagger.py \
  --json public/swagger/admin/zh/api.json --doc-type admin \
  --doc-file src/content/docs/next/zh-cn/manual/admin/admin-api.md
```

输出中的「api.json 中有但文档中无的接口」仅会列出真正缺失的接口。
