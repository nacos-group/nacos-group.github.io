---
title: 集群模式部署
keywords: [Nacos,部署,集群模式]
description: Nacos集群模式部署手册，参考本文档可进行Nacos集群模式多种方式部署。
sidebar:
    order: 3
---

# Nacos集群模式

本部署手册是帮忙您快速在你的电脑上，下载安装并使用Nacos，部署生产使用的集群模式。

### 集群部署架构图

无论采用何种部署方式，推荐用户把Nacos集群中所有服务节点放到一个vip下面，然后挂到一个域名下面。

`<http://ip1:port/openAPI>`  直连ip模式，机器挂则需要修改ip才可以使用。

`<http://SLB:port/openAPI>`  挂载SLB模式(内网SLB，不可暴露到公网，以免带来安全风险)，直连SLB即可，下面挂server真实ip，可读性不好。

`<http://nacos.com:port/openAPI>`  域名 + SLB模式(内网SLB，不可暴露到公网，以免带来安全风险)，可读性好，而且换ip方便，推荐模式

![deployDnsVipMode.jpg](/img/doc/manual/admin/deployment/deploy-dns-vip-mode.svg)

在使用VIP时，需要开放Nacos服务的主端口(默认8848)以及gRPC端口(默认9848)、同时如果对Nacos的主端口有所修改的话，需要对vip中的端口映射作出配置，具体端口的映射方式参考[部署手册概览-Nacos部署架构](./deployment-overview/#1-Nacos部署架构)

## 1. 发行版部署

### 1.1. 使用MySQL数据库（推荐）

#### 1.1.1. 环境准备

参考[快速开始](../../../quickstart/quick-start.mdx)中，进行Nacos的环境准备、发行版的下载等。

同时在使用MySQL数据源部署Nacos单机模式时，需要自行准备MySQL数据库：

- 1.安装数据库，版本要求：5.6.5+
- 2.初始化mysql数据库，数据库初始化文件：[mysql-schema.sql](https://github.com/alibaba/nacos/blob/master/distribution/conf/mysql-schema.sql)

#### 1.1.2. 配置集群配置文件

在nacos的解压目录nacos/的conf目录下，有配置文件cluster.conf，请每行配置成ip:port。（请配置3个或3个以上节点）

```plain
# ip:port
200.8.9.16:8848
200.8.9.17:8848
200.8.9.18:8848
```

#### 1.1.3. 修改配置文件

然后修改`${nacos.home}/conf/application.properties`文件，增加支持MySQL数据源配置，添加MySQL数据源的url、用户名和密码。

```
spring.sql.init.platform=mysql

db.num=1
db.url.0=jdbc:mysql://${mysql_host}:${mysql_port}/${nacos_database}?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
db.user=${mysql_user}
db.password=${mysql_password}
```

##### 1.1.3.1. 开启默认鉴权插件（可选，推荐）

修改`conf`目录下的`application.properties`文件。

设置其中

```properties
nacos.core.auth.enabled=true
nacos.core.auth.system.type=nacos
nacos.core.auth.plugin.nacos.token.secret.key=${自定义，保证所有节点一致}
nacos.core.auth.server.identity.key=${自定义，保证所有节点一致}
nacos.core.auth.server.identity.value=${自定义，保证所有节点一致}
```

上述内容详情可查看[权限认证](../../../plugin/auth-plugin.md).

> 注意，文档中的默认值`SecretKey012345678901234567890123456789012345678901234567890123456789`和`VGhpc0lzTXlDdXN0b21TZWNyZXRLZXkwMTIzNDU2Nzg=`为公开默认值，可用于临时测试，实际使用时请**务必**更换为自定义的其他有效值。

#### 1.1.4. 启动Nacos集群

在每个部署节点上，执行如下命名，逐台或同时启动Nacos节点。

```bash
# Linux/Unix/Mac 
sh startup.sh

# Ubuntu

bash startup.sh

# Windows
startup.cmd
```

### 1.2. 使用Derby数据库

> 注意：Derby数据库为本地内置数据库，本身不支持集群模式，Nacos通过Raft协议将各个节点的Derby数据库组成逻辑集群，因此使用此模式部署集群模式的Nacos是，需要对Raft协议较为熟悉，能够进行问题排查、恢复等，建议使用MySQL数据库进行部署。

#### 1.2.1. 环境准备

参考[快速开始](../../../quickstart/quick-start.mdx)中，进行Nacos的环境准备、发行版的下载等。

#### 1.2.2. 配置集群配置文件

在nacos的解压目录nacos/的conf目录下，有配置文件cluster.conf，请每行配置成ip:port。（请配置3个或3个以上节点）

```plain
# ip:port
200.8.9.16:8848
200.8.9.17:8848
200.8.9.18:8848
```

#### 1.2.3. 开启默认鉴权插件（可选，推荐）

修改`conf`目录下的`application.properties`文件。

设置其中

```properties
nacos.core.auth.enabled=true
nacos.core.auth.system.type=nacos
nacos.core.auth.plugin.nacos.token.secret.key=${自定义，保证所有节点一致}
nacos.core.auth.server.identity.key=${自定义，保证所有节点一致}
nacos.core.auth.server.identity.value=${自定义，保证所有节点一致}
```

上述内容详情可查看[权限认证](../../../plugin/auth-plugin.md).

> 注意，文档中的默认值`SecretKey012345678901234567890123456789012345678901234567890123456789`和`VGhpc0lzTXlDdXN0b21TZWNyZXRLZXkwMTIzNDU2Nzg=`为公开默认值，可用于临时测试，实际使用时请**务必**更换为自定义的其他有效值。

#### 1.2.4. 启动Nacos集群

在每个部署节点上，执行如下命名，逐台或同时启动Nacos节点。

```bash
# Linux/Unix/Mac 
sh startup.sh -p embedded

# Ubuntu

bash startup.sh -p embedded

# Windows
startup.cmd -p embedded
```

### 1.3. 高级使用

#### 1.3.1. 自定义配置

Nacos提供了丰富的可配置项，帮助您调整Nacos的性能、控制Nacos提供的功能能力，例如鉴权、监控、数据库、连接、日志等；详情请参考[系统参数](../system-configurations.md)。

## 2. Docker部署

### 2.1. 使用MySQL数据库（推荐）

参考[快速开始 Docker](../../../quickstart/quick-start-docker.md)中，进行`nacos-docker`项目的下载，然后执行如下命令，即可启动Nacos集群。

```powershell
docker-compose -f example/cluster-hostname.yaml up 
```

### 2.2. 使用Derby数据库

> 注意：Derby数据库为本地内置数据库，本身不支持集群模式，Nacos通过Raft协议将各个节点的Derby数据库组成逻辑集群，因此使用此模式部署集群模式的Nacos是，需要对Raft协议较为熟悉，能够进行问题排查、恢复等，建议使用MySQL数据库进行部署。

参考[快速开始 Docker](../../../quickstart/quick-start-docker.md)中，进行`nacos-docker`项目的下载，然后执行如下命令，即可启动Nacos集群。

```powershell
docker-compose -f example/cluster-embedded.yaml up 
```

### 2.3 高级配置

如果你有很多自定义配置的需求，可以通过指定[系统参数-镜像环境变量](../system-configurations/#2-镜像环境变量)的方式进行配置，例如需要开启鉴权时：

```powershell
docker run --name nacos-cluster-auth -e MODE=cluster -e NACOS_AUTH_ENABLE=true -e NACOS_AUTH_TOKEN=${customToken} -e NACOS_AUTH_IDENTITY_KEY=${customKey} NACOS_AUTH_IDENTITY_VALUE=${customValue} -p 8848:8848 -d -p 9848:9848  nacos/nacos-server:latest
```

同时，可以通过对application.properties文件进行挂卷定义的方式，将更多复杂的自定义配置导入Nacos容器中，强烈建议在生产环境中使用方式，例如：

```powershell
docker run --name nacos-cluster -e MODE=cluster -v /path/application.properties:/home/nacos/conf/application.properties -v /path/cluster.conf:/home/nacos/conf/cluster.conf -p 8848:8848 -d -p 9848:9848  nacos/nacos-server:latest
```

如果仍然无法满足自定义需求，可以基于nacos-docker项目中的`Dockerfile`自行构建镜像。

## 3. Kubernetes部署

通过[快速开始 Kubernetes](../../../quickstart/quick-start-kubernetes.md)文档，已经能够部署使用MySQL数据库的Nacos的集群模式。

但快速开始所部署的Nacos集群没有使用持久化卷的,可能存在数据丢失风险；因此推荐使用PVC持久卷方式进行部署，本例中将使用的是NFS来使用PVC。

#### Tips

* 推荐使用[Nacos Operator](https://github.com/nacos-group/nacos-k8s/blob/master/operator/README-CN.md)在Kubernetes部署Nacos Server.

### 3.1. 部署 NFS

* 创建角色

```shell
kubectl create -f deploy/nfs/rbac.yaml
```

> 如果的K8S命名空间不是**default**，请在部署RBAC之前执行以下脚本:

```shell
# Set the subject of the RBAC objects to the current namespace where the provisioner is being deployed
$ NS=$(kubectl config get-contexts|grep -e "^\*" |awk '{print $5}')
$ NAMESPACE=${NS:-default}
$ sed -i'' "s/namespace:.*/namespace: $NAMESPACE/g" ./deploy/nfs/rbac.yaml

```

* 创建 `ServiceAccount` 和部署 `NFS-Client Provisioner`

```shell
kubectl create -f deploy/nfs/deployment.yaml
```

* 创建 NFS StorageClass

```shell
kubectl create -f deploy/nfs/class.yaml
```

* 验证NFS部署成功

```shell
kubectl get pod -l app=nfs-client-provisioner
```

### 3.2. 部署数据库

```shell

cd nacos-k8s

kubectl create -f deploy/mysql/mysql-nfs.yaml
```

* 验证数据库是否正常工作

```shell

kubectl get pod 
NAME                         READY   STATUS    RESTARTS   AGE
mysql-gf2vd                        1/1     Running   0          111m

```
### 3.3. 执行数据库初始化语句

数据库初始化语句位置 [mysql-schema.sql](https://github.com/alibaba/nacos/blob/master/distribution/conf/mysql-schema.sql)

### 3.4. 部署Nacos

* 修改  **deploy/nacos/nacos-pvc-nfs.yaml**

```yaml
data:
  mysql.host: "数据库地址"
  mysql.db.name: "数据库名称"
  mysql.port: "端口"
  mysql.user: "用户名"
  mysql.password: "密码"
```

* 创建 Nacos

``` shell
kubectl create -f nacos-k8s/deploy/nacos/nacos-pvc-nfs.yaml
```

* 验证Nacos节点启动成功

```shell
kubectl get pod -l app=nacos


NAME      READY   STATUS    RESTARTS   AGE
nacos-0   1/1     Running   0          19h
nacos-1   1/1     Running   0          19h
nacos-2   1/1     Running   0          19h
```

### 3.5. 扩容测试

* 在扩容前，使用 [`kubectl exec`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands/#exec)获取在pod中的Nacos集群配置文件信息

```powershell
for i in 0 1; do echo nacos-$i; kubectl exec nacos-$i cat conf/cluster.conf; done
```

StatefulSet控制器根据其序数索引为每个Pod提供唯一的主机名。 主机名采用<statefulset name />  -  <ordinal index />的形式。 因为nacos StatefulSet的副本字段设置为2，所以当前集群文件中只有两个Nacos节点地址

![k8s](https://cdn.nlark.com/yuque/0/2019/gif/338441/1562846123635-e361d2b5-4bbe-4347-acad-8f11f75e6d38.gif)

* 使用kubectl scale 对Nacos动态扩容

```bash
kubectl scale sts nacos --replicas=3
```

![scale](https://cdn.nlark.com/yuque/0/2019/gif/338441/1562846139093-7a79b709-9afa-448a-b7d6-f57571d3a902.gif)

* 在扩容后，使用 [`kubectl exec`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands/#exec)获取在pod中的Nacos集群配置文件信息

```bash
for i in 0 1 2; do echo nacos-$i; kubectl exec nacos-$i cat conf/cluster.conf; done
```

![get_cluster_after](https://cdn.nlark.com/yuque/0/2019/gif/338441/1562846177553-c1c7f379-1b41-4026-9f0b-23e15dde02a8.gif)

* 使用 [`kubectl exec`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands/#exec)执行Nacos API 在每台节点上获取当前**Leader**是否一致

```bash
for i in 0 1 2; do echo nacos-$i; kubectl exec nacos-$i curl -X GET "http://localhost:8848/nacos/v1/ns/raft/state"; done
```

到这里你可以发现新节点已经正常加入Nacos集群当中。

### 3.6. 配置属性

* `nacos-pvc-nfs.yaml` or `nacos-quick-start.yaml`

| 名称                     | 必要 | 描述                                    |
| ----------------------- | -------- | --------------------------------------- |
| `mysql.host`            | Y       | 自建数据库地址,使用外部数据库时必须指定                      |
| `mysql.db.name`         | Y       | 数据库名称                      |
| `mysql.port`            | N       | 数据库端口                        |
| `mysql.user`            | Y       | 数据库用户名(请不要含有符号```,```)     |
| `mysql.password`        | Y       | 数据库密码(请不要含有符号```,```)                     |
| `SPRING_DATASOURCE_PLATFORM`        | Y       |   数据库类型,默认为embedded嵌入式数据库,参数只支持mysql或embedded	                   |
| `NACOS_REPLICAS`        | N      | 确定执行Nacos启动节点数量,如果不适用动态扩容插件,就必须配置这个属性，否则使用扩容插件后不会生效 |
| `NACOS_SERVER_PORT`     | N       | Nacos 端口 为peer_finder插件提供端口|
| `NACOS_APPLICATION_PORT`     | N       | Nacos 端口|
| `PREFER_HOST_MODE`      | Y       | 启动Nacos集群按域名解析 |

* **nfs** `deployment.yaml`

| 名称          | 必要 | 描述                     |
| ------------ | --------| ------------------------ |
| `NFS_SERVER` | Y       | NFS 服务端地址         |
| `NFS_PATH`   | Y       | NFS 共享目录 |
| `server`     | Y       | NFS 服务端地址  |
| `path`       | Y       | NFS 共享目录 |

* mysql

| 名称                     | 必要 | 描述                                                      |
| -------------------------- | -------- | ----------------------------------------------------------- |
| `MYSQL_ROOT_PASSWORD`        | N       | ROOT 密码                                                    |
| `MYSQL_DATABASE`             | Y       | 数据库名称                                   |
| `MYSQL_USER`                 | Y       | 数据库用户名                                  |
| `MYSQL_PASSWORD`             | Y       | 数据库密码                              |
| `MYSQL_REPLICATION_USER`     | Y       | 数据库复制用户            |
| `MYSQL_REPLICATION_PASSWORD` | Y       | 数据库复制用户密码      |
| `Nfs:server`                 | N      | NFS 服务端地址，如果使用本地部署不需要配置 |
| `Nfs:path`                   | N     | NFS 共享目录，如果使用本地部署不需要配置 |
