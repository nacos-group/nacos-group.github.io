---
title: NacosSync user guide
keywords: [NacosSync,migration,user guide]
description: NacosSync migration user manual
sidebar:
    order: 5
---

# NacosSync migration user guide

# Guide purposes
* Understand NacosSync service
* Start NacosSync service
* By a simple example, demonstrates how to register to the Zookeeper Dubbo client migrated to Nacos.

# Introduce
* NacosSync is a support for a variety of registry of synchronous components,based on the Spring boot development framework,Data layer uses the Spring Data JPA,follow the standard JPA access codes,support for multiple data storage,Default to Hibernate implementation, support table created automatically update more conveniently.
* Using efficient event driven asynchronous model, support a variety of custom events, make the synchronization task processing time delay control in 3s, 8C16G stand-alone can support 6 k synchronization tasks.
* NacosSync in addition to the standalone deployment, but also provides high availability cluster deployment patterns, NacosSync is stateless design, such as task status data migration to the database, the cluster expansion is very convenient.
* Abstraction is out of Sync core component interface, through annotations to distinguish synchronous type, allowing developers to easily according to their own needs, different registry to expand, has now supports synchronous type:
  * Nacos to Nacos data synchronization
  * Zookeeper to Nacos data synchronization
  * Nacos to the Zookeeper data synchronization 
  * Eureka to Nacos data synchronization
  * Consul to Nacos data synchronization
<a name="d384971e"></a>
## System module architecture:
![image.png](https://img.alicdn.com/tfs/TB12VPaJVzqK1RjSZSgXXcpAVXa-886-752.png)<br />The console<br />Provides concise Web console operation, support for internationalization.<br />
<a name="b3408d06"></a>
### Synchronization task management page
![](https://img.alicdn.com/tfs/TB1eSYyJ5LaK1RjSZFxXXamPFXa-2866-1064.png)
<a name="091bc34b"></a>
### Registry management page
<a name="53fdb015"></a>
## ![image.png](https://img.alicdn.com/tfs/TB1e_rdJ7voK1RjSZFNXXcxMVXa-2876-1124.png)
<a name="f6a633db"></a>
## Usage scenarios:
* Multiple network communication between the Region of Shared services, break the service call restriction of the Region.

![image.png](https://img.alicdn.com/tfs/TB1Mo6yJ4jaK1RjSZKzXXXVwXXa-1136-798.png)

* Two-way synchronization function, support Dubbo + Zookeeper service smooth migration to Dubbo + Naocs, enjoy Nacos more high quality service.

![image.png](https://img.alicdn.com/tfs/TB1Dza8J9zqK1RjSZPxXXc4tVXa-1728-838.png)

# Usage

## Preparatory work
Before you start the service, you need to install the following services:
* 64bit OS: Linux/Unix/Mac/Windows supported, Linux/Unix/Mac recommended.
* 64bit JDK 1.8+: [downloads](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html), [JAVA_HOME settings](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/).
* Maven 3.2.x+: [downloads](https://maven.apache.org/download.cgi), [settings](https://maven.apache.org/settings.html).
* MySql 5.6.+

## Get the installation package
There are two ways to obtain NacosSync installation package:
* Direct download NacosSync binary installation package:[nacosSync.${version}.zip](https://github.com/nacos-group/nacos-sync/releases)
* Download NacosSync source to build from the Github

Package:
```basic
cd nacosSync/
mvn clean package -U
```

The path of the target file:
```basic
nacos-sync/nacossync-distribution/target/nacosSync.${version}.zip
```

Unpack the installation package, project file directory structure:
```basic
nacosSync
├── LICENSE
├── NOTICE
├── bin
│   ├── nacosSync.sql
│   ├── shutdown.sh
│   └── startup.sh
├── conf
│   ├── application.properties
│   └── logback-spring.xml
├── logs
└── nacosSync-server.${version}.jar
```

## Initialize the database

The system default configuration database is Mysql, can also support other relational database.
1.The database construction, the default database name for "nacos_Sync".
2.The database table don't need to create separately, using the hibernate automatically by default build table function.
3.If you do not support automatic table, you can use the system's own build table SQL script, the script in the bin directory.

## Database configuration

Database configuration file on `conf/application.properties`:
```basic
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/nacos_sync?characterEncoding=utf8
spring.datasource.username=root
spring.datasource.password=root
```

## Start server

```bash
$ nacosSync/bin:
sh startup.sh  restart
```

## Check system status

1.Check system log

The path of the log in `nacosSync/logs/nacosSync.log`, check whether there are abnormal information.

2.Check system port

Port is the default system `8081`, you can define your own `application.properties`.

```bash
$netstat -ano|grep 8081
tcp        0      0 0.0.0.0:8081                0.0.0.0:*                   LISTEN      off (0.00/0/0)
```

## Console

Access path:
```
http://127.0.0.1:8081/#/serviceSync
```
![image.png](https://img.alicdn.com/tfs/TB1EKbkJ3HqK1RjSZFEXXcGMXXa-2866-606.png)

If there is no problem, check NacosSync has begun, normal NacosSync deployment structure:![image.png](https://img.alicdn.com/tfs/TB107nfJ9zqK1RjSZFjXXblCFXa-1412-342.png)

## Starting migration

### Migration information

Dubbo service deployment information:![image.png](https://img.alicdn.com/tfs/TB1Ci_eJ4TpK1RjSZR0XXbEwXXa-938-700.png)

The migration of services:

| Service Name | Version | Group Name |
| --- | --- | --- |
| com.alibaba.nacos.api.DemoService | 1.0.0 | zk |

### Add the registry cluster information

1.Click on the "cluster configuration" button in the left navigation bar, a new cluster, first add a Zookeeper cluster, select the cluster type for ZK.
![image.png](https://img.alicdn.com/tfs/TB1oJDnJ7voK1RjSZFwXXciCFXa-2870-1130.png)

> Note: the cluster name can customize, but once confirmed, cannot be modified, otherwise increase task based on the cluster, after NacosSync restart, success will not resume.

2.The same steps, increase Nacos cluster.
![image.png](https://img.alicdn.com/tfs/TB1HQPhJVzqK1RjSZFCXXbbxVXa-2846-1042.png)

3.After the completion of the add, can inquire on the list:
![image.png](https://img.alicdn.com/tfs/TB1AX6fJVYqK1RjSZLeXXbXppXa-2864-824.png)

### Add the synchronization task

1. Add a sync task, from Zookeeper cluster synchronization to Nacos cluster, synchronous granularity is service, it is called a Zookeeper cluster source cluster, Nacos cluster called target cluster.
![imagesd.png](https://img.alicdn.com/tfs/TB1tF_fJVYqK1RjSZLeXXbXppXa-2838-1138.png)

Add finished, can be in service sync list, view has add synchronization task:
![image.png](https://img.alicdn.com/tfs/TB1l6uJJ9zqK1RjSZPcXXbTepXa-2824-570.png)

2. The synchronization is completed, check whether the data synchronization to success Nacos cluster, can query through the Nacos console.
![image.png](https://img.alicdn.com/tfs/TB1tPneJ4TpK1RjSZR0XXbEwXXa-2872-828.png)

3. At the moment, the data has been successfully from Zookeeper cluster synchronization to Nacos cluster, the deployment structure is as follows:
![image.png](https://img.alicdn.com/tfs/TB14kriJ6TpK1RjSZKPXXa3UpXa-1724-772.png)

### Dubbo clients to connect to Nacos registry

#### Dubbo Consumer client migration

Dubbo has supported Nacos registry, support version 2.5 +, need to add a Nacos registry of Dubbo extensions depends on:
```basic
<dependency>
      <groupId>com.alibaba</groupId>
      <artifactId>dubbo-registry-nacos</artifactId>
			<version>0.0.2</version>
</dependency>
```

Increase Nacos client depends on:
```basic
<dependency>
        <groupId>com.alibaba.nacos</groupId>
        <artifactId>nacos-client</artifactId>
        <version>0.6.2</version>
</dependency>
```

Configuration Dubbo Consumer Dubbo profile `Consumer. The yaml`, let the client can find Nacos cluster.
```basic
spring:
  application:
name: dubbo-consumer
demo:
  service:
    version: 1.0.0
    group: zk
dubbo:
  registry:
    address: nacos://127.0.0.1:8848
```

Don't need to modify the code, configuration after the update, you can restart your application into law.

Consumer release is completed, the deployment of the structure is as follows:
![image.png](https://img.alicdn.com/tfs/TB181fkJ3HqK1RjSZFEXXcGMXXa-1734-878.png)

#### Dubbo Provider migration

Before you upgrade the Provider, you need to ensure that the Provider of services, are already configured in NacosSync, synchronous way from Nacos synchronization to Zookeeper, because the Provider connected to Nacos upgrade, you need to make sure that the old Dubbo Consumer client can subscribe to the Provider's address in the Zookeeper, now, we add a sync task:
![image.png](https://img.alicdn.com/tfs/TB1pdDnJ7voK1RjSZFwXXciCFXa-2872-1060.png)

![image.png](https://img.alicdn.com/tfs/TB19Ey_J6DpK1RjSZFrXXa78VXa-2842-660.png)

> Note: Nacos synchronization to the Zookeeper service, do not need to fill in the version number, you in choosing the source cluster, the version number of the input box automatically hidden.

Sync task is completed, you can upgrade the Provider, upgrade the Provider method, reference to upgrade the Consumer steps.

### New deployment structure
* In the process of upgrading, there will be new and old versions of the client at the same time, the deployment structure is as follows:

![image.png](https://img.alicdn.com/tfs/TB14Y_iJ3HqK1RjSZFPXXcwapXa-1728-838.png)

* All client migration is completed, the deployment structure is as follows:

![image.png](https://img.alicdn.com/tfs/TB1Cg2dJYvpK1RjSZPiXXbmwXXa-1466-864.png)

Now, the Zookeeper cluster, NacosSync cluster can get offline.

### Attention
* Synchronization task after adding, you need to ensure that the service is successful sync to the target cluster, can through the console the target cluster.
* NacosSync support high availability cluster pattern deployment, you only need to put the database can be configured to the same.
* Comb if not clear subscription and published service, suggested can do services are two-way synchronous.
* Dubbo client currently does not support Nacos weighting function, if you are using the weight function, need to reconsider the plan.
