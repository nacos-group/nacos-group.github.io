# Istio Guide

It supports CDS and EDS in xDS protocol, and realizes incremental push for EDS and MCP. Users can dock with Nacos using the xDS protocol-enabled data side.

## Configuration

For distribution packages:

modify `nacos.istio.mcp.server.enabled` in `nacos/conf/application.properties` to true.

For source code:

modify `nacos.istio.mcp.server.enabled`  in `nacos/distribution/conf/application.properties` to true.

For incremental MCP:

modify `nacos.istio.server.full ` in  `nacos/istio/misc/IstioConfig`  to false in addition to the above configuration.

## RUN

- Note: each instance of the same service should use the same protocol, EDS default to use incremental push.

1. Deploy Nacos, [ deployment reference ](https://nacos.io/zh-cn/docs/quick-start.html);

2. Modify the configuration in accordance with the above requirements;

3. Start the server;

4. Start the data side.

## CDS Example

- Note: The logs are viewed in nacos/logs/istio-main.log

The service configuration registered in the example is as follows, [ example reference ](https://github.com/nacos-group/nacos-examples/tree/master/nacos-spring-cloud-example/nacos-spring-cloud-discovery-example ).

```properties
server.port=8071
spring.application.name=service-provider
spring.cloud.nacos.discovery.namespace=e77d7925-1c90-4fa9-93cb-83153a099636
spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
```

![CDS](https://cdn.nlark.com/yuque/0/2022/png/28990648/1666247341241-4e9b2dde-55c7-43ae-af1e-dc081565ab72.png)

## EDS Example

The service is configured as above.

![EDS](https://cdn.nlark.com/yuque/0/2022/png/28990648/1666247341176-fe312687-6488-41c2-bdd1-346d7a344bd2.png)

## Full CDS Example

The services are registered with the following configurations:

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

In the console, modify only the service-consumer service configuration, push as follows:

![Full CDS](https://cdn.nlark.com/yuque/0/2022/png/28990648/1666247341233-bc35de56-5653-4d5f-a510-819180dfe7f0.png)

## Incremental EDS Example

In the console, modify only the service-consumer instance configuration, push as follows:

![Incremental EDS](https://cdn.nlark.com/yuque/0/2022/png/28990648/1666247341234-aa195810-c76d-4ff5-977a-55626775e697.png)