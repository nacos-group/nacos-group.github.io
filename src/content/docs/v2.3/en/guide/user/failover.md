---
title: Java Client Disaster Recovery
keywords: [Java Client Disaster Recovery, Data Source for Disaster Recovery, Disk Disaster Recovery, SPI Extension, Nacos Server Issues]
description: This article delves into the disaster recovery mechanisms for Java clients, explaining how to maintain client stability when facing Nacos server issues by启用 local disaster recovery and leveraging cached data. It elaborates on two usage scenarios, the disaster recovery process, specifics of disk disaster recovery implementation, and the method for customizing and extending disaster recovery data sources.
---

# Java Client Disaster Recovery

We can enable local disaster recovery on the client side to ensure data and API stability when the Nacos server encounters issues.

There are two application scenarios:

1. During Nacos server deployment, we proactively activate disaster recovery, allowing clients to solely use local disaster recovery data. This ensures that fluctuations or errors in Nacos server data do not affect clients. We then disable disaster recovery after the upgrade is complete and data validation is successful.
2. If Nacos services unexpectedly become unavailable or exhibit data anomalies during operation, we can swiftly enable disaster recovery, enabling clients to utilize this backup data. This minimizes the impact window on services until the Nacos server is restored and disaster recovery can be deactivated.

Refer to https://github.com/alibaba/nacos/issues/11053 for a detailed solution.

## Brief Process Overview

[Image Description: Illustrates the flow where client queries first pass through the FailoverReactor. If data is available, it is used directly, bypassing data from the Nacos Server; otherwise, the normal process of fetching data from ServiceInfoHolder proceeds.]

## Disk Disaster Recovery

The data within the FailoverReactor can leverage different data sources, with the default being disk storage.

### Disk Disaster Recovery Directory

The default directory for disk disaster recovery files is:

```
{user.home}/nacos/naming/{namespace}/failover
```

This directory can be customized using the `-DJM.SNAPSHOT.PATH=/mypath` parameter, changing the disaster recovery disk file directory to:

```
/mypath/nacos/naming/{namespace}/failover
```

### Disaster Recovery Switch on Disk

The disaster recovery switch resides in a file within the disk disaster recovery directory, named:

```
00-00---000-VIPSRV_FAILOVER_SWITCH-000---00-00
```

The file contains a digit, 0 for disabling or 1 for enabling disaster recovery.

### Disk Disaster Recovery Data

Disaster recovery data is divided across multiple files stored in the disk disaster recovery directory. Each file contains the disaster recovery data for a single service, with filenames formatted as:

```
{group.name}%40%40{service.name}
```

Content includes a JSON serialized string of the ServiceInfo class.

## Expanding Disaster Recovery Data Sources

While disk-based disaster recovery is dependency-free and simple, managing it can be cumbersome. Therefore, we also support SPI extensions for using storage beyond disk. Below are the steps for such an extension.

### Developing a Custom Disaster Recovery Data Source Class

Implement the interface `com.alibaba.nacos.client.naming.backups.FailoverDataSource`:

```java
public class MyFailoverDataSource implements FailoverDataSource {
    @Override
    public FailoverSwitch getSwitch() {
        // Implement your logic here.
        return null;
    }

    @Override
    public Map<String, FailoverData> getFailoverData() {
        // Provide your implementation. For the naming module, the map should associate service names with ServiceInfo instances.
        return null;
    }
}
```

### Configuring the Disaster Recovery Data Source Class

Create a file under the resource directory:

```
{resource.root}/META-INF/services/com.alibaba.nacos.client.naming.backups.FailoverDataSource
```

An example of {resource.root} is `src/main/resources`.

File content should be:

```
your.package.MyFailoverDataSource
```