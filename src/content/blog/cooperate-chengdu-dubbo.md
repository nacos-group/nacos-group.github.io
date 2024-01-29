---
title: Nacos 计划发布v0.2版本，进一步融合Dubbo和SpringCloud生态
keywords: [nacos, nacos0.2, alibaba, 邢学超, Aliware Open Source, spring cloud]
description: Nacos 计划发布v0.2版本，进一步融合Dubbo和SpringCloud生态
date: "2018-09-21"
category: cooperate
---

# Nacos 计划发布v0.2版本，进一步融合Dubbo和SpringCloud生态

在近期的Aliware Open Source 成都站的活动上，阿里巴巴高级工程师邢学超（于怀）分享了Nacos v0.2的规划和进度，并对Nacos v0.3的控制台进行了预览。Nacos v0.2将进一步融入Duboo和Spring Cloud生态，帮助开发者更好的在微服务场景下使用服务发现和动态配置管理。

![undefined](https://cdn.nlark.com/lark/0/2018/png/11189/1537795153259-cc2c60c2-d7cb-431a-8858-cbd71b1c89e9.png) 

嘉宾介绍：邢学超（于怀），Nacos开源项目主要推动者，负责阿里巴巴内部 configserver、skywalker和taokeeper产品的架构和研发，爱好代码、篮球、吉他和摇滚，还记得超哥给盲人小朋友写的那首超温暖的歌么？[传送门：给你们的歌](https://mp.weixin.qq.com/s?__biz=MzU4NzU0MDIzOQ==&mid=2247484141&idx=2&sn=30943616cf3d86393e906f82a3282bda&chksm=fdeb308dca9cb99b6ca0e04112d2f5994a2a9cbdb5f43e5c38ef0c592001ab78e1d0be390120&scene=21#wechat_redirect)



## 1. Nacos开源介绍

Nacos是一个更易于帮助构建云原生应用的动态服务发现、配置和服务管理平台，脱胎于承载整个阿里巴巴集团的软负载产品，并于今年7月对外开源。开源以来，获得了来自社区的积极反馈，star数突破 1k 。

Nacos旨在将阿里巴巴在建设共享服务体系中使用的服务发现、配置及服务管理平台贡献给开源社区，通过打造Dubbo + Nacos的经典组合进一步释放Dubbo在云原生及Service Mesh时代中，在大规模微服务治理、流量治理、服务集成与服务共享等服务平台能力建设上的威力，同时Nacos关注对主流开源社区，如Spring Cloud和Kubernetes云原生体系的无缝对接与支持。该项目预计在7月中旬开放首个测试预览版本，并计划在0.8版本上，达到生产可用的状态。此外，Nacos支持注册中心和配置中心的分离部署，也关注上云的saas化部署，实现云下到云上的平滑迁移。

Github项目主页：
https://github.com/alibaba/nacos
Nacos官网：
http://nacos.io/ 

## 2. Nacos v0.2进度和规划

Nacos + Dubbo， 双中心重构，释放威力
Dubbo2.7将对注册中心和配置中心进行重构。注册中心将只用于Endpoint的同步，进一步减轻注册中心的存储压力，提高地址同步效率，同时缓解当前由于URL冗余在大规模推送时造成的Consumer端内存计算压力。配置中心将解决当前配置和地址信息耦合的问题，通过抽象动态配置层，让开发者可以对接微服务场景下更常用的、更专业的配置中心。这使得Nacos和Dubbo的完美融合成为可能，进一步释放Dubbo在服务治理、流量治理、服务运营和管理等方面的威力。

Nacos + Spring Cloud，多层融入，无缝贴合
Nacos在技术社区已经启动Nacos + Spring Cloud的工程，可无缝支持Spring Cloud，为Spring Cloud用户提供更简便的配置中心和注册中心的解决方案，使用Nacos不用再仅仅为服务和配置就需要在生产上hold住 Eureka，Spring Cloud Config Server，Git，Consul 起码四个开源产品。

Nacos v0.2，全方位注解，实现平滑迁移
在 Java 生态系统中，以 Spring Boot 和 Spring Cloud 为代表的微服务框架，引入了全新的编程模型，包括：
o	注解驱动（Annotation-Driven）
o	外部化配置（External Configuration）
o	自动装配（Auto-Configure）

Nacos将在v0.2支持原生Spring、Spring Boot、Spring Cloud中关于服务发现、配置管理的原生配置，适配Spring Boot、Spring Cloud标准，此外Nacos还是支持以下注解。
![undefined](https://cdn.nlark.com/lark/0/2018/png/11189/1537795187129-bf48b9b1-3560-4081-99fc-b9c99497525b.png) 

## 3. Nacos 代码演示 & v0.3控制台预览

在分享中，于怀现场演示了如何快速运行一个Nacos应用、调用Nacos API、如何使用注解来运行Nacos。

同时，Nacos v0.3加入了控制台的功能，控制台分为两个内容，并会融合在一起：
1. 服务发现模块，包括服务上下线管理、服务权重、服务打标、服务健康信息和服务元信息的展现;
2. 配置模块，提供配置列表、监听查询、推送轨迹等功能。

![undefined](https://cdn.nlark.com/lark/0/2018/png/11189/1537795211701-dc18d18c-99a6-40e0-824f-6519d8f8b434.png) 


## 4. Nacos 社区介绍和招募计划

Nacos强调社区化的发展与社区的多样性，采取PMC和Committer机制来管理社区，鼓励热情、注重细节、积极参与社区活动、对项目感兴趣的开发者参与到开源项目中来，希望在第一年就吸收至少超过5名来自其它公司的PMC，至少10名的外部Committer，依托于社区将产品做得更好，并计划在19年年初和CNCF基金会或apache基金会沟通捐赠适宜，社区贡献者会随之进入基金会体系。

画外音：我们准备了40个Nacos限量版纪念品，用于奖励参与“Nacos有奖活动”的开发者。
活动链接：
https://nacos.io/activity/

