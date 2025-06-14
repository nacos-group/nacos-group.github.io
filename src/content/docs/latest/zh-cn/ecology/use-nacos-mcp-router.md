---
title: Nacos MCP Router 使用手册
keywords: [Nacos MCP Router,MCP,使用手册]
description: Nacos MCP Router 使用手册
sidebar:
    order: 9
---

## 概述
Nacos MCP Router是一个基于MCP官方标准SDK实现的的MCP Server。它提供了一组工具，提供MCP Server推荐、分发、安装及代理其他MCP Server的功能，帮助用户更方便的使用MCP Server服务， 其主要架构如下：
    
![alt text](/img/doc/ecology/nacos-mcp-router/router-architecture.png)

## 功能介绍
Nacos MCP Router 有两种工作模式：
1. router模式：默认模式，通过MCP Server推荐、安装及代理其他MCP Server的功能，帮助用户更方便的使用MCP Server服务。
2. prroxy模式：使用环境变量MODE=proxy指定，通过简单配置可以把sse、stdio协议MCP Server转换为streamableHTTP协议MCP Server。

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
## 快速开始
### 准备工作
Nacos MCP Router 使用Nacos 作为MCP Registry，请请确保后台已经启动 Nacos 服务，可先行参考 [Nacos 快速入门](../quickstart/quick-start.mdx)。 

### router模式
1. 注册MCP Server
在Nacos控制台注册可能要用到的MCP Server，并设置MCP Server的配置, 以高德地图为例。
![alt text](/img/doc/ecology/nacos-mcp-router/mcp-register.png)
2. 启动Nacos MCP Router
    - stdio模式启动，stdio模式需直接配置在Claude、Clineor CherryStudio中。
        * uvx启动
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
        * docker启动
        ```json
        {
            "mcpServers": {
                "nacos-mcp-router": {
                "command": "docker",
                "args": [
                    "run", "-i", "--rm", "--network", "host",  "-e", "NACOS_ADDR=<NACOS-ADDR>", "-e",  "NACOS_USERNAME=<NACOS-USERNAME>", "-e", "NACOS_PASSWORD=<NACOS-PASSWORD>" ,"-e", "TRANSPORT_TYPE=stdio", "nacos/nacos-mcp-router:latest"
                    ]
                }
            }
        }
        ```

    - sse模式启动
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
        docker run -i --rm --network host -e NACOS_ADDR=$NACOS_ADDR -e NACOS_USERNAME=$NACOS_USERNAME -e NACOS_PASSWORD=$NACOS_PASSWORD -e TRANSPORT_TYPE=sse nacos/nacos-mcp-router:latest

    - streamableHTTP模式启动
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
        docker run -i --rm --network host -e NACOS_ADDR=$NACOS_ADDR -e NACOS_USERNAME=$NACOS_USERNAME -e NACOS_PASSWORD=$NACOS_PASSWORD -e TRANSPORT_TYPE=streamable_http nacos/nacos-mcp-router:latest
        ```
3. 使用Claude、Cline、CherryStudio等App测试，以CherryStudio为例，MCP配置如下
    * stdio模式配置
    ```json
    {
            "mcpServers": {
                "nacos-mcp-router": {
                "command": "docker",
                "args": [
                    "run", "-i", "--rm", "--network", "host",  "-e", "NACOS_ADDR=<NACOS-ADDR>", "-e",  "NACOS_USERNAME=<NACOS-USERNAME>", "-e", "NACOS_PASSWORD=<NACOS-PASSWORD>" ,"-e", "TRANSPORT_TYPE=stdio", "nacos/nacos-mcp-router:latest"
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
                    "url": "http://127.0.0.1:8000/sse"
                }
            }
        }
    ```

    * streamableHTTP模式配置
    ```json
     {
            "mcpServers": {
                "nacos-mcp-router": {
                    "url": "http://127.0.0.1:8000/mcp"
                }
            }
        }
    ```
4. 体验Nacos MCP Router
    ![alt text](/img/doc/ecology/nacos-mcp-router/router-weather-question.png)


### proxy模式
proxy模式诞生的初衷是帮助存量stdio、sse协议的MCP Server转换为streamableHTTP协议，享受streamableHTTP协议带来的好处。proxy模式下，Nacos MCP Router仅做请求透明转发，对外暴露目标MCP Server的工具列表。

proxy模式下，需设置环境变量MODE=proxy和PROXIED_MCP_NAME， 示例如下
```bash
docker run -i --rm --network host -e NACOS_ADDR=$NACOS_ADDR -e NACOS_USERNAME=$NACOS_USERNAME -e NACOS_PASSWORD=$NACOS_PASSWORD -e TRANSPORT_TYPE=streamable_http -e MODE=proxy -e PROXIED_MCP_NAME=$PROXIED_MCP_NAME  nacos/nacos-mcp-router:latest
```

启动成功后，设置CherryStudio MCP的配置项,即可看到被代理的MCP工具列表。
![alt text](/img/doc/ecology/nacos-mcp-router/router-proxy-cherry-studio.png)

![alt text](/img/doc/ecology/nacos-mcp-router/router-proxy-cherry-studio-tools.png)


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
