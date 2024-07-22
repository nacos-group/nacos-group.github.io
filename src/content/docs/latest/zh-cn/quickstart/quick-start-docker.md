---
title: Nacos Docker 快速开始
keywords: [Nacos,Docker]
description: Nacos Docker 快速开始
sidebar:
    order: 2
---

# Nacos Docker 快速开始

这个快速开始手册是帮忙您快速在通过Nacos的Docker镜像，在Docker容器中部署并使用 Nacos。

## 1. 环境准备

使用此快速开始方法进行Nacos安装及部署，需要安装[Docker](https://www.docker.com/)和[Docker Compose](https://docs.docker.com/compose/)。

## 2. 下载 nacos-docker 项目

```powershell
git clone https://github.com/nacos-group/nacos-docker.git
cd nacos-docker
```

## 3. 执行 docker-compose 命令启动Nacos

> 首次执行命令时，会自动下载所需的相关Docker镜像，需要等待的时长取决于网络速度。您也可以提前下载好相关镜像，以缩短执行部署命令的等待时间。

```powershell
docker-compose -f example/standalone-derby.yaml up
```

## 4. 验证Nacos服务是否启动成功

通过`docker logs -f $container_id`命令，查看Nacos服务启动日志，如果看到如下日志，说明服务启动成功。

```
Nacos started successfully in xxxx mode. use xxxx storage
```

可以通过下列服务，快速检验Nacos的功能。

### 4.1. 服务注册

  ```powershell
  curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.10&port=8080'
  ```

### 4.2. 服务发现

    ```powershell
    curl -X GET 'http://127.0.0.1:8848/nacos/v1/ns/instance/list?serviceName=nacos.naming.serviceName'
    ```

### 4.3. 发布配置

  ```powershell
  curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test&content=helloWorld"
  ```

### 4.4. 获取配置

  ```powershell
    curl -X GET "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test"
  ```

### 4.5. Nacos控制台页面

  link：http://127.0.0.1:8848/nacos/

## Nacos + Grafana + Prometheus
参考：[Nacos监控指南](../guide/admin/monitor-guide.md)

**Note**:  grafana创建一个新数据源时，数据源地址必须是 **http://prometheus:9090**

## 相关项目

* [Nacos](https://github.com/alibaba/nacos)
* [Nacos Docker](https://github.com/nacos-group/nacos-docker)
