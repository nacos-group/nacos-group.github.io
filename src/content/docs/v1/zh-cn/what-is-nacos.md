---
title: Nacos 配置中心简介, Nacos 是什么
keywords: [nacos]
description: Nacos 配置中心简介，Nacos 是什么
---

# 什么是 Nacos

## 概览

欢迎来到 Nacos 的世界！

Nacos `/nɑ:kəʊs/`  是 Dynamic Naming and Configuration Service的首字母简称，一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。

Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及流量管理。

Nacos 帮助您更敏捷和容易地构建、交付和管理微服务平台。 Nacos 是构建以“服务”为中心的现代应用架构 (例如微服务范式、云原生范式) 的服务基础设施。

## 什么是 Nacos？
服务（Service）是 Nacos 世界的一等公民。Nacos 支持几乎所有主流类型的“服务”的发现、配置和管理：

[Kubernetes Service](https://kubernetes.io/docs/concepts/services-networking/service/)

[gRPC](https://grpc.io/docs/guides/concepts.html#service-definition) & [Dubbo RPC Service](https://dubbo.incubator.apache.org)

[Spring Cloud RESTful Service](https://spring.io/projects/spring-restdocs)

Nacos 的关键特性包括:

* **服务发现和服务健康监测**

    Nacos 支持基于 DNS 和基于 RPC 的服务发现。服务提供者使用 [原生SDK](./sdk.md)、[OpenAPI](./open-api.md)、或一个[独立的Agent TODO](./other-language.md)注册 Service 后，服务消费者可以使用[DNS TODO](./what-is-nacos.md) 或[HTTP&API](./open-api.md)查找和发现服务。

    Nacos 提供对服务的实时的健康检查，阻止向不健康的主机或服务实例发送请求。Nacos 支持传输层 (PING 或 TCP)和应用层 (如 HTTP、MySQL、用户自定义）的健康检查。 对于复杂的云环境和网络拓扑环境中（如 VPC、边缘网络等）服务的健康检查，Nacos 提供了 agent 上报模式和服务端主动检测2种健康检查模式。Nacos 还提供了统一的健康检查仪表盘，帮助您根据健康状态管理服务的可用性及流量。

* **动态配置服务**

    动态配置服务可以让您以中心化、外部化和动态化的方式管理所有环境的应用配置和服务配置。

    动态配置消除了配置变更时重新部署应用和服务的需要，让配置管理变得更加高效和敏捷。

    配置中心化管理让实现无状态服务变得更简单，让服务按需弹性扩展变得更容易。

    Nacos 提供了一个简洁易用的UI ([控制台样例 Demo](http://console.nacos.io/nacos/index.html)) 帮助您管理所有的服务和应用的配置。Nacos 还提供包括配置版本跟踪、金丝雀发布、一键回滚配置以及客户端配置更新状态跟踪在内的一系列开箱即用的配置管理特性，帮助您更安全地在生产环境中管理配置变更和降低配置变更带来的风险。

* **动态 DNS 服务**

    动态 DNS 服务支持权重路由，让您更容易地实现中间层负载均衡、更灵活的路由策略、流量控制以及数据中心内网的简单DNS解析服务。动态DNS服务还能让您更容易地实现以 DNS 协议为基础的服务发现，以帮助您消除耦合到厂商私有服务发现 API 上的风险。


    Nacos 提供了一些简单的 [DNS APIs TODO](./what-is-nacos.md) 帮助您管理服务的关联域名和可用的 IP:PORT 列表.

* **服务及其元数据管理**

    Nacos 能让您从微服务平台建设的视角管理数据中心的所有服务及元数据，包括管理服务的描述、生命周期、服务的静态依赖分析、服务的健康状态、服务的流量管理、路由及安全策略、服务的 SLA 以及最首要的 metrics 统计数据。

* [更多的特性列表 ...](archive/roadmap.md)

## Nacos 地图
一图看懂 Nacos，下面架构部分会详细介绍。
![nacos_map](/img/nacosMap.jpg)
- 特性大图：要从功能特性，非功能特性，全面介绍我们要解的问题域的特性诉求
- 架构大图：通过清晰架构，让您快速进入 Nacos 世界
- 业务大图：利用当前特性可以支持的业务场景，及其最佳实践
- 生态大图：系统梳理 Nacos 和主流技术生态的关系
- 优势大图：展示 Nacos 核心竞争力
- 战略大图：要从战略到战术层面讲 Nacos 的宏观优势

## Nacos 生态图

![nacos_landscape.png](https://cdn.nlark.com/lark/0/2018/png/11189/1533045871534-e64b8031-008c-4dfc-b6e8-12a597a003fb.png)

如 Nacos 全景图所示，Nacos 无缝支持一些主流的开源生态，例如

* [Spring Cloud](https://nacos.io/en-us/docs/quick-start-spring-cloud.html)
* [Apache Dubbo and Dubbo Mesh](./use-nacos-with-dubbo.md)
* [Kubernetes and CNCF](./use-nacos-with-kubernetes.md)。

使用 Nacos 简化服务发现、配置管理、服务治理及管理的解决方案，让微服务的发现、管理、共享、组合更加容易。

关于如何在这些生态中使用 Nacos，请参考以下文档：

[Nacos与Spring Cloud一起使用](archive/use-nacos-with-springcloud.md)

[Nacos与Kubernetes一起使用](./use-nacos-with-kubernetes.md)

[Nacos与Dubbo一起使用](./use-nacos-with-dubbo.md)

[Nacos与gRPC一起使用](archive/roadmap.md)

[Nacos与Istio一起使用](archive/use-nacos-with-istio.md)


## 下一步

继续阅读 [快速开始](./quick-start.md) 以快速上手 Nacos。






