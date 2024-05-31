---
id: "question-history-10488"
title: "#Nacos支持哪些存储介质？ nacos-opensource"
date: "2024-05-17"
category: "expertConsultation"
description: "Nacos主要支持以下存储介质：1. **MySQL**：Nacos官方默认支持MySQL作为配置数据的存储后台，要求版本为5.6及以上。这为大多数用户提供了一个稳定且广泛使用的存储选项。2. **Derby**：除了MySQL，Nacos还内置支持Derby数据库，这是一个轻量级的嵌入式数据库，适"
tags: ["Nacos","存储介质"]
keywords: ["Nacos","存储介质"]
---

## 用户问题 ： 
 #Nacos支持哪些存储介质？ nacos-opensource 

---------------
## 专家官方解答 ：

Nacos主要支持以下存储介质：

1. **MySQL**：Nacos官方默认支持MySQL作为配置数据的存储后台，要求版本为5.6及以上。这为大多数用户提供了一个稳定且广泛使用的存储选项。

2. **Derby**：除了MySQL，Nacos还内置支持Derby数据库，这是一个轻量级的嵌入式数据库，适用于测试和轻量级部署场景，无需单独安装部署。

3. **PostgreSQL**：自Nacos 2.2版本起，通过引入数据源插件机制，官方已支持PostgreSQL数据库，满足希望使用PostgreSQL的用户需求。

4. **Oracle**：同样从2.2版本开始，Nacos增加了对Oracle数据库的支持，适合那些已经在企业环境中广泛使用Oracle的用户。

5. **达梦数据库**：作为对国产数据库支持的一部分，Nacos也兼容达梦数据库。

对于其他数据库类型，如国产的GaussDB或GoldenDB，以及Microsoft SQL Server等，虽然Nacos官方没有直接声明支持，但通过其提供的数据源插件扩展机制，用户可以根据文档自行开发适配插件来实现对这些数据库的支持。具体操作步骤如下：

- **检查插件**: 首先访问[Nacos数据源插件仓库](https://github.com/nacos-group/nacos-plugin)，查看是否有社区已贡献的对应数据库插件。
  
- **自定义开发**: 如未找到现成插件，参考[Nacos数据源插件开发文档](https://nacos.io/docs/latest/plugin/datasource-plugin/)自行开发。
  
- **插件部署**: 将开发或获取到的插件放置到`nacos-server/plugins`目录下。
  
- **配置修改**: 在`nacos-server/conf/application.properties`中，调整数据库配置项，如数据库类型、URL、用户名、密码等，以匹配所选用的数据库。

- **启动Nacos**: 完成上述步骤后，启动Nacos服务器，此时Nacos将使用指定的数据库作为配置存储介质。

综上所述，Nacos不仅支持常见的MySQL和Derby，还通过扩展机制兼容了包括PostgreSQL、Oracle在内的多种数据库，确保了在不同环境下的灵活性和适应性。对于特定数据库的支持，用户可以根据实际情况选择官方支持的数据库或自主开发插件以满足需求。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：主流的配置中心有哪些？ 
 
 *专家经验：Nacos的数据库支持情况介绍 
 
 *专家经验：Nacos 介绍 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13685)给我们反馈。
