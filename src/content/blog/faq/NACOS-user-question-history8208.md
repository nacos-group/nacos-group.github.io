---
id: "question-history-8208"
title: "请问nacos使用mysql作为后端数据库，其中his_config_info的内容会一直保存吗？或者会保留多久呢？ nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource 请问nacos使用mysql作为后端数据库，其中his_config_info的内容会一直保存吗？或者会保留多久呢？"
tags: ["mysql","后端数据库","his_config_info","保存","保留多久"]
keywords: ["mysql","后端数据库","his_config_info","保存","保留多久"]
---

## 用户问题 ： 
 请问nacos使用mysql作为后端数据库，其中his_config_info的内容会一直保存吗？或者会保留多久呢？ nacos-opensource 

---------------
## 专家官方解答 ：

Nacos使用MySQL作为后端数据库时，其中his_config_info表的内容并不会一直保存。这是因为Nacos会定期清理his_config_info表中的数据，以避免由于频繁配置变更或配置量大导致该表过大，进而影响查询效率和存储成本。默认情况下，Nacos会清理30天前的his_config_info数据。

针对这一问题，我了解的知识提供了两种解决方案：

1. **增加数据库规格和存储大小**：如果您认为his_config_info表的数据对于监控、审计或回溯操作至关重要，且30天的保留期不足以满足需求，可以选择提升您当前使用的MySQL数据库的硬件资源配置（如CPU、内存、磁盘空间等），确保在存储更多历史数据的情况下，仍能保持良好的查询性能和稳定性。

2. **调整配置保留天数**：通过修改Nacos的系统参数`nacos.config.retention.days`，您可以自定义his_config_info表中配置变更历史的保留时间。如果希望延长保留期，将此参数设置为大于30的数值；反之，如需减少存储负担，可将其设为较小的天数。请注意，若希望永久保留变更历史，不建议将此参数设置为极大值或无限，因为这可能导致his_config_info表过于庞大而无法有效读取。更合理的做法是定期备份his_config_info表，以实现长期保存的同时保持数据库的良好运行状态。

综上所述，Nacos使用MySQL作为后端数据库时，his_config_info表中的内容默认保留30天。您可根据实际需求，通过提升数据库规格、存储容量或调整`nacos.config.retention.days`参数来更改数据保留策略。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:请问nacos使用mysql作为后端数据库，记录会保留多久呢？ 
 
 *专家经验:Nacos 配置access.log的保留时间 
 
 *专家经验:Nacos 配置中心的数据同步和一致性问题 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11528)给我们反馈。
