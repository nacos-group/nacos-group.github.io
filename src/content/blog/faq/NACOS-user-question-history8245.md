---
id: "question-history-8245"
title: "Why Use HTTP for Registration of the Nacos2.0 Raft Protocol nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource Why Use HTTP for Registration of the Nacos2.0 Raft Protocol"
tags: ["HTTP","Registration","Nacos2.0","Raft Protocol"]
keywords: ["HTTP","Registration","Nacos2.0","Raft Protocol"]
---

## 用户问题 ： 
 Why Use HTTP for Registration of the Nacos2.0 Raft Protocol nacos-opensource 

---------------
## 专家官方解答 ：

Why Use HTTP for Registration of the Nacos2.0 Raft Protocol

**Analysis of the Reason**

The use of HTTP for registration in the Nacos2.0 Raft Protocol is primarily driven by specific scenarios where incorporating the nacos-client may not be feasible or convenient. These scenarios typically involve situations like MySQL discovery and coreDNS, where employing a simpler HTTP interface is deemed more suitable due to the challenges associated with utilizing the nacos-client.

**Detailed Steps**

Although the Nacos community has catered to nacos-client usage scenarios by introducing grpc-based registration in Nacos2.3.0 and above, HTTP registration remains available and will continue to be supported for registering persistent services. Here's how to register a persistent instance using HTTP:

1. **HTTP Registration of Persistent Service:**
   - Follow the instructions at [https://nacos.io/docs/latest/guide/user/open-api/#2.1](https://nacos.io/docs/latest/guide/user/open-api/#2.1).
   - In the process of making the HTTP request, ensure that you modify the `ephemeral` parameter to `false`. This setting indicates that the registered service instance should be persistent, meaning it won't be automatically removed when the client disconnects.

**Explanation**

The provided steps outline the process for leveraging HTTP to register a persistent service in Nacos2.0, as per the recommended approach for scenarios where using the nacos-client is not practical or preferred. By modifying the `ephemeral` parameter to `false`, you ensure that the registered service instance maintains its persistence even without continuous client connectivity, which aligns with the requirements of the mentioned scenarios (e.g., MySQL discovery, coreDNS).

In summary, HTTP is used for registration in the Nacos2.0 Raft Protocol because it offers a straightforward solution for environments where integrating the nacos-client is challenging. The detailed steps provided enable users to effectively utilize HTTP for registering persistent service instances in such scenarios.


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:Why Use HTTP for Registration of the Nacos2.0 Raft Protocol 
 
 *[Nacos 2.0 升级文档](https://nacos.io/docs/latest/upgrading/200-upgrading)
 
 *[Nacos 2.0.0 兼容性文档](https://nacos.io/docs/latest/upgrading/200-compatibility)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11559)给我们反馈。
