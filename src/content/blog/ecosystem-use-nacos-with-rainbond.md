---
title: 在 Rainbond 中一键安装高可用 Nacos 集群
keywords: [nacos, kubernetes, rainbond, 云原生]
description: 当前文档描述如何通过云原生应用管理平台 Rainbond 一键安装高可用 Nacos 集群。
date: "2022-03-16"
category: ecosystem
---

# Rainbond Nacos

当前文档描述如何通过云原生应用管理平台 [Rainbond](https://www.rainbond.com/?channel=nacos) 一键安装高可用 [Nacos](https://nacos.io) 集群。这种方式适合不太了解 Kubernetes、容器化等复杂技术的用户使用，降低了在 Kubernetes 中部署 Nacos 的门槛。

# 背景信息

## Rainbond 与 Nacos 的结合

[Rainbond](https://www.rainbond.com/?channel=nacos) 是一款易于使用的开源云原生应用管理平台。借助于它，用户可以在图形化界面中完成微服务的部署与运维。借助 Kubernetes 和容器化技术的能力，将故障自愈、弹性伸缩等自动化运维能力赋能给用户的业务。

Rainbond 内置原生 Service Mesh 微服务框架，同时与 Spring Cloud、Dubbo 等其他微服务框架也有很好的整合体验。故而大量的 Rainbond 用户也可能是 Nacos 微服务注册中心的用户。这类用户不必再关心如何部署 Nacos 集群，Rainbond 团队将 Nacos 制作成为可以一键部署的应用模版，供开源用户免费下载安装。这种安装方式极大的降低了用户使用 Nacos 集群的部署负担，目前支持 1.4.2 与 2.0.4 版本。


## 关于应用模版

应用模版是面向 Rainbond 云原生应用管理平台的安装包，用户可以基于它一键安装业务系统到自己的 Rainbond 中去。无论这个业务系统多么复杂，应用模版都会将其抽象成为一个应用，裹挟着应用内所有组件的镜像、配置信息以及所有组件之间的关联关系一并安装起来。

# 前提条件

- 部署好的 Rainbond 云原生应用管理平台，[快速体验版本](https://www.rainbond.com/docs/quick-start/quick-install/?channel=nacos) 可以在个人 PC 环境中以启动一个容器的代价运行。

- 互联网连接。

# 快速开始

* **访问内置的开源应用商店**

> 选择左侧的 **应用市场** 标签页，在页面中切换到 **开源应用商店** 标签页，搜索关键词 **nacos** 即可找到 Nacos-cluster 应用。

![nacos-1](https://static.goodrain.com/wechat/nacos-cluster/nacos-cluster-1.png)

* **一键安装**

> 点击 Nacos-cluster 右侧的 **安装** 可以进入安装页面，填写简单的信息之后，点击 **确定** 即可开始安装，页面自动跳转到拓扑视图。

![nacos-2](https://static.goodrain.com/wechat/nacos-cluster/nacos-cluster-2.png)

参数说明：

| 选择项  | 说明                                |
| ---- | --------------------------------- |
| 团队名称 | 用户自建的工作空间，以命名空间隔离                 |
| 集群名称 | 选择 Nacos 被部署到哪一个 K8s 集群           |
| 选择应用 | 选择 Nacos 被部署到哪一个应用，应用中包含有若干有关联的组件 |
| 应用版本 | 选择 Nacos 的版本，目前可选版本为 1.4.2、2.0.4  |

等待几分钟后，Nacos 集群就会安装完成，并运行起来。

![nacos-3](https://static.goodrain.com/wechat/nacos-cluster/nacos-cluster-3.png)

* **测试**

需要执行服务注册的其他微服务组件，可以在建立面向 Nacos 的[依赖关系](https://www.rainbond.com/docs/use-manual/user-manual/component-connection/regist_and_discover)后，使用 `${NACOS_HOST}:${NACOS_PORT}` 来连接到 Nacos 集群。

* **服务注册**
  
  ```bash
  curl -X PUT "http://${NACOS_HOST}:${NACOS_PORT}/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.10&port=8080"
  ```

* **服务发现**
  
  ```bash
  curl -X GET "http://${NACOS_HOST}:${NACOS_PORT}/nacos/v1/ns/instance/list?serviceName=nacos.naming.serviceName"
  ```

* **发布配置**
  
  ```bash
  curl -X POST "http://${NACOS_HOST}:${NACOS_PORT}/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test&content=helloWorld"
  ```

* **获取配置**
  
  ```bash
  curl -X GET "http://${NACOS_HOST}:${NACOS_PORT}/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test"
  ```

# 高级特性

- 一键安装而来的 Nacos 集群中包含 3 个实例，并且通过初始化插件自动完成自组集群并选举的操作。

![nacos-4](https://static.goodrain.com/wechat/nacos-cluster/nacos-cluster-4.png)

- 默认集成了 Mysql 作为数据源。在 **Nacos-server-2.0.4** 组件的环境配置中配置如下环境变量，可以切换到其他外部数据源。

| 名称                       | 必要  | 描述     |
| ------------------------ | --- | ------ |
| `MYSQL_SERVICE_HOST`     | Y   | 数据库地址  |
| `MYSQL_SERVICE_PORT`     | Y   | 数据库端口  |
| `MYSQL_SERVICE_USER`     | Y   | 数据库用户名 |
| `MYSQL_SERVICE_PASSWORD` | Y   | 数据库密码  |
| `MYSQL_SERVICE_DB_NAME`  | Y   | 数据库名   |

- 默认生成了 **Nacos-server-2.0.4** 的数据持久化目录。

![nacos-5](https://static.goodrain.com/wechat/nacos-cluster/nacos-cluster-5.png)

- 默认配置了 **Nacos-server-2.0.4** 的健康检查机制，保障实例故障时自动下线，恢复后自动上线。

![nacos-6](https://static.goodrain.com/wechat/nacos-cluster/nacos-cluster-6.png)
