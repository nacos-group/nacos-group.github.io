#!/usr/bin/env python3
"""Refresh Nacos Swagger snapshots without truncating tracked files on failure."""

import argparse
import hashlib
import json
import os
import subprocess
import sys
import tempfile
from contextlib import nullcontext
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[4]
HTTP_METHODS = ("get", "post", "put", "delete", "patch", "head", "options")
TEXT_ONLY_KEYS = {
    "description",
    "summary",
    "title",
    "example",
    "examples",
    "externalDocs",
}


def records(console_base: str, server_base: str) -> list[dict]:
    return [
        {
            "family": "console",
            "locale": "en",
            "lang": "en-US",
            "url": f"{console_base.rstrip('/')}/v3/api-docs/console-api",
            "target": REPO_ROOT / "public/swagger/console/en/api.json",
        },
        {
            "family": "console",
            "locale": "zh",
            "lang": "zh-CN",
            "url": f"{console_base.rstrip('/')}/v3/api-docs/console-api",
            "target": REPO_ROOT / "public/swagger/console/zh/api.json",
        },
        {
            "family": "admin",
            "locale": "en",
            "lang": "en-US",
            "url": f"{server_base.rstrip('/')}/v3/api-docs/admin-api",
            "target": REPO_ROOT / "public/swagger/admin/en/api.json",
        },
        {
            "family": "admin",
            "locale": "zh",
            "lang": "zh-CN",
            "url": f"{server_base.rstrip('/')}/v3/api-docs/admin-api",
            "target": REPO_ROOT / "public/swagger/admin/zh/api.json",
        },
        {
            "family": "client",
            "locale": "en",
            "lang": "en-US",
            "url": f"{server_base.rstrip('/')}/v3/api-docs/client-api",
            "target": REPO_ROOT / "public/swagger/client/en/api.json",
        },
        {
            "family": "client",
            "locale": "zh",
            "lang": "zh-CN",
            "url": f"{server_base.rstrip('/')}/v3/api-docs/client-api",
            "target": REPO_ROOT / "public/swagger/client/zh/api.json",
        },
    ]


def contract_shape(value):
    """Drop localized prose/examples while retaining the OpenAPI wire structure."""
    if isinstance(value, dict):
        return {
            key: contract_shape(child)
            for key, child in sorted(value.items())
            if key not in TEXT_ONLY_KEYS
        }
    if isinstance(value, list):
        return [contract_shape(child) for child in value]
    return value


def operation_keys(spec: dict) -> list[str]:
    keys = []
    for path, item in (spec.get("paths") or {}).items():
        if not isinstance(item, dict):
            continue
        for method in HTTP_METHODS:
            if isinstance(item.get(method), dict):
                keys.append(f"{method.upper()} {path}")
    return sorted(keys)


def structural_snapshot(spec: dict) -> dict:
    paths = {}
    for path, item in sorted((spec.get("paths") or {}).items()):
        if not isinstance(item, dict):
            continue
        operations = {}
        for method in HTTP_METHODS:
            operation = item.get(method)
            if not isinstance(operation, dict):
                continue
            operations[method] = contract_shape(
                {
                    "parameters": operation.get("parameters") or [],
                    "requestBody": operation.get("requestBody") or {},
                    "responses": operation.get("responses") or {},
                    "security": operation.get("security") or [],
                    "deprecated": operation.get("deprecated", False),
                    "x-nacos-api-since": operation.get("x-nacos-api-since") or {},
                }
            )
        paths[path] = operations
    return {
        "paths": paths,
        "schemas": contract_shape(((spec.get("components") or {}).get("schemas") or {})),
    }


def load_and_validate(path: Path) -> tuple[dict, dict]:
    raw = path.read_bytes()
    try:
        spec = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON: {exc}") from exc
    if not isinstance(spec, dict) or not spec.get("openapi"):
        raise ValueError("missing OpenAPI root field")
    operations = operation_keys(spec)
    if not operations:
        raise ValueError("paths contains no operations")
    info = spec.get("info") or {}
    metadata = {
        "version": str(info.get("version") or ""),
        "operations": len(operations),
        "sha256": hashlib.sha256(raw).hexdigest(),
        "structure": structural_snapshot(spec),
    }
    return spec, metadata


def source_head(source_repo: Path) -> str:
    if not source_repo.exists():
        return "unavailable"
    result = subprocess.run(
        ["git", "-C", str(source_repo), "rev-parse", "HEAD"],
        check=False,
        capture_output=True,
        text=True,
    )
    return result.stdout.strip() if result.returncode == 0 else "unavailable"


def validate_batch(items: list[dict]) -> None:
    versions = {item["meta"]["version"] for item in items}
    if len(versions) != 1:
        raise ValueError(f"Swagger versions differ within snapshot: {sorted(versions)}")
    for family in sorted({item["family"] for item in items}):
        pair = [item for item in items if item["family"] == family]
        if len(pair) != 2:
            raise ValueError(f"{family}: both zh and en snapshots are required")
        left, right = pair
        if left["meta"]["structure"] != right["meta"]["structure"]:
            left_ops = set(operation_keys(left["spec"]))
            right_ops = set(operation_keys(right["spec"]))
            detail = ""
            if left_ops != right_ops:
                detail = f"; operation delta={sorted(left_ops ^ right_ops)}"
            raise ValueError(f"{family}: zh/en Swagger structure differs{detail}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Safely refresh and validate the six Nacos Swagger snapshots"
    )
    parser.add_argument("--scope", choices=("all", "admin", "console", "client"), default="all")
    parser.add_argument("--console-base", default="http://localhost:8080")
    parser.add_argument("--server-base", default="http://localhost:8848/nacos")
    parser.add_argument("--source-repo", default=str(REPO_ROOT.parent / "nacos"))
    parser.add_argument(
        "--validate-existing",
        action="store_true",
        help="Validate checked-in snapshots without curl or file replacement",
    )
    args = parser.parse_args()

    selected = [
        item
        for item in records(args.console_base, args.server_base)
        if args.scope == "all" or item["family"] == args.scope
    ]
    validated = []
    try:
        temporary = (
            nullcontext(None)
            if args.validate_existing
            else tempfile.TemporaryDirectory(prefix=".swagger-refresh-", dir=REPO_ROOT)
        )
        with temporary as tmp_dir:
            tmp_root = Path(tmp_dir) if tmp_dir else None
            for index, item in enumerate(selected):
                candidate = item["target"] if args.validate_existing else tmp_root / f"{index}.json"
                if not args.validate_existing:
                    result = subprocess.run(
                        [
                            "curl",
                            "-fSsL",
                            item["url"],
                            "-H",
                            f"accept-language:{item['lang']}",
                            "-o",
                            str(candidate),
                        ],
                        check=False,
                        capture_output=True,
                        text=True,
                    )
                    if result.returncode != 0:
                        raise RuntimeError(
                            f"{item['family']}/{item['locale']} curl failed: "
                            f"{result.stderr.strip() or 'unknown error'}"
                        )
                spec, meta = load_and_validate(candidate)
                validated.append({**item, "candidate": candidate, "spec": spec, "meta": meta})

            validate_batch(validated)
            if not args.validate_existing:
                for item in validated:
                    item["target"].parent.mkdir(parents=True, exist_ok=True)
                    os.replace(item["candidate"], item["target"])
    except (OSError, RuntimeError, ValueError) as exc:
        print(f"Swagger snapshot rejected; tracked files were not intentionally replaced: {exc}", file=sys.stderr)
        sys.exit(1)

    print(f"sourceHead={source_head(Path(args.source_repo).resolve())}")
    for item in validated:
        meta = item["meta"]
        print(
            f"{item['family']}/{item['locale']} version={meta['version']} "
            f"operations={meta['operations']} sha256={meta['sha256']} url={item['url']}"
        )


if __name__ == "__main__":
    main()
