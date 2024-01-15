---
title: 我们总结了3大使用建议，并首次公开 Nacos3.0 规划图 | Nacos 开源4周年
keywords: [nacos3.0, nacos最佳实践]
description: 我们总结了3大使用建议，并首次公开 Nacos3.0 规划图 | Nacos 开源4周年
date: "2022-08-10"
category: article
---

# 我们总结了3大使用建议，并首次公开 Nacos3.0 规划图 | Nacos 开源4周年
# Nacos 是什么？
**Nacos **/nɑ:kəʊs/ 是 Dynamic **Na**ming and **Co**nfiguration **S**ervice的首字母简称，定位于一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。从 2018 年 7 月开始宣布开源以来，已经走过了第四个年头，在这四年里，备受广大开源用户欢迎，共收获**23.3K的star**数，**10.3K的Fork**数，在开源中国发布的 2021 年度 OSC 中国开源项目评选中，Nacos 被评为**云原生领域人气指数 Top5 **的项目，发布电子书《Nacos 架构与原理》**6w+阅读，2w下载量**，发布半年的时间里在阿里云藏经阁历史下载榜前十。Nacos 在社区共同的建设下不断成长，逐步的开始帮助用户解决实际问题，助力企业数字化转型，目前已经广泛的使用在国内的公司中，根据微服务领域调查问卷，Nacos 在注册配置中心领域已经成为国内首选，**占有50%+国内市场份额**，被头部企业广泛使用！

_《2022中国开源发展蓝皮书》由中国开源软件推进联盟（COPU）牵头，联合中国开发者网络（CSDN）、北京开源创新委员会、开放原子开源基金会、中国电子信息产业发展研究院、中科院软件研究所等 85 家企业及行业机构、120 多位开源专家和志愿者共同协作编撰完成，旨在全面展现当前中国开源发展的全景图，为国家政府相关管理部门、科研院所、科技企业以及开源从业者提供更多的理论参考和数据支撑，进一步助力我国开源生态的蓬勃发展。_

根据最近刚发布的《2022中国开源发展蓝皮书》报告中 **Github中国项目活跃度TOP 20**，**Nacos 排名全国第六**，作为基础类型云原生中间件，能有如此活跃度是非常不容易的，在上一年度《2021中国开源发展蓝皮书》中，Nacos 排名全国第十，也表现 Nacos 不仅仅维持高的项目活跃度，而且项目关注度和活跃度还在逐步提高。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/1841635/1660128326734-77c2a094-ec94-4af1-a75b-a0a53fdc6ec4.png#clientId=ueb02e93b-f556-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=535&id=u47f643c7&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1178&originWidth=1518&originalType=binary&ratio=1&rotation=0&showTitle=false&size=236968&status=done&style=none&taskId=u4d6df18d-be84-4d38-93f2-2a962f874c9&title=&width=689.999985044653)
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1841635/1660128326737-122b53b1-ccb8-44f2-b065-30f17f8ef7d3.png#clientId=ueb02e93b-f556-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=300&id=ueacbdce0&margin=%5Bobject%20Object%5D&name=image.png&originHeight=660&originWidth=1506&originalType=binary&ratio=1&rotation=0&showTitle=false&size=137871&status=done&style=none&taskId=u7d71e0c9-9383-4cbf-961a-10e20121db0&title=&width=684.5454397083317)
同时**阿里巴巴在国内企业中开源影响力排行第一**，在《2022中国开源发展蓝皮书》中介绍：“阿里巴巴是国内参与开源技术生态建设的企业典范。自2011年至今，阿里累计开源项目超过3000个，代表性的项目包括龙蜥操作系统、Apache RocketMQ、Apache Dubbo、Spring Cloud Alibaba、 Nacos、Seata、PolarDB-X、PolarDB for PostgreSQL等”。
**Nacos 是阿里巴巴微服务领域开源你项目活跃度排行第一**，也得益于开源协作模式，并且在Nacos中有大量国内外知名公司的核心贡献者，其中也包含就职在腾讯、华为、小米等等知名企业的同学，也正是社区整体的贡献者和用户在帮助 Nacos 成长，让 Nacos 逐步完善生态，支持几乎所有主流语言，整合更多开源生态，也正是用户和社区贡献者让Nacos为企业数字化转型首选产品。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/1841635/1660128326897-7ed32372-ee24-49b3-9d04-0dc212286f15.png#clientId=ueb02e93b-f556-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=502&id=ubd55857f&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1104&originWidth=2408&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1103472&status=done&style=none&taskId=u311192a3-cae9-43e6-825c-b7e317f32f8&title=&width=1094.5454308218211)

# Nacos 使用上的3点重要建议
## Nacos 版本选择
Nacos 经过4年的发展，目前在大版本演进上已经到了第二代 Nacos 架构，即 Nacos 2.x 版本，Nacos 2.x 版本是基于 Nacos 1.x 中用户反馈使用习惯以及产品演进方向而构建的产品能力，中间包含了比如一致性算法升级，对性能的 10 倍提升，以及支持插件化来满足社区的定制诉求。并且保障了很好的兼容性，在服务能力上 Nacos 2.x 是完全兼容 Nacos 1.x 的协议，也就是 Nacos 2.x 服务端是完全兼容Nacos 1.x的客户端。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1841635/1660128326915-21ee9085-b47d-4126-a9e6-2b29642d3040.png#clientId=ueb02e93b-f556-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=685&id=u1b918043&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1506&originWidth=3510&originalType=binary&ratio=1&rotation=0&showTitle=false&size=653185&status=done&style=none&taskId=u3d05de1e-ca37-460e-b2c3-493ce845509&title=&width=1595.4545108740003)

在基本能力上，Nacos 2.x 一致性协议复用了阿里在该领域最佳实践，以长连接为基础，减低通信损耗，基于Distro协议原有协议进行升级，在存储模型、保活模型上进行了重构，并且用推送机制代替了之前的轮训机制，进一步提升了产品的高可用以及稳定性，整体也复用了阿里百万实例的基础模型，在CAP理论基础上，根据场景来去选择最适合的协议，贴合场景来平衡一致性、高可用以及分区容灾，做到服务发现以及配置管理每个场景下，都做到稳定性、高可用、高性能的保障。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/1841635/1660128326737-0bcc637d-fb28-4d50-831d-0efe3bf2baa5.png#clientId=ueb02e93b-f556-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=702&id=uc4858e76&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1544&originWidth=3414&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1949611&status=done&style=none&taskId=u417b5c89-ea5d-4a63-a81b-e1830bae1ae&title=&width=1551.8181481834292)
在拓展能力上，Nacos 2.x版本开始支持插件化能力，基于插件化是更方便的支持用户各种场景，很多用户公司内部有完善的体系基于Nacos可以简单的改造就可以融合进入，在鉴权、配置加解密场景都可以做到按照用户需求进行定制，并且给出默认的开源实现供用户选择，加解密为例，开源给出的默认实现是基于AES，用户也可以进行自定义。并且目前数据库的插件已经在路上，后续还会在安全等更多方面支持可插拔的插件化能力。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1841635/1660128329396-ed838e7b-23b3-4641-8d83-339621f3e7f6.png#clientId=ueb02e93b-f556-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=725&id=u49cc077c&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1594&originWidth=3516&originalType=binary&ratio=1&rotation=0&showTitle=false&size=765234&status=done&style=none&taskId=uebe8a7d1-a137-49e9-a2c1-b43d15e84d1&title=&width=1598.181783542161)
## Nacos 支持还能支持那些场景
Nacos基本核心能力是面向于整体分布式的服务注册与发现，以及分布式节点配置管理，使用领域可以说是非常广泛的，比较常用的包含，微服务领域、高可用领域、内容领域以及数据库领域等，目前在微服务领域Nacos基本能力使用最广，微服务领域定位在一站式解决了用户应用的寻址、流量、配置场景服务平台，在高可用领域Nacos积累了大量的经验，可以实现大量降级、容灾、多活的高可用场景，也可以支持内容分发以及数据库分库分表、主备切换等场景的基础能力，可以说分布式的场景下，基本都可以跟Nacos进行构建，也帮助业务后续拓展留足了准备。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1841635/1660128329276-3018d13a-b48c-40c7-b849-91f8457b8150.png#clientId=ueb02e93b-f556-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=635&id=ue5613a5e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1398&originWidth=3350&originalType=binary&ratio=1&rotation=0&showTitle=false&size=552128&status=done&style=none&taskId=u4e44c983-d5f2-46f0-b0c8-81aff9737c1&title=&width=1522.7272397230486)

## Nacos 排查问题最佳实践
注册配置中心在分布式节点交互中起着重要的作用，在业务分布式场景出现问题的时候需要快速进行诊断，判断是否是注册配置中心出现了问题，还是业务层的问题。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/1841635/1660128330096-e0464b56-d248-4882-b6b0-7dfc97ef2d12.png#clientId=ueb02e93b-f556-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=637&id=u044898a4&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1402&originWidth=3288&originalType=binary&ratio=1&rotation=0&showTitle=false&size=586155&status=done&style=none&taskId=udfffd8de-9024-48b2-9632-d3892d254b3&title=&width=1494.545422152055)
在注册中心中，服务发现是业务排查问题第一优先级需要定位的，服务发现具体对应的就是服务地址数据是否同步到了业务节点上，那在Nacos场景上，推送记录就是最关键的一个特性能力，这部分能力可以通过Nacos日志查询到，目前Nacos社区已经开始计划设计事件中心来支撑这部分能力，为了更好的演示，这里也通过阿里云微服务引擎MSE展现一下白屏化的推送轨迹能力，用户可以通过服务名称或者客户端IP，进行查询变更的时间以及变更的内容，就可以快速明确当前注册中心是否存在问题，并且能帮住业务进一步定位具体原因。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1841635/1660128329802-c9b74139-1a26-4f5e-a87f-f7984eefd7dc.png#clientId=ueb02e93b-f556-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=672&id=u2a11e04a&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1478&originWidth=3444&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1298759&status=done&style=none&taskId=uc0445f1b-5b12-4665-8ddb-3af553555a5&title=&width=1565.4545115242327)
在配置中心链路，同样存在第一时间定位的问题，这里也通过阿里云微服务引擎MSE的最佳实践，推送轨迹能力展现排查的思路，可以通过配置名称或者订阅者客户端IP进行查询配置的变更时间，以及推送时间，以及推送内容MD5值进行匹配。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1841635/1660128330232-5db3bdda-ff5d-4f33-81b8-f7380fda69f4.png#clientId=ueb02e93b-f556-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=565&id=u66cb46ed&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1244&originWidth=3442&originalType=binary&ratio=1&rotation=0&showTitle=false&size=898613&status=done&style=none&taskId=u238152f1-f7bb-4ff7-bd9c-6abf9fbf49d&title=&width=1564.5454206348459)
并且在分布式配置管理领域，通过补全推送轨迹能力，加上已经支持的历史版本查询能力，可以帮助业务全流程的观测配置的生命周期。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1841635/1660128330919-a9cd7ce7-71c6-4df5-b24d-e952787f31a8.png#clientId=ueb02e93b-f556-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=148&id=ub13903d9&margin=%5Bobject%20Object%5D&name=image.png&originHeight=326&originWidth=3452&originalType=binary&ratio=1&rotation=0&showTitle=false&size=109098&status=done&style=none&taskId=ubf8f4f18-2f42-43bc-b309-8b3af2e9263&title=&width=1569.0908750817803)
关于注册配置中心排查问题的思路上，总结是两个重点，一是数据变更确认，二是快速确定关系并且进行恢复。大多数场景如果是业务变更引起的，一定要第一时间进行回顾变更，避免给业务带来问题。在稳定性要求比较高的领域，建议业务体系上面向1-5-10（故障1分钟发现，5分钟上线处理，10分钟恢复）建设稳定性，这部分也是比较通用的能力建设，这里就不进行详细拓展，后续有机会可以单独聊一下。
# Nacos 规划
Nacos 已经经历了两个重要阶段，初创期和高速发展期，目前正处于被大规模使用的 Nacos 的第三阶段是成为基础设施，需要面向于基础设施进行演进，帮助企业数字化转型，深度的拥抱各个领域内的场景，并且更深度的帮助企业解决问题。Nacos 社区目前面向于第三阶段，开始筹备 Nacos 3.0 架构设计进行规划讨论，并且逐步开始进行落地。
目前针对 Nacos 3.0 的建设规划大图主要包含三部分，第一部分是开源品牌和社区的升级，主要是面向于社区建立更紧密的联系。第二部分是面向更多生态进行深度融合，包含K8S数据整合、以及多生态数据打通，第三部分是最基础的部分，产品能力升级，基于 Nacos2.x 的协议进行增强，并且支持统一控制面、多数据中心等基础能力，用于支撑 Nacos 3.0 生态建设以及品牌升级。
目前 Nacos 3.0 部分已经随着社区核心贡献者开展中，大多数还在规划阶段，后续会通过Github issues进行开放，随之会打上Nacos 3.0的标签，欢迎大家进行领取一起参与到Nacos 3.0的贡献。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1841635/1660128331989-00a0bd06-65a9-45c9-9cbd-54f1c30a7f2b.png#clientId=ueb02e93b-f556-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=713&id=ueaab6b3a&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1568&originWidth=3260&originalType=binary&ratio=1&rotation=0&showTitle=false&size=541963&status=done&style=none&taskId=u8e3272fe-5488-46b2-8489-54c8fd9074a&title=&width=1481.8181497006383)
# 参与开源建议
最后部分整合我个人意见，向没有参与过开源的同学给出一些参与开源的建议，首先我认为开源对于开发者以及社区贡献都是非常有益的，如果你有时间并且也想参与开源，那我建议你从以下四个步骤进行深入：
第一步找到自己感兴趣的方向，这个点比较重要，会影响你后续贡献的持久程度，当然这个也是在逐步摸索中的，不过如果对于方向确认好后，应对的产品列表选择就会比较明朗了，在这个步骤考虑兴趣是我首要建议的，其次我建议，也可以考虑当前项目一些详细信息，重点考虑是否能帮助个人把价值的放大，使用范围越广的项目就越能让你的贡献在社会价值放大，也正向会提高成就感。
第二步是熟悉项目和产品，找到了方向和项目之后，就可以开始着手熟悉当前产品的细节，熟悉当前项目的运营机制，以及面向于产品开始接触对应领域问题，领域问题最后会沉淀成为你对这个领域的经验。
第三步其实就可以贡献开源了，这一个步骤其实面向于前两步骤是可以适当提前并行做，关键是从小问题入手做起，这样可以帮助你在前两个步骤中更快的找到感觉，也能从小问题开始帮助他人，在社区中建立个人影响力。
第四步其实是水到渠成的，面向于活跃的社区，当你足够熟悉该领域该产品之后，有了足够的贡献，就会在开源中逐步主导社区的决策，也能在社区中帮助更多的人发展共建。
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1841635/1660128332043-0226d126-4ed8-4881-a36b-a9e3cffba02d.png#clientId=ueb02e93b-f556-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=642&id=u502fa610&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1412&originWidth=3312&originalType=binary&ratio=1&rotation=0&showTitle=false&size=588596&status=done&style=none&taskId=u2afc3cd2-dd40-4145-a6e4-cc1ec7289de&title=&width=1505.4545128246978)
上边是对个人贡献开源产品流程建议，适用于大多数开源项目的贡献。额外在开源上我觉得Nacos是不错的选择，首先产品定位是比较基础，能帮助开发者沉淀更通用的领域能力，社区活跃度能保持全国第六，并且在微服务领域已经被广泛使用，能帮助个人很好的放大价值。
再就是Nacos的熟悉产品也会比较简单，Nacos.io 官网可以帮助你快速入门，也有Nacos电子书免费下载帮助你深度了解Nacos架构设计。贡献开源上可以从Nacos社区仓库中 good first issues开始，跟着产品演进的方向，从小事开始在社区中发声，最后在Nacos社区有很多核心模块需要主导者，并且在社区中成为核心贡献者有社区投票权利，主导未来Nacos发展方向，并且作为社区核心成员，会有很多线上线下分享的机会，帮助个人以及企业建立更多社会影响力。总之在开源领域其实只要你愿意熟悉，一定会有所收获，祝愿每一位开发者在自己喜欢的领域能做出你想要的产品。最后感谢Nacos开源社区每一位同学！



