---
title: "Dify 官方上架 Nacos A2A 插件，补全双向多智能体协作能力"
description: "Dify 官方上架 Nacos A2A 插件，补全双向多智能体协作能力"
date: "2026-01-27"
category: "article"
keywords: ["Nacos"]
authors: "CH3CHO"
---

作者：濯光

## 一、背景与挑战：多智能体协作中的典型问题
随着 AI Agent 技术的快速发展，单一智能体已经难以满足复杂业务场景的需求。多智能体协作（Multi-Agent Collaboration）正在成为 AI 应用的新趋势——让多个具备不同专长的智能体协同工作，共同完成复杂任务。

Google 于 2025 年初发布的 A2A（Agent-to-Agent）协议，为多智能体间的标准化通信提供了重要基础。A2A 协议定义了智能体之间的发现、能力描述和任务交互标准，使得不同来源、不同框架的智能体能够无缝协作。

![](https://img.alicdn.com/imgextra/i2/O1CN01hcD5Kz1PiLLbYhIB0_!!6000000001874-0-tps-2752-1536.jpg)

然而，**Dify 平台目前原生并不支持 A2A 协议**。这意味着开发者无法直接在 Dify 中发现和调用遵循 A2A 标准的智能体，缺乏与 A2A 生态进行集成的有效途径。具体来说，Dify 开发者面临以下挑战：

+ **协议不兼容**：Dify 原生不支持 A2A 协议，无法直接解析 AgentCard、处理 A2A 消息格式，与已有的 A2A Agent 生态完全隔离。
+ **智能体发现困难**：多个 A2A Agent 分散部署在不同环境中，没有标准方式让 Dify 应用发现和管理这些智能体，每次接入都需要大量定制开发。
+ **动态选择受限**：传统方式下，Dify 应用只能调用预先硬编码的单一智能体，无法根据实际任务需求动态选择最合适的智能体。
+ **协作编排复杂**：当业务需要多个智能体协作时，开发者需要在工作流中进行大量的条件判断和路由逻辑，开发和维护成本高。
+ **缺乏统一注册中心**：没有集中管理 A2A Agent 的平台，难以对智能体进行统一的注册、发现和治理。

这些问题导致 Dify 开发者在构建多智能体应用时，面临**协议不通、接入成本高、扩展性差、灵活度低**的困境。

## 二、解决方案：Nacos Agent Registry + A2A Discovery 插件
为了解决上述问题，**A2A Discovery 插件应运而生**。它是 Nacos 官方为 Dify 平台打造的 A2A 协议集成方案，**填补了 Dify 在 A2A 协议支持上的空白**，让 Dify 应用能够无缝接入 A2A 智能体生态。

Nacos 3.x 在支持 MCP Registry 的基础上，进一步拓展了对 A2A Agent 的支持能力，推出了 **Nacos Agent Registry**——一个统一的 AI 智能体注册与发现平台。结合 A2A Discovery 插件，Dify 开发者可以：

+ **打通 A2A 协议**：插件内置完整的 A2A 协议支持，自动解析 AgentCard、处理标准消息格式，让 Dify 与 A2A 生态无缝对接。
+ **统一智能体发现**：自动从 Nacos Agent Registry 发现所有已注册的 A2A Agent，无需手动配置每个智能体的连接信息。
+ **动态智能体选择**：LLM 可以根据任务需求，从多个可用智能体中智能选择最合适的一个进行调用。
+ **灵活的发现模式**：支持 Nacos 模式和 URL 模式两种发现方式，满足不同部署场景的需求。

目前，Nacos 官方 A2A Discovery 插件 [A2A Agent Client](https://marketplace.dify.ai/plugins/nacos/a2a_discovery?language=zh-Hans) 已正式上架 Dify 官方插件市场。

### 整体架构
![](https://img.alicdn.com/imgextra/i2/O1CN01UFEEta1dGm811TaiL_!!6000000003709-2-tps-2752-1536.png)

## 三、插件核心功能详解
### 3.1 两种智能体发现模式
目前 A2A Discovery 插件支持两种 A2A Agent 发现模式：

**Nacos 模式（推荐）**

通过 Nacos Agent Registry 统一管理和发现智能体。只需在 Nacos 中注册 A2A Agent，Dify 应用即可自动发现并调用。

通过接入 Nacos Agent Registry, 用户可以享受到以下优势：

+ 集中化管理，智能体信息统一维护
+ 支持动态注册和注销，无需重启 Dify 应用
+ 与 Nacos 生态无缝集成，享受企业级治理能力

Dify 插件配置示例：

```plain
discovery_type: nacos
available_agent_names: translator_agent,search_agent,code_agent
namespace_id: public
```

**URL 模式**

除了通过 Nacos Agent Registry 进行接入，用户也可以直接通过 A2A Agent 的标准 URL 进行发现，适合无需 Nacos 的轻量级场景。

Dify 插件配置示例：

```plain
discovery_type: url
available_agent_urls: {
  "translator_agent": "http://host1:8080/.well-known/agent.json",
  "search_agent": "http://host2:8080/.well-known/agent.json"
}
```

### 3.2 两个核心工具
A2A Discovery 插件为了实现 A2A 协议，提供了以下两个工具：

**获取智能体信息（get_a2a_agent_information）**

查询所有配置的 A2A Agent 的详细信息，包括：

+ 智能体名称（agent_name）
+ 功能描述（description）
+ 技能列表（skills）

LLM 可以通过调用该工具获取以上信息，并通过这些信息了解每个智能体的能力，为后续的智能选择提供依据。

**调用智能体（call_a2a_agent）**

根据 LLM 的选择，向指定的 A2A Agent 发送查询消息并获取响应。支持：

+ 动态选择目标智能体
+ 自定义查询消息
+ 完整的上下文传递

### 3.3 智能体动态选择工作流
![](https://img.alicdn.com/imgextra/i4/O1CN01MDOWxA246h2FPUWP7_!!6000000007342-2-tps-324-899.png)

通过以上两种工具协同配合，Dify 中的 Agent 可以实现：

1. 全面了解可用的智能体资源
2. 根据具体任务智能匹配最佳智能体
3. 实现真正的多智能体动态协作

## 四、实践教程：构建多智能体协作应用
让我们通过一个具体案例，演示如何使用 A2A Discovery 插件构建一个多智能体协作的 AI 助手。

![](https://img.alicdn.com/imgextra/i3/O1CN018K9mQu1wD5dmqpSKD_!!6000000006273-0-tps-2752-1536.jpg)

### 场景描述
假设我们要构建一个智能客服系统，需要调用以下三个专业智能体：

+ **翻译智能体**：处理多语言翻译需求
+ **搜索智能体**：查询产品信息和知识库
+ **客服智能体**：处理订单查询和售后问题

### 步骤一：在 Nacos 注册 A2A Agent
将 A2A Agent 注册到 Nacos Agent Registry 有两种方式：

**方式一：控制台手动注册**

1. 登录 Nacos 控制台
2. 进入「Agent Registry」
3. 添加各个 A2A Agent 的信息（名称、访问地址、描述等）

**方式二：AgentScope 自动注册（推荐）**

Nacos Agent Registry 已与 [AgentScope](https://github.com/modelscope/agentscope) 实现生态集成。使用 AgentScope 构建的 A2A Agent 可以自动注册到 Nacos，无需手动配置。具体集成方式请参考 [AgentScope 官方文档](https://agentscope.io/) , 支持 Java 和 Python 两种语言自动注册。

请确保 Agent 以正确的 A2A 协议进行暴露，并且从 Dify 到 Agent 网络可达

### 步骤二：安装配置 A2A Discovery 插件
1. 在 Dify 插件市场搜索「A2A Agent Client」或直接访问[插件页面](https://marketplace.dify.ai/plugins/nacos/a2a_discovery?language=zh-Hans)
2. 点击安装插件
3. 配置 Nacos 连接信息：

| 参数 | 说明 |
| --- | --- |
| Nacos 智能体注册中心地址 | 如：`mse-xxx.nacos.mse.aliyuncs.com:8848` |
| Nacos 用户名 | Nacos 认证用户名（可选） |
| Nacos 密码 | Nacos 认证密码（可选） |
| 阿里云 AccessKey | MSE Nacos 专用（可选） |
| 阿里云 SecretKey | MSE Nacos 专用（可选） |


### 步骤三：创建 Dify Agent 应用
1. 在 Dify 中创建一个新的 Agent 应用
2. 添加 A2A Discovery 插件的两个工具：
    - `get_a2a_agent_information`
    - `call_a2a_agent`
3. 配置工具参数：

```plain
discovery_type: nacos
available_agent_names: translator_agent,search_agent,customer_service_agent
namespace_id: public
```

4. 设置系统提示词：

```plain
你是一个智能客服助手，可以调用多个专业智能体来处理用户请求。

工作流程：
1. 首先调用 get_a2a_agent_information 获取所有可用智能体的信息
2. 根据用户的问题类型，选择最合适的智能体
3. 调用 call_a2a_agent 向选中的智能体发送请求
4. 整合响应结果，为用户提供完整的答案

可用的智能体包括翻译、搜索、客服等，请根据任务特点智能选择。
```

### 步骤四：测试验证
部署应用后，尝试以下对话：

**用户**: 请帮我把"How to return the product?"翻译成中文

**AI 助手**（内部流程）:

1. 调用 `get_a2a_agent_information` 获取智能体列表
2. 识别这是翻译任务，选择 `translator_agent`
3. 调用 `call_a2a_agent` 发送翻译请求
4. 返回翻译结果

**用户**: 我想查询订单 #12345 的物流状态

**AI 助手**（内部流程）:

1. 识别这是客服问题，选择 `customer_service_agent`
2. 调用智能体获取订单信息
3. 返回物流状态

## 五、Nacos Agent Registry 企业级能力
![](https://img.alicdn.com/imgextra/i1/O1CN01hvKiAi1eo2Vftkwxi_!!6000000003917-0-tps-2752-1536.jpg)

结合 Nacos 3.x 版本 的 Agent Registry 能力，用户集成 A2A Discovery 插件可以享受到完整的企业级治理特性：

**统一注册发现**

所有 A2A Agent 集中注册到 Nacos，开发者无需关心智能体的具体部署位置。新增智能体时只需注册到 Nacos，Dify 应用即可自动发现并调用，支持动态上下线。

**多租户隔离**

基于 Nacos 的 命名空间隔离机制，可以将不同环境（开发、测试、生产）或不同业务线的智能体完全隔离，互不影响，满足企业级多租户场景。

**健康检查**

Nacos 自动监控各智能体的运行状态，当某个 Agent 不可用时自动从服务列表中摘除，避免调用失败，恢复后自动重新上线。

**元信息管理**

支持在运行时动态更新智能体的描述、技能列表等元信息，无需重启服务。这对于智能体能力迭代升级非常友好。

**访问控制**

通过 Nacos 的认证鉴权机制，可以精细控制哪些应用可以访问哪些智能体，保障企业级应用的安全性。

**生态集成**

Nacos Agent Registry 不仅支持 A2A 协议，还与 AI 网关、MCP Router、AgentScope 等组件无缝对接，构建完整的智能体治理生态。

| 能力 | 说明 |
| --- | --- |
| **统一注册发现** | 所有 A2A Agent 集中注册，支持自动发现和动态更新 |
| **多租户隔离** | 基于 Namespace 实现智能体的环境隔离 |
| **健康检查** | 自动检测智能体可用性，故障自动摘除 |
| **元信息管理** | 运行时更新智能体描述、技能等信息，无需重启 |
| **访问控制** | 访问 Nacos 支持认证鉴权，保障智能体调用安全 |
| **生态集成** | 与 AgentScope 等框架无缝对接 |


## 六、总结与展望
![](https://img.alicdn.com/imgextra/i1/O1CN018vDcjc1egiAmpf51D_!!6000000003901-0-tps-2752-1536.jpg)

**A2A Discovery 插件填补了 Dify 平台在 A2A 协议支持上的空白**，为 Dify 开发者带来了真正的多智能体协作能力：

+ **协议打通**：让 Dify 原生不支持的 A2A 协议得以无缝集成
+ **简化接入**：通过 Nacos Agent Registry，用户一次配置即可发现所有智能体
+ **智能选择**：LLM 可以根据实时任务需求动态选择最合适的智能体
+ **标准协议**：完全遵循 Google A2A 协议，与各类实现无缝兼容
+ **企业级治理**：依托 Nacos 平台，享受完整的 Agent 管理能力

随着 AI 多智能体技术的持续演进，Nacos 将继续深耕 AI Agent 生态，从 MCP Server 管理到 A2A Agent 协作，与 AgentScope 等主流智能体框架深度集成，为开发者提供更加完善的智能体治理平台。未来，我们还将支持更多的智能体协议和更丰富的治理能力，助力开发者构建更加强大的 AI 应用。

## 相关链接
+ [A2A Discovery 插件（Dify 市场）](https://marketplace.dify.ai/plugins/nacos/a2a_discovery?language=zh-Hans)
+ [Nacos 官网](https://nacos.io/)
+ [Nacos GitHub 仓库](https://github.com/alibaba/nacos)
+ [Google A2A 协议](https://github.com/google/A2A)
+ [Dify 官网](https://dify.ai/)
+ [Nacos MCP 插件](https://marketplace.dify.ai/plugins/nacos/nacos_mcp?language=zh-Hans)
+ [AgentScope 官方仓库](https://github.com/modelscope/agentscope)


