---
title: Nacos 0.8.0版本进行发布
keywords: [nacos0.8, nacos0.8.0, nacos 发布]
description: Nacos 0.8.0版本进行发布
date: "2019-01-20"
category: release
---

# Dubbo Nacos 发布 v0.8.0 PRE-GA版本，安全稳定上生产

阿里巴巴微服务开源项目?[Dubbo Nacos](https://github.com/alibaba/nacos)? 于本周发布?**v0.8.0**?**PRE-GA**版本，终于初步完成了Road Map一个重要的里程碑版本（第一个可安全上生产的版本，特别感谢在前期勇于在生产上尝试Nacos的客户，社区会尽快寄出小礼品，表达对大家的感激之情），V0.8.0 版本主要在支持了登录、命名空间、Metrics监控（对接Prometheus）、通过Nacos-Sync 组件支持从传统的注册中心平滑的往Nacos服务数据迁移等特性，以更稳定和更高可用的姿态让用户在生产环境中支撑大家的微服务平台。

### Nacos 登录
Nacos控制台支持登录、登出特性，以便更安全的上生产使用。<br />![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/9687/1548047848570-c92c232f-13eb-41e3-a8af-0660e3a58912.png#align=left&display=inline&height=894&linkTarget=_blank&name=image.png&originHeight=1430&originWidth=2876&size=195009&width=1797)


### 命名空间
Nacos自0.5.0版本支持命名空间以来，配置服务先支持了命名空间，服务发现模块则在这个0.8.0版本支持了多命名空间，使用服务发现的命名空间可以实现服务数据的逻辑隔离。使用服务发现模块的多命名空间与配置模块基本相同，在Nacos控制台上查看想要使用的命名空间ID，在客户构造时传入该命名空间ID：

```java
Properties properties = new Properties();

properties.put(PropertyKeyConst.NAMESPACE, "74a3dbb9-36cb-43f5-8d31-006acfd61caa");

properties.put(PropertyKeyConst.SERVER_ADDR, "127.0.0.1:8848");

NamingService naming = NamingFactory.createNamingService(properties);
```

这样通过这个NamingService实例读写的就都是命名空间74a3dbb9-36cb-43f5-8d31-006acfd61caa下的数据了。当然您也可以不指定命名空间ID，这样将会默认分配到public命名空间。发布完服务可以到Nacos控制台上查询服务信息：<br />![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/9687/1548312345294-d4bd95df-7e6d-4a36-8827-6a7ac0a00985.png#align=left&display=inline&height=553&linkTarget=_blank&name=image.png&originHeight=830&originWidth=1904&size=131287&width=1269)

### Metrics监控
通过Metrics信息暴露，对接Prometheus加强Nacos实时监控，以便让用户对产品更有控制力。

Nacos 通过micrometer统计了运行时的核心指标：
* 系统指标包括cpu load jvm等
* 业务指标包括配置数，域名数，长连接，QPS，RT等
* 异常指标记录了Nacos运行的内部异常micrometer提供了转化器能转化成多种metrics格式，Nacos目前支持常用的prometheus、elastic search和influxdb，后续可以根据具体情况进行调整。

<br /><br />grafana具备强大的的数据可视化能力，能将采集的数据展示出来，支持多种数据源。同时可对重要指标配置告警规则，数据达到阈值时可以通知相关负责人。<br />Nacos官网提供了结合prometheus和grafana实现metrics监控<br /><br /><br />![](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/53357/1548122164953-6011a9ee-a521-447c-a871-7ebcf10c2ce4.png#align=left&display=inline&height=417&linkTarget=_blank&originHeight=1584&originWidth=2832&size=0&width=746)

具体的详情可以参考官网[监控文档](https://nacos.io/docs/v1/guide/admin/monitor-guide/)。
### 
### Nacos-Sync 支持服务平滑迁移

提供Nacos-Sync同步工具支持用户做服务数据的平滑迁移迁移，支持用户从其他注册中心平滑迁移到Nacos上来，同时支持多个Region独立Nacos服务同步，目前Nacos-Sync支持的源注册中心主要包括ZooKeeper,Eureka等。

#### 使用场景
* 双向同步功能,支持Dubbo+Zookeeper服务平滑迁移到Dubbo+Nacos,享受Nacos更加优质的服务

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/4232/1548136490076-13655b30-b0e4-4363-95dc-72b79a080fc0.png#align=left&display=inline&height=246&linkTarget=_blank&name=image.png&originHeight=838&originWidth=1728&size=171454&width=508)

* 多个网络互通的Region之间服务共享,打破Region之间的服务调用限制

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/4232/1548136895122-ba2be529-d959-4c9d-9fa4-74059bce1d18.png#align=left&display=inline&height=399&linkTarget=_blank&name=image.png&originHeight=798&originWidth=1136&size=64731&width=568)

#### 支持的范围
Nacos-Sync支持用户扩展不同注册中心服务同步，目前已支持的同步类型如下:
* Nacos数据同步到Nacos
* Zookeeper数据同步到Nacos
* Nacos数据同步到Zookeeper
* Eureka数据同步到Nacos
* Consul数据同步到Nacos

#### 配置同步服务
Nacos-Sync提供了控制台方便你配置同步的服务数据:
* 同步任务管理页面

![](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/4232/1548129423366-e1a37af4-3eb6-48f0-af76-84ec1f310ee2.png#align=left&display=inline&height=277&linkTarget=_blank&originHeight=1064&originWidth=2866&width=746)
* 注册中心管理页面
## ![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/4232/1548129453620-f480a696-931b-4db4-b4c7-298ae7da029e.png#align=left&display=inline&height=562&linkTarget=_blank&name=image.png&originHeight=1124&originWidth=2876&size=190668&width=1438)

具体项目信息请参考[Nacos-Sync产品页](https://github.com/nacos-group/nacos-sync)

## 蓬勃发展的 Nacos 社区

> DISS is cheap, show me your hand
比吐槽更重要的是搭把手，参与社区一起发展Nacos


* 作为用户关注和加入 Nacos 社区

Nacos 社区正在蓬勃发展，截止到发文为止，Nacos 短短几个月已经有 9 个微信群，其中 7 个已满员，1个QQ群，1个钉钉群，关注 Nacos 的社区人数已经近5000人，在 Nacos 群里跟 “道（基）友” 切磋技术，交流经验，招聘交友，抢抢红包...不亦乐乎。

要加入 Nacos 微信社区，你可以通过扫下面的**“超哥”**“超哥”** 帮你拉入 “Nacos社区微信交流群”


![](https://intranetproxy.alipay.com/skylark/lark/0/2019/png/9687/1548047927520-89c34af8-899a-41b6-887c-9319461db519.png#align=left&display=inline&height=424&linkTarget=_blank&originHeight=1124&originWidth=1984&size=0&width=748)

* 作为代码贡献者加入 Nacos 社区

从Nacos用户发展而成贡献者顺理成章，而Nacos开发团队也确实在日趋壮大，从开始的只有4个代码contributor发展到目前的34个，在0.8.0 版本的开发中，社区同学贡献了很大的力量，在此特别感谢戚月同学设计登录UI，黄清昊同学贡献登录代码，王彦民同学贡献命名空间代码，张龙同学贡献nacos-sync代码，李晨同学贡献配置管理代码，明亦同学保证这个关键版本的测试质量，相信后续有跟多同学参与到Nacos社区的共建中。

而社区也正在计划在合适的时机上，将在Nacos官网 [nacos.io](http://nacos.io/) 中添加团队介绍页，将大家正式公布于众，欢迎大家加入Nacos社区，贡献社区。用Apache的话说，**“社区高于代码”!**


![](https://cdn.nlark.com/lark/0/2018/png/15914/1542704700864-a9d54856-9bf6-4176-b449-c13fa02c5800.png#align=left&display=inline&height=387&linkTarget=_blank&originHeight=888&originWidth=1716&width=748)

## [](https://yuque.alibaba-inc.com/nacos/opensource/dawygn#6gw6hq)新人时刻 - "什么是Nacos？"
> 还不知道什么是Nacos? 没关系，在github上star一下跟程序猿兄弟打个招呼吧!!


[Nacos](https://github.com/alibaba/nacos) 是阿里巴巴于7月份新开源的项目，Nacos的主要愿景是期望通过提供易用的 `动态服务发现`、`服务配置管理`、`服务共享与管理` 的基础设施，帮助用户在云原生时代更好的构建、交付、管理自己的微服务平台。


![](https://cdn.nlark.com/lark/0/2018/png/15914/1532436633419-08a42307-7fb7-4d51-9062-fecc3868613b.png#align=left&display=inline&height=355&linkTarget=_blank&originHeight=1014&originWidth=2138&width=748)

github项目地址在 [这里](https://github.com/alibaba/nacos)

## [](https://yuque.alibaba-inc.com/nacos/opensource/dawygn#kn9iog)更多与 Nacos 相关的开源项目信息

* [Nacos](https://github.com/alibaba/nacos)
* [Dubbo Registry Nacos](https://github.com/dubbo/dubbo-registry-nacos)
* [Nacos DNS-F](https://github.com/nacos-group/nacos-coredns-plugin)
* [Nacos Docker](https://github.com/nacos-group/nacos-docker)
* [Nacos Spring Project](https://github.com/nacos-group/nacos-spring-project)
* [Nacos Spring Boot](https://github.com/nacos-group/nacos-spring-boot-project)
* [Spring Cloud Alibaba](https://github.com/spring-cloud-incubator/spring-cloud-alibaba)
* [Dubbo](http://dubbo.io/)
* [Sentinel](https://github.com/alibaba/Sentinel)
* [Spring Cloud](https://projects.spring.io/spring-cloud/)
* [Nepxion Discovery](https://github.com/Nepxion/Discovery)
* [Spring Cloud Gateway Nacos](https://github.com/SpringCloud/spring-cloud-gateway-nacos)

