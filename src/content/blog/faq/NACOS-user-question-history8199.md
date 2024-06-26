---
id: "question-history-8199"
title: "Nacos默认密码，请问下使用内置数据库在单机情况下可以修改密码，但是集群下却不行 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "在Nacos集群环境下，使用内置数据库（Derby）直接修改用户密码导致的问题，其根本原因在于Derby数据库作为嵌入式数据库，被设计为与Nacos集群紧密集成并通过Raft协议维护数据一致性。当在单机模式下，由于不存在分布式一致性的问题，直接修改Derby数据库中的用户密码是可行的，且修改效果立竿"
tags: ["默认密码","修改密码","内置数据库","单机","集群"]
keywords: ["默认密码","修改密码","内置数据库","单机","集群"]
---

在Nacos集群环境下，使用内置数据库（Derby）直接修改用户密码导致的问题，其根本原因在于Derby数据库作为嵌入式数据库，被设计为与Nacos集群紧密集成并通过Raft协议维护数据一致性。当在单机模式下，由于不存在分布式一致性的问题，直接修改Derby数据库中的用户密码是可行的，且修改效果立竿见影。然而，在集群配置下，直接修改任一节点的Derby数据库可能会破坏数据一致性，导致集群中其他节点的数据与之不匹配，从而引发各种不可预料的问题。

根据已有的知识，对于Nacos集群使用内置数据库时，不推荐也不支持直接修改数据库中的用户密码。正确的做法应当遵循以下步骤进行密码修改：

1. **初始化集群时设置默认用户密码**：如果集群尚未初始化，可以在初始化前修改`mysql-schema.sql`或`derby-schema.sql`中的默认密码插入语句，确保所有集群节点使用相同的加密后密码初始化。

2. **集群初始化后修改密码**：一旦集群启动并运行，应通过控制台或运维API来修改用户密码，确保操作对整个集群生效且维持数据一致性。具体步骤如下：
   - **通过控制台修改**：登录Nacos控制台，进入“权限控制”->“用户管理”，选择相应用户进行密码修改。
   - **使用运维API修改**：
     ```shell
     curl -X PUT 'http://${nacos_host}:${nacos_port}/nacos/v1/auth/users?username=${modified_username}&newPassword=${new_password}'
     ```
   在执行上述API调用前，请确保`new_password`已经过BCrypt加密。

综上所述，集群环境下直接修改内置Derby数据库来更改用户密码是不可行的，应遵循官方推荐的控制台或API途径进行密码管理，以保障集群数据的一致性和系统的稳定性。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13558)给我们反馈。
