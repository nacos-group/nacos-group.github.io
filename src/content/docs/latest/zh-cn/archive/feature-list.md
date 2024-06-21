---
title: Nacos功能和需求列表
keywords: [Nacos, 功能, 需求列表, 服务发现, 配置管理, 元数据管理, 地址服务器, 内核优化, 安全稳定性, 云原生, 客户端支持, Docker部署, Kubernetes集成, Nacos-Sync, 官网建设, 共建参与]
description: 本文详细罗列了开源微服务项目Nacos的各项功能与未来需求规划，覆盖服务发现、配置管理、元数据管理等多个维度。通过表格形式展示了各功能的开发状态、负责人及预期发布时间，同时介绍了如何参与Nacos的开发与贡献，鼓励开发者认领任务，共同推进项目发展。
---

# Nacos功能和需求列表

本文列举了目前Nacos支持的主要功能和一些还未支持的需求排期，方便读者了解目前Nacos已经支持和计划支持的能力，同时所有计划支持的能力都开放给开发者进行认领，本文末有详细的认领教程。

在下面的表格中，每个需求都有一个状态的标志，包含若干种取值，各种取值的含义如下：

1. 状态的取值：
  1. 不支持：该功能还不支持，且没有在现在的时间表里有任何排期；
  1. 排期中：该功能还不支持，但是已经放到了时间表里，有希望在后面的某个版本支持；
  1. 设计中：表示该功能正在方案设计中，方案的草稿和终稿都会开放访问，供大家讨论；
  1. 开发中：表示该功能设计方案已经确定，正在有对应的开发者进行开发，会在接下来的某个版本正式发布；
  1. beta：该功能已经发布，但是未经过大规模的用户验证，还不能确保稳定性；
  1. 稳定：表示已经迭代至少4个版本，目前没有反馈重大缺陷；


<a name="rchXu"></a>
# 服务发现
代码地址：[https://github.com/alibaba/nacos/tree/develop/naming](https://github.com/alibaba/nacos/tree/develop/naming)

| 描述 | 主要开发者 | 状态 | 排期 |
| :---: | --- | --- | --- |
| 服务注册与发现 | nkorange | 稳定 | 0.1.0 |
| 健康检查（服务端探测、客户端心跳） | xuanyin | 稳定 | 0.1.0 |
| 路由策略（权重、保护阈值、就近访问） | wangjianwei | 稳定 | 0.1.0 |
|  |  |  |  |


<a name="VqAeY"></a>
# 配置管理
代码地址：[https://github.com/alibaba/nacos/tree/develop/config](https://github.com/alibaba/nacos/tree/develop/config)

| 描述 | 主要开发者 | 状态 | 排期 |
| :---: | --- | --- | --- |
| 配置管理（发布、修改、查询、监听配置） | yanlinly | 稳定 | 0.1.0 |
| 灰度配置 | yanlinly | 稳定 | 1.1.0 |
| 加密配置 |  | 不支持 |  |


<a name="H9PtL"></a>
# 元数据管理
代码地址：[https://github.com/alibaba/nacos/tree/develop/cmdb](https://github.com/alibaba/nacos/tree/develop/cmdb)

| 描述 | 主要开发者 | 状态 | 排期 |
| :---: | --- | --- | --- |
| 对接第三方CMDB | nkorange | beta | 0.7.0 |


<a name="iIIII"></a>
# 地址服务器
代码地址：[https://github.com/alibaba/nacos/tree/develop/address](https://github.com/alibaba/nacos/tree/develop/address)

| 描述 | 主要开发者 | 状态 | 排期 |
| :---: | --- | --- | --- |
| 支持Nacos寻址 | pbting | beta | 1.1.0 |


<a name="zaOdN"></a>
# Nacos内核
代码地址：[https://github.com/alibaba/nacos/tree/develop/core](https://github.com/alibaba/nacos/tree/develop/core)

| 描述 | 主要开发者 | 状态 | 排期 |
| :---: | --- | --- | --- |
| 去除MySQL依赖 | chuntaojun | 设计中 |  |
| Raft协议替换成JRaft | chuntaojun | 稳定 | 1.4.1 |
| 异步通知机制统一 | wfnuser | 设计中 |  |
| 线程模块统一 |  | 排期中 |  |
| 传输通道统一 | nkorange | 设计中 |  |
| 推送模块统一 | satjd | 设计中 |  |
| 启动模块统一 |  | 排期中 |  |


<a name="JiVAL"></a>
# 安全与稳定性
代码地址：[https://github.com/alibaba/nacos](https://github.com/alibaba/nacos)

| 描述 | 主要开发者 | 状态 | 排期 |
| :---: | --- | --- | --- |
| 命名空间模块下沉为公共模块 |  | 排期中 |  |
| 权限控制，包括认证与鉴权 | nkorange | 开发中 | 1.2.0 |
| 操作审计与记录 |  | 排期中 |  |
| 支持加密传输 |  | 排期中 |  |
| OpenTracing对接 |  | 排期中 |  |
| metrics收集 | TsingLiang | 稳定 | 0.8.0 |
| 缓存容灾机制统一 |  | 排期中 |  |
| 支持命令行运维 |  | 排期中 |  |
| 数据自动备份 |  | 排期中 |  |
| 限流模块 |  | 排期中 |  |
| 容量管理 |  | 排期中 |  |


<a name="YmLFu"></a>
# 代码质量
代码地址：[https://github.com/alibaba/nacos](https://github.com/alibaba/nacos)

| 描述 | 主要开发者 | 状态 | 排期 |
| :---: | --- | --- | --- |
| 工具类模块统一 |  | 排期中 |  |
| 常量定义统一 |  | 排期中 |  |
| 异常处理模块统一 |  | 排期中 |  |
| 日志模块统一 |  | 排期中 |  |
| 系统参数模块统一 |  | 排期中 |  |
| 依赖统一 |  | 排期中 |  |
| 状态码模块统一 | KeRan213539 | 设计中 |  |


<a name="OUg7P"></a>
# 云原生
| 描述 | 主要开发者 | 状态 | 排期 |
| :---: | --- | --- | --- |
| 对接Istio | nkorange | beta | 1.1.4 |
| 对接ConfigMap |  | 排期中 |  |
| [对接CoreDNS](https://github.com/nacos-group/nacos-coredns-plugin) | JianweiWang | beta | 0.1.0 |
| 对接SPIFFE |  | 排期中 |  |


<a name="nJ4NC"></a>
# 客户端
客户端支持包含了目前已知的Nacos多语言客户端及Spring生态的相关客户端，除了Java客户端和Go客户端，其他均为社区热心贡献者开发，如果您有新的语言的客户端，或者有目前已经支持的语言的客户端的另外一个实现，欢迎在github上留言进行登记。

| 描述 | 主要开发者 | 状态 |
| :---: | --- | --- |
| [Java客户端](https://github.com/alibaba/nacos/tree/develop/client) | Nacos | 稳定 |
| [Go客户端](https://github.com/nacos-group/nacos-sdk-go) | atlanssia, lzp0412 | 稳定 |
| [Node.js客户端](https://github.com/nacos-group/nacos-sdk-nodejs) | czy88840616, gxcsoccer | 稳定 |
| [Python客户端](https://github.com/nacos-group/nacos-sdk-python) | sanwei | beta |
| [C#客户端](https://github.com/catcherwong/nacos-sdk-csharp) | catcherwong | 推荐 |
| C++客户端 |  |  |
| PHP客户端 |  |  |
| [Spring客户端](https://github.com/nacos-group/nacos-spring-project) | chuntaojun | 稳定 |
| [SpringBoot客户端](https://github.com/nacos-group/nacos-spring-boot-project) | chuntaojun | 稳定 |


<a name="o6JMC"></a>
# Nacos-Docker
代码地址：[https://github.com/nacos-group/nacos-docker](https://github.com/nacos-group/nacos-docker)

| 描述 | 主要开发者 | 状态 | 排期 |
| :---: | --- | --- | --- |
| Docker部署Nacos Server | paderlol | 稳定 | 0.1.0 |


<a name="UofM8"></a>
# Nacos-K8s
代码地址：[https://github.com/nacos-group/nacos-k8s](https://github.com/nacos-group/nacos-k8s)

| 描述 | 主要开发者 | 状态 | 排期 |
| :---: | --- | --- | --- |
| K8s部署Nacos Server | paderlol | 稳定 | 0.1.0 |


<a name="FPPSf"></a>
# Nacos-Sync
代码地址：[https://github.com/nacos-group/nacos-sync](https://github.com/nacos-group/nacos-sync)

| 描述 | 主要开发者 | 状态 | 排期 |
| :---: | --- | --- | --- |
| Nacos与Nacos服务双向同步 | paderlol | 稳定 | 0.1.0 |
| Nacos与Zookeeper服务双向同步 | paderlol | 稳定 | 0.3.0 |
| Nacos与Eureka服务双向同步 | paderlol | 稳定 | 0.3.0 |
| Nacos与Consul服务双向同步 | paderlol | 稳定 | 0.3.0 |


<a name="sM3KF"></a>
# Nacos官网
代码地址：[https://github.com/nacos-group/nacos-group.github.io](https://github.com/nacos-group/nacos-group.github.io)

| 描述 | 主要开发者 | 状态 | 排期 |
| :---: | --- | --- | --- |
| 支持页面内锚链接 |  | 不支持 |  |



<a name="mIQnp"></a>
# 参与共建
<a name="zjUdC"></a>
### 参与共建能得到什么？
参与Nacos共建，你将有机会让你的代码被全中国甚至全世界的用户阅读并使用，同时在成为Nacos Committer后（如何成为Nacos Committer可以参考[手册](https://github.com/alibaba/nacos/blob/develop/CONTRIBUTING.md)），还可以有以下福利：

- 在Nacos官网[团队页](https://nacos.io/docs/latest/community/nacos-dev/)留名；
- 收到我们带Nacos logo的小礼物，有T恤、水杯、帽衫等等；
- 代表Nacos参加各种线上线下活动，与更多小伙伴交流；
- 更多我们还在筹划中的福利；

<a name="9eqix"></a>
### 如何共建
除了在上面列举的功能和需求，其他的在github仓库上打上了[contribution welcome](https://github.com/alibaba/nacos/issues?q=is%3Aopen+is%3Aissue+label%3A%22contribution+welcome%22)或者[help wanted](https://github.com/alibaba/nacos/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22)标签的issue，也非常欢迎大家提交代码贡献。加入Nacos 社区核心贡献小组钉钉群23335652，联系群管理员认领需求。

大家提PR的时候有几点需要注意下：

1. 比较重大的特性需要有方案文档：[https://github.com/alibaba/nacos/issues/858](https://github.com/alibaba/nacos/issues/858)
1. 已经阅读并遵守共建规范： [https://github.com/alibaba/nacos/blob/master/CONTRIBUTING.md](https://github.com/alibaba/nacos/blob/master/CONTRIBUTING.md)
1. 使用github账户提交代码，这样大家才会在contributor列表看到自己的名字；
1. commit信息要带上issue id，这样才能在issue里看到PR的进度；
1. 代码中不要出现中文注释，提交前要格式化，并添加必要的集成测试用例和单元测试用例；
1. 提PR前运行mvn -Prelease-nacos clean install -U和mvn clean install -Pit-test成功；

任务认领原则：每人一次最多领取两个任务，任务PR合并后，即可开始认领下个任务。
