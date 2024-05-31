---
id: "question-history-8456"
title: "各位大佬  请问一下在K8s上部署nacos  mysql用单独的库  NFS是必须的吗  作用是用于管理raft日志的 是吗？ nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "在Kubernetes(K8s)上部署Nacos时，使用MySQL作为外部存储而非嵌入式数据库是一种常见做法，以提高数据的持久性和可靠性。关于NFS（Network File System）的需求，这主要关联到Nacos的Raft模式下日志的存储管理。NFS并不是Nacos部署的强制性需求，但它可以"
tags: ["K8s","部署","nacos","mysql","单独的库","NFS","raft日志","管理"]
keywords: ["K8s","部署","nacos","mysql","单独的库","NFS","raft日志","管理"]
---

在Kubernetes(K8s)上部署Nacos时，使用MySQL作为外部存储而非嵌入式数据库是一种常见做法，以提高数据的持久性和可靠性。关于NFS（Network File System）的需求，这主要关联到Nacos的Raft模式下日志的存储管理。

NFS并不是Nacos部署的强制性需求，但它可以作为一个解决方案来管理Raft日志。在Nacos集群模式下，为了确保数据的一致性，Nacos利用了Raft一致性算法，该算法需要持久化存储Raft日志。当没有指定特定的存储类（如NFS）时，Nacos可能会默认使用本地存储，但这在K8s环境中可能导致问题，比如当Pod重建或调度到不同节点时，本地存储的数据将不可用。

使用NFS的优势在于，它提供了一个跨多个节点共享的文件系统，可以确保即使Pod重启或者被重新调度到集群内的其他节点，Raft日志仍然可以被访问，从而保障了集群的高可用性。因此，虽然不是必须的，但使用NFS或其他类似的网络存储解决方案对于管理Raft日志来说是一个推荐的做法，它有助于提升系统的稳定性和容错能力。

总结来说，部署Nacos到K8s并使用单独的MySQL数据库时，NFS的使用是为了更好地管理Raft日志，确保集群状态的一致性和持久性，虽然不是绝对必要，但在实际生产环境中强烈推荐。这与Nacos的功能设计和K8s环境下的资源管理策略相契合，以达到高可用部署的目标。具体配置方法应参照Nacos官方文档和Kubernetes存储相关的实践指南。[[相关文档链接](https://nacos.io/docs/latest/guide/deployment.html)]
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13673)给我们反馈。
