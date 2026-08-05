#!/usr/bin/env python3
"""
Generate Nacos API markdown from Swagger/OpenAPI 3 api.json.
Usage: run from repo root, e.g.
  python .agents/skills/nacos-api-doc-update/scripts/swagger_to_md.py \\
    --json public/swagger/console/zh/api.json --doc-type console --locale zh-cn
"""
import argparse
import json
import re
import sys
from typing import Any, Optional

DOC_CONFIG = {
    "console": {
        "auth_public": "公开接口，无需身份信息。",
        "auth_required_console": "需要具有对应`命名空间写入`权限的用户身份。",
        "auth_required_admin": None,
    },
    "admin": {
        "auth_public": "公开接口，无需身份信息。",
        "auth_required_console": None,
        "auth_required_admin": "需管理员权限",
    },
    "client": {
        "auth_public": None,
        "auth_required_console": None,
        "auth_required_admin": None,
    },
}

UI_TEXT = {
    "zh-cn": {
        "description": "接口描述",
        "since": "起始版本",
        "request_method": "请求方式",
        "authorization": "鉴权状态",
        "request_url": "请求URL",
        "request_headers": "请求头",
        "request_parameters": "请求参数",
        "response_data": "返回数据",
        "examples": "示例",
        "request_example": "请求示例",
        "response_example": "返回示例",
        "name": "参数名",
        "type": "类型",
        "required": "必填",
        "parameter_description": "参数描述",
        "response_type": "参数类型",
        "description_column": "描述",
        "yes": "**是**",
        "no": "否",
        "none": "无",
        "json_media": "请求体类型：`application/json`，请求示例中需使用 `-H 'Content-Type: application/json'`。",
        "multipart_media": "请求体类型：`multipart/form-data`（如文件上传），请求示例中需使用 `-F` 或 `-H 'Content-Type: multipart/form-data'`。",
    },
    "en": {
        "description": "Description",
        "since": "Since",
        "request_method": "Request Method",
        "authorization": "Authorization",
        "request_url": "Request URL",
        "request_headers": "Request Headers",
        "request_parameters": "Request Parameters",
        "response_data": "Response Data",
        "examples": "Examples",
        "request_example": "Request example",
        "response_example": "Response example",
        "name": "Name",
        "type": "Type",
        "required": "Required",
        "parameter_description": "Description",
        "response_type": "Type",
        "description_column": "Description",
        "yes": "**Yes**",
        "no": "No",
        "none": "None",
        "json_media": "Request body media type: `application/json`. Use `-H 'Content-Type: application/json'` in the request example.",
        "multipart_media": "Request body media type: `multipart/form-data` (for example, file uploads). Use `-F` or `-H 'Content-Type: multipart/form-data'` in the request example.",
    },
}


def ui_text(locale: str) -> dict:
    return UI_TEXT["en" if (locale or "").lower().startswith("en") else "zh-cn"]


def auth_text(has_security: bool, doc_type: str, method: str = "", locale: str = "zh-cn") -> str:
    if (locale or "").lower().startswith("en"):
        if not has_security:
            return "Public API; no identity information is required."
        if doc_type == "console":
            permission = "read" if method and method.upper() in ("GET", "HEAD") else "write"
            return f"A user identity with the corresponding `namespace {permission}` permission is required."
        if doc_type == "admin":
            return "Administrator privileges are required."
        return "Authentication is required."
    cfg = DOC_CONFIG[doc_type]
    if not has_security:
        return cfg["auth_public"] or "公开接口，无需身份信息。"
    if doc_type == "console":
        if method and method.upper() in ("GET", "HEAD"):
            return "需要具有对应`命名空间读取`权限的用户身份。"
        return cfg["auth_required_console"] or "需要具有对应`命名空间写入`权限的用户身份。"
    if doc_type == "admin":
        return cfg["auth_required_admin"] or "需管理员权限"
    return "需鉴权"


def resolve_ref(obj: dict, components: dict) -> dict:
    ref = obj.get("$ref")
    if not ref:
        return obj
    if ref.startswith("#/components/schemas/"):
        name = ref.split("/")[-1]
        return (components.get("schemas") or {}).get(name) or {}
    return obj


def get_schema_ref(schema: dict) -> Optional[str]:
    ref = schema.get("$ref")
    if ref and "/schemas/" in ref:
        return ref.split("/")[-1]
    return None


def schema_type(schema_obj: dict, media_type: str = "") -> str:
    """Render an OpenAPI schema type without discarding named $ref context."""
    if not isinstance(schema_obj, dict):
        return "string"
    ref_name = get_schema_ref(schema_obj)
    if ref_name:
        return ref_name
    for union_key in ("oneOf", "anyOf"):
        variants = schema_obj.get(union_key) or []
        if len(variants) == 1 and isinstance(variants[0], dict):
            return schema_type(variants[0], media_type)
        if variants:
            return "object"
    ptype = (schema_obj.get("type") or ("object" if "properties" in schema_obj else "string")).lower()
    fmt = (schema_obj.get("format") or "").lower()
    if fmt == "binary" or ptype == "file":
        return "file"
    if media_type.startswith("multipart/") and ptype == "string" and "file" in fmt:
        return "file"
    if ptype == "array":
        items = schema_obj.get("items") or {}
        item_ref = get_schema_ref(items) if isinstance(items, dict) else None
        if item_ref:
            return f"array<{item_ref}>"
        item_type = schema_type(items, media_type) if items else ""
        return f"array<{item_type}>" if item_type else "array"
    if ptype == "object" and "additionalProperties" in schema_obj:
        value_schema = schema_obj.get("additionalProperties")
        value_type = schema_type(value_schema, media_type) if isinstance(value_schema, dict) else "object"
        return f"map<string, {value_type}>"
    return ptype


def parse_parameters(op: dict, components: dict) -> list[dict]:
    def infer_param_type(schema_obj: dict, media_type: str = "") -> str:
        return schema_type(schema_obj, media_type)

    params = []
    for p in op.get("parameters") or []:
        p = resolve_ref(p, components)
        if not p:
            continue
        name = p.get("name") or ""
        if not name:
            continue
        schema = p.get("schema") or resolve_ref(p.get("schema") or {}, components)
        ptype = infer_param_type(schema)
        required = p.get("required", False)
        if isinstance(required, list):
            required = name in required
        params.append({
            "name": name,
            "in": p.get("in") or "query",
            "type": ptype,
            "required": required,
            "description": (p.get("description") or "").strip() or "-",
        })
    body = op.get("requestBody")
    if body:
        body = resolve_ref(body, components)
        content = (body or {}).get("content") or {}
        for ct, media in content.items():
            if "json" in ct or "schema" in media:
                media_type = ct.split(";")[0].strip().lower()
                schema = (media.get("schema") or {})
                schema = resolve_ref(schema, components)
                if "properties" in schema:
                    for prop_name, prop_schema in (schema.get("properties") or {}).items():
                        raw_prop_schema = prop_schema if isinstance(prop_schema, dict) else {}
                        prop_schema = resolve_ref(raw_prop_schema, components)
                        req_list = schema.get("required") or []
                        params.append({
                            "name": prop_name,
                            "in": "body",
                            "type": infer_param_type(raw_prop_schema, media_type),
                            "required": prop_name in req_list,
                            "description": (prop_schema.get("description") or "-").strip() if isinstance(prop_schema, dict) else "-",
                        })
                elif schema.get("type") == "array":
                    raw_items = schema.get("items") or {}
                    items = resolve_ref(raw_items, components)
                    if "properties" in items:
                        req_list = items.get("required") or []
                        for prop_name, prop_schema in (items.get("properties") or {}).items():
                            raw_prop_schema = prop_schema if isinstance(prop_schema, dict) else {}
                            prop_schema = resolve_ref(raw_prop_schema, components)
                            params.append({
                                "name": f"body[].{prop_name}",
                                "in": "body",
                                "type": infer_param_type(raw_prop_schema, media_type),
                                "required": prop_name in req_list,
                                "description": (prop_schema.get("description") or "-").strip(),
                            })
                break
    return params


def get_request_media_type(op: dict, components: dict) -> Optional[str]:
    """从 requestBody.content 取主 media type：application/json、multipart/form-data 或 None（表单/默认）。"""
    body = op.get("requestBody")
    if not body:
        return None
    body = resolve_ref(body, components)
    content = (body or {}).get("content") or {}
    for ct in content:
        ct_lower = ct.split(";")[0].strip().lower()
        if "application/json" in ct_lower:
            return "application/json"
        if "multipart/form-data" in ct_lower or "multipart/" in ct_lower:
            return "multipart/form-data"
    return None


def flatten_response_schema(schemas: dict, ref: str, prefix: str = "data") -> list[dict]:
    """Flatten the business payload without inventing a second ``data`` wrapper.

    Nacos responses normally reference ``Result<T>``. Documentation tables describe the
    business ``data`` value, so ``code`` and ``message`` stay at the response root and the
    payload must be rendered as ``data`` / ``data.field``, never ``data.data``.
    """
    rows = []

    def ref_name(schema_obj: dict) -> str:
        ref_value = schema_obj.get("$ref") if isinstance(schema_obj, dict) else None
        return ref_value.rsplit("/", 1)[-1] if ref_value and "/schemas/" in ref_value else ""

    def description(schema_obj: dict) -> str:
        named = ref_name(schema_obj)
        resolved = schemas.get(named, {}) if named else {}
        return (schema_obj.get("description") or resolved.get("description") or "-").strip()

    def append_direct_properties(schema_name: str, path_prefix: str) -> None:
        schema_obj = schemas.get(schema_name) or {}
        alias = ref_name(schema_obj)
        if alias:
            schema_name = alias
            schema_obj = schemas.get(alias) or {}
        for key, raw_value in (schema_obj.get("properties") or {}).items():
            value = raw_value if isinstance(raw_value, dict) else {}
            child_path = f"{path_prefix}.{key}" if path_prefix else key
            rows.append({
                "name": child_path,
                "type": schema_type(value),
                "description": description(value),
            })
            child_ref = ref_name(value)
            if child_ref and re.match(r"^(Page|List|Collection)<", child_ref):
                append_direct_properties(child_ref, child_path)

    root_schema = schemas.get(ref) or {}
    root_alias = ref_name(root_schema)
    if root_alias:
        ref = root_alias
        root_schema = schemas.get(root_alias) or {}

    if re.match(r"^Result(?:<|$)", ref):
        payload = (root_schema.get("properties") or {}).get("data") or {}
        if payload:
            rows.append({
                "name": prefix,
                "type": schema_type(payload),
                "description": description(payload),
            })
            payload_ref = ref_name(payload)
            if payload_ref:
                append_direct_properties(payload_ref, prefix)
        return rows

    rows.append({"name": prefix, "type": ref, "description": description({"$ref": f"#/components/schemas/{ref}"})})
    append_direct_properties(ref, prefix)
    return rows


def merge_request_params(query_params: list[dict], body_params: list[dict]) -> list[dict]:
    """Merge query/path and body fields into the skill's single request-parameter table."""
    merged = []
    by_name = {}
    for param in [*query_params, *body_params]:
        name = param.get("name")
        if name not in by_name:
            item = dict(param)
            by_name[name] = item
            merged.append(item)
            continue
        item = by_name[name]
        item["required"] = bool(item.get("required") or param.get("required"))
        if param.get("type") == "file":
            item["type"] = "file"
        if (not item.get("description") or item.get("description") == "-") and param.get("description"):
            item["description"] = param.get("description")
    return merged


def get_response_example(op: dict) -> Optional[str]:
    r200 = (op.get("responses") or {}).get("200") or {}
    content = r200.get("content") or {}
    for ct, media in content.items():
        if "example" in media:
            ex = media["example"]
            if isinstance(ex, (dict, list, int, float, bool)) or ex is None:
                return json.dumps(ex, ensure_ascii=False, indent=2)
            return str(ex)
        if "examples" in media and media["examples"]:
            first = list(media["examples"].values())[0]
            if isinstance(first, dict) and "value" in first:
                return json.dumps(first["value"], ensure_ascii=False, indent=2)
    return None


def get_api_since(op: dict) -> Optional[str]:
    since = op.get("x-nacos-api-since")
    if isinstance(since, dict):
        version = since.get("version")
        if version:
            return str(version).strip()
    if isinstance(since, str) and since.strip():
        return since.strip()
    return None


def build_curl(
    method: str, path: str, params: list[dict], doc_type: str, request_media_type: Optional[str] = None
) -> str:
    method = method.upper()
    if doc_type == "console":
        base = "http://127.0.0.1:8080"
        full_path = path
    else:
        # admin/client: base already has /nacos, path from api.json is /v3/...
        base = "http://127.0.0.1:8848/nacos"
        full_path = path if path.startswith("/nacos") else path  # use /v3/... as-is
    url = base.rstrip("/") + full_path
    query_params = [p for p in params if p["in"] == "query"]
    body_params = [p for p in params if p["in"] == "body"]
    header_params = [p for p in params if p["in"] == "header"]

    def with_headers(command: str) -> str:
        header_flags = []
        for p in header_params:
            name = p["name"]
            value = "AI" if name.lower() == "request-module" else "client-id" if name.lower() == "x-nacos-client-id" else name
            header_flags.append(f"-H '{name}: {value}'")
        return command + (" " + " ".join(header_flags) if header_flags else "")
    # POST/PUT/PATCH: 尽量使用 -d 包装请求参数；非 form 时通过 -H 指定 Content-Type
    if method in ("POST", "PUT", "PATCH"):
        if body_params:
            if request_media_type == "application/json":
                body_json = "{" + ", ".join(f'"{p["name"]}": ""' for p in body_params) + "}"
                if query_params:
                    parts = [f"{p['name']}={p['name']}" for p in query_params]
                    url += "?" + "&".join(parts)
                return with_headers(f"curl -X {method} '{url}' -H 'Content-Type: application/json' -d '{body_json}'")
            if request_media_type == "multipart/form-data":
                # 文件上传等：用 -F，占位示例
                parts = [f'-F "{p["name"]}=@{p["name"]}"' if p.get("type") == "file" else f'-F "{p["name"]}="' for p in body_params]
                if query_params:
                    qs = "&".join(f"{p['name']}={p['name']}" for p in query_params)
                    url += "?" + qs
                return with_headers(f"curl -X {method} '{url}' " + " ".join(parts))
            # 默认 form 或未指定
            form_parts = [f"{p['name']}={p['name']}" for p in body_params]
            if query_params:
                parts = [f"{p['name']}={p['name']}" for p in query_params]
                url += "?" + "&".join(parts)
            return with_headers(f"curl -X {method} '{url}' -d \"{'&'.join(form_parts)}\"")
        if query_params:
            parts = [f"{p['name']}={p['name']}" for p in query_params]
            return with_headers(f"curl -X {method} '{url}' -d \"{'&'.join(parts)}\"")
    else:
        if query_params:
            parts = [f"{p['name']}={p['name']}" for p in query_params]
            url += "?" + "&".join(parts)
    return with_headers(f"curl -X {method} '{url}'")


def render_one_api(
    op: dict,
    path: str,
    method: str,
    doc_type: str,
    components: dict,
    section_num: str,
    locale: str = "zh-cn",
) -> str:
    summary = op.get("summary") or path
    description = (op.get("description") or "").strip() or summary
    security = op.get("security")
    has_security = bool(security and len(security) > 0)
    params = parse_parameters(op, components)
    header_params = [p for p in params if p["in"] == "header"]
    query_path_params = [p for p in params if p["in"] in ("query", "path")]
    body_params = [p for p in params if p["in"] == "body"]

    r200 = (op.get("responses") or {}).get("200") or {}
    content = r200.get("content") or {}
    schema_ref = None
    for ct, media in content.items():
        schema = (media.get("schema") or {})
        schema_ref = get_schema_ref(schema)
        if schema_ref:
            break
    response_rows = []
    if schema_ref:
        response_rows = flatten_response_schema(components.get("schemas") or {}, schema_ref)
    response_example = get_response_example(op)
    request_media_type = get_request_media_type(op, components)
    curl_line = build_curl(method, path, params, doc_type, request_media_type)

    text = ui_text(locale)
    path_display = path
    if doc_type in ("admin", "client") and not path.startswith("/nacos"):
        path_display = "/nacos" + path

    blocks = []
    blocks.append(f"### {section_num}. {summary}\n")
    blocks.append(f"#### {text['description']}\n")
    blocks.append(description + "\n\n")
    api_since = get_api_since(op)
    if api_since:
        blocks.append(f"#### {text['since']}\n\n")
        blocks.append(f"`{api_since}`\n\n")
    blocks.append(f"#### {text['request_method']}\n\n")
    blocks.append(f"`{method.upper()}`\n\n")
    if request_media_type and request_media_type != "application/x-www-form-urlencoded":
        media_desc = text["json_media"] if request_media_type == "application/json" else text["multipart_media"]
        blocks.append(media_desc + "\n\n")
    if doc_type != "client":
        blocks.append(f"#### {text['authorization']}\n\n")
        blocks.append(auth_text(has_security, doc_type, method, locale) + "\n\n")
    blocks.append(f"#### {text['request_url']}\n\n")
    blocks.append(f"`{path_display}`\n\n")

    if doc_type == "client" and header_params:
        blocks.append(f"#### {text['request_headers']}\n\n")
        blocks.append(f"| {text['name']} | {text['type']} | {text['required']} | {text['parameter_description']} |\n")
        blocks.append("|--------|------|------|----------|\n")
        for p in header_params:
            req = text["yes"] if p["required"] else text["no"]
            blocks.append(f"| `{p['name']}` | `{p['type']}` | {req} | {p['description']} |\n")
        blocks.append("\n")

    # 统一使用一个「请求参数」标题和一个表格，不区分 query 与 body
    request_params = merge_request_params(query_path_params, body_params)
    if request_params:
        blocks.append(f"#### {text['request_parameters']}\n\n")
        blocks.append(f"| {text['name']} | {text['type']} | {text['required']} | {text['parameter_description']} |\n")
        blocks.append("|--------|------|------|----------|\n")
        for p in request_params:
            req = text["yes"] if p["required"] else text["no"]
            blocks.append(f"| `{p['name']}` | `{p['type']}` | {req} | {p['description']} |\n")
        blocks.append("\n")

    if response_rows:
        blocks.append(f"#### {text['response_data']}\n\n")
        blocks.append(f"| {text['name']} | {text['response_type']} | {text['description_column']} |\n")
        blocks.append("|--------|----------|------|\n")
        for r in response_rows:
            blocks.append(f"| {r['name']} | `{r['type']}` | {r['description']} |\n")
        blocks.append("\n")

    blocks.append(f"#### {text['examples']}\n\n")
    blocks.append(f"* {text['request_example']}\n\n")
    blocks.append("```shell\n")
    blocks.append(curl_line + "\n")
    blocks.append("```\n\n")
    blocks.append(f"* {text['response_example']}\n\n")
    blocks.append("```json\n")
    blocks.append(response_example or "{\n  \"code\": 0,\n  \"message\": \"success\",\n  \"data\": {}\n}\n")
    blocks.append("```\n\n")

    return "".join(blocks)


def render_params_through_example(
    op: dict, path: str, method: str, doc_type: str, components: dict, locale: str = "zh-cn"
) -> str:
    """Render only the block from #### 请求参数 through #### 示例 (for doc sync)."""
    params = parse_parameters(op, components)
    header_params = [p for p in params if p["in"] == "header"]
    query_path_params = [p for p in params if p["in"] in ("query", "path")]
    body_params = [p for p in params if p["in"] == "body"]

    r200 = (op.get("responses") or {}).get("200") or {}
    content = r200.get("content") or {}
    schema_ref = None
    for ct, media in content.items():
        schema = media.get("schema") or {}
        schema_ref = get_schema_ref(schema)
        if schema_ref:
            break
    response_rows = []
    if schema_ref:
        response_rows = flatten_response_schema(components.get("schemas") or {}, schema_ref)
    response_example = get_response_example(op)
    request_media_type = get_request_media_type(op, components)
    curl_line = build_curl(method, path, params, doc_type, request_media_type)
    text = ui_text(locale)

    # 统一使用一个「请求参数」标题和一个表格，不区分 query 与 body
    blocks = []
    if doc_type == "client" and header_params:
        blocks.append(f"#### {text['request_headers']}\n\n")
        blocks.append(f"| {text['name']} | {text['type']} | {text['required']} | {text['parameter_description']} |\n")
        blocks.append("|--------|------|------|----------|\n")
        for p in header_params:
            req = text["yes"] if p["required"] else text["no"]
            blocks.append(f"| `{p['name']}` | `{p['type']}` | {req} | {p['description']} |\n")
        blocks.append("\n")
    request_params = merge_request_params(query_path_params, body_params)
    if request_params:
        blocks.append(f"#### {text['request_parameters']}\n\n")
        blocks.append(f"| {text['name']} | {text['type']} | {text['required']} | {text['parameter_description']} |\n")
        blocks.append("|--------|------|------|----------|\n")
        for p in request_params:
            req = text["yes"] if p["required"] else text["no"]
            blocks.append(f"| `{p['name']}` | `{p['type']}` | {req} | {p['description']} |\n")
        blocks.append("\n")
    else:
        blocks.append(f"#### {text['request_parameters']}\n\n")
        blocks.append(text["none"] + "\n\n")

    if response_rows:
        blocks.append(f"#### {text['response_data']}\n\n")
        blocks.append(f"| {text['name']} | {text['response_type']} | {text['description_column']} |\n")
        blocks.append("|--------|----------|------|\n")
        for r in response_rows:
            blocks.append(f"| {r['name']} | `{r['type']}` | {r['description']} |\n")
        blocks.append("\n")

    blocks.append(f"#### {text['examples']}\n\n")
    blocks.append(f"* {text['request_example']}\n\n")
    blocks.append("```shell\n")
    blocks.append(curl_line + "\n")
    blocks.append("```\n\n")
    blocks.append(f"* {text['response_example']}\n\n")
    blocks.append("```json\n")
    blocks.append(response_example or "{\n  \"code\": 0,\n  \"message\": \"success\",\n  \"data\": {}\n}\n")
    blocks.append("```\n\n")
    return "".join(blocks)


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate Nacos API markdown from Swagger api.json")
    parser.add_argument("--json", required=True, help="Path to api.json")
    parser.add_argument("--doc-type", required=True, choices=["console", "admin", "client"])
    parser.add_argument("--locale", choices=("zh-cn", "en"), default="zh-cn")
    parser.add_argument("--filter-path", default="", help="Regex to filter paths")
    parser.add_argument("--section-start", type=int, default=1, help="Starting section number (e.g. 1)")
    args = parser.parse_args()

    try:
        with open(args.json, "r", encoding="utf-8") as f:
            spec = json.load(f)
    except Exception as e:
        print(f"Error loading {args.json}: {e}", file=sys.stderr)
        sys.exit(1)

    paths = spec.get("paths") or {}
    components = spec.get("components") or {}
    pattern = re.compile(args.filter_path) if args.filter_path else None
    section = args.section_start
    for path_key in sorted(paths.keys()):
        if pattern and not pattern.search(path_key):
            continue
        path_item = paths[path_key]
        for method in ("get", "post", "put", "delete", "patch", "head"):
            if method not in path_item:
                continue
            op = path_item[method]
            if not isinstance(op, dict):
                continue
            section_num = f"1.{section}" if section > 0 else "1"
            out = render_one_api(op, path_key, method, args.doc_type, components, section_num, args.locale)
            print(out)
            section += 1


if __name__ == "__main__":
    main()
