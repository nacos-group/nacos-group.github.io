---
title: Nacos 通信通道
keywords: [ Nacos ]
description: 柳遵飞（翼严） Nacos commiterNacos长链接一.现状背景Nacos 1.X 版本 Config/Naming 模块各自的推送通道都是按照自己的设计模型来实现的。产品推送模型数据一致性痛点说明Nacos Config   异步 Servlet基于MD5比对一致性http短连接，3...
---
> 柳遵飞（翼严） Nacos commiter

<a name="article-title"></a>
# Nacos长链接
<a name="7MQg6"></a>
## 一.现状背景
Nacos 1.X 版本 Config/Naming 模块各自的推送通道都是按照自己的设计模型来实现的。

| 产品 | 推送模型 | 数据一致性 | 痛点 | 说明 |
| --- | --- | --- | --- | --- |
| Nacos Config |    异步 Servlet | 基于MD5比对一致性 | http短连接，30秒定期创建销毁连接，GC压力大 | md5值计算也有一定开销，在可接受范围内 |
| Nacos Naming | HTTP/UDP | UDP 推送 + 补偿查询 | 丢包，云架构下无法反向推送 |  |

配置和服务器模块的数据推送通道不统一，http 短连接性能压力巨大，未来 Nacos 需要构建能够同时支持配置以及服务的长链接通道，以标准的通信模型重构推送通道。

<a name="EDQUQ"></a>
## 二.场景分析
<a name="mAUIB"></a>
### 1.配置
配置对连接的场景诉求分析<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/2393712/1600395186025-dea5786a-76d2-4120-ab52-755cc8d8ff84.png#height=532&id=BMpbG&originHeight=1064&originWidth=1878&originalType=binary&ratio=1&rotation=0&showTitle=false&size=456691&status=done&style=none&title=&width=939)

   - SDK 和 Server 之间
      - 客户端 SDK 需要感知服务节点列表，并按照某种策略选择其中一个节点进行连接；底层连接断开时，需要进行切换Server进行重连。
      - 客户端基于当前可用的长链接进行配置的查询，发布，删除，监听，取消监听等配置领域的 RPC 语意接口通信。
      - 感知配置变更消息，需要将配置变更消息通知推送当前监听的客户端；网络不稳定时，客户端接收失败，需要支持重推，并告警。
      - 感知客户端连接断开事件，将连接注销，并且清空连接对应的上下文，比如监听信息上下文清理。
   - Server 之间通信
      - 单个 Server 需要获取到集群的所有 Server 间的列表，并且为每一个 Server 创建独立的长链接；连接断开时，需要进行重连，服务端列表发生变更时，需要创建新节点的长链接，销毁下线的节点长链接
      - Server 间需要进行数据同步，包括配置变更信息同步,当前连接数信息，系统负载信息同步，负载调节信息同步等。

<a name="ybfau"></a>
### 2.服务

   - SDK 和 Server 之间
      - 客户端 SDK 需要感知服务节点列表，并按照某种策略选择其中一个节点进行连接；底层连接断开时，需要切换 Server 进行重连。
      - 客户端基于当前可用的长链接进行配置的查询，注册，注销，订阅，取消订阅等服务发现领域的RPC 语意接口通信。
      - 感知服务变更，有服务数据发生变更，服务端需要推送新数据到客户端；需要有推送 ack，方便服务端进行 metrics 和重推判定等。
      - 感知客户端连接断开事件，将连接注销，并且清空连接对应的上下文，比如该客户端连接注册的服务和订阅的服务。
   - Server 之间通信
      - 服务端之间需要通过长连接感知对端存活状态，需要通过长连接汇报服务状态（同步 RPC 能力）
      - 服务端之间进行 AP Distro 数据同步，需要异步 RPC 带 ack 能力。

<a name="0GNpg"></a>
## 三. 长链接核心诉求


![image.png](https://cdn.nlark.com/yuque/0/2020/png/2393712/1600395185991-1f3e243e-0e67-4c13-a216-b1ccfa0d5687.png#height=492&id=mhZGA&originHeight=984&originWidth=2198&originalType=binary&ratio=1&rotation=0&showTitle=false&size=524396&status=done&style=none&title=&width=1099)
<a name="AlAXh"></a>
### 1.功能性诉求
<a name="cCosH"></a>
#### 客户端

- 连接生命周期实时感知能力，包括连接建立，连接断开事件
- 客户端调用服务端支持同步阻塞，异步future，异步 callback 三种模式
- 底层连接自动切换能力
- 响应服务端连接重置消息进行连接切换
- 选址/服务发现
<a name="NCCFU"></a>
#### 服务端

- 连接生命周期实时感知能力，包括连接建立，连接断开事件
- 服务端往客户端主动进行数据推送，需要客户端进行 Ack 返回以支持可靠推送,并且需要进行失败重试
- 服务端主动推送负载调节能力

<a name="e7LuZ"></a>
### 2.性能要求
性能方面，需要能够满足阿里的生产环境可用性要求，能够支持百万级的长链接规模及请求量和推送量，并且要保证足够稳定。
<a name="Pan2f"></a>
### 3.负载均衡

   - 常见的负载均衡策略：随机，hash，轮询，权重，最小连接数，最快响应速度等
   - 短连接和长链接负载均衡的异同：在短连接中，因为连接快速建立销毁，“随机，hash，轮询，权重”四种方式大致能够保持整体是均衡的，服务端重启也不会影响整体均衡，其中“最小连接数，最快响应速度”是有状态的算法，因为数据延时容易造成堆积效应；长连接因为建立连接后，如果没有异常情况出现，连接会一直保持，断连后需要重新选择一个新的服务节点，当出现服务节点发布重启后，最终连接会出现不均衡的情况出现，“随机，轮询，权重”的策略在客户端重连切换时可以使用，“最小连接数，最快响应速度”和短连接一样也会出现数据延时造成堆积效应。长连接和短连接的一个主要差别在于在整体连接稳定时，服务端需要一个rebalance的机制，将集群视角的连接数重新洗牌分配，趋向另外一种稳态

   - 客户端随机+服务端柔性调整

核心的策略是客户端+服务端双向调节策略，客户端随机选择+服务端运行时柔性调整。![image.png](https://cdn.nlark.com/yuque/0/2020/png/2393712/1600395186004-7ffd22dd-2a55-4c58-9388-3d78425762a1.png#height=524&id=nBsrz&originHeight=1048&originWidth=2076&originalType=binary&ratio=1&rotation=0&showTitle=false&size=684496&status=done&style=none&title=&width=1038)
<a name="glHw8"></a>
#### 客户端随机   

   - 客户端在启动时获取服务列表，按照随机规则进行节点选择，逻辑比较简单，整体能够保持随机。
<a name="YyNzk"></a>
#### 服务端柔性调整

   - (当前实现版本)人工管控方案：集群视角的系统负载控制台，提供连接数，负载等视图(扩展新增连接数，负载，CPU 等信息，集群间 report 同步)，实现人工调节每个 Server 节点的连接数，人工触发reblance，人工削峰填谷
      - 提供集群视角的负载控制台：展示 总节点数量，总长链接数量，平均数量，系统负载信息
      - 每个节点的地址，长链接数量，与平均数量的差值，正负值
      - 对高于平均值的节点进行数量调控，设置数量上限(临时和持久化)，并可指定服务节点进行切换
   - (未来终态版本)自动化管控方案：基于每个 server 间连接数及负载自动计算节点合理连接数，自动触发reblance，自动削峰填谷。实现周期较长，比较依赖算法准确性。
<a name="McShT"></a>
### 3.连接生命周期
<a name="0KfPN"></a>
#### 心跳保活机制
![image.png](https://cdn.nlark.com/yuque/0/2020/png/2393712/1600395186107-0a4be353-a068-42d0-8117-e5089dc5d370.png#height=469&id=oHGhB&originHeight=938&originWidth=1166&originalType=binary&ratio=1&rotation=0&showTitle=false&size=277415&status=done&style=none&title=&width=583)

| 类型 |  | TCP | netty | mina | grpc | rsocket | tb remote |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 心跳保活机制 |  | keepalive机制：通道无读写事件时，发送心跳包检测，可设置超时时间，间隔次数 | 1.设置TCP参数<br />2.自定义心跳IdeHandler，监听通道读写事件 | 1.自定义心跳，KeepAliveFilter | 1.自定义心跳，ping-pong包探测 | 1.自定义keep alive机制 | 基于mina，KeepAliveFilter |
| 事件通知 | 正常关闭 | 有事件通知 | 有事件通知 | 有事件通知 | 有事件通知 | 有事件通知 | 有事件通知 |
|  | 断网异常 | keep alive机制，有事件通知 | tpc及自定义心跳，有事件通知 | 自定义心跳，有事件通知 | 自定义心跳，ping-pong包探测，无事件通知 | 1.自定义心跳，有事件通知 | 自定义心跳，有事件通知 |


参考：理解 TCP Keepalive: [https://blog.csdn.net/chrisnotfound/article/details/80111559](https://blog.csdn.net/chrisnotfound/article/details/80111559)<br />   grpc keepalive ：[https://blog.csdn.net/zhaominpro/article/details/103127023](https://blog.csdn.net/zhaominpro/article/details/103127023)<br />   netty 的心跳检测：[https://www.cnblogs.com/rickiyang/p/12792120.html](https://www.cnblogs.com/rickiyang/p/12792120.html)
<a name="eLkYg"></a>
####       我们需要什么 

      1. 低成本快速感知：客户端需要在服务端不可用时尽快地切换到新的服务节点，降低不可用时间，并且能够感知底层连接切换事件，重置上下文；服务端需要在客户端断开连接时剔除客户端连接对应的上下文，包括配置监听，服务订阅上下文，并且处理客户端连接对应的实例上下线。
         1. 客户端正常重启：客户端主动关闭连接，服务端实时感知
         2. 服务端正常重启 : 服务端主动关闭连接，客户端实时感知
      2. 防抖：
         1. 网络短暂不可用: 客户端需要能接受短暂网络抖动，需要一定重试机制，防止集群抖动，超过阈值后需要自动切换server，但要防止请求风暴。
      3. 断网演练：断网场景下，以合理的频率进行重试，断网结束时可以快速重连恢复。
<a name="ipRMQ"></a>
### 5.安全性
支持基础的鉴权，数据加密能力
<a name="zSOZl"></a>
### 6.低成本多语言实现
在客户端层面要尽可能多的支持多语言，至少要支持一个 Java 服务端连接通道，可以使用多个主流语言的客户端进行访问，并且要考虑各种语言实现的成本，双边交互上要考虑 thin sdk，降低多语言实现成本。
<a name="VeBD4"></a>
### 7.开源社区
文档，开源社区活跃度，使用用户数等，面向未来是否有足够的支持度。

<a name="UAbkR"></a>
## 四.长链接选型对比

| <br /> | <br /> | grpc | WebSocket | tbremote | Rsocket | netty | mina |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 客户端通信 | sync | 支持 | 支持 | 支持 | 支持 | 无rpc语意 | 无rpc语意 |
|  | future | 支持 | 不支持 | 支持 | 支持 | 无rpc语意 | 无rpc语意 |
|  | callback | 结合 guava实现 | 不支持 | 支持 | 支持<br />(依赖jdk 1.8+ completableFuture） | 无rpc语意 | 无rpc语意 |
| 服务端推送 | sync | 无ack | 支持 | 支持 | 支持 | 无rpc语意 | 无rpc语意 |
|  | future | 不支持 | 支持 | 支持 | 支持 | 无rpc语意 | 无rpc语意 |
|  | callback | 不支持 | 支持 | 支持 | 支持 | 无rpc语意 | 无rpc语意 |
| 连接生命周期 | 客户端感知断连 | 无<br />(基于stream流 error complete事件可实现) | 支持 | 支持 | 支持 | 支持 | 支持 |
|  | 服务端感知断连 | 支持<br />（官方不建议使用） | 支持 | 支持 | 支持 | 支持 | 支持 |
|  | 心跳保活 | 应用层自定义，ping-pong消息 |  | 应用层自定义，单byte ack | 自定义keepalive frame | TCP+ 自定义 | 自定义 keepalive filter |
| 性能 | tps |  |  |  |  |  |  |
| 安全性 |  | TLS | TLS |  TLS | TLS | TLS | TLS |
| 多语言支持 | JAVA | 支持 | 不支持 | 支持 | 支持<br />1.8+<br />占比>93% | 支持 | 支持 |
|  | GO | 支持 | 不支持 | 支持 | 支持<br />1.12+<br />占比>93% | 无 | 无 |
|  | C++ | 支持 | 不支持 | 支持 | 支持<br />14+<br />占比 >60% | 无 | 无 |
|  | C# | 支持 | 不支持 | 不支持 | 支持 | 无 | 无 |
|  | Node.js | 支持 | 不支持 | 支持 | 支持 | 无 | 无 |
|  | JS | 支持 | 支持 | 不支持 | 支持 | 无 | 无 |
|  | Ruby | 支持 | 不支持 | 不支持 | 支持 | 无 | 无 |
|  | Python | 支持 | 不支持 | 不支持 | 支持<br />3.6+<br />>96% | 无 | 无 |
|  | Kotlin | 支持 | 不支持 | 不支持 | 支持 | 无 | 无 |
|  | rust |  |  |  | 支持<br /> 1.39+ |  |  |
|  | dart |  |  |  | 支持<br />2.6 |  |  |
| 其他 | Github Star/Issue | 最高go版本：11.9K/124 issue | <br /> | <br /> | 最高java版本：1.8/47 issue | <br /> | <br /> |
| 备注 |  | 服务端推送Ack自建 |  | 阿里内部基于mina实现的私有协议 | rsocket私有协议，社区活跃度，用户数一般 | 需要自定义rpc协议 | 需要自定义rpc协议 |


在当前的备选框架中，从功能的契合度上，Rsocket 比较贴切我们的功能性诉求，性能上比 grpc 要强一些，开源社区的活跃度上相对grpc要逊色很多。<br />版本分布参考：[https://blog.csdn.net/sinat_33224091/article/details/105002276](https://blog.csdn.net/sinat_33224091/article/details/105002276)<br />C++：[https://www.jetbrains.com/zh-cn/lp/devecosystem-2020/cpp/](https://www.jetbrains.com/zh-cn/lp/devecosystem-2020/cpp/)<br />JAVA [https://www.jetbrains.com/zh-cn/lp/devecosystem-2020/java/](https://www.jetbrains.com/zh-cn/lp/devecosystem-2020/java/)<br />GO：[https://www.sohu.com/a/390826880_268033](https://www.sohu.com/a/390826880_268033)
<a name="cvz09"></a>
## 五.基于长链接的一致性模型
<a name="mpvQv"></a>
### 1.配置一致性模型
<a name="DfK62"></a>
#### i.sdk-server一致性
![image.png](https://cdn.nlark.com/yuque/0/2020/png/2393712/1600395186021-c3245860-99fe-4a65-a1c5-16ebd5b4d837.png#height=1446&id=CHRhe&originHeight=1446&originWidth=1458&originalType=binary&ratio=1&rotation=0&showTitle=false&size=128673&status=done&style=none&title=&width=1458)
<a name="CfXMy"></a>
#### ii.server间一致性
![image.png](https://cdn.nlark.com/yuque/0/2020/png/2393712/1600395186027-e30e457e-c16a-483a-b6ff-2333951f496d.png#height=492&id=R8MUw&originHeight=492&originWidth=773&originalType=binary&ratio=1&rotation=0&showTitle=false&size=28386&status=done&style=none&title=&width=773)<br />*Server 间同步消息接收处理轻量级实现，重试失败时，监控告警<br />*断网：断网太久，重试任务队列爆满时，无剔除策略
<a name="L6DA6"></a>
### 2.服务一致性模型
<a name="80qXb"></a>
#### i. sdk-server 间一致性
![image.png](https://cdn.nlark.com/yuque/0/2020/png/2393712/1600395186061-f575ffcd-3882-4d62-b5ca-c66779f8782b.png#height=1020&id=gLOa3&originHeight=1020&originWidth=1654&originalType=binary&ratio=1&rotation=0&showTitle=false&size=560676&status=done&style=none&title=&width=1654)
<a name="xvJyY"></a>
#### ii.server 间一致性

![image.png](https://cdn.nlark.com/yuque/0/2020/png/2393712/1600395186069-3ea02d45-9f01-442a-abdf-2b4c05fbc81d.png#height=1034&id=QHDh8&originHeight=1034&originWidth=1978&originalType=binary&ratio=1&rotation=0&showTitle=false&size=468248&status=done&style=none&title=&width=1978)<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/2393712/1600395186085-75018d86-97cb-44a6-b619-5b658e42e954.png#height=736&id=JOmdy&originHeight=736&originWidth=1580&originalType=binary&ratio=1&rotation=0&showTitle=false&size=364202&status=done&style=none&title=&width=1580)

<a name="tMbuz"></a>
##  六.核心模型组件设计
![image.png](https://cdn.nlark.com/yuque/0/2020/png/2393712/1600395186065-51216d74-eef6-458c-8cea-9a34b139d47f.png#height=1321&id=Enq4N&originHeight=1321&originWidth=1981&originalType=binary&ratio=1&rotation=0&showTitle=false&size=263031&status=done&style=none&title=&width=1981)
