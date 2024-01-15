---
title: Nacos 2.0 升级前后性能对比压测
keywords: [2, 性能测试, 性能对比]
description: Nacos2.0通过升级通信协议和框架、数据模型的方式将性能提升了约10倍，解决继 Nacos 1.0 发布逐步暴露的性能问题。本文通过压测 Nacos1.0，Nacos1.0升级Nacos2.0过程中，Nacos2.0 进行全面性能对比，直观的展示Nacos2.0所带来的性能提升。
date: "2021-07-29"
category: article
---

# Nacos 2.0 升级前后性能对比压测

Nacos2.0通过升级通信协议和框架、数据模型的方式将性能提升了约10倍，解决继 Nacos 1.0 发布逐步暴露的性能问题。本文通过压测 Nacos1.0，Nacos1.0升级Nacos2.0过程中，Nacos2.0 进行全面性能对比，直观的展示Nacos2.0所带来的性能提升。

## 压测准备

### 环境准备

为了方便Nacos部署升级和展示核心性能指标，我们是从[阿里云微服务引擎MSE](https://cn.aliyun.com/product/aliware/mse)中购买的一个2核CPU+4G内存的三节点Nacos集群。

### 压测模型

为了展示不同规模下的系统表现，我们采用逐步增压的方式进行压测，将压力分为3个批次进行逐步启动，并观察每个批次下集群的运行表现。同时会在压力集群之外，再增加一个Dubbo服务的Demo，并使用Jmeter以100TPS的压力不停的调用，以模拟不同压力下，对实际业务调用存在的可能影响。

压测过程中，会在适当的时候对服务端和客户端进行升级；服务端的升级将直接使用MSE提供的一键升级功能，客户端的升级会使用分批次轮流重启的方式进行。

![压测模型](/img/blog/performance-compare/performance_model.jpg)

## 压测过程

### Nacos1.X Server + Nacos1.X Client

首先启动第一批施压集群，对MSE Nacos1.2.1进行施压，在6000个Providers的压力下，集群稳定时CPU大约25%，能够稳定保持6000实例。

![1.X6000实例CPU](/img/blog/performance-compare/1_6000_cpu.jpg)
![1.X6000实例](/img/blog/performance-compare/1_6000_instance.jpg)

随后启动第二批施压集群，增加4000个Provider，合集10000个Provider。此时集群峰值CPU已经达到60%，稳定运行时大约在45%左右，集群能够稳定运行。

![1.X10000实例CPU](/img/blog/performance-compare/1_10000_cpu.jpg)
![1.X10000实例](/img/blog/performance-compare/1_10000_instance.jpg)

在前两批的压力下，集群没有出现稳定性问题，所以Dubbo的调用保持正常，没有错误发生。

![1.X10000实例Dubbo](/img/blog/performance-compare/1_10000_dubbo.png)

当第三批施压集群启动之后，压力总计14000个Provider。此时集群先是短暂的注册到13000个实例，之后很快出现实例数下跌，CPU跑满的问题。并且缩小时间范围可以看到，下跌后的实例仍然在小范围抖动。

![1.X14000实例CPU](/img/blog/performance-compare/1_14000_cpu.jpg)
![1.X14000实例](/img/blog/performance-compare/1_14000_instance.jpg)
![1.X14000实例抖动](/img/blog/performance-compare/1_14000_instance_shake.jpg)

同时Dubbo的调用出现错误，从Consumer的日志可以看出，是由于服务端无法支撑这个级别的压力，导致Dubbo Provider被摘除，所以调用的时候出现了`No provider`的错误。

![1.X14000实例Dubbo](/img/blog/performance-compare/1_14000_dubbo.png)
![1.X14000实例Dubbo错误](/img/blog/performance-compare/1_14000_dubbo_error.jpg)

### Nacos2.X Server + Nacos1.X Client

由于服务端升级期间，会进行实例的双写操作，因此在升级过程中服务端存储的实例数会是实际实例值的两倍。根据上述测试结果，需要先将实例数回滚回第一批6000实例之后，或是升级配置扩容机器之后再尝试升级。本文使用回滚压力的方式，先停止后启动的施压集群。让集群恢复正常后再执行升级。

![升级前6000实例CPU](/img/blog/performance-compare/before_upgrade_cpu.jpg)
![升级前6000实例](/img/blog/performance-compare/before_upgrade_instance.jpg)
![升级前6000实例Dubbo](/img/blog/performance-compare/before_upgrade_dubbo.png)

从监控图中可以看出，在停止后两批压力后，集群很快就恢复到了正常，运行稳定，Dubbo调用也恢复正常。之后使用MSE的升级功能，进行升级。升级过程中由于双写的性能损耗，导致CPU有较大的抖动；而且因为双写导致的实例数翻倍，实际上相当于12000实例的极限压力，服务端仍然有一定的抖动，因此导致了些许Dubbo的错误。若是在非极限压力下升级，将不会有此影响。

![升级后14000实例CPU](/img/blog/performance-compare/upgrading_cpu.jpg)
![升级后14000实例](/img/blog/performance-compare/upgrading_instance.jpg)
![升级后14000实例Dubbo](/img/blog/performance-compare/upgrading_dubbo.png)

随着服务端升级完成停止双写，消除了双写带来的性能损耗，CPU使用降低并趋于稳定，同时实例数也不再抖动，Dubbo调用完全恢复；如同1.X服务端一样，分两个批次启动施压集群，对比两个版本间在相同压力下的性能表现。

![升级后14000实例CPU](/img/blog/performance-compare/after_upgrade_cpu.jpg)
![升级后14000实例](/img/blog/performance-compare/after_upgrade_instance.jpg)
![升级后14000实例Dubbo](/img/blog/performance-compare/after_upgrade_dubbo.png)

由于客户端依旧使用的是1.X的客户端，服务端的使用水位依然非常高，在全部压力启动后，CPU几乎达到100%；虽然没有像1.X服务端一样，出现大规模实例下跌，但是运行一段时间后依旧有少量的实例抖动，说明仅升级Nacos服务端到2.0版本能有一定的改善，但是没有彻底解决性能问题。

![升级后14000实例抖动](/img/blog/performance-compare/after_upgrade_instance_shake.jpg)

### Nacos2.X Server + Nacos2.X Client

为了完全释放Nacos2.0的性能，还需要将施压集群的客户端也升级到2.0以上版本。同样将分3个批次进行替换，期间由于Provider进行了重启，服务端有出现实例的下跌再恢复属于正常现象。随着施压集群的升级，可以发现CPU有了非常明显的下降，最终达到稳定时，CPU由最初的接近100%，降低到20%，集群稳定运行14000个实例。

![2.X14000实例CPU](/img/blog/performance-compare/2_14000_cpu.jpg)
![2.X14000实例](/img/blog/performance-compare/2_14000_instance.jpg)
![2.X14000实例Dubbo](/img/blog/performance-compare/2_14000_dubbo.png)

## 压测结果

如上所述，我们能够得到`2核CPU+4G内存`的三节点集群在不同版本下的性能差异：

| 服务端版本 | 客户端版本 | 压力规模 | 集群稳定性 | CPU使用 |
| -------- | -------- | -------- | -------- | -------- |
| Nacos1.X | Nacos1.X | 14000 | 完全不稳定 | 100% |
| Nacos2.X（升级中） | Nacos1.X | 6000 | 有一定抖动 | 100% |
| Nacos2.X | Nacos1.X | 14000 | 有一定抖动 | 100% |
| Nacos2.X | Nacos2.X | 14000 | 稳定 | 20% |

由此可见，Nacos2.0确实对性能有较大的提升，新用户建议直接全部采用Nacos2.0，老用户建议先升级Server端，然后在逐步升级客户端释放红利。最后从整个压测视角的监控，来直观的感受一下不同版本在不同阶段的性能表现：

![监控纵览](/img/blog/performance-compare/all.jpg)
