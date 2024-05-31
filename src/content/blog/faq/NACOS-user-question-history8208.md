---
id: "question-history-8208"
title: "请问nacos使用mysql作为后端数据库，其中his_config_info的内容会一直保存吗？或者会保 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "Nacos 使用 MySQL 作为后端数据库时，`his_config_info` 表中的内容并不会一直保存。默认情况下，Nacos 会定期清理 `his_config_info` 表中的数据，保留30天前的配置变更历史。这一设定旨在避免表过大而影响查询效率和存储成本。如果你需要调整这个保留周期，可"
tags: ["mysql","his_config_info","内容","保存","保留多久"]
keywords: ["mysql","his_config_info","内容","保存","保留多久"]
---

Nacos 使用 MySQL 作为后端数据库时，`his_config_info` 表中的内容并不会一直保存。默认情况下，Nacos 会定期清理 `his_config_info` 表中的数据，保留30天前的配置变更历史。这一设定旨在避免表过大而影响查询效率和存储成本。如果你需要调整这个保留周期，可
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13566)给我们反馈。
