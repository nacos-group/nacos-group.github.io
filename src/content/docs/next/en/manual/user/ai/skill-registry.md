---
title: Skill Registry
keywords: [Nacos Skill Registry, Skill Management, AI Skill, Agent Skill]
description: This document describes the Nacos Skill Registry, including Skill creation, version management, security review, publishing, and distribution.
sidebar:
    order: 6
---

# Skill Registry

Skill Registry is a Skill management center provided by Nacos, serving as a **private Skill repository** for teams and organizations. It centralizes Skill storage, version management, security review, and distribution on a single platform, making it easy for team members to discover, install, and share Skills.

Starting from version `3.2.0`, Nacos provides the Skill Registry, supporting Skill creation, version management, security review, publishing, and distribution.

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

## 2. Core Concepts

### 2.1. Lifecycle and States

Each Skill version has four states that form a complete lifecycle:

```
draft ──> reviewing ──> online ──> offline
  ^           │                       │
  └───────────┘                       │
  (Reverts when Pipeline rejects)     │
                                      └──> online (can go back online)
```

| State | Description |
|-------|-------------|
| `draft` | Draft, content can be freely edited |
| `reviewing` | Submitted for review, Pipeline is running |
| `online` | Published and available |
| `offline` | Taken offline, no longer available |

> **Constraint**: Only one draft or reviewing version can exist for the same Skill at any time.

### 2.2. Versions and Labels

Skills use **Semantic Versioning** (SemVer), e.g. `1.0.0`, `1.1.2`. When creating a new draft, the version number auto-increments or can be manually specified (must be greater than the baseline version).

**Labels** are label → version mappings that assign semantic aliases to versions:

| Label | Example | Purpose |
|-------|---------|---------|
| `latest` | `latest → 1.2.0` | Default version fetched by clients |
| `stable` | `stable → 1.1.0` | Marks a verified stable version |
| Custom | `canary → 1.3.0` | Custom routing labels as needed |

When querying a Skill, clients can retrieve a specific version by label name, defaulting to the `latest` label.

### 2.3. Visibility

Each Skill has a `scope` attribute controlling its visibility:

| Scope | Description |
|-------|-------------|
| **PUBLIC** | Visible and downloadable by all users within the namespace |
| **PRIVATE** | Visible only to the Owner (creator) and authorized users |

Visibility affects list queries, detail viewing, and download operations. Write operations (edit, publish, delete, etc.) require Owner identity or explicit write permissions.

## 3. Skill Management

### 3.1. Lifecycle

A Skill goes through the following complete workflow from creation to use:

#### 3.1.1. Creation

Three creation methods are supported:

| Method | Description |
|--------|-------------|
| **Manual Creation** | Fill in the name, description, and SKILL.md content in the console to create a draft version |
| **ZIP Upload** | Upload a ZIP package containing SKILL.md; the system automatically parses and creates the Skill |
| **AI Generation** | Provide a background description and let Copilot automatically generate the complete Skill content |

#### 3.1.2. Draft

- **New Draft**: Create a brand new Skill or create a new version draft for an existing Skill
- **Fork Draft**: Create a draft based on a published version, automatically inheriting content with an incremented version number
- **Edit Draft**: Modify SKILL.md content, description, and resource files
- **Delete Draft**: Discard the current draft and release the working slot

> Only one draft or reviewing version is allowed per Skill at a time. You must wait for the current working version to be processed before creating a new draft.

#### 3.1.3. Submit for Review

Submit a draft version for review. After submission, the version state changes to `reviewing`:

- **With Pipeline configured**: Triggers the publishing pipeline for security scanning and other checks
- **Without Pipeline configured**: Directly publishes to online state

#### 3.1.4. Publishing Pipeline

The Pipeline is a configurable review process that performs automated checks before Skill publication.

Built-in check nodes include **skill-scanner security scanning** (based on [Cisco AI Defense skill-scanner](https://github.com/cisco-ai-defense/skill-scanner)), which detects the following risks:

- Prompt injection attacks
- Data leakage risks
- Malicious code patterns

Pipeline execution results:

| Result | Action |
|--------|--------|
| **APPROVED** | Version remains in `reviewing` state, awaiting manual publish |
| **REJECTED** | Version reverts to `draft`, can be modified and resubmitted |

#### 3.1.5. Publish

- **Normal Publish**: After Pipeline approval, publish the `reviewing` version as `online`, with the option to update the `latest` label
- **Force Publish**: Administrator privilege operation that bypasses Pipeline validation for direct publishing, suitable for emergency situations

#### 3.1.6. Online / Offline

Two granularities of online/offline operations are supported:

| Granularity | Description |
|-------------|-------------|
| **Version Level** | Perform online / offline operations on individual versions |
| **Skill Level** | Globally enable / disable the entire Skill, affecting the discoverability of all versions |

### 3.2. Visibility Management

- Toggle the Skill's `scope` (PUBLIC ↔ PRIVATE) at any time from the detail page
- After switching to PRIVATE, non-Owner users will no longer see the Skill in the list
- Only the Owner or users with explicit write permissions can modify visibility

### 3.3. Version Label Management

- Optionally auto-update the `latest` label to point to the new version when publishing
- Manually bind/unbind custom labels (e.g. `stable`, `canary`) in the version timeline
- The `latest` label serves as the default version resolution basis for client queries

### 3.4. Business Tag Management

Business tags (Biz Tags) are used to categorize Skills by business domain, e.g. `["retail", "finance"]`.

- Add or remove business tags from the detail page
- Tags are stored in JSON array format
- Can be used for filtering and categorized display on the list page

## 4. Management Console

The Nacos console provides a complete Skill management interface, located under **AI Registry > Skill Management**.

### 4.1. Skill List Page

The list page displays all Skills in card format with the following features:

- **Search**: Search by Skill name keyword
- **Sort**: Sort by default order or download count
- **Card Info**: Displays name, description, business tags, online version count, draft status, download count, and update time
- **Batch Operations**: Multi-select for batch deletion
- **Quick Actions**: Upload ZIP, create new Skill

### 4.2. Skill Detail Page

The detail page provides a comprehensive management view of a Skill:

- **Basic Info**: Name, description, enable/disable toggle, visibility toggle (PUBLIC / PRIVATE), online version count, download count, update time, source info
- **Version Selection**: Dropdown to switch between versions, displaying status indicators for each (Draft / Reviewing / Pending Publish / Online / Offline)
- **SKILL.md View/Edit**: View mode renders Markdown; Draft mode provides an online Markdown editor
- **Resource File Management**: View and manage resource files associated with the Skill
- **Version Action Buttons**: Dynamically display available actions based on the current version state (submit for review, publish, force publish, online/offline, create new draft, etc.)
- **Version Timeline**: Sidebar displaying a timeline of all versions, supporting version switching, label binding, and downloads
- **Pipeline Status**: Display the execution status and detailed checkpoint results of the review pipeline
- **CLI Command Card**: Display the nacos-cli command to install the Skill
- **Business tag and version label management**

### 4.3. Skill Creation

The creation dialog provides two modes:

- **Manual Creation**: Fill in the Skill name, description, and SKILL.md content
- **AI Generation**: Enter a background description, optionally associate MCP tools and conversation history, and let Copilot generate the complete Skill via streaming (including thinking process display)

### 4.4. Skill Optimization (AI Copilot)

AI-assisted optimization is available for existing Skills from the detail page:

- Select the target file to optimize (SKILL.md or resource files)
- Enter the optimization goal description
- Optionally associate MCP tools and conversation history as optimization context
- Copilot streams the optimized content, with one-click apply support

## 5. API / SDK / CLI Reference

Skill Registry provides multiple access methods. Refer to the respective documentation for detailed usage.

### 5.1. nacos-cli

[nacos-cli](../../admin/nacos-cli.md) is the command-line tool for Skill Registry, providing Skill search, installation, upload, and sync capabilities. For detailed installation and Skill management commands, see [Nacos CLI User Guide - AI Skill Management](../../admin/nacos-cli.md#51-ai-技能管理-).

### 5.2. REST API

Skill Registry provides three layers of REST APIs:

| API Layer | Description | Documentation |
|-----------|-------------|---------------|
| **Client API** | Client runtime query/download Skills (supports anonymous access) | [Client API - Download Skill](../open-api.md#34-下载-skill) |
| **Console API** | Console management operations (requires login authentication) | [Console API - Skills Management](../../admin/console-api.md#7-skills-管理) |
| **Admin API** | Cluster internal management interface | [Admin API - AI Skills Management](../../admin/admin-api.md#7-ai-skills-管理) |

### 5.3. Java SDK

Nacos provides two Java SDKs for programmatic Skill management:

| SDK | Use Case | Documentation |
|-----|----------|---------------|
| **nacos-client** | Client runtime Skill loading and subscription | [Java SDK - Skill](../java-sdk/usage.md#8-skill-能力) |
| **nacos-maintainer-client** | Operations management (create, publish, online/offline, etc.), suitable for automation and CI/CD | [Maintainer SDK - Skill](../../admin/maintainer-sdk.md#9-skill-能力) |
