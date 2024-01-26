---
title: Nacos0.5发布，支持DNS-based Service Discovery，JAVA 11
keywords: [nacos0.5, DNS-based Service Discovery, JAVA 11]
description: Nacos0.5发布，支持DNS-based Service Discovery，JAVA 11
date: "2018-11-25"
category: release
---
# Nacos 0.5版本发布，支持DNS-SD、JAVA 11
> Authors: 坤宇，敦谷


阿里巴巴微服务开源项目[Dubbo Nacos](https://github.com/alibaba/nacos)于本周发布 **v0.5.0** 版本，该版本主要在 DNS-based Service Discovery，支持 TTL，支持 Java 11，优化Nacos产品用户体验，与Spring Cloud Gateway的集成等方面做了演进。

## 发布 DNS-F，支持 DNS-based Service Discovery

为了进一步降低微服务多语言生态、异构系统、Kubernetes体系的服务注册与发现的实现成本，Nacos v0.5.0 发布了一款基于CoreDNS的 **DNS-F**客户端，通过 **DNS-F** 支持将注册在Nacos上的服务以DNS域名的方式暴露出接入点，让三方应用方便的查阅、发现与集成。

![屏幕快照 2018-11-20 17.17.38.png](https://cdn.nlark.com/lark/0/2018/png/15914/1542705469700-1e4ffc48-9632-4495-a8dd-c3dc8647b345.png) 

**DNS-F** 不同于Nacos的 Client SDK/API 服务发现模式，**DNS-F** 提供独立于应用进程的Agent, 通过拦截并代理主机应用的域名解析请求，让Nacos处理服务发现对应域名的数据动态推送更新、健康检查、异常节点下线等、同时Nacos UI提供统一的服务发现域名管理视图 (UI域名管理部分，v0.5.0暂未开放)。

在Nacos的立项之初，提供动态的基于 DNS 协议的服务发现能力就是其核心的三大功能之一，之所以Nacos要提供DNS-SD，主要旨在帮助用户解决三个方面的问题:

* **为Kubernetes以及应用的服务发现提供统一解决方案**

应用微服务体系（如Spring Cloud）+ Kubernetes已经逐渐成为新的组合，通过前者解决应用架构问题，通过后者解决微服务部署及运维的成本问题，但是在服务发现这一块，毫无疑问，Kubernetes体系内的服务发现方案无论是SkyDNS，KubeDNS还是CoreDNS，一直都是基于DNS的，但是像Spring Cloud则是基于像Eureka,zookeeper这样的服务发现方案，这种方案的异化和沟鸿给用户统一服务发现和服务管理方案带来了巨大的挑战。

Nacos DNS-F 目前开源提供的版本，是在CoreDNS的基础上提供了Nacos的plugin [nacos-coredns-plugin](https://github.com/nacos-group/nacos-coredns-plugin), 这样初步打通了CoreDNS与Nacos服务, 这种实现方式为未来Nacos进一步打通Kubernetes集群内部的服务发现与应用服务发现（如Spring Cloud)提供了通路，为Nacos在未来帮助应用以统一的视图管理Kubernetes内部及应用自身的服务及域名提供了基础，从而帮助用户简化基于kubernetes体系的微服务平台的构建与管理。

* **帮助用户消除耦合到厂商私有服务发现API上的风险**

很不幸的说，到目前为止，服务发现迄今仍然没有标准协议，市面上的服务发现的解决方案有很多，仅在Java Spring生态中，就有zookeeper，consul，eureka，nacos等解决方案可以用，更不用说在其它的语言和框架中了，Nacos通过提供 **DNS-F**，可以让用户更容易地实现以DNS协议为基础的服务发现（即**DNS-SD**），而DNS协议是一个成熟的标准协议，基于DNS做服务发现，不仅可以有效的帮助用户消除耦合到厂商私有服务发现API上的风险，方便未来的迁移，也有利于服务提供方以更标准的和易理解的方式暴露自己的服务，从而更易于被不同的应用方发现和集成。

* **支持异构系统及多语言生态的服务发现**

在一个中大型企业中，传统企业架构要升级为云原生微服务架构，遗留系统和异构系统的服务注册与发现无疑是必须首要解决的问题。另外采用微服务架构的一大承诺收益点也在于每个微服务本身可以独立选择更合适的语言栈，但是到目前为止没有个一个服务发现产品能提供各种语言客户端SDK的100%的完全覆盖，以zookeeper为例子，zookeeper质量比较好的客户端仅有java和c的客户端，那么非java和c两个语言体系的服务和系统就很难通过zookeeper来注册与发现，而DNS天然是各种语言都支持的，一般使用DNS做服务发现对应用的侵入非常的小，非常适合遗留应用或者异构应用往新的微服务平台上的迁移。


### 阿里巴巴基于DNS-F的DNS-SD生产实践

以阿里巴巴为例，基于**DNS-F**模式的服务发现已经是阿里巴巴生产环境中的最重要服务发现方式之一，不同于外界对于阿里巴巴的印象，在像阿里妈妈，高德，优酷，搜索等这样的业务中，存在大量的重要的非Java语言体系的业务系统提供的服务，而基于DNS-F的DNS-SD解决方案，则在发现，打通和勾连这些异构服务的过程中起到了举足轻重的作用。

距离阿里巴巴内部发布的第一个python版本的**DNS-F**客户端已经过去**5**个年头，python版本的**DNS-F**客户端在生产上的整体装机使用量，对所有VIPServer各语言客户端的占比已经超过 **1/3**,可见其在内部应用之广泛，而不用绑定在私有的VIPServer API上, 业务从LVS/VIP，SLB等网关式(Server-based SD)服务发现方案迁移过来时对业务侵入小，也是众多业务线愿意优先考虑**DNS-F**客户端的首要原因。

### DNS 协议需要继续演进

DNS协议本身是为www而生，并非为服务发现而生，所以在协议上，用在服务发现场景下DNS依然有不少的小瑕疵需要在未来从协议层面解决，比如DNS缓存TTL收敛的问题，比如操作系统以及各语言对SRV Record字段的支持问题,DNS包大小限制的问题等等，但随着Kubernetes以及微服务体系在各行业的深入应用，可以说DNS协议已经有为服务发现场景做进一步向前演进的必要，这方面阿里巴巴&**Nacos**会做持续的探索和推进。

## 支持 Java 11 

![屏幕快照 2018-11-20 18.13.36.png](https://cdn.nlark.com/lark/0/2018/png/15914/1542708832647-def4c40d-273c-4515-8ee9-27fd9add5b03.png) 

9月25日，Oracle 官方宣布 Java 11正式发布，不同于Java 9以及10，这是继 Java 8 之后的首个长期支持版本，Java 11 在诸如 ZGC，TLS 1.3，新的算法密钥协议，Lambda局部变量语法支持，Standardize HTTP Client API等不少方面做了改进，确实值得关注。

关于 Nacos 支持 Java 11, 这里有一个有趣的花絮,本来Nacos没有计划在近期的版本支持Java 11,因为Nacos团队考虑到 Java 8 依然是生产上的主流(参见[JVM生态报告](https://res.cloudinary.com/snyk/image/upload/v1539774333/blog/jvm-ecosystem-report-2018.pdf), 报告显示 **79%** 的 Java 开发者使用 Java 8 作为生产环境的主要平台), 但是Spring Cloud 大神 **@Josh Long** 在准备尝试和给全世界演示 Nacos 的时候，居然在 Java 11 上跑不起来，于是他毅然的给Nacos提了个 issue [Please support Java 11](https://github.com/alibaba/nacos/issues/214).

> 划重点~ **github上给Nacos提issue是实现你的需求和想法的最佳手段!**

Nacos支持Java 11, 主要是指2个方面的支持

* Nacos 支持运行在Java 11上
* 将Nacos源码开发及构建环境升级到Java 11

现在Nacos的状态是2方面都已经支持 Java 11。

## 使用Nacos实现Spring Cloud Gateway的动态路由

要实现微服务架构，微服务网关必不可少，Nacos 社区目前正在努力跟 Spring Cloud 的微服务网关做更多的打通与集成，Spring Cloud 中文社区创建者,《重新定义Spring Cloud实战》的作者 **@许进** 与近期贡献了如何基于Spring Cloud Gateway与Nacos实现动态路由能力的示例，[github 地址在这里](https://github.com/SpringCloud/spring-cloud-gateway-nacos)，毫无疑问，Spring Cloud Gateway作为所有请求流量的入口，在实际生产环境中为了保证高可靠和高可用，尽量避免重启,需要实现Spring Cloud Gateway 动态路由配置，等到这块足够成熟，会将其包含在Nacos的官方推荐实现中。

## TTL & Health Status Aggregation

在Nacos之前的几个版本中，用户往往会在使用过程中产生疑惑，为什么注册的实例已经下线(宕掉)了，但是依然可以在Nacos控制台上看到实例的信息。这源于SpringCloud以及Dubbo等服务体系中，Eureka或者Zookeeper都有自动注销实例的能力，而且将自动注销作为注册中心的默认行为。但其实当服务的实例下线(宕掉)之后，注册中心有两种可能的行为，一个是将这个实例从服务下的实例列表中剔除出去，一个是保留该实例，只将实例状态置为不健康。Eureka和Zookeeper等注册中心，其实也支持持久化的实例注册，而Nacos只是将这种持久化的注册设成了默认的行为。

Nacos的服务发现模块，是基于内部的VIPServer演化而来。在VIPServer的主要场景中，服务是以域名的方式通过控制台注册到VIPServer的，并且VIPServer非常注重服务级别的元数据信息的定义带来的灵活“软负载”流量调度的能力，所以首要选择的是服务及实例的元数据的持久性存储，弱化了服务的提供端持续向VIPServer服务端发送心跳的能力，所以前期并没有将VIPServer 上报和汇聚实例健康状态的功能放出来。之前版本的服务实例的健康检查，必须由VIPServer服务端来主动发起来完成。但是如Nacos开源之初规划的那样，Nacos会同时支持两种模式

> 对于复杂的云环境和网络拓扑环境中（如 VPC、边缘网络等）服务的健康检查，Nacos 提供了心跳上报模式和服务端主动探测2种健康检查模式。

所以随着Nacos 0.5.0 版本的发布，我们很高兴的宣布，Nacos已经正式支持基于TTL的服务实例自动注销功能。这个功能一部分是响应社区关于TTL功能的需求，更重要的一部分，这也是Nacos服务发现自然演进的一个方向。

从 0.5.0 版本开始，用户通过客户端SDK注册的实例，将默认开启TTL功能，实例会默认每5秒向服务端发送一次心跳，如果Nacos服务端15秒内没有收到实例的心跳，则会将实例置为不健康，如果30秒没有收到心跳，则会将直接将实例删除。Nacos的TTL功能，补充了Nacos作为注册中心在处理实例下线的另一种行为，通过灵活可动态配置的参数，用户还可以根据实际的应用场景任意切换使用这两种行为中的一种。

Nacos的TTL功能虽然还处在实验性质，主要有以下特色：

* **进一步无缝融入SpringCloud生态和Dubbo生态**

Nacos在最初的规划中，就已经计划能够帮助存量用户做无缝平滑迁移。而无缝平滑迁移除了注册中心的功能的完整性，体验、性能、一些重要的认知也能够从老注册中心接续过来。例如Eureka作为Spring Cloud里的主流注册中心，其默认行为就是会在没有收到实例心跳90秒后，将实例自动注销。而 Dubbo 里用的比较多的Zookeeper，也会使用临时节点，依托于Session超时时间来实现TTL功能。这这两种场景中，服务实例的注册基本都是通过服务提供端(Provider)使用注册中心客户端来完成的。Nacos目前已经提供了Spring Cloud体系的服务发现的完整解决方案，同时对Dubbo的适配和支持也会在最近的版本中释放出来。

* **服务级别"元数据(metadata)"不会自动注销**

Nacos支持服务、集群和实例多级别的元数据信息，与服务实例可以被自动注销相对的，服务本身的元数据信息不能随着服务的下线而丢失,因为这些元数据通常是在创建服务时有人为设定上去的（例如负载均衡策略，权重规则，保护阈值等）。这意味着同一个服务的实例的上上下下，再注册上来的时候，应该依然保有服务原来设定的相关的元数据信息。

在Eureka或者Consul中，由于并不支持服务级别设定任何元信息，因此当实例都临时下线时，整个服务也就查询不到任何存在过的痕迹了。而服务级别的元信息作为Nacos的一个非常重要的特色功能，未来会基于此开放一系列流量控制类的特色功能，都决定了Nacos服务本身的元数据信息不能随着服务的下线而丢失，另一方面，在客户端注册实例时，不允许提交服务级别的元信息，这样也保证了单个实例的注册或者注销不会影响服务级别的配置。我们提供了控制台来对服务元数据进行便捷的创建和编辑。

* **将HSF的注册中心ConfigServer融入Nacos**

在阿里巴巴集团内部，著名的HSF的注册中心ConfigServer支持的就是长连接注册模式(renew&TTL)，因此当长连接断开时，自然而然的就会将实例注销掉。为了支持未来将HSF一些优秀的特性迁移和输出到Dubbo上，Nacos会逐渐将ConfigServer的核心能力融入到Nacos当中，而TTL则也是这个事情的基础。

而同时，Nacos非常看中产品在云上的适用性，在公有云上，因为用户往往注册到注册中心的IP是一个VPC的外部IP，因为公有云安全策略的限制，注册中心一般是不允许主动发起到VPC内的连接来做健康检查的，只能通过客户端上报心跳的模式来检查健康状态，也只有在客户端上报的模式下，才能启用自动注销功能。Nacos此次的TTL功能，很好的衔接了公有云和内部ConfigServer输出的需求，为后续的融合做好了初步的准备。

## Spring Cloud for Alibaba with Nacos


![屏幕快照 2018-11-20 16.19.27.png](https://cdn.nlark.com/lark/0/2018/png/15914/1542704490654-b70dcbb2-7bfe-433a-9497-303ba817f860.png) 

就像 SpringOne Platform 2018 大会上 Spring 开发者 @Roy Clarkson 和 @Ollie Hughes 在 **《Cloud-Native Java with Spring Cloud Services》** ([YouTube视频地址](https://www.youtube.com/watch?v=0Yh-cebFkN4&index=108&list=PLAdzTan_eSPQsR_aqYBQxpYTEQZnjhTN6)) 演讲中阐述的那样，采用微服务设计模式，首要的就是选择 “External Configuration” “Service Registry” “Circuite Breaker” 的实现，而 Spring Cloud for Alibaba 这个项目则旨在通过将阿里巴巴在服务化以及阿里云上基于Aliware支撑各行业的微服务产品打包在一个stack里，给你提供开发支撑大规模微服务应用系统的一站式解决方案, 正如项目所述:

> “The Spring Cloud Alibaba project, consisting of Alibaba’s open-source components and several Alibaba Cloud products, aims to implement and expose well known Spring Framework patterns and abstractions to bring the benefits of Spring Boot and Spring Cloud to Java developers using Alibaba products.”

随着 [Spring Cloud for Alibaba 0.2.0 的发布](https://spring.io/blog/2018/10/30/spring-cloud-for-alibaba-0-2-0-released)，Nacos Configuration, Nacos Service Discovery 和 Sentinel Circuite Breaker 都已一网而聚之。

想了解如何在Spring Cloud中快速开始使用 Nacos 做配置中心和服务发现，可以点击[这里](https://nacos.io/docs/latest/ecology/use-nacos-with-spring-cloud/)。

## 持续优化用户体验

正如Nacos团队在开源立项之初发下的宏愿，Nacos希望通过未来团队的持续努力，能给Nacos贴上希望的标签，而追求产品的**极致易用性**永远是Nacos团队的核心关注点之一，Nacos 0.5.0 版本就社区近期反馈较多的的一些体验问题做了积极的修复和优化，这其中包括前端UI的优化，启动状态信息展示的优化,性能调优等等，

[#177](https://github.com/alibaba/nacos/issues/177) Console supports registering new empty service and delete empty service.
[#222](https://github.com/alibaba/nacos/issues/222) print more nacos server start status info in start.log.
[#251](https://github.com/alibaba/nacos/issues/251) Console Editor Optimization.
[#254](https://github.com/alibaba/nacos/issues/254) DataId and group are required in historical version and listener query.
[#258](https://github.com/alibaba/nacos/issues/258) Remove the Balloon of DataId/Group.

更多的优化和release信息见 [nacos github](https://github.com/alibaba/nacos)

![屏幕快照 2018-11-20 18.09.08.png](https://cdn.nlark.com/lark/0/2018/png/15914/1542708581826-76439cb4-9cb8-49d1-af0d-790bdd2249bd.png) 

## 蓬勃发展的 Nacos 社区

>DISS is cheap, show me your hand
>比吐槽更重要的是搭把手，参与社区一起发展Nacos

* 作为用户关注和加入 Nacos 社区

Nacos 社区正在蓬勃发展，截止到发文为止，Nacos 短短几个月已经有5个微信群，其中4个已满员，1个QQ群，1个钉钉群，关注 Nacos 的社区人数已经近3000人，在 Nacos 群里跟 “道（基）友” 切磋技术，交流经验，招聘交友，抢抢红包...不亦乐乎。

要加入 Nacos 微信社区，你可以通过扫下面的**“超哥”**的微信二维码，让**“超哥”** 帮你拉入 “Nacos社区微信交流群”

![Screen Shot 2018-06-27 at 13.39.09.png | left](https://cdn.yuque.com/lark/0/2018/png/15914/1530077965587-8f4e3100-bdd4-469a-9ea0-7af7061bc9ef.png "")

* 作为代码贡献者加入 Nacos 社区

从Nacos用户发展而成贡献者顺理成章，而Nacos开发团队也确实在日趋壮大，从开始的只有4个代码contributor发展到目前的24个，随着**阿里巴巴**其他团队成员如 **@小马哥** 等人，**虎牙直播**的 **@张波** **@周健** 团队等人，[nacos-docker-k8s](https://github.com/nacos-group/nacos-docker ) 贡献者 **@张龙**，前端的主要贡献者饿了么 **@王彦民**，Spring Cloud中文社区创立者 **@许进** 等的陆续加入，相信未来Nacos社区的力量未来会越来越强大。

而社区也正在计划在合适的时机上，将在Nacos官网 [nacos.io](http://nacos.io) 中添加团队介绍页，将大家正式公布于众，欢迎大家加入Nacos社区，贡献社区。用Apache的话说，**“社区高于代码”!** 

![屏幕快照 2018-11-20 17.04.45.png](https://cdn.nlark.com/lark/0/2018/png/15914/1542704700864-a9d54856-9bf6-4176-b449-c13fa02c5800.png) 

## 新人时刻 - "什么是Nacos？"
>还不知道什么是Nacos? 没关系，在github上star一下跟程序猿兄弟打个招呼吧!!

[Nacos](https://github.com/alibaba/nacos) 是阿里巴巴于7月份新开源的项目，Nacos的主要愿景是期望通过提供易用的 `动态服务发现`、`服务配置管理`、`服务共享与管理` 的基础设施，帮助用户在云原生时代更好的构建、交付、管理自己的微服务平台。

![Screen Shot 2018-07-24 at 19.27.28.png](https://cdn.nlark.com/lark/0/2018/png/15914/1532436633419-08a42307-7fb7-4d51-9062-fecc3868613b.png) 

github项目地址在 [这里](https://github.com/alibaba/nacos)

## 更多与 Nacos 相关的开源项目信息

* [Nacos](https://github.com/alibaba/nacos)
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



