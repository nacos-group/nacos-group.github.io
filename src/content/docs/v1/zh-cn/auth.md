---
title: Authorization
keywords: [Authorization]
description: Authorization
---

> 注意
> - Nacos是一个内部微服务组件，需要在可信的内部网络中运行，不可暴露在公网环境，防止带来安全风险。
> - Nacos提供简单的鉴权实现，为防止业务错用的弱鉴权体系，不是防止恶意攻击的强鉴权体系。
> - 如果运行在不可信的网络环境或者有强鉴权诉求，请参考官方简单实现做替换增强。


# 鉴权

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
> 2. 在2.2.1版本后，社区发布版本将移除以文档如下值作为默认值，需要自行填充，否则无法启动节点。
> 3. 密钥需要保持节点间一致，长时间不一致可能导致403 invalid token错误。

```properties
### The default token(Base64 String):
nacos.core.auth.default.token.secret.key=SecretKey012345678901234567890123456789012345678901234567890123456789
```

自定义密钥时，推荐将配置项设置为**Base64编码**的字符串，且原始密钥长度不得低于32字符。例如下面的的例子：

```properties
### The default token(Base64 String):
nacos.core.auth.default.token.secret.key=VGhpc0lzTXlDdXN0b21TZWNyZXRLZXkwMTIzNDU2Nzg=
```

**注意**：鉴权开关是修改之后立马生效的，不需要重启服务端。

### Docker环境

#### 官方镜像

如果使用官方镜像，请在启动docker容器时，添加如下环境变量

```powershell
NACOS_AUTH_ENABLE=true
```

例如，可以通过如下命令运行开启了鉴权的容器:

```powershell
docker run --env PREFER_HOST_MODE=hostname --env MODE=standalone --env NACOS_AUTH_ENABLE=true -p 8848:8848 nacos/nacos-server
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
