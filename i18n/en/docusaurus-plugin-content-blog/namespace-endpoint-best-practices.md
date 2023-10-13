---
title: Namespace,endpoint 最佳实践
keywords: [namespace,endpoint,最佳实践]
description: 随着使用 Nacos 的企业越来越多，遇到的最频繁的两个问题就是：如何在我的生产环境正确的来使用 namespace 以及 endpoint。
date: 2019-12-06
---

# Namespace, endpoint 最佳实践

随着使用 Nacos 的企业越来越多，遇到的最频繁的两个问题就是：如何在我的生产环境正确的来使用 namespace 以及 endpoint。这篇文章主要就是针对这两个问题来聊聊使用 nacos 过程中关于这两个参数配置的最佳实践方式。

## namespce

关于 namespace ，以下主要从 **namespace 的设计背景** 和 **namespace 的最佳实践** 两个方面来讨论。

### namespace 的设计背景

namespace 的设计是 nacos 基于此做多环境以及多租户数据(**配置和服务**)隔离的。即：

* 从一个租户(用户)的角度来看，如果有多套不同的环境，那么这个时候可以根据指定的环境来创建不同的 namespce，以此来实现多环境的隔离。例如，你可能有日常，预发和生产三个不同的环境，那么使用一套 nacos 集群可以分别建以下三个不同的 namespace。如下图所示：

![](http://edas.oss-cn-hangzhou.aliyuncs.com/deshao/pictures/nacos_ingle_tenant_namespace.jpg)

* 从多个租户(用户)的角度来看，每个租户(用户)可能会有自己的 namespace,每个租户(用户)的配置数据以及注册的服务数据都会归属到自己的 namespace 下，以此来实现多租户间的数据隔离。例如超级管理员分配了三个租户，分别为张三、李四和王五。分配好了之后，各租户用自己的账户名和密码登录后，创建自己的命名空间。如下图所示：

![](http://edas.oss-cn-hangzhou.aliyuncs.com/deshao/pictures/nacos_multi_tenant_namespace.jpg)

  **注意:** 该功能还在规划中。
  
### namespace 的最佳实践

关于 namespace 的最佳实践，这部分主要包含有两个 Action：

* 如何来获取 namespace 的值
* namespace 参数初始化方式

### 如何来获取 namespace 的值 

无论您是基于 Spring Cloud 或者 Dubbo 来使用 nacos，都会涉及到 namespace 的参数输入，那么这个时候 namespace 的值从哪里可以获取呢？

1. 如果您在使用过程中没有感知到这个参数的输入，那么 nacos 统一会使用一个默认的 namespace 作为输入，nacos naming 会使用 **public** 作为默认的参数来初始化，nacos config 会使用一个**空字符串**作为默认的参数来初始化。

2. 如果您需要自定义自己的 namespace，那么这个值该怎么来产生？

   可以在 nacos 的控制台左边功能侧看到有一个 **命名空间** 的功能，点击就可以看到 **新建命名空间** 的按钮，那么这个时候就可以创建自己的命名空间了。创建成功之后，会生成一个**命名空间ID**，主要是用来避免**命名空间名称**有可能会出现重名的情况。因此当您在应用中需要配置指定的 namespace 时，**填入的是命名空间ID**。重要的事情说三遍：

	1. 当您在应用中需要配置指定的 namespace 时，**填入的是命名空间 ID**
	2. 当您在应用中需要配置指定的 namespace 时，**填入的是命名空间 ID**
	3. 当您在应用中需要配置指定的 namespace 时，**填入的是命名空间 ID**


说明: namesace 为 **public** 是 nacos 的一个保留控件，如果您需要创建自己的 namespace，最好不要和 **public** 重名，以一个实际业务场景有具体语义的名字来命名，以免带来字面上不容易区分自己是哪一个 namespace。

### namespace 参数初始化方式

nacos client 对 namespace 的初始化流程如下图所示:

![](http://edas.oss-cn-hangzhou.aliyuncs.com/deshao/nacos/nacos_namespace.jpg)

nacos client 对 namespace 的初始化，主要包含两部分：

* 用户态通过 nacos client 构造实例时通过 properties 参数传入的 namespace。

* 在云环境下(**阿里云下的 EDAS**)的 namespace 参数解析。

  可通过 **-Dnacos.use.cloud.namespace.parsing=true/false** 来控制是否需要在云环境自动解析 namespace 参数，默认为 **true**，是会自动解析，其目的就是方便用户上云时可以以零成本的方式平滑上云。如果用户在云上需要用自建的 nacos 下的 namespace，那这个时候只需将 **-Dnacos.use.cloud.namespace.parsing=false** 即可。

  
## endpoint

关于 endpoint ，也主要从 **endpoint 的设计背景** 和 **endpoint 的参数初始化** 两个方面来讨论。

### endpoint 的设计背景

当 nacos server 集群需要扩缩容时，客户端需要有一种能力能够及时感知到集群发生变化。及时感知到集群的变化是通过 endpoint 来实现的。也即客户端会定时的向 endpoint 发送请求来更新客户端内存中的集群列表。

### endpoint 的参数初始化

Nacos Client 提供一种可以对传入的 endpoint 参数规则解析的能力。即当通过构造函数的 **properties** 来初始化 endpoint 时，指定的 endpoint 值可以是一个具体的值，也可以是一个占位符的形式，如下所示: 

> **\${endpoint.options:defaultValue}**。

说明：

1. **endpoint.options** 是一个具体的变量。支持从系统属性，系统环境变量中读取。
2. **defaultValue** 是给出的一个默认值。当从具体的变量中没有被正确初始化时，会使用给出的默认值来初始化。

整个 endpoint 的解析规则比较复杂，整体的一个解析流程图如下所示:

![](http://edas.oss-cn-hangzhou.aliyuncs.com/deshao/nacos/nacos_endpoint.jpg)	

**注意：** 蓝色特别区分的是支持云环境下(阿里云上的 EDAS)自动从系统环境变量中来读取 endpoint 值，以此来达到用户本地开发或者将应用往云上迁移的时候以零成本的改造方式实现平滑上云。

说明：

* 开启 endpoint 参数规则解析

  1. 如果在初始化 Nacos Client 的时候，没有通过 properties 来指定 endpoint，这个时候会从系统环境变量中变量名为 **ALIBABA\_ALIWARE\_ENDPOINT\_URL** 指定的值来初始化，如果系统环境变量也没有设置，那么这个时候将会返回一个空字符串。

  2. 如果设置了 endpoint，
  
	  1. 设置的 endpoint 是一个指定具体的值。

	     这时会先从系统环境变量中变量名为 **ALIBABA\_ALIWARE\_ENDPOINT\_URL** 指定的值来初始化，如果系统环境变量没有设置，那么这个时候用用户态传入的具体值来初始化 endpoint。
	
	  2. 以占位符的形式输入。
	  
	     这时会解析出具体占位符的值，然后:
		
	 	 1. 依次从系统属性和环境变量中来取值。
	 	 
	 	 	 例如，您输入的是 **${nacos.endpoint:defaultValue}**，那么解析出来的占位符是 **nacos.endpoint**。解析出来后，会先读取系统属性中(**即 System.getProperty("nacos.endpoint")**)是否设置了 **nacos.endpoint** 变量值，如果没有，则会从系统环境变量中变量名为 **nacos.endpoint** 指定的值来初始化。
	 	 
	 	 2. 如果通过解析出来的占位符还没有正确初始化 endpoint，则会从系统环境变量中变量名为 **ALIBABA\_ALIWARE\_ENDPOINT\_URL** 指定的值来初始化。
	 	 
	 	 3. 如果经过以上两步还没有被初始化，这时如果您设置了默认值，这个时候就会使用默认值来初始化 endpoint，否则的话以解析出来的占位符返回。	
		
* 关闭 endpoint 参数规则解析

  当关闭了 endpoint 参数规则解析的时候，这个时候就以用户态在构造 Nacos Client 时通过 properties 参数输入的 endpoint 值为主。
  
默认情况下， Nacos Client 是开启 endpoint 参数规则解析的能力。如果你想关闭该能力，有两种方式可以帮您来实现。

1. 可在 Nacos Client 初始化的时候在传入的 properties 实例中指定 key 为 **isUseEndpointParsingRule**，值为 **false** 即可关闭。
2. 如果您的应用是 Java 程序的应用，也可以通过 **-Dnacos.use.endpoint.parsing.rule=false** 来关闭。 

**注意**：其中第一种方式的优先级高于第二种方式。
