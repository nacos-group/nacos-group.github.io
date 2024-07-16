---
id: "question-history-15244"
title: "nacos放在公网上，怎么开启鉴权"
date: "2024-07-15"
category: "expertConsultation"
description: "为了在公网环境下安全地部署Nacos并开启鉴权功能，您可以遵循以下步骤操作：### 1. 确认Nacos版本与鉴权需求确保您了解当前Nacos的版本信息，因为不同版本的鉴权配置略有差异。特别是从Nacos 2.2.3版本开始，默认不再提供默认密钥，以增强安全性。### 2. 开启鉴权功能#### 修"
---

## 用户问题 ： 
 nacos放在公网上，怎么开启鉴权  

---------------
## 专家官方解答 ：

为了在公网环境下安全地部署Nacos并开启鉴权功能，您可以遵循以下步骤操作：

### 1. 确认Nacos版本与鉴权需求
确保您了解当前Nacos的版本信息，因为不同版本的鉴权配置略有差异。特别是从Nacos 2.2.3版本开始，默认不再提供默认密钥，以增强安全性。

### 2. 开启鉴权功能
#### 修改配置参数
您需要调整以下几个关键配置参数以开启鉴权：
- `nacos.core.auth.enabled`: 设置为`true`以启用鉴权功能。
- `nacos.core.auth.plugin.nacos.token.secret.key`: 自定义一个安全的密钥，长度应大于32位，并使用Base64编码后填入。**切勿使用默认值**，以避免安全风险。
- `nacos.core.auth.server.identity.key` 和 `nacos.core.auth.server.identity.value`: 分别设置为自定义的唯一标识键和值，同样避免使用默认值。

### 3. 根据部署方式进行配置
#### 使用Docker部署
如果您是通过Docker部署Nacos，需要在启动容器时设置相应的环境变量：
- `NACOS_AUTH_ENABLE=true`
- `NACOS_AUTH_TOKEN=您自定义的Base64编码后的密钥`
- `NACOS_AUTH_IDENTITY_KEY=您自定义的身份识别键`
- `NACOS_AUTH_IDENTITY_VALUE=您自定义的身份识别值`

#### 使用Kubernetes (K8s) 部署
在K8s环境中，同样需要通过环境变量传递这些配置：
- 设置与Docker部署类似的环境变量至Pod的specification中。

#### 直接使用发行包部署
直接编辑Nacos的配置文件（通常是`application.properties`或`application.yaml`），修改上述提到的鉴权相关参数。

### 4. 完成配置后重启Nacos
完成上述配置更改后，需要重启Nacos服务以使配置生效。

### 5. 测试鉴权配置
确保Nacos重启后，尝试通过鉴权访问Nacos界面或API，验证是否需要输入凭证以及凭证是否有效。

### 注意事项
- 强烈建议使用复杂的密钥，并定期更换以增强安全性。
- 考虑到操作复杂性和潜在的业务影响，建议在业务低峰期进行此操作，并做好充分的测试与灰度发布。
- 如需进一步增强安全性，可以考虑集成TLS加密和使用[阿里云MSE提供的Nacos云服务](https://nacos.io/cloud/?from=wuyi)，它提供了企业级的安全管理能力，包括但不限于鉴权、配置加解密等，并支持平滑迁移，[欢迎免费试用](https://free.aliyun.com/?searchKey=nacos&spm=nacos.cloud.topbar.0.0.0)。

以上步骤基于提供的知识进行了整合和解答，确保了在公网环境下部署Nacos时能够安全地开启鉴权功能。


<font color="#949494">---------------</font> 


## 参考链接 ：

* 专家经验：Nacos不开启鉴权&暴露公网会导致风险 
 
 * 专家经验：Nacos部署集群模式怎么打开鉴权 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=16227)给我们反馈。
