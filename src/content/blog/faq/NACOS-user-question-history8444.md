---
id: "question-history-8444"
title: "各位大佬，想咨询下，怎么在 Nacos 2.3.0 通过helm方式部署设置开启授权认证功能？ nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "要在 Nacos 2.3.0 版本中通过 Helm 方式部署并设置开启授权认证功能，可以遵循以下步骤操作：1. **准备鉴权相关配置参数**：   根据 Nacos 的官方文档和已知信息，开启鉴权需要配置以下几个关键参数：   - `nacos.core.auth.enabled=true`：启用鉴"
tags: ["Nacos","2.3.0","helm","部署","开启","授权认证","功能"]
keywords: ["Nacos","2.3.0","helm","部署","开启","授权认证","功能"]
---

要在 Nacos 2.3.0 版本中通过 Helm 方式部署并设置开启授权认证功能，可以遵循以下步骤操作：

1. **准备鉴权相关配置参数**：
   根据 Nacos 的官方文档和已知信息，开启鉴权需要配置以下几个关键参数：
   - `nacos.core.auth.enabled=true`：启用鉴权功能。
   - `nacos.core.auth.plugin.nacos.token.secret.key`：设置一个强密码作为Token的密钥，推荐使用大于32位的字符串，并进行Base64编码。
   - `nacos.core.auth.server.identity.key`：自定义服务端身份识别的Key。
   - `nacos.core.auth.server.identity.value`：自定义服务端身份识别的Value。

2. **修改 Helm Chart 的 Values 文件**：
   在使用 Helm 部署 Nacos 时，你需要自定义这些鉴权相关的参数。通常，这涉及到修改 Helm Chart 中的 `values.yaml` 文件或在 Helm 安装命令中通过 `--set` 参数来传递这些值。具体操作如下：

   ```shell
   # 假设你已经下载了 Nacos 的 Helm Chart
   helm install my-nacos nacos-server/nacos \
     --set nacos.core.auth.enabled=true \
     --set nacos.core.auth.plugin.nacos.token.secret.key=<YOUR_ENCODED_SECRET_KEY> \
     --set nacos.core.auth.server.identity.key=myIdentityKey \
     --set nacos.core.auth.server.identity.value=myIdentityValue
   ```

   其中 `<YOUR_ENCODED_SECRET_KEY>` 应替换为你事先准备好的、经过Base64编码的密钥字符串。

3. **确保集群一致性**：
   确保如果你部署的是Nacos集群，每个节点都应配置相同的鉴权参数，特别是`nacos.core.auth.server.identity.key`和`nacos.core.auth.server.identity.value`，以避免服务端之间通信出现问题。

4. **验证部署**：
   完成部署后，你应该验证Nacos服务是否成功开启了鉴权功能。可以通过尝试访问Nacos UI界面或API接口，看是否需要进行身份验证。

参考文档链接：
- [Nacos官方文档-鉴权指南](https://nacos.io/docs/latest/guide/user/auth/)
- [Nacos Docker部署说明](https://github.com/nacos-group/nacos-docker)
- [Nacos身份认证绕过漏洞说明](https://nacos.io/blog/announcement-token-secret-key/?source=activity)

请注意，上述步骤基于Nacos的一般配置逻辑和Helm的通用用法。具体到Nacos 2.3.0版本和特定的Helm Chart实现细节，可能还需查阅该版本和Chart的最新文档以获取最准确的指导信息。
## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13662)给我们反馈。
