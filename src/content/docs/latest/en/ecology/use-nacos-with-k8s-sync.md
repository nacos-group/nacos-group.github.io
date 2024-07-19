---
title: Nacos Supports Synchronizing Service Metadata from K8S Service Discovery
keywords: [Nacos, k8s, Kubernetes, service metadata, synchronization]
description: Nacos now integrates with Kubernetes (K8S) service discovery, enabling automatic synchronization of service metadata. This feature monitors dynamic changes in services and instances within K8S, ensuring timely updates to the Nacos service discovery module, compatible with K8S version 1.22 and above. It facilitates a two-way data flow with specific configurations, streamlining microservices architecture management.
---

# Nacos Supports Synchronization of Service Metadata from K8S Service Discovery

## Data Synchronization
Nacos listens for changes in services and instances within K8S, acquiring their service metadata, and synchronizing update information to the Nacos service discovery module and instances. It supports K8S version 1.22 (corresponding to the K8S-Java-API version 14.0.0). An illustrative diagram is as follows:
![K8S Sync Illustration](img/k8s-sync.jpg)

The mapping scheme for synchronizing K8S resources to Nacos resources (unidirectional, with supplementation for Nacos resource synchronization to K8S resources pending):

|K8S Data to be Synchronized| K8S Field| Mapped to Nacos Field|
|---|---|---|
|Service Name| service.metadata.name| service.name|
|Pod Target Port(s)| service.ports.targetPort| instance.port|
|Service Name| service.metadata.name| instance.cluster|
|Service Port(s)| service.ports.port| instance.extendData<String, Object>|
|Pod IP| pod.status.hostIP or service.ipFamilies| instance.ip|

## Configuration
Follow the [Deployment Documentation](../guide/admin/deployment.md) to set up the Nacos cluster.

Modify the application.properties file to enable K8S synchronization:
```properties
nacos.k8s.sync.enabled=true
```

For applications outside the K8S cluster using the Java API, specify the kubeConfig:
```properties
nacos.k8s.sync.outsideCluster=true
nacos.k8s.sync.kubeConfig=/.kube/config
```

Upon configuration, changes in services and instances within K8S will automatically synchronize to Nacos.