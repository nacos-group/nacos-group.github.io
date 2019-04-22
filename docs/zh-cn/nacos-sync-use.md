# NacosSync迁移用户手册

<a name="4a481d2c"></a>
## 手册目标
* 启动NacosSync服务
* 通过一个简单的例子,演示如何将注册到Zookeeper的Dubbo客户端迁移到Nacos
<a name="8dff94cf"></a>
## 系统需要
启动服务之前,你需要安装下面的服务:
* 64bit OS: Linux/Unix/Mac/Windows supported, Linux/Unix/Mac recommended.
* 64bit JDK 1.8+: [downloads](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html), [JAVA_HOME settings](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/).
* Maven 3.2.x+: [downloads](https://maven.apache.org/download.cgi), [settings](https://maven.apache.org/settings.html).
* MySql 5.6.+
<a name="0aaf7364"></a>

## 获取安装包
有2种方式可以获得NacosSync的安装包:
* 直接下载NacosSync的二进制安装包（下载最新的版本 https://github.com/nacos-group/nacos-sync/releases）

[nacosSync.${version}.zip](https://github.com/nacos-group/nacos-sync/releases)
* 从GitHub上下载NacosSync的源码进行构建

Package:
```basic
cd nacosSync/
mvn clean package -U
```

目标文件的路径:
```basic
nacos-sync/nacossync-distribution/target/nacosSync.${version}.zip
```

解压安装包之后,工程的文件目录结构:
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
<a name="d41d8cd9"></a>
### 
<a name="2e8b6989"></a>
## 初始化DB

系统默认配置的数据库是MySql,也能支持其他的关系型数据库
1. 建库,缺省的数据库名字为“nacos_Sync”
1. 数据库表不需要单独创建,默认使用了hibernate的自动建表功能
1. 如果你的环境不支持自动建表,可以使用系统自带的sql脚本建表,脚本放在bin目录下

<a name="fad227bc"></a>
## DB配置

DB的配置文件放在conf/application.properties中:
```basic
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/nacos_sync?characterEncoding=utf8
spring.datasource.username=root
spring.datasource.password=root
```

<a name="8b7a5bf9"></a>
## 启动服务器

```bash
$ nacosSync/bin:
sh startup.sh  restart
```

<a name="24d69918"></a>
## 检查系统状态

1.系统日志检查<br />日志的路径在 nacosSync/logs/nacosSync.log,检查是否有异常信息<br />2.检查系统端口(缺省的系统端口是8081,你可以自己定义在application.properties中)
```bash
$netstat -ano|grep 8081
tcp        0      0 0.0.0.0:8081                0.0.0.0:*                   LISTEN      off (0.00/0/0)
```

<a name="b5c37706"></a>
## 控制台
访问路径:
```
http://127.0.0.1:8081/#/serviceSync
```


![image.png](https://img.alicdn.com/tfs/TB1EKbkJ3HqK1RjSZFEXXcGMXXa-2866-606.png)

如果检查没有问题,NacosSync已经正常启动了,NacosSync的部署结构:<br />![image.png](https://img.alicdn.com/tfs/TB107nfJ9zqK1RjSZFjXXblCFXa-1412-342.png)

<a name="a9686100"></a>
## 开始迁移

<a name="f7389286"></a>
### 迁移信息

Dubbo服务的部署信息:<br />![image.png](https://img.alicdn.com/tfs/TB1Ci_eJ4TpK1RjSZR0XXbEwXXa-938-700.png)

迁移的服务:

| Service Name | Version | Group Name |
| --- | --- | --- |
| com.alibaba.nacos.api.DemoService | 1.0.0 | zk |


<a name="30f7edcb"></a>
### 添加注册中心集群信息

1.点击左侧导航栏中的“集群配置”按钮,新增加一个集群,先增加一个Zookeeper集群,选择集群类型为ZK<br />
![image.png](https://img.alicdn.com/tfs/TB1oJDnJ7voK1RjSZFwXXciCFXa-2870-1130.png)

> 注意:集群名字可以自定义,但是一旦确认,不能被修改,否则基于此集群增加的任务,在NacosSync重启后,将不会恢复成功


2.同样的步骤,增加NacosSync集群<br />
![image.png](https://img.alicdn.com/tfs/TB1HQPhJVzqK1RjSZFCXXbbxVXa-2846-1042.png)

添加完成后,可以在列表中查询到<br />
![image.png](https://img.alicdn.com/tfs/TB1AX6fJVYqK1RjSZLeXXbXppXa-2864-824.png)


<a name="da01623b"></a>
### 添加同步任务

1.增加一个同步任务,从Zookeeper集群同步到Nacos集群,同步的粒度是服务,Zookeeper集群则称为源集群,Nacos集群称为目标集群<br />
![imagesd.png](https://img.alicdn.com/tfs/TB1tF_fJVYqK1RjSZLeXXbXppXa-2838-1138.png)

添加完成之后,可以在服务同步列表中,查看已添加的同步任务:<br />
![image.png](https://img.alicdn.com/tfs/TB1l6uJJ9zqK1RjSZPcXXbTepXa-2824-570.png)

2.同步完成之后,检查下数据是否同步成功到Nacos集群,可以通过Nacos的控制台进行查询<br />
![image.png](https://img.alicdn.com/tfs/TB1tPneJ4TpK1RjSZR0XXbEwXXa-2872-828.png)

此刻,数据已经成功从Zookeeper集群同步到了Nacos集群,部署结构如下:

![image.png](https://img.alicdn.com/tfs/TB14kriJ6TpK1RjSZKPXXa3UpXa-1724-772.png)
<a name="a881af49"></a>
### 让Dubbo客户端连接到Nacos注册中心
<a name="ebc99b4c"></a>
#### Dubbo Consumer客户端迁移
Dubbo 已经支持Nacos注册中心,支持的版本为2.5+,需要增加一个Nacos注册中心的Dubbo扩展插件依赖:
```basic
<dependency>
      <groupId>com.alibaba</groupId>
      <artifactId>dubbo-registry-nacos</artifactId>
			<version>0.0.2</version>
</dependency>
```
<br /><br />增加Nacos客户端的依赖:
```basic
<dependency>
        <groupId>com.alibaba.nacos</groupId>
        <artifactId>nacos-client</artifactId>
        <version>0.6.2</version>
</dependency>
```

配置Dubbo Consumer的Dubbo配置文件,让客户端能够找到Nacos集群<br />consumer.yaml
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

不需要修改代码,配置更新完毕之后 ,你就可以重启你的应用,使之生效了.

Consumer发布完成之后,目前的部署结构如下:<br />
![image.png](https://img.alicdn.com/tfs/TB181fkJ3HqK1RjSZFEXXcGMXXa-1734-878.png)
<a name="dbe2c2d1"></a>
#### Dubbo Provider迁移

在升级Provider之前,你需要确保该Provider发布的服务,都已经配置在NacosSync中,同步的方式为从Nacos同步到Zookeeper,因为Provider升级连接到Nacos之后,需要确保老的Dubbo Consumer客户端能够在Zookeeper上订阅到该Provider的地址,现在,我们增加一个同步任务:<br />
![image.png](https://img.alicdn.com/tfs/TB1pdDnJ7voK1RjSZFwXXciCFXa-2872-1060.png)
<br />
![image.png](https://img.alicdn.com/tfs/TB19Ey_J6DpK1RjSZFrXXa78VXa-2842-660.png)

> 注意:Nacos服务同步到Zookeeper,不需要填写版本号,你在选择源集群的时候,版本号的输入框会自动隐藏掉


同步任务完成后,你就可以升级Provider了,升级Provider的方法,参考升级Consumer的步骤.
<a name="35707fdc"></a>
### 新的部署结构
* 在升级的过程中,会有新老版本的客户端同时存在,部署结构如下:

![image.png](https://img.alicdn.com/tfs/TB14Y_iJ3HqK1RjSZFPXXcwapXa-1728-838.png)
* 在所有的客户端迁移完成之后,部署结构如下:

![image.png](https://img.alicdn.com/tfs/TB1Cg2dJYvpK1RjSZPiXXbmwXXa-1466-864.png)

现在,Zookeeper集群,NacosSync集群就可以下线了.

<a name="1bbbb204"></a>
### 注意事项
* 同步任务添加之后,需要确保下服务是否成功同步到目标集群,可以通过目标集群的控制台进行查询
* NacosSync支持高可用集群模式部署,你只需要把数据库配置成同一个即可
* 如果梳理不清楚订阅和发布的服务,建议可以把服务都做双向同步
* Dubbo客户端目前不支持Nacos的权重功能,如果你用到了权重功能,需要重新考虑一下方案是否合适







