---
title: Nacos CLI 使用指南
keywords: [ Nacos, Nacos CLI ]
description: Nacos CLI 使用指南，介绍如何安装和使用 Nacos CLI 进行配置管理、AI 技能（Skill）和 AgentSpec 的全生命周期管理，以及交互式终端操作。
sidebar:
  order: 14
---

# Nacos CLI 使用指南

Nacos CLI 是一个面向 Nacos 配置中心的命令行工具，支持配置管理、AI 技能（Skill）和 AgentSpec 的全生命周期管理（upload → review → release），以及交互式终端模式。

## 1. 环境准备
### 1.1. 运行环境要求
1. 64 位操作系统，支持 Linux/Unix/Mac/Windows
2. Nacos Server 2.x 或 3.x

### 1.2. 确保 Nacos Server 已启动
在使用 Nacos CLI 之前，请确保您的 Nacos 服务器已经正常运行。如果还没有安装 Nacos，请参考 [Nacos 快速开始](../../quickstart/quick-start.mdx) 进行安装和启动。

## 2. 安装 Nacos CLI
### 2.1. 通过官方安装脚本安装（推荐）
这是最简单的安装方式，安装后配置 Nacos 地址即可使用。

**Linux / macOS：**

```bash
curl -fsSL https://nacos.io/nacos-installer.sh | bash -s -- --cli
```

**Windows（PowerShell）：**

```powershell
iwr -UseBasicParsing https://nacos.io/nacos-installer.ps1 -OutFile $env:TEMP\nacos-installer.ps1; & $env:TEMP\nacos-installer.ps1 -cli; Remove-Item $env:TEMP\nacos-installer.ps1
```

### 2.2. 通过 npm 安装
如果已有 Node.js 环境，可以通过 npm 安装：

```bash
# npm 全局安装
npm install -g @nacos-group/cli
nacos-cli --help

# 或使用 npx 免安装直接使用
npx @nacos-group/cli --help
```

### 2.3. 验证安装
```bash
nacos-cli --help
```

## 3. 认证配置
Nacos CLI 支持以下几种认证方式：

- `none`：无认证
- `nacos`：用户名 / 密码
- `aliyun`：阿里云 AccessKey / SecretKey（适用于阿里云 MSE Nacos）
- `sts-hiclaw`：STS 临时凭证（通过 `HICLAW_CONTROLLER_URL` 和 `HICLAW_AUTH_TOKEN_FILE` 环境变量动态获取）

### 3.1. Profile 配置（推荐）
Nacos CLI 将不同环境的连接信息保存为 profile，每个 profile 对应 `~/.nacos-cli/<profile>.conf` 一个 YAML 文件。默认 profile 名称为 `default`，对应 `~/.nacos-cli/default.conf`。

> **首次使用**：直接执行 `nacos-cli` 即可。CLI 检测不到 profile 时会自动进入交互式向导，引导你填写 host、port、authType、用户名、密码等字段，并将结果保存到 `~/.nacos-cli/default.conf`，下次再启动会直接复用。

#### 3.1.1. 创建/编辑 profile
通过 `nacos-cli profile edit` 进入交互式编辑，会显示当前值作为默认提示，回车保留原值。

```bash
# 创建/编辑 default profile（保存到 ~/.nacos-cli/default.conf）
nacos-cli profile edit

# 创建/编辑 dev profile（保存到 ~/.nacos-cli/dev.conf）
nacos-cli profile edit dev

# 创建/编辑 prod profile
nacos-cli profile edit prod
```

编辑完成后，CLI 会询问是否立即登录并进入交互式终端，回车默认登录。

#### 3.1.2. 查看 profile
```bash
# 查看 default profile
nacos-cli profile show

# 查看 dev profile
nacos-cli profile show dev
```

输出示例（密码/SecretKey 默认掩码显示）：
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

#### 3.1.3. 切换 profile
默认加载 `default` profile，可通过 `--profile` 参数切换：

```bash
# 使用 default profile（等价于不传 --profile）
nacos-cli skill-list

# 使用 dev profile（加载 ~/.nacos-cli/dev.conf）
nacos-cli --profile dev skill-list

# 使用 prod profile
nacos-cli --profile prod config-list
```

#### 3.1.4. 配置文件格式
profile 文件采用 YAML 格式（注意：字段使用 camelCase）：

```yaml
# Nacos 服务器地址
host: <your_nacos_host>

# Nacos 服务器端口
port: <your_nacos_port>

# 认证方式：none | nacos | aliyun | sts-hiclaw
authType: nacos

# Nacos 认证（authType=nacos 时使用）
username: <your_username>
password: <your_password>

# 阿里云认证（authType=aliyun 时使用）
accessKey: ""
secretKey: ""

# STS SecurityToken（旧版兼容）
securityToken: ""

# 命名空间 ID（可选，留空使用 public）
namespace: ""
```

> **注意**：`authType=sts-hiclaw` 时无需在配置文件中填写凭证，CLI 会从环境变量 `HICLAW_CONTROLLER_URL` 与 `HICLAW_AUTH_TOKEN_FILE` 中动态读取。

### 3.2. 显式指定配置文件（`--config`）
也可以通过 `--config` 加载任意路径的配置文件，常用于把配置签入项目仓库或脚本环境：

```bash
nacos-cli --config /path/to/custom.conf skill-list
```

`--config` 的优先级高于 profile，指定后将忽略 `--profile` 与 `~/.nacos-cli/` 下的 profile。

### 3.3. 命令行参数
也可以完全通过命令行参数提供，不依赖任何配置文件：

#### 3.3.1. Nacos 认证（用户名/密码）
```bash
nacos-cli --host <host> --port <port> -u <username> -p <password>
```

#### 3.3.2. 阿里云认证（AccessKey/SecretKey）
```bash
nacos-cli --host <host> --port <port> --auth-type aliyun --access-key <your_ak> --secret-key <your_sk>
```

#### 3.3.3. STS（sts-hiclaw）认证
```bash
export HICLAW_CONTROLLER_URL=https://<controller-host>
export HICLAW_AUTH_TOKEN_FILE=/path/to/token

nacos-cli --host <host> --port <port> --auth-type sts-hiclaw
```

### 3.4. 环境变量
也可以通过环境变量提供 Nacos 连接信息：

```bash
export NACOS_HOST=127.0.0.1
export NACOS_PORT=8848
export NACOS_NAMESPACE=xxx
export NACOS_AUTH_TYPE=nacos
```

`sts-hiclaw` 还需要：

```bash
export HICLAW_CONTROLLER_URL=https://<controller-host>
export HICLAW_AUTH_TOKEN_FILE=/path/to/token
```

### 3.5. 配置优先级
配置值按以下优先级应用（从高到低）：

1. **命令行参数**（最高优先级）
2. **`--config` 显式指定的配置文件**
3. **`--profile` 指定的 profile（默认 `default`）**
4. **环境变量**（`NACOS_HOST` / `NACOS_PORT` / `NACOS_NAMESPACE` / `NACOS_AUTH_TYPE`）
5. **默认值**（最低优先级）

示例：

```bash
# 使用 dev profile，但通过命令行覆盖 host
nacos-cli --profile dev --host 10.0.0.1 skill-list

# 显式指定配置文件
nacos-cli --config /path/to/custom.conf skill-list

# 使用环境变量（命令行、--config、profile 均未提供时）
NACOS_HOST=127.0.0.1 NACOS_PORT=8848 NACOS_NAMESPACE=xxx nacos-cli skill-list

# 不传任何参数时，自动进入交互向导生成 default profile，并连接其中的服务器
nacos-cli

# 仅传 --host 时，端口默认 8848
nacos-cli --host 127.0.0.1

# 仅传 --port 时，host 默认 127.0.0.1
nacos-cli --port 8849
```

## 4. 快速开始
> **提示**：以下示例假设已通过 `nacos-cli profile edit` 配置好默认 profile，详见 [3.1 Profile 配置](#31-profile-配置推荐)。
>

### 4.1. CLI 模式
直接在命令行执行命令：

```bash
# 列出所有技能
nacos-cli skill-list

# 获取技能
nacos-cli skill-get <skill-name>

# 上传技能
nacos-cli skill-upload /path/to/skill
```

### 4.2. 交互式终端模式
启动交互式会话：

```bash
nacos-cli
```

进入交互模式后，可以执行以下命令：

```plain
nacos> skill-list
nacos> skill-get <skill-name>
nacos> config-list
nacos> help
```

## 5. 功能模块

### 5.1. AI 技能（Skill）管理 ✅

Skill 遵循三阶段生命周期，与服务端保持一致：
`upload`（editing）→ `review`（reviewing → reviewed）→ `release`（online）。

Nacos CLI 提供 Skill 的完整生命周期管理：列出、查看详情、下载、上传、提交评审、发布上线，以及实时同步。

#### 5.1.1. 列出技能
获取 Nacos 中存储的 AI 技能列表，默认显示技能描述（截断为 50 字符），支持脚本友好的 JSON 输出。

**命令格式**
```bash
nacos-cli skill-list [flags]
```

**参数说明**

| 参数 | 简写 | 默认值 | 描述 |
| --- | --- | --- | --- |
| --name |  |  | 按技能名称过滤 |
| --page |  | 1 | 页码 |
| --size |  | 10 | 每页数量 |
| --output |  | pretty | 输出格式：`pretty`(默认) 或 `json`(便于脚本解析) |

**使用示例**
```bash
# 列出所有技能（默认显示描述）
nacos-cli skill-list

# 按名称过滤
nacos-cli skill-list --name <skill-name> --page 1 --size 20

# 脚本友好的 JSON 输出
nacos-cli skill-list --output json

# 交互模式
nacos> skill-list
nacos> skill-list --name <skill-name> --page 2
nacos> skill-list --output json
```

#### 5.1.2. 查看技能详情（describe）
查看指定 Skill 的详情和版本历史（latest / editing / reviewing / online，以及每个版本的状态）。

**命令格式**
```bash
nacos-cli skill-describe <skill-name> [flags]
```

**使用示例**
```bash
nacos-cli skill-describe <skill-name>
nacos-cli skill-describe <skill-name> --output json

# 交互模式
nacos> skill-describe <skill-name>
```

#### 5.1.3. 获取/下载技能

从 Nacos 下载技能到本地目录，包括技能元数据（SKILL.md）和所有资源文件。

**命令格式**
```bash
nacos-cli skill-get <skill-name> [flags]
```

**参数说明**

| 参数 | 简写 | 默认值 | 描述 |
| --- | --- | --- | --- |
| -o, --output | -o | ~/.skills | 输出目录 |

**使用示例**
```bash
# 下载到默认目录 (~/.skills)
nacos-cli skill-get <skill-name>

# 下载到指定目录
nacos-cli skill-get <skill-name> -o /custom/path

# 交互模式
nacos> skill-get <skill-name>
```

**技能目录结构**
下载后的技能目录结构如下：

```plain
~/.skills/<skill-name>/
├── SKILL.md          # 技能元数据和指令
├── prompts/          # 提示词资源
│   └── main.md
└── scripts/          # 脚本资源
    └── init_skill.py
```

#### 5.1.4. 上传技能

将本地技能上传到 Nacos（创建或更新 `editing` 版本），支持单个技能或批量上传。

**命令格式**
```bash
nacos-cli skill-upload <path> [flags]
```

**参数说明**

| 参数 | 默认值 | 描述 |
| --- | --- | --- |
| --all | false | 批量上传目录下所有技能 |

**使用示例**
```bash
# 上传单个技能
nacos-cli skill-upload /path/to/skill

# 批量上传
nacos-cli skill-upload --all /path/to/skills/folder

# 交互模式
nacos> skill-upload /path/to/skill
nacos> skill-upload --all /path/to/skills
```

#### 5.1.5. 提交技能评审（review）

将当前 `editing` 版本提交进入评审流程（editing → reviewing）。服务端的评审管线是异步执行的，最终会将版本标记为 `reviewed`。

**命令格式**
```bash
nacos-cli skill-review <skill-name>
```

**使用示例**
```bash
nacos-cli skill-review <skill-name>

# 交互模式
nacos> skill-review <skill-name>
```

#### 5.1.6. 发布技能（release）

将已评审通过（reviewed）的版本发布上线。

**命令格式**
```bash
nacos-cli skill-release <skill-name> --version <version> [flags]
```

**使用示例**
```bash
nacos-cli skill-release <skill-name> --version 0.0.2
nacos-cli skill-release <skill-name> --version 0.0.2 --update-latest=false

# 交互模式
nacos> skill-release <skill-name> --version 0.0.2
```

> **注意**：如果在 `skill-review` 后立即执行 `skill-release` 出现 `HTTP 400 parameter validate error`，通常是异步评审管线尚未将版本标记为 `reviewed`。CLI 会打印提示，建议等待几秒后通过 `skill-describe` 重新查看状态，等到 `STATUS=reviewed` 后再重试。

#### 5.1.7. 发布技能（publish，已废弃）

`skill-publish` 是一个向后兼容的快捷命令，会依次执行 `upload` + `review`，并打印废弃提示。后续版本将移除，建议改用上述独立的生命周期命令。

```bash
# 旧版快捷命令（已废弃）
nacos-cli skill-publish /path/to/skill
nacos-cli skill-publish --all /path/to/skills/folder
```

#### 5.1.8. 实时同步技能

监听 Nacos 中技能的变更，自动同步到本地目录。当技能在 Nacos 中更新时，本地文件会自动更新。

> **注意**：`skill-sync` 仅在 CLI 模式下可用，不支持交互终端模式。

**命令格式**
```bash
nacos-cli skill-sync <skill-name>... [flags]
```

**参数说明**

| 参数 | 简写 | 默认值 | 描述 |
| --- | --- | --- | --- |
| --all |  | false | 同步所有技能 |
| -o, --output | -o | ~/.skills | 输出目录 |

**使用示例**
```bash
# 同步单个技能
nacos-cli skill-sync <skill-name>

# 同步多个技能
nacos-cli skill-sync <skill-name-1> <skill-name-2>

# 同步所有技能
nacos-cli skill-sync --all

# 按 Ctrl+C 停止同步
```

### 5.2. AgentSpec 管理 ✅

AgentSpec 遵循与 Skill 相同的三阶段生命周期：
`upload`（editing）→ `review`（reviewing → reviewed）→ `release`（online）。

#### 5.2.1. 列出 AgentSpec

```bash
# CLI 模式（默认 pretty 输出）
nacos-cli agentspec-list

# 带过滤条件
nacos-cli agentspec-list --name <agentspec-name> --page 1 --size 20

# 脚本友好的 JSON 输出
nacos-cli agentspec-list --output json

# 交互模式
nacos> agentspec-list
nacos> agentspec-list --name <agentspec-name> --page 2
nacos> agentspec-list --output json
```

#### 5.2.2. 查看 AgentSpec 详情

显示详情和版本历史（latest / editing / reviewing / online，以及每个版本的状态）：

```bash
nacos-cli agentspec-describe <agentspec-name>
nacos-cli agentspec-describe <agentspec-name> --output json

# 交互模式
nacos> agentspec-describe <agentspec-name>
```

#### 5.2.3. 获取/下载 AgentSpec

将 AgentSpec 下载到本地目录（默认：`~/.agentspecs`）：

```bash
# CLI 模式
nacos-cli agentspec-get <agentspec-name>
nacos-cli agentspec-get <agentspec-name> -o /custom/path

# 下载指定版本
nacos-cli agentspec-get <agentspec-name> --version v1

# 按路由标签下载
nacos-cli agentspec-get <agentspec-name> --label latest

# 批量下载多个 AgentSpec
nacos-cli agentspec-get spec1 spec2 spec3

# 交互模式
nacos> agentspec-get <agentspec-name>
```

#### 5.2.4. 上传 AgentSpec

从本地目录上传 AgentSpec（创建或更新 `editing` 版本）：

```bash
# 上传单个 AgentSpec
nacos-cli agentspec-upload /path/to/agentspec

# 批量上传目录下所有 AgentSpec
nacos-cli agentspec-upload --all /path/to/agentspecs/folder

# 交互模式
nacos> agentspec-upload /path/to/agentspec
nacos> agentspec-upload --all /path/to/agentspecs
```

#### 5.2.5. 提交 AgentSpec 评审

将当前 `editing` 版本提交进入评审流程（editing → reviewing），服务端评审管线异步执行，最终会将版本标记为 `reviewed`。

```bash
nacos-cli agentspec-review <agentspec-name>

# 交互模式
nacos> agentspec-review <agentspec-name>
```

#### 5.2.6. 发布 AgentSpec

将已评审通过（reviewed）的版本发布上线：

```bash
nacos-cli agentspec-release <agentspec-name> --version 0.0.2
nacos-cli agentspec-release <agentspec-name> --version 0.0.2 --update-latest=false

# 交互模式
nacos> agentspec-release <agentspec-name> --version 0.0.2
```

> **注意**：如果在 `agentspec-review` 后立即执行 `agentspec-release` 出现 `HTTP 400 parameter validate error`，通常是异步评审管线尚未将版本标记为 `reviewed`。CLI 会打印提示，建议等待几秒后通过 `agentspec-describe` 重新查看状态，等到 `STATUS=reviewed` 后再重试。

#### 5.2.7. 发布 AgentSpec（publish，已废弃）

`agentspec-publish` 是一个向后兼容的快捷命令，会依次执行 `upload` + `review`，并打印废弃提示。后续版本将移除，建议改用上述独立的生命周期命令。

```bash
# 旧版快捷命令（已废弃）
nacos-cli agentspec-publish /path/to/agentspec
nacos-cli agentspec-publish --all /path/to/agentspecs/folder
```

### 5.3. 配置管理 ✅

提供配置中心的配置列表查询和配置内容获取功能。

#### 5.3.1. 列出配置

获取 Nacos 配置中心的配置列表，支持按 dataId、group 进行过滤。

**命令格式**
```bash
nacos-cli config-list [flags]
```

**参数说明**

| 参数 | 简写 | 默认值 | 描述 |
| --- | --- | --- | --- |
| --data-id |  |  | 配置 ID（支持模糊搜索，使用 * 通配符） |
| --group |  |  | 配置分组（支持模糊搜索） |
| --page |  | 1 | 页码 |
| --size |  | 10 | 每页数量 |

**使用示例**
```bash
# 列出所有配置
nacos-cli config-list

# 按 dataId 过滤
nacos-cli config-list --data-id "application*"

# 分页查询
nacos-cli config-list --page 2 --size 20

# 交互模式
nacos> config-list
nacos> config-list --data-id <dataId> --page 2
```

#### 5.3.2. 获取配置

获取指定 dataId 和 group 的配置内容。

**命令格式**
```bash
nacos-cli config-get <dataId> <group> [flags]
```

**参数说明**

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| dataId | string | 配置 ID，必填 |
| group | string | 配置分组，必填 |

**使用示例**
```bash
# CLI 模式
nacos-cli config-get <dataId> <group>

# 交互模式
nacos> config-get <dataId> <group>
```

### 5.4. 服务注册 (Naming) ❌

服务注册与发现功能尚未实现，包括：

- `service-list` - 列出服务
- `service-get` - 获取服务详情
- `instance-list` - 列出服务实例
- `instance-register` - 注册服务实例
- `instance-deregister` - 注销服务实例

### 5.5. 分布式锁 (Lock) ❌

分布式锁功能尚未实现，包括：

- `lock-acquire` - 获取分布式锁
- `lock-release` - 释放分布式锁

### 5.6. 贡献指南

我们欢迎社区开发者一起参与 Nacos CLI 的建设！欢迎通过 [GitHub](https://github.com/nacos-group/nacos-cli) 提交 Issue 或 Pull Request。

## 6. 交互终端命令
在交互终端模式下，除了上述命令外，还支持以下终端专用命令：

| 命令 | 描述 |
| --- | --- |
| `help` | 显示所有可用命令 |
| `server` | 显示当前连接的服务器信息 |
| `ns` | 显示当前命名空间 |
| `ns <namespace>` | 切换到指定命名空间 |
| `clear` | 清屏 |
| `quit` 或 `exit` | 退出终端 |


使用示例：

```plain
nacos> help           # 显示帮助
nacos> server         # 查看服务器信息
nacos> ns             # 查看当前命名空间
nacos> ns <namespace> # 切换命名空间
nacos> clear          # 清屏
nacos> quit           # 退出
```

## 7. 全局参数
以下参数适用于所有命令：

| 参数 | 简写 | 默认值 | 描述 |
| --- | --- | --- | --- |
| --host |  | 当 `--host` 与 `--port` 都未指定时为 `market.hiclaw.io`；仅指定 `--port` 时为 `127.0.0.1` | Nacos 服务器地址 |
| --port |  | 当 `--host` 与 `--port` 都未指定时为 `80`；仅指定 `--host` 时为 `8848` | Nacos 服务器端口 |
| --server | -s | 当未指定 host/port 时为 `market.hiclaw.io:80` | Nacos 服务器地址（已废弃，请使用 `--host` 与 `--port`） |
| --profile |  | default | profile 名称，加载 `~/.nacos-cli/<profile>.conf` |
| --config | -c |  | 显式指定配置文件路径，优先级高于 `--profile` |
| --username | -u |  | 用户名（authType=nacos） |
| --password | -p |  | 密码（authType=nacos） |
| --auth-type |  |  | 认证类型：none / nacos / aliyun / sts-hiclaw |
| --access-key |  |  | AccessKey（authType=aliyun） |
| --secret-key |  |  | SecretKey（authType=aliyun） |
| --security-token |  |  | STS SecurityToken（旧版兼容） |
| --namespace | -n | (空/public) | 命名空间 ID |
| --verbose |  | false | 打印调试信息 |
| --help | -h |  | 显示帮助信息 |


## 8. API 兼容性
Nacos CLI 同时支持 Nacos v1 和 v3 API：

+ **Nacos 3.x**：优先使用 v3 API，自动处理 Bearer Token 认证
+ **Nacos 2.x**：回退使用 v1 API

CLI 会自动检测服务器版本并选择合适的 API 版本，无需用户手动配置。

## 9. 常见问题
### 9.1. 登录失败
**问题**：执行命令时提示 "Login failed"

**解决方案**：

1. 确认 Nacos 服务器地址和端口是否正确
2. 确认用户名和密码是否正确
3. 确认 Nacos 服务器是否启用了认证

### 9.2. 连接超时
**问题**：命令执行超时

**解决方案**：

1. 检查网络连接是否正常
2. 确认 Nacos 服务器是否正常运行
3. 检查防火墙设置

### 9.3. 命名空间不存在
**问题**：提示命名空间不存在

**解决方案**：

1. 使用 `ns` 命令查看当前命名空间
2. 在 Nacos 控制台确认命名空间 ID 是否正确
3. 注意：命名空间 ID 不是命名空间名称

### 9.4. release 时返回 HTTP 400 parameter validate error
**问题**：刚执行 `skill-review` / `agentspec-review` 后立即执行 `*-release`，提示 `HTTP 400 parameter validate error`

**解决方案**：

1. 服务端评审管线异步执行，可能尚未将版本状态更新为 `reviewed`
2. 等待几秒后通过 `skill-describe` / `agentspec-describe` 重新查看状态
3. 当 `STATUS=reviewed` 后再重试 `*-release`

## 10. 相关资源
+ [Nacos GitHub](https://github.com/alibaba/nacos)
+ [Nacos CLI GitHub](https://github.com/nacos-group/nacos-cli)
+ [Nacos 官网](https://nacos.io/)
+ [Nacos 快速开始](../../quickstart/quick-start.mdx)
