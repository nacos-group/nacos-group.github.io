---
title: Go SDK Usage
keywords: [Go,SDK,Usage]
description: This document introduces the usage of Nacos's Go SDK (nacos-sdk-go)
sidebar:
  order: 5
---

# Go SDK Usage


## Usage Limits
Go>=v1.15

Nacos>2.x

## Installation
Install the SDK with `go get`:
```sh
$ go get -u github.com/nacos-group/nacos-sdk-go/v2
```
## Quick Start
* Initialize the client configuration `ClientConfig`

```go
constant.ClientConfig{
  TimeoutMs            uint64 // Timeout for requests to Nacos Server. The default value is 10000 ms.
  NamespaceId          string // Nacos namespace ID.
  Endpoint             string // Required when using an address server. https://help.aliyun.com/document_detail/130146.html
  RegionId             string // Nacos and KMS region ID, used for config center authentication.
  AccessKey            string // Nacos and KMS AccessKey, used for config center authentication.
  SecretKey            string // Nacos and KMS SecretKey, used for config center authentication.
  OpenKMS              bool   // Whether to enable KMS. It is disabled by default. See https://help.aliyun.com/product/28933.html
                              // DataId must also use the "cipher-" prefix to enable encryption and decryption logic.
  CacheDir             string // Directory for caching service information. The default value is the current working directory.
  UpdateThreadNum      int    // Concurrency for listening to service changes. The default value is 20.
  NotLoadCacheAtStart  bool   // Whether not to load service information cached in CacheDir during startup.
  UpdateCacheWhenEmpty bool   // Whether not to update the cache when the service returns an empty instance list, used for empty-push protection.
  Username             string // Username for Nacos Server API authentication.
  Password             string // Password for Nacos Server API authentication.
  LogDir               string // Log storage path.
  LogLevel             string // Default log level. Valid values: debug, info, warn, error. The default value is info.
  LogSampling          *ClientLogSamplingConfig // the sampling config of log
  LogRollingConfig     *ClientLogRollingConfig  // the log rolling config
}
```

* ServerConfig

```go
constant.ServerConfig{
  ContextPath string // Nacos ContextPath. The default value is /nacos. It is not required in 2.0.
  IpAddr      string // Nacos service address.
  Port        uint64 // Nacos service port.
  Scheme      string // Nacos service address scheme. The default value is http. It is not required in 2.0.
  GrpcPort    uint64 // Nacos gRPC service port. The default value is service port + 1000. It is optional.
}
```

<b>Note: You can configure multiple ServerConfig entries. The client sends polling requests to these servers.</b>

### Create client

```go
// Create clientConfig.
clientConfig := constant.ClientConfig{
  NamespaceId:         "e525eafa-f7d7-4029-83d9-008937f9d468", // To support multiple namespaces, create multiple clients with different NamespaceId values. When the namespace is public, set this value to an empty string.
  TimeoutMs:           5000,
  NotLoadCacheAtStart: true,
  LogDir:              "/tmp/nacos/log",
  CacheDir:            "/tmp/nacos/cache",
  LogLevel:            "debug",
}

// Another way to create clientConfig.
clientConfig := *constant.NewClientConfig(
    constant.WithNamespaceId("e525eafa-f7d7-4029-83d9-008937f9d468"), // When the namespace is public, set this value to an empty string.
    constant.WithTimeoutMs(5000),
    constant.WithNotLoadCacheAtStart(true),
    constant.WithLogDir("/tmp/nacos/log"),
    constant.WithCacheDir("/tmp/nacos/cache"),
    constant.WithLogLevel("debug"),
)

// At least one ServerConfig is required.
serverConfigs := []constant.ServerConfig{
    {
        IpAddr:      "console1.nacos.io",
        ContextPath: "/nacos",
        Port:        80,
        Scheme:      "http",
    },
    {
      IpAddr:      "console2.nacos.io",
      ContextPath: "/nacos",
      Port:        80,
        Scheme:      "http",
    },
}

// Another way to create serverConfig.
serverConfigs := []constant.ServerConfig{
    *constant.NewServerConfig(
        "console1.nacos.io",
        80,
        constant.WithScheme("http"),
        constant.WithContextPath("/nacos"),
    ),
    *constant.NewServerConfig(
        "console2.nacos.io",
        80,
        constant.WithScheme("http"),
        constant.WithContextPath("/nacos"),
    ),
}

// Create a service discovery client.
_, _ := clients.CreateNamingClient(map[string]interface{}{
  "serverConfigs": serverConfigs,
  "clientConfig":  clientConfig,
})

// Create a dynamic configuration client.
_, _ := clients.CreateConfigClient(map[string]interface{}{
  "serverConfigs": serverConfigs,
  "clientConfig":  clientConfig,
})

// Another way to create a service discovery client (recommended).
namingClient, err := clients.NewNamingClient(
    vo.NacosClientParam{
        ClientConfig:  &clientConfig,
        ServerConfigs: serverConfigs,
    },
)

// Another way to create a dynamic configuration client (recommended).
configClient, err := clients.NewConfigClient(
    vo.NacosClientParam{
        ClientConfig:  &clientConfig,
        ServerConfigs: serverConfigs,
    },
)
```

### Create client for Nacos
https://help.aliyun.com/document_detail/130146.html

```go
cc := constant.ClientConfig{
  Endpoint:    "nacos.aliyun.com:8080",
  NamespaceId: "e525eafa-f7d7-4029-83d9-008937f9d468",
  RegionId:    "cn-shanghai",
  AccessKey:   "LTAI4G8KxxxxxxxxxxxxxbwZLBr",
  SecretKey:   "n5jTL9YxxxxxxxxxxxxaxmPLZV9",
  OpenKMS:     true,
  TimeoutMs:   5000,
  LogLevel:    "debug",
}

// a more graceful way to create config client
client, err := clients.NewConfigClient(
  vo.NacosClientParam{
    ClientConfig: &cc,
  },
)
```


### Service Discovery

* Register instance: RegisterInstance

```go

success, err := namingClient.RegisterInstance(vo.RegisterInstanceParam{
    Ip:          "10.0.0.11",
    Port:        8848,
    ServiceName: "demo.go",
    Weight:      10,
    Enable:      true,
    Healthy:     true,
    Ephemeral:   true,
    Metadata:    map[string]string{"idc":"shanghai"},
    ClusterName: "cluster-a", // Default value: DEFAULT
    GroupName:   "group-a",   // Default value: DEFAULT_GROUP
})

```

* Deregister instance: DeregisterInstance

```go

success, err := namingClient.DeregisterInstance(vo.DeregisterInstanceParam{
    Ip:          "10.0.0.11",
    Port:        8848,
    ServiceName: "demo.go",
    Ephemeral:   true,
    Cluster:     "cluster-a", // Default value: DEFAULT
    GroupName:   "group-a",   // Default value: DEFAULT_GROUP
})

```

* Get service information: GetService

```go

services, err := namingClient.GetService(vo.GetServiceParam{
    ServiceName: "demo.go",
    Clusters:    []string{"cluster-a"}, // Default value: DEFAULT
    GroupName:   "group-a",             // Default value: DEFAULT_GROUP
})

```

* Get all instances: SelectAllInstances

```go
// SelectAllInstance can return all instances, including instances with healthy=false, enable=false, or weight<=0.
instances, err := namingClient.SelectAllInstances(vo.SelectAllInstancesParam{
    ServiceName: "demo.go",
    GroupName:   "group-a",             // Default value: DEFAULT_GROUP
    Clusters:    []string{"cluster-a"}, // Default value: DEFAULT
})

```

* Get instances: SelectInstances

```go
// SelectInstances returns only instances that meet these conditions: healthy=${HealthyOnly}, enable=true, and weight>0.
instances, err := namingClient.SelectInstances(vo.SelectInstancesParam{
    ServiceName: "demo.go",
    GroupName:   "group-a",             // Default value: DEFAULT_GROUP
    Clusters:    []string{"cluster-a"}, // Default value: DEFAULT
    HealthyOnly: true,
})

```

* Get one healthy instance (weighted random polling): SelectOneHealthyInstance

```go
// SelectOneHealthyInstance returns one healthy instance based on the weighted random polling load-balancing policy.
// The instance must meet these conditions: health=true, enable=true, and weight>0.
instance, err := namingClient.SelectOneHealthyInstance(vo.SelectOneHealthInstanceParam{
    ServiceName: "demo.go",
    GroupName:   "group-a",             // Default value: DEFAULT_GROUP
    Clusters:    []string{"cluster-a"}, // Default value: DEFAULT
})

```

* Listen to service changes: Subscribe

```go

// Subscribe key=serviceName+groupName+cluster
// Note: Multiple SubscribeCallbacks can be added for the same key.
err := namingClient.Subscribe(vo.SubscribeParam{
    ServiceName: "demo.go",
    GroupName:   "group-a",             // Default value: DEFAULT_GROUP
    Clusters:    []string{"cluster-a"}, // Default value: DEFAULT
    SubscribeCallback: func(services []model.Instance, err error) {
        log.Printf("\n\n callback return services:%s \n\n", utils.ToJsonString(services))
    },
})

```

* Unsubscribe from service changes: Unsubscribe

```go

err := namingClient.Unsubscribe(vo.SubscribeParam{
    ServiceName: "demo.go",
    GroupName:   "group-a",             // Default value: DEFAULT_GROUP
    Clusters:    []string{"cluster-a"}, // Default value: DEFAULT
    SubscribeCallback: func(services []model.Instance, err error) {
        log.Printf("\n\n callback return services:%s \n\n", utils.ToJsonString(services))
    },
})

```

* Get service name list: GetAllServicesInfo
```go

serviceInfos, err := namingClient.GetAllServicesInfo(vo.GetAllServiceInfoParam{
    NameSpace: "0e83cc81-9d8c-4bb8-a28a-ff703187543f",
    PageNo:   1,
    PageSize: 10,
  }),

```

### Dynamic Configuration

* Publish configuration: PublishConfig

```go

success, err := configClient.PublishConfig(vo.ConfigParam{
    DataId:  "dataId",
    Group:   "group",
    Content: "hello world!222222"})

```

* Delete configuration: DeleteConfig

```go

success, err = configClient.DeleteConfig(vo.ConfigParam{
    DataId: "dataId",
    Group:  "group"})

```

* Get configuration: GetConfig

```go

content, err := configClient.GetConfig(vo.ConfigParam{
    DataId: "dataId",
    Group:  "group"})

```

* Listen to configuration changes: ListenConfig

```go

err := configClient.ListenConfig(vo.ConfigParam{
    DataId: "dataId",
    Group:  "group",
    OnChange: func(namespace, group, dataId, data string) {
        fmt.Println("group:" + group + ", dataId:" + dataId + ", data:" + data)
  },
})

```
* Cancel configuration listener: CancelListenConfig

```go

err := configClient.CancelListenConfig(vo.ConfigParam{
    DataId: "dataId",
    Group:  "group",
})

```

* Search configuration: SearchConfig
```go
configPage,err := configClient.SearchConfig(vo.SearchConfigParam{
    Search:   "blur",
    DataId:   "",
    Group:    "",
    PageNo:   1,
    PageSize: 10,
})
```
## Examples
You can learn how to use the Nacos Go client from the examples.
* [Dynamic configuration example](./example/config)
* [Service discovery example](./example/service)

## Documentation
For Nacos OpenAPI information, see [Nacos OpenAPI website](https://nacos.io/en-us/docs/open-api.html).

To learn more about Nacos, see [Nacos website](https://nacos.io/en-us/docs/what-is-nacos.html).

## Contributing
We welcome contributions to `nacos-sdk-go`. Before contributing, read [CONTRIBUTING.md](./CONTRIBUTING.md).

## Contact Us
* Join the `nacos-sdk-go` DingTalk group (23191211).
* [Gitter](https://gitter.im/alibaba/nacos): Nacos instant messaging tool.
* [Twitter](https://twitter.com/nacos2): Follow the latest Nacos updates on Twitter.
* [Weibo](https://weibo.com/u/6574374908): Follow the latest Nacos updates on Weibo.
* [Nacos SegmentFault](https://segmentfault.com/t/nacos): Get the latest updates and help on SegmentFault.
* Email Group:
     * users-nacos@googlegroups.com: Nacos user discussion group.
     * dev-nacos@googlegroups.com: Nacos developer discussion group (APIs, feature design, etc).
     * commits-nacos@googlegroups.com: Nacos commit notifications.
