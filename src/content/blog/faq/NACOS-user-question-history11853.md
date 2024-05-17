---
id: "question-history-11853"
title: "Nacos 我用三个节点组成nacos集群，其中有一个节点挂掉了，重启之后发现和另外两个数据不一致，就是在这个节点的web界面修改服务权重后，刷新不生效，但是其他两个生效了，日志报错ERROR [DISTRO-INIT] load snapshot Nacos:Naming:v2:ClientData from 10.111.107.10:8878 failed.com.alibaba.nacos.core.distributed.distro.exception.DistroException: [DISTRO-EXCEPTION][DISTRO] Cancel get snapshot caused by target server 10.111.107.10:8878 unhealthyat com.alibaba.nacos.naming.consistency.ephemeral.distro.v2.DistroClientTransportAgent.getDatumSnapshot(DistroClientTransportAgent.java:190)at com.alibaba.nacos.core.distributed.distro.task.load.DistroLoadDataTask.loadAllDataSnapshotFromRemote(DistroLoadDataTask.java:104)at com.alibaba.nacos.core.distributed.distro.task.load.DistroLoadDataTask.load(DistroLoadDataTask.java:87)at com.alibaba.nacos.core.distributed.distro.task.load.DistroLoadDataTask.run(DistroLoadDataTask.java:63)at java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:511)at java.util.concurrent.FutureTask.run(FutureTask.java:266)at java.util.concurrent.ScheduledThreadPoolExecutor$ScheduledFutureTask.access$201(ScheduledThreadPoolExecutor.java:180)at java.util.concurrent.ScheduledThreadPoolExecutor$ScheduledFutureTask.run(ScheduledThreadPoolExecutor.java:293)at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149)at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)at java.lang.Thread.run(Thread.java:748) nacos-opensource"
date: "2024-04-25"
category: expertConsultation
description: "nacos-opensource Nacos 我用三个节点组成nacos集群，其中有一个节点挂掉了，重启之后发现和另外两个数据不一致，就是在这个节点的web界面修改服务权重后，刷新不生效，但是其他两个生效了，日志报错ERROR [DISTRO-INIT] load snapshot Nacos:Naming:v2:ClientData from 10.111.107.10:8878 failed.com.alibaba.nacos.core.distributed.distro.exception.DistroException: [DISTRO-EXCEPTION][DISTRO] Cancel get snapshot caused by target server 10.111.107.10:8878 unhealthyat com.alibaba.nacos.naming.consistency.ephemeral.distro.v2.DistroClientTransportAgent.getDatumSnapshot(DistroClientTransportAgent.java:190)at com.alibaba.nacos.core.distributed.distro.task.load.DistroLoadDataTask.loadAllDataSnapshotFromRemote(DistroLoadDataTask.java:104)at com.alibaba.nacos.core.distributed.distro.task.load.DistroLoadDataTask.load(DistroLoadDataTask.java:87)at com.alibaba.nacos.core.distributed.distro.task.load.DistroLoadDataTask.run(DistroLoadDataTask.java:63)at java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:511)at java.util.concurrent.FutureTask.run(FutureTask.java:266)at java.util.concurrent.ScheduledThreadPoolExecutor$ScheduledFutureTask.access$201(ScheduledThreadPoolExecutor.java:180)at java.util.concurrent.ScheduledThreadPoolExecutor$ScheduledFutureTask.run(ScheduledThreadPoolExecutor.java:293)at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149)at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)at java.lang.Thread.run(Thread.java:748)"
tags: ["集群","节点挂掉","重启","数据不一致","服务权重","web界面","刷新不生效","其他两个生效","日志报错","ERROR","DISTRO-INIT","load snapshot","Nacos:Naming:v2:ClientData","10.111.107.10:8878","failed","DistroException","DISTRO-EXCEPTION","DISTRO","Cancel get snapshot","target server unhealthy","DistroClientTransportAgent","getDatumSnapshot","DistroLoadDataTask","loadAllDataSnapshotFromRemote","load","run","Executors","RunnableAdapter","FutureTask","ScheduledThreadPoolExecutor","ScheduledFutureTask","access","ThreadPoolExecutor","Worker","Thread"]
keywords: ["集群","节点挂掉","重启","数据不一致","服务权重","web界面","刷新不生效","其他两个生效","日志报错","ERROR","DISTRO-INIT","load snapshot","Nacos:Naming:v2:ClientData","10.111.107.10:8878","failed","DistroException","DISTRO-EXCEPTION","DISTRO","Cancel get snapshot","target server unhealthy","DistroClientTransportAgent","getDatumSnapshot","DistroLoadDataTask","loadAllDataSnapshotFromRemote","load","run","Executors","RunnableAdapter","FutureTask","ScheduledThreadPoolExecutor","ScheduledFutureTask","access","ThreadPoolExecutor","Worker","Thread"]
---

## 用户问题 ： 
 Nacos 我用三个节点组成nacos集群，其中有一个节点挂掉了，重启之后发现和另外两个数据不一致，就是在这个节点的web界面修改服务权重后，刷新不生效，但是其他两个生效了，日志报错ERROR [DISTRO-INIT] load snapshot Nacos:Naming:v2:ClientData from 10.111.107.10:8878 failed.

com.alibaba.nacos.core.distributed.distro.exception.DistroException: [DISTRO-EXCEPTION][DISTRO] Cancel get snapshot caused by target server 10.111.107.10:8878 unhealthy
at com.alibaba.nacos.naming.consistency.ephemeral.distro.v2.DistroClientTransportAgent.getDatumSnapshot(DistroClientTransportAgent.java:190)
at com.alibaba.nacos.core.distributed.distro.task.load.DistroLoadDataTask.loadAllDataSnapshotFromRemote(DistroLoadDataTask.java:104)
at com.alibaba.nacos.core.distributed.distro.task.load.DistroLoadDataTask.load(DistroLoadDataTask.java:87)
at com.alibaba.nacos.core.distributed.distro.task.load.DistroLoadDataTask.run(DistroLoadDataTask.java:63)
at java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:511)
at java.util.concurrent.FutureTask.run(FutureTask.java:266)
at java.util.concurrent.ScheduledThreadPoolExecutor$ScheduledFutureTask.access$201(ScheduledThreadPoolExecutor.java:180)
at java.util.concurrent.ScheduledThreadPoolExecutor$ScheduledFutureTask.run(ScheduledThreadPoolExecutor.java:293)
at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149)
at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)
at java.lang.Thread.run(Thread.java:748)

 nacos-opensource 

---------------
## 专家官方解答 ：

问题原因：
根据您提供的日志报错信息和描述，问题可归结为以下几点：

1. **节点挂掉与重启**：您的Nacos集群中有一个节点经历了挂掉并随后重启的过程。
2. **数据不一致**：重启后的节点与集群中其他两个节点的数据不一致，具体表现为在这个节点的Web界面修改服务权重后，刷新不生效，而其他两个节点上的服务权重修改可以正常生效。
3. **日志报错**：日志中显示了`ERROR [DISTRO-INIT] load snapshot Nacos:Naming:v2:ClientData from 10.111.107.10:8878 failed`，提示在从`10.111.107.10:8878`节点加载快照数据时失败，原因是该目标服务器被识别为不健康。

结合我了解的知识中的内容，问题原因与日志报错直接对应于第1篇参考内容中的问题现象和原因分析。即在节点启动时，由于目标节点`10.111.107.10:8878`不健康，导致无法成功加载其快照数据进行数据初始化，从而造成重启节点与集群其他节点数据不一致。

解决方案步骤：

1. **检查目标节点状态**：
   - 使用`ping`或`telnet`命令，从报错节点上尝试访问目标节点`10.111.107.10:8878`，以确认网络是否存在故障。
   - 在目标节点上同样执行`ping`或`telnet`命令，检测与报错节点间的通信是否正常。

2. **排查节点健康状况**：
   - 查看目标节点（`10.111.107.10:8878`）的日志，如`nacos-cluster.log`，查找是否存在异常报错，以确定其不健康的具体原因。
   - 检查目标节点的资源使用情况（如CPU、内存），确保其性能和稳定性，如有必要，调整配置规格。

3. **确认集群配置一致性**：
   - 检查集群内所有节点的`cluster.conf`文件和`application.properties`文件，确保它们内容一致。如果通过环境变量或JVM参数设置相关信息，请同步检查这些设置的一致性。
   - 确认各节点之间的网络通信是否正常，尤其是8848端口、9849端口、7848端口（默认配置）的双向互通。
   - 查看`alipay-jraft.log`、`protocol-distro.log`、`protocol-raft.log`等日志，验证集群间通信是否存在问题。

4. **修复问题与重新同步数据**：
   - 根据上述排查结果，针对性地修复网络故障、配置错误或目标节点健康问题。
   - 修复完成后，重启受影响的Nacos节点，使其重新尝试从健康节点加载快照数据进行数据同步。

通过执行以上步骤，您应能定位并解决Nacos集群中节点数据不一致的问题，确保服务权重等配置在所有节点上的一致性。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:日志报错ERROR [DISTRO-INIT] load snapshot Nacos:Naming:v2:ClientData from 10.111.107.10:8878 failed. com.alibaba.nacos.core.distribu 
 
 *专家经验:Nacos 扩缩容问题 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11856)给我们反馈。
