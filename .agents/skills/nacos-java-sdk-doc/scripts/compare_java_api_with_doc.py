#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Compare Nacos Java Client API (ConfigService, NamingService, LockService, AiService,
AgentDiscoveryService, A2aService)
with usage.md and output: new/removed APIs, exact new/removed overload signatures,
and return-type mismatches.
**Does NOT modify any file.** Use report to update docs per reference.md.

Usage (nacos repo root for --nacos-api-dir; doc repo for --usage-md):
  python .agents/skills/nacos-java-sdk-doc/scripts/compare_java_api_with_doc.py \\
    --nacos-api-dir /path/to/nacos \\
    --usage-md src/content/docs/next/zh-cn/manual/user/java-sdk/usage.md

**Only next version**: --usage-md should point under docs/next/; do not use latest, v3.0, etc.

Or with NACOS_REPO and DOC_REPO env or defaults:
  python compare_java_api_with_doc.py --nacos-api-dir ../nacos/api/src/main/java --usage-md src/content/docs/next/zh-cn/manual/user/java-sdk/usage.md
"""
import argparse
import re
import sys
from pathlib import Path

# Interface -> default doc chapter mapping (reference.md).
# AiService spans multiple chapters and is handled by method_chapter().
DEFAULT_SOURCE_CHAPTER = {
    "ConfigService": 3,   # 配置管理 API
    "NamingService": 4,   # 服务发现API
    "LockService": 5,     # 分布式锁API
    "AiService": 6,       # MCP 服务；部分方法由 AI_METHOD_CHAPTER 覆盖
    "A2aService": 7,      # A2A 注册中心
    "AgentDiscoveryService": 11,  # 协议无关 Agent 发现与 Endpoint 发布
}

# AiService directly declares methods for several independent AI capabilities.
AI_METHOD_CHAPTER = {
    "downloadSkillZip": 8,
    "downloadSkillZipByVersion": 8,
    "downloadSkillZipByLabel": 8,
    "subscribeSkill": 8,
    "unsubscribeSkill": 8,
    "getPrompt": 9,
    "getPromptByVersion": 9,
    "getPromptByLabel": 9,
    "subscribePrompt": 9,
    "unsubscribePrompt": 9,
    "loadAgentSpec": 10,
    "subscribeAgentSpec": 10,
    "unsubscribeAgentSpec": 10,
    "publishAgent": 11,
}


def method_chapter(method: dict) -> int:
    """Return the usage.md chapter that owns one parsed method."""
    if method["source"] == "AiService":
        return AI_METHOD_CHAPTER.get(method["name"], DEFAULT_SOURCE_CHAPTER["AiService"])
    return DEFAULT_SOURCE_CHAPTER[method["source"]]


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


def _normalize_type(type_text: str) -> str:
    """Normalize Java type spelling for source-to-doc signature comparison."""
    value = re.sub(r"\b(?:public|protected|private|default|static|final)\b", "", type_text or "")
    value = re.sub(r"\b(?:[a-z_]\w*\.)+([A-Z]\w*)", r"\1", value)
    value = value.replace("...", "[]")
    return re.sub(r"\s+", "", value)


def parse_usage_signatures(content: str) -> list[dict]:
    """Extract exact declaration signatures from the first Java block of each API section."""
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    from parse_java_interface import parse_method_signature  # noqa: E402

    signatures = []
    section_re = re.compile(r"^###\s+(\d+)\.(\d+)\.\s+.+$", re.MULTILINE)
    sections = list(section_re.finditer(content))
    declaration_re = re.compile(
        r"(?m)^\s*(?:public\s+)?(?:default\s+|static\s+)?[\w<>,\s\[\].?]+\s+\w+\s*\((.*?)\)\s*(?:throws\s+[^;{]+)?\s*;?\s*$",
        re.DOTALL,
    )
    for i, section in enumerate(sections):
        start = section.end()
        end = sections[i + 1].start() if i + 1 < len(sections) else len(content)
        section_text = content[start:end]
        section_id = f"{section.group(1)}.{section.group(2)}"
        code_match = re.search(r"```java\s*\n(.*?)```", section_text, flags=re.DOTALL)
        if not code_match:
            continue
        for declaration in declaration_re.finditer(code_match.group(1)):
            raw = declaration.group(0).strip()
            if raw.startswith("public "):
                raw = raw[7:].strip()
            parsed = parse_method_signature(raw)
            if not parsed or parsed["name"] in ("if", "for", "while", "switch", "return", "new", "try", "catch"):
                continue
            signatures.append({
                "section_id": section_id,
                "chapter": int(section.group(1)),
                "name": parsed["name"],
                "param_types": tuple(_normalize_type(t) for t in parsed["param_types"]),
                "param_count": parsed["param_count"],
                "return_type": _normalize_type(parsed["return_type"]),
            })
    return signatures


def load_java_api(nacos_api_dir: str) -> list:
    """Load all Java Client interfaces that own documented usage APIs."""
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    from parse_java_interface import parse_java_interface, resolve_api_root  # noqa: E402

    base = Path(nacos_api_dir)
    api_root = resolve_api_root(base)
    interfaces = [
        ("ConfigService", api_root / "config/ConfigService.java"),
        ("NamingService", api_root / "naming/NamingService.java"),
        ("LockService", api_root / "lock/LockService.java"),
        ("AiService", api_root / "ai/AiService.java"),
        ("AgentDiscoveryService", api_root / "ai/AgentDiscoveryService.java"),
        ("A2aService", api_root / "ai/A2aService.java"),
    ]
    all_methods = []
    missing = []
    for name, p in interfaces:
        if p.exists():
            content = p.read_text(encoding="utf-8")
            methods = parse_java_interface(content, name)
            for method in methods:
                method["chapter"] = method_chapter(method)
            all_methods.extend(methods)
        else:
            missing.append(str(p))
    if missing:
        raise FileNotFoundError(
            "Required Java SDK interfaces are missing:\n  - " + "\n  - ".join(missing)
        )
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

    try:
        java_methods = load_java_api(str(api_dir))
    except FileNotFoundError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        sys.exit(1)
    usage_content = usage_path.read_text(encoding="utf-8")
    doc_methods = parse_usage_md(usage_content)
    doc_signatures = parse_usage_signatures(usage_content)

    # Scope method identity by chapter. The same method name can legitimately exist
    # in more than one facade (for example legacy A2A and protocol-neutral Agent APIs).
    doc_chapter_method_set = set()
    for name, entries in doc_methods.items():
        for section_id, _ in entries:
            chapter = section_id.split(".")[0]
            if chapter.isdigit():
                doc_chapter_method_set.add((int(chapter), name))

    # Methods documented in 生命周期 chapter, not as separate API sections
    SKIP_NEW_API = {"shutdown", "shutDown"}

    # Source methods intentionally held back because the higher-priority spec
    # has not accepted them as a stable public SDK contract yet. Remove the
    # exemption once specs/{zh-cn,en}/lock/lock-spec.md defines renewal.
    DEFERRED_API_REASONS = {
        ("LockService", "renew"): (
            "Source exposes renew, but specs/{zh-cn,en}/lock/lock-spec.md still "
            "lists renewal as pending; document only after both specs accept the contract."
        ),
    }
    SKIP_NEW_API_BY_SOURCE = set(DEFERRED_API_REASONS)
    deferred_apis = [
        {
            "source": method["source"],
            "name": method["name"],
            "chapter": method["chapter"],
            "param_types": method["param_types"],
            "reason": DEFERRED_API_REASONS[(method["source"], method["name"])],
        }
        for method in java_methods
        if (method["source"], method["name"]) in DEFERRED_API_REASONS
    ]

    # (source, method_name) families with design-deprecated typed overloads.
    SKIP_NEW_OVERLOAD = {
        ("NamingService", "getServicesOfServer"),
    }

    # New: in Java but method name not in its owning chapter.
    by_source = {}
    for m in java_methods:
        by_source.setdefault(m["source"], []).append(m)
    new_by_interface = {}
    for source, methods in by_source.items():
        new = [
            m for m in methods
            if (m["chapter"], m["name"]) not in doc_chapter_method_set
            and m["name"] not in SKIP_NEW_API
            and (m["source"], m["name"]) not in SKIP_NEW_API_BY_SOURCE
        ]
        if new:
            new_by_interface[source] = new

    new_by_chapter = {}
    for methods in new_by_interface.values():
        for method in methods:
            new_by_chapter.setdefault(method["chapter"], []).append(method)

    # New overloads/signatures: use normalized parameter types, not only the
    # parameter count. Several Nacos APIs have same-count overloads with
    # different types.
    doc_signature_set = {
        (item["chapter"], item["name"], item["param_types"])
        for item in doc_signatures
    }

    def is_skipped_new_overload(method: dict) -> bool:
        if (method["source"], method["name"]) not in SKIP_NEW_OVERLOAD:
            return False
        return "AbstractSelector" in {_normalize_type(t) for t in method["param_types"]}

    new_overloads = [
        m for m in java_methods
        if (m["chapter"], m["name"]) in doc_chapter_method_set
        and (m["chapter"], m["name"], tuple(_normalize_type(t) for t in m["param_types"])) not in doc_signature_set
        and not is_skipped_new_overload(m)
    ]

    # Removed overloads and return-type mismatches are also exact-signature
    # comparisons. This catches same-count type substitutions.
    java_chapter_method_params = {}
    java_chapter_method_sources = {}
    java_signature_returns = {}
    for m in java_methods:
        key = (m["chapter"], m["name"])
        java_chapter_method_params.setdefault(key, set()).add(m["param_count"])
        java_chapter_method_sources.setdefault(key, set()).add(m["source"])
        signature_key = (m["chapter"], m["name"], tuple(_normalize_type(t) for t in m["param_types"]))
        java_signature_returns[signature_key] = _normalize_type(m["return_type"])
    documented_api_chapters = set(DEFAULT_SOURCE_CHAPTER.values()) | set(AI_METHOD_CHAPTER.values())
    removed_apis = []
    seen_removed_apis = set()
    for name, entries in doc_methods.items():
        for section_id, _ in entries:
            chapter_text = section_id.split(".")[0]
            if not chapter_text.isdigit():
                continue
            chapter = int(chapter_text)
            key = (chapter, name)
            if chapter not in documented_api_chapters or key in java_chapter_method_params:
                continue
            report_key = (section_id, name)
            if report_key not in seen_removed_apis:
                seen_removed_apis.add(report_key)
                removed_apis.append({"name": name, "section_id": section_id, "chapter": chapter})

    removed_overloads = []
    return_type_mismatches = []
    for item in doc_signatures:
        method_key = (item["chapter"], item["name"])
        if method_key not in java_chapter_method_params:
            continue  # reported as a removed API above
        signature_key = (item["chapter"], item["name"], item["param_types"])
        if signature_key not in java_signature_returns:
            removed_overloads.append({
                "source": ",".join(sorted(java_chapter_method_sources[method_key])),
                "name": item["name"],
                "param_count": item["param_count"],
                "param_types": list(item["param_types"]),
                "section_id": item["section_id"],
                "chapter": item["chapter"],
            })
            continue
        source_return = java_signature_returns[signature_key]
        if item["return_type"] and item["return_type"] != source_return:
            return_type_mismatches.append({
                "name": item["name"],
                "param_types": list(item["param_types"]),
                "section_id": item["section_id"],
                "chapter": item["chapter"],
                "documented_return_type": item["return_type"],
                "source_return_type": source_return,
            })

    if args.json:
        import json
        out = {
            "new_by_interface": {
                k: [{"name": x["name"], "chapter": x["chapter"], "param_count": x["param_count"], "return_type": x["return_type"], "since": x.get("since")} for x in v
                ]
                for k, v in new_by_interface.items()
            },
            "new_by_chapter": {
                str(k): [{"name": x["name"], "source": x["source"], "param_count": x["param_count"], "return_type": x["return_type"], "since": x.get("since")} for x in v]
                for k, v in sorted(new_by_chapter.items())
            },
            "deferred_apis": deferred_apis,
            "new_overloads": [
                {"name": m["name"], "source": m["source"], "chapter": m["chapter"], "param_count": m["param_count"], "param_types": m["param_types"], "return_type": m["return_type"]}
                for m in new_overloads
            ],
            "removed_apis": removed_apis,
            "removed_overloads": [
                {"name": r["name"], "source": r["source"], "param_count": r["param_count"], "param_types": r["param_types"], "section_id": r["section_id"]}
                for r in removed_overloads
            ],
            "return_type_mismatches": return_type_mismatches,
        }
        print(json.dumps(out, indent=2, ensure_ascii=False))
        return

    # Human report
    print("=== Nacos Java SDK API vs usage.md ===\n")
    if new_by_interface:
        print("--- NEW APIs (in interface, not in doc) ---")
        for source, methods in sorted(new_by_interface.items()):
            chapters = ", ".join(str(ch) for ch in sorted({m["chapter"] for m in methods}))
            print(f"\n  [{source}] -> Chapter(s) {chapters}")
            for m in methods:
                since = f"  @since {m.get('since')}" if m.get("since") else ""
                print(f"    Ch{m['chapter']} {m['return_type']} {m['name']}({m['param_count']} params){since}")
        print()
    else:
        print("--- No new APIs (all interface methods are documented). ---\n")

    if deferred_apis:
        print("--- DEFERRED APIs (source/spec conflict; do not document yet) ---")
        for item in deferred_apis:
            params = ", ".join(item["param_types"])
            print(f"  Ch{item['chapter']} {item['source']}.{item['name']}({params}): {item['reason']}")
        print()

    if new_overloads:
        print("--- NEW OVERLOADS (exact parameter-type signature not in doc; add to section) ---")
        for m in new_overloads:
            params = ", ".join(m["param_types"])
            print(f"  Ch{m['chapter']} {m['source']}.{m['name']}({params}) -> {m['return_type']}")
        print()
    else:
        print("--- No new overloads to add. ---\n")

    if removed_apis:
        print("--- REMOVED APIs (documented method no longer exists in its source chapter) ---")
        for item in removed_apis:
            print(f"  Ch{item['chapter']} {item['name']}  section {item['section_id']}")
        print()
    else:
        print("--- No removed APIs. ---\n")

    if removed_overloads:
        print("--- REMOVED OVERLOADS (documented parameter-type signature not in interface) ---")
        for r in removed_overloads:
            params = ", ".join(r["param_types"])
            print(f"  {r['source']}.{r['name']}({params})  section {r['section_id']}")
        print()
    else:
        print("--- No removed overloads. ---\n")

    if return_type_mismatches:
        print("--- RETURN TYPE MISMATCHES ---")
        for item in return_type_mismatches:
            params = ", ".join(item["param_types"])
            print(
                f"  Ch{item['chapter']} {item['name']}({params}) section {item['section_id']}: "
                f"doc={item['documented_return_type']}, source={item['source_return_type']}"
            )
        print()
    else:
        print("--- No return type mismatches. ---\n")

    print("Update usage.md per .agents/skills/nacos-java-sdk-doc/reference.md (sections, tables, examples).")


if __name__ == "__main__":
    main()
