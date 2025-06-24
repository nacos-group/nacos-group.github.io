---
title: MCP Server 自动注册手册
keywords: [MCP Server Register,MCP,使用手册]
description: MCP Server 自动注册至 Nacos 使用手册
sidebar:
    order: 1
---
通过使用Spring AI Alibaba 框架 或者 Nacos MCP Wrapper Python 开发 MCP Server, 可以在 MCP Server启动后动态注册至 Nacos，并支持以下能力：

+ **MCP Server 服务动态管理**：通过 MCP 服务列表增删改查服务信息
+ **描述动态生效**：工具描述、参数定义等元信息支持运行时热更新，无需重启服务。
+ **MCP Server Tools 动态开关**：支持 MCP Server 服务 Tools 运行时动态开启和关闭，无需重启服务。
+ **全链路集成**：服务注册信息自动同步至 Nacos 配置中心与服务发现模块，适配 AI Agent 调用需求

![Auto-register](/img/doc/manual/user/ai/ai-mcp-auto-register.svg)

## 使用 Spring AI Alibaba Nacos MCP 框架开发 MCP Server
### 1.依赖引入
```xml
<dependency>
    <groupId>com.alibaba.cloud.ai</groupId>
    <artifactId>spring-ai-alibaba-starter-nacos-mcp-server</artifactId>
    <version>{1.0.0.1及以上版本}</version>
</dependency>

<!-- MCP Server (WebMVC) -->
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-starter-mcp-server-webmvc</artifactId>
    <version>{1.0.0-RC1及以上版本}</version>
</dependency>
```

### 2.服务定义（实例）
```java
@Service
public class WeatherService {

  @Tool(description = "Get weather information by city name")
  public String getWeather(@ToolParam(description = "City name") String cityName) {
    return "Sunny in " + cityName;
  }
}
```

### 3.自动注册参数配置
```yaml
spring:
  application:
    name: mcp-nacos-registry-example  
  ai:
    mcp:
      server:
        name: webmvc-mcp-server   # MCP服务名称
        version: 1.0.0            # 服务版本
        type: SYNC                # 调用类型：SYNC（同步）或ASYNC（异步）
    alibaba:
      mcp:
        nacos:
          server-addr:          # 替换为你的 Nacos 地址
          namespace: public    # Nacos 命名空间 ID（默认为public）
          username:           # 开源控制台用户名 
          password:           # 开源控制台密码
            registry:
              enabled: true   # 是否开启服务注册
```

### 4.服务启动
```java
@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public ToolCallbackProvider weatherTools(WeatherService weatherService) {
        return MethodToolCallbackProvider.builder().toolObjects(weatherService).build();
    }

}
```



## 使用 Nacos MCP Wrapper Python 开发 MCP Server
### 1.环境准备
```yaml
pip install nacos-mcp-wrapper-python
```

### 2.自动注册参数配置
```python
nacos_settings = NacosSettings()
nacos_settings.SERVER_ADDR = "127.0.0.1:8848" # <nacos_server_addr> e.g. 127.0.0.1:8848
nacos_settings.NAMESPACE= "public" # Nacos 命名空间ID
nacos_settings.USERNAME="" #开源控制台用户名
nacos_settings.PASSWORD="" #开源控制台密码
```

### 3.代码编写
```python
from nacos_mcp_wrapper.server.nacos_mcp import NacosMCP
from nacos_mcp_wrapper.server.nacos_settings import NacosSettings

# Create an MCP server instance
nacos_settings = NacosSettings()
nacos_settings.SERVER_ADDR = "127.0.0.1:8848" # <nacos_server_addr> e.g. 127.0.0.1:8848
nacos_settings.USERNAME=""
nacos_settings.PASSWORD=""
mcp = NacosMCP("nacos-mcp-python", nacos_settings=nacos_settings, port=18001)

# Register an addition tool
@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two integers together"""
    return a + b

# Register a subtraction tool
@mcp.tool()
def minus(a: int, b: int) -> int:
    """Subtract two numbers"""
    return a - b


if __name__ == "__main__":
    try:
        mcp.run(transport="sse")
        # mcp.run(transport="stdio")
        # mcp.run(transport="streamable-http")
    except Exception as e:
        print(f"Runtime error: {e}")
```



更多使用案例请参见[https://github.com/nacos-group/nacos-mcp-wrapper-python/tree/main](https://github.com/nacos-group/nacos-mcp-wrapper-python/tree/main)

## 在Nacos中动态变更工具开关和描述
MCP Server 自动注册到 Nacos 之后，可以在控制台上动态变更 MCP Server Tools 的描述和开关，相关修改将会在运行时中动态应用到 MCP Server 中，无需重启服务

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/101856292/1749782951969-a4ce544c-55ac-4013-a135-10994ceebbdf.png)



## 常见问题
1. 启动时出现 `mcp server info is not compatible` 或者 `check mcp server compatible false`报错

这是由于Nacos 中已经有对应版本的 MCP Server 数据，并且注册上来的 MCP Server 数据和Nacos中的MCP Server 数据 不兼容，请确保自动注册的MCP Server 数据和Nacos上对应版本的数据兼容性，包括：

+ MCP Server 协议（stdio,sse,streamable）是否一致，
+ 服务引用是否一致
+ Tools 数据是否一致（Tools 名称，Tools 数量，参数类型，参数是否可选），注意，Tools 描述和参数描述不要求一致。

