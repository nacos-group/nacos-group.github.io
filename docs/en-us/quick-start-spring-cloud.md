<span data-type="color" style="color:rgb(38, 38, 38)"><span data-type="background" style="background-color:rgb(255, 255, 255)">This quick start introduces how to enable Nacos configuration management and service discovery features for your Spring Cloud project.</span></span>

<span data-type="color" style="color:rgb(38, 38, 38)"><span data-type="background" style="background-color:rgb(255, 255, 255)">The quick start includes two samples:</span></span>

* How to enable dynamic configuration updates with Nacos server and spring-cloud-starter-alibaba-nacos-config;
* How to enable <span data-type="color" style="color:rgb(38, 38, 38)"><span data-type="background" style="background-color:rgb(255, 255, 255)">service registration and discovery with </span></span>Nacos server and spring-cloud-starter-alibaba-nacos-discovery.

## Prerequisite

<span data-type="color" style="color:rgb(38, 38, 38)"><span data-type="background" style="background-color:rgb(255, 255, 255)">Follow instructions in </span></span>[Nacos Quick Start](https://nacos.io/zh-cn/docs/quick-start.html)<span data-type="color" style="color:rgb(38, 38, 38)"><span data-type="background" style="background-color:rgb(255, 255, 255)"> to download Nacos and start the Nacos server.</span></span>

## Enable Configuration Service

<span data-type="color" style="color:rgb(38, 38, 38)"><span data-type="background" style="background-color:rgb(255, 255, 255)">Once you start the Nacos server, you can follow the steps below to enable the Nacos configuration management service for your Spring Cloud project. </span></span>

Sample project: [nacos-spring-cloud-config-example](https://github.com/nacos-group/nacos-examples/tree/master/nacos-spring-cloud-example/nacos-spring-cloud-config-example)

1. <span data-type="color" style="color:rgb(38, 38, 38)"><span data-type="background" style="background-color:rgb(255, 255, 255)">Add the Nacos Spring Cloud dependency.</span></span>

```
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
    <version>${latest.version}</version>
</dependency>
```

2. <span data-type="color" style="color:rgb(38, 38, 38)"><span data-type="background" style="background-color:rgb(255, 255, 255)">Configure the Nacos Server address and </span></span>Specify the application name <span data-type="color" style="color:rgb(38, 38, 38)"><span data-type="background" style="background-color:rgb(255, 255, 255)">in </span></span>`bootstrap.properties`<span data-type="color" style="color:rgb(38, 38, 38)"><span data-type="background" style="background-color:rgb(255, 255, 255)"> </span></span>:

```
spring.cloud.nacos.config.server-addr=127.0.0.1:8848

spring.application.name=example
```

__Note: __The value of__ __`spring.application.name` will be used to construct part of the dataId in Nacos configuration management.

In Nacos Spring Cloud, the format of `dataId` is as follows:

```plain
${prefix}-${spring.profile.active}.${file-extension}
```

* The value of `prefix` is the value of `spring.application.name` by default. You can also configure this value in `spring.cloud.nacos.config.prefix`.
* `spring.profile.active` is the profile of the current environment. For more details, refer to [Spring Boot Document](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-profiles.html#boot-features-profiles).
    __Note: When the value of __`spring.profile.active`<strong> is empty, the corresponding hyphen </strong><strong><code>-</code></strong><strong> will be deleted, and the format of dataId becomes: </strong><strong><code>${prefix}</code></strong><strong>.</strong><strong><code>${file-extension}</code></strong>
* `file-exetension` is the data format of the configuration content, and can be configured in `spring.cloud.nacos.config.file-extension` . Currently only the `properties` and `yaml` type is supported.

4. Add the native `@RefreshScope` annotation of Spring Cloud to enable autorefresh of configuration updates:

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


5. Call [Nacos Open API](https://nacos.io/zh-cn/docs/open-API.html) to publish a configuration to the Nacos server. Assume the dataId is `example.properties`，and the content is `useLocalCache=true`.

```
curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=example.properties&group=DEFAULT_GROUP&content=useLocalCache=true"
```

6. Run `NacosConfigApplication`and call  `curl http://localhost:8080/config/get`，You will get a returned value of `true`.

7. Call [Nacos Open API](https://nacos.io/zh-cn/docs/open-API.html) again to publish an updated configuration to the Nacos server. Assume the dataId is`example.properties`，and the content is `useLocalCache=false`.

```
curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=example.properties&group=DEFAULT_GROUP&content=useLocalCache=false"
```

8. Access `http://localhost:8080/config/get`again and the returned value became `false`，indicating that the value of `useLocalCache`in your application has been updated.

## Enable Service Discovery

<span data-type="color" style="color:rgb(38, 38, 38)"><span data-type="background" style="background-color:rgb(255, 255, 255)">Now you would also like to enable the service discovery feature of Nacos in your Spring Cloud project. </span></span>

Sample project: [nacos-spring-cloud-discovery-example](https://github.com/nacos-group/nacos-examples/tree/master/nacos-spring-cloud-example/nacos-spring-cloud-discovery-example)

1. <span data-type="color" style="color:rgb(38, 38, 38)"><span data-type="background" style="background-color:rgb(255, 255, 255)">Add the Nacos Spring Cloud dependency.</span></span>

```
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    <version>${latest.version}</version>
</dependency>
```

2. Configure the service provider, so that it can register its services to the Nacos server.

 i. Add the Nacos server address in `application.properties` :

```
server.port=8070
spring.application.name=service-provider

spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
```

ii. Enable service discovery by adding the Spring Cloud native annotation of `@EnableDiscoveryClient`:

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


3. Configure the service consumer so that it can discover the services that it would like to call on the Nacos server.

i. Configure the Nacos server address in `application.properties` :

```
server.port=8080
spring.application.name=service-consumer

spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
```

ii. Add the Spring Cloud native annotation of `@EnableDiscoveryClient`  to enable service dicovery. Add the `@LoadBalanced` annotation for the [RestTemplate](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-resttemplate.html) instance,  and enable the integration of `@LoadBalanced` and [Ribbon](https://cloud.spring.io/spring-cloud-netflix/multi/multi_spring-cloud-ribbon.html):

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


4. Start `ProviderApplication` and `ConsumerApplication` , and call `http://localhost:8080/echo/2018`. You will get a returned message of `Hello Nacos Discovery 2018`.

## Related Projects

* [Nacos](https://github.com/alibaba/nacos)
* [Nacos Spring](https://github.com/nacos-group/nacos-spring-project)
* [Nacos Spring Boot](https://github.com/nacos-group/nacos-spring-boot-project)
* [Spring Cloud](https://github.com/spring-cloud-incubator/spring-cloud-alibaba) [Alibaba](https://github.com/spring-cloud-incubator/spring-cloud-alibaba)

