---
title: Authentication
keywords: [Authentication]
description: Authentication
sidebar:
    order: 5
---

> Attention
> - Nacos is an internal micro service component, which needs to run in a trusted internal network. It can not be exposed to the public network environment to prevent security risks.
> - Nacos provides a simple authentication implementation. It is a weak authentication system to prevent business misuse, not a strong authentication system to prevent malicious attacks.
> - If you are running in an untrusted network environment or have strong authentication demands, please refer to the official simple implementation to develop [Authentication plugin](../../plugin/auth-plugin.md).


# Authentication

## Related Parameters

|Parameter|Default|Versions|Description|
|-----|------|------|----|
|nacos.core.auth.enabled|false|1.2.0 ~ latest|Whether to enable the authentication|
|nacos.core.auth.system.type|nacos|1.2.0 ~ latest|Type of authentication|
|nacos.core.auth.plugin.nacos.token.secret.key|SecretKey012345678901234567890123456789012345678901234567890123456789(No default since 2.2.0.1)|2.1.0 ~ latest|Used to generate the key used by the user to login to the temporary accessToken in the default authentication plugin. **Using the default value is a security risk**.|
|nacos.core.auth.plugin.nacos.token.expire.seconds|18000|2.1.0 ~ latest|Expiration time of user login temporary accessToken|
|nacos.core.auth.enable.userAgentAuthWhite|false|1.4.1 ~ latest|Whether to use the useragent whitelist, mainly used to adapt to the upgrade of the old version, **Setting `true` is a security risk**|
|nacos.core.auth.server.identity.key|serverIdentity(No default since 2.2.1)|1.4.1 ~ latest|Used to replace the identification key of the useragent whitelist, **Using the default value is a security risk**|
|nacos.core.auth.server.identity.value|security(No default since 2.2.1)|1.4.1 ~ latest|It is used to replace the identification value of the useragent whitelist, **Using the default value is a security risk**|
|~~nacos.core.auth.default.token.secret.key~~|SecretKey012345678901234567890123456789012345678901234567890123456789|1.2.0 ~ 2.0.4|Same as `nacos.core.auth.plugin.nacos.token.secret.key`|
|~~nacos.core.auth.default.token.expire.seconds~~|18000|1.2.0 ~ 2.0.4|Same as `nacos.core.auth.plugin.nacos.token.expire.seconds`|


## Use Authentication in Servers

### Without Docker
By default, no login is required to start following the official document configuration, which can expose the configuration center directly to the outside world. However, if the authentication is enabled, one can use nacos only after he configures the user name and password.

Before enabling authentication, the configuration in application.properties is as follow:
```java
### If turn on auth system:
nacos.core.auth.enabled=false
```

After enabling authentication, the configuration in application.properties is as follow:
```java
### If turn on auth system:
nacos.core.auth.system.type=nacos
nacos.core.auth.enabled=true
```

#### Custom SecretKey

After enabling authentication, you can customize the key used to generate JWT tokens，the configuration in application.properties is as follow：

> Attention：
> 1. The secret key provided in the document is a public key. Please replace it with other secret key content during actual deployment to prevent security risks caused by secret key leakage.
> 2. After version 2.2.0.1, the community release version will remove the following value as the default value in the document, which needs to be filled in by yourself, otherwise the node cannot be started.
> 3. The secret key needs to be consistent between nodes, and if it is inconsistent for a long time, it may cause 403 invalid token error.

```properties
### The default token(Base64 String):
nacos.core.auth.default.token.secret.key=SecretKey012345678901234567890123456789012345678901234567890123456789

### Since 2.1.0
nacos.core.auth.plugin.nacos.token.secret.key=SecretKey012345678901234567890123456789012345678901234567890123456789
```

When customizing the key, it is recommended to set the configuration item to a **Base64 encoded** string,
and **the length of the original key must not be less than 32 characters**. For example the following example:

```properties
### The default token(Base64 String):
nacos.core.auth.default.token.secret.key=VGhpc0lzTXlDdXN0b21TZWNyZXRLZXkwMTIzNDU2Nzg=

### Since 2.1.0
nacos.core.auth.plugin.nacos.token.secret.key=VGhpc0lzTXlDdXN0b21TZWNyZXRLZXkwMTIzNDU2Nzg=
```

> Attention: the authentication switch takes effect immediately after the modification, and there is no need to restart the server. When dynamic modifing `token.secret.key`, Please make sure the new value is valid, otherwise the login and request will fail.

### With Docker

#### Official images

If you choose to use official images, please add the following environment parameter when you start a docker container.

```powershell
NACOS_AUTH_ENABLE=true
```

For example, you can run this command to run a docker container with Authentication:

```powershell
docker run --env PREFER_HOST_MODE=hostname \
  --env MODE=standalone \
  --env NACOS_AUTH_ENABLE=true \
  -e NACOS_AUTH_TOKEN=SecretKeyM1Z2WDc4dnVyZkQ3NmZMZjZ3RHRwZnJjNFROdkJOemEK \
  -e NACOS_AUTH_IDENTITY_KEY=mpYGXyu7 \
  -e NACOS_AUTH_IDENTITY_VALUE=mpYGXyu7 \
  -p 8848:8848 nacos/nacos-server
```

Besides, you can also add the other related enviroment parameters:

| name                          | description                            | option                                 |
| ----------------------------- | -------------------------------------- | -------------------------------------- |
| NACOS_AUTH_ENABLE      |  If turn on auth system        | default :false                          |
| NACOS_AUTH_TOKEN_EXPIRE_SECONDS      |  The token expiration in seconds        | default :18000                          |
| NACOS_AUTH_TOKEN      |  The default token        | default :SecretKey012345678901234567890123456789012345678901234567890123456789                          |
| NACOS_AUTH_CACHE_ENABLE      |  Turn on/off caching of auth information. By turning on this switch, the update of auth information would have a 15 seconds delay.        | default : false   |



#### Custom images

If you choose to use custom images, please modify the application.properties before you start nacos, change this line 

```
nacos.core.auth.enabled=false
```
into
```
nacos.core.auth.system.type=nacos
nacos.core.auth.enabled=true
```

## Authentication in Clients

### Authentication in Java SDK

The user name and password should be set when creating a 'Properties' class.
```java
properties.put("username","${username}");
properties.put("password","${password}");
```
#### Example Code
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
### Authentication in Other languages SDK

Pending...

### Authentication in Open-API
Firstly, the user name and password should be provided to login.

```plain
curl -X POST '127.0.0.1:8848/nacos/v1/auth/login' -d 'username=nacos&password=nacos'
```

If the user name and password are correct, the response will be:

```
{"accessToken":"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYWNvcyIsImV4cCI6MTYwNTYyOTE2Nn0.2TogGhhr11_vLEjqKko1HJHUJEmsPuCxkur-CfNojDo","tokenTtl":18000,"globalAdmin":true}
```

Secondly, when using configuration services or naming services, accessToken in the previous response should be provided. To use the accessToken, 'accessToken=${accessToken}' should be appended at the end of request url, e.g.,

```plain
curl -X GET '127.0.0.1:8848/nacos/v1/cs/configs?accessToken=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYWNvcyIsImV4cCI6MTYwNTYyMzkyM30.O-s2yWfDSUZ7Svd3Vs7jy9tsfDNHs1SuebJB4KlNY8Q&dataId=nacos.example.1&group=nacos_group'
```

```plain
curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?accessToken=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYWNvcyIsImV4cCI6MTYwNTYyMzkyM30.O-s2yWfDSUZ7Svd3Vs7jy9tsfDNHs1SuebJB4KlNY8Q&port=8848&healthy=true&ip=11.11.11.11&weight=1.0&serviceName=nacos.test.3&encoding=GBK&namespaceId=n1'
```

## Open feature for token cache 

Since version 2.2.1 of the server, the default authentication plug-in module supports the feature of token cache, see ISSUE #9906 
```
https://github.com/alibaba/nacos/issues/9906
```
#### Background
Regardless of the client SDK or OpenAPI, after calling the `login` interface to obtain the accessToken, carry the accessToken to access the server, and the server parses the token for authentication. The action of token parsing is time-consuming. If you want to improve the performance of the server, you can consider enabling the feature of caching tokens, which using string comparison instead of token parsing.

#### Way to open
```
nacos.core.auth.plugin.nacos.token.cache.enable=true
```

#### Attention
Before enabling the feature of token cache, the server will generate a new token for each request carrying a username and password to access the `login` interface. The `tokenTtl` field in the return value of `login` interface is equal to the value set in the server configuration file. The configuration is as follows:
```
nacos.core.auth.plugin.nacos.token.expire.seconds=18000
```
After enabling the feature of token cache, the server will first check whether the token corresponding to the username exists in cache for each request to access the `login` interface with username and password. If it does not exist, generate a new token, insert it into the cache and return it to requester; if it exists, return the token to requester, and the value of the `tokenTtl` field is the value set in the configuration file minus the duration of the token stored in the cache. 
If the token stays in the cache for more than 90% of the value set in the configuration file, when the `login` interface receives a request, although the token corresponding to the username exists in the cache, the server will regenerate the token and return it to the requester, and update cache. Therefore, in the worst case, the `tokenTtl` received by the requester is only 10% of the value set in the configuration file.

## Open feature for server identity

After the authentication feature is enabled, requests between servers will also be affected by the authentication system. Considering that the communication between the servers should be credible, during the 1.2~1.4.0 version, Nacos server use whether the User-Agent includes Nacos-Server to determine whether the request comes from other servers.

However, this implementation is too simple and fixed, leading to possible security issues. Therefore, since version 1.4.1, Nacos has added the server identification feature. Users can configure the identity of the server by themselves, and no longer use User-Agent as the judgment standard for server requests.

Way to open server identity

```
### Open authentication
nacos.core.auth.enabled=true

### Shutdown user-agent judgement for server request
nacos.core.auth.enable.userAgentAuthWhite=false

### Config the server identity key(not empty) and value(not empty)
nacos.core.auth.server.identity.key=example
nacos.core.auth.server.identity.value=example
```

**Attention** All servers in cluster need to be configured with the same `server.identity` information, otherwise it may cause data inconsistency between servers or failure to delete instances.

### Upgrade from old version

Considering that users of the old version need to upgrade, users can turn on the `nacos.core.auth.enable.userAgentAuthWhite=true` during upgrading, and turn off it after the cluster is upgraded to 1.4.1 completely and runs stably.
