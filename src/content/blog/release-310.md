---
title: Nacos 3.1.0 正式发布，支持A2A注册中心与MCP注册协议增强
keywords: [3.1.0, A2A Registry, MCP Registry]
description: Nacos 3.1.0 正式发布，作为全新的里程碑版本，3.1.0在A2A（Agent-to-Agent）注册中心和MCP（Model-Context-Protocol）注册中心两大核心能力上实现重大突破。
date: "2025-09-24"
category: announcement
---

## 1. Nacos 3.1.0 正式发布

Nacos社区正式发布`3.1.0`版本！作为全新的里程碑版本，`3.1.0`在**A2A（Agent-to-Agent）注册中心**和**MCP（Model-Context-Protocol）注册中心**两大核心能力上实现重大突破，同时修复多项历史问题并升级关键依赖。以下是本次版本的核心亮点：

### 1.1. 全新特性：A2A注册中心正式上线
Nacos 3.1.0首次引入**A2A注册中心**功能，为AI代理框架（如`Spring AI Alibaba`）及开发者提供轻量化的Agent服务注册与发现能力。

+ **核心能力**：
    - 支持发布与发现`AgentCard`及Agent服务端点，实现Agent元数据（如名称、版本、描述）的统一管理。
    - 当前支持基于**Agent名称**的精准发现和模糊搜索，未来将扩展基于技能标签（Skills）、描述等多维度的检索能力。
+ **应用场景**：
    - 为分布式AI代理服务提供基础设施，简化Agent生命周期管理。
    - 助力开发者快速构建基于Agent的协作式AI应用。

### 1.2. MCP注册协议能力全面增强
在`3.0.X`版本支持标准MCP Registry API的基础上，3.1.0进一步优化MCP生态兼容性与管理效率：

1. **协议与部署升级**：
    - 更新**官方MCP注册协议**，用户可将Nacos作为私有化MCP注册中心，构建企业级模型市场或服务目录。
    - 新增**MCP服务器导入功能**，支持通过JSON文件快速注册MCP服务，并支持从MCP URL自动获取工具配置。
    - 支持从**MCP官方注册中心**中一键导入MCP服务
2. **安全与管控增强**：
    - 控制台支持**动态启用/禁用MCP服务**，灵活控制资源占用。
    - 新增**MCP工具配置加密**功能，结合配置加密插件保障敏感数据存储安全。
3. **兼容性保障**：
    - 数据结构与协议全面对齐MCP官方标准，确保后续版本升级兼容性。

> 由于MCP官方注册中心协议还属于preview阶段，Nacos目前适配了当前最新版本的协议`2025-07-09`，若MCP官方注册中心协议新版本中存在不兼容改动，可能导致MCP官方注册中心一键导入功能失效。
>
> Nacos 3.1.0版本发布期间，MCP官方发布新了新版本`2025-09-16`的注册中心协议，Nacos 3.1.0已经极速完成了适配，若需要使用该功能请下载最新的Nacos 3.1.0发布包及镜像。
>

### 1.3. 其他重要改进
+ **功能优化**：
    - 新增命名空间存在性校验，避免无效操作。
    - 增强控制台提示，如重复发布Agent名称时的友好提醒。
+ **问题修复**：
    - 修复MySQL与Derby数据库配置发布性能不一致问题。
    - 解决MCP控制台OpenAPI文件解析异常、URL编码错误等问题。
    - 修复A2A订阅判断逻辑、模糊搜索结果异常等关键缺陷。
+ **依赖升级**：
    - 升级Spring Boot至3.4.9、gRPC至1.75.0，提升稳定性与安全性。

> #### **升级注意事项：**
> 1. **从3.1.0-BETA升级：**
     >     - 需在升级前删除所有`AgentCard`，或升级后删除`agent`和`agent-version`配置组，并重新发布`AgentCard`。
> 2. **从3.0.0版本升级：**
     >     - 若从3.0.0版本升级，需使用社区提供的迁移工具将旧版MCP服务迁移至`public`命名空间。
> 3. **从其他版本升级正常升级**
>

更多`3.1.0`版本的变更日志如下:

```markdown
  ## Feature

  [#12191] Add namespace existence check.
  [#13322] Support A2A registry.
  [#13423] Support enabled or disabled MCP server in console.
  [#13543] Add MCP server import functionality with registry support.
  [#13783] Add config metadata update admin api.
  [#13808] Add Support official mcp registry protocol.
  [#13814] Support prompt encrypt for mcp tools.

  ## Enhancement/Refactor

  [#13777] Enhance namespace exist check logic to improve code quality.
  [#13829] Enhance the hint when publish duplicate name of agent.

  ## BugFix

  [#13744] Fix omitted CONFIG_INFO_GRAY_WRAPPER_ROW_MAPPER for config datasource plugin.
  [#13752] Fix NPE and ignore InterruptedException stack log.
  [#13761] Fix add validation when deleting roles to prevent issues like mistakenly deleting ROLE_ADMIN.
  [#13767] Fix service NullPointerException when K8S getSpec().
  [#13773] Fix preserve protocol slashes when building MCP OpenAPI-derived URLs.
  [#13779] Fix Mcp tool description edit limitation.
  [#13787] Fix bug where the Nacos Mcp console cannot correctly parse OpenApi files.
  [#13801] Fix bug that sometimes garbled characters appear when parsing OpenAPI file URL in MCP console.
  [#13810] Fix bug that caused inconsistent performance between Derby and MySQL databases when publishing configurations.
  [#13824][#13826] Fix AI gRPC resource parser and leak auth login for MCP/A2A request in nacos-client.
  [#13830] Fix agentCard subscribe judgement problem.
  [#13832] Fix blur search may contain unexpected results.

  ## Dependencies

  [#13385] Upgrade os-maven-plugin version to 1.7.1.
  [#13711] Upgrade spring boot version to 3.4.9.
  [#13753] Upgrade grpc version to 1.75.0.
  [#13825] Upgrade jraft version to 1.3.15.bugfix.

```

## 2. Nacos + Spring AI Alibaba 快速开发分布式Agent应用
随着**Nacos 3.1.0**及**Spring AI Alibaba**的新版本发布，能够支持快速开发简单的Agent并暴露A2A协议服务，同时注册到Nacos上并让上有Agent应用发现且能够进行远程调用，实现Agent的分布式部署。接下来以`Nacos问答助手`为例，手把手带您实现基于**Nacos 3.1.0**与**Spring AI Alibaba**的分布式AI Agent系统：

> 样例工程已发布至 [nacos-group/nacos-spring-ai-alibaba-example](https://github.com/nacos-group/nacos-spring-ai-alibaba-example)，欢迎尝试。
>

| ![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/297800/1758678429423-d9f581c6-3da2-49c8-83e7-62c468e80135.png) |
| --- |


### 2.1. 环境准备和启动
+ **JDK 17+**
+ **Nacos Server 3.1.0+**
+ **Spring AI Alibaba 1.0.0.4+**
+ **阿里云百炼API KEY**

> Nacos的安装与启动，请参考[Nacos快速开始](https://nacos.io/docs/latest/quickstart/quick-start/?spm=5238cd80.2ef5001f.0.0.3f613b7c7dovyI)或[Nacos Docker 快速开始](https://nacos.io/docs/latest/quickstart/quick-start-docker/?spm=5238cd80.2ef5001f.0.0.3f613b7c7dovyI)进行安装。
>

> 阿里云百炼的API-KEY可参考[文档](https://bailian.console.aliyun.com/?spm=5176.30371578.J_wilqAZEFYRJvCsnM5_P7j.1.e939154a5W1LzI&tab=api&scm=20140722.M_10875430.P_126.MO_3931-ID_10875430-MID_10875430-CID_34338-ST_14391-V_1#/api/?type=model&url=2712195)获取，若已获取，则忽略此步骤。
>
> 首次开通阿里云百炼时会提供100万Token的免费额度。
>

### 2.2. 构建A2A Server Agent

#### 2.2.1. 引入pom
```xml
<properties>
  <spring.ai.alibaba.version>1.0.0.4</spring.ai.alibaba.version>
</properties>

<dependencies>
  <!-- 引入A2A Server starter -->
  <dependency>
    <groupId>com.alibaba.cloud.ai</groupId>
    <artifactId>spring-ai-alibaba-starter-a2a-server</artifactId>
    <version>${spring.ai.alibaba.version}</version>
  </dependency>
  <!-- 引入A2A Nacos 注册中心 -->
  <dependency>
    <groupId>com.alibaba.cloud.ai</groupId>
    <artifactId>spring-ai-alibaba-starter-a2a-registry</artifactId>
    <version>${spring.ai.alibaba.version}</version>
  </dependency>
  <!-- 引入A2A 百炼大模型客户端，可以用其他的spring ai大模型客户端代替，如openai -->
  <dependency>
    <groupId>com.alibaba.cloud.ai</groupId>
    <artifactId>spring-ai-alibaba-starter-dashscope</artifactId>
    <version>${spring.ai.alibaba.version}</version>
  </dependency>
</dependencies>
```

#### 2.2.2. 添加配置文件`application.yml`
```yaml
server:
  port: 9999

spring:
  application:
    name: a2s-server-example
  ai:
    # 配置百炼大模型
    dashscope:
      api-key: ${BAILIAN_API_KEY}
      base-url: https://dashscope.aliyuncs.com/compatible-mode
      chat:
        options:
          model: qwen-plus-latest
    alibaba:
      a2a:
        # 配置Nacos的地址和用户名密码
        nacos:
          server-addr: ${NACOS_ADDRESS:localhost:8848}
          username: ${NACOS_USERNAME:nacos}
          password: ${NACOS_PASSWORD}
        # 配置A2A server的额外信息，如版本号，agentCard中的Skills等
        server:
          version: 1.0.1
          card:
            url: http://localhost:9999/a2a
            skills:
              - id: nacos-question-answer
                name: Nacos Question Answer
                description: Answer questions about Nacos.
                tags:
                  - Nacos
                examples:
                  - What is Nacos?
            icon-url: https://img.alicdn.com/imgextra/i4/O1CN01rW3vAB1FDWKSOiFf0_!!6000000000453-2-tps-204-40.png
            documentation-url: https://nacos.io
            provider:
              organization: Alibaba
              url: https://www.alibaba.com
logging:
  level:
    root: debug
```

#### 2.2.3. 构建A2A Server Agent代码
```java
/**
 * Spring AI Alibaba 启动类
 */
@SpringBootApplication
public class A2aServerExampleApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(A2aServerExampleApplication.class, args);
    }
}

/**
 * Spring AI Alibaba Agentic API构建LLMAgent
 */
@Configuration
public class RootAgentConfiguration {
    
    private static final String SYSTEM_PROMPT =
            "An assistant or maintainer for nacos. You only try to answer nacos' question. "
                    + "If user ask not nacos relative question, Please answer with apology. \n When you answer Nacos' question, "
                    + "you can try to use relative tools to query data and do analyze. If no suitable tools found, please answer Nacos' question by your knowledge.\n";
    
    @Bean
    @Primary
    public BaseAgent rootAgent(ChatModel chatModel) throws GraphStateException {
        return ReactAgent.builder().name("Nacos Agent").description(
                        "Answer question about Nacos and do some maintain and query operation about Nacos Cluster.")
                .model(chatModel).instruction(SYSTEM_PROMPT).outputKey("output").build();
    }
}

```



至此，仅需3步完成A2A Server Agent的构建和开发， 之后仅需启动即可，如使用`mvn spring-boot:run`, 启动成功后，在Nacos控制台上即可查看到注册的`AgentCard`并且能从详情中查看到具体信息：

| ![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/297800/1758611704940-b3d6480c-3402-4a06-aafe-0a0a134ad11d.png) |
| --- |
| ![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/297800/1758611718413-0d177af9-ade0-4c75-b6e9-0730e905ccbb.png) |


### 2.3.  构建A2A Client Agent
#### 2.3.1. 引入pom
```xml
<properties>
  <spring.ai.alibaba.version>1.0.0.4</spring.ai.alibaba.version>
  <spring.boot.version>3.4.5</spring.boot.version>
</properties>

<dependencies>
  <!-- 引入A2A Client starter -->
  <dependency>
    <groupId>com.alibaba.cloud.ai</groupId>
    <artifactId>spring-ai-alibaba-starter-a2a-client</artifactId>
    <version>${spring.ai.alibaba.version}</version>
  </dependency>
  <!-- 引入A2A Nacos 注册中心 -->
  <dependency>
    <groupId>com.alibaba.cloud.ai</groupId>
    <artifactId>spring-ai-alibaba-starter-a2a-registry</artifactId>
    <version>${spring.ai.alibaba.version}</version>
  </dependency>
  <!-- 可选，引入web构建简单的页面 -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>${spring.boot.version}</version>
  </dependency>
</dependencies>
```

#### 2.3.2. 添加配置文件`application.yml`
```yaml
server:
  port: 8888

spring:
  application:
    name: a2s-client-example
  ai:
    alibaba:
      a2a:
        nacos:
          # 开启从Nacos中自动发现Agent
          discovery:
            enabled: true
          server-addr: ${NACOS_ADDRESS:localhost:8848}
          username: ${NACOS_USERNAME:nacos}
          password: ${NACOS_PASSWORD}
logging:
  level:
    root: debug

```

#### 2.3.3. 构建A2A Client Agent代码
```java
/**
 * Spring AI Alibaba 启动类
 */
@SpringBootApplication
public class A2aClientExampleApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(A2aClientExampleApplication.class, args);
    }
}

/**
 * Spring AI Alibaba Agentic API构建LLMAgent
 */
@Configuration
public class RootAgentConfiguration {
    
    @Bean
    public BaseAgent rootAgent(AgentCardProvider agentCardProvider) throws GraphStateException {
        return A2aRemoteAgent.builder()
                // 传入自动构建的Nacos AgentCard Provider
                .agentCardProvider(agentCardProvider)
                // 设置需要的Agent的名称，Nacos AgentCard Provider会根据此名称自动订阅AgentCard和Agent的可访问端点
                .name("Nacos Agent")
                .description("Answer Nacos questions or query and operate datum in Nacos.")
                .inputKey("messages")
                .outputKey("messages")
                .build();
    }
}

/**
 * 构建简单的访问API.
 */
@RestController
@RequestMapping("/")
public class TestController {
    
    private static final Logger LOGGER = org.slf4j.LoggerFactory.getLogger(TestController.class);
    
    private final BaseAgent rootAgent;
    
    public TestController(BaseAgent rootAgent) {
        this.rootAgent = rootAgent;
    }
    
    @GetMapping("sync")
    public Object sync(@RequestParam("question") String question) throws GraphStateException, GraphRunnerException {
        System.out.println(question);
        return rootAgent.invoke(Map.of("messages", List.of(new UserMessage(question)))).orElseThrow().value("messages")
                .orElseThrow();
    }
    
    @GetMapping("stream")
    public Flux<String> stream(@RequestParam("question") String question) throws GraphStateException, GraphRunnerException {
        return rootAgent.stream(Map.of("messages", List.of(new UserMessage(question)))).mapNotNull(output -> {
            LOGGER.debug("stream agent invoke : `{}`", output.toString());
            if (output.isSTART() || output.isEND()) {
                return null;
            }
            if (output instanceof StreamingOutput) {
                return ((StreamingOutput) output).chunk();
            }
            return null;
        }).publishOn(Schedulers.parallel());
    }
}

```

同样的，仅需3步就完成A2A Client Agent的构建和开发， 之后仅需启动即可，如使用`mvn spring-boot:run`, 启动成功后，可通过浏览器访问`localhost:8888/index.html`进行测试。

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/gif/297800/1758611568552-4278b87b-f072-4d1a-bd13-8a443239b026.gif)

## 3. About Nacos
Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及AI管理。

Nacos 帮助用户更敏捷和容易地构建、交付和管理云原生AI应用的平台。 Nacos 是构建以“服务”为中心的现代应用架构 (例如微服务范式、云原生范式、AI原生范式) 的服务基础设施。

Nacos 3.0 还有很多待完成的功能及大量待探索和开发的领域，欢迎大家扫码加入 Nacos 社区群及 Nacos MCP社区讨论群，参与 Nacos 社区的贡献和讨论，在 Nacos 社区一起搭把手，让你的代码和能力有机会能在各行各业领域内进行释放能量，期待认识你和你一起共建 Nacos 社区；



_<font style="color:#585a5a;">“Nacos 相信一切都是服务，每个服务节点被构想为一个星球，每个服务都是一个星系；Nacos 致力于帮助这些服务建立连接赋予智能，助力每个有面向星辰的梦想能够透过云层，飞在云上，更好的链接整片星空。”_



Nacos 官网：[https://nacos.io/](https://nacos.io/)

Nacos 仓库地址：[https://github.com/alibaba/nacos](https://github.com/alibaba/nacos)

“Nacos社区群6”群的钉钉群号： 145925004742

“Nacos MCP 社区讨论群2”群的钉钉群号： 115205016856

| ![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/297800/1758610254667-6853e2dc-8e89-4ad5-b938-edfdfde8b0d1.png) | ![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/297800/1758610123865-f1dc233c-d445-492e-bdf8-6ad97afa8e6b.png) |
| --- | --- |




