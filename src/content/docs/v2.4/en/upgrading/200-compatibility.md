---
title: Nacos 2.0.0 compatibility
keywords: [Nacos,2.0.0]
description: Nacos 2.0.0 compatibility
sidebar:
    order: 1
---

> Document optimizing...

# Nacos2.0 code storage location

The Nacos code is currently stored in the feature_support_grpc_core branch. You need to switch to this branch and start again. The startup method is the same as Nacos 1.x, and Welcome to contribute.

# Nacos 2.0.0 compatibility

After discussion and development in the community, the core features of Nacos 2.0.0 based on the long connection have been developed completely.

2.0.0 has released and welcome to use.

2.0.0 support to smoothly upgrade and downgrade with Nacos1.X server, please refer to [Nacos2.0 upgrade document](./200-upgrading.md) for details.

## Benchmark for Nacos 2.0.0

Detail see: [Nacos2.0 Naming Benchmark](../guide/admin/nacos2-naming-benchmark.md) and [Nacos2.0 Config Benchmark](../guide/admin/nacos2-config-benchmark.md) .

## Deployment

Compared with 1.X, Nacos2.0 adds gRPC communication mode, so there are 2 ports need to be added. The new ports are generated with a certain offset based on the configured main port (server.port).

|port|offset from main port|description|
|--|--|--|
|9848|1000|The client gRPC requests the server port, which is used by the client to initiate a connection and request to the server|
|9849|1001|Server-side gRPC requests server-side port, used for synchronization between services, etc.|

**When using VIP/nginx requests, you need to configure it as TCP forwarding, instead of http2 forwarding, otherwise the connection will be disconnected by nginx.**

![nacos2_port_exposure.png](/img/nacos2_port_exposure.png) 


The client has the same offset logic. The users configures the main port (default 8848) as in the use of 1.X, and calculates the corresponding gRPC port (default 9848) through the same offset.

Therefore, if there is a port forwarding or firewall between the client and the server, the port forwarding configuration and firewall configuration need to be adjusted accordingly.

Other detail refer to [Deployment Guide](../guide/admin/deployment.md) and replace the version to 2.1.1.

## Compatibility

The server of Nacos2.0 is fully compatible with 1.X clients. The Nacos2.0 client is not compatible with the Nacos1.X server because it uses gRPC. Please do not use the client of version 2.0 or higher to connect to the Nacos1.X server.

## Features completion and adaptation for the old client

### Configuration Management

#### JAVA SDK 

- Completely compatible with all interfaces of 1.X client;
- Completely implement all interfaces of 2.X client.

#### Other SDK

- Completely compatible

#### openAPI

- Fully compatible with all openAPIs related to the configuration management.

### Service Discovery

#### JAVA SDK

- Completely compatible with all interfaces of 1.X client;
- Completely implement all interfaces of 2.X client.

#### Other SDK

- Completely compatible

#### openAPI

- Register instance (Supported)
- Deregister instance (Supported)
- Modify instance (Supported)
- Query instances (Supported)
- Query instance detail (Supported)
- Send instance beat (Supported)
- Create service (Supported)
- Delete service (Supported)
- Update service (Supported)
- Query service (Supported)
- Query service list (Supported)
- Query system switches (Supported)
- Update system switch (Supported)
- Query system metrics (Supported)
- Query server list (Supported)
- Query the leader of current cluster (Deprecated)
- Update instance health status (Supported)
- Batch update instance metadata(Supported)
- Batch delete instance metadata(Supported)

### Console

- Completely compatible with `Config Management`
- Completely compatible with `Authority Control`
- Completely compatible with `Namespace`
- Completely compatible with `Cluster Managerment`
- Completely compatible with `Service Managerment`

## Ecological compatibility

### Spring Cloud Alibaba

Use Nacos 2.0 connection features by specifying nacos-client version.

```
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        <version>2.1.5.RELEASE</version>
        <exclusions>
            <exclusion>
                <groupId>com.alibaba.nacos</groupId>
                <artifactId>nacos-client</artifactId>
            </exclusion>
        </exclusions>
    </dependency>
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
        <version>2.1.5.RELEASE</version>
        <exclusions>
            <exclusion>
                <groupId>com.alibaba.nacos</groupId>
                <artifactId>nacos-client</artifactId>
            </exclusion>
        </exclusions>
    </dependency>
    <dependency>
        <groupId>com.alibaba.nacos</groupId>
        <artifactId>nacos-client</artifactId>
        <version>2.1.1</version>
    </dependency>
```

### Dubbo

The Nacos2.0 version of the client is re-adapted to Dubbo2.7.X. And the Dubbo community is making changes to the new version, no longer relying on reflection, please see [Dubbo#7291](https://github.com/apache/dubbo/issues/7291).

### Nacos Spring Boot

Nacos spring boot had released a new version to adapt to the 2.0.0 client, please upgrade to newest version.

## Usage

### SDK and Console

The usage of Nacos 2.0.0 version is exactly the same as that of Nacos 1.X version. For the client interface, please refer to [JAVA SDK](../guide/user/sdk.md).

### Server

The usage of the Nacos 2.0.0 server is not much different from the old version. Here only to describe the new configuration parameters in the new version.

|Parameters|Default|Description|
|--|--|--|
|nacos.naming.clean.empty-service.interval|60000(ms)| The interval time of Nacos auto clean empty service. This parameter will replace `nacos.naming.empty-service.clean.period-time-ms` in old version.|
|nacos.naming.clean.empty-service.expired-time|60000(ms)| The expired time for Nacos judge whether an empty service is expired. When an empty service has no updated for setting time, it will be removed.|
|nacos.naming.clean.expired-metadata.interval|5000(ms)|The interval time of Nacos auto clean expired metadata.|
|nacos.naming.clean.expired-metadata.expired-time|60000(ms)| The expired time for Nacos judge whether a metadata is expired. When services or instances removed and after setting time, the metadata of removed services or instances will be deleted.|

## FAQ

### Whether support the old client?

Configuration Management can support all clients after 1.0, and Service Management can support all client after 1.2.

So recommending use Nacos client after 1.2.0.

But Nacos 1.X client can't use new connection features, so recommending to use 2.0.0 client strongly.

### Error `code:503,msg:server is DOWN now, please try again later!` during using. 

After version 1.4, Nacos use SOFA-Jraft to replace old raft implementation by nacos-self. Jraft will election leader with raft protocol and save the cluster metadata. If cluster restart with ip changed, it might cause Jraft can election leader successfully so that nacos can't start up.

The solution is removed the `data` directory under nacos directory and restart.

Or use `-Dnacos.server.ip=${domain}` jvm parameters to start nacos and set domain list in `nacos/conf/cluster.conf` to avoid the ip change effect.

### `com.alibaba.nacos.consistency.entity` can't be found in source codes

This package will be auto-generated by `protobuf`, so if you want to read source code or do some develop, you can use `mvn compile` to generate them. If you are using IDEA, you can also use IDEA's protobuf plugin.

### Error `Connection is unregistered.` or `Client not connected, current status:STARTING` during startup client.

The reason is that the client gRPC cannot establish a connection with the server. Please use `telnet ${nacos.server.address}:${nacos.server.grpc.port}` to test the network and to check the server port is correct.

If there is no problem with the server, check whether the configuration is wrong. The configured ports of the server and client should be the same.

If there is no problem with the configuration, check whether there is a firewall or VIP port forwarding problem. The gRPC ports of Nacos2.0 are calculated by the offset of the main port, so the port forwarding also needs to meet the offset.

### Nacos2.0 adds ports 9848 and 9849 for GRPC communication. Do I need to configure additional settings in application.properties?

No, these two ports are calculated by 8848 + 1000 and 8848 + 1001 in Nacos2.0 internally. No additional configuration by the user is required in the configuration file. But if you are using docker or there is a port forwarding method to start, you need to configure these two ports.

###I want to start nacos2.0, and uses nginx proxy, how to deal with the port 9848, should it be exposed through nginx?

If there is a firewall or nginx port forwarding problem, you need to configure the corresponding port exposure. For example, in nginx, on the basis of the already exposed 8848(x), an additional 9848(x+1000) needs to be exposed.

### To be added...
