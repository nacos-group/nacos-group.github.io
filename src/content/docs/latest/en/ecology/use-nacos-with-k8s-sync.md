---
title: Nacos supports synchronizing metadata from K8S service discovery
keywords: [Nacos,k8s,kubernetes]
description: Nacos supports synchronizing metadata from K8S service discovery
---

# Nacos supports synchronizing metadata from K8S service discovery

## Data synchronization
Nacos monitors the changes of services and instances in K8S, obtains its service metadata, and synchronizes the change information to Nacos' service discovery. Supports K8S version 1.22 (corresponding to K8S-Java-API version 14.0.0).The diagram is as follow:
![](img/k8s-sync.jpg)

Mapping scheme of K8S resource synchronization to Nacos resource (single-direction, Nacos resource synchronization to K8S resource to be supplemented) :

K8S Data to be synchronized|Field in K8S|Field mapped to Nacos
---|---|---
service name|service.metadata.name|service.name
service targetPort(pod port)(multiple)|service.ports.targetPort|instance.port
service name|service.metadata.name|instance.cluster
service port(multiple)|service.ports.port|instance.extendData<String, Object>
pod ip|pod.status.hostIP / service.ipFamilies|instance.ip

## Configuration file
Deploy the Nacos cluster according to [the deploy document](../guide/admin/deployment.md)

Configure the application.properties file to enable K8S synchronization:
```
nacos.k8s.sync.enabled=true
```

If you are using the Java API from an application outside the K8S cluster, you need to specify kubeConfig:
```
nacos.k8s.sync.outsideCluster=true
nacos.k8s.sync.kubeConfig=/.kube/config
```

After configuration, services and instance changes in K8S are automatically synchronized to Nacos.
