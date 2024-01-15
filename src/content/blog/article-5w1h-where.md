---
title: Nacos 有哪些典型的应用场景？—— 配置管理篇
keywords: [nacos]
description: Nacos 配置管理有哪些典型的应用场景？
date: "2018-12-06"
category: article
---

# Nacos 有哪些典型的应用场景？—— 配置管理篇
> Authors: 何煦

[上篇](src/content/blog/article-5w1h-what.md)作为 Nacos 5W1H 系列文章的开篇，从“What” 讲述了 Nacos 配置管理能帮我们解决的问题：以简单、优雅、高效的方式管理配置，实现配置的动态变更，大大降低运维成本。

本文将围绕“Where”，讲述 Nacos 配置管理的三个典型的应用场景：

* 数据库连接信息
* 限流阈值和降级开关
* 流量的动态调度

# 数据库连接信息

曾经有朋友跟我聊过一个问题，“业务飞速发展，团队越来越大，人员流动也相对频繁起来，怎么才能更好的保证数据的安全性，不被泄露呢？”。他提到这样一个场景，公司创立初期，服务后端的代码都是他一行一行码出来的，当时只有他一个人，后端与数据库的连接配置信息也就直接放置在项目的配置文件中。他使用的是 Spring Boot 框架，配置信息就是存放在 `application.properties` 中，使用 Spring 的 profile 属性保证不同环境连接不同的数据库。如下所示：

生产环境：application-prod.properties

```
spring.datasource.url=生产环境的数据库连接地址
spring.datasource.username=生产环境的数据库用户账号
spring.datasource.password=生产环境的数据库用户密码
```

开发环境：application-dev.properties

```
spring.datasource.url=开发环境的数据库连接地址
spring.datasource.username=开发环境的数据库用户账号
spring.datasource.password=开发环境的数据库用户密码
```

测试、预发环境也是类似。这种将数据库连接信息直接放置在配置文件中，跟着项目代码一起通过 Git 管理，的确是有蛮大的数据泄露的风险。试想，一个新来不久的小伙伴，他一当要投入研发工作，有 Git Pull 代码的权限之后，代表他可能就拥有了直接操作线上数据库的权限了。当时的我给他建议可以通过以下几个方面去降低数据风险：

* 将数据库连接信息等敏感配置从项目中剥离；
* 数据库增加 IP 白名单连接限制；
* 最小权限原则：每个账号只配置所必需的权限，避免删表删库等高危操作；
* 定期修改数据库账号、密码。

回想起来，我当时给的建议并没有完全解决他的问题，甚至还带来了其他一些问题。例如，上述的第一点，“将敏感配置从项目剥离”，剥离出来的敏感配置存放到哪里？怎么管理这些配置呢？也许，你会想到，存放到应用部署机器的环境变量或某个文件中。不，一样有风险，说不定哪天开发同学必须得登录上机器排查问题，就有泄露的风险，总之，得尽可能地做到在整个开发流程都不会有任何泄露的风险。应用中可能不只是连接一个数据源，分库分表的情况，不同数据存储（如 MySQL / Redis / Elasticsearch 等）的情况，还有，其他更多敏感配置项，配置数据的增多会给管理带来不便。

另外，“定期修改数据库账号、密码”，修改后我能怎么方便快捷的下发到所有应用程序中呢？既然是敏感配置，其变更也会带来不少的风险，我需要能先到小量的几台机器验证，保证对业务无影响，我再全部下发到其他所有的机器上去，是否还得有“灰度发布”的功能呢？账号密码修改下发后，应用出现异常，影响到业务了，我要怎么快速地回滚呢？是否还得有“版本控制”、“快速回滚”的功能呢？不是所有的开发同学都有权限能修改敏感配置信息，是否还需要有“权限管控”的功能？对敏感配置的任何操作都应该被记录，是否还需要有“变更审计”的功能呢？

现在，我有了更好的建议：使用 Nacos 配置管理模块，将敏感配置信息都存放到 Nacos 中。Nacos 配置管理，其中一个立身之本就是为敏感配置保驾护航。它提供上述场景所需的功能，通过命名空间区分不同环境（开发、测试、预发、生产），通过“版本控制”保证变更可追溯，通过“快速回滚”保证错误变更时影响最小，通过的“灰度发布”功能保障配置安全平稳地变更，还有更多更全面功能（权限管控、变更审计等）即将支持。

那么，怎么将敏感配置项目的配置文件中迁移到 Nacos 中呢？下面以 Spring Boot 连接 MySQL 为例：

1. 添加依赖

```
<dependency>
    <groupId>com.alibaba.boot</groupId>
    <artifactId>nacos-config-spring-boot-starter</artifactId>
    <version>${latest.version}</version>
</dependency>
```

注意 Spring Boot 1.x 使用 `nacos-config-spring-boot-starter` 0.1.x 版本，Spring Boot 2.x 使用 `nacos-config-spring-boot-starter` 0.2.x 版本。

2. 在 `application.properties` 中添加 Nacos 连接配置

```
nacos.config.server-addr=127.0.0.1:8848
```

这里是简单的示例，在实际生产中，还需配置 Nacos 命名空间信息（区分环境）、鉴权信息（如 AccessKey、SecretKey 等，即将支持的权限访问控制）。而 Nacos 配置模块对应的阿里云产品 ACM，借助于 [ECS 实例 RAM 角色](https://help.aliyun.com/document_detail/72013.html)，最终能到达连 AccessKey、SecretKey 都不需要填写的目的。

3. 添加 `@NacosPropertySource` 注解

```
@SpringBootApplication
@NacosPropertySource(dataId = "mysql.properties")
public class SpringBootMySQLApplication {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

4. 在本地启动的 Nacos 控制台上新增 dataId 为 `mysql.properties` 的配置，配置内容为 MySQL 连接配置信息：



![image.png | left | 747x447](https://cdn.nlark.com/lark/0/2018/png/96000/1543757963981-1a8a4a20-bb01-4b06-a17d-4bd27bb278b5.png "")


通过这四个简单的步骤，就将 MySQL 连接信息从原来的 `application.properties` 迁移到 Nacos 的，让 Nacos 将敏感配置管控起来，大大降低数据泄露的风险。同时，Nacos 配置管理提供的“统一管控”、“版本控制”、“快速回滚”等强大的功能也为其运维管理带来极大的便利。

完整示例代码请参看：[https://github.com/nacos-group/nacos-examples/tree/master/nacos-spring-boot-example/nacos-spring-boot-config-mysql-example](https://github.com/nacos-group/nacos-examples/tree/master/nacos-spring-boot-example/nacos-spring-boot-config-mysql-example)

# 限流阈值和降级开关

限流、降级，众所周知，是在开发高并发系统过程中需要考虑的两大关键点，是运行时保护系统的两大利器。限流阈值和降级开关，最终是抽象为一个个的配置项，要想实现运行时的动态调整阈值和开关的启停，将这些配置项存放到 Nacos 的配置模块中最适合不过了。

在今年 8 月的时候，阿里巴巴开源了 Sentinel，以流量为切入点，从流量控制、熔断降级、系统负载保护等多个维度保护服务的稳定性。在阿里巴巴内部，Nacos 跟 Sentinel 就是多年携手相伴，砥砺前行的好机油，为双 11 等各种大促立下了功劳，也为剁手党提供了良好的购物体验。

下面就以 Sentinel 流控为例，演示如果通过 Nacos 来做到运行时的动态控制流量：

1. 添加依赖

```
<dependency>
    <groupId>com.alibaba.csp</groupId>
    <artifactId>sentinel-core</artifactId>
    <version>${latest.version}</version>
</dependency>
<dependency>
    <groupId>com.alibaba.csp</groupId>
    <artifactId>sentinel-datasource-extension</artifactId>
    <version>${latest.version}</version>
</dependency>
<dependency>
    <groupId>com.alibaba.csp</groupId>
    <artifactId>sentinel-datasource-nacos</artifactId>
    <version>${latest.version}</version>
</dependency>
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>${latest.version}</version>
</dependency>
```

2. 模拟并发请求

```
final class RunTask implements Runnable {
    @Override
    public void run() {
        while (!stop) {
            Entry entry = null;
            try {
                entry = SphU.entry(resourceName);
                // token acquired, means pass
                pass.addAndGet(1);
            } catch (BlockException e1) {
                block.incrementAndGet();
            } catch (Exception e2) {
                // biz exception
            } finally {
                total.incrementAndGet();
                if (entry != null) {
                    entry.exit();
                }
            }

            Random random2 = new Random();
            try {
                TimeUnit.MILLISECONDS.sleep(random2.nextInt(50));
            } catch (InterruptedException e) {
                // ignore
            }
        }
    }
}
```

3. 配置 Nacos 连接信息与 dataId 等，并将其设置为 Sentinel 的数据源

```
public class NacosDynamicFlowDemo {

    private static final String KEY = "TestResource";

    public static void main(String[] args) {
    	final String remoteAddress = "localhost";
        final String groupId = "DEFAULT_GROUP";
        final String dataId = "com.alibaba.nacos.demo.flow.rule";

        ReadableDataSource<String, List<FlowRule>> flowRuleDataSource = new NacosDataSource<>(remoteAddress, groupId, dataId,
            source -> JSON.parseObject(source, new TypeReference<List<FlowRule>>() {}));
        FlowRuleManager.register2Property(flowRuleDataSource.getProperty());
        
        // Assume we config: resource is `TestResource`, initial QPS threshold is 5.
        FlowQpsRunner runner = new FlowQpsRunner(KEY, 1, 10000);
        runner.simulateTraffic();
        runner.tick();
    }
}
```

4. 在本地启动的 Nacos 控制台中新建 dataId 为 `com.alibaba.nacos.demo.flow.rule` 的流控配置



![image.png | left | 747x580](https://cdn.nlark.com/lark/0/2018/png/96000/1543757996381-9b766bd9-d400-4426-8c65-eb5d17fce5db.png "")


5. 运行 `NacosDynamicFlowDemo`，你会看到如下标准输出信息



![image.png | left | 588x222](https://cdn.nlark.com/lark/0/2018/png/96000/1543758470779-0a01e695-0ef9-4186-b737-190310eaf457.png "")


6. 再到 Nacos 控制台修改刚刚新建的流控配置，将限流阈值 `count` 的值修改为 `1.0`，完整的标准输出信息如下



![image.png | left | 592x392](https://cdn.nlark.com/lark/0/2018/png/96000/1543758536357-bdf7733b-aafc-482b-b0c7-27917434e643.png "")


以上示例演示了如何通过 Nacos + Sentinel 实现动态流量控制的能力，核心就是用到了 Nacos 配置模块“动态推送”的能力。原理是 `sentinel-datasource-nacos` 集成了 `nacos-client` ，其与 `nacos-server` 维持着连接，当用户在 Nacos 控制台进行配置变更时，`nacos-server` 会快速地将该配置的最新内容推送到 `nacos-client` 中，Sentinel 一拿到最新的流控配置，就转换了流控策略，如示例将流控阈值调整为 1.0，限制为更少的流量进入系统的业务处理流程。

完整示例代码请参看：[https://github.com/nacos-group/nacos-examples/tree/master/nacos-sentinel-example](https://github.com/nacos-group/nacos-examples/tree/master/nacos-sentinel-example)

# 流量的动态调度

业务发展壮大到一定的规模，单一的集群已经承载不了全部的用户请求，需要将用户的流量分流到不同的集群上。当然，更进一步的方案是：不同的集群位于不同的区域，这样，除了缓解业务处理的压力，也给系统带来容灾的能力。

比如，某电商系统有 1 亿用户量，将系统的流量按照用户的 ID 进行切分，ID 为 1-1000W 的用户请求分发到区域 A 的集群 a 上，ID 为 10001W-2000W 的用户请求流量分发到区域 B 的集群 b 上，以此类推，最终将所有用户的请求流量打散到 10 个不同区域的集群上，同时，每个集群冗余了一些系统资源。当区域 A 的机房发生不可抗的灾难（如地震）时，我们需要有动态调度流量的能力，最好能秒级得将流量从区域 A 调度到另外可用的区域的集群上。

这正是 Nacos 配置管理大有作为的地方，将用户 ID 的分片和对应的路由规则存放在 Nacos 的中，配合统一接入层等的组件，就能将流量打散到各个集群上，进而让系统能承载更大的流量，以更好的支撑业务的发展。另外，将其存放与 Nacos 中，也就具备了配置“动态化”的能力，一旦某区域出现基础设施无法及时恢复的问题时，只需在 Nacos 的控制台上修改 ID 分片的路由规则，就能将有问题的区域流量快速切换到其他可用的区域上，保障对业务几乎无损。Nacos 在阿里内部能做到秒级推送到十万级别机器上的推送效率。

# 总结

本文为 Nacos 5W1H 系列文章的第二篇，围绕“Where”，讲述了 Nacos 配置管理的几个典型的应用场景：数据库连接信息、限流阈值和降级开关、流量的动态调度。其实还有更多更大胆的应用场景，如“大数据实时计算算法调整”、“异地容灾多活”、“应用业务场景动态推送”等等，可以参看 [Nacos 的阿里云产品 ACM 的使用场景](https://help.aliyun.com/document_detail/59972.html) 。Nacos 配置管理模块，将敏感配置收拢管控起来，极大降低数据泄露等风险，并且提供如“动态推送”、“版本控制”、“快速回滚”等功能，保障了敏感配置的变更安全平稳的执行。

在限流与降级的场景，通过一个示例，为大家演示了如何通过 Nacos + Sentinel 实现流量的动态控制，这也是 Nacos 配置管理的一个十分典型的应用场景。降级也一样，大促高峰期间将某个非关键的系统组件进行关闭，在过了高峰期后再开启，这个也是可以通过 Nacos 的“动态推送”的功能来实现。

总之，只要系统涉及到了“敏感的配置”、“动态的配置”，都应该考虑将配置放入到 Nacos 中，让 Nacos 管控起来。



![屏幕快照 2018-12-03 18.59.52.png | left](https://cdn.nlark.com/lark/0/2018/png/15914/1543892400157-f9dbf212-c835-44be-871c-73166b3b177b.png "")
