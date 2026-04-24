---
name: nacos-download-page
description: Updates Nacos download page and release history from a GitHub release URL. Fetches version and MD5 from the release, updates nacos-server.mdx (stable/snapshot), migrates previous stable row to release-history.mdx, updates the top tip with release summary, and syncs all changes to other locales (e.g. en). Use when the user provides a GitHub release link to update the download page or when asked to update Nacos download/release history from a release.
---

# Nacos Download Page Updater

Update `src/content/download/{i18n}/nacos-server.mdx` and `src/content/download/{i18n}/release-history.mdx` from a GitHub release URL. Locales: `zh-cn` (source), `en` (and any others under `src/content/download/`).

## 1. Parse the GitHub Release

- **Input**: User provides a GitHub release URL (e.g. `https://github.com/alibaba/nacos/releases/tag/3.1.2`).
- Fetch the release page (or use GitHub API) to get:
  - **Version**: From the release **title** (e.g. "Nacos 3.1.2" → `3.1.2`).
  - **Release date**: From `published_at` (API) or page, format **YYYY-MM-DD**.
  - **MD5**: From **assets**. Only the **zip** package is needed:
    - Find the asset named like `nacos-server-{version}.zip`.
    - Find the corresponding MD5 asset (e.g. `nacos-server-{version}.zip.md5` or similar). Download or fetch its content; the file content is the MD5 string (strip whitespace/newline).
  - **Release notes body**: Used later for the tip summary.

If no `.md5` file exists in assets, leave MD5 blank or note in the table that it’s missing (follow existing pattern in the repo).

## 2. Classify Version and Target Section

- **3.x stable**: Version matches `3.x` and is not a pre-release (no ALPHA/BETA/RC in the tag/title) → update **3.x** stable table in `nacos-server.mdx`.
- **2.x stable**: Version matches `2.x` and is not a pre-release → update **2.x** stable table in `nacos-server.mdx`.
- **Other** (e.g. ALPHA, BETA, RC, or non-2/3): → update **快照版本 / Snapshot Versions** in `nacos-server.mdx`.

Stable download links use `https://download.nacos.io/nacos-server/nacos-server-{version}.zip`. Snapshot versions often use `https://github.com/alibaba/nacos/releases/download/{tag}/nacos-server-{version}.zip` (tag may include suffix, e.g. `3.1.0-BETA`).

## 3. Update nacos-server.mdx (per locale)

- **Stable (3.x or 2.x)**:
  - Replace the **single current row** in the corresponding subsection (### 3.x or ### 2.x) with the new version row (Version, Binary link, Docker image link, MD5, Release notes link, Reference doc link). Keep table header and structure unchanged.
  - Docker image: `[nacos/nacos-server\:v{version}](https://hub.docker.com/r/nacos/nacos-server/tags?page=1&name={version})`.
  - Release notes: `[发布说明](https://github.com/alibaba/nacos/releases/tag/{tag})` (zh-cn) / `[Release Notes](...)` (en). Use the **tag** from the URL (e.g. `3.1.0-BETA`).
  - Reference doc: 3.x → latest/next; 2.x → v2.5 or corresponding; see [reference.md](reference.md).
- **Snapshot**:
  - **Remove** any existing snapshot row(s) that belong to the **same major version** (e.g. when adding 3.2.0-BETA, remove 3.1.0-BETA; when adding 2.5.0-ALPHA, remove any other 2.x snapshot). The snapshot table keeps at most one snapshot per major version—the one being added.
  - **Add** a new row for the new snapshot version. Snapshot Docker text: zh-cn “快照版本不提供镜像…” / en “Snapshots do not provide images…”; link to `nacos/nacos-server:latest`.

## 4. If This Is a 2.x or 3.x Stable Release: Update release-history.mdx

- **Move the “old” stable row** from `nacos-server.mdx` (the row that was there before your update) into `release-history.mdx`.
  - In **release-history.mdx**, tables are grouped by major version: **3.x** (first table, no “Nacos 3.x” heading in zh-cn; en has “## Nacos 3.x”), **2.x** (“## Nacos 2.x”), **1.x** (“## Nacos 1.x”).
- **Add one new row** at the **top** of the correct major-version table:
  - Columns: 发布时间 (Release Date) | 版本 (Version) | Java版本要求 (Required Java Version) | 相关链接 (Links).
  - 发布时间: YYYY-MM-DD from the release.
  - 版本: `[X.Y.Z](https://download.nacos.io/nacos-server/nacos-server-X.Y.Z.zip)`.
  - Java: 3.x → Java 17; 2.x → Java 8.
  - 相关链接: 发布说明 + 参考文档 (same pattern as existing rows).
- **Update the “latest version” text** in the intro of release-history.mdx: zh-cn “当前最新版本是 X.Y.Z” / en “the latest version is X.Y.Z” to the **new** stable version you just added.

## 5. Update the Top Tip in nacos-server.mdx

- Summarize the GitHub release notes in **1–2 short sentences** (Chinese for zh-cn, English for en).
- Replace the `:::tip` content with (zh-cn):

  ```text
  Nacos Server **{new_version}** 已发布。{新版本主要总结}。

  欢迎[下载和试用](#稳定版本)。
  ```

  For snapshot-only updates, use `#快照版本` instead of `#稳定版本`; if both apply, use “稳定版本” or “快照版本” as appropriate.

- En locale equivalent:

  ```text
  Nacos Server **{new_version}** has been released. {Short summary in English}.

  Feel free to [download and try it out](#stable-versions).
  ```

  Use `#snapshot-versions` when the release is snapshot-only.

## 6. i18n: Apply to All Locales

- **Source of truth**: `zh-cn` for structure and wording in Chinese.
- **Other locales**: Apply the **same structural edits** (tables, new row, release-history row, “latest version” text). **Translate** only the tip summary and any locale-specific strings (e.g. “已发布” → “has been released”, “欢迎下载和试用” → “Feel free to download and try it out”).
- Ensure every locale under `src/content/download/` (e.g. `en`) gets the same table and link updates; only the tip and intro texts are translated.

## 7. Homepage Release Info (Stable-Only by Default)

When updating release download info, also check homepage release info:

- `src/components/home/EarthBackground.astro` (latest release note link)
- `src/i18n/zh-cn/ui.ts`:
  - `home.introduce.nacos.notes`
  - `home.introduce.nacos.release.note.1`
  - `home.introduce.nacos.release.note.1.mobile`
- `src/i18n/en/ui.ts`:
  - `home.introduce.nacos.notes`
  - `home.introduce.nacos.release.note.1`
  - `home.introduce.nacos.release.note.1.mobile`

### Update policy

- **Default**: Update homepage release info **only for stable GA releases** (for example `3.2.1`).
- **Do NOT update homepage by default** for pre-release/non-GA versions such as:
  - versions containing suffixes like `-ALPHA`, `-BETA`, `-RC` (case-insensitive),
  - date-suffixed tags/versions like `-20260423` or other `-<date>` style suffixes.
- For those pre-release/non-GA versions, update homepage release info **only when explicitly requested by the user/developer**.

## Checklist

- [ ] Fetched version, release date, zip MD5, and release notes from the GitHub release.
- [ ] Updated the correct section in nacos-server.mdx (3.x / 2.x stable or snapshot).
- [ ] If snapshot: removed any existing snapshot row of the same major version before adding the new snapshot row.
- [ ] If stable: moved previous stable row to release-history.mdx and added new row; updated “latest version” in release-history intro.
- [ ] Updated the top tip with new version and 1–2 sentence summary in nacos-server.mdx.
- [ ] Applied all edits to en (and any other locale) with translated tip/intro.
- [ ] Updated homepage release info for GA releases only; skipped pre-release homepage updates unless explicitly requested.

## Reference

- File paths and table formats: [reference.md](reference.md).
