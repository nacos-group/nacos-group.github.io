---
title: Quick Start for Nacos Spring Cloud Projects
keywords: [Nacos,Spring Cloud]
description: Quick Start for Nacos Spring Cloud Projects
---

# Quick Start for Nacos Spring Cloud Projects

This quick start introduces how to enable Nacos configuration management and service discovery features for your Spring Cloud project.

For more details about Nacos Spring Cloud: [Nacos Config](https://github.com/spring-cloud-incubator/spring-cloud-alibaba/blob/master/spring-cloud-alibaba-docs/src/main/asciidoc/nacos-config.adoc) and [Nacos Discovery](https://github.com/spring-cloud-incubator/spring-cloud-alibaba/blob/master/spring-cloud-alibaba-docs/src/main/asciidoc/nacos-discovery.adoc).

The quick start includes two samples:

* How to enable dynamic configuration updates with Nacos server and spring-cloud-starter-alibaba-nacos-config;
* How to enable service registration and discovery with Nacos server and spring-cloud-starter-alibaba-nacos-discovery.

## Prerequisite

Follow instructions in [Nacos Quick Start](https://nacos.io/en/docs/v1/quickstart/quick-start/) to download Nacos and start the Nacos server.

## Enable Configuration Service

Once you start the Nacos server, you can follow the steps below to enable the Nacos configuration management service for your Spring Cloud project. 

Sample project: [nacos-spring-cloud-config-example](https://github.com/nacos-group/nacos-examples/tree/master/nacos-spring-cloud-example/nacos-spring-cloud-config-example)

1. Add the Nacos Spring Cloud dependency.

```
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
    <version>${latest.version}</version>
</dependency>
```

**Note**: Version [2.1.x.RELEASE](https://mvnrepository.com/artifact/com.alibaba.cloud/spring-cloud-starter-alibaba-nacos-config) is compatible with the Spring Boot 2.1.x line. Version [2.0.x.RELEASE](https://mvnrepository.com/artifact/com.alibaba.cloud/spring-cloud-starter-alibaba-nacos-config) is compatible with the Spring Boot 2.0.x line. Version [1.5.x.RELEASE](https://mvnrepository.com/artifact/com.alibaba.cloud/spring-cloud-starter-alibaba-nacos-config) is compatible with the Spring Boot 1.5.x line.

2. Configure the Nacos Server address and Specify the application name in `bootstrap.properties` :

```
spring.cloud.nacos.config.server-addr=127.0.0.1:8848

spring.application.name=example
```

**Note**: The value of `spring.application.name` will be used to construct part of the dataId in Nacos configuration management.

In Nacos Spring Cloud, the format of `dataId` is as follows:

```plain
${prefix}-${spring.profiles.active}.${file-extension}
```

* The value of `prefix` is the value of `spring.application.name` by default. You can also configure this value in `spring.cloud.nacos.config.prefix`.
* `spring.profiles.active` is the profile of the current environment. For more details, refer to [Spring Boot Document](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-profiles.html#boot-features-profiles).
    **Note: When the value of `spring.profiles.active` is empty, the corresponding hyphen `-` will be deleted, and the format of dataId becomes: `${prefix}.${file-extension}`**
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


5. Call [Nacos Open API](https://nacos.io/docs/latest/open-api/) to publish a configuration to the Nacos server. Assume the dataId is `example.properties`，and the content is `useLocalCache=true`.

```
curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=example.properties&group=DEFAULT_GROUP&content=useLocalCache=true"
```

6. Run `NacosConfigApplication`and call  `curl http://localhost:8080/config/get`，You will get a returned value of `true`.

7. Call [Nacos Open API](https://nacos.io/docs/latest/open-api/) again to publish an updated configuration to the Nacos server. Assume the dataId is`example.properties`，and the content is `useLocalCache=false`.

```
curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=example.properties&group=DEFAULT_GROUP&content=useLocalCache=false"
```

8. Access `http://localhost:8080/config/get`again and the returned value became `false`，indicating that the value of `useLocalCache`in your application has been updated.

## Enable Service Discovery

Now you would also like to enable the service discovery feature of Nacos in your Spring Cloud project. 

Sample project: [nacos-spring-cloud-discovery-example](https://github.com/nacos-group/nacos-examples/tree/master/nacos-spring-cloud-example/nacos-spring-cloud-discovery-example)

1. Add the Nacos Spring Cloud dependency.

```
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    <version>${latest.version}</version>
</dependency>
```

**Note**: Version [2.1.x.RELEASE](https://mvnrepository.com/artifact/com.alibaba.cloud/spring-cloud-starter-alibaba-nacos-discovery) is compatible with the Spring Boot 2.1.x line. Version [2.0.x.RELEASE](https://mvnrepository.com/artifact/com.alibaba.cloud/spring-cloud-starter-alibaba-nacos-discovery) is compatible with the Spring Boot 2.0.x line. Version [1.5.x.RELEASE](https://mvnrepository.com/artifact/com.alibaba.cloud/spring-cloud-starter-alibaba-nacos-discovery) is compatible with the Spring Boot 1.5.x line.

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

ii. Add the Spring Cloud native annotation of `@EnableDiscoveryClient`  to enable service discovery. Add the `@LoadBalanced` annotation for the [RestTemplate](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-resttemplate.html) instance,  and enable the integration of `@LoadBalanced` and [Ribbon](https://cloud.spring.io/spring-cloud-netflix/multi/multi_spring-cloud-ribbon.html):

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
* [Spring Cloud Alibaba](https://github.com/alibaba/spring-cloud-alibaba)
