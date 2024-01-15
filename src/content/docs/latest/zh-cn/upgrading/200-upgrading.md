---
title: Nacos 2.0 升级文档
keywords: [Nacos,2.0,升级]
description: Nacos 2.0 升级文档
sidebar:
    order: 2
---

> 文档优化中......

# Nacos 2.0.0 部署及升级文档

本文档包含两个部分：Nacos2.0.0的部署，以及如何从Nacos1.x平滑升级至Nacos2.0.0。

部署部分，适用于直接部署Nacos2.0.0以上版本的用户。

升级部分，适用于从Nacos1.X版本平滑升级到Nacos2.0.0版本（以及2.0.0-BETA版本）的用户。Nacos2.0.0-ALPHA版本无法进行平滑升级，请勿参照本文档进行升级。

由于Nacos1.X和Nacos2.0的数据结构发生了变化，为了能够完成平滑升降级，需要将数据进行双写，分别生成Nacos1和Nacos2的数据结构进行存储。因此会对性能有一定影响。当集群升级并稳定运行后，可以关闭双写，关闭双写后将会失去平滑降级的功能。

> 在Nacos2.1.0版本后，默认关闭了双写能力，因此无法支持从Nacos1.X版本平滑升级到2.1.0的能力，若需要使用平滑升级能力，从Nacos1.X直接升级到Nacos2.1.0版本，需要在application.properties文件中设置配置nacos.core.support.upgrade.from.1x=true.

# 部署步骤

本部分，适用于直接部署Nacos2.0.0以上版本的用户。

## 1.预备环境准备

Nacos 依赖 [Java](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/) 环境来运行。如果您是从代码开始构建并运行Nacos，还需要为此配置 [Maven](https://maven.apache.org/index.html)环境，请确保是在以下版本环境中安装使用:

1. 64 bit OS，支持 Linux/Unix/Mac/Windows，推荐选用 Linux/Unix/Mac。
2. 64 bit JDK 1.8+；[下载](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) & [配置](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/)。
3. Maven 3.2.x+；[下载](https://maven.apache.org/download.cgi) & [配置](https://maven.apache.org/settings.html)。

## 2.下载源码或者安装包

你可以通过源码和发行包两种方式来获取 Nacos。

### 从 Github 上下载源码方式

```bash
git clone https://github.com/alibaba/nacos.git
cd nacos/
mvn -Prelease-nacos -Dmaven.test.skip=true clean install -U  
ls -al distribution/target/

// change the $version to your actual path
cd distribution/target/nacos-server-$version/nacos/bin

```
  
### 下载编译后压缩包方式

您可以从 [最新稳定版本](https://github.com/alibaba/nacos/releases) 下载 `nacos-server-$version.zip` 包。


```bash
  unzip nacos-server-$version.zip 或者 tar -xvf nacos-server-$version.tar.gz
  cd nacos/bin
```  


## 3.启动服务器

### Linux/Unix/Mac 

单机启动命令(standalone代表着单机模式运行):

`sh startup.sh -m standalone`

如果您使用的是ubuntu系统，或者运行脚本报错提示[[符号找不到，可尝试如下运行：

`bash startup.sh -m standalone`

单机启动，使用内置数据库（注：使用内置Derby数据库需要保证~/nacos/data/derby-data文件夹下无残留数据）：

`bash startup.sh -p embedded`

集群启动（使用内嵌数据库）：

`bash startup.sh -p embedded`

集群启动（使用外置数据库）：

`bash startup.sh`

## 4.启动后自检

集群中所有机器部署为2.0.X版本并启动时，应当进行启动之后的检查。

当集群中所有节点logs/naming-server.log日志中观察到upgrade check result true及Upgrade to 2.0.X，便判定为集群准备完毕时，此时才可以使用Nacos2.0。

## 5.关闭双写

为了节省性能开销，当集群部署完成后，可以先观察一段时间运行情况，当确认无误后，可以关闭双写，从而释放性能，具体的关闭方式是通过API进行：

`curl -X PUT 'localhost:8848/nacos/v1/ns/operator/switches?entry=doubleWriteEnabled&value=false'`

关闭后可以从`logs/naming-server.log`日志中观察到`Disable Double write, stop and clean v1.x cache and features`字样。说明关闭双写。

**注意**，关闭双写后无法在进行平滑降级，请先确认关闭前集群正确运行。

## 6.关闭服务器

### Linux/Unix/Mac 

`sh shutdown.sh`

### Windows

`cmd shutdown.cmd`

或者双击shutdown.cmd运行文件。

# 升级步骤

以linux系统为例。window系统请自行替换`sh`脚本为`cmd`脚本。

## 1. 停止旧节点

选择集群中一台Nacos1.X节点，使用Nacos目录下`nacos/bin/shutdown.sh`进行停止。

## 2. 替换文件

下载并解压缩`nacos-server-2.0.2.tar.gz`，将其下的`bin`，`conf`，`target`目录覆盖原Nacos1.X的安装目录下。

## 3. 修改配置

自行修改`nacos/bin/startup.sh`中的JVM参数，`conf/cluster.conf`中的集群列表以及`conf/application.prpperties`中数据库或其他相关参数。

## 4. 启动Nacos2.0

使用nacos目录下`nacos/bin/startup.sh`启动nacos2.0，其他更多启动指令请查看[Nacos部署环境](../guide/admin/deployment.md) 。

## 5. 观察是否启动成功

首先查看nacos目录下 `logs/start.out`或`logs/nacos.log` 观察到nacos启动成功的日志，如 `Nacos started successfully in cluster mode. use xxx storage` 说明程序已启动成功。

之后在观察 `logs/naming-server.log` 中，可以看到有`upgrade check result false` 以及 `Check whether close double write`等日志信息。

属于正常现象。

## 6. 升级其他节点

待该节点的服务及实例信息已经同步完毕后（可从控制台进行确认）。重复1～5步骤，将其他的nacos节点也进行升级。

## 7. 确认升级完成

当集群中最后一个节点也升级到2.0.X版本时，集群会开始进行升级检测。每个节点会对该节点的服务信息和实例信息进行校验，并检测是否还有未完成的双写任务。

当该节点的服务信息和实例信息已经核对成功，并且没有双写任务存在时，该节点会判定自己已经做好升级准备，并修改自己的状态且通知其他Nacos节点。每台节点是否完成升级准备可以从控制台的集群管理中元数据信息中看到`"readyToUpgrade": false/true`。

当集群中所有节点均判定为准备完毕时。Nacos集群中的节点会进行升级切换，自动升级到Nacos2.0的处理逻辑。

可以从`logs/naming-server.log`日志中观察到`upgrade check result true`及`Upgrade to 2.0.X`。

<h4 id="8.1"></h4>

## 8.1 关闭双写

当集群升级完成后，可以先观察一段时间运行情况，当确认无误后，可以关闭双写，从而释放性能，具体的关闭方式是通过API进行：

`curl -X PUT 'localhost:8848/nacos/v1/ns/operator/switches?entry=doubleWriteEnabled&value=false'`

关闭后可以从`logs/naming-server.log`日志中观察到`Disable Double write, stop and clean v1.x cache and features`字样。说明关闭双写。

**注意**，关闭双写后无法在进行平滑降级，请先确认关闭前集群正确运行。

## 8.2 降级

集群升级完毕后，依旧会进行双写，当升级后发现Nacos2.0存在问题时，可以快速进行降级，降级流程为重复步骤1～6，只是将版本改为对应的1.X版本。

当第一台降级完成后，集群即可观察到`logs/naming-server.log` 中的`upgrade check result false` ，且控制台集群管理中，所有新版本`"readyToUpgrade": false`。

<h1 id="1">升级相关的openAPI</h1> 

在2.0.2版本中，nacos-server提供了一些方便查看升级状态及不同版本中的数据区别，方便用户排查升级中的问题。

## 查看统计

### 描述

查看当前升级状态

### 请求类型
GET

### 请求URL
/nacos/v1/ns/upgrade/ops/metrics

### 请求参数
无

### 返回参数

| 参数类型 | 描述 |
| :--- | :--- |
| string | 升级状态 |

### 示例

```plain
upgraded                       = true
isAll20XVersion                = true
isDoubleWriteEnabled           = false
doubleWriteDelayTaskCount      =     0
serviceCountV1                 =     0
instanceCountV1                =     0
serviceCountV2                 =     0
instanceCountV2                =     0
subscribeCountV2               =     0
responsibleServiceCountV1      =     0
responsibleInstanceCountV1     =     0
ephemeralServiceCountV2        =     0
persistentServiceCountV2       =     0
ephemeralInstanceCountV2       =     0
persistentInstanceCountV2      =     0
service.V1.not.in.V2           =
service.V2.not.in.V1           =
```

## 查询服务

### 描述
查询对应Nacos版本中一个服务内容

### 请求类型
GET

### 请求路径
```plain
/nacos/v1/ns/upgrade/ops/service
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| serviceName | 字符串 | 是 | 服务名 |
| groupName | 字符串 | 否 | 分组名 |
| namespaceId | 字符串 | 否 | 命名空间ID |
| ver | 字符串 | 否 | 版本 `v1` 或者 `v2`, 默认`v2` |

### 示例请求
```plain
curl -X GET '127.0.0.1:8848/nacos/v1/ns/upgrade/ops/service?serviceName=nacos.test.2'
```
### 示例返回
```
{
    metadata: { },
    groupName: "DEFAULT_GROUP",
    namespaceId: "public",
    name: "nacos.test.2",
    selector: {
        type: "none"
    },
    protectThreshold: 0,
    clusters: [
        {
            healthChecker: {
                type: "TCP"
            },
            metadata: { },
            name: "c1"
        }
    ]
}
```

## 查询服务列表

### 描述
查询对应Nacos版本的服务列表

### 请求类型
GET

### 请求路径
```plain
/nacos/v1/ns/upgrade/ops/service/list
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| pageNo | int | 是 | 当前页码 |
| pageSize | int | 是 | 分页大小 |
| groupName | 字符串 | 否 | 分组名 |
| namespaceId | 字符串 | 否 | 命名空间ID |
| ver | 字符串 | 否 | 版本 `v1` 或者 `v2`, 默认`v2` |

### 示例请求
```plain
curl -X GET '127.0.0.1:8848/nacos/v1/ns/upgrade/ops/service/list?pageNo=1&pageSize=2'
```

### 示例返回
```
{
    "count":148,
    "doms": [
        "nacos.test.1",
        "nacos.test.2"
    ]
}
```

## 查询实例列表

### 描述
查询对应Nacos版本中某个服务下的实例列表

### 请求类型
GET

### 请求路径
```plain
/nacos/v1/ns/upgrade/ops/instance/list
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| serviceName | 字符串 | 是 | 服务名 |
| groupName | 字符串 | 否 | 分组名 |
| namespaceId | 字符串 | 否 | 命名空间ID |
| clusters | 字符串，多个集群用逗号分隔 | 否 | 集群名称 |
| healthyOnly | boolean | 否，默认为false | 是否只返回健康实例 |
| ver | 字符串 | 否 | 版本 `v1` 或者 `v2`, 默认`v2` |

### 示例请求
```plain
curl -X GET '127.0.0.1:8848/nacos/v1/ns/upgrade/ops/instance/list?serviceName=nacos.test.1'
```
### 示例返回
```json
{
	"dom": "nacos.test.1",
	"cacheMillis": 1000,
	"useSpecifiedURL": false,
	"hosts": [{
		"valid": true,
		"marked": false,
		"instanceId": "10.10.10.10-8888-DEFAULT-nacos.test.1",
		"port": 8888,
		"ip": "10.10.10.10",
		"weight": 1.0,
		"metadata": {}
	}],
	"checksum": "3bbcf6dd1175203a8afdade0e77a27cd1528787794594",
	"lastRefTime": 1528787794594,
	"env": "",
	"clusters": ""
}
```

## 查询实例详情

### 描述
查询一个对应Nacos版本中某个服务下个某个实例详情。

### 请求类型
GET

### 请求路径
```plain
/nacos/v1/ns/upgrade/ops/instance
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| serviceName | 字符串 | 是 | 服务名 |
| groupName | 字符串 | 否 | 分组名 |
| ip | 字符串 | 是 | 实例IP |
| port | 字符串 | 是 | 实例端口 |
| namespaceId | 字符串 | 否 | 命名空间ID |
| cluster | 字符串 | 否 | 集群名称 |
| healthyOnly | boolean | 否，默认为false | 是否只返回健康实例 |
| ephemeral | boolean | 否 | 是否临时实例 |
| ver | 字符串 | 否 | 版本 `v1` 或者 `v2`, 默认`v2` |

### 示例请求
```plain
curl -X GET '127.0.0.1:8848/nacos/v1/ns/upgrade/ops/instance?serviceName=nacos.test.2&ip=10.10.10.10&port=8888&cluster=DEFAULT'
```
### 示例返回
```json
{
	"metadata": {},
	"instanceId": "10.10.10.10-8888-DEFAULT-nacos.test.2",
	"port": 8888,
	"service": "nacos.test.2",
	"healthy": false,
	"ip": "10.10.10.10",
	"clusterName": "DEFAULT",
	"weight": 1.0
}
```

## 添加服务

### 描述
补充添加一个服务到对应Nacos版本下

### 请求类型
POST

### 请求路径
```plain
/nacos/v1/ns/upgrade/ops/service
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| serviceName | 字符串 | 是 | 服务名 |
| groupName | 字符串 | 否 | 分组名 |
| namespaceId | 字符串 | 否 | 命名空间ID |
| protectThreshold | 浮点数 | 否 | 保护阈值,取值0到1,默认0 |
| metadata | 字符串 | 否 | 元数据 |
| selector | JSON格式字符串 | 否 | 访问策略 |
| ver | 字符串 | 否 | 版本 `v1` 或者 `v2`, 默认`v2` |

### 示例请求
```plain
curl -X POST '127.0.0.1:8848/nacos/v1/ns/service?serviceName=nacos.test.2&metadata=k1%3dv1'
```
### 示例返回
```
ok
```

## 删除服务

### 描述
从对应Nacos版本中删除一个服务,如果删除v2服务，只有当服务下实例数为0时允许删除。

### 请求类型
DELETE

### 请求路径
```plain
/nacos/v1/ns/upgrade/ops/service
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| serviceName | 字符串 | 是 | 服务名 |
| groupName | 字符串 | 否 | 分组名 |
| namespaceId | 字符串 | 否 | 命名空间ID |
| ver | 字符串 | 否 | 版本 `v1` 或者 `v2`, 默认`v2` |

### 示例请求
```plain
curl -X DELETE '127.0.0.1:8848/nacos/v1/ns/service?serviceName=nacos.test.2'
```
### 示例返回
```
ok
```

## 注册实例

### 描述
注册一个实例到对应Nacos版本的服务下。

### 请求类型
POST

### 请求路径
```plain
/nacos/v1/ns/upgrade/ops/instance
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| ip | 字符串 | 是 | 服务实例IP |
| port | int | 是 | 服务实例port |
| namespaceId | 字符串 | 否 | 命名空间ID |
| weight | double | 否 | 权重 |
| enabled | boolean | 否 | 是否上线 |
| healthy | boolean | 否 | 是否健康 |
| metadata | 字符串 | 否 | 扩展信息 |
| clusterName | 字符串 | 否 | 集群名 |
| serviceName | 字符串 | 是 | 服务名 |
| groupName | 字符串 | 否 | 分组名 |
| ephemeral | boolean | 否 | 是否临时实例 |
| ver | 字符串 | 否 | 版本 `v1` 或者 `v2`, 默认`v2` |

### 示例请求
```plain
curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?port=8848&healthy=true&ip=11.11.11.11&weight=1.0&serviceName=nacos.test.3&encoding=GBK&namespaceId=n1'
```
### 示例返回
ok

## 注销实例

### 描述
删除对应Nacos版本服务下的一个实例。

### 请求类型
DELETE

### 请求路径
```plain
/nacos/v1/ns/upgrade/ops/instance
```

### 请求参数

| 名称 | 类型 | 是否必选 | 描述 |
| :--- | :--- | :--- | --- |
| serviceName | 字符串 | 是 | 服务名 |
| groupName | 字符串 | 否 | 分组名 |
| ip | 字符串 | 是 | 服务实例IP |
| port | int | 是 | 服务实例port |
| clusterName | 字符串 | 否 | 集群名称 |
| namespaceId | 字符串 | 否 | 命名空间ID |
| ephemeral | boolean | 否 | 是否临时实例 |
| ver | 字符串 | 否 | 版本 `v1` 或者 `v2`, 默认`v2` |

### 示例请求
```plain
curl -X DELETE '127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.test.1&ip=1.1.1.1&port=8888&clusterName=TEST1'
```
### 示例返回
ok

# 升级过程中可能遇到的问题

## 1. 最后一台节点升级完成时，注册的服务出现波动（变成不健康或暂时被摘除）

升级过程中，为了节约性能，双写的内容仅是内容发生变更时的状态，心跳等内容不会被双写，因此切换版本时，可能有部分实例的心跳过久而健康检查又刚好开始执行，从而被标记非健康或摘除。

后续心跳处理将会把数据补充回来，最终会一致。

## 2. 升级完成后，升级的最后一台服务端报错`Server is DOWN`

这可能是因为Raft选主失败导致的，解决方法是重启最后一台升级的服务端。或先将最后一台服务端降级，之后再重新进行一次升级即可。
