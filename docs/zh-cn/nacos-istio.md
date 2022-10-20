# Istio 指南

支持了 xDS 协议中的 CDS、EDS 服务，并为 EDS 以及 MCP 实现了增量推送。用户可以使用支持 xDS 协议的数据端与 Nacos 进行对接，实现服务发现功能。

## 配置

对于发行包，修改 `nacos/conf/application.properties` 中的 `nacos.istio.mcp.server.enabled` 为 true；

对于源码，修改 `nacos/distribution/conf/application.properties` 中的 `nacos.istio.mcp.server.enabled` 为 true 。

若要使用 MCP 增量服务，除上述配置需修改外，还需修改 `nacos/istio/misc/IstioConfig` 中的 `nacos.istio.server.full` 为 false。

## 运行

- 注：同一服务下的各个实例使用的协议需一致，EDS 默认使用增量推送。

1. 部署 Nacos，[部署参考](https://nacos.io/zh-cn/docs/quick-start.html)；
2. 按上述要求修改配置；
3. 启动服务器；
4. 启动数据端。

## CDS 示例

- 注：日志在 nacos/logs/istio-main.log 查看

示例中注册的服务配置如下，[示例参考](https://github.com/nacos-group/nacos-examples/tree/master/nacos-spring-cloud-example/nacos-spring-cloud-discovery-example)。

```properties
server.port=8071
spring.application.name=service-provider
spring.cloud.nacos.discovery.namespace=e77d7925-1c90-4fa9-93cb-83153a099636
spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
```

![CDS](https://cdn.nlark.com/yuque/0/2022/png/28990648/1666247341241-4e9b2dde-55c7-43ae-af1e-dc081565ab72.png)

## EDS 示例

服务配置如上

![EDS](https://cdn.nlark.com/yuque/0/2022/png/28990648/1666247341176-fe312687-6488-41c2-bdd1-346d7a344bd2.png)

## 全量 CDS 示例

现注册两个服务，其配置分别如下：

```properties
#service-provider
server.port=8071
spring.application.name=service-provider
spring.cloud.nacos.discovery.namespace=e77d7925-1c90-4fa9-93cb-83153a099636
spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848

#service-consumer
server.port=8080
spring.application.name=service-consumer
spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
```

在控制台仅修改 service-consumer 服务配置，推送如下：

![Full CDS](https://cdn.nlark.com/yuque/0/2022/png/28990648/1666247341233-bc35de56-5653-4d5f-a510-819180dfe7f0.png)

## 增量 EDS 示例

在控制台仅修改 service-consumer 实例配置，推送如下：

![Incremental EDS](https://cdn.nlark.com/yuque/0/2022/png/28990648/1666247341234-aa195810-c76d-4ff5-977a-55626775e697.png)