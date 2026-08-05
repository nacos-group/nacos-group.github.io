#!/usr/bin/env python3
"""Run the deterministic final gates for all six Nacos API documents."""

import json
import re
import subprocess
import sys
from pathlib import Path

from compare_doc_with_swagger import extract_sections, parse_doc_table


REPO_ROOT = Path(__file__).resolve().parents[4]
SCRIPT_DIR = Path(__file__).resolve().parent
COMPARE = SCRIPT_DIR / "compare_doc_with_swagger.py"
REFRESH = SCRIPT_DIR / "refresh_swagger.py"
GENERATOR = SCRIPT_DIR / "swagger_to_md.py"
EXEMPTIONS = REPO_ROOT / ".agents/skills/nacos-api-doc-update/exemptions/admin-console-api-exemptions.json"

MAPPINGS = [
    {
        "family": "admin",
        "locale": "zh",
        "json": "public/swagger/admin/zh/api.json",
        "doc": "src/content/docs/next/zh-cn/manual/admin/admin-api.md",
    },
    {
        "family": "admin",
        "locale": "en",
        "json": "public/swagger/admin/en/api.json",
        "doc": "src/content/docs/next/en/manual/admin/admin-api.md",
    },
    {
        "family": "console",
        "locale": "zh",
        "json": "public/swagger/console/zh/api.json",
        "doc": "src/content/docs/next/zh-cn/manual/admin/console-api.md",
    },
    {
        "family": "console",
        "locale": "en",
        "json": "public/swagger/console/en/api.json",
        "doc": "src/content/docs/next/en/manual/admin/console-api.md",
    },
    {
        "family": "client",
        "locale": "zh",
        "json": "public/swagger/client/zh/api.json",
        "doc": "src/content/docs/next/zh-cn/manual/user/open-api.md",
    },
    {
        "family": "client",
        "locale": "en",
        "json": "public/swagger/client/en/api.json",
        "doc": "src/content/docs/next/en/manual/user/open-api.md",
    },
]


def run(command: list[str], label: str) -> None:
    result = subprocess.run(
        command,
        cwd=REPO_ROOT,
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print(f"[{label}] failed", file=sys.stderr)
        if result.stdout:
            print(result.stdout, file=sys.stderr)
        if result.stderr:
            print(result.stderr, file=sys.stderr)
        raise SystemExit(1)
    print(f"[{label}] passed")


def normalized_rows(block: str) -> tuple[tuple[str, str, bool], ...]:
    if not block or "|" not in block:
        return ()
    return tuple(
        (
            row.get("name", ""),
            re.sub(r"\s+", "", row.get("type", "")),
            bool(row.get("required")),
        )
        for row in parse_doc_table(block)
    )


def document_signature(path: Path) -> list[tuple]:
    content = path.read_text(encoding="utf-8")
    signature = []
    blocks = re.split(r"(?=^### \d+\.\d+(?:\.|\s))", content, flags=re.MULTILINE)
    for block in blocks:
        heading = re.match(r"^### (\d+\.\d+)(?:\.|\s)", block.strip())
        parsed = list(extract_sections(block))
        if not heading or not parsed:
            continue
        path_value, method, since, headers, params, body, response, _curl = parsed[0]
        signature.append(
            (
                heading.group(1),
                method,
                path_value,
                since,
                normalized_rows(headers),
                normalized_rows(params),
                normalized_rows(body),
                tuple((name, typ) for name, typ, _required in normalized_rows(response)),
            )
        )
    return signature


def validate_locale_pairs() -> None:
    for family in ("admin", "console", "client"):
        pair = [item for item in MAPPINGS if item["family"] == family]
        zh = next(item for item in pair if item["locale"] == "zh")
        en = next(item for item in pair if item["locale"] == "en")
        zh_signature = document_signature(REPO_ROOT / zh["doc"])
        en_signature = document_signature(REPO_ROOT / en["doc"])
        if zh_signature != en_signature:
            limit = min(len(zh_signature), len(en_signature))
            index = next(
                (idx for idx in range(limit) if zh_signature[idx] != en_signature[idx]),
                limit,
            )
            zh_item = zh_signature[index] if index < len(zh_signature) else "<missing>"
            en_item = en_signature[index] if index < len(en_signature) else "<missing>"
            raise SystemExit(
                f"[{family} locale parity] failed at index {index}: zh={zh_item!r}, en={en_item!r}"
            )
        print(f"[{family} locale parity] passed ({len(zh_signature)} operations)")


def validate_generator_locales() -> None:
    cases = [
        (
            "zh-cn",
            "public/swagger/client/zh/api.json",
            ("#### 接口描述", "#### 请求方式", "| 参数名 | 类型 | 必填 | 参数描述 |"),
        ),
        (
            "en",
            "public/swagger/client/en/api.json",
            ("#### Description", "#### Request Method", "| Name | Type | Required | Description |"),
        ),
    ]
    for locale, swagger, markers in cases:
        result = subprocess.run(
            [
                sys.executable,
                str(GENERATOR),
                "--json",
                swagger,
                "--doc-type",
                "client",
                "--locale",
                locale,
                "--filter-path",
                "^/v3/client/ai/agents$",
            ],
            cwd=REPO_ROOT,
            check=False,
            capture_output=True,
            text=True,
        )
        if result.returncode != 0 or any(marker not in result.stdout for marker in markers):
            raise SystemExit(f"[generator locale {locale}] failed")
        print(f"[generator locale {locale}] passed")


def validate_agent_route_families() -> None:
    family_keys = {}
    for family in ("admin", "console", "client"):
        item = next(
            mapping
            for mapping in MAPPINGS
            if mapping["family"] == family and mapping["locale"] == "zh"
        )
        spec = json.loads((REPO_ROOT / item["json"]).read_text(encoding="utf-8"))
        boundary = re.compile(rf"^/v3/{family}/ai/agents(?:/|$)")
        keys = set()
        for path, path_item in (spec.get("paths") or {}).items():
            if not boundary.search(path) or not isinstance(path_item, dict):
                continue
            relative = path.removeprefix(f"/v3/{family}")
            for method in ("get", "post", "put", "delete", "patch", "head"):
                if isinstance(path_item.get(method), dict):
                    keys.add((method.upper(), relative))
        family_keys[family] = keys
        print(f"[{family} Agent routes] {len(keys)} operations")
    if family_keys["admin"] != family_keys["console"]:
        delta = sorted(family_keys["admin"] ^ family_keys["console"])
        raise SystemExit(f"[Admin/Console Agent route parity] failed: {delta}")
    print("[Admin/Console Agent route parity] passed")


def compare_command(item: dict, strict_agent: bool = False) -> list[str]:
    command = [
        sys.executable,
        str(COMPARE),
        "--json",
        item["json"],
        "--doc-type",
        item["family"],
        "--doc-file",
        item["doc"],
        "--fail-on-diff",
    ]
    if strict_agent:
        command.extend(
            [
                "--filter-path",
                rf"^/v3/{item['family']}/ai/agents(?:/|$)",
                "--strict-response-paths",
                "--require-named-response-root",
            ]
        )
        if item["family"] == "client":
            command.append("--strict-headers")
    else:
        command.append("--validate-json-examples")
        if item["family"] in {"admin", "console"}:
            command.extend(
                [
                    "--exemptions-file",
                    str(EXEMPTIONS),
                    "--audit-exemptions",
                ]
            )
    return command


def raw_compare_command(item: dict) -> list[str]:
    return [
        sys.executable,
        str(COMPARE),
        "--json",
        item["json"],
        "--doc-type",
        item["family"],
        "--doc-file",
        item["doc"],
        "--validate-json-examples",
    ]


def expected_raw_issue_count(family: str) -> int:
    if family == "client":
        return 0
    payload = json.loads(EXEMPTIONS.read_text(encoding="utf-8"))
    rules = (payload.get("doc_types") or {}).get(family) or {}
    return sum(len(rule.get("ignore_issues") or []) for rule in rules.values())


def validate_raw_compare(item: dict) -> None:
    label = f"{item['family']}/{item['locale']} raw compare"
    result = subprocess.run(
        raw_compare_command(item),
        cwd=REPO_ROOT,
        check=False,
        capture_output=True,
        text=True,
    )
    match = re.search(r"合计差异/问题数:\s*(\d+)", result.stdout)
    expected = expected_raw_issue_count(item["family"])
    actual = int(match.group(1)) if match else None
    if result.returncode != 0 or actual != expected:
        print(f"[{label}] failed: expected {expected}, actual {actual}", file=sys.stderr)
        if result.stdout:
            print(result.stdout, file=sys.stderr)
        if result.stderr:
            print(result.stderr, file=sys.stderr)
        raise SystemExit(1)
    print(f"[{label}] passed ({actual} expected tracked issues)")


def main() -> None:
    run([sys.executable, str(REFRESH), "--validate-existing"], "Swagger snapshot")
    validate_generator_locales()
    validate_agent_route_families()
    for item in MAPPINGS:
        validate_raw_compare(item)
    for item in MAPPINGS:
        label = f"{item['family']}/{item['locale']} final compare"
        run(compare_command(item), label)
    for item in MAPPINGS:
        label = f"{item['family']}/{item['locale']} Agent strict"
        run(compare_command(item, strict_agent=True), label)
    validate_locale_pairs()
    run(["git", "diff", "--check"], "git diff --check")
    print("All API document gates passed. Site build is a separate required gate.")


if __name__ == "__main__":
    main()
