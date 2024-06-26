---
id: "question-history-8208"
title: "请问nacos使用mysql作为后端数据库，其中his_config_info的内容会一直保存吗？或者会保 nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "Nacos 使用 MySQL 作为后端数据库时，`his_config_info` 表中的内容并不会一直保存。默认情况下，Nacos 会定期清理 `his_config_info` 表中的数据，保留30天前的配置变更历史。这一设定旨在避免表过大而影响查询效率和存储成本。如果你需要调整这个保留周期，可"
tags: ["mysql","his_config_info","内容","保存","保留多久"]
keywords: ["mysql","his_config_info","内容","保存","保留多久"]
---

## 用户问题 ： 
 请问nacos使用mysql作为后端数据库，其中his_config_info的内容会一直保存吗？或者会保留多久呢？ nacos-opensource 

---------------
## 专家官方解答 ：

Nacos 使用 MySQL 作为后端数据库时，`his_config_info` 表中的内容并不会一直保存。默认情况下，Nacos 会定期清理 `his_config_info` 表中的数据，保留30天前的配置变更历史。这一设定旨在避免表过大而影响查询效率和存储成本。

如果你需要调整这个保留周期，可以通过修改配置项 `nacos.config.retention.days` 来实现。例如，如果你想延长保留时间为60天，可以在 Nacos 的配置文件中设置 `nacos.config.retention.days=60`。反之，如果希望配置变更历史能够永久保留，官方并不建议直接将保留天数设置为很大或无限，而是推荐定期手动备份 `his_config_info` 表的数据。

综上所述，针对你的问题，具体步骤如下：
1. **检查当前配置**：首先，确认当前 Nacos 配置中 `nacos.config.retention.days` 的设置值，这决定了 `his_config_info` 表数据的默认保留期限。
2. **调整保留周期**（如有需要）：如果默认的30天不符合需求，可以通过修改 `nacos.config.retention.days` 参数来改变数据保留的时间长度。编辑 Nacos 的配置文件（通常是 `application.properties`），加入或修改上述配置项。
3. **备份策略制定**：如果打算长期或永久保存配置变更历史，考虑实施定期数据库备份计划，特别是对 `his_config_info` 表的备份，而不是仅依赖于延长数据在数据库中的保留时间。

请注意，这些操作应在充分了解其对系统资源和管理需求的影响后谨慎实施。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：请问nacos使用mysql作为后端数据库，记录会保留多久呢？ 
 
 *专家经验：Nacos 配置中心的数据同步和一致性问题 
 
 *专家经验：Nacos的数据库支持情况介绍 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13566)给我们反馈。
