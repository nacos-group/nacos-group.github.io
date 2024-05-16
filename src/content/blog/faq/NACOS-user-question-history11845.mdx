---
id: "question-history-11845"
title: "nacos v1 core cluster nodes 的访问权限如何关闭？防止漏洞 nacos-opensource"
date: "2024-04-25"
category: expertConsultation
description: "nacos-opensource nacos v1 core cluster nodes 的访问权限如何关闭？防止漏洞"
tags: ["访问权限","关闭","漏洞"]
keywords: ["访问权限","关闭","漏洞"]
---

## 用户问题 ： 
  nacos v1 core cluster nodes 的访问权限如何关闭？防止漏洞
 nacos-opensource 

---------------
## 专家官方解答 ：

要关闭/nacos/v1/core/cluster/nodes 的访问权限并防止相关漏洞，可以按照以下步骤操作：

1. **修改Nacos配置文件**：
   - 找到Nacos服务器上的配置文件 `config.properties`。
   - 在文件中添加以下配置行以禁用安全性相关的功能，从而关闭节点列表接口的访问权限：
     ```
     security.disabled=true
     ```

2. **重启Nacos服务**：
   - 保存修改后的 `config.properties` 文件。
   - 重启Nacos服务以使新的配置生效。具体重启命令取决于您的部署方式（如通过Docker、脚本、服务管理工具等），通常涉及停止当前运行的服务进程，然后再启动。

3. **注意管理功能影响与备份**：
   - 关闭节点列表接口会影响Nacos的管理界面，因为它依赖该接口获取集群中所有节点的信息。因此，在关闭接口前，请确保您已了解并接受这一影响。
   - 建议在进行以上配置更改之前，对Nacos服务及重要数据进行备份，以防万一需要回滚到之前的设置。

4. **处理身份认证绕过漏洞**：
   - 根据提供的参考内容，检查当前使用的Nacos版本。若版本低于1.4.1，请立即升级到最新版本，并修改nacos用户的密码。
   - 确保开启鉴权：
     ```
     nacos.core.auth.enabled=true
     ```
   - 修改默认的密钥值，包括：
     ```
     nacos.core.auth.plugin.nacos.token.secret.key
     nacos.core.auth.server.identity.key
     nacos.core.auth.server.identity.value
     ```
     使用强随机生成的新值替换原有默认值，以增强安全性。
   - 若版本介于1.4.1至1.4.5之间或处于2.0.0至2.2.0版本区间，即使机制上不存在身份认证绕过漏洞，也需检查并修改上述密钥值，避免使用默认值。
   - 若版本高于1.4.5或2.2.0.1，理论上不存在身份认证绕过漏洞。若仍被检测出此类漏洞，建议联系扫描漏洞的安全工程师核实情况。

通过执行上述步骤，您可以成功关闭/nacos/v1/core/cluster/nodes 的访问权限，并根据Nacos版本采取相应措施应对身份认证绕过漏洞，提升系统安全性。记得在进行关键变更前备份数据，并密切关注管理功能的可用性。如有疑问或需要更多帮助，请查阅Nacos官方文档。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:/nacos/v1/core/cluster/nodes 这个访问权限如何关闭？ 
 
 *专家经验:Nacos 身份认证绕过漏洞 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11847)给我们反馈。
