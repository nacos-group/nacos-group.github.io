---
title: Nacos 集群 Nginx 负载均衡指南
keywords: [Nginx, 负载均衡, 集群, gRPC]
description: 如何使用 Nginx 作为 Nacos 集群的负载均衡器
sidebar:
    order: 9
---

# Nacos 集群 Nginx 负载均衡指南

本指南介绍如何使用 Nginx 作为 Nacos 集群的负载均衡器，涵盖 HTTP API（端口 8848）、控制台（端口 8080）和 gRPC 通信（端口 9848）。

> **Nacos 3.x 端口变更**：从 Nacos 3.x 开始，控制台端口默认为 **8080**（不再是 8848），
> 且访问路径不再带有 `/nacos` 前缀。HTTP API 端口仍为 8848。

## 背景

连接 Nacos 集群时，可以在 `server-addr` 中用逗号配置多个服务器地址：

```yaml
spring.cloud.nacos.discovery.server-addr=192.168.190.128:8848,192.168.190.129:8848,192.168.190.130:8848
```

但这种方式有个缺点：当集群扩容或缩容时，需要重新打包并重启应用。使用 Nginx 作为负载均衡器可以通过提供单一入口点来避免这个问题。

## 前置条件

- Nacos 集群已正确配置 3 个以上节点
- Nginx 已安装且**包含 `stream` 模块**（编译时需添加 `--with-stream`）

> **重要**：`stream` 模块是 gRPC（TCP）代理所必需的。大多数包管理器安装默认包含此模块，但如果从源码编译 Nginx，必须添加 `--with-stream`。

## Nacos 集群配置

确保每个 Nacos 节点都配置为集群模式：

**cluster.conf**（每个节点上）：

```
192.168.190.128:8848
192.168.190.129:8848
192.168.190.130:8848
```

**application.properties**（数据库配置）：

```properties
nacos.plugin.datasource-dialect.type=mysql
nacos.plugin.datasource.db.url.0=jdbc:mysql://192.168.190.1:3306/config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
nacos.plugin.datasource.db.user.0=root
nacos.plugin.datasource.db.password.0=your_password
```

## Nginx 配置

Nacos 使用三种通信端口：

| 协议 | 默认端口 | 用途 |
|------|---------|------|
| HTTP API | 8848 | 客户端 API 调用 |
| HTTP 控制台 | 8080 | Web 控制台访问 |
| gRPC | 9848 | 客户端-服务端长连接（API 端口 + 1000） |

Nginx 配置必须**同时处理**三种端口。

### 完整 Nginx 配置

```nginx
worker_processes 1;

events {
    worker_connections 1024;
}

# HTTP 负载均衡（用于 API 和控制台）
http {
    include       mime.types;
    default_type  application/octet-stream;

    client_max_body_size 300m;

    sendfile        on;
    keepalive_timeout 65;

    # 上游 Nacos API 服务器（端口 8848）
    upstream nacos_api_cluster {
        server 192.168.190.128:8848;
        server 192.168.190.129:8848;
        server 192.168.190.130:8848;
    }

    # 上游 Nacos 控制台服务器（端口 8080）
    upstream nacos_console_cluster {
        server 192.168.190.128:8080;
        server 192.168.190.129:8080;
        server 192.168.190.130:8080;
    }

    server {
        listen       7847;
        server_name  localhost;
        charset utf-8;

        # API 请求
        location /nacos/ {
            proxy_pass http://nacos_api_cluster/nacos/;
        }

        # 控制台（Nacos 3.x 默认端口 8080，路径无 /nacos 前缀）
        location / {
            proxy_pass http://nacos_console_cluster;
        }
    }
}

# gRPC（TCP）负载均衡（用于客户端长连接）
stream {
    # 上游 Nacos gRPC 服务器
    upstream nacos_grpc_cluster {
        server 192.168.190.128:9848 weight=1;
        server 192.168.190.129:9848 weight=1;
        server 192.168.190.130:9848 weight=1;
    }

    server {
        listen 8847;
        proxy_pass nacos_grpc_cluster;
    }
}
```

### 端口映射

Nginx 监听端口的选取保持与 Nacos 默认端口相同的偏移关系：

| Nginx 端口 | Nacos 端口 | 协议 | 用途 |
|-----------|------------|------|------|
| 7847      | 8848       | HTTP | API 调用 |
| 7847      | 8080       | HTTP | 控制台访问 |
| 8847      | 9848       | gRPC | 客户端长连接 |

> **注意**：Nacos 使用 HTTP API 端口 **+1000** 的固定偏移作为 gRPC 端口。
> 如果 Nacos API 端口是 `8848`，则 gRPC 在 `9848`。

## 客户端配置

将应用指向 Nginx 地址，而不是单独的 Nacos 节点：

```yaml
spring.cloud.nacos.discovery.server-addr=192.168.190.128:7847
spring.cloud.nacos.config.server-addr=192.168.190.128:7847
```

对于多环境配置，可以在根 `pom.xml` 中使用 Maven profiles 来切换不同环境的服务器地址。

## 验证

1. 启动所有 Nacos 集群节点
2. 使用上述配置启动 Nginx
3. 访问 Nacos 控制台：`http://192.168.190.128:7847`（Nacos 3.x 控制台路径为 `/`，端口 8080）
4. 验证应用可以注册服务和获取配置

## 故障排查

### gRPC 连接失败

- 确保 Nginx 编译时包含 `--with-stream`（运行 `nginx -V` 检查）
- 验证 gRPC 端口（9848）在所有 Nacos 节点上可访问
- 检查 `stream` 块是否在 `nginx.conf` 的**顶层**，而不是在 `http` 内部

### 控制台无法访问

- Nacos 3.x 控制台默认端口为 **8080**，确保 Nginx 配置中 `nacos_console_cluster` 指向正确的端口
- 如果使用旧版 Nacos（< 3.x），控制台端口为 8848，路径为 `/nacos`

### 客户端获取过期配置

- 这是 Nacos 集群模式下的已知问题。参见
  [spring-cloud-alibaba#3644](https://github.com/alibaba/spring-cloud-alibaba/pull/3644)
  了解使用配置快照刷新的修复方案。

### 添加新 Nacos 节点

扩容集群时，只需更新 Nginx 配置并重新加载：

```bash
nginx -s reload
```

无需修改应用或重启。
