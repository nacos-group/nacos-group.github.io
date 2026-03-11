---
title: Nacos CLI User Guide
keywords: [ Nacos, Nacos CLI ]
description: Nacos CLI User Guide, introducing how to install and use Nacos CLI for configuration management, AI skill management, and interactive terminal operations.
sidebar:
  order: 14
---

# Nacos CLI User Guide

Nacos CLI is a command-line tool for Nacos configuration center, supporting configuration management, AI skill management, and interactive terminal mode.

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
curl -fsSL https://nacos.io/nacos-installer.sh | sudo bash -s -- --cli
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
Nacos CLI supports two authentication methods:

### 3.1. Configuration File (Recommended)
To avoid entering authentication information every time, using a configuration file is recommended.

```bash
# Create configuration file
cat > local.conf << EOF
host: <your_nacos_host>
port: <your_nacos_port>
username: <your_username>
password: <your_password>
namespace: ""
EOF

# Use configuration file
nacos-cli --config ./local.conf skill-list
```

**Configuration File Format** (YAML):

```yaml
# Nacos server address
host: <your_nacos_host>

# Nacos server port
port: <your_nacos_port>

# Authentication type: nacos or aliyun
auth_type: nacos

# Nacos authentication
username: <your_username>
password: <your_password>

# Alibaba Cloud authentication (optional)
access_key: ""
secret_key: ""

# Namespace ID (optional, leave empty for public)
namespace: ""
```

### 3.2. Command-Line Parameters
#### 3.2.1. Nacos Authentication (Username/Password)
```bash
nacos-cli --host <host> --port <port> -u <username> -p <password>
```

#### 3.2.2. Alibaba Cloud Authentication (AccessKey/SecretKey)
If you are using Alibaba Cloud MSE Nacos, you can use AK/SK for authentication:

```bash
nacos-cli --host <host> --port <port> --auth-type aliyun --access-key <your_ak> --secret-key <your_sk>
```

### 3.3. Configuration Priority
Configuration values are applied in the following priority order:

1. **Command-line parameters** (highest priority)
2. **Configuration file**
3. **Default values** (lowest priority)

Example:

```bash
# Use configuration file but override host
nacos-cli --config ./local.conf --host <another_host> skill-list

# Use configuration file entirely
nacos-cli --config ./local.conf skill-list
```

## 4. Quick Start
> **Tip**: The following examples assume a configuration file has been set up. See [3.1 Configuration File](#31-configuration-file-recommended) for details.
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

Nacos CLI provides complete AI skill lifecycle management, including listing, downloading, uploading, and real-time synchronization.

#### 5.1.1. List Skills
Get the list of AI skills stored in Nacos. By default, skill descriptions are displayed (truncated to 50 characters).

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

**Usage Examples**
```bash
# List all skills (with descriptions by default)
nacos-cli skill-list

# Filter by name
nacos-cli skill-list --name <skill-name>

# Interactive mode
nacos> skill-list
nacos> skill-list --name <skill-name> --page 2
```

#### 5.1.2. Get/Download Skills

Download skills from Nacos to a local directory, including skill metadata (SKILL.md) and all resource files.

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

#### 5.1.3. Upload Skills

Upload local skills to Nacos, supporting single or batch uploads.

**Command Format**
```bash
nacos-cli skill-upload <path> [flags]
```

**Parameters**

| Parameter | Default | Description |
| --- | --- | --- |
| --all | false | Batch upload all skills in the directory |

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

#### 5.1.4. Real-time Skill Synchronization

Listen for skill changes in Nacos and automatically sync to the local directory. When a skill is updated in Nacos, local files are automatically updated.

> **Note**: `skill-sync` is only available in CLI mode and does not support interactive terminal mode.

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

### 5.2. Configuration Management ✅

Provides configuration list queries and configuration content retrieval for the configuration center.

#### 5.2.1. List Configurations

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

#### 5.2.2. Get Configuration

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

### 5.3. Service Registration (Naming) ❌

Service registration and discovery features are not yet implemented, including:

- `service-list` - List services
- `service-get` - Get service details
- `instance-list` - List service instances
- `instance-register` - Register service instance
- `instance-deregister` - Deregister service instance

### 5.4. Distributed Lock (Lock) ❌

Distributed lock features are not yet implemented, including:

- `lock-acquire` - Acquire distributed lock
- `lock-release` - Release distributed lock

### 5.5. Contribution Guide

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

| Parameter | Short | Description |
| --- | --- | --- |
| --host |  | Nacos server address |
| --port |  | Nacos server port |
| --username | -u | Username (Nacos authentication) |
| --password | -p | Password (Nacos authentication) |
| --auth-type |  | Authentication type: nacos or aliyun |
| --access-key |  | AccessKey (Alibaba Cloud authentication) |
| --secret-key |  | SecretKey (Alibaba Cloud authentication) |
| --namespace | -n | Namespace ID |
| --config | -c | Configuration file path |
| --help | -h | Show help information |


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

## 10. Related Resources
+ [Nacos GitHub](https://github.com/alibaba/nacos)
+ [Nacos CLI GitHub](https://github.com/nacos-group/nacos-cli)
+ [Nacos Official Website](https://nacos.io/)
+ [Nacos Quick Start](../../quickstart/quick-start.mdx)
