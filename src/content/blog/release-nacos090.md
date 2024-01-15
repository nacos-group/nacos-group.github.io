---
title: Nacos 0.9.0版本进行发布
keywords: [nacos0.9，nacos0.9.0，nacos]
description: Nacos 0.9.0版本进行发布
date: "2019-03-07"
category: release
---
# Nacos 0.9.0 发布，稳定的快速迭代
天下武功，唯快不破，Nacos一直秉承着稳定性和快速迭代，Nacos 0.9.0版本于上周正式发布release，功能围绕着，Nacos-Sync的稳定性、Server功能拆分部署、Nacos python语言体系的支持，并且在此基础之上，Nacos首次发布核心团队人员，并在持续招募中。


## Nacos-Sync稳定性提升
### Nacos-Sync简介
[Nacos-Sync](https://github.com/nacos-group/nacos-sync)是Nacos的核心组件，作用是多注册中心数据同步的功能工具，目前支持的同步注册中心包括 Nacos、Zookeeper、Eureka和Consul，主要场景，包括多注册中心数据互相同步，注册中心升级过程的数据迁移，官网提供[迁移操作手册](https://nacos.io/en-us/docs/nacos-sync-use.html)。
### 0.9.0 增强稳定性
Nacos 0.9的主线功能加强[Nacos-Sync](https://nacos.io/en-us/docs/nacos-sync.html)的稳定性，一方面增强Nacos-Sync的基础测试用例覆盖面，保证Nacos-Sync以后的快速迭代过程中主线功能稳定性，另一方面通过监控体系的完善，对接了Prometheus通过metrics暴露数据，并且天然集成grafana监控，保证了Nacos-Sync生产级别稳定性。
随着Nacos 0.9.0版本发布，Nacos-Sync 0.3版本支持了metrics监控，能通过metrics数据观察Nacos-Sync服务的运行状态，提升了Nacos-Sync的在生产环境的监控能力。

### 使用Prometheus采集Nacos-Sync metrics数据
继 Kubernetes 之后，Prometheus成为第二个正式从 CNCF 毕业的开源项目。Nacos及Nacos-Sync支持Prometheus metrics也是Nacos拥抱云原生的第一步。Prometheus作为新一代的云原生监控系统，除了能对Kubernetes容器集群进行监控之外，也能对容器中的应用进行监控。不过Prometheus的数据展示能力比较差，一般会借助第三方数据监控平台。

### grafana监控Nacos-Sync
Grafana是一款强大的数据可视化开源软件，能通过非常漂亮的图表和曲线展示监控数据，支持多种数据源，包括Prometheus。

和Nacos监控一样，官网给Nacos-Sync也提供了监控模版，简单的几步就可以很方便地在Grafana上监控Nacos-Sync

Nacos-Sync监控同样也分为三个模块:

* nacos-sync monitor展示核心监控项 
![monitor](https://img.alicdn.com/tfs/TB1GeNWKmzqK1RjSZFHXXb3CpXa-2834-1588.png)
* nacos-sync detail和alert两个模块的展示监控曲线和告警
![detail](https://img.alicdn.com/tfs/TB1kP8UKbvpK1RjSZPiXXbmwXXa-2834-1570.png)

## Nacos Server功能拆分部署
### 为什么要拆分部署
一般公司随着业务规模的不断膨胀，我们建议业务对注册中心和配置中心进行拆分部署，在Nacos 0.9.0版本以后，支持注册中心模块和配置中心模块的拆分部署，在启动命令进行加入参数，来指定启动指定Nacos 功能模块，默认全部功能启用，目前支持指定配置中心模块和注册中心模块。
### 使用方法
启动Nacos server时候，增加`-f`参数，意思是function mode，和对应模块标示来进行启动，如果不传，或者传入有误，都将启动全部功能。
配置中心参数对应`config`，注册中心参数对应`naming`。
#### 启动命令
```
sh startup.sh -m standalone -f naming
```
启动之后，你可以通过启动日志头看到是否正确启动了功能模块，并且Nacos console将只展现启动的对应模块。

* Nacos启动日志头信息
![](https://img.alicdn.com/tfs/TB1ADCrKAvoK1RjSZFDXXXY3pXa-1552-522.jpg)
* 单独启动配置中心的控制台示例
![](https://img.alicdn.com/tfs/TB1sXyoKpzqK1RjSZFCXXbbxVXa-2674-940.png)
* 单独启动注册中心的控制台示例
![](https://img.alicdn.com/tfs/TB1yKyiKCzqK1RjSZFLXXcn2XXa-2680-738.png)

## Nacos python语言体系的支持
Nacos开始支持python语言体系，兼容Nacos0.8.0版本，[Nacos-sdk—Python](https://github.com/nacos-group/nacos-sdk-python)在github上的[Nacos-Group](https://github.com/nacos-group)中,支持的Python版本包括 2.7、3.6和3.7，操作简单，一行命令安装，可以在仓库中看到详细的[使用说明](https://github.com/nacos-group/nacos-sdk-python/blob/master/README.md)，感谢周文同学的贡献。

## Nacos 团队页悄悄上线
在Nacos 0.9.0的版本中，Nacos官网 [nacos.io](http://nacos.io/)上线了Nacos社区的核心Committer团队首次和大家见面，[Nacos 核心团队页](https://nacos.io/en-us/docs/nacos-dev.html)，并且社区团队在持续扩大中，[Nacos的社区有着自己的社区共建规范](https://nacos.io/en-us/docs/contributing-dev.html)，并且在吸收新人上，不仅仅是需要开发者，还需要测试大牛、文档贡献者和社区管理者。我们鼓励大家积极参与Nacos社区，社区有一套机制可以使您，从用户角色到提交者角色，甚至是PMC角色。

### 如何共建
为了实现这一目标，你需要积极参与Nacos社区。如果您在文档中发现拼写错误，在代码中发现错误，或想要新功能或想要提供建议，您可以[在GitHub上创建一个issues](https://github.com/alibaba/Nacos/issues/new)。

如果您想开始着手，可以选择github仓库中有以下标签的issues。

 -  [good first issue](https://github.com/alibaba/nacos/labels/good%20first%20issue)：对于新手来说是非常好的入门issues。
 
 -  [contribution welcome](https://github.com/alibaba/nacos/labels/contribution%20欢迎)：非常需要解决的问题和非常重要的模块，但目前缺少贡献者，欢迎贡献者来贡献。

 
除了以上的通用标签，还可以关注Nacos目前重点关注的多语言共建招募，[C++、PHP的多语言核心贡献者招募](https://github.com/alibaba/nacos/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+recruit+client)，和并且还有[社区群组负责人招募](https://github.com/alibaba/nacos/issues/787)，欢迎大家加入Nacos社区，贡献社区。用Apache的话说，**“社区高于代码”!**。

## 蓬勃发展的 Nacos 社区

> DISS is cheap, show me your hand
比吐槽更重要的是搭把手，参与社区一起发展Nacos


* 作为用户关注和加入 Nacos 社区

Nacos 社区正在蓬勃发展，截止到发文为止，Nacos 短短几个月已经有 9 个微信群，其中 7 个已满员，1个QQ群，1个钉钉群，关注 Nacos 的社区人数已经近5000人，在 Nacos 群里跟 “道（基）友” 切磋技术，交流经验，招聘交友，抢抢红包...不亦乐乎。

要加入 Nacos 微信社区，你可以通过扫下面的**“超哥”**“超哥”** 帮你拉入 “Nacos社区微信交流群”


![](https://img.alicdn.com/tfs/TB1q6SBKq6qK1RjSZFmXXX0PFXa-1984-1124.png)

* 作为代码贡献者加入 Nacos 社区

从Nacos用户发展而成贡献者顺理成章，而Nacos开发团队也确实在日趋壮大，从开始的只有4个代码contributor发展到目前的39个，在0.9.0 版本的开发中，社区同学贡献了很大的力量，在此特别感谢，他们的githubId是（注：不分先后） paderlol、jifengnan、loadchange、nkorange、hxy1991、huangyunbin、darkness463、luoxn28、TsingLiang、xuechaos、nanamikon、systp、jameslcj、pader.zhang，相信后续有跟多同学参与到Nacos社区的共建中。



![](https://cdn.nlark.com/lark/0/2018/png/15914/1542704700864-a9d54856-9bf6-4176-b449-c13fa02c5800.png#align=left&display=inline&height=387&linkTarget=_blank&originHeight=888&originWidth=1716&width=748)

## [](https://github.com/alibaba/nacos)新人时刻 - "什么是Nacos？"
> 还不知道什么是Nacos? 没关系，在github上star一下跟程序猿兄弟打个招呼吧!!


[Nacos](https://github.com/alibaba/nacos) 是阿里巴巴于7月份新开源的项目，Nacos的主要愿景是期望通过提供易用的 `动态服务发现`、`服务配置管理`、`服务共享与管理` 的基础设施，帮助用户在云原生时代更好的构建、交付、管理自己的微服务平台。


![](https://img.alicdn.com/tfs/TB1pCyAKpzqK1RjSZSgXXcpAVXa-1910-894.png)

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




