---
title: 集群部署说明
keywords: [集群,部署]
description: 集群部署说明
---

<!-- # 集群部署说明 -->

## 集群模式部署

这个快速开始手册是帮忙您快速在你的电脑上，下载安装并使用Nacos，部署生产使用的集群模式。

### 集群部署架构图

因此开源的时候推荐用户把所有服务列表放到一个vip下面，然后挂到一个域名下面

<http://ip1:port/openAPI>  直连ip模式，机器挂则需要修改ip才可以使用。

<http://SLB:port/openAPI>  挂载SLB模式(内网SLB，不可暴露到公网，以免带来安全风险)，直连SLB即可，下面挂server真实ip，可读性不好。

<http://nacos.com:port/openAPI>  域名 + SLB模式(内网SLB，不可暴露到公网，以免带来安全风险)，可读性好，而且换ip方便，推荐模式

![deployDnsVipMode.jpg](/img/deployDnsVipMode.jpg)  

## 1. 预备环境准备

请确保是在环境中安装使用:

1. 64 bit OS  Linux/Unix/Mac，推荐使用Linux系统。
2. 64 bit JDK 1.8+；[下载](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html).[配置](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/)。
3. Maven 3.2.x+；[下载](https://maven.apache.org/download.cgi).[配置](https://maven.apache.org/settings.html)。
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

[zip包](https://github.com/alibaba/nacos/releases/download/1.3.0/nacos-server-1.3.0.zip)

[tar.gz包](https://github.com/alibaba/nacos/releases/download/1.3.0/nacos-server-1.3.0.tar.gz)

```bash
  unzip nacos-server-1.3.0.zip 或者 tar -xvf nacos-server-1.3.0.tar.gz
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

`curl -X PUT 'http://127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.10&port=8080'`

### 服务发现

`curl -X GET 'http://127.0.0.1:8848/nacos/v1/ns/instance/list?serviceName=nacos.naming.serviceName'`

### 发布配置

`curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test&content=helloWorld"`

### 获取配置

`curl -X GET "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test"`

## 7. 关闭服务器

Linux/Unix/Mac

```bash
sh shutdown.sh
```
