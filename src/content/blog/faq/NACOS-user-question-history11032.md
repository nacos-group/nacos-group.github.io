---
id: "question-history-11032"
title: "Nacos raft日志太大怎么清理 nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource Nacos raft日志太大怎么清理"
tags: ["raft","日志","清理"]
keywords: ["raft","日志","清理"]
---

## 用户问题 ： 
 Nacos raft日志太大怎么清理 nacos-opensource 

---------------
## 专家官方解答 ：

Nacos raft日志清理方法：

**问题原因：**
Nacos依赖Sofa的Jraft实现Raft协议，Jraft使用RocksDB存储raft log。随着时间推移，`$nacos.home/data/protocol/raft/$raft_group/log`目录下会积累大量以`LOG.*`开头的操作日志文件。这些文件可以安全清理，但需注意避免删除其他如`*.sst`、`CURRENT`、`IDENTITY`、`MANIFEST-*`、`OPTIONS-*`等文件，以免引起Jraft运行异常，导致Nacos数据不一致或无法变更。

**解决方案：**
1. **定期执行清理命令：**
   ```
   rm -f LOG.old.*
   echo "" > LOG
   ```
   上述命令中：
   - `rm -f LOG.old.*`：删除所有以`LOG.old.`开头的日志文件，`-f`选项表示强制删除，无需用户确认。
   2. `echo "" > LOG`：清空当前日志文件（即`LOG`），将一个空字符串写入该文件，从而实现日志清理。

通过执行上述步骤，可以有效地清理Nacos raft日志，释放磁盘空间，同时确保不会误删关键文件，保障Nacos服务的稳定运行。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:Nacos raft日志太大怎么清理 
 
 *专家经验:如何获取Nacos-Client的日志？ 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11684)给我们反馈。
