---
id: "question-history-8431"
title: "请帮忙看看，按照如下配置，nacos IPV6注册失败的错误 谢谢~~~Nacos服务端版本  2.2.3 单机版本  客户端版本是nacos-client-1.4.6.jar 。nacos conf application.properties新增如下配置spring.cloud.nacos.discovery.prefer-ipv6-address=true启动nacos,启动正常，且显示已经是IPV6类型。应用配置nacos地址如下application.properties文件：spring.cloud.nacos.discovery.server-addr=fe80::3a66:fb19:39ff:8072:8848启动后报错信息如下：com.alibaba.nacos.api.exception.NacosException: failed to req API: nacos v1 ns instance after all servers ([fe80::3a66: fb19:39ff:8072:8848]) tried: java.net.MalformedURLException: For input string: :3a66: fb19:39ff:8072:8848:8848 已经配置了：spring.cloud.nacos.discovery.prefer-ipv6-address=true server.ipv6=true server.listen=[::]:8848 nacos-opensource"
date: "2024-04-23"
category: expertConsultation
description: "nacos-opensource 请帮忙看看，按照如下配置，nacos IPV6注册失败的错误 谢谢~~~Nacos服务端版本  2.2.3 单机版本  客户端版本是nacos-client-1.4.6.jar 。nacos conf application.properties新增如下配置spring.cloud.nacos.discovery.prefer-ipv6-address=true启动nacos,启动正常，且显示已经是IPV6类型。应用配置nacos地址如下application.properties文件：spring.cloud.nacos.discovery.server-addr=fe80::3a66:fb19:39ff:8072:8848启动后报错信息如下：com.alibaba.nacos.api.exception.NacosException: failed to req API: nacos v1 ns instance after all servers ([fe80::3a66: fb19:39ff:8072:8848]) tried: java.net.MalformedURLException: For input string: :3a66: fb19:39ff:8072:8848:8848 已经配置了：spring.cloud.nacos.discovery.prefer-ipv6-address=true server.ipv6=true server.listen=[::]:8848"
---

## 用户问题 ： 
 请帮忙看看，按照如下配置，nacos IPV6注册失败的错误 谢谢~~~Nacos服务端版本  2.2.3 单机版本  客户端版本是nacos-client-1.4.6.jar 。nacos conf application.properties新增如下配置spring.cloud.nacos.discovery.prefer-ipv6-address=true启动nacos,启动正常，且显示已经是IPV6类型。应用配置nacos地址如下application.properties文件：spring.cloud.nacos.discovery.server-addr=fe80::3a66:fb19:39ff:8072:8848启动后报错信息如下：com.alibaba.nacos.api.exception.NacosException: failed to req API: nacos v1 ns instance after all servers ([fe80::3a66: fb19:39ff:8072:8848]) tried: java.net.MalformedURLException: For input string: ":3a66: fb19:39ff:8072:8848:8848" 已经配置了：spring.cloud.nacos.discovery.prefer-ipv6-address=true server.ipv6=true server.listen=[::]:8848 nacos-opensource 

---------------
## 专家官方解答 ：

根据您提供的问题描述和参考知识，您的Nacos服务端版本为2.2.3（单机版），客户端版本为nacos-client-1.4.6.jar，已尝试配置IPv6以实现注册，但遇到注册失败的错误。具体配置如下：

1. **服务端配置**：
   - application.properties中新增`spring.cloud.nacos.discovery.prefer-ipv6-address=true`
   - 显示服务端已启动正常并处于IPv6模式。
   - 可能还配置了`server.ipv6=true` 和 `server.listen=[::]:8848`

2. **客户端配置**：
   - application.properties中设置`spring.cloud.nacos.discovery.server-addr=fe80::3a66:fb19:39ff:8072:8848`

3. **错误信息**：
   - 报错内容为`com.alibaba.nacos.api.exception.NacosException: failed to req API:/nacos/v1/ns/instance after all servers ([fe80::3a66: fb19:39ff:8072:8848]) tried: java.net.MalformedURLException: For input string: ":3a66: fb19:39ff:8072:8848:8848"`

**原因分析**：

错误信息提示客户端在尝试连接服务端时抛出了`MalformedURLException`，具体指出“输入字符串”错误：“:3a66: fb19:39ff:8072:8848:8848”。从这个错误字符串可以看出，端口号“8848”被重复写入，导致URL格式不正确。

参考知识中提到，对于Nacos-Client，可以直接设置地址为IPv6地址，如`properties.setProperty("serverAddr", "ipv6:8848")`。但在您的配置中，客户端地址设置为`spring.cloud.nacos.discovery.server-addr=fe80::3a66:fb19:39ff:8072:8848`，包含了端口号。由于Nacos服务端已经监听在`[::]:8848`，客户端在配置地址时无需再次指定端口。

**解决步骤**：

基于上述分析，调整客户端配置，移除端口信息，以修复URL格式错误。具体步骤如下：

1. **修改客户端application.properties**：
   - 将`spring.cloud.nacos.discovery.server-addr`的值更改为仅包含IPv6地址，去掉端口部分：
     ```properties
     spring.cloud.nacos.discovery.server-addr=fe80::3a66:fb19:39ff:8072
     ```

2. **重新构建并启动客户端**：
   - 保存修改后的配置文件。
   - 重新构建或重启您的应用程序，使新的配置生效。

经过以上调整，客户端应能正确连接到配置的IPv6地址（`fe80::3a66:fb19:39ff:8072`）上的Nacos服务端（监听端口为8848），从而解决注册失败的问题。

总结：问题在于客户端配置的Nacos服务器地址包含了重复的端口信息，导致MalformedURLException。解决方案是调整客户端配置，仅保留IPv6地址部分，去掉端口。


<font color="#949494">---------------</font> 


## 参考链接 ：

*专家经验:Nacos是否支持IPV6 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://opensource.alibaba.com/chatBot) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=11615)给我们反馈。
