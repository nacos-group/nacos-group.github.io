---
id: "question-history-13531"
title: "更改nacos的默认用户名nacos nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "更改Nacos的默认用户名（从'nacos'更改为其他用户名）的操作并不直接支持。Nacos的设计原则是初始化后不允许修改用户名，仅支持修改密码及新增用户。根据提供的知识内容，这里给出相应的指导：1. **初始化集群前修改用户名**   - 如果您还未部署Nacos集群，可以在部署前，通过修改配置文"
tags: ["nacos","更改","默认用户名"]
keywords: ["nacos","更改","默认用户名"]
---

更改Nacos的默认用户名（从'nacos'更改为其他用户名）的操作并不直接支持。Nacos的设计原则是初始化后不允许修改用户名，仅支持修改密码及新增用户。根据提供的知识内容，这里给出相应的指导：

1. **初始化集群前修改用户名**
   - 如果您还未部署Nacos集群，可以在部署前，通过修改配置文件来间接实现用户名的变更。具体做法是在初始化Nacos配置时，编辑`${nacos.home}/conf/`目录下的数据库初始化脚本，比如`mysql-schema.sql`，将默认插入的用户名由'nacos'更改为所需的用户名。但是，请注意，直接修改用户名可能会影响到默认的系统行为和预期，因为Nacos内部可能有对默认用户名的依赖。

2. **集群初始化后**
   - 一旦Nacos集群已经初始化并运行，标准的操作流程不允许直接修改用户名。此时，您不能直接将'nacos'用户名更改为其他名称。正确的做法是通过控制台或API新增一个具有管理员权限的新用户，然后使用新用户登录并管理Nacos。

3. **新增用户**
   - 您可以通过以下步骤新增用户：
     - 访问Nacos控制台的“权限控制”->“用户管理”，点击添加用户，输入新用户名和密码。
     - 或者使用运维API添加用户，命令示例为：
       ```shell
       curl -X POST 'http://${nacos_host}:${nacos_port}/nacos/v1/auth/users?username=${new_username}&password=${new_password}'
       ```
     - 添加后，确保为新用户分配足够的权限以进行系统管理。

4. **注意事项**
   - 新增的用户密码同样需要进行BCrypt加密处理，确保与Nacos的安全策略兼容。
   - 执行上述操作时，如果Nacos已开启鉴权，需使用具有管理员权限的账号进行。

综上所述，更改Nacos默认用户名并非直接支持的功能，建议通过创建新用户并赋予相应权限的方式来满足管理需求。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13916)给我们反馈。
