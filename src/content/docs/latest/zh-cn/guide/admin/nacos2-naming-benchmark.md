---
title: Nacos2.0服务发现性能测试报告
keywords: [Nacos,服务,发现,性能]
description: Nacos2.0服务发现性能测试报告
sidebar:
    order: 8
---

# Nacos2.0.0-ALPHA2 服务发现性能测试报告

## 测试目的

Nacos2.0对连接模型，服务发现的数据模型也运作模式进行了大范围的重构，因此需要在相同或类似的场景下，了解Nacos2的服务发现性能负载和容量与Nacos1的区别，帮助用户更快的运用评估Nacos系统负荷。

Nacos1.0性能测试参考 [服务发现性能测试报告](https://nacos.io/docs/v1/nacos-naming-benchmark)

## 测试工具

我们使用自研的PAS性能评估服务平台进行压测，其原理是基于利用JMeter引擎，使用PAS自动生成的JMeter脚本，进行智能压测。

![Pas图](https://img.alicdn.com/tfs/TB1xCfDDpzqK1RjSZFvXXcB7VXa-692-297.png)

## 测试环境

### 1. 环境

|  **指标**  |	**参数**  |
|-----------|-----------|
|机器|	CPU 8核，内存16G|
|集群规模	|3节点|
|Nacos版本|	服务端：Nacos2.0.0-ALPHA2， 客户端：Nacos2.0.0-ALPHA2|

### 2.设置启动参数

```
${JAVA_HOME}/bin/java -DembeddedStorage=true -server -Xms10g -Xmx10g -Xmn4g -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=320m -XX:-OmitStackTraceInFastThrow -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/home/admin/nacos/logs/java_heapdump.hprof -XX:-UseLargePages -Dnacos.member.list= -Djava.ext.dirs=${JAVA_HOME}/jre/lib/ext:${JAVA_HOME}/lib/ext -Xloggc:/home/admin/nacos/logs/nacos_gc.log -verbose:gc -XX:+PrintGCDetails -XX:+PrintGCDateStamps -XX:+PrintGCTimeStamps -XX:+UseGCLogFileRotation -XX:NumberOfGCLogFiles=10 -XX:GCLogFileSize=100M -Dloader.path=/home/admin/nacos/plugins/health,/home/admin/nacos/plugins/cmdb -Dnacos.home=/home/admin/nacos -jar /home/admin/nacos/target/nacos-server.jar --spring.config.additional-location=file:/home/admin/nacos/conf/ --logging.config=/home/admin/nacos/conf/nacos-logback.xml --server.max-http-header-size=524288 nacos.nacos
```

## 测试场景

以下测试场景都是服务发现重要接口：

- 验证Nacos服务发现注册实例的能力
- 验证Nacos服务发现查询实例的能力
- 验证Nacos服务发现注销实例的能力

## 测试数据

### 1. 注册实例

施压机模拟100个客户端同时发起注册服务，每个客户端一条长连接，每个客户端注册1W个服务。总数100W个服务及实例。

注册完成之后每个客户端继续不停进行注册请求，模拟重复注册请求（会进行更新替换），同时记录下整个过程中的相关数据。

#### 相关API 

`NamingService.registerInstance(String serviceName, Instance instance)` 

#### 结果数据如下

| 施压机数量 | 每台线程数 | 平均TPS | 平均RT | 最小RT | 最大RT | 80%RT(ms) | 95%RT(ms) | 99%RT(ms) | CPU使用率 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 100 | 7256.32 | 13.14 | 0.39 | 2522.25 | 6.72 | 12.86 | 126.33 | 80% |
| 2 | 50 | 16418.04 | 5.8 | 0.41 | 3906.77 | 4.0 | 8.88 | 48.84 | 90% |
| 5 | 20 | 26784.84 | 3.6 | 0.38 | 1606.41 | 3.82 | 8.91 | 30.62 | 90% |

#### 结果分析

相较Nacos1.X版本，注册性能总体提升至少2倍，在服务端机能减半的情况下，服务实例数基本一致的情况下，TPS仍能做到2倍左右的提高。

### 2. 查询实例

施压机先模拟发起注册服务，总数10W个服务，每个服务10个实例，总数100W实例。

注册完成后，模拟100个客户端同时不停进行随机服务查询请求，并且有实例长度校验。同时记录下整个过程中的相关数据。

#### 相关API 

`NacosNamingService.getAllInstances(String serviceName, boolean subscribe)` 

**注意** subscribe 为 false 进行测试，否则将会优先查询客户端缓存。

#### 结果数据如下

| 施压机数量 | 每台线程数 | 平均TPS | 平均RT | 最小RT | 最大RT | 80%RT(ms) | 95%RT(ms) | 99%RT(ms) | CPU使用率 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 100 | 12998.46 | 7.54 | 0.55 | 213.86 | 9.68 | 10.69 | 27.92 | 40% |
| 2 | 50 | 12785.01 | 7.93 | 0.38 | 900.48 | 8.34 | 14.18 | 33.04 | 40% |
| 2 | 100 | 18451.78 | 10.63 | 0.6 | 829.42 | 11.95 | 23.79 | 44.19 | 45% |
| 5 | 20 | 30680.48 | 3.12 | 0.46 | 1138.38 | 4.33 | 5.9 | 9.57 | 50% |

#### 结果分析

相较Nacos1.X版本，查询性能总体提升至少3倍，在服务端机能减半的情况下，服务实例数基本一致的情况下，TPS仍能做到3倍左右的提高，单机多线程场景甚至有10倍的提升。

### 3. 注销实例

施压机先模拟100个客户端同时发起注册服务，每个客户端一条长连接，每个客户端注册1W个服务。总数100W个服务及实例。

注册完成后，模拟使用相同100个客户端同时不停进行随机服务注销请求，同时记录下整个过程中的相关数据。

#### 相关API 

`NacosNamingService.deregisterInstance(String serviceName, String ip, int port)` 

#### 结果数据如下

| 施压机数量 | 每台线程数 | 平均TPS | 平均RT | 最小RT | 最大RT | 80%RT(ms) | 95%RT(ms) | 99%RT(ms) | CPU使用率 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 100 | 9614.96 | 9.88 | 0.41 | 1115.27 | 8.85 | 15.32 | 104.76 | 70% |
| 2 | 50 | 22252.07 | 4.28 | 0.39 | 856.1 | 4.03 | 5.65 | 31.02 | 90% -> 60%  |
| 5 | 20 | 29393.8 | 2.55 | 0.42 | 741.09 | 2.67 | 8.91 | 15.85 | 90% -> 60% |

#### 结果分析

相较Nacos1.X版本，注销性能总体提升至少2倍，在服务端机能减半的情况下，服务实例数基本一致的情况下，TPS仍能做到2倍左右的提高。
关于CPU由90% 降低为 60%的场景， 是由于随着注销的的服务和实例增多，重复注销的操作变得频繁，未命中服务和实例的操作会被快速返回且操作量小，因此CPU下降、TPS相对注册略高。

## 测试结论

Nacos2服务发现性能测试都是针对重点功能，通过对3节点规模集群进行压测，可以看到接口性能负载和容量，以及对比相同/类似场景下Nacos1.X版本的提升。

1. 压测时服务及实例容量达到百万级，集群运行持续稳定，达到预期；（该场景没有计算频繁变更导致的频繁推送内容，仅单纯计算容量上线，附带推送的真实场景将在下轮压测报告中给出）
2. 注册/注销实例TPS达到 26000 以上，总体较Nacos1.X提升至少2倍，接口达到预期；
3. 查询实例TPS能够达到 30000 以上，总体较Nacos1.X提升3倍左右，接口达到预期；

**注意** 

- 本次只测试临时实例注册/查询/注销，未涉及持久实例；
- 本测试为对比Nacos1.X版本的测试场景，仅测试单核心接口的能力值，**真实模拟场景压测** 将在后续版本给出；
- 本测试供给大家作为参考，如有不足或偏差，请指正! 如果对性能有其他需求，可以给我们提issue。
