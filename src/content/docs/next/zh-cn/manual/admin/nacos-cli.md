---
title: Nacos CLI 使用指南
keywords: [ Nacos, Nacos CLI ]
description: Nacos CLI 使用指南，介绍如何安装和使用 Nacos CLI 进行配置管理、AI 技能管理以及交互式终端操作。
sidebar:
  order: 14
---

# Nacos CLI 使用指南

Nacos CLI 是一个面向 Nacos 配置中心的命令行工具，支持配置管理、AI 技能管理以及交互式终端模式。

## 1. 环境准备
### 1.1. 运行环境要求
1. 64 位操作系统，支持 Linux/Unix/Mac/Windows
2. Nacos Server 2.x 或 3.x

### 1.2. 确保 Nacos Server 已启动
在使用 Nacos CLI 之前，请确保您的 Nacos 服务器已经正常运行。如果还没有安装 Nacos，请参考 [Nacos 快速开始](../../../quickstart/quick-start.mdx) 进行安装和启动。

## 2. 安装 Nacos CLI
### 2.1. 通过官方安装脚本安装（推荐）
这是最简单的安装方式，安装后配置 Nacos 地址即可使用。

**Linux / macOS：**

```bash
curl -fsSL https://nacos.io/nacos-installer.sh | sudo bash -s -- --cli
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
Nacos CLI 支持两种认证方式：

### 3.1. 配置文件（推荐）
为避免每次都输入认证信息，推荐使用配置文件。

```bash
# 创建配置文件
cat > local.conf << EOF
host: <your_nacos_host>
port: <your_nacos_port>
username: <your_username>
password: <your_password>
namespace: ""
EOF

# 使用配置文件
nacos-cli --config ./local.conf skill-list
```

**配置文件格式**（YAML）：

```yaml
# Nacos 服务器地址
host: <your_nacos_host>

# Nacos 服务器端口
port: <your_nacos_port>

# 认证方式：nacos 或 aliyun
auth_type: nacos

# Nacos 认证
username: <your_username>
password: <your_password>

# 阿里云认证（可选）
access_key: ""
secret_key: ""

# 命名空间 ID（可选，留空使用 public）
namespace: ""
```

### 3.2. 命令行参数
#### 3.2.1. Nacos 认证（用户名/密码）
```bash
nacos-cli --host <host> --port <port> -u <username> -p <password>
```

#### 3.2.2. 阿里云认证（AccessKey/SecretKey）
如果您使用的是阿里云 MSE Nacos，可以使用 AK/SK 进行认证：

```bash
nacos-cli --host <host> --port <port> --auth-type aliyun --access-key <your_ak> --secret-key <your_sk>
```

### 3.3. 配置优先级
配置值按以下优先级应用：

1. **命令行参数**（最高优先级）
2. **配置文件**
3. **默认值**（最低优先级）

示例：

```bash
# 使用配置文件，但覆盖 host
nacos-cli --config ./local.conf --host <another_host> skill-list

# 完全使用配置文件
nacos-cli --config ./local.conf skill-list
```

## 4. 快速开始
> **提示**：以下示例假设已配置好配置文件，详见 [3.1 配置文件](#31-配置文件推荐)。
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

### 5.1. AI 技能管理 ✅

Nacos CLI 提供了完整的 AI 技能生命周期管理功能，包括列出、下载、上传和实时同步。

#### 5.1.1. 列出技能
获取 Nacos 中存储的 AI 技能列表，默认显示技能描述（截断为 50 字符）。

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

**使用示例**
```bash
# 列出所有技能（默认显示描述）
nacos-cli skill-list

# 按名称过滤
nacos-cli skill-list --name <skill-name>

# 交互模式
nacos> skill-list
nacos> skill-list --name <skill-name> --page 2
```

#### 5.1.2. 获取/下载技能

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

#### 5.1.3. 上传技能

将本地技能上传到 Nacos，支持单个技能或批量上传。

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

#### 5.1.4. 实时同步技能

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

### 5.2. 配置管理 ✅

提供配置中心的配置列表查询和配置内容获取功能。

#### 5.2.1. 列出配置

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

#### 5.2.2. 获取配置

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

### 5.3. 服务注册 (Naming) ❌

服务注册与发现功能尚未实现，包括：

- `service-list` - 列出服务
- `service-get` - 获取服务详情
- `instance-list` - 列出服务实例
- `instance-register` - 注册服务实例
- `instance-deregister` - 注销服务实例

### 5.4. 分布式锁 (Lock) ❌

分布式锁功能尚未实现，包括：

- `lock-acquire` - 获取分布式锁
- `lock-release` - 释放分布式锁

### 5.5. 贡献指南

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

| 参数 | 简写 | 描述 |
| --- | --- | --- |
| --host |  | Nacos 服务器地址 |
| --port |  | Nacos 服务器端口 |
| --username | -u | 用户名（Nacos 认证） |
| --password | -p | 密码（Nacos 认证） |
| --auth-type |  | 认证类型：nacos 或 aliyun |
| --access-key |  | AccessKey（阿里云认证） |
| --secret-key |  | SecretKey（阿里云认证） |
| --namespace | -n | 命名空间 ID |
| --config | -c | 配置文件路径 |
| --help | -h | 显示帮助信息 |


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

## 10. 相关资源
+ [Nacos GitHub](https://github.com/alibaba/nacos)
+ [Nacos CLI GitHub](https://github.com/nacos-group/nacos-cli)
+ [Nacos 官网](https://nacos.io/)
+ [Nacos 快速开始](../../../quickstart/quick-start.mdx)