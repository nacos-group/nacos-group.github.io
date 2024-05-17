---
id: "question-history-11758"
title: "nacos为什么性能好 nacos-opensource"
date: "2024-04-24"
category: expertConsultation
description: "nacos-opensource nacos为什么性能好"
tags: ["性能","好"]
keywords: ["性能","好"]
---

## 用户问题 ： 
 nacos为什么性能好
 nacos-opensource 

---------------
## 专家官方解答 ：

Nacos之所以具备优秀的性能，主要基于以下几个方面的原因：

1. **轻量化设计**：作为一款基础组件，Nacos致力于保持自身的轻量化，以降低对系统资源的占用并提高运行效率。不采用ORM（如Hibernate）或JPA等数据访问框架，避免了引入这些框架所带来的大量额外依赖，从而有效控制了部署包的大小。据文中所述，此举可以防止部署包扩大20%以上，这对于追求简洁、高效的基础组件而言至关重要。

2. **避免性能开销**：ORM和JPA框架通常包含诸如反射、Bean属性拷贝以及动态SQL生成等复杂逻辑，这些逻辑在处理特定的业务场景时能够提供便利，但对于Nacos这类只需进行简单、直接数据库操作的基础组件来说，却是不必要的性能损耗。Nacos通过直接使用JDBC + 连接池的方式访问数据库，去除了这些额外的中间层处理，使得数据访问更加高效、直接，从而有利于提升整体性能。

3. **针对性优化**：由于Nacos的数据库操作相对简单且固定，其对数据库的使用模式易于预测和优化。直接使用JDBC不仅能够精确控制SQL语句的编写，确保其高效性，而且结合连接池技术，可以有效管理数据库连接，减少创建和释放连接的开销，进一步提升数据库访问性能。

综上所述，Nacos通过轻量化设计、避免ORM/JPA带来的额外性能开销以及针对性地使用JDBC与连接池进行数据库访问，实现了性能上的优化，使其成为一款高效的基础组件。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:为什么Nacos不使用ORM框架访问数据库 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11773)给我们反馈。
