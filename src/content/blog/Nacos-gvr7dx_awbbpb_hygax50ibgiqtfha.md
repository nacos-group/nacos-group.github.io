---
title: "微服务最佳实践，零改造实现 Spring Cloud & Apache Dubbo 互通"
description: "微服务最佳实践，零改造实现 Spring Cloud & Apache Dubbo 互通"
date: "2024-08-22"
category: "article"
keywords: ["Nacos"]
authors: "CH3CHO"
---
术趋势，阿里云 MSE 在微服务业界率先推出了 Serverless 版。它有三大功能亮点，**第一是自适应弹性，**云原生网关和注册配置中心可以根据业务量自动地进行扩缩容，免去用户复杂的容量规划工作。对于注册配置中心来说，其资源消耗和多个因素相关，比如服务提供者数量、客户端连接数、TPS 等。但有些指标很难进行观测和提前规划。网关作为关键的流量入口，虽然可以预测日常业务流量，但很难判断计划外流量。通过云服务的自适应弹性，可以保证整个技术架构的稳定性及成本的可控。<br />**第二点是开箱即用免运维，**大大减轻用户的运维负担。MSE 将注册配置中心、云原生网关以及服务治理的关键事件，比如实例变更、节点启停、应用上下线、限流熔断等汇总成统一视图，便于问题的分析和排查。MSE Serverless 实例会在用户自定义的运维时间段，执行前置检查和自动升级。既保障组件处于最新的稳定版本，又能解除用户对于兼容性或者业务流量影响的担忧。另外很多用户缺乏配置告警规则的意识或经验，MSE Serverless 实例也支持默认告警配置，当一些严重事件发生的时候，尽早通知到用户，及时介入。<br />最后也是最重要的一点，**MSE Serverless 的计费方式跟业务量关联起来，门槛更低。**普通实例按照固定规格收费，对于创业初期的小规模业务，或者业务低峰时段，实际会有资源的浪费。MSE 注册配置中心 Serverless 按照客户端连接数计费，云原生网关 Serverless 按请求量计费，对于测试环境、潮汐式业务、中小规模业务，都会节省大量成本。<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/299576/1724304814623-f26c45d4-8fe7-4710-a4dd-48162b386d9f.webp#clientId=u45f642f4-20b0-4&from=paste&id=u2e2a8b90&originHeight=534&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u62208490-1049-4ea7-acf1-cf827c175da&title=)
<a name="pzpC3"></a>
### 构建高弹性的微服务架构
用户如果要自行构建一个全栈、高弹性的微服务架构，需要去权衡各个组件扩缩容的难易度，伸缩速度以及业务负载变化速率这些因素。如果基于 MSE Serverless 版，再结合阿里云其他云产品能力，可以轻松实现上述目标。如下图所示，用户业务流量经由 NLB 进入到云原生网关 Serverless 实例，并路由到部署在 ACK 或 SAE 上的应用，整条链路上的产品都具备自适应弹性能力。<br />当应用副本数随着业务流量增大，其访问注册配置中心的连接数及 TPS 也会随之升高，Nacos、ZooKeeper Serverless 实例也会进行相应的弹性伸缩。对于服务治理来说，它本身就是应用级的按需接入，当SAE 或者 ACK 上的某个应用开启服务治理以后，扩容出的应用副本也自动享受到服务治理能力。现在阿里云已经有二十多款 Serverless 产品，并且会继续推进核心产品全面的 Serverless 化。**通过 Serverless 云服务，用户可构建整体高弹性、低成本的微服务架构。**<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/299576/1724304814640-e1428382-8053-4e70-90e8-3963ddbe9048.webp#clientId=u45f642f4-20b0-4&from=paste&id=uebf99437&originHeight=583&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=uf3fef990-19af-4186-98fe-64c96d9f0fc&title=)<br />下面通过一个测试用例可以展示云原生网关 Serverless 实例如何与 ACK 容器集群配合，利用日志记录中的 QPS 指标和容器 HPA 机制，实现根据请求量进行整体扩容。<br />针对部署在容器集群的应用负载，我们创建一个 HPA 资源，设定最小和最大副本数，定义 QPS 为指标，每个副本的平均 QPS 达到 50 则触发扩容。<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/299576/1724304814606-14da1e9a-3fe0-494a-9ea8-028ca7ad9770.webp#clientId=u45f642f4-20b0-4&from=paste&id=ue0e43fff&originHeight=881&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=uc5045da2-8534-4ec4-a93c-4f13b28dd18&title=)<br />运行压测工具 10 分钟，发送到网关的请求从 400 TPS 逐级上升到 4000+ TPS。可以看到所有压测请求 100% 成功，而且平均 RT 保持在 9～10 毫秒的水平。实际上，网关服务和容器集群中的应用副本都进行了自动扩容，整个过程对用户完全透明，业务无感知。<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/299576/1724304814646-63268e63-e775-46d9-8c91-5ce42e6d9240.webp#clientId=u45f642f4-20b0-4&from=paste&id=u826434a6&originHeight=474&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u629130fd-18df-49b7-9a0e-55355856c9b&title=)
<a name="EzGCT"></a>
### MSE Serverless 适用场景
MSE Serverless 虽说有诸多优势，但也要分场景选用，普通实例和 Serverless 实例如何选型？这里我们列出二者的功能及适用场景的异同。在高可用方面，两种实例都支持多节点集群的多可用区部署，只是 SLA 稍有区别。在运维方面，用户需要手动升级普通实例的版本，并关注底层资源监控指标，到阈值时及时手动变配。而Serverless 实例会进行自动升级和弹性扩缩容，用户不需要做复杂的容量规划和手动变配，也不需要关心 CPU、内存等资源的监控和告警。<br />对于云原生网关，普通实例支持的通信协议和认证鉴权种类稍多，具备硬件加速和可扩展性能力。**Serverless 实例也支持了主流协议和认证鉴权方式，能覆盖大部分的用户需求。**<br />综上所述，Serverless 实例更多是面向中小规模业务，间歇潮汐型场景，测试环境。而且用户希望免运维，更简单地使用后端服务。普通实例面向的是中大规模业务，希望掌控部分运维工作，并有更多自主性，扩展性需求的用户。<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/299576/1724304815049-20a3e4ce-0919-443e-8039-8fd68162f990.webp#clientId=u45f642f4-20b0-4&from=paste&id=u36599d5b&originHeight=460&originWidth=771&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u8a9fb855-ad22-43e9-a7ba-9b4c3083c94&title=)<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/299576/1724304814978-f04faf0a-9c23-4391-89fa-9fdbf6677ccd.webp#clientId=u45f642f4-20b0-4&from=paste&id=u8755011f&originHeight=607&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u47ed4749-cc04-4e8f-a2ee-0f7ed686316&title=)
<a name="lcPwN"></a>
### MSE Serverless 如何降本
用户无论是自建还是使用普通实例，一般会根据高业务负载购买相关的规格，按固定资源付费。这样在波谷期浪费的资源较多，整体成本较高。如果出现预期外的大业务流量，资源不足会使业务受损。Serverless 实例能进行快速且独立的扩容和缩容，在快速响应业务变化的同时，合理优化使用成本，助力企业降本增效。<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/299576/1724304815101-28fb3f74-5dad-41c8-b13e-8ceba2c74fc9.webp#clientId=u45f642f4-20b0-4&from=paste&id=u7b130b4a&originHeight=460&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u7ee84c2e-24f4-4e67-859a-091a29dc703&title=)<br />注册配置中心 Serverless 实例按照客户端到服务端的连接总数计费，每十个连接为一个计费单位，阶梯定价，小时计费，具体价格如下图表格所示。假设用户的业务量平稳，如折线图所示，橙线代表 Serverless 实例月价，蓝线代表普通实例的专业版集群月价。当小时连接数一直在十个或十个以内，Serverless 实例的月费用是 115 元。即使到了 50 个连接的业务量，都要比 Nacos 或 ZooKeeper 开源自建成本更低。在 100 个连接以内，Serverless 实例费用比普通实例更低，所以对于中小规模业务更优。<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/299576/1724304815384-b88b6882-6f21-452e-843c-703f41af7b51.webp#clientId=u45f642f4-20b0-4&from=paste&id=u0bd10996&originHeight=497&originWidth=876&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u49c290e0-4860-4bc1-b742-3aec32cb770&title=)<br />云原生网关 Serverless 实例统计每小时处理请求量，每 1 万个请求为一个计费单位，阶梯定价，小时计费，具体价格如下图表格所示。假设用户的业务量平稳，如折线图所示，橙线代表 Serverless 实例月价，蓝线代表普通实例集群月价。每小时累计请求在 5 万以内，Serverless 实例相比开源自建成本更低，在 20 万请求以内，比普通实例更低。<br />上述假设是业务量较小且保持在一定量级，除此之外，Serverless 对于间歇、潮汐式场景，累计费用也更低。如下面的柱状图所示，假设 10 个小时内业务量有较大变化，刚开始每小时请求量为 20 万～30 万，最高峰为每小时 200 万，然后逐渐回落。对于网关这种关键入口，普通实例需要预留资源保证能够支撑 200 万请求量的业务峰值。但对于 Serverless 实例，它的费用随业务量变化而不同。虽然在峰值时段 Serverless 实例的小时费用更高，但整个时段的费用累加后，明显看出它的成本更优。<br />![](https://intranetp
很遗憾，这不是一篇关于中间件理论或原理讲解的文章，没有高深晦涩的工作原理分析，文后也没有令人惊叹的工程数字统计。**本文以实际项目和代码为示例，一步一步演示如何以最低成本实现 Apache Dubbo 体系与 Spring Cloud 体系的互通，进而实现不同微服务体系的混合部署、迁移等，帮助您解决实际架构及业务问题。**
<a name="bYPgl"></a>
### 背景与目标
如果你在微服务开发过程中正面临以下一些业务场景需要解决，那么这篇文章可以帮到您：

- 您已经有一套基于 Dubbo 构建的微服务应用，这时你需要将部分服务通过 REST HTTP 的形式（非接口、方法模式）发布出去，供一些标准的 HTTP 端调用（如 Spring Cloud 客户端），整个过程最好是不用改代码，直接为写好的 Dubbo 服务加一些配置、注解就能实现。
- 您已经有一套基于 Spring Cloud 构建的微服务体系，而后又构建了一套 Dubbo 体系的微服务，你想两套体系共存，因此现在两边都需要调用到对方发布的服务。也就是 Dubbo 应用作为消费方要调用到 Spring Cloud 发布的 HTTP 接口，Dubbo 应用作为提供方还能发布 HTTP 接口给 Spring Cloud 调用。
- 出于一些历史原因，你正规划从一个微服务体系迁移到另外一个微服务体系，前提条件是要保证中间过程的平滑迁移。

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/299576/1724304898011-b1b5376a-13b9-424d-9e4f-a5f202c662cc.webp#clientId=u0f969974-f856-4&from=paste&id=u17808bcb&originHeight=488&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u849fd8ac-a491-45f0-84e5-b4d751d7894&title=)<br />对于以上几个场景，我们都可以借助 Dubbo3 内置的 REST 编程范式支持实现，这让 Dubbo 既可以作为消费方调用 HTTP 接口的服务，又可以作为提供方对外发布 REST 风格的 HTTP 服务，同时整个编码过程支持业界常用的 REST 编程范式（如 JAX-RS、Spring MVC 等），因此可以做到基本不改动任何代码的情况下实现 Dubbo 与 Spring Cloud 体系的互相调用。

- 关于这一部分更多的设计与理论阐述请参见这里的博客文章**[****1]**
- 关于 Dubbo REST 的更多配置方式请参见 rest 使用参考手册**[****2]**
<a name="gcXtQ"></a>
### 示例一：Dubbo 调用 Spring Cloud
在已经有一套 Spring Cloud 微服务体系的情况下，演示如何使用 Dubbo 调用 Spring Cloud 服务（包含自动的地址发现与协议传输）。在注册中心方面，本示例使用 Nacos 作为注册中心，对于 Zookeeper、Consul 等两种体系都支持的注册中心同样适用。<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/299576/1724304895913-0f8240a9-adfe-4b0e-8996-08ccfdf45fb5.webp#clientId=u0f969974-f856-4&from=paste&id=u79d1d676&originHeight=318&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u9f930d1b-bf28-4038-ac3a-1a268aac200&title=)<br />设想你已经有一套 Spring Cloud 的微服务体系，现在我们将引入 Dubbo 框架，让 Dubbo 应用能够正常的调用到 Spring Cloud 发布的服务。本示例完整源码请参见 samples/dubbo-call-sc**[3]**。
<a name="eja2Z"></a>
#### 启动 Spring Cloud Server
示例中 Spring Cloud 应用的结构如下：<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/299576/1724304897957-3f918e57-22ea-4585-8dea-4e0e9c8d2f23.webp#clientId=u0f969974-f856-4&from=paste&id=u83c6fc4c&originHeight=566&originWidth=704&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u5e345d91-6b61-4011-989d-8718cf9483c&title=)<br />应用配置文件如下：<br />server:  port: 8099spring:  application:    name: spring-cloud-provider-for-dubbo  cloud:    nacos:      serverAddr: 127.0.0.1:8848 #注册中心<br />以下是一个非常简单的 Controller 定义，发布了一个 /users/list/的 http 端点。
```
@RestController@RequestMapping("/users")public class UserController {    @GetMapping("/list")    public List<User> getUser() {        return Collections.singletonList(new User(1L, "spring cloud server"));    }}
```
启动 SpringCloudApplication，通过 cURL 或浏览器访问 http://localhost:8099/users/list 可以测试应用启动成功。
<a name="tlQen"></a>
#### 使用 Dubbo Client 调用服务
Dubbo client 也是一个标准的 Dubbo 应用，项目基本结构如下：<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/299576/1724304898034-0d1f0598-37c4-493b-9b27-00e3b88d5ec5.webp#clientId=u0f969974-f856-4&from=paste&id=u3a5b2364&originHeight=788&originWidth=822&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=uc66b043e-94fa-4328-ab47-3cd059af491&title=)<br />其中，一个比较关键的是如下接口定义（正常情况下，以下接口可以直接从原有的 Spring Cloud client 应用中原样拷贝过来即可，无需做任何修改）。<br />如果之前没有基于 OpenFeign 的 Spring Cloud 消费端应用，那么就需要自行定义一个接口，此时不一定要使用 OpenFeign 注解，使用 Spring MVC 标准注解即可。<br />通过 DubboReference 注解将 UserServiceFeign 接口注册为 Dubbo 服务。<br />@DubboReferenceprivate UserServiceFeign userService;<br />接下来，我们就可以用 Dubbo 标准的方式对服务发起调用了。
```
List<User> users = userService.users();
```
通过 DubboConsumerApplication 启动 Dubbo 应用，验证可以成功调用到 Spring Cloud 服务。
<a name="I8ajK"></a>
### 示例二：Spring Cloud 调用 Dubbo
在接下来的示例中，我们将展示如何将 Dubbo server 发布的服务开放给 Spring Cloud client 调用。<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/299576/1724304895913-d561fea2-ba3a-475a-b397-a8614c35bd9a.webp#clientId=u0f969974-f856-4&from=paste&id=u4d328059&originHeight=317&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=uf433104c-ba7b-49c5-b783-26560435b6f&title=)<br />示例的相关源码在 samples/sc-call-dubbo**[4]**
<a name="ozqfi"></a>
#### 启动 Dubbo Server
Dubbo server 应用的代码结构非常简单，是一个典型的 Dubbo 应用。<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/299576/1724304898332-75c4e035-4da1-4481-b53e-0c17419c0ac5.webp#clientId=u0f969974-f856-4&from=paste&id=u8e2298c1&originHeight=716&originWidth=766&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=uf74c1697-014d-4e7e-8e42-c77ee556167&title=)

相比于普通的 Dubbo 服务定义，我们要在接口上加上如下标准 Spring MVC 注解：
```
@RestController@RequestMapping("/users")public interface UserService {    @GetMapping(value = "/list")    List<User> getUsers();}
```
除了以上注解之外，其他服务发布等流程都一致，使用 DubboService 注解发布服务即可：<br />@DubboServicepublic class UserServiceImpl implements UserService {    @Override    public List<User> getUsers() {        return Collections.singletonList(new User(1L, "Dubbo provider!"));    }}<br />在服务配置上，特别注意我们需要将服务的协议配置为 rest protocol: rest，地址发现模式使用 register-mode: instance：<br />dubbo:  registry:    address: nacos://127.0.0.1:8848    register-mode: instance  protocol:    name: rest    port: 8090<br />启动 Dubbo 应用，此时访问以下地址可以验证服务运行正常：http://localhost:8090/users/list
<a name="yHMfd"></a>
#### 使用 Spring Cloud 调用 Dubbo
使用 OpenFeign 开发一个标准的 Spring Cloud 应用，即可调用以上发布的 Dubbo 服务，项目代码结构如下：<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/299576/1724304896273-e43af485-e5e8-468d-a8d9-bfbd90bbe0b9.webp#clientId=u0f969974-f856-4&from=paste&id=u871f7e12&originHeight=804&originWidth=858&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=ud741ebd9-39a7-47bc-80fc-831a7b31f97&title=)<br />其中，我们定义了一个 OpenFeign 接口，用于调用上面发布的 Dubbo rest 服务。
```
@FeignClient(name = "dubbo-provider-for-spring-cloud")public interface UserServiceFeign {    @RequestMapping(value = "/users/list", method = RequestMethod.GET)    List<User> getUsers();}
```
定义以下 controller 作为 OpenFeign 和 RestTemplate 测试入口：
```
public class UserController {
    private final RestTemplate restTemplate;    private final UserServiceFeign userServiceFeign;
    public UserController(RestTemplate restTemplate,                          UserServiceFeign userServiceFeign) {        this.restTemplate = restTemplate;        this.userServiceFeign = userServiceFeign;    }
    @RequestMapping("/rest/test1")    public String doRestAliveUsingEurekaAndRibbon() {        String url = "http://dubbo-provider-for-spring-cloud/users/list";        System.out.println("url: " + url);        return restTemplate.getForObject(url, String.class);    }
    @RequestMapping("/rest/test2")    public List<User> doRestAliveUsingFeign() {        return userServiceFeign.getUsers();    }}
```
根据以上 Controller 定义，我们可以分别访问以下地址进行验证：

- **OpenFeign 方式：**http://localhost:8099/dubbo/rest/test1
- **RestTemplage 方式：**http://localhost:8099/dubbo/rest/test2
<a name="TLGmx"></a>
#### 为 Dubbo Server 发布更多的服务
我们可以利用 Dubbo 的多协议发布机制，为一些服务配置多协议发布。接下来，我们就为上面提到的 Dubbo server 服务增加 dubbo tcp 协议发布，从而达到以下部署效果，让这个 Dubbo 应用同时服务 Dubbo 微服务体系和 Spring Cloud 微服务体系。<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/299576/1724304896598-ac826227-e2d4-4b2a-a229-83973fad9236.webp#clientId=u0f969974-f856-4&from=paste&id=ub227577d&originHeight=314&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u45a1c064-a823-4dc0-b184-f29ec85f52c&title=)<br />为了实现这个效果，我们只需要在配置中增加多协议配置即可：
```
dubbo:  protocols:    - id: rest      name: rest      port: 8090    - id: dubbo      name: dubbo      port: 20880
```
同时，服务注解中也配置为多协议发布：<br />@DubboService(protocol="rest,dubbo")public class UserServiceImpl implements UserService {}<br />这样，我们就成功的将 UserService 服务以 dubbo 和 rest 两种协议发布了出去（多端口多协议的方式），dubbo 协议为 Dubbo 体系服务，rest 协议为 Spring Cloud 体系服务。<br />**注意：**Dubbo 为多协议发布提供了单端口、多端口两种方式，这样的灵活性对于不同部署环境下的服务会有比较大的帮助。在确定您需要的多协议发布方式前，请提仔细阅读以下多协议配置**[****5]**文档。
<a name="j4QQz"></a>
### 总结
基于 Dubbo 的 rest 编程范式、多协议发布等特性，可以帮助你轻松的实现 Dubbo 服务的 http 协议发布，让后端服务基于 RPC 高效通信的同时，能够更容易的与 http 服务体系打通，本示例通过 Dubbo 与 Spring Cloud 两套体系的共存、互通示例非常清晰的演示了编码过程。<br />此部分内容的正式版本将在 Dubbo 3.3.0 版本正式发布，同时还包含 Triple 协议的重磅升级，敬请期待！<br />**相关链接：**<br />[1] 博客文章<br />_https://cn.dubbo.apache.org/zh-cn/blog/2023/01/05/dubbo-%e8%bf%9e%e6%8e%a5%e5%bc%82%e6%9e%84%e5%be%ae%e6%9c%8d%e5%8a%a1%e4%bd%93%e7%b3%bb-%e5%a4%9a%e5%8d%8f%e8%ae%ae%e5%a4%9a%e6%b3%a8%e5%86%8c%e4%b8%ad%e5%bf%83/_<br />[2] rest 使用参考手册<br />_https://cn.dubbo.apache.org/zh-cn/overview/reference/proposals/protocol-http/_<br />[3] samples/dubbo-call-sc<br />_https://github.com/apache/dubbo-samples/tree/master/2-advanced/dubbo-samples-springcloud/dubbo-call-sc_<br />[4] samples/sc-call-dubbo<br />_https://github.com/apache/dubbo-samples/tree/master/2-advanced/dubbo-samples-springcloud/sc-call-dubbo_<br />[5] 多协议配置<br />_https://cn.dubbo.apache.org/zh-cn/overview/mannual/java-sdk/advanced-features-and-usage/service/multi-protocols/_

