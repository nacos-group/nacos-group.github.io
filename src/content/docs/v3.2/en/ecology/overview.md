---
title: Ecology Overview
keywords: [Nacos, Ecology, Spring, Dubbo, Kubernetes, Prometheus, MCP]
description: Understand the scenario categories, reading entry points, and usage suggestions for Nacos ecology documents.
sidebar:
    order: 0
---

# Ecology Overview

Nacos ecology documents explain how Nacos works with application frameworks, cloud-native infrastructure, migration and sync tools, monitoring systems, and AI toolchains.

If you only want to understand Nacos core capabilities, start with [Overview](../overview.md), [Configuration Overview](../manual/user/config/overview.md), [Service Discovery Overview](../manual/user/naming/overview.md), and [AI Registry Overview](../manual/user/ai/ai-registry-overview.md). Ecology documents are more useful after you know which integration scenario you need.

## Choose by scenario

| Scenario | Read |
| --- | --- |
| Java microservice integration | [Nacos With Dubbo](./use-nacos-with-dubbo.md), [Spring](./use-nacos-with-spring.md), [Spring Boot](./use-nacos-with-spring-boot.md), [Spring Cloud](./use-nacos-with-spring-cloud.md) |
| Cloud-native infrastructure | [CoreDNS](./use-nacos-with-coredns.md), [Istio](./use-nacos-with-istio.md) |
| Kubernetes service sync | [Kubernetes service discovery sync](./use-nacos-with-k8s-sync.md), [Nacos Controller service sync](./use-nacos-controller-to-sync-service.md) |
| Registry migration and sync | [NacosSync User Manual](./use-nacos-sync.md) |
| Prometheus application target discovery | [Use Nacos For Prometheus Service Discovery](./use-nacos-prometheus-sd.md) |
| AI toolchain integration | [Nacos MCP Router](./use-nacos-mcp-router.md) |

## Relationship with core capabilities

Ecology capabilities usually build around Nacos core capabilities:

- Application frameworks use Nacos mainly for configuration management and service discovery.
- Kubernetes, CoreDNS, and Istio integrations use service discovery or sync service discovery information to other systems.
- NacosSync is used for registry migration and multi-registry sync.
- Prometheus service discovery lets Prometheus obtain business application targets from Nacos.
- AI ecosystem components such as MCP Router focus on tool invocation and service discovery for AI applications.

These documents involve external projects, framework versions, and deployment environments. Before using them, also read the official documents of the external projects and verify version compatibility in a test environment.

## Ecology capability status

The Ecology section includes long-standing integration documents and ecosystem capabilities that are still evolving. Some Kubernetes-related sync and controller capabilities may change their APIs, configuration, and maintenance model. When using them, also read [Experimental Features Overview](../experimental/overview.md).
