---
title: 集群部署说明
keywords: [集群,部署]
description: 集群部署说明
sidebar:
    order: 2
---

<!-- # 集群部署说明 -->

> 文档优化中......

## 集群模式部署

这个快速开始手册是帮忙您快速在你的电脑上，下载安装并使用Nacos，部署生产使用的集群模式。

### 集群部署架构图

因此开源的时候推荐用户把所有服务列表放到一个vip下面，然后挂到一个域名下面

<http://ip1:port/openAPI>  直连ip模式，机器挂则需要修改ip才可以使用。

<http://SLB:port/openAPI>  挂载SLB模式(内网SLB，不可暴露到公网，以免带来安全风险)，直连SLB即可，下面挂server真实ip，可读性不好。

<http://nacos.com:port/openAPI>  域名 + SLB模式(内网SLB，不可暴露到公网，以免带来安全风险)，可读性好，而且换ip方便，推荐模式

![deployDnsVipMode.jpg](/img/deployDnsVipMode.jpg)  

|端口|与主端口的偏移量|描述|
|--|--|--|
|8848|0|主端口，客户端、控制台及OpenAPI所使用的HTTP端口|
|9848|1000|客户端gRPC请求服务端端口，用于客户端向服务端发起连接和请求|
|9849|1001|服务端gRPC请求服务端端口，用于服务间同步等|
|7848|-1000|Jraft请求服务端端口，用于处理服务端间的Raft相关请求|

**使用VIP/nginx请求时，需要配置成TCP转发，不能配置http2转发，否则连接会被nginx断开。**
**9849和7848端口为服务端之间的通信端口，请勿暴露到外部网络环境和客户端测。**

## 1. 预备环境准备

请确保是在环境中安装使用:

1. 64 bit OS  Linux/Unix/Mac，推荐使用Linux系统。
2. 64 bit JDK 1.8+；[下载](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html). [配置](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/)。
3. Maven 3.2.x+；[下载](https://maven.apache.org/download.cgi). [配置](https://maven.apache.org/settings.html)。
4. 3个或3个以上Nacos节点才能构成集群。

## 2. 下载源码或者安装包

你可以通过两种方式来获取 Nacos。

### 从 Github 上下载源码方式

```bash
unzip nacos-source.zip
cd nacos/
mvn -Prelease-nacos clean install -U  
cd nacos/distribution/target/nacos-server-1.3.0/nacos/bin
```

### 下载编译后压缩包方式

下载地址

您可以从 [最新稳定版本](https://github.com/alibaba/nacos/releases) 下载 `nacos-server-$version.zip` 包 或 `nacos-server-$version.tar.gz`。

```bash
  unzip nacos-server-$version.zip 或者 tar -xvf nacos-server-$version.tar.gz
  cd nacos/bin
```

## 3. 配置集群配置文件

在nacos的解压目录nacos/的conf目录下，有配置文件cluster.conf，请每行配置成ip:port。（请配置3个或3个以上节点）

```plain
# ip:port
200.8.9.16:8848
200.8.9.17:8848
200.8.9.18:8848
```

### 3.1 开启默认鉴权插件（可选）

之后修改`conf`目录下的`application.properties`文件。

设置其中

```properties
nacos.core.auth.enabled=true
nacos.core.auth.system.type=nacos
nacos.core.auth.plugin.nacos.token.secret.key=${自定义，保证所有节点一致}
nacos.core.auth.server.identity.key=${自定义，保证所有节点一致}
nacos.core.auth.server.identity.value=${自定义，保证所有节点一致}
```

上述内容详情可查看[权限认证](../../plugin/auth-plugin.md).

> 注意，文档中的默认值`SecretKey012345678901234567890123456789012345678901234567890123456789`和`VGhpc0lzTXlDdXN0b21TZWNyZXRLZXkwMTIzNDU2Nzg=`为公开默认值，可用于临时测试，实际使用时请**务必**更换为自定义的其他有效值。

## 4. 确定数据源

### 使用内置数据源

无需进行任何配置

### 使用外置数据源

<!-- <span data-type="color" style="color:rgb(25, 31, 37)"><span data-type="background" style="background-color:rgb(255, 255, 255)"></span></span> -->
生产使用建议至少主备模式，或者采用高可用数据库。

#### 初始化 MySQL 数据库

[sql语句源文件](https://github.com/alibaba/nacos/blob/master/distribution/conf/mysql-schema.sql)

#### application.properties 配置

[application.properties配置文件](https://github.com/alibaba/nacos/blob/master/distribution/conf/application.properties)

## 5. 启动服务器

### Linux/Unix/Mac

#### Stand-alone mode

```bash
sh startup.sh -m standalone
```

#### 集群模式

> 使用内置数据源

```bash
sh startup.sh -p embedded
```

> 使用外置数据源

```bash
sh startup.sh
```

## 6. 服务注册&发现和配置管理

### 服务注册

`curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.10&port=8080'`

> 注意：如果开启默认鉴权插件，需要在Header中带上用户名密码。

### 服务发现

`curl -X GET 'http://127.0.0.1:8848/nacos/v1/ns/instance/list?serviceName=nacos.naming.serviceName'`

> 注意：如果开启默认鉴权插件，需要在Header中带上用户名密码。

### 发布配置

`curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test&content=helloWorld"`

> 注意：如果开启默认鉴权插件，需要在Header中带上用户名密码。

### 获取配置

`curl -X GET "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test"`

> 注意：如果开启默认鉴权插件，需要在Header中带上用户名密码。

## 7. 关闭服务器

Linux/Unix/Mac

```bash
sh shutdown.sh
```
