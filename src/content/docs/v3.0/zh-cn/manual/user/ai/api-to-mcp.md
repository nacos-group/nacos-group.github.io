---
title: 存量API转换MCP手册
keywords: [ MCP Server Register,MCP,存量API,转换 ]
description: 如何通过Nacos，将已经注册在Nacos上的存量微服务API，转化成为MCP服务
sidebar:
  order: 2
---

# 存量API转换MCP手册

Nacos 能够通过和 [Higress](https://higress.ai) 等AI网关的结合，**0代码改动**地实现将存量API转换成MCP
服务的能力。本文档将说明如何在Nacos上对已经注册在Nacos中的存量API声明为MCP服务，并通过[Higress](https://higress.ai)
的协议转换能力进行MCP Tools的调用。

![API转换MCP原理](/img/doc/manual/user/ai/ai-api-to-mcp.svg)

## 0. 准备工作

将存量API转换成MCP服务的准备工作主要有：

- **部署Nacos引擎** : 在运行环境中部署版本`3.0.0`
  及以上的Nacos引擎，可参考[Nacos快速开始](../../../quickstart/quick-start.mdx), [Nacos Docker 快速开始](../../../quickstart/quick-start-docker.mdx)
  或 [Nacos Kubernetes 快速开始](../../../quickstart/quick-start-kubernetes.mdx)。
- **部署Higress-AI** : 在运行环境中部署版本`2.1.2`
  及以上的Higress，可参考[Higress Docker 快速开始](https://higress.cn/ai/mcp-quick-start_docker/?spm=36971b57.31888769.0.0.646150f85M2PAG)
  或 [Higress Kubernetes 快速开始](https://higress.cn/ai/mcp-quick-start/?spm=36971b57.31888769.0.0.646150f85M2PAG)。
- **将存量API注册到Nacos引擎中** : 将存量API通过[Nacos SDK](../overview/other-language.md)
  或 [Spring Cloud](https://sca.aliyun.com/docs/2023/user-guide/nacos/quick-start/?spm=5176.29160081.0.0.74805c72y6j24s)
  等框架进行注册或自动注册。

## 1. 将存量服务声明成MCP服务

打开Nacos控制台`http://${nacos_console_host}:${nacos_console_port}` 如 `http://127.0.0.1:8080`.

> 首次打开可能需要进行管理员密码的初始化工作，请参考[Nacos控制台手册](../../admin/console.md#3-登录管理)。

点击左侧`MCP管理` -> `MCP列表`进入MCP管理页面

在页面左上角点击`创建MCP Server`，在创建MCP Server页面中填写必要信息，如：

| 信息            | 描述                                                                     |
|---------------|------------------------------------------------------------------------|
| MCP 服务名       | MCP Server 名称，用于区分不同MCP Server                                         |
| 协议类型          | 请选择`sse`或`streamable`                                                  |
| HTTP 转 MCP 服务 | 在`协议类型`选择为`sse`或`streamable`之后出现此选项，可选择`http`或`https`，根据存量服务提供的协议类型选择。 |
| 后端服务          | 在`协议类型`选择为`sse`或`streamable`之后出现此选项，选择`使用已有服务`                         |
| 服务引用          | 在单选框中选择需要转换的存量服务的服务名                                                   |
| 描述            | MCP服务的描述，自定义描述此存量服务转化成MCP服务后的描述信息                                      |
| 服务版本          | MCP服务的版本号，自定义版本号，一般使用如`1.0.0`样式的多级版本号                                  |

填写完成后，点击页面右上角的`发布`即可完成。

## 2. 将存量服务的API声明为MCP服务的Tools

打开Nacos控制台`http://${nacos_console_host}:${nacos_console_port}` 如 `http://127.0.0.1:8080`.

点击左侧`MCP管理` -> `MCP列表`进入MCP管理页面

在列表中找到[上一步骤](#1-将存量服务声明成mcp服务)中创建的MCP服务，在列表的`操作`列中点击`编辑`。

在`编辑 MCP Server`页面中，修改`服务版本`为新的版本号

> 考虑到不同MCP Server的版本兼容性问题，编辑时对于已发布的版本，只能修改Tool以及参数的描述信息以及开关；避免新增，删除，修改参数类型导致的MCP服务不兼容问题。

修改为新版本号后，在页面下方的`Tools`区域中会出现`添加`按钮，点击`添加`按钮，在`添加 MCP Tools`页面中填写必要信息，如：

| 信息        | 描述                                         |
|-----------|--------------------------------------------|
| Tool 名称   | MCP Tools的名称，用于区分不同MCP Tools               |
| Tool 描述   | MCP Tools的描述，自定义描述此存量服务API成MCP服务Tool后的描述信息 |
| 是否启用      | 是否启用此Tool，默认为启用                            |
| Tool 入参描述 | 对Mcp Tools的输入参数列表进行描述。                     |

其中点击`添加属性`能够新增输入参数。

> 注意，只有当焦点处于`参数列表`时，点击`添加属性`
> 才能新增输入参数。若焦点处于某一参数时，说明此时正在进行此参数的内容编辑，`添加属性`不允许点击。

之后再点击需要修改的输入参数，如`NewArg1`；在`参数信息`中进行参数属性的修改，参数属性内容解释如下：

| 信息     | 描述                                                                                                                     |
|--------|------------------------------------------------------------------------------------------------------------------------|
| 名称     | MCP Tools的输入参数名称，用于区分不同参数                                                                                              |
| 类型     | MCP Tools的输入参数类型，支持`string`、`number`、`integer`、`boolean`、`array`、`object`                                              |
| 描述     | MCP Tools的输入参数描述，自定义描述此MCP服务Tool参数描述信息                                                                                 |                                                                          |
| 协议转化配置 | 提供给AI网关或协议转换代理的协议转化配置，用于提供给给AI网关或协议转化代理，此工具实际映射的存量服务的API信息，如`url`，`参数映射关系`等，具体配置细节，请参见[MCP模版配置手册](./mcp-template.mdx)。 |

所有Tool的输入参数编辑完成后， 点击`确定`进行保存，之后重复添加其他的Tool信息后，点击页面右上角`发布为最新版本`。

> 页面右上角的`保存`仅会将内容进行保存，不会标记成最新版本，不进行发布最新版本，可能会导致AI网关或协议转换代理无法读取到新改动的工具信息。可用于编辑过程中保存记录以及灰度使用。

## 3. 配置协议转换暴露MCP服务

上述步骤已经已经将存量服务及其API声明成了MCP服务及MCP
Tool，Nacos作为控制面进行声明的存储和下发，但想要实际以MCP协议进行访问，还需要有数据面进行协议转换，目前Higress-AI网关已经提供了协议转换的能力。

Higress-AI网关的部署可参考参考[Higress Docker 快速开始](https://higress.cn/ai/mcp-quick-start_docker/?spm=36971b57.31888769.0.0.646150f85M2PAG)
或 [Higress Kubernetes 快速开始](https://higress.cn/ai/mcp-quick-start/?spm=36971b57.31888769.0.0.646150f85M2PAG)
进行部署，此文档主要说明如何配置：

### 3.1. 开启Higress-AI网关的MCP协议转换

参考[Higress ConfigMap 全局参数配置](https://higress.cn/ai/mcp-quick-start_docker/#configmap-%E5%85%A8%E5%B1%80%E5%8F%82%E6%95%B0%E9%85%8D%E7%BD%AE)
文档，将`data.higress.mcpServer.enable`的值修改为`true`，同时确保`data.higress.mcpServer.redis.address`的地址配置正确.

> `data.higress.mcpServer.match_list`可保持默认值，默认为`[]`，表示由Higress-AI网关自动进行会话保持管理。

例如：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  ...
data:
  higress: |-
    mcpServer:
      ...
      enable: true          # 启用 MCP Server
      redis:
        address: ${IP}:6379 # Redis服务地址。
        ...
      match_list: [] 
      ...
```

### 3.2. 配置 Nacos 作为 Higress-AI的 MCP Registry

参考[Higress 配置 Nacos MCP Registry](https://higress.cn/ai/mcp-quick-start_docker/#configmap-%E5%85%A8%E5%B1%80%E5%8F%82%E6%95%B0%E9%85%8D%E7%BD%AE)

将Nacos作为MCP Registry 服务来源进行配置，配置完毕后可在`Higress的控制台-服务列表`中查看到所有通过MCP协议暴露的存量服务的服务名称。

同时使用`curl http://${higress_ai_host}:${higress_ai_port}/mcp/${your_mcp_server_name}/see`
可连接MCP服务，查看到连接MCP服务的sessionId，并定时能看到心跳响应。

如，我的MCP服务名称为`restToMcp`：

```shell
curl localhost:8080/mcp/restToMcp/sse
event: endpoint
data: /mcp/restToMcp?sessionId=6b1fc62e-dbfa-40a9-9a5d-8a257e0b095c

event: message
data: {"jsonrpc":"2.0","id":"2025-06-16T03:33:04Z","method":"ping"}

event: message
data: {"jsonrpc":"2.0","id":"2025-06-16T03:33:09Z","method":"ping"}

```

至此，您已经将一个已经注册在Nacos上的存量服务API，转化成为了MCP服务，您可以将此MCP服务配置在各类LLM
Agent应用上，如`DeepChat`, `Cline`, `Cherry Studio`
等；或通过[Nacos-Mcp-Router](./nacos-mcp-router.md)，[MCP-Client](https://modelcontextprotocol.io/quickstart/client)，[Spring-AI](https://java2ai.com/docs/1.0.0-M6.1/get-started/?spm=5176.29160081.0.0.6546aa5c63Vkgn)
进行直接的访问和调用。