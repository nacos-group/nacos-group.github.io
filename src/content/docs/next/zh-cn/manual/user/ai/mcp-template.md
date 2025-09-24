---
title: MCP模版配置手册
keywords: [MCP, HTTP]
description: Nacos 与 Higress 存量 HTTP 服务转化的模板配置说明
sidebar:
    order: 5
---

# Nacos MCP 存量服务模版配置
在添加tool的时候通过协议转化配置配置网关的模版

## 模版配置说明
模版是一个 JSON 配置，包含以下字段：

| 字段 | 说明 |
| --- | --- |
| requestTemplate | 请求参数模版 |
| argsPosition | 参数位置映射 |
| responseTemplate | 返回体模版 |
| errorResponseTemplate | 错误返回体模版（当 HTTP 状态码为非 2xx 时生效） |

### 上手指南
1. 定义请求：在 requestTemplate 中设置 url、method，必要时补充 headers。请求体/查询串的批量处理方式四选一：body | argsToJsonBody | argsToFormBody | argsToUrlParam（互斥）。
2. 放置参数：使用 argsPosition 为每个参数声明位置 query/path/header/cookie/body；并在 url/headers/body 中通过 {{ .args.<name> }} 引用这些参数。已显式声明位置的参数不会再参与批量处理。
3. 整理返回：在 responseTemplate 中用 body/prependBody/appendBody 组织输出。
4. 定制错误：如需在非 2xx 状态时自定义返回格式，配置 errorResponseTemplate（可读取 _headers 与响应体内容）。

提示：先实现最小可用（仅配置 url、method、argsToUrlParam），联通后逐步细化 headers、body 与响应内容。

### 请求参数模版（requestTemplate）
常用字段（依据 REST-to-MCP 工具配置定义）：

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| url | string | 是 | - | 请求 URL 模版，支持变量插值 |
| method | string | 是 | - | HTTP 方法（GET/POST 等） |
| headers | array<object> | 否 | [] | 请求头模版；元素包含 key、value 两项，value 支持插值 |
| headers[].key | string | 是 | - | 请求头名称 |
| headers[].value | string | 是 | - | 请求头值模版 |
| body | string | 否 | - | 请求体模版；与 argsToJsonBody/argsToUrlParam/argsToFormBody 互斥（配置了 body 时，将忽略 position: body 的参数以避免冲突） |
| argsToJsonBody | boolean | 否 | false | 为 true 时，未指定位置的参数将直接作为 JSON 请求体发送，并自动补充 Content-Type: application/json; charset=utf-8；与 body/argsToUrlParam/argsToFormBody 互斥 |
| argsToUrlParam | boolean | 否 | false | 为 true 时，未指定位置的参数将作为查询参数追加到 URL；与 body/argsToJsonBody/argsToFormBody 互斥 |
| argsToFormBody | boolean | 否 | false | 为 true 时，未指定位置的参数以 application/x-www-form-urlencoded 放入请求体，并自动补充对应的 Content-Type；与 body/argsToJsonBody/argsToUrlParam 互斥 |
| security | object | 否 | - | 请求到 REST API 的认证配置 |
| security.id | string | 当配置 security 时必填 | - | 引用 server.securitySchemes 中的认证方案 ID |
| security.credential | string | 否 | - | 覆盖 server.securitySchemes 的默认凭证；开启 tools[].security.passthrough 时将被忽略 |

可用变量与插值：

| 名称 | 说明 | 示例 |
| --- | --- | --- |
| 工具参数 | 通过 .args.<name> 引用工具入参 | Authorization: Bearer {{ .args.token }} |
| Nacos 引用 | 可引用同命名空间的配置 | key={{ ${nacos.appKey/amap}.data }} |

易错提醒：
- 批量选项四选一：body、argsToJsonBody、argsToUrlParam、argsToFormBody 互斥，只能选择其一。
- 使用 body 写 JSON 时需正确转义引号；结构复杂时可改用 argsToJsonBody（以参数直接构成 JSON）。
- 当参数已通过 argsPosition 显式声明位置（query/path/header/cookie/body）时，这些参数不会再参与批量选项；只有未声明位置的参数才会受 argsTo* 影响。
- 当 requestTemplate.body 已设置时，所有 position: body 的参数将被忽略，以避免与自定义 body 冲突。
示例见文末“示例汇总”。

> 提示：当已在 argsPosition 指定了参数位置（如 path/header/body），对应参数不会再被 argsToUrlParam 自动拼到查询串中。

### 参数位置信息（argsPosition）
使用 argsPosition 指定每个参数在 HTTP 请求中的位置（与 Higress 文档中的 args[].position 语义一致）。

| 取值 | 注入位置 | 说明 |
| --- | --- | --- |
| query | 查询参数 | 追加到 URL 查询串中 |
| path | 路径参数 | 用于占位替换，如 /users/{{ userId }} |
| header | 请求头 | 注入到 HTTP Header，如 X-Trace-Id |
| cookie | Cookie | 注入到 Cookie 中 |
| body | 请求体 | 注入到请求体（若 requestTemplate.body 已设置，则此位置的参数被忽略） |

使用要点：
- path：必须在 url 中存在对应占位符（例如 /users/{{ userId }}）。
- header：在 requestTemplate.headers 数组中添加 {key、value}，并在 value 中引用参数（例如 {"key":"X-Trace-Id","value":"{{ .args.traceId }}"}）。
- cookie：默认以参数名作为 Cookie 名；如需自定义，可在 headers 数组中添加 {key:"Cookie", value:"sessionId={{ .args.sessionId }}"}。
- query：若已显式声明到其他位置，则不会再被 argsToUrlParam 追加到查询串。

与批量参数选项的关系：
- 指定为 query/path/header/cookie/body 的参数，将按照所声明位置处理，不受 argsToJsonBody/argsToUrlParam/argsToFormBody 影响。
- 未声明位置的参数，才会被相应的批量选项处理。
- 若 requestTemplate.body 明确指定了请求体，则忽略 position: body 的参数，避免冲突。

示例见文末“示例汇总”。

### 返回体模版（responseTemplate）
常用字段：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| body | string | 否 | 直接作为最终响应体输出（与 prependBody/appendBody 互斥） |
| prependBody | string | 否 | 在原始响应体前追加文本（与 body 互斥） |
| appendBody | string | 否 | 在原始响应体后追加文本（与 body 互斥） |

建议：
- 若上游响应结构复杂，建议仅输出必要字段，避免直接透传冗长内容。
- 如需保留上游原始 JSON，同时补充上下文说明，可使用 prependBody/appendBody。

提示：对于非 2xx 的错误响应，可通过 errorResponseTemplate 定制错误返回内容，覆盖 responseTemplate 的行为。

示例见文末“示例汇总”。

### 错误返回体模版（errorResponseTemplate）
errorResponseTemplate 用于在上游 HTTP 响应状态码不在 [200, 300) 区间时渲染返回（即 <200 或 ≥300）。配置后，将优先使用该模板对错误响应进行改写（不再使用 responseTemplate）。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| errorResponseTemplate | string | 否 | 错误响应渲染模板；仅在非 2xx 状态触发 |

可用变量与上下文（与 responseTemplate 基本一致，另补充特殊头部访问方式）：

- JSON 字段：若响应体为 JSON，可直接取顶层字段，或使用 gjson 进行查询（如 {{ .error.message }} 或 {{ gjson "data.items.#.name" }}）
- 读取响应头：通过特殊 Map _headers 配合 gjson 访问任意响应头值，例如：
  - {{ gjson "_headers.\\:status" }} 获取 HTTP 状态码（注意 :status 需使用反斜杠转义）
  - {{ gjson "_headers.x-ca-error-code" }} 获取名为 x-ca-error-code 的响应头值

注意：
- 仅在 HTTP 状态码非 2xx 时生效；正常 2xx 响应仍由 responseTemplate 渲染。
- 若未配置 errorResponseTemplate，将使用网关/上游的默认错误响应（通常为原样透传）。

示例（提取状态码与错误码并回显部分原文）：

```json
{
  "errorResponseTemplate": "statusCode: {{ gjson \"_headers.\\\\:status\" }}\nerrorCode: {{ gjson \"_headers.x-ca-error-code\" }}\nraw: {{.data.value}}"
}
```

## 模板语法
REST-to-MCP 使用 GJSON Template 引擎渲染模版（Go Template + GJSON 路径查询）。它内置了 Helm/Sprig 常用函数集，便于进行字符串处理、数值运算、日期格式化、结构遍历与条件控制等。

参考：
- GJSON Template: https://github.com/higress-group/gjson_template
- GJSON 路径语法: https://github.com/tidwall/gjson#path-syntax
- Helm/Sprig 函数列表: https://helm.sh/docs/chart_template_guide/function_list/

### 请求模板
用于构造 HTTP 请求的 URL、Header 与 Body：
- 访问工具参数：`.args.<name>`（例如：`{{ .args.userId }}`）。
- 常用函数：
  - 序列化与编码：`toJson`、`toPrettyJson`、`toRawJson`、`urlquery`、`urlqueryescape`、`b64enc`、`b64dec`。
  - 容错与默认：`default`、`empty`、`coalesce`、`ternary`。
  - 日期时间：`now`、`date`、`dateInZone`、`dateModify`。

示例片段：

```json
{
  "requestTemplate": {
    "url": "https://api.example.com/users/{{ .args.userId }}",
    "method": "GET",
    "headers": [
      { "key": "Authorization", "value": "Bearer {{ .args.apiKey }}" }
    ]
  }
}
```

### 响应模板
用于将上游 HTTP 响应改写成适合 AI 消费的文本：
- 直接取 JSON 字段：`{{ .data.items }}`，或使用 `gjson` 进行复杂查询。
- 可用控制结构与函数（部分）：
  - 字符串：`trim`、`upper`、`lower`、`replace`、`nospace`。
  - 数学：`add`、`sub`、`mul`、`div`、`max`、`min`。
  - 列表：`list`、`first`、`last`、`uniq`、`sortAlpha`。
  - 字典：`dict`、`get`、`set`、`hasKey`、`pluck`。
  - 流程：`if`、`range`、`with`、`ternary`、`default`、`coalesce`。
  - 类型与格式：`toString`、`toJson`、`toPrettyJson`、`toRawJson`。
  - 其他：`uuidv4` 等。

示例片段：

```json
{
  "responseTemplate": {
    "body": "{{- range $i, $u := .users }}\n- {{ add $i 1 }}. {{ $u.name }} ({{ $u.id }})\n{{- end }}"
  }
}
```

### GJSON 路径语法要点
常用选择器：
- 点表示法：`address.city`
- 数组下标：`users.0.name`
- 数组迭代：`users.#.name`
- 条件过滤：`users.#(age>=30)#.name`
- 修饰符：`users.@reverse.#.name`
- 多路径：`{name:users.0.name,count:users.#}`
- 转义：`path.with\.dot`

配合 `gjson` 函数的示例：

```gotemplate
活跃用户：{{ gjson "users.#(active==true)#.name" }}
倒序用户名：{{ gjson "users.@reverse.#.name" }}
{{- /* 迭代过滤结果 */ -}}
管理员:
{{- range $u := gjson "users.#(roles.#(==admin)>0)#" }}
  - {{ $u.name }} ({{ $u.age }})
{{- end }}
```

## 在模版中直接引用nacos配置
可以在模版中直接引用同命名空间下的nacos配置，作为模版的值，引用的语法为`${nacos.dataId/group}`


| 能力 | 用法 | 说明 |
| --- | --- | --- |
| 基本引用 | ${nacos.dataId/group} | 取配置整体内容（字符串或 JSON 文本） |
| JSON 属性 | {{ ${nacos.dataId/group}.key }} | 配置为 JSON 时，可点取属性 |
| 组合插值 | ?k={{ ${nacos.appKey/amap}.data }} | 与请求路径、查询参数、头、体结合使用 |

例如要引用的配置的dataid 为 appCode， 分组为 data，则模版中nacos配置引用的写法为`${nacos.appCode/data}`

如果配置本身是json格式，则可以使用jsonpath引用配置中具体的json object的属性值，例如 appCode/data 的值为 `{"a": "b"}`则可以通过 `{{ ${nacos.appCode/data}.a }}` 引用appCode中的a的值 `b`

如果配置本身不是json格式，则会将整个配置的值作为string填充到引用处。

例如对amap的key进行引用，首先创建一个配置存储amap的key，例如存储在 dataId 为appKey， 分组为amap的配置中，配置内容为 `{"data": "xxxx"}`，示例见文末“示例汇总”。

注意：
- 引用不存在的配置会导致渲染失败或得到空值，请确保 dataId/group 正确并已发布。
- JSONPath 取值仅支持点语法的简单属性访问（如 .a、.a.b），不建议在模版中做复杂逻辑。
- 敏感信息（如密钥）建议以 Nacos 引用注入，不要硬编码在仓库。

#### 示例：引用 AMap Key

<Tabs>
  <TabItem label="Nacos 配置 appKey/amap">

```json
{
  "data": "xxxx-your-amap-key"
}
```

  </TabItem>
  <TabItem label="模板片段">

```json
{
  "requestTemplate": {
    "url": "/v3/weather/weatherInfo?key={{ ${nacos.appKey/amap}.data }}",
    "method": "GET",
    "argsToUrlParam": true
  }
}
```

  </TabItem>
</Tabs>

### 完整示例（串联 requestTemplate/argsPosition/responseTemplate）

```json
{
  "requestTemplate": {
    "url": "/users/{{ userId }}/orders?lang={{ .args.lang }}&key={{ ${nacos.appKey/amap}.data }}",
    "method": "GET"
  },
  "argsPosition": {
    "userId": "path",
    "lang": "query",
    "traceId": "header"
  },
  "responseTemplate": {
    "body": "用户：{{ .user.name }} 订单数：{{ len .orders }} "
  }
}
```

## 示例汇总

### 请求模版示例

<Tabs>
  <TabItem label="GET 查询参数">

使用 argsToUrlParam 将未映射到 path/header/body/cookie 的参数自动追加到 URL 查询串，适合简单 GET 接口。

```json
{
  "requestTemplate": {
    "url": "/v3/weather/weatherInfo",
    "argsToUrlParam": true,
    "method": "GET"
  }
}
```

  </TabItem>
  <TabItem label="路径 + Header + Nacos 引用">

同时演示路径占位替换、请求头注入，以及从 Nacos 读取 key 并拼入查询参数。

```json
{
  "requestTemplate": {
    "url": "/users/{{ .args.userId }}/detail?lang={{ .args.lang }}&key={{ ${nacos.appKey/amap}.data }}",
    "method": "GET",
    "headers": [
      { "key": "X-Trace-Id", "value": "{{ .args.traceId }}" }
    ]
  }
}
```

对应 Nacos 配置（appKey/amap）：

```json
{
  "data": "xxxx-your-amap-key"
}
```

  </TabItem>
  <TabItem label="POST JSON 请求体">

通过 body 直接构造 JSON 请求体（与 argsToJsonBody/argsToFormBody/argsToUrlParam 互斥）。

```json
{
  "requestTemplate": {
    "url": "/api/order/create",
    "method": "POST",
    "body": "{ \"productId\": \"{{ .args.productId }}\", \"count\": {{ .args.count }}, \"extra\": { \"note\": \"{{ .args.note }}\" } }"
  }
}
```

  </TabItem>
</Tabs>

### 参数位置信息示例

<Tabs>
  <TabItem label="query">

把 city 放到查询参数中，最终会以 ?city=xxx 形式出现在 URL 上。

```json
{
  "requestTemplate": {
    "url": "/v3/weather/weatherInfo",
    "argsToUrlParam": true,
    "method": "GET"
  },
  "argsPosition": {
    "city": "query"
  }
}
```

  </TabItem>
  <TabItem label="path">

把 userId 用于路径占位替换（/users/{{ userId }}/detail -> /users/123/detail）。

```json
{
  "requestTemplate": {
    "url": "/users/{{ userId }}/detail",
    "method": "GET"
  },
  "argsPosition": {
    "userId": "path"
  }
}
```

  </TabItem>
  <TabItem label="header">

将 traceId 注入到请求头 X-Trace-Id 中，用于链路追踪。

```json
{
  "requestTemplate": {
    "url": "/orders",
    "method": "GET"
  },
  "argsPosition": {
    "traceId": "header"
  }
}
```

  </TabItem>
  <TabItem label="cookie">

把 sessionId 注入到 Cookie，用于会话识别（如需自定义 Cookie 串可手工组织 headers 中的 Cookie）。

```json
{
  "requestTemplate": { "url": "/profile", "method": "GET" },
  "argsPosition": { "sessionId": "cookie" }
}
```

  </TabItem>
  <TabItem label="body">

把多个参数注入请求体，适合 POST/PUT 等需要提交数据的场景。

```json
{
  "requestTemplate": {
    "url": "/api/order/create",
    "method": "POST"
  },
  "argsPosition": {
    "productId": "body",
    "count": "body",
    "note": "body"
  }
}
```

  </TabItem>
</Tabs>

### 响应模版示例

<Tabs>
  <TabItem label="JSON 字段提取">

从 JSON 响应中直接取字段 city/weather/temp，组合为一行文字返回。

```json
{
  "responseTemplate": {
    "body": "城市：{{ .city }} 天气：{{ .weather }} 温度：{{ .temp }}℃"
  }
}
```

  </TabItem>
  <TabItem label="prepend/append 组合">

通过 prependBody/appendBody 在保留原始响应的同时增加上下文说明。

```json
{
  "responseTemplate": {
    "prependBody": "# 查询结果\n以下为原始 JSON：\n",
    "appendBody": "\n---\n以上为原始返回体，供进一步处理。"
  }
}
```

  </TabItem>
</Tabs>

### 错误响应模版示例

用于在上游返回非 2xx 状态时，提取状态码与错误头信息并回显部分原始内容。

<Tabs>
  <TabItem label="提取状态码与错误码">

```json
{
  "errorResponseTemplate": "statusCode: {{ gjson \"_headers.\\:status\" }}\nerrorCode: {{ gjson \"_headers.x-ca-error-code\" }}\nraw: {{.data.value}}"
}
```

  </TabItem>
</Tabs>

### Nacos 引用示例

从 Nacos 读取 appKey（amap）并作为 key 查询参数拼入 URL。

<Tabs>
  <TabItem label="Nacos 配置 appKey/amap">

```json
{
  "data": "xxxx-your-amap-key"
}
```

  </TabItem>
  <TabItem label="模板配置">

```json
{
  "requestTemplate": {
    "url": "/v3/weather/weatherInfo?key={{ ${nacos.appKey/amap}.data }}",
    "argsToUrlParam": true,
    "method": "GET"
  },
  "responseTemplate": {
    "body": "response value {{ .value }}"
  }
}
```

  </TabItem>
</Tabs>

### 完整示例（串联 requestTemplate/argsPosition/responseTemplate）

把请求模版、参数位置与响应模版串起来，展示一次完整的请求-响应改写流程。

```json
{
  "requestTemplate": {
    "url": "/users/{{ userId }}/orders?key={{ ${nacos.appKey/amap}.data }}",
    "method": "GET"
  },
  "argsPosition": {
    "userId": "path",
    "lang": "query",
    "traceId": "header"
  },
  "responseTemplate": {
    "body": "用户：{{ .user.name }} 订单数：{{ len .orders }}"
  }
}
```

对应 Nacos 配置（appKey/amap）：

```json
{
  "data": "xxxx-your-amap-key"
}
```
