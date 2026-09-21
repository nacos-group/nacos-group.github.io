---
title: RAD Integration Guide
keywords: [RAD, Remote Agent Discovery, Agent Discovery, Agent Subscriptions, Runtime Endpoints]
description: Search, discover and subscribe to Agents and manage runtime endpoints with the Nacos 3.3 Java SDK and HTTP APIs.
sidebar:
  order: 3.1
---

# RAD Integration Guide

RAD (Remote Agent Discovery) is the general Agent discovery capability in Nacos 3.3. It provides Search, Discover, Watch, and runtime endpoint registration and deregistration. See [Agent Management](./agent-registry.md) for definition creation, version publishing and A2A compatibility.

RAD and ARD (Agentic Resource Discovery) are different capabilities. This page covers application discovery of Agent call interfaces and runtime endpoints; ARD integration across AI resources is configured separately.

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

The example puts publisher and consumer operations in one process, so the account needs read and endpoint write permissions for this Agent. Real applications should configure only their required permissions. Start the Agent service yourself: registering its address neither starts the business service nor verifies that actual calls succeed.

## 2. Java SDK: Register, Discover, Subscribe and Clean Up

Access general Agent operations through `AiService.agent()`. An SDK instance binds to one namespace; business objects such as `AgentSearchRequest` and `AgentEndpointRegistrationBatch` do not set it again.

This complete example registers a runtime endpoint, searches the catalog, discovers exactly `1.0.0` and subscribes to that version. Pressing Enter cancels the subscription, deregisters the endpoint and closes the SDK.

```java
import com.alibaba.nacos.api.ai.AiFactory;
import com.alibaba.nacos.api.ai.AiService;
import com.alibaba.nacos.api.ai.AgentService;
import com.alibaba.nacos.api.ai.listener.AbstractNacosAgentDiscoveryListener;
import com.alibaba.nacos.api.ai.listener.NacosAgentDiscoveryEvent;
import com.alibaba.nacos.api.ai.listener.NacosAgentDiscoveryEventType;
import com.alibaba.nacos.api.ai.model.agent.AgentDiscoveryFilter;
import com.alibaba.nacos.api.ai.model.agent.AgentDiscoveryResult;
import com.alibaba.nacos.api.ai.model.agent.AgentEndpointRegistrationBatch;
import com.alibaba.nacos.api.ai.model.agent.AgentReference;
import com.alibaba.nacos.api.ai.model.agent.AgentSearchRequest;
import com.alibaba.nacos.api.ai.model.agent.AgentSummary;
import com.alibaba.nacos.api.ai.model.agent.Endpoint;
import com.alibaba.nacos.api.ai.model.agent.EndpointSource;
import com.alibaba.nacos.api.model.Page;

import java.util.Collections;
import java.util.Properties;

public class AgentDiscoveryExample {
    public static void main(String[] args) throws Exception {
        Properties properties = new Properties();
        properties.setProperty("serverAddr", System.getenv("NACOS_SERVER_ADDR"));
        properties.setProperty("namespace", "public");
        properties.setProperty("username", System.getenv("NACOS_USERNAME"));
        properties.setProperty("password", System.getenv("NACOS_PASSWORD"));
        properties.setProperty("nacosAiTransportMode", "http");
        AiService aiService = AiFactory.createAiService(properties);
        AgentService agents = aiService.agent();

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

        AgentReference reference = new AgentReference();
        reference.setAgentName("route-planner");
        reference.setVersion("1.0.0");
        AgentDiscoveryFilter filter = new AgentDiscoveryFilter();
        filter.setProtocols(Collections.singletonList("a2a"));
        filter.setEndpointSources(Collections.singletonList(EndpointSource.RUNTIME));

        AbstractNacosAgentDiscoveryListener listener = new AbstractNacosAgentDiscoveryListener() {
            @Override
            public void onEvent(NacosAgentDiscoveryEvent event) {
                if (event.getType() == NacosAgentDiscoveryEventType.SNAPSHOT) {
                    printSnapshot(event.getAgentDiscoveryResult());
                } else {
                    // Invalidate the old snapshot when discovery becomes unavailable.
                    System.err.println(event.getErrorCode() + ": " + event.getErrorMessage());
                }
            }
        };

        try {
            agents.registerAgentEndpoints(batch);
            try {
                AgentSearchRequest search = new AgentSearchRequest();
                search.setAgentNameContains("route");
                search.setTagsAll(Collections.singletonList("routing"));
                search.setProtocolsAny(Collections.singletonList("a2a"));
                search.setPageNo(1);
                search.setPageSize(20);
                Page<AgentSummary> catalog = agents.searchAgents(search);
                System.out.println("Catalog matches: " + catalog.getTotalCount());

                printSnapshot(agents.discoverAgent(reference, filter));
                AgentDiscoveryResult initial = agents.subscribeAgent(reference, filter, listener);
                try {
                    printSnapshot(initial);
                    System.out.println("Press Enter to unsubscribe and deregister.");
                    System.in.read();
                } finally {
                    agents.unsubscribeAgent(reference, filter, listener);
                }
            } finally {
                agents.deregisterAgentEndpoints("route-planner", "a2a",
                        Collections.singletonList(endpoint));
            }
        } finally {
            aiService.shutdown();
        }
    }

    private static void printSnapshot(AgentDiscoveryResult snapshot) {
        if (snapshot == null) {
            System.out.println("Agent is not available yet.");
            return;
        }
        System.out.println("Definition version: " + snapshot.getVersion());
        snapshot.getCallInterfaces().forEach(callInterface ->
                callInterface.getEndpointSets().forEach(endpointSet ->
                        endpointSet.getEndpoints().forEach(endpoint ->
                                System.out.println(endpointSet.getSource() + " "
                                        + endpoint.getUri() + " healthy=" + endpoint.getHealthy()))));
    }
}
```

The example explicitly selects `http`; the SDK manages HTTP client identity, heartbeats and Watch. `nacosAiTransportMode` also supports `grpc` and `auto`, with `grpc` as the default. `auto` selects a transport according to available capabilities. See the [SDK Runtime Guide](../sdk/runtime-guide.md) for configuration and network requirements.

The example only prints discovery results; it does not make A2A calls. Business applications should select endpoints by protocol, source order, health and priority/weight, then call them through the appropriate protocol client. Lower `priority` values are preferred; `weight` can distribute traffic among endpoints at the same priority.

### 2.1. Runtime Registration Rules

- `registerAgentEndpoints` replaces the current SDK publisher's **complete endpoint set** for a namespace, Agent and protocol. When updating one endpoint, include all other endpoints to retain; this is not an append operation.
- `runtimeVersion` identifies the running application version, while `versionRange` describes compatible definition versions. `[1.0.0]` matches one version. Declare a range such as `[1.0.0,2.0.0)` only when the application actually supports it, and ensure that the range includes the runtime version.
- Within a protocol, endpoint identity uses the URI host, effective port and `transport`. Addresses differing only by path or query cannot be registered as two independent endpoints from the same publisher.
- Endpoints may be registered before the definition is published. Ordinary discovery still requires an enabled Agent, an online target version, a matching protocol and a compatible version range.
- Keep the SDK instance alive while the application runs. Deregister and close it on normal exit. Cancelling a subscription does not deregister endpoints, and taking a definition offline does not stop application instances.

### 2.2. Subscriptions and Unavailable Events

`subscribeAgent` returns the current complete snapshot. If the target does not yet exist, it can return `null` and retain the subscription so that notification resumes when the target appears. Subsequent events also carry complete replacement snapshots; applications do not merge field-level deltas.

`UNAVAILABLE` means the current result is unavailable and the application should invalidate its old result. A subscription can wait for a temporarily missing target to return. Terminal authentication or capacity errors end observation; explicitly resubscribe after resolving the problem. The SDK reconnects after transient connection failures.

Watch in 3.3 can use server notifications. When the relevant capability is unavailable, the SDK falls back to bounded Discover polling. Subscriptions do not guarantee delivery of every intermediate change. Unsubscribe using the original Reference, Filter and the same Listener instance.

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

This request returns only runtime endpoints compatible with the current `latest`, filtered to `zone=local`. Keep the section 2 example running; after it deregisters, the endpoint set may be empty. To use declared addresses, remove the `endpointSource` and runtime metadata conditions, or explicitly select `DECLARED`.

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
