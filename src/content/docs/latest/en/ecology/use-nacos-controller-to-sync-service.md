---
title: Use Nacos Controller to Sync Kubernetes Services to Nacos
keywords: [Nacos Controller, User Guide]
description: Nacos Controller User Guide
sidebar:
    order: 10
---

# Use Nacos Controller to Sync Kubernetes Services to Nacos

## Overview

Nacos Controller supports bidirectional synchronization of Kubernetes configurations and synchronization of Kubernetes services to Nacos. This document describes how to use Nacos Controller to sync Kubernetes services to Nacos.

## Prerequisites

*   Install [kubectl](https://kubernetes.io/docs/tasks/tools/) and [helm](https://helm.sh/docs/intro/install/).
    

## Deploy Custom Resources

```shell
# Clone the repository
git clone https://github.com/nacos-group/nacos-controller.git
cd nacos-controller/charts/nacos-controller
# Export the Kubernetes cluster configuration file path
export KUBECONFIG=/path/to/your/kubeconfig/file
# Create the namespace for CRD installation
kubectl create ns nacos
# Install the CRD
helm install -n nacos nacos-controller .
```

After installation succeeds, run `kubectl get crd | grep nacos` to check the result. The following output indicates that the CRDs are installed correctly:

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Pd6l2Z7XEAxGMl7M/img/ea77285e-8fc2-4ea3-b89f-064c8844f693.png)

## Create a Secret

Create a Secret for Nacos authentication, including the Nacos username and password. If you use MSE Nacos with authentication enabled, you must also configure the access key and secret key. **Note: parameter values must be base64-encoded.**
* Create a Secret configuration file.

  ```yaml
  apiVersion: v1
  kind: Secret
  metadata:
      name: nacos-auth
  data:
      accessKey: <base64 ak>
      secretKey: <base64 sk>
      username: <base64 your-nacos-username>
      password: <base64 your-nacos-password>
  ```
* Create the Secret.
  ```shell
  kubectl apply -f secret.yaml -n nacoskubectl 
  ```

## Create ServiceDiscovery
* Create a ServiceDiscovery configuration file.
  ```yaml
  apiVersion: nacos.io/v1
  kind: ServiceDiscovery
  metadata:
    name: sd-demo
  spec:
    nacosServer:
        # serverAddr: Nacos address
        serverAddr: <nacos-addr>
        # namespace: namespace ID used to sync Kubernetes services to Nacos
        namespace: <nacos-namespace-id>
        # authRef: Secret that contains Nacos client credentials (username/password or AK/SK). It can be omitted if authentication is disabled on the Nacos server.
        authRef:
          apiVersion: v1
          kind: Secret
          name: nacos-auth
    # Service list to sync. Omit this field to sync all services.
    services: ["my-nginx", "test1"]
  ```
* Create ServiceDiscovery.
  ```yaml
  kubectl apply -f sd.yaml -n nacos
  ```

## Create a Deployment

* Create a Deployment configuration file. The following example uses nginx.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 2
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80
```
```yaml
kubectl apply -f nginx-deployment.yaml -n nacos
```

## Create a Service

* Create a YAML file.
  ```yaml
  apiVersion: v1
  kind: Service
  metadata:
    name: my-nginx
    labels:
      run: my-nginx
  spec:
    ports:
    - port: 80
      protocol: TCP
    selector:
      app: nginx-test
  ```

* Deploy the Service.
    
  ```shell
  kubectl apply -f nginx-service.yaml -n nacos
  ```

* View the Service endpoint.
  ```shell
  kubectl describe svc my-nginx -n nacos
  ```
  ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Pd6l2Z7XEAxGMl7M/img/b3c62ce8-e7e2-4672-bcf5-885c45b92678.png)

## View the Synchronization Result
  ```shell
  curl "$NACOS_ADDR/nacos/v3/admin/ns/instance/list?serviceName=my-nginx' -H "userName:$USER_NAME" -H "password:$PASSWORD"
  ```
  ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Pd6l2Z7XEAxGMl7M/img/94a01669-a7a8-4120-b875-f6cbd259625c.png)
