---
title: Java Client Failover
keywords: [Failover]
description: Java client failover user guide
sidebar:
    order: 7
    hidden: true
---

# Java Client Failover

We can turn on the local data failover feature to handle the situation when Nacos server side is unstable or has problematic data.

There are two typical scenarios:

1. When Nacos server is in deployment, we can switch on the failover so the clients use local data only. The data anomaly or oscillation at Nacos server won't affect the clients. After the deployment and the data verification are done, we can switch off the failover feature.
2. When there is a sudden data anomaly at Nacos server at runtime, we can turn on the failover feature to prevent Nacos clients using wrong data.

The full detailed solution description can be found in https://github.com/alibaba/nacos/issues/11053

## Procedures

<img width="1000" alt="image" src="https://github.com/alibaba/nacos/assets/4593375/f9011075-11b8-401b-9dbb-1366347a9a44" />

As shown above, the query requests to Nacos client would first be checked by FailoverReactor, and only if FailoverReactor has no related data, can the requests move on to query ServiceInfoHolder.

## Disk based Failover

FailoverReactor can select different data sources. Disk is the default option.

### Disk Failover File Path

The default path of disk failover files are:

```
{user.home}/nacos/naming/{namespace}/failover
```

This path can be customised via -D argument:

```
-DJM.SNAPSHOT.PATH=/mypath
```

So the path becomes:

```
/mypath/nacos/naming/{namespace}/failover
```

### Disk Failover Switch

The disk failover switch is stored in a file with name:

```
00-00---000-VIPSRV_FAILOVER_SWITCH-000---00-00
```

The content of this file is just a number 0 or 1, where 0 represents failover is off, 1 is on.

### Disk Failover Data

The disk failover data is stored in multiple files under the failover path. Each file stores the failover data for a single service.

The file name is in the following format:

```
{group.name}%40%40{service.name}
```
The content in the file is the JSON string of one ServiceInfo object, for instance:

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

## Extent Failover Data Source

Disk failover is simple and requires no extra remote components. But sometimes we may want to use another kind of data source, such as Redis, Mysql, etc.

Now we support extending the failover data source with SPI mechanism. Here are the steps:

### Develop Your Own Failover Data Source

Write a class and implement the interface com.alibaba.nacos.client.naming.backups.FailoverDataSource:

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

### Configure Failover Data Source Class

Create a file under the resource root path:

```
{resource.root}/META-INF/services/com.alibaba.nacos.client.naming.backups.FailoverDataSource
```

One example of `{resource.root}` is src/main/resources.

The file content is:   

```
your.package.MyFailoverDataSource
```