---
title: Nacos 自研Distro协议
keywords: [ Nacos ]
description: 孙立（涌月） Nacos Commiter背景Distro 协议是 Nacos 社区自研的一种 AP 分布式协议，是面向临时实例设计的一种分布式协议，其保证了在某些 Nacos 节点宕机后，整个临时实例处理系统依旧可以正常工作。作为一种有状态的中间件应用的内嵌协议，Distro 保证了各个 N...
---
> 孙立（涌月） Nacos Commiter

<a name="iX0uo"></a>
# 背景
Distro 协议是 Nacos 社区自研的一种 AP 分布式协议，是面向临时实例设计的一种分布式协议，其保证了在某些 Nacos 节点宕机后，整个临时实例处理系统依旧可以正常工作。作为一种有状态的中间件应用的内嵌协议，Distro 保证了各个 Nacos 节点对于海量注册请求的统一协调和存储。
<a name="oLJev"></a>
# 设计思想
Distro 协议的主要设计思想如下：

- Nacos 每个节点是平等的都可以处理写请求，同时把新数据同步到其他节点。
- 每个节点只负责部分数据，定时发送自己负责数据的校验值到其他节点来保持数据一致性。
- 每个节点独立处理读请求，及时从本地发出响应。

下面几节将分为几个场景进行 Distro 协议工作原理的介绍。
<a name="EqI9f"></a>
## 数据初始化
新加入的 Distro 节点会进行全量数据拉取。具体操作是轮询所有的 Distro 节点，通过向其他的机器发送请求拉取全量数据。<br />![image.png](https://cdn.nlark.com/yuque/0/2021/png/12672987/1638841583001-44daf5c3-6d05-4d80-8b78-148adef33a3d.png#clientId=u58561f65-89e2-4&from=paste&height=199&id=igXB6&originHeight=512&originWidth=1712&originalType=binary&ratio=1&rotation=0&showTitle=false&size=93130&status=done&style=none&taskId=u7b4ebb7a-5950-410c-a43f-dc2077d08bb&title=&width=664.6533813476562)<br />在全量拉取操作完成之后，Nacos 的每台机器上都维护了当前的所有注册上来的非持久化实例数据。
<a name="Iir4J"></a>
## 数据校验
在 Distro 集群启动之后，各台机器之间会定期的发送心跳。心跳信息主要为各个机器上的所有数据的元信息（之所以使用元信息，是因为需要保证网络中数据传输的量级维持在一个较低水平）。这种数据校验会以心跳的形式进行，即每台机器在固定时间间隔会向其他机器发起一次数据校验请求。<br />![image.png](https://cdn.nlark.com/yuque/0/2021/png/12672987/1638843619177-86beba77-b5c9-481b-ad93-05cf9b98e00d.png#clientId=u13a4eb49-3e55-4&from=paste&height=98&id=u7ba66c5d&originHeight=225&originWidth=1606&originalType=binary&ratio=1&rotation=0&showTitle=false&size=65168&status=done&style=none&taskId=udbcb6f98-d6d9-4a30-8dd1-64eff794c9a&title=&width=697.0084838867188)<br />一旦在数据校验过程中，某台机器发现其他机器上的数据与本地数据不一致，则会发起一次全量拉取请求，将数据补齐。
<a name="OPU7W"></a>
## 写操作
对于一个已经启动完成的 Distro 集群，在一次客户端发起写操作的流程中，当注册非持久化的实例的写请求打到某台 Nacos 服务器时，Distro 集群处理的流程图如下。<br />![image.png](https://cdn.nlark.com/yuque/0/2021/png/12672987/1625361493653-d99a7576-ff3f-490b-89f9-0b24a42da660.png#clientId=u455654f3-35ff-4&from=paste&height=555&id=R40j5&originHeight=1110&originWidth=1840&originalType=binary&ratio=1&rotation=0&showTitle=false&size=441819&status=done&style=none&taskId=uc19c7f87-1150-415e-aae6-4f1fbfe22ef&title=&width=920)<br />整个步骤包括几个部分（图中从上到下顺序）：

- 前置的 Filter 拦截请求，并根据请求中包含的 IP 和 port 信息计算其所属的 Distro 责任节点，并将该请求转发到所属的 Distro 责任节点上。
- 责任节点上的 Controller 将写请求进行解析。
- Distro 协议定期执行 Sync 任务，将本机所负责的所有的实例信息同步到其他节点上。
<a name="WN6FV"></a>
## 读操作
由于每台机器上都存放了全量数据，因此在每一次读操作中，Distro 机器会直接从本地拉取数据。快速响应。<br />![image.png](https://cdn.nlark.com/yuque/0/2021/png/12672987/1638841839200-7897d0fc-6788-4296-b69b-1b5081d7e109.png#clientId=u58561f65-89e2-4&from=paste&height=217&id=u336e7e64&originHeight=548&originWidth=1716&originalType=binary&ratio=1&rotation=0&showTitle=false&size=96006&status=done&style=none&taskId=udb92b925-90ea-4f09-b2a6-c9e0159fc0f&title=&width=680.9801025390625)<br />这种机制保证了 Distro 协议可以作为一种 AP 协议，对于读操作都进行及时的响应。在网络分区的情况下，对于所有的读操作也能够正常返回；当网络恢复时，各个 Distro 节点会把各数据分片的数据进行合并恢复。
<a name="b4Qz5"></a>
# 小结
Distro 协议是 Nacos 对于临时实例数据开发的一致性协议。其数据存储在缓存中，并且会在启动时进行全量数据同步，并定期进行数据校验。<br />在 Distro 协议的设计思想下，每个 Distro 节点都可以接收到读写请求。所有的 Distro 协议的请求场景主要分为三种情况：<br />1、当该节点接收到属于该节点负责的实例的写请求时，直接写入。<br />2、当该节点接收到不属于该节点负责的实例的写请求时，将在集群内部路由，转发给对应的节点，从而完成读写。<br />3、当该节点接收到任何读请求时，都直接在本机查询并返回（因为所有实例都被同步到了每台机器上）。<br />Distro 协议作为 Nacos 的内嵌临时实例一致性协议，保证了在分布式环境下每个节点上面的服务信息的状态都能够及时地通知其他节点，可以维持数十万量级服务实例的存储和一致性。


