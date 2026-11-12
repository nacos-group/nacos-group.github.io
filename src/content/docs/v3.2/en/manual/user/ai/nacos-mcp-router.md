---
title: Nacos MCP Router
keywords: [Nacos MCP Router, MCP, User Guide]
description: Nacos MCP Router user guide.
sidebar:
    order: 6
---

Nacos MCP Router is a standard MCP Server built on the official MCP SDK. It provides MCP Clients with MCP Server `intelligent search`, `installation`, and `proxy` capabilities, which **greatly simplifies** MCP service usage. When used together with Nacos MCP Registry, Nacos MCP Router can also support MCP Server governance, such as MCP Server and tool visibility and version management.

![MCP Router architecture](/img/doc/overview/ai-mcp-router-struncture.svg)

## Features

Nacos MCP Router has two working modes:

1. Router mode: The default mode. It recommends, installs, and proxies other MCP Servers to help users consume MCP Server services more easily.
2. Proxy mode: Enabled by setting the `MODE=proxy` environment variable. With simple configuration, it can convert MCP Servers that use `sse` or `stdio` into `streamableHTTP` MCP Servers.

In router mode, Nacos MCP Router works as a standard MCP Server. It recommends, distributes, installs, and proxies other MCP Servers. The main tools are:

1. `search_mcp_server`
   - Searches the MCP Registry (Nacos) for related MCP Servers by task description and keywords.
   - Input:
     - `task_description` (string): Task description, for example: "What is the weather in Hangzhou today?"
     - `key_words` (string): Task keywords, for example: "weather, Hangzhou"
   - Output: List of MCP servers and instructions to complete the task.
2. `add_mcp_server`
   - Adds and initializes an MCP Server, connects to it according to the configuration in Nacos, and waits for calls.
   - Input:
     - `mcp_server_name` (string): Name of the MCP Server to add.
   - Output: MCP Server tool list and usage instructions.
3. `use_tool`
   - Proxies tools from another MCP Server.
   - Input:
     - `mcp_server_name` (string): Name of the target MCP Server.
     - `mcp_tool_name` (string): Name of the target MCP Server tool.
     - `params` (map): Parameters of the target MCP Server tool.
   - Output: Output result from the target MCP Server tool.

In proxy mode, Nacos MCP Router only provides proxy capability. It can convert existing `stdio` or `sse` MCP Servers into the `streamableHTTP` protocol without code changes.

## Router Mode

**Start Nacos MCP Router**

### stdio Protocol

* Use uvx

    ```json
    {
        "mcpServers":
        {
            "nacos-mcp-router":
            {
                "command": "uvx",
                "args":
                [
                    "nacos-mcp-router@latest"
                ],
                "env":
                {
                    "NACOS_ADDR": "<NACOS-ADDR>, optional, defaults to 127.0.0.1:8848",
                    "NACOS_USERNAME": "<NACOS-USERNAME>, optional, defaults to nacos",
                    "NACOS_PASSWORD": "<NACOS-PASSWORD>, required"
                }
            }
        }
    }
    ```

* Use Docker

    ```json
    {
        "mcpServers": {
            "nacos-mcp-router": {
            "command": "docker",
            "args": [
                "run", "-i", "--rm", "--network", "host",  "-e", "NACOS_ADDR=<NACOS-ADDR>", "-e",  "NACOS_USERNAME=<NACOS-USERNAME>", "-e", "NACOS_PASSWORD=<NACOS-PASSWORD>" ,"-e", "TRANSPORT_TYPE=stdio", "nacos-mcp-router:latest"
                ]
            }
        }
    }
    ```

### sse Protocol

* Start with uvx

    ```shell
    export NACOS_ADDR=127.0.0.1:8848
    export NACOS_USERNAME=nacos
    export NACOS_PASSWORD=$PASSWORD
    export TRANSPORT_TYPE=sse
    uvx nacos-mcp-router@latest
    ```

* Start with Docker

    ```shell
    docker run -i --rm --network host -e NACOS_ADDR=$NACOS_ADDR -e NACOS_USERNAME=$NACOS_USERNAME -e NACOS_PASSWORD=$NACOS_PASSWORD -e TRANSPORT_TYPE=sse nacos-mcp-router:latest
    ```

### streamableHTTP Protocol

* Start with uvx

    ```shell
    export NACOS_ADDR=127.0.0.1:8848
    export NACOS_USERNAME=nacos
    export NACOS_PASSWORD=$PASSWORD
    export TRANSPORT_TYPE=streamable_http
    uvx nacos-mcp-router@latest
    ```

* Start with Docker

    ```shell
    docker run -i --rm --network host -e NACOS_ADDR=$NACOS_ADDR -e NACOS_USERNAME=$NACOS_USERNAME -e NACOS_PASSWORD=$NACOS_PASSWORD -e TRANSPORT_TYPE=streamable_http nacos-mcp-router:latest
    ```

### Use Nacos MCP Router with Cherry Studio

The following examples show MCP configurations for Cherry Studio.

* stdio mode configuration

    ```json
    {
            "mcpServers": {
                "nacos-mcp-router": {
                "command": "docker",
                "args": [
                    "run", "-i", "--rm", "--network", "host",  "-e", "NACOS_ADDR=<NACOS-ADDR>", "-e",  "NACOS_USERNAME=<NACOS-USERNAME>", "-e", "NACOS_PASSWORD=<NACOS-PASSWORD>" ,"-e", "TRANSPORT_TYPE=stdio", "nacos-mcp-router:latest"
                    ]
                }
            }
        }
    ```

* sse mode configuration

    ```json
    {
            "mcpServers": {
                "nacos-mcp-router": {
                    "url": "http://$router_ip:8000/sse"
                }
            }
        }
    ```

* streamableHTTP mode configuration

    ```json
     {
            "mcpServers": {
                "nacos-mcp-router": {
                    "url": "http://$router_ip:8000/mcp"
                }
            }
        }
    ```

## Proxy Mode

Proxy mode is designed to convert existing `stdio` and `sse` MCP Servers into the `streamableHTTP` protocol so they can benefit from streamableHTTP. In proxy mode, Nacos MCP Router only transparently forwards requests and exposes the target MCP Server tool list.

In proxy mode, set the `MODE=proxy` and `PROXIED_MCP_NAME=<MCP Server Name>` environment variables.

* Use uvx

    ```bash
    export NACOS_ADDR=$NACOS_ADDR
    export NACOS_USERNAME=$NACOS_USERNAME
    export NACOS_PASSWORD=$NACOS_PASSWORD
    export TRANSPORT_TYPE=streamable_http
    export MODE=proxy
    export PROXIED_MCP_NAME=$PROXIED_MCP_NAME
    uvx nacos-mcp-router@latest
    ```

* Use Docker

    ```bash
    docker run -i --rm --network host -e NACOS_ADDR=$NACOS_ADDR -e NACOS_USERNAME=$NACOS_USERNAME -e NACOS_PASSWORD=$NACOS_PASSWORD -e TRANSPORT_TYPE=streamable_http -e MODE=proxy -e PROXIED_MCP_NAME=$PROXIED_MCP_NAME  nacos-mcp-router:latest
    ```

## Environment Variables

| Parameter | Description | Default | Required | Notes |
| --- | --- | --- | --- | --- |
| NACOS_ADDR | Nacos server address | 127.0.0.1:8848 | No | Nacos server address, such as 192.168.1.1:8848. Include the port. |
| NACOS_USERNAME | Nacos username | nacos | No | Nacos username, such as nacos. |
| NACOS_PASSWORD | Nacos password | password | Yes | Nacos password, such as nacos. |
| NACOS_NAMESPACE | Nacos namespace | public | No | Nacos namespace, such as public. |
| TRANSPORT_TYPE | Transport protocol type | stdio | No | Supported values: stdio, sse, streamable_http. |
| PROXIED_MCP_NAME | Proxied MCP Server name | - | No | Name of the MCP Server to convert in proxy mode. It must already be registered in Nacos. |
| MODE | Working mode | router | No | Supported values: router, proxy. |
| PORT | Server port | 8000 | No | Used when the protocol type is sse or streamable. |
