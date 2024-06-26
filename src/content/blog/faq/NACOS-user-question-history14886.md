---
id: "question-history-14886"
title: "K8S部署的怎么开启nacos.core.auth.enabled=true nacos-opensource"
date: "2024-06-02"
category: "expertConsultation"
description: "要在一个Kubernetes(K8s)集群中部署的Nacos实例上开启鉴权功能，即设置`nacos.core.auth.enabled=true`，你可以按照以下步骤操作：1. **准备环境变量**: 根据Nacos官方提供的Kubernetes部署指南和镜像文档，你需要在部署Nacos的Kuber"
---

## 用户问题 ： 
 K8S部署的怎么开启nacos.core.auth.enabled=true nacos-opensource 

---------------
## 专家官方解答 ：

要在一个Kubernetes(K8s)集群中部署的Nacos实例上开启鉴权功能，即设置`nacos.core.auth.enabled=true`，你可以按照以下步骤操作：

1. **准备环境变量**: 根据Nacos官方提供的Kubernetes部署指南和镜像文档，你需要在部署Nacos的Kubernetes配置中设置相应的环境变量。具体来说，需要设置以下环境变量来开启鉴权并配置相关参数：

   - `NACOS_AUTH_ENABLE=true`: 用来开启鉴权功能。
   - `NACOS_AUTH_TOKEN`: 如果使用默认的token鉴权插件，需要设置此环境变量来指定用于生成Token的密钥。注意这个值应该是一个大于32位的字符串，并且建议进行base64编码处理以增加安全性。
   - `NACOS_AUTH_IDENTITY_KEY`: 设置身份识别的key，避免使用默认值以增强安全性。
   - `NACOS_AUTH_IDENTITY_VALUE`: 设置身份识别的value，同样避免使用默认值。

2. **修改部署配置**: 如果你已经在K8s中部署了Nacos，可以通过编辑Deployment或者StatefulSet的YAML配置文件来添加这些环境变量。例如，在Nacos的Pod规范中添加如下环境变量部分：

   ```yaml
   spec:
     containers:
     - name: nacos-server
       image: nacos/nacos-server
       env:
       - name: NACOS_AUTH_ENABLE
         value: "true"
       - name: NACOS_AUTH_TOKEN
         valueFrom:
           secretKeyRef:
             name: nacos-auth-secret
             key: tokenKey
       - name: NACOS_AUTH_IDENTITY_KEY
         value: "yourCustomIdentityKey"
       - name: NACOS_AUTH_IDENTITY_VALUE
         value: "yourCustomIdentityValue"
   ```

   注意，这里假设你已经创建了一个名为`nacos-auth-secret`的Kubernetes Secret来安全地存储`NACOS_AUTH_TOKEN`的值。

3. **应用更改**: 使用`kubectl apply -f your-nacos-deployment.yaml`命令更新你的Nacos部署配置。

4. **验证设置**: 更新后，检查Nacos的日志确认鉴权功能已成功开启，并确保服务间的通信未受影响。

5. **参考文档**: 更多详细配置和注意事项，可以参考Nacos官方文档的鉴权部分和Kubernetes部署指南：
   - [Nacos鉴权配置文档](https://nacos.io/docs/latest/guide/user/auth/)
   - [Nacos Docker镜像文档](https://github.com/nacos-group/nacos-docker)

通过以上步骤，你就可以在Kubernetes集群部署的Nacos中成功开启鉴权功能并进行相应的安全配置了。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验：Nacos部署集群模式怎么打开鉴权 
 
 *专家经验：nacos的部署 
 
 *[Nacos功能和需求列表](https://nacos.io/docs/latest/archive/feature-list)


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=14909)给我们反馈。
