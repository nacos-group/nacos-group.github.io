---
title: RAD 接入指南
keywords: [RAD, Remote Agent Discovery, Agent 发现, Agent 订阅, 运行端点]
description: 使用 Nacos 3.3 Java SDK 和 HTTP 接口搜索、发现、订阅 Agent，并管理运行端点。
sidebar:
  order: 3.1
---

# RAD 接入指南

RAD（Remote Agent Discovery）是 Nacos 3.3 的通用 Agent 发现能力，提供 Search、Discover、Watch 以及运行端点注册和注销。Agent 定义的创建、版本发布和 A2A 兼容说明见 [Agent 管理](./agent-registry.md)。

RAD 与 ARD（Agentic Resource Discovery）是不同的能力。本文介绍应用如何发现 Agent 的调用接口与运行端点；跨 AI 资源的 ARD 生态接入另行配置。

RAD 请求使用的 HTTP/gRPC 是应用访问 Nacos 的传输方式。发现结果中的 `protocol=a2a`、`transport=JSONRPC` 等描述应用如何调用 Agent，两者分别配置。

## 1. 发布定义并准备接入

先按 [Agent 管理](./agent-registry.md)创建并发布 `public` 命名空间中的 `route-planner`、版本 `1.0.0`，确认版本已为 `online`。定义包含 `a2a` 调用接口，示例运行地址为 `http://127.0.0.1:9999/a2a`。

本例使用 3.3 Java SDK；Maven 坐标为 `com.alibaba.nacos:nacos-client`。将 `${nacos.client.version}` 设置为所使用的 3.3 版本号。

```xml
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-client</artifactId>
    <version>${nacos.client.version}</version>
</dependency>
```

按[配置访问凭据](../auth.mdx)准备业务账号。以下 Java 示例显式读取环境变量：

```bash
export NACOS_SERVER_ADDR='127.0.0.1:8848'
export NACOS_USERNAME='<your-username>'
export NACOS_PASSWORD='<your-password>'
export AGENT_ENDPOINT_URI='http://127.0.0.1:9999/a2a'
```

示例把发布端与使用端放在一个进程中演示，因此账号需要该 Agent 的读取和端点写入权限。实际应用应分别配置所需权限。Agent 服务需要由你启动；登记地址不会启动业务服务，也不会验证实际业务调用是否成功。

## 2. Java SDK：注册、发现、订阅与清理

通用 Agent 操作通过 `AiService.agent()` 获取。SDK 实例绑定一个命名空间，`AgentSearchRequest`、`AgentEndpointRegistrationBatch` 等业务对象不再重复设置命名空间。

下面的完整示例注册一个运行端点，搜索目录、精确发现 `1.0.0`，订阅同一版本；按回车退出时取消订阅、注销端点并关闭 SDK。

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
                    // 业务应用应撤销旧快照，停止使用已不可用的发现结果。
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

示例显式选择 `http`，SDK 会管理 HTTP 注册所需的客户端标识、心跳和 Watch。`nacosAiTransportMode` 也支持 `grpc` 和 `auto`，未配置时默认为 `grpc`；`auto` 在可用能力范围内选择传输。配置及网络要求见 [SDK 运行指南](../sdk/runtime-guide.md)。

示例只打印发现结果，不执行 A2A 调用。业务应用应按协议、来源顺序、健康状态及 priority/weight 选择端点，再交给相应协议客户端调用。`priority` 数值越小越优先，同优先级可按 `weight` 分配流量。

### 2.1. 运行端点注册规则

- `registerAgentEndpoints` 替换当前 SDK 发布者在“命名空间 + Agent + 协议”下的**完整端点集合**。更新一个端点时也要提交需要保留的其余端点，不能把它当作追加接口。
- `runtimeVersion` 表示实际运行版本，`versionRange` 表示它能服务的定义版本范围。`[1.0.0]` 只兼容一个版本；只有应用确实兼容时才声明如 `[1.0.0,2.0.0)` 的范围，并确保范围包含运行版本。
- 同一协议下，端点按 URI 的主机、有效端口和 `transport` 区分；同一地址仅 path 或 query 不同，不能作为同一发布者的两个独立端点注册。
- 支持先注册端点再发布定义，但普通发现仍要求 Agent 启用、目标版本上线、协议匹配且版本范围兼容。
- 应用运行期间保留 SDK 实例。正常退出时显式注销并关闭 SDK；仅取消订阅不会注销端点，仅下线定义也不会停止应用实例。

### 2.2. 订阅与不可用事件

`subscribeAgent` 返回当前完整快照；目标尚不存在时可返回 `null` 并保留订阅，目标出现后继续通知。后续事件也使用完整替换快照，应用无需按字段拼接增量。

`UNAVAILABLE` 表示当前结果不可用，应用应撤销旧结果。目标暂时不存在时，订阅可等待恢复；鉴权或容量等终止性错误会结束观察，解决问题后需显式重新订阅。瞬时连接故障由 SDK 重连处理。

3.3 的 Watch 可使用服务端通知；不具备相应能力时由 SDK 回退为有界的 Discover 轮询。订阅不保证逐次交付每个中间变化。取消订阅时使用原来的 Reference、Filter 和同一个 Listener 实例。

## 3. 通过 HTTP 搜索与发现

其他语言也可使用 Client HTTP 接口。以下命令使用[登录后保存的 token](../auth.mdx)，在 Bash 中运行。

### 3.1. 搜索目录

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

可重复传入 `tagsAll`（全部匹配）和 `protocolsAny`（任一匹配）。名称是区分大小写的字面量子串，`%`、`_` 不表示通配符。`pageNo` 从 1 开始，`pageSize` 默认 20、最大 100。

响应的 `data` 使用 `totalCount`、`pageNumber`、`pagesAvailable` 和 `pageItems`。每个 Agent 的在线版本位于 `versionInfo.onlineVersions`，默认版本通过 `versionInfo.labels.latest` 读取。目录不包含完整协议描述和端点，也不保证存在健康实例。刚发布后的搜索结果可能因索引同步而暂不完整。

### 3.2. 获取调用定义和端点

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

此请求只返回兼容当前 `latest` 的运行端点，并限制 `zone=local`。请保持第 2 节示例运行，否则它注销后可能返回空端点集合。改用声明地址时去掉 `endpointSource` 和运行时 metadata 条件，或显式选择 `DECLARED`。

HTTP 过滤参数名是 `protocol`、`transport`、`endpointSource`；与 Java 模型的复数字段名不同。数组内按 OR 匹配，不同条件按 AND 匹配，`metadataSelector` 的所有键值都必须匹配。

结果中的定义位于 `data.callInterfaces`，地址位于每个接口的 `endpointSets[].endpoints[]`。过滤后可能出现空接口列表或空端点集合；运行端点也可能 `healthy=false`。应先判断结果再选择地址，不能直接假定第一项可调用。版本选择差异见 [Agent 管理](./agent-registry.md)。

### 3.3. 直接实现 HTTP 注册与 Watch

长期运行的 Java 应用优先使用上述 SDK 示例。自行实现 HTTP 发布端时，除了 token，还需维护稳定的 `X-Nacos-Client-Id` 并携带 `Request-Module: AI`，按注册响应中的 `heartbeatIntervalMillis` 发送心跳。该客户端标识不能代替鉴权凭据。

- `POST /nacos/v3/client/ai/agents/endpoints`：以表单提交完整端点集合，`endpoints` 是 JSON 数组字符串。
- `PUT /nacos/v3/client/ai/agents/endpoints/heartbeat`：维护当前发布者活性。
- `DELETE /nacos/v3/client/ai/agents/endpoints`：用 `namespaceId`、`agentName`、`protocol` 表单删除当前发布者的整组端点；部分注销应重新提交完整剩余集合。
- `POST /nacos/v3/client/ai/agents/watch`：使用批量长轮询，返回变化标识；调用方需要重新 Discover 获取内容。单次 curl 不能代替持续订阅。

## 4. 发布与运行时验证

1. 通过管理端确认 Agent 已启用且目标版本为 `online`，发布者与消费者使用相同命名空间。
2. 从消费者执行 Discover，检查所选定义版本、接口协议、端点来源和地址。需要严格版本边界时使用显式版本或标签。
3. 保持注册端 SDK 运行，调整端点或发布新版本，观察订阅结果。固定版本订阅不会因为 `latest` 切换而改选版本。
4. 在实际协议客户端中验证调用、网络和业务鉴权。
5. 退出演示程序后确认运行端点已注销。声明地址随定义保留，不因运行端点注销而自动删除。
