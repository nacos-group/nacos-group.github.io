---
title: FAQ
keywords: [Nacos,FAQ]
description: Nacos FAQ
sidebar:
    order: 6
---

# FAQ

> Document optimizing...

- Nacos standard questions
  - [What is Nacos](#1.1)
  - [Nacos how to support more than the environment](#1.2)
  - [Nacos whether production is available](#1.3)
  - [Nacos dependent](#1.4)
  - [Nacos using open source licenses](#1.5)

- Nacos operational questions
  - [Nacos standalone deployment](#2.1)
  - [Nacos standalone deployment using Mysql](#2.2)
  - [Nacos production deployment](#2.3)
  - [Nacos Docker deployment](#2.4)
  - [How to deploy in k8s Nacos](#2.5)
  - [How to monitor Nacos](#2.6)
  - [Nacos cannot start in Docker, always print Nacos is starting...](#2.7)

- Nacos used questions
  - [Zookeeper service can be migrated to Nacos?](#3.1)
  - [Nacos support multiple configuration files](#3.2)
  - [Nacos support Dubbo](#3.3)
  - [Nacos support Spring system](#3.4)
  - [Don't use Nacos SDK how to access the Nacos](#3.5)
  - [Nacos support for multiple languages](#3.6)
  - [Nacos 0.8 version logon failure](#3.7)
  - [Server error `java.lang.IllegalStateException: unable to find local peer: 127.0.0.1:8848`](#3.8)
  - [Nacos configuration for encryption](#3.9)
  - [Nacos at 401 error](#3.10)
  - [Nacos weight not to take effect](#3.11)
  - [Nacos how to enlarge shrinks capacity](#3.12)
  - [Nacos client modify the log level](#3.13)
  - [Nacos and Zipkin integration `Service not found` error](#3.14)
  - [Why service registration is successful, the console can't see](#3.15)
  - [`com.alibaba.nacos.consistency.entity` can't be found in source codes](#3.19)
  - [`the length of secret key must great than or equal 32 bytes...`](#3.20)
  - [`The specified key byte array is x bits ...`](#3.20)

- Nacos principle questions

## Nacos standard questions
<h4 id="1.1">What is Nacos</h4>

Nacos dedicated to help you find, micro configuration and management services. Nacos provides a set of simple and easy to use feature set, help you quickly realize dynamic service discovery, service configuration, service metadata, and traffic management. Details you can refer to [Nacos website](../../what-is-nacos.md).

<h4 id="1.2">Nacos how to support more than the environment</h4>

In daily use are often need different environment, such as daily, pretest, online environment, if it is a logical isolation, can use the namespace Nacos support namespace to support more environmental isolation, can create multiple namespaces in Nacos console. If you need physical isolation, will deploy more sets of Nacos environment.

<h4 id="1.3">Nacos whether production is available</h4>

Nacos in January 2019 issued a Pre - GA version, to support the security isolation, monitoring and service migration on the last mile of production, in a more stable support the user's production environment. Details you can refer to [Nacos release v0.8.0 Pre - GA version, the safe and stable production](https://www.oschina.net/news/104019/nacos-0-8-0-pre-ga).

<h4 id="1.4">Nacos dependent</h4>

In stand-alone mode, Nacos without any rely on, in cluster mode, Nacos rely on Mysql storage, details you can refer to [Nacos deployment](../admin/deployment.md).

<h4 id="1.5">Nacos using open source licenses</h4>

Nacos using [Apache 2.0](https://github.com/alibaba/nacos/blob/master/LICENSE).

## Nacos operational questions
<h4 id="2.1">Nacos standalone deployment</h4>

You can refer to the manual Nacos website deployment [quick start](../../quickstart/quick-start.mdx).

<h4 id="2.2">Nacos standalone deployment using Mysql</h4>

Nacos stand-alone mode defaults to using the embedded database as the storage engine, if you want to change your mysql installation, you can refer to [website document](../admin/deployment.md).

<h4 id="2.3">Nacos production deployment</h4>

Production environment using Nacos in order to achieve high availability cannot use stand-alone mode, need to build Nacos cluster, specific details can refer to [the manual cluster deployment](../admin/cluster-mode-quick-start.md).

<h4 id="2.4">Nacos Docker deployment</h4>

In addition to using compressed package deployment Nacos, Nacos also provides a corresponding Docker image, when Nacos release new versions, Nacos will release the corresponding image version supports Docker deployment.Specific details you can refer to [Nacos Docker](../../quickstart/quick-start-docker.mdx).

<h4 id="2.5">How to deploy in k8s Nacos</h4>

In production deployment Nacos cluster, if for Nacos expansion operation, need to manually change the cluster IP file, start a new Nacos service.In order to automate operations, k8s Nacos and combined use of StatefulSets provides automatic operations plan, to dynamic scalability Nacos capacity, specific details reference [Kubernetes Nacos](https://github.com/nacos-group/nacos-k8s/blob/master/README.md).

<h4 id="2.6">How to monitor Nacos</h4>

Nacos0.8 version provides the Metrics data exposed ability, can pass the Metrics data to monitor the running status of Nacos, the content of the details you can refer to [Nacos monitor](../admin/monitor-guide.md).

<h4 id="2.7">Nacos cannot start in Docker, always print Nacos is starting...</h4>

The reason may be due to insufficient memory in the Docker environment, causing other services to fail to start normally, and finally causing the service to report an error and keep restarting. You can try to solve it by increasing the Docker memory limit.

## Nacos used questions
<h4 id="3.1">Zookeeper service can be migrated to Nacos?</h4>

Can through the Nacos - Sync moved the Zookeeper service and Nacos, can also be migrated from Nacos Zookeeper, specific details can be used as [Nacos Sync reference](https://github.com/paderlol/nacos-sync-example).

<h4 id="3.2">Nacos support multiple configuration files</h4>

Nacos through Spring Cloud Alibaba Nacos Config support multiple configuration files, configuration can be stored in a separate configuration file.The associated [issue](https://github.com/alibaba/nacos/issues/320), details refer to the document [Spring Cloud Alibaba Nacos Config](https://github.com/spring-cloud-incubator/spring-cloud-alibaba/wiki/Nacos-config).

<h4 id="3.3">Nacos support Dubbo</h4>

Nacos version 0.6 and Dubbo integration, support the use of Nacos as registry, related [issue](https://github.com/alibaba/nacos/issues/390), details refer to the document [Nacos and Dubbo fusion become registry](../../ecology/use-nacos-with-dubbo.md).

<h4 id="3.4">Nacos support Spring system</h4>

Nacos perfect supports the Sping technology stack, details refer to the document [Nacos Spring](../../ecology/use-nacos-with-spring.md)、[Nacos Spring Boot](../../ecology/use-nacos-with-spring-boot.md)、[Spring Cloud](../../ecology/use-nacos-with-spring-cloud.md).

<h4 id="3.5">Don't use Nacos SDK how to access the Nacos</h4>

Nacos network interaction is implemented based on Http protocol, provides the [Open-API](./open-api.md) can easily achieve Nacos access.

<h4 id="3.6">Nacos support for multiple languages</h4>

Nacos currently only supports Java, support for other languages are being developed, also need your support to build together.

<h4 id="3.7">Nacos 0.8 version logon failure</h4>

Nacos version 0.8 when using its and no `JAVA_HOME` environment variable, Nacos can launch successful, because `yum install` installed its the Java command to register a beneath `/bin` directory, and so can cause abnormal `SignatureException`.This problem has been repair, version 0.9 release, the specific details can refer to the [issue](https://github.com/alibaba/nacos/issues/711).

<h4 id="3.8">Server error java.lang.IllegalStateException: unable to find local peer: 127.0.0.1:8848</h4>

This problem because Nacos get native IP, don't get to the correct external IP. The need to guarantee the `InetAddress.getLocalHost().getHostAddress()` or the result of the `hostname -i` was with the cluster. The conf configuration of IP is the same.

<h4 id="3.9">Nacos configuration for encryption</h4>

Nacos plan in 1.X version's ability to provide encryption, currently does not support encryption, can only rely on the SDK prepared encryption endures Nacos again.

<h4 id="3.10">Nacos at 401 error</h4>

Nacos server error, check the server logs, refer to the [issue](https://github.com/alibaba/nacos/issues/816).

<h4 id="3.11">Nacos weight not to take effect</h4>

Nacos console editors weights, at present from SpringCloud client and Dubbo client didn't get through, so can't take effect. For SpringCloud client application can realize the load balancer Ribbon for weighting filter.

<h4 id="3.12">Nacos how to enlarge shrinks capacity</h4>

Currently supported modify the `cluster.conf` file in a way that expanding capacity, after the change without restart, the Server will automatically refresh the new content to the file.

<h4 id="3.13">Nacos client modify the log level</h4>

Configuration - D parameters `com.alibaba.nacos.naming.log.level` set naming the client log level, such as setting for the error:`-Dcom.alibaba.nacos.naming.log.level=error` Similarly, - D parameters `com.alibaba.nacos.config.log.level` is used to set the config client log level.

<h4 id="3.14">Nacos and Zipkin integration Service not found error</h4>

Configuration `spring-cloud-seluth` parameters: `spring.zipkin.discovery-client-enabled=false`.

If there is still a `Service not found` error, is recommended to use the open-api will Zipkin-server instance is registered as a permanent Service:

`curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?port=9411&healthy=true&ip=127.0.0.1&weight=1.0&serviceName=zipkin-server&ephemeral=false&namespaceId=public'`

Then, went to nacos console, find a service called `zipkin-server` service, find the cluster configuration, set the health examination mode to `TCP`, port number of `9411` (zipkin-server port).

<h4 id="3.15">Why service registration is successful, the console can't see</h4>

This problem appeared in cluster mode, in the use of nacos cluster pattern, ensure that all of the machine time is consistent, can appear otherwise unable to synchronize data.

<h4 id="3.19"> `com.alibaba.nacos.consistency.entity` can't be found in source codes</h4>

This package will be auto-generated by `protobuf`, so if you want to read source code or do some develop, you can use `mvn compile` to generate them. If you are using IDEA, you can also use IDEA's protobuf plugin.

<h4 id="3.20">java.lang.IllegalArgumentException: the length of secret key must great than or equal 32 bytes...</h4>
<h4 id="3.21">java.lang.IllegalArgumentException: The specified key byte array is x bits which is not secure enough for any JWT HMAC-SHA algorithm.</h4>

The default authentication plugin needs a secret key to generate an access token, and the secret key format needs to have a length greater than 32. If the length of `secret.key` after BASE64 decryption is less than 32, this error will occur during the startup process.
You can set the correct `secret.key` in `application.properties`, see [User Guide - Authorization Authentication](./auth.md) for details.

<h4 id="3.22">Error：Empty identity, Please set `nacos.core.auth.server.identity.key` and `nacos.core.auth.server.identity.value`</h4>

Since 2.2.1, the default value of `nacos.core.auth.server.identity.key` and `nacos.core.auth.server.identity.value` has been removed and will be checked during server starting.
If the auth feature enabled but no `nacos.core.auth.server.identity.key` and `nacos.core.auth.server.identity.value` configured, nacos server will stop bootstrap and hint with the error message.
Please see [User Guide - Authorization Authentication](./auth.md) to configure them and restart.


## Nacos principle questions
