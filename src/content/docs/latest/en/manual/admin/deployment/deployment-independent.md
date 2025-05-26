---
title: 控制台独立部署
keywords: [ Nacos,独立部署,控制台 ]
description: Nacos控制台独立部署手册，介绍Nacos控制台和Nacos服务如何独立部署。
sidebar:
  order: 4
---

# 控制台独立部署

> Nacos定义为一个IDC内部应用组件，并非面向公网环境的产品，建议在内部隔离网络环境中部署，强烈不建议部署在公共网络环境。
>
> 以下文档中提及的VIP，网卡等所有网络相关概念均处于内部网络环境。

## 1. Nacos 控制台独立部署概览

![nacos_console_deploy.png](/img/blog/3_0_0-release/3.0_deploy.svg)

Nacos 3.0 版本开始，Nacos支持将控制台进行独立部署，通过进一步拆分高风险请求和高资源消耗的请求，从而提高Nacos的安全性和稳定性。

要将Nacos控制台独立部署，首先需要先部署一个`Nacos 无控制台的集群服务`或`Nacos 无控制台的单机服务`，然后再单独启动`Nacos控制台`，并确认两者的部分配置一致。

## 2. 部署Nacos 无控制台服务

首先参考[Nacos集群模式部署](./deployment-cluster.md#1-发行版部署)或[Nacos单机模式部署](./deployment-standalone.mdx#1-发行版部署)，将`启动Nacos服务`步骤中的 `sh startup.sh`或`sh startup.sh -m standalone` 更换为`sh startup.sh -d server`或`sh startup.sh -m standalone -d server`.

待Nacos服务启动成功后，复制`conf/cluster.conf`文件或记录Nacos服务的`ip:port`，以便后续使用。

## 3. 部署Nacos 控制台

### 3.1. 环境准备

Nacos 控制台 依赖 [Java](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/) 环境来运行，请确保是在以下版本环境中安装使用:

1. 64 bit OS，支持 Linux/Unix/Mac/Windows，推荐选用 Linux/Unix/Mac。
2. 64 bit JDK 17+；[下载](https://www.oracle.com/java/technologies/downloads/#java17) & [配置](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/)。

### 3.2. 解压缩Nacos 控制台发行包

Nacos独立控制台的发行包与Nacos服务的发行包相同， 只需要从上一步骤[部署Nacos 无控制台服务](#2-部署nacos-无控制台服务)中复制发布包到控制台部署环境中即可，随后执行以下命令进行解压：

```bash
  unzip nacos-server-$version.zip 
  # 或者 tar -xvf nacos-server-$version.tar.gz
  cd nacos/bin
```

### 3.3. 配置Nacos 无控制台服务地址配置文件

由于Nacos 独立控制台不进行数据的存储，因此需要访问实际的Nacos服务进度数据的获取，因此需要配置Nacos 无控制台服务地址在对应的配置文件中。

在nacos的解压目录nacos/的conf目录下，有配置文件`cluster.conf`，请每行配置成`ip:port`, 其内容为[部署Nacos 无控制台服务](#2-部署nacos-无控制台服务)中记录的`conf/cluster.conf`文件或记录Nacos服务的`ip:port`，示例如下：

```plain
# ip:port
200.8.9.16:8848
200.8.9.17:8848
200.8.9.18:8848
```

### 3.4. 修改配置文件（可选）

修改nacos的解压目录nacos的`conf`目录下的配置文件`application.properties`，查找以 `nacos.console` 开头的配置项，修改为对应配置，示例如下：

```properties
### Nacos Console Main port
nacos.console.port=8080
### Nacos Console context path:
nacos.console.contextPath=
### Nacos Server context path, which link to nacos server `nacos.server.contextPath`, works when deployment type is `console`
nacos.console.remote.server.context-path=/nacos
```

同时需要配置鉴权相关配置，避免启动失败或无法访问Nacos 服务， 示例如下：

```properties
nacos.core.auth.server.identity.key=${your_custom_server_identity_key}
nacos.core.auth.server.identity.value=${your_custom_server_identity_value}
nacos.core.auth.plugin.nacos.token.secret.key=${your_custom_token_secret_key}
```

:::note
`nacos.core.auth.server.identity.key`和`nacos.core.auth.server.identity.value`需要设置的与Nacos 无控制台服务进行鉴权时设置的值一致，否则将无法访问Nacos 无控制台服务。
:::

### 3.5. 启动Nacos 控制台

通过如下命令，启动Nacos 控制台：

```bash
# Linux/Unix/Mac 
sh startup.sh -d console

# Ubuntu

bash startup.sh -d console

# Windows
startup.cmd -d console
```

随后启动程序会提示您输入`3个`鉴权相关配置

```
`nacos.core.auth.plugin.nacos.token.secret.key` is missing, please set: ${your_input_token_secret_key}
nacos.core.auth.plugin.nacos.token.secret.key` Updated:
----------------------------------
`nacos.core.auth.server.identity.key` is missing, please set: ${your_input_server_identity_key}
`nacos.core.auth.server.identity.key` Updated:
----------------------------------
`nacos.core.auth.server.identity.value` is missing, please set: ${your_input_server_identity_key}
`nacos.core.auth.server.identity.value` Updated:
----------------------------------
```

:::note
若您已经在[修改配置文件](#34-修改配置文件可选)步骤中设置过这3个配置，则不会提示您输入。

同时`nacos.core.auth.server.identity.key`和`nacos.core.auth.server.identity.value`需要设置的与Nacos 无控制台服务进行鉴权时设置的值一致，否则将无法访问Nacos 无控制台服务。
:::

### 3.6. 进入Nacos 控制台

启动完成后，您可以在浏览器中访问`http://{ip}:{port}/index.html`，其中`{ip}`为Nacos 控制台的ip地址，`{port}`为Nacos 控制台的端口，默认为`8080`。

Nacos控制台的使用，请参考文档[控制台手册](../console.md)