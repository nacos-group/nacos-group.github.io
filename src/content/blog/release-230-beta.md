---
title: 2.3.0-BETA发布，欢迎试用
keywords: [2.3.0]
description: 2.3.0-BETA发布，欢迎试用
date: "2023-10-24"
category: release
---
# 2.3.0-BETA发布，欢迎试用

## 新版本发布

经过4个多月社区的大量贡献，Nacos 2.3.0版本终于进入的Beta发布阶段，在经历了2.2.X的多个安全风险修复的版本后，又一次迎来了功能性上的更新版本。

### Nacos 反脆弱插件

2.2.0版本加入ALPHA版本的反脆弱插件后，社区经过多次重构和修改，提升抽象度和稳定性，终于在2.3.0版本中正式公布了Nacos的反脆弱插件，用于避免Nacos集群在大量请求和连接时导致的容量问题而引发更大规模的故障。

默认反脆弱实现插件的使用以及自定义反脆弱插件的开发可参考文档[反脆弱插件](https://nacos.io/docs/v2/plugin/control-plugin/).

### Nacos 配置变更插件

Nacos配置管理作为Nacos的核心功能，一直受到开发人员、运维人员和审计人员的关注，不少运维人员和审计人员向社区提出诉求，希望Nacos能够提供配置变更的审计、变更通知等功能；同时开发人员也希望Nacos提供一定的格式校验功能，避免修改配置时出现错误导致应用故障。

由于Nacos配置管理本身对配置内容是不感知的，且各个用户公司的审计、通知系统也各不相同，因此Nacos为了能够更广阔的适配各个用户的诉求，在去年的开源之夏中制定了配置变更插件的课题，希望以插件化的形式，来满足对配置变更过程的介入。

经过同学和导师长期的努力，该插件在2.3.0版本发布，用户可以开发自定义插件，在配置变更前和变更完成后，分别对接公司的审计系统和通知系统，并在变更前进行更多的校验操作，如格式校验，配置名字的规范化等。同时Nacos社区也提供了默认插件的实现，可接入webhook进行配置变更的通知以及导入配置的文件名校验等；详情可参考文档[配置变更插件](https://nacos.io/docs/v2/plugin/config-change-plugin/)

### Nacos 请求参数校验

2.3.0版本之前的Nacos的参数校验逻辑分散，由各类请求的处理方法单独进行校验，难以更改维护，经常出现参数校验的遗漏，参数校验的规则也没有明确统一；这使得用户使用时经常会因为一些特殊字符导致功能不符合预期或出现漏洞，甚至导致大量推送，导致带宽打满，内存占用过多，导致应用出现故障。

在2.3.0版本中，Nacos明确了参数校验规则，在服务端实现了统一的参数校验逻辑并添加了参数校验层，根据校验规则对客户端向服务端发送的请求进行校验。用户可以选择开启参数校验功能，开启后Nacos将会对客户端向服务端发送的请求中的部分参数进行参数校验，确保参数的合法性，避免由于错误使用，导致的不符合预期以及性能问题。

详细情况可参考文档[参数校验规则](https://nacos.io/docs/v2/guide/user/parameters-check/)

### Nacos 能力协商

随着Nacos功能越来越多，版本越来越多，客户端和服务端之间的兼容性愈发重要，如果继续保持尝试性的兼容，只会兼容能力愈发的困难。因此Nacos社区在去年开源之夏中，发布了课题，通过增加客户端和服务端之间的能力协商机制，在客户端连接到服务端时，让连接双方知道对方分别支持的功能，在支持对应功能的情况下，开启对应功能。避免通过尝试而增加通信开销。

在2.3.0版本中，该能力也被集成进来，为之后Nacos3.0支持更多优化功能提供基础。

### 其他重要改动

除了上述改动，Nacos2.3.0版本还支持了：客户端异常的metrics、grpc长连接的SSL功能、关闭开源控制台等功能，更多细节可以查看变更列表，欢迎试用：

```markdown
## feature
[#5698] Support nacos control plugin.
[#8458] Support ability negotiations between server and clients.
[#8460] Support config change hook plugin.
[#10117] Support metrics for nacos client request server exception.
[#10150] Support SSL for grpc connection.
[#10223] Support auto build instance id when client request instance id is null.
[#10288] Support get more module state and switches in console.
[#10734] Support validate most of request parameters.
[#10774] Support toml format for configuration in console ui.
[#10831] Support batch deregister instances for service.
[#10971] Support disable console ui and support add guide information.

## Enhancement&Refactor
[#6819] Add page size selector in service details page.
[#8107][#9109][#10169][#10176] Enhance hint when console ui session expired for default auth plugin.
[#9085] Add the Reachability Metadata required by native-image.
[#9821] Enhance datasource plugin to make more datasource implementation easier.
[#9881] Enhance configuration page to supports folding when editing configuration.
[#10067] Enhance Windows compatibility for configuration snapshot.
[#10155] Enhance hints for grpc request when request timeout.
[#10343] Use CMS as default GC when jdk less 9.
[#10361] Refactor module switches to make only load specified module but not only close in console ui.
[#10520] Validate for namespace show name when create new namespace.
[#10521] Enhance the hints for `No DataSourceSet` error by validate datasource after construction.
[#10539] Enhance logs when opeation configuration failed.
[#10730] Link to v2 document for console ui.
[#10811] Enhance compatibility for colorful service healthy status in console ui.
[#10891] Support setting maximum number of push retries.
[#10930] Forward compatible old version secretKey for default auth plugin.
[#11129] Remove the namespace information from the node list page.
[#11231] Optimize the handleSpringBinder method in PropertiesUtil.

## BugFix
[#10056] Fix loss revision of client for distro sync.
[#10128] Fix wrong judgement in raft stateMachine.
[#10149] Fix dead lock on sending connection reset request on server over limit.
[#10271] Fix nacos-client failover switch file path.
[#10318] Fix import configuration problem.
[#10347] Fix only admin role user can register service into default namespace when enabled default auth plugin.
[#10406] Fix jraft install leader snapshot error after disconnection.
[#10427] Fix nacos client no response when handle server request with exception.
[#10464] Fix NPE when concurrent operations for client.
[#10470] Fix some missed i18n for console ui.
[#10509] Fix out data connection not be disconnect problem.
[#10548] Fix switch domain might not load snapshot after restart.
[#10556] Fix index loss for client and service in extreme scenarios.
[#10583] Fix some new API loss auth check.
[#10585] Fix selectInstances and selectOneHealthyInstance methods will not subscribe service problem.
[#10593] Fix invalid create `file:` dir under `nacos.home`.
[#10598] Fix nacos-client not random get server address when using address.
[#10606] Fix memory leak for nacos client when user create and shutdown client frequently.
[#10657] Fix NPE when using derby datasource for cluster mode.
[#10935] Fix startsWith judgement wrong when ignoreCase is true.
[#11056] Fix Batch register count size wrong, when batch register sereval time.
[#11059] Fix RPC_CLIENT_TLS_PROTOCOLS setting error.
[#11192] Fix batchRegisterInstance not recalculate revision prblem.
[#11197] Fix frequent do query service when hit protect empty.

## Dependency
[#7698] Remove httpasyncclient version dependency management to avoid version conflicts.
[#10416] Upgrade console yaml editor.
[#10648] Optimize Guava Dependency.
[#10893] Upgrade spring boot to 2.7.15.
[#11199] Upgrade grpc version to 1.57.2.
```

## 展望
### 2.X 后续计划

从2021年3月 2.0.0正式版发布至今，2.X版本已经走了接近2年时间，如今2.3.0版本发布，完成了大部分功能的插件化提炼，在之后的2.3.X版本中，会主要对当前版本的问题进行修复，并做出小范围的功能优化。同时对于2.4.0版本，会作为一个Nacos3.0的过度版本，对大量代码进行优化重构，在提升稳定性、健壮性的同时，提升易用性和可观测性，向Nacos3.0版本平稳过度。

### 3.0 计划

Nacos社区同时也开启了关于[Nacos3.0](https://mp.weixin.qq.com/s/8UwwD_WxSJINP8Qr_1wogg) 的畅想和规划，Nacos将会从统一控制面、支持国产化、存储计算分离等方向进一步演进Nacos的功能和架构，欢迎社区积极参与到新版本的建设中。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/1577777/1698198629123-af9f1216-f996-4ac2-81bf-436048823d21.png)

![image.png](https://cdn.nlark.com/yuque/0/2022/png/1577777/1660125280551-a2e881fe-d25e-4ebb-a28f-8e56683deef1.png#clientId=uf10cb19a-105c-4&crop=0&crop=0&crop=1&crop=1&from=url&id=Z9to1&margin=%5Bobject%20Object%5D&name=image.png&originHeight=794&originWidth=1650&originalType=binary&ratio=1&rotation=0&showTitle=false&size=185821&status=done&style=none&taskId=u63849e10-1dae-45cb-b559-04d106ebe86&title=#crop=0&crop=0&crop=1&crop=1&id=rUihF&originHeight=794&originWidth=1650&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

## About Nacos

Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及流量管理。

Nacos 帮助您更敏捷和容易地构建、交付和管理微服务平台。 Nacos 是构建以“服务”为中心的现代应用架构 (例如微服务范式、云原生范式) 的服务基础设施。

最后欢迎大家扫码加入Nacos社区群

![image.png](https://cdn.nlark.com/yuque/0/2023/png/1577777/1679276899363-83081d59-67c6-4501-9cf8-0d84ba7c6d7e.png#averageHue=%23c1c2c2&clientId=u9dfeac18-3281-4&from=paste&height=551&id=ubcf45e51&name=image.png&originHeight=1102&originWidth=854&originalType=binary&ratio=2&rotation=0&showTitle=false&size=155261&status=done&style=none&taskId=ud6bea1fe-b003-441b-a810-84435d2aeff&title=&width=427)

