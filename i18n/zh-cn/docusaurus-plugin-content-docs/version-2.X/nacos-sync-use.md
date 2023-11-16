---
title: NacosSync 迁移用户手册
keywords: [NacosSync,迁移,用户手册]
description: NacosSync 迁移用户手册
---

# NacosSync 迁移用户手册

## 手册目标
* 启动 NacosSync 服务
* 通过一个简单的例子，演示如何将注册到 Zookeeper 的 Dubbo 客户端迁移到 Nacos。

## 准备工作
启动服务之前，你需要安装下面的服务：
* 64bit OS: Linux/Unix/Mac/Windows supported, Linux/Unix/Mac recommended.
* 64bit JDK 1.8+: [downloads](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html), [JAVA_HOME settings](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/).
* Maven 3.2.x+: [downloads](https://maven.apache.org/download.cgi), [settings](https://maven.apache.org/settings.html).
* MySql 5.6.+

## 获取安装包
有两种方式可以获得 NacosSync 的安装包：
* 直接下载 NacosSync 的二进制安装包：[nacosSync.${version}.zip](https://github.com/nacos-group/nacos-sync/releases)
* 从 GitHub 上下载 NacosSync 的源码进行构建

Package:
```basic
cd nacosSync/
mvn clean package -U
```

目标文件的路径：
```basic
nacos-sync/nacossync-distribution/target/nacosSync.${version}.zip
```

解压安装包之后,工程的文件目录结构：
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

## 初始化数据库

系统默认配置的数据库是Mysql，也能支持其他的关系型数据库。
1.建库，缺省的数据库名字为“nacos_Sync”。
2.数据库表不需要单独创建，默认使用了hibernate的自动建表功能。
3.如果你的环境不支持自动建表，可以使用系统自带的sql脚本建表，脚本放在bin目录下。

## 数据库配置

数据库的配置文件放在`conf/application.properties`中：
```basic
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/nacos_sync?characterEncoding=utf8
spring.datasource.username=root
spring.datasource.password=root
```

## 启动服务器

```bash
$ nacosSync/bin:
sh startup.sh  restart
```

## 检查系统状态

1.检查系统日志

日志的路径在`nacosSync/logs/nacosSync.log`，检查是否有异常信息。

2.检查系统端口

缺省的系统端口是`8081`，你可以自己定义在`application.properties`中。

```bash
$netstat -ano|grep 8081
tcp        0      0 0.0.0.0:8081                0.0.0.0:*                   LISTEN      off (0.00/0/0)
```

## 控制台

访问路径：
```
http://127.0.0.1:8081/#/serviceSync
```
![image.png](https://img.alicdn.com/tfs/TB1EKbkJ3HqK1RjSZFEXXcGMXXa-2866-606.png)

如果检查没有问题，NacosSync 已经正常启动了，NacosSync 的部署结构：![image.png](https://img.alicdn.com/tfs/TB107nfJ9zqK1RjSZFjXXblCFXa-1412-342.png)

## 开始迁移

### 迁移信息

Dubbo服务的部署信息：![image.png](https://img.alicdn.com/tfs/TB1Ci_eJ4TpK1RjSZR0XXbEwXXa-938-700.png)

迁移的服务：

| Service Name | Version | Group Name |
| --- | --- | --- |
| com.alibaba.nacos.api.DemoService | 1.0.0 | zk |

### 添加注册中心集群信息

1.点击左侧导航栏中的“集群配置”按钮，新增加一个集群，先增加一个Zookeeper集群，选择集群类型为ZK。
![image.png](https://img.alicdn.com/tfs/TB1oJDnJ7voK1RjSZFwXXciCFXa-2870-1130.png)

> 注意：集群名字可以自定义，但是一旦确认，不能被修改，否则基于此集群增加的任务，在 NacosSync 重启后，将不会恢复成功。

2.同样的步骤，增加Nacos集群。
![image.png](https://img.alicdn.com/tfs/TB1HQPhJVzqK1RjSZFCXXbbxVXa-2846-1042.png)

3.添加完成后，可以在列表中查询到：
![image.png](https://img.alicdn.com/tfs/TB1AX6fJVYqK1RjSZLeXXbXppXa-2864-824.png)

### 添加同步任务

1.增加一个同步任务，从Zookeeper集群同步到Nacos集群，同步的粒度是服务，Zookeeper集群则称为源集群，Nacos集群称为目标集群。
![imagesd.png](https://img.alicdn.com/tfs/TB1tF_fJVYqK1RjSZLeXXbXppXa-2838-1138.png)

添加完成之后，可以在服务同步列表中，查看已添加的同步任务：
![image.png](https://img.alicdn.com/tfs/TB1l6uJJ9zqK1RjSZPcXXbTepXa-2824-570.png)

2.同步完成之后，检查下数据是否同步成功到Nacos集群，可以通过Nacos的控制台进行查询。
![image.png](https://img.alicdn.com/tfs/TB1tPneJ4TpK1RjSZR0XXbEwXXa-2872-828.png)

3.此刻，数据已经成功从Zookeeper集群同步到了Nacos集群，部署结构如下：
![image.png](https://img.alicdn.com/tfs/TB14kriJ6TpK1RjSZKPXXa3UpXa-1724-772.png)

### Dubbo 客户端连接到 Nacos 注册中心

#### Dubbo Consumer客户端迁移

Dubbo 已经支持Nacos注册中心，支持的版本为2.5+，需要增加一个Nacos注册中心的Dubbo扩展插件依赖：
```basic
<dependency>
      <groupId>com.alibaba</groupId>
      <artifactId>dubbo-registry-nacos</artifactId>
			<version>0.0.2</version>
</dependency>
```

增加Nacos客户端的依赖：
```basic
<dependency>
        <groupId>com.alibaba.nacos</groupId>
        <artifactId>nacos-client</artifactId>
        <version>0.6.2</version>
</dependency>
```

配置Dubbo Consumer的Dubbo配置文件`consumer.yaml`，让客户端能够找到Nacos集群。 
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

不需要修改代码，配置更新完毕之后，你就可以重启你的应用，使之生效了。

Consumer发布完成之后，目前的部署结构如下：
![image.png](https://img.alicdn.com/tfs/TB181fkJ3HqK1RjSZFEXXcGMXXa-1734-878.png)

#### Dubbo Provider迁移

在升级Provider之前，你需要确保该Provider发布的服务，都已经配置在 NacosSync 中，同步的方式为从Nacos同步到Zookeeper，因为Provider升级连接到Nacos之后，需要确保老的Dubbo Consumer客户端能够在Zookeeper上订阅到该Provider的地址，现在，我们增加一个同步任务：
![image.png](https://img.alicdn.com/tfs/TB1pdDnJ7voK1RjSZFwXXciCFXa-2872-1060.png)

![image.png](https://img.alicdn.com/tfs/TB19Ey_J6DpK1RjSZFrXXa78VXa-2842-660.png)

> 注意：Nacos服务同步到Zookeeper，不需要填写版本号，你在选择源集群的时候，版本号的输入框会自动隐藏掉。

同步任务完成后，你就可以升级Provider了，升级Provider的方法，参考升级Consumer的步骤。

### 新的部署结构
* 在升级的过程中，会有新老版本的客户端同时存在，部署结构如下：

![image.png](https://img.alicdn.com/tfs/TB14Y_iJ3HqK1RjSZFPXXcwapXa-1728-838.png)

* 所有的客户端迁移完成之后，部署结构如下：

![image.png](https://img.alicdn.com/tfs/TB1Cg2dJYvpK1RjSZPiXXbmwXXa-1466-864.png)

现在，Zookeeper集群，NacosSync集群就可以下线了。

### 注意事项
* 同步任务添加之后，需要确保下服务是否成功同步到目标集群，可以通过目标集群的控制台进行查询。
* NacosSync 支持高可用集群模式部署，你只需要把数据库配置成同一个即可。
* 如果梳理不清楚订阅和发布的服务，建议可以把服务都做双向同步。
* Dubbo 客户端目前不支持 Nacos 的权重功能，如果你用到了权重功能，需要重新考虑一下方案是否合适。
