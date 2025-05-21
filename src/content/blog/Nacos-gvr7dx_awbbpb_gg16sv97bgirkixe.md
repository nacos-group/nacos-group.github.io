---
title: "Nacos 3.0 正式发布：MCP Registry、安全零信任、链接更多生态"
description: "Nacos 3.0 正式发布：MCP Registry、安全零信任、链接更多生态"
date: "2025-04-28"
category: "article"
keywords: ["Nacos"]
authors: "CH3CHO"
---

作者：于怀、席翁、子葵、正己、濯光

Nacos 3.0 正式版本发布啦！升级 MCP Registry，围绕着 MCP 服务管理，MCP 多种类型注册，包含 MCP Server 注册、编排、动态调试和管理，并且提供 Nacos-MCP-Router 可以进行 MCP 动态发现，可以自动安装、代理 MCP Server，全生态面向 AI Registry 进行升级；升级安全架构，默认开启鉴权，基础架构一系列升级，作为云原生时代的基础设施级产品，Nacos 3.0 不仅是技术能力的跃升，更是以更高效、安全的方式帮助用户构建云原生 AI 应用架构！

# 一、Nacos 3.0 背景
**Nacos** `/nɑ:kəʊs/`是 Dynamic **Na**ming and **Co**nfiguration **S**ervice 的首字母简称，定位于一个更易于构建云原生 AI 应用的动态服务发现、配置管理和服务管理平台。从 2018 年 7 月开始宣布开源以来，已经走过了第六个年头，在这六年里，备受广大开源用户欢迎，收获许多社区大奖。Nacos 在社区共同的建设下不断成长，逐步的开始帮助用户解决实际问题，助力企业数字化转型，目前已经广泛的使用在国内的公司中，根据微服务领域调查问卷，Nacos 在注册配置中心领域已经成为**国内首选**，占有 **50%+ 国内市场**份额，被**各行各业的头部企业**广泛使用！

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/297800/1745396241224-ce61c1cb-ff37-40aa-957f-445aad5945dd.png)



Nacos 在 2.X 版本经过近三年的技术演进，已成功实现最初设计的`高性能架构`与`灵活扩展能力`，并持续优化产品`易用性`与`安全防护体系`。随着人工智能时代的全面到来，大语言模型（ LLM ）的成熟应用正推动行业进入AI原生化发展阶段。在此背景下，业界对AI原生应用开发标准的探索、AI Agent 框架的技术创新、动态 Prompt 的场景化需求，以及 MCP 协议、A2A 通信规范等技术生态的构建，均对服务治理体系提出了新的要求。Nacos 3.0 架构迭代的就是为了更好的这些技术趋势；Nacos 3.0 将重点构建面向AI原生架构的服务治理平台，为 模型 / MCP Server / Agent 等新型业务智能场景架构提供更高效的运行支撑；

Nacos 3.0 提升安全性，整体架构安全拆分，默认开启鉴权，并且支持动态数据源密钥等零信任方案；多语言生态，覆盖主流开发语言，Python、GoLang、Rust 作为重要部分，发布多个核心组件，可以打通 K8S 生态的 Service / ConfigMap /  Secret 数据，面向全场景可以作为统一管理平台；



![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/297800/1745574603374-73838ef0-8295-43e0-80ae-994529c6a892.png)

# 二、Nacos 3.0 发布 MCP registry 
Nacos 3.0 作为 MCP Registry ，主要定位在更易用的帮助管理 MCP 服务，动态管理 MCP 信息、Tools 描述和列表等，无需重启和运维，让 MCP 的调试更简单易用，并且支持将普通的 HTTP 或者 RPC 服务快速转化成一个 MCP 服务，Nacos 面相 MCP 可以汇总多种场景来源的 MCP 服务，包含 Local MCP Server、Remote MCP Server 以及 MCP 代理网关等场景，并且支持 Credentials 配置统一管理，Nacos 具备进行统一管理 MCP 上下游服务能力；

## MCP Registry 服务管理
Nacos 3.0 的 MCP Registry 围绕着MCP服务注册、MCP 服务订阅，进行 MCP 服务整体的产品化管理能力；

MCP 多种类型注册，包含 MCP Server 注册、编排、动态调试和管理，并且提供 Nacos-MCP-Router 可以进行 MCP 动态发现，可以自动安装、代理 MCP Server ，Nacos 3.0 全生态面向 AI Registry 进行升级；



![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/11189/1745327488821-e69b6dd0-39ad-4621-82d2-0b4a7ae4afce.png)

## MCP 服务注册，进行动态管理
注册到 Nacos 的 MCP Server，可以进行动态管理 MCP 服务， 包含 MCP 的描述信息以及 Tools 描述和动态关闭开启等；

#### 三种场景的 MCP 都可以进行自动注册和管理


1. **【业务 API 接口注册】** 存量 API 转化成 MCP Server ，“0 代码” 配置生成MCP 协议；

2. **【新构建 MCP Server注册】** 构建 MCP Server 自动注册服务，配置依赖自动注册管理，支持 Java（Spring AI）、Python、TypeScript（进行中）；

3. **【存量 MCP Server注册】** 存量已经构建 MCP Server 进行动态信息调整，通过Nacos-MCP-Router进行注册，也可以通过 Higress 网关代理进行注册；



### **【业务 API 接口注册】**“0代码” 转化成 MCP 协议
Nacos 作为 MCP Registry，扮演控制面的角色，不仅管理 Tool 的元信息，还可以把存量 API 转化成 MCP 协议，为企业提供了从传统服务治理向AI应用架构无缝升级的全新路径。



Nacos 可以帮助应用快速把业务已有的 API 接口，转换成 MCP 协议接口，结合 Higress AI 网关，实现 MCP 协议和存量协议的转换。其中，Nacos 提供存量的服务管理和动态的服务信息定义，帮助业务在存量接口不改动的情况下，通过 Nacos 的服务管理动态生效 Higress 网关所生成的 MCP Server 协议；



![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/11189/1745481633487-a212b6fe-b631-45df-a7b1-58f4af7f8801.png)



### **【新构建 MCP Server注册】**自动注册服务动态管理


如果你的场景需要新构建 MCP Server，那么你可以注册到 Nacos MCP Registry，不仅可以统一进行发现 MCP 服务，还可以帮助你构建的 MCP Server 具备动态调整治理的能力；


针对新建的 MCP 服务，Nacos 提供多语言支持与自动化注册能力，过程中无代码侵入，或者是更换注解，无需写代码集成 Nacos 就可以自动注册，并且还有主要的特点：



+ **跨语言生态适配：** 支持Java（Spring AI）、Python、TypeScript（进行中）等主流框架，通过标准SDK或配置声明快速接入。
+ **管理配置自动生效：** 服务注册后，可以通过 Nacos 产品化管理 MCP 元数据，如更新 MCP 描述、Tools 工具列表，更新信息后对应 MCP Server 会自动生效更改。
+ **统一管理MCP发现：** 可以通过放在 Nacos 统一管理，可以通过网关或者 Nacos-Mcp-Router 进行统一的配置发现；

能动态管理 MCP 信息、工具描述和列表等，而无需进行繁琐的系统重启或运维。这样不仅降低了系统维护的复杂性，还大大提高了调试的效率和便捷性。


### 【存量 MCP Server注册】自动注册服务动态管理 

如果你的场景需要从市场或者开源获取 MCP Server，那么 Nacos MCP Registry ，也可以帮你进行统一 MCP 服务管理；这部分需要配合 Nacos-Mcp-Router 或者 Higress 网关 来做，在前边代理 MCP Server 服务，帮你进行管理元数据和统一的发现；在文章 MCP 实践章节部分，我们会以高德官方 MCP Server 为例，做动手实践做个演示Demo；

## MCP自动发现：Nacos-MCP-Router
你可以直接将对应的接入点配置到 AI Agent 的 MCP Server 配置中，也可以选择结合 Nacos-MCP-Router 进行统一管理对接，这样你不需要每个 MCP Server 在 AI Agent 上单独配置，并且解决多个 MCP Server 在 AI Agent 上进行配置选择工具不准确和 Tokens 消耗黑洞的问题；

### Nacos 社区新成员 Nacos-MCP-Router 


Nacos-MCP-Router 是 Nacos 3.0 开源的 具备 MCP 协议的 新组件，具备对 MCP Server 语义搜索能力、自动安装能力（如果需要）、自动注册（可动态修改），协议代理能力等一系列 MCP 高级能力，可以帮助业务快速发现并且使用 MCP 服务；



Nacos-MCP-Router Github 仓库地址： [https://github.com/nacos-group/nacos-mcp-router](https://github.com/nacos-group/nacos-mcp-router)



Nacos-MCP-Router 是 MCP 官方 标准的 Python Server，TypeScript 等语言版本已经在进行中，后续会推出，以满足不通语言场景诉求；

### 自动发现：Nacos 管理 MCP Server 进行搜索和代理
AI Agent 不需要进行每个 MCP Server 配置，只需要配置 Nacos MCP Router （后文用 Router 代替）即可，Router 会和 AI Agent 自动交互搜索需要的 MCP Server 进行调用，对于 AI Agent 减少了大量 MCP Server 无关信息，减少 AI Agent 使用MCP 对底层大模型 Tokens 消耗；



Nacos MCP Router 的 MCP 信息搜索能力，是基于向量数据库进行语义匹配，在海量 MCP Server 配置以及搜索的实时性上取得平衡，并且过程中，还尽可能利用 AI Agent 智能性，帮助进行筛选确定 MCP Server 的选择，在确保减少 AI Agent 的总 Tokens 消耗的同时，又大大的扩展了 AI Agent 能使用 MCP Server 的上限；



### 对 MCP Server 分发、安装、注册、管理
在使用 Nacos MCP Router 的场景中，如果 AI Agent 需要的 MCP Server 没有部署，当前 MCP 需要安装的话，Router 也会自动帮助安装，并且会向 Nacos 自动注册信息，Nacos MCP Registry 可以动态管理信息，管控调整动态可以生效；避免了使用官方 MCP Server 匹配不准，信息没有办法进行调整的问题，Tools 列表没办法动态关闭和开启的问题；

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/11189/1745668430387-c272dda9-aaa3-4c20-b87c-ebc77c6bd87b.png)





## 使用 Nacos 管理 MCP 的优势
+ **存量 API 可以快速构建 MCP Server：** Nacos 配置存量 API 描述可以 0 代码的构建成 MCP Server，快速跟进 MCP 协议；
+ **MCP Server 统一管理平台：** 存量API转化、私有构建 MCP Server、各种类型官方（local、remote） MCP Server 以及市场 MCP ，多种场景 MCP Server 统一进行管理，动态调整；
+ **MCP Credentials 密钥管理：** 支持 MCP Server 相关密钥统一管理，基于 Credentials 模块可以统一管理和下发，配合 Router 无需配置到 AI Agent 上；
+ **MCP 信息动态下发实时生效：** MCP 描述信息、Tools 以及 Prompts 都需要进行调试，才能达到更好效果，Nacos 可以帮助管理和下发信息，更高效的调试描述；
+ **MCP信息历史版本管理：** Nacos 会管理和存储 MCP 信息历史版本，方便进行 Diff 对比差异，方便进行快速回滚；
+ **MCP信息灰度管理：** Nacos 在 MCP 信息生效的时候，可以进行灰度分批生效，方便对比 MCP 信息效果；
+ **密钥配置加密管理：** MCP 信息里以及调用 API 过程中，需要密码等敏感信息，Nacos 提供了敏感信息加密的能力，帮助更安全的使用 MCP；
+ **MCP 返回格式 JSON 转换 XML：** 和大模型交互都有体感，对模型来说，JSON 没有 XML 格式好用，所以在 MCP 返回信息格式上，Nacos 可以帮助 MCP 把返回格式从 JSON 变成 XML，方便大模型理解；
+ **MCP 服务管理及健康检查：** MCP 服务会越来越多，Nacos 有大规模服务管理能力，并且持续在迭代过程中，为 MCP 做健康检查、实时更新、负载均衡，起到 MCP 服务发现中心的托管作用。



# 三、Nacos 3.0 MCP 动手实践


## Nacos 3.0 部署和启动流程 
### <font style="color:rgb(38, 38, 38);">Nacos 部署</font>
Nacos 3.0 默认开启鉴权，启动前，需要配置一下密钥信息，启动后，登录 Nacos 控制台设置初始化管理员密码；

通过 Docker 部署 nacos ，可以根据以下命令，快速 Docker 部署：

```java
export NACOS_AUTH_TOKEN=自定义的token，token为用户名密码生成JWT Token的密钥（原串要32位以上，之后做base64格式化）
export NACOS_AUTH_IDENTITY_VALUE=自定义的IDENTITY_VALUE，任意英文和数字组合
docker run -td -e PREFER_HOST_MODE=hostname -e MODE=standalone -e NACOS_AUTH_IDENTITY_KEY=serverIdentity -e NACOS_AUTH_IDENTITY_VALUE=${NACOS_AUTH_IDENTITY_VALUE} -e NACOS_AUTH_TOKEN=${NACOS_AUTH_TOKEN} -p 8080:8080 -p 8848:8848 -p 9848:9848 nacos/nacos-server
```

密钥信息解释

:::info
NACOS_AUTH_TOKEN ：Nacos 用于生成JWT Token的密钥，使用长度大于32字符的字符串，再经过Base64编码。

NACOS_AUTH_IDENTITY_KEY：Nacos Server端之间 Inner API的身份标识的Key，必填。

NACOS_AUTH_IDENTITY_VALUE：Nacos Server端之间 Inner API的身份标识的Value，必填。

:::



也可以通过 下载 Nacos 安装包进行部署 Nacos ，注意 JDK17+ 要求，除了密钥信息必填，Nacos 3.0 的部署流程和 Nacos2.X 基本保持一致。

关于下载、安装等详细信息，这里不进行详细展开，可以查看 Nacos 官网文档[快速开始](https://nacos.io/docs/v3.0/quickstart/quick-start/?spm=5238cd80.2ef5001f.0.0.3f613b7c62sgI9) 。

## 注册 MCP Server ，变更 MCP 信息动态生效

将 MCP Server 注册到 Nacos MCP Registry 中，可以帮助整体管理，动态调整 MCP 信息和变更 Tools 、Resources、Prompts 信息，并且可以进行对接 Nacos 进行统一管理和使用 MCP Server ；



### 存量服务 “0代码”转换成 MCP Server 
基于 Nacos 和 Higress 实现存量 Http 服务 0 代码转化为 MCP Server，首先在 Nacos 中配置 MCP 服务

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/17056839/1745739298961-8ef41e74-8c8a-45e8-8d9c-42007bea9678.png)

点击创建 MCP 服务

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/17056839/1745739337616-c59225fb-dad0-4c2d-8171-e7fdc1c8c770.png)

协议类型选择 Http，服务引用选择一个已有的服务，**<font style="color:rgb(102, 102, 102);">访问路径填写暴露在 higress 中的 mcp 服务的路径，填写完成之后点击发布。我们在点击编辑 进行 tools 的配置</font>**

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/17056839/1745739464540-292aadf7-de15-41a2-8e94-4aa35a07f37e.png)

点击添加tools

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/17056839/1745739488630-05417404-9f2e-4155-b1d5-9cd596bbd3e2.png)

配置 tools 的相关信息

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/17056839/1745739618373-f6275da3-ed9e-4c64-86ed-2468ac610612.png)

这里需要根据方法的参数信息配置参数映射模版，如果使用 Higress 作为 MCP 协议暴露，则需要配置 Higress  REST-to-MCP 模版数据，模版配置的具体参数参考[文档](https://nacos.io/docs/v3.0/manual/user/mcp-template/)

配置完成之后，根据[文档](https://higress.cn/ai/mcp-quick-start/?spm=36971b57.31888769.0.0.559550f86sCJw2#%E9%85%8D%E7%BD%AE-nacos-mcp-registry)配置 Higress 连接到 Nacos 进行自动的 MCP 服务发现。

### 自己构建的MCP Server，自动注册到 Nacos 进行动态管理
通过自己代码方式构建 MCP Server，可以通过下边方式自动的注册到 Nacos 中，帮你管理你的 MCP Server，目前支持 Java、Python 方式，无需代码改动或者轻改动自动注册到 Nacos 上，目前社区 TypeScript 的还在进行中，额外是借助 Nacos-MCP-Router 方式作为类似的 SideCar 形式，也可以自动注册到 Nacos 上进行管理；

#### Spring AI 构建 MCP Server，无需改代码，自动注册到 Nacos
如果你是基于 Spring AI 官方构建的 MCP Server，只需要引入对应的 Nacos MCP 的依赖，无需修改代码，就可以实现 MCP Server 自动注册到 Nacos 中进行管理：

1. 引入依赖_（注意 WebMvc SSE 或者 WebFlux SSE 需求二选一即可）_

```xml
<!-- Spring AI 官方 Mcp Server Starter
<dependency>
  <groupId>org.springframework.ai</groupId>
  <artifactId>spring-ai-mcp-server-spring-boot-starter</artifactId>
  <version>1.0.0-M6</version>
</dependency> -->

<!-- 将Spring AI 官方 Mcp Server Starter 替换成 Spring AI Alibaba Mcp Nacos -->
<dependency>
  <groupId>com.alibaba.cloud.ai</groupId>
  <artifactId>spring-ai-alibaba-mcp-nacos</artifactId>
  <version>1.0.0-M6.2-mcp-SNAPSHOT</version>
</dependency>

<!--WebMvc SSE，和WebFlux模式二选一-->
<dependency>
  <groupId>org.springframework.ai</groupId>
  <artifactId>spring-ai-mcp-server-webmvc-spring-boot-starter</artifactId>
  <version>1.0.0-M6</version>
</dependency>

<!--WebFlux SSE，和WebMvc模式二选一-->
<dependency>
  <groupId>org.springframework.ai</groupId>
  <artifactId>spring-ai-mcp-server-webmvc-spring-boot-starter</artifactId>
  <version>1.0.0-M6</version>
</dependency>

```

如果出现依赖无法下载的情况，请在pom.xml中配置以下仓库：
```xml
<repositories>
   <repository>
      <id>spring-milestones</id>
      <name>Spring Milestones</name>
      <url>https://repo.spring.io/milestone</url>
      <snapshots>
         <enabled>false</enabled>
      </snapshots>
   </repository>
   <repository>
      <id>spring-snapshots</id>
      <name>Spring Snapshots</name>
      <url>https://repo.spring.io/snapshot</url>
      <releases>
         <enabled>false</enabled>
      </releases>
   </repository>
   <repository>
      <id>sonatype-nexus-snapshots</id>
      <name>Sonatype Nexus Snapshots</name>
      <url>https://oss.sonatype.org/content/repositories/snapshots</url>
      <releases>
         <enabled>false</enabled>
      </releases>
      <snapshots>
         <enabled>true</enabled>
      </snapshots>
   </repository>
</repositories>

```



配置文件application.yml：

```yaml
spring:
  ai:
    mcp:
      server:
        name: Demo
        version: 1.0.0
        type: SYNC
    alibaba:
      mcp:
        nacos:
          enabled: true
          server-addr: <nacos-sever-addr>
          username: <username>
          password: <password>
```

MCP Server 启动之后即可自动注册到 Nacos 上，可以通过 Nacos MCP 进行界面信息管理了，更改实时生效；

#### Python 构建 MCP Server，更换注解，自动注册到 Nacos
基于 MCP 官方 Python SDK 构建 MCP Server 的流程，只需要在官方 Demo 的基础上稍作调整，引入以下依赖，您的 MCP Server 就可以注册到 Nacos 上，并实现 Description 以及 Tools 等信息的托管以及实时生效，

1.安装依赖

```powershell
pip install nacos-mcp-wrapper-python
```

2.代码实现

```python
# server.py
from nacos_mcp_wrapper.server.nacos_mcp import NacosMCP
from nacos_mcp_wrapper.server.nacos_settings import NacosSettings

# 代码方式
nacos_settings = NacosSettings()
nacos_settings.SERVER_ADDR = "<nacos-server-addr> e.g. 127.0.0.1:8848"
mcp = NacosMCP("Demo",nacos_settings=nacos_settings)

# 环境变量方式：配置环境变量 NACOS_MCP_SERVER_SERVER_ADDR=127.0.0.1:8848
mcp = NacosMCP("Demo")

@mcp.tool()
def get_weather(city_name:str) -> str:
    """Get weather information by city name"""
    return "Sunny"

mcp.run()
```

3.启动Mcp Server

```powershell
python server.py
```

Mcp Server 启动之后即可自动注册到 Nacos 上，就可以实现基于 Nacos MCP Registry 的信息管理。详细配置方式请参考[https://github.com/nacos-group/nacos-mcp-wrapper-python](https://github.com/nacos-group/nacos-mcp-wrapper-python)



TypeScript 语言构建 MCP Server 自动注册到 Nacos，目前还在进行中，后边陆续会开放出来；



并且通过借助 Nacos-MCP-Router 方式作为类似的 SideCar 形式，也可以自动注册到 Nacos 上进行管理；



## MCP Server自动发现： Nacos-MCP-Router演示 
### 环境要求
Nacos-MCP-Router 是 MCP 官方 标准的 Python Server，所以需要 Python 基本环境准备：

部署环境 依赖 Python 运行环境和包管理工具 uv ；请确保 Python 版本在 3.12 及以上；

Python 安装方法参考：[https://www.python.org/about/gettingstarted/](https://www.python.org/about/gettingstarted/)

uv 安装方法参考：[https://docs.astral.sh/uv/getting-started/installation/](https://docs.astral.sh/uv/getting-started/installation/)

### Nacos-MCP-Router 安装与配置
1. Nacos MCP 配置文件，作为标准 MCP Sever 可以配置到 Cline 、Cursor 等 标准支持 MCP 的 AI Agent 中：

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
        "NACOS_ADDR": "<Nacos服务端地址，格式为：IP:Port, 默认配置 8848端口>",
        "NACOS_USERNAME": "<对应Nacos中的用户名>",
        "NACOS_PASSWORD": "<用户名对应的密码>"
      }
    }
  }
}
```

配置到 AI Agent 中 会进行自动安装部署，用 Cline 为例，可以看到安装成功，并且可以看到对应的 Tools 工具列表；

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/7601/1745747937972-736583b3-30e3-4278-8e57-f5e9cf0944b2.png)

__

_如果安装不成功，或者起不来，可以检查一下环境，比如 uvx 命令是否安装过，安装过的话，有安装过但运行不起来，可以在"command"字段配置 uvx 安装的全路径，默认在 ~/.local/bin/uvx ，之后重试即可；_

### Nacos-MCP-Router 搜索、分发、部署、代理MCP Server
Nacos-MCP-Router 安装好后，可以路由匹配 Nacos MCP Registry 管理的 MCP Server（ Remote 、Local 、代理服务），上边章节介绍了，主要是 Remote MCP Server 以及 存量服务 转换成 MCP Server 的注册场景，下边介绍 Local MCP Server 场景，Nacos-MCP-Router 对 MCP Server 的搜索、分发、部署、使用的整体流程；



1. 在Nacos 控制台 **MCP管理** Tab页，点击“**创建MCP Server“**

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/7601/1745743369471-3053c61f-917f-4308-9161-18074b353db0.png)



2. 服务名 填写 amap-mcp-server，选 stdio 协议，填写高德官方 MCP Server 配置，以及 MCP 描述，最后，点击“**发布”。**

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/7601/1745757741721-07bc03b5-5f56-4467-91b8-b3fece8ef540.png)



2. 使用 Nacos-MCP-Router 发现和使用其他 MCP Server
    1. 根据任务描述搜索可用的 MCP Server，Nacos-MCP-Router 给出可用 MCP Server 列表

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/7601/1745757584642-3983288a-f3a2-4fa4-bb13-d27b64d6c0c6.png)

    2. LLM 选择使用高德地图 MCP Server，并调 add_mcp_server 工具初始化，如果需要安装，在这部 Nacos-MCP-Router 会自动安装

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/7601/1745748178167-4dac04b1-848d-4178-b117-58f13ba6cd70.png)

    3. LLM 通过 Nacos-MCP-Router 使用高德地图 MCP 工具得出最终结果

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/7601/1745757297411-2b293812-1c69-44bc-8d7f-ebc1a0409943.png)

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/7601/1745757306460-c4b74e07-574b-4828-8ffb-28b922109e8b.png)

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/7601/1745757240796-e08f42d7-7582-4111-a01e-581b98711917.png)

整体过程中，AI Agent 只配置 Nacos-MCP-Router ，就可以对 Nacos MCP Registry 所有 MCP 服务进行按需使用；

# 四、3.0核心能力升级
## 安全部署架构
在之前的Nacos版本中，为了方便用户的部署和使用，控制台与引擎程序一直合并部署，且共用同一个端口。这种方式虽然增强了使用的便利性，但也带来了一些安全风险。此外，由于控制台和引擎在使用场景上存在差异，它们对于开放网络访问范围及安全认证需求的预期也不尽相同。基于此，Nacos3.0中对控制台和引擎的部署架构进行较大调整。

在Nacos 3.0中，控制台将独立在一个Web容器中运行，允许用户设定独立的访问端口。这一改变使得Nacos集群的运维人员能够更灵活地配置网络访问控制列表（ACL），例如，仅将控制台端口开放给办公网络。同时，配合控制台默认启用的安全认证，这将显著提高Nacos的`安全性`。此外，独立的Web容器还将与全新的Admin API相结合，实现控制台和引擎节点的灵活拆分部署，使得它们能够在不同节点上运行，增强`安全性`。

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/svg/297800/1733192679990-8dbd8b9c-5a85-48b4-bdfd-ce0b85e76125.svg)



## K8S 生态同步
Nacos 作为微服务领域的注册配置中心，被越来越多的开发者使用，也与多种开发框架集成，大大方便了开发者。但目前仍然有一些场景没有满足。

1. 有些用户可能同时使用了 Nacos 服务发现与 K8s 服务发现，使用 Nacos 服务发现的应用希望能够通过 Nacos 发现 K8s 集群的服务；
2. 应用目前使用 K8s 的 configmap 和 secret ，很方便的通过 Nacos 管理 configmap 和 secret，支持配置加解密能力提升配置管理的易用性和安全性；

### Nacos 服务与 K8S 服务互相发现
Nacos-Controller 就是为解决上述问题而诞生的。它可以帮助同步 K8s 的 Service 到 Nacos ，也可以支持 K8s的 configmap、secret 与 Nacos 配置的双向同步。

Nacos Controller 2.0 支持将 Kubernetes 集群特定命名空间下的 Service 同步到 Nacos 指定命名空间下。用户可以通过 Nacos 实现对 Kubernetes 服务的服务发现。以此实现跨 K8S 集群的服务发现和访问，或实现 K8S 集群与非 K8S 集群间的服务发现和访问，解决容灾备份，平滑迁移等一系列高可用，稳定性相关的高级服务发现场景。

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/svg/297800/1742805913059-eeb16330-0c24-483a-a815-02cab090f4d8.svg)![](https://intranetproxy.alipay.com/skylark/lark/0/2025/svg/297800/1742809058071-75d464d9-8d18-4d80-b79c-71e5267a8f0e.svg)

### Nacos 管理 K8S configmap 和 secret
Nacos Controller 2.0 支持 Kubernetes 集群配置和 Nacos 配置的双向同步，将 Kubernetes 集群特定命名空间下的 ConfigMap 以及 Secret 同步到  Nacos 指定命名空间下中。用户可以通过 Nacos 实现对于 Kubernetes 集群配置的修改和管理，以达到 ConfigMap 和 Secret 的动态修改、版本管理、灰度发布等场景。

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/svg/297800/1742810593314-632896a2-4d6d-4541-936e-dd6f7967d9b1.svg)



关于 Nacos Controller 2.0 的更多细节，欢迎访问[Nacos Controller文档](https://github.com/nacos-group/nacos-controller/blob/main/README.md)。同时关于 Nacos Controller 2.0 使用的具体技术细节和使用方式的相关技术文章也已经在准备中，相信很快就能和大家见面。

## 多语言能力
Nacos 3.0 将多语言生态建设作为重要方向，在持续完善 Java 生态的同时，重点拓展 Go 语言与 Python 生态的深度整合。对于 Java 开发者，Nacos 将继续维护并优化 Client 组件及配套工具链的演进；针对 Go 语言生态，将强化与主流应用框架及服务网关的 SDK 适配，实现开箱即用的注册发现与配置管理能力。在 Python 领域，Nacos 将与 AI 开发框架建立紧密技术协同，通过提供原生集成方案，帮助机器学习工程师便捷接入动态 Prompt 管理、 MCP & A2A 服务自动注册&发现等。这些举措旨在为不同语言社区提供低门槛、高兼容性的服务发现与配置管理能力，让各类技术栈的开发者都能充分受益于 Nacos 的高性能服务治理体系。

其他多语言生态，Nacos3.0 会通过各类社区活动和社区任务， 邀请社区贡献者共同丰富多语言生态：

+ [Nacos Go SDK](https://github.com/nacos-group/nacos-sdk-go)
+ [Nacos Python SDK](https://github.com/nacos-group/nacos-sdk-python)
+ [Nacos Rust SDK](https://github.com/nacos-group/nacos-sdk-rust)
+ [Nacos C# SDK](https://github.com/nacos-group/nacos-sdk-csharp)
+ [Nacos Node.js SDK ](https://github.com/nacos-group/nacos-sdk-nodejs)
+ [Nacos C++ SDK](https://github.com/nacos-group/nacos-sdk-cpp)
+ [Nacos PHP SDK](https://github.com/nacos-group/nacos-sdk-php)

## Nacos MCP Server
Nacos 3.0 除了作为 MCP Registry 外，也能够将自身的能力通过 MCP 暴露给 LLM，帮助Nacos的运维人员和使用者快速检索数据和分析问题。 因此我们推出 Nacos MCP Server ——作为Nacos的智能扩展组件，它通过大语言模型技术，可快速检索、解析 Nacos 集群中的服务信息、配置项及命名空间数据，实现服务管理与AI能力的深度联动，为开发者提供更智能的服务探索与配置洞察体验。

Nacos MCP Server 已发布0.1.1版本，欢迎参考[文档](https://github.com/nacos-group/nacos-mcp-server)进行试用。

> _<font style="color:rgb(13, 18, 57);">温馨提示</font>_<font style="color:rgb(13, 18, 57);">：当前版本为MCP Server早期技术验证阶段，功能将持续迭代优化中。目前支持服务/配置的查询、检索与列表展示等基础操作，写入功能将在后续版本中逐步开放。</font>
>



## 更多实验性功能
### 分布式锁
Nacos 社区向用户征集了他们对 Nacos 3.0 的期望功能，其中支持分布式锁的需求是呼声最高的功能之一。分布式锁是一项在分布式应用中常用的功能，目前大多数实现依赖于 Zookeeper 或 Redis 等产品。许多用户已经将Nacos 替换为 Zookeeper 来进行服务和配置管理，但由于 Nacos 尚未支持分布式锁，用户仍需额外运维 Zookeeper 集群，增加了系统的复杂性。

因此，Nacos 社区通过课题[ISSUE#10378](https://github.com/alibaba/nacos/issues/10378)实现分布式锁的功能，并在 3.0.0 中引入分布式锁的实验性功能，以满足部分用户对轻量级分布式锁的需求。这一功能的推出将帮助用户减少对额外系统的依赖，从而简化微服务应用架构，拓展 Nacos 的使用场景。欢迎大家试用并反馈使用中的问题。

### 服务&配置模糊订阅
支持配置和服务的模糊订阅也是 Nacos 3.0 的期望功能中呼声最高之一，在 Nacos 3.0.0 中，模糊订阅的功能作为实验性功能加入。用户可以通过`fuzzyWatch`接口可以使用一定的表达式，对指定分组、服务和配置进行批量订阅；目前支持通过`*`进行前缀模糊，后缀模糊，双边模糊匹配。欢迎大家试用并反馈使用中的问题。

:::warning
模糊订阅功能仅会推送服务、配置的新增以及删除事件，并不会直接推送服务下实例列表，可在服务模糊订阅的监听器中结合subscribe接口实现服务下实例列表的变更监听。

出于稳定性考虑，Nacos对模糊订阅的规则数量以及单个规则匹配的服务数量有上限保护。具体请参考[使用手册](https://nacos.io/docs/v3.0/manual/user/java-sdk/usage/?spm=5238cd80.2ef5001f.0.0.3f613b7cEikFoW)。

:::

# 五、Nacos3.0持续迭代演进和活动计划
## AI相关能力演进
在 Nacos 3.X 中，AI Agent 与大模型的应用场景也是 Nacos 3.X 的一个主要探索方向。Nacos 希望打造一个面向AI应用的动态配置与全场景管理能力，支持 AI Agent/MCP 的注册与发现、大模型推理配置的动态生效、多语言框架集成，驱动动态化、智能化与高效开发运维。

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/297800/1745484583689-9fde89a5-68e9-4d8a-bd82-283679a00884.png)

### 动态AI配置与运行时调优的增强
![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/297800/1745483924863-1b06d5d1-3025-427f-8a51-704a17b792b1.png)

Nacos 3.X 通过强化 Python-SDK 的迭代和功能演进，提供无状态、高可用的参数分发能力，适配 Python（Langchain、Llamaindex）、Java（Spring-AI-Alibaba）、Go/Node.js 等多语言AI框架，用以支持AI相关参数的动态管理，例如：支持LLM模型参数（如权重、学习率、批大小）、Prompt 模板、特征选择、推理策略等动态更新，实现模型推理的实时调优（如A/B测试、流控、负载均衡）。同时动态管理 AI Agent 的任务规划、调度策略、联网参数及动态数据源，支持 Agent 实例的弹性扩缩容和全局状态同步，实现 AI Agent 运行时的动态能力增强。

### MCP/AI Agent Registry
![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/297800/1745484293505-64bb9dc5-6bf7-4ecf-9bca-9e8c6f079ced.png)

Nacos 3.X 计划为模型推理服务（如 MCP Servers 或 Agent to Agent）提供实时参数配置，服务注册与发现，版本控制，支持将存量 API 转化为 MCP 或 A2A API，降低AI应用的开发和管理成本。另外 Nacos 3.X 计划无缝对接 AI 应用平台（如终端应用运行时、算法优化工具链），提供 MCP 工具的路由、筛选等能力，降低AI应用依赖的成本和使用门槛。

## 架构能力提升
在 Nacos 3.0 的发展路线图中，对于 Nacos 基础架构能力持续提升，我们将继续致力于提升易用性与普适性，以满足用户日益增长的需求。

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/svg/297800/1733195924041-0738e77e-9424-4bab-b8ca-00c5073f3b8b.svg)

在引擎自身方面，新版本计划支持`DNS协议`，以进一步拓展 Nacos 在支持较弱编程语言场景中的适用性。另外对于`服务健康检查体系`，我们将优化相关机制，通过将健康检查与服务类型解耦，提供更多关于服务可用性的判断依据，这将使微服务之间的流量调用更加灵活，同时确保系统的稳定运行。最后对于社区中已经比较成熟的插件，我们会将其纳入 Nacos 的主干仓库中进行维护，诸如`PostgreSQL插件`、`AES配置加密插件`等，让这些插件在后续版本中随引擎一起发布、不需要再独立构建引入。

在生态建设方面，我们将通过 Nacos Controller 的快速迭代，实现`Kubernetes服务与配置的同步管理`，从而使云原生环境下的使用变得更加便捷。为用户提供更加丰富的功能选择与应用场景，努力构建一个高效、灵活的分布式协调平台。

# 六、社区欢迎共建
Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及AI管理。

Nacos 帮助用户更敏捷和容易地构建、交付和管理云原生AI应用的平台。 Nacos 是构建以“服务”为中心的现代应用架构 (例如微服务范式、云原生范式、AI原生范式) 的服务基础设施。

Nacos 3.0 还有很多待完成的功能及大量待探索和开发的领域，欢迎大家扫码加入 Nacos 社区群及 Nacos MCP社区讨论群，参与 Nacos 社区的贡献和讨论，在 Nacos 社区一起搭把手，让你的代码和能力有机会能在各行各业领域内进行释放能量，期待认识你和你一起共建 Nacos 社区；



_<font style="color:#585A5A;">“Nacos 相信一切都是服务，每个服务节点被构想为一个星球，每个服务都是一个星系；Nacos 致力于帮助这些服务建立连接赋予智能，助力每个有面向星辰的梦想能够透过云层，飞在云上，更好的链接整片星空。”</font>_



Nacos 官网：[https://nacos.io/](https://nacos.io/)

Nacos 仓库地址：[https://github.com/alibaba/nacos](https://github.com/alibaba/nacos) 

“Nacos社区群5”群的钉钉群号： 120960003144

“Nacos MCP 社区讨论群”群的钉钉群号： 97760026913

| ![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/297800/1745409709892-b3a5252e-eb16-41ea-a25c-91d9acc75353.png) | ![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/297800/1745409712778-599a0535-4433-43b8-b413-bff9dc1ab1e8.png) |
| --- | --- |

Nacos Meetup 将于5月中下旬在上海和大家见面，欢迎收藏 Nacos.io，我们将在第一时间发布报名入口。

