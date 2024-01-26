---
title: Nacos 1.1.0发布，支持灰度配置和地址服务器模块
keywords: [Nacos 1.1.0, nacos]
description: Nacos 是阿里巴巴开源的配置中心和服务发现产品，开源距今已经超过一年的时间。本次1.1.0的发布，带来了许多重量级的特性更新，包括灰度配置等社区呼声很高的特性。
date: "2019-07-10"
category: release
---

# Nacos 1.1.0发布，支持灰度配置和地址服务器模式

Nacos 是阿里巴巴开源的配置中心和服务发现产品，开源距今已经超过一年的时间。本次1.1.0的发布，带来了许多重量级的特性更新，包括灰度配置等社区呼声很高的特性，下面会介绍1.1.0版本发布的新特性和每个特性的使用方式。

<a name="CQSXH"></a>
## 升级指南
<a name="6l7mA"></a>
#### Server端
0.8.0及以上版本：

1. 解压安装包后替换{nacos.home}/target/nacos-server.jar
1. 删除{nacos.home}/plugins/cmdb/及{nacos.home}/plugins/health/下的所有文件
1. 逐台重启Nacos Server即可

0.8.0以下版本，先升级到1.0.0版本。
<a name="yfczA"></a>
#### Client端
请使用最新的1.1.1版本，修复了1.1.0版本的一个客户端版本显示问题。


<a name="CfMxA"></a>
## 新增特性

- 灰度配置
- 配置导入导出及配置同步 
- 地址服务器模块
- 服务订阅者列表
- 自定义实例心跳周期
- Config监听器优化
- Nacos Go SDK发布

<a name="LYY0I"></a>
### 灰度配置
@yanlinly @loadchange

灰度配置指的是指定部分客户端IP进行新配置的下发，其余客户端配置保持不变，用以验证新配置对客户端的影响，保证配置的平稳发布。灰度配置是生产环境中一个比较重要的功能，对于保证生产环境的稳定性非常重要。在1.1.0中，Nacos支持了以IP为粒度的灰度配置，具体使用步骤如下：

1. 在配置列表页面，点击某个配置的“编辑配置”按钮：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1562579955002-bc2de409-26a4-43b7-8cdb-4bc83653ce8a.png#align=left&display=inline&height=262&name=image.png&originHeight=524&originWidth=2506&size=183572&status=done&width=1253)

2. 勾选“Beta发布”，在文本框里填入要下发配置配置的IP，多个IP用逗号分隔：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1562580241038-085504e7-b63a-42ec-9304-08256ae3beba.png#align=left&display=inline&height=429&name=image.png&originHeight=858&originWidth=1766&size=148534&status=done&width=883)


3. 修改配置内容，点击“发布Beta”按钮，即可完成灰度配置的发布：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1562580334216-78ac746b-e0de-4c33-b67d-bde89ef13f55.png#align=left&display=inline&height=527&name=image.png&originHeight=1054&originWidth=2506&size=179061&status=done&width=1253)

4. 点击“发布Beta”后，“发布Beta”按钮变灰，此时可以选择“停止Beta”或者“发布”。“停止Beta”表示取消停止灰度发布，当前灰度发布配置的IP列表和配置内容都会删除，页面回到正常发布的样式。“发布”表示将灰度配置在所有客户端生效，之前的配置也会被覆盖，同时页面回到正常发布的样式：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1562595148249-e64b0585-525d-450d-a87c-6e3fd194351c.png#align=left&display=inline&height=489&name=image.png&originHeight=978&originWidth=2512&size=184032&status=done&width=1256)


<a name="1t0AL"></a>
### 配置导入导出及配置同步
@KeRan213539

配置管理的另一个常见需求是能够将一个集群的配置同步到另外一个集群，或者从一个命名空间同步到另外一个命名空间。来自社区的贡献者KeRan213539贡献这个非常实用的功能，具体使用步骤如下：

1. 导出查询结果。可以根据查询条件，将当期查询出的所有结果打包为一个文件：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1562596769546-89546d16-a764-488c-8f87-b1d038a207d2.png#align=left&display=inline&height=415&name=image.png&originHeight=830&originWidth=2526&size=368179&status=done&width=1263)

2. 导出选中的配置：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1562597197759-8cefeff9-13f6-4ef1-8c84-570efcd268e0.png#align=left&display=inline&height=367&name=image.png&originHeight=734&originWidth=2506&size=412720&status=done&width=1253)

3. 导入配置，可以选择相同配置的处理策略。

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1562597316659-9b4e673b-e74a-47ca-b4f6-a95ed63aebfb.png#align=left&display=inline&height=443&name=image.png&originHeight=886&originWidth=2500&size=472512&status=done&width=1250)

当发现有相同的配置时，会有相应的提示：<br />![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1562597345803-2cb1c6b2-aed5-41af-9e18-c43fd2fc3822.png#align=left&display=inline&height=478&name=image.png&originHeight=956&originWidth=2370&size=427447&status=done&width=1185)

同时如果导入的配置文件格式不符合要求，也会有相应的提示：<br />![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1562597543119-019c1e1d-0712-4d1e-9f53-bc8e01156290.png#align=left&display=inline&height=398&name=image.png&originHeight=796&originWidth=2508&size=411258&status=done&width=1254)

4. 配置同步，选取想要同步的配置，点击“克隆”，然后再选择要同步的目标命名空间，就可以将配置同步到对应的命名空间：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1562597665286-c5427451-62e6-4a47-b819-644d9709d089.png#align=left&display=inline&height=470&name=image.png&originHeight=940&originWidth=2516&size=499705&status=done&width=1258)

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1562597707334-4766ffef-cf8e-4791-a634-0857ac3eb40a.png#align=left&display=inline&height=466&name=image.png&originHeight=932&originWidth=2536&size=427102&status=done&width=1268)

5. 导入导出文件格式说明。均为zip压缩包，压缩包内有多个目录，目录名为配置的group，目录下有具体的文件，文件名为配置的dataId，每个文件的内容为配置具体的内容：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1562654528090-ab113140-c7d9-4eda-8a67-051a9f13f591.png#align=left&display=inline&height=75&name=image.png&originHeight=81&originWidth=635&size=34863&status=done&width=591)

<a name="a9Rf1"></a>
### 地址服务器模块
@pbting

1.1.0的安装包列表里多了一个nacos-address-server-1.1.0。这个安装包的作用是作为地址服务器模块，单独部署。关于地址服务器的介绍可以参考Nacos官网[地址服务器文章](https://nacos.io/en-us/blog/address-server.html)，这里只做一个简单的说明。

一般中间件产品，客户端寻址服务端的方式都是在客户端配置服务端的地址列表，这样有一个缺点是当服务端的地址发生变动时，客户端无法实时的感知到，也无法动态调整访问的服务端集群。而在阿里巴巴的一种比较常见的客户端寻址服务端的方式是地址服务器。简单的说就是部署单独的地址服务器，地址服务器提供接口，获取相关中间件产品服务端集群的地址。由于地址服务器功能比较单一，因此稳定性比较容易保证。客户端只需要配置地址服务器的域名，通过地址服务器获取想要访问的中间件的集群地址，这样既保证能够感知中间件集群的动态变化，也能够为客户端配置更灵活的集群访问策略。

下面介绍地址服务器模块的使用。

1. 部署地址服务器
  1. 将安装包列表里的nacos-address-server.tar.gz或者nacos-address-server.zip解压。
  1. 单机模式启动：执行 sh bin/startup.sh -m standalone -s nacos-address 以 standalone 的方式启动 address server。
  1. 集群模式启动：在 conf 目录下 将 cluster.conf.example 重名名为 cluster.conf，然后加入其它 server 的节点。加完后，执行 sh bin/startup.sh -s nacos-address 即可。
2. 配置地址服务器域名：将部署好的地址服务器集群IP挂载到一个域名下，我们假设为address.nacos.com
2. 在地址服务器上配置Nacos集群的地址列表：

```powershell
# Add IP to nacos cluster:
curl -X POST '$ADDRESS_SERVER:8080/nacos/v1/as/nodes?ips=1.1.1.1:8848,2.2.2.2:8848,3.3.3.3:8848'

# Remove IP from nacos cluster:
curl -X DELETE '$ADDRESS_SERVER:8080/nacos/v1/as/nodes?ips=1.1.1.1:8848,2.2.2.2:8848,3.3.3.3:8848'
```


4. 客户端配置endpoint为该地址服务器集群域名：在构造Nacos客户端时，除了可以通过指定serverAddr来访问Nacos集群外，还可以配置endpoint属性，将这个属性的值设为address.nacos.com，这样就可以达到和配置serverAddr相同的效果。
4. 通过源码构建地址服务器安装包，在Nacos工程根目录下执行：

```powershell
mvn -Prelease-address clean install -Dmaven.test.skip=true
```
安装包会生成在distribution/target目录下。

<a name="6COIS"></a>
### 服务订阅者列表
@nicholas2015

服务订阅者列表是1.1.0增加的另外一个功能，就是可以在控制台上查看一个服务的消费者，执行步骤如下：

1. 在服务列表页面，找到想要查询订阅者的服务：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1562640498681-5ab822e5-e293-4c17-9abe-63d541cb8058.png#align=left&display=inline&height=266&name=image.png&originHeight=532&originWidth=2504&size=149955&status=done&width=1252)

2. 进入订阅者列表页面，在“服务名称”输入框输入想要查询的服务名，在“分组名称”输入框输入服务的分组名（默认为DEFAULAT_GROUP），点击“查询”后，得到订阅者的信息，包括IP和端口、客户端版本和应用名。

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1562640552803-6fa89abd-a5c0-4ecd-90ce-cd9e6eacab1c.png#align=left&display=inline&height=280&name=image.png&originHeight=560&originWidth=2492&size=120344&status=done&width=1246)

<a name="Gw6wo"></a>
### 服务自定义心跳周期
@lanCao

之前的版本中，客户端注册服务时，不能自定义上报心跳的周期以及客户端下线时自动删除实例的间隔。在1.1.0中，我们支持了这个特性，应用可以在注册时，通过设置实例的metadata，来指定心跳周期、健康检查过期时间及删除实例时间。具体举例如下：

```java
String serviceName = randomDomainName();

Instance instance = new Instance();
instance.setIp("1.1.1.1");
instance.setPort(9999);
Map<String, String> metadata = new HashMap<String, String>();
// 设置心跳的周期，单位为秒，这里将心跳间隔设置为3秒：
metadata.put(PreservedMetadataKeys.HEART_BEAT_INTERVAL, "3000");
// 设置心跳超时时间，单位为秒，这里将心跳超时时间设为6秒，
// 即服务端6秒收不到客户端心跳，会将该客户端注册的实例设为不健康：
metadata.put(PreservedMetadataKeys.HEART_BEAT_TIMEOUT, "6000");
// 设置实例删除的超时时间，单位为秒，这里将实例删除超时时间设为9秒，
// 即服务端9秒收不到客户端心跳，会将该客户端注册的实例删除：
metadata.put(PreservedMetadataKeys.IP_DELETE_TIMEOUT, "9000");
instance.setMetadata(metadata);

naming.registerInstance(serviceName, instance);
```

<a name="QFEGE"></a>
### Config 监听器的优化
@chuntaojun<br />当存在程序启动之初，如果用户通过`ConfigService.getConfig`获取配置的同时，又注册了监听器，那么会存在监听器再次通知用户刚刚获取的配置信息。因此在`version 1.1.0`版本中，增加了新的接口以及一个系统参数（使用户无需修改现有代码）
```java
String getConfigAndSignListener(String dataId, String group, long timeoutMs, Listener listener) throws NacosException;
```

该方法在获取配置后，随即注册一个监听器，避免监听器通知用户刚刚才拉取的配置信息<br />`nacos.enableRemoteSyncConfig=true | false`<br />设置该系统参数，将在监听器注册时主动去向远端拉取当前最新的配置信息，但是存在一定的网络开销，因此建议用户采取接口的方式

<a name="unUgM"></a>
### Nacos Go SDK
@lzp0412 @peggypig @atlanssia

Nacos上周还发布了Go语言的SDK，目前发布了0.1.0-beta版本，仓库地址是：[https://github.com/nacos-group/nacos-sdk-go](https://github.com/nacos-group/nacos-sdk-go)。Nacos Go SDK是单独的仓库，由Nacos Committer参与维护，在代码上不属于Nacos 1.1.0。在此也非常欢迎社区的Go语言高手，参与Nacos Go SDK的演进。


<a name="0LhDq"></a>
## 如何共建

为了实现这一目标，你需要积极参与Nacos社区。如果您在文档中发现拼写错误，在代码中发现错误，或想要新功能或想要提供建议，您可以[在GitHub上创建一个issues](https://github.com/alibaba/Nacos/issues/new)。

如果您想开始着手，可以选择github仓库中有以下标签的issues。

- [good first issue](https://github.com/alibaba/nacos/labels/good%20first%20issue)：对于新手来说是非常好的入门issues。
- [contribution welcome](https://github.com/alibaba/nacos/labels/contribution%20%E6%AC%A2%E8%BF%8E)：非常需要解决的问题和非常重要的模块，但目前缺少贡献者，欢迎贡献者来贡献。



<a name="7ddae8a4"></a>
## 蓬勃发展的 Nacos 社区

> DISS is cheap, show me your hand
> 比吐槽更重要的是搭把手，参与社区一起发展Nacos


- 作为用户关注和加入 Nacos 社区

Nacos 社区正在蓬勃发展，截止到发文为止，Nacos 已经有 9 个微信群，其中 7 个已满员，1个QQ群，1个钉钉群，关注 Nacos 的社区人数已经近5000人，在 Nacos 群里跟 “道（基）友” 切磋技术，交流经验，招聘交友，抢抢红包...不亦乐乎。

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1560397428130-a878b99a-665f-413d-9e69-ec36b13f731f.png#align=left&display=inline&height=431&name=image.png&originHeight=420&originWidth=698&size=144746&status=done&width=716)

- 作为代码贡献者加入 Nacos 社区

为了能够与代码贡献者更方便的交流，我们组建了钉钉群“Nacos社区核心贡献小组（**23335652**）”，这个群里都是都是对Nacos贡献非常感兴趣的小伙伴，如果你也想成为Nacos贡献者，甚至成为Committer，欢迎加入这个群和群里的小伙伴一起切磋！

在Nacos官网 [nacos.io](http://nacos.io/) 中，已经添加[团队介绍页](https://nacos.io/docs/latest/community/nacos-dev/)，里面包括Nacos的开发者角色定义及职责划分，同时包含了Naocs的开发者们介绍和靓照哦，欢迎大家加入Nacos社区，贡献社区。用Apache的话说，**“社区高于代码”!**

![](https://cdn.nlark.com/lark/0/2018/png/15914/1542704700864-a9d54856-9bf6-4176-b449-c13fa02c5800.png#align=left&display=inline&height=387&linkTarget=_blank&originHeight=888&originWidth=1716&width=748#align=left&display=inline&height=386&originHeight=888&originWidth=1716&status=done&width=746)

<a name="2461e1c0"></a>
## 新人时刻 - "什么是Nacos？"

> 还不知道什么是Nacos? 没关系，在github上star一下跟程序猿兄弟打个招呼吧!!


[Nacos](https://github.com/alibaba/nacos) 是阿里巴巴于2018年7月份新开源的项目，Nacos的主要愿景是期望通过提供易用的 `动态服务发现`、`服务配置管理`、`服务共享与管理` 的基础设施，帮助用户在云原生时代更好的构建、交付、管理自己的微服务平台。

![image.png](https://cdn.nlark.com/yuque/0/2019/png/333810/1562644065145-5f315c7d-b48a-453d-9718-20fb9121dd14.png#align=left&display=inline&height=374&name=image.png&originHeight=748&originWidth=1722&size=456424&status=done&width=861)

github项目地址在 [这里](https://github.com/alibaba/nacos)

<a name="f26dbb6d"></a>
## 更多与 Nacos 相关的开源项目信息

- [Nacos](https://github.com/alibaba/nacos)
- [Dubbo Registry Nacos](https://github.com/dubbo/dubbo-registry-nacos)
- [Nacos DNS-F](https://github.com/nacos-group/nacos-coredns-plugin)
- [Nacos Docker](https://github.com/nacos-group/nacos-docker)
- [Nacos Spring Project](https://github.com/nacos-group/nacos-spring-project)
- [Nacos Spring Boot](https://github.com/nacos-group/nacos-spring-boot-project)
- [Spring Cloud Alibaba](https://github.com/spring-cloud-incubator/spring-cloud-alibaba)
- [Dubbo](http://dubbo.io/)
- [Sentinel](https://github.com/alibaba/Sentinel)
- [Spring Cloud](https://projects.spring.io/spring-cloud/)
- [Nepxion Discovery](https://github.com/Nepxion/Discovery)
- [Spring Cloud Gateway Nacos](https://github.com/SpringCloud/spring-cloud-gateway-nacos)
