---
title: RAD Integration Guide
keywords: [RAD, Remote Agent Discovery, Agent Discovery, Agent Subscriptions, Runtime Endpoints]
description: Search, discover and subscribe to Agents and manage runtime endpoints with the Nacos 3.3 Java SDK and HTTP APIs.
sidebar:
  order: 3.1
---

# RAD Integration Guide

RAD (Remote Agent Discovery) is the general Agent discovery capability in Nacos 3.3. It provides Search, Discover, Watch, and runtime endpoint registration and deregistration. See [Agent Management](./agent-registry.md) for definition creation, version publishing and A2A compatibility.

RAD and ARD (Agentic Resource Discovery) are different capabilities. This page covers application discovery of Agent call interfaces and runtime endpoints. See [ARD Resource Discovery](./ard-discovery.md) for search and artifact retrieval across AI resources, and the [ARD Integration Guide](../../../ecology/use-nacos-with-ard.md) for server setup.

HTTP/gRPC for RAD requests describes how applications connect to Nacos. Values such as `protocol=a2a` and `transport=JSONRPC` in discovery results describe how applications call the Agent. Configure these separately.

## 1. Publish a Definition and Prepare the Client

Follow [Agent Management](./agent-registry.md) to create and publish `route-planner`, version `1.0.0`, in the `public` namespace. Confirm that the version is `online`. Its definition contains an `a2a` call interface; the example runtime address is `http://127.0.0.1:9999/a2a`.

This example uses the stable 3.3.0 Java SDK, with Maven coordinates `com.alibaba.nacos:nacos-client`. Set `${nacos.client.version}` to `3.3.0`.

```xml
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-client</artifactId>
    <version>${nacos.client.version}</version>
</dependency>
```

Prepare a business account following [Access Credentials](../auth.mdx). The Java example explicitly reads these environment variables:

```bash
export NACOS_SERVER_ADDR='127.0.0.1:8848'
export NACOS_USERNAME='<your-username>'
export NACOS_PASSWORD='<your-password>'
export AGENT_ENDPOINT_URI='http://127.0.0.1:9999/a2a'
```

The subscriber needs read permission for this Agent; the endpoint registration example also requires endpoint write permission. Configure each application with its required permissions. Start the Agent service yourself: registering its address neither starts the business service nor verifies that actual calls succeed.

## 2. Java SDK: Subscribe and Clean Up

Access general Agent operations through `AiService.agent()`. RAD Discover/Watch are new in 3.3.0. An SDK instance binds to one namespace; business objects do not set it again.

The following complete example subscribes to version `1.0.0` of `route-planner` and saves results in the listener. Press Enter to inspect the current result, then unsubscribe and close the client.

```java
import com.alibaba.nacos.api.ai.AiFactory;
import com.alibaba.nacos.api.ai.AiService;
import com.alibaba.nacos.api.ai.AgentService;
import com.alibaba.nacos.api.ai.listener.AbstractNacosAgentDiscoveryListener;
import com.alibaba.nacos.api.ai.listener.NacosAgentDiscoveryEvent;
import com.alibaba.nacos.api.ai.listener.NacosAgentDiscoveryEventType;
import com.alibaba.nacos.api.ai.model.agent.AgentDiscoveryFilter;
import com.alibaba.nacos.api.ai.model.agent.AgentReference;
import com.alibaba.nacos.api.ai.model.agent.EndpointSource;

import java.util.Collections;
import java.util.Properties;
import java.util.concurrent.atomic.AtomicReference;

public class AgentWatchExample {
    public static void main(String[] args) throws Exception {
        Properties properties = new Properties();
        properties.setProperty("serverAddr", System.getenv("NACOS_SERVER_ADDR"));
        properties.setProperty("namespace", "public");
        properties.setProperty("username", System.getenv("NACOS_USERNAME"));
        properties.setProperty("password", System.getenv("NACOS_PASSWORD"));
        properties.setProperty("nacosAiTransportMode", "http");

        AgentReference reference = new AgentReference();
        reference.setAgentName("route-planner");
        reference.setVersion("1.0.0");
        AgentDiscoveryFilter filter = new AgentDiscoveryFilter();
        filter.setProtocols(Collections.singletonList("a2a"));
        filter.setEndpointSources(Collections.singletonList(EndpointSource.RUNTIME));

        // Prepare state before subscribing; only the listener writes this view.
        AtomicReference<NacosAgentDiscoveryEvent> current = new AtomicReference<>();
        AbstractNacosAgentDiscoveryListener listener = new AbstractNacosAgentDiscoveryListener() {
            @Override
            public void onEvent(NacosAgentDiscoveryEvent event) {
                current.set(event);
            }
        };

        AiService aiService = AiFactory.createAiService(properties);
        try {
            AgentService agents = aiService.agent();
            agents.subscribeAgent(reference, filter, listener);
            try {
                System.out.println("Press Enter to inspect the current state and unsubscribe.");
                System.in.read();
                NacosAgentDiscoveryEvent event = current.get();
                if (event == null) {
                    System.out.println("Waiting for the first callback.");
                } else if (event.getType() == NacosAgentDiscoveryEventType.SNAPSHOT) {
                    System.out.println("Definition version: "
                            + event.getAgentDiscoveryResult().getVersion());
                } else {
                    System.out.println(event.getErrorCode() + ": " + event.getErrorMessage());
                }
            } finally {
                agents.unsubscribeAgent(reference, filter, listener);
            }
        } finally {
            aiService.shutdown();
        }
    }
}
```

The example connects to Nacos over HTTP. `nacosAiTransportMode` also supports `grpc` and `auto`, and defaults to `grpc`; see the [SDK Runtime Guide](../sdk/runtime-guide.md). An empty `current` means that no callback has arrived yet.

### 2.1. Initial State and Subsequent Callbacks

`subscribeAgent` has no return value. The listener's `onEvent` receives both the initial query result and later changes. A callback may run before the method returns, so prepare the data it needs first. Reusing the same listener with the same query conditions does not create another subscription. A newly added listener also receives the current result.

| Situation | Notification | Application action |
| --- | --- | --- |
| The initial query succeeds, or the Agent definition or addresses change | `SNAPSHOT` with a complete `AgentDiscoveryResult` | Replace the locally saved result |
| An SDK query confirms that the Agent, requested version or label does not exist | `UNAVAILABLE` with an error code and message | Stop using the old result; notifications continue when the target returns |
| No addresses match, or all addresses are unhealthy | Still `SNAPSHOT` | Check the address list and health; this does not mean the Agent was deleted |
| Network, permission or subscription-limit errors occur during a subscription | No notification of the above types | Check client logs and resolve the cause; the SDK keeps the subscription and retries automatically |

If `subscribeAgent` itself throws `NacosException`, the subscription was not created successfully; resolve the cause and call it again. Once the method returns, wait for the listener to receive data. There is no need for another query.

### 2.2. Writing Callbacks

Callbacks for the same listener run one at a time. If processing cannot keep up with changes, the SDK prioritizes the latest result and may skip intermediate states. Use subscriptions to keep current data up to date, rather than to record every change.

Keep callbacks short, preferably just updating local data. Set timeouts for business calls and handle exceptions inside the callback; if `onEvent` throws, the SDK does not automatically retry that callback. If needed, provide a separate thread pool through the listener's `getExecutor()` and close it when the application exits.

To unsubscribe, use the original query conditions and the same listener instance. Unsubscribing or closing the client discards notifications that have not started.

### 2.3. Convert Discovery Results to A2A AgentCard

For a one-shot query, call `agents.discoverAgent(reference, filter)` and close the client when finished. Search the catalog with `agents.searchAgents(AgentSearchRequest)`; see the [Java SDK guide](../java-sdk/usage.md#111-search-agents) for parameters. The following snippets reuse the client setup and reference/filter above and run before the client is closed.

For an A2A Card, explicitly call `AgentConverter<AgentCard>.convert(AgentDiscoveryResult)`:

```java
import com.alibaba.nacos.api.ai.converter.AgentConverter;
import com.alibaba.nacos.api.ai.converter.AgentConverters;
import com.alibaba.nacos.api.ai.model.a2a.AgentCard;
import com.alibaba.nacos.api.ai.model.agent.AgentDiscoveryResult;

AgentConverter<AgentCard> converter = agents.a2aConverter();
// Equivalent standalone factory: AgentConverters.a2a()
AgentDiscoveryResult snapshot = agents.discoverAgent(reference, filter);
try {
    AgentCard card = converter.convert(snapshot);
    System.out.println(card.getName() + ": " + card.getUrl());
} catch (IllegalArgumentException e) {
    // Handle invalid or non-convertible snapshots according to application policy.
    System.err.println(e.getMessage());
}
```

The return type is `com.alibaba.nacos.api.ai.model.a2a.AgentCard` from the Nacos SDK. You can also create the converter with `AgentConverters.a2a()`. Conversion is local and does not query Nacos again. For subscriptions, call the converter inside the callback.

To subscribe and convert results to AgentCards, replace the listener in the section 2 example with the one below. This example clears the saved Card on conversion failure; adjust this behavior to suit your application.

```java
import com.alibaba.nacos.api.ai.converter.AgentConverter;
import com.alibaba.nacos.api.ai.model.a2a.AgentCard;
import com.alibaba.nacos.api.ai.listener.AbstractNacosAgentDiscoveryListener;
import com.alibaba.nacos.api.ai.listener.NacosAgentDiscoveryEvent;
import com.alibaba.nacos.api.ai.listener.NacosAgentDiscoveryEventType;
import java.util.concurrent.atomic.AtomicReference;

AgentConverter<AgentCard> converter = agents.a2aConverter();
AtomicReference<AgentCard> currentCard = new AtomicReference<>();
AbstractNacosAgentDiscoveryListener listener = new AbstractNacosAgentDiscoveryListener() {
    @Override
    public void onEvent(NacosAgentDiscoveryEvent event) {
        if (event.getType() == NacosAgentDiscoveryEventType.UNAVAILABLE) {
            currentCard.set(null);
            return;
        }
        try {
            currentCard.set(converter.convert(event.getAgentDiscoveryResult()));
        } catch (IllegalArgumentException e) {
            // This application invalidates its old Card on conversion failure.
            currentCard.set(null);
            System.err.println(e.getMessage());
        }
    }
};
try {
    agents.subscribeAgent(reference, filter, listener);
    try {
        System.in.read();
    } finally {
        agents.unsubscribeAgent(reference, filter, listener);
    }
} finally {
    aiService.shutdown();
}
```

The converter uses the first non-empty address set for the A2A interface in the discovery result and preserves its order. It does not merge address sets or automatically remove unhealthy addresses; the application still needs to check whether an address is usable.

Conversion throws `IllegalArgumentException` if there is no suitable A2A interface or address, the Card content is invalid, or the name or version does not match. Check the exception message for the cause. Conversion failure does not cancel the subscription.

### 2.4. Register Runtime Addresses

A publisher can create its own `AiService`, obtain `AgentService agents = aiService.agent()` and run this snippet. Keep the instance alive while the application runs, then deregister and close it on exit. Registration does not start the Agent service.

```java
import com.alibaba.nacos.api.ai.model.agent.AgentEndpointRegistrationBatch;
import com.alibaba.nacos.api.ai.model.agent.Endpoint;
import java.util.Collections;

Endpoint endpoint = new Endpoint();
endpoint.setUri(System.getenv("AGENT_ENDPOINT_URI"));
endpoint.setTransport("JSONRPC");
endpoint.setMetadata(Collections.singletonMap("zone", "local"));

AgentEndpointRegistrationBatch batch = new AgentEndpointRegistrationBatch();
batch.setAgentName("route-planner");
batch.setProtocol("a2a");
batch.setRuntimeVersion("1.0.0");
batch.setVersionRange("[1.0.0]");
batch.setEndpoints(Collections.singletonList(endpoint));

try {
    agents.registerAgentEndpoints(batch);
    try {
        System.out.println("Press Enter when the application is ready to stop.");
        System.in.read();
    } finally {
        agents.deregisterAgentEndpoints("route-planner", "a2a",
                Collections.singletonList(endpoint));
    }
} finally {
    aiService.shutdown();
}
```

Each call to `registerAgentEndpoints` must include **all runtime addresses** this client wants to keep for the same Agent and protocol. It replaces the previous address list even if the version changes. Addresses registered by other clients or for other protocols are unaffected:

| Current set | Desired set | Submit now |
| --- | --- | --- |
| A, B | B, C | B, C |
| A | Keep A and add B | A, B |
| A | Replace A with B | B; no subsequent deregistration of A is needed |

- `runtimeVersion` identifies the running version; `versionRange` describes compatible definition versions. `[1.0.0]` matches one version. Use a range such as `[1.0.0,2.0.0)` only when actually compatible, and include the runtime version.
- Within a protocol, endpoint identity uses URI host, effective port and `transport`. Addresses differing only by path or query cannot be two independent endpoints from the same publisher.
- Endpoints can precede definition publication. Ordinary discovery still requires an enabled Agent, an online target version, a matching protocol and a compatible version range.
- `deregisterAgentEndpoints` removes only the specified addresses registered by this client, keeping the rest. When using the older A2A API, note its [whole-version deregistration behavior](../java-sdk/usage.md#74-deregister-agent-endpoint).
- Unsubscribing does not deregister endpoints, and taking a definition offline does not stop application instances.

### 2.5. Supporting Older Servers

If the server supports RAD, use the new APIs above directly; no mode selection is needed. Frameworks that must support both older and newer servers can query RAD support with `AiService.getAgentDiscoveryCapability()`:

- `SUPPORTED`: RAD APIs are supported.
- `NOT_SUPPORTED`: use the older A2A APIs.
- `UNKNOWN`: support cannot be determined yet. Check the connection or use explicit application configuration; do not treat it as unsupported.

The query may contact the server and throw `NacosException` on connection or authentication failure. Call it during initialization, rather than for every business request.

The following example shows how a framework can choose an API. `Mode` is defined by the example, not a Nacos SDK setting. It selects the API to use, independently of the HTTP/gRPC connection setting.

```java
import com.alibaba.nacos.api.ability.constant.AbilityStatus;
import com.alibaba.nacos.api.ai.AiService;
import com.alibaba.nacos.api.exception.NacosException;

public class AgentConsumptionMode {
    // Application/framework policy, not a Nacos SDK property.
    public enum Mode { AUTO, RAD, A2A }

    public static Mode select(AiService aiService, Mode configured) throws NacosException {
        if (configured != Mode.AUTO) {
            return configured;
        }
        AbilityStatus status = aiService.getAgentDiscoveryCapability();
        if (status == AbilityStatus.SUPPORTED) {
            return Mode.RAD;
        }
        if (status == AbilityStatus.NOT_SUPPORTED) {
            return Mode.A2A;
        }
        throw new IllegalStateException("RAD capability is unknown; check connectivity or configure a mode.");
    }
}
```

Use the result of `select` to choose either `subscribeAgent` (RAD) or `subscribeAgentCard` (older A2A), avoiding duplicate subscriptions. RAD support only confirms API availability. Calls can still fail because of permissions or a missing Agent; handle the specific error.

## 3. Search and Discover Through HTTP

Other languages can also use the Client HTTP APIs. Run the following commands in Bash using the [token saved after login](../auth.mdx).

### 3.1. Search the Catalog

```bash
curl -sS -G 'http://127.0.0.1:8848/nacos/v3/client/ai/agents/search' \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  --data-urlencode 'namespaceId=public' \
  --data-urlencode 'agentNameContains=route' \
  --data-urlencode 'tagsAll=routing' \
  --data-urlencode 'protocolsAny=a2a' \
  --data-urlencode 'pageNo=1' \
  --data-urlencode 'pageSize=20'
```

Repeat `tagsAll` for an all-tags match and `protocolsAny` for an any-protocol match. Name matching is a case-sensitive literal substring; `%` and `_` are not wildcards. `pageNo` starts at 1; `pageSize` defaults to 20 and has a maximum of 100.

Response `data` uses `totalCount`, `pageNumber`, `pagesAvailable` and `pageItems`. Each Agent's online versions are in `versionInfo.onlineVersions`; read its default version from `versionInfo.labels.latest`. The catalog contains neither complete protocol descriptors nor endpoints, and does not guarantee healthy instances. Search results can be temporarily incomplete while a newly published definition is being indexed.

### 3.2. Get Call Definitions and Endpoints

```bash
curl -sS -G 'http://127.0.0.1:8848/nacos/v3/client/ai/agents' \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  --data-urlencode 'namespaceId=public' \
  --data-urlencode 'agentName=route-planner' \
  --data-urlencode 'label=latest' \
  --data-urlencode 'protocol=a2a' \
  --data-urlencode 'endpointSource=RUNTIME' \
  --data-urlencode 'transport=JSONRPC' \
  --data-urlencode 'metadataSelector={"zone":"local"}'
```

This request returns only runtime endpoints compatible with the current `latest`, filtered to `zone=local`. Keep the publisher example in section 2.4 running; after it deregisters, the endpoint set may be empty. To use declared addresses, remove the `endpointSource` and runtime metadata conditions, or explicitly select `DECLARED`.

HTTP filter parameters are named `protocol`, `transport` and `endpointSource`, unlike the plural Java model fields. Values within one array match by OR; different conditions match by AND. Every key/value in `metadataSelector` must match.

Definitions are in `data.callInterfaces`, with addresses in each interface's `endpointSets[].endpoints[]`. Filtering can produce empty interface lists or endpoint sets; runtime endpoints can also have `healthy=false`. Inspect the result before selecting an address rather than assuming the first item is callable. See [Agent Management](./agent-registry.md) for version selection differences.

### 3.3. Implementing HTTP Registration and Watch Directly

Long-running Java applications should use the SDK example above. A custom HTTP publisher must maintain a stable `X-Nacos-Client-Id`, send `Request-Module: AI` in addition to its token, and send heartbeats according to the registration response's `heartbeatIntervalMillis`. Client identity does not replace authentication credentials.

- `POST /nacos/v3/client/ai/agents/endpoints`: submit the complete endpoint set as a form, with `endpoints` encoded as a JSON array string.
- `PUT /nacos/v3/client/ai/agents/endpoints/heartbeat`: maintain publisher liveness.
- `DELETE /nacos/v3/client/ai/agents/endpoints`: submit a form with `namespaceId`, `agentName` and `protocol` to remove that publisher's entire endpoint group. For partial removal, resubmit the complete remaining set.
- `POST /nacos/v3/client/ai/agents/watch`: batch long polling returns change identifiers; the consumer must Discover again to fetch content. A single curl request does not provide a continuous subscription.

## 4. Verify Publishing and Runtime Behavior

1. In management, confirm that the Agent is enabled and the target version is `online`. Publishers and consumers must use the same namespace.
2. Run Discover from the consumer and inspect the definition version, call protocol, endpoint source and addresses. Use an explicit version or label when strict version selection is required.
3. Keep the publisher SDK running, change endpoints or publish a new version, and observe subscriptions. A subscription pinned to a version does not change its selected version when `latest` changes.
4. Verify calls, networking and business authentication with the actual protocol client.
5. After exiting the example, confirm that runtime endpoints have been deregistered. Declared addresses remain with the definition and are not removed by runtime deregistration.
