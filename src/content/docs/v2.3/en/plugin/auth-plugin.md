---
title: Authorization Plugin
keywords: [Authorization, Plugin]
description: This article describes how to develop and use Nacos' authentication plugin.
sidebar:
    order: 1
---

# Authorization Plugin

Since version 2.1.0, Nacos support to inject authentication plugins through [SPI](https://docs.oracle.com/javase/tutorial/sound/SPI-intro.html), and select a plugin implementation in the configuration file `application.properties ` as the actual authentication service. This document will describe how to implement an authentication plugin and how to make it work.

> Attention: 
> At present, the authentication plugin is still in the beta stage, and its API and interface definitions maybe modified with version upgrades. Please pay attention to the applicable version of your plugin.

## Concepts in Authentication Plugins

Authentication, the common expression is to verify whether **who** can perform **some operation** on **something**. So when Nacos designs the authentication plugin, the authentication information abstracted as three main concepts: `identity context`, `resource` and `action type`.

### IdentityContext

IdentityContext is the abstraction of the request originator in the Nacos authentication plugin. Due to different plugin implementations, the identity context may be different, for example, username and password are one type of identity information, and accessToken is another type of identity information. Therefore, the IdentityContext does not limit the specific size and key. The plugin implementation can customize any size and keywords. Nacos will automatically obtain the identity keywords defined by the plugin implementation and their corresponding value from the request and inject them into IdentityContext which will be used in plugins.

IdentityContext must include:

|Field Name|Description|
|-----|---|
|remote_ip|source ip of request|

### Resource

Resource is the abstraction of the object operated by the request in the Nacos authentication plugin. It is mainly defined by Nacos, which can be a configuration, a service, or a group.

Resource mainly consists of the following:

|Field Name|Description|
|-----|---|
|namespaceId|Namespace ID of the requested resource, some interfaces may not have this value|
|group| The group name of the requested resource, some interfaces may not have this value|
|name | The resource name of the requested resource, such as the service name or the configuration dataId, some interfaces may be defined special values, such as `nacos/admin`|
|type | The type of the requested resource, which may be an enumeration value in `SignType`, which mainly represents the module related to the resource |
|properties| The extended configuration of the requested resource, which does not belong to the above-mentioned resource-related information, will be placed in properties, such as the Request name of the Grpc request or the tags on the `@Secured` annotation, etc. |

### Action

Action is the abstraction of the request operation in the Nacos authentication plugin, mainly include the read operation `R` and write operation `W`. For details, see the `ActionTypes` enumeration.

## Server Plugin

To develop a Nacos server-side authentication plugin, developer first need to depend on the relevant API of the authentication plugin.

```xml
        <dependency>
            <groupId>com.alibaba.nacos</groupId>
            <artifactId>nacos-auth-plugin</artifactId>
            <version>${project.version}</version>
        </dependency>
```

`${project.version}` is the version of Nacos for your development plugin.

Then implement interface `com.alibaba.nacos.plugin.auth.spi.server.AuthPluginService`, and put your implementation into services of SPI.

The methods of interface in following:

|method name|parameters|returns|description|
|-----|-----|-----|---|
|getAuthServiceName|void|String|The name of the plugin. When the name is the same, the plugin loaded later will overwrite the plugin loaded first.|
|identityNames|void|Collection&lt;String>|The identity context keywords of the plugin. Nacos will obtain the parameters with these keywords as the key from the request and inject them into the IdentityContext.|
|enableAuth|ActionTypes,SignType|boolean|Called before `validateIdentity` and `validateAuthority`, the plugin can decide whether to authenticate this type of operation or this type of module.|
|validateIdentity|IdentityContext, Resource|boolean|Validate identity, called before `validateAuthority`|
|validateAuthority|IdentityContext, Permission|boolean|Validate permissions, called when `validateIdentity` returns `true`|

### Load Server Plugin

After the plugin finished, it needs to be packaged into jar/zip and places in the classpath of the nacos server. If you don't know how to add plugins into the classpath, please place plugins under `${nacos-server.path}/plugins` directly.

After Adding plugins into classpath, also need to modify some configuration in `${nacos-server.path}/conf/application.properties`.

```properties
### The plugin name nacos using，should be same as the return value of  `com.alibaba.nacos.plugin.auth.spi.server.AuthPluginService#getAuthServiceName`
nacos.core.auth.system.type=${authServiceName}

### open authorization
nacos.core.auth.enabled=true
```

Restart nacos cluster, and after any request, some logs can be saw in `${nacos-server.path}/logs/core-auth.log`:

```text
[AuthPluginManager] Load AuthPluginService(xxxx) AuthServiceName(xxx) successfully.
```

### Use the default Nacos authentication plugin

Nacos provides a simple authentication plugin. It is a weak authentication system to prevent business misuse, not a strong authentication system to prevent malicious attacks. The usage detail see [User Guide-Authentication](../guide/user/auth.md).

## Client Plugin

The authentication plugin for Nacos Client is to inject authentication-related identity context into the request so that each request can be recognized by the server authentication plugin.

The Java client of Nacos comes with two implementations by default:

- A default implementation using `username`,`password` and `accessToken`;
- An Aliyun implementation using `accessKey` and `secretKey`.

### Default implementation

When `username`, `password` are included in the properties passed into a nacos client instance, the nacos client will use the simple authentication plugin to inject identity context;
e.g.:
```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "localhost:8848");
properties.setProperty(PropertyKeyConst.USERNAME, "nacos");
properties.setProperty(PropertyKeyConst.PASSWORD, "nacos");
NamingFactory.createNamingService(properties);
ConfigFactory.createConfigService(properties);
```

The plugin will login through `username` and `password` asynchronously, and obtain the `accessToken` after the login is successful. Finally, the plugin will inject the `accessToken` into all requests, which make the server plugins can validate identity and permission according to `accessToken`.

### Aliyun implementation

When `accessKey` and `secretKey` are included in the properties, the nacos client will use the aliyun authentication plugin to inject identity context.

e.g.:
 ```java
 Properties properties = new Properties();
 properties.setProperty(PropertyKeyConst.SERVER_ADDR, "localhost:8848");
 properties.setProperty(PropertyKeyConst.ACCESS_KEY, "nacos");
 properties.setProperty(PropertyKeyConst.SECRET_KEY, "nacos");
 NamingFactory.createNamingService(properties);
 ConfigFactory.createConfigService(properties);
 ```

The plugin will generate signatures by `accessKey`, `secretKey` and the request resource, and inject into the request.

The identity context may be different for the different request resource:

|Type|Identity keys|description|
|-----|-----|-----|
|NamingService|ak|accessKey|
|NamingService|signature|naming signature|
|NamingService|data|signature datum, include timestamp|
|ConfigService|Spas-AccessKey|accessKey|
|ConfigService|Spas-Signature|config signature|
|ConfigService|Timestamp|request timestamp|
|ConfigService|Spas-SecurityToken|Temporary token (used when Alibaba Cloud STS function is enabled)|

Developers can validate authentication and authorization in the server plugin based on the above information.

### Custom Plugin

Considering that the developer's authentication plugin may have custom identity keywords, the Java client of Nacos can also use the SPI to inject the plugin implementation.

To develop a Nacos client authentication plugin, developers first need to depend on the relevant API of the authentication plugin.

```xml
        <dependency>
            <groupId>com.alibaba.nacos</groupId>
            <artifactId>nacos-auth-plugin</artifactId>
            <version>${project.version}</version>
        </dependency>
```

`${project.version}` is the version of Nacos for your development plugin.

Then implement interface `com.alibaba.nacos.plugin.auth.spi.client.ClientAuthService`, and put your implementation into services of SPI.

The methods of interface in following:

|method name|parameters|returns|description|
|-----|-----|-----|---|
|setServerList|List&lt;String>,Nacos server address list|void|Called during initialization, to inject the Nacos service list, which is convenient for plugins to access the nacos server, such as calling the login interface, etc.|
|setNacosRestTemplate|NacosRestTemplate,http client for Nacos|void|Called during initialization, to inject Nacos' http client, which is convenient for plugins to access the nacos server, such as calling the login interface, etc.|
|login|Properties,properties of initialization|boolean|mainly performs the conversion of identity context, such as `username`, `password` is converted to `accessToken`|
|getLoginIdentityContext|Resource|IdentityContext|Get the identity context converted by the login interface, and the client will inject all the content of the returned object into the request|

Developers can choose to inherit `com.alibaba.nacos.plugin.auth.spi.client.AbstractClientAuthService`, which implements `setServerList` and `setNacosRestTemplate`.

Then package the developed client plugin into jar/zip and put it into the classpath of your application and take effect automatically.

### Plugin for other programming language

TODO
