---
title: Agent Management
keywords: [Agent Management, RAD, Remote Agent Discovery, A2A Registry, AgentCard]
description: Learn how Nacos 3.3 manages Agent resources, version publishing, runtime endpoints and RAD discovery, while retaining A2A integrations.
sidebar:
  order: 3
---

# Agent Management

Nacos introduced A2A Agent registration and discovery in 3.1. In 3.3, Agent management becomes a general Agent resource model: it manages identity, catalog metadata, versioned call definitions and runtime endpoints, with search, discovery and subscriptions through RAD (Remote Agent Discovery).

A2A remains a supported integration. AgentCard is retained as the native descriptor of an A2A call interface, and existing A2A applications can continue to connect. This page covers management and publishing; see the [RAD Integration Guide](./rad-discovery.md) for a complete application example covering endpoint registration, discovery and subscriptions.

Nacos tells applications which Agent to use, how it can be called and where its endpoints are. Agent applications and their protocol clients perform the actual message, task and streaming calls.

## 1. Understanding Agent Resources

### 1.1. Identity, Catalog and Versions

| Content | What it manages | When to change it |
| --- | --- | --- |
| Agent | Name, display name, description, provider, business tags, enabled status and visibility | When updating catalog metadata or governance policies |
| Agent version | A published call definition containing `callInterfaces` | Create a new draft when the protocol, native descriptor or declared addresses change |
| CallInterface | `protocol`, `protocolVersion`, `nativeDescriptor` and endpoint source order | Edit and publish with the version |
| Runtime Endpoint | An application's current address, runtime version and compatible version range | Register, update and deregister as applications start, scale or stop |

An Agent is uniquely identified by `namespaceId + agentName`. Different namespaces can use the same name; names must be unique within a namespace. `agentName` is immutable after creation, case-sensitive, and contains 1–64 printable ASCII characters, with at least one non-space character. Use `displayName` for names containing other characters.

Versions use `MAJOR.MINOR.PATCH`, for example `1.0.0` or `1.1.0-rc.1`, with a maximum of 64 characters and no `+build` suffix. Published version content cannot be overwritten. Updating the Agent's catalog description or business tags does not require a new definition version.

Agent management covers callable Agents; [AgentSpecs Management](./agentspec-registry.md) covers distributable specification packages. Each manages its own versions and lifecycle.

### 1.2. Call Protocols and Address Sources

`callInterfaces` is an ordered list of call interfaces. A `protocol` cannot appear twice in the same version. An A2A interface uses `protocol=a2a`, with its AgentCard as `nativeDescriptor`. Protocol-specific skills, capabilities and security schemes stay in the native descriptor.

Each call interface has two address sources:

| Source | Typical use | Maintenance |
| --- | --- | --- |
| `DECLARED` | External providers, fixed gateways or stable entry points | Saved in the version definition; A2A addresses must match the AgentCard's interface declarations |
| `RUNTIME` | Automatic application registration and instance scaling | Registered and kept alive by the publisher SDK, then deregistered when the application stops |

`endpointSourceOrder` specifies the recommended order: `["RUNTIME", "DECLARED"]` prefers runtime endpoints, while `["DECLARED", "RUNTIME"]` prefers declared addresses. Both sources must appear exactly once. The order does not disable either source; consumers can explicitly filter sources during discovery.

Publishing a definition does not start the Agent application. Registering runtime endpoints does not create or publish a definition. Providers must keep declared addresses reachable; runtime endpoints also require health and version compatibility checks.

## 2. Prerequisites

- Use Nacos Server 3.3. For an existing cluster, complete the A2A migration steps in the [Upgrading Manual](../../admin/upgrading.mdx) before using the general Agent/RAD endpoints.
- Nacos 3.3 enables client authentication by default. Management accounts need permission to manage the target Agent; application accounts need the relevant read or endpoint write permissions. Follow [Access Credentials](../auth.mdx) to prepare `NACOS_USERNAME` and `NACOS_PASSWORD`. HTTP examples use `NACOS_ACCESS_TOKEN` saved after login.
- Use the same intended namespace for publishers and consumers. The examples use `public`.
- Prepare a running Agent application. `http://127.0.0.1:9999/a2a` is a local example address; replace it with an address reachable by consumers in your deployment.

The built-in visibility policy defaults new Agents to `PUBLIC`. For a private release, create a draft, set it to `PRIVATE` through the separate scope endpoint, then submit it for publication. Scope applies to the whole Agent; new versions and retries do not reset an existing private setting, and create requests do not accept scope directly. See [Change a resource's scope](../../../plugin/visibility-plugin.md#change-a-resources-scope) for examples.

Public visibility does not bypass authentication or grant write permission. See the [Visibility Plugin](../../../plugin/visibility-plugin.md) for defaults and explicit grants. Nacos login credentials do not replace credentials required by the Agent service itself.

## 3. Creating and Publishing an Agent

### 3.1. Managing Through the Console

1. Open **Agent Management** in the AI Registry, select the namespace and click **Create Agent**.
2. If you have an AgentCard, choose **Import a known protocol**, paste the complete A2A AgentCard and verify the name, version and interface addresses in the preview. Alternatively, choose **Create from scratch** and enter the catalog metadata, initial version and call protocol.
3. Saving creates a draft. Check its content, endpoint source order and visibility, then submit it for review.
4. Without an applicable Pipeline, submission publishes the version online directly. With an applicable Pipeline, wait for review completion, check the result and publish after approval.
5. Inspect the definition and runtime endpoint area in the version details, then verify discovery and actual calls from a consumer.

Use **Edit Metadata** to change catalog information and **Edit Draft** to modify an unpublished call definition. To change published content, choose **Create draft from this version** and specify a new version number.

### 3.2. Creating a Draft Through HTTP

Management integrations use endpoints under `/nacos/v3/admin/ai/agents`. This example creates the `route-planner` Agent and its `1.0.0` draft. Save the following call definition as `agent-call-interfaces.json`:

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

This is an A2A 0.3.0 descriptor example. For another A2A version, provide its complete AgentCard and keep its name and version consistent with the enclosing Agent definition. When submitting the general HTTP form directly, keep the AgentCard addresses and `DECLARED` endpoints consistent. The Console A2A import flow performs this conversion.

Run the following Bash command from the directory containing the file:

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

Complex fields such as `callInterfaces` and `tags` are JSON strings inside the form, not a JSON request body. A successful creation leaves the version in `draft`; ordinary runtime discovery cannot use it yet.

### 3.3. Submitting and Checking the Result

Submit the draft:

```bash
curl -sS -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agents/submit' \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  --data-urlencode 'namespaceId=public' \
  --data-urlencode 'agentName=route-planner' \
  --data-urlencode 'version=1.0.0'
```

Check the response and version status. When review is required, inspect the result in the Console or read the exact version:

```bash
curl -sS -G 'http://127.0.0.1:8848/nacos/v3/admin/ai/agents/version' \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  --data-urlencode 'namespaceId=public' \
  --data-urlencode 'agentName=route-planner' \
  --data-urlencode 'version=1.0.0'
```

**Run the publish command below only when the version is `reviewed` and approved.** If it is already `online`, proceed to discovery verification. If review failed, inspect the reason before redrafting or resubmitting.

```bash
curl -sS -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/agents/publish' \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  --data-urlencode 'namespaceId=public' \
  --data-urlencode 'agentName=route-planner' \
  --data-urlencode 'version=1.0.0'
```

### 3.4. Subsequent Versions and Publishing from Code

An Agent can have at most one editing version and one reviewing version. For a subsequent draft, either supply new `callInterfaces` or copy an existing exact version with `basedOnVersion`; do not provide both. After copying, update protocol descriptor versions, addresses and other content in the draft before submission.

The 3.3 Java SDK provides `AiService.agent().publishAgent(AgentPublishRequest)` for application-managed definitions. It uses ordinary submission and Pipeline processing: the first newly created version is submitted automatically; subsequent versions use `autoSubmit`, which defaults to `false`. An existing draft with the same version can be updated; a version already in review or another non-draft state is not overwritten. Check the returned status rather than assuming the method has made the version online. After a write timeout, check the version's current state before deciding whether to retry.

See [AI Resource Lifecycle](./ai-resource-lifecycle.md) for state and operation rules. Standard publishing or bringing a version online sets `latest` to that version. Taking the current `latest` offline selects the greatest remaining online version. The server manages `latest`; custom labels cannot overwrite it.

## 4. Discovering and Using Agents

### 4.1. Search, Discover and Watch

| Capability | Purpose | Main result |
| --- | --- | --- |
| Search | Find Agents by name substring, business tags and call protocol | Visible, enabled Agent catalog entries with online version information |
| Discover | Get a call definition and endpoints by name, version or label | `callInterfaces[].endpointSets[].endpoints[]` |
| Watch | Subscribe to changes for the same discovery conditions | An initial complete snapshot, followed by changes or unavailable events |

Search's `agentNameContains` is case-sensitive; `tagsAll` requires every tag to match exactly; `protocolsAny` requires at least one online version to expose any specified protocol. These are Agent catalog filters, not semantic search over arbitrary AgentCard `skills` or descriptions. A Search match does not guarantee healthy endpoints.

After querying the catalog, use Discover to get call addresses, then call the Agent with an A2A or other appropriate protocol client. See the [RAD Integration Guide](./rad-discovery.md) for examples, filters and subscription cleanup.

### 4.2. Choosing Versions Explicitly

| Selection | Definition version | Runtime endpoint compatibility |
| --- | --- | --- |
| Omit both `version` and `label` | Current `latest` | Runtime endpoints compatible with any currently online version |
| Explicit `label=latest` | Current `latest` | Only runtime endpoints compatible with that version |
| Explicit `version` or another `label` | The corresponding exact online version | Only runtime endpoints compatible with that version |

`version` and `label` are mutually exclusive. Applications that must strictly follow the latest definition should explicitly set `label=latest`. When pinning a version or using a rollout label, verify that the target version is online. Filters only narrow the selected definition's interfaces and addresses; they do not select another version.

## 5. A2A Integration and Compatibility

### 5.1. AgentCard and the General Agent Model

An A2A AgentCard is stored as the `nativeDescriptor` of a `protocol=a2a` call interface. The Card's `name` and `version` identify the Agent and version; its interface URLs provide declared addresses. Existing A2A APIs still publish, query and subscribe to Cards. General RAD APIs return discovery results containing the native Card and endpoint sets.

| Integration | Guidance |
| --- | --- |
| Existing 3.1 / 3.2 Java SDK or legacy A2A HTTP/gRPC APIs | Keep the compatible integration; follow the upgrading guide for existing server data |
| A2A methods in the 3.3 Java SDK | Use `AiService.agent()`; when the server supports RAD, Card, endpoint and subscription operations are adapted through RAD |
| New general Agent applications | Use Search, Discover, Watch and endpoint batch registration in the [RAD Integration Guide](./rad-discovery.md) |

Legacy A2A HTTP/gRPC publishing retains direct-online and `setAsLatest` compatibility behavior. When the 3.3 SDK's A2A methods use RAD, definition publishing follows Client publish's ordinary submission and Pipeline flow. Legacy behavior does not imply that every integration publishes directly online.

Within one SDK instance, choose either native RAD or compatible A2A registration for the same Agent's A2A endpoints; do not mix both. Configure Nacos registry authentication separately from the business authentication declared by the AgentCard.

### 5.2. Custom A2A Applications

The 3.3 Java SDK retains AgentCard operations through the following entry point. `agentCard` must be the complete Card supplied by the application:

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

This fragment illustrates the API entry points. Publishing and runtime consumption usually happen in different applications. Publishers must confirm that the version is online, keep the SDK instance alive while running, deregister endpoints on exit and call `aiService.shutdown()`. A2A subscriptions still use `subscribeAgentCard` / `unsubscribeAgentCard`; new applications that need explicit unavailable events can use RAD Watch.

To integrate with the legacy A2A management HTTP endpoint, save a complete AgentCard as `agent-card.json` and import it:

```bash
curl -sS -X POST 'http://127.0.0.1:8848/nacos/v3/admin/ai/a2a' \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  --data-urlencode 'namespaceId=public' \
  --data-urlencode 'agentCard@agent-card.json'
```

This submits the Card itself; do not use the `callInterfaces` array file from section 3. This endpoint follows the legacy A2A compatibility path described above. Management integrations that require draft review should use the general Agent management endpoint.

### 5.3. Publish Agent by Spring AI Alibaba

The following retains the Spring AI Alibaba `1.0.0.4` integration example for applications already using that version. Check dependencies and configuration for other framework versions against its [version guide](https://java2ai.com/docs/versions/) and [A2A guide](https://v1100.java2ai.com/en/docs/frameworks/agent-framework/advanced/a2a/). Upgrading Nacos Server does not automatically upgrade the framework’s Nacos Client dependency; publishing behavior depends on the actual Client version and selected integration.

#### 5.3.1. Dependencies

```xml
<!-- Spring AI Alibaba version 1.0.0.4 -->
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

#### 5.3.2. Code Agent

The following demonstrates how to use the `Agentic API` defined in Spring AI Alibaba to rapidly define and build agent execution logic. This example creates an `Agent` that directly accesses LLM:

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

#### 5.3.3. Agent Auto-register properties

```yaml
server:
  port: 9999

spring:
  application:
    name: a2a-server-example
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

#### 5.3.4. Bootstrap A2A Server Agent

Start the A2A Server (for example, with `mvn spring-boot:run`), then inspect its Agent version status and endpoints in the Nacos Console. If the actual Client publishes into a review flow, complete review and publishing before verifying calls.

### 5.4. Query/Subscriber and Request Agent by Spring AI Alibaba

#### 5.4.1. Dependencies

```xml
<!-- Spring AI Alibaba version 1.0.0.4 -->
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

#### 5.4.2. Code A2A Agent Client

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

#### 5.4.3. Agent Auto-discovery properties

```yaml
spring:
  application:
    name: a2a-client-example
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

#### 5.4.4. Calling or request for A2A Agent Client

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



## 6. Troubleshooting

| Symptom | Checks and action |
| --- | --- |
| The Console shows an Agent, but the application cannot discover it | Check namespace, enabled status, whether the version is `online`, and the account's permissions and visibility |
| Search misses a newly published Agent while exact Discover succeeds | The search index may still be synchronizing. Retry later rather than immediately recreating the resource |
| The discovery result has no addresses | Check protocol/source filters, declared addresses, runtime registration and whether the registered version range includes the target online version |
| A runtime endpoint has `healthy=false` | Discover retains unhealthy endpoints for consumers to inspect. Select healthy addresses and apply the appropriate selection policy before calling |
| Application instances remain after taking a version offline | Taking a version offline affects definition discovery. Applications must deregister their own runtime endpoints separately |
| Actual calls fail after publishing | Check that the Agent service is running, reachable, uses the expected protocol and has the correct business authentication configured |
| General Agent/RAD requests are rejected during an upgrade | Complete the A2A migration and verification in the upgrading guide before switching to the new endpoints |
