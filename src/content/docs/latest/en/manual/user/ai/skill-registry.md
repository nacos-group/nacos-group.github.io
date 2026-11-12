---
title: Skill Registry
keywords: [Nacos Skill Registry, AI Skill, Agent Skill]
description: This document describes Nacos Skill Registry, including Skill creation, version management, security review, publishing, and distribution.
sidebar:
    order: 2
---

# Skill Registry

Skill Registry is the private Skill repository capability provided by Nacos. It centralizes Skill storage, version management, security review, and distribution on a single platform, making it easy for team members to discover, install, and share Skills.

Starting from version `3.2.0`, Nacos provides Skill Registry, supporting Skill creation, version management, security review, publishing, and distribution.

## 1. Skill in Nacos

### 1.1. Skill Definition and Structure

Skills typically refer to Agent Skills, designed to transform general-purpose large language models into "expert Agents" with domain-specific knowledge and reusable workflows.

A Skill is a reusable capability unit for AI Agents. Each Skill defines a set of instructions that tell the Agent **in what scenario** and **by what steps** to complete a specific task. A Skill consists of:

- **SKILL.md**: The core file containing YAML frontmatter (metadata such as name and description) and a Markdown body (detailed instructions). When an Agent loads a Skill, the complete SKILL.md content is injected into the execution context.
- **Resource files**: Optional supplementary files such as templates, data, and scripts, organized by type in subdirectories.

Example:

```
skill-sample/
├── SKILL.md          # Required: instructions + metadata
├── scripts/          # Optional: executable code
├── references/       # Optional: documentation
└── assets/           # Optional: templates, resources
```

### 1.2. Core Values of Skill Registry

- **Team Sharing**: Codify team best practices into Skills — create once, share across the team
- **Version Control**: Complete version lifecycle management with support for draft, review, publish, and online/offline transitions
- **Security Assurance**: Built-in publishing pipeline with integrated security scanning to prevent Prompt injection, data leakage, and other risks
- **Flexible Distribution**: Discover and install Skills via CLI, API, and SDK
- **Visibility Control**: Support PUBLIC / PRIVATE visibility modes to control Skill access scope as needed

## 2. Skill Lifecycle

### 2.1. Lifecycle

Skills follow the shared [AI Resource Lifecycle](./ai-resource-lifecycle.md), with five version states:

```text
draft -> reviewing -> reviewed -> online -> offline
                         |                    |
                         +-> draft            +-> online
                             redraft              restore
```

| State | Description |
|-------|-------------|
| `draft` | Editable draft |
| `reviewing` | Pipeline review is running; content cannot be edited |
| `reviewed` | Review completed; check whether it was approved or rejected |
| `online` | Published and available |
| `offline` | Offline, with content retained |

> **Constraints**:
> - A Skill can have only one working version at a time: `draft`, `reviewing`, or `reviewed`.
> - Published content cannot be changed. Create a draft with a new version for changes; use redraft to edit a version whose review has completed but which has not been published.

A Skill goes through the following complete workflow from creation to use:

#### 2.1.1. Creation

Three creation methods are supported:

| Method | Description |
|--------|-------------|
| **Manual Creation** | Fill in the name, description, and SKILL.md content in the console to create a draft version |
| **ZIP Upload** | Upload a ZIP package containing SKILL.md; the system automatically parses it and creates a draft |
| **AI Generation** | Provide a background description and let Copilot automatically generate the complete Skill content |

#### 2.1.2. Draft

- **New Draft**: Create a brand new Skill or create a new version draft for an existing Skill
- **Fork Draft**: Create a draft based on a published version, automatically inheriting content with an incremented version number
- **Edit Draft**: Modify SKILL.md content, description, and resource files
- **Delete Draft**: Discard the current draft and release the working slot

> If a `reviewing` or `reviewed` version exists, publish or discard that working version before creating a new draft. To change content after review, redraft that version instead.

#### 2.1.3. Submit for Review

Submit a `draft` version or resubmit a `reviewed` version:

- **An enabled Pipeline node supports Skill**: Enters `reviewing` and runs security scans or other checks
- **No applicable Pipeline node**: Publishes directly as `online`

Submitting a version already under review does not start another review. Resubmitting a `reviewed` version reruns the currently applicable checks.

#### 2.1.4. Publishing Pipeline

The Pipeline is a configurable review process that performs automated checks before Skill publication. **The Pipeline is disabled by default**; when disabled, submitting for review will directly publish to online state.

The Pipeline loads nodes that directly implement `PublishPipelineService` through Java SPI. It bundles `ai-pipeline:skill-scanner` (based on [Cisco AI Defense skill-scanner](https://github.com/cisco-ai-defense/skill-scanner)) and `ai-pipeline:skill-spector`; both support Skill, AgentSpec, and Prompt. Enabled nodes run serially by `getPreferOrder()` in ascending order. The old `PublishPipelineServiceBuilder` SPI has been removed.

To enable the Pipeline, configure in `application.properties`:

```properties
# Enable Pipeline; type only initializes chain state during first migration
nacos.plugin.ai-pipeline.enabled=true
nacos.plugin.ai-pipeline.type=skill-scanner,skill-spector

# Implementation startup state and configuration
nacos.plugin.ai-pipeline.skill-scanner.enabled=true
nacos.plugin.ai-pipeline.skill-scanner.command=/path/to/skill-scanner
nacos.plugin.ai-pipeline.skill-spector.enabled=true
nacos.plugin.ai-pipeline.skill-spector.command=/path/to/skill-spector
```

Persisted or runtime unified state is authoritative for current chain membership. Only each node's `order` definition can be changed at runtime; command, LLM, and scan settings are `RESTART`. See [AI Publish Pipeline Plugin](../../../plugin/ai-pipeline-plugin.md) for complete definitions.

The scanner nodes can detect risks such as:

- Prompt injection attacks
- Data leakage risks
- Malicious code patterns

Pipeline execution results:

| Result | Action |
|--------|--------|
| **APPROVED** | Version enters `reviewed` and, by default, waits for manual publishing |
| **REJECTED** | Version enters `reviewed`; use redraft to return to `draft` before editing and resubmitting |

#### 2.1.5. Publish

- **Normal Publish**: After Pipeline approval, publish the `reviewed` version as `online`; the server automatically updates the `latest` label
- **Force Publish**: Administrator privilege operation that bypasses Pipeline validation for direct publishing. When the Pipeline rejects a publish but the situation requires an emergency release, global administrators can force publish from the console. This operation is recorded in the audit log

#### 2.1.6. Online / Offline

Two granularities of online/offline operations are supported:

| Granularity | Description |
|-------------|-------------|
| **Version Level** | Perform online / offline operations on individual versions |
| **Skill Level** | Globally enable / disable the entire Skill, affecting the discoverability of all versions |

### 2.2. Versions and Labels

Skills use **Semantic Versioning** (SemVer), e.g. `1.0.0`, `1.1.2`. When creating a new draft, the version number auto-increments or can be manually specified (must be greater than the baseline version).

**Labels** are label → version mappings that assign semantic aliases to versions:

| Label | Example | Purpose |
|-------|---------|---------|
| `latest` | `latest → 1.2.0` | Default version fetched by clients |
| `stable` | `stable → 1.1.0` | Marks a verified stable version |
| Custom | `canary → 1.3.0` | Custom routing labels as needed |

When querying a Skill, clients can retrieve a specific version by label name, defaulting to the `latest` label.

Label management operations:

- The server manages `latest`: publishing or bringing a version online automatically makes it latest. Custom label operations cannot override it
- Taking the latest version offline or deleting it selects another remaining online version; if none remain, latest is removed
- Manually bind/unbind custom labels (e.g. `stable`, `canary`) in the version timeline

### 2.3. Visibility

Each Skill has a `scope` attribute controlling its visibility:

| Scope | Description |
|-------|-------------|
| **PUBLIC** | Visible and downloadable by all users within the namespace |
| **PRIVATE** | Visible only to the Owner (creator) and authorized users |

Visibility affects list queries, detail viewing, and download operations. Write operations (edit, publish, delete, etc.) require Owner identity or explicit write permissions. Toggle the Skill's `scope` (PUBLIC ↔ PRIVATE) at any time from the detail page; after switching to PRIVATE, non-Owner users will no longer see the Skill in the list.

### 2.4. Business Tags

Business tags (Biz Tags) are used to categorize Skills by business domain, e.g. `["retail", "finance"]`.

- Add or remove business tags from the detail page
- Tags are stored in JSON array format
- Can be used for filtering and categorized display on the list page

## 3. Console

The Nacos console provides a complete Skill registry interface, located under **AI Registry > Skill Registry**.

### 3.1. Skill List Page

The list page displays all Skills in card format with the following features:

- **Search**: Search by Skill name keyword
- **Sort**: Sort by default order or download count
- **Card Info**: Displays name, description, business tags, online version count, draft status, download count, and update time
- **Batch Operations**: Multi-select for batch deletion
- **Quick Actions**: Upload ZIP, create new Skill

### 3.2. Skill Detail Page

The detail page provides a comprehensive management view of a Skill, including basic info, version management, content editing, Pipeline status, CLI command card, and more.

#### 3.2.1. Versions

The right side of the detail page displays all versions in a timeline, supporting version switching and the following operations:

| Operation | Description |
|-----------|-------------|
| **Create Draft** | Create a draft based on an existing version; resolve any existing draft, reviewing, or reviewed working version first |
| **Edit Draft** | Edit SKILL.md content, description, and resource files online with auto-save |
| **Delete Draft** | Discard the current draft and release the working slot |
| **Submit for Review** | Submit draft or resubmit reviewed; publishes directly if no Pipeline applies. Description and SKILL.md content must not be empty |
| **Redraft** | Return a reviewed version to draft for editing and resubmission |
| **Publish** | Publish an approved reviewed version as online and automatically update `latest` |
| **Force Publish** | Visible to administrators only; bypasses Pipeline validation when it rejects |

#### 3.2.2. Online / Offline

- **Version Level**: Perform online / offline on individual versions from the version timeline or action area
- **Skill Level**: The enable toggle at the top of the detail page controls the discoverability of the entire Skill; when disabled, all versions become invisible to clients

#### 3.2.3. Visibility

A visibility toggle at the top of the detail page supports switching between PUBLIC ↔ PRIVATE. After switching to PRIVATE, non-Owner users will not be able to discover the Skill.

#### 3.2.4. Labels

- **Version Labels**: Bind / unbind custom labels (e.g. `stable`, `canary`) from the version timeline or sidebar card; only online / offline versions can be operated on
- **Business Tags (Biz Tags)**: Add or remove business category tags from the sidebar card, used for filtering and categorized display on the list page

### 3.3. Skill Creation and Upload

Three methods are available to create a new Skill:

- **Manual Creation**: Fill in the Skill name, description, and SKILL.md content through the creation dialog
- **AI Generation**: Enter a background description, optionally associate MCP tools and conversation history, and let Copilot generate the complete Skill via streaming
- **ZIP Upload**: Upload a Skill ZIP package directly; the system automatically parses the SKILL.md and resource files and creates a version draft

### 3.4. Skill Optimization

AI-assisted optimization is available for existing Skills from the detail page:

- Select the target file to optimize (SKILL.md or resource files)
- Enter the optimization goal description
- Optionally associate MCP tools and conversation history as optimization context
- Copilot streams the optimized content, with one-click apply support

> The AI generation in section 3.3 and AI optimization in section 3.4 are powered by Copilot. Before using them, you need to configure a large model API Key via the `COPILOT_API_KEY` environment variable (recommended) or through the **Settings Center** page in the console.

## 4. CLI / API / SDK Reference

Skill Registry provides multiple access methods. Refer to the respective documentation for detailed usage.

### 4.1. nacos-cli

[nacos-cli](../../admin/nacos-cli.md) is the command-line tool for Skill Registry, providing Skill search, installation, upload, and sync capabilities. For detailed installation and Skill commands, see [Nacos CLI User Guide - AI Skill commands](../../admin/nacos-cli.md).

### 4.2. REST API

Skill Registry provides three layers of REST APIs:

| API Layer | Description | Documentation |
|-----------|-------------|---------------|
| **Client API** | Client runtime query/download Skills (credentials required by default; anonymous reads require [explicit setup and authorization](../auth.mdx)) | [Client API - Download Skill](../open-api.md) |
| **Console API** | Console operations (requires login authentication) | [Console API - Skills](../../admin/console-api.md) |
| **Admin API** | Cluster internal management interface | [Admin API - AI Skills](../../admin/admin-api.md) |

### 4.3. Java SDK

Nacos provides two Java SDKs for programmatic Skill management:

| SDK | Use Case | Documentation |
|-----|----------|---------------|
| **nacos-client** | Client runtime Skill loading and subscription | [Java SDK - Skill](../java-sdk/usage.md) |
| **nacos-maintainer-client** | Operations management (create, publish, online/offline, etc.), suitable for automation and CI/CD | [Maintainer SDK - Skill](../../admin/maintainer-sdk.md) |
