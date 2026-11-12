---
title: Cluster deployment instructions
keywords: [Cluster,deployment]
description: Cluster deployment instructions
sidebar:
    order: 2
---

# Cluster deployment instructions

> Document optimizing...

## Cluster Mode Deployment

This Quick Start Manual is to help you quickly download, install and use Nacos on your computer to deploy the cluster mode for production use.

### Cluster Deployment Architecture

Therefore, when it is open source, it is recommended that users put all server lists under a vip and then hang under a domain name.

Http://ip1:port/openAPI Directly connected to ip mode, the machine needs to be modified to use ip.

Http://SLB:port/openAPI Mount the SLB mode(Intranet, do not expose internet to avoid security risks), directly connect to SLB, the following server ip real ip, readability is not good.

Http://nacos.com:port/openAPI Domain name + SLB mode(Intranet, do not expose internet to avoid security risks), good readability, and easy to change ip, recommended mode

![deployDnsVipMode.jpg](/img/deployDnsVipMode.jpg)  

## 1. Preparing for the Environment

Make sure that it is installed and used in the environment:

1. 64 bit OS Linux/Unix/Mac, recommended Linux system.
2. 64 bit JDK 1.8+; [Download](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html). [Configuration](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javome_t/).
3. Maven 3.2.x+; [Download](https://maven.apache.org/download.cgi). [Configuration](https://maven.apache.org/settings.html).
4. 3 or more Nacos Nodes;

## 2. Download source code or installation package

You can get Nacos in two ways.

### Download source code from Github

```bash
unzip nacos-source.zip
cd nacos/
mvn -Prelease-nacos clean install -U  
cd nacos/distribution/target/nacos-server-1.3.0/nacos/bin
```

### Download Compressed Packet after Compilation

Download address

Select the latest stable version from [releases](https://github.com/alibaba/nacos/releases) and download `nacos-server-$version.zip` or `nacos-server-$version.tar.gz`

```bash
  unzip nacos-server-$version.zip  OR tar -xvf nacos-server-$version.tar.gz
  cd nacos/bin
```  

## 3. Configuration Cluster Profile

In the Nacos decompression directory Nacos / conf directory, there is a configuration file cluster. conf, please configure each line as ip: port.

```plain
# ip:port
200.8.9.16:8848
200.8.9.17:8848
200.8.9.18:8848
```

### 3.1 Open Default auth plugin (Optional)

Then Setting configuration file `application.properties` under `conf`.

Setting 

```properties
nacos.core.auth.enabled=true
nacos.core.auth.system.type=nacos
nacos.core.auth.plugin.nacos.token.secret.key=${custom, make sure same in all nodes}
nacos.core.auth.server.identity.key=${custom, make sure same in all nodes}
nacos.core.auth.server.identity.value=${custom, make sure same in all nodes}
```
Detail see [Authentication](../../plugin/auth-plugin.md).

> Attention，Default value in Document `SecretKey012345678901234567890123456789012345678901234567890123456789` and `VGhpc0lzTXlDdXN0b21TZWNyZXRLZXkwMTIzNDU2Nzg=` is a public default, **only** should use in test temporary. Please **make sure** to replace it with another valid value when you actually deploy.

## 4. Determine The DataSource

### Using built-in data sources

No configuration is required

### Use an external data source

<!-- <span data-type="color" style="color:rgb(25, 31, 37)"><span data-type="background" style="background-color:rgb(255, 255, 255)"> </span></span> -->
production and use recommendations at least backup mode, or high availability database.

#### Initializes the MySQL database

[sql statement source file](https://github.com/alibaba/nacos/blob/master/distribution/conf/mysql-schema.sql)

### application. properties configuration

[application.properties configuration file](https://github.com/alibaba/nacos/blob/master/distribution/conf/application.properties)

## 5. start server

### Linux/Unix/Mac

#### Standalone mode

```bash
sh startup.sh -m standalone
```

#### Cluster mode

> Using built-in data sources

```bash
sh startup.sh -p embedded
```

> Use an external data source

```bash
sh startup.sh
```

## 6. Service Registration & Discovery and Configuration Management

### Service registration

`curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.10&port=8080'`

> Attention: If open default auth plugin, please call with username and password in header.

### Service discovery

`curl -X GET 'http://127.0.0.1:8848/nacos/v1/ns/instance/list?serviceName=nacos.naming.serviceName'`

> Attention: If open default auth plugin, please call with username and password in header.

### Publish configuration

`curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test&content=helloWorld"`

> Attention: If open default auth plugin, please call with username and password in header.

### get configuration

`curl -X GET "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test"`

> Attention: If open default auth plugin, please call with username and password in header.

## 7. shut down server

### Linux/Unix/Mac

```bash
sh shutdown.sh
```
