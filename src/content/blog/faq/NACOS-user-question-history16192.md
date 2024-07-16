---
id: "question-history-16192"
title: "当前使用的Nacos版本是1.4.1，如何从该版本升级Spring框架的版本以解决CVE-2024-222"
date: "2024-07-15"
category: "expertConsultation"
description: "要解决Nacos版本1.4.1中由于Spring框架导致的CVE-2024-22243漏洞问题，特别是将`spring.version`升级到5.3.34，你需要按照以下步骤操作：### 分析原因根据提供的知识，CVE-2024-22243漏洞是由Spring框架引入的，影响了那些使用UriComp"
---

## 用户问题 ： 
 当前使用的Nacos版本是1.4.1，如何从该版本升级Spring框架的版本以解决CVE-2024-22243漏洞问题，特别是将`spring.version`升级到5.3.34？  

---------------
## 专家官方解答 ：

要解决Nacos版本1.4.1中由于Spring框架导致的CVE-2024-22243漏洞问题，特别是将`spring.version`升级到5.3.34，你需要按照以下步骤操作：

### 分析原因
根据提供的知识，CVE-2024-22243漏洞是由Spring框架引入的，影响了那些使用UriComponentsBuilder解析外部URL并进行主机验证检查的应用程序。此漏洞可能导致开放重定向攻击或SSRF攻击。为了解决这个问题，Nacos官方推荐将Spring框架的版本升级至5.3.34。

### 升级步骤
1. **检查项目依赖**：首先，检查你的项目中当前Spring框架的版本。这通常在项目的`pom.xml`（对于Maven项目）或`build.gradle`（对于Gradle项目）文件中完成。

2. **更新Spring版本**：在`pom.xml`文件中，定位到Spring框架的依赖声明，将其版本号更新为5.3.34。如果你使用的是Gradle，同样在相应的依赖声明处进行版本更新。示例如下（针对Maven项目）：
   ```xml
   <!-- 在pom.xml中 -->
   <properties>
       <spring.version>5.3.34</spring.version>
   </properties>
   
   <dependencies>
       <dependency>
           <groupId>org.springframework</groupId>
           <artifactId>spring-context</artifactId>
           <version>${spring.version}</version>
       </dependency>
       <!-- 其他Spring相关依赖也应更新版本 -->
   </dependencies>
   ```

3. **解决依赖冲突**：升级Spring框架版本后，可能会遇到依赖冲突的问题。你需要解决这些冲突，确保所有依赖项兼容新版本的Spring。使用IDE的依赖管理工具或命令行工具（如Maven的`dependency:tree`命令或Gradle的`dependencies`任务）来识别并解决冲突。

4. **测试应用**：在完成版本升级和依赖冲突解决后，全面测试你的应用程序，确保所有功能正常工作，没有因升级引起的新问题。

5. **关注Nacos服务器版本**：虽然直接升级Spring框架可以缓解漏洞问题，但考虑到Nacos服务器端也在其2.4.0版本中集成了此修复，你应考虑未来升级到Nacos的最新稳定版本。这可以通过访问[Nacos下载页面](https://nacos.io/download/nacos-server/)获取信息。

### 解释
- **原因分析**：明确漏洞来源于Spring框架，理解升级Spring版本的必要性。
- **升级步骤**：提供具体的操作指南，确保用户能够有条不紊地进行版本升级。
- **测试强调**：强调测试的重要性，确保应用在升级后仍能保持预期功能。
- **未来规划**：提及Nacos服务器端的更新，为用户提供更全面的升级路径建议。

请注意，实际操作中可能需要根据你的项目具体情况做适当调整。如果在升级过程中遇到特定问题，可能需要查阅更详细的Spring框架升级指南或寻求社区帮助。


<font color="#949494">---------------</font> 


## 参考链接 ：

* 专家经验：nacos CVE-2024-22243 情况说明 
 
 * 专家经验：nacos哪个版本最常用 
 
 * 专家经验：springcloud alibaba 和nacos版本对应 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=16202)给我们反馈。
