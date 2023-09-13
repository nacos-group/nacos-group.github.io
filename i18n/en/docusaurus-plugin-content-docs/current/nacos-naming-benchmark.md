---
title: Nacos service discovery performance test report
keywords: [Nacos,service,discovery,performance]
description: Nacos service discovery performance test report
---

# Nacos service discovery performance test report

## Test purposes
Main understanding Nacos service discovery performance load and capacity, to help us better manage Nacos performance quality, help users use of assessment Nacos system load faster.

## Testing tools
We use the research of PAS performance evaluation service platform for pressure measurement, the principle is based on the use of JMeter engine, the use of PAS to automatically generate the JMeter scripts, intelligent pressure measurement.

![IMAGE](https://img.alicdn.com/tfs/TB1xCfDDpzqK1RjSZFvXXcB7VXa-692-297.png)

## Test environment
### 1.environment

indicators|parameter
---|---
machine|CPU 16 nuclear, 32G memory
cluster size|3 nodes
Nacos version|1.0.0

### 2.Set the launch parameters
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

## Test scenarios
The following test scenarios are service discovery interface:
* Verify Nacos service discovery that the ability to register instance
* Verify Nacos service discovery that the ability to query instance
* Verify Nacos service discovery that the ability to delete instance

## Test data
### 1. register instance
Nacos service discovery registry instance the performance of the interface, call the HTTP interface test.
The measured 3 nodes cluster performance under different pressure:

machine*concurrency num|service num|register instance num|TPS|RT(ms)|MIN RT(ms)|MAX RT(ms)
:---:|:---:|:---:|:---:|:---:|:---:|:---:
1*100|80301|84965|1793.41|54.63|0.8|1200.86
3*50|529321|819226|12574.8|15.8|0.45|3499.59
4*50|609726|836870|13000|18.54|0.46|3038.48
4*100|777262|927169|13257|35.65|0.48|3231.2

### 2. query instance
Nacos service discovery query instance of the performance of the interface, call the HTTP interface test.
The measured 3 nodes cluster performance under different pressure:

machine*concurrency num|service num|register instance num|TPS|RT(ms)|MIN RT(ms)|MAX RT(ms)
:---:|:---:|:---:|:---:|:---:|:---:|:---:
1*100|80301|84965|3092.16|30.86|0.81|509.4
3*50|529321|819226|12574.8|15.8|0.45|3499.59
4*50|609726|836870|15603|16.41|0.42|3042.17
4*100|777262|927169|13604|34.19|0.43|3434.1

### 3. delete instance
Nacos service discovery delete instance is given to the performance of the interface, call the HTTP interface test.
The measured 3 nodes cluster performance under different pressure:

machine*concurrency num|service num|register instance num|TPS|RT(ms)|MIN RT(ms)|MAX RT(ms)
:---:|:---:|:---:|:---:|:---:|:---:|:---:
1*100|80301|84965|1118.95|14.08|0.7|597.43
3*50|529321|819226|14508.53|11.23|0.4|3274.49
4*50|609726|836870|15476.93|16.02|0.38|3106.23
4*100|777262|927169|11940.9|40.33|0.42|51052.46

## Test results
Nacos service discovery performance test is aimed at a key function, through the pressure test was carried out on the 3 nodes cluster, can see the interface performance load and capacity.
1. Service for up to 60w pressure measuring capacity, instance registered number up to 110w, cluster running steadily, the desired;(note: due to the registered instance using the HTTP interface, did not report to the heart of the TPS is included, if you want to support millions of instances of heartbeat report, need expansion and cluster level, and tuning tomcat and kernel parameters)
2. Register the TPS/query instance above 13000, interface to achieve expected;

The tests only temporary instance/query/cancellation of registration, no persistent instance (subsequent);

This test provides you as reference, if there are any deficiency or deviation, please correct me!
If you have any other requirements on the performance, can you give us the issue.
