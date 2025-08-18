---
title: MCP Template Configuration Manual
keywords: [MCP, HTTP]
description: Template configuration for converting existing HTTP services to MCP with Nacos and Higress
sidebar:
    order: 4
---

# Nacos MCP Existing Service Template Configuration
When adding a tool, use protocol-conversion settings to configure the gateway template.

## Template Overview
The template is a JSON configuration with the following fields:

| Field | Description |
| --- | --- |
| requestTemplate | Request parameter template |
| argsPosition | Parameter location mapping |
| responseTemplate | Response template |
| errorResponseTemplate | Error response template (applies when HTTP status code is non-2xx) |

### Quick Start
1. Define the request: set url and method in requestTemplate, and add headers if needed. Choose exactly one bulk parameter handling mode for the request body/query: body | argsToJsonBody | argsToFormBody | argsToUrlParam (mutually exclusive).
2. Place parameters: declare each parameter's location using argsPosition as query/path/header/cookie/body; then reference these parameters in url/headers/body via {{ .args.<name> }}. Parameters with an explicit location won't participate in bulk handling.
3. Shape the response: organize the output using body/prependBody/appendBody in responseTemplate.
4. Customize errors: if you need a custom format when the status is non-2xx, configure errorResponseTemplate (can read _headers and the response body).

Tip: start minimal (just configure url, method, argsToUrlParam). Once connectivity is verified, refine headers, body, and response content.

### Request Template (requestTemplate)
Common fields (based on REST-to-MCP tool configuration):

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| url | string | Yes | - | Request URL template, supports interpolation |
| method | string | Yes | - | HTTP method (GET/POST, etc.) |
| headers | array<object> | No | [] | Request header template; elements contain key and value; value supports interpolation |
| headers[].key | string | Yes | - | Header name |
| headers[].value | string | Yes | - | Header value template |
| body | string | No | - | Request body template; mutually exclusive with argsToJsonBody/argsToUrlParam/argsToFormBody (when body is set, parameters with position: body are ignored to avoid conflicts) |
| argsToJsonBody | boolean | No | false | When true, unspecified-location parameters are sent directly as the JSON request body and Content-Type: application/json; charset=utf-8 is auto-added; mutually exclusive with body/argsToUrlParam/argsToFormBody |
| argsToUrlParam | boolean | No | false | When true, unspecified-location parameters are appended to the URL as query params; mutually exclusive with body/argsToJsonBody/argsToFormBody |
| argsToFormBody | boolean | No | false | When true, unspecified-location parameters are placed in the request body as application/x-www-form-urlencoded and the corresponding Content-Type is auto-added; mutually exclusive with body/argsToJsonBody/argsToUrlParam |
| security | object | No | - | Authentication config for the REST API request |
| security.id | string | Required when security is configured | - | References an auth scheme ID declared in server.securitySchemes |
| security.credential | string | No | - | Overrides the default credential in server.securitySchemes; ignored when tools[].security.passthrough is enabled |

Available variables and interpolation:

| Name | Description | Example |
| --- | --- | --- |
| Tool args | Reference tool input via .args.<name> | Authorization: Bearer {{ .args.token }} |
| Nacos reference | Reference configs in the same namespace | key={{ ${nacos.appKey/amap}.data }} |

Common pitfalls:
- Exactly one of the four bulk options: body, argsToJsonBody, argsToUrlParam, argsToFormBody.
- When writing JSON via body, escape quotes properly; for complex structures, prefer argsToJsonBody (use args directly to form JSON).
- Parameters explicitly placed via argsPosition (query/path/header/cookie/body) are excluded from bulk options; only unspecified ones are affected by argsTo*.
- When requestTemplate.body is set, all parameters with position: body are ignored to prevent conflicts with the custom body.
See “Examples” at the end.

> Tip: when a parameter's location is set via argsPosition (e.g., path/header/body), it will not be auto-appended to the query string by argsToUrlParam.

### Parameter Location (argsPosition)
Use argsPosition to specify where each parameter goes in the HTTP request (semantics aligned with args[].position in the Higress docs).

| Value | Injected into | Notes |
| --- | --- | --- |
| query | Query parameters | Appended to the URL query string |
| path | Path parameters | For placeholder replacement, e.g., /users/{{ userId }} |
| header | Request headers | Injected into HTTP headers, e.g., X-Trace-Id |
| cookie | Cookie | Injected into Cookie |
| body | Request body | Injected into the body (ignored if requestTemplate.body is set) |

Usage notes:
- path: the url must contain the corresponding placeholder (e.g., /users/{{ userId }}).
- header: add {key, value} to requestTemplate.headers and reference the parameter in value (e.g., {"key":"X-Trace-Id","value":"{{ .args.traceId }}"}).
- cookie: by default the parameter name is used as the cookie name; to customize, add {key:"Cookie", value:"sessionId={{ .args.sessionId }}"} to headers.
- query: if the parameter is already explicitly placed elsewhere, it won't be appended by argsToUrlParam.

Relationship to bulk options:
- Parameters set as query/path/header/cookie/body are processed according to their declared location; they are not affected by argsToJsonBody/argsToUrlParam/argsToFormBody.
- Only parameters without a declared location are handled by the corresponding bulk option.
- If requestTemplate.body explicitly defines the request body, parameters with position: body are ignored to avoid conflicts.

See “Examples” at the end.

### Response Template (responseTemplate)
Common fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| body | string | No | Used as the final response body output (mutually exclusive with prependBody/appendBody) |
| prependBody | string | No | Prepend text before the original response body (mutually exclusive with body) |
| appendBody | string | No | Append text after the original response body (mutually exclusive with body) |

Recommendations:
- If the upstream response is complex, output only necessary fields to avoid relaying verbose content.
- To keep the original JSON while adding context, use prependBody/appendBody.

Tip: for non-2xx error responses, use errorResponseTemplate to customize error outputs; this overrides responseTemplate behavior.

See “Examples” at the end.

### Error Response Template (errorResponseTemplate)
errorResponseTemplate is rendered when the upstream HTTP status code is not in [200, 300) (i.e., <200 or ≥300). When configured, this template takes precedence to rewrite error responses (responseTemplate is not used).

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| errorResponseTemplate | string | No | Error response rendering template; triggered only on non-2xx statuses |

Available variables and context (similar to responseTemplate with special header access):

- JSON fields: if the response body is JSON, read top-level fields directly or use gjson for queries (e.g., {{ .error.message }} or {{ gjson "data.items.#.name" }})
- Read response headers: access any header value via a special map _headers combined with gjson, e.g.:
  - {{ gjson "_headers.\\:status" }} gets the HTTP status code (note :status needs escaping with backslashes)
  - {{ gjson "_headers.x-ca-error-code" }} gets the value of header x-ca-error-code

Notes:
- Applies only when HTTP status is non-2xx; normal 2xx responses are still rendered by responseTemplate.
- If errorResponseTemplate is not configured, the gateway/upstream's default error response is used (usually a passthrough).

Example (extract status code and error code and echo part of the original text):

```json
{
  "errorResponseTemplate": "statusCode: {{ gjson \"_headers.\\\\:status\" }}\nerrorCode: {{ gjson \"_headers.x-ca-error-code\" }}\nraw: {{.data.value}}"
}
```

## Template Syntax
REST-to-MCP uses the GJSON Template engine to render templates (Go Template + GJSON path queries). It bundles the common Helm/Sprig function set for string processing, numeric operations, date formatting, structure traversal, and control flow.

References:
- GJSON Template: https://github.com/higress-group/gjson_template
- GJSON path syntax: https://github.com/tidwall/gjson#path-syntax
- Helm/Sprig functions: https://helm.sh/docs/chart_template_guide/function_list/

### Request templates
Used to construct URL, headers, and body for HTTP requests:
- Access tool args: `.args.<name>` (e.g., `{{ .args.userId }}`).
- Common functions:
  - Serialization and encoding: `toJson`, `toPrettyJson`, `toRawJson`, `urlquery`, `urlqueryescape`, `b64enc`, `b64dec`.
  - Defaults and resilience: `default`, `empty`, `coalesce`, `ternary`.
  - Dates and time: `now`, `date`, `dateInZone`, `dateModify`.

Snippet:

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

### Response templates
Used to rewrite upstream HTTP responses into AI-friendly text:
- Read JSON fields directly: `{{ .data.items }}`, or use `gjson` for complex queries.
- Control structures and functions (subset):
  - Strings: `trim`, `upper`, `lower`, `replace`, `nospace`.
  - Math: `add`, `sub`, `mul`, `div`, `max`, `min`.
  - Lists: `list`, `first`, `last`, `uniq`, `sortAlpha`.
  - Dicts: `dict`, `get`, `set`, `hasKey`, `pluck`.
  - Flow: `if`, `range`, `with`, `ternary`, `default`, `coalesce`.
  - Types and formatting: `toString`, `toJson`, `toPrettyJson`, `toRawJson`.
  - Misc: `uuidv4`, etc.

Snippet:

```json
{
  "responseTemplate": {
    "body": "{{- range $i, $u := .users }}\n- {{ add $i 1 }}. {{ $u.name }} ({{ $u.id }})\n{{- end }}"
  }
}
```

### GJSON Path Syntax Highlights
Common selectors:
- Dot notation: `address.city`
- Array index: `users.0.name`
- Array iteration: `users.#.name`
- Conditional filter: `users.#(age>=30)#.name`
- Modifiers: `users.@reverse.#.name`
- Multi-path object: `{name:users.0.name,count:users.#}`
- Escaping: `path.with\.dot`

Examples with `gjson`:

```gotemplate
Active users: {{ gjson "users.#(active==true)#.name" }}
Usernames reversed: {{ gjson "users.@reverse.#.name" }}
{{- /* Iterate filtered results */ -}}
Admins:
{{- range $u := gjson "users.#(roles.#(==admin)>0)#" }}
  - {{ $u.name }} ({{ $u.age }})
{{- end }}
```

## Directly referencing Nacos configs in templates
You can directly reference Nacos configs in the same namespace as template values. The syntax is `${nacos.dataId/group}`.

| Capability | Usage | Notes |
| --- | --- | --- |
| Basic reference | ${nacos.dataId/group} | Retrieve the entire config content (string or JSON text) |
| JSON property | {{ ${nacos.dataId/group}.key }} | If the config is JSON, access properties via dot notation |
| Mixed interpolation | ?k={{ ${nacos.appKey/amap}.data }} | Combine with path, query, headers, and body |

For example, to reference a config with dataId appCode and group data, write `${nacos.appCode/data}` in the template.

If the config itself is JSON, you can reference a specific property using dot notation. For example, if appCode/data is `{"a": "b"}`, then `{{ ${nacos.appCode/data}.a }}` yields `b`.

If the config is not JSON, the entire config will be inserted as a string at the reference point.

For referencing the AMap key, first create a config storing the AMap key, e.g., save `{"data": "xxxx"}` under dataId appKey and group amap. See the examples section at the end.

Notes:
- Referencing a non-existent config may cause rendering failures or empty values; ensure dataId/group is correct and published.
- JSONPath access supports only simple dot-notation property access (e.g., .a, .a.b). Avoid complex logic in templates.
- For secrets (such as keys), prefer injecting via Nacos references instead of hardcoding in the repo.

#### Example: Reference AMap Key

<Tabs>
  <TabItem label="Nacos config appKey/amap">

```json
{
  "data": "xxxx-your-amap-key"
}
```

  </TabItem>
  <TabItem label="Template snippet">

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

### Full example (requestTemplate/argsPosition/responseTemplate chained)

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
    "body": "User: {{ .user.name }} Order count: {{ len .orders }} "
  }
}
```

## Examples

### Request template examples

<Tabs>
  <TabItem label="GET with query params">

Use argsToUrlParam to automatically append parameters that are not mapped to path/header/body/cookie to the URL query string. Best for simple GET APIs.

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
  <TabItem label="Path + Header + Nacos reference">

Demonstrates path placeholder replacement, header injection, and reading a key from Nacos to append to the query.

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

Corresponding Nacos config (appKey/amap):

```json
{
  "data": "xxxx-your-amap-key"
}
```

  </TabItem>
  <TabItem label="POST JSON body via body">

Construct the JSON request body directly via body (mutually exclusive with argsToJsonBody/argsToFormBody/argsToUrlParam).

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

### Parameter location examples

<Tabs>
  <TabItem label="query">

Put city into the query string, resulting in ?city=xxx on the URL.

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

Use userId for path placeholder replacement (/users/{{ userId }}/detail -> /users/123/detail).

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

Inject traceId into header X-Trace-Id for tracing.

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

Inject sessionId into Cookie for session identification (to customize the cookie string, manually craft headers.Cookie).

```json
{
  "requestTemplate": { "url": "/profile", "method": "GET" },
  "argsPosition": { "sessionId": "cookie" }
}
```

  </TabItem>
  <TabItem label="body">

Inject multiple parameters into the request body; suitable for POST/PUT where data submission is needed.

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

### Response template examples

<Tabs>
  <TabItem label="Extract JSON fields">

Read fields city/weather/temp from the JSON response and compose a single-line text.

```json
{
  "responseTemplate": {
    "body": "City: {{ .city }} Weather: {{ .weather }} Temp: {{ .temp }}℃"
  }
}
```

  </TabItem>
  <TabItem label="prepend/append combination">

Use prependBody/appendBody to add context while keeping the original response.

```json
{
  "responseTemplate": {
    "prependBody": "# Query result\nOriginal JSON below:\n",
    "appendBody": "\n---\nThe above is the original body for further processing."
  }
}
```

  </TabItem>
</Tabs>

### Error response template example

Used when the upstream returns a non-2xx status; extract the status code and error header and echo part of the original content.

<Tabs>
  <TabItem label="Extract status and error code">

```json
{
  "errorResponseTemplate": "statusCode: {{ gjson \"_headers.\\:status\" }}\nerrorCode: {{ gjson \"_headers.x-ca-error-code\" }}\nraw: {{.data.value}}"
}
```

  </TabItem>
</Tabs>

### Nacos reference example

Read appKey (amap) from Nacos and append it to the URL as the key query parameter.

<Tabs>
  <TabItem label="Nacos config appKey/amap">

```json
{
  "data": "xxxx-your-amap-key"
}
```

  </TabItem>
  <TabItem label="Template config">

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

### Full example (requestTemplate/argsPosition/responseTemplate chained)

Chain request template, parameter locations, and response template together to show a complete request-response rewrite flow.

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
    "body": "User: {{ .user.name }} Order count: {{ len .orders }}"
  }
}
```

Corresponding Nacos config (appKey/amap):

```json
{
  "data": "xxxx-your-amap-key"
}
```
