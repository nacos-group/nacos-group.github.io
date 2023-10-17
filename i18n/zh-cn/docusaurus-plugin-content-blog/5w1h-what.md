---
title: Nacos 帮我们解决什么问题？—— 配置管理篇
keywords: [nacos]
description: Nacos 配置管理帮我们解决什么问题？
date: 2018-10-17
---

# Nacos 帮我们解决什么问题？—— 配置管理篇
> Authors: 何煦

## 概述

[Nacos](https://github.com/alibaba/nacos) 是阿里巴巴今年7月份开源的项目，如其名， Naming and Configuration Service ，专注于服务发现和配置管理领域。本系列文章，将从 5W1H（What、Where、When、Who、Why、How）全面剖析 Nacos，希望对开发者们在服务发现和配置管理开源方案选型的时候，有所帮助。

本文作为 Nacos 系列文章的开篇，从 “What” 开始。我们开始关注一个开源项目的时候，通常最先冒出的 2 个问题是：

* 它是什么？
* 它帮我们解决什么问题？

Nacos 是什么？

Nacos 是一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。

Nacos 能帮我们解决什么问题？

本文将先围绕其“配置管理”功能来解答。配置，作为代码如影随形的小伙伴，伴随着应用的整个生命周期，我们当然对它也非常的熟悉，想想配置一般都通过哪几种形式存在？

* 硬编码
* 配置文件
* DB 配置表

## 硬编码

配置项作为类字段的形式存在，如：

```java
public class AppConfig {

    private int connectTimeoutInMills = 5000;

    public int getConnectTimeoutInMills() {
        return connectTimeoutInMills;
    }

    public void setConnectTimeoutInMills(int connectTimeoutInMills) {
        this.connectTimeoutInMills = connectTimeoutInMills;
    }
}
```

这种形式主要有三个问题：

如果配置是需要动态修改的话，需要当前应用去暴露管理该配置项的接口，至于是 Controller 的 API 接口，还是 JMX ，都是可以做到。

另外，配置变更都是发生在内存中，并没有持久化。因此，在修改配置之后重启应用，配置又会变回代码中的默认值了，这是一个坑啊，笔者就曾经掉进去过，爬了好一会才上岸。

最后一个问题，就是当你有多台机器的时候，要修改一个配置，每一台都得去操作一遍，运维成本可想而知，极其蛋疼。

## 配置文件

Spring 中常见的 properties、yml 文件，或其他自定义的，如，“conf”后缀等：

```
# application.properties
connectTimeoutInMills=5000
```

相比“硬编码”的形式，它解决了第二个问题，持久化了配置。但是，另外两个问题并没有解决，运维成本依旧还是很高的。

配置动态变更，可以是通过类似“硬编码”暴露管理接口的方式，这时，代码中会多一步持久化新配置到文件的逻辑。或者，简单粗暴点，直接登录机器上去修改配置文件，再重启应用，让配置生效。当然，你也可以在代码中增加一个定时任务，如每隔 10s 读取配置文件内容，让最新的配置能够及时在应用中生效，这样也就免去了重启应用这个“较重”的运维操作。

通过增加“持久化逻辑”、“定时任务”让“配置文件”的形式比“硬编码”前进了一小步。

## DB 配置表

这里的 DB 可以是 MySQL 等的关系型数据库，也可以是 Redis 等的非关系型数据库。数据表如：

```sql
CREATE TABLE `config` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(50) NOT NULL DEFAULT '' COMMENT '配置项',
  `value` varchar(50) NOT NULL DEFAULT '' COMMENT '配置内容',
  `updated_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='配置信息';

INSERT INTO `config` (`key`, `value`, `updated_time`, `created_time`) VALUES ('connectTimeoutInMills', '5000', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
```

它相对于前两者，更进一步，将配置从应用中抽离出来，集中管理，能较大的降低运维成本。

那么，它能怎么解决动态更新配置的问题呢？据我所知，有两种方式。

其一，如同之前一样，通过暴露管理接口去解决，当然，也一样得增加持久化的逻辑，只不过，之前是写文件，现在是将最新配置写入数据库。不过，程序中还需要有定时从数据库读取最新配置的任务，这样，才能做到只需调用其中一台机器的管理配置接口，就能把最新的配置下发到整个应用集群所有的机器上，真正达到降低运维成本的目的。

其二，直接修改数据库，程序中通过定时任务从数据库读取最新的配置内容。

“DB 配置表”的形式解决了主要的问题，但是它不够优雅，带来了一些“累赘”。

## Nacos 配置管理

Nacos 真正将配置从应用中剥离出来，统一管理，优雅的解决了配置的动态变更、持久化、运维成本等问题。

应用自身既不需要去添加管理配置接口，也不需要自己去实现配置的持久化，更不需要引入“定时任务”以便降低运维成本。Nacos 提供的配置管理功能，将配置相关的所有逻辑都收拢，并且提供简单易用的 SDK，让应用的配置可以非常方便被 Nacos 管理起来。

如果是在 Spring 中使用 Nacos，只需三个步骤即可：

1. 添加依赖

```plain
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-spring-context</artifactId>
    <version>${latest.version}</version>
</dependency>
```

2. 添加 `@EnableNacosConfig` 注解启用 Nacos Spring 的配置管理服务。以下示例中，我们使用 `@NacosPropertySource` 加载了 `dataId` 为 `example` 的配置源，并开启自动更新：

```plain
@Configuration
@EnableNacosConfig(globalProperties = @NacosProperties(serverAddr = "127.0.0.1:8848"))
@NacosPropertySource(dataId = "example", autoRefreshed = true)
public class NacosConfiguration {

}
```

3. 通过 Spring 的 `@Value` 注解设置属性值。

注意：需要同时有 `Setter`方法才能在配置变更的时候自动更新。

```plain
public class AppConfig {

    @Value("${connectTimeoutInMills:5000}")
    private int connectTimeoutInMills;

    public int getConnectTimeoutInMills() {
        return connectTimeoutInMills;
    }

    public void setConnectTimeoutInMills(int connectTimeoutInMills) {
        this.connectTimeoutInMills = connectTimeoutInMills;
    }
}
```

以上的三个步骤，对应用本身几乎没有任何的侵入，1 个依赖 2 注解，寥寥数行，就把配置通过 Nacos 管理起来了。

关于配置的动态更新，对 Nacos Spring 的用户来说，在自身应用中就只是设置 “autoRefreshed” 的一个布尔值。然后在需要修改配置的时候，调用 Nacos 修改配置的接口，或使用 Nacos 的控制台去修改，配置发生变更后， Nacos 就会把最新的配置推送到该应用的所有机器上，简单而高效。

想想之前，为了实现此功能，写了多少冤枉代码，做了多少冤枉的运维工作。要是早一点认识 Nacos，该有多好呀！

## 总结

本文作为 Nacos 5W1H 系列文章的开篇，从“What” 讲述了 Nacos 配置管理能帮我们解决的问题：以简单、优雅、高效的方式管理配置，实现配置的动态变更，大大降低运维成本，让开发同学早点下班。

当然，Nacos 的配置管理，不单单只有上述的那些功能，还有诸如“灰度发布”、“版本管理”、“快速回滚”、“监听查询”、“推送轨迹”、“权限控制”、“敏感配置（如，数据库连接配置）的加密存储”等等，这些有的已经在 Nacos 中开源实现了，有的在 Nacos 配置管理的阿里云免费产品 [ACM](https://cn.aliyun.com/product/acm) 中提供了，当然，后续也会慢慢开源到 Nacos 中，敬请期待。

本系列文章，会持续为大家讲述 Nacos 的点点滴滴，不单单讲述 “Nacos 能帮我们解决什么问题？”，还会深入源码分析“Nacos 是如何做到简单而强大的？”。同时，如果小伙们有兴趣的话，我们还会给大家八卦一下 Nacos 的 稗官野史，关于 Nacos 在阿里内部的历史，关于 Nacos 服务端口的寓意等等。总之，一句话：我有故事，也有美酒，君还何求？
