---
title: FAQ
keywords: Nacos,FAQ
description: Nacos FAQ
---

# FAQ

- Nacos常规问题
  - [Nacos是什么](#1.1)
  - [Nacos如何支持多环境](#1.2)
  - [Nacos是否生产可用](#1.3)
  - [Nacos版本计划](#1.4)
  - [Nacos有什么依赖](#1.5)
  - [Nacos使用什么开源协议](#1.6)

- Nacos运维问题
  - [Nacos如何单机部署](#2.1)
  - [Nacos单机部署如何使用Mysql](#2.2)
  - [生产环境如何部署Nacos](#2.3)
  - [Nacos如何Docker部署](#2.4)
  - [如何在k8s中部署Nacos](#2.5)
  - [如何监控Nacos](#2.6)

- Nacos使用问题
  - [Zookeeper服务可以迁移到Nacos上吗](#3.1)
  - [Nacos支持多配置文件](#3.2)
  - [Nacos支持Dubbo](#3.3)
  - [Nacos支持Spring体系](#3.4)
  - [不使用Nacos SDK如何访问Nacos](#3.5)
  - [Nacos对多语言的支持](#3.6)
  - [Nacos0.8版本登陆失败](#3.7)
  - [服务端报错`java.lang.IllegalStateException: unable to find local peer: 127.0.0.1:8848`](#3.8)
  - [Nacos如何对配置进行加密](#3.9)
  - [Nacos报401错误](#3.10)
  - [Nacos权重不生效](#3.11)
  - [Nacos如何扩缩容](#3.12)
  - [Nacos客户端修改日志级别](#3.13)
  - [Nacos与Zipkin 整合出现`Service not found`问题](#3.14)
  - [为什么服务注册成功，控制台看不到](#3.15)

- Nacos原理问题

## Nacos常规问题
<h4 id="1.1">Nacos是什么</h4>

Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及流量管理。详情可以参考[Nacos官网介绍](https://nacos.io/zh-cn/docs/what-is-nacos.html)。

<h4 id="1.2">Nacos如何支持多环境</h4>

在日常使用中常常需要不同的环境，比如日常，预发，线上环境，如果是逻辑隔离可以使用命名空间，Nacos支持命名空间来支持多环境隔离，可以在Nacos控制台创建多个命名空间。如果需要物理隔离，就要部署多套Nacos环境。

<h4 id="1.3">Nacos是否生产可用</h4>

Nacos在2019.1发布了Pre-GA版本，支持了安全隔离、监控和服务迁移等上生产的最后一公里，以更稳定的支撑用户的生产环境。详情可以参考[Nacos 发布 v0.8.0 Pre-GA 版本，安全稳定上生产](https://www.oschina.net/news/104019/nacos-0-8-0-pre-ga)。

<h4 id="1.4">Nacos版本计划</h4>

Nacos 0.8.0 开始支持生产可用，1.0版本达到大规模生产可用，2.0版本计划与K8s、Spring Cloud、Service Mesh、Serverless进一步融合，具体的详情参考[Nacos规划](https://nacos.io/zh-cn/docs/roadmap.html)。

<h4 id="1.5">Nacos有什么依赖</h4>

在单机模式下，Nacos没有任何依赖，在集群模式下，Nacos依赖Mysql做存储，详情可以参考[Nacos部署](https://nacos.io/zh-cn/docs/deployment.html)。

<h4 id="1.6">Nacos使用什么开源协议</h4>

Nacos使用[Apache 2.0](https://github.com/alibaba/nacos/blob/master/LICENSE)。

## Nacos运维问题
<h4 id="2.1">Nacos如何单机部署</h4>

可以参考Nacos官网部署手册[quick start](https://nacos.io/zh-cn/docs/quick-start.html)。

<h4 id="2.2">Nacos单机部署如何使用mysql</h4>

Nacos单机模式默认使用内嵌的数据库作为存储引擎，如果想换成自己安装的mysql，可以按照[官网文档](https://nacos.io/zh-cn/docs/deployment.html)。

<h4 id="2.3">生产环境如何部署Nacos</h4>

生产环境使用Nacos为了达到高可用不能使用单机模式，需要搭建nacos集群，具体详情可以参考[集群部署手册](https://nacos.io/zh-cn/docs/cluster-mode-quick-start.html)。

<h4 id="2.4">Nacos如何Docker部署</h4>

除了使用压缩包部署Nacos，Nacos也提供了相应的Docker镜像，当Nacos发布新的版本的时候，Nacos会发布对应的镜像版本支持Docker部署。具体详情可以参考[Nacos Docker](https://nacos.io/zh-cn/docs/quick-start-docker.html)。

<h4 id="2.5">如何在k8s中部署Nacos</h4>

在生产环境部署Nacos集群，如果要对Nacos进行扩容操作，需要手动更改集群ip文件，启动新的Nacos服务。为了能进行自动化运维，Nacos和k8s结合利用StatefulSets提供了自动运维方案，能对Nacos进行动态扩缩容，具体详情参考[Kubernetes Nacos](https://github.com/nacos-group/nacos-k8s/blob/master/README-CN.md)。

<h4 id="2.6">如何监控Nacos</h4>

Nacos0.8版本提供了Metrics数据暴露能力，能通过Metrics数据的内容对Nacos的运行状态进行监控，详情参考[Nacos监控](https://nacos.io/zh-cn/docs/monitor-guide.html)。

## Nacos使用问题
<h4 id="3.1">Zookeeper上的服务可以迁移到Nacos上吗</h4>

可以通过Nacos-Sync把Zookeeper服务迁移到Nacos，也可以从Nacos迁移到Zookeeper，具体可以参考[Nacos Sync 使用](https://github.com/paderlol/nacos-sync-example)。

<h4 id="3.2">Nacos支持多配置文件</h4>

Nacos通过Spring Cloud Alibaba Nacos Config支持了多配置文件，可以将配置存储在多个独立的配置文件中。关联的[issue](https://github.com/alibaba/nacos/issues/320)，详情参考文档[Spring Cloud Alibaba Nacos Config](https://github.com/spring-cloud-incubator/spring-cloud-alibaba/wiki/Nacos-config)。

<h4 id="3.3">Nacos支持Dubbo</h4>

Nacos 0.6版本和Dubbo集成，支持使用Nacos作为注册中心，关联[issue](https://github.com/alibaba/nacos/issues/390),具体文档参考[Dubbo 融合 Nacos 成为注册中心](https://nacos.io/zh-cn/docs/use-nacos-with-dubbo.html)。

<h4 id="3.4">Nacos支持Spring体系</h4>

Nacos完善支持了Sping技术栈，具体可以参考[Nacos Spring](https://nacos.io/zh-cn/docs/quick-start-spring.html)、[Nacos Spring Boot](https://nacos.io/zh-cn/docs/quick-start-spring-boot.html)、[Spring Cloud](https://nacos.io/zh-cn/docs/quick-start-spring-cloud.html)。

<h4 id="3.5">不使用Nacos SDK如何访问Nacos</h4>

Nacos的网络交互都是基于Http协议实现的，提供了[Open-API](https://nacos.io/zh-cn/docs/open-api.html)可以很容易实现Nacos的访问。

<h4 id="3.6">Nacos对多语言的支持</h4>

Nacos目前只支持Java，对于其他语言的支持还正在开发中，需要大家大力支持一起共建。

<h4 id="3.7">Nacos0.8版本登陆失败</h4>

Nacos 0.8版本当使用openjdk并且没有`JAVA_HOME`的环境变量时，nacos可以启动成功，是因为`yum install`安装的openjdk 会把java命令注册一份到`/bin`目录下面,所以会引发`SignatureException`异常。这个问题已经修复，0.9版本会发版，具体详情可以参考[issue](https://github.com/alibaba/nacos/issues/711)。

<h4 id="3.8">服务端报错 java.lang.IllegalStateException: unable to find local peer: 127.0.0.1:8848</h4>

这个问题是因为Nacos获取本机IP时,没有获取到正确的外部IP.需要保证`InetAddress.getLocalHost().getHostAddress()`或者`hostname -i`的结果是与cluster.conf里配置的IP是一致的。

<h4 id="3.9">Nacos如何对配置进行加密</h4>

Nacos计划在1.X版本提供加密的能力，目前还不支持加密，只能靠sdk做好了加密再存到nacos中。

<h4 id="3.10">Nacos报401错误</h4>

Nacos服务端报错了，可以检查服务端日志，参考[issue](https://github.com/alibaba/nacos/issues/816)。

<h4 id="3.11">Nacos权重不生效</h4>

Nacos控制台上编辑权重, 目前从SpringCloud客户端和Dubbo客户端都没有打通, 所以不能生效. 对于SpringCloud客户端, 应用可以实现Ribbon的负载均衡器来进行权重过滤。

<h4 id="3.12">Nacos如何扩缩容</h4>

目前支持修改cluster.conf文件的方式进行扩缩容, 改完后无需重启, Server会自动刷新到文件新内容。

<h4 id="3.13">Nacos客户端修改日志级别</h4>

配置-D参数com.alibaba.nacos.naming.log.level设置naming客户端的日志级别，例如设置为error：
`-Dcom.alibaba.nacos.naming.log.level=error`
同样的，-D参数com.alibaba.nacos.config.log.level用来设置config客户端的日志级别。

<h4 id="3.14">Nacos与Zipkin 整合出现 Service not found 问题</h4>

配置`spring-cloud-seluth`参数：`spring.zipkin.discovery-client-enabled=false`。

如果仍然存在`Service not found`错误，则建议先使用open-api将Zipkin-server注册为永久实例服务：

`curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?port=9411&healthy=true&ip=127.0.0.1&weight=1.0&serviceName=zipkin-server&ephemeral=false&namespaceId=public'`

然后，前往nacos控制台，找到服务名为`zipkin-server`的服务，找到集群配置，设置健康检查模式为`TCP`，端口号为`9411`(即zipkin-server的端口)。

<h4 id="3.15">为什么服务注册成功，控制台看不到</h4>

此问题多出现在集群模式下，在使用nacos集群模式时，确保所有的机器时间是一致的，否则会出现数据无法同步的问题。

## Nacos原理问题
