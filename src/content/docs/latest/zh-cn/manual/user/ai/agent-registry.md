---
title: Agent 注册中心
keywords: [ Agent Register,A2A Registry,Agent2Agent Registry ]
description: 本文档介绍了Nacos作为A2A（Agent注册中心）如何进行注册、发现和管理Agent
sidebar:
  order: 1
---

# Agent 注册中心

[Agent2Agent (A2A)](https://a2a-protocol.org/latest/) 协议是由 Google 开发并捐赠给 Linux 基金会的一项开放标准，旨在实现
AI Agent之间的无缝通信与协作，从而解决multi-agent数量增加时导致的运维、管理、部署成本过高的问题，实现像使用微服务一样使用multi-agent。

为了管理这些Agent，Nacos 从`3.1.0` 版本开始，提供了 Agent 注册中心（A2A Registry），实现Agent的注册、发现、命名空间隔离、版本管理等功能。

## 1. Nacos 中的 Agent（AgentCard)

Nacos中的Agent（AgentCard)
匹配A2A协议中的[AgentCard](https://a2a-protocol.org/latest/specification/#55-agentcard-object-structure)定义。并基于此进行少量拓展。

### 1.1. Agent（AgentCard）的命名空间

在Nacos中，一个Agent（AgentCard）仅能处于一个命名空间下，通过不同的命名空间进行资源隔离，从而实现环境、租户等纬度的Agent（AgentCard）的隔离。
同时，通过命名空间（`namespaceId`)和Agent的名称(`name`)
对Agent（AgentCard）进行唯一标识，即在同一个命名空间中，Agent（AgentCard）的`name`
不能重复。不同的命名空间中可以存在相同`name`的Agent（AgentCard）。

### 1.2. Agent（AgentCard）的名称限制

目前对于Agent（AgentCard）的名称(`name`)也有一定的限制，
Agent（AgentCard）的名称长度不能超过`64字符`，另外Agent（AgentCard）的名称仅能包含`ASCII`
码中的所有可视字符（编码范围在`32~126`
之间的字符）。

### 1.3. Agent（AgentCard）的版本管理

Agent（AgentCard）在Nacos中可以存在多个版本，每个版本都对应一个唯一的`version`，Agent（AgentCard）的`version`
不能重复。发布者应该在修改Agent（AgentCard）中定义的内容时创建新的版本，并选择其中一个版本作为当前默认发布版本。
发布者可以通过实时修改Agent（AgentCard）的默认发布版本，从而实现Agent（AgentCard）的版本管理。

Agent（AgentCard）的上游使用者（如Agent或其他应用）在获取Agent时会默认获取到的为默认发布版本，但可以通过指定版本号来获取指定版本的Agent。

## 2. 发布Agent（AgentCard）

Nacos作为Agent 注册中心（A2A Registry），提供了基于[HTTP的API](../../admin/admin-api.md#5-a2a注册中心)
以及基于[gRPC的SDK](../java-sdk/usage.md#7-a2a-注册中心)帮助A2A Server及Agent提供方发布Agent（AgentCard）。

同时Nacos与[Spring AI Alibaba](https://java2ai.com/)开发框架深度集成，帮助开发者快速开发Agent应用并通过A2A协议暴露Agent。

### 2.1. 发布通过Spring AI Alibaba开发的Agent

#### 2.1.1. 引入依赖

```xml
<!-- Spring AI Alibaba版本1.0.0.4及以上 -->
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

#### 2.1.2. 构建Agent

通过Spring AI Alibaba中定义的`Agentic API`快速定义及构建Agent运行逻辑，如下代码，创建了一个直接访问大模型`Agent`：

```java

@Configuration
public class RootAgentConfiguration {
    
    @Bean
    @Primary
    public BaseAgent rootAgent(ChatModel chatModel) throws GraphStateException {
        return ReactAgent.builder().name("{your_agent_name}").description("{your_agent_description}").model(chatModel)
                .instruction("{your_agent_system_prompt").build();
    }
}
```

#### 2.1.3. Agent 自动注册的参数配置

```yaml
server:
  port: 9999

spring:
  application:
    name: a2s-server-example
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

#### 2.1.4. 启动A2A Server Agent

随后启动A2A Server(如`mvn spring-boot:run`)，并通过Nacos控制台查看注册的Agent（AgentCard)信息。

### 2.2. 发布其他的自定义Agent

自定义Agent程序的自动发布需要使用`SDK（Nacos-Client）`进行发布。

> 当前版本仅实现了Java版本的Client，其他语言的Client正在开发中。

#### 2.2.1. 引入依赖

```xml
<!-- Nacos Client 3.1.0及以上版本 -->
<properties>
    <nacos.client.version>3.1.0</nacos.client.version>
</properties>

<dependencies>
    <!-- 引入Nacos Client-->
    <dependency>
        <groupId>com.alibaba.nacos</groupId>
        <artifactId>nacos-client</artifactId>
        <version>${nacos.client.version}</version>
    </dependency>
</dependencies>
```

#### 2.2.2. 发布AgentCard及注册Agent的endpoint

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
// release new version agent card to Nacos registry.
try {
    AgentCard agentCard = new AgentCard();
    agentCard.setName("{your_agent_name}");
    agentCard.setDescription("{your_agent_description}");
    agentCard.setUrl("http://localhost:8848");
    agentCard.setVersion("1.0.0");
    agentCard.setProtocolVersion("0.3.0");
    aiService.releaseAgentCard(agentCard);
} catch (NacosException e){
    e.printStackTrace();
}
// register agent endpoint to Nacos registry.
try {
    aiService.registerAgentEndpoint("{your_agent_name}","1.0.0","{your_agent_endpoint_host}","{your_agent_endpoint_port}","JSONRPC");
} catch (NacosException e){
    e.printStackTrace();
}
```

### 2.3. 发布/导入外部提供商的Agent

某些Agent（AgentCard）是外部提供商提供的，需要通过Nacos`控制台`或Nacos的`HTTP API`进行发布。

#### 2.3.1. 通过Nacos控制台发布外部提供商的Agent

- 登录Nacos控制台，进入`Agent管理` -> `Agent列表`页面。
- 点击`创建Agent`按钮，填写Agent（AgentCard）信息。
- 点击右上角`创建`按钮，完全Agent（AgentCard）的创建。

> tips: 通过控制台发布的Agent（AgentCard）不支持自动发现Agent端点的能力，因此请确保填写的AgentCard中的`服务地址`正确。

> 通过AgentCard
> JSON导入Agent的功能尚在开发中，若已获得AgentCard的JSON文件，请使用[Nacos HTTP API](#232-通过nacos-http-api发布外部提供商的agent)
> 进行导入。

#### 2.3.2. 通过Nacos HTTP API发布外部提供商的Agent

对于无法使用控制台发布Agent（AgentCard）的场景，可以通过Nacos [创建Agent HTTP API](../../admin/admin-api.md#55-创建agentcard)
进行发布。

以[A2A官方的样例AgentCard为例](https://a2a-protocol.org/latest/specification/#57-sample-agent-card)，导入并创建Agent:

```bash
curl -X POST '127.0.0.1:8848/nacos/v3/admin/ai/a2a' \
-d 'namespaceId=public' \
-d 'agentCard={"protocolVersion":"0.2.9","name":"GeoSpatial Route Planner Agent","description":"Provides advanced route planning, traffic analysis, and custom map generation services. This agent can calculate optimal routes, estimate travel times considering real-time traffic, and create personalized maps with points of interest.","url":"https://georoute-agent.example.com/a2a/v1","preferredTransport":"JSONRPC","additionalInterfaces":[{"url":"https://georoute-agent.example.com/a2a/v1","transport":"JSONRPC"},{"url":"https://georoute-agent.example.com/a2a/grpc","transport":"GRPC"},{"url":"https://georoute-agent.example.com/a2a/json","transport":"HTTP+JSON"}],"provider":{"organization":"Example Geo Services Inc.","url":"https://www.examplegeoservices.com"},"iconUrl":"https://georoute-agent.example.com/icon.png","version":"1.2.0","documentationUrl":"https://docs.examplegeoservices.com/georoute-agent/api","capabilities":{"streaming":true,"pushNotifications":true,"stateTransitionHistory":false},"securitySchemes":{"google":{"type":"openIdConnect","openIdConnectUrl":"https://accounts.google.com/.well-known/openid-configuration"}},"security":[{"google":["openid","profile","email"]}],"defaultInputModes":["application/json","text/plain"],"defaultOutputModes":["application/json","image/png"],"skills":[{"id":"route-optimizer-traffic","name":"Traffic-Aware Route Optimizer","description":"Calculates the optimal driving route between two or more locations, taking into account real-time traffic conditions, road closures, and user preferences (e.g., avoid tolls, prefer highways).","tags":["maps","routing","navigation","directions","traffic"],"examples":["Plan a route from '\''1600 Amphitheatre Parkway, Mountain View, CA'\'' to '\''San Francisco International Airport'\'' avoiding tolls.","{\"origin\": {\"lat\": 37.422, \"lng\": -122.084}, \"destination\": {\"lat\": 37.7749, \"lng\": -122.4194}, \"preferences\": [\"avoid_ferries\"]}"],"inputModes":["application/json","text/plain"],"outputModes":["application/json","application/vnd.geo+json","text/html"]},{"id":"custom-map-generator","name":"Personalized Map Generator","description":"Creates custom map images or interactive map views based on user-defined points of interest, routes, and style preferences. Can overlay data layers.","tags":["maps","customization","visualization","cartography"],"examples":["Generate a map of my upcoming road trip with all planned stops highlighted.","Show me a map visualizing all coffee shops within a 1-mile radius of my current location."],"inputModes":["application/json"],"outputModes":["image/png","image/jpeg","application/json","text/html"]}],"supportsAuthenticatedExtendedCard":true,"signatures":[{"protected":"eyJhbGciOiJFUzI1NiIsInR5cCI6IkpPU0UiLCJraWQiOiJrZXktMSIsImprdSI6Imh0dHBzOi8vZXhhbXBsZS5jb20vYWdlbnQvandrcy5qc29uIn0","signature":"QFdkNLNszlGj3z3u0YQGt_T9LixY3qtdQpZmsTdDHDe3fXV9y9-B3m2-XgCpzuhiLt8E0tV6HXoZKHv4GtHgKQ"}]}' 
```

## 3. 查询/获取Agent

Nacos作为Agent 注册中心（A2A Registry），提供了基于[HTTP的API](../../admin/admin-api.md#5-a2a注册中心)
以及基于[gRPC的SDK](../java-sdk/usage.md#7-a2a-注册中心)帮助A2A Client及Agent使用方查询和订阅Agent（AgentCard）。

同时Nacos与[Spring AI Alibaba](https://java2ai.com/)开发框架深度集成，帮助开发者快速开发Agent应用并通过A2A协议访问远端Agent。

### 3.1. 通过Spring AI Alibaba查询/订阅/调用 Agent

#### 3.1.1. 引入依赖

```xml
<!-- Spring AI Alibaba版本1.0.0.4及以上 -->
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

#### 3.1.2. 构建A2A Agent Client

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

#### 3.1.3. Agent 自动发现的参数配置

```yaml
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
```

#### 3.1.4. 调用A2A Agent Client

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

### 3.2. 通过Nacos Client查询/订阅 Agent

自定义Agent程序的进行Agent（AgentCard）的查询和订阅，需要使用`SDK（Nacos-Client）`进行。

> 当前版本仅实现了Java版本的Client，其他语言的Client正在开发中。

#### 3.2.1. 引入依赖

```xml
<!-- Nacos Client 3.1.0及以上版本 -->
<properties>
    <nacos.client.version>3.1.0</nacos.client.version>
</properties>

<dependencies>
    <!-- 引入Nacos Client-->
    <dependency>
        <groupId>com.alibaba.nacos</groupId>
        <artifactId>nacos-client</artifactId>
        <version>${nacos.client.version}</version>
    </dependency>
</dependencies>
```

#### 3.2.2. 查询/订阅Agent

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
try {
    String agentName = "{agentName}";
    //  查询默认发布版本的AgentCard
    AgentCard result = aiService.getAgentCard(agentName);
    // A2AClient为任意自定义实现的A2A发起调用的实现，如：Google A2A Java Client
    A2AClient a2aClient = new A2AClient(result);
    a2aClient.call();

    // 订阅此AgentCard， 当Agent发布新版本的AgentCard，或AgentCard的服务端点变化时，会触发此监听器。
    aiService.subscribeAgentCard(agentName, new AbstractNacosAgentCardListener() {
        @Override
        public void onEvent (NacosAgentCardEvent event){
            System.out.println("---------------agent card listener called start---------------");
            // AgentCard有更新时，更新A2AClient所需的AgentCard.
            a2aClient.updateAgentCard(event.getAgentCard());
            System.out.println("---------------agent card listener called end---------------");
        }
    });
    a2aClient.call();
} catch (Exception e){
    e.printStackTrace();
}
```

### 3.3. 通过API查询 Agent

Nacos还支持通过[HTTP的API](../../admin/admin-api.md#5-a2a注册中心)
，根据Agent的名称精确获取AgentCard信息，以及通过Agent的名称，模糊检索AgentCard信息。

> 通过技能（skills），标签（tags）及描述（description）进行模糊检索的能力正在开发中。

#### 3.3.1. 通过名称获取Agent详细信息

通过[查询 HTTP的API](../../admin/admin-api.md#53-查询agentcard的详情)，获取Agent的详细信息。如：

```bash
curl -X GET '127.0.0.1:8848/nacos/v3/admin/ai/a2a?namespaceId=public&agentName=GeoSpatial+Route+Planner+Agent'
```

#### 3.3.2. 通过名称模糊检索Agent

通过[搜索 HTTP的API](../../admin/admin-api.md#52-查询agentcard的列表)，检索Agent的列表。如：

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/admin/ai/a2a/list?pageNo=1&pageSize=100&agentName=Planner&namespaceId=public&search=blur'
```

### 3.4. 通过控制台检索和查看Agent

- 登录Nacos控制台，进入`Agent管理` -> `Agent列表`页面，即可看到当前命名空间下的所有Agent列表。
- 在`Agent名称`的输入框中填写Agent名称，点击`搜索`按钮，即可看到模糊匹配的Agent列表。
- 在`Agent列表`页面，点击表格中最右一列`操作`中的`详情`，即可进入`Agent详情`页，查看Agent的详细信息。

## 4. Agent 注册中心的RoadMap

### 4.1. 多语言客户端支持

目前Agent注册中心部分的SDK仅支持`Java`，其他多语言如`Python`,`Go`等语言的SDK正在开发中。

### 4.2. 更多纬度的筛选和检索

根据技能（skills）及标签（tags）进行Agent的筛选，排查，过滤的功能是Agent注册中心的计划能力之一，计划在后续版本进行支持。

### 4.3. A2A 官方 Registry Protocol支持

根据A2A官方的Roadmap， 官方也会定义一套标准的A2A Registry Protocol进行Agent或AgentCard的发现能力。 目前标准的Registry
Protocol正在社区进行[讨论](https://github.com/a2aproject/A2A/discussions/741).

Nacos社区会紧密参与讨论且关注此标准的A2A Registry Protocol的定义和发布，待标准发布后，Nacos社区会开始尽快适配及实现此标准。

