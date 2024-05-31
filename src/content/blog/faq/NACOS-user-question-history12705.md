---
id: "question-history-12705"
title: "nacos不使用外部数据库（如mysql) 怎么配置？ nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "Nacos 在不使用外部数据库（如MySQL）的情况下，默认使用的是嵌入式的Derby数据库。Derby是Apache软件基金会提供的一个开源的、纯Java编写的关系型数据库，它被直接打包在Nacos服务器中，无需单独安装和配置。以下是不使用外部数据库配置Nacos的基本步骤：1. **无需额外数据"
tags: ["nacos-opensource","配置","不使用","外部数据库","mysql"]
keywords: ["nacos-opensource","配置","不使用","外部数据库","mysql"]
---

## 用户问题 ： 
 nacos不使用外部数据库（如mysql) 怎么配置？ nacos-opensource 

---------------
## 专家官方解答 ：

Nacos 在不使用外部数据库（如MySQL）的情况下，默认使用的是嵌入式的Derby数据库。Derby是Apache软件基金会提供的一个开源的、纯Java编写的关系型数据库，它被直接打包在Nacos服务器中，无需单独安装和配置。以下是不使用外部数据库配置Nacos的基本步骤：

1. **无需额外数据库配置**：既然决定不使用外部数据库，那么在配置Nacos时，无需对`conf/application.properties`文件中的数据库连接信息（如`db.url.0`, `db.user`, `db.password`等）进行修改或设置。Nacos将会自动使用其内置的Derby数据库。

2. **确保使用Nacos默认配置**：Nacos默认配置已经包含了对Derby数据库的支持，因此你无需下载或安装任何数据库插件。直接启动Nacos服务器，它将使用Derby作为数据存储。

3. **启动Nacos服务器**：通过命令行或者IDE启动Nacos服务器。默认情况下，Derby数据库的数据文件将存储在Nacos服务器的工作目录下，比如`./nacos/data`目录。

4. **注意事项**：
   - Derby数据库适用于测试和轻量级应用，因为它不支持高并发访问，且数据存储容量有限。
   - 当Nacos以集群模式部署时，虽然Derby支持网络模式，但并不推荐用于生产环境，因为它的Raft协议实现复杂度较高，且不如MySQL等成熟数据库稳定可靠。
   - 数据持久化和备份：使用Derby时，要注意定期备份数据文件，以防数据丢失。由于Derby默认的存储模式可能不适合所有场景，了解其特性并根据实际需求调整是必要的。

综上所述，不使用外部数据库配置Nacos主要就是利用其默认的Derby数据库设置，无需复杂的数据库连接和配置，直接启动即可。但请根据生产环境的需求考虑是否适合长期使用Derby作为数据存储解决方案。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：Nacos的数据库支持情况介绍 
 
 *专家经验：nacos用户密码设置 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13860)给我们反馈。
