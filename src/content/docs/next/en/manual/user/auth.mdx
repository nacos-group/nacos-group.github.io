---
title: 配置鉴权
keywords: [Authorization, SDK]
description: 本文介绍了各语言SDK如何配置身份信息，访问Nacos的默认鉴权系统
sidebar:
    order: 5
---

import { Tabs, TabItem } from '@astrojs/starlight/components';

> 注意
> - Nacos是一个内部微服务组件，需要在可信的内部网络中运行，不可暴露在公网环境，防止带来安全风险。
> - Nacos提供简单的鉴权实现，为防止业务错用的弱鉴权体系，不是防止恶意攻击的强鉴权体系。
> - 如果运行在不可信的网络环境或者有强鉴权诉求，请参考官方简单实现做进行[自定义插件开发](../../plugin/auth-plugin.md)。

# 配置鉴权

Nacos提供了一个简单的默认鉴权实现，当服务端通过[运维手册-权限校验](../admin/auth.mdx)开启鉴权后，客户端、SDK以及openAPI都需要配置身份信息才可以访问Nacos。 本文档介绍如何为各语言客户端及openAPI配置身份信息。

## 1. 客户端如何配置鉴权信息

<Tabs>
  <TabItem label="Java">

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
            properties.put("username","${username}");
            properties.put("password","${password}");

      ConfigService configService = NacosFactory.createConfigService(properties);
      NamingService configService = NacosFactory.createNamingService(properties);
    } catch (NacosException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
    }
    ```

  </TabItem>
  <TabItem label="Go">
    在构建“ClientConfig”类时,需传入用户名和密码。
    ```Go
      cc := *constant.NewClientConfig(
        constant.WithUsername("${username}"),
        constant.WithPassword("${password}"),
      )
    ```

    #### 示例代码
    ```Go
    sc := []constant.ServerConfig{
      *constant.NewServerConfig("${serverAddr}", 8848, constant.WithContextPath("/nacos")),
    }

    //create ClientConfig
    cc := *constant.NewClientConfig(
      constant.WithUsername("${username}"),
      constant.WithPassword("${password}"),
    )

    // create client
    namingClient, err := clients.NewNamingClient(
      vo.NacosClientParam{
        ClientConfig:  &cc,
        ServerConfigs: sc,
      },
    )

    configClient, err := clients.NewConfigClient(
      vo.NacosClientParam{
        ClientConfig:  &cc,
        ServerConfigs: sc,
      },
    )
    ```
  </TabItem>
  <TabItem label="其他语言">
     待补充
  </TabItem>
</Tabs>

## 2. OpenAPI如何配置鉴权信息

首先需要使用用户名和密码登陆nacos。

```powershell
curl -X POST '127.0.0.1:8848/nacos/v1/auth/login' -d 'username=nacos&password=nacos'
```

若用户名和密码正确,返回信息例如:

```
{"accessToken":"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYWNvcyIsImV4cCI6MTYwNTYyOTE2Nn0.2TogGhhr11_vLEjqKko1HJHUJEmsPuCxkur-CfNojDo","tokenTtl":18000,"globalAdmin":true}
```

接下来进行配置信息或服务信息时,应当使用该accessToken鉴权,在url后添加参数`accessToken=$accessToken`,其中$accessToken为登录时返回的token信息，例如

```powershell
curl -X GET '127.0.0.1:8848/nacos/v2/cs/config?accessToken=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYWNvcyIsImV4cCI6MTYwNTYyMzkyM30.O-s2yWfDSUZ7Svd3Vs7jy9tsfDNHs1SuebJB4KlNY8Q&dataId=nacos.example.1&group=nacos_group'
```

```powershell
curl -X POST 'http://127.0.0.1:8848/nacos/v2/ns/instance?accessToken=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYWNvcyIsImV4cCI6MTYwNTYyMzkyM30.O-s2yWfDSUZ7Svd3Vs7jy9tsfDNHs1SuebJB4KlNY8Q&port=8848&healthy=true&ip=11.11.11.11&weight=1.0&serviceName=nacos.test.3'
```
