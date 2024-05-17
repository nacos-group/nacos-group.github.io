---
id: "question-history-8271"
title: "#io.grpc.netty.shaded.io.netty.util.internal.OutOfDirectMemoryError: failed to allocate 2097152 byte(s) of direct memory (used: 501219607, max: 503316480) nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource #io.grpc.netty.shaded.io.netty.util.internal.OutOfDirectMemoryError: failed to allocate 2097152 byte(s) of direct memory (used: 501219607, max: 503316480)"
tags: ["io.grpc.netty.shaded.io.netty.util.internal.OutOfDirectMemoryError","failed to allocate","direct memory","used: 501219607","max: 503316480"]
keywords: ["io.grpc.netty.shaded.io.netty.util.internal.OutOfDirectMemoryError","failed to allocate","direct memory","used: 501219607","max: 503316480"]
---

## 用户问题 ： 
 #io.grpc.netty.shaded.io.netty.util.internal.OutOfDirectMemoryError: failed to allocate 2097152 byte(s) of direct memory (used: 501219607, max: 503316480) nacos-opensource 

---------------
## 专家官方解答 ：

在遭遇`io.grpc.netty.shaded.io.netty.util.internal.OutOfDirectMemoryError`异常时，表示Nacos服务端在尝试分配直接内存（Direct Memory）时，已超出当前允许的最大值。根据提供的我了解的知识，我们可分析问题原因并采取相应措施：

**问题原因：**

1. **请求量过大**：短时间内大量的服务注册、配置订阅等操作可能导致NIO堆外内存迅速增长。

2. **堆外内存限制过小**：当前设定的`MaxDirectMemorySize`可能不足以应对服务端的实际需求。

3. **客户端故障**：服务端持续向故障客户端推送数据，占用堆外内存。

4. **其他因素**：如特定场景下（如大量使用login接口）申请堆外内存，或JJWT相关问题。

**解决方案：**

1. **调整NIO堆外内存限制**：通过JVM启动参数`-XX:MaxDirectMemorySize=`设置合适的值。根据建议，可将其设为堆大小的1/4～1/2左右。考虑到当前已用直接内存为501,219,607字节，接近最大值503,316,480字节，可能需要适当增加该参数值，以避免内存溢出。

2. **排查并修复客户端问题**：检查`naming-push.log`和`remote-push.log`，查找是否存在持续推送失败的IP地址。如有，应排查这些客户端是否存在FullGC、OOM、CPU压力大、客户端版本过旧等问题，并进行相应修复。

3. **升级Nacos服务端版本**：如果上述调整未能解决问题，或者想进一步优化堆外内存使用，可以考虑升级到最新版本的Nacos服务端，利用其对堆外内存使用的持续优化。

综上所述，针对`io.grpc.netty.shaded.io.netty.util.internal.OutOfDirectMemoryError`异常，您可以按照以下具体步骤进行操作：

**步骤1：** 调整Nacos服务端JVM启动参数，增大`-XX:MaxDirectMemorySize`值。例如，若当前堆内存大小为2GB，可将其设置为512MB（即堆大小的1/4）至1GB（即堆大小的1/2）。确保新值足以应对当前及预期的直接内存需求，且不超过服务器物理内存的合理范围。

**步骤2：** 分析`naming-push.log`和`remote-push.log`日志文件，查找是否存在频繁推送失败的客户端IP地址。如果有，记录这些IP，并进行详细排查：

   - 检查客户端日志，确认是否存在Full GC、内存溢出（OOM）等情况。
   - 确认客户端CPU使用情况，是否存在过高负载。
   - 确认客户端使用的Nacos版本是否过旧，如有必要，升级到与服务端兼容的最新版本。

**步骤3：** 根据步骤2的排查结果，修复客户端问题，如优化客户端配置、更新客户端版本、调整客户端服务器资源等。

**步骤4：** 如经过上述调整仍未有效解决问题或希望进一步优化，升级Nacos服务端到最新稳定版本，利用官方对堆外内存使用的持续优化。

完成上述步骤后，重新启动Nacos服务端，并密切关注其内存使用情况以及系统日志，确保问题得到有效解决。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:io.grpc.netty.shaded.io.netty.util.internal.OutOfDirectMemoryError 
 
 *专家经验:Nacos 内存占用过大 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11582)给我们反馈。
