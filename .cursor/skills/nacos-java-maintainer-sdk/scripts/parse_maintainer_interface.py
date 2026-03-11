#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Parse Nacos Maintainer Java interface files with inheritance support.
Output method signatures (name, param count, return type, @since, declaring interface).
Used by compare_maintainer_api_with_doc.py. Can be run standalone.

Usage:
  python parse_maintainer_interface.py --dir YOUR_NACOS_REPO/maintainer-client/src/main/java
  python parse_maintainer_interface.py --file path/to/ConfigMaintainerService.java
  python parse_maintainer_interface.py --dir ... --by-chapter   # group output by doc chapter
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

# Known maintainer interfaces and their subdir under com/alibaba/nacos/maintainer/client/
INTERFACE_TO_SUBDIR = {
    "ConfigMaintainerService": "config",
    "BetaConfigMaintainerService": "config",
    "ConfigHistoryMaintainerService": "config",
    "ConfigOpsMaintainerService": "config",
    "NamingMaintainerService": "naming",
    "ServiceMaintainerService": "naming",
    "InstanceMaintainerService": "naming",
    "NamingClientMaintainerService": "naming",
    "CoreMaintainerService": "core",
    "McpMaintainerService": "ai",
    "A2aMaintainerService": "ai",
    "PromptMaintainerService": "ai",
    "SkillMaintainerService": "ai",
    "AiMaintainerService": "ai",
}

# Chapter -> list of interface names whose methods belong to that chapter (declaring_interface)
CHAPTER_INTERFACES = {
    3: ["ConfigMaintainerService", "BetaConfigMaintainerService", "ConfigHistoryMaintainerService", "ConfigOpsMaintainerService"],
    4: ["NamingMaintainerService", "ServiceMaintainerService", "InstanceMaintainerService", "NamingClientMaintainerService"],
    5: ["CoreMaintainerService"],
    6: ["McpMaintainerService"],
    7: ["A2aMaintainerService"],
    8: ["PromptMaintainerService"],
    9: ["SkillMaintainerService"],
}


def _tokenize_params(param_str: str):
    param_str = param_str.strip()
    if not param_str:
        return []
    result = []
    depth = 0
    start = 0
    for i, c in enumerate(param_str + ","):
        if c == "<":
            depth += 1
        elif c == ">":
            depth -= 1
        elif c == "," and depth == 0:
            part = param_str[start:i].strip()
            if part:
                idx = part.rfind(" ")
                if idx == -1:
                    typ, name = part, ""
                else:
                    typ = part[:idx].strip()
                    name = part[idx + 1 :].strip()
                result.append((typ, name))
            start = i + 1
    return result


def parse_method_signature(line: str):
    line = line.strip()
    line = re.sub(r"\s*[;{]\s*$", "", line)
    is_default = False
    if line.startswith("default "):
        is_default = True
        line = line[7:].strip()
    elif line.startswith("static "):
        line = line[7:].strip()
    paren = line.rfind("(")
    if paren == -1:
        return None
    before_paren = line[:paren].strip()
    parts = re.split(r"\s+", before_paren)
    if not parts:
        return None
    method_name = parts[-1]
    return_type = " ".join(parts[:-1]) if len(parts) > 1 else "void"
    after_paren = line[paren + 1 :]
    throws_match = re.search(r"\)\s*throws\s+(.+)$", after_paren)
    if throws_match:
        param_str = after_paren[: throws_match.start()].strip()
        throws = throws_match.group(1).strip()
    else:
        param_str = re.sub(r"\)\s*$", "", after_paren).strip()
        throws = ""
    param_pairs = _tokenize_params(param_str)
    param_types = [t for t, _ in param_pairs]
    return {
        "name": method_name,
        "param_types": param_types,
        "param_count": len(param_types),
        "return_type": return_type,
        "throws": throws,
        "is_default": is_default,
    }


def extract_since(javadoc: str) -> str:
    m = re.search(r"@since\s+([^\s*\n]+)", javadoc)
    return m.group(1).strip() if m else ""


def extract_extends(content: str):
    """Extract interface names from 'extends A, B, C' or 'extends A, B, C, Closeable'."""
    # Match: public interface Foo extends Bar, Baz {
    m = re.search(r"extends\s+([^{]+?)\s*\{", content, re.DOTALL)
    if not m:
        return []
    extends_str = m.group(1).strip()
    # Split by comma, take simple name (last part after .)
    result = []
    for part in re.split(r"\s*,\s*", extends_str):
        part = part.strip()
        if not part:
            continue
        # Simple name: last segment after .
        simple = part.split(".")[-1].strip()
        if simple and simple not in ("Closeable", "Closeable;"):
            result.append(simple)
    return result


def parse_java_interface_content(content: str, source_name: str):
    """Parse interface file content, return list of method dicts with source=source_name."""
    methods = []
    blocks = re.split(r"/\*\*", content)
    for block in blocks[1:]:
        end = block.find("*/")
        if end == -1:
            continue
        javadoc = block[:end].strip()
        rest = block[end + 2 :].strip()
        since = extract_since(javadoc)
        lines = rest.split("\n")
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            i += 1
            if not line or line.startswith("//") or line.startswith("*") or line.startswith("@"):
                continue
            if line.startswith("return ") or line.startswith("throw "):
                continue
            if " = " in line and "(" in line and not line.strip().startswith("default "):
                continue
            if not re.match(r"^(default\s+|static\s+)?[\w<>,\s\[\]]+\s+\w+\s*\(", line):
                continue
            acc = [line]
            if ")" in line and " {" in line and re.search(r"\)\s+.*\{\s*$", line):
                acc = [re.sub(r"\s*\{.*", "", line).strip()]
                depth = 1
                while i < len(lines) and depth > 0:
                    l = lines[i]
                    depth += l.count("{") - l.count("}")
                    i += 1
            else:
                while i < len(lines):
                    next_line = lines[i]
                    i += 1
                    if re.search(r"\)\s*\{", next_line):
                        sig_part = re.sub(r"\s*\{\s*$", "", next_line.strip()).strip()
                        if sig_part:
                            acc.append(sig_part)
                        depth = 1
                        while i < len(lines) and depth > 0:
                            l = lines[i]
                            depth += l.count("{") - l.count("}")
                            i += 1
                        break
                    acc.append(next_line.strip())
                    if re.search(r"\)\s*;", next_line) or re.search(r"\)\s*throws\s+[^;]+;\s*$", next_line):
                        break
            full = " ".join(acc)
            if " {" in full:
                full = full.split(" {")[0].strip()
            sig = parse_method_signature(full)
            if sig:
                sig["since"] = since
                sig["source"] = source_name
                methods.append(sig)
    return methods


def resolve_interface_path(base_dir: Path, interface_name: str):
    """Resolve interface simple name to .java file path under base_dir."""
    subdir = INTERFACE_TO_SUBDIR.get(interface_name)
    if not subdir:
        return None
    # base_dir can be maintainer-client/src/main/java or .../com/alibaba/nacos/maintainer/client
    client_root = base_dir
    if (base_dir / "com/alibaba/nacos/maintainer/client").exists():
        client_root = base_dir / "com/alibaba/nacos/maintainer/client"
    p = client_root / subdir / f"{interface_name}.java"
    if p.exists():
        return p
    # try direct under base_dir
    p = base_dir / "com/alibaba/nacos/maintainer/client" / subdir / f"{interface_name}.java"
    return p if p.exists() else None


def parse_interface_with_inheritance(base_dir: Path, interface_name: str, parsed: dict):
    """
    Parse an interface and all its parent interfaces (recursively).
    Each method is tagged with source = the interface where it is declared.
    Returns list of all methods (no duplicate by name+param_count from same source).
    """
    path = resolve_interface_path(base_dir, interface_name)
    if not path:
        return []
    if interface_name in parsed:
        return parsed[interface_name]
    content = path.read_text(encoding="utf-8")
    direct_methods = parse_java_interface_content(content, interface_name)
    seen = {(m["name"], m["param_count"]) for m in direct_methods}
    result = list(direct_methods)
    for parent in extract_extends(content):
        if parent not in INTERFACE_TO_SUBDIR:
            continue
        parent_methods = parse_interface_with_inheritance(base_dir, parent, parsed)
        for m in parent_methods:
            key = (m["name"], m["param_count"])
            if key not in seen:
                seen.add(key)
                result.append(m)
    parsed[interface_name] = result
    return result


def get_all_methods_by_chapter(base_dir: Path):
    """
    For each chapter, collect methods from the interfaces that belong to that chapter.
    For ch3 we need ConfigMaintainerService flattened but only methods whose source is in ch3 list.
    So we parse ConfigMaintainerService (gets Config+Beta+History+Ops+Core), then filter source in ch3.
    For ch4 we parse NamingMaintainerService and filter source in ch4.
    For ch5 we parse CoreMaintainerService (all methods are Core).
    For ch6,7,8,9 we parse Mcp, A2a, Prompt, Skill and take all.
    """
    by_chapter = {}
    parsed_cache = {}
    for chapter, interfaces in CHAPTER_INTERFACES.items():
        # Entry point: first interface in the list that we can parse and that pulls in others
        entry = interfaces[0]
        all_methods = parse_interface_with_inheritance(base_dir, entry, parsed_cache)
        # Keep only methods declared in one of this chapter's interfaces
        chapter_methods = [m for m in all_methods if m["source"] in interfaces]
        by_chapter[chapter] = chapter_methods
    return by_chapter


def main():
    ap = argparse.ArgumentParser(description="Parse Nacos Maintainer Java interface(s) with inheritance")
    ap.add_argument("--file", type=str, help="Single .java interface file")
    ap.add_argument("--dir", type=str, help="maintainer-client/src/main/java directory")
    ap.add_argument("--by-chapter", action="store_true", help="Output grouped by doc chapter")
    ap.add_argument("--json", action="store_true", help="Output JSON")
    args = ap.parse_args()

    if args.file:
        path = Path(args.file)
        if not path.exists():
            print(f"File not found: {path}", file=sys.stderr)
            sys.exit(1)
        content = path.read_text(encoding="utf-8")
        source_name = path.stem
        methods = parse_java_interface_content(content, source_name)
        if args.json:
            import json
            print(json.dumps(methods, indent=2, ensure_ascii=False))
        else:
            for m in methods:
                since = f"  @since {m.get('since')}" if m.get("since") else ""
                params = ", ".join(m["param_types"])
                print(f"{m['return_type']} {m['name']}({params})  [{m['source']}]{since}")
        return

    if args.dir:
        base = Path(args.dir)
        if not base.exists():
            print(f"Directory not found: {base}", file=sys.stderr)
            sys.exit(1)
        if args.by_chapter:
            by_chapter = get_all_methods_by_chapter(base)
            if args.json:
                import json
                print(json.dumps(by_chapter, indent=2, ensure_ascii=False, default=str))
            else:
                for ch in sorted(by_chapter.keys()):
                    print(f"\n=== Chapter {ch} ===")
                    for m in by_chapter[ch]:
                        since = f"  @since {m.get('since')}" if m.get("since") else ""
                        print(f"  {m['return_type']} {m['name']}({m['param_count']} params)  [{m['source']}]{since}")
        else:
            # Dump all interfaces we know about, merged by chapter
            by_chapter = get_all_methods_by_chapter(base)
            all_methods = []
            for ch in sorted(by_chapter.keys()):
                for m in by_chapter[ch]:
                    m2 = dict(m)
                    m2["chapter"] = ch
                    all_methods.append(m2)
            if args.json:
                import json
                print(json.dumps(all_methods, indent=2, ensure_ascii=False, default=str))
            else:
                for m in all_methods:
                    since = f"  @since {m.get('since')}" if m.get("since") else ""
                    print(f"Ch{m['chapter']} {m['return_type']} {m['name']}({m['param_count']} params)  [{m['source']}]{since}")
        return

    ap.print_help()
    sys.exit(1)


if __name__ == "__main__":
    main()
