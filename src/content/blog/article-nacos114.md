---
title: Nacos 1.1.4发布，业界率先支持Istio MCP协议
keywords: [Nacos 1.1.4, nacos]
description: Nacos是阿里巴巴开源的服务发现与配置管理项目，本次发布的1.1.4版本，主要带来的是与Istio的对接功能，使用的是Istio最新的MCP协议。
date: "2019-10-24"
category: release
---

# Nacos 1.1.4发布，业界率先支持Istio MCP协议

Nacos是阿里巴巴开源的服务发现与配置管理项目，本次发布的1.1.4版本，主要带来的是与Istio的对接功能，使用的是Istio最新的MCP协议。本文将介绍包括这个功能在内的新版本发布的功能。

<a name="GdnN0"></a>
## 升级指南
<a name="SXacG"></a>
#### 服务端
0.8.0及以上版本：

1. 解压安装包后替换{nacos.home}/target/nacos-server.jar
1. 逐台重启Nacos Server即可

0.8.0以下版本，先升级到1.0.0版本。
<a name="CNPhB"></a>
#### 客户端
替换pom依赖即可。

<a name="07ZzZ"></a>
## 支持Istio MCP协议
这是本次版本最大的更新，主要是实现了Nacos服务数据往Istio下发的功能，也是目前业界所有注册中心里面第一个由官方提供的MCP协议对接版本。Pilot最新的设计中，是使用MCP协议来与所有后端的数据源进行交互的。这样做的好处是可以解耦所有扩展组件的代码，Pilot保持轻量的逻辑，在代码质量、组件稳定性及扩展性方面都大幅提升。我们可以看一下Pilot官方提供的Pilot设计图（地址：[https://docs.google.com/document/d/1S5ygkxR1alNI8cWGG4O4iV8zp8dA6Oc23zQCvFxr83U/edit#heading=h.k34grc1as8vr](https://docs.google.com/document/d/1S5ygkxR1alNI8cWGG4O4iV8zp8dA6Oc23zQCvFxr83U/edit#heading=h.k34grc1as8vr)）：<br />![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1572940023007-e19f92da-a5a1-41f0-b37e-db8a678ad57f.png#align=left&display=inline&height=455&name=image.png&originHeight=659&originWidth=1080&search=&size=360963&status=done&width=746)<br />图1 Pilot的最新设计概念图

虽然在设计图中，Pilot后端的MCP Server已经有了Consul、Eureka等，但是这些项目目前都没有官方支持的MCP Server。Nacos是目前首个官方支持Istio MCP协议的项目。

关于MCP协议的设计，可以参考Istio的[文档](https://github.com/istio/api/tree/master/mcp)。Nacos实现的MCP Server，目前使用的是单个服务编号，全量服务推送的模式，因为目前Pilot还不支持增量的服务数据推送（Nacos 1.1.4发布之后，Pilot已经支持了endpoint级别的增量推送，Nacos也会在下个版本支持）。实现的逻辑就是启动一个gRPC Server来进行MCP数据的传输，代码可以参考：[https://github.com/alibaba/nacos/tree/develop/istio](https://github.com/alibaba/nacos/tree/develop/istio)。

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1572940023014-089f4517-840c-4f6e-ae29-2c308926d069.png#align=left&display=inline&height=365&name=image.png&originHeight=730&originWidth=1372&search=&size=300144&status=done&width=686)<br />图2 Nacos MCP Server架构

使用Nacos MCP Server的方式如下：

1. 下载最新的Nacos 1.1.4安装包，解压；
1. 配置application.properties，然后重启Nacos；

```html
nacos.istio.mcp.server.enabled=true
```

注意：如果Nacos是集群部署，则只需要配置一台Server启动MCP Server即可，因为每台Nacos Server的数        据都是全量的。同时Nacos MCP Server使用的端口是18848，请注意端口是否冲突；

3. 配置Pilot使用Nacos MCP Server：

```html
configSources
-- address: x.x.x.x:18848
```

4. 重启Pilot；

<a name="srliR"></a>
## 自定义实例ID
在之前的版本中，Instance类的instanceId字段，是用来作为唯一标识这个instance的属性，它的值默认是不能由客户端来指定的。在1.1.4版本中，我们支持了允许客户端自定义ID以及一个新增加的instanceId生成算法：一个服务内唯一的整数，这个整数可以用来作为实例在服务内的唯一索引。这个功能由vettal-wu贡献，非常感谢。

这个整形instanceId的使用方式为在注册时配置instance的metadata，指定使用该id生成算法，样例代码如下：

```java
Instance instance = new Instance();
instance.setIp("1.1.1.1");
instance.setPort(80);
// 必须设置ephemeral=false，来保证服务端使用的是严格的一致性协议，否则可能会导致生成的instance id冲突：
instance.setEhpemeral(false);
instance.setMetadata(new HashMap<String, String>());
instance.getMetadata().put(PreservedMetadataKeys.INSTANCE_ID_GENERATOR, Constants.SNOWFLAKE_INSTANCE_ID_GENERATOR);
```

Nacos在这个版本也有一些关于代码质量上的优化更新，具体可以参考1.1.4版本issue列表：[https://github.com/alibaba/nacos/issues?q=is%3Aissue+milestone%3A1.1.4](https://github.com/alibaba/nacos/issues?q=is%3Aissue+milestone%3A1.1.4)。

<a name="B7djZ"></a>
## 如何共建

为了实现这一目标，你需要积极参与Nacos社区。如果您在文档中发现拼写错误，在代码中发现错误，或想要新功能或想要提供建议，您可以[在GitHub上创建一个issues](https://github.com/alibaba/Nacos/issues/new)。

如果您想开始着手，可以选择github仓库中有以下标签的issues。

- [good first issue](https://github.com/alibaba/nacos/labels/good%20first%20issue)：对于新手来说是非常好的入门issues。
- [contribution welcome](https://github.com/alibaba/nacos/labels/contribution%20%E6%AC%A2%E8%BF%8E)：非常需要解决的问题和非常重要的模块，但目前缺少贡献者，欢迎贡献者来贡献。

<a name="7ddae8a4"></a>
## 蓬勃发展的 Nacos 社区

> DISS is cheap, show me your hand
> 比吐槽更重要的是搭把手，参与社区一起发展Nacos


- 作为用户关注和加入 Nacos 社区

Nacos 社区正在蓬勃发展，截止到发文为止，Nacos 短短几个月已经有 9 个微信群，其中 7 个已满员，1个QQ群，1个钉钉群，关注 Nacos 的社区人数已经近5000人，在 Nacos 群里跟 “道（基）友” 切磋技术，交流经验，招聘交友，抢抢红包...不亦乐乎。

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1572940023025-5e1cf910-5e80-4353-8b47-d0565a65bbda.png#align=left&display=inline&height=998&name=image.png&originHeight=998&originWidth=1786&search=&size=298649&status=done&width=1786)

- 作为代码贡献者加入 Nacos 社区

从Nacos用户发展而成贡献者顺理成章，而Nacos开发团队也确实在日趋壮大，从开始的只有4个代码contributor发展到目前的40多个，1.1.4版本中，参与Nacos仓库贡献的开发者有：stackisok,loadchange, ly641921791, EZLippi, rushsky518, universefeeler, nkorange, vettal-wu, beldon等。

![](https://cdn.nlark.com/lark/0/2018/png/15914/1542704700864-a9d54856-9bf6-4176-b449-c13fa02c5800.png#align=left&display=inline&height=387&linkTarget=_blank&originHeight=888&originWidth=1716&width=748#align=left&display=inline&height=386&originHeight=888&originWidth=1716&search=&status=done&width=746)

<a name="2461e1c0"></a>
## 新人时刻 - "什么是Nacos？"

> 还不知道什么是Nacos? 没关系，在github上star一下跟程序猿兄弟打个招呼吧!!


[Nacos](https://github.com/alibaba/nacos) 是阿里巴巴于2018年7月份新开源的项目，Nacos的主要愿景是期望通过提供易用的 `动态服务发现`、`服务配置管理`、`服务共享与管理` 的基础设施，帮助用户在云原生时代更好的构建、交付、管理自己的微服务平台。

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1572940023011-845b558c-5af1-4e75-8f6e-4aee37cdbb44.png#align=left&display=inline&height=332&name=image.png&originHeight=664&originWidth=1614&search=&size=282270&status=done&width=807)

github项目地址在 [这里](https://github.com/alibaba/nacos)

<a name="f26dbb6d"></a>
## 更多与 Nacos 相关的开源项目信息

- [Nacos](https://github.com/alibaba/nacos)
- [Dubbo Registry Nacos](https://github.com/dubbo/dubbo-registry-nacos)
- [Nacos DNS-F](https://github.com/nacos-group/nacos-coredns-plugin)
- [Nacos Docker](https://github.com/nacos-group/nacos-docker)
- [Nacos Spring Project](https://github.com/nacos-group/nacos-spring-project)
- [Nacos Spring Boot](https://github.com/nacos-group/nacos-spring-boot-project)
- [Spring Cloud Alibaba](https://github.com/spring-cloud-incubator/spring-cloud-alibaba)
- [Dubbo](http://dubbo.io/)
- [Sentinel](https://github.com/alibaba/Sentinel)
- [Spring Cloud](https://projects.spring.io/spring-cloud/)
- [Nepxion Discovery](https://github.com/Nepxion/Discovery)
- [Spring Cloud Gateway Nacos](https://github.com/SpringCloud/spring-cloud-gateway-nacos)

<a name="aswNK"></a>
## 下期预告
Nacos的下个版本是1.2.0版本，将会支持社区广泛关注的权限控制功能，敬请期待。
