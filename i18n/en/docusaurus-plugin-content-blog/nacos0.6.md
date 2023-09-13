---
title: Nacos 0.6版本发布，支持Dubbo生态并且支持Docker部署
keywords: [nacos0.6,dubbo,docker]
description: Nacos 0.6版本发布，支持Dubbo生态并且支持Docker部署
---

# Nacos Released version 0.6, supports Dubbo and Docker
> Authors: 马昕曦、张龙、邢学超

<span data-type="color" style="color:rgb(38, 38, 38)"><span data-type="background" style="background-color:rgb(255, 255, 255)"> Alibaba Microservices Open Source Project</span></span>[Dubbo Nacos](https://github.com/alibaba/nacos)<span data-type="color" style="color:rgb(38, 38 , 38)"><span data-type="background" style="background-color:rgb(255, 255, 255)">released this week </span></span>__v0.6__<span data- Type="color" style="color:rgb(38, 38, 38)"><span data-type="background" style="background-color:rgb(255, 255, 255)"> </span> </span> version, which mainly supports Dubbo's service registration and discovery and configuration management, supports docker deployment, provides an official docker image, optimizes the international framework of Nacos console, and optimizes Nacos's integration testing efficiency.



![image.png | left | 747x290](https://cdn.nlark.com/lark/0/2018/png/11189/1544689744102-fd00fec6-ca80-4c0c-9b0d-538f17279963.png "")


## Thousands of calls come out, Dubbo's registration center and configuration center

__Nacos__ Starting with the __v0.6__ version, the __Dubbo__ registration center and configuration center are supported. Also, as Alibaba's open source weight-level product, the two products are inextricably linked within the internal Alibaba Group.
### Dubbo Service Framework
As the rpc service framework, on the one hand, it pays attention to the extremely short delay rt, which ensures that the overall call is efficient, and on the other hand, guarantees a good user experience, ensuring user comfort and good scalability. Dubbo is very good in both aspects, and is widely used in the industry because of its good expansion. The popularity and popularity of Dubbo is evident through the 2w+ github warehouse star attention.
### Nacos and Dubbo are the same genes
But there is such an efficient rpc service framework under Alibaba's technology system, but what is supporting Alibaba's huge service cluster? It is well known that Alibaba Group has a terrible cluster size. Every year, Alibaba Group's Tmall Double 11 Global Shopping Carnival will have a rid of the chin trading scale. In 2018, the Double 11 will carry 213.5 billion in sales. But as a technician, the biggest concern is the peak. If careful practitioners should see an indicator, in 2018 Tmall carried a peak of transaction creation of 491,000 pens per second. For example, Beijing Bird's Nest Stadium has a maximum carrying capacity of 91,000 people, and 49.1w transactions per second, which means that the full audience of the five Bird's Nest stadiums pushes the shopping cart and simultaneously clears the settlement of Tmall Taobao in one second. Taiwan, this pressure can be imagined. But behind the hosting of such a large-scale service cluster, and Alibaba Dubbo's internal use framework HSF, corresponding to ConfigServer, and this is one of Nacos' predecessors. The 0.6 version released by Nacos is the perfect integration with Dubbo. It also announces that Alibaba's experience in large-scale clusters will be shared with Nacos, Dubbo, Sentinel and other contributions to the open source community.



![image.png | left | 747x413](https://cdn.nlark.com/lark/0/2018/png/11189/1544696219150-b786e8fe-af7d-4e29-9c32-03b051c6db3d.png "")


### Dubbo Fusion Nacos
Nacos is an important registry infrastructure in the Dubbo ecosystem, with [dubbo-registry-nacos](https://github.com/dubbo/dubbo-registry-nacos) being the bridge for Dubbo's Fusion Nacos registry, based on Dubbo Powerful [Registry SPI](http://dubbo.apache.org/en-us/docs/dev/impls/registry.html) and Nacos Naming services provide real-time service registration and discovery. Currently [dubbo-registry-nacos](https://github.com/dubbo/dubbo-registry-nacos) is in the preview stage, the latest release is `0.0.2`, the latest Dubbo and Dubbo OPS have been tested, recommended Developers use the latest Dubbo `2.6.5` and Nacos `0.6.1` to ensure the best experience. If you are currently using ZooKeeper or Redis as your registry, the migration to Nacos is also very simple, with Zookeeper as an example:

* Scene 1: Externalization configuration

Pre-adjustment configuration:

```properties
## Zookeeper registry address
Dubbo.registry.address = zookeeper://127.0.0.1:2181
```

Adjusted configuration:

```properties
## Nacos registry address
Dubbo.registry.address = nacos://127.0.0.1:8848
```

* Scenario 2: XML configuration driver

Pre-adjustment configuration:

```xml
<!-- Use Zookeeper Registration Center -->
<dubbo:registry address="zookeeper://127.0.0.1:2181" />
```

Adjusted configuration:

```xml
<!-- Use Nacos Registration Center -->
<dubbo:registry address="nacos://127.0.0.1:8848" />
```

Once the adjustment is complete, make sure the Nacos Server is up and restart your Dubbo app, then you will see the registration information in the Nacos console Service List:


[image-20181213174408269-4694248.png | left | 747x132](https://cdn.nlark.com/lark/0/2018/png/11189/1544694815618-d316c463-701a-4095-a7d4-30bb0ec941b6.png "" )


If you are interested in integrating Dubbo and Nacos, you may wish to visit the project homepage for more details at:

* Dubbo Nacos Registry: [https://github.com/dubbo/dubbo-registry-nacos](https://github.com/dubbo/dubbo-registry-nacos)
* Apache Dubbo: [https://github.com/apache/incubator-dubbo](https://github.com/apache/incubator-dubbo)

If you encounter any problems and have any suggestions during the process, please visit [https://github.com/dubbo/dubbo-registry-nacos/issues](https://github.com/dubbo/dubbo -registry-nacos/issues) for discussion.

## Containers are popular, Nacos supports Docker containerization
Today, when containers are popular, support for containerization has become a necessity, and Docker has chosen as the container for most people. Nacos announced in v0.6.
Support for Docker deployments, and provide an official image, and will support k8s deployment in the next few releases.


![image.png | left | 747x285](https://cdn.nlark.com/lark/0/2018/png/11189/1544696801216-88a41d17-d101-4546-acfd-0aba38c6fa81.png "")

### How to deploy via Docker
Local needs to make sure that Docker has been followed. If it is not installed, please refer to [https://docs.docker.com/install/](https://docs.docker.com/install/). After installation, you can quickly pull the image from the remote and pick up a stand-alone version of Nacos to experience it.
Simple and rude, run the following command:
```plain
Docker run --name nacos-standalone -e MODE=standalone -p 8848:8848 nacos/nacos-server:latest
```

The operation test is as follows:


![Peek 2018-12-13 11-43.gif | left | 747x407](https://cdn.nlark.com/lark/0/2018/gif/11189/1544701054438-de9785c4-b9ab-46dc-a162-d22e1419a172.gif "")


Another application, [docker-compose](https://docs.docker.com/compose/) orchestration, you can refer to the following command:
1. git clone the project and go to the project root directory

```powershell
Git clone https://github.com/nacos-group/nacos-docker.git
Cd nacos-docker
```

2. Start

* Stand-alone start

```powershell
Docker-compose -f example/standalone.yaml up
```

* Cluster boot

```powershell
Docker-compose -f example/cluster-hostname.yaml up
```

At this point your Nacos is up and you can experience the Nacos feature by visiting [http://localhost:8848/nacos/index.html](http://localhost:8848/nacos/index.html).
#### Configuration Management Function Experience


![Peek 2018-12-11 10-11.gif | left | 747x351](https://cdn.nlark.com/lark/0/2018/gif/11189/1544496461571-69f38431-6452-4ddd-8211-c2da28f2ebcf.gif "")


#### Service Discovery Feature Experience


![Peek 2018-12-11 11-11.gif | left | 747x351](https://cdn.nlark.com/lark/0/2018/gif/11189/1544521437636-674de542-1873-426b-a2dd-da8265bc267f.gif "")


## The booming Nacos community

> DISS is cheap, show me your hand
> More important than the spit is to take the handle and participate in the community to develop Nacos

* Follow the user as a user and join the Nacos community

The Nacos community is booming. As of the date of publication, Nacos has five WeChat groups in just a few months, four of which are full, one QQ group, one nail group, and nearly 3,000 people who care about Nacos. In the Nacos group, we will learn from the "Tao (base) friends", exchange experiences, recruit friends, grab red envelopes... and enjoy it.

To join the Nacos WeChat community, you can use the WeChat QR code of __“超哥”__ below to let __“超哥”__ help you pull in “Nacos Community WeChat Exchange Group”



![Screen Shot 2018-06-27 at 13.39.09.png | left](https://cdn.yuque.com/lark/0/2018/png/15914/1530077965587-8f4e3100-bdd4-469a-9ea0-7af7061bc9ef.png "")

* Join the Nacos community as a code contributor

From the development of Nacos users to contributors, and the Nacos development team is indeed growing, from the beginning of only four code contributions to the current 24, with __Alibaba__ other team members such as __@小马哥__, __虎牙直播____@张波__ __@周健__ Team et al, [nacos-docker-k8s](https://github.com/nacos-group /nacos-docker) Contributors __@张龙__, the main contributors to the front end are hungry __@王彦民__, the founder of Spring Cloud Chinese community __@许进__ etc. The power of the Nacos community will grow stronger in the future.




The community is also planning to add a team introduction page to Nacos's official website [nacos.io](http://nacos.io) at the right time, and everyone will be officially announced. Welcome everyone to join the Nacos community and contribute to the community. . In the words of Apache, __"Community is higher than the code"!__



![屏幕快照 2018-11-20 17.04.45.png | left](https://cdn.nlark.com/lark/0/2018/png/15914/1542704700864-a9d54856-9bf6-4176-b449-c13fa02c5800.png "")


## Newcomer Moments - "What is Nacos?"
> I don't know what Nacos is? It doesn't matter, star on the github and say hello to the program brothers!!

[Nacos](https://github.com/alibaba/nacos) is Alibaba's new open source project in July. Nacos's main vision is to provide easy-to-use `Dynamic Service Discovery`, `Service Configuration Management`, The infrastructure of "Service Sharing and Management" helps users better build, deliver and manage their own microservices platforms in the cloud's native era.




![Screen Shot 2018-07-24 at 19.27.28.png | left](https://cdn.nlark.com/lark/0/2018/png/15914/1532436633419-08a42307-7fb7-4d51-9062-fecc3868613b.png "")


Github project address is [here](https://github.com/alibaba/nacos)

## More open source project information related to Nacos

* [Nacos](https://github.com/alibaba/nacos)
* [Dubbo Registry Nacos](https://github.com/dubbo/dubbo-registry-nacos)
* [Nacos DNS-F](https://github.com/nacos-group/nacos-coredns-plugin)
* [Nacos Docker](https://github.com/nacos-group/nacos-docker)
* [Nacos Spring Project](https://github.com/nacos-group/nacos-spring-project)
* [Nacos Spring Boot](https://github.com/nacos-group/nacos-spring-boot-project)
* [Spring Cloud Alibaba](https://github.com/spring-cloud-incubator/spring-cloud-alibaba)
* [Dubbo](http://dubbo.io)
* [Sentinel](https://github.com/alibaba/Sentinel)
* [Spring Cloud](https://projects.spring.io/spring-cloud/)
* [Nepxion Discovery](https://github.com/Nepxion/Discovery)
* [Spring Cloud Gateway Nacos](https://github.com/SpringCloud/spring-cloud-gateway-nacos)