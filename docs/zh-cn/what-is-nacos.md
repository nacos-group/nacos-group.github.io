# What is Nacos


## Overview

Welcome to Nacos! 

Nacos is all things about discovery, config and manage your micro-services. Nacos provides users with an easy-to-use feature set for dynamic service discovery, service configuration management, service provisioning and management. 

Nacos help users to build, deliver and manage their micro-services platform more agile and easier.

Nacos is an infrastructure when build modern service centric application by using micro-services or cloud-native approaches.

## What is Nacos?

Service is a first-class citizen in Nacos. Nacos support almost all type of services, for example: Kubernetes service, gRPC/Dubbo service or RESTFul service.

The key features of Consul are:

* **Service Discovery And Service Health Check**

Nacos supports both DNS-based and RPC-based (eg Dubbo/gRPC) service discovery, producer can register a service with [native sdk]() or [openAPI]() or with [a dedicated agent](), consumer can discovery this service with either DNS or HTTP.

Nacos also provide real-time health checks of services to prevent sending requests to unhealthy hosts, Nacos support multi-level health check, for example, 4-layer (tcp) or 7-layer(http, redis, mysql), with complex network topology, Nacos support both agent mode or server mode health check. Nacos also provide a unity service health dashboard when use with Kubernetes or spring cloud.

* **Dynamic Configuration Management**


Dynamic Configuration Service allows you to manage the configuration of all applications or services in a centralized and dynamic manner in all environments. 

Dynamic configuration eliminates the need to redeploy applications and services when configuring updates. 

It can be more convenient to help you achieve stateless services and more easily achieve on-demand elastic expansion of service instances.

Naocs provide an easy-to-use UI to help you management all of your configurations and provide 
some out-of-box features such as config version track, gray release and rollback, client push status tracking etc.

* **Dynamic DNS Service**

Dynamic DNS services that support weighted routing make it easier for you to implement mid-tier load balancing, flexible routing policies, flow control, and simple DNS resolution services in your production environment within your data center, helping you to more easily implement DNS-based Service discovery.


* **Service and MetaData Management**

Service management support manages all services and their metadata from the perspective of the microservices platform. This includes the service description file, life cycle, static data center topology, service health status, traffic, routing and security rules, SLA, and first line Metrics et al.


you can more Nacos features with [features list]()


## Nacos and Other Open Sources ecology

[ͼƬ]


As the above Nacos landscape shows, Nacos seamless support many open source platform,
such as Dubbo, Spring Cloud, kubernetes and service mesh.

With Nacos, you can take advantage of various aspects of Nacos' capabilities to simplify solutions in service discovery, configuration management more easilier to manage microservices on these platforms.

for more information, you can check with following:

* [use Nacos with Kubernetes]()
* [use Nacos with Dubbo]()
* [use Nacos with Spring Cloud]()
* [using Nacos with service mesh]()


## Basic Architecture and Concepts



* **Naming Service/Service Registry**
* **Configuration**  define aa
* **Service MetaData**  define aa
* **Producer**  define aa
* **Consumer**   define aa
* ...


## What's next

Continue onwards with [the getting started guide] () to get Consul up and running.