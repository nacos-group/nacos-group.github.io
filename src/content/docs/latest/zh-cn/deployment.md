---
title: Nacos支持三种部署模式
keywords: [Nacos,部署模式]
description: Nacos支持三种部署模式
sidebar:
    order: 1
---

> 文档优化中......

# Nacos部署环境

Nacos定义为一个IDC内部应用组件，并非面向公网环境的产品，建议在内部隔离网络环境中部署，强烈不建议部署在公共网络环境。

以下文档中提及的VIP，网卡等所有网络相关概念均处于内部网络环境。

# Nacos支持三种部署模式

* 单机模式 - 用于测试和单机试用。
* 集群模式 - 用于生产环境，确保高可用。
* 多集群模式 - 用于多数据中心场景。

# 环境准备
- 安装好 JDK，需要 1.8 及其以上版本
- 建议: 2核 CPU / 4G 内存 及其以上
- 建议: 生产环境 3 个节点 及其以上

## 单机模式下运行Nacos

### Linux/Unix/Mac

```shell
# Standalone means it is non-cluster Mode.
$ sh startup.sh -m standalone
```

### Windows

```shell
# Standalone means it is non-cluster Mode.
$ cmd startup.cmd -m standalone
```

### 单机模式支持mysql

在0.7版本之前，在单机模式时nacos使用嵌入式数据库实现数据的存储，不方便观察数据存储的基本情况。0.7版本增加了支持mysql数据源能力，具体的操作步骤：

- 1.安装数据库，版本要求：5.6.5+
- 2.初始化mysql数据库，数据库初始化文件：mysql-schema.sql
- 3.修改conf/application.properties文件，增加支持mysql数据源配置（目前只支持mysql），添加mysql数据源的url、用户名和密码。

```
spring.datasource.platform=mysql

db.num=1
db.url.0=jdbc:mysql://11.162.196.16:3306/nacos_devtest?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
db.user=nacos_devtest
db.password=youdontknow
```

再以单机模式启动nacos，nacos所有写嵌入式数据库的数据都写到了mysql

## 集群模式下运行Nacos

[集群模式下运行Nacos](./cluster-mode-quick-start.md)

## 多集群模式

Nacos支持NameServer路由请求模式，通过它您可以设计一个有用的映射规则来控制请求转发到相应的集群，在映射规则中您可以按命名空间或租户等分片请求...

## 多网卡IP选择

当本地环境比较复杂的时候，Nacos服务在启动的时候需要选择运行时使用的IP或者网卡。Nacos从多网卡获取IP参考Spring Cloud设计，通过nacos.inetutils参数，可以指定Nacos使用的网卡和IP地址。目前支持的配置参数有:

- ip-address参数可以直接设置nacos的ip

```
nacos.inetutils.ip-address=10.11.105.155
```

- use-only-site-local-interfaces参数可以让nacos使用局域网ip，这个在nacos部署的机器有多网卡时很有用，可以让nacos选择局域网网卡

```
nacos.inetutils.use-only-site-local-interfaces=true
```

- ignored-interfaces支持网卡数组，可以让nacos忽略多个网卡

```
nacos.inetutils.ignored-interfaces[0]=eth0
nacos.inetutils.ignored-interfaces[1]=eth1
```

- preferred-networks参数可以让nacos优先选择匹配的ip，支持正则匹配和前缀匹配

```
nacos.inetutils.preferred-networks[0]=30.5.124.
nacos.inetutils.preferred-networks[0]=30.5.124.(25[0-5]|2[0-4]\\d|((1d{2})|([1-9]?\\d))),30.5.124.(25[0-5]|2[0-4]\\d|((1d{2})|([1-9]?\\d)))
```
