#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Compare Nacos Java Client API (ConfigService, NamingService, LockService, AiService, A2aService)
with usage.md and output: new APIs, new overloads to add, and removed overloads to delete/annotate.
**Does NOT modify any file.** Use report to update docs per reference.md.

Usage (nacos repo root for --nacos-api-dir; doc repo for --usage-md):
  python .cursor/skills/nacos-java-sdk-doc/scripts/compare_java_api_with_doc.py \\
    --nacos-api-dir /path/to/nacos/api/src/main/java \\
    --usage-md src/content/docs/next/zh-cn/manual/user/java-sdk/usage.md

**Only next version**: --usage-md should point under docs/next/; do not use latest, v3.0, etc.

Or with NACOS_REPO and DOC_REPO env or defaults:
  python compare_java_api_with_doc.py --nacos-api-dir ../nacos/api/src/main/java --usage-md src/content/docs/next/zh-cn/manual/user/java-sdk/usage.md
"""
import argparse
import re
import sys
from pathlib import Path

# Interface -> doc chapter mapping (reference.md)
# 已有模块保持原序：3 配置, 4 服务发现, 5 分布式锁, 6 MCP, 7 A2A, 8 Skill, 9 Prompt, 10 AgentSpec, 11 生命周期
INTERFACE_CHAPTER = {
    "ConfigService": 3,   # 配置管理 API
    "NamingService": 4,   # 服务发现API
    "LockService": 5,     # 分布式锁API
    "AiService": 6,       # MCP 服务（Skill 第 8 章、Prompt 第 9 章，shutdown 在生命周期章不单独列）
    "A2aService": 7,      # A2A 注册中心
}

# Doc section first digit -> interface name (for REMOVED OVERLOADS)
CHAPTER_TO_SOURCE = {
    "3": "ConfigService",
    "4": "NamingService",
    "5": "LockService",
    "6": "AiService",
    "7": "A2aService",
    "8": "AiService",
    "9": "AiService",
    "10": "AiService",
}


def _count_top_level_params(param_text: str) -> int:
    """
    Count top-level parameters in a parameter list string.
    Handles generics/nested structures like:
    - Map<String, String>
    - List<Map<String, Integer>>
    - method calls in examples with nested parentheses
    """
    s = (param_text or "").strip()
    if not s:
        return 0
    depth_angle = 0
    depth_paren = 0
    depth_bracket = 0
    count = 0
    has_token = False
    for ch in s:
        if ch == "<":
            depth_angle += 1
            has_token = True
        elif ch == ">":
            depth_angle = max(0, depth_angle - 1)
            has_token = True
        elif ch == "(":
            depth_paren += 1
            has_token = True
        elif ch == ")":
            depth_paren = max(0, depth_paren - 1)
            has_token = True
        elif ch == "[":
            depth_bracket += 1
            has_token = True
        elif ch == "]":
            depth_bracket = max(0, depth_bracket - 1)
            has_token = True
        elif ch == "," and depth_angle == 0 and depth_paren == 0 and depth_bracket == 0:
            if has_token:
                count += 1
                has_token = False
        elif not ch.isspace():
            has_token = True
    if has_token:
        count += 1
    return count


def parse_usage_md(content: str) -> dict:
    """
    Parse usage.md and return documented method keys.
    Returns: { method_name: [ (section_id, param_count_from_code) ] }
    Section id is like "3.1", "4.2". We extract method names from ### N.M. section's first ```java block.
    """
    doc_methods = {}  # method_name -> list of (section, param_count or None)
    # Split by ### N.M. (digit.digit)
    section_re = re.compile(r"^###\s+(\d+)\.(\d+)\.\s+.+$", re.MULTILINE)
    sections = list(section_re.finditer(content))
    for i, m in enumerate(sections):
        start = m.end()
        end = sections[i + 1].start() if i + 1 < len(sections) else len(content)
        section_text = content[start:end]
        section_id = f"{m.group(1)}.{m.group(2)}"
        # Find first ```java block and extract method declarations: ReturnType methodName( ... );
        code_re = re.compile(r"```java\s*\n(.*?)```", re.DOTALL)
        for code_m in code_re.finditer(section_text):
            code_block = code_m.group(1)
            # Track (name, param_count) so we record all overloads in the same block
            seen_in_block = set()
            # Parse declaration-style signatures from whole block to support multi-line declarations.
            decl_re = re.compile(
                r"(?m)^\s*(?:public\s+)?(?:default\s+|static\s+)?[\w<>,\s\[\].?]+\s+(\w+)\s*\((.*?)\)\s*(?:throws\s+[^;{]+)?\s*;?\s*$",
                re.DOTALL,
            )
            for decl in decl_re.finditer(code_block):
                name = decl.group(1)
                if name in ("if", "for", "while", "switch", "return", "new", "try", "catch"):
                    continue
                params = decl.group(2)
                param_count = _count_top_level_params(params)
                key = (name, param_count)
                if key in seen_in_block:
                    continue
                seen_in_block.add(key)
                doc_methods.setdefault(name, []).append((section_id, param_count))

            # Also parse call-style usage in the same code block (usually examples)
            for line in code_block.split("\n"):
                line = line.strip()
                # Call style: configService.getConfig( or naming.registerInstance(
                call = re.search(r"(?:configService|ConfigService|naming|namingService|lockService|aiService|AiService)\.(\w+)\s*\(", line)
                if call:
                    name = call.group(1)
                    paren = line.find("(", line.find(name))
                    close = line.find(")", paren) if paren != -1 else -1
                    param_count = _count_top_level_params(line[paren + 1 : close]) if close != -1 else None
                    key = (name, param_count)
                    if key not in seen_in_block:
                        seen_in_block.add(key)
                        doc_methods.setdefault(name, []).append((section_id, param_count))
            if seen_in_block:
                break  # first code block per section only
    return doc_methods


def load_java_api(nacos_api_dir: str) -> list:
    """Load parsed methods from ConfigService, NamingService, LockService, AiService, A2aService."""
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    from parse_java_interface import parse_java_interface  # noqa: E402

    base = Path(nacos_api_dir)
    if (base / "com/alibaba/nacos/api").exists():
        api_root = base / "com/alibaba/nacos/api"
    elif (base / "api").exists():
        api_root = base / "api"
    else:
        api_root = base
    interfaces = [
        ("ConfigService", api_root / "config/ConfigService.java"),
        ("NamingService", api_root / "naming/NamingService.java"),
        ("LockService", api_root / "lock/LockService.java"),
        ("AiService", api_root / "ai/AiService.java"),
        ("A2aService", api_root / "ai/A2aService.java"),
    ]
    all_methods = []
    for name, p in interfaces:
        if p.exists():
            content = p.read_text(encoding="utf-8")
            all_methods.extend(parse_java_interface(content, name))
        else:
            print(f"Warning: not found {p}", file=sys.stderr)
    return all_methods


def main():
    ap = argparse.ArgumentParser(
        description="Compare Java Client API with usage.md; output new and changed APIs (no file changes)"
    )
    ap.add_argument(
        "--nacos-api-dir",
        type=str,
        required=True,
        help="Path to nacos api module: api/src/main/java or repo root",
    )
    ap.add_argument(
        "--usage-md",
        type=str,
        required=True,
        help="Path to usage.md (zh-cn or en)",
    )
    ap.add_argument("--json", action="store_true", help="Output machine-readable JSON")
    args = ap.parse_args()

    api_dir = Path(args.nacos_api_dir)
    usage_path = Path(args.usage_md)
    if not api_dir.exists():
        print(f"Error: nacos-api-dir not found: {api_dir}", file=sys.stderr)
        sys.exit(1)
    if not usage_path.exists():
        print(f"Error: usage-md not found: {usage_path}", file=sys.stderr)
        sys.exit(1)
    # This skill only updates next version docs; do not use latest/v3.0 paths
    usage_str = str(usage_path)
    if "/next/" not in usage_str or "latest" in usage_str or "v3.0" in usage_str:
        print("Warning: usage-md should be under docs/next/; do not use latest or v3.0 (this skill only edits next).", file=sys.stderr)

    java_methods = load_java_api(str(api_dir))
    usage_content = usage_path.read_text(encoding="utf-8")
    doc_methods = parse_usage_md(usage_content)

    # Build (methodName, param_count) set from doc (any overload documented = method documented)
    doc_method_set = set()
    for name, entries in doc_methods.items():
        for _ in entries:
            doc_method_set.add(name)

    # Methods documented in 生命周期 chapter, not as separate API sections
    SKIP_NEW_API = {"shutdown", "shutDown"}

    # (source, method_name, param_count) design-deprecated, do not suggest adding to doc
    SKIP_NEW_OVERLOAD = {
        ("NamingService", "getServicesOfServer", 4),  # overload with AbstractSelector, deprecated by design
    }

    # New: in Java but method name not in doc
    by_source = {}
    for m in java_methods:
        by_source.setdefault(m["source"], []).append(m)
    new_by_interface = {}
    for source, methods in by_source.items():
        new = [m for m in methods if m["name"] not in doc_method_set and m["name"] not in SKIP_NEW_API]
        if new:
            new_by_interface[source] = new

    # New overloads: method name is documented but this (name, param_count) is not
    doc_name_param_set = set()
    for name, entries in doc_methods.items():
        for _, pc in entries:
            if pc is not None:
                doc_name_param_set.add((name, pc))
    new_overloads = [
        m for m in java_methods
        if m["name"] in doc_method_set
        and (m["name"], m["param_count"]) not in doc_name_param_set
        and (m["source"], m["name"], m["param_count"]) not in SKIP_NEW_OVERLOAD
    ]

    # Removed overloads: (method_name, param_count) in doc but not in interface for that source
    java_source_method_params = {}  # (source, method_name) -> set of param_count
    for m in java_methods:
        key = (m["source"], m["name"])
        java_source_method_params.setdefault(key, set()).add(m["param_count"])
    removed_overloads = []
    for name, entries in doc_methods.items():
        for section_id, pc in entries:
            if pc is None:
                continue
            chapter = section_id.split(".")[0]
            source = CHAPTER_TO_SOURCE.get(chapter)
            if source is None:
                continue
            key = (source, name)
            if key not in java_source_method_params:
                continue  # method not in interface (e.g. wrong chapter or obsolete API)
            if pc not in java_source_method_params[key]:
                removed_overloads.append({"source": source, "name": name, "param_count": pc, "section_id": section_id})

    if args.json:
        import json
        out = {
            "new_by_interface": {
                k: [{"name": x["name"], "param_count": x["param_count"], "return_type": x["return_type"], "since": x.get("since")} for x in v
                ]
                for k, v in new_by_interface.items()
            },
            "new_overloads": [
                {"name": m["name"], "source": m["source"], "param_count": m["param_count"], "return_type": m["return_type"]}
                for m in new_overloads
            ],
            "removed_overloads": [
                {"name": r["name"], "source": r["source"], "param_count": r["param_count"], "section_id": r["section_id"]}
                for r in removed_overloads
            ],
        }
        print(json.dumps(out, indent=2, ensure_ascii=False))
        return

    # Human report
    print("=== Nacos Java SDK API vs usage.md ===\n")
    if new_by_interface:
        print("--- NEW APIs (in interface, not in doc) ---")
        for source, methods in sorted(new_by_interface.items()):
            chapter = INTERFACE_CHAPTER.get(source, "?")
            print(f"\n  [{source}] -> Chapter {chapter}")
            for m in methods:
                since = f"  @since {m.get('since')}" if m.get("since") else ""
                print(f"    {m['return_type']} {m['name']}({m['param_count']} params){since}")
        print()
    else:
        print("--- No new APIs (all interface methods are documented). ---\n")

    if new_overloads:
        print("--- NEW OVERLOADS (same method name, param_count not in doc; add to section) ---")
        for m in new_overloads:
            print(f"  {m['source']}.{m['name']}({m['param_count']} params) -> {m['return_type']}")
        print()
    else:
        print("--- No new overloads to add. ---\n")

    if removed_overloads:
        print("--- REMOVED OVERLOADS (param_count in doc but not in interface; delete or annotate deprecated) ---")
        for r in removed_overloads:
            print(f"  {r['source']}.{r['name']}({r['param_count']} params)  section {r['section_id']}")
        print()
    else:
        print("--- No removed overloads. ---\n")

    print("Update usage.md per .cursor/skills/nacos-java-sdk-doc/reference.md (sections, tables, examples).")


if __name__ == "__main__":
    main()
