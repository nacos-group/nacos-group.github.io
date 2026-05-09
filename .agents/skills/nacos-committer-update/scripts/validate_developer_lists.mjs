#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const docsRoot = path.join(repoRoot, "src/content/docs");
const zhBaselinePath = path.join(docsRoot, "latest/zh-cn/community/nacos-dev.md");
const enBaselinePath = path.join(docsRoot, "latest/en/community/nacos-dev.md");

function collectNacosDevFiles(dir, result = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectNacosDevFiles(fullPath, result);
    } else if (entry.isFile() && entry.name === "nacos-dev.md") {
      result.push(fullPath);
    }
  }
  return result.sort();
}

function parseRows(filePath) {
  const rows = new Map();
  const duplicates = [];
  const content = fs.readFileSync(filePath, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^\|\s*\[([^\]]+)\]\(https:\/\/github\.com\/[^)]+\)\s*\|(.+)$/);
    if (!match) {
      continue;
    }

    const id = match[1];
    const cells = match[2]
      .split("|")
      .map((cell) => cell.replace(/｜\s*$/, "").trim());
    while (cells[cells.length - 1] === "") {
      cells.pop();
    }

    if (rows.has(id)) {
      duplicates.push(id);
    }
    rows.set(id, cells);
  }

  return { rows, duplicates };
}

function formatRelative(filePath) {
  return path.relative(repoRoot, filePath);
}

const zhBaseline = parseRows(zhBaselinePath).rows;
const enBaseline = parseRows(enBaselinePath).rows;
const canonicalIds = [...zhBaseline.keys()];
const files = collectNacosDevFiles(docsRoot);
const errors = [];

for (const filePath of files) {
  const { rows, duplicates } = parseRows(filePath);
  const relativePath = formatRelative(filePath);
  const baseline = relativePath.includes("/en/") ? enBaseline : zhBaseline;

  if (duplicates.length > 0) {
    errors.push(`${relativePath}: duplicate GitHub IDs: ${duplicates.join(", ")}`);
  }

  const missing = canonicalIds.filter((id) => !rows.has(id));
  if (missing.length > 0) {
    errors.push(`${relativePath}: missing GitHub IDs: ${missing.join(", ")}`);
  }

  const extra = [...rows.keys()].filter((id) => !zhBaseline.has(id));
  if (extra.length > 0) {
    errors.push(`${relativePath}: extra GitHub IDs not in latest baseline: ${extra.join(", ")}`);
  }

  for (const [id, cells] of rows) {
    if (!baseline.has(id)) {
      continue;
    }

    const baselineCells = baseline.get(id);
    if (cells.join("\t") !== baselineCells.join("\t")) {
      errors.push(`${relativePath}: row differs from latest baseline for ${id}`);
    }

    const organization = cells[1];
    if (!organization) {
      errors.push(`${relativePath}: empty organization for ${id}`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("all nacos-dev.md files match the latest zh/en developer baselines");
