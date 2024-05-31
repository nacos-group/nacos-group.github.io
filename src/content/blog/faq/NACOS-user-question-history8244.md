---
id: "question-history-8244"
title: "Lost of nacos-grpc-executor thread park nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "分析问题原因：当遇到“nacos-grpc-executor thread park”现象时，这通常意味着Nacos客户端或服务端的gRPC线程池中的线程处于空闲等待状态。根据提供的知识内容，我们可以从以下几个方面分析此问题的原因：1. **线程池配置不当**：如果线程池的核心线程数（core si"
tags: ["nacos-grpc-executor","thread park"]
keywords: ["nacos-grpc-executor","thread park"]
---

分析问题原因：

当遇到“nacos-grpc-executor thread park”现象时，这通常意味着Nacos客户端或服务端的gRPC线程池中的线程处于空闲等待状态。根据提供的知识内容，我们可以从以下几个方面分析此问题的原因：

1. **线程池配置不当**：如果线程池的核心线程数（core size）和最大线程数（max size）配置得过高，可能会导致大量的线程被创建并处于空闲等待状态。特别是当客户端或服务端的请求量并不高时，过量的线程会占用资源而不执行任务。

2. **TCP连接假死或健康检查机制**：Nacos客户端与服务端之间通过gRPC通信，维护了一套健康检查机制，以`HealthCheckRequest`定期验证连接的活性。若网络状况不佳或服务端响应延迟，可能导致这些检查请求超时，线程在等待响应过程中被挂起。

3. **应用配置或环境因素**：应用程序可能误读了CPU数量，导致线程池规模按错误的CPU基数计算，进而创建了过多的线程。此外，在容器化环境中，尤其需要注意资源限制和环境变量配置，以免影响线程池的正确初始化。

解决步骤：

1. **检查线程池配置**：
   - 确认应用启动参数中是否正确设置了`-Dnacos.remote.client.grpc.pool.core.size`和`-Dnacos.remote.client.grpc.pool.max.size`，确保它们根据实际负载进行了合理配置。如果未设置，考虑根据实际情况调整这些值，避免过多空闲线程。

2. **监控与日志分析**：
   - 使用`jstack`命令导出当前线程堆栈，分析`nacos-grpc-client-executor`线程的状态，确认它们是否因为等待特定操作（如网络IO）而被挂起。
   - 检查`HealthCheckRequest`的配置（通过`nacos.remote.client.grpc.health.retry`和`nacos.remote.client.grpc.health.timeout`），确认健康检查的频率和超时设置是否合理，避免因频繁检查导致的线程挂起。

3. **环境与资源校验**：
   - 在容器环境下，使用`Runtime.getRuntime().availableProcessors()`确认应用读取到的CPU数量是否正确，必要时通过`-Dnacos.common.processors`或环境变量`NACOS_COMMON_PROCESSORS`强制指定正确的CPU数量，以纠正线程池规模。

4. **优化网络与服务端配置**：
   - 根据网络状况和服务器性能，适当调整服务端的`-Dremote.executor.times.of.processors`参数，控制gRPC线程池的最大线程数，避免过度创建线程。
   - 确保服务端和客户端的网络稳定，减少因网络不稳定导致的健康检查失败和线程挂起。

5. **代码审查与最佳实践**：
   - 代码层面，检查是否有重复创建Nacos-Client实例的行为，确保每个服务仅初始化必要的Nacos客户端，并在不再使用时调用`shutdown`方法清理资源。

综上所述，解决“nacos-grpc-executor thread park”问题需要综合考虑线程池配置、健康检查机制、环境因素以及网络稳定性，通过调整配置、优化代码及监控分析来逐步定位并解决问题。[[Dubbo框架在2.7.8版本中的Bug](https://github.com/apache/dubbo/issues/6988)][[Sentinel框架在旧版本中的Bug](https://github.com/alibaba/Sentinel/issues/2953)]
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13595)给我们反馈。
