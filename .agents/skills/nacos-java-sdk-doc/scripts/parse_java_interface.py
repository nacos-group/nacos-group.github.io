#!/usr/bin/env python3
"""
Parse Nacos Java API interface files and output method signatures (name, param types, return type, @Since/@since).
Used by compare_java_api_with_doc.py. Can be run standalone to dump API list.

Usage:
  python parse_java_interface.py --file path/to/ConfigService.java
  python parse_java_interface.py --dir path/to/nacos
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


def extract_since_annotation(line: str) -> str:
    """Extract the public API version from a Nacos @Since annotation."""
    m = re.search(r'@Since\s*\(\s*"([^"]+)"\s*\)', line)
    return m.group(1).strip() if m else ""


def parse_java_interface(content: str, source_name: str = "") -> list[dict]:
    """
    Parse full Java interface content. Returns list of method dicts (name, param_types, return_type, throws, since, is_default).
    """
    methods = []
    interface_javadoc = re.search(
        r"/\*\*(.*?)\*/\s*(?:@[\w().,\s\"-]+\s*)*public\s+interface\s+\w+",
        content,
        flags=re.DOTALL,
    )
    interface_since = extract_since(interface_javadoc.group(1)) if interface_javadoc else ""
    # Split by /** to get Javadoc blocks; the next non-empty line is usually the method
    blocks = re.split(r"/\*\*", content)
    for block in blocks[1:]:
        end = block.find("*/")
        if end == -1:
            continue
        javadoc = block[:end].strip()
        rest = block[end + 2 :].strip()
        since = extract_since(javadoc)
        annotation_since = ""
        lines = rest.split("\n")
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            i += 1
            if not line or line.startswith("//") or line.startswith("*"):
                continue
            if line.startswith("@"):
                annotation_since = extract_since_annotation(line) or annotation_since
                continue
            if line.startswith("return ") or line.startswith("throw "):
                continue
            # Exclude body lines that look like declarations (e.g. "AgentEndpoint x = new ...")
            if " = " in line and "(" in line and not line.strip().startswith("default "):
                continue
            # Start of method: (default|static)? ReturnType methodName(
            if not re.match(r"^(default\s+|static\s+)?[\w<>,\s\[\].?]+\s+\w+\s*\(", line):
                continue
            acc = [line]
            while not re.search(r"[;{]", acc[-1]) and i < len(lines):
                acc.append(lines[i].strip())
                i += 1
            declaration = " ".join(acc)
            terminator = re.search(r"[;{]", declaration)
            if not terminator:
                raise ValueError(f"Unterminated method declaration in {source_name}: {line}")
            full = declaration[:terminator.start()].strip()
            if terminator.group() == "{":
                body = declaration[terminator.start():]
                depth = body.count("{") - body.count("}")
                while i < len(lines) and depth > 0:
                    body = lines[i]
                    depth += body.count("{") - body.count("}")
                    i += 1
            sig = parse_method_signature(full)
            if sig:
                sig["since"] = annotation_since or since or interface_since
                sig["source"] = source_name
                methods.append(sig)
    return methods


def resolve_api_root(base: Path) -> Path:
    """Resolve repo root, api module root, src/main/java, or API package root."""
    candidates = [
        base / "com/alibaba/nacos/api",
        base / "api/src/main/java/com/alibaba/nacos/api",
        base / "src/main/java/com/alibaba/nacos/api",
        base,
    ]
    for candidate in candidates:
        if (candidate / "config/ConfigService.java").exists():
            return candidate
    raise FileNotFoundError(
        f"Cannot resolve com/alibaba/nacos/api from {base}. "
        "Pass the Nacos repo root, api module root, api/src/main/java, or API package root."
    )


def load_interface_hierarchy(base: Path) -> dict[str, list[dict]]:
    """Load facade and resource interfaces, retaining each method's declaring owner."""
    api_root = resolve_api_root(base)
    roots = ["config/ConfigService.java", "naming/NamingService.java",
             "lock/LockService.java", "ai/AiService.java", "ai/AgentService.java"]
    loaded = {}
    visiting = set()

    def visit(path: Path):
        name = path.stem
        if name in loaded:
            return
        if name in visiting:
            raise ValueError(f"Cyclic interface inheritance: {path}")
        content = path.read_text(encoding="utf-8")
        declaration = re.search(r"public\s+interface\s+" + re.escape(name)
                                + r"\s*(?:extends\s+([^\{]+))?\{", content)
        if not declaration:
            raise ValueError(f"Cannot parse interface declaration: {path}")
        visiting.add(name)
        for parent in (declaration.group(1) or "").split(","):
            parent = parent.strip()
            if not parent:
                continue
            imported = re.search(r"import\s+(com\.alibaba\.nacos\.api\.(?:\w+\.)*"
                                 + re.escape(parent) + r");", content)
            parent_path = path.parent / (parent + ".java")
            if imported:
                parent_path = api_root / (imported.group(1).removeprefix(
                    "com.alibaba.nacos.api.").replace(".", "/") + ".java")
            visit(parent_path)
        loaded[name] = parse_java_interface(content, name)
        if not loaded[name] and name not in {"AiService", "AgentService"}:
            raise ValueError(f"No API methods parsed from required interface: {path}")
        visiting.remove(name)

    for relative in roots:
        visit(api_root / relative)
    return loaded


def main():
    ap = argparse.ArgumentParser(description="Parse Nacos Java API interface(s)")
    ap.add_argument("--file", type=str, help="Single .java interface file")
    ap.add_argument(
        "--dir",
        type=str,
        help="Nacos repo root, api module root, api/src/main/java, or API package root",
    )
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
        try:
            interfaces = load_interface_hierarchy(base)
        except (FileNotFoundError, ValueError) as exc:
            print(f"Error: {exc}", file=sys.stderr)
            sys.exit(1)
        methods = [method for declared in interfaces.values() for method in declared]
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
