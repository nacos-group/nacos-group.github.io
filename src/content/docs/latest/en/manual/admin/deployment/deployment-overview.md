---
title: 部署手册概览
keywords: [ Nacos,部署模式 ]
description: Nacos支持三种部署模式
sidebar:
  order: 1
---

# Nacos部署手册

> Nacos定义为一个IDC内部应用组件，并非面向公网环境的产品，建议在内部隔离网络环境中部署，强烈不建议部署在公共网络环境。
>
> 以下文档中提及的VIP，网卡等所有网络相关概念均处于内部网络环境。

## 1. Nacos部署架构

Nacos自3.0版本在2.X版本的基础上，对Nacos控制台和Nacos本身进行了拆分和优化。

在网络上，Nacos自3.0开始新增Nacos控制台的网络访问端口，不再与Nacos的主端口（server.port，默认8848）进行耦合，以提升Nacos的安全性。

| 端口   | 与主端口的偏移量 | 描述                                                 |
|------|----------|----------------------------------------------------|
| 8848 | 0        | Nacos HTTP API 端口，用于Nacos AdminAPI及HTTP OpenAPI的访问 |
| 9848 | 1000     | 客户端gRPC请求服务端端口，用于客户端向服务端发起连接和请求                    |
| 9849 | 1001     | 服务端gRPC请求服务端端口，用于服务间同步等                            |
| 7848 | -1000    | Jraft请求服务端端口，用于处理服务端间的Raft相关请求                     |
| 8080 | 独立配置     | Nacos控制台端口，访问Nacos控制台及Nacos控制台的API                 |

> **使用VIP/nginx请求时，对于Nacos的gRPC端口（默认9848）需要配置成TCP转发，不能配置http/http2转发，否则连接会被nginx断开。**
>
> **对外暴露端口时，建议仅暴露控制台端口（默认8080）和gRPC端口（默认9848）；同时按需暴露主端口（默认8848），其他端口为服务端之间的通信端口，请勿暴露其他端口，同时建议所有端口均不暴露在公网下。**

![nacos_port_exposure.png](/img/doc/manual/admin/deployment/deploy-port-export-3.0.svg)

客户端的大多数请求会通过gRPC端口(默认9848)请求到服务端上，但会有部分插件请求（如Nacos 鉴权插件的login）会通过Nacos主端口（默认8848）进行请求。同时Nacos3.0的客户端为了方便用户升级及兼容使用习惯，Nacos3.0客户端仍然保留着和Nacos2.X客户端相同的计算逻辑，既：**配置主端口(默认8848)，通过相同的偏移量，计算对应gRPC端口(默认9848)**。

因此如果客户端和服务端之前存在端口转发，或防火墙时，需要对端口转发配置和防火墙配置做相应的调整。

## 2. Nacos支持三种部署模式

* 单机模式 - 又称单例模式，主要用于测试和单机试用。
* 集群模式 - 主要用于生产环境，确保高可用。
* 多集群模式（TODO） - 用于多数据中心场景。

![Nacos部署模式图](/img/doc/overview/deploy-structure.svg)

### 2.1. 单机模式

单机模式又称`单例模式`,
拥有所有Nacos的功能及特性，具有极易部署、快速启动等优点。但无法与其他节点组成集群，无法在节点或网络故障时提供高可用能力。单机模式同样可以使用内置Derby数据库（默认）和外置数据库进行存储。

单机模式主要适合于工程师于本地搭建或于测试环境中搭建Nacos环境，主要用于开发调试及测试使用；也能够兼顾部分对稳定性和可用性要求不高的业务场景。

单机模式的部署参考文档: [单机模式部署](./deployment-standalone.mdx)

### 2.2. 集群模式

集群模式通过自研一致性协议Distro以及Raft协议，将多个Nacos节点构建成了高可用的Nacos集群。数据将在集群中各个节点进行同步，保证数据的一致性。集群模式具有高可用、高扩展、高并发等优点，确保在故障发生时不影响业务的运行。集群模式
**默认**采用外置数据库进行存储，但也可以通过内置数据库进行存储。

该模式主要适合于生产环境，也是社区最为推荐的部署模式。

集群模式的部署参考文档: [集群模式部署](./deployment-cluster.md)

### 2.3. 多集群模式（TODO）

Nacos支持NameServer路由请求模式，通过它您可以设计一个有用的映射规则来控制请求转发到相应的集群，在映射规则中您可以按命名空间或租户等分片请求...

## 3. Nacos控制台独立部署

![nacos_console_deploy.png](/img/blog/3_0_0-release/3.0_deploy.svg)

Nacos 3.0 版本开始，Nacos支持将控制台进行独立部署，通过进一步拆分高风险请求和高资源消耗的请求，从而提高Nacos的安全性和稳定性。

独立部署`Nacos Server`时，仅需要在启动命令中添加`-d server`参数，如：`sh startup.sh -d server`.

独立部署`Nacos Console`时，则需要在启动命令中添加`-d console`参数，如：`sh startup.sh -d console`.

Nacos控制台独立部署参考文档: [控制台独立部署](./deployment-independent.md)

## 4. 多网卡IP选择

当本地环境比较复杂的时候，Nacos服务在启动的时候需要选择运行时使用的IP或者网卡。Nacos从多网卡获取IP参考Spring
Cloud设计，通过nacos.inetutils参数，可以指定Nacos使用的网卡和IP地址。目前支持的配置参数有:

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
