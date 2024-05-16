---
id: "question-history-8262"
title: "Nacos 2.2.1 com.alibaba.nacos.api.exception.NacosException: errCode: 400, errMsg: Current service DEFAULT_GROUP@@stock-service is persistent service, can't register ephemeral instance. nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource Nacos 2.2.1 com.alibaba.nacos.api.exception.NacosException: errCode: 400, errMsg: Current service DEFAULT_GROUP@@stock-service is persistent service, can't register ephemeral instance."
tags: ["Nacos","2.2.1","com.alibaba.nacos.api.exception.NacosException","errCode: 400","errMsg: Current service DEFAULT_GROUP@@stock-service is persistent service cant register ephemeral instance."]
keywords: ["Nacos","2.2.1","com.alibaba.nacos.api.exception.NacosException","errCode: 400","errMsg: Current service DEFAULT_GROUP@@stock-service is persistent service cant register ephemeral instance."]
---

## 用户问题 ： 
 Nacos 2.2.1 com.alibaba.nacos.api.exception.NacosException: errCode: 400, errMsg: Current service DEFAULT_GROUP@@stock-service is persistent service, can't register ephemeral instance. nacos-opensource 

---------------
## 专家官方解答 ：

分析问题原因：

从提供的异常信息来看，您在使用 Nacos 2.2.1 版本时遇到以下错误：

`com.alibaba.nacos.api.exception.NacosException: errCode: 400, errMsg: Current service DEFAULT_GROUP@@stock-service is persistent service, can't register ephemeral instance.`

这表明您试图注册一个临时（ephemeral）实例到名为 `stock-service` 的服务，但该服务被配置为持久（persistent）服务，两者之间存在冲突。Nacos 不允许将临时实例注册到持久服务上，因为它们具有不同的生命周期和管理规则：

- **持久服务**：用于存储长期稳定的服务器列表，如生产环境中的固定集群节点。持久服务的实例一旦注册，除非手动删除或因网络故障等因素导致心跳超时，否则会一直存在于 Nacos 服务列表中。

- **临时服务**：通常用于服务发现场景中动态加入或离开的服务器节点，如短暂运行的任务实例或按需伸缩的云服务器。临时服务实例在客户端断开连接或心跳超时后会被自动移除。

解决步骤：

基于问题原因，您需要确保服务注册行为与 `stock-service` 服务的实际类型（持久或临时）保持一致。具体操作如下：

1. **检查服务端配置**：
   - 确认 Nacos 控制台上 `stock-service` 的服务定义是否明确声明为持久服务。如果是，请继续下一步；如果不是，请更新服务定义为临时服务，或者按照实际需求调整服务类型。

2. **检查客户端代码**：
   - 在您的服务提供者代码中，找到与 `stock-service` 服务注册相关的配置或代码片段。通常，这涉及到使用 Nacos SDK 进行服务注册的部分。
   - 确保在注册服务实例时，将服务实例标记为持久（`false`）而非临时（`true`）。在很多 Nacos SDK 中，这可能通过一个名为 `ephemeral` 或类似名称的参数控制。例如，在 Java SDK 中，您可能会看到如下代码：
     ```java
     // 将 ephemeral 设置为 false，表示注册持久服务实例
     registry.register(serviceInstance(false));
     ```

3. **重新启动服务提供者**：
   - 修改代码后，重新编译并启动您的服务提供者。确保服务提供者成功连接到 Nacos 服务器并完成服务注册过程，且不再报错。

解释：

以上步骤旨在确保服务提供者注册的服务实例类型与 Nacos 上已定义的 `stock-service` 服务类型相匹配。通过检查服务端配置和客户端代码，您可以定位到导致冲突的具体原因，并针对性地调整服务实例的注册方式。最终，正确的服务注册设置应能消除所遇到的 `NacosException`，使服务提供者顺利注册为 `stock-service` 的持久实例。


<font color="#949494">---------------</font> 


## 参考链接 ：

*[Dubbo 融合 Nacos 成为注册中心](https://nacos.io/docs/latest/ecology/use-nacos-with-dubbo)
 
 *专家经验:nacos 多语言支持 
 
 *专家经验:Nacos 欢迎你 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11574)给我们反馈。
