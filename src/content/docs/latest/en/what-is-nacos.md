---
title: Nacos Configuration Center profile
keywords: [nacos]
description: What is Nacos
---

# What is Nacos

> Document optimizing...

## Overview

Welcome to Nacos!

Nacos `/nɑ:kəʊs/`  is the acronym for 'Dynamic Naming and Configuration Service'，an easy-to-use dynamic service discovery, configuration and service management platform for building cloud native applications。

Nacos is committed to help you discover, configure, and manage your microservices. It provides a set of simple and useful features enabling you to realize dynamic service discovery, service configuration, service metadata and traffic management.

Nacos makes it easier and faster to construct, deliver and manage your microservices platform. It is the infrastructure that supports a service-centered modern application architecture with a microservices or cloud-native approach.

## What is Nacos？

Service is a first-class citizen in Nacos. Nacos supports discovering, configuring, and managing almost all types of services:

[Kubernetes Service](https://kubernetes.io/docs/concepts/services-networking/service/)

[gRPC](https://grpc.io/docs/guides/concepts.html#service-definition) & [Dubbo RPC Service](https://dubbo.apache.org)

[Spring Cloud RESTful Service](https://spring.io/projects/spring-cloud)

Key features of Nacos:

* **Service Discovery And Service Health Check**

    Nacos supports both DNS-based and RPC-based (Dubbo/gRPC) service discovery. After a service provider registers a service with [native](./guide/user/sdk.md), [OpenAPI](./guide/user/open-api.md), or [a dedicated agent](./guide/user/other-language.md), a consumer can discover the service with either [DNS_TODO](./what-is-nacos.md) or [HTTP](./guide/user/open-api.md).

    Nacos provides real-time health check to prevent services from sending requests to unhealthy hosts or service instances. Nacos supports both transport layer (PING or TCP) health check and application layer (such as HTTP, Redis, MySQL, and user-defined protocol) health check. For the health check of complex clouds and network topologies(such as VPC, Edge Service etc), Nacos provides both agent mode and server mode health check. Nacos also provide a unity service health dashboard to help you manage the availability and traffic of services.

* **Dynamic configuration management**

    Dynamic configuration service allows you to manage the configuration of all applications and services in a centralized, externalized and dynamic manner across all environments.

    Dynamic configuration eliminates the need to redeploy applications and services when configurations are updated.

    Centralized management of configuration makes it more convenient for you to achieve stateless services and elastic expansion of service instances on-demand.

    Nacos provides an easy-to-use UI ([DEMO](http://console.nacos.io/nacos/index.html)) to help you manage all of your application or services's configurations. It provides some out-of-box features including configuration version tracking, canary/beta release, configuration rollback, and client configuration update status tracking to ensure the safety and control the risk of configuration change.

* **Dynamic DNS service**

    Dynamic DNS service which supports weighted routing makes it easier for you to implement mid-tier load balancing, flexible routing policies, traffic control, and simple DNS resolution services in your production environment within your data center. Dynamic DNS service makes it easier for you to implement DNS-based Service discovery.

    Nacos provides some simple [DNS APIs TODO](./what-is-nacos.md) for you to manage your DNS domain names and IPs.

* **Service governance and metadata management**

    Nacos allows you to manage all of your services and metadata from the perspective of a microservices platform builder. This includes managing service description, life cycle, service static dependencies analysis, service health status, service traffic management，routing and security rules, service SLA, and first line metrics.

## Nacos Map
A picture to understand Nacos, the following structure will be described in detail.

// TODO this picture need to translate.

![nacos_map](/img/nacosMap.jpg)

- Large picture of characteristics: To introduce the characteristics of the problem domain we want to solve from the functional characteristics and non-functional characteristics.
- Larger architecture: Get a quick entry into the Nacos world with a clear architecture
- Business picture: Business scenarios that can be supported with current features, and best practices
- Big picture of the ecology: systematically sorting out the relationship between Nacos and mainstream technology ecology
- Big picture of advantage: showcase Nacos core competitiveness
- Strategic picture: Nacos's macro advantage from strategic to tactical level


## Nacos landscape

![nacos_landscape.png](https://cdn.nlark.com/lark/0/2018/png/11189/1533045871534-e64b8031-008c-4dfc-b6e8-12a597a003fb.png)

As the figure above shows, Nacos seamlessly supports open source ecologies including

* [Spring Cloud](./ecology/use-nacos-with-spring-cloud.md)
* [Apache Dubbo and Dubbo Mesh](./ecology/use-nacos-with-dubbo.md)
* [Kubernetes and CNCF](./quickstart/quick-start-kubernetes.md)

Use Nacos to simplify your solutions in service discovery, configuration management, and service governance and management. With Nacos, microservices management in open source system is easy.

For more information about how to use Nacos with other open source projects, see the following:

[Use Nacos with Spring Cloud](./ecology/use-nacos-with-spring-cloud.md)

[Use Nacos with Kubernetes](./quickstart/quick-start-kubernetes.md)

[Use Nacos with Dubbo](./ecology/use-nacos-with-dubbo.md)

## What’s next

Continue with [quick start](./quickstart/quick-start.md) to get started with Nacos.
