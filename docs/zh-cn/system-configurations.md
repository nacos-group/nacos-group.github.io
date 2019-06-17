# Nacos系统参数介绍

## Nacos Server

对于Server端来说，一般是设置在{nacos.home}/conf/application.properties里，如果参数名后标注了(-D)的，则表示是JVM的参数，需要在{nacos.home}/bin/startup.sh里进行相应的设置。例如像设置nacos.home的值，可以在{nacos.home}/bin/startup.sh进行如下设置：
```
JAVA_OPT="${JAVA_OPT} -Dnacos.home=${BASE_DIR}"
```

### 全局参数

|参数名	|含义	 |     可选值	 |     默认值| 支持版本 |
|------|------|-----------|-----------------|-------|
|nacos.home(-D)| Nacos的根目录 | 目录路径| Nacos安装的目录 | >= 0.1.0 |
|nacos.standalone(-D)| 是否在单机模式 | true/false | false | >= 0.1.0 |
|nacos.functionMode(-D)| 启动模式，支持只启动某一个模块，不设置时所有模块都会启动 | config/naming/空 | 空 | >= 0.9.0 |
|nacos.inetutils.prefer-hostname-over-ip| cluster.conf里是否应该填hostname | true/false| false | >= 0.3.0 |
|nacos.inetutils.ip-address | 本机IP，该参数设置后，将会使用这个IP去cluster.conf里进行匹配，请确保这个IP的值在cluster.conf里是存在的 | 本机IP| null | >= 0.3.0 |
|nacos.security.ignore.urls | 控制台鉴权跳过的接口 | 需要跳过控制台鉴权的接口列表| 空 | >= 0.9.0 |


### Naming模块

|参数名	|含义	 |     可选值	 |     默认值| 支持版本 |
|------|------|-----------|-----------------|-------|
|nacos.naming.data.warmup| 是否在Server启动时进行数据预热 | true/false | false | >= 1.0.2 |
|nacos.naming.expireInstance| 是否自动摘除临时实例 | true/false | true | >= 1.0.2 |
|nacos.naming.distro.taskDispatchPeriod| 同步任务生成的周期，单位为毫秒 | 正整数 | 200 | >= 1.0.2 |
|nacos.naming.distro.batchSyncKeyCount| 同步任务每批的key的数目 | 正整数 | 1000 | >= 1.0.2 |
|nacos.naming.distro.syncRetryDelay| 同步任务失败的重试间隔，单位为毫秒 | 正整数 | 5000 | >= 1.0.2 |

除了上面列到的在application.properties里配置的属性，还有一些可以在运行时调用接口来进行调节，这些参数都[open API](https://nacos.io/zh-cn/docs/open-api.html)里的```查看系统当前数据指标```这个API里有声明。

### Config模块

|参数名	|含义	 |     可选值	 |     默认值| 支持版本 |
|------|------|-----------|-----------------|-------|
|db.num| 数据库数目 | 正整数 | 0 | >= 0.1.0 |
|db.url.0| 第一个数据库的URL | 字符串 | 空 | >= 0.1.0 |
|db.url.1| 第二个数据库的URL | 字符串 | 空 | >= 0.1.0 |
|db.user| 数据库连接的用户名 | 字符串 | 空 | >= 0.1.0 |
|db.password| 数据库连接的密码 | 字符串 | 空 | >= 0.1.0 |

### CMDB模块

|参数名	|含义	 |     可选值	 |     默认值| 支持版本 |
|------|------|-----------|-----------------|-------|
|nacos.cmdb.loadDataAtStart| 是否打开CMDB | true/false | false | >= 0.7.0 |
|nacos.cmdb.dumpTaskInterval| 全量dump的间隔，单位为秒 | 正整数 | 3600 | >= 0.7.0 |
|nacos.cmdb.eventTaskInterval| 变更事件的拉取间隔，单位为秒 | 正整数 | 10 | >= 0.7.0 |
|nacos.cmdb.labelTaskInterval| 标签集合的拉取间隔，单位为秒 | 正整数 | 300 | >= 0.7.0 |

## Nacos Java Client

客户端的参数分为两种，一种是通过-D参数进行指定的配置，一种是构造客户端时，通过Properties对象指定的配置，以下没有带-D标注的都是通过Properties注入的配置。

### 通用参数

|参数名	|含义	 |     可选值	 |     默认值| 支持版本 |
|------|------|-----------|-----------------|-------|
|endpoint| 连接Nacos Server指定的连接点，可以参考[文档](https://nacos.io/zh-cn/blog/address-server.html) | 域名 | 空 | >= 0.1.0 |
|endpoint| 连接Nacos Server指定的连接点端口，可以参考[文档](https://nacos.io/zh-cn/blog/address-server.html) | 合法端口号 | 空 | >= 0.1.0 |
|namespace| 命名空间的ID | 命名空间的ID | config模块为空，naming模块为public | >= 0.8.0 |
|serverAddr| Nacos Server的地址列表，这个值的优先级比endpoint高 | ip:port,ip:port,... | 空 | >= 0.1.0 |
|nacos.logging.path(-D)| 客户端日志的目录 | 目录路径 | 用户根目录 | >= 0.1.0 |
|com.alibaba.nacos.config.log.level(-D)| Naming客户端的日志级别 | info,error,warn等 | info | >= 1.0.0 |
|com.alibaba.nacos.naming.log.level(-D)| Config客户端的日志级别 | info,error,warn等 | info | >= 1.0.0 |

### Naming客户端

|参数名	|含义	 |     可选值	 |     默认值| 支持版本 |
|------|------|-----------|-----------------|-------|
|namingLoadCacheAtStart| 启动时是否优先读取本地缓存 | true/false | false | >= 1.0.0 |
|namingClientBeatThreadCount| 客户端心跳的线程池大小 | 正整数 | 机器的CPU数的一半 | >= 1.0.0 |
|namingPollingThreadCount| 客户端定时轮询数据更新的线程池大小 | 正整数 | 机器的CPU数的一半 | >= 1.0.0 |

### Config客户端

|参数名	|含义	 |     可选值	 |     默认值| 支持版本 |
|------|------|-----------|-----------------|-------|
|config.long-poll.timeout| 长轮询的超时时间，单位为毫秒 | 正整数 | 30000 | >= 1.0.1 |
|config.retry.time| 长轮询的重试次数 | 正整数 | 3 | >= 1.0.1 |