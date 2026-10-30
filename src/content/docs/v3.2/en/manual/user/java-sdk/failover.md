---
title: Java SDK Failover
keywords: [Failover]
description: Java SDK failover manual
sidebar:
  order: 4
---

# Java SDK Failover

You can enable local failover on the client side to keep client data and API behavior stable when the Nacos server has problems.

There are two typical scenarios:

1. During a Nacos server release, proactively enable failover so clients use only local failover data. Data fluctuation or incorrect data from the Nacos server will not affect clients. Disable failover after the Nacos server upgrade is complete and the data has been verified.
2. During Nacos runtime, if APIs suddenly become unavailable or data becomes abnormal, quickly enable failover so clients use failover data. This reduces the impact window. Disable failover after the Nacos server recovers.

For the detailed proposal, see https://github.com/alibaba/nacos/issues/11053.

## 1. Process Overview

<img width="1000" alt="image" src="https://github.com/alibaba/nacos/assets/4593375/f9011075-11b8-401b-9dbb-1366347a9a44" />

As shown above, client query requests first pass through `FailoverReactor`. If `FailoverReactor` has data, the client uses it directly and ignores data returned by Nacos Server. If `FailoverReactor` has no data, the client follows the normal flow and reads cached data from `ServiceInfoHolder`.

## 2. Disk Failover

Data in `FailoverReactor` can come from different data sources. The default data source is disk.

### 2.1. Disk Failover File Directory

The default disk failover file directory is:

```
{user.home}/nacos/naming/{namespace}/failover
```

You can customize this directory by setting the `-D` parameter:

```
-DJM.SNAPSHOT.PATH=/mypath
```

Then the failover disk file directory becomes:

```
/mypath/nacos/naming/{namespace}/failover
```

### 2.2. Disk Failover Switch

The failover switch is stored in a file under the disk failover directory. The file name is:

```
00-00---000-VIPSRV_FAILOVER_SWITCH-000---00-00
```

The file stores `0` or `1`. `0` means failover is disabled, and `1` means failover is enabled.

### 2.3. Disk Failover Data

Failover data is split into multiple files under the disk failover directory. Each file stores failover data for one service. The file name format is:

```
{group.name}%40%40{service.name}
```

The file content is a JSON-serialized string of the client's `ServiceInfo` class. Example:

```
{
    "name":"DEFAULT_GROUP@@test.2",
    "groupName":"DEFAULT_GROUP",
    "clusters":"",
    "cacheMillis":10000,
    "hosts":[
        {
            "instanceId":"1.1.2.1#8888#DEFAULT#DEFAULT_GROUP@@test.2",
            "ip":"1.1.2.1",
            "port":8888,
            "weight":1,
            "healthy":true,
            "enabled":true,
            "ephemeral":true,
            "clusterName":"DEFAULT",
            "serviceName":"DEFAULT_GROUP@@test.2",
            "metadata":{
                "k1":"v1"
            },
            "instanceHeartBeatInterval":5000,
            "instanceHeartBeatTimeOut":15000,
            "ipDeleteTimeout":30000
        }
    ],
    "lastRefTime":1689835375819,
    "checksum":"",
    "allIPs":false,
    "reachProtectionThreshold":false,
    "valid":true
}
```

## 3. Extend the Failover Data Source

Disk failover does not require external dependencies and has simple logic, but it can be inconvenient to manage. Nacos also supports extending failover data sources through SPI so you can use storage other than disk.

### 3.1. Develop a Custom Failover Data Source

Write a class that implements `com.alibaba.nacos.client.naming.backups.FailoverDataSource`:

```
public class MyFailoverDataSource implements FailoverDataSource {
    
    @Override
    public FailoverSwitch getSwitch() {
        // TODO write your own implementation.
        return null;
    }
    
    @Override
    public Map<String, FailoverData> getFailoverData() {
        // TODO write your own implementation. For naming module, the map
        // should contain failover data with service name as key and ServiceInfo as value
        return null;
    }
}
```

### 3.2. Configure the Failover Data Source

Create the following file under the resource directory:

```
{resource.root}/META-INF/services/com.alibaba.nacos.client.naming.backups.FailoverDataSource
```

An example of `{resource.root}` is `src/main/resources`.

The file content is:

```
your.package.MyFailoverDataSource
```
