---
id: "question-history-15962"
title: "nacos 多语言支持"
date: "2024-06-28"
category: "expertConsultation"
description: "Nacos确实支持多语言服务发现与配置管理。根据提供的信息，我们可以看到Nacos为多种编程语言提供了SDK，这些SDK由官方或社区维护。以下是不同语言的Nacos SDK概况及与Nacos Server的版本兼容性：1. **Go**:     - SDK地址：[nacos-sdk-go](htt"
---

## 用户问题 ： 
 nacos 多语言支持  

---------------
## 专家官方解答 ：

Nacos确实支持多语言服务发现与配置管理。根据提供的信息，我们可以看到Nacos为多种编程语言提供了SDK，这些SDK由官方或社区维护。以下是不同语言的Nacos SDK概况及与Nacos Server的版本兼容性：

1. **Go**:  
   - SDK地址：[nacos-sdk-go](https://github.com/nacos-group/nacos-sdk-go)
   - 版本匹配：Go version > 1.15，Nacos version > 2.x

2. **Node.js**:  
   - SDK地址：[nacos-sdk-nodejs](https://github.com/nacos-group/nacos-sdk-nodejs)
   - 版本匹配：0.x.0 对应 Nacos 1.x；1.0.0 对应 Nacos 2.x，另外还有[rust客户端的Nodejs绑定](https://github.com/opc-source/nacos-sdk-rust-binding-node)可用于Nacos 2.0的grpc交互。

3. **Lua**:  
   - SDK地址：[nacos-sdk-lua](https://github.com/nacos-group/nacos-sdk-lua)
   - 版本匹配：Nacos 1.x 使用 nacos1.x分支；Nacos 2.x 使用 main 分支。

4. **Rust**:  
   - SDK地址：[nacos-sdk-rust](https://github.com/nacos-group/nacos-sdk-rust)
   - 版本匹配：仅支持Nacos 2.x Server。

5. **C/C++**:  
   - SDK地址：[nacos-sdk-cpp](https://github.com/nacos-group/nacos-sdk-cpp)

6. **C#**:  
   - SDK地址：[nacos-sdk-csharp](https://github.com/nacos-group/nacos-sdk-csharp)

7. **Python**:  
   - SDK地址：[nacos-sdk-python](https://github.com/nacos-group/nacos-sdk-python)
   - 版本匹配：当前主要支持Nacos 1.x，但可通过[rust客户端的Python绑定](https://github.com/nacos-group/nacos-sdk-rust?tab=readme-ov-file)来支持Nacos 2.0。

8. **PHP**:  
   - SDK地址：[nacos-sdk-php](https://github.com/nacos-group/nacos-sdk-php)

请注意，尽管Nacos为多种语言提供了SDK，但不同语言SDK的功能完备度和更新频率可能因社区维护力度而异。对于希望使用最新Nacos特性的开发者，建议直接查看对应语言的SDK仓库以获取最新的兼容性和功能信息。

如果您需要了解更具体的操作步骤或遇到特定语言集成的问题，请提供更详细的情况描述或直接查阅上述链接中的文档和示例代码。


<font color="#949494">---------------</font> 


## 参考链接 ：

* 专家经验：nacos 多语言支持 
 
 * 专家经验：nacos支持服务列表分组隔离了嘛 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=15963)给我们反馈。
