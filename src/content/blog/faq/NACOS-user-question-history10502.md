---
id: "question-history-10502"
title: "#消费者是如何调用提供者的 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "在Nacos环境下，消费者调用服务提供者的过程大致如下，依据提供的知识进行分析：### 1. 服务发现- **服务注册：**服务提供者启动时，会向Nacos服务注册中心注册自己的信息，包括服务名、IP地址、端口号等。- **服务订阅：**消费者启动时，会向Nacos服务注册中心订阅它所需要调用的服务"
tags: ["消费者","调用","提供者"]
keywords: ["消费者","调用","提供者"]
---

## 用户问题 ： 
 #消费者是如何调用提供者的 nacos-opensource 

---------------
## 专家官方解答 ：

在Nacos环境下，消费者调用服务提供者的过程大致如下，依据提供的知识进行分析：

### 1. 服务发现
- **服务注册：**服务提供者启动时，会向Nacos服务注册中心注册自己的信息，包括服务名、IP地址、端口号等。
- **服务订阅：**消费者启动时，会向Nacos服务注册中心订阅它所需要调用的服务名。Nacos会将当前注册的所有服务提供者信息推送给消费者。

### 2. 调用逻辑
- **获取服务列表：**消费者通过Nacos Client获取到服务提供者列表。这一步涉及Nacos-Client日志中提到的`current ips`检查，确保获取到的地址与Nacos控制台显示的一致。
- **负载均衡：**消费者根据服务提供者列表和所使用的框架（如Spring Cloud的Ribbon、Feign，或Dubbo）的负载均衡策略选择一个服务提供者实例进行调用。这里可能会有缓存、路由规则、权重规则等因素影响选择结果。

### 遇到问题的排查与解决
根据遇到的问题，比如调用失败、调用到已下线服务等，可以按照以下步骤操作：

1. **检查服务状态：**首先登录Nacos控制台，验证服务提供者是否正常注册且状态符合预期。
2. **查看Nacos-Client日志：**检查消费者的Nacos-Client日志，确认是否成功订阅服务并获取到了正确的服务提供者地址。
3. **框架与版本兼容性：**
   - 对于Spring Cloud用户，检查Feign、LoadBalancer等组件的配置，确保没有因为框架内部缓存或路由规则导致问题。
   - Dubbo用户需关注版本问题，如遇到调用问题且版本在2.7.7~2.7.16之间，考虑升级至2.7.17以上或启用推空保护。
4. **网络与配置检查：**确认网络畅通无阻，Nacos客户端配置的命名服务器地址正确，无DNS解析问题。
5. **版本与协议问题：**了解客户端和服务端的版本兼容性，特别是Nacos 2.x引入Grpc模式后，订阅者列表中port为0是正常现象，代表使用了更高效的通信方式。

### 结论
消费者通过Nacos实现对服务提供者的透明化调用，核心在于服务的注册、发现与动态路由。遇到问题时，重点在于服务状态的核验、Nacos-Client日志分析、框架配置调整及网络配置检查。通过上述步骤，可以有效定位并解决调用过程中的常见问题。

[[相关链接](https://aliyuque.antfin.com/ozb6sn/nacos-opensource/toyvi01c9rwg41ly)]
[[相关链接](https://aliyuque.antfin.com/ozb6sn/nacos-opensource/hitz9hrpcdxnrovn)]
[[相关链接](https://aliyuque.antfin.com/ozb6sn/nacos-opensource/ci3i97p07s73tewg)]
[[相关链接](https://aliyuque.antfin.com/ozb6sn/nacos-opensource/kzc8nbuxwbpnxn5w)]


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：应用服务调用了依赖服务的提供者时，提示No provider或找不到服务等错误。 
 
 *专家经验：服务提供者已关闭，但是还在被其他应用调用 
 
 *专家经验：Nacos 接口/nacos/v1/ns/service/subscribers返回的订阅者列表中，port全部都是0 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13919)给我们反馈。
