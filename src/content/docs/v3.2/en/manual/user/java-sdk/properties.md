---
title: Java SDK Properties
keywords: [ Java,SDK,Properties ]
description: This document introduces the list of configuration parameters currently supported by the Nacos Java SDK (nacos-client), and provides a brief explanation of the principles behind how the Nacos Java SDK reads these configuration parameters.
sidebar:
  order: 3
---

# Java SDK Properties

## 1. How the Java SDK Reads Configuration

### 1.1. Introduction

The Nacos Java SDK uses `NacosClientProperties` to manage client configuration items in a unified way. Its role is similar to `Spring Environment`.

### 1.2. Features

- Unified management of `Properties`, JVM parameters, environment variables, and default values.
- Priority-based lookup. The default lookup order is `properties -> JVM parameters -> environment variables -> default values`. You can adjust the priority order. By default, `properties` has the highest priority.
- Configuration isolation. Except for global configuration sources, each `NacosClientProperties` object is isolated from the others.

### 1.3. Usage

#### 1.3.1. Priority

The default priority is `properties`. You can adjust it in either of the following ways:

```
- (JVM parameter) -Dnacos.env.first=PROPERTIES|JVM|ENV
- (environment variable) NACOS_ENV_FIRST=PROPERTIES|JVM|ENV
```

The default behavior is equivalent to `-Dnacos.env.first=PROPERTIES`.

If both methods are configured, the client first reads the priority setting from the JVM parameter. If the JVM parameter is not found, it reads the setting from the environment variable. If neither method specifies a priority, the default priority is `properties`.

Default priority:
![default_order.png](/img/nacos_client_properties_default_order.png)

Priority: PROPERTIES
![default_order.png](/img/nacos_client_properties_default_order.png)

Priority: JVM
![jvm_order.png](/img/nacos_client_properties_jvm_order.png)

Priority: ENV
![jvm_order.png](/img/nacos_client_properties_env_order.png)

#### 1.3.2. Lookup

`NacosClientProperties` searches configuration by the specified priority. Using the default priority (`PROPERTIES`) as an example, if you want to obtain the value of a key named `key1`, the lookup order is as follows:

![search_order.png](/img/nacos_client_properties_search_order.png)

`NacosClientProperties` searches in the order shown above until it finds a value.

#### 1.3.3. Configuration Isolation

To support scenarios with multiple registries or multiple config centers, `NacosClientProperties` introduces configuration isolation. `NacosClientProperties` has four value sources: user-defined properties, JVM parameters, environment variables, and default values. Among them, `JVM parameters`, `environment variables`, and `default values` are shared globally and cannot be isolated. Therefore, only the user-defined `Properties` object can be isolated. Each `NacosClientProperties` object contains a different `Properties` object, so configurations do not affect each other.

> Note: Globally shared configuration, including JVM parameters, environment variables, and default values, cannot be changed after initialization. The `setProperty` method cannot modify them. `setProperty` only modifies values in the `Properties` object contained by the current `NacosClientProperties` object.

#### 1.3.4. Configuration Derivation

Configuration derivation is introduced on top of configuration isolation so that configuration can be inherited. All `NacosClientProperties` objects are derived from the `NacosClientProperties.PROTOTYPE` object. There is no other way to create a `NacosClientProperties` object.

```java
// global properties
NacosClientProperties.PROTOTYPE.setProperty("global-key1","global-value1");

// properties1 
NacosClientProperties properties1 = NacosClientProperties.PROTOTYPE.derive();
properties1.

setProperty("properties1-key1","properties1-value1");

// properties2
NacosClientProperties properties2 = properties1.derive();
properties2.

setProperty("properties2-key1","properties2-value1");
```

The preceding code is shown in the following diagram:
![derive.png](/img/nacos_client_properties_derive.png)

How does lookup work in this case? Using the default priority (`PROPERTIES`) as an example:

```java
// value == global-value1
String value = properties2.getProperty("global-key1");

```

![derive_search.png](/img/nacos_client_properties_derive_search.png)

#### 1.3.5. API

| Method        | Input                         | Return                | Description                                                                                                  |
|---------------|-------------------------------|-----------------------|-------------------------------------------------------------------------------------|
| getProperty   | key: String                   | String                | Gets the value for the specified key. Returns `null` if the key does not exist.                               |
| getProperty   | key: String, default: String  | String                | Gets the value for the specified key. Returns the default value if the key does not exist.                    |
| getBoolean    | key: String                   | Boolean               | Gets the Boolean value for the specified key. Returns `null` if the key does not exist.                      |
| getBoolean    | key: String, default: Boolean | Boolean               | Gets the Boolean value for the specified key. Returns the default value if the key does not exist.            |
| getInteger    | key: String                   | Integer               | Gets the Integer value for the specified key. Returns `null` if the key does not exist.                      |
| getInteger    | key: String, default: Integer | Integer               | Gets the Integer value for the specified key. Returns the default value if the key does not exist.            |
| getLong       | key: String                   | Long                  | Gets the Long value for the specified key. Returns `null` if the key does not exist.                         |
| getLong       | key: String, default: Long    | Long                  | Gets the Long value for the specified key. Returns the default value if the key does not exist.               |
| setProperty   | key: String, value: String    | void                  | Sets the key-value pair in the `NacosClientProperties` object. Existing values are overwritten.               |
| addProperties | properties: Properties        | void                  | Adds `Properties` to the `NacosClientProperties` object. Existing values are overwritten.                     |
| containsKey   | key: String                   | boolean               | Checks whether the specified key exists. Returns `true` if it exists; otherwise returns `false`.              |
| asProperties  | void                          | Properties            | Converts the `NacosClientProperties` object to a `Properties` object.                                        |
| derive        | void                          | NacosClientProperties | Creates a `NacosClientProperties` object that inherits all configuration from its parent and contains empty `Properties`. |
| derive        | Properties                    | NacosClientProperties | Creates a `NacosClientProperties` object that inherits all configuration from its parent and contains the specified `Properties`. |

## 2. Java SDK Configuration Parameter List

### 2.1. Common Parameters

Common parameters take effect when initializing both the registry `NamingService` and the config center `ConfigServie`:

| Parameter                       | PropertyKeyConst Key              | Meaning                                                                                                      | Optional Values                                    | Default Value            |
|--------------------------------|-----------------------------------|--------------------------------------------------------------------------------------------------------------|---------------------------------------------------|--------------------------|
| serverAddr                     | SERVER_ADDR                       | The address list of Nacos Server, which specifies the Nacos Server accessed by this Java SDK.                | Any domain name or IP address. Separate multiple addresses with commas (`,`). All addresses must belong to the same Nacos Server cluster. | None |
| contextPath                    | CONTEXT_PATH                      | The context path of the Nacos Server OpenAPI, corresponding to the Nacos Server `server.servlet.context-path` parameter. | Any URL-supported path | nacos |
| endpoint                       | ENDPOINT                          | The endpoint used to obtain Nacos Server addresses. The Java SDK queries the actual domain names or IP addresses of Nacos Server through this endpoint. | Any domain name or IP address | None |
| endpointPort                   | ENDPOINT_PORT                     | The port of the endpoint used to obtain Nacos Server addresses. Used together with `endpoint`, for example, `${endpoint}:${endpointPort}/nacos/serverlist`. | 0~65535 | 8080 |
| endpointContextPath            | ENDPOINT_CONTEXT_PATH             | The context path of the endpoint used to obtain Nacos Server addresses. Used together with `endpoint`, for example, `${endpoint}:${endpointPort}/${endpointContextPath}/serverlist`. | Any URL-supported path | nacos |
| endPointClusterName            | ENDPOINT_CLUSTER_NAME             | The cluster name of Nacos Server in the endpoint. Used together with `endpoint`, for example, `${endpoint}:${endpointPort}/${endpointContextPath}/${endPointClusterName}`. | Any URL-supported path | serverlist |
| endpointQueryParams            | ENDPOINT_QUERY_PARAMS             | Request parameters for the endpoint used to obtain Nacos Server addresses. They are used to extend custom logic in the endpoint service and use the `key=value` format. | Any URL parameter in `key=value` format | None |
| endpointRefreshIntervalSeconds | ENDPOINT_REFRESH_INTERVAL_SECONDS | The interval at which Nacos Server periodically obtains the address list again from the endpoint, in seconds. | Any positive integer | 30 |
| namespace                      | NAMESPACE                         | The namespace ID to which this Java SDK belongs. After it is set, the SDK can access only resources (configuration or services) in this namespace. | Namespace ID | Empty string `` |
| username                       | USERNAME                          | The username used to access Nacos Server after authentication is enabled.                                    | Any string | None |
| password                       | PASSWORD                          | The password that corresponds to the username used to access Nacos Server after authentication is enabled.   | Any string | None |
| accessKey                      | ACCESS_KEY                        | The access key required when Alibaba Cloud RAM authentication is used.                                      | Any string | None |
| secretKey                      | SECRET_KEY                        | The secret key required when Alibaba Cloud RAM authentication is used.                                      | Any string | None |
| ramRoleName                    | RAM_ROLE_NAME                     | The RAM role name required when Alibaba Cloud RAM authentication is used.                                  | Any string | None |
| signatureRegionId              | SIGNATURE_REGION_ID               | The signature region ID required when Alibaba Cloud RAM authentication is used.                            | Any string | None |
| logAllProperties               | LOG_ALL_PROPERTIES                | Whether to print all parameters when the Java SDK starts, including custom properties, JVM parameters, and environment variables. It is mainly used for debugging and troubleshooting. | boolean | false |
| ~~clusterName~~                | ~~CLUSTER_NAME~~                  | Deprecated because it can be confused with the service instance `ClusterName`. Use `endPointClusterName` instead. | Any URL-supported path | serverlist |
| ~~isAdaptClusterNameUsage~~    | ~~IS_ADAPT_CLUSTER_NAME_USAGE~~   | Whether to support setting `endPointClusterName` through `clusterName` for better upgrade compatibility.    | boolean | false |
| ~~serverName~~                 | ~~SERVER_NAME~~                   | The name of this Java SDK. It is currently used only when accessing the endpoint. This parameter will be deprecated because it is rarely used and the name is unreasonable. | Any string | Automatically concatenated from `serverAddr` or `endpoint` |

### 2.2. Config Center Parameters

The following parameters take effect only when initializing the config center `ConfigServie`:

| Parameter                   | PropertyKeyConst Key           | Meaning                                                            | Optional Values | Default Value                                  |
|----------------------------|--------------------------------|-------------------------------------------------------------------|------------|------------------------------------------------|
| clientWorkerMaxThreadCount | CLIENT_WORKER_MAX_THREAD_COUNT | Automatically calculates the maximum thread pool size used by the config center `ConfigService` for configuration listeners. | int value >= 2 | Number of CPUs |
| clientWorkerThreadCount    | CLIENT_WORKER_THREAD_COUNT     | Specifies the thread pool size used by the config center `ConfigService` for configuration listeners. This has a higher priority than `clientWorkerMaxThreadCount`. | int value >= 2 | Max(2, Min(clientWorkerMaxThreadCount, number of CPUs)) |
| enableRemoteSyncConfig     | ENABLE_REMOTE_SYNC_CONFIG      | Immediately synchronizes and notifies listened configurations with the server when the config center `ConfigService` listens to configurations. Enabling this may slow down listener startup. | boolean | false |
| configRequestTimeout       | CONFIG_REQUEST_TIMEOUT         | Specifies the RPC request timeout for the config center `ConfigService`. It is disabled by default and uses the common timeout configured in `RpcClientConfig`. | long value >= 0 | -1 |
| ~~configRetryTime~~        | ~~CONFIG_RETRY_TIME~~          | Deprecated. The long-polling retry interval used by the old config center implementation. | Any int | 2000 |
| ~~configLongPollTimeout~~  | ~~CONFIG_LONG_POLL_TIMEOUT~~   | Deprecated. The long-polling timeout used by the old config center implementation. | Any int | 30000 |
| ~~maxRetry~~               | ~~MAX_RETRY~~                  | Deprecated. The maximum retry count used by the old config center implementation. | Any int | 3 |

### 2.3. Registry Parameters

The following parameters take effect only when initializing the registry `NamingServie`:

| Parameter                         | PropertyKeyConst Key                 | Meaning                                                           | Optional Values | Default Value                                  |
|----------------------------------|--------------------------------------|-------------------------------------------------------------------|------------|-------------------------------------------------|
| namingLoadCacheAtStart           | NAMING_LOAD_CACHE_AT_START           | Whether the registry `NamingService` reads the local disk cache to initialize data during startup. | boolean | false |
| namingCacheRegistryDir           | NAMING_CACHE_REGISTRY_DIR            | The extension of the local disk cache directory name for the registry `NamingService`. It is used to distinguish multiple `NamingService` instances on the same node. | Any string | Empty string |
| namingAsyncQuerySubscribeService | NAMING_ASYNC_QUERY_SUBSCRIBE_SERVICE | Whether the registry `NamingService` enables asynchronous query subscription as a fallback when the data push link is abnormal. | boolean | false |
| namingPollingMaxThreadCount      | NAMING_POLLING_MAX_THREAD_COUNT      | Automatically calculates the maximum number of threads used by the registry `NamingService` for asynchronous query subscription. | int value >= 1 | Number of CPUs |
| namingPollingThreadCount         | NAMING_POLLING_THREAD_COUNT          | Specifies the number of threads used by the registry `NamingService` for asynchronous query subscription. This has a higher priority than `namingPollingMaxThreadCount`. | int value >= 1 | Max(2, Min(namingPollingMaxThreadCount, number of CPUs)) |
| namingRequestDomainMaxRetryCount | NAMING_REQUEST_DOMAIN_RETRY_COUNT    | The maximum retry count after a request to Nacos Server fails when the registry `NamingService` is initialized with only one address in `serverAddr`. | Any int value | 3 |
| namingPushEmptyProtection        | NAMING_PUSH_EMPTY_PROTECTION         | Whether the registry `NamingService` enables empty push protection. When the subscribed service address list is empty, the client ignores the address list. | boolean | false |
| redoDelayTime                    | REDO_DELAY_TIME                      | The interval, in milliseconds, at which the registry `NamingService` checks and performs redo operations after the connection to Nacos Server is disconnected. | Any long value | 3000 |
| redoDelayThreadCount             | REDO_DELAY_THREAD_COUNT              | The number of threads used by the registry `NamingService` to perform redo operations. | Any int value | 1 |
| namingRequestTimeout             | NAMING_REQUEST_TIMEOUT               | Specifies the RPC request timeout for the registry `NamingService`. It is disabled by default and uses the common timeout configured in `RpcClientConfig`. | long value >= 0 | -1 |
| ~~namingClientBeatThreadCount~~  | ~~NAMING_CLIENT_BEAT_THREAD_COUNT~~  | Deprecated. The number of threads used by the old registry `NamingService` implementation to send heartbeats for registered service instances. | Any int value | None |

### 2.4. Connection Parameters

When the Nacos Java SDK connects to Nacos Server, you can configure a set of parameters to improve fault tolerance during network jitter.

| Parameter                                                       | Meaning                                                                            | Optional Values | Default Value |
|-----------------------------------------------------------------|------------------------------------------------------------------------------------|---------|---------------|
| nacos.server.grpc.port.offset                                   | The offset of the Nacos Server gRPC port relative to the main port.                           | Any int value | 1000 |
| nacos.remote.client.grpc.name                                   | The name of the gRPC connection for this Nacos Java SDK.                                      | Any string | null |
| nacos.remote.client.grpc.connect.keep.alive                     | The keep-alive interval of the gRPC connection for this Nacos Java SDK.                       | Any long value | 5000 |
| nacos.remote.client.grpc.retry.times                            | The maximum retry count when the gRPC connection of this Nacos Java SDK initiates a request.  | Any int value | 3 |
| nacos.remote.client.grpc.timeout                                | The request timeout when the gRPC connection of this Nacos Java SDK initiates a request.      | Any long value | 3000 |
| nacos.remote.client.grpc.pool.alive                             | The thread keep-alive time of the thread pool used by the gRPC connection of this Nacos Java SDK, in milliseconds. | Any long value | 10000 |
| nacos.remote.client.grpc.pool.core.size                         | The minimum size of the thread pool used by the gRPC connection of this Nacos Java SDK.       | Any int value | Number of CPUs * 2 |
| nacos.remote.client.grpc.pool.max.size                          | The maximum size of the thread pool used by the gRPC connection of this Nacos Java SDK.       | Any int value | Number of CPUs * 8 |
| nacos.remote.client.grpc.server.check.timeout                   | The timeout for connection registration when the gRPC connection of this Nacos Java SDK has just connected to the server. | Any long value | 3000 |
| nacos.remote.client.grpc.queue.size                             | The request queue length of the gRPC connection for this Nacos Java SDK.                      | Any int value | 10000 |
| nacos.remote.client.grpc.health.retry                           | The retry count for gRPC connection health checks. If health checks fail this many times, the client forcibly closes the connection and reconnects. | Any int value | 3 |
| nacos.remote.client.grpc.health.timeout                         | The timeout for gRPC connection health checks.                                                | Any long value | 3000 |
| nacos.remote.client.grpc.maxinbound.message.size                | The maximum size, in bytes, of a single request for the gRPC connection of this Nacos Java SDK. | Any int value | 10M |
| nacos.remote.client.grpc.channel.keep.alive                     | The keep-alive interval of the TCP channel corresponding to the gRPC connection of this Nacos Java SDK. This value should be greater than `connect.keep.alive`, in milliseconds. | Any int value | 6 * 60 * 1000 |
| nacos.remote.client.grpc.channel.keep.alive.timeout             | The keep-alive timeout of the TCP channel corresponding to the gRPC connection of this Nacos Java SDK, in milliseconds. | Any long value | 20 * 1000 |
| nacos.remote.client.grpc.channel.capability.negotiation.timeout | The TLS handshake timeout of the TCP channel corresponding to the gRPC connection of this Nacos Java SDK. | Any long value | 5000 |

### 2.5. Other Parameters

Some parameters in the Nacos Java SDK have little impact at runtime and must remain globally consistent. Therefore, these parameters currently need to be set through JVM parameters (`-D`) or environment variables. In most cases, use the default values and configure them only for special scenarios.

| Parameter                 | Meaning                                                                                                             | Optional Values     | Default Value     |
|---------------------------|--------------------------------------------------------------------------------------------------------------------|--------------------|-------------------|
| PER_TASK_CONFIG_SIZE      | The maximum number of configurations that each `ConfigService` can listen to.                                      | Any int | 3000 |
| JM.SNAPSHOT.PATH          | The local snapshot root directory of the Nacos Java SDK. The `naming` and `config` directories are created under the root directory to store cache information for subscribed services and configurations. | Any directory | ${user.home} |
| JM.LOG.PATH               | The log output directory of the Nacos Java SDK. Normally, Nacos Java SDK logs are written to this directory. In some special scenarios and versions, logs may be written to business logs, such as when log4j 1.0 is used or Spring Cloud reloads the logging configuration. | Any directory | ${user.home}/logs |
| nacos.server.port         | The default port for the Nacos Server **config center and authentication login**. When the `serverAddr` parameter does not contain a port, the SDK uses this port to connect to Nacos Server. We recommend setting the port uniformly through the `serverAddr` parameter. | 0~65535 | 8848 |
| nacos.naming.exposed.port | The default port for the Nacos Server **registry**. When the `serverAddr` parameter does not contain a port, the SDK uses this port to connect to Nacos Server. We recommend setting the port uniformly through the `serverAddr` parameter. | 0~65535 | 8848 |
| nacos.client.contextPath  | The default Nacos Server `contentPath`. It is used when `contextPath` and `endpointContextPath` are not provided. | Any URL-supported path | nacos |
| nacos.env.first           | The configuration lookup order of `NacosClientProperties` in the Nacos Java SDK. For details, see [1.3.1. Priority](#131-priority). | PROPERTIES/JVM/ENV | PROPERTIES |
| project.name              | The application name to which this SDK belongs. It can be used in the service subscriber list and configuration subscriber list as a reference field only. | Any string | unknown |
| ~~NACOS.CONNECT.TIMEOUT~~ | Deprecated. The connection timeout used by the old HTTP implementation when connecting to a service. | Any int | 1000 |
| NACOS.READ.TIMEOUT        | The read timeout used by the old HTTP implementation when connecting to a service. | Any int | 3000 |
