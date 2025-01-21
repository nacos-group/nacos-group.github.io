---
title: Nacos系统参数介绍
keywords: [Nacos,系统参数]
description: Nacos系统参数介绍
sidebar:
    order: 3
---

# Nacos 系统参数介绍

> 该文档即将废弃，Server的参数推荐查看[运维手册-系统参数](../../manual/admin/system-configurations.md)，Client的参数推荐查看[用户手册-客户端参数 TODO](#nacos-java-client)

## Nacos Server

对于Server端来说，一般是设置在`{nacos.home}/conf/application.properties`里，如果参数名后标注了(-D)的，则表示是 JVM 的参数，需要在`{nacos.home}/bin/startup.sh`里进行相应的设置。例如像设置 nacos.home 的值，可以在`{nacos.home}/bin/startup.sh`进行如下设置：

```
JAVA_OPT="${JAVA_OPT} -Dnacos.home=${BASE_DIR}"
```

### 全局参数

|参数名	|含义	 |     可选值	 |     默认值| 支持版本 |
|------|------|-----------|-----------------|-------|
|nacos.home(-D)| Nacos的根目录 | 目录路径| Nacos安装的目录 | >= 0.1.0 |
|nacos.standalone(-D)| 是否在单机模式 | true/false | false | >= 0.1.0 |
|nacos.functionMode(-D)| 启动模式，支持只启动某一个模块，不设置时所有模块都会启动 | config/naming/空 | 空 | >= 0.9.0 |
|nacos.inetutils.prefer-hostname-over-ip| `cluster.conf`里是否应该填`hostname`| true/false| false | >= 0.3.0 |
|nacos.inetutils.ip-address | 本机IP，该参数设置后，将会使用这个IP去`cluster.conf`里进行匹配，请确保这个IP的值在`cluster.conf`里是存在的 | 本机IP| null | >= 0.3.0 |

### Naming模块

|参数名	|含义	 |     可选值	 |     默认值| 支持版本 |
|------|------|-----------|-----------------|-------|
|nacos.naming.data.warmup| 是否在Server启动时进行数据预热 | true/false | false | >= 1.0.2 |
|nacos.naming.expireInstance| 是否自动摘除临时实例 | true/false | true | >= 1.0.2 |
|nacos.naming.distro.taskDispatchPeriod| 同步任务生成的周期，单位为毫秒 | 正整数 | 2000 | >= 1.0.2 |
|nacos.naming.distro.batchSyncKeyCount| 同步任务每批的key的数目 | 正整数 | 1000 | >= 1.0.2 |
|nacos.naming.distro.syncRetryDelay| 同步任务失败的重试间隔，单位为毫秒 | 正整数 | 5000 | >= 1.0.2 |

除了上面列到的在`application.properties`里配置的属性，还有一些可以在运行时调用接口来进行调节，这些参数都在[Open API](../user/open-api.md)里的```查看系统当前数据指标```这个API里有声明。

### Config模块

|参数名	|含义	 |     可选值	 |     默认值| 支持版本 |
|------|------|-----------|-----------------|-------|
|db.num| 数据库数目 | 正整数 | 0 | >= 0.1.0 |
|db.url.0| 第一个数据库的URL | 字符串 | 空 | >= 0.1.0 |
|db.url.1| 第二个数据库的URL | 字符串 | 空 | >= 0.1.0 |
|db.user| 数据库连接的用户名 | 字符串 | 空 | >= 0.1.0 |
|db.password| 数据库连接的密码 | 字符串 | 空 | >= 0.1.0 |
|spring.datasource.platform|数据库类型|字符串|mysql|>=1.3.0|
|db.pool.config.xxx| 数据库连接池参数，使用的是hikari连接池，参数与hikari连接池相同，如`db.pool.config.connectionTimeout`或`db.pool.config.maximumPoolSize`|字符串|同hikariCp对应默认配置|>=1.4.1|

当前数据库配置支持多数据源。通过`db.num`来指定数据源个数，`db.url.index`为对应的数据库的链接。`db.user`以及`db.password`没有设置`index`时,所有的链接都以`db.user`和`db.password`用作认证。如果不同数据源的用户名称或者用户密码不一样时，可以通过符号`,`来进行切割，或者指定`db.user.index`,`db.user.password`来设置对应数据库链接的用户或者密码。需要注意的是，当`db.user`和`db.password`没有指定下标时，因为当前机制会根据`,`进行切割。所以当用户名或者密码存在`,`时，会把`,`切割后前面的值当成最后的值进行认证，会导致认证失败。

Nacos从1.3版本开始使用HikariCP连接池，但在1.4.1版本前，连接池配置由系统默认值定义，无法自定义配置。在1.4.1后，提供了一个方法能够配置HikariCP连接池。
`db.pool.config`为配置前缀，`xxx`为实际的hikariCP配置，如`db.pool.config.connectionTimeout`或`db.pool.config.maximumPoolSize`等。更多hikariCP的配置请查看[HikariCP](https://github.com/brettwooldridge/HikariCP) 
需要注意的是，url,user,password会由`db.url.n`,`db.user`,`db.password`覆盖，driverClassName则是默认的MySQL8 driver（该版本mysql driver支持mysql5.x)

### CMDB模块

|参数名	|含义	 |     可选值	 |     默认值| 支持版本 |
|------|------|-----------|-----------------|-------|
|nacos.cmdb.loadDataAtStart| 是否打开CMDB | true/false | false | >= 0.7.0 |
|nacos.cmdb.dumpTaskInterval| 全量dump的间隔，单位为秒 | 正整数 | 3600 | >= 0.7.0 |
|nacos.cmdb.eventTaskInterval| 变更事件的拉取间隔，单位为秒 | 正整数 | 10 | >= 0.7.0 |
|nacos.cmdb.labelTaskInterval| 标签集合的拉取间隔，单位为秒 | 正整数 | 300 | >= 0.7.0 |

## Nacos Java Client

> TODO: 单独一篇文档，放在用户指南中

客户端的参数分为两种，一种是通过-D参数进行指定的配置，一种是构造客户端时，通过`Properties`对象指定的配置，以下没有带-D标注的都是通过`Properties`注入的配置。

### 通用参数

|参数名	|含义	 |     可选值	 |     默认值| 支持版本 |
|------|------|-----------|-----------------|-------|
|endpoint| 连接Nacos Server指定的连接点，可以参考[文档](https://nacos.io/blog/case-address-server/) | 域名 | 空 | >= 0.1.0 |
|endpointPort| 连接Nacos Server指定的连接点端口，可以参考[文档](https://nacos.io/blog/case-address-server/) | 合法端口号 | 空 | >= 0.1.0 |
|namespace| 命名空间的ID | 命名空间的ID | config模块为空，naming模块为public | >= 0.8.0 |
|serverAddr| Nacos Server的地址列表，这个值的优先级比endpoint高 | ip:port,ip:port,... | 空 | >= 0.1.0 |
|JM.LOG.PATH(-D)| 客户端日志的目录 | 目录路径 | 用户根目录 | >= 0.1.0 |

### Naming客户端

|参数名	|含义	 |     可选值	 |     默认值| 支持版本 |
|------|------|-----------|-----------------|-------|
|namingLoadCacheAtStart| 启动时是否优先读取本地缓存 | true/false | false | >= 1.0.0 |
|namingCacheRegistryDir| 指定缓存子目录，位置为 `.../nacos/{SUB_DIR}/naming` | 子目录路径 | 空字符串 | >=2.0.2
|namingClientBeatThreadCount| 客户端心跳的线程池大小 | 正整数 | 机器的CPU数的一半 | >= 1.0.0 |
|namingPollingThreadCount| 客户端定时轮询数据更新的线程池大小 | 正整数 | 机器的CPU数的一半 | >= 1.0.0 |
|com.alibaba.nacos.naming.cache.dir(-D)| 客户端缓存目录 | 目录路径 | `{user.home}/nacos/naming` | >= 1.0.0 |
|com.alibaba.nacos.naming.log.level(-D)| Naming客户端的日志级别 | info,error,warn等 | info | >= 1.0.0 |
|com.alibaba.nacos.client.naming.tls.enable(-D)| 是否打开HTTPS | true/false | false | >= 1.0.0 | 

### Config客户端

|参数名	|含义	 |     可选值	 |     默认值| 支持版本 |
|------|------|-----------|-----------------|-------|
|configLongPollTimeout(config.long-poll.timeout 1.0.1版本)| 长轮询的超时时间，单位为毫秒 | 正整数 | 30000 | >= 1.0.2 |
|configRetryTime(config.retry.time 1.0.1版本)| 长轮询任务重试时间，单位为毫秒 | 正整数 | 2000 | >= 1.0.2 |
|maxRetry| 长轮询的重试次数 | 正整数 | 3 | >= 1.0.2 |
|enableRemoteSyncConfig| 监听器首次添加时拉取远端配置 | 布尔值 | false | >= 1.0.2 |
|com.alibaba.nacos.config.log.level(-D)| Config客户端的日志级别 | info,error,warn等 | info | >= 1.0.0 |
|JM.SNAPSHOT.PATH(-D)| 客户端缓存目录 | 目录路径 | {user.home}/nacos/config | >= 1.0.0 |
