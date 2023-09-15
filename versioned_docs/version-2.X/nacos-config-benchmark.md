---
title: Nacos服务配置性能测试报告
keywords: [Nacos,服务,配置,性能]
description: Nacos服务配置性能测试报告
---

# Nacos服务配置性能测试报告

## 测试目的
主要让大家了解Nacos的性能负载和容量，协助我们更好的管理Nacos性能质量，帮助用户更快的运用评估Nacos系统负荷。

## 测试工具
我们使用自研的PAS性能评估服务平台进行压测，其原理是基于利用JMeter引擎，使用PAS自动生成的JMeter脚本，进行智能压测。

![IMAGE](https://img.alicdn.com/tfs/TB1xCfDDpzqK1RjSZFvXXcB7VXa-692-297.png)

## 测试环境

### 1.环境

指标|参数
---|---
机器|CPU 8核，内存16G
集群规模|单机，3节点，10节点，100节点
Nacos版本|0.8.0
数据库|32C128G

### 2.设置启动参数
```
/opt/taobao/java/bin/java -server -Xms4g -Xmx4g -Xmn2g 
-XX:MetaspaceSize=128m 
-XX:MaxMetaspaceSize=320m 
-Xdebug 
-Xrunjdwp:transport=dt_socket,address=9555,server=y,suspend=n 
-XX:+UseConcMarkSweepGC 
-XX:+UseCMSCompactAtFullCollection 
-XX:CMSInitiatingOccupancyFraction=70 
-XX:+CMSParallelRemarkEnabled -XX:SoftRefLRUPolicyMSPerMB=0 
-XX:+CMSClassUnloadingEnabled -XX:SurvivorRatio=8 
-XX:-UseParNewGC -verbose:gc -Xloggc:/home/admin/nacos/logs/nacos_gc.log 
-XX:+PrintGCDetails -XX:+PrintGCDateStamps -XX:+PrintGCApplicationStoppedTime 
-XX:+PrintAdaptiveSizePolicy -Dnacos.home=/home/admin/nacos -XX:-OmitStackTraceInFastThrow 
-XX:-UseLargePages -jar /home/admin/nacos/target/nacos-server.jar 
--spring.config.location=classpath:/,classpath:/config/,file:./,file:./config/,file:/home/admin/nacos/conf/
```

## 测试场景
以下测试场景都是服务配置重要接口：
* 验证Nacos服务发布配置的能力
* 验证Nacos服务获取配置的能力
* 验证Nacos服务监听配置的能力
* 验证Nacos服务长连接容量能力

## 测试数据

### 1. 发布配置
发布配置主要测试Nacos publishConfig接口的性能。  
在各规模集群的性能表现：

单机|3节点|10节点|100节点
:---:|:---:|:---:|:---:
1400|4214|6863|8626

具体我们看下3节点服务集群发布配置能力。  
以下为各个并发数 (施压机台数*并发数) 时，发布配置的TPS，平均RT。
![IMAGE](https://img.alicdn.com/tfs/TB1OjzIDpzqK1RjSZFoXXbfcXXa-693-400.png)
![IMAGE](https://img.alicdn.com/tfs/TB1s.EfDxjaK1RjSZKzXXXVwXXa-693-325.png)


### 2. 获取配置
获取配置对Nacos getConfig接口进行测试。  
实测在各个规模集群的性能表现：

单机|3节点|10节点|100节点
:---:|:---:|:---:|:---:
15000|23013|45000|161099

具体我们也看下3节点服务集群获取配置能力，以下为各个并发数 (施压机台数*并发数) 时，获取配置的TPS，平均RT。
![IMAGE](https://img.alicdn.com/tfs/TB1UjzDDr2pK1RjSZFsXXaNlXXa-691-365.png)
![IMAGE](https://img.alicdn.com/tfs/TB1kcfADwTqK1RjSZPhXXXfOFXa-691-380.png)

### 3. 监听配置
执行Nacos addListeners的接口的性能， 监听配置主要采用增加多个配置监听，并多次发布配置的方法，统计发布时间与监听接收到配置时间间隔。  
我们选取了几个点，列举了发布与监听时间差，在100ms内基本都能监听到配置的更改。

次数|发布与监听时间差(ms)|
:---:|:---:
1|63
2|53
3|84
4|73
5|46
6|35
7|73
8|183
9|104

### 4. 长连接容量测试
Nacos监听配置与客户端建立长连接，长连接会消耗服务内存，从而集群load增高。建立长连接容量的能力，主要考查配置监听的瓶颈。  
测试方法逐渐增加集群的连接，单机连接达到9000时，CPU: 13.9% 内存：18.8%，load：4.7，都处于正常状态，连接数量增加后，load会成倍数级增加。  
在各规模集群测试基本上符合验证。

单机|3节点|10节点|100节点
:---:|:---:|:---:|:---:
9000|27000|90000|910000

## 测试结论
Nacos性能测试都是针对重点功能，通过对各规模集群进行压测，可以看到各个集群的接口容量。  
本测试供给大家作为参考，如有不足或偏差，请指正！  
如果对性能有其他需求，可以给我们提issue。
