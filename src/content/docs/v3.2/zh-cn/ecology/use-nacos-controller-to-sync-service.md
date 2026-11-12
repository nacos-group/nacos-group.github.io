---
title: 使用Nacos Controller同步k8s服务到Nacos
keywords: [Nacos Controller,使用手册]
description: Nacos Controller 使用手册
sidebar:
    order: 10
---

# 使用Nacos Controller同步k8s服务到Nacos

## 概述

Nacos Controller支持k8s配置双向同步及服务同步到Nacos。本文讲述如何使用Nacos Controller同步k8s服务到Nacos。

## 前置条件

* 安装[kubectl](https://kubernetes.io/zh-cn/docs/tasks/tools/)、[helm](https://helm.sh/zh/docs/intro/install/)
    

## 部署自定义资源

```shell
#克隆仓库
git clone https://github.com/nacos-group/nacos-controller.git
cd nacos-controller/charts/nacos-controller
#导出k8s集群配置文件路径
export KUBECONFIG=/path/to/your/kubeconfig/file
# 创建CRD安装的命名空间
kubectl create ns nacos
# 安装CRD
helm install -n nacos nacos-controller .
```

安装成功后，使用"kubectl get crd  | grep nacos" 检查结果，如下结果表示正常：

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Pd6l2Z7XEAxGMl7M/img/ea77285e-8fc2-4ea3-b89f-064c8844f693.png)

## 创建Secret

创建Nacos鉴权使用的Secret，包括Nacos用户名、密码。如果使用了MSE Nacos，并且开启了鉴权，还需要配置AK、SK。**注意：参数值为base64编码之后的值。**
* 创建secret配置文件

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
* 创建secret
  ```shell
  kubectl apply -f secret.yaml -n nacoskubectl 
  ```

## 创建ServiceDiscovery
* 创建ServiceDiscovery配置文件
  ```yaml
  apiVersion: nacos.io/v1
  kind: ServiceDiscovery
  metadata:
    name: sd-demo
  spec:
    nacosServer:
        # serverAddr: Nacos地址
        serverAddr: <nacos-addr>
        # namespace: 需要把k8s服务同步到Nacos的命名空间Id
        namespace: <nacos-namespace-id>
        # authRef: 包含 Nacos 客户端认证凭据的 Secret（支持用户名/密码或 AK/SK；如果 Nacos 服务器认证已禁用则可省略
        authRef:
          apiVersion: v1
          kind: Secret
          name: nacos-auth
    # 需要同步的服务列表，如果需要同步全量服务则可忽略
    services: ["my-nginx"，"test1"]
  ```
* 创建 Service Discovery
  ```yaml
  kubectl apply -f sd.yaml -n nacos
  ```

## 创建Deployment

* 以nginx为例创建deployment配置文件

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

## 创建Service

* 创建yaml文件
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

* 部署Service
    
  ```shell
  kubectl apply -f nginx-service.yaml -n nacos
  ```

* 查看Service endpoint
  ```shell
  kubectl describe svc my-nginx -n nacos
  ```
  ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Pd6l2Z7XEAxGMl7M/img/b3c62ce8-e7e2-4672-bcf5-885c45b92678.png)

## 查看同步结果
  ```shell
  curl "$NACOS_ADDR/nacos/v3/admin/ns/instance/list?serviceName=my-nginx' -H "userName:$USER_NAME" -H "password:$PASSWORD"
  ```
  ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Pd6l2Z7XEAxGMl7M/img/94a01669-a7a8-4120-b875-f6cbd259625c.png)