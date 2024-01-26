---
title: Nacos 0.6版本发布，支持Dubbo生态并且支持Docker部署
keywords: [nacos0.6, dubbo, docker]
description: Nacos 0.6版本发布，支持Dubbo生态并且支持Docker部署
date: "2018-11-29"
category: release
---

# Nacos 0.6版本发布，支持Dubbo生态并且支持Docker部署

> Authors: 马昕曦、张龙、邢学超

阿里巴巴微服务开源项目[Dubbo Nacos](https://github.com/alibaba/nacos)于本周发布 __v0.6__版本，该版本主要在支持了 Dubbo的服务注册与发现和配置管理、支持docker 部署提供了官方的docker镜像、优化Nacos 控制台的国际化框架并且Nacos的集成测试效率也大大优化。



![image.png | left | 747x290](https://cdn.nlark.com/lark/0/2018/png/11189/1544689744102-fd00fec6-ca80-4c0c-9b0d-538f17279963.png "")


## 千呼万唤始出来，Dubbo的注册中心和配置中心

__Nacos__ 从 __v0.6__ 版本开始，支持 __Dubbo__ 注册中心和配置中心，同样作为阿里巴巴开源的重量级别产品，两个产品在阿里巴巴集团的内部内部实现就有千丝万缕的联系。

### Dubbo服务框架

作为rpc服务框架，一方面注重的是极其短的时延rt，保证整体的调用高效，并且另一方面保证良好的用户体验，保证用户使用舒适并且有良好的扩展性。Dubbo在这两方面做的都非常的优秀，也因为良好的拓展性，被业内广泛使用。Dubbo的普及度以及欢迎程度之高，通过2w+的github仓库star关注度就可见一斑。

### Nacos 和 Dubbo 一脉相承的基因

但阿里巴巴技术体系下有如此高效的rpc服务框架，但到底是什么支撑了阿里巴巴庞大的服务集群呢。众所周知阿里巴巴集团有着恐怖的集群规模，每年阿里巴巴集团的天猫双11全球购物狂欢节都会有人瞎掉下巴的交易规模，2018年的双11当天承载了2135亿的销售额。但作为技术人员，最关心的是峰值。如果细心的从业者应该看到了一个指标，2018年天猫承载了交易创建峰值达49.1万笔/秒。举个例子，北京鸟巢体育馆最大承载用户量9万1千人，49.1w交易每秒交易，意味着5个鸟巢体育馆的满座的观众推着购物车，同时在一秒冲过天猫淘宝的结算台，这种压力可想而知。但背后的承载这么大规模的服务集群的，和阿里巴巴Dubbo的内部使用框架HSF，对应的ConfigServer，而这正是Nacos的前身之一。Nacos 发布的0.6版本正是宣布和Dubbo完美集成，也就宣布阿里巴巴在大规模集群的经验将随着Nacos、Dubbo、Sentinel等分享出来，贡献给开源社区。



![image.png | left | 747x413](https://cdn.nlark.com/lark/0/2018/png/11189/1544696219150-b786e8fe-af7d-4e29-9c32-03b051c6db3d.png "")


### Dubbo融合Nacos

Nacos 作为 Dubbo 生态系统中重要的注册中心基础设施，其中 [dubbo-registry-nacos](https://github.com/dubbo/dubbo-registry-nacos) 是 Dubbo 融合 Nacos 注册中心的桥梁，它基于 Dubbo 强大的[注册中心 SPI ](https://cn.dubbo.apache.org/zh-cn/overview/mannual/java-sdk/reference-manual/spi/description/) 以及 Nacos Naming 服务，提供实时的服务注册和发现。目前 [dubbo-registry-nacos](https://github.com/dubbo/dubbo-registry-nacos)  处于 preview 阶段，最新的发布版本为 `0.0.2`，已测试最新的 Dubbo 以及 Dubbo OPS，推荐开发人员使用最新的 Dubbo `2.6.5` 以及 Nacos `0.6.1` ，确保享受最佳体验。如果您现在正在使用 Zookeeper 或者 Redis 作为注册中心的话，迁移到 Nacos 的部分也非常简单，以 Zookeeper 为例：

* 场景一：外部化配置

调整前的配置：

```properties
## Zookeeper registry address
dubbo.registry.address = zookeeper://127.0.0.1:2181
```

调整后的配置：

```properties
## Nacos registry address
dubbo.registry.address = nacos://127.0.0.1:8848
```

* 场景二：XML 配置驱动

调整前的配置：

```xml
<!-- 使用 Zookeeper 注册中心 -->
<dubbo:registry address="zookeeper://127.0.0.1:2181" />
```

调整后的配置：

```xml
<!-- 使用 Nacos 注册中心 -->
<dubbo:registry address="nacos://127.0.0.1:8848" />
```

调整完毕后，先确保 Nacos Server 已启动，再重启您的 Dubbo 应用，随后您在 Nacos 控制台 “服务列表” 中就能看到注册信息：


![image-20181213174408269-4694248.png | left | 747x132](https://cdn.nlark.com/lark/0/2018/png/11189/1544694815618-d316c463-701a-4095-a7d4-30bb0ec941b6.png "")


如果您对 Dubbo 与 Nacos 整合敢兴趣，不妨访问项目主页了解更多详情，地址为：

* Dubbo Nacos Registry：[https://github.com/dubbo/dubbo-registry-nacos](https://github.com/dubbo/dubbo-registry-nacos)
* Apache Dubbo：[https://github.com/apache/incubator-dubbo](https://github.com/apache/incubator-dubbo)

如果您在使用的过程中遇到了任何问题和有任何建言，请将在 [https://github.com/dubbo/dubbo-registry-nacos/issues](https://github.com/dubbo/dubbo-registry-nacos/issues) 中进行讨论。

## 容器大行其道，Nacos 支持 Docker 容器化

在容器大行其道的今天，支持容器化已经成为必然，Docker作为容器化大多数人的选择，Nacos 在v0.6 版本宣布
支持Docker化部署，并且提供出官方镜像，并且会在预计在下几个版本中支持k8s部署。


![image.png | left | 747x285](https://cdn.nlark.com/lark/0/2018/png/11189/1544696801216-88a41d17-d101-4546-acfd-0aba38c6fa81.png "")

### 如何通过Docker部署

本地需要确定已经按照了Docker，如果没有安装，请参考 [https://docs.docker.com/install/](https://docs.docker.com/install/)。安装之后这时就可以快速的从远程拉去镜像，拽起一个单机版本的Nacos，体验一下。
简单粗暴，运行以下命令：

```plain
docker run --name nacos-standalone -e MODE=standalone -p 8848:8848 nacos/nacos-server:latest
```

操作试例如下：


![Peek 2018-12-13 11-43.gif | left | 747x407](https://cdn.nlark.com/lark/0/2018/gif/11189/1544701054438-de9785c4-b9ab-46dc-a162-d22e1419a172.gif "")


另一种应用方式，[docker-compose](https://docs.docker.com/compose/)编排方式，可以参照以下命令：

1. git clone 项目 并且进入项目根目录

```powershell
git clone https://github.com/nacos-group/nacos-docker.git
cd nacos-docker
```

2. 启动

* 单机启动

```powershell
docker-compose -f example/standalone.yaml up
```

* 集群启动

```powershell
docker-compose -f example/cluster-hostname.yaml up 
```

这时你的Nacos就已经启动起来，你就可以访问[http://localhost:8848/nacos/index.html](http://localhost:8848/nacos/index.html)体验Nacos的功能了。

#### 配置管理功能体验


![Peek 2018-12-11 10-11.gif | left | 747x351](https://cdn.nlark.com/lark/0/2018/gif/11189/1544496461571-69f38431-6452-4ddd-8211-c2da28f2ebcf.gif "")


#### 服务发现功能体验


![Peek 2018-12-11 11-11.gif | left | 747x351](https://cdn.nlark.com/lark/0/2018/gif/11189/1544521437636-674de542-1873-426b-a2dd-da8265bc267f.gif "")



## 蓬勃发展的 Nacos 社区

> DISS is cheap, show me your hand
> 比吐槽更重要的是搭把手，参与社区一起发展Nacos

* 作为用户关注和加入 Nacos 社区

Nacos 社区正在蓬勃发展，截止到发文为止，Nacos 短短几个月已经有5个微信群，其中4个已满员，1个QQ群，1个钉钉群，关注 Nacos 的社区人数已经近3000人，在 Nacos 群里跟 “道（基）友” 切磋技术，交流经验，招聘交友，抢抢红包...不亦乐乎。

要加入 Nacos 微信社区，你可以通过扫下面的__“超哥”__的微信二维码，让__“超哥”__ 帮你拉入 “Nacos社区微信交流群”



![Screen Shot 2018-06-27 at 13.39.09.png | left](https://cdn.yuque.com/lark/0/2018/png/15914/1530077965587-8f4e3100-bdd4-469a-9ea0-7af7061bc9ef.png "")


* 作为代码贡献者加入 Nacos 社区

从Nacos用户发展而成贡献者顺理成章，而Nacos开发团队也确实在日趋壮大，从开始的只有4个代码contributor发展到目前的24个，随着__阿里巴巴__其他团队成员如 __@小马哥__ 等人，__虎牙直播__的 __@张波__ __@周健__ 团队等人，[nacos-docker-k8s](https://github.com/nacos-group/nacos-docker) 贡献者 __@张龙__，前端的主要贡献者饿了么 __@王彦民__，Spring Cloud中文社区创立者 __@许进__ 等的陆续加入，相信未来Nacos社区的力量未来会越来越强大。




而社区也正在计划在合适的时机上，将在Nacos官网 [nacos.io](http://nacos.io) 中添加团队介绍页，将大家正式公布于众，欢迎大家加入Nacos社区，贡献社区。用Apache的话说，__“社区高于代码”!__



![屏幕快照 2018-11-20 17.04.45.png | left](https://cdn.nlark.com/lark/0/2018/png/15914/1542704700864-a9d54856-9bf6-4176-b449-c13fa02c5800.png "")


## 新人时刻 - "什么是Nacos？"

> 还不知道什么是Nacos? 没关系，在github上star一下跟程序猿兄弟打个招呼吧!!

[Nacos](https://github.com/alibaba/nacos) 是阿里巴巴于7月份新开源的项目，Nacos的主要愿景是期望通过提供易用的 `动态服务发现`、`服务配置管理`、`服务共享与管理` 的基础设施，帮助用户在云原生时代更好的构建、交付、管理自己的微服务平台。



![Screen Shot 2018-07-24 at 19.27.28.png | left](https://cdn.nlark.com/lark/0/2018/png/15914/1532436633419-08a42307-7fb7-4d51-9062-fecc3868613b.png "")


github项目地址在 [这里](https://github.com/alibaba/nacos)

## 更多与 Nacos 相关的开源项目信息

* [Nacos](https://github.com/alibaba/nacos)
* [Dubbo Registry Nacos](https://github.com/dubbo/dubbo-registry-nacos)
* [Nacos DNS-F](https://github.com/nacos-group/nacos-coredns-plugin)
* [Nacos Docker](https://github.com/nacos-group/nacos-docker)
* [Nacos Spring Project](https://github.com/nacos-group/nacos-spring-project)
* [Nacos Spring Boot](https://github.com/nacos-group/nacos-spring-boot-project)
* [Spring Cloud Alibaba](https://github.com/spring-cloud-incubator/spring-cloud-alibaba)
* [Dubbo](http://dubbo.io)
* [Sentinel](https://github.com/alibaba/Sentinel)
* [Spring Cloud](https://projects.spring.io/spring-cloud/)
* [Nepxion Discovery](https://github.com/Nepxion/Discovery)
* [Spring Cloud Gateway Nacos](https://github.com/SpringCloud/spring-cloud-gateway-nacos)
