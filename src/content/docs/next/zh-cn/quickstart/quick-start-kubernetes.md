---
title: Nacos Kubernetes 快速开始
keywords: [nacos,kubernetes]
description: 本项目包含一个可构建的Nacos Docker Image，旨在利用 StatefulSets 在 Kubernetes上部署 Nacos。
sidebar:
    order: 3
---

# Nacos Kubernetes 快速开始

这个快速开始手册是帮忙您快速在通过Nacos的Docker镜像，在Kubernetes中部署并使用 Nacos。

## 1. 环境准备

使用此快速开始方法进行Nacos安装及部署，需要安装[Kubernetes](https://kubernetes.io/)。

## 2. 下载 nacos-k8s 项目

```shell
git clone https://github.com/nacos-group/nacos-k8s.git
cd nacos-k8s
```

## 3. 快速启动

> 使用此方式快速启动,请注意这是没有使用持久化卷的,可能存在数据丢失风险:

```shell
cd nacos-k8s
chmod +x quick-startup.sh
./quick-startup.sh
```

## 4. 验证Nacos服务是否启动成功

通过`kubectl logs -f $pod_name`命令，查看Nacos服务启动日志，如果看到如下日志，说明服务启动成功。

```
Nacos started successfully in xxxx mode. use xxxx storage
```

可以通过下列服务，快速检验Nacos的功能。

### 4.1. 服务注册

  ```powershell
  curl -X POST 'http://${cluster-ip}:8848/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.10&port=8080'
  ```

### 4.2. 服务发现

    ```powershell
    curl -X GET 'http://${cluster-ip}:8848/nacos/v1/ns/instance/list?serviceName=nacos.naming.serviceName'
    ```

### 4.3. 发布配置

  ```powershell
  curl -X POST "http://${cluster-ip}:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test&content=helloWorld"
  ```

### 4.4. 获取配置

  ```powershell
    curl -X GET "http://${cluster-ip}:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test"
  ```

### 4.5. Nacos控制台页面

link：http://${cluster-ip}:8848/nacos/

## 相关项目

* [Nacos](https://github.com/alibaba/nacos)
* [Nacos Docker](https://github.com/nacos-group/nacos-k8s)