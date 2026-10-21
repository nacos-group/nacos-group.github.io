---
title: RAD 接入指南
keywords: [RAD, Remote Agent Discovery, Agent 发现, Agent 订阅, 运行端点]
description: 使用 Nacos 3.3 Java SDK 和 HTTP 接口搜索、发现、订阅 Agent，并管理运行端点。
sidebar:
  order: 3.1
---

# RAD 接入指南

RAD（Remote Agent Discovery）是 Nacos 3.3 的通用 Agent 发现能力，提供 Search、Discover、Watch 以及运行端点注册和注销。Agent 定义的创建、版本发布和 A2A 兼容说明见 [Agent 管理](./agent-registry.md)。

RAD 与 ARD（Agentic Resource Discovery）是不同的能力。本文介绍应用如何发现 Agent 的调用接口与运行端点；跨 AI 资源的搜索和内容获取见 [ARD 资源发现](./ard-discovery.md)，服务端接入见 [ARD 接入指南](../../../ecology/use-nacos-with-ard.md)。

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

订阅端需要该 Agent 的读取权限；运行端点注册示例还需要端点写入权限。实际应用应分别配置所需权限。Agent 服务需要由你启动；登记地址不会启动业务服务，也不会验证实际业务调用是否成功。

## 2. Java SDK：订阅与清理

通用 Agent 操作通过 `AiService.agent()` 获取。RAD Discover/Watch 从 3.3.0 开始提供。SDK 实例绑定一个命名空间，业务对象不重复设置命名空间。

下面的完整示例订阅 `route-planner` 的 `1.0.0` 版本，在监听器中保存查询结果。按回车查看当前结果，然后取消订阅并关闭客户端。

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

示例使用 HTTP 连接 Nacos。`nacosAiTransportMode` 还支持 `grpc`、`auto`，默认 `grpc`，配置见 [SDK 运行指南](../sdk/runtime-guide.md)。如果 `current` 中还没有数据，表示尚未收到回调。

### 2.1. 初始状态与后续回调

`subscribeAgent` 没有返回值，首次查询结果和后续变化都通过监听器的 `onEvent` 接收。回调可能在方法返回前发生，所以要先准备好监听器使用的数据。对相同的查询条件重复传入同一个监听器，不会重复订阅；添加新的监听器时，它也会收到当前结果。

| 情况 | 收到的通知 | 应用如何处理 |
| --- | --- | --- |
| 首次查询成功，或 Agent 定义、地址发生变化 | `SNAPSHOT`，包含完整的 `AgentDiscoveryResult` | 用新结果替换本地保存的结果 |
| SDK 查询确认 Agent、指定版本或标签不存在 | `UNAVAILABLE`，包含错误码和说明 | 停止使用旧结果；目标恢复后仍会继续收到通知 |
| 没有符合条件的地址，或地址都不健康 | 仍是 `SNAPSHOT` | 检查地址列表和健康状态，不能当作 Agent 已删除 |
| 订阅期间出现网络、权限或订阅数量限制等错误 | 不会作为上述通知发送给监听器 | 查看客户端日志并处理原因；SDK 保留订阅并自动重试，无需重复订阅 |

如果调用 `subscribeAgent` 时直接抛出 `NacosException`，表示本次订阅未成功，需要处理原因后重新调用。方法返回后，等待监听器接收数据即可，不必再主动查询一次。

### 2.2. 编写回调时的注意事项

同一个监听器的回调会依次执行。如果处理速度跟不上变化速度，SDK 会优先通知最新结果，可能跳过中间状态。因此，订阅适合保持当前数据更新，不适合记录每一次变更。

回调中尽量只更新本地数据，避免执行耗时操作。业务调用应设置超时，并在回调内处理异常；`onEvent` 抛出异常后，SDK 不会自动重试这次回调。需要单独的线程池时，可以通过监听器的 `getExecutor()` 提供，并在应用退出时关闭。

取消订阅时，使用原来的查询条件和同一个监听器实例。取消订阅或关闭客户端后，尚未执行的通知会被丢弃。

### 2.3. 查询结果转为 A2A AgentCard

只需要单次查询时，使用 `agents.discoverAgent(reference, filter)`，使用结束后关闭客户端；搜索目录使用 `agents.searchAgents(AgentSearchRequest)`，参数见 [Java SDK 使用手册](../java-sdk/usage.md#111-搜索-agent)。下面的片段沿用上面的客户端创建方式和 reference/filter，在客户端关闭前运行。

需要 A2A Card 时，显式调用 `AgentConverter<AgentCard>.convert(AgentDiscoveryResult)`：

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

返回类型是 Nacos SDK 的 `com.alibaba.nacos.api.ai.model.a2a.AgentCard`。也可以通过 `AgentConverters.a2a()` 创建转换器。转换在本地完成，不会重新查询 Nacos；使用订阅时，也需要在回调中调用转换方法。

需要订阅并转换为 AgentCard 时，可以使用下面的监听器替换第 2 节示例中的监听器。示例在转换失败时清空已保存的 Card，应用可按需要调整。

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

转换器使用发现结果中 A2A 接口的第一组非空地址，并保留地址顺序。它不会合并多组地址或自动排除不健康地址，应用仍需检查地址是否可用。

没有可用的 A2A 接口或地址、Card 内容不合法，或名称、版本不一致时，转换会抛出 `IllegalArgumentException`，可通过异常消息了解原因。转换失败不会取消订阅。

### 2.4. 注册运行地址

发布端可独立创建一个 `AiService`，取得 `AgentService agents = aiService.agent()` 后运行以下片段；应用运行期间保持该实例存活，退出时注销并关闭。注册不会启动 Agent 服务。

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

每次调用 `registerAgentEndpoints`，都要提交本客户端为同一个 Agent、同一种协议保留的**全部运行地址**。即使修改了版本号，也会替换此前的地址列表；其他客户端和其他协议注册的地址不受影响：

| 当前集合 | 目标集合 | 本次应提交 |
| --- | --- | --- |
| A、B | B、C | B、C |
| A | 保留 A 并新增 B | A、B |
| A | 用 B 替换 A | B；无需在注册 B 后再注销 A |

- `runtimeVersion` 表示实际运行版本，`versionRange` 表示可服务的定义版本范围。`[1.0.0]` 只兼容一个版本；只有实际兼容时才声明如 `[1.0.0,2.0.0)` 的范围，且须包含运行版本。
- 同协议下，端点按 URI 的主机、有效端口和 `transport` 区分；仅 path 或 query 不同，不能作为同一发布者的两个独立端点。
- 可以在定义发布前注册端点；普通发现仍要求 Agent 启用、目标版本上线、协议匹配且版本范围兼容。
- `deregisterAgentEndpoints` 只移除本客户端指定的地址，其余地址保留。使用旧 A2A 注销接口时，需要注意[整版本注销行为](../java-sdk/usage.md#74-注销agent的endpoint)。
- 取消订阅不会注销端点，下线定义也不会停止应用实例。

### 2.5. 兼容旧版服务端

如果服务端已支持 RAD，直接使用上述新接口即可，不需要先选择模式。开发需要同时兼容新旧服务端的框架时，可以通过 `AiService.getAgentDiscoveryCapability()` 查询是否支持 RAD：

- `SUPPORTED`：支持，可以使用 RAD 接口。
- `NOT_SUPPORTED`：不支持，可以使用旧 A2A 接口。
- `UNKNOWN`：暂时无法判断，应检查连接或由应用配置指定，不能直接当作不支持。

查询可能访问服务端，连接或鉴权失败时可能抛出 `NacosException`，建议在初始化时调用，不要在每次业务请求中查询。

下面是框架可采用的选择示例。`Mode` 是示例自行定义的选项，并非 Nacos SDK 配置；它选择使用哪组接口，与 HTTP/gRPC 连接方式无关。

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

根据 `select` 的结果，选择 `subscribeAgent`（RAD）或 `subscribeAgentCard`（旧 A2A）中的一种，避免重复订阅。查询到支持 RAD 只说明接口可用，后续调用仍可能因权限不足或 Agent 不存在而失败，应按具体错误处理。

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

此请求只返回兼容当前 `latest` 的运行端点，并限制 `zone=local`。请保持第 2.4 节发布端示例运行，否则它注销后可能返回空端点集合。改用声明地址时去掉 `endpointSource` 和运行时 metadata 条件，或显式选择 `DECLARED`。

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
5. 退出发布端演示程序后确认运行端点已注销。声明地址随定义保留，不因运行端点注销而自动删除。
