---
title: "Star 3w+，向更安全、更泛化、更云原生的 Nacos3.0 演进"
description: "Star 3w+，向更安全、更泛化、更云原生的 Nacos3.0 演进"
date: "2024-09-26"
category: "article"
keywords: ["Nacos"]
authors: "阿里云高级工程师"
---

Nacos社区刚刚迎来了 Star 突破 30000的里程碑，从此迈上了一个新的阶段。感谢大家的一路支持、信任和帮助！！！![](https://img.alicdn.com/imgextra/i2/O1CN01GOW7GC1r8RPwhJVOy_!!6000000005586-0-tps-2098-780.jpg)

**Nacos** `/nɑ:kəʊs/`是 Dynamic **Na**ming and **Co**nfiguration **S**ervice的首字母简称，定位于一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。从 2018 年 7 月开始宣布开源以来，已经走过了第六个年头，在这六年里，备受广大开源用户欢迎，收获许多社区大奖。Nacos 在社区共同的建设下不断成长，逐步的开始帮助用户解决实际问题，助力企业数字化转型，目前已经广泛的使用在国内的公司中，根据微服务领域调查问卷，Nacos 在注册配置中心领域已经成为**国内首选**，占有**50%+国内市场**份额，被**各行各业的头部企业**广泛使用！

![](https://img.alicdn.com/imgextra/i3/O1CN01Shf2qs1efnFrKltqB_!!6000000003899-0-tps-2020-1620.jpg)

![](https://img.alicdn.com/imgextra/i2/O1CN01tPGiOF1eR8a0sAx9w_!!6000000003867-0-tps-2174-1138.jpg)


Nacos社区想借此良辰，回顾一下近两年社区的发展，以及简单进行一下未来的展望和演进的规划。

# 社区回顾
## 从2.0到2.4的版本演进
在过去的两年左右时间， Nacos从`2.0.4`版本演进到了`2.4.2`版本，2.X版本从最初的解决1.X的性能问题逐渐成熟，基本完成了当初构想的`高性能`、`易拓展`的目标，并且对产品的`易用性`和`安全性`进行了提升。

### 插件化能力
在2.0.X版本中，Nacos-Client和Nacos-Server经过对部分gRPC使用问题的修复，解决了1.X架构所带来的性能瓶颈，同时实现了稳定的生产环境运行。Nacos社区开始致力于插件化改造，支持用户灵活实现和定制插件。用户可以根据自身业务需求，通过实现相关的SPI接口和引入jar包，轻松实现自定义的鉴权、加解密和多数据源等附加功能。插件化的升级使Nacos能够充分实现核心功能与多种附加功能的解耦，从而显著增强了可扩展性。

![](https://img.alicdn.com/imgextra/i2/O1CN01P2Mal81SBlu6xBCzx_!!6000000002209-0-tps-2102-1148.jpg)

在过去两年的社区发展中，Nacos推出了多个[插件](https://github.com/nacos-group/nacos-plugin)，包括鉴权、配置加解密、数据源、变更轨迹、限流以及配置变更Hook等。特别值得一提的是`数据源插件`，许多插件实现得到了社区的广泛贡献，并且还有众多公司、团队以及个人根据需求定制适配各类数据源，以满足其业务和部署的需求。

### 安全和易用提升
在Nacos的2.0到2.4版本之间，对默认鉴权插件进行了重要的重构和改进。新版本移除了以往版本中与安全相关的默认值，包括token、身份相关的key-value和管理员密码等。使用鉴权功能时，系统会提供必要的校验和明确的错误提示，以避免因使用默认值而产生的安全风险。此外，Nacos也调整了控制台的登录页面，使其能够与鉴权功能的启用状态同步，防止造成误导。对于未开启鉴权功能的集群，Nacos控制台会显眼地提示用户，并推荐启用鉴权。

除了对默认鉴权的改进和提示，Nacos还新增了全链路TLS功能。这涵盖了客户端与服务端之间的TLS通信，以及服务端之间的TLS通信，确保数据传输的安全性和加密性。

在易用性方面，Nacos在2.0到2.4版本中也做出了显著的改进。例如，新增支持批量注册服务，以满足代理注册和网关等应用场景，并引入了服务订阅的增量通知机制，避免用户需要自己保存和比对服务实例的历史状态；支持Prometheus SD协议，可以方便地将注册到nacos上的微服务，通过SD协议通知promethues进行监控数据的采集。

这些功能的提升和改进，进一步增强了Nacos的安全性和用户体验。

## 新的官网
> “相信一切都是服务，每个服务节点被构想为一个星球，每个服务都是一个星系。Nacos 致力于帮助建立这些服务之间的连接，助力每个面向星辰的梦想能够透过云层，飞在云上，更好的链接整片星空。”
>

Nacos 官网 [https://nacos.io/](https://nacos.io/)是开源产品 Nacos 的官方平台，年均吸引百万级独立访客，受到了广大开发者的关注。在此期间，官网进行了一次较大幅度的更新，主要围绕提升用户体验，着重关注开发者的核心需求。

### 解决Nacos下载和文档版本混乱问题
首先，为了解决开发者在 GitHub 下载时遇到的速度慢的问题，我们增强了 Nacos 的官方下载渠道。

在文档结构方面，我们进行了优化，新版本的文档将按照不同版本进行拆分，以避免之前出现的文档与新版本特性不一致的问题。同时，用户可以直接访问预览版文档，从而提升文档的更新效率。

![](https://img.alicdn.com/imgextra/i2/O1CN01nFXJrb1NJwte9ttX2_!!6000000001550-0-tps-2132-496.jpg)

### 电子书在线预览和博客文章分类
升级后的新官网也新增了《Nacos 架构与原理》电子书的预览版本，便于用户在线查阅。帮助用户快速理解Nacos的架构与原理，更好的使用Nacos。

另外对之前的博客文章进行了分类展示，有技术含量较高的技术博客、有社区的新闻和活动等等，帮助官网访问者快速找到自己感兴趣的内容进行阅读。

![](https://img.alicdn.com/imgextra/i3/O1CN01UMer761i6lQQeZi9M_!!6000000004364-0-tps-2104-956.jpg)

### 使用大模型进行专家答疑
最后，升级后的新官网引入了通义大模型，针对社区中常见问题进行了训练，在官网中提供了`专家答疑`功能。社区用户可以就`微服务`和 `Nacos 相关问题`进行咨询，借助大模型的搜索和推理能力，为用户提供解决方案。

![](https://img.alicdn.com/imgextra/i2/O1CN01BFMNAb1PpfYfjBqyG_!!6000000001890-0-tps-2114-696.jpg)

![](https://img.alicdn.com/imgextra/i4/O1CN01o17rPu1OfIyovbL3X_!!6000000001732-0-tps-890-2190.jpg)

## 多语言和更多生态支持
同时多语言上，`Go-SDK`也已经追平`Java-SDK`的功能和稳定性，`Python-SDK`也发布了稳定版，并正在积极适配`2.X`版本的新特性，另外社区中也有很多优秀的生态组建。

### Nacos-Go-SDK
随着Nacos 2.X的稳定，Nacos的[go-sdk](https://github.com/nacos-group/nacos-sdk-go)率先开始进行Nacos 2.X的适配工作并于2022年2月发布第一个适配Nacos 2.X的版本`2.0.0`，随着2年左右的演进，目前Nacos的go-sdk在功能和特性上已经追平了Nacos的Java-sdk，并且在稳定性上也不逊色于Java-sdk，许多以Go语言为主的头部企业已经大规模使用新版本的Go-sdk。

### Nacos-Python-SDK 和 Nacos-Rust-SDK
随着AI大模型技术的火爆， 越来越多的Python应用和AI应用希望使用Nacos的注册&配置管理能力，来进行服务的发现、配置的动态变更以及prompt的动态发布等，Nacos社区的[Python-SDK](https://github.com/nacos-group/nacos-sdk-python)活跃度也随之增加；很快Python-SDK在进行了较多验证和修改后， 正式发布第一个稳定版本`1.0.0`，同时对于Nacos2.X和高版本Python的适配也正在如火如荼的进行。

另外Rust语言作为近两年的语言新宠，社区的小伙伴和贡献者们也是热情高涨，很快就在社区中发布了对应的[Rust-SDK](https://github.com/nacos-group/nacos-sdk-rust)，并持续进行维护和更新；目前已经发布到`0.4.2`版本。

### R-Nacos 和 nginx-nacos-upstream
除了各类多语言SDK， Nacos社区中也加入了其他生态项目，如[r-nacos](https://github.com/nacos-group/r-nacos?tab=readme-ov-file)通过rust重构Nacos-Server的项目，可以在一些对资源占用极其敏感的场景使用，加入社区后始终保持高频更新，已经更新至`0.5.23`版本，足够于本地开发和测试环境使用，释放更多本地资源，提升本地运行效率。

`nginx`作为反向代理和网关，在过去的十年里一直经久不衰；但其配置无法动态更新，只能通过`reload`命令进行配置的重载一直被社区所诟病。[nginx-nacos-upstream](https://github.com/nacos-group/nginx-nacos-upstream)项目就是希望使用nacos来解决nginx的动态配置问题，项目开发者近期将项目贡献至Nacos社区，并保持持续的维护和更新。

# 未来展望
![](https://img.alicdn.com/imgextra/i2/O1CN01ioxLZx21VTUYsrOlz_!!6000000006990-0-tps-2088-964.jpg)

## Nacos 3.0
Nacos 2.X版本随着插件化逐渐完善，功能已经趋于稳定。Nacos社区在去年已经开始想社区用户征集Nacos3.0中希望的功能和方向。在众多的反馈中，我们能够展望Nacos3.0将着重于`更安全`，`更泛用`，`更云原生`进行演进。

### 更安全
虽然Nacos 2.X中已经对安全性进行了一定程度的增强，但还不足以达到默认安全的程度；同时随着Nacos的用户越来越多、影响力越来越大，更多的攻击者开始关注Nacos，这需要Nacos在3.0版本中对安全方面的内容进行更多的投入。

因此Nacos社区计划在3.0版本中， 对默认的鉴权插件进行升级，同时将API进行重新的梳理和设计，区分`Console API（控制台API)`、`Client API（客户端API）`、`Admin API（运维API）`和`Inner API（内部通信API）`，并针对不同的API类型采取不同的鉴权手段，提升Nacos的安全性，降低安全风险。

另外，Nacos 3.0也计划拆分Nacos控制台和Nacos引擎的部署架构，允许Nacos控制台使用不同的端口和不同的进程启动，从部署架构层面和网络层面对访问来源进行进一步的限制，以提升安全性。

![](https://img.alicdn.com/imgextra/i4/O1CN01wJx4de1xwGC5EmlPq_!!6000000006507-49-tps-1500-1232.webp)

### 更泛用
Nacos 之前的应用场景根据聚焦在微服务领域和分布式高可用领域，并伴随一些动态分发和管理的场景。

在Nacos 3.0版本中，Nacos将会支持分布式锁、按照分组订阅配置和服务等功能，以便能够支持一些分布式协调、更多网关类型的使用场景。

同时Nacos 3.0也会尝试向AI方向的使用场景进行探索，比如动态prompt、训练任务调度分配等场景。让Nacos `More than Microservice`。

![](https://img.alicdn.com/imgextra/i2/O1CN01ZlHkiy1fGQwKMv1Wg_!!6000000003979-0-tps-2102-1056.jpg)

### 更云原生
<font style="color:rgb(53, 56, 65);">Nacos在2.X版本已支持了MCP协议及简单XDS协议，进行了初步的生产环境实践，但这需要依赖于Istio等组件进行协议数据的聚合以及二次下发，这增加了运维成本和问题的排查链路。未来，我们将通过开展以下工作来提供云原生支持： </font>

<font style="color:rgb(53, 56, 65);">1、 原生支持XDS协议，可直接提供完整的XDS协议数据和内容，可选的去除关于Istio等组件的依赖，减轻部署和运维负担。</font>

<font style="color:rgb(53, 56, 65);">2、打通Kubernetes数据，进行数据的双向同步，帮助用户更好的解决传统部署架构和Kubernetes部署的互通场景，同时提供ServiceMesh化支持，将Nacos发展成云原生时代高性能注册中心，接入Kubernetes核心生态。</font>

<font style="color:rgb(53, 56, 65);">3、提供轻量级的Nacos Sidecar，为用户提供零侵入、轻量级的服务注册与发现能力。</font>

## 质量体系重构
Nacos 2.X在社区的努力和积极贡献下快速发展，在插件化能力、安全和易用性上有了极大提升；但是我们也发现在这个过程中，虽然社区一直在补充单元测试、以及贡献了[nacos-e2e](https://github.com/nacos-group/nacos-e2e)并在每次提交后的触发运行，Nacos的质量体系逐渐不足以支撑社区的高速发展；

因此在后续的规划中，Nacos社区不仅会继续补充测试用例，完善[nacos-e2e](https://github.com/nacos-group/nacos-e2e)的运行，同时也会对集成测试的流程和用例进行彻底的重构，提升Nacos每次发布的质量。

# 感谢社区参与者
Nacos的成就和快速发展，离不开社区贡献者和其他参与者的热情贡献和积极参与，在过去的1W star过程中，Nacos社区**新增了200位贡献者**，同时有1**0+位的贡献者成为社区的Committer**。再次感谢大家的参与和对Nacos不足的体谅。

同时Nacos也积极参与社会各界举办的开源活动，比如中国科学院软件研究所的开源之夏、<font style="color:rgb(32, 45, 64);">GitLink的编程夏令营、天池的通义灵码活动等等。获得了很多开源奖项和认可。</font>

![](https://img.alicdn.com/imgextra/i1/O1CN01Xt9Mi21MeGr0Cyrht_!!6000000001459-0-tps-2116-978.jpg)

| ![](https://img.alicdn.com/imgextra/i2/O1CN01sHvCr51Z4d2Iwp3Ol_!!6000000003141-0-tps-790-1048.jpg) | ![](https://img.alicdn.com/imgextra/i3/O1CN01rH99si1EK6UMRivXV_!!6000000000332-0-tps-1194-842.jpg) |
| --- | --- |
| | |


<font style="color:rgb(53, 56, 65);">最后再次感谢所有参与Nacos社区和活动的用户、贡献者、Committer，非常感谢你们的付出！我们一起让Nacos更强大！！！同时也欢迎更多加入社区贡献者队伍，共同进行Nacos云原生化实践！</font>

![](https://img.alicdn.com/imgextra/i4/O1CN01qOYVoX1DsAKLKzfGh_!!6000000000271-49-tps-1080-1177.webp)




