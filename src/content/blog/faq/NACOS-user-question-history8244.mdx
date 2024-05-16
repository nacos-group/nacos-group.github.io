---
id: "question-history-8244"
title: "Lost of nacos-grpc-executor thread park nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource Lost of nacos-grpc-executor thread park"
tags: ["nacos-grpc-executor","Lost","park"]
keywords: ["nacos-grpc-executor","Lost","park"]
---

## 用户问题 ： 
 Lost of nacos-grpc-executor thread park nacos-opensource 

---------------
## 专家官方解答 ：

首先，根据我了解的知识中的描述，出现“nacos-grpc-executor”线程数过多或线程状态为“park”的问题，可能的原因包括：

1. **系统环境问题**：程序读取到的CPU数量错误，导致线程池核心大小和最大大小过大。
2. **客户端实例管理不当**：应用中创建过多Nacos-Client实例，未复用已有的实例，或者在替换旧实例时未使用shutdown方法关闭线程池。
3. **线程池配置不合理**：默认的线程池大小设置可能与实际需求不符，特别是在高并发场景下可能导致线程数过多。

针对以上可能的原因，结合我了解的知识中给出的建议步骤，可采取以下具体排查和解决措施：

**步骤一：确认CPU数量读取是否正确**

1. 在应用程序中插入代码片段，调用`Runtime.getRuntime().availableProcessors()`，输出并记录当前应用读取到的CPU数量。
2. 与实际运行环境的CPU资源进行对比，确认读取结果是否正确。若读取数量过大，可能是系统环境问题导致。

**步骤二：检查Nacos-Client实例数量及管理**

1. 执行`jmap -histo ${pid} > histo.log`命令，生成内存实例对象分布日志文件。
2. 使用`grep "NacosNamingService" histo.log | awk '{print $2,$4}'`和`grep "NacosConfigService" histo.log | awk '{print $2,$4}'`命令，分别统计NacosNamingService和NacosConfigService实例数量。正常情况下，每个类型的服务实例数量应不超过3个。
3. 若发现实例数量过多，需深入代码审查，确保复用已有Nacos-Client实例，避免重复创建。同时，确保在替换旧实例时调用shutdown方法关闭线程池。

**步骤三：分析线程状态与数量**

1. 执行`jstack ${pid} > jstack.log`命令，获取当前线程信息日志。
2. 使用以下grep命令，分别统计各相关线程池的数量和状态：

   ```
   grep "nacos-grpc-client-executor" jstack.log
   grep "nacos.publisher-" jstack.log
   grep "com.alibaba.nacos.client.remote.worker" jstack.log
   grep "com.alibaba.nacos.client.naming.updater" jstack.log
   grep "com.alibaba.nacos.naming.push.receiver" jstack.log
   grep "com.alibaba.nacos.client.naming.grpc.redo" jstack.log
   grep "com.alibaba.nacos.client.Worker" jstack.log | grep -v "longPolling"
   grep "nacos.client.config.listener.task" jstack.log
   grep "com.alibaba.nacos.client.Worker.longPolling" jstack.log
   ```

3. 根据日志输出，检查“nacos-grpc-executor”线程数量是否超出预期（CPU数量 * 8），以及是否存在大量线程处于“park”状态。同时，核对其他线程池数量是否符合我了解的知识中提供的预期范围。

**步骤四：调整线程池配置（如有必要）**

1. 如线程数确实过多且主要集中在“nacos-grpc-client-executor”，可以尝试通过JVM参数 `-Dnacos.remote.client.grpc.pool.core.size` 和 `-Dnacos.remote.client.grpc.pool.max.size` 来自定义该线程池的核心大小和最大大小。例如：

   ```
   java -jar your-app.jar -Dnacos.remote.client.grpc.pool.core.size=10 -Dnacos.remote.client.grpc.pool.max.size=20
   ```

   这里设置的核心大小和最大大小应根据实际业务负载进行调整，以达到资源利用与性能的最佳平衡。

以上步骤旨在根据我了解的知识中提供的指导，对“nacos-grpc-executor”线程数过多或线程状态为“park”的问题进行全面排查与解决。通过确认CPU数量读取、检查Nacos-Client实例管理、分析线程状态与数量，以及（如有必要）调整线程池配置，有望定位并解决该问题。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:如何排查Nacos线程数过多的问题 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11558)给我们反馈。
