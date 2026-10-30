---
title: Nacos system parameters introduce
keywords: [Nacos,System parameters]
description: Nacos system parameters introduce
sidebar:
    order: 3
---

# Nacos system parameters introduce

> Document optimizing...

## Nacos Server

For Server side, usually set in `{nacos.home}/conf/application.properties`, if the parameter name after mark (-D), says is the JVM parameter, need in `{nacos.home}/bin/startup.sh` accordingly set up. Such as setting nacos. The value of the home, can be in `{nacos.home}/bin/startup.sh` the following Settings:

```
JAVA_OPT="${JAVA_OPT} -Dnacos.home=${BASE_DIR}"
```

### Global parameters

|Parameter names |Meaning	 |   Optional value	 |  Default value | Support version |
|----------------|-----------|-------------------|-----------------|-------|
|nacos.home(-D)| Nacos root directory | Directory path| Nacos installation directory | >= 0.1.0 |
|nacos.standalone(-D)| Whether in stand-alone mode | true/false | false | >= 0.1.0 |
|nacos.functionMode(-D)| Boot mode, support only start one module, do not set all modules will start | config/naming/null | null | >= 0.9.0 |
|nacos.inetutils.prefer-hostname-over-ip| if you should fill in `hostname` in `cluster.conf` | true/false| false | >= 0.3.0 |
|nacos.inetutils.ip-address | Native IP, set this parameter, will use this IP to`cluster.conf`matching, please make sure that the IP value exists in the `cluster.conf` | Native IP| null | >= 0.3.0 |


### Naming module

|Parameter names	|Meaning	 |     Optional value	 |  Default value| Support version |
|------|------|-----------|-----------------|-------|
|nacos.naming.data.warmup| Whether the Server startup to preheat the data | true/false | false | >= 1.0.2 |
|nacos.naming.expireInstance| Whether automatic removal of temporary instance | true/false | true | >= 1.0.2 |
|nacos.naming.distro.taskDispatchPeriod| Synchronization task generation cycle, milliseconds | positive integer | 2000 | >= 1.0.2 |
|nacos.naming.distro.batchSyncKeyCount| The number of each batch of key synchronization task | positive integer | 1000 | >= 1.0.2 |
|nacos.naming.distro.syncRetryDelay| Synchronization task failure retry intervals, milliseconds | positive integer | 5000 | >= 1.0.2 |

In addition to the above listed to in `application.properties`configuration properties, And some can be adjusted call interface at runtime, These parameters are in the [Open API](../user/open-api.md)```examine system current data index```the API in a statement.

### Config module

|Parameter names	|Meaning	 |     Optional value	 |     Default value| Support version |
|------|------|-----------|-----------------|-------|
|nacos.plugin.datasource-dialect.type|Database dialect selector|derby/mysql/postgresql/oracle/custom|By running mode|3.3.0 ~ latest|
|nacos.plugin.datasource.db.num|Number of external databases|positive integer|0|3.3.0 ~ latest|
|nacos.plugin.datasource.db.url.{index}|Indexed database URL|string|empty|3.3.0 ~ latest|
|nacos.plugin.datasource.db.user[.{index}]|Shared or indexed username|string|empty|3.3.0 ~ latest|
|nacos.plugin.datasource.db.password[.{index}]|Shared or indexed password|string|empty|3.3.0 ~ latest|
|nacos.plugin.datasource.db.pool.config.xxx|HikariCP setting; stable items use kebab-case|string|See plugin page|3.3.0 ~ latest|

`spring.sql.init.platform` and `db.*` remain historical aliases, and canonical keys win. `spring.datasource.platform` is removed. See [Datasource Plugin](../../plugin/datasource-plugin.md) for stable keys, defaults, and migration rules.

### CMDB module

|Parameter names	|Meaning	 |     Optional value	 | Default value| Support version |
|------|------|-----------|-----------------|-------|
|nacos.cmdb.loadDataAtStart| Whether to open the CMDB | true/false | false | >= 0.7.0 |
|nacos.cmdb.dumpTaskInterval| The full amount of the interval of the dump, the unit is in seconds | positive integer | 3600 | >= 0.7.0 |
|nacos.cmdb.eventTaskInterval| The pull interval change events, the unit is in seconds | positive integer | 10 | >= 0.7.0 |
|nacos.cmdb.labelTaskInterval| Label the pull interval set, the unit is in seconds | positive integer | 300 | >= 0.7.0 |

## Nacos Java Client

> TODO: Move to dependent document in user guide

Client parameters are divided into two kinds, one kind is through the -D parameter to specify the configuration of the client is a kind of structure, through `Properties` objects specified in the configuration, the following without -D marked by `Properties` injection configuration.

### General parameters

|Parameter names	|Meaning	 |     Optional value	 |     Default value| Support version |
|------|------|-----------|-----------------|-------|
|endpoint| Connection Nacos Server specify the connection point, you can refer to [file](https://nacos.io/en-us/blog/address-server.html) | domain name | null | >= 0.1.0 |
|endpointPort| Connection Nacos Server specify the connection port, you can refer to [file](https://nacos.io/en-us/blog/address-server.html) | Legal port | null | >= 0.1.0 |
|namespace| namespace ID  | namespace ID | config module is empty, naming module is public| >= 0.8.0 |
|serverAddr| Nacos Server address list, this value is higher priority than the endpoint | ip:port,ip:port,... | null | >= 0.1.0 |
|JM.LOG.PATH(-D)|  client log directory | directory path | root directory of the user | >= 0.1.0 |
|com.alibaba.nacos.config.log.level(-D)| Naming client log level | info,error,warn etc | info | >= 1.0.0 |
|com.alibaba.nacos.naming.log.level(-D)| Config client log level | info,error,warn etc | info | >= 1.0.0 |
|com.alibaba.nacos.client.naming.tls.enable(-D)| Whether to open the HTTPS | true/false | false | >= 1.0.0 | 

### Naming client

|Parameter names	|Meaning	 |     Optional value	 |     Default value| Support version |
|------|------|-----------|-----------------|-------|
|namingLoadCacheAtStart| If boot priority reads a local cache | true/false | false | >= 1.0.0 |
|namingCacheRegistryDir| The subdirectory of cache, default is `.../nacos/{SUB_DIR}/naming` | path of SUB_DIR | empty string | >=2.0.2
|namingClientBeatThreadCount| client's heartbeat thread pool size | positive integer | number of the machine's CPU half | >= 1.0.0 |
|namingPollingThreadCount| client regularly polling data update the thread pool size | positive integer | number of the machine's CPU half | >= 1.0.0 |
|com.alibaba.nacos.naming.cache.dir(-D)| The directory of client cache | path of directory  | `{user.home}/nacos/naming` | >= 1.0.0 |

### Config client

|Parameter names	|Meaning	 |     Optional value	 |     Default value| Support version |
|------|------|-----------|-----------------|-------|
|configLongPollTimeout(config.long-poll.timeout 1.0.1 version)| Long polling timeout, milliseconds | positive integer | 30000 | >= 1.0.2 |
|configRetryTime(config.retry.time 1.0.1 version)| Retry time long polling tasks, milliseconds | positive integer | 2000 | >= 1.0.2 |
|maxRetry| Long polling retries | positive integer | 3 | >= 1.0.2 |
|enableRemoteSyncConfig| Listeners are added to the remote configuration for the first time | boolean value | false | >= 1.0.2 |
