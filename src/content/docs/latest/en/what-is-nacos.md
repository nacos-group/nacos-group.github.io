---
title: Nacos Configuration Center Introduction, What is Nacos
keywords: [Nacos, service discovery, configuration management, microservices, cloud-native, dynamic DNS, ecosystem]
description: An introduction to the Nacos Configuration Center, explaining what Nacos is and its role in microservices architecture.
---
# What is Nacos?

> Documentation under optimization...

## Overview

Welcome to the world of Nacos!

Nacos, pronounced `/nɑ:kəʊs/`, stands for Dynamic Naming and Configuration Service, a platform simplifying the construction of cloud-native applications with dynamic service discovery, configuration management, and service governance capabilities.

Nacos aims to facilitate the discovery, configuration, and management of microservices. It offers a set of easy-to-use features that enable rapid implementation of dynamic service discovery, service configuration, metadata management, and traffic control.

Nacos empowers you to build, deliver, and manage microservice platforms more agilely and effortlessly. It serves as a service infrastructure for modern application architectures centered around "services," such as microservices and cloud-native paradigms.

## What is Nacos?
In the Nacos realm, services are first-class citizens. Nacos supports the discovery, configuration, and management of virtually all mainstream service types:

- [Kubernetes Service](https://kubernetes.io/docs/concepts/services-networking/service/)
- [gRPC](https://grpc.io/docs/guides/concepts.html#service-definition) & [Dubbo RPC Service](https://dubbo.apache.org)
- [Spring Cloud RESTful Service](https://spring.io/projects/spring-cloud)

Key Nacos features include:

- **Service Discovery and Health Monitoring**

  Nacos supports service discovery via DNS and RPC. After providers register services using the native SDK, OpenAPI, or an independent Agent, consumers can locate and discover services through DNS or HTTP & API.

  Real-time health checks by Nacos prevent requests from being sent to unhealthy hosts or service instances. It supports transport layer (PING or TCP) and application layer (e.g., HTTP, MySQL, user-defined) health checks. For complex cloud environments and network topologies like VPCs and edge networks, Nacos provides agent reporting and server-side active detection modes for health checks. A unified dashboard for health status helps manage service availability and traffic.

- **Dynamic Configuration Service**

  This allows centralized, externalized, and dynamic management of all environment application and service configurations.

  Dynamic configurations eliminate the need to redeploy applications and services upon configuration changes, enhancing configuration management efficiency and agility.

  Centralized configuration management simplifies stateless service implementation and facilitates elastic scaling.

  Nacos provides a straightforward UI ([Control Panel Demo](http://console.nacos.io/nacos/index.html)) for managing all service and application configurations. It also includes out-of-the-box features such as version tracking, Canary releases, one-click rollback, and client update status tracking for safer production environment configuration changes.

- **Dynamic DNS Service**

  Supports weighted routing, facilitating middle-tier load balancing, flexible routing strategies, traffic control, and simple DNS resolution within data centers. It also eases DNS-based service discovery to mitigate vendor lock-in risks.

  Nacos offers simple [DNS APIs](./ecology/use-nacos-with-coredns.md) for managing service-associated domains and available IP:PORT lists.

- **Service and Metadata Management**

  Nacos lets you manage all services and metadata in your data center from a microservices platform perspective, including descriptions, lifecycles, static dependency analysis, health statuses, traffic management, routing policies, security strategies, SLAs, and crucial metrics statistics.

## Nacos Map
A comprehensive visual guide to Nacos, with detailed architecture, business scenarios, ecosystem integration, advantages, and strategic benefits outlined below.

## Nacos Ecosystem Map

![Nacos Landscape](https://cdn.nlark.com/lark/0/2018/png/11189/1533045871534-e64b8031-008c-4dfc-b6e8-12a597a003fb.png)

As depicted in the Nacos全景图, Nacos seamlessly integrates with leading open-source ecosystems, including:

- [Spring Cloud](./ecology/use-nacos-with-spring-cloud.md)
- [Apache Dubbo and Dubbo Mesh](./ecology/use-nacos-with-dubbo.md)
- [Kubernetes and CNCF](./quickstart/quick-start-kubernetes.md)

Nacos streamlines service discovery, configuration management, service governance, and administration, making microservice discovery, management, sharing, and composition more accessible.

For guides on using Nacos within these ecosystems, refer to:

- [Using Nacos with Spring Cloud](./ecology/use-nacos-with-spring-cloud.md)
- [Using Nacos with Kubernetes](./quickstart/quick-start-kubernetes.md)
- [Using Nacos with Dubbo](./ecology/use-nacos-with-dubbo.md)

## Next Steps

Continue reading the [Quick Start](./quickstart/quick-start.md) guide to get started with Nacos swiftly.