---
id: "question-history-12710"
title: "nacos的默认用户名密码是什么？ nacos-opensource"
date: "2024-05-08"
category: expertConsultation
description: "nacos-opensource nacos的默认用户名密码是什么？"
tags: ["nacos","默认用户名密码"]
keywords: ["nacos","默认用户名密码"]
---

## 用户问题 ： 
 nacos的默认用户名密码是什么？ nacos-opensource 

---------------
## 专家官方解答 ：

Nacos的默认用户名和密码均为`nacos`。这一信息是在Nacos初始化时设定的，默认管理员账户的凭证。如果需要修改，默认推荐在初始化集群前通过修改数据库脚本进行，或者在集群启动后通过控制台界面、运维API以及直接操作外置数据库的方式来调整用户名和密码。记得，如果直接修改密码，需要确保密码经过BCrypt加密处理。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:nacos用户密码设置 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=12717)给我们反馈。
