---
title: Agent 管理
keywords: [Agent 管理, RAD, Remote Agent Discovery, A2A Registry, AgentCard]
description: 了解 Nacos 3.3 的通用 Agent 管理、版本发布、运行端点与 RAD 发现，以及 A2A 接入方式。
sidebar:
  order: 3
---

# Agent 管理

Nacos 从 3.1 开始提供 A2A Agent 注册与发现能力。3.3 将 Agent 管理升级为通用的 Agent 资源管理：统一管理 Agent 的身份、目录信息、版本化调用定义和运行端点，并通过 RAD（Remote Agent Discovery）提供搜索、发现和订阅能力。

A2A 仍然是受支持的接入方式。AgentCard 作为 A2A 调用接口的原生描述保留，已有 A2A 应用可继续接入。本文介绍管理和发布流程；应用侧端点注册、发现与订阅的完整示例见 [RAD 接入指南](./rad-discovery.md)。

Nacos 负责告诉应用“Agent 是谁、支持怎样的调用、可用地址在哪里”。实际的消息、任务和流式调用由 Agent 应用及其协议客户端完成。

## 1. 认识 Agent 资源

### 1.1. 身份、目录与版本

| 内容 | 管理什么 | 什么时候修改 |
| --- | --- | --- |
| Agent | 名称、展示名称、描述、提供方、业务标签、启用状态和可见范围 | 更新目录信息或治理策略时 |
| Agent 版本 | 一次发布的调用定义，包含 `callInterfaces` | 调用协议、原生描述或声明地址发生变化时，创建新版本草稿 |
| 调用接口（CallInterface） | `protocol`、`protocolVersion`、`nativeDescriptor` 及端点来源顺序 | 随版本一起编辑和发布 |
| 运行端点（Runtime Endpoint） | Agent 应用当前提供的地址、运行版本和兼容范围 | 应用启动、扩缩容或退出时注册、更新和注销 |

一个 Agent 由 `namespaceId + agentName` 唯一标识。不同命名空间可以使用相同名称；同一命名空间内名称不能重复。`agentName` 创建后不可修改，区分大小写，长度为 1～64 个可打印 ASCII 字符，不能全部为空格。需要中文名称时使用 `displayName`。

版本号采用 `主版本.次版本.修订版本`，例如 `1.0.0`、`1.1.0-rc.1`，最长 64 个字符，不接受 `+build` 后缀。已发布的版本内容不可覆盖；调整 Agent 目录描述或业务标签不需要新建定义版本。

Agent 管理面向可调用的 Agent；[AgentSpecs 管理](./agentspec-registry.md)面向可分发的规范包，两者分别管理版本和生命周期。

### 1.2. 调用协议与地址来源

`callInterfaces` 是有序的调用接口列表，同一版本内 `protocol` 不能重复。A2A 接口使用 `protocol=a2a`，其 `nativeDescriptor` 为 AgentCard。协议中的技能、能力和安全方案保留在原生描述中。

每个调用接口有两类地址来源：

| 来源 | 适用场景 | 维护方式 |
| --- | --- | --- |
| `DECLARED` 声明地址 | 外部提供商、固定网关或稳定访问入口 | 保存于版本定义中；A2A 地址与 AgentCard 的接口声明保持一致 |
| `RUNTIME` 运行端点 | 应用自动注册、实例扩缩容 | 由发布端应用通过 SDK 注册并维持活性，退出时注销 |

`endpointSourceOrder` 指定推荐顺序：`["RUNTIME", "DECLARED"]` 优先运行端点，`["DECLARED", "RUNTIME"]` 优先声明地址，必须同时包含两种来源且各出现一次。顺序不代表关闭另一种来源；调用方可在发现时显式过滤来源。

发布定义不会启动 Agent 应用；注册运行端点也不会自动创建或发布定义。使用声明地址时，应由提供方保证地址可达；使用运行端点时，还需检查实例健康和版本兼容性。

## 2. 接入准备

- 使用 Nacos 3.3 服务端。升级已有集群时，先完成[升级手册](../../admin/upgrading.mdx)中的 A2A 迁移步骤，再使用通用 Agent/RAD 入口。
- Nacos 3.3 默认开启客户端鉴权。管理账号需要目标 Agent 的管理权限；应用账号需要相应的读取或端点写入权限。按[配置访问凭据](../auth.mdx)准备 `NACOS_USERNAME`、`NACOS_PASSWORD`；HTTP 示例使用登录后保存的 `NACOS_ACCESS_TOKEN`。
- 明确发布者与使用者采用的命名空间。以下示例使用 `public`。
- 准备实际运行的 Agent 应用。下文 `http://127.0.0.1:9999/a2a` 是本地示例地址，部署时应改为使用方能访问的地址。

新建 Agent 在内置可见性策略下默认是 `PUBLIC`。需要私有发布时，先创建草稿，再通过独立 scope 接口设为 `PRIVATE`，最后提交发布。scope 作用于整个 Agent；新版本和重试不会重置已有私有设置，创建请求也不直接接受 scope 参数。操作示例见[修改资源的 scope](../../../plugin/visibility-plugin.md#修改资源的-scope)。

公开可见不等于免鉴权，也不会赋予调用者写权限，默认值及显式授权规则见[可见性插件](../../../plugin/visibility-plugin.md)。Nacos 的登录凭据也不能代替调用 Agent 服务本身所需的凭据。

## 3. 创建与发布 Agent

### 3.1. 通过控制台管理

1. 在 AI 管理中心进入 **Agent 管理**，选择目标命名空间，点击 **创建 Agent**。
2. 已有 AgentCard 时，选择 **从已知协议导入**，粘贴完整的 A2A AgentCard，检查导入预览中的名称、版本和接口地址。也可以选择 **全新创建**，填写目录信息、首个版本和调用协议。
3. 保存后得到草稿。检查版本内容、端点来源顺序和可见范围，再执行 **提交审核**。
4. 没有适用的 Pipeline 时，提交后直接上线；有适用 Pipeline 时，等待审核完成，检查结果，通过后执行 **发布**。
5. 在版本详情和运行时端点区域检查定义及地址，再从使用方验证发现和实际调用。

更新时，**编辑元数据**用于调整 Agent 的目录信息；**编辑草稿**用于修改未发布的调用定义。修改已发布内容，应使用 **基于此版本创建草稿**并指定新版本号。

### 3.2. 通过 HTTP 创建草稿

管理集成使用 `/nacos/v3/admin/ai/agents` 下的接口。以下示例创建名为 `route-planner` 的 Agent 及 `1.0.0` 草稿。先将调用定义保存到 `agent-call-interfaces.json`：

```json
[
  {
    "protocol": "a2a",
    "protocolVersion": "0.3.0",
    "descriptorMediaType": "application/json",
    "nativeDescriptor": {
      "protocolVersion": "0.3.0",
      "name": "route-planner",
      "description": "Plan a route between two locations.",
      "url": "http://127.0.0.1:9999/a2a",
      "preferredTransport": "JSONRPC",
      "version": "1.0.0",
      "capabilities": {"streaming": false},
      "defaultInputModes": ["text"],
      "defaultOutputModes": ["text"],
      "skills": [
        {
          "id": "plan-route",
          "name": "Route planning",
          "description": "Plan a route between two locations.",
          "tags": ["routing"]
        }
      ]
    },
    "endpointSourceOrder": ["RUNTIME", "DECLARED"],
    "endpointSets": [
      {
        "source": "DECLARED",
        "endpoints": [
          {"uri": "http://127.0.0.1:9999/a2a", "transport": "JSONRPC"}
        ]
      }
    ]
  }
]
```

这是 A2A 0.3.0 描述示例。使用其他 A2A 版本时，应提交该版本的完整 AgentCard，并保持名称、版本与外层 Agent 定义一致。直接填写通用 HTTP 表单时，应同时保持 AgentCard 地址与 `DECLARED` 端点一致；控制台的 A2A 导入入口会完成相应转换。

在文件所在目录运行以下 Bash 命令：

```bash
curl -sS -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agents/draft' \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  --data-urlencode 'namespaceId=public' \
  --data-urlencode 'agentName=route-planner' \
  --data-urlencode 'version=1.0.0' \
  --data-urlencode 'description=Plan a route between two locations.' \
  --data-urlencode 'tags=["routing"]' \
  --data-urlencode 'callInterfaces@agent-call-interfaces.json'
```

`callInterfaces`、`tags` 等复杂字段是表单中的 JSON 字符串，不是整个 HTTP 请求的 JSON body。创建成功仍为 `draft`，此时不能通过普通运行时发现使用该版本。

### 3.3. 提交并检查发布结果

提交草稿：

```bash
curl -sS -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agents/submit' \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  --data-urlencode 'namespaceId=public' \
  --data-urlencode 'agentName=route-planner' \
  --data-urlencode 'version=1.0.0'
```

检查响应及版本状态；有审核流程时，可通过控制台查看结果，也可以读取精确版本：

```bash
curl -sS -G 'http://127.0.0.1:8848/nacos/v3/admin/ai/agents/version' \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  --data-urlencode 'namespaceId=public' \
  --data-urlencode 'agentName=route-planner' \
  --data-urlencode 'version=1.0.0'
```

**只有处于 `reviewed` 且审核通过时，才执行下面的发布操作**；已是 `online` 则直接进入发现验证。审核未通过时，先查看原因，再重新编辑或重新提交。

```bash
curl -sS -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agents/publish' \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  --data-urlencode 'namespaceId=public' \
  --data-urlencode 'agentName=route-planner' \
  --data-urlencode 'version=1.0.0'
```

### 3.4. 后续版本与代码式发布

一个 Agent 最多有一个编辑中版本和一个审核中版本。后续版本可直接提供新的 `callInterfaces`，也可用 `basedOnVersion` 复制已有精确版本，两者不能同时提供。复制后，先在草稿中调整协议描述的版本、地址等内容，再提交。

3.3 Java SDK 提供 `AiService.agent().publishAgent(AgentPublishRequest)`，供应用以代码管理定义。它遵循普通提交与 Pipeline 流程：首个新建版本自动提交；后续版本由 `autoSubmit` 决定是否提交，默认 `false`。同版本当前为草稿时可更新；已进入审核或发布等非草稿状态时不会覆盖内容。应检查返回状态，不能把方法名中的 publish 理解为必然已经上线。写入超时后先检查该版本状态，再决定是否重试。

详细状态及操作规则见 [AI 资源生命周期](./ai-resource-lifecycle.md)。标准发布或重新上线会把 `latest` 指向本次版本；下线当前 `latest` 后会选择其余在线版本中版本号最大的一个。`latest` 由服务端维护，不能通过自定义标签覆盖。

## 4. 发现和使用 Agent

### 4.1. 搜索、发现与订阅

| 能力 | 用途 | 主要结果 |
| --- | --- | --- |
| Search | 按名称子串、业务标签、调用协议寻找 Agent | 可见且已启用的在线 Agent 目录与版本信息 |
| Discover | 按名称、版本或标签获取调用定义和端点 | `callInterfaces[].endpointSets[].endpoints[]` |
| Watch | 订阅同一发现条件的变化 | 初始完整快照，以及后续变化或不可用事件 |

Search 的 `agentNameContains` 区分大小写；`tagsAll` 要求全部精确匹配；`protocolsAny` 要求至少一个在线版本包含任一指定协议。它们是 Agent 目录筛选条件，不能等同于对 AgentCard 内任意 `skills` 或描述执行语义搜索。Search 命中也不保证存在健康端点。

只查询目录后，应继续 Discover 获取调用地址，再由 A2A 等协议客户端调用。接入示例、过滤条件和订阅清理见 [RAD 接入指南](./rad-discovery.md)。

### 4.2. 明确版本选择

| 选择方式 | 定义版本 | 运行端点兼容范围 |
| --- | --- | --- |
| 不传 `version` 和 `label` | 当前 `latest` | 兼容任一当前在线版本的运行端点 |
| 显式 `label=latest` | 当前 `latest` | 仅兼容该版本的运行端点 |
| 指定 `version` 或其他 `label` | 对应的精确在线版本 | 仅兼容该版本的运行端点 |

`version` 与 `label` 不能同时使用。需要严格跟随最新定义的应用应显式设置 `label=latest`；固定版本或灰度标签时，也应检查目标版本已上线。过滤条件只裁剪所选定义的接口与地址，不会自动改选另一个版本。

## 5. A2A 接入与兼容

### 5.1. AgentCard 与通用 Agent 的关系

A2A AgentCard 保存为 `protocol=a2a` 调用接口的 `nativeDescriptor`。Card 的 `name` 和 `version` 对应 Agent 名称和版本，接口 URL 对应声明地址。既有 A2A API 仍用于发布、查询和订阅 Card；通用 RAD API 返回包含原生 Card 和端点集合的发现结果。

| 接入方式 | 使用建议 |
| --- | --- |
| 已有 3.1 / 3.2 Java SDK 或旧 A2A HTTP/gRPC 接口 | 保留兼容接入；已有数据的服务端升级按升级手册处理 |
| 3.3 Java SDK 的 A2A 方法 | 使用 `AiService.agent()`；服务端支持 RAD 时，通过 RAD 适配 Card、端点与订阅 |
| 新的通用 Agent 应用 | 使用 [RAD 接入指南](./rad-discovery.md)中的 Search、Discover、Watch 与端点批量注册 |

旧 A2A HTTP/gRPC 发布保留直接上线及 `setAsLatest` 兼容行为。3.3 SDK 的 A2A 方法使用 RAD 时，定义发布遵循 Client publish 的普通提交与 Pipeline 流程。不要用旧接口的行为推断所有接入方式都会直接上线。

同一 SDK 实例、同一 Agent 的 A2A 协议端点，应选择原生 RAD 注册或兼容 A2A 注册中的一种，避免两套注册方式混用。Nacos 注册中心鉴权与 AgentCard 声明的业务调用鉴权分别配置。

### 5.2. 自定义 A2A 应用

3.3 Java SDK 可通过以下入口保留 AgentCard 的使用方式；`agentCard` 应是应用提供的完整 Card：

```java
Properties properties = new Properties();
properties.setProperty("serverAddr", "127.0.0.1:8848");
properties.setProperty("namespace", "public");
properties.setProperty("username", System.getenv("NACOS_USERNAME"));
properties.setProperty("password", System.getenv("NACOS_PASSWORD"));
AiService aiService = AiFactory.createAiService(properties);
AgentService agentService = aiService.agent();

// Publish the application's complete AgentCard.
agentService.releaseAgentCard(agentCard);
// Register after the definition has become online and the application is ready.
agentService.registerAgentEndpoint("route-planner", "1.0.0", "127.0.0.1", 9999, "JSONRPC");
// Pass the discovered Card to the A2A client used by the application.
AgentCard discoveredCard = agentService.getAgentCard("route-planner");
```

上述片段用于说明接口入口。发布与运行时调用通常在不同应用中完成；发布端需要确认版本上线，运行期间保留 SDK 实例，退出时注销端点并调用 `aiService.shutdown()`。A2A 订阅仍可使用 `subscribeAgentCard` / `unsubscribeAgentCard`；新应用若需要显式处理不可用事件，可使用 RAD Watch。

通过 HTTP 集成旧 A2A 管理接口时，可将完整 AgentCard 保存为 `agent-card.json` 后导入：

```bash
curl -sS -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/a2a' \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  --data-urlencode 'namespaceId=public' \
  --data-urlencode 'agentCard@agent-card.json'
```

这里提交的是 Card 本身，不能使用第 3 节的 `callInterfaces` 数组文件。此入口属于上述旧 A2A 兼容路径；需要草稿审核的管理集成应使用通用 Agent 管理入口。

### 5.3. 发布通过Spring AI Alibaba开发的Agent

以下保留 Spring AI Alibaba `1.0.0.4` 的接入示例，适合已使用该版本的应用；不同框架版本的依赖与配置应按其[版本说明](https://java2ai.com/docs/versions/)和 [A2A 指南](https://v1100.java2ai.com/en/docs/frameworks/agent-framework/advanced/a2a/)核对。升级 Nacos 服务端不等于自动升级框架所依赖的 Nacos Client，发布行为仍以实际 Client 版本及其选择的接入方式为准。

#### 5.3.1. 引入依赖

```xml
<!-- Spring AI Alibaba版本 1.0.0.4 -->
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

#### 5.3.2. 构建Agent

通过Spring AI Alibaba中定义的`Agentic API`快速定义及构建Agent运行逻辑，如下代码，创建了一个直接访问大模型`Agent`：

```java

@Configuration
public class RootAgentConfiguration {
    
    @Bean
    @Primary
    public BaseAgent rootAgent(ChatModel chatModel) throws GraphStateException {
        return ReactAgent.builder().name("{your_agent_name}").description("{your_agent_description}").model(chatModel)
                .instruction("{your_agent_system_prompt}").build();
    }
}
```

#### 5.3.3. Agent 自动注册的参数配置

```yaml
server:
  port: 9999

spring:
  application:
    name: a2a-server-example
  ai:
    # 配置大模型的参数，如API-KEY，模型名称等
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
            # 配置Agent（AgentCard）的URL，若当前版本无可用端点，会使用此 URL
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
```

#### 5.3.4. 启动A2A Server Agent

随后启动 A2A Server（如 `mvn spring-boot:run`），并在 Nacos 控制台检查 Agent 的版本状态和端点。若实际使用的 Client 发布后进入审核流程，需完成审核发布后再验证调用。

### 5.4. 通过Spring AI Alibaba查询/订阅/调用 Agent

#### 5.4.1. 引入依赖

```xml
<!-- Spring AI Alibaba版本 1.0.0.4 -->
<properties>
    <spring.ai.alibaba.version>1.0.0.4</spring.ai.alibaba.version>
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
</dependencies>
```

#### 5.4.2. 构建A2A Agent Client

通过Spring AI Alibaba中定义的`Agentic API`快速构建A2A的Agent Client

```java

@Configuration
public class RootAgentConfiguration {
    
    @Bean
    public BaseAgent rootAgent(AgentCardProvider agentCardProvider) throws GraphStateException {
        return A2aRemoteAgent.builder()
                // 传入自动构建的Nacos AgentCard Provider
                .agentCardProvider(agentCardProvider)
                // 设置需要的Agent的名称，Nacos AgentCard Provider会根据此名称自动订阅AgentCard和Agent的可访问端点
                .name("{remote_agent_name}").description("{remote_agent_description}").build();
    }
}
```

#### 5.4.3. Agent 自动发现的参数配置

```yaml
spring:
  application:
    name: a2a-client-example
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
```

#### 5.4.4. 调用A2A Agent Client

在运行时，获取构建好的A2A Agent Client进行调用，Agent会自动的订阅Nacos中的AgentCard及Agent的服务端点，同时选择可用的端点进行调用，如：

```java

@RestController
@RequestMapping("/")
public class TestController {
    
    private static final Logger LOGGER = org.slf4j.LoggerFactory.getLogger(TestController.class);
    
    private final BaseAgent rootAgent;
    
    public TestController(BaseAgent rootAgent) {
        this.rootAgent = rootAgent;
    }
    
    @GetMapping("stream")
    public Flux<String> stream(@RequestParam("question") String question)
            throws GraphStateException, GraphRunnerException {
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



## 6. 常见问题

| 现象 | 检查与处理 |
| --- | --- |
| 控制台已有 Agent，应用仍发现不到 | 确认命名空间、资源启用状态、版本是否 `online`，以及调用账号的权限与可见范围 |
| 刚发布后 Search 未命中，但精确 Discover 正常 | 搜索索引同步可能尚未完成，稍后重试；不要立即重复创建资源 |
| 发现结果没有地址 | 检查协议/来源过滤、声明地址、运行端点注册情况，以及注册的兼容范围是否包含目标在线版本 |
| 返回了 `healthy=false` 的运行端点 | Discover 会保留不健康端点供调用方判断；调用前应选择健康地址并应用相应选址策略 |
| 下线版本后仍看到应用实例 | 版本下线只影响定义的发现可用性；应用仍需注销自己注册的运行端点 |
| 发布后实际调用失败 | 检查 Agent 服务是否已启动、网络可达、调用协议匹配，以及业务服务自身的鉴权配置 |
| 升级期间通用 Agent/RAD 请求被拒绝 | 先完成升级手册中的 A2A 迁移与验证，再切换使用新入口 |
