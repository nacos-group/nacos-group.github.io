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
from swagger_to_md import get_api_since, parse_parameters  # noqa: E402


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
    out = []
    for i in issues:
        if i in ignore_exact:
            continue
        if any(i.startswith(pfx) for pfx in ignore_prefix):
            continue
        out.append(i)
    return out


def is_api_only_exempt(endpoint_key: str, exemptions: dict) -> bool:
    if not exemptions:
        return False
    ep_rule = exemptions.get(endpoint_key, {})
    if not isinstance(ep_rule, dict):
        return False
    return bool(ep_rule.get("ignore_api_only"))


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
            api_map[(path_key, method.upper())] = {
                "query_params": {p["name"]: p for p in query_params},
                "body_params": {p["name"]: p for p in body_params},
                "since": get_api_since(op),
            }
    return api_map


def normalize_doc_path(path: str) -> str:
    s = path.strip().strip("`")
    if s.startswith("/nacos"):
        return s[len("/nacos"):]
    return s


def parse_doc_table(text: str) -> list[dict]:
    """Parse markdown table into list of {name, type, required}. Skip header-like rows."""
    skip_names = {"参数名", "类型", "必填", "参数类型", "描述", "描述说明", "是否必填"}
    rows = []
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    if len(lines) < 2:
        return rows
    for line in lines[2:]:
        if not line.startswith("|"):
            continue
        parts = [p.strip() for p in line.split("|") if p.strip()]
        if len(parts) >= 3:
            name = parts[0].strip("`")
            if name in skip_names or "---" in name or "----" in name or not name.replace("_", "").replace(".", "").isalnum():
                continue
            typ = parts[1].strip("`") if len(parts) > 1 else ""
            req = "**是**" in (parts[2] if len(parts) > 2 else "") or "是" in (parts[2] if len(parts) > 2 else "")
            desc = parts[3] if len(parts) > 3 else ""
            rows.append({"name": name, "type": typ, "required": req, "description": desc})
    return rows


def extract_curl(section: str) -> str:
    m = re.search(r"```shell\s*\n(.*?)```", section, re.DOTALL)
    if not m:
        return ""
    return m.group(1).strip().split("\n")[0].strip()


def extract_sections(content: str):
    """Yield (path, method, since, params_block, body_block, curl) for each API section."""
    # 兼容两种小节标题：### 3.16. 与 ### 3.16 （无点），均视为新小节起始
    sections = re.split(r"(?=^### \d+\.\d+(?:\.|\s))", content, flags=re.MULTILINE)
    for block in sections:
        if not block.strip() or not block.strip().startswith("###"):
            continue
        url_m = re.search(r"#### 请求URL\n+\s*`([^`]+)`", block)
        method_m = re.search(r"#### 请求方式\n+\s*`(GET|POST|PUT|DELETE|PATCH|HEAD)`", block, re.I)
        if not url_m or not method_m:
            continue
        path = normalize_doc_path(url_m.group(1))
        method = method_m.group(1).upper()
        since_m = re.search(r"#### 起始版本\n+\s*`?([^`\n]+)`?", block)
        since = since_m.group(1).strip() if since_m else ""

        params_block = ""
        body_block = ""
        # 统一为「请求参数」后：可能有多个 #### 请求参数（先 query 后 body），或仅一个
        for m in re.finditer(r"#### 请求参数\n+(.*?)(?=\n#### |\Z)", block, re.DOTALL):
            chunk = m.group(1).strip()
            if not params_block:
                params_block = chunk
            else:
                body_block = chunk
                break
        # 兼容旧文档仍使用「请求Body」
        if not body_block:
            m = re.search(r"#### 请求Body\n+(.*?)(?=\n#### |\Z)", block, re.DOTALL)
            if m:
                body_block = m.group(1).strip()

        curl = extract_curl(block)
        yield path, method, since, params_block, body_block, curl


def compare_params(api_params: dict, doc_rows: list[dict], kind: str) -> list[str]:
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
            if api_d != "-" and doc_d != "-" and api_d != doc_d:
                issues.append(f"  [描述不一致] {kind}.{n}")
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


def main() -> None:
    parser = argparse.ArgumentParser(description="Compare API doc with api.json (report only, no writes)")
    parser.add_argument("--json", required=True, help="Path to api.json")
    parser.add_argument("--doc-type", required=True, choices=["console", "admin", "client"])
    parser.add_argument("--doc-file", required=True, help="Path to .md doc file")
    parser.add_argument("--filter-path", default="", help="Regex to filter paths (optional)")
    parser.add_argument("--exemptions-file", default="", help="Optional exemptions json file")
    args = parser.parse_args()

    spec = load_spec(args.json)
    api_map = build_api_map(spec)
    doc_content = Path(args.doc_file).read_text(encoding="utf-8")
    pattern = re.compile(args.filter_path) if args.filter_path else None
    exemptions = load_exemptions(args.exemptions_file or None, args.doc_type)

    doc_apis = set()
    total_issues = 0
    print(f"# 对比报告: {args.doc_file} vs {args.json}\n")

    for path, method, since, params_block, body_block, curl in extract_sections(doc_content):
        key = (path, method)
        endpoint_key = f"{method} {path}"
        doc_apis.add(key)
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
        api_since = spec_entry.get("since") or ""

        doc_q = parse_doc_table(params_block) if params_block and "|" in params_block and "无" not in params_block[:10] else []
        doc_b = parse_doc_table(body_block) if body_block and "|" in body_block else []

        # 文档仅有一个请求参数表且 api 无 query 仅有 body 时，将该表视为 body（与现有文档风格一致，不要求写「无 Query 参数」）
        if not doc_b and not q_api and b_api and params_block and "|" in params_block and "无" not in params_block[:10]:
            doc_q = []
            doc_b = parse_doc_table(params_block)

        issues = []
        if api_since:
            if not since:
                issues.append(f"  [doc 缺少] 起始版本: {api_since}")
            elif since != api_since:
                issues.append(f"  [起始版本不一致] api since={api_since}, doc={since}")
        issues.extend(compare_params(q_api, doc_q, "query"))
        issues.extend(compare_params(b_api, doc_b, "body"))
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

    print(f"\n--- 合计差异/问题数: {total_issues} ---")
    sys.exit(0)


if __name__ == "__main__":
    main()
