---
title: Authentication
keywords: Authentication
description: Authentication
---

# Authentication

### Use Authentication in Servers

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
nacos.core.auth.enabled=true
```


### With Docker

#### Official images

If you choose to use official images, please add the following environment parameter when you start a docker container.

```powershell
NACOS_AUTH_ENABLE=true
```

For example, you can run this command to run a docker container with Authentication:

```powershell
docker run --env PREFER_HOST_MODE=hostname --env MODE=standalone --env NACOS_AUTH_ENABLE=true -p 8848:8848 nacos/nacos-server
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

