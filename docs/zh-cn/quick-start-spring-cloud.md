# 前提条件

请先参看 [Nacos 快速入门](https://nacos.io/zh-cn/docs/quick-start.html)，下载 Nacos Server 并启动服务。

# 配置管理

<span data-type="color" style="color:rgb(38, 38, 38)"><span data-type="background" style="background-color:rgb(255, 255, 255)">完整示例代码</span></span>：[nacos-spring-cloud-config-example](https://github.com/nacos-group/nacos-demo/nacos-spring-cloud-config-demo)

## 依赖

```
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
    <version>${latest.version}</version>
</dependency>
```

## 示例

<span data-type="color" style="color:rgb(38, 38, 38)"><span data-type="background" style="background-color:rgb(255, 255, 255)">在 </span></span>`bootstrap.properties`<span data-type="color" style="color:rgb(38, 38, 38)"><span data-type="background" style="background-color:rgb(255, 255, 255)"> 中配置 Nacos Server 的地址：</span></span>

```
spring.cloud.nacos.config.server-addr=127.0.0.1:8848
```

在 `application.properties` 配置：

```
spring.application.name=example
```

在 Nacos Spring Cloud 中，Nacos 配置管理的 `dataId` 的拼接格式如下

```plain
${prefix}-${spring.profile.active}.${file-extension}
```

* `prefix` 默认为 `spring.application.name` 的值，也可以通过配置项 `spring.cloud.nacos.config.prefix`来配置。
* `spring.profile.active` 即为当前环境对应的 profile，详情可以参考 [Spring Boot文档](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-profiles.html#boot-features-profiles)
    __注意，当 __`spring.profile.active`<strong> 为空时，对应的连接符 </strong><strong><code>-</code></strong><strong> 也将不存在，dataId 的拼接格式变成 </strong><strong><code>${prefix}</code></strong><strong>.</strong><strong><code>${file-extension}</code></strong>
* `file-exetension` 为配置内容的数据格式，可以通过配置项 `spring.cloud.nacos.config.file-extension` 来配置。目前只支持 `properties` 类型。


通过 Spring Cloud 原生注解 `@RefreshScope` 实现配置自动更新：

```
@RestController
@RequestMapping("/config")
@RefreshScope
public class ConfigController {

    @Value("${useLocalCache:false}")
    private boolean useLocalCache;

    @RequestMapping("/get")
    public boolean get() {
        return useLocalCache;
    }
}
```

## 运行

首先通过调用 [Nacos Open API](https://nacos.io/zh-cn/docs/open-API.html) 向 Nacos Server 发布配置：dataId 为`example.properties`，内容为`useLocalCache=true`

```
curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=example.properties&group=DEFAULT_GROUP&content=useLocalCache=true"
```

运行 `NacosConfigApplication`，调用 `curl http://localhost:8080/config/get`，返回内容是 `true`。

再次调用 [Nacos Open API](https://nacos.io/zh-cn/docs/open-API.html) 向 Nacos Server 发布配置：dataId 为`example.properties`，内容为`useLocalCache=false`

```
curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=example.properties&group=DEFAULT_GROUP&content=useLocalCache=false"
```

再次访问 `http://localhost:8080/config/get`，此时返回内容为`false`，说明程序中的`useLocalCache`值已经被动态更新了。

# 服务发现

完整示例代码：[nacos-spring-cloud-discovery-example](https://github.com/nacos-group/nacos-demo/nacos-spring-cloud-discovery-demo)

## 依赖

```
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    <version>${latest.version}</version>
</dependency>
```

## 示例

#### 服务提供者

在 `application.properties` 中配置 Nacos Server 的地址：

```
server.port=8070
spring.application.name=service-provider

spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
```

通过 Spring Cloud 原生注解 `@EnableDiscoveryClient` 开启服务注册发现功能：

```
@SpringBootApplication
@EnableDiscoveryClient
public class NacosProviderApplication {

	public static void main(String[] args) {
		SpringApplication.run(NacosProviderApplication.class, args);
	}

	@RestController
	class EchoController {
		@RequestMapping(value = "/echo/{string}", method = RequestMethod.GET)
		public String echo(@PathVariable String string) {
			return "Hello Nacos Discovery " + string;
		}
	}
}
```

#### 服务消费者

在 `application.properties` 中配置 Nacos Server 的地址：

```
server.port=8080
spring.application.name=service-consumer

spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
```

通过 Spring Cloud 原生注解 `@EnableDiscoveryClient`  开启服务注册发现功能，给 [RestTemplate](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-resttemplate.html) 实例添加  `@LoadBalanced` 注解，开启 `@LoadBalanced` 与 [Ribbon](https://cloud.spring.io/spring-cloud-netflix/multi/multi_spring-cloud-ribbon.html) 的集成：

```
@SpringBootApplication
@EnableDiscoveryClient
public class NacosConsumerApplication {

    @LoadBalanced
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    public static void main(String[] args) {
        SpringApplication.run(NacosConsumerApplication.class, args);
    }

    @RestController
    public class TestController {

        private final RestTemplate restTemplate;

        @Autowired
        public TestController(RestTemplate restTemplate) {this.restTemplate = restTemplate;}

        @RequestMapping(value = "/echo/{str}", method = RequestMethod.GET)
        public String echo(@PathVariable String str) {
            return restTemplate.getForObject("http://service-provider/echo/" + str, String.class);
        }
    }
}
```

## 运行

启动 `ProviderApplication` 和 `ConsumerApplication` ，调用 `http://localhost:8080/echo/2018`，返回内容为 `Hello Nacos Discovery 2018`。

# 更多

* [Nacos](https://github.com/alibaba/nacos)
* [Nacos Spring](https://github.com/nacos-group/nacos-spring-project)
* [Nacos Spring Boot](https://github.com/nacos-group/nacos-spring-boot-project)
* [Spring Cloud](https://github.com/spring-cloud-incubator/spring-cloud-alibaba) [Alibaba](https://github.com/spring-cloud-incubator/spring-cloud-alibaba)

