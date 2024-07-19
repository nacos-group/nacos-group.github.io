---
title: Nacos 融合Istio 下发xDS协议
keywords: [Nacos, Istio融合, xDS协议, 服务发现, Envoy]
description: 本文介绍了如何在Nacos中集成Istio以支持xDS协议，包括CDS与EDS服务，实现了对Envoy及其他xDS协议客户端的兼容。通过配置Nacos服务端与Envoy客户端，详细指导了如何启用增量推送及全量推送功能，以实现高效的服务发现与管理。
---
# Istio 指南

支持了 xDS 协议中的 CDS、EDS 服务，并为 EDS 以及 MCP 实现了增量推送。用户可以使用 Envoy 或其他支持 xDS 协议的客户端与 Nacos 进行对接，实现服务发现功能。

## 配置

### 服务端

对于发行包，修改 `nacos/conf/application.properties` 中的 `nacos.istio.mcp.server.enabled` 为 true；

对于源码，修改 `nacos/distribution/conf/application.properties` 中的 `nacos.istio.mcp.server.enabled` 为 true 。

若要使用 MCP 增量服务，除上述配置需修改外，还需修改 `nacos/istio/misc/IstioConfig` 中的 `nacos.istio.server.full` 为 false。

### 客户端

关于客户端，下面示例中使用的是 Envoy，可直接下载 Envoy 或创建镜像并将下述配置文件进行挂载即可。

**Config**：其中使用的端口号根据需求可自行更改

```yaml
node:
  cluster: test-cluster
  id: test-idn

admin:
  address:
    socket_address: { address: 0.0.0.0, port_value: 15000 }

dynamic_resources:
  ads_config:
    api_type: GRPC
    transport_api_version: V3
    grpc_services:
    - envoy_grpc:
        cluster_name: nacos_xds
  cds_config:
    ads: {}
  lds_config:
    path: /etc/envoy/lds.yaml
  # ads: {}

static_resources:
  clusters:
  - type: STATIC
    connect_timeout: 1s
    typed_extension_protocol_options:
      envoy.extensions.upstreams.http.v3.HttpProtocolOptions:
        "@type": type.googleapis.com/envoy.extensions.upstreams.http.v3.HttpProtocolOptions
        explicit_http_config:
          http2_protocol_options: {}
    name: nacos_xds 
    load_assignment:
      cluster_name: nacos_xds 
      endpoints:
      - lb_endpoints:
        - endpoint:
            address:
              socket_address:
                address: 127.0.0.1 
                port_value: 18848
```

**lds**：对于监听的服务获取 CDS 后会主动向服务端获取 EDS，监听的服务可自行更改

```yaml
resources:
- "@type": type.googleapis.com/envoy.config.listener.v3.Listener
  name: listener_0
  address:
    socket_address: { address: 0.0.0.0, port_value: 80 }
  # listener_filters:
  # - name: "envoy.filters.listener.tls_inspector"
  filter_chains:
  - filters:
    - name: envoy.filters.network.http_connection_manager
      typed_config:
        "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
        stat_prefix: ingress_http
        access_log:
        - name: envoy.access_loggers.stdout
          typed_config:
            "@type": type.googleapis.com/envoy.extensions.access_loggers.stream.v3.StdoutAccessLog
        codec_type: AUTO
        route_config:
          name: local_route
          virtual_hosts:
          - name: local_service
            domains: ["*"]
            routes:
            - match: { prefix: "/" }
              name: test
              route:
                cluster: outbound|8071||service-provider.DEFAULT-GROUP.e77d7925-1c90-4fa9-93cb-83153a099636.nacos
        http_filters:
        - name: envoy.filters.http.router
```

## 运行

注：同一服务下的各个实例使用的协议需一致，EDS 默认使用增量推送。

1. 部署 Nacos，[部署参考](https://nacos.io/docs/next/quickstart/quick-start/)；
2. 按上述要求修改配置；
3. 启动服务器，详细的启动命令可在上述部署参考中查看；

   ```bash
   bash startup.sh -m standalone -p embedded
   ```

4. 启动客户端。

   ```bash
   docker start envoy
   ```

## CDS 示例

注：日志在 nacos/logs/istio-main.log 查看

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
