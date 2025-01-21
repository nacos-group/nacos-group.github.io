---
title: Nacos 2.5.0、3.0.0-ALPHA.2、Python-SDK 2.0 正式发布
keywords: [2.5.0, 3.0.0, Alpha.2, Nacos-Python-SDK]
description: Nacos 2.5.0、3.0.0-ALPHA.2、Python-SDK 2.0 正式发布
date: "2025-01-25"
category: announcement
---
# Nacos 2.5.0、3.0.0-ALPHA.2、Python-SDK 2.0 正式发布

## 1. Nacos 2.5.0版本发布，支持记录配置灰度历史

Nacos2.5.0 版本主要集中在配置灰度管理的优化、客户端地址和认证逻辑的统一以及多个功能的增强和问题修复，以提升整体使用体验和效率。

### 1.1. 记录配置灰度历史

Nacos 从1.0版本开始支持用户通过`Beta发布`功能，指定部分配置订阅者优先获取配置内容，进行配置变更的灰度，进行新配置功能性和正确性的验证；若新配置存在问题，仅影响选定的部分配置订阅者，且能够通过`停止Beta`快速将这部分订阅者的配置进行回滚；同时验证无问题后，也可以通过`正式发布`将新配置发布到其他配置订阅者中。有效的提升了配置变更期间的稳定性和可用性，避免因错误的配置导致业务出现大面积的故障。

然而由于之前该功能的设计并未考虑记录之前`Beta发布`的内容，这导致用户一旦进行了`停止Beta`或`正式发布`后，将会丢失这个Beta的记录和内容。特别是在`停止Beta`后，由于未记录`Beta`变更的内容，只能依靠发布者自行记录配置更改的内容，进行下一次`Beta`变更的修改。

因此Nacos社区课题[ISSUE#12217](https://github.com/alibaba/nacos/issues/12217)的优化，在2.5.0版本支持了对`Beta`灰度发布的历史记录，方便用户在配置灰度变更后，能够查询到之前停止或已灰度的配置变更历史记录和内容。

:::warning
该功能依赖 `his_config_info`表结构的变更，因此在从**旧版本进行升级**时，需要先对数据库表结构进行变更，详情请查看文档[升级手册](../docs/latest/manual/admin/upgrading/?spm=5238cd80.2ef5001f.0.0.3f613b7cbOnGYk)。
:::

### 1.2. 寻址逻辑统一且支持扩展

Nacos-Java-Client由于历史原因，注册中心模块和配置中心模块对于寻找Nacos Server的地址逻辑（以下称寻址逻辑）存在一定的差异且代码中存在相当的冗余存在，这导致社区开发者对于这一部分修改和拓展变得异常艰难，经常出现修改遗漏、错误等问题，影响Nacos-Java-Client的稳定性，如[ISSUE#9824](https://github.com/alibaba/nacos/issues/9824) 所提出的问题。

社区曾经在课题[ISSUE#8310](https://github.com/alibaba/nacos/issues/8310)想要通过插件方式统一注册中心和配置中心的寻址模块以尝试解决，但当时的目标不仅需要统一客户端中注册中心和配置中心的寻址模块，还需要将客户端和服务端的寻址模块一起进行统一，且需要以插件的形式实现。随着项目的开发进展以及实践的反馈中，社区发现客户端和服务端的寻址模块在诸多方面有着不同，比如在对一致性的要求、在可用性的要求上。 因此社区的主线分支并没有采纳这种方案。

最终，通过课题[ISSUE#12189](https://github.com/alibaba/nacos/issues/12189)，仅统一Nacos-Java-Client中的寻址逻辑，并且通过文档[Nacos 客户端寻址](../docs/latest/manual/user/addressing/?spm=5238cd80.2ef5001f.0.0.3f613b7cbOnGYk)详细描述寻址逻辑，以方便后续开发者和用户理解Nacos的客户端寻址逻辑，同时提供了自定义的拓展方式，用户开发者开发自定义的寻址逻辑。

### 1.3. 鉴权信息过期时快速重新登陆

Nacos 从1.2版本开始支持默认鉴权插件，通过`nacos.core.auth.plugin.nacos.token.secret.key`参数设置一个secret，并使用该secret生成临时accessToken用于客户端访问Nacos。

许多对安全要求较高的用户，在进行该secret的轮转时发现，将secret替换为新的值之后，客户端会持续的出现访问403，原因是accessToken无效，这是因为Nacos Client中对之前的accessToken进行了缓存，在accessToken达到过期时间之前，Nacos Client不会重新进行login去获取新的accessToken；而修改了secret后，旧的accessToken和secret就不再匹配，因此出现了无效accessToken的问题。

在之前的版本中，轮换secret需要将accessToken的过期时间相对调短，待客户端轮转之后，再更换secret值，随后将accessToken的过期时间恢复。但这个方案会导致这期间有较大量的login接口调用，由于login接口存在密码的加密匹配，导致大量CPU计算，因此有可能导致CPU使用较高，影响Nacos集群的容量，导致容量风险。

因此在Nacos的2.5.0版本中，对客户端的accessToken逻辑进行了优化，发现accessToken无效后，快速的发起一个login尝试获取新的accessToken，以解决secret轮换导致的Nacos Client访问失败及accessToken有效期缩短导致的期间大量调用login的问题。

关于更多Nacos 2.5.0版本的改动，请参考[Nacos 2.5.0 变更日志](https://github.com/alibaba/nacos/releases/tag/2.5.0)。

## 2. Nacos 3.0.0-ALPHA.2发布，支持分布式锁及模糊订阅

Nacos 3.0.0-ALPHA 发布也有近2个月了，在Nacos 3.0.0-ALPHA 中完成了许多新版本的特性和功能，同时对3.X版本的规划做了一个公布，详情可查看[Nacos 3.0 Alpha 发布，在安全、泛用、云原生更进一步](./release-300-alpha)。

Nacos 3.0.0-ALPHA.2于新春之前发布，带来了更多的特性和优化支持。

### 2.1. 支持分布式锁

Nacos社区向用户征集了他们对Nacos 3.0的期望功能，其中支持分布式锁的需求是呼声最高的功能之一。分布式锁是一项在分布式应用中常用的功能，目前大多数实现依赖于Zookeeper或Redis等产品。许多用户已经将Nacos替换为Zookeeper来进行服务和配置管理，但由于Nacos尚未支持分布式锁，用户仍需额外运维Zookeeper集群，增加了系统的复杂性。

因此，Nacos社区通过课题[ISSUE#10378](https://github.com/alibaba/nacos/issues/10378)实现分布式锁的功能，并在3.0.0 ALPHA.2 中引入分布式锁的实验性功能，以满足部分用户对轻量级分布式锁的需求。这一功能的推出将帮助用户减少对额外系统的依赖，从而简化微服务应用架构，拓展Nacos的使用场景。欢迎大家试用并反馈使用中的问题。

### 2.2. 支持模糊订阅

支持配置和服务的模糊订阅也是Nacos 3.0的期望功能中呼声最高之一，该功能原计划在Nacos3.1版本中支持，但由于社区同学的给力贡献，模糊订阅的功能已经基本完成，因此在Nacos 3.0.0 ALPHA.2 中，模糊订阅的功能提前作为实验性功能加入。用户可以通过`fuzzyWatch`接口可以使用一定的表达式，对指定分组、服务和配置进行批量订阅；目前支持通过`*`进行前缀模糊，后缀模糊，双边模糊匹配。欢迎大家试用并反馈使用中的问题。

:::warning
模糊订阅功能仅会推送服务、配置的新增以及删除事件，并不会直接推送服务下实例列表，可在服务模糊订阅的监听器中结合subscribe接口实现服务下实例列表的变更监听。

出于稳定性考虑，Nacos对模糊订阅的规则数量以及单个规则匹配的服务数量有上限保护。具体请参考[使用手册](../docs/v3.0/manual/user/java-sdk/usage/?spm=5238cd80.2ef5001f.0.0.3f613b7cEikFoW)。
:::

### 2.3. 升级Spring Boot 及 JDK版本

在Nacos 3.0.0-ALPHA发布时， 社区发起一个关于升级Spring Boot及JDK版本的投票[ISSUE#12923](https://github.com/alibaba/nacos/issues/12923)。从目前的投票情况来看，几乎所有的参与者都赞成对Spring Boot及JDK版本进行升级。

因此Nacos 3.0.0-ALPHA.2 版本中，将依赖的Spring Boot版本升级为`3.4.1`，同时Nacos Server运行的Java版本也必须是`17`以上。

对于Nacs-Java-Client，由于客户端的特殊性，它与用户的应用有一定的关联性，且社区同样调研了一些主流的上游应用框架，如`Dubbo`等均还未强制要求SDK也运行在Java 17以上；因此Nacos Nacs-Java-Client暂时保持对`Java 8`以上的版本运行要求。

对于JDK版本，特别是Nacs-Java-Client所依赖的JDK版本是否进行升级，欢迎在[ISSUE#12923](https://github.com/alibaba/nacos/issues/12923)中继续进行讨论。

### 2.4. Nacos Server和Console独立端口

Nacos 3.X 的一个目标是希望Nacos能够更加安全，因此Nacos 3.0的一个大改动就是拆分Server 和Console的网络端口和部署架构，减小Nacos需要暴露到外部设备中的接入点，增加Nacos的安全性。

在3.0.0-ALPHA版本中，Nacos已经完成了Server和Console的API拆分，同时默认开启了Console所对应API的鉴权，而在 3.0.0-ALPHA.2版本中，Nacos进一步完成了Server和Console端口的拆分，能够从网络入口处遏制非法请求的流入。

Nacos Console的默认端口为`8080`，可以使用`nacos.console.port`参数进行修改，在3.0.0-ALPHA.2版本的部署时，可以仅向办公网暴露`8080`端口且开启鉴权（默认就会开启），将`8488`和`9848`端口暴露到`VPC网络`内部供应用客户端使用，其他端口限制在Nacos集群内部使用，以加固Nacos的访问安全性。

更多内容，请查看[部署手册概览](../docs/v3.0/manual/admin/deployment/deployment-overview/)。

### 2.5. 新AdminAPI及其他API改动

3.0.0-ALPHA.2版本中新增了一套Admin API，给予Nacos的运维人员及想要开发自定义Nacos控制台的用户使用，新的Admin API统一了之前版本Admin API中许多不规范的内容，如入参名称混乱，返回体结构不一致等问题；同时默认支持鉴权，增强了Admin API的默认安全性。

同时3.0.0-ALPHA.2默认关闭了对老版本Admin API和Console API的兼容，当您使用老版本的API发起请求时，Nacos Server将会返回错误，并在错误信息中引导您使用新的替代API。

若是当前仍然希望使用老版本Admin API，可以通过修改参数`nacos.core.api.compatibility.admin.enabled`打开对老版本的Admin API兼容，但此兼容会在未来版本中移除，因此建议尽快更新为新版本API使用。

更多内容，请查看[运维API](../docs/v3.0/manual/admin/admin-api/)。

:::warning
由于目前版本还处于ALPHA测试阶段，Admin API在后续版本中可能会新增或移除一些重复API，少量API或许会存在一定的调整，目前不推荐在生产环境中使用。
:::

Nacos 3.0.0-ALPHA.2也包含了2.5版本的所有更新，关于更多Nacos 3.0.0-ALPHA.2版本的改动，请参考[Nacos 3.0.0-ALPHA.2 变更日志](https://github.com/alibaba/nacos/releases/tag/3.0.0-alpha.2)。

## 3. Nacos-Python-SDK 2.0 正式发布

Nacos的Python SDK一直由社区自行维护和更新，在2024年时，由多位社区贡献者共同努力下，发布Nacos-Python-SDK稳定版1.0.0，正式将Nacos-Python-SDK升级为生产可用的稳定版本；

而在2025年的开始，经过社区贡献者和开源之夏同学的共同努力下， Nacos-Python-SDK的2.0版本也正式发布。

Nacos-Python-SDK的2.0版本完全适配了Nacos的gRPC OpenAPI，同时升级了Python的依赖版本及并发模块，性能和稳定性有了大幅提升。同时在能力上和Nacos-Java-Client 2.X版本对齐，主要包括：

1. 配置加解密
2. 支持tls传输加密

目前Nacos-Python-SDK已经发布了2.0.1版本，给Python的微服务项目以及近期大火的AIGC项目，提供了各类动态配置、动态Prompt等能力，欢迎大家使用。

关于更多Nacos-Python-SDK 2.0版本的改动，请参考[Nacos-Python-SDK 2.0.1 变更日志](https://github.com/nacos-group/nacos-sdk-python/releases/tag/2.0.1)。

## 4. Nacos 3.0.0 后续计划

Nacos 3.0.0-ALPHA.2 版本已经完成绝大部分3.0.0的计划功能，计划下个版本将是3.0.0-BETA。

在3.0.0-BETA版本中，计划会加入一些部署架构和易用性方面的升级。

### 4.1. Server及Console拆分部署

在Nacos 3.0.0-ALPHA.2已经完成了，控制台和引擎的端口拆分及`ADMIN API`和`Console API`，允许用户设定独立的访问端口。这一改变使得Nacos集群的运维人员能够更灵活地配置网络访问控制列表（ACL），例如，仅将控制台端口开放给办公网络。同时，配合控制台默认启用的安全认证，这将显著提高Nacos的`安全性`。

在3.0.0-BETA中，Nacos将会实现控制台和引擎节点的灵活拆分部署，使得它们能够在不同节点上运行，进一步增强`安全性`。

![](/img/blog/3_0_0-release/3.0_deploy.svg)

### 4.2. 平滑升级支持

在Nacos 3.0.0-ALPHA.2中，为了解决默认命名空间ID的使用问题，Nacos 3.0对默认命名空间的ID进行调整。根据社区讨论的[ISSUE#9846](https://github.com/alibaba/nacos/issues/9846)，默认命名空间的ID将被修改为`public`，与其名称相同。在访问API时，如果未传入命名空间ID或仍然传入`空字符串''`，Nacos 3.0将自动将其匹配为`public`以进行后续处理，从而兼容旧客户端的访问请求。

由于Nacos 3.0.0-ALPHA.2版本在数据存储的平滑迁移和适配方面尚未进行处理，因此进行直接升级会导致配置数据无法获取，并且目前无法实现平滑升级。

因此在3.0.0-BETA中，Nacos将会从数据源插件层面入手，通过适配存量数据存储的方式，兼容升级用户的存储数据内容，以支持2.X的用户进行平滑升级。

![](/img/blog/3_0_0-release/3.0_namespace.svg)

### 4.3. 更好的启动及部署脚本

在Nacos3.0版本前，Nacos的默认鉴权插件为安装部署Nacos时的可选项，虽然推荐用户打开，但并未在部署启动时强制要求。

随着社区对安全性的诉求越来越强烈，在Nacos3.0之后，Nacos的`控制台UI`,`Console API`,`Admin API`都默认开启Nacos的默认鉴权插件。这要求用户在部署Nacos时必须填入对应的配置信息；若直接使用启动命令启动Nacos，可能会导致启动失败或无法正常使用。

为了解决这个问题，Nacos3.0版本需要提供更好更便捷的启动和部署脚本，在首次部署使用时，通过交互式的方式让用户填入必要的配置内容，避免部署前修改对应的配置文件。

## About Nacos

Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及流量管理。

Nacos 帮助您更敏捷和容易地构建、交付和管理微服务平台。 Nacos 是构建以“服务”为中心的现代应用架构 (例如微服务范式、云原生范式) 的服务基础设施。

最后欢迎大家扫码加入Nacos社区群

![](https://img.alicdn.com/imgextra/i4/O1CN01qOYVoX1DsAKLKzfGh_!!6000000000271-49-tps-1080-1177.webp)
