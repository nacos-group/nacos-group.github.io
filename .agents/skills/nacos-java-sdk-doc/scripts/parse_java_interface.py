#!/usr/bin/env python3
"""
Parse Nacos Java API interface files and output method signatures (name, param types, return type, @since).
Used by compare_java_api_with_doc.py. Can be run standalone to dump API list.

Usage:
  python parse_java_interface.py --file path/to/ConfigService.java
  python parse_java_interface.py --dir path/to/api/src/main/java
"""
import argparse
import re
import sys
from pathlib import Path


def _tokenize_params(param_str: str) -> list[tuple[str, str]]:
    """Split param string into (type, name) pairs. Handles generics like List<Instance>."""
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
                # Last token is param name (after last space or >)
                idx = part.rfind(" ")
                if idx == -1:
                    typ, name = part, ""
                else:
                    typ = part[:idx].strip()
                    name = part[idx + 1 :].strip()
                result.append((typ, name))
            start = i + 1
    return result


def parse_method_signature(line: str) -> dict | None:
    """
    Parse a single method declaration line.
    Returns dict with name, param_types, return_type, throws, is_default or None.
    """
    line = line.strip()
    # Remove trailing ); or };
    line = re.sub(r"\s*[;{]\s*$", "", line)
    # Optional: default / static
    is_default = False
    if line.startswith("default "):
        is_default = True
        line = line[7:].strip()
    elif line.startswith("static "):
        line = line[7:].strip()
    # Return type: everything until last " methodName(" (method name is word before parenthesis)
    paren = line.rfind("(")
    if paren == -1:
        return None
    before_paren = line[:paren].strip()
    # Last token before ( is method name
    parts = re.split(r"\s+", before_paren)
    if not parts:
        return None
    method_name = parts[-1]
    return_type = " ".join(parts[:-1]) if len(parts) > 1 else "void"
    after_paren = line[paren + 1 :]
    # Split by ) throws or )
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


def parse_java_interface(content: str, source_name: str = "") -> list[dict]:
    """
    Parse full Java interface content. Returns list of method dicts (name, param_types, return_type, throws, since, is_default).
    """
    methods = []
    # Split by /** to get Javadoc blocks; the next non-empty line is usually the method
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
            # Exclude body lines that look like declarations (e.g. "AgentEndpoint x = new ...")
            if " = " in line and "(" in line and not line.strip().startswith("default "):
                continue
            # Start of method: (default|static)? ReturnType methodName(
            if not re.match(r"^(default\s+|static\s+)?[\w<>,\s\[\]]+\s+\w+\s*\(", line):
                continue
            acc = [line]
            # One-line default method: declaration ends with " {"
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
            # Strip any trailing " { ..." (body) that might have been included
            if " {" in full:
                full = full.split(" {")[0].strip()
            sig = parse_method_signature(full)
            if sig:
                sig["since"] = since
                sig["source"] = source_name
                methods.append(sig)
    return methods


def main():
    ap = argparse.ArgumentParser(description="Parse Nacos Java API interface(s)")
    ap.add_argument("--file", type=str, help="Single .java interface file")
    ap.add_argument("--dir", type=str, help="Directory containing com/alibaba/nacos/api (api module src)")
    ap.add_argument("--json", action="store_true", help="Output JSON")
    args = ap.parse_args()

    if args.file:
        path = Path(args.file)
        if not path.exists():
            print(f"File not found: {path}", file=sys.stderr)
            sys.exit(1)
        content = path.read_text(encoding="utf-8")
        methods = parse_java_interface(content, path.name)
    elif args.dir:
        base = Path(args.dir)
        # Expected: .../api/src/main/java or .../java
        if (base / "com/alibaba/nacos/api").exists():
            api_root = base / "com/alibaba/nacos/api"
        elif (base / "api").exists():
            api_root = base / "api"
        else:
            api_root = base
        interfaces = [
            ("ConfigService", api_root / "config/ConfigService.java"),
            ("NamingService", api_root / "naming/NamingService.java"),
            ("AiService", api_root / "ai/AiService.java"),
            ("A2aService", api_root / "ai/A2aService.java"),
        ]
        methods = []
        for name, p in interfaces:
            if p.exists():
                content = p.read_text(encoding="utf-8")
                methods.extend(parse_java_interface(content, name))
            else:
                print(f"Skip (not found): {p}", file=sys.stderr)
    else:
        ap.print_help()
        sys.exit(1)

    if args.json:
        import json
        print(json.dumps(methods, indent=2, ensure_ascii=False))
    else:
        for m in methods:
            since = f"  @since {m['since']}" if m.get("since") else ""
            params = ", ".join(m["param_types"])
            print(f"{m['return_type']} {m['name']}({params})  [{m['source']}]{since}")


if __name__ == "__main__":
    main()
