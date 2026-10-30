---
title: Existing API Migration to MCP Manual
keywords: [MCP Server Register, MCP, Existing API, Migration to MCP]
description: Learn how to use Nacos to convert existing microservice APIs registered in Nacos into MCP services.
sidebar:
  order: 5
---

# Existing API Migration to MCP

Nacos can work with AI gateways such as [Higress](https://higress.ai) to convert existing APIs into MCP services with **zero code changes**. This guide explains how to declare APIs that are already registered in Nacos as MCP services, and how to call MCP tools through the protocol conversion capability of [Higress](https://higress.ai).

![API to MCP architecture](/img/doc/manual/user/ai/ai-api-to-mcp.svg)

## 0. Prerequisites

Prepare the following components before converting existing APIs into MCP services:

- **Deploy the Nacos engine**: Deploy Nacos `3.0.0` or later in your runtime environment. For details, see [Nacos Quick Start](../../../quickstart/quick-start.mdx), [Nacos Docker Quick Start](../../../quickstart/quick-start-docker.mdx), or [Nacos Kubernetes Quick Start](../../../quickstart/quick-start-kubernetes.mdx).
- **Deploy Higress AI**: Deploy Higress `2.1.2` or later in your runtime environment. For details, see [Higress Docker Quick Start](https://higress.cn/ai/mcp-quick-start_docker/?spm=36971b57.31888769.0.0.646150f85M2PAG) or [Higress Kubernetes Quick Start](https://higress.cn/ai/mcp-quick-start/?spm=36971b57.31888769.0.0.646150f85M2PAG).
- **Register existing APIs in Nacos**: Register existing APIs manually or automatically through [Nacos SDKs](../overview/other-language.md), [Spring Cloud](https://sca.aliyun.com/docs/2023/user-guide/nacos/quick-start/?spm=5176.29160081.0.0.74805c72y6j24s), or another integration framework.

## 1. Declare an Existing Service as an MCP Service

Open the Nacos console at `http://${nacos_console_host}:${nacos_console_port}`, for example `http://127.0.0.1:8080`.

> When you open the console for the first time, you may need to initialize the administrator password. For details, see the [Nacos Console Guide](../../admin/console.md#3-login-management).

In the left navigation, click `MCP Registry` -> `MCP List` to open the MCP Registry page.

Click `Create MCP Server` in the upper-left corner, and fill in the required information on the Create MCP Server page:

| Field | Description |
| --- | --- |
| MCP service name | MCP Server name, used to distinguish different MCP Servers. |
| Protocol type | Select `sse` or `streamable`. |
| HTTP to MCP service | Appears after you select `sse` or `streamable` as the protocol type. Select `http` or `https` according to the protocol used by the existing service. |
| Backend service | Appears after you select `sse` or `streamable` as the protocol type. Select `Use existing service`. |
| Service reference | Select the existing service that you want to convert. |
| Description | Description of the MCP service after the existing service is converted. |
| Service version | Version of the MCP service. Use a semantic-style version such as `1.0.0`. |

After completing the form, click `Publish` in the upper-right corner.

## 2. Declare Existing Service APIs as MCP Tools

Open the Nacos console at `http://${nacos_console_host}:${nacos_console_port}`, for example `http://127.0.0.1:8080`.

In the left navigation, click `MCP Registry` -> `MCP List` to open the MCP Registry page.

Find the MCP service created in [the previous step](#1-declare-an-existing-service-as-an-mcp-service), and click `Edit` in the `Actions` column.

On the `Edit MCP Server` page, change `Service Version` to a new version.

> For compatibility between different MCP Server versions, published versions can only update tool descriptions, parameter descriptions, and switches. Avoid adding, deleting, or changing parameter types for a published version because those changes can make the MCP service incompatible.

After changing the version, an `Add` button appears in the `Tools` section. Click `Add`, and fill in the required information on the Add MCP Tools page:

| Field | Description |
| --- | --- |
| Tool name | MCP Tool name, used to distinguish different MCP Tools. |
| Tool description | Description of the MCP Tool converted from the existing service API. |
| Enabled | Whether this Tool is enabled. It is enabled by default. |
| Tool input parameters | Describes the input parameter list for the MCP Tool. |

Click `Add Property` to add an input parameter.

> You can add input parameters only when the focus is on `Parameter List`. If the focus is on an existing parameter, the page is editing that parameter and `Add Property` cannot be clicked.

Then click an input parameter such as `NewArg1`, and edit its attributes in `Parameter Information`:

| Field | Description |
| --- | --- |
| Name | Input parameter name of the MCP Tool, used to distinguish different parameters. |
| Type | Input parameter type of the MCP Tool. Supported values include `string`, `number`, `integer`, `boolean`, `array`, and `object`. |
| Description | Input parameter description for the MCP Tool. |
| Protocol conversion configuration | Protocol conversion configuration for the AI gateway or protocol conversion proxy. It describes the existing service API that the Tool maps to, such as `url` and parameter mappings. For configuration details, see the [MCP Template Configuration Guide](./mcp-template.md). |

After all Tool input parameters are edited, click `OK` to save them. Add other Tools if needed, and then click `Publish as Latest Version` in the upper-right corner.

> The `Save` button in the upper-right corner only saves the content. It does not mark the version as latest or publish the latest version, so AI gateways or protocol conversion proxies may not read the updated Tool information. Use it to save drafts during editing or for gray release scenarios.

## 3. Configure Protocol Conversion to Expose the MCP Service

The previous steps declare the existing service and its APIs as an MCP service and MCP Tools. Nacos stores and distributes these declarations as the control plane. To access the service through the MCP protocol, you also need a data plane for protocol conversion. Higress AI Gateway already provides this capability.

For Higress AI Gateway deployment, see [Higress Docker Quick Start](https://higress.cn/ai/mcp-quick-start_docker/?spm=36971b57.31888769.0.0.646150f85M2PAG) or [Higress Kubernetes Quick Start](https://higress.cn/ai/mcp-quick-start/?spm=5176.29160081.0.0.74805c72y6j24s). This guide focuses on the configuration steps.

### 3.1. Enable MCP Protocol Conversion in Higress AI Gateway

Refer to [Higress ConfigMap global parameter configuration](https://higress.cn/ai/mcp-quick-start_docker/#configmap-%E5%85%A8%E5%B1%80%E5%8F%82%E6%95%B0%E9%85%8D%E7%BD%AE), set `data.higress.mcpServer.enable` to `true`, and make sure `data.higress.mcpServer.redis.address` is configured correctly.

> `data.higress.mcpServer.match_list` can keep the default value `[]`, which means Higress AI Gateway automatically manages session affinity.

Example:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  ...
data:
  higress: |-
    mcpServer:
      ...
      enable: true          # Enable MCP Server
      redis:
        address: ${IP}:6379 # Redis service address.
        ...
      match_list: []
      ...
```

### 3.2. Configure Nacos as the MCP Registry for Higress AI

Refer to [Higress Nacos MCP Registry configuration](https://higress.cn/ai/mcp-quick-start_docker/#configmap-%E5%85%A8%E5%B1%80%E5%8F%82%E6%95%B0%E9%85%8D%E7%BD%AE).

After configuring Nacos as the MCP Registry service source, you can view all existing services exposed through MCP in `Higress Console` -> `Service List`.

You can also connect to the MCP service with `curl http://${higress_ai_host}:${higress_ai_port}/mcp/${your_mcp_server_name}/sse`, view the session ID of the MCP connection, and receive heartbeat responses periodically.

For example, if the MCP service name is `restToMcp`:

```shell
curl localhost:8080/mcp/restToMcp/sse
event: endpoint
data: /mcp/restToMcp?sessionId=6b1fc62e-dbfa-40a9-9a5d-8a257e0b095c

event: message
data: {"jsonrpc":"2.0","id":"2025-06-16T03:33:04Z","method":"ping"}

event: message
data: {"jsonrpc":"2.0","id":"2025-06-16T03:33:09Z","method":"ping"}

```

At this point, you have converted an existing service API registered in Nacos into an MCP service. You can configure this MCP service in LLM Agent applications such as `DeepChat`, `Cline`, and `Cherry Studio`, or access and invoke it directly through [Nacos MCP Router](./nacos-mcp-router.md), [MCP Client](https://modelcontextprotocol.io/quickstart/client), or [Spring AI](https://java2ai.com/docs/1.0.0-M6.1/get-started/?spm=5176.29160081.0.0.6546aa5c63Vkgn).
