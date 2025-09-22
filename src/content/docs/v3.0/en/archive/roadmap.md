---
title: Nacos roadmap
keywords: [Nacos,roadmap]
description: Nacos roadmap
---

# Nacos roadmap

We plan to make Nacos available for production from Nacos 0.8.0. Prior to this release, we recommend that you use it only in development and test environments.
Our current plan is to strive to make Nacos production ready in the 6-8 months. The plan might be adjusted due to various factors, including the priority adjustment according to the voice of the community, but the overall plan is that it should not take longer than one year.

Below are the main roadmaps and plans for the next year.

## Nacos 1.0

Main goals:

* Build a simple and easy to use, service related set of tools, including the service discovery, configuration management, service metadata storage, push, consistency and metadata management etc;

* Seamless integration with and support for open-source ecosystems including [Spring Cloud](https://github.com/alibaba/spring-cloud-alibaba)、[Kubernetes](https://github.com/kubernetes/kubernetes)、[Dubbo](https://github.com/apache/dubbo) etc., while at the same time developing a variety of excellent features for large-scale production.

The following is a rough version plan:

* 0.1 Basic Nacos server and simple OpenAPI and Java SDK;
* 0.2 - 0.3 Seamless support for Kubernetes, Service Mesh and Spring Cloud service discovery and configuration management;
* 0.4 - 0.5 Build an easy-to-use Web UI/User Console;
* 0.6 - 0.7 High availability, ease of use, monitoring and alert etc;
* 0.8 Production ready;
* 0.9 Large scale performance tuning and benchmark;
* 1.0 GA for large scale production.

## Nacos 2.0

Mainly focus on the unified service management, service sharing and service management system of the open service platform construction, mainly includes two aspects:

* Dubbo 4.0 + Nacos 2.0: An Open-Service Platform

![Screen Shot 2018-07-11 at 22.32.17.png | left](https://cdn.yuque.com/lark/0/2018/png/15914/1531319724777-d19b0304-535c-4af9-bee1-f358b6e55d91.png "")

* Kubernetes + Spring Cloud: Unified Service Management

![Screen Shot 2018-07-11 at 22.35.30.png | left](https://cdn.yuque.com/lark/0/2018/png/15914/1531319755930-0040e67e-ca05-47b9-9cd0-07ffd7452eae.png "")