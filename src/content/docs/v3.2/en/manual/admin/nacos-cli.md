---
title: Nacos CLI User Guide
keywords: [ Nacos, Nacos CLI ]
description: Nacos CLI User Guide, introducing how to install and use Nacos CLI for configuration management, full lifecycle management of AI Skills and AgentSpecs, and interactive terminal operations.
sidebar:
  order: 14
---

# Nacos CLI User Guide

Nacos CLI is a command-line tool for Nacos configuration center, supporting configuration management, full lifecycle management of AI Skills and AgentSpecs (upload → review → release), and interactive terminal mode.

## 1. Prerequisites
### 1.1. Runtime Requirements
1. 64-bit OS, supporting Linux/Unix/Mac/Windows
2. Nacos Server 2.x or 3.x

### 1.2. Ensure Nacos Server is Running
Before using Nacos CLI, please ensure your Nacos server is running properly. If you haven't installed Nacos yet, please refer to [Nacos Quick Start](../../quickstart/quick-start.mdx) for installation and startup.

## 2. Install Nacos CLI
### 2.1. Install via Official Script (Recommended)
This is the simplest installation method. After installation, configure the Nacos address to start using it.

**Linux / macOS:**

```bash
curl -fsSL https://nacos.io/nacos-installer.sh | bash -s -- --cli
```

**Windows (PowerShell):**

```powershell
iwr -UseBasicParsing https://nacos.io/nacos-installer.ps1 -OutFile $env:TEMP\nacos-installer.ps1; & $env:TEMP\nacos-installer.ps1 -cli; Remove-Item $env:TEMP\nacos-installer.ps1
```

### 2.2. Install via npm
If you already have a Node.js environment, you can install via npm:

```bash
# npm global install
npm install -g @nacos-group/cli
nacos-cli --help

# Or use npx without installation
npx @nacos-group/cli --help
```

### 2.3. Verify Installation
```bash
nacos-cli --help
```

## 3. Authentication Configuration
Nacos CLI supports the following authentication methods:

- `none`: no authentication
- `nacos`: username / password
- `aliyun`: Alibaba Cloud AccessKey / SecretKey (for Alibaba Cloud MSE Nacos)
- `sts-hiclaw`: STS temporary credentials (resolved dynamically from the `HICLAW_CONTROLLER_URL` and `HICLAW_AUTH_TOKEN_FILE` environment variables)

### 3.1. Profile-Based Configuration (Recommended)
Nacos CLI stores per-environment connection settings as profiles. Each profile maps to a YAML file at `~/.nacos-cli/<profile>.conf`. The default profile is named `default`, stored at `~/.nacos-cli/default.conf`.

> **First run**: Just execute `nacos-cli`. When no profile exists, the CLI launches an interactive wizard that walks you through host, port, authType, username, password, etc., and saves the result to `~/.nacos-cli/default.conf` for future reuse.

#### 3.1.1. Create / Edit a Profile
`nacos-cli profile edit` enters an interactive editor. Existing values are shown as defaults — press Enter to keep them.

```bash
# Create / edit the default profile (saved to ~/.nacos-cli/default.conf)
nacos-cli profile edit

# Create / edit the dev profile (saved to ~/.nacos-cli/dev.conf)
nacos-cli profile edit dev

# Create / edit the prod profile
nacos-cli profile edit prod
```

After editing, the CLI asks whether to log in immediately and enter the interactive terminal — pressing Enter accepts.

#### 3.1.2. Show a Profile
```bash
# Show the default profile
nacos-cli profile show

# Show the dev profile
nacos-cli profile show dev
```

Sample output (passwords / secret keys are masked):
```plain
Profile: dev
Config file: /Users/<user>/.nacos-cli/dev.conf
─────────────────────────────────────────
host:           127.0.0.1
port:           8848
auth-type:      nacos
username:       nacos
password:       ******
namespace:      (public)
```

#### 3.1.3. Switch Profiles
The `default` profile is loaded automatically. Use `--profile` to switch:

```bash
# Use the default profile (equivalent to omitting --profile)
nacos-cli skill-list

# Use the dev profile (loads ~/.nacos-cli/dev.conf)
nacos-cli --profile dev skill-list

# Use the prod profile
nacos-cli --profile prod config-list
```

#### 3.1.4. Configuration File Format
Profile files are YAML (note: fields use camelCase):

```yaml
# Nacos server host
host: <your_nacos_host>

# Nacos server port
port: <your_nacos_port>

# Authentication type: none | nacos | aliyun | sts-hiclaw
authType: nacos

# Nacos authentication (used when authType=nacos)
username: <your_username>
password: <your_password>

# Alibaba Cloud authentication (used when authType=aliyun)
accessKey: ""
secretKey: ""

# STS SecurityToken (legacy)
securityToken: ""

# Namespace ID (optional, leave empty for public)
namespace: ""
```

> **Note**: When `authType=sts-hiclaw`, do not store credentials in the profile file. The CLI resolves them dynamically from the `HICLAW_CONTROLLER_URL` and `HICLAW_AUTH_TOKEN_FILE` environment variables.

### 3.2. Explicit Configuration File (`--config`)
You can also point the CLI at any config file path with `--config`, which is convenient when checking config into a project repo or wiring up a script environment:

```bash
nacos-cli --config /path/to/custom.conf skill-list
```

`--config` overrides profile resolution: when set, both `--profile` and the files under `~/.nacos-cli/` are ignored.

### 3.3. Command-Line Parameters
You can also provide everything via command-line flags, with no config file at all:

#### 3.3.1. Nacos Authentication (Username/Password)
```bash
nacos-cli --host <host> --port <port> -u <username> -p <password>
```

#### 3.3.2. Alibaba Cloud Authentication (AccessKey/SecretKey)
```bash
nacos-cli --host <host> --port <port> --auth-type aliyun --access-key <your_ak> --secret-key <your_sk>
```

#### 3.3.3. STS (sts-hiclaw) Authentication
```bash
export HICLAW_CONTROLLER_URL=https://<controller-host>
export HICLAW_AUTH_TOKEN_FILE=/path/to/token

nacos-cli --host <host> --port <port> --auth-type sts-hiclaw
```

### 3.4. Environment Variables
You can also provide Nacos connection information via environment variables:

```bash
export NACOS_HOST=127.0.0.1
export NACOS_PORT=8848
export NACOS_NAMESPACE=xxx
export NACOS_AUTH_TYPE=nacos
```

`sts-hiclaw` additionally requires:

```bash
export HICLAW_CONTROLLER_URL=https://<controller-host>
export HICLAW_AUTH_TOKEN_FILE=/path/to/token
```

### 3.5. Configuration Priority
Configuration values are applied in the following priority order (highest to lowest):

1. **Command-line parameters** (highest priority)
2. **Configuration file specified by `--config`**
3. **Profile selected by `--profile` (defaults to `default`)**
4. **Environment variables** (`NACOS_HOST` / `NACOS_PORT` / `NACOS_NAMESPACE` / `NACOS_AUTH_TYPE`)
5. **Default values** (lowest priority)

Examples:

```bash
# Use the dev profile, but override host via command line
nacos-cli --profile dev --host 10.0.0.1 skill-list

# Explicit config file
nacos-cli --config /path/to/custom.conf skill-list

# Use environment variables (when command line, --config, and profile all do not provide a value)
NACOS_HOST=127.0.0.1 NACOS_PORT=8848 NACOS_NAMESPACE=xxx nacos-cli skill-list

# Without any arguments, the CLI runs the interactive wizard to create the default profile, then connects to that server
nacos-cli

# When only --host is provided, port defaults to 8848
nacos-cli --host 127.0.0.1

# When only --port is provided, host defaults to 127.0.0.1
nacos-cli --port 8849
```

## 4. Quick Start
> **Tip**: The following examples assume the default profile has been configured via `nacos-cli profile edit`. See [3.1 Profile-Based Configuration](#31-profile-based-configuration-recommended) for details.
>

### 4.1. CLI Mode
Execute commands directly from the command line:

```bash
# List all skills
nacos-cli skill-list

# Get a skill
nacos-cli skill-get <skill-name>

# Upload a skill
nacos-cli skill-upload /path/to/skill
```

### 4.2. Interactive Terminal Mode
Start an interactive session:

```bash
nacos-cli
```

After entering interactive mode, you can execute the following commands:

```plain
nacos> skill-list
nacos> skill-get <skill-name>
nacos> config-list
nacos> help
```

## 5. Feature Modules

### 5.1. AI Skill Management ✅

Skills follow a three-stage lifecycle aligned with the server:
`upload` (editing) → `review` (reviewing → reviewed) → `release` (online).

Nacos CLI provides complete Skill lifecycle management: list, describe, get, upload, review, release, plus real-time synchronization.

#### 5.1.1. List Skills
Get the list of AI skills stored in Nacos. By default, skill descriptions are displayed (truncated to 50 characters). Supports script-friendly JSON output.

**Command Format**
```bash
nacos-cli skill-list [flags]
```

**Parameters**

| Parameter | Short | Default | Description |
| --- | --- | --- | --- |
| --name |  |  | Filter by skill name |
| --page |  | 1 | Page number |
| --size |  | 10 | Page size |
| --output |  | pretty | Output format: `pretty` (default) or `json` (machine-readable for scripting) |

**Usage Examples**
```bash
# List all skills (with descriptions by default)
nacos-cli skill-list

# Filter by name
nacos-cli skill-list --name <skill-name> --page 1 --size 20

# Machine-readable JSON output
nacos-cli skill-list --output json

# Interactive mode
nacos> skill-list
nacos> skill-list --name <skill-name> --page 2
nacos> skill-list --output json
```

#### 5.1.2. Describe Skill
Show detail and version history of the specified skill (latest / editing / reviewing / online, plus per-version status).

**Command Format**
```bash
nacos-cli skill-describe <skill-name> [flags]
```

**Usage Examples**
```bash
nacos-cli skill-describe <skill-name>
nacos-cli skill-describe <skill-name> --output json

# Interactive mode
nacos> skill-describe <skill-name>
```

#### 5.1.3. Get/Download Skill

Download a skill from Nacos to a local directory, including skill metadata (SKILL.md) and all resource files.

**Command Format**
```bash
nacos-cli skill-get <skill-name> [flags]
```

**Parameters**

| Parameter | Short | Default | Description |
| --- | --- | --- | --- |
| -o, --output | -o | ~/.skills | Output directory |

**Usage Examples**
```bash
# Download to default directory (~/.skills)
nacos-cli skill-get <skill-name>

# Download to specified directory
nacos-cli skill-get <skill-name> -o /custom/path

# Interactive mode
nacos> skill-get <skill-name>
```

**Skill Directory Structure**
The downloaded skill directory structure is as follows:

```plain
~/.skills/<skill-name>/
├── SKILL.md          # Skill metadata and instructions
├── prompts/          # Prompt resources
│   └── main.md
└── scripts/          # Script resources
    └── init_skill.py
```

#### 5.1.4. Upload Skill

Upload a local skill to Nacos (creates or updates the `editing` version), supporting single or batch uploads.

**Command Format**
```bash
nacos-cli skill-upload <path> [flags]
```

**Parameters**

| Parameter | Default | Description |
| --- | --- | --- |
| --all | false | Batch upload all skills under the directory |

**Usage Examples**
```bash
# Upload a single skill
nacos-cli skill-upload /path/to/skill

# Batch upload
nacos-cli skill-upload --all /path/to/skills/folder

# Interactive mode
nacos> skill-upload /path/to/skill
nacos> skill-upload --all /path/to/skills
```

#### 5.1.5. Review Skill

Submit the current `editing` version for review (editing → reviewing). The server-side review pipeline runs asynchronously and eventually marks the version as `reviewed`.

**Command Format**
```bash
nacos-cli skill-review <skill-name>
```

**Usage Examples**
```bash
nacos-cli skill-review <skill-name>

# Interactive mode
nacos> skill-review <skill-name>
```

#### 5.1.6. Release Skill

Publish an approved (`reviewed`) version online.

**Command Format**
```bash
nacos-cli skill-release <skill-name> --version <version> [flags]
```

**Usage Examples**
```bash
nacos-cli skill-release <skill-name> --version 0.0.2
nacos-cli skill-release <skill-name> --version 0.0.2 --update-latest=false

# Interactive mode
nacos> skill-release <skill-name> --version 0.0.2
```

> **Note**: If `skill-release` fails with `HTTP 400 parameter validate error` immediately after `skill-review`, the async review pipeline most likely hasn't marked the version as `reviewed` yet. The CLI prints a hint suggesting to wait a few seconds, re-check the status via `skill-describe`, and retry once `STATUS=reviewed`.

#### 5.1.7. Publish Skill (deprecated)

`skill-publish` is kept as a backward-compatible shortcut that runs `upload` + `review` in sequence and prints a deprecation warning. It will be removed in a future release — prefer the explicit lifecycle commands above.

```bash
# Legacy shortcut (deprecated)
nacos-cli skill-publish /path/to/skill
nacos-cli skill-publish --all /path/to/skills/folder
```

#### 5.1.8. Real-time Skill Synchronization

Listen for skill changes in Nacos and automatically sync to the local directory. When a skill is updated in Nacos, local files are updated automatically.

> **Note**: `skill-sync` is only available in CLI mode and is not supported in interactive terminal mode.

**Command Format**
```bash
nacos-cli skill-sync <skill-name>... [flags]
```

**Parameters**

| Parameter | Short | Default | Description |
| --- | --- | --- | --- |
| --all |  | false | Sync all skills |
| -o, --output | -o | ~/.skills | Output directory |

**Usage Examples**
```bash
# Sync a single skill
nacos-cli skill-sync <skill-name>

# Sync multiple skills
nacos-cli skill-sync <skill-name-1> <skill-name-2>

# Sync all skills
nacos-cli skill-sync --all

# Press Ctrl+C to stop syncing
```

### 5.2. AgentSpec Management ✅

AgentSpecs follow the same three-stage lifecycle as Skills:
`upload` (editing) → `review` (reviewing → reviewed) → `release` (online).

#### 5.2.1. List AgentSpecs

```bash
# CLI mode (pretty output by default)
nacos-cli agentspec-list

# With filters
nacos-cli agentspec-list --name <agentspec-name> --page 1 --size 20

# Machine-readable JSON output
nacos-cli agentspec-list --output json

# Interactive mode
nacos> agentspec-list
nacos> agentspec-list --name <agentspec-name> --page 2
nacos> agentspec-list --output json
```

#### 5.2.2. Describe AgentSpec

Show detail and version history (latest / editing / reviewing / online, plus per-version status):

```bash
nacos-cli agentspec-describe <agentspec-name>
nacos-cli agentspec-describe <agentspec-name> --output json

# Interactive mode
nacos> agentspec-describe <agentspec-name>
```

#### 5.2.3. Get/Download AgentSpec

Download an AgentSpec to a local directory (default: `~/.agentspecs`):

```bash
# CLI mode
nacos-cli agentspec-get <agentspec-name>
nacos-cli agentspec-get <agentspec-name> -o /custom/path

# Download a specific version
nacos-cli agentspec-get <agentspec-name> --version v1

# Download by route label
nacos-cli agentspec-get <agentspec-name> --label latest

# Download multiple AgentSpecs
nacos-cli agentspec-get spec1 spec2 spec3

# Interactive mode
nacos> agentspec-get <agentspec-name>
```

#### 5.2.4. Upload AgentSpec

Upload an AgentSpec from a local directory (creates or updates the `editing` version):

```bash
# Upload a single AgentSpec
nacos-cli agentspec-upload /path/to/agentspec

# Batch upload all AgentSpecs in a directory
nacos-cli agentspec-upload --all /path/to/agentspecs/folder

# Interactive mode
nacos> agentspec-upload /path/to/agentspec
nacos> agentspec-upload --all /path/to/agentspecs
```

#### 5.2.5. Review AgentSpec

Submit the current `editing` version for review (editing → reviewing). The server-side review pipeline runs asynchronously and eventually marks the version as `reviewed`.

```bash
nacos-cli agentspec-review <agentspec-name>

# Interactive mode
nacos> agentspec-review <agentspec-name>
```

#### 5.2.6. Release AgentSpec

Publish an approved (`reviewed`) version online:

```bash
nacos-cli agentspec-release <agentspec-name> --version 0.0.2
nacos-cli agentspec-release <agentspec-name> --version 0.0.2 --update-latest=false

# Interactive mode
nacos> agentspec-release <agentspec-name> --version 0.0.2
```

> **Note**: If `agentspec-release` fails with `HTTP 400 parameter validate error` immediately after `agentspec-review`, the async review pipeline most likely hasn't marked the version as `reviewed` yet. The CLI prints a hint suggesting to wait a few seconds, re-check the status via `agentspec-describe`, and retry once `STATUS=reviewed`.

#### 5.2.7. Publish AgentSpec (deprecated)

`agentspec-publish` is kept as a backward-compatible shortcut that runs `upload` + `review` in sequence and prints a deprecation warning. It will be removed in a future release — prefer the explicit lifecycle commands above.

```bash
# Legacy shortcut (deprecated)
nacos-cli agentspec-publish /path/to/agentspec
nacos-cli agentspec-publish --all /path/to/agentspecs/folder
```

### 5.3. Configuration Management ✅

Provides configuration list queries and configuration content retrieval for the configuration center.

#### 5.3.1. List Configurations

Get the configuration list from the Nacos configuration center, supporting filtering by dataId and group.

**Command Format**
```bash
nacos-cli config-list [flags]
```

**Parameters**

| Parameter | Short | Default | Description |
| --- | --- | --- | --- |
| --data-id |  |  | Configuration ID (supports fuzzy search with * wildcard) |
| --group |  |  | Configuration group (supports fuzzy search) |
| --page |  | 1 | Page number |
| --size |  | 10 | Page size |

**Usage Examples**
```bash
# List all configurations
nacos-cli config-list

# Filter by dataId
nacos-cli config-list --data-id "application*"

# Paginated query
nacos-cli config-list --page 2 --size 20

# Interactive mode
nacos> config-list
nacos> config-list --data-id <dataId> --page 2
```

#### 5.3.2. Get Configuration

Get the configuration content for a specified dataId and group.

**Command Format**
```bash
nacos-cli config-get <dataId> <group> [flags]
```

**Parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| dataId | string | Configuration ID, required |
| group | string | Configuration group, required |

**Usage Examples**
```bash
# CLI mode
nacos-cli config-get <dataId> <group>

# Interactive mode
nacos> config-get <dataId> <group>
```

### 5.4. Service Registration (Naming) ❌

Service registration and discovery features are not yet implemented, including:

- `service-list` - List services
- `service-get` - Get service details
- `instance-list` - List service instances
- `instance-register` - Register service instance
- `instance-deregister` - Deregister service instance

### 5.5. Distributed Lock (Lock) ❌

Distributed lock features are not yet implemented, including:

- `lock-acquire` - Acquire distributed lock
- `lock-release` - Release distributed lock

### 5.6. Contribution Guide

We welcome community developers to participate in building Nacos CLI! Feel free to submit Issues or Pull Requests on [GitHub](https://github.com/nacos-group/nacos-cli).

## 6. Interactive Terminal Commands
In interactive terminal mode, in addition to the commands above, the following terminal-specific commands are also supported:

| Command | Description |
| --- | --- |
| `help` | Show all available commands |
| `server` | Show current connected server information |
| `ns` | Show current namespace |
| `ns <namespace>` | Switch to specified namespace |
| `clear` | Clear screen |
| `quit` or `exit` | Exit terminal |


Usage examples:

```plain
nacos> help           # Show help
nacos> server         # View server information
nacos> ns             # View current namespace
nacos> ns <namespace> # Switch namespace
nacos> clear          # Clear screen
nacos> quit           # Exit
```

## 7. Global Parameters
The following parameters apply to all commands:

| Parameter | Short | Default | Description |
| --- | --- | --- | --- |
| --host |  | `market.hiclaw.io` when both `--host` and `--port` are omitted; `127.0.0.1` when only `--port` is provided | Nacos server address |
| --port |  | `80` when both `--host` and `--port` are omitted; `8848` when only `--host` is provided | Nacos server port |
| --server | -s | `market.hiclaw.io:80` when no host/port is provided | Nacos server address (deprecated, use `--host` and `--port`) |
| --profile |  | default | Profile name; loads `~/.nacos-cli/<profile>.conf` |
| --config | -c |  | Explicit configuration file path; overrides `--profile` |
| --username | -u |  | Username (authType=nacos) |
| --password | -p |  | Password (authType=nacos) |
| --auth-type |  |  | Authentication type: none / nacos / aliyun / sts-hiclaw |
| --access-key |  |  | AccessKey (authType=aliyun) |
| --secret-key |  |  | SecretKey (authType=aliyun) |
| --security-token |  |  | STS SecurityToken (legacy) |
| --namespace | -n | (empty/public) | Namespace ID |
| --verbose |  | false | Print debug output |
| --help | -h |  | Show help information |


## 8. API Compatibility
Nacos CLI supports both Nacos v1 and v3 APIs:

+ **Nacos 3.x**: Preferentially uses v3 API, automatically handles Bearer Token authentication
+ **Nacos 2.x**: Falls back to v1 API

The CLI automatically detects the server version and selects the appropriate API version without manual configuration.

## 9. FAQ
### 9.1. Login Failed
**Problem**: "Login failed" error when executing commands

**Solution**:

1. Verify the Nacos server address and port are correct
2. Verify the username and password are correct
3. Verify whether authentication is enabled on the Nacos server

### 9.2. Connection Timeout
**Problem**: Command execution timeout

**Solution**:

1. Check if the network connection is working properly
2. Verify the Nacos server is running normally
3. Check firewall settings

### 9.3. Namespace Not Found
**Problem**: Namespace not found error

**Solution**:

1. Use the `ns` command to check the current namespace
2. Confirm the namespace ID is correct in the Nacos console
3. Note: The namespace ID is not the namespace name

### 9.4. HTTP 400 parameter validate error on release
**Problem**: Running `*-release` immediately after `skill-review` / `agentspec-review` fails with `HTTP 400 parameter validate error`

**Solution**:

1. The server-side review pipeline runs asynchronously and may not have updated the version status to `reviewed` yet
2. Wait a few seconds and re-check the status via `skill-describe` / `agentspec-describe`
3. Retry `*-release` once `STATUS=reviewed`

## 10. Related Resources
+ [Nacos GitHub](https://github.com/alibaba/nacos)
+ [Nacos CLI GitHub](https://github.com/nacos-group/nacos-cli)
+ [Nacos Official Website](https://nacos.io/)
+ [Nacos Quick Start](../../quickstart/quick-start.mdx)
