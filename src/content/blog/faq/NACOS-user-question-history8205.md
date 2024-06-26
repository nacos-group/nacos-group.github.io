---
id: "question-history-8205"
title: "为什么要在代码里面写拼接sql来实现crud nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "Nacos选择在代码中直接写拼接SQL来实现CRUD操作的原因主要基于以下几点：1. **轻量化设计需求**：作为一款基础服务组件，Nacos追求高度的轻量化以确保其高性能和低资源消耗。引入ORM（如JPA）框架会增加项目的依赖复杂度和部署包大小，据估计会使得部署包大小扩大超过20%，这与Nacos"
tags: ["crud","拼接sql"]
keywords: ["crud","拼接sql"]
---

## 用户问题 ： 
 为什么要在代码里面写拼接sql来实现crud nacos-opensource 

---------------
## 专家官方解答 ：

Nacos选择在代码中直接写拼接SQL来实现CRUD操作的原因主要基于以下几点：

1. **轻量化设计需求**：作为一款基础服务组件，Nacos追求高度的轻量化以确保其高性能和低资源消耗。引入ORM（如JPA）框架会增加项目的依赖复杂度和部署包大小，据估计会使得部署包大小扩大超过20%，这与Nacos的设计原则相悖。

2. **性能考量**：ORM框架虽然提供了数据库操作的便利性，但其内部机制涉及较多的反射、对象映射及动态SQL生成等过程，这些都会带来额外的性能开销。对于Nacos这类对性能有严格要求的系统来说，直接使用JDBC配合连接池能够更精细地控制SQL执行，减少不必要的中间处理环节，从而提升系统性能。

3. **控制力与灵活性**：通过手动拼接SQL，Nacos能够针对特定场景定制最优化的查询语句，保持对SQL执行的直接控制，这在处理大量并发请求和大数据量时尤为重要。相比ORM自动生成的SQL，手工调整的SQL往往能更精确地满足性能和功能需求。

综上所述，Nacos在代码中直接拼接SQL来执行数据库操作是一种基于其产品定位和性能优化需求的合理选择。这种方式虽然牺牲了一定的开发便利性，但却换来了更高的系统效率和更灵活的数据库访问策略。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：为什么Nacos不使用ORM框架访问数据库 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13563)给我们反馈。
