---
title: Nacos 3.0.0 BETA、2.5.1、Nacos Controller 2.0同时发布
keywords: [3.0.0, BETA, Controller, 安全, AI, 云原生]
description: Nacos 3.0.0 BETA、2.5.1、Nacos Controller 2.0同时发布
date: "2025-03-26"
category: announcement
---
# Nacos 3.0.0 BETA、2.5.1、Nacos Controller 2.0同时发布

## 1. Nacos 双版本同时发布
### 1.1. Nacos 3.0.0 BETA
Nacos `3.0.0 BETA` 在 `3.0.0-ALPHA.2`的基础上，完成了Server及Console的拆分部署、新旧命名空间的平滑升级兼容、以及更好的启动部署脚本等功能。这也意味着Nacos 3.0.0的所有计划功能已经全部完成， 进入最终的排错阶段，正式版将在不久发布。

#### 1.1.1. Server及Console拆分部署
在Nacos `3.0.0-ALPHA.2`中已经完成控制台和引擎的端口拆分及`ADMIN API`和`Console API`，允许用户设定独立的访问端口。这一改变使得Nacos集群的运维人员能够更灵活地配置网络访问控制列表（ACL），例如，仅将控制台端口开放给办公网络。同时，配合控制台默认启用的安全认证，这将显著提高Nacos的`安全性`。

在`3.0.0-BETA`中，Nacos彻底实现了控制台和引擎节点的灵活拆分部署，使得它们能够在不同节点上运行，进一步增强`安全性`。

![](/img/blog/3_0_0-release/3.0_deploy.svg)

需要独立部署Nacos Console时，仅需在启动服务器时添加`-d console`，例如`sh startup.sh -d console`即可，这样Nacos就会启动一个独立的Console，Console不存储实际的数据，而是到实际运行的Nacos Server集群中实时获取数据，同时默认启用鉴权。实现从网络、存储、鉴权等全方位的`安全性提升`。

更多部署的详细操作，请参见文档 [控制台独立部署](../docs/latest/manual/admin/deployment/deployment-independent.md)。

#### 1.1.2. 平滑升级支持
在Nacos `3.0.0-ALPHA.2`中，为了解决默认命名空间ID的使用问题，Nacos 3.0对默认命名空间的ID进行调整。根据社区讨论的[ISSUE#9846](https://github.com/alibaba/nacos/issues/9846)，默认命名空间的ID将被修改为`public`，与其名称相同。在访问API时，如果未传入命名空间ID或仍然传入`空字符串''`，Nacos 3.0将自动将其匹配为`public`以进行后续处理，从而兼容旧客户端的访问请求。但Nacos `3.0.0-ALPHA.2`版本在数据存储的平滑迁移和适配方面尚未进行处理，因此进行直接升级会导致配置数据无法获取，并且目前无法实现平滑升级。

在3.0.0-BETA中，Nacos从数据源插件层面入手，通过适配存量数据存储的方式，在升级期间对`空字符串''`命名空间的数据进行迁移，升级至`public`，同时在升级期间对两类命名空间进行双写操作，兼容升级用户的存储数据内容，以支持2.X的用户进行平滑升级，同时保留平滑降级的能力。

![](/img/blog/3_0_0-release/3.0_namespace.svg)

在升级完成并稳定运行后，通过关闭命名空间兼容模式，停止双写，释放升级时兼容模式带来的性能损耗，获取满血版Nacos 3.0。

更多升级相关的内容，请参见文档 [升级手册](../docs/latest/manual/admin/upgrading.md)。

#### 1.1.3. 更好的启动及部署脚本
在Nacos3.0版本前，Nacos的默认鉴权插件为安装部署Nacos时的可选项，虽然推荐用户打开，但并未在部署启动时强制要求。

随着社区对安全性的诉求越来越强烈，在Nacos3.0之后，Nacos的`控制台UI`,`Console API`,`Admin API`都默认开启Nacos的默认鉴权插件。这要求用户在部署Nacos时必须填入对应的配置信息；若直接使用启动命令启动Nacos，可能会导致启动失败或无法正常使用。

为了解决这个问题，Nacos3.0-BETA提供更好更便捷的启动和部署脚本，在首次部署使用时，通过交互式的方式让用户填入必要的配置内容，避免部署前修改对应的配置文件。

例如：

```shell
sh startup.sh -m standalone

`nacos.core.auth.plugin.nacos.token.secret.key` is missing, please set: ${your_input_token_secret_key}
`nacos.core.auth.plugin.nacos.token.secret.key` Updated:
----------------------------------
`nacos.core.auth.server.identity.key` is missing, please set: ${your_input_server_identity_key}
`nacos.core.auth.server.identity.key` Updated:
----------------------------------
`nacos.core.auth.server.identity.value` is missing, please set: ${your_input_server_identity_key}
`nacos.core.auth.server.identity.value` Updated:
----------------------------------
```

当然，如果您已经在配置文件中配置好了对应的内容，或是在之前的启动中已经设置完毕，启动脚本将直接启动Nacos，不会再进行提示输入。

### 1.2. Nacos 2.5.1
Nacos `2.5.1`版本主要针对`2.5.0`版本中的一些Bug和使用场景进行修复和优化，例如为默认鉴权插件添加获取`accessToken`的随机时间窗口避免周期性的`/login`调用峰值；识别请求403错误码，自动重新`/login`后再重试请求，优化`token`修改后应用需要较长时间获取新`accessToken`的场景等等。

具体的优化和修复内容，请查看ChangeLog：

```markdown
## Enhancement&Refactor
[#12823] Randomly generate TokenRefreshWindow for default nacos auth plugin in client.
[#13119] Remove old config tag and beta tables, using gray table replaced.
[#13122] Add TLS information to connection meta so that server can find client whether open TLS.
[#13129] Optimize Client connection parameter configuration to Properties.
[#13135] Support callback service listeners anyway when listeners added.
[#13138] Enhance invalid parameter transfer during Nacos client get or subscribe service.

## BugFix
[#12991] Set the correct result status code for Distro protocol data processing exceptions.
[#13027] Fix persistent service instance metadata will not be expired after instance deregister.
[#13090] Fix V2 openAPI get configuration for specified namespace id.
[#13093] Fix missing tansformation of default namespace id in config center.
[#13106] Fix TopN config no init config value in server start.

## Dependency
[#13133] Remove unused common-codec.
```

## 2. Nacos Controller 2.0 随3.0.0 Beta同时发布，更好地支持K8S生态
Nacos作为微服务领域的注册配置中心，被越来越多的开发者使用，也与多种开发框架集成，大大方便了开发者。但目前仍然有一些场景没有满足。

1. 有些用户可能同时使用了Nacos服务发现与K8s服务发现，使用Nacos服务发现的应用希望能够通过Nacos发现K8s集群的服务；
2. 应用目前使用K8s的configmap和secret，很方便的通过Nacos管理configmap和secret，

Nacos-Controller就是为解决上述问题而诞生的。它可以帮助同步K8s的Service到Nacos，也可以支持K8s的configmap、secret与Nacos配置的双向同步。

### 2.1. Nacos服务与K8S服务互相发现
Nacos Controller 2.0 支持将Kubernetes集群特定命名空间下的Service同步到Nacos指定命名空间下。用户可以通过Nacos实现对Kubernetes服务的服务发现。以此实现跨K8S集群的服务发现和访问，或实现K8S集群与非K8S集群间的服务发现和访问，解决容灾备份，平滑迁移等一系列高可用，稳定性相关的高级服务发现场景。

![](/img/blog/3_0_0-release/nacos_controller_cross_k8s_situ.svg)

![](/img/blog/3_0_0-release/nacos_controller_non_k8s_situ.svg)

### 2.2. Nacos管理K8S configmap和secret
Nacos Controller 2.0 支持Kubernetes集群配置和Nacos 配置的双向同步，将Kubernetes集群特定命名空间下的ConfigMap以及Secret同步到Nacos指定命名空间下中。用户可以通过Nacos实现对于Kubernetes集群配置的修改和管理，以达到ConfigMap和Secret的动态修改、版本管理、灰度发布等场景。

![](/img/blog/3_0_0-release/nacos_controller_config_gray.svg)



关于Nacos Controller 2.0的更多细节，欢迎访问[Nacos Controller文档](https://github.com/nacos-group/nacos-controller/blob/main/README.md)。同时关于Nacos Controller 2.0使用的具体技术细节和使用方式的相关技术文章也已经在准备中，相信很快就能和大家见面。

## 3. Nacos配置中心注解升级
<font style="color:rgb(53, 56, 65);">在Spring Cloud应用中可以非常低成本地集成Nacos实现配置动态刷新，在应用程序代码中通过Spring官方的注解@Value和@ConfigurationProperties，引用Spring enviroment上下文中的属性值。这种用法的最大优点是无代码层面侵入性，但也存在诸多限制，比如：</font>

+ Nacos中配置是作为Spring上下文enviroment的属性源之一，获取属性时会收到其他属性源的干扰，比如通过JVM参数和环境变量注入的属性优先级比Nacos中的更高
+ 通过spring.config.import导入多个Nacos配置时，其中相同的key对应的属性只会有一个生效，需要控制多个属性源的key不重复或者处理因优先级问题导致的属性覆盖问题。无法精准获取指定Nacos配置中的属性
+ 无法将Nacos配置自动注入对象类型的字段
+ 只能被动接受配置最终内容，无法在配置变更时对配置进行二次处理或者触发其他业务动作，无法感知指定的属性变更前后的详细信息
+ 通过@Value注解引用的配置要支持动态刷新，需要在SpringBean上添加@RefreshScope，配置更新时会先将Bean销毁再重新创建新的Bean，使用不当易产生线上问题。

为了解决以上问题，提升应用接入Nacos配置中心的易用性，Spring Cloud Alibaba发布一套全新的Nacos配置中心的注解，并作为Nacos 3.0 生态中的一部分，为之后动态数据源等功能做基础准备。

+ @NacosConfig：作用于SpringBean的字段，将Nacos中指定的配置注入字段；作用于SpringBean Class，将Nacos中指定的配置注入Bean的属性中；作用于FactoryBean 方法，将Nacos中指定的配置注入Bean的属性中，不依赖RefreshScope注解即可生效。
+ @NacosConfigListener：作用于SpringBean的方法，在Nacos中的配置发生变化时，以方法参数形式接受变更后的最新配置内容，支持以对象类型接收结果。
+ @NacosConfigKeysListener：作用于SpringBean的方法，在Nacos中的配置的指定属性key集合发生变化时，以方法参数ConfigChangeEvent接受变更前后的属性值。

关于3种Nacos配置中心注解的具体使用方法，请参见[SpringCloud应用Nacos配置中心注解](./nacos-gvr7dx_awbbpb_mmufdmayp5dfozci.md)。

## 4. Nacos 3.X 发展蓝图
在Nacos 3.0的发展蓝图中，我们将继续致力于提升易用性与普适性，以满足用户日益增长的需求。

在引擎自身方面，新版本计划支持`DNS协议`，以进一步拓展Nacos在支持较弱编程语言场景中的适用性。另外对于`服务健康检查体系`，我们将优化相关机制，通过将健康检查与服务类型解耦，提供更多关于服务可用性的判断依据，这将使微服务之间的流量调用更加灵活，同时确保系统的稳定运行。最后对于社区中已经比较成熟的插件，我们会将其纳入Nacos的主干仓库中进行维护，诸如`PostgreSQL插件`、`AES配置加密插件`等，让这些插件在后续版本中随引擎一起发布、不需要再独立构建引入。

在生态建设方面，我们将通过Nacos Controller的快速迭代，实现`Kubernetes服务与配置的同步管理`，从而使云原生环境下的使用变得更加便捷。此外，我们将积极探索`多语言生态与AI大模型的集成`，通过支持多语言应用框架以及Spring AI和其他AI大模型开发框架的动态prompt发现和资源发现，为用户提供更加丰富的功能选择与应用场景，努力构建一个高效、灵活的分布式协调平台。

![](/img/blog/3_0_0-release/3.0_roadMap.svg)

### 4.1. Nacos AI生态探索
在Nacos 3.X中，除了Nacos自身能力的提升规划外，在AI Agent与大模型的应用场景也是Nacos 3.X的一个主要探索方向。Nacos希望打造一个面向AI应用的动态配置与全场景管理能力，支持AI Agent、大模型推理、多语言框架集成及安全合规，驱动动态化、智能化与高效开发运维。

![](/img/blog/3_0_0-release/nacos_config_ai.jpg)

#### 4.1.1. 动态配置与运行时调优的增强
Nacos 3.X 通过强化Python-SDK的迭代和功能演进，提供无状态、高可用的参数分发能力，适配Python（Langchain、Llamaindex）、Java（Spring-AI-Alibaba）、Go/Node.js等多语言AI框架，用以支持AI相关参数的动态管理，例如：支持LLM模型参数（如权重、学习率、批大小）、Prompt模板、特征选择、推理策略等动态更新，实现模型推理的实时调优（如A/B测试、流控、负载均衡）。同时动态管理AI Agent的任务规划、调度策略、联网参数及动态数据源，支持Agent实例的弹性扩缩容和全局状态同步，实现AI Agent运行时的动态能力增强。

#### 4.1.2. 应用开发及管理提效
Nacos 3.X计划为模型推理服务（如MCP Servers）提供实时参数配置与版本控制，支持动态切换模型版本、算法策略或密钥，降低AI应用及相应参数和配置的管理成本。同时提供统一的Prompt模板管理，管理Prompt的版本、权限与动态更新，适配多场景调用；另外Nacos 3.X计划无缝对接AI应用平台（如终端应用运行时、算法优化工具链），提供注解注入、回调机制及动态数据源配置接口，降低AI应用开发与部署门槛。

#### 4.1.3. 安全合规与可信保障
在数据安全与合规管理方面，Nacos 3.X计划通过集成密钥管理、加密算法及安全的凭据存储机制，为Model-as-a-Service（MaaS）等场景提供敏感信息保护能力，同时内置访问控制策略、数据脱敏规则与审计日志功能，支持金融、医疗等高敏感领域对AI应用的合规要求；此外，系统还通过版本灰度发布（A/B测试）与快速回滚机制实现配置变更的动态控制，在保障配置更新安全性的同时，有效规避因配置异常引发的系统性风险，确保AI模型在动态调整过程中持续稳定运行。

![](/img/blog/3_0_0-release/nacos_ai_agent.jpg)

### 4.2. Nacos 安全生态探索
Nacos 一直在尝试构建安全稳定可靠的注册配置中心服务，自Nacos 1.2.0 发布首个鉴权功能以来，通过鉴权插件添加自定义安全强度的鉴权能力；通过配置加密插件保证传输及存储的数据安全性；也通过支持TLS，控制台提示，移除安全相关默认值等运维手段间接提升Nacos的默认安全能力。

在Nacos 3.X 中，除了通过拆分API、拆分Console和Server的部署架构外，还计划新增数据源凭据动态轮转的功能，帮助微服务应用能够低成本且稳定的轮转数据源的访问凭据，降低因长期使用凭据带来的泄漏风险，降低凭据泄漏后的轮转时长，以提升通过Nacos进行数据源配置管理的微服务应用的安全性。

数据源凭据动态轮转功能将以`数据库`类型的数据源作为探索的开始，和`Duird`社区合作，打造安全，稳定，易用的数据源凭据动态轮转方案。

## 5. Nacos MeetUp活动预告
随着 Nacos 3.0正式版本即将发布，Nacos社区正式启动线下技术交流会（MeetUp）筹备工作。活动聚焦前沿技术趋势，特设AI大模型与场景化应用、云原生安全实践、Spring Cloud Alibaba生态、Dubbo 新特性、Spring AI Alibaba技术探索及Higress周边生态等专题研讨。会议拟于2024年5月初举行，诚邀广大Nacos用户、开发者及技术爱好者莅临交流。此外，社区面向各开源项目团队开放议题征集，欢迎各领域专家提交技术分享提案。具体时间及议程将在社区官方渠道同步更新，敬请关注Nacos官网与社交媒体平台。

## 6. About Nacos
Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及流量管理。

Nacos 帮助您更敏捷和容易地构建、交付和管理微服务平台。 Nacos 是构建以“服务”为中心的现代应用架构 (例如微服务范式、云原生范式) 的服务基础设施。

最后欢迎大家扫码加入Nacos社区群

![](https://img.alicdn.com/imgextra/i4/O1CN01qOYVoX1DsAKLKzfGh_!!6000000000271-49-tps-1080-1177.webp)

