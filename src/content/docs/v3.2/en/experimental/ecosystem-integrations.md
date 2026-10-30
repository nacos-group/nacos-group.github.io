---
title: Kubernetes Ecosystem Experimental Capabilities
keywords: [Nacos, Experimental Features, Kubernetes Sync, Nacos Controller]
description: Understand the experimental boundary of Nacos Kubernetes ecosystem sync capabilities.
sidebar:
    order: 3
---

# Kubernetes Ecosystem Experimental Capabilities

The Nacos ecosystem includes several sync and controller capabilities for Kubernetes. They are usually used to validate integration between Kubernetes service discovery and Nacos service discovery.

:::caution
This page treats these capabilities as experimental features or ecosystem experimental capabilities. They may depend on specific versions, external components, or community maintenance rhythm. Their APIs, configuration, and maintenance location may change. If community feedback is limited, some capabilities may later be moved to `nacos-group` ecosystem repositories for separate maintenance.
:::

NacosSync and the Prometheus Service Discovery helper are long-standing ecosystem capabilities. They are not treated as experimental features. For NacosSync, read the [NacosSync User Manual](../ecology/use-nacos-sync.md). For the Prometheus Service Discovery helper, read the [Monitoring Manual](../manual/admin/monitor.md) and [Nacos With Prometheus Service Discovery](../ecology/use-nacos-prometheus-sd.md).

## Kubernetes service sync

Kubernetes service sync listens to changes in Kubernetes resources such as Services and Pods, then syncs service and instance information into Nacos service discovery.

The current document mainly describes one-way sync. It is suitable for validating integration between Kubernetes service discovery and Nacos service discovery. Before production use, confirm the Kubernetes version, sync direction, conflict handling, and failure recovery strategy.

Read: [Nacos Supports Syncing Service Metadata From Kubernetes Service Discovery](../ecology/use-nacos-with-k8s-sync.md)

## Nacos Controller service sync

Nacos Controller can be used for integration between Kubernetes and Nacos service discovery. It is suitable for validating service sync and controller mode in Kubernetes environments.

Before production use, confirm the controller version, permission scope, sync direction, and rollback plan.

Read: [Use Nacos Controller To Sync Service](../ecology/use-nacos-controller-to-sync-service.md)

## Suggestions

- Define the sync direction, authoritative data source, and conflict handling rules first.
- Verify on a small set of services before syncing large production services.
- Configure monitoring and alerts for sync tasks to avoid unnoticed data drift.
- Before upgrading Nacos or external systems, validate sync behavior in a test environment.
