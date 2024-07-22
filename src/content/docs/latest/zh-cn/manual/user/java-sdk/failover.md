---
title: Java SDK 容灾
keywords: [容灾]
description: Java客户端容灾用户指南
sidebar:
    order: 3
---

# Java SDK 容灾

我们可以在客户端开启本地容灾，用来应对Nacos服务端出现问题时，保证客户端的数据和接口稳定性。

这里有两个使用场景：

1. 在Nacos服务端发布的时候，我们主动把容灾打开，这样客户端只使用本地容灾数据，Nacos服务的数据抖动或者数据错误都不会影响客户端，我们在Nacos服务端升级完成并且数据验证没问题后再关闭容灾；
2. 在Nacos运行期间，突然出现接口不可用或者数据异常，我们可以快速的开启容灾，让客户端使用容灾数据，减小服务受影响的窗口，等Nacos服务端恢复后再关闭容灾；

具体方案可以参考：https://github.com/alibaba/nacos/issues/11053

## 1. 流程简介

<img width="1000" alt="image" src="https://github.com/alibaba/nacos/assets/4593375/f9011075-11b8-401b-9dbb-1366347a9a44" />

如上图所示，客户端的查询请求都会先经过FailoverReactor，如果FailoverReactor有数据，则直接使用，从而忽略掉Nacos Server返回的数据；如果FailoverReactor里面没有数据，则走正常流程，从ServiceInfoHolder里读取缓存；

## 2. 磁盘容灾

FailoverReactor里的数据可以使用不同的数据源，默认的数据源为磁盘。

### 2.1. 磁盘容灾文件目录

默认的磁盘容灾文件目录为：

```
{user.home}/nacos/naming/{namespace}/failover
```

这个目录可以定制，如果设置了-D参数：

```
-DJM.SNAPSHOT.PATH=/mypath
```

则容灾磁盘文件目录变为：

```
/mypath/nacos/naming/{namespace}/failover
```

### 2.2. 磁盘容灾开关

容灾开关存放在磁盘容灾文件目录下的一个文件里，具体文件名为：

```
00-00---000-VIPSRV_FAILOVER_SWITCH-000---00-00
```

文件里存放一个数字0或者1，0代表关闭容灾，1代表打开容灾

### 2.3. 磁盘容灾数据

容灾的数据分成多个文件，都是存放在磁盘容灾文件目录下，每一个文件存储一个单独的服务的容灾数据，每个文件的文件名格式如下：

```
{group.name}%40%40{service.name}
```

里面的内容为客户端的ServiceInfo类的JSON序列化字符串，例如：

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

## 3. 扩展容灾数据源

磁盘容灾不需要外部依赖，逻辑比较简单，但是管理起来不太方便。因此我们也支持使用SPI来扩展容灾数据源，使用磁盘以外的存储。以下是扩展的步骤。

### 3.1. 开发自己的容灾数据源类

编写一个类，实现接口com.alibaba.nacos.client.naming.backups.FailoverDataSource：

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

### 3.2. 配置容灾数据源类

在资源目录下新建文件：

```
{resource.root}/META-INF/services/com.alibaba.nacos.client.naming.backups.FailoverDataSource
```

{resource.root}的一个例子是src/main/resources。

文件内容为：

```
your.package.MyFailoverDataSource
```