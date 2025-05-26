---
title: Nacos supports three types of deployment modes
keywords: [Nacos,deployment modes]
description: Nacos supports three types of deployment modes
sidebar:
    order: 1
---

> Document optimizing...

# Nacos deployment environment

Nacos is defined as an IDC internal application component, not a product for the public network environment. It is not recommended expose it to the public network environment directly.

All network related concepts such as VIP and network interface mentioned in the following documents are in the **internal network environment**.

# Nacos supports three types of deployment modes

* Standalone Mode - used in DEV or TEST environment.
* Cluster Mode - used in production environment to ensure high-availability.
* Multi-Cluster Mode - in complicated production mode, you may want to deploy multi-cluster mode to support different business units.

# Environment preparation
- JDK installed, 1.8 and above are required
- Recommendation: 2 core CPU / 4G RAM and above
- Recommendation: Production environment with 3 nodes and above

## Running Nacos in Standalone Mode

### Linux/Unix/Mac

* Standalone means it is non-cluster Mode. * 
sh startup.sh -m standalone

### Windows

* Standalone means it is non-cluster Mode. * 
cmd startup.cmd -m standalone

### Running Nacos with mysql in Standalone Mode

#### Initialize MySQL database

[sql statement source file](https://github.com/alibaba/nacos/blob/master/distribution/conf/mysql-schema.sql)

#### application.properties configuration

[application.properties configuration file](https://github.com/alibaba/nacos/blob/master/distribution/conf/application.properties)

add mysql datasource and configure url, user and password 

```
spring.datasource.platform=mysql

db.num=1
db.url.0=jdbc:mysql://11.162.196.16:3306/nacos_devtest?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
db.user=nacos_devtest
db.password=youdontknow
```

## Running Nacos in Multi-Node Cluster Mode

[Nacos in Multi-Node Cluster Mode](./cluster-mode-quick-start.md)


## Deploy Nacos in Multi-Cluster Mode

Nacos support a NameServer route request mode， by which you can design a useful mapping rule to control the request forward to the corresponding cluster, in the mapping rule you can sharding the request by namespace or by tenant etc...

to setup a NameServer:

## IP Selection of Multiple Network Cards

When the local environment is complex, the Nacos service needs to choose IP or network card to use at runtime when it starts up. Nacos Gets IP Reference Spring Cloud Design from Multiple Network Cards. With the nacos.inetutils parameter, you can specify the network card and IP address used by Nacos. The configuration parameters currently supported are:

- ip-address parameter can set Nacos IP directly

```
nacos.inetutils.ip-address=10.11.105.155
```

- use-only-site-local-interfaces parameter allows Nacos to use LAN ip, which is useful when Nacos deploys a machine with multiple network cards

```
nacos.inetutils.use-only-site-local-interfaces=true
```

- ignored-interfaces parameter support network card arrays, allowing Nacos to ignore multiple network cards

```
nacos.inetutils.ignored-interfaces[0]=eth0
nacos.inetutils.ignored-interfaces[1]=eth1
```

- preferred-networks parameter allow Nacos to select the matching IP preferentially and support regular matching and prefix matching

```
nacos.inetutils.preferred-networks[0]=30.5.124.
nacos.inetutils.preferred-networks[0]=30.5.124.(25[0-5]|2[0-4]\\d|((1d{2})|([1-9]?\\d))),30.5.124.(25[0-5]|2[0-4]\\d|((1d{2})|([1-9]?\\d)))
```
