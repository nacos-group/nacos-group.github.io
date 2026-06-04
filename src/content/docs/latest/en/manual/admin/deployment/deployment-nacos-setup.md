---
title: One-Click Deployment with nacos-setup
keywords: [Nacos, Deployment, Nacos Setup]
description: Nacos Setup Guide, introducing how to use nacos-setup for one-click deployment of Nacos Server.
sidebar:
  order: 5
---

# One-Click Deployment with nacos-setup

This Quick Start Guide helps you quickly deploy Nacos Server on your machine using nacos-setup.

## 0. Why Use nacos-setup

Compared to manually downloading, extracting, and configuring Nacos, nacos-setup provides a more convenient automated deployment experience:

1. Automatically downloads and caches Nacos packages, avoiding repeated downloads.
2. Automatically generates JWT Token, Identity Key, and other authentication configurations.
3. Intelligently detects port conflicts and assigns available ports.
4. Automatically detects Java environment and verifies version compatibility.
5. Creates a Nacos cluster with a single command.

## 1. Prerequisites

Nacos relies on a Java environment to run. Please ensure you have the following environment set up:

1. 64-bit OS, supporting Linux/Unix/Mac/Windows. Linux/Unix/Mac is recommended.
2. Nacos 3.x requires 64-bit JDK 17+.
3. Nacos 2.4.x - 2.5.x requires 64-bit JDK 8+.

> Note: nacos-setup automatically detects the system Java version and verifies compatibility with the target Nacos version.

## 2. Install nacos-setup

### 2.1. One-Click Online Installation

- Linux/macOS

```bash
curl -fsSL https://nacos.io/nacos-installer.sh | sudo bash
```

- Windows (PowerShell)

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -Command "iwr -UseBasicParsing https://nacos.io/nacos-installer.ps1 | iex"
```

### 2.2. Verify Installation

```bash
nacos-setup --help
```

## 3. Deploy Nacos

### 3.1. Standalone Mode

Start command:

```bash
nacos-setup
```

> Note: By default, Nacos 3.1.1 is installed using the built-in Derby database.

Specify version and port:

```bash
# Specify version
nacos-setup -v 2.5.2

# Specify port
nacos-setup -p 18848

# Run in background
nacos-setup --detach

# Specify installation directory
nacos-setup -d /opt/nacos
```

### 3.2. Cluster Mode

Cluster mode ensures high availability and is recommended for production environments.

Create a cluster:

```bash
# Create a 3-node cluster (prod is the cluster ID)
nacos-setup -c prod

# Create a 5-node cluster
nacos-setup -c prod -n 5

# Specify version
nacos-setup -c prod -v 3.2.0 -n 3
```

> Note: When using the built-in Derby database, nacos-setup automatically adopts an incremental startup strategy to ensure correct cluster initialization:
> - Node 0 starts → cluster.conf = [Node0] → becomes leader, initializes data
> - Node 1 starts → cluster.conf = [Node0, Node1] → joins as follower
> - Node N starts → cluster.conf = [Node0...Node(N-1), NodeN] → joins as follower
> - After all nodes start → automatically updates all nodes' cluster.conf to include all members
>
> This limitation does not apply when using an external database.

Cluster management:

```bash
# Join an existing cluster (add new node)
nacos-setup -c prod --join

# Remove a node
nacos-setup -c prod --leave 2

# Clean and rebuild cluster
nacos-setup -c prod --clean
```

Manual node management:

```bash
# View cluster status
ls -la ~/ai-infra/nacos/cluster/CLUSTER_ID/

# Manually start a node
cd ~/ai-infra/nacos/cluster/CLUSTER_ID/0-v3.2.0
bash bin/startup.sh

# Stop a node
bash bin/shutdown.sh
```

### 3.3. Configure External Database

The built-in Derby database is used by default. For production environments, configure an external MySQL, PostgreSQL, or Oracle 12c or later database. For more database types and community plugins, see [Datasource Plugin](../../../plugin/datasource-plugin.md).

Run the configuration wizard:

```bash
nacos-setup --datasource-conf
```

Enter database information as prompted:
- Database type (MySQL/PostgreSQL/Oracle 12c+)
- Host address
- Port
- Database name
- Username and password

After configuration, subsequent deployments will automatically use the external database:

```bash
# Standalone mode
nacos-setup -v 3.2.0

# Cluster mode
nacos-setup -c prod -n 3
```

> Note: Configuration is saved in `~/ai-infra/nacos/default.properties`.

### 3.4. Port Conflict Handling

The script automatically detects port conflicts:

1. **Nacos process detected**:
   - With `--kill` parameter: stops the existing process
   - Without `--kill`: automatically assigns a new port

2. **Non-Nacos process detected**:
   - Automatically assigns an available port

```bash
# Allow stopping Nacos processes occupying ports
nacos-setup --kill

# Specify a new port
nacos-setup -p 18848
```

## 4. Verify Nacos Service Started Successfully

### 4.1. Nacos Console Page

Open any browser and enter the address:

- Nacos 3.x: http://127.0.0.1:8080
- Nacos 2.x: http://127.0.0.1:8848/nacos/index.html

> Note: The first time you open it, you will be asked to initialize the password for the admin user nacos. The password will be displayed during installation.

### 4.2. Service Registration

```bash
curl -X POST 'http://127.0.0.1:8848/nacos/v3/client/ns/instance?serviceName=quickstart.test.service&ip=127.0.0.1&port=8080'
```

### 4.3. Service Discovery

```bash
curl -X GET 'http://127.0.0.1:8848/nacos/v3/client/ns/instance/list?serviceName=quickstart.test.service'
```

### 4.4. Publish Configuration

```bash
# Login to obtain access token
curl -X POST 'http://127.0.0.1:8848/nacos/v3/auth/user/login' -d 'username=nacos' -d 'password=${your_password}'

# Use access token to create configuration
curl -X POST 'http://127.0.0.1:8848/nacos/v3/admin/cs/config?dataId=quickstart.test.config&groupName=test&content=HelloWorld' -H "accessToken:${your_access_token}"
```

### 4.5. Get Configuration

```bash
curl -X GET 'http://127.0.0.1:8848/nacos/v3/client/cs/config?dataId=quickstart.test.config&groupName=test'
```

## 5. Command Options Reference

### 5.1. General Options

| Option | Description | Default |
|------|------|--------|
| `-v, --version VERSION` | Specify Nacos version | 3.2.0 |
| `-p, --port PORT` | Service main port | 8848 |
| `--no-start` | Do not start automatically after installation | - |
| `--adv` | Advanced mode (interactive configuration) | - |
| `--detach` | Run in background mode | - |
| `--datasource-conf` | Configure global datasource | - |
| `-h, --help` | Show help information | - |

### 5.2. Standalone Mode Options

| Option | Description | Default |
|------|------|--------|
| `-d, --dir DIRECTORY` | Installation directory | ~/ai-infra/nacos/standalone/nacos-VERSION |
| `--kill` | Allow stopping Nacos processes occupying ports | - |

### 5.3. Cluster Mode Options

| Option | Description | Default |
|------|------|--------|
| `-c, --cluster CLUSTER_ID` | Cluster identifier (enables cluster mode) | - |
| `-n, --nodes COUNT` | Number of cluster nodes | 3 |
| `--clean` | Clean existing cluster | - |
| `--join` | Join existing cluster | - |
| `--leave INDEX` | Remove specified node from cluster | - |

## 6. Port Description

A Nacos instance uses multiple ports:

| Port | Offset | Description |
|------|--------|------|
| 8848 | 0 | Nacos HTTP API port |
| 9848 | +1000 | Client gRPC port |
| 9849 | +1001 | Server gRPC port |
| 7848 | -1000 | Jraft port |
| 8080 | Independent | Nacos Console port (Nacos 3.x) |

> Note: nacos-setup automatically handles port conflicts. If a port is occupied, it will intelligently assign a new port or prompt the user.

## 7. Directory Structure

### 7.1. System Installation Location

```
/usr/local/nacos-setup/
├── bin/
│   └── nacos-setup          # Main command
└── lib/
    ├── cluster.sh           # Cluster mode implementation
    ├── standalone.sh        # Standalone mode implementation
    ├── common.sh            # Common utilities
    ├── port_manager.sh      # Port management
    ├── download.sh          # Download management
    ├── config_manager.sh    # Configuration management
    ├── java_manager.sh      # Java environment management
    └── process_manager.sh   # Process management
```

### 7.2. User Data Directory

```
~/ai-infra/nacos/
├── standalone/              # Standalone mode installation directory
│   └── nacos-VERSION/
├── cluster/                 # Cluster mode installation directory
│   └── CLUSTER_ID/
│       ├── 0-vVERSION/     # Node 0
│       ├── 1-vVERSION/     # Node 1
│       └── cluster.conf     # Cluster configuration
└── default.properties       # Global datasource configuration
```

## 8. Uninstall nacos-setup

```bash
sudo bash nacos-installer.sh uninstall
# or
sudo bash nacos-installer.sh -u
```

> Note: User data at `~/ai-infra/nacos/` will not be deleted after uninstallation and needs to be cleaned up manually.

## FAQ

### Q: Cannot find nacos-setup command after installation?

Ensure `/usr/local/bin` is in your PATH:

```bash
echo $PATH | grep /usr/local/bin

# If not, add to ~/.bashrc or ~/.zshrc
export PATH="/usr/local/bin:$PATH"
```

### Q: Java version incompatibility?

Install the corresponding Java version for the Nacos version you want to install:

```bash
export JAVA_HOME=/path/to/java
export PATH=$JAVA_HOME/bin:$PATH
```

### Q: How to handle port conflicts?

```bash
# Method 1: Use --kill parameter to stop Nacos processes occupying ports
nacos-setup --kill

# Method 2: Specify a new port
nacos-setup -p 18848
```

### Q: How to view Nacos logs?

```bash
# Standalone mode
tail -f ~/ai-infra/nacos/standalone/nacos-*/logs/start.out

# Cluster mode
tail -f ~/ai-infra/nacos/cluster/CLUSTER_ID/*/logs/start.out
```

## Related Links

- [Nacos Official Website](https://nacos.io)
- [Nacos Quick Start](../../../quickstart/quick-start.mdx)
- [Nacos Deployment Guide](./deployment-overview.md)
- [Nacos GitHub](https://github.com/alibaba/nacos)
- [Nacos Setup GitHub](https://github.com/nacos-group/nacos-setup)
