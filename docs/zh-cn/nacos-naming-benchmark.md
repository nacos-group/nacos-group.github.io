---
title: Nacos服务发现性能测试报告
keywords: Nacos,服务,发现,性能
description: Nacos服务发现性能测试报告
---

# Nacos服务发现性能测试报告

## 测试目的
主要了解Nacos的服务发现性能负载和容量，协助我们更好的管理Nacos性能质量，帮助用户更快的运用评估Nacos系统负荷。

## 测试工具
我们使用自研的PAS性能评估服务平台进行压测，其原理是基于利用JMeter引擎，使用PAS自动生成的JMeter脚本，进行智能压测。

![IMAGE](https://img.alicdn.com/tfs/TB1xCfDDpzqK1RjSZFvXXcB7VXa-692-297.png)

## 测试环境
### 1.环境

指标|参数
---|---
机器|CPU 16核，内存32G
集群规模|3节点
Nacos版本|1.0.0

### 2.设置启动参数
```
/opt/taobao/java/bin/java	 -server
-Xms20g
-Xmx20g
-Xmn10g	 -XX:MetaspaceSize=128m
-XX:MaxMetaspaceSize=320m
-XX:-OmitStackTraceInFastThrow
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/home/admin/nacos/logs/java_heapdump.hprof
-XX:-UseLargePages
-Djava.ext.dirs=/opt/taobao/java/jre/lib/ext:/opt/taobao/java/lib/ext:/home/admin/nacos/plugi
ns/cmdb:/home/admin/nacos/plugins/mysql	 -Xloggc:/home/admin/nacos/logs/nacos_gc.log
-verbose:gc	 -XX:+PrintGCDetails	 -XX:+PrintGCDateStamps	 -XX:+PrintGCTimeStamps
-XX:+UseGCLogFileRotation
-XX:NumberOfGCLogFiles=10	 -XX:GCLogFileSize=100M	 -Xdebug
-Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=8000
-Dnacos.home=/home/admin/nacos	 -jar	 /home/admin/nacos/target/nacos-server.jar
--spring.config.location=classpath:/,classpath:/config/,file:./,file:./config/,file:/home/admin/naco
s/conf/	--logging.config=/home/admin/nacos/conf/nacos-logback.xml	nacos.nacos
```

## 测试场景
以下测试场景都是服务发现重要接口：
* 验证Nacos服务发现注册实例的能力
* 验证Nacos服务发现查询实例的能力
* 验证Nacos服务发现注销实例的能力

## 测试数据
### 1. 注册实例
Nacos服务发现注册实例接口的性能，调用HTTP接口测试。
实测3节点集群不同压力下的性能表现：

机器*并发数|服务数|注册实例数|TPS|RT(ms)|最小RT(ms)|最大RT(ms)
:---:|:---:|:---:|:---:|:---:|:---:|:---:
1*100|80301|84965|1793.41|54.63|0.8|1200.86
3*50|529321|819226|12574.8|15.8|0.45|3499.59
4*50|609726|836870|13000|18.54|0.46|3038.48
4*100|777262|927169|13257|35.65|0.48|3231.2

### 2. 查询实例
Nacos服务发现查询实例接口的性能，调用HTTP接口测试。
实测3节点集群不同压力下的性能表现：

机器*并发数|服务数|注册实例数|TPS|RT(ms)|最小RT(ms)|最大RT(ms)
:---:|:---:|:---:|:---:|:---:|:---:|:---:
1*100|80301|84965|3092.16|30.86|0.81|509.4
3*50|529321|819226|12574.8|15.8|0.45|3499.59
4*50|609726|836870|15603|16.41|0.42|3042.17
4*100|777262|927169|13604|34.19|0.43|3434.1

### 3. 注销实例
Nacos服务发现注销实例接口的性能，调用HTTP接口测试。
实测3节点集群不同压力下的性能表现：

机器*并发数|服务数|注册实例数|TPS|RT(ms)|最小RT(ms)|最大RT(ms)
:---:|:---:|:---:|:---:|:---:|:---:|:---:
1*100|80301|84965|1118.95|14.08|0.7|597.43
3*50|529321|819226|14508.53|11.23|0.4|3274.49
4*50|609726|836870|15476.93|16.02|0.38|3106.23
4*100|777262|927169|11940.9|40.33|0.42|51052.46

## 测试结论
Nacos服务发现性能测试都是针对重点功能，通过对3节点规模集群进行压测，可以看到接口性能负载和容量。
1. 压测容量服务数可达60W，实例注册数达110W，集群运行持续稳定，达到预期；(注: 由于本次注册实例使用的是HTTP接口, 并没有将心跳上报的TPS包括在内, 如果要支持百万实例的心跳上报, 需要集群水平扩容, 并调优tomcat和内核参数)
2. 注册/查询实例TPS达到 13000 以上，接口达到预期；

本次只测试临时实例注册/查询/注销，未涉及持久实例(后续输出)；

本测试供给大家作为参考，如有不足或偏差，请指正!
如果对性能有其他需求，可以给我们提issue。
