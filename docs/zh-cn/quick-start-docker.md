---
title: Nacos Docker 快速开始
keywords: Nacos,Docker
description: Nacos Docker 快速开始
---

# Nacos Docker 快速开始

## 操作步骤

* Clone 项目

  ```powershell
  git clone https://github.com/nacos-group/nacos-docker.git
  cd nacos-docker
  ```


* 单机模式

  ```powershell
  docker-compose -f example/standalone.yaml up
  ```

* 集群模式

  ```powershell
  docker-compose -f example/cluster-hostname.yaml up 
  ```

* 服务注册

  ```powershell
  curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.10&port=8080'
  ```
  
* 服务发现

    ```powershell
    curl -X GET 'http://127.0.0.1:8848/nacos/v1/ns/instances?serviceName=nacos.naming.serviceName'
    ```
    
* 发布配置

  ```powershell
  curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test&content=helloWorld"
  ```
  
* 获取配置

  ```powershell
    curl -X GET "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test"
  ```
* Nacos 控制台

  link：http://127.0.0.1:8848/nacos/

## 相关项目

* [Nacos](https://github.com/alibaba/nacos)
* [Nacos Docker](https://github.com/nacos-group/nacos-docker)

