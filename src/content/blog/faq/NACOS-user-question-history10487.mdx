---
id: "question-history-10487"
title: "#Nacos的高可用性如何保证？ nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource #Nacos的高可用性如何保证？"
tags: ["高可用性","如何保证"]
keywords: ["高可用性","如何保证"]
---

## 用户问题 ： 
 #Nacos的高可用性如何保证？ nacos-opensource 

---------------
## 专家官方解答 ：

Nacos的高可用性主要通过以下几个方面得以保证：

1. **多协议支持与数据一致性保障**：
   Nacos采用了自研的AP（最终一致性）协议Distro和社区广泛认可的CP（强一致性）协议Raft，针对不同类型的数据提供适宜的一致性保证。Distro协议确保了注册中心中临时服务和实例的数据、配置中心中配置变更通知的同步；Raft协议则专注于注册中心中非持久化服务及服务和实例元数据信息、配置中心使用Derby数据库时各数据库间的一致性。这两种协议的结合使用，使得Nacos能在实际场景中灵活选择并确保关键数据的一致性，这是实现高可用的基础。

2. **健康检查机制**：
   Nacos通过集成Spring Actuator，提供了对服务健康状态的实时监控。尽管当前暂不支持通过Spring Boot Starter直接关闭nacos-config和nacos-discovery的健康检查，但默认启用的健康检查有助于快速识别和隔离有问题的服务实例，确保整个系统的健壮性。对于使用spring-cloud-alibaba-nacos-discovery或spring-cloud-alibaba-nacos-config的用户，可通过配置管理端点（`management.endpoint.nacos-discovery.enabled`和`management.endpoint.nacos-config.enabled`）关闭特定的健康检查。

3. **故障检测与恢复**：
   针对可能出现的连接超时问题，Nacos提供了多种解决方案以确保服务的连续性和可用性。当遇到网络传输问题、防火墙限制、VPN影响、客户端异常或服务器性能瓶颈等情况时，用户可以采取以下措施：
   - **客户端节点排查**：使用ping、telnet、curl等工具测试与Nacos服务器的网络连通性，检查客户端节点是否存在CPU过载、频繁Full GC、OOM等问题。
   - **防火墙与ACL检查**：确认iptables等防火墙规则或ACL策略是否影响Nacos通信。
   - **VPN调整**：如适用，尝试关闭VPN或优化其配置。
   - **服务端性能监控**：观察Nacos Server的各项性能指标，如每秒查询数、操作数、长链路数量、长轮询数量、Full GC频率、节点入口/出口流量以及CPU利用率等，及时发现并解决潜在性能瓶颈。

4. **超时设置与重试机制**：
   为了应对偶尔的超时错误，Nacos允许用户根据实际情况调整客户端的超时参数。对于不同版本的Java Client，提供了相应的JVM参数供用户配置，如`com.alibaba.nacos.client.naming.ctimeout`、`com.alibaba.nacos.client.naming.rtimeout`、`NACOS.CONNECT.TIMEOUT`、`nacos.remote.client.grpc.timeout`等，以适应不同网络环境和业务需求，提高服务稳定性。

综上所述，Nacos通过多协议保障数据一致性、内置健康检查机制、故障检测与恢复策略以及灵活的超时设置与重试机制，从多个维度构建了其高可用性体系，确保在各种复杂环境下服务的稳定运行和高效响应。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:Nacos nacos 2.3.0 如何关闭cp模式，只保留ap的注册中心？ 
 
 *专家经验:Nacos 麻烦咨询下 spring actuator 如何关闭 nacosconfig 的健康检查 ？ 
 
 *专家经验:如何解决Nacos连接超时问题 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11647)给我们反馈。
