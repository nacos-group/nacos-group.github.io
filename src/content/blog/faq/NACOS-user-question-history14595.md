---
id: "question-history-14595"
title: "nacos 和MSE 有什么区别？"
date: "2024-07-01"
category: "expertConsultation"
description: "nacos-opensource与MSE（微服务引擎）之间的主要区别在于服务治理能力和商业支持的差异。以下是详细对比：1. **开源与商业化**: nacos-opensource是阿里巴巴开源的服务发现、配置管理和服务管理平台，它是免费且开源的。而MSE是阿里云提供的微服务管理产品，它集成了nac"
---

## 用户问题 ： 
 nacos 和MSE 有什么区别？  

---------------
## 专家官方解答 ：

nacos-opensource与MSE（微服务引擎）之间的主要区别在于服务治理能力和商业支持的差异。以下是详细对比：

1. **开源与商业化**: nacos-opensource是阿里巴巴开源的服务发现、配置管理和服务管理平台，它是免费且开源的。而MSE是阿里云提供的微服务管理产品，它集成了nacos的cloud版，属于商业化产品，提供了额外的企业级功能和服务保障。

2. **功能扩展**: MSE在nacos开源版的基础上，增强了以下方面：
   - **易用性**：提供自动化运维能力、域名自动绑定、故障节点自动摘除、云原生网关集成、治理深度集成、平滑迁移工具及Eureka协议兼容。
   - **高可用性**：支持多节点容灾、多区域容灾、全局风险自动识别管理、注册中心保护策略、无损上下线能力及自动扩缩容。
   - **性能**：推送性能提升50%以上。
   - **安全性**：增加了RAM鉴权体系、无AK访问模式、ACL控制、TLS传输加密、KMS存储加密等安全措施。
   - **可观测性**：提供基础监控告警、高级监控如服务推送轨迹、配置推送轨迹等。

3. **技术支持与保障**：使用MSE，用户可以获得来自阿里云的专业技术支持、SLA保障以及付费的高级特性与服务，这对于追求高稳定性和低维护成本的企业尤其重要。

4. **试用与定价**：对于想要体验nacos专业版（即MSE中集成的nacos cloud版）的用户，可以通过[nacos企业版介绍](https://nacos.io/cloud/?from=wuyi)页面申请免费试用，进一步了解具体的功能和价格对比。

综上所述，如果您正在寻找一个社区驱动、灵活且免费的解决方案，nacos-opensource可能是一个好选择。但若您需要更高级的功能、企业级的支持和更高的稳定性保障，MSE及其集成的nacos cloud版会是更优的选择。


<font color="#949494">---------------</font> 


## 参考链接 ：

* 专家经验：微服务引擎(MSE）介绍 
 
 * 专家经验：Nacos 介绍 
 
 * 专家经验：Nacos和Eureka的区别是什么？ 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=16003)给我们反馈。
