---
id: "question-history-8459"
title: "请教下 nacos服务端 这里的节点同时展示了IPV4和IPV6 怎么只展示IPV6 谢谢 nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource 请教下 nacos服务端 这里的节点同时展示了IPV4和IPV6 怎么只展示IPV6 谢谢"
tags: ["nacos服务端","节点","IPV4","IPV6","只展示IPV6"]
keywords: ["nacos服务端","节点","IPV4","IPV6","只展示IPV6"]
---

## 用户问题 ： 
 请教下 nacos服务端 这里的节点同时展示了IPV4和IPV6 怎么只展示IPV6 谢谢 nacos-opensource 

---------------
## 专家官方解答 ：

在Nacos服务端中，节点同时展示IPv4和IPv6是因为Nacos服务器可能处于双栈（IPv4/IPv6）环境下，默认情况下，Nacos会识别并显示当前可用的所有网络接口信息。如果您希望Nacos服务端仅展示IPv6地址，可以按照以下步骤进行配置：

1. **设置Nacos Server端强制使用IPv6**：
   在Nacos服务器的配置文件（通常是 `conf/application.properties`）中，添加或修改以下配置项，以强制指定使用IPv6地址：

   ```properties
   nacos.inetutils.ip-address=::1
   ```

   这里将`nacos.inetutils.ip-address`设置为本地回环IPv6地址`::1`作为示例。请根据实际情况替换为您的实际IPv6地址。

   **注意**：从Nacos 2.1版本开始，Nacos Server端已能自动识别IPv4或IPv6环境，无需手动配置。但在某些特定场景下（如需要强制使用IPv6），仍可使用上述配置来实现。

2. **更新`cluster.conf`文件**：
   如果您的Nacos集群采用`cluster.conf`文件进行节点配置，请确保其中列出的每个节点地址均为IPv6地址，例如：

   ```
   ::1:8848
   ```

   确保不再包含任何IPv4地址，以确保集群间通信仅通过IPv6进行。

3. **重启Nacos服务**：
   完成上述配置更改后，重启Nacos服务以使新配置生效。在Linux系统中，通常可以通过以下命令重启：

   ```bash
   sh bin/nacos.sh restart
   ```

   或者，如果您使用的是Docker部署，相应地重启容器。

通过以上步骤，Nacos服务端应仅展示IPv6地址，不再显示IPv4地址。这将确保Nacos在节点展示、服务发现以及集群内部通信等方面均基于IPv6协议进行。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:Nacos是否支持IPV6 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11639)给我们反馈。
