#!/usr/bin/env python3
"""
Generate Nacos API markdown from Swagger/OpenAPI 3 api.json.
Usage: run from repo root, e.g.
  python .cursor/skills/nacos-api-doc-update/scripts/swagger_to_md.py \\
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


def auth_text(has_security: bool, doc_type: str, method: str = "") -> str:
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


def parse_parameters(op: dict, components: dict) -> list[dict]:
    params = []
    for p in op.get("parameters") or []:
        p = resolve_ref(p, components)
        if not p:
            continue
        name = p.get("name") or ""
        if not name:
            continue
        schema = p.get("schema") or resolve_ref(p.get("schema") or {}, components)
        ptype = "string"
        if isinstance(schema, dict):
            ptype = schema.get("type") or "string"
            if "oneOf" in schema or "anyOf" in schema:
                ptype = "object"
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
                schema = (media.get("schema") or {})
                schema = resolve_ref(schema, components)
                if schema.get("type") == "object" and "properties" in schema:
                    for prop_name, prop_schema in (schema.get("properties") or {}).items():
                        prop_schema = resolve_ref(prop_schema, components) if isinstance(prop_schema, dict) else {}
                        req_list = schema.get("required") or []
                        params.append({
                            "name": prop_name,
                            "in": "body",
                            "type": (prop_schema.get("type") or "string") if isinstance(prop_schema, dict) else "string",
                            "required": prop_name in req_list,
                            "description": (prop_schema.get("description") or "-").strip() if isinstance(prop_schema, dict) else "-",
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
    rows = []
    schema = schemas.get(ref)
    if not schema:
        return rows
    schema = schema.copy()
    if schema.get("$ref"):
        ref_name = schema["$ref"].split("/")[-1]
        return flatten_response_schema(schemas, ref_name, prefix)
    if "properties" in schema:
        for key, val in (schema.get("properties") or {}).items():
            val = val.copy() if isinstance(val, dict) else {}
            if val.get("$ref"):
                ref_name = val["$ref"].split("/")[-1]
                sub = schemas.get(ref_name)
                if sub and sub.get("properties"):
                    rows.extend(flatten_response_schema(schemas, ref_name, f"{prefix}.{key}"))
                else:
                    rows.append({
                        "name": f"{prefix}.{key}",
                        "type": "object",
                        "description": (val.get("description") or "-").strip(),
                    })
            else:
                desc = (val.get("description") or "-").strip()
                rows.append({"name": f"{prefix}.{key}", "type": val.get("type") or "string", "description": desc})
    return rows


def get_response_example(op: dict) -> Optional[str]:
    r200 = (op.get("responses") or {}).get("200") or {}
    content = r200.get("content") or {}
    for ct, media in content.items():
        if "example" in media:
            ex = media["example"]
            if isinstance(ex, dict):
                return json.dumps(ex, ensure_ascii=False, indent=2)
            return str(ex)
        if "examples" in media and media["examples"]:
            first = list(media["examples"].values())[0]
            if isinstance(first, dict) and "value" in first:
                return json.dumps(first["value"], ensure_ascii=False, indent=2)
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
    # POST/PUT/PATCH: 尽量使用 -d 包装请求参数；非 form 时通过 -H 指定 Content-Type
    if method in ("POST", "PUT", "PATCH"):
        if body_params:
            if request_media_type == "application/json":
                body_json = "{" + ", ".join(f'"{p["name"]}": ""' for p in body_params) + "}"
                if query_params:
                    parts = [f"{p['name']}={p['name']}" for p in query_params]
                    url += "?" + "&".join(parts)
                return f"curl -X {method} '{url}' -H 'Content-Type: application/json' -d '{body_json}'"
            if request_media_type == "multipart/form-data":
                # 文件上传等：用 -F，占位示例
                parts = [f'-F "{p["name"]}=@{p["name"]}"' if p.get("type") == "string" and "file" in p.get("name", "").lower() else f'-F "{p["name"]}="' for p in body_params]
                if query_params:
                    qs = "&".join(f"{p['name']}={p['name']}" for p in query_params)
                    url += "?" + qs
                return f"curl -X {method} '{url}' " + " ".join(parts)
            # 默认 form 或未指定
            form_parts = [f"{p['name']}={p['name']}" for p in body_params]
            if query_params:
                parts = [f"{p['name']}={p['name']}" for p in query_params]
                url += "?" + "&".join(parts)
            return f"curl -X {method} '{url}' -d \"{'&'.join(form_parts)}\""
        if query_params:
            parts = [f"{p['name']}={p['name']}" for p in query_params]
            return f"curl -X {method} '{url}' -d \"{'&'.join(parts)}\""
    else:
        if query_params:
            parts = [f"{p['name']}={p['name']}" for p in query_params]
            url += "?" + "&".join(parts)
    return f"curl -X {method} '{url}'"


def render_one_api(
    op: dict, path: str, method: str, doc_type: str, components: dict, section_num: str
) -> str:
    summary = op.get("summary") or path
    description = (op.get("description") or "").strip() or summary
    security = op.get("security")
    has_security = bool(security and len(security) > 0)
    params = parse_parameters(op, components)
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

    cfg = DOC_CONFIG[doc_type]
    path_display = path
    if doc_type in ("admin", "client") and not path.startswith("/nacos"):
        path_display = "/nacos" + path

    blocks = []
    blocks.append(f"### {section_num}. {summary}\n")
    blocks.append("#### 接口描述\n")
    blocks.append(description + "\n\n")
    blocks.append("#### 请求方式\n\n")
    blocks.append(f"`{method.upper()}`\n\n")
    if request_media_type and request_media_type != "application/x-www-form-urlencoded":
        media_desc = "请求体类型：`application/json`，请求示例中需使用 `-H 'Content-Type: application/json'`。" if request_media_type == "application/json" else "请求体类型：`multipart/form-data`（如文件上传），请求示例中需使用 `-F` 或 `-H 'Content-Type: multipart/form-data'`。"
        blocks.append(media_desc + "\n\n")
    if doc_type != "client":
        blocks.append("#### 鉴权状态\n\n")
        blocks.append(auth_text(has_security, doc_type, method) + "\n\n")
    blocks.append("#### 请求URL\n\n")
    blocks.append(f"`{path_display}`\n\n")

    # 统一使用「请求参数」，不区分 query 与 body
    if query_path_params or body_params:
        blocks.append("#### 请求参数\n\n")
        if query_path_params:
            blocks.append("| 参数名 | 类型 | 必填 | 参数描述 |\n")
            blocks.append("|--------|------|------|----------|\n")
            for p in query_path_params:
                req = "**是**" if p["required"] else "否"
                blocks.append(f"| `{p['name']}` | `{p['type']}` | {req} | {p['description']} |\n")
            blocks.append("\n")
        if body_params:
            blocks.append("| 参数名 | 类型 | 必填 | 参数描述 |\n")
            blocks.append("|--------|------|------|----------|\n")
            for p in body_params:
                req = "**是**" if p["required"] else "否"
                blocks.append(f"| `{p['name']}` | `{p['type']}` | {req} | {p['description']} |\n")
            blocks.append("\n")

    if response_rows:
        blocks.append("#### 返回数据\n\n")
        blocks.append("| 参数名 | 参数类型 | 描述 |\n")
        blocks.append("|--------|----------|------|\n")
        for r in response_rows:
            blocks.append(f"| {r['name']} | `{r['type']}` | {r['description']} |\n")
        blocks.append("\n")

    blocks.append("#### 示例\n\n")
    blocks.append("* 请求示例\n\n")
    blocks.append("```shell\n")
    blocks.append(curl_line + "\n")
    blocks.append("```\n\n")
    blocks.append("* 返回示例\n\n")
    blocks.append("```json\n")
    blocks.append(response_example or "{\n  \"code\": 0,\n  \"message\": \"success\",\n  \"data\": {}\n}\n")
    blocks.append("```\n\n")

    return "".join(blocks)


def render_params_through_example(
    op: dict, path: str, method: str, doc_type: str, components: dict
) -> str:
    """Render only the block from #### 请求参数 through #### 示例 (for doc sync)."""
    params = parse_parameters(op, components)
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

    # 统一使用「请求参数」，不区分 query 与 body
    blocks = []
    if query_path_params or body_params:
        blocks.append("#### 请求参数\n\n")
        if query_path_params:
            blocks.append("| 参数名 | 类型 | 必填 | 参数描述 |\n")
            blocks.append("|--------|------|------|----------|\n")
            for p in query_path_params:
                req = "**是**" if p["required"] else "否"
                blocks.append(f"| `{p['name']}` | `{p['type']}` | {req} | {p['description']} |\n")
            blocks.append("\n")
        if body_params:
            blocks.append("| 参数名 | 类型 | 必填 | 参数描述 |\n")
            blocks.append("|--------|------|------|----------|\n")
            for p in body_params:
                req = "**是**" if p["required"] else "否"
                blocks.append(f"| `{p['name']}` | `{p['type']}` | {req} | {p['description']} |\n")
            blocks.append("\n")
    else:
        blocks.append("#### 请求参数\n\n")
        blocks.append("无\n\n")

    if response_rows:
        blocks.append("#### 返回数据\n\n")
        blocks.append("| 参数名 | 参数类型 | 描述 |\n")
        blocks.append("|--------|----------|------|\n")
        for r in response_rows:
            blocks.append(f"| {r['name']} | `{r['type']}` | {r['description']} |\n")
        blocks.append("\n")

    blocks.append("#### 示例\n\n")
    blocks.append("* 请求示例\n\n")
    blocks.append("```shell\n")
    blocks.append(curl_line + "\n")
    blocks.append("```\n\n")
    blocks.append("* 返回示例\n\n")
    blocks.append("```json\n")
    blocks.append(response_example or "{\n  \"code\": 0,\n  \"message\": \"success\",\n  \"data\": {}\n}\n")
    blocks.append("```\n\n")
    return "".join(blocks)


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate Nacos API markdown from Swagger api.json")
    parser.add_argument("--json", required=True, help="Path to api.json")
    parser.add_argument("--doc-type", required=True, choices=["console", "admin", "client"])
    parser.add_argument("--locale", default="zh-cn", help="Locale, e.g. zh-cn or en")
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
            out = render_one_api(op, path_key, method, args.doc_type, components, section_num)
            print(out)
            section += 1


if __name__ == "__main__":
    main()
