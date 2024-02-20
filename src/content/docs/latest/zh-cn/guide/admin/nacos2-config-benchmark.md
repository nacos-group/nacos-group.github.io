---
title: Nacos2.0服务配置性能测试报告
keywords: [Nacos,服务,配置,性能]
description: Nacos2.0服务配置性能测试报告
sidebar:
    order: 7
---

# Nacos 2.0.0-ALPHA2 配置性能测试报告

## 测试目的

1. 长链接各项业务指标的最高值
2. 长链接相比短链接的差异数据对比

## 测试工具

我们使用自研的PAS性能评估服务平台进行压测，其原理是基于利用JMeter引擎，使用PAS自动生成的JMeter脚本，进行智能压测。

 ![Pas图](https://img.alicdn.com/tfs/TB1xCfDDpzqK1RjSZFvXXcB7VXa-692-297.png)
 
 ## 测试环境
 
 ### 1.环境
 
| **指标** | **参数** |
|-------|-------|
|机器|CPU 8核，内存16G|
|集群规模|单机|
|Nacos版本|Nacos 2.0.0-ALPHA2， Nacos 1.4.0|
|数据库|32C128G|

2.设置启动参数

因为grpc使用的直接内存，堆内存相对使用较少，所以jvm参数有所调整

#### Nacos2.0 gRPC
```
JAVA_OPT="${JAVA_OPT} -server -Xms9216m -Xmx9216m  -XX:MaxDirectMemorySize=4096m -XX:NewSize=4096m  -XX:+UnlockDiagnosticVMOptions -XX:+PrintNMTStatistics   -DisPushContent=false -XX:MaxNewSize=4096m -XX:MetaspaceSize=512m -XX:MaxMetaspaceSize=512m -XX:-OmitStackTraceInFastThrow -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/home/admin/nacos/logs/java_heapdump.hprof -XX:-UseLargePages -Xloggc:/home/admin/nacos/logs/nacos_gc.log -verbose:gc -XX:+PrintGCDetails -XX:+PrintGCDateStamps -XX:+PrintGCTimeStamps -XX:+UseGCLogFileRotation -XX:NumberOfGCLogFiles=10 -XX:GCLogFileSize=100M -DQUERYTIMEOUT=90  -XX:SurvivorRatio=10 -XX:+UseConcMarkSweepGC -XX:+UseCMSCompactAtFullCollection -XX:+CMSClassUnloadingEnabled -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/home/admin/nacos/logs -XX:+PrintGCDetails -XX:+PrintGCDateStamps -XX:CMSMaxAbortablePrecleanTime=5000 -XX:CMSInitiatingOccupancyFraction=74 -XX:+UseCMSInitiatingOccupancyOnly -XX:ParallelGCThreads=8 -Dnacos.core.auth.enabled=false "
```

#### Nacos1.X HTTP

```
-server -Xms12880m -Xmx12880m -XX:MaxDirectMemorySize=1024m -XX:NewSize=1024m -XX:+UnlockDiagnosticVMOptions -XX:+PrintNMTStatistics -DisPushContent=false -XX:MaxNewSize=4096m -XX:MetaspaceSize=512m -XX:MaxMetaspaceSize=512m -XX:-OmitStackTraceInFastThrow -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/home/admin/nacos/logs/java_heapdump.hprof -XX:-UseLargePages -Xloggc:/home/admin/nacos/logs/nacos_gc.log -verbose:gc -XX:+PrintGCDetails -XX:+PrintGCDateStamps -XX:+PrintGCTimeStamps -XX:+UseGCLogFileRotation -XX:NumberOfGCLogFiles=10 -XX:GCLogFileSize=100M -DQUERYTIMEOUT=90 -XX:SurvivorRatio=10 -XX:+UseConcMarkSweepGC -XX:+UseCMSCompactAtFullCollection -XX:+CMSClassUnloadingEnabled -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/home/admin/nacos/logs -XX:+PrintGCDetails -XX:+PrintGCDateStamps -XX:CMSMaxAbortablePrecleanTime=5000 -XX:CMSInitiatingOccupancyFraction=74 -XX:+UseCMSInitiatingOccupancyOnly -XX:ParallelGCThreads=8 -Dnacos.core.auth.enabled=false -Dnacos.member.list= -Djava.ext.dirs=/opt/taobao/java/jre/lib/ext:/opt/taobao/java/lib/ext -Xloggc:/home/admin/nacos/logs/nacos_gc.log -verbose:gc -XX:+PrintGCDetails -XX:+PrintGCDateStamps -XX:+PrintGCTimeStamps -XX:+UseGCLogFileRotation -XX:NumberOfGCLogFiles=10 -XX:GCLogFileSize=100M
```

## 测试场景

以下测试场景都是服务配置重要接口：

- 验证Nacos服务发布配置的能力
- 验证Nacos服务获取配置的能力
- 验证Nacos服务监听配置的能力
- 验证Nacos服务长连接容量能力

测试方式均是在相同的环境下，使用相同的压力进行测试，分别比对Nacos2.X版本和Nacos1.X版本的性能差异。

## 测试数据

### 1. 发布配置

#### Nacos2.0

|tps|500|1000|1200|1500|2000|2500|3000|
|---|---|---|---|---|---|---|---|
|avg rt(ms)|7|8|12|9|9|10.89|1044|
|80% rt(ms)|7.9|8|11|9|9|10.69|1581|
|95% rt(ms)|8.7|11|25|15|14|24.74|2966|
|cpu|12|22|28|36|47|55|62|
|load|0.5|1.5|1.5|1.5|3.5|4|5

#### Nacos1.X

|tps|500|1000|1200|1400|2000|2500|3000|
|---|---|---|---|---|---|---|---|
|avg rt(ms)|9|8.67|8|9|10|11.88|1038|
|80% rt(ms)|9|9.4|10|9|10|12.48|1090|
|95% rt(ms)|11|11.4|12|14|18|25.7|1170|
|cpu|14|25|30|35|50|60|65|
|load|0.9|1.4|2|2.5|3|2.5|3.7|


#### 结果分析
发布配置两者差别不大,TPS 在2500tps左右出现拐点,http和长链接通道的cpu消耗分布类似。长链接对发布配置提升不大。

### 2. 获取配置

随机获取200个 5K大小配置

#### Nacos2.0

|tps|2000|4000|6000|8000|10000|14000|18000（实际15000）|
|---|---|---|---|---|---|---|---|
|avg rt(ms)|3.3|4|3.5|5|7|26|133|
|80% rt(ms)|2.2|2.2|2.5|2.5|4|41|174|
|95% rt(ms)|3.3|4.8|5.4|24|38|93|238|
|cpu|12|25|37|48|65|83|85|
|load|1.2|2|3|4|5|20|36|

#### Nacos1.X

|tps|2000|4000|6000|8000|10000|14000(实际11000) |
|---|---|---|---|---|---|---|
|avg rt(ms)|3|7.4|12|22|46|176|
|80% rt(ms)|1.8|2|4|7|35|185|
|95% rt(ms)|4.4|6|15|33|118|380|
|cpu|15|30|40|52|60|70|
|load|1.1|2.2|2.5|4|5.5|9|

#### 结果分析
长链接支撑的读QPS提升50%，CPU消耗降低50%，http的CPU消耗50%在于请求地址解析

### 3. 监听配置

两者均为单链接监听200配置。

#### Nacos2.0

|tps|1500|3000|6000|
|---|---|---|---|
|cpu|30|30|60|
ygc|0|3.75s/次，7次 0.5秒|3s/次，10次 1.4秒|
cmsgc|0|0|0|
load|6|14|20|

#### Nacos1.X

|tps|3000|4000|6000|
|---|---|---|---|
cpu|80%|90%|80%|
ygc|3s一次，10次耗时0.5s|2s一次，15次耗时1.5s|1.5s一次，20次耗时1.3秒|
cmsgc|3s一次，10次耗时18s|4.5一次，7次耗时10s|7.5s一次，4次耗时5s|
load|6|8|11|

#### 结果分析
gRPC以1500tps持续变更推送，可以保证系统指标稳定，超过1500tps，系统内存和load持续升高，但完全没有CMS GC，CPU也维持在较低的水准。 Http 则有较高的CMS GC，GC耗时严重，CPU损耗高。

### 4. 长连接容量测试

两者均为单链接监听200配置。快上为同时进行大量配置发布。

#### Nacos2.0

|count|6000|8000|12000|15000|21000|31500|42000|
|---|---|---|---|---|---|---|---|
|快上时cpu|40|60|80|77|79|80|74|
|快上时load|1.5|3|3.3|3.6|5.45|5.6|6.3|
|快上耗时|55s|55s|76|100|80|140|130|
|稳定时cpu|1|1|1|1.3|2.8|1.7|2.1|
|稳定时load|0.3|0.5|0.5|0.8|0.9|0.8|0.8|
|gc|稳定后无GC消耗|稳定后无GC消耗|稳定后无GC消耗|稳定后无GC消耗|稳定后无GC消耗|稳定后无GC消耗|稳定后无GC消耗|

#### Nacos1.X

|count|6000|8000|12000|15000|21000|31500|42000|
|---|---|---|---|---|---|---|---|
快上时cpu|80|-|-|-|-|-|-|
快上时load|8|-|-|-|-|-|-|
快上耗时|100s|-|-|-|-|-|-|
稳定时cpu|60|-|-|-|-|-|-|
稳定时load|1|-|-|-|-|-|-|
gc|cmsgc频繁，4秒一次|-|-|-|-|-|-|

#### 结果分析

当连接量达到600时，Nacos1.X的CMS GC已经十分严重，4s一次，基本已经达到极限；反观Nacos2.0，可以继续增长，单从支撑长链接数量角度，Nacos2.0比Nacos1.X支撑7倍以上长链接。

## 测试结论

单项基础接口压测

- Nacos2.0读QPS 14000QPS，对比Nacos1.X QPS 8000 提升75%。
- Nacos2.0写TPS 2500TPS，对比Nacos1.X无明显提升。
- Nacos2.0支撑长链接40000以上，对比Nacos1.X提升7倍以上。
- Nacos2.0变更推送1500/s, 对比Nacos1.X无明显提升。

**注意** 

- 本测试为对比Nacos1.X版本的测试场景，仅测试单核心接口的能力值，**真实模拟场景压测** 将在后续版本给出；
- 本测试供给大家作为参考，如有不足或偏差，请指正! 如果对性能有其他需求，可以给我们提issue。
