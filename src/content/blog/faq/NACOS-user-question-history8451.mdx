---
id: "question-history-8451"
title: "兄弟们，问个问题。nacos 是java -jar 宿主机启动的 . 有两个spring boot 是 docker 启动的 然后用Feign无法互相访问这个怎么处理一哈 ， 同一个机器 nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource 兄弟们，问个问题。nacos 是java -jar 宿主机启动的 . 有两个spring boot 是 docker 启动的 然后用Feign无法互相访问这个怎么处理一哈 ， 同一个机器"
tags: ["java -jar","宿主机","spring boot","docker","Feign","互相访问","同一个机器"]
keywords: ["java -jar","宿主机","spring boot","docker","Feign","互相访问","同一个机器"]
---

## 用户问题 ： 
 兄弟们，问个问题。nacos 是java -jar 宿主机启动的 . 有两个spring boot 是 docker 启动的 然后用Feign无法互相访问这个怎么处理一哈 ， 同一个机器 nacos-opensource 

---------------
## 专家官方解答 ：

针对您遇到的问题“nacos 是java -jar 宿主机启动的 . 有两个spring boot 是 docker 启动的 然后用Feign无法互相访问这个怎么处理一哈 ， 同一个机器”，可以按照以下逻辑来分析并解决：

1. **依托我了解的知识分析问题的原因：**

   根据提供的我了解的知识-第2篇参考内容，当应用服务调用了依赖服务的提供者时出现"No provider"或找不到服务等错误，可能的原因包括：
   - **服务提供者未注册或注册至错误环境内。**
   - **网络问题或订阅者应用有问题，导致Nacos-Client未获取到最新的服务提供者地址。**
   - **Nacos-Client已经获取到最新的服务提供者地址，但应用未使用（如有路由规则、权重规则、框架缓存等）。**

   在您的场景中，两个Spring Boot应用均通过docker启动，并且使用Feign进行互相访问。由于它们在同一台宿主机上，宿主机上的Nacos通过java -jar方式运行，问题可能出在服务注册、网络通信或Feign缓存等方面。

2. **依托我了解的知识中给出的步骤，给出详细的可执行的具体步骤：**

   **步骤1：检查服务提供者注册情况**

   登录Nacos控制台，查看这两个Spring Boot应用是否已成功注册为服务提供者，服务名、分组、环境等配置是否正确，以及它们的IP地址和端口是否与实际docker容器内的信息一致。确保服务提供者状态正常且数量符合预期。

   **步骤2：确认Nacos-Client是否获取到最新服务提供者地址**

   针对每个Spring Boot应用所在的docker容器：

   - 找到Nacos-Client的日志，检索关键字`current ips`以及对应的服务名，查看日志中的服务提供者实例个数及详细信息是否与Nacos控制台显示的一致。如果一致，说明Nacos-Client已收到推送。

   **步骤3：排查Feign缓存或路由规则**

   如果服务提供者已成功注册且Nacos-Client已获取到正确的地址，但Feign仍然无法互相访问，可能存在以下情况：

   - Feign可能存在缓存机制，导致其仍在使用过期的服务提供者地址。查阅Spring Cloud Feign的文档或相关社区资源，了解如何刷新或禁用缓存，确保Feign客户端能及时获取并使用最新的服务提供者地址。
   - 检查是否有自定义的路由规则、权重规则等影响服务发现的行为。如果有，确保这些规则设置正确，不妨暂时移除或调整这些规则以排除干扰。

   **步骤4：检查网络通信与端口映射**

   - 确认宿主机与docker容器间的网络通信是否正常。如果是桥接模式，确保宿主机与容器间能够通过端口进行通信。如果是host模式，直接使用宿主机IP和端口进行访问。
   - 检查docker-compose文件或启动命令中是否正确设置了端口映射，确保宿主机与容器内部的端口对应关系无误。

3. **对上述具体步骤的解释：**

   上述步骤旨在逐步排查可能导致Spring Boot应用通过Feign无法互相访问的各种因素。首先，确保服务提供者在Nacos中正确注册并可被查询；其次，验证Nacos-Client是否成功获取到服务提供者的最新地址；接着，聚焦于Feign客户端本身，检查是否存在缓存问题或自定义路由规则干扰服务发现；最后，关注宿主机与docker容器间的网络通信及端口映射设置，确保基础通信环境无误。

综上所述，根据提供的我了解的知识内容，针对您描述的问题，可以按照上述步骤进行详细排查和解决。如果您在执行过程中遇到新的问题或现有信息不足以解决问题，建议提供更多详细信息或尝试其他排查方法。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:nacos哪个版本最常用 
 
 *专家经验:应用服务调用了依赖服务的提供者时，提示No provider或找不到服务等错误。 
 
 *专家经验:Nacos 请问nacos有arm架构的docker镜像么 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11631)给我们反馈。
