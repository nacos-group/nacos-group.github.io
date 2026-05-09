---
name: nacos-committer-update
description: Updates Nacos committer documentation and announcements in nacos-group.github.io. Use when adding one or more new Nacos Committers, creating a committer community announcement, syncing committer/developer rows across all versioned zh-cn and en nacos-dev.md files, handling missing company information such as defaulting to independent developer, or validating historical developer-list consistency.
---

# Nacos Committer Update

## Overview

Use this skill to add new Nacos Committers consistently across the website:

- Create a community announcement under `src/content/blog/`.
- Add committer rows to every versioned developer list in both Chinese and English.
- Repair historical omissions so all `nacos-dev.md` files share the same developer list.
- Validate row consistency before finalizing.

Also use `nacos-doc-sync-en` discipline for every edited `zh-cn` documentation file: update the corresponding `en` file in the same version.

## Required Inputs

Before editing files, make sure the user has provided the required information for every new Committer. If any required item is missing, ask the user for it instead of guessing.

Required for each Committer:

- GitHub ID.
- Name, preferably Chinese name plus English name if the English developer list should not rely on inferred pinyin.
- Email.
- Certificate image URLs, including the person/front image and certificate/back image.

Optional for each Committer:

- Company or organization. If missing, use `自由开发者` in Chinese files and `Independent developer` in English files.
- Main contributions. If missing, inspect the Committer's public contributions to `alibaba/nacos` and repositories under `nacos-group`, then summarize the largest 3-4 contribution areas for the announcement. Prefer GitHub PRs, commits, issues, and release notes as evidence. Keep the summary factual and do not invent contribution areas.

## Workflow

1. Start from a synced base branch unless the user says otherwise.
   - Check `git status --short --branch`.
   - If creating a branch, use the repository or maintainer's normal branch naming convention.
   - Never overwrite unrelated user changes.

2. Inspect current patterns.
   - List developer files: `rg --files src/content/docs | rg '(^|/)nacos-dev\.md$'`.
   - Read the latest announcement, usually `src/content/blog/committer-*.md`.
   - Use `src/content/docs/latest/zh-cn/community/nacos-dev.md` and `src/content/docs/latest/en/community/nacos-dev.md` as the canonical row-value baseline after updating.

3. Normalize new committer input.
   - GitHub ID: preserve case in the markdown link and display text.
   - Required fields: GitHub ID, name, email, and certificate image URLs must be available before editing files.
   - Chinese name and English name: infer pinyin-style English names only when not provided.
   - Organization:
     - If provided in Chinese and English, use each as given.
     - If only Chinese is provided but an English name is clear, translate it conservatively.
     - If company is unknown or left blank, use `自由开发者` in Chinese files and `Independent developer` in English files.
   - Contributions:
     - Prefer user-provided nomination text.
     - If absent, research GitHub activity in `alibaba/nacos` and `nacos-group/*`.
     - Summarize the largest 3-4 areas of contribution and cite the evidence in working notes or final summary when useful.
   - Role is `Committer`; mail is the provided email.

4. Update all developer lists.
   - Add each new committer before `### 活跃贡献者` / `### Contributors`.
   - Update every file returned by the `nacos-dev.md` search, including:
     - `src/content/docs/v1/{zh-cn,en}/nacos-dev.md`
     - `src/content/docs/{v2,v2.3,v2.4,v2.5,v3.0,v3.1,latest,next}/{zh-cn,en}/community/nacos-dev.md`
   - When historical versions are missing older committers, backfill the missing rows too. The final GitHub ID set should match `latest`.
   - Preserve local table style when possible; do not reformat full tables just for alignment.
   - Preserve CRLF in `src/content/docs/v1/**/nacos-dev.md` if those files already use CRLF.

5. Create the announcement.
   - File name: `src/content/blog/committer-YYYYMMDD.md` unless the user gives another date.
   - Frontmatter:
     - `title`: `恭喜 <ids> 晋升 Nacos Committer`
     - `keywords`: include `Committer晋升` and the GitHub IDs.
     - `description`: mirror the title.
     - `date`: quoted `YYYY-MM-DD`.
     - `category: community`
   - Body:
     - Start with the same H1 as the title.
     - Use `## Nacos 社区新晋Committer`.
     - Summarize each committer's contribution from the user-provided nomination text.
     - Add certificate images in a markdown table. For two people, use the first row for front/person images and the second row for back/certificate images.
     - Reuse the `About Nacos` section and community group QR-code block from the most recent committer announcement unless the user asks for different text.

6. Validate.
   - Run `node .agents/skills/nacos-committer-update/scripts/validate_developer_lists.mjs`.
   - Run `git -c core.whitespace=blank-at-eol,blank-at-eof,space-before-tab,cr-at-eol diff --check`.
   - If feasible, run the repository build command. If it fails due environment, dependency, or network issues, report the exact blocker.
   - Use `git diff --stat` and targeted `rg -n "<GitHubID>" src/content/docs src/content/blog/...` checks to review scope.

7. Commit only when requested.
   - Stage only the announcement, developer-list docs, and skill files if the task is updating the skill.
   - Use a concise docs commit message such as `docs: add new committer announcement`.

## Validation Script

Use `scripts/validate_developer_lists.mjs` from the repository root. It checks that:

- Every versioned `nacos-dev.md` contains the full canonical GitHub ID list.
- English files match the latest English row values.
- Chinese files match the latest Chinese row values.
- No developer row has an empty organization cell.

If the script reports row-value mismatches in older files, prefer updating the older files to the `latest` row values unless the user explicitly wants version-specific historical data.
