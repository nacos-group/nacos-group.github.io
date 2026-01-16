---
title: "AgentScope 支持 A2A + Nacos 驱动异构智能体互通"
description: "AgentScope 支持 A2A + Nacos 驱动异构智能体互通"
date: "2026-01-16"
category: "article"
keywords: ["Nacos"]
authors: "CH3CHO"
---

作者：恰橙 席翁 濯光

> AgentScope 基于 A2A 协议与 Nacos Agent Registry，实现智能体的统一发现、治理与跨生态协作。
>

随着企业逐步落地 AI 应用架构，从原来测试 POC workflow/简单 Agent 开始逐步构建生产级可用 Agent，真正解决线上问题，构建 Agent 在企业是面相全员提升效率的路径，不再是简单业务流程面临问题更加复杂，可能企业就会遇到如下挑战：

+ **语言栈多样化：** **企业内核心业务团队可能是 Java/Golang，算法团队使用 Python，面临 Agent 架构选型多语言栈怎么做无缝协作？**
+ **Agent 框架割裂：** **LangChain、AutoGPT、AgentScope 等不同框架以及 Agent 各自为政，如何实现跨框架调用？**
+ **多团队Agent协同：** **Agent 如果有一个团队做，不懂业务做不深，Agent 分布在不同的服务、团队、项目中，内部选型会有 Dify、n8n 低代码和高代码平台选型，如何统一发现和管理？**
+ **协议不统一：** **REST、gRPC、自定义协议...每个 Agent 都有自己的接口规范，集成成本高、维护困难。**

<!-- 这是一张图片，ocr 内容为： -->
![](https://img.alicdn.com/imgextra/i1/O1CN01Pqe7HK1YngVS1wb1w_!!6000000003104-2-tps-3385-1267.png)

**A2A（Agent-to-Agent）协议正是为解决这些问题而生。** 它是 Google 提出一套面向分布式多 Agent 互联互通的开放标准，定义了统一的消息结构和能力描述，让不同语言、不同框架、不同运行时上的 Agent 都能被发现、被调用、被编排。基于 A2A，Agent 之间可以在不共享代码、不耦合底层实现的前提下，完成文本对话、thinking、多模态内容、工具调用等丰富交互，真正实现“一次定义，处处可用”。

<!-- 这是一张图片，ocr 内容为： -->
![](https://img.alicdn.com/imgextra/i4/O1CN01E30mMa1r17Ck5nHWj_!!6000000005570-2-tps-3523-1387.png)

# Agent 跨语言、跨框架调用最佳实践

**AgentScope** 是阿里巴巴推出的一款以开发者为核心，专注于 **多智能体开发的开源框架。** 它的核心目标是解决智能体在构建、运行和管理中的难题，提供一套覆盖“开发、部署、监控”全生命周期的生产级解决方案。

在 **AgentScope** 最新版本中，我们**全面支持 A2A 协议，并集成 Nacos 作为 A2A Registry 的默认实现**，构建了一套从开发到部署的完整分布式多智能体协作体系，让智能体协作从“单打独斗”走向“开放互联”。

<!-- 这是一张图片，ocr 内容为： -->
![](https://img.alicdn.com/imgextra/i1/O1CN01l2m8ec1s7MDVmx7Dk_!!6000000005719-2-tps-1945-838.png)

+ **告别“Agent 孤岛”：** **通过 A2A 协议，AgentScope 的 Agent 可以与任何实现 A2A 的 Agent 无缝互操作，不论由谁开发、用何种技术栈构建，都能在统一的协作框架下高效协同，打破技术壁垒，共同构建跨语言、跨框架的开放生态。**
+ **统一开发体验，告别适配烦恼：** **在 AgentScope 中，调用本地 Agent 和调用远端 A2A Agent 使用同一套 API。框架自动处理协议转换、错误重试和路由选择，我们可以专注业务，不必为适配不同 Agent 编写冗余代码，从而提升效率与可维护性。**
+ **生产级治理，开箱即用：** **基于 Nacos 3.0 智能体注册中心，AgentScope 应用具备服务发现、健康检查、命名空间隔离等成熟能力。选择 Nacos 作为默认 A2A Registry，不仅因为它经过大规模生产验证，也因为它与企业现有运维体系兼容，让智能体治理无需重复造轮子，加速规模化落地。**

# 在 AgentScope 中使用 A2A
**1. AgentScope：连接外部 A2A 网络，像调用本地 Agent 一样简单**

AgentScope 提供统一的 A2A 对接能力，我们可以像调用本地工具一样自然地调用远端 A2A Agent，实现跨语言、跨框架的协同，告别繁琐的协议适配工作：

+ **双向消息转换：** **实现框架内部消息格式与 A2A** Message 的双向转换，支持文本、thinking、多模态、工具调用等 Block 类型，保留必要元信息，确保语义一致。
+ **统一交互范式：** **支持直接调用和** observe() 两种方式。直接调用 agent(msg) 可立即拿到结果；observe() 先累积上下文，后续再连同当前输入一起发送，适合长会话、多轮协作场景。
+ **任务与中断管理：** 内建长任务状态管理与 Artifact 处理机制，支持长时间任务的平滑中断，覆盖超时与取消场景。
+ **统一的服务发现能力：** 通过AgentCardResolver 扩展点标准化“发现”能力，任何实现该接口的组件，例如：FixedAgentCardResolver、FileAgentCardResolver、WellKnownAgentCardResolver、NacosAgentCardResolver 等都可按需加载，轻松适配不同基础设施。

<!-- 这是一张图片，ocr 内容为： -->
![](https://img.alicdn.com/imgextra/i2/O1CN01UiPKZs1mLCUkFOHTI_!!6000000004937-2-tps-2422-1318.png)

通过 A2AAgent 以及 AgentCardResolver，我们可以按名称、分组或标签从 A2A Registry 中发现并调用其他 Agent，实现跨团队、跨项目甚至跨语言的智能体复用。基于 A2A Registry，智能体拥有统一的服务发现与治理能力，可与现有配置中心、网关、熔断限流及安全体系协同，为大规模分布式智能体应用打好底座。

以下示例展示如何使用 NacosAgentCardResolver 从 Nacos Registry 中发现并调用 Agent：

_注意在对应版本以上使用 demo，__**Python**__ __（AgentScope __**v1.0.11**__、AgentScope Runtime __**v1.0.4**__）和 __ __**Java**__ （AgentScope __**v1.0.6**__，AgentScope Runtime __**v1.0.0**__）_

**Python 代码示例**

_**查看详细文档：**__**https://doc.agentscope.io/zh_CN/tutorial/task_a2a.html**_

```shell
from agentscope.agent import A2AAgent
from agentscope.a2a import NacosAgentCardResolver
from agentscope.message import Msg
# Python AgentScope v1.0.11以上
# 创建 Nacos AgentCard Resolver
nacos_resolver = NacosAgentCardResolver(
    remote_agent_name="my-remote-agent",  # Nacos 中注册的智能体名称
    nacos_client_config=ClientConfig(
        server_addresses="http://localhost:8848",  # Nacos 服务器地址
        # 其他可选配置项
    ),
)
# 使用 Resolver 创建 A2AAgent，通过名称从 Nacos 发现 Agent
agent = A2AAgent(
    agent_card=await nacos_resolver.get_agent_card()
)
```

**Java 代码示例**

_**查看详细文档：**__**https://java.agentscope.io/zh/task/a2a.html**_

使用 NacosAgentCardResolver 从 Nacos Registry 中发现 Agent：

```shell
import io.agentscope.agent.A2AAgent;
import io.agentscope.extensions.a2a.nacos.NacosAgentCardResolver;
import java.util.Properties;
import com.alibaba.nacos.api.PropertyKeyConst;
import com.alibaba.nacos.api.ai.AiFactory;
import com.alibaba.nacos.api.ai.AiService;
Properties properties = new Properties();
properties.put(PropertyKeyConst.SERVER_ADDR, "localhost:8848");
// 其他可选配置项
AiService aiService = AiFactory.createAiService(properties);
NacosAgentCardResolver agentCardResolver = new NacosAgentCardResolver(aiService);
A2AAgent agent = A2AAgent.builder()
        .name("MyAgent")
        .agentCardResolver(agentCardResolver)
        .build();
```

Nacos 3.0 作为智能体注册中心，其在生产环境中久经验证的服务发现与配置管理能力，能够助力企业构建统一的智能体服务治理平台。

**2. AgentScope Runtime：暴露 A2A Agent 服务，启动即注册**

AgentScope Runtime 提供统一的 A2A 服务暴露能力，帮助我们把本地 Agent 应用包装成符合 A2A 规范的服务端点。通过 A2A 协议适配器，应用在启动时会自动完成：

+ **结构化配置体系：** 通过 A2A 扩展配置 **a2a_config 灵活定义 AgentCard（name、description、version、skills、default_input_modes/default_output_modes 等）、传输层配置（host、port、path 等）、Registry 参数和任务超时等。
+ **自动服务包装：** 启动时由 A2A 协议适配器将 Agent 应用封装成符合 A2A 规范的服务端点，自动处理协议转换、消息路由等底层细节。
+ **生产级部署支持：** 与主流框架无缝集成，Python 侧支持 **AgentApp 配置体系，Java 侧支持 Spring Boot Starter，让智能体服务自然融入现有基础设施。
+ **自动服务注册与治理：** 通过 A2ARegistry 抽象接口，Python 与 Java 都能开箱即用地集成 Nacos Agent Registry。Agent 能力描述（AgentCard）和网络端点会自动注册到 Registry，让其他 Agent 可发现、可调用。

<!-- 这是一张图片，ocr 内容为： -->
![](https://img.alicdn.com/imgextra/i1/O1CN01cbCMYc1jIxiBm91dj_!!6000000004526-2-tps-2422-1318.png)

以下示例展示如何在 Runtime 层使用 Nacos Registry 进行服务注册：

**Python 代码示例**

_**查看详细文档：**__**https://runtime.agentscope.io/zh/a2a_registry.html**_

**方式一：参数配置**

在构造 AgentApp 时，通过 A2A 配置扩展字段 a2a_config 参数的 registry 字段指定 Registry 实例或列表：

```shell
from agentscope_runtime.engine.app import AgentApp
from agentscope_runtime.engine.deployers.adapter.a2a import (
    AgentCardWithRuntimeConfig,
)
from agentscope_runtime.engine.deployers.adapter.a2a.nacos_a2a_registry import (
    NacosRegistry,
)
from v2.nacos import ClientConfigBuilder
# 创建 Nacos Registry 实例
registry = NacosRegistry(
    nacos_client_config=ClientConfigBuilder()
        .server_address("nacos-server:8848")
        # 其他可选配置项
        .build()
)
app = AgentApp(
    app_name="TestAgent",
    app_description="TestAgent",
    # 在 a2a_config 中配置 registry
    a2a_config=AgentCardWithRuntimeConfig(registry=registry),
)
```

**方式二：使用环境变量配置**

环境变量可以通过 .env 文件或系统环境变量设置：

```shell
# .env 文件示例
A2A_REGISTRY_ENABLED=true
A2A_REGISTRY_TYPE=nacos
NACOS_SERVER_ADDR=localhost:8848
# 其他可选配置项
```

**Java 代码示例**

_**查看详细文档：**__**https://java.agentscope.io/zh/task/a2a.html**_

在最新版本的 Java AgentScope 中，应用可以直接暴露 A2A 服务，只有在需要使用 Sandbox 时，才需要使用 Runtime。

对于非最新版本，Java 开发者可以将 AgentScope Agent 无缝融入现有的 Spring Boot 基础设施体系。通过引入 spring-boot-starter-agentscope-runtime-a2a-nacos 依赖，应用在启动时会自动暴露 A2A 服务并注册到 Nacos Registry。

**Maven 依赖配置** **：**

```shell
<dependency>
    <groupId>io.agentscope</groupId>
    <artifactId>spring-boot-starter-agentscope-runtime-a2a-nacos</artifactId>
    <version>1.0.3</version>
</dependency>
```

**application.yaml 配置**：

```shell
agentscope:
  a2a:
    server:
      card:
        description: "基于 A2A 协议的 Java 智能体"
        provider:
          organization: 您的组织名称
          url: https://your-organization.com
      nacos:
        server-addr: ${NACOS_SERVER_ADDRESS:127.0.0.1:8848}
        # 其他可选配置项
```

通过上述配置，Spring Boot 应用在启动时会自动：

+ 暴露符合 A2A 规范的 JSONRPC 服务端点（默认路径：/a2a/jsonrpc）。
+ 暴露 AgentCard 的 Well-Known 端点（默认路径：/.well-known/agent-card.json），用于其他 Agent 发现和了解当前 Agent 的能力。
+ 自动处理 A2A 协议的消息转换和路由，将 A2A 消息格式转换为应用内部的消息处理逻辑。
+ 支持任务超时、中断等 A2A 协议规定的运行时特性。
+ 将 Agent 的能力描述（AgentCard）注册到 Nacos，基于 Nacos 3.0 智能体注册中心进行统一治理。

得益于这一机制，AgentScope 应用启动即完成在 Nacos 的 A2A Agent 注册，为后续的发现、路由、灰度与监控奠定基础。对于已经大规模采用 Java 技术栈的团队，这意味着智能体服务能自然长在同一套基础设施上，大幅降低引入成本与运维负担。

# 总结
**AgentScope 全面支持 A2A 协议和 Nacos Agent Registry**，标志着智能体从“单点能力”迈向“开放互联生态”的关键一步，为企业构建统一的智能体管理平台，助力大规模 Agent 化落地：

+ **AgentScope 层：** 借助 A2AAgent 与 AgentCardResolver，我们提供统一的 A2A 对接能力和灵活的发现策略，默认集成 Nacos，支持动态 Agent 发现与调用。
+ **AgentScope Runtime 层：** 通过 A2A 协议适配器和 **A2ARegistry 抽象接口，提供统一的 A2A 服务暴露能力，支持自动服务注册与治理，与 Python AgentApp 和 Java Spring Boot Starter 无缝集成。

未来，我们会继续围绕 A2A 与 Registry 深耕，在发现与路由、版本与灰度、安全与访问控制等方向迭代，让面向生产的智能体应用更稳、更易用。



**扩展链接：**

AgentScope：https://doc.agentscope.io/

AgentScope Python A2A 文档：https://doc.agentscope.io/tutorial/task_a2a.html

AgentScope Java：https://java.agentscope.io/

AgentScope Java A2A 文档：https://java.agentscope.io/en/task/a2a.html

Nacos：https://nacos.io/docs/latest/manual/user/ai/agent-registry

欢迎扫描下方二维码加入<font style="color:rgb(24, 28, 31);">Nacos AI Registry 社区讨论群</font><font style="color:rgb(24, 28, 31);">，群号： 115205016856</font>

![](https://img.alicdn.com/imgextra/i1/O1CN01jxEvNS1hkK8rUfZV5_!!6000000004315-0-tps-1131-1280.jpg)

