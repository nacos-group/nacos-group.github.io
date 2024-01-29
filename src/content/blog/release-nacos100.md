---
title: Nacos 1.0.0 发布，正式大规模生产可用
keywords: [nacos1.0，nacos1.0.0，nacos]
description: Nacos 1.0.0是正式GA的版本，在架构、功能和API设计上进行了全方位的重构和升级，在经过3个RC版本的社区体验之后正式发布，1.0.0版本标志着Nacos已经可以大规模在生产环境使用。
date: "2019-04-10"
category: release
---

# Nacos 发布 1.0.0 版本，可大规模投入到生产环境中

经过 3 个 RC 版本的社区体验之后，Nacos 正式发布 1.0.0 GA 版本，在架构、功能和 API 设计上进行了全方位的重构和升级。

1.0.0 版本的发布标志着 Nacos 已经可以大规模地生产环境中使用，新版本不仅针对社区的需求和集群的稳定性相应地增加了一些新特性，而且还发布了服务发现模块的性能测试报告，以及完整的 API 列表和架构设计文档。

## Nacos 演进历程

Nacos 自 2018 年 7 月份开源以来，有赖于社区的大力关注和参与，在不到一年的时间里，已经演进了 10+ 个版本。同时也有很多企业客户一直都使用 Nacos 作为生产环境的注册中心和配置中心。

Nacos 源于阿里巴巴内部近十年的生产环境打磨的核心中间件，在开源之前就支撑着双十一等大型业务场景。Nacos 开源不仅是为了丰富整个微服务生态，也是为了打造一款真正能够应对大规模、高并发和复杂环境下复杂需求的生产级服务注册中心和配置管理平台。在 1.0.0  GA 版本发布之际，在此回顾一下 Nacos 的演进历程：

- 2018.07.20 - Nacos 0.1.0：支持基本的服务发现功能和配置管理功能。

- 2018.09.15 - Nacos 0.2.0：正式支持 SpringCloud 生态。

- 2018.10.26 - Nacos 0.3.0：提供控制台界面。

- 2018.11.19 - Nacos 0.5.0：开源 DNS-F，支持 DNS 协议服务发现。

- 2018.12.06 - Nacos 0.6.0：正式支持 Dubbo 客户端注册服务，支持 K8S 部署。

- 2018.12.18 - Nacos 0.7.0：支持 CMDB 元数据管理，支持 Node.js 客户端。

- 2019.01.22 - Nacos 0.8.0：PRE-GA 支持控制台账号登录，支持命名空间，Nacos-Sync 打通 Eureka 和 Zookeeper。

- 2019.04.10 - Nacos 1.0.0 GA ：同时支持 AP 和 CP 一致性，发布压测报告，稳定性加强和体验优化。




# **Nacos 1.0.0 新增的特性**

### 注册实例支持ephemeral字段
Nacos 1.0.0 版本在 instance 级别上增加了一个ephemeral字段，该字段表示注册的实例是临时实例还是持久化实例。如果是临时实例，则不会在Nacos服务端持久化存储，需要通过上报心跳的方式进行保活，如果一段时间内没有上报心跳，则会被Nacos服务端摘除。在被摘除后如果又开始上报心跳，则会重新将这个实例注册。持久化实例则会持久化到Nacos服务端，此时即使注册实例的客户端进程不在，这个实例也不会从服务端删除，只会将健康状态设为不健康。

![](https://img.alicdn.com/tfs/TB1Yq_2RNjaK1RjSZFAXXbdLFXa-525-595.png)

同一个服务下可以同时有临时实例和持久化实例，这意味着当这服务的所有实例进程不在时，会有部分实例从服务上摘除，剩下的实例则会保留在服务下。

由于老版本客户端注册实例时不会上传 ephemeral 字段，需要在 Nacos 服务端设置一个默认的 ephemeral 值。Nacos 1.0.0 里 ephemeral 的默认值为 true，即老版本客户端默认注册的是临时实例。如果需要让老客户端注册的实例类型是持久化实例，可以设置开关：

```
curl -X PUT '$NACOS_SERVER:8848/nacos/v1/ns/operator/switches?entry=defaultInstanceEphemeral&value=false'
```

注意事项：当从老版本Nacos升级到Nacos 1.0.0时，从磁盘加载的实例数据会被置为持久化实例。


### 注册实例支持 groupName 字段
客户端注册实例时，可以在方法级别指定要注册的分组名，这个分组名和服务名是对服务的一个二维的标识，二者共同定位一个服务。一个典型的使用分组的例子如下：
```java
namingService.registerInstance("nacos.test.1", "group1", instance);
```
不指定分组的接口依然是支持的，此时会在服务端为这个服务分配一个默认的分组：DEFAULT_GROUP。


### 增加了Server状态的设置
Nacos 增加了对 Server 状态的控制，所有的状态都定义在 com.alibaba.nacos.naming.cluster.ServerStatus

类里。

![](https://img.alicdn.com/tfs/TB13uYWRMHqK1RjSZJnXXbNLpXa-596-408.png)

各个状态的含义介绍如下：

* UP：Server 一切正常，读写请求都会被接受；
* DOWN：Server 异常，所有请求会返回 HTTP 503 错误；
* STARTING：Server 还在启动中，所有请求返回 HTTP 503 错误；
* PAUSED：Server 被人工暂停，区别于 DOWN 可能是系统自己检测到异常然后设置 DOWN 状态，PAUSED 状态表示当前 Server 可能是没问题的，只是人工进行了干预；
* WRITE_ONLY：只有非 GET 请求会被接受；
* READ_ONLY：只有 GET 请求会被接受；

用户可以使用如下接口来修改集群所有机器的状态，如果再加上 debug=true 参数，则只修改当前机器的状态。

```
curl -X PUT '$NACOS_SERVER:8848/nacos/v1/ns/operator/switches?entry=overriddenServerStatus&value=READ_ONLY'
```
同时这个状态是会自适应进行修改的，比如启动时这个状态为 STARTING，等到数据装载完毕，则会自动将状态置为 UP，在运行过程中，如果检测到系统异常如磁盘满，则又会将状态置为 DOWN。不过自适应的状态值优先级要低于使用接口设置的状态值，因此当你想恢复自适应的状态调节的时候，记得将接口 overriddenServerStatus 设置为空。


### 增加全局推送开关
支持了全局推送开关，可以打开或者关闭服务变更的推送，调用接口如下：
```
curl -X PUT '$NACOS_SERVER:8848/nacos/v1/ns/operator/switches?entry=pushEnabled&value=false'
```
关闭推送后，客户端依然会通过轮询的方式来更新到数据，只是更新的速度没有推送那么快。


### 支持启动时数据预热
在老版本的 Nacos 中，只要 Server 启动成功就会开始对外提供服务，此时服务的数据并不一定完全加载完成，这样可能会导致客户端接收到的数据并不完整。1.0.0 版本增加了数据预热的逻辑，对于持久化数据，则会等待所有数据从磁盘加载完成；对于临时实例这样的非持久化数据，则会等待从其他Server拉取到完整数据。所有数据都准备好之后，才会将 Server 状态置为 UP。

注意事项：

对于临时实例的预热，实现机制是 Server 在启动时会从其他Server节点拉取数据，拉取成功则启动成功。但是当从老版本 Server 升级到 1.0.0 时，由于这个拉取全量数据的接口在老版本 Server 中不存在，那么第一个升级的机器将无法拉到任何数据，从而后面升级的机器也无法从第一个升级的机器拉取到数据。此时建议使用调用 API 将 Server 的运行状态设置为 WRITE_ONLY，允许客户端数据逐步汇聚补偿上来，但是要阻止任何查询的流量，直到集群数据准备好以后，再将这个运行状态清空，集群自动调整运行状态，最后就会提供完整服务。


### 元数据编辑框优化
此前的元数据编辑框需要用户按照指定格式来编辑，容易出错，如下图所示：

![](https://img.alicdn.com/tfs/TB1VgDQRNTpK1RjSZFMXXbG_VXa-602-392.png)

1.0.0 版本对服务页面的元数据编辑框进行了优化，在调整编辑框大小的同时，增加语法高亮，方便用户进行编辑和识别格式问题，编辑框预览图如下：![](https://img.alicdn.com/tfs/TB1nwL3RIfpK1RjSZFOXXa6nFXa-552-149.png)




### 支持 MySQL 8.0
Nacos 1.0.0 支持了 MySQL 8.0 驱动。您只需要将8.0版本的驱动jar包放置在{nacos.home}/plugins/mysql/下即可，不需要其他改动。

## Nacos 1.0.0 实现大规模生产可用

### API 完整列表开放，模型和架构设计文档更新

服务发现和配置管理的完整 API 列表会发布到官网

*地址：https://nacos.io/docs/v1/open-api/*


除了核心功能外，也包含部分运维接口，方便开发者进行集成。同时对于 Nacos 的数据模型、集群模型、架构设计及模块设计文档进行了更新

*地址：https://nacos.io/docs/v1/architecture/*

### 性能测试报告发布

Nacos 1.0.0 进行了性能测试，针对服务发现和配置管理的读写能力进行了大规模场景的压力测试。目前得到的测试数据是：



- 容量：服务实例数 100 万+，配置数 100 万+，支持客户端连接 100 万+；

- 读写TPS：1 万+；

- 节点扩展能力：100 节点+；

- 推送能力：1 万客户端订阅同一配置/服务，3 秒内收到变更通知比例 99.9%；



目前压测报告已经更新到官网：

*https:**//nacos.io/docs/v1/nacos-naming-benchmark.html*

*https:**//nacos.io/docs/v1/nacos-config-benchmark/*



### 100+ 企业用户已经上线生产环境



目前 Nacos 作为服务发现和配置中心已经有 100 多个用户的生产环境中服役，包含阿里巴巴、*虎牙* 等企业已经将 Nacos 大规模应用在核心业务场景中。



### 升级建议



Nacos 1.0.0 服务端个别接口与 0.8.0 以前的版本不兼容，0.8.0之前版本需要先升级到0.8.0，再升级到1.0.0。对客户端而言，Nacos 1.0.0 兼容 0.5.0 及以上的版本的客户端访问。



### **如何共建**

------



1. 如果您在文档中发现拼写错误，在代码中发现错误，想要新功能或想要提供建议，您可以在GitHub上创建一个 issues

   *地址：https://github.com/alibaba/Nacos/issues/new*

2. 或者可以选择 GitHub 仓库中有以下标签的 issues 入手：

- good first issue：对于新手来说是非常好的入门 issues。
- contribution welcome：亟待解决的问题和非常重要的模块，但目前缺少贡献者，欢迎贡献者来贡献。

## **![img](https://res.wx.qq.com/mpres/htmledition/images/icon/common/emotion_panel/smiley/smiley_66.png?tp=webp&wxfrom=5&wx_lazy=1&wx_co=1) 感谢贡献者们**

Nacos 开发团队正在日益壮大，从最开始的只有 4 个代码 Contributor，发展到目前的 40 多个。在 1.0.0 版本的开发中，社区同学贡献了很大的力量，在此表示感谢，他们是（排序不分先后）：

*yanlinly、xuechaos、hxy1991、jifengnan、nkorange、neatlife、loadchange、TsingLiang、jameslcj、duansheli、pbting、mingyixu、paderlol、nanamikon* 等。

![img](https://img.alicdn.com/tfs/TB1vmOsQb2pK1RjSZFsXXaNlXXa-1716-888.png)

> DISS is cheap, show me your hand 比吐槽更重要的是搭把手，参与社区一起发展Nacos

扫码进群，现在就加入我们。![img](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

![img](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)



**新人时刻 - 什么是 Nacos ？**

------

**Nacos** 是阿里巴巴于 2018 年 7 月份新开源的项目，Nacos 的主要愿景是期望通过提供易用的 动态服务发现、 服务配置管理、 服务共享与管理的基础设施，帮助用户在云原生时代更好的构建、交付、管理自己的微服务平台。



![img](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)



**与 Nacos 相关的开源项目**

***Nacos（点击“阅读原文”可进入）***

https://github.com/alibaba/nacos

***Dubbo Registry Nacos***

https://github.com/dubbo/dubbo-registry-nacos

***Nacos DNS-F***

https://github.com/nacos-group/nacos-coredns-plugin

***Nacos Spring Project***

https://github.com/nacos-group/nacos-spring-project

***Nacos Spring Boot***

https://github.com/nacos-group/nacos-spring-boot-project

***Spring Cloud Alibaba***

https://github.com/spring-cloud-incubator/spring-cloud-alibaba

***Dubbo***

http://dubbo.apache.org/en-us/

***Sentinel***

https://github.com/alibaba/Sentinel

***Spring Cloud***

https://spring.io/projects/spring-cloud

***Nepxion Discovery***

https://github.com/Nepxion/Discovery

***Spring Cloud Gateway Nacos***

https://github.com/SpringCloud/spring-cloud-gateway-nacoshttps://github.com/SpringCloud/spring-cloud-gateway-nacos)



*本文作者：*

朱鹏飞（花名：敦谷）

Github ID: nkorange，阿里巴巴中间件高级开发工程师，Nacos 开源项目负责人，Nacos 注册中心等模块主要贡献者。
