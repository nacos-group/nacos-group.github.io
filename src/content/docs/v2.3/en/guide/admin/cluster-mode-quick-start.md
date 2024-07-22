---
title: Cluster Deployment Guide
keywords: [Cluster Deployment, Nacos, Cluster Mode, Port Configuration, Data Source Configuration, Service Registration and Discovery, Configuration Management, Authentication]
description: This guide details the deployment process of Nacos in cluster mode, covering cluster architecture, environment setup, obtaining source code or packages, cluster configuration, data source setup, and comprehensive steps for service registration, discovery, and configuration management. It emphasizes port configurations for different deployment modes, usage of internal and external data sources, and provides examples for configuring authentication.
---
# Cluster deployment instructions

> Document optimizing...

# Cluster Deployment Guide

This quick start manual assists you in rapidly downloading, installing, and using Nacos in a production-ready clustered mode on your computer.

## Cluster Deployment Architecture

Open-source recommendations include placing all service lists under a VIP and associating it with a domain name.

- `<http://ip1:port/openAPI>`: Direct IP mode requires IP modification when a machine fails.
- `<http://SLB:port/openAPI>`: SLB (intranet) mounting mode is not to be exposed to the public network due to security risks.
- `<http://nacos.com:port/openAPI>`: Domain + SLB (intranet) mode is recommended for its readability and easy IP swapping.

![deployDnsVipMode.jpg](/img/deployDnsVipMode.jpg)

|Port| Offset from Main Port| Description|
|--|--|--|
|8848|0| Primary port used by clients, console, and OpenAPI for HTTP requests.|
|9848|1000| gRPC client request to server port, for client-initiated connections and requests.|
|9849|1001| Server-to-server gRPC request port for service synchronization, etc.|
|7848|-1000| Jraft request to server port, for handling Raft-related requests among servers.|

**When using VIP/nginx, configure TCP forwarding instead of http2 to prevent connection termination by nginx.**
**Ports 9849 and 7848 are for inter-service communication; do not expose them to external networks or clients.**

## 1. Prerequisite Environment Preparation

Ensure the following are installed and used:

- 64-bit OS: Linux/Unix/Mac, Linux is recommended.
- 64-bit JDK 1.8+; [Download](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html). [Configuration](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/).
- Maven 3.2.x+; [Download](https://maven.apache.org/download.cgi). [Configuration](https://maven.apache.org/settings.html).
- A minimum of 3 Nacos nodes to form a cluster.

## 2. Obtain Source Code or Installation Package

Nacos can be obtained through two methods.

### Download Source Code from GitHub

```bash
unzip nacos-source.zip
cd nacos/
mvn -Prelease-nacos clean install -U  
cd nacos/distribution/target/nacos-server-1.3.0/nacos/bin
```

### Download Compiled Package

Download from the [latest stable version](https://github.com/alibaba/nacos/releases) `nacos-server-$version.zip` or `nacos-server-$version.tar.gz`.

```bash
unzip nacos-server-$version.zip or tar -xvf nacos-server-$version.tar.gz
cd nacos/bin
```

## 3. Configure Cluster Configuration Files

Under the `conf` directory in the extracted `nacos/`, edit `cluster.conf` with each line as `ip:port` (minimum 3 nodes).

```plain
# ip:port
200.8.9.16:8848
200.8.9.17:8848
200.8.9.18:8848
```

### 3.1 Enable Default Authentication Plugin (Optional)

Modify `application.properties` in the `conf` directory.

Set:

```properties
nacos.core.auth.enabled=true
nacos.core.auth.system.type=nacos
nacos.core.auth.plugin.nacos.token.secret.key=${custom, ensure consistency across all nodes}
nacos.core.auth.server.identity.key=${custom, ensure consistency across all nodes}
nacos.core.auth.server.identity.value=${custom, ensure consistency across all nodes}
```

For more details, refer to [Authentication](../../plugin/auth-plugin.md).

> Note: The default values `SecretKey012345678901234567890123456789012345678901234567890123456789` and `VGhpc0lzTXlDdXN0b21TZWNyZXRLZXkwMTIzNDU2Nzg=` are public defaults, suitable for temporary testing. Replace with custom values for actual use.

## 4. Determine Data Source

### Use Built-in Data Source

No configuration required.

### Use External Data Source

Recommended for production in at least master-slave mode or with a highly available database.

#### Initialize MySQL Database

[SQL script source](https://github.com/alibaba/nacos/blob/master/distribution/conf/mysql-schema.sql)

#### application.properties Configuration

[application.properties file](https://github.com/alibaba/nacos/blob/master/distribution/conf/application.properties)

## 5. Start Server

### Linux/Unix/Mac

#### Standalone Mode

```bash
sh startup.sh -m standalone
```

#### Cluster Mode

> Built-in Data Source

```bash
sh startup.sh -p embedded
```

> External Data Source

```bash
sh startup.sh
```

## 6. Service Registration & Discovery and Configuration Management

### Service Registration

```bash
curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.10&port=8080'
```

> If the default authentication plugin is enabled, include credentials in the Header.

### Service Discovery

```bash
curl -X GET 'http://127.0.0.1:8848/nacos/v1/ns/instance/list?serviceName=nacos.naming.serviceName'
```

> If the default authentication plugin is enabled, include credentials in the Header.

### Publish Configuration

```bash
curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test&content=helloWorld"
```

> If the default authentication plugin is enabled, include credentials in the Header.

### Retrieve Configuration

```bash
curl -X GET "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test