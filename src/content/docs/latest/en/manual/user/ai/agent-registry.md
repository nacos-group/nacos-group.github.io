---
title: A2A Registry
keywords: [ Agent Register,A2A Registry,Agent2Agent Registry ]
description: This document describes how Nacos, as an A2A (Agent Registration Center), registers, discovers, and manages Agents.
sidebar:
  order: 1
---

# A2A Registry

> translated by `Qwen`

[Agent2Agent (A2A)](https://a2a-protocol.org/latest/)  is an open standard developed by Google and donated to the Linux
Foundation. It aims to enable seamless communication and collaboration between AI Agents, addressing the challenges of
excessive operation, management, and deployment costs caused by the increasing number of multi-agents. This protocol
allows using multi-agents like microservices.

To manage these Agents, Nacos has introduced the Agent Registry (A2A Registry) starting from version `3.1.0`, providing
functionalities including:

- Agent registration and discovery
- Namespace isolation
- Version management

## 1. Agent（AgentCard) in Nacos

Agent（AgentCard) in Nacos aligns with
the [AgentCard](https://a2a-protocol.org/latest/specification/#55-agentcard-object-structure) definition in the A2A
protocol, with minor extensions.

### 1.1. Namespace of Agent（AgentCard）

In Nacos, an Agent (AgentCard) can only reside within a single namespace. Resource isolation through distinct namespaces
enables the segregation of Agents (AgentCards) across dimensions such as environments or tenants.

Agents (AgentCards) are uniquely identified by their namespace (`namespaceId`) and name (`name`). This means:

- Within the same namespace, an Agent's name **must be unique**.
- Agents (AgentCards) with identical name values **are permitted** across different namespaces.

### 1.2. Name limit for Agent（AgentCard）

And current name constraints for Agents (AgentCards):

- Name length: Must not exceed **64** characters
- Permitted characters: Only **visible ASCII characters** (encoding range: 32–126) are allowed.

### 1.3. Version management for Agent（AgentCard）

Agents (AgentCards) in Nacos support multiple versions, each corresponding to a unique `version` (non-repeating).
Publishers must:

- Create new versions when modifying the content defined in an AgentCard
- Select one version as the current default published version
- Version management is achieved by dynamically updating the default published version of an AgentCard.

Upstream consumers of Agents (AgentCards) (e.g., other agents or applications) will retrieve the **default published
version** by default when accessing an Agent. Specific versions can be obtained by explicitly specifying the version
number.

## 2. Publish Agent（AgentCard）

Nacos, serving as an A2A Registry, offers:

- [HTTP-based API](../../admin/admin-api.md#5-a2a注册中心)
- [gRPC-based SDK](../java-sdk/usage.md#7-a2a-注册中心)

to assist A2A servers and agent providers in publishing Agents (AgentCards).

Additionally, Nacos integrates deeply with the [Spring AI Alibaba(https://java2ai.com/)] development framework, enabling developers to rapidly build Agent applications and expose Agents via the A2A protocol.

### 2.1. Publish Agent by Spring AI Alibaba

#### 2.1.1. Dependencies

```xml
<!-- Spring AI Alibaba version upper 1.0.0.4 -->
<properties>
    <spring.ai.alibaba.version>1.0.0.4</spring.ai.alibaba.version>
</properties>

<dependencies>
    <!-- A2A Server starter -->
    <dependency>
        <groupId>com.alibaba.cloud.ai</groupId>
        <artifactId>spring-ai-alibaba-starter-a2a-server</artifactId>
        <version>${spring.ai.alibaba.version}</version>
    </dependency>
    <!-- A2A Nacos Registry -->
    <dependency>
        <groupId>com.alibaba.cloud.ai</groupId>
        <artifactId>spring-ai-alibaba-starter-a2a-registry</artifactId>
        <version>${spring.ai.alibaba.version}</version>
    </dependency>
    <!-- The Bailian LLM client can be substituted with other Spring AI LLM clients, such as OpenAI. -->
    <dependency>
        <groupId>com.alibaba.cloud.ai</groupId>
        <artifactId>spring-ai-alibaba-starter-dashscope</artifactId>
        <version>${spring.ai.alibaba.version}</version>
    </dependency>
</dependencies>
```

#### 2.1.2. Code Agent

The following demonstrates how to use the `Agentic API` defined in Spring AI Alibaba to rapidly define and build agent execution logic. This example creates an `Agent` that directly accesses LLM:

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

#### 2.1.3. Agent Auto-register properties

```yaml
server:
  port: 9999

spring:
  application:
    name: a2s-server-example
  ai:
    # options for LLM, such as API_KEY, model type.
    dashscope:
      api-key: ${BAILIAN_API_KEY}
      base-url: https://dashscope.aliyuncs.com/compatible-mode
      chat:
        options:
          model: qwen-plus-latest
    alibaba:
      a2a:
        # Address,username and password of Nacos.
        nacos:
          server-addr: ${NACOS_ADDRESS:localhost:8848}
          username: ${NACOS_USERNAME:nacos}
          password: ${NACOS_PASSWORD}
        # extension information for agent in AgentCard, such as skills, provider and so on.
        server:
          version: 1.0.1
          card:
            # URL of agent, if no endpoint can be access, this url will be used.
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

#### 2.1.4. Bootstrap A2A Server Agent

After starting the A2A Server (e.g., using `mvn spring-boot:run`), you can view registered Agent (AgentCard) information through the **Nacos Console**.

### 2.2. Publish Agent by SDK

Automated publishing of custom Agent programs requires using the `SDK (Nacos-Client)`.

> Note: The current version only supports the Java Client. Clients for other languages are under development.

#### 2.2.1. Dependencies

```xml
<!-- Nacos Client version upper 3.1.0 -->
<properties>
    <nacos.client.version>3.1.1</nacos.client.version>
</properties>

<dependencies>
    <!-- Nacos Client-->
    <dependency>
        <groupId>com.alibaba.nacos</groupId>
        <artifactId>nacos-client</artifactId>
        <version>${nacos.client.version}</version>
    </dependency>
</dependencies>
```

#### 2.2.2. Publish AgentCard and register Agent Endpoints

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

### 2.3. Publish Agent(AgentCard) from external provider

Certain Agents (AgentCards) provided by external providers should be published via the `Nacos Console` or `Nacos HTTP API`.

### 2.3.1. Publishing External Provider Agents via Nacos Console

- Log in to the Nacos Console and navigate to `Agent Management` → `Agent List`.
- Click the `Create Agent` button and fill in the AgentCard information.
- Click the `Create` button in the top-right corner to complete the AgentCard creation.

> Tips:
> 
> - Agents (AgentCards) published via the console do not support automatic endpoint discovery. Ensure the service endpoint in the AgentCard is accurate.
> - JSON import functionality for AgentCards is under development. To import existing AgentCard JSON files, use the [Nacos HTTP API](#232-publishing-external-provider-agents-via-nacos-http-api).

### 2.3.2. Publishing External Provider Agents via Nacos HTTP API

For scenarios where the console is unavailable, use the [Nacos Create Agent HTTP API](../../admin/admin-api.md#55-创建agentcard).

Example: Importing the [A2A official sample AgentCard](https://a2a-protocol.org/latest/specification/#57-sample-agent-card):

```bash
curl -X POST '127.0.0.1:8848/nacos/v3/admin/ai/a2a' \
-d 'namespaceId=public' \
-d 'agentCard={"protocolVersion":"0.2.9","name":"GeoSpatial Route Planner Agent","description":"Provides advanced route planning, traffic analysis, and custom map generation services. This agent can calculate optimal routes, estimate travel times considering real-time traffic, and create personalized maps with points of interest.","url":"https://georoute-agent.example.com/a2a/v1","preferredTransport":"JSONRPC","additionalInterfaces":[{"url":"https://georoute-agent.example.com/a2a/v1","transport":"JSONRPC"},{"url":"https://georoute-agent.example.com/a2a/grpc","transport":"GRPC"},{"url":"https://georoute-agent.example.com/a2a/json","transport":"HTTP+JSON"}],"provider":{"organization":"Example Geo Services Inc.","url":"https://www.examplegeoservices.com"},"iconUrl":"https://georoute-agent.example.com/icon.png","version":"1.2.0","documentationUrl":"https://docs.examplegeoservices.com/georoute-agent/api","capabilities":{"streaming":true,"pushNotifications":true,"stateTransitionHistory":false},"securitySchemes":{"google":{"type":"openIdConnect","openIdConnectUrl":"https://accounts.google.com/.well-known/openid-configuration"}},"security":[{"google":["openid","profile","email"]}],"defaultInputModes":["application/json","text/plain"],"defaultOutputModes":["application/json","image/png"],"skills":[{"id":"route-optimizer-traffic","name":"Traffic-Aware Route Optimizer","description":"Calculates the optimal driving route between two or more locations, taking into account real-time traffic conditions, road closures, and user preferences (e.g., avoid tolls, prefer highways).","tags":["maps","routing","navigation","directions","traffic"],"examples":["Plan a route from '\''1600 Amphitheatre Parkway, Mountain View, CA'\'' to '\''San Francisco International Airport'\'' avoiding tolls.","{\"origin\": {\"lat\": 37.422, \"lng\": -122.084}, \"destination\": {\"lat\": 37.7749, \"lng\": -122.4194}, \"preferences\": [\"avoid_ferries\"]}"],"inputModes":["application/json","text/plain"],"outputModes":["application/json","application/vnd.geo+json","text/html"]},{"id":"custom-map-generator","name":"Personalized Map Generator","description":"Creates custom map images or interactive map views based on user-defined points of interest, routes, and style preferences. Can overlay data layers.","tags":["maps","customization","visualization","cartography"],"examples":["Generate a map of my upcoming road trip with all planned stops highlighted.","Show me a map visualizing all coffee shops within a 1-mile radius of my current location."],"inputModes":["application/json"],"outputModes":["image/png","image/jpeg","application/json","text/html"]}],"supportsAuthenticatedExtendedCard":true,"signatures":[{"protected":"eyJhbGciOiJFUzI1NiIsInR5cCI6IkpPU0UiLCJraWQiOiJrZXktMSIsImprdSI6Imh0dHBzOi8vZXhhbXBsZS5jb20vYWdlbnQvandrcy5qc29uIn0","signature":"QFdkNLNszlGj3z3u0YQGt_T9LixY3qtdQpZmsTdDHDe3fXV9y9-B3m2-XgCpzuhiLt8E0tV6HXoZKHv4GtHgKQ"}]}' 
```

## 3. Query Agent

Nacos, serving as an A2A Registry, offers:

- [HTTP-based API](../../admin/admin-api.md#5-a2a注册中心)
- [gRPC-based SDK](../java-sdk/usage.md#7-a2a-注册中心)

to assist A2A clients and agent consumers in query Agents (AgentCards).

Additionally, Nacos integrates deeply with the [Spring AI Alibaba(https://java2ai.com/)] development framework, enabling developers to rapidly build Agent applications and request remote Agents via the A2A protocol.

### 3.1. Query/Subscriber and Request Agent by Spring AI Alibaba

#### 3.1.1. Dependencies

```xml
<!-- Spring AI Alibaba version upper 1.0.0.4 -->
<properties>
    <spring.ai.alibaba.version>1.0.0.4</spring.ai.alibaba.version>
</properties>

<dependencies>
    <!-- A2A Client starter -->
    <dependency>
        <groupId>com.alibaba.cloud.ai</groupId>
        <artifactId>spring-ai-alibaba-starter-a2a-client</artifactId>
        <version>${spring.ai.alibaba.version}</version>
    </dependency>
    <!-- A2A Nacos Registry -->
    <dependency>
        <groupId>com.alibaba.cloud.ai</groupId>
        <artifactId>spring-ai-alibaba-starter-a2a-registry</artifactId>
        <version>${spring.ai.alibaba.version}</version>
    </dependency>
</dependencies>
```

#### 3.1.2. Code A2A Agent Client

Spring AI Alibaba's `Agentic API` provides declarative methods for invoking Agents, enabling developers to quickly build A2A Agent clients.

```java

@Configuration
public class RootAgentConfiguration {
    
    @Bean
    public BaseAgent rootAgent(AgentCardProvider agentCardProvider) throws GraphStateException {
        return A2aRemoteAgent.builder()
                // Using Nacos AgentCard Provider autowired by spring starter
                .agentCardProvider(agentCardProvider)
                // set the name of agent, and Nacos AgentCard Provider will use this name to query and subscribe AgentCard.
                .name("{remote_agent_name}").description("{remote_agent_description}").build();
    }
}
```

#### 3.1.3. Agent Auto-discovery properties

```yaml
spring:
  application:
    name: a2s-client-example
  ai:
    alibaba:
      a2a:
        nacos:
          # enabled auto-discovery from nacos.
          discovery:
            enabled: true
          server-addr: ${NACOS_ADDRESS:localhost:8848}
          username: ${NACOS_USERNAME:nacos}
          password: ${NACOS_PASSWORD}
```

#### 3.1.4. Calling or request for A2A Agent Client

At runtime, obtain the pre-built A2A Agent Client for invocation. The Agent will automatically subscribe to the AgentCard and service endpoints of Agents in Nacos, and select an available endpoint for invocation, such as:

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

### 3.2. Query and subscribe Agent by SDK

Automated query and subscribe of custom Agent programs requires using the `SDK (Nacos-Client)`.

> Note: The current version only supports the Java Client. Clients for other languages are under development.

#### 3.2.1. Dependencies

```xml
<!-- Nacos Client version upper 3.1.0 -->
<properties>
    <nacos.client.version>3.1.1</nacos.client.version>
</properties>

<dependencies>
    <!-- Nacos Client-->
    <dependency>
        <groupId>com.alibaba.nacos</groupId>
        <artifactId>nacos-client</artifactId>
        <version>${nacos.client.version}</version>
    </dependency>
</dependencies>
```

#### 3.2.2. Query and Subscribe Agent

```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "{serverAddr}");
AiService aiService = AiFactory.createAiService(properties);
try {
    String agentName = "{agentName}";
    //  Query default published version of agent
    AgentCard result = aiService.getAgentCard(agentName);
    // The A2AClient is a custom implementation for initiating A2A calls, such as: Google A2A Java Client.
    A2AClient a2aClient = new A2AClient(result);
    a2aClient.call();

    // Subscribe to this AgentCard. This listener will be triggered when the Agent releases a new version of the AgentCard or when the service endpoints of the AgentCard change.
    aiService.subscribeAgentCard(agentName, new AbstractNacosAgentCardListener() {
        @Override 
        public void onEvent (NacosAgentCardEvent event){
            System.out.println("---------------agent card listener called start---------------");
            // When there is an update to the AgentCard, update the AgentCard required by the A2AClient.
            a2aClient.updateAgentCard(event.getAgentCard());
            System.out.println("---------------agent card listener called end---------------");
        }
    });
    a2aClient.call();
} catch (Exception e){
    e.printStackTrace();
}
```

### 3.3. Query Agent

Nacos also supports retrieving AgentCard information exactly by Agent name via [HTTP APIs](../../admin/admin-api.md#5-a2a注册中心), and performing fuzzy searches for AgentCard information by Agent name.

> The capability for fuzzy searches based on skills, tags, and descriptions is currently under development.

#### 3.3.1. Query Agent detail information by Name

Through [Query HTTP的API](../../admin/admin-api.md#53-查询agentcard的详情), Query the detail information of an Agent by Agent name. Such as：

```bash
curl -X GET '127.0.0.1:8848/nacos/v3/admin/ai/a2a?namespaceId=public&agentName=GeoSpatial+Route+Planner+Agent'
```

#### 3.3.2. Search Agent list by Name

Through[Search HTTP的API](../../admin/admin-api.md#52-查询agentcard的列表)，Search the list of AgentCards by Agent name. Such as：

```shell
curl -X GET '127.0.0.1:8848/nacos/v3/admin/ai/a2a/list?pageNo=1&pageSize=100&agentName=Planner&namespaceId=public&search=blur'
```

### 3.4. Retrieve and View Agents via Console

- Log in to the Nacos console, enter the `Agent Management` -> `Agent List` page to view all Agents under the current namespace.
- Fill in the Agent name in the `Agent Name` input field and click the `Search` button to view the list of fuzzy-matched Agents.
- On the `Agent List` page, click Details in the rightmost `Operations` column to navigate to the `Agent Details` page and view detailed information about the Agent.

## 4. Roadmap of Nacos A2A Registry

### 4.1. Multi-Language Client Support

Currently, the SDK for the Agent registry component only supports `Java`. SDKs for other languages such as `Python` and `Go` are under development.

### 4.2. More filtering and search dimensions.

Filtering, troubleshooting, and filtering Agents based on `skills` and `tags` is a planned capability of the Agent registry, scheduled for support in future releases.

### 4.3. Official A2A Registry Protocol Support

According to the official A2A Roadmap, a standard A2A Registry Protocol will be defined for discovering Agents or AgentCards. The standard Registry Protocol is currently under [discussion](https://github.com/a2aproject/A2A/discussions/741) in the community.

The Nacos community will actively participate in discussions and closely follow the definition and release of this standard A2A Registry Protocol. Once the standard is released, the Nacos community will prioritize adapting and implementing it.
