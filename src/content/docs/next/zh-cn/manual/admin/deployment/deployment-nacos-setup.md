---
title: 使用nacos-setup一键部署
keywords: [Nacos, 部署, Nacos Setup]
description: Nacos Setup手册，介绍如何使用 nacos-setup 一键部署 Nacos 服务端。
sidebar:
  order: 5
---

# Nacos Setup 快速开始

这个快速开始手册是帮忙您快速在您的电脑上，使用 nacos-setup 一键部署 Nacos 服务端。

## 0. 为什么使用 nacos-setup

相比于手动下载、解压、配置 Nacos，nacos-setup 提供了更加便捷的自动化部署体验：

1. 自动下载并缓存 Nacos 安装包，避免重复下载。
2. 自动生成 JWT Token、Identity Key 等鉴权配置。
3. 智能检测端口冲突并分配可用端口。
4. 自动检测 Java 环境并验证版本兼容性。
5. 一条命令即可创建 Nacos 集群。

## 1. 预备环境准备

Nacos 依赖 Java 环境来运行，请确保是在以下版本环境中安装使用:

1. 64 bit OS，支持 Linux/Unix/Mac/Windows，推荐选用 Linux/Unix/Mac。
2. Nacos 3.x 需要 64 bit JDK 17+。
3. Nacos 2.4.x - 2.5.x 需要 64 bit JDK 8+。

> 注意：nacos-setup 会自动检测系统 Java 版本，并验证与目标 Nacos 版本的兼容性。

## 2. 安装 nacos-setup

### 2.1. 一键在线安装

- Linux/macOS

```bash
curl -fsSL https://nacos.io/nacos-installer.sh | sudo bash
```

- Windows（PowerShell）

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -Command "iwr -UseBasicParsing https://nacos.io/nacos-installer.ps1 | iex"
```

### 2.2. 验证安装

```bash
nacos-setup --help
```

## 3. 部署 Nacos

### 3.1. 单机模式

启动命令：

```bash
nacos-setup
```

> 注意：默认安装 Nacos 3.1.1 版本，使用内置 Derby 数据库。

指定版本和端口：

```bash
# 指定版本
nacos-setup -v 2.5.2

# 指定端口
nacos-setup -p 18848

# 后台运行
nacos-setup --detach

# 指定安装目录
nacos-setup -d /opt/nacos
```

### 3.2. 集群模式

集群模式可确保高可用，推荐在生产环境使用。

创建集群：

```bash
# 创建 3 节点集群（prod 为集群 ID）
nacos-setup -c prod

# 创建 5 节点集群
nacos-setup -c prod -n 5

# 指定版本
nacos-setup -c prod -v 3.1.1 -n 3
```

> 注意：使用内置 Derby 数据库时，nacos-setup 会自动采用增量启动策略以确保集群正确初始化：
> - Node 0 启动 → cluster.conf = [Node0] → 成为 leader，初始化数据
> - Node 1 启动 → cluster.conf = [Node0, Node1] → 作为 follower 加入
> - Node N 启动 → cluster.conf = [Node0...Node(N-1), NodeN] → 作为 follower 加入
> - 全部启动后 → 自动更新所有节点的 cluster.conf 包含全部成员
>
> 使用外部数据库时则无此限制。

集群管理：

```bash
# 加入现有集群（添加新节点）
nacos-setup -c prod --join

# 移除节点
nacos-setup -c prod --leave 2

# 清理并重建集群
nacos-setup -c prod --clean
```

节点手动管理：

```bash
# 查看集群状态
ls -la ~/ai-infra/nacos/cluster/CLUSTER_ID/

# 手动启动节点
cd ~/ai-infra/nacos/cluster/CLUSTER_ID/0-v3.1.1
bash bin/startup.sh

# 停止节点
bash bin/shutdown.sh
```

### 3.3. 配置外部数据库

默认使用内置 Derby 数据库。生产环境建议配置外部 MySQL/PostgreSQL。

运行配置向导：

```bash
nacos-setup --datasource-conf
```

按提示输入数据库信息：
- 数据库类型（MySQL/PostgreSQL）
- 主机地址
- 端口
- 数据库名
- 用户名和密码

配置完成后，后续部署会自动使用外部数据库：

```bash
# 单机模式
nacos-setup -v 3.1.1

# 集群模式
nacos-setup -c prod -n 3
```

> 注意：配置保存在 `~/ai-infra/nacos/default.properties`。

### 3.4. 端口冲突处理

脚本会自动检测端口冲突：

1. **检测到 Nacos 进程**：
   - 使用 `--kill` 参数：停止现有进程
   - 不使用 `--kill`：自动分配新端口

2. **检测到非 Nacos 进程**：
   - 自动分配可用端口

```bash
# 允许停止占用端口的 Nacos 进程
nacos-setup --kill

# 指定新端口
nacos-setup -p 18848
```

## 4. 验证 Nacos 服务是否启动成功

### 4.1. Nacos 控制台页面

打开任意浏览器，输入地址：

- Nacos 3.x: http://127.0.0.1:8080/index.html
- Nacos 2.x: http://127.0.0.1:8848/nacos/index.html

> 注意：首次打开会要求初始化管理员用户 nacos 的密码。密码会在安装时显示。

### 4.2. 服务注册

```bash
curl -X POST 'http://127.0.0.1:8848/nacos/v3/client/ns/instance?serviceName=quickstart.test.service&ip=127.0.0.1&port=8080'
```

### 4.3. 服务发现

```bash
curl -X GET 'http://127.0.0.1:8848/nacos/v3/client/ns/instance/list?serviceName=quickstart.test.service'
```

### 4.4. 发布配置

```bash
# 登陆获取 access token
curl -X POST 'http://127.0.0.1:8848/nacos/v3/auth/user/login' -d 'username=nacos' -d 'password=${your_password}'

# 使用 access token 创建配置
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/cs/config?dataId=quickstart.test.config&groupName=test&content=HelloWorld' -H "accessToken:${your_access_token}"
```

### 4.5. 获取配置

```bash
curl -X GET 'http://127.0.0.1:8848/nacos/v3/client/cs/config?dataId=quickstart.test.config&groupName=test'
```

## 5. 命令选项参考

### 5.1. 通用选项

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `-v, --version VERSION` | 指定 Nacos 版本 | 3.1.1 |
| `-p, --port PORT` | 服务主端口 | 8848 |
| `--no-start` | 安装后不自动启动 | - |
| `--adv` | 高级模式（交互式配置） | - |
| `--detach` | 后台模式运行 | - |
| `--datasource-conf` | 配置全局数据源 | - |
| `-h, --help` | 显示帮助信息 | - |

### 5.2. 单机模式选项

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `-d, --dir DIRECTORY` | 安装目录 | ~/ai-infra/nacos/standalone/nacos-VERSION |
| `--kill` | 允许停止占用端口的 Nacos 进程 | - |

### 5.3. 集群模式选项

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `-c, --cluster CLUSTER_ID` | 集群标识符（启用集群模式） | - |
| `-n, --nodes COUNT` | 集群节点数量 | 3 |
| `--clean` | 清理现有集群 | - |
| `--join` | 加入现有集群 | - |
| `--leave INDEX` | 从集群中移除指定节点 | - |

## 6. 端口说明

一个 Nacos 实例会使用多个端口：

| 端口 | 偏移量 | 说明 |
|------|--------|------|
| 8848 | 0 | Nacos HTTP API 端口 |
| 9848 | +1000 | 客户端 gRPC 端口 |
| 9849 | +1001 | 服务端 gRPC 端口 |
| 7848 | -1000 | Jraft 端口 |
| 8080 | 独立配置 | Nacos 控制台端口（Nacos 3.x） |

> 注意：nacos-setup 会自动处理端口冲突，如检测到端口被占用，会智能分配新端口或提示用户处理。

## 7. 目录结构

### 7.1. 系统安装位置

```
/usr/local/nacos-setup/
├── bin/
│   └── nacos-setup          # 主命令
└── lib/
    ├── cluster.sh           # 集群模式实现
    ├── standalone.sh        # 单机模式实现
    ├── common.sh            # 通用工具
    ├── port_manager.sh      # 端口管理
    ├── download.sh          # 下载管理
    ├── config_manager.sh    # 配置管理
    ├── java_manager.sh      # Java 环境管理
    └── process_manager.sh   # 进程管理
```

### 7.2. 用户数据目录

```
~/ai-infra/nacos/
├── standalone/              # 单机模式安装目录
│   └── nacos-VERSION/
├── cluster/                 # 集群模式安装目录
│   └── CLUSTER_ID/
│       ├── 0-vVERSION/     # 节点 0
│       ├── 1-vVERSION/     # 节点 1
│       └── cluster.conf     # 集群配置
└── default.properties       # 全局数据源配置
```

## 8. 卸载 nacos-setup

```bash
sudo bash nacos-installer.sh uninstall
# 或
sudo bash nacos-installer.sh -u
```

> 注意：卸载后用户数据 `~/ai-infra/nacos/` 不会被删除，需要手动清理。

## 常见问题

### Q: 安装后找不到 nacos-setup 命令？

确保 `/usr/local/bin` 在您的 PATH 中：

```bash
echo $PATH | grep /usr/local/bin

# 如果没有，添加到 ~/.bashrc 或 ~/.zshrc
export PATH="/usr/local/bin:$PATH"
```

### Q: Java 版本不兼容怎么办？

根据要安装的 Nacos 版本，安装对应的 Java：

```bash
export JAVA_HOME=/path/to/java
export PATH=$JAVA_HOME/bin:$PATH
```

### Q: 端口被占用如何处理？

```bash
# 方式 1：使用 --kill 参数停止占用端口的 Nacos 进程
nacos-setup --kill

# 方式 2：指定新端口
nacos-setup -p 18848
```

### Q: 如何查看 Nacos 日志？

```bash
# 单机模式
tail -f ~/ai-infra/nacos/standalone/nacos-*/logs/start.out

# 集群模式
tail -f ~/ai-infra/nacos/cluster/CLUSTER_ID/*/logs/start.out
```

## 相关链接

- [Nacos 官网](https://nacos.io)
- [Nacos 快速开始](https://nacos.io/docs/latest/quickstart/quick-start/)
- [Nacos 部署手册](https://nacos.io/docs/latest/manual/admin/deployment/deployment-overview/)
- [Nacos GitHub](https://github.com/alibaba/nacos)
- [Nacos Setup GitHub](https://github.com/nacos-group/nacos-setup)
