---
id: "question-history-13942"
title: "nacos启动命令是什么？ nacos-opensource"
date: "2024-05-21"
category: "expertConsultation"
description: "Nacos的启动命令根据您的操作系统有所不同：#### 对于Linux/Unix/Mac系统：启动命令为（以单机模式运行）：```shellsh startup.sh -m standalone```如果在Ubuntu系统上运行上述命令遇到问题，可以尝试使用bash命令执行：```shellbash"
tags: ["启动命令"]
keywords: ["启动命令"]
---

Nacos的启动命令根据您的操作系统有所不同：

#### 对于Linux/Unix/Mac系统：
启动命令为（以单机模式运行）：
```shell
sh startup.sh -m standalone
```
如果在Ubuntu系统上运行上述命令遇到问题，可以尝试使用bash命令执行：
```shell
bash startup.sh -m standalone
```

#### 对于Windows系统：
启动命令（同样是以单机模式运行）为：
```cmd
startup.cmd -m standalone
```
您也可以直接双击`shutdown.cmd`文件来关闭Nacos服务器。

这些命令都是在Nacos的安装目录下的`bin`文件夹中执行的。请确保您已经完成了Nacos的下载、解压以及必要配置之后，再执行相应的启动命令。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13943)给我们反馈。
