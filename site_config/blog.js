export default {
  'en-us': {
    barText: 'Blog',
    postsTitle: 'All posts',
    list: [
        {
            title: '小米Nacos2.0扩缩容最佳实践',
            author: '@胡俊 小米武汉研发部资深开发',
            dateStr: 'August 5, 2022',
            desc: '小米集团的Nacos集群升级到了2.0.3版本之后，一直在开启双写的情况下运行稳定，动态的服务发现与分布式配置中心的能力也满足我们的预期，但随着使用我们集群的体量越来越大，需要对集群进行扩容，但在实际操作过程中遇到了一些问题，这篇文章主要总结一下集群扩缩容中遇到问题的解决过程和集群扩缩容步骤。',
            link: '/zh-cn/blog/xiaomi-scale.html',
        },
        {
            title: 'Nacos开源之夏2022，贡献社区赢取12000奖金',
            author: '@Nacos开源之夏',
            dateStr: 'May 16, 2022',
            desc: '欢迎在校同学们参与Nacos开源之夏，社区导师手把手让**你的代码被社会广泛复用，来赚取最高12000奖金，可**推荐入职/实习你心意公司，**又拿钱又成长又有价值**，你还等什么呢？报名马上截止，快来参与Nacos开源之夏。',
            link: '/zh-cn/blog/iscas2022.html',
        },
        {
            title: 'Nacos 2.1.0 is released, supporting authentication and encryption plugins',
            author: '@杨翊',
            dateStr: 'Apr 29, 2022',
            desc: 'Nacos 2.1.0 is released, supporting authentication and encryption plugins',
            link: '/en-us/blog/2.1.0-release.html',
        },
        {
            title: 'Install the HA Nacos cluster in Rainbond with one-click',
            author: '@郭逊(guox@goodrain.com)',
            dateStr: 'Mar 16, 2022',
            desc: 'Current documentation describes how to install a high availability Nacos cluster with one click through Rainbond, a cloud native application management platform.',
            link: '/en-us/blog/use-nacos-with-rainbond.html',
        },
        {
            title: 'Apache APISIX Realizes Service Discovery Based on Nacos',
            author: '@Zhihuang Lin(2228586315@qq.com)',
            dateStr: 'Feb 22, 2022',
            desc: 'This article introduces the basic concepts of Apache APISIX and Nacos and Service Registry, and shows you the specific operation of Apache APISIX to realize service discovery based on Nacos.',
            link: '/en-us/blog/apisix.html',
        },
        {
            title: '双十一献礼 | Nacos Star破两万的回顾与展望',
            author: '@涌月 @彦林 @席翁',
            dateStr: 'Nov 3, 2021',
            desc: '双十一献礼 | Nacos Star破两万的回顾与展望',
            link: '/zh-cn/blog/up-to-2w-star.html',
        },
        {
            title: 'Nacos 2.0.3 Release, continue to improve stability.',
            author: '@杨翊',
            dateStr: 'July 29, 2021',
            desc: 'Nacos 2.0.3 Release, continue to improve stability.',
            link: '/en-us/blog/2.0.3-release.html',
        },
        {
            title: 'Nacos ISCAS 2021 start to apply!',
            author: '@杨翊',
            dateStr: 'May 25, 2021',
            desc: 'Nacos ISCAS 2021 start to apply!',
            link: '/en-us/blog/iscas2021.html',
        },
        {
             title: 'Nacos 2.0.1 + 1.4.2 Release, with the supporting of the MCP-OVER-XDS protocol!',
             author: '@涌月',
             dateStr: 'May 10, 2021',
             desc: 'Nacos 2.0.1 + 1.4.2 Release, with the supporting of the MCP-OVER-XDS protocol!',
             link: '/en-us/blog/2.0.1-release.html',
        },
        {
            title: 'Suggestions for fixing Nacos authentication vulnerability',
            author: '@席翁',
            dateStr: 'Jan 15, 2021',
            desc: 'Suggestions for fixing Nacos authentication vulnerability',
            link: '/en-us/blog/nacos-security-problem-note.html',
        },
        {
            title: 'Nacos 1.4.0 + Go SDK 1.0.1 Release!',
            author: '@席翁',
            dateStr: 'Nov 2nd, 2020',
            desc: 'Nacos 1.4.0 + Go SDK 1.0.1 Release!',
            link: '/en-us/blog/1.4.0-release.html',
        },
        {
            title: 'v0.5.0 of Nacos-sdk-csharp was released! Capabilities aligned with Java SDK！',
            author: '@席翁',
            dateStr: 'Sep 3rd, 2020',
            desc: 'v0.5.0 of Nacos-sdk-csharp was released! Capabilities aligned with Java SDK！',
            link: '/en-us/blog/csharp-0.5.0.html',
        },
        {
            title: 'Nacos 2nd anniversary, Nacos 1.3.2 + Go SDK 1.0.0 released',
            author: '@席翁',
            dateStr: 'Aug 5th, 2020',
            desc: 'Nacos 2nd anniversary, Nacos 1.3.2 + Go SDK 1.0.0 released',
            link: '/en-us/blog/nacos-2nd-anniversary.html',
        },
        {
            title: 'More participation, More offers',
            author: '@春少',
            dateStr: 'July 14th, 2020',
            desc: 'A feeling description from a classmate of ASoC-2019',
            link: '/en-us/blog/feeling-of-ASoC-2019.html',
        },
        {
            title: 'Nacos 1.3.0 new kernel construction process',
            author: '@春少',
            dateStr: 'Fri 12th, 2020',
            desc: 'This 1.3.0 is implanted to a great extent, involving the modification of two large modules and the addition of a core module',
            link: '/en-us/blog/nacos-1.3.0-design.html',
        },
        {   title: 'Nacos 1.2.0权限控制介绍和使用',
            author: '@敦谷',
            dateStr: 'Mar 10th, 2020',
            desc: 'Nacos是阿里巴巴开源的服务发现与配置管理项目，本次发布的1.2.0版本，主要带来的是权限控制',
            link: '/en-us/blog/nacos 1.2.0 guide.html',
        },
        {   title: '命名空间和endpoint最佳实践',
            author: '@得少',
            dateStr: 'Dec 6, 2019',
            desc: '随着使用 Nacos 的企业越来越多，遇到的最频繁的两个问题就是：如何在我的生产环境正确的来使用 namespace 以及 endpoint',
            link: '/en-us/blog/namespace-endpoint-best-practices.html',
        },
        {   title: 'Pilot MCP协议介绍',
            author: '@敦谷',
            dateStr: 'Nov 20, 2019',
            desc: 'Istio是目前主流的Service Mesh组件。Istio基于Service Mesh的理念，承担着服务发现、服务通信、负载均衡、限流熔断、监控等等功能',
            link: '/en-us/blog/pilot mcp.html',
        },
        {   title: 'Nacos 1.1.4发布，业界率先支持Istio MCP协议',
            author: '@敦谷',
            dateStr: 'Oct 24, 2019',
            desc: 'Nacos是阿里巴巴开源的服务发现与配置管理项目，本次发布的1.1.4版本，主要带来的是与Istio的对接功能，使用的是Istio最新的MCP协议。',
            link: '/en-us/blog/nacos 1.1.4.html',
        },
        {   title: 'Nacos整合Confd，支持nginx配置管理',
            author: '@风卿',
            dateStr: 'Sep 6, 2019',
            desc: '为什么要支持confd，老的应用配置管理模式是启动时读取配置文件，然后重新读取配置文件需要应用重启。一般的配置管理系统都是代码侵入性的',
            link: '/en-us/blog/nacos-confd.html',
        },
        {   title: 'Nacos 1.1.0发布，支持灰度配置和地址服务器模块',
            author: '@敦谷',
            dateStr: 'Jul 10, 2019',
            desc: 'Nacos 是阿里巴巴开源的配置中心和服务发现产品，开源距今已经超过一年的时间。本次1.1.0的发布，带来了许多重量级的特性更新，包括灰度配置等社区呼声很高的特性',
            link: '/en-us/blog/nacos 1.1.0.html',
        },
        {   title: 'Nacos GA后的整体规划',
            author: '@敦谷',
            dateStr: 'Jul 8, 2019',
            desc: '根据Nacos既定的演进方向，以及在与社区进行充分的[讨论](https://github.com/alibaba/nacos/issues/1433)后，Nacos接下来的版本计划也浮出水面。',
            link: '/en-us/blog/nacos-roadmap.html',
        },
        {   title: 'Nacos打通CMDB实现就近访问',
            author: '@敦谷',
            dateStr: 'Jun 6, 2019',
            desc: '在服务进行多机房或者多地域部署时，跨地域的服务访问往往延迟较高，一个城市内的机房间的典型网络延迟在1ms左右，而跨城市的网络延迟，例如上海到北京大概为30ms。',
            link: '/en-us/blog/cmdb.html',
        },
        {   title: '阿里巴巴基于 Nacos 实现环境隔离的实践',
            author: '@正己',
            dateStr: 'Jun 5, 2019',
            desc: '说到环境隔离，首先应该搞清楚什么环境。 环境这个词目前还没有一个比较统一的定义，有些公司叫环境，在阿里云上叫region，在kubernetes架构中叫namespace等等。',
            link: '/en-us/blog/address-server.html',
        },
        {   title: 'Nacos 1.0.0 发布，正式大规模生产可用',
            author: '@敦谷',
            dateStr: 'Apr 10, 2019',
            desc: 'Nacos 1.0.0是正式GA的版本，在架构、功能和API设计上进行了全方位的重构和升级，在经过3个RC版本的社区体验之后正式发布，1.0.0版本标志着Nacos已经可以大规模在生产环境使用。',
            link: '/en-us/blog/nacos1.0.0.html',
        },
        {   title: 'Nacos 0.9.0 发布，稳定的快速迭代',
            author: '@邢学超 @风卿',
            dateStr: 'Mar 7, 2019',
            desc: 'Nacos一直秉承着稳定性和快速迭代，Nacos 0.9.0版本于上周正式发布release，功能围绕着，Nacos-Sync的稳定性、Server功能拆分部署、Nacos python语言体系的支持。',
            link: '/en-us/blog/nacos0.9.0.html',
        },
        {   title: 'Nacos 发布 v0.9.0',
            author: '@邢学超',
            dateStr: 'Feb 28, 2019',
            desc: '阿里巴巴微服务开源项目 [Dubbo Nacos](https://github.com/alibaba/nacos)  于本周发布v0.9.0版本，实现了server拆分功能和修复了13个issues。',
            link: '/en-us/blog/nacos0.9-intro.html',
        },
        {   title: 'Dubbo Nacos 发布 v0.8.0 PRE-GA版本，安全稳定上生产',
            author: '@张龙 @彦林 @风卿',
            dateStr: 'Jan 20, 2019',
            desc: '阿里巴巴微服务开源项目 [Dubbo Nacos](https://github.com/alibaba/nacos)  于本周发布v0.8.0（PRE-GA）版本，终于初步完成了Road Map一个重要的里程碑版本。',
            link: '/en-us/blog/nacos0.8.html',
        },
        {   title: '虎牙直播在微服务改造方面的实践和总结',
            author: '@张波',
            dateStr: 'Feb 10, 2019',
            desc: '文章整理自虎牙基础保障部中间件团队负责人张波（社区ID：zhangjimmy）在Dubbo Meetup 广州站沙龙上的分享，介绍虎牙在DNS、服务注册、CMDB和服务配置中心等方面的实践',
            link: '/en-us/blog/huya-practice.html',
        },
        {   title: '虎牙直播共建Nacos生态',
            author: '@于怀',
            dateStr: 'Jan 10, 2019',
            desc: '虎牙中间件团队也深入参与了Nacos生态的构建，核心成员张波、周建、李志鹏参与构建了Nacos生态，把虎牙的业务模型和生产部署经验也共建到Nacos生态中。',
            link: '/en-us/blog/huya-nacos.html',
        },
        {   title: 'Nacos 有哪些典型的应用场景？—— 配置管理篇',
            author: '@何煦',
            dateStr: 'Dec 06, 2018',
            desc: '本文将围绕“Where”，讲述 Nacos 配置管理的三个典型的应用场景：数据库连接信息、限流阈值和降级开关、流量的动态调度',
            link: '/en-us/blog/5w1h-where.html',
        },
        {
            title: 'Nacos 发布 0.6 版本，支持Dubbo生态并且支持Docker部署',
            author: '@马昕曦、@张龙、@邢学超',
            dateStr: 'Nov 29, 2018',
            desc: '本文介绍了阿里巴巴的微服务开源项目[Dubbo Nacos](https://github.com/alibaba/nacos) v0.6 版本，该版本主要在支持了Dubbo生态和Docker部署',
            link: '/en-us/blog/nacos0.6.html',
        },
	    {
            title: '使用Nacos实现Spring Cloud Zuul的动态路由',	
            author: '@叶志远',
            dateStr: 'Nov 29, 2018',
            desc: '本文介绍了如何基于阿里巴巴的微服务开源项目[Dubbo Nacos](https://github.com/alibaba/nacos) 实现Spring Cloud 中基于zuul的动态路由能力',
            link: '/en-us/blog/dynamic-route-zuul-nacos.html',
        },
        {
            title: 'Nacos 计划发布v0.5版本，支持DNS-SD',
            author: '@kunyu @dungu',
            dateStr: 'Nov 25, 2018',
            desc: '阿里巴巴微服务开源项目[Dubbo Nacos](https://github.com/alibaba/nacos)于本周发布 v0.5.0 版本，该版本主要在 DNS-based Service Discovery，支持 TTL，支持 Java 11，优化Nacos产品用户体验，与Spring Cloud Gateway的集成等方面做了演进。',
            link: '/en-us/blog/nacos0.5.html',
        },
        {
            title: 'Nacos 进入CNCF landscape',
            author: '@xingxuechao',
            dateStr: 'Oct 28, 2018',
            desc: 'Nacos 被CNCF 纳入landscape大图',
            link: '/en-us/blog/cncf.html',
        },
        {   title: 'Nacos 帮我们解决什么问题？—— 配置管理篇',
            author: '@何煦',
            dateStr: 'Oct 17, 2018',
            desc: 'Nacos 是阿里巴巴今年7月份开源的项目，如其名， Naming and Configuration Service ，专注于服务发现和配置管理领域。本系列文章，将从 5W1H（What、Where、When、Who、Why、How）全面剖析 Nacos，希望对开发者们在服务发现和配置管理开源方案选型的时候，有所帮助。',
            link: '/en-us/blog/5w1h-what.html',
        },
        {
            title: 'Nacos服务发现控制台预览',
            author: '@dungu',
            dateStr: 'Oct 2nd, 2018',
            desc: '服务发现控制台的主要功能是服务列表的展示和搜索，以及服务配置、集群配置、实例配置的查询和更新。在0.3版本中，主要会有两个页面：服务列表和服务详情。',
            link: '/en-us/blog/discovery-console.html',
        },
        {
            title: 'Consul与kubernetes整合公告[翻译]',
            author: '@dungu',
            dateStr: 'Sept 2nd, 2018',
            desc: '本文翻译了Consul对于Kubernetes的整合所发布的公告文章（[原文地址](https://www.hashicorp.com/blog/consul-plus-kubernetes)）。Consul通过支持Service Mesh，并提供对Kubernetes的无缝支持，与目前最受社区热捧的产品进行绑定，并通过功能预告的形式，来达到对产品宣传效果的最大化。',
            link: '/en-us/blog/consul-k8s.html',
        },
        {
            title: 'Nacos 计划发布v0.2版本，进一步融合Dubbo和SpringCloud生态',
            author: '@wangchen',
            dateStr: 'Sept 21, 2018',
            desc: '在近期的Aliware Open Source 成都站的活动上，阿里巴巴高级工程师邢学超（于怀）分享了Nacos v0.2的规划和进度，并对Nacos v0.3的控制台进行了预览。Nacos v0.2将进一步融入Duboo和Spring Cloud生态，帮助开发者更好的在微服务场景下使用服务发现和动态配置管理。',
            link: '/en-us/blog/chengdu-dubbo.html',
        },
        {
            title: '微服务架构中基于DNS的服务发现',
            author: '@wangchen',
            dateStr: 'June 2nd, 2018',
            desc: '当前，微服务架构已经成为企业尤其是互联网企业技术选型的一个重要参考。微服务架构中涉及到很多模块，本文将重点介绍微服务架构的服务注册与发现以及如何基于DNS做服务发现。',
            link: '/en-us/blog/dns-sd.html',
        },
        {
            title: 'Nacos - 阿里巴巴注册中心和配置中心开源计划',
            author: '@Penn(PingGuo)',
            dateStr: 'June 1st, 2018',
            desc: '阿里巴巴计划在7月份开启一个名叫Nacos的新开源项目, 在活动演讲中，坤宇介绍了这个开源项目的初衷，他表示 “将通过Nacos项目将阿里巴巴在建设共享服务体系中使用的服务发现、配置及服务管理平台贡献给开源社区"。',
            link: '/en-us/blog/nacos-is-coming.html',
        },
        {
            title: '阿里巴巴服务注册中心产品ConfigServer 10年技术发展回顾',
            author: '@muyi',
            dateStr: 'May 20th, 2018',
            desc: "本文简单描述了Eureka1.0存在的架构问题，Eureka2.0设想的架构。详细回顾了阿里巴巴的服务注册中心ConfigServer产品从2008年建设元年至今经历的关键架构演进。通过这个文章你会对基于AP模式的注册中心在技术发展过程中将会碰到的问题有所感知。",
            link: '/en-us/blog/alibaba-configserver.html',
        },
    ]
  },
  'zh-cn': {
    barText: '博客',
    postsTitle: '所有文章',
    list: [
        {
            title: '小米Nacos2.0扩缩容最佳实践',
            author: '@胡俊 小米-集团信息技术部-云平台部-武汉研发部-云业务组',
            dateStr: 'August 5, 2022',
            desc: '小米的Nacos集群升级到了2.0.3版本之后，一直在开启双写的情况下运行稳定，动态的服务发现与分布式配置中心的能力也满足我们的预期，但随着使用我们集群的体量越来越大，需要对集群进行扩容，但在实际操作过程中遇到了一些问题，这篇文章主要总结一下集群扩缩容中遇到问题的解决过程和集群扩缩容步骤。',
            link: '/zh-cn/blog/xiaomi-scale.html',
        },
        {
            title: 'Nacos开源之夏2022，贡献社区赢取12000奖金',
            author: '@杨翊',
            dateStr: 'May 16, 2022',
            desc: '欢迎在校同学们参与Nacos开源之夏，社区导师手把手让**你的代码被社会广泛复用，来赚取最高12000奖金，可**推荐入职/实习你心意公司，**又拿钱又成长又有价值**，你还等什么呢？报名马上截止，快来参与Nacos开源之夏。',
            link: '/zh-cn/blog/iscas2022.html',
        },
        {
            title: 'Nacos 2.1.0版本发布，支持鉴权及加解密插件',
            author: '@杨翊',
            dateStr: 'Apr 29, 2022',
            desc: 'Nacos 2.1.0版本发布，支持鉴权及加解密插件',
            link: '/zh-cn/blog/2.1.0-release.html',
        },
        {
            title: '在 Rainbond 中一键安装高可用 Nacos 集群',
            author: '@郭逊(guox@goodrain.com)',
            dateStr: 'Mar 16, 2022',
            desc: '本文为您描述如何通过云原生应用管理平台 Rainbond 一键安装高可用 Nacos 集群。',
            link: '/zh-cn/blog/use-nacos-with-rainbond.html',
        },
        {
            title: 'Apache APISIX 基于 Nacos 实现服务发现',
            author: '@林志煌(2228586315@qq.com)',
            dateStr: 'Feb 22, 2022',
            desc: '本文为您介绍 Apache APISIX、Nacos 基本概念以及注册中心的作用，并为您展示了 Apache APISIX 基于 Nacos 实现服务发现的具体操作',
            link: '/zh-cn/blog/apisix.html',
        },
        {
            title: '双十一献礼 | Nacos Star破两万的回顾与展望',
            author: '@涌月 @彦林 @席翁',
            dateStr: 'Nov 3, 2021',
            desc: '双十一献礼 | Nacos Star破两万的回顾与展望',
            link: '/zh-cn/blog/up-to-2w-star.html',
        },
        {
            title: 'Nacos 2.0.3版本发布，继续提升集群稳定性及升级稳定性',
            author: '@杨翊',
            dateStr: 'July 29, 2021',
            desc: 'Nacos 2.0.3版本发布，继续提升集群稳定性及升级稳定性',
            link: '/zh-cn/blog/2.0.3-release.html',
        },
        {
            title: 'Nacos 开源之夏2021活动 报名正式开启!',
            author: '@杨翊',
            dateStr: 'May 25, 2021',
            desc: 'Nacos 开源之夏2021活动 报名正式开启!',
            link: '/zh-cn/blog/iscas2021.html',
        },
        {
            title: 'Nacos 2.0.1 + 1.4.2 发布,业界率先支持MCP-OVER-XDS协议!',
            author: '@涌月',
            dateStr: 'May 10, 2021',
            desc: 'Nacos 2.0.1 + 1.4.2 发布,业界率先支持MCP-OVER-XDS协议!',
            link: '/zh-cn/blog/2.0.1-release.html',
        },
        {
            title: '关于Nacos身份验证漏洞修复建议',
            author: '@席翁',
            dateStr: 'Jan 15, 2021',
            desc: '关于Nacos身份验证漏洞修复建议及部署说明',
            link: '/en-us/blog/nacos-security-problem-note.html',
        },
        {
            title: '双十一购物节，Nacos 1.4.0 + Go SDK 1.0.1发布！',
            author: '@席翁',
            dateStr: 'Nov 2nd, 2020',
            desc: '双十一购物节，Nacos 1.4.0 + Go SDK 1.0.1发布！',
            link: '/en-us/blog/1.4.0-release.html',
        },
        {
            title: 'Nacos-sdk-csharp 0.5.0正式发布，功能与Java版本对齐！',
            author: '@席翁',
            dateStr: 'Sep 3rd, 2020',
            desc: 'Nacos-sdk-csharp 0.5.0正式发布，功能与Java版本对齐！',
            link: '/zh-cn/blog/csharp-0.5.0.html',
        },
        {
            title: 'Nacos 两周年献礼，Nacos 1.3.2 + Go SDK 1.0.0发布',
            author: '@席翁',
            dateStr: 'Aug 5th, 2020',
            desc: 'Nacos 两周年献礼，Nacos 1.3.2 + Go SDK 1.0.0发布',
            link: '/zh-cn/blog/nacos-2nd-anniversary.html',
        },
        {
            title: '参与开源，Offer拿到手软',
            author: '@春少',
            dateStr: 'July 14th, 2020',
            desc: '来自一名2019阿里巴巴编程之夏同学的亲述',
            link: '/zh-cn/blog/feeling-of-ASoC-2019.html',
        },
        {
            title: 'Nacos 1.3.0 全新内核构建过程',
            author: '@春少',
            dateStr: 'Fri 12th, 2020',
            desc: '本次1.3.0的改动程度很大，涉及两大模块的修改以及新增一个核心模块',
            link: '/zh-cn/blog/nacos-1.3.0-design.html',
        },
        {   title: 'Nacos 1.2.0权限控制介绍和使用',
            author: '@敦谷',
            dateStr: 'Mar 10th, 2020',
            desc: 'Nacos是阿里巴巴开源的服务发现与配置管理项目，本次发布的1.2.0版本，主要带来的是权限控制',
            link: '/zh-cn/blog/nacos 1.2.0 guide.html',
        },
        {   title: '命名空间和endpoint最佳实践',
            author: '@得少',
            dateStr: 'Dec 6, 2019',
            desc: '随着使用 Nacos 的企业越来越多，遇到的最频繁的两个问题就是：如何在我的生产环境正确的来使用 namespace 以及 endpoint',
            link: '/zh-cn/blog/namespace-endpoint-best-practices.html',
        },
        {   title: 'Pilot MCP协议介绍',
            author: '@敦谷',
            dateStr: 'Nov 20, 2019',
            desc: 'Istio是目前主流的Service Mesh组件。Istio基于Service Mesh的理念，承担着服务发现、服务通信、负载均衡、限流熔断、监控等等功能',
            link: '/zh-cn/blog/pilot mcp.html',
        },
        {   title: 'Nacos 1.1.4发布，业界率先支持Istio MCP协议',
            author: '@敦谷',
            dateStr: 'Oct 24, 2019',
            desc: 'Nacos是阿里巴巴开源的服务发现与配置管理项目，本次发布的1.1.4版本，主要带来的是与Istio的对接功能，使用的是Istio最新的MCP协议。',
            link: '/zh-cn/blog/nacos 1.1.4.html',
        },
        {   title: 'Nacos整合Confd，支持nginx配置管理',
            author: '@风卿',
            dateStr: 'Sep 6, 2019',
            desc: '为什么要支持confd，老的应用配置管理模式是启动时读取配置文件，然后重新读取配置文件需要应用重启。一般的配置管理系统都是代码侵入性的',
            link: '/zh-cn/blog/nacos-confd.html',
        },
        {   title: 'Nacos 1.1.0发布，支持灰度配置和地址服务器模块',
            author: '@敦谷',
            dateStr: 'Jul 10, 2019',
            desc: 'Nacos 是阿里巴巴开源的配置中心和服务发现产品，开源距今已经超过一年的时间。本次1.1.0的发布，带来了许多重量级的特性更新，包括灰度配置等社区呼声很高的特性',
            link: '/zh-cn/blog/nacos 1.1.0.html',
        },
        {   title: 'Nacos GA后的整体规划',
            author: '@敦谷',
            dateStr: 'Jul 8, 2019',
            desc: '根据Nacos既定的演进方向，以及在与社区进行充分的[讨论](https://github.com/alibaba/nacos/issues/1433)后，Nacos接下来的版本计划也浮出水面。',
            link: '/zh-cn/blog/nacos-roadmap.html',
        },
        {   title: 'Nacos打通CMDB实现就近访问',
            author: '@敦谷',
            dateStr: 'Jun 6, 2019',
            desc: '在服务进行多机房或者多地域部署时，跨地域的服务访问往往延迟较高，一个城市内的机房间的典型网络延迟在1ms左右，而跨城市的网络延迟，例如上海到北京大概为30ms。',
            link: '/en-us/blog/cmdb.html',
        },
        {   title: '阿里巴巴基于 Nacos 实现环境隔离的实践',
            author: '@正己',
            dateStr: 'Jun 5, 2019',
            desc: '说到环境隔离，首先应该搞清楚什么环境。 环境这个词目前还没有一个比较统一的定义，有些公司叫环境，在阿里云上叫region，在kubernetes架构中叫namespace等等。',
            link: '/zh-cn/blog/address-server.html',
        },
        {   title: 'Nacos 1.0.0 发布，正式大规模生产可用',
            author: '@敦谷',
            dateStr: 'Apr 10, 2019',
            desc: 'Nacos 1.0.0是正式GA的版本，在架构、功能和API设计上进行了全方位的重构和升级，在经过3个RC版本的社区体验之后正式发布，1.0.0版本标志着Nacos已经可以大规模在生产环境使用。',
            link: '/en-us/blog/nacos1.0.0.html',
        },
        {   title: 'Nacos 0.9.0 发布，稳定的快速迭代',
            author: '@邢学超 @风卿',
            dateStr: 'Mar 7, 2019',
            desc: 'Nacos一直秉承着稳定性和快速迭代，Nacos 0.9.0版本于上周正式发布release，功能围绕着，Nacos-Sync的稳定性、Server功能拆分部署、Nacos python语言体系的支持。',
            link: '/en-us/blog/nacos0.9.0.html',
        },
        {   title: 'Nacos 发布 v0.9.0',
            author: '@邢学超',
            dateStr: 'Feb 28, 2019',
            desc: '阿里巴巴微服务开源项目 [Dubbo Nacos](https://github.com/alibaba/nacos)  于本周发布v0.9.0版本，实现了server拆分功能和修复了13个issues。',
            link: '/en-us/blog/nacos0.9-intro.html',
        },
        {   title: 'Dubbo Nacos 发布 v0.8.0 PRE-GA版本，安全稳定上生产',
            author: '@张龙 @彦林 @风卿',
            dateStr: 'Jan 20, 2019',
            desc: '阿里巴巴微服务开源项目 [Dubbo Nacos](https://github.com/alibaba/nacos)  于本周发布v0.8.0（PRE-GA）版本，终于初步完成了Road Map一个重要的里程碑版本。',
            link: '/en-us/blog/nacos0.8.html',
        },
        {   title: '虎牙直播在微服务改造方面的实践和总结',
            author: '@张波',
            dateStr: 'Feb 10, 2019',
            desc: '文章整理自虎牙基础保障部中间件团队负责人张波（社区ID：zhangjimmy）在Dubbo Meetup 广州站沙龙上的分享，介绍虎牙在DNS、服务注册、CMDB和服务配置中心等方面的实践。',
            link: '/en-us/blog/huya-practice.html',
        },
        {   title: '虎牙直播共建Nacos生态',
            author: '@于怀',
            dateStr: 'Jan 10, 2019',
            desc: '虎牙中间件团队也深入参与了Nacos生态的构建，核心成员张波、周建、李志鹏参与构建了Nacos生态，把虎牙的业务模型和生产部署经验也共建到Nacos生态中。',
            link: '/en-us/blog/huya-nacos.html',
        },
        {   title: 'Nacos 有哪些典型的应用场景？—— 配置管理篇',
            author: '@何煦',
            dateStr: 'Dec 06, 2018',
            desc: '本文将围绕“Where”，讲述 Nacos 配置管理的三个典型的应用场景：数据库连接信息、限流阈值和降级开关、流量的动态调度',
            link: '/zh-cn/blog/5w1h-where.html',
        },
        {
            title: 'Nacos 发布 0.6 版本，支持Dubbo生态并且支持Docker部署',
            author: '@马昕曦、@张龙、@邢学超',
            dateStr: 'Nov 29, 2018',
            desc: '本文介绍了阿里巴巴的微服务开源项目[Dubbo Nacos](https://github.com/alibaba/nacos) v0.6 版本，该版本主要在支持了Dubbo生态和Docker部署',
            link: '/zh-cn/blog/nacos0.6.html',
        },
        {
            title: '使用Nacos实现Spring Cloud Zuul的动态路由',
            author: '@叶志远',
            dateStr: 'Nov 29, 2018',
            desc: '本文介绍了如何基于阿里巴巴的微服务开源项目[Dubbo Nacos](https://github.com/alibaba/nacos) 实现Spring Cloud 中基于zuul的动态路由能力',
            link: '/zh-cn/blog/dynamic-route-zuul-nacos.html',
        },
        {
            title: 'Nacos 计划发布v0.5版本，支持DNS-SD',
            author: '@kunyu @dungu',
            dateStr: 'Nov 25, 2018',
            desc: '阿里巴巴微服务开源项目[Dubbo Nacos](https://github.com/alibaba/nacos)于本周发布 v0.5.0 版本，该版本主要在 DNS-based Service Discovery，支持 TTL，支持 Java 11，优化Nacos产品用户体验，与Spring Cloud Gateway的集成等方面做了演进。',
            link: '/en-us/blog/nacos0.5.html',
        },
        {
            title: 'Nacos 进入CNCF landscape',
            author: '@xingxuechao',
            dateStr: 'Oct 28, 2018',
            desc: 'Nacos 被CNCF 纳入landscape大图',
            link: '/en-us/blog/cncf.html',
        },
        {   title: 'Nacos 帮我们解决什么问题？—— 配置管理篇',
            author: '@何煦',
            dateStr: 'Oct 17, 2018',
            desc: 'Nacos 是阿里巴巴今年7月份开源的项目，如其名， Naming and Configuration Service ，专注于服务发现和配置管理领域。本系列文章，将从 5W1H（What、Where、When、Who、Why、How）全面剖析 Nacos，希望对开发者们在服务发现和配置管理开源方案选型的时候，有所帮助。',
            link: '/zh-cn/blog/5w1h-what.html',
        },
        {
            title: 'Nacos服务发现控制台预览',
            author: '@dungu',
            dateStr: 'Oct 2nd, 2018',
            desc: '服务发现控制台的主要功能是服务列表的展示和搜索，以及服务配置、集群配置、实例配置的查询和更新。在0.3版本中，主要会有两个页面：服务列表和服务详情。',
            link: '/en-us/blog/discovery-console.html',
        },
        {
            title: 'Consul与kubernetes整合公告[翻译]',
            author: '@dungu',
            dateStr: 'Sept 2nd, 2018',
            desc: '本文翻译了Consul对于Kubernetes的整合所发布的公告文章（[原文地址](https://www.hashicorp.com/blog/consul-plus-kubernetes)）。Consul通过支持Service Mesh，并提供对Kubernetes的无缝支持，与目前最受社区热捧的产品进行绑定，并通过功能预告的形式，来达到对产品宣传效果的最大化。',
            link: '/en-us/blog/consul-k8s.html',
        },
        {
            title: 'Nacos 计划发布v0.2版本，进一步融合Dubbo和SpringCloud生态',
            author: '@wangchen',
            dateStr: 'Sept 21, 2018',
            desc: '在近期的Aliware Open Source 成都站的活动上，阿里巴巴高级工程师邢学超（于怀）分享了Nacos v0.2的规划和进度，并对Nacos v0.3的控制台进行了预览。Nacos v0.2将进一步融入Duboo和Spring Cloud生态，帮助开发者更好的在微服务场景下使用服务发现和动态配置管理。',
            link: '/en-us/blog/chengdu-dubbo.html',
        },
      {
        title: '微服务架构中基于DNS的服务发现',
        author: '@zhengji',
        dateStr: 'June 2nd, 2018',
        desc: '当前，微服务架构已经成为企业尤其是互联网企业技术选型的一个重要参考。微服务架构中涉及到很多模块，本文将重点介绍微服务架构的服务注册与发现以及如何基于DNS做服务发现。',
        link: '/zh-cn/blog/dns-sd.html',
      },
      {
        title: 'Nacos - 阿里巴巴注册中心和配置中心开源计划',
        author: '@Penn(PingGuo)',
        dateStr: 'June 1st, 2018',
        desc: '阿里巴巴计划在7月份开启一个名叫Nacos的新开源项目, 在活动演讲中，坤宇介绍了这个开源项目的初衷，他表示 “将通过Nacos项目将阿里巴巴在建设共享服务体系中使用的服务发现、配置及服务管理平台贡献给开源社区"。',
        link: '/zh-cn/blog/nacos-is-coming.html',
      },
      {
        title: '阿里巴巴服务注册中心产品ConfigServer 10年技术发展回顾',
        author: '@muyi',
        dateStr: 'May 20th, 2018',
        desc: "本文简单描述了Eureka1.0存在的架构问题，Eureka2.0设想的架构。详细回顾了阿里巴巴的服务注册中心ConfigServer产品从2008年建设元年至今经历的关键架构演进。通过这个文章你会对基于AP模式的注册中心在技术发展过程中将会碰到的问题有所感知。",
        link: '/zh-cn/blog/alibaba-configserver.html',
      },
    ]
  },
};
