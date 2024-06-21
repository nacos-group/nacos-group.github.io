---
title: 鉴权插件
keywords: [鉴权插件, Nacos, SPI, API, 服务端插件, 客户端插件, 自定义插件, 身份信息, 资源, 操作类型, Beta测试]
description: 本文描述如何开发及使用Nacos的鉴权插件
sidebar:
    order: 1
---

# 鉴权插件

Nacos从2.1.0版本开始，支持通过[SPI](https://docs.oracle.com/javase/tutorial/sound/SPI-intro.html)的方式注入鉴权相关插件，并在`application.properties`配置文件中选择某一种插件实现作为实际鉴权服务。本文档会详细介绍如何实现一个鉴权插件和如何使其生效。

> 注意：
> 目前鉴权插件还处于Beta测试的阶段，其API及接口定义可能会随后续版本升级而有所修改，请注意您的插件适用版本。

## 鉴权插件中的概念

鉴权，通俗的表达就是，验证 **谁** 是否能够对 **某个东西** 进行 **某种操作** ，因此Nacos在设计鉴权插件时，将鉴权信息主要抽象为`身份信息`，`资源`和`操作类型`3类主要概念。

### 身份信息 IdentityContext

身份信息(IdentityContext)是请求发起主体在Nacos鉴权插件中的抽象。由于不同的插件实现，身份信息可能不同，较为灵活；比如用户名和密码是一种身份信息，accessToken又是另一种身份信息。因此身份信息(IdentityContext)并没有限制具体的个数和名字，插件实现可以自定义任意个数和身份关键字，Nacos将会从请求中自动获取插件实现定义的身份关键字及其对应的值注入到身份信息(IdentityContext)中，供插件使用。

其中必定会包含的内容有：

|字段名|描述|
|-----|---|
|remote_ip|请求来源ip|

### 资源 Resource

资源(Resource)是请求所操作对象在Nacos鉴权插件中的抽象。它主要由Nacos来定义，具体可以是某个配置，某个服务，或者某个分组。

资源(Resource)主要由以下内容组成：

|字段名|描述|
|-----|---|
|namespaceId|请求资源的命名空间ID，部分接口可能没有该值|
|group| 请求资源的分组名，部分接口可能没有该值|
|name | 请求资源的资源名，如服务名或配置的dataId，部分接口可能是定义的特殊值，如`nacos/admin`|
|type | 请求资源的类型，可能取值为`SignType`中的枚举值，主要表示该资源所相关的模块 |
|properties| 请求资源的扩展配置，不属于上述的资源相关信息，会被放如properties中，比如Grpc请求的Request名称或`@Secured`注解上的tags等 |

### 操作类型 Action

操作类型(Action)是请求操作在Nacos鉴权插件中的抽象，主要有读操作`R`和写操作`W`，详情查看`ActionTypes`枚举。

## 服务端插件

开发Nacos服务端鉴权插件，首先需要依赖鉴权插件的相关API

```xml
        <dependency>
            <groupId>com.alibaba.nacos</groupId>
            <artifactId>nacos-auth-plugin</artifactId>
            <version>${project.version}</version>
        </dependency>
```

`${project.version}` 为您开发插件所对应的Nacos版本

随后实现`com.alibaba.nacos.plugin.auth.spi.server.AuthPluginService`接口， 并将您的实现添加到SPI的services当中。

接口中需要实现的方法如下：

|方法名|入参内容|返回内容|描述|
|-----|-----|-----|---|
|getAuthServiceName|void|String|插件的名称，当名字相同时，后加载的插件会覆盖先加载的插件。|
|identityNames|void|Collection&lt;String>|插件的身份信息关键字，Nacos会从请求中获取以这些关键字为key的参数，并注入到IdentityContext中。|
|enableAuth|ActionTypes,SignType|boolean|在调用`validateIdentity`和`validateAuthority`前调用，插件可自行判断是否对此类型的操作或此类型的模块进行鉴权。|
|validateIdentity|IdentityContext, Resource|boolean|对身份信息进行验证，在`validateAuthority`前调用|
|validateAuthority|IdentityContext, Permission|boolean|对权限进行验证，在`validateIdentity`返回为`true`时调用|
|isLoginEnabled|void|boolean|是否该插件开启开源控制台登录页，返回`true`时，访问开源控制台将需要通过登录页登录|

### 加载服务端插件

插件开发完成后，需要打包成jar/zip，放置到nacos服务端的classpath中，如果您不知道如何修改classpath，请直接放置到`${nacos-server.path}/plugins`下

放置后，需要修改`${nacos-server.path}/conf/application.properties`中的以下配置

```properties
### 所启用的Nacos的鉴权插件的名称，与`com.alibaba.nacos.plugin.auth.spi.server.AuthPluginService`的`getAuthServiceName`返回值对应
nacos.core.auth.system.type=${authServiceName}

### 开启鉴权功能
nacos.core.auth.enabled=true
```

随后重启nacos集群，在有请求访问到nacos节点后，可以从`${nacos-server.path}/logs/nacos.log`中看到如下日志：

```text
[AuthPluginManager] Load AuthPluginService(xxxx) AuthServiceName(xxx) successfully.
```

### 使用Nacos自带的鉴权插件

Nacos默认带有一个鉴权的简易实现，主要是为防止业务错用的弱鉴权体系，不是防止恶意攻击的强鉴权体系。开启和使用方式请查看文档[用户指南-权限认证](../guide/user/auth.md).

## 客户端插件

Nacos的客户端鉴权插件主要工作为将鉴权相关的身份信息，注入到请求中，让每个请求都能够被对应的服务端鉴权插件识别。

在Nacos的Java客户端默认自带两个实现：

- 使用`username`，`password`和`accessToken`的简易鉴权实现；
- 使用`accessKey`和`secretKey`的阿里云鉴权实现；

### Nacos简易鉴权实现

当构造客户端实例时传入的properties中带有`username`，`password`时，客户端会使用简易鉴权实现插件注入身份信息；
如：
```java
Properties properties = new Properties();
properties.setProperty(PropertyKeyConst.SERVER_ADDR, "localhost:8848");
properties.setProperty(PropertyKeyConst.USERNAME, "nacos");
properties.setProperty(PropertyKeyConst.PASSWORD, "nacos");
NamingFactory.createNamingService(properties);
ConfigFactory.createConfigService(properties);
```

该插件会异步地通过`username`，`password`进行登录，获取登录成功后的`accessToken`，并将`accessToken`注入到所有客户端请求中，开发者可以根据`accessToken`在实现的服务端插件中进行身份验证及后续的权限验证。

### 阿里云鉴权实现

当properties中带有`accessKey`和`secretKey`时，则会使用阿里云鉴权实现注入身份信息，如：
 ```java
 Properties properties = new Properties();
 properties.setProperty(PropertyKeyConst.SERVER_ADDR, "localhost:8848");
 properties.setProperty(PropertyKeyConst.ACCESS_KEY, "nacos");
 properties.setProperty(PropertyKeyConst.SECRET_KEY, "nacos");
 NamingFactory.createNamingService(properties);
 ConfigFactory.createConfigService(properties);
 ```

该插件会根据`accessKey`和`secretKey`以及请求的资源内容，自动生成对应的请求签名，并注入到请求中，根据资源类型的不同，请求中的身份信息关键字可能不同：

|类型|身份关键字|描述|
|-----|-----|-----|
|NamingService|ak|accessKey|
|NamingService|signature|注册中心模块的签名信息|
|NamingService|data|签名数据，主要是时间戳|
|ConfigService|Spas-AccessKey|accessKey|
|ConfigService|Spas-Signature|配置中心模块的签名信息|
|ConfigService|Timestamp|请求的时间戳|
|ConfigService|Spas-SecurityToken|临时token（启用阿里云STS功能时使用）|

开发者可以根据以上信息，在实现的服务端插件中进行身份验证及后续的权限验证。

### 其他自定义插件

考虑到开发者的鉴权插件可能有自定义的身份信息关键字，因此Nacos的Java客户端同样可以使用SPI方式注入对应的插件实现。

开发Nacos客户端鉴权插件，首先需要依赖鉴权插件的相关API

```xml
        <dependency>
            <groupId>com.alibaba.nacos</groupId>
            <artifactId>nacos-auth-plugin</artifactId>
            <version>${project.version}</version>
        </dependency>
```

`${project.version}` 为您开发插件所对应的Nacos版本

随后实现`com.alibaba.nacos.plugin.auth.spi.client.ClientAuthService`接口， 并将您的实现添加到SPI的services当中。

接口中需要实现的方法如下：

|方法名|入参内容|返回内容|描述|
|-----|-----|-----|---|
|setServerList|List&lt;String>，Nacos服务端地址列表|void|初始化时会调用此接口注入Nacos的服务列表，方便插件访问nacos服务端，如调用登录接口等|
|setNacosRestTemplate|NacosRestTemplate，Nacos的http客户端|void|初始化时会调用此接口注入Nacos的http客户端，方便插件访问nacos服务端，如调用登录接口等|
|login|Properties，即初始化Nacos客户端时传入的参数|boolean|登录接口，主要执行的是身份信息的转换工作，如`username`，`password`转换为`accessToken`|
|getLoginIdentityContext|Resource|IdentityContext|获取经过登录接口转换后的身份信息，客户端会将该返回对象的内容全部注入到请求中|

您也可以选择继承`com.alibaba.nacos.plugin.auth.spi.client.AbstractClientAuthService`，该父类默认实现了`setServerList`和`setNacosRestTemplate`。

将开发完成的客户端插件打包成jar/zip，放入到您应用的classpath中即可自动生效。

### 其他语言客户端鉴权插件

待社区贡献。
