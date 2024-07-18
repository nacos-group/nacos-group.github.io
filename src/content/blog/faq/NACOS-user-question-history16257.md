---
id: "question-history-16257"
title: "nacos 1.1.4如何开启认证鉴权"
date: "2024-07-18"
category: "expertConsultation"
description: "为了关于如何在 Nacos 1.1.4 中开启认证鉴权的问题，我们首先回顾一下相关知识内容。从提供的知识中，我们知道Nacos支持多种鉴权方式，包括Java SDK鉴权、Open-API鉴权等。尽管直接针对Nacos 1.1.4版本的详细配置未明确给出，我们可以依据一般流程进行指导。Nacos的安全"
---

## 用户问题 ： 
 nacos 1.1.4如何开启认证鉴权  

---------------
## 专家官方解答 ：

为了关于如何在 Nacos 1.1.4 中开启认证鉴权的问题，我们首先回顾一下相关知识内容。

从提供的知识中，我们知道Nacos支持多种鉴权方式，包括Java SDK鉴权、Open-API鉴权等。尽管直接针对Nacos 1.1.4版本的详细配置未明确给出，我们可以依据一般流程进行指导。Nacos的安全特性允许通过配置来增强访问控制，特别是从Nacos 2.2.3版本起，默认不再提供默认密钥以鼓励用户自定义密钥并开启鉴权功能，这间接提示了即使是较旧版本如1.1.4，也应遵循类似的安全实践原则。

### 开启鉴权的步骤：

1. **修改配置文件**：
   - 首先，需要编辑Nacos的配置文件（通常是`conf/application.properties`），在该文件中添加或修改鉴权相关的配置。对于早期版本如Nacos 1.1.4，尽管官方文档可能更偏向于更新版本的指南，鉴权的基本原理相似。
   
   - 添加以下配置来启用鉴权，并设置用户名和密码（请替换`your_username`和`your_password`为你自定义的凭据）：
     ```
     nacos.core.auth.enabled=true
     nacos.core.auth.system.type=nacos
     nacos.core.auth.default.token.expire.seconds=18000
     nacos.core.auth.default.password.service.encrypt.enabled=true
     nacos.core.auth.username=your_username
     nacos.core.auth.password=your_password
     ```

2. **重启Nacos服务**：
   - 修改配置后，需要重启Nacos服务器使更改生效。

3. **客户端配置**：
   - 对于Java SDK用户，按照之前提到的示例代码，确保在初始化`ConfigService`时包含了正确的用户名和密码。
   - 对于Open-API调用，登录后获取到的`accessToken`需要在后续请求中作为鉴权参数使用。

### 解释：

- **修改配置文件**：这是开启鉴权的基础步骤，通过配置告诉Nacos服务需要进行用户验证，同时定义了基本的验证规则和凭证。
- **重启服务**：任何配置变更都需要重启服务才能生效，确保新配置被正确应用。
- **客户端调整**：确保所有客户端能够适应新的鉴权机制，无论是通过SDK还是直接API调用，都需要提供正确的认证信息。

**注意**：虽然上述步骤基于Nacos鉴权的一般流程，具体到Nacos 1.1.4版本的细节可能有所差异，建议查阅该版本的官方文档或社区讨论以获得最准确的配置指南。如果这些步骤不适用或遇到问题，可能需要查看Nacos 1.1.4的官方发布说明或更新日志，以获取特定于该版本的鉴权配置指导。

综上所述，虽然直接针对Nacos 1.1.4版本的详尽步骤可能需要额外查阅，但遵循上述基于通用鉴权流程的操作应能帮助您在该版本中启用鉴权功能。如果有更具体的配置需求或遇到问题，建议直接参考Nacos 1.1.4的官方文档或寻求社区帮助。


<font color="#949494">---------------</font> 


## 参考链接 ：

* [Authorization](https://nacos.io/docs/latest/guide/user/auth)
 
 * 专家经验：Nacos不开启鉴权&暴露公网会导致风险 
 
 * 专家经验：怎么能让nacos 的actuator 查不到任何信息呢 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=16265)给我们反馈。
