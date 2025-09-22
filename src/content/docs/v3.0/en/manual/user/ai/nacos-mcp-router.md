---
title: Nacos MCP Router
keywords: [Nacos MCP Router,MCP,使用手册]
description: Nacos MCP Router 使用手册
sidebar:
    order: 3
---

Nacos MCP Router是一个基于MCP官方SDK开发的标准MCP Server，为MCP Client提供MCP Server的`智能搜索`、`安装`、`代理`等功能， **极大地简化了**MCP服务的使用流程。 同时，Nacos MCP Router跟Nacos MCP Registry结合，可以实现MCP Server治理，如MCP Server及工具可见性、版本管理等。

![MCP Router架构图](/img/doc/overview/ai-mcp-router-struncture.svg)

## 功能介绍
Nacos MCP Router 有两种工作模式：
1. router模式：默认模式，通过MCP Server推荐、安装及代理其他MCP Server的功能，帮助用户更方便的使用MCP Server服务。
2. proxy模式：使用环境变量MODE=proxy指定，通过简单配置可以把sse、stdio协议MCP Server转换为streamableHTTP协议MCP Server。

在router 模式下，Nacos MCP Router 作为一个标准MCP Server，提供MCP Server推荐、分发、安装及代理其他MCP Server的功能。其主要工具列表为
1. `search_mcp_server`
    - 根据任务描述及关键字从MCP注册中心（Nacos）中搜索相关的MCP Server列表
    - 输入:
      - `task_description`(string): 任务描述，示例：今天杭州天气如何
      - `key_words`(string): 任务关键字，示例：天气、杭州
    - 输出: list of MCP servers and instructions to complete the task.
2. `add_mcp_server`
    - 添加并初始化一个MCP Server，根据Nacos中的配置与该MCP Server建立连接，等待调用。
    - 输入:
      - `mcp_server_name`(string): 需要添加的MCP Server名字
    - 输出: MCP Server工具列表及使用方法
3. `use_tool`
   - 代理其他MCP Server的工具
   - 输入:
     - `mcp_server_name`(string): 被调的目标MCP Server名称.
     - `mcp_tool_name`(string): 被调的目标MCP Server的工具名称
     - `params`(map): 被调的目标MCP Server的工具的参数
   - 输出: 被调的目标MCP Server的工具的输出结果

在proxy 模式下，Nacos MCP Router 仅提供代理功能，无需代码改动即可实现stdio、sse协议一键转换为streamableHTTP协议。
 

## router模式
**启动Nacos MCP Router**

### stdio协议
* 使用uvx
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
                    "NACOS_ADDR": "<NACOS-ADDR>, 选填，默认为127.0.0.1:8848",
                    "NACOS_USERNAME": "<NACOS-USERNAME>, 选填，默认为nacos",
                    "NACOS_PASSWORD": "<NACOS-PASSWORD>, 必填"
                }
            }
        }
    }   
    ```
* 使用docker
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

### sse协议
* uvx启动
    ```shell
    export NACOS_ADDR=127.0.0.1:8848
    export NACOS_USERNAME=nacos
    export NACOS_PASSWORD=$PASSWORD
    export TRANSPORT_TYPE=sse
    uvx nacos-mcp-router@latest
    ```
* docker启动
    ```shell
    docker run -i --rm --network host -e NACOS_ADDR=$NACOS_ADDR -e NACOS_USERNAME=$NACOS_USERNAME -e NACOS_PASSWORD=$NACOS_PASSWORD -e TRANSPORT_TYPE=sse nacos-mcp-router:latest
    ```

### streamableHTTP 协议
* uvx启动
    ```shell
    export NACOS_ADDR=127.0.0.1:8848
    export NACOS_USERNAME=nacos
    export NACOS_PASSWORD=$PASSWORD
    export TRANSPORT_TYPE=streamable_http
    uvx nacos-mcp-router@latest
    ```
* docker启动
    ```shell
    docker run -i --rm --network host -e NACOS_ADDR=$NACOS_ADDR -e NACOS_USERNAME=$NACOS_USERNAME -e NACOS_PASSWORD=$NACOS_PASSWORD -e TRANSPORT_TYPE=streamable_http nacos-mcp-router:latest
    ```
### 使用,Nacos-MCP-Router,以CherryStudio为例，MCP配置如下
* stdio模式配置
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

* sse模式配置
    ```json
    {
            "mcpServers": {
                "nacos-mcp-router": {
                    "url": "http://$router_ip:8000/sse"
                }
            }
        }
    ```

* streamableHTTP模式配置
    ```json
     {
            "mcpServers": {
                "nacos-mcp-router": {
                    "url": "http://$router_ip:8000/mcp"
                }
            }
        }
    ```


## proxy模式
proxy模式诞生的初衷是帮助存量stdio、sse协议的MCP Server转换为streamableHTTP协议，享受streamableHTTP协议带来的好处。proxy模式下，Nacos MCP Router仅做请求透明转发，对外暴露目标MCP Server的工具列表。

proxy模式下，需设置环境变量MODE=proxy和PROXIED_MCP_NAME=<MCP Server Name>
* 使用uvx
    ```bash
    export NACOS_ADDR=$NACOS_ADDR 
    export NACOS_USERNAME=$NACOS_USERNAME
    export NACOS_PASSWORD=$NACOS_PASSWORD 
    export TRANSPORT_TYPE=streamable_http
    export MODE=proxy
    export PROXIED_MCP_NAME=$PROXIED_MCP_NAME 
    uvx nacos-mcp-router@latest
    ```
* 使用docker
    ```bash
    docker run -i --rm --network host -e NACOS_ADDR=$NACOS_ADDR -e NACOS_USERNAME=$NACOS_USERNAME -e NACOS_PASSWORD=$NACOS_PASSWORD -e TRANSPORT_TYPE=streamable_http -e MODE=proxy -e PROXIED_MCP_NAME=$PROXIED_MCP_NAME  nacos-mcp-router:latest
    ```


## 环境变量配置

|    |               |                |      |                                           |
|----|---------------|----------------|------|-------------------------------------------|
|  参数 | 描述            | 默认值            | 是否必填 | 备注                                        |
| NACOS_ADDR | Nacos 服务器地址   | 127.0.0.1:8848 | 否    | 填写 Nacos 服务器的地址，如 192.168.1.1:8848，注意要写端口 |
| NACOS_USERNAME | Nacos 用户名     | nacos          | 否    | 填写 Nacos 用户名，如 nacos                      |
| NACOS_PASSWORD | Nacos 密码      | 密码             | 是    | 填写 Nacos 密码，如 nacos                       |
|NACOS_NAMESPACE| Nacos命名空间     | public         | 否    | Nacos命名空间，如 public                        |
| TRANSPORT_TYPE | 传输协议类型        | stdio          | 否    | 填写传输协议类型，可选值：stdio、sse、streamable_http    |
| PROXIED_MCP_NAME | 代理的 MCP 服务器名称 | -              | 否    | proxy模式下需要被转换的 MCP 服务器名称，需要先注册到Nacos      |
| MODE | 工作模式          | router         | 否    | 可选的值：router、proxy                         |
| PORT | 服务端口          | 8000           | 否    | 协议类型为sse或streamable时使用                    |
