---
title: Nacos 2.0.0 兼容性文档
keywords: [Nacos,2.0.0]
description: Nacos 2.0.0 兼容性文档
sidebar:
    order: 1
---

> 文档优化中......

# Nacos2.0代码存放位置

Nacos代码当前保存在develop分支中，启动方式与Nacos 1.x相同（当前位于v1.x-develop），欢迎贡献。

# Nacos 2.0.0 兼容性文档

经过社区的讨论和开发， Nacos 基于长连接的2.0.0版本的核心功能已开发完成，目前2.0.0正式版本已发布，欢迎大家使用。

2.0.0支持Nacos1.X服务端的平滑升降级的能力，详情请查看[Nacos2.0升级文档](https://nacos.io/docs/v2/upgrading/version2-upgrading/) 。

## Nacos 2.0.0版本压测

详情见：[Nacos2.0服务发现模块压测报告](../guide/admin/nacos2-naming-benchmark.md) 以及 [Nacos2.0配置模块压测报告](../guide/admin/nacos2-config-benchmark.md) 。

大规模压测报告将在近期放出。

## 新版本部署

Nacos2.0版本相比1.X新增了gRPC的通信方式，因此需要增加2个端口。新增端口是在配置的主端口(server.port)基础上，进行一定偏移量自动生成。

|端口|与主端口的偏移量|描述|
|--|--|--|
|9848|1000|客户端gRPC请求服务端端口，用于客户端向服务端发起连接和请求|
|9849|1001|服务端gRPC请求服务端端口，用于服务间同步等|
|7848|-1000|Jraft请求服务端端口，用于处理服务端间的Raft相关请求|

**使用VIP/nginx请求时，需要配置成TCP转发，不能配置http2转发，否则连接会被nginx断开。**
**9849和7848端口为服务端之间的通信端口，请勿暴露到外部网络环境和客户端测。**

![nacos2_port_exposure.png](/img/nacos2_port_exposure.png) 

客户端拥有相同的计算逻辑，用户如同1.X的使用方式，配置主端口(默认8848)，通过相同的偏移量，计算对应gRPC端口(默认9848)。

因此如果客户端和服务端之前存在端口转发，或防火墙时，需要对端口转发配置和防火墙配置做相应的调整。

其余部署参考[Nacos部署手册](../guide/admin/deployment.md) ,将版本相关替换成2.1.1。

## 兼容性

Nacos2.0的服务端完全兼容1.X客户端。Nacos2.0客户端由于使用了gRPC，无法兼容Nacos1.X服务端，请勿使用2.0以上版本客户端连接Nacos1.X服务端。

## 功能完成度及旧版本客户端适配情况：

### 配置中心

#### JAVA SDK 

- 完全兼容1.X客户端所有API接口方法；
- 完全实现2.0客户端所有API接口方法。

#### 其他语言 SDK

- 完全兼容

#### openAPI

- 完全兼容所有配置中心相关openAPI。

### 服务发现

#### JAVA SDK

- 完全兼容1.X客户端所有API接口方法；
- 完全兼容2.0客户端所有API接口方法；

#### 其他语言 SDK

- 完全兼容所有服务发现相关openAPI。

#### openAPI

- 注册实例（支持）
- 注销实例（支持）
- 修改实例（支持）
- 查询实例列表（支持）
- 查询实例详情（支持）
- 发送实例心跳（支持）
- 创建服务（支持）
- 删除服务（支持）
- 修改服务（支持）
- 查询服务（支持）
- 查询服务列表（支持）
- 查询系统开关（支持）
- 修改系统开关（支持）
- 查看系统当前数据指标（支持）
- 查看当前集群Server列表（支持）
- 查看当前集群leader（将废弃）
- 更新实例的健康状态（支持）
- 批量更新实例元数据(支持)
- 批量删除实例元数据(支持)

### 控制台

- 完全兼容配置中心相关页面及功能
- 完全兼容权限控制相关页面及功能
- 完全兼容命名空间相关页面及功能
- 完全兼容集群管理相关页面及功能
- 完全兼容服务发现相关页面及功能

## 生态兼容情况

### Spring Cloud Alibaba

可通过指定nacos-client方式，提前使用Nacos2.0长连接功能

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

Nacos2.0版本客户端重新适配了Dubbo2.7.X。并且Dubbo社区正在对新版本进行修改，不再强依赖反射，详情请看 [Dubbo#7291](https://github.com/apache/dubbo/issues/7291)

### Nacos Spring Boot

Nacos spring boot 已发布新版本适配2.0客户端。请升级至最新版本。

## 使用方式

### SDK客户端、控制台

Nacos 2.0版本使用方式和Nacos1.X版本使用完全一致。客户端接口请参考[SDK文档](../guide/user/sdk.md)。

### 服务端

Nacos 2.0服务端的使用也和旧版本没有太大区别，这里对新版本中新增的数个配置参数进行说明

|参数|默认值|描述|
|--|--|--|
|nacos.naming.clean.empty-service.interval|60000(单位毫秒)|Nacos自动清理空服务的工作间隔，将替代旧版本中的`nacos.naming.empty-service.clean.period-time-ms`参数|
|nacos.naming.clean.empty-service.expired-time|60000(单位毫秒)|Nacos判断可清理的空服务的过期时间，当服务没有发布的实例，且超过该过期时间未发生更新后，将被判定为过期空服务而移除|
|nacos.naming.clean.expired-metadata.interval|5000(单位毫秒)|Nacos自动清理过期元数据的工作间隔|
|nacos.naming.clean.expired-metadata.expired-time|60000(单位毫秒)|Nacos自动清理过期服务的过期时间，当服务或实例本身被移除超过该设定时间后，元数据信息将会被移除|

## FAQ

### 能否支持Nacos旧版本客户端？

配置中心兼容支持Nacos1.0起的所有版本客户端，服务发现兼容Nacos1.2起所有版本客户端。
因此建议使用Nacos1.2.0之后版本客户端。
但nacos1.X的客户端不具有长连接能力，因此仍然建议使用Nacos2.0客户端。

### 启动后，调用openAPI 报错 code:503,msg:server is DOWN now, please try again later! 

Nacos在1.4版本后使用Jraft替换了自研的Raft实现，Jraft的选主比原先自研的Raft更加严格，会记录之前启动时的ip或host。因此重启时如果ip变动了，有可能造成选主失败，从而导致nacos无法正确提供服务。
解决方式为删除nacos目录下的data，再启动。

或者使用`-Dnacos.server.ip=${domain}`,然后将nacos/conf的cluster.conf配置domain列表，避免重启时ip变动导致的raft选主问题。

### 找不到符号`com.alibaba.nacos.consistency.entity`

这个包目录是由`protobuf`在编译时自动生成，您可以通过`mvn compile`来自动生成他们。如果您使用的是IDEA，也可以使用IDEA的protobuf插件。

### 启动时报错`Connection is unregistered.`或`Client not connected,current status:STARTING`.

原因是客户端gRPC无法和服务端创建连接，请先使用`telnet ${nacos.server.address}:${nacos.server.grpc.port}`进行测试，查看网络是否畅通，服务端端口是否已经正确监听。

若服务端没有问题，查看配置是否有误，服务端和客户端的所配置的端口应一致。

若配置也没有问题，查看是否有防火墙或VIP端口转发问题，Nacos2.0的gRPC端口均通过主端口的偏移量计算产生，因此端口转发也需要满足该偏移量。

### Nacos2.0增加了9848，9849端口来进行GRPC通信，我需要在application.properties中额外配置吗？

不需要，这两个端口在Nacos2.0内部是通过8848+1000以及8848+1001这种偏移量方式计算出来的，不需要用户额外在配置文件中配置。但如果使用的是docker或存在端口转发方式启动，需要把这两个端口进行配置。

### 启动nacos2.0时希望用nginx 代理，9848这个端口怎样处理，要通过nginx暴露出来么？以及docker是否需要映射？ 

如果存在防火墙或者nginx端口转发问题，需要进行相应的端口暴露配置。如在nginx中，在已经暴露8848(x)的基础上，需要额外暴露9848（x+1000)。

### 待补充...
