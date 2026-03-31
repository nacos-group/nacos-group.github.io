# Nacos Download Page — Paths and Formats

## File Paths

| Locale | Download page | Release history |
|--------|----------------|-----------------|
| zh-cn | `src/content/download/zh-cn/nacos-server.mdx` | `src/content/download/zh-cn/release-history.mdx` |
| en    | `src/content/download/en/nacos-server.mdx`    | `src/content/download/en/release-history.mdx`    |

Add or use other locales under `src/content/download/{locale}/` as needed.

## nacos-server.mdx — Table Structure

### Stable (3.x / 2.x)

**zh-cn header row:**

| 版本 | 二进制包下载 | Docker 镜像 | MD5 | 发布说明 | 参考文档 |

**en header row:**

| Version | Binary Package Download | Docker Image | MD5 | Release Notes | Reference Documentation |

**Data row pattern:**

- 版本/Version: plain `X.Y.Z`
- 二进制包: `[X.Y.Z.zip](https://download.nacos.io/nacos-server/nacos-server-X.Y.Z.zip)` (stable) or GitHub release download URL (snapshot)
- Docker: `[nacos/nacos-server\:vX.Y.Z](https://hub.docker.com/r/nacos/nacos-server/tags?page=1&name=X.Y.Z)` (stable only)
- MD5: single line, 32-char hex
- 发布说明/Release Notes: `[发布说明](https://github.com/alibaba/nacos/releases/tag/{tag})` / `[Release Notes](...)`
- 参考文档/Reference: see below

**Reference doc links:**

- 3.x stable: `/docs/latest/quickstart/quick-start/` (zh-cn 快速开始; en Quick Start)
- 2.x stable: `/docs/v2.5/quickstart/quick-start/` (or matching minor, e.g. v2.4)
- Snapshot: `/docs/next/quickstart/quick-start/`

### Snapshot table

Same columns; Docker cell uses fixed text (no versioned image): zh-cn “快照版本不提供镜像，…” with link to `nacos/nacos-server:latest`; en “Snapshots do not provide images…” with same link.

## release-history.mdx — Table Structure

- **zh-cn**: First table (3.x) has no section title; intro says “当前最新版本是 X.Y.Z”. Then `## Nacos 2.x`, `## Nacos 1.x`.
- **en**: `## Nacos 3.x`, `## Nacos 2.x`, `## Nacos 1.x`.

Tables are wrapped in `<div class="sl-markdown-table">` and use:

**zh-cn header:** `| 发布时间 | 版本 | Java版本要求 | 相关链接 |`  
**en header:** `| Release Date | Version | Required Java Version | Links |`

**Data row:**

- 发布时间/Release Date: `YYYY-MM-DD`
- 版本/Version: `[X.Y.Z](https://download.nacos.io/nacos-server/nacos-server-X.Y.Z.zip)`
- Java: `Java 17` (3.x) or `Java 8` (2.x)
- 相关链接/Links: `[发布说明](https://github.com/alibaba/nacos/releases/tag/{tag}) [参考文档](/docs/...)` / en `[release notes](...) [reference documentation](...)`

Insert new rows at the **top** of the matching major-version block.

## GitHub Release → Tag and Assets

- **Tag**: From URL path, e.g. `releases/tag/3.1.0-BETA` → tag `3.1.0-BETA`. Use this in “发布说明” / “Release Notes” links.
- **Zip**: Asset name like `nacos-server-{version}.zip`; version in name may match tag or be normalized (e.g. 3.1.0-BETA).
- **MD5**: Asset `nacos-server-{version}.zip.md5` or similar; body is the 32-char MD5 string.

## Tip Anchor Targets

- zh-cn: `#稳定版本` (stable), `#快照版本` (snapshot)
- en: `#stable-versions`, `#snapshot-versions`
