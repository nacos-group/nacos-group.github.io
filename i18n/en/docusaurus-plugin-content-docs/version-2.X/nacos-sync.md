---
title: NacosSync introduce
keywords: [NacosSync,introduce]
description: NacosSync introduce
---

# NacosSync introduce

## Introduce
* NacosSync is a support for a variety of registry of synchronous components,based on the Spring boot development framework,Data layer uses the Spring Data JPA,follow the standard JPA access codes,support for multiple data storage,Default to Hibernate implementation, support table created automatically update more conveniently.
* Using efficient event driven asynchronous model, support a variety of custom events, make the synchronization task processing time delay control in 3s, 8C16G stand-alone can support 6 k synchronization tasks.
* NacosSync in addition to the standalone deployment, but also provides high availability cluster deployment patterns, NacosSync is stateless design, such as task status data migration to the database, the cluster expansion is very convenient.
* Abstraction is out of Sync core component interface, through annotations to distinguish synchronous type, allowing developers to easily according to their own needs, different registry to expand, has now supports synchronous type:
  * Nacos to Nacos data synchronization
  * Zookeeper to Nacos data synchronization
  * Nacos to the Zookeeper data synchronization 
  * Eureka to Nacos data synchronization
  * Consul to Nacos data synchronization
<a name="d384971e"></a>
## System module architecture:
![image.png](https://img.alicdn.com/tfs/TB12VPaJVzqK1RjSZSgXXcpAVXa-886-752.png)<br />The console<br />Provides concise Web console operation, support for internationalization.<br />
<a name="b3408d06"></a>
### Synchronization task management page
![](https://img.alicdn.com/tfs/TB1eSYyJ5LaK1RjSZFxXXamPFXa-2866-1064.png)
<a name="091bc34b"></a>
### Registry management page
<a name="53fdb015"></a>
## ![image.png](https://img.alicdn.com/tfs/TB1e_rdJ7voK1RjSZFNXXcxMVXa-2876-1124.png)
<a name="f6a633db"></a>
## Usage scenarios:
* Multiple network communication between the Region of Shared services, break the service call restriction of the Region.

![image.png](https://img.alicdn.com/tfs/TB1Mo6yJ4jaK1RjSZKzXXXVwXXa-1136-798.png)

* Two-way synchronization function, support Dubbo + Zookeeper service smooth migration to Dubbo + Naocs, enjoy Nacos more high quality service.

![image.png](https://img.alicdn.com/tfs/TB1Dza8J9zqK1RjSZPxXXc4tVXa-1728-838.png)