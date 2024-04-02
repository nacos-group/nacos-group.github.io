---
title: Authorization
keywords: [Authorization]
description: Authorization
sidebar:
    order: 5
---

> 注意
> - Nacos是一个内部微服务组件，需要在可信的内部网络中运行，不可暴露在公网环境，防止带来安全风险。
> - Nacos提供简单的鉴权实现，为防止业务错用的弱鉴权体系，不是防止恶意攻击的强鉴权体系。
> - 如果运行在不可信的网络环境或者有强鉴权诉求，请参考官方简单实现做进行[自定义插件开发](../../plugin/auth-plugin.md)。

# 鉴权

## 相关参数

|参数名|默认值|启止版本|说明|
|-----|------|------|----|
|nacos.core.auth.enabled|false|1.2.0 ~ latest|是否开启鉴权功能|
|nacos.core.auth.system.type|nacos|1.2.0 ~ latest|鉴权类型|
|nacos.core.auth.plugin.nacos.token.secret.key|SecretKey012345678901234567890123456789012345678901234567890123456789(2.2.0.1后无默认值)|2.1.0 ~ latest|默认鉴权插件用于生成用户登陆临时accessToken所使用的密钥，**使用默认值有安全风险**|
|nacos.core.auth.plugin.nacos.token.expire.seconds|18000|2.1.0 ~ latest|用户登陆临时accessToken的过期时间|
|nacos.core.auth.enable.userAgentAuthWhite|false|1.4.1 ~ latest|是否使用useragent白名单，主要用于适配老版本升级，**置为true时有安全风险**|
|nacos.core.auth.server.identity.key|serverIdentity(2.2.1后无默认值)|1.4.1 ~ latest|用于替换useragent白名单的身份识别key，**使用默认值有安全风险**|
|nacos.core.auth.server.identity.value|security(2.2.1后无默认值)|1.4.1 ~ latest|用于替换useragent白名单的身份识别value，**使用默认值有安全风险**|
|~~nacos.core.auth.default.token.secret.key~~|SecretKey012345678901234567890123456789012345678901234567890123456789|1.2.0 ~ 2.0.4|同`nacos.core.auth.plugin.nacos.token.secret.key`|
|~~nacos.core.auth.default.token.expire.seconds~~|18000|1.2.0 ~ 2.0.4|同`nacos.core.auth.plugin.nacos.token.expire.seconds`|

## 默认控制台登录页

2.2.2版本之前的Nacos默认控制台，无论服务端是否开启鉴权，都会存在一个登录页；这导致很多用户被**误导**认为Nacos默认是存在鉴权的。在社区安全工程师的建议下，Nacos自**2.2.2**版本开始，在未开启鉴权时，默认控制台将不需要登录即可访问，同时在控制台中给予提示，提醒用户当前集群未开启鉴权。

在用户开启鉴权后，控制台才需要进行登录访问。 同时针对不同的鉴权插件，提供新的接口方法，用于提示控制台是否开启登录页；同时在`2.2.3`版本后，Nacos可支持关闭开源控制台，并引导到用户自定义的Nacos控制台，详情可查看[Nacos鉴权插件-服务端插件](../../plugin/auth-plugin.md)及[控制台手册-关闭登录功能](../admin/console-guide.md#1.1)
## 服务端如何开启鉴权

### 非Docker环境

按照官方文档配置启动,默认是不需要登录的，这样会导致配置中心对外直接暴露。而启用鉴权之后，需要在使用用户名和密码登录之后，才能正常使用nacos。

开启鉴权之前，application.properties中的配置信息为：
```java
### If turn on auth system:
nacos.core.auth.enabled=false
```
开启鉴权之后，application.properties中的配置信息为：
```java
### If turn on auth system:
nacos.core.auth.system.type=nacos
nacos.core.auth.enabled=true
```

#### 自定义密钥

开启鉴权之后，你可以自定义用于生成JWT令牌的密钥，application.properties中的配置信息为：

> 注意：
> 1. 文档中提供的密钥为公开密钥，在实际部署时请更换为其他密钥内容，防止密钥泄漏导致安全风险。
> 2. 在2.2.0.1版本后，社区发布版本将移除以文档如下值作为默认值，需要自行填充，否则无法启动节点。
> 3. 密钥需要保持节点间一致，长时间不一致可能导致403 invalid token错误。

```properties
### The default token(Base64 String):
nacos.core.auth.default.token.secret.key=SecretKey012345678901234567890123456789012345678901234567890123456789

### 2.1.0 版本后
nacos.core.auth.plugin.nacos.token.secret.key=SecretKey012345678901234567890123456789012345678901234567890123456789
```

自定义密钥时，推荐将配置项设置为**Base64编码**的字符串，且**原始密钥长度不得低于32字符**。例如下面的的例子：

```properties
### The default token(Base64 String):
nacos.core.auth.default.token.secret.key=VGhpc0lzTXlDdXN0b21TZWNyZXRLZXkwMTIzNDU2Nzg=

### 2.1.0 版本后
nacos.core.auth.plugin.nacos.token.secret.key=VGhpc0lzTXlDdXN0b21TZWNyZXRLZXkwMTIzNDU2Nzg=
```

> 注意：鉴权开关是修改之后立马生效的，不需要重启服务端。动态修改`token.secret.key`时，请确保token是有效的，如果修改成无效值，会导致后续无法登录，请求访问异常。

### Docker环境

#### 官方镜像

如果使用官方镜像，请在启动docker容器时，添加如下环境变量

```powershell
NACOS_AUTH_ENABLE=true
```

例如，可以通过如下命令运行开启了鉴权的容器:

```powershell
docker run --env PREFER_HOST_MODE=hostname \
  --env MODE=standalone \
  --env NACOS_AUTH_ENABLE=true \
  -e NACOS_AUTH_TOKEN=SecretKeyM1Z2WDc4dnVyZkQ3NmZMZjZ3RHRwZnJjNFROdkJOemEK \
  -e NACOS_AUTH_IDENTITY_KEY=mpYGXyu7 \
  -e NACOS_AUTH_IDENTITY_VALUE=mpYGXyu7 \
  -p 8848:8848 nacos/nacos-server
```

除此之外，还可以添加其他鉴权相关的环境变量信息：

| name                          | description                            | option                                 |
| ----------------------------- | -------------------------------------- | -------------------------------------- |
| NACOS_AUTH_ENABLE      |  是否开启权限系统        | 默认:false|
| NACOS_AUTH_TOKEN_EXPIRE_SECONDS      |  token 失效时间 | 默认:18000                          |
| NACOS_AUTH_TOKEN      |  token        | 默认:SecretKey012345678901234567890123456789012345678901234567890123456789      |
| NACOS_AUTH_CACHE_ENABLE      |  权限缓存开关 ,开启后权限缓存的更新默认有15秒的延迟       | 默认 : false   |


然后运行docker-compose构建命令,例如
```powershell
docker-compose -f example/standalone-derby.yaml up
```

#### 自定义镜像

如果选择自定义镜像，请在构建镜像之前，修改nacos工程中的application.properties文件，

将下面这一行配置信息
```
nacos.core.auth.enabled=false
```
修改为
```
nacos.core.auth.system.type=nacos
nacos.core.auth.enabled=true
```
然后再配置nacos启动命令。

## 客户端如何进行鉴权

### Java SDK鉴权

在构建“Properties”类时,需传入用户名和密码。
```java
properties.put("username","${username}");
properties.put("password","${password}");
```
#### 示例代码
```java
try {
    // Initialize the configuration service, and the console automatically obtains the following parameters through the sample code.
	String serverAddr = "{serverAddr}";
	Properties properties = new Properties();
	properties.put("serverAddr", serverAddr);

    // if need username and password to login
        properties.put("username","nacos");
        properties.put("password","nacos");

	ConfigService configService = NacosFactory.createConfigService(properties);
} catch (NacosException e) {
    // TODO Auto-generated catch block
    e.printStackTrace();
}
```
### 其他语言的SDK鉴权

待补充

### Open-API鉴权
首先需要使用用户名和密码登陆nacos。

```plain
curl -X POST '127.0.0.1:8848/nacos/v1/auth/login' -d 'username=nacos&password=nacos'
```

若用户名和密码正确,返回信息如下:

```
{"accessToken":"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYWNvcyIsImV4cCI6MTYwNTYyOTE2Nn0.2TogGhhr11_vLEjqKko1HJHUJEmsPuCxkur-CfNojDo","tokenTtl":18000,"globalAdmin":true}
```

接下来进行配置信息或服务信息时,应当使用该accessToken鉴权,在url后添加参数accessToken=${accessToken},其中${accessToken}为登录时返回的token信息，例如

```plain
curl -X GET '127.0.0.1:8848/nacos/v1/cs/configs?accessToken=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYWNvcyIsImV4cCI6MTYwNTYyMzkyM30.O-s2yWfDSUZ7Svd3Vs7jy9tsfDNHs1SuebJB4KlNY8Q&dataId=nacos.example.1&group=nacos_group'
```

```plain
curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?accessToken=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYWNvcyIsImV4cCI6MTYwNTYyMzkyM30.O-s2yWfDSUZ7Svd3Vs7jy9tsfDNHs1SuebJB4KlNY8Q&port=8848&healthy=true&ip=11.11.11.11&weight=1.0&serviceName=nacos.test.3&encoding=GBK&namespaceId=n1'
```

## 开启Token缓存功能

服务端自2.2.1版本后，默认鉴权插件模块支持token缓存功能，可参见ISSUE #9906 
```
https://github.com/alibaba/nacos/issues/9906
```
#### 背景
无论是客户端SDK还是OpenAPI，在调用login接口获取accessToken之后，携带accessToken访问服务端，服务端解析Token进行鉴权。解析的动作比较耗时，如果想要提升接口的性能，可以考虑开启缓存Token的功能，用字符串比较代替Token解析。

#### 开启方式
```
nacos.core.auth.plugin.nacos.token.cache.enable=true
```

#### 注意事项
在开启Token缓存功能之前，服务端对每一个携带用户名密码访问login接口的请求都会生成新的token，接口的返回值中的tokenTtl字段跟服务端配置文件中设置的值相等，配置如下：
```
nacos.core.auth.plugin.nacos.token.expire.seconds=18000
```
在开启Token缓存功能之后，服务端对每一个携带用户名密码访问login接口的请求，会先检查缓存中是否存在该用户名对应的token。若不存在，生成新的Token，插入缓存再返回；若存在，返回该token，此时tokenTtl字段的值为配置文件中设置的值减去该Token在缓存中存留的时长。
如果Token在缓存中存留的时长超过配置文件设置的值的90%，当login接口收到请求时，尽管缓存中存在该用户名对应的Token，服务端会重新生成Token返回给请求方，并更新缓存。因此，最差情况下，请求方收到的tokenTtl只有配置文件设置的值的10%。

## 开启服务身份识别功能

开启鉴权功能后，服务端之间的请求也会通过鉴权系统的影响。考虑到服务端之间的通信应该是可信的，因此在1.2~1.4.0版本期间，通过User-Agent中是否包含Nacos-Server来进行判断请求是否来自其他服务端。

但这种实现由于过于简单且固定，导致可能存在安全问题。因此从1.4.1版本开始，Nacos添加服务身份识别功能，用户可以自行配置服务端的Identity，不再使用User-Agent作为服务端请求的判断标准。

开启方式:

```
### 开启鉴权
nacos.core.auth.enabled=true

### 关闭使用user-agent判断服务端请求并放行鉴权的功能
nacos.core.auth.enable.userAgentAuthWhite=false

### 配置自定义身份识别的key（不可为空）和value（不可为空）
nacos.core.auth.server.identity.key=example
nacos.core.auth.server.identity.value=example
```

** 注意 ** 所有集群均需要配置相同的`server.identity`信息，否则可能导致服务端之间数据不一致或无法删除实例等问题。

### 旧版本升级

考虑到旧版本用户需要升级，可以在升级期间，开启`nacos.core.auth.enable.userAgentAuthWhite=true`功能，待集群整体升级到1.4.1并稳定运行后，再关闭此功能。
