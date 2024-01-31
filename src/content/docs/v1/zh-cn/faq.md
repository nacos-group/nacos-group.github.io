---
title: FAQ
keywords: [Nacos,FAQ]
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
  - [Nacos在Docker环境下集群部署，无法正常启动，日志一直打印 Nacos is starting...](#2.7)

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
  - [如何依赖最新的Nacos客户端？](#3.15)
  - [客户端CPU高，或者内存耗尽的问题](#3.16)
  - [日志打印频繁的问题](#3.17)
  - [集群管理页面，raft term显示不一致问题](#3.18)
  - [找不到符号`com.alibaba.nacos.consistency.entity`](#3.19)
  - [Beta发布如何使用](#3.20)
  
  

- Nacos原理问题

## Nacos常规问题
<h4 id="1.1">Nacos是什么</h4>

Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及流量管理。详情可以参考[Nacos官网介绍](https://nacos.io/docs/v1/what-is-nacos/)。

<h4 id="1.2">Nacos如何支持多环境</h4>

在日常使用中常常需要不同的环境，比如日常，预发，线上环境，如果是逻辑隔离可以使用命名空间，Nacos支持命名空间来支持多环境隔离，可以在Nacos控制台创建多个命名空间。如果需要物理隔离，就要部署多套Nacos环境。

<h4 id="1.3">Nacos是否生产可用</h4>

Nacos在2019.1发布了Pre-GA版本，支持了安全隔离、监控和服务迁移等上生产的最后一公里，以更稳定的支撑用户的生产环境。详情可以参考[Nacos 发布 v0.8.0 Pre-GA 版本，安全稳定上生产](https://www.oschina.net/news/104019/nacos-0-8-0-pre-ga)。

<h4 id="1.4">Nacos版本计划</h4>

Nacos 0.8.0 开始支持生产可用，1.0版本达到大规模生产可用，2.0版本计划与K8s、Spring Cloud、Service Mesh、Serverless进一步融合。
<h4 id="1.5">Nacos有什么依赖</h4>

在单机模式下，Nacos没有任何依赖，在集群模式下，Nacos依赖Mysql做存储，详情可以参考[Nacos部署](https://nacos.io/docs/v1/deployment/)。

<h4 id="1.6">Nacos使用什么开源协议</h4>

Nacos使用[Apache 2.0](https://github.com/alibaba/nacos/blob/master/LICENSE)。

## Nacos运维问题
<h4 id="2.1">Nacos如何单机部署</h4>

可以参考Nacos官网部署手册[quick start](https://nacos.io/docs/v1/quickstart/quick-start/)。

<h4 id="2.2">Nacos单机部署如何使用mysql</h4>

Nacos单机模式默认使用内嵌的数据库作为存储引擎，如果想换成自己安装的mysql，可以按照[官网文档](https://nacos.io/docs/v1/deployment/)。

<h4 id="2.3">生产环境如何部署Nacos</h4>

生产环境使用Nacos为了达到高可用不能使用单机模式，需要搭建nacos集群，具体详情可以参考[集群部署手册](https://nacos.io/docs/v1/cluster-mode-quick-start/)。

<h4 id="2.4">Nacos如何Docker部署</h4>

除了使用压缩包部署Nacos，Nacos也提供了相应的Docker镜像，当Nacos发布新的版本的时候，Nacos会发布对应的镜像版本支持Docker部署。具体详情可以参考[Nacos Docker](https://nacos.io/docs/v1/quick-start-docker/)。

<h4 id="2.5">如何在k8s中部署Nacos</h4>

在生产环境部署Nacos集群，如果要对Nacos进行扩容操作，需要手动更改集群ip文件，启动新的Nacos服务。为了能进行自动化运维，Nacos和k8s结合利用StatefulSets提供了自动运维方案，能对Nacos进行动态扩缩容，具体详情参考[Kubernetes Nacos](https://github.com/nacos-group/nacos-k8s/blob/master/README-CN.md)。

<h4 id="2.6">如何监控Nacos</h4>

Nacos0.8版本提供了Metrics数据暴露能力，能通过Metrics数据的内容对Nacos的运行状态进行监控，详情参考[Nacos监控](https://nacos.io/docs/v1/monitor-guide/)。

<h4 id="2.7">Nacos在Docker环境下集群部署，无法正常启动，日志一直打印 Nacos is starting...</h4>

原因可能是由于Docker环境下，内存不足导致另外的服务无法正常启动，最后导致服务报错，一直重启，可以通过增大Docker限制内存尝试解决。

## Nacos使用问题
<h4 id="3.1">Zookeeper上的服务可以迁移到Nacos上吗</h4>

可以通过Nacos-Sync把Zookeeper服务迁移到Nacos，也可以从Nacos迁移到Zookeeper，具体可以参考[Nacos Sync 使用](https://github.com/paderlol/nacos-sync-example)。

<h4 id="3.2">Nacos支持多配置文件</h4>

Nacos通过Spring Cloud Alibaba Nacos Config支持了多配置文件，可以将配置存储在多个独立的配置文件中。关联的[issue](https://github.com/alibaba/nacos/issues/320)，详情参考文档[Spring Cloud Alibaba Nacos Config](https://github.com/spring-cloud-incubator/spring-cloud-alibaba/wiki/Nacos-config)。

<h4 id="3.3">Nacos支持Dubbo</h4>

Nacos 0.6版本和Dubbo集成，支持使用Nacos作为注册中心，关联[issue](https://github.com/alibaba/nacos/issues/390),具体文档参考[Dubbo 融合 Nacos 成为注册中心](https://nacos.io/docs/latest/ecology/use-nacos-with-dubbo/)。

<h4 id="3.4">Nacos支持Spring体系</h4>

Nacos完善支持了Sping技术栈，具体可以参考[Nacos Spring](https://nacos.io/docs/v1/quick-start-spring/)、[Nacos Spring Boot](https://nacos.io/docs/v1/quick-start-spring-boot/)、[Spring Cloud](https://nacos.io/docs/v1/quick-start-spring-cloud/)。

<h4 id="3.5">不使用Nacos SDK如何访问Nacos</h4>

Nacos的网络交互都是基于Http协议实现的，提供了[Open-API](https://nacos.io/docs/latest/open-api/)可以很容易实现Nacos的访问。

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


<h4 id="3.15">如何依赖最新的Nacos客户端？</h4>
很多用户都是通过Spring Cloud Alibaba或者Dubbo依赖的Nacos客户端，那么Spring Cloud Alibaba和Dubbo中依赖的Nacos客户端版本，往往会落后于Nacos最新发布的版本。在一些情况下，用户需要强制将Nacos客户端升级到最新，此时却往往不知道该升级哪个依赖，这里将Spring Cloud Alibaba和Dubbo的依赖升级说明如下：


##### Spring Cloud Alibaba

用户通常是配置以下Maven依赖来使用的Nacos：

```xml
<!--Nacos Discovery-->
<dependency>
     <groupId>com.alibaba.cloud</groupId>
     <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
     <version>[latest version]</version>
 </dependency>

<!--Nacos Config-->
<dependency>
     <groupId>com.alibaba.cloud</groupId>
     <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
     <version>[latest version]</version>
 </dependency>
```

这两个jar包实际上又依赖了以下的jar包：
```xml
<dependency>
  <groupId>com.alibaba.nacos</groupId>
  <artifactId>nacos-client</artifactId>
  <version>[a particular version]</version>
</dependency>
```

如果nacos-client升级了，对应的spring-cloud客户端版本不一定也同步升级，这个时候可以采用如下的方式强制升级nacos-client（以nacos-discovery为例）：

```xml
<dependency>
     <groupId>com.alibaba.cloud</groupId>
     <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
     <version>[latest version]</version>
     <excludes>
          <exclude>
                 <groupId>com.alibaba.nacos</groupId>
                 <artifactId>nacos-client</artifactId>
          </exclude>
     </excludes>
 </dependency>

<dependency>
  <groupId>com.alibaba.nacos</groupId>
  <artifactId>nacos-client</artifactId>
  <version>[latest version]</version>
</dependency>
```

##### Dubbo
Dubbo也是类似的道理，用户通常引入的是以下的依赖：
```xml
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>dubbo-registry-nacos</artifactId>
        <version>[latest version]</version>
    </dependency>   
    
    <!-- Dubbo dependency -->
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>dubbo</artifactId>
        <version>[latest version]</version>
    </dependency>
```

需要升级Nacos客户端时，只需要如下修改依赖：
```xml
 <dependency>
  <groupId>com.alibaba.nacos</groupId>
  <artifactId>nacos-client</artifactId>
  <version>[latest version]</version>
</dependency>
```


<h4 id="3.16">客户端CPU高，或者内存耗尽的问题</h4>
问题的现象是依赖Nacos客户端的应用，在运行一段时间后出现CPU占用率高，内存占用高甚至内存溢出的现象，可以参考issue：[https://github.com/alibaba/nacos/issues/1605](https://github.com/alibaba/nacos/issues/1605)。这种情况首先要做的是分析CPU高或者内存占用高的原因，常用的命令有top、jstack、jmap、jhat等。其中一种情况是Nacos客户端实例在Spring Cloud Alibaba服务框架中被反复构造了多次，可以参考issue：[https://github.com/alibaba/spring-cloud-alibaba/issues/859](https://github.com/alibaba/spring-cloud-alibaba/issues/859)。这个问题已经得到了修复，预期会在下个Spring Cloud Alibaba版本中发布。


<h4 id="3.17">日志打印频繁的问题</h4>
在老的Nacos版本中，往往会有大量的无效日志打印，这些日志的打印会迅速占用完用户的磁盘空间，同时也让有效日志难以查找。目前社区反馈的日志频繁打印主要有以下几种情况：

1. access日志大量打印，相关issue有：[https://github.com/alibaba/nacos/issues/1510](https://github.com/alibaba/nacos/issues/1510)。主要表现是{nacos.home}/logs/access_log.2019-xx-xx.log类似格式文件名的日志大量打印，而且还不能自动清理和滚动。这个日志是Spring Boot提供的tomcat访问日志打印，Spring Boot在关于该日志的选项中，没有最大保留天数或者日志大小控制的选项。因此这个日志的清理必须由应用新建crontab任务来完成，或者通过以下命令关闭日志的输出（在生产环境我们还是建议开启该日志，以便能够有第一现场的访问记录）：

```
server.tomcat.accesslog.enabled=false
```

2. 服务端业务日志大量打印且无法动态调整日志级别。这个问题在1.1.3已经得到优化，可以通过API的方式来进行日志级别的调整，调整日志级别的方式如下：

```
# 调整naming模块的naming-raft.log的级别为error:
curl -X PUT '$nacos_server:8848/nacos/v1/ns/operator/log?logName=naming-raft&logLevel=error'
# 调整config模块的config-dump.log的级别为warn:
curl -X PUT '$nacos_server:8848/nacos/v1/cs/ops/log?logName=config-dump&logLevel=warn'
```

3. 客户端日志大量打印，主要有心跳日志、轮询日志等。这个问题已经在1.1.3解决，请升级到1.1.3版本。


<h4 id="3.18">集群管理页面，raft term显示不一致问题</h4>
在Nacos 1.0.1版本中，Nacos控制台支持了显示当前的集群各个机器的状态信息。这个功能受到比较多用户的关注，其中一个被反馈的问题是列表中每个节点的集群任期不一样。如下图所示（图片信息来自issue：https://github.com/alibaba/nacos/issues/1786）：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1567737322959-eed80457-e74c-4adb-bc29-6655860f8ca9.png#align=left&display=inline&height=279&name=image.png&originHeight=558&originWidth=1685&size=45557&status=done&width=842.5)

对于这个任期不一致的问题，原因主要是因为获取这个信息的逻辑有一些问题，没有从对应的节点上获取集群任期。这个问题会在下一个Nacos版本中修复。目前一个手动检查集群任期的办法是在每个节点上执行以下命令：

```
curl '127.0.0.1:8848/nacos/v1/ns/raft/state'
```

然后在返回信息中查找本节点的集群任期。因为每个节点返回的集群任期中，只有当前节点的信息是准确的，返回的其他节点的信息都是不准确的。

<h4 id="3.19">找不到符号`com.alibaba.nacos.consistency.entity`</h4>

这个包目录是由`protobuf`在编译时自动生成，您可以通过`mvn compile`来自动生成他们。如果您使用的是IDEA，也可以使用IDEA的protobuf插件。

<h4 id="3.20">Beta发布如何使用</h4>

service-a服务在192.168.31.114,192.168.31.115,192.168.31.116启动了三个实例。
我们想把其中192.168.31.114实例的配置项"user.password"的值改为xxx（即：Beta发布），192.168.31.115,192.168.31.116的配置不做更改。

![beta](/img/beta.png)

## Nacos原理问题
