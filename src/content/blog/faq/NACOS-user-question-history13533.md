---
id: "question-history-13533"
title: "docker nacos 2.2.3开启鉴权的具体流程 nacos-opensource"
date: "2024-05-17"
category: expertConsultation
description: "nacos-opensource docker nacos 2.2.3开启鉴权的具体流程"
tags: ["docker","nacos","2.2.3","开启鉴权","具体流程"]
keywords: ["docker","nacos","2.2.3","开启鉴权","具体流程"]
---

## 用户问题 ： 
 docker nacos 2.2.3开启鉴权的具体流程 nacos-opensource 

---------------
## 专家官方解答 ：

在Nacos 2.2.3版本中，针对Docker部署环境下开启鉴权的具体流程如下：

1. **修改token.secret.key与identity.key配置**
   - **Docker镜像部署场景下**，首先需要为Nacos容器添加环境变量以修改默认密钥和身份标识：
     - 添加环境变量`NACOS_AUTH_TOKEN`，设置为一个自定义的Base64字符串，确保其长度不低于32字符，并在所有Nacos容器中保持一致。
     - 添加环境变量`NACOS_AUTH_IDENTITY_KEY`和`NACOS_AUTH_IDENTITY_VALUE`，分别设置为自定义的键值对字符串，保持各容器间配置一致。

2. **提前配置应用的Nacos用户信息**
   - 在正式开启鉴权之前，确保所有依赖Nacos的服务应用都已经配置了正确的用户名和密码。默认用户名密码为`nacos/nacos`，但强烈建议使用自定义且安全的凭据。如果应用已配置非默认凭据，此步可忽略。

3. **开启鉴权开关**
   - 对于Docker部署，设置环境变量`NACOS_AUTH_ENABLE`值为`true`以开启鉴权功能。

4. **重启Nacos容器**
   - 应用上述配置更改后，重启所有Nacos容器，使配置生效。

5. **（可选）创建新用户与密码并替换默认凭据**
   - 登录Nacos控制台，检查并删除任何非预期的用户信息。
   - 新建具有适当权限的用户账户，并在应用配置中替换原有的默认或旧用户凭据，随后重启应用以应用新配置。

6. **（可选）修改默认用户密码**
   - 确保所有应用不再依赖默认用户后，修改默认用户`nacos`的密码为强密码。

完成以上步骤后，Nacos的鉴权机制将有效防护未授权访问，保障系统安全。请注意，整个过程应在业务低峰期进行，并确保做好充分的测试与灰度发布，以免影响正常业务运行。

参考链接：
- [阿里云MSE提供的Nacos云服务](https://www.aliyun.com/product/aliware/mse?spm=nacos.cloud.topbar.0.0.0)
- [平滑迁移至阿里云MSE](https://help.aliyun.com/zh/mse/user-guide/migrate-applications-from-self-managed-instances-to-mse-microservices-registry?spm=a2c4g.11186623.0.0.76e17b26TS1Abr)
- [免费试用Nacos云服务](https://free.aliyun.com/?searchKey=nacos&spm=nacos.cloud.topbar.0.0.0)


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:Nacos鉴权相关建议 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=13536)给我们反馈。
