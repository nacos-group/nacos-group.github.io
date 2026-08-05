#!/usr/bin/env python3
"""
Compare existing API doc with api.json and output a diff report only.
**Does NOT modify any file.** Use this to find what to fix manually (per skill: no batch replace).

Usage (run from repo root):
  python .agents/skills/nacos-api-doc-update/scripts/compare_doc_with_swagger.py \\
    --json public/swagger/console/zh/api.json --doc-type console \\
    --doc-file src/content/docs/next/zh-cn/manual/admin/console-api.md
"""
import argparse
import json
import re
import sys
from pathlib import Path
from typing import Optional

sys.path.insert(0, str(Path(__file__).resolve().parent))
from swagger_to_md import get_api_since, parse_parameters, schema_type  # noqa: E402


def load_exemptions(exemptions_file: Optional[str], doc_type: str) -> dict:
    """Load optional exemptions json and return endpoint-level rules."""
    if not exemptions_file:
        return {}
    p = Path(exemptions_file)
    if not p.exists():
        return {}
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return {}
    if not isinstance(data, dict):
        return {}
    root = data.get("doc_types", data) if isinstance(data.get("doc_types", data), dict) else {}
    scoped = root.get(doc_type, {})
    if not isinstance(scoped, dict):
        return {}
    return scoped


def apply_issue_exemptions(endpoint_key: str, issues: list[str], exemptions: dict) -> list[str]:
    if not exemptions:
        return issues
    ep_rule = exemptions.get(endpoint_key, {})
    if not isinstance(ep_rule, dict):
        return issues
    ignore_exact = set(ep_rule.get("ignore_issues", []) or [])
    ignore_prefix = ep_rule.get("ignore_prefixes", []) or []
    matched = ep_rule.setdefault("__matched_issues_runtime", set())
    out = []
    for i in issues:
        if i in ignore_exact:
            matched.add(i)
            continue
        if any(i.startswith(pfx) for pfx in ignore_prefix):
            matched.add(i)
            continue
        out.append(i)
    return out


def is_api_only_exempt(endpoint_key: str, exemptions: dict) -> bool:
    if not exemptions:
        return False
    ep_rule = exemptions.get(endpoint_key, {})
    if not isinstance(ep_rule, dict):
        return False
    ignored = bool(ep_rule.get("ignore_api_only"))
    if ignored:
        ep_rule["__matched_api_only_runtime"] = True
    return ignored


def audit_exemptions(exemptions: dict, pattern: Optional[re.Pattern]) -> list[str]:
    """Reject broad, undocumented, or no-longer-consumed exemption rules."""
    issues = []
    required_metadata = (
        "reason",
        "issue_kind",
        "parameter_path",
        "evidence",
        "source_commit",
        "expires_when",
    )
    for endpoint_key, rule in sorted(exemptions.items()):
        if not isinstance(rule, dict):
            issues.append(f"  [豁免格式错误] {endpoint_key}: rule must be an object")
            continue
        path = endpoint_key.split(" ", 1)[1] if " " in endpoint_key else endpoint_key
        if pattern and not pattern.search(path):
            continue
        for field in required_metadata:
            if not rule.get(field):
                issues.append(f"  [豁免缺少元数据] {endpoint_key}: {field}")
        if rule.get("ignore_prefixes"):
            issues.append(f"  [豁免过宽] {endpoint_key}: ignore_prefixes is not allowed")
        if rule.get("ignore_api_only"):
            issues.append(f"  [豁免过宽] {endpoint_key}: ignore_api_only is not allowed")
        expected = set(rule.get("ignore_issues", []) or [])
        matched = rule.get("__matched_issues_runtime", set())
        for issue in sorted(expected - set(matched)):
            issues.append(f"  [豁免未命中] {endpoint_key}: {issue}")
    return issues


def load_spec(json_path: str) -> dict:
    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)


def build_api_map(spec: dict) -> dict:
    paths = spec.get("paths") or {}
    components = spec.get("components") or {}
    api_map = {}
    for path_key, path_item in paths.items():
        for method in ("get", "post", "put", "delete", "patch", "head"):
            if method not in path_item or not isinstance(path_item[method], dict):
                continue
            op = path_item[method]
            params = parse_parameters(op, components)
            query_params = [p for p in params if p["in"] in ("query", "path")]
            body_params = [p for p in params if p["in"] == "body"]
            header_params = [p for p in params if p["in"] == "header"]
            api_map[(path_key, method.upper())] = {
                "query_params": {p["name"]: p for p in query_params},
                "body_params": {p["name"]: p for p in body_params},
                "header_params": {p["name"]: p for p in header_params},
                "response_fields": collect_response_fields(op, components),
                "since": get_api_since(op),
            }
    return api_map


def collect_response_fields(op: dict, components: dict) -> dict:
    """Collect response property paths and retain whether their type comes from a named schema."""
    schemas = components.get("schemas") or {}
    response = (op.get("responses") or {}).get("200") or {}
    content = response.get("content") or {}
    media = next(iter(content.values()), {}) if isinstance(content, dict) else {}
    root = media.get("schema") or {}
    fields = {}

    def ref_name(schema: dict) -> str:
        ref = schema.get("$ref") if isinstance(schema, dict) else None
        return ref.rsplit("/", 1)[-1] if ref and "/schemas/" in ref else ""

    def visit(schema: dict, path: str, seen: tuple[str, ...], depth: int = 0) -> None:
        if not isinstance(schema, dict) or depth > 12:
            return
        named = ref_name(schema)
        resolved = schemas.get(named, {}) if named else schema
        if path:
            fields[path] = {"type": schema_type(schema), "named": bool(named)}
        if named:
            if named in seen:
                return
            seen = (*seen, named)
        if not isinstance(resolved, dict):
            return
        if resolved.get("type") == "array":
            items = resolved.get("items") or {}
            item_named = ref_name(items)
            if path:
                fields[path] = {
                    "type": schema_type(resolved),
                    "named": bool(item_named),
                }
            visit(items, f"{path}[i]" if path else "[i]", seen, depth + 1)
            return
        additional = resolved.get("additionalProperties")
        if additional is not None:
            value_named = ref_name(additional) if isinstance(additional, dict) else ""
            if path:
                fields[path] = {
                    "type": schema_type(resolved),
                    "named": bool(value_named),
                }
            return
        for key, child in (resolved.get("properties") or {}).items():
            child_path = f"{path}.{key}" if path else key
            child_named = ref_name(child) if isinstance(child, dict) else ""
            child_type = schema_type(child if isinstance(child, dict) else {})
            if isinstance(child, dict) and child.get("type") == "array":
                item_named = ref_name(child.get("items") or {})
                child_is_named = bool(item_named)
            elif isinstance(child, dict) and "additionalProperties" in child:
                child_is_named = bool(ref_name(child.get("additionalProperties") or {}))
            else:
                child_is_named = bool(child_named)
            fields[child_path] = {"type": child_type, "named": child_is_named}
            visit(child if isinstance(child, dict) else {}, child_path, seen, depth + 1)

    visit(root, "", (), 0)
    return fields


def normalize_doc_path(path: str) -> str:
    s = path.strip().strip("`")
    if s.startswith("/nacos"):
        return s[len("/nacos"):]
    return s


def parse_doc_table(text: str) -> list[dict]:
    """Parse markdown table into list of {name, type, required}. Skip header-like rows."""
    skip_names = {
        "参数名", "类型", "必填", "参数类型", "描述", "描述说明", "是否必填",
        "Parameter", "Parameter Name", "Type", "Required", "Description",
    }
    rows = []
    table_lines = []
    in_table = False
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if line.startswith("|"):
            in_table = True
            table_lines.append(line)
        elif in_table:
            break
    if len(table_lines) < 2:
        return rows
    for line in table_lines[2:]:
        if not line.startswith("|"):
            continue
        parts = [p.strip() for p in line.split("|") if p.strip()]
        if len(parts) >= 3:
            name = parts[0].strip("`")
            normalized_name = re.sub(r"[_\.\-\[\]]", "", name)
            if name in skip_names or "---" in name or "----" in name or not normalized_name.isalnum():
                continue
            typ = parts[1].strip("`") if len(parts) > 1 else ""
            required_cell = parts[2] if len(parts) > 2 else ""
            req = bool(re.search(r"(?:\*\*)?(?:是|Yes)(?:\*\*)?", required_cell, re.I))
            desc = parts[3] if len(parts) > 3 else ""
            rows.append({"name": name, "type": typ, "required": req, "description": desc})
    return rows


def extract_curl(section: str) -> str:
    m = re.search(r"```shell\s*\n(.*?)```", section, re.DOTALL)
    if not m:
        return ""
    return m.group(1).strip()


def extract_sections(content: str):
    """Yield parsed request/response blocks for each API section."""
    # 兼容两种小节标题：### 3.16. 与 ### 3.16 （无点），均视为新小节起始
    sections = re.split(r"(?=^### \d+\.\d+(?:\.|\s))", content, flags=re.MULTILINE)
    for block in sections:
        if not block.strip() or not block.strip().startswith("###"):
            continue
        url_m = re.search(r"#### (?:请求URL|Request URL)\n+\s*`([^`]+)`", block)
        method_m = re.search(r"#### (?:请求方式|Request Method)\n+\s*`(GET|POST|PUT|DELETE|PATCH|HEAD)`", block, re.I)
        if not url_m or not method_m:
            continue
        path = normalize_doc_path(url_m.group(1))
        method = method_m.group(1).upper()
        since_m = re.search(r"#### (?:起始版本|Since)\n+\s*`?([^`\n]+)`?", block)
        since = since_m.group(1).strip() if since_m else ""

        header_block = ""
        params_block = ""
        body_block = ""
        response_block = ""
        header_m = re.search(r"#### (?:请求头|Request Headers?)\n+(.*?)(?=\n#### |\Z)", block, re.DOTALL)
        if header_m:
            header_block = header_m.group(1).strip()
        # 统一为「请求参数」后：可能有多个 #### 请求参数（先 query 后 body），或仅一个
        for m in re.finditer(r"#### (?:请求参数|Request Parameters)\n+(.*?)(?=\n#### |\Z)", block, re.DOTALL):
            chunk = m.group(1).strip()
            if not params_block:
                params_block = chunk
            else:
                body_block = chunk
                break
        # 兼容旧文档仍使用「请求Body」
        if not body_block:
            m = re.search(r"#### (?:请求Body|Request Body)\n+(.*?)(?=\n#### |\Z)", block, re.DOTALL)
            if m:
                body_block = m.group(1).strip()

        response_m = re.search(
            r"#### (?:返回数据|Response Data)\n+(.*?)(?=\n#### |\Z)", block, re.DOTALL
        )
        if response_m:
            response_block = response_m.group(1).strip()

        curl = extract_curl(block)
        yield path, method, since, header_block, params_block, body_block, response_block, curl


def compare_named_response_types(
    api_fields: dict,
    doc_rows: list[dict],
    strict_paths: bool = False,
    require_named_root: bool = False,
) -> list[str]:
    """Report named-schema loss and, optionally, duplicated Result wrapper paths."""
    def normalize_path(path: str) -> str:
        return re.sub(r"\[(?:i|\d*)\]", "[]", (path or "").strip().strip("`"))

    def normalize_type(value: str) -> str:
        return re.sub(r"\s+", "", (value or "").strip().strip("`"))

    generic_types = {
        "object", "array", "array<object>", "map", "map<string,object>",
    }
    expected = {normalize_path(path): value for path, value in api_fields.items()}
    issues = []
    if require_named_root:
        root = expected.get("data")
        doc_paths = {normalize_path(row.get("name") or "") for row in doc_rows}
        if root and root.get("named") and "data" not in doc_paths:
            issues.append(
                f"  [doc 缺少] response.data 命名根类型: {root.get('type')}"
            )
    for row in doc_rows:
        key = normalize_path(row.get("name") or "")
        if strict_paths:
            corrected = ""
            if key in {"data.code", "data.message"}:
                corrected = key.removeprefix("data.")
            elif key == "data.data":
                corrected = "data"
            elif key.startswith("data.data."):
                corrected = "data." + key.removeprefix("data.data.")
            if corrected and corrected in expected:
                issues.append(
                    f"  [响应路径多余包装] response.{row.get('name')}: 应为 {corrected}"
                )
                continue
        api_field = expected.get(key)
        if not api_field or not api_field.get("named"):
            continue
        api_type = normalize_type(api_field.get("type") or "")
        doc_type = normalize_type(row.get("type") or "")
        if not api_type or not doc_type or api_type == doc_type:
            continue
        label = "命名类型丢失" if doc_type.lower() in generic_types else "响应类型不一致"
        issues.append(
            f"  [{label}] response.{row.get('name')}: api type={api_field.get('type')}, "
            f"doc={row.get('type')}"
        )
    return issues


def compare_params(api_params: dict, doc_rows: list[dict], kind: str, report_doc_extras: bool = True) -> list[str]:
    def normalize_type(t: str) -> str:
        t = (t or "").strip().strip("`").lower()
        t = re.sub(r"\s+", "", t)
        # normalize frequent renderings for file upload fields and base scalar aliases
        t = t.replace("string(binary)", "file").replace("string<binary>", "file")
        aliases = {
            "int": "integer",
            "integer": "integer",
            "int32": "integer",
            "int64": "integer",
            "long": "integer",
            "float": "number",
            "double": "number",
            "number": "number",
            "bool": "boolean",
            "boollean": "boolean",
            "string": "string",
            "array": "array",
            "object": "object",
            "map<string,string>": "map<string, string>",
            "binary": "file",
            "multipartfile": "file",
            "multiplefile": "file",
        }
        return aliases.get(t, t)

    def normalize_desc(d: str) -> str:
        d = (d or "").strip()
        d = re.sub(r"`", "", d)
        d = re.sub(r"\*\*", "", d)
        d = re.sub(r"\s+", " ", d)
        if d in {"-", "—", "无", "暂无", "N/A", "n/a"}:
            return "-"
        return d

    api_names = set(api_params.keys())
    doc_names = {r["name"] for r in doc_rows}
    doc_by_name = {r["name"]: r for r in doc_rows}
    issues = []
    for n in sorted(api_names - doc_names):
        issues.append(f"  [doc 缺少] {kind} 参数: {n}")
    if report_doc_extras:
        for n in sorted(doc_names - api_names):
            issues.append(f"  [api 已无] {kind} 参数: {n}")
    for n in sorted(api_names & doc_names):
        api_p = api_params[n]
        doc_p = doc_by_name.get(n)
        if doc_p:
            if doc_p.get("required") != api_p["required"]:
                issues.append(f"  [必填不一致] {kind}.{n}: api required={api_p['required']}, doc={doc_p.get('required')}")
            api_t = normalize_type(api_p.get("type") or "")
            doc_t = normalize_type(doc_p.get("type") or "")
            if api_t and doc_t and api_t != doc_t:
                issues.append(f"  [类型不一致] {kind}.{n}: api type={api_p.get('type')}, doc={doc_p.get('type')}")
            api_d = normalize_desc(api_p.get("description") or "")
            doc_d = normalize_desc(doc_p.get("description") or "")
            # 仅当双方都提供了非占位描述时才比较，避免因空描述引入噪音
            if api_d != "-" and doc_d == "-":
                issues.append(f"  [doc 描述缺失] {kind}.{n}")
    return issues


def curl_has_placeholders(curl: str) -> bool:
    """True if curl uses param=paramName style placeholders."""
    if "?" not in curl:
        return False
    qs = curl.split("?")[1].split("'")[0].split("#")[0]
    for part in qs.split("&"):
        if "=" in part:
            k, v = part.split("=", 1)
            if k == v or (v == k + "}"):
                return True
    return False


def compare_curl_headers(api_params: dict, curl: str, strict_headers: bool) -> list[str]:
    """Check required Swagger headers and Agent publisher header values in curl examples."""
    if not curl:
        return []
    parsed = {}
    for match in re.finditer(r"(?:-H|--header)\s+(['\"])(.*?)\1", curl, re.DOTALL):
        value = match.group(2).strip()
        if ":" not in value:
            continue
        name, header_value = value.split(":", 1)
        parsed[name.strip().lower()] = header_value.strip()

    issues = []
    api_by_lower = {name.lower(): param for name, param in api_params.items()}
    for name, param in api_by_lower.items():
        if param.get("required") and name not in parsed:
            issues.append(f"  [curl Header 缺少] {param.get('name') or name}")
    request_module = parsed.get("request-module")
    if request_module is not None and request_module.upper() != "AI":
        issues.append(f"  [curl Header 值错误] Request-Module: 应为 AI，当前为 {request_module}")
    if strict_headers:
        allowed_extra = {"accept", "authorization", "content-type"}
        for name in sorted(set(parsed) - set(api_by_lower) - allowed_extra):
            if name.startswith("x-nacos-") or name == "request-module":
                issues.append(f"  [api 已无] curl header: {name}")
    return issues


def validate_json_code_blocks(content: str) -> list[str]:
    """Validate fenced JSON examples so placeholders cannot silently break the docs."""
    issues = []
    blocks = re.finditer(r"```json[ \t]*\n(.*?)\n```", content, re.DOTALL | re.IGNORECASE)
    for index, match in enumerate(blocks, start=1):
        try:
            json.loads(match.group(1))
        except json.JSONDecodeError as exc:
            issues.append(
                f"  [JSON 示例无效] 第 {index} 个 json 代码块: "
                f"line {exc.lineno}, column {exc.colno}: {exc.msg}"
            )
    return issues


def main() -> None:
    parser = argparse.ArgumentParser(description="Compare API doc with api.json (report only, no writes)")
    parser.add_argument("--json", required=True, help="Path to api.json")
    parser.add_argument("--doc-type", required=True, choices=["console", "admin", "client"])
    parser.add_argument("--doc-file", required=True, help="Path to .md doc file")
    parser.add_argument("--filter-path", default="", help="Regex to filter paths (optional)")
    parser.add_argument("--exemptions-file", default="", help="Optional exemptions json file")
    parser.add_argument(
        "--strict-response-paths",
        action="store_true",
        help="Report data.code/data.message/data.data paths caused by a duplicated Result wrapper",
    )
    parser.add_argument(
        "--strict-headers",
        action="store_true",
        help="Report headers documented for an operation but absent from its Swagger definition",
    )
    parser.add_argument(
        "--require-named-response-root",
        action="store_true",
        help="Require a data row carrying the named business response type",
    )
    parser.add_argument(
        "--validate-json-examples",
        action="store_true",
        help="Parse every fenced JSON example in the document",
    )
    parser.add_argument(
        "--fail-on-diff",
        action="store_true",
        help="Exit with status 1 when any non-exempt issue is found",
    )
    parser.add_argument(
        "--audit-exemptions",
        action="store_true",
        help="Fail on undocumented, broad, or unused exemption entries",
    )
    args = parser.parse_args()

    spec = load_spec(args.json)
    api_map = build_api_map(spec)
    doc_content = Path(args.doc_file).read_text(encoding="utf-8")
    pattern = re.compile(args.filter_path) if args.filter_path else None
    exemptions = load_exemptions(args.exemptions_file or None, args.doc_type)

    doc_apis = set()
    doc_api_counts = {}
    total_issues = 0
    print(f"# 对比报告: {args.doc_file} vs {args.json}\n")

    for path, method, since, header_block, params_block, body_block, response_block, curl in extract_sections(doc_content):
        key = (path, method)
        endpoint_key = f"{method} {path}"
        doc_apis.add(key)
        doc_api_counts[key] = doc_api_counts.get(key, 0) + 1
        if pattern and not pattern.search(path):
            continue
        if key not in api_map:
            issues = apply_issue_exemptions(endpoint_key, ["  [api.json 中无此 path+method]"], exemptions)
            if issues:
                print(f"## {method} {path}")
                for i in issues:
                    print(i)
                print()
                total_issues += len(issues)
            continue

        spec_entry = api_map[key]
        q_api = spec_entry["query_params"]
        b_api = spec_entry["body_params"]
        h_api = spec_entry["header_params"]
        api_since = spec_entry.get("since") or ""

        no_params = lambda block: not block or not "|" in block or re.match(r"^(?:无|None)\b", block[:10], re.I)
        doc_h = [] if no_params(header_block) else parse_doc_table(header_block)
        doc_q = [] if no_params(params_block) else parse_doc_table(params_block)
        doc_b = parse_doc_table(body_block) if body_block and "|" in body_block else []
        doc_response = parse_doc_table(response_block) if response_block and "|" in response_block else []

        issues = []
        if api_since:
            if not since:
                issues.append(f"  [doc 缺少] 起始版本: {api_since}")
            elif since != api_since:
                issues.append(f"  [起始版本不一致] api since={api_since}, doc={since}")
        # 默认兼容历史文档中 Swagger 未声明的通用 Header；最终门禁用 --strict-headers 检查多写项。
        issues.extend(compare_params(h_api, doc_h, "header", report_doc_extras=args.strict_headers))
        if not body_block:
            # 技能规定 Query 与 Body 合并为一个请求参数表；同名的 multipart/query 参数只展示一次。
            combined_api = {}
            for source in (q_api, b_api):
                for name, param in source.items():
                    if name not in combined_api:
                        combined_api[name] = dict(param)
                        continue
                    merged = combined_api[name]
                    merged["required"] = bool(merged.get("required") or param.get("required"))
                    if param.get("type") == "file":
                        merged["type"] = "file"
                    if (not merged.get("description") or merged.get("description") == "-") and param.get("description"):
                        merged["description"] = param.get("description")
            issues.extend(compare_params(combined_api, doc_q, "request"))
        else:
            issues.extend(compare_params(q_api, doc_q, "query"))
            issues.extend(compare_params(b_api, doc_b, "body"))
        issues.extend(
            compare_named_response_types(
                spec_entry["response_fields"],
                doc_response,
                args.strict_response_paths,
                args.require_named_response_root,
            )
        )
        issues.extend(compare_curl_headers(h_api, curl, args.strict_headers))
        if curl and curl_has_placeholders(curl):
            issues.append("  [curl 示例] 使用占位符 (param=paramName)，建议改为实际示例值")

        issues = apply_issue_exemptions(endpoint_key, issues, exemptions)
        if issues:
            print(f"## {method} {path}")
            for i in issues:
                print(i)
            print()
            total_issues += len(issues)

    only_in_api = set(api_map.keys()) - doc_apis
    if only_in_api:
        print("## api.json 中有但文档中无的接口")
        for path, method in sorted(only_in_api):
            if pattern and not pattern.search(path):
                continue
            endpoint_key = f"{method} {path}"
            if is_api_only_exempt(endpoint_key, exemptions):
                continue
            print(f"  {method} {path}")
            total_issues += 1

    duplicate_apis = {
        key: count
        for key, count in doc_api_counts.items()
        if count > 1 and (not pattern or pattern.search(key[0]))
    }
    if duplicate_apis:
        print("## 文档中重复的接口")
        for (path, method), count in sorted(duplicate_apis.items()):
            print(f"  {method} {path}: {count} occurrences")
            total_issues += 1

    if args.validate_json_examples:
        json_issues = validate_json_code_blocks(doc_content)
        if json_issues:
            print("## JSON 示例校验")
            for issue in json_issues:
                print(issue)
            total_issues += len(json_issues)

    if args.audit_exemptions:
        exemption_issues = audit_exemptions(exemptions, pattern)
        if exemption_issues:
            print("## 豁免校验")
            for issue in exemption_issues:
                print(issue)
            total_issues += len(exemption_issues)

    print(f"\n--- 合计差异/问题数: {total_issues} ---")
    sys.exit(1 if args.fail_on_diff and total_issues else 0)


if __name__ == "__main__":
    main()
