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

下面的最简完整示例订阅 `route-planner` 的 `1.0.0`。初始状态与后续变化都只在 listener 中更新本地视图；无需先 Discover 再用同步结果覆盖视图。按回车查看当前状态，然后取消订阅并关闭客户端。

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

示例显式选择 `http`，SDK 管理 HTTP Watch。`nacosAiTransportMode` 还支持 `grpc`、`auto`，默认 `grpc`。网络要求及配置见 [SDK 运行指南](../sdk/runtime-guide.md)。这里的 `current == null` 仅表示应用还未收到回调，不表示服务端确认目标不存在。

### 2.1. 初始状态与后续回调

两个 `subscribeAgent` 重载均返回 `void`。回调可能在方法返回前或后发生，因此应先准备 listener 依赖的状态。同 reference、filter 和同一个 listener 重复订阅是幂等的，不重复初始化；向已有 Watch 加入新 listener，仍会收到当前完整状态。取消时使用对应的 reference、filter 和同一个 listener 实例。

| 场景 | listener 收到什么 | 应用如何处理 |
| --- | --- | --- |
| 初始发现成功，或之后内容变化 | `SNAPSHOT`，包含完整 `AgentDiscoveryResult` | 完整替换本地快照，不按字段合并增量 |
| 合法、已授权的 Discover 确认 reference 找不到，例如 Agent、对应版本或标签不存在 | `UNAVAILABLE`，结果为空，附错误码和消息 | 撤销旧结果；订阅保留，目标恢复后继续收到快照 |
| 无端点、过滤后没有接口、或只有 unhealthy 端点 | 仍是合法 `SNAPSHOT` | 按应用策略判断是否有可调用地址，不等同于目标不存在 |
| 已接受订阅后的网络、服务端、鉴权、配额、迁移或后台执行异常 | 不产生数据事件 | SDK 保留订阅和最后确认状态，后台退避恢复；处理实际故障，无需反复 subscribe |

首次调用仍可能因参数校验、初始 Discover 或同步准入失败抛出 `NacosException`。这表示本次新增订阅未被接受，应解决原因后重新调用；与**已经接受后的后台恢复**不同。HTTP 原始 404 或 Watch 拒绝本身也不等于 `UNAVAILABLE`。

SDK 通过指纹补查和统一交付处理初始化窗口：例如 Discover 读到 A、Watch 建立前已变成 B，SDK 会补查最新状态，不会先回调 B 再补发旧初始化 A。一般应用无需手工补查或处理初始化覆盖竞态。这是最新完整状态的最终一致性，不承诺跨节点线性一致，也不承诺每个中间版本必达；HTTP/gRPC wire 接口没有因此改变。

### 2.2. 慢回调、异常与 HTTP 限额

同一个 listener 的 callback 串行执行。SDK 只保留最新待交付状态，不积压所有历史变化；中间快照和短暂的 `UNAVAILABLE` 可以合并。执行能力恢复后交付最新完整状态，不保证逐事件交付或 exactly-once。

Executor 拒绝任务或 `getExecutor()` 抛异常时，SDK 保留最新状态供本地重试，无需等待新的服务端变化。`onEvent` 已经开始后自行抛异常，只记录错误，不自动重放该次回调，以免重复业务副作用。取消或关闭会丢弃尚未执行的通知。

回调中的阻塞 I/O 不阻塞传输、轮询或 Discover 链路，但共享回调池都被阻塞时，其他 listener 可能延迟。建议快速更新本地状态，为业务 I/O 设置超时，处理自身异常；需要时通过 listener 的 `getExecutor()` 提供容量合适的执行器，并在应用退出时关闭自建执行器。

HTTP Watch 首次远端准入是异步的，`subscribeAgent` 返回不表示服务器已经确认全部 Watch。新增集合触发配额时，SDK 保留已接受的新增项，优先观察此前成功的集合并限速重试；已知耗尽期间继续增加新 Watch，可能同步报错。向已有 Watch 增加 listener 不算远端增长。关注客户端日志、处理配额原因并取消不需要的订阅即可，SDK 会继续恢复；应用无需维护成功集合或重新批量订阅。

Watch 使用 gRPC 通知或 HTTP batch long polling；所配置的 Watch 通道不可用、或绑定失败允许回退时，SDK 可以使用内部 Discover polling 兜底，仍要求服务端支持 RAD Discover。Polling 不是应用必须选择的第三个协议。一个 Watch 在稳定状态下不会同时长期使用 gRPC 推送和周期 Discover 轮询；切换时可能有短暂重叠。应用无需直接管理 Transport。

### 2.3. 单次发现与显式 A2A 转换

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

输出是 Nacos 的 `com.alibaba.nacos.api.ai.model.a2a.AgentCard`，不是外部 `io.a2a.spec` 类型。`AgentService.a2aConverter()` 与独立工厂 `AgentConverters.a2a()` 等价。转换纯本地、无状态且可复用，每次返回独立对象；不发网络请求、不选节点、不做负载均衡。Discover 和 Watch 都不会自动调用 Converter。

如果消费订阅结果，将最简示例的 listener 替换为下面的处理方式；只安装这一条订阅。示例选择在转换失败时清空应用保存的 Card，实际业务可自行决定失败处理策略。

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

Converter 按发现结果顺序取 A2A 接口的第一个非空 `EndpointSet`。该顺序已体现 `RUNTIME` / `DECLARED` 优先配置与本次过滤条件；只使用一组，不合并来源，也不从 descriptor 恢复已过滤的地址。选中组的顺序和 unhealthy 地址均保留。第一项决定 `supportedInterfaces` 首选项及旧 `url`、`preferredTransport`、`protocolVersion` 兼容字段，不按 descriptor 旧 `preferredTransport` 重选。应用仍需自行判断地址健康和业务可达性。

没有可转换的 A2A 接口或地址、descriptor 不合法、名称或版本身份不一致，均抛出 `IllegalArgumentException`，message 区分具体原因。Converter 不返回 null 或空 Card，转换失败也不会变成 `UNAVAILABLE` 或取消订阅。上述规则仅适用于公共 Converter，不能用于推断旧 A2A facade 的历史投影与回退行为。

### 2.4. 运行端点完整覆盖注册

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

`registerAgentEndpoints` 替换本客户端在同 Agent、同 protocol 下的**完整 Batch**，版本不构成独立 Batch。不覆盖其他客户端或其他 protocol 的贡献：

| 当前集合 | 目标集合 | 本次应提交 |
| --- | --- | --- |
| A、B | B、C | B、C |
| A | 保留 A 并新增 B | A、B |
| A | 用 B 替换 A | B；无需在注册 B 后再注销 A |

- `runtimeVersion` 表示实际运行版本，`versionRange` 表示可服务的定义版本范围。`[1.0.0]` 只兼容一个版本；只有实际兼容时才声明如 `[1.0.0,2.0.0)` 的范围，且须包含运行版本。
- 同协议下，端点按 URI 的主机、有效端口和 `transport` 区分；仅 path 或 query 不同，不能作为同一发布者的两个独立端点。
- 可以在定义发布前注册端点；普通发现仍要求 Agent 启用、目标版本上线、协议匹配且版本范围兼容。
- `deregisterAgentEndpoints` 按地址标识移除本客户端贡献，由 SDK 提交剩余完整集合，空集合时注销整份贡献。它与旧 A2A 的整版本注销不同，见 [Java SDK 使用手册](../java-sdk/usage.md#74-注销agent的endpoint)。
- 取消订阅不会注销端点，下线定义也不会停止应用实例。

### 2.5. 按配置与能力选择消费方式

框架需要兼容 A2A 与 RAD 时，可通过 `AiService.getAgentDiscoveryCapability()` 查询当前有效 Agent 传输的能力：`SUPPORTED` 表示支持，`NOT_SUPPORTED` 表示有可靠的不支持证据，`UNKNOWN` 表示证据不足。连接、超时、鉴权或探测失败可能抛 `NacosException`，不能归为 `NOT_SUPPORTED`。冷查询可能执行有界网络探测，并非纯本地、零耗时操作；多个地址的探测时间可能累加。

以下示例优先采用应用显式配置，仅在 AUTO 时查询能力。这里的 Mode 是框架自己的消费策略，与 `nacosAiTransportMode` 的 HTTP/gRPC 传输选择不同。

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

框架调用一次 `select`，根据结果只安装 `subscribeAgent`（RAD）或 `subscribeAgentCard`（A2A）中的一条订阅；不要通过业务异常试探协议，也不要为同一消费视图重复订阅两套接口。`UNKNOWN` 时可等待证据或要求显式配置，不等同于不支持。

`SUPPORTED` 只表示协议能力，不保证权限、资源存在、迁移就绪或业务成功。例如业务调用仍可能遇到 `AGENT_MIGRATION_IN_PROGRESS`，应处理迁移准入原因，不据此回退旧协议。显式选择 A2A 表示使用 Card facade，并不强制旧 wire。

能力查询不会固定或切换旧 A2A facade 的实例路由。实例一旦选择旧 A2A 路径，即使服务端升级也不会在存活期间自动改走 RAD；重新创建客户端后才按当前能力选择。能力返回值也不是该 facade 当前路由的查询结果。

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
