#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Compare Nacos Maintainer Java API (Config, Naming, Core, Mcp, A2a, Prompt, Skill, AgentSpec)
with maintainer-sdk.md and output: new APIs, new overloads to add, and removed overloads.
**Does NOT modify any file.** Use report to update docs per reference.md.

Usage (doc repo root):
  python .agents/skills/nacos-java-maintainer-sdk/scripts/compare_maintainer_api_with_doc.py \\
    --nacos-maintainer-dir /path/to/nacos/maintainer-client/src/main/java \\
    --maintainer-md src/content/docs/next/zh-cn/manual/admin/maintainer-sdk.md

**Only next version**: --maintainer-md should point under docs/next/; do not use latest, v3.0, etc.
"""
import argparse
import re
import sys
from pathlib import Path

# Import parser from same dir
sys.path.insert(0, str(Path(__file__).resolve().parent))
from parse_maintainer_interface import (  # noqa: E402
    CHAPTER_INTERFACES,
    get_all_methods_by_chapter,
)

# Doc section first digit -> which chapter (for REMOVED OVERLOADS we need to check method belongs to that chapter's interfaces)
CHAPTER_TO_SOURCE = {str(ch): list(interfaces) for ch, interfaces in CHAPTER_INTERFACES.items()}


def _count_top_level_params(param_text: str) -> int:
    """Count top-level params, ignoring commas inside generics/nested calls."""
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


def parse_maintainer_md(content: str) -> dict:
    """
    Parse maintainer-sdk.md and return documented method keys.
    Returns: { method_name: [ (section_id, param_count_from_code) ] }
    """
    doc_methods = {}
    section_re = re.compile(r"^###\s+(\d+)\.(\d+)\.\s+.+$", re.MULTILINE)
    sections = list(section_re.finditer(content))
    for i, m in enumerate(sections):
        start = m.end()
        end = sections[i + 1].start() if i + 1 < len(sections) else len(content)
        section_text = content[start:end]
        section_id = f"{m.group(1)}.{m.group(2)}"
        code_re = re.compile(r"```java\s*\n(.*?)```", re.DOTALL)
        for code_m in code_re.finditer(section_text):
            code_block = code_m.group(1)
            seen_in_block = set()
            # Parse declaration-style signatures from whole block, supports multi-line signatures.
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

            for line in code_block.split("\n"):
                line = line.strip()
                if line.startswith("public "):
                    line = line[7:].strip()
                if line.startswith("#"):
                    continue
                call = re.search(
                    r"(?:configMaintainerService|maintainService|aiMaintainerService|namingMaintainerService|namingMaintainService)\.(\w+)\s*\(",
                    line,
                )
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
                break
    return doc_methods


def detect_structure_warnings(content: str) -> list:
    """Detect obvious document structure issues."""
    warnings = []
    chapter_nums = [int(x) for x in re.findall(r"^##\s+(\d+)\.", content, flags=re.MULTILINE)]
    if chapter_nums and chapter_nums != sorted(chapter_nums):
        warnings.append(
            "Top-level chapter order is not strictly increasing. Check chapter insertion position."
        )

    # Ensure each ### X.Y section is under matching latest ## X chapter.
    heading_re = re.compile(r"^(##|###)\s+(\d+)\.(\d+)?", flags=re.MULTILINE)
    current_chapter = None
    for m in heading_re.finditer(content):
        level = m.group(1)
        major = int(m.group(2))
        if level == "##":
            current_chapter = major
            continue
        if current_chapter is not None and major != current_chapter:
            warnings.append(
                f"Section chapter mismatch: found '### {major}.*' under current '## {current_chapter}.*'."
            )

    # For AgentSpec chapter sections, one section should only document one method name family (plus overloads).
    section_re = re.compile(r"^###\s+(10)\.(\d+)\.\s+.+$", re.MULTILINE)
    sections = list(section_re.finditer(content))
    decl_re = re.compile(
        r"(?m)^\s*(?:public\s+)?(?:default\s+|static\s+)?[\w<>,\s\[\].?]+\s+(\w+)\s*\((.*?)\)\s*(?:throws\s+[^;{]+)?\s*;?\s*$",
        re.DOTALL,
    )
    for i, m in enumerate(sections):
        start = m.end()
        end = sections[i + 1].start() if i + 1 < len(sections) else len(content)
        section_text = content[start:end]
        code_m = re.search(r"```java\s*\n(.*?)```", section_text, flags=re.DOTALL)
        if not code_m:
            continue
        method_names = set()
        for decl in decl_re.finditer(code_m.group(1)):
            name = decl.group(1)
            if name in ("if", "for", "while", "switch", "return", "new", "try", "catch"):
                continue
            method_names.add(name)
        if len(method_names) > 1:
            section_id = f"10.{m.group(2)}"
            warnings.append(
                f"Section {section_id} contains multiple method names ({', '.join(sorted(method_names))}). "
                "Split non-overload methods into separate sections."
            )
    return warnings


def main():
    ap = argparse.ArgumentParser(
        description="Compare Maintainer Java API with maintainer-sdk.md; output new and changed APIs (no file changes)"
    )
    ap.add_argument(
        "--nacos-maintainer-dir",
        type=str,
        required=True,
        help="Path to maintainer-client src: maintainer-client/src/main/java",
    )
    ap.add_argument(
        "--maintainer-md",
        type=str,
        required=True,
        help="Path to maintainer-sdk.md (zh-cn or en)",
    )
    ap.add_argument("--json", action="store_true", help="Output machine-readable JSON")
    args = ap.parse_args()

    base_dir = Path(args.nacos_maintainer_dir)
    usage_path = Path(args.maintainer_md)
    if not base_dir.exists():
        print(f"Error: nacos-maintainer-dir not found: {base_dir}", file=sys.stderr)
        sys.exit(1)
    if not usage_path.exists():
        print(f"Error: maintainer-md not found: {usage_path}", file=sys.stderr)
        sys.exit(1)
    if "/next/" not in str(usage_path) or "latest" in str(usage_path) or "v3.0" in str(usage_path):
        print("Warning: maintainer-md should be under docs/next/; do not use latest or v3.0.", file=sys.stderr)

    by_chapter = get_all_methods_by_chapter(base_dir)
    java_methods = []
    for ch, methods in by_chapter.items():
        for m in methods:
            m2 = dict(m)
            m2["chapter"] = ch
            java_methods.append(m2)

    usage_content = usage_path.read_text(encoding="utf-8")
    doc_methods = parse_maintainer_md(usage_content)
    structure_warnings = detect_structure_warnings(usage_content)

    doc_chapter_method_set = set()
    for name, entries in doc_methods.items():
        for section_id, _ in entries:
            chapter = section_id.split(".")[0]
            if chapter.isdigit():
                doc_chapter_method_set.add((int(chapter), name))

    doc_chapter_name_param_set = set()
    for name, entries in doc_methods.items():
        for section_id, pc in entries:
            if pc is not None:
                chapter = section_id.split(".")[0]
                if chapter.isdigit():
                    doc_chapter_name_param_set.add((int(chapter), name, pc))

    # Methods that exist in interface but should NOT be documented (design decision)
    SKIP_NEW_API = {"fillAllPattern"}  # ConfigMaintainerService: utility for * pattern, not a capability API

    # New APIs: in Java (any chapter) but method name not in doc
    new_by_chapter = {}
    for m in java_methods:
        if (m["chapter"], m["name"]) not in doc_chapter_method_set and m["name"] not in SKIP_NEW_API:
            ch = m["chapter"]
            new_by_chapter.setdefault(ch, []).append(m)

    # New overloads: method name is documented but this (name, param_count) is not
    new_overloads = [
        m for m in java_methods
        if (m["chapter"], m["name"]) in doc_chapter_method_set
        and (m["chapter"], m["name"], m["param_count"]) not in doc_chapter_name_param_set
    ]

    # Removed overloads: (method_name, param_count) in doc but not in interface for that chapter
    java_chapter_method_params = {}
    for m in java_methods:
        key = (m["chapter"], m["name"])
        java_chapter_method_params.setdefault(key, set()).add(m["param_count"])
    removed_overloads = []
    for name, entries in doc_methods.items():
        for section_id, pc in entries:
            if pc is None:
                continue
            chapter = section_id.split(".")[0]
            ch_int = int(chapter) if chapter.isdigit() else None
            if ch_int is None or ch_int not in by_chapter:
                continue
            key = (ch_int, name)
            if key not in java_chapter_method_params:
                continue
            if pc not in java_chapter_method_params[key]:
                removed_overloads.append({"name": name, "param_count": pc, "section_id": section_id, "chapter": ch_int})

    if args.json:
        import json
        out = {
            "new_by_chapter": {
                str(k): [{"name": x["name"], "param_count": x["param_count"], "return_type": x["return_type"], "source": x["source"], "since": x.get("since")} for x in v]
                for k, v in sorted(new_by_chapter.items())
            },
            "new_overloads": [
                {"name": m["name"], "chapter": m["chapter"], "param_count": m["param_count"], "return_type": m["return_type"], "source": m["source"]}
                for m in new_overloads
            ],
            "removed_overloads": [
                {"name": r["name"], "param_count": r["param_count"], "section_id": r["section_id"], "chapter": r["chapter"]}
                for r in removed_overloads
            ],
            "structure_warnings": structure_warnings,
        }
        print(json.dumps(out, indent=2, ensure_ascii=False))
        return

    print("=== Nacos Maintainer SDK API vs maintainer-sdk.md ===\n")
    if new_by_chapter:
        print("--- NEW APIs (in interface, not in doc) ---")
        for ch in sorted(new_by_chapter.keys()):
            methods = new_by_chapter[ch]
            print(f"\n  Chapter {ch}")
            for m in methods:
                since = f"  @since {m.get('since')}" if m.get("since") else ""
                print(f"    {m['return_type']} {m['name']}({m['param_count']} params) [{m['source']}]{since}")
        print()
    else:
        print("--- No new APIs (all interface methods are documented). ---\n")

    if new_overloads:
        print("--- NEW OVERLOADS (same method name, param_count not in doc; add to section) ---")
        for m in new_overloads:
            print(f"  Ch{m['chapter']} {m['source']}.{m['name']}({m['param_count']} params) -> {m['return_type']}")
        print()
    else:
        print("--- No new overloads to add. ---\n")

    if removed_overloads:
        print("--- REMOVED OVERLOADS (param_count in doc but not in interface; delete or annotate deprecated) ---")
        for r in removed_overloads:
            print(f"  {r['name']}({r['param_count']} params)  section {r['section_id']}")
        print()
    else:
        print("--- No removed overloads. ---\n")

    if structure_warnings:
        print("--- STRUCTURE WARNINGS ---")
        for w in structure_warnings:
            print(f"  - {w}")
        print()

    print("Update maintainer-sdk.md per .agents/skills/nacos-java-maintainer-sdk/reference.md (sections, tables, examples).")


if __name__ == "__main__":
    main()
