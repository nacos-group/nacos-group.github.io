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

This example requires the 3.3 Java SDK, with Maven coordinates `com.alibaba.nacos:nacos-client`. Set `${nacos.client.version}` to the 3.3 version you use.

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

This minimal complete example subscribes to `route-planner` version `1.0.0`. Only the listener updates the local view, for both initial state and later changes. There is no need to Discover first and then overwrite that view with a synchronous result. Press Enter to inspect the current state, unsubscribe and close the client.

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

The example selects `http`; the SDK manages HTTP Watch. `nacosAiTransportMode` also supports `grpc` and `auto`, with `grpc` as the default. See the [SDK Runtime Guide](../sdk/runtime-guide.md) for network requirements and configuration. Here, `current == null` only means that the application has not received a callback yet; it does not confirm that the target is missing.

### 2.1. Initial State and Subsequent Callbacks

Both `subscribeAgent` overloads return `void`. A callback may run before or after the method returns, so prepare the listener's state first. Repeating the same reference, filter and listener instance is idempotent and does not repeat initialization. A new listener joining an existing Watch still receives the current complete state. Unsubscribe with the corresponding reference, filter and the same listener instance.

| Scenario | What the listener receives | Application action |
| --- | --- | --- |
| Successful initial discovery, or a later content change | `SNAPSHOT` containing a complete `AgentDiscoveryResult` | Replace the whole local snapshot; do not merge field-level deltas |
| A valid, authorized Discover confirms that the reference cannot be found, such as a missing Agent, version or label | `UNAVAILABLE`, with no result and with an error code and message | Invalidate the old result; the subscription remains and resumes snapshots when the target returns |
| No endpoints, no interfaces after filtering, or only unhealthy endpoints | A valid `SNAPSHOT` | Decide whether any address is usable; this does not mean the target is missing |
| Network, server, authentication, quota, migration or background execution failures after acceptance | No data event | The SDK retains the subscription and last confirmed state and recovers with backoff; resolve the actual fault without repeatedly subscribing |

An initial call can still throw `NacosException` for parameter validation, initial Discover or synchronous admission failures. The new subscription was not accepted in this case; resolve the cause before calling again. This differs from **background recovery after acceptance**. A raw HTTP 404 or Watch rejection alone is not an `UNAVAILABLE` event either.

The SDK handles the initialization window through fingerprint checks, follow-up discovery and a shared delivery path. If Discover reads A but the state becomes B before Watch is established, the SDK checks the latest state; it does not deliver B and then send stale initialization A. Applications normally need no manual recheck or initialization-race workaround. This provides eventual delivery of the latest complete state, not cross-node linearizability or every intermediate version. HTTP/gRPC wire APIs are unchanged by this SDK behavior.

### 2.2. Slow Callbacks, Failures and HTTP Quotas

Callbacks for each listener run serially. The SDK retains only the latest pending state instead of accumulating all historical changes. Intermediate snapshots and brief `UNAVAILABLE` states may coalesce. The latest complete state is delivered when execution becomes available; per-event delivery and exactly-once processing are not guaranteed.

If an Executor rejects a task or `getExecutor()` throws, the SDK retains the latest state for local retry without waiting for another server change. If `onEvent` has already started and throws, the error is logged and that callback is not automatically replayed, avoiding duplicate business side effects. Unsubscribe or shutdown discards notifications that have not started.

Blocking I/O in a callback does not block transport, polling or Discover processing. However, other listeners can be delayed if the shared callback pool is blocked. Update local state quickly, give business I/O timeouts and handle your own exceptions. If needed, supply an appropriately sized executor through the listener's `getExecutor()` and close that application-owned executor on exit.

Initial remote HTTP Watch admission is asynchronous: returning from `subscribeAgent` does not mean the server has acknowledged every Watch. If an expanded set hits a quota, the SDK retains accepted additions, prioritizes the previously successful set and retries at a limited rate. Further growth during known exhaustion can fail synchronously. Adding a listener to an existing Watch is not remote growth. Observe client logs, address the quota cause and cancel unnecessary subscriptions; the SDK continues recovery. Applications need not track the successful set or resubscribe in batches.

Watch uses gRPC notifications or HTTP batch long polling. When the configured Watch channel is unavailable, or a binding failure permits fallback, the SDK can use internal Discover polling, which still requires RAD Discover support. Polling is not a third protocol applications must select. A Watch does not keep both gRPC push and periodic Discover polling running in steady state; brief overlap is possible during a switch. Applications need not manage Transport objects.

### 2.3. One-Shot Discovery and Explicit A2A Conversion

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

The result is Nacos's `com.alibaba.nacos.api.ai.model.a2a.AgentCard`, not an external `io.a2a.spec` type. `AgentService.a2aConverter()` and the standalone `AgentConverters.a2a()` factory are equivalent. Conversion is local, stateless and reusable, returning an independent object each time. It performs no network requests, node selection or load balancing. Discover and Watch do not invoke it automatically.

To consume subscription results, replace the minimal example's listener with the following approach and install only this subscription. This example clears the application's saved Card on conversion failure; choose an error policy appropriate to your application.

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

The converter selects the A2A interface's first non-empty `EndpointSet` in discovery-result order. That order already reflects the configured `RUNTIME` / `DECLARED` preference and current filters. It uses only one set, does not merge sources and does not restore filtered addresses from the descriptor. It preserves the selected set's order and unhealthy addresses. The first entry determines the preferred `supportedInterfaces` entry and legacy `url`, `preferredTransport` and `protocolVersion` fields; the descriptor's old `preferredTransport` does not reselect it. Applications still assess address health and business reachability.

A missing convertible A2A interface or address, an invalid descriptor, or a name/version mismatch throws `IllegalArgumentException`; its message identifies the cause. The converter does not return null or an empty Card. Conversion failure neither becomes `UNAVAILABLE` nor cancels the subscription. These public converter rules do not define the legacy A2A facade's historical projection or fallback behavior.

### 2.4. Register the Complete Runtime Endpoint Set

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

`registerAgentEndpoints` replaces this client's **complete Batch** for the same Agent and protocol. Versions do not create separate Batches. Other clients' and other protocols' contributions are unaffected:

| Current set | Desired set | Submit now |
| --- | --- | --- |
| A, B | B, C | B, C |
| A | Keep A and add B | A, B |
| A | Replace A with B | B; no subsequent deregistration of A is needed |

- `runtimeVersion` identifies the running version; `versionRange` describes compatible definition versions. `[1.0.0]` matches one version. Use a range such as `[1.0.0,2.0.0)` only when actually compatible, and include the runtime version.
- Within a protocol, endpoint identity uses URI host, effective port and `transport`. Addresses differing only by path or query cannot be two independent endpoints from the same publisher.
- Endpoints can precede definition publication. Ordinary discovery still requires an enabled Agent, an online target version, a matching protocol and a compatible version range.
- `deregisterAgentEndpoints` removes this client's contributions by address identity; the SDK submits the complete remaining set, or deregisters the whole contribution when empty. This differs from legacy A2A whole-version deregistration; see the [Java SDK guide](../java-sdk/usage.md#74-deregister-agent-endpoint).
- Unsubscribing does not deregister endpoints, and taking a definition offline does not stop application instances.

### 2.5. Choose a Consumption API by Configuration and Capability

Frameworks supporting both A2A and RAD can query the effective Agent transport with `AiService.getAgentDiscoveryCapability()`. `SUPPORTED` means support is established, `NOT_SUPPORTED` means reliable negative evidence, and `UNKNOWN` means insufficient evidence. Connection, timeout, authentication or probe failures can throw `NacosException`; do not classify them as `NOT_SUPPORTED`. A cold query may perform bounded network probes, so it is not necessarily local or instantaneous; probing multiple addresses can add to the duration.

This example honors explicit application configuration and queries capability only for AUTO. Its Mode is a framework consumption policy, separate from the HTTP/gRPC transport choice in `nacosAiTransportMode`.

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

Call `select` once, then install only `subscribeAgent` (RAD) or `subscribeAgentCard` (A2A) for that consumption view. Do not probe protocols through business failures or install duplicate subscriptions through both APIs. For `UNKNOWN`, wait for evidence or require explicit configuration; it does not mean unsupported.

`SUPPORTED` describes protocol capability only. It does not guarantee permissions, resource existence, migration readiness or business success. An operation can still encounter `AGENT_MIGRATION_IN_PROGRESS`; address migration admission rather than falling back to the old protocol. Explicit A2A selects the Card facade, not necessarily the legacy wire path.

The capability query neither fixes nor switches the legacy A2A facade's instance route. Once an instance selects legacy A2A, a server upgrade does not switch that live instance to RAD. Recreate the client to select according to current capabilities. The capability result is also not a query of the facade's current route.

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
