---
id: "question-history-15441"
title: "2.1.2版本如何禁用鉴权功能 nacos-opensource"
date: "2024-06-17"
category: "expertConsultation"
description: "要禁用Nacos-OpenSource 2.1.2版本的鉴权功能，您需要调整其配置文件`application.properties`中的相关设置。根据提供的知识，您可以遵循以下步骤操作：1. **定位配置文件**：   确保您能够访问到Nacos服务器的配置文件`application.prope"
---

## 用户问题 ： 
 2.1.2版本如何禁用鉴权功能 nacos-opensource 

---------------
## 专家官方解答 ：

要禁用Nacos-OpenSource 2.1.2版本的鉴权功能，您需要调整其配置文件`application.properties`中的相关设置。根据提供的知识，您可以遵循以下步骤操作：

1. **定位配置文件**：
   确保您能够访问到Nacos服务器的配置文件`application.properties`。此文件通常位于Nacos服务器的安装目录下。

2. **修改配置项**：
   在`application.properties`文件中，找到或添加以下配置项来控制鉴权功能的状态：
   ```properties
   ### If turn on auth system:
   nacos.core.auth.enabled=false
   ```
   确保此行设置为`false`，这表示禁用鉴权功能。

3. **保存并应用更改**：
   保存对`application.properties`文件所做的更改。

4. **无需重启服务端**：
   根据知识中的说明，鉴权开关修改后是立即生效的，理论上您不需要重启Nacos服务端。但为了确保配置确实生效，以及排除任何潜在的缓存问题，建议在低峰期或维护窗口重启Nacos服务端一次。

**解释**：
- 通过将`nacos.core.auth.enabled`设置为`false`，我们直接关闭了Nacos的鉴权系统，这意味着用户在访问Nacos配置中心时不再需要提供用户名和密码。
- 虽然知识中提到动态修改某些鉴权相关配置（如`token.secret.key`）需谨慎以避免登录异常，但禁用鉴权功能的操作不会遇到此类风险，因为这本质上是恢复到未启用鉴权的状态。
- 重启服务虽然不是强制要求，但在某些情况下重启可以确保所有依赖于这些配置的组件或服务都能正确加载最新的设置，避免因配置未刷新导致的问题。

综上所述，只需简单修改配置文件并考虑重启服务，即可禁用Nacos 2.1.2版本的鉴权功能。


<font color="#949494">---------------</font> 


## 参考链接 ：

*[Authorization](https://nacos.io/docs/latest/guide/user/auth)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=15511)给我们反馈。
