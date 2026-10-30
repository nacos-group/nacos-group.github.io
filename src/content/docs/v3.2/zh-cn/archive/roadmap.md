---
title: Nacos 规划
keywords: [Nacos,规划]
description: Nacos 规划
---

# Nacos 规划

我们计划从 Nacos 0.8.0 开始将其做到生产可用状态。在这个版本之前，我们建议您仅将其用于开发和测试环境。我们目前的计划是努力在未来6~8个月内将Nacos演进到生产可用的版本。当然计划可能因为各种因素影响而做调整，包括根据社区的声音进行优先级调整等，但整体应该不会超过1年的时间。

以下是未来1年我们的主要路线图与计划。 

## Nacos 1.0 

主要目标有两个：

* 构建简单易用的，服务相关的工具集，包括服务发现、配置管理、服务元数据存储、推送、一致性及元数据管理等；
* 与包括[Spring Cloud](https://github.com/alibaba/spring-cloud-alibaba)、[Kubernetes](https://github.com/kubernetes/kubernetes)、[Dubbo](https://github.com/apache/dubbo)等开源生态做无缝的融合与支持，同时给这些生态带来很多面向生产时需要的优秀特性。

以下是大致的计划：

* 0.1 Basic Nacos server and simple OpenAPI and Java SDK;
* 0.2 - 0.3 Seamless support for Kubernetes, Service Mesh and Spring Cloud service discovery and configuration management;
* 0.4 - 0.5 Build an easy-to-use Web UI/User Console;
* 0.6 - 0.7 High availability, ease of use, monitoring and alert etc.;
* 0.8 Production ready;
* 0.9 Large scale performance tuning and benchmark;
* 1.0 GA for large scale production.


## Nacos 2.0 

主要关注在统一服务管理、服务共享及服务治理体系的开放的服务平台的建设上，主要包括两个方面:

* Dubbo 4.0 + Nacos 2.0 开放的服务平台

![Screen Shot 2018-07-11 at 22.32.17.png](https://cdn.yuque.com/lark/0/2018/png/15914/1531319724777-d19b0304-535c-4af9-bee1-f358b6e55d91.png) 

* Kubernetes + Spring Cloud 统一服务管理

![Screen Shot 2018-07-11 at 22.35.30.png](https://cdn.yuque.com/lark/0/2018/png/15914/1531319755930-0040e67e-ca05-47b9-9cd0-07ffd7452eae.png) 